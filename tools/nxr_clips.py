import json, os, subprocess, sys
M = '/mnt/user-data/uploads/Videos/2026-10-11 19-21-50.mp4'
W = '/mnt/user-data/uploads/Videos/2026-10-11 19-19-43.mp4'
out = 'public/nxr/rec'
clips = {
 '00_bienvenida': (W, 12.0, 17.2, False),
 '00_login': (W, 18.0, 30.0, False),
 '01_inicio': (M, 148.0, 182.0, False),
 '01b_inicio_bajo': (M, 210.0, 236.0, False),
 '02_librarian_a': (M, 238.0, 250.0, False),
 '02_librarian_tap': (M, 232.0, 250.0, False),
 '02_librarian_b': (M, 276.0, 320.0, False),
 '03_buscar': (M, 326.0, 353.0, False),
 '04_ficha_galdos': (M, 353.0, 386.0, False),
 '05_abrir_libro': (M, 386.0, 412.0, False),
 '05_toc': (M, 448.0, 460.0, False),
 '05_leer': (M, 460.0, 572.0, False),
 '06_escuchar': (M, 584.0, 712.0, True),
 '07_biblioteca': (M, 728.0, 757.0, False),
 '08_perfil': (M, 758.0, 791.0, False),
 '09_descargas': (M, 792.0, 808.0, False),
 '10_noche': (M, 808.0, 830.0, False),
 '11_actividad': (M, 840.0, 898.0, False),
 '12_infantil_setup': (M, 910.0, 1006.0, False),
 '12_infantil_home': (M, 1026.0, 1066.0, False),
 '13_diluvio': (M, 1106.0, 1133.0, False),
 '14_narrador': (M, 1186.0, 1202.0, False),
 '15_racha': (M, 1238.0, 1255.0, False),
 '16_sagas': (M, 1258.0, 1278.0, False),
 '17_categorias': (M, 1280.0, 1352.0, False),
 '18_pin': (M, 1372.0, 1394.0, False),
 '19_tipos_perfil': (M, 1408.0, 1426.0, False),
}
idx_path = os.path.join(out, 'index.json')
idx = json.load(open(idx_path)) if os.path.exists(idx_path) else {}
only = sys.argv[1].split(',') if len(sys.argv) > 1 else None
for name, (src, s, e, audio) in clips.items():
    if only and name not in only: continue
    d = os.path.join(out, name); os.makedirs(d, exist_ok=True)
    v = os.path.join(d, 'video.mp4')
    cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', str(s), '-to', str(e), '-i', src, '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-r', '50', '-g', '50', '-movflags', '+faststart']
    cmd += (['-c:a', 'aac', '-b:a', '192k'] if audio else ['-an'])
    cmd += [v]
    subprocess.run(cmd, check=True)
    dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', v]).decode().strip())
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-sseof', '-0.1', '-i', v, '-frames:v', '1', '-q:v', '2', os.path.join(d, 'last.jpg')], check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', v, '-frames:v', '1', '-q:v', '2', os.path.join(d, 'first.jpg')], check=True)
    idx[name] = {'duration': round(dur, 3), 'src': os.path.basename(src), 'from': s, 'to': e, 'audio': audio}
    print(name, round(dur, 2), os.path.getsize(v) // 1024, 'KB')
json.dump(idx, open(idx_path, 'w'), indent=1)
