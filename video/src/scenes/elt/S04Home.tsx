import React from 'react';
import { AbsoluteFill, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { BrowserWindow } from '../../components/BrowserWindow';
import { ScreenClip, CamKey } from '../../components/ScreenClip';
import { Callout } from '../../components/Callout';
import { SpeakerIcon } from '../../components/Icons';
import { Sfx } from '../../components/Sfx';
import { wordFrame } from '../../lib/vo';
import cursor from '../../../public/elt/rec/01_home/cursor.json';

const W = 1640;
const A_START = 2.35; // grabación: clic en «Audiolibros» y la sección con su contador
const REC_MISTERIO = 13.9; // grabación: el cursor llega a «Misterio»
const REC_AMORES = 15.4;   // grabación: el cursor llega a «Amores Imposibles»

// E04 · Portada → sección Audiolibros (6.698, sobre todo cuentos) → altavoz → filtros por temas.
export const S04Home: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0, fb = 0) => lead + wordFrame('E04', w, n, fb);
  const s = (x: number) => Math.round(x * fps);
  const fNum = at('setecientos', 0, 4.5);
  const fCuentos = at('cuentos', 0, 6.7);
  const fAltavoz = at('marcados', 0, 7.7);
  const fTemas = at('filtrables', 0, 9.1);
  const fMist = at('misterio', 0, 11.8);
  const fAmor = at('amores', 0, 12.9);
  const fCut = fAltavoz + s(0.9); // corte oculto bajo la tarjeta del altavoz
  const bStart = REC_MISTERIO - (fMist - fCut) / fps; // la grabación B llega a «Misterio» cuando se dice
  const fAmorRec = fCut + Math.round((REC_AMORES - bStart) * fps);
  const camA: CamKey[] = [
    { f: 0, zoom: 1.05, x: 960, y: 400 },
    { f: s(1.6), zoom: 1.7, x: 300, y: 180 },
    { f: s(2.9), zoom: 1.7, x: 300, y: 180 },
    { f: s(4.2), zoom: 1.15, x: 960, y: 420 },
    { f: fNum - 6, zoom: 1.15, x: 960, y: 420 },
    { f: fNum + 14, zoom: 2.3, x: 1700, y: 260 },
    { f: fCuentos - 12, zoom: 2.3, x: 1700, y: 260 },
    { f: fCuentos + 10, zoom: 1.25, x: 960, y: 440 },
  ];
  const camB: CamKey[] = [
    { f: 0, zoom: 1.0, x: 960, y: 540 },
    { f: fMist - fCut - 16, zoom: 1.0, x: 960, y: 540 },
    { f: fMist - fCut + 10, zoom: 1.6, x: 872, y: 330 },
    { f: fAmorRec - fCut - 10, zoom: 1.6, x: 600, y: 420 },
    { f: fAmorRec - fCut + 20, zoom: 1.75, x: 300, y: 480 },
  ];
  const card = spring({ frame: frame - fAltavoz, fps, config: { damping: 16, stiffness: 150 } });
  const cardOut = interpolate(frame, [fTemas + 10, fTemas + 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const enter = spring({ frame, fps, config: { damping: 22, stiffness: 120 } });
  return (
    <Stage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ transform: `scale(${0.94 + 0.06 * enter})`, opacity: enter }}>
          <BrowserWindow width={W}>
            <Sequence durationInFrames={fCut} layout="none">
              <ScreenClip src="elt/rec/01_home/video.mp4" width={W} startAt={A_START} cursor={cursor} camera={camA}
                marks={[
                  { from: fNum + 8, to: fCuentos - 6, x: 1800, y: 236, w: 110, h: 30, r: 10 },
                  { from: fCuentos, to: fCut, x: 60, y: 483, w: 1840, h: 24, r: 8 },
                ]} />
            </Sequence>
            <Sequence from={fCut} layout="none">
              <ScreenClip src="elt/rec/01_home/video.mp4" width={W} startAt={bStart} cursor={cursor} camera={camB}
                marks={[
                  { from: fMist - fCut - 4, to: fAmorRec - fCut - 6, x: 830, y: 252, w: 92, h: 32, r: 16 },
                  { from: fAmorRec - fCut - 4, to: dur - fCut, x: 40, y: 476, w: 150, h: 32, r: 16 },
                ]} />
            </Sequence>
          </BrowserWindow>
        </div>
      </AbsoluteFill>
      <Callout at={fNum + 14} until={fCuentos - 4} x={960} y={900} anchor="center" size={52}>6.698 audiolibros</Callout>
      <Callout at={fCuentos + 4} until={fAltavoz - 4} x={960} y={900} anchor="center" size={52}>Sobre todo, cuentos</Callout>

      {/* Tarjeta: el icono del altavoz en las portadas */}
      {frame >= fAltavoz - 2 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: 1 - cardOut }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 40, padding: 40, borderRadius: 36, background: '#fff', boxShadow: shadow.card, transform: `scale(${0.8 + 0.2 * card}) rotate(${(1 - card) * -4}deg)`, opacity: card }}>
            <div style={{ width: 300, height: 400, borderRadius: 16, overflow: 'hidden', position: 'relative', boxShadow: shadow.soft }}>
              <Img src={staticFile('elt/img/m03_home_scrolled.png')} style={{ position: 'absolute', width: 1290, left: -48, top: -548 }} />
              <div style={{ position: 'absolute', left: 78, top: 343, width: 110, height: 110, marginLeft: -55, marginTop: -55, borderRadius: '50%', border: `6px solid ${color.yellow}`, boxShadow: '0 0 30px rgba(255,202,5,0.7)', transform: `scale(${spring({ frame: frame - fAltavoz - 10, fps, config: { damping: 8 } })})` }} />
            </div>
            <div style={{ fontFamily: font.sans, maxWidth: 520 }}>
              <SpeakerIcon size={90} />
              <div style={{ fontSize: 60, fontWeight: 700, marginTop: 16, lineHeight: 1.05 }}>El altavoz indica audiolibro</div>
            </div>
          </div>
        </AbsoluteFill>
      )}
      <Sfx name="click" at={Math.round((4.88 - A_START) * fps)} volume={0.5} />
      <Sfx name="pop" at={fNum + 14} volume={0.35} />
      <Sfx name="pop" at={fCuentos + 4} volume={0.3} />
      <Sfx name="pop" at={fAltavoz} volume={0.35} />
      <Sfx name="tick" at={fMist} volume={0.2} />
      <Sfx name="tick" at={fAmorRec} volume={0.2} />
    </Stage>
  );
};
