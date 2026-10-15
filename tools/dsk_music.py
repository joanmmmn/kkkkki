#!/usr/bin/env python3
"""Música del episodio «Por dónde y cómo empezar a leer · Dostoievski»: una pieza de ElevenLabs Music por bloque, cortadas en los separadores.

Mismo método que la reseña de Nextory (tools/nxr_music_v2.py): cada bloque se compone aparte (misma paleta), se iguala
su sonoridad y se une con la anterior en el barrido del separador.

Uso:
  python3 tools/dsk_music.py plan      → escribe video/public/music/dsk_parts/*.plan.json y muestra las duraciones
  python3 tools/dsk_music.py compose [--only a,b]
  python3 tools/dsk_music.py join      → video/public/music/dsk_bed.mp3
"""
import json, os, subprocess, sys, time, urllib.error, urllib.request
import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
from tts import load_key  # noqa: E402
from dsk_timeline import parse, FPS  # noqa: E402

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
OUT = os.path.join(ROOT, 'video/public/music')
PARTS = os.path.join(OUT, 'dsk_parts')
SR = 44100
TAIL = 0.3
EXTRA = 8.0

GLOBAL = [
    'instrumental cinematic documentary score for a premium YouTube guide about the novels of Fyodor Dostoevsky',
    'nineteenth-century Saint Petersburg atmosphere, introspective and literary, elegant and modern at the same time',
    'key of A minor, around 92 BPM unless stated otherwise',
    'felt piano, solo cello, warm string quartet and string pads, celesta, soft tubular bells, plucked domra-like strings, subtle low percussion, gentle sub bass',
    'mix leaves plenty of space for a spoken voice-over in the mid range',
]
NEGATIVE = ['vocals', 'choir', 'spoken word', 'cliche russian folk dance', 'balalaika solo', 'accordion', 'jump scare stingers', 'heavy EDM drop', 'distortion', 'dubstep',
            'trap hi-hat rolls', 'aggressive drums', 'harsh high frequencies', 'lo-fi crackle']
DOWNBEAT = 'starts instantly on a strong downbeat, no intro'

# (archivo, escena de inicio, nombre, estilos, a evitar, LUFS objetivo)
BLOCKS = [
    ('a_hook', 'HOOK', 'Cold open', ['cold open at dawn in the snow: a low held cello note and a distant, muted military snare roll from the very first second',
                                     'tension slowly builds for twelve seconds with a ticking clock-like pulse and soft timpani',
                                     'at twelve seconds the drums and pulse stop at once and only a quiet high string note hangs for three seconds',
                                     'at fifteen seconds a warm, relieved string chord blooms and a fragile solo piano melody begins'], ['long intro', 'slow fade in', 'marching band'], -17.0),
    ('b_intro', 'NAME', 'Curious intro', [DOWNBEAT, 'curious and elegant: felt piano ostinato with pizzicato strings, celesta sparkles and soft brushed percussion', 'steady, inviting momentum',
                                          'a warm swelling cinematic climax with a big soft hit in the last four seconds'], ['heavy drums'], -16.0),
    ('c_bio', 'MOSCU', 'Biography', [DOWNBEAT, 'wintry storytelling: solo cello melody and felt piano over sustained soft strings, a celesta motif', 'a continuous gentle pulse and soft shaker that never stop',
                                     'melancholic, warm and slightly mysterious'], ['loud drums', 'riser', 'pauses', 'breaks'], -16.5),
    ('d_temas', 'TEMAS', 'Ideas and thrillers', [DOWNBEAT, 'rhythm change: intriguing psychological-thriller groove at 100 BPM with pizzicato, ticking percussion and a low piano motif',
                                                'clever and suspenseful but elegant'], ['piano ballad', 'heavy drums'], -15.5),
    ('e1_puertas', 'P1', 'Five doors A', [DOWNBEAT, 'main theme: driving cinematic groove with a piano ostinato, cello and low strings, steady modern drums', 'introspective undercurrent, confident momentum'],
     ['breakdown', 'sudden stops', 'quiet intro'], -15.5),
    ('e2_puertas', 'P4', 'Five doors B', [DOWNBEAT, 'same main theme with one extra layer: plucked domra-like arpeggios and soft bells', 'keeps the driving momentum, slightly brighter'],
     ['breakdown', 'sudden stops', 'quiet intro'], -15.5),
    ('f_despues', 'KARAM', 'Epic and long', [DOWNBEAT, 'grand and solemn: low strings, deep bells like an Orthodox cathedral, big soft toms and brass-like swells', 'grows grander and wider, majestic'],
     ['bright plucks', 'choir'], -15.5),
    ('g_vida', 'VIDA', 'Life in the books', [DOWNBEAT, 'intimate and investigative: plucked low strings, brushed drums, ticking percussion and a mysterious piano', 'reflective, like turning the pages of a diary'],
     ['heavy drums', 'riser'], -16.0),
    ('h_version', 'VERSION', 'Choosing a version', [DOWNBEAT, 'warm and bright: C major, soft modern groove, plucked strings and felt piano', 'friendly, clear and modern'], ['minor key', 'heavy drums'], -16.0),
    ('i_rutas', 'RUTAS', 'Routes and outro', [DOWNBEAT, 'uplifting finale: the main piano motif returns with full strings, cello and steady drums, hopeful A major lift',
                                              'after about thirty seconds the drums drop out for a warm calm outro', 'ends on a sustained final chord with a natural soft tail'], ['abrupt cut'], -16.0),
]


