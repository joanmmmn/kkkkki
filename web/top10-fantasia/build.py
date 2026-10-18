#!/usr/bin/env python3
"""Página del blog «Los 10 mejores libros de fantasía: historias de las que no vas a querer salir» (acompaña al vídeo «Los 10 mejores · Fantasía»).

  dist/     → para producción: dist/es/blog/mejores-libros-de-fantasia/index.html y dist/assets/blog/top10-fantasia/{t10f.css, t10f.js, media/…}
  preview/  → vista previa privada (Artifact): una página con CSS y JS en línea, enlaces absolutos a sonorbooks.com.

Uso: python3 web/top10-fantasia/build.py [--yt ID_DE_YOUTUBE [--yt-fecha AAAA-MM-DD]]
La lista sale de los datos de abajo (los mismos del vídeo, video/src/scenes/t10f/kit.tsx, y de blog/top10/fantasia/mejores-libros-de-fantasia.md).
Los enlaces «Ver dónde escucharlo» van a las fichas de SonorBooks (enlaces internos; la afiliación, si la hay, está en la ficha).
Las portadas son las de las ediciones en audio recomendadas (Audible España; la de Miguel Ángel Jenner, de Storytel).
La carpeta site/ es la cabecera, el pie y los estilos del sitio, copiados de web/top10-terror/site."""
import hashlib, html, json, os, re, shutil, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
SRC, MEDIA, SITE = (os.path.join(HERE, d) for d in ('src', 'media', 'site'))
YT = sys.argv[sys.argv.index('--yt') + 1] if '--yt' in sys.argv else ''
YT_FECHA = sys.argv[sys.argv.index('--yt-fecha') + 1] if '--yt-fecha' in sys.argv else ''
YT_CANAL = 'https://www.youtube.com/@SonorBooksEspa%C3%B1a/videos'
if YT and not re.fullmatch(r'[\w-]{11}', YT):
    sys.exit(f'--yt: «{YT}» no parece un ID de YouTube')
SLUG = 'mejores-libros-de-fantasia'
URL = f'https://sonorbooks.com/es/blog/{SLUG}/'
PROD_A = '/assets/blog/top10-fantasia'
PUBLICADA = MODIFICADA = '2026-10-18'
H1 = 'Los 10 mejores libros de fantasía: historias de las que no vas a querer salir'
TITLE = 'Los 10 mejores libros de fantasía (y cómo escucharlos gratis)'
DESC = 'De Alicia a El Señor de los Anillos: diez historias de fantasía de las que no vas a querer salir y, de cada una, la mejor forma de escucharla en español, con su nota y dónde empezarla gratis.'
SITE_CSS = ''.join(f'<link rel="stylesheet" href="/assets/{p}">' for p in (
    'replica/fonts.css?v=a9ff3c59b4bb85da', 'styles.css?v=b61bbad688f89ade', 'chrome.css?v=6acbe5725e55051d',
    'cookie-notice.css?v=c1dcc91ebfae56e5', 'header-layout.css?v=f69c0a9cc1af53b3', 'theme.css?v=1f14b7c8389c04a1',
    'alignment.css?v=04565e52bd4e70a8'))
SITE_JS = ('<script type="module" src="/assets/chrome.mjs?v=467bec9dc6f34ed1"></script>'
           '<script type="module" src="/assets/cookie-notice.mjs?v=5563de9897e063db"></script>')

F = lambda slug: f'/es/audiolibro/{slug}/'
# Fichas de SonorBooks (FICHAS_PENDIENTES: las que no se pudieron comprobar el 18/10 llevan None y enlazan a la búsqueda del catálogo).
FICHAS = {10: None, 9: None, 8: None, 7: None, 6: None, 5: None, 4: None, 3: None, 2: None, 1: 'la-comunidad-del-anillo'}
BUSCA = {10: 'Alicia en el País de las Maravillas', 9: 'Circe', 8: 'Harry Potter y la piedra filosofal', 7: 'El Hobbit', 6: 'El nombre del viento',
         5: 'Olvidado rey Gudú', 4: 'Memorias de Idhún', 3: 'Alas de sangre', 2: 'El imperio final', 1: 'La Comunidad del Anillo'}
