# El Libro Total como plataforma de AUDIOLIBROS — documentación de primera mano

- **Web analizada:** https://www.ellibrototal.com/ltotal/ (marca en pantalla: "EL LIBRO TOTAL · PRISMA").
- **Fecha de la prueba:** 10/10/2026.
- **Cómo se probó:** Chromium (Playwright) a 1920×1080 en escritorio y con emulación de iPhone 14 Pro Max (430×740 CSS, user-agent de iOS). Siempre **sin cuenta** (no se creó ninguna). Se registraron las peticiones de red y se leyó el JavaScript público del sitio (`/estaticosED/files/js/...`) para entender cómo funciona el reproductor. Las fichas de las tiendas se consultaron con la API pública de iTunes (`itunes.apple.com/lookup`), el RSS de reseñas de Apple, la página de Google Play y la librería `google-play-scraper`.
- **Convenciones:** cada dato lleva su evidencia: una captura (`assets/el-libro-total/screens/…`), una URL o petición, una cita literal o una referencia al código. Lo que no se pudo comprobar está marcado como **NO VERIFICADO**. "Según el código" significa que se dedujo del JavaScript del sitio y no se observó en uso.
- **Texto completo de las Preguntas frecuentes:** `research/el-libro-total/faq.md`.
- **Nota sobre automatización:** las propias FAQ dicen (p. 37): "NO AUTORIZAMOS … descargar la información a través de peticiones automatizadas". Por eso las estadísticas de narradores y duraciones salen de una **muestra aleatoria de 200 audiolibros** (≈200 peticiones pequeñas y espaciadas) y no de un rastreo del catálogo completo.

---

## 0. Resumen de hallazgos clave

| Tema | Hallazgo | Evidencia |
|---|---|---|
| Precio | Gratis y sin publicidad. FAQ: "completamente gratuitos y sin fines comerciales". | faq.md p. 4; capturas sin anuncios |
| Registro | **No hace falta cuenta para leer ni para escuchar.** La cuenta (gratuita) solo es necesaria para marcadores, favoritos, historial y notas. | capturas 07, 13; modales "debe crear una cuenta gratis" |
| Nº de audiolibros | **6.698** (contador de la sección; la portada muestra "Ver 6689 más" = 6.698 − 9 visibles). "Novela en audio": 614. | `pd_23.jsp` → `counter_6698`; capturas 22 y 23 |
| Tipo de contenido | Muestra de 200: 98 % en español y **79 % cuentos** (11,5 % novelas). Duración mediana **17,6 min**; el 67 % dura menos de 30 min. También hay obras largas: *Crimen y castigo* dura 26,6 h y *Ana Karenina* 40,8 h. | §5 |
| Cómo suena | **Un MP3 por página del libro** (no por párrafo), sincronizado con el texto. El bloque que se oye se resalta, un globo aerostático baja por el margen como indicador y las **páginas pasan solas**. | §3; capturas 07–09, 35 |
| Narradores | Voces **humanas acreditadas** ("Leído por …"). No se puede elegir voz. En la muestra, seis voces concentran ≈81 % de los créditos: Álvaro Gómez Zafra (35 %), Hernando Iván Cano, Maritza Castro, Rocío Tavera, Omar Barrera y Fernán Astahiza. | §4 |
| Voces sintéticas | Respuesta del desarrollador (28/08/2026): "son voces naturales, no son un lector automático". Indicios de TTS: modo "Asistencia por voz" (TTS del dispositivo) solo en la app nativa, y una función interna de edición `generateWithEdgeTTS`. No se encontró ningún audiolibro publicado con voz sintética acreditada (**NO VERIFICADO**). | §4.3 |
| Controles | **Velocidad 0,8×/1×/1,2×/1,5×/2× solo en dispositivos táctiles** (web móvil y app). En la web de escritorio no hay control de velocidad. No hay saltos ±, barra de tiempo, temporizador ni elección de narrador en la web. | §3.4; captura 34 |
| Offline | La web no tiene modo offline. La app permite **leer** EPUB/PDF sin conexión; el **audio offline no está disponible** (respuesta del desarrollador del 12/06/2025: "no estará disponible hasta el año siguiente"). Estado actual en la app: **NO VERIFICADO**. | §7 |
| Calidad de audio | MP3 de **64 kbps CBR, 44,1 kHz**, "estéreo" con los dos canales idénticos (mono real). Ancho de banda de ~11 kHz en dos muestras y de ~6,5 kHz en una tercera. El volumen varía entre −13,3 y −17,7 LUFS. | §6; `assets/el-libro-total/audio-samples/` |
| App | Google Play: **"Libro Total Libros AudioLibros"** (`com.syc.librototal.El_Libro_Total`), 4,9★, 51.965 valoraciones, **5 M+ descargas**, v2.24, actualizada el 4 de septiembre de 2026. App Store: **"El Libro Total"** (id 1298628446), 4,95★ (765 valoraciones, tienda CO), v1.25 del 5 de agosto de 2026, 18,1 MB. | §9 |

---

## 1. Qué es, quién está detrás, precio y registro

- **Entidad:** "La Fundación El Libro Total, fundada en 2005, es una entidad sin ánimo de lucro respaldada por Sistemas y Computadores S.A. … en Colombia" (faq.md, p. 3). Créditos que aparecen en cada libro: "Fundación El Libro Total, proyecto de responsabilidad social e intelectual de la firma Sistemas y Computadores S.A." (captura 08, página izquierda).
- **Precio:** "Los servicios y la navegación en la biblioteca digital El Libro Total son completamente gratuitos y sin fines comerciales" (faq.md, p. 4). No se vio publicidad en ninguna pantalla. Las tiendas lo describen como "Libre de avisos publicitarios".
- **Catálogo y derechos:** "publica las obras que se encuentran en Dominio Público y aquellas en las que los autores y traductores han permitido su reproducción" y no incluye libros técnicos (faq.md, p. 10). La Guía de uso lo resume así: "si buscas contenido contemporáneo, posiblemente no lo encuentres en línea" (`helper.js`).
- **Registro (formulario "Crear cuenta", captura 19):** pide Nombres y apellidos, Correo electrónico, Confirmar correo electrónico, Contraseña y Confirmar contraseña, más la casilla "Autorizo y Acepto la Política de tratamiento de la información y el Marco general de uso". El inicio de sesión es solo con correo y contraseña, más "Restaurar contraseña" y "Crear cuenta". **En la web no hay inicio de sesión con Google ni con Apple.**
- **Qué exige cuenta (comprobado sin sesión):** Marcador de página, Favoritos, Mi historial y Mis notas. Cada uno abre un modal con el texto "Para utilizar el servicio de Mis marcadores / Mis favoritos / Mi historial / Mis notas, debe crear una cuenta gratis como lector. Si ya la tiene, por favor inicie sesión." (captura 13).
- **Qué no exige cuenta:** leer, **escuchar audiolibros**, buscar, usar el diccionario, el vocabulario, la lectura comparada y compartir citas.
- **Beneficios según la FAQ (p. 9):** historial de lecturas, imágenes, música y palabras consultadas; biblioteca personal de favoritos; libro de notas personales. La FAQ (p. 15) añade que "Continuar leyendo" y la última página leída requieren sesión iniciada.

