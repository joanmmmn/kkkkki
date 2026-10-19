# SonorBooks Polska · vídeos del canal adaptados al mercado polaco

Encargo de Joan (19/10/2026): todos los vídeos de SonorBooks España adaptados al mercado polaco y a sus plataformas, para el canal SonorBooks Polska (@SonorBooksPolska), enlazando a sonorbooks.pl. Decidido con Joan ese día:

- Las plataformas que no existen en Polonia se sustituyen por su equivalente polaco: Nextory → Legimi, Podimo → Audioteka, iVoox → Empik Go, Audiobooks.com → Kobo Plus, El Libro Total → Wolne Lektury, eBiblio → kody biblioteczne, LibriVox → LibriVox po polsku. Storytel, BookBeat, Audible, Spotify y ElevenReader se rehacen con los datos de Polonia; Stephen King, «Cómo los audiolibros afectan a tu cerebro» y «10 historias de terror», con ediciones y datos polacos.
- Solo se graban webs públicas (sin cuentas, sin formularios, sin datos personales).
- Voz: «Rafał – Friendly and Cheerful» (ElevenLabs, `ju4v8uYSowm1stRz3YUN`, `eleven_v4`, `language_code: pl`), elegida entre 15 voces polacas (Whisper large-v3 sin errores, mejor calidad estimada con SQUIM).
- Nada se sube a YouTube sin el «sí» de Joan.

## Plantilla de reseña (rama `pl-recenzje`)

Las 12 reseñas de plataforma comparten una plantilla de Remotion hecha con el sistema de diseño de las reseñas de España:

- `video/src/pl/types.ts`: la especificación de una reseña (escenas de tipo `hook`, `intro`, `plans`, `rec`, `features`, `stat`, `devices`, `ratings`, `proscons`, `verdict`, `steps`, `outro`). Las animaciones se enganchan a palabras de la locución («cues»).
- `video/src/pl/specs/<pieza>.tsx`: los datos de cada reseña. Se registran solos como composiciones `PL-<pieza>` y `PLThumb-<pieza>`.
- `video/src/pl/scenes.tsx`, `kit.tsx`, `Review.tsx`, `Thumb.tsx`: la plantilla.
- `video/public/pl/<pieza>/`: `vo/` (locución), `rec/` (grabaciones de `tools/record.mjs`), `img/` (logotipos) y `music/bed.mp3`.
- Herramientas: `tools/pl_index.py` (índices de locución y grabaciones), `tools/pl_meta.py` (línea de tiempo, capítulos y .srt), `tools/pl_music.py` (lecho musical con las piezas de las reseñas de España, sin gastar créditos). `tools/record.mjs` admite ahora `locale`, `timezone` y `crf`.

## Dónde quedan los másteres

**No van a Git LFS**: la cuota gratuita de LFS de GitHub es de 10 GiB y los másteres de España ya ocupan unos 8,5 GiB, así que otro máster podría bloquear las subidas y las descargas de LFS de todo el repositorio. Los másteres polacos se guardan en el PC de Joan, en `E:\SonorBooks\youtube-pl\<pieza>\`, con su SHA-256.

Investigación y guiones de cada pieza: `research/pl/<pieza>/`.
