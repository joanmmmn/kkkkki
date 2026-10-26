#!/usr/bin/env python3
"""Busca datos personales en las tomas con OCR (tesseract) cada `paso` segundos.

Uso: python3 tools/cnl_pii.py <carpeta_rec> [paso=0.5] [tomas...]
Marca cualquier fotograma en el que aparezca un correo, un nombre o los últimos dígitos de una tarjeta de las cuentas de prueba.
"""
import os, re, subprocess, sys, tempfile

PAT = re.compile(r'[\w.+-]+@[\w-]+\.[\w.]+|gmail|sonorbooks\.com|thehomer|filosofiadevida|ernesto|olivares|andrea|joan|7467|0700|majoris', re.I)

root = sys.argv[1]
step = float(sys.argv[2]) if len(sys.argv) > 2 else 0.5
names = sys.argv[3:] or sorted(n for n in os.listdir(root) if os.path.isdir(os.path.join(root, n)))
bad = 0
for n in names:
    v = os.path.join(root, n, 'video.mp4')
    dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', v]).decode())
    t = 0.0
    hits = []
    while t < dur:
        with tempfile.NamedTemporaryFile(suffix='.png') as f:
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.2f}', '-i', v, '-frames:v', '1', '-vf', 'scale=1328:-1', f.name], check=True)
            txt = subprocess.run(['tesseract', f.name, '-', '--psm', '11'], capture_output=True, text=True).stdout
        m = [w for w in txt.split() if PAT.search(w)]
        if m:
            hits.append((round(t, 2), m[:4]))
        t += step
    bad += len(hits)
    print(f'{n}: {"OK" if not hits else hits}', flush=True)
print('TOTAL fotogramas sospechosos:', bad)
