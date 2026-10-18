#!/usr/bin/env python3
"""Portadas de «Los 10 mejores · Fantasía»: descarga (Audible España por ASIN; Storytel por URL), fondo desenfocado y mosaicos de censura.
Uso: python3 tools/t10f_covers.py  → video/public/t10f/covers/{nombre}.jpg, bg_{nombre}.jpg, mz{N}_{nombre}.png y video/public/t10f/cand/*.jpg"""
import io, json, os, subprocess
import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'video', 'public', 't10f')
COV, CAND = os.path.join(ROOT, 'covers'), os.path.join(ROOT, 'cand')
MOSAIC = [8, 12, 18, 28, 44, 70]

# Elegidas (p = 1 → n.º 10): una portada por narración, en el orden de `narr`.
TOP = {
    '10_alicia': 'B08JCXW6FM', '09_circe': 'B0D6WTXXF1', '08_harry': '1781105189', '07_hobbit': 'B0C8YXDX3M',
    '07_hobbit_jenner': 'storytel:https://www.storytel.com/images/320x320/0004401439.jpg',
    '06_viento': '8401017025', '05_gudu': 'B09F35CGFP', '04_idhun': '8726762390', '03_alas': 'B0GY9M4ZW3', '03_alas_integra': 'B0C9NS8SP3',
    '02_imperio': '8417347631', '01_comunidad': 'B0BP2SF9B3',
}
# Los otros dos tomos de El Señor de los Anillos (final del n.º 1).
EXTRA = {'01_dos_torres': 'B0BSVHHGY8', '01_retorno': 'B0BZJ78D7J'}
# Candidatas descartadas (muro de la investigación).
CANDS = {
    'acotar': 'B0B7CNCVVR', 'silmarillion': 'B0C1CWLZB2', 'aquiles': 'B0D6X4V25P', 'cuervos': 'B0D8M5Q6ZG', 'amapola': 'B0CVNM8SK8', 'vampiro': 'B0C1Q1KY5H',
    'hermanos': 'B0D37Q6THV', 'terramar': 'B09S6LT5JC', 'camino_reyes': '8417347895', 'elantris': 'B09NLYSYVD', 'valle_lobos': 'B0DJPSYW99', 'principe_cruel': 'B0C4LSTRN7',
    'juego_tronos': 'com:6073174500', 'color_magia': 'B07ZPHHXFY', 'ladron_rayo': 'B081QRHP6S', 'piranesi': 'B09G3MRGKZ', 'crepusculo': '6073199899', 'quinta_estacion': 'B0BGYBP1BQ',
}

def curl(url):
    return subprocess.run(['curl', '-s', '-L', '-m', '60', '-A', 'Mozilla/5.0', url], capture_output=True).stdout

def image_url(ref):
    if ref.startswith('storytel:'):
        return ref.split(':', 1)[1]
    host = 'api.audible.es'
    if ref.startswith('com:'):
        host, ref = 'api.audible.com', ref[4:]
    d = json.loads(curl(f'https://{host}/1.0/catalog/products/{ref}?response_groups=media&image_sizes=1215,500'))
    imgs = d['product'].get('product_images') or {}
    return imgs.get('1215') or imgs.get('500')

def load(ref, size):
    im = Image.open(io.BytesIO(curl(image_url(ref)))).convert('RGB')
    w, h = im.size
    s = min(w, h)
    im = im.crop(((w - s) // 2, (h - s) // 2, (w - s) // 2 + s, (h - s) // 2 + s))
    return im.resize((size, size), Image.LANCZOS)

def bg(im):
    # Fondo: la portada reducida a 12×7 (no se lee nada), ampliada, muy desenfocada y con el brillo igualado.
    small = im.resize((12, 7), Image.BILINEAR).resize((960, 540), Image.BICUBIC).filter(ImageFilter.GaussianBlur(70))
    a = np.asarray(small).astype(np.float32)
    a = np.clip(a * (70.0 / max(1.0, a.mean())), 0, 255)
    return Image.fromarray(a.astype(np.uint8))

if __name__ == '__main__':
    os.makedirs(COV, exist_ok=True); os.makedirs(CAND, exist_ok=True)
    for name, ref in TOP.items():
        im = load(ref, 1200)
        im.save(os.path.join(COV, f'{name}.jpg'), quality=92)
        bg(im).save(os.path.join(COV, f'bg_{name}.jpg'), quality=90)
        for n in MOSAIC:
            im.resize((n, n), Image.BOX).resize((1200, 1200), Image.NEAREST).save(os.path.join(COV, f'mz{n}_{name}.png'), optimize=True)
        print('ok', name)
    for name, ref in EXTRA.items():
        load(ref, 1200).save(os.path.join(COV, f'{name}.jpg'), quality=92)
        print('ok extra', name)
    for name, ref in CANDS.items():
        load(ref, 500).save(os.path.join(CAND, f'{name}.jpg'), quality=90)
        print('ok cand', name)
