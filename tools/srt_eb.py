#!/usr/bin/env python3
"""Subtítulos (.srt) del vídeo de eBiblio («la puerta»): locución con los tiempos por palabra de tools/tts.py y la
estructura de video/public/eb/timeline.json (la misma que video/src/scenes/eb/timeline.ts: lead 0,12 s salvo que se
indique, «gap» entre locuciones y cola 0,32 s + «extra»). En pantalla van cifras en vez de las palabras con las que la
locución dice los números. Uso: python3 tools/srt_eb.py <salida.srt>"""
import json, math, os, re, sys

OUT = os.path.abspath(sys.argv[1])
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))

FPS = 50
VO = 'video/public/eb/vo'
TL = json.load(open('video/public/eb/timeline.json', encoding='utf-8'))
sec = lambda s: math.floor(s * FPS + 0.5)  # como Math.round de JS
meta = lambda i: json.load(open(f'{VO}/{i}.json', encoding='utf-8'))
speech = lambda i: math.ceil(meta(i).get('speechEnd', meta(i)['duration']) * FPS)
# Números dichos con palabras → cifras (se unen las palabras antes de partir las frases).
NUMS = [(('quinientos', 'mil'), '500.000'), (('veintiún', 'días'), '21 días'), (('tres', 'mil'), '3.000'), (('dos', 'mil'), '2.000'),
        (('quinientos',), '500'), (('treinta', 'segundos'), '30 segundos'), (('siete', 'coma', 'cinco', 'sobre', 'diez'), '7,5 sobre 10'),
        (('uno', 'a', 'siete'), '1 a 7'), (('ebiblio', 'punto', 'es'), 'ebiblio.es'),
        (('paso', 'uno'), 'Paso 1'), (('paso', 'dos'), 'Paso 2'), (('paso', 'tres'), 'Paso 3'), (('paso', 'cuatro'), 'Paso 4')]
WEAK = {'el', 'la', 'los', 'las', 'de', 'del', 'y', 'o', 'en', 'un', 'una', 'que', 'a', 'al', 'con', 'por', 'su', 'sus', 'cómo', 'lo', 'se', 'si', 'no', 'es', 'para', 'hay', 'te', 'tu', 'muy', 'más', 'cada', 'como', 'todos', 'todo', 'tiene', 'ni', 'está'}
LWEAK = {'el', 'la', 'los', 'las', 'de', 'del', 'y', 'o', 'en', 'un', 'una', 'que', 'a', 'al', 'con', 'por', 'su', 'sus', 'lo', 'se', 'te', 'tu', 'para', 'ni', 'muy', 'cada'}  # no acaban una línea
NEXTWEAK = {'pública', 'públicas', 'disponibles', 'esperando'}  # palabras que no deben empezar un subtítulo
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
            weak = bare(w['w']) in WEAK  # no se corta después de un artículo, una preposición o una conjunción
            inq = text.count('«') > text.count('»')  # ni dentro de unas comillas
            weak = weak or (i + 1 < len(words) and bare(words[i + 1]['w']) in NEXTWEAK)
            # Un título entre comillas que no cabe en la línea pasa entero a la siguiente
            quote = i + 1 < len(words) and words[i + 1]['w'].startswith('«') and len(text) >= 30 and not inq and len(' '.join(rest)) >= 15
            # Los dos puntos no cortan si lo que sigue es muy corto («…de tu comunidad: de 1 a 7.»)
            if end and w['w'].endswith(':') and len(' '.join(rest)) < 12:
                end = None
            if last or (end and len(text) >= 10) or (len(text) >= 42 and not end and not weak and not inq and len(' '.join(rest)) > 20) or (re.search(r'[,;]$', w['w']) and len(text) >= 22 and not inq) or quote:
                cues.append((t0 + cs, t0 + w['e'] + 0.15, text))
                cur, cs = [], None
        t += speech(p)
    start += t + sec(0.32 + d.get('extra', 0))

def lines(txt, maxc=42):
    """Más de 42 caracteres: dos líneas equilibradas, sin dejar al final de la primera un artículo o una preposición
    y sin partir un título entre comillas."""
    if len(txt) <= maxc:
        return txt
    ws = txt.split(' ')
    best = None
    for k in range(1, len(ws)):
        a, b = ' '.join(ws[:k]), ' '.join(ws[k:])
        p, n = ws[k - 1], ws[k]
        if bare(p) in LWEAK or a.count('«') > a.count('»'):
            continue
        if re.match(r'\d', p) or bare(p) == 'paso':  # «30 segundos», «Paso 1»
            continue
        if p[0].isupper() and p[-1].isalpha() and n[0].isupper():  # «País Vasco»
            continue
        score = max(len(a), len(b)) + (0 if len(a) <= len(b) + 8 else 2)
        if best is None or score < best[0]:
            best = (score, a + '\n' + b)
    return best[1] if best else txt


out = []
for i, (a, b, txt) in enumerate(cues):
    if i + 1 < len(cues):
        b = min(max(b, a + 0.9), cues[i + 1][0] - 0.02)
    txt = txt.replace('«Mi cuenta»', '«Mi Cuenta»')  # como en la web de eBiblio
    out.append(f'{i + 1}\n{ts(a)} --> {ts(b)}\n{lines(txt)}\n')
open(OUT, 'w', encoding='utf-8').write('\n'.join(out))
print(f'{len(out)} subtítulos · vídeo de {start / FPS:.2f} s ({start} fotogramas)')
