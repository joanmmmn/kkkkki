// Capturas 4K de las páginas públicas de eBiblio para el vídeo (eb): páginas completas o recortadas y las coordenadas
// (píxeles CSS de página, ventana 1280×720) de lo que señala el vídeo. Solo páginas públicas, sin iniciar sesión y sin
// pulsar «Prestar» ni «Reservar» (son formularios): se leen las páginas tal como las ve cualquiera.
// Escribe video/public/eb/web/*.png y video/public/eb/web/boxes.json. Uso: node tools/eb_capture.mjs [solo_id,...]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const OUT = 'video/public/eb/web';
fs.mkdirSync(OUT, { recursive: true });
const only = process.argv[2] ? new Set(process.argv[2].split(',')) : null;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
const M = 'https://madrid.ebiblio.es';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--hide-scrollbars', '--font-render-hinting=none'] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 3, locale: 'es-ES', userAgent: UA, bypassCSP: true });
const page = await ctx.newPage();
const go = async (url) => {
  try { await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }); }
  catch (e) { console.log('  (sin networkidle)', url); await page.waitForTimeout(4000); }
};
const settle = async (ms = 1500) => {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => { await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 12000); })))); });
  await page.waitForTimeout(ms);
};
const boxesPath = `${OUT}/boxes.json`;
const out = fs.existsSync(boxesPath) ? JSON.parse(fs.readFileSync(boxesPath, 'utf8')) : {};

const fns = `
window.__R = (r) => [r.left + scrollX, r.top + scrollY, r.width, r.height].map((v) => Math.round(v * 10) / 10);
window.__vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
// caja del elemento visible más pequeño cuyo texto es exactamente t (o empieza por t)
window.__byText = (t, sel) => {
  const all = [...document.querySelectorAll(sel || 'body *')].filter((e) => __vis(e) && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()));
  const norm = (s) => s.replace(/\\s+/g, ' ').trim();
  const hit = all.find((e) => norm(e.textContent) === t) || all.find((e) => norm(e.textContent).startsWith(t));
  return hit ? __R(hit.getBoundingClientRect()) : null;
};
window.__sel = (s) => { const e = [...document.querySelectorAll(s)].find(__vis); return e ? __R(e.getBoundingClientRect()) : null; };
// resultados del catálogo: portada, título, autor, recuadro de préstamo, disponibilidad y botón
window.__items = (n) => [...document.querySelectorAll('li.list-details__item')].slice(0, n).map((li) => {
  const q = (s) => li.querySelector(s);
  const box = (e) => (e ? __R(e.getBoundingClientRect()) : null);
  const txt = (e) => (e ? e.textContent.replace(/\\s+/g, ' ').trim() : null);
  const btn = q('form button');
  return { title: txt(q('.details-content__title')), titleBox: box(q('.details-content__title')), cover: box(q('.display-cover-img img')),
    author: txt(q('.contributors')), tx: box(q('.transactions')), avail: txt(q('.availability')) || txt(q('.transaction')),
    availBox: box(q('.availability')), button: btn ? txt(btn.querySelector('.action')) : null, buttonBox: box(btn), box: box(li),
    href: q('a[href^="/resources/"]')?.getAttribute('href') };
});
// widget flotante de accesibilidad de ebiblio.es (tapa la página): fuera de la captura
window.__hideWidgets = () => {
  const ins = document.getElementById('x-insuit-shadow-container'); if (ins) ins.style.display = 'none';
  for (const e of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(e);
    if ((cs.position === 'fixed' || cs.position === 'sticky') && /accesibilidad/i.test(e.textContent || '') && e.getBoundingClientRect().width < 200) e.style.display = 'none';
  }
};
`;
const prep = async () => { await page.evaluate(fns); await page.evaluate(() => __hideWidgets()); };
const header = async (key) => {
  out[`${key}:cuenta`] = await page.evaluate(() => __byText('Mi Cuenta'));
  out[`${key}:buscar`] = await page.evaluate(() => __sel('input[type=search], input[name=q]'));
  out[`${key}:catalogo`] = await page.evaluate(() => __byText('Catálogo', 'nav a, nav li, header a'));
  out[`${key}:logo`] = await page.evaluate(() => __sel('img[alt*="eBiblio" i], .header__logo img, header img:last-of-type'));
};
const filters = async (key) => {
  for (const t of ['Títulos disponibles', 'Audiolibros', 'Libros electrónicos', 'FILTRAR POR', 'Filtrar por', 'IDIOMA', 'Idioma', 'Castellano']) {
    const b = await page.evaluate((t) => __byText(t), t);
    if (b) out[`${key}:f:${t}`] = b;
  }
  out[`${key}:total`] = await page.evaluate(() => __byText('Resultados') || __sel('.search-results__count, .results-count'));
};
const findHref = async (url, title) => {
  await go(url); await settle(800); await prep();
  return page.evaluate((t) => {
    const n = (s) => (s || '').replace(/\s+/g, ' ').trim();
    const as = [...document.querySelectorAll('a[href^="/resources/"]')];
    const a = as.find((x) => n(x.textContent) === t) || as.find((x) => n(x.getAttribute('title')).startsWith(t + ' (Ver'));
    return a ? a.getAttribute('href') : null;
  }, title);
};
const resource = (key, search, title) => async () => {
  const href = await findHref(`${M}/resources?q=${encodeURIComponent(search)}&nature=audio`, title);
  if (!href) throw new Error('sin ficha de ' + title);
  await go(M + href); await settle(2000); await prep();
  await header(key);
  out[`${key}:href`] = href;
  out[`${key}:title`] = await page.evaluate(() => __sel('h1'));
  out[`${key}:titleText`] = await page.evaluate(() => document.querySelector('h1')?.textContent.replace(/\s+/g, ' ').trim());
  out[`${key}:cover`] = await page.evaluate(() => __sel('.display-cover-img img, img.cover'));
  out[`${key}:tx`] = await page.evaluate(() => __sel('.transactions'));
  out[`${key}:txText`] = await page.evaluate(() => document.querySelector('.transactions')?.textContent.replace(/\s+/g, ' ').trim());
  out[`${key}:avail`] = await page.evaluate(() => __sel('.availability'));
  out[`${key}:button`] = await page.evaluate(() => __sel('.transactions form button, .transactions button'));
  out[`${key}:buttonText`] = await page.evaluate(() => document.querySelector('.transactions form button .action, .transactions button')?.textContent.replace(/\s+/g, ' ').trim());
  out[`${key}:muestra`] = await page.evaluate(() => __byText('Vista previa') || __byText('Muestra'));
  for (const t of ['Narrador', 'Editor', 'Idioma', 'Duración']) { const b = await page.evaluate((t) => __byText(t), t); if (b) out[`${key}:${t}`] = b; }
};

