// Audiobooki w Spotify (Polska, desde el 15/10/2026). Investigación y guion: research/pl/spotify/.
// Los «cues» son palabras de la locución tal como se dice (`say` de vo.json): «Indiwidżual», «Femili», «Plus»…
import type { PLPiece } from './index';

export const piece: PLPiece = {
  spec: {
    slug: 'spotify', name: 'Spotify', domain: 'spotify.com/pl', color: '#1ED760', deep: '#11843F', soft: '#E2F8EA',
    logo: 'pl/spotify/img/logo.svg', logoWhite: 'pl/spotify/img/logo_white.svg', logoRatio: 225.25 / 823.46, tileBg: '#121212', tileLogoWhite: true,
    kicker: 'Audiobooki w Spotify', music: 'pl/spotify/music/bed.mp3',
    scenes: [
      { id: 'A01', kind: 'hook', title: 'Audiobooki\nw Spotify:\nczy warto?', hi: ['Spotify:', 'Spotify'], rec: { clip: 'hero', start: 0.4 }, promises: [{ at: 'dobre', label: 'Co jest dobre', tone: 'good' }, { at: 'slabe', label: 'Co słabe', tone: 'bad' }, { at: 'zaczac', label: 'Jak zacząć', icon: 'play' }] },
      { id: 'A02', kind: 'intro', bump: 'Co dostajesz?', rec: { clip: 'hero', start: 6.3 }, facts: [{ at: 'pietnastego', label: 'W Polsce od 15.10.2026', icon: 'calendar' }, { at: 'aplikacji', label: 'Muzyka, podcasty i audiobooki', sub: 'w jednej aplikacji', icon: 'headphones' }, { at: 'dwanascie', label: '12 h miesięcznie w Premium', icon: 'clock' }, { at: 'Legimi', label: 'Polski katalog od Legimi', icon: 'book' }], big: { at: 'trzysta', value: 350000, suffix: '+', label: 'tytułów, w tym 20 000+ po polsku' } },
      { id: 'A03', kind: 'plans', bump: 'Cennik', title: 'Kto ma godziny?', plans: [
        { at: 'Indiwi', name: 'Individual', price: '26,99 zł', period: '/ mies.', features: ['12 h audiobooków'], best: true, badge: 'Godziny w cenie' },
        { at: 'Duo', name: 'Duo', price: '36,99 zł', period: '/ mies.', features: ['12 h tylko dla właściciela'] },
        { at: 'Femili', name: 'Family', price: '45,99 zł', period: '/ mies.', features: ['12 h tylko dla właściciela'] },
        { at: 'Student', name: 'Student', price: '14,49 zł', period: '/ mies.', features: ['!Bez godzin audiobooków'] },
      ], footer: [{ at: 'umowy', label: 'Bez umowy', icon: 'lock' }, { at: 'umowy', label: 'Ceny: stan na październik 2026', icon: 'calendar' }] },
      { id: 'A04', kind: 'rec', bump: 'Jak liczone są godziny', kicker: 'Pomoc Spotify', title: 'Godzina to godzina', rec: { clip: 'pomoc_godziny', start: 4.0, url: 'support.spotify.com/pl' },
        marks: [{ at: 'normalnej', until: 'audiobook', x: 528, y: 426, w: 476, h: 84 }, { at: 'audiobook', until: 'ponowne', x: 528, y: 616, w: 476, h: 144 }, { at: 'ponowne', x: 548, y: 506, w: 456, h: 104 }],
        tags: [{ at: 'normalnej', label: 'Liczy się normalna prędkość', icon: 'speed' }, { at: 'szybciej', label: '2× szybciej = tyle samo godzin', icon: 'clock' }, { at: 'ponowne', label: 'Ponowne słuchanie też', icon: 'sync' }, { at: 'przepadaja', label: 'Niewykorzystane przepadają', tone: 'bad' }] },
      { id: 'A05', kind: 'rec', kicker: 'Więcej godzin', title: 'Audiobooki+', rec: { clip: 'plus', start: 0.6, holdAt: 6.7, url: 'spotify.com/pl/audiobooks' },
        marks: [{ at: 'Plus', until: 'pierwszym', x: 896, y: 224, w: 588, h: 114 }, { at: 'pierwszym', until: 'doladowania', x: 896, y: 790, w: 588, h: 116 }],
        tags: [{ at: 'dziesieciu', label: 'Przeciętny audiobook ≈ 10 h', icon: 'book' }, { at: 'Plus', label: 'Audiobooki+: 15 h / mies.', icon: 'clock' }, { at: 'siedemnascie', label: '17,99 zł miesięcznie', icon: 'coin' }, { at: 'pierwszym', label: '1. miesiąc za 0 zł', sub: 'tylko jeśli nie miałeś Audiobooki+', icon: 'gift' }, { at: 'doladowania', label: 'Doładowania ważne przez rok', icon: 'calendar' }] },
      { id: 'A06', kind: 'features', bump: 'Jak to działa', kicker: 'W aplikacji', title: 'Gdzie są audiobooki?', items: [
        { at: 'Wyszukaj', label: 'Zakładka „Wyszukaj”', icon: 'search' }, { at: 'Dostepny', label: '„Dostępny w Premium”', sub: 'tytuły z abonamentu', icon: 'check' },
        { at: 'trwania', label: 'Czas trwania i ocena', icon: 'clock' }, { at: 'fragment', label: 'Darmowy fragment', sub: 'każdego audiobooka', icon: 'play' },
      ] },
      { id: 'A07', kind: 'rec', kicker: 'Poza abonamentem', title: 'Zakup osobno', rec: { clip: 'pomoc_odblokuj', start: 3.2, url: 'support.spotify.com/pl' },
        marks: [{ at: 'osobno', until: 'przegladarce', x: 524, y: 284, w: 496, h: 72 }, { at: 'przegladarce', until: 'polskich', x: 524, y: 642, w: 496, h: 166 }],
        zooms: [{ at: 'przegladarce', zoom: 1.4, x: 770, y: 640 }, { at: 'polskich', zoom: 1, x: 960, y: 540 }],
        tags: [{ at: 'osobno', label: 'Kupisz pojedynczy tytuł', icon: 'coin' }, { at: 'przegladarce', label: 'Tylko w przeglądarce', icon: 'globe' }, { at: 'zjada', label: 'Nie zużywa godzin', tone: 'good' }, { at: 'Harda', label: 'Spotify wymienia na start', sub: '„Harda” i „Prawda zapisana w popiołach”', icon: 'book' }] },
      { id: 'A08', kind: 'features', kicker: 'Odtwarzacz', title: 'Co potrafi?', cols: 3, items: [
        { at: 'predkosc', label: 'Prędkość', icon: 'speed' }, { at: '15', label: '15 sekund', sub: 'w przód i w tył', icon: 'sync' },
        { at: 'wylacznik', label: 'Wyłącznik czasowy', icon: 'moon' }, { at: 'offline', label: 'Słuchanie offline', icon: 'download' },
        { at: 'Dopasowanie', label: 'Dopasowanie strony', sub: 'zeskanuj stronę książki', icon: 'book' },
      ] },
      { id: 'A09', kind: 'devices', items: [
        { at: 'telefonie', label: 'Telefon', icon: 'phone', ok: true }, { at: 'tablecie', label: 'Tablet', icon: 'tablet', ok: true },
        { at: 'komputerze', label: 'Komputer', icon: 'laptop', ok: true }, { at: 'przegladarce', label: 'Przeglądarka', icon: 'globe', ok: true },
        { at: 'zegarku', label: 'Apple Watch', icon: 'watch', ok: true }, { at: 'aucie', label: 'CarPlay i Android Auto', icon: 'car', ok: true },
      ] },
      { id: 'A10', kind: 'ratings', bump: 'Opinie', stores: [{ at: 'Storze', store: 'apple', rating: 4.8, count: '1,5 mln ocen' }, { at: 'Plej', store: 'google', rating: 4.3, count: '36,5 mln opinii' }],
        likes: [], dislikes: [], notes: [{ at: 'calej', label: 'To oceny całej aplikacji', sub: 'razem z muzyką · stan na 19.10.2026', icon: 'music' }, { at: 'samych', label: 'O audiobookach: prawie brak opinii', sub: 'w Polsce dopiero od 15.10', icon: 'calendar' }] },
      { id: 'A11', kind: 'proscons', bump: 'Plusy i minusy', title: 'Audiobooki w Spotify', pros: [
        { at: 'cenie', label: 'Godziny w cenie Premium' }, { at: 'polskich', label: '20 000+ tytułów po polsku' }, { at: 'aplikacja', label: 'Jedna aplikacja, też na komputerze' },
      ], cons: [
        { at: 'tylko', label: 'Tylko 12 h, które przepadają' }, { at: ['Duo', 0], label: 'Duo i Family: tylko właściciel' }, { at: 'Student', label: 'Student bez godzin' }, { at: 'dokupowanie', label: 'Dokupowanie kosztuje' },
      ] },
      { id: 'A12', kind: 'verdict', bump: 'Werdykt', question: 'Audiobooki w Spotify:\nczy warto?', yes: [
        { at: 'bonus', label: 'Masz już Premium Individual', sub: 'to bonus na ok. 1 książkę w miesiącu' },
      ], no: [
        { at: 'duzo', label: 'Słuchasz dużo', sub: 'Premium + Audiobooki+ = 44,98 zł za 27 h' },
      ], alts: { at: 'Audioteka', names: ['Audioteka Klub · 29,90 zł bez limitu godzin (w katalogu Klubu)'], label: 'Dla porównania (stan na 10.2026):' } },
      { id: 'B01', kind: 'steps', bump: 'Jak zacząć', kicker: 'Masz Premium?', title: 'Nic nie musisz robić', rec: { clip: 'dostep', start: 0.4 }, steps: [
        { at: 'Wyszukaj', title: 'Wejdź w „Wyszukaj”' }, { at: 'Audiobooki', title: 'Wybierz „Audiobooki”' },
      ] },
      { id: 'B02', kind: 'stat', kicker: 'Nie masz Premium?', at: 'zero', value: '0 zł', label: 'za pierwszy miesiąc Premium Individual (jeśli nie miałeś Premium, także w Family ani Duo)', tags: [
        { at: 'Potem', label: 'Potem 26,99 zł / mies.', icon: 'calendar' }, { at: 'wprost', label: '12 h w okresie próbnym? Spotify tego nie precyzuje', tone: 'bad' },
      ] },
      { id: 'B03', kind: 'steps', kicker: 'Ile godzin zostało?', title: 'Sprawdź w aplikacji', rec: { clip: 'pomoc_doladowania', start: 2.8, url: 'support.spotify.com/pl' }, steps: [
        { at: 'zdjecia', title: 'Zdjęcie profilowe' }, { at: 'ustawienia', title: 'Ustawienia' }, { at: 'Konto', title: 'Konto › Twój plan' },
        { at: 'Czas', title: 'Czas słuchania audiobooków', sub: 'tu kupisz też doładowanie' },
      ],
        marks: [{ at: 'zdjecia', until: 'ustawienia', x: 538, y: 500, w: 336, h: 34 }, { at: 'ustawienia', until: 'Konto', x: 538, y: 525, w: 440, h: 32 },
          { at: 'Konto', until: 'Czas', x: 538, y: 549, w: 456, h: 50 }, { at: 'Czas', x: 538, y: 591, w: 330, h: 32 }],
        zooms: [{ at: 'zdjecia', zoom: 1.7, x: 760, y: 560 }] },
      { id: 'B04', kind: 'steps', kicker: 'Rezygnacja', title: 'Jak zrezygnować', rec: { clip: 'pomoc_anuluj', start: 0.4, url: 'support.spotify.com/pl' }, steps: [
        { at: 'Zarzadzaj', title: 'Zarządzaj swoim planem' }, { at: 'Anuluj', title: 'Anuluj subskrypcję' },
        { at: 'okresie', title: 'W okresie próbnym: od razu wersja darmowa', sub: 'anuluj pod koniec próby, przed płatnością' },
        { at: 'Plus', title: 'Audiobooki+ wyłączasz osobno' },
      ] },
      { id: 'B06', kind: 'outro', rec: { clip: '@common/sb_search', start: 0.2, url: 'sonorbooks.pl' }, cta: 'Porównaj, gdzie\nposłuchasz taniej:\nsonorbooks.pl', ctaAt: 'sonorbooks', signAt: 'Twoja',
        tags: [{ at: 'Audiotece', label: 'Audioteka · Empik Go · Legimi · Audible', icon: 'search' }] },
    ],
    chapters: [
      { label: 'Co dostajesz w Premium', from: 'A02' },
      { label: 'Cennik: Individual, Duo, Family i Student', from: 'A03' },
      { label: 'Jak liczone są godziny', from: 'A04' },
      { label: 'Audiobooki+ i doładowania', from: 'A05' },
      { label: 'Jak znaleźć audiobooki w aplikacji', from: 'A06' },
      { label: 'Zakup pojedynczych tytułów', from: 'A07' },
      { label: 'Funkcje odtwarzacza i urządzenia', from: 'A08' },
      { label: 'Opinie', from: 'A10' },
      { label: 'Plusy i minusy', from: 'A11' },
      { label: 'Werdykt: czy warto?', from: 'A12' },
      { label: 'Jak zacząć', from: 'B01' },
      { label: 'Ile godzin ci zostało', from: 'B03' },
      { label: 'Jak zrezygnować', from: 'B04' },
    ],
  },
  thumb: { line1: 'AUDIOBOOKI', line2: 'W SPOTIFY?', seal: { icon: 'clock', text: '12 godzin\nw Premium' }, label: { strong: 'Czy warto', rest: 'w 2026?' } },
};
