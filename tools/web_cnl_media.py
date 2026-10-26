#!/usr/bin/env python3
"""Imágenes de las guías «Cómo cancelar…» (web/cancelar/media): las capturas de cada paso, sacadas de las tomas ya tapadas
(video/public/cnl/rec, video/public/aud/rec) y de las capturas web tapadas (video/public/cnl/web), los logotipos y, si ya están
renderizadas, las miniaturas de los vídeos (deliverables/cancelar-<k>/miniatura.png) como póster del vídeo e imagen para redes.

Uso: python3 tools/web_cnl_media.py
"""
import importlib.util, os, shutil, subprocess, tempfile
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
WEB = os.path.join(ROOT, 'web', 'cancelar')
MEDIA = os.path.join(WEB, 'media')
PUB = os.path.join(ROOT, 'video', 'public')
spec = importlib.util.spec_from_file_location('data', os.path.join(WEB, 'data.py'))
data = importlib.util.module_from_spec(spec)
spec.loader.exec_module(data)


def frame(path, t):
    with tempfile.NamedTemporaryFile(suffix='.png') as f:
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.3f}', '-i', path, '-frames:v', '1', f.name], check=True)
        return Image.open(f.name).convert('RGB').copy()


def main():
    os.makedirs(MEDIA, exist_ok=True)
    n = 0
    for k in data.ORDER:
        for st in data.PAGES[k]['steps']:
            if 'img' not in st:
                continue
            kind, src, arg = st['img']
            if kind == 'rec':
                im = frame(os.path.join(PUB, 'cnl', 'rec', src, 'video.mp4'), arg)
            elif kind == 'aud':
                im = frame(os.path.join(PUB, 'aud', 'rec', src, 'video.mp4'), arg)
            else:
                im = Image.open(os.path.join(PUB, 'cnl', 'web', f'{src}.png')).convert('RGB').crop(arg)
                im = im.resize((im.width * 2, im.height * 2), Image.LANCZOS)  # a 2x, para que se lea en pantallas densas
            im.save(os.path.join(MEDIA, st['file']), 'WEBP', quality=82, method=6)
            n += 1
    # Logotipos: los de «Las mejores plataformas» y el de iVoox (de su reseña).
    mp = os.path.join(ROOT, 'web', 'mejores-plataformas', 'media')
    for k in data.ORDER:
        f = data.PAGES[k]['logo'][0]
        if f == 'logo-ivoox.webp':
            lg = Image.open(os.path.join(PUB, 'ivx', 'img', 'ivoox_logo@4x.png')).convert('RGBA')
            lg.resize((180, round(180 * lg.height / lg.width)), Image.LANCZOS).save(os.path.join(MEDIA, f), 'WEBP', quality=90)
        else:
            shutil.copy(os.path.join(mp, f), os.path.join(MEDIA, f))
    # Póster del vídeo (1280×720) e imagen para redes (1200×630) de cada guía, desde la miniatura del vídeo.
    for k in data.ORDER:
        th = os.path.join(ROOT, 'deliverables', f'cancelar-{k}', 'miniatura.png')
        if not os.path.exists(th):
            print('aviso: falta', os.path.relpath(th, ROOT))
            continue
        im = Image.open(th).convert('RGB')
        im.save(os.path.join(MEDIA, f'{data.PAGES[k]["slug"]}-video.webp'), 'WEBP', quality=84)
        og = im.resize((1200, 675), Image.LANCZOS).crop((0, 22, 1200, 652))
        og.save(os.path.join(MEDIA, f'{data.PAGES[k]["slug"]}-og.jpg'), 'JPEG', quality=86)
    print(f'{n} capturas → {os.path.relpath(MEDIA, ROOT)}')


if __name__ == '__main__':
    main()
