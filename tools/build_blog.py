#!/usr/bin/env python3
"""Monta la página completa del artículo visual y una vista previa autocontenida.

Uso: python3 tools/build_blog.py [carpeta]   (por defecto blog/el-libro-total/web)
- index.html: página completa (head con SEO y Open Graph + el fragmento articulo.html). Usa la carpeta media/.
- vista-previa.html: lo mismo con todas las imágenes, clips y audio incrustados (un único archivo para revisar).
"""
import base64, mimetypes, os, re, sys

d = sys.argv[1] if len(sys.argv) > 1 else 'blog/el-libro-total/web'
frag = open(os.path.join(d, 'articulo.html'), encoding='utf-8').read()
# Metadatos SEO de la reseña: ../src/meta.json si existe (si no, los de El Libro Total).
import json
mp = os.path.join(d, '..', 'src', 'meta.json')
M = json.load(open(mp, encoding='utf-8')) if os.path.exists(mp) else {
    'title': 'El Libro Total: reseña, opiniones y si vale la pena (2026) | SonorBooks',
    'description': 'Probamos El Libro Total a fondo: 6.698 audiolibros gratis, sin anuncios ni registro. Cómo funciona, voces, app, pros, contras y nuestra nota: 8,2/10.',
    'canonical': 'https://sonorbooks.com/es/blog/el-libro-total/',
    'og_title': 'El Libro Total: 6.698 audiolibros gratis… ¿dónde está la trampa?',
    'og_description': 'Reseña visual: cómo funciona, quién narra, qué tal suena, lo mejor, lo peor y nuestra nota.'}

HEAD = """<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{description}">
<link rel="canonical" href="{canonical}">
<meta property="og:type" content="article">
<meta property="og:title" content="{og_title}">
<meta property="og:description" content="{og_description}">
<meta property="og:image" content="media/portada-og.jpg">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Merriweather:ital@0;1&family=Ubuntu:wght@400;500;700&display=swap" rel="stylesheet">
<style>html,body{margin:0;background:#fff}body{overflow-x:hidden}</style>
</head>
<body>
"""
page = HEAD.replace("{title}", M["title"]).replace("{description}", M["description"]).replace("{canonical}", M["canonical"]).replace("{og_title}", M["og_title"]).replace("{og_description}", M["og_description"]) + frag + "\n</body>\n</html>\n"
open(os.path.join(d, 'index.html'), 'w', encoding='utf-8').write(page)

def inline(m):
    path = os.path.join(d, m.group(1))
    mime = mimetypes.guess_type(path)[0] or ('image/webp' if path.endswith('.webp') else 'application/octet-stream')
    return 'data:%s;base64,%s' % (mime, base64.b64encode(open(path, 'rb').read()).decode())

preview = re.sub(r'(?<=["\'])(media/[\w.\-]+)', inline, page)
open(os.path.join(d, 'vista-previa.html'), 'w', encoding='utf-8').write(preview)
for f in ('index.html', 'vista-previa.html'):
    print(f, round(os.path.getsize(os.path.join(d, f)) / 1024), 'KB')
