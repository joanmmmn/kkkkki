import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, Key, keyframes } from '../../lib/anim';
import geo from './geo.json';
import { F, P, sp, rampOut } from './kit';

type Pt = [number, number];
type Country = { id?: string; name: string; d: string; c?: Pt };
const AM = geo.am as unknown as { w: number; h: number; countries: Country[]; pts: Record<string, Pt> };
const WD = geo.world as unknown as { w: number; h: number; countries: Country[]; pts: Record<string, Pt>; sphere: string };
export const AM_PTS = AM.pts;
export const WORLD_PTS = WD.pts;
export const WORLD_COUNTRIES = WD.countries;

// Cámara de mapa: lleva el punto `c` (coordenadas del mapa) al centro de la pantalla con escala `s`.
export type MapKey = Key & { cx: number; cy: number; s: number };
export const useMapCam = (keys: MapKey[], screen: Pt = [960, 540]) => {
  const frame = useCurrentFrame();
  const k = (p: string) => keyframes(frame, keys, p, easeInOut);
  const s = k('s'), cx = k('cx'), cy = k('cy');
  const toScreen = (p: Pt): Pt => [screen[0] + (p[0] - cx) * s, screen[1] + (p[1] - cy) * s];
  return { s, cx, cy, toScreen, transform: `translate(${screen[0] - cx * s}px, ${screen[1] - cy * s}px) scale(${s})` };
};

// Mapa de América Latina (Mercator, de México a Argentina). `fill` colorea países por nombre.
export const AmericasMap: React.FC<{ transform: string; fill?: Record<string, string>; base?: string; stroke?: string; sea?: string; children?: React.ReactNode; labels?: { name: string; at: number; p: Pt; size?: number }[] }> = ({
  transform, fill = {}, base = '#E4D7BE', stroke = '#FBF5E8', sea, children, labels = [],
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: AM.w, height: AM.h, transform, transformOrigin: '0 0' }}>
      <svg width={AM.w} height={AM.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {sea && <rect x={-3000} y={-3000} width={9000} height={9000} fill={sea} />}
        {AM.countries.map((c) => <path key={c.name + c.id} d={c.d} fill={fill[c.name] ?? base} stroke={stroke} strokeWidth={1.2} vectorEffect="non-scaling-stroke" />)}
        {children}
      </svg>
      {labels.map((l) => {
        const p = rampOut(frame, l.at, l.at + 14);
        return <div key={l.name} style={{ position: 'absolute', left: l.p[0], top: l.p[1], transform: `translate(-50%, -50%) scale(${(l.size ?? 1) * 0.08})`, transformOrigin: 'center', opacity: p,
          fontFamily: F.serif, fontStyle: 'italic', fontSize: 300, color: P.ink2, whiteSpace: 'nowrap', letterSpacing: 8 }}>{l.name}</div>;
      })}
    </div>
  );
};

export const WorldMap: React.FC<{ fill?: (c: Country, i: number) => string; base?: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({ fill, base = '#E4D7BE', style, children }) => (
  <svg width={WD.w} height={WD.h} viewBox={`0 0 ${WD.w} ${WD.h}`} style={{ position: 'absolute', left: 0, top: 40, overflow: 'visible', ...style }}>
    <path d={WD.sphere} fill="rgba(156,194,207,0.18)" stroke="rgba(122,102,80,0.25)" strokeWidth={1.5} />
    {WD.countries.map((c, i) => <path key={c.name + i} d={c.d} fill={fill ? fill(c, i) : base} stroke="#FBF5E8" strokeWidth={0.8} />)}
    {children}
  </svg>
);

// Alfiler que cae (en coordenadas de pantalla).
export const MapPin: React.FC<{ x: number; y: number; at: number; label?: string; sub?: string; c?: string; side?: 'right' | 'left'; size?: number }> = ({ x, y, at, label, sub, c = P.terra, side = 'right', size = 1 }) => {
  const frame = useCurrentFrame();
  if (frame < at - 2) return null;
  const s = sp(frame, at, 11, 200);
  const lp = rampOut(frame, at + 6, at + 20);
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `scale(${size})` }}>
      <div style={{ position: 'absolute', left: -26, top: -8, width: 52, height: 16, borderRadius: '50%', background: 'rgba(0,0,0,0.22)', transform: `scale(${s})` }} />
      <svg width={56} height={70} viewBox="0 0 24 30" style={{ position: 'absolute', left: -28, top: -68, transform: `translateY(${(1 - s) * -90}px)`, opacity: Math.min(1, s * 3) }}>
        <path d="M12 29s9-8.4 9-16a9 9 0 1 0-18 0c0 7.6 9 16 9 16z" fill={c} stroke={P.ink} strokeWidth="1.4" />
        <circle cx="12" cy="13" r="3.6" fill="#FFFDF7" />
      </svg>
      {label && (
        <div style={{ position: 'absolute', ...(side === 'right' ? { left: 40 } : { right: 40 }), top: -78, opacity: lp, transform: `translateX(${(1 - lp) * (side === 'right' ? -14 : 14)}px)`, whiteSpace: 'nowrap',
          background: '#FFFDF7', borderRadius: 16, padding: '10px 20px', boxShadow: '0 14px 30px rgba(40,28,10,0.18)' }}>
          <div style={{ fontFamily: F.serif, fontWeight: 600, fontSize: 40, color: P.ink, lineHeight: 1.1 }}>{label}</div>
          {sub && <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 24, color: P.sepia }}>{sub}</div>}
        </div>
      )}
    </div>
  );
};

// Arco entre dos puntos (pantalla) que se dibuja, con un objeto que lo recorre.
export const Arc: React.FC<{ a: Pt; b: Pt; at: number; dur?: number; lift?: number; c?: string; w?: number; rider?: React.ReactNode; riderSize?: number }> = ({ a, b, at, dur = 50, lift = 0.35, c = P.terra, w = 5, rider, riderSize = 80 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: easeInOut });
  const mx = (a[0] + b[0]) / 2 + (b[1] - a[1]) * lift * 0.3;
  const my = (a[1] + b[1]) / 2 - Math.abs(b[0] - a[0]) * lift - 60;
  const q = (t: number): Pt => [(1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * mx + t * t * b[0], (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * my + t * t * b[1]];
  const N = 60;
  const pts = Array.from({ length: N + 1 }, (_, i) => q((p * i) / N));
  const d = pts.map((pt, i) => `${i ? 'L' : 'M'}${pt[0].toFixed(1)} ${pt[1].toFixed(1)}`).join(' ');
  const [rx, ry] = q(p);
  return (
    <>
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
        {p > 0 && <path d={d} stroke={c} strokeWidth={w} fill="none" strokeDasharray="16 12" strokeLinecap="round" />}
      </svg>
      {rider && p > 0 && <div style={{ position: 'absolute', left: rx - riderSize / 2, top: ry - riderSize / 2, width: riderSize, height: riderSize }}>{rider}</div>}
    </>
  );
};
