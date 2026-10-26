# Cómo cancelar… — ocho guías nuevas para sonorbooks.com

Ocho páginas nuevas del blog, una por tutorial del canal SonorBooks España («Cómo cancelar Audible», «… Storytel», etc.). Cada
vídeo dice «todos los pasos, con capturas, en el artículo de la descripción», y su descripción enlaza a su guía. Usan el mismo
sistema que «Las mejores plataformas» (`web/mejores-plataformas`): misma cabecera, pie y estilos del sitio, el mismo vídeo que se
carga al pulsar y el mismo visor de capturas.

**No están publicadas.** Antes de subirlas a producción tiene que aprobarlas Joan.

| Plataforma | URL | Pasos con captura | Cómo se canceló |
|---|---|---|---|
| Audible | `/es/blog/cancelar-audible/` | 4 | Cuenta ya cancelada desde la reseña; pasos de la ayuda oficial |
| Storytel | `/es/blog/cancelar-storytel/` | 9 | App de Android + web, 26/10/2026 |
| Spotify Premium | `/es/blog/cancelar-spotify-premium/` | 4 | Web, 26/10/2026 |
| Podimo | `/es/blog/cancelar-podimo/` | 12 | App de Android + web, 26/10/2026 |
| Nextory | `/es/blog/cancelar-nextory/` | 11 | App de Android + web, 26/10/2026 |
| BookBeat | `/es/blog/cancelar-bookbeat/` | 9 | App de Android + web (en inglés), 26/10/2026 |
| Audiobooks.com | `/es/blog/cancelar-audiobooks-com/` | 5 | Web, 26/10/2026 |
| iVoox Premium | `/es/blog/cancelar-ivoox-premium/` | 5 | App de Android, 26/10/2026 |

## Qué lleva cada guía

Sin preguntas frecuentes, sin índice lateral, sin etiquetas sobre los títulos, sin marcas de tiempo del vídeo y sin firma ni botones
en la portada, como las demás páginas nuevas. **Sin enlaces de afiliado** y sin «busca tu libro en SonorBooks»: es una guía para
irse, no para vender. En orden:

1. **Portada**: logotipo, H1 «Cómo cancelar *Plataforma*» con el subrayado amarillo, entradilla y la marca «Cancelación real,
   comprobada el 26 de octubre de 2026».
2. **La respuesta rápida** (recuadro negro): dónde se cancela, los pasos en una línea, el «ojo» de esa plataforma y qué pasa después.
3. **El tutorial en vídeo** (youtube-nocookie, se carga al pulsar; sin `--yt`, enlaza al canal).
4. **Paso a paso, con capturas**: cada paso con su número, su texto y la captura real (de la grabación del tutorial, con nombre,
   correo, avatar y tarjeta tapados); los tramos de app y de web van separados con un rótulo. Toca una captura para verla en grande.
5. **Qué pasa cuando cancelas** (prueba gratis, periodo pagado, biblioteca, qué se conserva).
6. **Si pagas por la tienda o por otra empresa**: el caso propio de la plataforma y los pasos de Google Play y del App Store.
   «Borrar la app no cancela la suscripción».
7. **Cómo cancelar otras plataformas**: enlace a su reseña y a las otras siete guías.
8. **Cómo lo comprobamos**, con las fuentes oficiales enlazadas (`SRC` en `data.py`) y la fecha.

Datos estructurados: `Article` + `HowTo` (los pasos, con su imagen) + `BreadcrumbList` y, con `--yt`, `VideoObject` (duración de
`video/src/scenes/cnl/videos.ts`). Meta description de 141–149 caracteres (el script comprueba que no pase de 158). Accesible:
contraste AA, zonas táctiles de 44 px o más, foco visible, `prefers-reduced-motion`, legible sin JavaScript.

## Archivos

```
data.py              los textos de las ocho guías (títulos, pasos, «qué pasa», tiendas, fuentes)
build.py             genera dist/ y preview/
src/cs-guia.css      estilos (los de mejores-plataformas, prefijo mp-, más los propios, prefijo cs-)
src/cs-guia.js       visor de capturas y vídeo al pulsar (módulo ES, sin librerías)
src/movil.html       visor para revisar la versión móvil; no va a producción
media/               capturas de cada paso (webp), logotipos, póster del vídeo y imagen para redes de cada guía
site/                cabecera, pie y estilos del sitio (los mismos que mejores-plataformas) y fuentes de la vista previa
```

Las imágenes salen de `python3 tools/web_cnl_media.py`: los pasos, de las tomas ya tapadas (`video/public/cnl/rec`,
`video/public/aud/rec`) y de las capturas web tapadas (`video/public/cnl/web`); el póster (`<slug>-video.webp`, 1280×720) y la imagen
para redes (`<slug>-og.jpg`, 1200×630), de la miniatura de cada vídeo (`deliverables/cancelar-<k>/miniatura.png`).

`python3 web/cancelar/build.py [--yt k=ID,k=ID…] [--yt-fecha AAAA-MM-DD]` genera:

```
dist/es/blog/<slug>/index.html             las ocho páginas
dist/assets/blog/cancelar/cs-guia.css
dist/assets/blog/cancelar/cs-guia.js
dist/assets/blog/cancelar/media/…          imágenes (solo las que usan las páginas, más las de redes)
preview/<slug>.html                        vista previa de cada guía en un solo archivo (todo en data URI)
```

## Cómo integrarlas (instrucciones para Codex)

1. Copia `dist/assets/blog/cancelar/` a la carpeta pública del sitio para que se sirva en `/assets/blog/cancelar/`.
2. Crea las ocho rutas `/es/blog/<slug>/` con su `dist/es/blog/<slug>/index.html`. Si el blog se genera desde datos, usa una plantilla
   propia con el `<main>` de cada página y conserva la cabecera, el pie y los scripts del sitio (`chrome.mjs`, `provider-routing.mjs`,
   `cookie-notice.mjs`).
3. Las hojas y módulos del sitio están enlazados con los `?v=` de las reseñas; si han cambiado, usa los del helper del sitio.
4. Añade las ocho URL al sitemap y sus tarjetas al índice del blog (título, `desc` de `data.py` e imagen `media/<slug>-og.jpg`).
   Cambia `PUBLICADA` y `MODIFICADA` (`build.py`) al día en que se publiquen.
5. Publica con los vídeos ya subidos: `python3 web/cancelar/build.py --yt audible=ID,storytel=ID,… --yt-fecha AAAA-MM-DD`. Así cada
   guía enlaza a su vídeo y su JSON-LD lleva el `VideoObject`.
6. Cada guía enlaza a la reseña de su plataforma (`/es/blog/<plataforma>-resena/`; Spotify, `/es/blog/spotify-audiolibros-resena/`;
   Audiobooks.com, `/es/blog/audiobooks-com-resena/`; iVoox, `/es/blog/ivoox-resena/`). Tienen que existir con esa URL antes de
   publicar estas.

## Para Joan

- **Audible**: nuestra cuenta ya estaba cancelada, así que la guía usa las pantallas de la reseña y los pasos de la ayuda oficial. La
  web dice «Fecha de cancelación: 21-10-2026» y no muestra ningún plan activo, mientras que el 14/10 la app decía que terminaba el
  13/11/2026. La guía no promete que se siga escuchando hasta el final de la prueba; solo «si pagabas, hasta el final del mes».
- **Spotify**: se canceló en la web; en la captura del plan Duo se ha tapado el nombre del otro miembro.
- **Datos personales**: todas las capturas se han revisado con OCR y a ojo (nombre, correo, avatar, tarjeta, «MAJORISMEDIA»).
