// Grabador de pantalla de alta calidad para las reseñas de SonorBooks.
//
// Graba una sesión guionizada de Chromium vía CDP screencast (JPEG q95, 2x DPR => 3840x2160),
// la convierte a vídeo CFR 50 fps y registra la posición del ratón para que Remotion dibuje
// un cursor de marca sincronizado (Chromium headless no pinta el cursor del sistema).
//
// Uso: node tools/record.mjs <script.json> <outdir>
// script.json: { "viewport": [1920,1080], "mobile": false, "steps": [ ... ] }
// Pasos:
//   {"go": url}                         navega (sin grabar la carga si "hidden": true)
//   {"wait": ms}
//   {"move": [x,y], "dur": ms}          mueve el ratón con curva suave
//   {"moveText": "texto", "dur": ms}    mueve el ratón al centro de un elemento con ese texto
//   {"moveSel": "css", "dur": ms}
//   {"click": true}                     clic en la posición actual
//   {"fakeClick": true}                 anima el clic en el cursor sin pulsar (no envía formularios ni navega)
//   {"clickText": "texto", "dur": ms}   mover + clic
//   {"clickSel": "css", "dur": ms}
//   {"type": "texto", "delay": ms}      teclea en el elemento enfocado
//   {"press": "Enter"}
//   {"scroll": px, "dur": ms}           scroll suave (easeInOutCubic) de la ventana o de "sel"
//   {"record": true|false}              empieza/pausa la captura
//   {"mark": "nombre"}                  marca de tiempo con nombre (para sincronizar en Remotion)
//   {"eval": "js"}
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const [, , scriptPath, out] = process.argv;
const script = JSON.parse(fs.readFileSync(scriptPath, 'utf8'));
const framesDir = path.join(out, 'frames');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(framesDir, { recursive: true });

const [vw, vh] = script.viewport || [1920, 1080];
// Cámara lenta: el navegador corre N veces más despacio y luego se acelera el vídeo => ~N×fps efectivos.
const SLOW = script.slowmo || 3;
const dpr = script.dpr || 2;
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--autoplay-policy=no-user-gesture-required', '--hide-scrollbars', '--font-render-hinting=none'],
});
const ctxOpts = script.mobile
  ? { ...devices['iPhone 14 Pro Max'], locale: script.locale || 'es-ES', ...(script.timezone ? { timezoneId: script.timezone } : {}), ...(script.dpr ? { deviceScaleFactor: script.dpr } : {}) }
  : { viewport: { width: vw, height: vh }, deviceScaleFactor: dpr, locale: script.locale || 'es-ES', ...(script.timezone ? { timezoneId: script.timezone } : {}) };
if (script.locale) ctxOpts.extraHTTPHeaders = { 'Accept-Language': `${script.locale},${script.locale.split('-')[0]};q=0.9` };
const ctx = await browser.newContext(ctxOpts);
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send('Animation.enable');
await cdp.send('Animation.setPlaybackRate', { playbackRate: 1 / SLOW });

let recording = false;
let t0 = null; // ms (monotónico del screencast) del primer frame
let frames = [];
let pausedTotal = 0;
let pauseStart = null;
const now = () => performance.now();
let wallStart = null;
const cursor = [];
const marks = {};
const events = [];
let mouse = { x: vw / 2, y: vh / 2, down: false };

const tRel = () => (wallStart === null ? 0 : (now() - wallStart - pausedTotal - (pauseStart ? now() - pauseStart : 0)) / 1000 / SLOW);
const logCursor = () => { if (recording) cursor.push({ t: +tRel().toFixed(3), x: +mouse.x.toFixed(1), y: +mouse.y.toFixed(1), down: mouse.down }); };

cdp.on('Page.screencastFrame', async (f) => {
  cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
  if (!recording) return;
  const t = tRel();
  const file = path.join(framesDir, `f_${String(frames.length).padStart(6, '0')}.jpg`);
  fs.writeFileSync(file, Buffer.from(f.data, 'base64'));
  frames.push({ file, t });
});

