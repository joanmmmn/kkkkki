import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phase } from '../../components/Phase';
import { Words } from '../../components/Kinetic';
import { Highlight } from '../../components/Highlight';
import { LogoIcon } from '../../components/Logo';
import { BookIcon, MicIcon, CheckIcon, CrossIcon } from '../../components/Icons';
import { IcFile } from '../er/icons';
import { Sfx } from '../../components/Sfx';
import { Grow } from '../../components/Grow';
import { textWidth } from '../../lib/measure';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { BrowserWindow } from '../../components/BrowserWindow';
import { ScreenClip } from '../../components/ScreenClip';
import { ER_BLOG_URL, ER_REVIEW_SHOT } from './config';
import { w } from './timeline';

const ID = 'X02';

// X02 · Lo que hemos probado · 30 días en vez de 3 · reseña completa en el blog.
export const X02Promise: React.FC<{ lead: number; dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w(ID, 'W02', word, n);
  const fUltra = at('Ultra');
  const items = [
    { t: 'Catálogo', f: at('catalogo'), i: <BookIcon size={56} />, iw: 56 },
    { t: 'Voces', f: at('voces'), i: <MicIcon size={56} />, iw: 56 },
    { t: 'Tus documentos', f: at('documentos') - 6, i: <IcFile size={52} w={1.8} />, iw: 52 },
    { t: 'Lo mejor y lo peor', f: at('mejor'), i: <div style={{ display: 'flex', gap: 4 }}><CheckIcon size={44} /><CrossIcon size={44} /></div>, iw: 92 },
  ];
  const f30 = at('final') - 4;
  const f3 = at('3', 1);
  const fBlog = at('reseña') - 6;
  const fDesc = at('enlace');
  const card = spring({ frame: frame - fBlog, fps, config: { damping: 20, stiffness: 120 } });
  const arrow = spring({ frame: frame - fDesc, fps, config: { damping: 12, stiffness: 160 } });
  const ultra = spring({ frame: frame - fUltra + 2, fps, config: { damping: 14, stiffness: 180 } });
  const c30 = spring({ frame: frame - f30 - 4, fps, config: { damping: 14, stiffness: 160 } });
  const strike = interpolate(frame, [f3 + 2, f3 + 12], [0, 1], { ...clamp, easing: easeOut });
  return (
    <Stage tone="warm">
      <Phase from={0} to={f30}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
            <Words text="La hemos probado a fondo" start={2} size={104} weight={700} />
          </div>
          <div style={{ opacity: ultra, transform: `scale(${0.8 + 0.2 * ultra})`, marginTop: -30, display: 'flex', alignItems: 'center', gap: 14, padding: '12px 30px', borderRadius: 999, background: color.ink, color: '#fff', fontFamily: font.sans, fontSize: 36, fontWeight: 500 }}>
            <span>con el plan <b style={{ color: color.yellow }}>Ultra</b>, el de pago</span>
          </div>
          <div style={{ display: 'flex' }}>
            {items.map((it, i) => (
              <Grow key={it.t} at={it.f - 6} w={88 + it.iw + 18 + textWidth(it.t, 46, 700) + 6} gap={26} first={i === 0}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '26px 44px', borderRadius: 32, background: '#fff', boxShadow: shadow.card, border: `1px solid ${color.line}`, fontFamily: font.sans, fontSize: 46, fontWeight: 700, whiteSpace: 'nowrap' }}>
                  {it.i}{it.t}
                </div>
              </Grow>
            ))}
          </div>
        </AbsoluteFill>
      </Phase>

      <Phase from={f30} to={fBlog}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 40 }}>
          <Words text="Y al final:" start={0} size={64} weight={500} color={color.ink2} />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 40, opacity: c30, transform: `scale(${0.85 + 0.15 * c30})` }}>
            <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 700, fontSize: 120, color: color.muted, letterSpacing: -3 }}>
              3 días
              <div style={{ position: 'absolute', left: -8, right: -8, top: '55%', height: 10, borderRadius: 5, background: color.red, transformOrigin: 'left center', transform: `scaleX(${strike}) rotate(-4deg)` }} />
            </div>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 168, color: color.ink, letterSpacing: -5 }}>
              30 días <Highlight start={f30 + 16} dur={14}>gratis</Highlight>
            </div>
          </div>
          <div style={{ fontFamily: font.sans, fontSize: 38, color: color.ink2, opacity: c30 }}>paso a paso, con el enlace de SonorBooks</div>
        </AbsoluteFill>
      </Phase>

      <Phase from={fBlog} to={dur} out={4}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 34 }}>
          <div style={{ position: 'relative', transform: `translateY(${(1 - card) * 70}px) rotate(${(1 - card) * -1.5}deg) scale(${0.96 + 0.04 * card})` }}>
            <BrowserWindow width={1260} url={ER_BLOG_URL}>
              <ScreenClip src={ER_REVIEW_SHOT} image width={1260} showCursor={false}
                camera={[{ f: 0, zoom: 1, x: 960, y: 540 }, { f: 30, zoom: 1, x: 960, y: 540 }, { f: dur - fBlog, zoom: 1.13, x: 780, y: 420 }]} />
              <div style={{ position: 'absolute', top: -40, bottom: -40, width: 260, left: interpolate(frame, [fBlog + 18, fBlog + 50], [-320, 1400], { ...clamp, easing: easeInOut }), background: 'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%)', transform: 'skewX(-18deg)', zIndex: 2 }} />
            </BrowserWindow>
            <div style={{ position: 'absolute', left: -34, top: -30, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px 12px 14px', borderRadius: 999, background: color.ink, color: '#fff', fontFamily: font.sans, fontSize: 30, fontWeight: 700, boxShadow: shadow.float, transform: `rotate(-3deg) scale(${spring({ frame: frame - fBlog - 12, fps, config: { damping: 12, stiffness: 180 } })})` }}>
              <LogoIcon size={36} /> La reseña <Highlight start={fBlog + 22}>completa</Highlight>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: font.sans, fontWeight: 700, fontSize: 44, opacity: arrow, transform: `translateY(${(1 - arrow) * 20 + Math.sin((frame - fDesc) / 6) * 8 * (frame > fDesc ? 1 : 0)}px)` }}>
            Enlace en la descripción
            <svg width="48" height="48" viewBox="0 0 24 24"><path d="M12 4v15M6 13l6 6 6-6" stroke={color.ink} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </AbsoluteFill>
      </Phase>
      <Sfx name="ui_pop" at={fUltra} />
      {items.map((it, i) => <Sfx key={it.t} name="ui_pop" at={it.f - 3} volume={0.85 + i * 0.05} />)}
      <Sfx name="swipe" at={f30} />
      <Sfx name="snap_in" at={f30 + 6} />
      <Sfx name="pencil_strike" at={f3 + 2} />
      <Sfx name="marker" at={f30 + 16} />
      <Sfx name="swipe" at={fBlog} />
      <Sfx name="card_flip" at={fBlog + 6} />
      <Sfx name="sparkle" at={fBlog + 30} volume={0.7} />
      <Sfx name="ui_pop" at={fDesc} />
    </Stage>
  );
};
