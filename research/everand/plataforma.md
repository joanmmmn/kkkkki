# Everand sin cuenta: qué se puede ver y grabar (documentación de primera mano)

- **Web analizada:** https://www.everand.com/. En español se sirve como **https://es.everand.com/** (Scribd, Inc.; el pie de página dice "Copyright © 2026 Scribd Inc.").
- **Fecha de la prueba:** 27/10/2026. Todas las citas, precios y textos legales son de ese día.
- **Cómo se probó:** Chromium 141 (Playwright 1.56.1, `/opt/pw-browsers/chromium-1194`) a **1920×1080 con deviceScaleFactor 2**, es decir, capturas de 3840×2160. Se usaron `locale: es-ES`, la cabecera `Accept-Language: es-ES,es;q=0.9`, la zona horaria Europe/Madrid y un user agent normal de Chrome 141 para Windows.
- **Siempre sin cuenta:** no se creó ninguna cuenta, no se inició sesión, no se introdujo ningún dato de pago y no se empezó ninguna prueba. Ningún CAPTCHA se resolvió.
- **Desde dónde se probó:** la salida a internet de este servidor es una IP de Google Cloud en **Columbus, Ohio (EE. UU.)**. Por eso la web muestra los precios en **dólares estadounidenses** (§1.2).
- **Fuentes complementarias:**
  - la API pública del Centro de Ayuda (Zendesk, `support.scribd.com/api/v2/help_center/{es,en-us}/...`);
  - la API de iTunes (`itunes.apple.com/lookup`);
  - las fichas web de Google Play y del App Store.
- **Convenciones:**
  - Cada dato lleva su evidencia: una captura (`assets/everand/screens/NN-…png`), una URL o una cita literal.
  - Lo que no se pudo comprobar está marcado como **NO VERIFICADO**.
  - El dossier del proyecto está en `research/everand/dossier.md`.

---

## 0. Resumen

| Tema | Hallazgo | Evidencia |
|---|---|---|
| Idioma | El español se fuerza con la cabecera `Accept-Language: es-…`: `www.everand.com` responde **302 → `es.everand.com`**. El parámetro `?locale=es` **no hace nada**. La web tiene un selector "ES ▾" con English, Español, Português, Deutsch y Français. | §1.1; captura 06 |
| País y precio vistos desde aquí | Se ve la versión de EE. UU., en USD: **Standard $11.99/mes (1 desbloqueo), Plus $16.99 (3) y Deluxe $28.99 (5)**. La web ofrece una prueba gratis de **30 días** con **1 desbloqueo**, sea cual sea el plan. | capturas 02, 04 y 26–28 |
| Antibots | No hay Cloudflare. La web usa **Fastly Bot Management**: un "Client Challenge" en JavaScript, XHR que reciben HTML en lugar de JSON y un **CAPTCHA de imagen**. El CAPTCHA aparece en la pantalla de registro y, tras muchas visitas automatizadas, en toda la web. | §2; capturas 29, 46 y 47 |
| Visible sin cuenta | Portada, secciones, más vendidos, **búsqueda con filtros** (formato, idioma, categoría, valoración, novedad, "Solo ilimitado"), **fichas completas** (narrador, duración, editorial, ISBN, valoraciones y reseñas), **muestra de audio de 5 min**, ficha de ebook, planes y precios, y el Centro de Ayuda. | §3 |
| Muestra de audio | **Sí, se reproduce sin cuenta.** "▶ Reproducir muestra" carga un MP3 público de **300 s** y el botón pasa a "⏸ Pausa". **No hay reproductor visible**: ni barra, ni tiempo, ni velocidad. | §4; capturas 19 y 20 |
| Voz sintética | Hay fichas con el crédito literal **"Narrado por Martín Quirós (voz sintética)"**, por ejemplo *Yo, comandante de Auschwitz*. | §5.4; captura 22 |
| Invisible sin suscripción | Reproductor completo (velocidad, temporizador, capítulos, ±15/30 s), libro completo, "Desbloquear", biblioteca, descargas y cuenta (cancelar, pausar). La pantalla de registro y pago está bloqueada aquí por CAPTCHA. El lector de vista previa no llegó a cargar el texto (§2). | §3.2 |
| Catálogo (búsquedas) | "Crimen y castigo": 59 audiolibros. "Isabel Allende": 31 audiolibros y 29 ebooks. "García Márquez": 180. "Pérez‑Reverte": 72. *La asistenta* (Freida McFadden) **sí está**. **"Hábitos atómicos" (James Clear) no está**: solo aparecen guías no oficiales, resúmenes y pódcasts. | §6; capturas 10–18 |
| Contradicción | La FAQ de la portada y la Ayuda en inglés dicen que los desbloqueos sin usar duran **6 meses**. La **traducción española** de la Ayuda sigue diciendo que "**expiran 30 días** después de recibirlos". La ficha de Google Play aún afirma que Everand incluye Scribd y SlideShare. | §7.4; capturas 05 y 30 |
| Apps | **Google Play** (`com.scribd.app.reader0`): en España 4,4★ y en **EE. UU. 3,5★**, con **614 mil reseñas** y **10 M+** descargas; v16.26 del 16/10/2026. **App Store** (id **542557212**): en España 4,3★ con 851 valoraciones; v16.25 del 06/10/2026, iOS 17+. | §8; capturas 39–45 |

---

## 1. Idioma, país y precio

### 1.1 Cómo se fuerza el español
La redirección depende **solo de la cabecera `Accept-Language`** (comprobado con `curl`):

| Accept-Language | URL pedida | Respuesta |
|---|---|---|
| `en-US` | `https://www.everand.com/` | 200, en inglés |
| `en-US` | `https://www.everand.com/?locale=es` | 200, **sigue en inglés** (el parámetro se ignora) |
| `en-US` | `https://es.everand.com/` | **302 → `https://www.everand.com/`** |
| `es-ES` o `es-MX` | `https://www.everand.com/` | **302 → `https://es.everand.com/`** |
| `es-ES` | `https://www.everand.com/audiobook/743198801/…` | 302 → `https://es.everand.com/audiobook/743198801/…` |

- **En Playwright** basta con `locale: 'es-ES'`, que ya envía `Accept-Language: es-ES`. Se puede reforzar con `extraHTTPHeaders`. `tools/steps.mjs` y `tools/record.mjs` ya usan `locale: 'es-ES'`.
- **Selector de idioma de la web** (captura 06):
  - Es el botón `[data-e2e=megamenu-top-bar-language-picker-button]` ("ES ▾"), con English, Español, Português, Deutsch y Français.
  - Debajo aparece el texto "Traduciremos la navegación del sitio y personalizaremos las recomendaciones cuando sea posible para que coincidan con tu idioma preferido."
  - Cada opción enlaza a `https://es.everand.com/language?id=<es|en|pt-br|de|fr>`.
- **Restos en inglés dentro de la web en español:**
  - el banner promocional de arriba ("EXTENDED: No Tricks. Just Treats. … Use code SPOOKY26 … through Nov 1st.");
  - el carrusel "Bestsellers" de la portada, con el catálogo de EE. UU. (*Project Hail Mary*, *The Housemaid*…);
  - las "Advertencias sobre contenidos" de las fichas ("animal abuse", "death") y los "Temas principales de reseñas de lectores" ("murder", "well-paced");
  - claves de traducción sin traducir en el texto accesible ("shared.common.info", "shared.carousels.go_to_next_items");
  - el atributo `<html lang>` de la portada, que es `en` (en las páginas interiores es `es`).

