#!/usr/bin/env python3
"""Página del blog «Stephen King: por dónde y cómo empezar a leer» (acompaña al vídeo del mismo título de SonorBooks España).

  dist/     → para producción: dist/es/blog/por-donde-empezar-a-leer-stephen-king/index.html
              y dist/assets/blog/stephen-king-guia/{sk.css, sk.js, media/…}
  preview/  → vista previa privada (Artifact): una página con CSS y JS en línea y enlaces absolutos a sonorbooks.com.

Uso: python3 web/stephen-king-guia/build.py [--yt ID_DE_YOUTUBE [--yt-fecha AAAA-MM-DD]]

El texto sale de blog/autores/stephen-king/por-donde-empezar-a-leer-stephen-king.md y los datos de cada audiolibro
(narrador, duración, ficha y edición de la portada) de las fichas de SonorBooks España del 15/10/2026: si cambian, se
cambian aquí y se vuelve a construir. Los enlaces van a las fichas de SonorBooks (internos; sin /salir/).
Las portadas son las de las ediciones en audio de cada ficha, solo para identificar la edición (como hacen las fichas).
La imagen de la portada de la página es un fotograma de la biblioteca 3D del vídeo (arte propio, art/biblioteca.jpg).
La carpeta site/ es la cabecera, el pie y los estilos del sitio, copiados de web/top10-terror/site."""
import datetime, hashlib, html, json, math, os, re, shutil, subprocess, sys, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
SRC, MEDIA, SITE, ART = (os.path.join(HERE, d) for d in ('src', 'media', 'site', 'art'))
YT = sys.argv[sys.argv.index('--yt') + 1] if '--yt' in sys.argv else ''
YT_FECHA = sys.argv[sys.argv.index('--yt-fecha') + 1] if '--yt-fecha' in sys.argv else ''
YT_CANAL = 'https://www.youtube.com/@SonorBooksEspa%C3%B1a/videos'
if YT and not re.fullmatch(r'[\w-]{11}', YT):
    sys.exit(f'--yt: «{YT}» no parece un ID de YouTube')
SLUG = 'por-donde-empezar-a-leer-stephen-king'
URL = f'https://sonorbooks.com/es/blog/{SLUG}/'
PROD_A = '/assets/blog/stephen-king-guia'
PUBLICADA = MODIFICADA = '2026-10-15'
H1 = 'Stephen King: por dónde y cómo empezar a leer'
TITLE = 'Por dónde empezar a leer a Stephen King (y en qué orden)'
DESC = ('Cinco libros para empezar a leer a Stephen King según lo que te guste, qué dejar para después y cuándo importa '
        'el orden. Con la duración de cada audiolibro.')
SEARCH = '/es/audiolibros/?q=stephen+king'
SITE_CSS = ''.join(f'<link rel="stylesheet" href="/assets/{p}">' for p in (
    'replica/fonts.css?v=a9ff3c59b4bb85da', 'styles.css?v=b61bbad688f89ade', 'chrome.css?v=6acbe5725e55051d',
    'cookie-notice.css?v=c1dcc91ebfae56e5', 'header-layout.css?v=f69c0a9cc1af53b3', 'theme.css?v=1f14b7c8389c04a1',
    'alignment.css?v=04565e52bd4e70a8'))
SITE_JS = ('<script type="module" src="/assets/chrome.mjs?v=467bec9dc6f34ed1"></script>'
           '<script type="module" src="/assets/cookie-notice.mjs?v=5563de9897e063db"></script>')

e = lambda s: html.escape(str(s), quote=True)
F = lambda slug: f'/es/audiolibro/{slug}/'

