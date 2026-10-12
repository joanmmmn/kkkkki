// LibriVox · reseña SonorBooks — interacciones de la página. Sin dependencias.
// Todo funciona sin JavaScript (la página se ve completa); esto añade el audio, el resaltado y las animaciones.
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

/* ---------- Reproductores: la voz del voluntario con el texto resaltado palabra a palabra ---------- */
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
    this.btn = $('[data-play]', root); this.label = $('[data-listen-label]', root);
    this.fill = $('.lv-book__bar span', root); this.timeEl = $('[data-time]', root);
    this.av = $('.lv-av', root); this.demo = root.matches('[data-demo]');
    // Cápsula amarilla que se desliza de palabra en palabra
    this.glide = $('.lv-glide', root);
    if (!this.glide && this.para) { this.glide = Object.assign(document.createElement('span'), { className: 'lv-glide' }); this.glide.setAttribute('aria-hidden', 'true'); this.para.before(this.glide); }
    if (this.demo) root.classList.add('is-live');
    this.idx = -2; this.playing = false;
    this.wave = $('[data-wave]', root);
    if (this.wave) this.drawWave();
    this.btn?.addEventListener('click', () => this.toggle());
    $$('[data-seek]', root).forEach((el) => el.addEventListener('click', (e) => {
      const r = el.getBoundingClientRect();
      this.seek(((e.clientX - r.left) / r.width) * this.clip.dur, true);
    }));
    this.render(0, true);
    addEventListener('resize', () => { const i = this.idx; this.idx = -2; this.render(i >= 0 ? this.clip.words[i][0] : 0, i < 0, this.previewing); });
    if (this.demo) this.preview();
    players.push(this);
  }
  get audio() {
    if (!this.a) {
      this.a = new Audio(DATA.audio[this.id]);
      this.a.preload = 'auto';
      this.a.addEventListener('ended', () => { this.pause(); this.a.currentTime = 0; this.render(0, true); if (this.label) this.label.textContent = 'Escuchar otra vez'; });
    }
    return this.a;
  }
  toggle() { this.playing ? this.pause() : this.play(); }
  analyser() {
    if (!this.av || this.an !== undefined) return;
    this.an = null;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      Player.ctx = Player.ctx || new Ctx();
      const src = Player.ctx.createMediaElementSource(this.audio);
      const an = Player.ctx.createAnalyser(); an.fftSize = 512;
      src.connect(an); an.connect(Player.ctx.destination);
      this.an = an; this.buf = new Uint8Array(an.fftSize);
    } catch { this.an = null; }
  }
  play() {
    players.forEach((p) => p !== this && p.pause());
    this.previewing = false; cancelAnimationFrame(this.praf);
    const a = this.audio;
    this.analyser();
    if (Player.ctx?.state === 'suspended') Player.ctx.resume();
    a.play().then(() => {
      this.playing = true; this.root.classList.add('is-playing');
      this.btn?.setAttribute('aria-pressed', 'true'); if (this.label) this.label.textContent = 'Pausa';
      const tick = () => {
        this.render(a.currentTime);
        if (this.an) {
          this.an.getByteTimeDomainData(this.buf);
          let sum = 0; for (const v of this.buf) { const d = (v - 128) / 128; sum += d * d; }
          this.av.style.setProperty('--amp', (1 + Math.min(0.22, Math.sqrt(sum / this.buf.length) * 1.8)).toFixed(3));
        }
        if (this.playing) this.raf = requestAnimationFrame(tick);
      };
      tick();
    }).catch(() => { /* el navegador ha bloqueado el audio */ });
  }
  pause() {
    if (!this.a) return;
    this.a.pause(); this.playing = false; cancelAnimationFrame(this.raf);
    this.root.classList.remove('is-playing'); this.btn?.setAttribute('aria-pressed', 'false');
    if (this.label) this.label.textContent = 'Escuchar';
    this.av?.style.setProperty('--amp', '1');
  }
  seek(t, play = false) {
    const a = this.audio;
    a.currentTime = Math.min(Math.max(0, t), this.clip.dur - 0.05);
    this.render(a.currentTime);
    if (play && !this.playing) this.play();
  }
  // Vista previa sin sonido en la portada: la primera frase se «lee» en bucle hasta que pulsas Escuchar.
  preview() {
    if (reduced) return;
    const W = this.clip.words, last = Math.min(16, this.n - 1);
    const endT = W[last][1] + 0.5, total = endT + 1.9;
    let t0 = null, visible = true;
    if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(this.root);
    this.previewing = true;
    const loop = (now) => {
      if (!this.previewing) return;
      if (t0 === null) t0 = now + 900;
      let t = (now - t0) / 1000;
      if (t > total) { t0 = now; t = 0; }
      if (visible && t >= 0) {
        if (t <= endT) this.render(t, false, true);
        else if (t > endT + 1.2) this.render(0, true, true);
      }
      this.praf = requestAnimationFrame(loop);
    };
    this.praf = requestAnimationFrame(loop);
  }
  moveGlide(idx) {
    const g = this.glide;
    if (!g) return;
    if (idx < 0 || !this.words[idx]) { g.classList.remove('is-on'); this.gy = undefined; return; }
    const base = g.offsetParent?.getBoundingClientRect(), r = this.words[idx].getBoundingClientRect();
    if (!base) return;
    const x = r.left - base.left - 4, y = r.top - base.top - 1, wd = r.width + 8, h = r.height + 2;
    const jump = this.gy === undefined || Math.abs(y - this.gy) > 2;
    g.classList.toggle('no-anim', jump);
    g.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    g.style.width = `${wd.toFixed(1)}px`; g.style.height = `${h.toFixed(1)}px`;
    g.classList.add('is-on'); this.gy = y;
  }
  render(t, reset = false, preview = false) {
    const W = this.clip.words;
    let idx = -1;
    if (!reset) for (let i = 0; i < this.n; i++) { if (t >= W[i][0] - 0.02) idx = i; else break; }
    if (idx !== this.idx) {
      this.words.forEach((w, i) => { w.classList.toggle('is-on', i === idx); w.classList.toggle('is-past', i < idx); });
      this.idx = idx;
      this.moveGlide(idx);
    }
    if (preview) return;
    const p = Math.min(1, t / this.clip.dur);
    if (this.fill) this.fill.style.width = `${p * 100}%`;
    if (this.timeEl) this.timeEl.textContent = this.playing || t > 0.01 ? `${fmt(t)} / ${fmt(this.clip.dur)}` : (this.demo ? '' : `0:00 / ${fmt(this.clip.dur)}`);
    if (this.bars) { const k = Math.round(p * this.bars.length); this.bars.forEach((b, i) => b.classList.toggle('is-past', i < k)); }
  }
  drawWave() {
    const peaks = DATA.peaks?.[this.id] || [];
    this.bars = peaks.map((v) => { const i = document.createElement('i'); i.style.height = `${Math.max(10, v * 100)}%`; this.wave.append(i); return i; });
  }
}
$$('[data-player]').forEach((el) => new Player(el));
document.addEventListener('visibilitychange', () => { if (document.hidden) players.forEach((p) => p.pause()); });

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

