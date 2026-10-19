#!/usr/bin/env python3
"""Tiempos provisionales de la locución (sin audio) para maquetar el vídeo mientras no hay créditos de ElevenLabs.
Escribe video/public/krk/vo/Jxx.json con «placeholder»: true. tools/tts.py los sustituye (el hash no coincide)."""
import json, os, re
ROOT = os.path.join(os.path.dirname(__file__), '..', 'video', 'public', 'krk', 'vo')
cfg = json.load(open(os.path.join(ROOT, 'vo.json')))
CPS = 16.85  # caracteres por segundo del texto hablado (calibrado con el episodio de Dostoievski: la estimación a 15,6 salía un 7 % larga)
for sc in cfg['scenes']:
    p = os.path.join(ROOT, f"{sc['id']}.json")
    if os.path.exists(p) and not json.load(open(p)).get('placeholder'):
        continue
    spoken = sc.get('say', sc['text'])
    t = 0.0
    words = []
    for w in spoken.split():
        d = max(0.12, len(w) / CPS)
        words.append({'w': w, 's': round(t, 3), 'e': round(t + d, 3)})
        t += d + 1 / CPS
        if re.search(r'[.!?…]$', w): t += 0.34
        elif re.search(r'[,;:]$', w): t += 0.16
    dur = round(words[-1]['e'] + 0.05, 3)
    json.dump({'id': sc['id'], 'hash': 'placeholder', 'placeholder': True, 'text': sc['text'], 'duration': dur, 'speechEnd': dur, 'words': words}, open(p, 'w'), ensure_ascii=False, indent=1)
print('ok')
