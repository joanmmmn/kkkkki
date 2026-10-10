import React from 'react';
import { Audio, getInputProps, Sequence, staticFile, useVideoConfig } from 'remotion';

// --props='{"stem":"sfx"|"vo"|"music"}' renderiza una sola capa de la mezcla (para medirla).
export const STEM = (getInputProps() as { stem?: 'sfx' | 'vo' | 'music' }).stem;

export type SfxName =
  | 'whoosh_fast' | 'whoosh_deep' | 'whoosh_soft' | 'click' | 'pop' | 'tick' | 'cross' | 'marker' | 'typing'
  | 'page_turn' | 'impact' | 'riser' | 'shimmer' | 'counter' | 'pencil_strike'
  | 'ui_tap' | 'ui_pop' | 'swipe' | 'zoom_in' | 'zoom_out' | 'focus' | 'draw' | 'hit_soft' | 'transition' | 'stamp'
  | 'coins' | 'success' | 'fail' | 'card_flip' | 'tick_soft' | 'sparkle' | 'bass_drop' | 'reverse_swell' | 'phone_tap'
  | 'logo_sting' | 'page_riffle' | 'snap_in';

// Mezcla: todos los archivos están normalizados a -1 dBFS de pico; GAIN iguala la sonoridad percibida
// y SYNC es el instante (s) del golpe dentro del archivo, para que caiga justo en el fotograma `at`.
const GAIN: Record<SfxName, number> = {
  ui_tap: 0.34, ui_pop: 0.3, snap_in: 0.42, tick_soft: 0.32, phone_tap: 0.45, card_flip: 0.3, click: 0.34, pop: 0.32, tick: 0.2,
  swipe: 0.13, whoosh_fast: 0.2, whoosh_soft: 0.24, whoosh_deep: 0.22, zoom_in: 0.2, zoom_out: 0.2, transition: 0.22,
  focus: 0.2, draw: 0.17, marker: 0.18, pencil_strike: 0.26, sparkle: 0.18, shimmer: 0.18,
  hit_soft: 0.3, impact: 0.24, bass_drop: 0.2, stamp: 0.42, success: 0.16, fail: 0.18, cross: 0.26, coins: 0.28,
  riser: 0.14, reverse_swell: 0.18, logo_sting: 0.3, typing: 0.3, counter: 0.17, page_turn: 0.32, page_riffle: 0.32,
};
const SYNC: Partial<Record<SfxName, number>> = {
  card_flip: 0.19, coins: 0.12, impact: 0.05, page_turn: 0.38, pencil_strike: 0.1, reverse_swell: 1.17, riser: 1.66,
  swipe: 0.08, transition: 0.3, ui_pop: 0.06, whoosh_deep: 0.33, whoosh_fast: 0.15, whoosh_soft: 0.11, zoom_in: 0.45, zoom_out: 0.28,
  logo_sting: 0.03, marker: 0.03, sparkle: 0.05, shimmer: 0.05,
};

// Efecto de sonido cuyo golpe cae en el fotograma `at`; `volume` es relativo a la ganancia de mezcla del efecto.
export const Sfx: React.FC<{ name: SfxName; at: number; volume?: number; trimAfter?: number }> = ({ name, at, volume = 1, trimAfter }) => {
  const { fps } = useVideoConfig();
  if (STEM && STEM !== 'sfx') return null;
  const start = Math.round(at - (SYNC[name] ?? 0) * fps);
  const trimBefore = start < 0 ? -start : undefined;
  return (
    <Sequence from={Math.max(0, start)} layout="none" name={`sfx:${name}`}>
      <Audio src={staticFile(`sfx/${name}.mp3`)} volume={GAIN[name] * volume} trimBefore={trimBefore} trimAfter={trimAfter} />
    </Sequence>
  );
};