ficha = lambda n: F(FICHAS[n]) if FICHAS[n] else '/es/audiolibros/?q=' + BUSCA[n].replace(' ', '+')
# Datos comprobados el 18/10/2026 en Audible España (salvo indicación). basis: «narración» = nota de la interpretación; «audiolibro» = nota general.
BOOKS = [
    dict(n=10, t='Alicia en el País de las Maravillas', a='Lewis Carroll', y=1865, ac='#F2A9C9',
         p=['Una tarde de verano, Alicia ve pasar un conejo blanco con chaleco y reloj de bolsillo, lo sigue por una madriguera y cae a un mundo donde encoge y crece según lo que come, toma el té con un sombrerero loco y una reina no para de gritar: «¡Que le corten la cabeza!».',
            'Carroll se la inventó el 4 de julio de 1862, en una excursión en barca por el río Isis, para entretener a las tres hermanas Liddell. La pequeña Alice le pidió que se la escribiera; en 1865 ya era un libro.'],
         narr=[dict(who='Michelle Jenner', sub='Audible Studios · 2020', facts=['3 h 13 min', 'Castellano'], r='4,8', v='586', basis='narración', src='Audible', note='Los oyentes destacan que hasta canta las canciones.')],
         where=['Audible (exclusiva, en el Plus)']),
    dict(n=9, t='Circe', a='Madeline Miller', y=2018, ac='#E3A63B',
         p=['Hija del dios del Sol, Circe nace sin el poder de su padre ni la belleza de su madre, hasta que descubre la brujería. Los dioses la destierran a una isla, y allí, sola, se convierte en la hechicera que temen los marineros.',
            'Miller daba clases de latín y griego. En el canto X de la «Odisea», Circe es solo la bruja que convierte en cerdos a los hombres de Ulises; Miller le dejó contar su versión, y la novela llegó al número uno del New York Times.'],
         narr=[dict(who='Sonia Román', sub='BookaVivo · 2024', facts=['16 h 44 min', 'Castellano'], r='4,7', v='208', basis='narración', src='Audible', note='Serena y con un tono muy personal. En Storytel, 4,5 con 235 valoraciones.')],
         where=['Audible', 'Storytel', 'Nextory']),
    dict(n=8, t='Harry Potter y la piedra filosofal', a='J. K. Rowling', y=1997, ac='#E8B93E',
         p=['Harry vive en una alacena, bajo la escalera de sus tíos. El día que cumple once años, un gigante echa la puerta abajo y le dice que es un mago. Le espera un colegio en un castillo… y alguien que quiere robar una piedra capaz de dar la vida eterna.',
            'Lo rechazaron una docena de editoriales. Bloomsbury lo publicó después de que Alice, la hija de 8 años del fundador, Nigel Newton, leyera el primer capítulo y lo pusiera por las nubes.'],
         narr=[dict(who='Leonor Watling', sub='Pottermore Publishing · 2020', facts=['8 h 33 min', 'Castellano'], r='4,9', v='2.904', basis='audiolibro', src='Audible', note='La que más valoraciones tiene de toda la lista.')],
         where=['Audible (en el Plus)']),
    dict(n=7, t='El Hobbit', a='J. R. R. Tolkien', y=1937, ac='#9CC46A',
         p=['Bilbo Bolsón vive tranquilo en su agujero hobbit hasta que un mago y trece enanos se presentan en su casa para llevárselo a recuperar un tesoro. Un tesoro que ya tiene dueño: un dragón.',
            'Tolkien lo empezó casi por casualidad: corrigiendo exámenes, encontró una hoja en blanco y escribió «En un agujero en el suelo vivía un hobbit». Luego, como él mismo contó, tuvo que averiguar qué era un hobbit.'],
         narr=[dict(lab='Interpretada', who='Javier Gutiérrez', sub='Dos Goya al mejor actor · Audible Studios y Planeta Audio · 2023', facts=['10 h 40 min', 'Castellano'], r='4,8', v='535', basis='audiolibro', src='Audible', note='Una voz para cada personaje, enanos incluidos. A quien busca una lectura sobria le puede sobrar.'),
               dict(lab='Lectura clásica', who='Miguel Ángel Jenner', sub='Planeta Audio · 2023', facts=['11 h 58 min', 'Castellano'], r='4,7', v='160', basis='audiolibro', src='Storytel', note='En Storytel, Nextory y Podimo.')],
         where=['Audible (Gutiérrez)', 'Storytel', 'Nextory', 'Podimo']),
    dict(n=6, t='El nombre del viento', a='Patrick Rothfuss', y=2007, ac='#C9D86A',
         p=['En una posada perdida, un posadero pelirrojo sirve cerveza sin llamar la atención. Pero un cronista lo ha encontrado y sabe quién es en realidad: el héroe de mil leyendas. Durante tres días, le va a contar su verdadera historia.',
            'Rothfuss la empezó en la universidad y pasó años acumulando rechazos de agentes. Cuando por fin se publicó, en 2007, ganó el premio Quill; su segunda parte debutó en el número uno del New York Times.'],
         narr=[dict(who='Raúl Lloréns', sub='Penguin Random House · 2016', facts=['27 h 20 min', 'Castellano'], r='4,8', v='92', basis='audiolibro', src='Audible', note='Con calma de juglar. No entra en el Plus de Audible: se empieza gratis con el crédito de la prueba de Audiobooks.com.')],
         where=['Audible', 'Audiobooks.com']),
    dict(n=5, t='Olvidado rey Gudú', a='Ana María Matute', y=1996, ac='#E0A43E',
         p=['En el reino de Olar, levantado a base de conquistas y traiciones, nace un príncipe con una maldición: no puede amar. Su madre, la reina Ardid, lo prepara para ser el rey más grande, y bajo la tierra, en los lagos y en el mar, esperan trasgos, sirenas y piratas.',
            'Matute la empezó a finales de los sesenta y la abandonó durante una larga depresión. La publicó en 1996, veinticinco años después de su anterior novela: casi mil páginas de fantasía escrita en español. Catorce años más tarde ganó el Premio Cervantes.'],
         narr=[dict(who='Neus Sendra', sub='Planeta Audio · 2021', facts=['34 h 34 min', 'Castellano'], r='4,9', v='77', basis='narración', src='Audible')],
         where=['Audible', 'Storytel', 'Nextory', 'Podimo']),
    dict(n=4, t='Memorias de Idhún', a='Laura Gallego', y=2004, ac='#86BCF0',
         p=['Jack tiene trece años. Una noche vuelve a casa y encuentra a sus padres asesinados. El culpable es Kirtash, un asesino llegado de Idhún, un mundo con tres soles y tres lunas donde los dragones y los unicornios han sido exterminados. Para detenerlo, Jack se une a la Resistencia.',
            'La trilogía ha vendido más de un millón de ejemplares, y Netflix la convirtió en serie de animación en 2020.'],
         narr=[dict(lab='I · La Resistencia', who='Diez voces, una por personaje', sub='Saga Egmont · 2021', facts=['18 h 1 min', 'Castellano'], r='4,8', v='324', basis='narración', src='Audible', note='Hasta a quien no conecta con la historia le parece una de las mejores narraciones que ha escuchado.')],
         where=['Audible', 'Storytel', 'Nextory', 'Podimo']),
    dict(n=3, t='Alas de sangre', a='Rebecca Yarros', y=2023, ac='#E8A33C',
         p=['Violet iba a ser escriba. Pero su madre, la general, la obliga a entrar en el Colegio de Guerra de Basgiath, donde los cadetes se juegan la vida para que un dragón los elija y donde muchos la quieren muerta.',
            'Llegó al número uno del New York Times, fue el fenómeno del año en las redes, y Prime Video ya prepara la serie.'],
         narr=[dict(lab='Dramatizada · 2 partes', who='Más de 30 actores', sub='Con efectos de sonido · BookaVivo · 2026', facts=['17 h', 'Castellano'], r='4,8', v='305', basis='audiolibro', src='Audible', note='Ojo: no sigue la traducción publicada y algún nombre te sonará distinto.'),
               dict(lab='Íntegra', who='María Carolina Yarussi y Diego Longstaff', sub='BookaVivo · 2023', facts=['21 h 7 min', 'Voz latina'], r='4,6', v='1.427', basis='audiolibro', src='Audible')],
         where=['Audible', 'Storytel', 'Nextory (la íntegra)']),
    dict(n=2, t='El imperio final', a='Brandon Sanderson', y=2006, ac='#D7C9AE',
         p=['Hace mil años, el héroe que debía salvar el mundo fracasó. Desde entonces reina un dios inmortal, del cielo cae ceniza y, de noche, todo se cubre de niebla. Vin, una ladrona callejera, descubre que puede tragar metales y quemarlos para conseguir poderes, y una banda de ladrones la necesita para derribar al dios.',
            'En 2022, Sanderson pidió dinero en Kickstarter para publicar cuatro novelas secretas y reunió más de 41 millones de dólares. Durante tres años fue el proyecto más financiado de la historia de la plataforma.'],
         narr=[dict(who='Francesc Belda', sub='Penguin Random House · 2020', facts=['24 h 21 min', 'Castellano'], r='4,9', v='206', basis='audiolibro', src='Audible', note='Una voz distinta para cada personaje. No entra en el Plus de Audible: se empieza gratis con el crédito de la prueba de Audiobooks.com.')],
         where=['Audible', 'Audiobooks.com']),
    dict(n=1, t='El Señor de los Anillos', a='J. R. R. Tolkien', y='1954-1955', ac='#E9C46A',
         p=['Frodo hereda de su tío Bilbo un anillo de oro. Un mago le revela la verdad: es el Anillo Único, el arma del Señor Oscuro, y la única forma de destruirlo es llevarlo hasta el fuego donde se forjó, en el corazón de Mordor.',
            'Tolkien tardó doce años en escribirla, de 1937 a 1949, y la editorial la partió en tres tomos para abaratarla. Él siempre insistió en que no era una trilogía, sino una sola novela.'],
         narr=[dict(lab='Tres libros, casi 67 horas', who='Miguel Ángel Jenner y Nuria Mediavilla', sub='Planeta Audio · 2022-2023', facts=['La Comunidad del Anillo · 22 h 29 min', 'Las dos torres · 20 h 1 min', 'El retorno del rey · 24 h 28 min', 'Castellano'], r='4,9', v='1.382', basis='audiolibro', src='Audible (primer libro)', note='El viaje más largo de la lista… y del que menos vas a querer volver.')],
         where=['Audible', 'Storytel', 'Nextory', 'Podimo']),
]
for b in BOOKS:
    b['ficha'] = ficha(b['n'])
