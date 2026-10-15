#!/usr/bin/env python3
"""Música original de «Las mejores plataformas de audiolibros en español» (ElevenLabs Music, composition plans).

Siete piezas, una por bloque del vídeo (cada una cambia en un separador), con una sección por escena para que los cambios de
carácter caigan en los cortes. Misma familia que las reseñas (re mayor, ~104 BPM, sintes cálidos, piano de fieltro) y un
carácter propio por bloque. Después se igualan (tools/music_level.py) y se unen con el mismo empalme suave de las reseñas
(la saliente se filtra y se apaga, la entrante sube en 0,6 s), justo en el golpe de cada separador.

Uso: python3 tools/mp_music.py [--plans]   (--plans solo escribe los planes, sin componer ni gastar créditos)
Escribe video/public/music/mp/<bloque>.plan.json, <bloque>.raw.mp3, <bloque>.mp3 y video/public/music/mp_bed.mp3.
Si una pieza ya está compuesta y su plan no ha cambiado, no se vuelve a componer.
"""
import hashlib, json, os, subprocess, sys
import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
import mp_meta  # noqa: E402

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
OUT = os.path.join(ROOT, 'video/public/music')
DIR = os.path.join(OUT, 'mp')
SR = 44100
FPS = mp_meta.FPS

GLOBAL_POS = [
    'instrumental score for a premium, modern audiobook-platform guide on YouTube',
    'key of D major, around 104 BPM unless stated otherwise',
    'warm analog synths, tight modern drums, round sub bass, plucked synths, felt piano, clean electric guitar accents',
    'polished, confident and optimistic',
    'mix leaves plenty of space for a spoken voice-over in the mid range',
]
GLOBAL_NEG = ['vocals', 'choir', 'spoken word', 'heavy EDM drop', 'distortion', 'lo-fi crackle', 'dubstep', 'trap hi-hat rolls', 'aggressive drums', 'harsh high frequencies']
KEEP = ['keeps playing at full energy until the very last second, no ending']
NO_END = ['ending', 'fade out', 'outro', 'silence', 'sudden stops']

# (bloque, escenas, estilos por escena). La primera escena de cada bloque entra en el golpe del separador.
BLOCKS = [
    ('m1_arranque', ['Z01', 'Z02'], {
        'Z01': ['cold open: soft kick pulse and a catchy plucked synth hook from the very first second', 'builds steadily with filtered drums, a lift when the title appears'],
        'Z02': ['light, curious groove with plucks and hand percussion', 'steady and clear, explanatory mood'],
    }),
    ('m2_sin_limite', ['Z03', 'Z04', 'Z05', 'Z06'], {
        'Z03': ['starts instantly on a strong downbeat', 'main theme: driving modern groove, arpeggiated synths, warm and premium'],
        'Z04': ['same groove, slightly tenser: muted guitar and a questioning bass line'],
        'Z05': ['mid-tempo variation with felt piano and soft strings, a reading mood, still moving'],
        'Z06': ['piano groove with a gentle bounce, a little cautionary in the second half'],
    }),
    ('m3_por_horas', ['Z07', 'Z08', 'Z09', 'Z10', 'Z11'], {
        'Z07': ['starts instantly on the downbeat', 'syncopated funk bass, clean guitar stabs, playful and bright'],
        'Z08': ['same funk groove with added arpeggios, curious and smart'],
        'Z09': ['lighter breakdown of the groove with ticking hi-hats, like a clock'],
        'Z10': ['groove returns with marimba and plucks, international flavour'],
        'Z11': ['brighter and fresher, wide synth pads, a sense of novelty'],
    }),
    ('m4_creditos', ['Z12', 'Z13', 'Z14'], {
        'Z12': ['starts instantly on the downbeat', 'marimba and plucked synths over a tight beat, collector feeling'],
        'Z13': ['short tense pulse, muted plucks'],
        'Z14': ['airy modern electronica with soft glitchy textures, voice-like synth tones (no real vocals)'],
    }),
    ('m5_gratis', ['Z15', 'Z16', 'Z17', 'Z18'], {
        'Z15': ['starts instantly on the downbeat', 'luminous, warm, acoustic guitar and soft drums, community feeling'],
        'Z16': ['same luminous groove, lighter'],
        'Z17': ['very soft and sparse for the first six seconds (felt piano only, under a spoken excerpt), then gentle storytelling groove with piano and brushes'],
        'Z18': ['warm piano groove with a classic, literary touch'],
    }),
    ('m6_trucos', ['Z19', 'Z20', 'Z21', 'Z22', 'Z23'], {
        'Z19': ['starts instantly on the downbeat', 'clever, staccato strings and tight modern drums, playful tension'],
        'Z20': ['same clever groove, a ticking countdown feeling'],
        'Z21': ['punchy variation with handclaps'],
        'Z22': ['building momentum, rising arpeggios, a sense of chaining steps'],
        'Z23': ['focused and important: the main theme returns, confident'],
    }),
    ('m7_veredicto', ['Z24', 'Z25', 'Z26'], {
        'Z24': ['starts instantly on the downbeat', 'resolution of the main theme, uplifting and warm'],
        'Z25': ['lighter, airy, acoustic, generous'],
        'Z26': ['final uplifting statement of the main theme with a clear, satisfying ending in the last eight seconds'],
    }),
]


