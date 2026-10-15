// Las mejores plataformas de audiolibros en español · SonorBooks — interacciones de la página. Sin dependencias.
// Todo se ve sin JavaScript (la calculadora con su ejemplo de 15 h y el 2x del primer truco, con los controles desactivados);
// esto añade la calculadora de horas, el selector de velocidad, el visor de capturas y el vídeo al pulsar.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const eur = (n) => n.toFixed(2).replace('.', ',') + ' €';
const hrs = (n) => String(Math.round(n * 10) / 10).replace('.', ',') + ' h';

/* ---------- ¿Cuántas horas escuchas al mes? ---------- */
// Precios y horas de los planes (España, 15/10/2026). Spotify cuenta 0 € si ya pagas Premium (sus 12 h van incluidas) y,
// con Audiolibros+, 8,99 € más por 15 h más. Las horas «sin límite» se guardan como 999.
const PLANS = {
  spotify: { name: 'Spotify', sub: 'tus 12 h de Premium', hours: 12, price: 0, ebooks: false,
    why: 'Ya pagas Premium: sus 12 horas al mes no te cuestan nada más. No se acumulan, y en Duo y Familiar son solo del titular.' },
  podimo: { name: 'Podimo', sub: 'Premium', hours: 20, price: 4.99, ebooks: false,
    why: 'Es el plan más barato que te llega: 20 horas al mes, más sus pódcasts exclusivos. Las horas se reinician el día 1 y no se acumulan, y no tiene ebooks.' },
  'nx-mini': { name: 'Nextory', sub: 'Mini', hours: 10, price: 5.99, ebooks: true,
    why: 'Con 10 horas al mes, audiolibros y ebooks en la misma cuota. Leer también gasta horas, pero las que no gastas se guardan para el mes siguiente.' },
  'bb-basic': { name: 'BookBeat', sub: 'Basic', hours: 20, price: 6.99, ebooks: true,
    why: '20 horas al mes con ebooks incluidos. Ojo: la app está en inglés y en español hay unos 16.500 audiolibros; las horas que sobran se pierden.' },
  'nx-std': { name: 'Nextory', sub: 'Standard', hours: 30, price: 7.99, ebooks: true,
    why: '30 horas al mes de audiolibros y ebooks, con el catálogo de Planeta; las que no gastas se guardan para el mes siguiente.' },
  storytel: { name: 'Storytel', sub: 'Unlimited', hours: 999, price: 8.99, ebooks: true,
    why: 'Por encima de unas 30 horas, la tarifa plana sale más barata: Storytel no cuenta horas, ni aunque escuches a 2x, y lleva ebooks en la misma cuota.' },
  'spotify-plus': { name: 'Spotify', sub: 'con Audiolibros+', hours: 27, price: 8.99, ebooks: false,
    why: 'Tus 12 horas de Premium más las 15 de Audiolibros+, por 8,99 € más al mes. Aun así, por lo mismo Storytel no tiene límite.' },
  audible: { name: 'Audible', sub: 'Premium', hours: 999, price: 9.99, ebooks: false,
    why: 'Sin límite de horas en su catálogo incluido, con sus Originals; algunos superventas se pagan aparte.' },
  'nx-unl': { name: 'Nextory', sub: 'Unlimited', hours: 999, price: 9.99, ebooks: true,
    why: 'Sin límite, con audiolibros y ebooks.' },
  'podimo-plus': { name: 'Podimo', sub: 'Premium Plus', hours: 100, price: 9.99, ebooks: false,
    why: '100 horas al mes.' },
  'bb-std': { name: 'BookBeat', sub: 'Standard', hours: 50, price: 9.99, ebooks: true, why: '50 horas al mes.' },
  'bb-prem': { name: 'BookBeat', sub: 'Premium', hours: 100, price: 14.99, ebooks: true, why: '100 horas al mes.' },
};
// En caso de empate de precio gana el primero de esta lista (el orden de la tabla del vídeo: Storytel antes que Audible).
const ORDER = ['spotify', 'podimo', 'nx-mini', 'bb-basic', 'nx-std', 'storytel', 'spotify-plus', 'audible', 'nx-unl', 'podimo-plus', 'bb-std', 'bb-prem'];

