#!/usr/bin/env python3
"""Construye las ocho guías «Cómo cancelar…» (una por tutorial del canal) a partir de data.py y src/:

  dist/                       → para producción (sonorbooks.com). Ver README.md.
                                dist/es/blog/<slug>/index.html (8 páginas)
                                dist/assets/blog/cancelar/{cs-guia.css, cs-guia.js, media/…}
  preview/<slug>.html         → vista previa de cada guía en un solo archivo (CSS, JS, fuentes e imágenes en línea).

Uso: python3 web/cancelar/build.py [--yt k=ID[,k=ID…]] [--yt-fecha AAAA-MM-DD]
     (k: audible, storytel, spotify, podimo, nextory, bookbeat, audiobooks, ivoox). Sin el ID de su vídeo, el bloque del vídeo
     de cada guía enlaza al canal de YouTube.
Las imágenes de media/ salen de tools/web_cnl_media.py. La carpeta site/ (cabecera, pie, estilos y fuentes del sitio) es la
misma que la de «Las mejores plataformas» y las reseñas. Sin enlaces de afiliado.
"""
import base64, hashlib, html, importlib.util, json, mimetypes, os, re, shutil, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
SRC, MEDIA, SITE = (os.path.join(HERE, d) for d in ('src', 'media', 'site'))
spec = importlib.util.spec_from_file_location('data', os.path.join(HERE, 'data.py'))
D = importlib.util.module_from_spec(spec)
spec.loader.exec_module(D)

YT = {}
if '--yt' in sys.argv:
    for kv in sys.argv[sys.argv.index('--yt') + 1].split(','):
        k, v = kv.split('=')
        assert k in D.PAGES, f'--yt: «{k}» no es una plataforma ({", ".join(D.ORDER)})'
        assert re.fullmatch(r'[\w-]{11}', v), f'--yt: «{v}» no parece un ID de YouTube'
        YT[k] = v
YT_FECHA = sys.argv[sys.argv.index('--yt-fecha') + 1] if '--yt-fecha' in sys.argv else ''
YT_CANAL = 'https://www.youtube.com/@SonorBooksEspa%C3%B1a/videos'
PROD_A = '/assets/blog/cancelar'
CSS_N, JS_N = 'cs-guia.css', 'cs-guia.js'
PUBLICADA = MODIFICADA = D.FECHA  # cambia las dos al día en que se publiquen
SITE_CSS = ''.join(f'<link rel="stylesheet" href="/assets/{p}">' for p in (
    'replica/fonts.css?v=a9ff3c59b4bb85da', 'styles.css?v=b61bbad688f89ade', 'chrome.css?v=6acbe5725e55051d',
    'cookie-notice.css?v=c1dcc91ebfae56e5', 'header-layout.css?v=f69c0a9cc1af53b3', 'theme.css?v=1f14b7c8389c04a1',
    'alignment.css?v=04565e52bd4e70a8'))
SITE_JS = ('<script type="module" src="/assets/chrome.mjs?v=467bec9dc6f34ed1"></script>'
           '<script type="module" src="/assets/provider-routing.mjs?v=d162434984d092af"></script>'
           '<script type="module" src="/assets/cookie-notice.mjs?v=5563de9897e063db"></script>')
ICONS = '''<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
 <symbol id="i-play" viewBox="0 0 24 24"><path d="M7.5 4.8v14.4a.8.8 0 0 0 1.2.7l11.4-7.2a.8.8 0 0 0 0-1.4L8.7 4.1a.8.8 0 0 0-1.2.7z" fill="currentColor"/></symbol>
 <symbol id="i-chev" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
 <symbol id="i-check" viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></symbol>
 <symbol id="i-x" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></symbol>
 <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
 <symbol id="i-phone" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.9"><rect x="6.5" y="2.8" width="11" height="18.4" rx="2.4"/><path d="M10.5 18h3" stroke-linecap="round"/></g></symbol>
 <symbol id="i-globe" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z"/></g></symbol>
</defs></svg>'''
e = lambda s: html.escape(s, quote=False)
ea = lambda s: html.escape(s, quote=True)


def url(k):
    return f'https://sonorbooks.com/es/blog/{D.PAGES[k]["slug"]}/'


def media_size(f):
    from PIL import Image
    with Image.open(os.path.join(MEDIA, f)) as im:
        return im.size


