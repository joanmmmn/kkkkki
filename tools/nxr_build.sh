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
    python3 tools/nxr_music_plan.py
    for p in video/public/music/nxr_*.plan.json; do
      mp3="${p%.plan.json}.mp3"
      python3 tools/music.py "$p" "$mp3"
    done
    mkdir -p "$OUT"
    python3 tools/nxr_meta.py --out "$OUT"
    ;;
  render)
    mkdir -p "$OUT" video/out/nxr
    (cd video && npx remotion render src/index.ts NXReview out/nxr/NXR_review_raw.mp4 --concurrency=2 --crf=16)
    tools/master.sh video/out/nxr/NXR_review_raw.mp4 "$OUT/SonorBooks_Nextory_Resena_1080p.mp4"
    (cd video && npx remotion render src/index.ts NXRShort out/nxr/NXR_short_raw.mp4 --concurrency=2 --crf=16)
    tools/master.sh video/out/nxr/NXR_short_raw.mp4 "$OUT/SonorBooks_Nextory_Resena_Short_9x16.mp4"
    (cd video && npx remotion still src/index.ts NXRThumb "../$OUT/miniatura_resena.png")
    python3 tools/nxr_meta.py --out "$OUT"
    ;;
  *)
    echo "Uso: $0 audio|render" >&2
    exit 1
    ;;
esac