OFF = [('Una por autor', '«La canción de Aquiles» (Miller), «El camino de los reyes» y «Elantris» (Sanderson), «El Valle de los Lobos» (Gallego) y «El Silmarillion» (Tolkien ya está dos veces).'),
       ('Pocas valoraciones en España todavía', '«El color de la magia» (Pratchett), «El ladrón del rayo» (Riordan), «Piranesi» (Clarke), «Crepúsculo» (Meyer) y «La quinta estación» (Jemisin).'),
       ('Sin narración de España', '«Juego de tronos» solo existe en español con voz latina.'),
       ('Por la narración', '«Un mago de Terramar» (Le Guin) y «El príncipe cruel» (Holly Black): notas más bajas y quejas de los oyentes sobre la voz.')]

e = lambda s: html.escape(str(s), quote=True)


# Portadas reales de las ediciones en audio que recomendamos (Audible España), como en el vídeo.
COVER = {10: '10_alicia', 9: '09_circe', 8: '08_harry', 7: '07_hobbit', 6: '06_viento', 5: '05_gudu', 4: '04_idhun', 3: '03_alas', 2: '02_imperio', 1: '01_comunidad'}


def cover(b, small=False):
    alt = '' if small else f'Portada del audiolibro «{e(b["t"])}»'
    hidden = ' aria-hidden="true"' if small else ''
    load = 'eager' if small else 'lazy'  # las de la portada se ven al cargar
    return (f'<img class="t10-cover" src="{{{{A}}}}/media/cover-{COVER[b["n"]]}.webp" alt="{alt}" width="600" height="600" loading="{load}" decoding="async"{hidden}>')


