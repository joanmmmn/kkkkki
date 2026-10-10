// Repite pasos de navegación (como steps.mjs) y mide rectángulos de elementos en el viewport.
// Uso: node tools/measure.mjs '<json steps>'  — paso {measure: "nombre", js: "expresión que devuelve rects"}
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const steps = JSON.parse(process.argv[2]);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
const out = {};
for (const s of steps) {
  try {
    if (s.go) await page.goto(s.go, { waitUntil: 'networkidle', timeout: 60000 });
    if (s.clickSel) await page.locator(s.clickSel).first().click();
    if (s.clickText) await page.getByText(s.clickText, { exact: true }).first().click();
    if (s.type) { await page.locator(s.sel).first().click(); await page.keyboard.type(s.type, { delay: 20 }); }
    if (s.press) await page.keyboard.press(s.press);
    if (s.xy) await page.mouse.click(s.xy[0], s.xy[1]);
    if (s.wait) await page.waitForTimeout(s.wait);
    if (s.measure) out[s.measure] = await page.evaluate(s.js);
  } catch (e) { out[s.measure || 'error'] = String(e.message).split('\n')[0]; }
}
console.log(JSON.stringify(out, null, 1));
await browser.close();
