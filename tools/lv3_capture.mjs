// Capturas 4K de librivox.org para el vídeo nuevo de LibriVox (lv3): páginas completas (para desplazarse por ellas) y
// las coordenadas (píxeles CSS de página, ventana 1280×720) de lo que señala el vídeo.
// Escribe video/public/lv/web3/*.png y video/public/lv/web3/boxes.json. Uso: node tools/lv3_capture.mjs [solo_id,...]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const OUT = 'video/public/lv/web3';
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
const boxesPath = `${OUT}/boxes.json`;
const out = fs.existsSync(boxesPath) ? JSON.parse(fs.readFileSync(boxesPath, 'utf8')) : {};
const R = (r) => [r.left + scrollX, r.top + scrollY, r.width, r.height].map((v) => Math.round(v * 10) / 10);

// En el navegador: caja del elemento más pequeño con ese texto exacto (o que empieza por él)
const fns = `
window.__R = (r) => [r.left + scrollX, r.top + scrollY, r.width, r.height].map((v) => Math.round(v * 10) / 10);
window.__byText = (t, sel) => {
  const all = [...document.querySelectorAll(sel || 'body *')].filter((e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()));
  const hit = all.find((e) => e.textContent.trim() === t) || all.find((e) => e.textContent.trim().startsWith(t));
  return hit ? __R(hit.getBoundingClientRect()) : null;
};
// Caja de una palabra dentro de un elemento (rango de texto)
window.__word = (el, word) => {
  const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = tw.nextNode())) {
    const i = n.textContent.indexOf(word);
    if (i >= 0) { const rg = document.createRange(); rg.setStart(n, i); rg.setEnd(n, i + word.length); return __R(rg.getBoundingClientRect()); }
  }
  return null;
};
window.__items = (n) => [...document.querySelectorAll('.catalog-result, li.catalog-result, ul.browse-list > li, .results li')].slice(0, n).map((li) => {
  const meta = [...li.querySelectorAll('*')].find((e) => /Complete \\|/.test(e.textContent) && ![...e.children].some((c) => /Complete \\|/.test(c.textContent)));
  const h = li.querySelector('h3');
  const dl = [...li.querySelectorAll('a')].find((a) => a.textContent.trim() === 'Download');
  const img = li.querySelector('img');
  const words = {};
  if (meta) for (const wd of ['Complete', 'Solo', 'Collaborative', 'Spanish', 'Multilingual']) { const b = __word(meta, wd); if (b) words[wd] = b; }
  return { text: li.textContent.replace(/\\s+/g, ' ').trim().slice(0, 110), box: __R(li.getBoundingClientRect()), title: h ? __R(h.getBoundingClientRect()) : null,
    titleText: h ? h.textContent.replace(/\\s+/g, ' ').trim() : null, meta: meta ? __R(meta.getBoundingClientRect()) : null, metaText: meta ? meta.textContent.replace(/\\s+/g, ' ').trim() : null,
    words, download: dl ? __R(dl.getBoundingClientRect()) : null, cover: img ? __R(img.getBoundingClientRect()) : null };
});
`;
const prep = async () => { await page.evaluate(fns); };
const tabs = async (key) => {
  for (const t of ['Author', 'Title', 'Genre/Subject', 'Language']) out[`${key}:tab:${t}`] = await page.evaluate((t) => { const e = [...document.querySelectorAll('a, li, span')].find((x) => x.textContent.trim() === t); if (!e) return null; const li = e.closest('li') || e; return __R(li.getBoundingClientRect()); }, t);
  out[`${key}:browse`] = await page.evaluate(() => __byText('BROWSE THE CATALOG') || __byText('Browse the catalog'));
  out[`${key}:search`] = await page.evaluate(() => { const e = document.querySelector('input[type=text], input[type=search]'); return e ? __R(e.getBoundingClientRect()) : null; });
  out[`${key}:logo`] = await page.evaluate(() => { const e = document.querySelector('.logo, header img, h1'); return e ? __R(e.getBoundingClientRect()) : null; });
};
const shots = [
  ['home_full', async () => {
    await page.goto('https://librivox.org/', { waitUntil: 'networkidle' }); await settle(); await prep();
    await tabs('home');
    for (const t of ['Free public domain audiobooks', 'Read by volunteers from around the world.']) out['home:' + t] = await page.evaluate((t) => __byText(t), t);
  }, { full: true }],
  ['lang_full', async () => {
    await page.goto('https://librivox.org/search?primary_key=0&search_category=language&search_page=1&search_form=get_results&search_order=alpha', { waitUntil: 'networkidle' }); await settle(2500); await prep();
    await tabs('lang');
    for (const t of ['English', 'French', 'German', 'Italian', 'Spanish']) out['lang:' + t] = await page.evaluate((t) => { const a = [...document.querySelectorAll('a, h3, span')].find((x) => x.textContent.trim() === t); if (!a) return null; const li = a.closest('li') || a; return __R(li.getBoundingClientRect()); }, t);
    out['lang:Spanish:name'] = await page.evaluate(() => { const a = [...document.querySelectorAll('a, h3, span')].find((x) => x.textContent.trim() === 'Spanish'); return a ? __R(a.getBoundingClientRect()) : null; });
    out['lang:Spanish:count'] = await page.evaluate(() => { const a = [...document.querySelectorAll('a, h3, span')].find((x) => x.textContent.trim() === 'Spanish'); const li = a && (a.closest('li') || a); return li ? __word(li, 'Completed') : null; });
  }, { full: true, h: 1500 }],
  ['es_full', async () => {
    await page.goto('https://librivox.org/search?primary_key=5&search_category=language&search_page=1&search_form=get_results&search_order=alpha', { waitUntil: 'networkidle' }); await settle(3000); await prep();
    await tabs('es');
    out['es:items'] = await page.evaluate(() => __items(14));
    for (const t of ['Project type', 'solo', 'group', 'Order by']) out['es:' + t] = await page.evaluate((t) => __byText(t), t);
  }, { full: true, h: 2400 }],
  ['search_leyendas', async () => {
    await page.goto('https://librivox.org/search?q=leyendas&search_form=advanced', { waitUntil: 'networkidle' }); await settle(3000); await prep();
    await page.evaluate(() => { const i = document.querySelector('input[type=text], input[type=search]'); if (i) i.value = 'leyendas'; });
    await tabs('sl');
    out['sl:items'] = await page.evaluate(() => __items(12));
  }, { full: true, h: 2000 }],
];
for (const [id, go, opt] of shots) {
  if (only && !only.has(id)) continue;
  try {
    await go();
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(300);
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    const h = Math.min(H, opt.h || H);
    await page.screenshot({ path: `${OUT}/${id}.png`, fullPage: true, clip: { x: 0, y: 0, width: 1280, height: h } });
    out[`${id}:height`] = h;
    console.log(id, 'ok', page.url(), 'alto', H, '→', h);
  } catch (e) { console.log(id, 'ERROR', e.message.split('\n')[0]); }
}
fs.writeFileSync(boxesPath, JSON.stringify(out, null, 1));
console.log(Object.keys(out).length, 'cajas');
await browser.close();