def stars(r):
    v = float(r.replace(',', '.'))
    full = int(v + 0.25)
    return '★' * full + '☆' * (5 - full)


def item(b):
    narr = ''
    for nr in b['narr']:
        lab = f'<div class="lab">{e(nr["lab"])}</div>' if nr.get('lab') else '<div class="lab">La narración</div>'
        facts = ''.join(f'<span>{e(f)}</span>' for f in nr['facts'])
        base = 'valoraciones de la narración' if nr['basis'] == 'narración' else 'valoraciones del audiolibro'
        facts += f'<span><span class="stars" aria-hidden="true">{stars(nr["r"])}</span>{e(nr["r"])} · {e(nr["v"])} {base} · {e(nr["src"])}</span>'
        note = f'<div class="note">{e(nr["note"])}</div>' if nr.get('note') else ''
        narr += (f'<div class="t10-narr" style="--ac:{b["ac"]}">{lab}<div class="who"><svg aria-hidden="true"><use href="#i-mic"/></svg>{e(nr["who"])}</div>'
                 f'<div class="sub">{e(nr["sub"])}</div><div class="t10-facts">{facts}</div>{note}</div>')
    where = ''.join(f'<span class="p">{e(w)}</span>' for w in b['where'])
    by = e(b['a']) + (f' · {b["y"]}' if b['y'] else '')
    paras = ''.join(f'<p>{e(x)}</p>' for x in b['p'])
    one = ' is-one' if b['n'] == 1 else ''
    return (f'<section class="t10-item{one}" id="n{b["n"]}" aria-labelledby="h{b["n"]}"><div class="side"><span class="t10-num">{b["n"]}</span>{cover(b)}</div>'
            f'<div><h2 id="h{b["n"]}">«{e(b["t"])}»</h2><div class="by">{by}</div>{paras}{narr}'
            f'<div class="t10-where"><b>Dónde:</b>{where}</div>'
            f'<a class="t10-btn" href="{b["ficha"]}">Ver dónde escucharlo<svg aria-hidden="true"><use href="#i-arrow"/></svg></a></div></section>')