def step_html(i, st):
    img = st.get('img')
    web = img and img[0] == 'web'
    cls = 'cs-step' + (' cs-step--web' if web else '') + ('' if img else ' cs-step--text')
    txt = f'<div class="cs-step__txt"><span class="cs-step__n" aria-hidden="true">{i}</span><h3>{e(st["title"])}</h3><p>{e(st["text"])}</p></div>'
    fig = ''
    if img:
        w, h = media_size(st['file'])
        btn = 'mp-web' if web else 'mp-phone'
        fig = (f'<figure class="mp-shot{" mp-shot--web" if web else ""}"><button class="{btn}" type="button" data-zoom><span class="mp-sr">Ampliar captura: </span>'
               f'<img src="{{{{A}}}}/media/{st["file"]}" width="{w}" height="{h}" alt="{ea(st["alt"])}" loading="lazy" decoding="async"></button></figure>')
    return f'<li class="{cls}">{txt}{fig}</li>'


def page_html(k):
    p = D.PAGES[k]
    steps, last, n = [], None, 0
    for st in p['steps']:
        if st['where'] != last:
            label = 'En la app' if st['where'] == 'app' else 'En su web'
            icon = 'i-phone' if st['where'] == 'app' else 'i-globe'
            steps.append(f'<li class="cs-where" aria-hidden="true"><svg><use href="#{icon}"/></svg>{label}</li>')
            last = st['where']
        n += 1
        steps.append(step_html(n, st))
    quick = ''.join(f'<div><dt>{e(a)}</dt><dd class="cs-dd">{e(b)}</dd></div>' for a, b in p['quick'])
    after = ''.join(f'<li>{e(x)}</li>' for x in p['after'])
    stores_generic = '' if k in ('spotify', 'bookbeat') else (
        '<dl class="cs-stores">' + ''.join(f'<div><dt>{e(a)}</dt><dd>{e(b)}</dd></div>' for a, b in D.TIENDAS) + '</dl>')
    others = ''.join(
        f'<li><a href="/es/blog/{D.PAGES[o]["slug"]}/"><img src="{{{{A}}}}/media/{D.PAGES[o]["logo"][0]}" width="{D.PAGES[o]["logo"][1]}" height="{D.PAGES[o]["logo"][2]}" alt="">'
        f'Cómo cancelar {e(D.PAGES[o]["name"])}</a></li>' for o in D.ORDER if o != k)
    src = ' · '.join(f'<a href="{ea(D.SRC[s][1])}" target="_blank" rel="noopener noreferrer">{e(D.SRC[s][0])}</a>' for s in p['sources'])
    if k == 'audible':
        metodo = ('Nuestra cuenta de Audible ya estaba cancelada desde la reseña (octubre de 2026): las pantallas de la app y de la cuenta son '
                  'nuestras, y los pasos de la web son los de la ayuda oficial de Audible, consultada el 26 de octubre de 2026.')
    elif k in ('spotify', 'audiobooks'):
        metodo = (f'Cancelamos de verdad nuestra suscripción de prueba de {p["name"]} en su web, en el ordenador, el 26 de octubre de 2026, y '
                  'contrastamos cada paso y lo que pasa después con su ayuda oficial.')
    elif k == 'ivoox':
        metodo = ('Cancelamos de verdad nuestra suscripción de iVoox Premium el 26 de octubre de 2026, sin salir de su app de Android, y '
                  'contrastamos cada paso y lo que pasa después con su ayuda oficial.')
    else:
        metodo = (f'Cancelamos de verdad nuestra suscripción de prueba de {p["name"]} el 26 de octubre de 2026, en su app de Android y en su web, y '
                  'contrastamos cada paso y lo que pasa después con su ayuda oficial.')
    yt = YT.get(k, '')
    vid_title = f'Cómo cancelar {p["name"]}'
    lg = p['logo']
    return f'''<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(p["title"])} | SonorBooks</title>
<meta name="description" content="{ea(p["desc"])}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="{url(k)}">
<link rel="alternate" hreflang="es-ES" href="{url(k)}">
<meta property="og:site_name" content="SonorBooks"><meta property="og:type" content="article">
<meta property="og:title" content="{ea(p["title"])}">
<meta property="og:description" content="{ea(p["desc"])}">
<meta property="og:url" content="{url(k)}"><meta property="og:locale" content="es_ES">
<meta property="og:image" content="https://sonorbooks.com{{{{A}}}}/media/{p["slug"]}-og.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Cómo cancelar {ea(p["name"])}, paso a paso: SonorBooks">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="https://sonorbooks.com{{{{A}}}}/media/{p["slug"]}-og.jpg">
<meta property="article:published_time" content="{PUBLICADA}"><meta property="article:modified_time" content="{MODIFICADA}">
<link rel="icon" href="/assets/favicon.png" type="image/png" sizes="192x192"><meta name="theme-color" content="#101010">
<!--SITE_CSS-->
<link rel="stylesheet" href="{{{{A}}}}/{CSS_N}?v={{{{V}}}}">
<!--SITE_JS-->
<script type="module" src="{{{{A}}}}/{JS_N}?v={{{{V}}}}"></script>
<!--JSONLD-->
</head><body class="inner-page mp-page">
<!--HEADER-->
{ICONS}
<main id="main" class="mp">
<article class="mp-guide" aria-labelledby="cs-title">
<header class="mp-hero">
 <div class="mp-wrap">
  <nav class="mp-crumbs" aria-label="Ruta de navegación"><a href="/es/">Inicio</a><svg aria-hidden="true"><use href="#i-chev"/></svg><a href="/es/blog/">Blog</a><svg aria-hidden="true"><use href="#i-chev"/></svg><span aria-current="page">Cómo cancelar {e(p["name"])}</span></nav>
  <div class="mp-hero__grid">
   <div class="mp-hero__copy">
    <img class="cs-logo" src="{{{{A}}}}/media/{lg[0]}" width="{lg[1]}" height="{lg[2]}" alt="{ea(p["name"].split(" ")[0])}">
    <h1 class="mp-h1" id="cs-title">{p["h1"]} <span class="mp-h1__y">(2026)</span></h1>
    <p class="mp-deck">{e(p["deck"])}</p>
    <p class="cs-checked"><svg aria-hidden="true"><use href="#i-check"/></svg><span>Cancelación real, comprobada el <time datetime="{D.FECHA}">{D.FECHA_TXT}</time></span></p>
   </div>
   <section class="mp-quick" aria-labelledby="h-quick">
    <h2 class="mp-quick__h" id="h-quick">La respuesta rápida</h2>
    <dl class="mp-quick__list">{quick}</dl>
   </section>
  </div>
 </div>
</header>
<div class="mp-main">
 <section class="mp-sec mp-sec--first" id="video" aria-labelledby="h-video">
  <div class="mp-col"><h2 class="mp-h2" id="h-video">El tutorial en vídeo</h2></div>
  <div class="mp-wide">
   <a class="mp-video" data-yt="{yt}" data-title="{ea(vid_title)}" href="{f"https://www.youtube.com/watch?v={yt}" if yt else YT_CANAL}" target="_blank" rel="noopener noreferrer" aria-label="Ver «{ea(vid_title)}» en YouTube (se abre en otra pestaña)">
    <img src="{{{{A}}}}/media/{p["slug"]}-video.webp" width="1280" height="720" alt="{ea(vid_title)}: el tutorial en vídeo de SonorBooks" loading="lazy" decoding="async">
    <span class="mp-video__play" aria-hidden="true"><svg><use href="#i-play"/></svg></span>
   </a>
  </div>
 </section>
 <section class="mp-sec" id="paso-a-paso" aria-labelledby="h-pasos">
  <div class="mp-col mp-prose"><h2 class="mp-h2" id="h-pasos">Paso a paso, con capturas</h2><p>Estas son las pantallas de nuestra cancelación, en orden. Toca una captura para verla en grande; hemos tapado los datos personales.</p></div>
  <div class="mp-wide"><ol class="cs-steps">{"".join(steps)}</ol></div>
 </section>
 <section class="mp-sec" id="que-pasa" aria-labelledby="h-despues">
  <div class="mp-col mp-prose"><h2 class="mp-h2" id="h-despues">Qué pasa cuando cancelas</h2><ul class="cs-list">{after}</ul></div>
 </section>
 <section class="mp-sec" id="tienda" aria-labelledby="h-tienda">
  <div class="mp-col mp-prose"><h2 class="mp-h2" id="h-tienda">Si pagas por la tienda o por otra empresa</h2><p>{e(p["stores"])}</p>{stores_generic}<p>Y recuerda: borrar la app no cancela la suscripción.</p></div>
 </section>
 <section class="mp-sec" id="otras" aria-labelledby="h-otras">
  <div class="mp-col mp-prose"><h2 class="mp-h2" id="h-otras">Cómo cancelar otras plataformas</h2><p><a class="cs-review" href="{p["review"]}">Reseña completa de {e(p["name"].split(" ")[0])}<svg aria-hidden="true"><use href="#i-arrow"/></svg></a></p></div>
  <div class="mp-wide"><ul class="cs-others">{others}</ul></div>
 </section>
 <section class="mp-method" id="como-lo-comprobamos" aria-labelledby="h-metodo">
  <div class="mp-col">
   <h2 class="mp-method__h" id="h-metodo">Cómo lo comprobamos</h2>
   <p>{e(metodo)} En las capturas hemos tapado los datos personales (nombre, correo y tarjeta).</p>
   <p class="mp-method__src"><span>Fuentes:</span> {src} · <a href="/es/blog/criterios-editoriales/">cómo hacemos las reseñas</a></p>
   <p class="mp-method__aff">Esta guía no tiene enlaces de afiliado. Las marcas y las capturas de {e(p["name"].split(" ")[0])} son de sus dueños y se usan para explicar cómo cancelar.</p>
   <p class="mp-method__date">Comprobado el <time datetime="{D.FECHA}">{D.FECHA_TXT}</time>.</p>
  </div>
 </section>
</div>
</article>
<dialog class="mp-lightbox" data-lightbox aria-label="Captura ampliada"><button type="button" data-lightbox-close aria-label="Cerrar"><svg aria-hidden="true"><use href="#i-x"/></svg></button><p></p></dialog>
</main>
<!--FOOTER-->
</body></html>
'''


