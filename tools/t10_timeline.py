#!/usr/bin/env python3
"""Réplica en Python de video/src/scenes/t10/timeline.ts (mismo cálculo) para la música, los capítulos y el SRT.
Si cambias la lista de escenas en timeline.ts, cámbiala aquí también (main() compara el total con Remotion si se le pasa).
Uso: python3 tools/t10_timeline.py  → escenas con inicio/fin en fotogramas y segundos."""
import json, math, os

FPS = 50
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'video')
VO = os.path.join(ROOT, 'public/t10/vo')


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


def book(p, ids, gaps, extra=26):
    return scene(f'B{p}', ids, lead=sec(1.15), gaps=gaps, extra=extra, book=p, night=True)


def parse():
    out = [
        scene('HOOK', ['X01', 'X02', 'X03'], lead=sec(1.1), gaps=[0.7, 0.8], extra=24, night=True),
        scene('SERIE', ['X04'], lead=sec(0.5), extra=30, night=True),
        scene('REGLA', ['X05', 'X06', 'X07'], gaps=[0.55, 0.6], extra=18, night=True),
        book(1, ['X11', 'X12', 'X13', 'X14'], [0.5, 0.75, 0.75]),
        book(2, ['X21', 'X22', 'X23', 'X24', 'X25'], [0.5, 0.75, 0.75, 0.55]),
        book(3, ['X31', 'X32', 'X33', 'X34'], [0.5, 0.75, 0.75]),
        book(4, ['X41', 'X42', 'X43', 'X44'], [0.5, 0.75, 0.75]),
        book(5, ['X51', 'X52', 'X53', 'X54', 'X55'], [0.5, 0.75, 0.75, 0.6]),
        book(6, ['X61', 'X62', 'X63', 'X64', 'X65'], [0.5, 0.75, 0.75, 0.55]),
        book(7, ['X71', 'X72', 'X73', 'X74'], [0.5, 0.75, 0.75]),
        book(8, ['X81', 'X82', 'X83', 'X84', 'X85'], [0.5, 0.75, 0.75, 0.45]),
        book(9, ['X91', 'X92', 'X93', 'X94', 'X95'], [0.5, 0.75, 0.75, 0.5]),
        book(10, ['X101', 'X102', 'X103', 'X104', 'X105'], [0.5, 0.75, 0.75, 0.9], extra=60),
        scene('TIP', ['X111'], lead=sec(0.6), extra=30, night=True),
        scene('WEB', ['X112'], extra=40),
        scene('COMENT', ['X113'], extra=30),
        scene('OUTRO', ['X114'], lead=sec(0.5), min_dur=sec(14)),
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
