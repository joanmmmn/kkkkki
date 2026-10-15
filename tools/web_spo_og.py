#!/usr/bin/env python3
"""Imagen para redes (1200×630) y póster del vídeo (1280×720) de la reseña web de los audiolibros de Spotify, a partir de la miniatura
real del vídeo (deliverables/spotify/resena/miniatura_resena.png, composición SPOThumb de Remotion).

Uso: python3 tools/web_spo_og.py
El póster es la miniatura tal cual (en WebP) y la imagen para redes, la misma reducida a 1200×675 y recortada a 630 de
alto por el centro (como en las reseñas de Nextory, Podimo, Storytel, Audible y BookBeat). Si cambias la miniatura en YouTube, vuelve
a ejecutarlo y a construir la página (python3 web/spotify-audiolibros-resena/build.py)."""
import os
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
THUMB = os.path.join(ROOT, 'deliverables/spotify/resena/miniatura_resena.png')
MEDIA = os.path.join(ROOT, 'web/spotify-audiolibros-resena/media')

im = Image.open(THUMB).convert('RGB')
assert im.size == (1280, 720), im.size
poster = os.path.join(MEDIA, 'spotify-audiolibros-resena-video.webp')
im.save(poster, 'WEBP', quality=86, method=6)
og = im.resize((1200, 675), Image.LANCZOS).crop((0, 22, 1200, 652))
p = os.path.join(MEDIA, 'spotify-audiolibros-resena-og.jpg')
og.save(p, 'JPEG', quality=88, optimize=True, progressive=True)
for f in (poster, p):
    print(os.path.relpath(f, ROOT), Image.open(f).size, os.path.getsize(f) // 1024, 'KB')
