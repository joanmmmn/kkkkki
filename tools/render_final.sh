#!/usr/bin/env bash
# Render final de la reseña en máxima calidad.
#   1. Imagen: Remotion a 2560×1440 (escala 4/3), fotogramas PNG sin pérdida → intermedio H.264 CRF 4.
#   2. Audio: render solo de audio (WAV) → mezcla masterizada a -14 LUFS con tools/master.sh.
#   3. Máster 1440p para YouTube (CRF 14, veryslow) y versión 1080p de ~95 MB (dos pasadas, veryslow).
# Uso: tools/render_final.sh [carpeta_trabajo]   (desde la raíz del repo)
set -euo pipefail
WD="${1:-/tmp/elt_final}"; mkdir -p "$WD"
OUT=deliverables/el-libro-total
BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
cd video
npx remotion render src/index.ts ELTReview2 "$WD/inter_1440.mp4" --muted --scale=1.3333333333 \
  --image-format=png --crf=4 --x264-preset=medium --concurrency=4 --browser-executable="$BROWSER" \
  --offthreadvideo-cache-size-in-bytes=2000000000 --log=error
npx remotion render src/index.ts ELTReview2 "$WD/mix.wav" --codec=wav --props='{"audioOnly":true}' \
  --concurrency=4 --browser-executable="$BROWSER" --log=error
cd ..
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$WD/inter_1440.mp4")
X264="-pix_fmt yuv420p -profile:v high -preset veryslow -g 100 -bf 3 -movflags +faststart -colorspace bt709 -color_primaries bt709 -color_trc bt709"
# Máster 1440p (YouTube lo recodifica en VP9/AV1, con más bitrate también para quien lo vea a 1080p).
ffmpeg -v error -y -i "$WD/inter_1440.mp4" -i "$WD/mix.wav" -map 0:v -map 1:a -c:v libx264 -crf 14 $X264 -level 5.1 \
  -c:a pcm_s16le "$WD/pre_1440.mov"
tools/master.sh "$WD/pre_1440.mov" "$OUT/SonorBooks_ElLibroTotal_Resena_MASTER_1440p.mp4" 320k
# 1080p de ~95 MB (límite de GitHub sin LFS): bitrate de vídeo calculado para el total.
VBR=$(python3 -c "print(int((95*8*1024*1024/$DUR - 330000)/1000))")
SCALE="scale=1920:1080:flags=lanczos"
ffmpeg -v error -y -i "$WD/inter_1440.mp4" -vf "$SCALE" -c:v libx264 -b:v ${VBR}k $X264 -level 4.2 -pass 1 -passlogfile "$WD/x264" -an -f mp4 /dev/null
ffmpeg -v error -y -i "$WD/inter_1440.mp4" -i "$WD/mix.wav" -map 0:v -map 1:a -vf "$SCALE" -c:v libx264 -b:v ${VBR}k \
  -maxrate $((VBR * 3))k -bufsize $((VBR * 4))k $X264 -level 4.2 -pass 2 -passlogfile "$WD/x264" -c:a pcm_s16le "$WD/pre_1080.mov"
tools/master.sh "$WD/pre_1080.mov" "$OUT/SonorBooks_ElLibroTotal_Resena_FINAL_1080p.mp4" 320k
ls -la "$OUT"
