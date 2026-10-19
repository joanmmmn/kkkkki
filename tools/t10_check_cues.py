#!/usr/bin/env python3
"""Comprueba que cada palabra-cue del código de video/src/scenes/t10 existe en su locución (tal como se alinea: grafía de `say`
cuando el número de palabras cambia). Mismo criterio que wf() de timeline.ts: la palabra normalizada empieza por el cue.
Uso: python3 tools/t10_check_cues.py"""
import glob, json, os, re, unicodedata
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'video')
VO = os.path.join(ROOT, 'public/t10/vo')


def norm(s):
    s = unicodedata.normalize('NFD', s.lower())
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9,]', '', s)


words = {}
for f in glob.glob(os.path.join(VO, '[XY]*.json')):
    d = json.load(open(f))
    words[d['id']] = [norm(w['w']) for w in d['words']]
src = {f: open(f).read() for f in glob.glob(os.path.join(ROOT, 'src/scenes/t10/*.tsx'))}
cues = []
for f, s in src.items():
    for m in re.finditer(r"""\.at\(\s*'([XY]\d+[A-Z]?)'\s*,\s*'([^']+)'(?:\s*,\s*(\d+))?""", s):
        cues.append((os.path.basename(f), m.group(1), m.group(2), int(m.group(3) or 0)))
# BEATS (X?2) y TITLE_WORD (X?1)
dio = src[os.path.join(ROOT, 'src/scenes/t10/Dioramas.tsx')]
for p, body in re.findall(r"(?ms)^  (\d+): \[(.*?)\],$", dio):
    for w in re.findall(r"word: '([^']+)'(?:, nth: (\d+))?", body):
        cues.append(('Dioramas.tsx BEATS', f'X{p}2', w[0], int(w[1] or 0)))
books = src[os.path.join(ROOT, 'src/scenes/t10/Books.tsx')]
tw = re.search(r"TITLE_WORD: Record<number, string> = \{(.*?)\};", books).group(1)
for p, w in re.findall(r"(\d+): '([^']+)'", tw):
    cues.append(('Books.tsx TITLE_WORD', f'X{p}1', w, 0))
bad = 0
for f, vid, w, nth in cues:
    ws = words.get(vid)
    hits = [x for x in (ws or []) if x.startswith(norm(w))]
    if ws is None or len(hits) <= nth:
        bad += 1
        print(f'FALLA {f}: {vid} «{w}» (n={nth})')
print(f'{len(cues)} cues, {bad} fallos')
