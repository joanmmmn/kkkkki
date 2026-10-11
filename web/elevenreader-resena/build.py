#!/usr/bin/env python3
"""Construye la página de reseña de ElevenReader en dos versiones a partir de src/:

  dist/      → para producción (sonorbooks.com). Ver README.md.
               dist/es/blog/elevenreader-resena/index.html
               dist/assets/resenas/elevenreader/{er-resena.css, er-resena.js, media/…}
  preview/   → vista previa privada (Artifact de Claude): una sola página con CSS y JS en línea,
               enlaces absolutos a sonorbooks.com y los archivos de media/ al lado.

Uso: python3 web/elevenreader-resena/build.py [--yt ID_DE_YOUTUBE]
Necesita media/audio/*.mp3 (fragmentos de la app, fuera de git: tools/web_er_audio.py) y la carpeta
site/ con la cabecera y el pie del sitio (descargados de la página actual, ver README)."""
import hashlib, html, json, os, re, shutil, subprocess, sys
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
SRC, MEDIA, SITE = (os.path.join(HERE, d) for d in ('src', 'media', 'site'))
YT = sys.argv[sys.argv.index('--yt') + 1] if '--yt' in sys.argv else ''
PROD_A = '/assets/resenas/elevenreader'
SALIR = '/salir/elevenreader/?market=ES&amp;language=es&amp;to=https%3A%2F%2Felevenreader.io%2F'
CLIP_WORDS = {'hero-sara': 50, 'ab-sara': 33, 'ab-brian': 33}

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


def peaks(mp3, n=64):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', mp3, '-ac', '1', '-ar', '8000', '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    a = np.abs(np.frombuffer(raw, dtype=np.float32))
    b = np.array_split(a, n)
    v = np.array([float(np.sqrt(np.mean(x ** 2))) if len(x) else 0 for x in b])
    v = np.sqrt(v / (v.max() or 1))
    return [round(float(x), 2) for x in v]


def data_json(a):
    t = json.load(open(os.path.join(MEDIA, 'audio', 'timings.json')))
    clips, pk, audio = {}, {}, {}
    for cid, n in CLIP_WORDS.items():
        words = t[cid]['words']
        assert len(words) == n, f'{cid}: {len(words)} palabras con tiempo y {n} en el texto'
        clips[cid] = {'dur': t[cid]['dur'], 'words': [[w[0], w[1]] for w in words]}
        pk[cid] = peaks(os.path.join(MEDIA, 'audio', cid + '.mp3'))
        audio[cid] = f'{a}/media/audio/{cid}.mp3'
    return json.dumps({'clips': clips, 'peaks': pk, 'audio': audio}, separators=(',', ':'))


def jsonld():
    url = 'https://sonorbooks.com/es/blog/elevenreader-resena/'
    faq = re.findall(r'<details><summary>(.*?)<i>.*?</summary><div><p>(.*?)</p></div></details>', read(os.path.join(SRC, 'page.html')))
    strip = lambda s: html.unescape(re.sub(r'<[^>]+>', '', s)).strip()
    graph = [
        {'@type': 'Review', '@id': url + '#review', 'url': url, 'name': 'ElevenReader: opiniones, precio y si merece la pena',
         'image': 'https://sonorbooks.com' + PROD_A + '/media/elevenreader-resena-og.jpg',
         'inLanguage': 'es-ES', 'datePublished': '2026-10-11', 'dateModified': '2026-10-12',
         'author': {'@type': 'Organization', 'name': 'Equipo editorial SonorBooks', 'url': 'https://sonorbooks.com/es/blog/criterios-editoriales/'},
         'publisher': {'@type': 'Organization', 'name': 'SonorBooks', 'url': 'https://sonorbooks.com/es/'},
         'reviewRating': {'@type': 'Rating', 'ratingValue': '8', 'bestRating': '10', 'worstRating': '0'},
         'positiveNotes': {'@type': 'ItemList', 'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'name': n} for i, n in enumerate([
             'Voces muy naturales con las voces recomendadas para español', 'Convierte en audio PDF, EPUB, Word, Markdown, TXT, textos y webs',
             'Importación inteligente que salta cabeceras y números de página', 'Texto y audio sincronizados palabra a palabra'])]},
         'negativeNotes': {'@type': 'ItemList', 'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'name': n} for i, n in enumerate([
             'La web está en inglés', 'Audiolibros prémium con tope de 20 horas al mes', 'Faltan muchos superventas en español',
             'No permite descargar el audio ni compartir la cuenta'])]},
         'itemReviewed': {'@type': 'SoftwareApplication', 'name': 'ElevenReader', 'applicationCategory': 'BookApplication',
                          'operatingSystem': 'Web, iOS, Android', 'url': 'https://elevenreader.io/',
                          'offers': {'@type': 'Offer', 'price': '11', 'priceCurrency': 'USD'}}},
        {'@type': 'BreadcrumbList', 'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': 'https://sonorbooks.com/es/'},
            {'@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': 'https://sonorbooks.com/es/blog/'},
            {'@type': 'ListItem', 'position': 3, 'name': 'Reseñas', 'item': 'https://sonorbooks.com/es/blog/resenas/'},
            {'@type': 'ListItem', 'position': 4, 'name': 'ElevenReader', 'item': url}]},
        {'@type': 'FAQPage', 'mainEntity': [{'@type': 'Question', 'name': strip(q), 'acceptedAnswer': {'@type': 'Answer', 'text': strip(a)}} for q, a in faq]},
    ]
    return '<script type="application/ld+json">' + json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False) + '</script>'


