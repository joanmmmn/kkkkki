#!/usr/bin/env python3
"""SonorBooks Polska: línea de tiempo, capítulos de YouTube y subtítulos (.srt) de una pieza.

Uso: python3 tools/pl_meta.py <pieza> [--out deliverables/pl/<pieza>] [--starts]

Repite las cuentas de video/src/pl/Review.tsx (buildTimeline) leyendo las escenas de video/src/pl/specs/<pieza>.tsx
(id, kind, bump, extra, lead) y las locuciones de video/public/pl/<pieza>/vo/<ID>.json.
Los subtítulos usan el texto que se ve (`text`, con cifras) cronometrado con las palabras dichas (`say`).
"""
import json, math, os, re, sys, unicodedata

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
V = os.path.join(ROOT, 'video')
FPS = 50
CPS = 15.5
BUMP_IN = 14
OUTRO_HOLD = 375


def rnd(x):
    return math.floor(x + 0.5)  # Math.round de JavaScript


def sec(s):
    return rnd(s * FPS)


def norm(w):
    w = w.lower().replace('ł', 'l')
    return ''.join(c for c in unicodedata.normalize('NFD', w) if unicodedata.category(c) != 'Mn' and c.isalnum())


def parse_spec(slug):
    src = open(os.path.join(V, 'src/pl/specs', f'{slug}.tsx'), encoding='utf-8').read()
    body = src[src.index('scenes:'):]
    scenes = []
    # Cada escena empieza con «{ id: 'X', …» en su propia línea (convención de los specs).
    for m in re.finditer(r"^\s*\{\s*id:\s*'([A-Z]\d+[A-Z]?)'(.*)$", body, re.M):
        line = m.group(2)
        kind = re.search(r"kind:\s*'(\w+)'", line)
        bump = re.search(r"bump:\s*'([^']*)'", line)
        extra = re.search(r"extra:\s*(\d+)", line)
        lead = re.search(r"lead:\s*([\d.]+)", line)
        audio = re.search(r"audio:\s*\{[^}]*dur:\s*([\d.]+)", line)
        # Subtítulo de una escena con audio real y sin locución: `caption: '…'` en la misma línea.
        caption = re.search(r"caption:\s*'([^']*)'", line)
        scenes.append({'id': m.group(1), 'kind': kind.group(1) if kind else 'rec', 'bump': bump.group(1) if bump else None,
                       'extra': int(extra.group(1)) if extra else None, 'lead': float(lead.group(1)) if lead else None, 'audio': float(audio.group(1)) if audio else 0.0,
                       'caption': caption.group(1) if caption else None})
    chapters = re.findall(r"\{\s*label:\s*'([^']*)',\s*from:\s*'([A-Z]\d+[A-Z]?)'\s*\}", src)
    return scenes, chapters


def load_vo(slug):
    cfg = json.load(open(os.path.join(V, 'public/pl', slug, 'vo/vo.json'), encoding='utf-8'))
    out = {}
    for s in cfg['scenes']:
        p = os.path.join(V, 'public/pl', slug, 'vo', f"{s['id']}.json")
        out[s['id']] = {'text': s['text'], 'say': s.get('say', s['text']), 'vo': json.load(open(p, encoding='utf-8')) if os.path.exists(p) else None}
    return out


def timeline(slug):
    scenes, chapters = parse_spec(slug)
    vos = load_vo(slug)
    for s in scenes:  # escenas sin locución (solo audio real)
        vos.setdefault(s['id'], {'text': '', 'say': '', 'vo': None})
    t = 0
    out = []
    for i, s in enumerate(scenes):
        lead = sec(s['lead'] if s['lead'] is not None else (0.52 if s['bump'] else 0.3 if i == 0 else 0.14))
        v = vos[s['id']]['vo']
        speech = math.ceil(v.get('speechEnd', v['duration']) * FPS) if v else sec(len(vos[s['id']]['text']) / CPS)
        speech = max(speech, math.ceil(s['audio'] * FPS))
        extra = s['extra'] if s['extra'] is not None else (OUTRO_HOLD if s['kind'] == 'outro' else 22 if s['kind'] in ('plans', 'proscons', 'verdict') else 14)
        dur = lead + speech + sec(0.32) + extra
        out.append({**s, 'start': t, 'lead': lead, 'dur': dur, 'speech': speech})
        t += dur
    return out, t, chapters, vos


