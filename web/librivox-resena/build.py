#!/usr/bin/env python3
"""Construye la página de reseña de LibriVox a partir de src/ (mismo sistema que la de ElevenReader):

  dist/          → para producción (sonorbooks.com). Ver README.md.
                   dist/es/blog/librivox-resena/index.html
                   dist/assets/resenas/librivox/{lv-resena.css, lv-resena.js, media/…}
  preview/       → vista previa privada (Artifact de Claude): una sola página con CSS y JS en línea,
                   enlaces absolutos a sonorbooks.com y los archivos de media/ al lado.
  preview-movil/ → la misma vista previa dentro de un teléfono, para revisar la versión móvil.

Uso: python3 web/librivox-resena/build.py [--yt ID_DE_YOUTUBE [--yt-fecha AAAA-MM-DD]]
Los audios (media/audio) son grabaciones de LibriVox, de dominio público (tools/web_lv_audio.py); las capturas y
portadas salen de tools/web_lv_media.py. site/ tiene la cabecera y el pie del sitio (los mismos que ElevenReader)."""
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
URL = 'https://sonorbooks.com/es/blog/librivox-resena/'
PROD_A = '/assets/resenas/librivox'
# Ruta de salida del sitio (la misma que usa la ficha de LibriVox en la portada); LibriVox no es un enlace de afiliado.
SALIR_TO = lambda dest: '/salir/librivox/?market=ES&amp;language=es&amp;to=' + quote(dest, safe='')
SALIR = SALIR_TO('https://librivox.org/')

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



def words(txt):
    return len(html.unescape(re.sub(r'<[^>]+>', '', txt)).split())


def clips(page):
    """Los audios que usa la página y el número de palabras del texto de cada uno (deben coincidir con los tiempos).
    - data-clip="…" data-text="…": los capítulos de la ficha de la portada
    - data-player="…" … data-words>…</p>: el aviso de LibriVox
    - data-cast-clip="…": el reparto (el mismo audio, sin texto)"""
    out = {}
    for m in re.finditer(r'data-clip="([\w-]+)"[^>]*?data-text="([^"]*)"', page):
        out[m.group(1)] = words(m.group(2))
    for m in re.finditer(r'data-player="([\w-]+)"(.*?)data-words>(.*?)</p>', page, re.S):
        out.setdefault(m.group(1), words(m.group(3)))
    for m in re.finditer(r'data-cast-clip="([\w-]+)"', page):
        assert m.group(1) in out, f'el reparto usa {m.group(1)}, que no está en la portada ni en el aviso'
    # El texto que se ve en la portada antes de pulsar nada es el del capítulo marcado
    act = re.search(r'class="lvx-row is-active"[^>]*?data-text="([^"]*)"', page)
    shown = re.search(r'class="lvx-read__p" data-words>(.*?)</p>', page, re.S)
    assert act and shown and html.unescape(act.group(1)).split() == html.unescape(shown.group(1)).split(), 'el texto de la portada no es el del capítulo marcado'
    return out


def data_json(a, page):
    t = json.load(open(os.path.join(MEDIA, 'audio', 'timings.json'), encoding='utf-8'))
    out, audio = {}, {}
    for cid, n in clips(page).items():
        w = t[cid]['words']
        assert len(w) == n, f'{cid}: {len(w)} palabras con tiempo y {n} en el texto de la página'
        out[cid] = {'dur': t[cid]['dur'], 'words': [[x[0], x[1]] for x in w]}
        audio[cid] = f'{a}/media/audio/{cid}.mp3'
    return json.dumps({'clips': out, 'audio': audio}, separators=(',', ':'))


