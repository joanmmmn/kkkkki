// Sirve una carpeta (vista previa de un Artifact o página) y hace capturas con Chromium.
// Uso: node tools/shot_page.mjs <carpeta> <salida.png> [ancho=1440] [alto=900] [--full] [--dpr 2] [--wrap] [--scroll Y] [--wait ms] [--js "código"] [--path /ruta/]
// --wrap envuelve index.html en el esqueleto que añade el Artifact (doctype, viewport, reset).
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const [dir, out, w = '1440', h = '900'] = args.filter((a, i) => !a.startsWith('--') && !['--dpr', '--scroll', '--wait', '--js', '--path'].includes(args[i - 1]));
const wrap = args.includes('--wrap');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const SKEL_HEAD = '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body>';
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(dir, p);
  if (!f.startsWith(path.resolve(dir)) && !f.startsWith(dir)) { res.writeHead(403); res.end(); return; }
  fs.readFile(f, (err, data) => {
    if (err) { res.writeHead(404); res.end(); return; }
    if (wrap && p === '/index.html') data = Buffer.from(SKEL_HEAD + data.toString() + '</body></html>');
    res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' });
    res.end(data);
  });
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--hide-scrollbars', '--font-render-hinting=none'] });
const ctx = await browser.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: +flag('--dpr', '1'), locale: 'es-ES', ignoreHTTPSErrors: true });
const page = await ctx.newPage();
const logs = [];
page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) logs.push(`${m.type()}: ${m.text()}`); });
page.on('pageerror', (e) => logs.push(`pageerror: ${e.message}`));
page.on('requestfailed', (r) => logs.push(`failed: ${r.url().slice(0, 120)} ${r.failure()?.errorText}`));
await page.goto(`http://127.0.0.1:${port}${flag('--path', '/')}`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
if (flag('--js')) await page.evaluate(flag('--js'));
if (flag('--scroll')) { await page.evaluate((y) => window.scrollTo(0, y), +flag('--scroll')); }
await page.waitForTimeout(+flag('--wait', '600'));
await page.screenshot({ path: out, fullPage: args.includes('--full') });
const dims = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, sh: document.documentElement.scrollHeight }));
console.log(JSON.stringify({ out, ...dims, overflowX: dims.sw > dims.cw }));
if (logs.length) console.log(logs.join('\n'));
await browser.close();
server.close();