def media_files():
    return sorted(f for f in os.listdir(MEDIA) if os.path.isfile(os.path.join(MEDIA, f)) and not f.startswith('.'))


def build_prod():
    css, js = read(os.path.join(SRC, 'er-resena.css')), read(os.path.join(SRC, 'er-resena.js'))
    v = hashlib.sha1((css + js).encode()).hexdigest()[:12]
    page = read(os.path.join(SRC, 'page.html'))
    routing = read(os.path.join(SITE, 'provider-routing-data.json')).strip()
    page = (page.replace('<!--SITE_CSS-->', SITE_CSS + '<style>' + read(os.path.join(SITE, 'chrome_inline.css')).strip() + '</style>')
            .replace('<!--SITE_JS-->', SITE_JS)
            .replace('<!--JSONLD-->', jsonld() + f'<script id="provider-routing-data" type="application/json">{routing}</script>')
            .replace('<!--HEADER-->', read(os.path.join(SITE, 'header.html')))
            .replace('<!--FOOTER-->', read(os.path.join(SITE, 'footer.html')) + read(os.path.join(SITE, 'cookie.html')))
            .replace('{{DATA}}', data_json(PROD_A)).replace('{{A}}', PROD_A).replace('{{V}}', v)
            .replace('{{SALIR}}', SALIR).replace('{{YT_ID}}', YT))
    out = os.path.join(HERE, 'dist')
    shutil.rmtree(out, ignore_errors=True)
    pdir = os.path.join(out, 'es', 'blog', 'elevenreader-resena'); adir = os.path.join(out, PROD_A.strip('/'))
    os.makedirs(pdir); os.makedirs(os.path.join(adir, 'media', 'audio'))
    open(os.path.join(pdir, 'index.html'), 'w', encoding='utf-8').write(page)
    open(os.path.join(adir, 'er-resena.css'), 'w', encoding='utf-8').write(css)
    open(os.path.join(adir, 'er-resena.js'), 'w', encoding='utf-8').write(js)
    for f in media_files():
        shutil.copy(os.path.join(MEDIA, f), os.path.join(adir, 'media', f))
    for f in CLIP_WORDS:
        shutil.copy(os.path.join(MEDIA, 'audio', f + '.mp3'), os.path.join(adir, 'media', 'audio', f + '.mp3'))
    print('producción →', os.path.relpath(out, ROOT), f'(v={v})')


def build_preview():
    """Página para el Artifact: sin <html>/<head>/<body>, con CSS y JS en línea y rutas relativas."""
    page = read(os.path.join(SRC, 'page.html'))
    body = page.split('<body class="inner-page er-page">', 1)[1].rsplit('</body>', 1)[0]
    header = read(os.path.join(SITE, 'header.html'))
    header = re.sub(r'<details class="sb-search">.*?</details>', '', header, flags=re.S)  # sin buscador (formulario a otra web)
    body = (body.replace('<!--HEADER-->', header).replace('<!--FOOTER-->', read(os.path.join(SITE, 'footer.html')))
            .replace('{{DATA}}', data_json('.')).replace('{{A}}', '.').replace('{{YT_ID}}', '')
            .replace('{{SALIR}}', 'https://sonorbooks.com' + SALIR))
    # enlaces del sitio → absolutos; imágenes del sitio → copias locales
    body = body.replace('src="/assets/brand/', 'src="./site/').replace('src="/assets/blog/editorial/', 'src="./site/')
    body = re.sub(r'href="/(?!/)', 'href="https://sonorbooks.com/', body)
    body = re.sub(r'<script type="module" src="[^"]*er-resena\.js[^"]*"></script>', '', body)
    css = read(os.path.join(SITE, 'chrome.css')) + read(os.path.join(SITE, 'header-layout.css')) + read(os.path.join(SITE, 'chrome_inline.css'))
    css += ('\nhtml{scroll-behavior:smooth}body{margin:0;background:#fff;color:#101010;font-family:"Merriweather",Georgia,serif}'
            'body .sb-footer{margin-top:0}.sb-menu,.sb-account{font-family:"Ubuntu",Arial,sans-serif}'
            '.sb-account{align-self:center}.sb-account a{display:inline-flex;align-items:center}.sb-account .sb-register{height:42px}'
            '@media(max-width:1099px){.sb-toggle{margin-left:auto}}\n')
    css += read(os.path.join(SRC, 'er-resena.css'))
    head = ('<title>Reseña de ElevenReader</title>\n'
            '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
            '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&family=Ubuntu:wght@400;700&display=swap">\n'
            f'<style>{css}</style>\n')
    js = read(os.path.join(SRC, 'er-resena.js'))
    out = os.path.join(HERE, 'preview')
    shutil.rmtree(out, ignore_errors=True)
    os.makedirs(os.path.join(out, 'media', 'audio')); os.makedirs(os.path.join(out, 'site'))
    open(os.path.join(out, 'index.html'), 'w', encoding='utf-8').write(head + body + f'<script type="module">{js}</script>\n')
    for f in media_files():
        shutil.copy(os.path.join(MEDIA, f), os.path.join(out, 'media', f))
    for f in CLIP_WORDS:
        shutil.copy(os.path.join(MEDIA, 'audio', f + '.mp3'), os.path.join(out, 'media', 'audio', f + '.mp3'))
    for f in os.listdir(SITE):
        if f.endswith(('.png', '.webp')):
            shutil.copy(os.path.join(SITE, f), os.path.join(out, 'site', f))
    print('vista previa →', os.path.relpath(out, ROOT))


if __name__ == '__main__':
    build_prod()
    build_preview()
