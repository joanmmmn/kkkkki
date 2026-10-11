#!/usr/bin/env python3
"""Planes de música (ElevenLabs Music) de la reseña de Nextory y de su vertical, con las secciones cuadradas con las escenas.

Uso: python3 tools/nxr_music_plan.py   → escribe video/public/music/nxr_bed.plan.json y nxr_short.plan.json
Después: python3 tools/music.py video/public/music/nxr_bed.plan.json video/public/music/nxr_bed.mp3 (y el del vertical).
Si la reseña pasa de 5 min (límite de una composición), se parte en dos pistas: reseña y prueba gratuita.
"""
import json, os, sys

sys.path.insert(0, os.path.dirname(__file__))
from nxr_meta import FPS, review_scenes, short_pieces  # noqa: E402

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

# Secciones de la reseña: (nombre, primera escena, estilos, estilos a evitar)
REVIEW = [
    ('Hook', 'R01', ['starts immediately with a soft hit on the first beat', 'curious plucked synth motif', 'rising energy', 'short riser at the very end'], ['slow fade in', 'silence']),
    ('What it is', 'R02', ['light steady groove', 'informative and clear', 'warm bass and soft drums'], ['big build-ups']),
    ('App tour', 'R04', ['same groove with one extra layer', 'bouncy plucks and subtle percussion fills', 'keeps momentum', 'consistent and unobtrusive'], ['drop', 'breakdown', 'sudden stops']),
    ('Reading and listening', 'R06', ['softer texture', 'felt piano melody over the groove', 'cosy and focused'], ['loud drums']),
    ('Profiles and hours', 'R09', ['groove returns', 'attentive and steady', 'light percussion'], ['riser']),
    ('Pros and cons', 'R11', ['gentle breakdown', 'fewer drums', 'soft pads and piano', 'reflective and honest'], ['loud drums', 'riser']),
    ('Verdict', 'R14', ['warm lift', 'main motif returns with brighter chords', 'confident'], ['abrupt changes']),
    ('Free trial', 'P01', ['uplifting and bright', 'small sparkle accents', 'tight upbeat groove', 'celebratory but tasteful'], ['aggressive drums']),
    ('Outro', 'P06', ['warm return of the main motif', 'resolving', 'ends on a sustained final chord with a natural soft tail'], ['abrupt cut', 'new melody']),
]
SHORT = [
    ('Hook', 'Q01', ['starts immediately with a punchy soft hit', 'curious plucked motif', 'fast rising energy'], ['slow fade in']),
    ('Features', 'Q02', ['bouncy upbeat groove', 'bright plucks', 'keeps momentum'], ['breakdown']),
    ('Cons', 'Q04', ['short gentle breakdown', 'fewer drums', 'honest and calm'], ['riser']),
    ('Free trial', 'Q05', ['uplifting lift', 'sparkle accents', 'tight groove'], ['aggressive drums']),
    ('Outro', 'Q07', ['main motif resolves', 'sustained final chord with a soft tail'], ['abrupt cut']),
]


def build(sections, starts, total, styles=GLOBAL):
    secs = []
    for i, (name, first, pos, neg) in enumerate(sections):
        a = starts[first]
        b = starts[sections[i + 1][1]] if i + 1 < len(sections) else total
        secs.append({'section_name': name, 'positive_local_styles': pos, 'negative_local_styles': neg, 'duration_ms': round((b - a) / FPS * 1000), 'lines': []})
    return {'model_id': 'music_v1', 'composition_plan': {'positive_global_styles': styles, 'negative_global_styles': NEGATIVE, 'sections': secs}}


def main():
    os.makedirs(OUT, exist_ok=True)
    scenes, total, _ = review_scenes()
    starts = {s['id']: s['at'] for s in scenes}
    if total / FPS <= 295:
        plan = build(REVIEW, starts, total)
        json.dump(plan, open(os.path.join(OUT, 'nxr_bed.plan.json'), 'w'), ensure_ascii=False, indent=1)
        print(f'nxr_bed.plan.json: {total / FPS:.1f} s, {len(plan["composition_plan"]["sections"])} secciones')
    else:
        cut = [i for i, s in enumerate(REVIEW) if s[1] == 'P01'][0]
        a = build(REVIEW[:cut], starts, starts['P01'])
        p01 = starts['P01']
        b = build([(n, f, p, q) for n, f, p, q in REVIEW[cut:]], {k: v - p01 for k, v in starts.items()}, total - p01)
        json.dump(a, open(os.path.join(OUT, 'nxr_bed.plan.json'), 'w'), ensure_ascii=False, indent=1)
        json.dump(b, open(os.path.join(OUT, 'nxr_bed_trial.plan.json'), 'w'), ensure_ascii=False, indent=1)
        print(f'Reseña de {total / FPS:.1f} s: partida en nxr_bed.plan.json ({p01 / FPS:.1f} s) y nxr_bed_trial.plan.json')
    pieces, stotal = short_pieces()
    sp = {p['id']: p['at'] for p in pieces}
    plan = build(SHORT, sp, stotal, GLOBAL[:1] + ['steady 108 BPM tempo throughout'] + GLOBAL[2:])
    json.dump(plan, open(os.path.join(OUT, 'nxr_short.plan.json'), 'w'), ensure_ascii=False, indent=1)
    print(f'nxr_short.plan.json: {stotal / FPS:.1f} s')


if __name__ == '__main__':
    main()
