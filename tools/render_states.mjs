// Renderiza estados (4K) de las réplicas saneadas de ElevenReader, con retoques de DOM por estado.
// Uso: node tools/render_states.mjs <estados.mjs> [filtro]
//   estados.mjs exporta por defecto [{ src, out, js?, w?, h?, tall? }]; `js` se evalúa tras cargar la réplica
//   (con los arreglos de tools/render_snap.mjs ya aplicados) y con los ayudantes de window.__h disponibles.
//   `filtro`: solo los estados cuyo `out` contiene ese texto.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [, , defs, filter] = process.argv;
const states = (await import(pathToFileURL(path.resolve(defs)).href)).default.filter((s) => !filter || filter.split(',').some((f) => s.out.includes(f)));
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--hide-scrollbars', '--font-render-hinting=none'] });
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2, locale: 'es-ES' });
const page = await ctx.newPage();
await page.route('**/*', (r) => (/\.(js|mjs)(\?|$)/.test(r.request().url()) ? r.abort() : r.continue()));

const helpers = `
window.__h = {
  // Hojas sin hijos cuyo texto es exactamente t.
  leaf: (t, root = document.body) => [...root.querySelectorAll('*')].filter((e) => e.children.length === 0 && e.textContent.trim() === t),
  // El elemento más pequeño que contiene el texto t.
  el: (t, root = document.body) => { const c = [...root.querySelectorAll('*')].filter((e) => e.textContent.includes(t)); return c[c.length - 1]; },
  para: (start) => [...document.querySelectorAll('#preview-content p, #preview-content h1, #preview-content h2')].find((p) => p.textContent.trim().startsWith(start)),
  clearHL: () => {
    document.querySelectorAll('#preview-content .active').forEach((e) => e.classList.remove('active'));
    document.querySelectorAll('#preview-content .active-sentence').forEach((e) => e.classList.remove('active-sentence'));
    document.querySelectorAll('#preview-content .highlight-box').forEach((e) => e.remove());
  },
  // Resalta el párrafo que empieza por pStart (cajas por línea, como la app) y la palabra wi.
  hl: (pStart, wi) => {
    __h.clearHL();
    const p = __h.para(pStart); if (!p) return;
    p.classList.add('active-sentence'); p.style.position = 'relative';
    // En la app las cajas (z-index -2) quedan por encima del fondo del lector: se aísla el contenedor para que se vean igual.
    document.getElementById('preview-content').style.isolation = 'isolate';
    const lh = parseFloat(getComputedStyle(p).lineHeight) || 32;
    const lines = Math.round(p.getBoundingClientRect().height / lh);
    for (let k = 0; k < lines; k++) { const d = document.createElement('div'); d.className = 'highlight-box'; d.style.cssText = 'position:absolute;left:0;top:' + (lh * k + (lh - 20) / 2) + 'px;width:100%;height:20px;pointer-events:none;'; p.appendChild(d); }
    const spans = [...p.querySelectorAll(':scope > span')];
    if (wi != null && spans[wi]) spans[wi].classList.add('active');
  },
  // Botón grande central (play/pausa) de la barra del reproductor.
  playBtn: () => [...document.querySelectorAll('button')].find((b) => { const r = b.getBoundingClientRect(); return r.width >= 40 && r.width <= 70 && Math.abs(r.x + r.width / 2 - 960) < 40 && r.y > 960; }),
  times: () => [...document.querySelectorAll('span,div,p')].filter((e) => e.children.length === 0 && /^-?\\d\\d:\\d\\d$/.test(e.textContent.trim())),
  setTimes: (a, b) => { const t = __h.times(); if (t[0]) t[0].textContent = a; if (t[1]) t[1].textContent = b; },
  remove: (sel) => document.querySelectorAll(sel).forEach((e) => e.remove()),
  // Panel lateral (Voices / Preferences): el contenedor fijo más externo que contiene ese título.
  panel: (title) => { let e = __h.leaf(title).find((x) => x.getBoundingClientRect().x > 1300); while (e && e.parentElement && e.parentElement !== document.body && e.parentElement.getBoundingClientRect().x > 1300) e = e.parentElement; return e; },
};`;

const fix = async () => {
  await page.evaluate(() => document.querySelectorAll('[data-snap-value]').forEach((el) => { el.value = el.getAttribute('data-snap-value'); }));
  await page.evaluate(() => document.querySelectorAll('[data-snap-scroll]').forEach((el) => { const [x, y] = el.getAttribute('data-snap-scroll').split(',').map(Number); el.scrollLeft = x; el.scrollTop = y; }));
  await page.evaluate(async () => {
    const pc = document.querySelector('.font-inter > [role=presentation]');
    if (pc && !document.getElementById('preview-content')) { pc.id = 'preview-content'; if (pc.parentElement.parentElement) pc.parentElement.parentElement.id = 'preview-content-container'; }
    document.querySelectorAll('img').forEach((i) => { i.classList.remove('opacity-0'); i.style.opacity = '1'; i.loading = 'eager'; });
    document.querySelectorAll('[style*="opacity: 0"]').forEach((el) => { if (el.getBoundingClientRect().width > 40 && !el.closest('[role=tooltip]')) el.style.opacity = '1'; });
    await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 8000); }))));
  });
  await page.evaluate(helpers);
};

let loaded = null;
for (const s of states) {
  const w = s.w || 1920, h = s.tall || s.h || 1080;
  await page.setViewportSize({ width: w, height: h });
  // Se recarga la réplica en cada estado: así los retoques de uno no se arrastran al siguiente.
  await page.setContent(fs.readFileSync(s.src, 'utf8'), { waitUntil: 'networkidle', timeout: 60000 });
  loaded = s.src;
  await fix();
  if (s.js) await page.evaluate(s.js);
  await page.waitForTimeout(s.wait ?? 400);
  fs.mkdirSync(path.dirname(s.out), { recursive: true });
  await page.screenshot({ path: s.out, clip: s.clip });
  console.log('OK', s.out);
}
await browser.close();
