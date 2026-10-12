import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phase } from '../../components/Phase';
import { Words } from '../../components/Kinetic';
import { Highlight } from '../../components/Highlight';
import { LogoIcon } from '../../components/Logo';
import { BookIcon, CheckIcon, CrossIcon, MicIcon } from '../../components/Icons';
import { IcDownload, IcPhone, IcSearch } from '../er/icons';
import { Sfx } from '../../components/Sfx';
import { BrowserWindow } from '../../components/BrowserWindow';
import { ScreenClip } from '../../components/ScreenClip';
import { clamp, easeInOut } from '../../lib/anim';
import { LV_BLOG_URL, LV_REVIEW_SHOT } from './config';
import { w } from './timeline';

const ID = 'Y02';

// Y02 · Lo que vas a ver (seis temas) · la guía completa en el blog.
export const Y02Promise: React.FC<{ lead: number; dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w(ID, 'L02', word, n);
  const items = [
    { n: '01', t: 'Qué es LibriVox', f: at('qué'), i: <BookIcon size={54} /> },
    { n: '02', t: 'Libros en español', f: at('encontrar'), i: <IcSearch size={50} w={2.2} /> },
    { n: '03', t: 'Escuchar y descargar', f: at('escucharlos'), i: <IcDownload size={50} w={2.2} /> },
    { n: '04', t: 'En el móvil', f: at('móvil') - 6, i: <IcPhone size={50} w={2.2} /> },
    { n: '05', t: 'Lo mejor y lo peor', f: at('mejor'), i: <div style={{ display: 'flex', gap: 2 }}><CheckIcon size={40} /><CrossIcon size={40} /></div> },
    { n: '06', t: 'Graba uno tú', f: at('grabar') - 4, i: <MicIcon size={54} /> },
  ];
  const fBlog = at('guía') - 8;
  const fDesc = at('enlace');
  const card = spring({ frame: frame - fBlog, fps, config: { damping: 20, stiffness: 120 } });
  const arrow = spring({ frame: frame - fDesc, fps, config: { damping: 12, stiffness: 160 } });
  return (
    <Stage tone="warm">
      <Phase from={0} to={fBlog}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 56 }}>
          <Words text="Te lo contamos todo" start={0} size={96} weight={700} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 560px)', gap: 26 }}>
            {items.map((it) => {
              const s = spring({ frame: frame - it.f + 4, fps, config: { damping: 15, stiffness: 180 } });
              return (
                <div key={it.n} style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '24px 30px', borderRadius: 30, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card, opacity: s, transform: `translateY(${(1 - s) * 40}px) scale(${0.9 + 0.1 * s})`, filter: `blur(${(1 - s) * 6}px)` }}>
                  <div style={{ width: 84, height: 84, borderRadius: 42, background: color.yellowSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{it.i}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', fontFamily: font.sans }}>
                    <span style={{ fontSize: 24, fontWeight: 700, color: color.muted, letterSpacing: 2 }}>{it.n}</span>
                    <span style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.1 }}>{it.t}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </Phase>

      <Phase from={fBlog} to={dur} out={4}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 34 }}>
          <div style={{ position: 'relative', transform: `translateY(${(1 - card) * 70}px) rotate(${(1 - card) * -1.5}deg) scale(${0.96 + 0.04 * card})` }}>
            <BrowserWindow width={1260} url={LV_BLOG_URL}>
              <ScreenClip src={LV_REVIEW_SHOT} image width={1260} showCursor={false}
                camera={[{ f: 0, zoom: 1, x: 960, y: 540 }, { f: 30, zoom: 1, x: 960, y: 540 }, { f: dur - fBlog, zoom: 1.12, x: 760, y: 420 }]} />
              <div style={{ position: 'absolute', top: -40, bottom: -40, width: 260, left: interpolate(frame, [fBlog + 18, fBlog + 50], [-320, 1400], { ...clamp, easing: easeInOut }), background: 'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%)', transform: 'skewX(-18deg)', zIndex: 2 }} />
            </BrowserWindow>
            <div style={{ position: 'absolute', left: -34, top: -30, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px 12px 14px', borderRadius: 999, background: color.ink, color: '#fff', fontFamily: font.sans, fontSize: 30, fontWeight: 700, boxShadow: shadow.float, transform: `rotate(-3deg) scale(${spring({ frame: frame - fBlog - 12, fps, config: { damping: 12, stiffness: 180 } })})` }}>
              <LogoIcon size={36} /> La guía <Highlight start={22}>completa</Highlight>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: font.sans, fontWeight: 700, fontSize: 44, opacity: arrow, transform: `translateY(${(1 - arrow) * 20 + Math.sin((frame - fDesc) / 6) * 8 * (frame > fDesc ? 1 : 0)}px)` }}>
            Enlace en la descripción
            <svg width="48" height="48" viewBox="0 0 24 24"><path d="M12 4v15M6 13l6 6 6-6" stroke={color.ink} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </AbsoluteFill>
      </Phase>
      {items.map((it, i) => <Sfx key={it.n} name="ui_pop" at={it.f - 2} volume={0.8 + i * 0.04} />)}
      <Sfx name="swipe" at={fBlog} />
      <Sfx name="card_flip" at={fBlog + 6} />
      <Sfx name="sparkle" at={fBlog + 30} volume={0.7} />
      <Sfx name="ui_pop" at={fDesc} />
    </Stage>
  );
};
