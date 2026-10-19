#!/usr/bin/env python3
"""Genera video/public/krk/vo/vo.json a partir del guion (texto en pantalla/subtítulos + `say` para la voz)."""
import json, re, os
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', '..', '..', 'video', 'public', 'krk', 'vo', 'vo.json')
S = [
 ('J01', 'Copenhague, agosto de 1841. Un joven de veintiocho años devuelve a su prometida el anillo de compromiso, con una nota: «Olvida a quien escribe esto».'),
 ('J02', 'Ella tenía diecinueve años y quedó desesperada. Él nunca explicó del todo por qué lo hizo. Pero volvió sobre aquello una y otra vez en sus libros… muchas veces, con nombres falsos.'),
 ('J03', 'Ese hombre era Søren Kierkegaard, el filósofo danés al que hoy se llama el padre del existencialismo.'),
 ('J04', 'Escribió sobre la angustia, la desesperación, la fe y cómo vivir tu propia vida. Pero tiene fama de difícil: firmaba con más de diez seudónimos. Así que la pregunta es: ¿por dónde empiezo?'),
 ('J05', 'Y en audio, otra sorpresa: publicó más de treinta obras, y en audiolibro en español solo hay cuatro. La buena noticia: son cuatro buenas puertas.'),
 ('J06', 'Así que aquí tienes un mapa: quién era, por cuál de las cuatro empezar, qué dejar para el papel y qué versión escuchar.'),
 ('J07', 'Nació en Copenhague en 1813, el último de siete hermanos. Su padre era un comerciante muy rico, pero de niño había sido pastor en los páramos de Jutlandia, y allí, hambriento y agotado, un día maldijo a Dios.'),
 ('J08', 'Llegó a creer que lo pagarían sus hijos: que ninguno pasaría de los treinta y tres años, la edad de Cristo. Y con veintiún años, Søren ya había perdido a su madre y a cinco de sus hermanos.'),
 ('J09', 'A los veintidós escribió en su diario lo que buscaba: «Encontrar una verdad que sea verdad para mí, la idea por la que quiero vivir y morir».'),
 ('J10', 'Luego llegaron Regine y el anillo. Y justo después, en 1843, una explosión: O lo uno o lo otro, Temor y temblor, La repetición… cada uno firmado por un autor distinto. Y a la vez, con su propio nombre, discursos edificantes.'),
 ('J11', 'En 1846 se enfrentó a una revista satírica, El Corsario, que se burló de él durante meses: lo dibujaban con una pernera más corta que la otra, y por la calle le gritaban «¡O lo uno o lo otro!».'),
 ('J12', 'El día que cumplió treinta y cuatro escribió en su diario: «Qué extraño que haya cumplido treinta y cuatro años». La maldición no se había cumplido.'),
 ('J13', 'Su último año lo pasó atacando a la Iglesia oficial de Dinamarca. En octubre de 1855 se desplomó en la calle, y murió semanas después en el hospital. Tenía cuarenta y dos años.'),
 ('J14', 'No escribe como un filósofo de manual: escribe diarios, cartas, discursos y hasta el diario de un seductor. Y todo gira en torno a una pregunta: ¿cómo se vive una vida que sea de verdad tuya?'),
 ('J15', 'Para él hay tres maneras de vivir, como tres escalones. La estética: vivir para el placer y huir del aburrimiento. La ética: elegir, comprometerse y responder de ello. Y la religiosa: la fe, un salto que nadie puede dar por ti.'),
 ('J16', 'De ahí salen las palabras que hoy asociamos con él: la angustia, que El concepto de la angustia define como «el vértigo de la libertad», y la desesperación. Y una frase de su diario: la vida se entiende mirando hacia atrás, pero hay que vivirla hacia delante.'),
 ('J17', '¿Por qué sigue tan vivo? Kafka escribió que su caso era muy parecido al suyo, y que lo confirmaba como un amigo. Unamuno lo llamaba hermano. Y Wittgenstein dijo que era, con mucho, el pensador más profundo de su siglo.'),
 ('J18', 'Antes de elegir, dos cosas. La primera: ¿quién habla? Cuando un libro lo firma Johannes de Silentio o Anti-Climacus, no es exactamente Kierkegaard: es un personaje con su propio punto de vista. Él mismo pidió que no le atribuyeran lo que decían.'),
 ('J19', 'La segunda: el ritmo. Sus libros en audio duran de cinco a siete horas y media, pero no se escuchan como una novela. Si sueles subir la velocidad, aquí bájala, y no tengas miedo de volver atrás.'),
 ('J20', 'Si quieres empezar por una historia: Diario de un seductor, de 1843.'),
 ('J21', 'Johannes planea conquistar a la joven Cordelia como quien juega una partida de ajedrez, y lo anota todo en su diario. Consigue que se comprometan… y luego hace que sea ella quien rompa. ¿Te suena?'),
 ('J22', 'Ojo: no es un manual de seducción. Es el retrato de la vida estética, el primer escalón, y cierra la primera parte de O lo uno o lo otro. Se escucha como una novela: unas seis horas, gratis en El Libro Total, con la voz de Raúl Gutiérrez.'),
 ('J23', 'Si quieres la puerta clásica: Temor y temblor, también de 1843.'),
 ('J24', 'Dios le pide a Abraham que sacrifique a su hijo Isaac, y Abraham se pone en camino. El autor, que firma Johannes de Silentio, cuenta la escena de cuatro maneras distintas, y no deja de preguntarse: ¿Abraham es un hombre de fe… o un asesino?'),
 ('J25', 'Es probablemente su libro más conocido, y de los que más se recomiendan para empezar. Dura de cinco a seis horas, y hay dos grabaciones: escucha las muestras y elige.'),
 ('J26', 'Si buscas algo espiritual: La pureza de corazón es querer una sola cosa, de 1847.'),
 ('J27', 'Aquí ya no hay seudónimo: lo firma él. Es un discurso para preparar la confesión, y la idea cabe en el título: querer el bien de verdad, y no por miedo al castigo ni por el premio.'),
 ('J28', 'En audio solo existe con voz digital: siete horas y media, en ElevenReader.'),
 ('J29', 'Y si quieres ir al fondo: La enfermedad mortal, de 1849.'),
 ('J30', 'La enfermedad mortal es la desesperación, y el libro la encuentra en todas partes, incluso en quien no sabe que la tiene. Las primeras páginas son famosas por lo difíciles: no te rindas ahí.'),
 ('J31', 'Lo firma Anti-Climacus, un seudónimo que, según él, estaba por encima de él mismo. Son unas cinco horas y cuarto, con la voz de Geraldo Medina.'),
 ('J32', '¿Poco tiempo? Kierkegaard en 90 minutos, de Paul Strathern: su vida y sus ideas en hora y media, con Marco Lubián. Y 100 citas de Søren Kierkegaard: media hora con sus frases.'),
 ('J33', 'Y ahora, lo que todavía no tiene audiolibro en español: O lo uno o lo otro completo, El concepto de la angustia, Las obras del amor y sus diarios, miles de páginas.'),
 ('J34', 'Cuando hayas escuchado los cuatro, ese es el siguiente paso. Y mejor en papel, con tiempo y un lápiz.'),
 ('J35', 'Con Kierkegaard, la vida está dentro de los libros, aunque lleven otra firma. Regine está en Diario de un seductor, y en ¿Culpable? ¿No culpable?, que copia palabra por palabra la nota del anillo.'),
 ('J36', 'En 1843 escribió en su diario: «Si hubiera tenido fe, me habría quedado con Regine». Ese mismo año publicó Temor y temblor: un hombre que, gracias a la fe, recupera lo que estaba dispuesto a perder.'),
 ('J38', '¿Hay que leerlo en orden? No hace falta. Lo que ayuda es subir sus escalones, de la estética a la fe: primero Diario de un seductor, luego Temor y temblor y, al final, La enfermedad mortal.'),
 ('J39', '¿Y qué versión escuchar? De Diario de un seductor hay en SonorBooks cinco grabaciones en español. Mira tres cosas.'),
 ('J40', 'Uno: que sea íntegra. La de tres horas es una adaptación con varias voces; el texto completo dura de cinco horas y media a siete.'),
 ('J41', 'Dos: ¿voz humana o digital? En SonorBooks, las voces sintéticas llevan la etiqueta «voz digital».'),
 ('J42', 'Y tres: la muestra. En filosofía, una voz que no te convence se hace muy larga: escucha siempre un minuto antes de empezar.'),
 ('J43', 'En SonorBooks tienes todas las versiones de cada libro, con su narrador, su duración y dónde escucharla. Te lo dejo en la descripción.'),
 ('J44', 'Resumiendo: tres rutas. Si te gustan las historias: Diario de un seductor y Temor y temblor.'),
 ('J45', 'Si buscas algo espiritual: La pureza de corazón y Temor y temblor.'),
 ('J46', 'Y si prefieres entenderlo antes de leerlo: Kierkegaard en 90 minutos y Temor y temblor. Al final de los tres caminos, La enfermedad mortal.'),
 ('J47', '¿Y tú? ¿Por cuál empezaste, o por cuál vas a empezar? Y si quieres otro autor en el próximo episodio, dímelo en los comentarios.'),
 ('J48', 'Tu próxima historia te está esperando.'),
]
YEARS = {'1813': 'mil ochocientos trece', '1841': 'mil ochocientos cuarenta y uno', '1843': 'mil ochocientos cuarenta y tres',
         '1846': 'mil ochocientos cuarenta y seis', '1847': 'mil ochocientos cuarenta y siete', '1849': 'mil ochocientos cuarenta y nueve',
         '1855': 'mil ochocientos cincuenta y cinco'}
