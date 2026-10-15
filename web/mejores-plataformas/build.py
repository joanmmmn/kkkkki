#!/usr/bin/env python3
"""Construye la página «Las mejores plataformas de audiolibros en español» a partir de src/:

  dist/            → para producción (sonorbooks.com). Ver README.md.
                     dist/es/blog/mejores-plataformas-audiolibros/index.html
                     dist/assets/blog/mejores-plataformas/{mp-guia.css, mp-guia.js, media/…}
  preview/         → vista previa con los archivos al lado (CSS y JS en línea, enlaces absolutos a sonorbooks.com).
  preview.html     → la misma vista previa en un solo archivo, con fuentes e imágenes en data URI (para el borrador privado).
  preview-movil/   → visor para revisar la versión móvil (un teléfono con la página dentro).

Uso: python3 web/mejores-plataformas/build.py [--yt ID_DE_YOUTUBE [--yt-fecha AAAA-MM-DD]]
Las imágenes de media/ salen de tools/web_mp_media.py (capturas de las reseñas y logotipos) y de tools/web_mp_og.mjs (imagen
para redes y póster del vídeo). La carpeta site/ tiene la cabecera, el pie y los estilos del sitio (los mismos que las reseñas)
y las fuentes de la vista previa.
Afiliados: los botones de Audible, Podimo, Nextory, Audiobooks.com y ElevenReader usan la ruta del sitio ({{SALIR}}…, con
rel="sponsored"); los de Storytel, BookBeat, Spotify, eBiblio, LibriVox y El Libro Total van directos, sin comisión."""
import base64, hashlib, html, json, mimetypes, os, re, shutil, sys

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
SLUG = 'mejores-plataformas-audiolibros'
URL = f'https://sonorbooks.com/es/blog/{SLUG}/'
PROD_A = '/assets/blog/mejores-plataformas'
CSS_N, JS_N, BODY = 'mp-guia.css', 'mp-guia.js', '<body class="inner-page mp-page">'
SALIR = '/salir/'  # prefijo de la ruta de afiliado del sitio
# Página nueva: se publica con el vídeo. Cambia las dos fechas al día en que se publique.
PUBLICADA, MODIFICADA = '2026-10-15', '2026-10-15'
DESCRIPCION = ('Comparamos 11 plataformas de audiolibros en español: precios, horas, pruebas gratis y trucos. '
               'Cuál te conviene según cuánto escuchas, y cuáles son gratis.')
assert len(DESCRIPCION) <= 158, f'meta description de {len(DESCRIPCION)} caracteres'
TITULO = 'Las mejores plataformas de audiolibros en español (2026)'

# Las hojas de estilo y los módulos del sitio, con las versiones de las reseñas (sin blog.css).
SITE_CSS = ''.join(f'<link rel="stylesheet" href="/assets/{p}">' for p in (
    'replica/fonts.css?v=a9ff3c59b4bb85da', 'styles.css?v=b61bbad688f89ade', 'chrome.css?v=6acbe5725e55051d',
    'cookie-notice.css?v=c1dcc91ebfae56e5', 'header-layout.css?v=f69c0a9cc1af53b3', 'theme.css?v=1f14b7c8389c04a1',
    'alignment.css?v=04565e52bd4e70a8'))
SITE_JS = ('<script type="module" src="/assets/chrome.mjs?v=467bec9dc6f34ed1"></script>'
           '<script type="module" src="/assets/provider-routing.mjs?v=d162434984d092af"></script>'
           '<script type="module" src="/assets/cookie-notice.mjs?v=5563de9897e063db"></script>')


def read(p):
    return open(p, encoding='utf-8').read()


def platforms(page):
    """Las 11 fichas tal como salen en la página (id, nombre y web), en su orden, para el ItemList."""
    items = re.findall(r'<article class="mp-plat" id="([\w-]+)" data-name="([^"]+)" data-url="([^"]+)"', page)
    assert len(items) == 11, f'se esperaban 11 plataformas y hay {len(items)}'
    return items


