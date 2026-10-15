import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import BOXES from '../../../public/eb/web/boxes.json';
import { eIO, eOut, ramp, rnd, sp } from '../lv3/kit';

// Primitivas compartidas con el vídeo de LibriVox (curvas, muelles, cámara 3D). El aspecto es otro: ver abajo.
export { At, eIO, eOut, eSine, eSoft, follow, lerp, project, ramp, Rig, rnd, seg, Space, sp } from '../lv3/kit';
export type { Cam, Key } from '../lv3/kit';

// ---------------------------------------------------------------------------------------------------------------
// «La puerta»: el sistema visual del vídeo de eBiblio.
// Un mundo de día, gráfico y plano, con el grano de imprenta de las ilustraciones de su identidad (Sandra Rilova): los
// colores de eBiblio (coral, rosa, ciruela, oliva y mostaza sobre hueso), titulares en Poppins como en sus carteles y
// la puerta entreabierta de su logotipo como motivo: las puertas abren cada capítulo. El amarillo de SonorBooks solo en
// la marca. Nada de la noche, el papel y la tinta de LibriVox.
// ---------------------------------------------------------------------------------------------------------------
export const E = {
  coral: '#E37353', coralDeep: '#C85A3C', coralLight: '#F09A80', coralPale: '#F8C9B8',
  pink: '#E88297', pinkDeep: '#D0667D', pinkLight: '#F4BAC6', pinkPale: '#FBE3E7',
  plum: '#68417A', plumDeep: '#4A2C5A', violet: '#7B5A98', lilac: '#C3B0D6', lilacPale: '#ECE4F3',
  olive: '#54522B', oliveMid: '#7C7A45', oliveLight: '#B5B47E', sage: '#DAD9B8',
  mustard: '#E0AE45', mustardDeep: '#C08F2A', mustardLight: '#F2D38C', mustardPale: '#FAEBC7',
  bone: '#EDE5DA', paper: '#FBF7F1', boneDeep: '#D9CDBE',
  ink: '#0F1521', ink2: '#2B2F3D', inkSoft: '#5D6070', inkFaint: '#9A9BA6',
  orange: '#E95D0E', // el naranja del logotipo y de la app
  red: '#AD1519', // el rojo de eBiblio Madrid (solo en su web)
  green: '#2E8B57', greenLight: '#BFE3CC', // «disponible»
  yellow: '#FFCA05', // SonorBooks
  sky: '#FCE9C8',
  font: 'Poppins, sans-serif',
  ui: 'Roboto, "Helvetica Neue", Arial, sans-serif',
  web: '"Source Sans 3", "Source Sans Pro", "Helvetica Neue", Arial, sans-serif',
};
export const ebImg = (n: string) => staticFile(`eb/img/${n}`);
export const ebWeb = (n: string) => staticFile(`eb/web/${n}.png`);
export type Box = [number, number, number, number];
export const BOX = BOXES as unknown as Record<string, unknown>;
export const box = (k: string) => BOX[k] as Box;
// miles con punto también en las cifras de cuatro dígitos (1.998, 3.186), como en la locución y la página
export const es = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

