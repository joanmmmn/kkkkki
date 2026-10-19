#!/usr/bin/env python3
"""SonorBooks Polska: lecho musical de una reseña con las 12 piezas de las reseñas de España (ElevenLabs Music, re mayor),
recolocadas en las secciones del vídeo polaco con las mismas transiciones que tools/str_music.py. No gasta créditos.

Uso: python3 tools/pl_music.py <pieza>   → video/public/pl/<pieza>/music/bed.mp3
"""
import os, re, subprocess, sys
import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
from pl_meta import FPS, V, timeline, norm  # noqa: E402
from str_music import PARTS, SR, load, lead_trim, extend  # noqa: E402

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')

SECTION_PIECE = {'hook': 'a_hook', 'intro': 'b_que', 'plans': 'c_precios', 'ratings': 'e2_dispositivos', 'proscons': 'f1_pros',
                 'verdict': 'g_veredicto', 'steps': 'h1_prueba', 'outro': 'h2_cierre'}
APP_PIECES = ['d1_app', 'd2_leer', 'e1_funciones']


def blocks(slug):
    scenes, total, _, vos = timeline(slug)
    spec = open(os.path.join(V, 'src/pl/specs', f'{slug}.tsx'), encoding='utf-8').read()
    out = []
    app_i = 0
    sections = []
    for i, s in enumerate(scenes):
        if i == 0 or s['bump'] or s['kind'] == 'outro':
            sections.append([s])
        else:
            sections[-1].append(s)
    for sec in sections:
        s0 = sec[0]
        start = s0['start'] - (6 if s0['bump'] else 0)
        piece = SECTION_PIECE.get(s0['kind'])
        if piece is None:  # «cómo funciona», funciones, límites, dispositivos
            piece = APP_PIECES[min(app_i, len(APP_PIECES) - 1)]
            app_i += 1
            length = sum(x['dur'] for x in sec) / FPS
            out.append((piece, start))
            if length > 45 and app_i < len(APP_PIECES) and len(sec) > 1:
                mid = s0['start'] + sum(x['dur'] for x in sec) / 2
                cut = min(sec[1:], key=lambda x: abs(x['start'] - mid))
                out.append((APP_PIECES[app_i], cut['start']))
                app_i += 1
            continue
        out.append((piece, start))
        if s0['kind'] == 'proscons':
            m = re.search(r"id:\s*'" + s0['id'] + r"'.*?cons:\s*\[\{\s*at:\s*'([^']+)'", spec)
            if m:
                w = norm(m.group(1))
                v = vos[s0['id']]['vo']
                hit = next((x for x in (v['words'] if v else []) if norm(x['w']).startswith(w)), None)
                if hit:
                    out.append(('f2_contras', s0['start'] + s0['lead'] + round(hit['s'] * FPS) - 10))
    # Sin repeticiones seguidas
    clean = []
    for b in out:
        if clean and clean[-1][0] == b[0]:
            continue
        clean.append(b)
    return clean, total


def main():
    from scipy.signal import butter, sosfiltfilt
    slug = sys.argv[1]
    bl, total = blocks(slug)
    OUT_PRE, OUT_POST, IN_PRE, IN_LEN = 0.7, 0.9, 0.3, 0.6
    sos = butter(4, 900, 'low', fs=SR, output='sos')
    n = round(total / FPS * SR)
    mix = np.zeros((n + 3 * SR, 2), np.float32)
    smooth = lambda u: u * u * (3 - 2 * u)
    # El cierre (h2_cierre, 8,8 s) termina con su cadencia: se coloca para que acabe con el vídeo y la pieza anterior se alarga.
    last_name, last_a = bl[-1]
    last_len = len(load(os.path.join(PARTS, f'{last_name}.raw.mp3'))) / SR * FPS
    if total - last_a > last_len:
        bl[-1] = (last_name, int(total - last_len + 20))
    for i, (name, a_f) in enumerate(bl):
        b_f = bl[i + 1][1] if i + 1 < len(bl) else total
        lev = os.path.join(PARTS, f'{name}.mp3')
        if not os.path.exists(lev):
            subprocess.run(['python3', os.path.join(ROOT, 'tools/music_level.py'), os.path.join(PARTS, f'{name}.raw.mp3'), os.path.join(PARTS, f'{name}.plan.json'), lev], check=True)
        x = load(lev)
        is_first, is_last = i == 0, i == len(bl) - 1
        off = lead_trim(load(os.path.join(PARTS, f'{name}.raw.mp3')).mean(1), (b_f - a_f) / FPS, is_first)
        x = x[off:]
        pre = 0 if is_first else round(IN_PRE * SR)
        a = round(a_f / FPS * SR) - pre
        seg = round((b_f - a_f) / FPS * SR) + pre
        need = seg + (0 if is_last else round(OUT_POST * SR))
        x = extend(x, need) if not is_last else x
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
            fo = min(len(y), round(1.6 * SR))
            y[-fo:] *= np.linspace(1, 0, fo)[:, None]
        mix[max(0, a):a + len(y)] += y[max(0, -a):]
        print(f'{name:16} {a_f / FPS:7.2f} → {b_f / FPS:7.2f} s')
    mix = mix[:n]
    peak = float(np.abs(mix).max())
    if peak > 0.97:
        mix *= 0.97 / peak
    pcm = (np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes()
    dst_dir = os.path.join(V, 'public/pl', slug, 'music')
    os.makedirs(dst_dir, exist_ok=True)
    dst = os.path.join(dst_dir, 'bed.mp3')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ac', '2', '-ar', str(SR), '-i', '-', '-c:a', 'libmp3lame', '-b:a', '192k', dst], input=pcm, check=True)
    print('escrito', os.path.relpath(dst, ROOT), f'({n / SR:.2f} s)')


if __name__ == '__main__':
    main()
