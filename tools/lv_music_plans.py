#!/usr/bin/env python3
"""Composition plans de las 6 músicas del vídeo de LibriVox, con las secciones alineadas a las escenas (tiempos de
lv_times.py). Después: python3 tools/music.py <plan> <mp3>. Cada pista se alarga 1,2 s para fundirla con la siguiente."""
import json, os, subprocess, sys
HERE = os.path.dirname(__file__)
OUT = os.path.join(HERE, '..', 'video', 'public', 'music', 'lv')
S = {s['id']: s for s in json.loads(subprocess.run([sys.executable, os.path.join(HERE, 'lv_times.py'), '--json'], capture_output=True, text=True, check=True).stdout)}
FPS = 50
d = lambda sid: S[sid]['dur'] / FPS
item = lambda sid, iid: next(t for i, t, n in S[sid]['items'] if i == iid) / FPS
NEG = ['vocals', 'choir', 'spoken word', 'humming', 'distortion', 'dubstep', 'heavy EDM drop', 'harsh high frequencies', 'aggressive rock']
MIX = 'mix leaves plenty of space for a spoken voice-over in the mid range, no lead melody competing with speech'

def sec(name, dur, pos, neg=()):
    return {'section_name': name, 'positive_local_styles': pos, 'negative_local_styles': list(neg), 'duration_ms': int(round(dur * 1000)), 'lines': []}

CUES = {
  'm1_hook': (['instrumental warm cinematic storybook intro for a YouTube explainer about free audiobooks', 'tempo 100 BPM', 'felt piano, warm acoustic guitar, soft celesta, gentle strings, deep soft bass, light modern percussion', 'wonder, warmth, curiosity', MIX], [
      sec('Human voice cold open', item('Y01', 'L01'), ['almost silent warm sustained pad', 'a few distant soft piano notes', 'intimate, like a quiet library at night', 'no drums'], ['drums', 'bass', 'melody']),
      sec('Build', d('Y01') - item('Y01', 'L01'), ['acoustic guitar pattern enters', 'soft kick builds', 'rising strings', 'ends with a warm confident hit and a short pause'], ['dark']),
      sec('Promise', d('Y02') + 1.2, ['bright optimistic groove at full energy', 'plucked guitar and piano motif', 'claps and shaker', 'friendly momentum'], ['sad'])]),
  'm2a_what': (['instrumental warm documentary background about a library of books', 'tempo 92 BPM', 'felt piano, pizzicato strings, nylon guitar, soft marimba, warm upright bass, brushed drums', 'curious, literary, clear', MIX], [
      sec('What it is', item('Y03', 'omar_aviso') - 0.3, ['light curious piano motif', 'pizzicato strings', 'soft brushes'], ['heavy drums']),
      sec('Recording disclaimer', d('Y03') - item('Y03', 'omar_aviso') + 0.3 + 1.2, ['quiet but continuous warm sustained string pad with soft low piano', 'never silent', 'no percussion'], ['drums', 'silence', 'busy melody'])]),
  'm2b_catalog': (['instrumental warm documentary background about a vast library of classic books', 'tempo 96 BPM', 'felt piano, pizzicato strings, nylon guitar, soft marimba, warm upright bass, brushed drums', 'curious, literary, steady', MIX], [
      sec('Classics catalogue', d('Y04'), ['warm steady groove from the first beat', 'marimba and plucked strings', 'sense of a vast library opening up'], ['tense', 'slow intro', 'silence']),
      sec('A careful note', d('Y05') + 1.2, ['same groove thinned out', 'a hint of caution in minor chords', 'soft and thoughtful'], ['triumphant'])]),
  'm3_tutorial': (['instrumental upbeat indie-pop background for a how-to walkthrough', 'tempo 112 BPM', 'clean bright electric guitar, ukulele strums, round bass, claps, tight light drums, glockenspiel accents', 'playful, practical, energetic', MIX], [
      sec('Find books', d('Y06'), ['bouncy groove from the first beat', 'staccato guitar', 'tight drums'], ['slow intro']),
      sec('Listen and download', d('Y07'), ['same groove with extra percussion', 'glockenspiel accents', 'lively'], ['calm']),
      sec('On your phone', d('Y08') + 1.2, ['groove continues with a light synth pluck layer', 'modern and fresh', 'ends gently'], ['heavy'])]),
  'm4_voices': (['instrumental intimate acoustic underscore', 'tempo 76 BPM', 'warm felt piano, soft string pad, gentle nylon guitar, airy textures', 'tender, human, hopeful', MIX], [
      sec('Voices', item('Y09', 'L09B') - 0.2, ['very sparse soft pad and few piano notes', 'lots of space for real voices', 'no percussion'], ['drums', 'bass', 'busy melody']),
      sec('Advice', d('Y09') - item('Y09', 'L09B') + 0.2, ['gently lifts', 'soft pulse enters'], ['heavy drums']),
      sec('Become a volunteer', d('Y10') + 1.2, ['hopeful community feeling', 'warm acoustic guitar strums and light percussion', 'grows steadily, uplifting'], ['sad'])]),
  'm5_verdict': (['instrumental modern warm chill beat that resolves into an uplifting outro', 'tempo 90 BPM', 'dusty soft drums, warm Rhodes electric piano, deep round bass, acoustic guitar, soft synth pads', 'thoughtful then confident', MIX], [
      sec('The best', item('Y11', 'L11B') - 0.2, ['head-nodding positive beat', 'warm Rhodes chords'], ['tense']),
      sec('The worst', d('Y11') - item('Y11', 'L11B') + 0.2, ['same beat with darker minor chords', 'filtered'], ['triumphant']),
      sec('The verdict', d('Y12'), ['satisfying resolution', 'uplifting full chords', 'confident hit at the start then warm groove'], ['sad']),
      sec('Outro', d('Y13'), ['uplifting brand outro', 'warm resolving chords', 'final hit then soft decay to silence'], ['abrupt cut'])]),
}
os.makedirs(OUT, exist_ok=True)
for name, (pos, sections) in CUES.items():
    plan = {'composition_plan': {'positive_global_styles': pos, 'negative_global_styles': NEG, 'sections': sections}}
    json.dump(plan, open(os.path.join(OUT, f'{name}.plan.json'), 'w'), ensure_ascii=False, indent=1)
    print(name, round(sum(s['duration_ms'] for s in sections) / 1000, 2), 's', [s['duration_ms'] for s in sections])