// Pop con un poco de rebote (los objetos planos «llegan» con energía); `soft` sin rebote.
export const pop = (frame: number, at: number, fps: number, k = 170, d = 13) => sp(frame, at, fps, k, d);
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// ---------------------------------------------------------------------------------------------------------------
// Textura
// ---------------------------------------------------------------------------------------------------------------
// Grano de imprenta por encima de todo (multiply). Cambia cada `step` fotogramas, como el papel de una tirada; en el vídeo,
// cada 12 (unas cuatro veces por segundo) y al 40 %: con más cambios el archivo se dispara (76 Mb/s a CRF 16) y YouTube lo
// emborrona al recomprimir.
export const Grain: React.FC<{ o?: number; step?: number }> = ({ o = 0.55, step = 3 }) => {
  const frame = useCurrentFrame();
  const k = Math.floor(frame / step);
  return <AbsoluteFill style={{ pointerEvents: 'none', backgroundImage: `url(${ebImg('grain.png')})`, backgroundSize: '512px 512px',
    backgroundPosition: `${Math.floor(rnd(k + 5) * 512)}px ${Math.floor(rnd(k + 71) * 512)}px`, mixBlendMode: 'multiply', opacity: o }} />;
};
// Sombreado punteado (como en las ilustraciones de eBiblio): una capa de color con una máscara de puntos en degradado.
// kind: 'v' (denso arriba), 'h' (denso a la izquierda), 'r' (denso en los bordes). flip invierte el sentido.
export const Stip: React.FC<{ kind?: 'v' | 'h' | 'r'; flip?: boolean; color?: string; o?: number; style?: React.CSSProperties }> = ({ kind = 'v', flip, color = E.ink, o = 0.3, style }) => {
  const m = `url(${ebImg(`st_${kind}.png`)})`;
  return <div style={{ position: 'absolute', inset: 0, background: color, opacity: o, pointerEvents: 'none', borderRadius: 'inherit',
    WebkitMaskImage: m, maskImage: m, WebkitMaskSize: '100% 100%', maskSize: '100% 100%', transform: flip ? (kind === 'h' ? 'scaleX(-1)' : 'scaleY(-1)') : undefined, ...style }} />;
};

// ---------------------------------------------------------------------------------------------------------------
// Tipografía
// ---------------------------------------------------------------------------------------------------------------
// Titular en Poppins que entra palabra a palabra (cada palabra sube y se asienta con un pequeño rebote)
export const Words: React.FC<{ text: string; at: number; size: number; color?: string; weight?: number; stagger?: number; lh?: number; align?: 'left' | 'center' | 'right'; style?: React.CSSProperties; maxW?: number; spacing?: number }> = ({
  text, at, size, color = E.ink, weight = 800, stagger = 3, lh = 1.04, align = 'center', style, maxW, spacing = -0.02,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = text.split('\n');
  let k = 0;
  return (
    <div style={{ fontFamily: E.font, fontWeight: weight, fontSize: size, lineHeight: lh, color, textAlign: align, letterSpacing: `${spacing}em`, maxWidth: maxW, ...style }}>
      {lines.map((ln, li) => (
        <div key={li} style={{ whiteSpace: 'nowrap' }}>
          {ln.split(' ').map((wd, i) => {
            const s = pop(frame, at + (k++) * stagger, fps, 210, 15);
            return <span key={i} style={{ display: 'inline-block', opacity: Math.min(1, s * 1.6), transform: `translateY(${(1 - s) * size * 0.45}px) scale(${0.9 + 0.1 * s})`, transformOrigin: '50% 80%', marginRight: '0.26em' }}>{wd}</span>;
          })}
        </div>
      ))}
    </div>
  );
};

// Etiqueta (píldora) con borde de tinta, como las cartelas de la identidad
export const Tag: React.FC<{ children: React.ReactNode; bg?: string; color?: string; size?: number; style?: React.CSSProperties; border?: string }> = ({ children, bg = E.paper, color = E.ink, size = 34, style, border }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.35, padding: `${size * 0.32}px ${size * 0.7}px`, borderRadius: 999, background: bg, color, fontFamily: E.font, fontWeight: 600, fontSize: size,
    lineHeight: 1.1, whiteSpace: 'nowrap', boxShadow: border ? `inset 0 0 0 ${Math.max(2, size * 0.08)}px ${border}` : undefined, ...style }}>{children}</div>
);

