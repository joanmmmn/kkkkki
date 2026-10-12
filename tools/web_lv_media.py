#!/usr/bin/env python3
"""Imágenes de la página de reseña de LibriVox: portadas (dominio público) y capturas de librivox.org con marcas.

Las capturas 4K están en video/public/lv/web (ventana de 1280 px a 3x; originales de tools/lv_capture.mjs); las cajas que se marcan están medidas en
píxeles CSS de esa ventana (video/public/lv/web/boxes.json, tools/lv_boxes.mjs). Cada imagen se recorta, se marca
(recuadro amarillo con borde oscuro y un número) y se guarda en .webp a 1600 px de ancho.

Uso: python3 tools/web_lv_media.py  → web/librivox-resena/media/*.webp y media/portadas/*.webp"""
import json, os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
CAP = os.path.join(ROOT, 'video', 'public', 'lv', 'web')  # las mismas capturas que captures/librivox/web (tools/lv_capture.mjs)
OUT = os.path.join(ROOT, 'web', 'librivox-resena', 'media')
B = json.load(open(os.path.join(ROOT, 'video', 'public', 'lv', 'web', 'boxes.json')))
K = 3  # escala de las capturas
FONT = ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-Bold.otf', 17 * K)
INK, YEL = (16, 16, 16), (255, 203, 6)


def box(key, i=None, field=None):
    v = B[key] if i is None else B[key][i][field]
    return list(v)


def mark(d, b, pad=5, r=10):
    x, y, w, h = b
    xy = [(x - pad) * K, (y - pad) * K, (x + w + pad) * K, (y + h + pad) * K]
    d.rounded_rectangle(xy, radius=r * K, outline=INK, width=5 * K)
    d.rounded_rectangle([xy[0] + K, xy[1] + K, xy[2] - K, xy[3] - K], radius=(r - 1) * K, outline=YEL, width=3 * K)


def highlight(im, b, pad=3):
    """Rotulador amarillo detrás de un texto (multiplica: el fondo claro se vuelve amarillo y la letra sigue oscura)."""
    x, y, w, h = b
    xy = ((x - pad) * K, (y - pad) * K, (x + w + pad) * K, (y + h + pad) * K)
    reg = im.crop(xy)
    ImageDraw.Draw(im)  # noqa
    from PIL import ImageChops
    im.paste(ImageChops.multiply(reg, Image.new('RGB', reg.size, (255, 222, 92))), xy[:2])


def badge(d, n, cx, cy, rad=15):
    d.ellipse([(cx - rad) * K, (cy - rad) * K, (cx + rad) * K, (cy + rad) * K], fill=YEL, outline=INK, width=2 * K)
    d.text((cx * K, cy * K + K), str(n), font=FONT, fill=INK, anchor='mm')