### 1.2 País y moneda desde este servidor
- La IP es de EE. UU., así que todo aparece en **USD y con punto decimal** ("$11.99").
- La web no ofrece ninguna forma pública de elegir país. Simular otro país con VPN o proxy no entraba en lo permitido.
- Lo que dice la Ayuda sobre otros países ("Planes Everand: Standard, Plus y Deluxe", actualizado el 27/10/2026):
  - "Los precios fuera de EE. UU. pueden variar según el país. Verás los precios locales cuando te registres… **Deluxe está disponible actualmente solo en Estados Unidos.**"
  - "Standard y Plus están disponibles en EE. UU., Reino Unido, Canadá, Australia, México y gran parte de América Latina."
- **España no aparece en esa lista. El precio en euros en la web está NO VERIFICADO.** El dossier cita Plus a 14,99 € en el App Store español.
- Pistas de precios locales en las tiendas:
  - Google Play (`gl=ES`): "Compras en la aplicación **1,09 € - 23,99 €** si se factura a través de Google Play" (captura 40).
  - La descripción de Google Play en español dice "Nuestra suscripción mensual comienza en **$149.99MXN**".

---

## 2. Bloqueos, antibots y cómo convivir con ellos

| Bloqueo | Qué pasa | Cómo se nota | Qué hacer (sin trucos) |
|---|---|---|---|
| **Fastly "Client Challenge"** (JavaScript) | En la primera visita, el documento devuelve una página "Client Challenge" (`/_fs-ch-1T1wmsGaOgGaSxcX/…`) que se resuelve sola y recarga. | Se ven dos navegaciones seguidas a la misma URL, con 1–3 s más de carga. Con `curl` nunca se pasa, porque hace falta JavaScript. | Esperar. |
| **XHR "desafiadas"** | Algunas peticiones internas reciben el HTML del challenge en vez de JSON: `/csrf_token`, `/audiobook/<id>/data`, `/book/<id>/data`, `/search/query`, `/read2/<id>/access_token` y `/scepub/<id>/*.json`. | (a) **Página de búsqueda en blanco** si se abre directamente `…/search?query=…`. La consola muestra "Cannot convert undefined or null to object" en `search/app.85e166.js` (captura 46). (b) **Botones rotos**: "Prueba gratis por  días" / "Escuchar gratis durante  días", "Cargando…" y un spinner en el banner (capturas 22, 23 y 24). (c) **Lector de ebook** atascado en el esqueleto gris (captura 25). | (a) Entrar siempre por la portada, esperar unos 5 s y **buscar tecleando** en la caja: funcionó en las 9 búsquedas hechas así. Falló una vez al teclear desde `/bestsellers/audiobooks` sin haber pasado antes por la portada. (b) Antes de grabar una ficha, comprobar que `[data-e2e=read-free-btn]:visible` contiene "30 días". Si no, salir y volver más tarde: recargar varias veces seguidas **empeora** el bloqueo. |
| **CAPTCHA de imagen de Fastly** | Aparece "Ingrese los caracteres que aparecen en la imagen a continuación". | (1) **Siempre** al pulsar "Prueba … por $0" (`/oauth/signup?product_handle=…`, captura 29). (2) **En toda la web** tras unas 50 cargas de página automatizadas en unos 40 min desde esta IP (captura 47), y otra vez tras unas 12 cargas al volver. | No resolverlo. Dejar enfriar (aquí bastaron unos 25 min), espaciar las cargas (≥3 s) y hacer sesiones cortas, de menos de 10 cargas. |
| **Cookies (Osano)** | Barra negra abajo en la primera visita: "Este sitio web utiliza tecnologías como cookies…" | Captura 01. | Cerrarla con la X: `button.osano-cm-dialog__close` (aria-label "Cerrar este banner de consentimiento"). No vuelve a aparecer en el mismo perfil. |
| **Google One Tap / FedCM** | La consola muestra "[GSI_LOGGER]: FedCM get() rejects…" | No tiene efecto en un navegador automatizado. | En un Chrome real con sesión de Google podría salir el aviso "Iniciar sesión con Google" (**NO VERIFICADO**). Usar un perfil limpio. |

- **No hay Cloudflare ni reCAPTCHA.** Fastly se reconoce por las rutas `/_fs-ch-…/` y por las cookies `_fs_ch_st_*` (Max-Age 10 s) y `_fs_cd_cp_*` (unos 60 min).
- **No se hizo, a propósito:** ocultar `navigator.webdriver`, usar plugins "stealth", resolver CAPTCHAs ni cambiar de IP. La única medida fue un user agent normal de Chrome, que estaba permitido.
- **Recomendación para la grabación final:** grabar en un Chrome normal de escritorio, con conexión doméstica, perfil limpio, ventana de 1920×1080 y sistema en español. Ahí es poco probable que salten los challenges (**NO VERIFICADO**).
- **Si se automatiza con `tools/record.mjs`:**
  1. Añadir al contexto un `userAgent` normal. Ahora usa el de HeadlessChrome.
  2. No depender de `waitUntil: 'networkidle'`: en la portada los rastreadores lo retrasan hasta 20–24 s.
  3. Hacer cada recorrido en una ejecución corta y dejar unos minutos entre ejecuciones.

---

## 3. Qué se puede ver sin cuenta

### 3.1 Visible y grabable

| Pantalla | URL | Qué muestra | Capturas |
|---|---|---|---|
| Portada | `https://es.everand.com/` | Hero "Descubre Everand. Audiolibros, libros y mucho más", botón "Prueba gratis por 30 días" y el texto "Desde $11.99/mes, al terminar la prueba. Cancela cuando quieras.". Más abajo: tabla comparativa con Audible y Spotify, planes, FAQ desplegable y Everand Originals en español | 01–05, 48 |
| Megamenú Audiolibros | se abre pasando el ratón por "Audiolibros" | Los más vendidos, Destacados según los editores, Todos los audiolibros y Categorías destacadas | 07 |
| Sección Audiolibros | `https://es.everand.com/audiobooks` | "Explora audiolibros en español, por género y categoría…", pestañas Resumen / Categorías / Elegidos de los editores y la lista "Audiolibros más vendidos" en español | 08 |
| Más vendidos | `https://es.everand.com/bestsellers/audiobooks` | 1. *Caná. Caballo de Troya 9* (J. J. Benítez, 8.901 valoraciones). 2. *Crimen y castigo* (9.532). 3. *El cuento de la criada*… Filtros por interés y por tipo | 09 |
| Búsqueda | escribir en `#header_search_input` → `/search?query=…` | Autocompletado; pestañas Todo / Ebooks / Audiolibros / Podcasts; filtros Solo ilimitado, Categoría, Clasificación, Nuevo lanzamiento e Idioma (preseleccionado en "Español") | 10–18 |
| Ficha de audiolibro | `https://es.everand.com/audiobook/<id>/<slug>` | Formato, duración e idioma; autor, **narrador**, nota y nº de valoraciones. Botones "Escuchar gratis durante 30 días", "**Reproducir muestra**", Guardar, Descargar a la aplicación y Compartir. Además: descripción, advertencias de contenido, idioma, **editorial**, traductor, fecha, ISBN, reseñas de lectores y títulos relacionados | 19–23 |
| Ficha de ebook | `https://es.everand.com/book/<id>/<slug>` | Páginas, horas estimadas e idioma; botones "Prueba gratis por 30 días" y "**Leer vista previa**"; si existe audiolibro, "Prueba el audiolibro ▶ Muestra"; un fragmento "Vista previa del libro" en la propia ficha | 24 |
| Lector de vista previa | `https://es.everand.com/read/<id>/<slug>` | Barra con Índice, Buscar dentro del libro, Pantalla completa, Aa y ⋮; doble página; franja "¿Disfrutas de la vista previa gratuita? Suscríbete para desbloquear este título. [Comienza tu prueba gratuita]". **El texto no llegó a cargar desde aquí** (§2) | 25 |
| Ilimitado | `https://es.everand.com/unlimited` | Selección de títulos que no requieren desbloqueo. **No se pudo capturar**: saltó el CAPTCHA | — |
| Planes | `https://es.everand.com/checkout/available-plans` | Los tres planes, el asistente "Ayúdame a elegir" y la línea temporal "Cómo funciona la prueba gratuita" | 26–28 |
| Centro de Ayuda | `https://support.scribd.com/hc/es/…` | Artículos públicos en español | 30–38 |

