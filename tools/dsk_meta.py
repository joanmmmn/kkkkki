#!/usr/bin/env python3
"""Subtítulos (.srt) y capítulos del episodio «Por dónde y cómo empezar a leer · Dostoievski» a partir de la locución y la línea de tiempo.
Uso: python3 tools/skg_meta.py <dir_salida>"""
import json, os, re, sys
from dsk_timeline import parse, FPS, VO

MAX = 42  # caracteres por línea; dos líneas por subtítulo


def balanced(words, limit):
    """Parte una lista de palabras en el mínimo de trozos (<= limit) de longitud parecida."""
    text = ' '.join(words)
    n = max(1, -(-len(text) // limit))
    while True:
        target = len(text) / n
        out, cur = [], ''
        for w in words:
            if cur and (len(cur) + 1 + len(w) > limit or (len(cur) >= target and len(out) < n - 1)):
                out.append(cur); cur = w
            else:
                cur = f'{cur} {w}'.strip()
        out.append(cur)
        if all(len(o) <= limit for o in out):
            return out
        n += 1


def chunks(text):
    # Corta por frases y, si una frase es larga, por comas o en trozos equilibrados, de hasta 2 líneas.
    L = MAX * 2 - 4
    parts = re.split(r'(?<=[.!?:…])\s+', text.strip())
    out = []
    for p in parts:
        if len(p) <= L:
            out.append(p)
            continue
        cur = ''
        for piece in re.split(r'(?<=,)\s+', p):
            if len(cur) + len(piece) + 1 <= L:
                cur = f'{cur} {piece}'.strip()
            else:
                if cur:
                    out.append(cur)
                cur = ''
                if len(piece) <= L:
                    cur = piece
                else:
                    out.extend(balanced(piece.split(), L))
        if cur:
            out.append(cur)
    # «No:», «Uno:»… van con lo que sigue; otros trozos muy cortos, con el anterior si cabe.
    fwd = []
    for c in out:
        if fwd and len(fwd[-1]) < 16 and fwd[-1].endswith(':') and len(fwd[-1]) + len(c) + 1 <= MAX * 2 - 2:
            fwd[-1] = f'{fwd[-1]} {c}'
        else:
            fwd.append(c)
    merged = []
    for c in fwd:
        if merged and len(c) < 16 and len(merged[-1]) + len(c) + 1 <= MAX * 2 - 2:
            merged[-1] = f'{merged[-1]} {c}'
        elif merged and len(merged[-1]) < 16 and len(merged[-1]) + len(c) + 1 <= MAX * 2 - 2:
            merged[-1] = f'{merged[-1]} {c}'
        else:
            merged.append(c)
    return merged


WEAK = {'el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'y', 'o', 'a', 'en', 'con', 'por', 'su', 'sus', 'que', 'al', 'lo', 'se', 'le', 'mi', 'tu'}
TITLES = ['Noches blancas', 'Crimen y castigo', 'El jugador', 'Memorias del subsuelo', 'El idiota', 'Los hermanos Karamázov', 'Los demonios',
          'El sueño de un hombre ridículo', 'El gran inquisidor', 'Pobres gentes', 'Memorias de la casa muerta', 'Nuevo Testamento', 'El Libro Total',
          'San Petersburgo', 'Jordi Boixaderas', 'Txema Regalado', 'Germán Gijón', 'Omar Barrera', 'Anna Snítkina', 'el libro es el mismo', 'todos los caminos']


def two_lines(t):
    if len(t) <= MAX:
        return t
    words = t.split()
    best = None
    for i in range(1, len(words)):
        a, b = ' '.join(words[:i]), ' '.join(words[i:])
        if len(a) <= MAX and len(b) <= MAX:
            score = abs(len(a) - len(b))
            last = words[i - 1].lower().strip('¿¡«»"')
            if last in WEAK:
                score += 30  # no cortar tras artículo o preposición
            if any(ti in t and t.index(ti) < len(a) < t.index(ti) + len(ti) for ti in TITLES):
                score += 60  # no partir un título o un nombre
            if a.endswith((',', '.', ':', ';', '?', '!')):
                score -= 6
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
            text = d['text'].replace('«voz digital»', '«Voz digital»')
            cs = chunks(text)
            # Reparto proporcional a los caracteres (las palabras alineadas pueden ser la grafía hablada).
            tot = sum(len(c) for c in cs)
            acc = 0
            for c in cs:
                a = t0 + dur * acc / tot
                acc += len(c)
                b = t0 + dur * acc / tot
                subs.append((a, b + 0.15, two_lines(c)))
    with open(os.path.join(out, 'dostoievski_guia.es.srt'), 'w') as f:
        for i, (a, b, t) in enumerate(subs, 1):
            f.write(f'{i}\n{ts(a)} --> {ts(min(b, subs[i][0] if i < len(subs) else b))}\n{t}\n\n')
    print(len(subs), 'subtítulos;', f'{total / FPS:.1f} s')
    starts = {s['id']: s['start'] / FPS for s in scenes}
    src = open(os.path.join(os.path.dirname(VO), '..', '..', 'src/scenes/dsk/timeline.ts')).read()
    chs = re.findall(r"\{ label: '([^']+)', from: '(\w+)' \}", src)
    lines = []
    for label, sid in chs:
        t = 0 if sid == 'HOOK' else starts[sid] - 0.3
        lines.append(f'{int(t // 60)}:{int(t % 60):02d} {label}')
    open(os.path.join(out, 'capitulos.txt'), 'w').write('\n'.join(lines) + '\n')
    print('\n'.join(lines))


if __name__ == '__main__':
    main()
