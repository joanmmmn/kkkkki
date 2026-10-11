// Estados 4K de las réplicas de ElevenReader para la reseña (node tools/render_states.mjs tools/er_states.mjs [filtro]).
// Las réplicas (captures/elevenreader/app/*.html) y los PNG (video/public/er/app/st/) son locales: no se suben al repo.
import fs from 'node:fs';

const A = 'captures/elevenreader/app/';
const OUT = 'video/public/er/app/st/';
const frag = JSON.parse(fs.readFileSync(A + 'fragments.json', 'utf8'));
const clips = JSON.parse(fs.readFileSync('video/public/er/audio/clips.json', 'utf8'));
const J = (v) => JSON.stringify(v);

const TOTAL = 1293; // s (21:33)
const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

// Barra del reproductor: tiempos, progreso, icono y voz.
const player = ({ t = 0, playing = false, sara = false, speed = null }) => `
  __h.setTimes(${J(mmss(t))}, ${J('-' + mmss(TOTAL - t))});
  { const p = ${t / TOTAL};
    const range = document.querySelector('[role=slider]').closest('span[dir]');
    if (range) {
      const fill = range.querySelector('span.bg-inverse.absolute'); if (fill) { fill.style.left = '0%'; fill.style.right = (100 - p * 100) + '%'; }
      const buf = range.querySelector('div.absolute'); if (buf) buf.style.width = Math.min(100, p * 100 + 4.5) + '%';
      const th = document.querySelector('[role=slider]').parentElement; th.style.left = 'calc(' + (p * 100) + '% + ' + (6 * (1 - 2 * p)) + 'px)';
    }
  }
  { const b = __h.playBtn(); if (b) b.innerHTML = ${J(playing ? frag.pauseIcon : frag.playIcon)}; }
  ${sara ? `{ const rb = [...document.querySelectorAll('button')].find((b) => /Read by/.test(b.textContent)); if (rb) rb.outerHTML = ${J(frag.readBySara)}; }` : ''}
  ${speed ? `{ const sb = [...document.querySelectorAll('button')].find((b) => /^\\d(\\.\\d+)?x$/.test(b.textContent.trim())); if (sb) sb.textContent = ${J(speed + 'x')}; }` : ''}
`;

// Tiempo en la app (s) de cada palabra del párrafo «Yo no sé…», según las grabaciones.
const appT = {};
for (const [name, c] of Object.entries(clips)) {
  const off = name.startsWith('sara') ? 6.9 : 24.6; // inicio de «Leyendas» en cada grabación
  appT[name] = Object.fromEntries(c.words.map(([t, i]) => [i, c.start + t - off]));
}
const tWord = (sara, i) => (sara ? (appT.sara_cold[i] ?? appT.sara_ab[i]) : (appT.brian_silent[i] ?? appT.brian_ab[i]));

const P1 = 'Yo no sé si esto';
const states = [];
const add = (out, src, js = '', extra = {}) => states.push({ out: OUT + out + '.png', src: A + src + '.html', js, ...extra });

// ── Lector del PDF (16) ──────────────────────────────────────────────────────────────
add('rd_b_p', '16_pdf_reader', player({ t: 0 }) + '__h.clearHL();');
add('rd_s_p', '16_pdf_reader', player({ t: 0, sara: true }) + '__h.clearHL();');
for (let i = 0; i <= 28; i++) {
  add(`rd_b_${i}`, '16_pdf_reader', player({ t: tWord(false, i), playing: true }) + `__h.hl(${J(P1)}, ${i});`);
  add(`rd_s_${i}`, '16_pdf_reader', player({ t: tWord(true, i), playing: true, sara: true }) + `__h.hl(${J(P1)}, ${i});`);
}
// Personalización: tema oscuro, papel, resaltado amarillo y letra grande (palabra 20, voz Sara).
const custom = player({ t: tWord(true, 20), playing: true, sara: true }) + `__h.hl(${J(P1)}, 20);`;
add('rd_dark', '16_pdf_reader', custom + "document.documentElement.classList.add('dark'); document.body.classList.add('dark');");
add('rd_paper', '16_pdf_reader', custom + "document.documentElement.classList.add('reader-paper');");
add('rd_yellow', '16_pdf_reader', custom + "document.documentElement.classList.add('highlight');");
// Letra a 20 px: el resaltado se recalcula después (las líneas cambian).
const big = player({ t: tWord(true, 20), playing: true, sara: true }) + `document.querySelector('.font-inter[style]').style.fontSize = '20px'; __h.hl(${J(P1)}, 20);`;
add('rd_big', '16_pdf_reader', big);
add('rd_big_yellow', '16_pdf_reader', big + "document.documentElement.classList.add('highlight');");
// Velocidad: el desplegable de la captura 24 sobre el lector (1x y 4x).
for (const [v, pos] of [[1, 20.46], [2, 55], [4, 100]]) {
  add(`rd_speed${v}`, '16_pdf_reader', player({ t: tWord(true, 22), playing: true, sara: true, speed: v }) + `__h.hl(${J(P1)}, 22);
    document.body.insertAdjacentHTML('beforeend', ${J(frag.speedPop)});
    { const leaf = __h.leaf('Reading speed').pop(); let pop = leaf; while (pop.parentElement && pop.parentElement !== document.body) pop = pop.parentElement;
      const inp = pop.querySelector('input'); if (inp) { inp.value = ${J(String(v))}; inp.setAttribute('value', ${J(String(v))}); }
      const th = pop.querySelector('[role=slider]'); if (th) { const w = th.parentElement; w.style.left = 'calc(${pos}% + ' + (8 * (1 - 2 * ${pos / 100})) + 'px)'; }
      const fill = pop.querySelector('span.absolute.h-full'); if (fill) { fill.style.left = '0%'; fill.style.right = '${100 - pos}%'; }
    }`);
}
// Menú de opciones de lectura (18) sin el panel de voces.
add('rd_menu', '18_pdf_read_options', `{ const p = __h.panel('Voices'); if (p) p.remove(); }` + player({ t: tWord(true, 22), playing: false, sara: true }));