/* ---------- Revelado al hacer scroll (solo desplazamiento: el contenido nunca se oculta) ---------- */
$$('[data-reveal]').forEach((el) => armOnApproach(el, () => el.classList.add('is-pending'), () => { el.classList.add('is-in'); el.classList.remove('is-pending'); }, { threshold: 0.15 }));
$$('[data-stagger]').forEach((list) => {
  const items = [...list.children];
  armOnApproach(list, () => items.forEach((li, i) => { li.classList.add('is-pending'); li.style.transitionDelay = `${i * 70}ms`; }),
    () => items.forEach((li) => li.classList.remove('is-pending')), { threshold: 0.15 });
});

/* ---------- Anillos de nota (7,5), barras, idiomas y la línea de los 95 años ---------- */
const fillRing = (ring) => {
  const n = $('[data-count]', ring);
  requestAnimationFrame(() => requestAnimationFrame(() => ring.classList.remove('is-pending')));
  if (n) {
    const end = Number(n.dataset.count), t0 = performance.now();
    const show = (v) => { n.textContent = String(v).replace('.', ','); };
    const step = (t) => { const k = Math.min(1, (t - t0) / 1200), v = Math.round(k * end * 2) / 2; show(k < 1 ? v : end); if (k < 1) requestAnimationFrame(step); };
    show(0); requestAnimationFrame(step);
  }
};
$$('[data-ring]').forEach((ring) => {
  if (reduced) return;
  if (!belowFold(ring)) { ring.classList.add('is-pending'); setTimeout(() => fillRing(ring), 500); return; }
  armOnApproach(ring, () => ring.classList.add('is-pending'), () => fillRing(ring), { threshold: 0.5 });
});
$$('[data-bars], [data-langs], [data-ruler]').forEach((b) => armOnApproach(b, () => b.classList.add('is-pending'), () => b.classList.remove('is-pending'), { threshold: 0.4 }));

/* ---------- Pasos del voluntariado: la línea avanza con el scroll ---------- */
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
  const dock = $('[data-dock]'); if (!dock || !('IntersectionObserver' in window)) return;
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
    f.title = 'LibriVox: audiolibros gratis y legales. Reseña de SonorBooks';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    const box = Object.assign(document.createElement('div'), { className: 'lv-video' });
    a.replaceWith(box);
    box.append(f);
  });
});
