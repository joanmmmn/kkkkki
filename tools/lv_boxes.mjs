// Coordenadas (píxeles CSS de página, ventana 1280×720) de los elementos de librivox.org que señala el vídeo.
// Escribe video/public/lv/web/boxes.json. Uso: node tools/lv_boxes.mjs
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, userAgent: UA });
// Las imágenes de archive.org se piden a la réplica si el servidor principal falla (igual que en lv_capture.mjs),
// para que la maquetación (portada de 175 px) sea la misma que en las capturas.
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
await page.route(/archive\.org\/download\/.*\.(jpg|png|gif)$/i, async (route) => {
  try { const r = await mirrorFetch(route.request().url()); route.fulfill({ status: r.status, headers: { 'content-type': r.headers.get('content-type') || 'image/jpeg' }, body: Buffer.from(await r.arrayBuffer()) }); } catch (e) { route.abort(); }
});
const out = {};
const box = async (name, fn, arg) => {
  const b = await page.evaluate(fn, arg);
  out[name] = b ? b.map((v) => Math.round(v)) : null;
};
// Caja [x, y, w, h] (coordenadas de página) del elemento más pequeño cuyo texto coincide exactamente.
const byText = (t) => {
  const all = [...document.querySelectorAll('body *')].filter((e) => e.children.length === 0 || [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()));
  const hit = all.find((e) => e.textContent.trim() === t) || all.find((e) => e.textContent.trim().startsWith(t));
  if (!hit) return null;
  const r = hit.getBoundingClientRect();
  return [r.left + scrollX, r.top + scrollY, r.width, r.height];
};
const bySel = (s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return [r.left + scrollX, r.top + scrollY, r.width, r.height]; };
const rowOf = (t) => {
  const a = [...document.querySelectorAll('a')].find((x) => x.textContent.trim() === t);
  if (!a) return null; const tr = a.closest('tr') || a.closest('li') || a.parentElement; const r = tr.getBoundingClientRect();
  return [r.left + scrollX, r.top + scrollY, r.width, r.height];
};

await page.goto('https://librivox.org/', { waitUntil: 'networkidle' });
for (const t of ['Free public domain audiobooks', 'Read by volunteers from around the world.', 'VOLUNTEER', 'CATALOG', 'BROWSE THE CATALOG', 'Language', 'Author', 'Title', 'Genre/Subject']) await box('home:' + t, byText, t);
await box('home:search', bySel, 'input[type=text]');
for (const t of ['Volunteer', 'Catalog', 'Browse the catalog']) await box('home:' + t, (t) => { const e = [...document.querySelectorAll('a, h3, h2, div, span, p')].find((x) => x.textContent.trim().toLowerCase() === t.toLowerCase()); if (!e) return null; const r = e.getBoundingClientRect(); return [r.left + scrollX, r.top + scrollY, r.width, r.height]; }, t);
for (const t of ['LibriVox audiobooks are read by volunteers', 'LibriVox audiobooks are free for anyone']) await box('home:p:' + t, (t) => { const e = [...document.querySelectorAll('p')].find((x) => x.textContent.trim().startsWith(t)); if (!e) return null; const r = e.getBoundingClientRect(); return [r.left + scrollX, r.top + scrollY, r.width, r.height]; }, t);
await box('home:logo', bySel, 'img[alt*=librivox], .logo, h1');

