import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { color } from '../brand/tokens';

// Subrayado de rotulador amarillo que se dibuja de izquierda a derecha (firma visual del V7).
export const Highlight: React.FC<{
  children: React.ReactNode; start?: number; dur?: number; height?: number; offset?: number; style?: React.CSSProperties; fill?: string;
}> = ({ children, start = 0, dur = 14, height = 0.32, offset = 0.06, style, fill = color.yellow }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.65, 0, 0.35, 1) });
  return (
    <span style={{ position: 'relative', display: 'inline-block', whiteSpace: 'nowrap', ...style }}>
      <span
        style={{
          position: 'absolute', left: '-0.08em', right: '-0.08em', bottom: `${offset}em`, height: `${height}em`,
          background: fill, borderRadius: '0.2em', transformOrigin: 'left center', transform: `scaleX(${p}) skewX(-8deg)`, zIndex: 0,
        }}
      />
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </span>
  );
};
