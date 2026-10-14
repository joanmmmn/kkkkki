#!/usr/bin/env python3
"""Tapa el nombre y las iniciales de la cuenta en la cabecera del perfil de la app de Audible (reseña de Audible).

La pestaña Perfil enseña, arriba, un círculo con las iniciales de la cuenta y el nombre de la cuenta de la grabación. No se
enseñan en el vídeo: en cada fotograma se pinta el nombre con el color del fondo de esa fila y el interior del círculo con su
propio color (también cuando la hoja del perfil infantil oscurece la pantalla, porque los colores se toman del fotograma).
La cabecera no se desplaza en estas tomas, así que las zonas son fijas (coordenadas de la grabación, 664×1440).

Uso (desde la raíz del repo): python3 tools/aud_cover.py [toma1,toma2]   (por defecto, 20_perfil_infantil)
Reescribe video/public/aud/rec/<toma>/video.mp4 (+ first.jpg y last.jpg) con la misma calidad que tools/aud_clips.py.
"""
import json, os, subprocess, sys
import numpy as np

REC = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'video/public/aud/rec')
W, H = 664, 1440
TAKES = ['20_perfil_infantil']
NAME = (150, 334, 514, 392)       # x0, y0, x1, y1: línea del nombre
NAME_BG = (60, 362)               # punto de fondo en la misma fila
CIRCLE = (332, 236, 66)           # centro y radio del disco que se repinta (el círculo mide ~84 px de radio)
CIRCLE_COL = (332, 166)           # punto dentro del círculo, por encima de las letras


def fix(a: np.ndarray) -> bool:
    x0, y0, x1, y1 = NAME
    bg = a[NAME_BG[1] - 2:NAME_BG[1] + 3, NAME_BG[0] - 2:NAME_BG[0] + 3].reshape(-1, 3).mean(axis=0)
    a[y0:y1, x0:x1] = bg.round().astype(np.uint8)
    cx, cy, r = CIRCLE
    col = a[CIRCLE_COL[1] - 2:CIRCLE_COL[1] + 3, CIRCLE_COL[0] - 2:CIRCLE_COL[0] + 3].reshape(-1, 3).mean(axis=0)
    yy, xx = np.mgrid[cy - r - 2:cy + r + 3, cx - r - 2:cx + r + 3]
    alpha = np.clip(r + 0.5 - np.hypot(xx - cx, yy - cy), 0, 1)[..., None]
    patch = a[cy - r - 2:cy + r + 3, cx - r - 2:cx + r + 3].astype(np.float32)
    a[cy - r - 2:cy + r + 3, cx - r - 2:cx + r + 3] = (patch * (1 - alpha) + col * alpha).round().astype(np.uint8)
    return True


def process(name: str):
    d = os.path.join(REC, name)
    src = os.path.join(d, 'video.mp4')
    tmp = os.path.join(d, 'video.tmp.mp4')
    dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', src, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
    enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', '50', '-i', '-',
                            '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-r', '50', '-g', '50', '-movflags', '+faststart', '-an', tmp],
                           stdin=subprocess.PIPE)
    n = 0
    size = W * H * 3
    while True:
        b = dec.stdout.read(size)
        if len(b) < size:
            break
        a = np.frombuffer(b, np.uint8).reshape(H, W, 3).copy()
        fix(a)
        enc.stdin.write(a.tobytes())
        n += 1
    dec.wait()
    enc.stdin.close()
    enc.wait()
    os.replace(tmp, src)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-sseof', '-0.1', '-i', src, '-frames:v', '1', '-q:v', '2', os.path.join(d, 'last.jpg')], check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-frames:v', '1', '-q:v', '2', os.path.join(d, 'first.jpg')], check=True)
    idx_path = os.path.join(REC, 'index.json')
    idx = json.load(open(idx_path))
    idx[name]['cuenta'] = 'tapada'
    json.dump(idx, open(idx_path, 'w'), indent=1)
    print(f'{name}: {n} fotogramas, nombre e iniciales tapados', flush=True)


if __name__ == '__main__':
    for name in (sys.argv[1].split(',') if len(sys.argv) > 1 else TAKES):
        process(name)
