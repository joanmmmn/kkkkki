#!/usr/bin/env python3
"""Subtítulos (.srt) de la reseña de ElevenReader: locución (tiempos por palabra de tools/tts.py) y fragmentos de la
narración real de ElevenReader (en cursiva y entre comillas), con la estructura de video/public/er/timeline2.json
(la misma que usa video/src/scenes/er2/timeline.ts: lead 0,12 s salvo que se indique, «gap» entre elementos y cola 0,32 s).
Uso: python3 tools/srt_er2.py <salida.srt>"""
import json, math, os, re, sys

OUT = os.path.abspath(sys.argv[1])
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))

FPS = 50
VO = 'video/public/er/vo2'
TL = json.load(open('video/public/er/timeline2.json', encoding='utf-8'))
CLIPS = json.load(open('video/public/er/audio/clips.json', encoding='utf-8'))
sec = lambda s: math.floor(s * FPS + 0.5)  # como Math.round de JS
meta = lambda i: json.load(open(f'{VO}/{i}.json', encoding='utf-8'))
speech = lambda i: math.ceil(meta(i).get('speechEnd', meta(i)['duration']) * FPS)
# Texto de cada fragmento de la app (Bécquer, «El rayo de luna»).
CLIP_TEXT = {
    'sara_cold': ['«Yo no sé si esto es una historia', 'que parece cuento o un cuento que parece historia»'],
    'brian_ab': ['«Lo que puedo decir es que en su fondo hay una verdad…»'],
    'sara_ab': ['«Lo que puedo decir es que en su fondo hay una verdad…»'],
}

def ts(t):
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f'{h:02d}:{m:02d}:{s:02d},{ms:03d}'

cues, start = [], 0
for d in TL:
    t = sec(d.get('lead', 0.12))
    for k, it in enumerate(d['seq']):
        if k > 0:
            t += sec(it.get('gap', 0.35))
        t0 = (start + t) / FPS
        if 'clip' in it:
            c = CLIPS[it['clip']]
            lines = CLIP_TEXT[it['clip']]
            dur = c['dur']
            # Reparte el fragmento según las palabras: la segunda línea empieza en «que parece cuento…».
            if len(lines) == 2:
                cut = next(w[0] for w in c['words'] if w[1] == 8)
                cues.append((t0, t0 + cut - 0.02, f'<i>{lines[0]}</i>'))
                cues.append((t0 + cut, t0 + dur, f'<i>{lines[1]}</i>'))
            else:
                cues.append((t0, t0 + dur, f'<i>{lines[0]}</i>'))
            t += sec(dur)
            continue
        p = it['vo']
        words = meta(p)['words']
        cur, cs = [], None
        for i, w in enumerate(words):
            if cs is None:
                cs = w['s']
            cur.append(w)
            text = ' '.join(x['w'] for x in cur)
            last = i + 1 == len(words)
            if re.search(r'[.?!:…]»?$', w['w']) or len(text) >= 40 or (re.search(r'[,;]$', w['w']) and len(text) >= 22) or last:
                cues.append((t0 + cs, t0 + w['e'] + 0.15, text))
                cur, cs = [], None
        t += speech(p)
    start += t + sec(0.32 + d.get('extra', 0))

out = []
for i, (a, b, txt) in enumerate(cues):
    if i + 1 < len(cues):
        b = min(max(b, a + 0.9), cues[i + 1][0] - 0.02)
    out.append(f'{i + 1}\n{ts(a)} --> {ts(b)}\n{txt}\n')
open(OUT, 'w', encoding='utf-8').write('\n'.join(out))
print(f'{len(out)} subtítulos · vídeo de {start / FPS:.2f} s ({start} fotogramas)')
