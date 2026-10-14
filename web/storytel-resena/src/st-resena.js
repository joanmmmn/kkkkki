// Storytel · reseña SonorBooks — interacciones de la página. Sin dependencias.
// Todo funciona sin JavaScript (la página se ve completa, con el estado de ejemplo de cada módulo);
// esto añade el cambio escuchar/leer de la portada, el selector de cuentas de Family, el «¿cuántos vais a escuchar?»,
// el calculador de horas, las fechas de la prueba, las pestañas y el carrusel.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
// 10 → «10»; 12.5 → «12,5»; 3.75 → «3,75»
const num = (n) => String(Math.round(n * 100) / 100).replace('.', ',');
const speedTxt = (s) => `${num(s)}x`;
const valueText = (input, text) => input?.setAttribute('aria-valuetext', text);
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

/* ---------- Portada: el mismo libro, al escucharlo y al leerlo ---------- */
$$('[data-stage]').forEach((stage) => {
  const sw = $('[data-switch]', stage); if (!sw) return;
  sw.hidden = false; // sin JavaScript no se muestra: se queda la captura del reproductor
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
    set(stage.dataset.on === 'oir' ? 'leer' : 'oir');
    if (++turns >= 6) stop();
  }, 4200);
});

/* ---------- Precio: Family con 2 o 3 cuentas ---------- */
$$('[data-family]').forEach((box) => {
  const ctl = $('[data-fam-ctl]', box), price = $('[data-fam-price]', box), sub = $('[data-fam-sub]', box);
  if (!ctl || !price) return;
  ctl.hidden = false; // sin JavaScript se lee el precio de 2 cuentas y, debajo, el de 3
  const P = { 2: ['15,99 €', 'Unos 8 € por persona. 0 € los 7 primeros días'], 3: ['20,99 €', 'Unos 7 € por persona. 0 € los 7 primeros días'] };
  let first = true;
  radios(ctl, (v) => {
    price.textContent = P[v][0];
    if (sub) sub.textContent = P[v][1];
    if (!first && !reduced) { const p = price.closest('.st-price'); p.classList.remove('is-bump'); void p.offsetWidth; p.classList.add('is-bump'); }
    first = false;
  });
  // Estado inicial (2 cuentas), ya con el texto por persona
  price.textContent = P[2][0]; if (sub) sub.textContent = P[2][1]; first = false;
});

/* ---------- ¿Cuántos vais a escuchar? ---------- */
$$('[data-people]').forEach((box) => {
  const ctl = $('[data-people-ctl]', box), av = $$('[data-people-av] i', box);
  const plan = $('[data-people-plan]', box), total = $('[data-people-total]', box), each = $('[data-people-each]', box), why = $('[data-people-why]', box);
  if (!ctl) return;
  $$('[disabled]', box).forEach((el) => { el.disabled = false; });
  const D = {
    1: ['Unlimited', '8,99 €', 'para ti', 'Una cuenta, para una persona a la vez. Si sois más en casa y escucháis a la vez, os toca Family.'],
    2: ['Family con 2 cuentas', '15,99 €', 'unos 8 € por persona', 'Con dos Unlimited pagaríais 17,98 €: Family os ahorra 1,99 € al mes, y cada uno tiene su biblioteca.'],
    3: ['Family con 3 cuentas', '20,99 €', 'unos 7 € por persona', 'Con tres Unlimited pagaríais 26,97 €: Family os ahorra 5,98 € al mes.'],
  };
  let last = '';
  radios(ctl, (v) => {
    const [n, t, e, w] = D[v];
    plan.textContent = n; total.textContent = t; each.textContent = e; why.textContent = w;
    av.forEach((a, i) => a.classList.toggle('is-off', i >= Number(v)));
    if (last && last !== v && !reduced) { box.classList.remove('is-bump'); void box.offsetWidth; box.classList.add('is-bump'); }
    last = v;
  });
});

/* ---------- ¿Te compensa una tarifa sin límite? ---------- */
$$('[data-calc]').forEach((box) => {
  const h = $('[data-calc-h]', box), hout = $('[data-calc-hout]', box), eq = $('[data-calc-eq]', box);
  const name = $('[data-calc-name]', box), price = $('[data-calc-price]', box), why = $('[data-calc-why]', box);
  const meters = $$('[data-meter]', box);
  if (!h) return;
  // Sin JavaScript, los controles están desactivados y se ve el ejemplo de 10 h a 1x
  $$('[disabled]', box).forEach((el) => { el.disabled = false; });
  let speed = 1, last = '';
  const eur = (s) => Number(s.replace(',', '.'));
  const upd = () => {
    const hrs = Number(h.value), c = Math.round(hrs * speed * 100) / 100;
    hout.textContent = `${hrs} h`;
    valueText(h, `${hrs} horas al mes`);
    eq.innerHTML = `${hrs}&nbsp;h a ${speedTxt(speed)} = <b>${num(c)}&nbsp;h de audiolibro</b> en los planes con horas`;
    // El plan más barato que te cubre (Storytel, sin límite, siempre cubre)
    let best = null;
    meters.forEach((m) => {
      const cap = Number(m.dataset.meter), p = eur(m.dataset.price), ok = cap === 0 || c <= cap;
      if (cap) {
        const over = c > cap;
        $('[data-meter-bar]', m).style.setProperty('--v', Math.min(20, (c / cap) * 20).toFixed(3));
        m.classList.toggle('is-over', over);
        $('[data-meter-txt]', m).textContent = over ? `Te faltan ${num(c - cap)} h` : c === cap ? 'Justo' : `Te sobran ${num(cap - c)} h`;
      }
      if (ok && (!best || p < best.p)) best = { m, p };
    });
    meters.forEach((m) => m.classList.toggle('is-best', m === best.m));
    const plan = best.m.querySelector('.st-meters__h').firstChild.textContent.trim();
    const us = best.m.classList.contains('is-us');
    let k, n, p, w;
    if (us) {
      k = 'st'; n = 'Te compensa Storytel'; p = 'Storytel Unlimited: 8,99 € al mes';
      w = `A este ritmo, ${num(c)} h de audiolibro al mes, ningún plan con horas más barato te llega. Con Storytel no cuentas horas: puedes escuchar más, o más rápido, sin pagar más.`;
    } else {
      k = plan; n = 'Te sale más barato uno con horas'; p = `${plan}: ${best.m.dataset.price} € al mes`;
      w = `Con ${num(c)} h de audiolibro al mes te basta ${plan}. Storytel compensa a partir de unas 30 h al mes, una hora al día${speed > 1 ? ', o antes si escuchas rápido' : ''}.`;
    }
    name.textContent = n; price.textContent = p; why.textContent = w;
    if (k !== last && last && !reduced) { box.classList.remove('is-bump'); void box.offsetWidth; box.classList.add('is-bump'); }
    last = k;
  };
  h.addEventListener('input', upd);
  radios($('[data-calc-s]', box), (v) => { speed = Number(v); upd(); });
  upd();
});

