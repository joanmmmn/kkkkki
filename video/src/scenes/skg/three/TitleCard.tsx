import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../../../components/Sfx';
import { Logo } from '../../../components/Logo';
import { color, Dust, font, Grain, KR } from '../kit';
import { DeskBackdrop } from './Desk';
import { sceneClock } from '../timeline';
import { easeO, ramp01 } from './lib3d';

// ——— TITLE · Cabecera centrada: «Od czego i jak zacząć» / Stephen King (sin la palabra «AUTOR») ———
// Sobre la biblioteca desenfocada del gancho; una luz cálida barre el nombre.
export const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = sceneClock('TITLE').dur;
  const kick = ramp01(frame, 4, 30, easeO);
  const line = ramp01(frame, 26, 58, easeO);
  const logo = spring({ frame: frame - 48, fps, config: { damping: 16, stiffness: 140 } });
  const out = ramp01(frame, dur - 22, dur, (t) => t * t);
  const sweep = ramp01(frame, 46, 116);
  const reveal = ramp01(frame, 10, 52, easeO);
  const name = 'Stephen King';
  return (
    <AbsoluteFill style={{ background: '#0B0C0E' }}>
      <DeskBackdrop x={-20 + frame * 0.2} s={1.16 - frame * 0.0003} dim={0.62} />
      {/* foco cálido que respira detrás del título */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 48% at 50% 50%, rgba(255,206,120,${0.2 * kick}) 0%, rgba(255,206,120,0.04) 55%, rgba(0,0,0,0) 80%)` }} />
      <Dust n={50} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)' }} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', opacity: 1 - out, transform: `scale(${(1 + out * 0.06) * (1 + 0.035 * ramp01(frame, 0, dur))})`, filter: out > 0.01 ? `blur(${(out * 10).toFixed(2)}px)` : undefined }}>
        {/* la sección */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 30, opacity: kick, transform: `translateY(${(1 - kick) * 18}px)` }}>
          <div style={{ width: 110 * kick, height: 2, background: 'linear-gradient(90deg, rgba(233,200,119,0), #E9C877)' }} />
          <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 88, letterSpacing: 0.5, color: '#F3EAD8', textShadow: '0 8px 30px rgba(0,0,0,0.6)' }}>Od czego i jak zacząć</div>
          <div style={{ width: 110 * kick, height: 2, background: 'linear-gradient(90deg, #E9C877, rgba(233,200,119,0))' }} />
        </div>
        {/* el nombre, en dorado con relieve: entra con un barrido suave */}
        <div style={{ position: 'relative', marginTop: 18, WebkitMaskImage: `linear-gradient(90deg, #000 0%, #000 ${reveal * 120 - 20}%, rgba(0,0,0,0) ${reveal * 120}%)`, maskImage: `linear-gradient(90deg, #000 0%, #000 ${reveal * 120 - 20}%, rgba(0,0,0,0) ${reveal * 120}%)`,
          transform: `translateY(${(1 - reveal) * 20}px)` }}>
          <div style={{ position: 'absolute', inset: 0, fontFamily: font.sans, fontWeight: 700, fontSize: 236, letterSpacing: -9 - 2 * reveal, lineHeight: 1, color: 'rgba(0,0,0,0.55)', transform: 'translate(3px, 6px)', filter: 'blur(4px)', textAlign: 'center' }}>{name}</div>
          <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 700, fontSize: 236, letterSpacing: -9 - 2 * reveal, lineHeight: 1, textAlign: 'center',
            backgroundImage: 'linear-gradient(180deg, #FFF3C4 0%, #F1D27E 38%, #C9973F 62%, #E9C877 82%, #A77A2E 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{name}</div>
          {/* brillo que recorre las letras */}
          <div style={{ position: 'absolute', inset: 0, fontFamily: font.sans, fontWeight: 700, fontSize: 236, letterSpacing: -9 - 2 * reveal, lineHeight: 1, textAlign: 'center',
            backgroundImage: `linear-gradient(105deg, rgba(255,255,255,0) ${sweep * 140 - 30}%, rgba(255,250,230,0.95) ${sweep * 140 - 14}%, rgba(255,255,255,0) ${sweep * 140}%)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{name}</div>
        </div>
        <div style={{ marginTop: 26, width: 780 * line, height: 8, borderRadius: 4, background: KR, boxShadow: `0 0 30px rgba(193,18,31,${0.5 * line})` }} />
        <div style={{ marginTop: 46, opacity: logo, transform: `translateY(${(1 - logo) * 14}px)` }}>
          <Logo size={54} animate={false} dark />
        </div>
      </AbsoluteFill>
      <Grain seed={Math.floor(frame / 2)} opacity={0.09} />
      <Sfx name="logo_sting" at={12} volume={0.9} />
      <Sfx name="hit_soft" at={16} volume={0.6} />
      <Sfx name="shimmer" at={36} volume={0.45} />
      <Sfx name="draw" at={26} volume={0.35} dur={30} fade={10} />
      <Sfx name="whoosh_soft" at={dur - 14} volume={0.6} />
    </AbsoluteFill>
  );
};
