#!/usr/bin/env python3
"""Sustituye tramos de un render completo por tramos re-renderizados (mismo fps y tamaño).

Uso: python3 tools/splice.py <completo.mp4> <salida.mp4> <fps> seg.mp4:inicio-fin [seg2.mp4:inicio-fin ...]
inicio y fin son fotogramas (inclusive), los mismos que se pasaron a `remotion render --frames=inicio-fin`.
Recodifica vídeo (x264 CRF 16) y audio (PCM intermedio → AAC 320k) en una sola pasada para que los cortes no se noten.
"""
import subprocess, sys

full, out, fps = sys.argv[1], sys.argv[2], float(sys.argv[3])
segs = []
for arg in sys.argv[4:]:
    path, rng = arg.rsplit(':', 1)
    a, b = map(int, rng.split('-'))
    segs.append((a, b, path))
segs.sort()

inputs = ['-i', full] + sum((['-i', p] for _, _, p in segs), [])
parts, filters = [], []
cursor = 0
for k, (a, b, _) in enumerate(segs, start=1):
    if a > cursor:
        i = len(parts)
        filters.append(f"[0:v]trim=start_frame={cursor}:end_frame={a},setpts=PTS-STARTPTS[v{i}];[0:a]atrim=start={cursor / fps}:end={a / fps},asetpts=PTS-STARTPTS[a{i}]")
        parts.append(i)
    i = len(parts)
    filters.append(f"[{k}:v]setpts=PTS-STARTPTS[v{i}];[{k}:a]atrim=end={(b - a + 1) / fps},asetpts=PTS-STARTPTS[a{i}]")
    parts.append(i)
    cursor = b + 1
i = len(parts)
filters.append(f"[0:v]trim=start_frame={cursor},setpts=PTS-STARTPTS[v{i}];[0:a]atrim=start={cursor / fps},asetpts=PTS-STARTPTS[a{i}]")
parts.append(i)
concat = ''.join(f'[v{i}][a{i}]' for i in parts) + f'concat=n={len(parts)}:v=1:a=1[v][a]'
fc = ';'.join(filters + [concat])
cmd = ['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', fc, '-map', '[v]', '-map', '[a]',
       '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', '-r', str(int(fps)),
       '-c:a', 'aac', '-b:a', '320k', '-movflags', '+faststart', out]
subprocess.run(cmd, check=True)
print('OK', out)
