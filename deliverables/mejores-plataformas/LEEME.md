# Vídeo «Las mejores plataformas de audiolibros en español» (SonorBooks España)

Encargo de Joan (15/10/2026, 10:28): con todo el material de las reseñas de cada plataforma, un vídeo definitivo de máxima calidad
sobre las mejores plataformas de audiolibros en español: lo más relevante de cada una, trucos, funcionalidades y lo mejor de lo mejor.
El 18/10 (20:08), con la clave de ElevenLabs, «ponte a ello»: **terminado el 19/10/2026 de madrugada; pendiente de la aprobación de Joan.**

## Piezas (esta carpeta)

- **Vídeo para YouTube:** `SonorBooks_MejoresPlataformas_1440p.mp4` — 2560×1440, 50 fps, 8:36 (25.816 fotogramas), −14,2 LUFS,
  pico −1,8 dBFS, 597,1 MiB, en **Git LFS** (pasa de los 100 MiB de GitHub). SHA-256
  `4425d38b6cc65a87157603f9a359c624410c3747a1b6968faa3e318bb425a241`.
- **Miniaturas** (1280×720): `miniatura_A.png` («11 APPS DE AUDIOLIBROS · ¿CUÁL ELEGIR?», tres móviles con apps reales y
  Spotify «Nuevo») y `miniatura_B.png` (las once fichas en rejilla y la banda «LAS MEJORES APPS DE AUDIOLIBROS · Comparativa
  2026»), para «Probar y comparar».
- **Subtítulos:** `mejores_plataformas.es.srt` (las cifras que la voz dice en letra van en número: «9,99 €», «90.000»,
  «Audiolibros+»…; incluye la frase de Omar, el voluntario de LibriVox).
- **Textos de YouTube:** `youtube.md` (título de 100 caracteres y dos alternativos, descripción con capítulos —4.930 de 5.000
  bytes—, 22 etiquetas, comentario fijado y lo que hay que marcar al subir) y `descripcion_youtube.txt` (la descripción sola).

## Qué cuenta (26 escenas, guion v3 en `research/mejores-plataformas/guion.md`)

Arranque (once plataformas reseñadas, incluida Spotify) · las cuatro formas de pagar · **tarifa plana:** Audible (Premium,
Originals con Dolby Atmos, el ordenador; catálogo extendido aparte, Standard, el truco del día 1, 90 días con Prime) y Storytel
(leer y escuchar, «Leer desde aquí», buscar dentro del libro, Family, lo malo) · **por horas:** Podimo, Nextory (las horas se
guardan), BookBeat y Spotify (la app real: 12 h con Premium, no se acumulan, solo el titular, Audiolibros+) · **créditos y tus
archivos:** Audiobooks.com (y cambiar el buscador a español) y ElevenReader · **gratis:** eBiblio (y el truco de «Títulos
disponibles»), LibriVox (con 5,5 s de la voz real de Omar leyendo a Bécquer) y El Libro Total · **los 5 trucos** (acelerar no
ahorra horas, cuándo cancelar, web y no app, encadenar pruebas, busca tu libro antes de pagar) · **¿cuál te conviene?** y lo
gratis · cierre (las once reseñas, el artículo y SonorBooks).

## Cómo se hizo

- **Remotion** (`video/src/scenes/mp/`, composición `MPGuide`), con las tomas reales de las reseñas de cada plataforma (sin datos
  personales; en Spotify, las tomas de su reseña con lo personal ya tapado y comprobado con OCR).
- **Voz:** ElevenLabs, «Martin Osborne», `eleven_v4`, velocidad 1,13 (unos 7.000 caracteres; quedan unos 5.000 créditos hasta el
  3/11). Comprobada con Whisper escena a escena; Z02 regrabada («pagas una cuota y escuchas»).
- **Música:** piezas ya compuestas para el canal (las de la reseña de Nextory y las de la guía de Stephen King), recolocadas por
  bloques con fundidos (`tools/mp_music.py` → `video/public/music/mp_bed.mp3`), sin gastar créditos.
