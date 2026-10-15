import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../../components/Sfx';
import { LogoIcon } from '../../components/Logo';
import { Burst, clamp01, E, EbLogo, eIO, lerp, pop, ramp, Stip } from './kit';
import { CARDS, DoorCard } from './frames';
import { w } from './timeline';

// ---------------------------------------------------------------------------------------------------------------
// Plano O (T15): capítulo V, el veredicto. El recibo de la máquina de autopréstamo sale de la ranura línea a línea,
// al ritmo de la locución: Esperas 5, Precio 10, Narraciones 9, Facilidad de uso 7, Catálogo 6,5 → nota 7,5/10.
// ---------------------------------------------------------------------------------------------------------------
type Line = { label: string; score: string; word: string; n?: number; icon: 'wait' | 'euro' | 'mic' | 'app' | 'books' };
const LINES: Line[] = [
  { label: 'Esperas', score: '5', word: 'esperar', icon: 'wait' },
  { label: 'Precio', score: '10', word: 'gratis', icon: 'euro' },
  { label: 'Narraciones', score: '9', word: 'legales', icon: 'mic' },
  { label: 'Facilidad de uso', score: '7', word: 'mejorable', icon: 'app' },
  { label: 'Catálogo', score: '6,5', word: 'catálogo', icon: 'books' },
];
const LH = 78; // alto de línea del recibo
const RW = 700;

export const Verdict: React.FC<{ dur: number }> = ({ dur }) => {
  const look = CARDS.V;
  return (
    <DoorCard n="V" title={look.title} look={look}>
      <VerdictBody dur={dur} />
    </DoorCard>
  );
};

