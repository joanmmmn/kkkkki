import React from 'react';
import { color, font } from '../brand/tokens';

export const Pill: React.FC<{ children: React.ReactNode; size?: number; bg?: string; fg?: string; style?: React.CSSProperties }> = ({
  children, size = 30, bg = color.yellow, fg = color.ink, style,
}) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.4, padding: `${size * 0.35}px ${size * 0.8}px`, background: bg, color: fg, borderRadius: 999, fontFamily: font.sans, fontWeight: 700, fontSize: size, boxShadow: '0 10px 30px rgba(255,202,5,0.35)', ...style }}>
    {children}
  </div>
);
