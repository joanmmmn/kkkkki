import React from 'react';
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, Key, keyframes } from '../../lib/anim';
import { P } from './kit';

// ————————————————————————————————————————————————————————————————
// v2 · «Teatro de sombras de papel».
// Cada plano es un diorama de capas de papel recortado (siluetas) delante de un fondo iluminado. La cámara se mueve con
// paralaje (cada capa a su profundidad) y la textura de fibras de papel va por encima de todo. Solo las mariposas
// amarillas (y algún objeto clave) llevan color: el realismo mágico.
// ————————————————————————————————————————————————————————————————

// ———————————————— Color ————————————————
const hex = (c: string) => {
  const h = c.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((x) => x + x).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
// Mezcla dos colores (#rrggbb): t = 0 → a, t = 1 → b. Sirve para la perspectiva atmosférica de las capas lejanas.
export const mix = (a: string, b: string, t: number) => {
  const A = hex(a), B = hex(b);
  const k = Math.max(0, Math.min(1, t));
  return `#${A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join('')}`;
};
export const rgba = (c: string, a: number) => {
  const [r, g, b] = hex(c);
  return `rgba(${r},${g},${b},${a})`;
};

// ———————————————— Cámara con paralaje ————————————————
// La cámara mira el punto (x, y) del plano de referencia (profundidad 1) con zoom s. Una capa a profundidad z se desplaza
// z veces lo que se mueve la cámara y escala s^z: el fondo (z pequeño) apenas se mueve y el primer plano (z > 1) corre.
export type CamS = { x: number; y: number; s: number; r: number };
export type CamKey = Key & { x: number; y: number; s: number; r?: number };
const CamCtx = React.createContext<CamS>({ x: 960, y: 540, s: 1, r: 0 });

export const useCamera = (keys: CamKey[], drift = 1, ease = easeInOut): CamS => {
  const frame = useCurrentFrame();
  const k = (p: string) => keyframes(frame, keys, p, ease);
  const r = keys.some((q) => q.r !== undefined) ? k('r') : 0;
  // cámara al hombro muy suave: el plano respira
  const dx = drift * (Math.sin(frame / 61) * 3.2 + Math.sin(frame / 23 + 1) * 0.9);
  const dy = drift * (Math.cos(frame / 73) * 2.4 + Math.sin(frame / 29 + 2) * 0.7);
  return { x: k('x') + dx, y: k('y') + dy, s: k('s'), r };
};

export const Rig: React.FC<{ cam: CamS; children: React.ReactNode; bg?: string }> = ({ cam, children, bg }) => (
  <CamCtx.Provider value={cam}>
    <AbsoluteFill style={{ overflow: 'hidden', background: bg }}>{children}</AbsoluteFill>
  </CamCtx.Provider>
);

export const useLayer = (z: number) => {
  const cam = React.useContext(CamCtx);
  const cx = 960 + (cam.x - 960) * z;
  const cy = 540 + (cam.y - 540) * z;
  const s = Math.pow(cam.s, z);
  return { cx, cy, s, r: cam.r * z };
};

// Capa a profundidad z. Por defecto un SVG de 1920×1080 (coordenadas de escena); `html` para meter HTML.
export const Layer: React.FC<{ z: number; children: React.ReactNode; html?: boolean; opacity?: number; blur?: number; style?: React.CSSProperties }> = ({
  z, children, html = false, opacity = 1, blur = 0, style,
}) => {
  const { cx, cy, s, r } = useLayer(z);
  if (opacity <= 0.001) return null;
  return (
    <AbsoluteFill style={{ transform: `scale(${s.toFixed(5)}) rotate(${r.toFixed(3)}deg) translate(${(960 - cx).toFixed(2)}px, ${(540 - cy).toFixed(2)}px)`, transformOrigin: '960px 540px',
      opacity, filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined, ...style }}>
      {html ? children : <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ overflow: 'visible' }}>{children}</svg>}
    </AbsoluteFill>
  );
};

