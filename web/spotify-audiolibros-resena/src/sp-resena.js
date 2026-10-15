// Audiolibros de Spotify · reseña SonorBooks — interacciones de la página. Sin dependencias, sin cookies y sin guardar nada.
// Todo funciona sin JavaScript (la página se ve completa, con el estado de ejemplo de cada módulo);
// esto añade los bloques que se llenan en la portada y el cambio «Tus horas / La app», el «¿Te bastan 12 horas?»,
// el carrusel, el visor de capturas y el vídeo que se carga al pulsar.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const NB = ' ';
// 10 → «10»; 12.5 → «12,5»
const num = (n) => String(Math.round(n * 100) / 100).replace('.', ',');
// 2.997 → «3,00 €»
const eur = (n) => `${n.toFixed(2).replace('.', ',')}${NB}€`;
const hrs = (n) => `${num(n)}${NB}h`;
// Grupo de botones de opción (role="radio"): una sola parada con el tabulador y las flechas para moverse.
const radios = (box, fn) => {
  if (!box) return;
  const btns = $$('[role="radio"]', box);
  const pick = (b, focus) => {
    btns.forEach((x) => { const on = x === b; x.setAttribute('aria-checked', String(on)); x.tabIndex = on ? 0 : -1; });
    if (focus) b.focus();
    fn(b.dataset.v, b);
  };
  btns.forEach((b, i) => {
    b.tabIndex = b.getAttribute('aria-checked') === 'true' ? 0 : -1;
    b.addEventListener('click', () => pick(b));
    b.addEventListener('keydown', (e) => {
      const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (k) { e.preventDefault(); pick(btns[(i + k + btns.length) % btns.length], true); }
      else if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); pick(btns[e.key === 'Home' ? 0 : btns.length - 1], true); }
    });
  });
};

/* ---------- Portada: los 12 bloques de la tarjeta y el cambio entre tus horas y la app ---------- */
$$('[data-stage]').forEach((stage) => {
  // Al cargar, los bloques se llenan de uno en uno, de 0 a 12 horas, y el número los acompaña.
  const n = $('[data-hcard-n]', stage), m = $('[data-hcard-m]', stage);
  if (n && m && !reduced) {
    m.style.transition = 'none';
    m.style.setProperty('--sp-h', '0');
    n.textContent = '0';
    void m.offsetWidth; // aplica el 0 antes de devolverle la transición
    m.style.transition = '';
    setTimeout(() => {
      m.style.setProperty('--sp-h', '12');
      let t0 = 0;
      const step = (t) => {
        t0 = t0 || t;
        const p = Math.min(1, (t - t0) / 1100);
        n.textContent = String(Math.min(12, Math.floor(p * 12)));
        if (p < 1) requestAnimationFrame(step); else n.textContent = '12';
      };
      requestAnimationFrame(step);
    }, 700);
  }
  const sw = $('[data-switch]', stage); if (!sw) return;
  sw.hidden = false; // sin JavaScript no se muestra: se queda la captura de las horas
  const btns = $$('button', sw), imgs = $$('img[data-k]', stage);
  const set = (v) => {
    stage.dataset.on = v;
    btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === v)));
    // Solo la captura visible cuenta para los lectores de pantalla
    imgs.forEach((im) => (im.dataset.k === v ? im.removeAttribute('aria-hidden') : im.setAttribute('aria-hidden', 'true')));
  };
  let auto = 0;
  const stop = () => { clearInterval(auto); auto = 0; };
  btns.forEach((b) => b.addEventListener('click', () => { stop(); set(b.dataset.v); }));
  if (reduced) return;
  // Se alterna solo mientras se ve; se para con el ratón encima o el foco dentro, y del todo tras tres vueltas
  // (o en cuanto pulsas el interruptor).
  let visible = true, hold = false, turns = 0;
  if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(stage);
  stage.addEventListener('pointerenter', () => { hold = true; });
  stage.addEventListener('pointerleave', () => { hold = false; });
  stage.addEventListener('focusin', () => { hold = true; });
  stage.addEventListener('focusout', () => { hold = false; });
  auto = setInterval(() => {
    if (!visible || hold || document.hidden) return;
    set(stage.dataset.on === 'horas' ? 'app' : 'horas');
    if (++turns >= 6) stop();
  }, 4200);
});

