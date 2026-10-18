// Capturas de sonorbooks.com para «Los 10 mejores · Fantasía» (1440 px CSS de ancho, a 2x) y posiciones de lo que se señala en el vídeo.
// Uso: node tools/t10f_web.mjs  → video/public/t10f/web/sb_*.jpg y sb_boxes.json
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const OUT = new URL('../video/public/t10f/web/', import.meta.url).pathname;
const PAGES = [
  { name: 'acotar', url: 'https://sonorbooks.com/es/audiolibro/una-corte-de-rosas-y-espinas/', h: 830 },
  { name: 'comunidad', url: 'https://sonorbooks.com/es/audiolibro/la-comunidad-del-anillo/', h: 830 },
  { name: 'home', url: 'https://sonorbooks.com/es/', h: 900 },
];
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--disable-blink-features=AutomationControlled'] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: 'es-ES',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36' });
const boxes = {};
for (const p of PAGES) {
  const page = await ctx.newPage();
  await page.setViewportSize({ width: 1440, height: p.h });
  await page.goto(p.url, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(2500);
  // quita banners de cookies si los hay
  await page.evaluate(() => { for (const el of document.querySelectorAll('[class*="cookie"], [id*="cookie"]')) el.remove(); });
  await page.screenshot({ path: `${OUT}sb_${p.name}.jpg`, type: 'jpeg', quality: 90 });
  boxes[p.name] = await page.evaluate(() => {
    const out = {};
    const r = (el) => { const b = el.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; };
    const all = [...document.querySelectorAll('body *')].filter((e) => e.children.length < 4 && e.getBoundingClientRect().height > 0 && e.getBoundingClientRect().y < 900);
    const find = (re) => all.find((e) => re.test(e.textContent.trim()) && e.textContent.trim().length < 80);
    const pick = { rating: /valoraciones$/, price: /^0 €$/, cta: /^Empezar prueba gratuita$/, options: /^Opciones analizadas/, trial: /30 días de prueba/, h1: /./ };
    for (const [k, re] of Object.entries(pick)) { const el = k === 'h1' ? document.querySelector('h1') : find(re); if (el) out[k] = r(el); }
    out.cards = [...document.querySelectorAll('a, article, div')].filter((e) => /días gratis|30 días/.test(e.textContent) && e.textContent.length < 160 && e.getBoundingClientRect().y < 900).slice(0, 6).map(r);
    return out;
  });
  console.log(p.name, JSON.stringify(boxes[p.name]));
  await page.close();
}
fs.writeFileSync(`${OUT}sb_boxes.json`, JSON.stringify(boxes, null, 1));
await browser.close();
