#!/usr/bin/env python3
"""Extrae una instantánea del DOM (tools/snap_safe.js) del resultado guardado de javascript_tool y la escribe como HTML.
Uso: python3 tools/unsnap.py <tool-results/...txt> <salida.html>
El resultado es JSON [{type, text}]; el texto empieza por el valor devuelto serializado como cadena JSON,
que contiene 'SNAPv1 <meta>\\n<gzip base64>[\\nPAD...]' (puede llevar texto delante)."""
import base64, gzip, json, sys

src, out = sys.argv[1], sys.argv[2]
raw = open(src, encoding='utf-8').read()
try:
    items = json.loads(raw)
    text = ''.join(i.get('text', '') for i in items) if isinstance(items, list) else str(items)
except json.JSONDecodeError:
    text = raw
text = text.strip()
if text.startswith('"'):
    text, _ = json.JSONDecoder().raw_decode(text)
i = text.find('SNAPv1 ')
s = text[i:]
head, _, body = s.partition('\n')
b64 = body.split('\nPAD', 1)[0].strip()
html = gzip.decompress(base64.b64decode(b64)).decode('utf-8')
open(out, 'w', encoding='utf-8').write(html)
print(head[:300], '→', out, f'({len(html) / 1024:.0f} KB)')