// ———————————————— Fondos y acabado ————————————————
// Caja de luz: degradado vertical + resplandores radiales (luna, farola, lámpara, sol).
export type Glow = { x: number; y: number; r: number; c: string; a: number };
export const Sky: React.FC<{ stops: [number, string][]; glows?: Glow[]; angle?: number }> = ({ stops, glows = [], angle = 180 }) => (
  <AbsoluteFill style={{ background: `linear-gradient(${angle}deg, ${stops.map(([p, c]) => `${c} ${p}%`).join(', ')})` }}>
    {glows.map((g, i) => (
      <div key={i} style={{ position: 'absolute', left: g.x - g.r, top: g.y - g.r, width: g.r * 2, height: g.r * 2, borderRadius: '50%',
        background: `radial-gradient(circle, ${rgba(g.c, g.a)} 0%, ${rgba(g.c, g.a * 0.45)} 30%, ${rgba(g.c, 0)} 70%)` }} />
    ))}
  </AbsoluteFill>
);

// Fibras de papel por encima de todo (tools/hdl_v2_tex.py) + viñeta. `still` congela la textura (por defecto tiembla un
// píxel cada pocos fotogramas, como el papel filmado fotograma a fotograma).
export const PaperFinish: React.FC<{ opacity?: number; vignette?: number; still?: boolean; warm?: number }> = ({ opacity = 0.55, vignette = 0.55, still = false, warm = 0 }) => {
  const frame = useCurrentFrame();
  const j = still ? 0 : Math.floor(frame / 4);
  const ox = Math.round((random(`fx${j}`) - 0.5) * 6);
  const oy = Math.round((random(`fy${j}`) - 0.5) * 6);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <Img src={staticFile('hdl/img/fiber.png')} style={{ position: 'absolute', left: -6 + ox, top: -6 + oy, width: 1932, height: 1092, opacity }} />
      {warm > 0 && <AbsoluteFill style={{ background: 'rgba(255,170,90,1)', opacity: 0.06 * warm }} />}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 48%, rgba(8,5,2,${vignette}) 100%)` }} />
    </AbsoluteFill>
  );
};

// Haz de luz (cono) con degradado: farolas, faros, la lámpara del mostrador.
export const Beam: React.FC<{ x: number; y: number; w0: number; w1: number; len: number; rot?: number; c?: string; a?: number }> = ({ x, y, w0, w1, len, rot = 0, c = '#FFD98A', a = 0.25 }) => {
  const id = React.useId().replace(/:/g, '');
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <defs>
        <linearGradient id={`bm${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c} stopOpacity={a} />
          <stop offset="1" stopColor={c} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={`M ${-w0 / 2} 0 L ${w0 / 2} 0 L ${w1 / 2} ${len} L ${-w1 / 2} ${len} Z`} fill={`url(#bm${id})`} />
    </g>
  );
};

// Resplandor redondo dentro de un SVG.
export const Halo: React.FC<{ x: number; y: number; r: number; c?: string; a?: number }> = ({ x, y, r, c = '#FFD98A', a = 0.5 }) => {
  const id = React.useId().replace(/:/g, '');
  return (
    <g>
      <defs>
        <radialGradient id={`hl${id}`}>
          <stop offset="0" stopColor={c} stopOpacity={a} />
          <stop offset="0.35" stopColor={c} stopOpacity={a * 0.4} />
          <stop offset="1" stopColor={c} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r} fill={`url(#hl${id})`} />
    </g>
  );
};

// ———————————————— Marionetas de papel ————————————————
// Siluetas de perfil, articuladas (cadera, rodillas, hombros, codos, cuello). Nunca retratos: perfiles genéricos.
// Unidades: ~195 de alto de pie, origen en los pies, mirando a la derecha (`face = -1` mira a la izquierda).
export type Pose = {
  lean?: number; neck?: number; // inclinación del tronco y de la cabeza (grados, + hacia delante)
  shF?: number; elF?: number; shB?: number; elB?: number; // brazo delantero / trasero: hombro (desde abajo, + adelante) y codo (+ flexiona hacia delante)
  hipF?: number; knF?: number; hipB?: number; knB?: number; // pierna delantera / trasera: cadera (+ adelante) y rodilla (+ flexiona hacia atrás)
  bob?: number; // subida/bajada de la cadera
};
export type Kind = 'man' | 'woman' | 'boy' | 'girl' | 'grandma';
export type Hair = 'curly' | 'short' | 'bob' | 'bun' | 'kid' | 'cap' | 'visor' | 'bald' | 'side';

const D2R = Math.PI / 180;
const dn = (deg: number, len: number): [number, number] => [Math.sin(deg * D2R) * len, Math.cos(deg * D2R) * len];
const add = (a: [number, number], b: [number, number]): [number, number] => [a[0] + b[0], a[1] + b[1]];

