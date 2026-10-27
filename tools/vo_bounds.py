#!/usr/bin/env python3
"""Añade speechStart/speechEnd a cada locución: primera y última ventana de 20 ms con voz (RMS > -45 dB).
Uso: python3 tools/vo_bounds.py <dir_vo>   (lo usa timeline.ts para encadenar escenas sin silencios)
Solo toca los .json de esa carpeta."""
import glob, json, os, re, subprocess, sys
WIN = 0.02
for f in sorted(glob.glob(os.path.join(sys.argv[1], '*.json'))):
    mp3 = f[:-5] + '.mp3'
    if not os.path.exists(mp3):
        continue
    d = json.load(open(f))
    log = subprocess.run(['ffmpeg', '-hide_banner', '-i', mp3, '-af',
                          'aresample=44100,asetnsamples=n=882,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level',
                          '-f', 'null', '-'], capture_output=True, text=True).stderr
    lv = [float(x) if x not in ('-inf', 'inf', 'nan') else -120.0 for x in re.findall(r'RMS_level=(\S+)', log)]
    loud = [i for i, v in enumerate(lv) if v > -45]
    if not loud:
        continue
    d['speechStart'] = round(loud[0] * WIN, 3)
    d['speechEnd'] = round(min(d['duration'], (loud[-1] + 1) * WIN + 0.02), 3)
    json.dump(d, open(f, 'w'), ensure_ascii=False)
    print(os.path.basename(f), d['speechStart'], d['speechEnd'], d['duration'])
