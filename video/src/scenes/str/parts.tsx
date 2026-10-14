import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color } from '../../brand/tokens';
import { clamp } from '../../lib/anim';

// Cambio de precio con contador mecánico: solo giran las cifras que cambian (15,99 → 20,99: el 1 pasa a 2 y el 5 a 0,
// siempre hacia delante), la de la derecha primero, con el mismo freno y desenfoque que el contador de la reseña de Podimo.
const rollP = (frame: number, at: number, fps: number, dur = 30) => spring({ frame: frame - at, fps, config: { damping: 15, stiffness: 120, mass: 1 }, durationInFrames: dur });
const changes = (a: string, b: string) => {
  const A = Array.from(a), B = Array.from(b);
  const idx = B.map((ch, i) => (/\d/.test(ch) && /\d/.test(A[i] ?? '') && A[i] !== ch ? i : -1)).filter((i) => i >= 0);
  return { A, B, idx };
};
export const PriceRoll: React.FC<{ a: string; b: string; at: number; size: number; color?: string; stagger?: number; dur?: number; style?: React.CSSProperties }> = ({
  a, b, at, size, color: c = color.ink, stagger = 4, dur = 30, style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const uid = React.useId().replace(/:/g, '');
  const { A, B, idx } = changes(a, b);
  return (
    <span style={{ display: 'inline-block', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums', fontSize: size, lineHeight: 1, ...style }}>
      {B.map((ch, i) => {
        const k = idx.indexOf(i);
        if (k < 0) return <span key={i} style={{ display: 'inline-block', color: c }}>{ch}</span>;
        const from = Number(A[i]);
        const steps = (Number(ch) - from + 10) % 10;
        const order = idx.length - 1 - k;
        const p = rollP(frame, at + order * stagger, fps, dur);
        const p1 = rollP(frame - 1, at + order * stagger, fps, dur);
        const pos = steps * p;
        const vel = Math.abs(steps * (p - p1)) * size;
        const blur = Math.min(size * 0.06, vel * 0.12);
        return (
          <span key={i} style={{ display: 'inline-block', position: 'relative' }}>
            <span style={{ color: 'transparent' }}>{ch}</span>
            <span style={{ position: 'absolute', left: -4, right: -4, top: 0, height: size, overflow: 'hidden',
              WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 16%, #000 84%, transparent 100%)', maskImage: 'linear-gradient(180deg, transparent 0%, #000 16%, #000 84%, transparent 100%)' }}>
              <svg width="0" height="0" style={{ position: 'absolute' }}><defs><filter id={`pr${uid}${i}`} x="-10%" y="-50%" width="120%" height="200%"><feGaussianBlur stdDeviation={`0 ${blur.toFixed(2)}`} /></filter></defs></svg>
              <span style={{ position: 'absolute', left: 4, top: 0, display: 'block', color: c, transform: `translateY(${(-pos * size).toFixed(2)}px)`, filter: blur > 0.3 ? `url(#pr${uid}${i})` : undefined }}>
                {Array.from({ length: steps + 1 }, (_, s) => (
                  <span key={s} style={{ display: 'block', height: size, lineHeight: `${size}px` }}>{(from + s) % 10}</span>
                ))}
              </span>
            </span>
          </span>
        );
      })}
    </span>
  );
};
// Lo que enseña el cambio de precio en cada fotograma (para ChangeTicks).
export const priceRollShown = (a: string, b: string, at: number, fps: number, f: number, stagger = 4, dur = 30) => {
  const { A, B, idx } = changes(a, b);
  return idx.map((i, k) => {
    const from = Number(A[i]);
    const steps = (Number(B[i]) - from + 10) % 10;
    const order = idx.length - 1 - k;
    return (from + Math.round(steps * rollP(f, at + order * stagger, fps, dur))) % 10;
  }).join('');
};

// Barrido de entrada/salida en carrusel (entra desde la derecha y sale hacia la izquierda).
export const phaseStyle = (frame: number, from: number, to: number) => {
  const pin = interpolate(frame, [from - 4, from + 12], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const pout = interpolate(frame, [to - 12, to + 2], [0, 1], { ...clamp, easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2) });
  return {
    visible: frame >= from - 4 && frame <= to + 2,
    style: { opacity: pin * (1 - pout), transform: `translateX(${(1 - pin) * 160 - pout * 200}px)`, filter: (1 - pin) + pout > 0.02 ? `blur(${((1 - pin) * 10 + pout * 10).toFixed(2)}px)` : undefined } as React.CSSProperties,
  };
};
