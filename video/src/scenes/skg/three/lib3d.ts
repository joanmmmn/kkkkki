import * as THREE from 'three';
import { useEffect, useState } from 'react';
import { continueRender, delayRender } from 'remotion';
import { loadBrandFonts } from '../../../brand/fonts';

// ————————————————————————————————————————————————————————————————
// Utilidades 3D del episodio de Stephen King (three.js + @remotion/three).
// Texturas dibujadas en canvas (deterministas), cámara por fotogramas clave y una espera de fuentes
// para que los rótulos de los lomos salgan con Ubuntu y no con la fuente de reserva.
// ————————————————————————————————————————————————————————————————

loadBrandFonts();

export const SANS = 'Ubuntu';
export const SERIF = '"EB Garamond"';

// Generador pseudoaleatorio con semilla (mulberry32): mismo resultado en cada pestaña y en cada render.
export const rng = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
export const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};

// Espera a que Ubuntu y EB Garamond estén listas antes de dibujar texturas con texto.
let fontsOk = false;
export const useFontsReady = () => {
  const [ready, setReady] = useState(fontsOk);
  const [handle] = useState(() => (fontsOk ? null : delayRender('Fuentes para las texturas 3D')));
  useEffect(() => {
    if (fontsOk) return;
    let alive = true;
    const specs = ['700 64px Ubuntu', '500 64px Ubuntu', '400 64px Ubuntu', '400 64px "EB Garamond"', 'italic 400 64px "EB Garamond"'];
    const t0 = Date.now();
    const tick = () => {
      Promise.all(specs.map((s) => document.fonts.load(s))).then(() => {
        const ok = specs.every((s) => document.fonts.check(s));
        if (!ok && Date.now() - t0 < 8000) {
          setTimeout(tick, 60);
          return;
        }
        fontsOk = true;
        if (alive) setReady(true);
        if (handle !== null) continueRender(handle);
      });
    };
    tick();
    return () => {
      alive = false;
    };
  }, [handle]);
  return ready;
};

const texCache = new Map<string, THREE.CanvasTexture>();
export const canvasTex = (key: string, w: number, h: number, draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void, opts: { srgb?: boolean; repeat?: [number, number] } = {}) => {
  const hit = texCache.get(key);
  if (hit) return hit;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  draw(ctx, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = opts.srgb === false ? THREE.NoColorSpace : THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (opts.repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(opts.repeat[0], opts.repeat[1]);
  }
  t.needsUpdate = true;
  texCache.set(key, t);
  return t;
};

// Tela de encuadernación: trama fina de hilos claros y oscuros sobre el color base.
export const clothNoise = (ctx: CanvasRenderingContext2D, w: number, h: number, seed: number, amount = 1) => {
  const r = rng(seed);
  for (let i = 0; i < (w * h) / 26; i++) {
    const x = r() * w, y = r() * h;
    const light = r() < 0.5;
    ctx.fillStyle = light ? `rgba(255,255,255,${0.035 * amount})` : `rgba(0,0,0,${0.06 * amount})`;
    if (r() < 0.5) ctx.fillRect(x, y, 3 + r() * 5, 1);
    else ctx.fillRect(x, y, 1, 3 + r() * 5);
  }
  // Desgaste en los bordes
  for (let i = 0; i < 40 * amount; i++) {
    const x = r() < 0.5 ? r() * w * 0.12 : w - r() * w * 0.12;
    ctx.fillStyle = `rgba(255,240,220,${0.03 + r() * 0.05})`;
    ctx.fillRect(x, r() * h, 1 + r() * 2, 4 + r() * 30);
  }
};

// Ajusta el tamaño de letra para que el texto quepa en `maxW`.
export const fitFont = (ctx: CanvasRenderingContext2D, text: string, weight: string, family: string, start: number, maxW: number, min = 8) => {
  let s = start;
  ctx.font = `${weight} ${s}px ${family}`;
  while (s > min && ctx.measureText(text).width > maxW) {
    s -= 1;
    ctx.font = `${weight} ${s}px ${family}`;
  }
  return s;
};

export const shade = (hex: string, k: number) => {
  const c = new THREE.Color(hex);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  c.setHSL(hsl.h, hsl.s, Math.max(0, Math.min(1, hsl.l * k)));
  return `#${c.getHexString()}`;
};

// ———————————————— Cámara por fotogramas clave ————————————————
export type V3 = [number, number, number];
export type CamKey = { f: number; pos: V3; look: V3; fov?: number; ease?: (t: number) => number };
const smooth = (t: number) => t * t * (3 - 2 * t);
export const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeO = (t: number) => 1 - Math.pow(1 - t, 3);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerp3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
export const camAt = (frame: number, keys: CamKey[]) => {
  if (frame <= keys[0].f) return { pos: keys[0].pos, look: keys[0].look, fov: keys[0].fov ?? 30 };
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (frame <= b.f) {
      const t = (b.ease ?? easeIO)((frame - a.f) / Math.max(1, b.f - a.f));
      return { pos: lerp3(a.pos, b.pos, t), look: lerp3(a.look, b.look, t), fov: lerp(a.fov ?? 30, b.fov ?? 30, t) };
    }
  }
  const z = keys[keys.length - 1];
  return { pos: z.pos, look: z.look, fov: z.fov ?? 30 };
};
// Pequeño temblor de cámara al hombro (determinista, muy suave).
export const handheld = (frame: number, amp = 1): V3 => [
  amp * (Math.sin(frame / 37) * 0.6 + Math.sin(frame / 23 + 1.3) * 0.25),
  amp * (Math.sin(frame / 41 + 0.7) * 0.45 + Math.sin(frame / 29 + 2.1) * 0.2),
  0,
];
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const ramp01 = (frame: number, a: number, b: number, e: (t: number) => number = smooth) => e(clamp01((frame - a) / Math.max(1, b - a)));

// Proyecta un punto 3D a coordenadas de pantalla (1920×1080) con la misma cámara que <Rig>.
const _projCam = new THREE.PerspectiveCamera(30, 16 / 9, 1, 1200);
const _v = new THREE.Vector3();
export const projectAt = (frame: number, keys: CamKey[], shake: number, p: V3) => {
  const c = camAt(frame, keys);
  const hh = handheld(frame, shake);
  _projCam.fov = c.fov;
  _projCam.aspect = 16 / 9;
  _projCam.position.set(c.pos[0] + hh[0], c.pos[1] + hh[1], c.pos[2]);
  _projCam.updateProjectionMatrix();
  _projCam.lookAt(c.look[0] + hh[0] * 0.6, c.look[1] + hh[1] * 0.6, c.look[2]);
  _projCam.updateMatrixWorld();
  _v.set(p[0], p[1], p[2]).project(_projCam);
  return { x: ((_v.x + 1) / 2) * 1920, y: ((1 - _v.y) / 2) * 1080, behind: _v.z > 1 };
};