def page_html():
    tpl = open(os.path.join(SRC, 'page.html'), encoding='utf-8').read()
    shelf = ''.join(f'<a href="#n{b["n"]}" aria-label="Número {b["n"]}: {e(b["t"])}">{cover(b, small=True)}<span class="t10-n">{b["n"]}</span></a>' for b in BOOKS)
    off = ''.join(f'<li><b>{e(t)}.</b><small>{e(a)}</small></li>' for t, a in OFF)
    return (tpl.replace('<!--SHELF-->', shelf).replace('<!--LIST-->', ''.join(item(b) for b in BOOKS)).replace('<!--OFF-->', off))


def jsonld():
    graph = [
        {'@type': 'Article', '@id': URL + '#article', 'url': URL, 'headline': H1, 'description': DESC,
         'image': 'https://sonorbooks.com' + PROD_A + '/media/top10-fantasia-og.jpg', 'inLanguage': 'es-ES', 'datePublished': PUBLICADA, 'dateModified': MODIFICADA,
         'author': {'@type': 'Organization', 'name': 'Equipo editorial SonorBooks', 'url': 'https://sonorbooks.com/es/blog/criterios-editoriales/'},
         'publisher': {'@type': 'Organization', 'name': 'SonorBooks', 'url': 'https://sonorbooks.com/es/'}},
        {'@type': 'ItemList', 'name': H1, 'itemListOrder': 'https://schema.org/ItemListOrderDescending', 'numberOfItems': 10,
         'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'url': 'https://sonorbooks.com' + b['ficha'],
                              'item': {'@type': 'Book', 'name': b['t'], 'author': {'@type': 'Person', 'name': b['a']}}} for i, b in enumerate(BOOKS)]},
        {'@type': 'BreadcrumbList', 'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': 'https://sonorbooks.com/es/'},
            {'@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': 'https://sonorbooks.com/es/blog/'},
            {'@type': 'ListItem', 'position': 3, 'name': 'Los 10 mejores libros de fantasía', 'item': URL}]},
    ]
    if YT:
        import datetime
        from zoneinfo import ZoneInfo
        dia = datetime.date.fromisoformat(YT_FECHA) if YT_FECHA else datetime.date.today()
        sys.path.insert(0, os.path.join(ROOT, 'tools'))
        from t10f_timeline import parse, FPS
        _, total = parse()
        seg = round(total / FPS)
        graph.append({'@type': 'VideoObject', '@id': URL + '#video', 'name': '10 historias de fantasía de las que no vas a querer salir',
                      'description': 'Las 10 mejores historias de fantasía, de la más ligera a la más épica, y cómo escucharlas gratis.',
                      'thumbnailUrl': [f'https://i.ytimg.com/vi/{YT}/maxresdefault.jpg', 'https://sonorbooks.com' + PROD_A + '/media/top10-fantasia-og.jpg'],
                      'uploadDate': datetime.datetime(dia.year, dia.month, dia.day, 12, tzinfo=ZoneInfo('Europe/Madrid')).isoformat(),
                      'duration': f'PT{seg // 60}M{seg % 60}S', 'inLanguage': 'es-ES', 'embedUrl': f'https://www.youtube.com/embed/{YT}',
                      'publisher': {'@type': 'Organization', 'name': 'SonorBooks', 'url': 'https://sonorbooks.com/es/'}})
    return '<script type="application/ld+json">' + json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False) + '</script>'


