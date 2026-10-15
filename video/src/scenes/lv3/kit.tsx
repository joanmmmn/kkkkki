import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp } from '../../lib/anim';
import { softSpring } from '../../lib/motion';
import { CLIP3, clipWordAt } from './timeline';

// ---------------------------------------------------------------------------------------------------------------
// «La biblioteca que habla»: el sistema visual del vídeo nuevo de LibriVox.
// Noche cálida de biblioteca (madera, luz dorada, polvo en un haz de luz), papel y tinta de libro (EB Garamond) y los
// colores de LibriVox (verde azulado, oliva y azul claro) para su web. El amarillo de SonorBooks solo en la marca.
// ---------------------------------------------------------------------------------------------------------------
export const T = {
  night: '#0b0907', night2: '#16120e', night3: '#231c15',
  wood: '#3a2a1d', wood2: '#5b4029', wood3: '#7a5737',
  gold: '#f3d08f', goldDeep: '#d9a64c', glow: 'rgba(255, 210, 140, 0.55)',
  paper: '#f7f0e1', paper2: '#efe5cf', paperEdge: '#d9cbb0', paperShade: '#e6dac0',
  ink: '#2a2520', inkSoft: '#6c6252', inkFaint: '#ab9f88',
  cream: '#f5ead2', creamSoft: 'rgba(245, 234, 210, 0.72)', creamDim: 'rgba(245, 234, 210, 0.45)',
  teal: '#2e6d7d', tealLight: '#86bccb', olive: '#5a7e14', oliveLight: '#a9c46a', blue: '#d5ebf1',
  red: '#b3362b', redInk: '#a8322a',
  yellow: '#ffca05',
  serif: '"EB Garamond", Georgia, serif',
  ui: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  brand: 'Ubuntu, sans-serif',
};
export const img3 = (n: string) => staticFile(`lv/img3/${n}`);
export const lvImg = (n: string) => staticFile(`lv/img/${n}`);
export const lvWeb = (n: string) => staticFile(`lv/web/${n}.png`);
export const cover = (id: string) => lvImg(`cover_${id}.jpg`);

// Curvas
export const eSine = Easing.bezier(0.37, 0, 0.63, 1);
export const eOut = Easing.bezier(0.16, 1, 0.3, 1);
export const eIO = Easing.bezier(0.65, 0, 0.35, 1);
export const eSoft = Easing.bezier(0.45, 0, 0.2, 1);
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
export const ramp = (f: number, a: number, b: number, easing = eIO) => interpolate(f, [a, b], [0, 1], { ...clamp, easing });
export const sp = (frame: number, at: number, fps: number, stiffness = 120, damping = 22) => softSpring({ frame: frame - at, fps, config: { stiffness, damping } });

