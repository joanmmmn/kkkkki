# Subtítulos en inglés: misma segmentación y tiempos que los españoles, traducidos cue a cue.
# Uso: python3 tools/seo/en.py salida_es.srt.json salida_en.srt
import json, re, sys
EN = [
 "[Original narration] One extremely hot evening in early July…",
 "This is “Crime and Punishment”, read by a professional voice.",
 "On Audible it costs €18.99.",
 "Here… zero.",
 "And it's not the only one: there are almost 6,700 more audiobooks,",
 "no ads, no subscription, and they don't even ask for your email.",
 "So what's the catch?",
 "We tested it thoroughly: the catalog,",
 "the voices, the app, the best and the worst.",
 "And if you want all the data and sources,",
 "the full review is on our blog:",
 "link in the description.",
 "It's called El Libro Total, and it isn't new:",
 "it was born in Colombia in 2005,",
 "run by a non-profit foundation funded by a software company.",
 "Its name is a tribute to Borges' infinite library.",
 "Today it has over 5 million downloads and a 4.8 rating on Google Play.",
 "Let's get to the audiobooks.",
 "There are exactly 6,698, almost all in Spanish.",
 "Mind you: most are short stories, and half are under 18 minutes long.",
 "But there are full novels too:",
 "“Crime and Punishment” runs over 26 hours,",
 "and “Anna Karenina”, almost 41.",
 "And you can filter them by more than 700 topics,",
 "from mystery to impossible love.",
 "How does it work?",
 "You search for “Crime and Punishment” and the book shows up…",
 "but also music inspired by the novel,",
 "illustrations and articles: everything here is connected.",
 "The book page offers several translations,",
 "even the Russian original.",
 "You tap “Ir al libro” (Go to book), then the speaker icon…",
 "[Original narration] …a young man left the tiny room he rented…",
 "…and the text is highlighted while the pages turn by themselves.",
 "You read and listen at the same time.",
 "What about the voices?",
 "They're human, from a small team of narrators:",
 "in our sample, Álvaro Gómez Zafra reads one in three audiobooks,",
 "and this one is by Hernando Iván Cano.",
 "However, you can't choose the narrator.",
 "The audio is 64 kbps MP3: good enough for speech,",
 "but far from Audible's studio quality,",
 "and the volume varies from book to book.",
 "And here's what nobody else has:",
 "dozens of dictionaries one click away,",
 "some of them three centuries old; side-by-side reading in three languages;",
 "and each book's vocabulary: in this one,",
 "Raskolnikov appears 972 times.",
 "You don't need an account to listen;",
 "if you sign up, for free, you get history,",
 "favorites and notes.",
 "On mobile you get speed control,",
 "up to 2x, which doesn't exist on desktop.",
 "But watch out: offline, you can only read.",
 "The audio needs an internet connection.",
 "The best: it's truly free, with no ads,",
 "human voices and synchronized text,",
 "something almost no one offers.",
 "The worst: no new releases or bestsellers,",
 "only classics and donated works; the player is basic,",
 "no sleep timer or downloads; and the website is slow and a bit dated.",
 "Who is it for?",
 "Students, lovers of the classics and language learners.",
 "If you're after the latest thriller, this isn't for you.",
 "And the savings are real: this same audiobook costs €15 to €19 in stores.",
 "Here, zero.",
 "The catch?",
 "There isn't one.",
 "Our score: 8.2 out of 10.",
 "And to find out where to listen to any audiobook,",
 "and at what price, search for it on SonorBooks.",
 "Your next story is waiting for you.",
]
es = json.load(open(sys.argv[1]))
assert len(es) == len(EN), (len(es), len(EN))
def two_lines(s):
    if len(s) <= 42: return s
    best = None
    for m in re.finditer(' ', s):
        a, b = s[:m.start()], s[m.end():]
        score = abs(len(a) - len(b)) - (6 if re.search(r'[,.:;?…]$', a) else 0)
        if best is None or score < best[0]: best = (score, a, b)
    return best[1] + '\n' + best[2]
def ts(t):
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f'{h:02d}:{m:02d}:{s:02d},{ms:03d}'
srt = '\n'.join(f'{i + 1}\n{ts(a)} --> {ts(b)}\n{two_lines(t)}\n' for i, ((a, b, _), t) in enumerate(zip(es, EN)))
open(sys.argv[2], 'w', encoding='utf-8').write(srt)
print('ok', len(EN))
