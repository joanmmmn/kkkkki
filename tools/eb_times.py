#!/usr/bin/env python3
"""Inicio y duración de cada escena del vídeo de eBiblio (misma lógica que video/src/scenes/eb/timeline.ts).
Uso: python3 tools/eb_times.py [--json]"""
import json, math, os, sys
R = os.path.join(os.path.dirname(__file__), '..', 'video', 'public', 'eb')
FPS = 50
sec = lambda s: math.floor(s * FPS + 0.5)  # como Math.round de JS
TL = json.load(open(os.path.join(R, 'timeline.json')))
def vo_speech(i):
    j = json.load(open(os.path.join(R, 'vo', i + '.json')))
    return math.ceil((j.get('speechEnd') or j['duration']) * FPS)
out, a = [], 0
for d in TL:
    t = sec(d.get('lead', 0.12)); items = []
    for k, s in enumerate(d['seq']):
        if k > 0: t += sec(s.get('gap', 0.35))
        n = vo_speech(s['vo']); items.append((s['vo'], t, n)); t += n
    dur = t + sec(0.32 + d.get('extra', 0))
    out.append({'id': d['id'], 'start': a, 'dur': dur, 'items': items}); a += dur
if '--json' in sys.argv:
    print(json.dumps(out))
else:
    for s in out:
        m, x = divmod(s['start'] / FPS, 60)
        print(f"{s['id']}  {s['start']:6d}–{s['start'] + s['dur'] - 1:6d}  {int(m)}:{x:05.2f}  dur {s['dur'] / FPS:6.2f} s  " + ' '.join(f"{i}@{at / FPS:.2f}" for i, at, n in s['items']))
    print('TOTAL', a, f'{a / FPS:.2f} s', f'{int(a / FPS // 60)}:{a / FPS % 60:05.2f}')