// Aleatorio determinista (mismo resultado en cada fotograma y en cada render)
export const rnd = (seed: number) => {
  let t = (seed * 0x6d2b79f5) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// ---------------------------------------------------------------------------------------------------------------
// Movimiento: fotogramas clave con curva seno y un muelle críticamente amortiguado que sigue el recorrido (arranques,
// paradas y cambios de dirección redondeados). Sirve para la cámara 3D y para cualquier objeto con varias propiedades.
// ---------------------------------------------------------------------------------------------------------------
export type Key = { f: number } & Record<string, number>;
export const follow = (frame: number, keys: Key[], omega = 6.2) => {
  const props = Object.keys(keys[0]).filter((k) => k !== 'f');
  const target = (f: number) => {
    const o: Record<string, number> = {};
    if (f <= keys[0].f) { props.forEach((p) => (o[p] = keys[0][p])); return o; }
    for (let i = 0; i < keys.length - 1; i++) {
      const a = keys[i], b = keys[i + 1];
      if (f <= b.f) {
        const q = eSine(Math.min(1, Math.max(0, (f - a.f) / Math.max(1, b.f - a.f))));
        props.forEach((p) => (o[p] = lerp(a[p] ?? keys[0][p], b[p] ?? a[p], q)));
        return o;
      }
    }
    props.forEach((p) => (o[p] = keys[keys.length - 1][p]));
    return o;
  };
  const s = target(0);
  const v: Record<string, number> = {};
  props.forEach((p) => (v[p] = 0));
  const SUB = 2, dt = 1 / 50 / SUB, w2 = omega * omega, w2x = 2 * omega;
  for (let f = 1; f <= Math.floor(frame); f++) {
    const t = target(f);
    for (let k = 0; k < SUB; k++) for (const p of props) { v[p] += (w2 * (t[p] - s[p]) - w2x * v[p]) * dt; s[p] += v[p] * dt; }
  }
  return s as Record<string, number>;
};

// ---------------------------------------------------------------------------------------------------------------
// Fondo: la biblioteca de noche, siempre visible (nunca negro). Un «plató» (el pasillo de estanterías, renderizado y
// desenfocado: tools/lv3_set.py) con un charco de luz cálida, bokeh de lámparas, el haz con motas de polvo y una viñeta
// suave. Cada plano lo encuadra a su manera (`view`): desplazamiento, escala y cuánto se oscurece.
// ---------------------------------------------------------------------------------------------------------------
export type SetView = { x: number; y: number; s: number; dim: number };
export const SET_VIEW: SetView = { x: 0, y: 0, s: 1, dim: 0.3 };
const DUST = Array.from({ length: 54 }, (_, i) => ({
  x: rnd(i * 7 + 1) * 1920, y: rnd(i * 7 + 2) * 1080, r: 1.1 + rnd(i * 7 + 3) * 2.6,
  vx: (rnd(i * 7 + 4) - 0.35) * 9, vy: (rnd(i * 7 + 5) - 0.6) * 7, ph: rnd(i * 7 + 6) * 6.28, tw: 0.6 + rnd(i * 7 + 7) * 1.2,
}));
const BOKEH = Array.from({ length: 12 }, (_, i) => ({
  x: rnd(i * 13 + 3) * 1920, y: rnd(i * 13 + 4) * 1080 * 0.85, d: 40 + rnd(i * 13 + 5) * 120,
  o: 0.05 + rnd(i * 13 + 6) * 0.09, vx: (rnd(i * 13 + 7) - 0.5) * 6, vy: (rnd(i * 13 + 8) - 0.5) * 4, ph: rnd(i * 13 + 9) * 6.28,
}));
export const Night: React.FC<{ beam?: number; warmth?: number; view?: SetView }> = ({ beam = 1, warmth = 1, view = SET_VIEW }) => {
  const frame = useCurrentFrame();
  const t = frame / 50;
  const breathe = 0.92 + 0.08 * Math.sin(t * 0.35);
  // el plató respira y se desplaza muy despacio (como una cámara en mano muy suave)
  const dx = view.x + Math.sin(t * 0.11) * 26, dy = view.y + Math.cos(t * 0.09) * 12;
  const sc = view.s * (1.0 + 0.012 * Math.sin(t * 0.07));
  const bx0 = 380, by0 = -200, ang = (62 * Math.PI) / 180;
  return (
    <AbsoluteFill style={{ background: '#1a130d', overflow: 'hidden' }}>
      <Img src={img3('set_bg.jpg')} style={{ position: 'absolute', left: 960 - 1200, top: 540 - 675, width: 2400, height: 1350, transform: `translate(${dx}px, ${dy}px) scale(${sc})` }} />
      <AbsoluteFill style={{ background: `rgba(16,10,6,${view.dim})` }} />
      {/* charco de luz cálida */}
      <div style={{ position: 'absolute', left: 960 - 1100, top: -720, width: 2200, height: 1700, borderRadius: '50%', background: `radial-gradient(closest-side, rgba(255,206,130,${0.2 * warmth * breathe}), rgba(255,206,130,0) 72%)` }} />
      {/* bokeh de las lámparas */}
      {BOKEH.map((k, i) => {
        const x = ((k.x + k.vx * t - dx * 0.35) % 2100 + 2100) % 2100 - 90;
        const y = k.y + k.vy * t * 0.4 + Math.sin(t * 0.3 + k.ph) * 10 - dy * 0.35;
        const o = k.o * (0.75 + 0.25 * Math.sin(t * 0.4 + k.ph));
        return <div key={i} style={{ position: 'absolute', left: x - k.d / 2, top: y - k.d / 2, width: k.d, height: k.d, borderRadius: '50%', opacity: o, mixBlendMode: 'screen',
          background: 'radial-gradient(circle, rgba(255,222,165,0.8) 0%, rgba(255,222,165,0.55) 45%, rgba(255,222,165,0.18) 64%, rgba(255,222,165,0) 72%)' }} />;
      })}
      {/* haz de luz con polvo */}
      <div style={{ position: 'absolute', left: bx0 - 260, top: by0, width: 520, height: 2200, transformOrigin: '260px 0', transform: `rotate(${-28}deg)`, opacity: beam * breathe, mixBlendMode: 'screen',
        background: 'linear-gradient(90deg, rgba(255,214,150,0) 0%, rgba(255,214,150,0.06) 30%, rgba(255,214,150,0.11) 50%, rgba(255,214,150,0.06) 70%, rgba(255,214,150,0) 100%)' }} />
      {DUST.map((d, i) => {
        const x = ((d.x + d.vx * t) % 1960 + 1960) % 1960 - 20;
        const y = ((d.y + d.vy * t) % 1120 + 1120) % 1120 - 20;
        const ddx = x - bx0, ddy = y - by0;
        const dist = Math.abs(ddx * Math.sin(ang) - ddy * Math.cos(ang));
        const inBeam = Math.max(0, 1 - dist / 300);
        const o = (0.08 + 0.55 * inBeam) * (0.55 + 0.45 * Math.sin(t * d.tw + d.ph)) * beam;
        if (o < 0.02) return null;
        return <div key={i} style={{ position: 'absolute', left: x, top: y, width: d.r * 2, height: d.r * 2, borderRadius: '50%', opacity: o, background: 'radial-gradient(circle, rgba(255,226,170,1) 0%, rgba(255,226,170,0) 70%)' }} />;
      })}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(8,5,3,0.42) 100%)' }} />
    </AbsoluteFill>
  );
};

