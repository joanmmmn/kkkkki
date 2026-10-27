# Subtítulos de la reseña de Everand (ES a partir del guion y los tiempos por palabra; EN con los mismos tiempos).
# Reproduce video/src/scenes/evd/timeline.ts (50 fps): 12 escenas simples, la última con 3,2 s de cierre.
# Uso: python3 tools/seo/srt_evd.py <salida_es.srt> [<salida_en.srt>]
import json, math, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from subs import cues_from_words, finish, write_srt

VO = '/home/user/kkkkki/video/public/evd/vo/'
FPS = 50
r = lambda x: math.floor(x + 0.5)  # Math.round de JS
sec = lambda s: r(s * FPS)
IDS = [f'R{i:02d}' for i in range(1, 13)]
vos = {i: json.load(open(VO + i + '.json')) for i in IDS}
sf = lambda i: math.ceil((vos[i].get('speechEnd') or vos[i]['duration']) * FPS)
LEAD, TAIL = sec(0.12), sec(0.3)
t, words = 0, []
for i in IDS:
    t0 = (t + LEAD) / FPS
    words += [(w['w'], t0 + w['s'], t0 + w['e']) for w in vos[i]['words']]
    t += LEAD + sf(i) + (sec(3.2) if i == 'R12' else TAIL)
TOTAL = t

NUM = [('cuarenta y un mil', '41.000'), ('veinte mil', '20.000'), ('un millón y medio', '1,5 millones'), ('seis meses', '6 meses'),
       ('seiscientos', '600'), ('dos horas', '2 horas'), ('treinta días', '30 días'), ('solo siete', 'solo 7'), ('cinco euros', '5 euros')]
es = finish(cues_from_words(words, maxc=84), NUM)

# Traducción cue a cue (misma segmentación y tiempos que el español).
EN = [
    'For years, Scribd was called “the Netflix of books”.',
    "Today it's called Everand…",
    'and with its cheapest plan, you pick one book a month.',
    'Yes: one.',
    'What happened?',
    'And is it still worth it?',
    'We analyzed it in depth, with all the data and sources on our blog:',
    'link in the description.',
    'Everand was born in 2023, when Scribd split in two:',
    'Scribd kept the documents,',
    'and Everand got the ebooks, audiobooks and podcasts.',
    "And since 2025, they're paid for separately.",
    'In October 2024, “unlimited” came to an end.',
    'Now it works with unlocks: the Standard plan gives you one book a month;',
    'Plus, three; and Deluxe, five.',
    'Which books need an unlock?',
    'The official answer: “most of them”.',
    'Without unlocking, you get about 20,000 rotating titles,',
    'out of 1.5 million.',
    'Unused unlocks are kept for up to 6 months…',
    'but if you cancel, you lose the books:',
    "it's a rental, not a purchase.",
    'How much does it cost?',
    'In Spain, Plus costs €14.99 a month:',
    'about €5 per book.',
    'In Mexico, Standard costs 149 pesos.',
    'And in the US, the most expensive plan costs more per book than Plus,',
    'according to its own website.',
    'What about Spanish?',
    'We estimate about 41,000 audiobooks,',
    'with Penguin Random House and Planeta:',
    'García Márquez, Vargas Llosa, Ruiz Zafón,',
    'Pérez-Reverte, Posteguillo…',
    'But they all require an unlock.',
    'Only about 600 in Spanish come without limits,',
    'like “Crime and Punishment”…',
    'abridged to 2 hours.',
    'And some use a synthetic voice: check the narrator before unlocking.',
    'The app, though, is very polished: downloads,',
    'speed, sleep timer, and it works on the web,',
    'on mobile, CarPlay and Android Auto.',
    "What's missing: profiles and a family plan.",
    'Careful with the free trial: 30 days if you sign up on the web,',
    'but only 7 in the app, and with just one book,',
    'whichever plan you choose.',
    'It asks for a card and renews automatically.',
    'And if you subscribed from your phone,',
    'you cancel through Apple or Google, where it may show up as “Scribd”.',
    'Reviews reflect this: on Google Play it has a 4.4 in Spain,',
    'but a 3.5 in the US,',
    'where complaints almost quadrupled after the change.',
    'And in September, Scribd reported a security incident:',
    'if you have an account, change your password.',
    'The best: a huge catalog in Spanish,',
    'with new releases, plus ebooks and audiobooks in the same app.',
    "The worst: it's no longer unlimited,",
    "the books aren't yours, and the trial has fine print.",
    'Who is it for?',
    'If you listen to one or two books a month and want new releases,',
    'Plus can be worth it.',
    'If you listen to more,',
    'Audible offers unlimited listening to its catalog for €9.99,',
    'and Storytel for €8.99.',
    'And for free classics, you already know:',
    'El Libro Total.',
    'The catch?',
    "It's no longer unlimited, even though many people still think it is.",
    'Our score: 6.2 out of 10.',
    'And to find out where each audiobook is cheapest for you,',
    'search for it on SonorBooks.',
    'Your next story is waiting for you.',
]
if __name__ == '__main__':
    print('TOTAL', TOTAL, TOTAL / FPS)
    write_srt(sys.argv[1], es)
    assert len(EN) == len(es), (len(EN), len(es))
    if len(sys.argv) > 2: write_srt(sys.argv[2], [(a, b, t) for (a, b, _), t in zip(es, EN)])
    print(len(es), 'subtítulos')
