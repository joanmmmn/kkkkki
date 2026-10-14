// BookBeat · reseña SonorBooks — interacciones de la página. Sin dependencias, sin cookies y sin guardar nada.
// Todo funciona sin JavaScript (la página se ve completa, con el estado de ejemplo de cada módulo);
// esto añade el cambio «Tus horas / La app» de la portada, el «¿Qué plan de BookBeat te sale?», las fechas de la prueba,
// el carrusel, el visor de capturas y el vídeo que se carga al pulsar.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const NB = ' ';
// 10 → «10»; 12.5 → «12,5»
const num = (n) => String(Math.round(n * 100) / 100).replace('.', ',');
// 16.97 → «16,97 €»
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

/* ---------- Portada: las horas que te quedan y la app, en inglés ---------- */
$$('[data-stage]').forEach((stage) => {
  // El contador se vacía al cargar: de las 20 h del mes a las 19 h 53 min que nos quedaban (las de la captura).
  const n = $('[data-hcard-n]', stage), m = $('[data-hcard-m]', stage);
  if (n && m && !reduced) {
    const fin = 20 * 60 - 7, v = getComputedStyle(m).getPropertyValue('--v');
    const show = (min) => { n.textContent = `${Math.floor(min / 60)}${NB}h${NB}${min % 60}${NB}min`; };
    show(20 * 60);
    m.style.setProperty('--v', '100');
    setTimeout(() => {
      m.style.setProperty('--v', v.trim() || '99.4');
      let t0 = 0;
      const step = (t) => {
        t0 = t0 || t;
        const p = Math.min(1, (t - t0) / 900);
        show(Math.round(20 * 60 - 7 * p));
        if (p < 1) requestAnimationFrame(step); else show(fin);
      };
      requestAnimationFrame(step);
    }, 1000);
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

/* ---------- ¿Qué plan de BookBeat te sale? ---------- */
$$('[data-pick]').forEach((box) => {
  const L = $('[data-pick-l]', box), R = $('[data-pick-r]', box), pCtl = $('[data-pick-p]', box);
  const lout = $('[data-pick-lout]', box), rout = $('[data-pick-rout]', box);
  const kEl = $('[data-pick-k]', box), name = $('[data-pick-name]', box), price = $('[data-pick-price]', box), why = $('[data-pick-why]', box);
  const rows = $$('[data-cap]', box);
  if (!L || !R || !pCtl) return;
  // Sin JavaScript, los controles están desactivados y se ve el ejemplo (12 h de escucha, 3 de lectura, una persona → Basic)
  $$('[disabled]', box).forEach((el) => { el.disabled = false; });
  const PLANS = [{ n: 'Basic', h: 20, p: 6.99 }, { n: 'Standard', h: 50, p: 9.99 }, { n: 'Premium', h: 100, p: 14.99 }];
  const EXTRA = 4.99;
  let people = Number($('[aria-checked="true"]', pCtl)?.dataset.v || 1), last = '';
  const upd = () => {
    const l = Number(L.value), r = Number(R.value), need = l + r;
    lout.textContent = hrs(l); rout.textContent = hrs(r);
    L.setAttribute('aria-valuetext', `${l} ${l === 1 ? 'hora' : 'horas'} al mes`);
    R.setAttribute('aria-valuetext', `${r} ${r === 1 ? 'hora' : 'horas'} al mes`);
    // El plan más barato que cubre a quien más escucha y lee (cada perfil tiene las horas del plan)
    const plan = PLANS.find((p) => need <= p.h) || PLANS[2];
    const over = need > 100;
    // Las barras: escuchar (lila) y leer (azul) sobre las horas de cada plan; Podimo, solo audio
    rows.forEach((row) => {
      const cap = Number(row.dataset.cap), audio = row.hasAttribute('data-audio-only');
      const use = audio ? l : need, lw = Math.min(l, cap), rw = audio ? 0 : Math.min(r, cap - lw);
      const [li, ri] = $$('.bb-bar i', row);
      if (li) li.style.width = `${((lw / cap) * 100).toFixed(2)}%`;
      if (ri) ri.style.width = `${((rw / cap) * 100).toFixed(2)}%`;
      row.classList.toggle('is-over', use > cap);
      row.classList.toggle('is-best', !audio && need > 0 && !over && cap === plan.h);
      const txt = $('[data-bar-txt]', row);
      let t = use > cap ? `Te faltan ${hrs(use - cap)}` : use === cap ? 'Justo' : `Te sobran ${hrs(cap - use)}`;
      if (audio && r > 0) t += ' · sin ebooks';
      txt.textContent = t;
    });
    if (need === 0) {
      kEl.textContent = 'Te sale';
      name.textContent = '—';
      price.textContent = 'Pon las horas que escuchas o lees';
      why.textContent = 'Mueve las barras con las horas que escuchas y lees al mes: te decimos qué plan te cubre.';
      return;
    }
    const total = plan.p + EXTRA * (people - 1);
    kEl.textContent = over ? 'Ni con el más grande' : 'Te sale';
    name.textContent = over ? 'Premium, y no te llega' : plan.n;
    price.textContent = people > 1
      ? `${eur(total)} al mes · ${people} perfiles con ${plan.h}${NB}h cada uno`
      : `${eur(plan.p)} al mes · ${plan.h}${NB}h`;
    const mix = l && r ? ` (${hrs(l)} de escucha y ${hrs(r)} de lectura)` : r ? ' de lectura' : ' de escucha';
    const sobran = plan.h - need;
    const resto = sobran > 0 ? ` Te sobran ${hrs(sobran)}, que se pierden el día del pago.` : '';
    // Los precios de Storytel y Podimo son de una persona: solo se comparan con una; Podimo, solo si escuchas (no tiene ebooks).
    const solo = people === 1;
    let w;
    if (over) {
      w = `Con ${hrs(need)} al mes${mix}, ni Premium te llega: sus 100${NB}h se te acaban y tendrías que comprar horas extra.`
        + (solo ? ` Si escuchas o lees tanto, Storytel no te cuenta las horas por 8,99${NB}€.` : '');
    } else if (plan.h === 20) {
      w = `Con ${hrs(need)} al mes${mix}, te basta Basic: 20${NB}h por 6,99${NB}€.${resto}`
        + (solo && l ? (r ? ` Podimo cuesta menos (4,99${NB}€ por 20${NB}h), pero no tiene ebooks.` : ` Pero si solo escuchas, Podimo te da 20${NB}h por 4,99${NB}€.`) : '');
    } else if (plan.h === 50) {
      w = `Con ${hrs(need)} al mes${mix}, Basic se te queda corto: te toca Standard, 50${NB}h por 9,99${NB}€.${resto}`
        + (solo ? ` Por 8,99${NB}€, Storytel no te cuenta las horas, y también tiene ebooks.` : '');
    } else {
      w = `Con ${hrs(need)} al mes${mix}, te toca Premium: 100${NB}h por 14,99${NB}€.${resto}`
        + (solo ? ` Si escuchas o lees tanto, Storytel te sale más barato: 8,99${NB}€ sin contar horas.` : '');
    }
    if (people > 1) {
      const extra = people - 1;
      w += ` Sois ${people}: ${plan.n} y ${extra} perfil${extra > 1 ? 'es' : ''} extra a 4,99${NB}€, ${eur(total)} al mes (unos ${eur(total / people)} por persona), y cada perfil tiene sus ${plan.h}${NB}h. Ojo: en la prueba no se pueden añadir perfiles. Si sois varios, Storytel también tiene un plan familiar, sin contar horas.`;
    }
    why.textContent = w;
    const key = `${over}:${plan.n}`;
    if (last && key !== last && !reduced) { box.classList.remove('is-bump'); void box.offsetWidth; box.classList.add('is-bump'); }
    last = key;
  };
  L.addEventListener('input', upd);
  R.addEventListener('input', upd);
  radios(pCtl, (v) => { people = Number(v); upd(); });
  upd();
});

/* ---------- Cuándo cancelar: las fechas de tu prueba ---------- */
$$('[data-trial]').forEach((box) => {
  const ctl = $('[data-trial-ctl]', box), input = $('[data-trial-start]', box), note = $('[data-trial-note]', box);
  const times = $$('[data-trial-d]', box), charge = $('[data-trial-charge]', box), plans = $('[data-trial-plan]', box);
  if (!ctl || !input || !('Intl' in window)) return;
  const fmt = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long' });
  const plus = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  // «del 10 al 13 de noviembre» o, si cambia el mes, «del 15 de octubre al 9 de noviembre»
  const range = (a, b) => (a.getMonth() === b.getMonth() ? `del ${a.getDate()} al ${fmt.format(b)}` : `del ${fmt.format(a)} al ${fmt.format(b)}`);
  const P = { basic: ['6,99', 'Basic', 20], standard: ['9,99', 'Standard', 50], premium: ['14,99', 'Premium', 100] };
  let plan = $('[aria-checked="true"]', plans)?.dataset.v || 'standard';
  const upd = () => {
    const [y, m, d] = (input.value || '').split('-').map(Number);
    if (y && m && d) {
      const start = new Date(y, m - 1, d);
      times.forEach((t) => {
        const ds = t.dataset.trialD.split(',').map((n) => plus(start, Number(n)));
        t.textContent = ds.length > 1 ? range(ds[0], ds[1]) : fmt.format(ds[0]);
        t.dateTime = iso(ds[0]);
      });
      note.textContent = `Fechas para una prueba que empieza el ${fmt.format(start)}: termina el ${fmt.format(plus(start, 30))} y el primer cobro llega el ${fmt.format(plus(start, 31))}. Compruébalas en tu cuenta, en la web. En la nuestra, con alta el 14 de octubre de 2026: «Free trial period (20 hours)» y «Upcoming change: Standard (50 hours) from 14/11/2026».`;
    }
    const [p, n, h] = P[plan];
    charge.textContent = `Si no cancelaste, primer cobro: ${p}${NB}€ (${n}, con ${h}${NB}h al mes). BookBeat no te avisa antes.`;
  };
  input.value = iso(new Date());
  ctl.hidden = false;
  input.addEventListener('input', upd);
  input.addEventListener('change', upd);
  radios(plans, (v) => { plan = v; upd(); });
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
  const bar = $('.bb-progress span'), main = $('.bb-main');
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

/* ---------- Barra fija con la prueba ---------- */
(() => {
  const dock = $('[data-dock]'); if (!dock || !('IntersectionObserver' in window)) return;
  const hero = $('.bb-hero'), blockers = [$('#prueba-30-dias'), $('.bb-offer'), $('.sb-footer'), $('.bb-verdict'), $('.bb-more')].filter(Boolean);
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
  a.setAttribute('aria-label', 'Reproducir aquí la reseña de BookBeat en vídeo'); // con JavaScript se ve en la página
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    f.title = '¿Merece la pena BookBeat? Reseña de SonorBooks';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    const box = Object.assign(document.createElement('div'), { className: 'bb-video' });
    a.replaceWith(box);
    box.append(f);
    f.focus();
  });
});
