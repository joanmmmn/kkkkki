import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../../components/Sfx';
import { Burst, E, eIO, eOut, pop, ramp, Room } from './kit';
import { PlainCover } from './props';
import { w } from './timeline';

// ---------------------------------------------------------------------------------------------------------------
// Plano N (T14): cuántos a la vez: de uno a siete según la comunidad (Asturias 1, Madrid 2, Canarias 5, Melilla 7
// documentos; condiciones de cada eBiblio, 14/10/2026). Y el audiolibro más prestado de 2025: «El retrato de casada»
// (Informe eBiblio 2025).
// ---------------------------------------------------------------------------------------------------------------
export const Limits: React.FC<{ dur: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w('T14', 'B15', word, n);
  const fDep = at('depende'), fUno = at('uno'), fCinco = at('siete'), fY = at('Y'), fMas = at('más'), f2025 = at('2025'), fRet = at('retrato');
  const shelf = pop(frame, 4, fps, 120, 16);
  const out = ramp(frame, fY - 10, fY + 6, eIO);
  const chips: [string, number][] = [['Asturias', 1], ['Madrid', 2], ['Canarias', 5], ['Melilla', 7]];
  const medal = pop(frame, fMas - 6, fps, 160, 12);
  const book = pop(frame, fRet - 14, fps, 120, 15);
  const yr = pop(frame, f2025 - 6, fps, 200, 13);
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Room wall={E.coralPale} floor={E.coral} base={E.coralLight} floorY={900}>
        <div style={{ position: 'absolute', left: 960 - 600, top: 40, width: 1200, height: 1200, borderRadius: '50%', background: E.paper, opacity: 0.5 }} />
      </Room>
      {/* parte 1: huecos de préstamo */}
      <AbsoluteFill style={{ opacity: 1 - out, transform: `translateY(${-out * 60}px)` }}>
        <div style={{ position: 'absolute', left: 960, top: 120, transform: 'translateX(-50%)', fontFamily: E.font, fontWeight: 800, fontSize: 64, color: E.ink, whiteSpace: 'nowrap', opacity: ramp(frame, 4, 20, eOut) }}>
          ¿Cuántos a la vez?
        </div>
        <div style={{ position: 'absolute', left: 960 - 637, top: 320, width: 1274, height: 260, transform: `scale(${0.9 + 0.1 * Math.min(1, shelf)})`, opacity: Math.min(1, shelf * 2) }}>
          <div style={{ position: 'absolute', left: -20, right: -20, bottom: -16, height: 26, borderRadius: 8, background: E.plum }} />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const fill = i === 0 ? ramp(frame, fUno - 8, fUno + 2, eOut) : ramp(frame, fCinco - 22 + i * 3.5, fCinco - 10 + i * 3.5, eOut);
            return (
              <div key={i} style={{ position: 'absolute', left: i * 182, top: 0, width: 164, height: 236, borderRadius: 14, border: `5px dashed ${E.coralLight}`, boxSizing: 'border-box' }}>
                <div style={{ position: 'absolute', left: 0, right: 0, top: -62, textAlign: 'center', fontFamily: E.font, fontWeight: 800, fontSize: 42, color: E.coral }}>{i + 1}</div>
                {fill > 0.01 && (
                  <div style={{ position: 'absolute', left: 5, top: 5, transform: `translateY(${(1 - fill) * -120}px) rotate(${(1 - fill) * 12}deg)`, opacity: fill }}>
                    <PlainCover w={144} title={['Novela', 'Ensayo', 'Thriller', 'Poesía', 'Infantil', 'Historia', 'Viajes'][i]} bg={[E.coral, E.plum, E.mustard, E.pink, E.olive, E.violet, E.coralDeep][i]} accent={i === 2 ? E.plum : E.mustard} style={{ height: 216 }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ position: 'absolute', left: 960, top: 690, transform: `translateX(-50%) scale(${0.8 + 0.2 * Math.min(1.05, pop(frame, fCinco - 4, fps, 200, 13))})`, opacity: ramp(frame, fCinco - 6, fCinco + 4, eOut),
          padding: '12px 36px', borderRadius: 999, background: E.ink, color: E.mustardLight, fontFamily: E.font, fontWeight: 800, fontSize: 48, whiteSpace: 'nowrap' }}>De 1 a 7, según tu comunidad</div>
        <div style={{ position: 'absolute', left: 960, top: 800, transform: 'translateX(-50%)', display: 'flex', gap: 22 }}>
          {chips.map(([n, k], i) => {
            const s = pop(frame, fDep + i * 8, fps, 200, 13);
            return (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 24px', borderRadius: 999, background: E.paper, boxShadow: `4px 4px 0 ${E.plum}`, fontFamily: E.font, fontWeight: 700, fontSize: 32, color: E.ink,
                transform: `scale(${0.7 + 0.3 * Math.min(1.08, s)})`, opacity: Math.min(1, s * 2) }}>
                {n} <span style={{ color: E.coral, fontWeight: 800 }}>{k}</span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {/* parte 2: el más prestado de 2025 */}
      {medal > 0.01 && (
        <AbsoluteFill>
          <div style={{ position: 'absolute', left: 960 - 560, top: 180, transform: `scale(${0.6 + 0.4 * Math.min(1.08, medal)}) rotate(${(1 - Math.min(1, medal)) * -40}deg)`, opacity: Math.min(1, medal * 2) }}>
            {/* medalla */}
            <svg width="300" height="420" viewBox="0 0 300 420">
              <path d="M90 0 L150 140 L210 0 L250 0 L170 190 L130 190 L50 0 Z" fill={E.coral} />
              <path d="M60 0 L90 0 L150 140 L130 190 Z" fill={E.coralDeep} />
              <circle cx="150" cy="270" r="120" fill={E.mustard} />
              <circle cx="150" cy="270" r="96" fill={E.mustardLight} />
              <text x="150" y="300" textAnchor="middle" fontFamily="Poppins" fontWeight="800" fontSize="96" fill={E.ink}>1</text>
            </svg>
          </div>
          <Burst at={fMas - 2} x={960 - 410} y={450} r={170} color={E.mustard} rays={12} />
          <div style={{ position: 'absolute', left: 900, top: 150, transform: `translateY(${(1 - Math.min(1, book)) * 500}px) rotate(${(1 - Math.min(1, book)) * 8 + 3}deg)`, opacity: Math.min(1, book * 2) }}>
            <PlainCover w={400} title="El retrato de casada" author="Maggie O'Farrell" bg={E.plum} accent={E.pink} style={{ height: 500 }} />
          </div>
          <div style={{ position: 'absolute', left: 960 - 590, top: 720, width: 1180, textAlign: 'center', fontFamily: E.font, opacity: ramp(frame, f2025 - 8, f2025 + 6, eOut) }}>
            <div style={{ fontWeight: 800, fontSize: 56, color: E.ink, transform: `scale(${0.85 + 0.15 * Math.min(1.05, yr)})` }}>El audiolibro más prestado de 2025</div>
            <div style={{ fontWeight: 500, fontSize: 28, color: E.inkSoft, marginTop: 8 }}>Informe eBiblio 2025 (Ministerio de Cultura)</div>
          </div>
        </AbsoluteFill>
      )}
      <Sfx name="cardboard_pop" at={6} volume={0.5} />
      {chips.map((c, i) => <Sfx key={c[0]} name="pop" at={fDep + i * 8} volume={0.35} />)}
      <Sfx name="card_drop" at={fUno} volume={0.6} />
      {[1, 2, 3, 4, 5, 6].map((i) => <Sfx key={i} name="card_drop" at={fCinco - 12 + i * 3.5} volume={0.4} />)}
      <Sfx name="whoosh_soft" at={fY - 10} volume={0.45} />
      <Sfx name="score_ding" at={fMas - 4} volume={0.55} />
      <Sfx name="swish_up" at={fRet - 12} volume={0.45} />
    </AbsoluteFill>
  );
};
