#!/usr/bin/env python3
"""Busca fotogramas con fallo de render en un tramo renderizado (p. ej. un elemento que desaparece un solo fotograma).

1. Detecta fotogramas «sueltos»: distintos de su anterior y de su siguiente mientras esos dos se parecen entre sí
   (comparación por bloques de 64 px a 480×272).
2. Los sospechosos por encima del umbral se vuelven a renderizar sueltos con Remotion y se comparan con los del tramo:
   el render es determinista, así que si no coinciden (PSNR < 32 dB o un bloque muy distinto) es un fallo del render.

Uso (desde la raíz del repo):
  python3 tools/qa_frames.py video/out/chunks/NXReview/part_01.mp4 --start 2700 --comp NXReview [--umbral 20] [--scale 1.3333333333333333]
Imprime los fotogramas con fallo; sus PNG buenos quedan en video/out/qa_frames/<fotograma>/ para parchear el vídeo
(ffmpeg overlay con enable='eq(n,F)').
Con la reseña de Nextory v4 (12/10/2026) salieron 3 de 13446: la píldora «n/7» de tres separadores (fotogramas 18–19).
"""
import argparse, os, subprocess, sys
import numpy as np
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
VIDEO = os.path.join(ROOT, 'video')
W, H, B = 480, 272, 16


def sospechosos(src, start):
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-nostdin', '-i', src, '-vf', f'scale={W}:{H}:flags=area,format=gray', '-f', 'rawvideo', '-'], stdout=subprocess.PIPE)
    blocks = lambda a: a.reshape(H // B, B, W // B, B).mean(axis=(1, 3))
    prev2 = prev1 = None
    n, out = -1, []
    while True:
        buf = p.stdout.read(W * H)
        if len(buf) < W * H:
            break
        n += 1
        cur = blocks(np.frombuffer(buf, dtype=np.uint8).astype(np.float32))
        if prev2 is not None:
            d1, d2, d0 = np.abs(prev1 - prev2), np.abs(prev1 - cur), np.abs(cur - prev2)
            k = float(np.where(d0 < 2.5, np.minimum(d1, d2), 0).max())
            if k > 5:
                out.append((start + n - 1, k))
    p.wait()
    return out


def comprobar(src, start, frame, comp, bundle, scale='1', gl=None):
    d = os.path.join(VIDEO, 'out', 'qa_frames', str(frame))
    os.makedirs(d, exist_ok=True)
    if not any(f.endswith('.png') for f in os.listdir(d)):
        subprocess.run(['npx', 'remotion', 'render', bundle, comp, d, '--sequence', f'--frames={frame}-{frame}', '--image-format=png',
                        '--concurrency=1', '--log=error', '--offthreadvideo-cache-size-in-bytes=800000000', f'--scale={scale}', '--timeout=300000']
                       + ([f'--gl={gl}'] if gl else []), cwd=VIDEO, check=True)
    png = os.path.join(d, sorted(f for f in os.listdir(d) if f.endswith('.png'))[0])
    ref = np.asarray(Image.open(png).convert('RGB'), dtype=np.float32)
    h, w = ref.shape[:2]
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-nostdin', '-i', src, '-vf', f'select=eq(n\\,{frame - start})', '-vsync', '0', '-frames:v', '1',
                          '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True, check=True).stdout
    got = np.frombuffer(raw, dtype=np.uint8).reshape(h, w, 3).astype(np.float32)
    psnr = 10 * np.log10(255 ** 2 / max(float(((ref - got) ** 2).mean()), 1e-9))
    worst = float(np.abs(ref - got).mean(axis=2)[: h // 60 * 60, : w // 60 * 60].reshape(h // 60, 60, w // 60, 60).mean(axis=(1, 3)).max())
    return psnr, worst, png


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('src'); ap.add_argument('--start', type=int, default=0); ap.add_argument('--comp', default='NXReview')
    ap.add_argument('--umbral', type=float, default=20)
    ap.add_argument('--scale', default='1', help='la misma escala del render (p. ej. 1.3333333333333333 para 2560x1440)')
    ap.add_argument('--gl', default=None, help='el mismo motor WebGL del render (swangle para los tramos en three.js)')
    a = ap.parse_args()
    bundle = os.path.join(VIDEO, 'out', 'qa_bundle')
    if not os.path.isdir(bundle):
        subprocess.run(['npx', 'remotion', 'bundle', 'src/index.ts', f'--out-dir={bundle}'], cwd=VIDEO, check=True, stdout=subprocess.DEVNULL)
    sus = [(f, k) for f, k in sospechosos(a.src, a.start) if k >= a.umbral]
    print(f'{len(sus)} sospechosos (≥ {a.umbral})', flush=True)
    fallos = []
    for f, k in sus:
        psnr, worst, png = comprobar(a.src, a.start, f, a.comp, bundle, a.scale, a.gl)
        bad = psnr < 32 or worst > 12
        print(f'  {f}: intensidad {k:.0f}, PSNR {psnr:.1f} dB, peor bloque {worst:.1f} → {"FALLO" if bad else "ok"}', flush=True)
        if bad:
            fallos.append((f, png))
    print('FALLOS:', ' '.join(str(f) for f, _ in fallos) or 'ninguno')
    sys.exit(1 if fallos else 0)
