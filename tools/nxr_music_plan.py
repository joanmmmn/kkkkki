#!/usr/bin/env python3
"""Plan de música (ElevenLabs Music) del vertical de la reseña de Nextory, con las secciones cuadradas con las piezas.

Uso: python3 tools/nxr_music_plan.py   → escribe video/public/music/nxr_short.plan.json
Después: python3 tools/music.py video/public/music/nxr_short.plan.json video/public/music/nxr_short.mp3
(La música de la reseña 16:9 se hace con tools/nxr_music_v2.py: una pieza por bloque, cortadas en los separadores.)
"""
import json, os, sys

sys.path.insert(0, os.path.dirname(__file__))
from nxr_meta import FPS, short_pieces  # noqa: E402

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
OUT = os.path.join(ROOT, 'video/public/music')

GLOBAL = [
    'instrumental background score for a premium, trustworthy app review on YouTube',
    'steady 100 BPM tempo throughout',
    'warm felt piano, soft analog pads, gentle plucked synths, clean electric guitar accents, light modern percussion, round sub bass',
    'polished, modern, curious and optimistic, minimal and uncluttered',
    'mix leaves plenty of space for a spoken voice-over in the mid range',
]
NEGATIVE = ['vocals', 'choir', 'spoken word', 'heavy EDM drop', 'distortion', 'lo-fi crackle', 'dubstep', 'trap hi-hat rolls', 'aggressive drums']

SHORT = [
    ('Hook', 'Q01', ['starts immediately with a punchy soft hit', 'curious plucked motif', 'fast rising energy'], ['slow fade in'], None),
    ('Features', 'Q02', ['bouncy upbeat groove', 'bright plucks', 'keeps momentum'], ['breakdown'], None),
    ('Cons', 'Q04', ['short gentle breakdown', 'fewer drums', 'honest and calm'], ['riser'], None),
    ('Free trial', 'Q05', ['uplifting lift', 'sparkle accents', 'tight groove'], ['aggressive drums'], None),
    ('Outro', 'Q07', ['main motif resolves', 'sustained final chord with a soft tail'], ['abrupt cut'], None),
]


def build(sections, starts, total, styles=GLOBAL):
    secs = []
    bounds = [starts(first) for (_, first, _, _, _) in sections] + [total]
    for i, (name, first, pos, neg, _) in enumerate(sections):
        a, b = bounds[i], bounds[i + 1]
        secs.append({'section_name': name, 'positive_local_styles': pos, 'negative_local_styles': neg, 'duration_ms': round((b - a) / FPS * 1000), 'lines': []})
    return {'model_id': 'music_v1',
            'composition_plan': {'positive_global_styles': styles, 'negative_global_styles': NEGATIVE, 'sections': secs}}


def main():
    os.makedirs(OUT, exist_ok=True)
    pieces, stotal = short_pieces()
    sp = {p['id']: p['at'] for p in pieces}
    plan = build(SHORT, lambda f: sp[f], stotal, GLOBAL[:1] + ['steady 108 BPM tempo throughout'] + GLOBAL[2:])
    json.dump(plan, open(os.path.join(OUT, 'nxr_short.plan.json'), 'w'), ensure_ascii=False, indent=1)
    print(f'nxr_short.plan.json: {stotal / FPS:.1f} s')


if __name__ == '__main__':
    main()
