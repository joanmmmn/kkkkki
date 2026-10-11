#!/usr/bin/env python3
"""Iguala el volumen de las secciones de una música de ElevenLabs (que suele ir subiendo) para que quede pareja bajo la voz.

Uso: python3 tools/music_level.py <entrada.mp3> <plan.json> <salida.mp3> [--target -14.5] [--first -18] [--keep-last]
Mide cada sección del plan (EBU R128), calcula la ganancia hasta `target` (máx. ±6 dB) y la aplica con rampas
suaves de 1,5 s en los cambios de sección. `--first` fija otro objetivo para la primera sección (entrada más suave);
`--keep-last` deja la última sección (el final con su cola) como está.
"""
import json, re, subprocess, sys
import numpy as np

SR = 44100


def lufs(path, start, dur):
    out = subprocess.run(['ffmpeg', '-hide_banner', '-ss', str(start), '-t', str(dur), '-i', path, '-af', 'ebur128', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    m = re.findall(r'I:\s+(-?[\d.]+) LUFS', out)
    return float(m[-1]) if m else None


def main():
    src, plan_path, dst = sys.argv[1:4]
    arg = lambda k, d: float(sys.argv[sys.argv.index(k) + 1]) if k in sys.argv else d
    target, first = arg('--target', -14.5), arg('--first', None)
    keep_last = '--keep-last' in sys.argv
    secs = json.load(open(plan_path))['composition_plan']['sections']
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-f', 's16le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True).stdout
    a = np.frombuffer(raw, np.int16).astype(np.float32).reshape(-1, 2) / 32768
    n = len(a)
    bounds, gains, t = [], [], 0.0
    for i, s in enumerate(secs):
        d = s['duration_ms'] / 1000
        level = lufs(src, t, d)
        goal = first if (i == 0 and first is not None) else target
        g = 0.0 if (level is None or (keep_last and i == len(secs) - 1)) else max(-6.0, min(6.0, goal - level))
        print(f"{s['section_name']:24} {level if level is not None else float('nan'):6.1f} LUFS → {g:+.1f} dB")
        bounds.append(t)
        gains.append(g)
        t += d
    # Envolvente en dB: constante en cada sección y rampas de 1,5 s centradas en cada cambio.
    tt = np.arange(n) / SR
    env = np.full(n, gains[0], np.float32)
    for i in range(1, len(gains)):
        b = bounds[i]
        ramp = np.clip((tt - (b - 0.75)) / 1.5, 0, 1)
        env = env + ramp * (gains[i] - gains[i - 1])
    out = a * (10 ** (env / 20))[:, None]
    peak = float(np.abs(out).max())
    if peak > 0.97:  # sin recortes
        out *= 0.97 / peak
        print(f'pico {20 * np.log10(peak):+.1f} dBFS → bajado a -0,3 dBFS')
    pcm = (np.clip(out, -1, 1) * 32767).astype(np.int16).tobytes()
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ac', '2', '-ar', str(SR), '-i', '-', '-c:a', 'libmp3lame', '-b:a', '192k', dst], input=pcm, check=True)
    print('escrito', dst)


if __name__ == '__main__':
    main()
