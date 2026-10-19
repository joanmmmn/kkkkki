// Storytel w Polsce (sin prueba gratis en la web: el bloque B explica cómo empezar más barato). Investigación y guion: research/pl/storytel/.
// Los «cues» son palabras de la locución tal como quedan en public/pl/storytel/vo/<ID>.json («Bejzik», «Anlimitid», «Femili», «Orydżinal»…
// cuando la frase dicha tiene otro número de palabras; si no, la grafía del texto: «Basic», «Unlimited», «Google»…).
import type { PLPiece } from './index';

export const piece: PLPiece = {
  spec: {
    slug: 'storytel', name: 'Storytel', domain: 'storytel.com/pl', color: '#FF501C', deep: '#D63E0F', soft: '#FFEDE5',
    logo: 'pl/storytel/img/logo.svg', logoWhite: 'pl/storytel/img/logo_white.svg', logoRatio: 24 / 115, tileBg: '#101010', tileLogoWhite: true,
    kicker: 'Recenzja Storytel', music: 'pl/storytel/music/bed.mp3',
    scenes: [
      { id: 'A01', kind: 'hook', title: 'Storytel:\nczy warto\npłacić?', hi: ['Storytel'], rec: { clip: 'hero', start: 0.4 },
        cuts: [{ at: 'ceny', rec: { clip: 'plany', start: 0.3, url: 'storytel.com/pl/subscriptions' } }, { at: 'Powiemy', rec: { clip: 'original', start: 0.3 } }, { at: 'zaczac', rec: { clip: 'promo', start: 0.4 } }],
        promises: [{ at: 'ceny', label: 'Ceny, katalog, regulamin', icon: 'search' }, { at: 'dobre', label: 'Co dobre', tone: 'good' }, { at: 'zle', label: 'Co złe', tone: 'bad' }, { at: 'najtaniej', label: 'Jak zacząć najtaniej', sub: 'darmowej próby teraz nie ma', icon: 'coin' }] },
      { id: 'A02', kind: 'intro', bump: 'Czym jest Storytel', rec: { clip: 'hero', start: 3.2 },
        facts: [{ at: 'szwedzki', label: 'Szwedzki serwis', sub: 'audiobooki i e-booki', icon: 'headphones' }, { at: 'szesnastego', label: 'W Polsce od 2016 roku', icon: 'calendar' }, { at: 'Sluchasz', label: 'Słuchasz i czytasz', sub: 'w jednej aplikacji', icon: 'book' }, { at: 'angielsku', label: 'Po polsku i po angielsku', icon: 'globe' }],
        big: { at: 'piecset', value: 500000, suffix: '+', label: 'tytułów do wyboru' } },
      { id: 'A03', kind: 'plans', bump: 'Cennik', title: 'Cztery plany, płatne co 30 dni', plans: [
        { at: 'Bejzik', name: 'Basic', price: '24,90 zł', period: '/ 30 dni', features: ['25 h miesięcznie'] },
        { at: 'Premium', name: 'Premium', price: '34,90 zł', period: '/ 30 dni', features: ['50 h miesięcznie'] },
        { at: 'Anlimitid', name: 'Unlimited', price: '44,90 zł', period: '/ 30 dni', features: ['Bez limitu godzin'], best: true, badge: 'Bez limitu' },
        { at: 'Femili', name: 'Family', price: '59,90 zł', period: '/ 30 dni', note: 'za 2 konta', features: ['3 konta: 69,90 zł', 'Bez limitu godzin'] },
      ], footer: [{ at: 'plany', label: 'Stan na październik 2026', icon: 'calendar' }, { at: 'zobowiazan', label: 'Bez zobowiązań', icon: 'lock' }] },
      { id: 'A04', kind: 'rec', bump: 'Jak to działa', kicker: 'Bez logowania', title: 'Katalog na stronie', rec: { clip: 'katalog', start: 0.2 },
        marks: [{ at: 'cotygodniowe', until: 'wyczekiwane', x: 52, y: 138, w: 440, h: 56 }, { at: 'wyczekiwane', until: 'najpopularniejsze', x: 52, y: 493, w: 422, h: 56 }, { at: 'Harry', until: 'Ale', x: 60, y: 440, w: 370, h: 260 }],
        tags: [{ at: 'logowania', label: 'Bez logowania', icon: 'globe' }, { at: 'Harry', label: 'Harry Potter, Wiedźmin…', icon: 'book' }, { at: 'Ale', label: 'Słuchasz tylko w aplikacji', icon: 'phone', tone: 'accent' }] },
      { id: 'A05', kind: 'rec', kicker: 'Tylko w Storytel', title: 'Storytel Original', rec: { clip: 'original', start: 0.2 },
        cuts: [{ at: 'Kruk', rec: { clip: 'kruk', start: 13.0 } }, { at: 'Arka', rec: { clip: 'arka', start: 0.3 } }],
        marks: [{ at: 'dostepne', until: 'Kruk', x: 70, y: 256, w: 820, h: 104 }, { at: 'Kanal', until: 'Arka', x: 667, y: 659, w: 1199, h: 66 }, { at: 'Jakuba', until: 'Gierszalem', x: 667, y: 226, w: 320, h: 40 }, { at: 'Gierszalem', x: 1406, y: 279, w: 131, h: 40 }],
        tags: [{ at: 'Orydz', label: 'Storytel Original', sub: 'tylko w Storytel', icon: 'sparkle' }, { at: 'Kruk', label: 'Kruk. Słuchowisko', sub: 'Storytel × Canal+, Michał Żurawski', icon: 'headphones' }, { at: 'Arka', label: 'Arka. Niebo', sub: 'Żulczyk i Rogoża, Jakub Gierszał', icon: 'headphones' }] },
      { id: 'A06', kind: 'rec', kicker: 'Karta książki', title: 'Kruk. Słuchowisko', rec: { clip: 'kruk', start: 0.2 },
        marks: [{ at: 'lektorow', until: 'dlugosc', x: 667, y: 256, w: 1199, h: 132 }, { at: 'trzy', until: 'cztery', x: 760, y: 436, w: 182, h: 64 }, { at: 'cztery', until: 'Mozesz', x: 667, y: 436, w: 96, h: 64 }, { at: 'odsluchac', x: 290, y: 517, w: 138, h: 72 }],
        tags: [{ at: 'lektorow', label: 'Lektorzy', icon: 'mic' }, { at: 'trzy', label: '3 godz. 7 min', icon: 'clock' }, { at: 'cztery', label: '4,6 · 12 161 ocen', icon: 'star' }, { at: 'odsluchac', label: 'Próbka do odsłuchu', icon: 'play' }] },
      { id: 'A07', kind: 'features', kicker: 'Aplikacja', title: 'Co potrafi?', cols: 3, items: [
        { at: 'przelaczysz', label: 'Słuchanie i czytanie', sub: 'przełączasz w dowolnym miejscu', icon: 'sync' }, { at: 'tempa', label: 'Tempo', icon: 'speed' },
        { at: 'zakladki', label: 'Zakładki', icon: 'bookmark' }, { at: 'wylacznik', label: 'Wyłącznik czasowy', icon: 'moon' },
        { at: 'offline', label: 'Offline', icon: 'download' }, { at: 'szukanie', label: 'Szukanie w audiobooku', sub: 'nowość: Search in Book', icon: 'search' },
        { at: 'wyszukiwanie', label: 'Książka ze zdjęcia', sub: 'nowość: Story Scan', icon: 'sparkle' },
      ] },
      { id: 'A08', kind: 'stat', kicker: 'Basic i Premium', title: 'Liczy się tempo 1×', at: 'szybciej', value: '−4 h', label: 'z limitu za 2 godziny słuchania w tempie 2×', tags: [
        { at: 'Unlimited', label: 'Unlimited: godzin nie liczysz', icon: 'infinity', tone: 'good' }, { at: 'urzadzeniu', label: '1 konto = 1 urządzenie naraz', icon: 'phone' },
      ] },
      { id: 'A08B', kind: 'rec', side: 'right', kicker: 'Rodzina i dzieci', title: 'Family i Kids Mode', rec: { clip: 'faq', start: 2.6 },
        cuts: [{ at: 'dzieci', rec: { clip: 'plany', start: 11.0, url: 'storytel.com/pl/subscriptions' } }],
        marks: [{ at: 'osobne', until: 'dzieci', x: 456, y: 634, w: 1004, h: 164 }, { at: 'dzieciecy', x: 958, y: 900, w: 910, h: 110 }],
        tags: [{ at: 'osobne', label: 'Osobne konta i półki', icon: 'family' }, { at: 'jedna', label: 'Płaci jedna osoba', icon: 'card' }, { at: 'dzieciecy', label: 'Tryb dziecięcy z PIN-em', icon: 'lock' }] },
      { id: 'A09', kind: 'devices', items: [
        { at: 'telefonach', label: 'Telefon i tablet', sub: 'Android, iOS', icon: 'phone', ok: true }, { at: 'zegarkach', label: 'Zegarki', sub: 'Apple Watch, Wear OS', icon: 'watch', ok: true },
        { at: 'samochodzie', label: 'Samochód', sub: 'Android Auto, CarPlay', icon: 'car', ok: true }, { at: 'Kromkastem', label: 'Chromecast', sub: 'z Androidem', icon: 'cast', ok: true },
        { at: 'komputerze', label: 'Komputer', icon: 'laptop', ok: false }, { at: 'stronie', label: 'Strona www', icon: 'globe', ok: false },
      ] },
      { id: 'A10', kind: 'ratings', bump: 'Opinie', stores: [{ at: 'Gugl', store: 'google', rating: 4.7, count: 'w Polsce, 19.10.2026' }, { at: 'Ep', store: 'apple', rating: 4.8, count: '45 772 oceny w Polsce' }],
        likes: [{ at: 'jedna', label: 'Jedna cena za wszystko' }], dislikes: [{ at: 'znikanie', label: 'Znikające książki', sub: 'nawet w połowie serii' }, { at: 'sztuczna', label: 'Tytuły czytane przez AI' }] },
      { id: 'A11', kind: 'proscons', bump: 'Plusy i minusy', title: 'Storytel w Polsce', pros: [
        { at: 'Unlimited', label: 'Unlimited bez limitu godzin' }, { at: 'audiobooki', label: 'Audiobooki i e-booki w jednej cenie' }, { at: 'wlasne', label: 'Storytel Original' }, { at: 'konta', label: 'Konta rodzinne' },
      ], cons: [
        { at: ['Unlimited', 1], label: 'Droższy Unlimited: 44,90 zł', sub: 'wcześniej 39,90 zł' }, { at: 'darmowej', label: 'Brak darmowej próby' }, { at: 'komputer', label: 'Brak wersji na komputer' }, { at: 'znikajace', label: 'Znikające książki' },
      ] },
      { id: 'A12', kind: 'verdict', bump: 'Werdykt', yes: [
        { at: 'duzo', label: 'Słuchasz dużo', sub: 'Unlimited bez liczenia godzin, najlepiej z promocją' }, { at: 'mniej', label: 'Słuchasz mniej', sub: 'wystarczy Basic: 25 h za 24,90 zł' },
      ], no: [], alts: { at: 'porownaj', names: ['Audioteka Klub', 'Empik Go'], label: 'Porównaj z:' } },
      { id: 'B01', kind: 'stat', bump: 'Jak zacząć taniej', kicker: 'Nowi klienci', title: 'Darmowej próby teraz nie ma', at: 'dwie', value: '2', label: 'promocje na Unlimited dla nowych klientów', tags: [
        { at: 'Unlimited', label: 'Stan na październik 2026', icon: 'calendar' },
      ] },
      { id: 'B02', kind: 'rec', kicker: 'Tylko dla nowych klientów', title: 'Dwie promocje', rec: { clip: 'promo', start: 0.3, url: 'storytel.com/pl/signup' },
        cuts: [{ at: 'Druga', rec: { clip: 'rok', start: 0.3 } }],
        marks: [{ at: 'dwadziescia', until: 'potem', x: 328, y: 448, w: 300, h: 70 }, { at: 'potem', until: 'Druga', x: 327, y: 519, w: 420, h: 138 }, { at: 'pierwszy', x: 962, y: 448, w: 904, h: 300 }],
        tags: [{ at: 'miesiecznie', label: '22,45 zł / mies.', sub: 'przez pierwsze 180 dni', icon: 'coin' }, { at: 'potem', label: 'Potem 44,90 zł', icon: 'calendar' }, { at: 'pierwszy', label: '320 zł za pierwszy rok', icon: 'gift' }, { at: 'platne', label: 'Płatne z góry', icon: 'card' }] },
      { id: 'B03', kind: 'steps', kicker: 'Rejestracja', title: 'Konto i aplikacja', rec: { clip: 'promo', start: 3.6, url: 'storytel.com/pl/signup' }, steps: [
        { at: 'oferte', title: 'Wybierz ofertę' }, { at: 'zakladasz', title: 'Konto i płatność' },
        { at: 'zgod', title: 'Zgody marketingowe?', sub: 'nie musisz zaznaczać' }, { at: 'logujesz', title: 'Zaloguj się w aplikacji', sub: 'tym samym kontem' },
      ], marks: [{ at: 'zgod', x: 1040, y: 664, w: 552, h: 164 }] },
      { id: 'B04', kind: 'steps', kicker: 'Rezygnacja', title: 'Jak zrezygnować', rec: { clip: 'faq', start: 17.4, holdAt: 24.0 }, steps: [
        { at: 'Zaloguj', title: 'Zaloguj się na stronie' }, { at: 'Subskrypcje', title: 'Wejdź w „Subskrypcję”' },
        { at: 'Anuluj', title: 'Anuluj i potwierdź', sub: 'przyjdzie e-mail' }, { at: 'Google', title: 'Google Play / App Store', sub: 'anulujesz tam' },
      ], marks: [{ at: 'Zaloguj', until: 'Google', x: 460, y: 486, w: 580, h: 38 }, { at: 'Google', x: 460, y: 524, w: 760, h: 38 }],
        note: { at: 'usuniecie', label: 'Usunięcie aplikacji nie anuluje', icon: 'phone' } },
      { id: 'B05', kind: 'features', kicker: 'Drobny druk', title: 'Regulamin Storytel', cols: 1, items: [
        { at: 'anulujesz', label: 'Rezygnujesz w trakcie promocji? Koniec od razu', sub: 'regulamin, pkt 3.1 i 6.2', icon: 'doc' },
        { at: 'ostatniej', label: 'Godzina przed płatnością: bez zmian', sub: 'regulamin, pkt 6.2', icon: 'clock', tone: 'bad' },
      ] },
      { id: 'B06', kind: 'outro', rec: { clip: '@common/sb_search', start: 0.2, url: 'sonorbooks.pl' }, cta: 'Porównaj, gdzie\nposłuchasz i za ile:\nsonorbooks.pl', ctaAt: 'sonorbooks', signAt: 'Twoja',
        tags: [{ at: 'Audiotek', label: 'Audioteka · Empik Go · Legimi · Audible', icon: 'search' }] },
    ],
    chapters: [
      { label: 'Czym jest Storytel', from: 'A02' },
      { label: 'Cennik: Basic, Premium, Unlimited i Family', from: 'A03' },
      { label: 'Katalog na stronie', from: 'A04' },
      { label: 'Storytel Original', from: 'A05' },
      { label: 'Karta książki', from: 'A06' },
      { label: 'Funkcje aplikacji', from: 'A07' },
      { label: 'Limity godzin i urządzeń', from: 'A08' },
      { label: 'Family i tryb dziecięcy', from: 'A08B' },
      { label: 'Urządzenia', from: 'A09' },
      { label: 'Opinie', from: 'A10' },
      { label: 'Plusy i minusy', from: 'A11' },
      { label: 'Werdykt: czy warto?', from: 'A12' },
      { label: 'Jak zacząć taniej: promocje', from: 'B01' },
      { label: 'Konto i aplikacja', from: 'B03' },
      { label: 'Jak zrezygnować', from: 'B04' },
      { label: 'Drobny druk regulaminu', from: 'B05' },
    ],
  },
  thumb: { line1: 'STORYTEL', line2: 'CZY WARTO?', seal: { icon: 'infinity', text: 'Unlimited\n44,90 zł' }, label: { strong: 'Bez', rest: 'DARMOWEJ PRÓBY' } },
};