def plan_for(name, ids, styles, scenes):
    by = {s['id']: s for s in scenes}
    secs = []
    for k, sid in enumerate(ids):
        d = by[sid]['dur']
        last_block = name == BLOCKS[-1][0]
        is_last = k == len(ids) - 1
        loc = list(styles[sid]) + ([] if (last_block and is_last) else KEEP)
        neg = ['breakdown'] * 0 + (['silence'] if (last_block and is_last) else NO_END + ['quiet intro', 'fade in'] * (k == 0))
        secs.append({'section_name': f'{sid}', 'positive_local_styles': loc, 'negative_local_styles': neg, 'duration_ms': int(round(d / FPS * 1000)), 'lines': []})
    # Un pelín de cola al final de cada pieza para el empalme (0,9 s); en la última, el final completo.
    secs[-1]['duration_ms'] += 900
    return {'model_id': 'music_v1', 'levels': [-16.0] + [-14.5] * (len(secs) - 1), 'composition_plan': {
        'positive_global_styles': GLOBAL_POS, 'negative_global_styles': GLOBAL_NEG, 'sections': secs}}


def load(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 's16le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32).reshape(-1, 2) / 32768


def main():
    from scipy.signal import butter, sosfiltfilt
    scenes, total, _ = mp_meta.review_scenes()
    if any(not mp_meta.vo(s['id']) for s in scenes) and '--plans' not in sys.argv:
        sys.exit('Falta la locución: los tiempos aún son estimados. Usa --plans para ver los planes.')
    os.makedirs(DIR, exist_ok=True)
    at = {s['id']: s['at'] for s in scenes}
    for name, ids, styles in BLOCKS:
        plan = plan_for(name, ids, styles, scenes)
        pp = os.path.join(DIR, f'{name}.plan.json')
        h = hashlib.sha1(json.dumps(plan, sort_keys=True).encode()).hexdigest()[:12]
        old = json.load(open(pp)).get('hash') if os.path.exists(pp) else None
        plan['hash'] = h
        json.dump(plan, open(pp, 'w'), ensure_ascii=False, indent=1)
        raw, lev = os.path.join(DIR, f'{name}.raw.mp3'), os.path.join(DIR, f'{name}.mp3')
        if '--plans' in sys.argv:
            print(f'{name}: {sum(s["duration_ms"] for s in plan["composition_plan"]["sections"]) / 1000:.1f} s')
            continue
        if old != h or not os.path.exists(raw):
            subprocess.run(['python3', os.path.join(ROOT, 'tools/music.py'), pp, raw], check=True)
        if old != h or not os.path.exists(lev):
            subprocess.run(['python3', os.path.join(ROOT, 'tools/music_level.py'), raw, pp, lev], check=True)
    if '--plans' in sys.argv:
        return
    # Empalmes: cada pieza entra 0,3 s antes del golpe de su separador (el separador entra 14 fotogramas antes de la escena
    # y golpea en su fotograma 16) y la anterior se va filtrando y apagando 0,7 s antes y 0,9 s después.
    OUT_PRE, OUT_POST, IN_PRE, IN_LEN = 0.7, 0.9, 0.3, 0.6
    sos = butter(4, 900, 'low', fs=SR, output='sos')
    n = round(total / FPS * SR)
    mix = np.zeros((n + 3 * SR, 2), np.float32)
    smooth = lambda u: u * u * (3 - 2 * u)
    starts = [0 if i == 0 else at[ids[0]] - 14 + 16 for i, (_, ids, _) in enumerate(BLOCKS)]
    for i, (name, ids, _) in enumerate(BLOCKS):
        a_f = starts[i]
        b_f = starts[i + 1] if i + 1 < len(BLOCKS) else total
        x = load(os.path.join(DIR, f'{name}.mp3'))
        # La pieza está compuesta desde el inicio de su primera escena: se recorta lo que cae antes del golpe.
        skip = 0 if i == 0 else round((a_f - at[ids[0]]) / FPS * SR)
        x = x[max(0, skip):]
        is_first, is_last = i == 0, i == len(BLOCKS) - 1
        pre = 0 if is_first else round(IN_PRE * SR)
        a = round(a_f / FPS * SR) - pre
        seg = round((b_f - a_f) / FPS * SR) + pre
        need = seg + (0 if is_last else round(OUT_POST * SR))
        y = x[:min(len(x), need)].copy()
        if len(y) < need and not is_last:
            y = np.concatenate([y, np.zeros((need - len(y), 2), np.float32)])
        if not is_first:
            k = np.arange(min(len(y), round(IN_LEN * SR)))
            y[k] *= (np.sin(np.pi / 2 * k / len(k)) ** 2)[:, None]
        if not is_last:
            s0 = max(0, seg - round(OUT_PRE * SR))
            tail = y[s0:].copy()
            pad = min(s0, round(0.2 * SR))
            low = sosfiltfilt(sos, y[s0 - pad:], axis=0)[pad:]
            u = np.linspace(0, 1, len(tail))
            m = smooth(np.clip(u * (OUT_PRE + OUT_POST) / (OUT_PRE + 0.4), 0, 1))[:, None]
            g = (np.cos(np.pi / 2 * u) ** 2)[:, None]
            y[s0:] = g * ((1 - m) * tail + m * low)
        else:
            fo = min(len(y), round(1.4 * SR))
            y[-fo:] *= np.linspace(1, 0, fo)[:, None]
        mix[max(0, a):a + len(y)] += y[max(0, -a):]
        print(f'{name:16} {a_f / FPS:7.2f} → {b_f / FPS:7.2f} s  (pieza {len(x) / SR:6.2f} s)')
    mix = mix[:n]
    peak = float(np.abs(mix).max())
    if peak > 0.97:
        mix *= 0.97 / peak
    pcm = (np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes()
    dst = os.path.join(OUT, 'mp_bed.mp3')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ac', '2', '-ar', str(SR), '-i', '-', '-c:a', 'libmp3lame', '-b:a', '192k', dst], input=pcm, check=True)
    print('escrito', os.path.relpath(dst, ROOT), f'({n / SR:.2f} s)')


if __name__ == '__main__':
    main()
