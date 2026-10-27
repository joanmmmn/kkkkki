# Dossier de investigación: EVERAND (everand.com), el servicio de ebooks y audiolibros de Scribd Inc.

**Para:** vídeo-review de YouTube + artículo de blog de SonorBooks (sonorbooks.com), público hispanohablante (España + Latinoamérica)
**Fecha de la investigación:** 27 de octubre de 2026
**Elaborado con:** lectura directa (curl) de páginas públicas: centro de ayuda oficial, web de Everand, fichas de App Store y Google Play, prensa. También búsquedas web. No se creó ninguna cuenta ni se introdujeron datos de pago.

---

## 0. Nota de método (LEER PRIMERO)

- **Fuente principal: el centro de ayuda oficial.** Está en `support.scribd.com` (no existe un "help.everand.com"). Se leyó el texto completo de unos 30 artículos a través de su API pública, con fechas de creación y de última actualización. Casi todos los datos sobre planes, desbloqueos, prueba gratis y cancelación salen de ahí, con fecha.
- **Sesgo geográfico (importante):** las peticiones salieron desde una IP de **EE. UU.** Por eso everand.com muestra precios en **dólares**. La propia Everand dice que el precio local "solo se ve al registrarse". Los precios de España y Latinoamérica salen de:
  - las **listas de compras dentro de la app del App Store** de cada país, leídas hoy. Ojo: el precio de Apple puede ser distinto del precio web;
  - artículos oficiales de 2025 que ya no están en línea (recuperados por extractos del buscador).
- **Catálogo:** las cifras de títulos en español son **estimaciones propias**. Se obtuvieron con el buscador público de everand.com (`everand.com/search/query`), filtrando por idioma y por catálogo. Se hicieron desde EE. UU.: **la disponibilidad en España o México puede ser distinta** por licencias regionales, como reconoce Everand.
- **Bloqueos de la herramienta:** WebFetch falló por DNS. Trustpilot devolvió 403 (anti-bot, y no se intentó saltarlo). Wikipedia dio 429 (límite de peticiones). kobo.com dio 403 y amazon.com.mx dio 503. **Reddit no se consultó directamente.** Las opiniones de usuarios salen de las reseñas que muestran App Store y Google Play, de extractos de Trustpilot en el buscador y de un análisis de 1.658 reseñas de Google Play publicado por unstar.app.
- **Etiquetas:**
  - **[VERIFICADO]**: fuente oficial o primaria leída directamente, o dos fuentes independientes.
  - **[FUENTE ÚNICA]**: una sola fuente, sin contraste.
  - **[NO VERIFICADO]**: no se pudo confirmar.
  - **[CONTRADICTORIO]**: las fuentes, a veces la propia Everand, se contradicen.
  - **[ESTIMACIÓN PROPIA]**: cálculo nuestro a partir de datos públicos.
  - **[OPINIÓN]**: valoración de usuarios o medios.

---

## 1. Resumen ejecutivo (TL;DR)

- **Qué es:** Everand es la app y web de **ebooks, audiolibros y podcasts** de **Scribd, Inc.** (San Francisco, empresa privada). Nació al dividir Scribd: se anunció el 20-sep-2023 y se lanzó en noviembre de 2023.
  - **Scribd** se quedó con los documentos y **Slideshare** con las presentaciones.
  - Desde el **10-nov-2025** las suscripciones nuevas son **separadas**. Quien ya pagaba antes conserva el paquete conjunto ("Legacy").
- **Ya NO es "ilimitado".** Desde el **30-oct-2024** (EE. UU.) funciona con **desbloqueos** (*unlocks*):
  - **Standard:** 1 libro al mes por **11,99 $**.
  - **Plus:** 3 libros al mes por **16,99 $** (el más popular).
  - **Deluxe:** 5 libros al mes por **28,99 $**.
  - Cada desbloqueo da acceso a un libro **mientras sigas suscrito**. Si cancelas, lo pierdes; si vuelves con el mismo correo, lo recuperas.
  - Sin desbloqueo hay una **selección rotativa de unos 20.000 títulos "unlimited"** (podcasts, Everand Originals y libros de fondo).
  - Desde el **7-abr-2026** los desbloqueos no usados se acumulan **hasta 6 meses**.
- **Prueba gratis:** **30 días si te das de alta en la web** y **7 días si lo haces desde App Store o Google Play**. En los dos casos **incluye solo 1 desbloqueo**, sea cual sea el plan, y **pide método de pago**.
- **Precios locales (octubre de 2026):**
  - **España:** Plus **14,99 €** (App Store). Standard **sin confirmar**.
  - **México:** Standard **149 MXN** (App Store). Plus **326 MXN** (dato oficial de 2025).
  - **Colombia:** 49.900 / 79.900 COP (App Store).
  - **Chile:** Standard 9.990 CLP.
  - **Argentina:** 9,99 / 16,99 USD.
  - **Deluxe:** la ayuda en español dice "solo EE. UU."; la nota de prensa de jun-2026 dice "casi todos los mercados". **[CONTRADICTORIO]**
- **Catálogo en español (estimación desde EE. UU.):**
  - Unos **41.000 audiolibros en español**, con **Penguin Random House Audio** y **Planeta Audio** (García Márquez, Vargas Llosa, Ruiz Zafón, Pérez-Reverte, Gómez-Jurado, Posteguillo, Follett, Allende...). **Casi todos exigen desbloqueo.**
  - En el catálogo "unlimited" solo hay **unos 500-650 audiolibros en español**, muchos de ellos clásicos **abreviados** y autoayuda.
  - Hay títulos con **voz sintética** etiquetada en los créditos.
- **Valoraciones:**
  - **Google Play:** **3,5★ en EE. UU.** (donde llegaron primero los desbloqueos) y **4,3-4,5★ en España y Latinoamérica**, con **614.122 valoraciones** en total y **más de 10 M de descargas**.
  - **App Store:** 4,3★ en EE. UU. (27.470 valoraciones), 4,3★ en España (851) y 4,5★ en México (2.568).
  - **Trustpilot:** alrededor de **1,5/5** (extracto del buscador).
- **Polémicas:**
  - El paso de "ilimitado" a desbloqueos. No es la primera vez: Scribd ya lo hizo en 2015-2016 y lo revirtió en 2018.
  - Usuarios que perdieron libros al migrar del plan Legacy.
  - Perder lo desbloqueado al cancelar.
  - **Incidente de seguridad** comunicado el **21-sep-2026**, que afecta a Scribd, Slideshare, Everand y Fable.
  - Quejas antiguas por cobros tras cancelar.
- **Competencia en España (oct-2026):**
  - **Audible Premium:** 9,99 €, ilimitado dentro de su catálogo incluido.
  - **Storytel Unlimited:** 8,99 €, sin límite de horas.
  - **Spotify:** 12 h al mes en Premium desde el 7-oct-2026.
  - **Kindle+** (antes Kindle Unlimited): rebautizado el 23-oct-2026, ahora con audiolibros.
  - **Podimo:** 4,99 € por 20 h. **BookBeat:** desde 6,99 € por 20 h. **Nextory:** desde 5,99 € por 10 h.

---

## 2. Qué es Everand e historia

### 2.1 Identidad

| Dato | Valor | Estado | Fuente |
|---|---|---|---|
| Empresa | **Scribd, Inc.**, matriz de cuatro productos: Scribd, Slideshare, Everand y Fable | [VERIFICADO] | https://www.scribdinc.com/newsroom/what-is-scribd-inc |
| Sede | San Francisco (460 Bryant St). Empresa **privada**, fundada en **2007** | [VERIFICADO] | Misma fuente; ficha de Google Play (dirección del desarrollador) |
| Contrato para usuarios de la UE y el Reino Unido | **Scribd Netherlands B.V.** | [VERIFICADO] | https://support.scribd.com/hc/en-us/articles/43178587356564-Scribd-Premium-Terms-of-Sale (sección 9) |
| CEO | **Tony Grimminck**: CFO desde 2019 y CEO "desde 2023" según la empresa (Fortune lo publicó en abril de 2024) | [VERIFICADO] (la fecha exacta varía según la fuente) | https://www.scribdinc.com/about ; https://fortune.com/2024/04/12/scribd-tony-grimminck-new-ceo-cfo/ |
| Inversores | Redpoint Ventures, Spectrum Equity, LGT Capital Partners, Tencent | [VERIFICADO] | https://www.scribdinc.com/about |
| Empleados en | EE. UU., Canadá, **México**, Reino Unido y Países Bajos | [VERIFICADO] | https://www.scribdinc.com/about |
| Suscriptores de pago | **"2M+ paying subscribers"**, cifra de todo Scribd Inc. **No hay cifra separada de Everand** | [AFIRMACIÓN PROPIA] | https://www.scribdinc.com/about |
| Cuentas | **1.000 millones de cuentas** creadas desde 2007 en Scribd, Slideshare y Everand (6-ago-2026) | [AFIRMACIÓN PROPIA] | https://www.scribdinc.com/newsroom/scribd-inc-surpasses-one-billion-users |
| Visitantes mensuales en la UE (DSA) | ~17,07 millones de media (Scribd, Slideshare y Everand), en los 6 meses hasta el 17-feb-2024. No hay dato más reciente | [VERIFICADO, dato antiguo] | https://support.scribd.com/hc/es/articles/24001072212500 |
| Fable (app hermana de lectura social) | Comprada en **junio de 2025**. 5 M de usuarios y unos 200.000 clubes de lectura (2026) | [VERIFICADO] | Business Wire, 9-jun-2025: https://www.businesswire.com/news/home/20250609165978/en/ ; https://www.scribdinc.com/newsroom/scribd-inc-surpasses-one-billion-users |
| Apps | iOS: `id542557212`, la antigua app de Scribd. Android: `com.scribd.app.reader0`, publicada el 17-feb-2012 como Scribd | [VERIFICADO] | https://apps.apple.com/es/app/id542557212 ; https://play.google.com/store/apps/details?id=com.scribd.app.reader0 |

### 2.2 La separación de 2023: qué se quedó en cada sitio

- **Anuncio:** el 20-sep-2023 (Publishers Lunch). Scribd dividía su contenido en tres productos: **ebooks y audiolibros pasan a una app nueva, Everand**; scribd.com y una nueva app de Scribd se quedan con los documentos subidos por la comunidad; Slideshare sigue aparte. [VERIFICADO]
  - https://lunch.publishersmarketplace.com/2023/09/scribd-will-move-ebooks-and-audiobooks-to-new-app/
  - Jane Friedman, 27-sep-2023: https://janefriedman.com/scribd-launches-everand-for-ebooks-and-audiobooks/