/* ---------- ¿Te bastan 12 horas? ---------- */
// Precios de spotify.com (15/10/2026): Premium Individual 11,99 € con 12 h; Audiolibros+ 8,99 € al mes por 15 h más;
// recarga de 10 h por 9,99 €, de pago único y válida 12 meses. Se gastan en ese orden: el plan, Audiolibros+ y las recargas.
const PREM = 11.99, BASE = 12, PLUS = 8.99, PLUS_H = 15, REC = 9.99, REC_H = 10, SCALE = 60;
// 3,33 meses → «algo más de 3 meses»; 2,5 → «2 meses y medio»; 1,43 → «algo más de un mes»
const meses = (m) => {
  const r = Math.floor(m * 2) / 2;
  const t = r === 1 ? 'un mes' : r === 1.5 ? 'un mes y medio' : Number.isInteger(r) ? `${r} meses` : `${Math.floor(r)} meses y medio`;
  return m - r < 0.05 ? t : `algo más de ${t}`;
};
$$('[data-calc]').forEach((box) => {
  const H = $('[data-calc-h]', box), pCtl = $('[data-calc-p]', box), hout = $('[data-calc-hout]', box);
  const kEl = $('[data-calc-k]', box), name = $('[data-calc-name]', box), price = $('[data-calc-price]', box), why = $('[data-calc-why]', box);
  const seg = Object.fromEntries($$('[data-calc-seg]', box).map((i) => [i.dataset.calcSeg, i]));
  const rows = $$('[data-cap]', box);
  if (!H || !pCtl) return;
  // Sin JavaScript, los controles están desactivados y se ve el ejemplo (15 h al mes, con Premium → recargas)
  $$('[disabled]', box).forEach((el) => { el.disabled = false; });
  let has = ($('[aria-checked="true"]', pCtl)?.dataset.v || 'si') === 'si', last = '';
  const upd = () => {
    const h = Number(H.value), d = Math.max(0, h - BASE);
    hout.textContent = hrs(h);
    H.setAttribute('aria-valuetext', `${h} ${h === 1 ? 'hora' : 'horas'} al mes`);
    // Lo más barato en Spotify para escuchar h horas cada mes. Las recargas valen un año: de media, cada hora cuesta 0,999 €.
    let mode = 'base', extra = 0, plusH = 0, recH = 0;
    if (d > 0) {
      const rec = d * (REC / REC_H), plus = PLUS + Math.max(0, d - PLUS_H) * (REC / REC_H);
      if (rec <= plus) { mode = 'rec'; extra = rec; recH = d; }
      else { mode = d > PLUS_H ? 'plusrec' : 'plus'; extra = plus; plusH = Math.min(d, PLUS_H); recH = Math.max(0, d - PLUS_H); }
    }
    const total = (has ? 0 : PREM) + extra;
    // La barra: lo que pone cada fuente de horas, sobre 60 h
    const w = (x) => `${((Math.min(x, SCALE) / SCALE) * 100).toFixed(2)}%`;
    seg.pl.style.width = w(Math.min(h, BASE));
    seg.ab.style.width = w(plusH);
    seg.rc.style.width = w(Math.min(recH, Math.max(0, SCALE - BASE - plusH)));
    // «Te sobra 1 h» / «Te sobran 3 h»
    const sobra = (n, T = 'Te') => `${T} ${n === 1 ? 'sobra' : 'sobran'} ${hrs(n)}`;
    const falta = (n, T = 'Te') => `${T} ${n === 1 ? 'falta' : 'faltan'} ${hrs(n)}`;
    // Frente a Podimo (20 h): lo que te sobra o te falta
    rows.forEach((row) => {
      const cap = Number(row.dataset.cap), bar = $('.sp-bar i', row), txt = $('[data-bar-txt]', row);
      if (bar) bar.style.width = `${((Math.min(h, cap) / cap) * 100).toFixed(2)}%`;
      row.classList.toggle('is-over', h > cap);
      txt.textContent = h > cap ? falta(h - cap) : h === cap ? 'Justo' : sobra(cap - h);
    });
    kEl.textContent = has ? 'Con tu Premium, lo más barato' : 'Sin Premium, lo más barato en Spotify';
    if (h === 0) {
      name.textContent = '—';
      price.textContent = 'Pon las horas que escuchas';
      why.textContent = 'Mueve la barra con las horas que escuchas al mes: te decimos qué te sale más barato.';
      return;
    }
    name.textContent = has
      ? { base: 'Te bastan las 12 h', rec: 'Recargas de 10 h', plus: 'Audiolibros+', plusrec: 'Audiolibros+ y recargas' }[mode]
      : { base: 'Premium Individual', rec: 'Premium y recargas', plus: 'Premium y Audiolibros+', plusrec: 'Premium, Audiolibros+ y recargas' }[mode];
    const media = mode === 'rec' || mode === 'plusrec' ? ', de media' : '';
    price.textContent = has
      ? (mode === 'base' ? `0${NB}€ más al mes` : `${eur(extra)} más al mes${media}`)
      : (mode === 'base' ? `${eur(total)} al mes, con la música` : `${eur(total)} al mes${media}`);
    let t;
    if (mode === 'base') {
      const left = BASE - h;
      t = has
        ? `Con ${hrs(h)} al mes, te bastan las 12${NB}h de Premium: no pagas nada más por los audiolibros.${left ? ` ${sobra(left)}, que ${left === 1 ? 'caduca' : 'caducan'} en tu fecha de facturación.` : ''}`
        : `Con ${hrs(h)} al mes, te bastarían las 12${NB}h de Premium Individual, pero cuesta 11,99${NB}€ al mes (con la música). Solo para audiolibros, Podimo te da 20${NB}h por 4,99${NB}€, y Storytel, sin límite, cuesta 8,99${NB}€.`;
    } else if (mode === 'rec') {
      t = (has ? `Con ${hrs(h)} al mes, las 12${NB}h de Premium se te quedan cortas por ${hrs(d)}.` : `Con ${hrs(h)} al mes, las 12${NB}h de Premium Individual se te quedarían cortas por ${hrs(d)}.`)
        + ` Lo más barato: recargas de 10${NB}h por 9,99${NB}€, que valen un año; cada una te da para ${meses(REC_H / d)}: ${eur(extra)} al mes de media. Audiolibros+ te costaría 8,99${NB}€ al mes.`
        + (has ? '' : ` Sin Premium, súmale sus 11,99${NB}€. Solo para audiolibros, Storytel, por 8,99${NB}€, no te cuenta las horas.`);
    } else if (mode === 'plus') {
      const left = BASE + PLUS_H - h;
      t = `Con ${hrs(h)} al mes, te compensa Audiolibros+: 15${NB}h más por 8,99${NB}€ al mes, 27${NB}h en total.${left ? ` ${sobra(left)}, que ${left === 1 ? 'caduca' : 'caducan'} cada mes.` : ''}`
        + (has ? ` Pero por 8,99${NB}€, Storytel no te cuenta las horas.` : ` Con Premium, 20,98${NB}€ al mes; Storytel, sin contar horas, cuesta 8,99${NB}€.`);
    } else {
      t = `Con ${hrs(h)} al mes, no te llega ni con Premium y Audiolibros+ (27${NB}h en total): ${falta(d - PLUS_H, 'te')}, que tendrías que cubrir con recargas.`
        + (has ? ` Por los audiolibros pagarías ${eur(extra)} al mes de media, encima de Premium.` : ` Con Premium, ${eur(total)} al mes de media.`)
        + ` Storytel, por 8,99${NB}€, o Audible, por 9,99${NB}€, no te cuentan las horas.`;
    }
    why.textContent = t;
    const key = `${has}:${mode}`;
    if (last && key !== last && !reduced) { box.classList.remove('is-bump'); void box.offsetWidth; box.classList.add('is-bump'); }
    last = key;
  };
  H.addEventListener('input', upd);
  radios(pCtl, (v) => { has = v === 'si'; upd(); });
  upd();
});