### 3.2 Lo que NO se puede mostrar sin suscripción
- **El reproductor completo de audiolibros.**
  - En la web solo cambia el botón: "Reproducir muestra" ↔ "Pausa".
  - Según la Ayuda (captura 38), dentro del producto hay barra de progreso, saltos de ±15/30 s, velocidad, temporizador (icono ☾) y capítulos. **En pantalla: NO VERIFICADO.**
- **El libro completo.** Tampoco el botón "Desbloquear", el contador de desbloqueos ni "Obtener más desbloqueos".
- **Las descargas offline.** Además, solo existen en la app: "Las descargas solo están disponibles a través de la aplicación Everand, no en la web" (captura 35).
- **La biblioteca personal:** Guardados, historial, marcadores, notas y sincronización con Fable.
- **La cuenta:** cancelar, pausar, cambiar de plan y facturas. Solo se ve descrita en la Ayuda (capturas 37 y 34).
- **El registro, el pago y su letra pequeña.**
  - Al pulsar "Prueba … por $0" se navega a `https://es.everand.com/oauth/signup?product_handle=6&from_logged_out_plans=true` (este enlace es el de Plus).
  - Desde aquí sale el CAPTCHA de Fastly (captura 29). **El texto legal de esa pantalla está NO VERIFICADO.**
- "Guardar para después" y "Escribir una reseña" requieren sesión; no se pulsaron.

---

## 4. Muestra de audio sin cuenta

- **El botón:** "▶ Reproducir muestra", en la columna derecha de la ficha.
  - Hay dos en el DOM (versión móvil y versión de escritorio), ambos con `data-e2e="play-preview-button"`. El selector que funciona es **`[data-e2e=play-preview-button]:visible`**.
  - En la ficha de un ebook aparece "Prueba el audiolibro ▶ Muestra", con el mismo `data-e2e`.
- **Qué suena:** un `<audio>` con `src = https://samples.production.scribd.com/samples/audiobooks/<id>/sample.mp3`.
  - El MP3 es público: responde 206 sin autenticación.
  - Dura **300,0 s (5:00)** en las dos ediciones de *Crimen y castigo* probadas (712072129 y 824861714).
  - **Empieza a sonar ~1,3–1,8 s después del clic** (en la prueba, `currentTime` = 0,8 s a los 1.815 ms).
- **Cómo se ve:** **no hay reproductor**. El botón pasa a "⏸ Pausa" (captura 20) y no aparece barra de progreso, tiempo, velocidad ni mini‑reproductor.
  - En el vídeo conviene enseñar el botón en "Pausa" y poner encima el audio de la muestra.
  - `tools/record.mjs` ya registra el evento `audio_play` con su `src`, lo que sirve para sincronizar.
- **La Ayuda lo confirma** (captura 31): "Siempre puedes previsualizar un libro antes de usar un desbloqueo. Toca 'Reproducir muestra' o 'Leer vista previa'…"
- **Cuidado al grabar:** si la página cargó con XHR desafiadas (§2), el banner y el botón principal se quedan en "durante  días" con un spinner, aunque la muestra suene. En la captura 20 los botones están bien.

---

## 5. Fichas de referencia

### 5.1 *Crimen y castigo*: edición recomendada para el vídeo
`https://es.everand.com/audiobook/824861714/Crimen-y-castigo` (capturas 19–21)
- **Datos de cabecera:** "Audiolibro • **24 horas** • Español". Escrito por Fiódor M. Dostoievski y David McDuff. **Narrado por Luis David García Márquez.**
- **Valoración:** se muestra "4.5/5 (9,532 clasificaciones)", pero el texto accesible dice "Calificación: **4.251364068401175** de 5 estrellas". La web redondea 4,25 hacia arriba, a 4,5.
- **Comentarios:** 182, entre ellos algunos en inglés ("One of my favorite Russian novels."). Eso sugiere que **las valoraciones se agrupan por obra, mezclando ediciones e idiomas** (inferencia, **NO VERIFICADO**).
- **Metadatos:** editorial **Penguin Random House Audio**; traductor Rafael Cansinos Assens; lanzamiento 14 ene 2021; ISBN 9788491054580; categorías Ficción general, Clásicos y Thriller y crimen; "Advertencias sobre contenidos: animal abuse".
- **Selectores de los botones:** "Escuchar gratis durante 30 días" (`[data-e2e=read-free-btn]:visible`), "Reproducir muestra", "Guardar para después" (`[data-e2e=save-content-desktop]`), "Descargar a la aplicación" (`[data-e2e=download-to-app-desktop]`) y "Compartir título" (`[data-e2e=content-preview-share]`).
- **Para el guion:** en El Libro Total la misma obra dura ≈26,6 h, es gratis y la lee Hernando Iván Cano.

### 5.2 *Crimen y castigo*: versión resumida (YOYO USA)
- URL: `https://es.everand.com/audiobook/712072129/Crimen-Y-Castigo`.
- Cabecera: "ILIMITADO • Audiolibro (**versión resumida**) • **2 horas** • Español". Narrado por Fabio Camero.
- 4.5/5 (9,328 clasificaciones). Editorial YOYO USA, 1 ene 2001, ISBN 9781611552751.
- **Es el "Resultado principal" al buscar "Crimen y castigo"** (captura 11): el primer resultado es un resumen de 2 h con la etiqueta "Ilimitado".

### 5.3 *La casa de los espíritus* (Isabel Allende)
- URL: `https://es.everand.com/audiobook/823561152/La-casa-de-los-espiritus` (captura 23; el botón principal aparece roto, ver §2).
- "Audiolibro • 17 horas • Español". **Narrado por Javiera Gazitua y Senén Arancibia.** 4.5/5 (36 clasificaciones).
- "Este audiolibro incluye dedicatoria, agradecimientos y prefacio narrados por Isabel Allende."
- Las advertencias de contenido están en inglés.

### 5.4 Narración con voz sintética
- **Ficha capturada:** `https://es.everand.com/audiobook/913213094/Yo-comandante-de-Auschwitz` (captura 22, con el crédito visible sin hacer scroll).
  - "Audiolibro (versión resumida) • 9 horas • Español". *Yo, comandante de Auschwitz*. Escrito por Rudolf Höss.
  - **"Narrado por Martín Quirós (voz sintética)"**; 5/5 (2 clasificaciones). Tiene ebook ("Vista previa").
  - En esta carga el botón principal salió roto ("Escuchar gratis durante  días", ver §2).
