import React from 'react';
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Stage } from '../../components/Stage';
import { BrowserWindow } from '../../components/BrowserWindow';
import { ScreenClip, CamKey } from '../../components/ScreenClip';
import { Callout } from '../../components/Callout';
import { BookIcon, MusicIcon, ArtIcon } from '../../components/Icons';
import { Sfx } from '../../components/Sfx';
import { wordFrame } from '../../lib/vo';
import { H05 } from './timeline';
import { OrigAudioPill } from './H01Hook';
import searchCursor from '../../../public/elt/rec/02_search/cursor.json';
import readerCursor from '../../../public/elt/rec/03_reader/cursor.json';
import env from '../../../public/elt/audio/ctc_4_env.json';

const W = 1640;

// V05 + V06 · Buscar → resultados conectados → ficha con traducciones → Ir al libro → altavoz → narración real → texto resaltado.
export const H05Use: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (x: number) => Math.round(x * fps);
  const at = (w: string, n = 0, fb = 0) => lead + wordFrame('V05', w, n, fb);
  const at6 = (w: string, fb: number) => H05.v06 + wordFrame('V06', w, 0, fb);
  const fLibro = at('libro', 0, 3.9);
  const fMusica = at('musica', 0, 5.4);
  const fIlus = at('ilustraciones', 0, 7.3);
  const fCon = at('aqui', 0, 9.3);
  const cut1 = at('En', 0, 11.4) - 6;            // → ficha
  const fTrad = at('traducciones', 0, 12.7);
  const fRuso = at('ruso', 0, 14.8);
  const cut2 = at('Pulsas', 0, 15.6) - 6;        // → lector
  const cut3 = at('tocas', 0, 17.4) - 6;         // → página del capítulo y globo
  const cut4 = H05.sampleAt - 3;                 // → narración original
  const A_START = 2.77 - (at('Buscas', 0, 1.28) + 6) / fps;
  const B_START = 24.9 - (fTrad - cut1) / fps;
  const C1 = 1.97 - (at('libro', 1, 16.7) + 4 - cut2) / fps;
  const C2 = 9.53 - (at('altavoz', 0, 17.8) + 20 - cut3) / fps;
  const C3 = 21.0 - (H05.sampleAt - cut4) / fps;
  const fPag = at6('paginas', 2.0);
  const fLees = at6('Lees', 3.8);
  const recA = (t: number) => Math.round((t - A_START) * fps);
  const camA: CamKey[] = [
    { f: 0, zoom: 2.1, x: 1700, y: 60 },
    { f: recA(4.6), zoom: 2.1, x: 1700, y: 60 },
    { f: recA(5.4), zoom: 1.0, x: 960, y: 540 },
    { f: fMusica - 4, zoom: 1.0, x: 960, y: 540 },
    { f: fMusica + 14, zoom: 1.25, x: 960, y: 640 },
    { f: fIlus + 14, zoom: 1.35, x: 960, y: 900 },
    { f: fCon, zoom: 1.0, x: 960, y: 540 },
  ];
  const camB: CamKey[] = [
    { f: 0, zoom: 1.35, x: 960, y: 330 },
    { f: fTrad - cut1 - 12, zoom: 1.35, x: 960, y: 340 },
    { f: fTrad - cut1 + 8, zoom: 1.85, x: 560, y: 720 },
    { f: fRuso - cut1 + 16, zoom: 1.85, x: 660, y: 730 },
  ];
  const cam1: CamKey[] = [{ f: 0, zoom: 1.7, x: 880, y: 370 }, { f: cut3 - cut2, zoom: 1.2, x: 960, y: 480 }];
  const cam2: CamKey[] = [{ f: 0, zoom: 1.0, x: 960, y: 560 }, { f: 18, zoom: 1.9, x: 1450, y: 300 }];
  const cam3: CamKey[] = [
    { f: 0, zoom: 1.95, x: 1330, y: 440 },
    { f: fPag - cut4 - 6, zoom: 1.95, x: 1330, y: 455 },
    { f: fPag - cut4 + 22, zoom: 1.0, x: 960, y: 560 },
  ];
  const flash = (f: number) => interpolate(frame, [f - 3, f, f + 7], [0, 0.85, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const enter = spring({ frame, fps, config: { damping: 22, stiffness: 130 } });
  const pill = interpolate(frame, [H05.sampleAt - 6, H05.sampleAt + 6, H05.sampleAt + H05.sampleDur - 6, H05.sampleAt + H05.sampleDur + 6], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Stage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ transform: `scale(${0.95 + 0.05 * enter})`, opacity: enter }}>
          <BrowserWindow width={W}>
            <Sequence durationInFrames={cut1} layout="none">
              <ScreenClip src="elt/rec/02_search/video.mp4" width={W} startAt={A_START} cursor={searchCursor} camera={camA}
                marks={[
                  { from: fLibro - 4, to: fMusica - 2, x: 50, y: 172, w: 400, h: 260, r: 16 },
                  { from: fMusica, to: fIlus - 2, x: 20, y: 470, w: 1900, h: 320, r: 16 },
                  { from: fIlus, to: fCon - 2, x: 20, y: 830, w: 1900, h: 250, r: 16 },
                ]} />
            </Sequence>
            <Sequence from={cut1} durationInFrames={cut2 - cut1} layout="none">
              <ScreenClip src="elt/rec/02_search/video.mp4" width={W} startAt={B_START} cursor={searchCursor} camera={camB}
                marks={[{ from: fTrad - cut1, to: cut2 - cut1, x: 50, y: 620, w: 1040, h: 260, r: 16 }]} />
            </Sequence>
            <Sequence from={cut2} durationInFrames={cut3 - cut2} layout="none">
              <ScreenClip src="elt/rec/03_reader/video.mp4" width={W} startAt={C1} cursor={readerCursor} camera={cam1} />
            </Sequence>
            <Sequence from={cut3} durationInFrames={cut4 - cut3} layout="none">
              <ScreenClip src="elt/rec/03_reader/video.mp4" width={W} startAt={C2} cursor={readerCursor} camera={cam2} />
            </Sequence>
            <Sequence from={cut4} layout="none">
              <ScreenClip src="elt/rec/03_reader/video.mp4" width={W} startAt={C3} cursor={readerCursor} camera={cam3} cursorOpacity={0} />
            </Sequence>
            <AbsoluteFill style={{ background: '#fff', opacity: Math.max(flash(cut1), flash(cut2), flash(cut3)) }} />
          </BrowserWindow>
        </div>
      </AbsoluteFill>

      <Callout at={fLibro} until={cut1 - 4} x={140} y={930} size={42}><BookIcon size={42} /> Libro</Callout>
      <Callout at={fMusica} until={cut1 - 4} x={390} y={930} size={42}><MusicIcon size={42} /> Música</Callout>
      <Callout at={fIlus} until={cut1 - 4} x={680} y={930} size={42}><ArtIcon size={42} /> Arte</Callout>
      <Callout at={fCon} until={cut1 - 4} x={960} y={78} anchor="center" size={44} dark>Todo está conectado</Callout>
      <Callout at={fTrad + 6} until={cut2 - 4} x={960} y={930} anchor="center" size={46}>ES · EN · FR · RU</Callout>
      <Callout at={fLees} x={960} y={930} anchor="center" size={50}>Lees y escuchas a la vez</Callout>
      <Callout at={fPag} until={fLees - 4} x={960} y={930} anchor="center" size={46} dark>Paso de página automático</Callout>
      {pill > 0 && (
        <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 60, opacity: pill }}>
          <OrigAudioPill frame={frame - H05.sampleAt + Math.round(7.98 * 50)} env={env as number[]} />
        </AbsoluteFill>
      )}

      <Sfx name="typing" at={recA(2.77)} volume={0.3} trimAfter={75} />
      <Sfx name="click" at={recA(5.0)} volume={0.4} />
      <Sfx name="pop" at={fLibro} volume={0.28} />
      <Sfx name="pop" at={fMusica} volume={0.28} />
      <Sfx name="pop" at={fIlus} volume={0.28} />
      <Sfx name="whoosh_fast" at={cut1 - 5} volume={0.3} />
      <Sfx name="pop" at={fTrad + 6} volume={0.3} />
      <Sfx name="whoosh_fast" at={cut2 - 5} volume={0.3} />
      <Sfx name="click" at={cut2 + Math.round((1.97 - C1) * fps)} volume={0.5} />
      <Sfx name="page_turn" at={cut2 + Math.round((2.3 - C1) * fps)} volume={0.3} />
      <Sfx name="click" at={cut3 + Math.round((9.53 - C2) * fps)} volume={0.5} />
      <Sfx name="page_turn" at={fPag} volume={0.25} />
      <Sfx name="pop" at={fLees} volume={0.3} />
    </Stage>
  );
};
