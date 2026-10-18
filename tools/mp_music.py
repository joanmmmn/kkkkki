#!/usr/bin/env python3
"""Música de «Las mejores plataformas de audiolibros en español»: piezas ya compuestas para el canal (ElevenLabs Music),
recolocadas en los bloques de este vídeo, sin gastar créditos.

- Las 12 piezas de la reseña de Nextory (re mayor, ~104 BPM: la identidad de la serie de reseñas), en video/public/music/parts.
- Siete de la guía de Stephen King (re menor, más cinematográficas: música de caja, piano, cuerdas), en video/public/music/skg_parts,
  para los bloques que piden otro carácter: Spotify, Audiobooks.com, LibriVox y El Libro Total, los trucos y el cierre.

Cada pieza entra donde empieza su bloque (en un separador, 6 fotogramas antes de la escena; si no, en el corte) y se cruza con la
anterior como en las reseñas (la saliente se filtra y se apaga en 0,7 + 0,9 s; la entrante sube en 0,6 s). Si una pieza se queda
corta, se alarga repitiendo cuatro compases de su parte central con un fundido. La última se toma desde el final (su cierre).

Uso: python3 tools/mp_music.py   → escribe video/public/music/mp_bed.mp3
"""
import os, subprocess, sys
import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
import mp_meta  # noqa: E402

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
OUT = os.path.join(ROOT, 'video/public/music')
SR = 44100
FPS = mp_meta.FPS

# (carpeta, pieza, primera escena del bloque, BPM de la pieza, «desde el final»)
BLOCKS = [
    ('parts', 'a_hook', 'Z01', 104, False),          # arranque
    ('parts', 'b_que', 'Z02', 104, False),           # las cuatro formas de pagar
    ('parts', 'd1_app', 'Z03', 104, False),          # Audible (tema principal)
    ('parts', 'd2_leer', 'Z05', 104, False),         # Storytel: leer y escuchar (piano)
    ('parts', 'c_precios', 'Z07', 104, False),       # Podimo (funk de precios)
    ('parts', 'e1_funciones', 'Z08', 104, False),    # Nextory y sus horas
    ('parts', 'e2_dispositivos', 'Z10', 104, False), # BookBeat (marimba)
    ('skg_parts', 'h_voces', 'Z11', 96, False),      # Spotify: pop luminoso
    ('skg_parts', 'd_mapa', 'Z12', 104, False),      # Audiobooks.com: descubrimiento
    ('parts', 'f1_pros', 'Z14', 104, False),         # ElevenReader
    ('parts', 'h1_prueba', 'Z15', 104, False),       # eBiblio
    ('skg_parts', 'c_bio', 'Z17', 96, False),        # LibriVox y El Libro Total: caja de música y piano
    ('skg_parts', 'g_conex', 'Z19', 96, False),      # trucos 1 y 2: intriga
    ('skg_parts', 'e2_puertas', 'Z21', 96, False),   # trucos 3, 4 y 5: impulso
    ('parts', 'g_veredicto', 'Z24', 104, False),     # veredicto
    ('skg_parts', 'i_rutas', 'Z25', 96, True),       # sin pagar nada y cierre: el final de la pieza
]


