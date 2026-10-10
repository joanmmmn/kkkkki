// Ejecuta una secuencia de pasos en Chromium y guarda capturas 2x.
// Uso: node steps.mjs <outdir> '<json steps>' [width height mobile]
// step: {go:url} | {click:"texto"} | {clickSel:"css"} | {type:"texto", sel:"css"} | {press:"Enter"} | {wait:ms} | {shot:"nombre", full:true} | {scroll:px} | {dump:"nombre"}
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const [,, out, stepsJson, w = '1920', h = '1080', mobile] = process.argv;
fs.mkdirSync(out, { recursive: true });
const steps = JSON.parse(stepsJson);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const ctxOpts = mobile ? { ...devices['iPhone 14 Pro Max'], locale: 'es-ES' } : { viewport: { width: +w, height: +h }, deviceScaleFactor: 2, locale: 'es-ES' };
const ctx = await browser.newContext(ctxOpts);
const page = await ctx.newPage();
for (const s of steps) {
  try {
    if (s.go) await page.goto(s.go, { waitUntil: 'networkidle', timeout: 60000 });
    if (s.click) await page.getByText(s.click, { exact: !!s.exact }).first().click({ timeout: 15000 });
    if (s.clickSel) await page.locator(s.clickSel).first().click({ timeout: 15000 });
    if (s.type) { await page.locator(s.sel).first().click(); await page.keyboard.type(s.type, { delay: 60 }); }
    if (s.press) await page.keyboard.press(s.press);
    if (s.scroll) await page.mouse.wheel(0, s.scroll);
    if (s.xy) await page.mouse.click(s.xy[0], s.xy[1]);
    if (s.move) await page.mouse.move(s.move[0], s.move[1], { steps: 10 });
    if (s.wait) await page.waitForTimeout(s.wait);
    if (s.shot) await page.screenshot({ path: `${out}/${s.shot}.png`, fullPage: !!s.full });
    if (s.dump) {
      const data = await page.evaluate(() => ({ url: location.href, title: document.title, text: document.body.innerText }));
      fs.writeFileSync(`${out}/${s.dump}.txt`, `URL: ${data.url}\nTITLE: ${data.title}\n\n${data.text}`);
      console.log('dump', s.dump, data.url);
    }
    if (s.eval) console.log("eval:", JSON.stringify(await page.evaluate(s.eval)));
    if (s.html) fs.writeFileSync(`${out}/${s.html}.html`, await page.content());
  } catch (e) { console.log('step failed', JSON.stringify(s), e.message.split('\n')[0]); }
}
console.log('final url:', page.url());
await browser.close();
