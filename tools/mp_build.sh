#!/usr/bin/env bash
# «Las mejores plataformas de audiolibros en español»: de la clave de ElevenLabs a los entregables.
#   tools/mp_build.sh audio    → locución (tts.py + vo_post.py), comprobación con Whisper, música (7 piezas) y textos
#   tools/mp_build.sh render   → render a 2560×1440 por tramos, masterizado a -14 LUFS, copia ligera, miniaturas y subtítulos
# La clave se lee de ELEVENLABS_API_KEY o de .secrets/elevenlabs.env (ignorado por git).
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=deliverables/mejores-plataformas
case "${1:-}" in
  audio)
    python3 tools/tts.py video/public/mp/vo/vo.json video/public/mp/vo
    python3 tools/vo_post.py video/public/mp/vo
    python3 tools/mp_music.py
    mkdir -p "$OUT"
    python3 tools/mp_meta.py --out "$OUT"
    python3 tools/mp_youtube.py
    ;;
  render)
    mkdir -p "$OUT" video/out/mp
    SCALE=1.3333333333333333 tools/render_chunks.sh MPGuide out/mp/MP_raw.mkv 2000
    tools/master.sh video/out/mp/MP_raw.mkv "$OUT/SonorBooks_MejoresPlataformas_1440p.mp4"
    (cd video && npx remotion still src/index.ts MPThumbA "../$OUT/miniatura_A.png" && npx remotion still src/index.ts MPThumbB "../$OUT/miniatura_B.png")
    python3 tools/mp_meta.py --out "$OUT"
    python3 tools/mp_youtube.py
    ;;
  *)
    echo "Uso: $0 audio|render" >&2
    exit 1
    ;;
esac
