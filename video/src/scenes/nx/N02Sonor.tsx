import React from 'react';
import { useVideoConfig } from 'remotion';
import { Stage } from '../../components/Stage';
import { ScreenClip, CamKey } from '../../components/ScreenClip';
import { Callout } from '../../components/Callout';
import { Sfx } from '../../components/Sfx';
import { wf } from './timeline';
import { BrowserStage, BW, syncStart } from './common';
import meta from '../../../public/nx/rec/01_ficha/meta.json';
import cursor from '../../../public/nx/rec/01_ficha/cursor.json';

// N02 · Paso 1: en la ficha del audiolibro en SonorBooks, Nextory → «Empezar prueba gratuita».
export const N02Sonor: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('N02', w, n);
  const fAbre = at('abre');
  const fElige = at('elige');
  const fPulsa = at('pulsa');
  const fEmp = at('Empezar');
  const M = meta.marks as Record<string, number>;
  // El clic de la grabación cae justo cuando la voz dice «Empezar».
  const startAt = syncStart(M.click, fEmp + 2, fps);
  const rf = (t: number) => Math.round((t - startAt) * fps); // fotograma de escena de un instante de la grabación
  const cam: CamKey[] = [
    { f: 0, zoom: 1.04, x: 960, y: 520 },
    { f: Math.max(1, fElige - 10), zoom: 1.12, x: 1000, y: 500 },
    { f: fElige + 16, zoom: 1.78, x: 1275, y: 600 },
    { f: fPulsa, zoom: 1.78, x: 1275, y: 610 },
    { f: fPulsa + 16, zoom: 2.05, x: 1275, y: 640 },
    { f: dur, zoom: 2.1, x: 1275, y: 645 },
  ];
  return (
    <Stage>
      <BrowserStage url="sonorbooks.com">
        <ScreenClip src="nx/rec/01_ficha/video.mp4" width={BW} startAt={startAt} cursor={cursor} camera={cam}
          marks={[
            { from: fElige + 4, to: fPulsa - 2, x: 951, y: 463, w: 648, h: 307, r: 22, label: 'Nextory · 30 días gratis' },
            { from: fPulsa, to: dur + 6, x: 973, y: 624, w: 604, h: 47, r: 24 },
          ]} />
      </BrowserStage>
      <Callout at={fAbre} until={fElige - 4} x={960} y={958} anchor="center" size={40} dark>Abre la ficha de tu audiolibro</Callout>
      <Sfx name="zoom_in" at={fElige + 4} />
      <Sfx name="draw" at={fElige + 4} />
      <Sfx name="ui_pop" at={fElige + 12} volume={0.8} />
      <Sfx name="swipe" at={fPulsa + 2} />
      <Sfx name="click" at={rf(M.click)} />
    </Stage>
  );
};
