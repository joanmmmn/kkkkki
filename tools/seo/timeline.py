# Reproduce video/src/scenes/elt2/timeline.ts (50 fps) para obtener el instante absoluto de cada locución.
import json, math
VO = '/home/user/kkkkki/video/public/elt/vo2/'
FPS = 50
r = lambda x: math.floor(x + 0.5)          # Math.round de JS
sec = lambda s: r(s * FPS)
vos = {i: json.load(open(VO + i + '.json')) for i in ['V01','V02','V03','V04','V05','V06','V07','V08','V09','V10','V11','V12']}
sf = lambda i: math.ceil((vos[i].get('speechEnd') or vos[i]['duration']) * FPS)
LEAD, TAIL = sec(0.12), sec(0.3)
scenes = []
voAt = sec(3.45)
scenes.append({'vo': [('V01', voAt)], 'audio': [(0, sec(3.35))], 'dur': voAt + sf('V01') + sec(0.45)})
for i in ['V02', 'V03', 'V04']: scenes.append({'vo': [(i, LEAD)], 'dur': LEAD + sf(i) + TAIL})
v05 = LEAD; sampleAt = v05 + sf('V05') + sec(0.15); sampleDur = sec(2.3); v06 = sampleAt + sampleDur + sec(0.05)
scenes.append({'vo': [('V05', v05), ('V06', v06)], 'audio': [(sampleAt, sampleDur)], 'dur': v06 + sf('V06') + sec(0.35)})
for i in ['V07', 'V08', 'V09', 'V10', 'V11']: scenes.append({'vo': [(i, LEAD)], 'dur': LEAD + sf(i) + TAIL})
scenes.append({'vo': [('V12', LEAD)], 'dur': LEAD + sf('V12') + sec(3.2)})
starts = []; t = 0
for s in scenes: starts.append(t); t += s['dur']
TOTAL = t
def vo_abs():
    for s, st in zip(scenes, starts):
        for i, at in s['vo']:
            yield i, (st + at) / FPS
def orig_abs():
    for s, st in zip(scenes, starts):
        for at, d in s.get('audio', []): yield (st + at) / FPS, d / FPS
if __name__ == '__main__':
    print('TOTAL', TOTAL, TOTAL / FPS)
    for i, t0 in vo_abs(): print(i, round(t0, 2))
    for a in orig_abs(): print('orig', a)
