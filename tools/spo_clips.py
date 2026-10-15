#!/usr/bin/env python3
"""Tomas de la app de Spotify para la reseña de sus audiolibros: corta las grabaciones de OBS en video/public/spo/rec/<toma>/video.mp4.

Uso (desde la raíz del repo): python3 tools/spo_clips.py [toma1,toma2]

Grabaciones (BlueStacks a pantalla completa, 664×1440 a 50 fps, app oficial de Spotify para Android 9.1.90.2270, 15/10/2026,
con la cuenta Premium de Joan, que inició él la sesión):
  A = `2026-10-15 10-03-54.mp4` (1 min 10 s): Buscar y la sección Audiolibros, de arriba abajo.
  B = `2026-10-15 10-05-35.mp4` (3 min 57 s): «reina roja» con el filtro Audiolibros, la ficha, «Prueba el libro», el reproductor
      (velocidad, temporizador, capítulos).
  D = `2026-10-15 10-10-23.mp4` (1 min 25 s): «Tiempo de escucha de audiolibros», «Recarga de 10 horas» y la pantalla de pago de
      Audiolibros+ (sin pagar: se cierra).
  E = `2026-10-15 10-12-28.mp4` (1 min 10 s): «asistenta mcfadden»: castellano incluido y latino de pago (16,99 €), y la hoja «Ve
      a Spotify.com para comprar» (se cierra sin enviar el correo).
  F = `2026-10-15 10-14-07.mp4` (3 min 46 s): La sombra del viento, La Bestia y Los tres mundos con el filtro Audiolibros (de Los
      tres mundos también sin filtro: pódcasts de entrevistas y reseñas), la ficha de Los tres mundos, «Encuentra la página» y
      Harry Potter con «Escucha sin límites hasta el 31 oct».
Fuera de las tomas (los cortes empiezan y acaban antes y después): la lista «Recientes» del buscador (las búsquedas de la cuenta),
el menú del perfil (nombre de la cuenta), «Tu Premium» (nombre y miembros del plan), la portada «Inicio», la biblioteca y los
resultados sin filtrar donde salen pódcasts de terceros con audiolibros enteros o los pódcasts de SonorBooks. Tapado con
tools/spo_cover.py: en Buscar, el avatar y las filas personalizadas («Listas que puedes ver», «Descubre episodios seleccionados
para ti»); en la pantalla de pago, el avatar, la dirección y la tarjeta.
El audio del libro y de las muestras no se usa (todas las tomas van sin audio).
"""
import json, os, subprocess, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
UP = '/mnt/user-data/uploads/Videos'
SRC = {
    'A': f'{UP}/2026-10-15 10-03-54.mp4',
    'B': f'{UP}/2026-10-15 10-05-35.mp4',
    'D': f'{UP}/2026-10-15 10-10-23.mp4',
    'E': f'{UP}/2026-10-15 10-12-28.mp4',
    'F': f'{UP}/2026-10-15 10-14-07.mp4',
}
OUT = os.path.join(ROOT, 'video/public/spo/rec')
# nombre: (grabación, desde, hasta) en segundos
CLIPS = {
    '00_buscar': ('A', 6.0, 14.32),            # Buscar (tapado); toque en «Audiolibros» a los 13,8 s
    '01_hub': ('A', 14.40, 70.2),              # la sección Audiolibros (empieza en negro, cargando: el fotograma anterior aún es Buscar);
                                               # desplazamientos a 3,6 · 18,6 · 22,6 · 37,5 · 41,5 s
    '02_reina_filtro': ('B', 33.4, 49.45),     # ya con el filtro Audiolibros (antes salen pódcasts de terceros): Reina roja incluido,
                                               # Loba negra con candado; toque en Reina roja a los 16 s
    '03_reina_ficha': ('B', 49.45, 79.15),     # ficha (carga a 0,05–0,7 s); baja a los 18,4–19,2 s
    '04_muestra': ('B', 79.15, 106.3),         # «Prueba el libro»: muestra hasta 15,5 s; tarjeta final desde 16,2 s
    '05_reproductor': ('B', 118.0, 149.45),    # play a los 7,5 s; reproductor completo a los 11,5 s
    '06_velocidad': ('B', 149.4, 196.9),       # hoja Velocidad: 1,2x · 2x · 3x · 3,5x · 1x · 0,5x · 1,25x · 1,2x
    '07_temporizador': ('B', 196.85, 202.1),   # hoja Temporizador
    '08_capitulos': ('B', 202.1, 219.65),      # lista de capítulos
    '09_pausa': ('B', 219.6, 237.2),           # reproductor; pausa a los 2,7 s
    '10_horas': ('D', 0.0, 26.38),             # Tiempo de escucha (0 h / 12 h restantes); baja a los 14,4 s
    '11_recarga': ('D', 26.4, 39.38),          # Recarga de 10 horas (Comprar por 9,99 €)
    '12_checkout': ('D', 50.4, 60.5),          # pantalla de pago de Audiolibros+ (tapada)
    '13_horas_arriba': ('D', 69.6, 84.88),     # Tiempo de escucha, arriba
    '14_asistenta': ('E', 20.3, 33.1),         # filtro Audiolibros: castellano incluido, latino con candado
    '15_asistenta_latino': ('E', 33.1, 69.5),  # ficha 16,99 €; hoja de compra a los 11,4–22,4 s
    '16_sombra': ('F', 36.3, 52.9),            # ya filtrada (sin filtro salían listas y episodios de terceros con «(audiolibro)»)
    '17_bestia': ('F', 76.5, 94.9),            # ya con el filtro Audiolibros (antes salen pódcasts de terceros): La Bestia incluido
    '18_tres_mundos': ('F', 99.1, 123.78),     # sin filtro hasta 12,5 s; filtrado desde 13 s
    '19_tres_mundos_ficha': ('F', 123.78, 135.3),
    '20_encuentra_pagina': ('F', 135.3, 151.0),  # hoja «Encuentra la página»: Escanear para escuchar / Buscar página
    '22_hp_sin_limites': ('F', 209.7, 226.0),  # «Escucha sin límites hasta el 31 oct»
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
