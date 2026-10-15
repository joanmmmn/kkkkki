import React from 'react';
import { useVideoConfig } from 'remotion';
import { Stage } from '../../components/Stage';
import { ScreenClip, CamKey } from '../../components/ScreenClip';
import { Callout } from '../../components/Callout';
import { Sfx } from '../../components/Sfx';
import { wf } from './timeline';
import { BrowserStage, BW, syncStart } from './common';
import meta from '../../../public/er/rec/01_ficha/meta.json';
import cursor from '../../../public/er/rec/01_ficha/cursor.json';

// R03 · Paso 1: ficha del audiolibro en SonorBooks con ElevenReader como recomendación → «Empezar prueba gratuita».
export const R03Ficha: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('R03', w, n);
  const fAbre = at('Abre');
  const fRec = at('recomendacion');
  const fPulsa = at('pulsa');
  const fEmp = at('Empezar');
  const M = meta.marks as Record<string, number>;
  // El clic de la grabación cae justo cuando la voz dice «Empezar».
  const startAt = syncStart(M.click, fEmp + 2, fps);
  const rf = (t: number) => Math.round((t - startAt) * fps);
  const cam: CamKey[] = [
    { f: 0, zoom: 1.04, x: 960, y: 520 },
    { f: Math.max(1, fRec - 10), zoom: 1.1, x: 1000, y: 500 },
    { f: fRec + 16, zoom: 1.75, x: 1275, y: 520 },
    { f: fPulsa, zoom: 1.75, x: 1275, y: 540 },
    { f: fPulsa + 16, zoom: 2.05, x: 1275, y: 590 },
    { f: dur, zoom: 2.1, x: 1275, y: 595 },
  ];
  return (
    <Stage>
      <BrowserStage url="sonorbooks.com">
        <ScreenClip src="er/rec/01_ficha/video.mp4" width={BW} startAt={startAt} cursor={cursor} camera={cam}
          marks={[
            { from: fRec + 4, to: fPulsa - 2, x: 955, y: 392, w: 640, h: 152, r: 20, label: 'Recomendación: ElevenReader' },
            { from: fPulsa, to: dur + 6, x: 973, y: 550, w: 604, h: 47, r: 24 },
          ]} />
      </BrowserStage>
      <Callout at={fAbre} until={fRec - 4} x={960} y={958} anchor="center" size={40} dark>Abre la ficha de tu audiolibro</Callout>
      <Sfx name="zoom_in" at={fRec + 4} />
      <Sfx name="draw" at={fRec + 4} />
      <Sfx name="ui_pop" at={fRec + 12} volume={0.8} />
      <Sfx name="swipe" at={fPulsa + 2} />
      <Sfx name="click" at={rf(M.click)} />
    </Stage>
  );
};
