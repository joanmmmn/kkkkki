#!/usr/bin/env bash
# Render largo por tramos (un navegador nuevo en cada tramo, para que Chrome no se quede sin memoria),
# vídeo sin audio por tramos + audio completo aparte, y unión sin recodificar el vídeo.
# Uso: [SCALE=1.3333333333333333] tools/render_chunks.sh <composición> <salida.mkv> [fotogramas_por_tramo=3000]
# La salida lleva el audio en PCM: pásala después por tools/master.sh para el AAC a -14 LUFS.
set -euo pipefail
cd "$(dirname "$0")/../video"
COMP="$1"; OUT="$2"; CHUNK="${3:-3000}"
# SCALE=1.3333333333333333 renderiza a 2560x1440 (la composición sigue en 1920x1080): más nitidez y más calidad en YouTube.
SCALE="${SCALE:-1}"
# LIMIT=N renderiza como mucho N tramos de vídeo nuevos y para (para trabajos con tiempo limitado); se reanuda lanzándolo otra vez.
LIMIT="${LIMIT:-0}"; NEW=0
TMP="out/chunks/$COMP"
mkdir -p "$TMP"
TOTAL=$(npx remotion compositions src/index.ts 2>/dev/null | awk -v c="$COMP" '$1==c {print $4}')
[ -n "$TOTAL" ] || { echo "No encuentro la composición $COMP" >&2; exit 1; }
echo "$COMP: $TOTAL fotogramas, tramos de $CHUNK"
: > "$TMP/list.txt"
i=0
for ((a = 0; a < TOTAL; a += CHUNK)); do
  b=$((a + CHUNK - 1)); [ "$b" -ge "$TOTAL" ] && b=$((TOTAL - 1))
  part="$TMP/part_$(printf %02d $i).mp4"
  if [ ! -s "$part" ]; then
    if [ "$LIMIT" -gt 0 ] && [ "$NEW" -ge "$LIMIT" ]; then echo "Pausa tras $NEW tramos nuevos (LIMIT=$LIMIT): vuelve a lanzarlo para seguir"; exit 0; fi
    NEW=$((NEW + 1))
    # Se renderiza a un nombre temporal y se renombra al acabar: si el proceso se corta, el tramo a medias no cuenta como hecho.
    npx remotion render src/index.ts "$COMP" "${part%.mp4}.tmp.mp4" --frames="$a-$b" --concurrency=2 --crf="${CRF:-16}" --muted --scale="$SCALE" \
      --offthreadvideo-cache-size-in-bytes=1500000000 > "$TMP/part_$i.log" 2>&1 || { echo "Falló el tramo $a-$b (ver $TMP/part_$i.log)" >&2; exit 1; }
    mv "${part%.mp4}.tmp.mp4" "$part"
  fi
  echo "file '$(basename "$part")'" >> "$TMP/list.txt"
  echo "tramo $i ($a-$b) listo"
  i=$((i + 1))
done
ffmpeg -v error -y -f concat -safe 0 -i "$TMP/list.txt" -c copy "$TMP/video.mp4"
# El audio también por tramos (un render de audio seguido también agota la memoria) y unido en PCM, sin saltos:
# a 50 fps cada fotograma son 960 muestras exactas a 48 kHz.
: > "$TMP/alist.txt"
i=0
for ((a = 0; a < TOTAL; a += CHUNK)); do
  b=$((a + CHUNK - 1)); [ "$b" -ge "$TOTAL" ] && b=$((TOTAL - 1))
  apart="$TMP/audio_$(printf %02d $i).wav"
  if [ ! -s "$apart" ]; then
    npx remotion render src/index.ts "$COMP" "${apart%.wav}.tmp.wav" --frames="$a-$b" --codec=wav \
      --offthreadvideo-cache-size-in-bytes=1500000000 > "$TMP/audio_$i.log" 2>&1 || { echo "Falló el audio del tramo $a-$b" >&2; exit 1; }
    mv "${apart%.wav}.tmp.wav" "$apart"
  fi
  echo "file '$(basename "$apart")'" >> "$TMP/alist.txt"
  i=$((i + 1))
done
ffmpeg -v error -y -f concat -safe 0 -i "$TMP/alist.txt" -c copy "$TMP/audio.wav"
ffmpeg -v error -y -i "$TMP/video.mp4" -i "$TMP/audio.wav" -map 0:v -map 1:a -c:v copy -c:a pcm_s16le -shortest "$OUT"
echo "Unido: $OUT"
