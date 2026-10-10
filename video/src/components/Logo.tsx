import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font } from '../brand/tokens';

// Icono: libro abierto amarillo con triángulo de "play" negro (recreado del V7).
export const LogoIcon: React.FC<{ size?: number; playScale?: number }> = ({ size = 72, playScale = 1 }) => (
  <svg width={size} height={size * 0.82} viewBox="0 0 150 123" style={{ overflow: 'visible' }}>
    <path
      d="M10 8 C 34 3, 58 5, 75 16 C 92 5, 116 3, 140 8 L 140 104 C 116 100, 92 103, 75 116 C 58 103, 34 100, 10 104 Z"
      fill={color.yellow}
      stroke={color.yellow}
      strokeWidth={12}
      strokeLinejoin="round"
    />
    <g transform={`translate(75 61) scale(${playScale}) translate(-75 -61)`}>
      <path d="M58 38 L 98 61 L 58 84 Z" fill={color.ink} stroke={color.ink} strokeWidth={4} strokeLinejoin="round" />
    </g>
  </svg>
);

export const Logo: React.FC<{ size?: number; animate?: boolean; delay?: number; dark?: boolean }> = ({
  size = 96, animate = true, delay = 0, dark = false,
}) => {
  const frame = useCurrentFrame() - delay;
  const { fps } = useVideoConfig();
  const pop = animate ? spring({ frame, fps, config: { damping: 14, stiffness: 160 } }) : 1;
  const word = 'SonorBooks';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.28 }}>
      <div style={{ transform: `scale(${pop}) rotate(${interpolate(pop, [0, 1], [-12, 0])}deg)` }}>
        <LogoIcon size={size} playScale={animate ? interpolate(spring({ frame: frame - 6, fps, config: { damping: 10 } }), [0, 1], [0.4, 1]) : 1} />
      </div>
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: size * 0.98, color: dark ? '#fff' : color.ink, letterSpacing: -0.5, display: 'flex' }}>
        {word.split('').map((ch, i) => {
          const s = animate ? spring({ frame: frame - 8 - i * 1.6, fps, config: { damping: 18, stiffness: 180 } }) : 1;
          return (
            <span key={i} style={{ display: 'inline-block', opacity: s, transform: `translateY(${(1 - s) * size * 0.35}px)`, filter: `blur(${(1 - s) * 8}px)` }}>
              {ch}
            </span>
          );
        })}
      </div>
    </div>
  );
};
