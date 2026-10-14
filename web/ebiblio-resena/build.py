#!/usr/bin/env python3
"""Construye la página de eBiblio a partir de src/ (mismo sistema que las de LibriVox y ElevenReader):

  dist/          → para producción (sonorbooks.com). Ver README.md.
                   dist/es/blog/ebiblio-resena/index.html
                   dist/assets/resenas/ebiblio/{eb-resena.css, eb-resena.js, media/…}
  preview/       → vista previa privada (Artifact de Claude): una sola página con CSS y JS en línea,
                   enlaces absolutos a sonorbooks.com y los archivos de media/ al lado.
  preview-movil/ → la misma vista previa dentro de un teléfono, para revisar la versión móvil.

Uso: python3 web/ebiblio-resena/build.py [--yt ID_DE_YOUTUBE [--yt-fecha AAAA-MM-DD]]
Las capturas salen de tools/web_eb_media.py; la miniatura del vídeo y la imagen para redes, de la composición EBCover
(video/src/scenes/eb/Cover.tsx). Los datos de cada comunidad (REGIONS) son el recuento propio del 14/10/2026 en el
catálogo público de cada eBiblio y sus páginas de información (research/ebiblio/dossier.md, apartados 3 a 5)."""
import hashlib, html, json, os, re, shutil, sys
from urllib.parse import quote

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
SRC, MEDIA, SITE = (os.path.join(HERE, d) for d in ('src', 'media', 'site'))
YT = sys.argv[sys.argv.index('--yt') + 1] if '--yt' in sys.argv else ''
YT_FECHA = sys.argv[sys.argv.index('--yt-fecha') + 1] if '--yt-fecha' in sys.argv else ''  # día de publicación en YouTube
YT_CANAL = 'https://www.youtube.com/@SonorBooksEspa%C3%B1a/videos'
if YT and not re.fullmatch(r'[\w-]{11}', YT):
    sys.exit(f'--yt: «{YT}» no parece un ID de YouTube (11 caracteres, p. ej. dQw4w9WgXcQ)')
if YT and not re.fullmatch(r'\d{4}-\d{2}-\d{2}', YT_FECHA):
    sys.exit('--yt necesita también --yt-fecha AAAA-MM-DD (el día en que se publicó el vídeo)')
URL = 'https://sonorbooks.com/es/blog/ebiblio-resena/'
PROD_A = '/assets/resenas/ebiblio'
FECHA = '2026-10-14'
# Ruta de salida del sitio (la misma que usa la ficha de eBiblio en la portada); eBiblio no es un enlace de afiliado.
SALIR_TO = lambda dest: '/salir/ebiblio/?market=ES&amp;language=es&amp;to=' + quote(dest, safe='')
SALIR = SALIR_TO('https://ebiblio.es/')

# Las hojas de estilo y los módulos del sitio, con las versiones de la página actual del blog (sin blog.css).
SITE_CSS = ''.join(f'<link rel="stylesheet" href="/assets/{p}">' for p in (
    'replica/fonts.css?v=a9ff3c59b4bb85da', 'styles.css?v=b61bbad688f89ade', 'chrome.css?v=6acbe5725e55051d',
    'cookie-notice.css?v=c1dcc91ebfae56e5', 'header-layout.css?v=f69c0a9cc1af53b3', 'theme.css?v=1f14b7c8389c04a1',
    'alignment.css?v=04565e52bd4e70a8'))
SITE_JS = ('<script type="module" src="/assets/chrome.mjs?v=467bec9dc6f34ed1"></script>'
           '<script type="module" src="/assets/provider-routing.mjs?v=d162434984d092af"></script>'
           '<script type="module" src="/assets/cookie-notice.mjs?v=5563de9897e063db"></script>')