- **Lanzamiento:** noviembre de 2023. Scribd Inc. publicó el enlace a everand.com en LinkedIn el **1-nov-2023** (fecha deducida del identificador del post). [VERIFICADO parcialmente] https://www.linkedin.com/posts/scribd_everand-ebooks-audiobooks-more-read-activity-7125600268410314752-e5Bg
- **El porqué, según la empresa:** "Quien busca investigación revisada por pares y quien busca su próximo audiolibro romántico tienen necesidades distintas". Fue una decisión estratégica de "desagrupar". [AFIRMACIÓN PROPIA] https://www.scribdinc.com/newsroom/what-is-scribd-inc
- **Qué se quedó en Scribd:** documentos, investigación, apuntes y manuales ("300M+ pieces of content"). **"Scribd no tiene ebooks, audiolibros ni podcasts; eso es Everand."** [VERIFICADO] (misma fuente)
- **Qué pasó a Everand:** ebooks, audiolibros, podcasts, revistas, partituras y Everand Originals.
  - **Revistas y partituras se retiraron el 28-ene-2025.** [VERIFICADO] https://support.scribd.com/hc/es/articles/33823101289748
- **Suscripciones:**
  - **2023-2025:** **una sola suscripción** daba acceso a Everand, Scribd y Slideshare.
  - **Desde el 10-nov-2025:** las suscripciones nuevas son **separadas**. Scribd y Slideshare pasan a "Scribd Premium" por 11,99 $ al mes; Everand tiene sus propios planes.
  - Quien estaba suscrito antes del 10-nov-2025 **conserva el acceso conjunto** mientras no cambie a un plan con desbloqueos ni cancele. [VERIFICADO]
  - Fuentes:
    - https://support.scribd.com/hc/en-us/articles/43178587356564-Scribd-Premium-Terms-of-Sale (sección 6)
    - https://support.scribd.com/hc/en-us/articles/210129486-Everand-Subscriber-Agreement
    - https://support.scribd.com/hc/en-us/articles/46956730590484-I-m-on-a-Legacy-Everand-plan
- **Aviso a los usuarios:** "Las suscripciones no se pueden transferir entre Scribd y Everand. Si te suscribiste al producto equivocado, cancela y suscríbete al otro" (artículo creado el 30-jul-2026). [VERIFICADO] https://support.scribd.com/hc/en-us/articles/51955535312788-Subscribed-to-the-wrong-product

### 2.3 Cronología

| Fecha | Hito | Fuente |
|---|---|---|
| Mar-2007 | Se funda Scribd (Trip Adler, Jared Friedman y Tikhon Bernstam; Y Combinator) como web para compartir documentos | https://www.scribdinc.com/newsroom/what-is-scribd-inc ; Wikipedia (vía buscador) |
| 1-oct-2013 | Scribd lanza la suscripción de ebooks a **8,99 $/mes**, con HarperCollins como gran socio | Shelf Awareness, 2-oct-2013: https://www.shelf-awareness.com/theshelf/2013-10-02/scribd_launches_e-book_subscription_service.html |
| 6-nov-2014 | Añade **más de 30.000 audiolibros** sin coste extra (Blackstone, HarperCollins, Scholastic, Naxos) | PW: https://www.publishersweekly.com/pw/by-topic/digital/content-and-e-books/article/64641-scribd-adds-30k-audiobooks-to-subscription-service.html ; TechCrunch: https://techcrunch.com/2014/11/06/scribd-audiobooks |
| 24-ago-2015 | **Primer recorte:** 1 audiolibro al mes de una parte del catálogo; los extra se pagan con "audio credits" de 8,99 $ | https://lunch.publishersmarketplace.com/2015/08/next-scribd-curtails-unlimited-audiobooks/ |
| 16-feb-2016 | **Fin del ilimitado de ebooks:** 3 libros y 1 audiolibro al mes | https://lunch.publishersmarketplace.com/2016/02/scribd-drops-unlimited-subscription-model/ |
| Feb-2018 | **Vuelta al "ilimitado"** con catálogos rotativos y límites discrecionales en 30 días | Wikipedia (vía buscador) [FUENTE ÚNICA] |
| 2020 | Scribd compra Slideshare a LinkedIn | https://www.scribdinc.com/newsroom/scribd-inc-surpasses-one-billion-users |
| 20-sep-2023 | Anuncio de la separación: nace Everand | Publishers Lunch |
| Nov-2023 | Everand en línea (post de LinkedIn del 1-nov-2023) | LinkedIn |
| 30-oct-2024 | **Modelo de desbloqueos en EE. UU.:** Standard 11,99 $ (1 título premium) y Plus 16,99 $ (3). Acuerdos ampliados con las **cinco grandes** (Hachette, HarperCollins, Macmillan, PRH, S&S) y novedades **sin ventana**. Plan: retirar el ilimitado "Legacy" en el 2.º trimestre de 2025 y expansión internacional "con foco en el español" | PW: https://www.publishersweekly.com/pw/by-topic/digital/content-and-e-books/article/96350-scribd-to-launch-credit-based-model-expand-big-five-partnerships.html |
| 13/28-ene-2025 | Se retiran **revistas y partituras** | https://support.scribd.com/hc/es/articles/33823101289748 |
| Jun-2025 | Standard y Plus llegan a **México y Latinoamérica** (título original del artículo de ayuda, hoy retirado) | Extracto del buscador: https://support.scribd.com/hc/pl/articles/29859144648596 [NO VERIFICADO en vivo; artículo retirado] |
| 9-jun-2025 | Everand (Scribd Inc.) **compra Fable** | Business Wire: https://www.businesswire.com/news/home/20250609165978/en/ |
| 20-ago-2025 | Nuevo plan **Deluxe**: 28,99 $ por 5 títulos (EE. UU.). Lo más leído de 2025: *Onyx Storm*, *Iron Flame* y *Fourth Wing* | PW: https://www.publishersweekly.com/pw/by-topic/digital/content-and-e-books/article/98426-scribd-s-everand-adds-deluxe-subscription-tier.html |
| 10-nov-2025 | **Suscripciones separadas** Scribd/Everand para altas nuevas | Scribd Premium Terms of Sale (creado ese día) |
| 7-ene/16-ene-2026 | Arreglos: reproductor que solo reproducía muestras (iOS), Android Auto y accesibilidad (VoiceOver) | https://support.scribd.com/hc/en-us/articles/39389021447316-Known-issues-on-Everand |
| 7-abr-2026 | **Los desbloqueos se acumulan hasta 6 meses** (iOS 16.6) | Historial de versiones del App Store (España): https://apps.apple.com/es/app/id542557212 |
| 11-may-2026 | La app pasa a 4 idiomas de interfaz: inglés, **español**, portugués y francés (iOS 16.8) | Historial del App Store |
| 2/3-jun-2026 | **Everand y Fable, una sola suscripción** (Fable Plus incluido). Standard, Plus y Deluxe "en casi todos los mercados". Plus, el plan más popular | PR Newswire, 2-jun-2026: https://www.prnewswire.com/news-releases/everand-and-fable-launch-a-single-shared-subscription-302788169.html ; PW: https://www.publishersweekly.com/pw/by-topic/industry-news/industry-deals/article/100534-everand-and-fable-create-community-of-five-million-users.html ; TechCrunch: https://techcrunch.com/2026/06/02/a-startup-everand-is-now-bundling-ebooks-audiobooks-and-book-clubs-in-challenge-to-amazon/ |
| 26-jun-2026 | Programa de **referidos**: el amigo recibe 2 desbloqueos en la prueba y tú 1 cuando paga | https://support.scribd.com/hc/en-us/articles/50723460042772-Everand-Referrals |
| 14/20-jul-2026 | Checklist para usuarios en prueba; pago con **Venmo** | Historial del App Store |
| 6-ago-2026 | Scribd Inc. anuncia 1.000 millones de cuentas | Newsroom de Scribd Inc. |
| 28-ago-2026 | "Coming soon": guardar títulos antes de su publicación | Historial del App Store (16.22) |
| **21-sep-2026** | **Incidente de seguridad:** acceso no autorizado a sistemas internos y datos de usuarios. Se recomienda cambiar la contraseña de Scribd, Slideshare, Everand y Fable | https://support.scribd.com/hc/en-us/articles/53787421531284-Information-about-the-recent-security-incident |
| 6-oct-2026 | iOS 16.25 (última versión vista) | App Store |
| 16-oct-2026 | Última actualización en Google Play | Ficha de Google Play |
| Oct-2026 | Promo "SPOOKY26": 2 libros y 30 días gratis, más un 25 % de descuento el primer mes en Plus o Deluxe, hasta el 1-nov | Banner en https://www.everand.com/checkout/available-plans (leído el 27-oct-2026) |

---

## 3. Precios, prueba gratis y cancelación

### 3.1 Planes actuales (precio oficial en EE. UU.)

| Plan | Precio | Desbloqueos al mes | Coste por libro (dato de la web de Everand) | Estado |
|---|---|---|---|---|
| **Standard** | **11,99 $/mes** | 1 | 11,99 $ | [VERIFICADO] |
| **Plus** ("Most popular") | **16,99 $/mes** | 3 | **5,66 $** | [VERIFICADO] |
| **Deluxe** | **28,99 $/mes** | 5 | **5,80 $**: **sale más caro por libro que Plus** | [VERIFICADO] |
| Todos | + unos 20.000 títulos "unlimited" sin desbloqueo + **Fable Plus** gratis | | | [VERIFICADO] |

- Fuentes, leídas el 27-oct-2026: https://www.everand.com/ ; https://www.everand.com/checkout/available-plans (el JSON de la página incluye el campo `formattedCostPerUnlock`) ; https://support.scribd.com/hc/en-us/articles/40678839226644-Everand-plans-Standard-Plus-and-Deluxe (actualizado el 27-oct-2026).
- **Plan anual:** **no se vende a altas nuevas**: "We don't currently sell annual subscriptions". Quien tiene un anual Legacy puede conservarlo. [VERIFICADO] https://support.scribd.com/hc/en-us/articles/46956730590484
  - El código de la web contiene un precio anual de 119,99 $, pero no aparece en la oferta pública. [NO VERIFICADO como oferta vigente]
- **No hay plan familiar ni perfiles.** No aparece ningún plan de ese tipo en la ayuda. El acuerdo de suscriptor **prohíbe compartir cuentas** ("You may not share accounts"). [VERIFICADO] https://support.scribd.com/hc/en-us/articles/210129486-Everand-Subscriber-Agreement

### 3.2 Precio por país (mensual)

