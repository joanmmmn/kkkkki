#!/usr/bin/env python3
"""Tomas de la app de BookBeat para la reseña: corta las grabaciones de OBS en video/public/bkb/rec/<toma>/video.mp4.

Uso (desde la raíz del repo): python3 tools/bkb_clips.py [toma1,toma2]

Grabaciones (BlueStacks a pantalla completa, 664×1440 a 50 fps, app oficial de BookBeat para Android 10.19.1 con la cuenta
que abrió Joan el 14/10/2026, en la prueba gratuita de 30 días):
  A = `2026-10-14 17-42-16.mp4` (18 min 7 s): portada, inspiración, categorías, buscador, fichas, reproductor, lector, perfil.
  B = `2026-10-14 18-02-14.mp4` (3 min 26 s): Account Information (la prueba y el plan siguiente) y Change subscription.
Fuera de las tomas (los cortes empiezan y acaban después y antes de que aparezca): la cabecera del perfil, con el nombre y el
correo de la cuenta. Tapado con tools/bkb_cover.py: el nombre del perfil en las páginas web de la cuenta, la tarjeta de pago y
el nombre de quien escribe la reseña de la ficha de La sombra del viento.
El audio del audiolibro que suena no se usa (todas las tomas van sin audio).
"""
import json, os, subprocess, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
UP = '/mnt/user-data/uploads/Videos'
SRC = {'A': f'{UP}/2026-10-14 17-42-16.mp4', 'B': f'{UP}/2026-10-14 18-02-14.mp4'}
OUT = os.path.join(ROOT, 'video/public/bkb/rec')
# nombre: (grabación, desde, hasta) en segundos
CLIPS = {
    '00_inicio_top': ('A', 0.0, 36.0),
    '01_inicio_scroll': ('A', 34.0, 62.5),
    '02_estadisticas': ('A', 61.5, 75.5),
    '03_racha': ('A', 75.0, 92.0),
    '04_inspiration': ('A', 92.0, 143.5),
    '05_categorias': ('A', 143.0, 206.0),
    '06_crimen': ('A', 205.5, 236.0),
    '07_mola': ('A', 247.0, 273.0),
    '08_buscar_sombra': ('A', 272.0, 324.0),
    '09_sombra_ficha': ('A', 323.0, 360.0),
    '10_reproductor': ('A', 381.0, 405.0),
    '11_velocidad': ('A', 404.0, 444.0),
    '12_temporizador': ('A', 443.0, 466.0),
    '13_marcadores': ('A', 465.0, 509.0),
    '14_capitulos': ('A', 508.0, 529.0),
    '15_descarga': ('A', 528.0, 582.0),
    '16_horas': ('A', 596.0, 620.9),
    '17_descargados': ('A', 623.6, 638.8),
    '18_perfiles_web': ('A', 647.6, 668.1),
    '19_tema_oscuro': ('A', 677.5, 735.0),
    '20_book_filter': ('A', 746.2, 764.8),
    '21_audio_player': ('A', 768.4, 793.3),
    '22_dispositivos': ('A', 804.0, 823.0),
    '23_sapiens': ('A', 833.0, 885.0),
    '24_ebook': ('A', 884.0, 1023.0),
    '25_inicio_final': ('A', 1029.0, 1086.0),
    '26_cuenta': ('B', 46.1, 68.6),
    '27_cambiar_plan': ('B', 77.0, 121.0),
}


def main():
    only = sys.argv[1].split(',') if len(sys.argv) > 1 else None
    idx_path = os.path.join(OUT, 'index.json')
    idx = json.load(open(idx_path)) if os.path.exists(idx_path) else {}
    for name, (src, s, e) in CLIPS.items():
        if only and name not in only:
            continue
        d = os.path.join(OUT, name)
        os.makedirs(d, exist_ok=True)
        v = os.path.join(d, 'video.mp4')
        cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', str(s), '-to', str(e), '-i', SRC[src],
               '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-r', '50', '-g', '50', '-movflags', '+faststart', '-an', v]
        subprocess.run(cmd, check=True)
        dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', v]).decode().strip())
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-sseof', '-0.1', '-i', v, '-frames:v', '1', '-q:v', '2', os.path.join(d, 'last.jpg')], check=True)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', v, '-frames:v', '1', '-q:v', '2', os.path.join(d, 'first.jpg')], check=True)
        idx[name] = {'duration': round(dur, 3), 'src': os.path.basename(SRC[src]), 'from': s, 'to': e, 'audio': False}
        print(name, round(dur, 2), os.path.getsize(v) // 1024, 'KB', flush=True)
    json.dump(dict(sorted(idx.items())), open(idx_path, 'w'), indent=1)


if __name__ == '__main__':
    main()