// Ciclo de marcha: fase en radianes (avanza ~ 2π por paso doble).
export const walkPose = (ph: number, amp = 1, lean = 3): Pose => ({
  lean,
  hipF: 24 * amp * Math.sin(ph), knF: Math.max(0, 34 * amp * Math.sin(ph - 1.3)) + 4,
  hipB: -24 * amp * Math.sin(ph), knB: Math.max(0, -34 * amp * Math.sin(ph - 1.3)) + 4,
  shF: -20 * amp * Math.sin(ph), elF: 16 + 8 * Math.sin(ph),
  shB: 20 * amp * Math.sin(ph), elB: 16 - 8 * Math.sin(ph),
  bob: -Math.abs(Math.cos(ph)) * 3 * amp,
});
export const sitPose = (o: Pose = {}): Pose => ({ lean: 6, hipF: 86, knF: 88, hipB: 80, knB: 84, shF: 10, elF: 60, shB: 6, elB: 66, ...o });

export type Skel = { hip: [number, number]; neck: [number, number]; shoulder: [number, number]; elbowF: [number, number]; handF: [number, number]; elbowB: [number, number]; handB: [number, number]; head: [number, number]; foreF: number; foreB: number };

const KINDS: Record<Kind, { s: number; head: number; thigh: number; shin: number; leg: number; torso: number; arm: number }> = {
  man: { s: 1, head: 1, thigh: 46, shin: 47, leg: 17, torso: 62, arm: 11 },
  woman: { s: 0.95, head: 0.96, thigh: 45, shin: 46, leg: 11, torso: 58, arm: 9 },
  grandma: { s: 0.9, head: 1, thigh: 42, shin: 42, leg: 11, torso: 56, arm: 9.5 },
  boy: { s: 0.62, head: 1.28, thigh: 40, shin: 40, leg: 15, torso: 54, arm: 11 },
  girl: { s: 0.6, head: 1.28, thigh: 40, shin: 40, leg: 11, torso: 52, arm: 10 },
};

// Esqueleto en coordenadas locales (sin escala ni espejo) — para colocar objetos en las manos.
export const skeleton = (kind: Kind, pose: Pose): Skel => {
  const K = KINDS[kind];
  const lean = pose.lean ?? 0;
  const hip: [number, number] = [0, -(K.thigh + K.shin + 3) + (pose.bob ?? 0)];
  const neck = add(hip, [Math.sin(lean * D2R) * K.torso, -Math.cos(lean * D2R) * K.torso]);
  const shoulder = add(neck, [Math.sin(lean * D2R) * -9 + 1, Math.cos(lean * D2R) * 9]);
  const ua = 33, fa = 31;
  const aF = lean + (pose.shF ?? 4), aB = lean + (pose.shB ?? -4);
  const elbowF = add(shoulder, dn(aF, ua));
  const foreF = aF + (pose.elF ?? 10);
  const handF = add(elbowF, dn(foreF, fa));
  const elbowB = add(shoulder, dn(aB, ua));
  const foreB = aB + (pose.elB ?? 10);
  const handB = add(elbowB, dn(foreB, fa));
  const head = add(neck, [Math.sin((lean + (pose.neck ?? 0)) * D2R) * 7, -Math.cos((lean + (pose.neck ?? 0)) * D2R) * 7]);
  return { hip, neck, shoulder, elbowF, handF, elbowB, handB, head, foreF, foreB };
};

