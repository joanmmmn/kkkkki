import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../../../components/Sfx';
import { Logo } from '../../../components/Logo';
import { color, Dust, font, Grain, KR } from '../kit';
import { DeskBackdrop } from './Desk';
import { sceneClock } from '../timeline';
import { easeO, ramp01 } from './lib3d';

// ——— TITLE · Cabecera centrada: «Por dónde y cómo empezar a leer» / Stephen King ———
// Sobre la biblioteca desenfocada del gancho; una luz cálida barre el nombre.
export const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = sceneClock('TITLE').dur;
  const kick = ramp01(frame, 4, 30, easeO);
  const line = ramp01(frame, 26, 58, easeO);
  const logo = spring({ frame: frame - 48, fps, config: { damping: 16, stiffness: 140 } });
  const out = ramp01(frame, dur - 22, dur, (t) => t * t);
  const sweep = ramp01(frame, 34, 92);
  const name = 'Stephen King';
  return (
    <AbsoluteFill style={{ background: '#0B0C0E' }}>
      <DeskBackdrop x={-20 + frame * 0.2} s={1.16 - frame * 0.0003} dim={0.62} />
      {/* foco cálido que respira detrás del título */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 48% at 50% 50%, rgba(255,206,120,${0.2 * kick}) 0%, rgba(255,206,120,0.04) 55%, rgba(0,0,0,0) 80%)` }} />
      <Dust n={50} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)' }} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', opacity: 1 - out, transform: `scale(${1 + out * 0.06})`, filter: out > 0.01 ? `blur(${(out * 10).toFixed(2)}px)` : undefined }}>
        {/* subtítulo de la sección */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 26, opacity: kick, transform: `translateY(${(1 - kick) * 16}px)` }}>
          <div style={{ width: 90 * kick, height: 2, background: color.yellow }} />
          <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 38, letterSpacing: 4 + 8 * (1 - kick), textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)' }}>Por dónde y cómo empezar a leer</div>
          <div style={{ width: 90 * kick, height: 2, background: color.yellow }} />
        </div>
        {/* el nombre */}
        <div style={{ position: 'relative', marginTop: 30 }}>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 236, letterSpacing: -11, lineHeight: 1, color: '#fff', display: 'flex', justifyContent: 'center', textShadow: '0 20px 70px rgba(0,0,0,0.6)' }}>
            {Array.from(name).map((ch, i) => {
              const s = spring({ frame: frame - 12 - i * 1.7, fps, config: { damping: 17, stiffness: 140 } });
              return <span key={i} style={{ display: 'inline-block', whiteSpace: 'pre', opacity: s, transform: `translateY(${(1 - s) * 50}px) scale(${0.92 + 0.08 * s})`, filter: s < 0.99 ? `blur(${((1 - s) * 14).toFixed(2)}px)` : undefined }}>{ch}</span>;
            })}
          </div>
          {/* barrido de luz sobre las letras */}
          {sweep > 0 && sweep < 1 && (
            <div style={{ position: 'absolute', inset: 0, fontFamily: font.sans, fontWeight: 700, fontSize: 236, letterSpacing: -11, lineHeight: 1, display: 'flex', justifyContent: 'center',
              backgroundImage: `linear-gradient(100deg, rgba(255,255,255,0) ${sweep * 140 - 30}%, rgba(255,233,168,0.95) ${sweep * 140 - 15}%, rgba(255,255,255,0) ${sweep * 140}%)`,
              WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{name}</div>
          )}
        </div>
        <div style={{ marginTop: 24, width: 780 * line, height: 9, borderRadius: 5, background: KR, boxShadow: `0 0 30px rgba(193,18,31,${0.5 * line})` }} />
        <div style={{ marginTop: 50, opacity: logo, transform: `translateY(${(1 - logo) * 14}px)` }}>
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
