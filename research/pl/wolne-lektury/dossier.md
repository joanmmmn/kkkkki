# Wolne Lektury — dossier (SonorBooks Polska)

Pieza: `wolne-lektury` · sustituye a la reseña de El Libro Total del canal español · consultas: **19/10/2026** (todas las
fuentes de abajo se abrieron ese día, desde un servidor fuera de Polonia; la web no redirige por país).

Gancho del vídeo: «Darmowe audiobooki… gdzie jest haczyk?». Respuesta: no hay trampa; solo hay clásicos y lecturas
escolares, más de la mitad de las grabaciones son poemas cortos, y la fundación vive de donaciones (banners de colecta).

---

## 1. Qué es, quién está detrás, desde cuándo

| Dato | Fuente |
|---|---|
| «Wolne Lektury to biblioteka internetowa z ebookami i audiobookami czynna 24 godziny na dobę, 365 dni w roku, której zbiory dostępne są **całkowicie za darmo i bez rejestracji**.» | https://wolnelektury.pl/info/o-projekcie/ |
| Proyecto de la **Fundacja Wolne Lektury** «realizowany pro publico bono **od 2007 roku**», en colaboración con la Biblioteka Narodowa, la Biblioteka Śląska y la Biblioteka Elbląska, bajo el patrocinio del Ministerio de Educación, el de Cultura y la Stowarzyszenie Pisarzy Polskich. | ídem |
| Sede: ul. Marszałkowska 84/92 lok. 125, 00-514 **Warszawa**; KRS 0000070056. | ídem |
| En la App Store el vendedor aún figura como «Fundacja Nowoczesna Polska» (mismo proyecto; nombre anterior de la fundación, que la web ya no usa). En el vídeo se dice solo «Fundacja Wolne Lektury». | https://apps.apple.com/pl/app/wolne-lektury/id6753013225?l=pl |
| Misión: libros gratis sobre todo para niños y jóvenes de familias y localidades sin librerías ni bibliotecas («w 32% domów w Polsce nie ma ani jednej książki», dato BN 2022). | o-projekcie |
| Audiencia: «Codziennie … ponad 15 tys. uczennic i uczniów»; «ponad **7 mln unikatowych użytkowników rocznie**». | o-projekcie |
| Financiación: «Działamy tylko dzięki dotacjom i darowiznom». Hoy hay una colecta en curso: objetivo **300 000 zł**, cuenta atrás hasta el **31/10/2026**; la barra marca **74,53 % (223 591 zł)** el 19/10. También piden el 1,5 % del IRPF. | banner de cualquier página (p. ej. https://wolnelektury.pl/katalog/lektura/pan-tadeusz/) y https://wolnelektury.pl/pomagam/ |
| La web no carga ninguna red publicitaria (solo sus propios scripts `static.wolnelektury.pl`): no hay anuncios, solo los banners de la colecta. | HTML de la portada y de la ficha de *Pan Tadeusz* (revisado con curl) |

## 2. Catálogo

| Dato | Fuente |
|---|---|
| «W zbiorach Wolnych Lektur znajduje się **7332 utworów**», muchas lecturas escolares recomendadas por el MEN ya en dominio público, más traducciones propias en licencia libre (*Doktor Dolittle*, *Mały Książę*, *Inwazja jaszczurów*, *Rok 1984*…). | o-projekcie |
| «Nagraliśmy i udostępniliśmy także **ponad 1 tys. audiobooków**, czytanych przez wybitnych lektorów.» Las fichas de las tiendas dicen «ponad 7000 ebooków i **ponad 1200 audiobooków**». | o-projekcie; Google Play y App Store |
| API pública: `https://wolnelektury.pl/api/audiobooks/` devuelve **1564 entradas con audio** (incluye tomos y partes por separado). De ellas, **850 (54,3 %) son lírica** (622 «Wiersz», 47 «Pieśń», 37 «Sonet», 29 «Fraszka»…); 687 épica (193 fábulas, 158 cuentos, 67 cuentos de hadas…) y 27 dramas. **137 entradas son novelas** (32 de ellas son tomos/partes), o sea, **más de cien novelas**. | API, consulta 19/10/2026 (cálculo propio) |
| Para el vídeo: «ponad tysiąc nagrań» (dato oficial) y «ponad połowa to poezja» (cálculo con la API). | — |
| Ejemplos con duración y lector (API `https://wolnelektury.pl/api/books/<slug>/`): *Pan Tadeusz* 8:44:04, Wiktor Korzeniewski (dir. Adam Bień), grabado en el proyecto «Słuchamy Polski» financiado por el Senado; *Lalka* t. I 15:21:41 + t. II 16:42:13 = **32 h 04 min**, Albert Osik; *Quo vadis* 20:34:21, Marek Proszek; *W pustyni i w puszczy* 13:30:37, Bartosz Mazur; *Kamizelka* 22:21 y *Latarnik* 41:47, **Jan Peszek**; *Tajemniczy ogród* 8:09:09, **Paulina Holtz**; *Przedwiośnie* 10:52:31, Jacek Rozenek; *Rok 1984* (trad. Julia Fiedorczuk) 10:52:39, Jan Staszczyk; *Mały Książę* (trad. Agata Kozak) 1:43:11, Katarzyna Faszczewska; *Proces* (trad. Katarzyna Łakomik) 9:03:26, Wiktor Korzeniewski; *Zemsta*, *Balladyna*, *Makbet*, *Wesele* (dramas con varias voces: Robert Koszucki, Joanna Niemirska, Karolina Szeptycka…). | API |
| Novedades recientes en portada: nueva traducción de *Ania z Zielonego Wzgórza*, cuentos de *Złoty żuk* de Poe para escuchar. | https://wolnelektury.pl/ |
| Productora actual de los audiolibros: Postęp Studio (vídeo de la colecta: «od ponad dwóch lat realizujemy dla Was audiobooki»). | banner de la colecta |

## 3. Precio, prueba, cuenta, cancelación

- **0 zł**, sin suscripción, sin prueba, sin tarjeta y **sin registro** (cuenta opcional: «Załóż konto» sirve para favoritos/listas).
  Fuente: o-projekcie («bez rejestracji»); ficha de libro (botón «Dodaj do ulubionych»).
- No hay nada que cancelar. Las donaciones (mensuales o puntuales, 5–1000 zł) son voluntarias: https://wolnelektury.pl/pomagam/
- **Muchas grabaciones empiezan con una locución de unos 27 s** (comprobado en *Pan Tadeusz*, *Quo vadis* y *W pustyni i w puszczy*; la de *Kamizelka*, con Jan Peszek, no la tiene): «Wolne Lektury zapraszają. Wspólnie możemy udostępnić kolejne
  książki. Wejdź na wolnelektury.pl i dorzuć się do biblioteki. Audiobooki Wolnych Lektur są udostępniane na wolnych
  licencjach…» (transcrito con Whisper del MP3 de *Pan Tadeusz*, Księga I; el texto del poema empieza en el s 58,2 tras el
  título y el sumario del canto). Ver «Audio real» al final.

## 4. Licencias y legalidad

- «Wszystkie utwory zamieszczone w bibliotece Wolne Lektury można zgodnie z prawem bezpłatnie przeglądać, słuchać, pobierać na
  swój komputer, a także udostępniać innym i cytować.» La mayoría está en dominio público; las ediciones, notas y
  **grabaciones** («prawa pokrewne do artystycznych wykonań i fonogramów») se publican con licencia libre. Algunas obras aún
  protegidas se publican con permiso (CC BY-SA 3.0 o Licencja Wolnej Sztuki 1.3). Fuente: o-projekcie y
  https://wolnelektury.pl/info/regulamin/
- En la ficha de *Pan Tadeusz*, cada capítulo lleva el icono de licencia **CC BY-SA 3.0** (enlace a creativecommons.org).
- Lecturas escolares: la colección para primaria se basa en la lista oficial «po nowelizacji z 2024 r.» y excluye las obras
  que aún tienen derechos. Fuente: https://wolnelektury.pl/info/lektury-szkolne/

## 5. Cómo funciona (lo que se ve en la web)

- Menú «Katalog» → «Audiobooki» (`/katalog/audiobooki/`): orden «najpopularniejsze / alfabetycznie» y etiquetas de
  género, época y autor (Liryka, Epika, Romantyzm, Henryk Sienkiewicz…).
- Ficha de libro (`/katalog/lektura/pan-tadeusz/`): botones «pobierz audiobook», «pobierz książkę», «czytaj online» y
  «Posłuchaj w ElevenReader» (enlace a elevenreader.io; no lo mencionamos en el vídeo); reproductor en la página con
  **velocidad 0,5×–2×** y lista de capítulos, cada uno con «Czyta: …, reż. …» y la licencia.
- Descarga de audio: **.mp3** («Uniwersalny format, obsługiwany przez wszystkie urządzenia»), **OggVorbis**, **DAISY** («Format
  dla osób z dysfunkcjami czytania») y **EPUB + audiobook**; además ZIP del libro entero (`/katalog/zip/pan-tadeusz_mp3.zip`).
- E-book: PDF, EPUB, MOBI («Natywny format dla czytnika Amazon Kindle»), TXT, FB2; «Stwórz własny PDF». Las obras están
  «opatrzone przypisami, motywami» (notas y motivos literarios); la de *Pan Tadeusz* «zawiera przypisy opracowane specjalnie
  dla uczennic i uczniów».
- Búsqueda: `https://wolnelektury.pl/szukaj/?q=lalka` (200, en polaco).

## 6. Dispositivos y app

- Web en cualquier navegador (ordenador, tableta, móvil). MP3 descargables para cualquier reproductor.
- **App oficial «Wolne Lektury»** (gratis):
  - Android `pl.app.wolnelektury`: «Darmowe ebooki i audiobooki»; **4,6** (4,5676) con **37 opiniones**; **5 tys.+**
    descargas; última actualización 3/8/2026; «Aplikacja nie zbiera danych». Fuente:
    https://play.google.com/store/apps/details?id=pl.app.wolnelektury&hl=pl&gl=PL
  - iOS id6753013225: **4,4** (4,4286) con **14 valoraciones** (App Store PL); **lanzada el 23/12/2025**; versión 1.1.32 del
    27/7/2026; notas de versión: marcadores, listas, ilustraciones en el lector, obras en varios tomos, mejoras para lectores
    de pantalla. Fuente: `https://itunes.apple.com/lookup?id=6753013225&country=pl` y la página de la App Store.
  - La app antigua de iOS (id1441906437) ya no está en la tienda polaca (lookup vacío).
- No he verificado Android Auto, CarPlay, relojes ni Chromecast: **no se dicen**.

## 7. Opiniones

- Muy pocas reseñas (app nueva). Google Play: las visibles son elogios breves («serdecznie polecam», «super»). App Store PL:
  una reseña (17/4) informa de que el audiolibro se queda cargando si se intenta reproducir **durante una llamada
  telefónica**. No hay artículos polacos recientes que evalúen la app nueva; no se inventa nada más.
- Indicador de uso real: 7 millones de usuarios únicos al año (dato oficial).

## 8. Comparación de precio para el vídeo

- *Lalka* en Audioteka (versión de **Zbigniew Zapasiewicz**): **8 godzin 55 minut**, **19,99 zł** (19/10/2026,
  https://audioteka.com/pl/audiobook/lalka-audioteka/ ; la propia página resume opiniones que hablan de «skrócenie treści»).
  En Wolne Lektury: *Lalka* completa, 2 tomos, 32 h 04 min, 0 zł. En el guion: «stan na październik 2026».

## 9. Comparación con sonorbooks.pl/platformy/ («Sprawdzono: 28 września 2026»)

Ficha «Wolne Lektury»: «Otwarta biblioteka Fundacji Wolne Lektury z nagraniami lektur szkolnych i klasyki» · Plan: Bez
abonamentu · Cena: 0 zł · Słuchanie: Online, w aplikacji lub z plików MP3 · Urządzenia i konto: Bez rejestracji · Okres
próbny: Nie dotyczy · «Ponad 1000 audiobooków. Utwory są w domenie publicznej lub na wolnych licencjach – zasady podano przy
każdym tytule.» · enlace a https://wolnelektury.pl/katalog/audiobooki/

**Discrepancias con sonorbooks.pl:** ninguna de fondo; todo coincide con la web oficial de hoy. Matices (no hace falta tocar
nada):
- sonorbooks.pl dice «ponad 1000 audiobooków» (igual que o-projekcie); las tiendas dicen «ponad 1200» y la API cuenta 1564
  entradas con audio (con tomos y poemas sueltos).
- «zasady podano przy każdym tytule»: en la ficha se ve el icono de licencia en cada capítulo; el reglamento dice que la
  información de derechos está «w ebooku na stronach redakcyjnych». Coherente.

## 10. Notas legales del vídeo

- Se puede afirmar «za darmo i legalnie» y «bez rejestracji»: lo dice la fundación.
- «Bez reklam»: comprobado en el HTML (sin redes publicitarias). Hay banners y una locución de la fundación pidiendo apoyo:
  el guion lo cuenta como el único «haczyk».
- No decir «wszystkie lektury szkolne»: faltan las que aún tienen derechos (lo dice la propia web).
- No decir que todas las voces son de actores famosos: la web dice «wybitni lektorzy»; citamos solo los nombres comprobados
  en la API (Jan Peszek, Paulina Holtz, Wiktor Korzeniewski, Jan Staszczyk…).
- Si el montaje usa audio real de Wolne Lektury, la grabación es **CC BY-SA 3.0**: hay que acreditarla en pantalla y en la
  descripción (título, lector, «Wolne Lektury», licencia con enlace) y tener en cuenta la cláusula «ShareAlike». Lo más
  prudente: un fragmento corto, con crédito, y consultar a Joan si quiere usarlo. Alternativa sin condiciones: no usar audio.
- Nada de «za darmo z SonorBooks». En el cierre solo se invita a comparar en sonorbooks.pl (Wolne Lektury sí está en
  /platformy/).

## 11. Audio real (opcional para el arranque en frío)

MP3 de *Pan Tadeusz*, Księga I: https://wolnelektury.pl/media/book/mp3/pan-tadeusz_001_ksiega-pierwsza-gospodarstwo.mp3
(Wiktor Korzeniewski; CC BY-SA 3.0). Transcripción (Whisper large-v3, 19/10/2026):
- 0,0–26,4 s: locución de la fundación (petición de apoyo y licencia).
- 26,4–58,2 s: «Adam Mickiewicz. Pan Tadeusz, czyli ostatni zajazd na Litwie. Księga pierwsza. Gospodarstwo» + sumario.
- **58,2–74,7 s**: «Litwo, ojczyzno moja! Ty jesteś jak zdrowie. Ile cię trzeba cenić, ten tylko się dowie, kto cię stracił.
  Dziś piękność twą w całej ozdobie widzę i opisuję, bo tęsknię po tobie.» ← fragmento propuesto (A00, opcional).
