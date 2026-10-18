// Vídeo: se carga solo al pulsar (youtube-nocookie). Sin ID, el enlace lleva al canal de YouTube.
const v = document.querySelector('.t10-video');
if (v && v.dataset.yt) {
  v.addEventListener('click', (ev) => {
    ev.preventDefault();
    const box = Object.assign(document.createElement('div'), { className: 't10-video' });
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${v.dataset.yt}?autoplay=1&rel=0`;
    f.title = 'Los 10 mejores · Fantasía';
    f.allow = 'autoplay; encrypted-media; picture-in-picture';
    f.allowFullscreen = true;
    box.appendChild(f);
    v.replaceWith(box);
  });
}
