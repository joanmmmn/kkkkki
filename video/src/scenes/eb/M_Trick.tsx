import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../../components/Sfx';
import { E, eIO, eOut, es, pop, ramp, rnd, Stip } from './kit';
import { Crop, Mark } from './web';
import { Label } from './C_What';
import { w } from './timeline';

// ---------------------------------------------------------------------------------------------------------------
// Plano M (T13): el truco. Una pared de lomos: casi dos mil se encienden en verde («Títulos disponibles», eBiblio
// Madrid, 14/10/2026: 1.998). Y no son de segunda: la ficha real dice la editorial (Penguin Random House…), y los
// narradores son los mismos que en las apps de pago.
// ---------------------------------------------------------------------------------------------------------------
const COLS = 26, ROWS = 7;
const CW = 56, RH = 96;
const SP = [E.coral, E.plum, E.mustard, E.pink, E.violet, E.olive, E.coralLight, E.oliveMid];

export const Trick: React.FC<{ dur: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w('T13', 'B14', word, n);
  const fTruco = at('truco'), fMad = at('Madrid'), fCasi = at('casi'), fMil = at('mil'), fAhora = at('ahora');
  const fNo = at('no'), fSegunda = at('segunda'), fEdit = at('editoriales'), fNarr = at('narradores');
  const wall = ramp(frame, 0, 24, eOut);
  const light = ramp(frame, fCasi - 30, fMil + 30, eIO);
  const cnt = ramp(frame, fCasi - 10, fMil + 16, (t) => 1 - Math.pow(1 - t, 3));
  const cntS = pop(frame, fCasi - 14, fps, 150, 15);
  const out = ramp(frame, fNo - 14, fNo + 6, eIO);
  const card = pop(frame, fSegunda - 10, fps, 120, 16);
  const mic = pop(frame, fNarr - 18, fps, 170, 14);
  const truco = pop(frame, fTruco - 6, fps, 220, 12);
  return (
    <AbsoluteFill style={{ background: E.pinkPale, overflow: 'hidden' }}>
      <Stip kind="r" o={0.12} />
      {/* pared de lomos */}
      <div style={{ position: 'absolute', left: 960 - (COLS * CW) / 2, top: 120, width: COLS * CW, height: ROWS * RH, opacity: wall * (1 - out * 0.8), transform: `scale(${1 - out * 0.06})` }}>
        {Array.from({ length: ROWS }, (_, r) => (
          <div key={r} style={{ position: 'absolute', left: -20, right: -20, top: r * RH + RH - 10, height: 10, background: E.plum, borderRadius: 3 }} />
        ))}
        {Array.from({ length: ROWS * COLS }, (_, i) => {
          const r = Math.floor(i / COLS), c = i % COLS;
          const avail = rnd(i * 7 + 3) < 0.63; // 1.998 de 3.186
          const t = rnd(i * 13 + 5);
          const on = avail ? ramp(light, t * 0.7, t * 0.7 + 0.3, eOut) : 0;
          const h = RH - 18 - rnd(i * 3 + 1) * 22;
          return (
            <div key={i} style={{ position: 'absolute', left: c * CW + 6, top: r * RH + (RH - 10 - h), width: CW - 10, height: h, borderRadius: 4,
              background: on > 0.5 ? E.green : SP[Math.floor(rnd(i * 11) * SP.length)], opacity: avail ? 1 : 1 - light * 0.55,
              transform: `translateY(${-on * 8 * (1 - on)}px)`, boxShadow: on > 0.5 ? `0 0 ${12 * on}px rgba(46,139,87,0.5)` : 'none' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, top: h * 0.2, height: 5, background: 'rgba(255,255,255,0.35)' }} />
            </div>
          );
        })}
      </div>
      {/* «Pero hay truco» */}
      {truco > 0.01 && (
        <div style={{ position: 'absolute', left: 960, top: 70, transform: `translate(-50%, 0) rotate(-3deg) scale(${0.7 + 0.3 * Math.min(1.08, truco)})`, opacity: Math.min(1, truco * 2) * (1 - ramp(frame, fMad - 8, fMad + 4, eIO)),
          padding: '14px 36px', borderRadius: 999, background: E.ink, color: E.mustardLight, fontFamily: E.font, fontWeight: 800, fontSize: 52 }}>Pero hay truco</div>
      )}
      {/* contador */}
      {cntS > 0.01 && (
        <div style={{ position: 'absolute', left: 960, top: 820, transform: `translate(-50%, -50%) scale(${(0.85 + 0.15 * Math.min(1, cntS)) * (1 - out * 0.15)})`, opacity: Math.min(1, cntS * 2) * (1 - out),
          display: 'flex', alignItems: 'center', gap: 30, padding: '22px 46px', borderRadius: 30, background: E.paper, boxShadow: `12px 12px 0 ${E.green}` }}>
          <div style={{ fontFamily: E.font, fontWeight: 800, fontSize: 130, lineHeight: 1, color: E.ink, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>{es(1998 * cnt)}</div>
          <div style={{ fontFamily: E.font, fontWeight: 700, fontSize: 38, color: E.green, lineHeight: 1.15 }}>audiolibros que te llevas<br />ahora mismo · eBiblio Madrid</div>
        </div>
      )}
      {/* no son de segunda: la ficha real */}
      {card > 0.01 && (
        <div style={{ position: 'absolute', left: 960, top: 470, transform: `translate(-50%, -50%) translateY(${(1 - Math.min(1, card)) * 700}px) rotate(${(1 - Math.min(1, card)) * 5 - 1}deg)` }}>
          <Crop name="rotono" r={[40, 240, 940, 380]} k={1.3} style={{ boxShadow: `14px 14px 0 ${E.plum}` }}>
            <Mark b={[56, 566, 244, 22]} at={fEdit - 8} pad={4} color={E.coral} />
          </Crop>
        </div>
      )}
      {mic > 0.01 && (
        <div style={{ position: 'absolute', left: 1240, top: 690, transform: `scale(${0.7 + 0.3 * Math.min(1.08, mic)}) rotate(4deg)`, opacity: Math.min(1, mic * 2), display: 'flex', alignItems: 'center', gap: 20,
          padding: '18px 30px', borderRadius: 24, background: E.ink, boxShadow: `8px 8px 0 ${E.coral}` }}>
          <svg width="64" height="80" viewBox="0 0 24 30"><rect x="7" y="2" width="10" height="17" rx="5" fill={E.mustard} /><path d="M3 13 a9 9 0 0 0 18 0 M12 22 V28 M7 28 H17" stroke={E.paper} strokeWidth="2.2" fill="none" strokeLinecap="round" /></svg>
          <div style={{ fontFamily: E.font, fontWeight: 700, fontSize: 34, color: E.paper, lineHeight: 1.15 }}>Los mismos narradores<br /><span style={{ color: E.mustardLight }}>que en las apps de pago</span></div>
        </div>
      )}
      <Label x={560} y={740} s={pop(frame, fEdit - 10, fps, 170, 13)} text="Editoriales de verdad" bg={E.coral} color={E.paper} size={40} rot={-3} />
      <Sfx name="cardboard_pop" at={fTruco - 4} volume={0.6} />
      <Sfx name="lights_on" at={fCasi - 28} volume={0.5} />
      <Sfx name="counter" at={fCasi - 8} volume={0.5} trimAfter={fMil + 14 - fCasi} />
      <Sfx name="soft_impact" at={fMil + 16} volume={0.45} />
      <Sfx name="success" at={fAhora} volume={0.35} />
      <Sfx name="paper_slide" at={fSegunda - 8} volume={0.6} />
      <Sfx name="draw" at={fEdit - 6} volume={0.5} />
      <Sfx name="pop_bright" at={fNarr - 16} volume={0.5} />
    </AbsoluteFill>
  );
};
