// SonorBooks Polska: explora una página como la verá record.mjs (pl-PL, 1920×1080 o móvil) para escribir los pasos de grabación.
// Uso: node tools/pl_probe.mjs <url> <carpeta> [desktop|mobile] ['texto 1' 'texto 2' …]
// - Quita los avisos de cookies conocidos (OneTrust, Cookiebot, Didomi, Usercentrics…) o pulsa sus botones habituales.
// - Guarda viewport.png, full.png (página entera, a 1x) y text.txt, y escribe en probe.json, para cada texto pedido,
//   su rectángulo en la página (y = coordenada en el documento: para colocarlo arriba, window.scrollTo(0, y - 120)).
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';

const [, , url, out, mode = 'desktop', ...texts] = process.argv;
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const ctx = await browser.newContext(mode === 'mobile'
  ? { ...devices['iPhone 14 Pro Max'], deviceScaleFactor: 1, locale: 'pl-PL', timezoneId: 'Europe/Warsaw', extraHTTPHeaders: { 'Accept-Language': 'pl-PL,pl;q=0.9' } }
  : { viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1, locale: 'pl-PL', timezoneId: 'Europe/Warsaw', extraHTTPHeaders: { 'Accept-Language': 'pl-PL,pl;q=0.9' } });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch((e) => console.log('goto:', e.message));
await page.waitForTimeout(4000);
export const COOKIE_JS = `(() => {
  const ids = ['#onetrust-consent-sdk', '#CybotCookiebotDialog', '#didomi-host', '#usercentrics-root', '.cookie-banner', '#cookie-banner', '#cookies', '.cc-window', '#qc-cmp2-container', '.fc-consent-root'];
  for (const s of ids) document.querySelectorAll(s).forEach((e) => e.remove());
  document.documentElement.style.overflow = ''; document.body.style.overflow = '';
})()`;
const labels = ['Rozumiem', 'Akceptuję', 'Akceptuj', 'Zaakceptuj wszystkie', 'Akceptuj wszystkie', 'Zgadzam się', 'Odrzuć', 'Odrzuć wszystkie', 'Tylko niezbędne', 'Accept all', 'Reject all', 'OK'];
for (const l of labels) {
  const b = page.getByRole('button', { name: l, exact: true }).first();
  if (await b.isVisible().catch(() => false)) { await b.click().catch(() => {}); console.log('cookies: pulsado', l); await page.waitForTimeout(800); break; }
}
await page.evaluate(COOKIE_JS).catch(() => {});
await page.waitForTimeout(800);
await page.screenshot({ path: `${out}/viewport.png` });
await page.screenshot({ path: `${out}/full.png`, fullPage: true });
fs.writeFileSync(`${out}/text.txt`, await page.evaluate(() => document.body.innerText));
const found = {};
for (const t of texts) {
  found[t] = await page.evaluate((needle) => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const hits = [];
    while (walker.nextNode()) {
      const n = walker.currentNode;
      if (n.textContent && n.textContent.includes(needle)) {
        const el = n.parentElement; const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) hits.push({ x: Math.round(r.x), y: Math.round(r.y + window.scrollY), w: Math.round(r.width), h: Math.round(r.height), tag: el.tagName });
      }
    }
    return hits.slice(0, 4);
  }, t);
}
const docH = await page.evaluate(() => document.documentElement.scrollHeight);
fs.writeFileSync(`${out}/probe.json`, JSON.stringify({ url: page.url(), title: await page.title(), docH, found }, null, 1));
console.log(JSON.stringify({ url: page.url(), title: await page.title(), docH, found }));
await browser.close();
