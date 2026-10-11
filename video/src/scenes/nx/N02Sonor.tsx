import React from 'react';
import { useVideoConfig } from 'remotion';
import { Stage } from '../../components/Stage';
import { ScreenClip, CamKey } from '../../components/ScreenClip';
import { Sfx } from '../../components/Sfx';
import { wf } from './timeline';
import { BrowserStage, BW } from './common';
import meta from '../../../public/nx/rec/11_ficha_click/meta.json';
import cursor from '../../../public/nx/rec/11_ficha_click/cursor.json';

// N02 · Paso 1: en la ficha del audiolibro (Nextory recomendado), «Empezar prueba gratuita».
// La grabación está sincronizada con la voz: el clic cae en «Empezar».
export const N02Sonor: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('N02', w, n);
  const fPulsa = at('pulsa');
  const M = meta.marks as Record<string, number>;
  const rf = (t: number) => Math.round(t * fps);
  const cam: CamKey[] = [
    { f: 0, zoom: 1.0, x: 960, y: 540 },
    { f: fPulsa - 6, zoom: 1.07, x: 1010, y: 530 },
    { f: fPulsa + 22, zoom: 1.92, x: 1275, y: 628 },
    { f: dur, zoom: 1.98, x: 1275, y: 636 },
  ];
  return (
    <Stage>
      <BrowserStage url="sonorbooks.com">
        <ScreenClip src="nx/rec/11_ficha_click/video.mp4" width={BW} cursor={cursor} camera={cam}
          marks={[{ from: fPulsa + 6, to: dur + 6, x: 973, y: 624, w: 604, h: 47, r: 24 }]} />
      </BrowserStage>
      <Sfx name="zoom_in" at={fPulsa + 2} />
      <Sfx name="draw" at={fPulsa + 6} />
      <Sfx name="click" at={rf(M.click)} />
    </Stage>
  );
};
