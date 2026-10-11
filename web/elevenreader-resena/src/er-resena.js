// ElevenReader · reseña SonorBooks — interacciones de la página. Sin dependencias.
// Todo funciona sin JavaScript (la página se ve completa); esto añade audio, resaltado y animaciones.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const DATA = (() => { try { return JSON.parse($('#er-data')?.textContent || '{}'); } catch { return {}; } })();
const fmt = (t) => { t = Math.max(0, Math.round(t)); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`; };
const comma = (n) => String(n).replace('.', ',');
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

/* ---------- Reproductores con resaltado palabra a palabra ---------- */
const players = [];
const wrapWords = (p) => {
  const words = p.textContent.trim().split(/\s+/);
  p.textContent = '';
  return words.map((w, i) => {
    const s = document.createElement('span');
    s.className = 'w'; s.textContent = w;
    p.append(s);
    if (i < words.length - 1) p.append(' ');
    return s;
  });
};
class Player {
  constructor(root) {
    this.root = root; this.id = root.dataset.player;
    this.clip = DATA.clips?.[this.id];
    if (!this.clip) return;
    this.para = $('[data-words]', root);
    this.words = this.para ? wrapWords(this.para) : [];
    this.n = Math.min(this.words.length, this.clip.words.length);
    this.btn = $('[data-play]', root); this.fill = $('.er-reader__bar span', root); this.timeEl = $('[data-time]', root);
    this.rate = 1; this.idx = -2; this.playing = false;
    this.wave = $('[data-wave]', root);
    if (this.wave) this.drawWave();
    this.btn?.addEventListener('click', () => this.toggle());
    $$('[data-skip]', root).forEach((b) => b.addEventListener('click', () => this.seek(this.now() + Number(b.dataset.skip))));
    $$('[data-seek]', root).forEach((el) => el.addEventListener('click', (e) => {
      const r = el.getBoundingClientRect();
      this.seek(((e.clientX - r.left) / r.width) * this.clip.dur, true);
    }));
    this.render(0, true);
    if (this.para && this.root.matches('.er-hero .er-reader')) { this.para.classList.add('is-reading'); this.words[0]?.classList.add('is-on'); }
    players.push(this);
  }
  get audio() {
    if (!this.a) {
      this.a = new Audio(DATA.audio[this.id]);
      this.a.preload = 'auto';
      this.a.addEventListener('ended', () => { this.pause(); this.a.currentTime = 0; this.render(0, true); });
    }
    return this.a;
  }
  now() { return this.a ? this.a.currentTime : 0; }
  toggle() { this.playing ? this.pause() : this.play(); }
  play() {
    players.forEach((p) => p !== this && p.pause());
    this.root.classList.remove('is-inviting');
    const a = this.audio;
    a.playbackRate = this.rate;
    a.play().then(() => {
      this.playing = true; this.root.classList.add('is-playing');
      this.btn?.setAttribute('aria-pressed', 'true');
      const tick = () => { this.render(a.currentTime); if (this.playing) this.raf = requestAnimationFrame(tick); };
      tick();
    }).catch(() => { /* el navegador ha bloqueado el audio */ });
  }
  pause() {
    if (!this.a) return;
    this.a.pause(); this.playing = false; cancelAnimationFrame(this.raf);
    this.root.classList.remove('is-playing'); this.btn?.setAttribute('aria-pressed', 'false');
  }
  seek(t, play = false) {
    const a = this.audio;
    a.currentTime = Math.min(Math.max(0, t), this.clip.dur - 0.05);
    this.render(a.currentTime);
    if (play && !this.playing) this.play();
  }
  setRate(r) { this.rate = r; if (this.a) this.a.playbackRate = r; }
  render(t, reset = false) {
    const W = this.clip.words;
    let idx = -1;
    if (!reset) for (let i = 0; i < this.n; i++) { if (t >= W[i][0] - 0.02) idx = i; else break; }
    if (idx !== this.idx) {
      this.words.forEach((w, i) => { w.classList.toggle('is-on', i === idx); w.classList.toggle('is-past', i < idx); });
      this.idx = idx;
    }
    if (this.para) this.para.classList.toggle('is-reading', !reset && t > 0.01);
    const p = Math.min(1, t / this.clip.dur);
    if (this.fill) this.fill.style.width = `${p * 100}%`;
    if (this.timeEl) this.timeEl.textContent = `${fmt(t)} / ${fmt(this.clip.dur)}`;
    if (this.bars) { const k = Math.round(p * this.bars.length); this.bars.forEach((b, i) => b.classList.toggle('is-past', i < k)); }
  }
  drawWave() {
    const peaks = DATA.peaks?.[this.id] || [];
    this.bars = peaks.map((v) => { const i = document.createElement('i'); i.style.height = `${Math.max(10, v * 100)}%`; this.wave.append(i); return i; });
  }
}
$$('[data-player]').forEach((el) => new Player(el));
document.addEventListener('visibilitychange', () => { if (document.hidden) players.forEach((p) => p.pause()); });

/* ---------- Titular: la página se «lee» sola al cargar ---------- */
(() => {
  const hw = $$('.er-h1 .hw');
  if (reduced || !hw.length) return;
  hw.forEach((w, i) => {
    setTimeout(() => { hw[i - 1]?.classList.remove('is-on'); w.classList.add('is-on'); }, 450 + i * 300);
  });
  setTimeout(() => hw.at(-1).classList.remove('is-on'), 450 + hw.length * 300 + 350);
})();

/* ---------- Laboratorio de opciones del lector ---------- */
(() => {
  const lab = $('[data-lab]');
  if (!lab) return;
  const pl = players.find((p) => p.root === lab);
  const radios = (group, attr) => {
    const box = $(group); if (!box) return;
    const btns = $$('[role="radio"]', box);
    btns.forEach((b) => b.addEventListener('click', () => {
      btns.forEach((x) => x.setAttribute('aria-checked', String(x === b)));
      lab.setAttribute(attr, b.dataset.v);
    }));
  };
  radios('[data-lab-theme]', 'data-theme-r');
  radios('[data-lab-hl]', 'data-hl');
  const size = $('[data-lab-size]'), sizeOut = $('[data-size-out]');
  size?.addEventListener('input', () => { lab.style.setProperty('--lab-size', `${size.value}px`); sizeOut.textContent = `${size.value} px`; });
  const rate = $('[data-lab-rate]'), rateOut = $('[data-rate-out]'), rateLbl = $('[data-rate-label]', lab);
  rate?.addEventListener('input', () => {
    const r = Number(rate.value);
    const s = `${comma(r)}x`;
    rateOut.textContent = s; if (rateLbl) rateLbl.textContent = s;
    pl?.setRate(r);
  });
})();

/* ---------- Pestañas (etiquetas de precio, dónde cancelar) ---------- */
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

/* ---------- Búsqueda de superventas ---------- */
$$('[data-search]').forEach((box) => {
  const rows = $$('li', box);
  armOnApproach(box, () => rows.forEach((r) => r.classList.add('is-searching')),
    () => rows.forEach((r, i) => setTimeout(() => r.classList.remove('is-searching'), 450 + i * 380)), { threshold: 0.35 });
});

/* ---------- Subida del PDF ---------- */
$$('[data-pipe]').forEach((pipe) => {
  const steps = $$('ol li', pipe), track = $('.er-pipe__track span', pipe), big = $('[data-count-to]', pipe);
  const reset = () => {
    pipe.classList.add('is-running');
    steps.forEach((s) => s.classList.remove('is-done', 'is-active'));
    track.style.transform = 'scaleX(0)';
    if (big) big.firstChild.nodeValue = '0 ';
  };
  const run = () => {
    let i = 0;
    reset();
    const next = () => {
      if (i > 0) { steps[i - 1].classList.remove('is-active'); steps[i - 1].classList.add('is-done'); }
      track.style.transform = `scaleX(${i / steps.length})`;
      if (i < steps.length) { steps[i].classList.add('is-active'); i++; setTimeout(next, 750); return; }
      pipe.classList.remove('is-running');
      if (big) { const end = Number(big.dataset.countTo); const t0 = performance.now();
        const step = (t) => { const v = Math.min(end, Math.round(((t - t0) / 900) * end)); big.firstChild.nodeValue = `${v} `; if (v < end) requestAnimationFrame(step); };
        requestAnimationFrame(step); }
    };
    next();
  };
  $('[data-replay]', pipe)?.addEventListener('click', run);
  armOnApproach(pipe, reset, run, { threshold: 0.45 });
});

/* ---------- PDF original frente a lo que lee la voz ---------- */
$$('[data-ba]').forEach((ba) => armOnApproach(ba, () => ba.classList.add('is-armed'), () => setTimeout(() => ba.classList.add('is-marked'), 350), { threshold: 0.4 }));

/* ---------- Calendario de 30 días ---------- */
$$('[data-cal]').forEach((cal) => {
  const grid = $('[data-cal-grid]', cal), num = $('[data-cal-n]', cal);
  const cells = Array.from({ length: 30 }, (_, i) => { const c = document.createElement('i'); c.textContent = i + 1; grid.append(c); return c; });
  const final = () => { cells.forEach((c, i) => { c.className = i < 3 ? 'std' : 'sb'; }); cells[29].classList.add('last'); num.textContent = '30'; };
  final();
  armOnApproach(cal, () => { cells.forEach((c) => { c.className = ''; }); num.textContent = '0'; }, () => {
    let i = 0;
    const tick = () => {
      if (i > 0) cells[i - 1].classList.remove('pop');
      if (i >= 30) { cells[29].classList.add('last'); return; }
      cells[i].className = `${i < 3 ? 'std' : 'sb'} pop`;
      num.textContent = String(i + 1);
      i++;
      setTimeout(tick, i <= 3 ? 260 : i === 4 ? 520 : 55);
    };
    tick();
  }, { threshold: 0.45 });
});

/* ---------- Precios: mensual o anual ---------- */
$$('[data-bill]').forEach((box) => {
  const btns = $$('[role="radio"]', box);
  const price = $('[data-price-m]'), per = $('[data-per-m]'), sub = $('[data-sub-m]');
  btns.forEach((b) => b.addEventListener('click', () => {
    const v = b.dataset.v;
    btns.forEach((x) => x.setAttribute('aria-checked', String(x === b)));
    const swap = (el, txt) => {
      if (!el || el.textContent === txt) return;
      if (reduced || !el.animate) { el.textContent = txt; return; }
      el.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-8px)' }], { duration: 140, easing: 'ease-in' }).onfinish = () => {
        el.textContent = txt;
        el.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 220, easing: 'cubic-bezier(.2,.8,.2,1)' });
      };
    };
    swap(price, price.dataset[`price${v.toUpperCase()}`]);
    swap(per, per.dataset[`per${v.toUpperCase()}`]);
    swap(sub, sub.dataset[`sub${v.toUpperCase()}`]);
  }));
});

/* ---------- Factura que se imprime ---------- */
$$('[data-receipt]').forEach((w) => armOnApproach(w, () => w.classList.add('is-pending'),
  () => { w.classList.add('is-printing'); requestAnimationFrame(() => w.classList.remove('is-pending')); }, { threshold: 0.45 }));

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

/* ---------- Preguntas frecuentes con apertura suave ---------- */
$$('.er-faq details').forEach((d) => {
  const sum = $('summary', d), body = $('div', d);
  sum.addEventListener('click', (e) => {
    if (reduced || !body.animate) return;
    e.preventDefault();
    if (d.open) {
      const h = body.offsetHeight;
      body.animate([{ height: `${h}px`, opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 220, easing: 'ease-in' }).onfinish = () => { d.open = false; };
    } else {
      d.open = true;
      const h = body.offsetHeight;
      body.animate([{ height: '0px', opacity: 0 }, { height: `${h}px`, opacity: 1 }], { duration: 280, easing: 'cubic-bezier(.2,.8,.2,1)' });
    }
  });
});

/* ---------- Progreso de lectura e índice activo ---------- */
(() => {
  const bar = $('.er-progress span'), main = $('.er-main');
  if (bar && main) {
    let ticking = false;
    const upd = () => {
      ticking = false;
      const r = main.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight * 0.6)));
      bar.style.transform = `scaleX(${p.toFixed(4)})`;
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }
  const links = $$('.er-toc a[href^="#"]');
  const map = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    links.forEach((a) => a.classList.remove('is-active'));
    map.get(e.target.id)?.classList.add('is-active');
  }), { rootMargin: '-25% 0px -65% 0px' });
  map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
})();

/* ---------- Barra fija con la oferta ---------- */
(() => {
  const dock = $('[data-dock]'); if (!dock || !('IntersectionObserver' in window)) return;
  const hero = $('.er-hero'), blockers = [$('#prueba-30-dias'), $('.er-offer'), $('.sb-footer'), $('.er-verdict')].filter(Boolean);
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
  const img = $('img', dlg), cap = $('p', dlg);
  $$('[data-zoom]').forEach((b) => b.addEventListener('click', () => {
    const src = $('img', b);
    img.src = src.currentSrc || src.src; img.alt = src.alt;
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
    f.title = 'ElevenReader: ¿merece la pena? Reseña de SonorBooks';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    const box = Object.assign(document.createElement('div'), { className: 'er-video' });
    a.replaceWith(box);
    box.append(f);
  });
});
