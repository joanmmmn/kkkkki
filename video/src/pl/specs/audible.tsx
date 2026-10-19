// Audible w Polsce (abonament od lipca 2026: wejście przez Amazon.pl, konto na audible.de). Sustituye a la reseña española de Audible.
// Investigación y guion: research/pl/audible/. Precios oficiales de https://www.amazon.pl/hz/audible/mlp (19/10/2026).
// Desde nuestro servidor (EE. UU.) audible.de enseña planes alemanes en euros y franjas en alemán: solo se graba la fila de títulos
// polacos de audible.de (?language=pl_PL&ipRedirectOverride=true), sin precios ni textos en alemán. Las cifras de julio (≈ 3000 títulos
// en polaco, 54 zł por libro) son de Świat Czytników (15.07.2026) y van con fuente y fecha en pantalla.
// Los «cues» son palabras de la locución tal como quedan en vo/<ID>.json: «Odibl», «kropka», «Gugl», «Ep», «Epl», «Ler», «Kar»…
import type { PLPiece } from './index';

export const piece: PLPiece = {
  spec: {
    slug: 'audible', name: 'Audible', domain: 'amazon.pl', color: '#F7991C', deep: '#212325', soft: '#FEF1DD',
    logo: 'pl/audible/img/logo.svg', logoWhite: 'pl/audible/img/logo_white.svg', logoRatio: 55 / 140, tileBg: '#212325', tileLogoWhite: true,
    kicker: 'Recenzja Audible', music: 'pl/audible/music/bed.mp3',
    scenes: [
      { id: 'A01', kind: 'hook', title: 'Audible\nw Polsce:\nczy warto?', hi: ['Audible'], rec: { clip: 'plany', start: 0.3 },
        cuts: [{ at: 'polski', rec: { clip: 'audible_de', start: 0.3, url: 'audible.de' } }, { at: 'Powiemy', rec: { clip: 'plany', start: 6.3 } }], promises: [
        { at: 'plany', label: 'Plany i ceny', icon: 'coin' }, { at: 'polski', label: 'Polski katalog', icon: 'book' }, { at: 'drobny', label: 'Drobny druk', icon: 'search' },
        { at: 'dobre', label: 'Plusy i minusy', tone: 'good' }, { at: '30', label: '30 dni za darmo', sub: 'dla nowych członków', icon: 'gift' },
      ] },
      { id: 'A02', kind: 'intro', bump: 'Czym jest Audible?', rec: { clip: 'swiat', start: 0.3, url: 'swiatczytnikow.pl' },
        cuts: [{ at: 'wchodzisz', rec: { clip: 'plany', start: 0.3 } }, { at: 'niemiecki', rec: { clip: 'audible_de', start: 0.3, url: 'audible.de' } }], facts: [
        { at: 'Amazona', label: 'Serwis Amazona', sub: 'audiobooki i podcasty', icon: 'headphones' },
        { at: 'lipcu', label: 'W Polsce od lipca 2026', icon: 'calendar' },
        { at: 'kropka', label: 'Wejście przez Amazon.pl', sub: 'obsługa: audible.de po polsku', icon: 'globe' },
        { at: 'trzech', label: 'Po polsku: ok. 3000 tytułów', sub: 'lipiec 2026 · Świat Czytników', icon: 'book' },
      ], big: { at: 'milion', value: 1000000, suffix: '+', label: 'audiobooków w całej kolekcji' } },
      { id: 'A03', kind: 'plans', bump: 'Cennik', title: 'Dwa plany', plans: [
        { at: 'Standard', name: 'Standard', price: '28,99 zł', period: '/ mies.', features: ['1 audiobook miesięcznie', 'Słuchasz, dopóki płacisz'] },
        { at: 'Premium', name: 'Premium', price: '41,99 zł', period: '/ mies.', features: ['1 kredyt = książka na zawsze', 'Tysiące tytułów bez limitu'], best: true, badge: 'Książka na własność' },
      ], footer: [{ at: 'dwa', label: 'Stan na październik 2026', icon: 'calendar' }, { at: 'zobowiazan', label: 'Bez zobowiązań', icon: 'lock' }] },
      { id: 'A04', kind: 'rec', bump: 'Jak to działa', kicker: 'Amazon.pl · pytania', title: 'Uwaga na zasady', rec: { clip: 'faq', start: 3.0, holdAt: 8.9 },
        cuts: [{ at: 'rezygnacji', rec: { clip: 'faq', start: 12.2, holdAt: 15.0 } }],
        marks: [
          { at: 'niewykorzystany', until: 'kredyty', x: 370, y: 494, w: 650, h: 50 }, { at: 'kredyty', until: 'rezygnacji', x: 370, y: 362, w: 650, h: 50 },
          { at: 'tracisz', until: 'zostaja', x: 370, y: 414, w: 650, h: 72 }, { at: 'zostaja', x: 370, y: 392, w: 650, h: 48 },
        ],
        zooms: [{ at: 'zasady', zoom: 1.6, x: 700, y: 430 }],
        tags: [
          { at: 'niewykorzystany', label: 'Standard: wybór przepada', sub: 'nie przechodzi na kolejny miesiąc', tone: 'bad' },
          { at: 'kumuluja', label: 'Premium: kredyty przechodzą', sub: 'aż wygasną', icon: 'coin' },
          { at: 'tracisz', label: 'Po rezygnacji: kłódka', sub: 'katalog i wybory ze Standardu', icon: 'lock' },
          { at: 'zostaja', label: 'Kupione i za kredyty zostają', tone: 'good' },
        ] },
      { id: 'A05', kind: 'rec', kicker: 'Amazon.pl', title: 'Polski katalog', rec: { clip: 'katalog', start: 0.3 },
        cuts: [{ at: 'Remigiusza', rec: { clip: 'popularne', start: 3.0 } }, { at: 'Sporo', rec: { clip: 'swiat', start: 11.0, url: 'swiatczytnikow.pl' } }],
        marks: [
          { at: 'filtrem', until: 'Remigiusza', x: 12, y: 438, w: 84, h: 28 },
          { at: 'Remigiusza', until: 'Joanny', x: 694, y: 586, w: 256, h: 290 }, { at: 'Kraszewski', until: 'Sporo', x: 1240, y: 586, w: 256, h: 290 },
          { at: 'Sporo', x: 504, y: 54, w: 652, h: 56 },
        ],
        zooms: [{ at: 'zakladke', zoom: 1.7, x: 420, y: 360 }, { at: 'Remigiusza', zoom: 1.25, x: 960, y: 620 }, { at: 'Sporo', zoom: 3, x: 830, y: 180 }],
        tags: [
          { at: 'filtrem', label: 'Filtr: Język → Polski', icon: 'search' },
          { at: 'Remigiusza', label: 'Remigiusz Mróz', sub: 'kryminały', icon: 'book' },
          { at: 'Joanny', label: 'Joanna Jax', sub: 'sagi', icon: 'book' },
          { at: 'Sienkiewicz', label: 'Sienkiewicz · Kraszewski', sub: 'klasyka', icon: 'library' },
          { at: 'Sporo', label: 'Dużo domeny publicznej', sub: 'Świat Czytników, 15.07.2026', tone: 'bad' },
        ] },
      { id: 'A06', kind: 'stat', kicker: 'Zakupy pojedyncze', title: 'Nie jest tanio', at: 'tanio', value: '54 zł', label: 'za audiobook Siembiedy lub Mossa (lipiec 2026)', tags: [
        { at: 'lipcu', label: 'Świat Czytników, 15.07.2026', icon: 'doc' }, { at: 'Czlonkowie', label: 'Premium: zniżki i wyprzedaże', icon: 'coin', tone: 'good' },
      ] },
      { id: 'A07', kind: 'features', bump: 'Aplikacja', kicker: 'Odtwarzacz', title: 'Co potrafi aplikacja?', cols: 3, items: [
        { at: 'przyspieszyc', label: 'Tempo do 3,5×', icon: 'speed' }, { at: 'wylacznik', label: 'Wyłącznik czasowy', icon: 'moon' },
        { at: 'tryb', label: 'Tryb samochodowy', sub: 'duże przyciski', icon: 'car' }, { at: 'pobieranie', label: 'Offline', sub: 'pobierz i słuchaj', icon: 'download' },
        { at: 'profil', label: 'Profil dziecięcy', sub: 'z tytułami, które udostępnisz', icon: 'kid' },
      ] },
      { id: 'A08', kind: 'rec', kicker: 'Minus na start', title: 'Niepełne tłumaczenie', rec: { clip: 'swiat_de', start: 0.3, url: 'swiatczytnikow.pl' },
        cuts: [{ at: 'recenzjach', rec: { clip: 'gplay', start: 0.3, url: 'play.google.com' } }],
        marks: [
          { at: 'niemiecku', until: 'recenzjach', x: 504, y: 296, w: 652, h: 74 },
          { at: 'recenzjach', until: 'angielskiego', x: 302, y: 254, w: 120, h: 56 }, { at: 'angielskiego', x: 304, y: 846, w: 876, h: 130 },
        ],
        zooms: [{ at: 'Minus', zoom: 3, x: 830, y: 462 }, { at: 'recenzjach', zoom: 1.7, x: 560, y: 330 }, { at: 'angielskiego', zoom: 1.5, x: 740, y: 860 }],
        tags: [
          { at: 'niemiecku', label: 'audible.de: część po niemiecku', sub: 'Świat Czytników, 15.07.2026', tone: 'bad' }, { at: 'recenzjach', label: 'Recenzje w Google Play', sub: 'lipiec–wrzesień 2026', icon: 'doc' },
          { at: 'mieszanke', label: 'Aplikacja: PL + DE + EN', tone: 'bad' }, { at: 'brak', label: 'Brak filtra „polski”', tone: 'bad' },
        ] },
      { id: 'A09', kind: 'devices', items: [
        { at: 'Androidem', label: 'Android', sub: 'telefon i tablet', icon: 'phone', ok: true }, { at: 'aj', label: 'iPhone i iPad', icon: 'tablet', ok: true },
        { at: 'Epl', label: 'Apple Watch', icon: 'watch', ok: true }, { at: 'Ler', label: 'Wear OS', icon: 'watch', ok: true },
        { at: 'Kar', label: 'CarPlay', icon: 'car', ok: true }, { at: 'Auto', label: 'Android Auto', icon: 'car', ok: true },
      ] },
      { id: 'A10', kind: 'ratings', bump: 'Opinie', stores: [{ at: 'Ep', store: 'apple', rating: 4.8, count: '4413 ocen (Polska)' }, { at: 'Gugl', store: 'google', rating: 4.1, count: 'ocena w Polsce' }],
        likes: [{ at: 'wybor', label: 'Wybór książek' }, { at: 'odtwarzacz', label: 'Wygodny odtwarzacz' }],
        dislikes: [{ at: 'cene', label: 'Cena za 1 książkę miesięcznie' }, { at: 'tlumaczenie', label: 'Niepełne tłumaczenie' }],
        notes: [{ at: 'srednia', label: 'Ocena całej aplikacji', sub: 'stan na 19.10.2026', icon: 'star' }] },
      { id: 'A11', kind: 'proscons', bump: 'Plusy i minusy', title: 'Audible w Polsce', pros: [
        { at: '30', label: '30 dni za darmo', sub: 'dla nowych członków' }, { at: 'wlasnosc', label: 'Premium: książka na własność' }, { at: 'ogromna', label: 'Ogromna kolekcja', sub: 'ponad milion tytułów' }, { at: 'rozbudowany', label: 'Rozbudowany odtwarzacz' },
      ], cons: [
        { at: 'maly', label: 'Mały polski katalog' }, { at: 'Standardzie', label: 'Standard: 1 książka miesięcznie' }, { at: 'tlumaczenie', label: 'Niepełne tłumaczenie' }, { at: 'brak', label: 'Bez e-booków i planu rodzinnego' },
      ] },
      { id: 'A12', kind: 'verdict', bump: 'Werdykt', question: 'Audible w Polsce:\nczy warto?', yes: [
        { at: 'angielsku', label: 'Słuchasz po angielsku', sub: 'ogromny wybór' },
        { at: 'wlasnosc', label: 'Chcesz mieć książki na własność', sub: 'wtedy Premium' },
      ], no: [
        { at: 'polskich', label: 'Szukasz głównie polskich tytułów', sub: 'na razie mały wybór' },
      ], alts: { at: 'porownaj', names: ['Audioteka Klub', 'Empik Go', 'Legimi'], label: 'Porównaj z:' } },
      { id: 'B01', kind: 'stat', bump: 'Jak wypróbować za darmo', kicker: 'Okres próbny', title: 'Za darmo na start', at: 'darmo', value: '30 dni', label: 'za darmo dla nowych członków', tags: [
        { at: 'obu', label: 'Standard i Premium', icon: 'check' }, { at: 'kredyt', label: 'Premium: 1 kredyt', sub: 'w okresie próbnym', icon: 'gift' },
      ] },
      { id: 'B02', kind: 'steps', kicker: 'Jak zacząć', title: 'Zapis na Amazon.pl', rec: { clip: 'plany', start: 1.4 }, steps: [
        { at: 'Wejdz', title: 'Wejdź na Amazon.pl', sub: 'zakładka Audiobooki Audible' }, { at: 'Wyprobuj', title: 'Wypróbuj Standard albo Premium' },
        { at: 'Zalogujesz', title: 'Zaloguj się kontem Amazon', sub: 'i podaj metodę płatności' }, { at: 'dzis', title: 'Dziś 0 zł', sub: 'po 30 dniach 28,99 / 41,99 zł automatycznie' },
      ], note: { at: 'dzis', label: 'Ceny: stan na październik 2026', icon: 'calendar' },
        marks: [{ at: 'Wyprobuj', until: 'Premium', x: 508, y: 545, w: 424, h: 50 }, { at: 'Premium', until: 'Zalogujesz', x: 988, y: 545, w: 424, h: 50 }, { at: 'dzis', x: 500, y: 598, w: 920, h: 56 }],
        zooms: [{ at: 'Wyprobuj', zoom: 1.3, x: 960, y: 480 }] },
      { id: 'B03', kind: 'rec', kicker: 'Ważne', title: 'Zapisz się na stronie', rec: { clip: 'appstore', start: 0.3, url: 'apps.apple.com/pl' },
        marks: [{ at: 'App', until: 'Potem', x: 584, y: 168, w: 124, h: 28 }], zooms: [{ at: 'App', zoom: 1.6, x: 640, y: 300 }],
        tags: [
          { at: 'stronie', label: 'Zapis na stronie Amazon.pl', icon: 'globe', tone: 'good' }, { at: 'wyzsze', label: 'W aplikacji (App Store) drożej', tone: 'bad' },
          { at: 'pobierz', label: 'Potem pobierz aplikację', icon: 'download' }, { at: 'zaloguj', label: 'To samo konto', icon: 'user' },
        ] },
      { id: 'B04', kind: 'steps', kicker: 'Rezygnacja', title: 'Jak zrezygnować', steps: [
        { at: 'Zrezygnuj', title: 'Zrezygnuj przed końcem 30 dni', sub: 'wtedy nie zapłacisz' }, { at: 'Anuluj', title: 'audible.de › „Anuluj subskrypcję”', sub: 'link na samym dole strony' },
        { at: 'Abonament', title: 'Abonament z App Store’a lub Google Play?', sub: 'anulujesz go w sklepie' },
      ] },
      { id: 'B05', kind: 'rec', kicker: 'Drobny druk', title: 'Najpierw wykorzystaj kredyt', rec: { clip: 'faq', start: 4.0, holdAt: 8.9 },
        marks: [{ at: 'niewykorzystane', until: 'ksiazka', x: 370, y: 362, w: 650, h: 50 }, { at: 'ksiazka', x: 370, y: 318, w: 650, h: 50 }],
        zooms: [{ at: 'wykorzystaj', zoom: 1.6, x: 700, y: 430 }],
        tags: [
          { at: 'wykorzystaj', label: 'Wykorzystaj kredyt', sub: 'przed rezygnacją', icon: 'coin' }, { at: 'przepadaja', label: 'Niewykorzystane przepadają', tone: 'bad' },
          { at: 'zawsze', label: 'Książka za kredyt: na zawsze', tone: 'good' },
        ] },
      { id: 'B06', kind: 'outro', rec: { clip: '@common/sb_home_cards', start: 0.3, url: 'sonorbooks.pl' }, cta: 'Porównaj Audible\nz innymi:\nsonorbooks.pl', ctaAt: 'sonorbooks', signAt: 'Twoja',
        tags: [{ at: 'Audioteka', label: 'Audioteka · Empik Go · Legimi', icon: 'search' }] },
    ],
    chapters: [
      { label: 'Czym jest Audible', from: 'A02' },
      { label: 'Cennik: Standard i Premium', from: 'A03' },
      { label: 'Zasady: wybory i kredyty', from: 'A04' },
      { label: 'Polski katalog', from: 'A05' },
      { label: 'Zakupy pojedyncze', from: 'A06' },
      { label: 'Aplikacja i odtwarzacz', from: 'A07' },
      { label: 'Tłumaczenie i urządzenia', from: 'A08' },
      { label: 'Opinie', from: 'A10' },
      { label: 'Plusy i minusy', from: 'A11' },
      { label: 'Werdykt: czy warto?', from: 'A12' },
      { label: 'Jak wypróbować za darmo', from: 'B01' },
      { label: 'Jak zrezygnować', from: 'B04' },
    ],
  },
  thumb: { line1: 'AUDIBLE', line2: 'W POLSCE?', seal: { icon: 'book', text: 'Polski\nkatalog?' }, label: { strong: 'Standard', rest: 'CZY PREMIUM?' } },
};
