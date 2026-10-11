// Reconstruye en 4K pantallas privadas de Nextory (con sesión iniciada) a partir de su <main> capturado en el navegador
// de Joan: carga la página pública de registro (misma maqueta y CSS global), añade las hojas de estilo de la página
// privada y sustituye el <main>. Sin datos personales: los campos de tarjeta son iframes de Adyen y no se capturan.
import fs from 'node:fs';
import path from 'node:path';

export const SHELL = 'https://nextory.com/es/profile/registration?code=lecturasgratis30&cb=%2Fes%2Fregister%2Fplaninfo%3Fcode%3Dlecturasgratis30';
export const CSS = ['NxPaymentLogos.DAgYoYQh', 'StickyButton.CeLOhqH_', 'entry.BWPASeIg', 'PopIn.CJGqazOh', 'NxFooter.D22n7Pe9',
  'RegistrationLayout.DvmVDmsH', 'planform.BrI18nLr', 'AccordionCompact.B9e23yTl', 'payment-mode.BfNzozP6'].map((n) => `https://nextory.com/_nuxt/${n}.css`);

// JS que, ejecutado en la página de registro, monta la pantalla capturada. `edits`: [selector, propiedad, valor] opcionales.
export const injectJs = (mainFile, edits = []) => {
  const html = fs.readFileSync(path.resolve(mainFile), 'utf8');
  return `(async () => {
    const css = ${JSON.stringify(CSS)};
    await Promise.all(css.map((href) => new Promise((res) => { if (document.querySelector('link[href="' + href + '"]')) return res(); const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; l.onload = l.onerror = res; document.head.appendChild(l); })));
    document.getElementById('CybotCookiebotDialog')?.remove();
    document.querySelector('main').outerHTML = ${JSON.stringify(html)};
    for (const [sel, prop, val] of ${JSON.stringify(edits)}) document.querySelectorAll(sel).forEach((e) => { if (prop === 'text') e.textContent = val; else if (prop === 'remove') e.remove(); else e.style.setProperty(prop, val); });
    window.scrollTo(0, 0);
    await document.fonts.ready;
    await Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })));
    return true;
  })()`;
};

// Botones de Apple Pay y Google Pay (en la página real los pinta un script de terceros que aquí no se carga).
const APPLE = 'M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z';
const G = [['#EA4335', 'M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'],
  ['#4285F4', 'M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'],
  ['#FBBC05', 'M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'],
  ['#34A853', 'M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z']];
export const walletButtonsJs = `(() => {
  const ul = document.querySelector('.adyen-checkout__instant-payment-methods-list'); if (!ul) return false;
  const css = 'display:flex;align-items:center;justify-content:center;gap:6px;height:57px;border-radius:6px;background:#000;color:#fff;font:500 25px -apple-system,"SF Pro Text","Helvetica Neue",Arial,sans-serif;letter-spacing:-0.3px';
  const [a, g] = ul.querySelectorAll('li');
  a.innerHTML = '<div style=\\'' + css + '\\'><svg width="23" height="27" viewBox="0 0 24 24" style="margin-top:-3px"><path fill="#fff" d="${APPLE}"/></svg>Pay</div>';
  g.innerHTML = '<div style=\\'' + css + '\\'><svg width="25" height="25" viewBox="0 0 48 48">${G.map(([c, d]) => `<path fill="${c}" d="${d}"/>`).join('')}</svg>Pay</div>';
  return true;
})()`;

// Estado plegado / desplegado de «Tarjeta de crédito» (la captura es del estado desplegado).
export const collapseCardJs = `(() => {
  const pm = document.querySelector('.adyen-checkout__payment-method--scheme'); if (!pm) return false;
  pm.classList.remove('adyen-checkout__payment-method--selected');
  pm.querySelector('.adyen-checkout__payment-method__name')?.classList.remove('adyen-checkout__payment-method__name--selected');
  const det = pm.querySelector('.adyen-checkout-pm-details-wrapper'); det.setAttribute('aria-hidden', 'true'); det.style.display = 'none';
  const hdr = pm.querySelector('.adyen-checkout__payment-method__header');
  if (!hdr.querySelector('.nx-brands')) {
    const b = document.createElement('span'); b.className = 'nx-brands'; b.style.cssText = 'display:flex;gap:5px;margin-left:auto;align-items:center;padding-right:2px';
    for (const n of ['amex', 'mc', 'visa']) { const i = document.createElement('img'); i.src = 'https://checkoutshopper-live.cdn.adyen.com/checkoutshopper/images/logos/' + n + '.svg'; i.style.cssText = 'height:16px;width:24px;border-radius:3px'; b.appendChild(i); }
    hdr.appendChild(b);
  }
  return true;
})()`;
export const expandCardJs = `(() => {
  const pm = document.querySelector('.adyen-checkout__payment-method--scheme'); if (!pm) return false;
  pm.querySelector('.nx-brands')?.remove();
  pm.classList.add('adyen-checkout__payment-method--selected');
  pm.querySelector('.adyen-checkout__payment-method__name')?.classList.add('adyen-checkout__payment-method__name--selected');
  const det = pm.querySelector('.adyen-checkout-pm-details-wrapper'); det.setAttribute('aria-hidden', 'false');
  det.style.display = ''; det.style.overflow = 'hidden'; det.style.maxHeight = '0px'; det.style.transition = 'none';
  det.getBoundingClientRect();
  det.style.transition = 'max-height 0.4s cubic-bezier(0.2,0.8,0.2,1)'; det.style.maxHeight = '640px';
  return true;
})()`;

// «Elige tu plan»: marca el plan como haría la página (contorno de selección y radio).
export const selectPlanJs = (plan) => `(() => {
  const cards = [...document.querySelectorAll('main input[name=plan]')].map((i) => i.closest('div.tw\\\\:relative'));
  for (const c of cards) { c.classList.remove('tw:outline-3', 'tw:outline-content-accent'); }
  const inp = document.getElementById('plan-${plan}'); inp.checked = true;
  inp.closest('div.tw\\\\:relative').classList.add('tw:outline-3', 'tw:outline-content-accent');
  return true;
})()`;

// Las pantallas reconstruidas no deben navegar ni enviar nada aunque algo se pulse.
export const blockJs = `(() => { if (window.__nxBlock) return true; window.__nxBlock = true;
  document.addEventListener('click', (e) => { if (e.target.closest('main a, main button, main label, main input')) { e.preventDefault(); e.stopImmediatePropagation(); } }, true);
  document.addEventListener('submit', (e) => { e.preventDefault(); e.stopImmediatePropagation(); }, true);
  return true; })()`;
