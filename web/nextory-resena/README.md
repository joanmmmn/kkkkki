# Reseña de Nextory — página nueva para sonorbooks.com

Sustituye a la página actual **https://sonorbooks.com/es/blog/nextory-resena/** (misma URL, mismo canonical).
Es la reseña que acompaña al vídeo de YouTube: el vídeo la menciona («la reseña completa por escrito») y la descripción enlaza aquí.
Tiene el mismo estilo y el mismo sistema visual que la nueva reseña de ElevenReader (`web/elevenreader-resena`, rama `tutorial-elevenreader`).

**No está publicada.** Antes de subirla a producción tiene que aprobarla Joan.

## Qué lleva

- Portada con dos móviles con capturas reales de la app (leyendo y escuchando *Juan Martín el Empecinado*, de Galdós) y un interruptor
  «Leer / Escuchar» que los alterna (solo en automático mientras se ve; con `prefers-reduced-motion`, nunca).
- Veredicto rápido (8/10) con el botón «Probar gratis» (el 14 tachado y 30 días) y barra de progreso de lectura.
- Secciones a todo el ancho, como la de ElevenReader: título grande a la izquierda y texto a la derecha (en el móvil, uno debajo del otro).
- Vídeo (se carga solo al pulsar, con youtube-nocookie), qué es, catálogo (con Planeta y los tres casos de formato: ebook,
  audiolibro o los dos) y la app por dentro (portada, El Librarian, buscador por narrador, ficha).
- **Probador del lector**: fondo blanco, gris u oscuro, cuatro tipografías, tamaño, márgenes y marcapáginas con el aviso de la app,
  sobre un fragmento de Galdós (dominio público).
- **Probador del reproductor** (sin audio): velocidad de 0,4x a 2x con la cuenta de horas de la app («a 2x, cada hora cuenta doble»)
  y el temporizador (15 min, 40 min, fin del capítulo).
- Sin conexión, perfiles y modo infantil con PIN.
- Precios (Mini, Standard, Unlimited), **calculador «¿Qué plan te encaja?»** (horas al mes y perfiles a la vez), las cinco reglas de
  cómo cuenta Nextory las horas (con la captura de la app) y la oferta con **las condiciones de la web copiadas tal cual**.
- Dispositivos (sí y no) y enlace a nuestra reseña de ElevenReader para escuchar PDF propios.
- Lo mejor y lo peor, para quién es, calendario de 14 a 30 días, los 5 pasos de la prueba con la tarjeta fija de la oferta,
  quedarse o cancelar (mejor en los días 27–29: al cancelar en la prueba se pierde el acceso al momento), nota por apartados
  y «Cómo lo probamos» en letra pequeña con las fuentes y el aviso de afiliado. Sin preguntas frecuentes (igual que ElevenReader).
- «Alternativas y guías relacionadas»: el mismo carrusel que ElevenReader, con la reseña de ElevenReader en primer lugar.
- Datos estructurados: `Review` (8/10, con puntos positivos y negativos) y `BreadcrumbList`.

Sin dependencias externas, sin cookies ni almacenamiento en el navegador. Todo se ve sin JavaScript (los probadores y el calculador
muestran un estado de ejemplo); con `prefers-reduced-motion` no hay animaciones. Los enlaces de la oferta usan la ruta de afiliado
del sitio (`/salir/nextory/?market=ES&language=es&to=https%3A%2F%2Fnextory.com%2Fes`) con los mismos atributos `data-platform`
que la tarjeta de Nextory de la portada.

## Archivos

```
src/page.html        plantilla completa de la página (cabecera y pie del sitio se insertan al construir)
src/nx-resena.css    estilos propios (todo con prefijo .nx / nx-, no toca el resto del sitio)
src/nx-resena.js     interacciones (módulo ES, sin librerías)
src/movil.html       visor para revisar la versión móvil (un teléfono con la página dentro); no va a producción
media/               capturas de la app (.webp, de las grabaciones del 11/10/2026: tools/web_nx_media.py), miniatura del vídeo,
                     imagen para redes (og) y la tarjeta de la reseña de ElevenReader (dibujo propio con el estilo del blog)
site/                cabecera, pie y estilos del sitio copiados de la página actual (solo para construir)
build.py             genera dist/ (producción), preview/ (vista previa privada) y preview-movil/ (visor del móvil)
```