| País | Standard (1) | Plus (3) | Deluxe (5) | Planes antiguos ("Legacy", ilimitado con límites) | Fuente y estado |
|---|---|---|---|---|---|
| **EE. UU.** | **11,99 $** | **16,99 $** | **28,99 $** | Legacy 11,99 $ (antes 9,99 $ al lanzar Everand) | Web oficial y ayuda [VERIFICADO, 27-oct-2026] |
| **España** | **No confirmado.** Posible 10,99 € (extracto de everand.com/audiobooks: "from €10,99/month") | **14,99 €** (compra en la app, App Store España) | No aparece | Legacy 8,99 € y 10,99 €. En 2024, Everand costaba **10,99 €/mes o 109,99 €/año** (elDiario.es, 4-oct-2024) | App Store ES, 27-oct-2026: https://apps.apple.com/es/app/id542557212 [VERIFICADO para Plus]; https://www.eldiario.es/consumoclaro/mejores-suscripciones-libros-electronicos_1_11678206.html [dato de 2024]; Standard [NO VERIFICADO] |
| **México** | **149 MXN** (App Store, "Everand Standard") | **326 MXN** (artículo oficial de ago-2025 y descripción antigua del App Store MX) | No aparece | Legacy 149-165 MXN | App Store MX, 27-oct-2026: https://apps.apple.com/mx/app/id542557212 [VERIFICADO para Standard]; Plus [VERIFICADO en 2025, no reconfirmado en oct-2026] |
| **Colombia** | **49.900 COP** | **79.900 COP** | No aparece | Legacy 26.900-39.900 COP | App Store CO, 27-oct-2026 [VERIFICADO, precio de Apple] |
| **Argentina** | **9,99 USD** | **16,99 USD** | No aparece | Legacy 8,99-9,99 USD | App Store AR, 27-oct-2026 [VERIFICADO, precio de Apple; se cobra en dólares] |
| **Chile** | **9.990 CLP** | No aparece en la lista | No aparece | Legacy 5.700-7.200 CLP | App Store CL, 27-oct-2026 [VERIFICADO para Standard] |
| Reino Unido / Canadá / Australia / Perú (referencia) | 10,99 £ / 12,99 CAD / 14,99 AUD / 24,99 PEN | 14,99 £ / 23,99 CAD / 26,99 AUD / 62,99 PEN | — | — | Artículo oficial "Planes Plus, Standard y Deluxe (agosto 2025)", hoy retirado; vía buscador: https://support.scribd.com/hc/it/articles/29859144648596 [NO VERIFICADO en vivo] |

**Notas importantes sobre precios:**
- El App Store solo muestra las 10 compras principales de cada país, así que puede faltar algún plan. Además, **el precio de Apple puede ser distinto del precio web**. [VERIFICADO como limitación]
- **Deluxe fuera de EE. UU.: [CONTRADICTORIO]**
  - La ayuda en español (actualizada hoy) dice que Deluxe es "solo EE. UU." y que Standard y Plus están en "EE. UU., Reino Unido, Canadá, Australia, México y gran parte de América Latina".
  - La nota de prensa del 2-jun-2026 dice que los tres planes están en "nearly every market worldwide".
  - La versión inglesa del mismo artículo ya no dice "US only".
  - No aparece ninguna compra Deluxe en los App Store hispanos. Fuentes: https://support.scribd.com/hc/es/articles/40678839226644 ; PR Newswire (arriba).
- **España: Everand no publica el precio en euros de Standard.** En el App Store español la descripción de la app está **en inglés y con precios en dólares**. Hay que **comprobar el precio el día de la grabación** desde una IP española (página de registro), sin llegar a pagar.
- La ficha de **Google Play en español está desactualizada**: dice que la suscripción incluye Scribd y SlideShare y que "comienza en $149.99MXN". Es un ejemplo de información confusa para el usuario hispano. [VERIFICADO] https://play.google.com/store/apps/details?id=com.scribd.app.reader0&hl=es&gl=ES
- Rango de compras en Google Play España: "1,09 € - 23,99 € si se factura a través de Google Play". Rango en México: "$23.00 - $479.00 por elemento". [VERIFICADO; no se sabe a qué plan corresponde cada importe]

### 3.3 Prueba gratuita

| Pregunta | Respuesta oficial | Estado | Fuente |
|---|---|---|---|
| ¿Cuánto dura? | **30 días** si te das de alta en **everand.com**; **7 días** si lo haces por **App Store o Google Play** | [VERIFICADO] (ayuda, web y ficha del App Store) | https://support.scribd.com/hc/en-us/articles/46956976809236-About-your-free-trial-on-Everand (actualizado el 1-sep-2026) |
| ¿Qué incluye? | **1 desbloqueo** (un libro) **elijas el plan que elijas**, más el catálogo "unlimited", descargas y todos los dispositivos | [VERIFICADO] | Misma fuente; FAQ de everand.com |
| ¿Pide tarjeta? | **Sí.** En la web pide tarjeta, PayPal o Google Pay para empezar la prueba. Puede aparecer una **retención temporal** (autorización) en la tarjeta | [VERIFICADO] | https://support.scribd.com/hc/en-us/articles/210135626-How-to-subscribe ; artículo de la prueba |
| ¿Se cobra solo? | Sí, **se renueva automáticamente** salvo que canceles **al menos 24 h antes** del final. Everand dice que envía un recordatorio por email | [VERIFICADO] | Artículo de la prueba |
| ¿Puedo leer más libros en la prueba? | Solo si **terminas la prueba antes y empiezas a pagar** (botón "Get more unlocks") | [VERIFICADO] | Artículo de la prueba |
| ¿Qué pasa si cancelo durante la prueba? | **Pierdes el acceso al momento**, a diferencia de una suscripción pagada | [VERIFICADO] | Artículo de la prueba |
| ¿Una prueba por cuenta? | Sí, "para nuevos y antiguos suscriptores que no la hayan usado recientemente" | [VERIFICADO] | Artículo de la prueba |
| Promos | Octubre de 2026: código SPOOKY26 (2 libros y 30 días). Referidos: el amigo recibe 2 desbloqueos en la prueba | [VERIFICADO] | everand.com/checkout/available-plans ; artículo de referidos |

**Inexactitud de terceros:** TextToLab (sep-2026) afirma que la prueba incluye "1, 3 o 5 desbloqueos según el plan" y que hay revistas y partituras. **Es falso según la fuente oficial.** No usar esa reseña como fuente. https://texttolab.com/blog/everand-review

### 3.4 Cancelar, pausar y reembolsos

- **Cancelar (alta en la web):** everand.com → icono de perfil → "Your account" → sección Subscription → "Cancel" → "Cancel subscription". El enlace de cancelar está **debajo de "Pause subscription"**, al final de la sección. [VERIFICADO] https://support.scribd.com/hc/en-us/articles/46929149941396-How-to-cancel-your-Everand-subscription (actualizado el 15-oct-2026)
- **Alta desde iPhone o Android:** hay que cancelar **en Apple o Google**. Cancelar en la web **no detiene esos cobros**. La suscripción puede aparecer como "Everand" **o como "Scribd"**. [VERIFICADO]
- **Al cancelar una suscripción pagada:**
  - Mantienes el acceso hasta el final del periodo pagado.
  - **Los desbloqueos no usados caducan.**
  - **Los libros desbloqueados quedan bloqueados.** Vuelven si te resuscribes con el mismo email.
  - [VERIFICADO]
- **Pausa:** de **1 a 12 semanas**, solo si te diste de alta en la web y no durante la prueba. Mientras dura la pausa se conservan los libros desbloqueados y los desbloqueos pendientes. [VERIFICADO] https://support.scribd.com/hc/en-us/articles/46929593791636-How-to-pause-your-Everand-subscription
- **Reembolsos:**
  - Solo cargos de **menos de 30 días** y en supuestos concretos: fallo técnico, contenido defectuoso, fraude, cobro por error o **periodo sin ningún uso**.
  - **No hay reembolsos parciales.**
  - **En la UE y el Reino Unido hay derecho de desistimiento de 14 días con reembolso completo.**
  - [VERIFICADO] https://support.scribd.com/hc/en-us/articles/47039530597524-How-refunds-work-on-Everand
- Desbloquear un libro por error **no se garantiza que se pueda revertir** ("We'll do our best"). [VERIFICADO] https://support.scribd.com/hc/en-us/articles/47040517243540

---

## 4. EL MODELO DE DESBLOQUEOS (la "trampa" que hay que explicar)

### 4.1 Cómo funciona hoy (fuente oficial)

1. **La mayoría del catálogo exige desbloqueo.** Literalmente: *"Which books require an unlock? **Most of them.**"* Hay más de 1,5 M de títulos y "la mayoría" necesitan desbloqueo. [VERIFICADO] https://support.scribd.com/hc/en-us/articles/47040289862420-Which-books-require-an-unlock
2. **1 desbloqueo = 1 audiolibro o ebook**, para leer o escuchar **todas las veces que quieras mientras sigas suscrito** (o en pausa). [VERIFICADO] https://support.scribd.com/hc/en-us/articles/40677287041684-How-unlocks-work-on-Everand (actualizado el 23-oct-2026)
3. **Cuántos:** Standard 1, Plus 3 y Deluxe 5 al mes. Se renuevan **en tu fecha de facturación**, no el día 1.
4. **Acumulación:** desde el 7-abr-2026, los que no uses **se guardan hasta 6 meses** desde que te los dan y luego caducan.
   - **[CONTRADICTORIO]:** la versión **en español** del artículo de planes (actualizada el 27-oct-2026) sigue diciendo que "expiran 30 días después de que los recibes. No se acumulan para el mes siguiente". La versión inglesa, la web y el App Store dicen 6 meses. **Lo correcto hoy es 6 meses**; la traducción española está desfasada. https://support.scribd.com/hc/es/articles/40678839226644
5. **Lo que no exige desbloqueo** es una "selección curada" de **20.000+ audiolibros, ebooks y podcasts**, más los Everand Originals.
   - En la app llevan la etiqueta **"unlimited"**. Los libros que exigen desbloqueo **no llevan etiqueta**: "como la mayoría lo exige, el etiquetado funciona al revés".
   - Es **rotativa**: los libros pueden entrar y salir.
   - Se puede consultar en everand.com/unlimited y con el filtro "Catalog" del buscador.
   - [VERIFICADO]
6. **Vista previa:** antes de gastar un desbloqueo puedes escuchar una muestra o leer un fragmento.
7. **Desbloquear no es lo mismo que guardar.** Guardar un libro en tu lista no lo desbloquea. [VERIFICADO] https://support.scribd.com/hc/en-us/articles/31586457709972-How-to-switch-your-Everand-plan

