import React from 'react';
import { AbsoluteFill } from 'remotion';
import { color } from '../brand/tokens';
import { loadBrandFonts } from '../brand/fonts';

loadBrandFonts();

// Fondo de marca: blanco con un degradado radial muy sutil y grano ligero.
export const Stage: React.FC<{ children?: React.ReactNode; tone?: 'light' | 'night' | 'warm' }> = ({ children, tone = 'light' }) => {
  const bg = tone === 'night'
    ? `radial-gradient(ellipse at 50% 40%, #4a4e55 0%, ${color.night} 45%, ${color.nightDeep} 100%)`
    : tone === 'warm'
      ? 'radial-gradient(ellipse at 50% 45%, #FFFDF4 0%, #FFFFFF 55%, #F7F7F8 100%)'
      : 'radial-gradient(ellipse at 50% 40%, #FFFFFF 0%, #FFFFFF 55%, #F4F4F5 100%)';
  return (
    <AbsoluteFill style={{ background: bg, overflow: 'hidden' }}>
      {children}
    </AbsoluteFill>
  );
};
