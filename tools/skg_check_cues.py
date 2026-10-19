#!/usr/bin/env python3
"""Comprueba que las palabras clave de las escenas (c.at('G05', 'palabra'), titleWord…) existen en las locuciones.
Mismo criterio que video/src/lib/vo.ts: minúsculas, sin acentos, solo [a-z0-9,] y «empieza por».
Uso: python3 tools/skg_check_cues.py"""
import glob, json, os, re, unicodedata

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'video')
VO = os.path.join(ROOT, 'public/skg/vo')


def norm(s):
    s = unicodedata.normalize('NFD', s.lower().replace('ł', 'l'))
    s = re.sub(r'[̀-ͯ]', '', s)
    return re.sub(r'[^a-z0-9,]', '', s)


words, raws = {}, {}
for p in glob.glob(os.path.join(VO, 'G*.json')):
    d = json.load(open(p))
    words[d['id']] = [norm(w['w']) for w in d['words']]
    raws[d['id']] = [w['w'] for w in d['words']]

bad = 0
n = 0
for f in sorted(glob.glob(os.path.join(ROOT, 'src/scenes/skg/**/*.tsx'), recursive=True)):
    if f.endswith('Hook.tsx'):
        continue
    src = open(f).read()
    pairs = [(m.group(1), m.group(2), int(m.group(3) or 0)) for m in re.finditer(r"\.(?:at|end)\('(G\d+)', '([^']+)'(?:, (\d+))?\)", src)]
    pairs += [(m.group(1), m.group(2), 0) for m in re.finditer(r"voA: '(G\d+)'.*?titleWord: '([^']+)'", src)]
    for vid, w, nth in pairs:
        n += 1
        t = norm(w)
        hits = [i for i, x in enumerate(words.get(vid, [])) if x.startswith(t)]
        if len(hits) <= nth:
            bad += 1
            print(f'FALTA {os.path.basename(f)}: {vid} «{w}» (n={nth}) → {" ".join(words.get(vid, []))[:160]}')
            continue
        # La palabra elegida tiene que empezar por la marca con sus letras polacas (si no, ha casado con otra palabra).
        raw = re.sub(r'^[„“"«(]+', '', raws[vid][hits[nth]].lower())
        if not raw.startswith(w.lower()):
            bad += 1
            print(f'OTRA PALABRA {os.path.basename(f)}: {vid} «{w}» (n={nth}) casa con «{raws[vid][hits[nth]]}»')
print(f'{n} marcas, {bad} fallos')
