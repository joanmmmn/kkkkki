# Tutoriales «Cómo cancelar…» (SonorBooks España) — un vídeo por plataforma

Encargo de Joan (26/10/2026): con las apps de los tutoriales que tiene en BlueStacks con suscripción, un vídeo de cómo cancelar
la suscripción en todas, **cancelando de verdad**. A las 11:55 precisó: **un vídeo individual por plataforma**, cada uno con su
artículo del blog. **Terminados; pendientes de la aprobación de Joan. Nada publicado.**

## Los ocho vídeos (una carpeta `deliverables/cancelar-<k>/` por plataforma)

| Plataforma | Carpeta | Duración | Cómo se canceló | Guía del blog |
|---|---|---|---|---|
| Audible | `cancelar-audible` | 1:01 | Ya cancelada desde la reseña: pantallas de la app y de la cuenta, pasos de la ayuda oficial | `/es/blog/cancelar-audible/` |
| Storytel | `cancelar-storytel` | 0:49 | App (BlueStacks) → web | `/es/blog/cancelar-storytel/` |
| Spotify Premium | `cancelar-spotify` | 0:48 | Web | `/es/blog/cancelar-spotify-premium/` |
| Podimo | `cancelar-podimo` | 0:56 | App → web | `/es/blog/cancelar-podimo/` |
| Nextory | `cancelar-nextory` | 0:57 | App → web (el último paso lo hizo Joan) | `/es/blog/cancelar-nextory/` |
| BookBeat | `cancelar-bookbeat` | 0:47 | App → web, en inglés | `/es/blog/cancelar-bookbeat/` |
| Audiobooks.com | `cancelar-audiobooks` | 0:52 | Web | `/es/blog/cancelar-audiobooks-com/` |
| iVoox Premium | `cancelar-ivoox` | 0:41 | App | `/es/blog/cancelar-ivoox-premium/` |

En cada carpeta: `SonorBooks_Cancelar<Plataforma>_1440p.mp4` (2560×1440, 50 fps, H.264 + AAC 320 kb/s, −14,3 a −14,7 LUFS,
pico −1,8 a −1,9 dBFS; de 43 a 63 MiB, en Git LFS), `miniatura.png` (1280×720), `cancelar_<k>.es.srt`, `youtube.md` (título,
alternativa, descripción, etiquetas, comentario fijado y lo que hay que marcar al subir) y `descripcion_youtube.txt`.
Descarga directa de cada máster:
`https://media.githubusercontent.com/media/joanmmmn/kkkkki/tutorial-cancelar/deliverables/cancelar-<k>/SonorBooks_Cancelar<Plataforma>_1440p.mp4`
(`<Plataforma>`: Audible, Storytel, Spotify, Podimo, Nextory, BookBeat, Audiobooks, iVoox).

## Cómo es cada vídeo

1. **Entrada propia** (5–8 s): «Cómo cancelar *Plataforma*», lo que vas a ver en etiquetas y la pantalla real de la baja ya
   hecha, que recibe el sello «Cancelada». Cada una con su frase (Y01–Y08): la letra pequeña que importa en esa plataforma.
2. **La cancelación real**, pantalla a pantalla, con cada botón marcado cuando la voz lo nombra (X03–X10).
3. **Si pagas por la tienda** (sin voz, 6,4 s): Google Play y App Store, y «borrar la app no cancela nada». No va en Spotify ni
   en BookBeat (BookBeat no da de alta por las tiendas; Spotify, por socios).
4. **Cierre propio** (Y11–Y18): el consejo de esa plataforma en grande mientras la voz lo dice, «todos los pasos, con capturas,
   en el artículo de la descripción» y la pantalla final de SonorBooks (marca arriba; la mitad de abajo, libre para la pantalla
   final de YouTube: vídeo + suscribirse).

Sin enlaces de afiliado → **«Incluye promoción pagada»: NO**. Sin venta agresiva: nada de «busca tu libro en SonorBooks»; solo
«para comparar plataformas, SonorBooks» al final. Para no caer en «contenido reutilizado», cada vídeo tiene su entrada, su
cierre, su música y sus etiquetas; lo común (las tiendas) es visual y breve.

## Cómo se hizo

- **Remotion** (`video/src/scenes/cnl/`, composiciones `CNLAudible`, `CNLStorytel`, `CNLSpotify`, `CNLPodimo`, `CNLNextory`,
  `CNLBookBeat`, `CNLAudiobooks`, `CNLiVoox`; miniaturas `CNL*Thumb`). Los vídeos salen del guion común X01–X12 (la versión
  combinada `CNLGuide` sigue en el repositorio, sin entregar) con entrada y cierre propios (`videos.json`, `videos.ts`, `Video.tsx`).
- **Tomas:** grabaciones de OBS de BlueStacks del 26/10 cortadas y tapadas con `tools/cnl_clips.py` (nombre, correo, avatar,
  tarjeta), comprobadas con OCR cada 0,5 s (`tools/cnl_pii.py`) y a ojo; capturas web tapadas con `tools/cnl_web.py`. Las capturas
  sin tapar se quedaron fuera del repositorio. iVoox: la toma de la baja se corta antes de volver a Ajustes (salía el nombre).
- **Voz:** ElevenLabs, «Martin Osborne», `eleven_v4`, velocidad 1,13. Comprobada con Whisper; la frase del cierre de Audible se
  regrabó («Y si contrataste Audible con Amazon…»: antes se oía «te viste de alta»). Whisper sobre la mezcla final de cada vídeo
  (`tools/cnl_qa_mix.py`): del 95 al 100 % de las palabras; lo que «falta» son grafías de marcas («Sonor Books», «NextStory»).
- **Música:** piezas ya compuestas para el canal, una por vídeo, y el final de «i_rutas» en el cierre (`tools/cnl_music.py`).
- **Render** a 2560×1440 por tramos (`tools/render_chunks.sh`) y máster a −14 LUFS (`tools/master.sh`).
- **Textos y subtítulos:** `tools/cnl_videos.py` (las cifras en número en los subtítulos; sin capítulos, porque YouTube pide tres
  de 10 s).

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