def jsonld(k):
    p = D.PAGES[k]
    u = url(k)
    img = 'https://sonorbooks.com' + PROD_A + f'/media/{p["slug"]}-og.jpg'
    steps = []
    for st in p['steps']:
        s = {'@type': 'HowToStep', 'name': st['title'], 'text': st['text']}
        if 'img' in st:
            s['image'] = 'https://sonorbooks.com' + PROD_A + '/media/' + st['file']
        steps.append(s)
    graph = [
        {'@type': 'Article', '@id': u + '#article', 'url': u, 'mainEntityOfPage': u, 'headline': p['title'], 'description': p['desc'], 'image': img,
         'inLanguage': 'es-ES', 'datePublished': PUBLICADA, 'dateModified': MODIFICADA,
         'author': {'@type': 'Organization', 'name': 'Equipo editorial SonorBooks', 'url': 'https://sonorbooks.com/es/blog/criterios-editoriales/'},
         'publisher': {'@type': 'Organization', 'name': 'SonorBooks', 'url': 'https://sonorbooks.com/es/'}},
        {'@type': 'HowTo', '@id': u + '#pasos', 'name': f'Cómo cancelar {p["name"]}', 'inLanguage': 'es-ES', 'image': img, 'step': steps},
        {'@type': 'BreadcrumbList', 'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': 'https://sonorbooks.com/es/'},
            {'@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': 'https://sonorbooks.com/es/blog/'},
            {'@type': 'ListItem', 'position': 3, 'name': f'Cómo cancelar {p["name"]}', 'item': u}]},
    ]
    if YT.get(k):
        import datetime
        from zoneinfo import ZoneInfo
        dia = datetime.date.fromisoformat(YT_FECHA) if YT_FECHA else datetime.date.today()
        graph.append({'@type': 'VideoObject', '@id': u + '#video', 'name': f'Cómo cancelar {p["name"]}', 'description': p['desc'],
                      'thumbnailUrl': [f'https://i.ytimg.com/vi/{YT[k]}/maxresdefault.jpg', img],
                      'uploadDate': datetime.datetime(dia.year, dia.month, dia.day, 12, tzinfo=ZoneInfo('Europe/Madrid')).isoformat(),
                      'inLanguage': 'es-ES', 'embedUrl': f'https://www.youtube.com/embed/{YT[k]}',
                      'publisher': {'@type': 'Organization', 'name': 'SonorBooks', 'url': 'https://sonorbooks.com/es/'}})
    return '<script type="application/ld+json">' + json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False) + '</script>'


