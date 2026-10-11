# SonorBooks · Reseñas de plataformas de audiolibros

Producción de las reseñas en vídeo (YouTube 16:9 + vertical 9:16) y de los artículos del blog de [sonorbooks.com](https://sonorbooks.com).

Episodio 1: **El Libro Total**. Tutorial 1: **30 días gratis de Nextory desde SonorBooks** (`research/nextory/guion.md`).

## Estructura

```
research/<plataforma>/   Investigación: dossier con fuentes, informe de primera mano, FAQ oficial, guion
captures/<plataforma>/   Guiones de grabación de pantalla (JSON para tools/record.mjs)
assets/<plataforma>/     Capturas 4K, muestras de audio y material de terceros
blog/<plataforma>/       Artículo del blog (Markdown + JSON-LD), imágenes webp y textos de YouTube
video/                   Proyecto Remotion (sistema de diseño SonorBooks + escenas de cada episodio)
tools/                   Grabador de pantalla, generador de locución y control de calidad
```

## Flujo de producción

1. **Investigación:** el dossier con fuentes y la prueba de primera mano van en `research/`.
2. **Guion:** `research/<plataforma>/guion.md`. Objetivo ≤ 4 min: cada frase aporta un dato útil o se elimina.
3. **Grabaciones de pantalla en 4K** con cursor sincronizado:
   ```bash
   node tools/record.mjs captures/el-libro-total/01_home.json video/public/elt/rec/01_home
   ```
   - El navegador se graba en cámara lenta (`slowmo: 3` → ~90 fps efectivos) y luego se acelera, así los scrolls salen perfectamente suaves.
   - Para escenas con audio de la página usa `slowmo: 1`.
   - Genera `video.mp4` (3840×2160 a 50 fps), `cursor.json` (Remotion dibuja el cursor de marca), `meta.json` (marcas de tiempo y eventos de audio) y `last.jpg`.
   - `{"fakeClick": true}` anima el clic sin pulsar: para formularios de terceros que no deben enviarse.
   - Pantallas con sesión iniciada (p. ej. el alta en Nextory): se captura su `<main>` en el navegador de Joan y `tools/nxpage.mjs` las reconstruye en 4K sobre una página pública con el mismo CSS. Los guiones de grabación se generan con `node captures/nextory/gen.mjs`.
4. **Locución (ElevenLabs):** voz «Martin Osborne – Polished and Energetic» (`D7dkYvH17OKLgp4SLulf`), modelo `eleven_v4` y `speed` 1,13. La configuración está en `video/public/elt/vo2/vo.json`.
   ```bash
   python3 tools/tts.py video/public/elt/vo/vo.json video/public/elt/vo [--only E01,E02]
   python3 tools/qa_vo.py video/public/elt/vo E01 E02   # Whisper: comprueba la pronunciación
   ```
   - Hay caché por texto: solo se regeneran (y solo gastan créditos) las escenas cuyo texto cambia.
   - Las marcas de tiempo por palabra sincronizan las animaciones (`wordFrame()` en `video/src/lib/vo.ts`).
   - La clave se lee de `ELEVENLABS_API_KEY` o de `.secrets/elevenlabs.env` (ignorado por git).
5. **Efectos y música:**
   - Efectos de ElevenLabs Sound Effects en `video/public/sfx/`, generados con `python3 tools/sfx.py`. El script recorta el silencio inicial y normaliza el pico de cada archivo a −1 dBFS.
   - En `<Sfx>` (`video/src/components/Sfx.tsx`), `GAIN` iguala la sonoridad de cada efecto y `SYNC` hace que su golpe caiga justo en el fotograma indicado.
   - La música original es de ElevenLabs Music, compuesta con un *composition plan* cuyas secciones duran lo mismo que las escenas (`video/public/music/elt_bed3.plan.json`). Para componer: `python3 tools/music.py <plan.json> <salida.mp3>`.
   - La mezcla aplica a la música una ecualización que deja hueco a la voz (−2,5 dB en 2,2 kHz) y la baja bajo la locución (ataque 0,15 s, liberación 0,35 s), más todavía bajo el audio original.
   - Para revisar la mezcla por capas: `--props='{"audioOnly":true,"stem":"vo"}'`; el stem puede ser `vo`, `music` o `sfx`.
   - Los marcos de foco sobre las grabaciones usan rectángulos medidos en el DOM con `node tools/measure.mjs '<pasos>'`, en píxeles CSS de un viewport de 1920×1080.
6. **Montaje en Remotion** (`video/`):
   ```bash
   cd video
   npx remotion studio src/index.ts                                   # editor visual
   node preview.mjs ELTReview2 out/sheet.png 100,500,900               # hoja de contactos rápida
   npx remotion render src/index.ts ELTReview2 out/elt/ELT_review.mp4 --crf 16 --audio-bitrate 320k
   npx remotion render src/index.ts ELTShort2 out/elt/ELT_short.mp4 --crf 18 --concurrency 2
   npx remotion still src/index.ts ELTThumbnail out/elt/thumbnail.png
   # Tutorial de Nextory (con 2 núcleos, limitar la caché de vídeo evita que el compositor se quede sin memoria):
   npx remotion render src/index.ts NXTutorial out/nx/NX_tutorial_raw.mp4 --crf=16 --audio-bitrate=320k --concurrency=2 --offthreadvideo-cache-size-in-bytes=700000000
   npx remotion render src/index.ts NXShort out/nx/NX_short_raw.mp4 --crf=18 --audio-bitrate=320k --concurrency=2 --offthreadvideo-cache-size-in-bytes=700000000
   npx remotion still src/index.ts NXThumb out/nx/miniatura.png
   ```

## Sistema de diseño (del anuncio V7)

- **Tipografías:** Ubuntu (300/400/500/700) y EB Garamond cursiva para las citas.
- **Colores:** amarillo `#FFCA05`, tinta `#101010`, fondo blanco y escenario «noche» `#3A3D42` para los ganchos.
- **Componentes:**
  - subrayado de rotulador (`Highlight`), tarjetas con sombra suave (`Card`), texto palabra a palabra (`Words`);
  - ventana de navegador con zooms de cámara (`BrowserWindow` + `ScreenClip`) y marcos de foco que se dibujan en pantalla con foco suave, etiqueta y deslizamiento entre elementos;
  - fondo vivo (`Stage`), transiciones entre escenas con deriva lenta de cámara (`SceneShell`) y filas que se recentran al aparecer cada elemento (`Grow`);
  - cursor con onda amarilla (`Cursor`), teléfono (`Phone`), contadores (`Stat`), etiquetas (`Callout`);
  - cierre de marca: «Tu próxima historia te está esperando.» + `sonorbooks.com`.
