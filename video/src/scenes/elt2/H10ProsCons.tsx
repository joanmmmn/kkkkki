import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { CheckIcon, CrossIcon } from '../../components/Icons';
import { Sfx } from '../../components/Sfx';
import { wordFrame } from '../../lib/vo';
import { Grow } from '../../components/Grow';

const Item: React.FC<{ ok: boolean; text: string; at: number }> = ({ ok, text, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 15, stiffness: 180 } });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '17px 0', borderBottom: `1px solid ${color.line}`, opacity: s, transform: `translateX(${(1 - s) * (ok ? -40 : 40)}px)`, filter: `blur(${(1 - s) * 6}px)` }}>
      <div style={{ transform: `scale(${s}) rotate(${(1 - s) * -40}deg)` }}>{ok ? <CheckIcon size={50} /> : <CrossIcon size={50} />}</div>
      <div style={{ fontFamily: font.sans, fontSize: 42, fontWeight: 500, lineHeight: 1.15 }}>{text}</div>
    </div>
  );
};

// V10 · Lo mejor / lo peor.
export const H10ProsCons: React.FC<{ lead: number; dur: number }> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0, fb = 0) => lead + wordFrame('V10', w, n, fb);
  const pros = [
    { t: 'Gratis de verdad', f: at('gratis', 0, 1.2) },
    { t: 'Sin publicidad', f: at('publicidad', 0, 2.64) },
    { t: 'Voces humanas', f: at('voces', 0, 3.84) },
    { t: 'Texto sincronizado con el audio', f: at('texto', 0, 4.72) },
  ];
  const fPeor = at('peor', 0, 8.76);
  const cons = [
    { t: 'Sin novedades ni superventas', f: at('novedades', 0, 9.72) },
    { t: 'Solo clásicos y obras cedidas', f: at('clasicos', 0, 11.84) },
    { t: 'Reproductor básico', f: at('reproductor', 0, 14.0) },
    { t: 'Sin temporizador ni descargas', f: at('temporizador', 0, 15.84) },
    { t: 'Web lenta y algo anticuada', f: at('web', 0, 18.0) },
  ];
  const sL = spring({ frame, fps, config: { damping: 20, stiffness: 140 } });
  const sR = spring({ frame: frame - fPeor + 6, fps, config: { damping: 20, stiffness: 140 } });
  const dimL = interpolate(frame, [fPeor, fPeor + 15], [1, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const col = (title: string, good: boolean, s: number, children: React.ReactNode, o = 1) => (
    <div style={{ width: 820, minHeight: 620, boxSizing: 'border-box', background: '#fff', borderRadius: 36, padding: '42px 54px', boxShadow: shadow.card, border: `1px solid ${color.line}`, opacity: s * o, transform: `translateY(${(1 - s) * 60}px)` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 10 }}>
        <div style={{ width: 20, height: 20, borderRadius: 10, background: good ? color.green : color.red }} />
        <div style={{ fontFamily: font.sans, fontSize: 70, fontWeight: 700 }}>{title}</div>
      </div>
      {children}
    </div>
  );
  return (
    <Stage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
        <div style={{ transform: `scale(${1 + 0.06 * (1 - sR)})`, alignSelf: 'center' }}>
          {col('Lo mejor', true, sL, pros.map((p) => <Item key={p.t} ok text={p.t} at={p.f} />), dimL)}
        </div>
        <Grow at={fPeor - 10} w={820} gap={56} rise={60}>
          {col('Lo peor', false, 1, cons.map((p) => <Item key={p.t} ok={false} text={p.t} at={p.f} />))}
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
