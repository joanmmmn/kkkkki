import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Words } from '../../components/Kinetic';
import { Highlight } from '../../components/Highlight';
import { LogoIcon } from '../../components/Logo';
import { Sfx } from '../../components/Sfx';
import { wordFrame } from '../../lib/vo';
import { EVD_BLOG_URL } from '../../lib/config';
import { clamp, easeInOut } from '../../lib/anim';
import { EvdCoverArt } from './Cover';

// R02 · Lo hemos analizado a fondo → todos los datos y las fuentes en el blog → enlace en la descripción.
export const R02Promise: React.FC<{ lead: number; dur: number }> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0, fb = 0) => lead + wordFrame('R02', w, n, fb);
  const fCard = at('con', 0, 1.8) - 14;
  const fDatos = at('datos', 0, 2.48);
  const fFuentes = at('fuentes', 0, 3.12);
  const fBlog = at('blog', 0, 4.0);
  const fEnlace = at('enlace', 0, 4.64);
  const card = spring({ frame: frame - fCard, fps, config: { damping: 20, stiffness: 120 } });
  const bump = spring({ frame: frame - fBlog, fps, config: { damping: 9, stiffness: 220 } });
  const arrow = spring({ frame: frame - fEnlace, fps, config: { damping: 12, stiffness: 160 } });
  const shine = interpolate(frame, [fBlog, fBlog + 30], [-300, 1500], { ...clamp, easing: easeInOut });
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 54 }}>
        <Words text="Lo hemos analizado a fondo" start={2} size={96} weight={700} />
        <div style={{ position: 'relative', overflow: 'hidden', width: 1380, display: 'flex', alignItems: 'center', gap: 46, background: '#fff', borderRadius: 36, padding: 40, boxShadow: shadow.card, border: `1px solid ${color.line}`, opacity: card, transform: `translateY(${(1 - card) * 70}px) rotate(${(1 - card) * -2}deg) scale(${1 + 0.025 * Math.sin(Math.min(1, bump) * Math.PI)})` }}>
          <div style={{ position: 'absolute', top: -40, bottom: -40, width: 220, left: shine, background: 'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,236,150,0.55) 50%, rgba(255,255,255,0) 100%)', transform: 'skewX(-18deg)', zIndex: 2 }} />
          {/* Portada del artículo: la misma composición que la miniatura de YouTube. */}
          <div style={{ width: 448, height: 252, flexShrink: 0, borderRadius: 20, overflow: 'hidden', boxShadow: '0 14px 34px rgba(0,0,0,0.18)', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: 1280, height: 720, transform: `scale(${448 / 1280})`, transformOrigin: '0 0' }}><EvdCoverArt /></div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: font.sans, fontSize: 24, letterSpacing: 4, color: color.muted, fontWeight: 500 }}><LogoIcon size={30} /> BLOG DE SONORBOOKS</div>
            <div style={{ fontFamily: font.sans, fontSize: 56, fontWeight: 700, lineHeight: 1.1 }}>
              Todos los <Highlight start={fDatos + 2} dur={10}>datos</Highlight> y las <Highlight start={fFuentes + 2} dur={10}>fuentes</Highlight>
            </div>
            <div style={{ fontFamily: font.sans, fontSize: 30, color: color.ink2 }}>{EVD_BLOG_URL}</div>
          </div>
        </div>
        <div style={{ height: 60, display: 'flex', alignItems: 'center', gap: 16, fontFamily: font.sans, fontWeight: 700, fontSize: 46, opacity: arrow, transform: `translateY(${(1 - arrow) * 20 + Math.sin((frame - fEnlace) / 6) * 8 * (frame > fEnlace ? 1 : 0)}px)` }}>
          Enlace en la descripción
          <svg width="50" height="50" viewBox="0 0 24 24"><path d="M12 4v15M6 13l6 6 6-6" stroke={color.ink} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </AbsoluteFill>
      <Sfx name="whoosh_soft" at={2} volume={0.7} />
      <Sfx name="card_flip" at={fCard + 4} />
      <Sfx name="marker" at={fDatos + 2} />
      <Sfx name="marker" at={fFuentes + 2} volume={0.9} />
      <Sfx name="sparkle" at={fBlog + 6} volume={0.7} />
      <Sfx name="ui_pop" at={fEnlace} />
    </Stage>
  );
};
