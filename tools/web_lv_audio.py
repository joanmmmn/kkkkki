#!/usr/bin/env python3
"""Fragmentos de LibriVox (dominio público) para la página de reseña, con el tiempo de cada palabra.

Las grabaciones están en captures/librivox/audio (fuera de git por tamaño) y sus transcripciones de ElevenLabs Scribe
(tools/stt.py) al lado, en *_stt.json. El texto de cada fragmento es el que se ve en la página: se alinea palabra a
palabra con la transcripción (difflib), así que puede llevar la puntuación y la grafía del original.

Uso: python3 tools/web_lv_audio.py  → web/librivox-resena/media/audio/*.mp3 y timings.json"""
import difflib, json, os, re, subprocess, unicodedata

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SRC = os.path.join(ROOT, 'captures', 'librivox', 'audio')
OUT = os.path.join(ROOT, 'web', 'librivox-resena', 'media', 'audio')
# id: (grabación, transcripción, desde, hasta, texto en la página)
CUTS = {
    'hero-omar': ('rayo_de_luna_128.mp3', 'rayo_head150_stt.json', 26.45, 44.55,
                  'Yo no sé si esto es una historia que parece cuento o un cuento que parece historia; lo que puedo decir es que '
                  'en su fondo hay una verdad, una verdad muy triste, de la que acaso yo seré uno de los últimos en aprovecharme, '
                  'dadas mis condiciones de imaginación.'),
    'aviso-omar': ('rayo_de_luna_128.mp3', 'rayo_head150_stt.json', 7.30, 21.95,
                   'Esta es una grabación de LibriVox. Todas las grabaciones de LibriVox son del dominio público. '
                   'Para más información o para ser voluntario, por favor visite librivox.org.'),
    'voz-elena': ('leyendas_07.mp3', 'text_07_stt.json', 21.62, 32.75,
                  'La noche de difuntos me despertó a no sé qué hora el doble de las campanas; su tañido monótono y eterno '
                  'me trajo a las mientes esta tradición que oí hace poco en Soria.'),
    'voz-vicente': ('leyendas_06.mp3', 'text_06_stt.json', 21.88, 39.75,
                    'Hace algunos meses que, visitando la célebre abadía de Fitero y ocupándome en revolver algunos volúmenes '
                    'de su abandonada biblioteca, descubrí en uno de sus rincones dos o tres cuadernos bastante antiguos, '
                    'cubiertos de polvo y hasta comenzados a roer por los ratones.'),
    'voz-rosa': ('leyendas_19.mp3', 'text_19_stt.json', 23.90, 40.95,
                 'Hace mucho tiempo que tenía ganas de escribir cualquier cosa con este título. Hoy, que se me ha presentado '
                 'ocasión, lo he puesto con letras grandes en la primera cuartilla de papel, y luego he dejado a capricho volar la pluma.'),
}


def norm(t):
    t = unicodedata.normalize('NFD', t.lower())
    return re.sub(r'[^a-z0-9]', '', ''.join(c for c in t if unicodedata.category(c) != 'Mn'))


def align(text, stt):
    """Un [inicio, fin] por palabra del texto (separado por espacios), a partir de las palabras de la transcripción."""
    shown = text.split()
    a, b = [norm(w) for w in shown], [norm(w['text']) for w in stt]
    out = [None] * len(shown)
    for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        if op == 'equal' or (op == 'replace' and i2 - i1 == j2 - j1):
            for k in range(i2 - i1):
                out[i1 + k] = [stt[j1 + k]['start'], stt[j1 + k]['end']]
        elif op == 'replace':  # p. ej., «librivox.org» frente a «LibriVox punto o r g»: se reparte el tramo
            s, e = stt[j1]['start'], stt[j2 - 1]['end']
            n = i2 - i1
            for k in range(n):
                out[i1 + k] = [s + (e - s) * k / n, s + (e - s) * (k + 1) / n]
        elif op == 'delete':  # palabra del texto que no está en la transcripción: entre sus vecinas
            print('  sin tiempo en la transcripción:', shown[i1:i2])
    for i, v in enumerate(out):  # huecos: justo después de la anterior
        if v is None:
            prev = out[i - 1] if i else [0, 0]
            out[i] = [prev[1], prev[1] + 0.2]
    return shown, out


os.makedirs(OUT, exist_ok=True)
res = {}
for cid, (rec, stt_f, t0, t1, text) in CUTS.items():
    words = [w for w in json.load(open(os.path.join(SRC, stt_f)))['words'] if w.get('type') == 'word' and t0 - 0.05 <= w['start'] <= t1]
    shown, times = align(text, words)
    dur = round(t1 - t0, 3)
    mp3 = os.path.join(OUT, cid + '.mp3')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(t0), '-t', str(dur), '-i', os.path.join(SRC, rec),
                    '-af', f'highpass=f=70,afade=t=in:d=0.02,afade=t=out:st={dur - 0.2:.3f}:d=0.2,loudnorm=I=-18:TP=-1.5:LRA=11',
                    '-ac', '1', '-ar', '44100', '-b:a', '96k', mp3], check=True)
    res[cid] = {'dur': dur, 'words': [[round(s - t0, 3), round(e - t0, 3), w] for (s, e), w in zip(times, shown)]}
    print(cid, dur, 's', len(shown), 'palabras', res[cid]['words'][0], res[cid]['words'][-1], os.path.getsize(mp3) // 1024, 'KB')
json.dump(res, open(os.path.join(OUT, 'timings.json'), 'w', encoding='utf-8'), ensure_ascii=False)