`python3 web/nextory-resena/build.py` genera:

```
dist/es/blog/nextory-resena/index.html          la página
dist/assets/resenas/nextory/nx-resena.css
dist/assets/resenas/nextory/nx-resena.js
dist/assets/resenas/nextory/media/…              imágenes
```

Para volver a sacar las capturas de las grabaciones: `python3 tools/web_nx_media.py` (necesita `video/public/nxr/rec/`).

## Cómo integrarla (instrucciones para Codex)

1. Copia `dist/assets/resenas/nextory/` a la carpeta pública del sitio para que se sirva en `/assets/resenas/nextory/`.
2. Haz que la ruta `/es/blog/nextory-resena/` sirva `dist/es/blog/nextory-resena/index.html` en lugar del artículo generado.
   Si el blog se genera desde datos, crea una plantilla propia para este slug con el `<main>` de la página y conserva
   la cabecera, el pie y los scripts del sitio (`chrome.mjs`, `provider-routing.mjs`, `cookie-notice.mjs`).
3. Las hojas y módulos del sitio están enlazados con los `?v=` de la reseña de ElevenReader; si han cambiado, usa los del helper del sitio.
4. Mantén en el sitemap y en el índice del blog la misma URL; actualiza la fecha de modificación (12/10/2026) y, si quieres,
   la imagen de portada (`media/nextory-resena-og.jpg`, 1200×630). Si el artículo actual tenía otra fecha de publicación, consérvala
   en `datePublished` (en `build.py`) y en `article:published_time`.
   En el índice del blog, la tarjeta de esta reseña dice «Nextory: planes, horas, precio y opiniones»: cambia el título y la
   entradilla para que coincidan con la nueva página («Nextory: opiniones, precio y 30 días gratis»).
5. Cuando el vídeo esté publicado: `python3 build.py --yt ID_DEL_VIDEO` (o pon el ID en `data-yt` del enlace `.nx-video`).
   Si quieres, añade entonces un `VideoObject` al JSON-LD.
6. La reseña de ElevenReader debe publicarse antes o a la vez: esta página enlaza a `/es/blog/elevenreader-resena/` (sección de
   dispositivos, «Para quién» y carrusel).

## Decisiones pendientes de Joan

- **Condiciones de la oferta**: están copiadas tal cual de la tarjeta de Nextory de SonorBooks y dicen «Después, desde 7,99 €/mes
  según el plan elegido». Pero en el alta de la prueba el plan Mini aparece a 5,99 €/mes, así que «desde 7,99 €» no cuadra con
  el Mini. No se ha tocado (es texto de la plataforma en SonorBooks); si se corrige en la web, cámbialo también en `src/page.html`.
- **Nota 8/10 y apartados** (catálogo 8,5 · lector y reproductor 8,5 · perfiles 9 · precio y horas 7,5 · dispositivos 6,5):
  es una propuesta basada en la prueba del 11 y 12/10/2026 con la cuenta Unlimited en periodo de prueba.
- **Capturas de la app**: son fotogramas de nuestras grabaciones (sin datos personales; en la ficha se difumina la reseña de otra
  lectora). Llevan portadas de libros del catálogo, como cualquier reseña de la app.
- **Aviso de afiliado junto al botón del veredicto**: igual que en ElevenReader, una línea mínima («Enlace de afiliado, sin coste
  para ti»), porque el análisis legal del proyecto recomienda el aviso en el punto de clic.
- Los precios y datos de la app son los del 11/10/2026; si cambian, se editan en `src/page.html` (y en el JSON-LD de `build.py`).
