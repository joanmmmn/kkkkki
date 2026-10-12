#!/usr/bin/env python3
"""Tomas de la app de Podimo para la reseña: corta la grabación de OBS en video/public/pdr/rec/<toma>/video.mp4.

Uso (desde video/): python3 ../tools/pdr_clips.py [toma1,toma2]

La grabación (BlueStacks a pantalla completa, 664×1440 a 50 fps) es `2026-10-12 22-43-48.mp4`. Se dejan fuera los tramos
con datos personales (barra de notificaciones con el correo, saludo con el nombre y correo de la cuenta en
Configuración). Los comentarios de otros oyentes, que asoman bajo el reproductor, se desenfocan en los tramos en que se
ven (`blur`: intervalos en segundos de la grabación original y franja vertical en píxeles).
"""
import json, os, subprocess, sys

SRC = '/mnt/user-data/uploads/Videos/2026-10-12 22-43-48.mp4'
OUT = 'public/pdr/rec'
# Franja de los comentarios en el reproductor (debajo del título y la descripción).
COMMENTS = (660, 1080)
BLUR = [(330.0, 351.6), (406.4, 429.6), (439.0, 452.0)]
# nombre: (desde, hasta, audio)
CLIPS = {
    '00_gustos': (0.0, 40.0, False),
    '01_int_pod': (40.0, 72.0, False),
    '02_int_aud': (72.0, 98.0, False),
    '03_recopilando': (106.0, 122.0, False),
    '04_inicio': (116.0, 160.0, False),
    '05_buscar': (160.0, 196.0, False),
    '06_ficha': (196.0, 205.6, False),
    '07_ficha_top': (304.0, 314.0, False),
    '08_reproductor': (312.0, 360.0, True),
    '09_velocidad': (358.0, 432.0, False),
    '10_capitulos': (428.0, 452.0, False),
    '11_podcast': (490.0, 522.0, False),
    '12_biblioteca': (590.0, 615.6, False),
    '13_membresia': (646.4, 673.6, False),
    '14_regala': (678.6, 696.0, False),
    '15_inicio_top': (704.0, 720.0, False),
    '16_audiolibros': (756.0, 797.0, False),
}


def blur_filter(start: float, end: float) -> str:
    """Desenfoque de la franja de comentarios en los intervalos que caen dentro de la toma (tiempos de la toma)."""
    y0, y1 = COMMENTS
    parts = []
    for a, b in BLUR:
        lo, hi = max(a, start), min(b, end)
        if hi > lo:
            parts.append(f'between(t,{lo - start:.3f},{hi - start:.3f})')
    if not parts:
        return ''
    cond = '+'.join(parts)
    return (f"[0:v]split[a][b];[b]crop=664:{y1 - y0}:0:{y0},boxblur=luma_radius=26:luma_power=3[bl];"
            f"[a][bl]overlay=0:{y0}:enable='{cond}'[v]")


def main():
    only = sys.argv[1].split(',') if len(sys.argv) > 1 else None
    idx_path = os.path.join(OUT, 'index.json')
    idx = json.load(open(idx_path)) if os.path.exists(idx_path) else {}
    for name, (s, e, audio) in CLIPS.items():
        if only and name not in only:
            continue
        d = os.path.join(OUT, name)
        os.makedirs(d, exist_ok=True)
        v = os.path.join(d, 'video.mp4')
        fl = blur_filter(s, e)
        cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', str(s), '-to', str(e), '-i', SRC]
        if fl:
            cmd += ['-filter_complex', fl, '-map', '[v]'] + (['-map', '0:a'] if audio else [])
        cmd += ['-c:v', 'libx264', '-crf', '14', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-r', '50', '-g', '50', '-movflags', '+faststart']
        cmd += (['-c:a', 'aac', '-b:a', '192k'] if audio else ['-an'])
        cmd += [v]
        subprocess.run(cmd, check=True)
        dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', v]).decode().strip())
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-sseof', '-0.1', '-i', v, '-frames:v', '1', '-q:v', '2', os.path.join(d, 'last.jpg')], check=True)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', v, '-frames:v', '1', '-q:v', '2', os.path.join(d, 'first.jpg')], check=True)
        idx[name] = {'duration': round(dur, 3), 'src': os.path.basename(SRC), 'from': s, 'to': e, 'audio': audio}
        print(name, round(dur, 2), os.path.getsize(v) // 1024, 'KB', '(desenfoque)' if fl else '')
    json.dump(idx, open(idx_path, 'w'), indent=1)


if __name__ == '__main__':
    main()
