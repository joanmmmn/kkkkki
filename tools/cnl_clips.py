#!/usr/bin/env python3
"""Tomas del tutorial «Cómo cancelar la suscripción»: corta las grabaciones de OBS del 26/10/2026 en video/public/cnl/rec/<toma>/video.mp4.

Uso (desde video/): python3 ../tools/cnl_clips.py [toma1,toma2]

Grabaciones (BlueStacks, 664×1440 a 50 fps, en la carpeta Vídeos de Joan):
  A = 2026-10-26 08-54-14.mp4  Podimo, iVoox y BookBeat (la app y su web dentro del Chrome de BlueStacks)
  B = 2026-10-26 09-41-55.mp4  Storytel (app y web)
  D = 2026-10-26 10-11-25.mp4  Nextory (app y web; el último paso, «Lo entiendo» y confirmar, lo hizo Joan a las 10:24)

Datos personales: los tramos con el nombre de la cuenta, el correo o la tarjeta se dejan fuera o se tapan con un parche del color
del fondo (`covers`: x, y, ancho, alto en px de la grabación y color), siempre en tramos donde la pantalla está quieta.
Antes de usar una toma nueva, pasar tools/cnl_pii.py (OCR) por ella.
"""
import json, os, subprocess, sys, tempfile
from PIL import Image, ImageDraw

VID = '/mnt/user-data/uploads/Videos'
SRC = {'A': '2026-10-26 08-54-14.mp4', 'B': '2026-10-26 09-41-55.mp4', 'D': '2026-10-26 10-11-25.mp4'}
OUT = 'public/cnl/rec'

# Parches (x, y, ancho, alto, color) — medidos en fotogramas a resolución completa.
POD_AVATAR = (550, 85, 62, 62, 'disc:EB4079:111111')  # avatar con la inicial del nombre (Podimo, inicio): círculo liso
POD_EMAIL = (44, 983, 290, 36, '0x242424')        # correo bajo «Cerrar sesión» (Podimo, Configuración)
IVX_AVATAR = (24, 229, 84, 84, 'disc:EB4079:FFFFFF')  # avatar con la inicial del nombre (iVoox, Ajustes): círculo liso
IVX_NAME = (118, 236, 230, 76, '0xFFFFFF')        # nombre y «Cerrar sesión» (iVoox, Ajustes)
BKB_PROFILE = (14, 120, 520, 145, '0xF2F2F2')     # avatar, nombre del perfil y correo (BookBeat, Profile)
BKB_CARD = (40, 1298, 290, 92, '0xFFFFFF')        # tarjeta y caducidad (BookBeat, Account Information)
STR_BANNER = (0, 266, 664, 178, '0x101010')       # aviso «Tu pago falló…» (Storytel, cuenta web)
NX_EMAIL = (46, 1078, 566, 56, '0xECEAE6')        # correo (Nextory, Editar cuenta)

# nombre: (grabación, desde, hasta, parches)
CLIPS = {
    'pod_menu': ('A', 0.0, 19.8, [POD_AVATAR]),
    'pod_config': ('A', 29.2, 38.95, [POD_EMAIL]),
    'pod_memb': ('A', 39.0, 84.0, []),
    'pod_web': ('A', 84.0, 224.0, []),
    'ivx_home': ('A', 244.0, 251.6, []),
    'ivx_ajustes': ('A', 252.0, 266.9, [IVX_AVATAR, IVX_NAME]),
    'ivx_cancel': ('A', 267.0, 316.0, []),  # al final vuelve a Ajustes, con el nombre: se corta antes
    'bkb_profile': ('A', 346.0, 354.4, [BKB_PROFILE]),
    'bkb_load': ('A', 362.0, 363.95, []),
    'bkb_account': ('A', 366.0, 375.0, [BKB_CARD]),
    'bkb_menu': ('A', 416.0, 425.8, []),
    'bkb_manage': ('A', 425.8, 452.0, []),
    'bkb_cancel': ('A', 452.0, 555.0, []),
    'str_app': ('B', 0.0, 46.0, []),
    'str_web1': ('B', 55.0, 61.5, [STR_BANNER]),
    'str_web2': ('B', 63.0, 106.5, []),
    'nx_app': ('D', 0.0, 33.4, []),
    'nx_sub': ('D', 33.6, 46.8, [NX_EMAIL]),
    'nx_sheet': ('D', 48.0, 66.5, []),
    'nx_web': ('D', 126.0, 222.0, []),
    'nx_end': ('D', 782.5, 791.1, []),
}


def main():
    only = sys.argv[1].split(',') if len(sys.argv) > 1 else None
    idx_path = os.path.join(OUT, 'index.json')
    idx = json.load(open(idx_path)) if os.path.exists(idx_path) else {}
    for name, (rec, s, e, covers) in CLIPS.items():
        if only and name not in only:
            continue
        d = os.path.join(OUT, name)
        os.makedirs(d, exist_ok=True)
        v = os.path.join(d, 'video.mp4')
        src = os.path.join(VID, SRC[rec])
        # Avatares: un círculo liso del color del avatar (sin la inicial) sobre el fondo; el resto, parches de color.
        g, last, extra = [], '0:v', []
        for k, (x, y, w, h, c) in enumerate(cv for cv in covers if cv[4].startswith('disc:')):
            _, fg, bg = c.split(':')
            im = Image.new('RGB', (w * 4, h * 4), '#' + bg)
            ImageDraw.Draw(im).ellipse([2, 2, w * 4 - 3, h * 4 - 3], fill='#' + fg)
            png = tempfile.mktemp(suffix='.png')
            im.resize((w, h), Image.LANCZOS).save(png)
            extra += ['-i', png]
            g.append(f'[{last}][{k + 1}:v]overlay={x}:{y}[o{k}]')
            last = f'o{k}'
        boxes = ','.join(f'drawbox=x={x}:y={y}:w={w}:h={h}:color={c}@1:t=fill' for x, y, w, h, c in covers if not c.startswith('disc:')) or 'null'
        g.append(f'[{last}]{boxes}[v]')
        cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', str(s), '-to', str(e), '-i', src] + extra + ['-filter_complex', ';'.join(g), '-map', '[v]',
               '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-r', '50', '-g', '50', '-movflags', '+faststart', '-an', v]
        subprocess.run(cmd, check=True)
        dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', v]).decode().strip())
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-sseof', '-0.1', '-i', v, '-frames:v', '1', '-q:v', '2', os.path.join(d, 'last.jpg')], check=True)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', v, '-frames:v', '1', '-q:v', '2', os.path.join(d, 'first.jpg')], check=True)
        idx[name] = {'duration': round(dur, 3), 'src': SRC[rec], 'from': s, 'to': e, 'covers': len(covers)}
        print(name, round(dur, 2), os.path.getsize(v) // 1024, 'KB', f'({len(covers)} parches)' if covers else '')
    json.dump(idx, open(idx_path, 'w'), indent=1)


if __name__ == '__main__':
    main()
