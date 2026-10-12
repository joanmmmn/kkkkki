// Capturas 4K de librivox.org (1280×720 a 3x = 3840×2160) para el vídeo y la página de LibriVox.
// Las imágenes de archive.org que fallan en su servidor principal se piden a su réplica (d1/d2 de la API de metadatos).
// Uso: node tools/lv_capture.mjs [solo_id,...]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const OUT = 'captures/librivox/web';
fs.mkdirSync(OUT, { recursive: true });
const only = process.argv[2] ? new Set(process.argv[2].split(',')) : null;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
const meta = {};
const mirrorFetch = async (url) => {
  let r = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (r.ok) return r;
  const m = url.match(/archive\.org\/download\/([^/]+)\/(.+)$/);
  if (!m) return r;
  const [, item, file] = m;
  if (!meta[item]) meta[item] = await (await fetch(`https://archive.org/metadata/${item}`, { headers: { 'User-Agent': UA } })).json();
  for (const h of meta[item].workable_servers || [meta[item].d1, meta[item].d2]) {
    const r2 = await fetch(`https://${h}${meta[item].dir}/${file}`, { headers: { 'User-Agent': UA } });
    if (r2.ok) return r2;
  }
  return r;
};
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--hide-scrollbars', '--font-render-hinting=none'] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 3, locale: 'es-ES', userAgent: UA });
await ctx.route(/archive\.org\/download\/.*\.(jpg|png|gif)$/i, async (route) => {
  try {
    const r = await mirrorFetch(route.request().url());
    route.fulfill({ status: r.status, headers: { 'content-type': r.headers.get('content-type') || 'image/jpeg' }, body: Buffer.from(await r.arrayBuffer()) });
  } catch (e) { route.abort(); }
});
const page = await ctx.newPage();
const settle = async (ms = 1500) => {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => { await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 12000); })))); });
  await page.waitForTimeout(ms);
};
const shots = [
  ['home', async () => { await page.goto('https://librivox.org/', { waitUntil: 'networkidle' }); await settle(); }],
  ['home_browse', async () => { await page.goto('https://librivox.org/', { waitUntil: 'networkidle' }); await settle(); await page.evaluate(() => scrollTo(0, 430)); await page.waitForTimeout(600); }],
  ['lang', async () => { await page.goto('https://librivox.org/search?primary_key=0&search_category=language&search_page=1&search_form=get_results&search_order=alpha', { waitUntil: 'networkidle' }); await settle(2500); }],
  ['lang_es', async () => { await page.goto('https://librivox.org/search?primary_key=0&search_category=language&search_page=1&search_form=get_results&search_order=alpha', { waitUntil: 'networkidle' }); await settle(2000); await page.evaluate(() => { const li = [...document.querySelectorAll('.browse-list li, li')].find((l) => /Spanish/.test(l.textContent) && /Completed/.test(l.textContent)); if (li) scrollTo(0, li.getBoundingClientRect().top + scrollY - 300); }); await page.waitForTimeout(600); }],
  ['es_list', async () => { await page.goto('https://librivox.org/search?primary_key=5&search_category=language&search_page=1&search_form=get_results&search_order=alpha', { waitUntil: 'networkidle' }); await settle(3000); }],
  ['search_becquer', async () => { await page.goto('https://librivox.org/search?q=b%C3%A9cquer&search_form=advanced', { waitUntil: 'networkidle' }); await settle(3000); }],
  ['search_quijote', async () => { await page.goto('https://librivox.org/search?q=quijote&search_form=advanced', { waitUntil: 'networkidle' }); await settle(3000); await page.evaluate(() => { const i = document.querySelector('input[name=q], #q, header input[type=text], input[placeholder*="Search"]'); if (i) i.value = 'quijote'; }); await page.waitForTimeout(300); }, true],
  ['book', async () => { await page.goto('https://librivox.org/leyendas-by-gustavo-adolfo-becquer/', { waitUntil: 'networkidle' }); await settle(2000); }, true],
  ['volunteer', async () => { await page.goto('https://librivox.org/pages/volunteer-for-librivox/', { waitUntil: 'networkidle' }); await settle(); }],
  ['forum', async () => { await page.goto('https://forum.librivox.org/', { waitUntil: 'networkidle' }); await settle(); }],
];
for (const [id, go, full] of shots) {
  if (only && !only.has(id)) continue;
  try {
    await go();
    await page.screenshot({ path: `${OUT}/${id}.png`, fullPage: !!full });
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    console.log(id, 'ok', page.url(), 'alto', h);
  } catch (e) { console.log(id, 'ERROR', e.message.split('\n')[0]); }
}
await browser.close();
