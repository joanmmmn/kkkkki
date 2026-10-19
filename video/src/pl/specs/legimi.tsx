// Legimi (Polska): ebooki + audiobooki w jednym abonamencie. Sustituye a la reseña española de Nextory.
// Investigación y guion: research/pl/legimi/ (datos comprobados el 19.10.2026). La ayuda de Legimi (support.legimi.com) no se puede grabar:
// la baja (B05) va con la animación de pasos, sin toma. Los «cues» son palabras de la locución tal como quedan en vo/<ID>.json.
import type { PLPiece } from './index';

export const piece: PLPiece = {
  spec: {
    slug: 'legimi', name: 'Legimi', domain: 'legimi.pl', color: '#0CB079', deep: '#08805A', soft: '#E3F6EF',
    logo: 'pl/legimi/img/logo.svg', logoWhite: 'pl/legimi/img/logo_white.svg', logoRatio: 126.692 / 343.701,
    tileBg: 'linear-gradient(135deg, #1E598D 0%, #157182 55%, #008483 100%)', tileLogoWhite: true,
    kicker: 'Recenzja Legimi', music: 'pl/legimi/music/bed.mp3',
    scenes: [
      { id: 'A01', kind: 'hook', title: 'Czy warto\npłacić za\nLegimi?', hi: ['Legimi'], rec: { clip: 'cennik', start: 0.4 }, promises: [{ at: 'cennik', label: 'Cennik', icon: 'coin' }, { at: 'regulamin', label: 'Regulamin', icon: 'doc' }, { at: 'opinie', label: 'Opinie', icon: 'star' }, { at: 'wyprobowac', label: '3 dni za darmo', icon: 'gift' }] },
      { id: 'A02', kind: 'intro', bump: 'Co dostajesz?', kicker: 'Czym jest Legimi', rec: { clip: 'jak', start: 0.4, url: 'legimi.pl/jak-to-dziala' }, facts: [
        { at: 'poznania', label: 'Polska firma z Poznania', icon: 'globe' }, { at: 'dziesieciu', label: 'Abonament od ponad 10 lat', icon: 'calendar' },
        { at: 'synchrobuki', label: 'Synchrobooki', sub: 'ebook + audiobook pod jedną okładką', icon: 'sync' },
        { at: 'tramwaju', label: 'Czytasz, potem słuchasz dalej', sub: 'od tego samego miejsca', icon: 'headphones' },
      ], big: { at: 'dwustu', value: 240000, prefix: '~', label: 'tytułów w pakiecie bez limitu' } },
      { id: 'A03', kind: 'plans', bump: 'Cennik', kicker: 'Cennik · październik 2026', title: 'Ile kosztuje Legimi?', plans: [
        { at: 'piecdziesiat', name: 'Bez limitu', price: '54,99 zł', period: '/ mies.', note: 'bez umowy', features: ['Ebooki + audiobooki', '~240 000 tytułów', 'Do 4 urządzeń'], best: true, badge: 'Najczęściej wybierany' },
        { at: 'czterdziesci', name: 'Bez limitu + umowa', price: '49,99 zł', period: '/ mies.', note: 'umowa na 12 mies. (promocja)', features: ['To samo, 5 zł taniej', 'Po roku: 54,99 zł'] },
        { at: 'czternastu', name: 'Z limitem', price: '14,99 zł', period: '/ mies.', note: '300 stron lub 8 h', features: ['1000 stron / 26 h: 19,99 zł', '2000 stron / 53 h: 34,99 zł', 'Niewykorzystane przechodzą dalej'] },
      ], footer: [{ at: 'umowy', label: 'Premium ze SkyShowtime: 69,99 zł (bez okresu próbnego)', icon: 'tv' }] },
      { id: 'A04', kind: 'rec', bump: 'Katalog', kicker: 'legimi.pl', title: 'Katalog bez logowania', rec: { clip: 'home', start: 0 },
        cuts: [{ at: 'przy', rec: { clip: 'harda', start: 0.4 } }],
        marks: [{ at: 'abonamencie', x: 684, y: 160, w: 186, h: 58 }],
        tags: [{ at: 'logowania', label: 'Bez logowania', icon: 'lock' }, { at: 'bestsellery', label: 'Bestsellery, nowości, kategorie', icon: 'list' }, { at: 'abonamencie', label: '„audiobook w abonamencie”', icon: 'headphones' }] },
      { id: 'A05', kind: 'rec', kicker: 'Karta audiobooka', title: '„Harda”', rec: { clip: 'harda', start: 3.3 },
        marks: [{ at: 'filip', until: 'dwadziescia', x: 384, y: 646, w: 192, h: 30 }, { at: 'dwadziescia', until: 'srednia', x: 384, y: 608, w: 200, h: 30 },
          { at: 'srednia', until: 'obok', x: 384, y: 690, w: 270, h: 34 }, { at: 'liczbe', x: 500, y: 608, w: 84, h: 30 }],
        tags: [{ at: 'filip', label: 'Lektor: Filip Kosior', icon: 'mic' }, { at: 'dwadziescia', label: '21 godz. 53 min', icon: 'clock' }, { at: 'srednia', label: '4,7 / 5 · 557 ocen', icon: 'star' }, { at: 'liczbe', label: '822 strony', sub: 'ważne w pakietach z limitem', icon: 'book' }] },
      { id: 'A06', kind: 'features', bump: 'Jak to działa', kicker: 'W aplikacji', title: 'Co potrafi aplikacja?', cols: 3, items: [
        { at: 'przelaczasz', label: 'Ebook i audiobook', sub: 'przełączasz się w synchrobookach', icon: 'sync' }, { at: 'internetu', label: 'Także offline', icon: 'wifiOff' },
        { at: 'predkosc', label: 'Prędkość', icon: 'speed' }, { at: 'wylacznik', label: 'Wyłącznik czasowy', sub: 'także na koniec rozdziału', icon: 'moon' },
        { at: 'wgrac', label: 'Własne pliki EPUB', sub: 'do 4 miesięcznie (bez limitu)', icon: 'doc' },
      ] },
      { id: 'A07', kind: 'rec', kicker: 'Tylko w Legimi', title: 'Własne produkcje', rec: { clip: 'zastrzyk', start: 1.6 },
        cuts: [{ at: 'ale', rec: { clip: 'szczegoly', start: 0.4, url: 'legimi.pl/cennik' } }],
        marks: [{ at: 'katarzyna', until: 'ale', x: 384, y: 310, w: 186, h: 30 }, { at: 'punktow', x: 432, y: 278, w: 270, h: 48 }],
        tags: [{ at: 'zastrzyk', label: '„Zastrzyk miłości” · audioserial', icon: 'headphones' }, { at: 'tylko', label: 'Tylko w Legimi', tone: 'good' },
          { at: 'doplata', label: 'Katalog Klubowy: za dopłatą', tone: 'bad' }, { at: 'punktow', label: '150 pkt / mies. = 15 zł', icon: 'coin' },
          { at: 'obnizysz', label: 'Klubowy+: 0 zł za punkty', sub: 'maks. 2 tytuły / mies.', icon: 'gift' }] },
      { id: 'A08', kind: 'rec', kicker: 'Pakiety z limitem', title: 'Wspólna pula stron', rec: { clip: 'limit', start: 0.4, url: 'legimi.pl/cennik' },
        marks: [{ at: 'czytanie', until: 'niewykorzystany', x: 434, y: 434, w: 272, h: 32 }, { at: 'niewykorzystany', x: 434, y: 516, w: 282, h: 52 }],
        tags: [{ at: 'wspolna', label: 'Czytanie + słuchanie = jedna pula', icon: 'book' }, { at: 'godzina', label: '1 h audiobooka ≈ 37,6 strony', icon: 'clock' },
          { at: 'normalnej', label: 'Liczy się prędkość 1×', icon: 'speed' }, { at: 'niewykorzystany', label: 'Reszta przechodzi na kolejny miesiąc', tone: 'good' },
          { at: 'przekroczysz', label: 'Przekroczenie = kolejna opłata', tone: 'bad' }] },
      { id: 'A09', kind: 'devices', title: 'Gdzie czytasz i słuchasz?', items: [
        { at: 'smartfonie', label: 'Smartfon', sub: 'Android, iOS', icon: 'phone', ok: true }, { at: 'tablecie', label: 'Tablet', icon: 'tablet', ok: true },
        { at: 'komputerze', label: 'Komputer z Windows', sub: 'tylko ebooki', icon: 'laptop', ok: true }, { at: 'czytniku', label: 'Czytnik', sub: 'PocketBook, inkBOOK…', icon: 'ereader', ok: true },
        { at: 'kindlu', label: 'Kindle', sub: 'do 10 ebooków / mies.', icon: 'ereader', ok: true }, { at: 'audiobukow', label: 'Audiobooki na komputerze', icon: 'headphones', ok: false },
      ] },
      { id: 'A10', kind: 'ratings', bump: 'Opinie', stores: [{ at: 'gugl', store: 'google', rating: 4.5, count: '49,9 tys. ocen' }, { at: 'ep', store: 'apple', rating: 4.5, count: '16,5 tys. ocen (Polska)' }],
        likes: [{ at: 'wybor', label: 'Ogromny wybór' }, { at: 'cene', label: 'Cena' }], dislikes: [{ at: 'bledy', label: 'Błędy aplikacji' }, { at: 'doplaty', label: 'Dopłaty do części tytułów' }] },
      { id: 'A11', kind: 'proscons', bump: 'Plusy i minusy', title: 'Legimi', pros: [
        { at: 'ebooki', label: 'Ebooki i audiobooki w jednym' }, { at: 'synchrobooki', label: 'Synchrobooki' }, { at: 'urzadzenia', label: '4 urządzenia, także czytnik' }, { at: 'tansze', label: 'Tańsze pakiety z limitem' },
      ], cons: [
        { at: 'placisz', label: 'Bez umowy drożej niż Audioteka Klub i Empik Go' }, { at: 'czesc', label: 'Część tytułów za dopłatą' }, { at: 'posluchasz', label: 'Audiobooki tylko w telefonie i tablecie' }, { at: 'komputerze', label: 'Okres próbny: tylko 3 dni' },
      ] },
      { id: 'A12', kind: 'verdict', bump: 'Werdykt', question: 'Legimi:\nczy warto?', yes: [
        { at: 'zmiane', label: 'Na zmianę czytasz i słuchasz' }, { at: 'czytnik', label: 'Masz czytnik', sub: 'także Kindle (tylko ebooki)' },
      ], no: [
        { at: 'tylko', label: 'Tylko słuchasz', sub: 'Audioteka Klub: 29,90 zł bez limitu godzin' }, { at: 'malo', label: 'Słuchasz mało', sub: 'wybierz pakiet z limitem od 14,99 zł' },
      ] },
      { id: 'B01', kind: 'stat', bump: 'Jak wypróbować', kicker: 'Okres próbny', at: 'dni', value: '3', unit: 'dni', count: { from: 0, to: 3 }, label: 'za darmo – tylko raz', tags: [
        { at: 'konto', label: 'Raz na konto', icon: 'user' }, { at: 'urzadzenie', label: 'Raz na urządzenie', icon: 'phone' }, { at: 'karte', label: 'Raz na kartę', icon: 'card' },
      ] },
      { id: 'B02', kind: 'steps', kicker: 'Krok 1', title: 'Konto i karta', rec: { clip: 'mobile', start: 0.4, mobile: true }, marks: [{ at: 'kliknij', until: 'zaloz', x: 30, y: 511, w: 370, h: 52 }], steps: [
        { at: 'wejdz', title: 'Wejdź na legimi.pl/cennik' }, { at: 'wybierz', title: 'Wybierz pakiet' }, { at: 'kliknij', title: '„Wypróbuj przez 3 dni za darmo”' },
        { at: 'zaloz', title: 'Załóż konto' }, { at: 'podepnij', title: 'Karta lub PayPal', sub: 'płatność cykliczna; Legimi tylko autoryzuje kartę' },
      ], note: { at: 'dzis', label: 'Dziś płacisz 0 zł', icon: 'coin' } },
      { id: 'B03', kind: 'rec', kicker: 'Krok 2', title: 'Aplikacja', rec: { clip: 'jak', start: 6.6, url: 'legimi.pl/jak-to-dziala' },
        marks: [{ at: 'pobierz', until: 'dodaj', x: 684, y: 270, w: 268, h: 120 }, { at: 'dodaj', x: 969, y: 270, w: 268, h: 120 }],
        tags: [{ at: 'pobierz', label: 'Pobierz aplikację', icon: 'download' }, { at: 'zaloguj', label: 'Zaloguj się', icon: 'user' }, { at: 'dodaj', label: '„Dodaj na półkę”', icon: 'bookmark' }] },
      { id: 'B04', kind: 'rec', kicker: 'Uwaga', title: 'Umowa czy bez umowy?', rec: { clip: 'cennik', start: 3.6, holdAt: 7.8 },
        cuts: [{ at: 'bez', rec: { clip: 'cennik', start: 8.2 } }],
        marks: [{ at: 'miesiecy', until: 'bez', x: 722, y: 290, w: 216, h: 66 }, { at: 'bez', x: 937, y: 290, w: 262, h: 66 }],
        tags: [{ at: 'miesiecy', label: 'Umowa na 12 mies.: 49,99 zł', icon: 'calendar' }, { at: 'zwrot', label: 'Wcześniej rezygnujesz? Zwracasz rabat', tone: 'bad' },
          { at: 'bez', label: 'Bez umowy: 54,99 zł', sub: 'rezygnujesz, kiedy chcesz', tone: 'good' }] },
      { id: 'B05', kind: 'steps', bump: 'Jak zrezygnować', kicker: 'Rezygnacja', title: 'Jak zrezygnować', steps: [
        { at: 'konto', title: 'legimi.pl → Konto' }, { at: 'subskrypcja', title: 'Subskrypcja' }, { at: 'zakoncz', title: 'Przycisk „Zakończ”', sub: 'na Androidzie także w aplikacji' },
        { at: 'epl', title: 'Płacisz przez Apple? Ustawienia Apple ID' }, { at: 'trzeciego', title: 'Zrób to przed końcem 3. dnia' },
      ], note: { at: 'rezygnacja', label: 'W okresie próbnym dostęp kończy się od razu', icon: 'clock' } },
      { id: 'B06', kind: 'outro', rec: { clip: '@common/sb_home_cards', start: 0.2, url: 'sonorbooks.pl' }, cta: 'Porównaj ceny\ni okresy próbne:\nsonorbooks.pl', ctaAt: 'sonorbooks', signAt: 'twoja',
        tags: [{ at: 'legimi', label: 'Legimi · Audioteka · Empik Go · …', icon: 'search' }] },
    ],
    chapters: [
      { label: 'Czym jest Legimi', from: 'A02' },
      { label: 'Cennik: bez limitu i z limitem', from: 'A03' },
      { label: 'Katalog i karta audiobooka', from: 'A04' },
      { label: 'Aplikacja i synchrobooki', from: 'A06' },
      { label: 'Własne produkcje i dopłaty', from: 'A07' },
      { label: 'Jak działają pakiety z limitem', from: 'A08' },
      { label: 'Urządzenia', from: 'A09' },
      { label: 'Opinie', from: 'A10' },
      { label: 'Plusy i minusy', from: 'A11' },
      { label: 'Werdykt: czy warto?', from: 'A12' },
      { label: 'Jak wypróbować 3 dni za darmo', from: 'B01' },
      { label: 'Uwaga na umowę na 12 miesięcy', from: 'B04' },
      { label: 'Jak zrezygnować', from: 'B05' },
    ],
  },
  thumb: { line1: 'LEGIMI:', line2: 'CZY WARTO?', seal: { icon: 'sync', text: 'ebook +\naudiobook' }, label: { strong: '3 dni', rest: 'ZA DARMO' } },
};
