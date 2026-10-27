// Renderiza varios fotogramas de una composición con un solo empaquetado y monta una hoja de contactos.
// Uso: node tools/stills.mjs <Composición> <salida_dir> <f1,f2,...> [escala]
import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

// Los paquetes de Remotion están instalados en video/.
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../video');
const require = createRequire(path.join(root, 'package.json'));
const { bundle } = require('@remotion/bundler');
const { renderStill, selectComposition } = require('@remotion/renderer');

const [, , id, out, list, scaleArg] = process.argv;
const frames = list.split(',').map(Number);
const scale = Number(scaleArg ?? 0.5);
fs.mkdirSync(out, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public') });
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const composition = await selectComposition({ serveUrl, id, browserExecutable });
const files = [];
for (const f of frames) {
  const file = path.join(out, `${id}_${String(f).padStart(5, '0')}.png`);
  await renderStill({ serveUrl, composition, frame: f, output: file, scale, browserExecutable });
  files.push(file);
  console.log('ok', f);
}
execFileSync('python3', ['-I', '-c', `
import sys
from PIL import Image, ImageDraw
fs=sys.argv[1:]
ims=[Image.open(f).convert('RGB') for f in fs]
w,h=ims[0].size
cols=2 if len(ims)>1 else 1
rows=(len(ims)+cols-1)//cols
sheet=Image.new('RGB',(w*cols,h*rows),'white')
d=ImageDraw.Draw(sheet)
for i,(f,im) in enumerate(zip(fs,ims)):
    x,y=(i%cols)*w,(i//cols)*h
    sheet.paste(im,(x,y)); d.rectangle((x,y,x+110,y+30),fill='black'); d.text((x+8,y+8),f.split('_')[-1][:-4],fill='white')
sheet.save(sys.argv[1].rsplit('/',1)[0]+'/_sheet.png')
`, ...files]);
console.log(path.join(out, '_sheet.png'));
