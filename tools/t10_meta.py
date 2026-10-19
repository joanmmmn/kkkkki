#!/usr/bin/env python3
"""Subtítulos (.srt) y capítulos de «10 historii grozy, które naprawdę przerażają» (SonorBooks Polska) a partir de la locución
y la línea de tiempo; también el .srt del vertical. Las cifras que la voz dice en letra van en número en los subtítulos.
Cortes como tools/pl_meta.py de la plantilla polaca: dos líneas de 42 caracteres como máximo, sin trozos sueltos y con espacio
duro (norma tipográfica polaca) entre una palabra de una letra y la siguiente, entre cifra y palabra, en los ordinales y en las
iniciales («H.P.»).
Uso: python3 tools/t10_meta.py <dir_salida>"""
import json, math, os, re, sys, unicodedata

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from t10_timeline import parse, FPS, VO, sec  # noqa: E402
from skg_meta import ts  # noqa: E402

# Polaco: las cifras van en número en `text` (vo.json); solo quedan en letra algunas fórmulas habladas.
NUM = [
    ('Numer dziesięć', 'Numer 10'), ('Numer dziewięć', 'Numer 9'), ('Numer osiem', 'Numer 8'), ('Numer siedem', 'Numer 7'), ('Numer sześć', 'Numer 6'),
    ('Numer pięć', 'Numer 5'), ('Numer cztery', 'Numer 4'), ('Numer trzy', 'Numer 3'), ('Numer dwa', 'Numer 2'), ('Numer jeden', 'Numer 1'),
    ('Oto dziesięć historii', 'Oto 10 historii'), ('trzydzieści kilometrów', '30 kilometrów'),
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


MAXC = 42
UNITS = {'zł', 'gr', 'h', 'min', 's', 'dni', 'dzień', 'tys.', 'mln', 'mld', '%', 'zł,', 'zł.', 'h,', 'h.', 'dni,', 'dni.', 'min.', 'min,', 'km'}


def norm(w):
    w = w.lower().replace('ł', 'l')
    return ''.join(c for c in unicodedata.normalize('NFD', w) if unicodedata.category(c) != 'Mn' and c.isalnum())


def timed_words(d):
    """Palabras del texto que se ve (con las cifras en número), con los tiempos de las palabras dichas; las que no casan
    (cifras, nombres que se dicen de otra forma) se interpolan entre sus vecinas."""
    shown = digits(d['text']).split()
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
            res.append({'w': w, 's': spoken[hit]['s'], 'e': spoken[hit]['e']}); j = hit + 1
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
            prev = out[-1]['w'].split(' ')[-1]
            digits_prev = bool(re.match(r'^\d+([.,]\d+)?$', prev))
            ordinal = bool(re.match(r'^\d+\.$', prev)) and w['w'][:1].islower()
            initials = bool(re.match(r'^([A-ZŁŚŻŹĆ]\.)+$', prev))  # «H.P. Lovecrafta»
            single = len(norm(prev)) == 1 and prev.strip('„”"«»–-').isalpha()  # «i», «w», «z», «a», «o», «u»
            join = single or ordinal or initials \
                or (digits_prev and (w['w'][:3].isdigit() and len(w['w'].rstrip('.,;:!?')) == 3)) \
                or (digits_prev and w['w'][:1].isalpha()) \
                or (digits_prev and w['w'].lower() in UNITS)
            if join:
                out[-1] = {'w': out[-1]['w'] + ' ' + w['w'], 's': out[-1]['s'], 'e': w['e']}
                continue
        out.append(dict(w))
    return out


def ends_sentence(w, extra=''):
    return w.split(' ')[-1].rstrip('”"»')[-1:] in '.?!…' + extra


def fits2(words, m=MAXC):
    if len(' '.join(words)) <= m:
        return True
    return any(len(' '.join(words[:k])) <= m and len(' '.join(words[k:])) <= m for k in range(1, len(words)))


def groups_for(ws):
    """Trozos de hasta dos líneas, por frases, sin trozos sueltos muy cortos (lógica de tools/pl_meta.py)."""
    gs, line = [], []
    for k, w in enumerate(ws):
        cand = [x['w'] for x in line] + [w['w']]
        if line and (not fits2(cand) or (len(' '.join(cand)) > MAXC and ends_sentence(line[-1]['w'], ':'))):
            # mejor cortar tras una coma o dos puntos cercanos que en mitad de una frase; y nunca dentro de un nombre («Nowym | Jorku»)
            cut = len(line)
            for i in range(len(line) - 1, 0, -1):
                tail = ' '.join(x['w'] for x in line[i:])
                if len(tail) > 26:
                    break
                if line[i - 1]['w'][-1:] in ',:;–' or line[i - 1]['w'] in ('–',):
                    cut = i
                    break
            if cut == len(line) and line[-1]['w'][:1].isupper() and w['w'][:1].isupper() and line[-1]['w'][-1:].isalpha() and len(line) > 1:
                cut = len(line) - 1
            gs.append(line[:cut]); line = line[cut:]
        line.append(w)
        if ends_sentence(w['w']) and len(' '.join(x['w'] for x in line)) > 18 and k + 1 < len(ws):
            gs.append(line); line = []
    if line:
        gs.append(line)
    k = 1
    while k < len(gs):
        cur, prev = gs[k], gs[k - 1]
        if len(' '.join(x['w'] for x in cur)) < 14:
            if fits2([x['w'] for x in prev + cur]):
                gs[k - 1] = prev + cur; del gs[k]; continue
            while len(prev) > 1 and len(' '.join(x['w'] for x in cur)) < 14 and fits2([x['w'] for x in [prev[-1]] + cur]) and not ends_sentence(prev[-2]['w']):
                cur.insert(0, prev.pop())
        k += 1
    return gs


def split_penalty(words, k):
    """No partir un título entre comillas («„Jak sprzedać nawiedzony | dom”») ni un nombre propio («Edgar Allan | Poe»)."""
    left, l, r = ' '.join(words[:k]), words[k - 1], words[k]
    pen = 0
    if left.count('„') > left.count('”'):
        pen += 20
    if l[:1].isupper() and r[:1].isupper() and l[-1:].isalpha() and not ends_sentence(l):
        pen += 20
    return pen


def write_srt(path, items):
    """items: [(segundo de inicio de la locución, json de la locución)]"""
    groups = []
    for t0, d in items:
        ws = [{'w': w['w'], 's': t0 + w['s'], 'e': t0 + w['e']} for w in glue(timed_words(d))]
        groups += groups_for(ws)
    out = []
    for i, g in enumerate(groups):
        a, b, t = g[0]['s'], g[-1]['e'], ' '.join(x['w'] for x in g)
        b = max(b + 0.25, a + 1.0)
        if i + 1 < len(groups):
            b = min(b, groups[i + 1][0]['s'] - 0.04)
        if len(t) > MAXC:
            words = t.split(' ')
            best = min(range(1, len(words)), key=lambda k: (max(len(' '.join(words[:k])), len(' '.join(words[k:]))) > MAXC,
                                                            abs(len(' '.join(words[:k])) - len(' '.join(words[k:]))) + split_penalty(words, k)))
            t = ' '.join(words[:best]) + '\n' + ' '.join(words[best:])
        out.append(f'{i + 1}\n{ts(a)} --> {ts(b)}\n{t}\n')
    open(path, 'w').write('\n'.join(out))
    return len(groups)


def main():
    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    scenes, total = parse()
    load = lambda v: json.load(open(os.path.join(VO, f'{v}.json')))
    items = [((s['start'] + at) / FPS, load(vid)) for s in scenes for vid, at in s['vo']]
    n = write_srt(os.path.join(out, 'top10-horror.pl.srt'), items)
    print(n, 'subtítulos;', f'{total / FPS:.1f} s')
    starts = {s['id']: s['start'] / FPS for s in scenes}
    lines = []
    for label, sid in CHAPTERS:
        t = 0 if sid == 'HOOK' else starts[sid] - 0.2
        lines.append(f'{int(t // 60)}:{int(t % 60):02d} {label}')
    open(os.path.join(out, 'capitulos.txt'), 'w').write('\n'.join(lines) + '\n')
    print('\n'.join(lines))
    if all(os.path.exists(os.path.join(VO, f'{v}.json')) for v, _ in SHORT):
        t, sitems = 0, []
        for v, gap in SHORT:
            t += sec(gap)
            d = load(v)
            sitems.append((t / FPS, d))
            t += math.ceil((d.get('speechEnd') or d['duration']) * FPS)
        print(write_srt(os.path.join(out, 'top10-horror_short.pl.srt'), sitems), 'subtítulos del vertical')


if __name__ == '__main__':
    main()
