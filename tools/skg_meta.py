#!/usr/bin/env python3
"""Subtítulos (.srt) y capítulos del episodio de Stephen King (versión polaca, «Od czego i jak zacząć») a partir de la locución
y la línea de tiempo. Uso: python3 tools/skg_meta.py <dir_salida>"""
import json, os, re, sys
from skg_timeline import parse, FPS, VO

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
            cs = chunks(text)
            # Reparto proporcional a los caracteres (las palabras alineadas pueden ser la grafía hablada).
            tot = sum(len(c) for c in cs)
            acc = 0
            for c in cs:
                a = t0 + dur * acc / tot
                acc += len(c)
                b = t0 + dur * acc / tot
                subs.append((a, b + 0.15, two_lines(c)))
    with open(os.path.join(out, 'stephen_king_od_czego_zaczac.pl.srt'), 'w') as f:
        for i, (a, b, t) in enumerate(subs, 1):
            f.write(f'{i}\n{ts(a)} --> {ts(min(b, subs[i][0] if i < len(subs) else b))}\n{t}\n\n')
    print(len(subs), 'subtítulos;', f'{total / FPS:.1f} s')
    starts = {s['id']: s['start'] / FPS for s in scenes}
    src = open(os.path.join(os.path.dirname(VO), '..', '..', 'src/scenes/skg/timeline.ts')).read()
    chs = re.findall(r"\{ label: '([^']+)', from: '(\w+)' \}", src)
    lines = []
    for label, sid in chs:
        t = 0 if sid == 'HOOK' else starts[sid] - 0.3
        lines.append(f'{int(t // 60)}:{int(t % 60):02d} {label}')
    open(os.path.join(out, 'capitulos.txt'), 'w').write('\n'.join(lines) + '\n')
    print('\n'.join(lines))


if __name__ == '__main__':
    main()