# ---------------------------------------------------------------------------------------------------------------
# Las 17 comunidades: audiolibros del catálogo y disponibles ahora (filtros «Audiolibros» y «Títulos disponibles»,
# 14/10/2026; Madrid, 1.998 disponibles: la cifra de la captura del catálogo que sale en la página y en el vídeo), cómo se saca el carné por internet (None = solo en persona) y cuántos préstamos a la vez.
# ---------------------------------------------------------------------------------------------------------------
REGIONS = [
    # slug, nombre, audiolibros, disponibles, carné por internet, a la vez
    ('madrid', 'Madrid', 3186, 1998, 'en la sede electrónica de la Comunidad de Madrid', '2 audiolibros (y 1 reserva)'),
    ('castillayleon', 'Castilla y León', 2567, 2148, 'con certificado digital', '1 audiolibro'),
    ('navarra', 'Navarra', 2276, 1933, 'con una solicitud en su web', 'Hasta 2 préstamos de cualquier tipo'),
    ('cantabria', 'Cantabria', 1454, 1197, None, '1 audiolibro'),
    ('galicia', 'Galicia', 1211, 895, 'con certificado digital', '2 audiolibros'),
    ('castillalamancha', 'Castilla-La Mancha', 1101, 602, 'en el Registro Único, con certificado digital', 'Hasta 5 préstamos de cualquier tipo'),
    ('larioja', 'La Rioja', 1073, 910, 'desde el catálogo de sus bibliotecas', '1 audiolibro'),
    ('canarias', 'Canarias', 994, 838, 'desde el catálogo de la Red BICA', '5 audiolibros'),
    ('melilla', 'Melilla', 955, 953, 'con un formulario', 'Hasta 7 préstamos de cualquier tipo'),
    ('ceuta', 'Ceuta', 942, 916, None, 'Hasta 4 préstamos de cualquier tipo'),
    ('illesbalears', 'Illes Balears', 892, 802, None, '1 audiolibro (y hasta 7 préstamos en total)'),
    ('andalucia', 'Andalucía', 831, 504, 'con certificado digital', 'Hasta 5 préstamos de cualquier tipo'),
    ('murcia', 'Murcia', 827, 517, 'con el formulario de alta de carné', 'Hasta 4 préstamos de cualquier tipo'),
    ('extremadura', 'Extremadura', 825, 641, 'en Bibliotex', 'Hasta 6 préstamos de cualquier tipo'),
    ('comunitatvalenciana', 'Comunitat Valenciana', 675, 454, None, 'Hasta 3 préstamos de cualquier tipo'),
    ('aragon', 'Aragón', 495, 287, 'con un formulario', 'Hasta 3 préstamos de cualquier tipo'),
    ('asturias', 'Asturias', 450, 295, None, '1 audiolibro'),
]
DEFAULT = 'madrid'
assert len(REGIONS) == 17 and sorted(r[2] for r in REGIONS) == [r[2] for r in REGIONS][::-1]


def miles(n):
    return f'{n:,}'.replace(',', '.')


def region_rows():
    top = max(r[2] for r in REGIONS)
    out = []
    for slug, name, tot, av, _, _ in REGIONS:
        on = 'true' if slug == DEFAULT else 'false'
        out.append(
            f'<li><button type="button" data-region="{slug}" aria-pressed="{on}" aria-controls="eb-region" '
            f'aria-label="{html.escape(name)}: {miles(tot)} audiolibros, {miles(av)} disponibles ahora">'
            f'<span class="nm">{html.escape(name)}</span>'
            f'<span class="tr" aria-hidden="true"><i class="tot" style="width:{tot / top * 100:.2f}%"></i><i class="av" style="width:{av / top * 100:.2f}%"></i></span>'
            f'<span class="vl" aria-hidden="true">{miles(tot)}</span><span class="va" aria-hidden="true">{miles(av)}</span></button></li>')
    return ''.join(out)


