import React, { useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { canvasTex, clothNoise, fitFont, rng, SANS, SERIF, shade } from './lib3d';

// ————————————————————————————————————————————————————————————————
// Libros 3D de encuadernación propia (tela, dorados en relieve, cantos de papel).
// Diseño de colección inventado: ni portadas ni lomos reales de ninguna edición.
// ————————————————————————————————————————————————————————————————

export type ShelfBook = {
  title: string; thick: number; h: number; depth: number; cloth: string; foil: 'gold' | 'cream' | 'red' | 'silver'; variant: 0 | 1 | 2 | 3; seed: number;
  author?: string; band?: string;
};

const PX = 46; // píxeles de textura por centímetro de libro

const foilGrad = (ctx: CanvasRenderingContext2D, foil: ShelfBook['foil'], x0: number, x1: number) => {
  const g = ctx.createLinearGradient(x0, 0, x1, 0);
  const stops: Record<ShelfBook['foil'], string[]> = {
    gold: ['#8C6A2C', '#E9C877', '#FFF0B8', '#C99A45', '#7E5C22'],
    cream: ['#CFC6B2', '#F3ECDD', '#FFFFFF', '#E6DDCA', '#BDB39C'],
    red: ['#7A0A12', '#C1121F', '#E5484D', '#A50F1A', '#6A0810'],
    silver: ['#8D939B', '#D9DEE4', '#FFFFFF', '#B9BFC7', '#7C838C'],
  };
  stops[foil].forEach((c, i, a) => g.addColorStop(i / (a.length - 1), c));
  return g;
};

// Dibuja los motivos dorados del lomo; `mask` = true pinta la máscara (blanco donde hay dorado).
const drawSpineArt = (ctx: CanvasRenderingContext2D, b: ShelfBook, w: number, h: number, mask: boolean) => {
  const ink = (x0: number, x1: number) => (mask ? '#FFFFFF' : foilGrad(ctx, b.foil, x0, x1));
  const author = (b.author ?? 'Stephen King').toUpperCase();
  // Bandas
  const bands = (y: number, dir: 1 | -1) => {
    ctx.fillStyle = ink(0, w);
    ctx.fillRect(w * 0.08, y, w * 0.84, Math.max(2, h * 0.004));
    ctx.fillRect(w * 0.08, y + dir * h * 0.012, w * 0.84, Math.max(1.5, h * 0.0022));
  };
  if (b.variant === 0) {
    bands(h * 0.055, 1);
    bands(h * 0.94, -1);
  } else if (b.variant === 1) {
    // Tejuelo: rectángulo de color con el título en tinta oscura
    if (!mask) {
      ctx.fillStyle = b.band ?? shade(b.cloth, 0.55);
      ctx.fillRect(w * 0.1, h * 0.24, w * 0.8, h * 0.5);
    }
    ctx.strokeStyle = mask ? '#FFFFFF' : foilGrad(ctx, b.foil, 0, w);
    ctx.lineWidth = Math.max(2, w * 0.025);
    ctx.strokeRect(w * 0.1, h * 0.24, w * 0.8, h * 0.5);
    bands(h * 0.06, 1);
  } else if (b.variant === 2) {
    // Bloque superior más oscuro y filete fino alrededor
    if (!mask) {
      ctx.fillStyle = shade(b.cloth, 0.7);
      ctx.fillRect(0, 0, w, h * 0.2);
    }
    ctx.fillStyle = ink(0, w);
    ctx.fillRect(0, h * 0.2, w, Math.max(2, h * 0.004));
    ctx.strokeStyle = mask ? '#FFFFFF' : foilGrad(ctx, b.foil, 0, w);
    ctx.lineWidth = Math.max(1.5, w * 0.012);
    ctx.strokeRect(w * 0.12, h * 0.23, w * 0.76, h * 0.71);
  } else {
    // Nervios (relieves horizontales) como un clásico encuadernado
    for (const y of [0.12, 0.2, 0.8, 0.88]) {
      if (!mask) {
        const g = ctx.createLinearGradient(0, h * y - 8, 0, h * y + 8);
        g.addColorStop(0, 'rgba(0,0,0,0)');
        g.addColorStop(0.45, 'rgba(255,255,255,0.12)');
        g.addColorStop(0.55, 'rgba(0,0,0,0.35)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, h * y - 8, w, 16);
      }
      ctx.fillStyle = ink(0, w);
      ctx.fillRect(w * 0.06, h * y - 1, w * 0.88, 2);
    }
  }
  // Título (de arriba abajo, como las ediciones españolas modernas)
  ctx.save();
  const ty = b.variant === 1 ? h * 0.49 : b.variant === 3 ? h * 0.5 : h * 0.56;
  ctx.translate(w / 2, ty);
  ctx.rotate(Math.PI / 2);
  const maxLen = b.variant === 1 ? h * 0.44 : h * 0.6;
  const sz = fitFont(ctx, b.title, '700', SANS, Math.round(w * 0.42), maxLen, 10);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (!mask) {
    // relieve: sombra abajo-derecha y luz arriba-izquierda
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillText(b.title, 1.2, 1.6);
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillText(b.title, -0.8, -0.8);
  }
  ctx.fillStyle = b.variant === 1 && !mask ? (b.foil === 'cream' ? '#1A1410' : foilGrad(ctx, b.foil, -maxLen / 2, maxLen / 2)) : mask ? '#FFFFFF' : foilGrad(ctx, b.foil, -maxLen / 2, maxLen / 2);
  ctx.fillText(b.title, 0, sz * 0.04);
  ctx.restore();
  // Autor
  ctx.save();
  const ay = b.variant === 2 ? h * 0.1 : b.variant === 1 ? h * 0.85 : h * 0.16;
  ctx.translate(w / 2, ay);
  ctx.rotate(Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const authorSz = fitFont(ctx, author, '500', SANS, Math.round(w * 0.2), h * 0.15, 7);
  ctx.font = `500 ${authorSz}px ${SANS}`;
  ctx.fillStyle = mask ? '#FFFFFF' : foilGrad(ctx, b.foil, -h * 0.07, h * 0.07);
  (ctx as unknown as { letterSpacing: string }).letterSpacing = `${Math.round(authorSz * 0.18)}px`;
  ctx.fillText(author, 0, 0);
  ctx.restore();
  // Emblema al pie: un pequeño libro abierto (marca de la colección inventada)
  ctx.save();
  ctx.translate(w / 2, h * (b.variant === 1 ? 0.95 : 0.97) - w * 0.12);
  const s = w * 0.16;
  ctx.strokeStyle = mask ? '#FFFFFF' : foilGrad(ctx, b.foil, -s, s);
  ctx.lineWidth = Math.max(1.5, w * 0.018);
  ctx.beginPath();
  ctx.moveTo(-s, -s * 0.2);
  ctx.quadraticCurveTo(-s * 0.5, -s * 0.55, 0, -s * 0.15);
  ctx.quadraticCurveTo(s * 0.5, -s * 0.55, s, -s * 0.2);
  ctx.lineTo(s, s * 0.45);
  ctx.quadraticCurveTo(s * 0.5, s * 0.1, 0, s * 0.5);
  ctx.quadraticCurveTo(-s * 0.5, s * 0.1, -s, s * 0.45);
  ctx.closePath();
  ctx.moveTo(0, -s * 0.15);
  ctx.lineTo(0, s * 0.5);
  ctx.stroke();
  ctx.restore();
};

export const spineMaps = (b: ShelfBook) => {
  const w = Math.max(64, Math.round(b.thick * PX));
  const h = Math.round(b.h * PX);
  const key = `spine-${b.title}-${b.cloth}-${b.foil}-${b.variant}-${w}x${h}`;
  const map = canvasTex(key, w, h, (ctx) => {
    ctx.fillStyle = b.cloth;
    ctx.fillRect(0, 0, w, h);
    clothNoise(ctx, w, h, b.seed, 1.2);
    drawSpineArt(ctx, b, w, h, false);
    // Curvatura del lomo: bordes en sombra y brillo a un tercio
    const g = ctx.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, 'rgba(0,0,0,0.42)');
    g.addColorStop(0.1, 'rgba(0,0,0,0.12)');
    g.addColorStop(0.34, 'rgba(255,255,255,0.10)');
    g.addColorStop(0.7, 'rgba(0,0,0,0.06)');
    g.addColorStop(0.92, 'rgba(0,0,0,0.25)');
    g.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    // Roce en cabeza y pie
    const v = ctx.createLinearGradient(0, 0, 0, h);
    v.addColorStop(0, 'rgba(255,240,220,0.10)');
    v.addColorStop(0.02, 'rgba(0,0,0,0)');
    v.addColorStop(0.98, 'rgba(0,0,0,0)');
    v.addColorStop(1, 'rgba(0,0,0,0.3)');
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, w, h);
  });
  // Máscara de rugosidad (canal G): tela mate, dorado satinado que brilla con el foco.
  // (Sin mapa de entorno: en SwiftShader cuesta más de 4 s por fotograma.)
  const rm = canvasTex(`${key}-rm`, w, h, (ctx) => {
    ctx.fillStyle = 'rgb(0, 222, 0)';
    ctx.fillRect(0, 0, w, h);
    const m = document.createElement('canvas');
    m.width = w;
    m.height = h;
    const mc = m.getContext('2d')!;
    drawSpineArt(mc, b, w, h, true);
    mc.globalCompositeOperation = 'source-in';
    mc.fillStyle = b.foil === 'cream' ? 'rgb(0, 120, 0)' : b.foil === 'red' ? 'rgb(0, 110, 0)' : 'rgb(0, 70, 0)';
    mc.fillRect(0, 0, w, h);
    ctx.drawImage(m, 0, 0);
  }, { srgb: false });
  // Relieve: el dorado va hundido en la tela
  const bump = canvasTex(`${key}-bump`, w, h, (ctx) => {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);
    const m = document.createElement('canvas');
    m.width = w;
    m.height = h;
    const mc = m.getContext('2d')!;
    drawSpineArt(mc, b, w, h, true);
    mc.globalCompositeOperation = 'source-in';
    mc.fillStyle = '#5A5A5A';
    mc.fillRect(0, 0, w, h);
    ctx.drawImage(m, 0, 0);
    clothNoise(ctx, w, h, b.seed + 7, 2.2);
  }, { srgb: false });
  return { map, rm, bump };
};

