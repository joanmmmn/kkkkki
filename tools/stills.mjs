// Fotogramas sueltos de una composición para revisar el montaje sin renderizar el vídeo entero.
// Uso: node tools/stills.mjs <composición> <salida_dir> <f1,f2,...|escena:X01@0.5,...> [escala]
//   «X01@0.5» = el fotograma a mitad de la escena X01 (solo ERReview); también vale «X01+120» (fotograma 120 de la escena).
import { bundle } from '/home/claude/kkkkki/video/node_modules/@remotion/bundler/dist/index.js';
import { openBrowser, renderStill, selectComposition } from '/home/claude/kkkkki/video/node_modules/@remotion/renderer/dist/index.js';
import fs from 'node:fs';
import path from 'node:path';

const [, , compId, outDir, list, scaleArg] = process.argv;
const scale = Number(scaleArg || 0.5);
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: '/home/claude/kkkkki/video/src/index.ts', publicDir: '/home/claude/kkkkki/video/public' });
const browser = await openBrowser('chrome');
const comp = await selectComposition({ serveUrl, id: compId, puppeteerInstance: browser });

// Inicio y duración de cada escena de la reseña (mismo cálculo que scenes/er2/timeline.ts).
const sceneMap = (() => {
  if (compId !== 'ERReview') return {};
  const TL = JSON.parse(fs.readFileSync('/home/claude/kkkkki/video/public/er/timeline2.json', 'utf8'));
  const C = JSON.parse(fs.readFileSync('/home/claude/kkkkki/video/public/er/audio/clips.json', 'utf8'));
  const sp = (id) => { const j = JSON.parse(fs.readFileSync(`/home/claude/kkkkki/video/public/er/vo2/${id}.json`, 'utf8')); return Math.ceil((j.speechEnd ?? j.duration) * 50); };
  const sec = (s) => Math.round(s * 50);
  const out = {}; let a = 0;
  for (const d of TL) {
    let t = sec(d.lead ?? 0.12);
    d.seq.forEach((s, i) => { if (i > 0) t += sec(s.gap ?? 0.35); t += s.vo ? sp(s.vo) : sec(C[s.clip].dur); });
    const dur = t + sec(0.32 + (d.extra ?? 0));
    out[d.id] = [a, dur]; a += dur;
  }
  return out;
})();
const frames = list.split(',').map((x) => {
  let m = /^(X\d+)@([\d.]+)$/.exec(x); if (m) { const [a, d] = sceneMap[m[1]]; return [x, Math.min(a + d - 1, Math.round(a + d * Number(m[2])))]; }
  m = /^(X\d+)\+(\d+)$/.exec(x); if (m) { const [a] = sceneMap[m[1]]; return [x, a + Number(m[2])]; }
  return [x, Number(x)];
});
for (const [label, frame] of frames) {
  const output = path.join(outDir, `${label.replace(/[^\w.@+-]/g, '_')}.png`);
  await renderStill({ composition: comp, serveUrl, frame, output, scale, inputProps: {}, puppeteerInstance: browser });
  console.log(label, frame, output);
}
await browser.close({ silent: true });