def region_cards(prefix=''):
    out = []
    for slug, name, tot, av, online, once in REGIONS:
        dest = f'https://{slug}.ebiblio.es/'
        carne = (f'En cualquier biblioteca pública de la red o por internet, {online}.' if online
                 else 'En persona, en cualquier biblioteca pública de la red.')
        # Sin JavaScript se ven todas las fichas; eb-resena.js deja solo la de la comunidad elegida (Madrid al cargar).
        out.append(
            f'<div class="eb-region__card" data-card="{slug}">'
            f'<h3 class="eb-region__h"><svg aria-hidden="true"><use href="#i-map"/></svg>eBiblio {html.escape(name)}</h3>'
            f'<div class="eb-region__nums"><div><b>{miles(tot)}</b><span>audiolibros en su catálogo</span></div>'
            f'<div class="av"><b>{miles(av)}</b><span>disponibles ahora ({round(av / tot * 100)}&nbsp;%)</span></div></div>'
            f'<dl><div><dt>A la vez</dt><dd>{html.escape(once)}</dd></div><div><dt>El carné</dt><dd>{html.escape(carne)}</dd></div></dl>'
            f'<a class="eb-btn eb-btn--ink" data-cta="eb-review-region" target="_blank" href="{prefix}{SALIR_TO(dest)}" data-platform="ebiblio" '
            f'data-platform-destination="{dest}" rel="noopener noreferrer" aria-label="Ir a eBiblio {html.escape(name)} (se abre en otra pestaña)">'
            f'Ir a eBiblio {html.escape(name)} <svg class="eb-ico" aria-hidden="true"><use href="#i-ext"/></svg></a></div>')
    return ''.join(out)


# Carrusel: más formas de escuchar gratis y las plataformas (títulos y entradillas del índice del blog)
MORE = [
    ('audiolibros-gratis-sin-suscripcion', 'Guía práctica', '5&nbsp;min de lectura', 'Audiolibros gratis en español: dónde escuchar sin suscripción',
     'Tres puntos de partida sin cuota: una biblioteca cultural, grabaciones de voluntarios y el préstamo de tu biblioteca pública.', 'Leer guía'),
    ('librivox-resena', 'Reseña', 'Reseña con vídeo', 'LibriVox: qué es y cómo usarlo',
     'Clásicos gratis y legales, leídos por voluntarios: cómo buscarlos, escucharlos y descargarlos.', 'Leer reseña'),
    ('media-hora-al-dia-audiolibros', 'Ideas para escuchar', '3&nbsp;min de lectura', 'Media hora al día: cuántos audiolibros caben en tu rutina',
     'Calcula cuánto avanzas en media hora y cuánto tardarías en terminar tu próxima escucha.', 'Leer artículo'),
    ('el-libro-total-resena', 'Reseña', '4&nbsp;min de lectura', 'El Libro Total: audiolibros gratis y cómo escucharlos',
     'Una buena primera parada cuando quieres escuchar sin suscribirte.', 'Leer reseña'),
    ('cuanto-cuesta-escuchar-audiolibros-espana', 'Guía práctica', '6&nbsp;min de lectura', '¿Cuánto cuesta escuchar audiolibros en España?',
     'Compara precios mensuales, opciones gratuitas y compra por libro. Después calcula qué te sale mejor con tu ritmo de escucha.', 'Leer guía'),
    ('storytel-resena', 'Reseña', '4&nbsp;min de lectura', 'Storytel en España: precio, catálogo y opiniones',
     'Para quien quiere alternar libros y audiolibros sin llevar la cuenta de cada hora.', 'Leer reseña'),
    ('nextory-resena', 'Reseña', '4&nbsp;min de lectura', 'Nextory: planes, horas, precio y opiniones',
     'El plan más barato solo es el adecuado si sus horas te alcanzan.', 'Leer reseña'),
    ('podimo-resena', 'Reseña', '4&nbsp;min de lectura', 'Podimo: precio, horas de audiolibros y opiniones',
     'Una cuota para quien disfruta de pódcasts y también quiere una buena historia.', 'Leer reseña'),
    ('audible-resena', 'Reseña', '16&nbsp;min de lectura', 'Audible en España: opiniones, precio y cómo funciona',
     'Planes, catálogo y app: qué ofrece Audible en España y para quién merece la pena.', 'Leer reseña'),
]


def more():
    out = []
    for slug, tag, k, t, d, cta in MORE:
        im = f'/assets/blog/editorial/{slug}'
        out.append(
            f'\n  <li><a class="eb-more__card" href="/es/blog/{slug}/" draggable="false">'
            f'<span class="eb-more__img"><img src="{im}-800.webp" srcset="{im}-480.webp 480w, {im}-800.webp 800w" sizes="(max-width: 720px) 80vw, 380px" '
            f'width="800" height="450" alt="" loading="lazy" decoding="async" draggable="false"><em>{tag}</em></span>'
            f'<span class="eb-more__k">{k}</span><b class="eb-more__t">{t}</b><span class="eb-more__d">{d}</span>'
            f'<span class="eb-more__cta">{cta}<svg aria-hidden="true"><use href="#i-arrow"/></svg></span></a></li>')
    return ''.join(out) + '\n '


