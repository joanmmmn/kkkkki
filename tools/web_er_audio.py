#!/usr/bin/env python3
"""Recorta los fragmentos de la narración de ElevenReader para la página de reseña y calcula los tiempos
de cada palabra (Whisper + ajuste del ataque por energía). Las grabaciones originales están en
captures/elevenreader/app/audio (fuera de git); los mp3 resultantes tampoco se suben al repositorio público.

Uso: python3 tools/web_er_audio.py  → web/elevenreader-resena/media/audio/*.mp3 y timings.json"""
import json, os, subprocess
import numpy as np
ROOT = os.path.join(os.path.dirname(__file__), '..')
SRC = os.path.join(ROOT, 'captures', 'elevenreader', 'app', 'audio')
OUT = os.path.join(ROOT, 'web', 'elevenreader-resena', 'media', 'audio')
SR = 16000
# id: (grabación, desde, hasta, primera palabra, última palabra)
CUTS = {
    'hero-sara': ('pdf_sara', 14.85, 32.25, 'Yo', 'imaginación.'),
    'ab-sara': ('pdf_sara', 20.40, 32.25, 'Lo', 'imaginación.'),
    'ab-brian': ('pdf_brian', 36.60, 48.95, 'lo', 'imaginación'),
}

def pcm(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32)

def onset(a, s, e, thr):
    """Primer instante de [s, e] con energía por encima de thr (ventanas de 10 ms)."""
    n = int(SR * 0.01)
    i0, i1 = int(s * SR), int(e * SR)
    for i in range(i0, max(i0 + 1, i1 - n), n):
        if np.sqrt(np.mean(a[i:i + n] ** 2)) > thr:
            return i / SR
    return s

res = {}
for cid, (rec, t0, t1, first, last) in CUTS.items():
    wav = os.path.join(SRC, rec + '.wav')
    a = pcm(wav)
    thr = 10 ** (-38 / 20) * max(1e-6, float(np.max(np.abs(a))))
    words = json.load(open(os.path.join(SRC, rec + '_whisper.json')))
    sel = [w for w in words if w[0] >= t0 - 0.05 and w[1] <= t1 + 0.05]
    out = []
    for s, e, txt in sel:
        s2 = onset(a, s, e, thr)
        out.append([round(s2 - t0, 3), round(e - t0, 3), txt])
    dur = t1 - t0
    mp3 = os.path.join(OUT, cid + '.mp3')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(t0), '-to', str(t1), '-i', wav,
                    '-af', f'afade=t=in:d=0.02,afade=t=out:st={dur - 0.18:.3f}:d=0.18,loudnorm=I=-18:TP=-1.5:LRA=11',
                    '-ac', '1', '-ar', '44100', '-b:a', '96k', mp3], check=True)
    res[cid] = {'dur': round(dur, 3), 'words': out}
    print(cid, round(dur, 2), 's', len(out), 'palabras', out[0], out[-1], os.path.getsize(mp3) // 1024, 'KB')
json.dump(res, open(os.path.join(OUT, 'timings.json'), 'w'), ensure_ascii=False)
