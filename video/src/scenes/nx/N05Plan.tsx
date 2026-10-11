import React from 'react';
import { useVideoConfig } from 'remotion';
import { Stage } from '../../components/Stage';
import { ScreenClip, CamKey } from '../../components/ScreenClip';
import { Callout } from '../../components/Callout';
import { Sfx } from '../../components/Sfx';
import { wf } from './timeline';
import { BrowserStage, BW } from './common';
import meta from '../../../public/nx/rec/14_plan/meta.json';
import cursor from '../../../public/nx/rec/14_plan/cursor.json';

// N05 · Paso 4: «Tu oferta» (30 días, 15 h) → «Continuar» → «Elige tu plan» → Standard → «Continuar».
// Páginas reales de Nextory capturadas con sesión iniciada y reconstruidas en 4K (sin datos personales).
export const N05Plan: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('N05', w, n);
  const f30 = at('30');
  const fSolo = at('solo');
  const M = meta.marks as Record<string, number>;
  const rf = (t: number) => Math.round(t * fps);
  const swap = rf(M.planform);
  const cam: CamKey[] = [
    { f: 0, zoom: 2.05, x: 960, y: 240 },
    { f: rf(M.click_cont1) + 4, zoom: 2.1, x: 960, y: 250 },
    { f: swap + 4, zoom: 1.5, x: 960, y: 420 },
    { f: rf(M.to_std) + 6, zoom: 1.55, x: 960, y: 420 },
    { f: rf(M.click_std) + 10, zoom: 1.75, x: 960, y: 450 },
    { f: fSolo + 4, zoom: 1.75, x: 960, y: 470 },
    { f: rf(M.to_cont2) + 20, zoom: 1.9, x: 960, y: 590 },
    { f: dur, zoom: 1.92, x: 960, y: 594 },
  ];
  return (
    <Stage>
      <BrowserStage url="nextory.com">
        <ScreenClip src="nx/rec/14_plan/video.mp4" width={BW} cursor={cursor} camera={cam}
          marks={[
            { from: f30 - 4, to: rf(M.to_cont1) - 2, x: 750, y: 164, w: 420, h: 56, r: 12 },
            { from: rf(M.to_cont1), to: swap - 2, x: 904, y: 272, w: 113, h: 52, r: 18 },
            { from: rf(M.to_std) + 4, to: fSolo - 2, x: 756, y: 356, w: 408, h: 100, r: 14 },
            { from: fSolo, to: rf(M.to_cont2) - 2, x: 806, y: 708, w: 308, h: 32, r: 10 },
            { from: rf(M.to_cont2), to: dur + 6, x: 904, y: 649, w: 113, h: 52, r: 18 },
          ]} />
      </BrowserStage>
      <Callout at={fSolo} until={dur - 4} x={960} y={958} anchor="center" size={40} dark>Solo pagas si sigues después de la prueba</Callout>
      <Sfx name="draw" at={f30 - 4} />
      <Sfx name="ui_pop" at={f30 + 4} volume={0.7} />
      <Sfx name="swipe" at={rf(M.to_cont1)} />
      <Sfx name="click" at={rf(M.click_cont1)} />
      <Sfx name="whoosh_soft" at={swap} volume={0.8} />
      <Sfx name="zoom_out" at={swap + 2} volume={0.7} />
      <Sfx name="click" at={rf(M.click_std)} />
      <Sfx name="snap_in" at={rf(M.click_std) + 2} volume={0.7} />
      <Sfx name="draw" at={fSolo} />
      <Sfx name="click" at={rf(M.click_cont2)} />
    </Stage>
  );
};