// Tela de las tapas (una textura por color).
export const clothTex = (cloth: string, seed = 1) =>
  canvasTex(`cloth-${cloth}`, 256, 256, (ctx, w, h) => {
    ctx.fillStyle = cloth;
    ctx.fillRect(0, 0, w, h);
    clothNoise(ctx, w, h, seed, 1.4);
  });

// Canto de papel visto desde arriba (cabeza/pie) o desde delante (corte delantero).
// `across` = número de hojas que se ven; los cartones de las tapas en los extremos, del color de la tela.
export const pagesTex = (cloth: string, kind: 'head' | 'fore') =>
  canvasTex(`pages-${kind}-${cloth}`, 256, 256, (ctx, w, h) => {
    const r = rng(kind === 'head' ? 11 : 23);
    ctx.fillStyle = '#EDE4D0';
    ctx.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 2) {
      ctx.fillStyle = `rgba(120,100,70,${0.05 + r() * 0.14})`;
      ctx.fillRect(x, 0, 1, h);
    }
    // amarillea hacia el borde
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, 'rgba(180,150,100,0.18)');
    g.addColorStop(0.15, 'rgba(0,0,0,0)');
    g.addColorStop(0.85, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(180,150,100,0.18)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = cloth;
    ctx.fillRect(0, 0, w * 0.07, h);
    ctx.fillRect(w * 0.93, 0, w * 0.07, h);
    if (kind === 'head') ctx.fillRect(0, h * 0.94, w, h * 0.06); // el lomo se ve en el extremo delantero
  });