## 2. Catálogo: cifras observadas (contadores de la propia web, 10/10/2026)

| Sección | Cifra | Evidencia |
|---|---|---|
| Audiolibros | **6.698** | `counter_6698` (`pd_23.jsp`); captura 22 |
| Audiolibros → filtro "Novela" ("Novela en audio") | 614 | `counter_614`; captura 23 |
| Chips de filtro "Filtrar audiolibros" | 753 (géneros y temáticas) | `counter_753`, "Ver 744 más" |
| Libros en Español / Inglés / Francés / Italiano / Ruso / Alemán / Portugués | 21.504 / 1.023 / 413 / 71 / 56 / 52 / 40 | sección Idiomas; captura 26 |
| Libros enriquecidos | 89 | captura 24 |
| Confrontados a otros idiomas | 459 | portada, `counter_459` |
| Recomendados / Agregados recientemente | 185 / 70 | portada |
| Videos | 1.073 | captura 25 |
| Diccionarios (sección) | 30 | captura 29. La FAQ y las tiendas hablan de "más de 70 diccionarios" (ver UX-11) |
| Música: inspirada en libros / Culta / Folclor / Instrumental / Rock | 690 / 1.064 / 729 / 281 / 382 | captura 27 |
| Arte: más visto / inspirado en libros / Fotografía / Artistas | 1.000 / 1.190 / 13.378 / 2.590 | captura 28 |
| Afirmaciones de marketing | App Store: "más de 50.000 títulos"; Google Play: "más de 220.000 contenidos" | fichas de las tiendas (§9). **NO VERIFICADO** |

**Proporción de libros con audio:** hay 6.698 audiolibros frente a 21.504 libros en español. Como el contador de audiolibros también incluye obras en inglés y francés, el porcentaje exacto queda **NO VERIFICADO** (orden de magnitud: ~30 %).

## 3. Cómo funciona la audiolectura

### 3.1 Cómo se reconoce un audiolibro
- Las carátulas de los libros con audio llevan un **icono de altavoz** (capturas 04, 05, 23 y 24). En la fila "Audiolibros" de la sección Audiolibros las carátulas aparecen sin ese icono (captura 22; ver UX-16).
- En la ficha, solo la versión narrada lleva altavoz. En *Crimen y castigo*, la traducción anónima (id 5718) tiene audio; las de Pedro Pedraza y Páez, inglés (Garnett), francés (Derély) y ruso no lo tienen (captura 05; `versions_data` con `"t_son": "1"` solo en la traducción 5718).
- La ficha **no indica el narrador ni la duración** (captura 05).

### 3.2 Activación (comprobado con *Crimen y castigo*, id 5836,5718)
1. Abrir el libro con "Ir al libro" (captura 05) o con un enlace profundo `https://www.ellibrototal.com/ltotal/?t=1&d=5836,5718,<página>`.
2. Pulsar el **altavoz** ("Reproducir audiolibro", abajo a la derecha de la página derecha; en la página izquierda aparece arriba, junto a la X) o el **globo aerostático multicolor** del margen (captura 06).
3. Suena el MP3 de esa página. Durante 7 s en escritorio y 4 s en táctil aparece "**Leído por Hernando Iván Cano**", que luego se desvanece (captura 07; código: `sleepLabelLector = isTouch ? 4000 : 7000`).
4. El texto de la página que se está oyendo se resalta en beige (`#FFEDCA`) y el globo, que pasa a mostrar el icono de pausa, baja por el margen como indicador de progreso (captura 08).
5. **Las páginas pasan solas.** Observado: tras el MP3 de la p. 1 se cargaron solos los de las pp. 2, 3 y 4 y el libro avanzó sin intervención (red: `5836_5718_1…mp3` → `_2_` → `_3_` → `_4_`; captura 08). En móvil también avanzó solo a 1,5× (captura 35).
6. Para pausar o reanudar se pulsa el globo; en móvil, el altavoz de la barra inferior. Con el audio en pausa, la **barra espaciadora no lo reanuda** (probado).

La FAQ (p. 26) lo explica así: "Ellos se distinguen de los demás libros porque en la carátula están identificados con el ícono del parlante. Para reproducir abra el libro y haga clic sobre el ícono del parlante o del globo aerostático ubicado en la parte superior de las páginas. Las páginas correrán solas." (captura 03). La Guía de uso dice: "Identifica en el libro abierto los íconos de la bocina y el globo aeroestático…" (captura 21).

