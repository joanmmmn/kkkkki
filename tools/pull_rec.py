#!/usr/bin/env python3
"""Reúne los trozos 'RECB64 <offset> <base64>\nEND' guardados por javascript_tool y escribe el audio (webm/opus).
Uso: tools/pull_rec.py <salida.webm> <total_b64_len> <resultado1.txt> [resultado2.txt ...]"""
import json, sys, base64
out, total, files = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
parts = {}
for f in files:
    d = json.load(open(f))
    txt = d[0]['text'] if isinstance(d, list) else d
    s, _ = json.JSONDecoder().raw_decode(txt.strip())
    i = s.index('RECB64 ')
    head, rest = s[i+7:].split(' ', 1)
    parts[int(head)] = rest[:rest.index('\nEND')]
b64, pos = '', 0
for off in sorted(parts):
    assert off == pos, (off, pos)
    b64 += parts[off]; pos += len(parts[off])
assert len(b64) == total, (len(b64), total)
open(out, 'wb').write(base64.b64decode(b64))
print(out, len(b64))
