# Por dónde y cómo empezar a leer · Kierkegaard (guion final, 19/10/2026)

Encargo de Joan (19/10/2026, 08:18): «ahora vamos con kierkegaard». Mismo formato, calidad y animaciones que los episodios de
Stephen King y Dostoievski. Título: «Kierkegaard: por dónde y cómo empezar a leer».

**Qué aporta este episodio:** Kierkegaard publicó más de treinta obras, pero en audiolibro en español solo hay cuatro (más dos
introducciones cortas). Así que el vídeo no elige entre veinte libros: presenta las cuatro puertas que existen, dice qué dejar
para el papel y explica los seudónimos (quién habla en cada libro), que es lo que más despista al empezar.

- Canal: SonorBooks España. Duración final: 9:24 (28.222 fotogramas a 50 fps).
- Voz: Martin Osborne (ElevenLabs, `eleven_v4`, velocidad 1,13), como los episodios anteriores. Texto y grafía hablada en
  `make_vo.py` → `video/public/krk/vo/vo.json`. Revisión con Whisper (`tools/qa_vo.py`): J01 y J23 regeneradas; el resto, bien.
- Música: `tools/krk_music.py` (12 bloques, re menor, 86 BPM, tono nórdico/Copenhague). Efectos nuevos `kk_*` en `tools/sfx.py`.
- Sin retratos ni imágenes de terceros: cubiertas, mapas e ilustraciones propias. Las capturas de la ficha de SonorBooks llevan
  las cubiertas reales tapadas.
- Arranque en 3D (habitación de Copenhague con la carta y el anillo, biblioteca, recuento de obras, mapa) y el resto en 2D.

## Las cuatro puertas (datos de las fichas de SonorBooks, 19/10/2026)

| Puerta | Año · firma | En audio (español) | Narración que se nombra |
|---|---|---|---|
| Diario de un seductor (para empezar por una historia) | 1843 · Johannes el Seductor, dentro de *O lo uno o lo otro* (Victor Eremita) | 5 grabaciones: 3 h 18 min (adaptación, varias voces), 5 h 31 min, 5 h 59 min, 6 h 1 min, 6 h 59 min | Raúl Gutiérrez · 5 h 59 min · gratis en El Libro Total |
| Temor y temblor (la puerta clásica) | 1843 · Johannes de Silentio | 2 grabaciones: 4 h 55 min (Geraldo Medina) y 6 h 6 min (Remigia de la Rosa, 4,5 con 2 votos) | Ninguna: «escucha las muestras y elige» |
| La pureza de corazón es querer una sola cosa (algo espiritual) | 1847 · S. Kierkegaard (primera parte de *Discursos edificantes en diversos espíritus*) | 1 versión: Voz digital · 7 h 33 min · ElevenReader | Voz digital |
| La enfermedad mortal (ir al fondo) | 1849 · Anti-Climacus | Geraldo Medina · 5 h 18 min | Geraldo Medina |
| Si tienes poco tiempo | — | *Kierkegaard en 90 minutos* (Paul Strathern), Marco Lubián, 1 h 25 min · *100 citas de Søren Kierkegaard*, Benjamin Asnar, 32 min | — |

Sin audiolibro en español (bloque «Mejor en papel»): *O lo uno o lo otro* completo, *El concepto de la angustia*, *Las obras del
amor*, los diarios. Búsquedas hechas: kierkegaard, kierkegard, kierkegaar, kierkegård, søren, títulos sueltos (*La repetición*,
*Migajas filosóficas*, *Post scriptum*, *Estadios en el camino*, *In vino veritas*, *Mi punto de vista*, *El instante*…).

**Error de catálogo a corregir (Joan/Codex):** la ficha de *La pureza de corazón es querer una sola cosa* dice que se publicó el
13 de marzo de 1843; es 1847 (*Opbyggelige Taler i forskjellig Aand*, 13/3/1847).

## Guion final (texto exacto de la locución)

