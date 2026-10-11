// Renderiza una instantánea del DOM (HTML de tools/unsnap.py) en Chromium a 1920×1080 @2x y guarda una captura.
// Uso: node tools/render_snap.mjs <snap.html> <out.png> [ancho alto] [js para retocar antes de capturar]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const [, , src, out, w = '1920', h = '1080', js] = process.argv;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--hide-scrollbars', '--font-render-hinting=none'] });
// TALL=<px>: ventana alta (en vez de captura de página completa) para que todo se rasterice y carguen las imágenes.
const page = await browser.newPage({ viewport: { width: +w, height: +(process.env.TALL || h) }, deviceScaleFactor: 2, locale: 'es-ES' });
await page.route('**/*', (r) => (/\.(js|mjs)(\?|$)/.test(r.request().url()) ? r.abort() : r.continue()));
await page.setContent(fs.readFileSync(src, 'utf8'), { waitUntil: 'networkidle', timeout: 60000 });
await page.evaluate(() => document.querySelectorAll('[data-snap-value]').forEach((el) => { el.value = el.getAttribute('data-snap-value'); }));
await page.evaluate(() => document.querySelectorAll('[data-snap-scroll]').forEach((el) => { const [x, y] = el.getAttribute('data-snap-scroll').split(',').map(Number); el.scrollLeft = x; el.scrollTop = y; }));
// La copia se tomó con el panel oculto: las animaciones de entrada (framer-motion) y la carga diferida de imágenes
// pueden haberse quedado a medias. Se fuerzan a su estado final.
if (process.env.NOFIX !== '1') await page.evaluate(async () => {
  // La copia saneada no guarda los id; la hoja de estilos del lector cuelga de #preview-content.
  const pc = document.querySelector('.font-inter > [role=presentation]');
  if (pc && !document.getElementById('preview-content')) { pc.id = 'preview-content'; if (pc.parentElement.parentElement) pc.parentElement.parentElement.id = 'preview-content-container'; }
  document.querySelectorAll('img').forEach((i) => { i.classList.remove('opacity-0'); i.style.opacity = '1'; i.loading = 'eager'; });
  document.querySelectorAll('[style*="opacity: 0"]').forEach((el) => { if (el.getBoundingClientRect().width > 40 && !el.closest('[role=tooltip]')) el.style.opacity = '1'; });
  await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 8000); }))));
});
if (js) await page.evaluate(js);
await page.waitForTimeout(800);
await page.screenshot({ path: out, fullPage: process.env.FULL === '1' });
await browser.close();
console.log('OK', out);
