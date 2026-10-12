// Nextory · reseña SonorBooks — interacciones de la página. Sin dependencias.
// Todo funciona sin JavaScript (la página se ve completa); esto añade los probadores, el calculador y las animaciones.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const comma = (n, d = 1) => (Math.round(n * 10 ** d) / 10 ** d).toFixed(d).replace('.', ',');
const num = (n) => (Math.abs(n - Math.round(n)) < 0.05 ? String(Math.round(n)) : comma(n));
const eur = (n) => `${n.toFixed(2).replace('.', ',')} €`;
const hm = (h) => {
  const m = Math.round(h * 60), hh = Math.floor(m / 60), mm = m % 60;
  return mm === 0 ? `${hh} h` : hh === 0 ? `${mm} min` : `${hh} h ${mm} min`;
};
const belowFold = (el) => el.getBoundingClientRect().top > innerHeight * 0.92;
const onView = (el, fn, { threshold = 0.35, once = true } = {}) => {
  if (!('IntersectionObserver' in window)) { fn(); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { fn(); if (once) io.disconnect(); } }), { threshold });
  io.observe(el);
};
// Prepara una animación justo antes de que el elemento entre en pantalla desde abajo y la lanza al verse.
// Si nunca se acerca (una captura de la página entera, un salto con el índice), se queda en su estado final, visible.
const armOnApproach = (el, arm, play, { threshold = 0.35 } = {}) => {
  if (reduced || !('IntersectionObserver' in window)) return;
  let armed = false;
  const near = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting || armed) return;
    if (el.getBoundingClientRect().top < innerHeight) { near.disconnect(); return; }
    armed = true; near.disconnect(); arm();
    onView(el, play, { threshold });
  }, { rootMargin: '0px 0px 35% 0px' });
  near.observe(el);
};
// Grupo de botones de opción (role="radio"): marca el pulsado y avisa con su valor.
// Como un grupo de radios: una sola parada con el tabulador y las flechas para moverse entre opciones.
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
    });
  });
};
// Texto que leen los lectores de pantalla en un deslizador
const valueText = (input, text) => input?.setAttribute('aria-valuetext', text);

/* ---------- Portada: leer o escuchar ---------- */
$$('[data-duo]').forEach((duo) => {
  const sw = $('[data-switch]'); if (!sw) return;
  const btns = $$('button', sw);
  const set = (v) => {
    duo.dataset.on = v; sw.dataset.on = v;
    btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === v)));
  };
  let auto = 0, visible = true;
  const stop = () => { clearInterval(auto); auto = 0; };
  btns.forEach((b) => b.addEventListener('click', () => { stop(); set(b.dataset.v); }));
  // Al pulsar un móvil de atrás, pasa delante
  $$('.nx-duo__ph', duo).forEach((ph) => ph.addEventListener('click', () => { if (duo.dataset.on !== ph.dataset.k) { stop(); set(ph.dataset.k); } }));
  if (reduced) return;
  if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(duo);
  // Se para mientras tienes el ratón encima o el foco dentro, y del todo tras tres vueltas.
  const stage = duo.parentElement; let hold = false, turns = 0;
  stage.addEventListener('pointerenter', () => { hold = true; });
  stage.addEventListener('pointerleave', () => { hold = false; });
  stage.addEventListener('focusin', () => { hold = true; });
  stage.addEventListener('focusout', () => { hold = false; });
  auto = setInterval(() => {
    if (!visible || hold || document.hidden) return;
    set(duo.dataset.on === 'leer' ? 'escuchar' : 'leer');
    if (++turns >= 6) stop();
  }, 4200);
});

/* ---------- Lector: fondo, tipografía, tamaño, márgenes y marcapáginas ---------- */
$$('[data-rlab]').forEach((lab) => {
  const book = $('.nx-book', lab); if (!book) return;
  radios($('[data-r-theme]', lab), (v) => { book.dataset.themeR = v; });
  radios($('[data-r-font]', lab), (v) => { book.dataset.font = v; });
  radios($('[data-r-mar]', lab), (v) => { book.dataset.mar = v; });
  const size = $('[data-r-size]', lab), out = $('[data-r-size-out]', lab);
  size?.addEventListener('input', () => { book.style.setProperty('--book-size', `${size.value}px`); out.textContent = `${size.value} px`; valueText(size, `${size.value} píxeles`); });
  const mark = $('[data-r-mark]', lab), label = $('[data-r-mark-label]', lab);
  let t = 0;
  mark?.addEventListener('click', () => {
    const on = mark.dataset.on !== 'true';
    mark.dataset.on = String(on);
    book.classList.toggle('is-marked', on);
    if (label) label.textContent = on ? 'Quitar marcapáginas' : 'Añadir marcapáginas';
    clearTimeout(t);
    book.classList.toggle('is-toast', on);
    if (on) t = setTimeout(() => book.classList.remove('is-toast'), 2600);
  });
});

