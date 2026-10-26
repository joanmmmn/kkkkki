#!/usr/bin/env python3
"""Capturas de las webs (Audible, Spotify y Audiobooks.com) para el tutorial de cancelar, con los datos personales tapados.

Uso: python3 tools/cnl_web.py <carpeta_capturas> → video/public/cnl/web/*.png

Las capturas (1456×819, Chrome de Joan, 26/10/2026) no se guardan en el repositorio: tienen el correo, la tarjeta y nombres.
Cada salida es una o varias capturas cosidas en vertical (la misma página desplazada) y lleva parches del color del fondo:
los que se piden a mano (`boxes`) y los que encuentra el OCR (correos, nombres, tarjetas). Al final se repasa la salida con OCR.
"""
import os, re, subprocess, sys, tempfile
import numpy as np
from PIL import Image, ImageDraw

SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), '..', 'video', 'public', 'cnl', 'web')
PII = re.compile(r'[\w.+-]+@[\w-]+\.[\w.]+|gmail|sonorbooksauto|joan|olivares|andrea|0700|7467|11/2030|1/1/1970', re.I)

# nombre: (capturas [(archivo, desde_y)] cosidas, parches manuales (x, y, w, h) en la imagen final)
# CUTS: franjas que se quitan (la página sube y abajo se rellena con el color del fondo), para avisos sobre un fondo con degradado.
CUTS = {'spo_account': [(46, 118)]}  # aviso rojo «El pago ha fallado»
PAGES = {
    # Audiobooks.com: la cuenta (dos capturas: arriba y desplazada 459 px hasta «Cancel Subscription»).
    'abc_account': ([('screenshot-1793006972688-0.jpg', 0), ('screenshot-1793006972689-1.jpg', 360)], [(388, 747, 130, 26), (797, 452, 140, 18)]),
    'abc_sure': ([('screenshot-1793006998178-2.jpg', 0), ('screenshot-1793007016333-3.jpg', 90)], []),
    'abc_reasons': ([('screenshot-1793007048132-5.jpg', 0)], []),
    'abc_done': ([('screenshot-1793007066421-6.jpg', 0)], []),
    # Spotify: la cuenta (sin el aviso de pago fallido), lo que cambia, el plan Duo (sin el nombre del miembro) y la baja.
    'spo_account': ([('screenshot-1793007098222-7.jpg', 0)], []),
    'spo_change': ([('screenshot-1793007111576-8.jpg', 0)], []),
    'spo_duo': ([('screenshot-1793007127727-9.jpg', 0)], [(700, 240, 75, 12)]),
    'spo_done': ([('screenshot-1793007151242-10.jpg', 0)], [(499, 164, 175, 14)]),
    # Audible: la cuenta (sin «Cuenta de Joan», «Hola, Joan» ni «Cliente desde»).
    'aud_account': ([('screenshot-1793007208841-12.jpg', 0)], [(442, 118, 110, 20), (1032, 48, 46, 14), (626, 286, 98, 14)]),
}


def ring_color(a: np.ndarray, x: int, y: int, w: int, h: int) -> tuple:
    H, W = a.shape[:2]
    x0, y0, x1, y1 = max(0, x - 3), max(0, y - 3), min(W, x + w + 3), min(H, y + h + 3)
    box = a[y0:y1, x0:x1].astype(int)
    m = np.ones(box.shape[:2], bool)
    m[3:-3, 3:-3] = False
    return tuple(int(v) for v in np.median(box[m], axis=0))


def ocr_boxes(img: Image.Image):
    with tempfile.NamedTemporaryFile(suffix='.png') as f:
        img.resize((img.width * 2, img.height * 2), Image.LANCZOS).save(f.name)
        tsv = subprocess.run(['tesseract', f.name, '-', '--psm', '11', 'tsv'], capture_output=True, text=True).stdout
    out = []
    for line in tsv.splitlines()[1:]:
        p = line.split('\t')
        if len(p) == 12 and p[11].strip() and PII.search(p[11]):
            x, y, w, h = (int(v) // 2 for v in p[6:10])
            out.append((p[11], (x - 3, y - 3, w + 6, h + 6)))
    return out


def main():
    os.makedirs(OUT, exist_ok=True)
    for name, (shots, boxes) in PAGES.items():
        parts = []
        for fn, y0 in shots:
            im = Image.open(os.path.join(SRC, fn)).convert('RGB')
            parts.append(im.crop((0, y0, im.width, im.height)))
        W = parts[0].width
        img = Image.new('RGB', (W, sum(p.height for p in parts)))
        y = 0
        for p in parts:
            img.paste(p, (0, y))
            y += p.height
        for y0, y1 in CUTS.get(name, []):
            a0 = np.asarray(img)
            bg = tuple(int(v) for v in np.median(a0[-6:].reshape(-1, 3), axis=0))
            rest = img.crop((0, y1, img.width, img.height))
            img.paste(rest, (0, y0))
            ImageDraw.Draw(img).rectangle([0, img.height - (y1 - y0), img.width, img.height], fill=bg)
        found = [b for _, b in ocr_boxes(img)]
        a = np.asarray(img)
        d = ImageDraw.Draw(img)
        for (x, y, w, h) in boxes + found:
            d.rectangle([x, y, x + w, y + h], fill=ring_color(a, x, y, w, h))
        left = ocr_boxes(img)
        img.save(os.path.join(OUT, f'{name}.png'))
        print(name, img.size, f'{len(found)} parches por OCR', 'QUEDA: ' + str([t for t, _ in left]) if left else 'limpia')


if __name__ == '__main__':
    main()