### 3.3 Arquitectura técnica (red y código)
- La respuesta de `text_data.jsp` incluye en cada página un campo oculto `hdn_sonido` con la ruta, la duración en milisegundos y el narrador. Ejemplo literal: `/testLtotal/sonido/5836/5718/5836_5718_1_244279.mp3|35971|Hernando Iván Cano`.
- **La unidad de audio es la página del libro**, no el párrafo: `<idLibro>_<idTrad>_<página>_<idSonido>.mp3`. El resaltado se aplica a todos los elementos con la clase `pg_N` de esa página (`$('.'+pgClass).addClass('text_audio_lec')`). Por eso **se resalta un bloque entero y no la frase ni la palabra**: en la captura 08, el resaltado termina a mitad de párrafo ("…ingrata de"), justo donde acaba la página 4 del libro.
- El globo se mueve **linealmente según el tiempo**, estimado a partir de la proporción de píxeles de texto (`globo.animate({top:…},{duration:…, easing:'linear'})`). El paso de página automático también se calcula por proporción de píxeles. La sincronización es aproximada; una reseña lo señala: "el globito que indica a dónde va la narración va a destiempo" (Alicia, Google Play, 16/10/2022).
- **Empezar desde cualquier punto:** si se pasa de página a mano y luego se pulsa el altavoz, el audio arranca en el punto de la página visible. Comprobado: tras avanzar dos páginas sonó `5836_5718_8_…mp3` desde unos 21 s y no desde el principio (captura 09). El código calcula `playbackAt` con el porcentaje de texto ya pasado y fija `audio.currentTime`.
- **Pasar página a mano mientras suena pausa el audio**, también con la flecha → del teclado. Comprobado dos veces: `paused: true` tras pulsar "Página siguiente" y sigue en pausa 5 s después.
- Los MP3 son **públicos**: se descargan sin autenticación ni DRM (`curl` directo, respuestas HTTP 206 al reproducir).
- Duración total de *Crimen y castigo*: las **1.514 páginas tienen audio**, todas de Hernando Iván Cano, con una suma de **95.850.963 ms ≈ 26,6 h** (suma de los `hdn_sonido` de las 77 secciones de `text_data.jsp`). La web **no muestra esa duración** en ningún sitio.
- **Índice del libro** (captura 12): pestañas Contenido / Marcadores / Notas. El índice lista partes y capítulos con su número de página, pero **sin duraciones**.

### 3.4 Controles disponibles según la plataforma

| Control | Web escritorio | Web móvil (táctil) | App nativa |
|---|---|---|---|
| Play/pausa | Globo o altavoz (sí) | Altavoz de la barra inferior o globo (sí, captura 33) | Sí (código: `AudioPlayer` nativo) |
| Velocidad | **No.** Comprobado: 0 elementos `.speed_tool/.speed_menu` durante la reproducción; el código solo lo muestra `if (globito.hasPlaybackRate && isTouch)` | **Sí: 0,8×, 1,0×, 1,2×, 1,5× y 2,0×** (captura 34). Comprobado: `playbackRate: 1.5` y la reproducción continúa. Al abrir el menú el audio se pausa | Sí según el código (`ChangePlaybackRate`). **NO VERIFICADO** |
| Saltos ±N s | No | No | El código envía `SkipInterval: 20` al reproductor nativo (posibles saltos de 20 s). **NO VERIFICADO** |
| Barra de tiempo o duración | No | No. Existe un elemento `time_tool`, pero está oculto (`vis=false`) | **NO VERIFICADO** |
| Temporizador de apagado | No (no aparece en el código web) | No | Las reseñas lo piden en 2025 y 2026 (§9.3), lo que indica que faltaba al menos en v2.17 y v2.23. **NO VERIFICADO** en la versión actual |
| Elegir narrador o voz | No | No | No. Respuesta oficial del 28/08/2026: "las voces no tienen la opción de seleccionar" |
| Paso de página automático | Sí | Sí | Sí según el código |
| Reproducción en segundo plano o con la pantalla bloqueada | La web no usa la Media Session API (no hay `mediaSession` en el JS), así que no hay controles en la pantalla de bloqueo. **NO VERIFICADO** en un dispositivo real | Igual que en escritorio. **NO VERIFICADO** | Reseñas: "se puede escuchar con la pantalla bloqueada o en segundo plano" (2020). El código envía título, autor y portada al reproductor nativo |
| Guardar velocidad y preferencias | Solo con sesión iniciada (`setPreferenciaLector` exige `lectorLogueado`) | Igual | Igual |

## 4. Narradores y voces

### 4.1 Créditos
- El único crédito visible es el rótulo temporal "Leído por <nombre>" durante la reproducción (capturas 07 y 33). En móvil sustituye a la barra superior del lector.
- **No se puede buscar ni filtrar por narrador.** Al buscar "Hernando Iván Cano" la web devuelve solo "aproximaciones de nombres de autores" (Hernando Coba, Hernando Colón…) y ningún audiolibro leído por él.
- Varios narradores pueden repartirse un mismo libro. Ejemplo: *El regreso de Sherlock Holmes* lo leen Álvaro Gómez Zafra, Raúl Gutiérrez y Maritza Castro (`ut_42.jsp`).

### 4.2 Muestra aleatoria de 200 audiolibros (199 respuestas válidas)
Datos obtenidos con `POST /ltotal/inicio/utils/ut_42.jsp`, que devuelve rutas, duraciones y narradores de cada libro.

| Narrador (crédito literal) | Nº de audiolibros en la muestra |
|---|---|
| Álvaro Gómez Zafra | 70 |
| Hernando Iván Cano (+1 como "Hernando I. Cano") | 27 |
| Maritza Castro | 19 |
| Rocío Tavera | 19 |
| Omar Barrera | 15 |
| Fernán Astahiza (10) / "Fernán Astahíza" (5) | 15 |
| Raúl Gutiérrez | 6 |
| Marcela Uribe | 4 |
| Otros con 1–3 libros: Ana Alvarado (+1 como "Ana Alcarado"), Carmen R. Franco / Carmen Rosa Franco, Luis Eduardo Jaimes Bautista, Eduardo A. Durán A., María Camila Bahamón, Natalia Dávila, Ramiro Piraquive, Raúl Moreno Jerez, Heriberto Sánchez, Carlos Martínez, María A. Gómez, Gloria Uribe, Rosa M. Sánchez R., Horacio Tavera, Giovanni Cruz, Valerie Bertagnini, Didier, Mà, Tux, Cori Samuel, Karen Savage, "LibriVox"/"Librivox", "Caracol Radio", "xeno-canto.org" | 1–3 cada uno |

- Hay **37 créditos distintos**, algunos variantes ortográficas del mismo nombre (ver UX-10). Hay 204 créditos en 199 libros porque 4 libros tienen varios narradores.
- Hay fuentes externas: LibriVox (por ejemplo *El maravilloso mago de Oz* en inglés), una entrevista de Caracol Radio y grabaciones de aves de xeno-canto.org en *Guía de aves de la Guajira*.
- Los 30 primeros de la lista de audiolibros, que por sus `idSonido` (~551.000) parecen los más recientes, son casi todos de Álvaro Gómez Zafra: cuentos cortos de Amado Nervo de 3,5 a 11,7 minutos.
- **Duraciones de la muestra:** mínimo 1,0 min, P25 9,5, **mediana 17,6**, P75 44,5, máximo 2.445 min (40,8 h, *Ana Karenina*). Media 86,7 min. El 27 % dura menos de 10 min, el 67 % menos de 30 min, el 20 % más de 1 h y el 8 % más de 5 h.
- Idioma y género (etiquetas de `load_image.jsp`): 196 en español, 2 en inglés y 2 en francés. 158 cuentos, 23 novelas y 11 compilaciones.
- Estimación muy gruesa de horas totales: 6.698 × 86,7 min ≈ 9.700 h. **NO VERIFICADO**: la distribución tiene una cola larga y una muestra de 199 no basta para precisarlo.

