// Imagen para redes (1200×630) y póster del vídeo (1280×720) de la reseña web de Podimo.
// Uso: node tools/web_pd_og.mjs   (después de python3 tools/web_pd_media.py, que saca la captura del móvil)
// Una sola composición de 1280×720 con el estilo de las miniaturas de SonorBooks (fondo cálido, pregunta grande con el
// subrayado amarillo, «Lo bueno / Lo malo», el móvil con la app y el sello de 30 días): el póster es la composición tal
// cual y la imagen para redes, la misma reducida a 1200×675 y recortada a 630 de alto (como la de Nextory).
// El póster es la miniatura real del vídeo (deliverables/podimo/resena/miniatura_resena.png) cuando existe; si no, esta composición.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MEDIA = path.join(ROOT, 'web/podimo-resena/media');
const FONTS = path.join(ROOT, 'video/public/fonts');
const LOGO = path.join(ROOT, 'video/public/pdr/img/podimo.svg');
const SCREEN = path.join(MEDIA, 'podimo-podcasts-populares.webp');
const url = (p) => 'file://' + p;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:U;font-weight:400;src:url(${url(FONTS + '/Ubuntu-400-latin.woff2')}) format('woff2')}
@font-face{font-family:U;font-weight:400;src:url(${url(FONTS + '/Ubuntu-400-latin-ext.woff2')}) format('woff2');unicode-range:U+0100-024F}
@font-face{font-family:U;font-weight:700;src:url(${url(FONTS + '/Ubuntu-700-latin.woff2')}) format('woff2')}
@font-face{font-family:U;font-weight:700;src:url(${url(FONTS + '/Ubuntu-700-latin-ext.woff2')}) format('woff2');unicode-range:U+0100-024F}
html,body{margin:0}
body{width:1280px;height:720px;position:relative;overflow:hidden;font-family:U,Arial,sans-serif;color:#101010;
 background:radial-gradient(ellipse at 50% 42%,#FFFDF5 0%,#FFFFFF 50%,#F5F4F0 100%)}
.glow{position:absolute;border-radius:50%}
.g1{width:1300px;height:1300px;left:-380px;top:-640px;background:radial-gradient(circle,rgba(255,202,5,.11) 0%,rgba(255,202,5,0) 62%)}
.g2{width:1100px;height:1100px;right:-420px;bottom:-640px;background:radial-gradient(circle,rgba(168,155,237,.20) 0%,rgba(168,155,237,0) 62%)}
.dots{position:absolute;inset:0;background-image:radial-gradient(rgba(16,16,16,.055) 1.6px,transparent 1.8px);background-size:36px 36px}
.copy{position:absolute;left:72px;top:70px}
.brand{display:flex;align-items:center;gap:18px}
.brand img{width:214px;height:auto;display:block}
.brand span{font-weight:700;font-size:26px;color:#8A8A8A;margin-top:8px}
.q{font-weight:700;font-size:112px;letter-spacing:-4.5px;line-height:.96;margin-top:34px}
.hl{position:relative;display:inline-block;margin-top:4px}
.hl::before{content:"";position:absolute;left:-10px;right:-10px;bottom:10px;height:50px;background:#FFCA05;border-radius:12px;transform:skewX(-8deg)}
.hl span{position:relative}
.chips{display:flex;gap:16px;margin-top:40px}
.chip{display:flex;align-items:center;gap:10px;padding:11px 22px 11px 14px;border-radius:999px;background:#fff;box-shadow:0 10px 30px rgba(16,16,16,.08);font-weight:700;font-size:29px}
.chip i{width:34px;height:34px;border-radius:50%;display:grid;place-items:center}
.chip svg{width:20px;height:20px}
.ok{background:#1F9D55;color:#fff}.ko{background:#E5484D;color:#fff}
.phone{position:absolute;left:806px;top:52px;width:318px;padding:9px;border-radius:46px;background:#121212;
 box-shadow:inset 0 0 0 2px #2e2e31,0 40px 90px rgba(40,24,110,.28),0 10px 24px rgba(0,0,0,.16);transform:rotate(5deg)}
.phone img{display:block;width:100%;border-radius:37px}
.phone::before{content:"";position:absolute;top:18px;left:50%;width:11px;height:11px;margin-left:-5.5px;border-radius:50%;background:#050505;z-index:2}
.disc{position:absolute;left:1068px;top:96px;width:156px;height:156px;border-radius:50%;background:#A89BED;color:#101010;display:flex;flex-direction:column;
 align-items:center;justify-content:center;transform:rotate(7deg);box-shadow:0 24px 60px rgba(40,24,110,.25)}
.disc b{font-size:56px;letter-spacing:-2px;line-height:1}
.disc span{font-size:20px;font-weight:700;margin-top:2px}
.badge{position:absolute;left:676px;top:488px;display:flex;align-items:center;gap:14px;padding:15px 28px 15px 22px;border-radius:24px;background:#101010;color:#fff;
 font-weight:700;font-size:42px;transform:rotate(-7deg);box-shadow:0 24px 60px rgba(16,16,16,.24)}
.badge em{font-style:normal;color:#FFCA05}
</style></head><body>
<div class="glow g1"></div><div class="glow g2"></div><div class="dots"></div>
<div class="copy">
 <div class="brand"><img src="${url(LOGO)}" alt=""><span>RESEÑA</span></div>
 <div class="q">¿MERECE</div>
 <div class="q hl"><span>LA PENA?</span></div>
 <div class="chips">
  <div class="chip"><i class="ok"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></i>Lo bueno</div>
  <div class="chip"><i class="ko"><svg viewBox="0 0 24 24"><path d="M7 7l10 10M17 7L7 17" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg></i>Lo malo</div>
 </div>
</div>
<div class="phone"><img src="${url(SCREEN)}" alt=""></div>
<div class="disc"><b>20 h</b><span>al mes</span></div>
<div class="badge"><svg width="46" height="38" viewBox="0 0 150 123"><path d="M10 8 C 34 3, 58 5, 75 16 C 92 5, 116 3, 140 8 L 140 104 C 116 100, 92 103, 75 116 C 58 103, 34 100, 10 104 Z" fill="#FFCA05" stroke="#FFCA05" stroke-width="12" stroke-linejoin="round"/><path d="M58 38 L 98 61 L 58 84 Z" fill="#101010" stroke="#101010" stroke-width="4" stroke-linejoin="round"/></svg>30 días <em>GRATIS</em></div>
</body></html>`;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pd-og-'));
const src = path.join(tmp, 'og.html');
fs.writeFileSync(src, html);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
await page.goto('file://' + src, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
const png = path.join(tmp, 'poster.png');
await page.screenshot({ path: png });
await browser.close();
// Póster del vídeo (webp 1280×720) e imagen para redes (1200×675 recortada a 1200×630, jpg)
// El póster sale de la miniatura real del vídeo (Remotion, composición PDRThumb) si ya está renderizada; si no, de esta composición.
const THUMB = path.join(ROOT, 'deliverables/podimo/resena/miniatura_resena.png');
const posterSrc = fs.existsSync(THUMB) ? THUMB : png;
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', posterSrc, '-vf', 'scale=1280:720:flags=lanczos', '-c:v', 'libwebp', '-quality', '82', path.join(MEDIA, 'podimo-resena-video.webp')]);
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', png, '-vf', 'scale=1200:675:flags=lanczos,crop=1200:630:0:22', '-q:v', '3', path.join(MEDIA, 'podimo-resena-og.jpg')]);
fs.rmSync(tmp, { recursive: true, force: true });
console.log('listo →', path.relative(ROOT, MEDIA), '(podimo-resena-video.webp, podimo-resena-og.jpg)');
