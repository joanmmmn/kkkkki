# Miniaturas A y B de la reseña de BookBeat

Con los dos estilos de las propuestas de miniaturas del 14/10 (`claude/publicacion-youtube.md`), para «Probar y comparar» de
YouTube Studio junto a la miniatura de la entrega (`deliverables/bookbeat/resena/miniatura_resena.png`, composición `BKBThumb`):

- **A · `miniatura_resena_A.png`:** «¿PAGAR POR HORAS?», la pregunta que responde el vídeo (BookBeat cobra por horas: 20, 50 o
  100 al mes), con el icono con cascos de la serie. `a_base.png` es la base de la de Audible
  (`research/audible/resena/miniaturas-v2/a_base.png`) con el círculo pasado al lila de BookBeat (#CD96FF) con `recolor.py`;
  encima va la «B» del logotipo de BookBeat.
- **B · `miniatura_resena_B.png`:** «30 DÍAS GRATIS · CON 20 HORAS», con el logotipo y el móvil con la portada real de la app
  (captura de la prueba del 14/10/2026, `web/bookbeat-resena/media/bookbeat-portada.webp`). Es la prueba estándar de BookBeat:
  no hay enlace de afiliado.

Se rehacen con `python3 recolor.py` y `node shot.mjs "$(pwd)" a b` desde esta carpeta (Playwright con Chromium; fuentes Anton
e Inter de Google Fonts) y se copian a `deliverables/bookbeat/resena/` con esos nombres.
