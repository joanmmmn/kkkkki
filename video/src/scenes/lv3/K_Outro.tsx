import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../../components/Sfx';
import { Logo } from '../../components/Logo';
import { color, font } from '../../brand/tokens';
import { eIO, eOut, ramp, sp, T } from './kit';
import { w } from './timeline';

// ---------------------------------------------------------------------------------------------------------------
// Plano K (S14): cierre de marca. En la biblioteca de noche, el buscador de SonorBooks: se escribe «Leyendas de
// Bécquer» y aparecen las tres respuestas (gratis, en qué plataforma, a qué precio). Después, la marca. Todo en la mitad
// de arriba: la de abajo queda libre para la pantalla final de YouTube.
// ---------------------------------------------------------------------------------------------------------------
const Q = 'Leyendas de Bécquer';

export const Outro: React.FC<{ dur: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w('S14', 'K15', word, n);
  const fDonde = at('dónde'), fGratis = at('gratis'), fPlat = at('plataforma'), fPrecio = at('precio'), fBusca = at('búscalo'), fSB = at('SonorBooks');
  const typeAt = fDonde + 4, cps = 3; // fotogramas por letra
  const n = Math.max(0, Math.min(Q.length, Math.floor((frame - typeAt) / cps) + 1));
  const bar = sp(frame, 2, fps, 90, 20);
  const go = ramp(frame, fBusca - 14, fBusca + 16, eIO); // el buscador sube y deja paso a la marca
  const brand = ramp(frame, fBusca + 2, fBusca + 30, eOut);
  const pill = sp(frame, fSB + 16, fps, 120, 18);
  const tag = ramp(frame, fSB + 34, fSB + 54, eOut);
  const chips: [string, number][] = [['Gratis', fGratis], ['En qué plataforma', fPlat], ['A qué precio', fPrecio]];
  return (
    <AbsoluteFill>
      {/* foco cálido en la mitad de arriba */}
      <AbsoluteFill style={{ background: 'radial-gradient(50% 42% at 50% 26%, rgba(255,214,150,0.16) 0%, rgba(255,214,150,0) 100%)' }} />
      {/* buscador */}
      <AbsoluteFill style={{ alignItems: 'center', opacity: Math.min(1, bar) * (1 - go), transform: `translateY(${(1 - Math.min(1, bar)) * 40 - go * 60}px)` }}>
        <div style={{ position: 'absolute', top: 150, width: 1180, height: 108, borderRadius: 999, background: '#fffdf8', boxShadow: '0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,236,200,0.3)', display: 'flex', alignItems: 'center', padding: '0 20px 0 48px', gap: 24 }}>
          <svg width="40" height="40" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" stroke={color.ink} strokeWidth="2.4" fill="none" /><path d="M15.5 15.5 L21 21" stroke={color.ink} strokeWidth="2.4" strokeLinecap="round" /></svg>
          <div style={{ flex: 1, fontFamily: font.sans, fontSize: 44, color: color.ink, whiteSpace: 'nowrap' }}>
            {n === 0 ? <span style={{ color: '#9b958a' }}>Título o autor</span> : Q.slice(0, n)}
            {frame < fGratis && <span style={{ display: 'inline-block', width: 3, height: 44, marginLeft: 3, verticalAlign: -8, background: color.ink, opacity: Math.floor(frame / 12) % 2 ? 0 : 1 }} />}
          </div>
          <div style={{ width: 76, height: 76, borderRadius: 38, background: T.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="34" height="34" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" stroke={color.ink} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>
        <div style={{ position: 'absolute', top: 300, display: 'flex', gap: 24 }}>
          {chips.map(([t, f], i) => {
            const s = sp(frame, f - 6, fps, 160, 18);
            return (
              <div key={t} style={{ padding: '16px 34px', borderRadius: 999, fontFamily: font.sans, fontSize: 38, fontWeight: 500, color: i === 0 ? color.ink : T.cream,
                background: i === 0 ? T.yellow : 'rgba(255,236,200,0.08)', border: i === 0 ? 'none' : '2px solid rgba(255,202,5,0.7)', opacity: Math.min(1, s), transform: `translateY(${(1 - Math.min(1, s)) * 24}px) scale(${0.9 + 0.1 * Math.min(1, s)})` }}>{t}</div>
            );
          })}
        </div>
      </AbsoluteFill>
      {/* marca (mitad de arriba) */}
      {brand > 0.01 && (
        <AbsoluteFill style={{ alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 120, opacity: brand, transform: `translateY(${(1 - brand) * 30}px)` }}>
            <Logo size={130} delay={fBusca + 2} dark />
          </div>
          <div style={{ position: 'absolute', top: 318, padding: '14px 40px', borderRadius: 999, background: T.yellow, fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: color.ink,
            opacity: Math.min(1, pill), transform: `scale(${0.85 + 0.15 * Math.min(1, pill)})` }}>sonorbooks.com</div>
          <div style={{ position: 'absolute', top: 436, fontFamily: T.serif, fontStyle: 'italic', fontSize: 46, color: T.cream, opacity: tag, transform: `translateY(${(1 - tag) * 12}px)` }}>Dónde escuchar cada libro y a qué precio</div>
        </AbsoluteFill>
      )}
      <Sfx name="reveal_whoosh" at={2} volume={0.4} />
      <Sfx name="typing" at={typeAt} volume={0.45} trimAfter={Q.length * cps + 4} />
      {chips.map(([, f], i) => <Sfx key={i} name="ui_pop" at={f - 4} volume={0.5} />)}
      <Sfx name="deep_whoosh" at={fBusca - 10} volume={0.4} />
      <Sfx name="logo_sting" at={fBusca + 6} volume={0.9} />
      <Sfx name="sparkle" at={fSB + 18} volume={0.5} />
    </AbsoluteFill>
  );
};
