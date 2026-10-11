# YouTube — El Libro Total (reseña)

## Archivo que hay que subir
**`deliverables/el-libro-total/SonorBooks_ElLibroTotal_Resena_MASTER_1440p.mp4`** (2560×1440, 50 fps).
- Al subirlo en 1440p, YouTube lo procesa con un códec de más calidad (VP9/AV1) y le da más bitrate, también a quien lo ve en 1080p.
- Está guardado con Git LFS. Descárgalo desde GitHub con el botón de descarga del archivo.
- `SonorBooks_ElLibroTotal_Resena_FINAL_1080p.mp4` es la versión ligera, de unos 95 MB, para compartir o revisar.

## Título (elige uno)
1. **El Libro Total: 6.698 audiolibros GRATIS… ¿dónde está la trampa?** ← recomendado
2. La biblioteca GRATIS con miles de audiolibros que casi nadie conoce | El Libro Total
3. El Libro Total: reseña completa (audiolibros gratis, sin anuncios ni registro)

## Descripción

```
📖 La reseña completa, con todas las fuentes: https://sonorbooks.com/blog/el-libro-total

«Crimen y castigo» cuesta 18,99 € en Audible. En El Libro Total, 0 €, y como él hay 6.698 audiolibros más. Sin anuncios, sin suscripción y sin registro. Hemos probado El Libro Total a fondo: cómo funciona, quién narra, qué tal suena, lo mejor, lo peor y si de verdad merece la pena.

⏱️ Capítulos
0:00 6.698 audiolibros gratis… ¿dónde está la trampa?
0:23 Lo que hemos probado
0:36 ¿Qué es El Libro Total?
0:55 El catálogo de audio, en datos
1:22 Cómo se usa: buscar, leer y escuchar
1:49 Las voces y la calidad del audio
2:13 Diccionarios, lectura comparada y vocabulario
2:30 Cuenta, app y modo sin conexión
2:48 Lo mejor y lo peor
3:09 ¿Para quién es? Precio
3:25 Veredicto: nuestra nota

🔎 ¿Dónde escuchar cualquier audiolibro y a qué precio? Búscalo en SonorBooks: comparamos narraciones, precios y condiciones de las principales plataformas, gratis y sin registro → https://sonorbooks.com

📌 Datos del vídeo (10/10/2026)
• Audiolibros: 6.698 (contador de la web)
• Precio: gratis, sin anuncios ni suscripción
• Registro: opcional
• Voces: humanas (p. ej., Hernando Iván Cano en «Crimen y castigo»)
• Audio sin conexión: no (solo texto EPUB/PDF)
• Nota SonorBooks: 8,2/10

El Libro Total: https://www.ellibrototal.com
SonorBooks no tiene relación comercial con El Libro Total. Las capturas y el fragmento de audio de El Libro Total se usan con fines de reseña y crítica.
Música original compuesta para SonorBooks.

#audiolibros #ellibrototal #audiolibrosgratis #libros #sonorbooks
```

## Etiquetas
El Libro Total, el libro total audiolibros, audiolibros gratis, audiolibros en español, biblioteca digital gratis, libros gratis, app audiolibros gratis, el libro total opiniones, el libro total app, como usar el libro total, audiolibros clásicos, crimen y castigo audiolibro, alternativas a audible gratis, sonorbooks

## Comentario fijado
```
¿Conocías El Libro Total? 👇 Cuéntanos qué plataforma de audiolibros usas y la analizamos en el próximo vídeo.
Reseña completa (con capturas y fuentes): https://sonorbooks.com/blog/el-libro-total
```

## Pantalla final (últimos 6 s del vídeo)
- Elemento «Vídeo»: la última subida o la mejor para el espectador.
- Elemento «Suscribirse».
- El bloque de marca ocupa el tercio superior del cierre. La mitad inferior queda libre para estos dos elementos.

## Miniatura
`deliverables/el-libro-total/miniatura_youtube.jpg` (1280×720). Es la misma imagen que la portada del artículo del blog:
- Fondo amarillo de marca, logo de SonorBooks y «6.698 audiolibros GRATIS».
- El logo de El Libro Total, en grande y en vectorial, sobre el lector con el texto resaltado.
- Una píldora de audio y la pegatina «¿Dónde está la trampa?», fuera de la esquina donde YouTube pone la duración.

Otros tamaños: `portada_blog_1920x1080.jpg` y `portada_og_1200x630.jpg`. Se generan con `npx remotion still src/index.ts ELTCover|ELTCover1080|ELTCoverOG`.

## Test A/B de miniaturas
Tres variantes, todas a 1280×720 y con la esquina de la duración libre. Comparativa a tamaño real del feed: `deliverables/el-libro-total/miniaturas_test_AB_comparativa.png`.

| | Archivo | Idea | Por qué puede ganar |
|---|---|---|---|
| **A** | `miniatura_youtube.jpg` | La actual: amarillo de marca, «6.698 audiolibros GRATIS» y el logo de El Libro Total. | Promesa clara y reconocible. Es la referencia (control). |
| **B** | `miniatura_youtube_B_estafa.jpg` | «¿ESTAFA?» enorme sobre fondo oscuro con el muro de portadas y una lupa sobre el logo. | Curiosidad y contraste: destaca en un feed lleno de miniaturas claras. |
| **C** | `miniatura_youtube_C_mismo_libro.jpg` | «MISMO LIBRO»: «Crimen y castigo» a 18,99 € (en Audible) frente a 0 € en El Libro Total, «y es legal». | Un ahorro concreto y visual, que se entiende en un segundo. Es nuestra apuesta. |

**Cómo lanzarlo:**
1. En YouTube Studio, abre el vídeo y, en «Miniatura», elige **«Probar y comparar»**.
2. Sube las tres (A, B y C).
3. YouTube reparte las impresiones entre ellas y elige la ganadora por **cuota de tiempo de visualización**, no solo por clics.
4. Déjalo correr hasta que dé un resultado (suele tardar de unos días a dos semanas).

El título actual («El Libro Total: 6.698 audiolibros GRATIS… ¿dónde está la trampa?») encaja con las tres. El vídeo responde la pregunta de la B en 3:25: «¿Dónde está la trampa? No la hay».

Se generan con `npx remotion still src/index.ts ELTCoverB` y `ELTCoverC` (versiones a 1920×1080: `ELTCoverB1080` y `ELTCoverC1080`).