// Cabeza de perfil (diseñada a 100 de alto, origen en la base del cuello, mirando a la derecha).
const HEAD = 'M -18 0 C -20 -20, -38 -30, -38 -58 C -38 -90, -12 -104, 10 -102 C 30 -100, 40 -86, 40 -70 C 40 -66, 41 -62, 42 -60 L 52 -46 C 53 -44, 52 -42, 49 -42 L 46 -41 C 47 -39, 47 -37, 45 -36 C 47 -34, 46 -31, 44 -30 C 46 -26, 44 -18, 36 -17 C 26 -16, 18 -12, 14 0 Z';
const HEAD_KID = 'M -18 0 C -22 -18, -42 -30, -42 -60 C -42 -94, -14 -108, 10 -104 C 32 -100, 42 -86, 42 -68 C 42 -62, 44 -58, 47 -52 C 48 -49, 47 -47, 44 -47 L 43 -44 C 44 -42, 43 -39, 41 -38 C 43 -34, 40 -24, 32 -21 C 24 -18, 16 -12, 12 0 Z';
const HAIR: Record<Hair, React.ReactNode> = {
  curly: (
    <g>
      {[[-34, -62, 17], [-32, -82, 18], [-18, -97, 18], [0, -106, 17], [18, -103, 15], [31, -94, 11], [-41, -44, 12], [-28, -38, 12], [-10, -86, 14], [8, -92, 13]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} />)}
    </g>
  ),
  short: <path d="M 36 -86 C 30 -104, 6 -110, -12 -106 C -34 -100, -44 -80, -40 -58 C -38 -50, -34 -46, -30 -44 C -30 -60, -26 -74, -14 -80 C 0 -86, 20 -84, 36 -86 Z" />,
  side: <path d="M 38 -84 C 34 -106, 4 -112, -16 -106 C -38 -98, -46 -78, -40 -52 C -36 -46, -34 -44, -30 -42 C -32 -62, -24 -78, -6 -84 C 10 -90, 26 -80, 38 -84 Z" />,
  bob: <path d="M 34 -88 C 28 -108, 0 -114, -20 -108 C -46 -98, -52 -70, -50 -44 C -50 -28, -44 -14, -30 -10 C -36 -24, -36 -38, -32 -50 C -30 -66, -22 -80, -6 -86 C 10 -92, 26 -82, 34 -88 Z" />,
  bun: (
    <g>
      <path d="M 34 -86 C 28 -104, 4 -110, -14 -106 C -36 -100, -44 -80, -40 -58 C -38 -52, -34 -48, -30 -46 C -30 -62, -26 -74, -14 -80 C 0 -86, 20 -82, 34 -86 Z" />
      <circle cx={-46} cy={-74} r={15} />
    </g>
  ),
  kid: <path d="M 38 -84 C 34 -108, 2 -116, -20 -108 C -42 -100, -48 -76, -42 -54 C -38 -48, -36 -46, -32 -44 C -34 -60, -28 -76, -12 -80 C 4 -86, 24 -78, 38 -84 Z M 30 -86 L 40 -92 L 34 -82 Z" />,
  cap: (
    <g>
      <path d="M -40 -70 C -42 -96, -10 -110, 14 -106 C 34 -104, 40 -92, 38 -78 Z" />
      <path d="M 26 -80 L 62 -74 C 64 -72, 60 -70, 56 -70 L 24 -72 Z" />
      <rect x={-42} y={-76} width={80} height={8} rx={3} />
    </g>
  ),
  visor: (
    <g>
      <path d="M -38 -66 C -40 -94, -10 -106, 12 -104 C 32 -102, 40 -90, 38 -76 Z" />
      <path d="M 24 -78 L 64 -70 C 66 -68, 60 -66, 54 -66 L 22 -70 Z" />
    </g>
  ),
  bald: <path d="M -38 -60 C -40 -54, -36 -48, -30 -46 C -32 -54, -32 -58, -30 -62 Z" />,
};

