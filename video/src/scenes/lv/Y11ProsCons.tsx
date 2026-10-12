import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { softSpring as spring } from '../../lib/motion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { CheckIcon, CrossIcon } from '../../components/Icons';
import { Sfx } from '../../components/Sfx';
import { Grow } from '../../components/Grow';
import { w } from './timeline';

const ID = 'Y11';

const Item: React.FC<{ ok: boolean; text: string; sub?: string; at: number }> = ({ ok, text, sub, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 15, stiffness: 180 } });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '17px 0', borderBottom: `1px solid ${color.line}`, opacity: s, transform: `translateX(${(1 - s) * (ok ? -28 : 28)}px)`, filter: s < 0.99 ? `blur(${(1 - s) * 3}px)` : undefined }}>
      <div style={{ transform: `scale(${s}) rotate(${(1 - s) * -40}deg)`, flexShrink: 0 }}>{ok ? <CheckIcon size={50} /> : <CrossIcon size={50} />}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontFamily: font.sans, fontSize: 42, fontWeight: 500, lineHeight: 1.12 }}>{text}</div>
        {sub && <div style={{ fontFamily: font.sans, fontSize: 27, color: color.muted }}>{sub}</div>}
      </div>
    </div>
  );
};

// Y11 · Lo mejor / lo peor.
export const Y11ProsCons: React.FC<{ lead: number; dur: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = (word: string, n = 0) => w(ID, 'L11A', word, n);
  const b = (word: string, n = 0) => w(ID, 'L11B', word, n);
  const pros = [
    { t: 'Gratis de verdad y legal', f: a('gratis') },
    { t: 'Sin anuncios ni registro', f: a('anuncios') },
    { t: 'Voces humanas', s: 'leídas por voluntarios', f: a('voces') },
    { t: 'MP3 tuyos para siempre', s: 'también ZIP, M4B y RSS', f: a('MP3') },
  ];
  const fPeor = b('peor') - 8;
  const cons = [
    { t: 'Solo clásicos', s: 'nada de novedades', f: b('solo') },
    { t: 'La calidad de las voces varía', f: b('calidad') },
    { t: 'La web está en inglés', f: b('web') },
    { t: 'Sin app oficial', s: 'usa el RSS o apps de terceros', f: b('app') },
  ];
  const sL = spring({ frame, fps, config: { damping: 20, stiffness: 140 } });
  const dimL = interpolate(frame, [fPeor, fPeor + 15], [1, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const sR = spring({ frame: frame - fPeor + 6, fps, config: { damping: 20, stiffness: 140 } });
  const col = (title: string, good: boolean, s: number, children: React.ReactNode, o = 1) => (
    <div style={{ width: 820, minHeight: 600, boxSizing: 'border-box', background: '#fff', borderRadius: 36, padding: '40px 52px', boxShadow: shadow.card, border: `1px solid ${color.line}`, opacity: s * o, transform: `translateY(${(1 - s) * 60}px)` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 10 }}>
        <div style={{ width: 20, height: 20, borderRadius: 10, background: good ? color.green : color.red }} />
        <div style={{ fontFamily: font.sans, fontSize: 68, fontWeight: 700 }}>{title}</div>
      </div>
      {children}
    </div>
  );
  return (
    <Stage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
        <div style={{ transform: `scale(${1 + 0.06 * (1 - sR)})`, alignSelf: 'center' }}>
          {col('Lo mejor', true, sL, pros.map((p) => <Item key={p.t} ok text={p.t} sub={p.s} at={p.f} />), dimL)}
        </div>
        <Grow at={fPeor - 10} w={820} gap={56} rise={60}>
          {col('Lo peor', false, 1, cons.map((p) => <Item key={p.t} ok={false} text={p.t} sub={p.s} at={p.f} />))}
        </Grow>
      </AbsoluteFill>
      <Sfx name="card_flip" at={2} />
      {pros.map((p) => <Sfx key={p.t} name="tick" at={p.f} />)}
      <Sfx name="swipe" at={fPeor - 6} />
      <Sfx name="card_flip" at={fPeor - 2} />
      {cons.map((p) => <Sfx key={p.t} name="cross" at={p.f} />)}
    </Stage>
  );
};
