#!/usr/bin/env python3
"""Genera la locución por escenas con ElevenLabs (con marcas de tiempo por carácter).

Uso: python3 tools/tts.py <vo.json> <outdir> [--only E01,E02] [--force]

vo.json: {"voice_id": "...", "model_id": "...", "voice_settings": {...},
          "scenes": [{"id": "E01", "text": "..."}, ...]}

Por escena escribe <id>.mp3 y <id>.json (alineación + palabras con inicio y fin en segundos).
Hay caché por hash del texto y los ajustes: no se regenera (ni se gastan créditos) si nada cambia.
Usa previous_text/next_text para que la entonación enlace entre escenas.
"""
import base64, hashlib, json, os, sys, urllib.request

def load_key():
    key = os.environ.get('ELEVENLABS_API_KEY')
    if not key:
        p = os.path.join(os.path.dirname(__file__), '..', '.secrets', 'elevenlabs.env')
        for line in open(p):
            if line.startswith('ELEVENLABS_API_KEY='):
                key = line.strip().split('=', 1)[1]
    return key

def words_from_alignment(al):
    chars, starts, ends = al['characters'], al['character_start_times_seconds'], al['character_end_times_seconds']
    words, cur, ws = [], '', None
    for c, s, e in zip(chars, starts, ends):
        if c.isspace():
            if cur:
                words.append({'w': cur, 's': ws, 'e': pe})
                cur, ws = '', None
            continue
        if ws is None:
            ws = s
        cur += c
        pe = e
    if cur:
        words.append({'w': cur, 's': ws, 'e': pe})
    return words

def main():
    cfg_path, out = sys.argv[1], sys.argv[2]
    only = None
    force = '--force' in sys.argv
    if '--only' in sys.argv:
        only = set(sys.argv[sys.argv.index('--only') + 1].split(','))
    cfg = json.load(open(cfg_path))
    os.makedirs(out, exist_ok=True)
    key = load_key()
    scenes = cfg['scenes']
    total = 0
    for i, sc in enumerate(scenes):
        if only and sc['id'] not in only:
            continue
        body = {
            'text': sc['text'],
            'model_id': cfg['model_id'],
            'voice_settings': {**cfg['voice_settings'], **sc.get('voice_settings', {})},
            'language_code': cfg.get('language_code', 'es'),
            'previous_text': scenes[i - 1]['text'] if i > 0 else None,
            'next_text': scenes[i + 1]['text'] if i + 1 < len(scenes) else None,
        }
        # La caché solo depende del texto propio y los ajustes (no de las escenas vecinas) para no regenerar de más.
        h = hashlib.sha1(json.dumps([sc['text'], body['model_id'], body['voice_settings'], cfg['voice_id']], sort_keys=True).encode()).hexdigest()[:12]
        meta_path = os.path.join(out, f"{sc['id']}.json")
        if not force and os.path.exists(meta_path) and json.load(open(meta_path)).get('hash') == h:
            print(f"{sc['id']}: en caché")
            continue
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{cfg['voice_id']}/with-timestamps?output_format={cfg.get('output_format', 'mp3_44100_128')}"
        req = urllib.request.Request(url, data=json.dumps(body).encode(), headers={'xi-api-key': key, 'Content-Type': 'application/json'})
        with urllib.request.urlopen(req, timeout=300) as r:
            res = json.loads(r.read())
        audio = base64.b64decode(res['audio_base64'])
        open(os.path.join(out, f"{sc['id']}.mp3"), 'wb').write(audio)
        al = res.get('normalized_alignment') or res['alignment']
        words = words_from_alignment(res['alignment'])
        dur = res['alignment']['character_end_times_seconds'][-1]
        json.dump({'id': sc['id'], 'hash': h, 'text': sc['text'], 'duration': dur, 'words': words}, open(meta_path, 'w'), ensure_ascii=False, indent=1)
        total += len(sc['text'])
        print(f"{sc['id']}: {dur:.2f} s, {len(sc['text'])} caracteres")
    print('caracteres enviados:', total)

if __name__ == '__main__':
    main()