const VerdictBody: React.FC<{ dur: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w('T15', 'B16', word, n);
  const fNota = at('nota'), fSiete = at('siete'), fDiez = at('diez'), fNuestra = at('Nuestra');
  const times = LINES.map((l) => at(l.word, l.n ?? 0) - 6);
  // cuánto papel ha salido: cabecera (3 líneas) al principio, luego una línea por puntuación, separador y total
  const head = ramp(frame, 70, 110, eIO) * 2.6;
  const lines = LINES.map((_, i) => ramp(frame, times[i], times[i] + 12, eIO));
  const total = ramp(frame, fNota - 14, fNota + 4, eIO) * 1.9;
  const fed = head + lines.reduce((a, b) => a + b, 0) + total; // en líneas
  const stamp = pop(frame, fSiete - 4, fps, 260, 12);
  const slot = 930; // ranura de la impresora
  const paperH = 40 + fed * LH;
  return (
    <AbsoluteFill style={{ background: E.sage, overflow: 'hidden' }}>
      <Stip kind="r" o={0.14} />
      <div style={{ position: 'absolute', left: 960 - 640, top: 60, width: 1280, height: 1280, borderRadius: '50%', background: E.oliveLight, opacity: 0.35 }} />
      {/* recibo */}
      <div style={{ position: 'absolute', left: 960 - RW / 2, top: slot - paperH, width: RW, height: paperH, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: '#FFFEFB',
          backgroundImage: 'linear-gradient(90deg, rgba(15,21,33,0.05) 0%, rgba(15,21,33,0) 8%, rgba(15,21,33,0) 92%, rgba(15,21,33,0.05) 100%)', fontFamily: E.font, color: E.ink }}>
          {/* borde dentado de arriba */}
          <svg style={{ position: 'absolute', left: 0, top: -1 }} width={RW} height={14} viewBox={`0 0 ${RW} 14`}>
            <path d={`M0 0 ${Array.from({ length: 36 }, (_, i) => `L${(i + 0.5) * (RW / 35)} 12 L${(i + 1) * (RW / 35)} 0`).join(' ')} Z`} fill={E.sage} />
          </svg>
        </div>
        {/* contenido: se coloca desde arriba del papel ya impreso */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 30, padding: '0 50px', fontFamily: E.font, color: E.ink }}>
          <div style={{ height: LH * 2.6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, borderBottom: `3px dashed ${E.boneDeep}` }}>
            <EbLogo w={170} />
            <div style={{ fontWeight: 700, fontSize: 30, letterSpacing: '0.06em' }}>RESEÑA · AUTOPRÉSTAMO</div>
            <div style={{ fontWeight: 500, fontSize: 22, color: E.inkSoft }}>SonorBooks · 14/10/2026</div>
          </div>
          {LINES.map((l, i) => (
            <div key={l.label} style={{ height: LH, display: 'flex', alignItems: 'center', fontSize: 40, fontWeight: 600, opacity: lines[i] > 0.05 ? 1 : 0 }}>
              <span>{l.label}</span>
              <span style={{ flex: 1, margin: '0 14px', borderBottom: `4px dotted ${E.inkFaint}`, transform: 'translateY(10px)' }} />
              <span style={{ fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{l.score}</span>
            </div>
          ))}
          <div style={{ height: LH * 1.9, display: 'flex', alignItems: 'center', borderTop: `3px dashed ${E.boneDeep}`, opacity: total > 0.1 ? 1 : 0 }}>
            <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.1 }}>NOTA<br />SONORBOOKS</div>
            <div style={{ flex: 1 }} />
            <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: '-0.03em' }}>7,5<span style={{ fontSize: 46, color: E.inkSoft }}>/10</span></div>
          </div>
        </div>
      </div>
      {/* sello */}
      {stamp > 0.01 && (
        <div style={{ position: 'absolute', left: 960 + RW / 2 + 20, top: slot - 40 - LH * 1.9 - 70, transform: `rotate(-14deg) scale(${lerp(1.8, 1, clamp01(stamp))})`, opacity: clamp01(stamp * 2.5),
          width: 230, height: 230, borderRadius: '50%', border: `10px solid ${E.coral}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: E.coral, fontFamily: E.font, background: 'rgba(255,254,251,0.55)' }}>
          <div style={{ fontWeight: 800, fontSize: 84, lineHeight: 1 }}>7,5</div>
          <div style={{ fontWeight: 700, fontSize: 26, letterSpacing: '0.08em' }}>SOBRE 10</div>
        </div>
      )}
      <Burst at={fDiez - 2} x={960 + RW / 2 + 135} y={slot - 40 - LH * 1.9 + 45} r={160} color={E.coral} rays={12} />
      {/* iconos de cada línea */}
      {LINES.map((l, i) => {
        const s = pop(frame, times[i] + 4, fps, 200, 13);
        const fade = ramp(frame, fNuestra - 10, fNuestra + 6, eIO);
        if (s <= 0.01) return null;
        // posición de la línea i en pantalla ahora mismo
        const linesAfter = lines.slice(i + 1).reduce((a, b) => a + b, 0) + total;
        const y = slot - (linesAfter + 0.5) * LH - 6;
        return (
          <div key={l.label} style={{ position: 'absolute', left: 960 + RW / 2 + 40, top: y - 42, width: 84, height: 84, borderRadius: '50%', background: [E.coral, E.mustard, E.plum, E.pink, E.olive][i],
            display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.6 + 0.4 * Math.min(1.08, s)})`, opacity: Math.min(1, s * 2) * (1 - fade) }}>
            <Icon k={l.icon} />
          </div>
        );
      })}
      {/* ranura de la impresora */}
      <div style={{ position: 'absolute', left: 960 - RW / 2 - 70, top: slot - 6, width: RW + 140, height: 200, borderRadius: '30px 30px 0 0', background: E.plum }}>
        <Stip kind="v" o={0.2} />
        <div style={{ position: 'absolute', left: 60, right: 60, top: 0, height: 14, borderRadius: 7, background: E.ink }} />
        <div style={{ position: 'absolute', left: 40, top: 46, display: 'flex', alignItems: 'center', gap: 14, fontFamily: E.font, fontWeight: 700, fontSize: 30, color: E.paper }}>
          <div style={{ width: 54, height: 54, borderRadius: '50%', background: E.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LogoIcon size={36} /></div>
          Autopréstamo
        </div>
      </div>
      <Sfx name="receipt" at={70} volume={0.6} />
      {times.map((t, i) => <Sfx key={i} name="receipt" at={t} volume={0.45} trimAfter={22} />)}
      {times.map((t, i) => <Sfx key={`p${i}`} name="pop" at={t + 6} volume={0.3} />)}
      <Sfx name="receipt" at={fNota - 14} volume={0.55} trimAfter={30} />
      <Sfx name="stamp" at={fSiete - 2} volume={0.9} />
      <Sfx name="score_ding" at={fDiez - 4} volume={0.6} />
    </AbsoluteFill>
  );
};

const Icon: React.FC<{ k: Line['icon'] }> = ({ k }) => {
  const c = E.paper;
  if (k === 'wait') return <svg width="44" height="44" viewBox="0 0 24 24"><path d="M7 3 H17 M7 21 H17 M8 3 C8 9 16 9 16 12 C16 15 8 15 8 21 M16 3 C16 9 8 9 8 12" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" /></svg>;
  if (k === 'euro') return <div style={{ fontFamily: E.font, fontWeight: 800, fontSize: 44, color: E.ink, lineHeight: 1 }}>€</div>;
  if (k === 'mic') return <svg width="40" height="46" viewBox="0 0 24 28"><rect x="8" y="2" width="8" height="14" rx="4" fill={c} /><path d="M4 12 a8 8 0 0 0 16 0 M12 20 V26" stroke={c} strokeWidth="2.2" fill="none" strokeLinecap="round" /></svg>;
  if (k === 'app') return <svg width="34" height="48" viewBox="0 0 16 24"><rect x="1" y="1" width="14" height="22" rx="3" stroke={c} strokeWidth="2" fill="none" /><circle cx="8" cy="19" r="1.5" fill={c} /></svg>;
  return <svg width="46" height="40" viewBox="0 0 28 24"><rect x="2" y="4" width="6" height="18" rx="1" fill={c} /><rect x="10" y="2" width="6" height="20" rx="1" fill={c} /><rect x="19" y="5" width="6" height="17" rx="1" transform="rotate(8 22 13)" fill={c} /></svg>;
};
