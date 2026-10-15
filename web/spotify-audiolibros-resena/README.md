# Reseña de los audiolibros de Spotify — página nueva para sonorbooks.com

Crea la página **https://sonorbooks.com/es/blog/spotify-audiolibros-resena/** (si ya hubiera algo en esa URL, la sustituye; mismo
canonical). Es la reseña que acompaña al vídeo de YouTube «¿Merecen la pena los audiolibros de Spotify?»: el vídeo la menciona
(«la reseña completa por escrito») y la descripción enlaza aquí. Usa el mismo sistema que las reseñas de Nextory, Podimo, Storytel,
Audible y BookBeat (`web/nextory-resena`, `web/podimo-resena`, `web/storytel-resena`, `web/audible-resena`, `web/bookbeat-resena`),
con identidad propia: el negro y el verde de Spotify, los colores de sus planes y **las 12 horas en bloques**.

**No está publicada.** Antes de subirla a producción tiene que aprobarla Joan.

**Sin afiliado.** Spotify no tiene enlace de afiliado en SonorBooks: la página no usa la ruta `/salir/` y sus dos botones llevan
directamente a spotify.com (https://www.spotify.com/es/audiobooks/ en el veredicto y https://www.spotify.com/es/premium/ en «Cómo
empezar»), con `rel="noopener noreferrer"` (sin `sponsored`) y el aviso «Enlace directo, no es de afiliado». No hay barra fija con
la oferta: el veredicto no recomienda contratar Premium solo por los audiolibros. Spotify tampoco está en SonorBooks: la página no
dice «busca en SonorBooks si tu libro está en Spotify»; para comprobar un libro remite al buscador de la app (con el filtro
Audiolibros) y, para comparar, a las demás plataformas. `build.py` se para si encuentra `/salir/`, `sponsored`, «busca en
SonorBooks» o «promoción pagada».

## Qué lleva

Responde en el cuerpo, sin preguntas frecuentes, a lo que se busca de los audiolibros de Spotify en España: «opiniones»,
«¿merecen la pena?», «cómo funcionan», «12 horas», «qué planes los incluyen» (Individual, Duo, Familiar, Estudiantes), «cómo se
gastan las horas», «Audiolibros+», «recargas», «qué hay en español», «la app», «Encuentra la página», «dispositivos», «cómo ver
mis horas», «cómo cancelar» y «Spotify vs Storytel / Audible / Podimo / BookBeat / Nextory / Kobo». Título SEO: «Audiolibros de
Spotify: opiniones, precio y horas (2026)» (56 caracteres).

La idea visual de toda la página: **las 12 horas, en bloques**. Spotify da un saldo de 12 horas al mes, así que cada bloque es una
hora: se llenan uno a uno en la tarjeta de la portada al cargar y vuelven en los planes (una fila de bloques por cuenta: en Duo y
Familiar, solo la de quien administra está llena), en «¿Para cuánto dan 12 horas?» (un grupo de 12 bloques por mes), en
Audiolibros+ (15 bloques) y la recarga (10) y en la nota (10 bloques). Los titulares van en Ubuntu, sin serifa, como los de
spotify.com; su tipografía (Spotify Mix) es propia y no se usa. Las condiciones de Spotify que se citan van tal cual, entre
comillas o en el texto de cada plan.

- **Portada** en el negro de Spotify: el móvil sobre un disco verde con dos capturas reales («Tiempo de escucha de audiolibros»:
  0 h usadas de 12; y la sección Audiolibros) y una tarjeta «Con Premium · 12 h al mes · Sin pagar más» cuyos 12 bloques se
  llenan al cargar. Un interruptor «Tus horas / La app» cambia de captura. Alterna solo mientras se ve; se para con el ratón
  encima o el foco dentro, al pulsar el interruptor y del todo tras tres vueltas. Con `prefers-reduced-motion`, nada se mueve.
  Sin firma ni botones en la portada.
- Veredicto rápido (7/10) con el botón «Ver audiolibros en Spotify» y el aviso de que el enlace es directo.
- Cuerpo en una columna de lectura, con los módulos a lo ancho. Sin índice lateral, sin etiquetas sobre los títulos y sin
  capítulos del vídeo.
- Vídeo (se carga solo al pulsar, con youtube-nocookie) y **cómo funcionan**: 12 horas al mes desde el 7/10/2026, catálogo de
  suscripción («Incluido con Premium»), más de 45.000 títulos en español y muestras gratis.
- **Precio**: los cuatro planes como en spotify.com (tarjetas oscuras con sus colores), con una fila de bloques por cuenta y,
  debajo, el texto de Spotify de cada plan tal cual; y qué pasa si estás en el plan de otra persona, en Estudiantes, en la
  versión gratuita o nunca has probado Premium.
