#!/usr/bin/env python3
"""Composition plans de la banda sonora del vídeo nuevo de LibriVox (cuatro piezas, una por acto), con las secciones
alineadas a las escenas (tiempos de lv3_times.py). Cada pieza se alarga 1,2 s para fundirla con la siguiente.
Después: python3 tools/music.py <plan> <mp3>."""
import json, os, subprocess, sys
HERE = os.path.dirname(__file__)
OUT = os.path.join(HERE, '..', 'video', 'public', 'music', 'lv3')
S = {s['id']: s for s in json.loads(subprocess.run([sys.executable, os.path.join(HERE, 'lv3_times.py'), '--json'], capture_output=True, text=True, check=True).stdout)}
FPS = 50
d = lambda sid: S[sid]['dur'] / FPS
item = lambda sid, iid: next(t for i, t, n in S[sid]['items'] if i == iid) / FPS
vo_word = lambda vid, word: next(w['s'] for w in json.load(open(os.path.join(HERE, '..', 'video', 'public', 'lv', 'vo3', vid + '.json')))['words'] if w['w'].startswith(word))
NEG = ['vocals', 'choir', 'spoken word', 'humming', 'distortion', 'dubstep', 'EDM drop', 'trap hi-hats', 'harsh high frequencies', 'rock guitars', 'ukulele', 'whistling']
MIX = 'mix leaves plenty of space for a spoken voice-over in the mid range, no lead melody competing with speech'
GLOBAL = 'premium cinematic documentary score, like a high-end film about an endless library of books read aloud by people'


def sec(name, dur, pos, neg=()):
    return {'section_name': name, 'positive_local_styles': pos, 'negative_local_styles': list(neg), 'duration_ms': int(round(dur * 1000)), 'lines': []}


hit = item('S02', 'K02') + vo_word('K02', 'LibriVox')  # «Esto es LibriVox»: golpe del título
CUES = {
  'c1_opening': ([GLOBAL, 'instrumental', 'tempo 72 BPM', 'felt piano, warm string orchestra, soft celesta, low cello, gentle timpani swell', 'intimate, then awe and wonder', MIX], [
      sec('Library at night', item('S01', 'K01'), ['almost silent warm sustained low string pad', 'a few distant felt piano notes', 'intimate, like a dark quiet library at night, dust in a beam of light', 'no drums'], ['drums', 'bass', 'melody', 'percussion']),
      sec('A human voice', d('S01') - item('S01', 'K01'), ['tender felt piano motif enters', 'soft strings breathe in', 'hopeful'], ['drums']),
      sec('The library lights up', hit, ['slow cinematic rise', 'strings and piano swell, building wonder', 'gentle timpani roll growing', 'ends exactly on a big warm orchestral hit'], ['abrupt', 'dark']),
      sec('Title and what you will learn', d('S02') - hit + d('S03') + 1.2, ['warm full orchestral chord with a sparkle of celesta right at the start', 'then a warm main theme with a light pulse', 'inviting, confident'], ['silence', 'heavy drums'])]),
  'c2_platform': ([GLOBAL, 'instrumental', 'tempo 90 BPM', 'felt piano arpeggios, pizzicato strings, soft marimba, warm upright bass, light shaker and soft kick, airy pads', 'curious, clever, warm, discovery', MIX], [
      sec('Chapter one: the idea', d('S04'), ['soft page-turn intro then a curious piano arpeggio motif', 'light and elegant'], ['heavy drums', 'tense']),
      sec('How it works inside', d('S05'), ['gentle steady pulse, pizzicato strings and marimba interlocking like a well-oiled machine', 'clever, organized'], ['aggressive']),
      sec('Spanish classics', d('S07') + 1.2, ['warmer, nostalgic Spanish guitar color over the same pulse', 'invitation to explore', 'ends on a small lift'], ['sad'])]),
  'c3_tutorial': ([GLOBAL, 'instrumental', 'tempo 104 BPM', 'modern cinematic underscore: felt piano ostinato, pulsing staccato strings, soft electronic percussion, warm sub bass, subtle glassy plucks', 'practical, smooth, confident momentum', MIX], [
      sec('Chapter two: step one', d('S08'), ['short elegant intro then the ostinato starts', 'clean and clear'], ['slow', 'dark']),
      sec('Step two', d('S09'), ['same groove, a layer of light plucks added'], ['busy']),
      sec('Step three', d('S10'), ['groove continues, slightly fuller with soft strings', 'satisfying'], ['heavy']),
      sec('Step four, on the phone', d('S11') + 1.2, ['groove continues with a light airy synth layer', 'modern, fresh', 'ends gently'], ['heavy'])]),
  'c4_ending': ([GLOBAL, 'instrumental', 'tempo 80 BPM', 'felt piano, warm strings, soft cello, celesta, gentle pulses, soft timpani', 'thoughtful, human, then warm and confident resolution', MIX], [
      sec('Chapter three: what to know', d('S06'), ['thoughtful piano and soft strings', 'a hint of caution in minor chords midway', 'steady soft pulse'], ['triumphant', 'drums']),
      sec('Real voices', item('S12', 'K13') - 0.2, ['very sparse warm sustained pad and a few piano notes', 'lots of space for real human voices reading', 'no percussion'], ['drums', 'bass', 'busy melody', 'percussion']),
      sec('Advice', d('S12') - item('S12', 'K13') + 0.2, ['gently lifts, soft pulse returns'], ['heavy drums']),
      sec('Chapter four: the verdict', d('S13'), ['builds warmly with strings and piano', 'confident and satisfying, soft timpani at the end'], ['sad']),
      sec('Outro', d('S14'), ['warm resolving main theme', 'final orchestral chord then soft decay to silence'], ['abrupt cut'])]),
}
os.makedirs(OUT, exist_ok=True)
for name, (pos, sections) in CUES.items():
    plan = {'composition_plan': {'positive_global_styles': pos, 'negative_global_styles': NEG, 'sections': sections}}
    json.dump(plan, open(os.path.join(OUT, f'{name}.plan.json'), 'w'), ensure_ascii=False, indent=1)
    print(name, round(sum(s['duration_ms'] for s in sections) / 1000, 2), 's', [s['duration_ms'] for s in sections])
