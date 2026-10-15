import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../../components/Sfx';
import { clamp01, E, eIO, eOut, lerp, pop, ramp, Room, Stip } from './kit';
import { LOOKS, Person, Plant, PlainCover, Spines } from './props';
import { Label } from './C_What';
import { w } from './timeline';

// ---------------------------------------------------------------------------------------------------------------
// Plano D (T04): funciona como la biblioteca de siempre. Un audiolibro en su balda; se convierte en tres ejemplares;
// tres lectores se los llevan (cada uno con su etiqueta de 21 días) y la balda se queda vacía; el cuarto saca turno en
// el dispensador y se forma la cola.
// ---------------------------------------------------------------------------------------------------------------
const FLOOR = 880, PS = 430; // suelo y altura de las personas
const SX = [740, 960, 1180]; // ejemplares en la balda
const SHELF_Y = 560; // apoyo de los ejemplares (encima del expositor)

export const Copies: React.FC<{ dur: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w('T04', 'B05', word, n);
  const fCada = at('Cada'), fEj = at('ejemplares'), fLibre = at('libre'), fDias = at('días');
  const fTodos = at('todos'), fPrest = at('prestados'), fCola = at('cola'), fPones = at('pones');
  const intro = pop(frame, 4, fps, 120, 16);
  const split = ramp(frame, fCada + 6, fEj + 4, eIO);
  const lab = pop(frame, fEj - 2, fps, 170, 13);
  // tres lectores: entran, cogen su ejemplar y se van
  const T = [fLibre - 34, fDias - 8, fTodos - 26];
  const reader = (i: number) => {
    const t0 = T[i];
    const inP = ramp(frame, t0, t0 + 34, eIO);
    const grab = ramp(frame, t0 + 34, t0 + 46, eOut);
    const outP = ramp(frame, t0 + 54, t0 + 100, (t) => t * t);
    const x = lerp(-260, SX[i] - 80, inP) + outP * (2200 - SX[i]);
    const walking = (inP > 0 && inP < 1) || (outP > 0 && outP < 1);
    return { x, grab, outP, walking, inP };
  };
  const empty = pop(frame, fPrest + 14, fps, 200, 12);
  // cola: el cuarto saca turno; llegan dos más
  const q = [0, 1, 2].map((k) => ramp(frame, fPones - 40 + k * 14, fPones - 4 + k * 14, eIO));
  const ticket = ramp(frame, fCola - 14, fCola + 2, eOut);
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Room wall={E.mustardPale} floor={E.coralLight} base={E.mustardLight} floorY={FLOOR}>
        <div style={{ position: 'absolute', left: 960 - 520, top: 120, width: 1040, height: 1040, borderRadius: '50%', background: E.mustardLight, opacity: 0.5 }} />
        <div style={{ position: 'absolute', left: 90, top: FLOOR - 420 }}><Plant size={300} pot={E.plum} seed={3} /></div>
        {/* expositor bajo: los ejemplares se apoyan encima */}
        <div style={{ position: 'absolute', left: 960 - 380, top: SHELF_Y, width: 760, height: FLOOR - SHELF_Y, transform: `scale(${0.92 + 0.08 * Math.min(1, intro)})`, transformOrigin: '50% 100%', opacity: Math.min(1, intro * 2) }}>
          <div style={{ position: 'absolute', inset: 0, background: E.plum, borderRadius: '10px 10px 0 0' }}><Stip kind="h" flip o={0.2} /></div>
          <div style={{ position: 'absolute', left: -14, right: -14, top: -18, height: 26, borderRadius: 8, background: E.violet }} />
          {[0, 1].map((r) => (
            <div key={r} style={{ position: 'absolute', left: 30, right: 30, top: 40 + r * 140, height: 110, background: E.plumDeep, borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: 10, bottom: 0 }}><Spines w={680} h={96} seed={40 + r} plank={E.plumDeep} /></div>
            </div>
          ))}
        </div>
        {/* «Prestados» en la balda vacía */}
        {empty > 0.01 && (
          <div style={{ position: 'absolute', left: 960, top: SHELF_Y - 150, transform: `translate(-50%, 0) rotate(-6deg) scale(${lerp(1.6, 1, clamp01(empty))})`, opacity: clamp01(empty * 2),
            padding: '12px 36px', border: `6px solid ${E.coral}`, borderRadius: 14, color: E.coral, fontFamily: E.font, fontWeight: 800, fontSize: 56, letterSpacing: '0.04em' }}>PRESTADOS</div>
        )}
        {/* dispensador de turnos */}
        <div style={{ position: 'absolute', left: 1420, top: FLOOR - 470 }}>
          <div style={{ position: 'absolute', left: 52, top: 120, width: 16, height: 350, background: E.ink2 }} />
          <div style={{ position: 'absolute', left: 10, top: 455, width: 100, height: 16, borderRadius: 8, background: E.ink2 }} />
          <div style={{ position: 'absolute', left: 0, top: 0, width: 120, height: 130, borderRadius: '50% 50% 40% 40%', background: E.coral }}>
            <Stip kind="h" flip o={0.25} />
            <div style={{ position: 'absolute', left: 22, top: 30, width: 76, height: 30, borderRadius: 8, background: E.paper, fontFamily: E.font, fontWeight: 800, fontSize: 18, color: E.coral, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>TURNO</div>
            <div style={{ position: 'absolute', left: 30, top: 86, width: 60, height: 8, borderRadius: 4, background: E.ink }} />
          </div>
          {ticket > 0.01 && ticket < 1 && (
            <div style={{ position: 'absolute', left: 36, top: 90 + ticket * 30, width: 48, height: 40 + ticket * 10, background: E.paper, borderRadius: 3, transform: `rotate(${ticket * 14}deg)` }} />
          )}
        </div>
        {/* ejemplares */}
        {SX.map((x, i) => {
          const r = reader(i);
          if (r.outP >= 1) return null;
          // antes de repartirse, los tres están uno encima de otro en el centro
          const sx = lerp(960, x, split);
          const held = r.grab;
          const px = r.x + 120, py = FLOOR - PS * 0.5;
          const cx = lerp(sx, px, held), cy = lerp(SHELF_Y - 18 - 100, py - 40, held);
          const size = lerp(200, 120, held);
          const show = i === 1 || split > 0.001;
          if (!show) return null;
          const tag = ramp(frame, T[i] + 40, T[i] + 52, eOut);
          return (
            <div key={i} style={{ position: 'absolute', left: cx - size / 2, top: cy - size / 2, transform: `rotate(${held * (i - 1) * 6}deg)`, zIndex: held > 0 ? 3 : 1 }}>
              <PlainCover w={size} title="La novela" author="Autora" bg={E.coral} accent={E.mustard} />
              {/* auriculares de audiolibro */}
              <div style={{ position: 'absolute', right: -10, top: -10, width: 44 * size / 170, height: 44 * size / 170, borderRadius: '50%', background: E.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width={26 * size / 170} height={26 * size / 170} viewBox="0 0 24 24"><path d="M4 15v-3a8 8 0 0 1 16 0v3" fill="none" stroke={E.paper} strokeWidth="2.6" strokeLinecap="round" /><rect x="3" y="14" width="5" height="7" rx="2" fill={E.paper} /><rect x="16" y="14" width="5" height="7" rx="2" fill={E.paper} /></svg>
              </div>
              {tag > 0.01 && (
                <div style={{ position: 'absolute', left: size * 0.5 - 70, top: size + 6, width: 140, transform: `rotate(${(1 - tag) * 30 - 4}deg) scale(${tag})`, transformOrigin: '50% 0%' }}>
                  <div style={{ margin: '0 auto', width: 2, height: 16, background: E.ink2 }} />
                  <div style={{ padding: '8px 0', borderRadius: 10, background: E.mustard, textAlign: 'center', fontFamily: E.font, fontWeight: 800, fontSize: 30, color: E.ink }}>21 días</div>
                </div>
              )}
            </div>
          );
        })}
        {/* lectores */}
        {[0, 1, 2].map((i) => {
          const r = reader(i);
          if (r.inP <= 0 || r.outP >= 1) return null;
          return (
            <div key={i} style={{ position: 'absolute', left: r.x, top: FLOOR - PS, zIndex: 2 }}>
              <Person look={LOOKS[i]} size={PS} walk={r.walking ? frame / 16 : 0} reach={r.outP > 0 ? 0.35 : Math.min(1, r.grab * 1.2) * 0.9} />
            </div>
          );
        })}
        {/* la cola */}
        {q.map((p, k) => {
          if (p <= 0) return null;
          const x = lerp(2100 + k * 200, 1250 + k * 150, p);
          return (
            <div key={`q${k}`} style={{ position: 'absolute', left: x, top: FLOOR - PS, zIndex: 2 }}>
              <Person look={LOOKS[3 + k]} size={PS} flip walk={p < 1 ? frame / 16 : 0} bob={Math.sin(frame * 0.07 + k) * 1.2} reach={k === 0 ? ticket * 0.6 : 0} />
              {(k > 0 ? p >= 1 : ticket >= 1) && (
                <div style={{ position: 'absolute', left: 30, top: PS * 0.36, width: 54, height: 66, borderRadius: 4, background: E.paper, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: E.font, fontWeight: 800, fontSize: 32, color: E.coral, transform: 'rotate(-8deg)', boxShadow: '3px 3px 0 rgba(15,21,33,0.25)' }}>{k + 1}</div>
              )}
            </div>
          );
        })}
      </Room>
      <Label x={960} y={190} s={lab} text="Unos cuantos ejemplares" bg={E.ink} color={E.mustardLight} size={46} />
      <Label x={1560} y={300} s={pop(frame, fCola - 8, fps, 170, 13)} text="Cola" bg={E.coral} color={E.paper} size={44} />
      <Sfx name="cardboard_pop" at={6} volume={0.5} />
      <Sfx name="card_flip" at={fCada + 8} volume={0.6} />
      <Sfx name="card_flip" at={fCada + 16} volume={0.5} />
      {T.map((t, i) => <Sfx key={i} name="paper_lift" at={t + 34} volume={0.6} />)}
      {T.map((t, i) => <Sfx key={`t${i}`} name="tick_soft" at={t + 44} volume={0.6} />)}
      <Sfx name="stamp" at={fPrest + 16} volume={0.6} />
      <Sfx name="ticket_pull" at={fCola - 14} volume={0.9} />
      <Sfx name="crowd_soft" at={fPones - 40} volume={0.35} trimAfter={90} />
    </AbsoluteFill>
  );
};
