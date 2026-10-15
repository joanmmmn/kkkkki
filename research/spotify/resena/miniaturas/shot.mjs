import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [dir, ...names] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
for (const n of names) {
  await page.goto(`file://${dir}/${n}.html`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.body.dataset.ready, null, { timeout: 30000 });
  await page.waitForTimeout(300);
  console.log(n, await page.evaluate(() => document.body.dataset.ready), await page.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family).join(',')));
  await page.screenshot({ path: `${dir}/${n}.png`, clip: { x: 0, y: 0, width: 1280, height: 720 } });
}
await browser.close();
