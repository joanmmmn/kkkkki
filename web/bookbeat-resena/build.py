#!/usr/bin/env python3
"""Construye la página de reseña de BookBeat en tres versiones a partir de src/:

  dist/            → para producción (sonorbooks.com). Ver README.md.
                     dist/es/blog/bookbeat-resena/index.html
                     dist/assets/resenas/bookbeat/{bb-resena.css, bb-resena.js, media/…}
  preview/         → vista previa privada (Artifact de Claude): una sola página con CSS y JS en línea,
                     enlaces absolutos a sonorbooks.com y los archivos de media/ al lado.
  preview-movil/   → visor para revisar la versión móvil (un teléfono con la página dentro).

Uso: python3 web/bookbeat-resena/build.py [--yt ID_DE_YOUTUBE [--yt-fecha AAAA-MM-DD]]
Las capturas de media/ salen de las tomas de la app (tools/web_bkb_media.py). La imagen para redes
(media/bookbeat-resena-og.jpg, 1200×630) y el póster del vídeo (media/bookbeat-resena-video.webp, 1280×720, su miniatura
real) se añaden aparte: si faltan, el script avisa y la vista previa usa un fondo neutro en el vídeo. La carpeta site/ tiene la
cabecera, el pie y los estilos del sitio copiados de la página actual (los mismos que las otras reseñas) y las imágenes del
carrusel para la vista previa. BookBeat no tiene enlace de afiliado en SonorBooks: la página no usa la ruta /salir/ y sus
enlaces a bookbeat.com son directos (sin «sponsored»); el script se para si encuentra alguna de las dos cosas."""
import hashlib, html, json, os, re, shutil, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
SRC, MEDIA, SITE = (os.path.join(HERE, d) for d in ('src', 'media', 'site'))
YT = sys.argv[sys.argv.index('--yt') + 1] if '--yt' in sys.argv else ''
YT_FECHA = sys.argv[sys.argv.index('--yt-fecha') + 1] if '--yt-fecha' in sys.argv else ''  # día de publicación en YouTube
YT_CANAL = 'https://www.youtube.com/@SonorBooksEspa%C3%B1a/videos'
if YT and not re.fullmatch(r'[\w-]{11}', YT):
    sys.exit(f'--yt: «{YT}» no parece un ID de YouTube (11 caracteres, p. ej. dQw4w9WgXcQ)')
if YT_FECHA and not re.fullmatch(r'\d{4}-\d{2}-\d{2}', YT_FECHA):
    sys.exit(f'--yt-fecha: «{YT_FECHA}» debe ser AAAA-MM-DD')
SLUG = 'bookbeat-resena'
PROD_A = '/assets/resenas/bookbeat'
# Página nueva: las dos fechas son provisionales (14/10/2026). PUBLICADA, el día en que se publique por primera vez;
# MODIFICADA, el de la última revisión (ver README.md).
PUBLICADA, MODIFICADA = '2026-10-14', '2026-10-14'
OG, POSTER = 'bookbeat-resena-og.jpg', 'bookbeat-resena-video.webp'

# Las hojas de estilo y los módulos del sitio, con las versiones de la página actual del blog (sin blog.css).
SITE_CSS = ''.join(f'<link rel="stylesheet" href="/assets/{p}">' for p in (
    'replica/fonts.css?v=a9ff3c59b4bb85da', 'styles.css?v=b61bbad688f89ade', 'chrome.css?v=6acbe5725e55051d',
    'cookie-notice.css?v=c1dcc91ebfae56e5', 'header-layout.css?v=f69c0a9cc1af53b3', 'theme.css?v=1f14b7c8389c04a1',
    'alignment.css?v=04565e52bd4e70a8'))
SITE_JS = ('<script type="module" src="/assets/chrome.mjs?v=467bec9dc6f34ed1"></script>'
           '<script type="module" src="/assets/provider-routing.mjs?v=d162434984d092af"></script>'
           '<script type="module" src="/assets/cookie-notice.mjs?v=5563de9897e063db"></script>')
# Póster provisional de la vista previa si aún no está la miniatura real: un fondo neutro, sin texto ni marcas.
POSTER_VACIO = ('data:image/svg+xml,' + re.sub(r'\s+', ' ', """<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1280 720'>
  <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%231a1622'/><stop offset='1' stop-color='%232a2333'/></linearGradient></defs>
  <rect width='1280' height='720' fill='url(%23g)'/></svg>""").strip())


