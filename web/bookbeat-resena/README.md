# Reseña de BookBeat — página nueva para sonorbooks.com

Crea la página **https://sonorbooks.com/es/blog/bookbeat-resena/** (si ya hubiera algo en esa URL, la sustituye; mismo
canonical). Es la reseña que acompaña al vídeo de YouTube «¿Merece la pena BookBeat?»: el vídeo la menciona («la reseña completa
por escrito») y la descripción enlaza aquí. Usa el mismo sistema que las reseñas de Nextory, Podimo, Storytel y Audible
(`web/nextory-resena`, `web/podimo-resena`, `web/storytel-resena`, `web/audible-resena`), con identidad propia: el lila y el
negro de BookBeat, los colores de sus planes, el contador de horas y la pegatina «EN».

**No está publicada.** Antes de subirla a producción tiene que aprobarla Joan.

**Sin afiliado.** BookBeat no tiene enlace de afiliado en SonorBooks (respuesta de Joan: «Aún no: enlace directo»): la página no
usa la ruta `/salir/` y sus botones llevan directamente a https://www.bookbeat.com/es, con `rel="noopener noreferrer"` (sin
`sponsored`) y el aviso «Enlace directo, no es de afiliado». No dice «promoción pagada» ni «busca en SonorBooks si tu libro está
en BookBeat»: para comprobar un libro remite al buscador de bookbeat.com/es o de la app. `build.py` se para si encuentra
`/salir/`, `sponsored` o «busca en SonorBooks». Si llega el enlace de afiliado (Adtraction), se cambian los tres botones
(veredicto, tarjeta de la prueba y barra fija), sus avisos («Enlace directo…», también el de la barra fija y los textos para
lectores de pantalla), la frase «No tenemos enlace de afiliado de BookBeat, así que este enlace es directo» de «BookBeat gratis:
cómo probarlo 30 días» y el párrafo final de «Cómo lo probamos»; y en `blog/bookbeat/resena-youtube.md`, el enlace de la prueba
(«enlace directo, no es de afiliado») y la frase «Vídeo no patrocinado y sin enlaces de afiliado» de la descripción.

## Qué lleva

Responde en el cuerpo, sin preguntas frecuentes, a lo que se busca de BookBeat en España: «opiniones», «¿merece la pena?», «qué
es», «precio», «Basic / Standard / Premium», «horas», «¿está en español?», «catálogo en español», «ebooks», «perfiles / familia /
niños», «dispositivos / ordenador», «gratis / 30 días», «cómo cancelar» y «BookBeat vs Storytel / Podimo / Nextory / Audible /
Kobo / Spotify». Título SEO: «BookBeat: opiniones, precio y 30 días gratis (2026)» (51 caracteres).

La idea visual de toda la página: **el contador de horas**. BookBeat cobra por horas, así que un depósito redondeado que se vacía
(el mismo del vídeo) vuelve en la portada, el precio (el tamaño de cada paquete), el «¿Qué plan te sale?», el «¿Cuántas horas te
gastas?», los perfiles y la nota. Y **la pegatina «EN»** (un círculo negro con el borde lila) sobre las capturas reales, porque en
España la app y la web están en inglés. Los titulares van en Merriweather, con serifa, como los de la web de BookBeat; sus
tipografías (Haffer, Teodor) son comerciales y no se usan.

- **Portada**: el móvil sobre el lila del icono de BookBeat, con dos capturas reales: «Hours» (19 h 53 min que nos quedaban de 20 h)
  e Inspiration, en inglés; la pegatina «EN» y una tarjeta con el contador («Te quedan 19 h 53 min», que se vacía desde 20 h al
  cargar). Un interruptor «Tus horas / La app» cambia de captura. Alterna solo mientras se ve; se para con el ratón encima o el
  foco dentro, al pulsar el interruptor y del todo tras tres vueltas. Con `prefers-reduced-motion`, nada se mueve. Sin firma ni
  botones en la portada.
- Veredicto rápido (6/10) con el botón «Probar 30 días gratis» (a bookbeat.com) y el aviso de que el enlace es directo.
- Cuerpo en una columna de lectura, con los módulos a lo ancho. Sin índice lateral, sin etiquetas sobre los títulos y sin capítulos
  del vídeo.
