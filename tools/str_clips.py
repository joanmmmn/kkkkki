#!/usr/bin/env python3
"""Tomas de la app de Storytel para la reseña: corta la grabación de OBS en video/public/str/rec/<toma>/video.mp4.

Uso (desde video/): python3 ../tools/str_clips.py [toma1,toma2]

La grabación (BlueStacks a pantalla completa, 664×1440 a 50 fps) es `2026-10-13 21-44-18.mp4` (14 min 4 s, cuenta Unlimited
en prueba que puso Joan). Se dejan fuera: la hoja de «Compartir» de Android (3:00–3:06), las reseñas de otros oyentes con su
nombre bajo la ficha de La Suelta (5:12–5:26) y la pantalla de «Cuenta» (no se abrió). El audio del audiolibro que suena en
el reproductor no se usa (todas las tomas van sin audio).
"""
import json, os, subprocess, sys

SRC = '/mnt/user-data/uploads/Videos/2026-10-13 21-44-18.mp4'
OUT = 'public/str/rec'
# nombre: (desde, hasta) en segundos de la grabación
CLIPS = {
    '00_inicio_top': (0.0, 46.0),
    '01_inicio_scroll': (44.0, 90.0),
    '02_inicio_top2': (88.0, 100.0),
    '03_series': (97.0, 107.0),
    '04_ebooks': (105.0, 116.0),
    '05_infantil': (115.0, 127.0),
    '06_perfil_kids': (127.0, 157.0),
    '07_objetivo': (160.0, 176.0),
    '08_suscripcion': (190.0, 224.0),
    '09_config_app': (226.0, 246.0),
    '10_buscar': (250.0, 278.0),
    '11_suelta': (277.0, 311.0),
    '12_bernarda_buscar': (328.0, 340.0),
    '13_bernarda_ficha': (338.0, 352.0),
    '14_reproductor': (350.0, 426.0),
    '15_reproductor2': (424.0, 520.0),
    '16_lectura': (518.0, 600.0),
    '17_buscar_libro': (595.0, 633.0),
    '18_buscar_audio': (631.0, 676.0),
    '19_biblioteca': (674.0, 696.0),
    '20_explorar': (694.0, 772.0),
    '21_modo_noche': (778.0, 817.0),
}


def main():
    only = sys.argv[1].split(',') if len(sys.argv) > 1 else None
    idx_path = os.path.join(OUT, 'index.json')
    idx = json.load(open(idx_path)) if os.path.exists(idx_path) else {}
    for name, (s, e) in CLIPS.items():
        if only and name not in only:
            continue
        d = os.path.join(OUT, name)
        os.makedirs(d, exist_ok=True)
        v = os.path.join(d, 'video.mp4')
        cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', str(s), '-to', str(e), '-i', SRC,
               '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-r', '50', '-g', '50', '-movflags', '+faststart', '-an', v]
        subprocess.run(cmd, check=True)
        dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', v]).decode().strip())
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-sseof', '-0.1', '-i', v, '-frames:v', '1', '-q:v', '2', os.path.join(d, 'last.jpg')], check=True)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', v, '-frames:v', '1', '-q:v', '2', os.path.join(d, 'first.jpg')], check=True)
        idx[name] = {'duration': round(dur, 3), 'src': os.path.basename(SRC), 'from': s, 'to': e, 'audio': False}
        print(name, round(dur, 2), os.path.getsize(v) // 1024, 'KB', flush=True)
    json.dump(dict(sorted(idx.items())), open(idx_path, 'w'), indent=1)


if __name__ == '__main__':
    main()