# ——— Audiolibros (fichas de SonorBooks España, 15/10/2026). m = duración en minutos; ed = edición de la portada ———
B = {
    'resplandor': dict(t='El resplandor', y=1977, f='el-resplandor-da78b4d5fd', n='Julio Caycedo', m=18 * 60 + 32, ed='audible:8401025133:ES'),
    'misery': dict(t='Misery', y=1987, f='misery-f29d7b9dcd', n='Jane Santos', m=14 * 60 + 12, ed='audible:8401025303:ES'),
    'milla': dict(t='La milla verde', y=1996, f='la-milla-verde-8e13eae9df', n='Juan Sebastián Aragón', m=14 * 60 + 34, ed='audible:B089CS3DH3:ES'),
    '22-11-63': dict(t='22/11/63', y=2011, f='22-11-63-d8b4cd75ce', n='Carlos Manuel Vesga', m=32 * 60 + 43, ed='audible:8401025311:ES'),
    'mercedes': dict(t='Mr. Mercedes', y=2014, f='mr-mercedes-484615e096', n='Carlos Manuel Vesga', m=17 * 60 + 18, ed='audible:B089DP641S:ES'),
    'carrie': dict(t='Carrie', y=1974, f='carrie-castellano-3087558abb', n='José Posada', m=7 * 60 + 25, ed='audible:8466337415:ES'),
    'elevacion': dict(t='Elevación', y=2018, f='elevacion-c9e2e1f138', n='Cristian Villamil', m=3 * 60 + 17, ed='apple:1631440942:ES'),
    'despues': dict(t='Después', y=2021, f='despues-9bd021da8f', n='Jimmy Vásquez', m=6 * 60 + 55, ed='audible:8401027179:ES'),
    'it': dict(t='It', y=1986, f='it-spanish-edition-4b0f1bd9de', n='Julio Caycedo', m=46 * 60 + 24, ed='audible:8401026865:ES'),
    'apocalipsis': dict(t='Apocalipsis', y=1978, f='apocalipsis-d143f4046f', n='Cristian Villamil', m=48 * 60 + 16, ed='audible:B08PZD5VBR:ES'),
    'doctor-sueno': dict(t='Doctor Sueño', y=2013, f='doctor-sueno-9e5fc7bea4', n='Carlos Manuel Vesga', m=21 * 60 + 18, ed='audible:8401025346:ES'),
    'quien-pierde-paga': dict(t='Quien pierde paga', y=2015, f='quien-pierde-paga-trilogia-bill-hodges-2-2269123500', n='Carlos Manuel Vesga', m=15 * 60 + 12, ed='audible:840102689X:ES'),
    'fin-de-guardia': dict(t='Fin de guardia', y=2016, f='fin-de-guardia-fcd5d7250a', n='Carlos Manuel Vesga', m=14 * 60 + 28, ed='audible:B09ZJWYZ5F:ES'),
    'el-visitante': dict(t='El visitante', y=2018, f='el-visitante-bfb13340a3', n='Ricardo Tejedo', m=21 * 60 + 3, ed='audible:B088RL2VCS:ES'),
    'holly': dict(t='Holly', y=2023, f='holly-6642225727', n='Jane Santos y Ricardo Tejedo', m=18 * 60 + 25, ed='audible:B0CJ5R4Z1N:ES'),
    'cuento-de-hadas': dict(t='Cuento de hadas', y=2022, f='cuento-de-hadas-63b95e861f', n='Julio Caycedo', m=25 * 60 + 50, ed='audible:B0BFT2645H:ES'),
    'torre-1': dict(t='El pistolero', y=1982, f='el-pistolero-ed699b5cdc', n='Jimmy Vásquez', m=7 * 60 + 43, ed='audible:8401026873:ES'),
    'torre-2': dict(t='La llegada de los tres', y=1987, f='la-llegada-de-los-tres-la-torre-oscura-2-5116277c29', n='Jimmy Vásquez', m=13 * 60 + 55, ed='audible:8401026881:ES'),
    'torre-3': dict(t='Las tierras baldías', y=1991, f='las-tierras-baldias-d1d29fb3d4', n='Jimmy Vásquez', m=19 * 60 + 12, ed='audible:B09MGDB98C:ES'),
    'torre-4': dict(t='Mago y cristal', y=1997, f='mago-y-cristal-60e900d70a', n='Jimmy Vásquez', m=29 * 60 + 6, ed='audible:B09WNCCSDR:ES'),
    'torre-5': dict(t='Lobos del Calla', y=2003, f='lobos-del-calla-8377cd3fbe', n='Julio Caycedo', m=29 * 60 + 16, ed='audible:B0B23B8F1P:ES'),
    'torre-6': dict(t='Canción de Susannah', y=2004, f='cancion-de-susannah-la-torre-oscura-6-baf802bf81', n='Julio Caycedo', m=15 * 60 + 35, ed='audible:B0BGYGXV3X:ES'),
    'torre-7': dict(t='La Torre Oscura', y=2004, f='la-torre-oscura-la-torre-oscura-7-4d369fb8df', n='Julio Caycedo', m=34 * 60, ed='audible:B0BXBLMS8C:ES'),
    # Solo enlace (sin portada en la página)
    'la-sangre-manda': dict(t='La sangre manda', y=2020, f='la-sangre-manda-c28ddb2fec', n='', m=16 * 60 + 46, ed=None),
    'no-tengas-miedo': dict(t='No tengas miedo', y=2025, f='no-tengas-miedo-fabd03e68b', n='Jane Santos y Ricardo Tejedo', m=19 * 60 + 17, ed=None),
}
CARRIE_LATINA = dict(f='carrie-latino-3623139992', n='Jane Santos', m=7 * 60 + 52)
SALEM = dict(t="El misterio de Salem's Lot", f='el-misterio-de-salem-s-lot-cf3a3c029a', n='Xavi Fernández')
TORRE = [f'torre-{i}' for i in range(1, 8)]
TORRE_MIN = sum(B[k]['m'] for k in TORRE)          # 8.927 min = 148 h 47 min
# Búsqueda «stephen king» en SonorBooks (15/10/2026): 53 resultados; sin ediciones repetidas ni libros sobre King, 40 obras
# con audiolibro en español (incluidas las escritas a cuatro manos) que suman unas 725 horas.
RESULTADOS, OBRAS, HORAS = 53, 40, 725


def dur(m):
    h, mm = divmod(m, 60)
    s = f'{h} h' if not mm else (f'{mm} min' if not h else f'{h} h {mm} min')
    return s.replace(' ', '\u00a0')  # sin cortes de línea dentro de una duración


def dias(m):
    return math.ceil(m / 60)


