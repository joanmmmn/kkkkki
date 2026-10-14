#!/usr/bin/env python3
"""Capturas de la reseña web de Audiobooks.com (web/audiobooks-com-resena/media/) a partir de las tomas de la app
(video/public/abc/rec/<toma>/video.mp4, 664×1440 a 50 fps; las corta tools/abc_clips.py) y de las grabaciones de la web
(video/public/abc/web/<grabación>/video.mp4, 3840×2160; tools/record.mjs, sin rellenar nada).

Uso: python3 tools/web_abc_media.py
Cada captura es un fotograma de la prueba del 14/10/2026 (app oficial de Audiobooks.com para Android 13.0.1, en BlueStacks) y
solo sale de las tomas, nunca de la grabación original: así quedan fuera los tramos con datos personales (el correo pegado en
el buscador y los Ajustes con el correo y el ID de la cuenta). Los tiempos son exactos (ffmpeg -ss).
La imagen para redes y el póster del vídeo salen de tools/web_abc_og.py."""
import os, subprocess, tempfile
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
REC = os.path.join(ROOT, 'video/public/abc/rec')
WEB = os.path.join(ROOT, 'video/public/abc/web')
OUT = os.path.join(ROOT, 'web/audiobooks-com-resena/media')

# nombre de archivo → (toma, segundo)
SHOTS = {
    'abc-portada': ('inicio_top', 2.0),
    'abc-explorar': ('browse', 12.0),
    'abc-vip': ('vip_lista', 12.0),
    'abc-posteguillo-ingles': ('post_en', 12.0),
    'abc-posteguillo-espanol': ('post_filtro_es', 12.0),
    'abc-reina-roja': ('reina_roja_es', 3.0),
    'abc-los-tres-mundos': ('tres_mundos_ficha', 5.0),
    'abc-los-tres-mundos-detalles': ('tres_mundos_ficha', 20.0),
    'abc-muestra': ('tres_mundos_muestra', 8.0),
    'abc-la-sombra-del-viento': ('sombra_es', 30.0),
    'abc-aviso-ingles': ('elon_buscar_en', 20.0),
    'abc-filtro-idioma': ('elon_filtro_es', 11.0),
    'abc-filtro-espanol': ('elon_filtro_es', 20.0),
    'abc-ajustes-ingles': ('ajustes_ingles', 8.0),
    'abc-elon-musk': ('elon_ficha', 10.0),
    'abc-elon-musk-detalles': ('elon_ficha', 30.0),
    'abc-credito': ('elon_credito', 10.0),
    'abc-anadido': ('elon_credito', 25.0),
    'abc-reproductor': ('elon_reproductor', 6.0),
    'abc-velocidad': ('elon_velocidad', 16.0),
    'abc-temporizador': ('elon_temporizador', 6.0),
    'abc-pistas': ('elon_pistas', 8.0),
    'abc-marcador': ('elon_marcador', 6.0),
    'abc-biblioteca': ('biblioteca_elon', 8.0),
    'abc-cuenta-gratis': ('cuenta_gratis', 8.0),
    'abc-quijote-gratis': ('quijote_gratis', 25.0),
    'abc-quijote': ('quijote_ficha', 6.0),
    'abc-perfil-prueba': ('perfil_prueba', 5.0),
    'abc-vip-prueba': ('vip_prueba', 45.0),
    'abc-app-1795': ('upgrade_1795', 6.0),
}
# Páginas web (1600×900): la de la prueba de SonorBooks y el formulario de alta (sin rellenar).
WEBS = {
    'abc-web-prueba': ('00_abc_landing', 1.0),
    'abc-web-alta': ('01_abc_signup', 38.0),
}


def frame(src, t):
    with tempfile.TemporaryDirectory() as d:
        p = os.path.join(d, 'f.png')
        subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-ss', str(t), '-i', src, '-frames:v', '1', p], check=True)
        return Image.open(p).convert('RGB')


def main():
    os.makedirs(OUT, exist_ok=True)
    for name, (rec, t) in SHOTS.items():
        im = frame(os.path.join(REC, rec, 'video.mp4'), t)
        if im.width > 664:
            im = im.resize((664, round(im.height * 664 / im.width)), Image.LANCZOS)
        p = os.path.join(OUT, name + '.webp')
        im.save(p, 'WEBP', quality=82, method=6)
        print(name, im.size, os.path.getsize(p) // 1024, 'KB')
    for name, (rec, t) in WEBS.items():
        im = frame(os.path.join(WEB, rec, 'video.mp4'), t).resize((1600, 900), Image.LANCZOS)
        p = os.path.join(OUT, name + '.webp')
        im.save(p, 'WEBP', quality=84, method=6)
        print(name, im.size, os.path.getsize(p) // 1024, 'KB')
    print('listo →', os.path.relpath(OUT, ROOT))


if __name__ == '__main__':
    main()
