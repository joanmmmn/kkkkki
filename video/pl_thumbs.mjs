// SonorBooks Polska: renderiza las miniaturas de YouTube (1280×720) de todas las reseñas en un solo paquete.
// Uso: node pl_thumbs.mjs [pieza ...]   → ../deliverables/pl/<pieza>/miniatura_A.png (y miniatura_B.png si hay PLThumbB)
import { bundle } from '@remotion/bundler';
import { renderStill, getCompositions } from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const only = process.argv.slice(2);
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts'), onProgress: () => {}, publicDir: path.resolve('public_pl') });
try {
  const comps = (await getCompositions(serveUrl, { browserExecutable })).filter((c) => /^PLThumbB?-/.test(c.id));
  for (const comp of comps) {
    const [kind, ...rest] = comp.id.split('-');
    const slug = rest.join('-');
    if (only.length && !only.includes(slug)) continue;
    const dir = path.resolve('../deliverables/pl', slug);
    fs.mkdirSync(dir, { recursive: true });
    const out = path.join(dir, kind === 'PLThumbB' ? 'miniatura_B.png' : 'miniatura_A.png');
    await renderStill({ serveUrl, composition: comp, frame: 0, output: out, browserExecutable, scale: 1 });
    console.log(`${comp.id} → ${path.relative(path.resolve('..'), out)} (${(fs.statSync(out).size / 1e6).toFixed(2)} MB)`);
  }
} finally {
  fs.rmSync(serveUrl, { recursive: true, force: true });
}
