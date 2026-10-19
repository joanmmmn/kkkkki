#!/usr/bin/env python3
"""Transcribe las locuciones con Whisper para detectar errores de pronunciación.
Uso: [QA_LANG=pl] python3 tools/qa_vo.py <dir_vo> [ids...]"""
import json, os, subprocess, sys, tempfile, wave
import numpy as np
from faster_whisper import WhisperModel

d = sys.argv[1]
ids = sys.argv[2:] or sorted(f[:-4] for f in os.listdir(d) if f.endswith('.mp3'))
# Un solo Whisper a la vez en la máquina (cada uno ocupa ~2 GB de RAM): los demás esperan su turno.
import fcntl
# Si ya lo lanzaron dentro de `flock …pl_whisper.lock` (un proceso padre tiene el candado), no se vuelve a pedir:
# pedirlo dos veces bloquearía el proceso para siempre.
def _padre_con_candado():
    pid = os.getppid()
    while pid > 1:
        try:
            if b'pl_whisper.lock' in open(f'/proc/{pid}/cmdline', 'rb').read():
                return True
            pid = int(open(f'/proc/{pid}/stat').read().rsplit(')', 1)[1].split()[1])
        except Exception:
            return False
    return False
if not _padre_con_candado():
    _lock = open('/tmp/claude-0/pl_whisper.lock', 'w')
    fcntl.flock(_lock, fcntl.LOCK_EX)
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
