#!/usr/bin/env python3
"""Música de la reseña de Audiobooks.com: las 12 piezas de la reseña de Nextory (ElevenLabs Music, re mayor) recolocadas en las
secciones de esta reseña (como en la de Podimo), con las mismas transiciones suaves en cada corte (tools/nxr_music_v2.py join).

No compone nada (no gasta créditos): usa video/public/music/parts/<pieza>.mp3 (niveladas; si faltan, se nivelan desde
<pieza>.raw.mp3 con su plan original). Cada pieza se corta donde empieza la sección siguiente; si alguna se quedara
corta, se alarga repitiendo compases de su parte central con un fundido.

Uso: python3 tools/abc_music.py   → escribe video/public/music/abc_bed.mp3
"""
import os, subprocess, sys, unicodedata
import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
from abc_meta import FPS, review_scenes, words  # noqa: E402

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
OUT = os.path.join(ROOT, 'video/public/music')
PARTS = os.path.join(OUT, 'parts')
SR = 44100
BAR = 4 * 60 / 104  # compás a 104 BPM

# (pieza de la reseña de Nextory, inicio de la sección: escena o (escena, palabra))
BLOCKS = [
    ('a_hook', 'D01'),             # gancho
    ('b_que', 'D02'),              # qué es
    ('c_precios', 'D03'),          # créditos y catálogo en español (funk sincopado)
    ('d1_app', 'D05'),             # la app: buscador y fichas
    ('d2_leer', 'D07'),            # reproductor (medio tiempo, piano)
    ('e1_funciones', 'D08'),       # gratis, plan familiar y dispositivos
    ('e2_dispositivos', 'D10'),    # opiniones (marimba)
    ('f1_pros', 'D11'),            # lo bueno
    ('f2_contras', ('D11', 'malo')),  # lo malo
    ('g_veredicto', 'D12'),        # veredicto
    ('h1_prueba', 'F01'),          # 30 días gratis y cancelar
    ('h2_cierre', 'F06'),          # cierre
]


def norm(t):
    return ''.join(c for c in unicodedata.normalize('NFD', t.lower()) if unicodedata.category(c) != 'Mn')


def load(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 's16le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32).reshape(-1, 2) / 32768


def _db(x, a, b):
    seg = x[a:b]
    return 20 * np.log10(np.sqrt(np.mean(seg ** 2)) + 1e-9) if len(seg) else -120


def lead_trim(x, need_s, first):
    """Igual que en la reseña de Nextory: salta el silencio inicial y, si la pieza arranca floja, hasta que coge fuerza."""
    if first:
        return 0
    win = round(0.05 * SR)
    k0 = next((k for k in range(0, len(x) - win, win) if _db(x, k, k + win) > -35), 0)
    w4 = round(0.4 * SR)
    need = round(need_s * SR)
    typical = np.median([_db(x, k, k + w4) for k in range(k0, max(k0 + w4 + 1, min(len(x), k0 + need) - w4), w4)])
    k = k0
    while k < k0 + round(6 * SR) and _db(x, k, k + round(1.5 * SR)) < typical - 8:
        k += round(0.1 * SR)
    return k


def extend(x, need):
    """Alarga la pieza repitiendo 4 compases de su parte central (fundido de 0,5 s en cada empalme)."""
    if len(x) >= need:
        return x
    a = round(4 * BAR * SR)
    loop = x[a:a + round(4 * BAR * SR)]
    fade = round(0.5 * SR)
    out = x.copy()
    while len(out) < need:
        r = np.linspace(0, 1, fade)[:, None]
        head = out[:-fade]
        mixed = out[-fade:] * (1 - r) + loop[:fade] * r
        out = np.concatenate([head, mixed, loop[fade:]])
    return out


def main():
    from scipy.signal import butter, sosfiltfilt
    scenes, total, _ = review_scenes()
    at = {s['id']: s['at'] for s in scenes}
    lead = {s['id']: s['lead'] for s in scenes}
    bumps = {s['id'] for s in scenes if s.get('bump')}

    def start(first):
        if isinstance(first, tuple):
            sid, word = first
            w = next(x for x in words(sid) if norm(x['w']).startswith(norm(word)))
            return at[sid] + lead[sid] + round(w['s'] * FPS) - 10
        return at[first] - (6 if first in bumps else 0)

    OUT_PRE, OUT_POST, IN_PRE, IN_LEN = 0.7, 0.9, 0.3, 0.6
    sos = butter(4, 900, 'low', fs=SR, output='sos')
    n = round(total / FPS * SR)
    mix = np.zeros((n + 3 * SR, 2), np.float32)
    smooth = lambda u: u * u * (3 - 2 * u)
    for i, (name, first) in enumerate(BLOCKS):
        a_f = start(first)
        b_f = start(BLOCKS[i + 1][1]) if i + 1 < len(BLOCKS) else total
        lev = os.path.join(PARTS, f'{name}.mp3')
        if not os.path.exists(lev):
            subprocess.run(['python3', os.path.join(ROOT, 'tools/music_level.py'), os.path.join(PARTS, f'{name}.raw.mp3'), os.path.join(PARTS, f'{name}.plan.json'), lev], check=True)
        x = load(lev)
        is_first, is_last = i == 0, i == len(BLOCKS) - 1
        off = lead_trim(load(os.path.join(PARTS, f'{name}.raw.mp3')).mean(1), (b_f - a_f) / FPS, is_first)
        x = x[off:]
        pre = 0 if is_first else round(IN_PRE * SR)
        a = round(a_f / FPS * SR) - pre
        seg = round((b_f - a_f) / FPS * SR) + pre
        need = seg + (0 if is_last else round(OUT_POST * SR))
        short = len(x) < need
        x = extend(x, need) if not is_last else x
        keep = min(len(x), need)
        y = x[:keep].copy()
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
            # Cierre: si la pieza acaba antes que el vídeo, se apaga sola; si sobra, fundido en los últimos 1,4 s.
            fo = min(len(y), round(1.4 * SR))
            y[-fo:] *= np.linspace(1, 0, fo)[:, None]
        mix[max(0, a):a + len(y)] += y[max(0, -a):]
        print(f'{name:16} {a_f / FPS:7.2f} → {b_f / FPS:7.2f} s  ({seg / SR:5.2f} s de vídeo; pieza {len(x) / SR:5.2f} s{", alargada" if short and not is_last else ""})')
    mix = mix[:n]
    peak = float(np.abs(mix).max())
    if peak > 0.97:
        mix *= 0.97 / peak
    pcm = (np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes()
    dst = os.path.join(OUT, 'abc_bed.mp3')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ac', '2', '-ar', str(SR), '-i', '-', '-c:a', 'libmp3lame', '-b:a', '192k', dst], input=pcm, check=True)
    print('escrito', os.path.relpath(dst, ROOT), f'({n / SR:.2f} s)')


if __name__ == '__main__':
    main()