- Vídeo (se carga solo al pulsar, con youtube-nocookie) y qué es BookBeat, con tres fechas (2015, 2022 y 2025).
- **Precio**: Basic, Standard y Premium con los colores de sus planes y su contador sobre las 100 h de Premium (y lo que sale la
  hora si las gastas todas), cuatro datos y las dos capturas reales de «Change subscription». Y el **«¿Qué plan de BookBeat te
  sale?»**: horas de escucha y de lectura al mes y personas (de 1 a 5) → el plan que cubre a quien más escucha y lee, lo que se
  paga al mes (4,99 € por perfil extra, cada uno con las horas del plan), barras de escuchar y leer en cada plan y, para una
  persona, frente a Podimo (20 h por 4,99 €, sin ebooks) y Storytel (8,99 €, sin contar horas). Funciona con el teclado (barras y
  botones de opción con flechas) y no guarda nada.
- **Ojo: la app está en inglés**: qué significa en la práctica, dos capturas con la pegatina (Categories y Book Filter, que solo
  cambia el idioma de los libros) y un glosario «Lo que vas a leer en la app» (Listen, Hours left until…, Manage Subscription…).
- **Catálogo en español**: «Lo que hay en español, a escala» (16.511 de 431.456 audiolibros y 102.381 de 954.795 ebooks, con
  barras proporcionales), qué está y qué falta, tres capturas (*La sombra del viento*, Carmen Mola y los resúmenes al buscar
  «Sapiens») y cómo comprobar tu libro en bookbeat.com/es o en la app.
- **Cómo se cuentan las horas**: cinco reglas de su ayuda, las capturas de «Hours» (app) y «My hours» (web) y el **«¿Cuántas horas te
  gastas?»**: un libro de 10 h con Basic, a 1x y a 2x (gasta 10 h igual) y el día del pago (lo que sobra se pierde).
- La app (portada, Top 100, idiomas; buscador, filtros y ficha con la nota de la historia y la de la narración; velocidad,
  temporizador automático, marcadores y descargas), los ebooks (lector y ajustes, con OpenDyslexic), los perfiles (cada uno con
  sus horas, perfil infantil y que en la prueba no se pueden añadir) y los dispositivos (sí y no: ni web ni Windows o Mac).
- **Opiniones**: 4,7 en la App Store española con solo 82 valoraciones y 4,2 en Google Play (la nota que se ve desde España, que
  reúne valoraciones de todo el mundo), lo que gusta y lo que se critica.
- **BookBeat vs Storytel, Podimo, Nextory, Audible, Kobo Plus y Spotify**: tabla en el ordenador y fichas en el móvil, con enlaces a
  sus reseñas.
- Lo mejor y lo peor (de aquí salen las notas del JSON-LD).
- **Cómo probarlo 30 días**: cinco pasos (cuenta, enlace para no recibir publicidad, plan que empieza después, forma de pago —hoy
  0 €— y la app), la tarjeta de la prueba y la **línea del alta, los 30 días y el cobro** (32 casillas: el alta, los días 1 a 30
  con los cuatro últimos marcados y el cobro del día 31) con «¿Qué día empiezas la prueba?» y «¿Qué plan empieza después?», que
  calculan las fechas y lo que se cobra.
- **Cómo cancelar**: la ruta en la web (bookbeat.com › Inicia sesión › Menú de la cuenta › Manage Subscription), tres reglas (en la
  prueba pierdes el acceso al momento, no avisan antes de cobrar, con un plan de pago sigues hasta el final del periodo) y la captura
  de la cuenta en la web.
- Nota final (6) por apartados, para quién sí y para quién no, y «Cómo lo probamos» en letra pequeña con las fuentes.
- «Alternativas y guías relacionadas»: carrusel con las reseñas de Storytel, Podimo, Audible, Nextory, Kobo Plus y ElevenReader y las
  guías de precios y de audiolibros gratis.
