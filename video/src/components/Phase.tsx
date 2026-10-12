import React from 'react';
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp, easeInOut } from '../lib/anim';
import { useMotion } from '../lib/motion';

// Bloque visible entre `from` y `to` (fotogramas de la escena) con entrada en muelle y salida desenfocada.
// La salida se alarga OVERLAP fotogramas más allá de `to`, de modo que se funde con la fase siguiente
// (que entra en `to`) en lugar de dejar unos fotogramas vacíos entre ambas.
// `hold`: sin salida (la última fase de una escena se queda entera hasta el corte o el fundido con la escena siguiente).
const OVERLAP = 6;
export const Phase: React.FC<{ from: number; to: number; children: React.ReactNode; out?: number; style?: React.CSSProperties; noIn?: boolean; hold?: boolean }> = ({ from, to, children, out = 12, style, noIn, hold }) => {
  const { fps } = useVideoConfig();
  const dur = Math.max(1, Math.round(to - from) + OVERLAP);
  return (
    <Sequence from={Math.round(from)} durationInFrames={dur} layout="none">
      <PhaseInner dur={dur} out={out} fps={fps} style={style} noIn={noIn} hold={hold}>{children}</PhaseInner>
    </Sequence>
  );
};
const PhaseInner: React.FC<{ dur: number; out: number; fps: number; children: React.ReactNode; style?: React.CSSProperties; noIn?: boolean; hold?: boolean }> = ({ dur, out, fps, children, style, noIn, hold }) => {
  const frame = useCurrentFrame();
  const { soft } = useMotion();
  // Modo suave: entrada sin rebote y más corta en recorrido, salida más larga, casi sin desenfoque.
  const s = noIn ? 1 : spring({ frame, fps, config: soft ? { damping: 26, stiffness: 120 } : { damping: 22, stiffness: 140 } });
  const oLen = soft ? Math.max(out, 16) : out;
  const o = hold ? 0 : interpolate(frame, [dur - oLen, dur], [0, 1], { ...clamp, easing: easeInOut });
  const rise = soft ? 22 : 40, sink = soft ? 16 : 30, shrink = soft ? 0.025 : 0.04, bIn = soft ? 3 : 8, bOut = soft ? 4 : 10;
  const blur = (1 - s) * bIn + o * bOut;
  return (
    <AbsoluteFill style={{ opacity: s * (1 - o), transform: `translateY(${(1 - s) * rise - o * sink}px) scale(${1 - o * shrink})`, filter: blur > 0.05 ? `blur(${blur}px)` : undefined, ...style }}>
      {children}
    </AbsoluteFill>
  );
};
