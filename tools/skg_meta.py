#!/usr/bin/env python3
"""Subtítulos (.srt) y capítulos del episodio de Stephen King (versión polaca, «Od czego i jak zacząć») a partir de la locución
y la línea de tiempo. Uso: python3 tools/skg_meta.py <dir_salida>"""
import json, os, re, sys
from skg_timeline import parse, FPS, VO

MAX = 42  # caracteres por línea; dos líneas por subtítulo

# Subtítulos con la misma lógica que la plantilla polaca (tools/pl_meta.py de la rama pl-recenzje): palabras del texto
# que se ve con los tiempos de las palabras dichas, espacio duro donde la tipografía polaca no deja partir (palabras de una
# o dos letras + la siguiente, grupos de cifras, cifra + unidad, títulos entre comillas), dos líneas de 42 caracteres como
# mucho y sin trozos sueltos.
UNITS = {'zł', 'gr', 'h', 'min', 's', 'dni', 'dzień', 'tys.', 'mln', 'mld', '%', 'zł,', 'zł.', 'h,', 'h.', 'dni,', 'dni.', 'min.', 'min,',
         'roku', 'roku.', 'roku,', 'roku:', 'godzin', 'godzin.', 'godzin,', 'słów'}


def norm(w):
    import unicodedata
    w = w.lower().replace('ł', 'l')
    return ''.join(c for c in unicodedata.normalize('NFD', w) if unicodedata.category(c) != 'Mn' and c.isalnum())


def timed_words(d):
    """Palabras del texto que se ve, con los tiempos de las palabras dichas (las que no casan, como las cifras, se interpolan)."""
    shown = d['text'].split()
    spoken = d['words']
    res, j = [], 0
    for w in shown:
        n, hit = norm(w), None
        if n and not any(ch.isdigit() for ch in w):
            for k in range(j, min(len(spoken), j + 12)):
                if norm(spoken[k]['w']) == n:
                    hit = k
                    break
        if hit is not None:
            res.append({'w': w, 's': spoken[hit]['s'], 'e': spoken[hit]['e']})
            j = hit + 1
        else:
            res.append({'w': w, 's': None, 'e': None})
    end = d.get('speechEnd') or d['duration']
    for i, r in enumerate(res):
        if r['s'] is None:
            prev = next((res[k]['e'] for k in range(i - 1, -1, -1) if res[k]['e'] is not None), 0.0)
            nxt_i = next((k for k in range(i + 1, len(res)) if res[k]['s'] is not None), None)
            nxt = res[nxt_i]['s'] if nxt_i is not None else end
            gap = nxt_i - i if nxt_i is not None else len(res) - i
            step = (nxt - prev) / (gap + 1)
            r['s'] = prev + step * 0.1
            r['e'] = prev + step
    return res


def glue(ws):
    out = []
    for w in ws:
        if out:
            prev = out[-1]['w'].split('\u00a0')[-1].lstrip('„“"(')
            digits_prev = prev.replace(',', '').replace('.', '').isdigit()
            whole = out[-1]['w']
            join = (len(prev) <= 2 and prev.isalpha()) \
                or (digits_prev and (w['w'][:3].isdigit() and len(w['w'].rstrip('.,;:!?')) == 3)) \
                or (digits_prev and w['w'].lower() in UNITS) \
                or w['w'][:2] in ('’6', "'6") \
                or whole.count('„') > whole.count('”') \
                or (prev[:1].isupper() and prev.isalpha() and w['w'][:1].isupper() and len(whole) + len(w['w']) < 30)
            # (lo último: nombres propios de varias palabras, «Nagrodę Edgara», «Jan Peszek», «Holly Gibney»; y un título
            # entre comillas no se parte)
            if join:
                out[-1] = {'w': out[-1]['w'] + '\u00a0' + w['w'], 's': out[-1]['s'], 'e': w['e']}
                continue
        out.append(dict(w))
    return out


def fits2(words, max_chars=MAX):
    if len(' '.join(words)) <= max_chars:
        return True
    return any(len(' '.join(words[:k])) <= max_chars and len(' '.join(words[k:])) <= max_chars for k in range(1, len(words)))


def _txt(g):
    return ' '.join(x['w'] for x in g)


def _split_at(ws, ends):
    out, cur = [], []
    for w in ws:
        cur.append(w)
        if w['w'].rstrip('”"»)')[-1:] in ends:
            out.append(cur)
            cur = []
    if cur:
        out.append(cur)
    return out