- Datos estructurados: `Review` (la nota y los puntos se leen de la página al construir; `AggregateOffer` de 6,99 a 14,99 €),
  `BreadcrumbList` (Inicio › Blog › Reseña de BookBeat) y, con `--yt`, `VideoObject` (la duración, PT4M46S, se calcula con
  `tools/bkb_meta.py` a partir de la línea de tiempo del vídeo).

Sin dependencias externas, sin cookies ni almacenamiento en el navegador. Todo se ve sin JavaScript: la portada con la captura de
las horas (sin interruptor), el «¿Qué plan te sale?» con su ejemplo (12 h de escucha, 3 de lectura, una persona → Basic; controles
desactivados) y la línea de la prueba con las fechas de nuestra cuenta (alta el 14/10/2026, prueba hasta el 13/11/2026 y
Standard desde el 14/11/2026).

## Archivos

```
src/page.html        plantilla completa de la página (cabecera y pie del sitio se insertan al construir)
src/bb-resena.css    estilos propios (todo con prefijo .bb / bb-, no toca el resto del sitio ni otras reseñas)
src/bb-resena.js     interacciones (módulo ES, sin librerías)
src/movil.html       visor para revisar la versión móvil (un teléfono con la página dentro); no va a producción
media/               capturas de la app y de la web de la cuenta (.webp, de las tomas del 14/10/2026), las tarjetas del carrusel
                     de las reseñas de Storytel y ElevenReader (copiadas de web/audible-resena/media), la imagen para redes
                     (bookbeat-resena-og.jpg) y el póster del vídeo (bookbeat-resena-video.webp), los dos de tools/web_bkb_og.py.
                     Al construir solo se copian las imágenes que usa la página.
site/                cabecera, pie y estilos del sitio (los mismos que las otras reseñas) e imágenes del carrusel para la vista previa
build.py             genera dist/ (producción), preview/ (vista previa privada) y preview-movil/ (visor del móvil)
```

`python3 web/bookbeat-resena/build.py` genera:

```
dist/es/blog/bookbeat-resena/index.html          la página
dist/assets/resenas/bookbeat/bb-resena.css
dist/assets/resenas/bookbeat/bb-resena.js
dist/assets/resenas/bookbeat/media/…              imágenes
```

Para volver a sacar las capturas: `python3 tools/web_bkb_media.py` (necesita `video/public/bkb/rec/`; solo usa las tomas, nunca la
grabación original). La imagen para redes (`media/bookbeat-resena-og.jpg`, 1200×630) y el póster del vídeo
(`media/bookbeat-resena-video.webp`, 1280×720) salen de la miniatura real del vídeo con `python3 tools/web_bkb_og.py`; si cambias
la miniatura en YouTube, vuelve a ejecutarlo y a construir.

## Cómo integrarla (instrucciones para Codex)

1. Copia `dist/assets/resenas/bookbeat/` a la carpeta pública del sitio para que se sirva en `/assets/resenas/bookbeat/`.
2. Haz que la ruta `/es/blog/bookbeat-resena/` sirva `dist/es/blog/bookbeat-resena/index.html`. Si el blog se genera desde datos,
   crea una plantilla propia para este slug con el `<main>` de la página y conserva la cabecera, el pie y los scripts del sitio
   (`chrome.mjs`, `provider-routing.mjs`, `cookie-notice.mjs`).
3. Las hojas y módulos del sitio están enlazados con los `?v=` de las otras reseñas; si han cambiado, usa los del helper del sitio.
4. Añade la URL al sitemap y una tarjeta al índice del blog con el título «BookBeat: opiniones, precio y 30 días gratis», la
   entradilla de la página y la imagen `media/bookbeat-resena-og.jpg`. Las fechas (`PUBLICADA` y `MODIFICADA` en `build.py`, que
   van a `datePublished`, `dateModified` y `article:*_time`) son provisionales, 14/10/2026: pon en las dos el día en que se publique.
5. La imagen para redes y el póster ya están en `media/` (ver arriba); si la miniatura del vídeo cambia, rehazlos con
   `python3 tools/web_bkb_og.py` y vuelve a construir.
