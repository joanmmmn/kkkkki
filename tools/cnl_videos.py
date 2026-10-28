#!/usr/bin/env python3
"""Subtítulos y textos de YouTube de los ocho tutoriales «Cómo cancelar…» (un vídeo por plataforma).

Uso: python3 tools/cnl_videos.py [k ...]
  → deliverables/cancelar-<k>/cancelar_<k>.es.srt, youtube.md y descripcion_youtube.txt

Las escenas repiten las cuentas de video/src/scenes/cnl/videos.ts (las de tools/cnl_music.py); los pasos y las fechas salen de
las guías del blog (web/cancelar/data.py). Son vídeos de menos de un minuto: sin capítulos (YouTube pide tres de 10 s como mínimo)
y solo enlazan a la web de SonorBooks (la afiliación está en la web), así que no llevan «Incluye promoción pagada».
v2 (28/10/2026): empiezan con «Para cancelar la suscripción de X…» y acaban con la promo de las pruebas gratis de SonorBooks.
"""
import importlib.util, json, os, sys

sys.path.insert(0, os.path.dirname(__file__))
import cnl_meta  # noqa: E402
from cnl_music import video_scenes  # noqa: E402

ROOT = cnl_meta.ROOT
FPS = cnl_meta.FPS
spec = importlib.util.spec_from_file_location('data', os.path.join(ROOT, 'web', 'cancelar', 'data.py'))
data = importlib.util.module_from_spec(spec)
spec.loader.exec_module(data)

WEB = 'https://sonorbooks.com'
PROMO = f'{WEB}/es/plataformas/'
# Las reseñas publicadas en el canal (tools/mp_youtube.py; la de iVoox, ri7JcUIrIak).
RESENA = {'audible': 'nnRXlXi2rCk', 'storytel': 'nPBV7b4Vowc', 'spotify': '5dKjJSF9knU', 'podimo': 'dy4RVorr39o', 'nextory': 'x9dF1JRrej0',
          'bookbeat': 'GpNFV9wZ-BM', 'audiobooks': 'cif771omGrQ', 'ivoox': 'ri7JcUIrIak'}
TITULO = {
    'audible': 'Cómo Cancelar Audible (2026): Paso a Paso, Desde la Web, y Qué Pasa con tus Libros',
    'storytel': 'Cómo Cancelar Storytel (2026): Paso a Paso, con una Cancelación Real',
    'spotify': 'Cómo Cancelar Spotify Premium (2026): Paso a Paso, y Ojo con Duo y Familiar',
    'podimo': 'Cómo Cancelar Podimo (2026): Paso a Paso, y Cuándo Pierdes el Acceso',
    'nextory': 'Cómo Cancelar Nextory (2026): Paso a Paso, de la App a la Web',
    'bookbeat': 'Cómo Cancelar BookBeat (2026): Paso a Paso, Aunque Esté en Inglés',
    'audiobooks': 'Cómo Cancelar Audiobooks.com (2026): Paso a Paso, y Qué Pasa con el Libro de la Prueba',
    'ivoox': 'Cómo Cancelar iVoox Premium (2026): en Cuatro Toques, Desde la App',
}
ALT = {
    'audible': 'Cómo Darse de Baja de Audible en 2026 (Desde la Web o Desde Amazon)',
    'storytel': 'Cómo Darse de Baja de Storytel en 2026: la App te Manda a la Web',
    'spotify': 'Cómo Cancelar Spotify Premium y Audiolibros+ en 2026, Paso a Paso',
    'podimo': 'Cómo Darse de Baja de Podimo en 2026, Paso a Paso',
    'nextory': 'Cómo Darse de Baja de Nextory en 2026 (Prueba Gratis Incluida)',
    'bookbeat': 'Cómo Cancelar la Prueba Gratis de BookBeat en 2026, Paso a Paso',
    'audiobooks': 'Cómo Cancelar la Prueba Gratis de Audiobooks.com en 2026',
    'ivoox': 'Cómo Darse de Baja de iVoox Premium en 2026, Paso a Paso',
}
# Lo que se busca: «cancelar X», «dar de baja X», la prueba gratis…
BUSCA = {
    'audible': ['cancelar audible amazon', 'cancelar audible desde la app', 'audible cancelar prueba gratis', 'dar de baja audible amazon'],
    'storytel': ['cancelar storytel prueba gratis', 'storytel cancelar desde la app'],
    'spotify': ['cancelar spotify', 'cancelar spotify premium familiar', 'cancelar spotify duo', 'cancelar audiolibros+ spotify', 'spotify audiolibros'],
    'podimo': ['cancelar podimo prueba gratis', 'podimo plan gratis'],
    'nextory': ['cancelar nextory prueba gratis', 'nextory cancelar desde la app'],
    'bookbeat': ['cancel bookbeat', 'cancelar prueba gratis bookbeat'],
    'audiobooks': ['cancel audiobooks.com', 'cancelar prueba gratis audiobooks.com'],
    'ivoox': ['cancelar ivoox', 'cancelar ivoox plus', 'dar de baja ivoox'],
}
HASH = {'audible': 'Audible', 'storytel': 'Storytel', 'spotify': 'Spotify', 'podimo': 'Podimo', 'nextory': 'Nextory', 'bookbeat': 'BookBeat',
        'audiobooks': 'Audiobooks', 'ivoox': 'iVoox'}