// Haz de luz con polvo, como capa por encima de un plano (modo «screen»): para que el polvo flote delante del libro.
export const BeamDust: React.FC<{ o?: number; x0?: number; y0?: number; angle?: number; width?: number }> = ({ o = 1, x0 = 380, y0 = -200, angle = -28, width = 560 }) => {
  const frame = useCurrentFrame();
  const t = frame / 50;
  const breathe = 0.9 + 0.1 * Math.sin(t * 0.35);
  const ang = ((90 + angle) * Math.PI) / 180;
  if (o <= 0.01) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen', opacity: o }}>
      <div style={{ position: 'absolute', left: x0 - width / 2, top: y0, width, height: 2300, transformOrigin: `${width / 2}px 0`, transform: `rotate(${angle}deg)`, opacity: breathe,
        background: 'linear-gradient(90deg, rgba(255,214,150,0) 0%, rgba(255,214,150,0.07) 30%, rgba(255,214,150,0.13) 50%, rgba(255,214,150,0.07) 70%, rgba(255,214,150,0) 100%)' }} />
      {DUST.map((d, i) => {
        const x = ((d.x + d.vx * t) % 1960 + 1960) % 1960 - 20;
        const y = ((d.y + d.vy * t) % 1120 + 1120) % 1120 - 20;
        const dx = x - x0, dy = y - y0;
        const dist = Math.abs(dx * Math.sin(ang) - dy * Math.cos(ang));
        const inBeam = Math.max(0, 1 - dist / (width * 0.55));
        const k = (0.06 + 0.8 * inBeam) * (0.55 + 0.45 * Math.sin(t * d.tw + d.ph));
        if (k < 0.03) return null;
        return <div key={i} style={{ position: 'absolute', left: x, top: y, width: d.r * 2.4, height: d.r * 2.4, borderRadius: '50%', opacity: k, background: 'radial-gradient(circle, rgba(255,232,180,1) 0%, rgba(255,232,180,0) 70%)' }} />;
      })}
    </AbsoluteFill>
  );
};

// Grano de película, muy suave (por encima de todo)
export const Grain: React.FC<{ o?: number }> = ({ o = 0.05 }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ pointerEvents: 'none', backgroundImage: `url(${img3('grain.png')})`, backgroundSize: '256px 256px', backgroundPosition: `${Math.floor(rnd(frame + 11) * 256)}px ${Math.floor(rnd(frame + 97) * 256)}px`, opacity: o, mixBlendMode: 'overlay' }} />;
};

