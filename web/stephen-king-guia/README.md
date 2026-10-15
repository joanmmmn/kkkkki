# «Stephen King: por dónde y cómo empezar a leer» — página nueva para el blog de sonorbooks.com

Artículo que acompaña al vídeo del mismo título del canal SonorBooks España (primer episodio de «Por dónde y cómo empezar
a leer»). La descripción del vídeo enlaza aquí.

- **URL prevista:** https://sonorbooks.com/es/blog/por-donde-empezar-a-leer-stephen-king/ (página nueva; no sustituye a ninguna).
- **No está publicada.** Va al blog privado para la próxima actualización; antes de subirla a producción tiene que aprobarla Joan.
- **Enlaces:** cada libro lleva a su ficha de SonorBooks («Ver dónde escucharlo» y los títulos). Son enlaces internos: la
  afiliación, si la hay, está en la propia ficha. La página no usa la ruta `/salir/`. Todos devolvían 200 el 15/10/2026.
- **Texto de referencia:** `blog/autores/stephen-king/por-donde-empezar-a-leer-stephen-king.md` (para el CMS, redes y resúmenes).

## Qué lleva
1. Portada de noche sobre la biblioteca 3D del vídeo (arte propio, `art/biblioteca.jpg`), con el H1 y la entradilla. Sin
   etiqueta, sin firma, sin botones y sin fecha bajo el título.
2. «La respuesta corta» (la respuesta citable: cinco puertas, poco tiempo, para después y el orden).
3. El vídeo (se carga al pulsar, con youtube-nocookie; sin ID enlaza al canal).
4. «¿Por dónde empiezo yo?»: elector accesible (gusto × tiempo, botones de radio) que devuelve un libro, su portada,
   narrador, duración y días a una hora al día, con enlace a la ficha. Sin JavaScript muestra *El resplandor* y la tabla
   completa en «Ver todas las combinaciones».
5. Quién es (tres cifras y dos párrafos), qué escribe (cinco territorios y tres películas), «Cuánto dura cada uno»
   (gráfico de barras en HTML: rojo, para empezar; azul, mejor para después; colores comprobados para daltonismo).
6. Las cinco puertas (portada, sinopsis, por qué empezar aquí, miedo bajo/medio/alto, duración, narrador y ficha).
7. Si tienes poco tiempo (*Carrie* con sus dos versiones, *Elevación*, *Después*) y Mejor para después (*It*,
   *Apocalipsis* y *La Torre Oscura*, con barra de los siete libros proporcional a su duración).
8. Todo está conectado, ¿Hay que leer a Stephen King en orden?, Escuchar a King en audiolibro (40 obras, 725 h),
   Tu ruta (tres líneas de metro), Sigue leyendo y «Cómo lo comprobamos» con fuentes y fechas visibles.

Sin índice lateral, sin preguntas frecuentes y sin cookies ni almacenamiento. Respeta «reducir movimiento».
JSON-LD: BlogPosting (fechas de publicación y actualización, visibles al final), ItemList (las cinco puertas, con la URL
de su ficha), BreadcrumbList y, con `--yt`, VideoObject (7:45).

**Portadas:** las de las ediciones en audio de cada ficha, servidas por la API de portadas de SonorBooks
(`/api/v1/editions/<edición>/cover?w=480`), solo para identificar la edición, como en las fichas. En el vídeo no se usaron
portadas reales; en la web sí, igual que en el resto del sitio.

## Construir
```bash
python3 web/stephen-king-guia/build.py                                # sin vídeo: el enlace del vídeo lleva al canal
python3 web/stephen-king-guia/build.py --yt ID --yt-fecha AAAA-MM-DD  # al publicar el vídeo
```
- `dist/es/blog/por-donde-empezar-a-leer-stephen-king/index.html` y `dist/assets/blog/stephen-king-guia/{sk.css, sk.js, media/…}` → producción.
- `preview/` → vista previa privada (una página con CSS y JS en línea y enlaces absolutos a sonorbooks.com).

Los datos de cada audiolibro (narrador, duración, ficha y edición de la portada) están en `build.py`, comprobados en las
fichas el 15/10/2026. Si cambia una ficha, se cambia ahí y se vuelve a construir. Si falta una portada en `media/`,
`build.py` la descarga de la API de portadas.

## Para Codex al integrarla
- Añadirla al índice del blog (categoría «Qué escuchar») y al sitemap con `lastmod` 2026-10-15.
- Comprobar que `/assets/blog/stephen-king-guia/` se sirve con caché larga (los archivos llevan `?v=`).
- Hay fichas duplicadas de algunos libros (*Mr. Mercedes*, *El pistolero*, *Fin de guardia*, varios de *La Torre Oscura*):
  la página enlaza a una de cada; conviene revisar las duplicadas con canonical a la principal.
- Cuando el vídeo esté en YouTube, reconstruir con `--yt ID --yt-fecha` y subir el `index.html` nuevo.
