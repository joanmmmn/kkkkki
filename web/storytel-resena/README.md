# Reseña de Storytel — página nueva para sonorbooks.com

Sustituye a la página actual **https://sonorbooks.com/es/blog/storytel-resena/** (misma URL, mismo canonical).
Es la reseña que acompaña al vídeo de YouTube «¿Merece la pena Storytel?»: el vídeo la menciona («la reseña completa por
escrito») y la descripción enlaza aquí. Usa el mismo sistema que las reseñas de Nextory y Podimo (`web/nextory-resena`,
`web/podimo-resena`), con identidad propia: el naranja de Storytel, su bocadillo y otros módulos.

**No está publicada.** Antes de subirla a producción tiene que aprobarla Joan.

**Sin afiliado.** Storytel no está en SonorBooks España: la página no usa la ruta `/salir/` y sus botones llevan directamente
a https://www.storytel.com/es/subscriptions, con `rel="noopener noreferrer"` (sin `sponsored`) y el aviso «Enlace directo, no
es de afiliado». Nunca dice «busca en SonorBooks si tu libro está en Storytel»: para comprobar un libro remite a las fichas
públicas de storytel.com. Si llega un enlace de afiliado de Storytel, se cambian esos tres botones (veredicto, prueba y barra
fija) y los avisos.

## Qué lleva

Responde en el cuerpo, sin preguntas frecuentes, a lo que se busca de Storytel en España: «opiniones», «¿merece la pena?»,
«qué es», «precio», «Family / familiar», «¿tiene límite de horas?», «gratis / 7 días», «cómo cancelar», «catálogo»,
«Originals», «leer y escuchar», «niños», «dispositivos / ordenador» y «Storytel vs Audible / Nextory / Podimo / Kobo /
Spotify». Título SEO: «Storytel: opiniones, precio y 7 días gratis (2026)».

La idea visual de toda la página: **el bocadillo naranja de su icono y el trazo continuo de «sin límite de horas»** (frente a
los tramos de los planes que cuentan horas), con el **subrayado amarillo** de la frase que se lee y se escucha a la vez.

- **Portada**: el móvil dentro de un bocadillo con capturas reales. Un interruptor «Escuchar / Leer» cambia entre el
  reproductor (a 2x, «Sin límite de horas») y el ebook del mismo libro con la frase marcada («La frase, marcada»). El trazo del
  bocadillo se dibuja al cargar. Alterna solo mientras se ve; se para con el ratón encima o el foco dentro, al pulsar el
  interruptor y del todo tras tres vueltas. Con `prefers-reduced-motion`, nada se mueve.
- Veredicto rápido (8/10, con un trazo continuo) con el botón «Probar 7 días gratis» (a storytel.com) y el aviso de que el
  enlace es directo.
- Cuerpo en una columna de lectura, con los módulos a lo ancho. Sin índice lateral, sin etiquetas sobre los títulos, sin
  capítulos del vídeo y sin firma ni botones en la portada.
- Vídeo (se carga solo al pulsar, con youtube-nocookie) y qué es Storytel, con tres capturas (portada, Top 50, Explorar).
- **Precio**: Unlimited y Family (con su selector de 2 o 3 cuentas, que cambia el precio), cuatro datos de sus condiciones y
  el **«¿Cuántos vais a escuchar?»**: 1, 2 o 3 personas → plan, total al mes, precio por persona y lo que se ahorra frente a
  varias cuentas Unlimited.
- **¿Tiene límite de horas?**: cuatro reglas (sin reloj, a 2x igual, sin conexión, ojo con la prueba), las capturas a 1x y a 2x
  y el **calculador «¿Te compensa una tarifa sin límite?»**: horas al mes y velocidad → el plan más barato que te cubre entre
  Podimo Premium (20 h), Nextory Mini (10 h), Nextory Standard (30 h) y Storytel (sin límite), con barras en tramos para los
  planes con horas y un trazo continuo para Storytel.
- **Catálogo**: qué hay y qué falta, y un cartel «Solo en Storytel» con ocho Originals y exclusivas, junto a *La Suelta* y
  *Modo Noche*.
- **Escuchar y leer el mismo libro**: cuatro capturas unidas (Leer desde aquí → la frase marcada → buscar «limonada» en el libro
  → salta al minuto 4:02 del audio).
- La app (buscador, cámara, ficha; velocidad, temporizador, capítulos y biblioteca), Storytel para niños (pestaña Infantil, Kids
  mode y código PIN) y dispositivos (sí y no: ni ordenador ni web).
