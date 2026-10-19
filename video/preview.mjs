// Renderiza fotogramas sueltos y los monta en una hoja de contactos.
// Uso: node preview.mjs <compId> <out.png> <frame1,frame2,...> [cols]
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const [, , id, out, framesArg, colsArg] = process.argv;
const frames = framesArg.split(',').map(Number);
const cols = Number(colsArg || 3);
// Como mucho dos vistas previas a la vez en la máquina (la memoria es justa): si no hay hueco, espera.
const slots = ['/tmp/claude-0/pl_preview_1', '/tmp/claude-0/pl_preview_2'];
const alive = (pid) => { try { process.kill(pid, 0); return true; } catch { return false; } };
let slot = null;
while (!slot) {
  for (const s of slots) {
    try { fs.mkdirSync(s); fs.writeFileSync(`${s}/pid`, String(process.pid)); slot = s; break; } catch {
      try { const pid = Number(fs.readFileSync(`${s}/pid`, 'utf8')); if (pid && !alive(pid)) fs.rmSync(s, { recursive: true, force: true }); } catch {}
    }
  }
  if (!slot) await new Promise((r) => setTimeout(r, 3000));
}
process.on('exit', () => { try { fs.rmSync(slot, { recursive: true, force: true }); } catch {} });
process.on('SIGINT', () => process.exit(130)); process.on('SIGTERM', () => process.exit(143));
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), onProgress: () => {}, ...(id.startsWith("PL") ? { publicDir: path.resolve("public_pl") } : {}) });
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const comp = await selectComposition({ serveUrl, id, browserExecutable });
const tmp = fs.mkdtempSync('/tmp/stills-');
const files = [];
for (const f of frames) {
  const file = path.join(tmp, `f${String(f).padStart(6, '0')}.png`);
  await renderStill({ serveUrl, composition: comp, frame: Math.min(f, comp.durationInFrames - 1), output: file, browserExecutable, scale: 0.5 });
  files.push(file);
}
const rows = Math.ceil(files.length / cols);
execFileSync('ffmpeg', ['-v', 'error', '-y', ...files.flatMap((f) => ['-i', f]),
  '-filter_complex', `${files.map((_, i) => `[${i}:v]drawtext=text='${frames[i]}':x=12:y=12:fontsize=22:fontcolor=red[v${i}]`).join(';')};${files.map((_, i) => `[v${i}]`).join('')}xstack=inputs=${files.length}:layout=${files.map((_, i) => `${(i % cols) * comp.width / 2}_${Math.floor(i / cols) * comp.height / 2}`).join('|')}:fill=white`,
  out]);
fs.rmSync(serveUrl, { recursive: true, force: true }); fs.rmSync(tmp, { recursive: true, force: true });
console.log(`OK ${out} (${files.length} fotogramas, duración total ${comp.durationInFrames} fotogramas = ${(comp.durationInFrames / comp.fps).toFixed(1)} s)`);
