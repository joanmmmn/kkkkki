#!/usr/bin/env python3
"""Silencia la cola de cada locución después de `speechEnd` (fundido de 70 ms).

ElevenLabs a veces deja al final del archivo un ruidito con voz (una «m», un clic) tras el silencio; el vídeo reproduce
el archivo entero, así que se oye. Uso (después de tools/vo_post.py):
  python3 tools/vo_tailfade.py video/public/hdl/vo [--only W02,W29]
La duración del archivo no cambia y la voz no se desplaza. Reescribe los mp3 a 192 kb/s.
"""
import json, os, subprocess, sys, tempfile

d = sys.argv[1]
only = set(sys.argv[sys.argv.index('--only') + 1].split(',')) if '--only' in sys.argv else None
for name in sorted(os.listdir(d)):
    if not name.endswith('.json') or name == 'vo.json':
        continue
    vid = name[:-5]
    if only and vid not in only:
        continue
    meta = json.load(open(os.path.join(d, name)))
    se = meta.get('speechEnd')
    mp3 = os.path.join(d, vid + '.mp3')
    if se is None or not os.path.exists(mp3):
        continue
    tmp = tempfile.mktemp(suffix='.mp3')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', mp3, '-af', f'afade=t=out:st={se + 0.02:.3f}:d=0.07', '-ar', '44100', '-b:a', '192k', tmp], check=True)
    os.replace(tmp, mp3)
    print(f'{vid}: silencio desde {se + 0.02:.2f} s')