### 4.2 Qué significa "unlimited" en la práctica (comprobado con el buscador de Everand) [ESTIMACIÓN PROPIA, desde EE. UU., 27-oct-2026]

| Segmento | Estimación | Cómo se calculó |
|---|---|---|
| Audiolibros "unlimited" (inglés, español, portugués, alemán y francés) | ~8.500 | 214 páginas de 40 resultados (consulta "the", filtro unlimited) |
| Ebooks "unlimited" (esos 5 idiomas) | ~2.700 | 69 páginas de 40 resultados |
| **Audiolibros "unlimited" en español** | **~500-650** (500 títulos únicos recogidos) | 16 páginas (consulta "de", idioma español, unlimited) |
| Ebooks "unlimited" en español | ~100 | 3 páginas |
| **Audiolibros en español en total (desbloqueo + unlimited)** | **~41.000** | 1.041 páginas (consulta "de"; con "la" y "y" salen cifras muy parecidas) |
| Ebooks en español en total | ~198.000 | 4.950 páginas |

- **Qué hay en el "unlimited" en español** (los más valorados):
  - Clásicos **en versiones abreviadas** de YOYO USA y "Audiolibros Colección": *Cumbres borrascosas* (2 h), *Crimen y castigo* (2 h, narrador **Fabio Camero**), *Ana Karenina* (3 h), *Don Quijote de la Mancha* (5 h, Elenco Fonolibro), *La Ilíada* (1 h).
  - Autoayuda breve.
  - Narrativa latinoamericana independiente: *Cometierra* (Dolores Reyes), *El matrimonio de los peces rojos* (Guadalupe Nettel), *Ceniza en la boca* (Brenda Navarro), *Punto de cruz* (Jazmina Barrera).
- **Ningún superventas actual en español aparece en "unlimited".** Todos los títulos de las editoriales grandes que se probaron salen como **premium**, es decir, con desbloqueo (ver §5.3).
- **Mensaje para el vídeo:** con el plan Standard, **el único superventas que escuchas al mes es el que desbloqueas**. El resto es fondo de catálogo, clásicos abreviados, podcasts y títulos independientes.

### 4.3 Letra pequeña que conviene contar

- **No eres dueño de nada:** si cancelas, pierdes el acceso a lo que desbloqueaste. Lo recuperas si vuelves con el mismo email. [VERIFICADO]
- **Desbloqueos por error:** no se garantiza la devolución. [VERIFICADO]
- **Prueba con un solo libro**, aunque elijas Plus o Deluxe. [VERIFICADO]
- **Acuerdo de suscriptor:**
  - *"Some Subscription Content may not be immediately available to the small percentage of users that consume an unusually high volume of Subscription Content."*
  - Everand se reserva retirar o retrasar contenidos "en función de los costes que generen" o del uso que hagas.
  - [VERIFICADO] https://support.scribd.com/hc/en-us/articles/210129486-Everand-Subscriber-Agreement (actualizado el 25-oct-2026)
- **Plan Legacy (los suscriptores de antes):**
  - Sin desbloqueos y sin el "catálogo ampliado de **150.000+** superventas y novedades".
  - Acceso con **"límites según el uso"**: "after a period of heavy reading or listening, some books may temporarily become unavailable".
  - Si cambias a Standard, Plus o Deluxe **no puedes volver atrás**, y los libros **que no habías empezado** pasan a exigir desbloqueo.
  - [VERIFICADO] https://support.scribd.com/hc/en-us/articles/46956730590484-I-m-on-a-Legacy-Everand-plan
- **Libros que desaparecen:** el catálogo depende de acuerdos con editoriales. Un libro puede salir del catálogo, con aviso "Expiring", o **no estar en tu país**. [VERIFICADO] https://support.scribd.com/hc/en-us/articles/47041302629012-I-can-t-find-a-book-I-m-looking-for
- **Ediciones en otro idioma:** Everand avisa de que, antes de desbloquear, compruebes que el libro está en el idioma que quieres. En español conviven ediciones **"castellano"** y **"latino"**: por ejemplo, *Sapiens* y *La asistenta* tienen las dos. Es útil para Latinoamérica, pero también es una forma fácil de gastar mal un desbloqueo. [VERIFICADO]

### 4.4 No es la primera vez: el péndulo de Scribd

| Etapa | Modelo |
|---|---|
| 2013-2015 | Ilimitado (8,99 $) |
| Ago-2015 / feb-2016 | **Créditos**: 1 audiolibro al mes, y después 3 libros y 1 audiolibro |
| Feb-2018 | Vuelta al "ilimitado", con límites discrecionales |
| Nov-2023 | Everand hereda el "ilimitado con límites" |
| **30-oct-2024** | **Desbloqueos** (Standard y Plus) a cambio de las cinco grandes y novedades sin ventana |
| Ago-2025 | Deluxe (5) |
| Abr-2026 | Acumulación de 6 meses |

Fuentes: Publishers Lunch 2015 y 2016; PW 2024 y 2025 (ver cronología).

**El argumento de Everand** (Greg Voynow, PW, 30-oct-2024): *"Being able to get a vast majority of the New York Times bestsellers... our customers want reliability."* Es decir: "sabrás con certeza si un título estará disponible". **Lo que ganas:** novedades y superventas de las cinco grandes desde el día de su salida. **Lo que pierdes:** el ilimitado.

### 4.5 Qué dicen los usuarios

- **Análisis de unstar.app (7-sep-2026)** sobre las 4.000 reseñas más recientes de Google Play en EE. UU. y 1.658 quejas largas: [FUENTE ÚNICA, análisis de terceros]
  - Antes de noviembre de 2024, **3 de 177** quejas mencionaban desbloqueos o créditos. Después, **481 de 1.481**.
  - El volumen de quejas pasó de **29 a 110 al mes** (×3,8).
  - **30 reseñas** denuncian **perder lo desbloqueado al cancelar o pausar**. Ojo: la ayuda oficial dice que en pausa **sí** se conservan.
  - **46 reseñas** se quejan de que los desbloqueos **no se acumulaban**. Es anterior al cambio de abril de 2026.
  - Fuente: https://unstar.app/blog/everand-unlimited-unlocks-credits-price-app-reviews-2026
- **Trustpilot:** TrustScore **alrededor de 1,5/5** con unas 256-283 opiniones según el dominio regional. Alrededor del 84 % son de 1 estrella. [NO VERIFICADO en vivo: Trustpilot bloquea la herramienta; dato de extractos del buscador] https://www.trustpilot.com/review/everand.com
  - Quejas citadas:
    - Usuarios que al migrar del Legacy a Plus "perdieron más de 200 libros".
    - No poder volver al plan Legacy.
    - Soporte con bot que no resuelve.
- **Reseñas en español** (App Store y Google Play; [OPINIÓN]):
  - App Store Chile: **"No es ilimitado.** Te mienten diciendo que puedes escuchar los libros de su catálogo de forma ilimitada, pero la verdad es que escuchas 3 audiolibros y ya no puedes hacer nada más en todo el mes". https://apps.apple.com/cl/app/id542557212
  - App Store Chile: "Ya no tiene acceso a revistas. A mí me gustaba leer Time y The Atlantic".
  - Google Play España, 13-ene-2024, 50 votos de "útil": "extremadamente complicado darse de baja... Te hacen dar mil vueltas".
  - Google Play España, 2-abr-2025: "por el precio mensual el contenido es algo pobre... Los audiolibros se pausan de vez en cuando".
  - App Store México y Argentina, 2020-2021: cobros después de cancelar ("Hice la cancelación... y me lo cobraron igual"). Son anteriores a Everand.
  - App Store España, 2020: "La interfaz no está a la altura de Storytel... no tienen nada de Isabel Allende, García Márquez, Vargas Llosa, Pérez-Reverte ni Ken Follett". **Esto ha cambiado: hoy están todos, pero con desbloqueo** (§5.3). Es un buen contraste para el vídeo.

---

## 5. Catálogo

### 5.1 Cifras globales

| Cifra | Qué cuenta | Fecha | Fuente | Estado |
|---|---|---|---|---|
| **1,5 M+** | Audiolibros y ebooks (catálogo total con desbloqueo) | 2024-2026 | Web y ayuda oficial; PW 30-oct-2024 | [AFIRMACIÓN PROPIA, repetida en todas partes] |
| **150.000+** | Superventas y novedades del "catálogo ampliado" (lo que no tienen los Legacy) | 2026 | https://support.scribd.com/hc/en-us/articles/46956730590484 | [AFIRMACIÓN PROPIA] |
| **20.000+** | Títulos "unlimited" sin desbloqueo (audiolibros, ebooks y podcasts), rotativos | 2025-2026 | Web; PW 20-ago-2025; PW 2-jun-2026 | [AFIRMACIÓN PROPIA]; nuestra estimación: ~8.500 audiolibros y ~2.700 ebooks, más podcasts |
| "Thousands of new titles every month" | Novedades | 2026 | everand.com | [AFIRMACIÓN PROPIA] |
| Catálogo en otros idiomas | "Seis cifras" en varios idiomas (alemán, portugués...); prioridad para el inglés y el **español** | 30-oct-2024 | PW | [FUENTE ÚNICA] |
| **~41.000 audiolibros en español** | Total visible desde EE. UU. | 27-oct-2026 | Buscador de Everand | [ESTIMACIÓN PROPIA] |
| ~500-650 audiolibros en español "unlimited" | Sin desbloqueo | 27-oct-2026 | Buscador de Everand | [ESTIMACIÓN PROPIA] |
| Revistas y partituras | **Ya no hay** (retiradas el 28-ene-2025) | 2025 | Ayuda oficial | [VERIFICADO] |
| Podcasts | Sí, sin desbloqueo | 2026 | Ayuda oficial | [VERIFICADO] |

### 5.2 Editoriales en español detectadas (páginas de título leídas el 27-oct-2026) [VERIFICADO]

| Sello en Everand | Ejemplos | Comprobación |
|---|---|---|
| **Penguin Random House Audio** | *El amor en los tiempos del cólera* (García Márquez, voz de Diego Trujillo); *Reina roja* (Gómez-Jurado); *Violeta* (Allende) | https://www.everand.com/audiobook/824931144 ; /823808418 ; /825372814 |
| **Penguin Random House Audio Publishing Group** | *La sombra del viento* (Ruiz Zafón, voz de Jordi Boixaderas) | https://www.everand.com/audiobook/769294804 |
| **Planeta Audio** | *Yo, Julia* (Posteguillo, Premio Planeta 2018); *Pídeme lo que quieras* (Megan Maxwell) | https://www.everand.com/audiobook/797680684 ; /791239211 |
| **Storytel Original** (¡sí, un original de Storytel!) | *El accidente* (Santiago Roncagliolo, voz de Vanessa Bauche, 25-abr-2025), completo y por episodios | https://www.everand.com/audiobook/920008393 |
| Saga Egmont | Novela negra nórdica traducida, infantil (Pimpa) | Buscador |
| YOYO USA | Clásicos abreviados del catálogo "unlimited" (*Crimen y castigo*, 2 h) | https://www.everand.com/audiobook/712072129 |
| Arzalia Ediciones; Vive Virtual | Títulos con **voz sintética** o "voz digital" | https://www.everand.com/audiobook/913213094 ; /723885728 |

