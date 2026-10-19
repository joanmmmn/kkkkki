#!/usr/bin/env bash
# SonorBooks Polska: render final de una pieza a 2560×1440 (por tramos), máster a −14 LUFS y copia ligera 1080p de revisión.
# Uso: tools/pl_render.sh <pieza> [composición=PL-<pieza>]
# Salida: video/out/pl/<pieza>/SonorBooks_PL_<pieza>_1440p.mp4 y _revision_720p.mp4, con su .sha256.
set -euo pipefail
cd "$(dirname "$0")/.."
slug="$1"; comp="${2:-PL-$slug}"
out="video/out/pl/$slug"; mkdir -p "$out"
python3 tools/pl_index.py >/dev/null
# Los tramos se renderizan con prioridad baja: así las grabaciones y las vistas previas de los montadores no se resienten.
CRF=18 SCALE=1.3333333333333333 nice -n "${NICE:-12}" tools/render_chunks.sh "$comp" "out/pl/$slug/raw.mkv" "${CHUNK:-2500}"
tools/master.sh "$out/raw.mkv" "$out/SonorBooks_PL_${slug}_1440p.mp4" 320k
ffmpeg -v error -y -i "$out/SonorBooks_PL_${slug}_1440p.mp4" -vf scale=1280:720:flags=lanczos -c:v libx264 -preset medium -crf 26 -c:a aac -b:a 128k -movflags +faststart "$out/SonorBooks_PL_${slug}_revision_720p.mp4"
( cd "$out" && sha256sum "SonorBooks_PL_${slug}_1440p.mp4" > "SonorBooks_PL_${slug}_1440p.mp4.sha256" )
ls -la "$out"
