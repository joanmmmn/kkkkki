// Captura para la tarjeta «Dónde está el botón» de la reseña de ElevenReader: el veredicto rápido con su botón
// «Probar gratis», sobre el fondo real de la página (sin el resto del contenido), en 1200×533.
// Uso: node tools/er_review_button.mjs <carpeta de la vista previa> <salida.png> [ancho de ventana=1000]
// Con 1000 px el botón queda debajo del veredicto y la tarjeta encaja en la proporción de la imagen.
// Escribe también <salida>.json con el rectángulo del botón en % de la imagen (para el aro de la tarjeta).
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const [dir, out, vw = '1000'] = process.argv.slice(2);
const SKEL = '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}[hidden]{display:none!important}</style></head><body>';
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  fs.readFile(path.join(dir, p), (e, d) => {
    if (e) { res.writeHead(404); res.end(); return; }
    if (p === '/index.html') d = Buffer.from(SKEL + d + '</body></html>');
    res.writeHead(200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream' });
    res.end(d);
  });
});
await new Promise((r) => server.listen(0, r));
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--hide-scrollbars', '--font-render-hinting=none'] });
const page = await browser.newPage({ viewport: { width: +vw, height: 1100 }, deviceScaleFactor: 2, locale: 'es-ES', reducedMotion: 'reduce' });
await page.goto(`http://127.0.0.1:${server.address().port}/`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
// Solo el fondo de la portada y la tarjeta del veredicto
await page.addStyleTag({ content: '.er-hero__grid,.er-crumbs,.er-body,.sb-cookie-notice,[data-dock],.er-progress{visibility:hidden!important}' });
await page.waitForTimeout(400);
const box = await page.evaluate(() => {
  const v = document.querySelector('.er-verdict').getBoundingClientRect();
  const b = document.querySelector('.er-deal').getBoundingClientRect();
  return { v: [v.left, v.top, v.width, v.height], b: [b.left, b.top, b.width, b.height] };
});
const R = 1200 / 533, W = Math.round(Math.max(box.v[2] + 64, (box.v[3] + 64) * R)), H = Math.round(W / R);
const x = box.v[0] + box.v[2] / 2 - W / 2, y = box.v[1] + box.v[3] / 2 - H / 2;
await page.screenshot({ path: out, clip: { x, y, width: W, height: H } });
const pct = (v) => `${(v * 100).toFixed(1)}%`;
const pad = 7;
const ring = { x: pct((box.b[0] - pad - x) / W), y: pct((box.b[1] - pad - y) / H), w: pct((box.b[2] + 2 * pad) / W), h: pct((box.b[3] + 2 * pad) / H) };
fs.writeFileSync(out.replace(/\.png$/, '.json'), JSON.stringify(ring));
console.log(JSON.stringify(ring));
await browser.close();
server.close();
