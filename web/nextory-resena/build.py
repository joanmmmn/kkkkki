#!/usr/bin/env python3
"""Construye la página de reseña de Nextory en tres versiones a partir de src/:

  dist/            → para producción (sonorbooks.com). Ver README.md.
                     dist/es/blog/nextory-resena/index.html
                     dist/assets/resenas/nextory/{nx-resena.css, nx-resena.js, media/…}
  preview/         → vista previa privada (Artifact de Claude): una sola página con CSS y JS en línea,
                     enlaces absolutos a sonorbooks.com y los archivos de media/ al lado.
  preview-movil/   → visor para revisar la versión móvil (un teléfono con la página dentro).

Uso: python3 web/nextory-resena/build.py [--yt ID_DE_YOUTUBE [--yt-fecha AAAA-MM-DD]]
Las capturas de media/ salen de las grabaciones de la app (tools/web_nx_media.py); la carpeta site/ tiene la
cabecera, el pie y los estilos del sitio copiados de la página actual (los mismos que la reseña de ElevenReader)."""
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
SLUG = 'nextory-resena'
PROD_A = '/assets/resenas/nextory'
SALIR = '/salir/nextory/?market=ES&amp;language=es&amp;to=https%3A%2F%2Fnextory.com%2Fes'

# Las hojas de estilo y los módulos del sitio, con las versiones de la página actual del blog (sin blog.css).
SITE_CSS = ''.join(f'<link rel="stylesheet" href="/assets/{p}">' for p in (
    'replica/fonts.css?v=a9ff3c59b4bb85da', 'styles.css?v=b61bbad688f89ade', 'chrome.css?v=6acbe5725e55051d',
    'cookie-notice.css?v=c1dcc91ebfae56e5', 'header-layout.css?v=f69c0a9cc1af53b3', 'theme.css?v=1f14b7c8389c04a1',
    'alignment.css?v=04565e52bd4e70a8'))
SITE_JS = ('<script type="module" src="/assets/chrome.mjs?v=467bec9dc6f34ed1"></script>'
           '<script type="module" src="/assets/provider-routing.mjs?v=d162434984d092af"></script>'
           '<script type="module" src="/assets/cookie-notice.mjs?v=5563de9897e063db"></script>')


def read(p):
    return open(p, encoding='utf-8').read()


def notes(page, cls):
    """Los puntos de «Lo mejor» (pro) o «Lo peor» (con) tal como salen en la página, para que el JSON-LD no se desfase."""
    pc = re.search(r'<div class="nx-pc">(.*?)</section>', page, re.S).group(1)
    box = re.search(rf'<div class="{cls}">(.*?)</ul>', pc, re.S).group(1)
    items = [html.unescape(re.sub(r'<[^>]+>', '', li)).replace('\u00a0', ' ').strip() for li in re.findall(r'<li>(.*?)</li>', box, re.S)]
    assert items, f'sin puntos en .{cls}'
    return {'@type': 'ItemList', 'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'name': n} for i, n in enumerate(items)]}


def jsonld():
    url = f'https://sonorbooks.com/es/blog/{SLUG}/'
    page = read(os.path.join(SRC, 'page.html'))
    graph = [
        {'@type': 'Review', '@id': url + '#review', 'url': url, 'name': 'Nextory: opiniones, precio y si merece la pena',
         'image': 'https://sonorbooks.com' + PROD_A + '/media/nextory-resena-og.jpg',
         'inLanguage': 'es-ES', 'datePublished': '2026-10-12', 'dateModified': '2026-10-12',
         'author': {'@type': 'Organization', 'name': 'Equipo editorial SonorBooks', 'url': 'https://sonorbooks.com/es/blog/criterios-editoriales/'},
         'publisher': {'@type': 'Organization', 'name': 'SonorBooks', 'url': 'https://sonorbooks.com/es/'},
         'reviewRating': {'@type': 'Rating', 'ratingValue': '8', 'bestRating': '10', 'worstRating': '0'},
         'positiveNotes': notes(page, 'pro'), 'negativeNotes': notes(page, 'con'),
         'itemReviewed': {'@type': 'SoftwareApplication', 'name': 'Nextory', 'applicationCategory': 'BookApplication',
                          'operatingSystem': 'iOS, Android', 'url': 'https://nextory.com/es',
                          'offers': {'@type': 'Offer', 'price': '5.99', 'priceCurrency': 'EUR'}}},
        {'@type': 'BreadcrumbList', 'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': 'https://sonorbooks.com/es/'},
            {'@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': 'https://sonorbooks.com/es/blog/'},
            {'@type': 'ListItem', 'position': 3, 'name': 'Reseñas', 'item': 'https://sonorbooks.com/es/blog/resenas/'},
            {'@type': 'ListItem', 'position': 4, 'name': 'Nextory', 'item': url}]},
    ]
    if YT:  # el vídeo, para que Google lo asocie a la página (se carga al pulsar, sin iframe en el HTML)
        import datetime
        from zoneinfo import ZoneInfo
        dia = datetime.date.fromisoformat(YT_FECHA) if YT_FECHA else datetime.date.today()
        subida = datetime.datetime(dia.year, dia.month, dia.day, 12, tzinfo=ZoneInfo('Europe/Madrid')).isoformat()  # +01:00 o +02:00 según el día
        graph.append({'@type': 'VideoObject', '@id': url + '#video', 'name': '¿Merece la pena Nextory? Reseña a fondo: lo bueno, lo malo y 30 días gratis',
                      'description': 'Reseña de Nextory: catálogo en español, planes y horas, El Librarian, el lector, el reproductor, '
                                     'perfiles, dispositivos, lo bueno y lo malo, y cómo probarlo 30 días gratis en vez de 14.',
                      'thumbnailUrl': [f'https://i.ytimg.com/vi/{YT}/maxresdefault.jpg', 'https://sonorbooks.com' + PROD_A + '/media/nextory-resena-og.jpg'],
                      'uploadDate': subida, 'duration': 'PT4M29S', 'inLanguage': 'es-ES',  # 4:29, lo que dura el vídeo final
                      'embedUrl': f'https://www.youtube.com/embed/{YT}',
                      'publisher': {'@type': 'Organization', 'name': 'SonorBooks', 'url': 'https://sonorbooks.com/es/'}})
    return '<script type="application/ld+json">' + json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False) + '</script>'


