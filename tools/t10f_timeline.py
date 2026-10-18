#!/usr/bin/env python3
"""«Los 10 mejores · Fantasía». Réplica en Python de video/src/scenes/t10f/timeline.ts (mismo cálculo) para la música, los capítulos y el SRT.
Si cambias la lista de escenas en timeline.ts, cámbiala aquí también (main() compara el total con Remotion si se le pasa).
Uso: python3 tools/t10f_timeline.py  → escenas con inicio/fin en fotogramas y segundos."""
import json, math, os

FPS = 50
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'video')
VO = os.path.join(ROOT, 'public/t10f/vo')


def sec(s):
    return int(math.floor(s * FPS + 0.5))


def speech(i):
    p = os.path.join(VO, f'{i}.json')
    if not os.path.exists(p):
        return sec(4)
    d = json.load(open(p))
    return math.ceil((d.get('speechEnd') or d['duration']) * FPS)


LEAD, GAP, TAIL = sec(0.2), sec(0.45), sec(0.36)


def scene(sid, ids, lead=None, gaps=(), extra=0, min_dur=0, book=None, night=False):
    t = LEAD if lead is None else lead
    vo = []
    for i, v in enumerate(ids):
        if i > 0:
            t += sec(gaps[i - 1]) if i - 1 < len(gaps) else GAP
        vo.append((v, t))
        t += speech(v)
    return {'id': sid, 'vo': vo, 'dur': int(max(min_dur, t + TAIL + extra)), 'book': book, 'night': night}


def book(p, ids, gaps, extra=48):
    return scene(f'B{p}', ids, lead=sec(1.15), gaps=gaps, extra=extra, book=p, night=True)


def parse():
    out = [
        scene('HOOK', ['F01', 'F02', 'F03'], lead=sec(1.1), gaps=[0.7, 0.8], extra=24, night=True),
        scene('REGLA', ['F05', 'F07'], lead=sec(1.4), gaps=[1.5], extra=18, night=True),
        *[book(p, [f'F{p}1', f'F{p}2', f'F{p}3'], [0.5, 0.75]) for p in range(1, 10)],
        book(10, ['F101', 'F102', 'F103', 'F105'], [0.5, 0.75, 1.3], extra=60),
        scene('TIP', ['F111'], lead=sec(0.6), extra=30, night=True),
        scene('ESCUCHA', ['F112'], lead=sec(0.5), extra=sec(2.4)),
        scene('WEB', ['F115'], lead=sec(0.3), extra=40),
        scene('COMENT', ['F113'], extra=30),
        scene('OUTRO', ['F114'], lead=sec(0.5), min_dur=sec(14)),
    ]
    a = 0
    for s in out:
        s['start'] = a
        a += s['dur']
    return out, a


if __name__ == '__main__':
    sc, total = parse()
    for s in sc:
        print(f"{s['id']:7} {s['start']:6d} → {s['start'] + s['dur']:6d}  ({s['start'] / FPS:6.1f}s, {s['dur'] / FPS:5.1f}s)  {' '.join(v for v, _ in s['vo'])}")
    print('TOTAL', total, f'{total / FPS:.1f}s', f'{total / FPS / 60:.2f} min')
