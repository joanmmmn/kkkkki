import React from 'react';
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phase } from '../../components/Phase';
import { BrowserWindow } from '../../components/BrowserWindow';
import { ScreenClip, CamKey } from '../../components/ScreenClip';
import { Callout } from '../../components/Callout';
import { Donut, BarRow, StackBar } from '../../components/Charts';
import { Sfx } from '../../components/Sfx';
import { clamp, easeOut, fmtEs } from '../../lib/anim';
import { wordFrame } from '../../lib/vo';
import cursor from '../../../public/elt/rec/01_home/cursor.json';

const W = 1640;
const A_START = 3.3;
const logFrac = (min: number) => Math.log10(min) / Math.log10(2500);

// V04 · El catálogo de audio: 6.698 → idioma y géneros → duraciones → filtros por temas.
export const H04Catalog: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0, fb = 0) => lead + wordFrame('V04', w, n, fb);
  const fNum = at('exactamente', 0, 1.9) + 30;
  const fEsp = at('casi', 0, 5.2) - 8;
  const fCuentos = at('cuentos', 0, 8.8) - 14;
  const fMitad = at('mitad', 0, 9.7) - 10;
  const fCyc = at('Crimen', 0, 14.6);
  const fAna = at('Ana', 0, 17.6);
  const fTemas = at('filtrarlos', 0, 20.8) - 22;
  const fMist = at('misterio', 0, 23.4);
  const bStart = 13.9 - (fMist - fTemas) / fps;
  const camA: CamKey[] = [
    { f: 0, zoom: 1.6, x: 300, y: 180 },
    { f: Math.round((4.9 - A_START) * fps), zoom: 1.6, x: 300, y: 180 },
    { f: Math.round((5.9 - A_START) * fps), zoom: 1.1, x: 960, y: 420 },
    { f: Math.round((7.6 - A_START) * fps), zoom: 1.1, x: 960, y: 420 },
    { f: Math.round((8.3 - A_START) * fps), zoom: 2.2, x: 1700, y: 260 },
  ];
  const fAmorRec = fTemas + Math.round((15.4 - bStart) * fps);
  const camB: CamKey[] = [
    { f: 0, zoom: 1.0, x: 960, y: 540 },
    { f: fMist - fTemas - 14, zoom: 1.0, x: 960, y: 540 },
    { f: fMist - fTemas + 10, zoom: 1.6, x: 872, y: 330 },
    { f: fAmorRec - fTemas - 8, zoom: 1.6, x: 600, y: 420 },
    { f: fAmorRec - fTemas + 18, zoom: 1.75, x: 300, y: 480 },
  ];
  const counter = interpolate(frame, [fNum - 20, fNum + 20], [0, 6698], { ...clamp, easing: easeOut });
  return (
    <Stage>
      <Phase from={0} to={fEsp + 6} noIn>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <BrowserWindow width={W}>
            <ScreenClip src="elt/rec/01_home/video.mp4" width={W} startAt={A_START} cursor={cursor} camera={camA}
              marks={[{ from: Math.round((8.0 - A_START) * fps), to: fEsp + 6, x: 1800, y: 236, w: 110, h: 30, r: 10 }]} />
          </BrowserWindow>
        </AbsoluteFill>
        {frame >= fNum - 22 && (
          <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 90 }}>
            <div style={{ padding: '18px 54px', borderRadius: 999, background: color.yellow, fontFamily: font.sans, fontWeight: 700, fontSize: 78, boxShadow: '0 20px 50px rgba(0,0,0,0.25)', transform: `scale(${spring({ frame: frame - fNum + 22, fps, config: { damping: 12 } })})` }}>
              {fmtEs(Math.round(counter))} audiolibros
            </div>
          </AbsoluteFill>
        )}
      </Phase>

      <Phase from={fEsp} to={fMitad + 4}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 160 }}>
          <Donut pct={98} at={8} size={460} label="en español" sub="196 de 200 en nuestra muestra" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
            <div style={{ fontFamily: font.sans, fontSize: 34, letterSpacing: 5, color: color.muted, fontWeight: 500 }}>POR GÉNERO</div>
            <StackBar at={fCuentos - fEsp} width={1000} parts={[{ label: 'Cuentos', pct: 79, c: color.yellow }, { label: 'Novelas', pct: 12, c: color.ink }, { label: 'Otros', pct: 9, c: '#D9D9D9' }]} />
          </div>
        </AbsoluteFill>
      </Phase>

      <Phase from={fMitad} to={fTemas + 6}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 44 }}>
          <div style={{ fontFamily: font.sans, fontSize: 30, letterSpacing: 5, color: color.muted, fontWeight: 500, width: 1400 }}>DURACIÓN · ESCALA LOGARÍTMICA</div>
          <BarRow label="La mitad de los audiolibros dura menos de…" value="18 min" frac={logFrac(18)} at={8} width={1400} size={44} />
          <BarRow label="«Crimen y castigo»" value="26,6 h" frac={logFrac(1596)} at={fCyc - fMitad} width={1400} size={44} />
          <BarRow label="«Ana Karenina»" value="40,8 h" frac={logFrac(2448)} at={fAna - fMitad} width={1400} size={44} accent />
        </AbsoluteFill>
      </Phase>

      <Sequence from={fTemas}>
        <Phase from={0} to={dur - fTemas} out={1}>
          <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
            <BrowserWindow width={W}>
              <ScreenClip src="elt/rec/01_home/video.mp4" width={W} startAt={bStart} cursor={cursor} camera={camB}
                marks={[
                  { from: fMist - fTemas - 4, to: fAmorRec - fTemas - 6, x: 830, y: 252, w: 92, h: 32, r: 16 },
                  { from: fAmorRec - fTemas - 4, to: dur - fTemas, x: 40, y: 476, w: 150, h: 32, r: 16 },
                ]} />
            </BrowserWindow>
          </AbsoluteFill>
          <Callout at={30} x={960} y={930} anchor="center" size={46}>+750 filtros por género y tema</Callout>
        </Phase>
      </Sequence>

      <Sfx name="click" at={Math.round((4.88 - A_START) * fps)} volume={0.5} />
      <Sfx name="counter" at={fNum - 20} volume={0.2} />
      <Sfx name="pop" at={fNum} volume={0.3} />
      <Sfx name="whoosh_fast" at={fEsp - 4} volume={0.3} />
      <Sfx name="pop" at={fCuentos} volume={0.3} />
      <Sfx name="whoosh_fast" at={fMitad - 4} volume={0.3} />
      <Sfx name="tick" at={fCyc} volume={0.2} />
      <Sfx name="tick" at={fAna} volume={0.2} />
      <Sfx name="whoosh_soft" at={fTemas - 4} volume={0.3} />
      <Sfx name="tick" at={fMist} volume={0.2} />
    </Stage>
  );
};
