import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { BrowserWindow } from '../../components/BrowserWindow';
import { ScreenClip, CamKey } from '../../components/ScreenClip';
import { Callout } from '../../components/Callout';
import { SpeakerIcon } from '../../components/Icons';
import { Sfx } from '../../components/Sfx';
import { wordFrame } from '../../lib/vo';
import { E06 } from './timeline';
import cursor from '../../../public/elt/rec/03_reader/cursor.json';
import env from '../../../public/elt/audio/ctc_4_env.json';

const W = 1640;
const C1 = 0.57;  // grabación: cursor a «Ir al libro» y apertura del libro
const C2 = 7.6;   // grabación: página del Capítulo I y clic en el globo
const C3 = 12.95; // grabación: empieza a sonar el primer párrafo (13,02 s)

// Forma de onda real del fragmento original (envolvente a 50 valores/s).
const Wave: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const t = frame / fps;
  const bars = 48;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 90 }}>
      {Array.from({ length: bars }).map((_, i) => {
        const idx = Math.max(0, Math.floor((t - (bars - i) * 0.035) * 50));
        const v = (env as number[])[Math.min(idx, (env as number[]).length - 1)] ?? 0;
        return <div key={i} style={{ width: 7, height: 10 + v * 80, borderRadius: 4, background: i > bars - 6 ? color.yellow : color.ink, opacity: 0.35 + 0.65 * (i / bars) }} />;
      })}
    </div>
  );
};

// E06 · La audiolectura: Ir al libro → globo/altavoz → narración real con el texto resaltado.
export const S06Listen: React.FC<{ lead: number; dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const atB = (w: string, fb: number) => E06.bAt + wordFrame('E06B', w, 0, fb);
  const fIlumina = atB('ilumina', 1.0);
  const fLees = atB('Lees', 4.5);
  const fHumana = atB('humana', 7.9);
  const fCano = atB('Hernando', 11);
  const r2 = (t: number) => Math.round((t - C2) * fps);
  const r3 = (t: number) => Math.round((t - C3) * fps);
  const balloonY = (t: number) => 258 + (t - 13) * 7.4;
  const cam1: CamKey[] = [
    { f: 0, zoom: 1.6, x: 960, y: 380 },
    { f: 80, zoom: 1.6, x: 900, y: 380 },
    { f: 150, zoom: 1.0, x: 960, y: 560 },
  ];
  const cam2: CamKey[] = [
    { f: 0, zoom: 1.0, x: 960, y: 560 },
    { f: r2(8.6), zoom: 1.0, x: 960, y: 560 },
    { f: r2(9.4), zoom: 2.0, x: 1450, y: 300 },
  ];
  const cam3: CamKey[] = [
    { f: 0, zoom: 1.9, x: 1330, y: balloonY(13) + 120 },
    { f: fLees - E06.clip3At, zoom: 1.9, x: 1330, y: balloonY(C3 + (fLees - E06.clip3At) / fps) + 120 },
    { f: fLees - E06.clip3At + 30, zoom: 1.15, x: 960, y: 560 },
    { f: fCano - E06.clip3At + 40, zoom: 1.15, x: 960, y: 560 },
    { f: fCano - E06.clip3At + 160, zoom: 1.4, x: 1300, y: 420 },
  ];
  const enter = spring({ frame, fps, config: { damping: 22, stiffness: 120 } });
  const sampleOn = interpolate(frame, [E06.sampleAt - 4, E06.sampleAt + 8, E06.sampleAt + E06.sampleDur - 8, E06.sampleAt + E06.sampleDur + 4], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Stage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ transform: `scale(${0.94 + 0.06 * enter})`, opacity: enter }}>
          <BrowserWindow width={W}>
            <Sequence durationInFrames={E06.clip2At} layout="none">
              <ScreenClip src="elt/rec/03_reader/video.mp4" width={W} startAt={C1} cursor={cursor} camera={cam1} />
            </Sequence>
            <Sequence from={E06.clip2At} durationInFrames={E06.clip3At - E06.clip2At} layout="none">
              <ScreenClip src="elt/rec/03_reader/video.mp4" width={W} startAt={C2} cursor={cursor} camera={cam2} />
            </Sequence>
            <Sequence from={E06.clip3At} layout="none">
              <ScreenClip src="elt/rec/03_reader/video.mp4" width={W} startAt={C3} cursor={cursor} camera={cam3} cursorOpacity={0}
/>
            </Sequence>
          </BrowserWindow>
        </div>
      </AbsoluteFill>

      {/* Indicador: estás oyendo el audio original */}
      <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 70, opacity: sampleOn }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, padding: '22px 40px', borderRadius: 999, background: '#fff', boxShadow: shadow.float, border: `1px solid ${color.line}`, transform: `translateY(${(1 - sampleOn) * 30}px)` }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><SpeakerIcon size={36} /></div>
          <div style={{ fontFamily: font.sans }}>
            <div style={{ fontSize: 22, letterSpacing: 4, color: color.muted, fontWeight: 500 }}>AUDIO ORIGINAL · EL LIBRO TOTAL</div>
            <div style={{ fontSize: 32, fontWeight: 700 }}>Crimen y castigo · capítulo I</div>
          </div>
          <Wave frame={frame - E06.sampleAt} fps={fps} />
        </div>
      </AbsoluteFill>

      <Callout at={fHumana} until={fCano - 4} x={960} y={930} anchor="center" size={46}>Voz humana, no sintética</Callout>
      <Callout at={fCano + 12} x={960} y={930} anchor="center" size={46} dark>Leído por Hernando Iván Cano</Callout>

      <Sequence from={E06.sampleAt} durationInFrames={E06.sampleDur + 10} layout="none">
        <Audio src={staticFile('elt/audio/ctc_sample.mp3')} volume={1} />
      </Sequence>
      <Sfx name="click" at={Math.round((1.97 - C1) * fps)} volume={0.5} />
      <Sfx name="page_turn" at={Math.round((2.3 - C1) * fps)} volume={0.35} />
      <Sfx name="page_turn" at={E06.clip2At - 2} volume={0.3} />
      <Sfx name="click" at={E06.clip2At + r2(9.53)} volume={0.5} />
      <Sfx name="whoosh_soft" at={E06.clip3At - 4} volume={0.2} />
      <Sfx name="pop" at={fCano + 12} volume={0.35} />
    </Stage>
  );
};