def media_files():
    """Solo las imágenes que usa la página (media/ tiene más capturas de las grabaciones)."""
    page = read(os.path.join(SRC, 'page.html'))
    files = sorted(f for f in os.listdir(MEDIA) if os.path.isfile(os.path.join(MEDIA, f)) and not f.startswith('.'))
    return [f for f in files if '/media/' + f in page]


def build_prod():
    css, js = read(os.path.join(SRC, 'nx-resena.css')), read(os.path.join(SRC, 'nx-resena.js'))
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
            .replace('{{A}}', PROD_A).replace('{{V}}', v).replace('{{SALIR}}', SALIR).replace('{{YT_ID}}', YT))
    assert '{{' not in page, 'quedan marcadores sin sustituir'
    out = os.path.join(HERE, 'dist')
    shutil.rmtree(out, ignore_errors=True)
    pdir = os.path.join(out, 'es', 'blog', SLUG); adir = os.path.join(out, PROD_A.strip('/'))
    os.makedirs(pdir); os.makedirs(os.path.join(adir, 'media'))
    open(os.path.join(pdir, 'index.html'), 'w', encoding='utf-8').write(page)
    open(os.path.join(adir, 'nx-resena.css'), 'w', encoding='utf-8').write(css)
    open(os.path.join(adir, 'nx-resena.js'), 'w', encoding='utf-8').write(js)
    for f in media_files():
        shutil.copy(os.path.join(MEDIA, f), os.path.join(adir, 'media', f))
    print('producción →', os.path.relpath(out, ROOT), f'(v={v})')


def build_preview():
    """Página para el Artifact: sin <html>/<head>/<body>, con CSS y JS en línea y rutas relativas."""
    page = read(os.path.join(SRC, 'page.html'))
    body = page.split('<body class="inner-page nx-page">', 1)[1].rsplit('</body>', 1)[0]
    header = read(os.path.join(SITE, 'header.html'))
    header = re.sub(r'<details class="sb-search">.*?</details>', '', header, flags=re.S)  # sin buscador (formulario a otra web)
    body = (body.replace('<!--HEADER-->', header).replace('<!--FOOTER-->', read(os.path.join(SITE, 'footer.html')))
            .replace('{{A}}', '.').replace('{{YT_ID}}', '').replace('{{SALIR}}', 'https://sonorbooks.com' + SALIR))
    # enlaces del sitio → absolutos; imágenes del sitio → copias locales
    body = body.replace('src="/assets/brand/', 'src="./site/').replace('/assets/blog/editorial/', './site/')  # también en srcset
    body = re.sub(r'href="/(?!/)', 'href="https://sonorbooks.com/', body)
    body = re.sub(r'<script type="module" src="[^"]*nx-resena\.js[^"]*"></script>', '', body)
    css = read(os.path.join(SITE, 'chrome.css')) + read(os.path.join(SITE, 'header-layout.css')) + read(os.path.join(SITE, 'chrome_inline.css'))
    css += ('\nhtml{scroll-behavior:smooth}body{margin:0;background:#fff;color:#101010;font-family:"Merriweather",Georgia,serif}'
            'body .sb-footer{margin-top:0}.sb-menu,.sb-account{font-family:"Ubuntu",Arial,sans-serif}'
            '.sb-account{align-self:center}.sb-account a{display:inline-flex;align-items:center}.sb-account .sb-register{height:42px}'
            '@media(max-width:1099px){.sb-toggle{margin-left:auto}}\n')
    css += read(os.path.join(SRC, 'nx-resena.css'))
    head = ('<meta charset="utf-8">\n<title>Reseña de Nextory</title>\n'
            '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
            '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&family=Ubuntu:wght@400;700&display=swap">\n'
            f'<style>{css}</style>\n')
    js = read(os.path.join(SRC, 'nx-resena.js'))
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
    build_prod()
    build_preview()
    if not YT:
        print('aviso: sin --yt, el vídeo de la página enlaza al canal de YouTube; para publicar, '
              'usa --yt ID_DEL_VÍDEO --yt-fecha AAAA-MM-DD')
