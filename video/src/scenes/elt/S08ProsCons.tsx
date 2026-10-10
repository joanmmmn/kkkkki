import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { CheckIcon, CrossIcon } from '../../components/Icons';
import { Sfx } from '../../components/Sfx';
import { wordFrame } from '../../lib/vo';

const Item: React.FC<{ ok: boolean; text: string; at: number }> = ({ ok, text, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 15, stiffness: 170 } });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '20px 0', borderBottom: `1px solid ${color.line}`, opacity: s, transform: `translateX(${(1 - s) * (ok ? -40 : 40)}px)`, filter: `blur(${(1 - s) * 6}px)` }}>
      <div style={{ transform: `scale(${s}) rotate(${(1 - s) * -40}deg)` }}>{ok ? <CheckIcon size={52} /> : <CrossIcon size={52} />}</div>
      <div style={{ fontFamily: font.sans, fontSize: 44, fontWeight: 500, color: color.ink, lineHeight: 1.15 }}>{text}</div>
    </div>
  );
};

// E08 · Lo mejor y lo peor, a dos columnas.
export const S08ProsCons: React.FC<{ lead: number; dur: number }> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0, fb = 0) => lead + wordFrame('E08', w, n, fb);
  const pros = [
    { t: 'Gratis de verdad', f: at('gratis', 0, 1.3) },
    { t: 'Sin publicidad', f: at('publicidad', 0, 2.9) },
    { t: 'Lees y escuchas a la vez', f: at('combina', 0, 4.2) },
  ];
  const fPeor = at('peor', 0, 7.6);
  const cons = [
    { t: 'Sin novedades ni superventas', f: at('novedades', 0, 9.1) },
    { t: 'Solo dominio público o cedidas', f: at('obras', 0, 11.5) },
    { t: 'Reproductor básico', f: at('reproductor', 0, 14.3) },
    { t: 'Sin descargas de audio', f: at('descargas', 0, 16.1) },
    { t: 'Grabaciones desiguales', f: at('calidad', 0, 17.4) },
  ];
  const sL = spring({ frame, fps, config: { damping: 20, stiffness: 130 } });
  const sR = spring({ frame: frame - fPeor + 6, fps, config: { damping: 20, stiffness: 130 } });
  const dimL = interpolate(frame, [fPeor, fPeor + 15], [1, 0.55], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const col = (title: string, good: boolean, s: number, children: React.ReactNode, o = 1) => (
    <div style={{ width: 780, background: '#fff', borderRadius: 36, padding: '46px 54px', boxShadow: shadow.card, border: `1px solid ${color.line}`, opacity: s * o, transform: `translateY(${(1 - s) * 60}px)` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 14 }}>
        <div style={{ width: 18, height: 18, borderRadius: 9, background: good ? color.green : color.red }} />
        <div style={{ fontFamily: font.sans, fontSize: 64, fontWeight: 700 }}>{title}</div>
      </div>
      {children}
    </div>
  );
  return (
    <Stage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 60 }}>
        {col('Lo mejor', true, sL, pros.map((p) => <Item key={p.t} ok text={p.t} at={p.f} />), dimL)}
        {col('Lo peor', false, sR, cons.map((p) => <Item key={p.t} ok={false} text={p.t} at={p.f} />))}
      </AbsoluteFill>
      {pros.map((p) => <Sfx key={p.t} name="tick" at={p.f} volume={0.22} />)}
      <Sfx name="whoosh_soft" at={fPeor - 8} volume={0.3} />
      {cons.map((p) => <Sfx key={p.t} name="cross" at={p.f} volume={0.28} />)}
    </Stage>
  );
};
