#!/usr/bin/env bash
# Toma el último resultado guardado de javascript_tool (una instantánea de tools/snap_safe.js), lo extrae a
# captures/elevenreader/app/<nombre>.html y lo renderiza a 4K (PNG) más una vista previa reducida para revisarla.
# Uso: tools/pull_snap.sh <nombre> [ancho alto]
set -euo pipefail
name="$1"; w="${2:-1920}"; h="${3:-1080}"
dir=/root/.claude/projects/-home-claude-kkkkki/bea37c80-2976-524d-a832-143f671972ef/tool-results
f=$(ls -t "$dir"/mcp-remote-devices-Claude_Browser__javascript_tool-*.txt | head -1)
out=captures/elevenreader/app/$name.html
python3 tools/unsnap.py "$f" "$out"
mkdir -p video/public/er/app
FULL="${FULL:-0}" node tools/render_snap.mjs "$out" "video/public/er/app/$name.png" "$w" "$h" > /dev/null
python3 -c "
from PIL import Image; im=Image.open('video/public/er/app/$name.png'); print('png', im.size)
im.resize((1280, int(1280*im.size[1]/im.size[0]))).save('/tmp/claude-0/-home-claude-kkkkki/bea37c80-2976-524d-a832-143f671972ef/scratchpad/er/prev_$name.png')"
