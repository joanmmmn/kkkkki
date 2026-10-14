#!/usr/bin/env python3
"""Capítulos de YouTube y subtítulos (.srt) de la reseña de Audible y de su vertical, a partir de la locución.

Uso: python3 tools/aud_meta.py [--out deliverables/audible/resena] [--starts]
Lee las escenas de video/src/scenes/aud/timeline.ts (simple('G01', extra, lead)) y del vertical (Short.tsx),
las locuciones de video/public/aud/vo/<id>.json y repite las cuentas del vídeo (lead + voz + 0,32 s + extra).
Sin locución, estima 13 caracteres/s como el vídeo (sirve para revisar, no para publicar).
"""
import json, math, os, re, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
V = os.path.join(ROOT, 'video')
FPS = 50
CPS = 13
cfg = json.load(open(os.path.join(V, 'public/aud/vo/vo.json')))
TEXT = {s['id']: s['text'] for s in cfg['scenes']}


def vo(id_):
    p = os.path.join(V, 'public/aud/vo', f'{id_}.json')
    return json.load(open(p)) if os.path.exists(p) else None


def sec(s):
    return round(s * FPS)


def speech_frames(id_):
    v = vo(id_)
    if v:
        return math.ceil(v.get('speechEnd', v['duration']) * FPS)
    return sec(len(TEXT[id_]) / CPS)


# En los subtítulos, las cifras que la voz dice en letra se escriben con números («ocho noventa y nueve» → «8,99 €»).
NUMEROS = [
    (['nueve', 'noventa', 'y', 'nueve'], '9,99 €'), (['seis', 'noventa', 'y', 'nueve'], '6,99 €'), (['quince', 'diez'], '15,10 €'),
    (['noventa', 'mil'], '90.000'), (['dos', 'mil', 'veinte'], '2020'), (['treinta', 'y', 'seis', 'mil'], '36.000'),
    (['cuatro', 'coma', 'siete'], '4,7'), (['cuatro', 'coma', 'cinco'], '4,5'), (['top', 'veinte'], 'top 20'),
    (['treinta', 'dias'], '30 días'), (['tres', 'veces', 'y', 'media'], '3,5 veces'),
]


def _n(w):
    import unicodedata
    return ''.join(c for c in unicodedata.normalize('NFD', w.lower()) if unicodedata.category(c) != 'Mn').strip('.,;:¿?¡!«»…')


def cifras(ws):
    out, i = [], 0
    while i < len(ws):
        for pat, rep in NUMEROS:
            seg = ws[i:i + len(pat)]
            if len(seg) == len(pat) and [_n(x['w']) for x in seg] == pat:
                last = seg[-1]['w']
                tail = last[len(last.rstrip('.,;:?!…»')):]
                head = seg[0]['w'][:len(seg[0]['w']) - len(seg[0]['w'].lstrip('¿¡«'))]
                out.append({'w': head + rep + tail, 's': seg[0]['s'], 'e': seg[-1]['e']})
                i += len(pat)
                break
        else:
            out.append(ws[i])
            i += 1
    return out


def words(id_, numeros=False):
    v = vo(id_)
    if v:
        return cifras(v['words']) if numeros else v['words']
    out = []
    for m in re.finditer(r'\S+', TEXT[id_]):
        out.append({'w': m.group(0), 's': m.start() / CPS, 'e': m.end() / CPS})
    return out


def review_scenes():
    src = open(os.path.join(V, 'src/scenes/aud/timeline.ts')).read()
    block = src[src.index('export const AUD_SCENES'):src.index('];', src.index('export const AUD_SCENES'))]
    out = []
    # simple('R03', 18, sec(0.52), 'Precios y planes') · simple('R04B', 12, sec(0.2), undefined, 'cut') · simple('P03', 12, LEAD, undefined, 'slide')
    pat = r"simple\('(\w+)'(?:,\s*(\d+))?(?:,\s*(?:sec\(([\d.]+)\)|LEAD))?(?:,\s*(?:'([^']*)'|undefined))?(?:,\s*'(\w+)')?\)"
    for m in re.finditer(pat, block):
        id_, extra, lead = m.group(1), int(m.group(2) or 0), sec(float(m.group(3))) if m.group(3) else sec(0.12)
        out.append({'id': id_, 'lead': lead, 'dur': lead + speech_frames(id_) + sec(0.32) + extra, 'bump': m.group(4)})
    a = 0
    for s in out:
        s['at'] = a
        a += s['dur']
    chapters = [(m.group(1), m.group(2)) for m in re.finditer(r"\{ label: '([^']+)', from: '(\w+)' \}", src)]
    return out, a, chapters


def short_pieces():
    src = open(os.path.join(V, 'src/scenes/aud/Short.tsx')).read()
    ids = re.findall(r"'(J\d+)'", src[src.index('const IDS'):src.index('\n', src.index('const IDS'))])
    extra = dict(re.findall(r"(J\d+): (\d+)", src[src.index('const EXTRA'):src.index('\n', src.index('const EXTRA'))]))
    lead = 6
    out, a = [], 0
    for id_ in ids:
        d = lead + speech_frames(id_) + int(extra[id_])
        out.append({'id': id_, 'lead': lead, 'dur': d, 'at': a})
        a += d
    return out, a


