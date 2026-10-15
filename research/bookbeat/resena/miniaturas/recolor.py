#!/usr/bin/env python3
"""a_base.png de la miniatura A: la base de la serie (research/audible/resena/miniaturas-v2/a_base.png, el icono blanco con
cascos sobre el círculo naranja de Audible) con el círculo, y sus reflejos en el icono, pasados al lila de BookBeat (#CD96FF).
Se gira el tono de los píxeles anaranjados (tono 12–55°, saturación > 0,12) a 272° y se escala su saturación (0,89 → 0,41):
el naranja puro queda en #CC95FC y los bordes mezclados con el fondo o con los cascos conservan la mezcla.
Uso: python3 recolor.py"""
import os
import numpy as np
from matplotlib.colors import hsv_to_rgb, rgb_to_hsv
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '../../../audible/resena/miniaturas-v2/a_base.png')
a = np.asarray(Image.open(SRC).convert('RGB')).astype(np.float64) / 255
hsv = rgb_to_hsv(a)
h, s = hsv[..., 0] * 360, hsv[..., 1]
m = (h > 12) & (h < 55) & (s > 0.12)
hsv[..., 0] = np.where(m, 272 / 360, hsv[..., 0])
hsv[..., 1] = np.where(m, np.clip(s * 0.41 / 0.89, 0, 1), s)
out = (hsv_to_rgb(hsv) * 255).round().astype(np.uint8)
Image.fromarray(out).save(os.path.join(HERE, 'a_base.png'), optimize=True)
print('a_base.png', int(m.sum()), 'px recoloreados')
