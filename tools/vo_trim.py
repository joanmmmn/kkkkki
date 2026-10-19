#!/usr/bin/env python3
"""Deja cada locución limpia al final: corta 0,2 s después del final real de la voz (con un fundido corto) y quita
el ruido o la respiración que ElevenLabs deja a veces detrás. Actualiza `duration` y las palabras del .json.

Uso: python3 tools/vo_trim.py video/public/skg/vo [--only G01,G02] [--pad 0.2]
Después: python3 tools/vo_post.py <dir> (recalcula speechEnd).
"""
import json, os, re, subprocess, sys


def real_end(mp3, last_word_start):
    out = subprocess.run(['ffmpeg', '-hide_banner', '-i', mp3, '-af', 'silencedetect=noise=-45dB:d=0.12', '-f', 'null', '-'], capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r'silence_start: ([0-9.]+)', out)]
    ends = [float(x) for x in re.findall(r'silence_end: ([0-9.]+)', out)]
    m = re.search(r'Duration: (\d+):(\d+):([\d.]+)', out)
    dur = int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))
    # último silencio que empieza después del inicio de la última palabra: ahí acaba la voz
    cands = [s for s in starts if s > last_word_start + 0.1]
    if cands:
        return min(cands), dur
    return dur, dur


def main():
    d = sys.argv[1]
    only = set(sys.argv[sys.argv.index('--only') + 1].split(',')) if '--only' in sys.argv else None
    pad = float(sys.argv[sys.argv.index('--pad') + 1]) if '--pad' in sys.argv else 0.2
    for name in sorted(os.listdir(d)):
        if not name.endswith('.json') or name == 'vo.json':
            continue
        vid = name[:-5]
        if only and vid not in only:
            continue
        mp3 = os.path.join(d, vid + '.mp3')
        meta = json.load(open(os.path.join(d, name)))
        if meta.get('trimmed') == meta.get('hash'):
            print(f'{vid}: ya recortada')
            continue
        last = meta['words'][-1]['s'] if meta.get('words') else 0
        end, dur = real_end(mp3, last)
        cut = min(dur, end + pad)
        fade = 0.12
        tmp = mp3 + '.tmp.mp3'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', mp3, '-af', f'atrim=0:{cut:.3f},afade=t=out:st={max(0, cut - fade):.3f}:d={fade}',
                        '-c:a', 'libmp3lame', '-b:a', '128k', '-ar', '44100', tmp], check=True)
        os.replace(tmp, mp3)
        meta['duration'] = round(cut, 3)
        for w in meta['words']:
            w['e'] = min(w['e'], round(cut, 3))
        meta['trimmed'] = meta.get('hash')
        json.dump(meta, open(os.path.join(d, name), 'w'), ensure_ascii=False, indent=1)
        print(f'{vid}: {dur:.2f} s → {cut:.2f} s (voz hasta {end:.2f} s)')


if __name__ == '__main__':
    main()
