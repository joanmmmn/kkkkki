#!/usr/bin/env python3
"""Compone la música de fondo con ElevenLabs Music a partir de un composition plan.

Uso: python3 tools/music.py <plan.json> <salida.mp3>
plan.json: {"composition_plan": {"positive_global_styles": [...], "negative_global_styles": [...], "sections": [...]}}
Cada sección lleva "duration_ms": se hacen coincidir con las escenas del vídeo para que los cambios caigan en los cortes.
La clave se lee de ELEVENLABS_API_KEY o de .secrets/elevenlabs.env (ignorado por git).
"""
import json, os, sys, urllib.error, urllib.request

sys.path.insert(0, os.path.dirname(__file__))
from tts import load_key  # noqa: E402


def main():
    plan_path, out = sys.argv[1], sys.argv[2]
    plan = json.load(open(plan_path))
    body = {'composition_plan': plan['composition_plan'], 'model_id': plan.get('model_id', 'music_v1')}
    key = load_key()
    last = None
    for path in ('/v1/music', '/v1/music/compose'):
        req = urllib.request.Request(f'https://api.elevenlabs.io{path}?output_format=mp3_44100_192', data=json.dumps(body).encode(),
                                     headers={'xi-api-key': key, 'Content-Type': 'application/json'})
        try:
            with urllib.request.urlopen(req, timeout=600) as r:
                data = r.read()
            open(out, 'wb').write(data)
            total = sum(s['duration_ms'] for s in plan['composition_plan']['sections']) / 1000
            print(f'OK {out} ({len(data) / 1e6:.1f} MB, plan de {total:.1f} s) vía {path}')
            return
        except urllib.error.HTTPError as e:
            last = f'{path}: HTTP {e.code} {e.read()[:300]!r}'
            if e.code != 404:
                break
    sys.exit(f'Error al componer: {last}')


if __name__ == '__main__':
    main()
