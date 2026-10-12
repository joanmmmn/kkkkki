#!/usr/bin/env bash
# Si un MP4 pasa de un tamaño (GitHub no acepta archivos de más de 100 MiB), recodifica el vídeo en dos pasadas
# con x264 (preset slow) para que quepa, sin tocar el audio.
# Uso: tools/fit_size.sh entrada.mp4 salida.mp4 [MiB=95]
set -euo pipefail
in="$1"; out="$2"; max="${3:-95}"
size=$(stat -c %s "$in")
if [ "$size" -le $((max * 1048576)) ]; then
  [ "$in" != "$out" ] && cp "$in" "$out"
  echo "cabe: $((size / 1048576)) MiB"
  exit 0
fi
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$in")
abr=$(ffprobe -v error -select_streams a:0 -show_entries stream=bit_rate -of csv=p=0 "$in")
# bits disponibles para el vídeo (con un 2 % de margen para el contenedor)
vbr=$(python3 -c "print(int(($max * 1048576 * 8 * 0.98) / $dur - ${abr:-320000}))")
tmp=$(mktemp -d)
ffmpeg -v error -y -i "$in" -map 0:v -c:v libx264 -preset slow -b:v "$vbr" -pass 1 -passlogfile "$tmp/p" -an -f mp4 /dev/null
ffmpeg -v error -y -i "$in" -map 0:v -map 0:a -c:v libx264 -preset slow -b:v "$vbr" -maxrate $((vbr * 2)) -bufsize $((vbr * 4)) -pass 2 -passlogfile "$tmp/p" \
  -pix_fmt yuv420p -c:a copy -movflags +faststart "$out"
rm -rf "$tmp"
echo "recodificado a $((vbr / 1000)) kb/s de vídeo: $(( $(stat -c %s "$out") / 1048576 )) MiB"