- **Opiniones**: las dos notas (4,5 y 4,5) con estrellas y el reparto de las 200 reseñas más recientes de la App Store española
  (94 de 5 estrellas, 65 de 2 a 4, 41 de 1), con lo que gusta y lo que se critica.
- **Storytel vs Nextory, Podimo, Audible, Kobo Plus y Spotify**: tabla en el ordenador y fichas en el móvil, con enlaces a las
  reseñas y a las comparativas Audible vs Storytel y Storytel vs Nextory.
- Lo mejor y lo peor (de aquí salen las notas del JSON-LD).
- **Cómo probarlo 7 días**: cuatro pasos (con la casilla de publicidad que viene marcada), la tarjeta de la prueba con **las
  condiciones de storytel.com copiadas tal cual** y la **línea de 8 casillas** (día 1, días 2–6, día 7, cobro el día 8) con un
  selector «¿Qué día empiezas la prueba?» que calcula las fechas. Otras formas: la invitación de un amigo (vista en la app, no
  probada) y la guía de audiolibros gratis.
- **Cómo cancelar**: pestañas Web / App / Google Play / App Store (tabulador itinerante y flechas) con la ruta de cada una, las tres
  reglas (en la prueba se pierde el acceso al momento, nunca en la última hora antes del cobro, sin devoluciones salvo el
  desistimiento de 14 días) y la captura de «Configuración de la suscripción» de la app (siguiente pago y «Tu plan actual», que
  manda a la web).
- Nota final (8) por apartados, para quién sí y para quién no, y «Cómo lo probamos» en letra pequeña con las fuentes.
- «Alternativas y guías relacionadas»: carrusel con Storytel vs Nextory, Audible vs Storytel y las reseñas de Nextory, Podimo,
  Audible y Kobo Plus, entre otras.
- Datos estructurados: `Review` (la nota y los puntos se leen de la página al construir), `BreadcrumbList` (Inicio › Blog ›
  Reseña de Storytel) y, con `--yt`, `VideoObject` (la duración se calcula con `tools/str_meta.py`).

Sin dependencias externas, sin cookies ni almacenamiento en el navegador. Todo se ve sin JavaScript: la portada con el
reproductor (sin interruptor), Family con el precio de 2 cuentas y el de 3 debajo, el «¿cuántos vais a escuchar?» y el
calculador con su ejemplo (controles desactivados), la línea de la prueba con las fechas de ejemplo y las cuatro rutas para
cancelar, una debajo de otra.

## Archivos

```
src/page.html        plantilla completa de la página (cabecera y pie del sitio se insertan al construir)
src/st-resena.css    estilos propios (todo con prefijo .st / st-, no toca el resto del sitio ni otras reseñas)
src/st-resena.js     interacciones (módulo ES, sin librerías)
src/movil.html       visor para revisar la versión móvil (un teléfono con la página dentro); no va a producción
media/               capturas de la app (.webp, de las tomas del 13/10/2026), imagen para redes (og), póster del vídeo (su
                     miniatura real) y la tarjeta de la reseña de ElevenReader (la misma de las reseñas de Nextory y Podimo).
                     Al construir solo se copian las imágenes que usa la página.
site/                cabecera, pie y estilos del sitio (los mismos que las reseñas de Nextory y Podimo) e imágenes del carrusel
                     para la vista previa
build.py             genera dist/ (producción), preview/ (vista previa privada) y preview-movil/ (visor del móvil)
```

`python3 web/storytel-resena/build.py` genera:

```
dist/es/blog/storytel-resena/index.html          la página
dist/assets/resenas/storytel/st-resena.css
dist/assets/resenas/storytel/st-resena.js
dist/assets/resenas/storytel/media/…              imágenes
```

Para volver a sacar las capturas: `python3 tools/web_st_media.py` (necesita `video/public/str/rec/`; solo usa las tomas, nunca
la grabación original). La imagen para redes y el póster del vídeo: `python3 tools/web_st_og.py` (salen de la miniatura real,
`deliverables/storytel/resena/miniatura_resena.png`).

## Cómo integrarla (instrucciones para Codex)

1. Copia `dist/assets/resenas/storytel/` a la carpeta pública del sitio para que se sirva en `/assets/resenas/storytel/`.
2. Haz que la ruta `/es/blog/storytel-resena/` sirva `dist/es/blog/storytel-resena/index.html` en lugar del artículo generado.
   Si el blog se genera desde datos, crea una plantilla propia para este slug con el `<main>` de la página y conserva la
   cabecera, el pie y los scripts del sitio (`chrome.mjs`, `provider-routing.mjs`, `cookie-notice.mjs`).
