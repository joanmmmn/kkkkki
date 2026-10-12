// LibriVox · reseña SonorBooks — interacciones de la página. Sin dependencias.
// Todo se ve sin JavaScript (la página está completa en el HTML); esto añade el audio, el texto que se lee al ritmo de la voz,
// el catálogo que se puede probar, el explorador de descargas y las animaciones.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const DATA = (() => { try { return JSON.parse($('#lv-data')?.textContent || '{}'); } catch { return {}; } })();
const fmt = (t) => { t = Math.max(0, Math.round(t)); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`; };
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

/* ---------- Audio: un solo sonido a la vez en toda la página ---------- */
// Cada bloque que suena (la ficha de la portada, el aviso, el reparto) es un «dueño» con started/paused/ended/tick.
const hub = (() => {
  const cache = {};
  let cur = null, raf = 0;
  const get = (id) => {
    if (!cache[id]) {
      const a = new Audio(DATA.audio?.[id]);
      a.preload = 'auto';
      a.addEventListener('ended', () => {
        if (!cur || cur.a !== a) return;
        const o = cur.owner; cancelAnimationFrame(raf); cur = null; a.currentTime = 0; o.ended?.();
      });
      cache[id] = a;
    }
    return cache[id];
  };
  const loop = () => { if (!cur || cur.a.paused) return; cur.owner.tick?.(cur.a.currentTime); raf = requestAnimationFrame(loop); };
  const api = {
    play(id, owner, at = 0) {
      if (cur && (cur.owner !== owner || cur.id !== id)) api.stop();
      const a = get(id);
      try { a.currentTime = at; } catch { /* aún sin datos: empieza desde el principio */ }
      cur = { id, a, owner };
      a.play().then(() => {
        if (!cur || cur.a !== a) return;
        owner.started?.(); cancelAnimationFrame(raf); loop();
      }).catch(() => { if (cur && cur.a === a) cur = null; owner.paused?.(); });
    },
    pause(owner) {
      if (!cur || (owner && cur.owner !== owner)) return;
      cur.a.pause(); cancelAnimationFrame(raf); cur.owner.paused?.();
    },
    stop() {
      if (!cur) return;
      const { a, owner } = cur; a.pause(); cancelAnimationFrame(raf); owner.paused?.(); cur = null;
    },
    playing(owner) { return !!cur && cur.owner === owner && !cur.a.paused; },
    time(id) { return cache[id]?.currentTime || 0; },
  };
  return api;
})();
document.addEventListener('visibilitychange', () => { if (document.hidden) hub.stop(); });

/* ---------- Texto que se lee al ritmo de la voz: la tinta aparece y un subrayado va de palabra en palabra ---------- */
class Karaoke {
  constructor(p) { this.p = p; this.u = Object.assign(document.createElement('span'), { className: 'lvx-u' }); this.u.setAttribute('aria-hidden', 'true'); }
  set(text, times) {
    const words = text.trim().split(/\s+/);
    this.p.textContent = '';
    this.words = words.map((w, i) => {
      const s = document.createElement('span');
      s.className = 'w'; s.textContent = w;
      this.p.append(s);
      if (i < words.length - 1) this.p.append(' ');
      return s;
    });
    this.p.append(this.u);
    this.times = times || []; this.idx = -2; this.uy = undefined;
  }
  render(t, reset = false) {
    let idx = -1;
    if (!reset) for (let i = 0; i < this.words.length && i < this.times.length; i++) { if (t >= this.times[i][0] - 0.02) idx = i; else break; }
    if (idx === this.idx) return;
    this.words.forEach((w, i) => { w.classList.toggle('is-on', i === idx); w.classList.toggle('is-past', i < idx); });
    this.idx = idx;
    this.move(idx);
  }
  refresh() { const i = this.idx; this.idx = -2; this.uy = undefined; if (i >= 0) { this.idx = i; this.move(i); } }
  move(idx) {
    const u = this.u;
    if (idx < 0 || !this.words[idx]) { u.classList.remove('is-on'); this.uy = undefined; return; }
    const base = this.p.getBoundingClientRect(), r = this.words[idx].getBoundingClientRect();
    const x = r.left - base.left, y = r.bottom - base.top - 3;
    const jump = this.uy === undefined || Math.abs(y - this.uy) > 2;
    u.classList.toggle('no-anim', jump);
    u.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    u.style.width = `${r.width.toFixed(1)}px`;
    u.classList.add('is-on'); this.uy = y;
  }
}

/* ---------- Portada: la ficha de las «Leyendas»; cada capítulo, una voz ---------- */
(() => {
  const book = $('[data-book]');
  const clips = DATA.clips || {};
  if (!book || !Object.keys(clips).length) return;
  const rows = $$('.lvx-row', book), read = $('[data-read]', book), p = $('.lvx-read__p', read);
  const btn = $('[data-read-play]', book), timeEl = $('[data-read-time]', book), seek = $('[data-seek]', book), fill = $('span', seek);
  const nEl = $('[data-read-n]', book), titleEl = $('[data-read-title]', book), readerEl = $('[data-read-reader]', book);
  const kar = new Karaoke(p);
  let cur = rows.find((r) => r.classList.contains('is-active')) || rows[0];
  const pos = {};
  let last = 0, previewing = false, praf = 0;
  const clip = () => clips[cur.dataset.clip];
  const label = (r, verb = 'Escuchar') => `${verb} «${r.dataset.title}», leído por ${r.dataset.reader}`;
  const show = (t) => {
    last = t;
    const c = clip();
    fill.style.width = `${Math.min(1, t / c.dur) * 100}%`;
    timeEl.textContent = t > 0.05 ? `${fmt(t)} / ${fmt(c.dur)}` : `Fragmento de ${fmt(c.dur)}`;
  };
  const owner = {
    started() {
      book.classList.add('is-playing'); cur.classList.add('is-playing'); read.classList.add('is-live');
      cur.setAttribute('aria-pressed', 'true'); btn.setAttribute('aria-label', label(cur, 'Pausar'));
    },
    paused() {
      pos[cur.dataset.clip] = hub.time(cur.dataset.clip);
      book.classList.remove('is-playing'); cur.classList.remove('is-playing');
      cur.setAttribute('aria-pressed', 'false'); btn.setAttribute('aria-label', label(cur));
    },
    ended() {
      pos[cur.dataset.clip] = 0;
      book.classList.remove('is-playing'); cur.classList.remove('is-playing'); read.classList.remove('is-live');
      cur.setAttribute('aria-pressed', 'false'); btn.setAttribute('aria-label', label(cur));
      kar.render(0, true); show(0);
    },
    tick(t) { kar.render(t); show(t); },
  };
  const stopPreview = () => {
    if (!previewing) return;
    previewing = false; cancelAnimationFrame(praf); kar.render(0, true); read.classList.remove('is-live');
  };
  const select = (row) => {
    rows.forEach((r) => { r.classList.toggle('is-active', r === row); r.classList.remove('is-playing'); r.setAttribute('aria-pressed', 'false'); });
    cur = row;
    nEl.textContent = row.dataset.n; titleEl.textContent = row.dataset.title; readerEl.textContent = row.dataset.reader;
    kar.set(row.dataset.text, clip().words);
    read.classList.remove('is-live');
    btn.setAttribute('aria-label', label(row));
    show(pos[row.dataset.clip] || 0);
  };
  const play = () => {
    stopPreview();
    const id = cur.dataset.clip, at = pos[id] || 0;
    read.classList.add('is-live'); kar.render(at, at <= 0);
    hub.play(id, owner, at);
  };
  rows.forEach((r) => {
    r.setAttribute('aria-pressed', 'false');
    r.addEventListener('click', () => {
      if (r === cur && hub.playing(owner)) { hub.pause(owner); return; }
      if (r !== cur) { if (hub.playing(owner)) hub.stop(); stopPreview(); select(r); }
      play();
    });
  });
  btn.addEventListener('click', () => (hub.playing(owner) ? hub.pause(owner) : play()));
  seek.addEventListener('click', (e) => {
    const r = seek.getBoundingClientRect(), c = clip();
    const t = Math.max(0, Math.min(c.dur - 0.05, ((e.clientX - r.left) / r.width) * c.dur));
    pos[cur.dataset.clip] = t; stopPreview(); read.classList.add('is-live'); kar.render(t); show(t);
    hub.play(cur.dataset.clip, owner, t);
  });
  // La caja del texto mide lo que el más largo de los cuatro: al cambiar de capítulo, nada se mueve.
  const measure = () => {
    const probe = p.cloneNode(false);
    probe.removeAttribute('data-words');
    Object.assign(probe.style, { position: 'absolute', visibility: 'hidden', left: '0', top: '0', width: `${p.clientWidth}px`, minHeight: '0' });
    read.append(probe);
    let h = 0;
    rows.forEach((r) => { probe.textContent = r.dataset.text; h = Math.max(h, probe.getBoundingClientRect().height); });
    probe.remove();
    p.style.setProperty('--read-min', `${Math.ceil(h)}px`);
    kar.refresh();
  };
  kar.set(p.textContent, clip().words);
  show(0);
  measure();
  document.fonts?.ready.then(measure);
  addEventListener('resize', debounce(measure));
  // Vista previa sin sonido: la primera frase se lee sola, en bucle, hasta que pulsas un capítulo.
  if (!reduced) {
    const W = clip().words, endT = W[Math.min(16, W.length - 1)][1] + 0.5, total = endT + 1.9;
    let t0 = null, visible = true, laps = 0;
    if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(book);
    previewing = true; read.classList.add('is-live');
    const loop = (now) => {
      if (!previewing) return;
      if (t0 === null) t0 = now + 900;
      let t = (now - t0) / 1000;
      if (t > total) { laps += 1; if (laps >= 3) { stopPreview(); return; } t0 = now; t = 0; }
      if (visible && t >= 0) { if (t <= endT) kar.render(t); else if (t > endT + 1.2) kar.render(0, true); }
      praf = requestAnimationFrame(loop);
    };
    praf = requestAnimationFrame(loop);
  }
})();

/* ---------- El aviso de LibriVox, que se escucha con su texto ---------- */
$$('[data-player]').forEach((root) => {
  const id = root.dataset.player, c = DATA.clips?.[id];
  if (!c) return;
  const p = $('[data-words]', root), btn = $('[data-play]', root), timeEl = $('[data-time]', root), seek = $('[data-seek]', root), fill = $('span', seek);
  const kar = new Karaoke(p);
  kar.set(p.textContent, c.words);
  let pos = 0;
  const show = (t) => { fill.style.width = `${Math.min(1, t / c.dur) * 100}%`; timeEl.textContent = t > 0.05 ? `${fmt(t)} / ${fmt(c.dur)}` : fmt(c.dur); };
  const owner = {
    started() { root.classList.add('is-playing', 'is-live'); btn.setAttribute('aria-pressed', 'true'); },
    paused() { pos = hub.time(id); root.classList.remove('is-playing'); btn.setAttribute('aria-pressed', 'false'); },
    ended() { pos = 0; root.classList.remove('is-playing', 'is-live'); btn.setAttribute('aria-pressed', 'false'); kar.render(0, true); show(0); },
    tick(t) { kar.render(t); show(t); },
  };
  btn.addEventListener('click', () => {
    if (hub.playing(owner)) { hub.pause(owner); return; }
    root.classList.add('is-live'); kar.render(pos, pos <= 0); hub.play(id, owner, pos);
  });
  seek.addEventListener('click', (e) => {
    const r = seek.getBoundingClientRect();
    pos = Math.max(0, Math.min(c.dur - 0.05, ((e.clientX - r.left) / r.width) * c.dur));
    root.classList.add('is-live'); kar.render(pos); show(pos); hub.play(id, owner, pos);
  });
  addEventListener('resize', debounce(() => kar.refresh()));
  show(0);
});

/* ---------- El reparto: cuatro voces que se escuchan ---------- */
$$('[data-cast-clip]').forEach((btn) => {
  const id = btn.dataset.castClip, li = btn.closest('li'), c = DATA.clips?.[id];
  if (!c || !li) return;
  let pos = 0;
  btn.setAttribute('aria-pressed', 'false');
  const owner = {
    started() { li.classList.add('is-playing'); btn.setAttribute('aria-pressed', 'true'); },
    paused() { pos = hub.time(id); li.classList.remove('is-playing'); btn.setAttribute('aria-pressed', 'false'); },
    ended() { pos = 0; li.classList.remove('is-playing'); btn.setAttribute('aria-pressed', 'false'); li.style.setProperty('--p', '0'); },
    tick(t) { li.style.setProperty('--p', Math.min(1, t / c.dur).toFixed(4)); },
  };
  btn.addEventListener('click', () => (hub.playing(owner) ? hub.pause(owner) : hub.play(id, owner, pos)));
});

/* ---------- Pestañas (el móvil) ---------- */
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

/* ---------- Copiar la dirección del RSS ---------- */
$$('[data-copy]').forEach((box) => {
  const btn = $('[data-copy-btn]', box), label = $('[data-copy-label]', box), code = $('code', box);
  if (!btn || !code) return;
  let timer = 0;
  btn.addEventListener('click', async () => {
    const txt = code.dataset.copyText || code.textContent.trim();
    let ok = false;
    try { await navigator.clipboard.writeText(txt); ok = true; } catch {
      // Sin acceso al portapapeles: se selecciona el texto para copiarlo a mano
      const r = document.createRange(); r.selectNodeContents(code);
      const s = getSelection(); s.removeAllRanges(); s.addRange(r);
    }
    label.textContent = ok ? 'Copiado' : 'Selecciónalo y cópialo';
    box.classList.toggle('is-copied', ok);
    clearTimeout(timer); timer = setTimeout(() => { label.textContent = 'Copiar'; box.classList.remove('is-copied'); }, 2200);
  });
});

/* ---------- Cómo buscar: el catálogo recreado, que se puede probar ---------- */
(() => {
  const cat = $('[data-cat]');
  if (!cat) return;
  const q = $('[data-cat-q]', cat), list = $('[data-cat-list]', cat), items = $$(':scope > li', list);
  const count = $('[data-cat-count]', cat), empty = $('[data-cat-empty]', cat), crumb = $('[data-cat-crumb]', cat), radios = $$('[data-cat-type]', cat);
  const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const typeTxt = { all: '', solo: ', con una sola voz', group: ', con varias voces' };
  const setCrumb = (query) => {
    crumb.textContent = '';
    if (query) {
      crumb.append('Búsqueda: ', Object.assign(document.createElement('b'), { textContent: `«${query}»` }));
    } else {
      const a = Object.assign(document.createElement('span'), { textContent: 'Language' }), b = Object.assign(document.createElement('b'), { textContent: 'Spanish' });
      a.lang = 'en'; b.lang = 'en'; crumb.append(a, ' › ', b);
    }
  };
  const apply = () => {
    const raw = q.value.trim(), words = norm(raw).split(/\s+/).filter(Boolean);
    const type = radios.find((r) => r.checked)?.value || 'all';
    let n = 0;
    items.forEach((li) => {
      const hay = `${li.dataset.q} ${norm(li.textContent)}`;
      const ok = (type === 'all' || li.dataset.type === type) && words.every((w) => hay.includes(w));
      if (ok && li.hidden && !reduced) { li.classList.remove('is-new'); void li.offsetWidth; li.classList.add('is-new'); }
      li.hidden = !ok;
      if (ok) n += 1;
    });
    radios.forEach((r) => r.closest('label')?.classList.toggle('is-checked', r.checked));
    count.textContent = words.length ? `${n} ${n === 1 ? 'resultado' : 'resultados'} para «${raw}»${typeTxt[type]}` : `Una selección de ${n} audiolibros en español${typeTxt[type]}`;
    empty.hidden = n > 0;
    setCrumb(raw);
    list.scrollTop = 0;
  };
  q.addEventListener('input', () => { cat.classList.remove('hl-type', 'hl-side'); steps.forEach((b) => b.setAttribute('aria-pressed', 'false')); apply(); });
  radios.forEach((r) => r.addEventListener('change', () => { cat.classList.toggle('hl-type', r.value !== 'all'); apply(); }));
  // Los tres pasos de la guía hacen lo mismo que harías tú en LibriVox
  const steps = $$('[data-go]');
  let typing = 0;
  const typeText = (text) => {
    clearInterval(typing);
    if (reduced) { q.value = text; apply(); return; }
    let i = 0; q.value = ''; apply(); cat.classList.add('is-typing');
    typing = setInterval(() => {
      i += 1; q.value = text.slice(0, i); apply();
      if (i >= text.length) { clearInterval(typing); cat.classList.remove('is-typing'); }
    }, 110);
  };
  const go = (k) => {
    steps.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.go === k)));
    cat.classList.remove('hl-type', 'hl-side');
    clearInterval(typing); cat.classList.remove('is-typing');
    const pick = (v) => { radios.forEach((r) => { r.checked = r.value === v; }); };
    if (k === 'lang') { q.value = ''; pick('all'); apply(); }
    if (k === 'solo') { q.value = ''; pick('solo'); apply(); cat.classList.add('hl-type', 'hl-side'); }
    if (k === 'search') { pick('all'); typeText('quijote'); }
    // Con la recreación debajo de los pasos, se lleva a la vista
    const r = cat.getBoundingClientRect();
    if (r.top > innerHeight * 0.6 || r.bottom < 0) cat.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };
  steps.forEach((b) => b.addEventListener('click', () => go(b.dataset.go)));
  apply();
})();

/* ---------- Escuchar y descargar: qué te da cada opción de la ficha ---------- */
(() => {
  const dl = $('[data-dl]');
  if (!dl) return;
  const opts = $$('[data-dl-opt]', dl), panels = $$('[data-dl-panel]', dl), panel = $('.lv-dl__panel', dl);
  // El panel baja hasta quedar a la altura de la opción elegida, con su pico señalándola
  const point = (b) => {
    if (!b) return;
    if (matchMedia('(max-width: 900px)').matches) { panel.style.setProperty('--dy', '0px'); return; }
    const dr = dl.getBoundingClientRect(), pr = panel.getBoundingClientRect(), br = b.getBoundingClientRect();
    const center = br.top + br.height / 2 - dr.top;
    const dy = Math.max(0, Math.min(dr.height - pr.height, center - 64));
    panel.style.setProperty('--dy', `${Math.round(dy)}px`);
    panel.style.setProperty('--py', `${Math.round(Math.max(30, Math.min(pr.height - 30, center - dy)))}px`);
  };
  const show = (b) => {
    const k = b.dataset.dlOpt;
    opts.forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
    panels.forEach((p) => {
      const on = p.dataset.dlPanel === k;
      if (on && p.hidden) { p.hidden = false; p.classList.remove('is-in'); void p.offsetWidth; p.classList.add('is-in'); } else if (!on) p.hidden = true;
    });
    point(b);
  };
  opts.forEach((o) => o.addEventListener('click', () => {
    show(o);
    // En el móvil el panel queda debajo de la columna: se lleva a la vista para ver qué ha cambiado
    if (matchMedia('(max-width: 900px)').matches && panel.getBoundingClientRect().top > innerHeight * 0.7) panel.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' });
  }));
  const active = () => opts.find((o) => o.getAttribute('aria-pressed') === 'true');
  addEventListener('resize', debounce(() => point(active())));
  point(active());
})();

/* ---------- El móvil: la app de pódcasts se suscribe sola al RSS ---------- */
(() => {
  const phone = $('[data-phone]');
  if (!phone) return;
  const url = $('[data-phone-url]', phone), full = url.textContent, replay = $('[data-phone-replay]', phone);
  let timers = [];
  const at = (ms, fn) => timers.push(setTimeout(fn, ms));
  const run = () => {
    timers.forEach(clearTimeout); timers = [];
    phone.classList.remove('is-ready', 'is-press'); phone.classList.add('is-adding'); url.textContent = '';
    let t = 500;
    for (let i = 1; i <= full.length; i += 1) { const s = full.slice(0, i); at(t, () => { url.textContent = s; }); t += 42; }
    at(t + 150, () => phone.classList.add('is-ready'));
    at(t + 800, () => phone.classList.add('is-press'));
    at(t + 1000, () => phone.classList.remove('is-press'));
    at(t + 1250, () => phone.classList.remove('is-adding', 'is-ready'));
  };
  if (reduced) { replay?.remove(); return; }
  armOnApproach(phone, () => { phone.classList.add('is-adding'); url.textContent = ''; }, run, { threshold: 0.5 });
  replay?.addEventListener('click', run);
})();

/* ---------- Revelados: sellos de biblioteca, anillos de nota, barras, idiomas y la línea de los 95 años ---------- */
$$('.lv-cards').forEach((list) => {
  $$('.lv-stamp', list).forEach((s, i) => { s.style.transitionDelay = `${150 + i * 170}ms`; });
  armOnApproach(list, () => list.classList.add('is-pending'), () => list.classList.remove('is-pending'), { threshold: 0.4 });
});
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
$$('[data-bars], [data-langs], [data-ruler]').forEach((b) => armOnApproach(b, () => b.classList.add('is-pending'), () => b.classList.remove('is-pending'), { threshold: 0.4 }));

/* ---------- Voluntariado: en el foro recreado, cada paso se marca al pasar por él ---------- */
$$('[data-steps]').forEach((ol) => {
  const items = $$(':scope > li', ol);
  let ticking = false;
  const update = () => {
    ticking = false;
    const mark = innerHeight * 0.62;
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
  const bar = $('.lv-progress span'), main = $('.lv-main');
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

/* ---------- Barra fija para ir a LibriVox ---------- */
(() => {
  const dock = $('[data-dock]');
  if (!dock || !('IntersectionObserver' in window)) return;
  const hero = $('.lv-hero'), blockers = [$('.lv-verdict'), $('.lv-offer'), $('.sb-footer'), $('.lv-more')].filter(Boolean);
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
  const open = (src, alt) => { img.src = src; img.alt = alt; cap.textContent = alt; if (full) full.href = src; dlg.showModal(); $('.lv-lightbox__img', dlg)?.scrollTo(0, 0); };
  $$('[data-zoom]').forEach((b) => b.addEventListener('click', () => { const s = $('img', b); open(s.currentSrc || s.src, s.alt); }));
  $$('[data-zoom-src]').forEach((b) => b.addEventListener('click', () => open(b.dataset.zoomSrc, b.dataset.zoomAlt || '')));
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
    f.title = 'LibriVox: audiolibros gratis y legales. Guía de SonorBooks';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    const box = Object.assign(document.createElement('div'), { className: 'lv-video' });
    a.replaceWith(box);
    box.append(f);
  });
});
