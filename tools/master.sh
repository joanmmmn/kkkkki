#!/usr/bin/env bash
# Masteriza el audio de un render a -14 LUFS / -1,5 dBTP (loudnorm en dos pasadas) sin recodificar el vídeo.
# Uso: tools/master.sh entrada.mp4 salida.mp4 [bitrate_audio=320k]
set -euo pipefail
in="$1"; out="$2"; br="${3:-320k}"
J=$(ffmpeg -hide_banner -i "$in" -vn -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
read -r ii itp ilra ith off <<< "$(echo "$J" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'],d['target_offset'])")"
echo "entrada: $ii LUFS, pico $itp dBTP, LRA $ilra"
ffmpeg -v error -y -i "$in" -c:v copy \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$ii:measured_TP=$itp:measured_LRA=$ilra:measured_thresh=$ith:offset=$off:linear=true,aresample=48000" \
  -c:a aac -b:a "$br" -movflags +faststart "$out"
ffmpeg -hide_banner -i "$out" -vn -af ebur128=peak=true -f null - 2>&1 | grep -A14 Summary | grep -E " I:| Peak:" | sed 's/^ */salida: /'
