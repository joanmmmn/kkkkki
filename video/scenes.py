# Calcula inicios de escena (replica timeline.ts) para previsualizar.
import json, math, os
FPS=50
def vf(i):
    p=f'public/elt/vo/{i}.json'
    return math.ceil((json.load(open(p))['duration'] if os.path.exists(p) else 3)*FPS)
sec=lambda s: round(s*FPS)
def simple(i,lead=sec(0.35),tail=sec(0.6)): return (i, lead+vf(i)+tail)
e06=('E06', sec(14.1)+vf('E06B')+sec(0.3))
S=[simple('E01',sec(0.3),sec(1.4)),simple('E02',sec(0.2),sec(0.8)),simple('E03'),simple('E04',sec(0.35),sec(0.45)),simple('E05'),e06,simple('E07'),simple('E08'),simple('E09'),simple('E10',sec(0.3),sec(3.2))]
t=0
for i,d in S: print(i, 'start', t, 'dur', d, f'({d/FPS:.1f}s)'); t+=d
print('TOTAL', t, f'{t/FPS:.1f}s = {int(t/FPS//60)}:{int(t/FPS%60):02d}')
