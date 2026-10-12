# Reseña de Podimo — página nueva para sonorbooks.com

Sustituye a la página actual **https://sonorbooks.com/es/blog/podimo-resena/** (misma URL, mismo canonical).
Es la reseña que acompaña al vídeo de YouTube «¿Merece la pena Podimo?»: el vídeo la menciona («la reseña completa por escrito») y
la descripción enlaza aquí. Usa el mismo sistema que la reseña de Nextory (`web/nextory-resena`), con identidad propia: el lila de
Podimo y otros módulos.

**No está publicada.** Antes de subirla a producción tiene que aprobarla Joan.

## Qué lleva

Responde en el cuerpo, sin preguntas frecuentes, a lo que se busca de Podimo en España: «opiniones», «¿merece la pena?», «qué es»,
«precio / planes», «gratis / 30 días», «cómo cancelar», «horas», «pódcasts exclusivos», «audiolibros / catálogo», «dispositivos»
y «Podimo vs Storytel / Nextory / Audible / Spotify». Título SEO: «Podimo: opiniones, precio y 30 días gratis (2026)».

La idea visual de toda la página: **lo que se mide en horas va en tramos y lo que no tiene límite, en un trazo continuo**.

- **Portada**: el móvil con capturas reales dentro del reloj de horas de la app. Un interruptor «Pódcasts / Audiolibros» cambia la
  captura y el aro: continuo para los pódcasts («Sin límite») y en 20 tramos para los audiolibros, con el reloj de la app
  («19:59:43, te quedan de 20 h») corriendo como en el reproductor. Alterna solo mientras se ve; se para con el ratón encima o el
  foco dentro, al pulsar el interruptor y del todo tras tres vueltas. Con `prefers-reduced-motion`, nada se mueve.
- Veredicto rápido (7,5/10, en una barra de 10 tramos) con el botón «Probar 30 días gratis» y el aviso de afiliado debajo.
- Cuerpo en una columna de lectura, con los módulos a lo ancho. Sin índice lateral, sin etiquetas sobre los títulos, sin capítulos
  del vídeo y sin firma ni botones en la portada.
- Vídeo (se carga solo al pulsar, con youtube-nocookie) y qué es Podimo, con el primer arranque en tres capturas.
- **Pódcasts exclusivos**: un cartel «Solo en Podimo» con doce programas (de podimo.com/es/shows) y el Ondas de *Entre el cielo y las
  nubes*.
- Audiolibros (buscador y ficha) y el reproductor, con capturas.
- **Precio**: Free, Premium y Premium Plus, cada uno con su barra de horas (tramos de 10 h), el precio anual y cuatro datos rápidos.
- **Horas**: las cuatro reglas (día 1, no se acumulan, cuentan horas de audiolibro, los pódcasts no gastan) con nuestra prueba a 2x y
  el **calculador «¿Cuántas horas necesitas?»**: horas al mes y velocidad (1x, 1,25x, 1,5x, 2x) → horas del reloj, cómo quedan
  Premium (20 h) y Premium Plus (100 h), qué plan encaja, hacia qué día se acabarían las horas y cuándo conviene una tarifa sin límite.
- Dispositivos (sí y todavía no) y **opiniones**: las dos notas (App Store 4,8 y Trustpilot 1,9) en la misma regla de 1 a 5.
- **Podimo vs Storytel, Nextory, Audible y Spotify**: tabla en el ordenador y fichas en el móvil, con enlaces a las reseñas.
- Lo mejor y lo peor (de aquí salen las notas del JSON-LD).
- **Cómo probarlo 30 días**: tres pasos, la tarjeta de la oferta con **las condiciones de la web copiadas tal cual** y la
  **línea de los 31 días** (día 1, días 28–29, día 30, renovación el 31) con un selector «¿Qué día empiezas la prueba?» que
  calcula las fechas. Otras formas gratis: la invitación «Regala 60 días» (vista en la app, no probada) y Podimo Free.
- **Cómo cancelar**: pestañas App / Web / Google Play / App Store (tabulador itinerante y flechas) con la ruta de cada una, las tres
  reglas (en la prueba se pierde el acceso al momento, como muy tarde el día antes, sin reembolsos) y la captura de «Su membresía».
- Nota final (7,5) por apartados, para quién sí y para quién no, y «Cómo lo probamos» en letra pequeña con las fuentes y el aviso de
  afiliado.
- «Alternativas y guías relacionadas»: el carrusel de Nextory, empezando por las reseñas de Nextory, Storytel y Audible.
- Datos estructurados: `Review` (la nota y los puntos se leen de la página al construir), `BreadcrumbList` (Inicio › Blog › Reseña de
  Podimo) y, con `--yt`, `VideoObject`.

Sin dependencias externas, sin cookies ni almacenamiento en el navegador. Todo se ve sin JavaScript: la portada con la captura de los
pódcasts (sin interruptor), el calculador con el ejemplo de 10 h a 1x (controles desactivados), la línea de la prueba con las fechas de
nuestra cuenta y las cuatro rutas para cancelar, una debajo de otra. Los enlaces de la oferta usan la ruta de afiliado del sitio
(`/salir/podimo/?market=ES&language=es&to=https%3A%2F%2Fpodimo.com%2Fes`) con los mismos atributos `data-platform` que la tarjeta de
Podimo de la portada.

## Archivos