def media():
    """Imagen para redes (1200×630) y póster del vídeo, a partir de og-source.png, y las portadas (600 px, WebP).
    og-source.png y poster-source.png se dibujan aparte con og/render.sh (Playwright): portadas reales en abanico, con los colores de la página."""
    os.makedirs(MEDIA, exist_ok=True)
    for name in COVER.values():
        src = os.path.join(ROOT, 'video/public/t10f/covers', f'{name}.jpg')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-vf', 'scale=600:600:flags=lanczos', '-c:v', 'libwebp', '-quality', '84', os.path.join(MEDIA, f'cover-{name}.webp')], check=True)
    og = os.path.join(HERE, 'og-source.png')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', og, '-vf', 'scale=1200:630:flags=lanczos', '-q:v', '3', os.path.join(MEDIA, 'top10-fantasia-og.jpg')], check=True)
    # Póster del vídeo: la miniatura A cuando exista; mientras tanto, el abanico de portadas sin texto (poster-source.png).
    poster = os.path.join(ROOT, 'deliverables/top10/fantasia/miniatura_A.png')
    if not os.path.exists(poster):
        poster = os.path.join(HERE, 'poster-source.png')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', poster, '-vf', 'scale=1280:720:flags=lanczos', '-c:v', 'libwebp', '-quality', '82', os.path.join(MEDIA, 'top10-fantasia-video.webp')], check=True)