def jsonld(page):
    graph = [
        {'@type': 'Article', '@id': URL + '#article', 'url': URL, 'mainEntityOfPage': URL, 'headline': TITULO,
         'description': DESCRIPCION, 'image': 'https://sonorbooks.com' + PROD_A + '/media/mejores-plataformas-og.jpg',
         'inLanguage': 'es-ES', 'datePublished': PUBLICADA, 'dateModified': MODIFICADA,
         'author': {'@type': 'Organization', 'name': 'Equipo editorial SonorBooks', 'url': 'https://sonorbooks.com/es/blog/criterios-editoriales/'},
         'publisher': {'@type': 'Organization', 'name': 'SonorBooks', 'url': 'https://sonorbooks.com/es/'},
         'mainEntity': {'@id': URL + '#plataformas'}},
        {'@type': 'ItemList', '@id': URL + '#plataformas', 'name': 'Plataformas de audiolibros en español comparadas',
         'numberOfItems': 11, 'itemListOrder': 'https://schema.org/ItemListUnordered',
         'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'name': n, 'url': f'{URL}#{a}'}
                             for i, (a, n, _) in enumerate(platforms(page))]},
        {'@type': 'BreadcrumbList', 'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': 'https://sonorbooks.com/es/'},
            {'@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': 'https://sonorbooks.com/es/blog/'},
            {'@type': 'ListItem', 'position': 3, 'name': 'Mejores plataformas de audiolibros', 'item': URL}]},
    ]
    if YT:  # el vídeo, para que Google lo asocie a la página (se carga al pulsar, sin iframe en el HTML)
        import datetime
        from zoneinfo import ZoneInfo
        dia = datetime.date.fromisoformat(YT_FECHA) if YT_FECHA else datetime.date.today()
        subida = datetime.datetime(dia.year, dia.month, dia.day, 12, tzinfo=ZoneInfo('Europe/Madrid')).isoformat()
        video = {'@type': 'VideoObject', '@id': URL + '#video', 'name': 'Las mejores plataformas de audiolibros en español',
                 'description': 'Las once plataformas de audiolibros en español comparadas: Audible, Storytel, Podimo, Nextory, BookBeat, '
                                'Spotify, Audiobooks.com, ElevenReader, eBiblio, LibriVox y El Libro Total. Cómo cobran, lo mejor de cada '
                                'una, los trucos que valen para todas y cuál te conviene.',
                 'thumbnailUrl': [f'https://i.ytimg.com/vi/{YT}/maxresdefault.jpg', 'https://sonorbooks.com' + PROD_A + '/media/mejores-plataformas-og.jpg'],
                 'uploadDate': subida, 'inLanguage': 'es-ES', 'embedUrl': f'https://www.youtube.com/embed/{YT}',
                 'publisher': {'@type': 'Organization', 'name': 'SonorBooks', 'url': 'https://sonorbooks.com/es/'}}
        if DURACION:
            video['duration'] = DURACION
        graph.append(video)
    return '<script type="application/ld+json">' + json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False) + '</script>'