async function startRecording() {
  if (recording) return;
  if (wallStart === null) wallStart = now();
  if (pauseStart) { pausedTotal += now() - pauseStart; pauseStart = null; }
  recording = true;
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 95, maxWidth: vw * dpr, maxHeight: vh * dpr, everyNthFrame: 1 });
  // Fuerza un primer frame aunque la página esté estática.
  await page.evaluate(() => { document.body.style.outline = '0px solid transparent'; });
  logCursor();
}
async function stopRecording() {
  if (!recording) return;
  logCursor();
  recording = false;
  pauseStart = now();
  await cdp.send('Page.stopScreencast').catch(() => {});
}

// Mantiene vivo el screencast en páginas estáticas: un cambio imperceptible por frame.
await page.addInitScript(() => {
  const tick = () => {
    const el = document.documentElement;
    if (el) el.style.setProperty('--rec-tick', String(Math.random()));
    if (document.body) document.body.style.boxShadow = `0 0 0 ${Math.random() < 0.5 ? 0 : 0.0001}px transparent`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});


// Eventos de la página (p. ej. qué MP3 empieza a sonar) con su tiempo en la grabación.
await page.exposeBinding('__rec', (_src, evt) => { events.push({ t: +tRel().toFixed(3), ...evt }); });
await page.addInitScript(() => {
  document.addEventListener('play', (e) => {
    const a = e.target;
    if (a && a.tagName === 'AUDIO') window.__rec({ type: 'audio_play', src: a.currentSrc || a.src, at: a.currentTime });
  }, true);
  document.addEventListener('pause', (e) => {
    const a = e.target;
    if (a && a.tagName === 'AUDIO') window.__rec({ type: 'audio_pause', src: a.currentSrc || a.src, at: a.currentTime });
  }, true);
});

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
async function moveTo(x, y, dur = 700) {
  // Basado en tiempo real (no en nº de pasos) para que la duración sea exacta aunque la CPU vaya cargada.
  dur *= SLOW;
  const sx = mouse.x, sy = mouse.y;
  const dx = x - sx, dy = y - sy;
  const dist = Math.hypot(dx, dy) || 1;
  const bend = Math.min(80, dist * 0.12);
  const nx = -dy / dist, ny = dx / dist;
  const t0 = now();
  for (;;) {
    const p = Math.min(1, (now() - t0) / dur);
    const e = ease(p);
    const arc = Math.sin(Math.PI * e) * bend;
    mouse.x = sx + dx * e + nx * arc;
    mouse.y = sy + dy * e + ny * arc;
    await page.mouse.move(mouse.x, mouse.y);
    logCursor();
    if (p >= 1) break;
    await page.waitForTimeout(8);
  }
  mouse.x = x; mouse.y = y; logCursor();
}
async function centerOf(locator) {
  await locator.scrollIntoViewIfNeeded({ timeout: 10000 }).catch(() => {});
  const b = await locator.boundingBox({ timeout: 10000 });
  if (!b) throw new Error('sin bounding box');
  return [b.x + b.width / 2, b.y + b.height / 2];
}
async function click() {
  mouse.down = true; logCursor();
  await page.mouse.down();
  await page.waitForTimeout(90 * SLOW);
  await page.mouse.up();
  mouse.down = false; logCursor();
}
async function smoothScroll(px, dur = 1500, sel) {
  dur *= SLOW;
  await page.evaluate(([px, dur, sel]) => new Promise((res) => {
    const el = sel ? document.querySelector(sel) : null;
    const getY = () => (el ? el.scrollTop : window.scrollY);
    const setY = (y) => (el ? (el.scrollTop = y) : window.scrollTo(0, y));
    const start = getY(), t0 = performance.now();
    const e = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      setY(start + px * e(p));
      if (p < 1) requestAnimationFrame(step); else res();
    };
    requestAnimationFrame(step);
  }), [px, dur, sel]);
}

