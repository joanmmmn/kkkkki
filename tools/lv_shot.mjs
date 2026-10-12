// Capturas de librivox.org (web pública) para el vídeo y la página: 1920×1080 a 2x (4K).
// Uso: node tools/lv_shot.mjs <url> <out.png> [--full] [--w 1920] [--h 1080] [--dpr 2] [--js "código"] [--wait 1500]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const a = process.argv.slice(2);
const [url, out] = a;
const opt = (k, d) => { const i = a.indexOf('--' + k); return i >= 0 ? a[i + 1] : d; };
const full = a.includes('--full');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--hide-scrollbars', '--font-render-hinting=none'] });
const page = await browser.newPage({ viewport: { width: +opt('w', 1920), height: +opt('h', 1080) }, deviceScaleFactor: +opt('dpr', 2), locale: 'es-ES',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36' });
await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
await page.evaluate(() => document.fonts.ready);
const js = opt('js', '');
if (js) await page.evaluate(js);
await page.waitForTimeout(+opt('wait', 1500));
await page.screenshot({ path: out, fullPage: full });
const dims = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.scrollHeight]);
console.log(JSON.stringify({ out, dims }));
await browser.close();
