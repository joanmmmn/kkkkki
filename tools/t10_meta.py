#!/usr/bin/env python3
"""Subtítulos (.srt) y capítulos de «Los 10 mejores · Terror» a partir de la locución y la línea de tiempo.
Las cifras que la voz dice en letra van en número en los subtítulos.
Uso: python3 tools/t10_meta.py <dir_salida>"""
import json, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from t10_timeline import parse, FPS, VO  # noqa: E402
from skg_meta import chunks, two_lines, ts  # noqa: E402

NUM = [
    ('mil novecientos veintidós', '1922'), ('mil novecientos cuarenta y nueve', '1949'), ('siglo veinte', 'siglo XX'),
    ('treinta y siete relatos', '37 relatos'), ('cuatro coma seis sobre cinco', '4,6 sobre 5'), ('cuatro coma seis', '4,6'),
    ('cuatro coma cuatro', '4,4'), ('cuatro coma ocho', '4,8'), ('cuatro coma siete sobre cinco', '4,7 sobre 5'), ('cuatro coma nueve sobre cinco', '4,9 sobre 5'),
    ('ciento sesenta valoraciones', '160 valoraciones'), ('más de seiscientas valoraciones', 'más de 600 valoraciones'), ('más de cuatrocientas valoraciones', 'más de 400 valoraciones'),
    ('más de doscientas valoraciones', 'más de 200 valoraciones'), ('más de veinticinco actores', 'más de 25 actores'), ('quince actores', '15 actores'),
    ('dieciocho horas y media', '18 horas y media'), ('veintitrés horas', '23 horas'), ('diecisiete horas', '17 horas'), ('catorce horas', '14 horas'),
    ('trece horas', '13 horas'), ('seis horas', '6 horas'), ('tres horas', '3 horas'), ('dos horas', '2 horas'), ('quince minutos', '15 minutos'),
    ('Número diez', 'Número 10'), ('Número nueve', 'Número 9'), ('Número ocho', 'Número 8'), ('Número siete', 'Número 7'), ('Número seis', 'Número 6'),
    ('Número cinco', 'Número 5'), ('Número cuatro', 'Número 4'), ('Número tres', 'Número 3'), ('Número dos', 'Número 2'), ('Número uno', 'Número 1'),
    ('los diez libros', 'los 10 libros'), ('«Los diez mejores»', '«Los 10 mejores»'), ('los diez mejores libros', 'los 10 mejores libros'), ('diez libros con fama', '10 libros con fama'),
]

CHAPTERS = [
    ('10 libros de terror que dan miedo de verdad', 'HOOK'),
    ('10. La llamada de Cthulhu (H. P. Lovecraft)', 'B1'),
    ('9. Cuentos de Edgar Allan Poe', 'B2'),
    ('8. Cómo vender una casa encantada (Grady Hendrix)', 'B3'),
    ('7. Distancia de rescate (Samanta Schweblin)', 'B4'),
    ('6. Drácula (Bram Stoker)', 'B5'),
    ('5. Apocalipsis Z (Manel Loureiro)', 'B6'),
    ('4. Carcoma (Layla Martínez)', 'B7'),
    ("3. El misterio de Salem's Lot (Stephen King)", 'B8'),
    ('2. Nuestra parte de noche (Mariana Enriquez)', 'B9'),
    ('1. El exorcista (William Peter Blatty)', 'B10'),
    ('Cómo escucharlos (y dónde)', 'TIP'),
]


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
    with open(os.path.join(out, 'top10_terror.es.srt'), 'w') as f:
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


if __name__ == '__main__':
    main()
