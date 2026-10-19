// BookBeat w Polsce (po polsku od 2020 r., grupa Bonnier). Investigación y guion: research/pl/bookbeat/.
// Tomas: webs públicas de bookbeat.com/pl (19/10/2026). Las páginas de ayuda (support.bookbeat.com) piden verificación de Cloudflare:
// no se graban; la rezygnacja (B04) va en animación. La FAQ de la portada aún dice «2 tygodnie» de prueba: ninguna toma enseña esa pregunta.
// Los «cues» son palabras de la locución tal como quedan en vo/<ID>.json: «Bejzik», «Gugl», «Ep», «Epl», «Kromkastem»…
import type { PLPiece } from './index';

export const piece: PLPiece = {
  spec: {
    slug: 'bookbeat', name: 'BookBeat', domain: 'bookbeat.com/pl', color: '#CD96FF', deep: '#7B3FC4', soft: '#F5E6FF',
    logo: 'pl/bookbeat/img/logo.svg', logoWhite: 'pl/bookbeat/img/logo_white.svg', logoRatio: 143.2 / 920.2, tileBg: '#CD96FF', tileLogoWhite: false,
    kicker: 'Recenzja BookBeat', music: 'pl/bookbeat/music/bed.mp3',
    scenes: [
      { id: 'A01', kind: 'hook', title: 'BookBeat:\nczy warto?', hi: ['BookBeat:', 'BookBeat'], rec: { clip: 'portada', start: 0.3 },
        cuts: [{ at: 'ceny', rec: { clip: 'cennik', start: 0.5 } }, { at: 'polski', rec: { clip: 'portada', start: 10.3 } }, { at: 'Powiemy', rec: { clip: 'rozdroze', start: 0.4 } }],
        promises: [
          { at: 'ceny', label: 'Ceny i limity godzin', icon: 'coin' }, { at: 'polski', label: 'Polski katalog', icon: 'book' }, { at: 'regulamin', label: 'Drobny druk', icon: 'doc' },
          { at: 'dobre', label: 'Plusy i minusy', tone: 'good' }, { at: '30', label: '30 dni za darmo', icon: 'gift' },
        ] },
      { id: 'A02', kind: 'intro', bump: 'Czym jest BookBeat?', rec: { clip: 'portada', start: 5.0 }, cuts: [{ at: 'pakiet', rec: { clip: 'cennik', start: 4.4 } }], facts: [
        { at: 'szwedzka', label: 'Ze Szwecji, grupa Bonnier', icon: 'globe' }, { at: 'polsku', label: 'Po polsku od 2020 roku', icon: 'calendar' },
        { at: 'Planu', label: 'Brak planu bez limitu', icon: 'infinity', tone: 'bad' }, { at: 'pakiet', label: 'Płacisz za pakiet godzin', icon: 'clock' },
      ], big: { at: 'miliona', value: 1000000, suffix: '+', label: 'audiobooków i e-booków' } },
      { id: 'A03', kind: 'plans', bump: 'Cennik', title: 'Trzy pakiety godzin', plans: [
        { at: 'Bejzik', name: 'Basic', price: '22,99 zł', period: '/ mies.', features: ['20 godzin miesięcznie', 'Profil: +9,99 zł / mies.'] },
        { at: 'Standard', name: 'Standard', price: '29,99 zł', period: '/ mies.', features: ['40 godzin miesięcznie', 'Profil: +12,99 zł / mies.'] },
        { at: 'Premium', name: 'Premium', price: '34,99 zł', period: '/ mies.', features: ['100 godzin miesięcznie', 'Profil: +14,99 zł / mies.'], best: true, badge: 'Najwięcej godzin' },
      ], footer: [{ at: 'pakiety', label: 'Stan na październik 2026', icon: 'calendar' }, { at: 'czterech', label: 'Do 4 profili dodatkowych', icon: 'family' }, { at: 'zobowiazan', label: 'Bez zobowiązań', icon: 'lock' }] },
      { id: 'A04', kind: 'stat', bump: 'Polski katalog', kicker: 'Wyszukiwarka BookBeat · 19.10.2026', title: 'Milion książek, ale ile po polsku?', at: '18', value: '18 000', unit: '+', count: { from: 0, to: 18000 },
        label: 'audiobooków po polsku (i 12 000+ e-booków)', tags: [
          { at: 'angielsku', label: 'Milion: głównie po angielsku i niemiecku', icon: 'globe' }, { at: 'Harry', label: 'Harry Potter · Wiedźmin', icon: 'book' },
          { at: 'sprawdz', label: 'Sprawdź swoje tytuły przed zapłatą', icon: 'search', tone: 'accent' },
        ] },
      { id: 'A05', kind: 'rec', kicker: 'Superprodukcja', title: 'Perełka katalogu', rec: { clip: 'wiedzmin', start: 5.3 },
        cuts: [{ at: 'Rozdroze', rec: { clip: 'rozdroze', start: 0.3 } }],
        marks: [{ at: '70', until: 'muzyka', x: 645, y: 470, w: 616, h: 72 }, { at: 'muzyka', until: 'Rozdroze', x: 645, y: 660, w: 616, h: 64 }],
        zooms: [{ at: 'Wiedzmin', zoom: 1.45, x: 955, y: 480 }],
        tags: [
          { at: 'Wiedzmin', label: 'Wiedźmin. Ostatnie życzenie', icon: 'headphones' }, { at: '70', label: 'Ponad 70 aktorów', icon: 'mic' },
          { at: 'muzyka', label: 'Muzyka i efekty', icon: 'music' }, { at: 'Rozdroze', label: 'Nowość: Rozdroże kruków', icon: 'book' },
          { at: 'sluchowisk', label: 'Słuchowiska po polsku: ok. 40', tone: 'bad' },
        ] },
      { id: 'A06', kind: 'rec', kicker: 'Karta książki', title: 'Dwie oceny', rec: { clip: 'rozdroze', start: 3.2 },
        marks: [
          { at: 'oceny', until: 'trwa', x: 730, y: 644, w: 460, h: 70 }, { at: 'trwa', until: ['cztery', 0], x: 653, y: 902, w: 600, h: 46 },
          { at: ['cztery', 0], until: ['cztery', 1], x: 740, y: 644, w: 120, h: 70 }, { at: ['cztery', 1], until: 'Fragment', x: 1050, y: 644, w: 120, h: 70 },
          { at: 'Fragment', x: 862, y: 134, w: 186, h: 38 },
        ],
        zooms: [{ at: 'oceny', zoom: 1.6, x: 955, y: 650 }, { at: 'Fragment', zoom: 1.6, x: 955, y: 420 }],
        tags: [
          { at: 'oceny', label: 'Dwie oceny', sub: 'za treść i za lektora', icon: 'star' }, { at: 'trwa', label: '9 godz. 35 min', icon: 'clock' },
          { at: ['cztery', 0], label: '4,8 za książkę', icon: 'star' }, { at: ['cztery', 1], label: '4,9 za lektora', icon: 'mic' },
          { at: 'Fragment', label: 'Fragment bez logowania', icon: 'play', tone: 'good' },
        ] },
      { id: 'A07', kind: 'features', bump: 'Jak to działa', kicker: 'W aplikacji', title: 'Co potrafi aplikacja?', cols: 3, items: [
        { at: 'tempo', label: 'Tempo 0,5×–2×', icon: 'speed' }, { at: 'wylacznik', label: 'Wyłącznik czasowy', icon: 'moon' },
        { at: 'zakladki', label: 'Zakładki', sub: 'z notatkami', icon: 'bookmark' }, { at: 'pobierzesz', label: 'Offline', sub: 'pobierz książkę', icon: 'download' },
        { at: 'ponad', label: 'Synchrobooki', sub: '2500+ po polsku: słuchasz i czytasz naraz', icon: 'sync' },
      ] },
      { id: 'A08', kind: 'rec', kicker: 'Pytania i odpowiedzi', title: 'Jak liczą się godziny?', rec: { clip: 'faq_godziny', start: 1.3 },
        marks: [{ at: 'normalnego', x: 572, y: 330, w: 766, h: 148 }], zooms: [{ at: 'normalnego', zoom: 1.7, x: 955, y: 390 }],
        tags: [
          { at: 'normalnego', label: 'Liczy się normalne tempo', icon: 'speed' }, { at: 'dziesieciogodzinna', label: 'Książka 10 h = 10 h z pakietu', sub: 'nawet gdy słuchasz na 2×', icon: 'clock' },
          { at: 'Czytanie', label: 'E-booki też zużywają godziny', icon: 'book' }, { at: 'niewykorzystane', label: 'Niewykorzystane przepadają', tone: 'bad' },
          { at: 'Premium', label: 'Premium: +20 h za 17,99 zł', icon: 'coin' },
        ] },
      { id: 'A08B', kind: 'rec', kicker: 'Konto rodzinne', title: 'Profile dla rodziny', rec: { clip: 'rodzina', start: 3.0, url: 'bookbeat.com/pl/familyaccount' },
        marks: [
          { at: 'Kazdy', until: 'wszyscy', x: 278, y: 390, w: 414, h: 150 }, { at: 'wszyscy', until: 'dzieciecy', x: 278, y: 206, w: 414, h: 170 },
          { at: 'dzieciecy', x: 278, y: 558, w: 414, h: 160 },
        ],
        tags: [
          { at: 'Kazdy', label: 'Każdy profil: te same godziny', icon: 'clock' }, { at: 'wszyscy', label: 'Wszyscy słuchają naraz', icon: 'family' },
          { at: 'dzieciecy', label: 'Profil dziecięcy: do 12 lat', icon: 'kid' }, { at: 'blokady', label: 'Bez blokady rodzicielskiej', tone: 'bad' },
          { at: 'dokupisz', label: 'Profile dopiero po próbie', icon: 'calendar' },
        ] },
      { id: 'A09', kind: 'devices', items: [
        { at: 'telefonach', label: 'Telefon i tablet', sub: 'Android · iOS', icon: 'phone', ok: true }, { at: 'Epl', label: 'Apple Watch', sub: 'nawet bez telefonu', icon: 'watch', ok: true },
        { at: 'samochodzie', label: 'CarPlay i Android Auto', icon: 'car', ok: true }, { at: 'Kromkastem', label: 'Chromecast', icon: 'cast', ok: true },
        { at: 'komputerze', label: 'Komputer', icon: 'laptop', ok: false }, { at: 'czytniku', label: 'Czytnik', sub: 'e-booków', icon: 'ereader', ok: false },
      ] },
      { id: 'A10', kind: 'ratings', bump: 'Opinie', stores: [{ at: 'Gugl', store: 'google', rating: 4.8, count: 'ocena w Polsce · 19.10.2026' }, { at: 'Ep', store: 'apple', rating: 4.8, count: '10 056 ocen w Polsce' }],
        likes: [{ at: 'lektorow', label: 'Lektorzy' }, { at: 'wygodna', label: 'Wygodna aplikacja' }],
        dislikes: [{ at: 'limity', label: 'Limity godzin, nawet w Premium' }, { at: 'zawila', label: 'Rezygnacja tylko przez stronę' }] },
      { id: 'A11', kind: 'proscons', bump: 'Plusy i minusy', pros: [
        { at: '30', label: '30 dni za darmo' }, { at: 'audiobooki', label: 'Audiobooki i e-booki w jednej cenie' }, { at: 'profile', label: 'Profile dla rodziny' },
      ], cons: [
        { at: 'brak', label: 'Brak planu bez limitu' }, { at: 'skromny', label: 'Skromny polski katalog' }, { at: 'przepadajace', label: 'Godziny przepadają' },
        { at: 'utrata', label: 'Rezygnacja w próbie = koniec dostępu' },
      ] },
      { id: 'A12', kind: 'verdict', bump: 'Werdykt', question: 'BookBeat:\nczy warto?', yes: [
        { at: 'miescisz', label: 'Mieścisz się w 100 h', sub: 'pakiet Premium' }, { at: 'rodzina', label: 'Słuchasz z rodziną' }, { at: 'angielsku', label: 'Słuchasz po angielsku' },
      ], no: [
        { at: 'nowosci', label: 'Szukasz głównie polskich nowości', sub: 'najpierw porównaj inne serwisy' },
      ], alts: { at: 'Audioteka', names: ['Audioteka Klub', 'Empik Go'], label: 'Porównaj z:' } },
      { id: 'B01', kind: 'steps', bump: 'Jak wypróbować za darmo', kicker: 'Okres próbny', title: 'Dla nowych użytkowników', rec: { clip: 'portada', start: 0.3, holdAt: 3.0 },
        marks: [{ at: '30', until: '20', x: 220, y: 350, w: 515, h: 76 }, { at: '20', x: 198, y: 444, w: 554, h: 120 }],
        zooms: [{ at: 'Nowi', zoom: 1.7, x: 565, y: 450 }],
        steps: [
          { at: 'Nowi', title: 'Nowe konto', sub: 'okres próbny tylko raz' }, { at: '30', title: '30 dni za darmo' },
          { at: '20', title: '20 godzin w próbie', sub: 'słuchania i czytania' },
        ] },
      { id: 'B02', kind: 'steps', kicker: 'Rejestracja', title: 'Krok po kroku', rec: { clip: 'rejestracja', start: 0.3, url: 'bookbeat.com/pl/registration' },
        marks: [
          { at: 'zakladasz', until: 'wybierasz', x: 700, y: 280, w: 510, h: 46 }, { at: 'wybierasz', until: 'dodajesz', x: 690, y: 408, w: 580, h: 90 },
          { at: 'dodajesz', until: 'zgody', x: 690, y: 510, w: 580, h: 110 }, { at: 'zgody', x: 700, y: 826, w: 510, h: 142 },
        ],
        steps: [
          { at: 'zakladasz', title: 'Załóż konto', sub: 'e-mail, Google lub Apple' },
          { at: 'wybierasz', title: 'Wybierz pakiet', sub: 'zacznie się po okresie próbnym', rec: { clip: 'proba', start: 4.0 } },
          { at: 'dodajesz', title: 'Dodaj metodę płatności' },
          { at: 'zgody', title: 'Zgoda na marketing', sub: 'nie musisz jej zaznaczać', rec: { clip: 'rejestracja', start: 4.6, url: 'bookbeat.com/pl/registration' } },
        ], note: { at: 'Dzis', label: 'Dziś płacisz 0 zł', icon: 'coin' } },
      { id: 'B03', kind: 'features', kicker: 'Potem', title: 'Aplikacja i karta podarunkowa', cols: 3, items: [
        { at: 'pobierasz', label: 'Pobierz aplikację', sub: 'App Store · Google Play', icon: 'download' }, { at: 'logujesz', label: 'Zaloguj się', sub: 'tym samym kontem', icon: 'user' },
        { at: 'karta', label: 'Karta podarunkowa', sub: '= bez okresu próbnego', icon: 'gift', tone: 'bad' },
      ] },
      { id: 'B04', kind: 'steps', bump: 'Jak zrezygnować', kicker: 'Rezygnacja', title: 'Tylko na stronie BookBeat', steps: [
        { at: 'menu', title: 'Menu konta', sub: 'na bookbeat.com/pl' }, { at: 'Zarzadzaj', title: 'Zarządzaj subskrypcją' },
        { at: 'wszystkie', title: 'Przejdź wszystkie kroki' }, { at: 'potwierdzeniem', title: 'Poczekaj na e-mail z potwierdzeniem', sub: 'bez niego subskrypcja może nie być anulowana' },
      ], note: { at: 'Tylko', label: 'Nie w aplikacji ani w App Store', icon: 'lock' } },
      { id: 'B05', kind: 'rec', kicker: 'Drobny druk', title: 'Koniec okresu próbnego', rec: { clip: 'proba', start: 8.0, holdAt: 14.0 },
        marks: [{ at: 'pierwsza', x: 690, y: 740, w: 580, h: 90 }],
        tags: [
          { at: 'przypomina', label: 'Brak przypomnienia', sub: 'o końcu okresu próbnego', tone: 'bad' }, { at: 'pierwsza', label: 'Dzień 31: pierwsza płatność', icon: 'calendar' },
          { at: 'Rezygnacja', label: 'Rezygnacja w próbie', sub: '= koniec dostępu od razu', tone: 'bad' }, { at: 'ostatnim', label: 'Zrezygnuj ostatniego dnia', tone: 'good' },
        ] },
      { id: 'B06', kind: 'outro', rec: { clip: '@common/sb_search', start: 0.2, url: 'sonorbooks.pl' }, cta: 'Porównaj\ninne opcje:\nsonorbooks.pl', ctaAt: 'sonorbooks', signAt: 'Twoja',
        tags: [{ at: 'Audiotek', label: 'Audioteka · Empik Go · Legimi · Audible', icon: 'search' }] },
    ],
    chapters: [
      { label: 'Czym jest BookBeat', from: 'A02' },
      { label: 'Cennik: Basic, Standard i Premium', from: 'A03' },
      { label: 'Polski katalog', from: 'A04' },
      { label: 'Wiedźmin i karta książki', from: 'A05' },
      { label: 'Funkcje aplikacji', from: 'A07' },
      { label: 'Jak liczą się godziny', from: 'A08' },
      { label: 'Profile rodzinne i dziecięce', from: 'A08B' },
      { label: 'Urządzenia', from: 'A09' },
      { label: 'Opinie', from: 'A10' },
      { label: 'Plusy i minusy', from: 'A11' },
      { label: 'Werdykt: czy warto?', from: 'A12' },
      { label: 'Jak wypróbować za darmo', from: 'B01' },
      { label: 'Jak zrezygnować', from: 'B04' },
      { label: 'Drobny druk okresu próbnego', from: 'B05' },
    ],
  },
  thumb: { line1: 'BOOKBEAT', line2: 'CZY WARTO?', screen: 'pl/bookbeat/img/thumb_screen.jpg', screenMobile: false, seal: { icon: 'clock', text: '20–100 h\nmiesięcznie' }, label: { strong: '30 dni', rest: 'ZA DARMO' } },
};
