#!/usr/bin/env python3
"""Página del blog «Los 10 libros de terror que dan miedo de verdad» (acompaña al vídeo «Los 10 mejores · Terror»).

  dist/     → para producción: dist/es/blog/libros-de-terror-que-dan-miedo/index.html y dist/assets/blog/top10-terror/{t10.css, t10.js, media/…}
  preview/  → vista previa privada (Artifact): una página con CSS y JS en línea, enlaces absolutos a sonorbooks.com.

Uso: python3 web/top10-terror/build.py [--yt ID_DE_YOUTUBE [--yt-fecha AAAA-MM-DD]]
La lista sale de los datos de abajo (los mismos del vídeo y de blog/top10/terror/libros-de-terror-que-dan-miedo.md).
Los enlaces «Ver dónde escucharlo» van a las fichas de SonorBooks (enlaces internos; la afiliación, si la hay, está en la ficha).
La carpeta site/ es la cabecera, el pie y los estilos del sitio, copiados de web/storytel-resena/site."""
import hashlib, html, json, os, re, shutil, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
SRC, MEDIA, SITE = (os.path.join(HERE, d) for d in ('src', 'media', 'site'))
YT = sys.argv[sys.argv.index('--yt') + 1] if '--yt' in sys.argv else ''
YT_FECHA = sys.argv[sys.argv.index('--yt-fecha') + 1] if '--yt-fecha' in sys.argv else ''
YT_CANAL = 'https://www.youtube.com/@SonorBooksEspa%C3%B1a/videos'
if YT and not re.fullmatch(r'[\w-]{11}', YT):
    sys.exit(f'--yt: «{YT}» no parece un ID de YouTube')
SLUG = 'libros-de-terror-que-dan-miedo'
URL = f'https://sonorbooks.com/es/blog/{SLUG}/'
PROD_A = '/assets/blog/top10-terror'
PUBLICADA = MODIFICADA = '2026-10-14'
TITLE = '10 libros de terror que dan miedo de verdad, en audiolibro'
DESC = 'Diez libros de terror que quitan el sueño y, de cada uno, la narración en español que hay que escuchar: narrador, duración, voz, nota de los oyentes y dónde está.'
SITE_CSS = ''.join(f'<link rel="stylesheet" href="/assets/{p}">' for p in (
    'replica/fonts.css?v=a9ff3c59b4bb85da', 'styles.css?v=b61bbad688f89ade', 'chrome.css?v=6acbe5725e55051d',
    'cookie-notice.css?v=c1dcc91ebfae56e5', 'header-layout.css?v=f69c0a9cc1af53b3', 'theme.css?v=1f14b7c8389c04a1',
    'alignment.css?v=04565e52bd4e70a8'))
SITE_JS = ('<script type="module" src="/assets/chrome.mjs?v=467bec9dc6f34ed1"></script>'
           '<script type="module" src="/assets/cookie-notice.mjs?v=5563de9897e063db"></script>')