// ---------------------------------------------------------------------------------------------------------------
// Espacio 3D: `Space` pone la perspectiva; `Rig` es el mundo, movido por la cámara (x, y: punto al que mira; z: avance;
// rx, ry, rz: giro). Dentro, `At` coloca cada objeto centrado en (x, y, z) con su propio giro.
// ---------------------------------------------------------------------------------------------------------------
export type Cam = { x: number; y: number; z: number; rx: number; ry: number; rz?: number };
export const Space: React.FC<{ persp?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ persp = 1600, children, style }) => (
  <AbsoluteFill style={{ perspective: persp, perspectiveOrigin: '50% 50%', overflow: 'hidden', ...style }}>{children}</AbsoluteFill>
);
export const Rig: React.FC<{ cam: Cam; children: React.ReactNode }> = ({ cam, children }) => (
  <div style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, transformStyle: 'preserve-3d',
    transform: `translateZ(${cam.z}px) rotateX(${cam.rx}deg) rotateY(${cam.ry}deg) rotateZ(${cam.rz ?? 0}deg) translate3d(${-cam.x}px, ${-cam.y}px, 0px)` }}>
    {children}
  </div>
);
export const At: React.FC<{ x?: number; y?: number; z?: number; rx?: number; ry?: number; rz?: number; s?: number; w: number; h: number; o?: number; style?: React.CSSProperties; children?: React.ReactNode; flat?: boolean }> = ({
  x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, s = 1, w, h, o = 1, style, children, flat,
}) => (
  <div style={{ position: 'absolute', left: -w / 2, top: -h / 2, width: w, height: h, opacity: o, transformStyle: flat ? undefined : 'preserve-3d',
    transform: `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${s})`, ...style }}>
    {children}
  </div>
);

// ---------------------------------------------------------------------------------------------------------------
// Papel y tinta
// ---------------------------------------------------------------------------------------------------------------
export const paperBg = (tone = T.paper) => ({
  backgroundColor: tone,
  backgroundImage: `radial-gradient(120% 90% at 30% 20%, rgba(255,250,236,0.9) 0%, rgba(255,250,236,0) 55%), radial-gradient(140% 120% at 70% 110%, rgba(150,120,70,0.16) 0%, rgba(150,120,70,0) 60%), url(${img3('paper.png')})`,
  backgroundSize: '100% 100%, 100% 100%, 512px 512px',
});
export const Paper: React.FC<{ w: number; h: number; style?: React.CSSProperties; children?: React.ReactNode; tone?: string; radius?: number; shadow?: string }> = ({ w, h, style, children, tone, radius = 6, shadow }) => (
  <div style={{ width: w, height: h, borderRadius: radius, position: 'relative', overflow: 'hidden', ...paperBg(tone),
    boxShadow: shadow ?? '0 1px 0 rgba(255,255,255,0.6) inset, 0 30px 70px rgba(0,0,0,0.45), 0 8px 20px rgba(0,0,0,0.3)', ...style }}>
    {children}
  </div>
);

// Texto que entra como tinta: sube un poco y se enfoca, palabra a palabra
export const InkIn: React.FC<{ text: string; at: number; stagger?: number; size: number; color?: string; weight?: number; italic?: boolean; font?: string; style?: React.CSSProperties; align?: 'left' | 'center' | 'right'; lh?: number; spacing?: number }> = ({
  text, at, stagger = 2.5, size, color = T.ink, weight = 400, italic, font = T.serif, style, align = 'left', lh = 1.2, spacing = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ fontFamily: font, fontSize: size, fontWeight: weight, fontStyle: italic ? 'italic' : 'normal', color, lineHeight: lh, textAlign: align, letterSpacing: spacing, ...style }}>
      {text.split(' ').map((wd, i) => {
        const s = sp(frame, at + i * stagger, fps, 140, 26);
        return <span key={i} style={{ display: 'inline-block', marginRight: '0.24em', opacity: s, transform: `translateY(${(1 - s) * 0.18}em)`, filter: s < 0.98 ? `blur(${(1 - s) * 2.5}px)` : undefined }}>{wd}</span>;
      })}
    </div>
  );
};

