#!/usr/bin/env python3
"""Música de la reseña de Nextory (v2): una pieza por bloque, cortadas justo en los separadores de sección.

Cada bloque (entre dos separadores) se compone aparte con ElevenLabs Music, con la misma paleta y tonalidad,
para que los cambios de ritmo caigan exactamente en el barrido amarillo. Después se iguala la sonoridad de cada
sección y se unen: la pieza nueva entra en seco en el corte y la anterior se apaga en 0,3 s por debajo.

Uso:
  python3 tools/nxr_music_v2.py plan      → escribe video/public/music/parts/*.plan.json y muestra las duraciones
  python3 tools/nxr_music_v2.py compose   → compone las piezas que falten (una petición cada vez; reintenta si la API está ocupada)
  python3 tools/nxr_music_v2.py join      → nivela y une en video/public/music/nxr_bed.mp3
La clave se lee de ELEVENLABS_API_KEY o de .secrets/elevenlabs.env (ignorado por git).
"""
import json, os, subprocess, sys, time, unicodedata, urllib.error, urllib.request
import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
from nxr_meta import FPS, review_scenes, words  # noqa: E402
from tts import load_key  # noqa: E402

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
OUT = os.path.join(ROOT, 'video/public/music')
PARTS = os.path.join(OUT, 'parts')
SR = 44100
TAIL = 0.3  # segundos que la pieza saliente sigue sonando (apagándose) por debajo de la entrante
EXTRA = 8.0  # segundos de más que se piden a cada pieza (luego se cortan) para no usar su final

GLOBAL = [
    'instrumental score for a premium, modern app review on YouTube',
    'key of D major, around 104 BPM unless stated otherwise',
    'warm analog synths, tight modern drums, round sub bass, plucked synths, felt piano, clean electric guitar accents',
    'polished, confident and optimistic',
    'mix leaves plenty of space for a spoken voice-over in the mid range',
]
NEGATIVE = ['vocals', 'choir', 'spoken word', 'heavy EDM drop', 'distortion', 'lo-fi crackle', 'dubstep', 'trap hi-hat rolls', 'aggressive drums', 'harsh high frequencies']
DOWNBEAT = 'starts instantly on a strong downbeat, no intro'

# Bloques: (archivo, escena de inicio, [(sección, inicio, estilos, a evitar, LUFS objetivo)])
# El inicio de una sección puede ser una escena ('R06') o (escena, palabra) → 10 fotogramas antes de la palabra.
BLOCKS = [
    ('a_hook', 'R01', [
        ('Hook', 'R01', ['cold open: soft kick pulse and a catchy plucked synth hook from the very first second', 'builds steadily with filtered drums', 'short rising riser in the last two seconds'], ['silence', 'long intro', 'slow fade in'], -16.0),
    ]),
    ('b_que', 'R02', [
        ('What it is', 'R02', [DOWNBEAT, 'the full groove drops in immediately: bouncy bass, crisp drums, bright plucks', 'light, upbeat and informative'], ['big build-ups'], -14.5),
    ]),
    ('c_precios', 'R03', [
        ('Prices', 'R03', [DOWNBEAT, 'rhythm change: syncopated funky groove with claps and staccato synth stabs', 'punchy and crisp'], ['piano ballad'], -14.5),
    ]),
    ('d1_app', 'R04', [
        ('App tour', 'R04', [DOWNBEAT, 'main theme: driving modern groove, arpeggiated synths, layered percussion', 'confident momentum'], ['breakdown', 'sudden stops', 'quiet intro'], -14.5),
    ]),
    ('d2_leer', 'R06', [
        ('Reading and listening', 'R06', [DOWNBEAT, 'half-time feel, soft rimshots and brushed drums', 'felt piano and warm pads lead', 'cosy and focused'], ['loud drums', 'riser'], -16.0),
    ]),
    # (Con dos secciones, estas piezas salían con varios segundos de silencio al principio: van de una en una.)
    ('e1_funciones', 'R08', [
        ('More features', 'R08', [DOWNBEAT, 'a new groove with a different bassline and shakers', 'steady and attentive'], ['riser'], -14.5),
    ]),
    ('e2_dispositivos', 'R11', [
        ('Devices and PDF', 'R11', [DOWNBEAT, 'playful: marimba and pizzicato-like plucks over light drums', 'short stop-time hits'], ['heavy drums'], -15.0),
    ]),
    ('f1_pros', 'R13', [
        ('Pros', 'R13', [DOWNBEAT, 'bright and positive, major chords, light upbeat drums'], ['minor key'], -14.5),
    ]),
    ('f2_contras', ('R13', 'malo'), [
        ('Cons', ('R13', 'malo'), [DOWNBEAT, 'sudden contrast: minimal and darker, B minor chords, low pulse, soft kick only', 'serious and honest'], ['bright plucks', 'riser'], -16.5),
    ]),
    ('g_veredicto', 'R14', [
        ('Verdict', 'R14', [DOWNBEAT, 'warm resolution back in D major', 'the main motif returns with full chords', 'confident mid-tempo groove'], ['abrupt changes'], -15.0),
    ]),
    ('h1_prueba', 'P01', [
        ('Free trial', 'P01', [DOWNBEAT + ' with a bright hit', 'uplifting and energetic, 112 BPM four-on-the-floor kick, claps and sparkling synths', 'celebratory but tasteful'], ['aggressive drums'], -14.0),
    ]),
    ('h2_cierre', 'P06', [
        ('Outro', 'P06', [DOWNBEAT, 'warm resolving outro: the hook plays once more, then the drums drop out', 'ends on a sustained final chord with a natural soft tail'], ['abrupt cut', 'new melody'], -15.0),
    ]),
]


