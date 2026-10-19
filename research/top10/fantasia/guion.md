# Los 10 mejores · Fantasía — guion (18/10/2026, formato v6 de la serie)

> ## ✔ Corregido antes de generar la voz (comprobación del 18/10/2026)
> Tres frases de la locución no aguantaban la comprobación. **Ya están corregidas** en `video/public/t10f/vo/vo.json` y en `Facts.tsx` con las propuestas de abajo (18/10, 22:20); la voz todavía no se ha generado, así que no se ha gastado nada:
>
> 1. **F93 (Sanderson): «Es el proyecto más financiado de la historia de la plataforma.» → FALSO desde junio de 2025.** La impresora eufyMake E1 reunió 46,7 M$ y le quitó el récord. Kickstarter lo cuenta así: «The previous record was held by the Brandon Sanderson — Four Secret Novels campaign» ([Kickstarter, 24/6/2025](https://updates.kickstarter.com/eufymakes-breaks-the-all-time-funding-record/); clasificación en [TCF](https://www.tcf.team/blog/most-funded-kickstarter)).
>    - Propuesta: «…y reunió más de cuarenta y un millones de dólares. Durante tres años fue el proyecto más financiado de la historia de la plataforma.»
>    - En `Facts.tsx` (F9), el sello «El proyecto más financiado de su historia» pasa a «Récord de Kickstarter durante 3 años». La palabra clave «historia» sigue en la frase.
> 2. **F83 (Alas de sangre): «Entró directa al número uno del New York Times» → no es exacto.** Debutó en el n.º 2 (lista del 15/5/2023, con «2 ++» = nuevo en la lista) y llegó al n.º 1 después: 13 de sus primeras 25 semanas en el n.º 1 ([Locus, 15/5/2023](https://locusmag.com/2023/05/weekly-bestsellers-15-may-2023); [Variety](https://variety.com/2023/tv/news/fourth-wing-tv-show-amazon-iron-flame-season-2-1235773492)).
>    - Propuesta: «Llegó al número uno del New York Times, fue el fenómeno del año en las redes, y Prime Video ya prepara la serie.»
>    - El sello «Nº 1 · The New York Times» de `Facts.tsx` (F8) puede quedarse.
> 3. **F53 (Rothfuss): «varias editoriales la rechazaron» y «llegó a las listas del New York Times» → no comprobado tal cual.**
>    - Los rechazos que cuenta Rothfuss fueron de **agentes**: «I'd been getting rejections for about two years from all different agents» ([Locus, 2010](https://locusmag.com/2010/08/patrick-rothfuss-worldbuilder)).
>    - El n.º 1 del New York Times que sí consta es el de **la segunda parte**, «El temor de un hombre sabio», en 2011 ([Faraway Press](https://farawaypress.com/2011/03/14/congrats-to-pat-rothfuss/)). Para la primera no he encontrado una fuente fiable.
>    - Propuesta: «Rothfuss la empezó a escribir en la universidad, y durante años solo recibió rechazos. Cuando por fin se publicó, en dos mil siete, ganó el premio Quill, y su segunda parte debutó en el número uno del New York Times.»
>    - En `Facts.tsx` (F5), «Varias editoriales la rechazan» pasa a «Rechazo tras rechazo» (clave: «rechazos»), y «Listas del New York Times» a «La 2.ª parte, n.º 1 del New York Times» (clave: «segunda»).
>
> El resto de datos está comprobado (fuentes abajo).

Serie del canal SonorBooks España, «Los 10 mejores». Segundo episodio, después de terror.
- **Enfoque (Joan, 15/10):** se vende como **historias**, no como libros ni audiolibros. SonorBooks entra poco a poco y siempre por el beneficio de quien lo ve: escucharlas gratis y hoy mismo. No es promoción pagada.
- **Formato v6 (Joan, 18/10):** cada historia acaba en su dato curioso, con el desplegable «Escúchala en SonorBooks · Gratis con prueba». Todo lo de cómo escucharlas va comprimido al final: la pantalla ESCUCHA con las diez y la web.
- **Voz:** Martin Osborne (ElevenLabs, `eleven_v4`, estabilidad 0,5, similitud 0,8, velocidad 1,05), la misma del episodio de terror. Texto y pronunciaciones en `video/public/t10f/vo/vo.json`. En la voz, las cifras van en letra; en rótulos y subtítulos, en número.
- **Duración:** 7:44 con la voz real (generada el 19/10/2026 con la cuenta nueva de ElevenLabs: 6.128 caracteres, más una toma nueva de F81 porque Whisper oía «Anas de sangre»). Whisper comprobó las 43 locuciones.
- **Orden:** de la más ligera a la más épica.

## La lista

Datos de Audible España comprobados de nuevo el 18/10/2026 con su catálogo (`api.audible.es`, `product_plans`, `rating`). La «nota» es la que dice el vídeo:
- *narración*: la nota de la interpretación en Audible;
- *audiolibro*: la nota general, cuando es la más representativa.

| # | Historia | Narración | Voz | Duración | Nota (base, n.º) | Dónde | Gratis |
|---|---|---|---|---|---|---|---|
| 10 | Alicia en el País de las Maravillas — Lewis Carroll (1865) | Michelle Jenner (Audible Studios, 2020) | Castellano | 3 h 13 min | 4,8 narración (586) · 4,5 audiolibro (654) | Audible (exclusiva) | Plus de Audible (ES-AYCL) |
| 9 | Circe — Madeline Miller (2018) | Sonia Román (BookaVivo, 2024) | Castellano | 16 h 44 min | 4,7 narración (208) · Storytel 4,5 (235) | Audible, Storytel, Nextory | AYCL · Storytel/Nextory |
| 8 | Harry Potter y la piedra filosofal — J. K. Rowling (1997) | Leonor Watling (Pottermore Publishing, 2020) | Castellano | 8 h 33 min | 4,9 audiolibro (2.904) · narración 4,9 (2.520) | Audible | AYCL |
| 7 | El Hobbit — J. R. R. Tolkien (1937) | Javier Gutiérrez (Audible Studios y Planeta Audio, 2023) · o Miguel Ángel Jenner (Planeta Audio, 2023) | Castellano | 10 h 40 min · 11 h 58 min | 4,8 audiolibro (535; narración 4,7 con 505) · Jenner: Storytel 4,7 (160) | Gutiérrez: Audible · Jenner: Storytel, Nextory, Podimo | AYCL · Storytel/Nextory/Podimo |
| 6 | El nombre del viento — Patrick Rothfuss (2007) | Raúl Lloréns (Penguin Random House, 2016) | Castellano | 27 h 20 min | 4,8 audiolibro (92) · narración 4,8 (77) | Audible, Audiobooks.com | Crédito de la prueba de Audiobooks.com (no entra en AYCL) |
| 5 | Olvidado rey Gudú — Ana María Matute (1996) | Neus Sendra (Planeta Audio, 2021) | Castellano | 34 h 34 min | 4,9 narración (77) · Storytel 4,4 (86) | Audible, Storytel, Nextory, Podimo | AYCL · Storytel/Nextory/Podimo |
| 4 | Memorias de Idhún I. La Resistencia — Laura Gallego (2004) | 10 voces, una por personaje (Saga Egmont, 2021) | Castellano | 18 h 1 min | 4,8 narración (324) · 4,6 audiolibro (358) | Audible, Storytel, Nextory, Podimo | AYCL · Storytel/Nextory/Podimo |
| 3 | Alas de sangre — Rebecca Yarros (2023) | Versión dramatizada en 2 partes (BookaVivo, 2026), más de 30 actores · o la íntegra con María Carolina Yarussi y Diego Longstaff (BookaVivo, 2023) | Castellano · la íntegra, voz latina | 17 h (7 h 46 + 9 h 17) · 21 h 7 min | 4,8 audiolibro (305, parte 1) · íntegra 4,6 (1.427) | Audible, Storytel (y la íntegra, también Nextory) | AYCL · Storytel |
| 2 | El imperio final — Brandon Sanderson (2006) | Francesc Belda (Penguin Random House, 2020) | Castellano | 24 h 21 min | 4,9 audiolibro (206) · narración 4,9 (167) | Audible, Audiobooks.com | Crédito de la prueba de Audiobooks.com (no entra en AYCL) |
| 1 | El Señor de los Anillos — J. R. R. Tolkien (1954-1955) | Miguel Ángel Jenner y Nuria Mediavilla (Planeta Audio, 2022-2023) | Castellano | 3 tomos: 22 h 29 + 20 h 1 + 24 h 28 = **66 h 58 min** | La Comunidad: 4,9 audiolibro (1.382) · Las dos torres 4,9 (615) · El retorno del rey 4,9 (321) | Audible, Storytel, Nextory, Podimo | AYCL · Storytel/Nextory/Podimo |

**Notas de la lista**
- **Alas de sangre, la dramatizada:**
  - En Storytel figuran 34 intérpretes en cada parte; Audible solo enseña 15. Parte 1: 30/6/2026; parte 2: 21/7/2026.
  - Los oyentes avisan de que no sigue la traducción publicada del libro (algunos nombres cambian). El vídeo y el artículo lo dicen.
  - La íntegra tiene voz latina y comentarios divididos sobre la narración. Por eso la recomendada es la dramatizada.
- **El Hobbit:** la de Javier Gutiérrez (dos Goya al mejor actor: «La isla mínima» y «El autor») divide a los oyentes: unos adoran que interprete a cada personaje y otros prefieren una lectura clásica. Por eso se dan las dos.
- **El Señor de los Anillos:** «El retorno del rey» lo narra solo Miguel Ángel Jenner. Miguel Ángel Jenner dobló a Gimli en las películas, y Nuria Mediavilla es hija de Pepe Mediavilla, la voz de Gandalf. Ese dato estaba en la F104, que se quitó con la regla v6; si se reutiliza en el blog, hay que comprobarlo antes.
- **Memorias de Idhún:** Storytel lista los 10 narradores (Germán Gijón, José García, Marina Viñals, Masumi Mutsuda, Omar Lozano, Cari Monrós, Edu Borja, Mabel Jiménez, Carles Teruel y Rubén Felis); Audible enseña 6. Laura Gallego lo cuenta así: «incluye narradores diferentes para cada uno de los personajes» ([su blog, 2021](https://www.goodreads.com/author_blog_posts/21295571-llega-tr-ada-en-versi-n-audiolibro)).

## Los datos de cada historia (F?3), con su fuente

| # | Dato en la voz | Comprobación |
|---|---|---|
| 10 | Excursión en barca en 1862 para entretener a tres hermanas; Alice le pidió que se la escribiera; tres años después, un libro. | ✔ 4/7/1862 por el Isis con las tres hermanas Liddell; Alice le pidió que la escribiera; Macmillan la publicó en noviembre de 1865 ([Wikipedia](https://en.wikipedia.org/wiki/Alice%27s_Adventures_in_Wonderland)). |
| 9 | Miller daba clases de latín y griego; en la «Odisea» Circe es la bruja que convierte en cerdos a los hombres de Ulises (canto X); n.º 1 del New York Times. | ✔ «went on to teach Latin, Greek, and Shakespeare to high school students»; «#1 New York Times Bestseller» ([Wikipedia, Madeline Miller](https://en.wikipedia.org/wiki/Madeline_Miller)). |
| 8 | La rechazaron una docena de editoriales; la publicó Bloomsbury porque la hija del fundador, de 8 años, leyó el primer capítulo y pidió más. | ✔ con matiz: el número que más se repite es doce ([Harry Potter Wiki](https://harrypotterbooks.fandom.com/wiki/Harry_Potter_and_the_Philosopher%27s_Stone)); otras fuentes dicen ocho. Alice Newton, de 8 años, leyó el primer capítulo ([Quién](https://www.quien.com/espectaculos/2017/11/17/es-gracias-a-esta-pequena-nina-que-el-mundo-pudo-conocer-a-harry-potter)). Nigel Newton fundó Bloomsbury en 1986. |
| 7 | Corrigiendo exámenes encontró una hoja en blanco y escribió «En un agujero en el suelo vivía un hobbit»; luego tuvo que averiguar qué era un hobbit. | ✔ «One of the candidates had mercifully left one of the pages with no writing on it…»; «eventually I thought I'd better find out what hobbits were like» ([Medievalists.net](https://www.medievalists.net/2012/09/j-r-r-tolkien-did-you-know-windows-on-the-life-and-work-of-j-r-r-tolkien/); [carta a Auden, 1955](https://dlab.epfl.ch/wikispeedia/wpcd/wp/t/The_Hobbit.htm)). |
| 6 | (Corregido) La empezó en la universidad; años de rechazos; publicada en 2007; premio Quill; su segunda parte, n.º 1 del NYT. | ✔ Corregido (ver arriba). La universidad, 2007 y el premio Quill 2007 están comprobados ([Locus, 2010](https://locusmag.com/2010/08/patrick-rothfuss-worldbuilder)). Los rechazos fueron de agentes, y el n.º 1 del NYT fue el de la segunda parte. |
| 5 | La empezó a finales de los sesenta; la abandonó durante una larga depresión; la publicó en 1996, 25 años después de su anterior novela; casi mil páginas; 14 años después, el Cervantes. | ✔ «comenzó a escribir a finales de los años 60»; abandonada en 1975 por la depresión; su novela anterior, «La torre vigía», es de 1971; «casi mil páginas» ([El Salto](https://www.elsaltodiario.com/literatura/olvidado-rey-gudu-novela-ana-maria-matute)). Premio Cervantes 2010. |
| 4 | Más de un millón de ejemplares de la trilogía; Netflix la convirtió en serie de animación en 2020. | ✔ «ha vendido más de 1 millón de ejemplares» ([3DJuegos](https://www.3djuegos.com/fenomeno-fan/noticias/sarah-j-mass-rebecca-yarros-esta-trilogia-fantasia-fue-adelantada-a-su-tiempo-tiene-que-volver-a-estanterias)); estreno en Netflix el 10/9/2020 ([NTN24](https://www.ntn24.com/noticias-entretenimiento/netflix-estrena-memorias-de-idhun-una-animacion-original-de-habla-hispana-125791)). |
| 3 | (Corregido) Llegó al n.º 1 del NYT; fenómeno del año en redes; Prime Video prepara la serie. | ✔ Corregido. Antes: debutó en el n.º 2 y llegó al n.º 1 después. La serie está aprobada en Prime Video, con Esther McGregor y Emilio Sakraya ([ComicBookMovie](https://comicbookmovie.com/fantasy/fourth-wing-prime-videos-live-action-series-finds-its-stars-in-esther-mcgregor-and-emilio-sakraya-a230462)). |
| 2 | (Corregido) Kickstarter 2022, cuatro novelas secretas, más de 41 M$; durante tres años, el proyecto más financiado de la plataforma. | ✔ Corregido. 41.754.153 $ ([CNBC](https://www.cnbc.com/2022/03/31/authors-record-breaking-kickstarter-campaign-closes-at-41point7-million.html)), pero el récord lo tiene desde 2025 la eufyMake E1 (46,7 M$). |
| 1 | Tardó doce años en escribirla (1937-1949); la editorial la partió en tres tomos para abaratarla; él insistía en que no era una trilogía, sino una sola novela. | ✔ Empezó en diciembre de 1937 y terminó la revisión en 1949 ([Wikipedia](https://en.wikipedia.org/wiki/Constructing_The_Lord_of_the_Rings)). «Due to high production costs and an uncertain market, the work was divided into three parts»; «For J. R. R. Tolkien, The Lord of the Rings was not a trilogy» ([The Morgan Library](https://www.themorgan.org/morganmobile/threes/tolkien)). |

Otras frases de la voz:
- **F105:** «Son tres libros y más de sesenta horas.» ✔ Son 66 h 58 min en Audible España.
- **F112:** «voces como Michelle Jenner, Leonor Watling o Javier Gutiérrez» ✔. «Todas las puedes empezar hoy mismo, gratis» ✔: ver la comprobación de «gratis».
- **F05 / pantalla de la investigación:**
  - «28 historias, 8 plataformas, más de 13.000 valoraciones y opiniones» son las cuentas internas del muro de candidatas.
  - En Audible España, las 28 suman unas 12.000 valoraciones (6.730 solo las diez elegidas, sin contar las otras partes o tomos). Con Storytel y el resto de plataformas pasan de 13.000; solo Storytel añade más de 2.000 (por ejemplo, «Alas de sangre» 1.191, «La Comunidad del Anillo» 410 y «Circe» 235).

## Candidatas que se quedaron fuera (muro de la investigación)

Notas generales de Audible España (entre paréntesis, la de la narración), consultadas el 18/10/2026.
- **Una por autor:**
  - «La canción de Aquiles» (Miller, 4,6/4,6) → «Circe».
  - «El camino de los reyes» (4,9; no entra en AYCL, 45 h) y «Elantris» (4,6/4,4) → «El imperio final».
  - «Crónicas de la Torre I: El Valle de los Lobos» (Gallego, 4,5/4,2) → «Memorias de Idhún».
  - «El Silmarillion» (4,8/4,9): Tolkien ya está dos veces.
- **Narración con quejas o más floja:**
  - «Un mago de Terramar» (Le Guin, 4,3/4,4; quejas sobre la narración).
  - «El príncipe cruel» (Holly Black, 4,2/4,0).
  - «Seis de cuervos» (Bardugo, narración 4,3).
  - «La guerra de la amapola» (Kuang, 4,4/4,4).
  - «Alas de sangre» íntegra (voz latina, 4,5 en la narración): se recomienda la dramatizada.
- **Buenas, pero por debajo de las elegidas o con un hueco ya cubierto:**
  - «Una corte de rosas y espinas» (Maas, 4,5/4,7, 1.613 valoraciones). Es la romantasía, que ya cubre «Alas de sangre». Su ficha de SonorBooks es la que se ve en pantalla en la investigación.
  - «El imperio del vampiro» (Kristoff, 4,8/4,7).
  - «Hermanos de sangre I» (Gwynne, 4,6/4,7).
- **Sin voz de España:** «Juego de tronos» solo existe en español con voz latina (Víctor Manuel Espinoza; Audible EE. UU., 4,9 con 430). En España casi no tiene valoraciones.
- **Muy pocas valoraciones en España** (sello «POCAS VALORACIONES»):
  - «El color de la magia» (Pratchett, 16).
  - «El ladrón del rayo» (Riordan, 11).
  - «Piranesi» (Clarke, 11).
  - «Crepúsculo» (Meyer, 5).
  - «La quinta estación» (Jemisin, 1).

## Comprobación de «gratis» (las diez)
- **Entran en el Plus de Audible (ES-AYCL) y se escuchan con su prueba de 30 días** 8 de las 10: Alicia, Circe, Harry Potter, El Hobbit (Gutiérrez), Olvidado rey Gudú, Memorias de Idhún, Alas de sangre (las dos versiones) y los tres tomos de El Señor de los Anillos. Varias están también en Storytel, Nextory o Podimo, con sus pruebas.
- **«El nombre del viento» y «El imperio final» no entran en AYCL.** Su ficha de SonorBooks los da gratis con el crédito de la prueba de Audiobooks.com.
- Por eso la voz dice «todas las puedes empezar hoy mismo, gratis». Las pruebas son para usuarios nuevos y con las condiciones de cada plataforma.

## Locución (de `video/public/t10f/vo/vo.json`, 18/10/2026)
Ids F = vídeo largo; J = vertical. Con la regla v6 no hay F?4 ni F?5 salvo **F105**, el cierre del n.º 1. F112 es la pantalla ESCUCHA y F115, la web.

- **F01** — Hay historias que se leen.
- **F02** — Y hay historias que te llevan tan lejos que, cuando vuelves, ya no eres el mismo.
- **F03** — Estas son las diez historias de fantasía de las que no vas a querer salir.
- **F05** — Para elegirlas, en SonorBooks hemos mirado las notas y las opiniones de miles de oyentes y lectores.  
  _Pronunciación (say):_ Para elegirlas, en Sónorbuks hemos mirado las notas y las opiniones de miles de oyentes y lectores.
- **F07** — Vamos de la más ligera a la más épica.
- **F11** — Número diez: «Alicia en el País de las Maravillas», de Lewis Carroll.  
  _Pronunciación (say):_ Número diez: «Alicia en el País de las Maravillas», de Lúis Cárrol.
- **F12** — Una tarde de verano, Alicia ve pasar un conejo blanco con chaleco y reloj de bolsillo. Lo sigue por una madriguera y cae a un mundo donde encoge y crece según lo que come, toma el té con un sombrerero loco y una reina no para de gritar: «¡Que le corten la cabeza!»
- **F13** — Carroll se la inventó en una excursión en barca, en mil ochocientos sesenta y dos, para entretener a tres hermanas. La pequeña Alice le pidió que se la escribiera. Tres años después, era un libro.  
  _Pronunciación (say):_ Cárrol se la inventó en una excursión en barca, en mil ochocientos sesenta y dos, para entretener a tres hermanas. La pequeña Ális le pidió que se la escribiera. Tres años después, era un libro.
- **F21** — Número nueve: «Circe», de Madeline Miller.  
  _Pronunciación (say):_ Número nueve: «Circe», de Mádelin Míler.
- **F22** — Hija del dios del Sol, Circe nace sin el poder de su padre ni la belleza de su madre. Hasta que descubre la brujería. Los dioses la destierran a una isla, y allí, sola, se convierte en la hechicera que temen los marineros.
- **F23** — Madeline Miller daba clases de latín y griego. En la «Odisea», Circe es solo la bruja que convierte en cerdos a los hombres de Ulises. Miller le dejó contar su versión, y la novela llegó al número uno del New York Times.  
  _Pronunciación (say):_ Mádelin Míler daba clases de latín y griego. En la «Odisea», Circe es solo la bruja que convierte en cerdos a los hombres de Ulises. Míler le dejó contar su versión, y la novela llegó al número uno del Niu Iork Taims.
- **F31** — Número ocho: «Harry Potter y la piedra filosofal», de J. K. Rowling.  
  _Pronunciación (say):_ Número ocho: «Jarry Póter y la piedra filosofal», de Jota Ka Róulin.
- **F32** — Harry vive en una alacena, bajo la escalera de sus tíos. El día que cumple once años, un gigante echa la puerta abajo y le dice que es un mago. Le espera un colegio en un castillo… y alguien que quiere robar una piedra capaz de dar la vida eterna.  
  _Pronunciación (say):_ Jarry vive en una alacena, bajo la escalera de sus tíos. El día que cumple once años, un gigante echa la puerta abajo y le dice que es un mago. Le espera un colegio en un castillo… y alguien que quiere robar una piedra capaz de dar la vida eterna.
- **F33** — Lo rechazaron una docena de editoriales. La que por fin lo publicó lo hizo porque la hija del fundador, de ocho años, leyó el primer capítulo y pidió más.
- **F41** — Número siete: «El Hobbit», de J. R. R. Tolkien.  
  _Pronunciación (say):_ Número siete: «El Jóbit», de Jota Erre Erre Tólkien.
- **F42** — Bilbo Bolsón vive tranquilo en su agujero hobbit. Hasta que un mago y trece enanos se presentan en su casa para llevárselo a recuperar un tesoro. Un tesoro que ya tiene dueño: un dragón.  
  _Pronunciación (say):_ Bilbo Bolsón vive tranquilo en su agujero jóbit. Hasta que un mago y trece enanos se presentan en su casa para llevárselo a recuperar un tesoro. Un tesoro que ya tiene dueño: un dragón.
- **F43** — Tolkien lo empezó casi por casualidad: corrigiendo exámenes, encontró una hoja en blanco y escribió: «En un agujero en el suelo vivía un hobbit». Luego tuvo que averiguar qué era un hobbit.  
  _Pronunciación (say):_ Tólkien lo empezó casi por casualidad: corrigiendo exámenes, encontró una hoja en blanco y escribió: «En un agujero en el suelo vivía un jóbit». Luego tuvo que averiguar qué era un jóbit.
- **F51** — Número seis: «El nombre del viento», de Patrick Rothfuss.  
  _Pronunciación (say):_ Número seis: «El nombre del viento», de Pátrik Rótfus.
- **F52** — En una posada perdida, un posadero pelirrojo sirve cerveza sin llamar la atención. Pero un cronista lo ha encontrado y sabe quién es en realidad: el héroe de mil leyendas. Durante tres días, va a contar su verdadera historia.
- **F53** — Rothfuss la empezó a escribir en la universidad, y durante años solo recibió rechazos. Cuando por fin se publicó, en dos mil siete, ganó el premio Quill, y su segunda parte debutó en el número uno del New York Times.  
  _Pronunciación (say):_ Rótfus la empezó a escribir en la universidad, y durante años solo recibió rechazos. Cuando por fin se publicó, en dos mil siete, ganó el premio Cuil, y su segunda parte debutó en el número uno del Niu Iork Taims.
- **F61** — Número cinco: «Olvidado rey Gudú», de Ana María Matute.
- **F62** — En el reino de Olar, levantado a base de conquistas y traiciones, nace un príncipe con una maldición: no puede amar. Su madre, la reina Ardid, lo prepara para ser el rey más grande. Y bajo la tierra, en los lagos y en el mar, esperan trasgos, sirenas y piratas.
- **F63** — Matute la empezó a finales de los sesenta y la abandonó durante una larga depresión. La publicó en mil novecientos noventa y seis, veinticinco años después de su anterior novela: casi mil páginas de fantasía escrita en español. Catorce años más tarde, ganó el Premio Cervantes.
- **F71** — Número cuatro: «Memorias de Idhún», de Laura Gallego.  
  _Pronunciación (say):_ Número cuatro: «Memorias de Idún», de Laura Gallego.
- **F72** — Jack tiene trece años. Una noche vuelve a casa y encuentra a sus padres asesinados. El culpable es Kirtash, un asesino llegado de Idhún, un mundo con tres soles y tres lunas donde los dragones y los unicornios han sido exterminados. Para detenerlo, Jack se une a la Resistencia.  
  _Pronunciación (say):_ Yak tiene trece años. Una noche vuelve a casa y encuentra a sus padres asesinados. El culpable es Kírtash, un asesino llegado de Idún, un mundo con tres soles y tres lunas donde los dragones y los unicornios han sido exterminados. Para detenerlo, Yak se une a la Resistencia.
- **F73** — Laura Gallego ha vendido más de un millón de ejemplares de esta trilogía, y Netflix la convirtió en serie de animación en dos mil veinte.  
  _Pronunciación (say):_ Laura Gallego ha vendido más de un millón de ejemplares de esta trilogía, y Nétflix la convirtió en serie de animación en dos mil veinte.
- **F81** — Número tres: «Alas de sangre», de Rebecca Yarros.  
  _Pronunciación (say):_ Número tres: «Alas de sangre», de Rebeca Yárros.
- **F82** — Violet iba a ser escriba. Pero su madre, la general, la obliga a entrar en el Colegio de Guerra de Basgiath, donde los cadetes se juegan la vida para que un dragón los elija. Y donde muchos la quieren muerta.  
  _Pronunciación (say):_ Váiolet iba a ser escriba. Pero su madre, la general, la obliga a entrar en el Colegio de Guerra de Básguiaz, donde los cadetes se juegan la vida para que un dragón los elija. Y donde muchos la quieren muerta.
- **F83** — Llegó al número uno del New York Times, fue el fenómeno del año en las redes, y Prime Video ya prepara la serie.  
  _Pronunciación (say):_ Llegó al número uno del Niu Iork Taims, fue el fenómeno del año en las redes, y Praim Vídeo ya prepara la serie.
- **F91** — Número dos: «El imperio final», de Brandon Sanderson.  
  _Pronunciación (say):_ Número dos: «El imperio final», de Brándon Sánderson.
- **F92** — Hace mil años, el héroe que debía salvar el mundo fracasó. Desde entonces reina un dios inmortal, del cielo cae ceniza y, de noche, todo se cubre de niebla. Vin, una ladrona callejera, descubre que puede tragar metales y quemarlos para conseguir poderes. Y una banda de ladrones la necesita para derribar al dios.
- **F93** — Sanderson es un fenómeno: en dos mil veintidós pidió dinero en Kickstarter para publicar cuatro novelas secretas y reunió más de cuarenta y un millones de dólares. Durante tres años fue el proyecto más financiado de la historia de la plataforma.  
  _Pronunciación (say):_ Sánderson es un fenómeno: en dos mil veintidós pidió dinero en Kíkstarter para publicar cuatro novelas secretas y reunió más de cuarenta y un millones de dólares. Durante tres años fue el proyecto más financiado de la historia de la plataforma.
- **F101** — Número uno: «El Señor de los Anillos», de J. R. R. Tolkien.  
  _Pronunciación (say):_ Número uno: «El Señor de los Anillos», de Jota Erre Erre Tólkien.
- **F102** — Frodo hereda de su tío Bilbo un anillo de oro. Un mago le revela la verdad: es el Anillo Único, el arma del Señor Oscuro. Y la única forma de destruirlo es llevarlo hasta el fuego donde se forjó, en el corazón de Mordor.
- **F103** — Tolkien tardó doce años en escribirla, y la editorial la partió en tres tomos para abaratarla. Él siempre insistió en que no era una trilogía, sino una sola novela.  
  _Pronunciación (say):_ Tólkien tardó doce años en escribirla, y la editorial la partió en tres tomos para abaratarla. Él siempre insistió en que no era una trilogía, sino una sola novela.
- **F105** — Son tres libros y más de sesenta horas. El viaje más largo de la lista… y del que menos vas a querer volver.
- **F111** — Un consejo: escúchalas mientras caminas, cocinas o vas al trabajo. Son mundos enormes, y así se recorren sin darte cuenta.
- **F112** — Y lo mejor: las diez están en audio, con voces como Michelle Jenner, Leonor Watling o Javier Gutiérrez, y todas las puedes empezar hoy mismo, gratis.  
  _Pronunciación (say):_ Y lo mejor: las diez están en audio, con voces como Michel Yéner, Leonor Uátlin o Javier Gutiérrez, y todas las puedes empezar hoy mismo, gratis.
- **F115** — En SonorBooks cada historia tiene su ficha, con su nota, las plataformas donde está y su prueba gratuita: eliges una, le das al play y empiezas sin pagar. Los enlaces están en la descripción, y la lista completa, en nuestro blog.  
  _Pronunciación (say):_ En Sónorbuks cada historia tiene su ficha, con su nota, las plataformas donde está y su prueba gratuita: eliges una, le das al plei y empiezas sin pagar. Los enlaces están en la descripción, y la lista completa, en nuestro blog.
- **F113** — Y cuéntanos en los comentarios: ¿en qué mundo te quedarías a vivir? ¿Y qué historias quieres que te traigamos después?
- **F114** — Tu próxima historia te está esperando.
- **J01** — Número uno de las historias de fantasía de las que no vas a querer salir: «El Señor de los Anillos», de J. R. R. Tolkien.  
  _Pronunciación (say):_ Número uno de las historias de fantasía de las que no vas a querer salir: «El Señor de los Anillos», de Jota Erre Erre Tólkien.
- **J02** — Las otras nueve, en el vídeo completo.
