#!/usr/bin/env python3
"""Tomas de la app de Audible para la reseña: corta la grabación de OBS en video/public/aud/rec/<toma>/video.mp4.

Uso (desde video/): python3 ../tools/aud_clips.py [toma1,toma2]

La grabación (BlueStacks a pantalla completa, 664×1440 a 50 fps) es `2026-10-14 08-55-16.mp4` (10 min 59 s, app oficial de
Audible para Android con la cuenta que puso Joan, en la prueba de Premium ya cancelada: sigue activa hasta el 13/11/2026).
Fuera de las tomas: la cabecera del perfil con el nombre de la cuenta (se tapa en 20_perfil_infantil, tools/aud_cover.py) y
el aviso «Tu suscripción está por expirar» bajo la ficha de Umbra Dei (la toma 07 acaba antes). El audio del audiolibro que
suena en el reproductor no se usa (todas las tomas van sin audio).
"""
import json, os, subprocess, sys

SRC = '/mnt/user-data/uploads/Videos/2026-10-14 08-55-16.mp4'
OUT = 'public/aud/rec'
# nombre: (desde, hasta) en segundos de la grabación
CLIPS = {
    '00_inicio_top': (0.0, 17.0),
    '01_inicio_scroll': (15.0, 50.0),
    '02_huerfanos_ficha': (49.0, 81.0),
    '03_descubrir': (80.0, 114.0),
    '04_top20': (113.0, 146.0),
    '05_dracula': (145.0, 171.0),
    '06_buscar': (170.0, 197.0),
    '07_umbra_dei': (195.0, 203.0),
    '08_incluido': (215.5, 233.0),
    '09_sombra': (249.0, 280.0),
    '10_posteguillo': (278.0, 297.0),
    '11_tres_mundos': (295.0, 318.0),
    '12_reproductor': (316.0, 336.0),
    '13_velocidad': (334.0, 377.0),
    '14_temporizador': (375.0, 399.0),
    '15_capitulos': (397.0, 416.0),
    '16_marcadores': (414.0, 446.0),
    '17_descargar': (444.0, 475.0),
    '18_biblioteca': (475.0, 510.0),
    '19_suscripcion': (509.0, 552.0),
    '20_perfil_infantil': (554.0, 582.0),
    '21_ajustes': (584.5, 612.0),
    '22_duracion': (611.0, 659.0),
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
