#!/usr/bin/env python3
"""Fondo («plató») del vídeo nuevo de LibriVox: el pasillo de la biblioteca renderizado por LVSetPlate, desenfocado
y etalonado (cálido, en penumbra), para que detrás de los planos nunca haya negro.
Uso: npx remotion still src/index.ts LVSetPlate <plate.png> --frame=0  →  python3 tools/lv3_set.py <plate.png>"""
import sys
from PIL import Image, ImageEnhance, ImageFilter
src = sys.argv[1]
OUT = 'video/public/lv/img3/set_bg.jpg'
im = Image.open(src).convert('RGB')
im = im.filter(ImageFilter.GaussianBlur(14))
im = ImageEnhance.Color(im).enhance(0.82)
im = ImageEnhance.Brightness(im).enhance(1.3)
im = im.point(lambda v: int(255 * (v / 255) ** 0.78))  # sombras levantadas: penumbra, no negro
# etalonado cálido: un poco más de rojo y menos azul
r, g, b = im.split()
r = r.point(lambda v: min(255, int(v * 1.06 + 4)))
b = b.point(lambda v: int(v * 0.86))
im = Image.merge('RGB', (r, g, b))
im.save(OUT, quality=86, optimize=True, progressive=True)
print(OUT, im.size)
