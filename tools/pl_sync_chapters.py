#!/usr/bin/env python3
"""Pone al día los tiempos de los capítulos de deliverables/pl/<pieza>/youtube.md con la línea de tiempo actual.
Uso: python3 tools/pl_sync_chapters.py <pieza>   (cambia solo las líneas «m:ss Título» cuyo título coincide)"""
import re, subprocess, sys
slug = sys.argv[1]
out = subprocess.run(['python3', 'tools/pl_meta.py', slug, '--starts'], capture_output=True, text=True).stdout
new = {}
for line in out.splitlines():
    m = re.match(r'^(\d+:\d{2}) (.+)$', line)
    if m: new[m[2].strip()] = m[1]
p = f'deliverables/pl/{slug}/youtube.md'
t = open(p).read()
n = 0
def rep(m):
    global n
    lab = m[2].strip()
    if lab in new and new[lab] != m[1]:
        n += 1
        return f'{new[lab]} {m[2]}'
    return m[0]
t = re.sub(r'^(\d+:\d{2}) (.+)$', rep, t, flags=re.M)
open(p, 'w').write(t)
print(f'{p}: {n} capítulos actualizados')
