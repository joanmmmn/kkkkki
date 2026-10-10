import React from 'react';
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp, easeInOut } from '../lib/anim';

// Bloque visible entre `from` y `to` (fotogramas de la escena) con entrada en muelle y salida desenfocada.
export const Phase: React.FC<{ from: number; to: number; children: React.ReactNode; out?: number; style?: React.CSSProperties; noIn?: boolean }> = ({ from, to, children, out = 12, style, noIn }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.round(from)} durationInFrames={Math.max(1, Math.round(to - from))} layout="none">
      <PhaseInner dur={Math.round(to - from)} out={out} fps={fps} style={style} noIn={noIn}>{children}</PhaseInner>
    </Sequence>
  );
};
const PhaseInner: React.FC<{ dur: number; out: number; fps: number; children: React.ReactNode; style?: React.CSSProperties; noIn?: boolean }> = ({ dur, out, fps, children, style, noIn }) => {
  const frame = useCurrentFrame();
  const s = noIn ? 1 : spring({ frame, fps, config: { damping: 22, stiffness: 140 } });
  const o = interpolate(frame, [dur - out, dur], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <AbsoluteFill style={{ opacity: s * (1 - o), transform: `translateY(${(1 - s) * 40 - o * 30}px) scale(${1 - o * 0.04})`, filter: `blur(${(1 - s) * 8 + o * 10}px)`, ...style }}>
      {children}
    </AbsoluteFill>
  );
};