// Fragmento de un voluntario: las palabras pasan de gris a tinta al ritmo de la voz; la que suena lleva un subrayado
// verde azulado (como en la página).
export const InkWords: React.FC<{ clip: string; clipAt: number; size: number; color?: string; faint?: string; underline?: string; after?: string; lh?: number; align?: 'left' | 'justify' | 'center'; dropCap?: boolean; before?: React.ReactNode; close?: React.ReactNode }> = ({
  clip, clipAt, size, color = T.ink, faint = T.inkFaint, underline = T.teal, after, lh = 1.45, align = 'left', dropCap, before, close,
}) => {
  const frame = useCurrentFrame();
  const words = CLIP3[clip].words;
  const idx = clipWordAt(clip, frame - clipAt);
  const end = clipAt + Math.round(CLIP3[clip].dur * 50);
  const playing = frame >= clipAt && frame < end;
  return (
    <div style={{ fontFamily: T.serif, fontSize: size, lineHeight: lh, textAlign: align, color: faint }}>
      {before}
      {words.map(([s, e, t], i) => {
        const on = playing && i === idx;
        const past = i < idx || (!playing && idx >= 0);
        const startF = clipAt + Math.round(s * 50);
        const k = interpolate(frame, [startF - 2, startF + 6], [0, 1], clamp);
        const lit = past || on ? 1 : k;
        const uw = on ? interpolate(frame, [startF, clipAt + Math.round(e * 50)], [0, 1], clamp) : 0;
        return (
          <span key={i} style={{ position: 'relative', color: lit > 0.5 ? color : faint, opacity: 0.55 + 0.45 * lit }}>
            {dropCap && i === 0 ? t.slice(1) : close && i === words.length - 1 ? t.replace(/\.$/, '') : t}
            {on && <span style={{ position: 'absolute', left: 0, bottom: '0.06em', height: Math.max(2, size * 0.055), width: `${uw * 100}%`, background: underline, borderRadius: 2 }} />}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
      {close}
      {after && <span style={{ color: faint, opacity: 0.55 }}> {after}</span>}
    </div>
  );
};

// Trazo de tinta que se dibuja (SVG): `d` en coordenadas del propio SVG
export const Draw: React.FC<{ d: string; at: number; dur?: number; w: number; h: number; color?: string; width?: number; style?: React.CSSProperties; out?: number; len?: number }> = ({
  d, at, dur = 18, w, h, color = T.teal, width = 3, style, out = 1e9, len = 2000,
}) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, at, at + dur, eOut);
  const o = 1 - ramp(frame, out, out + 12);
  if (p <= 0 || o <= 0) return null;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: 'absolute', overflow: 'visible', pointerEvents: 'none', opacity: o, ...style }}>
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
    </svg>
  );
};

// Número grande de paso / capítulo (serifa), con un filete fino debajo
export const Roman: React.FC<{ n: string; size: number; color?: string; style?: React.CSSProperties }> = ({ n, size, color = T.ink, style }) => (
  <div style={{ fontFamily: T.serif, fontWeight: 500, fontSize: size, lineHeight: 0.9, color, letterSpacing: -size * 0.02, ...style }}>{n}</div>
);

// Ornamento tipográfico (filete con rombo central), dibujado
export const Fleuron: React.FC<{ at: number; w?: number; color?: string }> = ({ at, w = 260, color = T.inkSoft }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, at, at + 24, eOut);
  return (
    <svg width={w} height={18} viewBox={`0 0 ${w} 18`} style={{ display: 'block', margin: '0 auto', opacity: p }}>
      <line x1={w / 2 - 14} y1={9} x2={w / 2 - 14 - (w / 2 - 20) * p} y2={9} stroke={color} strokeWidth={1.4} />
      <line x1={w / 2 + 14} y1={9} x2={w / 2 + 14 + (w / 2 - 20) * p} y2={9} stroke={color} strokeWidth={1.4} />
      <path d={`M ${w / 2} 2 L ${w / 2 + 7} 9 L ${w / 2} 16 L ${w / 2 - 7} 9 Z`} fill={color} transform={`translate(${w / 2} 9) scale(${p}) translate(${-w / 2} -9)`} />
    </svg>
  );
};

