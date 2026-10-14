#!/usr/bin/env python3
"""Composition plans de la banda sonora del vídeo de eBiblio («la puerta»): cuatro piezas, una por acto, con las
secciones alineadas a las escenas (tiempos de eb_times.py). Cada pieza se alarga 1,2 s para fundirla con la siguiente.
Después: python3 tools/music.py <plan> <mp3> y normalizar a -16 LUFS (…_n.mp3)."""
import json, os, subprocess, sys
HERE = os.path.dirname(__file__)
OUT = os.path.join(HERE, '..', 'video', 'public', 'music', 'eb')
S = {s['id']: s for s in json.loads(subprocess.run([sys.executable, os.path.join(HERE, 'eb_times.py'), '--json'], capture_output=True, text=True, check=True).stdout)}
FPS = 50
d = lambda sid: S[sid]['dur'] / FPS
item = lambda sid, iid: next(t for i, t, n in S[sid]['items'] if i == iid) / FPS
vo_word = lambda vid, word: next(w['s'] for w in json.load(open(os.path.join(HERE, '..', 'video', 'public', 'eb', 'vo', vid + '.json')))['words'] if w['w'].startswith(word))
NEG = ['vocals', 'choir', 'spoken word', 'humming', 'distortion', 'dubstep', 'EDM drop', 'trap hi-hats', 'harsh high frequencies', 'rock guitars', 'dark', 'horror', 'sad', 'whistling', 'kazoo',
       'silence', 'long pauses', 'breaks', 'stops']
MIX = 'mix leaves plenty of space for a spoken voice-over in the mid range, no lead melody competing with speech, music plays continuously without gaps until the very end'
GLOBAL = 'bright daytime explainer score for a friendly public library service, warm illustrated world, playful but elegant, premium'


def sec(name, dur, pos, neg=()):
    return {'section_name': name, 'positive_local_styles': pos, 'negative_local_styles': list(neg), 'duration_ms': int(round(dur * 1000)), 'lines': []}


door = item('T01', 'B01') + vo_word('B01', 'puedes')  # la puerta se abre
b02 = item('T01', 'B02')
hit = b02 + vo_word('B02', 'Esto')  # «Esto es eBiblio»
CUES = {
  'c1_opening': ([GLOBAL, 'instrumental', 'tempo 100 BPM', 'pizzicato strings, marimba, glockenspiel, warm upright bass, soft brushed drums, light hand claps, felt piano', 'curious then joyful and bright', MIX], [
      sec('A door opens to a bright library', b02, ['starts with light curious pizzicato and a soft tick of percussion (a card beeps at a door)', f'at {door:.1f} s a warm swell as the door opens, then a bright marimba and pizzicato groove', 'wonder, sunshine'], ['dark', 'big drums']),
      sec('Half a million loans, free', hit - b02, ['groove continues with hand claps and glockenspiel', 'confident and cheerful', 'small build at the end'], ['tense']),
      sec('This is eBiblio, in your pocket', d('T01') - hit, ['bright warm chord hit with glockenspiel sparkle right at the start, then light groove', 'feel-good'], ['silence']),
      sec('A corridor of doors: what you will learn', d('T02') + 1.2, ['steady light groove, walking feel, pizzicato and marimba', 'inviting, clear', 'ends on a small lift'], ['heavy'])]),
  'c2_what': ([GLOBAL, 'instrumental', 'tempo 92 BPM', 'felt piano arpeggios, pizzicato strings, soft marimba, warm bass, light shaker and soft kick', 'clever, warm, explanatory', MIX], [
      sec('Chapter one: a door opens', d('T03'), ['short door-opening flourish then a curious piano and pizzicato motif', 'light and elegant'], ['heavy drums', 'tense']),
      sec('Copies and queues, like the library', d('T04'), ['playful plucky rhythm, marimba and pizzicato interlocking', 'gentle humor'], ['aggressive']),
      sec('Every region has its own eBiblio', d('T05'), ['warm build with soft strings over the pulse', 'a map lighting up, discovery'], ['sad']),
      sec('Chapter two: the library card', d('T06') + 1.2, ['bright and simple, light claps', 'friendly, easy', 'ends gently'], ['heavy'])]),
  'c3_steps': ([GLOBAL, 'instrumental', 'tempo 108 BPM', 'modern light underscore: felt piano ostinato, plucked strings, marimba, soft electronic percussion, warm bass, subtle glassy plucks', 'practical, smooth, confident momentum', MIX], [
      sec('Chapter three: step one', d('T07'), ['short door-opening flourish then the ostinato starts', 'clean and clear'], ['slow', 'dark']),
      sec('Step two: search', d('T08'), ['same groove, a layer of light plucks added'], ['busy']),
      sec('Step three: borrow or reserve', d('T09'), ['groove continues, slightly fuller with soft strings', 'satisfying'], ['heavy']),
      sec('Step four: listen', d('T10'), ['groove continues with a light airy synth layer', 'modern, fresh'], ['heavy']),
      sec('It returns itself after 21 days', d('T11') + 1.2, ['lighter, playful, a little bounce', 'ends gently'], ['heavy'])]),
  'c4_ending': ([GLOBAL, 'instrumental', 'tempo 96 BPM', 'felt piano, pizzicato strings, marimba, warm strings, soft percussion, glockenspiel', 'wry and thoughtful, then uplifting and warm resolution', MIX], [
      sec('Chapter four: the queues', d('T12'), ['short door flourish then a wry, slightly mischievous pizzicato with a hint of minor', 'waiting in line, humorous'], ['dark', 'scary']),
      sec('But there is a trick', d('T13'), ['brightens: major key, lights turning on, marimba and claps', 'relief and delight'], ['tense']),
      sec('How many at once, most borrowed', d('T14'), ['light steady groove, glockenspiel sparkle at the end'], ['heavy']),
      sec('Chapter five: the verdict', d('T15'), ['short door flourish then a warm build with strings and piano', 'confident and satisfying, a soft chime at the end'], ['sad']),
      sec('Outro', d('T16'), ['warm resolving main theme', 'final bright chord then soft decay to silence'], ['abrupt cut'])]),
}
os.makedirs(OUT, exist_ok=True)
for name, (pos, sections) in CUES.items():
    plan = {'composition_plan': {'positive_global_styles': pos, 'negative_global_styles': NEG, 'sections': sections}}
    json.dump(plan, open(os.path.join(OUT, f'{name}.plan.json'), 'w'), ensure_ascii=False, indent=1)
    print(name, round(sum(s['duration_ms'] for s in sections) / 1000, 2), 's', [s['duration_ms'] for s in sections])