Cambios tras la pasada de exactitud (agente independiente, 19/10/2026): J08 «Llegó a creer…» y «con veintiún años» (a su
21.º cumpleaños solo habían muerto cuatro hermanos; la madre y Petrea murieron ese mismo año de edad); J02 «volvió sobre aquello
una y otra vez… muchas veces, con nombres falsos» (no «el resto de su vida»); J16 la frase del vértigo se atribuye al libro, no
a él (lo dice un seudónimo); J25 «probablemente su libro más conocido, y de los que más se recomiendan»; J13 «su último año»;
J10 «discursos edificantes» (no sermones); J35 «¿Culpable? ¿No culpable?» copia la nota palabra por palabra. La frase «la multitud es la
mentira» (J37) se quitó del montaje. El anillo de diamantes en forma de cruz no se usa (fuente única).

**Gancho y presentación**
- J01 Copenhague, agosto de 1841. Un joven de veintiocho años devuelve a su prometida el anillo de compromiso, con una nota: «Olvida a quien escribe esto».
- J02 Ella tenía diecinueve años y quedó desesperada. Él nunca explicó del todo por qué lo hizo. Pero volvió sobre aquello una y otra vez en sus libros… muchas veces, con nombres falsos.
- J03 Ese hombre era Søren Kierkegaard, el filósofo danés al que hoy se llama el padre del existencialismo.
- J04 Escribió sobre la angustia, la desesperación, la fe y cómo vivir tu propia vida. Pero tiene fama de difícil: firmaba con más de diez seudónimos. Así que la pregunta es: ¿por dónde empiezo?
- J05 Y en audio, otra sorpresa: publicó más de treinta obras, y en audiolibro en español solo hay cuatro. La buena noticia: son cuatro buenas puertas.
- J06 Así que aquí tienes un mapa: quién era, por cuál de las cuatro empezar, qué dejar para el papel y qué versión escuchar.
- *Cabecera: «Por dónde y cómo empezar a leer» → «Kierkegaard».*

**01 · Quién era**
- J07 Nació en Copenhague en 1813, el último de siete hermanos. Su padre era un comerciante muy rico, pero de niño había sido pastor en los páramos de Jutlandia, y allí, hambriento y agotado, un día maldijo a Dios.
- J08 Llegó a creer que lo pagarían sus hijos: que ninguno pasaría de los treinta y tres años, la edad de Cristo. Y con veintiún años, Søren ya había perdido a su madre y a cinco de sus hermanos.
- J09 A los veintidós escribió en su diario lo que buscaba: «Encontrar una verdad que sea verdad para mí, la idea por la que quiero vivir y morir».
- J10 Luego llegaron Regine y el anillo. Y justo después, en 1843, una explosión: O lo uno o lo otro, Temor y temblor, La repetición… cada uno firmado por un autor distinto. Y a la vez, con su propio nombre, discursos edificantes.
- J11 En 1846 se enfrentó a una revista satírica, El Corsario, que se burló de él durante meses: lo dibujaban con una pernera más corta que la otra, y por la calle le gritaban «¡O lo uno o lo otro!».
- J12 El día que cumplió treinta y cuatro escribió en su diario: «Qué extraño que haya cumplido treinta y cuatro años». La maldición no se había cumplido.
- J13 Su último año lo pasó atacando a la Iglesia oficial de Dinamarca. En octubre de 1855 se desplomó en la calle, y murió semanas después en el hospital. Tenía cuarenta y dos años.

**02 · Qué escribe**
- J14 No escribe como un filósofo de manual: escribe diarios, cartas, discursos y hasta el diario de un seductor. Y todo gira en torno a una pregunta: ¿cómo se vive una vida que sea de verdad tuya?
- J15 Para él hay tres maneras de vivir, como tres escalones. La estética: vivir para el placer y huir del aburrimiento. La ética: elegir, comprometerse y responder de ello. Y la religiosa: la fe, un salto que nadie puede dar por ti.
- J16 De ahí salen las palabras que hoy asociamos con él: la angustia, que El concepto de la angustia define como «el vértigo de la libertad», y la desesperación. Y una frase de su diario: la vida se entiende mirando hacia atrás, pero hay que vivirla hacia delante.
- J17 ¿Por qué sigue tan vivo? Kafka escribió que su caso era muy parecido al suyo, y que lo confirmaba como un amigo. Unamuno lo llamaba hermano. Y Wittgenstein dijo que era, con mucho, el pensador más profundo de su siglo.

