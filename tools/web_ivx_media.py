#!/usr/bin/env python3
"""Capturas de la reseña web de iVoox (web/ivoox-resena/media/) a partir de las tomas de la app y de ivoox.com
(video/public/ivx/rec/<toma>/video.mp4, 664×1440 a 50 fps; las corta tools/ivx_clips.py).

Uso: python3 tools/web_ivx_media.py
Cada captura es un fotograma de la prueba del 15/10/2026: la app oficial de iVoox para Android (2.4020, en BlueStacks, con la
cuenta de Joan, que tiene Premium) y ivoox.com en el Chrome de ese mismo Android, en incógnito y desde España (el aviso de cookies,
el muro que sale al rechazarlas y la página de Premium, sin rellenar nada). Solo sale de las tomas, nunca de la grabación
original: así quedan fuera los tramos con datos personales (el perfil, los Ajustes con el correo y la cuenta de Google Play).
Los tiempos son exactos (ffmpeg -ss). La imagen para redes y el póster del vídeo salen de tools/web_ivx_og.py."""
import os, subprocess, tempfile
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
REC = os.path.join(ROOT, 'video/public/ivx/rec')
OUT = os.path.join(ROOT, 'web/ivoox-resena/media')

# nombre de archivo → (toma, segundo)
SHOTS = {
    # ivoox.com desde España: el aviso de cookies, el muro al rechazarlas y la página de Premium
    'ivx-aviso-cookies': ('web_aviso', 3.0),
    'ivx-muro-cookies': ('web_muro', 8.0),
    'ivx-premium-anual': ('web_premium', 14.0),
    'ivx-premium-mensual': ('web_premium', 24.0),
    # La app
    'ivx-inicio': ('inicio_top', 5.0),
    'ivx-explorar': ('explorar_carta', 4.0),
    'ivx-ranking': ('ranking', 6.0),
    'ivx-originals': ('originals', 20.0),
    'ivx-contrahistoria': ('contrahistoria_ficha', 4.0),
    'ivx-avance': ('contrahistoria_avance', 8.0),
    'ivx-apoyar': ('apoyar', 8.0),
    'ivx-descargas': ('descargados', 4.0),
    'ivx-reproductor': ('reproductor_2', 4.0),
    'ivx-configuracion': ('config_reproductor', 24.0),
    'ivx-modo-coche': ('modo_coche', 10.0),
    'ivx-radios': ('radios_tab', 3.0),
    'ivx-radios-nacionales': ('radios_nacionales', 8.0),
    'ivx-radio-ser': ('radio_ser', 6.0),
    'ivx-audiolibros': ('audiolibros_2', 8.0),
    'ivx-usher': ('usher_ficha_2', 5.0),
    'ivx-plus-oferta': ('plus_oferta', 6.0),
    'ivx-usher-avance': ('usher_avance', 6.0),
    'ivx-quijote': ('quijote_ficha', 5.0),
    'ivx-quijote-avance': ('quijote_avance', 42.0),
    'ivx-ajustes': ('ajustes_cancelar', 3.0),
}


# Tapar lo que no aporta: en el aviso de cookies asoma, abajo, el titular de una portada de la web («Nuevo episodio de…»);
# se cubre con el gris del fondo oscurecido por el aviso.
CLEAN = {'ivx-aviso-cookies': [((0, 1392, 664, 1440), (126, 126, 126))]}


def frame(src, t):
    with tempfile.TemporaryDirectory() as d:
        p = os.path.join(d, 'f.png')
        subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-ss', str(t), '-i', src, '-frames:v', '1', p], check=True)
        return Image.open(p).convert('RGB')


def main():
    os.makedirs(OUT, exist_ok=True)
    for name, (rec, t) in SHOTS.items():
        im = frame(os.path.join(REC, rec, 'video.mp4'), t)
        assert im.size == (664, 1440), (name, im.size)
        for box, color in CLEAN.get(name, []):
            im.paste(color, box)
        p = os.path.join(OUT, name + '.webp')
        im.save(p, 'WEBP', quality=82, method=6)
        print(name, im.size, os.path.getsize(p) // 1024, 'KB')
    print('listo →', os.path.relpath(OUT, ROOT))


if __name__ == '__main__':
    main()