for (const s of script.steps) {
  try {
    if ('record' in s) await (s.record ? startRecording() : stopRecording());
    if (s.go) { await page.goto(s.go, { waitUntil: s.until || 'networkidle', timeout: 60000 }); await cdp.send('Animation.setPlaybackRate', { playbackRate: 1 / SLOW }); }
    if (s.move) await moveTo(s.move[0], s.move[1], s.dur);
    if (s.moveText) { const [x, y] = await centerOf(page.getByText(s.moveText, { exact: s.exact !== false }).first()); await moveTo(x, y, s.dur); }
    if (s.moveSel) { const [x, y] = await centerOf(page.locator(s.moveSel).first()); await moveTo(x, y, s.dur); }
    if (s.clickText) { const [x, y] = await centerOf(page.getByText(s.clickText, { exact: s.exact !== false }).first()); await moveTo(x, y, s.dur); await click(); }
    if (s.clickSel) { const [x, y] = await centerOf(page.locator(s.clickSel).first()); await moveTo(x, y, s.dur); await click(); }
    if (s.click) await click();
    if (s.fakeClick) { mouse.down = true; logCursor(); await page.waitForTimeout(90 * SLOW); mouse.down = false; logCursor(); }
    if (s.type) { for (const ch of s.type) { await page.keyboard.type(ch); logCursor(); await page.waitForTimeout((s.delay ?? 85) * SLOW); } }
    if (s.press) await page.keyboard.press(s.press);
    if (s.scroll) await smoothScroll(s.scroll, s.dur, s.sel ?? script.scrollSel);
    if (s.eval) await page.evaluate(s.eval);
    if (s.mark) marks[s.mark] = +tRel().toFixed(3);
    if (s.wait) {
      const end = now() + s.wait * SLOW;
      while (now() < end) { logCursor(); await page.waitForTimeout(Math.min(100, end - now())); }
    }
    if (s.shot) await page.screenshot({ path: path.join(out, `${s.shot}.png`) });
  } catch (e) {
    console.log('paso fallido', JSON.stringify(s), e.message.split('\n')[0]);
  }
}
await stopRecording();
await browser.close();

// Ensambla CFR 50 fps con las duraciones reales de cada frame.
if (frames.length) {
  const total = tRel();
  const lines = [];
  for (let i = 0; i < frames.length; i++) {
    const next = i + 1 < frames.length ? frames[i + 1].t : total;
    const d = Math.max(0.001, next - frames[i].t);
    lines.push(`file '${path.resolve(frames[i].file)}'`, `duration ${d.toFixed(4)}`);
  }
  lines.push(`file '${path.resolve(frames[frames.length - 1].file)}'`);
  fs.writeFileSync(path.join(out, 'concat.txt'), lines.join('\n'));
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(out, 'concat.txt'),
    '-vf', `fps=50,scale=${vw * dpr}:${vh * dpr}:flags=lanczos,format=yuv420p`,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', String(script.crf || 14), '-movflags', '+faststart', path.join(out, 'video.mp4')]);
  const firstT = frames[0].t;
  fs.writeFileSync(path.join(out, 'meta.json'), JSON.stringify({
    viewport: [vw, vh], dpr, frames: frames.length, duration: +(total - firstT).toFixed(3), offset: +firstT.toFixed(3), marks: Object.fromEntries(Object.entries(marks).map(([k, v]) => [k, +(v - firstT).toFixed(3)])),
    events: events.map(e => ({ ...e, t: +(e.t - firstT).toFixed(3) })),
  }, null, 1));
  fs.writeFileSync(path.join(out, 'cursor.json'), JSON.stringify(cursor.map(c => ({ ...c, t: +(c.t - firstT).toFixed(3) }))));
  fs.rmSync(framesDir, { recursive: true, force: true });
  console.log(`OK ${frames.length} frames, ${(total - firstT).toFixed(2)} s -> ${path.join(out, 'video.mp4')}`);
} else {
  console.log('sin frames');
}
