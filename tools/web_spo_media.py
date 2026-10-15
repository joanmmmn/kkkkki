#!/usr/bin/env python3
"""Capturas de la reseña web de los audiolibros de Spotify (web/spotify-audiolibros-resena/media/) a partir de las tomas
de la app (video/public/spo/rec/<toma>/video.mp4, 664×1440 a 50 fps; las corta tools/spo_clips.py y las tapa
tools/spo_cover.py), y las tarjetas del carrusel que no están en el sitio.

Uso: python3 tools/web_spo_media.py
Cada captura es un fotograma de la prueba del 15/10/2026 (app oficial de Spotify para Android 9.1.90.2270, en BlueStacks,
con la cuenta Premium de Joan, que inició sesión él) y solo sale de las tomas, nunca de las grabaciones originales: así
quedan fuera el nombre y la foto de la cuenta, las búsquedas recientes, la biblioteca, las listas y recomendaciones
personales y el plan de la cuenta. No se usan las tomas con datos tapados (00_buscar y 12_checkout): en la página no hacen
falta. Los tiempos son exactos (ffmpeg -ss) y se eligieron sobre hojas de contacto de cada toma (un fotograma por segundo).

Tarjetas del carrusel: las de Storytel y ElevenReader se copian de web/bookbeat-resena/media (las mismas de sus reseñas)
y la de BookBeat sale de su póster (web/bookbeat-resena/media/bookbeat-resena-video.webp, la miniatura real de su vídeo),
a 800×450 y 480×270. La imagen para redes y el póster del vídeo de esta página salen de tools/web_spo_og.py."""
import os, shutil, subprocess, tempfile
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
REC = os.path.join(ROOT, 'video/public/spo/rec')
OUT = os.path.join(ROOT, 'web/spotify-audiolibros-resena/media')
BKB = os.path.join(ROOT, 'web/bookbeat-resena/media')

# nombre de archivo → (toma, segundo)
SHOTS = {
    # Portada y horas
    'spotify-tiempo-escucha': ('10_horas', 2.0),          # «Has escuchado 0 h / 12 h restante(s)», 7 días hasta que se renueven
    'spotify-recargas': ('10_horas', 20.0),               # Audiolibros+ y Recargas (válidas 12 meses), con el botón Recargar
    'spotify-recarga-10h': ('11_recarga', 5.0),           # «Recarga de 10 horas», Comprar por 9,99 € (sin comprar)
    'spotify-sin-limites': ('22_hp_sin_limites', 5.0),    # Harry Potter (en inglés): «Escucha sin límites hasta el 31 oct»
    # La sección Audiolibros
    'spotify-audiolibros': ('01_hub', 1.0),               # Novedades y tendencias, Explora sin límites
    'spotify-generos': ('01_hub', 6.0),                   # Explora sin límites: los géneros
    'spotify-listas-autores': ('01_hub', 44.0),           # Ideales para iniciarse, Listas de nuestros editores, Autores populares
    # Buscar, fichas y muestra
    'spotify-sin-filtro': ('18_tres_mundos', 3.0),        # «tres mundos posteguillo» sin filtro: episodios de pódcasts
    'spotify-con-filtro': ('18_tres_mundos', 17.0),       # con el filtro Audiolibros: Los tres mundos, incluido
    'spotify-reina-roja': ('03_reina_ficha', 2.0),        # ficha: Incluido con Premium, ★ 4,8 (5), 11 h 46 min, Prueba el libro
    'spotify-muestra': ('04_muestra', 5.0),               # la muestra de Reina Roja
    # Reproductor
    'spotify-reproductor': ('05_reproductor', 24.0),      # «Una interrupción», 1,2x, saltos de 15 s, temporizador
    'spotify-velocidad': ('06_velocidad', 10.0),          # Velocidad 3,5x
    'spotify-temporizador': ('07_temporizador', 1.0),     # Temporizador: de 5 minutos a fin del capítulo
    'spotify-capitulos': ('08_capitulos', 2.0),           # Capítulos
    # Encuentra la página
    'spotify-los-tres-mundos': ('19_tres_mundos_ficha', 3.0),
    'spotify-encuentra-la-pagina': ('20_encuentra_pagina', 5.0),  # Escanear para escuchar · Buscar página
    # Catálogo en español
    'spotify-reina-roja-loba-negra': ('02_reina_filtro', 2.0),     # Reina roja, incluido; Loba negra, con candado
    'spotify-la-sombra-del-viento': ('16_sombra', 2.0),
    'spotify-la-bestia': ('17_bestia', 2.0),
    'spotify-la-asistenta': ('14_asistenta', 2.0),                 # castellano, incluido; latino, no
    'spotify-la-asistenta-latino': ('15_asistenta_latino', 3.0),   # 16,99 € (18,49 € tachado)
    'spotify-comprar-en-la-web': ('15_asistenta_latino', 14.0),    # «Ve a Spotify.com para comprar este título…» (sin enviar el correo)
}


def frame(rec, t):
    with tempfile.TemporaryDirectory() as d:
        p = os.path.join(d, 'f.png')
        subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-ss', str(t), '-i', os.path.join(REC, rec, 'video.mp4'),
                        '-frames:v', '1', p], check=True)
        return Image.open(p).convert('RGB')


def cards():
    for n in ('storytel-resena', 'elevenreader-resena'):
        for w in (480, 800):
            shutil.copy(os.path.join(BKB, f'{n}-{w}.webp'), os.path.join(OUT, f'{n}-{w}.webp'))
    im = Image.open(os.path.join(BKB, 'bookbeat-resena-video.webp')).convert('RGB')
    assert im.size == (1280, 720), im.size
    for w in (480, 800):
        p = os.path.join(OUT, f'bookbeat-resena-{w}.webp')
        im.resize((w, w * 9 // 16), Image.LANCZOS).save(p, 'WEBP', quality=82, method=6)
        print(os.path.basename(p), os.path.getsize(p) // 1024, 'KB')


def main():
    os.makedirs(OUT, exist_ok=True)
    for name, (rec, t) in SHOTS.items():
        im = frame(rec, t)
        assert im.size == (664, 1440), (name, im.size)
        p = os.path.join(OUT, name + '.webp')
        im.save(p, 'WEBP', quality=82, method=6)
        print(name, im.size, os.path.getsize(p) // 1024, 'KB')
    cards()
    print('listo →', os.path.relpath(OUT, ROOT))


if __name__ == '__main__':
    main()