export const Person: React.FC<{
  x: number; y: number; scale?: number; face?: 1 | -1; kind?: Kind; hair?: Hair; mustache?: boolean; pose?: Pose; c?: string; back?: string; glasses?: boolean;
  front?: React.ReactNode; // objeto en la mano delantera (se dibuja en coordenadas de la mano, girado con el antebrazo)
  frontRot?: number;
  idle?: number; // vida en reposo: la cabeza y el tronco respiran un poco (0 = quieto)
}> = ({ x, y, scale = 1, face = 1, kind = 'man', hair = 'short', mustache = false, pose: pose0 = {}, c = P.ink, back, glasses = false, front, frontRot = 0, idle = 1 }) => {
  const K = KINDS[kind];
  const frame = useCurrentFrame();
  const seed = x * 0.013 + y * 0.007 + (kind.length * 1.7);
  const pose: Pose = idle > 0
    ? { ...pose0, lean: (pose0.lean ?? 0) + idle * Math.sin(frame / 63 + seed) * 0.7, neck: (pose0.neck ?? 0) + idle * (Math.sin(frame / 41 + seed * 1.3) * 1.8 + Math.sin(frame / 17 + seed * 2.1) * 0.5) }
    : pose0;
  const sk = skeleton(kind, pose);
  const lean = pose.lean ?? 0;
  const bc = back ?? c;
  const female = kind === 'woman' || kind === 'girl' || kind === 'grandma';
  // miembro ahusado: cuadrilátero de p0 a p1 con anchos w0 → w1 y articulaciones redondas
  const seg = (p0: [number, number], p1: [number, number], w0: number, w1: number) => {
    const dx = p1[0] - p0[0], dy = p1[1] - p0[1];
    const L = Math.hypot(dx, dy) || 1;
    const nx = -dy / L, ny = dx / L;
    return `M ${p0[0] + nx * w0 / 2} ${p0[1] + ny * w0 / 2} L ${p1[0] + nx * w1 / 2} ${p1[1] + ny * w1 / 2} L ${p1[0] - nx * w1 / 2} ${p1[1] - ny * w1 / 2} L ${p0[0] - nx * w0 / 2} ${p0[1] - ny * w0 / 2} Z`;
  };
  const leg = (hipA: number, kn: number, col: string, w: number) => {
    const knee = add(sk.hip, dn(hipA, K.thigh));
    const shinA = hipA - kn;
    const ankle = add(knee, dn(shinA, K.shin));
    const fa = Math.max(-30, Math.min(40, shinA * 0.6));
    const toe = add(ankle, [Math.cos(fa * D2R) * 17, Math.sin(fa * D2R) * 17]);
    const wk = w * 0.8, wa = w * (female ? 0.5 : 0.62);
    return (
      <g fill={col}>
        <path d={seg(sk.hip, knee, w * 1.1, wk)} />
        <circle cx={knee[0]} cy={knee[1]} r={wk / 2} />
        <path d={seg(knee, ankle, wk, wa)} />
        <path d={`M ${ankle[0] - 3} ${ankle[1] - 1} L ${toe[0]} ${toe[1]}`} stroke={col} strokeWidth={female ? 6.5 : 9} strokeLinecap="round" />
        <circle cx={sk.hip[0]} cy={sk.hip[1]} r={w * 0.62} />
      </g>
    );
  };
  const arm = (el: [number, number], hand: [number, number], col: string) => (
    <g fill={col}>
      <circle cx={sk.shoulder[0]} cy={sk.shoulder[1]} r={K.arm * 0.62} />
      <path d={seg(sk.shoulder, el, K.arm * 1.15, K.arm * 0.88)} />
      <circle cx={el[0]} cy={el[1]} r={K.arm * 0.44} />
      <path d={seg(el, hand, K.arm * 0.88, K.arm * 0.66)} />
      <ellipse cx={hand[0]} cy={hand[1]} rx={K.arm * 0.5} ry={K.arm * 0.62} />
    </g>
  );
  const torso = female
    ? 'M -14 10 C -18 0, -10 -12, -10 -22 C -10 -34, -14 -46, -11 -54 C -8 -58, -5 -60, -3 -60 L 5 -59 C 10 -56, 16 -48, 16 -40 C 16 -32, 9 -28, 9 -20 C 9 -10, 14 0, 10 12 Z'
    : 'M -16 10 C -18 -2, -12 -12, -13 -22 C -14 -34, -18 -46, -14 -56 C -11 -62, -7 -64, -4 -64 L 6 -63 C 12 -60, 18 -52, 19 -42 C 20 -32, 16 -24, 16 -14 C 16 -4, 14 6, 8 14 Z';
  const skirtSwing = ((pose.hipF ?? 0) - (pose.hipB ?? 0)) * 0.15;
  const headPath = kind === 'boy' || kind === 'girl' ? HEAD_KID : HEAD;
  const hs = 0.31 * K.head;
  const fr = sk.foreF;
  return (
    <g transform={`translate(${x} ${y}) scale(${face * scale * K.s} ${scale * K.s})`}>
      {/* brazo y pierna de atrás (un pelín más claros para leer la pose) */}
      {leg(pose.hipB ?? -2, pose.knB ?? 2, bc, K.leg * (female ? 0.95 : 1))}
      {arm(sk.elbowB, sk.handB, bc)}
      {leg(pose.hipF ?? 2, pose.knF ?? 2, c, K.leg)}
      <g fill={c}>
        <g transform={`translate(${sk.hip[0]} ${sk.hip[1]}) rotate(${lean})`}>
          <path d={torso} />
          {female && kind !== 'grandma' && <path d={`M -12 -16 C -4 -18, 6 -18, 11 -16 L ${24 + skirtSwing} 48 C ${8 + skirtSwing} 52, ${-8 + skirtSwing} 52, ${-21 + skirtSwing} 48 Z`} />}
          {kind === 'grandma' && <path d={`M -13 -16 C -4 -18, 6 -18, 12 -16 L ${26 + skirtSwing} 66 C ${8 + skirtSwing} 70, ${-8 + skirtSwing} 70, ${-22 + skirtSwing} 66 Z`} />}
        </g>
        <path d={`M ${sk.neck[0]} ${sk.neck[1]} L ${sk.head[0]} ${sk.head[1]}`} stroke={c} strokeWidth={K.arm * 0.95} strokeLinecap="round" />
        <g transform={`translate(${sk.head[0]} ${sk.head[1] + 2}) rotate(${lean + (pose.neck ?? 0)}) scale(${hs})`}>
          <path d={headPath} />
          {HAIR[hair]}
          {mustache && <path d="M 46 -41 C 55 -40, 55 -33, 48 -34 C 46 -34, 44 -36, 43 -37 Z" />}
          {glasses && <path d="M 40 -66 L 46 -66 L 46 -60 L 40 -60 Z M 20 -64 L 40 -64" stroke={c} strokeWidth={3} />}
        </g>
      </g>
      {arm(sk.elbowF, sk.handF, c)}
      {front && <g transform={`translate(${sk.handF[0]} ${sk.handF[1]}) rotate(${-fr + 90 + frontRot})`}>{front}</g>}
    </g>
  );
};

