#!/usr/bin/env python3
"""Añade speechStart y speechEnd (s) a cada <id>.json de una carpeta de locución, medidos sobre el audio
(silencio por debajo de -45 dBFS). Así la escena no espera al silencio final del archivo.
Uso: python3 tools/vo_bounds.py <dir_vo> [ids...]"""
import json, os, re, subprocess, sys

d = sys.argv[1]
ids = sys.argv[2:] or sorted(f[:-5] for f in os.listdir(d) if re.match(r'^[A-Z]\d+[A-Z]?\.json$', f))
for i in ids:
    mp3 = os.path.join(d, i + '.mp3'); meta_p = os.path.join(d, i + '.json')
    if not os.path.exists(mp3): continue
    r = subprocess.run(['ffmpeg', '-hide_banner', '-i', mp3, '-af', 'silencedetect=noise=-45dB:d=0.12', '-f', 'null', '-'], capture_output=True, text=True)
    starts = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', r.stderr)]
    ends = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', r.stderr)]
    meta = json.load(open(meta_p))
    dur = meta['duration']
    s0 = ends[0] if starts and starts[0] < 0.05 and ends else 0.0
    s1 = starts[-1] if starts and (len(ends) < len(starts) or ends[-1] >= dur - 0.05) else dur
    last_word = max((w['e'] for w in meta['words']), default=dur)
    s1 = max(s1, min(dur, last_word))
    meta['speechStart'] = round(s0, 3); meta['speechEnd'] = round(s1, 3)
    json.dump(meta, open(meta_p, 'w'), ensure_ascii=False, indent=1)
    print(f'{i}: voz {s0:.2f}–{s1:.2f} s de {dur:.2f} s')
