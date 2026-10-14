#!/usr/bin/env python3
"""Texturas del vídeo de eBiblio («la puerta»): grano de imprenta y sombreados punteados como los de las ilustraciones de
su identidad, más el logotipo de eBiblio sin fondo (recortado de la captura pública de eBiblio Madrid).

Uso: python3 tools/eb_textures.py   (escribe en video/public/eb/img)

- grain.png      grano fino de imprenta, repetible (se superpone a todo el vídeo en modo «multiply»)
- st_v.png       punteado en degradado vertical (denso arriba, nada abajo): máscara para sombrear formas planas
- st_h.png       lo mismo en horizontal (denso a la izquierda)
- st_r.png       punteado radial (denso en los bordes, limpio en el centro)
- ebiblio_logo.png  el logotipo de eBiblio (puerta naranja y palabra) con el blanco convertido en transparencia
- ebiblio_logo_white.png  el logotipo en blanco de la cabecera de ebiblio.es (más grande), con el coral convertido en transparencia
"""
import os

import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'video', 'public', 'eb', 'img')
WEB = os.path.join(ROOT, 'video', 'public', 'eb', 'web')
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(2026)

# Grano: ruido gris centrado en blanco (multiply: oscurece un poco y de forma desigual), con algo de grumo
N = 512
g = rng.normal(0, 1, (N, N))
blob = np.asarray(Image.fromarray(((rng.random((N // 8, N // 8))) * 255).astype(np.uint8)).resize((N, N), Image.BICUBIC), dtype=float) / 255
v = 1 - np.clip(0.05 + 0.07 * g + 0.05 * (blob - 0.5), 0, 0.35)
Image.fromarray((v * 255).astype(np.uint8), 'L').convert('RGB').save(os.path.join(OUT, 'grain.png'))


def stipple(alpha_target: np.ndarray, dot: int = 2) -> np.ndarray:
    """Punteado: cada celda de `dot` px es un punto opaco con probabilidad = alpha_target (umbral con ruido)."""
    h, w = alpha_target.shape
    cells = rng.random((h // dot, w // dot))
    small = Image.fromarray((alpha_target * 255).astype(np.uint8)).resize((w // dot, h // dot), Image.BILINEAR)
    t = np.asarray(small, dtype=float) / 255
    on = (cells < t).astype(np.uint8) * 255
    im = Image.fromarray(on).resize((w, h), Image.NEAREST).filter(ImageFilter.GaussianBlur(0.35))
    return np.asarray(im)


def save_mask(a: np.ndarray, name: str) -> None:
    rgba = np.zeros((*a.shape, 4), np.uint8)
    rgba[..., :3] = 255
    rgba[..., 3] = a
    Image.fromarray(rgba).save(os.path.join(OUT, name))


S = 1024
y = np.linspace(0, 1, S)[:, None] * np.ones((1, S))
x = np.ones((S, 1)) * np.linspace(0, 1, S)[None, :]
ease = lambda t: np.clip(t, 0, 1) ** 1.6
save_mask(stipple(ease(1 - y) * 0.92), 'st_v.png')
save_mask(stipple(ease(1 - x) * 0.92), 'st_h.png')
r = np.sqrt((x - 0.5) ** 2 + (y - 0.5) ** 2) / 0.7071
save_mask(stipple(np.clip((r - 0.45) / 0.55, 0, 1) ** 1.3 * 0.9), 'st_r.png')

# Logotipo de eBiblio (captura pública de madrid.ebiblio.es, a 3×): blanco → transparente
cap = Image.open(os.path.join(WEB, 'mhome.png')).convert('RGB')
x0, y0, x1, y1 = 1050 * 3, 50 * 3, 1226 * 3, 140 * 3
logo = np.asarray(cap.crop((x0, y0, x1, y1)), dtype=float) / 255
# alfa según lo lejos que está cada píxel del blanco (conserva el antialias), y color «des-mezclado» del blanco
dist = 1 - logo.min(axis=2)
alpha = np.clip(dist * 1.08, 0, 1)
col = np.where(alpha[..., None] > 0.001, (logo - (1 - alpha[..., None])) / np.maximum(alpha[..., None], 1e-3), 0)
rgba = np.concatenate([np.clip(col, 0, 1), alpha[..., None]], axis=2)
im = Image.fromarray((rgba * 255).astype(np.uint8), 'RGBA')
im = im.crop(im.getbbox())
im.save(os.path.join(OUT, 'ebiblio_logo.png'))

# Logotipo blanco de la cabecera de ebiblio.es (fondo coral #E37353): alfa según la distancia al coral en el canal verde
cap = Image.open(os.path.join(WEB, 'portal.png')).convert('RGB')
crop = np.asarray(cap.crop((940 * 3, 45 * 3, 1265 * 3, 210 * 3)), dtype=float)
coral = np.array([227, 115, 83], dtype=float)
a = np.clip((crop - coral) / (255 - coral), 0, 1).min(axis=2)  # 0 en coral, 1 en blanco puro
a = np.clip((a - 0.04) / 0.92, 0, 1)
rgba = np.zeros((*a.shape, 4), np.uint8)
rgba[..., :3] = 255
rgba[..., 3] = (a * 255).astype(np.uint8)
im2 = Image.fromarray(rgba, 'RGBA')
im2 = im2.crop(im2.getbbox())
im2.save(os.path.join(OUT, 'ebiblio_logo_white.png'))
print('texturas en', OUT, 'logo', im.size, 'logo blanco', im2.size)