// Portada (dominio público, de LibriVox) como un libro con grosor
export const BookCover: React.FC<{ id: string; size: number; depth?: number; style?: React.CSSProperties; shade?: number }> = ({ id, size, depth = 16, style, shade = 0 }) => (
  <div style={{ position: 'relative', width: size, height: size, transformStyle: 'preserve-3d', ...style }}>
    <Img src={cover(id)} style={{ position: 'absolute', inset: 0, width: size, height: size, borderRadius: 3, boxShadow: '0 22px 50px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,0,0,0.25)', display: 'block' }} />
    {/* lomo y cantos */}
    <div style={{ position: 'absolute', left: 0, top: 0, width: depth, height: size, transformOrigin: 'left center', transform: 'rotateY(90deg)', background: 'linear-gradient(90deg, #3a2a1d, #6b4d32)' }} />
    <div style={{ position: 'absolute', left: 0, top: size - depth, width: size, height: depth, transformOrigin: 'center bottom', transform: 'rotateX(90deg)', background: 'repeating-linear-gradient(90deg, #efe5cf 0 2px, #d9cbb0 2px 3px)' }} />
    {shade > 0 && <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${shade})`, borderRadius: 3 }} />}
  </div>
);

// Imagen de LibriVox (captura 4K de una ventana de 1280×720 CSS)
export const Shot: React.FC<{ name: string; w: number; h?: number; style?: React.CSSProperties }> = ({ name, w, h, style }) => (
  <Img src={lvWeb(name)} style={{ width: w, height: h ?? (w * 720) / 1280, display: 'block', ...style }} />
);

// Proyección de un punto del mundo (coordenadas del `Rig`) a la pantalla (1920×1080), con la misma cámara: sirve para
// que un objeto de pantalla (una etiqueta, un cursor…) salga exactamente de un punto del espacio 3D.
export const project = (cam: Cam, X: number, Y: number, Z: number, persp = 1700) => {
  let x = X - cam.x, y = Y - cam.y, z = Z;
  const rz = ((cam.rz ?? 0) * Math.PI) / 180;
  [x, y] = [x * Math.cos(rz) - y * Math.sin(rz), x * Math.sin(rz) + y * Math.cos(rz)];
  const ry = (cam.ry * Math.PI) / 180;
  [x, z] = [x * Math.cos(ry) + z * Math.sin(ry), -x * Math.sin(ry) + z * Math.cos(ry)];
  const rx = (cam.rx * Math.PI) / 180;
  [y, z] = [y * Math.cos(rx) - z * Math.sin(rx), y * Math.sin(rx) + z * Math.cos(rx)];
  z += cam.z;
  const k = persp / (persp - z);
  return { x: 960 + x * k, y: 540 + y * k, k };
};

// Valor por tramos con curva (para desplazamientos de página, opacidades…): [[fotograma, valor], …]. Dos claves con el
// mismo fotograma = salto.
export const seg = (f: number, keys: [number, number][], easing = eIO) => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [a, va] = keys[i], [b, vb] = keys[i + 1];
    if (f < b && b > a) return lerp(va, vb, easing(Math.min(1, Math.max(0, (f - a) / (b - a)))));
  }
  return keys[keys.length - 1][1];
};

// Cifra dorada con volumen (capas detrás) y un brillo que la recorre
export const GoldText: React.FC<{ text: string; size: number; on?: number; sweep?: number; layers?: number }> = ({ text, size, on = 1, sweep = 0, layers = 10 }) => (
  <div style={{ position: 'relative', fontFamily: T.serif, fontWeight: 500, fontSize: size, lineHeight: 1, letterSpacing: -size * 0.03, transformStyle: 'preserve-3d', whiteSpace: 'nowrap' }}>
    {Array.from({ length: layers }, (_, i) => (
      <div key={i} style={{ position: 'absolute', inset: 0, transform: `translateZ(${-(i + 1) * size * 0.0085}px)`, color: `rgb(${120 - i * 8}, ${86 - i * 6}, ${44 - i * 3})`, opacity: on }}>{text}</div>
    ))}
    <div style={{ position: 'relative', opacity: on,
      backgroundImage: `linear-gradient(100deg, ${T.goldDeep} 0%, ${T.gold} ${sweep * 100 - 20}%, #fff4d6 ${sweep * 100}%, ${T.gold} ${sweep * 100 + 20}%, ${T.goldDeep} 100%)`,
      WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{text}</div>
  </div>
);
