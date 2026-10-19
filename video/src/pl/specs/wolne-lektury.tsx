// Wolne Lektury (Fundacja Wolne Lektury, Warszawa). Sustituye a la reseña española de El Libro Total.
// Investigación y guion: research/pl/wolne-lektury/. Sin arranque en frío con audio real: las grabaciones de Wolne Lektury
// llevan licencia CC BY-SA 3.0 o Licencja Wolnej Sztuki (obligan a atribuir y a compartir igual), así que el vídeo empieza en A01.
// Tomas: solo páginas públicas de wolnelektury.pl, sin el banner de la colecta (cuenta atrás hasta el 31.10.2026: caduca pronto).
// Los «cues» son palabras de la locución tal como se dice (`say` de vo.json): «em» (MP3), «dejzi», «Gugl», «Plej», «Ap», «Storze»…
import type { PLPiece } from './index';

export const piece: PLPiece = {
  spec: {
    slug: 'wolne-lektury', name: 'Wolne Lektury', domain: 'wolnelektury.pl', color: '#85C7CC', deep: '#2E7F86', soft: '#E7F4F5',
    logo: 'pl/wolne-lektury/img/logo.svg', logoRatio: 44 / 230, tileBg: '#083F4D', tileLogoWhite: false,
    kicker: 'Recenzja Wolnych Lektur', music: 'pl/wolne-lektury/music/bed.mp3',
    scenes: [
      { id: 'A01', kind: 'hook', title: 'Darmowe\naudiobooki…\ngdzie haczyk?', hi: ['haczyk'], rec: { clip: 'lalka', start: 0.4 }, promises: [
        { at: 'trzydziesci', label: '„Lalka”: 32 godz. za 0 zł', icon: 'headphones' }, { at: 'konta', label: 'Bez konta i bez reklam', icon: 'user' },
        { at: 'legalnie', label: 'Legalnie', tone: 'good' }, { at: 'plusy', label: 'Plusy, minusy, jak zacząć', icon: 'search' },
      ] },
      { id: 'A02', kind: 'intro', bump: 'Czym są Wolne Lektury?', rec: { clip: 'o_projekcie', start: 0.3, rate: 0.6 },
        cuts: [{ at: 'Nagran', rec: { clip: 'o_projekcie', start: 6.2 } }, { at: 'milionow', rec: { clip: 'o_projekcie', start: 1.6 } }], facts: [
        { at: 'Fundacji', label: 'Fundacja Wolne Lektury', sub: 'Warszawa', icon: 'library' },
        { at: 'dwa', label: 'Działa od 2007 roku', icon: 'calendar' },
        { at: 'przeklady', label: 'Nowe przekłady na wolnej licencji', sub: '„Mały Książę”, „Rok 1984”', icon: 'book' },
        { at: 'Nagran', label: 'Ponad 1000 nagrań', icon: 'headphones' },
        { at: 'milionow', label: '7 mln użytkowników rocznie', icon: 'user' },
      ], big: { at: ['siedem', 0], value: 7332, label: 'utwory w bibliotece' } },
      { id: 'A03', kind: 'plans', bump: 'Ile to kosztuje?', kicker: 'Cennik', title: 'Nic nie płacisz', plans: [
        { at: 'Nic', name: 'Wolne Lektury', price: '0 zł', period: 'bez opłat', note: 'stan na październik 2026', features: ['Bez abonamentu', 'Bez okresu próbnego', 'Bez karty płatniczej', 'Bez rejestracji'], best: true, badge: 'Za darmo' },
        { at: 'darowizn', name: 'Darowizna', price: 'Dowolna', period: 'kwota', note: 'jednorazowo albo co miesiąc', features: ['Całkowicie dobrowolna', 'Utrzymuje bibliotekę'] },
      ], footer: [{ at: 'prosby', label: 'Prośby o wsparcie', sub: 'na stronie i na początku wielu nagrań', icon: 'heart' }, { at: 'haczyk', label: 'To cały „haczyk”', icon: 'search', tone: 'accent' }] },
      { id: 'A04', kind: 'rec', bump: 'Co jest w katalogu?', kicker: 'Katalog', title: 'Zakładka „Audiobooki”', rec: { clip: 'katalog', start: 0.4 },
        cuts: [{ at: 'polowa', rec: { clip: 'katalog', start: 10.0 } }, { at: 'Quo', rec: { clip: 'quo_vadis', start: 0.3 } }],
        marks: [{ at: 'epoke', until: 'Uwaga', x: 392, y: 306, w: 1138, h: 44 }, { at: 'Quo', x: 1046, y: 450, w: 144, h: 27 }],
        zooms: [{ at: 'epoke', zoom: 1.5, x: 960, y: 360 }, { at: 'Uwaga', zoom: 1, x: 960, y: 540 }, { at: 'Quo', zoom: 1.8, x: 1040, y: 430 }],
        tags: [
          { at: 'epoke', label: 'Epoka, gatunek, autor', icon: 'search' }, { at: 'polowa', label: 'Ponad połowa to poezja', sub: 'często kilkuminutowe wiersze', icon: 'chart' },
          { at: 'sto', label: 'Ponad 100 powieści', icon: 'book' }, { at: 'Quo', label: '„Quo vadis”', sub: '20 godz. 34 min', icon: 'clock' },
          { at: 'pustyni', label: '„W pustyni i w puszczy”', sub: '13 godz. 30 min', icon: 'clock' },
        ] },
      { id: 'A05', kind: 'rec', bump: 'Jak się słucha?', kicker: '„Pan Tadeusz”', title: 'Odtwarzacz na stronie', rec: { clip: 'pt_player', start: 0.3, holdAt: 3.6 },
        cuts: [{ at: 'predkosc', rec: { clip: 'pt_player', start: 5.4, holdAt: 7.2 } }, { at: 'nazwisko', rec: { clip: 'pt_player', start: 7.9, holdAt: 13.0 } }],
        zooms: [{ at: 'Odtwarzacz', zoom: 1.5, x: 1040, y: 480 }],
        marks: [{ at: 'dwanascie', until: 'predkosc', x: 1040, y: 430, w: 292, h: 306 }, { at: 'predkosc', until: 'nazwisko', x: 848, y: 358, w: 54, h: 138 },
          { at: 'nazwisko', until: 'osiem', x: 688, y: 360, w: 160, h: 28 }, { at: 'osiem', x: 1050, y: 450, w: 138, h: 27 }],
        tags: [
          { at: 'dwanascie', label: '12 ksiąg = rozdziały', icon: 'list' }, { at: 'predkosc', label: 'Prędkość 0,5×–2×', icon: 'speed' },
          { at: 'Wiktor', label: 'Wiktor Korzeniewski', sub: 'lektor', icon: 'mic' }, { at: 'osiem', label: '8 godz. 44 min', icon: 'clock' },
        ] },
      { id: 'A06', kind: 'rec', kicker: 'Lektorzy', title: 'Ludzie, nie AI', rec: { clip: 'kamizelka', start: 0.3 }, cuts: [{ at: 'Tajemniczy', rec: { clip: 'ogrod', start: 0.3 } }],
        marks: [{ at: 'Peszek', until: 'Tajemniczy', x: 688, y: 360, w: 108, h: 28 }, { at: 'Holtz', x: 688, y: 390, w: 120, h: 28 }],
        zooms: [{ at: 'Ludzie', zoom: 1.8, x: 960, y: 330 }],
        tags: [
          { at: 'Peszek', label: 'Jan Peszek', sub: '„Kamizelka”, „Latarnik”', icon: 'mic' }, { at: 'Holtz', label: 'Paulina Holtz', sub: '„Tajemniczy ogród”', icon: 'mic' },
          { at: 'Staszczyk', label: 'Jan Staszczyk', sub: '„Rok 1984”', icon: 'mic' }, { at: 'Dramaty', label: 'Dramaty na dwa głosy', sub: '„Zemsta”, „Wesele”', icon: 'family' },
        ] },
      { id: 'A07', kind: 'rec', bump: 'Pobieranie i e-booki', kicker: 'Offline', title: 'Pobierz audiobook', rec: { clip: 'pt_pobierz', start: 0, holdAt: 9.8 },
        zooms: [{ at: 'Kliknij', zoom: 1.5, x: 960, y: 450 }],
        marks: [{ at: 'em', until: 'ogg', x: 668, y: 300, w: 584, h: 92 }, { at: 'ogg', until: 'dejzi', x: 668, y: 406, w: 584, h: 112 },
          { at: 'dejzi', until: 'e-pub', x: 668, y: 534, w: 584, h: 88 }, { at: 'e-pub', until: 'Cala', x: 668, y: 638, w: 584, h: 104 }, { at: 'Cala', x: 1112, y: 316, w: 136, h: 52 }],
        tags: [
          { at: 'em', label: 'MP3 i OGG', icon: 'download' }, { at: 'dejzi', label: 'DAISY', sub: 'dla osób z trudnościami w czytaniu', icon: 'book' },
          { at: 'e-pub', label: 'EPUB + audiobook', icon: 'sync' }, { at: 'Cala', label: 'Cała książka w ZIP', icon: 'download' },
          { at: 'wolnych', label: 'Wolne licencje', sub: 'pliki zostają u ciebie', tone: 'good' },
        ] },
      { id: 'A08', kind: 'features', kicker: 'E-booki w komplecie', title: 'Czytaj i słuchaj', items: [
        { at: 'przypisami', label: 'Przypisy i motywy', sub: 'literackie, w tekście', icon: 'doc' }, { at: 'online', label: 'Czytaj online', sub: 'w przeglądarce', icon: 'globe' },
        { at: 'pobierasz', label: 'PDF · EPUB · MOBI', sub: 'MOBI na Kindle’a', icon: 'ereader' }, { at: 'jednoczesnie', label: 'Czytasz i słuchasz', sub: 'pomoc przy lekturze szkolnej', icon: 'headphones' },
      ] },
      { id: 'A09', kind: 'devices', items: [
        { at: 'przegladarce', label: 'Przeglądarka', icon: 'globe', ok: true }, { at: 'komputerze', label: 'Komputer', icon: 'laptop', ok: true },
        { at: 'telefonie', label: 'Telefon', icon: 'phone', ok: true }, { at: 'Androida', label: 'Android', sub: 'darmowa aplikacja', icon: 'phone', ok: true },
        { at: 'ajfona', label: 'iPhone', sub: 'aplikacja od 12.2025', icon: 'phone', ok: true }, { at: 'em', label: 'Pliki MP3', sub: 'każde urządzenie', icon: 'download', ok: true },
      ] },
      { id: 'A10', kind: 'ratings', bump: 'Opinie', title: 'Aplikacja Wolne Lektury', stores: [{ at: 'Plej', store: 'google', rating: 4.6, count: '37 opinii' }, { at: 'Storze', store: 'apple', rating: 4.4, count: '14 ocen (Polska)' }],
        notes: [{ at: 'malo', label: 'Mało ocen: aplikacja jest nowa', sub: 'stan na 19.10.2026', icon: 'calendar' }],
        likes: [{ at: 'pozytywne', label: 'Krótkie, pozytywne opinie', sub: 'w Google Play' }],
        dislikes: [{ at: 'zglasza', label: 'Nie startuje podczas rozmowy', sub: 'jedno zgłoszenie w App Storze' }] },
      { id: 'A11', kind: 'proscons', bump: 'Plusy i minusy', title: 'Wolne Lektury', pros: [
        { at: 'darmo', label: '0 zł i legalnie' }, { at: 'konta', label: 'Bez konta i bez reklam' }, { at: 'prawdziwi', label: 'Prawdziwi lektorzy' },
        { at: 'zawsze', label: 'Pliki MP3 na zawsze' }, { at: 'komplecie', label: 'E-book w komplecie' },
      ], cons: [{ at: 'tylko', label: 'Tylko klasyka i lektury', sub: 'żadnych nowości' }, { at: 'polowa', label: 'Ponad połowa to wiersze' }, { at: 'swieza', label: 'Nowa aplikacja, mało ocen' }] },
      { id: 'A12', kind: 'verdict', bump: 'Werdykt', question: 'Wolne Lektury:\nczy warto?', yes: [
        { at: 'uczniow', label: 'Uczniowie, rodzice, fani klasyki', sub: 'trudno o lepszą darmową opcję' },
        { at: 'pelna', label: '„Lalka”: pełna wersja za 0 zł', sub: '2 tomy, ponad 32 godziny' },
      ], no: [
        { at: 'Szukasz', label: 'Szukasz nowości', sub: 'sprawdź kod z biblioteki albo abonament' },
      ], alts: { at: 'Audiotece', names: ['„Lalka” w Audiotece: czyta Zapasiewicz · 8 godz. 55 min · 19,99 zł'], label: 'Stan na październik 2026:' } },
      { id: 'B01', kind: 'steps', bump: 'Jak zacząć', kicker: 'Bez konta', title: 'Słuchasz od razu', rec: { clip: 'portada', start: 1.3 }, steps: [
        { at: 'Wejdz', title: 'Wejdź na wolnelektury.pl' }, { at: 'Audiobooki', title: 'Kliknij „Audiobooki”' },
        { at: 'wpisz', title: 'albo wyszukaj tytuł', rec: { clip: 'szukaj', start: 0.2 } },
        { at: 'plej', title: 'Naciśnij play', sub: 'bez logowania', rec: { clip: 'pt_player', start: 15.5 } },
        { at: 'pobierz', title: 'Offline: „pobierz audiobook”', sub: 'MP3 = cała książka w ZIP', rec: { clip: 'pt_pobierz', start: 0.4 } },
      ],
        marks: [{ at: 'Audiobooki', until: 'wpisz', x: 382, y: 258, w: 102, h: 33 }, { at: 'plej', until: 'pobierz', x: 740, y: 412, w: 58, h: 58, r: 29 }, { at: 'pobierz', until: 'em', x: 676, y: 257, w: 206, h: 71 }, { at: 'em', x: 1112, y: 316, w: 136, h: 52 }] },
      { id: 'B04', kind: 'stat', kicker: 'Na telefonie', title: 'Aplikacja Wolne Lektury', at: 'zainstaluj', value: '0 zł', label: 'darmowa aplikacja na Androida i iPhone’a (stan na 19.10.2026)', tags: [
        { at: 'Plej', label: 'Google Play', icon: 'phone' }, { at: 'Stora', label: 'App Store', icon: 'phone' },
      ] },
      { id: 'B05', kind: 'rec', kicker: 'Licencja', title: 'Drobny druk', rec: { clip: 'pt_player', start: 9.3, holdAt: 15.6 },
        marks: [{ at: 'licencje', x: 698, y: 504, w: 80, h: 34 }], zooms: [{ at: 'udostepniasz', zoom: 2.2, x: 800, y: 470 }],
        tags: [
          { at: 'udostepniasz', label: 'Udostępniasz dalej?', icon: 'link' }, { at: 'autora', label: 'Autor · źródło · licencja', icon: 'doc' },
          { at: 'znajdziesz', label: 'Przy każdym nagraniu', sub: 'ikona licencji', icon: 'check' },
        ] },
      { id: 'B06', kind: 'outro', rec: { clip: '@common/sb_search', start: 5.2, url: 'sonorbooks.pl' }, cta: 'Porównaj, gdzie\nposłuchasz i za ile:\nsonorbooks.pl', ctaAt: 'sonorbooks', signAt: 'Twoja',
        tags: [{ at: 'porownasz', label: 'Audioteka · Empik Go · Legimi', sub: 'ceny: stan na październik 2026', icon: 'search' }] },
    ],
    chapters: [
      { label: 'Czym są Wolne Lektury', from: 'A02' },
      { label: 'Ile to kosztuje i gdzie jest haczyk', from: 'A03' },
      { label: 'Katalog audiobooków', from: 'A04' },
      { label: 'Odtwarzacz i lektorzy', from: 'A05' },
      { label: 'Pobieranie MP3 i e-booki', from: 'A07' },
      { label: 'Urządzenia i aplikacja', from: 'A09' },
      { label: 'Opinie', from: 'A10' },
      { label: 'Plusy i minusy', from: 'A11' },
      { label: 'Werdykt: czy warto?', from: 'A12' },
      { label: 'Jak zacząć', from: 'B01' },
    ],
  },
  thumb: { line1: 'GDZIE JEST', line2: 'HACZYK?', screen: 'pl/wolne-lektury/img/thumb_screen.jpg', screenMobile: false, seal: { icon: 'headphones', text: '1000+\nnagrań' }, label: { strong: '0 zł', rest: 'BEZ KONTA' } },
};