def link(k, label=None):
    b = B[k]
    return f'<a href="{F(b["f"])}"><cite>{e(label or b["t"])}</cite></a>'


def cover(k, cls='sk-cover', w=480, eager=False, alt=True):
    b = B[k]
    a = f'Portada del audiolibro «{e(b["t"])}»' if alt else ''
    return (f'<img class="{cls}" src="{{{{A}}}}/media/cover-{k}.webp" alt="{a}" width="{w}" height="{w}" '
            f'loading="{"eager" if eager else "lazy"}" decoding="async">')


ARROW = '<svg aria-hidden="true"><use href="#i-arrow"/></svg>'


def btn(k, text='Ver dónde escucharlo'):
    return f'<a class="sk-btn" href="{F(B[k]["f"])}">{text}{ARROW}<span class="sk-sr"> «{e(B[k]["t"])}»</span></a>'


# ——— «¿Por dónde empiezo yo?» ———
TASTES = [('terror', 'Terror clásico'), ('real', 'Miedo sin nada sobrenatural'), ('noterror', 'Nada de terror'),
          ('scifi', 'Ciencia ficción e historia'), ('thriller', 'Un thriller')]
TIMES = [('largo', 'Sin prisa'), ('corto', 'Poco tiempo (menos de 10 h)')]
PICK = {
    ('terror', 'largo'): ('resplandor', 'Un hotel aislado por la nieve, todo un invierno por delante y un padre que va perdiendo el control.'),
    ('terror', 'corto'): ('carrie', 'Una adolescente acosada en el instituto descubre que tiene poderes. Su primera novela publicada, y de las más cortas.'),
    ('real', 'largo'): ('misery', 'Un escritor herido, su admiradora número uno y una casa de la que no puede salir.'),
    ('real', 'corto'): ('misery', 'Son 14 horas, pero es la más corta de las cinco puertas. Y no tiene nada sobrenatural.'),
    ('noterror', 'largo'): ('milla', 'El corredor de la muerte en 1932 y un preso con un don que nadie se explica. De lo más emotivo que ha escrito.'),
    ('noterror', 'corto'): ('elevacion', 'Una novela corta, luminosa y casi sin miedo: cabe en un par de tardes.'),
    ('scifi', 'largo'): ('22-11-63', 'Un viaje en el tiempo para impedir el asesinato de Kennedy. Larga, pero se pasa volando.'),
    ('scifi', 'corto'): ('elevacion', 'No es ciencia ficción pura, pero tiene su punto fantástico: Scott Carey pierde peso cada día y su cuerpo no cambia.'),
    ('thriller', 'largo'): ('mercedes', 'Un policía jubilado contra el asesino del Mercedes. Abre la trilogía de Bill Hodges.'),
    ('thriller', 'corto'): ('despues', 'Entre el crimen y el terror: Jamie ve a los muertos, y una detective de Nueva York quiere aprovecharlo.'),
}
GENRE = {'resplandor': 'Terror clásico', 'misery': 'Miedo sin nada sobrenatural', 'milla': 'Si el terror no es lo tuyo',
         '22-11-63': 'Ciencia ficción e historia', 'mercedes': 'Thriller'}


def pick_card(k, why):
    b = B[k]
    d = dias(b['m'])
    dots = ''.join('<i></i>' for _ in range(d))
    return (f'<div class="sk-pick-cover">{cover(k, eager=False)}</div><div class="sk-pick-info">'
            f'<h3><cite>{e(b["t"])}</cite> <span>({b["y"]})</span></h3><p>{e(why)}</p>'
            f'<dl class="sk-pick-facts"><div><dt>Audiolibro</dt><dd>{dur(b["m"])}</dd></div><div><dt>Narra</dt><dd>{e(b["n"])}</dd></div>'
            f'<div><dt>A una hora al día</dt><dd>{d} días</dd></div></dl>'
            f'<div class="sk-days" aria-hidden="true">{dots}</div>{btn(k)}</div>')


def chooser():
    def radios(name, opts, legend):
        r = ''.join(f'<label><input type="radio" name="{name}" value="{v}"{" checked" if i == 0 else ""}><span>{e(t)}</span></label>'
                     for i, (v, t) in enumerate(opts))
        return f'<fieldset class="sk-seg"><legend>{e(legend)}</legend><div>{r}</div></fieldset>'
    k, why = PICK[('terror', 'largo')]
    rows = ''.join(f'<tr><th scope="row">{e(t)}</th>' + ''.join(
        f'<td>{link(PICK[(v, tv)][0])} · {dur(B[PICK[(v, tv)][0]]["m"])}</td>' for tv, _ in TIMES) + '</tr>' for v, t in TASTES)
    data = {f'{a}|{b}': dict(k=k2, why=w, t=B[k2]['t'], y=B[k2]['y'], n=B[k2]['n'], dur=dur(B[k2]['m']), d=dias(B[k2]['m']), f=F(B[k2]['f']))
            for (a, b), (k2, w) in PICK.items()}
    return (f'<form class="sk-picker" id="sk-picker" aria-label="Elige tu primer libro de Stephen King">'
            f'{radios("gusto", TASTES, "¿Qué te apetece?")}{radios("tiempo", TIMES, "¿Cuánto tiempo tienes?")}</form>'
            f'<div class="sk-pick" id="sk-pick" aria-live="polite">{pick_card(k, why)}</div>'
            f'<details class="sk-table"><summary>Ver todas las combinaciones</summary><div class="sk-scroll"><table>'
            f'<thead><tr><th scope="col">Te apetece</th><th scope="col">Sin prisa</th><th scope="col">Poco tiempo</th></tr></thead>'
            f'<tbody>{rows}</tbody></table></div></details>'
            f'<script type="application/json" id="sk-pick-data">{json.dumps(data, ensure_ascii=False)}</script>')