3. Las hojas y módulos del sitio están enlazados con los `?v=` de las reseñas de Nextory y Podimo; si han cambiado, usa los del
   helper del sitio.
4. Mantén en el sitemap y en el índice del blog la misma URL. La página actual solo declara su revisión (23/9/2026), que se
   usa como `datePublished` y `article:published_time`; si conoces la fecha de publicación original, cámbiala en `PUBLICADA`
   (`build.py`). La de modificación (13/10/2026, `MODIFICADA`) cámbiala al día en que se publique. En el índice del blog, la
   tarjeta dice «Storytel en España: precio, catálogo y opiniones»: cambia el título y la entradilla para que coincidan con la
   página nueva («Storytel: opiniones, precio y 7 días gratis») y, si quieres, la imagen (`media/storytel-resena-og.jpg`,
   1200×630). Los carruseles de otras reseñas (Podimo, Nextory) que anuncian esta página con el título antiguo también.
5. Publica la página con el vídeo ya subido: `python3 web/storytel-resena/build.py --yt ID_DEL_VIDEO --yt-fecha AAAA-MM-DD`.
   Así el enlace del vídeo apunta al vídeo (sin `--yt` apunta al canal de YouTube) y el JSON-LD lleva el `VideoObject`
   (duración del montaje según `tools/str_meta.py`; hora de España). El script avisa si se construye sin `--yt`.
6. El póster del vídeo (`media/storytel-resena-video.webp`, 1280×720) ya es la miniatura real del vídeo: si cambias la miniatura
   en YouTube, vuelve a ejecutar `tools/web_st_og.py`.
7. Las reseñas nuevas de Nextory y Podimo deberían publicarse antes o a la vez: el carrusel las anuncia como «Nextory: opiniones,
   precio y 30 días gratis» y «Podimo: opiniones, precio y 30 días gratis». Si no, cambia esos títulos en `src/page.html`.

## Decisiones pendientes de Joan

- **Nota 8 y apartados** (escuchar y leer 9 · precio y planes 9 · app y reproductor 8,5 · catálogo y exclusivos 8 · dispositivos 7,5 ·
  prueba y cancelación 6): propuesta basada en la prueba del 13/10/2026 con una cuenta Unlimited.
- **Botones a storytel.com sin afiliado** (veredicto, tarjeta de la prueba y barra fija). Si prefieres no tener botones a una web
  sin afiliado, se quita la barra fija y el del veredicto, y la tarjeta se queda solo con las condiciones.
- **Condiciones de la prueba**: copiadas tal cual de storytel.com el 13/10/2026 («0 € para 7 días · Después 8.99 € /mes», y en
  Family 15.99 € con 2 cuentas o 20.99 € con 3). Algunas fichas de libros de storytel.com aún dicen «14 días»: la página habla
  de 7, que es lo que da el alta.
- **Fechas de la prueba**: la línea toma el primer cobro el día 8, como en nuestra cuenta (alta el 13/10; en la app, «Siguiente
  pago: 8.99 EUR el 2026-10-20»), y la regla de sus condiciones: no se puede cancelar en la última hora antes del siguiente
  periodo de pago. El vídeo y la página recomiendan cancelar el día 7.
- **Ruta para cancelar en la web**: es la que da su ayuda («Configuración de la cuenta»); no entramos en la web con la cuenta. La de
  la app (Perfil › Configuración › Suscripción › Tu plan actual) está grabada. Las de Google Play y la App Store son las genéricas.
- **Comparativa y calculador**: datos de Nextory, Podimo y Audible de sus reseñas (12/10/2026), Kobo Plus Escuchar del 13/10/2026 y
  Spotify, de Xataka (7/10/2026). Si cambian, se editan en `src/page.html` y, los del calculador, en sus `data-meter` / `data-price`.
- **Capturas**: fotogramas de nuestras tomas, sin datos personales (no se ve la inicial ni el correo de la cuenta). Llevan portadas
  de libros del catálogo, como cualquier reseña de la app.
- **Imagen para redes y póster**: salen de la miniatura del vídeo (logotipo de Storytel, «¿Merece la pena?», el móvil con «Solo en
  Storytel», «sin límite de horas» y «7 días gratis»).