def read(p):
    return open(p, encoding='utf-8').read()


VIDEO_DURATION = 'PT3M38S'  # duración del vídeo final
# Vídeo ligero (≤ 15 MB) para que la vista previa lo reproduzca sin YouTube; en producción se usa el de YouTube.
VIDEO_PREVIEW = os.path.join(ROOT, 'deliverables', 'ebiblio', 'SonorBooks_eBiblio_Guia_web.mp4')


def jsonld():
    notes = lambda xs: {'@type': 'ItemList', 'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'name': n} for i, n in enumerate(xs)]}
    graph = [
        {'@type': 'Review', '@id': URL + '#review', 'url': URL, 'name': 'eBiblio: qué es y cómo usarlo',
         'image': 'https://sonorbooks.com' + PROD_A + '/media/ebiblio-resena-og.jpg',
         'inLanguage': 'es-ES', 'datePublished': FECHA, 'dateModified': FECHA,
         'author': {'@type': 'Organization', 'name': 'Equipo editorial SonorBooks', 'url': 'https://sonorbooks.com/es/blog/criterios-editoriales/'},
         'publisher': {'@type': 'Organization', 'name': 'SonorBooks', 'url': 'https://sonorbooks.com/es/'},
         'reviewRating': {'@type': 'Rating', 'ratingValue': '7.5', 'bestRating': '10', 'worstRating': '0'},
         'positiveNotes': notes(['Gratis y legal, sin cuotas ni anuncios', 'Audiolibros actuales, con narradores profesionales',
                                 'Cientos de audiolibros que se pueden pedir sin esperar', 'Se devuelve solo, sin multas', 'Web y app, con descarga sin conexión']),
         'negativeNotes': notes(['Las novedades tienen cola', 'El catálogo depende de la comunidad', 'La app es mejorable',
                                 'Pocos préstamos a la vez en algunas comunidades', 'No se renueva']),
         'itemReviewed': {'@type': 'Organization', 'name': 'eBiblio', 'url': 'https://ebiblio.es/', 'foundingDate': '2014',
                          'description': 'Préstamo digital gratuito de las bibliotecas públicas españolas: libros electrónicos, audiolibros, revistas y periódicos.',
                          'parentOrganization': {'@type': 'GovernmentOrganization', 'name': 'Ministerio de Cultura', 'url': 'https://www.cultura.gob.es/'}}},
        {'@type': 'BreadcrumbList', 'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': 'https://sonorbooks.com/es/'},
            {'@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': 'https://sonorbooks.com/es/blog/'},
            {'@type': 'ListItem', 'position': 3, 'name': 'Reseñas', 'item': 'https://sonorbooks.com/es/blog/resenas/'},
            {'@type': 'ListItem', 'position': 4, 'name': 'eBiblio', 'item': URL}]},
    ]
    if YT:  # el vídeo, para que Google lo asocie a la página (se carga al pulsar, sin iframe en el HTML)
        import datetime
        from zoneinfo import ZoneInfo
        y, m, d = map(int, YT_FECHA.split('-'))
        subida = datetime.datetime(y, m, d, 12, 0, tzinfo=ZoneInfo('Europe/Madrid')).isoformat()  # +02:00 en verano, +01:00 en invierno
        graph.append({'@type': 'VideoObject', '@id': URL + '#video', 'name': 'Cómo usar eBiblio: audiolibros gratis con el carné de tu biblioteca',
                      'description': 'eBiblio paso a paso: qué es y cómo funciona, cómo sacar el carné, cómo pedir y escuchar tu primer '
                                     'audiolibro en la web y en la app, las colas y el truco para esquivarlas, y si merece la pena.',
                      'thumbnailUrl': [f'https://i.ytimg.com/vi/{YT}/maxresdefault.jpg', 'https://sonorbooks.com' + PROD_A + '/media/ebiblio-resena-og.jpg'],
                      'uploadDate': subida, 'duration': VIDEO_DURATION, 'inLanguage': 'es-ES',
                      'embedUrl': f'https://www.youtube.com/embed/{YT}',
                      'publisher': {'@type': 'Organization', 'name': 'SonorBooks', 'url': 'https://sonorbooks.com/es/'}})
    return '<script type="application/ld+json">' + json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False) + '</script>'