def jsonld():
    graph = [
        {'@type': 'Review', '@id': URL + '#review', 'url': URL, 'name': 'LibriVox: audiolibros gratis, legales y leídos por personas',
         'image': 'https://sonorbooks.com' + PROD_A + '/media/librivox-resena-og.jpg',
         'inLanguage': 'es-ES', 'datePublished': '2026-10-12', 'dateModified': '2026-10-12',
         'author': {'@type': 'Organization', 'name': 'Equipo editorial SonorBooks', 'url': 'https://sonorbooks.com/es/blog/criterios-editoriales/'},
         'publisher': {'@type': 'Organization', 'name': 'SonorBooks', 'url': 'https://sonorbooks.com/es/'},
         'reviewRating': {'@type': 'Rating', 'ratingValue': '7.5', 'bestRating': '10', 'worstRating': '0'},
         'positiveNotes': {'@type': 'ItemList', 'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'name': n} for i, n in enumerate([
             'Gratis y legal, sin anuncios ni registro', 'Voces humanas', 'MP3 y M4B sin DRM para descargar',
             'Se escucha en la web, en MP3, en ZIP, en M4B o como pódcast', 'Más de 21.000 audiolibros de clásicos'])]},
         'negativeNotes': {'@type': 'ItemList', 'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'name': n} for i, n in enumerate([
             'Solo clásicos de dominio público, sin novedades', 'La calidad de las voces varía', 'La web está en inglés',
             'No hay app oficial', 'Catálogo en español mucho menor que en inglés'])]},
         'itemReviewed': {'@type': 'Organization', 'name': 'LibriVox', 'url': 'https://librivox.org/', 'foundingDate': '2005-08',
                          'description': 'Proyecto sin ánimo de lucro de audiolibros gratuitos de dominio público, leídos por voluntarios.'}},
        {'@type': 'BreadcrumbList', 'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': 'https://sonorbooks.com/es/'},
            {'@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': 'https://sonorbooks.com/es/blog/'},
            {'@type': 'ListItem', 'position': 3, 'name': 'Reseñas', 'item': 'https://sonorbooks.com/es/blog/resenas/'},
            {'@type': 'ListItem', 'position': 4, 'name': 'LibriVox', 'item': URL}]},
    ]
    if YT:  # el vídeo, para que Google lo asocie a la página (se carga al pulsar, sin iframe en el HTML)
        import datetime
        fecha = YT_FECHA or datetime.date.today().isoformat()
        graph.append({'@type': 'VideoObject', '@id': URL + '#video', 'name': 'LibriVox: audiolibros gratis y legales, leídos por personas',
                      'description': 'Qué es LibriVox, por qué es legal, cómo encontrar audiolibros en español, cómo escucharlos y descargarlos '
                                     '(también en el móvil), cómo suenan sus voluntarios, lo mejor y lo peor.',
                      'thumbnailUrl': [f'https://i.ytimg.com/vi/{YT}/maxresdefault.jpg', 'https://sonorbooks.com' + PROD_A + '/media/librivox-resena-og.jpg'],
                      'uploadDate': fecha + 'T12:00:00+02:00', 'duration': VIDEO_DURATION, 'inLanguage': 'es-ES',
                      'embedUrl': f'https://www.youtube.com/embed/{YT}',
                      'publisher': {'@type': 'Organization', 'name': 'SonorBooks', 'url': 'https://sonorbooks.com/es/'}})
    return '<script type="application/ld+json">' + json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False) + '</script>'


VIDEO_DURATION = 'PT4M16S'  # duración del vídeo final (4:16)
# Vídeo ligero (≤ 15 MB) para que la vista previa lo reproduzca sin YouTube; en producción se usa el de YouTube.
VIDEO_PREVIEW = os.path.join(ROOT, 'deliverables', 'librivox', 'SonorBooks_LibriVox_Guia_web.mp4')


def media_files():
    """Todo lo que hay en media/ (subcarpetas incluidas), menos los auxiliares."""
    out = []
    for d, _, fs in os.walk(MEDIA):
        for f in fs:
            if f.startswith('.') or f in ('sizes.json', 'timings.json'):
                continue
            out.append(os.path.relpath(os.path.join(d, f), MEDIA))
    return sorted(out)


def copy_media(dst):
    for f in media_files():
        os.makedirs(os.path.dirname(os.path.join(dst, f)), exist_ok=True)
        shutil.copy(os.path.join(MEDIA, f), os.path.join(dst, f))


def links(page, prefix=''):
    """{{LV:https://librivox.org/…}} → la ruta de salida del sitio hacia esa ficha de LibriVox."""
    return re.sub(r'\{\{LV:(https://librivox\.org/[^}]*)\}\}', lambda m: prefix + SALIR_TO(m.group(1)), page)


def build_prod():
    css, js = read(os.path.join(SRC, 'lv-resena.css')), read(os.path.join(SRC, 'lv-resena.js'))
    v = hashlib.sha1((css + js).encode()).hexdigest()[:12]
    page = read(os.path.join(SRC, 'page.html'))
    if YT:  # el enlace del vídeo ya apunta al vídeo, también sin JavaScript
        page = page.replace(f'href="{YT_CANAL}"', f'href="https://www.youtube.com/watch?v={YT}"', 1)
    routing = read(os.path.join(SITE, 'provider-routing-data.json')).strip()
    data = data_json(PROD_A, page)
    page = (links(page).replace('<!--SITE_CSS-->', SITE_CSS + '<style>' + read(os.path.join(SITE, 'chrome_inline.css')).strip() + '</style>')
            .replace('<!--SITE_JS-->', SITE_JS)
            .replace('<!--JSONLD-->', jsonld() + f'<script id="provider-routing-data" type="application/json">{routing}</script>')
            .replace('<!--HEADER-->', read(os.path.join(SITE, 'header.html')))
            .replace('<!--FOOTER-->', read(os.path.join(SITE, 'footer.html')) + read(os.path.join(SITE, 'cookie.html')))
            .replace('{{DATA}}', data).replace('{{A}}', PROD_A).replace('{{V}}', v)
            .replace('{{SALIR}}', SALIR).replace('{{YT_ID}}', YT))
    assert '{{' not in page, re.findall(r'\{\{[^}]*\}\}', page)[:3]
    out = os.path.join(HERE, 'dist')
    shutil.rmtree(out, ignore_errors=True)
    pdir = os.path.join(out, 'es', 'blog', 'librivox-resena'); adir = os.path.join(out, PROD_A.strip('/'))
    os.makedirs(pdir); os.makedirs(adir)
    open(os.path.join(pdir, 'index.html'), 'w', encoding='utf-8').write(page)
    open(os.path.join(adir, 'lv-resena.css'), 'w', encoding='utf-8').write(css)
    open(os.path.join(adir, 'lv-resena.js'), 'w', encoding='utf-8').write(js)
    copy_media(os.path.join(adir, 'media'))
    print('producción →', os.path.relpath(out, ROOT), f'(v={v})')