/* ---------- Alternativas y guías: carrusel deslizable ---------- */
$$('[data-more]').forEach((box) => {
  const track = $('[data-more-track]', box), prev = $('[data-more-prev]', box), next = $('[data-more-next]', box), thumb = $('[data-more-thumb]', box);
  if (!track) return;
  const nav = $('[data-more-nav]', box);
  if (nav) nav.hidden = false;
  const items = [...track.children];
  const per = () => { const g = parseFloat(getComputedStyle(track).columnGap) || 0; return (items[0]?.getBoundingClientRect().width || track.clientWidth) + g; };
  // Un «paso» son las tarjetas que caben enteras en pantalla (al menos una)
  const page = () => { const p = per(), pad = parseFloat(getComputedStyle(track).paddingLeft) || 0; return Math.max(1, Math.floor((track.clientWidth - pad) / p)) * p; };
  const update = () => {
    const max = track.scrollWidth - track.clientWidth;
    if (prev) prev.disabled = track.scrollLeft < 4;
    if (next) next.disabled = track.scrollLeft > max - 4;
    if (thumb) {
      const w = Math.min(1, track.clientWidth / track.scrollWidth), p = max > 0 ? track.scrollLeft / max : 0;
      thumb.style.width = `${(w * 100).toFixed(2)}%`;
      thumb.style.transform = `translateX(${((p * (1 - w)) / w * 100).toFixed(2)}%)`;
    }
  };
  let ticking = false;
  track.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; update(); }); } }, { passive: true });
  addEventListener('resize', update);
  const go = (dir) => track.scrollBy({ left: dir * page(), behavior: reduced ? 'auto' : 'smooth' });
  prev?.addEventListener('click', () => go(-1));
  next?.addEventListener('click', () => go(1));
  update();
  // Arrastrar con el ratón (con el dedo ya se desliza de forma nativa)
  let drag = null, moved = false, settle = 0;
  track.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    drag = { x: e.clientX, left: track.scrollLeft, t: performance.now(), v: 0 }; moved = false;
  });
  addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!moved && Math.abs(dx) > 6) { moved = true; clearTimeout(settle); track.classList.add('is-dragging', 'no-snap'); }
    if (!moved) return;
    const now = performance.now(), l = drag.left - dx;
    drag.v = (track.scrollLeft - l) / Math.max(1, now - drag.t); drag.t = now;
    track.scrollLeft = l;
  });
  addEventListener('pointerup', () => {
    if (!drag) return;
    const v = drag.v; drag = null;
    if (!moved) return;
    track.classList.remove('is-dragging');
    // Se recoloca en la tarjeta más cercana, con un poco de inercia según la velocidad del gesto
    const p = per(), target = Math.round((track.scrollLeft - v * 120) / p) * p;
    track.scrollTo({ left: Math.max(0, Math.min(target, track.scrollWidth - track.clientWidth)), behavior: reduced ? 'auto' : 'smooth' });
    settle = setTimeout(() => track.classList.remove('no-snap'), 500);
    setTimeout(() => { moved = false; }, 0);
  });
  track.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
});

