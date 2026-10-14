#!/usr/bin/env python3
"""Capturas de la reseña web de Audible (web/audible-resena/media/) a partir de las tomas de la app
(video/public/aud/rec/<toma>/video.mp4, 664×1440 a 50 fps; las corta tools/aud_clips.py).

Uso: python3 tools/web_au_media.py
Cada captura es un fotograma de la prueba del 14/10/2026 (app oficial de Audible para Android, en BlueStacks) y solo sale
de las tomas, nunca de la grabación original: así quedan fuera los tramos con datos personales (la barra de notificaciones
con el correo de Google, el nombre de la cuenta y el aviso de caducidad de la ficha de Umbra Dei). En la toma del perfil
(20_perfil_infantil) el nombre y la inicial ya van tapados (tools/aud_cover.py). Los tiempos son exactos (ffmpeg -ss).
La imagen para redes, el póster del vídeo y la tarjeta de la reseña de Storytel del carrusel salen de tools/web_au_og.py."""
import os, subprocess, tempfile
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
REC = os.path.join(ROOT, 'video/public/aud/rec')
OUT = os.path.join(ROOT, 'web/audible-resena/media')

# nombre de archivo → (toma, segundo)
SHOTS = {
    'audible-portada': ('00_inicio_top', 2.0),
    'audible-novedades': ('01_inicio_scroll', 12.4),
    'audible-descubrir': ('03_descubrir', 1.2),
    'audible-duracion': ('22_duracion', 32.4),
    'audible-la-sombra-del-viento': ('09_sombra', 17.0),
    'audible-los-huerfanos': ('02_huerfanos_ficha', 3.0),
    'audible-posteguillo': ('10_posteguillo', 8.0),
    'audible-los-tres-mundos': ('11_tres_mundos', 5.0),
    'audible-filtro-incluido': ('08_incluido', 8.0),
    'audible-buscar': ('06_buscar', 12.4),
    'audible-dracula': ('05_dracula', 4.0),
    'audible-umbra-dei': ('07_umbra_dei', 4.5),
    'audible-reproductor': ('12_reproductor', 8.0),
    'audible-velocidad': ('13_velocidad', 27.0),
    'audible-temporizador': ('14_temporizador', 5.0),
    'audible-capitulos': ('15_capitulos', 4.0),
    'audible-marcador': ('16_marcadores', 21.4),
    'audible-descargados': ('18_biblioteca', 22.0),
    'audible-planes': ('19_suscripcion', 14.5),
    'audible-cancelado': ('19_suscripcion', 18.4),
    'audible-perfil-infantil': ('20_perfil_infantil', 9.6),
    'audible-perfil-infantil-hoja': ('20_perfil_infantil', 12.6),
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
