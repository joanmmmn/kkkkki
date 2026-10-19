// Kody biblioteczne: Legimi, Empik Go i Audioteka Klub gratis con la tarjeta de la biblioteca (Polska). Sustituye a la guía española
// de eBiblio. Investigación y guion: research/pl/kody-biblioteczne/ (todo comprobado el 19.10.2026).
// No hay una marca única: el logotipo de la pieza (img/logo.svg) junta los tres logotipos oficiales (Legimi, Empik Go, Audioteka),
// sin tocarlos, uno debajo de otro; los originales están al lado (legimi.svg, empikgo.svg, audioteka.svg). Color: el grafito neutro
// de SonorBooks (color.night), para no confundirse con el verde de Legimi, el turquesa de Empik Go ni el azul de Audioteka.
// Las páginas de activación (empik.com/go/biblioteki/kod, legimi.pl/bmwl) se graban vacías; no se enseña ningún código.
// koszykowa.pl y bibliotekiwarszawy.pl no cargan desde el servidor: Varsovia sale con Bielany (solo en tarjetas) y Wesoła.
// Los «cues» son palabras de la locución tal como quedan en vo/<ID>.json: «Gou», «ajfonie», «Kar», «Gugl», «Ap», «Kindl»…
import type { PLPiece } from './index';

