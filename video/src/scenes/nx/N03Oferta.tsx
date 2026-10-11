import React from 'react';
import { useVideoConfig } from 'remotion';
import { Stage } from '../../components/Stage';
import { ScreenClip, CamKey } from '../../components/ScreenClip';
import { Callout } from '../../components/Callout';
import { Sfx } from '../../components/Sfx';
import { wf } from './timeline';
import { BrowserStage, BW, syncStart } from './common';
import meta from '../../../public/nx/rec/02_oferta/meta.json';
import cursor from '../../../public/nx/rec/02_oferta/cursor.json';

// N03 · Paso 2: oferta de Nextory → cookies necesarias → «30 días gratis».
export const N03Oferta: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('N03', w, n);
  const fNec = at('necesarias');
  const fComp = at('comprueba');
  const fPulsa = at('pulsa');
  const fBoton = at('boton');
  const M = meta.marks as Record<string, number>;
  const startAt = syncStart(M.click_cookie, fNec + 4, fps);
  const rf = (t: number) => Math.round((t - startAt) * fps);
  const cam: CamKey[] = [
    { f: 0, zoom: 1.32, x: 960, y: 560 },
    { f: rf(M.click_cookie) + 4, zoom: 1.32, x: 900, y: 600 },
    { f: rf(M.click_cookie) + 26, zoom: 1.0, x: 960, y: 540 },
    { f: Math.max(rf(M.click_cookie) + 30, fComp - 6), zoom: 1.0, x: 960, y: 540 },
    { f: fComp + 16, zoom: 1.75, x: 500, y: 420 },
    { f: fPulsa - 2, zoom: 1.75, x: 500, y: 440 },
    { f: fPulsa + 16, zoom: 1.95, x: 430, y: 520 },
    { f: dur, zoom: 1.95, x: 430, y: 530 },
  ];
  return (
    <Stage>
      <BrowserStage url="nextory.com">
        <ScreenClip src="nx/rec/02_oferta/video.mp4" width={BW} startAt={startAt} cursor={cursor} camera={cam}
          marks={[
            { from: Math.max(0, rf(M.to_cookie)), to: rf(M.click_cookie) + 10, x: 533, y: 662, w: 280, h: 58, r: 8 },
            { from: fComp + 4, to: fPulsa - 2, x: 60, y: 290, w: 840, h: 146, r: 16, label: '30 días con el enlace de SonorBooks' },
            { from: fPulsa, to: dur + 6, x: 72, y: 528, w: 142, h: 52, r: 26 },
          ]} />
      </BrowserStage>
      <Callout at={Math.max(2, rf(M.to_cookie))} until={rf(M.click_cookie) + 14} x={960} y={958} anchor="center" size={40} dark>Solo las necesarias</Callout>
      <Sfx name="click" at={rf(M.click_cookie)} />
      <Sfx name="zoom_out" at={rf(M.click_cookie) + 8} volume={0.8} />
      <Sfx name="zoom_in" at={fComp + 2} />
      <Sfx name="draw" at={fComp + 4} />
      <Sfx name="ui_pop" at={fComp + 12} volume={0.8} />
      <Sfx name="swipe" at={fPulsa + 2} />
      <Sfx name="click" at={rf(M.click_cta)} />
      {fBoton > 0 && null}
    </Stage>
  );
};
