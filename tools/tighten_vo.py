#!/usr/bin/env python3
"""Acorta las pausas largas de una locución (y opcionalmente la acelera sin cambiar el tono).

Uso: python3 tools/tighten_vo.py <dir_vo> <id>[:tempo] ... [--keep 0.13] [--min 0.18]

- Cada silencio interior de más de --min s se deja en --keep s (con un fundido corto en la unión).
- El silencio inicial se elimina y el final se deja en 0.08 s.
- `id:1.08` aplica además atempo=1.08 (más rápido, mismo tono).
- Reescribe <id>.mp3 y ajusta los tiempos de <id>.json (palabras, duración, speechStart/End).
- El original se guarda en <dir_vo>/raw/<id>.mp3|.json la primera vez y siempre se parte de él,
  así que se puede relanzar con otros valores. El hash de tts.py se conserva: la caché sigue valiendo.
"""
import json, os, shutil, subprocess, sys
import numpy as np

SR = 44100


def load(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()


def silent_runs(a, thr_db=-38.0, win=0.01):
    n = int(SR * win)
    frames = len(a) // n
    rms = np.sqrt(np.mean(a[: frames * n].reshape(frames, n) ** 2, axis=1) + 1e-12)
    db = 20 * np.log10(rms)
    quiet = db < thr_db
    runs, start = [], None
    for i, q in enumerate(quiet):
        if q and start is None:
            start = i
        if not q and start is not None:
            runs.append((start * n, i * n)); start = None
    if start is not None:
        runs.append((start * n, frames * n))
    return runs


def tighten(a, keep, min_len):
    runs = silent_runs(a)
    fade = int(SR * 0.008)
    out, src_pos, tmap = [], 0, [(0.0, 0.0)]
    new_len = 0
    for (s, e) in runs:
        length = e - s
        if s == 0:  # silencio inicial: fuera
            src_pos = e
            tmap = [(e / SR, 0.0)]
            continue
        if e >= len(a) - SR * 0.02:  # silencio final: 0.08 s
            seg = a[src_pos: min(len(a), s + int(SR * 0.08))]
            out.append(seg); new_len += len(seg)
            tmap.append(((s + int(SR * 0.08)) / SR, new_len / SR))
            src_pos = len(a)
            break
        if length < SR * min_len:
            continue
        # conservamos la mitad de `keep` a cada lado del silencio y unimos con un fundido cruzado
        half = int(SR * keep / 2)
        left_end, right_start = s + half, e - half
        seg = a[src_pos:left_end].copy()
        nxt_head = a[right_start: right_start + fade].copy()
        if len(seg) > fade and len(nxt_head) == fade:
            ramp = np.linspace(1, 0, fade, dtype=np.float32)
            seg[-fade:] = seg[-fade:] * ramp + nxt_head * (1 - ramp)
            right_start += fade
        out.append(seg); new_len += len(seg)
        tmap.append((left_end / SR, (new_len - (fade if len(seg) > fade else 0)) / SR))
        tmap.append((right_start / SR, new_len / SR))
        src_pos = right_start
    if src_pos < len(a):
        seg = a[src_pos:]
        out.append(seg); new_len += len(seg)
        tmap.append((len(a) / SR, new_len / SR))
    return np.concatenate(out), tmap


def remap(t, tmap):
    xs = [p[0] for p in tmap]; ys = [p[1] for p in tmap]
    return float(np.interp(t, xs, ys))


def main():
    args = sys.argv[1:]
    d = args[0]
    keep = float(args[args.index('--keep') + 1]) if '--keep' in args else 0.13
    min_len = float(args[args.index('--min') + 1]) if '--min' in args else 0.18
    ids = [x for i, x in enumerate(args[1:], 1) if not x.startswith('--') and args[i - 1] not in ('--keep', '--min')]
    os.makedirs(os.path.join(d, 'raw'), exist_ok=True)
    for spec in ids:
        vid, tempo = (spec.split(':') + ['1'])[:2]
        tempo = float(tempo)
        mp3, meta_p = os.path.join(d, vid + '.mp3'), os.path.join(d, vid + '.json')
        raw_mp3, raw_meta = os.path.join(d, 'raw', vid + '.mp3'), os.path.join(d, 'raw', vid + '.json')
        meta_now = json.load(open(meta_p))
        if not os.path.exists(raw_mp3) or (json.load(open(raw_meta)).get('hash') != meta_now.get('hash')):
            shutil.copy(mp3, raw_mp3); shutil.copy(meta_p, raw_meta)
        meta = json.load(open(raw_meta))
        a = load(raw_mp3)
        b, tmap = tighten(a, keep, min_len)
        tmp = os.path.join(d, 'raw', f'_{vid}.wav')
        b16 = (np.clip(b, -1, 1) * 32767).astype('<i2')
        import wave
        with wave.open(tmp, 'wb') as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(b16.tobytes())
        af = f'atempo={tempo}' if abs(tempo - 1) > 1e-3 else 'anull'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', af, '-ar', str(SR), '-b:a', '160k', mp3], check=True)
        os.remove(tmp)
        f = lambda t: round(remap(t, tmap) / tempo, 3)
        words = [{'w': w['w'], 's': f(w['s']), 'e': f(w['e'])} for w in meta['words']]
        dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3], capture_output=True, text=True).stdout)
        meta.update({'words': words, 'duration': round(dur, 3), 'speechStart': 0.0, 'speechEnd': round(min(dur, max(w['e'] for w in words)), 3),
                     'tightened': {'keep': keep, 'min': min_len, 'tempo': tempo, 'from': round(len(a) / SR, 3)}})
        json.dump(meta, open(meta_p, 'w'), ensure_ascii=False, indent=1)
        print(f'{vid}: {len(a) / SR:.2f} s → {dur:.2f} s (tempo {tempo})')


if __name__ == '__main__':
    main()
