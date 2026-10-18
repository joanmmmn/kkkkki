#!/usr/bin/env python3
"""Subtítulos (.srt) y capítulos de «Los 10 mejores · Fantasía» a partir de la locución y la línea de tiempo.
Las cifras que la voz dice en letra van en número en los subtítulos.
Uso: python3 tools/t10f_meta.py <dir_salida>"""
import json, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from t10f_timeline import parse, FPS, VO  # noqa: E402
from skg_meta import chunks, two_lines, ts  # noqa: E402

NUM = [
    ('Número diez', 'Número 10'), ('Número nueve', 'Número 9'), ('Número ocho', 'Número 8'), ('Número siete', 'Número 7'), ('Número seis', 'Número 6'),
    ('Número cinco', 'Número 5'), ('Número cuatro', 'Número 4'), ('Número tres', 'Número 3'), ('Número dos', 'Número 2'), ('Número uno', 'Número 1'),
    ('las diez historias', 'las 10 historias'), ('las diez', 'las 10'), ('las otras nueve', 'las otras 9'), ('las otras', 'las otras'),
    ('doce años', '12 años'), ('tres tomos', '3 tomos'), ('tres libros', '3 libros'), ('sesenta horas', '60 horas'),
]

CHAPTERS = [
    ('10 historias de fantasía de las que no vas a querer salir', 'HOOK'),
    ('10. Alicia en el País de las Maravillas (Lewis Carroll)', 'B1'),
    ('9. Circe (Madeline Miller)', 'B2'),
    ('8. Harry Potter y la piedra filosofal (J. K. Rowling)', 'B3'),
    ('7. El Hobbit (J. R. R. Tolkien)', 'B4'),
    ('6. El nombre del viento (Patrick Rothfuss)', 'B5'),
    ('5. Olvidado rey Gudú (Ana María Matute)', 'B6'),
    ('4. Memorias de Idhún (Laura Gallego)', 'B7'),
    ('3. Alas de sangre (Rebecca Yarros)', 'B8'),
    ('2. El imperio final (Brandon Sanderson)', 'B9'),
    ('1. El Señor de los Anillos (J. R. R. Tolkien)', 'B10'),
    ('Cómo escucharlas gratis', 'TIP'),
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
    with open(os.path.join(out, 'top10_fantasia.es.srt'), 'w') as f:
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
