#!/usr/bin/env python3
"""SonorBooks Polska: comprueba que cada «cue» del spec (palabra de la voz) existe en la locución de su escena.

Uso: python3 tools/pl_check_cues.py <pieza>
Lee video/src/pl/specs/<pieza>.tsx (una escena por línea que empieza con «{ id: 'X'», con sus líneas siguientes hasta la próxima)
y video/public/pl/<pieza>/vo/<ID>.json (palabras dichas). Avisa de las palabras que no están y de las que caen fuera de orden.
"""
import json, os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
from pl_meta import V, norm  # noqa: E402

slug = sys.argv[1]
src = open(os.path.join(V, 'src/pl/specs', f'{slug}.tsx'), encoding='utf-8').read()
body = src[src.index('scenes:'):src.index('chapters:')]
parts = re.split(r"(?m)^\s*\{\s*id:\s*'([A-Z]\d+[A-Z]?)'", body)
bad = 0
for i in range(1, len(parts), 2):
    sid, chunk = parts[i], parts[i + 1]
    p = os.path.join(V, 'public/pl', slug, 'vo', f'{sid}.json')
    if not os.path.exists(p):
        print(f'{sid}: sin locución todavía')
        continue
    words = [norm(w['w']) for w in json.load(open(p, encoding='utf-8'))['words']]
    times = [w['s'] for w in json.load(open(p, encoding='utf-8'))['words']]
    for m in re.finditer(r"\b(?:at|until|ctaAt|signAt):\s*(?:'([^']+)'|\[\s*'([^']+)'\s*,\s*(\d+)\s*\])", chunk):
        w = norm(m.group(1) or m.group(2))
        nth = int(m.group(3) or 0)
        hits = [k for k, x in enumerate(words) if x.startswith(w)]
        if len(hits) <= nth:
            bad += 1
            print(f'{sid}: NO ESTÁ «{m.group(1) or m.group(2)}» (aparición {nth}); palabras: {" ".join(words)[:300]}')
        elif len(hits) > 1 and m.group(3) is None:
            print(f'{sid}: aviso, «{m.group(1)}» aparece {len(hits)} veces; se usa la 1.ª ({times[hits[0]]:.2f} s)')
print('cues que fallan:', bad)
sys.exit(1 if bad else 0)
