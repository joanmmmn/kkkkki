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
    # AUTOR · Stephen King (14/10/2026)
    'sk_crumple': ('Crumpling a sheet of paper into a tight ball with both hands, close up, dry, no music', 1.0, 0.7),
    'sk_bin': ('A crumpled paper ball dropping into an empty metal waste basket, short, close up, dry', 0.8, 0.7),
    'sk_uncrumple': ('Unfolding and smoothing out a crumpled sheet of paper on a wooden desk, close up, dry', 1.4, 0.7),
    'sk_typebell': ('Vintage manual typewriter carriage return: small bell ding and carriage slide, close up, dry', 1.0, 0.7),
    'sk_typing': ('Vintage manual typewriter, a quick burst of fast keystrokes, close up, dry, no music', 1.8, 0.7),
    'sk_wind': ('Cold winter wind blowing softly around a house at night, low and eerie, steady, no music', 6.0, 0.5),
    'sk_door': ('Heavy old wooden door slowly creaking open in an empty hallway, eerie, close up', 2.2, 0.7),
    'sk_heart': ('Two slow deep heartbeats, cinematic low thumps, clean, no music', 1.8, 0.7),
    'sk_thunder': ('Distant soft rolling thunder, cinematic, no rain, no music', 3.5, 0.6),
    'sk_clock': ('Old mechanical wall clock ticking slowly, four ticks, close up, dry', 2.2, 0.7),
    'sk_pin': ('A thumbtack being pushed into a cork notice board, crisp short click with a soft thud, close up', 0.7, 0.5),
    'sk_string': ('Taut red string pulled quickly across a cork board, soft rubbing swish ending in a tiny twang', 0.9, 0.6),
    'sk_book_thud': ('Heavy hardcover book dropped flat onto a wooden table, deep solid thud, close up, dry', 0.8, 0.7),
    'sk_book_slide': ('A book sliding into place on a wooden bookshelf, short, close up, dry', 0.7, 0.7),
    'sk_projector': ('Old film projector starting up and running, mechanical rattle, short, close up', 2.2, 0.6),
    'sk_chime': ('Soft subway station chime, two gentle tones, clean, modern, no voice', 1.3, 0.7),
    'sk_peel': ('Peeling a paper sticker label off a book cover, short crisp tearing peel, close up', 0.8, 0.7),
    'sk_snow': ('Footsteps crunching in fresh deep snow, three slow steps, close up, no wind', 1.8, 0.6),
    # La historia detrás del libro · Cien años de soledad (14/10/2026)
    'hdl_scale': ('Heavy parcel set down on an old mechanical postal scale, metal platform clunk, spring creak and the needle wobbling, close up, dry, no music', 1.8, 0.7),
    'hdl_stack': ('Thick stack of typed manuscript paper dropped flat on a wooden counter, solid papery thud, close up, dry', 0.8, 0.7),
    'hdl_split': ('Splitting a thick stack of paper in two halves and sliding them apart on a wooden counter, papery shuffle, close up, dry', 1.2, 0.7),
    'hdl_wrap': ('Wrapping a parcel in brown kraft paper and tying it tight with string, quick crinkle, close up, dry', 1.5, 0.7),
    'hdl_car': ('Vintage 1960s car driving along a winding mountain road, warm engine hum passing steadily, no horn, no music', 6.0, 0.5),
    'hdl_uturn': ('Old car making a quick U-turn on a gravel road, tires crunching and engine revving, close, no music', 2.2, 0.6),
    'hdl_ice': ('Delicate magical ice crystal shimmer, glassy cold chime with a soft sparkle tail, clean, no music', 2.0, 0.6),
    'hdl_bell': ('Boxing ring bell, three quick rings ding ding ding, close up, dry', 1.4, 0.7),
    'hdl_register': ('Vintage mechanical cash register, keys and a bright ka-ching bell with the drawer sliding open, close up, dry', 1.2, 0.7),
    'hdl_pawn': ('Small object set down on a glass shop counter followed by a paper receipt torn from a pad, close up, dry', 1.2, 0.7),
    'hdl_press': ('Vintage letterpress printing press running, rhythmic heavy mechanical clatter of rollers and sheets, steady, no music', 5.0, 0.6),
    'hdl_flutter': ('Soft flutter of a few butterfly wings passing close by, gentle airy papery rustle, magical, clean, no music', 1.6, 0.6),
    'hdl_knock': ('Three friendly knocks on a wooden front door, close up, dry', 1.0, 0.7),
    'hdl_tv': ('Old 1960s tube television switching off, short static crackle and a fading electric whine, close up', 1.2, 0.7),
    'hdl_dryer': ('Old 1960s handheld hair dryer whirring for a moment and switching off with a click, close up, dry', 1.5, 0.7),
    'hdl_blender': ('Vintage kitchen blender motor whirring briefly and stopping, close up, dry', 1.4, 0.7),
    'hdl_tear': ('Tearing a single sheet of paper off a notepad, crisp, close up, dry', 0.6, 0.7),
    'hdl_mail': ('Parcel dropped into a canvas mail sack, soft muffled thud, close up, dry', 0.7, 0.7),
    'hdl_film': ('Film strip running fast through a vintage projector gate, rapid mechanical flutter then a click, close up', 1.6, 0.6),
    # v2 (15/10/2026)
    'hdl_applause': ('Warm audience applause in a large concert hall, polite steady clapping that swells and settles, no cheering, no voices, no music', 5.0, 0.6),
    # v2, segunda pasada de sonido (15/10/2026)
    'hdl_pencil_write': ('Writing quickly with a graphite pencil on a sheet of paper lying on a wooden counter, continuous scratchy handwriting strokes, close up, dry, no music', 2.2, 0.7),
    'hdl_pencil_line': ('A single quick pencil line drawn firmly under a word on paper, short graphite scratch, close up, dry', 0.6, 0.7),
    'hdl_pencil_tap': ('A single light tap of the end of a pencil on a wooden counter, short dry knock, close up', 0.5, 0.7),
    'hdl_candle': ('Striking a wooden match and lighting a small birthday candle, soft flame puff, close up, quiet, no music', 1.8, 0.7),
    'hdl_clapper': ('Movie set: a wooden clapperboard is snapped shut with a loud crisp clack, then quiet set ambience, no voice', 1.5, 0.45),
    'hdl_spotlight': ('Old theatre spotlight switched on, heavy electrical clunk followed by a faint warm hum, close up', 1.3, 0.6),
    'hdl_crickets': ('Warm tropical night ambience, gentle crickets and a few distant frogs, very calm and steady, no music, no voices', 10.0, 0.5),
    'hdl_city_night': ('A big city at night far away, soft distant traffic hum and a faint breeze, very calm and steady, no horns, no sirens, no music', 10.0, 0.5),
    'hdl_paper_slide': ('A sheet of paper sliding quickly across a wooden table and stopping, soft papery swish, close up, dry', 0.8, 0.7),
    'hdl_folder': ('A cardboard folder pushed across a long wooden table, soft slide and gentle stop, close up, dry', 1.1, 0.7),
    'hdl_tally': ('Old mechanical number counter rolling up quickly, fast light metallic clicking that slows down and stops, close up', 1.6, 0.6),
    'hdl_truck': ('Small 1960s delivery van arriving on a city street and stopping, engine idling and a soft brake squeak, no horn, no music', 3.0, 0.6),
    'hdl_shop_bell': ('Small brass bell on a shop door ringing as the door opens, one gentle jingle, close up', 1.2, 0.7),
    'hdl_steps_stage': ('Calm footsteps of a man in leather shoes walking across a wooden stage, about six steps, large concert hall reverb', 3.0, 0.6),
    'hdl_steps_night': ('Calm unhurried footsteps on a dirt road at night, slow steps, quiet, no music', 4.0, 0.6),
    'hdl_paper_whoosh': ('A large sheet of paper swept quickly through the air, soft papery whoosh, clean, no music', 0.8, 0.6),
    'hdl_rocking': ('An old wooden rocking chair rocking slowly on a wooden floor, clear rhythmic wood creaks every second, close up, no music', 5.0, 0.6),
    'hdl_envelope': ('A paper envelope dropped onto a wooden desk, soft papery slap, close up, dry', 0.6, 0.7),
    'hdl_lights_off': ('Lights of an empty old building switched off for the night: a heavy wall switch clunk and a faint electrical hum fading out, no music', 1.6, 0.6),
    'hdl_switch': ('An old wall light switch flipped once, single solid click, close up, dry', 0.5, 0.7),
    'hdl_sign_hang': ('A small wooden sign hung on a hook by a short chain, light chain rattle and a soft knock against glass, close up', 1.0, 0.6),
    'hdl_flash': ('Several vintage press camera flashbulbs popping quickly in a concert hall, soft pops and shutter clicks, no voices', 1.6, 0.6),
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