export const piece: PLPiece = {
  spec: {
    slug: 'kody-biblioteczne', name: 'Kody biblioteczne', domain: 'empik.com/biblioteki', color: '#3A3D42', deep: '#2A2C30', soft: '#ECEDEF',
    logo: 'pl/kody-biblioteczne/img/logo.svg', logoWhite: 'pl/kody-biblioteczne/img/logo_white.svg', logoRatio: 300.97 / 320,
    kicker: 'Kody z biblioteki', music: 'pl/kody-biblioteczne/music/bed.mp3',
    scenes: [
      { id: 'A01', kind: 'hook', title: 'Darmowe\naudiobooki\nz biblioteki', hi: ['Darmowe'], rec: { clip: '04_legimi_lodz', start: 1.5, url: 'legimi.pl/bmwl' }, promises: [
        { at: 'Legimi', label: 'Legimi · Empik Go · Audioteka', icon: 'headphones' }, { at: '0', label: 'Miesiąc za 0 zł', sub: 'z kartą, jeśli zdobędziesz kod', icon: 'gift' },
        { at: 'haczyk', label: 'Gdzie jest haczyk?', icon: 'search', tone: 'accent' }, { at: 'zdobyc', label: 'Jak zdobyć kod', icon: 'play' },
      ] },
      { id: 'A02', kind: 'steps', bump: 'Jak to działa?', kicker: 'Kod z biblioteki', title: 'Jak to działa?', rec: { clip: '01_empik_biblioteki', start: 11.2, url: 'empik.com/biblioteki' }, steps: [
        { at: 'kupuje', title: 'Biblioteka kupuje pulę kodów' }, { at: 'rozdaje', title: 'Rozdaje je czytelnikom', sub: 'za darmo' },
        { at: 'wpisujesz', title: 'Kod wpisujesz w serwisie' }, { at: '30', title: 'Zwykle 30 dni', sub: 'bez limitu tytułów' },
        { at: 'Placi', title: 'Płaci biblioteka', sub: 'Łódź: 500 000 zł z budżetu obywatelskiego', rec: { clip: '05_lodz_ebooki', start: 0.3, url: 'biblioteka.lodz.pl' } },
      ],
        marks: [{ at: 'rozdaje', until: 'wpisujesz', x: 376, y: 262, w: 260, h: 290 }, { at: 'wpisujesz', until: 'aplikacji', x: 826, y: 262, w: 300, h: 290 }, { at: 'aplikacji', until: 'Placi', x: 1316, y: 262, w: 260, h: 290 }],
        zooms: [{ at: 'kupuje', zoom: 1.3, x: 976, y: 420 }] },
      { id: 'A03', kind: 'stat', kicker: 'Cena', title: 'Ile to kosztuje?', at: 'Nic', value: '0 zł', label: 'za kartę biblioteczną i za kod', tags: [
        { at: 'ustawy', label: 'Ustawa o bibliotekach, art. 14', sub: '„ogólnie dostępne i bezpłatne”', icon: 'doc' },
        { at: 'podpiac', label: 'Empik Go: bez karty płatniczej', sub: 'przy aktywacji kodu', icon: 'card' }, { at: 'wygasa', label: 'Po 30 dniach wygasa sam', sub: 'Empik Go, FAQ dla bibliotek', icon: 'clock' },
      ] },
      { id: 'A04', kind: 'rec', bump: 'Trzy serwisy', kicker: 'Serwis 1 z 3', title: 'Legimi', rec: { clip: '07_wroclaw_legimi', start: 2.6, url: 'biblioteka.wroc.pl' },
        cuts: [{ at: 'Kod', rec: { clip: '04_legimi_lodz', start: 0.3, holdAt: 2.9, url: 'legimi.pl/bmwl' } }],
        marks: [{ at: 'przygotowanej', until: 'lodzkiej', x: 1070, y: 414, w: 464, h: 286 }, { at: 'lodzkiej', x: 1070, y: 230, w: 464, h: 136 }],
        tags: [
          { at: 'osiemdziesieciu', label: 'ok. 80 000 audiobooków', icon: 'headphones' }, { at: 'dwustu', label: 'ok. 243 000 e-booków', sub: 'dane MBP we Wrocławiu', icon: 'book' },
          { at: 'lodzkiej', label: 'legimi.pl/bmwl', sub: 'strona dla Łodzi', icon: 'link' }, { at: 'dwoch', label: '2 urządzenia', sub: 'według bibliotek', icon: 'phone' },
        ] },
      { id: 'A05', kind: 'rec', kicker: 'Serwis 2 z 3', title: 'Empik Go', rec: { clip: '02_empik_kod', start: 0.3, holdAt: 2.8, url: 'empik.com/go/biblioteki/kod' },
        cuts: [{ at: 'Dziala', rec: { clip: '02_empik_kod', start: 10.6, holdAt: 11.3, url: 'empik.com/go/biblioteki/kod' } }, { at: 'jednym', rec: { clip: '02_empik_kod', start: 5.2, holdAt: 6.8, url: 'empik.com/go/biblioteki/kod' } }],
        marks: [{ at: 'Osmioznakowy', until: ['empik', 1], x: 1046, y: 440, w: 410, h: 34 }, { at: ['empik', 1], until: 'Dziala', x: 1066, y: 246, w: 360, h: 70 },
          { at: 'najczesciej', until: 'jednym', x: 380, y: 128, w: 1166, h: 108 }, { at: 'jednym', x: 786, y: 372, w: 460, h: 36 }],
        zooms: [{ at: 'Osmioznakowy', zoom: 1.5, x: 1250, y: 380 }, { at: 'Dziala', zoom: 1.6, x: 960, y: 200 }, { at: 'jednym', zoom: 1.4, x: 960, y: 330 }],
        tags: [
          { at: 'audiobooki', label: 'Audiobooki i e-booki', sub: 'słuchowiska, podcasty', icon: 'headphones' }, { at: 'Osmioznakowy', label: 'Kod: 8 znaków', icon: 'lock' },
          { at: ['empik', 1], label: 'empik.com/biblioteki/kod', icon: 'link' }, { at: 'najczesciej', label: 'Najczęściej 30 dni', icon: 'calendar' },
          { at: 'jednym', label: '1 telefon + 1 czytnik', sub: 'plus Kindle', icon: 'phone' },
        ] },
      { id: 'A06', kind: 'features', kicker: 'Serwis 3 z 3', title: 'Audioteka Klub', items: [
        { at: 'audioseriale', label: 'Audiobooki i audioseriale', sub: 'oraz podcasty', icon: 'headphones' }, { at: 'Kids', label: 'Audioteka Kids', sub: 'aplikacja dla dzieci', icon: 'kid' },
        { at: 'promo', label: 'promo.audioteka.com', sub: 'po zalogowaniu: „Aktywuj dostęp”', icon: 'link' }, { at: 'trzydziesci', label: '30 dni', sub: 'maks. 2 urządzenia', icon: 'calendar' },
      ] },
      { id: 'A07', kind: 'rec', bump: 'Każda biblioteka inaczej', kicker: 'Stan na 19.10.2026', title: 'Łódź i Wrocław', rec: { clip: '05_lodz_ebooki', start: 4.0, url: 'biblioteka.lodz.pl' },
        cuts: [
          { at: 'pazdzierniku', rec: { clip: '06_lodz_mapa', start: 4.0, url: 'biblioteka.lodz.pl' } },
          { at: 'Wroclawiu', rec: { clip: '07_wroclaw_legimi', start: 0.3, url: 'biblioteka.wroc.pl' } },
          { at: 'kolejny', rec: { clip: '07_wroclaw_legimi', start: 8.0, url: 'biblioteka.wroc.pl' } },
        ],
        tags: [
          { at: 'Lodzi', label: 'Łódź: każda filia', sub: 'co miesiąc', icon: 'library' }, { at: '15', label: 'Od 15 lat · kod papierowy', icon: 'user' },
          { at: 'pazdzierniku', label: 'Październik: kodów brak', tone: 'bad' }, { at: 'Wroclawiu', label: 'Wrocław: tylko 3 filie', icon: 'library' },
          { at: '90', label: 'Kod na 90 dni', sub: 'kolejny po 3 miesiącach', icon: 'calendar' },
        ] },
      { id: 'A08', kind: 'rec', kicker: 'Stan na 19.10.2026', title: 'Gdańsk, Poznań, Warszawa', rec: { clip: '08_gdansk_legimi', start: 0.3, url: 'wbpg.org.pl' },
        cuts: [{ at: 'Poznaniu', rec: { clip: '09_poznan', start: 0.3, url: 'bracz.edu.pl' } }, { at: 'Warszawie', rec: { clip: '11_wesola', start: 0.3, url: 'bibliotekawesola.pl' } }],
        tags: [
          { at: 'Gdansku', label: 'Gdańsk: kod online', icon: 'globe' }, { at: 'wypozyczyles', label: 'Min. 1 wypożyczenie', sub: 'w tym roku', icon: 'book' },
          { at: 'Poznaniu', label: 'Poznań: tylko e-mail', icon: 'mail' }, { at: 'pierwszego', label: '1. dzień roboczy, od 9:00', icon: 'clock' },
          { at: 'Warszawie', label: 'Warszawa: każda dzielnica', sub: 'Bielany – formularz, Wesoła – Audioteka', icon: 'library' },
        ] },
      { id: 'A08B', kind: 'features', kicker: 'Prawie wszędzie', title: 'Trzy zasady', cols: 3, items: [
        { at: 'Jeden', label: '1 kod na miesiąc', sub: 'zwykle Legimi albo Empik Go', icon: 'user' },
        { at: 'aktywowac', label: 'Aktywuj do końca miesiąca', sub: 'inaczej możesz nie dostać kolejnego', icon: 'calendar' },
        { at: 'zaleglosci', label: 'Bez zaległości', sub: 'w bibliotece', icon: 'check' },
      ] },
      { id: 'A09', kind: 'devices', bump: 'Aplikacje', kicker: 'Aplikacje', title: 'Gdzie posłuchasz?', items: [
        { at: 'Androidzie', label: 'Android', icon: 'phone', ok: true }, { at: 'ajfonie', label: 'iPhone', icon: 'phone', ok: true },
        { at: 'offline', label: 'Offline', sub: 'Legimi i Empik Go', icon: 'download', ok: true },
        { at: 'Auto', label: 'Android Auto', sub: 'Empik Go', icon: 'car', ok: true }, { at: 'Kar', label: 'CarPlay', sub: 'Empik Go', icon: 'car', ok: true },
      ] },
      { id: 'A10', kind: 'features', kicker: 'Oceny · stan na 19.10.2026', title: 'Aplikacje: 4,5–4,8', items: [
        { at: 'Gugl', label: 'Audioteka', sub: 'Google Play 4,8 · App Store 4,7', icon: 'star' },
        { at: 'Storze', label: 'Empik Go', sub: 'Google Play 4,6 · App Store 4,5', icon: 'star' },
        { at: 'wszystkie', label: 'Legimi', sub: 'Google Play 4,5 · App Store 4,5', icon: 'star' },
        { at: 'samych', label: 'Te same aplikacje', sub: 'co u płacących abonentów', icon: 'check' },
      ] },
      { id: 'A11', kind: 'proscons', bump: 'Plusy i minusy', title: 'Plusy i minusy', pros: [
        { at: '0', label: '0 zł' }, { at: 'bez', label: 'Bez limitu tytułów' }, { at: 'bestsellerami', label: 'Bestsellery i nowości' }, { at: 'pelnych', label: 'Pełne aplikacje' },
      ], cons: [
        { at: 'kodow', label: 'Mało kodów' }, { at: 'pilnowac', label: 'Trzeba pilnować dat' }, { at: 'filii', label: 'Często wizyta w filii' }, { at: 'konczy', label: 'Dostęp tylko na miesiąc' },
      ] },
      { id: 'A12', kind: 'verdict', bump: 'Werdykt', question: 'Kody z biblioteki:\nczy warto?', yes: [
        { at: 'karte', label: 'Masz kartę i cierpliwość', sub: 'najtańszy legalny sposób na nowości: 0 zł' },
      ], no: [
        { at: 'polowac', label: 'Nie chcesz polować na kody', sub: 'kodów jest mało i szybko znikają' },
      ], alts: { at: 'probne', names: ['Okresy próbne serwisów', 'Wolne Lektury: klasyka za 0 zł'], label: 'Zamiast tego:' } },
      { id: 'B01', kind: 'steps', bump: 'Jak odebrać kod', kicker: 'Krok 1', title: 'Karta biblioteczna', rec: { clip: '05_lodz_ebooki', start: 7.0, url: 'biblioteka.lodz.pl' }, steps: [
        { at: 'zapisz', title: 'Zapisz się do biblioteki' }, { at: 'dokument', title: 'Weź dokument tożsamości' }, { at: 'reki', title: 'Łódź: karta od ręki', sub: 'w każdej filii' },
      ] },
      { id: 'B02', kind: 'rec', kicker: 'Krok 2', title: 'Sprawdź zasady', rec: { clip: '07_wroclaw_legimi', start: 6.0, url: 'biblioteka.wroc.pl' },
        tags: [
          { at: 'serwis', label: 'Który serwis?', sub: 'Legimi, Empik Go, Audioteka', icon: 'search' }, { at: 'filii', label: 'W filii', icon: 'library' },
          { at: 'mailem', label: 'Mailem', icon: 'mail' }, { at: 'formularz', label: 'Przez formularz', icon: 'doc' },
        ] },
      { id: 'B03', kind: 'stat', kicker: 'Krok 3', title: 'Bądź pierwszy', at: 'Wroclawiu', value: '2.11.2026', label: 'następne wydawanie kodów w MBP we Wrocławiu', tags: [
        { at: 'rana', label: 'Najlepiej z samego rana', icon: 'clock' }, { at: 'grudnia', label: 'Potem 1.12.2026', sub: 'stan na 19.10.2026', icon: 'calendar' },
      ] },
      { id: 'B04', kind: 'steps', kicker: 'Krok 4', title: 'Aktywuj kod', rec: { clip: '02_empik_kod', start: 0.3, holdAt: 2.8, url: 'empik.com/go/biblioteki/kod' }, steps: [
        { at: 'aktywuj', title: 'W tym samym miesiącu' },
        { at: 'stronie', title: 'Na stronie podanej przez bibliotekę', sub: 'np. empik.com/biblioteki/kod, legimi.pl/bmwl' },
        { at: 'zaloguj', title: 'Zaloguj się albo załóż konto', rec: { clip: '04_legimi_lodz', start: 0.3, holdAt: 2.9, url: 'legimi.pl/bmwl' } },
      ],
        marks: [{ at: 'stronie', until: 'zaloguj', x: 1066, y: 246, w: 360, h: 70 }, { at: 'zaloguj', x: 1070, y: 414, w: 464, h: 286 }] },
      { id: 'B05', kind: 'steps', kicker: 'Krok 5', title: 'Słuchaj w aplikacji', steps: [
        { at: 'pobierz', title: 'Pobierz aplikację serwisu' }, { at: 'zaloguj', title: 'Zaloguj się tym samym kontem' },
        { at: 'sciagnij', title: 'Pobierz audiobooki offline' }, { at: 'wygasnie', title: 'Po ok. 30 dniach dostęp wygasa', sub: 'po nowy kod wracasz do biblioteki' },
      ] },
      { id: 'B06', kind: 'outro', rec: { clip: '13_sonorbooks_biblioteka', start: 0.2, url: 'sonorbooks.pl/platformy' }, cta: 'Kodu zabrakło?\nPorównaj ceny:\nsonorbooks.pl', ctaAt: 'sonorbooks', signAt: 'Twoja',
        tags: [{ at: 'Audioteki', label: 'Audioteka · Empik Go · Legimi', icon: 'search' }] },
    ],
    chapters: [
      { label: 'Jak działają kody z biblioteki', from: 'A02' },
      { label: 'Ile to kosztuje', from: 'A03' },
      { label: 'Legimi', from: 'A04' },
      { label: 'Empik Go', from: 'A05' },
      { label: 'Audioteka Klub', from: 'A06' },
      { label: 'Zasady bibliotek: Łódź i Wrocław', from: 'A07' },
      { label: 'Gdańsk, Poznań i Warszawa', from: 'A08' },
      { label: 'Trzy zasady wspólne', from: 'A08B' },
      { label: 'Aplikacje i oceny', from: 'A09' },
      { label: 'Plusy i minusy', from: 'A11' },
      { label: 'Werdykt: czy warto?', from: 'A12' },
      { label: 'Jak odebrać kod krok po kroku', from: 'B01' },
    ],
  },
  thumb: { line1: 'AUDIOBOOKI', line2: 'ZA 0 ZŁ?', seal: { icon: 'library', text: 'Kod z\nbiblioteki' }, label: { strong: 'Gdzie', rest: 'HACZYK?' } },
};