def load(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 's16le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32).reshape(-1, 2) / 32768


def _db(x, a, b):
    seg = x[a:b]
    return 20 * np.log10(np.sqrt(np.mean(seg ** 2)) + 1e-9) if len(seg) else -120


def lead_trim(x, need_s):
    """Salta el silencio inicial y, si la pieza arranca floja, hasta que coge fuerza (como en las reseñas)."""
    win = round(0.05 * SR)
    k0 = next((k for k in range(0, len(x) - win, win) if _db(x, k, k + win) > -35), 0)
    w4 = round(0.4 * SR)
    need = round(need_s * SR)
    typical = np.median([_db(x, k, k + w4) for k in range(k0, max(k0 + w4 + 1, min(len(x), k0 + need) - w4), w4)])
    k = k0
    while k < k0 + round(6 * SR) and _db(x, k, k + round(1.5 * SR)) < typical - 8:
        k += round(0.1 * SR)
    return k


def extend(x, need, bpm):
    """Alarga la pieza repitiendo 4 compases de su parte central (fundido de 0,5 s en cada empalme)."""
    if len(x) >= need:
        return x
    bar = 4 * 60 / bpm
    a = round(4 * bar * SR)
    loop = x[a:a + round(4 * bar * SR)]
    fade = round(0.5 * SR)
    out = x.copy()
    while len(out) < need:
        r = np.linspace(0, 1, fade)[:, None]
        out = np.concatenate([out[:-fade], out[-fade:] * (1 - r) + loop[:fade] * r, loop[fade:]])
    return out


def leveled(folder, name):
    lev = os.path.join(OUT, folder, f'{name}.mp3')
    if not os.path.exists(lev):
        subprocess.run(['python3', os.path.join(ROOT, 'tools/music_level.py'), os.path.join(OUT, folder, f'{name}.raw.mp3'),
                        os.path.join(OUT, folder, f'{name}.plan.json'), lev], check=True)
    return lev


def main():
    from scipy.signal import butter, sosfiltfilt
    scenes, total, _ = mp_meta.review_scenes()
    if any(not mp_meta.vo(s['id']) for s in scenes):
        sys.exit('Falta la locución: los tiempos aún son estimados.')
    at = {s['id']: s['at'] for s in scenes}
    bumps = {s['id'] for s in scenes if s.get('bump')}
    start = lambda sid: at[sid] - (6 if sid in bumps else 0)
    OUT_PRE, OUT_POST, IN_PRE, IN_LEN = 0.7, 0.9, 0.3, 0.6
    sos = butter(4, 900, 'low', fs=SR, output='sos')
    n = round(total / FPS * SR)
    mix = np.zeros((n + 3 * SR, 2), np.float32)
    smooth = lambda u: u * u * (3 - 2 * u)
    for i, (folder, name, first, bpm, from_end) in enumerate(BLOCKS):
        a_f = start(first)
        b_f = start(BLOCKS[i + 1][2]) if i + 1 < len(BLOCKS) else total
        x = load(leveled(folder, name))
        is_first, is_last = i == 0, i == len(BLOCKS) - 1
        pre = 0 if is_first else round(IN_PRE * SR)
        seg = round((b_f - a_f) / FPS * SR) + pre
        need = seg + (0 if is_last else round(OUT_POST * SR))
        if from_end:
            x = x[max(0, len(x) - need):]
        elif not is_first:
            x = x[lead_trim(load(os.path.join(OUT, folder, f'{name}.raw.mp3')).mean(1), (b_f - a_f) / FPS):]
        short = len(x) < need
        x = extend(x, need, bpm) if not is_last else x
        y = x[:min(len(x), need)].copy()
        if not is_first:
            k = np.arange(min(len(y), round(IN_LEN * SR)))
            y[k] *= (np.sin(np.pi / 2 * k / len(k)) ** 2)[:, None]
        if not is_last:
            s0 = max(0, seg - round(OUT_PRE * SR))
            tail = y[s0:].copy()
            pad = min(s0, round(0.2 * SR))
            low = sosfiltfilt(sos, y[s0 - pad:], axis=0)[pad:]
            u = np.linspace(0, 1, len(tail))
            m = smooth(np.clip(u * (OUT_PRE + OUT_POST) / (OUT_PRE + 0.4), 0, 1))[:, None]
            g = (np.cos(np.pi / 2 * u) ** 2)[:, None]
            y[s0:] = g * ((1 - m) * tail + m * low)
        else:
            fo = min(len(y), round(1.4 * SR))
            y[-fo:] *= np.linspace(1, 0, fo)[:, None]
        a = round(a_f / FPS * SR) - pre
        mix[max(0, a):a + len(y)] += y[max(0, -a):]
        print(f'{folder}/{name:16} {a_f / FPS:7.2f} → {b_f / FPS:7.2f} s  ({seg / SR:5.1f} s; pieza {len(x) / SR:5.1f} s{", alargada" if short and not is_last else ""})')
    mix = mix[:n]
    peak = float(np.abs(mix).max())
    if peak > 0.97:
        mix *= 0.97 / peak
    pcm = (np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes()
    dst = os.path.join(OUT, 'mp_bed.mp3')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ac', '2', '-ar', str(SR), '-i', '-', '-c:a', 'libmp3lame', '-b:a', '192k', dst], input=pcm, check=True)
    print('escrito', os.path.relpath(dst, ROOT), f'({n / SR:.2f} s)')


if __name__ == '__main__':
    main()
