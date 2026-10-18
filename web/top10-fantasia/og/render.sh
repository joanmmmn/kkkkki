#!/usr/bin/env bash
# Vuelve a dibujar og-source.png (2400×1260) y poster-source.png (2560×1440) con las portadas de video/public/t10f/covers.
set -e
cd "$(dirname "$0")"; ROOT=$(cd ../../.. && pwd)
for f in og poster; do sed "s#{{ROOT}}#$ROOT#g" $f.html > /tmp/t10f_$f.html; done
node shot.mjs /tmp/t10f_og.html ../og-source.png 1200 630
node shot.mjs /tmp/t10f_poster.html ../poster-source.png 1280 720