PREGUNTA = {
    'audible': '¿Lo habías contratado con Amazon o en audible.es? 👇',
    'storytel': '¿Te ha salido la misma pantalla en la app? 👇',
    'spotify': '¿Estabas en un plan Duo o Familiar? 👇',
    'podimo': '¿Te ofreció también los tres meses por un euro? 👇',
    'nextory': '¿Te ofreció también los 15 días gratis? 👇',
    'bookbeat': '¿Te ha costado encontrarlo, con todo en inglés? 👇',
    'audiobooks': '¿Preferiste el recordatorio por correo o cancelar del todo? 👇',
    'ivoox': '¿Tenías también apoyos a algún pódcast? 👇',
}


def fmt(x):
    return f'{x:.1f}'.replace('.', ',')


def quick(p, key):
    return next((v for k, v in p['quick'] if k == key), '')


def end_card(v, scenes):
    """Desde cuándo está la pantalla final de SonorBooks (v2: la escena `end`, con la mitad de abajo libre)."""
    end = next(s for s in scenes if s['kind'] == 'end')
    return end['at'] / FPS


def descripcion(k, p, store):
    art = f'{WEB}/es/blog/{p["slug"]}/'
    L = [p['desc'], '', f'📖 Todos los pasos, con las capturas de cada pantalla: {art}',
         f'🎁 ¿Buscas otra? Las mejores pruebas gratis de audiolibros, algunas exclusivas (Nextory, 30 días en vez de 14; ElevenReader Ultra, 30 días): {PROMO}', '']
    L.append('✅ Los pasos')
    L.append(quick(p, 'Pasos'))
    # El resto de la respuesta rápida de la guía (el «ojo», la oferta, qué pierdes…), propia de cada plataforma.
    for a, b in p['quick']:
        if a in ('Dónde', 'Pasos', 'Por la tienda'):
            continue
        L.append(f'⚠️ Ojo: {b}' if a == 'Ojo' else f'• {a}: {b}')
    tienda = p['stores']
    if store:
        tienda += (' En la tienda: Google Play › tu perfil › Pagos y suscripciones › Suscripciones; '
                   'en el iPhone, Ajustes › tu nombre › Suscripciones.')
    L += ['', '🏪 Si pagas por la tienda o por otra empresa', tienda + ' Borrar la app no cancela nada.']
    L += ['', f'🎧 Nuestra reseña de {p["name"]}: https://youtu.be/{RESENA[k]}',
          '🔎 Compara plataformas de audiolibros y busca dónde escuchar cada libro: https://sonorbooks.com/es/', '']
    if k == 'audible':
        L.append(f'📌 Pantallas de nuestra cuenta (cancelada desde la reseña) y pasos de la ayuda oficial de Audible, comprobados el {data.FECHA_TXT}. '
                 'Las pantallas pueden cambiar; si ves otra, dínoslo en los comentarios.')
    else:
        L.append(f'📌 Cancelación real, hecha el {data.FECHA_TXT} en una cuenta nuestra. Las pantallas pueden cambiar; si ves otra, dínoslo en los comentarios.')
    L.append('')
    L.append('En esta descripción no hay enlaces de afiliado; en SonorBooks, algunos sí lo son (se indica en la web). Las pantallas de cada app se muestran con fines informativos; las marcas son de sus dueños. Música original compuesta para SonorBooks.')
    L.append('')
    L.append(f'#Cancelar{HASH[k]} #{HASH[k]} #Audiolibros')
    return '\n'.join(x for i, x in enumerate(L) if x or (i and L[i - 1]))


