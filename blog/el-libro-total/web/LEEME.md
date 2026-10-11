# Artículo visual · El Libro Total

Contenido de esta carpeta:

| Archivo | Para qué sirve |
|---|---|
| `vista-previa.html` | Ábrelo en el navegador para ver el artículo tal y como quedará. Es un único archivo con todo incrustado. |
| `articulo.html` | El fragmento que hay que pegar en la web: estilos, contenido, animaciones, interactivos y datos estructurados. |
| `index.html` | El mismo artículo como página completa, con `<head>`, SEO y Open Graph, por si prefieres publicarlo como página independiente. |
| `media/` | Imágenes WebP, clips en bucle (MP4 + WebM), muestra de audio y portada. |

## Cómo está construido para retener

El artículo responde primero y profundiza después, y engancha al lector hasta el final.

1. **Gancho:** «6.698 audiolibros gratis. ¿Dónde está la trampa?», con el precio de Audible tachándose (18,99 € → 0 €).
2. **Respuesta rápida:** nota 8,2, lo que te va a encantar, lo que echarás de menos y para quién es. Quien solo lea esto ya se lleva lo importante.
3. **Vídeo** con los capítulos de YouTube, para quien prefiera verlo.
4. **«¿Dónde está la trampa?» interactivo:** cinco sospechas que se giran al tocarlas (cuatro falsas y una verdadera).
5. **Cifras animadas** y una calculadora: minutos al día y velocidad → cuántos días tardas en escuchar «Crimen y castigo» o «Ana Karenina».
6. **Cómo se usa, en 4 pasos,** con clips reales, marcos amarillos sincronizados y la muestra de audio.
7. **Voces, herramientas, app y precio:** gráficos que se dibujan al llegar.
8. **Test «¿Es para ti?»:** tres preguntas y un resultado con su botón (El Libro Total o SonorBooks).
9. **Nota final**, CTA de búsqueda en SonorBooks y preguntas frecuentes.

Además:
- **Barra fija** con el capítulo actual, los minutos que quedan y una línea de progreso. Al pulsarla se abre el índice.
- **Una frase puente al final de cada sección** que anticipa la siguiente.

## Cómo ponerlo en la web

1. **Sube la carpeta `media/`** al servidor, por ejemplo a `/es/blog/el-libro-total/media/`.
2. **Pega `articulo.html`** en el cuerpo de la entrada (bloque HTML personalizado del CMS).
   - Si `media/` no queda junto al artículo, busca y reemplaza `media/` por la ruta real, por ejemplo `/es/blog/el-libro-total/media/`.
3. **Cabecera fija de la web:** si la web tiene una cabecera que se queda fija arriba, pon su altura en `--sbx-top` (primera línea del `<style>`, por ejemplo `--sbx-top:72px`). Así la barra de progreso aparece justo debajo.
4. **Vídeo de YouTube:** busca `PENDIENTE` y pon el ID del vídeo en `data-youtube-id`.
   - El reproductor solo se carga al pulsar, así que la página no pierde velocidad.
   - Mientras falte el ID, al pulsar aparece «El vídeo estará disponible muy pronto».
5. **Portada y redes:**
   - Portada del artículo: `media/portada.webp` (1920×1080).
   - Imagen para compartir (Open Graph): `media/portada-og.jpg` (1200×630).
   - Las mismas imágenes en JPG, junto con la miniatura de YouTube, están en `deliverables/el-libro-total/`.
6. **SEO:**
   - Título y meta descripción: en el `<head>` de `index.html`.
   - Los datos estructurados (Review y FAQPage) van al final de `articulo.html`; puedes moverlos al campo de *schema* del CMS.

## Notas técnicas

- **Estilos aislados** bajo `.sbx`: usa las fuentes de la web (Ubuntu y Merriweather) y no afecta al resto de la página.
- **Sin dependencias externas:** todo el JavaScript va dentro del fragmento, sin librerías.
- **Animaciones** al hacer scroll: contadores, barras, anillos y marcos amarillos sincronizados con los clips, como en el vídeo.
  - Los clips solo se reproducen mientras se ven.
  - Si alguien tiene activado «reducir movimiento» en su sistema, todo aparece sin animar.
- **Sin JavaScript** se ve todo el contenido:
  - Las sospechas muestran su respuesta.
  - La calculadora muestra el ejemplo de 30 minutos al día.
  - El test muestra las tres recomendaciones posibles.
- **Diseño adaptable**, probado a 1440 px y a 390 px: sin scroll horizontal, sin errores en la consola y con las tablas desplazables dentro de su caja.
- **Peso total:** unos 3 MB.
  - Los clips usan `preload="none"`: no se descargan hasta que entran en pantalla.
  - Las imágenes llevan `loading="lazy"`.
- **Para regenerar:**
  - Recursos: `tools/blog_media.sh`.
  - `index.html` y la vista previa: `python3 tools/build_blog.py`.