const shots = [
  ['portal', async () => {
    await go('https://ebiblio.es/inicio.html'); await settle(2500); await prep();
    out['portal:comunidades'] = await page.evaluate(() => {
      const r = {};
      for (const a of document.querySelectorAll('a[href*=".ebiblio.es"]')) { const t = (a.textContent.trim() || a.querySelector('img')?.alt || '').replace(/^Enlace a /, '').replace(/\s+/g, ' ').trim(); if (t && __vis(a)) r[t] = __R(a.getBoundingClientRect()); }
      return r;
    });
    out['portal:web'] = await page.evaluate(() => __byText('eBiblio desde la web'));
    out['portal:app'] = await page.evaluate(() => __byText('eBiblio desde la app'));
  }, { h: 2600 }],
  ['alta', async () => { await go('https://ebiblio.es/alta.html'); await settle(2000); await prep(); }, { h: 4200 }],
  ['mhome', async () => {
    await go(M + '/'); await settle(2500); await prep();
    await header('mhome');
    out['mhome:crear'] = await page.evaluate(() => __byText('Crear una cuenta'));
    out['mhome:nuevosAudio'] = await page.evaluate(() => __byText('Nuevos audiolibros'));
  }, { h: 2600 }],
  ['maudio', async () => {
    await go(M + '/resources?nature=audio'); await settle(2500); await prep();
    await header('maudio'); await filters('maudio');
    out['maudio:items'] = await page.evaluate(() => __items(8));
  }, { h: 2400 }],
  ['mavail', async () => {
    await go(M + '/resources?nature=audio&availability=available'); await settle(2500); await prep();
    await header('mavail'); await filters('mavail');
    out['mavail:items'] = await page.evaluate(() => __items(8));
  }, { h: 2400 }],
  ['mgm', async () => {
    await go(M + '/resources?q=' + encodeURIComponent('García Márquez') + '&nature=audio'); await settle(2500); await prep();
    await header('mgm'); await filters('mgm');
    out['mgm:items'] = await page.evaluate(() => __items(11));
  }, { h: 3700 }],
  ['rotono', resource('rotono', 'El otoño del patriarca', 'El otoño del patriarca'), { h: 1500 }],
  ['rcien', resource('rcien', 'Cien años de soledad', 'Cien años de soledad'), { h: 1500 }],
  ['rsapiens', resource('rsapiens', 'Sapiens', 'Sapiens. De animales a dioses'), { h: 1500 }],
  ['mlogin', async () => {
    await go(M + '/ebiblio_auth_sign_in'); await settle(1500); await prep();
    for (const [k, t] of [['ident', 'Identificación'], ['usuario', 'Usuario:'], ['contrasena', 'Contraseña:'], ['conectarse', 'Conectarse'], ['aviso', '¡Atención!']]) out[`mlogin:${k}`] = await page.evaluate((t) => __byText(t), t);
    out['mlogin:inputs'] = await page.evaluate(() => [...document.querySelectorAll('input[type=text], input[type=password], input[name*=user], input[name*=pass]')].filter(__vis).map((e) => __R(e.getBoundingClientRect())));
  }, { h: 900 }],
  ['mabout', async () => { await go(M + '/about'); await settle(1500); await prep(); }, { h: 3000 }],
  ['cifras', async () => { await go('https://ebiblio.es/en-cifras-2025.html'); await settle(2500); await prep(); }, { h: 5200 }],
];
for (const [id, fn, opt] of shots) {
  if (only && !only.has(id)) continue;
  try {
    await fn();
    await page.addStyleTag({ content: '#x-insuit-shadow-container, .insuit-tab { display: none !important; }' });
    await page.evaluate(() => document.querySelectorAll('#x-insuit-shadow-container').forEach((e) => e.remove()));
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(400);
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    const h = Math.min(H, opt.h || H);
    await page.screenshot({ path: `${OUT}/${id}.png`, fullPage: true, clip: { x: 0, y: 0, width: 1280, height: h } });
    out[`${id}:height`] = h;
    out[`${id}:url`] = page.url();
    console.log(id, 'ok', page.url(), 'alto', H, '→', h);
  } catch (e) { console.log(id, 'ERROR', e.message.split('\n')[0]); }
}
out['_fecha'] = '2026-10-14';
fs.writeFileSync(boxesPath, JSON.stringify(out, null, 1));
console.log(Object.keys(out).length, 'claves');
await browser.close();
