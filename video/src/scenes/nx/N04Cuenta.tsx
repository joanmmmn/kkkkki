import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { color, font } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { ScreenClip, CamKey } from '../../components/ScreenClip';
import { Callout } from '../../components/Callout';
import { Sfx } from '../../components/Sfx';
import { CursorPoint } from '../../components/Cursor';
import { wf } from './timeline';
import { BrowserStage, BW, syncStart } from './common';
import meta from '../../../public/nx/rec/02_oferta/meta.json';
import rawCursor from '../../../public/nx/rec/02_oferta/cursor.json';

const M = meta.marks as Record<string, number>;
// La grabación no envía el formulario: el clic en «Continuar» se añade solo al cursor (no se pulsa de verdad).
const CLICK_CONT = M.end - 0.45;
const cursor: CursorPoint[] = [
  ...(rawCursor as CursorPoint[]).filter((p) => p.t < CLICK_CONT),
  { t: CLICK_CONT, x: 960, y: 385, down: false },
  { t: CLICK_CONT + 0.06, x: 960, y: 385, down: true },
  { t: CLICK_CONT + 0.15, x: 960, y: 385, down: false },
  { t: M.end, x: 960, y: 385, down: false },
];

// N04 · Paso 3: correo → (opcional) sin correos de ofertas → «Continuar» → contraseña (grabación de Joan).
export const N04Cuenta: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('N04', w, n);
  const fEsc = at('Escribe');
  const fCont = at('Continuar');
  const fCrea = at('crea');
  const startAt = syncStart(M.type_email, fEsc + 6, fps);
  const rf = (t: number) => Math.round((t - startAt) * fps);
  const cut = Math.max(rf(CLICK_CONT) + 10, fCrea - 4); // → pantalla de contraseña
  const cam: CamKey[] = [
    { f: 0, zoom: 1.6, x: 960, y: 300 },
    { f: rf(M.type_email), zoom: 2.05, x: 960, y: 285 },
    { f: rf(M.to_toggle), zoom: 2.05, x: 960, y: 300 },
    { f: rf(M.to_continuar) + 10, zoom: 2.05, x: 960, y: 320 },
  ];
  return (
    <Stage>
      <BrowserStage url="nextory.com">
        <Sequence durationInFrames={cut} layout="none">
          <ScreenClip src="nx/rec/02_oferta/video.mp4" width={BW} startAt={startAt} cursor={cursor} camera={cam}
            marks={[
              { from: rf(M.click_email) - 4, to: rf(M.to_toggle) - 2, x: 753, y: 236, w: 414, h: 48, r: 8, label: 'Tu correo' },
              { from: rf(M.to_toggle), to: rf(M.to_continuar) - 2, x: 748, y: 298, w: 420, h: 40, r: 20 },
              { from: rf(M.to_continuar), to: cut + 6, x: 753, y: 358, w: 414, h: 52, r: 26 },
            ]} />
        </Sequence>
        <Sequence from={cut} layout="none">
          {/* Pendiente: pantalla de contraseña de la grabación de Joan. */}
          <AbsoluteFill style={{ background: '#F1EDEA', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: font.sans, fontSize: 40, color: color.ink2 }}>[Contraseña · grabación pendiente]</div>
          </AbsoluteFill>
        </Sequence>
      </BrowserStage>
      <Callout at={rf(M.click_toggle) - 6} until={rf(M.to_continuar) + 6} x={960} y={958} anchor="center" size={38} dark>Opcional: sin correos de publicidad</Callout>
      <Sfx name="typing" at={rf(M.type_email)} trimAfter={70} />
      <Sfx name="draw" at={rf(M.click_email) - 4} />
      <Sfx name="click" at={rf(M.click_toggle)} volume={0.7} />
      <Sfx name="click" at={rf(CLICK_CONT)} />
      <Sfx name="transition" at={cut} volume={0.6} />
      {fCont > 0 && null}
    </Stage>
  );
};
