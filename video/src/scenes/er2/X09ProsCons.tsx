import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { CheckIcon, CrossIcon } from '../../components/Icons';
import { Sfx } from '../../components/Sfx';
import { Grow } from '../../components/Grow';
import { w } from './timeline';

const ID = 'X09';

const Item: React.FC<{ ok: boolean; text: string; sub?: string; at: number }> = ({ ok, text, sub, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 15, stiffness: 180 } });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '15px 0', borderBottom: `1px solid ${color.line}`, opacity: s, transform: `translateX(${(1 - s) * (ok ? -40 : 40)}px)`, filter: `blur(${(1 - s) * 6}px)` }}>
      <div style={{ transform: `scale(${s}) rotate(${(1 - s) * -40}deg)`, flexShrink: 0 }}>{ok ? <CheckIcon size={48} /> : <CrossIcon size={48} />}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontFamily: font.sans, fontSize: 40, fontWeight: 500, lineHeight: 1.12 }}>{text}</div>
        {sub && <div style={{ fontFamily: font.sans, fontSize: 26, color: color.muted }}>{sub}</div>}
      </div>
    </div>
  );
};

// X09 · Lo mejor / lo peor.
export const X09ProsCons: React.FC<{ lead: number; dur: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = (word: string, n = 0) => w(ID, 'W11A', word, n);
  const b = (word: string, n = 0) => w(ID, 'W11B', word, n);
  const pros = [
    { t: 'Voces muy naturales', f: a('voces') },
    { t: 'Casi cualquier texto, en audio', s: 'PDF, EPUB, Word, webs…', f: a('convierte') },
    { t: 'Sin límite práctico con Ultra', s: 'hasta 24 h de audio al día', f: a('limite') },
    { t: 'Plan gratis: 10 h al mes', f: a('gratis') },
  ];
  const fPeor = b('peor') - 8;
  const cons = [
    { t: 'La web está en inglés', f: b('web') },
    { t: 'Prémium con tope: 20 h/mes', f: b('premium') },
    { t: 'Faltan superventas en español', f: b('faltan') },
    { t: 'No exporta el audio', s: 'ni permite compartir la cuenta', f: b('descargar') },
    { t: 'En la web se paga en dólares', f: b('paga') },
  ];
  const sL = spring({ frame, fps, config: { damping: 20, stiffness: 140 } });
  const sR = spring({ frame: frame - fPeor + 6, fps, config: { damping: 20, stiffness: 140 } });
  const dimL = interpolate(frame, [fPeor, fPeor + 15], [1, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const col = (title: string, good: boolean, s: number, children: React.ReactNode, o = 1) => (
    <div style={{ width: 820, minHeight: 640, boxSizing: 'border-box', background: '#fff', borderRadius: 36, padding: '40px 52px', boxShadow: shadow.card, border: `1px solid ${color.line}`, opacity: s * o, transform: `translateY(${(1 - s) * 60}px)` }}>
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