/* ---------- Reproductor: velocidad, horas y temporizador ---------- */
$$('[data-pl]').forEach((lab) => {
  const rate = $('[data-pl-rate-in]', lab), out = $('[data-pl-rate-out]', lab), chip = $('[data-pl-rate]', lab);
  const real = $('[data-pl-real]', lab), plan = $('[data-pl-plan]', lab), per = $('[data-pl-per]', lab), left = $('[data-pl-left]', lab);
  const BOOK = 8; // horas del audiolibro del ejemplo
  const upd = () => {
    const r = Number(rate.value), s = `${comma(r)}x`;
    out.textContent = s; chip.textContent = s; valueText(rate, `${comma(r)} x`);
    real.textContent = hm(BOOK / r);
    plan.textContent = hm(BOOK);
    per.textContent = `${num(r)} h`;
    // Tiempo que queda en el reproductor al ritmo elegido: el audiolibro dura 8:14:12 y ya van 1:28
    const rem = (8 * 3600 + 14 * 60 + 12 - 88) / r, hh = Math.floor(rem / 3600), mm = Math.floor((rem % 3600) / 60), ss = Math.floor(rem % 60);
    if (left) left.textContent = `−${hh}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  };
  rate?.addEventListener('input', upd);
  if (rate) upd();
  const moon = $('[data-pl-moon]', lab), note = $('[data-pl-timer-out]', lab);
  const txt = {
    0: 'Sin temporizador.',
    15: 'Se para dentro de 15 minutos. Si agitas el móvil cuando se apaga el sonido, suma 20 minutos más.',
    40: 'Se para dentro de 40 minutos: el máximo de la lista (también puedes elegir una hora exacta).',
    cap: 'Se para al terminar el capítulo. La app te dice cuánto falta, por ejemplo «Fin del capítulo (0 h 11 min)».',
  };
  radios($('[data-pl-timer]', lab), (v) => { moon?.classList.toggle('is-on', v !== '0'); if (note) note.textContent = txt[v] || ''; });
});

/* ---------- ¿Qué plan te encaja? ---------- */
$$('[data-calc]').forEach((box) => {
  const h = $('[data-calc-h]', box), hout = $('[data-calc-hout]', box);
  const name = $('[data-calc-name]', box), price = $('[data-calc-price]', box), why = $('[data-calc-why]', box), per = $('[data-calc-per]', box);
  const segs = $$('[data-plan]', box);
  let many = false, last = '';
  const PLANS = { mini: ['Mini', 5.99, 10], standard: ['Standard', 7.99, 30], unlimited: ['Unlimited', 9.99, Infinity] };
  const upd = () => {
    const hrs = Number(h.value);
    hout.textContent = `${hrs} h`; valueText(h, `${hrs} horas al mes`);
    let k = hrs <= 10 ? 'mini' : hrs <= 30 ? 'standard' : 'unlimited';
    if (many) k = 'unlimited';
    const [n, p, cap] = PLANS[k];
    name.textContent = n;
    // Con varios perfiles a la vez, Unlimited cuesta más que su precio de partida (que es para un perfil)
    price.textContent = many ? `más de ${eur(p)} al mes` : k === 'unlimited' ? `desde ${eur(p)} al mes` : `${eur(p)} al mes`;
    let w;
    if (many) w = 'Solo Unlimited deja usar varios perfiles a la vez. El precio sube según cuántos perfiles uséis al mismo tiempo (de 1 a 4).';
    else if (k === 'mini') w = `Con ${hrs} h al mes te basta el Mini, de 10 h.${hrs < 10 ? ` Las ${10 - hrs} h que no gastes se guardan para los meses siguientes.` : ''}`;
    else if (k === 'standard') w = `Con ${hrs} h al mes, el Mini (10 h) se te queda corto. ${hrs < 30 ? `Con el Standard te sobran ${30 - hrs} h, que se guardan para los meses siguientes.` : 'El Standard (30 h) te cubre justo.'}`;
    else w = `Con ${hrs} h al mes, el Standard (30 h) se te queda corto: en Unlimited no hay límite de horas.`;
    why.textContent = w;
    per.textContent = `Te sale a ${eur(p / hrs)} la hora${k === 'unlimited' ? ' (con el precio más bajo)' : ''}.`;
    per.hidden = many;
    segs.forEach((s) => s.classList.toggle('is-on', s.dataset.plan === k));
    if (k !== last && last && !reduced) { box.classList.remove('is-bump'); void box.offsetWidth; box.classList.add('is-bump'); }
    last = k;
  };
  h?.addEventListener('input', upd);
  radios($('[data-calc-p]', box), (v) => { many = v !== '1'; upd(); });
  if (h) upd();
});

/* ---------- Pestañas ---------- */
$$('[data-tabs]').forEach((box) => {
  const tabs = $$('[role="tab"]', box);
  const select = (t, focus) => {
    tabs.forEach((x) => {
      const on = x === t;
      x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(x.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    if (focus) t.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', (e) => {
      const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (k) { e.preventDefault(); select(tabs[(i + k + tabs.length) % tabs.length], true); }
    });
  });
});

/* ---------- Revelado al hacer scroll (solo desplazamiento: el contenido nunca se oculta) ---------- */
$$('[data-reveal]').forEach((el) => armOnApproach(el, () => el.classList.add('is-pending'), () => { el.classList.add('is-in'); el.classList.remove('is-pending'); }, { threshold: 0.15 }));
$$('[data-stagger]').forEach((list) => {
  const items = [...list.children];
  armOnApproach(list, () => items.forEach((li, i) => { li.classList.add('is-pending'); li.style.transitionDelay = `${i * 70}ms`; }),
    () => items.forEach((li) => li.classList.remove('is-pending')), { threshold: 0.15 });
});

/* ---------- Anillos de nota y barras ---------- */
const fillRing = (ring) => {
  const n = $('[data-count]', ring);
  requestAnimationFrame(() => requestAnimationFrame(() => ring.classList.remove('is-pending')));
  if (n) { const end = Number(n.dataset.count); const t0 = performance.now();
    const step = (t) => { const v = Math.min(end, Math.round(((t - t0) / 1200) * end)); n.textContent = v; if (v < end) requestAnimationFrame(step); };
    requestAnimationFrame(step); }
};
$$('[data-ring]').forEach((ring) => {
  if (reduced) return;
  if (!belowFold(ring)) { ring.classList.add('is-pending'); setTimeout(() => fillRing(ring), 500); return; }
  armOnApproach(ring, () => ring.classList.add('is-pending'), () => fillRing(ring), { threshold: 0.5 });
});
$$('[data-bars]').forEach((b) => armOnApproach(b, () => b.classList.add('is-pending'), () => b.classList.remove('is-pending'), { threshold: 0.4 }));

/* ---------- Botón de la oferta: el 14 se tacha y saltan los 30 días ---------- */
$$('[data-deal]').forEach((d) => {
  if (reduced) return;
  const strike = () => { d.classList.remove('is-pending'); d.classList.add('is-struck'); };
  if (!belowFold(d)) { d.classList.add('is-pending'); setTimeout(strike, 1300); return; }
  armOnApproach(d, () => d.classList.add('is-pending'), () => setTimeout(strike, 250), { threshold: 0.6 });
});

/* ---------- Calendario: 14 días de la prueba estándar y 16 más con SonorBooks ---------- */
$$('[data-cal]').forEach((cal) => {
  const grid = $('[data-cal-grid]', cal), num = $('[data-cal-n]', cal);
  const STD = 14;
  const cells = Array.from({ length: 30 }, (_, i) => { const c = document.createElement('i'); c.textContent = i + 1; grid.append(c); return c; });
  const final = () => { cells.forEach((c, i) => { c.className = i < STD ? 'std' : 'sb'; }); cells[29].classList.add('last'); num.textContent = '30'; };
  final();
  armOnApproach(cal, () => { cells.forEach((c) => { c.className = ''; }); num.textContent = '0'; }, () => {
    let i = 0;
    const tick = () => {
      if (i > 0) cells[i - 1].classList.remove('pop');
      if (i >= 30) { cells[29].classList.add('last'); return; }
      cells[i].className = `${i < STD ? 'std' : 'sb'} pop`;
      num.textContent = String(i + 1);
      i++;
      setTimeout(tick, i < STD ? 70 : i === STD ? 520 : 55);
    };
    tick();
  }, { threshold: 0.45 });
});

/* ---------- Pasos: la línea avanza con el scroll ---------- */
$$('[data-steps]').forEach((ol) => {
  const wrap = ol.parentElement, items = $$('li', ol);
  let ticking = false;
  const update = () => {
    ticking = false;
    const r = ol.getBoundingClientRect(), mark = innerHeight * 0.62;
    const p = Math.min(1, Math.max(0, (mark - r.top - 24) / Math.max(1, r.height - 48)));
    wrap.style.setProperty('--fill', p.toFixed(3));
    items.forEach((li) => li.classList.toggle('is-reached', li.getBoundingClientRect().top + 25 < mark));
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
});

/* ---------- Alternativas y guías: carrusel deslizable ---------- */
$$('[data-more]').forEach((box) => {
  const track = $('[data-more-track]', box), prev = $('[data-more-prev]', box), next = $('[data-more-next]', box), thumb = $('[data-more-thumb]', box);
  if (!track) return;
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
  const bar = $('.nx-progress span'), main = $('.nx-main');
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
  const hero = $('.nx-hero'), blockers = [$('#prueba-30-dias'), $('.nx-offer'), $('.sb-footer'), $('.nx-verdict'), $('.nx-more')].filter(Boolean);
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
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    f.title = 'Nextory: ¿merece la pena? Reseña de SonorBooks';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    const box = Object.assign(document.createElement('div'), { className: 'nx-video' });
    a.replaceWith(box);
    box.append(f);
    f.focus();
  });
});
