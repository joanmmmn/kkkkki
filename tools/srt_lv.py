#!/usr/bin/env python3
"""Subtítulos (.srt) del vídeo de LibriVox: locución (tiempos por palabra de tools/tts.py) y fragmentos de las grabaciones
reales de LibriVox (en cursiva y entre comillas), con la estructura de video/public/lv/timeline.json (la misma que usa
video/src/scenes/lv/timeline.ts: lead 0,12 s salvo que se indique, «gap» entre elementos y cola 0,32 s + «extra»).
En pantalla van cifras en vez de las palabras con las que la locución dice los números.
Uso: python3 tools/srt_lv.py <salida.srt>"""
import json, math, os, re, sys

OUT = os.path.abspath(sys.argv[1])
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))

FPS = 50
VO = 'video/public/lv/vo'
TL = json.load(open('video/public/lv/timeline.json', encoding='utf-8'))
CLIPS = json.load(open('video/public/lv/audio/clips.json', encoding='utf-8'))
sec = lambda s: math.floor(s * FPS + 0.5)  # como Math.round de JS
meta = lambda i: json.load(open(f'{VO}/{i}.json', encoding='utf-8'))
speech = lambda i: math.ceil(meta(i).get('speechEnd', meta(i)['duration']) * FPS)
# Texto de cada fragmento real de LibriVox; si son dos líneas, la segunda empieza en la palabra indicada.
CLIP_TEXT = {
    'omar_cold': (['«Yo no sé si esto es una historia', 'que parece cuento o un cuento que parece historia»'], 'que'),
    'omar_aviso': (['«Esta es una grabación de LibriVox.', 'Todas las grabaciones de LibriVox son del dominio público»'], 'Todas'),
    't_omar': (['«El rayo de luna»'], None),
    't_elena': (['«El monte de las ánimas»'], None),
    't_vicente': (['«El miserere»'], None),
    't_rosa': (['«Los ojos verdes»'], None),
}
# Números dichos con palabras → cifras (se unen las palabras antes de partir las frases).
NUMS = [(('veintiún', 'mil'), '21.000'), (('noventa', 'y', 'cinco'), '95'), (('tres', 'mil', 'quinientas'), '3.500'),
        (('dos', 'mil', 'treinta', 'y', 'nueve'), '2039'), (('mil', 'obras'), '1.000 obras'), (('once', 'personas'), '11 personas'),
        (('siete', 'y', 'medio', 'sobre', 'diez'), '7,5 sobre 10')]
bare = lambda w: re.sub(r'[^\wáéíóúüñ]', '', w.lower())


def numerals(words):
    out, i = [], 0
    while i < len(words):
        for pat, rep in NUMS:
            seg = words[i:i + len(pat)]
            if tuple(bare(w['w']) for w in seg) == pat:
                tail = re.search(r'[^\w]*$', seg[-1]['w']).group(0)
                out.append({'w': rep + tail, 's': seg[0]['s'], 'e': seg[-1]['e']})
                i += len(pat)
                break
        else:
            out.append(words[i]); i += 1
    return out


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
            lines, split = CLIP_TEXT[it['clip']]
            dur = c['dur']
            if len(lines) == 2:
                cut = next(w[0] for w in c['words'] if w[2].strip('¿¡«»,.;:') == split and w[0] > 0.8)
                cues.append((t0, t0 + cut - 0.02, f'<i>{lines[0]}</i>'))
                cues.append((t0 + cut, t0 + dur, f'<i>{lines[1]}</i>'))
            else:
                cues.append((t0, t0 + dur, f'<i>{lines[0]}</i>'))
            t += sec(dur)
            continue
        p = it['vo']
        words = numerals(meta(p)['words'])
        cur, cs = [], None
        for i, w in enumerate(words):
            if cs is None:
                cs = w['s']
            cur.append(w)
            text = ' '.join(x['w'] for x in cur)
            last = i + 1 == len(words)
            # Frases muy cortas se unen a la siguiente, y no se deja sola la cola breve de una frase.
            end = re.search(r'[.?!:…]»?$', w['w'])
            rest = []
            for x in words[i + 1:]:
                rest.append(x['w'])
                if re.search(r'[.?!:…]»?$', x['w']):
                    break
            if last or (end and len(text) >= 12) or (len(text) >= 40 and not end and len(' '.join(rest)) > 12) or (re.search(r'[,;]$', w['w']) and len(text) >= 22):
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
