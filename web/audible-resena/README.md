# Reseña de Audible — página nueva para sonorbooks.com

Sustituye a la página actual **https://sonorbooks.com/es/blog/audible-resena/** (misma URL, mismo canonical).
Es la reseña que acompaña al vídeo de YouTube «¿Merece la pena Audible?»: el vídeo la menciona («la reseña completa por
escrito») y la descripción enlaza aquí. Usa el mismo sistema que las reseñas de Nextory, Podimo y Storytel
(`web/nextory-resena`, `web/podimo-resena`, `web/storytel-resena`), con identidad propia: el naranja y el azul noche de Audible,
las ondas de su logotipo y la pareja «Incluido» / «Aparte».

**No está publicada.** Antes de subirla a producción tiene que aprobarla Joan.

**Con afiliado.** Audible está en SonorBooks España (Amazon Afiliados): los tres botones de la prueba (veredicto, tarjeta de la
oferta y barra fija) usan la ruta de afiliado del sitio, como la tarjeta de Audible de /es/plataformas/
(`/salir/audible/?market=ES&language=es&to=https%3A%2F%2Fwww.audible.es%2Fep%2Fprueba-gratis`, que hoy redirige a
geni.us/cTTS), con `rel="noopener noreferrer sponsored"` y los atributos `data-platform` del sitio. Las condiciones de la oferta
están **copiadas tal cual de la tarjeta de Audible de SonorBooks** («30 días gratis · Después, 9,99 €/mes» y «Prueba para cuentas
que cumplan las condiciones. Hay títulos de compra adicional.»). El aviso de afiliado está junto a cada botón y, completo, con la
frase de Amazon Afiliados, en «Cómo lo probamos».

## Qué lleva

Responde en el cuerpo, sin preguntas frecuentes, a lo que se busca de Audible en España: «opiniones», «¿merece la pena?», «qué es»,
«precio», «Premium / Standard», «¿qué incluye?», «catálogo extendido», «¿tiene límite de horas?», «Originals», «gratis / 30 días /
Prime», «cómo cancelar», «niños», «dispositivos / ordenador / Alexa» y «Audible vs Storytel / Nextory / Podimo / Kobo / Spotify».
Título SEO: «Audible: opiniones, precio y 30 días gratis (2026)».

La idea visual de toda la página: **las ondas del logotipo de Audible** (tres arcos que se dibujan) y **la pareja «Incluido» /
«Aparte»**: lo que entra en Premium, en naranja y con el botón de play, frente al catálogo extendido, en azul noche y con la
etiqueta de precio. Es la letra pequeña que más pesa en Audible y vuelve en la portada, el precio, el catálogo y el veredicto.

- **Portada**: el móvil entre las ondas con capturas reales. Un interruptor «Incluido / Se paga aparte» cambia entre la ficha de
  *La sombra del viento* (botón «Reproducir») y la de *Los tres mundos* (−29 %, 15,10 €, «Comprar por 15,10 €»); las ondas pasan
  del naranja al azul noche. Alterna solo mientras se ve; se para con el ratón encima o el foco dentro, al pulsar el interruptor y
  del todo tras tres vueltas. Con `prefers-reduced-motion`, nada se mueve.
- Veredicto rápido (8/10) con el botón «Probar 30 días gratis» y el aviso de afiliado.
- Cuerpo en una columna de lectura, con los módulos a lo ancho. Sin índice lateral, sin etiquetas sobre los títulos, sin
  capítulos del vídeo y sin firma ni botones en la portada.
- Vídeo (se carga solo al pulsar, con youtube-nocookie) y qué es Audible, con tres capturas (portada, novedades y pódcasts,
  Descubrir).
- **Precio**: Premium (trazo continuo: sin límite) y Standard (un tramo: un audiolibro al mes), con la pantalla real de los planes
  en la app; el **«¿Premium o Standard?»**: audiolibros al mes (1, 2 o 3, más) y si están incluidos → el plan que sale mejor y por
  qué; y cuatro datos (sin permanencia, ni anual ni familiar, prueba de 30 días o 90 con Prime, y que en la App Store y Google
  Play «pueden aplicar precios más altos» y no hay prueba).
- **¿Qué incluye Premium?**: dos tarjetas (incluido / catálogo extendido, con el precio de *Los tres mundos*: 15,10 € frente a
  21,57 €, −29 %), cómo distinguirlos en la app y cuatro capturas (Reproducir, la etiqueta en el buscador, «Comprar por…» y el
  filtro «Incluido», de 46 a 38 resultados). Nota con botón a SonorBooks para buscar tu libro.
- **¿Tiene límite de horas?**: cuatro reglas (sin contador, a 3,5x igual, sin conexión, Standard uno al mes) y las capturas a 1x
  y a 3,5x.