### 4.3 ¿Voces humanas o sintéticas?
- **Postura oficial:** "recuerda de los audiolibros del libro total son voces naturales, no son un lector automático de libros por eso las voces no tienen la opción de seleccionar" (respuesta de SYC a una reseña de 1★ en Google Play, 28/08/2026). Las tiendas anuncian "Escucha los libros con voces naturales y profesionales".
- **Indicio 1 (TTS del dispositivo, solo en la app):** algunos libros sin narración llevan el indicador `hdn_trad_tts=1`; el libro de las Preguntas frecuentes es uno de ellos (`ut_27.jsp`). Según el código, si la app nativa tiene la capacidad `TTS_AudioBooks` y el usuario activa "Asistencia por voz" en Configuración, el lector usa la voz sintética del dispositivo. En ese caso el globo es un "robot_globe", el resaltado es azul (`#CAEDFF`) y el crédito es "TTS". En la web esos libros **no muestran altavoz** (captura 03, FAQ sin icono). La función en la app queda **NO VERIFICADA**. La novedad de Google Play dice: "Asistencia por voz para la navegación de los contenidos".
- **Indicio 2 (herramienta interna):** el módulo de edición que se descarga a todos los visitantes (`/estaticosED/files/js/ltotal/edicion.js`) contiene `audiolibros.generateWithEdgeTTS(...)` (caso 63 de `edicion_libros.jsp`). Junto a "Debe escribir el nombre del lector del audiolibro" y "Por favor seleccione un paquete de archivos mp3", esto sugiere que el equipo editorial puede **generar audio con Microsoft Edge TTS**. **NO VERIFICADO** si se ha publicado algún audiolibro así: en la muestra no aparece ningún crédito tipo "TTS", "Edge", "voz sintética" o "IA".
- **Caso dudoso:** *Gerona* (Galdós) está acreditado a "**Tux**", un seudónimo. Su MP3 tiene un ancho de banda de solo ~6,5 kHz (§6). No se puede afirmar si es humano o sintético (**NO VERIFICADO**; no se escucharon los audios: el análisis fue solo técnico).
- **Uso de IA en otras áreas, confirmado por el desarrollador:** "El uso de inteligencia artificial en algunas portadas busca mejorar la experiencia visual…" (respuesta del 02/01/2026 en Google Play). En Música hay pistas de un intérprete llamado "Ómicron IA" (2025–2026) en la búsqueda "Crimen y castigo" (captura 04), y existe una sección "Contrainteligencia artificial" (captura 27).
- **Cómo aportar voz:** "previamente debemos escuchar un registro sonoro producido por Ud.… El archivo mp3 deberá enviarlo a través del contáctenos" (faq.md, p. 36).

## 5. Ejemplo de referencia: *Crimen y castigo* (Dostoievski)
- Ficha: "1866 – 1514 páginas". Etiquetas: Novela, Clásico, Drama, Angustia, Asesinatos, Crimen, Justicia, Psicológico. Botones "Ir al libro" y "Contenido relacionado". Iconos sin rótulo: vocabulario, confrontar, favorito y compartir (captura 05).
- Fuente del texto: "es.wikisource.org" (captura 08).
- Audio: 1.514 MP3, uno por página, ≈26,6 h, todo leído por Hernando Iván Cano.
- Versiones: Trad. al español (con audio), Trad. de Pedro Pedraza y Páez, inglés (Constance Garnett), francés (Victor Derély) y ruso (captura 05).
- Es libro enriquecido, con ilustraciones dentro del texto (captura 13, fondo).
- Vocabulario: 6.912 palabras en 151 páginas, ordenadas por frecuencia (DECIR 1.643, TENER 1.213, RASKOLNIKOF 972…) (captura 18).

## 6. Calidad técnica del audio (ffprobe y ffmpeg)

Archivos en `assets/el-libro-total/audio-samples/`:

| Archivo | Libro / narrador | Duración | Códec / bitrate | Muestreo | Canales | Diferencia L−R | Ancho de banda útil* | Sonoridad (EBU R128) | Tags del codificador |
|---|---|---|---|---|---|---|---|---|---|
| `crimen-y-castigo_p4_hernando-ivan-cano.mp3` | *Crimen y castigo*, p. 4 | 56,9 s | MP3 64 kbps CBR | 44,1 kHz | 2 (estéreo) | −91 dB (canales idénticos) | ~11 kHz | −13,6 LUFS | Lavf55.19.104 |
| `el-plomo-en-la-entrana_p3_alvaro-gomez-zafra.mp3` | *El plomo en la entraña* (Amado Nervo), p. 3 | 51,7 s | MP3 64 kbps CBR | 44,1 kHz | 2 | −91 dB | ~11 kHz | −17,7 LUFS | LAME3.100 |
| `gerona_p3_tux.mp3` | *Gerona* (Galdós), p. 3, "Tux" | 48,0 s | MP3 64 kbps CBR | 44,1 kHz | 2 | −91 dB | **~6,5 kHz** | −13,3 LUFS | Lavc56.60 / Lavf56.40.101, genre "Blues" |

\*Estimado con espectrogramas (`espectrograma_*.png` en la misma carpeta) y con energía por encima de 8, 11, 13 y 15 kHz. En *Gerona* la energía por encima de 15 kHz está en el suelo digital (−91 dB) y el espectrograma corta hacia 6,6 kHz, lo que hace pensar en una fuente de ~16 kHz remuestreada.

Conclusiones:
- Formato uniforme de **64 kbps a 44,1 kHz con dos canales idénticos**, es decir, mono duplicado. Esto equivale a unos 32 kbps de información por canal, una calidad modesta pero suficiente para voz.
- Hay silencios digitales limpios entre frases en *Crimen y castigo* (puerta de ruido o edición).
- Calidad heterogénea entre libros: hay diferencias de ancho de banda y de unos 4,4 LU de volumen entre muestras.

## 7. Descarga y lectura sin conexión

