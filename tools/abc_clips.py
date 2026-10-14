#!/usr/bin/env python3
"""Tomas de la app de Audiobooks.com para la reseña: corta las grabaciones de OBS en video/public/abc/rec/<toma>/video.mp4.

Uso (desde video/): python3 ../tools/abc_clips.py [toma1,toma2]

Grabaciones (BlueStacks a pantalla completa, 664×1440 a 50 fps; app oficial de Audiobooks.com para Android, 13.0.1, con la
cuenta que creó Joan el 14/10/2026):
- R1 `2026-10-14 21-46-36.mp4` (12 min 37 s), aún con la cuenta gratuita. Entre 131 s y 587 s la captura salió desplazada (el
  panel lateral de BlueStacks cambió de ancho): no se usa. Tampoco el tramo en que el buscador mostró un correo pegado del
  portapapeles (~414 s) ni los Ajustes con el correo y el ID de la cuenta (~544 s), que caen dentro de ese hueco.
- R2 `2026-10-14 22-10-52.mp4` (10 min 53 s), ya en la prueba gratuita (1 crédito): crédito canjeado en Elon Musk (edición en
  español). Los Ajustes se abren por abajo (sin el correo). El audio del audiolibro no se usa (todas las tomas van sin audio).
"""
import json, os, subprocess, sys

SRC = {
    'R1': '/mnt/user-data/uploads/Videos/2026-10-14 21-46-36.mp4',
    'R2': '/mnt/user-data/uploads/Videos/2026-10-14 22-10-52.mp4',
}
OUT = 'public/abc/rec'
# nombre: (grabación, desde, hasta) en segundos
CLIPS = {
    'inicio_top': ('R1', 0.0, 19.0),
    'inicio_scroll': ('R1', 18.0, 56.0),
    'vip_lista': ('R1', 64.0, 94.0),
    'browse': ('R1', 95.0, 130.0),
    'reina_roja_es': ('R1', 614.0, 629.0),
    'cuenta_gratis': ('R1', 594.0, 613.0),
    'quijote_gratis': ('R1', 630.0, 664.0),
    'quijote_ficha': ('R1', 663.0, 678.0),
    'quijote_reproductor': ('R1', 677.0, 706.0),
    'biblioteca_descarga': ('R1', 733.0, 757.0),
    'perfil_prueba': ('R2', 0.0, 14.0),
    'elon_buscar_en': ('R2', 66.0, 103.0),
    'elon_filtro_es': ('R2', 102.0, 142.0),
    'elon_ficha': ('R2', 141.0, 182.0),
    'elon_credito': ('R2', 180.0, 234.0),
    'elon_reproductor': ('R2', 232.0, 250.0),
    'elon_velocidad': ('R2', 248.0, 270.0),
    'elon_temporizador': ('R2', 268.0, 284.0),
    'elon_marcador': ('R2', 282.0, 298.0),
    'elon_pistas': ('R2', 296.0, 316.0),
    'vip_prueba': ('R2', 354.0, 418.0),
    'post_en': ('R2', 430.0, 452.0),
    'post_filtro_es': ('R2', 450.0, 483.0),
    'tres_mundos_ficha': ('R2', 483.0, 510.0),
    'tres_mundos_muestra': ('R2', 508.0, 530.0),
    'sombra_es': ('R2', 540.0, 580.0),
    'ajustes_ingles': ('R2', 578.0, 596.0),
    'upgrade_1795': ('R2', 594.0, 610.0),
    'biblioteca_elon': ('R2', 620.0, 636.0),
    'perfil_cero': ('R2', 636.0, 652.5),
}


def main():
    only = sys.argv[1].split(',') if len(sys.argv) > 1 else None
    idx_path = os.path.join(OUT, 'index.json')
    idx = json.load(open(idx_path)) if os.path.exists(idx_path) else {}
    for name, (src, s, e) in CLIPS.items():
        if only and name not in only:
            continue
        d = os.path.join(OUT, name)
        os.makedirs(d, exist_ok=True)
        v = os.path.join(d, 'video.mp4')
        cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', str(s), '-to', str(e), '-i', SRC[src],
               '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-r', '50', '-g', '50', '-movflags', '+faststart', '-an', v]
        subprocess.run(cmd, check=True)
        dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', v]).decode().strip())
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-sseof', '-0.1', '-i', v, '-frames:v', '1', '-q:v', '2', os.path.join(d, 'last.jpg')], check=True)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', v, '-frames:v', '1', '-q:v', '2', os.path.join(d, 'first.jpg')], check=True)
        idx[name] = {'duration': round(dur, 3), 'src': os.path.basename(SRC[src]), 'from': s, 'to': e, 'audio': False}
        print(name, round(dur, 2), os.path.getsize(v) // 1024, 'KB', flush=True)
    json.dump(dict(sorted(idx.items())), open(idx_path, 'w'), indent=1)


if __name__ == '__main__':
    main()