// ── Panel de voces (17) ─────────────────────────────────────────────────────────────
const unselect = `{ const leaf = __h.leaf('Sara Martin').find((e) => e.getBoundingClientRect().x > 1300); const li = leaf.closest('li');
  li.querySelectorAll('.bg-surface').forEach((e) => e.classList.remove('bg-surface'));
  li.querySelectorAll('div.absolute.-right-1').forEach((e) => e.remove());
  const chk = li.querySelector('span[aria-hidden=true].h-10 svg'); if (chk) chk.remove(); }`;
add('vp_none', '17_pdf_voices_sara', unselect);
add('vp_sara', '17_pdf_voices_sara', '');
add('vp_none_nothumb', '17_pdf_voices_sara', unselect + `{ const th = [...document.querySelectorAll('[role=slider]')].find((s) => s.getBoundingClientRect().x > 1300); if (th) th.style.opacity = '0'; }`);
add('vp_iconic', '17_pdf_voices_sara', unselect + `{ const sc = [...document.querySelectorAll('.overflow-y-auto')].find((e) => e.getBoundingClientRect().x > 1300);
  const ic = __h.leaf('Iconic voices')[0]; if (sc && ic) sc.scrollTop = ic.getBoundingClientRect().y - sc.getBoundingClientRect().y - 18; }`);

// ── Preferencias (09, Niebla) sin el menú encima: solo se usa el panel ───────────────
const noMenu = `{ const m = [...document.querySelectorAll('[role=menuitem]')].find((e) => /Book details/.test(e.textContent)); if (m) { let e = m.closest('[role=menu]') || m; while (e.parentElement && e.parentElement !== document.body) e = e.parentElement; e.remove(); } }`;
// Marca como elegida la opción `on` de un grupo de radios del panel (tema, alineación o color).
const pick = (on, off) => `{ const f = (t) => [...document.querySelectorAll('[role=radio]')].find((b) => b.textContent.trim().endsWith(t) && b.getBoundingClientRect().x > 1300);
  const a = f(${J(off)}), b = f(${J(on)}); if (a) { a.setAttribute('data-state', 'unchecked'); a.setAttribute('aria-checked', 'false'); } if (b) { b.setAttribute('data-state', 'checked'); b.setAttribute('aria-checked', 'true'); } }`;
const fontSize = (px) => `{ const l = [...document.querySelectorAll('*')].find((e) => e.children.length === 0 && /^Font size:/.test(e.textContent.trim())); if (l) l.textContent = 'Font size: ${px}px';
  const th = [...document.querySelectorAll('[role=slider]')].find((s) => s.getBoundingClientRect().x > 1300); if (th) { const w = th.parentElement; const m = /calc\\(([\\d.]+)%/.exec(w.style.left); const p0 = m ? +m[1] : 33; w.style.left = 'calc(' + (p0 + ${(px - 16) * 6}) + '% + 0px)'; } }`;
add('pref_clean', '09_customize', noMenu);
add('pref_dark', '09_customize', noMenu + pick('Dark', 'Auto') + "document.documentElement.classList.add('dark'); document.body.classList.add('dark');");
add('pref_paper', '09_customize', noMenu + pick('Paper', 'Auto') + "document.documentElement.classList.add('reader-paper');");
add('pref_big', '09_customize', noMenu + pick('Light', 'Auto') + fontSize(20));
add('pref_yellow', '09_customize', noMenu + pick('Light', 'Auto') + fontSize(20) + `{ const f = (t) => [...document.querySelectorAll('[role=radio]')].find((b) => b.textContent.includes(t) && b.textContent.trim().endsWith(t) && b.getBoundingClientRect().x > 1300);
  const a = f('Sky'), b = f('Highlight'); if (a) { a.setAttribute('data-state', 'unchecked'); a.setAttribute('aria-checked', 'false'); } if (b) { b.setAttribute('data-state', 'checked'); b.setAttribute('aria-checked', 'true'); } }`);

// ── Subir un PDF (12-15) ────────────────────────────────────────────────────────────
const noDialog = "__h.remove('[role=dialog]'); __h.remove('.bg-overlay-dark');";
add('lib_niebla', '12_import_dialog', noDialog);
add('imp_dialog', '12_import_dialog', '');
add('imp_selected', '13_import_pdf_selected', "document.querySelectorAll('[role=dialog] [style]').forEach((e) => { e.style.transform = 'none'; e.style.opacity = '1'; });");
['Uploading PDF', 'Reading PDF', 'Extracting words', 'Preparing audio'].forEach((s, k) =>
  add(`lib_proc${k + 1}`, '14_pdf_processing', noDialog + `{ const e = __h.leaf('Uploading PDF')[0]; if (e) e.textContent = ${J(s)}; }`));
add('lib_done', '15_library', '');

// ── Cuenta (10): con la importación automática de PDF activada ───────────────────────
add('acc', '10_account', '');

export default states;
