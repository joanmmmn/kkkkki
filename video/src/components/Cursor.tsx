import React from 'react';
import { interpolate } from 'remotion';
import { color } from '../brand/tokens';

export type CursorPoint = { t: number; x: number; y: number; down: boolean };

// Posición interpolada del ratón grabado en el instante t (segundos).
export const cursorAt = (pts: CursorPoint[], t: number) => {
  if (!pts.length) return { x: 0, y: 0, down: false, lastDown: -99 };
  let lo = 0, hi = pts.length - 1;
  if (t <= pts[0].t) return { ...pts[0], lastDown: -99 };
  if (t >= pts[hi].t) return { ...pts[hi], lastDown: lastDownBefore(pts, t) };
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (pts[m].t <= t) lo = m; else hi = m; }
  const a = pts[lo], b = pts[hi];
  const p = b.t === a.t ? 0 : (t - a.t) / (b.t - a.t);
  return { x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p, down: a.down, lastDown: lastDownBefore(pts, t) };
};
const lastDownBefore = (pts: CursorPoint[], t: number) => {
  for (let i = pts.length - 1; i >= 0; i--) if (pts[i].t <= t && pts[i].down) return pts[i].t;
  return -99;
};

// Cursor de flecha estilo macOS con onda amarilla al hacer clic.
export const Cursor: React.FC<{ x: number; y: number; scale?: number; down?: boolean; sinceClick?: number; opacity?: number }> = ({
  x, y, scale = 1, down = false, sinceClick = 99, opacity = 1,
}) => {
  const ring = interpolate(sinceClick, [0, 0.45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const press = down ? 0.86 : interpolate(sinceClick, [0, 0.15], [0.86, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 0, height: 0, opacity, zIndex: 50, pointerEvents: 'none' }}>
      {sinceClick < 0.45 && (
        <div style={{
          position: 'absolute', left: -40 * scale * ring, top: -40 * scale * ring, width: 80 * scale * ring, height: 80 * scale * ring,
          borderRadius: '50%', border: `${4 * scale}px solid ${color.yellow}`, background: 'rgba(255,202,5,0.18)', opacity: 1 - ring,
        }} />
      )}
      <svg width={34 * scale} height={34 * scale} viewBox="0 0 28 28" style={{ transform: `scale(${press})`, transformOrigin: '0 0', filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.35))', position: 'absolute', left: -3 * scale, top: -2 * scale }}>
        <path d="M5 3 L5 22 L10 17.5 L13.5 25 L17 23.5 L13.6 16 L20.5 16 Z" fill="#fff" stroke="#111" strokeWidth={1.6} strokeLinejoin="round" />
      </svg>
    </div>
  );
};
