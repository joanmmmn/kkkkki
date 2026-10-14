# Miniaturas v2 de la reseña de Audible

Con los dos estilos de las propuestas de miniaturas del 14/10 (`claude/publicacion-youtube.md`), para «Probar y comparar»
de YouTube Studio junto a la miniatura de la entrega (`deliverables/audible/resena/miniatura_resena.png`):

- **A · `miniatura_resena_A.png`:** «¿TODO INCLUIDO?» (la pregunta que responde el vídeo: Premium no lo incluye todo) con el
  icono con cascos de la serie. `a_base.png` es la imagen de la propuesta A de Storytel con el círculo pasado al naranja de
  Audible (#F7991C) y la burbuja de Storytel borrada de la cara del icono (OpenCV, `inpaint`); encima va el símbolo de Audible.
- **B · `miniatura_resena_B.png`:** «30 DÍAS GRATIS · DE AUDIBLE PREMIUM», con el logotipo y el móvil con la portada de la app.
  No se pone «con nuestro enlace» (como en la de Nextory): la prueba de 30 días es también la estándar de Audible.

Se rehacen con `node shot.mjs "$(pwd)" a b` desde esta carpeta (Playwright con Chromium; fuentes Anton e Inter de Google Fonts)
y se copian a `deliverables/audible/resena/` con esos nombres.
