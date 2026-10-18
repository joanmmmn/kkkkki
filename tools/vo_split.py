#!/usr/bin/env python3
"""Parte una locución ya generada en dos (sin gastar créditos): corta el mp3 en un silencio y reparte las palabras.

Uso: python3 tools/vo_split.py <dir> <id> <segundo de corte> <idA> <idB>
  p. ej. python3 tools/vo_split.py video/public/t10/vo X112 5.25 X112A X112B
El corte tiene que caer en un silencio (se avisa si no). Cada mitad lleva un fundido de 15 ms en el borde del corte.
Después: python3 tools/vo_post.py <dir> --only idA,idB (speechEnd).
"""
import json, os, subprocess, sys

import numpy as np

SR = 44100


def main():
    d, vid, cut, ida, idb = sys.argv[1], sys.argv[2], float(sys.argv[3]), sys.argv[4], sys.argv[5]
    meta = json.load(open(os.path.join(d, f'{vid}.json')))
    mp3 = os.path.join(d, f'{vid}.mp3')
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', mp3, '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    k = round(cut * SR)
    w = round(0.06 * SR)
    db = 20 * np.log10(np.sqrt(np.mean(x[k - w:k + w] ** 2)) + 1e-9)
    if db > -50:
        sys.exit(f'El corte en {cut} s no cae en silencio ({db:.0f} dB)')
    words = meta['words']
    a_words = [w for w in words if w['s'] < cut]
    b_words = [{**w, 's': round(w['s'] - cut, 3), 'e': round(w['e'] - cut, 3)} for w in words if w['s'] >= cut]
    parts = [(ida, 0.0, cut, a_words), (idb, cut, meta['duration'], b_words)]
    for pid, a, b, ws in parts:
        out = os.path.join(d, f'{pid}.mp3')
        fades = []
        if a > 0:
            fades.append('afade=t=in:st=0:d=0.015')
        if b < meta['duration']:
            fades.append(f'afade=t=out:st={b - a - 0.015:.3f}:d=0.015')
        cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', f'{a:.3f}', '-t', f'{b - a:.3f}', '-i', mp3]
        if fades:
            cmd += ['-af', ','.join(fades)]
        cmd += ['-c:a', 'libmp3lame', '-b:a', '192k', out]
        subprocess.run(cmd, check=True)
        dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', out], capture_output=True, text=True).stdout)
        text = ' '.join(w['w'] for w in ws)
        json.dump({'id': pid, 'hash': f"split:{meta['hash']}", 'text': text, 'duration': round(dur, 3), 'words': ws, 'splitFrom': vid},
                  open(os.path.join(d, f'{pid}.json'), 'w'), ensure_ascii=False, indent=1)
        print(f'{pid}: {dur:.2f} s · {text}')


if __name__ == '__main__':
    main()