- **Originals y exclusivos**: el cartel «Exclusivo de Audible» (nueve títulos) y las fichas de *Drácula* y *Umbra Dei*.
- La app (buscador, ficha, explorar por duración; temporizador, capítulos, marcadores y descargados), el perfil infantil (dos
  capturas) y dispositivos (también el ordenador, con su reproductor web, y Alexa; en la web no hay descargas).
- **Opiniones**: las dos notas (4,7 y 4,5) y el reparto de las 100 reseñas más útiles de la App Store española (43 de 5
  estrellas, 19 de 2 a 4, 38 de 1), con lo que gusta y lo que se critica.
- **Audible vs Storytel, Nextory, Podimo, Kobo Plus y Spotify**: tabla en el ordenador y fichas en el móvil, con enlaces a las
  reseñas y a la comparativa Audible vs Storytel.
- Lo mejor y lo peor (de aquí salen las notas del JSON-LD).
- **Cómo probarlo 30 días**: cuatro pasos, la tarjeta de la oferta (condiciones de SonorBooks tal cual) y la **línea de 31 casillas**
  con el truco comprobado (si cancelas el día 1, sigues hasta el día 30) y un selector «¿Qué día empiezas la prueba?» que calcula
  las fechas. Otras formas: Prime (90 días), la oferta de temporada de audible.es (con fecha) y la guía de audiolibros gratis.
- **Cómo cancelar**: pestañas Audible.es / Amazon / App Store / Google Play (tabulador itinerante y flechas) con la ruta de cada una,
  cuatro reglas (en la prueba no pierdes nada, lo incluido se va y lo comprado se queda, Standard, desistimiento de 14 días) y la
  captura de «Has cancelado tu plan».
- Nota final (8) por apartados, para quién sí y para quién no, y «Cómo lo probamos» en letra pequeña con las fuentes.
- «Alternativas y guías relacionadas»: carrusel con Audible vs Storytel, las reseñas de Storytel, Nextory, Podimo, ElevenReader y
  Kobo Plus, ElevenReader vs Audible y las guías de precios y de audiolibros gratis.
- Datos estructurados: `Review` (la nota y los puntos se leen de la página al construir), `BreadcrumbList` (Inicio › Blog ›
  Reseña de Audible) y, con `--yt`, `VideoObject` (la duración se calcula con `tools/aud_meta.py`).

Sin dependencias externas, sin cookies ni almacenamiento en el navegador. Todo se ve sin JavaScript: la portada con el libro
incluido (sin interruptor), el «¿Premium o Standard?» con su ejemplo (controles desactivados), la línea de la prueba con las
fechas de nuestra cuenta y las cuatro rutas para cancelar, una debajo de otra.

## Archivos

```
src/page.html        plantilla completa de la página (cabecera y pie del sitio se insertan al construir)
src/au-resena.css    estilos propios (todo con prefijo .au / au-, no toca el resto del sitio ni otras reseñas)
src/au-resena.js     interacciones (módulo ES, sin librerías)
src/movil.html       visor para revisar la versión móvil (un teléfono con la página dentro); no va a producción
media/               capturas de la app (.webp, de las tomas del 14/10/2026), imagen para redes (og), póster del vídeo (su
                     miniatura real) y las tarjetas del carrusel de las reseñas de Storytel y ElevenReader.
                     Al construir solo se copian las imágenes que usa la página.
site/                cabecera, pie y estilos del sitio (los mismos que las reseñas de Nextory, Podimo y Storytel) e imágenes
                     del carrusel para la vista previa
build.py             genera dist/ (producción), preview/ (vista previa privada) y preview-movil/ (visor del móvil)
```

`python3 web/audible-resena/build.py` genera:

```
dist/es/blog/audible-resena/index.html          la página
dist/assets/resenas/audible/au-resena.css
dist/assets/resenas/audible/au-resena.js
dist/assets/resenas/audible/media/…              imágenes
```

Para volver a sacar las capturas: `python3 tools/web_au_media.py` (necesita `video/public/aud/rec/`; solo usa las tomas, nunca
la grabación original). La imagen para redes, el póster del vídeo y la tarjeta de Storytel: `python3 tools/web_au_og.py` (salen de
la miniatura real, `deliverables/audible/resena/miniatura_resena.png`, y de la imagen para redes de la reseña de Storytel).

## Cómo integrarla (instrucciones para Codex)

1. Copia `dist/assets/resenas/audible/` a la carpeta pública del sitio para que se sirva en `/assets/resenas/audible/`.
2. Haz que la ruta `/es/blog/audible-resena/` sirva `dist/es/blog/audible-resena/index.html` en lugar del artículo generado.
   Si el blog se genera desde datos, crea una plantilla propia para este slug con el `<main>` de la página y conserva la
   cabecera, el pie y los scripts del sitio (`chrome.mjs`, `provider-routing.mjs`, `cookie-notice.mjs`).