- **Render:** a 2560×1440 por tramos de 2.000 fotogramas (`tools/render_chunks.sh`, ahora con tramos atómicos y `LIMIT=N` para
  lotes) y máster a −14 LUFS (`tools/master.sh`).
- **Control de calidad:** `tools/qa_frames.py` en los 13 tramos: ningún fotograma con fallo · hojas de fotogramas del máster (dos
  por escena) · Whisper sobre la mezcla final (`tools/qa_mix.py`, resultado abajo) · sonoridad −14,2 LUFS y pico −1,8 dBFS.

## Decisiones

- **Once plataformas reseñadas.** Desde el 15/10 Spotify tiene reseña (rama `resena-spotify`), así que el vídeo ya no la trata
  como «sin reseña» y su escena usa la app. Kobo Plus fuera: sin reseña, y su web y su prueba no se pudieron comprobar.
- No es un ranking: «cuál te conviene» según cómo escuches, agrupando por forma de pago (tarifa plana, horas, créditos, gratis).
- Dato que ordena los trucos: en las de horas (Podimo, Nextory, BookBeat, Spotify) se descuenta lo que dura el libro; acelerar no
  ahorra horas. En Audible y Storytel no hay reloj.
- Lleva enlaces de afiliado en la descripción → «Incluye promoción pagada». Sin venta agresiva; la voz no dice «busca en
  SonorBooks si tu libro está en Storytel/BookBeat/Spotify».
- En «busca tu libro» se usa la ficha de *La mala hija* (Audible, Podimo, Nextory), no la de *Los tres mundos*: en sonorbooks.com
  esa ficha muestra Audible con «0 € · 30 días» aunque el libro es del catálogo extendido y se paga aparte (avisado a Joan; las
  condiciones las lleva él).

## Listo para publicar

- **Máster:** rama `mejores-plataformas` de `joanmmmn/kkkkki`, `deliverables/mejores-plataformas/SonorBooks_MejoresPlataformas_1440p.mp4`
  (Git LFS). Descarga directa:
  https://media.githubusercontent.com/media/joanmmmn/kkkkki/mejores-plataformas/deliverables/mejores-plataformas/SonorBooks_MejoresPlataformas_1440p.mp4
- **Canal:** SonorBooks España. **Lista:** «Reseñas de Plataformas de Audiolibros». **Idioma:** español (España).
- **Título, descripción, etiquetas y comentario fijado:** `youtube.md`. **Miniatura:** `miniatura_A.png` (B para «Probar y
  comparar»). **Subtítulos:** `mejores_plataformas.es.srt`.
- **«Incluye promoción pagada»: SÍ** (enlaces de afiliado de Audible, Nextory, Podimo, ElevenReader y Audiobooks.com).
- **Pantalla final:** los últimos 7,8 s (desde 8:28,5: el buscador de SonorBooks en el centro y la marca arriba); las esquinas
  de abajo quedan libres para «vídeo» (la lista de reseñas) y «suscribirse».
- **Antes de subirlo:**
  1. **La reseña de Spotify** tiene que estar publicada: la voz dice «Las once tienen su reseña en el canal». Con su ID,
     `python3 tools/mp_youtube.py --spotify ID` la añade a la lista de reseñas de la descripción (cabe: 4.971 bytes).
  2. **El artículo** https://sonorbooks.com/es/blog/mejores-plataformas-audiolibros/ (`web/mejores-plataformas`, ya con las once
     y el enlace a la reseña de Spotify) tiene que estar publicado: es el primer enlace de la descripción y del comentario
     fijado. Al subir el vídeo: `python3 web/mejores-plataformas/build.py --yt ID --yt-fecha AAAA-MM-DD`.
  3. Las fichas de las reseñas que enlaza la página y que aún dan 404 (BookBeat, eBiblio, Spotify) conviene publicarlas antes.
- **Aprobación de Joan:** pendiente.
