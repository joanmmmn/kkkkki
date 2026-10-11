// Quita del HTML local del portal de facturación las secciones con datos personales (método de pago, datos de
// facturación, historial de facturas) y deja solo «Suscripción actual».
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const [, , file] = process.argv;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage();
await page.route('**/*', (r) => r.abort());
await page.setContent(fs.readFileSync(file, 'utf8'));
const removed = await page.evaluate(() => {
  const re = /^(método de pago|datos de facturación|historial de facturas)$/i;
  const heads = [...document.querySelectorAll('*')].filter((e) => e.children.length === 0 && re.test(e.textContent.trim()));
  let n = 0;
  for (const h of heads) {
    let s = h;
    while (s.parentElement && !/suscripción actual/i.test(s.parentElement.textContent)) s = s.parentElement;
    s.remove(); n++;
  }
  return n;
});
const html = '<!doctype html>\n' + (await page.evaluate(() => document.documentElement.outerHTML));
fs.writeFileSync(file, html);
console.log('secciones quitadas:', removed, '· quedan datos:', /lleida|Caduca|Mastercard/i.test(html.replace(/<[^>]+>/g, ' ')));
await browser.close();