def read(p):
    return open(p, encoding='utf-8').read()


def used_media(page):
    files = re.findall(r'/media/([\w.-]+\.(?:webp|jpg|png|svg))', page)
    missing = sorted(set(files) - set(os.listdir(MEDIA)))
    assert not missing, f'faltan imágenes en media/: {missing}'
    return sorted(set(files))


def build():
    css, js = read(os.path.join(SRC, CSS_N)), read(os.path.join(SRC, JS_N))
    v = hashlib.sha1((css + js).encode()).hexdigest()[:12]
    out = os.path.join(HERE, 'dist')
    shutil.rmtree(out, ignore_errors=True)
    adir = os.path.join(out, PROD_A.strip('/'))
    os.makedirs(os.path.join(adir, 'media'))
    open(os.path.join(adir, CSS_N), 'w', encoding='utf-8').write(css)
    open(os.path.join(adir, JS_N), 'w', encoding='utf-8').write(js)
    prev = os.path.join(HERE, 'preview')
    shutil.rmtree(prev, ignore_errors=True)
    os.makedirs(prev)
    allmedia = set()
    for k in D.ORDER:
        src = page_html(k)
        assert len(D.PAGES[k]['desc']) <= 158
        page = (src.replace('<!--SITE_CSS-->', SITE_CSS + '<style>' + read(os.path.join(SITE, 'chrome_inline.css')).strip() + '</style>')
                .replace('<!--SITE_JS-->', SITE_JS).replace('<!--JSONLD-->', jsonld(k))
                .replace('<!--HEADER-->', read(os.path.join(SITE, 'header.html')))
                .replace('<!--FOOTER-->', read(os.path.join(SITE, 'footer.html')) + read(os.path.join(SITE, 'cookie.html')))
                .replace('{{A}}', PROD_A).replace('{{V}}', v))
        assert '{{' not in page, 'quedan marcadores sin sustituir'
        files = used_media(page) + [f'{D.PAGES[k]["slug"]}-og.jpg']
        allmedia.update(files)
        pdir = os.path.join(out, 'es', 'blog', D.PAGES[k]['slug'])
        os.makedirs(pdir)
        open(os.path.join(pdir, 'index.html'), 'w', encoding='utf-8').write(page)
        build_preview(k, src, css, js)
    for f in sorted(allmedia):
        if os.path.exists(os.path.join(MEDIA, f)):
            shutil.copy(os.path.join(MEDIA, f), os.path.join(adir, 'media', f))
        else:
            print('aviso: falta', f)
    print('producción →', os.path.relpath(out, ROOT), f'(8 guías, v={v}, {len(allmedia)} imágenes)')
    print('vistas previas →', os.path.relpath(prev, ROOT))
    if len(YT) < 8:
        print('aviso: sin --yt para', ', '.join(k for k in D.ORDER if k not in YT), '→ el vídeo enlaza al canal')