// ———————————————— Manos en primer plano ————————————————
// Mano de perfil vista desde arriba/lado, para los planos de detalle: `curl` cierra los dedos (0 abierta → 1 puño),
// `pinch` junta pulgar e índice (para coger una moneda o un lápiz). Origen en la muñeca, apunta hacia +x.
export const Hand: React.FC<{ x: number; y: number; rot?: number; scale?: number; curl?: number; pinch?: number; c?: string; sleeve?: string; flip?: boolean; point?: number }> = ({
  x, y, rot = 0, scale = 1, curl = 0.15, pinch = 0, c = P.ink, sleeve, flip = false, point = 0,
}) => {
  // dedos: índice, corazón, anular, meñique (y en la palma, longitudes de falanges, grosor)
  const F: [number, number[], number][] = [[-19, [30, 21, 16], 14], [-5, [33, 23, 17], 14.5], [8, [30, 21, 16], 13.5], [20, [24, 17, 13], 12]];
  const finger = (i: number) => {
    const [fy, segs, w] = F[i];
    const k = i === 0 ? Math.max(0, curl * (1 - point) - pinch * 0.35) + pinch * 0.25 : curl;
    let px = 78 - Math.abs(fy) * 0.25, py = fy, ang = (fy * 0.25) * Math.PI / 180;
    let d = `M ${px} ${py}`;
    segs.forEach((L, j) => {
      ang += (k * (j === 0 ? 48 : 62) * Math.PI) / 180;
      px += Math.cos(ang) * L;
      py += Math.sin(ang) * L;
      d += ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
    });
    return <path key={i} d={d} stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" />;
  };
  // pulgar: sale del lado del índice y se cierra hacia la punta del índice al pellizcar
  const ta = (-36 + pinch * 34 + curl * 12) * Math.PI / 180;
  const t1: [number, number] = [26 + Math.cos(ta) * 30, -24 + Math.sin(ta) * 30];
  const tb = ta + (18 + pinch * 34) * Math.PI / 180;
  const t2: [number, number] = [t1[0] + Math.cos(tb) * 25, t1[1] + Math.sin(tb) * 25];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale} ${flip ? -scale : scale})`}>
      <path d="M -300 -36 L -6 -27 C 2 -27, 6 -24, 8 -20 L 8 22 C 6 26, 2 28, -6 28 L -300 38 Z" fill={c} />
      {sleeve && <path d="M -320 -48 L -70 -42 C -62 -16, -62 18, -70 46 L -320 52 Z" fill={sleeve} />}
      <path d="M -4 -28 C 26 -34, 60 -32, 80 -26 C 88 -14, 88 14, 80 28 C 60 34, 26 34, -4 28 Z" fill={c} />
      {[3, 2, 1, 0].map(finger)}
      <path d={`M 18 -22 L ${t1[0].toFixed(1)} ${t1[1].toFixed(1)} L ${t2[0].toFixed(1)} ${t2[1].toFixed(1)}`} stroke={c} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </g>
  );
};

// Lápiz (punta en el origen, apunta en la dirección `rot`).
export const Pencil: React.FC<{ x: number; y: number; rot: number; len?: number }> = ({ x, y, rot, len = 260 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <path d="M 0 0 L -34 -8 L -34 8 Z" fill="#E8C9A0" />
    <path d="M 0 0 L -10 -2.4 L -10 2.4 Z" fill="#2B2B30" />
    <rect x={-34 - len} y={-8} width={len} height={16} fill="#E2B33C" />
    <rect x={-34 - len} y={-8} width={len} height={5} fill="#F0C85A" />
    <rect x={-34 - len - 24} y={-8} width={24} height={16} fill="#B65A4A" />
  </g>
);

// Mano que sujeta un lápiz cuya punta está en (x, y); `ang` es la dirección del lápiz desde la punta hacia la mano.
export const WritingHand: React.FC<{ x: number; y: number; ang?: number; scale?: number; c?: string; sleeve?: string }> = ({ x, y, ang = -40, scale = 1, c = P.ink, sleeve }) => {
  const a = (ang * Math.PI) / 180;
  const hx = x + Math.cos(a) * 150 * scale, hy = y + Math.sin(a) * 150 * scale;
  return (
    <g>
      <Hand x={hx} y={hy} rot={ang + 180} scale={scale} curl={0.62} pinch={0.85} c={c} sleeve={sleeve} flip />
      <Pencil x={x} y={y} rot={ang + 180} />
    </g>
  );
};

// ———————————————— Utilidades ————————————————
// Valor entre dos fotogramas con curva suave (atajo).
export const tw = (frame: number, a: number, b: number, from = 0, to = 1, ez = easeInOut) => interpolate(frame, [a, b], [from, to], { ...clamp, easing: ez });

// Texto mecanografiado en crema sobre negro, abajo a la izquierda (lugar y fecha), como un rótulo de documental.
export const Slate: React.FC<{ text: string; a: number; b: number; out?: number; x?: number; y?: number; c?: string; size?: number }> = ({ text, a, b, out = 1e9, x = 110, y = 930, c = '#F3E9D6', size = 40 }) => {
  const frame = useCurrentFrame();
  const chars = Array.from(text);
  const n = frame < a ? 0 : Math.min(chars.length, Math.floor(interpolate(frame, [a, b], [0, chars.length], clamp)) + 1);
  const o = 1 - tw(frame, out, out + 14);
  if (o <= 0 || frame < a - 2) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, fontFamily: '"Special Elite", monospace', fontSize: size, color: c, opacity: o, letterSpacing: 1, textShadow: '0 2px 12px rgba(0,0,0,0.6)', whiteSpace: 'pre' }}>
      {chars.slice(0, n).join('')}
      <span style={{ opacity: n < chars.length || Math.floor(frame / 14) % 2 ? 1 : 0 }}>_</span>
    </div>
  );
};

// Posición en la escena de la mano delantera (o trasera) de una marioneta, para colocar objetos que lleva o suelta.
export const handAt = (x: number, y: number, scale: number, face: 1 | -1, kind: Kind, pose: Pose, which: 'F' | 'B' = 'F'): [number, number] => {
  const sk = skeleton(kind, pose);
  const h = which === 'F' ? sk.handF : sk.handB;
  const k = scale * KINDS[kind].s;
  return [x + face * k * h[0], y + k * h[1]];
};
export const kindScale = (kind: Kind) => KINDS[kind].s;

// Cabeza suelta de perfil (para ventanillas, multitudes, etc.). `h` = alto aproximado en px.
export const Head: React.FC<{ x: number; y: number; h: number; face?: 1 | -1; hair?: Hair; mustache?: boolean; kid?: boolean; c: string; tilt?: number }> = ({ x, y, h, face = 1, hair = 'short', mustache = false, kid = false, c, tilt = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${(face * h) / 110} ${h / 110}) rotate(${tilt})`} fill={c}>
    <path d={kid ? HEAD_KID : HEAD} />
    {HAIR[hair]}
    {mustache && <path d="M 46 -41 C 55 -40, 55 -33, 48 -34 C 46 -34, 44 -36, 43 -37 Z" />}
    <path d="M -18 0 L 14 0 L 24 30 L -30 30 Z" />
  </g>
);
