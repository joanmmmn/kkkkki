import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Logo } from '../../components/Logo';
import { Typewriter } from '../../components/Kinetic';
import { Highlight } from '../../components/Highlight';
import { Sfx } from '../../components/Sfx';
import { clamp, easeInOut } from '../../lib/anim';
import { wordFrame } from '../../lib/vo';
import { BLOG_URL } from '../../lib/config';

// E02 · SonorBooks: logo + buscador → tarjeta del artículo del blog → «enlace en la descripción».
export const S02Brand: React.FC<{ lead: number }> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fResena = lead + wordFrame('E02', 'reseña', 0, 5);
  const fDesc = lead + wordFrame('E02', 'descripcion', 0, 9.6);
  const search = spring({ frame: frame - 18, fps, config: { damping: 22, stiffness: 140 } });
  const up = interpolate(frame, [fResena - 10, fResena + 12], [0, 1], { ...clamp, easing: easeInOut });
  const card = spring({ frame: frame - fResena, fps, config: { damping: 20, stiffness: 120 } });
  const arrow = spring({ frame: frame - fDesc + 6, fps, config: { damping: 12, stiffness: 160 } });
  const bob = Math.sin((frame - fDesc) / 6) * 8 * (frame > fDesc ? 1 : 0);
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `translateY(${-up * 300}px) scale(${1 - up * 0.3})` }}>
        <Logo size={110} delay={0} />
        <div style={{ marginTop: 56, width: 980, height: 92, borderRadius: 999, background: '#fff', boxShadow: shadow.float, border: `1px solid ${color.line}`, display: 'flex', alignItems: 'center', padding: '0 16px 0 40px', gap: 22, opacity: search, transform: `translateY(${(1 - search) * 30}px)` }}>
          <svg width="34" height="34" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" stroke={color.ink} strokeWidth="2.4" fill="none" /><path d="M15.5 15.5 L21 21" stroke={color.ink} strokeWidth="2.4" strokeLinecap="round" /></svg>
          <div style={{ flex: 1, fontFamily: font.sans, fontSize: 38, color: color.ink }}>
            <Typewriter text="El Libro Total" start={30} cps={13} />
          </div>
          <div style={{ width: 64, height: 64, borderRadius: 32, background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="30" height="30" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" stroke={color.ink} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>
      </AbsoluteFill>

      {frame >= fResena - 2 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 220 }}>
          <div style={{ width: 1100, display: 'flex', gap: 40, background: '#fff', borderRadius: 32, padding: 34, boxShadow: shadow.card, border: `1px solid ${color.line}`, opacity: card, transform: `translateY(${(1 - card) * 80}px) rotate(${(1 - card) * -3}deg)` }}>
            <div style={{ width: 300, height: 200, borderRadius: 20, background: `linear-gradient(135deg, ${color.eltNavy}, #1c3554)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontFamily: font.sans, fontWeight: 700, color: '#fff', fontSize: 30, letterSpacing: 1 }}>EL LIBRO TOTAL</div>
              <div style={{ fontFamily: font.sans, color: color.yellow, fontSize: 22, fontWeight: 500 }}>Reseña completa</div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
              <div style={{ fontFamily: font.sans, fontSize: 22, letterSpacing: 4, color: color.muted, fontWeight: 500 }}>BLOG · RESEÑA</div>
              <div style={{ fontFamily: font.sans, fontSize: 44, fontWeight: 700, color: color.ink, lineHeight: 1.1 }}>El Libro Total: <Highlight start={fResena + 14}>todo lo que necesitas saber</Highlight></div>
              <div style={{ fontFamily: font.sans, fontSize: 26, color: color.ink2 }}>{BLOG_URL}</div>
            </div>
          </div>
          <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 16, fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: color.ink, opacity: arrow, transform: `translateY(${(1 - arrow) * 20 + bob}px)` }}>
            Enlace en la descripción
            <svg width="40" height="40" viewBox="0 0 24 24"><path d="M12 4v15M6 13l6 6 6-6" stroke={color.ink} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </AbsoluteFill>
      )}
      <Sfx name="shimmer" at={2} volume={0.3} />
      <Sfx name="typing" at={30} volume={0.25} trimAfter={60} />
      <Sfx name="whoosh_soft" at={fResena - 8} volume={0.35} />
      <Sfx name="pop" at={fDesc} volume={0.35} />
    </Stage>
  );
};
