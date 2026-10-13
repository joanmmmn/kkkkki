import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { eIO, eOut, Fleuron, paperBg, ramp, Roman, T } from './kit';

// ---------------------------------------------------------------------------------------------------------------
// Transiciones entre planos
// ---------------------------------------------------------------------------------------------------------------
export const PT = 38; // giro de página (0,76 s)
export const SOFT = 26; // fundido (0,52 s)

// Giro de página: el plano que sale (congelado en su último fotograma) es una hoja que gira sobre el borde izquierdo y
// deja ver debajo el plano nuevo, con su sombra. El reverso de la hoja es papel.
export const PageTurn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, 0, PT, eIO);
  const angle = -180 * p;
  const shade = Math.sin(p * Math.PI);
  // Borde libre de la hoja proyectado en pantalla (aprox.), para la sombra sobre la página nueva
  const edge = Math.max(0, Math.cos((p * Math.PI))) * 100;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {p < 0.5 && (
        <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(0,0,0,0) ${edge}%, rgba(0,0,0,${0.5 * (1 - p)}) ${edge + 0.2}%, rgba(0,0,0,0) ${Math.min(100, edge + 16)}%)` }} />
      )}
      <AbsoluteFill style={{ perspective: 2400, perspectiveOrigin: '0% 50%' }}>
        <AbsoluteFill style={{ transformOrigin: 'left center', transform: `rotateY(${angle}deg)`, transformStyle: 'preserve-3d' }}>
          <AbsoluteFill style={{ backfaceVisibility: 'hidden', overflow: 'hidden' }}>
            {children}
            <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(0,0,0,${0.12 * shade}) 0%, rgba(0,0,0,${0.55 * shade}) 100%)` }} />
            {/* brillo que recorre la hoja al doblarse */}
            <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(255,240,210,0) ${70 - p * 60}%, rgba(255,240,210,${0.18 * shade}) ${80 - p * 60}%, rgba(255,240,210,0) ${90 - p * 60}%)` }} />
          </AbsoluteFill>
          <AbsoluteFill style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', ...paperBg(T.paper2) }}>
            <AbsoluteFill style={{ background: `linear-gradient(270deg, rgba(0,0,0,${0.25 * shade}) 0%, rgba(0,0,0,0) 40%)` }} />
          </AbsoluteFill>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Fundido: el plano que sale (congelado) se aleja un poco, se desenfoca y se desvanece despacio al principio
export const SoftOut: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const q = ramp(frame, 0, SOFT, (t) => t);
  const p = eIO(q);
  return (
    <AbsoluteFill style={{ opacity: 1 - q * q, transform: `scale(${1 + 0.035 * p})`, filter: p > 0.03 ? `blur(${p * 3}px)` : undefined }}>{children}</AbsoluteFill>
  );
};
// …y el que entra gana opacidad deprisa al principio, desde un poco más cerca
export const SoftIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const q = ramp(frame, 0, SOFT, (t) => t);
  const p = eIO(q);
  if (q >= 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{ opacity: 1 - (1 - q) * (1 - q), transform: `scale(${1.03 - 0.03 * p})`, filter: p < 0.97 ? `blur(${(1 - p) * 2.5}px)` : undefined }}>{children}</AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Portadilla de capítulo: una página de libro a pantalla completa («Capítulo», el número romano, el título y un
// ornamento). Al terminar, la cámara se aleja: la página encoge, se inclina y se va, y aparece la biblioteca.
// ---------------------------------------------------------------------------------------------------------------
export const CARD = 85; // la portadilla dura 1,7 s (lo que se adelanta la locución en estas escenas)
export const ChapterCard: React.FC<{ n: string; title: string; out?: number }> = ({ n, title, out = CARD - 14 }) => {
  const frame = useCurrentFrame();
  const a = ramp(frame, 2, 26, eOut);
  const b = ramp(frame, 10, 34, eOut);
  const go = ramp(frame, out, out + 30, eIO);
  if (go >= 1) return null;
  return (
    <AbsoluteFill style={{ perspective: 2000 }}>
      <AbsoluteFill style={{ ...paperBg(T.paper), transformOrigin: '50% 50%',
        transform: `translate3d(${-go * 520}px, ${-go * 60}px, ${-go * 900}px) rotateY(${go * 22}deg) rotateZ(${-go * 3}deg)`,
        opacity: 1 - ramp(frame, out + 14, out + 30, eIO), boxShadow: '0 40px 120px rgba(0,0,0,0.6)' }}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 18, color: T.ink }}>
          <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 46, color: T.inkSoft, opacity: a, transform: `translateY(${(1 - a) * 12}px)` }}>Capítulo</div>
          <Roman n={n} size={230} style={{ opacity: a, transform: `translateY(${(1 - a) * 22}px) scale(${0.96 + 0.04 * a})` }} />
          <div style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 84, letterSpacing: -0.8, opacity: b, transform: `translateY(${(1 - b) * 16}px)`, marginTop: 8 }}>{title}</div>
          <div style={{ marginTop: 18 }}><Fleuron at={14} w={300} /></div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
