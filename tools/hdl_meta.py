#!/usr/bin/env python3
"""Subtítulos (.srt) y capítulos de «La historia detrás del libro» · Cien años de soledad a partir de la locución y la línea de tiempo.
Uso: python3 tools/hdl_meta.py <dir_salida>"""
import json, os, re, sys
from hdl_timeline import parse, FPS, VO

MAX = 42  # caracteres por línea; dos líneas por subtítulo


def chunks(text):
    # Corta por frases y, si una frase es larga, por comas o por palabras, en trozos de hasta 2 líneas.
    parts = re.split(r'(?<=[.!?:…])\s+', text.strip())
    out = []
    for p in parts:
        if len(p) <= MAX * 2 - 4:
            out.append(p)
            continue
        cur = ''
        for piece in re.split(r'(?<=,)\s+', p):
            if len(cur) + len(piece) + 1 <= MAX * 2 - 4:
                cur = f'{cur} {piece}'.strip()
            else:
                if cur:
                    out.append(cur)
                if len(piece) <= MAX * 2 - 4:
                    cur = piece
                else:
                    words, cur = piece.split(), ''
                    for w in words:
                        if len(cur) + len(w) + 1 > MAX * 2 - 4:
                            out.append(cur); cur = w
                        else:
                            cur = f'{cur} {w}'.strip()
        if cur:
            out.append(cur)
    return out


def two_lines(t):
    if len(t) <= MAX:
        return t
    words = t.split()
    best = None
    for i in range(1, len(words)):
        a, b = ' '.join(words[:i]), ' '.join(words[i:])
        if len(a) <= MAX and len(b) <= MAX:
            score = abs(len(a) - len(b))
            if best is None or score < best[0]:
                best = (score, a + '\n' + b)
    return best[1] if best else t


# En pantalla, las cifras que la voz dice en letra van en número (criterio de los subtítulos del canal).
NUM = [
    ('mil novecientos sesenta y seis', '1966'), ('mil novecientos sesenta y cinco', '1965'), ('mil novecientos sesenta y siete', '1967'),
    ('mil novecientos ochenta y dos', '1982'), ('dos mil veinticuatro', '2024'), ('dos mil veintiséis', '2026'),
    ('ciento veinte mil pesos', '120.000 pesos'), ('diez mil dólares', '10.000 dólares'), ('cuarenta y dos mil', '42.000'),
    ('quinientas noventa cuartillas', '590 cuartillas'), ('casi seiscientas páginas', 'casi 600 páginas'),
    ('ochenta y dos pesos', '82 pesos'), ('Ochenta y dos pesos', '82 pesos'), ('ochenta y tres', '83'), ('cuarenta y cinco pesos', '45 pesos'),
    ('cincuenta y tres', '53'), ('treinta y ocho años', '38 años'), ('dieciocho años', '18 años'), ('Le llevará dieciocho', 'Le llevará 18'),
    ('unos seis meses', 'unos 6 meses'), ('doce asaltos', '12 asaltos'), ('unos mil ejemplares; dos mil', 'unos 1.000 ejemplares; 2.000'),
    ('vendía mil ejemplares', 'vendía 1.000 ejemplares'), ('tirada de ocho mil', 'tirada de 8.000'), ('cincuenta millones', '50 millones'),
    ('cuarenta idiomas', '40 idiomas'), ('veinte países', '20 países'), ('noventa y dos años', '92 años'), ('trescientos por ciento', '300 %'),
    ('unos mil ejemplares', 'unos 1.000 ejemplares'), ('dos mil', '2.000'),
]


def digits(t):
    for a, b in NUM:
        t = t.replace(a, b)
    return t


def ts(s):
    h, r = divmod(s, 3600); m, r = divmod(r, 60)
    return f'{int(h):02d}:{int(m):02d}:{int(r):02d},{int(round((r % 1) * 1000)) % 1000:03d}'


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
            text = d['text']
            words = d['words']
            toks = text.split()
            if len(toks) == len(words):
                # Fichas (palabra, inicio, fin) con la grafía del guion; las cifras dichas en letra se funden en una ficha.
                items = [[t, w['s'], w['e']] for t, w in zip(toks, words)]
                for ph, rep in NUM:
                    pw = ph.split()
                    i = 0
                    while i + len(pw) <= len(items):
                        seg = [x[0] for x in items[i:i + len(pw)]]
                        core = [re.sub(r'[.,;:!?»«]+$', '', x) for x in seg]
                        if core == pw:
                            tail = seg[-1][len(core[-1]):]
                            items[i:i + len(pw)] = [[rep + tail, items[i][1], items[i + len(pw) - 1][2]]]
                        i += 1
                groups, cur = [], []
                for it in items:
                    cur.append(it)
                    txt = ' '.join(x[0] for x in cur)
                    end_sentence = re.search(r'[.!?:…»]$', it[0]) is not None
                    if end_sentence or len(txt) > MAX * 2 - 22 or (it[0].endswith(',') and len(txt) > MAX):
                        groups.append(cur); cur = []
                if cur:
                    groups.append(cur)
                for g in groups:
                    subs.append((t0 + g[0][1], t0 + min(g[-1][2], dur) + 0.2, two_lines(' '.join(x[0] for x in g))))
            else:
                cs = chunks(digits(text))
                tot = sum(len(c) for c in cs)
                acc = 0
                for c in cs:
                    a = t0 + dur * acc / tot
                    acc += len(c)
                    b = t0 + dur * acc / tot
                    subs.append((a, b + 0.15, two_lines(c)))
    with open(os.path.join(out, 'cien_anos_historia.es.srt'), 'w') as f:
        for i, (a, b, t) in enumerate(subs, 1):
            f.write(f'{i}\n{ts(a)} --> {ts(min(b, subs[i][0] if i < len(subs) else b))}\n{t}\n\n')
    print(len(subs), 'subtítulos;', f'{total / FPS:.1f} s')
    starts = {s['id']: s['start'] / FPS for s in scenes}
    src = open(os.path.join(os.path.dirname(VO), '..', '..', 'src/scenes/hdl/timeline.ts')).read()
    chs = re.findall(r"\{ label: '([^']+)', from: '(\w+)' \}", src)
    lines = []
    for label, sid in chs:
        t = 0 if sid == 'HOOK' else starts[sid] - 0.3
        lines.append(f'{int(t // 60)}:{int(t % 60):02d} {label}')
    open(os.path.join(out, 'capitulos.txt'), 'w').write('\n'.join(lines) + '\n')
    print('\n'.join(lines))


if __name__ == '__main__':
    main()
