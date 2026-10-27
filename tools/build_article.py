#!/usr/bin/env python3
"""Monta articulo.html de una reseña a partir de sus piezas y del sistema visual común (.sbx).

Uso: python3 tools/build_article.py <carpeta_src> <carpeta_web> <id_del_article>
- Estilos base: los del artículo de El Libro Total (blog/el-libro-total/web/articulo.html), para que todas las reseñas compartan diseño.
- Piezas de la reseña en <carpeta_src>: contenido.html, extra.css, script.js y ld.json.
Después, python3 tools/build_blog.py <carpeta_web> genera index.html y la vista previa.
"""
import os, re, sys

src, web, art_id = sys.argv[1:4]
base = open('blog/el-libro-total/web/articulo.html', encoding='utf-8').read()
css = re.search(r'<style>\n(.*?)</style>', base, re.S).group(1)
rd = lambda f: open(os.path.join(src, f), encoding='utf-8').read()
# Rejilla del catálogo: 300 casillas de 5.000 títulos; 4 amarillas = 20.000 sin desbloqueo.
YELLOW = {37, 112, 186, 263}
waffle = ''.join(f'<i style="--i:{i}"{" class=\"y\"" if i in YELLOW else ""}></i>' for i in range(300))
body = rd('contenido.html').replace('<div class="sbx-waffle" aria-label=', '<div class="sbx-waffle" role="img" aria-label=')
body = re.sub(r'(<div class="sbx-waffle"[^>]*>)(</div>)', lambda m: m.group(1) + waffle + m.group(2), body)
head = """<!--
  SonorBooks · Reseña visual de Everand (antes Scribd)
  ------------------------------------------------------------
  Fragmento autocontenido para pegar en el CMS (dentro del <body> de la entrada).
  · Estilos aislados bajo .sbx: no tocan el resto de la web.
  · Las imágenes se cargan desde "media/". Si las subes a otra carpeta,
    sustituye "media/" por la ruta real (buscar y reemplazar).
  · Vídeo de YouTube: pon el ID en data-youtube-id (busca "PENDIENTE").
  · Barra de progreso fija: si la web tiene una cabecera fija, ajusta --sbx-top (abajo, en .sbx) a su altura.
  · Sin JavaScript se ve todo el contenido, solo sin animaciones ni interactivos.
-->
"""
out = (head + f'<article class="sbx" lang="es" id="{art_id}">\n<style>\n' + css + rd('extra.css') + '</style>\n\n' + body +
       '\n<script>\n' + rd('script.js') + '</script>\n\n<!-- Datos estructurados: también se pueden mover al <head> o al campo de schema del CMS -->\n'
       '<script type="application/ld+json">\n' + rd('ld.json') + '</script>\n</article>\n')
os.makedirs(web, exist_ok=True)
open(os.path.join(web, 'articulo.html'), 'w', encoding='utf-8').write(out)
print('articulo.html', round(len(out.encode()) / 1024), 'KB')
