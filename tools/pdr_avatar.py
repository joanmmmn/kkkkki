#!/usr/bin/env python3
"""Tapa la inicial de la cuenta en las tomas de la app de Podimo (reseña v2).

En la cabecera de Inicio, Buscar y Biblioteca la app enseña un círculo rosa con la inicial de la cuenta de la grabación.
No es un dato sensible, pero no hace falta enseñarlo (la página web ya la difumina): aquí se pinta encima un círculo del
mismo rosa, sin letra, en cada fotograma en que aparece (se busca el rosa en la esquina superior derecha, así que también
sigue al círculo si la página se desplaza).

Uso (desde la raíz del repo): python3 tools/pdr_avatar.py [toma1,toma2]   (por defecto, las tomas en que sale)
Reescribe video/public/pdr/rec/<toma>/video.mp4 (+ first.jpg y last.jpg) con la misma calidad que tools/pdr_clips.py.
"""
import json, os, subprocess, sys
import numpy as np

REC = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'video/public/pdr/rec')
W, H = 664, 1440
TAKES = ['03_recopilando', '04_inicio', '05_buscar', '12_biblioteca', '14_regala', '15_inicio_top', '16_audiolibros']
X0, X1, Y1 = 540, 664, 400  # zona de búsqueda
R = 25.6  # radio del círculo (50 px de diámetro en la grabación)
STATUS = 0  # se pinta también bajo la barra de estado (el círculo pasa por detrás al desplazarse)


def fix(a: np.ndarray) -> bool:
    reg = a[:Y1, X0:X1].astype(np.int16)
    r, g, b = reg[..., 0], reg[..., 1], reg[..., 2]
    # Rosa por tono (también cuando un fundido lo oscurece o lo aclara): rojo muy por encima del verde, azul por encima del verde.
    m = (r - g > 60) & (r - b > 40) & (b - g > 20)
    if m.sum() < 120:
        return False
    ys, xs = np.nonzero(m)
    # Solo el círculo de la cabecera: una mancha redonda de ~50 px en la columna x = 588–637.
    xs_abs = xs + X0
    keep = (xs_abs >= 578) & (xs_abs <= 648)
    if keep.sum() < 120:
        return False
    xs_abs, ys = xs_abs[keep], ys[keep]
    if not (30 <= xs_abs.max() - xs_abs.min() <= 58):
        return False
    cx = (xs_abs.min() + xs_abs.max()) / 2
    top, bot = ys.min(), ys.max()
    if bot - top > 58:
        return False
    cy = (top + bot) / 2 if bot - top >= 44 else bot - 24.5  # si asoma solo la parte de abajo, se cuenta desde abajo
    col = np.median(reg[ys, xs_abs - X0], axis=0).astype(np.float32)  # el rosa tal como se ve en este fotograma
    y0, y1 = max(STATUS, int(cy - R - 2)), min(H, int(cy + R + 3))
    x0, x1 = max(0, int(cx - R - 2)), min(W, int(cx + R + 3))
    if y1 <= y0:
        return False
    yy, xx = np.mgrid[y0:y1, x0:x1]
    d = np.hypot(xx - cx, yy - cy)
    alpha = np.clip(R + 0.5 - d, 0, 1)[..., None]
    patch = a[y0:y1, x0:x1].astype(np.float32)
    a[y0:y1, x0:x1] = (patch * (1 - alpha) + col * alpha).round().astype(np.uint8)
    return True


def process(name: str):
    d = os.path.join(REC, name)
    src = os.path.join(d, 'video.mp4')
    tmp = os.path.join(d, 'video.tmp.mp4')
    dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', src, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
    enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', '50', '-i', '-',
                            '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-r', '50', '-g', '50', '-movflags', '+faststart', '-an', tmp],
                           stdin=subprocess.PIPE)
    n = hits = 0
    size = W * H * 3
    while True:
        b = dec.stdout.read(size)
        if len(b) < size:
            break
        a = np.frombuffer(b, np.uint8).reshape(H, W, 3).copy()
        if fix(a):
            hits += 1
        enc.stdin.write(a.tobytes())
        n += 1
    dec.wait()
    enc.stdin.close()
    enc.wait()
    os.replace(tmp, src)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-sseof', '-0.1', '-i', src, '-frames:v', '1', '-q:v', '2', os.path.join(d, 'last.jpg')], check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-frames:v', '1', '-q:v', '2', os.path.join(d, 'first.jpg')], check=True)
    dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', src]).decode().strip())
    idx_path = os.path.join(REC, 'index.json')
    idx = json.load(open(idx_path))
    old = idx[name]['duration']
    idx[name]['duration'] = round(dur, 3)
    idx[name]['avatar'] = 'tapado'
    json.dump(idx, open(idx_path, 'w'), indent=1)
    print(f'{name}: {n} fotogramas, círculo tapado en {hits} (duración {old} → {round(dur, 3)})', flush=True)


if __name__ == '__main__':
    for name in (sys.argv[1].split(',') if len(sys.argv) > 1 else TAKES):
        process(name)
