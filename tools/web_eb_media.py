#!/usr/bin/env python3
"""Imágenes de la página de eBiblio: capturas de las páginas públicas de ebiblio.es y eBiblio Madrid (14/10/2026), con
marcas de SonorBooks (recuadro amarillo con borde de tinta y un número), y la fuente Poppins para la página.

Las capturas están en video/public/eb/web (ventana de 1280 px a 3x; tools/eb_capture.mjs); las cajas que se marcan están en
píxeles CSS de esa ventana (video/public/eb/web/boxes.json). Cada imagen se recorta, se marca y se guarda en .webp.

Uso: python3 tools/web_eb_media.py  → web/ebiblio-resena/media/*.webp (+ sizes.json), la imagen para redes, la miniatura del
vídeo y media/fonts/"""
import glob, json, os, shutil
from PIL import Image, ImageChops, ImageDraw, ImageFont

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
CAP = os.path.join(ROOT, 'video', 'public', 'eb', 'web')
OUT = os.path.join(ROOT, 'web', 'ebiblio-resena', 'media')
B = json.load(open(os.path.join(CAP, 'boxes.json')))
K = 3
FONT = ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-Bold.otf', 17 * K)
INK, YEL = (16, 16, 16), (255, 203, 6)


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


os.makedirs(OUT, exist_ok=True)
sizes = {}
com = B['portal:comunidades']
tiles = [min(v[0] for v in com.values()), min(v[1] for v in com.values())]
tiles += [max(v[0] + v[2] for v in com.values()) - tiles[0], max(v[1] + v[3] for v in com.values()) - tiles[1]]
mad = com['eBiblio Madrid']
# 1. ebiblio.es: «eBiblio desde la web», una puerta por comunidad
sizes['ebiblio-comunidades'] = shot('ebiblio-comunidades', 'portal', (0, 975, 1280, 1395), marks=[(mad, 4)])
# 2. Catálogo de eBiblio Madrid: «Audiolibros» (1) y «Títulos disponibles» (2), en el orden en que se marcan
aud, av = [60, 424, 260, 32], [60, 281, 260, 34]
sizes['ebiblio-catalogo-filtros'] = shot('ebiblio-catalogo-filtros', 'maudio', (14, 236, 1240, 700), marks=[(aud, 4), (av, 4)],
                                         badges=[(1, aud[0] - 24, aud[1] + aud[3] / 2), (2, av[0] - 24, av[1] + av[3] / 2)])
# 3. Con «Títulos disponibles»: todos dicen «Prestar»
it = B['mavail:items']
sizes['ebiblio-disponibles'] = shot('ebiblio-disponibles', 'mavail', (40, 236, 1240, 930),
                                    marks=[(it[0]['buttonBox'], 5), (it[1]['buttonBox'], 5), (it[2]['buttonBox'], 5)], hl=[[996, 386, 224, 24]])
# 4-6. Fichas: «Prestar», «Reservar» y sin reservas
sizes['ebiblio-ficha-prestar'] = shot('ebiblio-ficha-prestar', 'rotono', (40, 236, 1240, 640), marks=[(B['rotono:button'], 5)], hl=[[987, 345, 150, 44]])
sizes['ebiblio-ficha-reservar'] = shot('ebiblio-ficha-reservar', 'rcien', (40, 236, 1240, 640), marks=[(B['rcien:button'], 5)], hl=[[985, 306, 160, 46]])
sizes['ebiblio-ficha-sin-reservas'] = shot('ebiblio-ficha-sin-reservas', 'rsapiens', (40, 236, 1240, 640), hl=[[985, 306, 158, 54]])
# 7. Identificación: usuario y contraseña de la biblioteca
ins = B['mlogin:inputs']
sizes['ebiblio-identificacion'] = shot('ebiblio-identificacion', 'mlogin', (330, 186, 950, 720), marks=[([ins[0][0], ins[0][1] - 26, ins[0][2], ins[1][1] + ins[1][3] - ins[0][1] + 26], 6)], width=1000)
# 8. «Mi Cuenta», arriba a la derecha
mc = B['mhome:cuenta']
sizes['ebiblio-mi-cuenta'] = shot('ebiblio-mi-cuenta', 'mhome', (560, 0, 1280, 230), marks=[(mc, 5)], width=1000)
# 9-10. Imagen para redes (1200×630) y miniatura del vídeo en la página (1280×720): la portada del vídeo (EBCover),
# renderizada antes con: cd video && node ../tools/stills.mjs EBCoverOG / EBCover … (→ video/out/eb/cover_og.png, cover_720.png)
VOUT = os.path.join(ROOT, 'video', 'out', 'eb')
if os.path.exists(os.path.join(VOUT, 'cover_og.png')):
    Image.open(os.path.join(VOUT, 'cover_og.png')).convert('RGB').save(os.path.join(OUT, 'ebiblio-resena-og.jpg'), 'JPEG', quality=86, optimize=True, progressive=True)
    Image.open(os.path.join(VOUT, 'cover_720.png')).convert('RGB').save(os.path.join(OUT, 'ebiblio-resena-video.webp'), 'WEBP', quality=84, method=6)
    for n in ('ebiblio-resena-og.jpg', 'ebiblio-resena-video.webp'):
        print(n, os.path.getsize(os.path.join(OUT, n)) // 1024, 'KB')
else:
    print('(sin portadas: renderiza EBCover y EBCoverOG en video/out/eb)')
json.dump(sizes, open(os.path.join(OUT, 'sizes.json'), 'w'), indent=1)

# Poppins (OFL) para los titulares de la página: subconjunto latino de fontsource, como en el vídeo
fd = os.path.join(OUT, 'fonts')
os.makedirs(fd, exist_ok=True)
for wgt in ('600', '700', '800'):
    shutil.copy(os.path.join(ROOT, 'video', 'public', 'fonts', f'Poppins-{wgt}-latin.woff2'), os.path.join(fd, f'poppins-{wgt}-latin.woff2'))
open(os.path.join(fd, 'OFL.txt'), 'w').write('Poppins — Copyright 2020 The Poppins Project Authors (https://github.com/itfoundry/Poppins). SIL Open Font License 1.1: https://openfontlicense.org\n')
print('fuentes →', sorted(os.listdir(fd)))
