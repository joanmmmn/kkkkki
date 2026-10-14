# Guía y reseña de eBiblio — página nueva para sonorbooks.com

URL nueva: **https://sonorbooks.com/es/blog/ebiblio-resena/** (no sustituye a ninguna página).
Es la página que acompaña al vídeo de YouTube «Cómo usar eBiblio»: el vídeo y su descripción enlazan aquí. Usa el mismo sistema
que las reseñas de LibriVox y ElevenReader (`web/librivox-resena`, `web/elevenreader-resena`): cabecera y pie del sitio,
veredicto, nota, ficha de SonorBooks, carrusel y barra fija. Todo lo demás tiene identidad propia de eBiblio.

**No está publicada.** Antes de subirla a producción tiene que aprobarla Joan.

## Diseño: dos materiales

- **SonorBooks** (Ubuntu, Merriweather, tinta y amarillo): las explicaciones, los botones del sitio, la nota y nuestras marcas
  sobre las capturas (recuadro amarillo con borde de tinta y número).
- **«La puerta»**, el mundo del vídeo de eBiblio: los colores de su identidad (coral, rosa, ciruela, oliva y mostaza) y Poppins,
  la letra de sus carteles (incluida en `media/fonts`, licencia OFL). La portada es una pared rosa con la puerta de la biblioteca
  que se abre (como el logotipo de eBiblio) y, dentro, un móvil con un audiolibro; las placas de los pasos, el gráfico de las
  comunidades y la recreación de la app usan este material.

## Qué lleva

- **Portada:** H1 «eBiblio: qué es y cómo usarlo» y la ilustración de la puerta, hecha en CSS (sin imágenes): al cargar, la
  puerta se abre y aparece el carné. Sin firma ni botones.
- Veredicto rápido (7,5/10) con «Ir a eBiblio» (ruta de salida del sitio hacia ebiblio.es).
- **Cómo usar eBiblio, en cuatro pasos:** la respuesta corta (entrar con el carné, buscar lo que hay libre, «Prestar» o
  «Reservar», escuchar 21 días); cada paso enlaza a su apartado.
- **Vídeo:** la guía por capítulos («la puerta», 3:38). En producción, el de YouTube (se carga al pulsar, con
  youtube-nocookie). En la vista previa se reproduce el propio vídeo, porque aún no está en YouTube.
- **Qué es:** el préstamo digital de las bibliotecas públicas, quién lo pone en marcha y por qué es gratis (las bibliotecas
  compran licencias), con las cifras de 2025. Debajo, **un audiolibro con tres ejemplares que se puede probar**: «Pedirlo
  prestado» saca ejemplares de la estantería; sin ejemplares, el botón pasa a «Reservarlo» y se forma la cola (hasta que se
  llena: «En este momento no hay reservas libres»); «Pasan 21 días» devuelve los préstamos solos y se los lleva la cola.
- **Cada comunidad, su eBiblio:** las 17 comunidades en un gráfico de barras (audiolibros del catálogo y disponibles ahora,
  recuento propio del 14/10/2026). Al elegir una, su ficha muestra las dos cifras, cuántos préstamos a la vez, cómo se saca el
  carné y el enlace a su eBiblio (todas las fichas están en el HTML; sin JavaScript se ve la de Madrid). Nota para Cataluña y
  el País Vasco (Biblio Digital y eLiburutegia).
- **El carné:** en cualquier biblioteca; por internet en doce comunidades; usuario y contraseña. Captura de la identificación
  de eBiblio Madrid.
- **Paso a paso** en la web de eBiblio Madrid, con capturas marcadas de páginas públicas (ebiblio.es, el catálogo con los dos
  filtros, la lista de disponibles, fichas con «Prestar» y «Reservar», «Mi Cuenta») y **el reproductor de la app recreado**
  (velocidad, 30 segundos, temporizador y sin conexión, cada uno con una pequeña demostración).
- **Las colas:** *Cien años de soledad* hasta enero, *Sapiens* sin reservas, el truco de «Títulos disponibles», tres normas
  (21 días, no se renueva, de uno a siete a la vez) y los 10 audiolibros más prestados de 2025.
- **La app:** qué hace y sus notas en las tiendas (3,5 en Google Play, 2,7 en la App Store), con estrellas.
- Lo mejor y lo peor, para quién es, nota por apartados y la ficha de eBiblio de SonorBooks con **las condiciones de la web
  copiadas tal cual** (texto de Joan).
