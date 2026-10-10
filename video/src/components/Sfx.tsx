import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';

export type SfxName =
  | 'whoosh_fast' | 'whoosh_deep' | 'whoosh_soft' | 'click' | 'pop' | 'tick' | 'cross' | 'marker' | 'typing'
  | 'page_turn' | 'impact' | 'riser' | 'shimmer' | 'counter' | 'pencil_strike';

// Efecto de sonido colocado en un fotograma concreto.
export const Sfx: React.FC<{ name: SfxName; at: number; volume?: number; trimAfter?: number }> = ({ name, at, volume = 0.5, trimAfter }) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none" name={`sfx:${name}`}>
    <Audio src={staticFile(`sfx/${name}.mp3`)} volume={volume} trimAfter={trimAfter} />
  </Sequence>
);
