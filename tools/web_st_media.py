#!/usr/bin/env python3
"""Capturas de la reseña web de Storytel (web/storytel-resena/media/) a partir de las tomas de la app
(video/public/str/rec/<toma>/video.mp4, 664×1440 a 50 fps; las corta tools/str_clips.py).

Uso: python3 tools/web_st_media.py
Cada captura es un fotograma de la prueba del 13/10/2026 (app de Android 26.40) y solo sale de las tomas, nunca de la
grabación original: así quedan fuera los tramos con datos personales (la hoja de compartir y las reseñas con nombres).
En las tomas no se ve ninguna inicial ni foto de la cuenta: arriba a la derecha solo está el icono genérico de perfil.
La imagen para redes y el póster del vídeo salen de su miniatura real (tools/web_st_og.py)."""
import os, subprocess, tempfile
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
REC = os.path.join(ROOT, 'video/public/str/rec')
OUT = os.path.join(ROOT, 'web/storytel-resena/media')

# nombre de archivo → (toma, segundo)
SHOTS = {
    'storytel-portada': ('00_inicio_top', 9.5),
    'storytel-top-50': ('01_inicio_scroll', 5.6),
    'storytel-solo-en-storytel': ('01_inicio_scroll', 29.0),
    'storytel-series': ('03_series', 5.0),
    'storytel-ebooks': ('04_ebooks', 6.0),
    'storytel-infantil': ('05_infantil', 6.0),
    'storytel-kids-mode': ('06_perfil_kids', 8.0),
    'storytel-codigo-pin': ('06_perfil_kids', 18.0),
    'storytel-explorar': ('20_explorar', 6.0),
    'storytel-producidos': ('20_explorar', 20.0),
    'storytel-la-suelta': ('11_suelta', 23.0),
    'storytel-modo-noche': ('21_modo_noche', 16.0),
    'storytel-buscar': ('12_bernarda_buscar', 3.0),
    'storytel-buscar-camara': ('10_buscar', 6.0),
    'storytel-ficha': ('13_bernarda_ficha', 5.0),
    'storytel-reproductor': ('14_reproductor', 16.0),
    'storytel-velocidad': ('14_reproductor', 31.0),
    'storytel-velocidad-personalizada': ('14_reproductor', 52.0),
    'storytel-reproductor-2x': ('15_reproductor2', 12.0),
    'storytel-temporizador': ('15_reproductor2', 25.0),
    'storytel-marcadores': ('15_reproductor2', 56.0),
    'storytel-capitulos': ('15_reproductor2', 70.0),
    'storytel-lector': ('16_lectura', 10.0),
    'storytel-lector-ajustes': ('16_lectura', 55.0),
    'storytel-buscar-en-libro': ('18_buscar_audio', 20.0),
    'storytel-salto-al-minuto': ('18_buscar_audio', 35.0),
    'storytel-biblioteca': ('19_biblioteca', 12.0),
    'storytel-tu-plan-actual': ('08_suscripcion', 25.0),
    'storytel-suscripcion': ('08_suscripcion', 15.0),
    'storytel-configuracion': ('09_config_app', 6.0),
}


def frame(rec, t):
    with tempfile.TemporaryDirectory() as d:
        p = os.path.join(d, 'f.png')
        subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-ss', str(t), '-i', os.path.join(REC, rec, 'video.mp4'),
                        '-frames:v', '1', p], check=True)
        return Image.open(p).convert('RGB')


def main():
    os.makedirs(OUT, exist_ok=True)
    for name, (rec, t) in SHOTS.items():
        im = frame(rec, t)
        if im.width > 664:
            im = im.resize((664, round(im.height * 664 / im.width)), Image.LANCZOS)
        p = os.path.join(OUT, name + '.webp')
        im.save(p, 'WEBP', quality=82, method=6)
        print(name, im.size, os.path.getsize(p) // 1024, 'KB')
    print('listo →', os.path.relpath(OUT, ROOT))


if __name__ == '__main__':
    main()
