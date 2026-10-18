#!/usr/bin/env python3
"""Textos de YouTube de «Las mejores plataformas de audiolibros en español» (título, descripción con capítulos, etiquetas
y comentario fijado). Los capítulos salen de tools/mp_meta.py (locución real si existe; si no, estimados).

Uso: python3 tools/mp_youtube.py [--spotify ID]   → deliverables/mejores-plataformas/youtube.md y descripcion_youtube.txt
La reseña de Spotify aún no está en YouTube (18/10): con --spotify ID entra en la lista de reseñas; sin él, se queda fuera y
youtube.md lo avisa (la voz dice «Las once tienen su reseña en el canal»: conviene publicarla antes que este vídeo).
"""
import argparse, os, sys

sys.path.insert(0, os.path.dirname(__file__))
import mp_meta  # noqa: E402

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
OUT = os.path.join(ROOT, 'deliverables/mejores-plataformas')

TITULO = 'Las Mejores Plataformas de Audiolibros en Español (2026): Comparativa, Precios, Trucos y Cuál Elegir'
ALTERNATIVOS = [
    'Mejores Apps de Audiolibros en Español 2026: Comparativa Definitiva, Precios, Trucos y Cuál Elegir',
    'Las Mejores Plataformas de Audiolibros en 2026: Audible, Storytel, Spotify y 8 más | Comparativa',
]
ARTICULO = 'https://sonorbooks.com/es/blog/mejores-plataformas-audiolibros/'
LINKS = [
    ('Audible (30 días; 90 con Amazon Prime)', 'https://sonorbooks.com/salir/audible/?market=ES&language=es&to=https%3A%2F%2Fwww.audible.es%2Fep%2Fprueba-gratis'),
    ('Nextory (30 días desde SonorBooks, hasta 15 h)', 'https://sonorbooks.com/salir/nextory/?market=ES&language=es&to=https%3A%2F%2Fnextory.com%2Fes'),
    ('Podimo (30 días)', 'https://sonorbooks.com/salir/podimo/?market=ES&language=es&to=https%3A%2F%2Fpodimo.com%2Fes'),
    ('ElevenReader (30 días de Ultra)', 'https://sonorbooks.com/salir/elevenreader/?market=ES&language=es&to=https%3A%2F%2Felevenreader.io%2F'),
    ('Audiobooks.com (30 días con 3 audiolibros)', 'https://sonorbooks.com/salir/audiobooks/?market=ES&language=es&to=https%3A%2F%2Fwww.audiobooks.com%2F'),
]
DIRECTOS = [
    ('Storytel (7 días)', 'https://www.storytel.com/es/subscriptions'),
    ('BookBeat (30 días, 20 h)', 'https://www.bookbeat.com/es'),
    ('Spotify (audiolibros)', 'https://www.spotify.com/es/audiobooks/'),
    ('eBiblio', 'https://ebiblio.es'),
    ('LibriVox', 'https://librivox.org'),
    ('El Libro Total', 'https://www.ellibrototal.com'),
]
RESENAS = [
    ('Audible', 'https://youtu.be/nnRXlXi2rCk'), ('Storytel', 'https://youtu.be/nPBV7b4Vowc'), ('Nextory', 'https://youtu.be/x9dF1JRrej0'),
    ('Podimo', 'https://youtu.be/dy4RVorr39o'), ('BookBeat', 'https://youtu.be/GpNFV9wZ-BM'), ('Audiobooks.com', 'https://youtu.be/cif771omGrQ'),
    ('ElevenReader', 'https://youtu.be/yHu33tVU5XU'), ('LibriVox', 'https://youtu.be/Z6ehA2HmhWU'), ('eBiblio', 'https://youtu.be/c8tJBNWibnc'),
    ('El Libro Total', 'https://youtu.be/J0pkSx30dMM'),
]
ETIQUETAS = [
    'mejores plataformas de audiolibros', 'mejores apps de audiolibros', 'apps de audiolibros', 'audiolibros en español', 'plataformas de audiolibros',
    'comparativa audiolibros', 'audible vs storytel', 'audible', 'storytel', 'podimo', 'nextory', 'bookbeat', 'spotify audiolibros', 'audiobooks.com',
    'elevenreader', 'ebiblio', 'librivox', 'el libro total', 'audiolibros gratis', 'audiolibros gratis legal', 'mejor app de audiolibros 2026', 'sonorbooks',
]


