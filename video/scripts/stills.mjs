// Fotogramas sueltos de una composición en una sola pasada (un único bundle y un único navegador) y hoja de contacto.
// Uso: node video/scripts/stills.mjs <composición> <carpeta_salida> <f1,f2,...> [--scale=0.5] [--sheet=hoja.jpg] [--cols=3]
// Los fotogramas pueden llevar etiqueta: 3011:R04+0 (la etiqueta se dibuja en la hoja).
import path from 'node:path';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition, openBrowser } from '@remotion/renderer';

const [comp, outDir, list, ...rest] = process.argv.slice(2);
const opt = Object.fromEntries(rest.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')));
// Compatibilidad con la versión anterior: la escala también puede ir como cuarto argumento suelto.
if (rest[0] && !rest[0].startsWith('--')) opt.scale = rest[0];
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
fs.mkdirSync(outDir, { recursive: true });
const cache = path.join(root, 'out/.stills-bundle');
const serveUrl = opt.rebundle === undefined && fs.existsSync(path.join(cache, 'index.html')) && opt.reuse !== undefined
  ? cache
  : await bundle({ entryPoint: path.join(root, 'src/index.ts'), outDir: cache, publicDir: path.join(root, 'public'), onProgress: () => {} });
const browser = await openBrowser('chrome');
const composition = await selectComposition({ serveUrl, id: comp, puppeteerInstance: browser });
const scale = Number(opt.scale ?? 0.5);
const items = list.split(',').map((x) => { const [f, label] = x.split(':'); return { f: Number(f), label: label ?? f }; });
const files = [];
for (const it of items) {
  const file = path.join(outDir, `f${String(it.f).padStart(6, '0')}.jpg`);
  await renderStill({ serveUrl, composition, frame: it.f, output: file, imageFormat: 'jpeg', jpegQuality: 88, scale, puppeteerInstance: browser });
  files.push({ file, label: it.label });
  process.stdout.write('.');
}
await browser.close({ silent: true });
console.log(`\n${files.length} fotogramas en ${outDir}`);
if (opt.sheet) {
  const cols = Number(opt.cols ?? 3);
  const py = `
import sys, json
from PIL import Image, ImageDraw, ImageFont
items = json.loads(sys.argv[1]); out = sys.argv[2]; cols = int(sys.argv[3])
ims = [Image.open(i['file']) for i in items]
w, h = ims[0].size
rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (cols * w, rows * (h + 28)), 'white')
d = ImageDraw.Draw(sheet)
try:
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 20)
except Exception:
    font = None
for k, (it, im) in enumerate(zip(items, ims)):
    x, y = (k % cols) * w, (k // cols) * (h + 28)
    sheet.paste(im, (x, y + 28))
    d.text((x + 6, y + 3), it['label'], fill='black', font=font)
sheet.save(out, quality=82)
print('hoja', out, sheet.size)
`;
  console.log(execFileSync('python3', ['-c', py, JSON.stringify(files), opt.sheet, String(cols)]).toString().trim());
}
