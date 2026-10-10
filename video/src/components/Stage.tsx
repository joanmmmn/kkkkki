import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { color } from '../brand/tokens';
import { loadBrandFonts } from '../brand/fonts';

loadBrandFonts();

// Fondo de marca vivo: degradado cálido, dos halos amarillos que derivan despacio, retícula de puntos con paralaje y viñeta.
export const Stage: React.FC<{ children?: React.ReactNode; tone?: 'light' | 'night' | 'warm'; still?: boolean }> = ({ children, tone = 'light', still = false }) => {
  const frame = useCurrentFrame();
  const t = still ? 0 : frame / 50;
  const night = tone === 'night';
  const bg = night
    ? `radial-gradient(ellipse at 50% 40%, #4a4e55 0%, ${color.night} 45%, ${color.nightDeep} 100%)`
    : tone === 'warm'
      ? 'radial-gradient(ellipse at 50% 42%, #FFFDF5 0%, #FFFFFF 50%, #F5F4F0 100%)'
      : 'radial-gradient(ellipse at 50% 40%, #FFFFFF 0%, #FFFFFF 50%, #F3F3F4 100%)';
  const glow = night ? 0.08 : tone === 'warm' ? 0.11 : 0.08;
  const dot = night ? 'rgba(255,255,255,0.07)' : 'rgba(16,16,16,0.055)';
  return (
    <AbsoluteFill style={{ background: bg, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 1300, height: 1300, borderRadius: '50%', left: -380 + Math.sin(t * 0.21) * 90, top: -620 + Math.cos(t * 0.17) * 70, background: `radial-gradient(circle, rgba(255,202,5,${glow}) 0%, rgba(255,202,5,0) 62%)` }} />
      <div style={{ position: 'absolute', width: 1500, height: 1500, borderRadius: '50%', right: -560 + Math.cos(t * 0.15) * 110, bottom: -820 + Math.sin(t * 0.19) * 80, background: `radial-gradient(circle, rgba(255,202,5,${glow * 0.8}) 0%, rgba(255,202,5,0) 60%)` }} />
      <div style={{ position: 'absolute', inset: -60, backgroundImage: `radial-gradient(${dot} 1.6px, transparent 1.8px)`, backgroundSize: '36px 36px', transform: `translate(${(t * 6) % 36}px, ${(t * 3) % 36}px)`,
        WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.0) 35%, rgba(0,0,0,1) 100%)', maskImage: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.0) 35%, rgba(0,0,0,1) 100%)' }} />
      <AbsoluteFill style={{ background: night ? 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)' : 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 60%, rgba(30,24,0,0.06) 100%)' }} />
      {children}
    </AbsoluteFill>
  );
};
