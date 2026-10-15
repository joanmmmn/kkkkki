# Capturas de spotify.com para el vídeo (15/10/2026)

Capturas fijas con Playwright (Chromium, 1920×1080 a 2x → 3840×2160, `locale: es-ES`), sin iniciar sesión ni aceptar cookies
(aviso de idioma cerrado). Están en `video/public/spo/web/` (JPEG al 93 %) y el vídeo las anima con `WebShot` (cámara, marcos y
cursor en Remotion, `video/src/scenes/spo/kit.tsx`):

| Archivo | Página | Qué se ve |
|---|---|---|
| `planes.jpg` | https://www.spotify.com/es/premium/ | Tarjetas Individual («0 € durante 1 mes», 11,99 €, 12 h), Estudiantes, Duo y Familiar |
| `planes_familiar.jpg` | https://www.spotify.com/es/premium/ | Tarjeta Familiar (20,99 €) y el pie |
| `ab_hero.jpg` | https://www.spotify.com/es/audiobooks/ | Cabecera de los audiolibros y su letra pequeña |
| `ab_acceso.jpg` | https://www.spotify.com/es/audiobooks/ | «Cómo acceder…» con «Tengo mi propio plan Premium» abierto |
| `ab_plus.jpg` | https://www.spotify.com/es/audiobooks/ | Audiolibros+ (15 h, 8,99 €, 1 mes gratis) y su letra pequeña |
| `cancelar.jpg` | https://support.spotify.com/es/article/cancel-premium/ | «Cómo cancelar planes Premium» |

Las grabaciones con `tools/record.mjs` (vídeo a 4K) se descartaron: la portada de Spotify (carrusel de vídeo y animaciones) saturaba
el contenedor y los desplazamientos no seguían el guion.
