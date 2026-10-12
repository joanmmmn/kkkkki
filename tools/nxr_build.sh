#!/usr/bin/env bash
# Reseña de Nextory: de la clave de ElevenLabs a los entregables.
#   tools/nxr_build.sh audio    → locución (tts.py + vo_post.py), planes de música y música
#   tools/nxr_build.sh render   → render de la reseña y del vertical, masterizado a -14 LUFS, miniatura, subtítulos
# La clave se lee de ELEVENLABS_API_KEY o de .secrets/elevenlabs.env (ignorado por git).
# Entre un paso y otro: revisar la locución con tools/qa_vo.py y poner NXR_MUSIC / NXR_SHORT_MUSIC en el código.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=deliverables/nextory/resena
case "${1:-}" in
  audio)
    python3 tools/tts.py video/public/nxr/vo/vo.json video/public/nxr/vo
    python3 tools/vo_post.py video/public/nxr/vo
    # Música de la reseña: una pieza por bloque, cortadas en los separadores de sección (v2).
    python3 tools/nxr_music_v2.py compose
    python3 tools/nxr_music_v2.py join
    # Música del vertical (si falta): plan por secciones y una sola composición.
    if [ ! -s video/public/music/nxr_short.mp3 ]; then
      python3 tools/nxr_music_plan.py
      python3 tools/music.py video/public/music/nxr_short.plan.json video/public/music/nxr_short.mp3
    fi
    mkdir -p "$OUT"
    python3 tools/nxr_meta.py --out "$OUT"
    ;;
  render)
    mkdir -p "$OUT" video/out/nxr
    # Por tramos: un render seguido de 4 min se queda sin memoria en Chrome (escenas con grabaciones 4K).
    tools/render_chunks.sh NXReview out/nxr/NXR_review_raw.mkv 2700
    tools/master.sh video/out/nxr/NXR_review_raw.mkv video/out/nxr/NXR_review_master.mp4
    # GitHub no admite archivos de más de 100 MiB: si el máster se pasa, se recodifica el vídeo para que quepa.
    tools/fit_size.sh video/out/nxr/NXR_review_master.mp4 "$OUT/SonorBooks_Nextory_Resena_1080p.mp4" 95
    tools/render_chunks.sh NXRShort out/nxr/NXR_short_raw.mkv 1200
    tools/master.sh video/out/nxr/NXR_short_raw.mkv "$OUT/SonorBooks_Nextory_Resena_Short_9x16.mp4"
    (cd video && npx remotion still src/index.ts NXRThumb "../$OUT/miniatura_resena.png")
    python3 tools/nxr_meta.py --out "$OUT"
    ;;
  *)
    echo "Uso: $0 audio|render" >&2
    exit 1
    ;;
esac