**03 · Antes de elegir**
- J18 Antes de elegir, dos cosas. La primera: ¿quién habla? Cuando un libro lo firma Johannes de Silentio o Anti-Climacus, no es exactamente Kierkegaard: es un personaje con su propio punto de vista. Él mismo pidió que no le atribuyeran lo que decían.
- J19 La segunda: el ritmo. Sus libros en audio duran de cinco a siete horas y media, pero no se escuchan como una novela. Si sueles subir la velocidad, aquí bájala, y no tengas miedo de volver atrás.

**04 · Cuatro puertas de entrada**
- J20 Si quieres empezar por una historia: Diario de un seductor, de 1843.
- J21 Johannes planea conquistar a la joven Cordelia como quien juega una partida de ajedrez, y lo anota todo en su diario. Consigue que se comprometan… y luego hace que sea ella quien rompa. ¿Te suena?
- J22 Ojo: no es un manual de seducción. Es el retrato de la vida estética, el primer escalón, y cierra la primera parte de O lo uno o lo otro. Se escucha como una novela: unas seis horas, gratis en El Libro Total, con la voz de Raúl Gutiérrez.
- J23 Si quieres la puerta clásica: Temor y temblor, también de 1843.
- J24 Dios le pide a Abraham que sacrifique a su hijo Isaac, y Abraham se pone en camino. El autor, que firma Johannes de Silentio, cuenta la escena de cuatro maneras distintas, y no deja de preguntarse: ¿Abraham es un hombre de fe… o un asesino?
- J25 Es probablemente su libro más conocido, y de los que más se recomiendan para empezar. Dura de cinco a seis horas, y hay dos grabaciones: escucha las muestras y elige.
- J26 Si buscas algo espiritual: La pureza de corazón es querer una sola cosa, de 1847.
- J27 Aquí ya no hay seudónimo: lo firma él. Es un discurso para preparar la confesión, y la idea cabe en el título: querer el bien de verdad, y no por miedo al castigo ni por el premio.
- J28 En audio solo existe con voz digital: siete horas y media, en ElevenReader.
- J29 Y si quieres ir al fondo: La enfermedad mortal, de 1849.
- J30 La enfermedad mortal es la desesperación, y el libro la encuentra en todas partes, incluso en quien no sabe que la tiene. Las primeras páginas son famosas por lo difíciles: no te rindas ahí.
- J31 Lo firma Anti-Climacus, un seudónimo que, según él, estaba por encima de él mismo. Son unas cinco horas y cuarto, con la voz de Geraldo Medina.
- J32 ¿Poco tiempo? Kierkegaard en 90 minutos, de Paul Strathern: su vida y sus ideas en hora y media, con Marco Lubián. Y 100 citas de Søren Kierkegaard: media hora con sus frases.

**05 · Mejor en papel**
- J33 Y ahora, lo que todavía no tiene audiolibro en español: O lo uno o lo otro completo, El concepto de la angustia, Las obras del amor y sus diarios, miles de páginas.
- J34 Cuando hayas escuchado los cuatro, ese es el siguiente paso. Y mejor en papel, con tiempo y un lápiz.

**06 · Su vida, en sus libros (y el orden)**
- J35 Con Kierkegaard, la vida está dentro de los libros, aunque lleven otra firma. Regine está en Diario de un seductor, y en ¿Culpable? ¿No culpable?, que copia palabra por palabra la nota del anillo.
- J36 En 1843 escribió en su diario: «Si hubiera tenido fe, me habría quedado con Regine». Ese mismo año publicó Temor y temblor: un hombre que, gracias a la fe, recupera lo que estaba dispuesto a perder.
- J38 ¿Hay que leerlo en orden? No hace falta. Lo que ayuda es subir sus escalones, de la estética a la fe: primero Diario de un seductor, luego Temor y temblor y, al final, La enfermedad mortal.

