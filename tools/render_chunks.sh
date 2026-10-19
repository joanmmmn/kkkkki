#!/usr/bin/env bash
# Render largo por tramos (un navegador nuevo en cada tramo, para que Chrome no se quede sin memoria),
# vídeo sin audio por tramos + audio completo aparte, y unión sin recodificar el vídeo.
# Uso: [SCALE=1.3333333333333333] [RANGES="0-699:swangle:1 700-2999"] tools/render_chunks.sh <composición> <salida.mkv> [fotogramas_por_tramo=3000]
# RANGES (opcional) fija los tramos a mano: «inicio-fin[:gl[:concurrencia]]» separados por espacios; lo que no cubran se
# reparte en tramos normales. Las escenas en three.js (WebGL por software) van mejor con :swangle:1.
# La salida lleva el audio en PCM: pásala después por tools/master.sh para el AAC a -14 LUFS.
# PARTS="1 2" (opcional) renderiza solo esos tramos del plan y sale sin unir: sirve para repartir un render largo en varias
# tandas (cada tanda cabe en el límite de una tarea en segundo plano). Al final, una pasada sin PARTS une todo.
set -euo pipefail
cd "$(dirname "$0")/../video"
COMP="$1"; OUT="$2"; CHUNK="${3:-3000}"
# SCALE=1.3333333333333333 renderiza a 2560x1440 (la composición sigue en 1920x1080): más nitidez y más calidad en YouTube.
SCALE="${SCALE:-1}"
TMP="out/chunks/$COMP"
mkdir -p "$TMP"
TOTAL=$(npx remotion compositions src/index.ts 2>/dev/null | awk -v c="$COMP" '$1==c {print $4}')
[ -n "$TOTAL" ] || { echo "No encuentro la composición $COMP" >&2; exit 1; }
echo "$COMP: $TOTAL fotogramas, tramos de $CHUNK"
# Lista de tramos: los de RANGES y, después, el resto en bloques de CHUNK.
PLAN=()
next=0
for r in ${RANGES:-}; do
  ab="${r%%:*}"; a="${ab%-*}"; b="${ab#*-}"
  while [ "$next" -lt "$a" ]; do e=$((next + CHUNK - 1)); [ "$e" -ge "$a" ] && e=$((a - 1)); PLAN+=("$next-$e"); next=$((e + 1)); done
  PLAN+=("$r"); next=$((b + 1))
done
while [ "$next" -lt "$TOTAL" ]; do e=$((next + CHUNK - 1)); [ "$e" -ge "$TOTAL" ] && e=$((TOTAL - 1)); PLAN+=("$next-$e"); next=$((e + 1)); done
: > "$TMP/list.txt"
i=0
for r in "${PLAN[@]}"; do
  ab="${r%%:*}"; a="${ab%-*}"; b="${ab#*-}"
  rest="${r#*:}"; [ "$rest" = "$r" ] && rest=""
  gl="${rest%%:*}"; conc="${rest#*:}"; [ "$conc" = "$rest" ] && conc=""
  part="$TMP/part_$(printf %02d $i).mp4"
  if [ -n "${PARTS:-}" ] && [[ " $PARTS " != *" $i "* ]]; then i=$((i + 1)); continue; fi
  if [ ! -s "$part" ]; then
    npx remotion render src/index.ts "$COMP" "$part" --frames="$a-$b" --concurrency="${conc:-2}" ${gl:+--gl=$gl} --crf=16 --muted --scale="$SCALE" \
      --timeout=240000 --offthreadvideo-cache-size-in-bytes=1500000000 > "$TMP/part_$i.log" 2>&1 || { echo "Falló el tramo $a-$b (ver $TMP/part_$i.log)" >&2; exit 1; }
  fi
  echo "file '$(basename "$part")'" >> "$TMP/list.txt"
  echo "tramo $i ($a-$b ${gl:-}) listo $(date +%H:%M)"
  i=$((i + 1))
done
[ -n "${PARTS:-}" ] && { echo "Tramos $PARTS listos (sin unir)"; exit 0; }
ffmpeg -v error -y -f concat -safe 0 -i "$TMP/list.txt" -c copy "$TMP/video.mp4"
# El audio también por tramos (un render de audio seguido también agota la memoria) y unido en PCM, sin saltos:
# a 50 fps cada fotograma son 960 muestras exactas a 48 kHz.
: > "$TMP/alist.txt"
i=0
for ((a = 0; a < TOTAL; a += CHUNK)); do
  b=$((a + CHUNK - 1)); [ "$b" -ge "$TOTAL" ] && b=$((TOTAL - 1))
  apart="$TMP/audio_$(printf %02d $i).wav"
  if [ ! -s "$apart" ]; then
    npx remotion render src/index.ts "$COMP" "$apart" --frames="$a-$b" --codec=wav --props='{"audioOnly":true}' \
      --offthreadvideo-cache-size-in-bytes=1500000000 > "$TMP/audio_$i.log" 2>&1 || { echo "Falló el audio del tramo $a-$b" >&2; exit 1; }
  fi
  echo "file '$(basename "$apart")'" >> "$TMP/alist.txt"
  i=$((i + 1))
done
ffmpeg -v error -y -f concat -safe 0 -i "$TMP/alist.txt" -c copy "$TMP/audio.wav"
ffmpeg -v error -y -i "$TMP/video.mp4" -i "$TMP/audio.wav" -map 0:v -map 1:a -c:v copy -c:a pcm_s16le -shortest "$OUT"
echo "Unido: $OUT"