def fmt_ch(t):
    t = int(t)
    return f'{t // 60}:{t % 60:02d}'


def fmt_srt(t):
    ms = int(round(t * 1000))
    return f'{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}'


def timed_words(item):
    """Palabras del texto que se ve, con los tiempos de las palabras dichas (las cifras se interpolan)."""
    shown = item['text'].split()
    v = item['vo']
    if not v:
        return [{'w': w, 's': None, 'e': None} for w in shown]
    spoken = v['words']
    res = []
    j = 0
    for w in shown:
        n = norm(w)
        hit = None
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
    # Interpolación de las que no casan (cifras) entre sus vecinas.
    end = v.get('speechEnd', v['duration'])
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


UNITS = {'zł', 'gr', 'h', 'min', 's', 'dni', 'dzień', 'tys.', 'mln', 'mld', '%', 'zł/mies.', 'zł,', 'zł.', 'h,', 'h.', 'dni,', 'dni.', 'min.', 'min,'}


def glue(ws):
    """Pega con espacio duro lo que no se puede partir entre líneas ni entre subtítulos (norma tipográfica polaca):
    una palabra de una letra con la siguiente («w domu», «i 14»), los grupos de cifras («20 000») y la cifra con su unidad
    («14 dni», «39,90 zł», «53 minuty»)."""
    out = []
    for w in ws:
        if out:
            prev = out[-1]['w'].split('\u00a0')[-1]
            digits_prev = bool(re.match(r'^\d+([.,]\d+)?$', prev))  # 4,7 · 29,90 · 2026 (sin puntuación detrás)
            ordinal = bool(re.match(r'^\d+\.$', prev)) and w['w'][:1].islower()  # «3. dnia» (no «2026. Potem»)
            join = (len(prev) == 1 and prev.isalpha()) or ordinal \
                or (digits_prev and (w['w'][:3].isdigit() and len(w['w'].rstrip('.,;:!?')) == 3)) \
                or (digits_prev and w['w'][:1].isalpha()) \
                or (digits_prev and w['w'].lower() in UNITS)
            if join:
                out[-1] = {'w': out[-1]['w'] + '\u00a0' + w['w'], 's': out[-1]['s'], 'e': w['e']}
                continue
        out.append(dict(w))
    return out


def ends_sentence(w, extra=''):
    """¿Acaba frase esta palabra? (Los ordinales como «3. dnia» ya van pegados a su palabra por `glue`.)"""
    last = w.split('\u00a0')[-1]
    return last[-1] in '.?!' + extra


def fits2(words, max_chars):
    """¿Caben estas palabras en un subtítulo de dos líneas de max_chars como mucho?"""
    if len(' '.join(words)) <= max_chars:
        return True
    return any(len(' '.join(words[:k])) <= max_chars and len(' '.join(words[k:])) <= max_chars for k in range(1, len(words)))


