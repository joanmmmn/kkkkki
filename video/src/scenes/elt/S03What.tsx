import React from 'react';
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phase } from '../../components/Phase';
import { Card } from '../../components/Card';
import { Stat } from '../../components/Stat';
import { Words } from '../../components/Kinetic';
import { Highlight } from '../../components/Highlight';
import { Sfx } from '../../components/Sfx';
import { BrowserWindow } from '../../components/BrowserWindow';
import { ScreenClip } from '../../components/ScreenClip';
import { Phone } from '../../components/Phone';
import { PinIcon, HeartIcon, BookIcon, MusicIcon, ArtIcon, HeadphonesIcon } from '../../components/Icons';
import { wordFrame } from '../../lib/vo';
import cursorHome from '../../../public/elt/rec/01_home/cursor.json';

const EltBadge: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <div style={{ background: color.eltNavy, borderRadius: 36 * scale, padding: `${34 * scale}px ${60 * scale}px`, boxShadow: shadow.float }}>
    <Img src={staticFile('elt/img/elt_logo.png')} style={{ height: 120 * scale, display: 'block' }} />
  </div>
);

// E03 · Qué es El Libro Total.
export const S03What: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0, fb = 0) => lead + wordFrame('E03', w, n, fb);
  const fColombia = at('Colombia', 0, 3);
  const fFund = at('mantiene', 0, 5.5);
  const fSoft = at('software', 0, 8);
  const fBorges = at('nombre', 0, 10);
  const fMil = at('Mas', 0, 15);
  const fWeb = at('web', 0, 19);
  const fApps = at('apps', 0, 20);
  const pin = spring({ frame: frame - fColombia, fps, config: { damping: 14, stiffness: 170 } });
  const phone = spring({ frame: frame - fApps, fps, config: { damping: 20, stiffness: 120 } });
  return (
    <Stage>
      <Phase from={0} to={fFund}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 50, flexDirection: 'column' }}>
          <Card from="scale" pad={0} style={{ background: 'transparent', boxShadow: 'none', border: 'none' }}><EltBadge scale={1.7} /></Card>
          <Words text="Biblioteca digital gratuita" start={8} size={92} weight={700} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '22px 48px', borderRadius: 999, background: '#fff', boxShadow: shadow.soft, border: `1px solid ${color.line}`, opacity: pin, transform: `translateY(${(1 - pin) * 30}px)`, fontFamily: font.sans, fontSize: 52, fontWeight: 500 }}>
            <PinIcon size={62} /> Colombia · <b>2005</b>
          </div>
        </AbsoluteFill>
      </Phase>

      <Phase from={fFund} to={fBorges}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 50, flexDirection: 'row' }}>
          <Card delay={0} style={{ width: 760 }}>
            <div style={{ fontFamily: font.sans, fontSize: 28, letterSpacing: 5, color: color.muted, fontWeight: 500 }}>QUIÉN LA MANTIENE</div>
            <div style={{ fontFamily: font.sans, fontSize: 66, fontWeight: 700, marginTop: 14, lineHeight: 1.05 }}>Fundación El Libro Total</div>
            <div style={{ fontFamily: font.sans, fontSize: 42, marginTop: 18, color: color.ink2 }}><Highlight start={18}>sin ánimo de lucro</Highlight></div>
          </Card>
          <div style={{ opacity: spring({ frame: frame - fSoft, fps }), transform: `scale(${spring({ frame: frame - fSoft, fps, config: { damping: 10 } })})` }}><HeartIcon size={70} c={color.yellow} /></div>
          <Card delay={fSoft - fFund} style={{ width: 760 }}>
            <div style={{ fontFamily: font.sans, fontSize: 28, letterSpacing: 5, color: color.muted, fontWeight: 500 }}>QUIÉN LA FINANCIA</div>
            <div style={{ fontFamily: font.sans, fontSize: 66, fontWeight: 700, marginTop: 14, lineHeight: 1.05 }}>Sistemas y Computadores</div>
            <div style={{ fontFamily: font.sans, fontSize: 42, marginTop: 18, color: color.ink2 }}>empresa de software</div>
          </Card>
        </AbsoluteFill>
      </Phase>

      <Phase from={fBorges} to={fMil}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 36 }}>
          <BookIcon size={96} />
          <Words text="«La Biblioteca Total»" serif italic size={170} weight={400} start={4} stagger={5} />
          <Words text="Jorge Luis Borges · 1939" size={48} weight={500} color={color.muted} start={24} />
        </AbsoluteFill>
      </Phase>

      <Phase from={fMil} to={fWeb + 4}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 50 }}>
          <Stat value={50000} suffix="+" label="títulos" size={260} dur={40} />
          <div style={{ display: 'flex', gap: 54 }}>
            {[BookIcon, HeadphonesIcon, MusicIcon, ArtIcon].map((I, i) => {
              const s = spring({ frame: frame - fMil - 20 - i * 5, fps, config: { damping: 14 } });
              return <div key={i} style={{ width: 140, height: 140, borderRadius: 36, background: i === 1 ? color.yellow : '#fff', boxShadow: shadow.soft, border: `1px solid ${color.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${s})` }}><I size={72} /></div>;
            })}
          </div>
        </AbsoluteFill>
      </Phase>

      <Phase from={fWeb} to={dur} out={1}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', left: 90, top: 150 }}>
            <BrowserWindow width={1380}>
              <ScreenClip src="elt/rec/01_home/video.mp4" width={1380} startAt={0.3} cursor={cursorHome} showCursor={false} />
            </BrowserWindow>
          </div>
          <div style={{ position: 'absolute', right: 110, top: 120, transform: `translateY(${(1 - phone) * 600}px) rotate(${(1 - phone) * 8}deg)` }}>
            <Phone height={820} ratio={739 / 430}>
              <Img src={staticFile('elt/img/m03_home_scrolled.png')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Phone>
          </div>
        </AbsoluteFill>
      </Phase>

      <Sfx name="whoosh_soft" at={0} volume={0.3} />
      <Sfx name="pop" at={fColombia} volume={0.35} />
      <Sfx name="whoosh_fast" at={fFund - 4} volume={0.3} />
      <Sfx name="pop" at={fSoft} volume={0.3} />
      <Sfx name="whoosh_fast" at={fBorges - 4} volume={0.3} />
      <Sfx name="whoosh_fast" at={fMil - 4} volume={0.3} />
      <Sfx name="counter" at={fMil} volume={0.18} />
      <Sfx name="whoosh_deep" at={fWeb - 6} volume={0.32} />
    </Stage>
  );
};
