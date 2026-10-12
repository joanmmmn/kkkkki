#!/usr/bin/env python3
"""Imágenes de la reseña web de Nextory (web/nextory-resena/media/) a partir de las grabaciones de la app
(video/public/nxr/rec/<toma>/video.mp4, 664×1440) y de la miniatura del vídeo.

Uso: python3 tools/web_nx_media.py
Cada captura es un fotograma de la grabación del 11/10/2026 (app de Android 2026.10.1), sin datos personales:
en la ficha se difumina la reseña de otra lectora (nombre y texto).
La tarjeta de la reseña de ElevenReader (media/elevenreader-resena-800.webp y -480) es un dibujo propio con el
estilo de las imágenes del blog; no sale de aquí."""
import os, subprocess, tempfile
from PIL import Image, ImageFilter

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
REC = os.path.join(ROOT, 'video/public/nxr/rec')
OUT = os.path.join(ROOT, 'web/nextory-resena/media')

# nombre de archivo → (toma, segundo, zonas que se difuminan [(x0, y0, x1, y1)])
SHOTS = {
    'nextory-app-leer': ('05_leer', 84.0, []),
    'nextory-app-escuchar': ('06_escuchar', 12.0, []),
    'nextory-portada': ('01_inicio', 14.5, []),
    'nextory-recomendaciones': ('01_inicio', 20.0, []),
    'nextory-catalogo-ficcion-crimen': ('01b_inicio_bajo', 6.0, []),
    'nextory-el-librarian': ('02_librarian_b', 30.0, []),
    'nextory-buscar-narrador': ('14_narrador', 3.0, []),
    'nextory-filtros': ('17_categorias', 62.6, []),
    'nextory-ficha': ('13_diluvio', 5.0, []),
    'nextory-ficha-valoraciones': ('13_diluvio', 13.2, [(0, 1088, 664, 1254)]),
    'nextory-lector-oscuro': ('05_leer', 48.9, []),
    'nextory-lector-gris': ('05_leer', 52.5, []),
    'nextory-marcador-nota': ('05_leer', 97.8, []),
    'nextory-reproductor': ('06_escuchar', 63.5, []),
    'nextory-velocidad': ('06_escuchar', 28.5, []),
    'nextory-temporizador': ('06_escuchar', 75.5, []),
    'nextory-temporizador-cuenta-atras': ('06_escuchar', 80.0, []),
    'nextory-capitulos': ('06_escuchar', 112.5, []),
    'nextory-descargas-wifi': ('09_descargas', 13.5, []),
    'nextory-perfiles': ('08_perfil', 12.0, []),
    'nextory-tipos-perfil': ('19_tipos_perfil', 10.0, []),
    'nextory-infantil': ('12_infantil_home', 6.0, []),
    'nextory-pin': ('18_pin', 18.8, []),
    'nextory-horas': ('11_actividad', 25.0, []),
}


def frame(rec, t):
    with tempfile.TemporaryDirectory() as d:
        p = os.path.join(d, 'f.png')
        subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-ss', str(t), '-i', os.path.join(REC, rec, 'video.mp4'), '-frames:v', '1', p], check=True)
        return Image.open(p).convert('RGB')


def main():
    os.makedirs(OUT, exist_ok=True)
    for name, (rec, t, blur) in SHOTS.items():
        im = frame(rec, t)
        for box in blur:
            im.paste(im.crop(box).filter(ImageFilter.GaussianBlur(14)), box[:2])
        im.save(os.path.join(OUT, name + '.webp'), 'WEBP', quality=80, method=6)
        print(name, im.size, os.path.getsize(os.path.join(OUT, name + '.webp')) // 1024, 'KB')
    # Miniatura del vídeo (16:9) e imagen para redes (1200×630)
    th = Image.open(os.path.join(ROOT, 'deliverables/nextory/resena/miniatura_resena.png')).convert('RGB')
    th.resize((1280, 720), Image.LANCZOS).save(os.path.join(OUT, 'nextory-resena-video.webp'), 'WEBP', quality=82, method=6)
    og = th.resize((1200, 675), Image.LANCZOS).crop((0, 22, 1200, 652))
    og.save(os.path.join(OUT, 'nextory-resena-og.jpg'), 'JPEG', quality=86, optimize=True, progressive=True)
    print('listo →', os.path.relpath(OUT, ROOT))


if __name__ == '__main__':
    main()