def media_files():
    """Todo lo que hay en media/ (subcarpetas incluidas), menos los auxiliares."""
    out = []
    for d, _, fs in os.walk(MEDIA):
        for f in fs:
            if f.startswith('.') or f in ('sizes.json',):
                continue
            out.append(os.path.relpath(os.path.join(d, f), MEDIA))
    return sorted(out)


def copy_media(dst):
    for f in media_files():
        os.makedirs(os.path.dirname(os.path.join(dst, f)), exist_ok=True)
        shutil.copy(os.path.join(MEDIA, f), os.path.join(dst, f))


def fill(page, prefix=''):
    return (page.replace('{{REGION_ROWS}}', region_rows()).replace('{{REGION_CARDS}}', region_cards(prefix))
            .replace('{{MORE}}', more()))


def build_prod():
    css, js = read(os.path.join(SRC, 'eb-resena.css')), read(os.path.join(SRC, 'eb-resena.js'))
    v = hashlib.sha1((css + js).encode()).hexdigest()[:12]
    page = read(os.path.join(SRC, 'page.html'))
    if YT:  # el enlace del vídeo ya apunta al vídeo, también sin JavaScript
        page = page.replace(f'href="{YT_CANAL}"', f'href="https://www.youtube.com/watch?v={YT}"', 1)
    routing = read(os.path.join(SITE, 'provider-routing-data.json')).strip()
    page = (fill(page).replace('<!--SITE_CSS-->', SITE_CSS + '<style>' + read(os.path.join(SITE, 'chrome_inline.css')).strip() + '</style>')
            .replace('<!--SITE_JS-->', SITE_JS)
            .replace('<!--JSONLD-->', jsonld() + f'<script id="provider-routing-data" type="application/json">{routing}</script>')
            .replace('<!--HEADER-->', read(os.path.join(SITE, 'header.html')))
            .replace('<!--FOOTER-->', read(os.path.join(SITE, 'footer.html')) + read(os.path.join(SITE, 'cookie.html')))
            .replace('{{A}}', PROD_A).replace('{{V}}', v)
            .replace('{{SALIR}}', SALIR).replace('{{YT_ID}}', YT))
    assert '{{' not in page, re.findall(r'\{\{[^}]*\}\}', page)[:3]
    out = os.path.join(HERE, 'dist')
    shutil.rmtree(out, ignore_errors=True)
    pdir = os.path.join(out, 'es', 'blog', 'ebiblio-resena'); adir = os.path.join(out, PROD_A.strip('/'))
    os.makedirs(pdir); os.makedirs(adir)
    open(os.path.join(pdir, 'index.html'), 'w', encoding='utf-8').write(page)
    open(os.path.join(adir, 'eb-resena.css'), 'w', encoding='utf-8').write(css)
    open(os.path.join(adir, 'eb-resena.js'), 'w', encoding='utf-8').write(js)
    copy_media(os.path.join(adir, 'media'))
    print('producción →', os.path.relpath(out, ROOT), f'(v={v})')


