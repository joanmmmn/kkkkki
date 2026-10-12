# Reseña y guía de LibriVox — página nueva para sonorbooks.com

Sustituye a la página actual **https://sonorbooks.com/es/blog/librivox-resena/** (misma URL, mismo canonical).
Es la página que acompaña al vídeo de YouTube: el vídeo y su descripción enlazan aquí. Mismo sistema y estilo que la
reseña de ElevenReader (`web/elevenreader-resena`), con sus propios estilos (`lv-`).

**No está publicada.** Antes de subirla a producción tiene que aprobarla Joan.

## Qué lleva

- Portada con una página de libro que se lee sola: «El rayo de luna» con la voz real de **Omar, voluntario de LibriVox**
  (dominio público), resaltada palabra a palabra. Es el mismo párrafo que en la reseña de ElevenReader, ahora con voz humana.
- Veredicto rápido (7,5/10) con el botón «Escuchar gratis» (ruta de salida del sitio hacia librivox.org).
- Vídeo (se carga solo al pulsar, con youtube-nocookie).
- Qué es: cifras (2005, +21.000 audiolibros, +132.000 h, +14.000 voluntarios), tres claves y el aviso con el que empieza cada
  grabación, con su audio.
- ¿Es legal?: la línea de los 95 años (EE. UU.) y **España** (80/70 años tras la muerte del autor; 20 de los 564 audiolibros
  en español aún tienen derechos aquí, con ejemplos y el año en que quedan libres).
- Catálogo: idiomas (el español es el 4.º), autores con más títulos y una estantería de 9 clásicos con portada, duración y
  número de voces que enlaza a cada ficha de LibriVox.
- Cómo buscar en español: pasos numerados con capturas marcadas (por idioma y con el buscador).
- La ficha de un libro (las *Leyendas*): captura con 8 zonas numeradas y su explicación, y qué formato conviene.
- En el móvil: pestañas (app de pódcasts con RSS, descarga, otras apps, navegador), botón para copiar el RSS de las
  *Leyendas* y una app de pódcasts recreada.
- Las voces: tres voluntarios de las *Leyendas* con audio, onda y resaltado (Elena del Valle, Vicente Cepeda, Rosacarmela).
- Voluntariado: 5 pasos con la línea que avanza al hacer scroll, lo que hace falta y la captura del foro.
- Lo mejor y lo peor, para quién es, nota por apartados y la ficha de LibriVox de SonorBooks con **las condiciones de la web
  copiadas tal cual** (texto de Joan).
- «Cómo lo probamos» en letra pequeña, con fuentes; carrusel de 9 artículos relacionados; barra fija «Escuchar gratis».
- SEO: título «LibriVox: audiolibros gratis en español y cómo usarlo (2026)»; datos estructurados `Review` (7,5/10) y
  `BreadcrumbList`, y `VideoObject` cuando se construye con el ID del vídeo. Sin preguntas frecuentes (como en ElevenReader).

Sin dependencias externas, sin cookies ni almacenamiento en el navegador. Todo se ve sin JavaScript; con
`prefers-reduced-motion` no hay animaciones. Los enlaces a LibriVox usan la ruta de salida del sitio
(`/salir/librivox/?market=ES&language=es&to=…`, también para cada ficha de la estantería) con los atributos
`data-platform="librivox"` de la portada. **No son enlaces de afiliado** (`rel="noopener noreferrer"`, sin `sponsored`).

## Archivos

```
src/page.html        plantilla completa (cabecera y pie del sitio se insertan al construir); {{LV:url}} = salida a una ficha
src/lv-resena.css    estilos propios (todo con prefijo .lv / lv-, no toca el resto del sitio)
src/lv-resena.js     interacciones (módulo ES, sin librerías)
src/movil.html       visor para revisar la versión móvil; no va a producción
media/               capturas marcadas (.webp), portadas de los libros, miniatura del vídeo e imagen para redes (og)
media/audio/         5 fragmentos de LibriVox (dominio público) en mp3 + tiempos de cada palabra (timings.json)
site/                cabecera, pie y estilos del sitio (los mismos que la reseña de ElevenReader)
build.py             genera dist/ (producción), preview/ (vista previa) y preview-movil/ (visor del móvil)
```

Las imágenes y los audios se regeneran con `tools/web_lv_media.py` (capturas de `captures/librivox/web`) y
`tools/web_lv_audio.py` (grabaciones de `captures/librivox/audio`, fuera de git por tamaño, con transcripción de
ElevenLabs Scribe: `tools/stt.py`).

`python3 web/librivox-resena/build.py` genera:

```
dist/es/blog/librivox-resena/index.html          la página
dist/assets/resenas/librivox/lv-resena.css
dist/assets/resenas/librivox/lv-resena.js
dist/assets/resenas/librivox/media/…              imágenes, portadas y audio
```

## Cómo integrarla (instrucciones para Codex)

1. Copia `dist/assets/resenas/librivox/` a la carpeta pública del sitio para que se sirva en `/assets/resenas/librivox/`.
2. Haz que la ruta `/es/blog/librivox-resena/` sirva `dist/es/blog/librivox-resena/index.html` en lugar del artículo generado.
   Si el blog se genera desde datos, crea una plantilla propia para este slug con el `<main>` de la página y conserva
   la cabecera, el pie y los scripts del sitio (`chrome.mjs`, `provider-routing.mjs`, `cookie-notice.mjs`).
3. Las hojas y módulos del sitio están enlazados con los `?v=` de la página de ElevenReader; si han cambiado, usa los del helper del sitio.
4. Comprueba que `/salir/librivox/` acepta un `to` con una ficha concreta de librivox.org (la estantería enlaza a 9 fichas);
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