- La página de editorial "Penguin Random House Grupo Editorial, S.A." de everand.com devuelve **410 (eliminada)**, pero sus audiolibros aparecen bajo "Penguin Random House Audio". [VERIFICADO]

### 5.3 Autores y títulos en español (búsqueda con filtro de idioma español; todos aparecen como **premium**, es decir, con desbloqueo) [VERIFICADO desde EE. UU.]

| Autor o título | ¿Está en audio en español? | Ejemplos |
|---|---|---|
| Gabriel García Márquez | **Sí** | *El amor en los tiempos del cólera* (6.370 valoraciones), *Crónica de una muerte anunciada*, *Vivir para contarla*, *Todos los cuentos* |
| ***Cien años de soledad*** | **No aparece en audio en español** (solo guías y resúmenes) | — |
| Mario Vargas Llosa | Sí | *La ciudad y los perros*, *Conversación en La Catedral*, *La fiesta del Chivo* |
| Isabel Allende | Sí | *Violeta* |
| Carlos Ruiz Zafón | Sí | *La sombra del viento*, *El laberinto de los espíritus* (Jordi Boixaderas), trilogía de la Niebla |
| Arturo Pérez-Reverte | Sí | Saga Alatriste (Raúl Lloréns), *El pintor de batallas* |
| Juan Gómez-Jurado | Sí | *Reina roja*, *Loba negra*, *Rey blanco*, *Todo arde*, *Mentira* |
| Santiago Posteguillo | Sí | *Roma soy yo*, *Maldita Roma*, *Los tres mundos*, *Yo, Julia* |
| Ken Follett | Sí | *Los pilares de la Tierra* (46 h, 8.703 valoraciones) |
| Fernando Aramburu | Sí | *Patria*, *Los vencejos* |
| Irene Vallejo | Sí | *El infinito en un junco* (Elena Silva) |
| María Dueñas, Elísabet Benavent, Megan Maxwell | Sí | *Por si un día volvemos*; *En los zapatos de Valeria*; *Pídeme lo que quieras* |
| Freida McFadden | Sí, **en versión castellana y latina** | *La asistenta (castellano)*, *La empleada* (latino) |
| Rebecca Yarros | Sí | *Alas de sangre*, *Empíreo* |
| Yuval Noah Harari | Sí, castellano y latino | *Sapiens*, *Homo Deus* |
| James Clear, *Hábitos atómicos* en español | **No aparece** | — |
| Dolores Redondo, Javier Castillo | Resultados poco claros: aparece *La grieta del silencio* (Castillo); no se confirmó ningún título de Redondo | [NO VERIFICADO] |

- **Advertencia:** son búsquedas desde EE. UU. La disponibilidad en España o México **puede variar**. Hay que comprobar 5-10 títulos en la app desde España el día del rodaje.
- **Qué no está (por exclusividad o por derechos):**
  - **Audible Originals:** la búsqueda "Audible" no devuelve producciones de Audible Studios. [VERIFICADO por ausencia]
  - Algunos superventas concretos (*Cien años de soledad* en audio, *Hábitos atómicos*).
  - Everand admite que su catálogo "no incluye todos los libros" por acuerdos o "exclusividad con otra plataforma". https://support.scribd.com/hc/en-us/articles/47041302629012

### 5.4 Voz humana o IA

- **La mayoría de los títulos de editoriales grandes tienen narrador humano acreditado:** Jordi Boixaderas, Raúl Lloréns, Diego Trujillo, Nikki García, Neus Sendra...
- **Hay audiolibros con voz sintética en español, etiquetados en los créditos:**
  - "Martín Quirós (voz sintética)": *Yo, comandante de Auschwitz*, *El Príncipe*.
  - "Luis Canales (voz sintética)": Galdós, *Bailén*.
  - "Santiago (Voz de IA)".
  - "Voz Digital Santiago G / Leonardo G / Simón G".
  - Una búsqueda de "voz digital" en español da unas **89 páginas**, aunque mezcla otros resultados. [ESTIMACIÓN PROPIA]
  - Existe la página de colaborador "AI Voices powered by Eleven Labs Inc.": https://www.everand.com/contributor/730861887/AI-Voices-powered-by-Eleven-Labs-Inc
  - [VERIFICADO]
- **No hay filtro "voz humana / IA"** en el buscador; los filtros son catálogo, categoría, valoración, novedad e idioma. La política de IA de Scribd Inc. dice que "aims to label all AI-created or enhanced content". [VERIFICADO] https://support.scribd.com/hc/en-us/articles/21443910133268-Our-AI-Principles
- **Consejo para el vídeo:** antes de desbloquear, mirar el narrador en la ficha.

### 5.5 Everand Originals

- Obras exclusivas de autores conocidos, **sin desbloqueo**: Stephen King (*Finn*), Margaret Atwood (*Two Scorched Men*), Roxane Gay, Chuck Palahniuk, Ada Limón... Son en inglés; muchos vienen de la etapa "Scribd Originals". [VERIFICADO] https://www.everand.com/
- Existe un sello "Scribd Audio Spanish". No se analizó su catálogo. [NO VERIFICADO]

---

## 6. Funciones y apps

| Función | Estado | Detalle | Fuente |
|---|---|---|---|
| Plataformas | **Sí** | Web (Chrome, Safari, Firefox, Edge), **iOS 17+**, **Android 7.1.1+**, **Kindle Fire** (4.ª gen, Fire OS 6+), **Apple Watch**, **CarPlay**, **Android Auto** | https://support.scribd.com/hc/en-us/articles/47044532541076-Reading-on-multiple-devices ; https://support.scribd.com/hc/en-us/articles/47042390664596 |
| Descarga offline | **Sí, solo en la app** (no en la web) | Hasta **4 dispositivos** con descargas. Licencia DRM que hay que refrescar conectándose. Exige suscripción activa | https://support.scribd.com/hc/en-us/articles/210135046-How-to-download-books-for-offline-access |
| Límite de dispositivos | 4 con descargas; cada libro en hasta **6 dispositivos**; web en **3 navegadores cada 24 h** | | Misma fuente |
| Sincronización | Progreso, listas, desbloqueos, marcadores, subrayados, notas e historial | Las descargas y las preferencias de visualización **no** se sincronizan | Reading on multiple devices |
| Velocidad | **Sí**; se guarda entre libros | Notas de versión del App Store (vía buscador): **de 0,5x a 3,5x en pasos de 0,1x** [FUENTE ÚNICA] | https://support.scribd.com/hc/en-us/articles/47043813405332-Audiobook-playback-features-and-settings |
| Temporizador de apagado | **Sí** | Duraciones fijas o personalizadas; según notas de versión, hasta 23 h 59 min, "fin de capítulo" y +1/+5 min [FUENTE ÚNICA para el detalle] | Misma fuente |
| Capítulos | Sí, **si la editorial da los metadatos**; Everand añade marcas a mano en los títulos populares | | Misma fuente |
| Saltos | 15 o 30 s | | Misma fuente |
| Marcadores de audio | Sí | La descripción del App Store menciona "add bookmarks" e intervalos de salto configurables | https://apps.apple.com/us/app/id542557212 |
| Lector de ebooks | Sí | Fuentes, tamaño, temas claro, oscuro y sepia, alineación, interlineado (app), brillo, subrayado, notas, desplazamiento horizontal o vertical | https://support.scribd.com/hc/en-us/articles/47043665370388-Ebook-reading-features-and-settings |
| Sincronizar ebook y audiolibro (Whispersync) | **No consta.** Desde jun-2026 la ficha muestra "el otro formato", pero cada formato se desbloquea aparte | Un usuario lo pidió en Google Play | App Store, versión 16.13 |
| Perfiles o plan familiar | **No** | Compartir la cuenta está **prohibido** | Acuerdo de suscriptor |
| Idioma de la interfaz | Inglés, **español**, portugués y francés (desde 11-may-2026) | | App Store, versión 16.8 |
| Accesibilidad | Parcial | "La app móvil no es totalmente compatible con lectores de pantalla"; mejoras para VoiceOver en ene-2026 | https://support.scribd.com/hc/en-us/articles/6734475870868 ; Known issues |
| Fable Plus incluido | Sí | Estadísticas, rachas, objetivos, sin anuncios. La sincronización Everand → Fable es solo de ida (beta, jun-2026) | everand.com ; PR jun-2026 |
| Calidad de audio (bitrate) | **Sin datos públicos** | | [NO VERIFICADO] |
| Tamaño y requisitos iOS | 273,1 MB, iOS 17+, edad **18+** en el App Store | | App Store, 27-oct-2026 |

**Fallos recientes reconocidos por Everand:**
- Progreso de audiolibros que se reiniciaba (iOS 16.13.1-16.15, jun-jul 2026).
- Reproductor atascado en las muestras (ene-2026).
- Android Auto (ene-2026).
- Fuentes: historial del App Store; Known issues.
- **[OPINIÓN]:** reseñas mencionan fallos al cambiar la velocidad o poner el temporizador, y audios que se pausan solos.

---

## 7. Valoraciones en tiendas (leídas el 27-oct-2026)

### 7.1 Google Play: "Everand" (`com.scribd.app.reader0`)

| País | Nota del país | Nota global mostrada | Valoraciones | Descargas |
|---|---|---|---|---|
| **EE. UU.** | **3,5★** (3,51; 161.959 de 1★ y 315.416 de 5★) | — | **614.122** (globales) | **10 M+** (dato interno ≈48,4 M de instalaciones) |
| **España** | **4,4★** (4,41) | 4,4 | 614.122 | 10 M+ |
| **México** | **4,5★** (4,55) | 4,5 | 614.122 | 10 M+ |
| **Colombia** | **4,4★** (4,40) | 4,4 | 614.122 | 10 M+ |
| **Argentina** | **4,5★** (4,53) | 4,5 | 614.122 | 10 M+ |
| **Chile** | **4,3★** (4,28) | 4,3 | 614.122 | 10 M+ |