def srt(slug, scenes, vos, max_chars=42):
    """Subtítulos de dos líneas (≤ max_chars cada una), por frases, sin trozos sueltos muy cortos."""
    groups = []  # listas de palabras con tiempos absolutos
    for s in scenes:
        if s.get('caption') and s.get('audio'):
            a = s['start'] / FPS + 0.05
            groups.append([{'w': s['caption'], 's': a, 'e': a + s['audio'] - 0.2}])
            continue
        item = vos.get(s['id'])
        if not item:
            continue
        ws = glue(timed_words(item))
        if not ws or ws[0]['s'] is None:
            continue
        base = (s['start'] + s['lead']) / FPS
        ws = [{'w': w['w'], 's': base + w['s'], 'e': base + w['e']} for w in ws]
        scene_groups, line = [], []
        for k, w in enumerate(ws):
            cand = [x['w'] for x in line] + [w['w']]
            if line and (not fits2(cand, max_chars) or (len(' '.join(cand)) > max_chars and ends_sentence(line[-1]['w'], ':'))):
                scene_groups.append(line)
                line = []
            line.append(w)
            if ends_sentence(w['w']) and len(' '.join(x['w'] for x in line)) > 18 and k + 1 < len(ws):
                scene_groups.append(line)
                line = []
        if line:
            scene_groups.append(line)
        # Un trozo muy corto («Plus.», «jest.») se junta con el anterior si cabe; si no, se le pasan palabras del anterior.
        k = 1
        while k < len(scene_groups):
            cur, prev = scene_groups[k], scene_groups[k - 1]
            if len(' '.join(x['w'] for x in cur)) < 14:
                if fits2([x['w'] for x in prev + cur], max_chars):
                    scene_groups[k - 1] = prev + cur
                    del scene_groups[k]
                    continue
                while len(prev) > 1 and len(' '.join(x['w'] for x in cur)) < 14 and fits2([x['w'] for x in [prev[-1]] + cur], max_chars) \
                        and not ends_sentence(prev[-2]['w']):
                    cur.insert(0, prev.pop())
            k += 1
        groups += scene_groups
    out = []
    for i, g in enumerate(groups):
        a, b, t = g[0]['s'], g[-1]['e'], ' '.join(x['w'] for x in g)
        b = max(b + 0.25, a + 1.0)
        if i + 1 < len(groups):
            b = min(b, groups[i + 1][0]['s'] - 0.04)
        # Dos líneas equilibradas, ninguna de más de max_chars
        if len(t) > max_chars:
            words = t.split(' ')  # el espacio duro no se parte
            best = min(range(1, len(words)), key=lambda k: (max(len(' '.join(words[:k])), len(' '.join(words[k:]))) > max_chars,
                                                            abs(len(' '.join(words[:k])) - len(' '.join(words[k:])))))
            t = ' '.join(words[:best]) + '\n' + ' '.join(words[best:])
        out.append(f'{i + 1}\n{fmt_srt(a)} --> {fmt_srt(b)}\n{t}\n')
    return '\n'.join(out)


def main():
    slug = sys.argv[1]
    scenes, total, chapters, vos = timeline(slug)
    if '--starts' in sys.argv:
        for s in scenes:
            print(f"{s['id']:5s} {s['kind']:9s} start={s['start']:6d} ({s['start'] / FPS:7.2f} s) dur={s['dur']:5d} {s['bump'] or ''}")
        print(f'total {total} fotogramas = {total / FPS:.2f} s')
    chs = [('0:00', None)]
    lines = []
    first_label = None
    for label, frm in chapters:
        s = next(x for x in scenes if x['id'] == frm)
        t = (s['start'] - (BUMP_IN if s['bump'] else 0)) / FPS
        lines.append((t, label))
    out = sys.argv[sys.argv.index('--out') + 1] if '--out' in sys.argv else None
    if out:
        os.makedirs(out, exist_ok=True)
        open(os.path.join(out, f'{slug}.pl.srt'), 'w', encoding='utf-8').write(srt(slug, scenes, vos))
        json.dump({'total_frames': total, 'seconds': total / FPS, 'chapters': [{'t': round(t, 2), 'label': l} for t, l in lines],
                   'scenes': [{k: s[k] for k in ('id', 'kind', 'start', 'dur', 'lead', 'bump')} for s in scenes]},
                  open(os.path.join(out, 'timeline.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    for t, l in lines:
        print(f'{fmt_ch(t)} {l}')


if __name__ == '__main__':
    main()
