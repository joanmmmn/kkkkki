#!/usr/bin/env python3
"""Capturas de la reseña web de Podimo (web/podimo-resena/media/) a partir de las tomas de la app
(video/public/pdr/rec/<toma>/video.mp4, 664×1440 a 50 fps; las corta tools/pdr_clips.py).

Uso: python3 tools/web_pd_media.py
Cada captura es un fotograma de la prueba del 12/10/2026 (app de Android 3.2.0) y solo sale de las tomas, nunca de la
grabación original: así quedan fuera los tramos con datos personales. Los comentarios de otros oyentes ya vienen
difuminados en la toma del reproductor; aquí se difumina además la inicial de la cuenta (el círculo rosa de arriba a
la derecha en Buscar, Biblioteca y la portada).
La imagen para redes y el póster provisional del vídeo los genera tools/web_pd_og.mjs."""
import os, subprocess, tempfile
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
REC = os.path.join(ROOT, 'video/public/pdr/rec')
OUT = os.path.join(ROOT, 'web/podimo-resena/media')
AVATAR = (578, 52, 648, 122)  # caja del círculo con la inicial de la cuenta (x0, y0, x1, y1)

# nombre de archivo → (toma, segundo, ¿difuminar la inicial de la cuenta?)
SHOTS = {
    'podimo-podcasts-populares': ('04_inicio', 13.6, False),
    'podimo-reproductor-reloj': ('08_reproductor', 20.0, False),
    'podimo-gustos': ('00_gustos', 39.0, False),
    'podimo-recopilando': ('03_recopilando', 4.0, False),
    'podimo-portada': ('15_inicio_top', 4.0, True),
    'podimo-podcast-original': ('11_podcast', 20.0, False),
    'podimo-novedades': ('04_inicio', 22.0, False),
    'podimo-buscar-audiolibros': ('05_buscar', 16.0, True),
    'podimo-buscar-autor': ('05_buscar', 30.0, False),
    'podimo-ficha': ('06_ficha', 3.0, False),
    'podimo-audiolibros': ('16_audiolibros', 14.0, False),
    'podimo-velocidad': ('09_velocidad', 4.0, False),
    'podimo-temporizador': ('08_reproductor', 6.0, False),
    'podimo-capitulos': ('10_capitulos', 4.0, False),
    'podimo-biblioteca': ('12_biblioteca', 3.0, True),
    'podimo-reproductor-2x': ('09_velocidad', 52.0, False),
    'podimo-membresia': ('13_membresia', 5.0, False),
    'podimo-regala-60-dias': ('14_regala', 4.0, False),
}


def frame(rec, t):
    with tempfile.TemporaryDirectory() as d:
        p = os.path.join(d, 'f.png')
        subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-ss', str(t), '-i', os.path.join(REC, rec, 'video.mp4'),
                        '-frames:v', '1', p], check=True)
        return Image.open(p).convert('RGB')


def hide_avatar(im):
    """Difumina la inicial de la cuenta dentro de un círculo (queda una mancha rosa, sin letra)."""
    reg = im.crop(AVATAR)
    mask = Image.new('L', reg.size, 0)
    ImageDraw.Draw(mask).ellipse((4, 4, reg.size[0] - 4, reg.size[1] - 4), fill=255)
    im.paste(reg.filter(ImageFilter.GaussianBlur(9)), AVATAR[:2], mask.filter(ImageFilter.GaussianBlur(2)))


def main():
    os.makedirs(OUT, exist_ok=True)
    for name, (rec, t, avatar) in SHOTS.items():
        im = frame(rec, t)
        if avatar:
            hide_avatar(im)
        if im.width > 664:
            im = im.resize((664, round(im.height * 664 / im.width)), Image.LANCZOS)
        p = os.path.join(OUT, name + '.webp')
        im.save(p, 'WEBP', quality=82, method=6)
        print(name, im.size, os.path.getsize(p) // 1024, 'KB')
    print('listo →', os.path.relpath(OUT, ROOT))


if __name__ == '__main__':
    main()
