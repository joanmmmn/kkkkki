import * as THREE from 'three';
import type { BookDef } from './kit';

// ————————————————————————————————————————————————————————————————
// Cubiertas de la colección del vídeo, dibujadas en canvas: tela de encuadernar, filetes y título en dorado con relieve
// y una ilustración propia en una ventana con arco para cada libro.
// Son diseños inventados para este vídeo (episodio de Kierkegaard): no reproducen ninguna portada ni edición real.
// La misma imagen sirve para el HTML (<img>) y como textura en three.js.
// ————————————————————————————————————————————————————————————————

const SANS = 'Ubuntu';
const SERIF = '"EB Garamond"';

const rng = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
const hashStr = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};
const lum = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};
const mix = (a: string, b: string, t: number) => {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ch = (p: number, s: number) => (p >> s) & 255;
  const c = (s: number) => Math.round(ch(pa, s) + (ch(pb, s) - ch(pa, s)) * t);
  return `rgb(${c(16)},${c(8)},${c(0)})`;
};

type Ctx = CanvasRenderingContext2D;
type Pal = { bg: string; fg: string; accent: string; foil: string | CanvasGradient; light: boolean; ink: string };

const gold = (ctx: Ctx, x0: number, x1: number) => {
  const g = ctx.createLinearGradient(x0, 0, x1, 0);
  ['#8C6A2C', '#E9C877', '#FFF0B8', '#C99A45', '#7E5C22', '#D9B260'].forEach((c, i, a) => g.addColorStop(i / (a.length - 1), c));
  return g;
};

const cloth = (ctx: Ctx, w: number, h: number, bg: string, seed: number) => {
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  const r = rng(seed);
  const k = w / 600;
  for (let i = 0; i < (w * h) / 40; i++) {
    const x = r() * w, y = r() * h;
    ctx.fillStyle = r() < 0.5 ? 'rgba(255,255,255,0.035)' : 'rgba(0,0,0,0.055)';
    if (r() < 0.5) ctx.fillRect(x, y, (3 + r() * 6) * k, Math.max(1, k));
    else ctx.fillRect(x, y, Math.max(1, k), (3 + r() * 6) * k);
  }
  const v = ctx.createRadialGradient(w * 0.45, h * 0.4, w * 0.1, w * 0.5, h * 0.5, w * 0.95);
  v.addColorStop(0, 'rgba(255,255,255,0.07)');
  v.addColorStop(1, 'rgba(0,0,0,0.28)');
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, w, h);
};

// Texto con relieve (sombra abajo, luz arriba) y relleno dorado o de tinta.
const embossText = (ctx: Ctx, text: string, x: number, y: number, fill: string | CanvasGradient, k: number) => {
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillText(text, x + 1.4 * k, y + 2 * k);
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  ctx.fillText(text, x - 0.8 * k, y - 0.8 * k);
  ctx.fillStyle = fill;
  ctx.fillText(text, x, y);
};

const wrap = (ctx: Ctx, text: string, maxW: number) => {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const t = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(t).width > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else cur = t;
  }
  if (cur) lines.push(cur);
  return lines;
};

