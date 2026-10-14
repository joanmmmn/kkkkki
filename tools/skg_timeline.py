#!/usr/bin/env python3
"""Réplica en Python de video/src/scenes/skg/timeline.ts (mismo cálculo de duraciones) para la música, los capítulos y el SRT.
Uso: python3 tools/skg_timeline.py  → imprime escenas con inicio/fin en fotogramas y segundos."""
import json, math, os, re

FPS = 50
ROOT = os.path.join(os.path.dirname(__file__), '..', 'video')
TS = os.path.join(ROOT, 'src/scenes/skg/timeline.ts')
VO = os.path.join(ROOT, 'public/skg/vo')

def sec(s): return int(math.floor(s * FPS + 0.5))
def speech(i):
    p = os.path.join(VO, f'{i}.json')
    if not os.path.exists(p): return sec(4)
    d = json.load(open(p))
    return math.ceil((d.get('speechEnd') or d['duration']) * FPS)

LEAD, GAP, TAIL, BUMP_PRE = sec(0.16), sec(0.42), sec(0.34), 12

def parse():
    src = open(TS).read()
    body = src[src.index('export const SKG_SCENES'):src.index('];', src.index('export const SKG_SCENES'))]
    out = []
    for m in re.finditer(r"scene\('(\w+)', \[([^\]]*)\](?:, (\{.*?\}))?\)", body):
        sid, ids, opts = m.group(1), [x.strip().strip("'") for x in m.group(2).split(',') if x.strip()], m.group(3) or '{}'
        o = {}
        for k, v in re.findall(r"(\w+): ([^,}\]]+(?:\[[^\]]*\])?)", opts):
            o[k] = v.strip()
        def num(expr):
            expr = expr.strip()
            mm = re.match(r'sec\(([\d.]+)\)', expr)
            return sec(float(mm.group(1))) if mm else float(expr)
        gaps = [float(x) for x in re.search(r'gaps: \[([^\]]*)\]', opts).group(1).split(',')] if 'gaps:' in opts else []
        bump = re.search(r"bump: '([^']*)'", opts)
        lead = num(o['lead']) if 'lead' in o else (sec(0.55) if bump else LEAD)
        t = lead; vo = []
        for i, v in enumerate(ids):
            if i > 0: t += sec(gaps[i - 1]) if i - 1 < len(gaps) else GAP
            vo.append((v, t)); t += speech(v)
        extra = num(o['extra']) if 'extra' in o else 0
        mind = num(o['minDur']) if 'minDur' in o else 0
        dur = max(mind, t + TAIL + extra)
        out.append({'id': sid, 'vo': vo, 'dur': int(dur), 'bump': bump.group(1) if bump else None})
    a = 0
    for s in out:
        s['start'] = a; a += s['dur']
    return out, a

if __name__ == '__main__':
    sc, total = parse()
    for s in sc:
        print(f"{s['id']:8} {s['start']:6d} → {s['start']+s['dur']:6d}  ({s['start']/FPS:6.1f}s, {s['dur']/FPS:5.1f}s)  {s['bump'] or ''}  {' '.join(v for v,_ in s['vo'])}")
    print('TOTAL', total, f'{total/FPS:.1f}s', f'{total/FPS/60:.2f} min')