- **Cómo se gastan las 12 horas**: cinco reglas de su ayuda, dos capturas («Tiempo de escucha» y «Consigue más tiempo de
  escucha») y **«¿Para cuánto dan 12 horas?»**: *Reina Roja*, *La Bestia*, *La sombra del viento* y *Los tres mundos* sobre
  grupos de 12 bloques (un mes cada uno).
- **Audiolibros+ y recargas**: sus dos tarjetas (15 h por 8,99 €/mes; 10 h por 9,99 €, válidas un año), las capturas de la
  recarga y de «Escucha sin límites», las condiciones de Audiolibros+ tal cual y **«¿Te bastan 12 horas?»**: horas al mes (0–60) y
  si tienes Premium → lo más barato en Spotify (las 12 h, recargas, Audiolibros+ o las dos), lo que pagas de más (o en total,
  sin Premium), una barra con lo que pone cada fuente de horas y la comparación con Storytel, Audible y Podimo. Funciona con el
  teclado y no guarda nada. La media de las recargas supone que escuchas lo mismo cada mes y gastas sus horas antes de que
  caduquen (con 8 h o menos de más al mes, hasta 20 h en total, salen más baratas que Audiolibros+), y la página lo dice.
- **Catálogo en español**: incluidos y de pago (con *Loba negra* y *La asistenta* en latino), cuatro capturas y cómo comprobar
  tu libro en la app.
- **La app**: la sección Audiolibros (tres capturas en secuencia), sin filtro y con filtro, la ficha, la muestra, el reproductor
  (velocidad de 0,5x a 3,5x, temporizador, capítulos) y **Encuentra la página**.
- **Dispositivos** (móvil, tablet, ordenador, web, Apple Watch y descargas), **opiniones** (4,7 y 4,2, que son de toda la app, y
  las notas de los libros en la app; sin «gusta / se critica», porque aún no hay reseñas de los audiolibros que lo respalden),
  **comparativa** (tabla en el ordenador y fichas en el móvil, con enlaces a sus reseñas) y **lo mejor y lo peor** (de aquí salen
  las notas del JSON-LD).
- **Cómo empezar** (cinco pasos y una tarjeta oscura con el mes por 0 € de Premium Individual, la duda de si incluye las 12 h y el
  aviso de que hay opciones más baratas solo para audiolibros) y **cómo cancelar** (la ruta de Premium y la de Audiolibros+,
  cuatro reglas y el texto de la ayuda de Spotify tal cual).
- Nota final (7) por apartados, para quién sí y para quién no, y «Cómo lo probamos» en letra pequeña con las fuentes.
- «Alternativas y guías relacionadas»: carrusel con las reseñas de Storytel, Audible, Podimo, BookBeat, Nextory, Kobo Plus y
  ElevenReader y las guías de precios y de audiolibros gratis.
- Datos estructurados: `Review` (la nota y los puntos se leen de la página al construir; `AggregateOffer` de 11,99 a 20,99 €, los
  tres planes con horas), `BreadcrumbList` (Inicio › Blog › Reseña de los audiolibros de Spotify) y, con `--yt`, `VideoObject` (la
  duración, PT5M20S, se calcula con `tools/spo_meta.py` a partir de la línea de tiempo del vídeo).

Sin dependencias externas, sin cookies ni almacenamiento en el navegador. Todo se ve sin JavaScript: la portada con la captura de
las horas y los 12 bloques llenos (sin interruptor) y el «¿Te bastan 12 horas?» con su ejemplo (15 h al mes, con Premium →
recargas, unos 3 € más al mes de media; controles desactivados).

## Archivos

```
src/page.html        plantilla completa de la página (cabecera y pie del sitio se insertan al construir)
src/sp-resena.css    estilos propios (todo con prefijo .sp / sp-, no toca el resto del sitio ni otras reseñas)
src/sp-resena.js     interacciones (módulo ES, sin librerías)
src/movil.html       visor para revisar la versión móvil (un teléfono con la página dentro); no va a producción
media/               capturas de la app (.webp, de las tomas del 15/10/2026), las tarjetas del carrusel de las reseñas de
                     Storytel, ElevenReader y BookBeat, la imagen para redes (spotify-audiolibros-resena-og.jpg) y el póster del
                     vídeo (spotify-audiolibros-resena-video.webp). Al construir solo se copian las imágenes que usa la página.
site/                cabecera, pie y estilos del sitio (los mismos que las otras reseñas) e imágenes del carrusel para la vista previa
build.py             genera dist/ (producción), preview/ (vista previa privada) y preview-movil/ (visor del móvil)
```

`python3 web/spotify-audiolibros-resena/build.py` genera:

```
dist/es/blog/spotify-audiolibros-resena/index.html   la página
dist/assets/resenas/spotify/sp-resena.css
dist/assets/resenas/spotify/sp-resena.js
dist/assets/resenas/spotify/media/…                   imágenes
```