# ——— Duraciones (gráfico de barras en HTML) ———
BARS = ['elevacion', 'carrie', 'misery', 'milla', 'mercedes', 'resplandor', '22-11-63', 'it', 'apocalipsis']
LATER = {'it', 'apocalipsis'}


def bars():
    mx = max(B[k]['m'] for k in BARS)
    rows = ''
    for k in BARS:
        b = B[k]
        cls = 'is-later' if k in LATER else 'is-start'
        rows += (f'<li class="{cls}"><a href="{F(b["f"])}"><cite>{e(b["t"])}</cite></a>'
                 f'<span class="bar"><span style="width:{b["m"] / mx * 76:.1f}%"></span><b>{dur(b["m"])}</b></span>'
                 f'<span class="d">{dias(b["m"])} días</span></li>')
    return (f'<figure class="sk-bars"><figcaption><span class="t">Duración del audiolibro en español</span>'
            f'<span class="sk-legend"><span class="is-start">Para empezar</span><span class="is-later">Mejor para después</span></span>'
            f'<span class="sk-bars-note">A la derecha, los días a una hora al día.</span></figcaption>'
            f'<div class="sk-bars-head" aria-hidden="true"><span></span><span>Horas de audio</span><span>A 1 h/día</span></div>'
            f'<ul>{rows}</ul>'
            f'<p class="sk-bars-torre"><b><cite>La Torre Oscura</cite>, los siete libros: casi {round(TORRE_MIN / 60)} horas.</b> '
            f'Más de tres veces <cite>Apocalipsis</cite>; a una hora al día, unos cinco meses.</p></figure>')


# ——— Las cinco puertas ———
DOORS = [
    ('resplandor', 'alto', 'Jack Torrance acepta pasar el invierno como vigilante de un hotel de montaña aislado por la nieve, con su mujer y su hijo Danny, de cinco años. El hotel tiene otros planes.',
     'es King en estado puro. Lo que más asusta no son los fantasmas, sino lo que le va pasando al padre.'),
    ('misery', 'medio', 'Paul Sheldon, un novelista de éxito, se estrella con el coche en plena tormenta de nieve. Lo rescata Annie Wilkes, su admiradora número uno. Y no piensa dejarlo marchar.',
     'dos personajes, una casa y una tensión que no afloja en ningún momento.'),
    ('milla', 'bajo', '1932. El corredor de la muerte de una penitenciaría, al que llaman la milla verde por el color del suelo. Allí llega John Coffey, un preso enorme con un don que nadie se explica.',
     'se publicó en seis entregas, como una serie, y es de lo más emotivo que ha escrito.'),
    ('22-11-63', 'bajo', 'Jake Epping, profesor de inglés, descubre que la despensa de un restaurante esconde un pasadizo al 9 de septiembre de 1958. Se propone quedarse hasta el 22 de noviembre de 1963 para impedir el asesinato de Kennedy.',
     'es larga, pero se pasa volando. Y es, sobre todo, una historia de amor.'),
    ('mercedes', 'medio', 'Bill Hodges, un policía jubilado, recibe la carta del asesino que atropelló a una multitud con un Mercedes y al que nunca atraparon.',
     'ganó el premio Edgar a la mejor novela de misterio (2015) y abre la trilogía de Bill Hodges.'),
]
FEAR = {'bajo': 1, 'medio': 2, 'alto': 3}


def doors():
    out = ''
    for i, (k, fear, syn, why) in enumerate(DOORS, 1):
        b = B[k]
        lvl = FEAR[fear]
        meter = ''.join(f'<i class="{"on" if j < lvl else ""}"></i>' for j in range(3))
        out += (f'<article class="sk-door" id="puerta-{i}" aria-labelledby="sk-door-{i}">'
                f'<div class="sk-door-side"><span class="sk-door-n" aria-hidden="true">{i}</span>{cover(k)}</div>'
                f'<div class="sk-door-body"><h3 id="sk-door-{i}"><cite>{e(b["t"])}</cite></h3>'
                f'<p class="sk-door-genre">{e(GENRE[k])} · {b["y"]}</p><p>{e(syn)}</p>'
                f'<p><b>Por qué empezar aquí:</b> {e(why)}</p>'
                f'<div class="sk-door-facts"><span class="sk-fear" aria-label="Miedo: {fear}"><span class="sk-meter" aria-hidden="true">{meter}</span>Miedo {fear}</span>'
                f'<span>{dur(b["m"])} · {dias(b["m"])} días a 1 h/día</span><span>Narra {e(b["n"])}</span></div>'
                f'{btn(k)}</div></article>')
    return out


