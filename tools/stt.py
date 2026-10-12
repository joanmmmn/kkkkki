#!/usr/bin/env python3
"""Transcripción con tiempos por palabra (ElevenLabs Scribe) de un trozo de audio.

Uso: python3 tools/stt.py ENTRADA.mp3 SALIDA.json [--desde S] [--hasta S] [--idioma spa]
Los tiempos del JSON son absolutos (segundos desde el principio de ENTRADA), aunque se transcriba solo un trozo.
La clave se lee de ELEVENLABS_API_KEY o de .secrets/elevenlabs.env (fuera de git)."""
import json, os, subprocess, sys, tempfile, urllib.request, uuid

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')


def api_key():
    key = os.environ.get('ELEVENLABS_API_KEY')
    if key:
        return key
    for line in open(os.path.join(ROOT, '.secrets', 'elevenlabs.env'), encoding='utf-8'):
        if line.startswith('ELEVENLABS_API_KEY='):
            return line.split('=', 1)[1].strip()
    sys.exit('Falta ELEVENLABS_API_KEY')


def transcribe(src, desde=0.0, hasta=None, idioma='spa'):
    with tempfile.TemporaryDirectory() as tmp:
        cut = os.path.join(tmp, 'cut.mp3')
        cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', str(desde)] + (['-to', str(hasta)] if hasta else []) + ['-i', src, '-ac', '1', '-b:a', '128k', cut]
        if hasta:  # -to tras -ss en la entrada cuenta desde el principio del archivo
            cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', str(desde), '-t', str(hasta - desde), '-i', src, '-ac', '1', '-b:a', '128k', cut]
        subprocess.run(cmd, check=True)
        boundary = uuid.uuid4().hex
        parts = []
        for name, value in (('model_id', 'scribe_v1'), ('language_code', idioma), ('timestamps_granularity', 'word'), ('tag_audio_events', 'false')):
            parts.append(f'--{boundary}\r\nContent-Disposition: form-data; name="{name}"\r\n\r\n{value}\r\n'.encode())
        parts.append(f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="cut.mp3"\r\nContent-Type: audio/mpeg\r\n\r\n'.encode()
                     + open(cut, 'rb').read() + b'\r\n')
        parts.append(f'--{boundary}--\r\n'.encode())
        req = urllib.request.Request('https://api.elevenlabs.io/v1/speech-to-text', data=b''.join(parts),
                                     headers={'xi-api-key': api_key(), 'Content-Type': f'multipart/form-data; boundary={boundary}'})
        with urllib.request.urlopen(req, timeout=300) as r:
            d = json.load(r)
    for w in d.get('words', []):
        w['start'] = round(w['start'] + desde, 3)
        w['end'] = round(w['end'] + desde, 3)
    d['offset'] = desde
    return d


if __name__ == '__main__':
    a = sys.argv[1:]
    opt = lambda k, df: type(df)(a[a.index(k) + 1]) if k in a else df
    src, out = a[0], a[1]
    d = transcribe(src, opt('--desde', 0.0), opt('--hasta', 0.0) or None, opt('--idioma', 'spa'))
    json.dump(d, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    words = [w for w in d['words'] if w.get('type') == 'word']
    print(out, len(words), 'palabras:', ' '.join(f"{w['text']}@{w['start']:.2f}" for w in words))
