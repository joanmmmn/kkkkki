import React from 'react';
import { useVideoConfig } from 'remotion';
import { Stage } from '../../components/Stage';
import { ScreenClip, CamKey } from '../../components/ScreenClip';
import { Sfx } from '../../components/Sfx';
import { BrowserStage, BW } from './common';
import meta from '../../../public/nx/rec/12_oferta/meta.json';
import cursor from '../../../public/nx/rec/12_oferta/cursor.json';

// N03 · Paso 2: oferta de Nextory → solo cookies necesarias → «30 días gratis» (grabación sincronizada con la voz).
export const N03Oferta: React.FC<{ lead: number; dur: number }> = () => {
  const { fps } = useVideoConfig();
  const M = meta.marks as Record<string, number>;
  const rf = (t: number) => Math.round(t * fps);
  const cCookie = rf(M.click_cookie);
  const cCta = rf(M.click_cta);
  const cam: CamKey[] = [
    { f: 0, zoom: 1.3, x: 960, y: 560 },
    { f: cCookie + 4, zoom: 1.3, x: 920, y: 590 },
    { f: cCookie + 26, zoom: 1.0, x: 960, y: 540 },
    { f: rf(M.to_cta), zoom: 1.0, x: 960, y: 540 },
    { f: rf(M.to_cta) + 34, zoom: 1.72, x: 560, y: 450 },
    { f: cCta + 14, zoom: 1.75, x: 560, y: 455 },
    { f: cCta + 46, zoom: 1.0, x: 960, y: 540 },
  ];
  return (
    <Stage>
      <BrowserStage url="nextory.com">
        <ScreenClip src="nx/rec/12_oferta/video.mp4" width={BW} cursor={cursor} camera={cam}
          marks={[
            { from: rf(M.to_cookie) + 4, to: cCookie + 12, x: 533, y: 662, w: 280, h: 58, r: 8, label: 'Solo las necesarias', labelBelow: true },
            { from: rf(M.to_cta) + 20, to: cCta + 16, x: 72, y: 528, w: 142, h: 52, r: 26 },
          ]} />
      </BrowserStage>
      <Sfx name="draw" at={rf(M.to_cookie) + 4} />
      <Sfx name="ui_pop" at={rf(M.to_cookie) + 12} volume={0.7} />
      <Sfx name="click" at={cCookie} />
      <Sfx name="zoom_out" at={cCookie + 8} volume={0.8} />
      <Sfx name="zoom_in" at={rf(M.to_cta) + 6} />
      <Sfx name="draw" at={rf(M.to_cta) + 20} />
      <Sfx name="click" at={cCta} />
      <Sfx name="whoosh_soft" at={cCta + 24} volume={0.8} />
    </Stage>
  );
};
