import React from 'react';
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phase } from '../../components/Phase';
import { Card } from '../../components/Card';
import { Stat } from '../../components/Stat';
import { Words } from '../../components/Kinetic';
import { Highlight } from '../../components/Highlight';
import { PinIcon, HeartIcon, BookIcon } from '../../components/Icons';
import { Sfx } from '../../components/Sfx';
import { wordFrame } from '../../lib/vo';
import { Grow } from '../../components/Grow';
import { textWidth } from '../../lib/measure';

// V03 · Qué es: nombre → Colombia 2005 → fundación + SYC → Borges → 5 M de descargas y 4,8.
export const H03What: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0, fb = 0) => lead + wordFrame('V03', w, n, fb);
  const fCol = at('Colombia', 0, 3.6);
  const f2005 = at('2005', 0, 4.2);
  const fFund = at('mano', 0, 5.5) - 6;
  const fSoft = at('financiada', 0, 7.6);
  const fBorges = at('Su', 0, 10.1) - 4;
  const fHoy = at('hoy', 0, 14) - 6;
  const fNota = at('4,8', 0, 17.3);
  const year = spring({ frame: frame - f2005, fps, config: { damping: 10, stiffness: 200 } });
  return (
    <Stage>
      <Phase from={0} to={fFund}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 48 }}>
          <Card from="scale" pad={0} style={{ background: 'transparent', boxShadow: 'none', border: 'none' }}>
            <div style={{ background: color.eltNavy, borderRadius: 50, padding: '50px 90px', boxShadow: shadow.float }}>
              <Img src={staticFile('elt/img/elt_logo.png')} style={{ height: 200, display: 'block' }} />
            </div>
          </Card>
          <div style={{ display: 'flex' }}>
            <Grow at={fCol - 4} w={88 + 60 + 16 + textWidth('Colombia', 52, 500) + 6} first rise={30}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '22px 44px', borderRadius: 999, background: '#fff', boxShadow: shadow.soft, border: `1px solid ${color.line}`, fontFamily: font.sans, fontSize: 52, fontWeight: 500, whiteSpace: 'nowrap' }}><PinIcon size={60} /> Colombia</div>
            </Grow>
            <Grow at={f2005 - 4} w={88 + textWidth('desde 2005', 52, 700) + 6} gap={26} rise={30}>
              <div style={{ padding: '22px 44px', borderRadius: 999, background: color.yellow, fontFamily: font.sans, fontSize: 52, fontWeight: 700, whiteSpace: 'nowrap', transform: `scale(${0.85 + 0.15 * year})` }}>desde 2005</div>
            </Grow>
          </div>
        </AbsoluteFill>
      </Phase>

      <Phase from={fFund} to={fBorges}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
          <Card style={{ width: 760 }}>
            <div style={{ fontFamily: font.sans, fontSize: 28, letterSpacing: 5, color: color.muted, fontWeight: 500 }}>LA MANTIENE</div>
            <div style={{ fontFamily: font.sans, fontSize: 66, fontWeight: 700, marginTop: 14, lineHeight: 1.05 }}>Fundación<br />El Libro Total</div>
            <div style={{ fontFamily: font.sans, fontSize: 42, marginTop: 18, color: color.ink2 }}><Highlight start={16}>sin ánimo de lucro</Highlight></div>
          </Card>
          <Grow at={fSoft - fFund - 4} w={74} gap={50} rise={0}>
            <div style={{ transform: `scale(${spring({ frame: frame - fSoft, fps, config: { damping: 8, stiffness: 160 } })})` }}><HeartIcon size={74} c={color.yellow} /></div>
          </Grow>
          <Grow at={fSoft - fFund} w={760} gap={50}>
            <div style={{ background: color.bg, borderRadius: 32, boxShadow: shadow.card, border: `1px solid ${color.line}`, padding: 48 }}>
              <div style={{ fontFamily: font.sans, fontSize: 28, letterSpacing: 5, color: color.muted, fontWeight: 500 }}>LA FINANCIA</div>
              <div style={{ fontFamily: font.sans, fontSize: 66, fontWeight: 700, marginTop: 14, lineHeight: 1.05 }}>Sistemas y<br />Computadores</div>
              <div style={{ fontFamily: font.sans, fontSize: 42, marginTop: 18, color: color.ink2 }}>empresa de software</div>
            </div>
          </Grow>
        </AbsoluteFill>
      </Phase>

      <Phase from={fBorges} to={fHoy}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 34 }}>
          <BookIcon size={96} />
          <Words text="«La Biblioteca Total»" serif italic size={170} weight={400} start={4} stagger={5} />
          <Words text="el homenaje a Jorge Luis Borges" size={48} weight={500} color={color.muted} start={22} />
        </AbsoluteFill>
      </Phase>

      <Phase from={fHoy} to={dur} out={6}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
          <Stat value={5000000} suffix="+" label="descargas en Android" size={170} dur={40} />
          <Grow at={fNota - fHoy - 6} w={620} gap={150}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: font.sans, fontSize: 170, fontWeight: 700, letterSpacing: -5, lineHeight: 1 }}>4,8<span style={{ color: color.yellow, display: 'inline-block', transform: `rotate(${(1 - spring({ frame: frame - fNota - 4, fps, config: { damping: 9 } })) * -120}deg) scale(${spring({ frame: frame - fNota - 4, fps, config: { damping: 9 } })})` }}>★</span></div>
              <div style={{ fontFamily: font.sans, fontSize: 42, color: color.muted, fontWeight: 500, marginTop: 20 }}>Google Play · 52.000 reseñas</div>
            </div>
          </Grow>
        </AbsoluteFill>
      </Phase>
      <Sfx name="sparkle" at={3} />
      <Sfx name="snap_in" at={4} volume={0.6} />
      <Sfx name="ui_pop" at={fCol} />
      <Sfx name="snap_in" at={f2005} />
      <Sfx name="swipe" at={fFund} />
      <Sfx name="card_flip" at={fFund + 4} />
      <Sfx name="marker" at={fFund + 16} volume={0.8} />
      <Sfx name="ui_pop" at={fSoft} />
      <Sfx name="card_flip" at={fSoft + 4} />
      <Sfx name="whoosh_soft" at={fBorges} />
      <Sfx name="page_turn" at={fBorges + 4} volume={0.8} />
      <Sfx name="swipe" at={fHoy} />
      <Sfx name="counter" at={fHoy + 2} />
      <Sfx name="snap_in" at={fNota - 4} />
      <Sfx name="sparkle" at={fNota + 4} />
    </Stage>
  );
};
