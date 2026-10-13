# Reseña y guía de LibriVox — página nueva para sonorbooks.com

Sustituye a la página actual **https://sonorbooks.com/es/blog/librivox-resena/** (misma URL, mismo canonical).
Es la página que acompaña al vídeo de YouTube: el vídeo y su descripción enlazan aquí. Usa el mismo sistema que la reseña
de ElevenReader (`web/elevenreader-resena`): cabecera y pie del sitio, veredicto, nota, ficha de SonorBooks, carrusel y barra
fija. Todo lo demás tiene identidad propia de LibriVox.

**No está publicada.** Antes de subirla a producción tiene que aprobarla Joan.

## Diseño: tres materiales

- **SonorBooks** (Ubuntu, Merriweather, tinta y amarillo): los títulos, las explicaciones, los botones del sitio y nuestras
  marcas sobre LibriVox (recuadro amarillo con borde de tinta, como en las capturas numeradas).
- **LibriVox** (sus colores: azul claro `#d5ebf1`, verde azulado `#2e6d7d`, verde de descarga, papel `#f2f1ee`; letra
  Helvetica/Arial): las recreaciones de su web, con clases `lvx-`. Los verdes y azules de los botones van un punto más oscuros
  que los suyos para que el texto blanco se lea bien.
- **El libro** (EB Garamond sobre papel, incluida en `media/fonts`): los textos que se leen, las fichas de biblioteca y el
  reparto de voces.

## Qué lleva

- **Portada:** la ficha de las *Leyendas* de Bécquer en LibriVox, recreada, con cuatro capítulos que se escuchan con el audio
  real de sus voluntarios (Vicente Cepeda, Elena del Valle, Omar y Rosacarmela). Al pulsar un capítulo, su texto aparece en una
  página de libro y la tinta avanza con la voz. Sin pulsar nada, la primera frase de Omar se «lee» sola, sin sonido. Debajo, una
  caja como la «Thank a reader» de LibriVox. El párrafo de Omar es el mismo que en la reseña de ElevenReader.
- Veredicto rápido (7,5/10) con «Escuchar gratis en LibriVox» (ruta de salida del sitio hacia librivox.org).
- **Cómo funciona, en cuatro pasos:** la respuesta corta para quien busca cómo usar LibriVox (entrar en la web, buscar en
  español, escuchar o descargar y llevarlo al móvil), como un recorrido con cuatro paradas; cada paso enlaza a su apartado.
- **Vídeo:** la guía por capítulos («la biblioteca que habla», 3:59): qué es y cómo funciona, cómo se usa paso a paso, lo que
  conviene saber y si merece la pena. En producción, el de YouTube (se carga al pulsar, con youtube-nocookie). En la vista
  previa se reproduce el propio vídeo, porque aún no está en YouTube.
- **Qué es:** la portada de librivox.org traducida, con sus cifras (14.276 voluntarios; 21.838 audiolibros y 132.392 horas);
  «Ver el catálogo» lleva al apartado de búsqueda y «Ser voluntario», a esa página de LibriVox. Después, el aviso con el que
  empieza cada grabación, que se escucha.
- **Cómo buscar:** tres pasos que se pueden pulsar y un catálogo recreado con once clásicos en español: buscador (sin tildes),
  filtro «Project type» (all, solo, group) y enlaces a cada ficha de LibriVox. Enlaces a las capturas reales.
- **Escuchar y descargar:** la columna de la ficha recreada (Play, título, Whole book, iTunes, RSS, Torrent, Internet Archive y
  M4B): al elegir una opción, el panel de la derecha baja hasta ella y explica qué te da y para qué sirve. Enlace a la captura
  real con las ocho zonas numeradas.
- **En el móvil:** pestañas (app de pódcasts, descarga directa, otras apps, navegador), botón para copiar el RSS de las
  *Leyendas* y un teléfono en el que una app de pódcasts se suscribe sola al RSS (una vez, al llegar; con botón para repetir).
- **¿Es legal?:** la línea de los 95 años (EE. UU.) y **España** (80/70 años tras la muerte del autor): cuatro libros en español
  que aún tienen derechos aquí, como fichas de préstamo de biblioteca con el sello del año en que quedan libres.
- **Catálogo:** «Browse the catalog › Language» recreado con las cifras de LibriVox (el español, cuarto idioma) y la nota
  «¿Buscas un libro concreto?» hacia el buscador de SonorBooks.
- **Las voces:** el reparto completo de las *Leyendas* (11 voluntarios, capítulos y horas de cada uno), con cuatro voces que se
  escuchan, y consejos para elegir.
- Lo mejor y lo peor, para quién es, nota por apartados y la ficha de LibriVox de SonorBooks con **las condiciones de la web
  copiadas tal cual** (texto de Joan).
- «Cómo lo probamos» en letra pequeña, con fuentes; carrusel de 9 artículos relacionados; barra fija «Escuchar gratis».
- SEO, para quien busca cómo funciona y cómo usarlo: título «Cómo usar LibriVox: audiolibros gratis en español (guía 2026)»,
  H1 «LibriVox: qué es y cómo usarlo», los cuatro pasos arriba y el orden del vídeo: primero cómo se usa; después, por qué
  es legal (con el matiz de España) y el catálogo. Datos estructurados `Review` (7,5/10) y `BreadcrumbList`, y `VideoObject` cuando se construye
  con el ID del vídeo. Sin preguntas frecuentes ni índice.