- «Cómo lo probamos» en letra pequeña, con fuentes; carrusel de 9 artículos relacionados; barra fija «Ir a eBiblio».
- SEO, para quien busca qué es y cómo usarlo: título «Cómo usar eBiblio: audiolibros gratis con el carné de tu biblioteca
  (guía 2026)», H1 «eBiblio: qué es y cómo usarlo», los cuatro pasos arriba y el orden del vídeo. Datos estructurados
  `Review` (7,5/10) y `BreadcrumbList`, y `VideoObject` cuando se construye con el ID del vídeo. Sin preguntas frecuentes,
  sin índice, sin marcas de tiempo del vídeo.

Sin dependencias externas, sin cookies ni almacenamiento en el navegador. El contenido está entero en el HTML (sin JavaScript se
ve el texto completo, la ficha de Madrid y la estantería con sus tres ejemplares); con `prefers-reduced-motion` no hay
animaciones. Los enlaces a eBiblio usan la ruta de salida del sitio (`/salir/ebiblio/?market=ES&language=es&to=…`) con los
atributos `data-platform="ebiblio"` de la portada; las fichas de las comunidades enlazan a `https://<comunidad>.ebiblio.es/`
por la misma ruta. **No son enlaces de afiliado** (`rel="noopener noreferrer"`, sin `sponsored`).

## Archivos

```
src/page.html        plantilla completa (cabecera y pie del sitio se insertan al construir)
src/eb-resena.css    estilos propios (prefijos .eb y eb-; no tocan el resto del sitio)
src/eb-resena.js     interacciones (módulo ES, sin librerías)
src/movil.html       visor para revisar la versión móvil; no va a producción
media/               capturas marcadas (.webp), miniatura del vídeo, imagen para redes (og) y fuentes (Poppins, OFL)
site/                cabecera, pie y estilos del sitio (los mismos que la reseña de LibriVox)
build.py             genera dist/ (producción), preview/ (vista previa) y preview-movil/ (visor del móvil);
                     aquí están los datos de las 17 comunidades (REGIONS) y los artículos del carrusel (MORE)
```

Las capturas salen de `tools/web_eb_media.py` (a partir de `video/public/eb/web`, capturadas con `tools/eb_capture.mjs` en
páginas públicas, sin iniciar sesión); la miniatura del vídeo y la imagen para redes, de la composición `EBCover` del vídeo.

`python3 web/ebiblio-resena/build.py` genera:

```
dist/es/blog/ebiblio-resena/index.html           la página
dist/assets/resenas/ebiblio/eb-resena.css
dist/assets/resenas/ebiblio/eb-resena.js
dist/assets/resenas/ebiblio/media/…               capturas, miniatura, imagen para redes y fuentes
```

La vista previa usa, si existe, `deliverables/ebiblio/SonorBooks_eBiblio_Guia_web.mp4` (≤ 15 MB) para que el vídeo se vea
dentro de la página; producción no lo necesita.

## Cómo integrarla (instrucciones para Codex)

1. Copia `dist/assets/resenas/ebiblio/` a la carpeta pública del sitio para que se sirva en `/assets/resenas/ebiblio/`.
2. Haz que la ruta `/es/blog/ebiblio-resena/` sirva `dist/es/blog/ebiblio-resena/index.html`. Si el blog se genera desde
   datos, crea una plantilla propia para este slug con el `<main>` de la página y conserva la cabecera, el pie y los scripts
   del sitio (`chrome.mjs`, `provider-routing.mjs`, `cookie-notice.mjs`).
3. Las hojas y módulos del sitio están enlazados con los `?v=` de la página de ElevenReader; si han cambiado, usa los del helper del sitio.
4. Comprueba que `/salir/ebiblio/` acepta un `to` con el eBiblio de una comunidad (`https://madrid.ebiblio.es/`, etc.: el
   proveedor tiene el host `ebiblio.es`); si solo acepta la portada, cambia `SALIR_TO` en `build.py` o deja esos enlaces
   directos.
5. Añade la URL al sitemap y una tarjeta en el índice del blog (Reseñas), con el título «eBiblio: qué es y cómo usarlo», la
   entradilla de la página y la imagen `media/ebiblio-resena-og.jpg` (1200×630). Fecha de publicación: 14/10/2026.
6. Cuando el vídeo esté publicado: `python3 build.py --yt ID_DEL_VIDEO --yt-fecha AAAA-MM-DD` (el día en que se publicó).

## Decisiones pendientes de Joan

- **Nota 7,5/10 y textos de opinión**: se basan en la prueba del 14/10/2026 en las páginas públicas, sin iniciar sesión.
- **Cifras de las comunidades**: recuento del 14/10/2026; cambian cada día. La página lo dice debajo del gráfico.
- **Condiciones de la ficha**: las de la web, sin cambios.
