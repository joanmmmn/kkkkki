import React from 'react';
import { Sequence, useVideoConfig } from 'remotion';
import { Stage } from '../../components/Stage';
import { ScreenClip, CamKey } from '../../components/ScreenClip';
import { Callout } from '../../components/Callout';
import { Sfx } from '../../components/Sfx';
import { wf } from './timeline';
import { BrowserStage, BW } from './common';
import meta from '../../../public/er/rec/02_oferta/meta.json';
import cursor from '../../../public/er/rec/02_oferta/cursor.json';

// R04 · Paso 2: oferta de ElevenReader («30 días gratis y ahorra un 15 %») → botón naranja.
// La grabación llega al clic antes que la voz: hasta entonces se muestra su primer fotograma (página estática).
export const R04Oferta: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('R04', w, n);
  const f30 = at('30');
  const f15 = at('15');
  const fPulsa = at('Pulsa');
  const fNar = at('naranja');
  const M = meta.marks as Record<string, number>;
  const fClick = fNar + 8;
  const play = Math.max(0, fClick - Math.round(M.click_cta * fps)); // fotograma de escena en que arranca el vídeo
  const rf = (t: number) => play + Math.round(t * fps);
  const cut = rf(M.click_cta) + 9; // tras el clic, sin la página en blanco mientras carga
  const cam: CamKey[] = [
    { f: 0, zoom: 1.32, x: 960, y: 380 },
    { f: Math.max(1, f30 - 8), zoom: 1.32, x: 960, y: 380 },
    { f: f30 + 14, zoom: 1.85, x: 960, y: 400 },
    { f: fPulsa + 10, zoom: 1.95, x: 960, y: 410 },
    { f: rf(M.click_cta) + 9, zoom: 1.95, x: 960, y: 410 },
  ];
  const marks = [
    { from: f30 - 2, to: fClick + 8, x: 800, y: 386, w: 320, h: 56, r: 28, label: '30 días gratis + 15 % de ahorro' },
  ];
  return (
    <Stage>
      <BrowserStage url="elevenreader.io">
        <Sequence durationInFrames={play} layout="none">
          <ScreenClip src="er/rec/02_oferta/first.jpg" image width={BW} cursor={[{ ...cursor[0], t: 0 }]} startAt={0} camera={cam} marks={marks} />
        </Sequence>
        <Sequence from={play} durationInFrames={Math.max(1, cut - play)} layout="none">
          <ScreenClip src="er/rec/02_oferta/video.mp4" width={BW} startAt={0} cursor={cursor} camera={cam.map((k) => ({ ...k, f: k.f - play }))}
            marks={marks.map((m) => ({ ...m, from: m.from - play, to: m.to - play }))} />
        </Sequence>
        <Sequence from={cut} layout="none">
          {/* La página de registro (lo que aparece tras el clic), con el mismo encuadre con el que empieza R05. */}
          <ScreenClip src="er/rec/02_oferta/signup.jpg" image width={BW} cursor={[{ t: 0, x: 960, y: 414, down: false }]} startAt={0}
            camera={[{ f: 0, zoom: 1.6, x: 960, y: 440 }, { f: 18, zoom: 1.45, x: 960, y: 470 }]} />
        </Sequence>
      </BrowserStage>
      <Callout at={8} until={Math.max(20, f30 - 6)} x={960} y={958} anchor="center" size={38} dark>Oferta de SonorBooks en ElevenReader</Callout>
      <Sfx name="zoom_in" at={f30} />
      <Sfx name="draw" at={f30 - 2} />
      <Sfx name="ui_pop" at={f15} volume={0.7} />
      <Sfx name="click" at={rf(M.click_cta)} />
      <Sfx name="whoosh_soft" at={cut} volume={0.6} />
    </Stage>
  );
};
