#!/usr/bin/env python3
"""Escribe los composition plans de las 6 músicas de la reseña de ElevenReader (v2), con las secciones
alineadas a las escenas (lee los tiempos con er2_times.py). Después: python3 tools/music.py <plan> <mp3>.
Cada pista se alarga 1,2 s para poder fundirla con la siguiente en el corte."""
import json, os, subprocess, sys
HERE = os.path.dirname(__file__)
OUT = os.path.join(HERE, '..', 'video', 'public', 'music', 'er2')
S = {s['id']: s for s in json.loads(subprocess.run([sys.executable, os.path.join(HERE, 'er2_times.py'), '--json'], capture_output=True, text=True, check=True).stdout)}
FPS = 50
d = lambda sid: S[sid]['dur'] / FPS
item = lambda sid, iid: next(t for i, t, n in S[sid]['items'] if i == iid) / FPS
NEG = ['vocals', 'choir', 'spoken word', 'humming', 'distortion', 'lo-fi crackle', 'dubstep', 'heavy EDM drop', 'harsh high frequencies']
MIX = 'mix leaves plenty of space for a spoken voice-over in the mid range, no lead melody competing with speech'

def sec(name, dur, pos, neg=()):
    return {'section_name': name, 'positive_local_styles': pos, 'negative_local_styles': list(neg), 'duration_ms': int(round(dur * 1000)), 'lines': []}

CUES = {
  'c1_hook': (['instrumental cinematic tech-trailer intro for a YouTube app review', 'tempo 110 BPM', 'pulsing analog synth bass, punchy modern drums, shimmering arpeggios, deep sub hits', 'curious, bold, modern', MIX], [
      sec('Cold open', item('X01', 'W01'), ['very quiet airy ambient pad', 'soft low drone', 'mysterious and intimate', 'no drums'], ['drums', 'bass', 'melody']),
      sec('Hook build', d('X01') - item('X01', 'W01'), ['pulsing synth bass enters', 'kick on every beat builds tension', 'rising filter sweep', 'ends with a big confident hit'], ['calm']),
      sec('Promise groove', d('X02') + 1.2, ['confident driving groove at full energy', 'bright plucked synth hook', 'tight claps', 'optimistic momentum'], ['dark'])]),
  'c2_core': (['instrumental warm indie-pop background for a tech review', 'tempo 96 BPM', 'felt piano, plucked nylon guitar, soft analog synths, warm bass, brushed drums and shaker', 'friendly, curious, clear', MIX], [
      sec('What it is', d('X03'), ['light and curious', 'felt piano motif with soft shaker', 'gentle bass'], ['heavy drums']),
      sec('Audiobook catalogue', d('X04'), ['groove settles in', 'warm bass line', 'soft kick and snare', 'a hint of doubt in the harmony toward the end'], ['aggressive']),
      sec('Your own documents', d('X05') + 1.2, ['brighter and more playful', 'plucky synth arpeggio', 'momentum builds', 'feels like a pleasant surprise'], ['sad'])]),
  'c3_voices': (['instrumental intimate ambient underscore', 'slow tempo 72 BPM', 'warm felt piano, soft string pad, gentle glassy textures', 'tender, minimal, lots of space', MIX], [
      sec('Two voices', item('X06', 'W08') - 0.2, ['almost silent sustained pad', 'very sparse soft piano notes', 'no percussion'], ['drums', 'bass', 'busy melody']),
      sec('A thousand voices', d('X06') - item('X06', 'W08') + 0.2 + 1.2, ['gently lifts', 'soft pulse enters', 'airy shimmer', 'hopeful'], ['heavy drums'])]),
  'c4_features': (['instrumental upbeat funky pop background for a product walkthrough', 'tempo 112 BPM', 'clean funky electric guitar, round slap-like synth bass, claps, tight drums, bright plucks', 'playful, energetic, fun', MIX], [
      sec('Reader options', d('X07'), ['bouncy groove starts on the first beat', 'staccato guitar chops', 'tight drums'], ['slow intro']),
      sec('More features', d('X08') + 1.2, ['same groove with extra percussion', 'quick fills', 'lively'], ['calm'])]),
  'c5_verdict': (['instrumental modern chill hip-hop beat that builds into an uplifting anthem', 'tempo 88 BPM', 'dusty drums, warm Rhodes electric piano, deep round bass, soft synth brass', 'thoughtful then confident', MIX], [
      sec('The best', item('X09', 'W11B') - 0.2, ['head-nodding positive beat', 'warm Rhodes chords', 'light'], ['tense']),
      sec('The worst', d('X09') - item('X09', 'W11B') + 0.2, ['same beat with darker minor chords', 'subtle tension', 'filtered'], ['triumphant']),
      sec('The price', d('X10'), ['tension builds steadily', 'rising synth arpeggio', 'drums grow', 'anticipation'], ['resolution']),
      sec('The verdict', d('X11') + 1.2, ['satisfying resolution', 'uplifting full chords', 'confident hit at the start then warm groove'], ['sad'])]),
  'c6_trick': (['instrumental energetic electro-pop for a fast tutorial ending', 'tempo 124 BPM', 'four on the floor kick, driving synth bass, bright synth stabs, claps, risers', 'exciting, fast, celebratory', MIX], [
      sec('The trick', d('X12'), ['energetic driving groove from the first beat', 'bright stabs', 'momentum'], ['calm', 'slow intro']),
      sec('Fast steps', d('X13'), ['even faster feeling', 'extra percussion and claps', 'quick risers'], ['calm']),
      sec('Outro', d('X14'), ['uplifting brand outro', 'warm resolving chords', 'final hit then soft decay to silence'], ['abrupt cut'])]),
}
os.makedirs(OUT, exist_ok=True)
for name, (pos, sections) in CUES.items():
    plan = {'composition_plan': {'positive_global_styles': pos, 'negative_global_styles': NEG, 'sections': sections}}
    json.dump(plan, open(os.path.join(OUT, f'{name}.plan.json'), 'w'), ensure_ascii=False, indent=1)
    print(name, round(sum(s['duration_ms'] for s in sections) / 1000, 2), 's', [s['duration_ms'] for s in sections])
