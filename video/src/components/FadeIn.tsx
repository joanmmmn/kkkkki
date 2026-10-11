import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { clamp, easeInOut } from '../lib/anim';

// Fundido de entrada para encadenar dos planos sin corte seco: el entrante aparece encima del saliente
// (que sigue reproduciéndose debajo) con un leve acercamiento y desenfoque que se resuelven.
export const FadeIn: React.FC<{ dur?: number; children: React.ReactNode }> = ({ dur = 12, children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, dur], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <AbsoluteFill style={{ opacity: p, transform: `scale(${1.025 - 0.025 * p})`, filter: p < 1 ? `blur(${(1 - p) * 5}px)` : undefined }}>
      {children}
    </AbsoluteFill>
  );
};