def etiquetas(k, p):
    n = p['name'].lower()
    base = [f'cancelar {n}', f'como cancelar {n}', f'dar de baja {n}', f'darse de baja de {n}', f'cancelar suscripcion {n}', f'cancelar {n} 2026']
    out = []
    for t in base + BUSCA[k] + [n, 'cancelar suscripcion', 'audiolibros', 'apps de audiolibros', 'sonorbooks']:
        if t not in out and len(', '.join(out + [t])) <= 480:
            out.append(t)
    return out


def main():
    cfg = json.load(open(os.path.join(cnl_meta.V, 'src/scenes/cnl/videos.json')))
    only = set(sys.argv[1:])
    for v in cfg['videos']:
        k = v['k']
        if only and k not in only:
            continue
        p = data.PAGES[k]
        scenes, total = video_scenes(v)
        out = os.path.join(ROOT, 'deliverables', f'cancelar-{k}')
        os.makedirs(out, exist_ok=True)
        sub = [{'id': s['id'], 'at': s['at'], 'lead': s['lead'], 'skip': 0, 'cut': 0} for s in scenes if s['kind'] in ('seg', 'promo')]
        srt = cnl_meta.cues(sub)
        open(os.path.join(out, f'cancelar_{k}.es.srt'), 'w').write(srt)
        desc = descripcion(k, p, v['store'])
        open(os.path.join(out, 'descripcion_youtube.txt'), 'w').write(desc + '\n')
        tags = etiquetas(k, p)
        tt = ', '.join(tags)
        dur = total / FPS
        ec = end_card(v, scenes)
        art = f'{WEB}/es/blog/{p["slug"]}/'
        md = [
            f'# YouTube · Cómo cancelar {p["name"]}', '',
            f'Duración: {fmt(dur)} s ({total} fotogramas a 50 fps). Vídeo: `SonorBooks_Cancelar{v["comp"][3:]}_1440p.mp4`.', '',
            f'## Título ({len(TITULO[k])} caracteres)', f'**{TITULO[k]}**', '', f'Alternativa: {ALT[k]} ({len(ALT[k])})', '',
            f'## Descripción ({len(desc.encode())} de 5.000 bytes)', '```', desc, '```', '',
            f'## Etiquetas ({len(tags)}; {len(tt)} de 500 caracteres)', '```', tt, '```', '',
            '## Comentario fijado', '```', PREGUNTA[k], f'Todos los pasos, con capturas: {art}', f'🎁 Y si buscas otra, las mejores pruebas gratis (algunas exclusivas): {PROMO}', '```', '',
            '## Al subir',
            '- Canal SonorBooks España. Idioma Español (España). «No, no es contenido creado para niños». Contenido alterado: No. Categoría: Gente y blogs.',
            '- «Incluye promoción pagada»: no (solo enlaza a la web de SonorBooks; la afiliación está en la web y se indica allí).',
            '- Sin capítulos: es un vídeo de un minuto y YouTube pide al menos tres capítulos de 10 s.',
            f'- Subtítulos: `cancelar_{k}.es.srt` (Español, España). Miniatura: `miniatura.png`.',
            f'- Pantalla final desde {int(ec // 60)}:{fmt(ec % 60).zfill(4)} ({fmt(dur - ec)} s; la marca de SonorBooks y la web arriba, la mitad de abajo libre): vídeo (la reseña de {p["name"]}, https://youtu.be/{RESENA[k]}) + suscribirse.',
            f'- El artículo ({art}) tiene que estar publicado antes; después, reconstruir las guías con `python3 web/cancelar/build.py --yt {k}=<ID>`.',
        ]
        open(os.path.join(out, 'youtube.md'), 'w').write('\n'.join(md) + '\n')
        n = srt.count(' --> ')
        print(f'{k:11} {dur:5.1f} s · {n:2d} subtítulos · descripción {len(desc.encode())} B · etiquetas {len(tt)} · título {len(TITULO[k])} · final {dur - ec:.1f} s')


if __name__ == '__main__':
    main()
