#!/usr/bin/env python3
"""Tapa los datos personales que quedan dentro de las tomas de la app de BookBeat (reseña de BookBeat).

- Nombre del perfil de la cuenta en las páginas web de la cuenta (16_horas: «My hours», con el nombre también al principio de
  la frase de consumo; 18_perfiles_web: «Profiles»).
- Nombre de quien escribe la reseña que se ve en la ficha de La sombra del viento (09_sombra_ficha).
- Tarjeta de pago (los cuatro últimos números y la caducidad) en Account Information (26_cuenta).

Los nombres van junto a un círculo amarillo con la inicial: en cada fotograma se buscan esos círculos (aunque se desplacen o
entren a medias por un borde), se repinta su interior con su amarillo (sin la letra) y se pinta la línea del nombre, a su
derecha, con el color del fondo de esa fila. La comprobación independiente (OCR de los fotogramas tapados buscando el nombre,
el correo y la tarjeta) está en el documento del proyecto. La tarjeta está siempre en el mismo sitio (la toma empieza con la página ya
cargada y acaba antes de que se abra la ventana de cambio de plan). La cabecera del perfil de la app (nombre y correo) no
está en ninguna toma: tools/bkb_clips.py corta antes y después.

Uso (desde la raíz del repo): python3 tools/bkb_cover.py [toma1,toma2]   (por defecto, las cuatro)
Reescribe video/public/bkb/rec/<toma>/video.mp4 (+ first.jpg y last.jpg) con la misma calidad que tools/bkb_clips.py.
Se aplica sobre los cortes recién hechos: si una toma ya está tapada (index.json → "datos": "tapados"), no hace nada.
"""
import json, os, subprocess, sys
import numpy as np
from scipy import ndimage

REC = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'video/public/bkb/rec')
W, H = 664, 1440
# toma: (zona en vertical por debajo de la barra de estado; ¿tapar la frase de consumo?). Ojo: en las páginas web la barra
# del navegador se esconde al desplazarse, así que el contenido llega hasta la barra de estado (y = 38).
AVATAR_TAKES = {
    '09_sombra_ficha': ((38, 1440), False),
    '16_horas': ((38, 1440), True),
    '18_perfiles_web': ((38, 1440), False),
}
CARD_TAKES = {'26_cuenta': (44, 1308, 340, 1386)}  # x0, y0, x1, y1: «MC **** **** **** NNNN» y la caducidad debajo


def yellow(a: np.ndarray) -> np.ndarray:
    r, g, b = a[..., 0].astype(np.int16), a[..., 1].astype(np.int16), a[..., 2].astype(np.int16)
    return (r > 225) & (g > 195) & (g < 250) & (b < 150)


def bg_of(a: np.ndarray, x0: int, x1: int, y0: int, y1: int) -> np.ndarray:
    return np.median(a[y0:y1, x0:x1].reshape(-1, 3), axis=0)


def fix_avatars(a: np.ndarray, clip: tuple, sentence: bool) -> int:
    """Círculos amarillos pequeños (Ø ≈ 40–46 px) en el margen izquierdo: interior sin letra y nombre tapado."""
    c0, c1 = clip
    band = a[c0:c1, 0:150]
    lab, n = ndimage.label(yellow(band))
    done = 0
    for k, sl in enumerate(ndimage.find_objects(lab), start=1):
        if sl is None:
            continue
        ys, xs = sl
        w, h = xs.stop - xs.start, ys.stop - ys.start
        if not (30 <= w <= 52 and 4 <= h <= 52):
            continue
        y0, y1 = ys.start + c0, ys.stop + c0
        cx, r = (xs.start + xs.stop - 1) / 2, w / 2
        # centro vertical: si el círculo entra a medias por un borde de la zona útil, se calcula desde el lado visible
        if h >= w - 3:
            cy = (y0 + y1 - 1) / 2
        elif y1 >= c1 - 1:
            cy = y0 + r
        elif y0 <= c0 + 1:
            cy = y1 - 1 - r
        else:
            cy = (y0 + y1 - 1) / 2
        m = lab[ys, xs] == k
        col = np.median(band[ys, xs][m].reshape(-1, 3), axis=0)
        # interior: de punta a punta del amarillo en cada fila (la letra queda dentro)
        for i in range(h):
            row = np.nonzero(m[i])[0]
            if len(row) >= 2:
                a[y0 + i, xs.start + row[0]:xs.start + row[-1] + 1] = col
        # nombre: a la derecha del círculo, misma altura. Si el círculo asoma a medias (lo tapa la barra del navegador, la de
        # la app o el minirreproductor), el nombre asoma en las mismas filas: solo se pinta ahí, para no pintar encima de
        # lo que lo tapa.
        nx0 = int(cx + r + 9)
        nx1 = min(W - 70, nx0 + 175)
        ny0 = max(c0, int(cy - 22))
        ny1 = min(c1, int(cy + 23))
        if h < w - 3:
            ny0, ny1 = max(ny0, y0), min(ny1, y1)
        if ny1 > ny0:
            bg = bg_of(a, nx0 - 5, nx0 - 1, ny0, ny1)
            a[ny0:ny1, nx0:nx1] = bg
        # «Filosofía has listened…»: la primera palabra de la frase de consumo, debajo del círculo (página «My hours»)
        if sentence:
            sx0, sx1 = int(cx - 30), int(cx + 80)
            sy0, sy1 = max(c0, int(cy + 50)), min(c1, int(cy + 89))
            if sy1 > sy0:
                bg = bg_of(a, int(cx - 44), int(cx - 37), sy0, sy1)
                a[sy0:sy1, sx0:sx1] = bg
        done += 1
    return done


def fix_card(a: np.ndarray, box: tuple) -> int:
    x0, y0, x1, y1 = box
    bg = bg_of(a, x0 - 14, x0 - 6, y0, y1)
    a[y0:y1, x0:x1] = bg
    return 1


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
    n = hits = 0
    size = W * H * 3
    while True:
        b = dec.stdout.read(size)
        if len(b) < size:
            break
        a = np.frombuffer(b, np.uint8).reshape(H, W, 3).copy()
        if name in AVATAR_TAKES:
            clip, sentence = AVATAR_TAKES[name]
            hits += fix_avatars(a, clip, sentence) > 0
        if name in CARD_TAKES:
            hits += fix_card(a, CARD_TAKES[name])
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
    print(f'{name}: {n} fotogramas, {hits} con datos tapados', flush=True)


if __name__ == '__main__':
    for name in (sys.argv[1].split(',') if len(sys.argv) > 1 else [*AVATAR_TAKES, *CARD_TAKES]):
        process(name)
