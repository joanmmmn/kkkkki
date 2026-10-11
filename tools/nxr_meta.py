#!/usr/bin/env python3
"""Capítulos de YouTube y subtítulos (.srt) de la reseña de Nextory y de su vertical, a partir de la locución.

Uso: python3 tools/nxr_meta.py [--out blog/nextory]
Lee las escenas de video/src/scenes/nxr/timeline.ts (simple('R01', extra, lead)) y del vertical (Short.tsx),
las locuciones de video/public/nxr/vo/<id>.json y repite las cuentas del vídeo (lead + voz + 0,32 s + extra).
Sin locución, estima 13 caracteres/s como el vídeo (sirve para revisar, no para publicar).
"""
import json, math, os, re, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
V = os.path.join(ROOT, 'video')
FPS = 50
CPS = 13
cfg = json.load(open(os.path.join(V, 'public/nxr/vo/vo.json')))
TEXT = {s['id']: s['text'] for s in cfg['scenes']}


def vo(id_):
    p = os.path.join(V, 'public/nxr/vo', f'{id_}.json')
    return json.load(open(p)) if os.path.exists(p) else None


def sec(s):
    return round(s * FPS)


def speech_frames(id_):
    v = vo(id_)
    if v:
        return math.ceil(v.get('speechEnd', v['duration']) * FPS)
    return sec(len(TEXT[id_]) / CPS)


def words(id_):
    v = vo(id_)
    if v:
        return v['words']
    out = []
    for m in re.finditer(r'\S+', TEXT[id_]):
        out.append({'w': m.group(0), 's': m.start() / CPS, 'e': m.end() / CPS})
    return out


def review_scenes():
    src = open(os.path.join(V, 'src/scenes/nxr/timeline.ts')).read()
    block = src[src.index('export const NXR_SCENES'):src.index('];', src.index('export const NXR_SCENES'))]
    out = []
    for m in re.finditer(r"simple\('(\w+)'(?:,\s*(\d+))?(?:,\s*sec\(([\d.]+)\))?\)", block):
        id_, extra, lead = m.group(1), int(m.group(2) or 0), sec(float(m.group(3))) if m.group(3) else sec(0.12)
        out.append({'id': id_, 'lead': lead, 'dur': lead + speech_frames(id_) + sec(0.32) + extra})
    a = 0
    for s in out:
        s['at'] = a
        a += s['dur']
    chapters = [(m.group(1), m.group(2)) for m in re.finditer(r"\{ label: '([^']+)', from: '(\w+)' \}", src)]
    return out, a, chapters


def short_pieces():
    src = open(os.path.join(V, 'src/scenes/nxr/Short.tsx')).read()
    ids = re.findall(r"'(Q\d+)'", src[src.index('const IDS'):src.index('\n', src.index('const IDS'))])
    extra = dict(re.findall(r"(Q\d+): (\d+)", src[src.index('const EXTRA'):src.index('\n', src.index('const EXTRA'))]))
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
        for w in words(s['id']):
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
    out_dir = os.path.join(ROOT, sys.argv[sys.argv.index('--out') + 1]) if '--out' in sys.argv else os.path.join(ROOT, 'blog/nextory')
    scenes, total, chapters = review_scenes()
    missing = [s['id'] for s in scenes if not vo(s['id'])]
    if missing:
        print(f'AVISO: sin locución para {len(missing)} escenas ({", ".join(missing[:6])}…): tiempos estimados.')
    start = {s['id']: s['at'] for s in scenes}
    print(f'Reseña: {total} fotogramas ({ts(total / FPS, False)})')
    print('\nCapítulos:')
    print(f'0:00 ¿Merece la pena Nextory?')
    for label, frm in chapters:
        print(f'{ts(start[frm] / FPS, False)} {label}')
    open(os.path.join(out_dir, 'nextory_resena.es.srt'), 'w').write(cues(scenes))
    pieces, stotal = short_pieces()
    print(f'\nVertical: {stotal} fotogramas ({ts(stotal / FPS, False)})')
    open(os.path.join(out_dir, 'nextory_resena_vertical.es.srt'), 'w').write(cues(pieces, max_line=32, max_dur=4))
    print('Subtítulos escritos en', os.path.relpath(out_dir, ROOT))


if __name__ == '__main__':
    main()
