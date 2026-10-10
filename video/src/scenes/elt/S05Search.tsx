import React from 'react';
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Stage } from '../../components/Stage';
import { BrowserWindow } from '../../components/BrowserWindow';
import { ScreenClip, CamKey } from '../../components/ScreenClip';
import { Callout } from '../../components/Callout';
import { BookIcon, MusicIcon, ArtIcon } from '../../components/Icons';
import { Sfx } from '../../components/Sfx';
import { wordFrame } from '../../lib/vo';
import cursor from '../../../public/elt/rec/02_search/cursor.json';

const W = 1640;
const A_START = 2.4;   // grabación: escribir «Crimen y castigo» y resultados
const B_START = 22.25; // grabación: ficha y versiones

// E05 · Buscar «Crimen y castigo» → resultados conectados → ficha con traducciones.
export const S05Search: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0, fb = 0) => lead + wordFrame('E05', w, n, fb);
  const fLibro = at('libro', 0, 3.4);
  const fMusica = at('musica', 0, 5);
  const fIlus = at('ilustraciones', 0, 6);
  const fFicha = at('ficha', 0, 9.8) - 26;
  const fTrad = at('traducciones', 0, 11.1);
  const fRuso = at('ruso', 0, 13.7);
  const recA = (t: number) => Math.round((t - A_START) * fps);
  const camA: CamKey[] = [
    { f: 0, zoom: 2.1, x: 1700, y: 60 },
    { f: recA(4.5), zoom: 2.1, x: 1700, y: 60 },
    { f: recA(5.4), zoom: 1.0, x: 960, y: 540 },
    { f: fMusica - 4, zoom: 1.0, x: 960, y: 540 },
    { f: fMusica + 14, zoom: 1.25, x: 960, y: 640 },
    { f: fIlus + 14, zoom: 1.35, x: 960, y: 900 },
  ];
  const camB: CamKey[] = [
    { f: 0, zoom: 1.35, x: 960, y: 300 },
    { f: fTrad - fFicha - 14, zoom: 1.35, x: 960, y: 330 },
    { f: fTrad - fFicha + 6, zoom: 1.85, x: 560, y: 720 },
    { f: fRuso - fFicha + 20, zoom: 1.85, x: 640, y: 730 },
  ];
  const enter = spring({ frame, fps, config: { damping: 22, stiffness: 120 } });
  const flash = interpolate(frame, [fFicha - 3, fFicha, fFicha + 6], [0, 0.85, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Stage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ transform: `scale(${0.94 + 0.06 * enter})`, opacity: enter }}>
          <BrowserWindow width={W}>
            <Sequence durationInFrames={fFicha} layout="none">
              <ScreenClip src="elt/rec/02_search/video.mp4" width={W} startAt={A_START} cursor={cursor} camera={camA}
                marks={[
                  { from: fLibro - 4, to: fMusica - 2, x: 50, y: 172, w: 400, h: 260, r: 16 },
                  { from: fMusica, to: fIlus - 2, x: 20, y: 470, w: 1900, h: 320, r: 16 },
                  { from: fIlus, to: fFicha, x: 20, y: 830, w: 1900, h: 250, r: 16 },
                ]}
              />
            </Sequence>
            <Sequence from={fFicha} layout="none">
              <ScreenClip src="elt/rec/02_search/video.mp4" width={W} startAt={B_START} cursor={cursor} camera={camB}
                marks={[{ from: fTrad - fFicha, to: dur, x: 50, y: 620, w: 1040, h: 260, r: 16 }]}
              />
            </Sequence>
            <AbsoluteFill style={{ background: '#fff', opacity: flash, pointerEvents: 'none' }} />
          </BrowserWindow>
        </div>
      </AbsoluteFill>
      <Callout at={fLibro} until={fFicha - 4} x={120} y={930} size={40}><BookIcon size={40} /> Libro</Callout>
      <Callout at={fMusica} until={fFicha - 4} x={360} y={930} size={40}><MusicIcon size={40} /> Música</Callout>
      <Callout at={fIlus} until={fFicha - 4} x={640} y={930} size={40}><ArtIcon size={40} /> Arte</Callout>
      <Callout at={fTrad + 6} x={960} y={930} anchor="center" size={46}>ES · EN · FR · RU</Callout>
      <Sfx name="typing" at={recA(2.77)} volume={0.35} trimAfter={80} />
      <Sfx name="click" at={recA(5.0)} volume={0.4} />
      <Sfx name="pop" at={fLibro} volume={0.3} />
      <Sfx name="pop" at={fMusica} volume={0.3} />
      <Sfx name="pop" at={fIlus} volume={0.3} />
      <Sfx name="whoosh_fast" at={fFicha - 6} volume={0.35} />
      <Sfx name="pop" at={fTrad + 6} volume={0.35} />
    </Stage>
  );
};