- **Web:** no hay opción de descarga ni modo offline. En la ficha web, tanto de escritorio como de móvil, no existe el botón "Leer offline" (captura 36). El texto de la ficha no contiene "offline" (dump de la ficha móvil). Los MP3 son descargables a mano por URL, pero eso no es una función ofrecida al usuario.
- **App (según la FAQ, p. 12):** "lectura offline desde los dispositivos móviles… cargar tus libros EPUB": opción "Leer offline" en la ficha del libro, cargar EPUB desde el almacenamiento (icono de carpeta) o recibirlos desde WhatsApp y Telegram. La Guía de uso de la app añade un paso "MIS DESCARGAS": "Descarga desde nuestra biblioteca y usa El Libro Total como lector de libros externos en formato Epub y PDF sin conexión" (`helper.js`; solo aparece si `hasOfflineBooks()` es verdadero, es decir, en la app).
- **Formatos anunciados:** Google Play dice "EPUB y PDF"; App Store dice "EPUB, PDF, AZW y MOBI".
- **Audio offline:** el 12/06/2025 el desarrollador respondió a una usuaria que había bajado dos audionovelas y no podía oírlas sin conexión: "el servicio de audiolibro fuera de línea no estará disponible hasta el año siguiente". Otras reseñas lo piden desde 2018 (§9.3). Estado en la versión actual (v2.24 / v1.25): **NO VERIFICADO**. Las fichas de las tiendas no anuncian audio offline.

## 8. El lector: qué hace cada icono (títulos literales del atributo `title`)

**Escritorio** (libro abierto a doble página, capturas 06–09):

| Posición | Icono | `title` | Qué hace (comprobado) |
|---|---|---|---|
| Arriba a la izquierda | X | "Cerrar" | Cierra el libro |
| Arriba a la izquierda (cuando hay audio en esa página) | Altavoz | "Reproducir audiolibro" | Reproduce desde la página izquierda (captura 09) |
| Arriba a la derecha | ☰ | "Índice" | Índice con pestañas Contenido, Marcadores y Notas (captura 12) |
| | aA | "Apariencia del texto" | Tamaño de letra (A−/A+), "Tema del contenedor" (blanco, sepia y oscuro) y "Tipo de letra" (Times, DM Sans, Literata, Roboto) (capturas 10 y 11) |
| | ☆ | "Agregar este libro a mis favoritos" | Sin sesión, pide crear cuenta |
| | Marcador | "Marcador de página" | Sin sesión, pide crear cuenta (captura 13) |
| | Lupa | "Buscar en este libro" | Busca en todo el texto. Ejemplo: "hacha" da "33 páginas con la expresión", con fragmentos y enlaces "Ir a página" (captura 14) |
| Margen | Globo aerostático multicolor | (sin `title`) | Play o pausa e indicador de progreso de la audiolectura (capturas 06–08) |
| Abajo a la derecha | Libreta | "Notas" | Según el código, resalta en verde los pasajes con notas o relaciones (tipos 5, 15 y 27) de las páginas visibles; al pulsar uno se abre la nota. En las páginas probadas no se vio ninguna nota. Funcionamiento: **NO VERIFICADO** |
| | Libro con flechas | "Confrontar idiomas" | Abre la pestaña "Lectura comparada" en columnas sincronizadas. Ejemplo: español + inglés + francés; solo la columna en español tiene altavoz (captura 15). Google Play anuncia "hasta cuatro idiomas a la vez" según la pantalla |
| | Altavoz | "Reproducir audiolibro" | Inicia la audiolectura desde la página derecha |
| Laterales | Flechas | "Página anterior" / "Página siguiente" | Pasan página; mientras suena el audio, lo pausan |
| Primera página | Enlaces "Vocabulario" y "Contenidos relacionados" | | El vocabulario se clasifica en Sustantivos, Nombres, Verbos y Adjetivos (también aparece "Adverbio") y se ordena por frecuencia (captura 18) |

**Al seleccionar texto** aparece un menú contextual con "Diccionario | Compartir cita | Nota":
- "Diccionario" abre una pestaña interna con la palabra y entradas de varios diccionarios. Ejemplo: "tarde" en el Diccionario de Autoridades de 1726 (captura 16).
- "Compartir cita" ofrece Facebook, X, correo y "regalo", y copia un enlace profundo con coordenadas, por ejemplo `https://www.ellibrototal.com/ltotal/?t=1&d=5836_5718_4&txt_coord=4,1,0_4,1,157`, con el mensaje "¡Enlace copiado al portapapeles!" (captura 17).
- "Nota" requiere cuenta (FAQ p. 22).

**Móvil (web)** (capturas 32–35): una página por pantalla.
- Barra superior: ‹ (volver), Índice, aA, ☆, Buscar y Marcador. Durante la reproducción, esa barra muestra "Leído por …".
- Abajo: barra de progreso, "N de 1514", Notas, Confrontar idiomas y Altavoz.
- Al reproducir aparece una hoja inferior con un velocímetro (velocidad), el número de página y el altavoz.

## 9. Otras secciones de la web

- **Audiolibros** (captura 22): una fila "Audiolibros" (6.698) y "Filtrar audiolibros", una tira de 753 chips con géneros (Cuento, Novela, Compilación, Poesía, Artículo, Crónica, Ensayo, Teatro…) y temáticas (Fantástico, Infantil, Terror, Policial…). Al aplicar un filtro aparece una cuadrícula como "Novela en audio" (614) (captura 23). No hay filtros por narrador, duración, idioma ni orden.
- **Libros enriquecidos** (89): clásicos ilustrados y en su mayoría con audio (1984, Alicia, Ana Karenina, Crimen y castigo, Don Quijote, Drácula…) (captura 24).
- **Confrontados a otros idiomas** (459, en la portada) e **Idiomas** (captura 26).
- **Videos** (1.073): carátulas genéricas naranjas idénticas, muchas sin autor (captura 25).
- **Diccionarios** (30 en la sección): RAE, Autoridades 1726, Covarrubias 1610, Moliner, Corominas, regionalismos y otros (captura 29).
- **Música:** "Música inspirada en libros", Culta, Folclor, Instrumental, Rock y "Contrainteligencia artificial" (música, arte y fotografía aleatorios) (captura 27).
- **Arte:** Arte más visto, Arte inspirado en libros, Fotografía, Arte por países y Artistas (captura 28).
- **Mi biblioteca** (portada, captura 01): Iniciar sesión, Mis favoritos, Mi historial, Mis notas, Preguntas frecuentes y Configuración. Sin sesión, favoritos, historial y notas piden crear cuenta.
- **MENÚ:** Iniciar sesión, Crear cuenta, Configuración, Contáctenos, Guía de uso y Preguntas frecuentes (capturas 19, 20, 21 y 37).
  - **Configuración** (web): solo "Tamaño de la interfaz" (Estándar o Aumentado) (captura 20). Según el código, en la app se añade "Asistencia por voz" (TTS).
  - **Contáctenos:** campos "Su nombre", "Su correo electrónico", "Su mensaje para la biblioteca del Libro Total" y la casilla de política de datos.
  - **Guía de uso:** 11 pasos en web (Contenidos, Audiolibros, Diccionarios, Confrontar idiomas, Vocabulario, Notas personales, Favoritos, Marcadores, Continuar leyendo, Letra y modo nocturno) y uno más en la app ("Mis descargas") (captura 21; `helper.js`).