def short():
    c, el, de = B['carrie'], B['elevacion'], B['despues']
    return (f'<div class="sk-mini-grid">'
            f'<article class="sk-mini">{cover("carrie")}<div><h3><cite>Carrie</cite> <span>(1974)</span></h3>'
            f'<p>Una adolescente acosada en el instituto descubre que tiene poderes. Hasta la noche del baile.</p>'
            f'<ul class="sk-versions"><li><a href="{F(c["f"])}">Acento de España · {e(c["n"])} · {dur(c["m"])}{ARROW}</a></li>'
            f'<li><a href="{F(CARRIE_LATINA["f"])}">Acento latinoamericano · {e(CARRIE_LATINA["n"])} · {dur(CARRIE_LATINA["m"])}{ARROW}</a></li></ul></div></article>'
            f'<article class="sk-mini">{cover("elevacion")}<div><h3><cite>Elevación</cite> <span>(2018)</span></h3>'
            f'<p>En Castle Rock, Scott Carey pierde peso cada día aunque su cuerpo no cambia. Una novela corta, luminosa y casi sin miedo.</p>'
            f'<ul class="sk-versions"><li><a href="{F(el["f"])}">{e(el["n"])} · {dur(el["m"])}{ARROW}</a></li></ul></div></article>'
            f'<article class="sk-mini">{cover("despues")}<div><h3><cite>Después</cite> <span>(2021)</span></h3>'
            f'<p>Si prefieres un thriller corto. Jamie puede ver a los muertos y hablar con ellos, y una detective de Nueva York decide sacarle partido. Entre el crimen y el terror.</p>'
            f'<ul class="sk-versions"><li><a href="{F(de["f"])}">{e(de["n"])} · {dur(de["m"])}{ARROW}</a></li></ul></div></article></div>')


def later():
    it, ap = B['it'], B['apocalipsis']
    segs = ''.join(f'<li style="flex:{B[k]["m"]}"><a href="{F(B[k]["f"])}" title="{e(B[k]["t"])} · {dur(B[k]["m"])}">'
                   f'<span class="seg"></span><span class="n">{i}</span><span class="h">{round(B[k]["m"] / 60)} h</span></a></li>'
                   for i, k in enumerate(TORRE, 1))
    covers = ''.join(f'<li><a href="{F(B[k]["f"])}">{cover(k, "sk-cover sk-cover-s")}<span><b>{i}.</b> <cite>{e(B[k]["t"])}</cite><br>{dur(B[k]["m"])}</span></a></li>'
                     for i, k in enumerate(TORRE, 1))
    return (f'<div class="sk-mini-grid">'
            f'<article class="sk-mini">{cover("it")}<div><h3><cite>It</cite> <span>(1986)</span></h3>'
            f'<p>Siete amigos se enfrentan de niños, y otra vez de adultos, a algo que despierta en Derry cada veintisiete años. Para muchos, su obra maestra. '
            f'Pero son más de 46 horas, con muchos desvíos e historias dentro de la historia: si es tu primer King, es fácil dejarlo a medias.</p>'
            f'<ul class="sk-versions"><li><a href="{F(it["f"])}">{e(it["n"])} · {dur(it["m"])}{ARROW}</a></li></ul></div></article>'
            f'<article class="sk-mini">{cover("apocalipsis")}<div><h3><cite>Apocalipsis</cite> <span>(1978)</span></h3>'
            f'<p>Un virus acaba con casi toda la humanidad y los supervivientes se agrupan en bandos. También pasa de las 48 horas.</p>'
            f'<ul class="sk-versions"><li><a href="{F(ap["f"])}">{e(ap["n"])} · {dur(ap["m"])}{ARROW}</a></li></ul></div></article></div>'
            f'<section class="sk-torre" id="la-torre-oscura" aria-labelledby="sk-torre-h">'
            f'<h3 id="sk-torre-h"><cite>La Torre Oscura</cite></h3>'
            f'<p>Su gran saga de fantasía: siete libros y casi {round(TORRE_MIN / 60)} horas de audiolibro. Es el centro de todo su universo, '
            f'así que la disfrutarás más si llegas con otros libros suyos ya leídos.</p>'
            f'<figure><figcaption class="sk-sr">Duración de cada libro de La Torre Oscura en audiolibro</figcaption>'
            f'<ol class="sk-saga-bar">{segs}</ol></figure>'
            f'<ol class="sk-saga">{covers}</ol>'
            f'<p class="sk-note">Narran Jimmy Vásquez (del 1 al 4) y Julio Caycedo (del 5 al 7).</p></section>')


LINKS = [('resplandor', 'Danny Torrance', 'doctor-sueno', 'El niño de <cite>El resplandor</cite> vuelve de adulto en <cite>Doctor Sueño</cite> (2013).'),
         ('22-11-63', 'Derry', 'it', 'El protagonista de <cite>22/11/63</cite> pasa por el pueblo de <cite>It</cite> en 1958 y se cruza con dos de sus niños, Beverly y Richie.'),
         ('apocalipsis', 'Randall Flagg', 'torre-1', 'El villano de <cite>Apocalipsis</cite> reaparece en <cite>La Torre Oscura</cite>.'),
         ('mercedes', 'Holly Gibney', 'holly', 'Secundaria en <cite>Mr. Mercedes</cite>, acaba protagonizando sus propias novelas: <cite>Holly</cite> (2023) y <cite>No tengas miedo</cite> (2025).')]


