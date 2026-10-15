// Captura de página completa a 2x (para animar desplazamientos en Remotion sin grabar vídeo).
// Uso: node tools/fullpage.mjs <url> <salida.png> ["js de preparación (cerrar avisos, etc.)"]
// Solo páginas públicas: no inicia sesión ni rellena nada. Las cookies se rechazan o se quita el aviso.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const [, , url, out, prep] = process.argv;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--hide-scrollbars'] });
const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2, locale: 'es-ES' });
const p = await ctx.newPage();
await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch((e) => console.log('goto', e.message));
await p.waitForTimeout(2500);
if (prep) await p.evaluate(prep).catch((e) => console.log('prep', e.message));
await p.waitForTimeout(800);
// Baja hasta el final para que carguen las imágenes perezosas y vuelve arriba.
await p.evaluate(async () => {
  for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
  window.scrollTo(0, 0);
});
await p.waitForTimeout(1200);
await p.screenshot({ path: out, fullPage: true });
console.log('altura', await p.evaluate(() => document.documentElement.scrollHeight));
await b.close();