- Movimiento: sin rebotes. Los sellos de las fichas entran con una frenada suave (en todos los tamaños de pantalla) y las
  capturas ampliadas se abren y se cierran con un fundido y un zoom suaves: el fondo se oscurece enseguida y la captura entra
  cuando ya está lista.

Sin dependencias externas, sin cookies ni almacenamiento en el navegador. El contenido está entero en el HTML (sin JavaScript se
ve el texto completo, el primer panel de cada bloque y el catálogo con los once libros); con `prefers-reduced-motion` no hay
animaciones. Solo suena un audio a la vez. Los enlaces a LibriVox usan la ruta de salida del sitio
(`/salir/librivox/?market=ES&language=es&to=…`, también para cada ficha del catálogo) con los atributos `data-platform="librivox"`
de la portada. **No son enlaces de afiliado** (`rel="noopener noreferrer"`, sin `sponsored`).

## Archivos

```
src/page.html        plantilla completa (cabecera y pie del sitio se insertan al construir); {{LV:url}} = salida a una ficha
src/lv-resena.css    estilos propios (prefijos .lv, lv- y lvx-; no tocan el resto del sitio)
src/lv-resena.js     interacciones (módulo ES, sin librerías)
src/movil.html       visor para revisar la versión móvil; no va a producción
media/               capturas marcadas (.webp), portadas de los libros, miniatura del vídeo, imagen para redes (og)
media/audio/         5 fragmentos de LibriVox (dominio público) en mp3 + tiempos de cada palabra (timings.json)
media/fonts/         EB Garamond (normal y cursiva, subconjunto latino, licencia OFL)
site/                cabecera, pie y estilos del sitio (los mismos que la reseña de ElevenReader)
build.py             genera dist/ (producción), preview/ (vista previa) y preview-movil/ (visor del móvil)
```

Las imágenes y los audios se regeneran con `tools/web_lv_media.py` (capturas de `video/public/lv/web`) y
`tools/web_lv_audio.py` (grabaciones de `captures/librivox/audio`, fuera de git por tamaño, con transcripción de
ElevenLabs Scribe: `tools/stt.py`). `build.py` comprueba que cada texto que se lee tiene tantas palabras como tiempos.

`python3 web/librivox-resena/build.py` genera:

```
dist/es/blog/librivox-resena/index.html          la página
dist/assets/resenas/librivox/lv-resena.css
dist/assets/resenas/librivox/lv-resena.js
dist/assets/resenas/librivox/media/…              imágenes, portadas, fuentes y audio
```

La vista previa usa, si existe, `deliverables/librivox/SonorBooks_LibriVox_Guia_web.mp4` (≤ 15 MB) para que el vídeo se vea
dentro de la página; producción no lo necesita.

## Cómo integrarla (instrucciones para Codex)

1. Copia `dist/assets/resenas/librivox/` a la carpeta pública del sitio para que se sirva en `/assets/resenas/librivox/`.
2. Haz que la ruta `/es/blog/librivox-resena/` sirva `dist/es/blog/librivox-resena/index.html` en lugar del artículo generado.
   Si el blog se genera desde datos, crea una plantilla propia para este slug con el `<main>` de la página y conserva
   la cabecera, el pie y los scripts del sitio (`chrome.mjs`, `provider-routing.mjs`, `cookie-notice.mjs`).
3. Las hojas y módulos del sitio están enlazados con los `?v=` de la página de ElevenReader; si han cambiado, usa los del helper del sitio.
4. Comprueba que `/salir/librivox/` acepta un `to` con una ficha concreta de librivox.org (el catálogo enlaza a 11 fichas);
   si solo acepta la portada, cambia `SALIR_TO` en `build.py` o deja esos enlaces directos a librivox.org.
5. Mantén en el sitemap y en el índice del blog la misma URL; actualiza la fecha de modificación (12/10/2026) y la imagen de
   portada si quieres usar la nueva (`media/librivox-resena-og.jpg`, 1200×630). En el índice del blog, la tarjeta aún dice
   «LibriVox en español: audiolibros gratis y descarga»: cambia el título y la entradilla para que coincidan con la página.
6. Cuando el vídeo esté publicado: `python3 build.py --yt ID_DEL_VIDEO --yt-fecha AAAA-MM-DD` (el día en que se publicó).

## Decisiones pendientes de Joan

- **Nota 7,5/10 y textos de opinión**: se basan en la prueba del 12/10/2026 en la web, sin cuenta.
- **España y dominio público**: la página explica la regla general (80/70 años) y da ejemplos; no es asesoramiento legal.
  Las condiciones de la ficha son las de la web, sin cambios.
- **Fecha de publicación**: la página nueva lleva 12/10/2026 como publicación y modificación; si se quiere conservar la
  fecha original de la reseña anterior, cámbiala en `src/page.html` y en `build.py` (datos estructurados).
