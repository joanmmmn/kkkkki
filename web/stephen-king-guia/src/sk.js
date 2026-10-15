// «Stephen King: por dónde y cómo empezar a leer». Sin cookies ni almacenamiento.

// Vídeo: se carga solo al pulsar (youtube-nocookie). Sin ID, el enlace lleva al canal de YouTube.
const v = document.querySelector('.sk-video');
if (v && v.dataset.yt) {
  v.addEventListener('click', (ev) => {
    ev.preventDefault();
    const box = Object.assign(document.createElement('div'), { className: 'sk-video' });
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${v.dataset.yt}?autoplay=1&rel=0`;
    f.title = 'Stephen King: por dónde y cómo empezar a leer';
    f.allow = 'autoplay; encrypted-media; picture-in-picture';
    f.allowFullscreen = true;
    box.appendChild(f);
    v.replaceWith(box);
    f.focus();
  });
}

// «¿Por dónde empiezo yo?»: gusto × tiempo → un libro, su audiolibro y los días a una hora al día.
const form = document.getElementById('sk-picker');
const out = document.getElementById('sk-pick');
const dataEl = document.getElementById('sk-pick-data');
if (form && out && dataEl) {
  const data = JSON.parse(dataEl.textContent);
  const img0 = out.querySelector('img');
  const base = img0 ? img0.getAttribute('src').replace(/cover-[^/]+$/, '') : './media/';
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const render = () => {
    const g = form.elements.gusto.value;
    const t = form.elements.tiempo.value;
    const r = data[`${g}|${t}`];
    if (!r) return;
    const dots = Array.from({ length: r.d }, (_, i) => `<i style="animation-delay:${120 + i * 14}ms"></i>`).join('');
    out.innerHTML =
      `<div class="sk-pick-cover"><img class="sk-cover" src="${base}cover-${esc(r.k)}.webp" alt="Portada del audiolibro «${esc(r.t)}»" width="480" height="480" decoding="async"></div>` +
      `<div class="sk-pick-info"><h3><cite>${esc(r.t)}</cite> <span>(${esc(r.y)})</span></h3><p>${esc(r.why)}</p>` +
      `<dl class="sk-pick-facts"><div><dt>Audiolibro</dt><dd>${esc(r.dur)}</dd></div><div><dt>Narra</dt><dd>${esc(r.n)}</dd></div>` +
      `<div><dt>A una hora al día</dt><dd>${esc(r.d)} días</dd></div></dl>` +
      `<div class="sk-days" aria-hidden="true">${dots}</div>` +
      `<a class="sk-btn" href="${esc(r.f)}">Ver dónde escucharlo<svg aria-hidden="true"><use href="#i-arrow"/></svg><span class="sk-sr"> «${esc(r.t)}»</span></a></div>`;
    out.classList.remove('is-new');
    void out.offsetWidth;
    out.classList.add('is-new');
  };
  form.addEventListener('change', render);
  form.addEventListener('submit', (ev) => ev.preventDefault());
}

// Las barras de duración crecen al entrar en pantalla (sin movimiento con «reducir movimiento»).
const bars = document.querySelector('.sk-bars');
if (bars && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const r = bars.getBoundingClientRect();
  if (r.top > innerHeight) {
    bars.classList.add('is-wait');
    const io = new IntersectionObserver((entries) => {
      if (entries.some((en) => en.isIntersecting)) {
        bars.classList.remove('is-wait');
        io.disconnect();
      }
    }, { threshold: 0.35 });
    io.observe(bars);
  }
}
