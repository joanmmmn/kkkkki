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
import { Grow, GrowV } from '../../components/Grow';
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
    { f: Math.round((6.3 - A_START) * fps), zoom: 1.1, x: 960, y: 420 },
    { f: Math.round((7.2 - A_START) * fps), zoom: 1.12, x: 1000, y: 410 },
    { f: Math.round((8.3 - A_START) * fps), zoom: 1.75, x: 1480, y: 300 },
  ];
  const fAmorRec = fTemas + Math.round((15.4 - bStart) * fps);
  const camB: CamKey[] = [
    { f: 0, zoom: 1.0, x: 960, y: 540 },
    { f: fMist - fTemas - 24, zoom: 1.02, x: 940, y: 520 },
    { f: fMist - fTemas + 14, zoom: 1.6, x: 872, y: 330 },
    { f: fAmorRec - fTemas - 24, zoom: 1.62, x: 840, y: 345 },
    { f: fAmorRec - fTemas + 14, zoom: 1.75, x: 300, y: 480 },
  ];
  const counter = interpolate(frame, [fNum - 20, fNum + 20], [0, 6698], { ...clamp, easing: easeOut });
  return (
    <Stage>
      <Phase from={0} to={fEsp + 6} noIn>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <BrowserWindow width={W}>
            <ScreenClip src="elt/rec/01_home/video.mp4" width={W} startAt={A_START} cursor={cursor} camera={camA}
              marks={[{ from: Math.round((7.85 - A_START) * fps), to: fEsp + 6, x: 1788, y: 229, w: 128, h: 42, r: 21 }]} />
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
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
          <Donut pct={98} at={8} size={460} label="en español" sub="196 de 200 en nuestra muestra" />
          <Grow at={fCuentos - fEsp - 10} w={1000} gap={140} rise={30}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
              <div style={{ fontFamily: font.sans, fontSize: 34, letterSpacing: 5, color: color.muted, fontWeight: 500 }}>POR GÉNERO</div>
              <StackBar at={fCuentos - fEsp} width={1000} parts={[{ label: 'Cuentos', pct: 79, c: color.yellow }, { label: 'Novelas', pct: 12, c: color.ink }, { label: 'Otros', pct: 9, c: '#D9D9D9' }]} />
            </div>
          </Grow>
        </AbsoluteFill>
      </Phase>

      <Phase from={fMitad} to={fTemas + 6}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <div style={{ fontFamily: font.sans, fontSize: 32, letterSpacing: 5, color: color.muted, fontWeight: 500, width: 1500, marginBottom: 44 }}>DURACIÓN · ESCALA LOGARÍTMICA</div>
          <BarRow label="La mitad de los audiolibros dura menos de…" value="18 min" frac={logFrac(18)} at={8} width={1500} size={52} />
          <GrowV at={fCyc - fMitad - 6} h={102} gap={46}><BarRow label="«Crimen y castigo»" value="26,6 h" frac={logFrac(1596)} at={fCyc - fMitad} width={1500} size={52} /></GrowV>
          <GrowV at={fAna - fMitad - 6} h={102} gap={46}><BarRow label="«Ana Karenina»" value="40,8 h" frac={logFrac(2448)} at={fAna - fMitad} width={1500} size={52} accent /></GrowV>
        </AbsoluteFill>
      </Phase>

      <Sequence from={fTemas}>
        <Phase from={0} to={dur - fTemas} out={1}>
          <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
            <BrowserWindow width={W}>
              <ScreenClip src="elt/rec/01_home/video.mp4" width={W} startAt={bStart} cursor={cursor} camera={camB}
                marks={[
                  { from: fMist - fTemas - 4, to: fAmorRec - fTemas - 6, x: 818, y: 243, w: 108, h: 48, r: 24 },
                  { from: fAmorRec - fTemas - 4, to: dur - fTemas + 20, x: 4, y: 467, w: 216, h: 48, r: 24 },
                ]} />
            </BrowserWindow>
          </AbsoluteFill>
          <Callout at={30} x={960} y={930} anchor="center" size={46}>+750 filtros por género y tema</Callout>
        </Phase>
      </Sequence>

      <Sfx name="click" at={Math.round((4.88 - A_START) * fps)} />
      <Sfx name="zoom_out" at={Math.round((5.9 - A_START) * fps) - 6} volume={0.8} />
      <Sfx name="draw" at={Math.round((7.85 - A_START) * fps)} />
      <Sfx name="zoom_in" at={Math.round((7.9 - A_START) * fps)} />
      <Sfx name="counter" at={fNum - 20} />
      <Sfx name="snap_in" at={fNum - 20} />
      <Sfx name="swipe" at={fEsp} />
      <Sfx name="ui_pop" at={fEsp + 8} />
      <Sfx name="swipe" at={fCuentos - 8} volume={0.7} />
      <Sfx name="ui_pop" at={fCuentos} volume={0.8} />
      <Sfx name="swipe" at={fMitad} />
      <Sfx name="tick_soft" at={fMitad + 8} />
      <Sfx name="tick_soft" at={fCyc} />
      <Sfx name="tick_soft" at={fAna} />
      <Sfx name="transition" at={fTemas} volume={0.8} />
      <Sfx name="zoom_in" at={fMist - 4} volume={0.8} />
      <Sfx name="draw" at={fMist - 4} />
      <Sfx name="swipe" at={fAmorRec - 2} />
    </Stage>
  );
};