def shot(name, src, crop, marks=(), badges=(), width=1600, hl=()):
    im = Image.open(os.path.join(CAP, src + '.png')).convert('RGB')
    for b in hl:
        highlight(im, b)
    d = ImageDraw.Draw(im)
    for b in marks:
        mark(d, *b) if isinstance(b[0], (list, tuple)) else mark(d, b)
    for n, cx, cy in badges:
        badge(d, n, cx, cy)
    x0, y0, x1, y1 = crop
    im = im.crop((x0 * K, y0 * K, x1 * K, y1 * K))
    h = round(im.height * width / im.width)
    im = im.resize((width, h), Image.LANCZOS)
    path = os.path.join(OUT, name + '.webp')
    im.save(path, 'WEBP', quality=84, method=6)
    print(name, im.size, os.path.getsize(path) // 1024, 'KB')
    return im.size


os.makedirs(os.path.join(OUT, 'portadas'), exist_ok=True)
sizes = {}

# 1. Catálogo por idioma: pestaña «Language» y fila «Spanish»
lt, sp = box('lang:LanguageTab'), box('lang:Spanish')
sizes['librivox-catalogo-por-idioma'] = shot('librivox-catalogo-por-idioma', 'lang', (140, 30, 1140, 690),
    marks=[(lt, 4), (sp, 3)], badges=[(1, lt[0] - 2, lt[1] - 2), (2, sp[0] - 2, sp[1] - 2)])

# 2. Lista en español: filtro «Project type» (solo / group) y la línea «Complete | Solo | Spanish»
pt = box('es_list:Project type'); grp = box('es_list:group')
ptb = [pt[0], pt[1], pt[2], grp[1] + grp[3] - pt[1]]
m0 = box('es_list:items', 0, 'meta'); m0 = [m0[0], m0[1] - 1, 127, m0[3] + 2]
sizes['librivox-lista-en-espanol'] = shot('librivox-lista-en-espanol', 'es_list', (140, 150, 1140, 700),
    hl=[m0], marks=[(ptb, 5)], badges=[(3, ptb[0] - 2, ptb[1] - 2), (4, m0[0] + 222, m0[1] + m0[3] / 2)])

# 3. Búsqueda «quijote»: caja de búsqueda y tipo de cada resultado
qs = box('quijote:search')
q0 = box('quijote:items', 0, 'meta'); q2 = box('quijote:items', 2, 'meta')
q0 = [q0[0], q0[1] - 1, 167, q0[3] + 2]; q2 = [q2[0], q2[1] - 1, 125, q2[3] + 2]
sizes['librivox-busqueda-quijote'] = shot('librivox-busqueda-quijote', 'search_quijote', (140, 36, 1140, 760),
    hl=[q0, q2], marks=[(qs, 4)], badges=[(1, qs[0] - 2, qs[1] - 2), (2, q0[0] + 328, q0[1] + q0[3] / 2), (3, q2[0] + 328, q2[1] + q2[3] / 2)])

# 4. Ficha de las «Leyendas»: escuchar, descargar y quién lee cada capítulo
r1 = B['book:readers'][0]
play, title = r1['play'], box('book:title:Creed en Dios')
reader = [r1['readerBox'][0] - 4, r1['row'][1] + 8, 250, r1['row'][3] - 16]
zipb, rss = box('book:btn:Download'), box('book:btn:RSS')
m4b1, m4b2 = box('book:M4B audio book, part 1'), box('book:M4B audio book, part 2')
m4b = [m4b1[0], m4b1[1], m4b1[2], m4b2[1] + m4b2[3] - m4b1[1]]
notice = box('book:notice')
pd = box('book:Production details'); pq = box('book:Proof Listener:')
prod = [pd[0], pd[1], pd[2], pq[1] + pq[3] - pd[1]]
book_marks = [([play[0] - 4, play[1] - 3, play[2] + 8, play[3] + 6], 4), (title, 4), (reader, 2), (zipb, 4), (rss, 4), (m4b, 4), (notice, 3), (prod, 4)]
book_badges = [(1, play[0] - 10, play[1] - 9), (2, title[0] + title[2] + 16, title[1] + 8), (3, reader[0] - 6, reader[1] - 6),
               (4, zipb[0] + zipb[2] + 16, zipb[1] + 14), (5, rss[0] + rss[2] + 16, rss[1] + 14), (6, m4b[0] + m4b[2] + 16, m4b[1] + 18),
               (7, notice[0] + notice[2] - 4, notice[1] - 4), (8, prod[0] + prod[2] - 4, prod[1] - 4)]
sizes['librivox-ficha-leyendas'] = shot('librivox-ficha-leyendas', 'book', (140, 255, 1130, 1075), marks=book_marks, badges=book_badges)

# 5. Foro: registro y prueba de un minuto
reg, test = box('forum:Register'), box('forum:Post Your 1-Minute Test Recording Here')
sizes['librivox-foro-voluntarios'] = shot('librivox-foro-voluntarios', 'forum', (40, 20, 1240, 480),
    marks=[(reg, 4), (test, 5)], badges=[(1, reg[0] - 6, reg[1] - 6), (2, test[0] + test[2] + 18, test[1] + 8)])

# Portadas de los libros que usa la página (dominio público, de LibriVox): la ficha de la portada y el catálogo recreado
USED = {'5079', '567', '1378', '20198', '3579', '14336', '17676', '16285', '10541', '13208', '13242'}
for f in sorted(os.listdir(os.path.join(ROOT, 'video', 'public', 'lv', 'img'))):
    if f.startswith('cover_') and f[6:].split('.')[0] in USED:
        im = Image.open(os.path.join(ROOT, 'video', 'public', 'lv', 'img', f)).convert('RGB')
        im.save(os.path.join(OUT, 'portadas', f.replace('cover_', '').replace('.jpg', '.webp')), 'WEBP', quality=82, method=6)
json.dump(sizes, open(os.path.join(OUT, 'sizes.json'), 'w'))