// ———————————————— Elementos de las ilustraciones ————————————————
type Win = { x: number; y: number; w: number; h: number }; // ventana de la ilustración
const sky = (ctx: Ctx, a: Win, top: string, bottom: string) => {
  const g = ctx.createLinearGradient(0, a.y, 0, a.y + a.h);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(a.x, a.y, a.w, a.h);
};
const stars = (ctx: Ctx, a: Win, n: number, seed: number, c = '255,255,255', maxY = 0.6) => {
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = `rgba(${c},${0.35 + r() * 0.6})`;
    ctx.beginPath();
    ctx.arc(a.x + r() * a.w, a.y + r() * a.h * maxY, (0.6 + r() * 1.6) * (a.w / 430), 0, Math.PI * 2);
    ctx.fill();
  }
};
const snow = (ctx: Ctx, a: Win, n: number, seed: number) => {
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = `rgba(255,255,255,${0.4 + r() * 0.55})`;
    ctx.beginPath();
    ctx.arc(a.x + r() * a.w, a.y + r() * a.h, (1 + r() * 2.6) * (a.w / 430), 0, Math.PI * 2);
    ctx.fill();
  }
};
const rain = (ctx: Ctx, a: Win, n: number, seed: number, c = 'rgba(255,255,255,0.35)') => {
  const r = rng(seed);
  ctx.strokeStyle = c;
  ctx.lineWidth = 1.4 * (a.w / 430);
  for (let i = 0; i < n; i++) {
    const x = a.x + r() * a.w, y = a.y + r() * a.h;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - a.w * 0.02, y + a.h * 0.06);
    ctx.stroke();
  }
};
const ridge = (ctx: Ctx, a: Win, base: number, amp: number, seed: number, fill: string, n = 9) => {
  const r = rng(seed);
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y + a.h);
  for (let i = 0; i <= n; i++) {
    const x = a.x + (a.w * i) / n;
    const y = a.y + a.h * base - (i % 2 ? amp * (0.6 + r() * 0.5) : amp * r() * 0.35) * a.h;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(a.x + a.w, a.y + a.h);
  ctx.closePath();
  ctx.fill();
};
const moon = (ctx: Ctx, x: number, y: number, r: number, c: string, bite?: string) => {
  const g = ctx.createRadialGradient(x, y, r * 0.5, x, y, r * 3);
  g.addColorStop(0, 'rgba(255,240,200,0.25)');
  g.addColorStop(1, 'rgba(255,240,200,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r * 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = c;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  if (bite) {
    ctx.fillStyle = bite;
    ctx.beginPath();
    ctx.arc(x + r * 0.45, y - r * 0.25, r * 0.92, 0, Math.PI * 2);
    ctx.fill();
  }
};
const glow = (ctx: Ctx, x: number, y: number, r: number, rgb: string, a = 0.6) => {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(${rgb},${a})`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
};

// ———————————————— Ilustraciones por libro ————————————————
type Ill = (ctx: Ctx, a: Win, p: Pal) => void;
const U = (a: Win) => a.w / 430; // unidad relativa

// Agua con reflejos horizontales (canales de San Petersburgo).
const water = (ctx: Ctx, a: Win, y0: number, top: string, bottom: string, seed: number, glints = 'rgba(255,255,255,0.35)') => {
  const g = ctx.createLinearGradient(0, y0, 0, a.y + a.h);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(a.x, y0, a.w, a.y + a.h - y0);
  const r = rng(seed);
  ctx.fillStyle = glints;
  for (let i = 0; i < 40; i++) {
    const y = y0 + r() * (a.y + a.h - y0);
    const w = (10 + r() * 50) * U(a) * (0.4 + (y - y0) / (a.h * 0.5));
    ctx.fillRect(a.x + r() * a.w, y, w, Math.max(1, 1.6 * U(a)));
  }
};
// Fachada de edificio de San Petersburgo con ventanas (algunas encendidas).
const facade = (ctx: Ctx, x: number, y: number, w: number, h: number, wall: string, win: string, lit: string, seed: number, cols: number, rows: number, litP = 0.2) => {
  ctx.fillStyle = wall;
  ctx.fillRect(x, y, w, h);
  const r = rng(seed);
  const cw = w / cols, rh = h / rows;
  for (let rr = 0; rr < rows; rr++) for (let c = 0; c < cols; c++) {
    const on = r() < litP;
    ctx.fillStyle = on ? lit : win;
    ctx.fillRect(x + c * cw + cw * 0.28, y + rr * rh + rh * 0.22, cw * 0.44, rh * 0.52);
  }
};
// Silueta humana sencilla.
const figure = (ctx: Ctx, x: number, y: number, h: number, c: string, dress = false) => {
  ctx.fillStyle = c;
  ctx.beginPath();
  ctx.arc(x, y - h * 0.88, h * 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  if (dress) {
    ctx.moveTo(x - h * 0.08, y - h * 0.76);
    ctx.lineTo(x + h * 0.08, y - h * 0.76);
    ctx.lineTo(x + h * 0.2, y);
    ctx.lineTo(x - h * 0.2, y);
  } else {
    ctx.moveTo(x - h * 0.12, y - h * 0.76);
    ctx.lineTo(x + h * 0.12, y - h * 0.76);
    ctx.lineTo(x + h * 0.14, y - h * 0.3);
    ctx.lineTo(x + h * 0.08, y);
    ctx.lineTo(x - h * 0.08, y);
    ctx.lineTo(x - h * 0.14, y - h * 0.3);
  }
  ctx.closePath();
  ctx.fill();
};
// Cúpula de bulbo con cruz.
const onion = (ctx: Ctx, cx: number, base: number, w: number, h: number, fill: string, cross: string) => {
  ctx.fillStyle = fill;
  ctx.fillRect(cx - w * 0.36, base - h * 0.42, w * 0.72, h * 0.42);
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.36, base - h * 0.42);
  ctx.bezierCurveTo(cx - w * 0.62, base - h * 0.62, cx - w * 0.3, base - h * 0.86, cx, base - h);
  ctx.bezierCurveTo(cx + w * 0.3, base - h * 0.86, cx + w * 0.62, base - h * 0.62, cx + w * 0.36, base - h * 0.42);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = cross;
  ctx.lineWidth = Math.max(1.5, w * 0.06);
  ctx.beginPath();
  ctx.moveTo(cx, base - h);
  ctx.lineTo(cx, base - h * 1.32);
  ctx.moveTo(cx - w * 0.16, base - h * 1.2);
  ctx.lineTo(cx + w * 0.16, base - h * 1.2);
  ctx.moveTo(cx - w * 0.1, base - h * 1.1);
  ctx.lineTo(cx + w * 0.1, base - h * 1.04);
  ctx.stroke();
};

// Tejado danés a dos aguas con buhardillas (silueta de Copenhague) y aguja de cobre.
const cphRoofs = (ctx: Ctx, a: Win, y: number, c: string, copper: string, seed: number) => {
  const u = U(a);
  const r = rng(seed);
  ctx.fillStyle = c;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y + a.h);
  let x = a.x - 10 * u;
  ctx.lineTo(x, y);
  while (x < a.x + a.w) {
    const bw = (40 + r() * 46) * u, bh = (14 + r() * 26) * u;
    ctx.lineTo(x + bw * 0.5, y - bh);
    ctx.lineTo(x + bw, y);
    x += bw;
  }
  ctx.lineTo(a.x + a.w, a.y + a.h);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = copper;
  const sx = a.x + a.w * 0.7;
  ctx.fillRect(sx - 6 * u, y - 60 * u, 12 * u, 60 * u);
  ctx.beginPath();
  ctx.moveTo(sx - 8 * u, y - 60 * u);
  ctx.lineTo(sx, y - 150 * u);
  ctx.lineTo(sx + 8 * u, y - 60 * u);
  ctx.closePath();
  ctx.fill();
};
// Figura con sombrero de copa y levita.
const gent = (ctx: Ctx, x: number, y: number, h: number, c: string) => {
  ctx.fillStyle = c;
  ctx.fillRect(x - h * 0.07, y - h * 1.06, h * 0.14, h * 0.13);
  ctx.fillRect(x - h * 0.11, y - h * 0.94, h * 0.22, h * 0.025);
  ctx.beginPath();
  ctx.arc(x, y - h * 0.86, h * 0.075, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - h * 0.12, y - h * 0.76);
  ctx.lineTo(x + h * 0.12, y - h * 0.76);
  ctx.lineTo(x + h * 0.17, y - h * 0.28);
  ctx.lineTo(x + h * 0.07, y);
  ctx.lineTo(x - h * 0.07, y);
  ctx.lineTo(x - h * 0.17, y - h * 0.28);
  ctx.closePath();
  ctx.fill();
};

const ILL: Record<string, Ill> = {
  // Diario de un seductor: calle de Copenhague al anochecer; una ventana encendida con una silueta de mujer
  // y, abajo, en la sombra de la acera, un hombre con sombrero de copa que mira.
  diario: (ctx, a) => {
    const u = U(a);
    sky(ctx, a, '#2A1830', '#B0626A');
    glow(ctx, a.x + a.w * 0.5, a.y + a.h * 0.55, 260 * u, '255,170,120', 0.25);
    cphRoofs(ctx, a, a.y + a.h * 0.32, '#3A2433', '#4E7F70', 1843);
    facade(ctx, a.x - 6 * u, a.y + a.h * 0.32, a.w * 0.55, a.h * 0.7, '#9A6A3E', '#4A3226', '#F3C77A', 31, 3, 4, 0.1);
    facade(ctx, a.x + a.w * 0.52, a.y + a.h * 0.28, a.w * 0.5, a.h * 0.74, '#7E5636', '#3E2A20', '#F3C77A', 32, 3, 4, 0.05);
    // la ventana grande encendida, con cortina y una silueta
    const wx = a.x + a.w * 0.62, wy = a.y + a.h * 0.42, ww = a.w * 0.22, wh = a.h * 0.2;
    glow(ctx, wx + ww / 2, wy + wh / 2, 150 * u, '255,200,120', 0.55);
    ctx.fillStyle = '#FFD99A';
    ctx.fillRect(wx, wy, ww, wh);
    ctx.fillStyle = 'rgba(160,60,50,0.55)';
    ctx.fillRect(wx, wy, ww * 0.22, wh);
    figure(ctx, wx + ww * 0.6, wy + wh, wh * 0.9, '#5A2E2A', true);
    ctx.strokeStyle = '#3E2A20';
    ctx.lineWidth = 4 * u;
    ctx.strokeRect(wx, wy, ww, wh);
    ctx.beginPath();
    ctx.moveTo(wx + ww / 2, wy);
    ctx.lineTo(wx + ww / 2, wy + wh);
    ctx.stroke();
    // acera y farola
    ctx.fillStyle = '#21141B';
    ctx.fillRect(a.x, a.y + a.h * 0.86, a.w, a.h * 0.14);
    ctx.fillStyle = '#21141B';
    ctx.fillRect(a.x + a.w * 0.22, a.y + a.h * 0.5, 4 * u, a.h * 0.37);
    glow(ctx, a.x + a.w * 0.22 + 2 * u, a.y + a.h * 0.5, 50 * u, '255,210,140', 0.7);
    gent(ctx, a.x + a.w * 0.34, a.y + a.h * 0.9, 120 * u, '#140B10');
  },

  // Temor y temblor: amanecer en tierras altas; un camino que sube al monte y dos figuras pequeñas, padre e hijo,
  // con un haz de leña; arriba, la silueta de un carnero entre los matorrales.
  temor: (ctx, a) => {
    const u = U(a);
    sky(ctx, a, '#1E2A3E', '#E8B37A');
    glow(ctx, a.x + a.w * 0.5, a.y + a.h * 0.62, 280 * u, '255,200,140', 0.5);
    ridge(ctx, a, 0.62, 0.22, 7, '#4A4A5E', 7);
    // el monte
    ctx.fillStyle = '#2E2C38';
    ctx.beginPath();
    ctx.moveTo(a.x, a.y + a.h);
    ctx.lineTo(a.x, a.y + a.h * 0.78);
    ctx.quadraticCurveTo(a.x + a.w * 0.35, a.y + a.h * 0.7, a.x + a.w * 0.58, a.y + a.h * 0.36);
    ctx.quadraticCurveTo(a.x + a.w * 0.72, a.y + a.h * 0.32, a.x + a.w * 0.8, a.y + a.h * 0.4);
    ctx.quadraticCurveTo(a.x + a.w * 0.9, a.y + a.h * 0.6, a.x + a.w, a.y + a.h * 0.64);
    ctx.lineTo(a.x + a.w, a.y + a.h);
    ctx.closePath();
    ctx.fill();
    // el camino
    ctx.strokeStyle = 'rgba(232,179,122,0.55)';
    ctx.lineWidth = 5 * u;
    ctx.beginPath();
    ctx.moveTo(a.x + a.w * 0.1, a.y + a.h);
    ctx.bezierCurveTo(a.x + a.w * 0.5, a.y + a.h * 0.86, a.x + a.w * 0.2, a.y + a.h * 0.7, a.x + a.w * 0.48, a.y + a.h * 0.56);
    ctx.bezierCurveTo(a.x + a.w * 0.62, a.y + a.h * 0.48, a.x + a.w * 0.52, a.y + a.h * 0.42, a.x + a.w * 0.64, a.y + a.h * 0.36);
    ctx.stroke();
    // padre e hijo
    figure(ctx, a.x + a.w * 0.42, a.y + a.h * 0.62, 46 * u, '#14121A');
    figure(ctx, a.x + a.w * 0.47, a.y + a.h * 0.6, 30 * u, '#14121A');
    ctx.strokeStyle = '#14121A';
    ctx.lineWidth = 3 * u;
    ctx.beginPath();
    ctx.moveTo(a.x + a.w * 0.455, a.y + a.h * 0.585);
    ctx.lineTo(a.x + a.w * 0.49, a.y + a.h * 0.565);
    ctx.stroke();
    // carnero entre matorrales, arriba
    const rx = a.x + a.w * 0.73, ry = a.y + a.h * 0.345;
    ctx.fillStyle = '#14121A';
    ctx.beginPath();
    ctx.ellipse(rx, ry, 14 * u, 8 * u, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(rx + 14 * u, ry - 6 * u, 5 * u, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2.4 * u;
    ctx.beginPath();
    ctx.arc(rx + 16 * u, ry - 9 * u, 4 * u, Math.PI, Math.PI * 2.2);
    ctx.stroke();
    for (let k = 0; k < 4; k++) ctx.fillRect(rx - 10 * u + k * 6 * u, ry + 5 * u, 2 * u, 8 * u);
    for (let k = 0; k < 7; k++) {
      ctx.beginPath();
      ctx.arc(rx - 30 * u + k * 10 * u, ry + 12 * u, 8 * u, Math.PI, 0);
      ctx.fill();
    }
  },

  // La pureza de corazón: una sola vela encendida en una hornacina; todo lo demás, en calma.
  pureza: (ctx, a) => {
    const u = U(a);
    sky(ctx, a, '#3A3530', '#1E1A16');
    glow(ctx, a.x + a.w * 0.5, a.y + a.h * 0.5, 320 * u, '255,210,140', 0.5);
    // hornacina
    ctx.fillStyle = 'rgba(255,230,190,0.08)';
    ctx.beginPath();
    ctx.moveTo(a.x + a.w * 0.25, a.y + a.h * 0.85);
    ctx.lineTo(a.x + a.w * 0.25, a.y + a.h * 0.4);
    ctx.arc(a.x + a.w * 0.5, a.y + a.h * 0.4, a.w * 0.25, Math.PI, 0);
    ctx.lineTo(a.x + a.w * 0.75, a.y + a.h * 0.85);
    ctx.closePath();
    ctx.fill();
    // vela
    const cx = a.x + a.w * 0.5, base = a.y + a.h * 0.8;
    ctx.fillStyle = '#F2E9D6';
    ctx.fillRect(cx - 16 * u, base - 130 * u, 32 * u, 130 * u);
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(cx + 6 * u, base - 130 * u, 10 * u, 130 * u);
    ctx.fillStyle = '#B58A3C';
    ctx.fillRect(cx - 50 * u, base, 100 * u, 12 * u);
    glow(ctx, cx, base - 160 * u, 90 * u, '255,220,150', 0.9);
    ctx.fillStyle = '#FFF4D6';
    ctx.beginPath();
    ctx.moveTo(cx, base - 196 * u);
    ctx.bezierCurveTo(cx + 16 * u, base - 166 * u, cx + 12 * u, base - 138 * u, cx, base - 136 * u);
    ctx.bezierCurveTo(cx - 12 * u, base - 138 * u, cx - 16 * u, base - 166 * u, cx, base - 196 * u);
    ctx.fill();
  },

  // La enfermedad mortal: muelle de Copenhague de noche, agua negra, una farola y un hombre solo con una sombra larga.
  enfermedad: (ctx, a) => {
    const u = U(a);
    sky(ctx, a, '#05070C', '#1C2A3C');
    stars(ctx, a, 40, 1849, '220,230,255', 0.4);
    moon(ctx, a.x + a.w * 0.76, a.y + a.h * 0.2, 16 * u, '#E9E2C8', '#0C111A');
    cphRoofs(ctx, a, a.y + a.h * 0.52, '#0E141E', '#22403A', 1855);
    water(ctx, a, a.y + a.h * 0.6, '#101A28', '#05080D', 1849, 'rgba(233,226,200,0.25)');
    ctx.fillStyle = '#0A0D12';
    ctx.fillRect(a.x, a.y + a.h * 0.8, a.w, a.h * 0.2);
    const lx = a.x + a.w * 0.3;
    ctx.fillStyle = '#1A1D24';
    ctx.fillRect(lx, a.y + a.h * 0.46, 4 * u, a.h * 0.35);
    glow(ctx, lx + 2 * u, a.y + a.h * 0.46, 70 * u, '255,210,140', 0.8);
    glow(ctx, lx + 2 * u, a.y + a.h * 0.82, 120 * u, '255,210,140', 0.18);
    gent(ctx, a.x + a.w * 0.56, a.y + a.h * 0.86, 96 * u, '#020305');
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.beginPath();
    ctx.moveTo(a.x + a.w * 0.53, a.y + a.h * 0.86);
    ctx.lineTo(a.x + a.w * 0.98, a.y + a.h * 0.95);
    ctx.lineTo(a.x + a.w * 0.98, a.y + a.h * 0.98);
    ctx.lineTo(a.x + a.w * 0.59, a.y + a.h * 0.86);
    ctx.closePath();
    ctx.fill();
  },

  // Kierkegaard en 90 minutos: reloj de arena delante de la silueta de Copenhague.
  noventa: (ctx, a) => {
    const u = U(a);
    sky(ctx, a, '#E9DDC0', '#C9B48A');
    cphRoofs(ctx, a, a.y + a.h * 0.78, 'rgba(47,111,98,0.45)', 'rgba(47,111,98,0.7)', 90);
    const cx = a.x + a.w * 0.5, cy = a.y + a.h * 0.52, hw = 70 * u, hh = 120 * u;
    ctx.fillStyle = '#6E4A22';
    ctx.fillRect(cx - hw - 14 * u, cy - hh - 16 * u, (hw + 14 * u) * 2, 16 * u);
    ctx.fillRect(cx - hw - 14 * u, cy + hh, (hw + 14 * u) * 2, 16 * u);
    ctx.strokeStyle = 'rgba(60,40,20,0.8)';
    ctx.lineWidth = 4 * u;
    ctx.beginPath();
    ctx.moveTo(cx - hw, cy - hh);
    ctx.quadraticCurveTo(cx - hw, cy - 12 * u, cx, cy);
    ctx.quadraticCurveTo(cx + hw, cy - 12 * u, cx + hw, cy - hh);
    ctx.moveTo(cx - hw, cy + hh);
    ctx.quadraticCurveTo(cx - hw, cy + 12 * u, cx, cy);
    ctx.quadraticCurveTo(cx + hw, cy + 12 * u, cx + hw, cy + hh);
    ctx.stroke();
    ctx.fillStyle = '#D9A94E';
    ctx.beginPath();
    ctx.moveTo(cx - hw * 0.6, cy - hh * 0.5);
    ctx.quadraticCurveTo(cx - hw * 0.3, cy - 10 * u, cx, cy - 4 * u);
    ctx.quadraticCurveTo(cx + hw * 0.3, cy - 10 * u, cx + hw * 0.6, cy - hh * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx - hw * 0.9, cy + hh);
    ctx.quadraticCurveTo(cx, cy + hh * 0.45, cx + hw * 0.9, cy + hh);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(cx - 1.5 * u, cy, 3 * u, hh * 0.6);
  },

  // 100 citas: cuaderno abierto con renglones y una pluma.
  citas: (ctx, a) => {
    const u = U(a);
    sky(ctx, a, '#1F4A41', '#2F6F62');
    glow(ctx, a.x + a.w * 0.5, a.y + a.h * 0.6, 260 * u, '255,236,200', 0.25);
    const cx = a.x + a.w * 0.5, cy = a.y + a.h * 0.62;
    ctx.fillStyle = '#F2EAD6';
    ctx.beginPath();
    ctx.moveTo(cx, cy - 70 * u);
    ctx.quadraticCurveTo(cx - 80 * u, cy - 90 * u, cx - 150 * u, cy - 70 * u);
    ctx.lineTo(cx - 150 * u, cy + 90 * u);
    ctx.quadraticCurveTo(cx - 80 * u, cy + 70 * u, cx, cy + 90 * u);
    ctx.quadraticCurveTo(cx + 80 * u, cy + 70 * u, cx + 150 * u, cy + 90 * u);
    ctx.lineTo(cx + 150 * u, cy - 70 * u);
    ctx.quadraticCurveTo(cx + 80 * u, cy - 90 * u, cx, cy - 70 * u);
    ctx.fill();
    ctx.strokeStyle = 'rgba(40,40,40,0.35)';
    ctx.lineWidth = 2 * u;
    for (let k = 0; k < 6; k++) {
      ctx.beginPath();
      ctx.moveTo(cx - 130 * u, cy - 40 * u + k * 22 * u);
      ctx.lineTo(cx - 20 * u, cy - 40 * u + k * 22 * u);
      ctx.moveTo(cx + 20 * u, cy - 40 * u + k * 22 * u);
      ctx.lineTo(cx + 130 * u, cy - 40 * u + k * 22 * u);
      ctx.stroke();
    }
    ctx.fillStyle = '#E9C877';
    ctx.font = `700 ${120 * u}px ${SERIF}`;
    ctx.textAlign = 'center';
    ctx.fillText('«»', cx, cy - 110 * u);
  },

  // O lo uno o lo otro: un camino que se bifurca en un bosque de hayas danés.
  unootro: (ctx, a) => {
    const u = U(a);
    sky(ctx, a, '#3E5A4A', '#C9C08A');
    glow(ctx, a.x + a.w * 0.5, a.y + a.h * 0.48, 220 * u, '255,240,190', 0.5);
    const r = rng(43);
    for (let k = 0; k < 14; k++) {
      const x = a.x + r() * a.w, w = (8 + r() * 10) * u;
      ctx.fillStyle = `rgba(30,40,30,${0.5 + r() * 0.4})`;
      ctx.fillRect(x, a.y, w, a.h * (0.6 + r() * 0.3));
    }
    ctx.fillStyle = '#3B4A32';
    ctx.fillRect(a.x, a.y + a.h * 0.62, a.w, a.h * 0.38);
    ctx.fillStyle = '#C9B48A';
    ctx.beginPath();
    ctx.moveTo(a.x + a.w * 0.42, a.y + a.h);
    ctx.lineTo(a.x + a.w * 0.48, a.y + a.h * 0.78);
    ctx.lineTo(a.x + a.w * 0.2, a.y + a.h * 0.63);
    ctx.lineTo(a.x + a.w * 0.26, a.y + a.h * 0.63);
    ctx.lineTo(a.x + a.w * 0.5, a.y + a.h * 0.74);
    ctx.lineTo(a.x + a.w * 0.76, a.y + a.h * 0.63);
    ctx.lineTo(a.x + a.w * 0.82, a.y + a.h * 0.63);
    ctx.lineTo(a.x + a.w * 0.54, a.y + a.h * 0.78);
    ctx.lineTo(a.x + a.w * 0.62, a.y + a.h);
    ctx.closePath();
    ctx.fill();
  },

  // El concepto de la angustia: un acantilado sobre el mar, alguien en el borde (el vértigo de la libertad).
  angustia: (ctx, a) => {
    const u = U(a);
    sky(ctx, a, '#5B6670', '#C9CED2');
    water(ctx, a, a.y + a.h * 0.7, '#6E7C88', '#3E4A55', 1844, 'rgba(255,255,255,0.35)');
    ctx.fillStyle = '#2A2E33';
    ctx.beginPath();
    ctx.moveTo(a.x, a.y + a.h);
    ctx.lineTo(a.x, a.y + a.h * 0.42);
    ctx.lineTo(a.x + a.w * 0.5, a.y + a.h * 0.44);
    ctx.lineTo(a.x + a.w * 0.56, a.y + a.h * 0.52);
    ctx.lineTo(a.x + a.w * 0.52, a.y + a.h * 0.7);
    ctx.lineTo(a.x + a.w * 0.6, a.y + a.h);
    ctx.closePath();
    ctx.fill();
    figure(ctx, a.x + a.w * 0.47, a.y + a.h * 0.44, 50 * u, '#15181B');
  },

  // Las obras del amor: dos casas con las ventanas encendidas unidas por un puentecito sobre un canal.
  obras: (ctx, a) => {
    const u = U(a);
    sky(ctx, a, '#2B1E26', '#9A5A48');
    water(ctx, a, a.y + a.h * 0.72, '#4A3038', '#20151A', 1847, 'rgba(255,210,150,0.35)');
    facade(ctx, a.x, a.y + a.h * 0.36, a.w * 0.36, a.h * 0.36, '#7E4A36', '#3A2420', '#FFCC80', 61, 3, 3, 0.6);
    facade(ctx, a.x + a.w * 0.64, a.y + a.h * 0.32, a.w * 0.36, a.h * 0.4, '#8C5A3A', '#3A2420', '#FFCC80', 62, 3, 3, 0.6);
    ctx.strokeStyle = '#2A1A18';
    ctx.lineWidth = 6 * u;
    ctx.beginPath();
    ctx.moveTo(a.x + a.w * 0.36, a.y + a.h * 0.72);
    ctx.quadraticCurveTo(a.x + a.w * 0.5, a.y + a.h * 0.6, a.x + a.w * 0.64, a.y + a.h * 0.72);
    ctx.stroke();
  },

  // Diarios: pila de cuadernos junto a una vela.
  diarios: (ctx, a) => {
    const u = U(a);
    sky(ctx, a, '#2A241E', '#14110E');
    glow(ctx, a.x + a.w * 0.3, a.y + a.h * 0.45, 200 * u, '255,200,120', 0.45);
    const cols = ['#5E1C2B', '#22323F', '#2F6F62', '#6A5733', '#4A2E22', '#3B3631'];
    cols.forEach((c, k) => {
      ctx.fillStyle = c;
      ctx.fillRect(a.x + a.w * 0.36 + (k % 2) * 6 * u, a.y + a.h * 0.86 - (k + 1) * 26 * u, a.w * 0.5, 24 * u);
      ctx.fillStyle = 'rgba(240,230,210,0.8)';
      ctx.fillRect(a.x + a.w * 0.86 + (k % 2) * 6 * u - 6 * u, a.y + a.h * 0.86 - (k + 1) * 26 * u + 3 * u, 6 * u, 18 * u);
    });
    ctx.fillStyle = '#F2E9D6';
    ctx.fillRect(a.x + a.w * 0.22, a.y + a.h * 0.5, 18 * u, a.h * 0.36);
    glow(ctx, a.x + a.w * 0.22 + 9 * u, a.y + a.h * 0.46, 50 * u, '255,220,150', 0.9);
  },

  // Culpable o no culpable: una balanza con un anillo en un platillo y una carta en el otro.
  culpable: (ctx, a) => {
    const u = U(a);
    sky(ctx, a, '#1E2A24', '#5A7062');
    glow(ctx, a.x + a.w * 0.5, a.y + a.h * 0.5, 240 * u, '255,236,200', 0.3);
    const cx = a.x + a.w * 0.5, top = a.y + a.h * 0.32;
    ctx.strokeStyle = '#E3C27A';
    ctx.fillStyle = '#E3C27A';
    ctx.lineWidth = 5 * u;
    ctx.beginPath();
    ctx.moveTo(cx, top);
    ctx.lineTo(cx, a.y + a.h * 0.85);
    ctx.moveTo(cx - 120 * u, top + 20 * u);
    ctx.lineTo(cx + 120 * u, top - 10 * u);
    ctx.stroke();
    ctx.fillRect(cx - 50 * u, a.y + a.h * 0.85, 100 * u, 10 * u);
    [[-120, 20], [120, -10]].forEach(([dx, dy]) => {
      ctx.beginPath();
      ctx.moveTo(cx + dx * u, top + dy * u);
      ctx.lineTo(cx + dx * u - 36 * u, top + dy * u + 90 * u);
      ctx.moveTo(cx + dx * u, top + dy * u);
      ctx.lineTo(cx + dx * u + 36 * u, top + dy * u + 90 * u);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx + dx * u, top + dy * u + 92 * u, 44 * u, 10 * u, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.lineWidth = 4 * u;
    ctx.beginPath();
    ctx.arc(cx - 120 * u, top + 98 * u, 12 * u, Math.PI, 0);
    ctx.stroke();
    ctx.fillStyle = '#F2EAD6';
    ctx.fillRect(cx + 96 * u, top + 52 * u, 48 * u, 30 * u);
  },

  // Migajas filosóficas: una ventana con luz de mañana sobre una mesa con un pan y migas.
  migajas: (ctx, a) => {
    const u = U(a);
    sky(ctx, a, '#E8DAB8', '#B89A62');
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillRect(a.x + a.w * 0.2, a.y + a.h * 0.2, a.w * 0.6, a.h * 0.36);
    ctx.fillStyle = '#6A4A2A';
    ctx.fillRect(a.x, a.y + a.h * 0.7, a.w, a.h * 0.3);
    ctx.fillStyle = '#C98B3A';
    ctx.beginPath();
    ctx.ellipse(a.x + a.w * 0.45, a.y + a.h * 0.68, 70 * u, 30 * u, 0, Math.PI, 0);
    ctx.fill();
    const r = rng(1844);
    for (let k = 0; k < 18; k++) {
      ctx.beginPath();
      ctx.arc(a.x + a.w * (0.55 + r() * 0.35), a.y + a.h * (0.72 + r() * 0.1), (2 + r() * 3) * u, 0, Math.PI * 2);
      ctx.fill();
    }
  },
};

export const drawCover = (ctx: Ctx, b: BookDef, key: string, w: number, h: number) => {
  const k = w / 600;
  const light = lum(b.bg) > 0.62;
  const foil: string | CanvasGradient = light ? b.fg : gold(ctx, w * 0.1, w * 0.9);
  const pal: Pal & { num?: number } = { bg: b.bg, fg: b.fg, accent: b.accent, foil, light, ink: b.fg, num: b.num };
  cloth(ctx, w, h, b.bg, hashStr(key));
  // filetes
  ctx.strokeStyle = light ? b.accent : gold(ctx, 0, w);
  ctx.globalAlpha = light ? 0.8 : 0.9;
  ctx.lineWidth = 3 * k;
  ctx.strokeRect(26 * k, 26 * k, w - 52 * k, h - 52 * k);
  ctx.lineWidth = 1.4 * k;
  ctx.strokeRect(36 * k, 36 * k, w - 72 * k, h - 72 * k);
  ctx.globalAlpha = 1;
  // autor
  const author = (b.author ?? 'Søren Kierkegaard').toUpperCase();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${26 * k}px ${SANS}`;
  (ctx as unknown as { letterSpacing: string }).letterSpacing = `${8 * k}px`;
  embossText(ctx, author, w / 2 + 4 * k, 92 * k, foil, k);
  (ctx as unknown as { letterSpacing: string }).letterSpacing = '0px';
  if (b.num !== undefined) {
    ctx.font = `italic 400 ${30 * k}px ${SERIF}`;
    embossText(ctx, `La Torre Oscura ${['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][b.num - 1]}`, w / 2, 132 * k, light ? b.accent : foil, k);
  }
  // ventana con arco
  const a: Win = { x: 84 * k, y: (b.num !== undefined ? 168 : 150) * k, w: w - 168 * k, h: 470 * k - (b.num !== undefined ? 18 * k : 0) };
  const r = a.w / 2;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(a.x, a.y + a.h);
  ctx.lineTo(a.x, a.y + r);
  ctx.arc(a.x + r, a.y + r, r, Math.PI, 0);
  ctx.lineTo(a.x + a.w, a.y + a.h);
  ctx.closePath();
  ctx.clip();
  const ill = ILL[key] ?? null;
  if (ill) ill(ctx, a, pal);
  else {
    sky(ctx, a, mix(b.bg, '#000000', 0.25), mix(b.bg, '#FFFFFF', 0.1));
  }
  // sombra interior de la ventana (bisel)
  const ig = ctx.createLinearGradient(0, a.y, 0, a.y + a.h);
  ig.addColorStop(0, 'rgba(0,0,0,0.22)');
  ig.addColorStop(0.12, 'rgba(0,0,0,0)');
  ig.addColorStop(0.9, 'rgba(0,0,0,0)');
  ig.addColorStop(1, 'rgba(0,0,0,0.25)');
  ctx.fillStyle = ig;
  ctx.fillRect(a.x, a.y, a.w, a.h);
  ctx.restore();
  // marco de la ventana en dorado
  ctx.strokeStyle = light ? b.fg : gold(ctx, a.x, a.x + a.w);
  ctx.lineWidth = 5 * k;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y + a.h);
  ctx.lineTo(a.x, a.y + r);
  ctx.arc(a.x + r, a.y + r, r, Math.PI, 0);
  ctx.lineTo(a.x + a.w, a.y + a.h);
  ctx.closePath();
  ctx.stroke();
  ctx.lineWidth = 1.5 * k;
  ctx.beginPath();
  ctx.moveTo(a.x - 10 * k, a.y + a.h + 10 * k);
  ctx.lineTo(a.x - 10 * k, a.y + r);
  ctx.arc(a.x + r, a.y + r, r + 10 * k, Math.PI, 0);
  ctx.lineTo(a.x + a.w + 10 * k, a.y + a.h + 10 * k);
  ctx.closePath();
  ctx.stroke();
  // título
  const titleTop = a.y + a.h + 40 * k;
  let size = 76 * k;
  ctx.font = `500 ${size}px ${SERIF}`;
  let lines = wrap(ctx, b.title, w - 130 * k);
  while ((lines.length > 2 || lines.some((l) => ctx.measureText(l).width > w - 130 * k)) && size > 30 * k) {
    size -= 2 * k;
    ctx.font = `500 ${size}px ${SERIF}`;
    lines = wrap(ctx, b.title, w - 130 * k);
  }
  if (lines.length > 1) {
    size *= 0.86;
    ctx.font = `500 ${size}px ${SERIF}`;
  }
  const lh = size * 1.0;
  const room = h - 96 * k - titleTop;
  const y0 = titleTop + (room - lh * lines.length) / 2 + lh / 2 - 8 * k;
  const tg = ctx.createLinearGradient(w * 0.1, 0, w * 0.9, 0);
  ['#C49A48', '#F1D58C', '#FFF2C4', '#E6C06C', '#CFA250'].forEach((c, i, arr) => tg.addColorStop(i / (arr.length - 1), c));
  lines.forEach((l, i) => embossText(ctx, l, w / 2, y0 + i * lh, light ? b.fg : tg, k));
  // año y sello de la colección
  if (b.year) {
    ctx.font = `500 ${22 * k}px ${SANS}`;
    (ctx as unknown as { letterSpacing: string }).letterSpacing = `${4 * k}px`;
    ctx.globalAlpha = 0.75;
    embossText(ctx, String(b.year), w / 2 + 2 * k, h - 64 * k, foil, k);
    ctx.globalAlpha = 1;
    (ctx as unknown as { letterSpacing: string }).letterSpacing = '0px';
  }
};

