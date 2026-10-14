import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../../components/Sfx';
import { Logo } from '../../components/Logo';
import { clamp01, E, eIO, eOut, pop, ramp, Stip } from './kit';
import { w } from './timeline';

// ---------------------------------------------------------------------------------------------------------------
// Plano P (T16): cierre de marca. Si el que buscas tiene cola, búscalo en SonorBooks: el buscador escribe «Cien años
// de soledad» y salen las tres respuestas (gratis, en qué plataforma, a qué precio); después, la marca. Todo en la
// mitad de arriba: la de abajo queda libre para la pantalla final de YouTube.
// ---------------------------------------------------------------------------------------------------------------
const Q = 'Cien años de soledad';

export const Outro: React.FC<{ dur: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w('T16', 'B17', word, n);
  const fBuscas = at('buscas'), fSB = at('SonorBooks'), fGratis = at('gratis'), fPlat = at('plataforma'), fPrecio = at('precio');
  const typeAt = fBuscas - 6, cps = 2.6;
  const n = Math.max(0, Math.min(Q.length, Math.floor((frame - typeAt) / cps) + 1));
  const bar = pop(frame, 2, fps, 110, 18);
  const logoS = ramp(frame, fSB - 14, fSB + 10, eOut);
  const go = ramp(frame, fPrecio + 22, fPrecio + 46, eIO); // el buscador deja sitio a la marca
  const brand = ramp(frame, fPrecio + 34, fPrecio + 60, eOut);
  const pill = pop(frame, fPrecio + 48, fps, 140, 15);
  const tag = ramp(frame, fPrecio + 64, fPrecio + 84, eOut);
  const chips: [string, number][] = [['Gratis', fGratis], ['En qué plataforma', fPlat], ['A qué precio', fPrecio]];
  return (
    <AbsoluteFill style={{ background: E.pinkPale, overflow: 'hidden' }}>
      <Stip kind="r" o={0.1} />
      {/* mitad de abajo: suelo tranquilo para la pantalla final */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 560, bottom: 0, background: E.pinkLight }}>
        <Stip kind="v" o={0.14} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 546, height: 14, background: E.pink }} />
      {/* buscador + respuestas */}
      <AbsoluteFill style={{ opacity: Math.min(1, bar) * (1 - go), transform: `translateY(${(1 - Math.min(1, bar)) * 40 - go * 50}px)` }}>
        <div style={{ position: 'absolute', left: 960, top: 74, transform: `translateX(-50%) scale(${0.85 + 0.15 * logoS})`, opacity: logoS }}><Logo size={92} delay={fSB - 14} /></div>
        <div style={{ position: 'absolute', left: 960 - 580, top: 210, width: 1160, height: 104, borderRadius: 999, background: '#fff', boxShadow: `10px 10px 0 ${E.ink}`, display: 'flex', alignItems: 'center', padding: '0 18px 0 44px', gap: 22, boxSizing: 'border-box' }}>
          <svg width="40" height="40" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" stroke={E.ink} strokeWidth="2.4" fill="none" /><path d="M15.5 15.5 L21 21" stroke={E.ink} strokeWidth="2.4" strokeLinecap="round" /></svg>
          <div style={{ flex: 1, fontFamily: E.font, fontWeight: 500, fontSize: 44, color: E.ink, whiteSpace: 'nowrap' }}>
            {n === 0 ? <span style={{ color: E.inkFaint }}>Título o autor</span> : Q.slice(0, n)}
            {frame < fGratis && <span style={{ display: 'inline-block', width: 3, height: 44, marginLeft: 3, verticalAlign: -6, background: E.ink, opacity: Math.floor(frame / 12) % 2 ? 0 : 1 }} />}
          </div>
          <div style={{ width: 72, height: 72, borderRadius: 36, background: E.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" stroke={E.ink} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>
        <div style={{ position: 'absolute', left: 960, top: 362, transform: 'translateX(-50%)', display: 'flex', gap: 22 }}>
          {chips.map(([t, f], i) => {
            const s = pop(frame, f - 6, fps, 170, 14);
            return (
              <div key={t} style={{ padding: '14px 32px', borderRadius: 999, fontFamily: E.font, fontSize: 36, fontWeight: 700, whiteSpace: 'nowrap', color: E.ink,
                background: i === 0 ? E.yellow : E.paper, boxShadow: `5px 5px 0 ${i === 0 ? E.ink : E.plum}`, opacity: clamp01(s * 2), transform: `translateY(${(1 - Math.min(1, s)) * 24}px) scale(${0.85 + 0.15 * Math.min(1.05, s)})` }}>{t}</div>
            );
          })}
        </div>
      </AbsoluteFill>
      {/* marca */}
      {brand > 0.01 && (
        <AbsoluteFill>
          <div style={{ position: 'absolute', left: 960, top: 92, transform: `translateX(-50%) translateY(${(1 - brand) * 24}px)`, opacity: brand }}><Logo size={120} delay={fPrecio + 34} /></div>
          <div style={{ position: 'absolute', left: 960, top: 284, transform: `translateX(-50%) scale(${0.85 + 0.15 * Math.min(1.05, pill)})`, opacity: clamp01(pill * 2), padding: '14px 44px', borderRadius: 999,
            background: E.yellow, boxShadow: `8px 8px 0 ${E.ink}`, fontFamily: E.font, fontWeight: 800, fontSize: 48, color: E.ink }}>sonorbooks.com</div>
          <div style={{ position: 'absolute', left: 960, top: 420, transform: `translateX(-50%) translateY(${(1 - tag) * 12}px)`, opacity: tag, fontFamily: E.font, fontWeight: 600, fontSize: 40, color: E.plum, whiteSpace: 'nowrap' }}>
            Dónde escuchar cada libro y a qué precio
          </div>
        </AbsoluteFill>
      )}
      <Sfx name="whoosh_soft" at={2} volume={0.4} />
      <Sfx name="keys_type" at={typeAt} volume={0.5} trimAfter={Math.round(Q.length * cps)} />
      <Sfx name="pop_bright" at={fSB - 8} volume={0.45} />
      {chips.map(([, f], i) => <Sfx key={i} name="ui_pop" at={f - 4} volume={0.55} />)}
      <Sfx name="deep_whoosh" at={fPrecio + 22} volume={0.4} />
      <Sfx name="logo_sting" at={fPrecio + 38} volume={0.85} />
      <Sfx name="sparkle" at={fPrecio + 52} volume={0.45} />
    </AbsoluteFill>
  );
};
