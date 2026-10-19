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


# Palabras tras las que no se corta un subtítulo ni una línea (preposiciones, conjunciones, partículas):
# «nominowana do | Nagrody Zajdla», «i ponad | pięćdziesięcioma», «nawet | za darmo».
NOCUT = {'do', 'od', 'na', 'za', 'po', 'pod', 'nad', 'przed', 'przez', 'przy', 'dla', 'bez', 'ku', 'we', 'ze', 'oraz', 'ani', 'albo',
         'lub', 'czy', 'że', 'żeby', 'który', 'która', 'które', 'którego', 'jak', 'gdy', 'kiedy', 'co', 'nie', 'ponad', 'nawet', 'tylko',
         'tę', 'ten', 'ta', 'to', 'tym', 'tego', 'jego', 'jej', 'ich', 'swój', 'swoje', 'pewien', 'jedno', 'jedna', 'jeden', 'sam',
         'tak', 'aż', 'coraz', 'już', 'jeszcze', 'wciąż', 'by', 'tylu', 'gdyby', 'choć', 'bo', 'ale'}
# Parejas que no se separan en este guion (sintagmas que la regla general no ve).
KEEP = {('muszą', 'pokonać'), ('małych', 'dzieci'), ('zakątków', 'świata'), ('ludzkie', 'gardło'), ('jest', 'szalony'), ('bicie', 'jego'), ('lat', 'później')}


def last_tok(w):
    return w.split('\u00a0')[-1].split(' ')[-1]


def cut_cost(words, k):
    """Coste de cortar entre words[k-1] y words[k] (vale para subtítulos y para líneas)."""
    l, r = words[k - 1], words[k]
    lt = last_tok(l)
    if ends_sentence(l):
        c = 0
    elif lt[-1:] in ',:;' or r in ('–',) or lt == '–':
        c = 3
    elif lt[-1:] == '”':
        c = 8  # tras un título entre comillas
    else:
        c = 12
        if re.search(r'(ych|ymi|imi|ego|emu|ym|im|kiej|nej|wej|tej|łej|rej|dej|giej)$', lt.lower()):
            c += 8  # adjetivo y su sustantivo («o zielonym | świetle», «dwoje małych | dzieci»)
    if lt.lower().strip('„”"«»') in NOCUT and lt[-1:].isalpha():
        c += 30
    r0 = r.split('\u00a0')[0].lower().strip(',.„”')
    if (lt.lower().strip(',.„”'), r0) in KEEP:
        c += 40
    if r0 in ('je', 'go', 'mu', 'mi', 'ci', 'się') and not ends_sentence(l):
        c += 10  # un pronombre átono no abre línea («przełożył | je sam»)
    left = ' '.join(words[:k])
    if left.count('„') > left.count('”'):
        c += 25  # dentro de un título entre comillas
    if lt[:1].isupper() and r[:1].isupper() and lt[-1:].isalpha():
        c += 25  # dentro de un nombre propio («Nowym | Jorku», «Złoty | Kościej»)
    return c


def line_split(words):
    """Mejor corte en dos líneas (≤ MAXC cada una): (coste, k); k = None si cabe en una línea."""
    if len(' '.join(words)) <= MAXC:
        return 0, None
    best = (float('inf'), None)
    for k in range(1, len(words)):
        a, b = ' '.join(words[:k]), ' '.join(words[k:])
        if len(a) > MAXC or len(b) > MAXC:
            continue
        c = abs(len(a) - len(b)) * 0.5 + cut_cost(words, k) + (6 if min(len(a), len(b)) < 12 else 0)
        c += 6 * (sum(ends_sentence(w) for w in words[:k - 1]) + sum(ends_sentence(w) for w in words[k:-1]))  # frase que acaba a media línea
        best = min(best, (c, k))
    return best


def groups_for(ws):
    """Trozos de hasta dos líneas (≤ MAXC), por frases y sin trozos sueltos (lógica de tools/pl_meta.py), elegidos con
    programación dinámica para no cortar tras una preposición o una conjunción ni dentro de un nombre o de un título."""
    words = [x['w'] for x in ws]
    n = len(words)
    INF = float('inf')
    best = [(INF, None)] * (n + 1)
    best[0] = (0, None)
    for i in range(1, n + 1):
        for j in range(i - 1, -1, -1):
            cue = words[j:i]
            if not fits2(cue):
                break
            if best[j][0] == INF:
                continue
            ln = len(' '.join(cue))
            c = best[j][0] + 10 + line_split(cue)[0]
            if ln < 14 and n > 1:
                c += 30
            elif ln < 26:
                c += (26 - ln) / 2
            # una pausa larga dentro del subtítulo («Z zamkniętymi oczami. … Jeśli się odważysz.»)
            c += 10 * sum(1 for k in range(j + 1, i) if ws[k]['s'] - ws[k - 1]['e'] > 0.5)
            inner = any(ends_sentence(w) for w in cue[:-1])
            if i < n:
                c += 1.6 * cut_cost(words, i)  # entre subtítulos el corte pesa más que entre líneas
                # una frase que acaba dentro del subtítulo y otra que empieza y sigue en el siguiente
                if inner and not ends_sentence(cue[-1]):
                    c += 25
            # el final de una frase que viene del subtítulo anterior y, detrás, otra frase
            if inner and j > 0 and not ends_sentence(words[j - 1]):
                c += 12
            if c < best[i][0]:
                best[i] = (c, j)
    gs, i = [], n
    while i > 0:
        j = best[i][1]
        gs.insert(0, ws[j:i]); i = j
    return gs


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
            k = line_split(words)[1]
            t = ' '.join(words[:k]) + '\n' + ' '.join(words[k:])
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
