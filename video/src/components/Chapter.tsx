import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font } from '../brand/tokens';
import { LogoIcon } from './Logo';

// Rótulo de capítulo: número grande + título, con la barra amarilla que barre la pantalla.
export const Chapter: React.FC<{ n: number; title: string; kicker?: string; dur: number }> = ({ n, title, kicker, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sweep = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: 'clamp' });
  const out = interpolate(frame, [dur - 14, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const s = spring({ frame: frame - 6, fps, config: { damping: 18, stiffness: 150 } });
  const s2 = spring({ frame: frame - 12, fps, config: { damping: 18, stiffness: 150 } });
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: 1 - out, transform: `translateY(${-out * 30}px)` }}>
      <div style={{ position: 'absolute', left: 0, top: 538, height: 4, width: `${sweep * 100}%`, background: color.yellow, opacity: 0.0 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 44 }}>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 230, color: color.yellow, lineHeight: 1, letterSpacing: -8, opacity: s, transform: `translateX(${(1 - s) * -60}px)` }}>
          {String(n).padStart(2, '0')}
        </div>
        <div style={{ width: 6, height: 190 * s, background: color.ink, borderRadius: 3 }} />
        <div style={{ opacity: s2, transform: `translateX(${(1 - s2) * 60}px)` }}>
          {kicker && <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 30, letterSpacing: 6, textTransform: 'uppercase', color: color.muted, marginBottom: 10 }}>{kicker}</div>}
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 96, color: color.ink, letterSpacing: -2, lineHeight: 1.02, maxWidth: 1100 }}>{title}</div>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 60, opacity: 0.9 * s2 }}><LogoIcon size={46} /></div>
    </AbsoluteFill>
  );
};
