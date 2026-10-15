# Vídeo «Las mejores plataformas de audiolibros en español» (SonorBooks España)

Encargo de Joan (15/10/2026, 10:28): con todo el material de las reseñas de cada plataforma, un vídeo definitivo de máxima calidad
sobre las mejores plataformas de audiolibros en español: lo más relevante de cada una, trucos, funcionalidades y lo mejor de lo mejor.

## Estado (15/10/2026, 14:45)

- **Hecho:** guion v2 con revisión independiente de datos (`research/mejores-plataformas/guion.md`), las 26 escenas en Remotion
  (`video/src/scenes/mp/`, composición `MPGuide`), capturas nuevas de la web pública de Spotify, miniaturas A y B (`MPThumbA`,
  `MPThumbB`), herramientas de subtítulos y capítulos (`tools/mp_meta.py`), textos de YouTube (`tools/mp_youtube.py` →
  `youtube.md` y `descripcion_youtube.txt`), planes de música (`tools/mp_music.py`) y la página del blog
  (`web/mejores-plataformas/`, para /es/blog/mejores-plataformas-audiolibros/; sin publicar).
- **Falta:** la locución (ElevenLabs, voz Martin Osborne, `eleven_v4`, velocidad 1,13; unos 8.000 caracteres). Joan tiene que
  dar una clave de API: se guarda en `.secrets/elevenlabs.env` (ignorado por git).
- **Después:** `tools/mp_build.sh audio` (voz, música en 7 piezas, subtítulos, textos), revisar fotogramas y la mezcla, y
  `tools/mp_build.sh render` (2560×1440 por tramos, unas 4–5 h en este contenedor de 2 núcleos; -14 LUFS).

## Decisiones

- Diez plataformas reseñadas + Spotify (sin reseña; solo su web pública). Kobo Plus fuera: sin reseña, y su web y su prueba no
  se pudieron comprobar el 15/10.
- No es un ranking: «cuál te conviene» según cómo escuches, agrupando por forma de pago (tarifa plana, horas, créditos, gratis).
- Dato que ordena los trucos: en las de horas (Podimo, Nextory, BookBeat, Spotify) se descuenta lo que dura el libro; acelerar no
  ahorra horas. En Audible y Storytel no hay reloj.
- Lleva enlaces de afiliado en la descripción → «Incluye promoción pagada». Sin venta agresiva; la voz no dice «busca en
  SonorBooks si tu libro está en Storytel/BookBeat».
- En «busca tu libro» se usa la ficha de *La mala hija* (Audible, Podimo, Nextory), no la de *Los tres mundos*: en sonorbooks.com
  esa ficha muestra Audible con «0 € · 30 días» aunque el libro es del catálogo extendido y se paga aparte (avisado a Joan; las
  condiciones las lleva él).

## Listo para publicar

Pendiente de la locución, el render y la aprobación de Joan. Rama `mejores-plataformas` de `joanmmmn/kkkkki`.