def capitulos():
    scenes, total, chapters = mp_meta.review_scenes()
    start = {s['id']: s['at'] for s in scenes}
    bumps = {s['id'] for s in scenes if s.get('bump')}
    out = ['0:00 Las mejores plataformas de audiolibros en español']
    for label, frm in chapters:
        f = start[frm] - (14 if frm in bumps else 0)
        out.append(f'{mp_meta.ts(f / mp_meta.FPS, False)} {label}')
    estimados = any(not mp_meta.vo(s['id']) for s in scenes)
    return out, total, estimados


def descripcion(caps, resenas):
    L = []
    L.append('¿Cuál es la mejor plataforma de audiolibros en español? Hemos reseñado a fondo, una a una, once plataformas, incluida la recién llegada, Spotify: qué ofrece cada una, cuánto cuesta, sus trucos, su letra pequeña y cuál te conviene según cuánto escuchas.')
    L.append('')
    L.append(f'📖 La comparativa entera, con todos los precios y una calculadora de horas: {ARTICULO}')
    L.append('')
    L.append('🎁 Pruebas gratis con los mejores enlaces (de afiliado):')
    for t, u in LINKS:
        L.append(f'• {t}: {u}')
    L.append('Enlaces directos, sin comisión:')
    for t, u in DIRECTOS:
        L.append(f'• {t}: {u}')
    L.append('')
    L.append('⏱️ Capítulos')
    L.extend(caps)
    L.append('')
    L.append('Lo que verás:')
    L.append('• Las cuatro formas de pagar: tarifa plana (Audible, Storytel), por horas (Podimo, Nextory, BookBeat, Spotify), con créditos (Audiobooks.com) y gratis de verdad (eBiblio, LibriVox, El Libro Total).')
    L.append('• Audible: Premium a 9,99 € sin límite, sus Originals con Dolby Atmos, la escucha en el ordenador y el catálogo extendido, que se paga aparte. Truco: si cancelas la prueba el primer día, sigues hasta que acaba.')
    L.append('• Storytel: 8,99 € sin límite, con ebooks; «Leer desde aquí» y la búsqueda dentro del libro. Family con 3 cuentas ≈ 7 € por persona. Ojo: si cancelas en la prueba, pierdes el acceso al momento.')
    L.append('• Podimo: 4,99 € con 20 h y pódcasts exclusivos. Nextory: 10 h, 30 h o sin límite, 4 perfiles y las horas que no gastas se guardan. BookBeat: 20, 50 o 100 h, con horas para cada perfil, pero la app está en inglés.')
    L.append('• Spotify: Premium incluye 12 h de audiolibros al mes desde el 7 de octubre (en Duo y Familiar, solo el titular). Audiolibros+ añade 15 h por 8,99 €.')
    L.append('• Audiobooks.com: un crédito al mes que es tuyo para siempre (14,95 $ ≈ 13 €). ElevenReader: tus PDF y ebooks en audio con voces de IA.')
    L.append('• Gratis: eBiblio (novedades con el carné de la biblioteca), LibriVox (clásicos leídos por voluntarios) y El Libro Total (audiolectura).')
    L.append('• Los 5 trucos: acelerar no ahorra horas, cuándo cancelar, alta en la web y no en la app, encadenar pruebas y buscar tu libro antes de pagar.')
    L.append('')
    L.append('🎧 Las reseñas completas de cada plataforma:')
    L.append(' · '.join(f'{t}: {u}' for t, u in resenas))
    L.append('')
    L.append('🔎 Busca cualquier audiolibro y mira dónde escucharlo, con qué narrador y a qué precio: https://sonorbooks.com/es/')
    L.append('')
    L.append('📌 Datos comprobados el 15 de octubre de 2026 en las webs y apps de cada plataforma (precios en España; pueden cambiar). Las pruebas son para clientes nuevos y algunas tienen tope de horas.')
    L.append('')
    L.append('Enlaces de afiliado: si contratas a través de SonorBooks, podemos recibir una comisión, sin coste para ti. Como afiliado de Amazon, SonorBooks obtiene ingresos por las compras adscritas que cumplen los requisitos aplicables. Las pantallas de cada app se muestran con fines informativos; las marcas son de sus dueños. Música original compuesta para SonorBooks.')
    L.append('')
    L.append('#Audiolibros #Audible #Storytel')
    return '\n'.join(L)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--spotify', help='ID de YouTube de la reseña de Spotify, cuando esté publicada')
    args = ap.parse_args()
    resenas = RESENAS[:5] + [('Spotify', f'https://youtu.be/{args.spotify}')] + RESENAS[5:] if args.spotify else RESENAS
    caps, total, estimados = capitulos()
    desc = descripcion(caps, resenas)
    os.makedirs(OUT, exist_ok=True)
    open(os.path.join(OUT, 'descripcion_youtube.txt'), 'w').write(desc + '\n')
    tags = ', '.join(ETIQUETAS)
    md = [
        '# YouTube · Las mejores plataformas de audiolibros en español',
        '',
        f'Duración: {mp_meta.ts(total / mp_meta.FPS, False)}' + (' (estimada: falta la locución)' if estimados else ''),
        '',
        f'## Título ({len(TITULO)} caracteres)', f'**{TITULO}**', '', 'Alternativas:', *[f'- {t} ({len(t)})' for t in ALTERNATIVOS], '',
        f'## Descripción ({len(desc.encode())} de 5.000 bytes)', '```', desc, '```', '',
        f'## Etiquetas ({len(ETIQUETAS)}; {len(tags)} de 500 caracteres)', '```', tags, '```', '',
        '## Comentario fijado', '```',
        '¿Cuál usas tú, y por qué? 👇 Si escuchas mucho, ¿tarifa plana o por horas?',
        f'La comparativa entera, con la calculadora de horas: {ARTICULO}',
        '```', '',
        '## Al subir',
        '- Canal SonorBooks España. Idioma Español (España). «No, no es contenido creado para niños». Contenido alterado: No. Categoría: Gente y blogs.',
        '- «Incluye promoción pagada»: sí (enlaces de afiliado en la descripción).',
        '- Lista «Reseñas de Plataformas de Audiolibros» (PLR0jixeiLWVE).',
        '- Subtítulos: `mejores_plataformas.es.srt` (Español, España). Miniatura: `miniatura.png`.',
        '- Pantalla final en los últimos ~12 s (la marca va en la mitad de arriba): vídeo + suscribirse.',
        f'- El artículo ({ARTICULO}) tiene que estar publicado antes (pendiente de aprobación).',
        *([] if args.spotify else ['- **Reseña de Spotify:** aún sin publicar, así que no está en la lista de reseñas de la descripción. La voz dice «Las once tienen su reseña en el canal»: publícala antes que este vídeo y regenera con `python3 tools/mp_youtube.py --spotify ID` (o pega a mano `Spotify: https://youtu.be/ID` detrás de BookBeat).']),
    ]
    open(os.path.join(OUT, 'youtube.md'), 'w').write('\n'.join(md) + '\n')
    print(f'OK · descripción {len(desc.encode())} bytes · etiquetas {len(tags)} caracteres' + (' · capítulos ESTIMADOS' if estimados else ''))


if __name__ == '__main__':
    main()