def connections():
    out = ''
    for a, lab, b, txt in LINKS:
        out += (f'<li><a class="c" href="{F(B[a]["f"])}">{cover(a, "sk-cover sk-cover-s", alt=False)}<span class="sk-sr">{e(B[a]["t"])}</span></a>'
                f'<div class="mid"><span class="lab">{e(lab)}</span><span class="line" aria-hidden="true"></span><p>{txt}</p></div>'
                f'<a class="c" href="{F(B[b]["f"])}">{cover(b, "sk-cover sk-cover-s", alt=False)}<span class="sk-sr">{e("La Torre Oscura" if b == "torre-1" else B[b]["t"])}</span></a></li>')
    return f'<ul class="sk-links">{out}</ul>'


def chain(keys, after=None):
    items = ''.join(f'<li>{link(k)}</li>' for k in keys)
    if after:
        items += '<li class="then">y después:</li>' + ''.join(f'<li>{link(k)}</li>' for k in after)
    return f'<ol class="sk-chain">{items}</ol>'


def order():
    return ('<ol class="sk-order">'
            f'<li><h3><cite>La Torre Oscura</cite>: del 1 al 7</h3><p><a href="#la-torre-oscura">Los siete, con su duración, más arriba</a>. '
            f'<cite>El viento por la cerradura</cite> (2012) se lee entre el 4 y el 5.</p></li>'
            f'<li><h3>Bill Hodges (y Holly Gibney)</h3>{chain(["mercedes", "quien-pierde-paga", "fin-de-guardia"], ["el-visitante", "la-sangre-manda", "holly", "no-tengas-miedo"])}'
            f'<p class="sk-chain-note">De <cite>La sangre manda</cite>, la novela corta que da título al libro.</p></li>'
            f'<li><h3><cite>El resplandor</cite>, antes de <cite>Doctor Sueño</cite></h3>{chain(["resplandor", "doctor-sueno"])}</li></ol>')


ROUTES = [('miedo', 'Miedo', ['carrie', 'resplandor', 'doctor-sueno', 'it']),
          ('emocion', 'Emoción y fantasía', ['milla', '22-11-63', 'cuento-de-hadas']),
          ('crimen', 'Crimen', ['mercedes', 'quien-pierde-paga', 'fin-de-guardia', 'el-visitante', 'holly'])]


def routes():
    lines = ''
    for cls, name, keys in ROUTES:
        st = ''.join(f'<li><a href="{F(B[k]["f"])}"><span class="dot" aria-hidden="true"></span><cite>{e(B[k]["t"])}</cite></a></li>' for k in keys)
        lines += f'<li class="sk-line is-{cls}"><h3>{e(name)}</h3><ol style="--n:{len(keys)}">{st}</ol></li>'
    return (f'<ol class="sk-metro">{lines}</ol>'
            f'<p class="sk-terminal"><span class="dot" aria-hidden="true"></span><span><b>Al final del camino, para los valientes:</b> '
            f'<a href="{F(B["torre-1"]["f"])}"><cite>La Torre Oscura</cite></a>.</span></p>')


TERRITORIES = [
    ('Terror sobrenatural', 'Hoteles, coches y pueblos malditos.', [link('resplandor'), '<cite>Christine</cite>', f'<a href="{F(SALEM["f"])}"><cite>{e(SALEM["t"])}</cite></a>']),
    ('Terror humano', 'El monstruo es una persona.', [link('misery'), '<cite>El juego de Gerald</cite>', '<cite>Dolores Claiborne</cite>']),
    ('Fantasía y ciencia ficción', 'Viajes en el tiempo y otros mundos.', [link('22-11-63'), link('torre-1', 'La Torre Oscura'), link('cuento-de-hadas')]),
    ('Crimen', 'Detectives y asesinos.', [link('mercedes'), link('el-visitante'), link('holly')]),
    ('Relatos y novelas cortas', 'Para leer de una sentada.', ['<cite>El umbral de la noche</cite>', '<cite>Las cuatro estaciones</cite>', link('elevacion')]),
]


def territories():
    return '<ul class="sk-terr">' + ''.join(
        f'<li><h3>{e(t)}</h3><p>{e(d)}</p><p class="ex">{" · ".join(ex)}</p></li>' for t, d, ex in TERRITORIES) + '</ul>'


