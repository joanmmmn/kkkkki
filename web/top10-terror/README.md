# «Los 10 libros de terror que dan miedo de verdad» — página nueva para el blog de sonorbooks.com

Artículo que acompaña al vídeo «Los 10 mejores · Terror» del canal SonorBooks España: el vídeo lo menciona («en nuestro blog
tienes la lista completa») y la descripción enlaza aquí.

- **URL prevista:** https://sonorbooks.com/es/blog/libros-de-terror-que-dan-miedo/ (página nueva; no sustituye a ninguna).
- **No está publicada.** Va al blog privado para la próxima actualización; antes de subirla a producción tiene que aprobarla Joan.
- **Enlaces:** cada libro lleva a su ficha de SonorBooks («Ver dónde escucharlo»). Son enlaces internos: la afiliación, si la
  hay, está en la propia ficha. La página no usa la ruta `/salir/`.

## Qué lleva
Portada de noche con las diez cubiertas tipográficas del vídeo (diseño propio, sin portadas reales) y una linterna que las
recorre (sin movimiento con `prefers-reduced-motion`), el vídeo (se carga al pulsar, con youtube-nocookie), «Cómo los elegimos»,
los diez libros del 10 al 1 (sinopsis breve, un dato comprobado, la narración: narrador, sello y año, duración, voz, nota de la
narración con su número de valoraciones y su fuente, y dónde está), «Clásicos que no puedes escuchar en español», cómo
escucharlos para que den miedo, y «Cómo lo comprobamos» con las fuentes. Sin índice lateral, sin preguntas frecuentes y sin firma.
JSON-LD: Article, ItemList (los diez libros, con la URL de su ficha), BreadcrumbList y, con `--yt`, VideoObject.

## Construir
```bash
python3 web/top10-terror/build.py                         # sin vídeo: el enlace del vídeo lleva al canal
python3 web/top10-terror/build.py --yt ID --yt-fecha AAAA-MM-DD   # al publicar el vídeo
```
- `dist/es/blog/libros-de-terror-que-dan-miedo/index.html` y `dist/assets/blog/top10-terror/{t10.css, t10.js, media/…}` → producción.
- `preview/` → vista previa privada (una página con CSS y JS en línea).

Los datos de los diez libros están en `build.py` (los mismos que el vídeo y que `blog/top10/terror/libros-de-terror-que-dan-miedo.md`).
Si cambia una nota o una plataforma, se cambia ahí y se vuelve a construir.
