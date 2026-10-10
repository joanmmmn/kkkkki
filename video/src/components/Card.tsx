import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, radius, shadow } from '../brand/tokens';

// Tarjeta blanca con sombra suave que entra con muelle y ligero desenfoque.
export const Card: React.FC<{ children: React.ReactNode; delay?: number; style?: React.CSSProperties; from?: 'up' | 'down' | 'scale'; pad?: number }> = ({
  children, delay = 0, style, from = 'up', pad = 48,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 22, stiffness: 140 } });
  const t = from === 'scale' ? `scale(${0.92 + 0.08 * s})` : `translateY(${(1 - s) * (from === 'up' ? 60 : -60)}px)`;
  return (
    <div style={{ background: color.bg, borderRadius: radius.card, boxShadow: shadow.card, border: `1px solid ${color.line}`, padding: pad, opacity: s, transform: t, filter: `blur(${(1 - s) * 6}px)`, ...style }}>
      {children}
    </div>
  );
};
