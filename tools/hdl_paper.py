#!/usr/bin/env python3
"""Textura de papel de «La historia detrás del libro» (public/hdl/img/paper.jpg): crema cálido con manchas suaves,
fibras y viñeta. Determinista (semilla fija). Uso: python3 tools/hdl_paper.py"""
import numpy as np
from PIL import Image, ImageFilter
rng = np.random.default_rng(1967)
W, H = 1920, 1080
base = np.array([242, 234, 219], np.float32)
def blur_noise(scale, sigma):
    n = rng.normal(0, 1, (H // scale + 2, W // scale + 2)).astype(np.float32)
    im = Image.fromarray(((n - n.min()) / (n.max() - n.min()) * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(sigma))
    a = np.asarray(im, np.float32) / 255 - 0.5
    return a / (np.abs(a).max() + 1e-6)
mott = 0.6 * blur_noise(60, 30) + 0.4 * blur_noise(18, 8)
grain = rng.normal(0, 1, (H, W)).astype(np.float32)
img = np.zeros((H, W, 3), np.float32)
for c in range(3):
    img[..., c] = base[c] + mott * (9 if c < 2 else 11) + grain * 3.2
# fibras: trazos finos y claros/oscuros
fib = Image.new('L', (W, H), 128)
from PIL import ImageDraw
d = ImageDraw.Draw(fib)
for _ in range(900):
    x, y = rng.uniform(0, W), rng.uniform(0, H)
    ang = rng.uniform(0, np.pi); L = rng.uniform(8, 38)
    x2, y2 = x + np.cos(ang) * L, y + np.sin(ang) * L
    d.line([(x, y), (x2, y2)], fill=int(128 + rng.choice([-1, 1]) * rng.uniform(10, 26)), width=1)
f = (np.asarray(fib.filter(ImageFilter.GaussianBlur(0.6)), np.float32) - 128) / 128
img += f[..., None] * 9
# viñeta cálida
yy, xx = np.mgrid[0:H, 0:W]
r = np.sqrt(((xx - W / 2) / (W * 0.62)) ** 2 + ((yy - H / 2) / (H * 0.62)) ** 2)
vig = np.clip((r - 0.55) / 0.6, 0, 1) ** 1.6
img[..., 0] -= vig * 26; img[..., 1] -= vig * 32; img[..., 2] -= vig * 42
Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save('video/public/hdl/img/paper.jpg', quality=92)
print('ok')
