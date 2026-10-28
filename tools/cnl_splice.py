#!/usr/bin/env python3
"""Locuciones de los tutoriales «Cómo cancelar…» que empiezan por «Para cancelar la suscripción de X…» (encargo de Joan, 28/10/2026).

Cada tramo de plataforma (X03–X10) se rehace sin volver a grabar entero: la apertura nueva (X03A–X10A, con la primera frase
del tramo) se empalma con el resto de la locución original, desde la frase indicada en REM. Sale X03S–X10S (.mp3 y .json con
las palabras de las dos partes en un solo eje de tiempos), que el vídeo usa en lugar de X03–X10 (`vid()` en timeline.ts).

Además, para dar ritmo, los silencios largos (medidos en el audio, no en el alineamiento) se acortan a MAX_GAP s como mucho.

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


def frames_db(audio, hop=0.01):
    n = int(hop * SR)
    m = len(audio) // n
    e = audio[:m * n].reshape(m, n)
    return 20 * np.log10(np.sqrt((e ** 2).mean(1)) + 1e-9)


def tighten(audio, words, max_gap, floor=-50.0, hop=0.01):
    """Acorta los silencios de verdad (medidos en el audio, por debajo de `floor` dBFS) más largos que max_gap.
    No se fía de los tiempos de las palabras: el alineamiento a veces da por silencio lo que aún es voz («plan… Gratis»)."""
    db = frames_db(audio, hop)
    quiet = db < floor
    runs, i = [], 0
    while i < len(quiet):
        if quiet[i]:
            j = i
            while j < len(quiet) and quiet[j]:
                j += 1
            runs.append((i * hop, j * hop))
            i = j
        else:
            i += 1
    end = len(audio) / SR
    cuts = [(a + max_gap / 2, b - max_gap / 2) for a, b in runs if b - a > max_gap + 0.02 and a > 0.05 and b < end - 0.05]
    out, pos = [], 0
    for a, b in cuts:
        ia, ib = int(a * SR), int(b * SR)
        out.append(fade(audio[pos:ia].copy(), 64 if pos else 0, 64))
        pos = ib
    out.append(fade(audio[pos:].copy(), 64 if pos else 0, 0))
    removed = [(a, b - a) for a, b in cuts]
    remap = lambda t: t - sum(l for a, l in removed if a < t)
    ws = [{**w, 's': round(remap(w['s']), 3), 'e': round(remap(w['e']), 3)} for w in words]
    return np.concatenate(out), ws, sum(l for _, l in removed)


def onset_cut(audio, t, floor=-55.0, look=0.25, hop=0.01):
    """Punto de corte antes de la palabra que empieza (según el alineamiento) en t: el último instante en silencio antes de que
    suene (el alineamiento puede ir unas centésimas tarde y comerse la «p» de «Pulsa»)."""
    db = frames_db(audio, hop)
    k = int(t / hop)
    for j in range(k, max(0, k - int(look / hop)), -1):
        if db[j] < floor:
            return j * hop
    return max(0.0, t - 0.05)


def splice(x):
    a = json.load(open(os.path.join(VO, f'{x}A.json')))
    o = json.load(open(os.path.join(VO, f'{x}.json')))
    ow = o['words']
    i = next(k for k in range(len(ow) - 1) if n(ow[k]['w']) == n(REM[x][0]) and n(ow[k + 1]['w']) == n(REM[x][1]))
    full = decode(os.path.join(VO, f'{x}.mp3'))
    cut = onset_cut(full, ow[i]['s'])
    a_end = a.get('speechEnd', a['duration'])
    A = decode(os.path.join(VO, f'{x}A.mp3'))[:int(a_end * SR)]
    B = full[int(cut * SR):int(o.get('speechEnd', o['duration']) * SR) + int(0.05 * SR)]
    A = fade(A, 0, int(0.012 * SR))
    B = fade(B, int(0.003 * SR), int(0.03 * SR))
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
