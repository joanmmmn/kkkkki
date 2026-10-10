import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phase } from '../../components/Phase';
import { Words } from '../../components/Kinetic';
import { Highlight } from '../../components/Highlight';
import { LogoIcon } from '../../components/Logo';
import { BookIcon, MicIcon, CheckIcon, CrossIcon } from '../../components/Icons';
import { Sfx } from '../../components/Sfx';
import { wordFrame } from '../../lib/vo';
import { BLOG_URL } from '../../lib/config';
import { Grow } from '../../components/Grow';
import { textWidth } from '../../lib/measure';
import { clamp, easeInOut } from '../../lib/anim';

const PhoneIcon: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><rect x="6.5" y="2.5" width="11" height="19" rx="2.5" fill="none" stroke={color.ink} strokeWidth="1.8" /><path d="M10.5 18.5h3" stroke={color.ink} strokeWidth="1.8" strokeLinecap="round" /></svg>
);

// V02 · Lo que hemos probado + enlace al blog.
export const H02Promise: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0, fb = 0) => lead + wordFrame('V02', w, n, fb);
  const items = [
    { t: 'Catálogo', f: at('catalogo', 0, 1.8), i: <BookIcon size={50} />, iw: 50 },
    { t: 'Voces', f: at('voces', 0, 2.6), i: <MicIcon size={50} />, iw: 50 },
    { t: 'App', f: at('app', 0, 3.4), i: <PhoneIcon size={50} />, iw: 50 },
    { t: 'Lo mejor y lo peor', f: at('mejor', 0, 4.2), i: <div style={{ display: 'flex', gap: 4 }}><CheckIcon size={40} /><CrossIcon size={40} /></div>, iw: 84 },
  ];
  const fBlog = at('Y', 0, 5.8) - 4;
  const fDesc = at('enlace', 0, 10.6);
  const card = spring({ frame: frame - fBlog, fps, config: { damping: 20, stiffness: 120 } });
  const arrow = spring({ frame: frame - fDesc, fps, config: { damping: 12, stiffness: 160 } });
  return (
    <Stage tone="warm">
      <Phase from={0} to={fBlog + 8}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 70 }}>
          <Words text="Lo hemos probado a fondo" start={2} size={96} weight={700} />
          <div style={{ display: 'flex' }}>
            {items.map((it, i) => (
              <Grow key={it.t} at={it.f - 6} w={80 + it.iw + 18 + textWidth(it.t, 46, 700) + 6} gap={32} first={i === 0}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '26px 40px', borderRadius: 30, background: '#fff', boxShadow: shadow.card, border: `1px solid ${color.line}`, fontFamily: font.sans, fontSize: 46, fontWeight: 700, whiteSpace: 'nowrap' }}>
                  {it.i}{it.t}
                </div>
              </Grow>
            ))}
          </div>
        </AbsoluteFill>
      </Phase>
      <Phase from={fBlog} to={dur} out={4}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 44 }}>
          <div style={{ position: 'relative', overflow: 'hidden', width: 1240, display: 'flex', gap: 44, background: '#fff', borderRadius: 36, padding: 40, boxShadow: shadow.card, border: `1px solid ${color.line}`, transform: `translateY(${(1 - card) * 60}px) rotate(${(1 - card) * -2}deg)` }}>
            <div style={{ position: 'absolute', top: -40, bottom: -40, width: 220, left: interpolate(frame, [fBlog + 22, fBlog + 52], [-300, 1400], { ...clamp, easing: easeInOut }), background: 'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,236,150,0.55) 50%, rgba(255,255,255,0) 100%)', transform: 'skewX(-18deg)', zIndex: 2 }} />
            <div style={{ width: 340, height: 220, borderRadius: 22, background: `linear-gradient(135deg, ${color.eltNavy}, #1c3554)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontFamily: font.sans, fontWeight: 700, color: '#fff', fontSize: 34, letterSpacing: 1 }}>EL LIBRO TOTAL</div>
              <div style={{ fontFamily: font.sans, color: color.yellow, fontSize: 26, fontWeight: 500 }}>Reseña completa</div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: font.sans, fontSize: 24, letterSpacing: 4, color: color.muted, fontWeight: 500 }}><LogoIcon size={30} /> BLOG DE SONORBOOKS</div>
              <div style={{ fontFamily: font.sans, fontSize: 52, fontWeight: 700, lineHeight: 1.08 }}>Todos los datos <Highlight start={fBlog + 18}>y las fuentes</Highlight></div>
              <div style={{ fontFamily: font.sans, fontSize: 28, color: color.ink2 }}>{BLOG_URL}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: font.sans, fontWeight: 700, fontSize: 44, opacity: arrow, transform: `translateY(${(1 - arrow) * 20 + Math.sin((frame - fDesc) / 6) * 8 * (frame > fDesc ? 1 : 0)}px)` }}>
            Enlace en la descripción
            <svg width="48" height="48" viewBox="0 0 24 24"><path d="M12 4v15M6 13l6 6 6-6" stroke={color.ink} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </AbsoluteFill>
      </Phase>
      {items.map((it, i) => <Sfx key={it.t} name="ui_pop" at={it.f - 3} volume={0.85 + i * 0.05} />)}
      <Sfx name="swipe" at={fBlog} />
      <Sfx name="card_flip" at={fBlog + 6} />
      <Sfx name="marker" at={fBlog + 18} />
      <Sfx name="sparkle" at={fBlog + 30} volume={0.7} />
      <Sfx name="ui_pop" at={fDesc} />
    </Stage>
  );
};
