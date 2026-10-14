#!/usr/bin/env python3
"""Capturas de la reseña web de BookBeat (web/bookbeat-resena/media/) a partir de las tomas de la app
(video/public/bkb/rec/<toma>/video.mp4, 664×1440 a 50 fps; las corta tools/bkb_clips.py y las tapa tools/bkb_cover.py).

Uso: python3 tools/web_bkb_media.py
Cada captura es un fotograma de la prueba del 14/10/2026 (app oficial de BookBeat para Android 10.19.1, en BlueStacks, con la
cuenta de prueba que abrió Joan) y solo sale de las tomas, nunca de la grabación original: así quedan fuera la cabecera del perfil
(nombre y correo de la cuenta) y los datos personales de la cuenta; en las tomas de la web de la cuenta y en la ficha de La Sombra
del Viento, el nombre del perfil, la tarjeta y el nombre de quien escribe la reseña ya van tapados. Los tiempos son exactos
(ffmpeg -ss). La imagen para redes y el póster del vídeo salen de tools/web_bkb_og.py."""
import os, subprocess, tempfile
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
REC = os.path.join(ROOT, 'video/public/bkb/rec')
OUT = os.path.join(ROOT, 'web/bookbeat-resena/media')

# nombre de archivo → (toma, segundo)
SHOTS = {
    'bookbeat-portada': ('00_inicio_top', 2.0),
    'bookbeat-portada-guardados': ('01_inicio_scroll', 4.0),
    'bookbeat-estadisticas': ('02_estadisticas', 8.0),
    'bookbeat-racha': ('03_racha', 8.0),
    'bookbeat-inspiration': ('04_inspiration', 3.0),
    'bookbeat-top100': ('04_inspiration', 21.0),
    'bookbeat-categorias': ('05_categorias', 2.0),
    'bookbeat-idiomas': ('05_categorias', 38.0),
    'bookbeat-buscar': ('08_buscar_sombra', 31.0),
    'bookbeat-resultados-carmen-mola': ('07_mola', 4.0),
    'bookbeat-filtros': ('07_mola', 16.0),
    'bookbeat-la-sombra-del-viento': ('09_sombra_ficha', 2.0),
    'bookbeat-ficha-notas': ('09_sombra_ficha', 16.0),
    'bookbeat-reproductor': ('11_velocidad', 33.0),
    'bookbeat-velocidad': ('11_velocidad', 22.0),
    'bookbeat-temporizador': ('12_temporizador', 2.5),
    'bookbeat-temporizador-cuenta': ('12_temporizador', 8.0),
    'bookbeat-temporizador-automatico': ('21_audio_player', 16.0),
    'bookbeat-capitulos': ('14_capitulos', 6.0),
    'bookbeat-marcador': ('13_marcadores', 26.0),
    'bookbeat-descarga': ('15_descarga', 26.0),
    'bookbeat-descargados': ('17_descargados', 11.4),
    'bookbeat-horas': ('16_horas', 2.0),
    'bookbeat-consumo': ('16_horas', 10.0),
    'bookbeat-perfiles': ('18_perfiles_web', 3.4),
    'bookbeat-tema-oscuro': ('19_tema_oscuro', 20.0),
    'bookbeat-idioma-libros': ('20_book_filter', 2.0),
    'bookbeat-dispositivos': ('22_dispositivos', 8.0),
    'bookbeat-filtro-ebooks': ('23_sapiens', 41.6),
    'bookbeat-lector': ('24_ebook', 72.0),
    'bookbeat-lector-ajustes': ('24_ebook', 121.0),
    'bookbeat-cuenta-prueba': ('26_cuenta', 5.9),
    'bookbeat-planes': ('27_cambiar_plan', 2.0),
    'bookbeat-planes-premium-basic': ('27_cambiar_plan', 40.0),
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
