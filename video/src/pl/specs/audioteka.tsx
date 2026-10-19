// Audioteka i Audioteka Klub (Polska; sustituye a la reseña española de Podimo). Investigación y guion: research/pl/audioteka/.
// Los «cues» son palabras de la locución tal como se dice (`say` de vo.json): «audiobuków», «Gugl», «Ep», «Kar», «Kromkast», «Epl»…
// La promoción del Plan na Start (10,90 zł hasta el 26.10.2026) no sale en pantalla: las tomas del Klub se graban con la pestaña
// «12 miesięcy» o encuadran solo el Plan Optymalny.
import type { PLPiece } from './index';

export const piece: PLPiece = {
  spec: {
    slug: 'audioteka', name: 'Audioteka', domain: 'audioteka.com/pl', color: '#33ADFF', deep: '#0B6BB0', soft: '#E3F3FF',
    logo: 'pl/audioteka/img/logo.svg', logoWhite: 'pl/audioteka/img/logo_white.svg', logoRatio: 27.92 / 119.919, tileBg: '#160829', tileLogoWhite: true,
    kicker: 'Recenzja Audioteki', music: 'pl/audioteka/music/bed.mp3',
    scenes: [
      { id: 'A01', kind: 'hook', title: 'Audioteka:\nczy warto\npłacić?', hi: ['Audioteka:'], badge: 'Recenzja · 2026', rec: { clip: 'superprod', start: 0.4, url: 'audioteka.com/pl/katalog' }, promises: [
        { at: 'cennik', label: 'Cennik', icon: 'coin' }, { at: 'regulamin', label: 'Regulamin', icon: 'doc' }, { at: 'opinie', label: 'Opinie', icon: 'star' },
        { at: '14', label: '14 dni za darmo', icon: 'gift', tone: 'good' },
      ] },
      { id: 'A02', kind: 'intro', bump: 'Czym jest Audioteka', rec: { clip: 'klub_hero', start: 0.4, url: 'klub.audioteka.com' }, facts: [
        { at: 'pietnastu', label: 'Od ponad 15 lat', icon: 'calendar' }, { at: 'Wirtualnej', label: 'Grupa Wirtualna Polska', sub: '100% od 2023 roku', icon: 'chart' },
        { at: 'trzysta', label: '1300+ polskich głosów', icon: 'mic' }, { at: 'piecset', label: 'Do 500 nowości miesięcznie', icon: 'sparkle' },
      ], big: { at: 'piecdziesiat', value: 50000, suffix: '+', label: 'tytułów w Audioteka Klub' } },
      { id: 'A03', kind: 'plans', bump: 'Cennik', title: 'Ile kosztuje Klub?', plans: [
        { at: 'Optymalny', name: 'Plan Optymalny', price: '29,90 zł', period: '/ mies.', features: ['Bez limitu godzin', '14 dni za darmo dla nowych'], best: true, badge: 'Główny plan' },
        { at: 'rok', name: 'Optymalny na rok', price: '299,00 zł', period: '/ 12 mies.', note: 'płatność z góry', features: ['12 miesięcy w cenie 10', 'Na 6 mies.: 179,40 zł'] },
        { at: 'Smart', name: 'Plan Smart 20h', price: '17,90 zł', period: '/ mies.', features: ['20 godzin miesięcznie', '!Niewykorzystane przepadają'] },
      ], footer: [{ at: 'Start', label: 'Plan na Start: taniej przez pierwsze 3 miesiące', icon: 'calendar' }] },
      { id: 'A04', kind: 'rec', bump: 'Katalog i superprodukcje', kicker: 'audioteka.com', title: 'Katalog bez logowania', rec: { clip: 'katalog', start: 0.0, url: 'audioteka.com/pl/katalog' },
        marks: [{ at: 'Przelacz', x: 758, y: 468, w: 402, h: 48 }],
        tags: [{ at: 'logowania', label: 'Bez konta i logowania', icon: 'lock' }, { at: 'Wszystkie', label: '„Wszystkie”: cały sklep', icon: 'library' }, { at: 'Klub', label: '„Audioteka Klub”', sub: 'tylko tytuły z abonamentu', icon: 'check', tone: 'good' }] },
      { id: 'A05', kind: 'rec', side: 'right', kicker: 'Przykład', title: '„Solaris” Lema', rec: { clip: 'solaris', start: 0.4, url: 'audioteka.com/pl/audiobook/solaris' },
        marks: [{ at: 'Robertem', until: 'siedem', x: 634, y: 300, w: 632, h: 30 }, { at: 'siedem', until: 'srednia', x: 548, y: 336, w: 240, h: 26 }, { at: 'srednia', until: 'znaczek', x: 548, y: 246, w: 182, h: 36 }, { at: 'znaczek', x: 1388, y: 178, w: 272, h: 254 }],
        tags: [{ at: 'superprodukcja', label: 'Superprodukcja', icon: 'sparkle' }, { at: 'Robertem', label: 'Więckiewicz, Cielecka, Woronowicz', icon: 'mic' }, { at: 'siedem', label: '7 godz. 56 min', icon: 'clock' }, { at: 'srednia', label: 'Średnia ocen 4,8', icon: 'star' }, { at: 'znaczek', label: '„Dostępne w Klubie”', sub: 'czyli w abonamencie', icon: 'check', tone: 'good' }] },
      { id: 'A06', kind: 'intro', kicker: 'Największy atut', rec: { clip: 'superprod', start: 6.0, url: 'audioteka.com/pl/katalog' },
        cuts: [{ at: '700', rec: { clip: 'klub_korzysci', start: 2.6, url: 'klub.audioteka.com' } }, { at: 'Nowe', rec: { clip: 'klub_korzysci', start: 21.6, url: 'klub.audioteka.com' } }],
        facts: [{ at: 'muzyka', label: 'Muzyka, efekty, aktorzy', sub: 'jak w kinie', icon: 'music' }, { at: '700', label: 'Blisko 700 tytułów', sub: 'tylko w Audiotece', icon: 'lock' }, { at: 'tygodnie', label: 'Premiery w Klubie', sub: 'tygodnie przed sklepem', icon: 'calendar' }],
        big: { at: '200', value: 200, suffix: '+', label: 'superprodukcji i audioseriali' } },
      { id: 'A07', kind: 'rec', kicker: 'Poza abonamentem', title: 'Nie wszystko jest w Klubie', rec: { clip: 'klub_korzysci', start: 8.0, holdAt: 13.0, url: 'klub.audioteka.com' },
        marks: [{ at: 'Czesc', until: 'Klubowicze', x: 384, y: 418, w: 524, h: 66 }, { at: 'Klubowicze', until: 'kupione', x: 1312, y: 282, w: 246, h: 246, r: 123 }, { at: 'kupione', x: 384, y: 484, w: 480, h: 62 }],
        tags: [{ at: 'Czesc', label: 'Część tytułów trzeba kupić', sub: 'ze względów licencyjnych', icon: 'coin', tone: 'bad' }, { at: 'Klubowicze', label: 'Klubowicze płacą mniej', icon: 'card' }, { at: 'kupione', label: 'Kupione zostają na półce', sub: 'także po rezygnacji', icon: 'library', tone: 'good' }] },
      { id: 'A08', kind: 'features', bump: 'Aplikacja', kicker: 'W aplikacji', title: 'Co potrafi odtwarzacz?', items: [
        { at: 'predkosc', label: 'Prędkość', sub: 'na Androidzie do 3×', icon: 'speed' }, { at: 'drzemke', label: 'Drzemka', sub: 'wyłącznik czasowy', icon: 'moon' },
        { at: 'offline', label: 'Offline', sub: 'pobierasz audiobooki', icon: 'download' }, { at: 'dwoch', label: '2 urządzenia', sub: 'słuchasz na jednym naraz', icon: 'phone' },
      ] },
      { id: 'A08S', kind: 'rec', side: 'right', kicker: 'Plan Smart', title: 'Limit godzin', rec: { clip: 'pomoc', start: 18.4, url: 'audioteka.com/pl/centrum-pomocy' },
        marks: [{ at: 'normalnej', until: 'niewykorzystane', x: 516, y: 314, w: 1150, h: 44 }, { at: 'niewykorzystane', x: 516, y: 436, w: 420, h: 26 }],
        tags: [{ at: 'normalnej', label: 'Liczy się prędkość 1×', icon: 'speed' }, { at: 'niewykorzystane', label: 'Niewykorzystane przepadają', tone: 'bad' }] },
      { id: 'A08B', kind: 'rec', kicker: 'Dla dzieci', title: 'Audioteka Kids', rec: { clip: 'kids', start: 2.0, url: 'klub.audioteka.com/audioteka-kids' },
        tags: [{ at: 'osobna', label: 'Osobna aplikacja', icon: 'kid' }, { at: 'cenie', label: 'W cenie Klubu', icon: 'check', tone: 'good' }, { at: 'jednym', label: '1 konto dziecka, 1 urządzenie', icon: 'phone' }, { at: 'Smart', label: 'W Planie Smart zużywa godziny', icon: 'clock', tone: 'bad' }] },
      { id: 'A09', kind: 'devices', items: [
        { at: 'Androida', label: 'Android', icon: 'phone', ok: true }, { at: 'aj', label: 'iPhone i iPad', icon: 'tablet', ok: true },
        { at: 'przegladarce', label: 'Przeglądarka', sub: 'Klub nie działa', icon: 'globe', ok: false },
        { at: 'aucie', label: 'Android Auto', icon: 'car', ok: true }, { at: 'Kar', label: 'CarPlay', icon: 'car', ok: true },
        { at: 'Kromkast', label: 'Chromecast', icon: 'cast', ok: true }, { at: 'Epl', label: 'Apple Watch', icon: 'watch', ok: true },
      ] },
      { id: 'A10', kind: 'ratings', bump: 'Opinie', stores: [{ at: 'Gugl', store: 'google', rating: 4.8, count: '67,6 tys. ocen · 19.10.2026' }, { at: 'Ep', store: 'apple', rating: 4.7, count: '41,9 tys. ocen · 19.10.2026' }],
        likes: [{ at: 'lektorow', label: 'Lektorzy i głosy' }, { at: 'produkcje', label: 'Superprodukcje' }],
        dislikes: [{ at: 'doplaty', label: 'Dopłaty do wielu tytułów' }, { at: 'bledy', label: 'Błędy aplikacji', sub: 'np. CarPlay, Bluetooth' }] },
      { id: 'A11', kind: 'proscons', bump: 'Plusy i minusy', title: 'Audioteka Klub', pros: [
        { at: 'limitu', label: 'Bez limitu godzin za 29,90 zł' }, { at: 'superprodukcje', label: 'Superprodukcje i wyłączności' }, { at: '14', label: '14 dni na próbę' }, { at: 'tanszy', label: 'Tańszy Plan Smart: 17,90 zł' },
      ], cons: [
        { at: 'tylko', label: 'Tylko audio, bez ebooków' }, { at: 'czesc', label: 'Część tytułów za dopłatą' }, { at: ['tylko', 1], label: 'Klub tylko w aplikacji' }, { at: 'jednym', label: 'Jedno urządzenie naraz' },
      ] },
      { id: 'A12', kind: 'verdict', bump: 'Werdykt', question: 'Audioteka Klub:\nczy warto?', yes: [
        { at: 'duzo', label: 'Słuchasz dużo i po polsku', sub: 'Plan Optymalny: 29,90 zł bez limitu' }, { at: 'mniej', label: 'Słuchasz mniej', sub: 'Plan Smart: 17,90 zł za 20 godzin' },
      ], no: [
        { at: 'czytac', label: 'Chcesz też czytać ebooki', sub: 'Audioteka to tylko audio' },
      ], alts: { at: 'Legimi', names: ['Legimi', 'Empik Go'], label: 'Porównaj z:' } },
      { id: 'B01', kind: 'rec', bump: '14 dni za darmo', rec: { clip: 'klub_mobile', start: 0.3, mobile: true, url: 'klub.audioteka.com' },
        marks: [{ at: 'Nowi', until: 'miesiecznym', x: 64, y: 746, w: 292, h: 32 }, { at: 'miesiecznym', x: 55, y: 535, w: 320, h: 360, r: 18 }],
        tags: [{ at: 'Nowi', label: 'Tylko dla nowych', icon: 'user' }, { at: 'darmo', label: '14 dni za darmo', icon: 'gift', tone: 'good' }, { at: 'miesiecznym', label: 'Tylko miesięczny Plan Optymalny', icon: 'calendar' }] },
      { id: 'B02', kind: 'steps', kicker: 'Krok po kroku', title: 'Jak aktywować', rec: { clip: 'klub_mobile', start: 3.0, mobile: true, url: 'klub.audioteka.com' },
        marks: [{ at: 'Wyprobuj', until: 'zaloz', x: 70, y: 805, w: 290, h: 62, r: 31 }], steps: [
        { at: 'klub', title: 'Wejdź na klub.audioteka.com' }, { at: 'Wyprobuj', title: '„Wypróbuj 14 dni za darmo”', sub: 'przy płatności miesięcznej' },
        { at: 'zaloz', title: 'Załóż konto' }, { at: 'metode', title: 'Podaj metodę płatności' },
      ], note: { at: 'nic', label: 'Przez 14 dni: 0 zł', icon: 'gift' } },
      { id: 'B03', kind: 'features', kicker: 'Potem', title: 'W aplikacji Audioteka', cols: 3, items: [
        { at: 'Pobierz', label: 'Pobierz aplikację', icon: 'download' }, { at: 'zaloguj', label: 'Zaloguj się', icon: 'user' },
        { at: 'Twoje', label: 'Zakładka „Twoje”', sub: '„Bezpłatne w Audioteka Klub”', icon: 'library' },
      ] },
      { id: 'B04', kind: 'stat', kicker: 'Po okresie próbnym', at: 'dwadziescia', value: '29,90 zł', label: 'miesięcznie od 15. dnia, jeśli nie zrezygnujesz', tags: [
        { at: 'odnowi', label: 'Subskrypcja odnawia się sama', icon: 'sync' },
      ] },
      { id: 'B05', kind: 'steps', bump: 'Jak zrezygnować', kicker: 'Rezygnacja', title: 'Na audioteka.com', rec: { clip: 'pomoc', start: 2.0, holdAt: 15.3, url: 'audioteka.com/pl/centrum-pomocy' },
        marks: [{ at: 'Ustawienia', until: 'Zarzadzaj', x: 1388, y: 262, w: 158, h: 26 }, { at: 'Zarzadzaj', until: 'Anuluj', x: 696, y: 281, w: 202, h: 24 }, { at: 'Anuluj', until: 'Jesli', x: 1226, y: 281, w: 168, h: 24 }, { at: 'Gugl', until: 'Samo', x: 516, y: 420, w: 590, h: 248 }, { at: 'Samo', x: 516, y: 674, w: 968, h: 24 }], steps: [
        { at: 'Ustawienia', title: 'Ustawienia konta' }, { at: 'Zarzadzaj', title: 'Zarządzaj Audioteka Klub' },
        { at: 'Anuluj', title: '„Anuluj subskrypcję”', sub: 'i „Rezygnuję z subskrypcji”' }, { at: 'Gugl', title: 'Google Play / App Store', sub: 'gdy subskrypcja jest z aplikacji · usunięcie aplikacji nie wystarczy' },
      ], note: { at: 'przed', label: 'Przed końcem 14. dnia', icon: 'calendar' } },
      { id: 'B06', kind: 'outro', rec: { clip: 'sb_solaris', start: 0.3, url: 'sonorbooks.pl' }, cta: 'Sprawdź, co jest\nw Klubie:\nsonorbooks.pl', ctaAt: 'sonorbooks', signAt: 'Twoja',
        tags: [{ at: 'porownasz', label: 'Audioteka · Legimi · Empik Go', icon: 'search' }] },
    ],
    chapters: [
      { label: 'Czym jest Audioteka', from: 'A02' },
      { label: 'Cennik: Plan Optymalny, Smart i na Start', from: 'A03' },
      { label: 'Katalog bez logowania', from: 'A04' },
      { label: 'Przykład: „Solaris”', from: 'A05' },
      { label: 'Superprodukcje i wyłączności', from: 'A06' },
      { label: 'Co jest za dopłatą', from: 'A07' },
      { label: 'Aplikacja i limit godzin', from: 'A08' },
      { label: 'Audioteka Kids', from: 'A08B' },
      { label: 'Urządzenia', from: 'A09' },
      { label: 'Opinie', from: 'A10' },
      { label: 'Plusy i minusy', from: 'A11' },
      { label: 'Werdykt: czy warto?', from: 'A12' },
      { label: 'Jak wypróbować 14 dni za darmo', from: 'B01' },
      { label: 'Co po okresie próbnym', from: 'B04' },
      { label: 'Jak zrezygnować', from: 'B05' },
    ],
  },
  thumb: { line1: 'CZY WARTO', line2: 'PŁACIĆ?', seal: { icon: 'infinity', text: '29,90 zł\nbez limitu' }, label: { strong: '14 dni', rest: 'ZA DARMO' } },
};
