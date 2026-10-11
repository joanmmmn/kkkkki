import React from 'react';
import { Stage } from '../../components/Stage';
import { ScreenClip, CamKey } from '../../components/ScreenClip';
import { Callout } from '../../components/Callout';
import { Sfx } from '../../components/Sfx';
import { synthCursor } from '../../lib/synth';
import { wf } from './timeline';
import { BrowserStage, BW } from './common';

// R05 · Paso 3: «Obtén tu prueba de 30 días» → Google, Apple o correo (misma cuenta para la app).
// Captura fija de la página de registro (mi navegador no pasa la verificación anti-robots del formulario de correo)
// con un cursor sintético que señala cada opción sin pulsar; el formulario sale de la grabación de Joan.
export const R05Cuenta: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('R05', w, n);
  const fGoogle = at('Google');
  const fApple = at('Apple');
  const fCorreo = at('correo');
  const fRec = at('Recuerda');
  const s = (f: number) => f / 50;
  const cursor = synthCursor([960, 414], [
    { t: s(fGoogle - 16), x: 1030, y: 472, dur: 0.45 },
    { t: s(fApple - 14), x: 1030, y: 524, dur: 0.4 },
    { t: s(fCorreo - 16), x: 1060, y: 656, dur: 0.5 },
  ]);
  const cam: CamKey[] = [
    { f: 0, zoom: 1.45, x: 960, y: 470 },
    { f: Math.max(1, fGoogle - 6), zoom: 1.75, x: 960, y: 500 },
    { f: fRec, zoom: 1.75, x: 960, y: 520 },
    { f: dur, zoom: 1.8, x: 960, y: 520 },
  ];
  return (
    <Stage>
      <BrowserStage url="elevenreader.io">
        <ScreenClip src="er/rec/02_oferta/signup.jpg" image width={BW} startAt={0} cursor={cursor} camera={cam}
          marks={[
            { from: 6, to: fGoogle - 6, x: 840, y: 374, w: 240, h: 30, r: 10, label: 'Obtén tu prueba de 30 días' },
            { from: fGoogle - 2, to: fApple - 2, x: 780, y: 452, w: 360, h: 40, r: 20 },
            { from: fApple, to: fCorreo - 2, x: 780, y: 504, w: 360, h: 40, r: 20 },
            { from: fCorreo, to: dur + 6, x: 780, y: 636, w: 360, h: 40, r: 20 },
          ]} />
      </BrowserStage>
      <Callout at={fRec} until={dur + 10} x={960} y={958} anchor="center" size={38} dark>Usa siempre la misma cuenta</Callout>
      <Sfx name="draw" at={6} volume={0.7} />
      <Sfx name="tick_soft" at={fGoogle} volume={0.6} />
      <Sfx name="tick_soft" at={fApple} volume={0.6} />
      <Sfx name="tick_soft" at={fCorreo} volume={0.6} />
    </Stage>
  );
};