def read(p):
    return open(p, encoding='utf-8').read()


def notes(page, cls):
    """Los puntos de «Lo mejor» (pro) o «Lo peor» (con) tal como salen en la página, para que el JSON-LD no se desfase."""
    pc = re.search(r'<div class="bb-pc">(.*?)</section>', page, re.S).group(1)
    box = re.search(rf'<div class="{cls}">(.*?)</ul>', pc, re.S).group(1)
    items = [html.unescape(re.sub(r'<[^>]+>', '', li)).replace(' ', ' ').strip() for li in re.findall(r'<li>(.*?)</li>', box, re.S)]
    assert items, f'sin puntos en .{cls}'
    return {'@type': 'ItemList', 'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'name': n} for i, n in enumerate(items)]}


def score(page):
    """La nota global que se ve en la página (bloque de la nota final), para el JSON-LD."""
    n = re.search(r'<p class="bb-score__n"><b>([\d,]+)</b>', page).group(1)
    return n.replace(',', '.')


def jsonld():
    url = f'https://sonorbooks.com/es/blog/{SLUG}/'
    page = read(os.path.join(SRC, 'page.html'))
    graph = [
        {'@type': 'Review', '@id': url + '#review', 'url': url, 'name': 'BookBeat: opiniones, precio y si merece la pena',
         'image': 'https://sonorbooks.com' + PROD_A + '/media/' + OG,
         'inLanguage': 'es-ES', 'datePublished': PUBLICADA, 'dateModified': MODIFICADA,
         'author': {'@type': 'Organization', 'name': 'Equipo editorial SonorBooks', 'url': 'https://sonorbooks.com/es/blog/criterios-editoriales/'},
         'publisher': {'@type': 'Organization', 'name': 'SonorBooks', 'url': 'https://sonorbooks.com/es/'},
         'reviewRating': {'@type': 'Rating', 'ratingValue': score(page), 'bestRating': '10', 'worstRating': '0'},
         'positiveNotes': notes(page, 'pro'), 'negativeNotes': notes(page, 'con'),
         'itemReviewed': {'@type': 'SoftwareApplication', 'name': 'BookBeat', 'applicationCategory': 'MultimediaApplication',
                          'operatingSystem': 'iOS, Android', 'url': 'https://www.bookbeat.com/es',
                          # Tres planes: Basic 6,99 €, Standard 9,99 € y Premium 14,99 € al mes
                          'offers': {'@type': 'AggregateOffer', 'lowPrice': '6.99', 'highPrice': '14.99', 'offerCount': '3', 'priceCurrency': 'EUR'}}},
        {'@type': 'BreadcrumbList', 'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': 'https://sonorbooks.com/es/'},
            {'@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': 'https://sonorbooks.com/es/blog/'},
            {'@type': 'ListItem', 'position': 3, 'name': 'Reseña de BookBeat', 'item': url}]},
    ]
    if YT:  # el vídeo, para que Google lo asocie a la página (se carga al pulsar, sin iframe en el HTML)
        import datetime
        from zoneinfo import ZoneInfo
        dia = datetime.date.fromisoformat(YT_FECHA) if YT_FECHA else datetime.date.today()
        subida = datetime.datetime(dia.year, dia.month, dia.day, 12, tzinfo=ZoneInfo('Europe/Madrid')).isoformat()  # +01:00 o +02:00 según el día
        graph.append({'@type': 'VideoObject', '@id': url + '#video', 'name': '¿Merece la pena BookBeat? Opiniones, precio y 30 días gratis',
                      'description': 'Reseña de BookBeat: qué es, precio de Basic, Standard y Premium, cómo se cuentan las horas, la app en inglés, '
                                     'qué hay en español, ebooks, perfiles, dispositivos, opiniones, lo bueno y lo malo, y cómo probarlo 30 días gratis y cancelar.',
                      'thumbnailUrl': [f'https://i.ytimg.com/vi/{YT}/maxresdefault.jpg', 'https://sonorbooks.com' + PROD_A + '/media/' + OG],
                      'uploadDate': subida, 'duration': duracion(), 'inLanguage': 'es-ES',  # lo que dura el montaje (tools/bkb_meta.py)
                      'embedUrl': f'https://www.youtube.com/embed/{YT}',
                      'publisher': {'@type': 'Organization', 'name': 'SonorBooks', 'url': 'https://sonorbooks.com/es/'}})
    return '<script type="application/ld+json">' + json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False) + '</script>'


