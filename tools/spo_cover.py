#!/usr/bin/env python3
"""Tapa los datos personales que quedan dentro de las tomas de la app de Spotify (reseña de sus audiolibros).

- 00_buscar (la pantalla Buscar): el avatar rosa con la inicial de la cuenta (se repinta el círculo sin la letra) y las filas
  personalizadas de debajo de las categorías («Listas que puedes ver», «Descubre episodios seleccionados para ti»), que se
  desenfocan a fondo y se oscurecen.
- 12_checkout (pantalla de pago de Audiolibros+): el avatar (sin la letra); el calendario de cobros de la cuenta (su plan y su
  fecha de facturación), que se desenfoca y se oscurece como en Buscar; y, desde la raya que hay debajo de las condiciones de
  la prueba, la dirección y la forma de pago (tarjeta), que se pintan con el gris del fondo de la página.

Las posiciones son fijas: las dos tomas no se desplazan (Buscar está quieta hasta el toque en «Audiolibros», con el que acaba la
toma; la pantalla de pago se graba ya cargada y la toma acaba antes de cerrarla). La lista «Recientes» del buscador, el menú del
perfil y «Tu Premium» no están en ninguna toma: tools/spo_clips.py corta antes y después. La comprobación con OCR está en el
documento del proyecto y en research/spotify/resena/guion.md.

Uso (desde la raíz del repo): python3 tools/spo_cover.py [toma1,toma2]   (por defecto, las dos)
Reescribe video/public/spo/rec/<toma>/video.mp4 (+ first.jpg y last.jpg) con la misma calidad que tools/spo_clips.py.
Se aplica sobre los cortes recién hechos: si una toma ya está tapada (index.json → "datos": "tapados"), no hace nada.
"""
import json, os, subprocess, sys
import numpy as np
from scipy import ndimage

REC = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'video/public/spo/rec')
W, H = 664, 1440
PINK = np.array([243, 113, 159], np.uint8)
BG = np.array([17, 17, 17], np.uint8)
yy, xx = np.mgrid[0:H, 0:W]


def circle(a: np.ndarray, cx: float, cy: float, r: float):
    """Repinta el avatar: un círculo rosa liso (sin la letra), con el borde suavizado sobre lo que hubiera detrás."""
    d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    alpha = np.clip(r + 0.5 - d, 0, 1)[..., None]
    sl = (slice(int(cy - r - 2), int(cy + r + 3)), slice(int(cx - r - 2), int(cx + r + 3)))
    a[sl] = (a[sl] * (1 - alpha[sl]) + PINK * alpha[sl]).astype(np.uint8)


def veil(a: np.ndarray, y0: int, y1: int, sigma: float = 34, k: int = 24):
    """Desenfoca a fondo y oscurece la franja y0–y1 (con fundidos de k px arriba y abajo)."""
    band = a[y0:y1].astype(np.float32)
    for c in range(3):
        band[..., c] = ndimage.gaussian_filter(band[..., c], sigma=sigma, mode='nearest')
    band = band * 0.45 + 17 * 0.55
    ramp = np.ones(y1 - y0, np.float32)
    ramp[:k] = np.linspace(0, 1, k)
    ramp[-k:] = np.linspace(1, 0, k)
    orig = a[y0:y1].astype(np.float32)
    a[y0:y1] = (orig * (1 - ramp[:, None, None]) + band * ramp[:, None, None]).astype(np.uint8)
    a[y0 + k:y1 - k] = (a[y0 + k:y1 - k].astype(np.float32) * 0.55 + 17 * 0.45).astype(np.uint8)


def cover_buscar(a: np.ndarray):
    circle(a, 51.0, 77.0, 26.5)
    y0, y1 = 538, 1252
    band = a[y0:y1].astype(np.float32)
    for c in range(3):
        band[..., c] = ndimage.gaussian_filter(band[..., c], sigma=34, mode='nearest')
    band = band * 0.45 + 17 * 0.55
    # fundido de 24 px arriba y abajo para que el borde del desenfoque no se note
    ramp = np.ones(y1 - y0, np.float32)
    k = 24
    ramp[:k] = np.linspace(0, 1, k)
    ramp[-k:] = np.linspace(1, 0, k)
    orig = a[y0:y1].astype(np.float32)
    a[y0:y1] = (orig * (1 - ramp[:, None, None]) + band * ramp[:, None, None]).astype(np.uint8)
    # las filas personalizadas no deben verse ni siquiera difuminadas en la parte central: velo oscuro
    a[y0 + k:y1 - k] = (a[y0 + k:y1 - k].astype(np.float32) * 0.55 + 17 * 0.45).astype(np.uint8)


def cover_checkout(a: np.ndarray):
    circle(a, 617.5, 199.5, 23.5)
    # El calendario de cobros de la cuenta (su plan y su fecha de facturación): desenfocado y oscurecido.
    veil(a, 418, 744, sigma=22, k=16)
    a[878:H, :] = BG


COVERS = {'00_buscar': cover_buscar, '12_checkout': cover_checkout}


def process(name: str):
    d = os.path.join(REC, name)
    idx_path = os.path.join(REC, 'index.json')
    idx = json.load(open(idx_path))
    if idx.get(name, {}).get('datos') == 'tapados':
        print(f'{name}: ya estaba tapada', flush=True)
        return
    src = os.path.join(d, 'video.mp4')
    tmp = os.path.join(d, 'video.tmp.mp4')
    dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', src, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
    enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', '50', '-i', '-',
                            '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-r', '50', '-g', '50', '-movflags', '+faststart', '-an', tmp],
                           stdin=subprocess.PIPE)
    n = 0
    size = W * H * 3
    fn = COVERS[name]
    while True:
        b = dec.stdout.read(size)
        if len(b) < size:
            break
        a = np.frombuffer(b, np.uint8).reshape(H, W, 3).copy()
        fn(a)
        enc.stdin.write(a.tobytes())
        n += 1
    dec.wait()
    enc.stdin.close()
    enc.wait()
    os.replace(tmp, src)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-sseof', '-0.1', '-i', src, '-frames:v', '1', '-q:v', '2', os.path.join(d, 'last.jpg')], check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-frames:v', '1', '-q:v', '2', os.path.join(d, 'first.jpg')], check=True)
    idx = json.load(open(idx_path))
    idx[name]['datos'] = 'tapados'
    json.dump(idx, open(idx_path, 'w'), indent=1)
    print(f'{name}: {n} fotogramas tapados', flush=True)


if __name__ == '__main__':
    for name in (sys.argv[1].split(',') if len(sys.argv) > 1 else list(COVERS)):
        process(name)