await page.goto('https://librivox.org/search?primary_key=0&search_category=language&search_page=1&search_form=get_results&search_order=alpha', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
for (const t of ['English', 'French', 'German', 'Italian', 'Spanish']) await box('lang:' + t, (t) => { const a = [...document.querySelectorAll('a, h3, span')].find((x) => x.textContent.trim() === t); if (!a) return null; const li = a.closest('li') || a; const r = li.getBoundingClientRect(); return [r.left + scrollX, r.top + scrollY, r.width, r.height]; }, t);
await box('lang:LanguageTab', byText, 'Language');

await page.goto('https://librivox.org/search?primary_key=5&search_category=language&search_page=1&search_form=get_results&search_order=alpha', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
out['es_list:items'] = await page.evaluate(() => [...document.querySelectorAll('.catalog-result, li.catalog-result, ul.browse-list > li')].slice(0, 6).map((li) => { const r = li.getBoundingClientRect(); const meta = [...li.querySelectorAll('*')].find((e) => /Complete \|/.test(e.textContent) && e.children.length === 0); const mr = meta ? meta.getBoundingClientRect() : null; return { text: li.textContent.replace(/\s+/g, ' ').trim().slice(0, 80), box: [r.left + scrollX, r.top + scrollY, r.width, r.height].map(Math.round), meta: mr ? [mr.left + scrollX, mr.top + scrollY, mr.width, mr.height].map(Math.round) : null }; }));
for (const t of ['Project type', 'solo', 'group', 'Browsing']) await box('es_list:' + t, byText, t);

await page.goto('https://librivox.org/search?q=quijote&search_form=advanced', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
out['quijote:items'] = await page.evaluate(() => [...document.querySelectorAll('.catalog-result, li.catalog-result, ul.browse-list > li, .results li')].slice(0, 6).map((li) => { const r = li.getBoundingClientRect(); const meta = [...li.querySelectorAll('*')].find((e) => /Complete \|/.test(e.textContent) && e.children.length === 0); const mr = meta ? meta.getBoundingClientRect() : null; return { text: li.textContent.replace(/\s+/g, ' ').trim().slice(0, 90), box: [r.left + scrollX, r.top + scrollY, r.width, r.height].map(Math.round), meta: mr ? [mr.left + scrollX, mr.top + scrollY, mr.width, mr.height].map(Math.round) : null }; }));
await box('quijote:search', bySel, 'input[type=text]');

await page.goto('https://librivox.org/leyendas-by-gustavo-adolfo-becquer/', { waitUntil: 'networkidle' });
for (const t of ['Listen/Download', 'Whole book (zip file)', 'Subscribe by iTunes', 'RSS Feed', 'Download torrent', 'Production details', 'Running Time:', '10:04:53', 'Zip file size:', 'Read by:', 'Proof Listener:', 'Links', 'Internet Archive Page', 'M4B audio book, part 1', 'M4B audio book, part 2', 'Leyendas', 'Language:', 'SECTION', 'CHAPTER', 'READER', 'TIME']) await box('book:' + t, byText, t);
for (const t of ['Download', 'iTunes', 'RSS', 'Torrent']) await box('book:btn:' + t, (t) => { const a = [...document.querySelectorAll('a')].find((x) => x.textContent.trim() === t); if (!a) return null; const r = a.getBoundingClientRect(); return [r.left + scrollX, r.top + scrollY, r.width, r.height]; }, t);
await box('book:cover', bySel, 'img[alt=book-cover-large]');
await box('book:notice', (t) => { const e = [...document.querySelectorAll('p, div')].find((x) => x.textContent.trim().startsWith(t) && x.children.length < 3); if (!e) return null; const r = e.getBoundingClientRect(); return [r.left + scrollX, r.top + scrollY, r.width, r.height]; }, 'LibriVox recordings are Public Domain');
for (const t of ['El rayo de luna', 'El monte de las ánimas', 'El miserere', 'Los ojos verdes', 'Creed en Dios', 'Tres fechas']) {
  await box('book:row:' + t, rowOf, t);
  await box('book:title:' + t, (t) => { const a = [...document.querySelectorAll('a')].find((x) => x.textContent.trim() === t); if (!a) return null; const r = a.getBoundingClientRect(); return [r.left + scrollX, r.top + scrollY, r.width, r.height]; }, t);
}
out['book:readers'] = await page.evaluate(() => [...document.querySelectorAll('table tr')].slice(1).map((tr) => { const tds = [...tr.querySelectorAll('td')]; const r = tr.getBoundingClientRect(); const play = tr.querySelector('a.play-btn, a[class*=play], td:first-child a'); const pr = play ? play.getBoundingClientRect() : null; const rd = tds[2] ? tds[2].getBoundingClientRect() : null; return { sec: tds[0]?.textContent.trim(), title: tds[1]?.textContent.trim(), reader: tds[2]?.textContent.trim(), time: tds[3]?.textContent.trim(), row: [r.left + scrollX, r.top + scrollY, r.width, r.height].map(Math.round), play: pr ? [pr.left + scrollX, pr.top + scrollY, pr.width, pr.height].map(Math.round) : null, readerBox: rd ? [rd.left + scrollX, rd.top + scrollY, rd.width, rd.height].map(Math.round) : null }; }));
out['book:height'] = await page.evaluate(() => document.documentElement.scrollHeight);

await page.goto('https://forum.librivox.org/', { waitUntil: 'networkidle' });
for (const t of ['Post Your 1-Minute Test Recording Here', 'New Here? Introduce Yourself!', 'What is LibriVox & FAQ', 'Register', 'STATISTICS']) await box('forum:' + t, byText, t);

fs.writeFileSync('video/public/lv/web/boxes.json', JSON.stringify(out, null, 1));
console.log(Object.keys(out).length, 'cajas');
await browser.close();
