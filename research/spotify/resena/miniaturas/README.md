# Miniaturas A y B de la reseña de los audiolibros de Spotify

Con los dos estilos de las miniaturas A/B de la serie (los de BookBeat y Audible), para «Probar y comparar» de YouTube Studio
junto a la miniatura de la entrega (`deliverables/spotify/resena/miniatura_resena.png`, composición `SPOThumb`):

- **A · `miniatura_resena_A.png`:** «¿BASTAN 12 HORAS?», la pregunta que responde el vídeo (Premium incluye 12 horas de
  audiolibros al mes), con el icono con cascos de la serie. `a_base.png` es la base de la de Audible
  (`research/audible/resena/miniaturas-v2/a_base.png`) con el círculo pasado al verde de Spotify (#1ED760) con `recolor.py`;
  encima va el icono de Spotify (`video/public/spo/img/spotify_icon_green.svg`).
- **B · `miniatura_resena_B.png`:** «12 HORAS AL MES · INCLUIDAS EN PREMIUM», con el logotipo y el móvil con la sección
  Audiolibros real de la app (captura de la prueba del 15/10/2026, `web/spotify-audiolibros-resena/media/spotify-audiolibros.webp`,
  sin datos personales). Spotify no tiene enlace de afiliado: ninguna de las dos anuncia una prueba ni una oferta.

Se rehacen con `python3 recolor.py` y `node shot.mjs "$(pwd)" a b` desde esta carpeta (Playwright con Chromium; fuentes Anton
e Inter de Google Fonts) y se copian a `deliverables/spotify/resena/` con esos nombres.