6. Publica la página con el vídeo ya subido: `python3 web/bookbeat-resena/build.py --yt ID_DEL_VIDEO --yt-fecha AAAA-MM-DD`.
   Así el enlace del vídeo apunta al vídeo (sin `--yt` apunta al canal de YouTube) y el JSON-LD lleva el `VideoObject`
   (duración del montaje según `tools/bkb_meta.py`; hora de España). El script avisa si se construye sin `--yt`.
7. Las reseñas nuevas de Storytel y Audible deberían publicarse antes o a la vez: el carrusel las anuncia como «Storytel: opiniones,
   precio y 7 días gratis» y «Audible: opiniones, precio y hasta 90 días gratis» (el título de su versión final, v2). Si no, cambia esos títulos en `src/page.html`. Si
   quieres, añade esta reseña a los carruseles de las otras.

## Decisiones pendientes de Joan

- **Nota 6 y apartados** (prueba 8,5 · app 8 · familia y perfiles 7 · precio y horas 6,5 · catálogo en español 5,5 · idioma y
  experiencia en España 3; la media es 6,4 y la página la da redondeada): propuesta del guion, basada en la prueba del 14/10/2026.
- **Botones a bookbeat.com sin afiliado** (veredicto, tarjeta de la prueba y barra fija). Con un veredicto que, para la mayoría,
  recomienda otras opciones, quizá prefieras quitar la barra fija (`.bb-dock`) y dejar solo los otros dos.
- **Fechas de la prueba**: la línea toma el alta como día 0 y el cobro el día 31, como en nuestra cuenta (alta el 14/10; en la web,
  «Free trial period (20 hours)» y «Upcoming change: Standard (50 hours) from 14/11/2026»; en la app, «Hours left until
  13/11/26»). Recomienda cancelar en los últimos días (del 27 al 30), porque cancelar en la prueba corta el acceso al momento.
- **Ruta para cancelar**: la de su ayuda (menú de la cuenta › «Manage Subscription», con correo de confirmación); no entramos a
  cancelar con la cuenta. Desde la app, la cuenta se abre en esa misma web (bookbeat.com, en el navegador de la app), y la página
  lo dice así.
- **Catálogo**: cifras del buscador de BookBeat para el mercado español (14/10/2026); las proporciones de las barras y «menos de 4
  de cada 100» / «unos 11 de cada 100» salen de esas cifras. Los autores que faltan, comprobados en el mismo buscador: de Javier
  Castillo no hay ningún libro en español (solo uno traducido al neerlandés); de Irene Vallejo y Rebecca Yarros hay algunos ebooks
  en español, pero ningún audiolibro (ni *El infinito en un junco* ni *Alas de sangre*); de Isabel Allende y Ken Follett, en
  español, solo guías de lectura de ResumenExpress (en inglés, muchos).
- **Precio por hora** de cada plan (0,35 €, 0,20 € y 0,15 €) y los totales con perfiles (19,97 € con Standard y dos perfiles): son
  cuentas nuestras con los precios del guion, y la página lo dice.
- **«¿Qué plan te sale?»**: el plan se elige por las horas de quien más escucha y lee (cada perfil tiene las del plan); Podimo cuenta
  solo la escucha porque no tiene ebooks; para más de 100 h dice que habría que comprar horas extra (sin precio: no lo tenemos) y de
  Storytel con varias personas solo menciona que tiene plan familiar (sin precios, que no están en el guion).
- **Comparativa**: datos de Storytel, Podimo, Nextory, Audible y Kobo Plus de sus reseñas (12–14/10/2026) y Spotify, de Xataka
  (7/10/2026). Si cambian, se editan en `src/page.html` y, los del «¿Qué plan te sale?», en `src/bb-resena.js`.
- **Capturas**: fotogramas de nuestras tomas, sin datos personales (en «Profiles», «My hours» y la cuenta, el nombre del perfil y la
  tarjeta ya van tapados; no se recortan ni se mencionan). Llevan portadas de libros del catálogo, como cualquier reseña de la app.
  El ebook del lector es *Mono Sapiens*, según el guion.
- **Imagen para redes y póster**: hechos con la miniatura real del vídeo (`tools/web_bkb_og.py`).