**07 · Qué versión escuchar**
- J39 ¿Y qué versión escuchar? De Diario de un seductor hay en SonorBooks cinco grabaciones en español. Mira tres cosas.
- J40 Uno: que sea íntegra. La de tres horas es una adaptación con varias voces; el texto completo dura de cinco horas y media a siete.
- J41 Dos: ¿voz humana o digital? En SonorBooks, las voces sintéticas llevan la etiqueta «voz digital».
- J42 Y tres: la muestra. En filosofía, una voz que no te convence se hace muy larga: escucha siempre un minuto antes de empezar.
- J43 En SonorBooks tienes todas las versiones de cada libro, con su narrador, su duración y dónde escucharla. Te lo dejo en la descripción.

**08 · Tu ruta**
- J44 Resumiendo: tres rutas. Si te gustan las historias: Diario de un seductor y Temor y temblor.
- J45 Si buscas algo espiritual: La pureza de corazón y Temor y temblor.
- J46 Y si prefieres entenderlo antes de leerlo: Kierkegaard en 90 minutos y Temor y temblor. Al final de los tres caminos, La enfermedad mortal.
- J47 ¿Y tú? ¿Por cuál empezaste, o por cuál vas a empezar? Y si quieres otro autor en el próximo episodio, dímelo en los comentarios.
- J48 Tu próxima historia te está esperando.

## Notas visuales

- Gancho (3D): habitación de Copenhague de noche; la carta con «Olvida a quien escribe esto» y el anillo (una alianza lisa: la
  carta dice que devolvió «su anillo», sin más detalle); la carta se pliega, se lacra con «SK» y se envía; montones de manuscritos
  y libros con los seudónimos.
- Biblioteca 3D con las 35 obras publicadas en vida (1838–1855); recuento «En audiolibro en español: 4».
- Bio: mapa de Dinamarca propio, páramo de Jutlandia, ocho velas (la madre y los siete hijos; se apagan la madre y cinco
  hermanos), Gilleleje 1835, la explosión de 1843 con las firmas, El Corsario (caricatura propia con la pernera corta),
  «33 → 34», los nueve números de *El instante* que salieron en vida (el 10 es póstumo) y 1855.
- Los textos «a mano» usan Pinyon Script (OFL, en `video/public/fonts/`).
- Sin citas inventadas: la carta del anillo es fiel al original («Olvida a quien escribe esto; perdona a alguien que, aunque
  fuera capaz de algo, no fue capaz de hacer feliz a una muchacha»); el diario de Johannes y la página «Mejor en papel» llevan
  renglones ilegibles; el comienzo de la primera parte de *La enfermedad mortal* es traducción propia del danés («Mennesket er
  Aand…»); la frase de 1843 se presenta como «una idea de su diario» (es paráfrasis).
- Revisión independiente del texto en pantalla, la descripción y los subtítulos (19/10/2026): correcciones aplicadas (carta,
  diario de Johannes, *El instante*, rótulo de la primera parte, Regine 1840–1841, Hilarius Bogbinder, N.º, guiones, cortes
  de subtítulos).

## Datos y fuentes

- **Catálogo de SonorBooks España** (19/10/2026; extracción en `kierkegaard_fichas.json`): 23 fichas con «Kierkegaard» y sus
  variantes; 4 obras suyas con audiolibro en español (*Diario de un seductor*, *Temor y temblor*, *La pureza de corazón…*,
  *La enfermedad mortal*), más *Kierkegaard en 90 minutos*, *100 citas…*, un *Kierkegaard* de Mariano Fazio (voz digital) y
  recopilaciones de citas.
