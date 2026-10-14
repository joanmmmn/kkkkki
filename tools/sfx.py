#!/usr/bin/env python3
"""Genera la paleta de efectos de sonido con ElevenLabs (sound-generation).

Uso: python3 tools/sfx.py [nombre ...]   (la clave se lee de .secrets/elevenlabs.env, como en tools/tts.py)
Sin nombres, genera los que falten en video/public/sfx/. Con nombres, los regenera.
Después normaliza cada efecto a un pico de -1 dBFS y recorta el silencio inicial,
para que el `at` de <Sfx> caiga justo en el ataque del sonido.
"""
import json, os, subprocess, sys, urllib.request

sys.path.insert(0, os.path.dirname(__file__))
from tts import load_key  # noqa: E402

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
    # v2 de la reseña de ElevenReader: más variedad para transiciones, cursor, página web y contadores.
    'whip': ('Very fast whip pan swoosh, camera whip transition, airy and crisp, short', 0.5, 0.7),
    'swish_up': ('Short soft upward swish as a card rises into view, airy, clean, modern interface', 0.5, 0.7),
    'mouse_click': ('Realistic computer mouse click, single crisp click, close up, dry', 0.5, 0.8),
    'scroll': ('Smooth mouse wheel scrolling, soft quick ratchet clicks, close up, dry', 0.9, 0.7),
    'glass_ping': ('Tiny bright glass ping to highlight an element on screen, clean, short', 0.6, 0.7),
    'paper_slide': ('Sheet of paper sliding quickly across a desk, short, close up', 0.6, 0.7),
    'pop_bright': ('Bright crisp bubble pop, playful, short, clean interface sound', 0.5, 0.8),
    'ff_scrub': ('Fast forward tape scrub chirp, playful rewind and fast forward sound effect, short', 1.0, 0.6),
    'notify': ('Gentle modern notification chime, two soft bell notes, friendly, clean', 0.9, 0.7),
    'receipt': ('Small thermal receipt printer printing a short receipt, close up, clean', 1.4, 0.7),
    'switch': ('Small light switch flip, crisp plastic click, close up, dry', 0.5, 0.8),
    'magnify': ('Soft optical lens zoom, short airy rising shimmer with a subtle click, interface sound', 0.7, 0.6),
    'score_ding': ('Satisfying score reveal ding, warm bell with soft sparkle tail, game show but elegant', 1.2, 0.6),
    'glitch': ('Tiny clean digital glitch blip for a screen change, short, modern, not harsh', 0.5, 0.7),
    'tick_fast': ('Fast sequence of soft mechanical counter ticks accelerating, short, clean', 0.9, 0.7),
    'boom_soft': ('Soft cinematic boom with a warm low tail for a title reveal, clean, not loud', 1.6, 0.6),
    'swoosh_down': ('Short descending whoosh as an element drops into place ending in a soft thud, clean', 0.6, 0.7),
    # Vídeo nuevo de LibriVox («la biblioteca que habla»): libro, papel, luz y movimientos de cámara cinematográficos.
    'book_open': ('Heavy old hardcover book being opened on a wooden desk, clear leather creak and crisp paper rustle, close up, present and clear', 1.6, 0.7),
    'page_turn_big': ('Slow cinematic page turn of a large old book, crisp paper with a soft airy whoosh, close up', 1.3, 0.6),
    'lights_on': ('Row of warm vintage lamps switching on one after another in a large quiet library hall, soft deep clunks with a gentle electric hum, cinematic', 2.4, 0.5),
    'reveal_whoosh': ('Deep slow cinematic whoosh rising into a soft airy impact, a camera pulling back through a vast hall, warm, no metal', 2.2, 0.5),
    'dust_shimmer': ('Very soft magical shimmer of dust particles floating in a beam of light, delicate and airy, quiet', 2.0, 0.6),
    'pen_scratch': ('Fountain pen writing a short word on paper, quick scratch, close up, dry', 0.8, 0.7),
    'pen_underline': ('Quick pencil underline stroke on paper, short swish, close up, dry', 0.5, 0.7),
    'paper_lift': ('Soft airy lift of a sheet of paper rising from a desk, gentle short whoosh, close up', 0.7, 0.6),
    'card_drop': ('Thin cardboard library card dropping onto a wooden desk, soft tap, close up, dry', 0.5, 0.7),
    'date_stamp': ('Library date stamp pressed firmly onto a paper card, mechanical clack and soft thud, close up, dry', 0.6, 0.7),
    'deep_whoosh': ('Smooth deep cinematic whoosh, slow camera move through space, soft and warm, no impact', 1.4, 0.6),
    'soft_impact': ('Soft warm cinematic low impact with a felt-like thud and a short reverb tail, elegant, no metal', 1.4, 0.6),
    'phone_whoosh': ('Smartphone sliding into view with a soft airy whoosh and a tiny glass tick at the end', 0.8, 0.6),
    'file_pop': ('Small paper file popping out of a page with a soft paper flick and a tiny airy pop, close up', 0.5, 0.7),
    'ink_bloom': ('Soft wet ink drop spreading on paper, gentle organic swish, close up, quiet', 0.9, 0.6),
    # Vídeo de eBiblio («la puerta»): puertas, carné, turnos, recibos y móvil, en un mundo de día y plano.
    'nfc_beep': ('Contactless card reader accepting a card: one short friendly high electronic beep with a tiny plastic tap, clean, dry', 0.5, 0.75),
    'door_open': ('Wooden door latch clicking open followed by a short soft hinge creak as the door swings inward, warm room tone, close up, clean', 1.3, 0.65),
    'door_thud': ('Wooden door closing softly with a muffled thud and a small latch click, close up, clean', 0.7, 0.7),
    'light_swell': ('Warm bright airy swell of light flooding a room, soft shimmering pad rising and fading, magical but subtle, no melody', 1.6, 0.55),
    'ticket_pull': ('Paper number ticket pulled from a take-a-number dispenser, quick paper tear with a small plastic click, close up, dry', 0.6, 0.75),
    'service_bell': ('Small desk service bell ding, bright single ring with short decay, close up, clean', 1.0, 0.7),
    'envelope': ('An email notification whoosh: a paper envelope flying in and landing on a desk with a crisp paper flap, close up, clear and present', 1.0, 0.6),
    'unlock': ('Small metal padlock unlocking, crisp mechanical click with a tiny spring, close up, dry', 0.5, 0.75),
    'calendar_flip': ('Fast flipping of the pages of a small tear-off desk calendar, rapid crisp paper flicks, close up', 1.2, 0.7),
    'pocket_slide': ('Smartphone sliding into a jeans pocket, soft fabric rustle and swish, close up, dry', 0.7, 0.7),
    'sticker_slap': ('Thick vinyl sticker slapped onto a surface by hand, short satisfying pat with a tiny paper crackle, close up, dry', 0.5, 0.75),
    'cardboard_pop': ('Flat cardboard cut-out shape popping up into place, light cardboard flap with a tiny bounce, playful, close up, dry', 0.5, 0.75),
    'map_rise': ('Stack of small wooden blocks rising and clicking into place one after another, soft playful wooden taps, close up', 1.2, 0.65),
    'crowd_soft': ('Very soft murmur of a small queue of people waiting in a quiet public library, a few footsteps, distant, gentle', 2.0, 0.55),
    'keys_type': ('Soft quick typing on a smartphone touch keyboard, light taps, close up, dry', 0.9, 0.7),
}


def gen(name: str) -> None:
    prompt, dur, infl = KIT[name]
    body = json.dumps({'text': prompt, 'duration_seconds': dur, 'prompt_influence': infl}).encode()
    req = urllib.request.Request(
        'https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_192', data=body,
        headers={'xi-api-key': load_key(), 'Content-Type': 'application/json'})
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