- **Búsqueda general:** "198 resultados de 'Crimen y castigo' en el catálogo general", agrupados en libros, música y arte (captura 04).

## 10. Versión móvil (web, iPhone emulado) frente a escritorio

| Aspecto | Móvil web | Evidencia |
|---|---|---|
| Primera visita | Modal "Para una mejor experiencia descarga nuestra app!" con enlaces a App Store y Google Play. No sale si se entra por enlace profundo (código `promoNativeApp`) | captura 30 |
| Cabecera | Menú hamburguesa a la izquierda, logo y lupa (en escritorio: botón "MENÚ" y caja "BUSCAR" a la derecha) | capturas 31 y 37 |
| Lector | Una página por pantalla, barra de iconos arriba y abajo, contador "N de 1514" | captura 32 |
| Audio | **Hay control de velocidad** (0,8–2×) en la hoja inferior; en escritorio no | capturas 33 y 34 |
| "Leído por" | Ocupa la barra superior durante unos 4 s | captura 33 |
| Paso de página automático | Sí (comprobado a 1,5×) | captura 35 |
| Ficha | Mismos iconos (confrontar, compartir, favorito, vocabulario), sin "Leer offline" | captura 36 |
| Texto | Justificado, con huecos grandes entre palabras ("esos     momentos     experimentaba") | capturas 32 y 33 |

## 11. Apps oficiales

### 11.1 Fichas

| Dato | Google Play | App Store |
|---|---|---|
| Nombre exacto | **Libro Total Libros AudioLibros** | **El Libro Total** (el enlace de la web usa el slug `el-libro-total-biblioteca`) |
| Paquete / ID | `com.syc.librototal.El_Libro_Total` | id **1298628446**, bundle `com.syc.librototal` |
| Desarrollador | SYC S.A. (Sistemas y Computadores S.A., Floridablanca, Santander, Colombia; developer@syc.com.co) | SISTEMAS Y COMPUTADORES S. A. |
| Valoración | **4,9★** (4,913934), **51.965 valoraciones**, 4.770 reseñas escritas. La página muestra "52 k opiniones" en general y "48.8 k" en la pestaña Teléfono | **4,95★ con 765 valoraciones** (tienda CO). Otras tiendas: EE. UU. 4,89 (784), México 4,94 (879), España 4,82 (532), Argentina 4,94 (178), Perú 4,91 (171), Chile 4,86 (107), Ecuador 4,96 (92) |
| Descargas | **5 M+** (el scraper da `realInstalls` 5.951.534) | Apple no las publica |
| Última actualización | **4 sep 2026**, versión **2.24** | **5 ago 2026**, versión **1.25** |
| Novedades | "Asistencia por voz para la navegación de los contenidos. Corrección de errores." | "Nueva funcionalidad de transcripción de voz disponible para usuarios habilitados. El acceso al micrófono solo se utiliza cuando el usuario decide iniciar una grabación." |
| Tamaño | **NO VERIFICADO** (Google Play web no lo muestra) | **18,1 MB** (18.113.536 bytes) |
| Requisitos | **NO VERIFICADO** (la FAQ dice Android > 5.0) | iOS **16** o posterior (la FAQ dice iOS 10, desactualizada) |
| Categoría / edad | Libros y obras de consulta / Para mayores de 10 años | Libros, Educación / 9+ |
| Lanzamiento | 23 nov 2017 | 15 nov 2017 |
| Precio | Gratis | Gratis |

Fuentes: https://play.google.com/store/apps/details?id=com.syc.librototal.El_Libro_Total&hl=es_419&gl=CO · https://itunes.apple.com/lookup?id=1298628446&country=co · https://apps.apple.com/co/app/el-libro-total/id1298628446

### 11.2 Funciones anunciadas (literal y resumido)
- **Google Play:** "Biblioteca en streaming… Libre de avisos publicitarios, con más de 220.000 contenidos… Cuenta con un lector de libros offline en formato EPUB y PDF". Además: "Descarga los libros de la biblioteca El Libro Total o carga libros externos en formato EPUB y PDF"; "**Escucha los libros con voces naturales y profesionales**"; "Compara un libro página a página en distintos idiomas… podrás enfrentar hasta cuatro idiomas a la vez y escuchar los audiolibros"; "más de 70 diccionarios"; tamaño de letra y modo nocturno; "más de 1.600 palabras clave, géneros y temáticas"; buscar expresiones dentro de libros y videos; biblioteca personalizada; vocabulario; compartir.
- **App Store:** "más de 50.000 títulos… Lector de libros offline en formato EPUB, PDF, AZW y MOBI"; "Escucha los libros en voces naturales y profesionales"; versiones e idiomas comparados; "tus lecturas recientes, notas y favoritos estarán sincronizados en todos los dispositivos".
- **Ninguna de las dos fichas anuncia** audio offline, temporizador ni elección de voz.

### 11.3 Reseñas representativas (literales y abreviadas)
Muestra descargada: 589 reseñas únicas de Google Play (CO/es, ordenadas por relevancia y por fecha; 527 de 5★) y 291 de App Store (CO, MX, ES y EE. UU.; 277 de 5★). Las reseñas negativas son minoría, pero se concentran en audio offline, temporizador, sesión y estabilidad.