def build_preview():
    """Página para el Artifact: sin <html>/<head>/<body>, con CSS y JS en línea y rutas relativas."""
    page = read(os.path.join(SRC, 'page.html'))
    data = data_json('.', page)
    body = page.split('<body class="inner-page lv-page">', 1)[1].rsplit('</body>', 1)[0]
    header = read(os.path.join(SITE, 'header.html'))
    header = re.sub(r'<details class="sb-search">.*?</details>', '', header, flags=re.S)  # sin buscador (formulario a otra web)
    body = (links(body, 'https://sonorbooks.com').replace('<!--HEADER-->', header).replace('<!--FOOTER-->', read(os.path.join(SITE, 'footer.html')))
            .replace('{{DATA}}', data).replace('{{A}}', '.').replace('{{YT_ID}}', '')
            .replace('{{SALIR}}', 'https://sonorbooks.com' + SALIR))
    # imágenes del sitio → copias locales si las tenemos; si no, las de producción
    body = body.replace('src="/assets/brand/', 'src="./site/')
    # (las que no tenemos en local, por ejemplo con la web caída, se ven como «Imagen del blog» en la vista previa)
    body = re.sub(r'/assets/blog/editorial/([\w.-]+)', lambda m: './site/' + (m.group(1) if os.path.exists(os.path.join(SITE, m.group(1))) else '_imagen-del-blog.webp'), body)
    body = re.sub(r'href="/(?!/)', 'href="https://sonorbooks.com/', body)
    body = re.sub(r'<script type="module" src="[^"]*lv-resena\.js[^"]*"></script>', '', body)
    if os.path.exists(VIDEO_PREVIEW):  # el vídeo se ve en la propia página (aún no está en YouTube)
        body = re.sub(r'<a class="lv-video" data-yt="[^"]*".*?</a>',
                      '<div class="lv-video"><video controls playsinline preload="metadata" poster="./media/librivox-resena-video.webp" '
                      'src="./media/video/librivox-guia.mp4" title="LibriVox: la guía en vídeo de SonorBooks"></video></div>', body, count=1, flags=re.S)
    css = read(os.path.join(SITE, 'chrome.css')) + read(os.path.join(SITE, 'header-layout.css')) + read(os.path.join(SITE, 'chrome_inline.css'))
    css += ('\nhtml{scroll-behavior:smooth}body{margin:0;background:#fff;color:#101010;font-family:"Merriweather",Georgia,serif}'
            'body .sb-footer{margin-top:0}.sb-menu,.sb-account{font-family:"Ubuntu",Arial,sans-serif}'
            '.sb-account{align-self:center}.sb-account a{display:inline-flex;align-items:center}.sb-account .sb-register{height:42px}'
            '@media(max-width:1099px){.sb-toggle{margin-left:auto}}\n')
    css += read(os.path.join(SRC, 'lv-resena.css'))
    head = ('<title>Reseña de LibriVox</title>\n'
            '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
            '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&family=Ubuntu:wght@400;500;700&display=swap">\n'
            f'<style>{css}</style>\n')
    js = read(os.path.join(SRC, 'lv-resena.js'))
    out = os.path.join(HERE, 'preview')
    shutil.rmtree(out, ignore_errors=True)
    os.makedirs(os.path.join(out, 'site'))
    body += f'<script type="module">{js}</script>\n'
    assert '{{' not in body, re.findall(r'\{\{[^}]*\}\}', body)[:3]
    open(os.path.join(out, 'index.html'), 'w', encoding='utf-8').write(head + body)
    copy_media(os.path.join(out, 'media'))
    if os.path.exists(VIDEO_PREVIEW):
        os.makedirs(os.path.join(out, 'media', 'video'))
        shutil.copy(VIDEO_PREVIEW, os.path.join(out, 'media', 'video', 'librivox-guia.mp4'))
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
