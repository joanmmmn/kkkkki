#!/usr/bin/env python3
"""Añade `speechEnd` (fin real de la voz, sin el silencio final) a las locuciones generadas por tools/tts.py.

Uso: python3 tools/vo_post.py video/public/nxr/vo [--only R01,R02]
El vídeo usa speechEnd para medir cada escena (lib/vo.ts → voSpeechFrames).
"""
import json, os, re, subprocess, sys


def speech_end(mp3: str, duration: float, last_word_start: float) -> float:
    out = subprocess.run(['ffmpeg', '-hide_banner', '-i', mp3, '-af', 'silencedetect=noise=-45dB:d=0.12', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r'silence_start: ([0-9.]+)', out)]
    ends = [float(x) for x in re.findall(r'silence_end: ([0-9.]+)', out)]
    end = duration
    # El mp3 decodificado puede durar unas centésimas menos que `duration` (relleno del códec): se mira el final real.
    m = re.search(r'time=(\d+):(\d+):([\d.]+)', out.split('silence_end')[-1]) or re.search(r'Duration: (\d+):(\d+):([\d.]+)', out)
    decoded = int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3)) if m else duration
    file_end = min(duration, decoded)
    # Si el archivo termina en silencio (el último silencio no se cierra, o se cierra justo al final del archivo), la voz acaba ahí.
    if starts and (not ends or starts[-1] > ends[-1] or ends[-1] >= file_end - 0.1):
        end = starts[-1]
    # El alineamiento estira la última palabra hasta el final del archivo: como suelo, su inicio más un cuarto de segundo.
    return round(min(duration, max(end, last_word_start + 0.25) + 0.04), 3)


def main():
    d = sys.argv[1]
    only = set(sys.argv[sys.argv.index('--only') + 1].split(',')) if '--only' in sys.argv else None
    for name in sorted(os.listdir(d)):
        if not name.endswith('.json') or name == 'vo.json':
            continue
        vid = name[:-5]
        if only and vid not in only:
            continue
        meta_path = os.path.join(d, name)
        mp3 = os.path.join(d, vid + '.mp3')
        if not os.path.exists(mp3):
            continue
        meta = json.load(open(meta_path))
        last = meta['words'][-1]['s'] if meta.get('words') else 0
        meta['speechEnd'] = speech_end(mp3, meta['duration'], last)
        json.dump(meta, open(meta_path, 'w'), ensure_ascii=False, indent=1)
        print(f"{vid}: {meta['duration']:.2f} s, voz hasta {meta['speechEnd']:.2f} s")


if __name__ == '__main__':
    main()
