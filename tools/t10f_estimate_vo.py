#!/usr/bin/env python3
"""Tiempos provisionales de la locución de «Los 10 mejores · Fantasía» mientras no hay créditos de ElevenLabs.
Escribe video/public/t10f/vo/<id>.json con palabras estimadas (ritmo medio de la voz de Terror: ~14,9 caracteres/s,
con pausas en comas y puntos) y "estimate": true. tools/tts.py los sustituye al generar la voz real (el hash no coincide).
No toca las locuciones que ya tienen audio."""
import json, os, re, sys

VO = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'video', 'public', 't10f', 'vo')
CPS = 14.87
cfg = json.load(open(os.path.join(VO, 'vo.json')))
for sc in cfg['scenes']:
    p = os.path.join(VO, sc['id'] + '.json')
    if os.path.exists(os.path.join(VO, sc['id'] + '.mp3')):
        continue
    t, words = 0.0, []
    for w in sc['text'].split():
        dur = max(0.12, len(w) / CPS)
        words.append({'w': w, 's': round(t, 3), 'e': round(t + dur, 3)})
        t += dur + 1 / CPS
        if re.search(r'[.!?…»]$', w):
            t += 0.42
        elif re.search(r'[,:;]$', w):
            t += 0.22
    end = words[-1]['e']
    json.dump({'id': sc['id'], 'hash': 'estimate', 'estimate': True, 'text': sc['text'], 'duration': round(end + 0.3, 3), 'speechEnd': round(end + 0.05, 3), 'words': words},
              open(p, 'w'), ensure_ascii=False, indent=1)
    print(sc['id'], f'{end:.1f} s (estimado)')