def page_html():
    tpl = open(os.path.join(SRC, 'page.html'), encoding='utf-8').read()
    rep = {'<!--PICKER-->': chooser(), '<!--BARS-->': bars(), '<!--DOORS-->': doors(), '<!--SHORT-->': short(),
           '<!--LATER-->': later(), '<!--LINKS-->': connections(), '<!--ORDER-->': order(), '<!--ROUTES-->': routes(),
           '<!--TERR-->': territories(), '{{H_TORRE}}': str(round(TORRE_MIN / 60)), '{{OBRAS}}': str(OBRAS), '{{HORAS}}': str(HORAS),
           '{{RESULTADOS}}': str(RESULTADOS),
           '{{DIAS_SEGUIDOS}}': str(round(HORAS / 24)), '{{SEARCH}}': SEARCH, '{{F_CARRIE}}': F(B['carrie']['f']), '{{F_SALEM}}': F(SALEM['f'])}
    for k, v in rep.items():
        tpl = tpl.replace(k, v)
    return tpl


def fecha_larga(iso):
    d = datetime.date.fromisoformat(iso)
    meses = 'enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre'.split()
    return f'{d.day} de {meses[d.month - 1]} de {d.year}'


def jsonld():
    og = 'https://sonorbooks.com' + PROD_A + '/media/stephen-king-og.jpg'
    graph = [
        {'@type': 'BlogPosting', '@id': URL + '#article', 'url': URL, 'mainEntityOfPage': URL, 'headline': H1, 'description': DESC,
         'image': og, 'inLanguage': 'es-ES', 'datePublished': PUBLICADA, 'dateModified': MODIFICADA,
         'about': {'@type': 'Person', 'name': 'Stephen King', 'sameAs': ['https://es.wikipedia.org/wiki/Stephen_King']},
         'author': {'@type': 'Organization', 'name': 'Equipo editorial SonorBooks', 'url': 'https://sonorbooks.com/es/blog/criterios-editoriales/'},
         'publisher': {'@type': 'Organization', 'name': 'SonorBooks', 'url': 'https://sonorbooks.com/es/'}},
        {'@type': 'ItemList', 'name': 'Cinco libros para empezar a leer a Stephen King', 'itemListOrder': 'https://schema.org/ItemListUnordered',
         'numberOfItems': len(DOORS),
         'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'url': 'https://sonorbooks.com' + F(B[k]['f']),
                              'item': {'@type': 'Book', 'name': B[k]['t'], 'author': {'@type': 'Person', 'name': 'Stephen King'}}}
                             for i, (k, *_) in enumerate(DOORS)]},
        {'@type': 'BreadcrumbList', 'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': 'https://sonorbooks.com/es/'},
            {'@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': 'https://sonorbooks.com/es/blog/'},
            {'@type': 'ListItem', 'position': 3, 'name': H1, 'item': URL}]},
    ]
    if YT:
        from zoneinfo import ZoneInfo
        dia = datetime.date.fromisoformat(YT_FECHA) if YT_FECHA else datetime.date.today()
        sys.path.insert(0, os.path.join(ROOT, 'tools'))
        from skg_timeline import parse, FPS
        _, total = parse()
        seg = round(total / FPS)
        graph.append({'@type': 'VideoObject', '@id': URL + '#video', 'name': H1,
                      'description': 'Por dónde empezar con Stephen King: cinco puertas de entrada según lo que te guste, qué dejar para después y cuándo importa el orden.',
                      'thumbnailUrl': [f'https://i.ytimg.com/vi/{YT}/maxresdefault.jpg', og],
                      'uploadDate': datetime.datetime(dia.year, dia.month, dia.day, 12, tzinfo=ZoneInfo('Europe/Madrid')).isoformat(),
                      'duration': f'PT{seg // 60}M{seg % 60}S', 'inLanguage': 'es-ES', 'embedUrl': f'https://www.youtube.com/embed/{YT}',
                      'publisher': {'@type': 'Organization', 'name': 'SonorBooks', 'url': 'https://sonorbooks.com/es/'}})
    return '<script type="application/ld+json">' + json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False) + '</script>'


def media():
    """Portadas (480 px, WebP; si faltan, se descargan de la API de portadas de SonorBooks), la portada de la página (biblioteca
    3D del vídeo), la imagen para redes (1200×630) y el póster del vídeo (miniatura B)."""
    os.makedirs(MEDIA, exist_ok=True)
    for k, b in B.items():
        out = os.path.join(MEDIA, f'cover-{k}.webp')
        if not b['ed'] or os.path.exists(out):
            continue
        tmp = out + '.src'
        url = 'https://sonorbooks.com/api/v1/editions/' + urllib.parse.quote(b['ed'], safe='') + '/cover?w=480'
        with urllib.request.urlopen(url, timeout=30) as r, open(tmp, 'wb') as fh:
            fh.write(r.read())
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-vf', 'scale=480:480:flags=lanczos', '-c:v', 'libwebp', '-quality', '82', out], check=True)
        os.remove(tmp)
    art = os.path.join(ART, 'biblioteca.jpg')
    for w in (2400, 1200):
        out = os.path.join(MEDIA, f'sk-biblioteca-{w}.webp')
        if not os.path.exists(out):
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', art, '-vf', f'scale={w}:-2:flags=lanczos', '-c:v', 'libwebp', '-quality', '74', out], check=True)
    thumb = os.path.join(ROOT, 'deliverables/autores/stephen-king/miniatura_B.png')
    og, poster = os.path.join(MEDIA, 'stephen-king-og.jpg'), os.path.join(MEDIA, 'stephen-king-video.webp')
    if not os.path.exists(og):
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', thumb, '-vf', 'scale=1200:-2:flags=lanczos,crop=1200:630', '-q:v', '3', og], check=True)
    if not os.path.exists(poster):
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', thumb, '-c:v', 'libwebp', '-quality', '82', poster], check=True)


