// LibriVox po polsku (darmowe audiobooki z domeny publicznej). Equivalente del vídeo español de LibriVox.
// Investigación y guion: research/pl/librivox/ (consultas del 19/10/2026; recuento propio del catálogo polaco).
// LibriVox NO está en sonorbooks.pl/platformy: el cierre solo invita a comparar las otras opciones (Audioteka, Empik Go, Legimi, Wolne Lektury).
// Las apps citadas (BookDesign) no son oficiales: «Our only official outlet is the LibriVox.org web site».
// A02B: audio real de dominio público (Lalka, t. 1, rozdz. 1, czyta Piotr Nater, 9,3–13,8 s del MP3 oficial de LibriVox), sin locución.
// Las tomas de librivox.org se graban con zoom CSS 1,5 (la web mide 960 px de ancho y a 1920 se leía muy pequeña).
// Los «cues» son palabras de la locución tal como quedan en vo/<ID>.json: «Librivoks», «Plej», «Dałnlołd», «Miln»…
import type { PLPiece } from './index';

export const piece: PLPiece = {
  spec: {
    slug: 'librivox', name: 'LibriVox', domain: 'librivox.org', color: '#333333', deep: '#111111', soft: '#ECECEC',
    logo: 'pl/librivox/img/logo.svg', logoWhite: 'pl/librivox/img/logo_white.svg', logoRatio: 390 / 1920, tileBg: '#333333', tileLogoWhite: true,
    kicker: 'LibriVox po polsku', music: 'pl/librivox/music/bed.mp3',
    scenes: [
      { id: 'A01', kind: 'hook', title: 'Darmowe\naudiobooki…\ngdzie haczyk?', hi: ['haczyk'], rec: { clip: '01_portada', start: 0.3 }, cuts: [{ at: 'Lalka', rec: { clip: '04_lalka', start: 0.3 } }], promises: [
        { at: 'dwadziescia', label: '21 847 audiobooków', sub: 'stan na 19.10.2026', icon: 'headphones' },
        { at: 'rejestracji', label: '0 zł, bez rejestracji', icon: 'coin' },
        { at: 'ludzi', label: 'Czytają ludzie', icon: 'mic' },
        { at: 'polsku', label: 'Także po polsku', sub: '„Lalka” Prusa', icon: 'book' },
        { at: 'uwazac', label: 'Na co uważać?', icon: 'search' },
      ] },
      { id: 'A02', kind: 'intro', bump: 'Czym jest LibriVox?', rec: { clip: '09_about', start: 9.0, url: 'librivox.org/pages/about-librivox' },
        cuts: [{ at: 'Cel', rec: { clip: '09_about', start: 0.4, holdAt: 6.6, url: 'librivox.org/pages/about-librivox' } }, { at: 'Dzis', rec: { clip: '01_portada', start: 11.9 } }], facts: [
        { at: 'wolontariuszy', label: 'Projekt wolontariuszy', icon: 'user' },
        { at: 'dwa', label: 'Od sierpnia 2005', icon: 'calendar' },
        { at: 'reklam', label: 'Non-profit, bez reklam', icon: 'heart' },
        { at: 'jezykach', label: '49 języków', icon: 'globe' },
      ], big: { at: 'dwadziescia', value: 21847, label: 'tytułów (stan na 19.10.2026)' } },
      { id: 'A02B', kind: 'features', tin: 'cut', audio: { src: 'pl/librivox/audio/lalka_formulka.mp3', dur: 4.5, volume: 1 }, kicker: 'Prawdziwe nagranie', title: 'Posłuchaj', cols: 1, items: [
        { at: 'Nagranie', label: '„Nagranie LibriVox. Wszystkie nagrania LibriVox należą do domeny publicznej.”', icon: 'speaker' },
        { at: 'Lalka', label: '„Lalka”, tom 1, rozdział 1', sub: 'Bolesław Prus · czyta Piotr Nater', icon: 'book' },
        { at: 'domena', label: 'LibriVox · domena publiczna', icon: 'check' },
      ] },
      { id: 'A03', kind: 'stat', bump: 'Ile to kosztuje?', kicker: 'Cena', title: 'Ile płacisz?', at: 'Nic', value: '0 zł', label: 'bez abonamentu i konta: nie ma czego anulować', tags: [
        { at: 'pobrac', label: 'Pobierz, zachowaj, udostępniaj', icon: 'download' }, { at: 'datki', label: 'Tylko dobrowolne datki', icon: 'heart' },
      ] },
      { id: 'A04', kind: 'rec', bump: 'Ile jest po polsku?', kicker: 'Katalog po polsku', title: 'Mały zakątek', rec: { clip: '03_polish_list', start: 0.3, url: 'librivox.org/search' },
        cuts: [{ at: 'bo', rec: { clip: '03_polish_list', start: 8.5, url: 'librivox.org/search' } }, { at: 'Do', rec: { clip: '03_polish_list', start: 3.4, holdAt: 5.9, url: 'librivox.org/search' } },
          { at: 'Razem', rec: { clip: '03_polish_list', start: 12.4, url: 'librivox.org/search' } }],
        marks: [{ at: 'krotszych', until: 'Razem', x: 770, y: 676, w: 300, h: 36 }],
        zooms: [{ at: 'polsku', zoom: 1.3, x: 1000, y: 540 }, { at: 'Razem', zoom: 1.6, x: 900, y: 850 }],
        tags: [
          { at: 'trzydziesci', label: '31 projektów', sub: '= 27 książek', icon: 'book' },
          { at: 'Lalka', label: 'Lalka i Faraon', sub: 'po 3 tomy', icon: 'list' },
          { at: 'sto', label: '121 krótszych nagrań', sub: 'w zbiorach wielojęzycznych', icon: 'headphones' },
          { at: 'Razem', label: 'Razem ≈ 207 godzin', sub: 'liczenie SonorBooks, 19.10.2026', icon: 'clock' },
        ] },
      { id: 'A05', kind: 'features', kicker: 'Co znajdziesz', title: 'Głównie klasyka', cols: 3, items: [
        { at: 'Lalke', label: 'Lalka', sub: 'Prus · 3 tomy · 29 godz.', icon: 'book' },
        { at: 'Faraona', label: 'Faraon', sub: 'Prus · 3 tomy · 24 godz.', icon: 'book' },
        { at: 'Potopu', label: 'Potop', sub: 'Sienkiewicz · tylko tom 1', icon: 'book' },
        { at: 'Rekopis', label: 'Rękopis znaleziony w Saragossie', sub: 'Potocki · 25 godz.', icon: 'book' },
        { at: 'srebrnym', label: 'Na srebrnym globie', sub: 'Żuławski · 10 godz.', icon: 'book' },
        { at: 'Sklepy', label: 'Sklepy cynamonowe', sub: 'Schulz · 4 godz.', icon: 'book' },
      ] },
      { id: 'A06', kind: 'rec', bump: 'Jak szukać po polsku', kicker: 'Wyszukiwanie', title: 'Polish w trzech kliknięciach', rec: { clip: '02_jezyki', start: 0.3 },
        cuts: [{ at: 'Polish', rec: { clip: '02_jezyki', start: 8.3 } }, { at: 'Solo', rec: { clip: '03_polish_list', start: 0.9, url: 'librivox.org/search' } }, { at: 'kilka', rec: { clip: '03_polish_list', start: 3.7, holdAt: 5.9, url: 'librivox.org/search' } }],
        marks: [
          { at: 'Browse', until: 'potem', x: 228, y: 410, w: 292, h: 48 }, { at: 'potem', until: 'Language', x: 1316, y: 449, w: 366, h: 72 },
          { at: 'Polish', until: 'Przy', x: 662, y: 432, w: 340, h: 96 },
          { at: 'Solo', until: 'kilka', x: 770, y: 532, w: 200, h: 36 }, { at: 'Collaborative', x: 770, y: 676, w: 300, h: 36 },
        ],
        tags: [
          { at: 'Browse', label: 'Browse the catalog', sub: '→ Language → Polish', icon: 'search' },
          { at: 'Solo', label: 'Solo', sub: 'czyta jedna osoba', icon: 'user' },
          { at: 'Collaborative', label: 'Collaborative', sub: 'czyta kilka osób', icon: 'family' },
          { at: 'Multilingual', label: 'Multilingual', sub: 'fragment zbioru wielojęzycznego', icon: 'globe' },
        ] },
      { id: 'A07', kind: 'rec', kicker: 'Strona książki', title: '„Lalka”, tom 1', rec: { clip: '04_lalka', start: 10.4 },
        cuts: [{ at: 'spis', rec: { clip: '05_lalka_play', start: 4.9 } }, { at: 'Plej', rec: { clip: '05_lalka_play', start: 7.3 } },
          { at: 'Dalnlold', rec: { clip: '04_lalka', start: 4.4 } }, { at: 'jest', rec: { clip: '04_lalka', start: 14.3 } }],
        marks: [
          { at: 'czas', until: 'lektora', x: 230, y: 456, w: 340, h: 38 }, { at: 'lektora', until: 'spis', x: 230, y: 557, w: 340, h: 38 },
          { at: 'Plej', until: 'tytul', x: 663, y: 432, w: 46, h: 48 }, { at: 'tytul', until: 'Dalnlold', x: 740, y: 436, w: 640, h: 44 },
          { at: 'Dalnlold', until: 'jest', x: 420, y: 780, w: 136, h: 60 }, { at: 'cztery', x: 230, y: 905, w: 310, h: 110 },
        ],
        zooms: [{ at: 'czas', zoom: 1.5, x: 560, y: 540 }, { at: 'spis', zoom: 1.25, x: 1000, y: 600 }, { at: 'Dalnlold', zoom: 1.5, x: 560, y: 800 }],
        tags: [
          { at: 'czas', label: '9 godz. 12 min', sub: 'czyta Piotr Nater', icon: 'clock' },
          { at: 'Plej', label: 'Play', sub: 'słuchasz w przeglądarce', icon: 'play' },
          { at: 'tytul', label: 'Tytuł rozdziału', sub: 'plik MP3', icon: 'link' },
          { at: 'Dalnlold', label: 'Download', sub: 'cała książka w ZIP · jest też M4B', icon: 'download' },
          { at: 'Bez', label: 'Bez DRM i logowania', tone: 'good' },
        ] },
      { id: 'A08', kind: 'stat', kicker: 'Lektorzy', title: 'Jeden głos dominuje', at: '60', value: '≈60', unit: '%', label: 'polskich godzin nagrał Piotr Nater (liczenie SonorBooks, 19.10.2026)', tags: [
        { at: 'wolontariusze', label: 'Wolontariusze: jakość bywa różna', icon: 'mic' },
        { at: 'Lalke', label: 'Cała „Lalka” i „Faraon”', icon: 'book' },
        { at: 'posluchaj', label: 'Najpierw posłuchaj minuty', icon: 'headphones' },
      ] },
      { id: 'A08B', kind: 'rec', bump: 'Prawo: USA a Polska', kicker: 'Na co uważać', title: 'Wolne w USA, a w Polsce?', rec: { clip: '05_lalka_play', start: 0.3, holdAt: 3.2 },
        cuts: [{ at: 'Ej', rec: { clip: '07_winnie', start: 1.9 } }, { at: 'Kubus', rec: { clip: '07_winnie', start: 7.5 } }],
        marks: [
          { at: 'prosi', until: 'Ej', x: 236, y: 518, w: 370, h: 192 },
          { at: 'Miln', until: 'Kubus', x: 776, y: 476, w: 112, h: 36 }, { at: 'bedzie', x: 230, y: 864, w: 320, h: 38 },
        ],
        zooms: [{ at: 'prosi', zoom: 1.6, x: 600, y: 620 }, { at: 'Ej', zoom: 1.3, x: 900, y: 560 }],
        tags: [
          { at: 'USA', label: 'Wolne od praw w USA', icon: 'globe' },
          { at: 'kraju', label: 'Poza USA: sprawdź prawo', sub: '„please verify the copyright status…”', icon: 'search' },
          { at: 'siedemdziesiat', label: 'Polska: 70 lat', sub: 'po śmierci autora (art. 36 i 39 pr. aut.)', icon: 'calendar' },
          { at: 'Miln', label: 'A. A. Milne † 1956', icon: 'user' },
          { at: 'Kubus', label: 'Winnie-the-Pooh (oryginał)', sub: 'USA: od 2022 · Polska: od 1.01.2027', tone: 'bad' },
        ] },
      { id: 'A09', kind: 'rec', bump: 'Na telefonie', kicker: 'Aplikacje', title: 'Brak oficjalnej aplikacji', rec: { clip: '01_portada', start: 6.5, holdAt: 9.8 },
        cuts: [{ at: 'Link', rec: { clip: '04_lalka', start: 6.7 } }, { at: 'jak', rec: { clip: '10_gp_app', start: 0.3, url: 'play.google.com' } },
          { at: ['Librivoks', 2], rec: { clip: '11_appstore_app', start: 0.3, url: 'apps.apple.com/pl' } }],
        marks: [
          { at: 'oficjalnej', until: 'Link', x: 1250, y: 338, w: 420, h: 72 }, { at: 'Link', until: 'jak', x: 420, y: 895, w: 136, h: 60 },
          { at: 'Androida', until: ['Librivoks', 2], x: 300, y: 100, w: 640, h: 150 }, { at: 'ajfona', x: 1176, y: 300, w: 110, h: 90 },
        ],
        zooms: [{ at: 'Na', zoom: 1.5, x: 1450, y: 400 }, { at: 'Link', zoom: 1.4, x: 560, y: 800 }, { at: 'jak', zoom: 1, x: 960, y: 540 }],
        tags: [
          { at: 'oficjalnej', label: 'Oficjalnie: tylko strona', sub: '„Our only official outlet…”', tone: 'bad' },
          { at: 'wkleisz', label: 'RSS', sub: 'do aplikacji z podcastami', icon: 'radio' },
          { at: 'Androida', label: 'LibriVox Audio Books', sub: 'Android · nieoficjalna (BookDesign)', icon: 'phone' },
          { at: 'ajfona', label: 'LibriVox Audiobooks', sub: 'iPhone · nieoficjalna (BookDesign)', icon: 'phone' },
        ] },
      { id: 'A10', kind: 'ratings', bump: 'Opinie', kicker: 'Aplikacje innych firm', title: 'Oceny w sklepach', stores: [
        { at: 'Androidzie', store: 'google', rating: 4.7, count: '68,2 tys. opinii · stan na 19.10.2026' }, { at: 'Storze', store: 'apple', rating: 4.6, count: '62 oceny (Polska) · stan na 19.10.2026' },
      ], likes: [], dislikes: [], notes: [
        { at: 'wylacznik', label: 'Wyłącznik czasowy, zakładki', sub: 'i pobieranie offline', icon: 'moon' },
        { at: 'reklamy', label: 'Android: z reklamami', tone: 'bad' },
        { at: 'kosztuje', label: 'Bez reklam: 24,99 zł', sub: 'wersja Supporter · stan na październik 2026', icon: 'coin' },
      ] },
      { id: 'A11', kind: 'proscons', bump: 'Plusy i minusy', kicker: 'Podsumowanie', title: 'LibriVox', pros: [
        { at: 'darmo', label: '0 zł i legalnie', sub: 'w USA; w Polsce: 70 lat po śmierci autora' }, { at: 'konta', label: 'Bez konta i reklam' }, { at: 'prawdziwe', label: 'Ludzkie głosy' },
        { at: 'zawsze', label: 'Pliki na zawsze' }, { at: 'ogromny', label: 'Ponad 19 000 tytułów po angielsku' },
      ], cons: [
        { at: 'dwadziescia', label: 'Tylko 27 książek po polsku' }, { at: 'glownie', label: 'Głównie jeden lektor' }, { at: 'nierowna', label: 'Nierówna jakość' },
        { at: ['angielsku', 1], label: 'Strona po angielsku' }, { at: 'brak', label: 'Brak oficjalnej aplikacji' },
      ] },
      { id: 'A12', kind: 'verdict', bump: 'Werdykt', question: 'LibriVox:\nczy warto?', yes: [
        { at: 'klasyki', label: 'Polska klasyka', sub: 'jeśli pasuje ci głos lektora' },
        { at: 'angielskiego', label: 'Nauka angielskiego', sub: 'ponad 19 000 tytułów' },
      ], no: [
        { at: 'zawodowymi', label: 'Wolisz zawodowych lektorów', sub: 'polska klasyka za 0 zł: Wolne Lektury' },
      ], alts: { at: 'Wolnych', names: ['Wolne Lektury · 0 zł · zawodowi lektorzy'], label: 'Alternatywa za darmo:' } },
      { id: 'B01', kind: 'rec', bump: 'Jak zacząć', kicker: 'Krok 1', title: 'Wejdź na stronę', rec: { clip: '01_portada', start: 0.3, holdAt: 4.4 },
        tags: [{ at: 'librivoks', label: 'librivox.org', icon: 'globe' }, { at: 'Rejestracja', label: 'Bez rejestracji', tone: 'good' }] },
      { id: 'B02', kind: 'steps', kicker: 'Krok 2', title: 'Znajdź po polsku', rec: { clip: '02_jezyki', start: 2.3 }, steps: [
        { at: 'Browse', title: 'Browse the catalog' }, { at: 'Language', title: 'Language' }, { at: 'Polish', title: 'Polish', rec: { clip: '02_jezyki', start: 8.3 } },
        { at: 'wpisz', title: 'albo wpisz tytuł', sub: 'w wyszukiwarkę u góry strony', rec: { clip: '01_portada', start: 0.3 } },
      ], marks: [{ at: 'wpisz', x: 1246, y: 128, w: 440, h: 64 }] },
      { id: 'B03', kind: 'rec', kicker: 'Krok 3', title: 'Słuchaj od razu', rec: { clip: '05_lalka_play', start: 6.4 },
        marks: [{ at: 'Play', x: 663, y: 432, w: 46, h: 48 }], zooms: [{ at: 'stronie', zoom: 1.6, x: 820, y: 470 }],
        tags: [{ at: 'Play', label: 'Play przy rozdziale', icon: 'play' }, { at: 'razu', label: 'Od razu w przeglądarce', tone: 'good' }] },
      { id: 'B04', kind: 'steps', kicker: 'Krok 4', title: 'Pobierz na offline', rec: { clip: '04_lalka', start: 4.4 }, steps: [
        { at: 'Dalnlold', title: 'Download', sub: 'cała książka (ZIP)' },
        { at: 'tytul', title: 'Tytuł rozdziału', sub: 'jeden plik MP3', rec: { clip: '05_lalka_play', start: 5.0 } },
      ], marks: [{ at: 'Dalnlold', until: 'tytul', x: 420, y: 780, w: 136, h: 60 }, { at: 'tytul', x: 740, y: 436, w: 640, h: 44 }] },
      { id: 'B05', kind: 'features', kicker: 'Krok 5', title: 'Drobny druk', items: [
        { at: 'autor', label: 'Autor: † + 70 lat', sub: 'przy nagraniach spoza polskiej listy', icon: 'user' },
        { at: 'tlumacz', label: 'Przekład? Tłumacz: † + 70 lat', sub: 'tłumaczenie ma własne prawa', icon: 'book' },
      ] },
      { id: 'B06', kind: 'outro', rec: { clip: '@common/sb_platformy', start: 0.2, url: 'sonorbooks.pl/platformy' }, cta: 'Wolisz zawodowych\nlektorów? Porównaj:\nsonorbooks.pl', ctaAt: 'sonorbooks', signAt: 'Twoja',
        tags: [{ at: 'Audioteke', label: 'Audioteka · Empik Go · Legimi', icon: 'search' }, { at: 'Wolne', label: 'Wolne Lektury · 0 zł', icon: 'book' }] },
    ],
    chapters: [
      { label: 'Czym jest LibriVox', from: 'A02' },
      { label: 'Ile to kosztuje', from: 'A03' },
      { label: 'Ile jest po polsku', from: 'A04' },
      { label: 'Polska klasyka w LibriVox', from: 'A05' },
      { label: 'Jak szukać po polsku', from: 'A06' },
      { label: 'Strona książki: słuchanie i pobieranie', from: 'A07' },
      { label: 'Lektorzy', from: 'A08' },
      { label: 'Prawo: USA a Polska', from: 'A08B' },
      { label: 'Na telefonie: RSS i aplikacje', from: 'A09' },
      { label: 'Opinie o aplikacjach', from: 'A10' },
      { label: 'Plusy i minusy', from: 'A11' },
      { label: 'Werdykt: czy warto?', from: 'A12' },
      { label: 'Jak zacząć', from: 'B01' },
    ],
  },
  thumb: { line1: 'AUDIOBOOKI', line2: 'ZA DARMO?', screen: 'pl/librivox/img/thumb_screen.jpg', screenMobile: false, seal: { icon: 'headphones', text: '21 847\ntytułów' }, label: { strong: '0 zł', rest: 'BEZ REJESTRACJI' } },
};
