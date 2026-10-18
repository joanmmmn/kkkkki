#!/usr/bin/env python3
"""Sustituye fotogramas de un tramo de render (part_XX.mp4, sin audio) por segmentos re-renderizados y lo recodifica
una sola vez con los mismos parámetros que usa Remotion (x264 medium, CRF 16, yuvj420p, bt470bg, escala de tiempo 90000),
para que siga concatenándose sin recodificar con el resto de tramos en tools/render_chunks.sh.

Uso: python3 tools/splice_part.py <part.mp4> <primer_fotograma_del_tramo> <salida.mp4> seg.mp4:inicio-fin [...]
(inicio y fin, fotogramas absolutos de la composición, inclusive)."""
import json, subprocess, sys

part, start, out = sys.argv[1], int(sys.argv[2]), sys.argv[3]
segs = sorted((int(r.split('-')[0]), int(r.split('-')[1]), p) for p, r in (a.rsplit(':', 1) for a in sys.argv[4:]))

def nframes(f):
    o = subprocess.run(['ffprobe', '-v', 'error', '-count_packets', '-select_streams', 'v', '-show_entries', 'stream=nb_read_packets', '-of', 'csv=p=0', f], capture_output=True, text=True, check=True)
    return int(o.stdout.strip().split(',')[0].split()[0])

total = nframes(part)
FPS = 50
inputs, chains, labels = [], [], []

def orig(a, b):  # fotogramas absolutos [a, b) del tramo original, como entrada propia con búsqueda exacta (sin acumular fotogramas)
    idx = sum(1 for x in inputs if x == '-i')
    inputs.extend(['-ss', f'{(a - start) / FPS:.6f}', '-i', part])
    chains.append(f'[{idx}:v]trim=end_frame={b - a},setpts=PTS-STARTPTS[v{len(labels)}]'); labels.append(f'[v{len(labels)}]')

def seg(p):
    idx = sum(1 for x in inputs if x == '-i')
    inputs.extend(['-i', p])
    chains.append(f'[{idx}:v]setpts=PTS-STARTPTS[v{len(labels)}]'); labels.append(f'[v{len(labels)}]')

cur = start
for a, b, p in segs:
    n = nframes(p)
    assert n == b - a + 1, f'{p}: {n} fotogramas, se esperaban {b - a + 1}'
    if a > cur:
        orig(cur, a)
    seg(p)
    cur = b + 1
if cur < start + total:
    orig(cur, start + total)
fc = ';'.join(chains) + ';' + ''.join(labels) + f'concat=n={len(labels)}:v=1:a=0,fps=50[out]'
subprocess.run(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', fc, '-map', '[out]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '16',
                '-pix_fmt', 'yuvj420p', '-color_range', 'pc', '-colorspace', 'bt470bg', '-video_track_timescale', '90000', '-an', out], check=True)
n = nframes(out)
print(out, n, 'fotogramas (antes', total, ')')
assert n == total