def norm(t):
    return ''.join(c for c in unicodedata.normalize('NFD', t.lower()) if unicodedata.category(c) != 'Mn')


def timeline():
    scenes, total, _ = review_scenes()
    at = {s['id']: s['at'] for s in scenes}
    lead = {s['id']: s['lead'] for s in scenes}
    bumps = {s['id'] for s in scenes if s.get('bump')}

    def start(first):
        if isinstance(first, tuple):
            sid, word = first
            w = next(x for x in words(sid) if norm(x['w']).startswith(norm(word)))
            return at[sid] + lead[sid] + round(w['s'] * FPS) - 10
        # Con separador, el corte cae 6 fotogramas antes de la escena (los paneles ya tapan la pantalla).
        return at[first] - (6 if first in bumps else 0)
    return start, total


def plans():
    start, total = timeline()
    out = []
    for i, (name, first, secs) in enumerate(BLOCKS):
        a = start(first)
        b = start(BLOCKS[i + 1][1]) if i + 1 < len(BLOCKS) else total
        bounds = [start(s[1]) for s in secs] + [b]
        sections = []
        for k, (sname, _, pos, neg, _) in enumerate(secs):
            d = (bounds[k + 1] - bounds[k]) / FPS
            pos2, neg2 = list(pos), list(neg)
            if k == len(secs) - 1 and i + 1 < len(BLOCKS):
                # Una pieza suelta tiende a cerrar con un final: se pide más larga y sin final, y se corta antes.
                d += EXTRA
                pos2.append('keeps playing at full energy until the very last second, no ending')
                neg2 += ['ending', 'fade out', 'outro']
            neg2 += ['silence', 'fade in']
            sections.append({'section_name': sname, 'positive_local_styles': pos2, 'negative_local_styles': neg2, 'duration_ms': round(d * 1000), 'lines': []})
        plan = {'model_id': 'music_v1', 'start_frame': a, 'end_frame': b, 'levels': [s[4] for s in secs], 'tail': i + 1 < len(BLOCKS),
                'composition_plan': {'positive_global_styles': GLOBAL, 'negative_global_styles': NEGATIVE, 'sections': sections}}
        out.append((name, plan))
    return out, total


