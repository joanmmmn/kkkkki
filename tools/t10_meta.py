#!/usr/bin/env python3
"""Subtítulos (.srt) y capítulos de «10 historii grozy, które naprawdę przerażają» (SonorBooks Polska) a partir de la locución
y la línea de tiempo; también el .srt del vertical. Las cifras que la voz dice en letra van en número en los subtítulos.
Uso: python3 tools/t10_meta.py <dir_salida>"""
import json, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from t10_timeline import parse, FPS, VO, sec  # noqa: E402
from skg_meta import chunks, two_lines, ts  # noqa: E402

# Polaco: las cifras van en número en `text` (vo.json); solo quedan en letra algunas fórmulas habladas.
NUM = [
    ('Numer dziesięć', 'Numer 10'), ('Numer dziewięć', 'Numer 9'), ('Numer osiem', 'Numer 8'), ('Numer siedem', 'Numer 7'), ('Numer sześć', 'Numer 6'),
    ('Numer pięć', 'Numer 5'), ('Numer cztery', 'Numer 4'), ('Numer trzy', 'Numer 3'), ('Numer dwa', 'Numer 2'), ('Numer jeden', 'Numer 1'),
    ('Oto dziesięć historii', 'Oto 10 historii'), ('trzydzieści kilometrów', '30 kilometrów'), ('Pięć lat później', '5 lat później'),
]

CHAPTERS = [
    ('10 historii grozy, które naprawdę przerażają', 'HOOK'),
    ('10. Zew Cthulhu (H.P. Lovecraft)', 'B1'),
    ('9. Opowiadania Edgara Allana Poego', 'B2'),
    ('8. Jak sprzedać nawiedzony dom (Grady Hendrix)', 'B3'),
    ('7. Dziecko Rosemary (Ira Levin)', 'B4'),
    ('6. Drakula (Bram Stoker)', 'B5'),
    ('5. Inkub (Artur Urbanowicz)', 'B6'),
    ('4. Dom na Wyrębach (Stefan Darda)', 'B7'),
    ('3. Miasteczko Salem (Stephen King)', 'B8'),
    ('2. Manitou (Graham Masterton)', 'B9'),
    ('1. Nie otwieraj oczu (Josh Malerman)', 'B10'),
    ('Jak i gdzie ich posłuchać', 'TIP'),
]
# Vertical (video/src/scenes/t10/Short.tsx): locuciones y pausas, en el mismo orden.
SHORT = [('Y01', 0.6), ('X102', 0.55), ('X103', 0.65), ('X104', 0.65), ('X105', 0.8), ('Y02', 0.7)]


def digits(t):
    for a, b in NUM:
        t = t.replace(a, b)
    return t


def main():
    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    scenes, total = parse()
    subs = []
    for s in scenes:
        for vid, at in s['vo']:
            d = json.load(open(os.path.join(VO, f'{vid}.json')))
            t0 = (s['start'] + at) / FPS
            dur = d.get('speechEnd') or d['duration']
            cs = chunks(d['text'])
            tot = sum(len(c) for c in cs)
            acc = 0
            for c in cs:
                a = t0 + dur * acc / tot
                acc += len(c)
                b = t0 + dur * acc / tot
                subs.append((a, b + 0.15, two_lines(digits(c))))
    with open(os.path.join(out, 'top10-horror.pl.srt'), 'w') as f:
        for i, (a, b, t) in enumerate(subs, 1):
            f.write(f'{i}\n{ts(a)} --> {ts(min(b, subs[i][0] if i < len(subs) else b))}\n{t}\n\n')
    print(len(subs), 'subtítulos;', f'{total / FPS:.1f} s')
    starts = {s['id']: s['start'] / FPS for s in scenes}
    lines = []
    for label, sid in CHAPTERS:
        t = 0 if sid == 'HOOK' else starts[sid] - 0.2
        lines.append(f'{int(t // 60)}:{int(t % 60):02d} {label}')
    open(os.path.join(out, 'capitulos.txt'), 'w').write('\n'.join(lines) + '\n')
    print('\n'.join(lines))
    # vertical
    if all(os.path.exists(os.path.join(VO, f'{v}.json')) for v, _ in SHORT):
        import math
        t, vs = 0, []
        for v, gap in SHORT:
            t += sec(gap)
            d = json.load(open(os.path.join(VO, f'{v}.json')))
            vs.append((v, t, d))
            t += math.ceil((d.get('speechEnd') or d['duration']) * FPS)
        subs = []
        for v, at, d in vs:
            dur = d.get('speechEnd') or d['duration']
            cs = chunks(d['text']); tot = sum(len(c) for c in cs); acc = 0
            for c in cs:
                a = at / FPS + dur * acc / tot; acc += len(c); b = at / FPS + dur * acc / tot
                subs.append((a, b + 0.15, two_lines(digits(c))))
        with open(os.path.join(out, 'top10-horror_short.pl.srt'), 'w') as f:
            for i, (a, b, tx) in enumerate(subs, 1):
                f.write(f'{i}\n{ts(a)} --> {ts(min(b, subs[i][0] if i < len(subs) else b))}\n{tx}\n\n')
        print(len(subs), 'subtítulos del vertical')


if __name__ == '__main__':
    main()
