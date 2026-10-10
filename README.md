# SonorBooks · Reseñas de plataformas de audiolibros

Producción de las reseñas en vídeo (YouTube 16:9 + vertical 9:16) y de los artículos del blog de [sonorbooks.com](https://sonorbooks.com).

Episodio 1: **El Libro Total**.

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
4. **Locución (ElevenLabs):** voz «Martin Osborne – Mature and Polished» (`6xftrpatV0jGmFHxDjUv`), modelo `eleven_multilingual_v2`.
   ```bash
   python3 tools/tts.py video/public/elt/vo/vo.json video/public/elt/vo [--only E01,E02]
   python3 tools/qa_vo.py video/public/elt/vo E01 E02   # Whisper: comprueba la pronunciación
   ```
   - Hay caché por texto: solo se regeneran (y solo gastan créditos) las escenas cuyo texto cambia.
   - Las marcas de tiempo por palabra sincronizan las animaciones (`wordFrame()` en `video/src/lib/vo.ts`).
   - La clave se lee de `ELEVENLABS_API_KEY` o de `.secrets/elevenlabs.env` (ignorado por git).
5. **Efectos y música:** efectos de ElevenLabs Sound Effects en `video/public/sfx/` y música original de ElevenLabs Music en `video/public/music/`. La música baja automáticamente bajo la voz.
6. **Montaje en Remotion** (`video/`):
   ```bash
   cd video
   npx remotion studio src/index.ts                                   # editor visual
   node preview.mjs ELTReview out/sheet.png 100,500,900                # hoja de contactos rápida
   npx remotion render src/index.ts ELTReview out/elt/ELT_review.mp4 --crf 16 --audio-bitrate 320k
   npx remotion render src/index.ts ELTShort out/elt/ELT_short.mp4 --crf 18
   npx remotion still src/index.ts ELTThumbnail out/elt/thumbnail.png
   ```

## Sistema de diseño (del anuncio V7)

- **Tipografías:** Ubuntu (300/400/500/700) y EB Garamond cursiva para las citas.
- **Colores:** amarillo `#FFCA05`, tinta `#101010`, fondo blanco y escenario «noche» `#3A3D42` para los ganchos.
- **Componentes:**
  - subrayado de rotulador (`Highlight`), tarjetas con sombra suave (`Card`), texto palabra a palabra (`Words`);
  - ventana de navegador con zooms de cámara y marcos de foco (`BrowserWindow` + `ScreenClip`);
  - cursor con onda amarilla (`Cursor`), teléfono (`Phone`), contadores (`Stat`), etiquetas (`Callout`);
  - cierre de marca: «Tu próxima historia te está esperando.» + `sonorbooks.com`.