Para volver a sacar las capturas y las tarjetas del carrusel: `python3 tools/web_spo_media.py` (necesita `video/public/spo/rec/`;
solo usa las tomas, nunca las grabaciones originales). La imagen para redes (`media/spotify-audiolibros-resena-og.jpg`, 1200×630)
y el póster del vídeo (`media/spotify-audiolibros-resena-video.webp`, 1280×720) salen de la miniatura real del vídeo con
`python3 tools/web_spo_og.py`; si cambias la miniatura en YouTube, vuelve a ejecutarlo y a construir.

## Cómo integrarla (instrucciones para Codex)

1. Copia `dist/assets/resenas/spotify/` a la carpeta pública del sitio para que se sirva en `/assets/resenas/spotify/`.
2. Haz que la ruta `/es/blog/spotify-audiolibros-resena/` sirva `dist/es/blog/spotify-audiolibros-resena/index.html`. Si el blog
   se genera desde datos, crea una plantilla propia para este slug con el `<main>` de la página y conserva la cabecera, el pie y
   los scripts del sitio (`chrome.mjs`, `provider-routing.mjs`, `cookie-notice.mjs`).
3. Las hojas y módulos del sitio están enlazados con los `?v=` de las otras reseñas; si han cambiado, usa los del helper del sitio.
4. Añade la URL al sitemap y una tarjeta al índice del blog con el título «Audiolibros de Spotify: opiniones, precio y horas», la
   entradilla de la página y la imagen `media/spotify-audiolibros-resena-og.jpg`. Las fechas (`PUBLICADA` y `MODIFICADA` en
   `build.py`, que van a `datePublished`, `dateModified` y `article:*_time`) son provisionales, 15/10/2026: pon en las dos el día
   en que se publique.
5. La imagen para redes y el póster ya están en `media/` (ver arriba); si la miniatura del vídeo cambia, rehazlos con
   `python3 tools/web_spo_og.py` y vuelve a construir.
6. Publica la página con el vídeo ya subido: `python3 web/spotify-audiolibros-resena/build.py --yt ID_DEL_VIDEO --yt-fecha AAAA-MM-DD`.
   Así el enlace del vídeo apunta al vídeo (sin `--yt` apunta al canal de YouTube) y el JSON-LD lleva el `VideoObject`
   (duración del montaje según `tools/spo_meta.py`; hora de España). El script avisa si se construye sin `--yt`. El nombre del
   `VideoObject` es el título recomendado del vídeo (`blog/spotify/resena-youtube.md`): si se publica con otro, cámbialo en `build.py`.
7. Las reseñas nuevas de Storytel, Audible y BookBeat deberían publicarse antes o a la vez: el carrusel las anuncia como
   «Storytel: opiniones, precio y 7 días gratis», «Audible: opiniones, precio y hasta 90 días gratis» y «BookBeat: opiniones,
   precio y 30 días gratis», y la comparativa enlaza a `/es/blog/bookbeat-resena/`. Si no, cambia esos títulos y enlaces en
   `src/page.html`.

## Decisiones pendientes de Joan

- **Nota 7 y apartados** (precio si ya pagas Premium Individual 9,5 · la app 8,5 · catálogo en español 8,5 · las horas 5 ·
  ampliar las horas 4,5 · Duo, Familiar y Estudiantes 4; la media es 6,7 y la página la da redondeada): propuesta a partir del
  guion (que proponía 7 con apartados que daban 6,4), ajustada para que la nota sea la media redondeada, como en las otras
  reseñas. El vídeo no muestra ninguna nota.
- **Botones a spotify.com sin afiliado** (veredicto y tarjeta de «Cómo empezar»). No hay barra fija.
- **«¿Te bastan 12 horas?»**: las cuentas son nuestras con los precios de spotify.com. Con pocas horas de más al mes, las recargas
  (valen un año) salen más baratas de media que Audiolibros+; con 9 h de más o más, Audiolibros+. Sin Premium, suma los 11,99 €
  de Premium Individual (no usa Audiolibros+ como plan aparte para la versión gratuita: su precio no está en spotify.com/es).
- **Comparativa**: datos de Storytel, Audible, Podimo, BookBeat, Nextory y Kobo Plus de sus reseñas (12–15/10/2026). Si cambian,
  se editan en `src/page.html` y, los del «¿Te bastan 12 horas?», en `src/sp-resena.js`.
- **Capturas**: fotogramas de nuestras tomas, sin datos personales (no se usan las dos tomas con partes tapadas: el buscador con
  las filas personales y la pantalla de pago de Audiolibros+). Llevan portadas de libros del catálogo, como cualquier reseña de la
  app, y la de *tres mundos posteguillo* sin filtro enseña episodios de pódcasts de terceros que hablan del libro.
- **«Escucha sin límites»**: el ejemplo (Harry Potter en inglés, hasta el 31 de octubre) caduca; después de esa fecha conviene
  cambiar la frase o quitar la fecha.
- **Imagen para redes y póster**: hechos con la miniatura real del vídeo (`tools/web_spo_og.py`).