**Positivas**
1. **Agustín Canale** (Google Play, 5★, 28/04/2020, 299 votos útiles): "Antes nunca confié en los audiolibros por la voz metálica y robótica… pero estos son leídos por personas que respetan a la perfección las comas y puntos y las entonaciones".
2. **Oriana Mozo** (Google Play, 5★, 03/11/2020, 328 votos útiles): "la opción de audiolibro es genial, puedes escuchar la lectura con el celular bloqueado. También cuenta con modo oscuro… ¡Y no tiene publicidad!".
3. **Sergio Tele** (Google Play, 5★, 03/01/2024, 212 votos útiles): "con el audio libro incluso saben transmitir bien las emociones… el libro de sherlock holmes… que los personajes tengan voces propias".
4. **Cesar VP** (App Store CO, 5★, 01/05/2020): "audiolibros que no sea con lectura electrónica sino por personas que [son] profesionales en leer. Esta es la única que he encontrado".

**Mixtas o con fallos**
5. **Alicia** (Google Play, 5★, 16/10/2022, 465 votos útiles): "el único errorcito… cuando se escucha el audio el globito que indica a dónde va la narración va a destiempo".
6. **Alejandro Mesa Gómez** (Google Play, 5★, 30/06/2022, 338 votos útiles): "al girarse en mi celular, la diagramación del libro se daña y se desconfigura la narración del audiolibro… al finalizar un libro este se queda en la cola de 'continuar leyendo'".

**Negativas o peticiones**
7. **Andrés c.** (Google Play, 3★, 09/04/2025, 19 votos útiles): "le falta… un temporizador para los audio libros… me duermo y sigue el audio libro funcionando".
8. **Verónica Charras** (Google Play, 3★, 19/05/2026, v2.23): "la app no se cierra cuando… se termina el audio… mantiene la pantalla encendida y gasta toda la batería".
9. **Matilde García Rodríguez** (Google Play, 2★, 12/06/2025): "Me he bajado dos audio novelas pero al abrirlas no me da la opción de oírlas". Respuesta de SYC: "el servicio de audiolibro fuera de línea no estará disponible hasta el año siguiente".
10. **maite pollan** (Google Play, 1★, 25/08/2026): "la experiencia auditiva… sin otras opciones de voz en la reproducción". Respuesta de SYC: "son voces naturales… no tienen la opción de seleccionar".
11. **Alejandro** (Google Play, 1★, 13/09/2026, v2.23): "olvida mi sesión constantemente, en celular no acepta mi contraseña". Hay quejas parecidas de inicio de sesión en julio de 2026 (Luis Arnaiz, Samedi Black).
12. **Neithan Perche** (Google Play, 1★, 02/01/2026): critica las portadas hechas con IA generativa; SYC confirma su uso "en algunas portadas".
13. App Store MX: **master_ing** (3★, 2021): "Las paginas No pasan de una en una… de dos en dos". **Obresvel** (2★, 2020): "muy lenta y se traba".

## 12. Problemas de UX encontrados (con evidencia)

1. **UX-1 · Carga pesada y lenta.** La portada tarda unos 4 s en mostrar la fila de Audiolibros (3,9–4,1 s en 3 ejecuciones), llega a "network idle" en 5,3–5,8 s y descarga **244 peticiones y ~14 MB**, de los cuales 144 son carátulas (9,25 MB). Los scripts principales se cargan tras un `setTimeout` de 1,2 s, y se descarga a todos los visitantes el módulo de edición interna `edicion.js` (~240 KB). Abrir un libro por enlace profundo tarda ~3,6–3,7 s hasta ver el texto. *Medido con un script propio de Playwright desde un contenedor de centro de datos tras un proxy: orientativo.*
2. **UX-2 · URL y título fijos.** Navegando por clics la URL es siempre `https://www.ellibrototal.com/ltotal/` y el título siempre "El Libro Total - La Biblioteca digital de América" (dumps de ficha y libro). No se puede copiar de la barra un enlace al libro o a la sección; hay que usar el botón Compartir.
3. **UX-3 · El contador de páginas no coincide con el índice.** El índice dice "Capítulo II … 27" y, al saltar, el contador marca "28 de 1514" (captura 13). El enlace profundo a la p. 4 muestra "5 de 1514" en móvil (captura 32) y "6 de 1514" en escritorio (captura 17). En la FAQ, la p. 26 aparece como "27 de 43" (captura 03).
4. **UX-4 · Sin control de velocidad en escritorio.** Solo existe en táctil (código `isTouch`; comprobado: 0 elementos en escritorio frente a la captura 34 en móvil).
5. **UX-5 · Controles de audio mínimos.** No hay barra de tiempo, duración total ni por capítulo, saltos ±, temporizador, cola ni accesos de teclado (la barra espaciadora no reanuda el audio). El índice no indica tiempos (captura 12).
6. **UX-6 · Sincronización aproximada.** Se resalta la página lógica entera, no la frase, y el globo se mueve de forma lineal estimada por píxeles (§3.3; reseña de Alicia).
7. **UX-7 · Pasar página a mano pausa el audio** (comprobado), y abrir el menú de velocidad en móvil también lo pausa (`paused: true`). Hay que volver a pulsar play.
8. **UX-8 · Iconos de la ficha sin rótulo ni tooltip.** Vocabulario, confrontar, favorito y compartir tienen `title` vacío y al pasar el ratón no aparece nada (captura 05). En el lector sí tienen tooltip.
9. **UX-9 · Narrador casi invisible.** No aparece en la ficha; "Leído por" solo se ve 4–7 s al reproducir; no se puede buscar por narrador (§4.1).
10. **UX-10 · Créditos de narrador inconsistentes.** Variantes como "Fernán Astahiza" y "Fernán Astahíza", "Hernando Iván Cano", "Hernando I. Cano" y "Álvaro Gómez Z.", "Ana Alvarado" y "Ana Alcarado", "LibriVox" y "Librivox" (`ut_42.jsp`).
11. **UX-11 · FAQ desactualizada o incoherente.**
    - Dice "Menú… ubicado en la parte superior izquierda", pero en escritorio el botón MENÚ está arriba a la derecha (captura 01); a la izquierda solo está en móvil.
    - Dice "disponible en… App Store y Apple Stores" y no menciona Google Play.
    - Pide "Android 5.0 / iOS 10", pero el App Store exige iOS 16.
    - Habla de "más de 70 diccionarios", pero la sección Diccionarios lista 30 (captura 29).
