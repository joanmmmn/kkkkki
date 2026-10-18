# Las mejores plataformas de audiolibros en español — página nueva para sonorbooks.com

Página nueva en **https://sonorbooks.com/es/blog/mejores-plataformas-audiolibros/** (canonical a esa URL). Es el artículo que
acompaña al vídeo de SonorBooks España «Las mejores plataformas de audiolibros en español» (guion v3 del 18/10/2026,
`research/mejores-plataformas/guion.md`): el vídeo dice «la comparativa entera, con todos los precios, en el artículo de la
descripción», y la descripción enlaza aquí. Usa el mismo sistema que las reseñas (`web/audible-resena`, `web/storytel-resena`,
`web/audiobooks-com-resena`…): misma cabecera, pie y estilos del sitio, mismo `build.py`, mismo vídeo que se carga al pulsar.

**No está publicada.** Antes de subirla a producción tiene que aprobarla Joan.

## Qué lleva

Título SEO: «Las mejores plataformas de audiolibros en español (2026): comparativa | SonorBooks». Sin preguntas frecuentes, sin
índice lateral, sin etiquetas sobre los títulos, sin marcas de tiempo del vídeo y sin firma ni botones en la portada. Estética de
SonorBooks (amarillo #FFCA05, negro #101010 y blanco, con un gris cálido para los fondos); las once plataformas se distinguen por
su logotipo, no por un color. En orden:

1. **Portada**: H1 con el subrayado amarillo de las miniaturas, entradilla, los once logotipos y, en un recuadro negro, **la respuesta
   rápida** «¿Cuál te conviene?» (mucho → Storytel 8,99 € o Audible 9,99 €; uno o dos al mes → Podimo 4,99 € con 20 h; lees y
   escuchas → Nextory; también en inglés → BookBeat; ya pagas Spotify Premium → sus 12 h; quedártelos → Audiobooks.com; gratis →
   eBiblio, LibriVox, El Libro Total; tus PDF → ElevenReader), con enlaces a cada ficha.
2. **Vídeo** (youtube-nocookie, se carga al pulsar; sin `--yt`, enlaza al canal).
3. **Las cuatro formas de pagar** (tarifa plana, por horas, créditos, gratis) y la calculadora **«¿Cuántas horas escuchas al
   mes?»**: un control de 2 a 100 h y dos casillas («Ya pago Spotify Premium», «También quiero leer ebooks») → el plan más barato
   que llega, y las barras de horas de los doce planes con la línea de lo que escuchas (Podimo 20 h 4,99; Nextory 10 h 5,99 /
   30 h 7,99 / sin límite 9,99; BookBeat 20 h 6,99 / 50 h 9,99 / 100 h 14,99; Storytel 8,99 sin límite; Audible Premium 9,99 sin
   límite; Podimo Premium Plus 100 h 9,99; Spotify 12 h incluidas y Audiolibros+ 8,99 € más, solo con la casilla de Premium). A
   igual precio gana el primero del orden del vídeo (Storytel antes que Audible). Sin JavaScript se ve el ejemplo de 15 h → Podimo.
4. **Tabla comparativa de las 11** agrupada por forma de pago (precio, horas, prueba, ebooks, ordenador/web, familia y perfiles,
   lo mejor, el ojo); en el móvil, una ficha por plataforma con la etiqueta de cada dato.
5. **Una ficha por plataforma** (lo mejor, el truco, el ojo, una captura real, el enlace a su reseña y el botón de prueba con sus
   condiciones y el aviso de afiliado al lado). Las once tienen reseña: el vídeo de la de Spotify está publicado (5dKjJSF9knU, 18/10),
   pero su página (/es/blog/spotify-audiolibros-resena/, rama `resena-spotify`) daba 404: conviene publicarla antes o a la vez.
6. **Los 5 trucos que valen para todas**, cada uno con su módulo: acelerar no ahorra horas (selector 1x / 1,5x / 2x), cuándo
   cancelar cada prueba (barras de días), alta en la web y no en la app, encadenar pruebas (150 días) y buscar el libro antes de
   pagar (*Los tres mundos* en Audible, BookBeat y Audiobooks.com, y la búsqueda real en SonorBooks con botón a
   https://sonorbooks.com/es/audiolibros/).
7. **Cómo lo comparamos**, cambios del 15/10, fuentes con enlace, transparencia (afiliados y la frase de Amazon Afiliados) y la
   fecha de comprobación (15 de octubre de 2026).

Datos estructurados: `Article` + `ItemList` (las 11 fichas, leídas de la página al construir) + `BreadcrumbList` y, con `--yt`,
`VideoObject` (duración calculada con las cuentas de `video/src/scenes/mp/timeline.ts`; sin locución grabada es una estimación).
Sin FAQPage. Meta description de 154 caracteres (`DESCRIPCION` en `build.py`; el script comprueba que no pase de 158).
Accesible: contraste AA, zonas táctiles de 44 px o más, foco visible, `prefers-reduced-motion`, todo legible sin JavaScript.

### Enlaces de prueba

| Plataforma | Enlace | `rel` | Aviso junto al botón |
|---|---|---|---|
| Audible | `/salir/audible/?market=ES&language=es&to=https%3A%2F%2Fwww.audible.es%2Fep%2Fprueba-gratis` | `noopener noreferrer sponsored` | Enlace de afiliado |
| Podimo | `/salir/podimo/?market=ES&language=es&to=https%3A%2F%2Fpodimo.com%2Fes` | ídem | Enlace de afiliado |
| Nextory | `/salir/nextory/?market=ES&language=es&to=https%3A%2F%2Fnextory.com%2Fes` | ídem | Enlace de afiliado |
| Audiobooks.com | `/salir/audiobooks/?market=ES&language=es&to=https%3A%2F%2Fwww.audiobooks.com%2F` | ídem | Enlace de afiliado |
| ElevenReader | `/salir/elevenreader/?market=ES&language=es&to=https%3A%2F%2Felevenreader.io%2F` | ídem | Enlace de afiliado |
| Storytel, BookBeat, Spotify, eBiblio, LibriVox, El Libro Total | directos (storytel.com/es/subscriptions, bookbeat.com/es, spotify.com/es/audiobooks, ebiblio.es, librivox.org, ellibrototal.com) | `noopener noreferrer` | Enlace sin comisión |

Los de afiliado llevan los `data-platform` del sitio, como las reseñas. Todos los botones de las fichas tienen el mismo aspecto
(contorno negro), con afiliado o sin él. Las **condiciones** («Condiciones», desplegable) están copiadas tal cual de las reseñas y
de las tarjetas de SonorBooks; no se han cambiado.

## Archivos

```
src/page.html        plantilla completa de la página (cabecera y pie del sitio se insertan al construir)
src/mp-guia.css      estilos propios (todo con prefijo .mp / mp-)
src/mp-guia.js       calculadora de horas, selector de velocidad, visor de capturas y vídeo (módulo ES, sin librerías)
src/movil.html       visor para revisar la versión móvil; no va a producción
media/               capturas (las de las reseñas —la de Spotify, `spotify-reina-roja.webp`, de la suya, en la rama `resena-spotify`—,
                     un fotograma de la toma de BookBeat y recortes de las webs públicas de Spotify (ya sin usar), eBiblio Madrid, LibriVox y del buscador de SonorBooks), logotipos (SVG y WebP), imagen para redes y póster
site/                cabecera, pie y estilos del sitio (los mismos que las reseñas), logotipos de SonorBooks y fuentes de la vista previa
build.py             genera dist/, preview/, preview.html y preview-movil/
```

`python3 web/mejores-plataformas/build.py` genera:

```
dist/es/blog/mejores-plataformas-audiolibros/index.html   la página
dist/assets/blog/mejores-plataformas/mp-guia.css
dist/assets/blog/mejores-plataformas/mp-guia.js
dist/assets/blog/mejores-plataformas/media/…               imágenes (solo las que usa la página, más la de redes)
preview.html                                               vista previa en un solo archivo (≈ 2 MB, todo en data URI)
```

Las imágenes: `python3 tools/web_mp_media.py` (capturas y logotipos) y `node tools/web_mp_og.mjs` (imagen para redes y póster).

## Cómo integrarla (instrucciones para Codex)

1. Copia `dist/assets/blog/mejores-plataformas/` a la carpeta pública del sitio para que se sirva en `/assets/blog/mejores-plataformas/`.
2. Crea la ruta `/es/blog/mejores-plataformas-audiolibros/` con `dist/es/blog/mejores-plataformas-audiolibros/index.html`. Si el blog se
   genera desde datos, crea una plantilla propia para este slug con el `<main>` de la página y conserva la cabecera, el pie y los scripts
   del sitio (`chrome.mjs`, `provider-routing.mjs`, `cookie-notice.mjs`).
3. Las hojas y módulos del sitio están enlazados con los `?v=` de las reseñas; si han cambiado, usa los del helper del sitio.
4. Comprueba que las cinco rutas `/salir/…` de la tabla siguen llevando a su oferta y que las tarjetas de /es/plataformas/ dicen lo mismo
   que las condiciones de la página. Si cambian, se cambian en `src/page.html` (cada ficha).
5. Añade la URL al sitemap y una tarjeta en el índice del blog («Las mejores plataformas de audiolibros en español (2026)», imagen
   `media/mejores-plataformas-og.jpg`, 1200×630). Cambia `PUBLICADA` y `MODIFICADA` (`build.py`) al día en que se publique.
6. Publica con el vídeo ya subido: `python3 web/mejores-plataformas/build.py --yt ID_DEL_VIDEO --yt-fecha AAAA-MM-DD`. Así el enlace
   del vídeo apunta al vídeo y el JSON-LD lleva el `VideoObject`. El script avisa si se construye sin `--yt`.
7. **El póster del vídeo es provisional** (`media/mejores-plataformas-video.webp`, la misma composición que la imagen para redes). Cuando
   exista la miniatura real, déjala en `deliverables/mejores-plataformas/miniatura.png` y vuelve a ejecutar `node tools/web_mp_og.mjs`.
8. Las fichas enlazan a las reseñas nuevas (`/es/blog/{audible,storytel,nextory,podimo,bookbeat,audiobooks-com,elevenreader,librivox,
   ebiblio,el-libro-total}-resena/`). Las de BookBeat, eBiblio y El Libro Total tienen que existir con esa URL antes de publicar esta.

## Decisiones pendientes de Joan

- **URL**: la del encargo, `/es/blog/mejores-plataformas-audiolibros/` (constante `SLUG` en `build.py`).
- **Botones iguales**: con o sin afiliado, todos los botones de prueba tienen el mismo aspecto, para no empujar hacia los de comisión.
  El único botón amarillo es «Buscar tu libro en SonorBooks».
- **Orden de las fichas**: el del vídeo, por forma de pago; la página dice que no es una clasificación.
- **Datos que no salen del guion del vídeo**: el plan anual de Podimo (49,99 €, de su reseña), ElevenReader Ultra 11 $ en su web y
  12 € en la App Store (de su reseña), los idiomas de BookBeat y su perfil a 4,99 €, y las cifras de El Libro Total (6.698 audiolibros
  y «la mitad dura menos de 18 minutos», del 10/10/2026).
- **Celdas «—» de la tabla**: ebooks y ordenador de Spotify y de Audiobooks.com, y perfiles de eBiblio: no lo comprobamos.
- **Capturas**: de las reseñas ya revisadas (sin datos personales), un fotograma de la página de planes de bookbeat.com en el móvil
  (sin nombre ni correo) y recortes de webs públicas; la del buscador de SonorBooks, sin el aviso de cookies.
