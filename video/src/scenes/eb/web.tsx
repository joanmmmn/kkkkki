import React from 'react';
import { Img, useCurrentFrame } from 'remotion';
import { Box, box, BOX, E, ebWeb, eIO, eOut, ramp } from './kit';
import { Hand } from './props';

// ---------------------------------------------------------------------------------------------------------------
// Capturas reales de las páginas públicas de eBiblio (tools/eb_capture.mjs, 14/10/2026): la página a 1280 px CSS de
// ancho (imagen a 3×), desplazada `scroll` px. Los hijos se dibujan en coordenadas de página.
// ---------------------------------------------------------------------------------------------------------------
export const pageH = (name: string) => (BOX[`${name}:height`] as number) ?? 720;

export const Page: React.FC<{ name: string; scroll?: number; children?: React.ReactNode; vh?: number }> = ({ name, scroll = 0, children, vh = 720 }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 1280, height: vh, overflow: 'hidden', background: '#fff' }}>
    <div style={{ position: 'absolute', left: 0, top: -scroll, width: 1280, height: pageH(name) }}>
      <Img src={ebWeb(name)} style={{ position: 'absolute', left: 0, top: 0, width: 1280, height: pageH(name) }} />
      {children}
    </div>
  </div>
);

// Marca alrededor de una caja de la página (rotulador coral que se dibuja)
export const Mark: React.FC<{ b: Box; at: number; pad?: number; color?: string; out?: number; radius?: number; width?: number }> = ({ b, at, pad = 8, color = E.coral, out, radius, width = 5 }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, at, at + 14, eIO);
  const o = out ? 1 - ramp(frame, out, out + 10, eIO) : 1;
  if (p <= 0 || o <= 0) return null;
  const [x, y, w, h] = b;
  const W = w + pad * 2, H = h + pad * 2, r = radius ?? Math.min(14, H / 2);
  const per = 2 * (W + H - 4 * r) + 2 * Math.PI * r;
  return (
    <svg style={{ position: 'absolute', left: x - pad, top: y - pad, overflow: 'visible', opacity: o, pointerEvents: 'none' }} width={W} height={H}>
      <rect x={0} y={0} width={W} height={H} rx={r} fill={`${color}14`} stroke={color} strokeWidth={width} strokeDasharray={per} strokeDashoffset={per * (1 - p)} strokeLinecap="round" />
    </svg>
  );
};

// Mano que señala: se desplaza a (x, y) de la página y pulsa en `click`
export const Pointer: React.FC<{ from: [number, number]; to: [number, number]; at: number; click?: number; size?: number; o?: number }> = ({ from, to, at, click, size = 70, o = 1 }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, at, at + 22, eIO);
  const x = from[0] + (to[0] - from[0]) * p, y = from[1] + (to[1] - from[1]) * p;
  const press = click !== undefined ? ramp(frame, click - 3, click, eOut) * (1 - ramp(frame, click, click + 8, eOut)) : 0;
  const ring = click !== undefined ? ramp(frame, click, click + 16, eOut) : 0;
  const appear = ramp(frame, at - 8, at + 4, eOut);
  if (appear <= 0) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 0, height: 0, opacity: appear * o, pointerEvents: 'none' }}>
      {ring > 0 && ring < 1 && <div style={{ position: 'absolute', left: -40 * ring, top: -40 * ring, width: 80 * ring, height: 80 * ring, borderRadius: '50%', border: `4px solid ${E.coral}`, opacity: 1 - ring }} />}
      <div style={{ position: 'absolute', left: 0, top: 0 }}><Hand size={size} press={press} /></div>
    </div>
  );
};
export const bx = box;
// centro de una caja
export const mid = (b: Box): [number, number] => [b[0] + b[2] / 2, b[1] + b[3] / 2];

// Recorte de una captura: la región [x, y, w, h] (px CSS de página) a escala `k`, como una tarjeta
export const Crop: React.FC<{ name: string; r: Box; k: number; style?: React.CSSProperties; children?: React.ReactNode; radius?: number }> = ({ name, r, k, style, children, radius = 18 }) => {
  const [x, y, w, h] = r;
  return (
    <div style={{ position: 'relative', width: w * k, height: h * k, overflow: 'hidden', borderRadius: radius, background: '#fff', ...style }}>
      <div style={{ position: 'absolute', left: -x * k, top: -y * k, width: 1280 * k, height: pageH(name) * k }}>
        <Img src={ebWeb(name)} style={{ position: 'absolute', left: 0, top: 0, width: 1280 * k, height: pageH(name) * k }} />
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1280, height: pageH(name), transform: `scale(${k})`, transformOrigin: '0 0' }}>{children}</div>
      </div>
    </div>
  );
};