def duracion():
    """Duración del montaje (composición MPGuide) en ISO 8601, con las cuentas de video/src/scenes/mp/timeline.ts: cada escena
    dura lead + voz + 0,34 s + extra; sin locución grabada, la voz se estima a 13 caracteres/s. Si no se puede leer, None."""
    try:
        v = os.path.join(ROOT, 'video')
        tl = read(os.path.join(v, 'src/scenes/mp/timeline.ts'))
        cfg = json.load(open(os.path.join(v, 'public/mp/vo/vo.json'), encoding='utf-8'))
        text = {s['id']: s['text'] for s in cfg['scenes']}
        fps = 50
        sec = lambda s: round(s * fps)
        total = 0
        for m in re.finditer(r"simple\('(Z\d+)'(?:,\s*(\d+))?(?:,\s*([^,)]+))?", tl):
            id_, extra, lead = m.group(1), int(m.group(2) or 0), m.group(3)
            lead_f = sum(sec(float(x)) for x in re.findall(r'sec\(([\d.]+)\)', lead)) if lead else sec(0.12)
            vo = os.path.join(v, 'public/mp/vo', f'{id_}.json')
            if os.path.exists(vo):
                j = json.load(open(vo, encoding='utf-8'))
                speech = -(-int(j.get('speechEnd', j['duration']) * fps * 1000) // 1000)
            else:
                speech = sec(len(text[id_]) / 13)
            total += lead_f + speech + sec(0.34) + extra
        s = round(total / fps)
        return f'PT{s // 60}M{s % 60}S'
    except Exception as e:  # noqa: BLE001
        print('aviso: no se pudo calcular la duración del vídeo:', e)
        return None


DURACION = duracion() if YT else None


def media_files(page):
    """Solo las imágenes que usa la página (y la de redes, que va en las metaetiquetas)."""
    files = sorted(f for f in os.listdir(MEDIA) if os.path.isfile(os.path.join(MEDIA, f)) and not f.startswith('.'))
    used = [f for f in files if '/media/' + f in page]
    missing = sorted(set(re.findall(r'/media/([\w.-]+\.(?:webp|jpg|png|svg))', page)) - set(files))
    assert not missing, f'la página usa imágenes que no están en media/: {missing}'
    return used


def fill(page):
    return (page.replace('{{URL}}', URL).replace('{{DESCRIPCION}}', html.escape(DESCRIPCION, quote=True))
            .replace('{{PUBLICADA}}', PUBLICADA).replace('{{MODIFICADA}}', MODIFICADA))


def build_prod():
    css, js = read(os.path.join(SRC, CSS_N)), read(os.path.join(SRC, JS_N))
    v = hashlib.sha1((css + js).encode()).hexdigest()[:12]
    page = fill(read(os.path.join(SRC, 'page.html')))
    if YT:  # el enlace del vídeo ya apunta al vídeo, también sin JavaScript
        assert f'href="{YT_CANAL}"' in page
        page = page.replace(f'href="{YT_CANAL}"', f'href="https://www.youtube.com/watch?v={YT}"', 1)
    routing = read(os.path.join(SITE, 'provider-routing-data.json')).strip()
    page = (page.replace('<!--SITE_CSS-->', SITE_CSS + '<style>' + read(os.path.join(SITE, 'chrome_inline.css')).strip() + '</style>')
            .replace('<!--SITE_JS-->', SITE_JS)
            .replace('<!--JSONLD-->', jsonld(page) + f'<script id="provider-routing-data" type="application/json">{routing}</script>')
            .replace('<!--HEADER-->', read(os.path.join(SITE, 'header.html')))
            .replace('<!--FOOTER-->', read(os.path.join(SITE, 'footer.html')) + read(os.path.join(SITE, 'cookie.html')))
            .replace('{{A}}', PROD_A).replace('{{V}}', v).replace('{{SALIR}}', SALIR).replace('{{YT_ID}}', YT))
    assert '{{' not in page, 'quedan marcadores sin sustituir'
    out = os.path.join(HERE, 'dist')
    shutil.rmtree(out, ignore_errors=True)
    pdir = os.path.join(out, 'es', 'blog', SLUG); adir = os.path.join(out, PROD_A.strip('/'))
    os.makedirs(pdir); os.makedirs(os.path.join(adir, 'media'))
    open(os.path.join(pdir, 'index.html'), 'w', encoding='utf-8').write(page)
    open(os.path.join(adir, CSS_N), 'w', encoding='utf-8').write(css)
    open(os.path.join(adir, JS_N), 'w', encoding='utf-8').write(js)
    files = media_files(page) + ['mejores-plataformas-og.jpg']
    for f in sorted(set(files)):
        shutil.copy(os.path.join(MEDIA, f), os.path.join(adir, 'media', f))
    print('producción →', os.path.relpath(out, ROOT), f'(v={v}, {len(set(files))} imágenes)')


def preview_parts():
    """Cabecera (<title> y <style>) y cuerpo de la vista previa, con rutas relativas (./media, ./site)."""
    page = fill(read(os.path.join(SRC, 'page.html')))
    body = page.split(BODY, 1)[1].rsplit('</body>', 1)[0]
    header = read(os.path.join(SITE, 'header.html'))
    header = re.sub(r'<details class="sb-search">.*?</details>', '', header, flags=re.S)  # sin buscador (formulario a otra web)
    body = (body.replace('<!--HEADER-->', header).replace('<!--FOOTER-->', read(os.path.join(SITE, 'footer.html')))
            .replace('{{A}}', '.').replace('{{YT_ID}}', YT).replace('{{SALIR}}', 'https://sonorbooks.com' + SALIR))
    body = body.replace('src="/assets/brand/', 'src="./site/')
    body = re.sub(r'href="/(?!/)', 'href="https://sonorbooks.com/', body)  # enlaces del sitio → absolutos
    fonts = ''.join(f'@font-face{{font-family:"{fam}";font-style:{st};font-weight:{w};font-display:swap;src:url(./site/fonts/{f}) format("woff2")}}'
                    for fam, st, w, f in (('Merriweather', 'normal', '400 700', 'merriweather-latin.woff2'),
                                          ('Merriweather', 'italic', '400', 'merriweather-italic-latin.woff2'),
                                          ('Ubuntu', 'normal', 400, 'ubuntu-400-latin.woff2'), ('Ubuntu', 'normal', 700, 'ubuntu-700-latin.woff2')))
    css = fonts + '\n' + read(os.path.join(SITE, 'chrome.css')) + read(os.path.join(SITE, 'header-layout.css')) + read(os.path.join(SITE, 'chrome_inline.css'))
    css += ('\nhtml{scroll-behavior:smooth}body{margin:0;background:#fff;color:#101010;font-family:"Merriweather",Georgia,serif}'
            'body .sb-footer{margin-top:0}.sb-menu,.sb-account{font-family:"Ubuntu",Arial,sans-serif}'
            '.sb-account{align-self:center}.sb-account a{display:inline-flex;align-items:center}.sb-account .sb-register{height:42px}'
            '@media(max-width:1099px){.sb-toggle{margin-left:auto}}\n'
            '@media (prefers-reduced-motion: reduce){html{scroll-behavior:auto}}\n')
    css += read(os.path.join(SRC, CSS_N))
    head = (f'<title>Mejores plataformas de audiolibros</title>\n<meta name="description" content="{html.escape(DESCRIPCION, quote=True)}">\n'
            f'<style>{css}</style>\n')
    body += f'<script type="module">{read(os.path.join(SRC, JS_N))}</script>\n'
    return head, body


def build_preview():
    head, body = preview_parts()
    out = os.path.join(HERE, 'preview')
    shutil.rmtree(out, ignore_errors=True)
    os.makedirs(os.path.join(out, 'media')); os.makedirs(os.path.join(out, 'site', 'fonts'))
    open(os.path.join(out, 'index.html'), 'w', encoding='utf-8').write('<meta charset="utf-8">\n' + head + body)
    for f in media_files(body):
        shutil.copy(os.path.join(MEDIA, f), os.path.join(out, 'media', f))
    for f in os.listdir(SITE):
        if f.endswith(('.png', '.webp')):
            shutil.copy(os.path.join(SITE, f), os.path.join(out, 'site', f))
    for f in os.listdir(os.path.join(SITE, 'fonts')):
        shutil.copy(os.path.join(SITE, 'fonts', f), os.path.join(out, 'site', 'fonts', f))
    print('vista previa →', os.path.relpath(out, ROOT))
    build_single(head, body)
    build_mobile(head, body, out)


def data_uri(path):
    mime = {'.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2'}.get(os.path.splitext(path)[1]) or mimetypes.guess_type(path)[0]
    return f'data:{mime};base64,' + base64.b64encode(open(path, 'rb').read()).decode()


def build_single(head, body):
    """preview.html: un solo archivo, sin <html>/<head>/<body> (el Artifact los pone), con todo en línea."""
    src = {'media': MEDIA, 'site': SITE}
    def rep(m):
        rel = m.group(1)
        top, rest = rel.split('/', 1)
        return data_uri(os.path.join(src[top], rest))
    doc = '<meta name="claude:viewport-fit-sides" content="cover">\n' + head + body
    doc = re.sub(r'\./((?:media|site)/[\w./-]+\.(?:webp|jpg|png|svg|woff2))', rep, doc)
    assert './media/' not in doc and './site/' not in doc
    p = os.path.join(HERE, 'preview.html')
    open(p, 'w', encoding='utf-8').write(doc)
    mb = os.path.getsize(p) / 1024 / 1024
    assert mb <= 15, f'preview.html pesa {mb:.1f} MB (máximo 15)'
    print(f'vista previa en un archivo → {os.path.relpath(p, ROOT)} ({mb:.2f} MB)')


def build_mobile(head, body, preview_dir):
    """Vista móvil para revisar: src/movil.html con un teléfono que carga la página a su ancho real."""
    out = os.path.join(HERE, 'preview-movil')
    shutil.rmtree(out, ignore_errors=True)
    shutil.copytree(preview_dir, out)
    os.remove(os.path.join(out, 'index.html'))
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
    if not YT:
        print('aviso: sin --yt, el vídeo de la página enlaza al canal de YouTube; para publicar, '
              'usa --yt ID_DEL_VÍDEO --yt-fecha AAAA-MM-DD')