# Iconos de las cubiertas (trazo, 24×24): los mismos dibujos del vídeo.
ICONS = {
    'tentacle': '<path d="M12 21c-.5-4 2.5-5.5 2-9-.4-2.6-3-3.2-3-5.5 0-1.6 1.4-2.5 2.8-2"/><path d="M6.5 21c.8-3 3-3.6 2.6-6.2-.3-1.8-2.2-2.4-2-4.3"/><path d="M17.6 21c-.6-2.6.9-3.6.6-5.6-.2-1.3-1.4-1.8-1.3-3.1"/><path d="M3 21h18" stroke-width=".9"/>',
    'heart': '<path d="M12 19.5s-7-4.3-7-9.4A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.1c0 5.1-7 9.4-7 9.4z"/><path d="M3 22h18M5 22v-1.4M9 22v-1.4M13 22v-1.4M17 22v-1.4" stroke-width=".8"/>',
    'puppet': '<path d="M6 2.5h12M8.5 2.5v5M15.5 2.5v4M12 2.5v3.5" stroke-width=".8"/><circle cx="12" cy="9" r="3"/><path d="M9 12.8 6.5 16M15 12.8l2.8 2.2M12 12v6M12 18l-2 3.5M12 18l2 3.5"/>',
    'field': '<path d="M2.5 20.5 10 9.5M21.5 20.5 14 9.5M7 20.5l4-11M17 20.5l-4-11M12 20.5v-11" stroke-width=".9"/><path d="M2.5 9.5h19"/><path d="M6 6.2c1.5-.8 3-.8 4.5 0s3 .8 4.5 0 3-.8 4 0" stroke-width="1"/>',
    'bat': '<path d="M12 9.5c-1 0-1.5-1-1.5-1L9.8 10C7 8 3.5 9 2 11.5c2 0 3 1 3.5 2.5 1-1 2.5-1 3.5 0 .8-.8 2-1 3 0 1-1 2.2-.8 3 0 1-1 2.5-1 3.5 0 .5-1.5 1.5-2.5 3.5-2.5C20.5 9 17 8 14.2 10l-.7-1.5S13 9.5 12 9.5z"/>',
    'virus': '<circle cx="12" cy="12" r="5"/><path d="M12 7V4M12 17v3M7 12H4M17 12h3M8.5 8.5 6.4 6.4M15.5 15.5l2.1 2.1M15.5 8.5l2.1-2.1M8.5 15.5l-2.1 2.1"/>',
    'wardrobe': '<rect x="5" y="3" width="14" height="17" rx="1"/><path d="M12 3v17M5 20.5 4.5 22M19 20.5l.5 1.5M10.6 11v2M13.4 11v2"/>',
    'house': '<path d="M2.5 21.5c4-3.2 15-3.2 19 0" stroke-width="1"/><path d="M7 18.6V10l5-4.5 5 4.5v8.4"/><path d="M5.5 11.2 12 5.3l6.5 5.9"/><rect x="10.8" y="11.2" width="2.4" height="2.6" fill="currentColor" stroke="none"/>',
    'eye': '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>',
    'cross': '<path d="M12 3v18M7.5 8h9" stroke-width="1.6"/><path d="M4 21h16" stroke-width=".9"/>',
}
F = lambda slug: f'/es/audiolibro/{slug}/'
# Datos comprobados el 14/10/2026 (notas de la narración en Audible España salvo indicación).
BOOKS = [
    dict(n=10, t='La llamada de Cthulhu', a='H. P. Lovecraft', y=1928, bg='#0E2A2C', fg='#E6F0EC', ac='#63D2B4', i='tentacle', ficha=F('la-llamada-de-cthulhu-0226b70624'),
         p=['Un hombre ordena los papeles de su tío abuelo, un profesor recién muerto, y encuentra un bajorrelieve de arcilla, informes sobre cultos en distintos rincones del mundo y un nombre casi impronunciable.',
            'Lovecraft escribió que la emoción más antigua de la humanidad es el miedo, y el miedo más antiguo, el miedo a lo desconocido: este relato lo demuestra.'],
         narr=[dict(who='Benjamín Figueres', sub='Saga Egmont · 2022', facts=['2 h', 'Castellano'], r='4,5', v='55', src='Audible', note='Incluye también el relato «Nyarlathotep».')],
         where=['Audible', 'Storytel', 'Nextory', 'Podimo', 'BookBeat']),
    dict(n=9, t='Cuentos extraordinarios', a='Edgar Allan Poe', y=None, bg='#171615', fg='#F2EEE6', ac='#D2283A', i='heart', ficha=F('cuentos-extraordinarios-85f3e5a6d0'),
         p=['Un hombre jura que no está loco mientras cuenta cómo mató a un anciano y sigue oyendo su corazón bajo el suelo («El corazón delator», 1843). Una mujer enterrada en vida («La caída de la casa Usher», 1839). Un gato negro que no se marcha («El gato negro», 1843).',
            'Casi doscientos años después, siguen funcionando. Y son cortos: uno cada noche.'],
         narr=[dict(lab='La recopilación · 37 relatos', who='Jordi Boixaderas', sub='Audible Studios · 2022', facts=['21 h 13 min', 'Castellano'], r='4,6', v='38', src='Audible'),
               dict(lab='Para probar · dramatizado', who='«El corazón delator»', sub='Pablo López · Saga Egmont', facts=['15 min', 'Castellano'], r='5,0', v='25', src='Audible', note='También en Storytel.')],
         where=['Audible', 'Storytel (el dramatizado)']),
    dict(n=8, t='Cómo vender una casa encantada', a='Grady Hendrix', y=2023, bg='#EFE0C2', fg='#2A1A12', ac='#B5452B', i='puppet', ficha=F('como-vender-una-casa-encantada'),
         p=['Los padres de Louise acaban de morir y ella vuelve a la casa familiar para venderla junto a su hermano. El problema no son los recuerdos: son los títeres, las muñecas y un títere en concreto.',
            'The New York Times tituló su crítica así: «Un títere que es, de verdad, material de pesadillas».'],
         narr=[dict(who='Esther Cordero', sub='Planeta Audio · 2023', facts=['13 h 58 min', 'Castellano'], r='4,4', v='160', src='Audible', note='Los oyentes destacan cómo cambia de voz para cada personaje.')],
         where=['Audible', 'Storytel', 'Nextory', 'Podimo', 'BookBeat', 'Apple Books']),
    dict(n=7, t='Distancia de rescate', a='Samanta Schweblin', y=2014, bg='#C8D1A3', fg='#1E2A14', ac='#5E7424', i='field', ficha=F('distancia-de-rescate-biblioteca-breve-6c30b0c390'),
         p=['Una mujer agoniza en la sala de urgencias de un pueblo. A su lado, un niño que no es su hijo le pide que encuentre el momento exacto en que todo empezó. Algo ha pasado en el campo; algo les está pasando a los niños.',
            'Premio Shirley Jackson 2017, finalista del Man Booker International y película de Netflix (2021).'],
         narr=[dict(who='Paula Pichersky', sub='Planeta Audio · 2025', facts=['2 h 51 min', 'Castellano (según Audible)'], r='4,4', v='98', src='Audible', note='La cuenta casi en susurros, como una pesadilla al oído.')],
         where=['Audible', 'Storytel', 'Nextory', 'Podimo', 'BookBeat', 'Apple Books']),
    dict(n=6, t='Drácula', a='Bram Stoker', y=1897, bg='#3A0A10', fg='#F4E9DA', ac='#E9C46A', i='bat', ficha=F('dracula'),
         p=['Un joven abogado viaja a Transilvania para cerrar la compra de una finca cerca de Londres. Su cliente nunca come con él, no aparece en el espejo y de día no está en ninguna parte.',
            'Es la novela que fijó la imagen del vampiro: «Nosferatu» (1922) era Drácula con otro nombre y sin permiso; la viuda de Stoker lo denunció y un tribunal ordenó destruir las copias.'],
         narr=[dict(lab='Entera', who='José Coronado y Sol de la Barreda', sub='Audible Studios · 2020', facts=['18 h 33 min', 'Castellano'], r='4,8', v='647', src='Audible'),
               dict(lab='Audible Original · adaptación libre', who='Asier Etxeandia, Claudia Salas…', sub='Dirigida por Carlota Pereda · más de 25 actores · 2026', facts=['5 h 50 min', 'Castellano'], r='4,7', v='164', src='Audible')],
         where=['Audible', 'Apple Books (la entera)']),
    dict(n=5, t='Apocalipsis Z', a='Manel Loureiro', y=2007, bg='#262B25', fg='#ECEDE6', ac='#9BD14B', i='virus', ficha=F('apocalipsis-z-el-principio-del-fin-26099c48ce'),
         p=['Un abogado de Pontevedra, que vive solo con su gato, sigue por la tele un brote extraño en Rusia. Al principio es una noticia más; luego el brote se extiende.',
            'Empezó como un blog antes de ser novela, y su película es una de las películas internacionales más vistas de Prime Video.'],
         narr=[dict(lab='Audible Original · ficción sonora', who='Javier Rey y Maggie Civantos', sub='y quince actores más · 2025', facts=['5 h 56 min', 'Castellano', 'Adaptación'], r='4,7', v='264', src='Audible', note='Los oyentes destacan los gruñidos de fondo: como ver una película con los ojos cerrados.'),
               dict(lab='La novela completa', who='Voz sintética autorizada', sub='Réplica de la voz de Octavi Pujades', facts=['14 h 29 min', 'Castellano'], r='4,4', v='134', src='Storytel', note='En Storytel, Nextory, Podimo y BookBeat.')],
         where=['Audible', 'Apple Books', 'Storytel', 'Nextory', 'Podimo', 'BookBeat']),
    dict(n=4, t='Carcoma', a='Layla Martínez', y=2021, bg='#5E3F28', fg='#F6EBDD', ac='#E7C9A0', i='wardrobe', ficha=F('carcoma'),
         p=['Una abuela y su nieta en una vieja casa de pueblo. La nieta ha vuelto después de que desapareciera el niño que cuidaba, el hijo de la familia más rica del pueblo. Los vecinos murmuran, y en esa casa hay algo más que ellas dos.',
            'Layla Martínez se inspiró en la casa que levantó su bisabuelo y en un armario que se abría solo; la novela ha agotado edición tras edición.'],
         narr=[dict(who='Paula Iwasaki', sub='Storyside · 2024', facts=['3 h 1 min', 'Castellano'], r='4,6', v='406', src='Audible', note='Seca y sin sobreactuar. Se escucha en una noche.')],
         where=['Audible', 'Storytel', 'Podimo', 'Apple Books', 'Google Play']),
    dict(n=3, t="El misterio de Salem's Lot", a='Stephen King', y=1975, bg='#23272C', fg='#EFE9DF', ac='#D93A3A', i='house', ficha=F('el-misterio-de-salem-s-lot-cf3a3c029a'),
         p=['Un escritor vuelve al pueblo de su infancia para escribir sobre la casa que le aterrorizaba de niño, justo cuando unos recién llegados la compran. Y la gente empieza a desaparecer… o a volver.',
            'King se preguntó qué pasaría si Drácula volviera en el siglo XX, en Estados Unidos; en los ochenta dijo que, en cierto modo, era su historia favorita.'],
         narr=[dict(who='Xavi Fernández', sub='Penguin Random House · 2016', facts=['16 h 56 min', 'Castellano'], r='4,9', v='19', src='Audible', note='La narración de King en castellano mejor valorada. «It» y «El resplandor» solo existen en español con voz latina (Julio Caycedo).')],
         where=['Audible', 'Apple Books', 'Google Play']),
    dict(n=2, t='Nuestra parte de noche', a='Mariana Enriquez', y=2019, bg='#15102A', fg='#EDE6F7', ac='#B48CF2', i='eye', ficha=F('nuestra-parte-de-noche-486912ae0f'),
         p=['Argentina, en plena dictadura. Un padre cruza el país en coche con su hijo pequeño, que ha heredado un don; una sociedad secreta, la Orden, lo quiere para sus rituales.',
            'Terror sobrenatural y del más real. Premio Herralde 2019 y, para buena parte de la crítica, una de las grandes novelas de terror en español de este siglo.'],
         narr=[dict(who='Mara Brenner', sub='Anagrama · 2021', facts=['23 h 14 min', 'Acento argentino'], r='4,7', v='213', src='Audible', note='Una voz distinta para cada personaje. En Storytel, 4,3 con más de 1.000 valoraciones.')],
         where=['Audible', 'Storytel', 'Nextory', 'Podimo', 'BookBeat', 'Apple Books', 'Google Play']),
    dict(n=1, t='El exorcista', a='William Peter Blatty', y=1971, bg='#0B0B0C', fg='#F2F2F2', ac='#9DB8E2', i='cross', ficha=F('el-exorcista-4a3c486f9d'),
         p=['Una actriz vive en Washington con su hija, Regan. Primero son ruidos en el desván; luego, cambios en la niña; después, una voz que no es la suya. Ni los médicos ni los psiquiatras encuentran una explicación.',
            'Blatty se inspiró en un caso real: el 20 de agosto de 1949, el Washington Post contó en portada que un sacerdote había liberado a un chico que, según se decía, estaba «en las garras del diablo». Blatty lo leyó cuando estudiaba en Georgetown.'],
         narr=[dict(who='Fernando Solís', sub='Penguin Random House Audio · 2023', facts=['13 h 11 min', 'Voz latina'], r='4,9', v='64', src='Audible EE. UU.', note='En España, 4,7 con 3 valoraciones. Un oyente lo resume así: cuando pone la voz del demonio, es indescriptible.')],
         where=['Audible', 'Apple Books', 'Google Play']),
]
OFF = [('Cementerio de animales', 'Stephen King'), ('La semilla del diablo', 'Ira Levin'), ('La maldición de Hill House', 'Shirley Jackson'),
       ('A ciegas', 'Josh Malerman'), ('Soy leyenda', 'Richard Matheson'), ('La casa infernal', 'Richard Matheson')]