```
src/page.html        plantilla completa de la página (cabecera y pie del sitio se insertan al construir)
src/pd-resena.css    estilos propios (todo con prefijo .pd / pd-, no toca el resto del sitio ni la reseña de Nextory)
src/pd-resena.js     interacciones (módulo ES, sin librerías)
src/movil.html       visor para revisar la versión móvil (un teléfono con la página dentro); no va a producción
media/               capturas de la app (.webp, de las tomas del 12/10/2026), imagen para redes (og), póster del vídeo (su
                     miniatura real) y la tarjeta de la reseña de ElevenReader (la misma de la reseña de Nextory).
                     Al construir solo se copian las imágenes que usa la página.
site/                cabecera, pie y estilos del sitio (los mismos que la reseña de Nextory) e imágenes del carrusel para la vista previa
build.py             genera dist/ (producción), preview/ (vista previa privada) y preview-movil/ (visor del móvil)
```

`python3 web/podimo-resena/build.py` genera:

```
dist/es/blog/podimo-resena/index.html          la página
dist/assets/resenas/podimo/pd-resena.css
dist/assets/resenas/podimo/pd-resena.js
dist/assets/resenas/podimo/media/…              imágenes
```

Para volver a sacar las capturas: `python3 tools/web_pd_media.py` (necesita `video/public/pdr/rec/`; solo usa las tomas, nunca la
grabación original, y difumina la inicial de la cuenta). La imagen para redes y el póster del vídeo: `node tools/web_pd_og.mjs` (el póster sale de la miniatura real,
`deliverables/podimo/resena/miniatura_resena.png`).

## Cómo integrarla (instrucciones para Codex)

1. Copia `dist/assets/resenas/podimo/` a la carpeta pública del sitio para que se sirva en `/assets/resenas/podimo/`.
2. Haz que la ruta `/es/blog/podimo-resena/` sirva `dist/es/blog/podimo-resena/index.html` en lugar del artículo generado.
   Si el blog se genera desde datos, crea una plantilla propia para este slug con el `<main>` de la página y conserva
   la cabecera, el pie y los scripts del sitio (`chrome.mjs`, `provider-routing.mjs`, `cookie-notice.mjs`).
3. Las hojas y módulos del sitio están enlazados con los `?v=` de la reseña de Nextory; si han cambiado, usa los del helper del sitio.
4. Mantén en el sitemap y en el índice del blog la misma URL. El artículo actual se publicó el 1/10/2026: esa fecha se conserva en
   `datePublished` y `article:published_time`; la de modificación (13/10/2026, `MODIFICADA` en `build.py` y `article:modified_time`
   en `src/page.html`) cámbiala al día en que se publique. En el índice del blog, la tarjeta dice «Podimo: precio, horas de
   audiolibros y opiniones»: cambia el título y la entradilla para que coincidan con la página nueva («Podimo: opiniones, precio y
   30 días gratis») y, si quieres, la imagen (`media/podimo-resena-og.jpg`, 1200×630).
5. Publica la página con el vídeo ya subido: `python3 web/podimo-resena/build.py --yt ID_DEL_VIDEO --yt-fecha AAAA-MM-DD`.
   Así el enlace del vídeo apunta al vídeo (sin `--yt` apunta al canal de YouTube) y el JSON-LD lleva el `VideoObject`
   (duración 4:01, la del montaje según `tools/pdr_meta.py`; hora de España). El script avisa si se construye sin `--yt`.
6. El póster del vídeo (`media/podimo-resena-video.webp`, 1280×720) ya es la miniatura real del vídeo: si cambias la miniatura en
   YouTube, cámbialo también.
7. La reseña nueva de Nextory debería publicarse antes o a la vez: el carrusel la anuncia como «Nextory: opiniones, precio y 30 días
   gratis». Si no, cambia ese título en `src/page.html`.

## Decisiones pendientes de Joan

- **Nota 7,5 y apartados** (pódcasts exclusivos 9 · audiolibros y catálogo 7 · app y reproductor 8 · precio y horas 7 · dispositivos 7,5 ·
  prueba y cancelación 6,5): propuesta basada en la prueba del 12/10/2026 con una cuenta Premium en periodo de prueba.
- **Condiciones de la oferta**: copiadas tal cual de la tarjeta de Podimo de SonorBooks, con «Oferta sujeta a elegibilidad.» (como en la
  comparativa de plataformas y en las fichas). Es la misma prueba de 30 días que la estándar de Podimo, así que la página nunca dice
  «en vez de».
- **Invitación «Regala 60 días»**: se menciona como otra forma de probarlo, con lo que dice la pantalla de la app y «no lo hemos
  probado». Si no se quiere mencionar, borra ese bloque de «Otras formas de escuchar Podimo gratis».
- **Fechas de la prueba**: la línea toma la renovación a los 30 días del alta (como en nuestra cuenta: alta el 12/10, renovación el
  11/11) y la regla de la ayuda de Podimo (cancelar, como muy tarde, el día antes de que acabe la prueba). El vídeo dice «cancela
  antes del día 30; mejor en los últimos días»: la página recomienda los días 28–29.
- **Rutas de Google Play y App Store**: son las genéricas de cada tienda (la ayuda de Podimo solo dice «en su tienda»).
- **Comparativa**: los datos de Storytel, Nextory y Audible son los de la reseña de Nextory (12/10/2026) y los de Spotify, de Xataka
  (7/10/2026). Si cambian, se editan en `src/page.html`.
- **Capturas**: fotogramas de nuestras tomas (sin datos personales: los comentarios de otros oyentes ya venían difuminados y aquí se
  difumina también la inicial de la cuenta). Llevan portadas de pódcasts y libros del catálogo, como cualquier reseña de la app.
- **Imagen para redes y póster**: la imagen para redes es una composición propia con el estilo de las miniaturas (logotipo de Podimo,
  «¿Merece la pena?», el móvil con la portada de la app, «20 h al mes» y «30 días gratis»); el póster del vídeo es su miniatura real.
