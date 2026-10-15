#!/usr/bin/env python3
"""Imágenes de la página «Las mejores plataformas de audiolibros en español» (web/mejores-plataformas/media/).

Uso: python3 tools/web_mp_media.py
Todo sale de material ya revisado de las reseñas, sin datos personales:
- capturas de las apps: las de web/*-resena/media (ya publicadas en sus reseñas) y un fotograma de la toma de BookBeat
  (video/public/bkb/rec/27_cambiar_plan, la página de planes de bookbeat.com en el móvil, sin nombre ni correo);
- páginas web: recortes de las capturas públicas del vídeo (Spotify, eBiblio Madrid, LibriVox y el buscador de SonorBooks,
  sin el aviso de cookies) y las del blog de ElevenReader y El Libro Total;
- logotipos: los de video/public/*/img (los mismos de sus reseñas y del vídeo). Los SVG se copian sin el ancho y el alto de la
  raíz (la página fija el tamaño); los PNG pasan a WebP.
La imagen para redes y el póster del vídeo salen de tools/web_mp_og.mjs."""
import os, re, shutil
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUT = os.path.join(ROOT, 'web/mejores-plataformas/media')
P = lambda *a: os.path.join(ROOT, *a)

# Capturas de móvil (664 px de ancho, como en las reseñas)
PHONE = {
    'audible-dracula': P('web/audible-resena/media/audible-dracula.webp'),
    'audible-los-tres-mundos': P('web/audible-resena/media/audible-los-tres-mundos.webp'),
    'storytel-lector': P('web/storytel-resena/media/storytel-lector.webp'),
    'podimo-membresia': P('web/podimo-resena/media/podimo-membresia.webp'),
    'nextory-horas': P('web/nextory-resena/media/nextory-horas.webp'),
    'bookbeat-planes': P('video/public/bkb/rec/27_cambiar_plan/first.jpg'),
    'abc-ajustes-ingles': P('web/audiobooks-com-resena/media/abc-ajustes-ingles.webp'),
    'abc-los-tres-mundos': P('web/audiobooks-com-resena/media/abc-los-tres-mundos-detalles.webp'),
}
# Páginas web apaisadas (1600×900): archivo → (fuente, recorte x0, y0, x1, y1 en píxeles de la fuente, o None)
WEB = {
    'spotify-audiolibros': (P('video/public/mp/web/spotify_full.jpg'), (560, 0, 3280, 1530)),
    'ebiblio-madrid-disponibles': (P('video/public/eb/web/mavail.png'), (0, 0, 3840, 2160)),
    'librivox-leyendas': (P('video/public/lv/web/book.png'), (380, 150, 3440, 1871)),
    'sonorbooks-los-tres-mundos': (P('video/public/mp/web/sb_buscar.jpg'), (680, 590, 3160, 1760)),
    'elevenreader-pdf-original-vs-lector': (P('blog/elevenreader/img/elevenreader-pdf-original-vs-lector.webp'), None),
    'el-libro-total-audiolectura': (P('blog/el-libro-total/img/el-libro-total-audiolectura-resaltado.webp'), None),
}
SVG = {
    'logo-audible': P('video/public/aud/img/audible.svg'),
    'logo-storytel': P('video/public/str/img/storytel.svg'),
    'logo-podimo': P('video/public/pdr/img/podimo.svg'),
    'logo-nextory': P('video/public/nx/img/nextory.svg'),
    'logo-bookbeat': P('video/public/bkb/img/bookbeat.svg'),
    'logo-spotify': P('video/public/mp/img/spotify_black.svg'),
}
PNG = {
    'logo-audiobooks': P('video/public/abc/img/audiobooks_logo@4x.png'),
    'logo-elevenreader': P('video/public/er/img/elevenreader.png'),
    'logo-ebiblio': P('video/public/eb/img/ebiblio_logo.png'),
    'logo-librivox': P('video/public/lv/img/librivox_logo.png'),
    'logo-el-libro-total': P('video/public/elt/img/elt_logo_navy.png'),
}


def save(im, name, q=82):
    p = os.path.join(OUT, name + '.webp')
    im.save(p, 'WEBP', quality=q, method=6)
    print(f'{name}.webp', im.size, os.path.getsize(p) // 1024, 'KB')


def main():
    os.makedirs(OUT, exist_ok=True)
    for name, src in PHONE.items():
        if src.endswith('.webp'):
            shutil.copy(src, os.path.join(OUT, name + '.webp'))
            print(f'{name}.webp (copia)')
            continue
        im = Image.open(src).convert('RGB')
        if im.width != 664:
            im = im.resize((664, round(im.height * 664 / im.width)), Image.LANCZOS)
        save(im, name)
    for name, (src, box) in WEB.items():
        im = Image.open(src).convert('RGB')
        if box:
            im = im.crop(box)
        im = im.resize((1600, round(im.height * 1600 / im.width)), Image.LANCZOS)
        save(im, name, 80)
    for name, src in SVG.items():
        s = open(src, encoding='utf-8').read()
        s = re.sub(r'<\?xml[^>]*\?>|<!--.*?-->', '', s, flags=re.S).strip()
        # sin ancho ni alto en la raíz: el tamaño lo pone la página (el viewBox guarda la proporción)
        s = re.sub(r'(<svg\b[^>]*?)\s(?:width|height)=("[^"]*"|\'[^\']*\')', r'\1', s, count=1)
        s = re.sub(r'(<svg\b[^>]*?)\s(?:width|height)=("[^"]*"|\'[^\']*\')', r'\1', s, count=1)
        open(os.path.join(OUT, name + '.svg'), 'w', encoding='utf-8').write(s)
        print(f'{name}.svg')
    for name, src in PNG.items():
        im = Image.open(src)
        im = im.convert('RGBA' if im.mode in ('RGBA', 'LA', 'P') else 'RGB')
        if im.height > 160:
            im = im.resize((round(im.width * 160 / im.height), 160), Image.LANCZOS)
        save(im, name, 90)
    print('listo →', os.path.relpath(OUT, ROOT))


if __name__ == '__main__':
    main()
