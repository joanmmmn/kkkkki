#!/usr/bin/env python3
"""Comprueba con Whisper que la voz se entiende sobre la música en la mezcla final, escena a escena.

Corta del máster el tramo de voz de cada escena (según tools/mp_meta.py), lo transcribe con faster-whisper (medium) y lo compara
con el guion: porcentaje de palabras del guion que se oyen y las que faltan. Lo que «falta» suele ser cifras (Whisper las escribe
en número) o grafías de marcas; lo que importa es que no falten palabras normales.

Uso: python3 tools/qa_mix.py <máster.mp4> [ids...]
"""
import difflib, json, os, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel

sys.path.insert(0, os.path.dirname(__file__))
import mp_meta  # noqa: E402

src = sys.argv[1]
only = set(sys.argv[2:])
scenes, _, _ = mp_meta.review_scenes()
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-vn', '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True, check=True).stdout
audio = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
m = WhisperModel('medium', device='cpu', compute_type='int8')
norm = lambda ws: [w for w in (mp_meta._n(x) for x in ws) if w]
tot = hit = 0
for s in scenes:
    if only and s['id'] not in only:
        continue
    a = (s['at'] + s['lead']) / mp_meta.FPS - 0.15
    b = (s['at'] + s['lead'] + mp_meta.speech_frames(s['id'])) / mp_meta.FPS + 0.3
    segs, _ = m.transcribe(audio[int(a * 16000):int(b * 16000)], language='es', beam_size=5)
    heard = ' '.join(x.text.strip() for x in segs)
    want, got = norm(mp_meta.TEXT[s['id']].split()), norm(heard.split())
    sm = difflib.SequenceMatcher(None, want, got, autojunk=False)
    ok = sum(bl.size for bl in sm.get_matching_blocks())
    miss = [want[i] for op, i1, i2, _, _ in sm.get_opcodes() if op in ('replace', 'delete') for i in range(i1, i2)]
    tot += len(want)
    hit += ok
    print(f'== {s["id"]} {ok}/{len(want)} ({100 * ok / max(1, len(want)):.1f} %)  faltan: {" ".join(miss) or "—"}\n   oído: {heard}', flush=True)
print(f'TOTAL {hit}/{tot} palabras del guion oídas ({100 * hit / max(1, tot):.1f} %)')