NAMES = [('Søren Kierkegaard', 'Sóren Kírkegor'), ('Kierkegaard', 'Kírkegor'), ('Søren', 'Sóren'), ('Regine', 'Reguíne'),
         ('Johannes', 'Yojánes'), ('Anti-Climacus', 'Anticlímacus'), ('Wittgenstein', 'Víttguenstain'), ('Paul Strathern', 'Pol Strázern'),
         ('SonorBooks', 'Sónorbuks'), ('ElevenReader', 'Iléven Ríder'), ('90 minutos', 'noventa minutos'), ('100 citas', 'cien citas'),
         ('Cordelia', 'Cordelia'), ('Jutlandia', 'Jutlandia')]
def say(t):
    s = t
    for y, w in YEARS.items(): s = s.replace(y, w)
    for a, b in NAMES: s = s.replace(a, b)
    s = s.replace('«', '').replace('»', '')
    return s
scenes = []
for i, t in S:
    sc = {'id': i, 'text': t}
    sp = say(t)
    if sp != t: sc['say'] = sp
    scenes.append(sc)
cfg = {'voice_id': 'D7dkYvH17OKLgp4SLulf', 'model_id': 'eleven_v4', 'language_code': 'es', 'output_format': 'mp3_44100_128',
       'voice_settings': {'stability': 0.3, 'similarity_boost': 0.75, 'style': 0.0, 'use_speaker_boost': True, 'speed': 1.13}, 'scenes': scenes}
json.dump(cfg, open(OUT, 'w'), ensure_ascii=False, indent=1)
print(len(scenes), 'escenas;', sum(len(t) for _, t in S), 'caracteres')
