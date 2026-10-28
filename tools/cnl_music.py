#!/usr/bin/env python3
"""Música de los tutoriales «Cómo cancelar»: piezas ya compuestas para el canal (las de la reseña de Nextory y las de la guía de
Stephen King, como en «Las mejores plataformas»), sin gastar créditos.

Cada tutorial (video/src/scenes/cnl/videos.json) lleva su pieza (`piece`) desde el principio hasta las tiendas y el final de
«i_rutas» en la promo de SonorBooks y la pantalla final (v2, 28/10/2026), cruzadas como en las reseñas (la saliente se filtra y se apaga; la entrante sube en 0,6 s).
Uso: python3 tools/cnl_music.py [k ...]   → video/public/music/cnl_<k>.mp3
"""
import json, os, subprocess, sys
import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
import cnl_meta  # noqa: E402
from mp_music import extend, lead_trim, leveled, load, OUT, SR  # noqa: E402

FPS = cnl_meta.FPS
V = cnl_meta.V


def video_scenes(v):
    """Las cuentas de video/src/scenes/cnl/videos.ts (scenesOf, v2): tramo → tiendas (si aplica) → promo → pantalla final."""
    T = json.load(open(os.path.join(V, 'src/scenes/cnl/videos.json')))['timing']
    sec = cnl_meta.sec
    lead, pl = sec(T['lead']), sec(T['promoLead'])
    out = [{'kind': 'seg', 'id': v['seg'], 'lead': lead, 'dur': lead + cnl_meta.speech_frames(v['seg']) + sec(T['done']), 'skip': 0}]
    if v['store']:
        out.append({'kind': 'store', 'id': 'T', 'lead': 0, 'dur': sec(T['store']), 'skip': 0})
    out.append({'kind': 'promo', 'id': v['promo'], 'lead': pl, 'dur': pl + cnl_meta.speech_frames(v['promo']) + sec(T['promoTail']), 'skip': 0})
    out.append({'kind': 'end', 'id': 'E', 'lead': 0, 'dur': sec(T['end']), 'skip': 0})
    a = 0
    for s in out:
        s['at'] = a
        a += s['dur']
    return out, a


def build(blocks, total, dst):
    from scipy.signal import butter, sosfiltfilt
    OUT_PRE, OUT_POST, IN_PRE, IN_LEN = 0.7, 0.9, 0.3, 0.6
    sos = butter(4, 900, 'low', fs=SR, output='sos')
    n = round(total / FPS * SR)
    mix = np.zeros((n + 3 * SR, 2), np.float32)
    smooth = lambda u: u * u * (3 - 2 * u)
    for i, (folder, name, a_f, bpm, from_end) in enumerate(blocks):
        b_f = blocks[i + 1][2] if i + 1 < len(blocks) else total
        x = load(leveled(folder, name))
        is_first, is_last = i == 0, i == len(blocks) - 1
        pre = 0 if is_first else round(IN_PRE * SR)
        seg = round((b_f - a_f) / FPS * SR) + pre
        need = seg + (0 if is_last else round(OUT_POST * SR))
        if from_end:
            x = x[max(0, len(x) - need):]
        elif not is_first:
            x = x[lead_trim(load(os.path.join(OUT, folder, f'{name}.raw.mp3')).mean(1), (b_f - a_f) / FPS):]
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
    mix = mix[:n]
    peak = float(np.abs(mix).max())
    if peak > 0.97:
        mix *= 0.97 / peak
    pcm = (np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes()
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ac', '2', '-ar', str(SR), '-i', '-', '-c:a', 'libmp3lame', '-b:a', '192k', dst], input=pcm, check=True)


def main():
    cfg = json.load(open(os.path.join(V, 'src/scenes/cnl/videos.json')))
    only = set(sys.argv[1:])
    for v in cfg['videos']:
        if only and v['k'] not in only:
            continue
        scenes, total = video_scenes(v)
        promo = next(s for s in scenes if s['kind'] == 'promo')
        folder, name, bpm = v['piece']
        # La pieza de la plataforma hasta las tiendas; la promo y la pantalla final, con el final de «i_rutas» (más arriba de energía).
        blocks = [(folder, name, 0, bpm, False), ('skg_parts', 'i_rutas', promo['at'], 96, True)]
        dst = os.path.join(OUT, f"cnl_{v['k']}.mp3")
        build(blocks, total, dst)
        print(f"{v['k']:11} {total / FPS:6.2f} s → {os.path.relpath(dst, cnl_meta.ROOT)}")


if __name__ == '__main__':
    main()
