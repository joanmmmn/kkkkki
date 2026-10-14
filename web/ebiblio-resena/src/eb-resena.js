// eBiblio · reseña SonorBooks — interacciones de la página. Sin dependencias, sin cookies ni almacenamiento.
// Todo se ve sin JavaScript (la página está completa en el HTML); esto añade los ejemplares que se pueden pedir, el
// selector de comunidades, el reproductor recreado, el carrusel, el visor de capturas y las animaciones.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelector('main.eb')?.classList.add('eb-js'); // los controles que solo funcionan con JavaScript se enseñan a partir de aquí
const belowFold = (el) => el.getBoundingClientRect().top > innerHeight * 0.92;
const onView = (el, fn, { threshold = 0.35, once = true } = {}) => {
  if (!('IntersectionObserver' in window)) { fn(); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { fn(); if (once) io.disconnect(); } }), { threshold });
  io.observe(el);
};
// Prepara una animación justo antes de que el elemento entre en pantalla desde abajo y la lanza al verse.
// Si nunca se acerca (una captura de la página entera, un salto con un enlace), se queda en su estado final, visible.
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
const debounce = (fn, ms = 120) => { let t = 0; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
const el = (tag, cls, txt) => { const n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; };
const list = (names) => (names.length < 2 ? names.join('') : `${names.slice(0, -1).join(', ')} y ${names[names.length - 1]}`);

/* ---------- Qué es: un audiolibro con tres ejemplares, que se pide, se reserva y se devuelve solo ---------- */
(() => {
  const box = $('[data-copies]');
  if (!box) return;
  const COPIES = 3, QMAX = 3;
  const take = $('[data-copies-take]', box), time = $('[data-copies-time]', box), reset = $('[data-copies-reset]', box);
  const status = $('[data-copies-status]', box), out = $('[data-copies-out]', box), queue = $('[data-copies-queue]', box), qwrap = $('[data-copies-qwrap]', box);
  const shelf = $$('.eb-copy', box);
  const PEOPLE = [['Ana', '#b9512f'], ['Luis', '#68417a'], ['Marta', '#54522b'], ['Jorge', '#7b5a98'], ['Sara', '#ad1519'], ['Pablo', '#2b6e4a'], ['Elena', '#4a2c5a'], ['Hugo', '#8a5a12']];
  let loans = [], waiting = [], n = 0, busy = 0;
  const person = () => { const p = PEOPLE[n % PEOPLE.length]; n += 1; return { name: p[0], color: p[1] }; };
  const chip = (p, k) => {
    const li = el('li', `eb-who-chip${k ? ' eb-who-chip--q' : ''}`);
    const av = el('i', '', k ? String(k) : p.name[0]);
    if (!k) av.style.background = p.color;
    li.append(av, p.name);
    if (!k) li.append(' ', el('em', '', '21 días'));
    return li;
  };
  const render = () => {
    shelf.forEach((c, i) => c.classList.toggle('is-out', i < loans.length));
    out.replaceChildren(...loans.map((p) => chip(p)));
    queue.replaceChildren(...waiting.map((p, i) => chip(p, i + 1)));
    qwrap.hidden = waiting.length === 0;
    const free = COPIES - loans.length;
    take.textContent = free > 0 ? 'Pedirlo prestado' : 'Reservarlo';
    take.disabled = free === 0 && waiting.length >= QMAX;
    time.hidden = loans.length === 0;
    reset.hidden = n === 0;
  };
  const say = (t) => { status.textContent = t; };
  take.addEventListener('click', () => {
    if (busy) return;
    const p = person();
    if (loans.length < COPIES) {
      loans.push(p);
      const free = COPIES - loans.length;
      say(free === 2 ? `${p.name} se lo lleva 21 días. Quedan 2 ejemplares libres: «Prestar».`
        : free === 1 ? `${p.name} se lleva otro. Queda 1 libre: «Prestar».`
          : `${p.name} se lleva el último. Ya no quedan libres: ahora la ficha dice «Reservar».`);
    } else {
      waiting.push(p);
      say(waiting.length < QMAX ? `${p.name} lo reserva: es el número ${waiting.length} de la cola. Le avisarán cuando le toque.`
        : `${p.name}, el número ${waiting.length}. Y la cola se llena: «En este momento no hay reservas libres».`);
    }
    render();
    if (take.disabled) time.focus(); // la cola está llena: el siguiente paso es dejar pasar los 21 días
  });
  time.addEventListener('click', () => {
    if (busy || !loans.length) return;
    const served = waiting.splice(0, COPIES);
    loans = [];
    render();
    take.focus(); // «Pasan 21 días» se esconde hasta que haya otro préstamo
    say(served.length
      ? `Pasan 21 días: los préstamos se devuelven solos, sin multas. ${list(served.map((p) => p.name))}, de la cola, ${served.length > 1 ? 'reciben' : 'recibe'} el aviso y ${served.length > 1 ? 'se lo llevan' : 'se lo lleva'}.`
      : 'Pasan 21 días: los préstamos se devuelven solos, sin multas. Vuelve a haber 3 ejemplares libres.');
    if (!served.length) return;
    // Los ejemplares vuelven a la estantería y, enseguida, salen para los de la cola
    const go = () => { busy = 0; loans = served; render(); };
    if (reduced) { go(); return; }
    busy = setTimeout(go, 650);
  });
  reset.addEventListener('click', () => {
    clearTimeout(busy); busy = 0; loans = []; waiting = []; n = 0; render();
    say('Hay 3 ejemplares libres: «Prestar».');
    take.focus();
  });
  render();
})();

/* ---------- Cada comunidad, su eBiblio: las barras se eligen y la ficha de la derecha cambia ---------- */
(() => {
  const box = $('[data-regions]');
  if (!box) return;
  const btns = $$('[data-region]', box), cards = $$('[data-card]', box), aside = $('[data-region-card]', box);
  const pick = (b, user) => {
    const k = b.dataset.region;
    btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    cards.forEach((c) => {
      const on = c.dataset.card === k;
      if (on && c.hidden && !reduced) { c.classList.remove('is-in'); void c.offsetWidth; c.classList.add('is-in'); }
      c.hidden = !on;
    });
    // En el móvil la ficha queda debajo de la lista: se lleva a la vista para ver qué ha cambiado
    if (user && matchMedia('(max-width: 900px)').matches) {
      const r = aside.getBoundingClientRect();
      if (r.top > innerHeight * 0.75 || r.bottom < 0) aside.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' });
    }
  };
  btns.forEach((b, i) => {
    b.addEventListener('click', () => pick(b, true));
    // Flechas arriba y abajo para recorrer la lista
    b.addEventListener('keydown', (e) => {
      const k = { ArrowDown: 1, ArrowUp: -1 }[e.key];
      if (!k) return;
      e.preventDefault();
      const nb = btns[(i + k + btns.length) % btns.length];
      nb.focus(); pick(nb, false);
    });
  });
  pick(btns.find((b) => b.getAttribute('aria-pressed') === 'true') || btns[0], false);
  const list = $('[data-region-list]', box);
  armOnApproach(list, () => list.classList.add('is-pending'), () => list.classList.remove('is-pending'), { threshold: 0.25 });
})();

/* ---------- Escúchalo: el reproductor de la app, recreado ---------- */
(() => {
  const app = $('[data-app]');
  if (!app) return;
  const tabs = $$('[data-app-tab]', app), screen = $('[data-app-screen]', app), cap = $('[data-app-cap]', app);
  const speed = $('[data-app-speed]', app), timer = $('[data-app-timer]', app), prog = $('[data-app-progress]', app);
  const CAP = {
    speed: 'Más rápida o más lenta: la voz, a tu ritmo.',
    skip: 'Treinta segundos atrás, si te has perdido algo, o adelante.',
    timer: 'Se para solo al cabo del tiempo que elijas: para dormirte escuchando.',
    offline: 'Descargado en el móvil, se escucha sin conexión. Caduca con el préstamo.',
  };
  let timers = [], touched = false;
  const later = (ms, fn) => timers.push(setTimeout(fn, reduced ? 0 : ms));
  const show = (k) => {
    timers.forEach(clearTimeout); timers = [];
    tabs.forEach((t) => t.setAttribute('aria-pressed', String(t.dataset.appTab === k)));
    screen.dataset.appScreen = k;
    $$('[data-app-hi]', app).forEach((h) => h.setAttribute('data-hi', h.dataset.appHi === k ? 'on' : 'off'));
    screen.classList.toggle('is-offline', k === 'offline');
    cap.textContent = CAP[k];
    speed.textContent = '1,25×'; timer.textContent = '15 min'; prog.style.width = '24%';
    // Una pequeña demostración de lo que hace cada función
    if (k === 'speed') { speed.textContent = '1×'; later(450, () => { speed.textContent = '1,25×'; }); later(900, () => { speed.textContent = '1,5×'; }); }
    if (k === 'skip') later(500, () => { prog.style.width = '28%'; });
    if (k === 'timer') { timer.textContent = '30 min'; later(500, () => { timer.textContent = '15 min'; }); }
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => { touched = true; show(t.dataset.appTab); });
    t.addEventListener('keydown', (e) => {
      const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (!k) return;
      e.preventDefault();
      const nt = tabs[(i + k + tabs.length) % tabs.length];
      touched = true; nt.focus(); show(nt.dataset.appTab);
    });
  });
  // Al llegar, la primera función se enseña sola una vez
  $$('[data-app-hi]', app).forEach((h) => h.setAttribute('data-hi', h.dataset.appHi === 'speed' ? 'on' : 'off'));
  armOnApproach(app, () => {}, () => { if (!touched) show('speed'); }, { threshold: 0.6 });
})();