- Última actualización: 16-oct-2026. Clasificación PEGI 3. [VERIFICADO]
- **Lectura clave:** la nota es **mucho peor en EE. UU.** (3,5), el mercado que lleva más tiempo con los desbloqueos y el que más reseñas tiene. unstar.app midió 3,52 el 7-sep-2026, así que el dato es coherente. [VERIFICADO]
- URL: https://play.google.com/store/apps/details?id=com.scribd.app.reader0 (parámetros `&hl=es&gl=ES`, `gl=MX`...)

### 7.2 App Store: "Everand: audiolibros y libros" (`id542557212`)

| País | Nota | Valoraciones | Posición |
|---|---|---|---|
| EE. UU. | **4,3** | **27.470** | N.º 26 en Libros |
| España | **4,3** | 851 | N.º 75 en Libros |
| México | **4,5** | 2.568 | N.º 87 en Libros |
| Colombia | 4,6 | 522 | — |
| Argentina | 4,2 | 469 | — |
| Chile | 4,6 | 708 | — |

- Privacidad (etiqueta en EE. UU.): "Data Linked to You": correo, historial de compras, ID de usuario, interacción con el producto. [VERIFICADO]
- URLs: https://apps.apple.com/us/app/id542557212 ; https://apps.apple.com/es/app/id542557212 ; https://apps.apple.com/mx/app/id542557212

### 7.3 Quejas más repetidas (por orden de frecuencia según las fuentes)

1. **"Ya no es ilimitado"**, o "era mejor cuando era Scribd": pagas y solo tienes 1 o 3 libros que te interesen.
2. **El catálogo "unlimited" es pobre**, o no está lo que buscas.
3. **Pierdes los libros al cancelar**: no son tuyos.
4. **Libros que pasan a "no disponible"** a mitad de lectura, migraciones del Legacy y límites por uso.
5. **Cancelación difícil o cobros inesperados** (sobre todo reseñas de 2020-2024 y de altas por Apple o Google).
6. **Fallos del reproductor**: progreso perdido, pausas, velocidad.
7. **Soporte con bot.**
- Fuentes: §4.5.

---

## 8. Comparativa en España y Latinoamérica (precios con fecha; comprobar el día de publicación)

### 8.1 España

| Servicio | Precio y modelo (oct-2026) | Fecha y fuente | Estado |
|---|---|---|---|
| **Everand** | **Plus 14,99 € = 3 libros al mes** (unos 5 €/libro) más unos 20.000 "unlimited" (unos 500-650 audiolibros en español). Standard: precio en € sin confirmar | App Store ES, 27-oct-2026 | Plus [VERIFICADO] |
| **Audible Premium** | **9,99 €/mes**, **escucha ilimitada** del catálogo incluido ("más de 70.000 títulos", y en otra parte "100.000") más Audible Originals. Prueba de 30 días (90 con Prime en algunas promociones). Pausa de 30-90 días | Blog de audible.es, modificado el 11-may-2026: https://www.audible.es/blog/explicacion-de-audible ; https://www.audible.es/blog/suscripcion-de-audible | [VERIFICADO] |
| **Audible Standard** | **6,99 €/mes = 1 audiolibro al mes** del catálogo completo, **sin acumulación**. Es el equivalente directo del Standard de Everand | Mismo blog | [VERIFICADO] |
| **Storytel Unlimited** | **8,99 €/mes**, acceso ilimitado. Family desde 15,99 € (2 cuentas) | https://www.storytel.com/es/subscriptions (27-oct-2026) | [VERIFICADO] |
| **Spotify** | **12 h al mes incluidas en Premium** (titular de Individual, Duo o Familiar). **Audiolibros+ por 8,99 €/mes añade 15 h** (27 h en total). Unos 350.000 títulos y unos **45.000 en español**. Lanzado en España el **7-oct-2026**. Las horas no se acumulan | Hipertextual, 7-oct-2026: https://hipertextual.com/actualidad/spotify-acaba-de-mejorar-muchisimo-en-espana-amazon-esta-enfadadisima-con-esta-novedad/ ; ayuda de Spotify: https://support.spotify.com/es/article/audiobooks-premium-plans/ | [VERIFICADO] |
| **Kindle+** (antes Kindle Unlimited) | **9,99 €/mes** (precio según medios). **Rebautizado el 23-oct-2026**; ahora incluye audiolibros, también **narrados por IA** (KDP) | Amazon.es ya muestra "Kindle+" (leído el 27-oct-2026): https://www.amazon.es/kindle-dbs/hz/subscribe/ku ; Última Hora, 23-oct-2026: https://www.ultimahora.es/noticias/tecnologia-videojuegos/2026/10/23/2734841/amazon-cambia-nombre-kindle-unlimited-kindle-incluye-audiolibros-coste-adicional.html | Nombre [VERIFICADO]; precio [FUENTE SECUNDARIA] |
| **Kobo Plus** | Read 8,99 €, Listen 8,99 €, Read & Listen 11,99 € (precios de **lanzamiento, jul-2024**). Unos 200.000 audiolibros | https://www.kobo.com/kobo-writing-life/blog/rakuten-kobo-launches-kobo-plus-in-spain (403 en vivo; vía buscador) | [NO VERIFICADO para 2026] |
| **Podimo** | Premium **4,99 €/mes = 20 h** de audiolibros; Premium Plus **9,99 € = 100 h**. Prueba de 30 días | https://podimo.com/es (27-oct-2026) | [VERIFICADO] |
| **BookBeat** | **6,99 € (20 h)**, **9,99 € (50 h)**, **14,99 € (100 h)**. Perfiles extra a 4,99 €. Prueba de 30 días con 20 h | https://www.bookbeat.com/es (27-oct-2026; página en inglés) | [VERIFICADO] |
| **Nextory** | Mini **5,99 € (10 h)**, Standard **7,99 € (30 h)**, "desde 9,99 €" (ilimitado). Prueba de 14 días con 20 h. Hasta 4 perfiles | https://nextory.com/es (27-oct-2026) | [VERIFICADO] |

### 8.2 México y Latinoamérica

| Servicio | Precio y modelo | Fuente | Estado |
|---|---|---|---|
| **Everand (MX)** | Standard **149 MXN** (1 libro), Plus **326 MXN** (3 libros) | App Store MX (Standard, 27-oct-2026); ayuda oficial de 2025 (Plus) | Standard [VERIFICADO]; Plus [VERIFICADO en 2025] |
| **Spotify (MX)** | 12 h al mes en Premium; **Audiolibros+ por 99 MXN al mes por +15 h**; más de 45.000 títulos en español; desde el 7-oct-2026. Premium Individual: 139 MXN, según un medio | Expansión, 8-oct-2026: https://expansion.mx/tecnologia/2026/10/08/audiolibros-spotify-mexico-como-escucharlos | [VERIFICADO]; precio de Premium [FUENTE ÚNICA] |
| **Storytel (MX)** | Ilimitado **169 MXN/mes**, anual **1.190 MXN**, Familiar desde 259 MXN (100 h al mes por cuenta) | https://www.storytel.com/mx/subscriptions (27-oct-2026) | [VERIFICADO] |
| **Audible (MX)** | Standard 129 MXN (1 libro), Premium Plus 259 MXN (catálogo Plus más 1 crédito). Unos **50.000 títulos en español** y unos 2.000 producidos en México en el último año | Precios: extracto de amazon.com.mx, sin fecha (503 en vivo). Catálogo: Expansión, 8-oct-2026 | Precios [NO VERIFICADO]; catálogo [FUENTE ÚNICA] |
| **Storytel (CL / AR / CO)** | Chile: **7.990 CLP/mes**; Argentina: **7,99/mes** (moneda sin indicar, probablemente USD); Colombia: la web redirige a la app | storytel.com/cl, /ar, /co (27-oct-2026) | [VERIFICADO] (moneda de AR sin confirmar) |
| **Everand (CO / AR / CL)** | CO 49.900 / 79.900 COP; AR 9,99 / 16,99 USD; CL Standard 9.990 CLP | App Store, 27-oct-2026 | [VERIFICADO, precio de Apple] |

### 8.3 Cómo resumirlo en una línea (para el guion)

- **Everand Plus vs. Audible Premium (España):** 3 libros al mes elegidos de entre 1,5 M **por 14,99 €** contra **escucha ilimitada** de un catálogo incluido **por 9,99 €**. Además, Audible Standard da 1 libro al mes por 6,99 €. El precio en euros del Standard de Everand está sin confirmar; en EE. UU. cuesta 11,99 $.
- **Everand Standard vs. Storytel (México):** 149 MXN por **1 libro** contra 169 MXN **sin límite**.
- **Everand vs. Spotify:** Spotify incluye unas 12 h, aproximadamente un libro al mes, **sin pagar más si ya tienes Premium**. Everand incluye 1-5 libros sin límite de horas, más ebooks y Fable.
- **Dónde gana Everand:**
  - Ebooks y audiolibros en una sola app, con novedades de las cinco grandes en inglés y gran fondo de PRH y Planeta en español.
  - Releer y reescuchar lo desbloqueado sin contar horas.
  - Acumulación de 6 meses, pausa de hasta 12 semanas, versiones castellanas y latinas, Fable incluido.

---

## 9. Polémicas y puntos delicados

1. **Del "ilimitado" a los desbloqueos (oct-2024).**
   - Es la causa principal de las malas reseñas (§4.5).
   - Scribd ya hizo lo mismo en 2015-2016 y lo deshizo en 2018 (§4.4).
   - La prensa especializada lo trató como un giro ("Scribd Ends Everand's Unlimited Ebook Subscription, Pivots to Credit System", Book Riot). https://bookriot.com/scribd-everand-unlimited-ebook-subscription/
2. **Migración Legacy → desbloqueos:**
   - Es irreversible, se pierde el acceso conjunto a Scribd y Slideshare, y los libros no empezados pasan a exigir desbloqueo.
   - En Trustpilot hay quejas de pérdida de bibliotecas (extractos). [VERIFICADO: la regla oficial] / [OPINIÓN: casos concretos]