- **Segunda ficha, `https://es.everand.com/audiobook/723885728`:** al pedirla saltó el CAPTCHA de Fastly y **no se capturó**.
- Según el dossier, "Martín Quirós (voz sintética)" también narra *El Príncipe*, y "Luis Canales (voz sintética)" narra *Bailén* de Galdós. **NO VERIFICADO aquí.**
- El crédito "(voz sintética)" forma parte del nombre del narrador y enlaza a su página de colaborador.

### 5.5 Ebook *Crimen y castigo*
- URL: `https://es.everand.com/book/419912634/Crimen-y-castigo` (captura 24; el botón principal aparece roto, ver §2).
- "Libro electrónico • 886 páginas • 16 horas • Español"; 5/5 (2 clasificaciones); lanzamiento 23 jul 2019.
- Botón "Leer vista previa": `[data-e2e=read-preview]:visible`, que lleva a `/read/419912634/Crimen-y-castigo`.

---

## 6. Búsqueda

- **Caja de búsqueda:** `#header_search_input` (también `[data-e2e=megamenu-top-bar-search-input]`, `name="query"`).
  - Al escribir sale un autocompletado ("crimen y castigo fiodor dostoievsky", "… fyodor dostoevsky"…; captura 10).
  - Con Intro se navega a `/search?query=<texto>`.
  - Para cambiar de búsqueda hay que seleccionar el texto (`input.select()`) y teclear encima. Con `Control+A` no se borró y el texto nuevo se concatenó.
- **Pestañas:** Todo, Ebooks, Audiolibros y Podcasts (`a[href*="content_type=audiobooks"]`…).
- **Filtros** (chips `[data-e2e=filter-…]`):
  - `filter-catalog` "Solo ilimitado", `filter-category` "Categoría", `filter-rating` "Clasificación", `filter-new_release` "Nuevo lanzamiento" y `filter-language` "Idioma".
  - Con la web en español, **el filtro de idioma ya viene en "Español"**. Ofrece English, Español, Português, Deutsch y Français, con los botones "Borrar todo" y "Aplicar" (captura 13).
  - **No hay filtro por narrador ni por duración.**
- **Resultados (27/10/2026, filtro Español):**

| Búsqueda | Resultado | Captura |
|---|---|---|
| "Crimen y castigo" | Audiolibros **59**, Ebooks 793, Podcasts 326. Resultado principal: la versión resumida de 2 h (ILIMITADO) | 11–12 |
| "Isabel Allende" | Ficha de autor con "**29 libros electrónicos, 31 audiolibros**": *Hija de la fortuna*, *Retrato en sepia*, *Eva Luna*, *Inés del alma mía*, *Paula*, *De amor y de sombra*… | 14 |
| "Hábitos atómicos" | **La obra de James Clear no está.** Sale una lista "Libros parecidos a 'Hábitos atómicos' de James Clear" (del Equipo Editorial de Everand), 49 audiolibros que no son el original, una "Guía No Oficial" ("Hábitos Atómicos en 30 Días…") y pódcasts de resúmenes | 15 |
| "La asistenta Freida McFadden" (best seller) | **Sí está.** Resultado principal: *La asistenta (castellano)*, Freida McFadden, audiolibro, 5/5. En Audiolibros hay **38 resultados**: *El secreto de la asistenta*, *La mujer de arriba*, *Tras la puerta*, *El recluso*, *La empleada*… | 16 |
| "García Márquez" (pestaña Audiolibros) | "1 - 40 de **180** resultados": *El amor en los tiempos del cólera*, *Crónica de una muerte anunciada*, *Memoria de mis putas tristes*, *Vivir para contarla*, *Doce cuentos peregrinos*, *Noticia de un secuestro*… | 17 |
| "Pérez-Reverte" (pestaña Audiolibros) | "1 - 40 de **72** resultados": la saga *El capitán Alatriste* (*Corsarios de Levante*, *El oro del rey*, *El caballero del jubón amarillo*…), *El pintor de batallas*, *El asedio*, *El club Dumas*, *La Reina del Sur*… | 18 |

- **Contraste para el guion:** una reseña de 2020 en el App Store de España (miguecj86) decía "no tienen nada de Isabel Allende, o Gabriel García‑Márquez…". Hoy están (capturas 14, 17 y 45), aunque casi todo con desbloqueo.
- **Si no hay resultados**, sale "No hay resultados para '…' / Revisa tu ortografía o prueba con otro término de búsqueda", seguido de "Buscar por formato" y "Buscar por categoría".

---

## 7. Precios, prueba gratuita y textos legales (tal como aparecen el 27/10/2026)

### 7.1 Portada y fichas
- **Hero de la portada:** "Prueba gratis por 30 días" / "Desde $11.99/mes, al terminar la prueba. Cancela cuando quieras." (captura 02).
- **Banner promocional de arriba**, solo en inglés (caduca el 1/11): "EXTENDED: No Tricks. Just Treats. Get 2 books and 30 days free, plus 25% off your first paid month. Use code SPOOKY26 on Plus or Deluxe plans, through Nov 1st."
- **Banner de las fichas:** "Explora más de 1,5 millones de audiolibros y libros electrónicos gratis durante 30 días / Al terminar tu prueba, sigue disfrutando por $11.99 al mes. Cancela cuando quieras. [Comienza tus 30 dias gratis]". El botón escribe "dias" sin tilde.
- **Sección Audiolibros:** "Accede a millones de ebooks, audiolibros y contenido exclusivo por solo $11.99 al mes. ¡Empieza hoy!" / "Cancela en cualquier momento."
- **Tabla comparativa de la portada** (captura 03), Everand frente a Audible Premium Plus y Spotify:
  - "Libros incluidos por mes": 1, 3, o 5 / 1 o 2 / Acceso limitado.
  - "Precio mensual": A partir de $11.99 / A partir de $14.95 / $12.99.
  - "Ebooks y audiolibros": Sí / No / No.
  - Más filas sobre Fable. Al pie: "Información competitiva extraída de Wired."

### 7.2 Página de planes (`/checkout/available-plans`, capturas 26–28)
- **Cabecera:** "Prueba gratis por 30 días" / "No te preocupes. Te enviaremos un correo electrónico antes de que termine el período de prueba."
- **Los tres planes:**
  - **Standard:** "Obtén 1 desbloqueo durante la prueba · 1 desbloqueo · $11.99/mes al terminar la prueba · [Prueba Standard por $0] · Cancela cuando quieras."
  - **Plus** ("Más popular"): "Obtén 1 desbloqueo durante la prueba · 3 desbloqueos · $16.99/mes al terminar la prueba · [Prueba Plus por $0]".
  - **Deluxe:** "Obtén 1 desbloqueo durante la prueba · 5 desbloqueos · $28.99/mes al terminar la prueba · [Prueba Deluxe por $0]".
- **"Todos los planes incluyen":**
  - "Cada desbloqueo equivale a un libro de nuestra biblioteca de más de 1.5 millones de títulos. Serán tuyos mientras tu suscripción permanezca activa."
  - "Disfruta de más de 20.000 audiolibros, libros electrónicos y pódcasts sin necesidad de desbloqueos."
  - Fable Plus incluido.
- **"Cómo funciona la prueba gratuita"** (captura 28):
  - Hoy: "**Debes $0.** ¡Comienza a leer gratis!"
  - Día 14: "Te **enviaremos un recordatorio por correo electrónico** sobre cuándo finalizará tu prueba."
  - Día 30: "El período de prueba finalizó. Cancela la suscripción antes del **26 de noviembre de 2026** para que no se te cobre ningún cargo." La fecha se calcula a partir del día en que se visita.