CONJ = ('i\u00a0', 'a\u00a0', 'albo', 'oraz', 'czy', 'że', 'żeby', 'który', 'która', 'które', 'którego', 'kiedy', 'ale', 'bo\u00a0', 'w\u00a0tym')


def _cut_score(left, right, w=1.0):
    """Cuanto menor, mejor sitio para partir: longitudes parejas, y mejor tras una coma o antes de una conjunción
    (`w` da más peso a eso al partir entre subtítulos que al partir entre las dos líneas de uno)."""
    sc = abs(len(left) - len(right))
    if left[-1:] in ',:;':
        sc -= 20 * w
    if right.lower().startswith(CONJ):
        sc -= 12 * w
    return sc


def _balanced(ws):
    """Parte una lista de palabras demasiado larga en el menor número de trozos de dos líneas (en dos, por el mejor sitio)."""
    words = [x['w'] for x in ws]
    cands = [k for k in range(1, len(ws)) if fits2(words[:k]) and fits2(words[k:])]
    if cands:
        k = min(cands, key=lambda k: _cut_score(' '.join(words[:k]), ' '.join(words[k:]), 4))
        return [ws[:k], ws[k:]]
    n = 3
    while True:
        target = len(_txt(ws)) / n
        parts, cur = [], []
        for w in ws:
            if cur and len(_txt(cur + [w])) > target + 6 and len(parts) < n - 1:
                parts.append(cur)
                cur = []
            cur.append(w)
        parts.append(cur)
        if all(fits2([x['w'] for x in p_]) for p_ in parts) or n > 8:
            return parts
        n += 1


def groups_of(ws):
    """Un subtítulo por frase si cabe en dos líneas; si no, se corta por las comas, los dos puntos o el punto y coma,
    y solo si un trozo sigue sin caber, por palabras en partes parejas. Los trozos cortos se juntan con el anterior."""
    gs = []
    for sent in _split_at(ws, '.?!…'):
        if fits2([x['w'] for x in sent]):
            gs.append(sent)
            continue
        cur = []
        for cl in _split_at(sent, ',:;–'):
            if fits2([x['w'] for x in cur + cl]):
                cur = cur + cl
                continue
            if cur:
                gs.append(cur)
                cur = []
            if fits2([x['w'] for x in cl]):
                cur = cl
            else:
                parts = _balanced(cl)
                gs += parts[:-1]
                cur = parts[-1]
        if cur:
            gs.append(cur)
    k = 1
    while k < len(gs):
        cur, prev = gs[k], gs[k - 1]
        if len(_txt(cur)) < 14:
            if fits2([x['w'] for x in prev + cur]):
                gs[k - 1] = prev + cur
                del gs[k]
                continue
            while len(prev) > 1 and len(_txt(cur)) < 14 and fits2([x['w'] for x in [prev[-1]] + cur]) and prev[-2]['w'][-1] not in '.?!':
                cur.insert(0, prev.pop())
        k += 1
    if len(gs) > 1 and len(_txt(gs[0])) < 14 and fits2([x['w'] for x in gs[0] + gs[1]]):
        gs[1] = gs[0] + gs[1]
        del gs[0]
    return gs


def two_lines(t):
    if len(t) <= MAX:
        return t
    words = t.split(' ')  # el espacio duro no se parte
    best = min(range(1, len(words)), key=lambda k: (max(len(' '.join(words[:k])), len(' '.join(words[k:]))) > MAX,
                                                    _cut_score(' '.join(words[:k]), ' '.join(words[k:]))))
    return ' '.join(words[:best]) + '\n' + ' '.join(words[best:])


def ts(s):
    ms = int(round(s * 1000))
    return f'{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}'


def main():
    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    scenes, total = parse()
    groups = []
    for sc in scenes:
        for vid, at in sc['vo']:
            d = json.load(open(os.path.join(VO, f'{vid}.json')))
            t0 = (sc['start'] + at) / FPS
            ws = [{'w': w['w'], 's': t0 + w['s'], 'e': t0 + w['e']} for w in glue(timed_words(d))]
            groups += groups_of(ws)
    subs = []
    for i, g in enumerate(groups):
        a, b = g[0]['s'], g[-1]['e']
        b = max(b + 0.25, a + 1.0)
        if i + 1 < len(groups):
            b = min(b, groups[i + 1][0]['s'] - 0.04)
        subs.append((a, b, two_lines(' '.join(x['w'] for x in g))))
    with open(os.path.join(out, 'stephen_king_od_czego_zaczac.pl.srt'), 'w') as f:
        for i, (a, b, t) in enumerate(subs, 1):
            f.write(f'{i}\n{ts(a)} --> {ts(b)}\n{t}\n\n')
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