e = lambda s: html.escape(str(s), quote=True)


def cover(b, small=False):
    L = len(b['t'])
    ts = '0.62em' if L > 24 else '0.72em' if L > 18 else '0.86em' if L > 12 else '1.02em' if L > 8 else '1.22em'
    y = f'<span class="y">{b["y"]}</span>' if b['y'] else ''
    return (f'<div class="t10-cover" style="--bg:{b["bg"]};--fg:{b["fg"]};--ac:{b["ac"]};--ts:{ts}" aria-hidden="true">'
            f'<span class="a">{e(b["a"])}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">{ICONS[b["i"]]}</svg>'
            f'<span class="t">{e(b["t"])}</span>{y}</div>')


def stars(r):
    v = float(r.replace(',', '.'))
    full = int(v + 0.25)
    return '★' * full + '☆' * (5 - full)


def item(b):
    narr = ''
    for nr in b['narr']:
        lab = f'<div class="lab">{e(nr["lab"])}</div>' if nr.get('lab') else '<div class="lab">La narración</div>'
        facts = ''.join(f'<span>{e(f)}</span>' for f in nr['facts'])
        facts += f'<span><span class="stars" aria-hidden="true">{stars(nr["r"])}</span>{e(nr["r"])} · {e(nr["v"])} valoraciones de la narración · {e(nr["src"])}</span>'
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
    shelf = ''.join(f'<a href="#n{b["n"]}" aria-label="Número {b["n"]}: {e(b["t"])}">{cover(b)}<span class="t10-n">{b["n"]}</span></a>' for b in BOOKS)
    off = ''.join(f'<li>«{e(t)}»<small>{e(a)}</small></li>' for t, a in OFF)
    return (tpl.replace('<!--SHELF-->', shelf).replace('<!--LIST-->', ''.join(item(b) for b in BOOKS)).replace('<!--OFF-->', off))