/* ---------- Progreso de lectura ---------- */
(() => {
  const bar = $('.sp-progress span'), main = $('.sp-main');
  if (!bar || !main) return;
  let ticking = false;
  const upd = () => {
    ticking = false;
    const r = main.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight * 0.6)));
    bar.style.transform = `scaleX(${p.toFixed(4)})`;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
  upd();
})();

/* ---------- Visor de capturas ---------- */
(() => {
  const dlg = $('[data-lightbox]'); if (!dlg || !dlg.showModal) return;
  const cap = $('p', dlg), img = document.createElement('img');
  img.alt = ''; // el pie de debajo ya lo describe
  cap.before(img);
  $$('[data-zoom]').forEach((b) => b.addEventListener('click', () => {
    const src = $('img', b);
    img.src = src.currentSrc || src.src;
    cap.textContent = src.alt;
    dlg.showModal();
  }));
  $('[data-lightbox-close]', dlg).addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
})();

/* ---------- Vídeo de YouTube (se carga solo al pulsar) ---------- */
$$('[data-yt]').forEach((a) => {
  const id = a.dataset.yt;
  if (!id || !/^[\w-]{11}$/.test(id)) return;
  a.href = `https://www.youtube.com/watch?v=${id}`;
  a.setAttribute('aria-label', 'Reproducir aquí la reseña de los audiolibros de Spotify en vídeo'); // con JavaScript se ve en la página
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    f.title = '¿Merecen la pena los audiolibros de Spotify? Reseña de SonorBooks';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    const box = Object.assign(document.createElement('div'), { className: 'sp-video' });
    a.replaceWith(box);
    box.append(f);
    f.focus();
  });
});