const geoCache = new Map<string, THREE.BufferGeometry>();
export const bookGeo = (t: number, h: number, d: number) => {
  const k = `${t.toFixed(2)}-${h.toFixed(2)}-${d.toFixed(2)}`;
  let g = geoCache.get(k);
  if (!g) {
    g = new RoundedBoxGeometry(t, h, d, 2, Math.min(0.28, t * 0.12));
    geoCache.set(k, g);
  }
  return g;
};

const matCache = new Map<string, THREE.Material[]>();
export const bookMaterials = (b: ShelfBook) => {
  const k = `${b.title}-${b.cloth}-${b.foil}-${b.variant}-${b.thick}-${b.h}`;
  let m = matCache.get(k);
  if (!m) {
    const sp = spineMaps(b);
    const side = new THREE.MeshStandardMaterial({ map: clothTex(b.cloth, b.seed), roughness: 0.86, metalness: 0 });
    const head = new THREE.MeshStandardMaterial({ map: pagesTex(b.cloth, 'head'), roughness: 0.95, metalness: 0 });
    const fore = new THREE.MeshStandardMaterial({ map: pagesTex(b.cloth, 'fore'), roughness: 0.95, metalness: 0 });
    const spine = new THREE.MeshStandardMaterial({ map: sp.map, roughnessMap: sp.rm, roughness: 1, metalness: 0, bumpMap: sp.bump, bumpScale: 0.6 });
    // Orden de caras de la caja: +x, −x, +y, −y, +z (lomo, hacia la cámara), −z (corte delantero)
    m = [side, side, head, head, spine, fore];
    matCache.set(k, m);
  }
  return m;
};

