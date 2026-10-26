#!/usr/bin/env python3
"""Whisper sobre la mezcla final de un tutorial «Cómo cancelar…» (como tools/qa_mix.py, con las escenas de cada vídeo).

Corta del máster el tramo de voz de la entrada, del tramo de la plataforma (desde el corte `cut`) y del cierre, lo transcribe con
faster-whisper (medium) y lo compara con el guion. Lo que «falta» suelen ser cifras o grafías de marcas.

Uso: python3 tools/cnl_qa_mix.py <k> <máster.mp4>
"""
import difflib, json, os, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel

sys.path.insert(0, os.path.dirname(__file__))
import cnl_meta  # noqa: E402
from cnl_music import video_scenes  # noqa: E402

k, src = sys.argv[1], sys.argv[2]
v = next(x for x in json.load(open(os.path.join(cnl_meta.V, 'src/scenes/cnl/videos.json')))['videos'] if x['k'] == k)
scenes, _ = video_scenes(v)
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-vn', '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True, check=True).stdout
audio = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
m = WhisperModel('medium', device='cpu', compute_type='int8')
norm = lambda ws: [w for w in (cnl_meta._n(x) for x in ws) if w]
tot = hit = 0
for s in scenes:
    if s['kind'] == 'store':
        continue
    cut = v['cut'] if s['kind'] == 'seg' else 0
    base = (s['at'] + s['lead'] - s['skip']) / cnl_meta.FPS
    a = base + cut - 0.1
    b = base + cnl_meta.speech_frames(s['id']) / cnl_meta.FPS + 0.3
    segs, _ = m.transcribe(audio[int(a * 16000):int(b * 16000)], language='es', beam_size=5)
    heard = ' '.join(x.text.strip() for x in segs)
    want = norm([w['w'] for w in cnl_meta.vo(s['id'])['words'] if w['s'] >= cut - 0.05])
    got = norm(heard.split())
    sm = difflib.SequenceMatcher(None, want, got, autojunk=False)
    ok = sum(bl.size for bl in sm.get_matching_blocks())
    miss = [want[i] for op, i1, i2, _, _ in sm.get_opcodes() if op in ('replace', 'delete') for i in range(i1, i2)]
    tot += len(want)
    hit += ok
    print(f'== {s["id"]} {ok}/{len(want)} ({100 * ok / max(1, len(want)):.1f} %)  faltan: {" ".join(miss) or "—"}\n   oído: {heard}', flush=True)
print(f'TOTAL {k}: {hit}/{tot} palabras del guion oídas ({100 * hit / max(1, tot):.1f} %)')
