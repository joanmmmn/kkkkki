import * as THREE from 'three';
import type { BookDef } from './kit';

// ————————————————————————————————————————————————————————————————
// Cubiertas de la colección del vídeo, dibujadas en canvas: tela de encuadernar, filetes y título en dorado con relieve
// y una ilustración propia en una ventana con arco para cada libro.
// Son diseños inventados para este vídeo (episodio de Dostoievski): no reproducen ninguna portada ni edición real.
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

const ILL: Record<string, Ill> = {
  // Noches blancas: cielo de noche blanca, puente de piedra sobre un canal, farola apagada y dos figuras en la barandilla.
  noches: (ctx, a) => {
    const u = U(a);
    sky(ctx, a, '#C9C3DD', '#F4D9C6');
    glow(ctx, a.x + a.w * 0.7, a.y + a.h * 0.42, 220 * u, '255,236,214', 0.6);
    moon(ctx, a.x + a.w * 0.72, a.y + a.h * 0.2, 14 * u, 'rgba(255,255,255,0.75)');
    // edificios al fondo
    const hy = a.y + a.h * 0.5;
    facade(ctx, a.x - 10 * u, hy - 70 * u, a.w * 0.42, 70 * u, '#A9A2BE', '#8F88A6', '#F7E2B8', 21, 6, 3, 0.15);
    facade(ctx, a.x + a.w * 0.62, hy - 86 * u, a.w * 0.42, 86 * u, '#B3A6BD', '#968AA6', '#F7E2B8', 22, 6, 4, 0.12);
    onion(ctx, a.x + a.w * 0.5, hy - 40 * u, 34 * u, 70 * u, '#9C94B4', '#C9A24E');
    water(ctx, a, hy, '#B9B6D6', '#8C8EB5', 23, 'rgba(255,240,225,0.55)');
    // puente (arco) y barandilla
    ctx.fillStyle = '#5E5873';
    ctx.beginPath();
    ctx.moveTo(a.x, hy + 40 * u);
    ctx.lineTo(a.x + a.w, hy + 40 * u);
    ctx.lineTo(a.x + a.w, hy + 120 * u);
    ctx.lineTo(a.x + a.w * 0.78, hy + 120 * u);
    ctx.quadraticCurveTo(a.x + a.w * 0.5, hy + 52 * u, a.x + a.w * 0.22, hy + 120 * u);
    ctx.lineTo(a.x, hy + 120 * u);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#3E3A50';
    ctx.lineWidth = 3 * u;
    ctx.beginPath();
    ctx.moveTo(a.x, hy + 14 * u);
    ctx.lineTo(a.x + a.w, hy + 14 * u);
    ctx.stroke();
    for (let i = 0; i <= 22; i++) {
      const x = a.x + (a.w * i) / 22;
      ctx.beginPath();
      ctx.moveTo(x, hy + 14 * u);
      ctx.lineTo(x, hy + 40 * u);
      ctx.stroke();
      if (i % 2 === 0) {
        ctx.beginPath();
        ctx.arc(x + a.w / 44, hy + 27 * u, 5 * u, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    // farola
    ctx.fillStyle = '#2E2B3B';
    ctx.fillRect(a.x + a.w * 0.2, hy - 90 * u, 4 * u, 130 * u);
    ctx.beginPath();
    ctx.moveTo(a.x + a.w * 0.2 - 10 * u, hy - 90 * u);
    ctx.lineTo(a.x + a.w * 0.2 + 14 * u, hy - 90 * u);
    ctx.lineTo(a.x + a.w * 0.2 + 8 * u, hy - 112 * u);
    ctx.lineTo(a.x + a.w * 0.2 - 4 * u, hy - 112 * u);
    ctx.closePath();
    ctx.fill();
    // dos figuras en la barandilla
    figure(ctx, a.x + a.w * 0.5, hy + 40 * u, 66 * u, '#2B2738');
    figure(ctx, a.x + a.w * 0.58, hy + 40 * u, 60 * u, '#2B2738', true);
  },

  // Crimen y castigo: una casa de vecinos amarilla al anochecer, la buhardilla encendida y un hombre que vuelve por la calle.
  crimen: (ctx, a, p) => {
    const u = U(a);
    sky(ctx, a, '#250B12', '#7E3326');
    glow(ctx, a.x + a.w * 0.3, a.y + a.h * 0.95, 320 * u, '255,140,70', 0.3);
    // edificio vecino en sombra a la derecha
    ctx.fillStyle = '#2A1410';
    ctx.fillRect(a.x + a.w * 0.8, a.y + a.h * 0.3, a.w * 0.3, a.h);
    // casa de vecinos (fachada ocre) en ligera perspectiva
    const bx = a.x + a.w * 0.12, bw = a.w * 0.66, by = a.y + a.h * 0.22, bh = a.h * 0.78;
    const wall = ctx.createLinearGradient(bx, 0, bx + bw, 0);
    wall.addColorStop(0, '#8E6528');
    wall.addColorStop(0.45, '#C79A45');
    wall.addColorStop(1, '#7A5420');
    ctx.fillStyle = wall;
    ctx.fillRect(bx, by, bw, bh);
    // franjas de humedad
    const r = rng(12);
    for (let i = 0; i < 9; i++) {
      ctx.fillStyle = `rgba(40,20,10,${0.06 + r() * 0.08})`;
      ctx.fillRect(bx + r() * bw, by + r() * bh * 0.5, (6 + r() * 14) * u, bh * (0.2 + r() * 0.4));
    }
    // cornisa, tejado, chimeneas y buhardilla
    ctx.fillStyle = '#5A3C16';
    ctx.fillRect(bx - 8 * u, by - 8 * u, bw + 16 * u, 12 * u);
    ctx.fillStyle = '#24130F';
    ctx.beginPath();
    ctx.moveTo(bx - 8 * u, by - 8 * u);
    ctx.lineTo(bx + bw * 0.2, by - 46 * u);
    ctx.lineTo(bx + bw * 0.8, by - 46 * u);
    ctx.lineTo(bx + bw + 8 * u, by - 8 * u);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(bx + bw * 0.12, by - 70 * u, 14 * u, 34 * u);
    ctx.fillRect(bx + bw * 0.82, by - 64 * u, 14 * u, 28 * u);
    ctx.fillStyle = '#3A2620';
    ctx.fillRect(bx + bw * 0.58, by - 44 * u, bw * 0.15, 38 * u);
    ctx.fillStyle = '#FFD27A';
    ctx.fillRect(bx + bw * 0.6, by - 38 * u, bw * 0.11, 26 * u);
    ctx.fillStyle = '#3A2620';
    ctx.fillRect(bx + bw * 0.6 + bw * 0.05, by - 38 * u, 2 * u, 26 * u);
    glow(ctx, bx + bw * 0.655, by - 26 * u, 70 * u, '255,200,110', 0.65);
    // ventanas (alguna con luz débil)
    for (let rr = 0; rr < 5; rr++) for (let c = 0; c < 4; c++) {
      const x = bx + bw * 0.09 + c * bw * 0.22, y = by + 28 * u + rr * 60 * u;
      const lit = (rr === 1 && c === 2) || (rr === 3 && c === 0);
      ctx.fillStyle = lit ? 'rgba(255,200,110,0.75)' : '#2E2016';
      ctx.fillRect(x, y, bw * 0.12, 38 * u);
      ctx.fillStyle = 'rgba(255,240,200,0.18)';
      ctx.fillRect(x - 3 * u, y - 4 * u, bw * 0.12 + 6 * u, 4 * u);
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(x + bw * 0.058, y, 2 * u, 38 * u);
    }
    // portal en arco
    ctx.fillStyle = '#120A07';
    ctx.beginPath();
    ctx.moveTo(bx + bw * 0.4, a.y + a.h);
    ctx.lineTo(bx + bw * 0.4, a.y + a.h - 58 * u);
    ctx.arc(bx + bw * 0.5, a.y + a.h - 58 * u, bw * 0.1, Math.PI, 0);
    ctx.lineTo(bx + bw * 0.6, a.y + a.h);
    ctx.closePath();
    ctx.fill();
    // calle y un hombre con sombrero de copa que vuelve, con su sombra larga
    ctx.fillStyle = 'rgba(20,10,8,0.85)';
    ctx.fillRect(a.x, a.y + a.h * 0.93, a.w, a.h * 0.07);
    const fx = a.x + a.w * 0.2, fy = a.y + a.h * 0.95;
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath();
    ctx.moveTo(fx - 8 * u, fy);
    ctx.lineTo(fx + 90 * u, fy + 8 * u);
    ctx.lineTo(fx + 86 * u, fy + 14 * u);
    ctx.lineTo(fx - 8 * u, fy + 4 * u);
    ctx.closePath();
    ctx.fill();
    figure(ctx, fx, fy, 74 * u, '#0E0806');
    ctx.fillStyle = '#0E0806';
    ctx.fillRect(fx - 7 * u, fy - 74 * u - 16 * u, 14 * u, 14 * u);
    ctx.fillRect(fx - 11 * u, fy - 74 * u - 3 * u, 22 * u, 3 * u);
    // farola de gas
    ctx.fillStyle = '#1A0E0A';
    ctx.fillRect(a.x + a.w * 0.06, a.y + a.h * 0.64, 4 * u, a.h * 0.36);
    glow(ctx, a.x + a.w * 0.065, a.y + a.h * 0.62, 56 * u, '255,210,130', 0.7);
    ctx.fillStyle = '#FFE2A0';
    ctx.fillRect(a.x + a.w * 0.065 - 6 * u, a.y + a.h * 0.62 - 8 * u, 12 * u, 12 * u);
    void p;
  },

  // El jugador: la ruleta vista desde arriba sobre el tapete verde, con fichas.
  jugador: (ctx, a) => {
    const u = U(a);
    sky(ctx, a, '#123526', '#0A2016');
    // trama del tapete
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 80; i++) {
      ctx.beginPath();
      ctx.moveTo(a.x + i * 8 * u, a.y);
      ctx.lineTo(a.x + i * 8 * u - a.h * 0.3, a.y + a.h);
      ctx.stroke();
    }
    glow(ctx, a.x + a.w / 2, a.y + a.h * 0.46, 260 * u, '255,226,150', 0.32);
    const cx = a.x + a.w / 2, cy = a.y + a.h * 0.46, R = a.w * 0.4;
    // aro de madera
    const wood = ctx.createRadialGradient(cx, cy, R * 0.8, cx, cy, R * 1.08);
    wood.addColorStop(0, '#5A3418');
    wood.addColorStop(1, '#2A160A');
    ctx.fillStyle = wood;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.08, 0, Math.PI * 2);
    ctx.fill();
    // casillas
    const n = 37;
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2;
      ctx.fillStyle = i === 0 ? '#1F7A47' : i % 2 ? '#A3192F' : '#141414';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, a0, a1);
      ctx.closePath();
      ctx.fill();
    }
    ctx.strokeStyle = '#E9C877';
    ctx.lineWidth = 2 * u;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();
    // centro dorado
    const cg = ctx.createRadialGradient(cx - R * 0.1, cy - R * 0.1, R * 0.05, cx, cy, R * 0.62);
    cg.addColorStop(0, '#FFF0B8');
    cg.addColorStop(0.5, '#C99A45');
    cg.addColorStop(1, '#5A3E14');
    ctx.fillStyle = '#3B2610';
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.66, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.32, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#E9C877';
    ctx.lineWidth = 5 * u;
    for (let k = 0; k < 4; k++) {
      const an = k * Math.PI / 2 + 0.3;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(an) * R * 0.12, cy + Math.sin(an) * R * 0.12);
      ctx.lineTo(cx + Math.cos(an) * R * 0.6, cy + Math.sin(an) * R * 0.6);
      ctx.stroke();
    }
    // bola
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(cx + Math.cos(-0.7) * R * 0.86, cy + Math.sin(-0.7) * R * 0.86, 7 * u, 0, Math.PI * 2);
    ctx.fill();
    // fichas
    [[0.18, 0.88, '#E9C877'], [0.26, 0.92, '#A3192F'], [0.78, 0.9, '#F3EAD8']].forEach(([fx, fy, c], k) => {
      for (let j = 0; j < 4 - k; j++) {
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.beginPath();
        ctx.ellipse(a.x + a.w * (fx as number), a.y + a.h * (fy as number) - j * 6 * u + 3 * u, 22 * u, 9 * u, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = c as string;
        ctx.beginPath();
        ctx.ellipse(a.x + a.w * (fx as number), a.y + a.h * (fy as number) - j * 6 * u, 22 * u, 9 * u, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  },

  // Memorias del subsuelo: un sótano, una vela en la mesa y la luz de un ventanuco a ras de calle.
  subsuelo: (ctx, a, p) => {
    const u = U(a);
    sky(ctx, a, '#1A1714', '#2E2924');
    // ventanuco con rejas arriba
    const wx = a.x + a.w * 0.56, wy = a.y + a.h * 0.16, ww = a.w * 0.3, wh = a.h * 0.14;
    ctx.fillStyle = '#C8C2B4';
    ctx.fillRect(wx, wy, ww, wh);
    ctx.fillStyle = 'rgba(80,80,90,0.5)';
    ctx.fillRect(wx, wy + wh * 0.62, ww, wh * 0.38); // nieve sucia de la calle
    ctx.strokeStyle = '#141210';
    ctx.lineWidth = 5 * u;
    for (let i = 1; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(wx + (ww * i) / 5, wy);
      ctx.lineTo(wx + (ww * i) / 5, wy + wh);
      ctx.stroke();
    }
    ctx.strokeRect(wx, wy, ww, wh);
    // haz de luz
    const beam = ctx.createLinearGradient(wx, wy, wx - a.w * 0.3, a.y + a.h * 0.85);
    beam.addColorStop(0, 'rgba(220,220,230,0.28)');
    beam.addColorStop(1, 'rgba(220,220,230,0)');
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(wx, wy + wh);
    ctx.lineTo(wx + ww, wy + wh);
    ctx.lineTo(a.x + a.w * 0.5, a.y + a.h * 0.9);
    ctx.lineTo(a.x + a.w * 0.06, a.y + a.h * 0.9);
    ctx.closePath();
    ctx.fill();
    // suelo
    ctx.fillStyle = '#14110E';
    ctx.fillRect(a.x, a.y + a.h * 0.82, a.w, a.h * 0.18);
    // mesa, papeles y vela
    const tx = a.x + a.w * 0.14, ty = a.y + a.h * 0.64;
    ctx.fillStyle = '#3B2A1C';
    ctx.fillRect(tx, ty, a.w * 0.5, 10 * u);
    ctx.fillRect(tx + 12 * u, ty, 8 * u, a.h * 0.2);
    ctx.fillRect(tx + a.w * 0.5 - 20 * u, ty, 8 * u, a.h * 0.2);
    ctx.fillStyle = '#E9E1CF';
    ctx.save();
    ctx.translate(tx + a.w * 0.26, ty - 2 * u);
    ctx.rotate(-0.06);
    ctx.fillRect(-60 * u, -6 * u, 90 * u, 6 * u);
    ctx.restore();
    const vx = tx + a.w * 0.12, vy = ty;
    glow(ctx, vx, vy - 46 * u, 120 * u, '255,190,90', 0.55);
    ctx.fillStyle = '#EDE3CC';
    ctx.fillRect(vx - 6 * u, vy - 34 * u, 12 * u, 34 * u);
    ctx.fillStyle = '#FFD27A';
    ctx.beginPath();
    ctx.ellipse(vx, vy - 44 * u, 5 * u, 11 * u, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFF6D8';
    ctx.beginPath();
    ctx.ellipse(vx, vy - 42 * u, 2.4 * u, 6 * u, 0, 0, Math.PI * 2);
    ctx.fill();
    // silla vacía
    ctx.strokeStyle = '#2A1E14';
    ctx.lineWidth = 6 * u;
    ctx.beginPath();
    ctx.moveTo(tx + a.w * 0.56, a.y + a.h * 0.84);
    ctx.lineTo(tx + a.w * 0.56, a.y + a.h * 0.52);
    ctx.moveTo(tx + a.w * 0.56, a.y + a.h * 0.7);
    ctx.lineTo(tx + a.w * 0.7, a.y + a.h * 0.7);
    ctx.lineTo(tx + a.w * 0.7, a.y + a.h * 0.84);
    ctx.stroke();
    // ratoncera en el zócalo
    ctx.fillStyle = '#050403';
    ctx.beginPath();
    ctx.moveTo(a.x + a.w * 0.84, a.y + a.h * 0.82);
    ctx.lineTo(a.x + a.w * 0.84, a.y + a.h * 0.78);
    ctx.arc(a.x + a.w * 0.87, a.y + a.h * 0.78, a.w * 0.03, Math.PI, 0);
    ctx.lineTo(a.x + a.w * 0.9, a.y + a.h * 0.82);
    ctx.closePath();
    ctx.fill();
    void p;
  },

  // El idiota: un tren que llega de madrugada entre la nieve y el vapor.
  idiota: (ctx, a, p) => {
    const u = U(a);
    sky(ctx, a, '#33506F', '#9FB5C8');
    snow(ctx, { ...a, h: a.h * 0.7 }, 60, 31);
    // bosque de abetos
    for (let i = 0; i < 14; i++) {
      const x = a.x + (i / 13) * a.w, h = (60 + ((i * 37) % 50)) * u, base = a.y + a.h * 0.62;
      ctx.fillStyle = i % 2 ? '#2B4258' : '#355068';
      ctx.beginPath();
      ctx.moveTo(x, base - h);
      ctx.lineTo(x + 20 * u, base);
      ctx.lineTo(x - 20 * u, base);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = '#E9EEF4';
    ctx.fillRect(a.x, a.y + a.h * 0.62, a.w, a.h * 0.38);
    // vías hacia el espectador
    ctx.strokeStyle = '#5E6E80';
    ctx.lineWidth = 3 * u;
    ctx.beginPath();
    ctx.moveTo(a.x + a.w * 0.47, a.y + a.h * 0.66);
    ctx.lineTo(a.x + a.w * 0.18, a.y + a.h);
    ctx.moveTo(a.x + a.w * 0.53, a.y + a.h * 0.66);
    ctx.lineTo(a.x + a.w * 0.82, a.y + a.h);
    ctx.stroke();
    // locomotora de frente
    const cx = a.x + a.w / 2, base = a.y + a.h * 0.78;
    ctx.fillStyle = '#16212E';
    ctx.fillRect(cx - 62 * u, base - 120 * u, 124 * u, 120 * u);
    ctx.beginPath();
    ctx.arc(cx, base - 120 * u, 62 * u, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(cx - 14 * u, base - 210 * u, 28 * u, 50 * u); // chimenea
    ctx.fillRect(cx - 22 * u, base - 214 * u, 44 * u, 10 * u);
    // vapor
    for (let k = 0; k < 7; k++) {
      ctx.fillStyle = `rgba(240,244,250,${0.75 - k * 0.08})`;
      ctx.beginPath();
      ctx.arc(cx + k * 16 * u, base - 230 * u - k * 18 * u, (22 + k * 8) * u, 0, Math.PI * 2);
      ctx.fill();
    }
    // farol
    glow(ctx, cx, base - 128 * u, 120 * u, '255,226,150', 0.7);
    ctx.fillStyle = '#FFE8A8';
    ctx.beginPath();
    ctx.arc(cx, base - 128 * u, 18 * u, 0, Math.PI * 2);
    ctx.fill();
    // quitanieves
    ctx.fillStyle = p.accent;
    ctx.beginPath();
    ctx.moveTo(cx - 70 * u, base);
    ctx.lineTo(cx + 70 * u, base);
    ctx.lineTo(cx, base + 30 * u);
    ctx.closePath();
    ctx.fill();
    snow(ctx, a, 50, 32);
  },

  // Los hermanos Karamázov: cúpulas de un monasterio contra un cielo morado y una luna grande.
  karamazov: (ctx, a, p) => {
    const u = U(a);
    sky(ctx, a, '#1E0F1C', '#5B2A44');
    stars(ctx, a, 60, 41, '255,236,200');
    moon(ctx, a.x + a.w * 0.5, a.y + a.h * 0.34, 64 * u, '#F3E3C2');
    const base = a.y + a.h * 0.8;
    // muro
    ctx.fillStyle = '#E9DFCF';
    ctx.fillRect(a.x, base - 40 * u, a.w, a.h);
    ctx.fillStyle = '#C9BBA2';
    for (let i = 0; i < 16; i++) ctx.fillRect(a.x + i * 30 * u, base - 50 * u, 16 * u, 12 * u);
    // iglesia con cinco cúpulas
    ctx.fillStyle = '#F2E9DA';
    ctx.fillRect(a.x + a.w * 0.26, base - 150 * u, a.w * 0.48, 112 * u);
    ctx.fillStyle = '#2A1424';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(a.x + a.w * (0.34 + i * 0.13), base - 40 * u);
      ctx.lineTo(a.x + a.w * (0.34 + i * 0.13), base - 100 * u);
      ctx.arc(a.x + a.w * (0.34 + i * 0.13) + 14 * u, base - 100 * u, 14 * u, Math.PI, 0);
      ctx.lineTo(a.x + a.w * (0.34 + i * 0.13) + 28 * u, base - 40 * u);
      ctx.closePath();
      ctx.fill();
    }
    const gd = gold(ctx, a.x, a.x + a.w);
    onion(ctx, a.x + a.w * 0.5, base - 150 * u, 64 * u, 110 * u, '#1F5E4A', gd as unknown as string);
    onion(ctx, a.x + a.w * 0.32, base - 150 * u, 40 * u, 70 * u, '#1F5E4A', gd as unknown as string);
    onion(ctx, a.x + a.w * 0.68, base - 150 * u, 40 * u, 70 * u, '#1F5E4A', gd as unknown as string);
    // estrellas doradas en las cúpulas
    ctx.fillStyle = '#E9C877';
    const r = rng(42);
    for (let i = 0; i < 18; i++) {
      ctx.beginPath();
      ctx.arc(a.x + a.w * (0.42 + r() * 0.16), base - 150 * u - r() * 90 * u, 1.6 * u, 0, Math.PI * 2);
      ctx.fill();
    }
    // tres ventanas encendidas
    [0.36, 0.5, 0.64].forEach((t) => {
      glow(ctx, a.x + a.w * t, base - 70 * u, 30 * u, '255,200,110', 0.6);
    });
    void p;
  },

  // Los demonios: una ciudad de provincias de noche con un incendio que ilumina el cielo.
  demonios: (ctx, a) => {
    const u = U(a);
    sky(ctx, a, '#120B0B', '#5A1E10');
    glow(ctx, a.x + a.w * 0.62, a.y + a.h * 0.7, 300 * u, '255,110,40', 0.55);
    // humo
    for (let k = 0; k < 9; k++) {
      ctx.fillStyle = `rgba(30,22,20,${0.5 - k * 0.04})`;
      ctx.beginPath();
      ctx.arc(a.x + a.w * (0.62 - k * 0.04), a.y + a.h * (0.5 - k * 0.05), (40 + k * 12) * u, 0, Math.PI * 2);
      ctx.fill();
    }
    // llamas
    const base = a.y + a.h * 0.78;
    for (let i = 0; i < 9; i++) {
      const x = a.x + a.w * (0.48 + i * 0.03), h = (40 + ((i * 29) % 60)) * u;
      const g = ctx.createLinearGradient(0, base - h, 0, base);
      g.addColorStop(0, 'rgba(255,220,120,0)');
      g.addColorStop(0.4, '#FFB040');
      g.addColorStop(1, '#D9532B');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x - 14 * u, base);
      ctx.quadraticCurveTo(x - 10 * u, base - h * 0.5, x, base - h);
      ctx.quadraticCurveTo(x + 10 * u, base - h * 0.5, x + 14 * u, base);
      ctx.closePath();
      ctx.fill();
    }
    // casas en silueta
    ctx.fillStyle = '#0A0606';
    const houses = [[0.02, 0.1, 60], [0.12, 0.12, 80], [0.24, 0.1, 54], [0.36, 0.12, 70], [0.5, 0.14, 46], [0.66, 0.1, 64], [0.78, 0.12, 84], [0.9, 0.1, 58]];
    houses.forEach(([x, w, h]) => {
      const X = a.x + a.w * (x as number), W = a.w * (w as number), H = (h as number) * u;
      ctx.fillRect(X, base - H, W, H + a.h);
      ctx.beginPath();
      ctx.moveTo(X - 4 * u, base - H);
      ctx.lineTo(X + W / 2, base - H - 26 * u);
      ctx.lineTo(X + W + 4 * u, base - H);
      ctx.closePath();
      ctx.fill();
    });
    onion(ctx, a.x + a.w * 0.24, base - 54 * u, 26 * u, 60 * u, '#0A0606', '#0A0606');
    ctx.fillRect(a.x, base, a.w, a.h);
    // chispas
    const r = rng(51);
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(255,${180 + r() * 60},90,${0.4 + r() * 0.6})`;
      ctx.beginPath();
      ctx.arc(a.x + a.w * (0.45 + r() * 0.35), a.y + a.h * (0.2 + r() * 0.5), (1 + r() * 2) * u, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // El adolescente: cuaderno abierto, pluma y unas monedas bajo un quinqué.
  adolescente: (ctx, a, p) => {
    const u = U(a);
    sky(ctx, a, '#2E2416', '#5A4A2E');
    glow(ctx, a.x + a.w * 0.72, a.y + a.h * 0.3, 220 * u, '255,210,130', 0.5);
    // quinqué: pie de latón, depósito y tubo de cristal con la llama
    const lx = a.x + a.w * 0.72, ly = a.y + a.h * 0.6;
    ctx.fillStyle = '#A77A2E';
    ctx.beginPath();
    ctx.ellipse(lx, ly, 34 * u, 8 * u, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(lx - 5 * u, ly - 40 * u, 10 * u, 40 * u);
    ctx.fillStyle = '#C9A24E';
    ctx.beginPath();
    ctx.ellipse(lx, ly - 52 * u, 26 * u, 18 * u, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,248,225,0.35)';
    ctx.beginPath();
    ctx.moveTo(lx - 12 * u, ly - 66 * u);
    ctx.quadraticCurveTo(lx - 22 * u, ly - 96 * u, lx - 8 * u, ly - 130 * u);
    ctx.lineTo(lx + 8 * u, ly - 130 * u);
    ctx.quadraticCurveTo(lx + 22 * u, ly - 96 * u, lx + 12 * u, ly - 66 * u);
    ctx.closePath();
    ctx.fill();
    glow(ctx, lx, ly - 92 * u, 90 * u, '255,210,130', 0.7);
    ctx.fillStyle = '#FFE7A8';
    ctx.beginPath();
    ctx.ellipse(lx, ly - 90 * u, 5 * u, 12 * u, 0, 0, Math.PI * 2);
    ctx.fill();
    // mesa
    ctx.fillStyle = '#3A2A18';
    ctx.fillRect(a.x, a.y + a.h * 0.6, a.w, a.h * 0.4);
    // cuaderno abierto
    const cx = a.x + a.w * 0.42, cy = a.y + a.h * 0.72;
    ctx.fillStyle = '#F2EAD8';
    ctx.beginPath();
    ctx.moveTo(cx - 120 * u, cy - 50 * u);
    ctx.lineTo(cx, cy - 40 * u);
    ctx.lineTo(cx + 120 * u, cy - 50 * u);
    ctx.lineTo(cx + 130 * u, cy + 60 * u);
    ctx.lineTo(cx, cy + 70 * u);
    ctx.lineTo(cx - 130 * u, cy + 60 * u);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(40,30,20,0.5)';
    ctx.lineWidth = 1.6 * u;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(cx - 108 * u, cy - 30 * u + i * 16 * u);
      ctx.lineTo(cx - 14 * u, cy - 24 * u + i * 16 * u);
      ctx.moveTo(cx + 14 * u, cy - 24 * u + i * 16 * u);
      ctx.lineTo(cx + (90 - (i % 3) * 20) * u, cy - 30 * u + i * 16 * u);
      ctx.stroke();
    }
    // pluma
    ctx.strokeStyle = p.accent;
    ctx.lineWidth = 3 * u;
    ctx.beginPath();
    ctx.moveTo(cx + 40 * u, cy + 20 * u);
    ctx.quadraticCurveTo(cx + 110 * u, cy - 80 * u, cx + 170 * u, cy - 140 * u);
    ctx.stroke();
    // monedas
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = i % 2 ? '#E9C877' : '#C99A45';
      ctx.beginPath();
      ctx.ellipse(a.x + a.w * 0.16, a.y + a.h * 0.9 - i * 6 * u, 26 * u, 10 * u, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // Pobres gentes: dos ventanas enfrentadas en un patio y una carta que va de una a otra.
  pobres: (ctx, a, p) => {
    const u = U(a);
    sky(ctx, a, '#EDE3CF', '#D5C6A8');
    // dos fachadas
    ctx.fillStyle = '#B9A98A';
    ctx.fillRect(a.x, a.y, a.w * 0.34, a.h);
    ctx.fillRect(a.x + a.w * 0.66, a.y, a.w * 0.34, a.h);
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(a.x + a.w * 0.3, a.y, a.w * 0.04, a.h);
    ctx.fillRect(a.x + a.w * 0.66, a.y, a.w * 0.04, a.h);
    // ventanas enfrentadas, una con cortina y otra con una maceta
    const win = (x: number, y: number) => {
      ctx.fillStyle = '#FFE7B0';
      ctx.fillRect(x, y, 70 * u, 100 * u);
      ctx.strokeStyle = '#5A4630';
      ctx.lineWidth = 5 * u;
      ctx.strokeRect(x, y, 70 * u, 100 * u);
      ctx.beginPath();
      ctx.moveTo(x + 35 * u, y);
      ctx.lineTo(x + 35 * u, y + 100 * u);
      ctx.moveTo(x, y + 45 * u);
      ctx.lineTo(x + 70 * u, y + 45 * u);
      ctx.stroke();
    };
    win(a.x + a.w * 0.1, a.y + a.h * 0.34);
    win(a.x + a.w * 0.74, a.y + a.h * 0.3);
    ctx.fillStyle = p.accent;
    ctx.globalAlpha = 0.7;
    ctx.fillRect(a.x + a.w * 0.74, a.y + a.h * 0.3, 18 * u, 100 * u);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#5A7A3A';
    ctx.beginPath();
    ctx.arc(a.x + a.w * 0.1 + 35 * u, a.y + a.h * 0.34 + 92 * u, 16 * u, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#A3552F';
    ctx.fillRect(a.x + a.w * 0.1 + 24 * u, a.y + a.h * 0.34 + 92 * u, 22 * u, 14 * u);
    // trayectoria punteada de la carta
    ctx.strokeStyle = 'rgba(90,70,48,0.6)';
    ctx.setLineDash([6 * u, 8 * u]);
    ctx.lineWidth = 2.4 * u;
    ctx.beginPath();
    ctx.moveTo(a.x + a.w * 0.24, a.y + a.h * 0.4);
    ctx.quadraticCurveTo(a.x + a.w * 0.5, a.y + a.h * 0.18, a.x + a.w * 0.74, a.y + a.h * 0.36);
    ctx.stroke();
    ctx.setLineDash([]);
    // carta
    const lx = a.x + a.w * 0.5, ly = a.y + a.h * 0.24;
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(-0.12);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-36 * u, -24 * u, 72 * u, 48 * u);
    ctx.strokeStyle = '#8C7A5E';
    ctx.lineWidth = 2 * u;
    ctx.strokeRect(-36 * u, -24 * u, 72 * u, 48 * u);
    ctx.beginPath();
    ctx.moveTo(-36 * u, -24 * u);
    ctx.lineTo(0, 4 * u);
    ctx.lineTo(36 * u, -24 * u);
    ctx.stroke();
    ctx.fillStyle = p.accent;
    ctx.beginPath();
    ctx.arc(0, 6 * u, 7 * u, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // suelo del patio
    ctx.fillStyle = '#9E8E70';
    ctx.fillRect(a.x, a.y + a.h * 0.86, a.w, a.h * 0.14);
  },

  // Memorias de la casa muerta: empalizada de un presidio en la estepa nevada, torre de guardia y cadenas.
  casa: (ctx, a, p) => {
    const u = U(a);
    sky(ctx, a, '#7C8A96', '#C9D1D6');
    snow(ctx, { ...a, h: a.h * 0.6 }, 70, 61);
    const base = a.y + a.h * 0.7;
    ctx.fillStyle = '#EEF1F3';
    ctx.fillRect(a.x, base, a.w, a.h);
    // empalizada en perspectiva ligera
    for (let i = 0; i < 28; i++) {
      const x = a.x + (i / 27) * a.w, h = (120 + (i % 3) * 6) * u;
      ctx.fillStyle = i % 2 ? '#4A3A2C' : '#56443A';
      ctx.beginPath();
      ctx.moveTo(x - 8 * u, base);
      ctx.lineTo(x - 8 * u, base - h);
      ctx.lineTo(x, base - h - 12 * u);
      ctx.lineTo(x + 8 * u, base - h);
      ctx.lineTo(x + 8 * u, base);
      ctx.closePath();
      ctx.fill();
    }
    // torre de guardia
    const tx = a.x + a.w * 0.72;
    ctx.fillStyle = '#3A2E24';
    ctx.fillRect(tx, base - 220 * u, 8 * u, 220 * u);
    ctx.fillRect(tx + 56 * u, base - 220 * u, 8 * u, 220 * u);
    ctx.fillRect(tx - 10 * u, base - 250 * u, 84 * u, 40 * u);
    ctx.beginPath();
    ctx.moveTo(tx - 18 * u, base - 250 * u);
    ctx.lineTo(tx + 32 * u, base - 286 * u);
    ctx.lineTo(tx + 82 * u, base - 250 * u);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#EEF1F3';
    ctx.fillRect(tx - 18 * u, base - 254 * u, 100 * u, 5 * u);
    // cadena en primer plano
    ctx.strokeStyle = '#2A2C30';
    ctx.lineWidth = 6 * u;
    for (let i = 0; i < 7; i++) {
      ctx.beginPath();
      ctx.ellipse(a.x + a.w * 0.08 + i * 40 * u, a.y + a.h * 0.88 + (i % 2 ? 4 : 0) * u, 22 * u, 12 * u, i % 2 ? 0.2 : -0.2, 0, Math.PI * 2);
      ctx.stroke();
    }
    snow(ctx, a, 40, 62);
    void p;
  },

  // El sueño de un hombre ridículo: noche, una estrella enorme y un hombre diminuto que la mira.
  sueno: (ctx, a) => {
    const u = U(a);
    sky(ctx, a, '#070C1C', '#1E2D52');
    stars(ctx, a, 110, 71, '255,248,220', 0.9);
    const sx = a.x + a.w * 0.56, sy = a.y + a.h * 0.32;
    glow(ctx, sx, sy, 180 * u, '255,226,150', 0.5);
    ctx.strokeStyle = 'rgba(255,236,180,0.85)';
    ctx.lineWidth = 2.4 * u;
    for (let k = 0; k < 8; k++) {
      const an = (k * Math.PI) / 4;
      const L = (k % 2 ? 40 : 90) * u;
      ctx.beginPath();
      ctx.moveTo(sx + Math.cos(an) * 10 * u, sy + Math.sin(an) * 10 * u);
      ctx.lineTo(sx + Math.cos(an) * L, sy + Math.sin(an) * L);
      ctx.stroke();
    }
    ctx.fillStyle = '#FFF6D8';
    ctx.beginPath();
    ctx.arc(sx, sy, 11 * u, 0, Math.PI * 2);
    ctx.fill();
    // planeta lejano
    const pg = ctx.createRadialGradient(a.x + a.w * 0.24, a.y + a.h * 0.52, 4 * u, a.x + a.w * 0.24, a.y + a.h * 0.52, 36 * u);
    pg.addColorStop(0, '#9FD3B8');
    pg.addColorStop(1, '#2F6A5A');
    ctx.fillStyle = pg;
    ctx.beginPath();
    ctx.arc(a.x + a.w * 0.24, a.y + a.h * 0.52, 34 * u, 0, Math.PI * 2);
    ctx.fill();
    // tejados y un hombre diminuto en la calle
    const base = a.y + a.h * 0.84;
    ctx.fillStyle = '#0B1020';
    ctx.fillRect(a.x, base, a.w, a.h);
    [[0, 0.22, 70], [0.2, 0.18, 96], [0.36, 0.2, 60], [0.74, 0.26, 88]].forEach(([x, w, h]) => ctx.fillRect(a.x + a.w * (x as number), base - (h as number) * u, a.w * (w as number), (h as number) * u + 2));
    figure(ctx, a.x + a.w * 0.62, base, 40 * u, '#0B1020');
  },

  // El gran inquisidor: bóveda de piedra, una celda con rejas y una vela.
  inquisidor: (ctx, a, p) => {
    const u = U(a);
    sky(ctx, a, '#140C08', '#2E1D12');
    // arcos de piedra
    ctx.strokeStyle = '#4A3424';
    ctx.lineWidth = 16 * u;
    for (let k = 0; k < 3; k++) {
      const r = a.w * (0.48 - k * 0.12);
      ctx.beginPath();
      ctx.arc(a.x + a.w / 2, a.y + a.h * (0.62 + k * 0.03), r, Math.PI, 0);
      ctx.stroke();
    }
    // rejas
    const gx = a.x + a.w * 0.3, gw = a.w * 0.4, gy = a.y + a.h * 0.42, gh = a.h * 0.4;
    glow(ctx, a.x + a.w / 2, gy + gh * 0.5, 160 * u, '255,190,90', 0.35);
    ctx.strokeStyle = '#1A110B';
    ctx.lineWidth = 7 * u;
    for (let i = 0; i <= 6; i++) {
      ctx.beginPath();
      ctx.moveTo(gx + (gw * i) / 6, gy);
      ctx.lineTo(gx + (gw * i) / 6, gy + gh);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(gx, gy + gh * 0.3);
    ctx.lineTo(gx + gw, gy + gh * 0.3);
    ctx.stroke();
    // vela delante
    const vx = a.x + a.w * 0.5, vy = a.y + a.h * 0.9;
    glow(ctx, vx, vy - 60 * u, 120 * u, '255,200,110', 0.6);
    ctx.fillStyle = '#EDE3CC';
    ctx.fillRect(vx - 8 * u, vy - 50 * u, 16 * u, 50 * u);
    ctx.fillStyle = p.accent;
    ctx.beginPath();
    ctx.ellipse(vx, vy - 62 * u, 6 * u, 13 * u, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3A2A1C';
    ctx.fillRect(a.x, vy, a.w, a.h);
  },

  // El doble: dos siluetas idénticas frente a frente bajo una farola, en la niebla.
  doble: (ctx, a) => {
    const u = U(a);
    sky(ctx, a, '#3E4450', '#8E949E');
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = `rgba(230,232,236,${0.08 + i * 0.02})`;
      ctx.fillRect(a.x, a.y + a.h * (0.4 + i * 0.08), a.w, a.h * 0.1);
    }
    const base = a.y + a.h * 0.86;
    ctx.fillStyle = '#2A2E36';
    ctx.fillRect(a.x, base, a.w, a.h);
    glow(ctx, a.x + a.w / 2, a.y + a.h * 0.36, 160 * u, '255,226,160', 0.45);
    ctx.fillStyle = '#1C1F25';
    ctx.fillRect(a.x + a.w / 2 - 3 * u, a.y + a.h * 0.36, 6 * u, base - a.y - a.h * 0.36);
    ctx.fillStyle = '#FFE8B0';
    ctx.fillRect(a.x + a.w / 2 - 9 * u, a.y + a.h * 0.33, 18 * u, 16 * u);
    figure(ctx, a.x + a.w * 0.34, base, 120 * u, '#14161B');
    figure(ctx, a.x + a.w * 0.66, base, 120 * u, '#14161B');
    // reflejo
    ctx.globalAlpha = 0.25;
    ctx.save();
    ctx.translate(0, base * 2);
    ctx.scale(1, -1);
    figure(ctx, a.x + a.w * 0.34, base, 120 * u, '#000');
    figure(ctx, a.x + a.w * 0.66, base, 120 * u, '#000');
    ctx.restore();
    ctx.globalAlpha = 1;
  },

  // Humillados y ofendidos: calle de San Petersburgo con lluvia, una farola y un perro.
  humillados: (ctx, a) => {
    const u = U(a);
    sky(ctx, a, '#3A2E2A', '#7A5E50');
    facade(ctx, a.x, a.y + a.h * 0.2, a.w * 0.5, a.h * 0.7, '#5A463C', '#3A2E28', '#F2C27A', 81, 4, 6, 0.2);
    facade(ctx, a.x + a.w * 0.56, a.y + a.h * 0.28, a.w * 0.44, a.h * 0.62, '#634C40', '#3A2E28', '#F2C27A', 82, 3, 5, 0.25);
    const base = a.y + a.h * 0.86;
    ctx.fillStyle = '#241C18';
    ctx.fillRect(a.x, base, a.w, a.h);
    glow(ctx, a.x + a.w * 0.52, a.y + a.h * 0.5, 120 * u, '255,210,130', 0.5);
    ctx.fillStyle = '#1A1210';
    ctx.fillRect(a.x + a.w * 0.52, a.y + a.h * 0.5, 5 * u, base - a.y - a.h * 0.5);
    figure(ctx, a.x + a.w * 0.36, base, 110 * u, '#120C0A');
    // perro
    ctx.fillStyle = '#120C0A';
    ctx.fillRect(a.x + a.w * 0.44, base - 24 * u, 36 * u, 14 * u);
    ctx.fillRect(a.x + a.w * 0.44 + 30 * u, base - 34 * u, 12 * u, 12 * u);
    ctx.fillRect(a.x + a.w * 0.44 + 2 * u, base - 12 * u, 4 * u, 12 * u);
    ctx.fillRect(a.x + a.w * 0.44 + 28 * u, base - 12 * u, 4 * u, 12 * u);
    rain(ctx, a, 120, 83, 'rgba(230,220,210,0.35)');
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
  const author = (b.author ?? 'Fiódor Dostoievski').toUpperCase();
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