3. Las hojas y módulos del sitio están enlazados con los `?v=` de las otras reseñas; si han cambiado, usa los del helper del sitio.
4. Comprueba que `/salir/audible/?market=ES&language=es&to=https%3A%2F%2Fwww.audible.es%2Fep%2Fprueba-gratis` sigue llevando a la
   oferta de Audible (el 14/10/2026 redirigía a geni.us/cTTS) y que la tarjeta de Audible de /es/plataformas/ dice lo mismo que la
   oferta de la página («30 días gratis · Después, 9,99 €/mes» y «Prueba para cuentas que cumplan las condiciones. Hay títulos de
   compra adicional.»). Si cambia, se cambia en `src/page.html` (veredicto, tarjeta de la oferta y barra fija).
5. Mantén en el sitemap y en el índice del blog la misma URL. La página actual solo declara su revisión (15/9/2026), que se
   usa como `datePublished` y `article:published_time`; si conoces la fecha de publicación original, cámbiala en `PUBLICADA`
   (`build.py`). La de modificación (14/10/2026, `MODIFICADA`) cámbiala al día en que se publique. En el índice del blog, la
   tarjeta dice «Audible en España: opiniones, precio y cómo funciona»: cambia el título y la entradilla para que coincidan con la
   página nueva («Audible: opiniones, precio y 30 días gratis») y, si quieres, la imagen (`media/audible-resena-og.jpg`,
   1200×630). Los carruseles de otras reseñas (Nextory, Podimo, Storytel) que anuncian esta página con el título antiguo también.
6. Publica la página con el vídeo ya subido: `python3 web/audible-resena/build.py --yt ID_DEL_VIDEO --yt-fecha AAAA-MM-DD`.
   Así el enlace del vídeo apunta al vídeo (sin `--yt` apunta al canal de YouTube) y el JSON-LD lleva el `VideoObject`
   (duración del montaje según `tools/aud_meta.py`; hora de España). El script avisa si se construye sin `--yt`.
7. El póster del vídeo (`media/audible-resena-video.webp`, 1280×720) ya es la miniatura real del vídeo: si cambias la miniatura
   en YouTube, vuelve a ejecutar `tools/web_au_og.py`.
8. La reseña nueva de Storytel debería publicarse antes o a la vez: el carrusel la anuncia como «Storytel: opiniones, precio y
   7 días gratis». Si no, cambia ese título en `src/page.html`.

## Decisiones pendientes de Joan

- **Nota 8 y apartados** (app y reproductor 9 · dispositivos 9 · catálogo y Originals 8,5 · prueba y cancelación 8 · precio y
  planes 7 · qué está incluido 6,5): propuesta basada en la prueba del 14/10/2026 con una cuenta en la prueba de Premium.
- **Condiciones de la oferta**: copiadas tal cual de la tarjeta de Audible de SonorBooks (14/10/2026). No se ha cambiado nada.
- **Ofertas de Audible**: la página menciona, con fecha, lo que anunciaba audible.es el 14/10/2026 («0,99 € al mes durante los
  primeros 3 meses», «Ahorros de temporada») y la prueba de 90 días para clientes de Prime, que da su ayuda. Si prefieres no
  mencionarlas (no son de SonorBooks), se quita el bloque «Ofertas de temporada» y la línea de Prime.
- **El truco de la prueba** (cancelar el día 1 y seguir escuchando hasta el día 30): comprobado en nuestra cuenta (alta y baja
  el 14/10; la app dice «Has cancelado tu plan. Tu suscripción finaliza el 13 de noviembre de 2026» y Premium sigue activo).
- **Rutas para cancelar**: las de su ayuda (web de Audible y Amazon); no entramos en la web con la cuenta. Las de la App Store y
  Google Play son las genéricas.
- **Comparativa**: datos de Storytel, Nextory y Podimo de sus reseñas (12 y 13/10/2026), Kobo Plus Escuchar del 13/10/2026 y
  Spotify, de Xataka (7/10/2026). Si cambian, se editan en `src/page.html`.
- **Capturas**: fotogramas de nuestras tomas, sin datos personales (el nombre y la inicial de la cuenta van tapados en el perfil;
  fuera la barra de notificaciones con el correo y el aviso de caducidad de una ficha). Llevan portadas de libros del catálogo,
  como cualquier reseña de la app.
- **Imagen para redes y póster**: salen de la miniatura del vídeo (logotipo de Audible, «¿Merece la pena?», el móvil con *Drácula*,
  «sin límite de horas» y «30 días gratis»).