def compose(plan, dst, key):
    body = {'composition_plan': plan['composition_plan'], 'model_id': plan['model_id']}
    for attempt in range(8):
        req = urllib.request.Request('https://api.elevenlabs.io/v1/music?output_format=mp3_44100_192', data=json.dumps(body).encode(),
                                     headers={'xi-api-key': key, 'Content-Type': 'application/json'})
        try:
            with urllib.request.urlopen(req, timeout=600) as r:
                open(dst, 'wb').write(r.read())
            return
        except urllib.error.HTTPError as e:
            msg = e.read()[:300]
            if e.code in (429, 503) or b'busy' in msg:
                time.sleep(20 * (attempt + 1))
                continue
            sys.exit(f'Error al componer {dst}: HTTP {e.code} {msg!r}')
    sys.exit(f'La API sigue ocupada: {dst}')


def _db(x, a, b):
    seg = x[a:b]
    return 20 * np.log10(np.sqrt(np.mean(seg ** 2)) + 1e-9) if len(seg) else -120


def lead_trim(x, plan):
    """Muestras que se saltan al principio: el silencio inicial y, si la pieza arranca floja, hasta que coge fuerza.
    (Todas las piezas son de una sola sección y se piden EXTRA segundos más largas, así que hay margen.)"""
    if plan['start_frame'] == 0:
        return 0
    win = round(0.05 * SR)
    k0 = next((k for k in range(0, len(x) - win, win) if _db(x, k, k + win) > -35), 0)
    w4 = round(0.4 * SR)
    need = round((plan['end_frame'] - plan['start_frame']) / FPS * SR)
    typical = np.median([_db(x, k, k + w4) for k in range(k0, min(len(x), k0 + need) - w4, w4)])
    k = k0
    while k < k0 + round(6 * SR) and _db(x, k, k + round(1.5 * SR)) < typical - 8:
        k += round(0.1 * SR)
    return k


