#!/usr/bin/env python3
"""Tomas de la app y de la web de iVoox para la reseña: corta las grabaciones de OBS en video/public/ivx/rec/<toma>/video.mp4.

Uso (desde video/): python3 ../tools/ivx_clips.py [toma1,toma2]

Grabaciones (BlueStacks a pantalla completa, 664×1440 a 50 fps; la cuenta de Joan, con iVoox Premium):
- R1 `2026-10-15 11-20-23.mp4` (18 min 53 s): la app oficial de iVoox para Android (2.4020). NO se usan:
  · 52,3–61,3 s, 99,3–120,3 s y 204,8–207,4 s: la cortina de notificaciones de Android (correos de las cuentas de Google).
  · 213,7–220,0 s y 940,2–960,9 s: los Ajustes con el nombre de la cuenta. La toma `ajustes_cancelar` empieza ya desplazada
    (a partir de 961,3 s el nombre queda fuera de la pantalla).
  El audio de la app no se usa (todas las tomas van sin audio).
- W1 `2026-10-15 13-16-17.mp4` (3 min 4 s): ivoox.com en Chrome (pestaña de incógnito, sin sesión) desde España: el aviso de
  cookies («Rechazar y suscribirse»), el muro que sale al rechazarlas y la página de Premium (precios en euros).
"""
import json, os, subprocess, sys

SRC = {
    'R1': '/mnt/user-data/uploads/Videos/2026-10-15 11-20-23.mp4',
    'W1': '/mnt/user-data/uploads/Videos/2026-10-15 13-16-17.mp4',
}
OUT = 'public/ivx/rec'
# Tramos que nunca deben salir (grabación, desde, hasta): se comprueba que ninguna toma los pise.
PRIVADO = [('R1', 52.3, 61.3), ('R1', 99.3, 120.3), ('R1', 204.8, 207.4), ('R1', 213.7, 220.0), ('R1', 940.2, 960.9)]
# nombre: (grabación, desde, hasta) en segundos
CLIPS = {
    'podcast_gratis': ('R1', 23.0, 37.5),
    'inicio_top': ('R1', 38.5, 52.0),
    'inicio_scroll': ('R1', 61.6, 86.0),
    'lista_sorprendeme': ('R1', 86.0, 99.0),
    'lista_sorprendeme2': ('R1', 120.6, 131.0),
    'explorar_carta': ('R1', 131.0, 147.0),
    'audiolibros_1': ('R1', 147.0, 196.0),
    'usher_ficha_1': ('R1', 196.0, 204.4),
    'inicio_2': ('R1', 222.8, 243.0),
    'explorar_2': ('R1', 243.0, 263.5),
    'plus_programas': ('R1', 263.5, 295.0),
    'contrahistoria_ficha': ('R1', 295.0, 311.0),
    'contrahistoria_avance': ('R1', 311.0, 327.0),
    'config_reproductor': ('R1', 327.0, 362.0),
    'reproductor_2': ('R1', 362.0, 374.0),
    'modo_coche': ('R1', 374.0, 423.0),
    'reproductor_3': ('R1', 423.0, 431.0),
    'apoyar': ('R1', 431.0, 451.0),
    'reproductor_4': ('R1', 451.0, 463.0),
    'apoyar_2': ('R1', 463.0, 475.0),
    'contrahistoria_descarga': ('R1', 475.0, 515.0),
    'biblioteca': ('R1', 515.0, 531.0),
    'descargados': ('R1', 531.0, 543.0),
    'explorar_3': ('R1', 543.0, 555.0),
    'buscar_populares': ('R1', 555.0, 574.0),
    'buscar_quijote': ('R1', 574.0, 599.0),
    'quijote_ficha': ('R1', 599.0, 615.0),
    'quijote_avance': ('R1', 615.0, 665.0),
    'explorar_4': ('R1', 665.0, 678.0),
    'radios_tab': ('R1', 678.0, 692.0),
    'radios_nacionales': ('R1', 786.0, 803.0),
    'radio_ser': ('R1', 803.0, 819.0),
    'radios_mini': ('R1', 819.0, 831.0),
    'carta_2': ('R1', 831.0, 840.0),
    'originals': ('R1', 840.0, 872.0),
    'ranking': ('R1', 872.0, 895.0),
    'biblioteca_2': ('R1', 895.0, 906.0),
    'inicio_3': ('R1', 906.0, 939.5),
    'ajustes_cancelar': ('R1', 961.3, 976.0),
    'ajustes_resto': ('R1', 976.0, 1006.0),
    'explorar_5': ('R1', 1007.0, 1019.0),
    'audiolibros_2': ('R1', 1019.0, 1062.0),
    'usher_ficha_2': ('R1', 1062.0, 1074.5),
    'plus_oferta': ('R1', 1074.5, 1098.0),
    'usher_avance': ('R1', 1098.0, 1114.0),
    'usher_mini': ('R1', 1114.0, 1132.0),
    'web_aviso': ('W1', 26.5, 41.0),
    'web_muro': ('W1', 40.5, 76.5),
    'web_premium': ('W1', 76.0, 113.0),
}


def main():
    only = sys.argv[1].split(',') if len(sys.argv) > 1 else None
    for name, (src, s, e) in CLIPS.items():
        for psrc, ps, pe in PRIVADO:
            if src == psrc and s < pe and e > ps:
                sys.exit(f'{name} pisa un tramo privado ({ps}–{pe} s de {psrc})')
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
