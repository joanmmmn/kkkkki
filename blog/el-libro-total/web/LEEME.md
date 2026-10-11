# Artículo visual · El Libro Total

Contenido de esta carpeta:

| Archivo | Para qué sirve |
|---|---|
| `vista-previa.html` | Ábrelo en el navegador para ver el artículo tal y como quedará. Es un único archivo con todo incrustado. |
| `articulo.html` | El fragmento que hay que pegar en la web: estilos, contenido, animaciones y datos estructurados. |
| `index.html` | El mismo artículo como página completa, con `<head>`, SEO y Open Graph, por si prefieres publicarlo como página independiente. |
| `media/` | Imágenes WebP, clips en bucle (MP4 + WebM), muestra de audio y portada. |

## Cómo ponerlo en la web

1. **Sube la carpeta `media/`** al servidor, por ejemplo a `/es/blog/el-libro-total/media/`.
2. **Pega `articulo.html`** en el cuerpo de la entrada (bloque HTML personalizado del CMS).
   - Si `media/` no queda junto al artículo, busca y reemplaza `media/` por la ruta real, por ejemplo `/es/blog/el-libro-total/media/`.
3. **Vídeo de YouTube:** busca `PENDIENTE` y pon el ID del vídeo en `data-youtube-id`.
   - El reproductor solo se carga al pulsar, así que la página no pierde velocidad.
   - Mientras falte el ID, al pulsar aparece «El vídeo estará disponible muy pronto».
4. **Portada y redes:**
   - Portada del artículo: `media/portada.webp` (1920×1080).
   - Imagen para compartir (Open Graph): `media/portada-og.jpg` (1200×630).
   - Las mismas imágenes en JPG, junto con la miniatura de YouTube, están en `deliverables/el-libro-total/`.
5. **SEO:**
   - Título y meta descripción: en el `<head>` de `index.html`.
   - Los datos estructurados (Review y FAQPage) van al final de `articulo.html`; puedes moverlos al campo de *schema* del CMS.

## Notas técnicas

- **Estilos aislados** bajo `.sbx`: usa las fuentes de la web (Ubuntu y Merriweather) y no afecta al resto de la página.
- **Animaciones** al hacer scroll: contadores, barras, anillos y marcos amarillos sincronizados con los clips, como en el vídeo.
  - Los clips solo se reproducen mientras se ven.
  - Si alguien tiene activado «reducir movimiento» en su sistema, todo aparece sin animar.
- **Sin JavaScript** se ve todo el contenido, solo que sin animaciones.
- **Diseño adaptable**, probado a 1440 px y a 390 px: sin scroll horizontal y con las tablas desplazables dentro de su caja.
- **Peso total:** unos 3 MB.
  - Los clips usan `preload="none"`: no se descargan hasta que entran en pantalla.
  - Las imágenes llevan `loading="lazy"`.
- **Para regenerar:**
  - Recursos: `tools/blog_media.sh`.
  - `index.html` y la vista previa: `python3 tools/build_blog.py`.
