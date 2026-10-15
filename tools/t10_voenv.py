#!/usr/bin/env python3
"""Envolvente de la locución (0..1 por fotograma a 50 fps) para las animaciones que reaccionan a la voz.
Lee video/public/t10/vo/*.mp3 y escribe video/src/scenes/t10/voenv.json."""
import json, subprocess, pathlib
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent
VO = ROOT / 'video/public/t10/vo'
OUT = ROOT / 'video/src/scenes/t10/voenv.json'
SR, FPS = 48000, 50
HOP = SR // FPS
env = {}
for mp3 in sorted(VO.glob('*.mp3')):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(mp3), '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
    n = int(np.ceil(len(x) / HOP))
    x = np.pad(x, (0, n * HOP - len(x)))
    rms = np.sqrt((x.reshape(n, HOP) ** 2).mean(axis=1))
    ref = np.percentile(rms[rms > 0.005], 95) if (rms > 0.005).any() else 1.0
    v = np.clip(rms / ref, 0, 1.2)
    # ataque rápido, caída suave (como un vúmetro)
    out, prev = [], 0.0
    for s in v:
        prev = s if s > prev else prev * 0.82 + s * 0.18
        out.append(round(float(min(prev, 1.0)), 2))
    env[mp3.stem] = out
OUT.write_text(json.dumps(env, separators=(',', ':')))
print(f'{len(env)} locuciones → {OUT} ({OUT.stat().st_size // 1024} KB)')
