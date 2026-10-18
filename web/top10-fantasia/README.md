# «Los 10 mejores libros de fantasía: historias de las que no vas a querer salir»: página nueva para el blog de sonorbooks.com

Es el artículo que acompaña al vídeo «Los 10 mejores · Fantasía» del canal SonorBooks España. El vídeo lo menciona («la lista completa, en nuestro blog») y la descripción enlaza aquí.

- **URL prevista:** https://sonorbooks.com/es/blog/mejores-libros-de-fantasia/. Es una página nueva y no sustituye a ninguna.
- **No está publicada.** Va al blog privado para la próxima actualización, y antes de subirla a producción tiene que aprobarla Joan.
- **Enlaces:** cada historia lleva a su ficha de SonorBooks («Ver dónde escucharlo»). Son enlaces internos: la afiliación, si la hay, está en la propia ficha. La página no usa la ruta `/salir/`.
- **Fichas:** las diez comprobadas el 18/10 (22:00) y puestas en `FICHAS` (`build.py`). Para «El nombre del viento» se usa la ficha con la prueba de Audiobooks.com (la otra no tiene un acceso confirmado).

## Qué lleva
- **Portada:** noche índigo con aurora violeta (sin movimiento con `prefers-reduced-motion`) y las portadas reales de las diez ediciones recomendadas (Audible España).
- **El vídeo:** se carga al pulsar, con youtube-nocookie.
- **«Cómo las elegimos».**
- **Las diez, del 10 al 1.** De cada una:
  - sinopsis y un dato comprobado (ver `research/top10/fantasia/guion.md`);
  - la narración: narrador, sello y año, duración, voz, nota con su número de valoraciones, su base (narración o audiolibro) y su fuente;
  - dónde está.
- **«Las que se quedaron fuera (y por qué)».**
- **«Cómo escucharlas»,** con cómo empezarlas gratis.
- **«Cómo lo comprobamos»,** con las fuentes.

No lleva índice lateral, preguntas frecuentes ni firma. El JSON-LD incluye Article, ItemList (las diez, con la URL de su ficha), BreadcrumbList y, con `--yt`, VideoObject.

## Construir
```bash
python3 web/top10-fantasia/build.py                               # sin vídeo: el enlace del vídeo lleva al canal
python3 web/top10-fantasia/build.py --yt ID --yt-fecha AAAA-MM-DD   # al publicar el vídeo
web/top10-fantasia/og/render.sh                                   # solo si cambian las portadas: redibuja og-source.png y poster-source.png
```
- Para producción: `dist/es/blog/mejores-libros-de-fantasia/index.html` y `dist/assets/blog/top10-fantasia/{t10f.css, t10f.js, media/…}`.
- `preview/` es la vista previa privada: una página con el CSS y el JS en línea.
- **Imagen para redes:** sale de `og-source.png`.
- **Póster del vídeo:** sale de `deliverables/top10/fantasia/miniatura_A.png` cuando exista. Mientras tanto, de `poster-source.png`.

Los datos de las diez están en `build.py`: son los mismos del vídeo (`video/src/scenes/t10f/kit.tsx`) y del artículo `blog/top10/fantasia/mejores-libros-de-fantasia.md`. Si cambia una nota o una plataforma, se cambia ahí y se vuelve a construir.
