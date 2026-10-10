import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font } from '../brand/tokens';
import { easeOut, fmtEs } from '../lib/anim';

const fmt = (n: number, decimals: number) => fmtEs(n, decimals);

// Cifra que cuenta hacia arriba con etiqueta (p. ej. "50.000+ títulos").
export const Stat: React.FC<{ value: number; label: string; prefix?: string; suffix?: string; decimals?: number; start?: number; dur?: number; size?: number; accent?: boolean; dark?: boolean }> = ({
  value, label, prefix = '', suffix = '', decimals = 0, start = 0, dur = 40, size = 120, accent = false, dark = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut });
  const s = spring({ frame: frame - start, fps, config: { damping: 20, stiffness: 150 } });
  const v = value * p;
  return (
    <div style={{ opacity: s, transform: `translateY(${(1 - s) * 40}px)`, textAlign: 'center' }}>
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: size, letterSpacing: -size * 0.03, color: dark ? '#fff' : color.ink, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
        {prefix}{fmt(v, decimals)}{suffix}
      </div>
      <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: size * 0.25, color: dark ? 'rgba(255,255,255,0.6)' : color.muted, marginTop: size * 0.12 }}>{label}</div>
    </div>
  );
};