3. **Pérdida de acceso al cancelar:** es por diseño (alquiler, no compra). Muchos usuarios no lo sabían. [VERIFICADO]
4. **Incidente de seguridad (21-sep-2026, actualizado el 1-oct-2026):**
   - Un tercero accedió a sistemas internos. Para la mayoría de las cuentas se expuso "información básica de cuenta"; para un número menor, "información más sensible".
   - Se notificó a la policía y a las autoridades de protección de datos.
   - Los avisos llegan por **Epiq** en nombre de Scribd Inc.
   - Se recomienda **cambiar la contraseña de Scribd, Slideshare, Everand y Fable**.
   - Teléfono: +1-877-361-9887.
   - [VERIFICADO, fuente oficial] https://support.scribd.com/hc/en-us/articles/53787421531284-Information-about-the-recent-security-incident
   - **No se encontró cobertura de prensa** ni la cifra de afectados. [NO VERIFICADO el alcance]
   - Precedente: en 2013 Scribd sufrió una brecha que afectó a cerca del 1 % de sus cuentas (Threatpost: https://threatpost.com/one-percent-user-base-exposed-scribd-data-breach-040513/77702/).
5. **Cancelaciones difíciles y cobros tras la prueba o la cancelación:**
   - Hay reseñas en español de 2020-2024.
   - Hoy la ayuda explica que, si te diste de alta por Apple o Google, **hay que cancelar allí**, y que la suscripción puede aparecer **como "Scribd"**. Es una fuente típica de cobros "fantasma".
   - Si cancelas la prueba, el acceso termina al instante.
   - [VERIFICADO: proceso] / [OPINIÓN: quejas]
6. **Confusión Scribd / Everand:** dos productos con el mismo login y suscripciones separadas desde el 10-nov-2025. Hay un artículo de ayuda específico para "me suscribí al producto equivocado". [VERIFICADO]
7. **Información contradictoria o desfasada de la propia Everand:**
   - Ayuda en español con caducidad de 30 días frente a 6 meses en inglés.
   - Deluxe "solo EE. UU." frente a "casi todos los mercados".
   - Ficha de Google Play en español que promete Scribd y Slideshare incluidos.
   - Descripción del App Store en inglés y en dólares en las tiendas hispanas.
   - [VERIFICADO]
8. **Cuentas compartidas:** prohibidas; hay límites de dispositivos y de navegadores. [VERIFICADO]
9. **Límites por uso intensivo** (Legacy y cláusula general del acuerdo). [VERIFICADO]
10. **Demandas:**
    - **No se encontró ninguna demanda reciente (2024-2026)** contra Everand.
    - Antecedente: *National Federation of the Blind v. Scribd* (accesibilidad, 2014), archivada por acuerdo en noviembre de 2015: https://clearinghouse.net/case/15147/
    - [NO VERIFICADO que no exista ninguna; búsqueda no exhaustiva en tribunales]
11. **Privacidad:** etiqueta del App Store con datos vinculados (correo, compras, ID, uso); contrato con Scribd Netherlands B.V. en la UE. No se encontraron sanciones. [VERIFICADO: etiqueta]

---

## 10. Para quién es y para quién no (según las fuentes)

**Es para:**
- Quien lee o escucha **1-3 novedades concretas al mes** y quiere **ebook y audiolibro en la misma app** (Plus es la opción con más sentido: unos 5 €/5,66 $ por libro). [PW; TextToLab; datos propios]
- Lectores en **inglés** de superventas y novedades de las cinco grandes desde el día de salida.
- Quien quiere **releer o reescuchar sin límite de horas** lo que desbloqueó, a diferencia de Spotify, BookBeat o Nextory.
- Quien lee a ráfagas: la **acumulación de 6 meses** y la **pausa de 12 semanas** ayudan.
- Usuarios de **Fable** y de los clubes de lectura.
- Hispanohablantes que valoran tener **versiones castellana y latina**.

**No es para:**
- Quien escucha **más de 3-5 audiolibros al mes**: Storytel (8,99 €/169 MXN, ilimitado) o Audible Premium (9,99 €, ilimitado en su catálogo) salen mejor.
- Quien quiere **conservar** sus audiolibros: Audible con créditos, o compra directa.
- Quien espera el **"Scribd ilimitado"** de antes, o revistas y partituras (ya no hay).
- Quien busca exclusivas de **Audible**, o títulos concretos que no están en audio en español (por ejemplo, *Cien años de soledad*).
- Usuarios que necesitan **lector de pantalla** completo en la app ("no es totalmente compatible").
- Familias que quieren **perfiles**: no hay.

---

## 11. Checklist de prueba manual para el rodaje (sin introducir datos de pago salvo decisión del equipo)

- [ ] Desde una **IP española**, abrir everand.com → "Try Standard/Plus for $0" y anotar el **precio en euros de Standard y Plus** y si aparece **Deluxe**. Parar en el formulario de pago.
- [ ] Lo mismo desde México o con una VPN de Latinoamérica, si el equipo lo autoriza.
- [ ] Comprobar si la prueba de 30 días en la web sigue dando **1 desbloqueo**, y si hay promos activas (tras el 1-nov termina SPOOKY26).
- [ ] Comprobar desde España que están, y en qué versión: *La sombra del viento*, *Reina roja*, *Los pilares de la Tierra*, *El infinito en un junco*, *La asistenta (castellano)*, *Alas de sangre*. Comprobar que *Cien años de soledad* y *Hábitos atómicos* **no** están en audio.
- [ ] Contar audiolibros en español con el filtro **"unlimited"** desde España (la estimación de 500-650 se hizo desde EE. UU.).
- [ ] Probar la velocidad (¿llega a 3,5x?), el temporizador (¿"fin de capítulo"?), los capítulos, los marcadores, la descarga offline y CarPlay o Android Auto.
- [ ] Ver cómo se muestra la etiqueta **"unlimited"** y el botón **"Unlock"**, y si la app avisa antes de gastar un desbloqueo.
- [ ] Localizar un título con **"(voz sintética)"** y grabar una muestra para comparar con una voz humana.
- [ ] Recorrer el flujo de **cancelación** en la web: ¿cuántos pasos? ¿Hay ofertas de retención?
- [ ] Interfaz en español: ¿está traducida toda la app?

---

## 12. Lo que NO se pudo verificar

1. **Precio en euros del plan Standard en España** (y si Deluxe existe en España). Solo está confirmado **Plus a 14,99 €** (App Store).
2. **Plus en México en 2026:** 326 MXN es el dato oficial de 2025, no reconfirmado hoy. Tampoco el precio web frente al de Apple en Colombia, Argentina y Chile.
3. **Disponibilidad del catálogo en español desde España o México**: las estimaciones se hicieron desde EE. UU.
4. **Número de suscriptores de Everand por separado**: solo hay "2M+" para todo Scribd Inc.
5. **Alcance del incidente de seguridad de septiembre de 2026**: cuántos usuarios y qué datos sensibles.
6. **Trustpilot en vivo**: bloqueado; nota de alrededor de 1,5 según extractos.
7. **Reddit**: no consultado directamente.
8. **Calidad de audio** (bitrate) y rango exacto de velocidad (0,5-3,5x es [FUENTE ÚNICA]).
9. **Número exacto de títulos con voz IA.**
10. **Demandas recientes**: no se hizo una búsqueda en registros judiciales.
11. **Precios 2026 de Kobo Plus y Audible México**, y el precio oficial de Kindle+ en España (9,99 € según medios).
12. **Fecha exacta de llegada de los desbloqueos a España** (se sabe: EE. UU. oct-2024, México y Latinoamérica jun-2025, "casi todos los mercados" en jun-2026).

---

## 13. DATOS CLAVE PARA EL GUION (los 20 más útiles y seguros)

| # | Dato | Fuente (fecha) |
|---|---|---|
| 1 | Everand es la app de ebooks y audiolibros que **Scribd separó en noviembre de 2023**. Scribd se quedó con los documentos. Las tres empresas (más Fable) pertenecen a **Scribd, Inc.**, privada y con sede en **San Francisco** | Publishers Lunch (20-sep-2023); scribdinc.com |
| 2 | Desde el **10-nov-2025**, **Scribd y Everand son suscripciones separadas** para las altas nuevas | Scribd Premium Terms of Sale |
| 3 | **Ya no es ilimitado.** Desde el **30-oct-2024** funciona con **desbloqueos**: **Standard 11,99 $ = 1 libro, Plus 16,99 $ = 3, Deluxe 28,99 $ = 5** al mes | PW (30-oct-2024 y 20-ago-2025); ayuda oficial (27-oct-2026) |
| 4 | La propia ayuda lo dice: "¿Qué libros requieren desbloqueo? **La mayoría.**" | support.scribd.com (ago-2026) |
| 5 | Sin desbloqueo hay una **selección rotativa de unos 20.000 títulos "unlimited"**, de un catálogo de **más de 1,5 millones** | everand.com; PW (2-jun-2026) |
| 6 | El **Deluxe sale más caro por libro (5,80 $) que el Plus (5,66 $)**, según los datos de la propia web de Everand | everand.com/checkout (27-oct-2026) |
| 7 | **En España, Plus cuesta 14,99 € al mes** (unos 5 € por libro) en el App Store | App Store ES (27-oct-2026) |
| 8 | **En México, Standard cuesta 149 MXN** (App Store); Plus costaba 326 MXN en 2025 | App Store MX (27-oct-2026); ayuda (ago-2025) |
| 9 | **Prueba: 30 días en la web, solo 7 en las apps**, y **solo 1 libro** elijas el plan que elijas. **Pide tarjeta** y se renueva sola si no cancelas 24 h antes | Ayuda oficial (1-sep-2026) |
| 10 | Si cancelas **la prueba**, pierdes el acceso **en el momento**. Si cancelas una suscripción pagada, **los libros desbloqueados se bloquean**: no son tuyos | Ayuda oficial |
| 11 | Desde el **7-abr-2026** los desbloqueos no usados **se acumulan hasta 6 meses** (antes caducaban cada mes) | App Store, versión 16.6; PR (2-jun-2026) |
| 12 | Si te diste de alta por iPhone o Android, **hay que cancelar en Apple o Google**, y puede aparecer **como "Scribd"** | Ayuda oficial (15-oct-2026) |
| 13 | **No es la primera vez:** Scribd ya quitó el ilimitado en **2015-2016** y lo recuperó en **2018** | Publishers Lunch (2015, 2016) |
| 14 | **Unos 41.000 audiolibros en español**, con Penguin Random House Audio y Planeta Audio: García Márquez, Vargas Llosa, Ruiz Zafón, Pérez-Reverte, Gómez-Jurado, Posteguillo, Follett... **todos con desbloqueo** | Estimación propia con el buscador de Everand (27-oct-2026) |
| 15 | En el catálogo sin desbloqueo hay **solo unos 500-650 audiolibros en español**, entre ellos ***Crimen y castigo* en 2 horas** (versión abreviada) | Estimación propia (27-oct-2026) |
| 16 | Hay audiolibros en español con **"voz sintética"** acreditada en la ficha. Conviene mirar el narrador antes de desbloquear | Fichas de Everand |
| 17 | **Revistas y partituras desaparecieron el 28-ene-2025** | Ayuda oficial (13-ene-2025) |
| 18 | Google Play: **614.122 valoraciones y más de 10 M de descargas**. Nota de **3,5★ en EE. UU.** frente a **4,4★ en España y 4,5★ en México**. App Store: 4,3★ en EE. UU. (27.470) y España (851) | Google Play y App Store (27-oct-2026) |
| 19 | Tras el cambio a desbloqueos, las quejas largas en Google Play EE. UU. pasaron de **29 a 110 al mes**. Trustpilot: alrededor de **1,5/5** | unstar.app (7-sep-2026); extracto de Trustpilot |
| 20 | **21-sep-2026: incidente de seguridad** en Scribd Inc. Recomiendan **cambiar la contraseña** de Everand, Scribd, Slideshare y Fable | Ayuda oficial (actualizada el 1-oct-2026) |

**Contexto de la competencia para cerrar el vídeo** (España, octubre de 2026):
- Audible Premium: **9,99 €, ilimitado** en su catálogo incluido. Audible Standard: 6,99 € por 1 libro.
- Storytel: **8,99 €, ilimitado**.
- Spotify: **12 h al mes en Premium** desde el **7-oct-2026**; +15 h por 8,99 €.
- Kindle Unlimited: pasa a llamarse **Kindle+** el **23-oct-2026** e incluye audiolibros.

---

## 14. Ganchos para el vídeo (ideas)

1. **"Scribd era el 'Netflix de los libros'. Su heredero, Everand, te da... un libro al mes."**
2. **"La pregunta '¿qué libros necesitan desbloqueo?' tiene una respuesta oficial de una palabra: 'La mayoría'."**
3. **"Pagar más no siempre sale más barato: el plan Deluxe cuesta más por libro que el Plus."**
4. **"García Márquez, Ruiz Zafón, Pérez-Reverte... están todos. Pero cada uno te cuesta un desbloqueo."**
5. **"*Crimen y castigo* en dos horas: lo que de verdad hay en el catálogo 'ilimitado' en español."**
6. **"Everand vs. Spotify vs. Audible vs. Kindle+: el mes en que todo cambió"** (octubre de 2026).
7. **"La misma app tiene 4,5 estrellas en México y 3,5 en Estados Unidos. ¿Por qué?"**
8. **"Si cancelas, tus libros desaparecen: alquiler, no compra."**

---

## 15. Fuentes principales (por tipo)

**Oficiales: centro de ayuda (support.scribd.com, leído vía API el 27-oct-2026)**
- Planes: https://support.scribd.com/hc/en-us/articles/40678839226644-Everand-plans-Standard-Plus-and-Deluxe (y en español: https://support.scribd.com/hc/es/articles/40678839226644)
- Desbloqueos: https://support.scribd.com/hc/en-us/articles/40677287041684-How-unlocks-work-on-Everand
- Qué libros requieren desbloqueo: https://support.scribd.com/hc/en-us/articles/47040289862420-Which-books-require-an-unlock
- Problemas con desbloqueos: https://support.scribd.com/hc/en-us/articles/47040517243540-Something-s-wrong-with-my-unlocks
- Prueba gratis: https://support.scribd.com/hc/en-us/articles/46956976809236-About-your-free-trial-on-Everand
- Plan Legacy: https://support.scribd.com/hc/en-us/articles/46956730590484-I-m-on-a-Legacy-Everand-plan
- Cancelar: https://support.scribd.com/hc/en-us/articles/46929149941396-How-to-cancel-your-Everand-subscription
- Pausar: https://support.scribd.com/hc/en-us/articles/46929593791636-How-to-pause-your-Everand-subscription
- Reembolsos: https://support.scribd.com/hc/en-us/articles/47039530597524-How-refunds-work-on-Everand
- Cambiar de plan: https://support.scribd.com/hc/en-us/articles/31586457709972-How-to-switch-your-Everand-plan
- Dispositivos: https://support.scribd.com/hc/en-us/articles/47044532541076-Reading-on-multiple-devices
- Descargas: https://support.scribd.com/hc/en-us/articles/210135046-How-to-download-books-for-offline-access
- Reproductor: https://support.scribd.com/hc/en-us/articles/47043813405332-Audiobook-playback-features-and-settings
- Lector: https://support.scribd.com/hc/en-us/articles/47043665370388-Ebook-reading-features-and-settings
- Libros no encontrados: https://support.scribd.com/hc/en-us/articles/47041302629012-I-can-t-find-a-book-I-m-looking-for
- Primeros pasos: https://support.scribd.com/hc/en-us/articles/47042390664596-Getting-started-with-Everand
- Producto equivocado: https://support.scribd.com/hc/en-us/articles/51955535312788-Subscribed-to-the-wrong-product
- Referidos: https://support.scribd.com/hc/en-us/articles/50723460042772-Everand-Referrals
- Problemas conocidos: https://support.scribd.com/hc/en-us/articles/39389021447316-Known-issues-on-Everand
- Accesibilidad: https://support.scribd.com/hc/en-us/articles/6734475870868-Using-assistive-technology-with-Everand
- Principios de IA: https://support.scribd.com/hc/en-us/articles/21443910133268-Our-AI-Principles
- Fable: https://support.scribd.com/hc/en-us/articles/38205474518164-Everand-Fable-What-You-Need-to-Know
- Revistas y partituras: https://support.scribd.com/hc/es/articles/33823101289748
- Países: https://support.scribd.com/hc/es/articles/210135206
- Usuarios en la UE (DSA): https://support.scribd.com/hc/es/articles/24001072212500
- Incidente de seguridad: https://support.scribd.com/hc/en-us/articles/53787421531284-Information-about-the-recent-security-incident
- Acuerdo de suscriptor: https://support.scribd.com/hc/en-us/articles/210129486-Everand-Subscriber-Agreement
- Términos de Scribd Premium: https://support.scribd.com/hc/en-us/articles/43178587356564-Scribd-Premium-Terms-of-Sale
- Cómo suscribirse: https://support.scribd.com/hc/en-us/articles/210135626-How-to-subscribe

**Oficiales: webs y tiendas (27-oct-2026)**
- https://www.everand.com/ ; https://www.everand.com/what-is-everand ; https://www.everand.com/checkout/available-plans ; https://www.everand.com/unlimited
- Fichas de audiolibros: https://www.everand.com/audiobook/824931144 , /769294804 , /797680684 , /823808418 , /825372814 , /791239211 , /920008393 , /913213094 , /712072129
- Scribd Inc.: https://www.scribdinc.com/about ; https://www.scribdinc.com/newsroom/what-is-scribd-inc ; https://www.scribdinc.com/newsroom/scribd-inc-surpasses-one-billion-users ; https://www.scribdinc.com/newsroom/everand-and-fable-launch-a-single-shared-subscription
- App Store: https://apps.apple.com/us/app/id542557212 ; /es/ ; /mx/ ; /co/ ; /ar/ ; /cl/
- Google Play: https://play.google.com/store/apps/details?id=com.scribd.app.reader0 (con `gl=US/ES/MX/CO/AR/CL`)
- Nota de prensa (2-jun-2026): https://www.prnewswire.com/news-releases/everand-and-fable-launch-a-single-shared-subscription-302788169.html
- Compra de Fable (9-jun-2025): https://www.businesswire.com/news/home/20250609165978/en/Fable-Joins-Everand-a-Scribd-Inc.-Company-to-Create-the-Future-of-Social-Reading

**Prensa especializada**
- Publishers Weekly: créditos y cinco grandes (30-oct-2024): https://www.publishersweekly.com/pw/by-topic/digital/content-and-e-books/article/96350-scribd-to-launch-credit-based-model-expand-big-five-partnerships.html
- Publishers Weekly: Deluxe (20-ago-2025): https://www.publishersweekly.com/pw/by-topic/digital/content-and-e-books/article/98426-scribd-s-everand-adds-deluxe-subscription-tier.html
- Publishers Weekly: Everand y Fable (2-jun-2026): https://www.publishersweekly.com/pw/by-topic/industry-news/industry-deals/article/100534-everand-and-fable-create-community-of-five-million-users.html
- TechCrunch (2-jun-2026): https://techcrunch.com/2026/06/02/a-startup-everand-is-now-bundling-ebooks-audiobooks-and-book-clubs-in-challenge-to-amazon/
- Publishers Lunch: 2015, 2016 y 2023 (enlaces en la cronología); Jane Friedman (27-sep-2023)
- Shelf Awareness (2-oct-2013); PW (6-nov-2014); TechCrunch (6-nov-2014)
- Book Riot: https://bookriot.com/scribd-everand-unlimited-ebook-subscription/
- Fortune (12-abr-2024): https://fortune.com/2024/04/12/scribd-tony-grimminck-new-ceo-cfo/

**Competencia**
- Audible España: https://www.audible.es/blog/explicacion-de-audible ; https://www.audible.es/blog/suscripcion-de-audible
- Storytel: https://www.storytel.com/es/subscriptions ; https://www.storytel.com/mx/subscriptions ; https://www.storytel.com/cl/subscriptions ; https://www.storytel.com/ar/subscriptions
- Spotify: https://hipertextual.com/actualidad/spotify-acaba-de-mejorar-muchisimo-en-espana-amazon-esta-enfadadisima-con-esta-novedad/ ; https://expansion.mx/tecnologia/2026/10/08/audiolibros-spotify-mexico-como-escucharlos ; https://support.spotify.com/es/article/audiobooks-premium-plans/
- Kindle+: https://www.amazon.es/kindle-dbs/hz/subscribe/ku ; https://www.ultimahora.es/noticias/tecnologia-videojuegos/2026/10/23/2734841/amazon-cambia-nombre-kindle-unlimited-kindle-incluye-audiolibros-coste-adicional.html
- Podimo: https://podimo.com/es · BookBeat: https://www.bookbeat.com/es · Nextory: https://nextory.com/es
- Kobo Plus: https://www.kobo.com/kobo-writing-life/blog/rakuten-kobo-launches-kobo-plus-in-spain

**Opiniones y análisis de terceros (usar con cautela)**
- unstar.app (7-sep-2026): https://unstar.app/blog/everand-unlimited-unlocks-credits-price-app-reviews-2026
- Trustpilot: https://www.trustpilot.com/review/everand.com (no accesible en vivo)
- TextToLab (contiene errores; ver §3.3): https://texttolab.com/blog/everand-review
- elDiario.es (4-oct-2024): https://www.eldiario.es/consumoclaro/mejores-suscripciones-libros-electronicos_1_11678206.html ; Julián Marquina (16-may-2024): https://www.julianmarquina.es/cuales-son-las-principales-plataformas-para-leer-libros-electronicos-por-suscripcion/