def plans():
    scenes, total = parse()
    at = {s['id']: s['start'] for s in scenes}
    bumps = {s['id'] for s in scenes if s['bump']}
    start = lambda sid: at[sid] - (6 if sid in bumps else 0)
    out = []
    for i, (name, first, sname, pos, neg, lev) in enumerate(BLOCKS):
        a = start(first)
        b = start(BLOCKS[i + 1][1]) if i + 1 < len(BLOCKS) else total
        d = (b - a) / FPS
        pos2, neg2 = list(pos), list(neg)
        last = i + 1 == len(BLOCKS)
        if not last:
            d += EXTRA
            pos2.append('keeps playing at full energy until the very last second, no ending')
            neg2 += ['ending', 'fade out', 'outro']
        else:
            d += 6.0
        neg2 += ['silence', 'fade in']
        sections = [{'section_name': sname, 'positive_local_styles': pos2, 'negative_local_styles': neg2, 'duration_ms': round(d * 1000), 'lines': []}]
        plan = {'model_id': 'music_v1', 'start_frame': a, 'end_frame': b, 'levels': [lev], 'tail': not last,
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
            msg = e.read()[:400]
            if e.code in (429, 503) or b'busy' in msg:
                time.sleep(20 * (attempt + 1))
                continue
            sys.exit(f'Error al componer {dst}: HTTP {e.code} {msg!r}')
    sys.exit(f'La API sigue ocupada: {dst}')


def load(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 's16le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32).reshape(-1, 2) / 32768


def _db(x, a, b):
    seg = x[a:b]
    return 20 * np.log10(np.sqrt(np.mean(seg ** 2)) + 1e-9) if len(seg) else -120


def lead_trim(x, plan):
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
    x = load(path).mean(1)
    x = x[lead_trim(x, plan):]
    need = (plan['end_frame'] - plan['start_frame']) / FPS + (TAIL if plan.get('tail', True) else 0)
    win = round(0.4 * SR)
    if len(x) / SR < need - (0 if plan.get('tail', True) else 0.2):
        return f'dura {len(x) / SR:.1f} s y hacen falta {need:.1f}'
    if plan['start_frame'] > 0 and _db(x, 0, round(0.5 * SR)) < -40:
        return 'empieza en silencio'
    check = need if plan.get('tail', True) else need - 4
    for k in range(round(1.0 * SR) if plan['start_frame'] == 0 else 0, round(check * SR) - win, win // 2):
        if _db(x, k, k + win) < -40:
            return f'hueco en {k / SR:.1f} s'
    return None


def main():
    os.makedirs(PARTS, exist_ok=True)
    step = sys.argv[1] if len(sys.argv) > 1 else 'plan'
    items, total = plans()
    if step == 'plan':
        for name, plan in items:
            json.dump(plan, open(os.path.join(PARTS, f'{name}.plan.json'), 'w'), ensure_ascii=False, indent=1)
            s = plan['composition_plan']['sections'][0]
            print(f"{name:12} {plan['start_frame'] / FPS:7.2f} s → {plan['end_frame'] / FPS:7.2f} s  pide {s['duration_ms'] / 1000:.1f} s")
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
            for attempt in range(4):
                t0 = time.time()
                compose(plan, dst, key)
                bad = problems(dst, plan)
                print(f'{name}: compuesta en {time.time() - t0:.0f} s' + (f' — {bad}, otra vez' if bad else ' — bien'), flush=True)
                if not bad:
                    break
    elif step == 'join':
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
            seg = round((plan['end_frame'] - plan['start_frame']) / FPS * SR) + pre
            keep = min(len(x), seg + (0 if last else round(OUT_POST * SR)))
            y = x[:keep].copy()
            if not first:
                k = np.arange(min(len(y), round(IN_LEN * SR)))
                y[k] *= (np.sin(np.pi / 2 * k / len(k)) ** 2)[:, None]
            if not last:
                s0 = max(0, seg - round(OUT_PRE * SR))
                tail = y[s0:].copy()
                pad = min(s0, round(0.2 * SR))
                low = sosfiltfilt(sos, y[s0 - pad:], axis=0)[pad:]
                u = np.linspace(0, 1, len(tail))
                m = smooth(np.clip(u * (OUT_PRE + OUT_POST) / (OUT_PRE + 0.4), 0, 1))[:, None]
                g = (np.cos(np.pi / 2 * u) ** 2)[:, None]
                y[s0:] = g * ((1 - m) * tail + m * low)
            mix[max(0, a):a + len(y)] += y[max(0, -a):]
            print(f'{name:12} {len(x) / SR:6.2f} s de pieza (arranque recortado {off / SR:.2f} s) para {seg / SR:6.2f} s de vídeo')
        mix = mix[:n]
        peak = float(np.abs(mix).max())
        if peak > 0.97:
            mix *= 0.97 / peak
        pcm = (np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes()
        dst = os.path.join(OUT, 'dsk_bed.mp3')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ac', '2', '-ar', str(SR), '-i', '-', '-c:a', 'libmp3lame', '-b:a', '192k', dst], input=pcm, check=True)
        print('escrito', os.path.relpath(dst, ROOT), f'({n / SR:.2f} s)')
    else:
        sys.exit(__doc__)


if __name__ == '__main__':
    main()
