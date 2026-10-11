# Reseña de ElevenReader — página nueva para sonorbooks.com

Sustituye a la página actual **https://sonorbooks.com/es/blog/elevenreader-resena/** (misma URL, mismo canonical).
Es la reseña que acompaña al vídeo de YouTube: el vídeo y la descripción enlazan aquí.

**No está publicada.** Antes de subirla a producción tiene que aprobarla Joan.

## Qué lleva

- Portada con un lector que se escucha: el párrafo de «El rayo de luna» se resalta palabra a palabra con la voz de Sara Martin grabada en la app.
- Veredicto rápido (8/10) con el botón «Probar gratis» (el 3 tachado y 30 días) y barra de progreso de lectura.
- Secciones a todo el ancho: título grande a la izquierda y texto a la derecha (en el móvil, uno debajo del otro).
- Vídeo (se carga solo al pulsar, con youtube-nocookie), catálogo con las etiquetas de precio, búsqueda de 6 superventas.
- Subida del PDF animada y comparación del PDF original con lo que lee la voz.
- Brian frente a Sara Martin con audio, forma de onda y resaltado sincronizado.
- Probador de las opciones del lector: tema, color del resaltado (colores reales de la app), tamaño y velocidad,
  y el menú de los tres puntos de un documento recreado con sus opciones.
- Precios mensual/anual, la factura que nos mostró la app (11,31 $/mes) y la oferta con **las condiciones de la web copiadas tal cual**.
- Calendario de 3 a 30 días y los 5 pasos (el primero dice dónde está el botón: la última tarjeta de las plataformas en la
  página de inicio, o cualquier botón de la oferta de la reseña), con una tarjeta fija de la oferta al lado.
- Quedarse o cancelar (web, iPhone, Android), nota por apartados y, al final, «Cómo lo probamos» en letra pequeña con las
  fuentes y el aviso de afiliado (sin preguntas frecuentes, por decisión de Joan).
- «Alternativas y guías relacionadas»: carrusel deslizable con 9 artículos del blog (comparativas, guías y reseñas), con
  flechas y arrastre en el ordenador, y deslizable con el dedo en el móvil. Usa las imágenes del blog (`/assets/blog/editorial/`).
- SEO (12/10/2026): título «ElevenReader: opiniones, precio y 30 días gratis (2026)» y títulos de sección con las búsquedas
  habituales (qué es, precio, opiniones, cancelar, gratis).
- Datos estructurados: `Review` (8/10, con puntos positivos y negativos), `BreadcrumbList` y `FAQPage`.

Sin dependencias externas, sin cookies ni almacenamiento en el navegador. Todo se ve sin JavaScript; con
`prefers-reduced-motion` no hay animaciones. Los enlaces de la oferta usan la ruta de afiliado del sitio
(`/salir/elevenreader/?market=ES&language=es&to=…`) con los mismos atributos `data-platform` que la portada.

## Archivos

```
src/page.html        plantilla completa de la página (cabecera y pie del sitio se insertan al construir)
src/er-resena.css    estilos propios (todo con prefijo .er / er-, no toca el resto del sitio)
src/er-resena.js     interacciones (módulo ES, sin librerías)
src/movil.html       visor para revisar la versión móvil (un teléfono con la página dentro); no va a producción
media/               capturas (.webp), miniatura del vídeo y imagen para redes (og)
media/audio/         3 fragmentos de la app en mp3 + tiempos de cada palabra (fuera de git)
site/                cabecera, pie y estilos del sitio copiados de la página actual (solo para construir)
build.py             genera dist/ (producción), preview/ (vista previa privada) y preview-movil/ (visor del móvil)

```

`python3 web/elevenreader-resena/build.py` genera:

```
dist/es/blog/elevenreader-resena/index.html          la página
dist/assets/resenas/elevenreader/er-resena.css
dist/assets/resenas/elevenreader/er-resena.js
dist/assets/resenas/elevenreader/media/…              imágenes y audio
```

## Cómo integrarla (instrucciones para Codex)

1. Copia `dist/assets/resenas/elevenreader/` a la carpeta pública del sitio para que se sirva en `/assets/resenas/elevenreader/`.
2. Haz que la ruta `/es/blog/elevenreader-resena/` sirva `dist/es/blog/elevenreader-resena/index.html` en lugar del artículo generado.
   Si el blog se genera desde datos, crea una plantilla propia para este slug con el `<main>` de la página y conserva
   la cabecera, el pie y los scripts del sitio (`chrome.mjs`, `provider-routing.mjs`, `cookie-notice.mjs`).
3. Las hojas y módulos del sitio están enlazados con los `?v=` de hoy; si han cambiado, usa los del helper del sitio.
4. Mantén en el sitemap y en el índice del blog la misma URL; actualiza la fecha de modificación (12/10/2026) y la imagen de portada si quieres usar la nueva (`media/elevenreader-resena-og.jpg`, 1200×630).
   En el índice del blog, la tarjeta de esta reseña aún dice «ElevenReader: qué es gratis, planes y audiolibros»: cambia el título
   y la entradilla para que coincidan con la nueva página.
5. Cuando el vídeo esté publicado: `python3 build.py --yt ID_DEL_VIDEO` (o pon el ID en `data-yt` del enlace `.er-video`).
   Si quieres, añade entonces un `VideoObject` al JSON-LD.

## Decisiones pendientes de Joan

- **Audio de la app**: los tres mp3 son fragmentos grabados en ElevenReader durante la prueba (el mismo uso de reseña que en el vídeo).
  Si prefieres no publicarlos en la web, se quitan los reproductores o se sustituyen por muestras propias.
- **Nota 8/10 y textos de opinión**: se basan en la prueba del 11/10/2026 con la cuenta Ultra en periodo de prueba.
- Las condiciones de la oferta y los precios están copiados de la web y de lo que mostró la app ese día; si cambian, se editan en `src/page.html`.
- **Aviso de afiliado junto al botón del veredicto**: se ha dejado una línea mínima («Enlace de afiliado, sin coste para ti»)
  porque el análisis legal del proyecto recomienda el aviso en el punto de clic. Si se prefiere sin ella, se quita en `src/page.html`.
