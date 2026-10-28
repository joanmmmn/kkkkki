#!/usr/bin/env python3
"""Locuciones de los tutoriales «Cómo cancelar…» que empiezan por «Para cancelar la suscripción de X…» (encargo de Joan, 28/10/2026).

Cada tramo de plataforma (X03–X10) se rehace sin volver a grabar entero: la apertura nueva (X03A–X10A, con la primera frase
del tramo) se empalma con el resto de la locución original, desde la frase indicada en REM. Sale X03S–X10S (.mp3 y .json con
las palabras de las dos partes en un solo eje de tiempos), que el vídeo usa en lugar de X03–X10 (`vid()` en timeline.ts).

Además, para dar ritmo, las pausas largas entre frases se acortan (como mucho MAX_GAP s) en todo el empalme.

Uso: python3 tools/cnl_splice.py [X03 ...]
"""
import json, os, subprocess, sys
import numpy as np

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
VO = os.path.join(ROOT, 'video/public/cnl/vo')
SR = 44100
# Frase desde la que se aprovecha la locución original (sus dos primeras palabras).
REM = {'X03': ('En', 'audible.es,'), 'X04': ('Te', 'pide'), 'X05': ('En', 'tu'), 'X06': ('Pulsa', 'otra'), 'X07': ('Allí,', 'en'),
       'X08': ('En', 'el'), 'X09': ('Te', 'avisa'), 'X10': ('Mantienes', 'el')}
GAP = 0.26       # pausa entre la apertura y el resto
MAX_GAP = 0.30   # pausa máxima dentro de la locución (las de punto y coma o punto, más largas en el original, se acortan)
PREFIX = 'Para cancelar la suscripción de'


def n(w):
    import unicodedata
    return ''.join(c for c in unicodedata.normalize('NFD', w.lower()) if unicodedata.category(c) != 'Mn').strip('.,;:¿?¡!«»…')


def decode(mp3):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', mp3, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).copy()


def fade(x, a, b):
    """Rampa de entrada (a muestras) y salida (b muestras)."""
    if a:
        x[:a] *= np.linspace(0, 1, a)
    if b:
        x[-b:] *= np.linspace(1, 0, b)
    return x


def tighten(audio, words, max_gap):
    """Acorta los silencios entre palabras más largos que max_gap. Devuelve el audio y las palabras con los tiempos nuevos."""
    out, ws, t0, shift = [], [], 0.0, 0.0
    cuts = []
    for i in range(len(words) - 1):
        gap = words[i + 1]['s'] - words[i]['e']
        if gap > max_gap + 0.02:
            # Se quita el centro del silencio (se deja max_gap repartido a los dos lados).
            a = words[i]['e'] + max_gap / 2
            b = words[i + 1]['s'] - max_gap / 2
            cuts.append((a, b))
    pos = 0
    removed = []
    for a, b in cuts:
        ia, ib = int(a * SR), int(b * SR)
        seg = audio[pos:ia].copy()
        out.append(fade(seg, 0 if pos == 0 else 64, 64))
        removed.append((a, b - a))
        pos = ib
    out.append(fade(audio[pos:].copy(), 64 if pos else 0, 0))
    def remap(t):
        d = sum(l for a, l in removed if a < t)
        return t - d
    for w in words:
        ws.append({**w, 's': round(remap(w['s']), 3), 'e': round(remap(w['e']), 3)})
    return np.concatenate(out), ws, sum(l for _, l in removed)


def splice(x):
    a = json.load(open(os.path.join(VO, f'{x}A.json')))
    o = json.load(open(os.path.join(VO, f'{x}.json')))
    ow = o['words']
    i = next(k for k in range(len(ow) - 1) if n(ow[k]['w']) == n(REM[x][0]) and n(ow[k + 1]['w']) == n(REM[x][1]))
    cut = max(ow[i - 1]['e'] + 0.02, ow[i]['s'] - 0.05) if i else ow[i]['s'] - 0.05
    a_end = a.get('speechEnd', a['duration'])
    A = decode(os.path.join(VO, f'{x}A.mp3'))[:int(a_end * SR)]
    B = decode(os.path.join(VO, f'{x}.mp3'))[int(cut * SR):int(o.get('speechEnd', o['duration']) * SR) + int(0.05 * SR)]
    A = fade(A, 0, int(0.012 * SR))
    B = fade(B, int(0.008 * SR), int(0.03 * SR))
    gap = np.zeros(int(GAP * SR), np.float32)
    audio = np.concatenate([A, gap, B])
    off = a_end + GAP - cut
    words = [w for w in a['words'] if w['s'] < a_end] + [{**w, 's': round(w['s'] + off, 3), 'e': round(w['e'] + off, 3)} for w in ow[i:]]
    audio, words, saved = tighten(audio, words, MAX_GAP)
    # Fin de la voz y prefijo «Para cancelar la suscripción de» (el vídeo no busca palabras clave dentro de él).
    end = round(len(audio) / SR, 3)
    speech_end = round(min(end, words[-1]['e'] + 0.04), 3)
    k = len(PREFIX.split())
    prefix_end = words[k]['s']
    text = a['text'] + ' ' + ' '.join(w['w'] for w in ow[i:])
    tail = np.zeros(int(0.25 * SR), np.float32)
    pcm = np.concatenate([audio, tail])
    dst = os.path.join(VO, f'{x}S.mp3')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-i', '-', '-c:a', 'libmp3lame', '-b:a', '192k', dst],
                   input=np.clip(pcm, -1, 1).astype(np.float32).tobytes(), check=True)
    meta = {'id': f'{x}S', 'text': text, 'duration': round(len(pcm) / SR, 3), 'speechEnd': speech_end, 'prefixEnd': round(prefix_end, 3),
            'words': words, 'from': {'open': f'{x}A', 'rest': x, 'cut': round(cut, 3), 'gap': GAP, 'tightened': round(saved, 3)}}
    json.dump(meta, open(os.path.join(VO, f'{x}S.json'), 'w'), ensure_ascii=False, indent=1)
    old = o.get('speechEnd', o['duration'])
    print(f'{x}S: {speech_end:6.2f} s (antes {old:6.2f} s; pausas recortadas {saved:.2f} s) · prefijo hasta {prefix_end:.2f} s')


def main():
    only = sys.argv[1:] or sorted(REM)
    for x in only:
        splice(x)


if __name__ == '__main__':
    main()