/* ---------- Revelados: anillos de nota y barras ---------- */
const fillRing = (ring) => {
  const n = $('[data-count]', ring);
  requestAnimationFrame(() => requestAnimationFrame(() => ring.classList.remove('is-pending')));
  if (n) {
    const end = Number(n.dataset.count), t0 = performance.now();
    const showN = (v) => { n.textContent = String(v).replace('.', ','); };
    const step = (t) => { const k = Math.min(1, (t - t0) / 1200), v = Math.round(k * end * 2) / 2; showN(k < 1 ? v : end); if (k < 1) requestAnimationFrame(step); };
    showN(0); requestAnimationFrame(step);
  }
};
$$('[data-ring]').forEach((ring) => {
  if (reduced) return;
  if (!belowFold(ring)) { ring.classList.add('is-pending'); setTimeout(() => fillRing(ring), 500); return; }
  armOnApproach(ring, () => ring.classList.add('is-pending'), () => fillRing(ring), { threshold: 0.5 });
});
$$('[data-bars]').forEach((b) => armOnApproach(b, () => b.classList.add('is-pending'), () => b.classList.remove('is-pending'), { threshold: 0.4 }));

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
  const bar = $('.eb-progress span'), main = $('.eb-main');
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

/* ---------- Barra fija para ir a eBiblio ---------- */
(() => {
  const dock = $('[data-dock]');
  if (!dock || !('IntersectionObserver' in window)) return;
  const hero = $('.eb-hero'), blockers = [$('.eb-verdict'), $('.eb-offer'), $('.eb-region'), $('.sb-footer'), $('.eb-more')].filter(Boolean);
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
  const dlg = $('[data-lightbox]');
  if (!dlg || !dlg.showModal) return;
  const img = $('img', dlg), cap = $('p', dlg), full = $('[data-lightbox-open]', dlg);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let timer = 0, seq = 0;
  // El fondo se oscurece enseguida; la captura entra con un fundido y un zoom suaves cuando ya está decodificada (como
  // mucho, a los 600 ms), y al cerrar se va igual. `seq` anula una apertura pendiente si se cierra antes de que acabe.
  const open = (src, alt) => {
    clearTimeout(timer);
    const id = ++seq;
    dlg.classList.remove('is-open');
    img.src = src; img.alt = alt; cap.textContent = alt; if (full) full.href = src;
    if (!dlg.open) dlg.showModal();
    $('.eb-lightbox__img', dlg)?.scrollTo(0, 0);
    requestAnimationFrame(() => { if (id === seq && dlg.open) dlg.classList.add('is-shown'); });
    const ready = img.decode ? img.decode().catch(() => {}) : Promise.resolve();
    Promise.race([ready, new Promise((r) => setTimeout(r, 600))]).then(() => requestAnimationFrame(() => {
      if (id === seq && dlg.open) dlg.classList.add('is-open');
    }));
  };
  const close = () => {
    if (!dlg.open) return;
    seq++;
    dlg.classList.remove('is-open', 'is-shown');
    clearTimeout(timer);
    timer = setTimeout(() => dlg.close(), reduce.matches ? 0 : 320);
  };
  $$('[data-zoom]').forEach((b) => b.addEventListener('click', (e) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // abrir en otra pestaña sigue funcionando
    e.preventDefault();
    const s = $('img', b); open(b.href || s.currentSrc || s.src, s.alt);
  }));
  $('[data-lightbox-close]', dlg).addEventListener('click', close);
  // Un clic en el fondo cierra, pero no mientras la captura aún está entrando (evita cerrarla con un doble clic).
  dlg.addEventListener('click', (e) => { if (e.target === dlg && dlg.classList.contains('is-open')) close(); });
  dlg.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
  dlg.addEventListener('close', () => { clearTimeout(timer); seq++; dlg.classList.remove('is-open', 'is-shown'); });
})();

/* ---------- Vídeo de YouTube (se carga solo al pulsar) ---------- */
$$('[data-yt]').forEach((a) => {
  const id = a.dataset.yt;
  if (!id || !/^[\w-]{11}$/.test(id)) return;
  a.href = `https://www.youtube.com/watch?v=${id}`;
  a.setAttribute('aria-label', 'Reproducir aquí la guía de eBiblio en vídeo');
  a.removeAttribute('target');
  a.addEventListener('click', (e) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    f.title = 'Cómo usar eBiblio: audiolibros gratis con el carné de tu biblioteca. Guía de SonorBooks';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    const box = Object.assign(document.createElement('div'), { className: 'eb-video' });
    a.replaceWith(box);
    box.append(f);
    f.focus();
  });
});