// ---------------------------------------------------------------------------------------------------------------
// Fondos planos: una pared, un zócalo y un suelo, con el grano y un punteado suave en las esquinas
// ---------------------------------------------------------------------------------------------------------------
export type Hole = [number, number, number, number]; // x, y, ancho, alto (en la composición del fondo)
export const holePath = (h: Hole, W = 1920, H = 1080, m = 400) => {
  const [x, y, w, hh] = h;
  return `polygon(evenodd, ${-m}px ${-m}px, ${W + m}px ${-m}px, ${W + m}px ${H + m}px, ${-m}px ${H + m}px, ${-m}px ${-m}px, ${x}px ${y}px, ${x}px ${y + hh}px, ${x + w}px ${y + hh}px, ${x + w}px ${y}px, ${x}px ${y}px)`;
};
export const Room: React.FC<{ wall: string; floor?: string; base?: string; floorY?: number; children?: React.ReactNode; shade?: number; style?: React.CSSProperties; hole?: Hole }> = ({
  wall, floor, base, floorY = 820, children, shade = 0.16, style, hole,
}) => (
  <AbsoluteFill style={{ overflow: 'visible', ...style }}>
    <AbsoluteFill style={{ clipPath: hole ? holePath(hole) : undefined }}>
      <div style={{ position: 'absolute', left: -400, top: -400, right: -400, bottom: -400, background: wall }} />
      <Stip kind="r" o={shade} />
      {floor && (
        <div style={{ position: 'absolute', left: -400, right: -400, top: floorY, bottom: -400, background: floor }}>
          <Stip kind="v" o={0.22} />
        </div>
      )}
      {base && <div style={{ position: 'absolute', left: -400, right: -400, top: floorY - 26, height: 26, background: base }} />}
    </AbsoluteFill>
    {children}
  </AbsoluteFill>
);

// Destello plano: un círculo de luz que se expande y desaparece (cuando algo «se enciende»)
export const Burst: React.FC<{ at: number; x: number; y: number; r?: number; color?: string; rays?: number }> = ({ at, x, y, r = 120, color = E.mustard, rays = 10 }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, at, at + 22, eOut);
  if (p <= 0 || p >= 1) return null;
  return (
    <svg style={{ position: 'absolute', left: x - r * 1.6, top: y - r * 1.6, width: r * 3.2, height: r * 3.2, overflow: 'visible', pointerEvents: 'none' }} viewBox={`${-r * 1.6} ${-r * 1.6} ${r * 3.2} ${r * 3.2}`}>
      {Array.from({ length: rays }, (_, i) => {
        const a = (i / rays) * Math.PI * 2 + 0.3;
        const r0 = r * (0.55 + 0.75 * p), r1 = r * (0.75 + 0.85 * p);
        return <line key={i} x1={Math.cos(a) * r0} y1={Math.sin(a) * r0} x2={Math.cos(a) * r1} y2={Math.sin(a) * r1} stroke={color} strokeWidth={10 * (1 - p) + 2} strokeLinecap="round" opacity={1 - p * p} />;
      })}
    </svg>
  );
};

// Marca circular que se dibuja alrededor de algo (rotulador coral)
export const Ring: React.FC<{ at: number; w: number; h: number; color?: string; width?: number; dur?: number; style?: React.CSSProperties; radius?: number; out?: number }> = ({ at, w, h, color = E.coral, width = 7, dur = 16, style, radius, out }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, at, at + dur, eIO);
  const o = out ? 1 - ramp(frame, out, out + 10, eIO) : 1;
  if (p <= 0 || o <= 0) return null;
  const r = radius ?? Math.min(w, h) / 2;
  const per = 2 * (w + h - 4 * r) + 2 * Math.PI * r;
  return (
    <svg style={{ position: 'absolute', overflow: 'visible', pointerEvents: 'none', opacity: o, ...style }} width={w} height={h}>
      <rect x={0} y={0} width={w} height={h} rx={r} ry={r} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={per} strokeDashoffset={per * (1 - p)} />
    </svg>
  );
};

// Logotipo de eBiblio (el oficial, recortado de su web): 'color' o 'white'
export const EbLogo: React.FC<{ w: number; white?: boolean; style?: React.CSSProperties }> = ({ w, white, style }) => (
  <Img src={ebImg(white ? 'ebiblio_logo_white.png' : 'ebiblio_logo.png')} style={{ width: w, height: 'auto', display: 'block', ...style }} />
);

// Tono que «respira» (para luces y brillos)
export const breathe = (frame: number, speed = 0.06, amp = 0.08) => 1 - amp + amp * Math.sin(frame * speed);
// Balanceo suave determinista (plantas, carteles)
export const sway = (frame: number, seed: number, amp = 2, speed = 0.045) => Math.sin(frame * speed + seed * 1.7) * amp;
// Escalonado
export const stag = (frame: number, at: number, i: number, step: number, dur: number, easing = eOut) => ramp(frame, at + i * step, at + i * step + dur, easing);
export { eIO as ease };
