#!/usr/bin/env bash
# Genera los recursos del artículo visual del blog (capturas WebP, clips en bucle MP4 y muestra de audio).
# Uso: tools/blog_media.sh   (desde la raíz del repo; escribe en blog/el-libro-total/web/media/)
set -euo pipefail
SCR=assets/el-libro-total/screens
REC=video/public/elt/rec
OUT=blog/el-libro-total/web/media
mkdir -p "$OUT"

# Capturas de escritorio (4K → 1600 px) y de móvil (→ 640 px), WebP de calidad 82.
img() { convert "$SCR/$1" -resize "$3" -strip -quality 82 "$OUT/$2.webp"; }
img 01-home-escritorio.png            portada-web          1600x
img 22-seccion-audiolibros-y-filtros.png audiolibros-filtros 1600x
img 04-busqueda-crimen-y-castigo.png   busqueda             1600x
img 05-ficha-crimen-y-castigo.png      ficha                1600x
img 08-audiolectura-resaltado-progresivo-y-globo.png audiolectura 1600x
img 07-audiolectura-leido-por-hernando-ivan-cano.png leido-por 1600x
img 16-diccionario-desde-seleccion.png diccionario          1600x
img 15-lectura-comparada-es-en-fr.png  lectura-comparada    1600x
img 18-vocabulario-de-la-obra.png      vocabulario          1600x
img 11-lector-modo-oscuro.png          modo-nocturno        1600x
img 31-movil-home.png                  movil-inicio         640x
img 34-movil-velocidad-0.8-a-2x.png    movil-velocidad      640x
img 36-movil-ficha-sin-boton-leer-offline.png movil-sin-conexion 640x

# Clips en bucle (sin audio) a partir de las grabaciones 4K: 1280 px, 30 fps, H.264 para máxima compatibilidad.
clip() { # nombre grabación inicio duración
  ffmpeg -v error -y -ss "$3" -t "$4" -i "$REC/$2/video.mp4" -an \
    -vf "fps=30,scale=1280:-2:flags=lanczos,format=yuv420p" -c:v libx264 -preset slow -crf 25 -profile:v high -movflags +faststart "$OUT/$1.mp4"
  ffmpeg -v error -y -ss "$3" -i "$REC/$2/video.mp4" -frames:v 1 -vf "scale=1280:-2" -quality 80 "$OUT/$1.webp"
}
clip clip-temas         01_home   10.3 6.2
clip clip-buscar        02_search 2.4  6.8
clip clip-ficha         02_search 21.2 6.4
clip clip-audiolectura  03_reader 13.0 8.0

# Muestra de la narración original (Crimen y castigo, leído por Hernando Iván Cano): 12 s, -16 LUFS, mono.
ffmpeg -v error -y -ss 4.1 -t 12 -i video/public/elt/audio/ctc_4_244282.mp3 \
  -af "loudnorm=I=-16:TP=-1.5,afade=t=in:d=0.15,afade=t=out:st=11.3:d=0.7" -ac 1 -ar 44100 -b:a 96k "$OUT/muestra-crimen-y-castigo.mp3"

ls -la "$OUT"
