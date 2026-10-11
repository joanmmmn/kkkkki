// Renderiza varios fotogramas de una composición con un solo bundle (mucho más rápido que llamar a `remotion still` en bucle).
// Uso (desde video/): node scripts/stills.mjs <compId> <outdir> <frame,frame,...> [scale]
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
const [,, id, out, framesArg, scaleArg = '0.5'] = process.argv;
fs.mkdirSync(out, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts'), webpackOverride: (c) => c });
const composition = await selectComposition({ serveUrl, id, inputProps: {} });
for (const f of framesArg.split(',').map(Number)) {
  const output = path.join(out, `${id}_${String(f).padStart(5, '0')}.jpg`);
  await renderStill({ composition, serveUrl, output, frame: Math.min(f, composition.durationInFrames - 1), imageFormat: 'jpeg', jpegQuality: 80, scale: Number(scaleArg) });
  console.log(output);
}
