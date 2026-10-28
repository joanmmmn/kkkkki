# Tutoriales «Cómo cancelar…» (SonorBooks España) — un vídeo por plataforma · v2

Encargo de Joan (26/10/2026): con las apps de los tutoriales que tiene en BlueStacks con suscripción, un vídeo de cómo cancelar
la suscripción en todas, **cancelando de verdad**; un vídeo individual por plataforma, cada uno con su artículo del blog.

**v2 (28/10/2026, 12:27):** «Empieza directamente los vídeos con: Para cancelar la suscripción de X… y dale más dinamismo a cada
vídeo y que sea todo de más calidad; además la promo a SonorBooks mira de meterla mejor, di que tenemos las mejores pruebas
exclusivas para que prueben otras opciones, metido rápido pero en máximo dinamismo, calidad y conversión».
**Terminados; pendientes de la aprobación de Joan. Nada publicado.** La v1 (con entrada y cierre propios) está en el historial
de la rama (commit 1b29af5).

## Los ocho vídeos (una carpeta `deliverables/cancelar-<k>/` por plataforma)

| Plataforma | Carpeta | Duración | Cómo se canceló | Promo: prueba destacada | Guía del blog |
|---|---|---|---|---|---|
| Audible | `cancelar-audible` | 0:47 | Ya cancelada desde la reseña: pantallas de la app y de la cuenta, pasos de la ayuda oficial | Nextory · ElevenReader · Storytel · Podimo | `/es/blog/cancelar-audible/` |
| Storytel | `cancelar-storytel` | 0:37 | App (BlueStacks) → web | Nextory (30 en vez de 14) | `/es/blog/cancelar-storytel/` |
| Spotify Premium | `cancelar-spotify` | 0:36 | Web | Nextory · Storytel · Audible · Podimo | `/es/blog/cancelar-spotify-premium/` |
| Podimo | `cancelar-podimo` | 0:47 | App → web | Storytel (sin límite de horas) | `/es/blog/cancelar-podimo/` |
| Nextory | `cancelar-nextory` | 0:46 | App → web (el último paso lo hizo Joan) | ElevenReader Ultra | `/es/blog/cancelar-nextory/` |
| BookBeat | `cancelar-bookbeat` | 0:39 | App → web, en inglés | Nextory · Storytel · Podimo · ElevenReader | `/es/blog/cancelar-bookbeat/` |
| Audiobooks.com | `cancelar-audiobooks` | 0:44 | Web | Nextory (30 en vez de 14) | `/es/blog/cancelar-audiobooks-com/` |
| iVoox Premium | `cancelar-ivoox` | 0:34 | App | Nextory · Storytel · Podimo · Audible | `/es/blog/cancelar-ivoox-premium/` |

En cada carpeta: `SonorBooks_Cancelar<Plataforma>_1440p.mp4` (2560×1440, 50 fps, H.264 + AAC 320 kb/s, −14,3 a −14,6 LUFS,
pico −1,8 a −2,0 dBFS; de 34 a 56 MiB, en Git LFS), `miniatura.png` (1280×720), `cancelar_<k>.es.srt`,
`youtube.md` (título, alternativa, descripción, etiquetas, comentario fijado y lo que hay que marcar al subir) y
`descripcion_youtube.txt`. Descarga directa de cada máster:
`https://media.githubusercontent.com/media/joanmmmn/kkkkki/tutorial-cancelar/deliverables/cancelar-<k>/SonorBooks_Cancelar<Plataforma>_1440p.mp4`
(`<Plataforma>`: Audible, Storytel, Spotify, Podimo, Nextory, BookBeat, Audiobooks, iVoox).

## Cómo es cada vídeo (v2)

1. **Desde el primer fotograma, la cancelación real** con la voz «Para cancelar la suscripción de X…» (la cámara entra alejándose
   del panel, con un destello). Pantalla a pantalla, cada botón marcado cuando la voz lo nombra; el paso que se nombra entra con
   rebote y destello, y una barra «Paso n de N» se va llenando. La cámara del móvil, más cerca (1,42). Al acabar, el sello
   «Cancelada» cae sobre la pantalla real de la baja.
2. **Si pagas por la tienda** (sin voz, 3,9 s, antes 6,4): Google Play y App Store, y «Borrar la app no cancela nada» en rojo.
   No va en Spotify ni en BookBeat.