def build_preview():
    """Página para el Artifact: sin <html>/<head>/<body>, con CSS y JS en línea y rutas relativas."""
    page = read(os.path.join(SRC, 'page.html'))
    body = page.split('<body class="inner-page eb-page">', 1)[1].rsplit('</body>', 1)[0]
    header = read(os.path.join(SITE, 'header.html'))
    header = re.sub(r'<details class="sb-search">.*?</details>', '', header, flags=re.S)  # sin buscador (formulario a otra web)
    body = (fill(body, 'https://sonorbooks.com').replace('<!--HEADER-->', header).replace('<!--FOOTER-->', read(os.path.join(SITE, 'footer.html')))
            .replace('{{A}}', '.').replace('{{YT_ID}}', '')
            .replace('{{SALIR}}', 'https://sonorbooks.com' + SALIR))
    # imágenes del sitio → copias locales si las tenemos; si no, las de producción
    body = body.replace('src="/assets/brand/', 'src="./site/')
    # (las que no tenemos en local se ven como «Imagen del blog» en la vista previa)
    body = re.sub(r'/assets/blog/editorial/([\w.-]+)', lambda m: './site/' + (m.group(1) if os.path.exists(os.path.join(SITE, m.group(1))) else '_imagen-del-blog.webp'), body)
    body = re.sub(r'href="/(?!/)', 'href="https://sonorbooks.com/', body)
    body = re.sub(r'<script type="module" src="[^"]*eb-resena\.js[^"]*"></script>', '', body)
    if os.path.exists(VIDEO_PREVIEW):  # el vídeo se ve en la propia página (aún no está en YouTube)
        body = re.sub(r'<a class="eb-video" data-yt="[^"]*".*?</a>',
                      '<div class="eb-video"><video controls playsinline preload="metadata" poster="./media/ebiblio-resena-video.webp" '
                      'src="./media/video/ebiblio-guia.mp4" title="eBiblio: la guía en vídeo de SonorBooks"></video></div>', body, count=1, flags=re.S)
    css = read(os.path.join(SITE, 'chrome.css')) + read(os.path.join(SITE, 'header-layout.css')) + read(os.path.join(SITE, 'chrome_inline.css'))
    css += ('\nhtml{scroll-behavior:smooth}body{margin:0;background:#fff;color:#101010;font-family:"Merriweather",Georgia,serif}'
            'body .sb-footer{margin-top:0}.sb-menu,.sb-account{font-family:"Ubuntu",Arial,sans-serif}'
            '.sb-account{align-self:center}.sb-account a{display:inline-flex;align-items:center}.sb-account .sb-register{height:42px}'
            '@media(max-width:1099px){.sb-toggle{margin-left:auto}}\n')
    css += read(os.path.join(SRC, 'eb-resena.css'))
    head = ('<title>Reseña de eBiblio</title>\n'
            '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
            '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&family=Ubuntu:wght@400;500;700&display=swap">\n'
            f'<style>{css}</style>\n')
    js = read(os.path.join(SRC, 'eb-resena.js'))
    out = os.path.join(HERE, 'preview')
    shutil.rmtree(out, ignore_errors=True)
    os.makedirs(os.path.join(out, 'site'))
    body += f'<script type="module">{js}</script>\n'
    assert '{{' not in body, re.findall(r'\{\{[^}]*\}\}', body)[:3]
    open(os.path.join(out, 'index.html'), 'w', encoding='utf-8').write(head + body)
    copy_media(os.path.join(out, 'media'))
    if os.path.exists(VIDEO_PREVIEW):
        os.makedirs(os.path.join(out, 'media', 'video'))
        shutil.copy(VIDEO_PREVIEW, os.path.join(out, 'media', 'video', 'ebiblio-guia.mp4'))
    for f in os.listdir(SITE):
        if f.endswith(('.png', '.webp')):
            shutil.copy(os.path.join(SITE, f), os.path.join(out, 'site', f))
    print('vista previa →', os.path.relpath(out, ROOT))
    build_mobile(head, body, out)


def build_mobile(head, body, preview_dir):
    """Vista móvil para revisar (otro Artifact): src/movil.html con un teléfono que carga la página a su ancho real."""
    out = os.path.join(HERE, 'preview-movil')
    shutil.rmtree(out, ignore_errors=True)
    shutil.copytree(preview_dir, out)
    os.remove(os.path.join(out, 'index.html'))
    # La página dentro del iframe se sirve tal cual: necesita su propio documento completo.
    doc = ('<!doctype html><html lang="es"><head><meta charset="utf-8">'
           '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
           '<style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style>'
           + head + '</head><body>' + body + '</body></html>')
    open(os.path.join(out, 'pagina.html'), 'w', encoding='utf-8').write(doc)
    shutil.copy(os.path.join(SRC, 'movil.html'), os.path.join(out, 'index.html'))
    print('vista móvil →', os.path.relpath(out, ROOT))


if __name__ == '__main__':
    build_prod()
    build_preview()
