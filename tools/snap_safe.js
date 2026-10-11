// Copia visual SANEADA del DOM (solo para reconstruir la imagen en 4K en la nube; nunca se publica en el repositorio):
// - sin scripts, iframes, <meta>, <link> que no sean hojas de estilo públicas, plantillas ni campos ocultos
// - por cada elemento solo atributos de presentación (lista blanca, incluidos data-state/aria-* que usa el CSS); fuera href, id, data-* con datos…
// - imágenes y estilos solo de CDN públicos y sin parámetros; las portadas firmadas de img.elevenreader.io solo si apuntan al bucket público
// - campos vacíos; correos electrónicos del texto sustituidos
window.__erSnap = async (name) => {
  const PUBLIC = /^https:\/\/(eleven-public-cdn\.elevenlabs\.io|elevenreader\.io\/_next\/static|elevenreader\.io\/assets|storage\.googleapis\.com\/eleven-public-cdn|fonts\.gstatic\.com|fonts\.googleapis\.com)\//;
  const b64u = (s) => { try { return atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)); } catch (e) { return ''; } };
  const isPublic = (href) => {
    let x; try { x = new URL(href, location.href); } catch (e) { return ''; }
    if (x.host === 'img.elevenreader.io') { const seg = x.pathname.split('/'); return seg.length > 3 && b64u(seg[3]).startsWith('gs://eleven-public-cdn/') ? x.origin + x.pathname : ''; }
    if (x.host === 'elevenreader.io' && x.pathname === '/_next/image') { const inner = x.searchParams.get('url') || ''; if (inner.startsWith('/assets/') || isPublic(inner)) return x.href; return ''; }
    x.search = ''; x.hash = ''; return PUBLIC.test(x.href) ? x.href : '';
  };
  const KEEP = new Set(['class', 'style', 'src', 'alt', 'width', 'height', 'type', 'placeholder', 'checked', 'disabled', 'role', 'rel', 'dir', 'lang', 'media', 'sizes', 'colspan', 'rowspan',
    'viewbox', 'd', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray', 'stroke-dashoffset', 'fill-rule', 'clip-rule', 'xmlns', 'transform', 'x', 'y',
    'rx', 'ry', 'cx', 'cy', 'r', 'points', 'x1', 'y1', 'x2', 'y2', 'opacity', 'fill-opacity', 'stroke-opacity', 'offset', 'stop-color', 'stop-opacity', 'gradientunits', 'gradienttransform',
    'preserveaspectratio', 'clip-path', 'mask', 'filter', 'aria-selected', 'aria-checked', 'aria-expanded', 'aria-pressed', 'aria-current', 'aria-disabled', 'aria-hidden', 'aria-orientation']);
  const KEEP_DATA = /^data-(state|side|align|orientation|disabled|highlighted|selected|active|variant|size|theme|sonner-[a-z-]+|x-position|y-position|rich-colors|styled|mounted|visible|front|expanded|swiping|removed|index|type|placeholder|checked|open|pressed|position|direction|motion|slot|lift|lift-amount|dismissible|swipe-out|swipe-direction|y-position)$/;
  const doc = document.documentElement.cloneNode(true);
  const live = [...document.querySelectorAll('style')], cl = [...doc.querySelectorAll('style')];
  live.forEach((s, i) => { try { if (!s.textContent.trim() && s.sheet && s.sheet.cssRules.length) cl[i].textContent = [...s.sheet.cssRules].map(r => r.cssText).join('\n'); } catch (e) {} });
  // Scroll de contenedores internos (para reproducir la vista exacta)
  const ls = [...document.querySelectorAll('*')], cs = [...doc.querySelectorAll('*')];
  ls.forEach((el, i) => { if ((el.scrollTop || el.scrollLeft) && cs[i]) cs[i].setAttribute('data-snap-scroll', el.scrollLeft + ',' + el.scrollTop); });
  doc.querySelectorAll('script, noscript, iframe, meta, template, object, embed, input[type=hidden], link:not([rel=stylesheet])').forEach(e => e.remove());
  doc.querySelectorAll('link[rel=stylesheet]').forEach(l => { const u = isPublic(l.getAttribute('href') || ''); if (!u) return l.remove(); [...l.attributes].forEach(a => l.removeAttribute(a.name)); l.setAttribute('rel', 'stylesheet'); l.setAttribute('href', u); });
  doc.querySelectorAll('*').forEach(el => {
    if (el.tagName === 'LINK') return;
    for (const a of [...el.attributes]) {
      const n = a.name.toLowerCase();
      if (n === 'data-snap-scroll') continue;
      if (!KEEP.has(n) && !KEEP_DATA.test(n)) { el.removeAttribute(a.name); continue; }
      if (n === 'src') { const u = isPublic(a.value); u ? el.setAttribute('src', u) : el.removeAttribute('src'); }
      if (n === 'style' && /url\(/.test(a.value)) el.setAttribute('style', a.value.replace(/url\(([^)]*)\)/g, (m, u) => { const c = isPublic(u.replace(/["'\s]/g, '')); return c ? `url("${c}")` : 'none'; }));
    }
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') { el.removeAttribute('value'); el.textContent = ''; }
  });
  const walker = document.createTreeWalker(doc, NodeFilter.SHOW_TEXT);
  for (let n; (n = walker.nextNode());) n.nodeValue = n.nodeValue.replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, 'correo@ejemplo.com');
  const head = doc.querySelector('head'); const base = document.createElement('base'); base.setAttribute('href', 'https://elevenreader.io/'); head.prepend(base);
  const meta = { name, path: location.pathname, w: innerWidth, h: innerHeight, sx: scrollX, sy: scrollY, t: new Date().toISOString() };
  const html = '<!doctype html>\n<!-- snapshot ' + JSON.stringify(meta) + ' -->\n' + doc.outerHTML;
  const gz = await new Response(new Blob([html]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer();
  let bin = ''; const u8 = new Uint8Array(gz); for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
  const b = btoa(bin);
  return 'SNAPv1 ' + JSON.stringify(meta) + '\n' + b + '\nPAD' + 'x'.repeat(Math.max(0, 130000 - b.length));
};
'ok'