3. **Promo de SonorBooks** (8–11 s): la pregunta en grande sobre amarillo («¿Buscas otra?», «¿Y ahora qué escuchas?»…) con
   «✓ X, cancelada»; se cierra en círculo hacia el logotipo y «Las mejores pruebas gratis», «+ Pruebas exclusivas» y cuatro
   tarjetas de pruebas (nunca la plataforma del vídeo): Nextory 30 días (el 14 tachado) y ElevenReader 30 días de Ultra
   (el 3 tachado), con el sello «Exclusiva»; Storytel 30 días «Con nuestro enlace»; Podimo y Audible, 30 días. Termina en
   «Enlace en la descripción» con «✓ Pruebas gratis · ✓ Guía paso a paso».
4. **Pantalla final** (5,6 s): logotipo, «Las mejores pruebas gratis de audiolibros», sonorbooks.com y la página real de
   plataformas desplazándose; la mitad de abajo, libre para la pantalla final de YouTube (vídeo + suscribirse).

Datos de la promo comprobados el 28/10/2026 en sonorbooks.com/es/plataformas (Nextory, ElevenReader, Podimo y Storytel: «30 días
gratis con nuestro enlace»), nextory.com/es (14 días de prueba normal) y la investigación de «Las mejores plataformas» (ElevenReader,
3 días sin el enlace). Storytel lleva «Con nuestro enlace» y no «Exclusiva»: su prueba normal cambia según la promoción.

**«Incluye promoción pagada»: NO** (los vídeos solo enlazan a la web de SonorBooks; la afiliación está en la web y se indica allí).
La descripción y el comentario fijado llevan, además de la guía, el enlace a https://sonorbooks.com/es/plataformas/.

## Cómo se hizo

- **Voz nueva** (ElevenLabs, «Martin Osborne», `eleven_v4`, velocidad 1,13): aperturas X03A–X10A (la primera frase de cada tramo,
  con las mismas palabras clave) y promos Y21–Y28. `tools/cnl_splice.py` empalma cada apertura con el resto de la locución original
  y deja X03S–X10S; el corte y el acortado de pausas se miden en el audio (el alineamiento se comía la «p» de «Pulsa» y parte del
  «Gratis» de Podimo). `vid()` en `timeline.ts` usa la empalmada y no busca palabras clave dentro de «Para cancelar la suscripción de».
- **Vídeo:** `video/src/scenes/cnl/Video.tsx` (arranque, sello, tiendas, promo y pantalla final), `kit.tsx` (rebote, destello,
  barra de progreso y cámara), `videos.json` (`timing`, `promo`, `feat`, `cards`), `videos.ts`. Captura nueva de la página de
  plataformas: `video/public/cnl/promo/`.
- **Música:** las mismas piezas, recolocadas a la nueva duración; la promo y la pantalla final con el final de «i_rutas», un poco
  más arriba (`tools/cnl_music.py`).
- **Control de calidad:** Whisper sobre la mezcla final de cada vídeo (`tools/cnl_qa_mix.py`): del 93 al 99 % de las palabras; lo
  que «falta» son grafías («Sonor Books», «NextStory») y cifras. OCR de datos personales cada 0,5 s sobre cada máster: nada. Hojas de
  fotogramas revisadas. Sonoridad −14,3 a −14,6 LUFS.
- **Render** a 2560×1440 por tramos (`tools/render_chunks.sh`) y máster a −14 LUFS (`tools/master.sh`).
- **Textos y subtítulos:** `tools/cnl_videos.py`.

## Para Joan

- **Audible:** la web dice «Fecha de cancelación: 21-10-2026» y no hay plan activo, pero el 14/10 la app decía que acababa el
  13/11/2026. Si la prueba se cortó al cancelar, el «truco del día 1» del vídeo «Las mejores plataformas» (Z04/Z20: cancelar la
  prueba el primer día y seguir hasta el final) podría no ser cierto. Este tutorial no lo promete.
- **«Las mejores plataformas»** (pendiente de aprobación) tiene un fallo que se ha visto aquí: en la tarjeta de Audiobooks.com, el
  logotipo blanco perdía la gota («audi books»). Corregido en `video/public/abc/img/audiobooks_logo_white_mono@4x.png`; para
  ese vídeo haría falta volver a renderizarlo.
- **Suscripciones canceladas el 26/10:** Podimo, iVoox, BookBeat, Storytel, Nextory, Spotify y Audiobooks.com (Audible ya lo
  estaba). En las pruebas, el acceso se cortó al momento en Storytel, Podimo, Nextory, BookBeat y Audiobooks.com.
- **Al publicar:** primero las guías (`web/cancelar`, README con las instrucciones para Codex) y después cada vídeo; luego
  `python3 web/cancelar/build.py --yt audible=ID,storytel=ID,… --yt-fecha AAAA-MM-DD`.