12. **UX-12 · Modales sobredimensionados y vacíos.** El aviso "debe crear una cuenta" y el formulario de registro ocupan casi toda la pantalla con mucho espacio en blanco (capturas 13 y 19).
13. **UX-13 · Funciones básicas tras registro.** Marcador de página y favoritos exigen cuenta (captura 13).
14. **UX-14 · Videos poco escaneables.** Todas las carátulas son naranjas e iguales y muchas no tienen autor (captura 25).
15. **UX-15 · Móvil.** Modal intrusivo de "descarga nuestra app" (captura 30) y texto justificado con huecos grandes (captura 32).
16. **UX-16 · Indicador de audio inconsistente.** En la fila "Audiolibros" de la sección Audiolibros las carátulas no llevan altavoz (captura 22); en filtros, búsqueda y enriquecidos sí (capturas 04, 23 y 24).
17. **UX-17 · Calidad de audio y volumen heterogéneos** entre libros (§6).
18. **UX-18 · Leyenda incompleta del Vocabulario.** Muestra 4 tipos, pero la tabla incluye "Adverbio" (captura 18).
19. **UX-19 · Fallos reportados en la app** (no reproducidos aquí, **NO VERIFICADO**): rotación de pantalla que desconfigura la narración, pérdida de sesión o contraseña rechazada, falsos "sin conexión" y pantalla siempre encendida (§11.3).

## 13. Síntesis: puntos fuertes y débiles observados

**Fuertes**
- Gratis, sin anuncios y **sin registro para escuchar**.
- Catálogo grande de audio en español: 6.698 títulos, incluidos clásicos largos completos (*Crimen y castigo*, 26,6 h; *Ana Karenina*, 40,8 h).
- **Voces humanas acreditadas** y un núcleo estable de narradores.
- Lectura y escucha sincronizadas: resaltado, globo, paso de página automático y opción de empezar desde cualquier página.
- Integración única con diccionarios históricos, vocabulario, lectura comparada en varios idiomas, ilustraciones y citas con enlace profundo.
- App muy bien valorada (4,9★ y 5 M+ descargas en Google Play).

**Débiles**
- Sin audio offline (al menos hasta mediados de 2025 según el desarrollador) y sin temporizador.
- Sin saltos ni barra de tiempo; sin velocidad en escritorio.
- Narrador oculto y sin opción de elegir voz.
- Sincronización por página y no por frase.
- Catálogo de audio dominado por cuentos cortos (mediana 17,6 min) y sin novedades con derechos.
- Web lenta, sin URLs propias y con detalles de interfaz anticuados.
- Calidad de audio modesta (64 kbps mono duplicado) y desigual.
- FAQ con datos desactualizados.

## 14. Lista de lo NO VERIFICADO
- Funciones de audio en la app nativa: velocidad, saltos de 20 s, segundo plano, pantalla de bloqueo, temporizador y TTS "Asistencia por voz". Solo se tienen el código web y las reseñas.
- Si existe ya audio offline en la app (v2.24 / v1.25).
- Tamaño de la app y versión mínima de Android en Google Play.
- Si algún audiolibro publicado está generado con TTS (Edge TTS) y la naturaleza de la voz "Tux".
- Total exacto de horas de audio del catálogo y porcentaje exacto de libros en español con audio.
- Funcionamiento del icono "Notas" del lector en páginas con notas.
- Comportamiento de la reproducción web con la pantalla bloqueada en un iPhone o Android reales.
- Las afirmaciones de las tiendas ("más de 50.000 títulos", "más de 220.000 contenidos", "más de 70 diccionarios").

## 15. Inventario de evidencias

**Capturas** (`assets/el-libro-total/screens/`, 2× a 1920×1080; las de móvil a 3×, 430×740 CSS):
01-home-escritorio · 02-faq-indice-libro · 03-faq-como-activar-audiolectura · 04-busqueda-crimen-y-castigo · 05-ficha-crimen-y-castigo · 06-lector-crimen-y-castigo-portada · 07-audiolectura-leido-por-hernando-ivan-cano · 08-audiolectura-resaltado-progresivo-y-globo · 09-audiolectura-desde-pagina-visible · 10-lector-menu-apariencia-aA · 11-lector-modo-oscuro · 12-lector-indice-contenido-marcadores-notas · 13-marcador-requiere-cuenta · 14-lector-buscar-en-este-libro · 15-lectura-comparada-es-en-fr · 16-diccionario-desde-seleccion · 17-compartir-cita-enlace-profundo · 18-vocabulario-de-la-obra · 19-formulario-crear-cuenta · 20-configuracion-tamano-interfaz · 21-guia-de-uso-paso-audiolibros · 22-seccion-audiolibros-y-filtros · 23-filtro-novela-en-audio-614 · 24-libros-enriquecidos · 25-videos · 26-idiomas · 27-musica · 28-arte · 29-diccionarios · 30-movil-modal-descarga-app · 31-movil-home · 32-movil-lector · 33-movil-audiolectura-reproduciendo · 34-movil-velocidad-0.8-a-2x · 35-movil-paso-de-pagina-automatico · 36-movil-ficha-sin-boton-leer-offline · 37-movil-menu (todas en `.png`).

**Audio** (`assets/el-libro-total/audio-samples/`): 3 MP3 de ejemplo y sus espectrogramas `espectrograma_*.png`.

**Endpoints útiles** (todos `POST`):
- Texto y audio por página: `/ltotal/inicio/text_data.jsp` con `id_item=<libro>,<trad>&tipoLibro=1&modoLibro=1&seccion=N&direction=forward&modoSeccion=paginas`. `modoLibro=0` devuelve el índice, `1` el texto (20 páginas por sección) y `3` la búsqueda interna con `searchWords=`.
- Rutas, duraciones y narradores de todo un libro: `/ltotal/inicio/utils/ut_42.jsp` con `tipoLibro=1&idLibro=&idTrad=`.
- Metadatos del libro (versiones y si tiene TTS): `/ltotal/inicio/utils/ut_27.jsp`.
- Lista de audiolibros: `/ltotal/inicio/panel_data/pd_23.jsp` con `tipo_item=23&id_item=-2&expandRelas=1`.
- Etiquetas de carátulas: `/ltotal/inicio/load_image.jsp` con `caso=1&queryItems=4_<libro>,<trad>|…`.
- Enlaces profundos: `https://www.ellibrototal.com/ltotal/?t=1&d=<libro>,<trad>,<página>` (libro) y `&nbk=1` (solo ficha).