- **Verificado en la pasada de exactitud (19/10/2026)**: biografía (5/5/1813, el menor de siete, padre calcetero y mayorista
  rico, pastor en el páramo de Jutlandia que maldijo a Dios; la idea de que ningún hijo pasaría de los 34 —carta a Peter,
  19/5/1847—; muertes de hermanos y madre 1819–1834; Gilleleje 1/8/1835; compromiso con Regine Olsen (n. 23/1/1822) y
  devolución del anillo con la carta del 11/8/1841; 1843: *O lo uno o lo otro* (20/2, Victor Eremita), *Temor y temblor* y
  *La repetición* (16/10), discursos edificantes con su nombre; El Corsario 1846 y las perneras; «Qué extraño que haya cumplido
  34» (5/5/1847); *El instante* 1855; colapso el 2/10/1855 y muerte el 11/11/1855 en el Frederiks Hospital, con 42 años),
  tres estadios y el salto, «vértigo de la libertad» (*El concepto de la angustia*, Vigilius Haufniensis), «la vida se entiende
  hacia atrás… se vive hacia delante» (diario JJ:167, 1843), Kafka (diario, 21/8/1913), Unamuno (*Del sentimiento trágico de la
  vida*, cap. VI: «Oigamos al hermano Kierkegaard»), Wittgenstein (a Drury: «el pensador más profundo del siglo pasado»), la
  petición de no atribuirle lo que dicen los seudónimos («Una primera y última explicación», 1846), Anti-Climacus «más alto» que
  él (diario, 1849), «Si hubiera tenido fe, me habría quedado con Regine» (JJ:115, 17/5/1843).
- Fuentes principales:
  - Søren Kierkegaard Research Centre (Universidad de Copenhague): https://teol.ku.dk/skc/english/about-soeren-kierkegaard/the-global-dane-soeren-kierkegaard-teologian-philosopher-author/the-childhood (y las páginas theology-student, regine, the-corsair, sickness-and-death).
  - Søren Kierkegaards Skrifter (edición crítica): https://tekster.kb.dk/text/sks-b1-txt-shoot-n17.pdf · https://tekster.kb.dk/text/sks-b127-txr-shoot-id927e3618-da84-4afa-a747-eedea5b5b8ec.pdf · https://tekster.kb.dk/text/sks-slv-txr-shoot-id21d63adb-73fb-4101-979c-bf93e7d8ff83.pdf
  - Stanford Encyclopedia of Philosophy, «Søren Kierkegaard»: https://plato.stanford.edu/entries/kierkegaard/
  - Wikipedia: https://en.wikipedia.org/wiki/S%C3%B8ren_Kierkegaard · https://en.wikipedia.org/wiki/Regine_Olsen · https://en.wikipedia.org/wiki/Fear_and_Trembling · https://en.wikipedia.org/wiki/The_Sickness_unto_Death · https://en.wikipedia.org/wiki/Edifying_Discourses_in_Diverse_Spirits · https://en.wikipedia.org/wiki/Bibliography_of_S%C3%B8ren_Kierkegaard
  - https://lex.dk/Søren_Kierkegaard · https://sorenkierkegaard.org/kierkegaard-biography.html · https://www.uv.es/capelo/kierkegaard_biografia.html
  - NYRB, «On the Seducer's Diary» (1997): https://www.nybooks.com/articles/1997/05/29/on-the-seducers-diary/ · LA Review of Books: https://lareviewofbooks.org/article/keeper-loves-flame-regine-olsen-soren-kierkegaard/
  - Kafka: https://www.kafka-research.ox.ac.uk/node/3634751 · Unamuno: https://www.gutenberg.org/ebooks/59852 · Wittgenstein: https://ndpr.nd.edu/news/a-confusion-of-the-spheres-kierkegaard-and-wittgenstein-on-philosophy-and-religion/
  - Guías de lectura (para «de los que más se recomiendan para empezar»): https://www.philosophyprofessor.com/reading-guides/kierkegaard/ · https://philosophybreak.com/reading-lists/soren-kierkegaard-best-books/
