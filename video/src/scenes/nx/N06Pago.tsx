import React from 'react';
import { useVideoConfig } from 'remotion';
import { color, font } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { ScreenClip, CamKey } from '../../components/ScreenClip';
import { Sfx } from '../../components/Sfx';
import { wf } from './timeline';
import { BrowserStage, BW } from './common';
import meta from '../../../public/nx/rec/15_pago/meta.json';
import cursor from '../../../public/nx/rec/15_pago/cursor.json';

const START = 0.18; // la grabación va 0,18 s por detrás de la voz: se recorta el principio
const M = meta.marks as Record<string, number>;

// Datos de tarjeta enmascarados (nunca se muestra un número): puntos que aparecen como al teclear.
const Masked: React.FC<{ t: number; t0: number; t1: number; x: number; y: number; w: number; h: number; pattern: string; lockAt?: number }> = ({ t, t0, t1, x, y, w, h, pattern, lockAt }) => {
  const total = pattern.split('').filter((c) => c === '•').length;
  const n = Math.max(0, Math.min(total, Math.floor(((t - t0) / (t1 - t0)) * total)));
  let k = 0;
  // Los puntos aparecen de uno en uno; los separadores («/», espacios) cuando ya se han escrito los puntos anteriores.
  const shown = pattern.split('').map((c) => {
    if (c === '•') return k++ < n ? '•' : ' ';
    return k > 0 && k <= n ? c : ' ';
  }).join('');
  const typing = t >= t0 - 0.05 && t < t1 + 0.08;
  if (t < t0 - 0.05) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, display: 'flex', alignItems: 'center', padding: '0 12px', boxSizing: 'border-box' }}>
      <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 17, letterSpacing: 2.5, color: '#2b2b2b', whiteSpace: 'pre' }}>{shown}</span>
      {typing && Math.floor(t / 0.25) % 2 === 0 && <span style={{ width: 1.5, height: 20, background: color.ink, marginLeft: 1 }} />}
      {lockAt !== undefined && t >= lockAt && (
        <svg width="16" height="16" viewBox="0 0 24 24" style={{ marginLeft: 'auto' }}><rect x="5" y="10.5" width="14" height="10" rx="2.4" fill="#1F9D55" /><path d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5" stroke="#1F9D55" strokeWidth="2.2" fill="none" /></svg>
      )}
    </div>
  );
};

// N06 · Paso 5: «Pago» (no pagas nada hasta…) → «Confirma tu cuenta» → Tarjeta de crédito → datos (enmascarados) → «Inicia tu prueba gratuita».
export const N06Pago: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('N06', w, n);
  const fFij = at('fijate');
  const fHoy = at('hoy');
  const rf = (t: number) => Math.round((t - START) * fps); // fotograma de escena de un instante de la grabación
  const swap = rf(M.confirma);
  const f0 = M.fill + 0.04; // empieza a «teclear» tras el clic en el número
  const cam: CamKey[] = [
    { f: 0, zoom: 2.05, x: 960, y: 230 },
    { f: rf(M.click_cont) + 4, zoom: 2.1, x: 960, y: 236 },
    { f: swap + 4, zoom: 1.32, x: 960, y: 470 },
    { f: rf(M.click_card) - 2, zoom: 1.34, x: 990, y: 470 },
    { f: rf(M.expand) + 16, zoom: 1.85, x: 1175, y: 560 },
    { f: rf(M.to_pay) + 10, zoom: 1.9, x: 1175, y: 600 },
    { f: dur, zoom: 1.94, x: 1175, y: 606 },
  ];
  return (
    <Stage>
      <BrowserStage url="nextory.com">
        <ScreenClip src="nx/rec/15_pago/video.mp4" width={BW} startAt={START} cursor={cursor} camera={cam}
          marks={[
            { from: fFij - 4, to: rf(M.to_cont) - 2, x: 748, y: 163, w: 290, h: 34, r: 10, label: 'Hoy pagas 0 €' },
            { from: rf(M.to_cont), to: swap - 2, x: 904, y: 248, w: 113, h: 52, r: 18 },
            { from: rf(M.to_card) + 6, to: rf(M.click_card) + 8, x: 968, y: 321, w: 414, h: 58, r: 10 },
            { from: rf(M.fill), to: rf(M.to_pay) - 2, x: 976, y: 426, w: 398, h: 276, r: 12, label: 'Los datos de tu tarjeta' },
            { from: rf(M.to_pay), to: dur + 6, x: 984, y: 711, w: 382, h: 48, r: 24 },
          ]}
          overlay={(t) => (t >= M.expand ? (
            <>
              <Masked t={t} t0={f0} t1={f0 + 0.62} x={985} y={442} w={344} h={40} pattern="•••• •••• •••• ••••" lockAt={f0 + 0.66} />
              <Masked t={t} t0={f0 + 0.66} t1={f0 + 0.9} x={985} y={544} w={181} h={40} pattern="•• / ••" />
              <Masked t={t} t0={f0 + 0.92} t1={f0 + 1.08} x={1184} y={544} w={181} h={40} pattern="•••" />
              <Masked t={t} t0={f0 + 1.1} t1={f0 + 1.38} x={985} y={654} w={380} h={40} pattern="••••• •••••••" />
            </>
          ) : null)} />
      </BrowserStage>
      <Sfx name="draw" at={fFij - 4} />
      <Sfx name="ui_pop" at={fFij + 4} volume={0.7} />
      <Sfx name="coins" at={fHoy + 6} volume={0.5} />
      <Sfx name="click" at={rf(M.click_cont)} />
      <Sfx name="whoosh_soft" at={swap} volume={0.8} />
      <Sfx name="zoom_out" at={swap + 2} volume={0.7} />
      <Sfx name="click" at={rf(M.click_card)} />
      <Sfx name="swipe" at={rf(M.expand)} />
      <Sfx name="zoom_in" at={rf(M.expand) + 2} volume={0.8} />
      <Sfx name="typing" at={rf(f0)} trimAfter={70} />
      <Sfx name="click" at={rf(M.click_pay)} />
      <Sfx name="success" at={rf(M.click_pay) + 12} volume={0.7} />
    </Stage>
  );
};