- **"Ayúdame a elegir"** (captura 27): un modal "¿Cuántos libros quieres leer por mes?" con un deslizador de 1 a 5+. Con 3 muestra: "Ideal para 3 libros al mes · Plus · Lector constante · $16.99 /mes · Incluye 1 libro gratuito durante tu prueba; 3 por mes posteriormente. · Lee a tu propio ritmo: los libros desbloqueados son tuyos mientras tu suscripción esté vigente. [Lee gratis hoy] Cambia de plan o cancela en cualquier momento."
- **Selectores:**
  - Botones de prueba: `[data-e2e=standard-plan-cta]`, `[data-e2e=plus-plan-cta]` y `[data-e2e=deluxe-plan-cta]`. **No pulsarlos al grabar:** llevan al registro y al CAPTCHA.
  - Asistente: `button:has-text("Ayúdame a elegir")`.

### 7.3 Letra pequeña disponible sin cuenta
- **Ayuda, "Acerca de tu prueba gratuita en Everand"** (actualizado el 01/09/2026; capturas 33 y 34):
  - "30 días si te suscribiste en el sitio web de Everand. 7 días si te suscribiste a través de la App Store o Google Play."
  - "Durante tu prueba, obtienes 1 un desbloqueo…" (sic).
  - "Tu prueba se renueva automáticamente en una suscripción paga **a menos que canceles al menos 24 horas antes** de que termine."
  - "**Si cancelas durante tu prueba, el acceso termina inmediatamente.**"
  - "Podrías ver un **cargo pendiente** durante tu prueba… Esto es una retención, no un cargo real."
  - "La pausa no está disponible durante una prueba gratuita." / "Una prueba por cuenta."
