# Utilidades comunes de subtítulos: segmentación en bloques legibles, dos líneas equilibradas y formato SRT.
import json, re

FW = {'de', 'la', 'el', 'los', 'las', 'y', 'a', 'en', 'por', 'una', 'un', 'del', 'que', 'con', 'sin', 'para', 'su', 'se'}


def cues_from_words(words, maxc=90, maxd=6.2, minc=34):
    """words: lista (texto, inicio, fin) ordenada. Corta en final de frase, o en pausa/coma si el bloque ya es largo."""
    cues, cur = [], []
    text = lambda c: ' '.join(w[0] for w in c)
    for w in words:
        if cur:
            gap = w[1] - cur[-1][2]
            long_ = len(text(cur + [w])) > maxc or w[2] - cur[0][1] > maxd
            end_sent = re.search(r'[.?!…]["»]?$', cur[-1][0]) and len(text(cur)) >= 8
            soft = re.search(r'[,:;]["»]?$', cur[-1][0]) and len(text(cur)) >= minc
            if long_ and not (end_sent or soft or gap > 0.9):
                j = max((q for q in range(1, len(cur) - 1) if re.search(r'[,.:;?…»]$', cur[q][0])), default=None)
                if j is not None:
                    cues.append(cur[:j + 1]); cur = cur[j + 1:]
                else:
                    j = len(cur)
                    while j > 1 and cur[j - 1][0].lower() in FW: j -= 1
                    cues.append(cur[:j]); cur = cur[j:]
            elif long_ or end_sent or soft or gap > 0.9:
                cues.append(cur); cur = []
        cur.append(w)
    if cur: cues.append(cur)
    return [(c[0][1], c[-1][2], text(c)) for c in cues]


def two_lines(s, width=42):
    if len(s) <= width: return s
    best = None
    for m in re.finditer(' ', s):
        a, b = s[:m.start()], s[m.end():]
        score = abs(len(a) - len(b)) - (6 if re.search(r'[,.:;?…»]$', a) else 0) + (8 if a.split()[-1].lower() in FW else 0)
        if best is None or score < best[0]: best = (score, a, b)
    return best[1] + '\n' + best[2]


def ts(t):
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f'{h:02d}:{m:02d}:{s:02d},{ms:03d}'


def finish(cues, replace=()):
    """Aplica sustituciones (números en cifra), alarga cada bloque 0,25 s sin pisar el siguiente y devuelve (ini, fin, texto)."""
    out = []
    for n, (a, b, s) in enumerate(cues):
        for x, y in replace: s = s.replace(x, y)
        end = b + 0.25
        if n + 1 < len(cues): end = min(end, cues[n + 1][0] - 0.04)
        out.append((a, end, s))
    return out


def write_srt(path, cues):
    srt = '\n'.join(f'{i + 1}\n{ts(a)} --> {ts(b)}\n{two_lines(t)}\n' for i, (a, b, t) in enumerate(cues))
    open(path, 'w', encoding='utf-8').write(srt)
    return srt