def duracion():
    """Duración del montaje en ISO 8601, con las mismas cuentas que tools/bkb_meta.py (línea de tiempo del vídeo y locuciones)."""
    sys.path.insert(0, os.path.join(ROOT, 'tools'))
    from bkb_meta import FPS, review_scenes
    _, total, _ = review_scenes()
    seg = round(total / FPS)
    return f'PT{seg // 60}M{seg % 60}S'


def media_files():
    """Solo las imágenes que usa la página (y que existen: la imagen para redes y el póster pueden faltar todavía)."""
    page = read(os.path.join(SRC, 'page.html'))
    files = sorted(f for f in os.listdir(MEDIA) if os.path.isfile(os.path.join(MEDIA, f)) and not f.startswith('.'))
    return [f for f in files if '/media/' + f in page]


def missing():
    """Los archivos que la página espera en media/ y aún no están."""
    page = read(os.path.join(SRC, 'page.html'))
    used = sorted(set(re.findall(r'\{\{A\}\}/media/([\w.-]+)', page)))
    return [f for f in used if not os.path.isfile(os.path.join(MEDIA, f))]


def rules(page, where):
    """Reglas de la página: sin la ruta de afiliado, sin «sponsored» y sin mandar a buscar el libro en SonorBooks."""
    for bad in ('/salir/', 'sponsored', 'busca en SonorBooks', 'Buscar en SonorBooks'):
        assert bad not in page, f'{where}: no puede llevar «{bad}» (BookBeat no tiene afiliado)'


def build_prod():
    css, js = read(os.path.join(SRC, 'bb-resena.css')), read(os.path.join(SRC, 'bb-resena.js'))
    v = hashlib.sha1((css + js).encode()).hexdigest()[:12]
    page = read(os.path.join(SRC, 'page.html'))
    if YT:  # el enlace del vídeo ya apunta al vídeo, también sin JavaScript
        assert f'href="{YT_CANAL}"' in page
        page = page.replace(f'href="{YT_CANAL}"', f'href="https://www.youtube.com/watch?v={YT}"', 1)
    routing = read(os.path.join(SITE, 'provider-routing-data.json')).strip()
    page = (page.replace('<!--SITE_CSS-->', SITE_CSS + '<style>' + read(os.path.join(SITE, 'chrome_inline.css')).strip() + '</style>')
            .replace('<!--SITE_JS-->', SITE_JS)
            .replace('<!--JSONLD-->', jsonld() + f'<script id="provider-routing-data" type="application/json">{routing}</script>')
            .replace('<!--HEADER-->', read(os.path.join(SITE, 'header.html')))
            .replace('<!--FOOTER-->', read(os.path.join(SITE, 'footer.html')) + read(os.path.join(SITE, 'cookie.html')))
            .replace('{{A}}', PROD_A).replace('{{V}}', v).replace('{{YT_ID}}', YT)
            .replace('{{PUBLICADA}}', PUBLICADA).replace('{{MODIFICADA}}', MODIFICADA))
    assert '{{' not in page, 'quedan marcadores sin sustituir'
    rules(page, 'dist')
    rules(js, 'bb-resena.js')
    out = os.path.join(HERE, 'dist')
    shutil.rmtree(out, ignore_errors=True)
    pdir = os.path.join(out, 'es', 'blog', SLUG); adir = os.path.join(out, PROD_A.strip('/'))
    os.makedirs(pdir); os.makedirs(os.path.join(adir, 'media'))
    open(os.path.join(pdir, 'index.html'), 'w', encoding='utf-8').write(page)
    open(os.path.join(adir, 'bb-resena.css'), 'w', encoding='utf-8').write(css)
    open(os.path.join(adir, 'bb-resena.js'), 'w', encoding='utf-8').write(js)
    for f in media_files():
        shutil.copy(os.path.join(MEDIA, f), os.path.join(adir, 'media', f))
    print('producción →', os.path.relpath(out, ROOT), f'(v={v}, {len(media_files())} imágenes)')


