import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage();
await page.setContent(fs.readFileSync('rayo.html', 'utf8'), { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const css = "font-family: Georgia, serif; font-size: 7.5pt; color: #8a8a8a; width: 100%; padding: 0 18mm; display: flex; justify-content: space-between;";
await page.pdf({ path: 'El_rayo_de_luna-Becquer.pdf', format: 'A5', printBackground: true, displayHeaderFooter: true, margin: { top: '22mm', bottom: '20mm', left: '18mm', right: '18mm' },
  headerTemplate: `<div style="${css}"><span>Gustavo Adolfo Bécquer · Leyendas</span><span>El rayo de luna</span></div>`,
  footerTemplate: `<div style="${css} justify-content: center;"><span>— <span class="pageNumber"></span> —</span></div>` });
await browser.close();
console.log('ok');
