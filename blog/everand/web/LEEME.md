# Artículo visual · Everand (antes Scribd)

Contenido de esta carpeta:

| Archivo | Para qué sirve |
|---|---|
| `vista-previa.html` | Ábrelo en el navegador para ver el artículo tal y como quedará. Es un único archivo con todo incrustado. |
| `articulo.html` | El fragmento que hay que pegar en la web: estilos, contenido, animaciones, interactivos y datos estructurados. |
| `index.html` | El mismo artículo como página completa, con `<head>`, SEO y Open Graph, por si prefieres publicarlo como página independiente. |
| `media/` | Capturas reales de everand.com, de su ayuda y de Google Play (WebP), y la portada. |

## Cómo está construido para retener

El artículo responde primero y profundiza después.

1. **Gancho:** «Everand (antes Scribd): ya no es ilimitado», con «ilimitado» tachándose y «1 libro al mes».
2. **Respuesta rápida:** nota 6,2, lo que te va a gustar, lo que te puede frenar y para quién es.
3. **Vídeo** con los capítulos de YouTube.
4. **Cinco ideas que ya no son verdad:** tarjetas que se giran al tocarlas (falso, a medias, depende).
5. **Desbloqueos con pruebas:** la página de planes, la ayuda oficial («La mayoría») y una rejilla animada de 20.000 frente a 1,5 millones.
6. **Precio:** tabla por países y calculadora de precio por libro frente a Audible y Storytel.
7. **Catálogo en español:** cifras animadas, búsqueda real de García Márquez, «Crimen y castigo» de 2 h frente a 24 h y el crédito de voz sintética.
8. **Prueba gratis y cómo cancelar**, con la captura de la ayuda donde aparece «Everand (o Scribd)».
9. **La app, opiniones** (Google Play España frente a EE. UU.) y el aviso de seguridad.
10. **Test «¿Es para ti?»** y **nota final**, con CTA de búsqueda en SonorBooks y preguntas frecuentes.

Además:
- **Barra fija** con el capítulo actual, los minutos que quedan y una línea de progreso. Al pulsarla se abre el índice.
- **Una frase puente al final de cada sección** que anticipa la siguiente.

## Cómo ponerlo en la web

1. **Sube la carpeta `media/`** al servidor, por ejemplo a `/es/blog/everand/media/`.
2. **Pega `articulo.html`** en el cuerpo de la entrada (bloque HTML personalizado del CMS).
   - Si `media/` no queda junto al artículo, busca y reemplaza `media/` por la ruta real.
3. **Cabecera fija de la web:** pon su altura en `--sbx-top` (primera línea del `<style>`, por ejemplo `--sbx-top:72px`).
4. **Vídeo de YouTube:** busca `PENDIENTE` y pon el ID del vídeo en `data-youtube-id`.
5. **Portada y redes:** `media/portada.webp` (1920×1080) y `media/portada-og.jpg` (1200×630).
6. **SEO:** título y meta descripción en el `<head>` de `index.html`. Los datos estructurados (Review y FAQPage) van al final de `articulo.html`.
7. **Revisa la URL:** el artículo y el vídeo enlazan a `https://sonorbooks.com/blog/everand`. Si la URL final es otra, cámbiala también en la descripción de YouTube.

## Notas técnicas

- **Mismo sistema visual que la reseña de El Libro Total** (estilos aislados bajo `.sbx`, fuentes Ubuntu y Merriweather), sin dependencias externas.
- **Sin JavaScript** se ve todo: las tarjetas muestran su respuesta, la calculadora el ejemplo de 2 libros y el test las tres recomendaciones.
- **Probado a 1440 px y a 390 px:** sin scroll horizontal y sin errores en la consola.
- **Peso:** unos 100 KB de HTML y 1 MB de imágenes (`loading="lazy"`).
- **Para regenerar:** `python3 tools/build_article.py blog/everand/src blog/everand/web sbx-everand` y después `python3 tools/build_blog.py blog/everand/web`.