def build_preview():
    """Página para el Artifact: sin <html>/<head>/<body>, con CSS y JS en línea y rutas relativas."""
    page = read(os.path.join(SRC, 'page.html'))
    body = page.split('<body class="inner-page bb-page">', 1)[1].rsplit('</body>', 1)[0]
    if POSTER in missing():  # sin la miniatura real, un fondo neutro en su lugar (nunca una miniatura inventada)
        body = (body.replace(f'src="{{{{A}}}}/media/{POSTER}"', f'src="{POSTER_VACIO}"', 1)
                .replace('<a class="bb-video" ', '<a class="bb-video bb-video--empty" ', 1))
    header = read(os.path.join(SITE, 'header.html'))
    header = re.sub(r'<details class="sb-search">.*?</details>', '', header, flags=re.S)  # sin buscador (formulario a otra web)
    body = (body.replace('<!--HEADER-->', header).replace('<!--FOOTER-->', read(os.path.join(SITE, 'footer.html')))
            .replace('{{A}}', '.').replace('{{YT_ID}}', ''))
    # enlaces del sitio → absolutos; imágenes del sitio → copias locales
    body = body.replace('src="/assets/brand/', 'src="./site/').replace('/assets/blog/editorial/', './site/')  # también en srcset
    body = re.sub(r'href="/(?!/)', 'href="https://sonorbooks.com/', body)
    rules(body, 'preview')
    css = read(os.path.join(SITE, 'chrome.css')) + read(os.path.join(SITE, 'header-layout.css')) + read(os.path.join(SITE, 'chrome_inline.css'))
    css += ('\nhtml{scroll-behavior:smooth}body{margin:0;background:#fff;color:#101010;font-family:"Merriweather",Georgia,serif}'
            'body .sb-footer{margin-top:0}.sb-menu,.sb-account{font-family:"Ubuntu",Arial,sans-serif}'
            '.sb-account{align-self:center}.sb-account a{display:inline-flex;align-items:center}.sb-account .sb-register{height:42px}'
            '@media(max-width:1099px){.sb-toggle{margin-left:auto}}\n')
    css += read(os.path.join(SRC, 'bb-resena.css'))
    head = ('<meta charset="utf-8">\n<title>Reseña de BookBeat</title>\n'
            '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
            '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&family=Ubuntu:wght@400;700&display=swap">\n'
            f'<style>{css}</style>\n')
    js = read(os.path.join(SRC, 'bb-resena.js'))
    out = os.path.join(HERE, 'preview')
    shutil.rmtree(out, ignore_errors=True)
    os.makedirs(os.path.join(out, 'media')); os.makedirs(os.path.join(out, 'site'))
    body += f'<script type="module">{js}</script>\n'
    open(os.path.join(out, 'index.html'), 'w', encoding='utf-8').write(head + body)
    for f in media_files():
        shutil.copy(os.path.join(MEDIA, f), os.path.join(out, 'media', f))
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
           + head.replace('<meta charset="utf-8">\n', '') + '</head><body>' + body + '</body></html>')
    open(os.path.join(out, 'pagina.html'), 'w', encoding='utf-8').write(doc)
    shutil.copy(os.path.join(SRC, 'movil.html'), os.path.join(out, 'index.html'))
    print('vista móvil →', os.path.relpath(out, ROOT))


if __name__ == '__main__':
    if YT:
        print('vídeo:', YT, '· duración del montaje', duracion(), '(tools/bkb_meta.py)')
    build_prod()
    build_preview()
    for f in missing():
        que = 'la imagen para redes (1200×630)' if f == OG else 'el póster del vídeo, su miniatura real (1280×720)' if f == POSTER else 'una imagen'
        print(f'aviso: falta media/{f}, {que}. La página la enlaza; añádela antes de publicar'
              + (' (en la vista previa, el vídeo lleva un fondo neutro).' if f == POSTER else '.'))
    if not YT:
        print('aviso: sin --yt, el vídeo de la página enlaza al canal de YouTube; para publicar, '
              'usa --yt ID_DEL_VÍDEO --yt-fecha AAAA-MM-DD')