def problems(path, plan):
    """Silencio al principio o huecos dentro del tramo que se va a usar (la parte de vídeo + la cola), ya recortado el arranque."""
    x = load(path).mean(1)
    x = x[lead_trim(x, plan):]
    need = (plan['end_frame'] - plan['start_frame']) / FPS + (TAIL if plan.get('tail', True) else 0)
    win = round(0.4 * SR)
    if len(x) / SR < need - (0 if plan.get('tail', True) else 0.2):  # la última pieza puede quedarse un pelo corta: el vídeo acaba fundiendo
        return f'dura {len(x) / SR:.1f} s (sin el arranque) y hacen falta {need:.1f}'
    if _db(x, 0, round(0.5 * SR)) < -40:
        return 'empieza en silencio'
    # En la última pieza, el final (la cola del acorde) puede quedarse en silencio.
    check = need if plan.get('tail', True) else need - 4
    for k in range(0, round(check * SR) - win, win // 2):
        if _db(x, k, k + win) < -40:
            return f'hueco en {k / SR:.1f} s'
    return None


def load(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 's16le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32).reshape(-1, 2) / 32768


def main():
    os.makedirs(PARTS, exist_ok=True)
    step = sys.argv[1] if len(sys.argv) > 1 else 'plan'
    items, total = plans()
    if step == 'plan':
        for name, plan in items:
            json.dump(plan, open(os.path.join(PARTS, f'{name}.plan.json'), 'w'), ensure_ascii=False, indent=1)
            secs = plan['composition_plan']['sections']
            print(f"{name:12} {plan['start_frame'] / FPS:7.2f} s → {plan['end_frame'] / FPS:7.2f} s  " + ' + '.join(f"{s['section_name']} {s['duration_ms'] / 1000:.1f}" for s in secs))
        print(f'total {total / FPS:.2f} s')
    elif step == 'compose':
        key = load_key()
        only = set(sys.argv[sys.argv.index('--only') + 1].split(',')) if '--only' in sys.argv else None
        for name, plan in items:
            dst = os.path.join(PARTS, f'{name}.raw.mp3')
            if only is not None and name not in only:
                continue
            if only is None and os.path.exists(dst) and not problems(dst, plan):
                continue
            json.dump(plan, open(os.path.join(PARTS, f'{name}.plan.json'), 'w'), ensure_ascii=False, indent=1)
            for attempt in range(5):
                t0 = time.time()
                compose(plan, dst, key)
                bad = problems(dst, plan)
                print(f'{name}: compuesta en {time.time() - t0:.0f} s' + (f' — {bad}, otra vez' if bad else ' — bien'), flush=True)
                if not bad:
                    break
    elif step == 'join':
        # Transiciones suaves (v3): la pieza saliente se apaga entre 0,7 s antes y 0,9 s después del corte mientras se
        # «tapa» (filtro de paso bajo que va entrando), y la entrante arranca 0,3 s antes del corte y sube en 0,6 s.
        from scipy.signal import butter, sosfiltfilt
        OUT_PRE, OUT_POST, IN_PRE, IN_LEN = 0.7, 0.9, 0.3, 0.6
        sos = butter(4, 900, 'low', fs=SR, output='sos')
        n = round(total / FPS * SR)
        mix = np.zeros((n + 3 * SR, 2), np.float32)
        smooth = lambda u: u * u * (3 - 2 * u)
        for i, (name, plan) in enumerate(items):
            pp = os.path.join(PARTS, f'{name}.plan.json')
            json.dump(plan, open(pp, 'w'), ensure_ascii=False, indent=1)
            lev = os.path.join(PARTS, f'{name}.mp3')
            subprocess.run(['python3', os.path.join(ROOT, 'tools/music_level.py'), os.path.join(PARTS, f'{name}.raw.mp3'), pp, lev], check=True, capture_output=True)
            x = load(lev)
            off = lead_trim(load(os.path.join(PARTS, f'{name}.raw.mp3')).mean(1), plan)
            x = x[off:]
            first, last = i == 0, i == len(items) - 1
            pre = 0 if first else round(IN_PRE * SR)
            a = round(plan['start_frame'] / FPS * SR) - pre
            seg = round((plan['end_frame'] - plan['start_frame']) / FPS * SR) + pre  # muestras de la pieza hasta el corte
            keep = min(len(x), seg + (0 if last else round(OUT_POST * SR)))
            y = x[:keep].copy()
            if not first:  # entrada suave
                k = np.arange(min(len(y), round(IN_LEN * SR)))
                y[k] *= (np.sin(np.pi / 2 * k / len(k)) ** 2)[:, None]
            if not last:  # salida: fundido y filtro que se va cerrando
                s0 = max(0, seg - round(OUT_PRE * SR))
                tail = y[s0:].copy()
                pad = min(s0, round(0.2 * SR))
                low = sosfiltfilt(sos, y[s0 - pad:], axis=0)[pad:]
                u = np.linspace(0, 1, len(tail))
                m = smooth(np.clip(u * (OUT_PRE + OUT_POST) / (OUT_PRE + 0.4), 0, 1))[:, None]  # filtro del todo 0,4 s después del corte
                g = (np.cos(np.pi / 2 * u) ** 2)[:, None]
                y[s0:] = g * ((1 - m) * tail + m * low)
            mix[max(0, a):a + len(y)] += y[max(0, -a):]
            print(f'{name:16} {len(x) / SR:6.2f} s de pieza (arranque recortado {off / SR:.2f} s) para {seg / SR:6.2f} s de vídeo')
        mix = mix[:n]
        peak = float(np.abs(mix).max())
        if peak > 0.97:
            mix *= 0.97 / peak
        pcm = (np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes()
        dst = os.path.join(OUT, 'nxr_bed.mp3')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ac', '2', '-ar', str(SR), '-i', '-', '-c:a', 'libmp3lame', '-b:a', '192k', dst], input=pcm, check=True)
        print('escrito', os.path.relpath(dst, ROOT), f'({n / SR:.2f} s)')
    else:
        sys.exit(__doc__)


if __name__ == '__main__':
    main()