def jsonld():
    graph = [
        {'@type': 'Article', '@id': URL + '#article', 'url': URL, 'headline': 'Los 10 libros de terror que dan miedo de verdad', 'description': DESC,
         'image': 'https://sonorbooks.com' + PROD_A + '/media/top10-terror-og.jpg', 'inLanguage': 'es-ES', 'datePublished': PUBLICADA, 'dateModified': MODIFICADA,
         'author': {'@type': 'Organization', 'name': 'Equipo editorial SonorBooks', 'url': 'https://sonorbooks.com/es/blog/criterios-editoriales/'},
         'publisher': {'@type': 'Organization', 'name': 'SonorBooks', 'url': 'https://sonorbooks.com/es/'}},
        {'@type': 'ItemList', 'name': 'Los 10 libros de terror que dan miedo de verdad', 'itemListOrder': 'https://schema.org/ItemListOrderDescending', 'numberOfItems': 10,
         'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'url': 'https://sonorbooks.com' + b['ficha'],
                              'item': {'@type': 'Book', 'name': b['t'], 'author': {'@type': 'Person', 'name': b['a']}}} for i, b in enumerate(BOOKS)]},
        {'@type': 'BreadcrumbList', 'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': 'https://sonorbooks.com/es/'},
            {'@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': 'https://sonorbooks.com/es/blog/'},
            {'@type': 'ListItem', 'position': 3, 'name': 'Los 10 libros de terror que dan miedo de verdad', 'item': URL}]},
    ]
    if YT:
        import datetime
        from zoneinfo import ZoneInfo
        dia = datetime.date.fromisoformat(YT_FECHA) if YT_FECHA else datetime.date.today()
        sys.path.insert(0, os.path.join(ROOT, 'tools'))
        from t10_timeline import parse, FPS
        _, total = parse()
        seg = round(total / FPS)
        graph.append({'@type': 'VideoObject', '@id': URL + '#video', 'name': '10 libros de terror que dan miedo de verdad (y cómo escucharlos)',
                      'description': 'Los 10 mejores libros de terror y, de cada uno, la narración en español que hay que escuchar.',
                      'thumbnailUrl': [f'https://i.ytimg.com/vi/{YT}/maxresdefault.jpg', 'https://sonorbooks.com' + PROD_A + '/media/top10-terror-og.jpg'],
                      'uploadDate': datetime.datetime(dia.year, dia.month, dia.day, 12, tzinfo=ZoneInfo('Europe/Madrid')).isoformat(),
                      'duration': f'PT{seg // 60}M{seg % 60}S', 'inLanguage': 'es-ES', 'embedUrl': f'https://www.youtube.com/embed/{YT}',
                      'publisher': {'@type': 'Organization', 'name': 'SonorBooks', 'url': 'https://sonorbooks.com/es/'}})
    return '<script type="application/ld+json">' + json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False) + '</script>'


