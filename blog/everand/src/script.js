(function () {
  var root = document.getElementById('sbx-everand');
  if (!root) return;
  root.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fmt = function (n, dec) {
    var s = n.toFixed(dec || 0).split('.');
    s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return s.join(',');
  };
  // Contadores: cuentan hasta su valor la primera vez que se ven.
  var count = function (el) {
    var to = parseFloat(el.getAttribute('data-count')), dec = parseInt(el.getAttribute('data-dec') || '0', 10);
    if (reduce || !to) { el.textContent = fmt(to, dec); return; }
    var t0 = null, dur = 1400;
    var step = function (t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * e, dec);
      if (p < 1) requestAnimationFrame(step);
    };
    el.textContent = fmt(0, dec);
    requestAnimationFrame(step);
  };
  // Aparición al hacer scroll.
  var targets = root.querySelectorAll('.sbx-rv, .sbx-chips, .sbx-time, .sbx-mark, .sbx-strike, .sbx-waffle');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('sbx-in');
        e.target.querySelectorAll('[data-count]').forEach(count);
        if (e.target.hasAttribute('data-count')) count(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('sbx-in'); });
  }

  // Barra fija: capítulo actual, minutos restantes, progreso de lectura e índice desplegable.
  var bar = root.querySelector('.sbx-bar-top'), hero = root.querySelector('.sbx-hero');
  var secs = Array.prototype.slice.call(root.querySelectorAll('section[data-ch]'));
  var chBtn = bar.querySelector('.ch'), chNum = chBtn.querySelector('b'), chTxt = chBtn.querySelector('span');
  var leftEl = bar.querySelector('.left span'), toc = bar.querySelector('.toc');
  var words = (root.innerText || root.textContent || '').split(/\s+/).length;
  secs.forEach(function (s) {
    var a = document.createElement('a');
    a.href = '#' + s.id;
    a.innerHTML = '<b>' + s.getAttribute('data-n') + '</b>' + s.getAttribute('data-ch');
    a.addEventListener('click', function () { bar.classList.remove('open'); });
    toc.appendChild(a);
  });
  var links = toc.querySelectorAll('a');
  chBtn.addEventListener('click', function (e) { e.stopPropagation(); bar.classList.toggle('open'); });
  document.addEventListener('click', function (e) { if (!bar.contains(e.target)) bar.classList.remove('open'); });
  var ticking = false;
  var update = function () {
    ticking = false;
    var r = root.getBoundingClientRect(), vh = window.innerHeight;
    var show = hero.getBoundingClientRect().bottom < 0 && r.bottom > vh * 0.4;
    if (bar.classList.contains('show') !== show) {
      bar.classList.toggle('show', show);
      bar.setAttribute('aria-hidden', show ? 'false' : 'true');
      chBtn.tabIndex = show ? 0 : -1;
      if (!show) bar.classList.remove('open');
    }
    var p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
    bar.style.setProperty('--p', p.toFixed(4));
    var cur = 0;
    secs.forEach(function (s, i) { if (s.getBoundingClientRect().top < vh * 0.35) cur = i; });
    chNum.textContent = secs[cur].getAttribute('data-n');
    chTxt.textContent = secs[cur].getAttribute('data-ch');
    links.forEach(function (l, i) { l.classList.toggle('cur', i === cur); });
    leftEl.textContent = Math.max(1, Math.ceil(words * (1 - p) / 230));
  };
  var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();

  // Mitos: cada tarjeta se gira al tocarla.
  var myths = root.querySelectorAll('.sbx-myth');
  myths.forEach(function (m) {
    var b = m.querySelector('.go');
    b.setAttribute('aria-expanded', 'false');
    b.addEventListener('click', function () { m.classList.add('on'); b.setAttribute('aria-expanded', 'true'); });
    m.querySelector('.a').addEventListener('click', function () { m.classList.remove('on'); b.setAttribute('aria-expanded', 'false'); });
  });
  var score = root.querySelector('.sbx-score');
  var check = function () { if (score && root.querySelectorAll('.sbx-myth.on').length === myths.length) score.classList.add('on'); };
  myths.forEach(function (m) { m.querySelector('.go').addEventListener('click', function () { setTimeout(check, 50); }); });
  var all = root.querySelector('.sbx-revall');
  if (all) all.addEventListener('click', function () {
    myths.forEach(function (m, i) { setTimeout(function () { m.classList.add('on'); m.querySelector('.go').setAttribute('aria-expanded', 'true'); check(); }, reduce ? 0 : i * 140); });
  });

  // Calculadora: precio por libro según los libros que escuchas al mes (precios de España).
  var calc = root.querySelector('.sbx-calc');
  if (calc) {
    var range = calc.querySelector('input[type=range]'), out = calc.querySelector('output');
    var o = function (k) { return calc.querySelector('[data-o="' + k + '"]'); };
    var b = function (k) { return calc.querySelector('[data-b="' + k + '"]'); };
    var eur = function (v) { return fmt(v, 2) + ' €<small>/libro</small>'; };
    var run = function () {
      var n = parseInt(range.value, 10);
      out.textContent = n + (n === 1 ? ' libro' : ' libros');
      range.style.setProperty('--fill', ((n - 1) / 7 * 100) + '%');
      if (n <= 3) { o('ev').innerHTML = eur(14.99 / n); b('ev').style.setProperty('--w', (14.99 / n / 14.99 * 100) + '%'); b('ev').style.background = ''; }
      else { o('ev').innerHTML = 'No llega<small>solo 3</small>'; b('ev').style.setProperty('--w', '100%'); b('ev').style.background = 'var(--r)'; }
      o('au').innerHTML = eur(9.99 / n); b('au').style.setProperty('--w', (9.99 / n / 14.99 * 100) + '%');
      o('st').innerHTML = eur(8.99 / n); b('st').style.setProperty('--w', (8.99 / n / 14.99 * 100) + '%');
    };
    range.addEventListener('input', run);
    run();
  }

  // Test: tres preguntas y un resultado con la recomendación.
  var quiz = root.querySelector('.sbx-quiz');
  if (quiz) {
    var ans = {}, outBox = quiz.querySelector('.sbx-out'), body = outBox.querySelector('.body'), meter = outBox.querySelectorAll('.meter i');
    var sb = 'https://sonorbooks.com/es/audiolibros/';
    var res = {
      si: { em: '👍', h: 'El Plus de Everand puede compensarte.', p: 'Para 1 a 3 libros al mes, con novedades en español y ebooks en la misma app, encaja. Date de alta desde la web (30 días de prueba) y apunta la fecha de renovación.', cta: '<a class="sbx-btn y" href="https://www.everand.com/" target="_blank" rel="noopener">Abrir Everand</a><a class="sbx-btn ghost" href="' + sb + '">Comparar en SonorBooks</a>' },
      ilim: { em: '🎧', h: 'Te sale mejor una tarifa ilimitada.', p: 'Con más de 3 libros al mes, el Plus de Everand se queda corto. Audible (9,99 €) y Storytel (8,99 €) ofrecen escucha ilimitada de su catálogo. Mira antes en SonorBooks dónde está cada libro.', cta: '<a class="sbx-btn y" href="' + sb + '">Comparar en SonorBooks</a>' },
      gratis: { em: '📚', h: 'Prueba antes algo gratis.', p: 'Si te bastan los clásicos, El Libro Total es gratis y legal. Para lo demás, busca cada libro en SonorBooks y mira dónde te sale más barato.', cta: '<a class="sbx-btn y" href="https://sonorbooks.com/blog/el-libro-total">Leer la reseña de El Libro Total</a><a class="sbx-btn ghost" href="' + sb + '">Buscar en SonorBooks</a>' }
    };
    var draw = function () {
      var n = Object.keys(ans).length;
      meter.forEach(function (m, i) { m.classList.toggle('on', i < n); });
      if (n < 3) {
        body.innerHTML = '<div class="em">🎧</div><h3>' + (n === 2 ? 'Te queda 1 pregunta' : n === 1 ? 'Te quedan 2 preguntas' : 'Responde a las 3 preguntas') + '</h3><p>Y te diremos si Everand encaja contigo o dónde te conviene más escuchar.</p>';
        return;
      }
      var r = ans.mas ? res.ilim : (ans.nov || ans.ebook ? res.si : res.gratis);
      body.innerHTML = '<div class="em">' + r.em + '</div><h3>' + r.h + '</h3><p>' + r.p + '</p><div class="cta">' + r.cta + '</div>';
      outBox.classList.remove('pop'); void outBox.offsetWidth; if (!reduce) outBox.classList.add('pop');
    };
    quiz.querySelectorAll('.sbx-qq').forEach(function (q) {
      q.querySelectorAll('.opts button').forEach(function (btn) {
        btn.addEventListener('click', function () {
          ans[q.getAttribute('data-q')] = btn.getAttribute('data-v') === '1';
          q.querySelectorAll('.opts button').forEach(function (x) { x.setAttribute('aria-pressed', x === btn ? 'true' : 'false'); });
          q.classList.add('done');
          draw();
        });
      });
    });
    draw();
  }

  // Marcos fijos sobre capturas: aparecen uno tras otro al llegar a la sección.
  root.querySelectorAll('.sbx-media[data-static-marks]').forEach(function (box) {
    JSON.parse(box.getAttribute('data-static-marks')).forEach(function (m, i) {
      var el = document.createElement('div'), lab = document.createElement('em');
      el.className = 'sbx-mk nodim' + (m.below || m.y < 12 ? ' below' : ''); el.style.setProperty('--i', i);
      el.style.left = m.x + '%'; el.style.top = m.y + '%'; el.style.width = m.w + '%'; el.style.height = m.h + '%';
      lab.textContent = m.label; el.appendChild(lab); box.appendChild(el);
    });
  });
  // Vídeo de YouTube: se carga solo al pulsar (más rápido y sin cookies hasta entonces).
  root.querySelectorAll('.sbx-yt').forEach(function (yt) {
    var go = function () {
      var id = yt.getAttribute('data-youtube-id');
      if (!id || id === 'PENDIENTE') { yt.classList.add('is-soon'); setTimeout(function () { yt.classList.remove('is-soon'); }, 2400); return; }
      yt.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0" title="Everand: reseña en vídeo" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
    };
    yt.addEventListener('click', go);
    yt.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });
})();
