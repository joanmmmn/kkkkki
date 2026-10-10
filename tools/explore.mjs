// Explora una URL con Chromium: captura de pantalla 2x + texto visible + enlaces.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const [,, url, out, w = '1920', h = '1080'] = process.argv;
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2, locale: 'es-ES' });
await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(e => console.log('goto:', e.message));
await page.waitForTimeout(3000);
await page.screenshot({ path: `${out}/viewport.png` });
await page.screenshot({ path: `${out}/full.png`, fullPage: true });
const text = await page.evaluate(() => document.body.innerText);
const links = await page.evaluate(() => [...document.querySelectorAll('a')].map(a => `${a.innerText.trim().replace(/\s+/g,' ').slice(0,60)} -> ${a.href}`));
fs.writeFileSync(`${out}/text.txt`, text);
fs.writeFileSync(`${out}/links.txt`, [...new Set(links)].join('\n'));
console.log('url:', page.url(), 'title:', await page.title());
await browser.close();
