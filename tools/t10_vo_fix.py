#!/usr/bin/env python3
"""Ajustes a mano del final real de la voz (speechEnd) cuando vo_post.py lo pone tarde porque, tras un silencio corto,
queda un ruido (respiración) al final del archivo. Pásalo siempre después de tools/vo_post.py.
Uso: python3 tools/t10_vo_fix.py"""
import json, os
VO = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'video/public/t10/vo')
# id: (fin real de la voz en s, hash de la locución a la que se aplica)
FIX = {}
p = os.path.join(VO, 'speech_end_fix.json')
if os.path.exists(p):
    FIX = json.load(open(p))
for vid, (end, h) in FIX.items():
    f = os.path.join(VO, f'{vid}.json')
    d = json.load(open(f))
    if d.get('hash') != h:
        print(f'{vid}: la locución ha cambiado, no se toca'); continue
    d['speechEnd'] = end
    json.dump(d, open(f, 'w'), ensure_ascii=False, indent=1)
    print(f'{vid}: speechEnd → {end}')