def media():
    """Imagen para redes (1200×630) y póster del vídeo, a partir de la miniatura A del vídeo."""
    os.makedirs(MEDIA, exist_ok=True)
    thumb = os.path.join(ROOT, 'deliverables/top10/terror/miniatura_A.png')
    if not os.path.exists(thumb):
        thumb = os.path.join(ROOT, 'video/out/t10/thumb_A.png')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', thumb, '-vf', 'scale=1200:-1,crop=1200:630', '-q:v', '3', os.path.join(MEDIA, 'top10-terror-og.jpg')], check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', thumb, '-vf', 'scale=1280:720', '-c:v', 'libwebp', '-quality', '82', os.path.join(MEDIA, 'top10-terror-video.webp')], check=True)


def build_prod(page):
    css, js = (open(os.path.join(SRC, f), encoding='utf-8').read() for f in ('t10.css', 't10.js'))
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
    open(os.path.join(adir, 't10.css'), 'w', encoding='utf-8').write(css)
    open(os.path.join(adir, 't10.js'), 'w', encoding='utf-8').write(js)
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
    css += open(os.path.join(SRC, 't10.css'), encoding='utf-8').read()
    head = ('<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>Los 10 de terror</title>\n'
            '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
            '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&family=Ubuntu:wght@400;500;700&display=swap">\n'
            f'<style>{css}</style>\n')
    js = open(os.path.join(SRC, 't10.js'), encoding='utf-8').read()
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