export const Book: React.FC<{ b: ShelfBook; position?: [number, number, number]; rotation?: [number, number, number]; castShadow?: boolean }> = ({ b, position, rotation, castShadow = true }) => {
  const geo = useMemo(() => bookGeo(b.thick, b.h, b.depth), [b.thick, b.h, b.depth]);
  const mats = useMemo(() => bookMaterials(b), [b]);
  return <mesh geometry={geo} material={mats} position={position} rotation={rotation} castShadow={castShadow} receiveShadow />;
};

// Madera oscura (estanterías).
export const woodTex = (tone: string, key: string, vertical = false) =>
  canvasTex(`wood-${key}`, 1024, 256, (ctx, w, h) => {
    const r = rng(hash32(key));
    ctx.fillStyle = tone;
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 90; i++) {
      const y0 = r() * h;
      const amp = 2 + r() * 6;
      const fr = 0.004 + r() * 0.01;
      ctx.strokeStyle = r() < 0.5 ? `rgba(0,0,0,${0.08 + r() * 0.14})` : `rgba(255,220,170,${0.03 + r() * 0.05})`;
      ctx.lineWidth = 0.6 + r() * 1.8;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 8) {
        const y = y0 + Math.sin(x * fr + i) * amp + Math.sin(x * fr * 3.1 + i * 2) * amp * 0.3;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    // nudos
    for (let i = 0; i < 3; i++) {
      const x = r() * w, y = r() * h;
      const g = ctx.createRadialGradient(x, y, 1, x, y, 18 + r() * 14);
      g.addColorStop(0, 'rgba(20,10,4,0.5)');
      g.addColorStop(1, 'rgba(20,10,4,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(x, y, 40, 12, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    if (vertical) {
      // listones verticales para el fondo
      for (let x = 0; x < w; x += w / 6) {
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(x, 0, 3, h);
      }
    }
  });
const hash32 = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};

// Papel de un relato (hoja suelta con líneas de texto).
export const sheetTex = (i: number) =>
  canvasTex(`sheet-${i % 6}`, 256, 360, (ctx, w, h) => {
    const r = rng(100 + (i % 6));
    ctx.fillStyle = '#F2EBDC';
    ctx.fillRect(0, 0, w, h);
    const g = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w * 0.9);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(1, 'rgba(150,120,70,0.22)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(30,30,30,0.75)';
    ctx.font = `700 15px ${SANS}`;
    ctx.fillRect(28, 34, 90 + r() * 60, 7);
    for (let y = 62; y < h - 30; y += 13) {
      if (r() < 0.07) continue;
      ctx.fillStyle = `rgba(40,40,40,${0.32 + r() * 0.12})`;
      ctx.fillRect(28, y, (w - 56) * (y > h - 60 ? 0.5 : 0.75 + r() * 0.25), 4);
    }
    ctx.fillStyle = 'rgba(40,40,40,0.4)';
    ctx.font = `400 13px ${SERIF}`;
    ctx.fillText(String(1 + Math.floor(r() * 300)), w / 2 - 8, h - 12);
  });

// Placa de latón con un año (bajo las baldas).
export const plateTex = (year: number) =>
  canvasTex(`plate-${year}`, 256, 96, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#E6C77E');
    g.addColorStop(0.45, '#B68A3C');
    g.addColorStop(1, '#7E5A22');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(60,40,10,0.7)';
    ctx.lineWidth = 4;
    ctx.strokeRect(6, 6, w - 12, h - 12);
    ctx.font = `700 54px ${SANS}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255,240,200,0.6)';
    ctx.fillText(String(year), w / 2 + 1, h / 2 + 3);
    ctx.fillStyle = '#3A2608';
    ctx.fillText(String(year), w / 2, h / 2 + 1);
    for (const x of [22, w - 22]) {
      ctx.fillStyle = '#5A4014';
      ctx.beginPath();
      ctx.arc(x, h / 2, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  });
