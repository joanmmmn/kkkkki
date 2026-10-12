#!/usr/bin/env python3
"""Fragmentos reales de LibriVox (dominio público) para el vídeo: corte, nivel a -19 LUFS y fundidos.
Escribe video/public/lv/audio/<id>.mp3 y video/public/lv/audio/clips.json (duración y palabras con tiempos relativos,
de la transcripción de ElevenLabs Scribe guardada junto a cada grabación en captures/librivox/audio/*_stt.json).
Uso: python3 tools/lv_clips.py"""
import json, os, re, subprocess

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SRC = os.path.join(ROOT, 'captures', 'librivox', 'audio')
OUT = os.path.join(ROOT, 'video', 'public', 'lv', 'audio')
TARGET = -19.0
# id: (archivo, inicio, duración, transcripción con tiempos, lector, texto)
CLIPS = {
    'omar_cold':  ('rayo_de_luna_128.mp3', 26.55, 5.45, 'rayo_head150_stt.json', 'Omar Mojica', 'Yo no sé si esto es una historia que parece cuento o un cuento que parece historia.'),
    'omar_aviso': ('rayo_de_luna_128.mp3', 7.40, 6.85, 'rayo_head150_stt.json', 'Omar Mojica', 'Esta es una grabación de LibriVox. Todas las grabaciones de LibriVox son del dominio público.'),
    't_omar':     ('rayo_de_luna_128.mp3', 0.45, 1.30, 'rayo_head150_stt.json', 'Omar Mojica', 'El rayo de luna'),
    't_elena':    ('leyendas_07.mp3', 0.95, 1.45, 'head_07_stt.json', 'Elena del Valle', 'El monte de las ánimas'),
    't_vicente':  ('leyendas_06.mp3', 0.70, 1.05, 'head_06_stt.json', 'Vicente Cepeda', 'El Miserere'),
    't_rosa':     ('leyendas_19.mp3', 1.08, 1.35, 'head_19_stt.json', 'Rosacarmela', 'Los ojos verdes'),
}

def loudness(path, ss=None, t=None):
    cmd = ['ffmpeg', '-hide_banner']
    if ss is not None: cmd += ['-ss', str(ss), '-t', str(t)]
    cmd += ['-i', path, '-af', 'ebur128', '-f', 'null', '-']
    r = subprocess.run(cmd, capture_output=True, text=True)
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', r.stderr)[-1])

os.makedirs(OUT, exist_ok=True)
meta = {}
for cid, (f, ss, dur, stt, reader, text) in CLIPS.items():
    src = os.path.join(SRC, f)
    gain = TARGET - loudness(src, ss, dur)
    out = os.path.join(OUT, cid + '.mp3')
    af = f'highpass=f=70,volume={gain:.2f}dB,afade=t=in:st=0:d=0.015,afade=t=out:st={dur - 0.06:.3f}:d=0.06,alimiter=limit=0.95'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(ss), '-t', str(dur), '-i', src, '-af', af, '-ar', '44100', '-ac', '1', '-b:a', '192k', out], check=True)
    words = []
    d = json.load(open(os.path.join(SRC, stt)))
    for w in d['words']:
        if w.get('type') != 'word': continue
        if w['start'] >= ss - 0.05 and w['end'] <= ss + dur + 0.05:
            words.append([round(w['start'] - ss, 3), round(w['end'] - ss, 3), w['text']])
    meta[cid] = {'dur': dur, 'reader': reader, 'text': text, 'gain_db': round(gain, 1), 'words': words}
    print(cid, f'{dur:.2f} s', f'{gain:+.1f} dB', len(words), 'palabras')
json.dump(meta, open(os.path.join(OUT, 'clips.json'), 'w'), ensure_ascii=False, indent=1)