def data_uri(path):
    mime = {'.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2'}.get(os.path.splitext(path)[1]) or mimetypes.guess_type(path)[0]
    return f'data:{mime};base64,' + base64.b64encode(open(path, 'rb').read()).decode()


def build_preview(k, src, css, js):
    body = src.split('<body class="inner-page mp-page">', 1)[1].rsplit('</body>', 1)[0]
    header = re.sub(r'<details class="sb-search">.*?</details>', '', read(os.path.join(SITE, 'header.html')), flags=re.S)
    body = body.replace('<!--HEADER-->', header).replace('<!--FOOTER-->', read(os.path.join(SITE, 'footer.html')))
    body = body.replace('src="/assets/brand/', 'src="./site/')
    body = re.sub(r'href="/(?!/)', 'href="https://sonorbooks.com/', body)
    fonts = ''.join(f'@font-face{{font-family:"{fam}";font-style:{st};font-weight:{w};font-display:swap;src:url(./site/fonts/{f}) format("woff2")}}'
                    for fam, st, w, f in (('Merriweather', 'normal', '400 700', 'merriweather-latin.woff2'), ('Merriweather', 'italic', '400', 'merriweather-italic-latin.woff2'),
                                          ('Ubuntu', 'normal', 400, 'ubuntu-400-latin.woff2'), ('Ubuntu', 'normal', 700, 'ubuntu-700-latin.woff2')))
    allcss = fonts + read(os.path.join(SITE, 'chrome.css')) + read(os.path.join(SITE, 'header-layout.css')) + read(os.path.join(SITE, 'chrome_inline.css'))
    allcss += ('\nhtml{scroll-behavior:smooth}body{margin:0;background:#fff;color:#101010;font-family:"Merriweather",Georgia,serif}'
               'body .sb-footer{margin-top:0}.sb-menu,.sb-account{font-family:"Ubuntu",Arial,sans-serif}\n') + css
    doc = (f'<meta name="claude:viewport-fit-sides" content="cover">\n<title>Cómo cancelar {e(D.PAGES[k]["name"])}</title>\n'
           f'<style>{allcss}</style>\n{body}<script type="module">{js}</script>\n').replace('{{A}}', '.')
    srcs = {'media': MEDIA, 'site': SITE}
    doc = re.sub(r'\./((?:media|site)/[\w./-]+\.(?:webp|jpg|png|svg|woff2))',
                 lambda m: data_uri(os.path.join(srcs[m.group(1).split('/', 1)[0]], m.group(1).split('/', 1)[1])) if os.path.exists(os.path.join(srcs[m.group(1).split('/', 1)[0]], m.group(1).split('/', 1)[1])) else m.group(0), doc)
    open(os.path.join(HERE, 'preview', f'{D.PAGES[k]["slug"]}.html'), 'w', encoding='utf-8').write(doc)


if __name__ == '__main__':
    build()