$$('[data-calc]').forEach((box) => {
  const range = $('[data-calc-h]', box), out = $('[data-calc-out]', box), day = $('[data-calc-day]', box);
  const sp = $('[data-calc-spotify]', box), eb = $('[data-calc-ebooks]', box);
  const name = $('[data-calc-name]', box), price = $('[data-calc-price]', box), why = $('[data-calc-why]', box);
  const list = $('[data-calc-plans]', box);
  if (!range || !list) return;
  [range, sp, eb].forEach((el) => { if (el) el.disabled = false; });
  const rows = $$('li[data-k]', list);
  let last = '';
  const upd = () => {
    const h = Number(range.value);
    const hasSp = sp?.checked, wantEb = eb?.checked;
    range.style.setProperty('--p', `${((h - 2) / 98) * 100}%`);
    out.innerHTML = `<b>${hrs(h)}</b>`;
    const min = Math.round((h * 60) / 30 / 5) * 5;
    const perDay = Math.round((h / 30) * 10) / 10;
    day.textContent = min < 60 ? `unos ${Math.max(5, min)}\u00a0min al día` : perDay === 1 ? 'una hora al día' : `unas ${String(perDay).replace('.', ',')}\u00a0h al día`;
    range.setAttribute('aria-valuetext', `${h} horas al mes, ${day.textContent}`);
    list.style.setProperty('--h', String(h));
    // Candidatos: los que cubren las horas, con ebooks si se piden; Spotify solo si ya pagas Premium.
    const ok = (k) => {
      const p = PLANS[k];
      if ((k === 'spotify' || k === 'spotify-plus') && !hasSp) return false;
      if (wantEb && !p.ebooks) return false;
      return p.hours >= h;
    };
    const pick = ORDER.filter(ok).sort((a, b) => PLANS[a].price - PLANS[b].price || ORDER.indexOf(a) - ORDER.indexOf(b))[0];
    rows.forEach((li) => {
      const k = li.dataset.k, p = PLANS[k];
      if (li.hasAttribute('data-spotify')) li.hidden = !hasSp;
      const off = wantEb && !p.ebooks;
      li.classList.toggle('is-off', off);
      li.classList.toggle('is-ok', !off && p.hours >= h);
      li.classList.toggle('is-no', !off && p.hours < h);
      li.classList.toggle('is-pick', k === pick);
    });
    const p = PLANS[pick];
    name.textContent = p.sub && pick !== 'spotify' ? `${p.name} ${p.sub}` : p.name;
    price.innerHTML = pick === 'spotify' ? '0&nbsp;€ más · 12&nbsp;h incluidas'
      : pick === 'spotify-plus' ? '8,99&nbsp;€ más al mes · 27&nbsp;h'
        : `${eur(p.price)} al mes · ${p.hours >= 999 ? 'sin límite de horas' : `${p.hours} h`}`;
    let w = p.why;
    if (pick === 'podimo' && h <= 10) w += ' Si también quieres ebooks, Nextory Mini (5,99 €, 10 h) los incluye.';
    if (pick === 'storytel' && !wantEb) w += ' Si prefieres sus Originals, Audible Premium cuesta 9,99 €, también sin límite.';
    why.textContent = w;
    if (pick !== last && last && !reduced) { box.classList.remove('is-bump'); void box.offsetWidth; box.classList.add('is-bump'); }
    last = pick;
  };
  range.addEventListener('input', upd);
  sp?.addEventListener('change', upd);
  eb?.addEventListener('change', upd);
  upd();
});

/* ---------- Acelerar no ahorra horas ---------- */
$$('[data-speed]').forEach((box) => {
  const ctl = $('[data-speed-ctl]', box), real = $('[data-speed-real]', box), bar = $('[data-speed-bar]', box);
  if (!ctl) return;
  const btns = $$('[role="radio"]', ctl);
  btns.forEach((b) => { b.disabled = false; });
  const pick = (b, focus) => {
    btns.forEach((x) => { const on = x === b; x.setAttribute('aria-checked', String(on)); x.tabIndex = on ? 0 : -1; });
    if (focus) b.focus();
    const v = Number(b.dataset.v), h = 10 / v;
    const hh = Math.floor(h), mm = Math.round((h - hh) * 60);
    real.textContent = mm ? `${hh} h ${mm} min` : `${hh} h`;
    bar.style.setProperty('--v', String(h));
  };
  btns.forEach((b, i) => {
    b.tabIndex = b.getAttribute('aria-checked') === 'true' ? 0 : -1;
    b.addEventListener('click', () => pick(b));
    b.addEventListener('keydown', (e) => {
      const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (k) { e.preventDefault(); pick(btns[(i + k + btns.length) % btns.length], true); }
    });
  });
});

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
  a.setAttribute('aria-label', 'Reproducir aquí «Las mejores plataformas de audiolibros en español»'); // con JavaScript se ve en la página
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    f.title = 'Las mejores plataformas de audiolibros en español, de SonorBooks';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    const box = Object.assign(document.createElement('div'), { className: 'mp-video' });
    a.replaceWith(box);
    box.append(f);
    f.focus();
  });
});