def fill(page, a):
    yt_url = f'https://www.youtube.com/watch?v={YT}' if YT else YT_CANAL
    return (page.replace('{{A}}', a).replace('{{YT_ID}}', YT).replace('{{YT_URL}}', yt_url)
            .replace('{{PUBLICADA}}', PUBLICADA).replace('{{MODIFICADA}}', MODIFICADA)
            .replace('{{PUBLICADA_TXT}}', fecha_larga(PUBLICADA)).replace('{{MODIFICADA_TXT}}', fecha_larga(MODIFICADA))
            .replace('{{TITLE}}', e(TITLE)).replace('{{H1}}', e(H1)).replace('{{DESC}}', e(DESC)).replace('{{URL}}', URL))


def build_prod(page):
    css, js = (open(os.path.join(SRC, f), encoding='utf-8').read() for f in ('sk.css', 'sk.js'))
    v = hashlib.sha1((css + js).encode()).hexdigest()[:12]
    routing = open(os.path.join(SITE, 'provider-routing-data.json'), encoding='utf-8').read().strip()
    page = (page.replace('<!--SITE_CSS-->', SITE_CSS + '<style>' + open(os.path.join(SITE, 'chrome_inline.css'), encoding='utf-8').read().strip() + '</style>')
            .replace('<!--SITE_JS-->', SITE_JS).replace('<!--JSONLD-->', jsonld() + f'<script id="provider-routing-data" type="application/json">{routing}</script>')
            .replace('<!--HEADER-->', open(os.path.join(SITE, 'header.html'), encoding='utf-8').read())
            .replace('<!--FOOTER-->', open(os.path.join(SITE, 'footer.html'), encoding='utf-8').read() + open(os.path.join(SITE, 'cookie.html'), encoding='utf-8').read())
            .replace('{{V}}', v))
    page = fill(page, PROD_A)
    assert '{{' not in page and not re.search(r'<!--[A-Z_]+-->', page), 'quedan marcadores sin sustituir'
    out = os.path.join(HERE, 'dist')
    shutil.rmtree(out, ignore_errors=True)
    pdir = os.path.join(out, 'es', 'blog', SLUG); adir = os.path.join(out, PROD_A.strip('/'))
    os.makedirs(pdir); os.makedirs(os.path.join(adir, 'media'))
    open(os.path.join(pdir, 'index.html'), 'w', encoding='utf-8').write(page)
    open(os.path.join(adir, 'sk.css'), 'w', encoding='utf-8').write(css)
    open(os.path.join(adir, 'sk.js'), 'w', encoding='utf-8').write(js)
    for f in os.listdir(MEDIA):
        shutil.copy(os.path.join(MEDIA, f), os.path.join(adir, 'media', f))
    print('producción →', os.path.relpath(out, ROOT), f'(v={v})')


def build_preview(page):
    body = page.split('<body class="inner-page sk-page">', 1)[1].rsplit('</body>', 1)[0]
    header = re.sub(r'<details class="sb-search">.*?</details>', '', open(os.path.join(SITE, 'header.html'), encoding='utf-8').read(), flags=re.S)
    body = body.replace('<!--HEADER-->', header).replace('<!--FOOTER-->', open(os.path.join(SITE, 'footer.html'), encoding='utf-8').read())
    body = fill(body, '.').replace('src="/assets/brand/', 'src="./site/')
    body = re.sub(r'href="/(?!/)', 'href="https://sonorbooks.com/', body)
    css = ''.join(open(os.path.join(SITE, f), encoding='utf-8').read() for f in ('chrome.css', 'header-layout.css', 'chrome_inline.css'))
    css += ('\nhtml{scroll-behavior:smooth;color-scheme:light}body{margin:0;background:#fff;color:#101010;font-family:"Merriweather",Georgia,serif}'
            'body .sb-footer{margin-top:0}.sb-menu,.sb-account{font-family:"Ubuntu",Arial,sans-serif}'
            '.sb-account{align-self:center}.sb-account a{display:inline-flex;align-items:center}.sb-account .sb-register{height:42px}'
            '@media(max-width:1099px){.sb-toggle{margin-left:auto}}\n')
    css += open(os.path.join(SRC, 'sk.css'), encoding='utf-8').read()
    head = ('<title>Por dónde empezar con King</title>\n'
            '<meta name="color-scheme" content="light">\n'
            '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
            '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&family=Ubuntu:wght@400;500;700&display=swap">\n'
            f'<style>{css}</style>\n')
    js = open(os.path.join(SRC, 'sk.js'), encoding='utf-8').read()
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
    import urllib.parse
    media()
    p = page_html()
    build_prod(p)
    build_preview(p)
    if not YT:
        print('aviso: sin --yt, el vídeo enlaza al canal; al publicar: --yt ID --yt-fecha AAAA-MM-DD')
