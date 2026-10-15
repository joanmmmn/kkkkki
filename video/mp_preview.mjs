// Hoja de contactos de MPGuide (o de otra composición) con un bundle reutilizable.
// Uso: node mp_preview.mjs <compId> <out.jpg> <f1,f2,...> [cols] [scale]
// Para volver a empaquetar después de cambiar el código, borra /tmp/mp-bundle (o pasa REBUNDLE=1).
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const [, , id, out, framesArg, colsArg, scaleArg] = process.argv;
const frames = framesArg.split(',').map(Number);
const cols = Number(colsArg || 3);
const scale = Number(scaleArg || 0.5);
const dir = '/tmp/mp-bundle';
let serveUrl = dir;
if (process.env.REBUNDLE || !fs.existsSync(path.join(dir, 'index.html'))) {
  serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts'), outDir: dir, onProgress: () => {} });
}
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const comp = await selectComposition({ serveUrl, id, browserExecutable });
const tmp = fs.mkdtempSync('/tmp/stills-');
const files = [];
for (const f of frames) {
  const file = path.join(tmp, `f${String(f).padStart(6, '0')}.png`);
  await renderStill({ serveUrl, composition: comp, frame: Math.min(f, comp.durationInFrames - 1), output: file, browserExecutable, scale });
  files.push(file);
}
const w = Math.round(comp.width * scale), h = Math.round(comp.height * scale);
execFileSync('ffmpeg', ['-v', 'error', '-y', ...files.flatMap((f) => ['-i', f]),
  '-filter_complex', `${files.map((_, i) => `[${i}:v]drawtext=text='${frames[i]}':x=10:y=10:fontsize=20:fontcolor=red[v${i}]`).join(';')};${files.map((_, i) => `[v${i}]`).join('')}xstack=inputs=${files.length}:layout=${files.map((_, i) => `${(i % cols) * w}_${Math.floor(i / cols) * h}`).join('|')}:fill=white`,
  '-q:v', '3', out]);
console.log(`OK ${out} · ${comp.durationInFrames} fotogramas = ${(comp.durationInFrames / comp.fps).toFixed(1)} s`);
