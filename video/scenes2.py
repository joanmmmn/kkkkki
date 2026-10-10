import json, math
FPS=50
def sf(i): d=json.load(open(f'public/elt/vo2/{i}.json')); return math.ceil(d.get('speechEnd',d['duration'])*FPS)
sec=lambda s: round(s*FPS)
L=sec(0.12); T=sec(0.3)
S=[('V01', sec(3.45)+sf('V01')+sec(0.45))]
for i in ['V02','V03','V04']: S.append((i, L+sf(i)+T))
samp=L+sf('V05')+sec(0.15); v06=samp+sec(2.3)+sec(0.05); S.append(('V05', v06+sf('V06')+sec(0.35)))
for i in ['V07','V08','V09','V10','V11']: S.append((i, L+sf(i)+T))
S.append(('V12', L+sf('V12')+sec(3.2)))
t=0
for i,d in S: print(i,'start',t,f'({t/FPS:.1f}s)','dur',d,f'({d/FPS:.1f}s)'); t+=d
print('TOTAL',t,f'{t/FPS:.1f}s = {int(t/FPS//60)}:{int(t/FPS%60):02d}')
