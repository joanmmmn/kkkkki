#!/usr/bin/env python3
"""Imagen para redes (1200×630) y póster del vídeo (1280×720) de la reseña web de iVoox, a partir de la miniatura real del
vídeo (deliverables/ivoox/resena/miniatura_resena.png, composición IVXThumb de Remotion); y las tarjetas del carrusel de las
reseñas nuevas de Audible, Storytel y Audiobooks.com (800×450 y 480×270), a partir de sus imágenes para redes.

Uso: python3 tools/web_ivx_og.py
El póster es la miniatura tal cual (en WebP) y la imagen para redes, la misma reducida a 1200×675 y recortada a 630 de
alto por el centro (como en las demás reseñas). Si cambias la miniatura en YouTube, vuelve a ejecutarlo."""
import os
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
THUMB = os.path.join(ROOT, 'deliverables/ivoox/resena/miniatura_resena.png')
MEDIA = os.path.join(ROOT, 'web/ivoox-resena/media')
CARDS = {'audible-resena': os.path.join(ROOT, 'web/audible-resena/media/audible-resena-og.jpg'),
         'storytel-resena': os.path.join(ROOT, 'web/storytel-resena/media/storytel-resena-og.jpg'),
         'audiobooks-com-resena': os.path.join(ROOT, 'web/audiobooks-com-resena/media/audiobooks-com-resena-og.jpg')}

im = Image.open(THUMB).convert('RGB')
assert im.size == (1280, 720), im.size
poster = os.path.join(MEDIA, 'ivoox-resena-video.webp')
im.save(poster, 'WEBP', quality=86, method=6)
og = im.resize((1200, 675), Image.LANCZOS).crop((0, 22, 1200, 652))
p = os.path.join(MEDIA, 'ivoox-resena-og.jpg')
og.save(p, 'JPEG', quality=88, optimize=True, progressive=True)
out = [poster, p]
# Tarjetas 16:9 del carrusel (la imagen para redes de cada reseña, 1200×630, recortada a 16:9 por el centro)
for slug, src in CARDS.items():
    st = Image.open(src).convert('RGB')
    w, h = st.size
    cw = round(h * 16 / 9)
    st = st.crop(((w - cw) // 2, 0, (w - cw) // 2 + cw, h))
    for size in (800, 480):
        q = os.path.join(MEDIA, f'{slug}-{size}.webp')
        st.resize((size, size * 9 // 16), Image.LANCZOS).save(q, 'WEBP', quality=84, method=6)
        out.append(q)
for f in out:
    print(os.path.relpath(f, ROOT), Image.open(f).size, os.path.getsize(f) // 1024, 'KB')