def ts(t, srt=True):
    ms = int(round(t * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f'{h:02d}:{m:02d}:{s:02d},{ms:03d}' if srt else (f'{h}:{m:02d}:{s:02d}' if h else f'{m}:{s:02d}')


def cues(scenes, max_line=42, max_dur=5.5):
    """Agrupa palabras en subtítulos de hasta dos líneas, cortando en signos de puntuación cuando se puede."""
    out = []
    for s in scenes:
        base = (s['at'] + s['lead']) / FPS
        cur = []
        for w in words(s['id'], numeros=True):
            nw = {'w': w['w'], 's': base + w['s'], 'e': base + w['e']}
            # Si con esta palabra el subtítulo se pasa de largo o de tiempo, se cierra antes.
            too_long = bool(cur) and len(' '.join(x['w'] for x in cur + [nw])) > 2 * max_line - 4
            too_slow = bool(cur) and nw['e'] - cur[0]['s'] > max_dur
            # Sin huérfanas: la última palabra de una frase se queda con las demás si cabe (aunque dure un poco más).
            if too_slow and not too_long and re.search(r'[.?!…]$', w['w']) and nw['e'] - cur[0]['s'] <= max_dur + 1.5:
                too_slow = False
            if cur and (too_long or too_slow):
                out.append(cur)
                cur = []
            cur.append(nw)
            text = ' '.join(x['w'] for x in cur)
            if re.search(r'[.?!…]$', w['w']) or (re.search(r'[,;:]$', w['w']) and len(text) > max_line):
                out.append(cur)
                cur = []
        if cur:
            out.append(cur)
    # Sin huérfanas tampoco al partir por largo: si un subtítulo se queda en una sola palabra que cierra frase,
    # se le pasan las últimas palabras del anterior (cortando antes de «o», «y», «que», «para», «en», «de» o «con» si se puede).
    for i in range(1, len(out)):
        prev, cur = out[i - 1], out[i]
        if len(cur) == 1 and re.search(r'[.?!…]$', cur[0]['w']) and len(prev) >= 6 and cur[0]['s'] - prev[-1]['e'] < 0.3:
            m = next((k for k in range(2, min(6, len(prev) - 2)) if prev[-k]['w'].lower() in ('o', 'y', 'que', 'para', 'en', 'de', 'con')), 3)
            out[i - 1], out[i] = prev[:-m], prev[-m:] + cur
    lines = []
    for i, c in enumerate(out):
        text = ' '.join(x['w'] for x in c)
        if len(text) > max_line:  # partir en dos líneas equilibradas
            best, cut = None, None
            acc = 0
            for k in range(1, len(c)):
                acc = len(' '.join(x['w'] for x in c[:k]))
                diff = abs(acc - (len(text) - acc - 1))
                if best is None or diff < best:
                    best, cut = diff, k
            text = ' '.join(x['w'] for x in c[:cut]) + '\n' + ' '.join(x['w'] for x in c[cut:])
        start = c[0]['s']
        end = c[-1]['e'] + 0.25
        if i + 1 < len(out):
            end = min(end, out[i + 1][0]['s'] - 0.04)
        lines.append((start, max(end, start + 0.6), text))
    return '\n'.join(f'{i + 1}\n{ts(a)} --> {ts(b)}\n{t}\n' for i, (a, b, t) in enumerate(lines))


def main():
    out_dir = os.path.join(ROOT, sys.argv[sys.argv.index('--out') + 1]) if '--out' in sys.argv else os.path.join(ROOT, 'deliverables/audible/resena')
    scenes, total, chapters = review_scenes()
    missing = [s['id'] for s in scenes if not vo(s['id'])]
    if missing:
        print(f'AVISO: sin locución para {len(missing)} escenas ({", ".join(missing[:6])}…): tiempos estimados.')
    start = {s['id']: s['at'] for s in scenes}
    print(f'Reseña: {total} fotogramas ({ts(total / FPS, False)})')
    print('\nCapítulos:')
    print(f'0:00 ¿Merece la pena Audible?')
    bumps = {s['id'] for s in scenes if s.get('bump')}
    for label, frm in chapters:
        # Con separador, el capítulo empieza cuando entran los paneles (14 fotogramas antes de la escena).
        f = start[frm] - (14 if frm in bumps else 0)
        print(f'{ts(f / FPS, False)} {label}')
    if '--starts' in sys.argv:
        print('\nInicio de cada escena (fotograma):')
        print(json.dumps({s['id']: [s['at'], s['dur'], s['lead']] for s in scenes}))
    os.makedirs(out_dir, exist_ok=True)
    open(os.path.join(out_dir, 'audible_resena.es.srt'), 'w').write(cues(scenes))
    if not os.path.exists(os.path.join(V, 'src/scenes/aud/Short.tsx')):
        print('Subtítulos escritos en', os.path.relpath(out_dir, ROOT), '(sin vertical todavía)')
        return
    pieces, stotal = short_pieces()
    print(f'\nVertical: {stotal} fotogramas ({ts(stotal / FPS, False)})')
    open(os.path.join(out_dir, 'audible_resena_vertical.es.srt'), 'w').write(cues(pieces, max_line=32, max_dur=4))
    print('Subtítulos escritos en', os.path.relpath(out_dir, ROOT))


if __name__ == '__main__':
    main()
