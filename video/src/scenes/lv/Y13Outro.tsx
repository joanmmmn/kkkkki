import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { softSpring as spring } from '../../lib/motion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phase } from '../../components/Phase';
import { Logo } from '../../components/Logo';
import { Words, Typewriter } from '../../components/Kinetic';
import { Pill } from '../../components/Pill';
import { Sfx } from '../../components/Sfx';
import { clamp } from '../../lib/anim';
import { Chip } from './common';
import { w } from './timeline';

// Y13 · Cierre de marca: buscador de SonorBooks (gratis en LibriVox, en El Libro Total o en qué plataforma, y a qué precio).
export const Y13Outro: React.FC<{ lead: number; dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w('Y13', 'L13', word, n);
  const fGratis = at('gratis');
  const fLV = at('LibriVox');
  const fELT = at('Libro', 1);
  const fPlat = at('plataforma');
  const fPrecio = at('precio');
  const fTu = at('SonorBooks') + 16;
  const typeAt = Math.max(10, at('libro') - 6);
  const go = fPrecio + 4;
  const press = interpolate(frame, [go, go + 4, go + 12], [0, 1, 0], clamp);
  const ring = interpolate(frame, [go + 4, go + 24], [0, 1], clamp);
  return (
    <Stage tone="warm">
      <Phase from={0} to={fTu + 2}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 50 }}>
          <Logo size={120} delay={2} />
          <div style={{ width: 1160, height: 104, borderRadius: 999, background: '#fff', boxShadow: shadow.float, border: `1px solid ${color.line}`, display: 'flex', alignItems: 'center', padding: '0 18px 0 46px', gap: 24 }}>
            <svg width="38" height="38" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" stroke={color.ink} strokeWidth="2.4" fill="none" /><path d="M15.5 15.5 L21 21" stroke={color.ink} strokeWidth="2.4" strokeLinecap="round" /></svg>
            <div style={{ flex: 1, fontFamily: font.sans, fontSize: 42, color: color.ink }}>
              {frame < typeAt ? <span style={{ color: color.muted }}>Título o autor</span> : <Typewriter text="Leyendas, de Bécquer" start={typeAt} cps={20} />}
            </div>
            <div style={{ width: 72, height: 72, borderRadius: 36, background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 - 0.14 * press})`, boxShadow: `0 0 0 ${26 * ring}px rgba(255,202,5,${0.5 * (1 - ring)})` }}>
              <svg width="32" height="32" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" stroke={color.ink} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 22 }}>
            <Chip at={fLV - 4} size={36}>Gratis en LibriVox</Chip>
            <Chip at={fELT - 4} size={36}>Gratis en El Libro Total</Chip>
            <Chip at={fPlat - 4} size={36} bg={color.yellow}>Cada plataforma, con su precio</Chip>
          </div>
          <div style={{ fontFamily: font.sans, fontSize: 32, color: color.ink2, opacity: spring({ frame: frame - fGratis, fps }) }}>Dónde escuchar cada audiolibro, y a qué precio</div>
        </AbsoluteFill>
      </Phase>

      <Phase from={fTu} to={dur} hold>
        {/* Bloque de marca en la mitad superior: la inferior queda libre para la pantalla final de YouTube. */}
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 170, flexDirection: 'column', gap: 34, background: '#fff' }}>
          <Logo size={150} animate={false} />
          <Words text="Tu próxima historia te está esperando." start={2} stagger={4} size={62} weight={500} />
          <div style={{ opacity: spring({ frame: frame - fTu - 40, fps }), transform: `scale(${0.85 + 0.15 * spring({ frame: frame - fTu - 40, fps, config: { damping: 12 } })})` }}><Pill size={40}>sonorbooks.com</Pill></div>
          <div style={{ fontFamily: font.sans, fontSize: 30, color: color.ink2, opacity: spring({ frame: frame - fTu - 52, fps }) }}>Busca y compara gratis, sin registro.</div>
        </AbsoluteFill>
      </Phase>

      <Sfx name="whoosh_deep" at={0} volume={0.7} />
      <Sfx name="logo_sting" at={4} />
      <Sfx name="typing" at={typeAt} trimAfter={60} />
      <Sfx name="ui_pop" at={fLV - 2} />
      <Sfx name="ui_pop" at={fELT - 2} />
      <Sfx name="ui_pop" at={fPlat - 2} />
      <Sfx name="click" at={go + 4} />
      <Sfx name="whoosh_soft" at={fTu} />
      <Sfx name="sparkle" at={fTu + 40} />
    </Stage>
  );
};