- **Acuerdo de Suscriptor de Everand** (actualizado el 25/10/2026; https://support.scribd.com/hc/es/articles/210129486):
  - "A menos que cancele su suscripción antes de que finalice su Prueba Gratuita, nosotros (o nuestro procesador de pagos externo) comenzaremos a cobrarle periódicamente la cuota de suscripción (más los impuestos y otros cargos aplicables) hasta que cancele su suscripción."
  - "Las Pruebas Gratuitas no se pueden combinar con ninguna otra oferta."
  - "Nos reservamos el derecho de modificar o cancelar las pruebas gratuitas en cualquier momento, sin previo aviso…"
  - "todas las tarifas y cargos no son reembolsables, salvo lo expresamente estipulado en nuestra Política de Reembolsos".
- **Reembolsos** (Ayuda, 19/10/2026):
  - Solo cargos de los últimos 30 días y por motivos tasados.
  - "No ofrecemos reembolsos parciales."
  - "Si estás en la UE o Reino Unido, tienes el derecho legal de desistir de tu suscripción dentro de los 14 días posteriores a la compra y recibir un reembolso completo."
- **App Store** (en inglés incluso en la tienda española):
  - "Enjoy a free trial for 30 days when you subscribe on our website, or a 7-day trial via the App Store - both include 1 free title."
  - "Our monthly subscription automatically renews unless canceled at least 24 hours prior to the next billing date."

### 7.4 Contradicciones útiles para el guion
1. **Cuánto duran los desbloqueos sin usar.**
   - La FAQ de la portada dice: "Los desbloqueos no canjeados se mantendrán **hasta 6 meses**" (captura 05).
   - La Ayuda **en inglés** coincide (23/10/2026): "Each unlock is valid for 6 months from the date it was issued." y "Unused unlocks rollover for up to six months".
   - **La traducción española del mismo artículo**, en cambio, dice: "Los desbloqueos no utilizados **expiran 30 días** después de recibirlos. No se acumulan." (captura 30). Lo mismo dice el artículo de planes en español.
   - Conclusión: lo vigente son 6 meses (el dossier lo sitúa desde el 7/4/2026), y la Ayuda en español está desfasada.
2. **¿Incluye Scribd y SlideShare?**
   - La descripción de Google Play en español dice: "Una suscripción a Everand también incluye acceso a: • Millones de presentaciones … en SlideShare. • Millones de documentos … en Scribd." La segunda imagen de la ficha repite la idea (captura 39).
   - La Ayuda dice lo contrario: "Tu suscripción Everand es independiente de Scribd y Slideshare."
   - Según el Acuerdo, el acceso combinado solo se mantiene para quien se suscribió antes del 10/11/2025 (plan Legacy).
   - La ficha de Google Play en EE. UU. ya está actualizada: habla de Fable Plus (captura 42).
3. **"Ilimitado".** La portada habla de "acceso ilimitado a una cuidada selección de más de 20, 000 [sic] audiolibros, ebooks y podcasts". Pero, según la Ayuda, "la mayoría" del catálogo de 1,5 millones requiere desbloqueo (captura 31).
4. **El precio en las tiendas.** La descripción de Google Play en español da "$149.99MXN"; el App Store da "$11.99/month", en USD y en inglés.

---

## 8. Apps oficiales

| Dato | Google Play | App Store (España) |
|---|---|---|
| Nombre | En España: **Everand**. En EE. UU.: **Everand: Audiobooks & Ebooks** | **Everand: audiolibros y libros**, con el subtítulo "audiolibros, libros y podcasts" |
| ID | `com.scribd.app.reader0` (el enlace del pie de everand.com) | **id542557212**, bundle `com.scribd.iscribd` |
| Desarrollador | Scribd, Inc. | Scribd |
| Valoración | España (`gl=ES`): **4,4★ · 614 mil reseñas**; pestaña Teléfono 4,3 (540 mil). EE. UU. (`hl=en&gl=US`): **3.5★ · 614K reviews**; pestaña Phone 3.4 (540K). México: 4,5 | **4,3★ · 851 valoraciones**. Otros países (API de iTunes): EE. UU. 4,27 (27.470), México 4,47 (2.568), Colombia 4,59 (522), Argentina 4,25 (469) |
| Descargas | **10 M+** ("10.000.000+ descargas") | Apple no las publica. Puesto "N.º 75" en Libros |
| Versión y fecha | 16.26 · 16 oct 2026 | 16.25 · 6 oct 2026 |
| Requisitos | Android 7.1 o posterior | iOS 17.0 o posterior; 273,1 MB |
| Edad | PEGI 3 (EE. UU.: ESRB Everyone) | 18+ |
| Compras integradas | "1,09 € - 23,99 € si se factura a través de Google Play" | "Compras dentro de la app: Sí" |
| Publicada | 17 feb 2012 | 7 ago 2012 (según la API de iTunes) |

Fuentes:
- https://play.google.com/store/apps/details?id=com.scribd.app.reader0&hl=es&gl=ES
- https://play.google.com/store/apps/details?id=com.scribd.app.reader0&hl=en&gl=US
- https://apps.apple.com/es/app/everand-audiolibros-y-libros/id542557212
- https://itunes.apple.com/lookup?id=542557212&country=es

**Reseñas visibles en las fichas:**
- **Google Play, España** (captura 41):
  - **BJD Producciones** (13/01/2024, 50 votos útiles): "es extremadamente complicado darse de baja…"
  - **Laura Sánchez** (02/04/2025): "por el precio mensual el contenido es algo pobre, faltan bastantes títulos, sobre todo los más populares…"
  - **Omar** (06/07/2024): pide márgenes personalizables.
- **Google Play, EE. UU.** (captura 43):
  - **Abigail M** (10/04/2026, 82 votos útiles): "To find out that your credits do not roll over… you do not get to keep any of the books you have unlocked(paid for) if you cancel your subscription! I most definitely will be going back to audible".
  - **Kat Falk** (20/03/2025): "It's EXTREMELY hard to find any of the 'unlimited access' items."
- **App Store, España** (captura 45):
  - "Tiene potencial, pero…" (miguecj86, 09/08/2020): "La interfaz no está a la altura de Storytel, ni tampoco el catálogo de audiolibros en español…"
  - "Value isn't there compared to audible" (21 abr).

---

## 9. Lo que dice la Ayuda pública (límites, descargas, cancelar y dispositivos)

| Tema | Cita o dato (artículo y fecha de actualización) | Captura |
|---|---|---|
| Desbloqueos | "Standard — 1 desbloqueo por mes · Plus — 3 · Deluxe — 5 (solo EE. UU.)". Se renuevan en la fecha de facturación. Si cancelas y vuelves con el mismo correo, recuperas los libros desbloqueados. Caducidad: en español "30 días"; en inglés "6 months" (§7.4). ("Cómo funcionan los desbloqueos en Everand", 23/10/2026) | 30 |
| Qué requiere desbloqueo | "La mayoría… Los libros que puedes disfrutar sin un desbloqueo están marcados como 'ilimitados'". La selección "ilimitada" "es una colección rotativa". Los pódcasts y los Everand Originals no requieren desbloqueo (17/08/2026) | 31 |
| Planes | Standard $11.99 USD/mes, Plus $16.99 y Deluxe $28.99 (este último solo en EE. UU.). "Disponible en web, iOS, Android, Apple Watch y CarPlay" (27/10/2026) | 32 |
| Descargas offline | "Puedes descargar contenido en **hasta 4 dispositivos**. Puedes abrir un libro dado en **hasta 6 dispositivos**… En la web, puedes leer en **hasta 3 navegadores dentro de 24 horas**." Las descargas solo existen en la app. Usan una licencia DRM que "necesita actualizarse periódicamente". Si la suscripción caduca, los libros descargados dejan de abrirse (29/09/2026) | 35 |
| Varios dispositivos | Se sincronizan el progreso, los guardados, los desbloqueos, los marcadores y el historial. No se sincronizan las descargas ni las preferencias de fuente. Plataformas: iPhone/iPad (iOS 17+), Android 7.1.1+, Kindle Fire (Fire OS 6+), web y Apple Watch (23/08/2026) | 36 |
| Cancelar | En la web: icono de perfil → "Su cuenta" → Suscripción → "Cancelar". Si te suscribiste por App Store o Google Play, hay que cancelar allí. En una suscripción de pago se mantiene el acceso hasta el final del periodo; **en la prueba, el acceso termina al cancelar** (15/10/2026) | 37 |
| Pausar | De 1 a 12 semanas. Solo si te suscribiste en la web y nunca durante la prueba (01/10/2026) | — |
| Reproductor | Reproducir/pausar, saltar de capítulo, avanzar o retroceder "normalmente 15 o 30 segundos", barra de progreso, **velocidad** ("1.00x"), **temporizador** (icono ☾) y capítulos. En la web, la luna está abajo a la derecha (20/10/2026) | 38 |
| Coche y reloj | Bluetooth, CarPlay, Android Auto y Apple Watch (20/10/2026) | — |
| Países | "no todos los títulos en Everand están disponibles en todos los países" (17/08/2026) | — |

**URLs** (todas empiezan por `https://support.scribd.com/hc/es/articles/`):

| ID | Artículo |
|---|---|
| 40677287041684 | Desbloqueos |
| 47040289862420 | Qué requiere desbloqueo |
| 40678839226644 | Planes |
| 46956976809236 | Prueba gratuita |
| 210135046 | Descargas |
| 47044532541076 | Varios dispositivos |
| 46929149941396 | Cancelar |
| 46929593791636 | Pausar |
| 47043813405332 | Reproductor |
| 6918062412308 | Bluetooth y CarPlay |
| 47039530597524 | Reembolsos |
| 210135206 | Países |
| 210129486 | Acuerdo de Suscriptor |

En el Centro de Ayuda aparece abajo a la derecha un globo de chat ("¿Tienes una pregunta? Estamos aquí para ayudar."). Es un iframe de `solve-widget.forethought.ai`. En las capturas 30–38 se ocultó con `visibility:hidden` aplicado solo a los iframes de la esquina inferior derecha.

---

## 10. Tiempos de carga y estado de la página para grabar

Medido con Playwright desde EE. UU.; DCL = DOMContentLoaded. Cada rango recoge entre 2 y 9 cargas por página.

| Página | DCL | `load` | Notas |
|---|---|---|---|
| Portada | 1,0–2,1 s | 2,6–5,4 s | ~125–155 peticiones. **`networkidle` tarda 20–24 s** por los rastreadores. Con el challenge JS hay una recarga extra. Con el CAPTCHA activo, el DCL llegó a 16,8 s |
| Ficha de audiolibro | 1,2–2,8 s | 2,5–4,8 s | ~110–130 peticiones |
| Ficha de ebook | 1,4–1,9 s | 2,5–4,1 s | — |
| Lector de vista previa | 2,4 s | 5,1 s | **425 peticiones** |
| Planes | 0,7–1,9 s | 1,9–3,6 s | — |
| Sección Audiolibros / Más vendidos | 2,2 s | 3,6–4,0 s | Más vendidos: 339 peticiones, muchas de carátulas |
| Resultados de búsqueda | — | — | aparecen **2,0–4,4 s** después de pulsar Intro |
| Muestra de audio | — | — | suena a los ~1,3–1,8 s del clic |
| Centro de Ayuda | 1,7 s | 4,0 s | — |

**Para planos limpios:**
1. **Cookies:** cerrar la barra de Osano con `button.osano-cm-dialog__close`. Solo aparece en la primera visita de cada perfil.
2. **Banner promocional en inglés:** está arriba, no tiene botón de cerrar y caduca el 1/11/2026. Para ocultarlo en la grabación: `document.querySelectorAll('[class*="NotificationManager-module_flashWrapper"]').forEach(e => e.style.display = 'none')`. Está **comprobado**: el selector encuentra 1 elemento y el resultado se ve en la captura 48. Otra opción es recortar 75 px CSS por arriba.
3. **Comprobar los botones principales antes de grabar:** `[data-e2e=read-free-btn]:visible` y `[data-e2e=megamenu-top-bar-read-free-button]` deben decir "…30 días", no "Cargando…" ni "…  días" (capturas 22–24 muestran el fallo).
4. **Subrayado ortográfico rojo** en la caja de búsqueda al teclear: se evita con `document.querySelector('#header_search_input').spellcheck = false` (comprobado en la captura 10), o lanzando Chromium con `--disable-spell-checking`.
5. **La cabecera cambia de una página a otra:** en la portada aparece "Iniciar sesión" y en las páginas interiores, un icono de usuario.
6. **El megamenú se abre al pasar el ratón** por "Audiolibros" y oscurece el resto. Para cerrarlo hay que alejar el ratón (y ≥ 800).
7. **Las páginas son estables:** no hay carruseles automáticos en la parte visible y las carátulas aparecen en menos de 1 s tras el evento `load`.

---

## 11. Recorridos recomendados para grabar

Todos los selectores se probaron el 27/10/2026 con Chromium a 1920×1080. Los guiones usan el formato de `tools/record.mjs`. Antes de empezar: `locale: 'es-ES'`, un user agent normal y **cada recorrido en su propia ejecución**, con unos minutos entre ejecuciones.

### R1 · Portada → idioma → megamenú → planes → FAQ (≈45 s)
URL: `https://es.everand.com/`
```json
{ "viewport": [1920,1080], "steps": [
  {"go": "https://es.everand.com/"},
  {"wait": 3000},
  {"eval": "document.querySelector('button.osano-cm-dialog__close')?.click()"},
  {"eval": "document.querySelectorAll('[class*=\"NotificationManager-module_flashWrapper\"]').forEach(e=>e.style.display='none')"},
  {"record": true},
  {"wait": 1500},
  {"moveSel": "[data-e2e=landing-hero-banner-cta]", "dur": 900},
  {"wait": 1200},
  {"clickSel": "[data-e2e=megamenu-top-bar-language-picker-button]", "dur": 900},
  {"wait": 1800},
  {"press": "Escape"},
  {"moveSel": "a[href$='/audiobooks']:visible", "dur": 900},
  {"wait": 2500},
  {"move": [960, 950], "dur": 700},
  {"scroll": 1100, "dur": 2500},
  {"wait": 2500},
  {"scroll": 1400, "dur": 2500},
  {"wait": 2500},
  {"clickSel": "button:has-text('¿Qué es un desbloqueo?') >> nth=-1", "dur": 900},
  {"wait": 3000}
]}
```

### R2 · Búsqueda tecleada y filtros (≈60 s)
Hay que **teclear desde la portada**: si se abre directamente `/search?query=…`, la página sale en blanco (§2).
```json
{ "viewport": [1920,1080], "steps": [
  {"go": "https://es.everand.com/"},
  {"wait": 5000},
  {"eval": "document.querySelector('button.osano-cm-dialog__close')?.click(); document.querySelector('#header_search_input').spellcheck=false"},
  {"record": true},
  {"clickSel": "#header_search_input", "dur": 900},
  {"type": "Crimen y castigo", "delay": 90},
  {"wait": 1500},
  {"press": "Enter"},
  {"wait": 5000},
  {"clickSel": "a[href*='content_type=audiobooks']", "dur": 900},
  {"wait": 4000},
  {"clickSel": "[data-e2e=filter-language] button", "dur": 900},
  {"wait": 2500},
  {"press": "Escape"},
  {"clickSel": "#header_search_input", "dur": 700},
  {"eval": "document.querySelector('#header_search_input').select()"},
  {"type": "García Márquez", "delay": 90},
  {"press": "Enter"},
  {"wait": 5000},
  {"clickSel": "a[href*='content_type=audiobooks']", "dur": 900},
  {"wait": 4000},
  {"clickSel": "#header_search_input", "dur": 700},
  {"eval": "document.querySelector('#header_search_input').select()"},
  {"type": "Hábitos atómicos", "delay": 90},
  {"press": "Enter"},
  {"wait": 5000}
]}
```

### R3 · Ficha de audiolibro con muestra (≈40 s)
URL: `https://es.everand.com/audiobook/824861714/Crimen-y-castigo`. Se entra primero por la portada para que el challenge se resuelva.
```json
{ "viewport": [1920,1080], "steps": [
  {"go": "https://es.everand.com/"},
  {"wait": 5000},
  {"go": "https://es.everand.com/audiobook/824861714/Crimen-y-castigo"},
  {"wait": 4000},
  {"record": true},
  {"moveText": "Luis David García Márquez", "dur": 1000},
  {"wait": 1500},
  {"moveSel": "[data-e2e=read-free-btn]:visible", "dur": 900},
  {"wait": 1000},
  {"clickSel": "[data-e2e=play-preview-button]:visible", "dur": 900},
  {"mark": "muestra_play"},
  {"wait": 8000},
  {"clickSel": "[data-e2e=play-preview-button]:visible", "dur": 600},
  {"scroll": 900, "dur": 2500},
  {"wait": 2500}
]}
```
- **Antes de `record`**, comprobar que el botón principal dice "30 días" (§10, punto 3). Si no, no grabar y repetir más tarde.
- **Reseñas:** están en `text=Comentarios para`, a ≈ +2.600 px desde arriba.
- **Voz sintética:** la misma receta vale para `https://es.everand.com/audiobook/913213094/Yo-comandante-de-Auschwitz`, con `{"moveText": "Martín Quirós (voz sintética)"}`.

### R4 · Ebook y lector de vista previa (≈30 s, **puede fallar**)
- Ruta: `https://es.everand.com/book/419912634/Crimen-y-castigo` → clic en `[data-e2e=read-preview]:visible` → `https://es.everand.com/read/419912634/Crimen-y-castigo`.
- Desde este servidor **el texto del libro no cargó en 3 intentos**: las peticiones `/read2/…/access_token` y `/scepub/…` recibieron el challenge (captura 25).
- Controles del lector: `.page_right.next_btn` ("Página siguiente"), `.page_left.prev_btn` y `.toggle_fullscreen`. La franja inferior ofrece "Comienza tu prueba gratuita".
- Recomendación: grabarlo desde un Chrome normal.

### R5 · Planes y prueba (≈35 s). No pulsar "Prueba … por $0"
URL: `https://es.everand.com/checkout/available-plans`
```json
{ "viewport": [1920,1080], "steps": [
  {"go": "https://es.everand.com/checkout/available-plans"},
  {"wait": 3000},
  {"record": true},
  {"moveSel": "[data-e2e=standard-plan-cta]", "dur": 900},
  {"wait": 800},
  {"moveSel": "[data-e2e=plus-plan-cta]", "dur": 900},
  {"wait": 800},
  {"moveSel": "[data-e2e=deluxe-plan-cta]", "dur": 900},
  {"wait": 1500},
  {"clickSel": "button:has-text('Ayúdame a elegir')", "dur": 900},
  {"wait": 3500},
  {"press": "Escape"},
  {"wait": 800},
  {"scroll": 1500, "dur": 3000},
  {"wait": 4000}
]}
```

### R6 · Ayuda (≈20 s por artículo)
- URLs: las del §9. Las páginas son estables (≈4 s hasta `load`) y no tienen antibots.
- Para ir directo a la sección clave:
  - descargas: `h2:has-text("Límites de dispositivo")`;
  - desbloqueos: `h2:has-text("Bueno saber")`;
  - prueba: `h2:has-text("Qué sucede al final")`.
- Para ocultar el globo de chat: `document.querySelectorAll('iframe').forEach(f=>{const r=f.getBoundingClientRect(); if(r.right>1500&&r.bottom>700) f.style.visibility='hidden'})`.

### R7 · Tiendas
- **Google Play, España:** `https://play.google.com/store/apps/details?id=com.scribd.app.reader0&hl=es&gl=ES`. Para ver versión y precios: pulsar `button[aria-label*='Información de la aplicación']` y bajar hasta "Compras en la aplicación".
- **Google Play, EE. UU.** (3.5★): `…&hl=en&gl=US`.
- **App Store:** `https://apps.apple.com/es/app/everand-audiolibros-y-libros/id542557212`. Bajar hasta `text=Valoraciones y reseñas`.
- En ninguna de las dos tiendas hubo bloqueos ni ventanas emergentes.

---

## 12. Lo NO VERIFICADO
- **Precios desde España:** moneda, importes y si se ofrecen los planes. Haría falta un navegador con IP española.
- **Pantalla de registro y pago:** su texto legal, porque desde aquí la bloquea el CAPTCHA.
- **Producto por dentro:** el reproductor completo de la web (velocidad, temporizador, capítulos) y cómo se ve el botón "Desbloquear".
- **Lector de vista previa:** si carga con normalidad en un Chrome real; desde aquí se quedó en el esqueleto.
- **Antibots en un Chrome real:** si en un navegador normal con conexión doméstica también saltan los challenges de Fastly o el aviso "Iniciar sesión con Google".
- **Valoraciones:** si se agrupan por obra, mezclando ediciones e idiomas.
- **Otros títulos con voz sintética:** *El Príncipe* y *Bailén*. La ficha 723885728 no se pudo abrir por el CAPTCHA.
- **Página "Ilimitado"** (`/unlimited`): no se capturó.

## 13. Lista de capturas
Carpeta: `assets/everand/screens/`. Son PNG de 3840×2160 (1920×1080 CSS con DPR 2), todas del 27/10/2026.

| Nº | Archivo | Contenido |
|---|---|---|
| 01 | `01-home-primera-visita-banner-cookies.png` | Portada en la primera visita: banner promocional en inglés y barra de cookies de Osano |
| 02 | `02-home-hero.png` | Portada sin cookies: "Descubre Everand", "Desde $11.99/mes…" |
| 03 | `03-home-comparativa-audible-spotify.png` | Tabla Everand / Audible Premium Plus / Spotify ("Información competitiva extraída de Wired") |
| 04 | `04-home-planes-standard-plus-deluxe.png` | Carrusel de bestsellers de EE. UU. y "Elige el plan que más te guste" |
| 05 | `05-home-faq-desbloqueos-6-meses.png` | FAQ desplegada: "se mantendrán hasta 6 meses" |
| 06 | `06-selector-de-idioma.png` | Selector de idioma ES ▾ |
| 07 | `07-megamenu-audiolibros.png` | Megamenú Audiolibros |
| 08 | `08-seccion-audiolibros.png` | `/audiobooks`: audiolibros más vendidos en español |
| 09 | `09-audiolibros-mas-vendidos.png` | `/bestsellers/audiobooks` |
| 10 | `10-busqueda-autocompletado-crimen-y-castigo.png` | Autocompletado de la búsqueda, sin subrayado ortográfico y con el banner promocional oculto |
| 11 | `11-busqueda-crimen-y-castigo-todo.png` | Resultados "Todo": 59 audiolibros y 793 ebooks |
| 12 | `12-busqueda-crimen-y-castigo-pestana-audiolibros.png` | Pestaña Audiolibros |
| 13 | `13-busqueda-filtro-idioma-espanol-por-defecto.png` | Filtro Idioma abierto, con Español marcado |
| 14 | `14-busqueda-isabel-allende-audiolibros.png` | Autora: 29 ebooks y 31 audiolibros |
| 15 | `15-busqueda-habitos-atomicos-sin-edicion-oficial.png` | Sin la obra de James Clear: lista de "parecidos" |
| 16 | `16-busqueda-best-seller-la-asistenta.png` | *La asistenta (castellano)* y 38 audiolibros de McFadden |
| 17 | `17-busqueda-garcia-marquez-audiolibros.png` | 180 audiolibros, con portadas |
| 18 | `18-busqueda-perez-reverte-audiolibros.png` | 72 audiolibros, con portadas |
| 19 | `19-ficha-audiolibro-crimen-y-castigo-penguin.png` | Ficha de 24 h, narrador, botones con "30 días" bien |
| 20 | `20-ficha-muestra-reproduciendo-boton-pausa.png` | Muestra sonando: el botón dice "Pausa" |
| 21 | `21-ficha-valoraciones-y-resenas.png` | "Comentarios para Crimen y castigo": 9.532 valoraciones y 182 comentarios |
| 22 | `22-ficha-voz-sintetica-yo-comandante-de-auschwitz.png` | "Narrado por Martín Quirós (voz sintética)" (con el fallo "durante  días") |
| 23 | `23-ficha-audiolibro-la-casa-de-los-espiritus.png` | Narradores Javiera Gazitua y Senén Arancibia (con el fallo "durante  días") |
| 24 | `24-ficha-ebook-crimen-y-castigo.png` | Ficha de ebook con "Leer vista previa" (con el fallo "Prueba gratis por  días") |
| 25 | `25-lector-vista-previa-no-carga.png` | Lector de vista previa atascado en el esqueleto (XHR desafiadas) |
| 26 | `26-planes-y-precios.png` | Standard $11.99, Plus $16.99 y Deluxe $28.99 |
| 27 | `27-planes-ayudame-a-elegir.png` | Modal "¿Cuántos libros quieres leer por mes?" |
| 28 | `28-planes-como-funciona-la-prueba-30-dias.png` | Línea temporal Hoy / Día 14 / Día 30 ("antes del 26 de noviembre de 2026") |
| 29 | `29-registro-bloqueado-captcha-fastly.png` | CAPTCHA de Fastly al pulsar "Prueba Plus por $0" |
| 30 | `30-ayuda-como-funcionan-los-desbloqueos.png` | "Bueno saber": "expiran 30 días" (versión en español, desfasada) |
| 31 | `31-ayuda-que-libros-requieren-desbloqueo.png` | Artículo de la Ayuda |
| 32 | `32-ayuda-planes-standard-plus-deluxe.png` | Artículo de la Ayuda |
| 33 | `33-ayuda-prueba-gratuita-30-o-7-dias.png` | Artículo de la Ayuda |
| 34 | `34-ayuda-prueba-gratuita-al-final-y-cancelacion.png` | Artículo de la Ayuda |
| 35 | `35-ayuda-descargas-sin-conexion-limites.png` | Artículo de la Ayuda |
| 36 | `36-ayuda-leer-en-varios-dispositivos.png` | Artículo de la Ayuda |
| 37 | `37-ayuda-cancelar-suscripcion.png` | Artículo de la Ayuda |
| 38 | `38-ayuda-reproductor-audiolibros-velocidad-temporizador.png` | Artículo de la Ayuda |
| 39 | `39-google-play-es-ficha.png` | Ficha en España: 4,4★, 614 mil reseñas, 10 M+ |
| 40 | `40-google-play-es-info-version-descargas-precios.png` | v16.26, Android 7.1, 10.000.000+ descargas, 1,09–23,99 € |
| 41 | `41-google-play-es-valoraciones.png` | Valoraciones y reseñas en España |
| 42 | `42-google-play-ee-uu-ficha-3-5-estrellas.png` | Ficha en EE. UU.: "Everand: Audiobooks & Ebooks", 3.5★ |
| 43 | `43-google-play-ee-uu-valoraciones.png` | Valoraciones y reseñas en EE. UU. (Phone 3.4) |
| 44 | `44-app-store-es-ficha.png` | App Store España: 4,3★, 851 valoraciones, 18+, N.º 75, 273,1 MB |
| 45 | `45-app-store-es-valoraciones.png` | Reseñas del App Store (miguecj86…) |
| 46 | `46-fallo-busqueda-por-url-directa-en-blanco.png` | Página en blanco al abrir `/search?...` directamente |
| 47 | `47-bloqueo-captcha-fastly-en-toda-la-web.png` | CAPTCHA en toda la web tras muchas visitas |
| 48 | `48-home-hero-plano-limpio-sin-banner-promo.png` | Portada sin el banner promocional (oculto por CSS): plano limpio |
