import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: +process.argv[4] || 1200, height: +process.argv[5] || 630 }, deviceScaleFactor: 2 });
await p.goto('file://' + process.argv[2]); await p.waitForTimeout(600);
await p.screenshot({ path: process.argv[3] }); await b.close();
