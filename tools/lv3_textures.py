#!/usr/bin/env python3
"""Texturas del vídeo de LibriVox («la biblioteca que habla»), generadas a partir de shelves.jpg o por procedimiento.

Uso: python3 tools/lv3_textures.py [carpeta_de_salida]   (por defecto, video/public/lv/img3)

- shelves_lit2.jpg  estanterías con más luz para el pasillo del arranque (que no se vea oscuro)
- shelves_soft.jpg  estanterías iluminadas y desenfocadas: la pared del fondo de la balda de los clásicos (sin filtros
                    en tiempo de render y sin costuras: se dibuja una sola vez, a tamaño completo)
- wood.jpg          tablas de madera con veta larga (suelo del pasillo y mesa de lectura)
- ink_wear.png      desgaste de tinta para los sellos (alfa desigual con motas sin tinta)
"""
import io
import os
import sys

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'video', 'public', 'lv', 'img3')
OUT = sys.argv[1] if len(sys.argv) > 1 else SRC
os.makedirs(OUT, exist_ok=True)


def lit(strength: float, gamma: float, red: float, blue: float, contrast: float) -> Image.Image:
    """Levanta sombras y medios de shelves.jpg (curva 1 − (1 − x)^k), con un punto más cálido."""
    a = np.asarray(Image.open(os.path.join(SRC, 'shelves.jpg')).convert('RGB'), dtype=float) / 255
    a = 1 - (1 - a) ** strength
    a = a ** gamma
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    r = np.clip(r * red, 0, 1)
    b = np.clip(b * blue, 0, 1)
    img = Image.fromarray((np.stack([r, g, b], -1) * 255).astype(np.uint8))
    return ImageEnhance.Contrast(img).enhance(contrast)


# Pasillo del arranque
lit(2.0, 0.9, 1.05, 0.92, 1.05).save(os.path.join(OUT, 'shelves_lit2.jpg'), quality=88)

# Pared de la balda: versión iluminada, reducida, muy desenfocada y algo menos saturada
buf = io.BytesIO()
lit(1.65, 0.92, 1.04, 0.93, 1.06).save(buf, 'JPEG', quality=88)  # (pasa por JPEG, como el archivo intermedio original)
soft = Image.open(io.BytesIO(buf.getvalue())).resize((1800, 750), Image.LANCZOS).filter(ImageFilter.GaussianBlur(13))
ImageEnhance.Color(soft).enhance(0.85).save(os.path.join(OUT, 'shelves_soft.jpg'), quality=86)

# Madera
W = H = 1024
y = np.linspace(0, 1, H)[:, None]
x = np.linspace(0, 1, W)[None, :]


def noise(cx: int, cy: int, seed: int) -> np.ndarray:
    r = np.random.default_rng(seed).random((cy + 1, cx + 1))
    im = Image.fromarray((r * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)
    return np.asarray(im, dtype=float) / 255


warp = noise(6, 3, 1) * 1.6 + noise(16, 5, 2) * 0.35
grain = (np.sin((x * 70 + warp) * np.pi * 2) * 0.5 + 0.5) ** 3
streak = noise(300, 6, 3)  # rayitas finas estiradas en vertical
blot = noise(10, 14, 4)  # manchas suaves
plank_i = np.floor(x * 8).astype(int).clip(0, 7)
rng = np.random.default_rng(9)
tone = np.array([rng.uniform(-0.08, 0.08) for _ in range(8)])[plank_i]
v = 0.52 + 0.2 * (grain - 0.3) + 0.14 * (streak - 0.5) + 0.1 * (blot - 0.5) + tone
fx = (x * 8) - np.round(x * 8)
v = np.where(np.abs(fx) < 0.0035, v * 0.5, v)  # juntas entre tablas
for i in range(8):  # juntas transversales escalonadas (tablas de distinta longitud)
    yy = (0.18 + 0.37 * i) % 1.0
    v = np.where((plank_i == i) & (np.abs(y - yy) < 0.0025), v * 0.6, v)
v = np.clip(v, 0, 1)
light = np.array([150, 104, 64]) / 255.0
dark = np.array([66, 41, 24]) / 255.0
col = dark + (light - dark) * v[..., None]
Image.fromarray((np.clip(col, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.5)).save(os.path.join(OUT, 'wood.jpg'), quality=88)

# Desgaste de tinta para los sellos
rng = np.random.default_rng(7)
N = 512


def vnoise(cells: int) -> np.ndarray:
    g = rng.random((cells + 1, cells + 1))
    g = np.vstack([g, g[:1]])[: cells + 1]
    g[:, -1] = g[:, 0]
    g[-1, :] = g[0, :]
    im = Image.fromarray((g * 255).astype(np.uint8)).resize((N, N), Image.BICUBIC)
    return np.asarray(im, dtype=float) / 255


nv = 0.5 * vnoise(6) + 0.3 * vnoise(14) + 0.2 * vnoise(40)
nv = (nv - nv.min()) / (nv.max() - nv.min())
a = np.clip(0.62 + 0.55 * nv, 0, 1)  # tinta desigual (más y menos cargada)
speck = rng.random((N, N))
Image.fromarray(((speck > 0.985) * 255).astype(np.uint8)).resize((N, N))  # (se conserva para la misma secuencia aleatoria)
h = np.asarray(Image.fromarray(((speck > 0.992) * 255).astype(np.uint8)).resize((N // 2, N // 2)).resize((N, N), Image.BILINEAR), dtype=float) / 255
a = np.clip(a - 0.9 * h, 0, 1)
a[nv < 0.12] *= 0.35  # alguna zona casi sin tinta
rgba = np.zeros((N, N, 4), np.uint8)
rgba[..., :3] = 255
rgba[..., 3] = (a * 255).astype(np.uint8)
Image.fromarray(rgba).save(os.path.join(OUT, 'ink_wear.png'))
print('texturas en', OUT)
