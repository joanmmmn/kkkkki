/* Guías «Cómo cancelar…» · SonorBooks — visor de capturas y vídeo de YouTube que se carga al pulsar (sin JavaScript, todo se lee igual). */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

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
  a.setAttribute('aria-label', `Reproducir aquí «${a.dataset.title}»`); // con JavaScript se ve en la página
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    f.title = `${a.dataset.title}, de SonorBooks`;
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    const box = Object.assign(document.createElement('div'), { className: 'mp-video' });
    a.replaceWith(box);
    box.append(f);
    f.focus();
  });
});
