// Imagen para redes (1200×630) y póster del vídeo (1280×720) de la página «Las mejores plataformas de audiolibros en español».
// Uso: node tools/web_mp_og.mjs   (después de python3 tools/web_mp_media.py, que deja los logotipos en media/)
// Una composición de 1280×720 con el estilo de las miniaturas de SonorBooks (fondo cálido con puntos, título grande con el subrayado
// amarillo y los once logotipos en fichas blancas). La imagen para redes es la misma reducida a 1200×675 y recortada a 630 de alto.
// El póster es la miniatura real del vídeo (deliverables/mejores-plataformas/miniatura.png) cuando exista; si no, esta composición.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MEDIA = path.join(ROOT, 'web/mejores-plataformas/media');
const FONTS = path.join(ROOT, 'video/public/fonts');
const url = (p) => 'file://' + p;
const L = (f) => url(path.join(MEDIA, f));
const LOGOS = [
  ['logo-audible.svg', 58], ['logo-storytel.svg', 34], ['logo-podimo.svg', 36], ['logo-nextory.svg', 34],
  ['logo-bookbeat.svg', 26], ['logo-spotify.svg', 38], ['logo-audiobooks.webp', 40], ['logo-elevenreader.webp', 20],
  ['logo-ebiblio.webp', 52], ['logo-librivox.webp', 38], ['logo-el-libro-total.webp', 54],
];

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:U;font-weight:400;src:url(${url(FONTS + '/Ubuntu-400-latin.woff2')}) format('woff2')}
@font-face{font-family:U;font-weight:700;src:url(${url(FONTS + '/Ubuntu-700-latin.woff2')}) format('woff2')}
html,body{margin:0}
body{width:1280px;height:720px;position:relative;overflow:hidden;font-family:U,Arial,sans-serif;color:#101010;
 background:radial-gradient(ellipse at 30% 30%,#FFFDF5 0%,#FFFFFF 45%,#F3F1EB 100%)}
.dots{position:absolute;inset:0;background-image:radial-gradient(rgba(16,16,16,.06) 1.6px,transparent 1.8px);background-size:34px 34px}
.copy{position:absolute;left:72px;top:118px;width:610px}
.k{font-weight:700;font-size:24px;color:#6b6860;letter-spacing:.5px}
.t{font-weight:700;font-size:80px;line-height:.98;letter-spacing:-3.4px;margin-top:20px}
.hl{position:relative;display:inline-block}
.hl::before{content:"";position:absolute;left:-8px;right:-8px;bottom:6px;height:34px;background:#FFCA05;border-radius:10px;transform:skewX(-8deg)}
.hl span{position:relative}
.y{display:inline-block;margin-top:30px;padding:12px 22px;border-radius:16px;background:#101010;color:#fff;font-weight:700;font-size:27px;white-space:nowrap}
.y b{color:#FFCA05}
.grid{position:absolute;left:720px;top:122px;width:490px;display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.grid div{height:94px;border-radius:20px;background:#fff;box-shadow:0 14px 34px rgba(16,16,16,.09),inset 0 0 0 1px rgba(16,16,16,.06);display:grid;place-items:center;padding:0 16px}
.grid img{max-width:100%;object-fit:contain}
.grid div:last-child{background:#FFCA05;color:#101010;font-weight:700;font-size:21px;line-height:1.1;text-align:center}
</style></head><body><div class="dots"></div>
<div class="copy"><div class="k">SONORBOOKS · COMPARATIVA 2026</div>
<div class="t">Las mejores plataformas de <span class="hl"><span>audiolibros</span></span> en español</div>
<div class="y"><b>11</b> plataformas · precios, horas y trucos</div></div>
<div class="grid">${LOGOS.map(([f, h]) => `<div><img src="${L(f)}" style="height:${h}px" alt=""></div>`).join('')}<div>¿Cuál te<br>conviene?</div></div>
</body></html>`;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mp-og-'));
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
const THUMB = path.join(ROOT, 'deliverables/mejores-plataformas/miniatura.png');
const posterSrc = fs.existsSync(THUMB) ? THUMB : png;
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', posterSrc, '-vf', 'scale=1280:720:flags=lanczos', '-c:v', 'libwebp', '-quality', '82', path.join(MEDIA, 'mejores-plataformas-video.webp')]);
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', png, '-vf', 'scale=1200:675:flags=lanczos,crop=1200:630:0:22', '-q:v', '3', path.join(MEDIA, 'mejores-plataformas-og.jpg')]);
fs.rmSync(tmp, { recursive: true, force: true });
console.log('listo →', path.relative(ROOT, MEDIA), '(mejores-plataformas-video.webp, mejores-plataformas-og.jpg)', fs.existsSync(THUMB) ? '' : '· póster provisional: aún no hay miniatura del vídeo');
