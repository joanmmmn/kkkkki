#!/usr/bin/env python3
"""Transcribe las locuciones con Whisper para detectar errores de pronunciación.
Uso: [QA_LANG=pl] flock /tmp/claude-0/pl_whisper.lock python3 tools/qa_vo.py <dir_vo> [ids...]"""
import json, os, subprocess, sys, tempfile, wave
import numpy as np
from faster_whisper import WhisperModel

d = sys.argv[1]
ids = sys.argv[2:] or sorted(f[:-4] for f in os.listdir(d) if f.endswith('.mp3'))
m = WhisperModel('medium', device='cpu', compute_type='int8')
for i in ids:
    tmp = tempfile.mktemp(suffix='.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(d, i + '.mp3'), '-ac', '1', '-ar', '16000', tmp], check=True)
    w = wave.open(tmp)
    a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    segs, _ = m.transcribe(a, language=os.environ.get('QA_LANG', 'es'), beam_size=5)
    heard = ' '.join(s.text.strip() for s in segs)
    src = json.load(open(os.path.join(d, i + '.json')))['text']
    print(f'== {i}\n  guion: {src}\n  oído : {heard}')
    os.remove(tmp)
