#!/usr/bin/env python3
"""Sustituye tramos de un render completo por tramos re-renderizados (mismo fps y tamaño).

Uso: python3 tools/splice.py <completo.mp4> <salida.mp4> <fps> seg.mp4:inicio-fin [seg2.mp4:inicio-fin ...]
inicio y fin son fotogramas (inclusive), los mismos que se pasaron a `remotion render --frames=inicio-fin`.

Para no agotar la memoria, cada parte se recodifica por separado con los mismos parámetros
(x264 CRF 16 + PCM) y después se concatena sin recodificar el vídeo; el audio se pasa a AAC una sola vez.
"""
import os, subprocess, sys, tempfile

full, out, fps = sys.argv[1], sys.argv[2], float(sys.argv[3])
segs = []
for arg in sys.argv[4:]:
    path, rng = arg.rsplit(':', 1)
    a, b = map(int, rng.split('-'))
    segs.append((a, b, path))
segs.sort()

tmp = tempfile.mkdtemp(prefix='splice-')
ENC = ['-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', '-r', str(int(fps)), '-c:a', 'pcm_s16le', '-ar', '48000']

def run(args):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', *args], check=True)

parts = []
def cut_full(start, end=None):
    p = os.path.join(tmp, f'p{len(parts):02d}.mov')
    vt = f'trim=start_frame={start}' + (f':end_frame={end}' if end is not None else '') + ',setpts=PTS-STARTPTS'
    at = f'atrim=start={start / fps}' + (f':end={end / fps}' if end is not None else '') + ',asetpts=PTS-STARTPTS'
    ss = max(0.0, start / fps - 2)  # búsqueda rápida aproximada y recorte exacto con trim
    vt = vt.replace(f'start_frame={start}', f'start_frame={start - round(ss * fps)}')
    if end is not None:
        vt = vt.replace(f'end_frame={end}', f'end_frame={end - round(ss * fps)}')
    at = at.replace(f'start={start / fps}', f'start={start / fps - ss}')
    if end is not None:
        at = at.replace(f':end={end / fps}', f':end={end / fps - ss}')
    run(['-ss', f'{ss:.3f}', '-i', full, '-vf', vt, '-af', at, *ENC, p])
    parts.append(p)

def add_seg(path, n):
    p = os.path.join(tmp, f'p{len(parts):02d}.mov')
    run(['-i', path, '-vf', 'setpts=PTS-STARTPTS', '-af', f'atrim=end={n / fps},asetpts=PTS-STARTPTS', *ENC, p])
    parts.append(p)

cursor = 0
for a, b, path in segs:
    if a > cursor:
        cut_full(cursor, a)
    add_seg(path, b - a + 1)
    cursor = b + 1
cut_full(cursor)

lst = os.path.join(tmp, 'list.txt')
open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts))
run(['-f', 'concat', '-safe', '0', '-i', lst, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k', '-movflags', '+faststart', out])
print('OK', out, '(', len(parts), 'partes )')
