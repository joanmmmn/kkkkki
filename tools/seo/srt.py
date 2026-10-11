# Subtítulos en español a partir del guion exacto y los tiempos por palabra de cada locución.
# Uso: python3 tools/seo/srt.py salida_es.srt   (genera también salida_es.srt.json para tools/seo/en.py)
import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from timeline import vos, vo_abs, orig_abs
MAXC, MAXD, MINC = 90, 6.2, 34
words = []  # (texto, inicio, fin)
o = list(orig_abs())
frag0 = '[Narración original] Una tarde extremadamente calurosa de principios de julio…'.split()
step0 = (o[0][1] - 0.1) / len(frag0)
words += [(w, o[0][0] + k * step0, o[0][0] + (k + 1) * step0 - 0.05) for k, w in enumerate(frag0)]
for i, t0 in vo_abs():
    ws = vos[i]['words']
    if i == 'V06':  # el fragmento original va justo antes de la frase «…y el texto se resalta»
        frag = '[Narración original] …un joven salió de la reducida habitación que tenía…'.split()
        step = o[1][1] / len(frag)
        words += [(w, o[1][0] + k * step, o[1][0] + (k + 1) * step - 0.05) for k, w in enumerate(frag)]
    words += [(w['w'], t0 + w['s'], t0 + w['e']) for w in ws]
words.sort(key=lambda w: w[1])
# Agrupar en subtítulos: cortar en final de frase, o en pausa/coma cuando el bloque ya es largo.
cues, cur = [], []
def text(c): return ' '.join(w[0] for w in c)
for k, w in enumerate(words):
    if cur:
        gap = w[1] - cur[-1][2]
        long_ = len(text(cur + [w])) > MAXC or w[2] - cur[0][1] > MAXD
        end_sent = re.search(r'[.?!…]["»]?$', cur[-1][0]) and len(text(cur)) >= 8
        soft = re.search(r'[,:;]["»]?$', cur[-1][0]) and len(text(cur)) >= MINC
        if long_ and not (end_sent or soft or gap > 0.9):
            # Si hay que cortar por longitud, mejor tras la última puntuación del bloque.
            j = max((q for q in range(1, len(cur) - 1) if re.search(r'[,.:;?…»]$', cur[q][0])), default=None)
            if j is not None:
                cues.append(cur[:j + 1]); cur = cur[j + 1:]
            else:
                # Sin puntuación: no terminar en palabra átona («de», «la», «y»…); pasa al siguiente bloque.
                FW = {'de', 'la', 'el', 'los', 'las', 'y', 'a', 'en', 'por', 'una', 'un', 'del', 'que', 'con', 'sin', 'para'}
                j = len(cur)
                while j > 1 and cur[j - 1][0].lower() in FW: j -= 1
                cues.append(cur[:j]); cur = cur[j:]
        elif long_ or end_sent or soft or gap > 0.9:
            cues.append(cur); cur = []
    cur.append(w)
cues.append(cur)
# Números en cifras (más legibles) y reparto en dos líneas equilibradas.
NUM = [('seis mil setecientos', '6.700'), ('dieciocho', '18'), ('veintiséis', '26'), ('cuarenta y una', '41'),
       ('setecientos', '700'), ('novecientas setenta y dos', '972'), ('cinco millones', '5 millones'), ('64 kilobits', '64 kbps')]
def two_lines(s):
    if len(s) <= 42: return s
    best = None
    for m in re.finditer(' ', s):
        a, b = s[:m.start()], s[m.end():]
        score = abs(len(a) - len(b)) - (6 if re.search(r'[,.:;?…»]$', a) else 0)
        if best is None or score < best[0]: best = (score, a, b)
    return best[1] + '\n' + best[2]
def ts(t):
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f'{h:02d}:{m:02d}:{s:02d},{ms:03d}'
out = []
for n, c in enumerate(cues):
    s = text(c)
    for a, b in NUM: s = s.replace(a, b)
    start = c[0][1]; end = c[-1][2] + 0.25
    if n + 1 < len(cues): end = min(end, cues[n + 1][0][1] - 0.04)
    out.append((start, end, two_lines(s)))
srt = '\n'.join(f'{i + 1}\n{ts(a)} --> {ts(b)}\n{t}\n' for i, (a, b, t) in enumerate(out))
open(sys.argv[1], 'w', encoding='utf-8').write(srt)
json.dump([(a, b, t) for a, b, t in out], open(sys.argv[1] + '.json', 'w'), ensure_ascii=False)
print(len(out), 'subtítulos'); print(srt[:1800])
