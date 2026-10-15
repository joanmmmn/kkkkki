#!/usr/bin/env python3
"""Texturas de la v2 de «La historia detrás del libro» (teatro de sombras de papel).

public/hdl/img/fiber.png: capa RGBA a pantalla completa que se pone encima de todo con opacidad normal (sin modos de fusión,
que son caros de componer): fibras y moteado de papel hecho a mano. Los píxeles que aclaran llevan color crema y los que
oscurecen, sepia oscuro; el alfa es la intensidad. Determinista (semilla fija).
Uso: python3 tools/hdl_v2_tex.py
"""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

rng = np.random.default_rng(1966)
W, H = 1920, 1080


def blur_noise(scale, sigma):
    n = rng.normal(0, 1, (H // scale + 2, W // scale + 2)).astype(np.float32)
    im = Image.fromarray(((n - n.min()) / (n.max() - n.min()) * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(sigma))
    a = np.asarray(im, np.float32) / 255 - 0.5
    return a / (np.abs(a).max() + 1e-6)


mott = 0.55 * blur_noise(90, 40) + 0.45 * blur_noise(22, 9)
grain = rng.normal(0, 1, (H, W)).astype(np.float32)
fib = Image.new('L', (W, H), 128)
d = ImageDraw.Draw(fib)
for _ in range(2600):
    x, y = rng.uniform(0, W), rng.uniform(0, H)
    ang = rng.uniform(0, np.pi)
    L = rng.uniform(6, 44)
    pts = [(x, y)]
    for k in range(4):
        ang += rng.normal(0, 0.25)
        x, y = x + np.cos(ang) * L / 4, y + np.sin(ang) * L / 4
        pts.append((x, y))
    d.line(pts, fill=int(128 + rng.choice([-1, 1]) * rng.uniform(14, 40)), width=1)
f = (np.asarray(fib.filter(ImageFilter.GaussianBlur(0.7)), np.float32) - 128) / 128

v = mott * 0.55 + f * 0.9 + grain * 0.22  # desviación: + aclara, − oscurece
light = np.clip(v, 0, None)
dark = np.clip(-v, 0, None)
a = np.clip(np.maximum(light, dark) * 0.55, 0, 1)
rgb = np.zeros((H, W, 3), np.float32)
cream = np.array([255, 244, 220], np.float32)
sepia = np.array([40, 28, 16], np.float32)
is_light = (light >= dark)[..., None]
rgb = np.where(is_light, cream, sepia)
out = np.dstack([rgb, a[..., None] * 255]).astype(np.uint8)
Image.fromarray(out, 'RGBA').save('video/public/hdl/img/fiber.png', optimize=True)
print('ok', out.shape)
