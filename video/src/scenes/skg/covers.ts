import * as THREE from 'three';
import type { BookDef } from './kit';

// ————————————————————————————————————————————————————————————————
// Cubiertas de la colección del vídeo, dibujadas en canvas: tela de encuadernar, filetes y título en dorado con relieve
// y una ilustración propia en una ventana con arco para cada libro.
// Son diseños inventados para este vídeo: no reproducen ninguna portada ni edición real.
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

const ILL: Record<string, Ill> = {
  resplandor: (ctx, a) => {
    sky(ctx, a, '#0A1322', '#24385A');
    stars(ctx, a, 70, 3);
    moon(ctx, a.x + a.w * 0.76, a.y + a.h * 0.2, 22 * U(a), '#F3EAD2');
    ridge(ctx, a, 0.56, 0.3, 4, '#2B3F5E', 8);
    ridge(ctx, a, 0.66, 0.22, 5, '#1B2A42', 10);
    // hotel
    const hx = a.x + a.w * 0.14, hw = a.w * 0.72, hy = a.y + a.h * 0.6, hh = a.h * 0.24;
    ctx.fillStyle = '#0B111C';
    ctx.beginPath();
    ctx.moveTo(hx, hy + hh);
    ctx.lineTo(hx, hy + hh * 0.25);
    ctx.lineTo(hx + hw * 0.35, hy + hh * 0.25);
    ctx.lineTo(hx + hw * 0.5, hy - hh * 0.2);
    ctx.lineTo(hx + hw * 0.65, hy + hh * 0.25);
    ctx.lineTo(hx + hw, hy + hh * 0.25);
    ctx.lineTo(hx + hw, hy + hh);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#E9EEF5';
    ctx.lineWidth = 3 * U(a);
    ctx.beginPath();
    ctx.moveTo(hx + hw * 0.33, hy + hh * 0.27);
    ctx.lineTo(hx + hw * 0.5, hy - hh * 0.22);
    ctx.lineTo(hx + hw * 0.67, hy + hh * 0.27);
    ctx.stroke();
    const r = rng(9);
    for (let row = 0; row < 3; row++) for (let col = 0; col < 14; col++) {
      const x = hx + hw * 0.04 + col * hw * 0.068, y = hy + hh * 0.36 + row * hh * 0.2;
      const red = row === 1 && col === 10;
      const on = red || r() < 0.55;
      ctx.fillStyle = red ? '#E3463C' : on ? 'rgba(255,212,120,0.95)' : 'rgba(255,212,120,0.12)';
      if (red || on) glow(ctx, x + 4 * U(a), y + 4 * U(a), 14 * U(a), red ? '227,70,60' : '255,200,90', red ? 0.7 : 0.25);
      ctx.fillRect(x, y, 8 * U(a), 9 * U(a));
    }
    ctx.fillStyle = '#E9EEF5';
    ctx.fillRect(a.x, a.y + a.h * 0.86, a.w, a.h * 0.14);
    snow(ctx, a, 90, 6);
  },
  misery: (ctx, a, p) => {
    sky(ctx, a, '#F7F3EA', '#DCD4C3');
    snow(ctx, { ...a, h: a.h * 0.6 }, 50, 7);
    // escritorio y máquina de escribir en tinta
    const u = U(a);
    const cx = a.x + a.w / 2, by = a.y + a.h * 0.78;
    ctx.fillStyle = '#1A1A1A';
    ctx.fillRect(a.x, by + 18 * u, a.w, 6 * u);
    // hoja
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 3 * u;
    ctx.beginPath();
    ctx.rect(cx - 62 * u, by - 150 * u, 124 * u, 110 * u);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(26,26,26,0.55)';
    for (let i = 0; i < 6; i++) ctx.fillRect(cx - 46 * u, by - 132 * u + i * 13 * u, (80 - (i * 17) % 30) * u, 3.5 * u);
    // corazón rojo en la hoja
    ctx.fillStyle = p.accent;
    const hx = cx + 30 * u, hy = by - 64 * u, s = 9 * u;
    ctx.beginPath();
    ctx.moveTo(hx, hy + s);
    ctx.bezierCurveTo(hx - s * 2, hy - s * 0.2, hx - s * 0.9, hy - s * 1.6, hx, hy - s * 0.5);
    ctx.bezierCurveTo(hx + s * 0.9, hy - s * 1.6, hx + s * 2, hy - s * 0.2, hx, hy + s);
    ctx.fill();
    // carro y cuerpo
    ctx.fillStyle = '#1A1A1A';
    ctx.beginPath();
    ctx.roundRect(cx - 96 * u, by - 52 * u, 192 * u, 18 * u, 6 * u);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx - 110 * u, by + 18 * u);
    ctx.lineTo(cx - 92 * u, by - 34 * u);
    ctx.lineTo(cx + 92 * u, by - 34 * u);
    ctx.lineTo(cx + 110 * u, by + 18 * u);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#F2EEE4';
    for (let r = 0; r < 3; r++) for (let k = 0; k < 9 - r; k++) {
      ctx.beginPath();
      ctx.arc(cx - (64 - r * 8) * u + k * 16 * u, by - 18 * u + r * 11 * u, 4 * u, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  milla: (ctx, a) => {
    const u = U(a);
    const vx = a.x + a.w / 2, vy = a.y + a.h * 0.5;
    ctx.fillStyle = '#122218';
    ctx.fillRect(a.x, a.y, a.w, a.h);
    const fw = a.w * 0.14, fh = a.h * 0.16;
    // paredes, techo y suelo
    const quad = (pts: number[][], c: string) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.closePath();
      ctx.fill();
    };
    quad([[a.x, a.y + a.h], [vx - fw, vy + fh], [vx + fw, vy + fh], [a.x + a.w, a.y + a.h]], '#3E7A4F');
    quad([[a.x, a.y], [vx - fw, vy - fh], [vx - fw, vy + fh], [a.x, a.y + a.h]], '#1D3324');
    quad([[a.x + a.w, a.y], [vx + fw, vy - fh], [vx + fw, vy + fh], [a.x + a.w, a.y + a.h]], '#1D3324');
    quad([[a.x, a.y], [vx - fw, vy - fh], [vx + fw, vy - fh], [a.x + a.w, a.y]], '#0E1912');
    // luz al fondo
    glow(ctx, vx, vy, a.w * 0.4, '255,226,160', 0.6);
    ctx.fillStyle = '#F6E3B0';
    ctx.fillRect(vx - fw, vy - fh, fw * 2, fh * 2);
    // barrotes
    ctx.strokeStyle = 'rgba(160,180,165,0.55)';
    for (let i = 0; i < 6; i++) {
      const t = 0.12 + i * 0.13;
      const xl = a.x + (vx - fw - a.x) * t, xr = a.x + a.w - (a.x + a.w - (vx + fw)) * t;
      const yt = a.y + (vy - fh - a.y) * t, yb = a.y + a.h - (a.y + a.h - (vy + fh)) * t;
      ctx.lineWidth = (4 - t * 3) * u;
      for (const x of [xl, xr]) {
        ctx.beginPath();
        ctx.moveTo(x, yt);
        ctx.lineTo(x, yb);
        ctx.stroke();
      }
    }
    // la línea del suelo y dos figuras a contraluz
    ctx.strokeStyle = 'rgba(160,230,170,0.6)';
    ctx.setLineDash([10 * u, 10 * u]);
    ctx.lineWidth = 3 * u;
    ctx.beginPath();
    ctx.moveTo(vx, a.y + a.h);
    ctx.lineTo(vx, vy + fh);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#0B140E';
    const fig = (x: number, hh: number, ww: number) => {
      ctx.beginPath();
      ctx.arc(x, vy + fh - hh * 0.86, hh * 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(x - ww / 2, vy + fh - hh * 0.75, ww, hh * 0.75, ww * 0.3);
      ctx.fill();
    };
    fig(vx - 12 * u, 46 * u, 12 * u);
    fig(vx + 12 * u, 62 * u, 20 * u);
  },
  d2263: (ctx, a, p) => {
    const u = U(a);
    sky(ctx, a, '#F3E7D3', '#E2CDAA');
    // puerta de luz detrás
    glow(ctx, a.x + a.w * 0.5, a.y + a.h * 0.45, a.w * 0.6, '255,236,190', 0.7);
    // hoja de calendario
    const cx = a.x + a.w / 2, cy = a.y + a.h * 0.52;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.06);
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(-118 * u + 8 * u, -140 * u + 10 * u, 236 * u, 270 * u);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-118 * u, -140 * u, 236 * u, 270 * u);
    ctx.fillStyle = p.accent;
    ctx.fillRect(-118 * u, -140 * u, 236 * u, 62 * u);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `700 ${24 * u}px ${SANS}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('NOVIEMBRE 1963', 0, -109 * u);
    ctx.fillStyle = '#1C1C1C';
    ctx.font = `700 ${150 * u}px ${SANS}`;
    ctx.fillText('22', 0, 14 * u);
    ctx.strokeStyle = p.accent;
    ctx.lineWidth = 7 * u;
    ctx.beginPath();
    ctx.ellipse(0, 14 * u, 100 * u, 78 * u, -0.12, 0.2, Math.PI * 2 - 0.1);
    ctx.stroke();
    ctx.fillStyle = 'rgba(28,28,28,0.6)';
    ctx.font = `500 ${22 * u}px ${SANS}`;
    ctx.fillText('viernes', 0, 104 * u);
    ctx.restore();
  },
  mercedes: (ctx, a) => {
    const u = U(a);
    sky(ctx, a, '#1A1B1F', '#3A3C42');
    // niebla
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = `rgba(200,205,215,${0.05 + i * 0.015})`;
      ctx.fillRect(a.x, a.y + a.h * (0.3 + i * 0.12), a.w, a.h * 0.12);
    }
    const y = a.y + a.h * 0.6;
    for (const x of [a.x + a.w * 0.3, a.x + a.w * 0.7]) {
      ctx.fillStyle = 'rgba(255,245,200,0.12)';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - a.w * 0.5, a.y + a.h);
      ctx.lineTo(x + a.w * 0.5, a.y + a.h);
      ctx.closePath();
      ctx.fill();
      glow(ctx, x, y, 90 * u, '255,245,200', 0.85);
      ctx.fillStyle = '#FFFBEA';
      ctx.beginPath();
      ctx.arc(x, y, 20 * u, 0, Math.PI * 2);
      ctx.fill();
    }
    // rejilla del coche
    ctx.fillStyle = 'rgba(10,10,12,0.85)';
    ctx.beginPath();
    ctx.roundRect(a.x + a.w * 0.4, y - 16 * u, a.w * 0.2, 34 * u, 6 * u);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 2 * u;
    for (let i = 1; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(a.x + a.w * 0.4 + i * a.w * 0.033, y - 12 * u);
      ctx.lineTo(a.x + a.w * 0.4 + i * a.w * 0.033, y + 14 * u);
      ctx.stroke();
    }
  },
  carrie: (ctx, a, p) => {
    const u = U(a);
    sky(ctx, a, '#F6E2E5', '#E7BCC4');
    glow(ctx, a.x + a.w / 2, a.y + a.h * 0.6, a.w * 0.5, '255,255,255', 0.5);
    // tiara dorada
    const cx = a.x + a.w / 2, by = a.y + a.h * 0.76;
    ctx.save();
    ctx.translate(cx, by);
    ctx.scale(1.35, 1.35);
    ctx.translate(-cx, -by);
    ctx.fillStyle = gold(ctx, cx - 110 * u, cx + 110 * u);
    ctx.beginPath();
    ctx.moveTo(cx - 120 * u, by);
    ctx.lineTo(cx - 100 * u, by - 70 * u);
    ctx.lineTo(cx - 50 * u, by - 30 * u);
    ctx.lineTo(cx, by - 120 * u);
    ctx.lineTo(cx + 50 * u, by - 30 * u);
    ctx.lineTo(cx + 100 * u, by - 70 * u);
    ctx.lineTo(cx + 120 * u, by);
    ctx.quadraticCurveTo(cx, by - 26 * u, cx - 120 * u, by);
    ctx.fill();
    ctx.fillStyle = '#FFF7E0';
    for (const [x, y, r] of [[0, -112, 9], [-100, -64, 6], [100, -64, 6], [-50, -30, 5], [50, -30, 5]]) {
      ctx.beginPath();
      ctx.arc(cx + x * u, by + y * u, r * u, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    // pintura roja que gotea desde el arco
    const ax = a.x + a.w / 2, ar = a.w / 2;
    const yTop = (x: number) => a.y + ar - Math.sqrt(Math.max(0, ar * ar - (x - ax) * (x - ax)));
    ctx.strokeStyle = p.accent;
    ctx.lineWidth = 26 * u;
    ctx.beginPath();
    ctx.arc(ax, a.y + ar, ar, Math.PI, 0);
    ctx.stroke();
    ctx.fillStyle = p.accent;
    const r = rng(12);
    [0.16, 0.27, 0.36, 0.45, 0.55, 0.63, 0.74, 0.84].forEach((t) => {
      const x = a.x + a.w * t;
      const y = yTop(x) + 8 * u;
      const len = (20 + r() * 80) * u;
      const wd = (5 + r() * 5) * u;
      ctx.beginPath();
      ctx.moveTo(x - wd, y);
      ctx.lineTo(x - wd * 0.7, y + len);
      ctx.arc(x, y + len, wd * 0.7, Math.PI, 0, true);
      ctx.lineTo(x + wd, y);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y + len + wd * 0.2, wd * 1.05, 0, Math.PI * 2);
      ctx.fill();
    });
  },
  elevacion: (ctx, a, p) => {
    const u = U(a);
    sky(ctx, a, '#EAF2FA', '#C6D9EC');
    glow(ctx, a.x + a.w * 0.5, a.y + a.h * 0.35, a.w * 0.45, '255,255,255', 0.7);
    // casas del pueblo
    ctx.fillStyle = mix(p.accent, '#16324F', 0.45);
    ctx.fillRect(a.x, a.y + a.h * 0.86, a.w, a.h * 0.14);
    const rr = rng(17);
    let hx = a.x - 10 * u;
    while (hx < a.x + a.w) {
      const hw = (34 + rr() * 40) * u, hh = (36 + rr() * 50) * u, base = a.y + a.h * 0.88;
      ctx.fillRect(hx, base - hh, hw, hh);
      ctx.beginPath();
      ctx.moveTo(hx - 4 * u, base - hh);
      ctx.lineTo(hx + hw / 2, base - hh - hw * 0.45);
      ctx.lineTo(hx + hw + 4 * u, base - hh);
      ctx.fill();
      if (rr() < 0.5) {
        ctx.fillStyle = '#FFE9A8';
        ctx.fillRect(hx + hw * 0.35, base - hh * 0.6, hw * 0.22, hh * 0.22);
        ctx.fillStyle = mix(p.accent, '#16324F', 0.45);
      }
      hx += hw + (4 + rr() * 10) * u;
    }
    // campanario
    ctx.fillRect(a.x + a.w * 0.62, a.y + a.h * 0.62, 18 * u, a.h * 0.26);
    ctx.beginPath();
    ctx.moveTo(a.x + a.w * 0.62 - 4 * u, a.y + a.h * 0.62);
    ctx.lineTo(a.x + a.w * 0.62 + 9 * u, a.y + a.h * 0.52);
    ctx.lineTo(a.x + a.w * 0.62 + 22 * u, a.y + a.h * 0.62);
    ctx.fill();
    // pluma
    ctx.save();
    ctx.translate(a.x + a.w * 0.52, a.y + a.h * 0.36);
    ctx.rotate(-0.5);
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = p.accent;
    ctx.lineWidth = 2.4 * u;
    ctx.beginPath();
    ctx.moveTo(0, -90 * u);
    ctx.bezierCurveTo(40 * u, -60 * u, 38 * u, 40 * u, 4 * u, 80 * u);
    ctx.bezierCurveTo(-34 * u, 40 * u, -40 * u, -50 * u, 0, -90 * u);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -84 * u);
    ctx.lineTo(4 * u, 110 * u);
    ctx.stroke();
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(1 * u, -60 * u + i * 16 * u);
      ctx.lineTo((i % 2 ? 22 : -22) * u, -48 * u + i * 16 * u);
      ctx.stroke();
    }
    ctx.restore();
  },
  it: (ctx, a, p) => {
    const u = U(a);
    sky(ctx, a, '#2A0508', '#4A0A10');
    rain(ctx, a, 120, 13, 'rgba(255,220,220,0.28)');
    // agua y alcantarilla
    ctx.fillStyle = '#16080A';
    ctx.fillRect(a.x, a.y + a.h * 0.7, a.w, a.h * 0.3);
    ctx.fillStyle = '#050203';
    ctx.beginPath();
    ctx.roundRect(a.x + a.w * 0.62, a.y + a.h * 0.6, a.w * 0.3, a.h * 0.14, 6 * u);
    ctx.fill();
    ctx.strokeStyle = '#3A1418';
    ctx.lineWidth = 4 * u;
    for (let i = 1; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(a.x + a.w * 0.62 + i * a.w * 0.05, a.y + a.h * 0.61);
      ctx.lineTo(a.x + a.w * 0.62 + i * a.w * 0.05, a.y + a.h * 0.73);
      ctx.stroke();
    }
    // barquito de papel
    const bx = a.x + a.w * 0.36, by = a.y + a.h * 0.74;
    ctx.fillStyle = p.accent;
    ctx.beginPath();
    ctx.moveTo(bx - 70 * u, by - 18 * u);
    ctx.lineTo(bx + 70 * u, by - 18 * u);
    ctx.lineTo(bx + 46 * u, by + 10 * u);
    ctx.lineTo(bx - 46 * u, by + 10 * u);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = mix('#F7F1E8', '#C9B9A0', 0.25);
    ctx.beginPath();
    ctx.moveTo(bx - 4 * u, by - 18 * u);
    ctx.lineTo(bx + 2 * u, by - 96 * u);
    ctx.lineTo(bx + 46 * u, by - 18 * u);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = p.accent;
    ctx.beginPath();
    ctx.moveTo(bx - 4 * u, by - 18 * u);
    ctx.lineTo(bx + 2 * u, by - 96 * u);
    ctx.lineTo(bx - 40 * u, by - 18 * u);
    ctx.closePath();
    ctx.fill();
    // ondas
    ctx.strokeStyle = 'rgba(255,220,220,0.35)';
    ctx.lineWidth = 2 * u;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.ellipse(bx, by + 14 * u, (80 + i * 26) * u, (8 + i * 3) * u, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  },
  apocalipsis: (ctx, a, p) => {
    const u = U(a);
    sky(ctx, a, '#2B2D33', '#6B5B57');
    // sol rojo
    glow(ctx, a.x + a.w * 0.5, a.y + a.h * 0.48, a.w * 0.5, '229,72,77', 0.45);
    ctx.fillStyle = p.accent;
    ctx.beginPath();
    ctx.arc(a.x + a.w * 0.5, a.y + a.h * 0.48, 46 * u, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1D1E22';
    ctx.fillRect(a.x, a.y + a.h * 0.56, a.w, a.h * 0.44);
    // carretera hacia el horizonte
    ctx.fillStyle = '#34363C';
    ctx.beginPath();
    ctx.moveTo(a.x + a.w * 0.48, a.y + a.h * 0.56);
    ctx.lineTo(a.x + a.w * 0.52, a.y + a.h * 0.56);
    ctx.lineTo(a.x + a.w * 0.95, a.y + a.h);
    ctx.lineTo(a.x + a.w * 0.05, a.y + a.h);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#E8D59A';
    ctx.lineWidth = 3 * u;
    ctx.setLineDash([16 * u, 18 * u]);
    ctx.beginPath();
    ctx.moveTo(a.x + a.w * 0.5, a.y + a.h * 0.57);
    ctx.lineTo(a.x + a.w * 0.5, a.y + a.h);
    ctx.stroke();
    ctx.setLineDash([]);
    // postes de la luz
    ctx.strokeStyle = '#0E0F12';
    for (let i = 0; i < 5; i++) {
      const t = i / 4;
      const x = a.x + a.w * (0.47 - 0.42 * t), top = a.y + a.h * (0.5 - 0.3 * t), bot = a.y + a.h * (0.57 + 0.3 * t);
      ctx.lineWidth = (2 + 5 * t) * u;
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x, bot);
      ctx.moveTo(x - 14 * u * (0.3 + t), top + 6 * u);
      ctx.lineTo(x + 14 * u * (0.3 + t), top + 6 * u);
      ctx.stroke();
    }
  },
  doctor: (ctx, a, p) => {
    sky(ctx, a, '#0F1828', '#2A3B5A');
    stars(ctx, a, 80, 21);
    moon(ctx, a.x + a.w * 0.68, a.y + a.h * 0.26, 34 * U(a), '#F0E9D6', '#16223A');
    const u = U(a);
    ctx.fillStyle = '#0B1220';
    ctx.fillRect(a.x, a.y + a.h * 0.8, a.w, a.h * 0.2);
    // casa con una ventana encendida
    const hx = a.x + a.w * 0.28, hy = a.y + a.h * 0.6;
    ctx.beginPath();
    ctx.moveTo(hx, hy + 100 * u);
    ctx.lineTo(hx, hy + 20 * u);
    ctx.lineTo(hx + 80 * u, hy - 30 * u);
    ctx.lineTo(hx + 160 * u, hy + 20 * u);
    ctx.lineTo(hx + 160 * u, hy + 100 * u);
    ctx.fill();
    glow(ctx, hx + 80 * u, hy + 50 * u, 60 * u, '255,210,120', 0.5);
    ctx.fillStyle = p.accent;
    ctx.fillStyle = '#FFD27A';
    ctx.fillRect(hx + 68 * u, hy + 34 * u, 24 * u, 28 * u);
  },
  cuento: (ctx, a, p) => {
    const u = U(a);
    sky(ctx, a, '#2A1850', '#5A3A92');
    stars(ctx, a, 60, 31, '247,233,198');
    // pozo con escalera de caracol
    const cx = a.x + a.w / 2, cy = a.y + a.h * 0.72;
    ctx.fillStyle = '#140A26';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 120 * u, 40 * u, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(242,201,76,0.6)';
    ctx.lineWidth = 3 * u;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.ellipse(cx, cy + i * 3 * u, (110 - i * 20) * u, (34 - i * 6) * u, 0, 0.2 + i * 0.5, Math.PI + i * 0.5);
      ctx.stroke();
    }
    // llave dorada
    ctx.save();
    ctx.translate(cx, a.y + a.h * 0.34);
    ctx.rotate(-0.35);
    ctx.strokeStyle = gold(ctx, -90 * u, 90 * u);
    ctx.lineWidth = 9 * u;
    ctx.beginPath();
    ctx.arc(-60 * u, 0, 30 * u, 0, Math.PI * 2);
    ctx.moveTo(-30 * u, 0);
    ctx.lineTo(90 * u, 0);
    ctx.moveTo(60 * u, 0);
    ctx.lineTo(60 * u, 22 * u);
    ctx.moveTo(84 * u, 0);
    ctx.lineTo(84 * u, 18 * u);
    ctx.stroke();
    ctx.restore();
    glow(ctx, cx, a.y + a.h * 0.34, 110 * u, '242,201,76', 0.25);
    void p;
  },
  holly: (ctx, a, p) => {
    const u = U(a);
    sky(ctx, a, '#FBFAF6', '#E8E4DA');
    ctx.fillStyle = 'rgba(16,16,16,0.07)';
    const r = rng(41);
    for (let gx = 0; gx < 7; gx++) for (let gy = 0; gy < 8; gy++) {
      if (r() < 0.15) continue;
      ctx.fillRect(a.x + 8 * u + gx * 62 * u, a.y + 8 * u + gy * 62 * u, 50 * u, 50 * u);
    }
    ctx.strokeStyle = 'rgba(36,87,197,0.35)';
    ctx.lineWidth = 6 * u;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y + a.h * 0.7);
    ctx.bezierCurveTo(a.x + a.w * 0.3, a.y + a.h * 0.6, a.x + a.w * 0.6, a.y + a.h * 0.9, a.x + a.w, a.y + a.h * 0.75);
    ctx.stroke();
    const cx = a.x + a.w * 0.45, cy = a.y + a.h * 0.46;
    ctx.fillStyle = 'rgba(36,87,197,0.12)';
    ctx.beginPath();
    ctx.arc(cx, cy, 80 * u, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = p.accent;
    ctx.lineWidth = 12 * u;
    ctx.stroke();
    ctx.lineWidth = 20 * u;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx + 62 * u, cy + 62 * u);
    ctx.lineTo(cx + 140 * u, cy + 140 * u);
    ctx.stroke();
    ctx.lineCap = 'butt';
    ctx.fillStyle = '#C1121F';
    ctx.beginPath();
    ctx.arc(cx - 10 * u, cy + 6 * u, 9 * u, 0, Math.PI * 2);
    ctx.fill();
  },
  visitante: (ctx, a, p) => {
    const u = U(a);
    sky(ctx, a, '#1C130E', '#4A3426');
    const cx = a.x + a.w / 2, cy = a.y + a.h * 0.42;
    glow(ctx, cx, cy, 140 * u, '242,201,76', 0.35);
    ctx.fillStyle = p.accent;
    ctx.beginPath();
    ctx.moveTo(cx - 120 * u, cy);
    ctx.quadraticCurveTo(cx, cy - 80 * u, cx + 120 * u, cy);
    ctx.quadraticCurveTo(cx, cy + 80 * u, cx - 120 * u, cy);
    ctx.fill();
    ctx.fillStyle = '#1C130E';
    ctx.beginPath();
    ctx.arc(cx, cy, 36 * u, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.accent;
    ctx.beginPath();
    ctx.arc(cx + 10 * u, cy - 10 * u, 8 * u, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#120B07';
    ctx.fillRect(a.x, a.y + a.h * 0.78, a.w, a.h * 0.22);
  },
  quien: (ctx, a, p) => {
    const u = U(a);
    sky(ctx, a, '#0B2D2F', '#1C5154');
    const cx = a.x + a.w / 2, by = a.y + a.h * 0.8;
    // libretas apiladas
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = i % 2 ? '#2A1C12' : '#3A2818';
      ctx.fillRect(cx - (110 - i * 4) * u, by - (i + 1) * 26 * u, (220 - i * 8) * u, 22 * u);
      ctx.fillStyle = p.accent;
      ctx.fillRect(cx + (70 - i * 4) * u, by - (i + 1) * 26 * u, 6 * u, 22 * u);
    }
    glow(ctx, cx, by - 170 * u, 100 * u, '242,201,76', 0.3);
  },
  fin: (ctx, a, p) => {
    const u = U(a);
    sky(ctx, a, '#1E1F22', '#2E3034');
    ctx.strokeStyle = 'rgba(111,211,154,0.18)';
    ctx.lineWidth = 1.5 * u;
    for (let x = 0; x < a.w; x += 24 * u) {
      ctx.beginPath();
      ctx.moveTo(a.x + x, a.y);
      ctx.lineTo(a.x + x, a.y + a.h);
      ctx.stroke();
    }
    for (let y = 0; y < a.h; y += 24 * u) {
      ctx.beginPath();
      ctx.moveTo(a.x, a.y + y);
      ctx.lineTo(a.x + a.w, a.y + y);
      ctx.stroke();
    }
    const y0 = a.y + a.h * 0.55;
    ctx.strokeStyle = p.accent;
    ctx.lineWidth = 6 * u;
    ctx.shadowColor = p.accent;
    ctx.shadowBlur = 18 * u;
    ctx.beginPath();
    const pts = [[0, 0], [0.3, 0], [0.36, -0.06], [0.42, 0.04], [0.48, -0.32], [0.55, 0.22], [0.6, 0], [1, 0]];
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(a.x + a.w * x, y0 + a.h * y) : ctx.moveTo(a.x + a.w * x, y0 + a.h * y)));
    ctx.stroke();
    ctx.shadowBlur = 0;
  },
  christine: (ctx, a, p) => {
    const u = U(a);
    sky(ctx, a, '#1B0604', '#4A0F0A');
    ctx.fillStyle = '#100403';
    ctx.fillRect(a.x, a.y + a.h * 0.74, a.w, a.h * 0.26);
    const cx = a.x + a.w / 2, by = a.y + a.h * 0.74;
    ctx.fillStyle = '#0A0202';
    ctx.beginPath();
    ctx.moveTo(cx - 170 * u, by);
    ctx.lineTo(cx - 160 * u, by - 40 * u);
    ctx.lineTo(cx - 90 * u, by - 56 * u);
    ctx.lineTo(cx - 50 * u, by - 100 * u);
    ctx.lineTo(cx + 60 * u, by - 100 * u);
    ctx.lineTo(cx + 110 * u, by - 56 * u);
    ctx.lineTo(cx + 170 * u, by - 46 * u);
    ctx.lineTo(cx + 176 * u, by);
    ctx.closePath();
    ctx.fill();
    for (const x of [cx - 160 * u, cx + 168 * u]) {
      glow(ctx, x, by - 26 * u, 60 * u, x < cx ? '255,60,40' : '255,240,200', 0.8);
    }
    ctx.fillStyle = p.accent;
    for (const x of [cx - 110 * u, cx + 120 * u]) {
      ctx.beginPath();
      ctx.arc(x, by, 24 * u, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  dolores: (ctx, a) => {
    const u = U(a);
    sky(ctx, a, '#1A2733', '#5E7486');
    moon(ctx, a.x + a.w * 0.5, a.y + a.h * 0.32, 44 * u, '#0E141A');
    ctx.strokeStyle = '#E9D9A6';
    ctx.lineWidth = 4 * u;
    ctx.beginPath();
    ctx.arc(a.x + a.w * 0.5, a.y + a.h * 0.32, 46 * u, 0, Math.PI * 2);
    ctx.stroke();
    glow(ctx, a.x + a.w * 0.5, a.y + a.h * 0.32, 90 * u, '233,217,166', 0.4);
    ctx.fillStyle = '#26394A';
    ctx.fillRect(a.x, a.y + a.h * 0.62, a.w, a.h * 0.38);
    ctx.strokeStyle = 'rgba(233,217,166,0.35)';
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(a.x + a.w * 0.3 + i * 4 * u, a.y + a.h * (0.66 + i * 0.05));
      ctx.lineTo(a.x + a.w * 0.7 - i * 4 * u, a.y + a.h * (0.66 + i * 0.05));
      ctx.stroke();
    }
  },
  gerald: (ctx, a, p) => {
    const u = U(a);
    sky(ctx, a, '#2A0E16', '#5B2333');
    glow(ctx, a.x + a.w / 2, a.y + a.h * 0.5, a.w * 0.5, '233,217,166', 0.18);
    const cx = a.x + a.w / 2, cy = a.y + a.h * 0.56;
    const g = gold(ctx, cx - 140 * u, cx + 140 * u);
    ctx.strokeStyle = g;
    ctx.fillStyle = g;
    for (const sx of [-1, 1]) {
      const x = cx + sx * 78 * u;
      ctx.lineWidth = 14 * u;
      ctx.beginPath();
      ctx.arc(x, cy + 20 * u, 46 * u, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillRect(x - 16 * u, cy - 44 * u, 32 * u, 26 * u);
    }
    ctx.lineWidth = 6 * u;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.ellipse(cx - 26 * u + i * 26 * u, cy - 44 * u, 12 * u, 7 * u, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    void p;
  },
  billy: (ctx, a) => {
    const u = U(a);
    sky(ctx, a, '#1C2420', '#3E4D3C');
    const cx = a.x + a.w / 2, cy = a.y + a.h * 0.48;
    ctx.strokeStyle = '#E8D59A';
    ctx.lineWidth = 5 * u;
    ctx.beginPath();
    ctx.arc(cx, cy, 90 * u, 0, Math.PI * 2);
    ctx.moveTo(cx - 120 * u, cy);
    ctx.lineTo(cx + 120 * u, cy);
    ctx.moveTo(cx, cy - 120 * u);
    ctx.lineTo(cx, cy + 120 * u);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 30 * u, 0, Math.PI * 2);
    ctx.stroke();
  },
  cuatro: (ctx, a) => {
    const cols = ['#9CC7A4', '#F2C94C', '#D9823B', '#B9D4EA'];
    const w2 = a.w / 2, h2 = a.h / 2;
    cols.forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.fillRect(a.x + (i % 2) * w2, a.y + Math.floor(i / 2) * h2, w2, h2);
    });
    const u = U(a);
    const c = (i: number) => [a.x + (i % 2) * w2 + w2 / 2, a.y + Math.floor(i / 2) * h2 + h2 * 0.62];
    ctx.fillStyle = '#FFFFFF';
    // primavera: flor
    let [x, y] = c(0);
    for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.arc(x + Math.cos(k * 1.256) * 16 * u, y + Math.sin(k * 1.256) * 16 * u, 11 * u, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = '#F2C94C'; ctx.beginPath(); ctx.arc(x, y, 8 * u, 0, Math.PI * 2); ctx.fill();
    // verano: sol
    [x, y] = c(1);
    ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(x, y, 20 * u, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 5 * u;
    for (let k = 0; k < 8; k++) { const an = k * Math.PI / 4; ctx.beginPath(); ctx.moveTo(x + Math.cos(an) * 28 * u, y + Math.sin(an) * 28 * u); ctx.lineTo(x + Math.cos(an) * 40 * u, y + Math.sin(an) * 40 * u); ctx.stroke(); }
    // otoño: hoja
    [x, y] = c(2);
    ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.moveTo(x, y - 34 * u); ctx.quadraticCurveTo(x + 34 * u, y - 4 * u, x, y + 30 * u); ctx.quadraticCurveTo(x - 34 * u, y - 4 * u, x, y - 34 * u); ctx.fill();
    // invierno: copo
    [x, y] = c(3);
    ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 5 * u;
    for (let k = 0; k < 3; k++) { const an = k * Math.PI / 3; ctx.beginPath(); ctx.moveTo(x - Math.cos(an) * 32 * u, y - Math.sin(an) * 32 * u); ctx.lineTo(x + Math.cos(an) * 32 * u, y + Math.sin(an) * 32 * u); ctx.stroke(); }
    ctx.fillStyle = '#2A2A2A';
    ctx.fillRect(a.x + w2 - 3, a.y, 6, a.h);
    ctx.fillRect(a.x, a.y + h2 - 3, a.w, 6);
  },
  umbral: (ctx, a) => {
    const u = U(a);
    sky(ctx, a, '#141A22', '#2A3644');
    const cx = a.x + a.w / 2, by = a.y + a.h * 0.86;
    glow(ctx, cx + 20 * u, by - 110 * u, 160 * u, '157,184,226', 0.55);
    ctx.fillStyle = '#DCE6F5';
    ctx.fillRect(cx - 60 * u, by - 240 * u, 120 * u, 240 * u);
    ctx.fillStyle = '#0A0E14';
    ctx.beginPath();
    ctx.moveTo(cx - 60 * u, by - 240 * u);
    ctx.lineTo(cx + 30 * u, by - 220 * u);
    ctx.lineTo(cx + 30 * u, by + 10 * u);
    ctx.lineTo(cx - 60 * u, by);
    ctx.closePath();
    ctx.fill();
  },
  oscuridad: (ctx, a, p) => {
    sky(ctx, a, '#050505', '#1A1A1A');
    stars(ctx, a, 30, 61);
    glow(ctx, a.x + a.w * 0.5, a.y + a.h * 0.55, a.w * 0.3, '193,18,31', 0.5);
    ctx.fillStyle = p.accent;
    ctx.beginPath();
    ctx.arc(a.x + a.w * 0.5, a.y + a.h * 0.55, 10 * U(a), 0, Math.PI * 2);
    ctx.fill();
  },
  salem: (ctx, a, p) => {
    const u = U(a);
    sky(ctx, a, '#14171B', '#3A3F46');
    moon(ctx, a.x + a.w * 0.7, a.y + a.h * 0.24, 40 * u, '#ECE3CE');
    ctx.fillStyle = '#0B0D10';
    ctx.beginPath();
    ctx.moveTo(a.x, a.y + a.h);
    ctx.quadraticCurveTo(a.x + a.w * 0.4, a.y + a.h * 0.56, a.x + a.w, a.y + a.h * 0.8);
    ctx.lineTo(a.x + a.w, a.y + a.h);
    ctx.fill();
    const hx = a.x + a.w * 0.3, hy = a.y + a.h * 0.6;
    ctx.beginPath();
    ctx.moveTo(hx - 60 * u, hy + 20 * u);
    ctx.lineTo(hx - 60 * u, hy - 50 * u);
    ctx.lineTo(hx, hy - 100 * u);
    ctx.lineTo(hx + 60 * u, hy - 50 * u);
    ctx.lineTo(hx + 60 * u, hy + 20 * u);
    ctx.fill();
    ctx.fillStyle = p.accent;
    ctx.fillRect(hx - 8 * u, hy - 40 * u, 16 * u, 20 * u);
    ctx.fillStyle = '#0B0D10';
    const r = rng(71);
    for (let i = 0; i < 5; i++) {
      const bx = a.x + a.w * (0.5 + r() * 0.4), by = a.y + a.h * (0.12 + r() * 0.3), s = (8 + r() * 6) * u;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.quadraticCurveTo(bx - s, by - s * 0.8, bx - s * 2, by);
      ctx.quadraticCurveTo(bx - s, by - s * 0.2, bx, by + s * 0.3);
      ctx.quadraticCurveTo(bx + s, by - s * 0.2, bx + s * 2, by);
      ctx.quadraticCurveTo(bx + s, by - s * 0.8, bx, by);
      ctx.fill();
    }
  },
  mientras: (ctx, a, p) => {
    const u = U(a);
    sky(ctx, a, '#FFFFFF', '#F1EEE6');
    ctx.strokeStyle = 'rgba(16,16,16,0.12)';
    ctx.lineWidth = 2 * u;
    for (let y = a.y + 40 * u; y < a.y + a.h; y += 30 * u) {
      ctx.beginPath();
      ctx.moveTo(a.x, y);
      ctx.lineTo(a.x + a.w, y);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(16,16,16,0.7)';
    for (let i = 0; i < 6; i++) ctx.fillRect(a.x + 40 * u, a.y + 56 * u + i * 30 * u, (180 + (i * 53) % 120) * u, 5 * u);
    ctx.save();
    ctx.translate(a.x + a.w * 0.62, a.y + a.h * 0.62);
    ctx.rotate(-0.7);
    ctx.fillStyle = p.accent;
    ctx.fillRect(-150 * u, -14 * u, 250 * u, 28 * u);
    ctx.fillStyle = '#F2D9A0';
    ctx.beginPath();
    ctx.moveTo(100 * u, -14 * u);
    ctx.lineTo(150 * u, 0);
    ctx.lineTo(100 * u, 14 * u);
    ctx.fill();
    ctx.fillStyle = '#101010';
    ctx.beginPath();
    ctx.moveTo(136 * u, -4 * u);
    ctx.lineTo(150 * u, 0);
    ctx.lineTo(136 * u, 4 * u);
    ctx.fill();
    ctx.fillStyle = '#E58A9A';
    ctx.fillRect(-170 * u, -14 * u, 20 * u, 28 * u);
    ctx.restore();
  },
  bachman: (ctx, a) => {
    const u = U(a);
    sky(ctx, a, '#DAD3C6', '#B9B0A0');
    const cx = a.x + a.w / 2, cy = a.y + a.h * 0.5;
    ctx.fillStyle = '#1D1D1D';
    ctx.beginPath();
    ctx.moveTo(cx - 130 * u, cy - 20 * u);
    ctx.quadraticCurveTo(cx - 60 * u, cy - 70 * u, cx, cy - 10 * u);
    ctx.quadraticCurveTo(cx + 60 * u, cy - 70 * u, cx + 130 * u, cy - 20 * u);
    ctx.quadraticCurveTo(cx + 120 * u, cy + 60 * u, cx + 50 * u, cy + 50 * u);
    ctx.quadraticCurveTo(cx, cy + 40 * u, cx, cy + 20 * u);
    ctx.quadraticCurveTo(cx, cy + 40 * u, cx - 50 * u, cy + 50 * u);
    ctx.quadraticCurveTo(cx - 120 * u, cy + 60 * u, cx - 130 * u, cy - 20 * u);
    ctx.fill();
    ctx.fillStyle = '#DAD3C6';
    for (const x of [-56, 56]) {
      ctx.beginPath();
      ctx.ellipse(cx + x * u, cy + 4 * u, 26 * u, 14 * u, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  },
};

// La Torre Oscura: un mismo paisaje con el cielo de cada volumen.
const TOWER_SKY: Record<number, [string, string]> = {
  1: ['#3A1E14', '#D9823B'], 2: ['#10263A', '#5C93A8'], 3: ['#1E1E2E', '#7C6A8E'], 4: ['#0E2A1E', '#5FA37C'],
  5: ['#2A1A0E', '#C9A45A'], 6: ['#24102A', '#B0577A'], 7: ['#120A1A', '#C1121F'],
};
const tower: Ill = (ctx, a, p) => {
  const u = U(a);
  const n = (p as Pal & { num?: number }).num ?? 1;
  const [top, bottom] = TOWER_SKY[n] ?? TOWER_SKY[1];
  sky(ctx, a, top, bottom);
  stars(ctx, a, 40, 80 + n, '255,240,220', 0.35);
  glow(ctx, a.x + a.w * 0.5, a.y + a.h * 0.62, a.w * 0.5, '255,220,170', 0.25);
  // llanura con rosas
  ctx.fillStyle = '#120A10';
  ctx.fillRect(a.x, a.y + a.h * 0.68, a.w, a.h * 0.32);
  const r = rng(90 + n);
  for (let i = 0; i < 60; i++) {
    ctx.fillStyle = `rgba(193,18,31,${0.5 + r() * 0.5})`;
    ctx.beginPath();
    ctx.arc(a.x + r() * a.w, a.y + a.h * (0.72 + r() * 0.26), (2 + r() * 3.5) * u, 0, Math.PI * 2);
    ctx.fill();
  }
  // torre: fuste negro que se estrecha, con remate dentado y una ventana encendida
  const cx = a.x + a.w * 0.5, by = a.y + a.h * 0.7;
  ctx.fillStyle = '#07040A';
  ctx.beginPath();
  ctx.moveTo(cx - 46 * u, by);
  ctx.quadraticCurveTo(cx - 30 * u, by - 60 * u, cx - 26 * u, by - 250 * u);
  ctx.lineTo(cx - 34 * u, by - 262 * u);
  ctx.lineTo(cx - 24 * u, by - 268 * u);
  ctx.lineTo(cx - 20 * u, by - 290 * u);
  ctx.lineTo(cx - 10 * u, by - 276 * u);
  ctx.lineTo(cx - 2 * u, by - 304 * u);
  ctx.lineTo(cx + 8 * u, by - 278 * u);
  ctx.lineTo(cx + 18 * u, by - 292 * u);
  ctx.lineTo(cx + 24 * u, by - 268 * u);
  ctx.lineTo(cx + 34 * u, by - 262 * u);
  ctx.lineTo(cx + 26 * u, by - 250 * u);
  ctx.quadraticCurveTo(cx + 30 * u, by - 60 * u, cx + 46 * u, by);
  ctx.closePath();
  ctx.fill();
  // ventanas en espiral
  for (let i = 0; i < 6; i++) {
    const t = i / 5;
    const wx = cx + Math.sin(i * 1.9) * (14 - t * 6) * u;
    ctx.fillStyle = i === 5 ? '#FFD27A' : 'rgba(255,210,122,0.28)';
    ctx.fillRect(wx - 3 * u, by - (40 + i * 40) * u, 6 * u, 11 * u);
  }
  glow(ctx, cx, by - 240 * u, 30 * u, '255,210,122', 0.5);
};

// ———————————————— Cubierta completa ————————————————
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
  const author = (b.author ?? 'Stephen King').toUpperCase();
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
  const ill = ILL[key] ?? (key.startsWith('torre') ? tower : null);
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
export const HAS_ILLUSTRATION = (key: string) => key in ILL || key.startsWith('torre');

// ———————————————— Fotogramas ilustrados de las películas (16:9) ————————————————
// Escenas propias que evocan cada historia sin reproducir carteles, fotogramas ni actores.
const STILLS: Record<string, (ctx: Ctx, a: Win) => void> = {
  // Cadena perpetua: muro de la prisión de noche, torre de vigilancia con foco y lluvia.
  cadena: (ctx, a) => {
    const u = a.w / 640;
    sky(ctx, a, '#0C1218', '#283543');
    rain(ctx, a, 220, 5, 'rgba(210,225,240,0.25)');
    // haz del foco
    ctx.fillStyle = 'rgba(255,245,215,0.14)';
    ctx.beginPath();
    ctx.moveTo(a.x + a.w * 0.72, a.y + a.h * 0.28);
    ctx.lineTo(a.x + a.w * 0.12, a.y + a.h * 0.86);
    ctx.lineTo(a.x + a.w * 0.36, a.y + a.h * 0.96);
    ctx.closePath();
    ctx.fill();
    // muro
    ctx.fillStyle = '#1A2129';
    ctx.fillRect(a.x, a.y + a.h * 0.46, a.w, a.h * 0.54);
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 2 * u;
    for (let y = 0; y < 8; y++) for (let x = 0; x < 16; x++) ctx.strokeRect(a.x + x * 44 * u + (y % 2) * 22 * u, a.y + a.h * 0.46 + y * 24 * u, 44 * u, 24 * u);
    // torre
    ctx.fillStyle = '#0D1117';
    ctx.fillRect(a.x + a.w * 0.66, a.y + a.h * 0.26, a.w * 0.12, a.h * 0.3);
    ctx.fillRect(a.x + a.w * 0.64, a.y + a.h * 0.22, a.w * 0.16, a.h * 0.06);
    glow(ctx, a.x + a.w * 0.72, a.y + a.h * 0.28, 60 * u, '255,245,215', 0.8);
    // alambrada
    ctx.strokeStyle = 'rgba(10,12,16,0.9)';
    ctx.lineWidth = 2 * u;
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      ctx.arc(a.x + i * 18 * u, a.y + a.h * 0.45, 9 * u, 0, Math.PI * 2);
      ctx.stroke();
    }
  },
  // Cuenta conmigo: vía del tren que se pierde en el bosque al atardecer.
  cuenta: (ctx, a) => {
    const u = a.w / 640;
    sky(ctx, a, '#F2B25C', '#F7DCA4');
    glow(ctx, a.x + a.w * 0.5, a.y + a.h * 0.46, a.w * 0.4, '255,240,200', 0.8);
    ridge(ctx, a, 0.58, 0.18, 11, '#5C6B3A', 14);
    // pinos a los lados
    const pine = (x: number, base: number, h: number) => {
      ctx.fillStyle = '#26301A';
      ctx.beginPath();
      ctx.moveTo(x, base - h);
      ctx.lineTo(x - h * 0.28, base);
      ctx.lineTo(x + h * 0.28, base);
      ctx.closePath();
      ctx.fill();
    };
    for (let i = 0; i < 9; i++) {
      pine(a.x + a.w * (0.02 + i * 0.045), a.y + a.h * 0.62 + i * 6 * u, (120 - i * 8) * u);
      pine(a.x + a.w * (0.98 - i * 0.045), a.y + a.h * 0.62 + i * 6 * u, (120 - i * 8) * u);
    }
    ctx.fillStyle = '#3B3A2A';
    ctx.fillRect(a.x, a.y + a.h * 0.6, a.w, a.h * 0.4);
    // vía
    const vx = a.x + a.w * 0.5, vy = a.y + a.h * 0.58;
    ctx.fillStyle = '#6B5A44';
    ctx.beginPath();
    ctx.moveTo(vx - 4 * u, vy);
    ctx.lineTo(vx + 4 * u, vy);
    ctx.lineTo(a.x + a.w * 0.8, a.y + a.h);
    ctx.lineTo(a.x + a.w * 0.2, a.y + a.h);
    ctx.closePath();
    ctx.fill();
    for (let i = 0; i < 18; i++) {
      const t = Math.pow(i / 18, 2);
      const y = vy + (a.y + a.h - vy) * t;
      const hw = (4 + (a.w * 0.26) * t) * 1.1;
      ctx.fillStyle = '#3A2A1C';
      ctx.fillRect(vx - hw, y, hw * 2, Math.max(1, 10 * u * t));
    }
    ctx.strokeStyle = '#B8B2A6';
    ctx.lineWidth = 3 * u;
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(vx + s * 2 * u, vy);
      ctx.lineTo(vx + s * a.w * 0.2, a.y + a.h);
      ctx.stroke();
    }
  },
  // La milla verde: el pasillo, reutilizando la ilustración de la cubierta.
  milla: (ctx, a) => ILL.milla(ctx, a, { bg: '#2D5A3D', fg: '#F2EEDC', accent: '#E8D59A', foil: '#E8D59A', light: false, ink: '#F2EEDC' }),
};
const stillCache = new Map<string, string>();
export const stillURL = (key: string, w = 900) => {
  const id = `${key}-${w}`;
  let u = stillCache.get(id);
  if (!u) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = Math.round((w * 9) / 16);
    const ctx = c.getContext('2d')!;
    STILLS[key](ctx, { x: 0, y: 0, w: c.width, h: c.height });
    // viñeta y grano de película
    const v = ctx.createRadialGradient(c.width / 2, c.height / 2, c.height * 0.3, c.width / 2, c.height / 2, c.width * 0.62);
    v.addColorStop(0, 'rgba(0,0,0,0)');
    v.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, c.width, c.height);
    u = c.toDataURL('image/jpeg', 0.92);
    stillCache.set(id, u);
  }
  return u;
};
