#!/usr/bin/env python3
"""SonorBooks Polska: índices que lee el vídeo.

- video/src/pl/vo_index.json  ← public/pl/<pieza>/vo/vo.json (texto de cada locución: `text`)
- video/src/pl/rec_index.json ← public/pl/<pieza>/rec/<toma>/meta.json (+ cursor.json, a 25 Hz)

Uso: python3 tools/pl_index.py
"""
import json, os
ROOT = os.path.join(os.path.dirname(__file__), '..', 'video')
PUB = os.path.join(ROOT, 'public', 'pl')
vo, rec = {}, {}
for slug in sorted(os.listdir(PUB)) if os.path.isdir(PUB) else []:
    d = os.path.join(PUB, slug)
    if not os.path.isdir(d):
        continue
    vj = os.path.join(d, 'vo', 'vo.json')
    if os.path.exists(vj):
        vo[slug] = {s['id']: s['text'] for s in json.load(open(vj, encoding='utf-8'))['scenes']}
    rd = os.path.join(d, 'rec')
    if os.path.isdir(rd):
        for clip in sorted(os.listdir(rd)):
            mj = os.path.join(rd, clip, 'meta.json')
            if not os.path.exists(mj):
                continue
            m = json.load(open(mj))
            item = {'duration': m['duration'], 'viewport': m.get('viewport', [1920, 1080])}
            cj = os.path.join(rd, clip, 'cursor.json')
            if os.path.exists(cj):
                pts, last = [], -1
                for p in json.load(open(cj)):
                    if p['t'] - last >= 0.04 or p.get('down'):
                        pts.append({'t': p['t'], 'x': p['x'], 'y': p['y'], **({'down': True} if p.get('down') else {})})
                        last = p['t']
                item['cursor'] = pts
            rec[f'{slug}/{clip}'] = item
json.dump(vo, open(os.path.join(ROOT, 'src', 'pl', 'vo_index.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
json.dump(rec, open(os.path.join(ROOT, 'src', 'pl', 'rec_index.json'), 'w'), separators=(',', ':'))
print(f'vo: {sum(len(v) for v in vo.values())} locuciones en {len(vo)} piezas · rec: {len(rec)} tomas')