const urlCache = new Map<string, string>();
const canvasCache = new Map<string, HTMLCanvasElement>();
export const coverCanvas = (b: BookDef, key: string, w = 600) => {
  const id = `${key}-${w}`;
  let c = canvasCache.get(id);
  if (!c) {
    c = document.createElement('canvas');
    c.width = w;
    c.height = Math.round(w * 1.5);
    drawCover(c.getContext('2d')!, b, key, c.width, c.height);
    canvasCache.set(id, c);
  }
  return c;
};
export const coverURL = (b: BookDef, key: string, w = 600) => {
  const id = `${key}-${w}`;
  let u = urlCache.get(id);
  if (!u) {
    u = coverCanvas(b, key, w).toDataURL('image/jpeg', 0.93);
    urlCache.set(id, u);
  }
  return u;
};
const texCache = new Map<string, THREE.CanvasTexture>();
export const coverTexture = (b: BookDef, key: string, w = 768) => {
  const id = `${key}-${w}`;
  let t = texCache.get(id);
  if (!t) {
    t = new THREE.CanvasTexture(coverCanvas(b, key, w));
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    texCache.set(id, t);
  }
  return t;
};
export const HAS_ILLUSTRATION = (key: string) => key in ILL;


// Sin fotogramas de películas en este episodio (se mantiene la firma por compatibilidad).
export const stillURL = (_key: string, _w = 900) => '';
