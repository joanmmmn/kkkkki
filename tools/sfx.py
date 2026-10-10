#!/usr/bin/env python3
"""Genera la paleta de efectos de sonido con ElevenLabs (sound-generation).

Uso: ELEVENLABS_API_KEY=... python3 tools/sfx.py [nombre ...]
Sin nombres, genera los que falten en video/public/sfx/. Con nombres, los regenera.
Después normaliza cada efecto a un pico de -1 dBFS y recorta el silencio inicial,
para que el `at` de <Sfx> caiga justo en el ataque del sonido.
"""
import json, os, subprocess, sys, urllib.request

OUT = os.path.join(os.path.dirname(__file__), '..', 'video', 'public', 'sfx')
KIT = {
    # nombre: (prompt, duración en s, prompt_influence)
    'ui_tap': ('Soft premium UI tap, glassy and short, modern app interface, clean, dry, no music', 0.5, 0.7),
    'ui_pop': ('Soft round bubble pop, warm and tiny, premium app interface, clean, dry', 0.5, 0.7),
    'swipe': ('Quick subtle air swipe for a sliding card, short soft whoosh, clean, dry', 0.6, 0.6),
    'zoom_in': ('Camera zoom in swoosh, rising airy whoosh with a soft tail, cinematic interface sound', 0.9, 0.6),
    'zoom_out': ('Camera zoom out swoosh, descending airy whoosh, cinematic interface sound', 0.9, 0.6),
    'focus': ('Soft focus ping, subtle bright glassy shimmer to highlight a detail on screen, short', 0.8, 0.6),
    'draw': ('Felt-tip marker quickly drawing a rectangle outline on paper, short swish, close up', 0.7, 0.7),
    'hit_soft': ('Soft modern cinematic hit, warm low thump with a short airy tail, clean', 1.0, 0.6),
    'transition': ('Smooth cinematic transition swoosh ending in a soft low thump, clean, modern', 1.1, 0.6),
    'stamp': ('Rubber stamp hitting paper hard, punchy and satisfying, close up, dry', 0.6, 0.7),
    'coins': ('A few coins dropping onto a wooden table, short bright metallic jingle, clean', 1.0, 0.6),
    'success': ('Short positive success chime, two ascending notes, warm modern app sound', 0.8, 0.7),
    'fail': ('Short soft negative tone, two descending muted notes, modern app sound, not harsh', 0.7, 0.7),
    'card_flip': ('Quick crisp paper card flip, close up, dry', 0.5, 0.7),
    'tick_soft': ('Very soft tiny wooden tick, single click, dry, close up', 0.5, 0.8),
    'sparkle': ('Short delicate sparkle twinkle, soft magical glitter, clean', 0.9, 0.6),
    'bass_drop': ('Deep sub bass drop boom for a dramatic reveal, cinematic trailer hit, clean, no music', 2.0, 0.6),
    'reverse_swell': ('Reverse cymbal swell building up into a sudden stop, short, cinematic', 1.6, 0.6),
    'phone_tap': ('Finger tapping a smartphone glass screen, soft, close up, dry', 0.5, 0.7),
    'logo_sting': ('Short premium brand logo sting, warm bright synth chord swell with a sparkle on top, elegant, clean', 2.6, 0.5),
    'page_riffle': ('Fast riffle through the pages of a thick book, short, crisp, close up', 1.0, 0.7),
    'snap_in': ('Tight snappy interface element snapping into place, short click with a tiny thump, clean', 0.5, 0.7),
}


def gen(name: str) -> None:
    prompt, dur, infl = KIT[name]
    body = json.dumps({'text': prompt, 'duration_seconds': dur, 'prompt_influence': infl}).encode()
    req = urllib.request.Request(
        'https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_192', data=body,
        headers={'xi-api-key': os.environ['ELEVENLABS_API_KEY'], 'Content-Type': 'application/json'})
    raw = os.path.join(OUT, f'_{name}.raw.mp3')
    with urllib.request.urlopen(req, timeout=120) as r, open(raw, 'wb') as f:
        f.write(r.read())
    finish(raw, os.path.join(OUT, f'{name}.mp3'))
    os.remove(raw)
    print('ok', name)


def finish(src: str, dst: str) -> None:
    # Recorta el silencio inicial (< -45 dB), normaliza el pico a -1 dBFS y añade un fundido de salida corto.
    peak = subprocess.run(['ffmpeg', '-v', 'info', '-i', src, '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,volumedetect', '-f', 'null', '-'],
                          capture_output=True, text=True).stderr
    mx = float(peak.split('max_volume:')[1].split('dB')[0]) if 'max_volume:' in peak else 0.0
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', src], capture_output=True, text=True).stdout or 1)
    af = f'silenceremove=start_periods=1:start_threshold=-45dB,volume={-1 - mx:.2f}dB,afade=t=out:st={max(0.0, dur - 0.12):.3f}:d=0.12'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', af, '-ar', '48000', '-b:a', '192k', dst], check=True)


if __name__ == '__main__':
    names = sys.argv[1:] or [n for n in KIT if not os.path.exists(os.path.join(OUT, f'{n}.mp3'))]
    for n in names:
        gen(n)