/* ---------- Cuándo cancelar: las fechas de tu prueba ---------- */
$$('[data-trial]').forEach((box) => {
  const ctl = $('[data-trial-ctl]', box), input = $('[data-trial-start]', box), note = $('[data-trial-note]', box);
  const times = $$('[data-trial-d]', box);
  if (!ctl || !input || !('Intl' in window)) return;
  const fmt = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long' });
  const plus = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  // «del 14 al 18 de octubre» o, si cambia el mes, «del 29 de octubre al 2 de noviembre»
  const range = (a, b) => (a.getMonth() === b.getMonth() ? `del ${a.getDate()} al ${fmt.format(b)}` : `del ${fmt.format(a)} al ${fmt.format(b)}`);
  const upd = () => {
    const [y, m, d] = (input.value || '').split('-').map(Number);
    if (!y || !m || !d) return;
    const start = new Date(y, m - 1, d);
    times.forEach((t) => {
      const ds = t.dataset.trialD.split(',').map((n) => plus(start, Number(n)));
      t.textContent = ds.length > 1 ? range(ds[0], ds[1]) : fmt.format(ds[0]);
      t.dateTime = iso(ds[0]);
    });
    note.textContent = `Fechas para una prueba que empieza el ${fmt.format(start)}. La prueba dura 7 días desde el alta: apúntate también la hora y no esperes a la última. En nuestra cuenta, con alta el 13 de octubre de 2026, el siguiente pago era el 20 de octubre.`;
  };
  input.value = iso(new Date());
  ctl.hidden = false;
  input.addEventListener('input', upd);
  input.addEventListener('change', upd);
  upd();
});

/* ---------- Pestañas (dónde cancelar) ---------- */
$$('[data-tabs]').forEach((box) => {
  const tabs = $$('[role="tab"]', box);
  // Sin JavaScript se ven las cuatro rutas, cada una con su título; con él, las pestañas les ponen nombre
  const list = $('[role="tablist"]', box);
  if (list) list.hidden = false;
  $$('[data-tab-title]', box).forEach((t) => { t.hidden = true; });
  const select = (t, focus) => {
    tabs.forEach((x) => {
      const on = x === t;
      x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(x.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    if (focus) t.focus();
  };
  select(tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0]);
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', (e) => {
      const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (k) { e.preventDefault(); select(tabs[(i + k + tabs.length) % tabs.length], true); }
      else if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); select(tabs[e.key === 'Home' ? 0 : tabs.length - 1], true); }
    });
  });
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
  const bar = $('.st-progress span'), main = $('.st-main');
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

/* ---------- Barra fija con la oferta ---------- */
(() => {
  const dock = $('[data-dock]'); if (!dock || !('IntersectionObserver' in window)) return;
  const hero = $('.st-hero'), blockers = [$('#prueba-7-dias'), $('.st-offer'), $('.sb-footer'), $('.st-verdict'), $('.st-more')].filter(Boolean);
  let heroOut = false; const visible = new Set();
  const cookie = $('.sb-cookie-notice');
  const upd = () => dock.classList.toggle('is-on', heroOut && visible.size === 0 && !(cookie && !cookie.hidden));
  if (cookie) new MutationObserver(upd).observe(cookie, { attributes: true, attributeFilter: ['hidden'] });
  new IntersectionObserver(([e]) => { heroOut = !e.isIntersecting; upd(); }).observe(hero);
  const io = new IntersectionObserver((es) => { es.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target))); upd(); });
  blockers.forEach((b) => io.observe(b));
  // Sin cookies ni almacenamiento: al cerrarla desaparece hasta que se recarga la página.
  $('[data-dock-close]', dock)?.addEventListener('click', () => dock.remove());
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
  a.setAttribute('aria-label', 'Reproducir aquí la reseña de Storytel en vídeo'); // con JavaScript se ve en la página
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    f.title = '¿Merece la pena Storytel? Reseña de SonorBooks';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    const box = Object.assign(document.createElement('div'), { className: 'st-video' });
    a.replaceWith(box);
    box.append(f);
    f.focus();
  });
});