def build_prod(page):
    css, js = (open(os.path.join(SRC, f), encoding='utf-8').read() for f in ('t10f.css', 't10f.js'))
    v = hashlib.sha1((css + js).encode()).hexdigest()[:12]
    if YT:
        page = page.replace(f'href="{YT_CANAL}"', f'href="https://www.youtube.com/watch?v={YT}"', 1)
    routing = open(os.path.join(SITE, 'provider-routing-data.json'), encoding='utf-8').read().strip()
    page = (page.replace('<!--SITE_CSS-->', SITE_CSS + '<style>' + open(os.path.join(SITE, 'chrome_inline.css'), encoding='utf-8').read().strip() + '</style>')
            .replace('<!--SITE_JS-->', SITE_JS).replace('<!--JSONLD-->', jsonld() + f'<script id="provider-routing-data" type="application/json">{routing}</script>')
            .replace('<!--HEADER-->', open(os.path.join(SITE, 'header.html'), encoding='utf-8').read())
            .replace('<!--FOOTER-->', open(os.path.join(SITE, 'footer.html'), encoding='utf-8').read() + open(os.path.join(SITE, 'cookie.html'), encoding='utf-8').read())
            .replace('{{A}}', PROD_A).replace('{{V}}', v).replace('{{YT_ID}}', YT).replace('{{PUBLICADA}}', PUBLICADA).replace('{{MODIFICADA}}', MODIFICADA)
            .replace('{{TITLE}}', e(TITLE)).replace('{{DESC}}', e(DESC)).replace('{{URL}}', URL))
    assert '{{' not in page, 'quedan marcadores sin sustituir'
    out = os.path.join(HERE, 'dist')
    shutil.rmtree(out, ignore_errors=True)
    pdir = os.path.join(out, 'es', 'blog', SLUG); adir = os.path.join(out, PROD_A.strip('/'))
    os.makedirs(pdir); os.makedirs(os.path.join(adir, 'media'))
    open(os.path.join(pdir, 'index.html'), 'w', encoding='utf-8').write(page)
    open(os.path.join(adir, 't10f.css'), 'w', encoding='utf-8').write(css)
    open(os.path.join(adir, 't10f.js'), 'w', encoding='utf-8').write(js)
    for f in os.listdir(MEDIA):
        shutil.copy(os.path.join(MEDIA, f), os.path.join(adir, 'media', f))
    print('producción →', os.path.relpath(out, ROOT), f'(v={v})')


def build_preview(page):
    body = page.split('<body class="inner-page t10-page">', 1)[1].rsplit('</body>', 1)[0]
    header = re.sub(r'<details class="sb-search">.*?</details>', '', open(os.path.join(SITE, 'header.html'), encoding='utf-8').read(), flags=re.S)
    body = (body.replace('<!--HEADER-->', header).replace('<!--FOOTER-->', open(os.path.join(SITE, 'footer.html'), encoding='utf-8').read())
            .replace('{{A}}', '.').replace('{{YT_ID}}', ''))
    body = body.replace('src="/assets/brand/', 'src="./site/')
    body = re.sub(r'href="/(?!/)', 'href="https://sonorbooks.com/', body)
    css = ''.join(open(os.path.join(SITE, f), encoding='utf-8').read() for f in ('chrome.css', 'header-layout.css', 'chrome_inline.css'))
    css += ('\nhtml{scroll-behavior:smooth}body{margin:0;background:#fff;color:#101010;font-family:"Merriweather",Georgia,serif}'
            'body .sb-footer{margin-top:0}.sb-menu,.sb-account{font-family:"Ubuntu",Arial,sans-serif}'
            '.sb-account{align-self:center}.sb-account a{display:inline-flex;align-items:center}.sb-account .sb-register{height:42px}'
            '@media(max-width:1099px){.sb-toggle{margin-left:auto}}\n')
    css += open(os.path.join(SRC, 't10f.css'), encoding='utf-8').read()
    head = ('<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>Los 10 de fantasía</title>\n'
            '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
            '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&family=Ubuntu:wght@400;500;700&display=swap">\n'
            f'<style>{css}</style>\n')
    js = open(os.path.join(SRC, 't10f.js'), encoding='utf-8').read()
    out = os.path.join(HERE, 'preview')
    shutil.rmtree(out, ignore_errors=True)
    os.makedirs(os.path.join(out, 'media')); os.makedirs(os.path.join(out, 'site'))
    open(os.path.join(out, 'index.html'), 'w', encoding='utf-8').write(head + body + f'<script type="module">{js}</script>\n')
    for f in os.listdir(MEDIA):
        shutil.copy(os.path.join(MEDIA, f), os.path.join(out, 'media', f))
    for f in os.listdir(SITE):
        if f.endswith(('.png', '.webp')):
            shutil.copy(os.path.join(SITE, f), os.path.join(out, 'site', f))
    print('vista previa →', os.path.relpath(out, ROOT))


if __name__ == '__main__':
    media()
    p = page_html()
    build_prod(p)
    build_preview(p)
    if not YT:
        print('aviso: sin --yt, el vídeo enlaza al canal; al publicar: --yt ID --yt-fecha AAAA-MM-DD')
