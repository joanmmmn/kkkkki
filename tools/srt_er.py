#!/usr/bin/env python3
"""Subtítulos (.srt) del tutorial de ElevenReader a partir de la locución (tiempos por palabra de tools/tts.py)
y de la estructura de escenas de video/public/er/timeline.json (la misma que usa video/src/scenes/er/timeline.ts:
lead 0,12 s, cola 0,32 s, extra por escena y, si hay varias locuciones, «gap» entre ellas).
Uso: python3 tools/srt_er.py <salida.srt>"""
import functools, json, math, os, re, sys

OUT = os.path.abspath(sys.argv[1])
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))  # rutas relativas a la raíz del repo

FPS = 50
VO = 'video/public/er/vo'
TL = json.load(open('video/public/er/timeline.json', encoding='utf-8'))
LEAD, TAIL = math.floor(0.12 * FPS + 0.5), math.floor(0.32 * FPS + 0.5)
sec = lambda s: math.floor(s * FPS + 0.5)  # como Math.round de JS (Python redondea al par)
meta = lambda i: json.load(open(f'{VO}/{i}.json', encoding='utf-8'))
speech = lambda i: math.ceil(meta(i).get('speechEnd', meta(i)['duration']) * FPS)
# En pantalla, cifras en vez de palabras (la locución las escribe con letra para que se pronuncien bien).
FIX = [(r'¿Treinta días', '¿30 días'), (r'en lugar de tres\?', 'en lugar de 3?')]

def ts(t):
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f'{h:02d}:{m:02d}:{s:02d},{ms:03d}'

cues, start = [], 0
for d in TL:
    parts = d.get('parts', [d['id']])
    t = LEAD
    for k, p in enumerate(parts):
        t0 = (start + t) / FPS
        words = meta(p)['words']
        cur, cs = [], None
        for i, w in enumerate(words):
            if cs is None: cs = w['s']
            cur.append(w)
            text = ' '.join(x['w'] for x in cur)
            last = i + 1 == len(words)
            if re.search(r'[.?!:]»?$', w['w']) or len(text) >= 38 or (re.search(r'[,;]$', w['w']) and len(text) >= 22) or last:
                cues.append((t0 + cs, t0 + w['e'] + 0.15, functools.reduce(lambda s, f: re.sub(f[0], f[1], s), FIX, text)))
                cur, cs = [], None
        t += speech(p) + (sec(d.get('gap', 0.4)) if k < len(parts) - 1 else 0)
    start += t + TAIL + sec(d.get('extra', 0))

out = []
for i, (a, b, txt) in enumerate(cues):
    if i + 1 < len(cues): b = min(max(b, a + 0.9), cues[i + 1][0] - 0.02)
    out.append(f'{i + 1}\n{ts(a)} --> {ts(b)}\n{txt}\n')
open(OUT, 'w', encoding='utf-8').write('\n'.join(out))
print(f'{len(out)} subtítulos · vídeo de {start / FPS:.2f} s ({start} fotogramas)')
