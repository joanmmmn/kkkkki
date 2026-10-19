// Rakuten Kobo / Kobo Plus (Polska, desde finales de mayo de 2026). Sustituye a la reseña española de Audiobooks.com.
// Investigación y guion: research/pl/kobo/. kobo.com/pl respondió el 19/10/2026 con un desafío de Cloudflare (403) y no se pudo
// grabar ni comprobar: los precios (prensa polaca y sonorbooks.pl) se presentan como «warunki publikowane w październiku 2026»
// y se enseñan las fuentes (sonorbooks.pl, Świat Czytników, NaCzytniku) y la ayuda oficial help.kobo.com (solo en inglés).
// Los «cues» son palabras de la locución tal como quedan en vo/<ID>.json: «Rid», «Lisen», «Gugl», «Ep», «Klara»…
import type { PLPiece } from './index';

export const piece: PLPiece = {
  spec: {
    slug: 'kobo', name: 'Kobo Plus', domain: 'help.kobo.com', color: '#BF0000', deep: '#8F0000', soft: '#FEF2F2',
    logo: 'pl/kobo/img/logo.svg', logoWhite: 'pl/kobo/img/logo_white.svg', logoRatio: 38.22 / 205.3,
    kicker: 'Recenzja Kobo Plus', music: 'pl/kobo/music/bed.mp3',
    scenes: [
      { id: 'A01', kind: 'hook', title: 'Kobo Plus:\nczy warto?', hi: ['Kobo', 'Plus'], rec: { clip: 'pomoc_urzadzenia', start: 0.3 }, promises: [
        { at: 'ceny', label: 'Ceny', icon: 'coin' }, { at: 'polski', label: 'Polski katalog', icon: 'book' }, { at: 'drobny', label: 'Drobny druk', icon: 'search' },
        { at: 'dobre', label: 'Plusy i minusy', tone: 'good' }, { at: '14', label: '14 dni za darmo', icon: 'gift' },
      ] },
      { id: 'A02', kind: 'intro', bump: 'Czym jest Kobo Plus?', rec: { clip: 'swiat', start: 0.3, url: 'swiatczytnikow.pl' }, cuts: [{ at: 'Abonament', rec: { clip: 'pomoc_faq', start: 0.2, holdAt: 5.4 } }], facts: [
        { at: 'kanadyjska', label: 'Marka z Kanady', sub: 'czytniki i księgarnia z e-bookami', icon: 'ereader' },
        { at: 'Rakutena', label: 'Należy do Rakutena', sub: 'Japonia', icon: 'globe' },
        { at: 'Polsce', label: 'W Polsce od końca maja 2026', icon: 'calendar' },
        { at: 'czytnikach', label: 'Aplikacja i czytniki Kobo', icon: 'headphones' },
      ] },
      { id: 'A03', kind: 'rec', bump: 'Cennik', kicker: 'Cennik', title: 'Trzy plany', rec: { clip: 'sonorbooks', start: 9.0, url: 'sonorbooks.pl/platformy' },
        cuts: [{ at: 'Rid', rec: { clip: 'swiat', start: 7.0, url: 'swiatczytnikow.pl' } }, { at: 'Placisz', rec: { clip: 'naczytniku', start: 8.8, url: 'naczytniku.pl' } }],
        marks: [{ at: 'Placisz', until: 'czternascie', x: 364, y: 216, w: 792, h: 82 }, { at: 'czternascie', x: 364, y: 354, w: 792, h: 56 }],
        zooms: [{ at: 'Placisz', zoom: 1.6, x: 760, y: 300 }],
        tags: [
          { at: 'warunkow', label: 'Stan: październik 2026', icon: 'calendar', tone: 'accent' },
          { at: 'Rid', label: 'Read: 39,90 zł', sub: 'e-booki · miesięcznie', icon: 'book' },
          { at: 'Lisen', label: 'Listen: 39,90 zł', sub: 'audiobooki · miesięcznie', icon: 'headphones' },
          { at: 'end', label: 'Read & Listen: 49,90 zł', sub: 'e-booki i audiobooki', icon: 'sparkle' },
          { at: 'Placisz', label: 'Bez zobowiązań', sub: 'płacisz co miesiąc', icon: 'sync' },
          { at: 'czternascie', label: '14 dni za darmo', icon: 'gift' },
        ] },
      { id: 'A04', kind: 'rec', bump: 'Jak to działa', kicker: 'Pomoc Kobo', title: 'Co jest w abonamencie?', rec: { clip: 'pomoc_faq', start: 8.1 },
        cuts: [{ at: 'zalogowaniu', rec: { clip: 'pomoc_szukaj', start: 0.3 } }],
        marks: [{ at: 'oznaczonych', until: 'Reszte', x: 784, y: 376, w: 760, h: 58 }, { at: 'Reszte', until: 'zalogowaniu', x: 784, y: 276, w: 760, h: 78 },
          { at: 'zalogowaniu', until: 'filtr', x: 824, y: 156, w: 720, h: 48 }, { at: 'filtr', x: 836, y: 370, w: 150, h: 54 }],
        zooms: [{ at: 'limitu', zoom: 1.45, x: 1160, y: 340 }],
        tags: [
          { at: 'limitu', label: 'Bez limitu godzin', icon: 'infinity' }, { at: 'oznaczonych', label: 'Tylko tytuły Kobo Plus', icon: 'check' },
          { at: 'Reszte', label: 'Reszta: zakup osobno', icon: 'coin' }, { at: 'filtr', label: 'Filtr „tylko Kobo Plus”', sub: 'po zalogowaniu na kobo.com', icon: 'search' },
        ] },
      { id: 'A05', kind: 'stat', bump: 'Polski katalog', kicker: 'Katalog na start', title: 'Ile tytułów?', at: 'sto', value: '150 000', unit: '+', count: { from: 0, to: 150000 },
        label: 'audiobooków i 1,5 mln+ e-booków (strona Kobo, maj 2026)', tags: [
          { at: 'angielsku', label: 'Głównie po angielsku', icon: 'globe' }, { at: 'malo', label: 'Po polsku: na razie mało', tone: 'bad' },
          { at: 'serwisy', label: '„prawie nic tam nie ma”', sub: 'Świat Czytników, 31.05.2026', icon: 'doc' },
        ] },
      { id: 'A06', kind: 'rec', kicker: 'NaCzytniku.pl · 23.06.2026', title: 'Mocna oferta po angielsku', rec: { clip: 'naczytniku', start: 0.3, url: 'naczytniku.pl' },
        marks: [{ at: 'angielsku', x: 364, y: 156, w: 792, h: 108 }], zooms: [{ at: 'angielsku', zoom: 1.5, x: 760, y: 300 }],
        tags: [
          { at: 'angielsku', label: 'EN: dużo większy wybór', tone: 'good' }, { at: 'audiobookow', label: 'Także audiobooki', icon: 'headphones' },
          { at: 'oryginale', label: 'Słuchasz w oryginale', icon: 'book' }, { at: 'uczysz', label: 'Uczysz się angielskiego', icon: 'school' },
        ] },
      { id: 'A07', kind: 'features', bump: 'Aplikacja i czytniki', kicker: 'Odtwarzacz', title: 'Aplikacja Kobo Books', cols: 3, items: [
        { at: 'darmowej', label: 'Darmowa aplikacja', sub: 'Android i iOS', icon: 'phone' }, { at: 'rozdzialow', label: 'Spis rozdziałów', icon: 'list' },
        { at: '10', label: '10 sekund', sub: 'w przód i w tył', icon: 'sync' }, { at: 'predkosci', label: 'Prędkość', icon: 'speed' },
        { at: 'wylacznik', label: 'Wyłącznik czasowy', icon: 'moon' }, { at: 'internetu', label: 'Offline', sub: 'pobierz audiobook', icon: 'download' },
      ] },
      { id: 'A08', kind: 'rec', kicker: 'Pomoc Kobo', title: 'Audiobooki na czytniku', rec: { clip: 'pomoc_urzadzenia', start: 3.0 },
        marks: [], zooms: [],
        tags: [
          { at: 'czytnikach', label: 'Wybrane czytniki Kobo', icon: 'ereader' }, { at: 'sluchawki', label: 'Słuchawki lub głośnik', sub: 'przez Bluetooth', icon: 'headphones' },
          { at: 'Klara', label: 'Clara BW · Clara Colour', icon: 'check' }, { at: 'Libra', label: 'Libra Colour · Sage', icon: 'check' },
        ] },
      { id: 'A09', kind: 'devices', items: [
        { at: 'Androidzie', label: 'Android', icon: 'phone', ok: true }, { at: 'ajfonie', label: 'iPhone i iPad', icon: 'tablet', ok: true },
        { at: 'Kar', label: 'CarPlay', sub: 'z iPhone’a', icon: 'car', ok: true }, { at: 'komputerze', label: 'Komputer', icon: 'laptop', ok: false },
        { at: 'anulujesz', label: 'Abonament w aplikacji iOS', sub: 'kupisz i anulujesz na kobo.com', icon: 'card', ok: false },
      ] },
      { id: 'A10', kind: 'ratings', bump: 'Opinie', title: 'Oceny i recenzje', stores: [{ at: 'Gugl', store: 'google', rating: 3.7, count: '308 tys. opinii' }, { at: 'Ep', store: 'apple', rating: 4.2, count: '206 ocen (Polska)' }],
        notes: [{ at: 'calej', label: 'Oceny całej aplikacji', sub: 'nie samego abonamentu · 19.10.2026', icon: 'star' }],
        likes: [{ at: 'chwala', label: 'Działa wprost na czytniku Kobo', sub: 'polskie serwisy o czytnikach' }],
        dislikes: [{ at: 'skromny', label: 'Skromny polski katalog' }, { at: 'zaplata', label: 'Trudno sprawdzić katalog przed zapłatą' }] },
      { id: 'A11', kind: 'proscons', bump: 'Plusy i minusy', title: 'Kobo Plus', pros: [{ at: 'limitu', label: 'Bez limitu godzin' }, { at: 'czytniku', label: 'Audiobooki także na czytniku' }, { at: 'angielsku', label: 'Duży wybór po angielsku' }, { at: '14', label: '14 dni na próbę' }], cons: [{ at: 'malo', label: 'Mało polskich audiobooków' }, { at: 'komputerze', label: 'Nie posłuchasz na komputerze' }, { at: 'kupisz', label: 'Abonamentu nie kupisz w aplikacji' }, { at: 'rezygnacji', label: 'Po rezygnacji koniec dostępu' }] },
      { id: 'A12', kind: 'verdict', bump: 'Werdykt', question: 'Kobo Plus:\nczy warto?', yes: [
        { at: 'tak', label: 'Czytnik Kobo + angielski', sub: 'wygodny abonament bez limitu godzin' },
        { at: 'probnym', label: 'W próbie znajdziesz swoje książki', sub: 'sprawdź to w ciągu 14 dni' },
      ], no: [
        { at: 'polsku', label: 'Słuchasz głównie po polsku', sub: 'na razie lepszy polski katalog' },
      ], alts: { at: 'Audioteka', names: ['Audioteka Klub · 29,90 zł / mies. · bez limitu w katalogu Klubu'], label: 'Dla porównania (10.2026):' } },
      { id: 'B01', kind: 'steps', bump: 'Jak wypróbować za darmo', kicker: 'Okres próbny', title: 'Jak zacząć', rec: { clip: 'pomoc_subskrypcja', start: 11.7 },
        marks: [{ at: 'zaloguj', until: 'zakladke', x: 630, y: 152, w: 250, h: 28 }, { at: 'zakladke', x: 816, y: 286, w: 92, h: 32 }], steps: [
        { at: ['kobo', 0], title: 'Wejdź na kobo.com' }, { at: 'zaloguj', title: 'Zaloguj się', sub: 'albo załóż darmowe konto Kobo' }, { at: 'zakladke', title: 'Otwórz zakładkę Kobo Plus' },
      ] },
      { id: 'B02', kind: 'rec', kicker: 'Okres próbny', title: 'Karta i jedna próba', rec: { clip: 'pomoc_subskrypcja', start: 0.4, holdAt: 9.0 },
        cuts: [{ at: 'Proba', rec: { clip: 'pomoc_anuluj', start: 0.3 } }],
        marks: [{ at: 'karte', until: 'przedplaconych', x: 616, y: 662, w: 560, h: 30 }, { at: 'przedplaconych', until: 'Proba', x: 616, y: 692, w: 560, h: 30 }, { at: 'Proba', x: 784, y: 240, w: 730, h: 56 }],
        zooms: [{ at: 'Wybierz', zoom: 1.5, x: 900, y: 560 }, { at: 'Proba', zoom: 1.5, x: 1100, y: 330 }],
        tags: [
          { at: 'Listen', label: 'Listen lub Read & Listen', icon: 'headphones' }, { at: 'karte', label: 'Karta wymagana', icon: 'card' },
          { at: 'przedplaconych', label: 'Bez kart przedpłaconych', tone: 'bad' }, { at: 'nowych', label: 'Tylko dla nowych', sub: 'jedna próba na konto', icon: 'user' },
        ] },
      { id: 'B03', kind: 'steps', kicker: 'Słuchanie', title: 'Dodaj tytuły Kobo Plus', rec: { clip: 'pomoc_szukaj', start: 10.7 },
        marks: [{ at: 'aplikacji', until: 'czytniku', x: 824, y: 790, w: 420, h: 94 }, { at: 'czytniku', x: 824, y: 340, w: 560, h: 30 }], steps: [
        { at: 'zaloguj', title: 'Zaloguj się', sub: 'w aplikacji Kobo Books albo na czytniku' }, { at: 'dodawaj', title: 'Dodawaj tytuły „Kobo Plus”' },
      ] },
      { id: 'B04', kind: 'steps', kicker: 'Rezygnacja', title: 'Jak zrezygnować', rec: { clip: 'pomoc_subskrypcja', start: 0.4, holdAt: 9.0 },
        marks: [{ at: 'czternastu', until: ['kobo', 1], x: 590, y: 200, w: 764, h: 62 }, { at: ['kobo', 1], until: 'anulowaniu', x: 800, y: 76, w: 480, h: 56 }, { at: 'anulowaniu', x: 844, y: 532, w: 660, h: 66 }], steps: [
        { at: 'czternastu', title: 'Po 14 dniach: opłata co miesiąc' }, { at: 'anuluj', title: 'Anuluj przed końcem próby', sub: 'wtedy karta nie zostanie obciążona' },
        { at: ['kobo', 1], title: 'kobo.com › konto › subskrypcje', sub: 'nie na czytniku ani w aplikacji na iPhone’a', rec: { clip: 'pomoc_anuluj', start: 6.45 } },
        { at: 'anulowaniu', title: 'Po anulowaniu: koniec dostępu', sub: 'do książek z Kobo Plus' },
      ] },
      { id: 'B06', kind: 'outro', rec: { clip: 'sonorbooks', start: 0.2, url: 'sonorbooks.pl/platformy' }, cta: 'Porównaj Kobo Plus\nz innymi:\nsonorbooks.pl', ctaAt: 'sonorbooks', signAt: 'Twoja',
        tags: [{ at: 'Audiotek', label: 'Audioteka · Empik Go · Legimi', icon: 'search' }] },
    ],
    chapters: [
      { label: 'Czym jest Kobo Plus', from: 'A02' },
      { label: 'Cennik: Read, Listen i Read & Listen', from: 'A03' },
      { label: 'Jak działa abonament', from: 'A04' },
      { label: 'Polski katalog', from: 'A05' },
      { label: 'Dla kogo: książki po angielsku', from: 'A06' },
      { label: 'Aplikacja i odtwarzacz', from: 'A07' },
      { label: 'Audiobooki na czytnikach Kobo', from: 'A08' },
      { label: 'Urządzenia', from: 'A09' },
      { label: 'Opinie', from: 'A10' },
      { label: 'Plusy i minusy', from: 'A11' },
      { label: 'Werdykt: czy warto?', from: 'A12' },
      { label: 'Jak wypróbować za darmo', from: 'B01' },
      { label: 'Jak zrezygnować', from: 'B04' },
    ],
  },
  thumb: { line1: 'KOBO PLUS', line2: 'CZY WARTO?', seal: { icon: 'headphones', text: 'Listen\n39,90 zł' }, label: { strong: '14 dni', rest: 'ZA DARMO' } },
};
