// Empik Go (Polska). Sustituye a la reseña española de iVoox. Investigación y guion: research/pl/empik-go/.
// Todas las tomas son páginas públicas de empik.com/go (las fichas de producto de empik.com dan 403 y no se usan).
// La promoción «Go Smart za 19,99 zł» terminó el 15.10.2026: no sale ni en la voz ni en pantalla (no se graba la pestaña
// «Płatność jednorazowa» ni la tabla de precios de /go/kidsmode, y la toma de precios empieza por debajo de las pestañas).
// La toma `plany` se recortó a 10 s (la página se colgó a los 8,1 s, ya con 4 urządzenia = 69,99 zł): A01 la congela con holdAt.
// El cierre usa la portada de sonorbooks.pl (@common/sb_home_cards) y no /platformy/, cuya tarjeta de Empik Go aún anuncia la promoción vencida.
// Los «cues» son palabras de la locución tal como quedan en vo/<ID>.json: «Maks», «Kindl», «Podkasty», «Gugl», «Ep»…
import type { PLPiece } from './index';

export const piece: PLPiece = {
  spec: {
    slug: 'empik-go', name: 'Empik Go', domain: 'empik.com/go', color: '#00C5CF', deep: '#00777D', soft: '#D6FDFF',
    logo: 'pl/empik-go/img/logo.svg', logoWhite: 'pl/empik-go/img/logo_white.svg', logoRatio: 58 / 213, tileBg: '#002023', tileLogoWhite: true,
    kicker: 'Recenzja Empik Go', music: 'pl/empik-go/music/bed.mp3',
    scenes: [
      { id: 'A01', kind: 'hook', title: 'Empik Go:\nczy warto?', hi: ['Empik', 'Go:', 'Go'], rec: { clip: 'plany', start: 0.3, holdAt: 8.3 }, promises: [
        { at: 'cennik', label: 'Cennik', icon: 'coin' }, { at: 'regulamin', label: 'Regulamin', icon: 'doc' }, { at: 'opinie', label: 'Opinie', icon: 'star' },
        { at: 'plusy', label: 'Plusy i minusy', tone: 'good' }, { at: '7', label: '7 dni za darmo', sub: 'z kartą płatniczą, tylko raz', icon: 'gift' },
      ] },
      { id: 'A02', kind: 'intro', bump: 'Czym jest Empik Go?', rec: { clip: 'hero', start: 0.4 }, facts: [
        { at: 'Empiku', label: 'Usługa Empiku', sub: 'Empik S.A., Warszawa', icon: 'library' },
        { at: 'siedemnastym', label: 'Aplikacja od 2017 r.', icon: 'phone' },
        { at: 'osiemnastym', label: 'Abonament od 2018 r.', icon: 'calendar' },
        { at: 'tydzien', label: 'Nowości co tydzień', icon: 'sparkle' },
      ], big: { at: 'dwiescie', value: 240000, suffix: '+', label: 'audiobooków, ebooków i podcastów' } },
      { id: 'A03', kind: 'plans', bump: 'Cennik', kicker: 'Cennik · strona www', title: 'Trzy plany, płatne co 30 dni', plans: [
        { at: 'Smart', name: 'Go Smart', price: '39,99 zł', period: '/ 30 dni', features: ['Bez limitu tytułów', '1 urządzenie + Kindle'] },
        { at: 'Maks', name: 'Go Max', price: '49,99 zł', period: '/ 30 dni', features: ['Bez limitu tytułów', '2 urządzenia + Kindle', '4 urządzenia: 69,99 zł'] },
        { at: 'Standard', name: 'Go Standard', price: '24,99 zł', period: '/ 30 dni', features: ['3 tytuły / 30 dni', '2 urządzenia + Kindle'] },
      ], footer: [{ at: 'plany', label: 'Ceny: stan na październik 2026', icon: 'calendar', tone: 'accent' }, { at: 'Kindl', label: 'Czytnik Kindle w każdym planie', icon: 'ereader' }] },
      { id: 'A04', kind: 'rec', bump: 'Katalog i Originals', kicker: 'empik.com/go', title: 'Zajrzyj bez logowania', rec: { clip: 'katalog', start: 0.2 },
        marks: [{ at: 'nowosci', until: 'bestsellery', x: 640, y: 112, w: 640, h: 54 }, { at: 'bestsellery', until: 'wlasne', x: 686, y: 470, w: 548, h: 54 }, { at: 'wlasne', x: 668, y: 920, w: 584, h: 56 }],
        tags: [
          { at: 'nowosci', label: 'Nowości', icon: 'sparkle' }, { at: 'bestsellery', label: 'Bestsellery', icon: 'star' },
          { at: 'sluchowiska', label: 'Słuchowiska dla dzieci', icon: 'kid' }, { at: 'wlasne', label: 'Empik Go Originals', icon: 'mic' },
        ] },
      { id: 'A05', kind: 'rec', kicker: 'Empik Go Originals', title: '130 własnych produkcji', rec: { clip: 'originals', start: 0.3, holdAt: 4.7 },
        cuts: [{ at: 'Przygody', rec: { clip: 'originals', start: 4.85, holdAt: 8.85 } }, { at: 'Cholod', rec: { clip: 'originals', start: 8.95 } }, { at: 'Krolestwo', rec: { clip: 'pik', start: 0.4, holdAt: 4.1, url: 'empik.com/go/krolestwo-pik' } }],
        marks: [{ at: 'Przygody', until: 'Cholod', x: 240, y: 186, w: 392, h: 570 }, { at: 'Cholod', until: 'Krolestwo', x: 240, y: 186, w: 392, h: 570 }, { at: 'Krolestwo', x: 384, y: 212, w: 520, h: 114 }],
        tags: [
          { at: 'tylko', label: 'Tylko w Empik Go', icon: 'lock' },
          { at: 'Przygody', label: '„Przygody Baltazara Gąbki”', sub: 'Makłowicz, Wojewódzki, Ralph Kaminski…', icon: 'mic' },
          { at: 'Cholod', label: '„Chołod”', sub: 'Szczepan Twardoch', icon: 'book' },
          { at: 'Krolestwo', label: '„Królestwo Pik”', sub: 'Weronika Ancerowicz', icon: 'book' },
        ] },
      { id: 'A06', kind: 'features', bump: 'Aplikacja', kicker: 'Aplikacja Empik Go', title: 'Switch i odtwarzacz', cols: 3, items: [
        { at: 'Switch', label: 'Funkcja Switch', sub: 'Go Max i Go Smart, od poł. września 2026', icon: 'sync' },
        { at: 'utraty', label: 'Ebook ⇄ audiobook', sub: 'bez utraty miejsca, w wybranych tytułach', icon: 'bookmark' },
        { at: 'predkosci', label: 'Prędkość i rozdziały', icon: 'speed' },
        { at: 'drzemke', label: 'Drzemka', sub: 'także na koniec rozdziału', icon: 'moon' },
        { at: 'pobieranie', label: 'Offline', sub: 'pobierasz na telefon', icon: 'download' },
        { at: 'syntezator', label: 'Syntezator mowy', sub: 'czyta ebooki (EPUB)', icon: 'speaker' },
      ] },
      { id: 'A07', kind: 'rec', kicker: 'FAQ Empik Go', title: 'Limit w Go Standard', rec: { clip: 'faq_limit', start: 0.3, url: 'empik.com/go/faq' },
        marks: [
          { at: 'dodajac', until: 'Podkasty', x: 584, y: 112, w: 792, h: 102 }, { at: 'Podkasty', until: 'Niewykorzystany', x: 584, y: 614, w: 792, h: 126 },
          { at: 'Niewykorzystany', until: 'wybor', x: 584, y: 454, w: 792, h: 126 }, { at: 'wybor', x: 608, y: 360, w: 760, h: 54 },
        ],
        zooms: [{ at: 'limit', zoom: 1.6, x: 980, y: 300 }, { at: 'Podkasty', zoom: 1.6, x: 980, y: 620 }, { at: 'Niewykorzystany', zoom: 1.6, x: 980, y: 480 }, { at: 'wybor', zoom: 1.6, x: 980, y: 360 }],
        tags: [
          { at: 'dodajac', label: 'Dodanie do biblioteki = 1 tytuł', icon: 'library' },
          { at: 'Podkasty', label: 'Podcasty i ASMR bez limitu', icon: 'mic' },
          { at: 'serial', label: 'Serial audio = 1 tytuł', icon: 'headphones' },
          { at: 'Niewykorzystany', label: 'Limit przechodzi dalej', sub: 'do 180 dni, przy opłaconym abonamencie', icon: 'calendar' },
          { at: 'cofniesz', label: 'Wybór cofniesz', sub: 'do 10%, bez pobierania i wysyłki na Kindle', icon: 'sync' },
        ] },
      { id: 'A08', kind: 'rec', kicker: 'Dla dzieci', title: 'Tryb dziecięcy', rec: { clip: 'kids', start: 0.3, url: 'empik.com/go/kidsmode' },
        cuts: [{ at: 'wyjscie', rec: { clip: 'kids', start: 4.15, url: 'empik.com/go/kidsmode' } }, { at: 'Pamietaj', rec: { clip: 'faq_limit', start: 16.8, url: 'empik.com/go/faq' } }],
        marks: [{ at: 'tylko', until: 'wyjscie', x: 1272, y: 636, w: 264, h: 264 }, { at: 'PIN', until: 'Pamietaj', x: 820, y: 266, w: 240, h: 580 }, { at: 'tytuly', x: 584, y: 894, w: 792, h: 102 }],
        zooms: [{ at: 'Pamietaj', zoom: 1.6, x: 980, y: 760 }],
        tags: [
          { at: 'tylko', label: 'Tylko treści dla dzieci', icon: 'kid' }, { at: 'blokuje', label: 'Blokada zakupów i ustawień', icon: 'lock' },
          { at: 'PIN', label: 'Wyjście chronione PIN-em', icon: 'lock' },
          { at: 'Pamietaj', label: 'Tytuły masz, dopóki płacisz', sub: 'dotyczy całej biblioteki', icon: 'library', tone: 'accent' },
        ] },
      { id: 'A09', kind: 'devices', kicker: 'Urządzenia', title: 'Gdzie słuchasz i czytasz?', items: [
        { at: 'Androida', label: 'Android i iOS', sub: 'aplikacja', icon: 'phone', ok: true },
        { at: 'przegladarce', label: 'Przeglądarka', sub: 'audiobooki tylko w aplikacji', icon: 'globe', ok: false },
        { at: 'aucie', label: 'Android Auto i CarPlay', icon: 'car', ok: true },
        { at: 'Kromkast', label: 'Chromecast', icon: 'cast', ok: true },
        { at: 'czytnikach', label: 'Czytniki', sub: 'GoBook, inkBOOK, PocketBook, Bemi', icon: 'ereader', ok: true },
        { at: 'Kindlu', label: 'Kindle', sub: 'do 10 ebooków na okres', icon: 'book', ok: true },
      ] },
      { id: 'A10', kind: 'ratings', bump: 'Opinie', title: 'Oceny i opinie', stores: [{ at: 'Gugl', store: 'google', rating: 4.6, count: '53,7 tys. ocen' }, { at: 'Ep', store: 'apple', rating: 4.5, count: '9,8 tys. ocen (Polska)' }],
        notes: [{ at: 'Oceny', label: 'Oceny całej aplikacji', sub: 'stan na 19.10.2026', icon: 'calendar' }],
        likes: [{ at: 'duzy', label: 'Duży wybór tytułów' }, { at: 'latwa', label: 'Łatwa obsługa' }],
        dislikes: [{ at: 'zawieszanie', label: 'Aplikacja się zawiesza', sub: 'np. przy zmianie rozdziału' }, { at: 'braki', label: 'Braki w katalogu' }] },
      { id: 'A11', kind: 'proscons', bump: 'Plusy i minusy', title: 'Empik Go', pros: [
        { at: 'audiobuki', label: 'Audiobooki, ebooki i podcasty' }, { at: 'sto', label: '130 własnych produkcji' }, { at: 'tryb', label: 'Tryb dziecięcy' }, { at: 'czytniki', label: 'Czytniki, także Kindle' },
      ], cons: [
        { at: 'Smart', label: 'Go Smart: tylko 1 urządzenie' }, { at: 'komputerze', label: 'Nie posłuchasz na komputerze' }, { at: 'niestabilna', label: 'Aplikacja bywa niestabilna' },
      ] },
      { id: 'A12', kind: 'verdict', bump: 'Werdykt', question: 'Empik Go:\nczy warto?', yes: [
        { at: 'Smart', label: 'Słuchasz i czytasz na 1 telefonie', sub: 'Go Smart · 39,99 zł / 30 dni' },
        { at: 'Standard', label: 'Kończysz do 3 książek miesięcznie', sub: 'Go Standard · 24,99 zł / 30 dni' },
      ], no: [], alts: { at: 'tylko', names: ['Audioteka Klub · 29,90 zł / mies. (stan na październik 2026)'], label: 'Tylko audiobooki bez limitu? Porównaj z:' } },
      { id: 'B01', kind: 'stat', bump: 'Jak wypróbować za darmo', kicker: 'Empik Go', title: 'Okres próbny', at: 'Empik', value: '7 dni', label: 'za darmo w każdym planie', tags: [
        { at: 'karta', label: 'Tylko z kartą płatniczą', icon: 'card' }, { at: ['tylko', 1], label: 'Tylko raz', sub: 'bez względu na plan', icon: 'user' },
      ] },
      { id: 'B02', kind: 'steps', kicker: 'Krok 1', title: 'Konto i karta', rec: { clip: 'mobile', start: 4.7, holdAt: 7.4, mobile: true },
        marks: [{ at: 'wybierz', until: 'kliknij', x: 12, y: 280, w: 406, h: 312 }, { at: 'kliknij', until: 'Uwaga', x: 26, y: 522, w: 378, h: 56 }], steps: [
        { at: 'Wejdz', title: 'Wejdź na empik.com/go' }, { at: 'abonamentach', title: 'Abonamenty 30-dniowe', sub: 'wybierz plan' },
        { at: 'kliknij', title: '„Wypróbuj za darmo przez 7 dni”' }, { at: 'Zaloguj', title: 'Zaloguj się lub załóż konto Empik' },
        { at: 'podepnij', title: 'Podepnij kartę', sub: 'dziś płacisz 0 zł' },
      ], note: { at: 'Uwaga', label: 'W aplikacji okres i cena mogą być inne', sub: 'Android: 28 dni · iOS: 1 miesiąc', icon: 'phone' } },
      { id: 'B03', kind: 'rec', kicker: 'Krok 2', title: 'Próba i aplikacja', rec: { clip: 'faq_tabela', start: 0.3, url: 'empik.com/go/faq' },
        marks: [{ at: 'Max', until: 'Standard', x: 584, y: 915, w: 793, h: 46 }, { at: 'Standard', until: 'Pobierz', x: 1185, y: 915, w: 192, h: 46 }],
        zooms: [{ at: 'Max', zoom: 1.6, x: 980, y: 800 }],
        tags: [
          { at: 'limitu', label: 'Go Max i Go Smart: bez limitu', icon: 'infinity' }, { at: 'Standard', label: 'Go Standard: 1 tytuł', sub: 'podcasty bez limitu', icon: 'book' },
          { at: 'Pobierz', label: 'Pobierz aplikację Empik Go', icon: 'download' }, { at: 'zaloguj', label: 'Zaloguj się', icon: 'user' },
        ] },
      { id: 'B04', kind: 'stat', kicker: 'Po okresie próbnym', title: 'Pierwsza opłata', at: 'osmego', value: '8.', unit: 'dzień', label: 'zaczyna się płatny okres, jeśli nie zrezygnujesz', tags: [
        { at: 'Smart', label: 'Go Smart: 39,99 zł / 30 dni', sub: 'stan na październik 2026', icon: 'card' },
      ] },
      { id: 'B05', kind: 'steps', kicker: 'Rezygnacja', title: 'Jak zrezygnować', rec: { clip: 'faq_tabela', start: 5.4, holdAt: 13.1, url: 'empik.com/go/faq' },
        marks: [{ at: 'Twoje', until: 'Anuluj', x: 1074, y: 482, w: 284, h: 26 }, { at: 'Anuluj', x: 616, y: 100, w: 770, h: 80 }], zooms: [{ at: 'Twoje', zoom: 1.6, x: 990, y: 300 }], steps: [
        { at: 'Twoje', title: 'empik.com → Twoje konto', sub: 'zakładka „Abonamenty”' }, { at: 'Anuluj', title: '„Anuluj abonament”' },
        { at: 'aplikacji', title: 'Albo w aplikacji: „Konto”' }, { at: 'najpozniej', title: 'Najpóźniej 7. dnia', sub: 'zanim zacznie się płatny okres' },
      ], note: { at: ['Konto', 1], label: 'Kupione w Google Play lub App Store?', sub: 'płatności obsługuje sklep', icon: 'phone' } },
      { id: 'B06', kind: 'outro', rec: { clip: '@common/sb_home_cards', start: 0.3, url: 'sonorbooks.pl' }, cta: 'Porównaj Empik Go\nz innymi:\nsonorbooks.pl', ctaAt: 'sonorbooks', signAt: 'Twoja',
        tags: [{ at: 'Audioteki', label: 'Ceny i okresy próbne', sub: 'Empik Go · Audioteka · Legimi…', icon: 'search' }] },
    ],
    chapters: [
      { label: 'Czym jest Empik Go', from: 'A02' },
      { label: 'Cennik: Go Smart, Go Max i Go Standard', from: 'A03' },
      { label: 'Katalog i Empik Go Originals', from: 'A04' },
      { label: 'Switch i odtwarzacz', from: 'A06' },
      { label: 'Limit w Go Standard', from: 'A07' },
      { label: 'Tryb dziecięcy', from: 'A08' },
      { label: 'Urządzenia i czytniki', from: 'A09' },
      { label: 'Opinie', from: 'A10' },
      { label: 'Plusy i minusy', from: 'A11' },
      { label: 'Werdykt: czy warto?', from: 'A12' },
      { label: 'Jak wypróbować 7 dni za darmo', from: 'B01' },
      { label: 'Pierwsza opłata i jak zrezygnować', from: 'B04' },
    ],
  },
  thumb: { line1: 'EMPIK GO', line2: 'CZY WARTO?', seal: { icon: 'infinity', text: 'Go Smart\n39,99 zł / 30 dni' }, label: { strong: '7 dni', rest: 'ZA DARMO' } },
};
