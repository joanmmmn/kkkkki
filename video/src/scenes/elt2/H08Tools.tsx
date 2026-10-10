import React from 'react';
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { BrowserWindow } from '../../components/BrowserWindow';
import { ScreenClip } from '../../components/ScreenClip';
import { Callout } from '../../components/Callout';
import { Words } from '../../components/Kinetic';
import { Sfx } from '../../components/Sfx';
import { clamp, easeInOut } from '../../lib/anim';
import { wordFrame } from '../../lib/vo';

const W = 1640;

// V08 · Lo que no tiene nadie más: diccionarios históricos, lectura comparada y vocabulario.
export const H08Tools: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0, fb = 0) => lead + wordFrame('V08', w, n, fb);
  const fDic = at('decenas', 0, 2.8) - 10;
  const fSiglos = at('tres', 0, 6.08);
  const fComp = at('lectura', 0, 7.41) - 6;
  const fVoc = at('y', 1, 10.0) - 4;
  const fRask = at('Raskolnikov', 0, 12.88);
  const fNum = at('novecientas', 0, 14.36);
  const intro = interpolate(frame, [fDic - 10, fDic + 4], [0, 1], { ...clamp, easing: easeInOut });
  const win = spring({ frame: frame - fDic + 8, fps, config: { damping: 20, stiffness: 130 } });
  const flash = (f: number) => interpolate(frame, [f - 3, f, f + 7], [0, 0.85, 0], clamp);
  return (
    <Stage tone="warm">
      {frame < fDic + 6 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: 1 - intro, filter: `blur(${intro * 10}px)` }}>
          <Words text="Lo que no tiene nadie más" size={120} weight={700} start={2} stagger={4} />
        </AbsoluteFill>
      )}
      {frame >= fDic - 8 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: win, transform: `translateY(${(1 - win) * 60}px)` }}>
          <BrowserWindow width={W}>
            <Sequence from={fDic - 8} durationInFrames={fComp - fDic + 8} layout="none">
              <ScreenClip image src="elt/shots/16-diccionario-desde-seleccion.jpg" width={W} showCursor={false}
                camera={[{ f: 0, zoom: 1.05, x: 960, y: 540 }, { f: 30, zoom: 1.65, x: 980, y: 330 }, { f: fComp - fDic, zoom: 1.75, x: 980, y: 340 }]}
                marks={[{ from: fSiglos - fDic, to: fComp - fDic + 8, x: 660, y: 254, w: 410, h: 30, r: 8 }]} />
            </Sequence>
            <Sequence from={fComp} durationInFrames={fVoc - fComp} layout="none">
              <ScreenClip image src="elt/shots/15-lectura-comparada-es-en-fr.jpg" width={W} showCursor={false}
                camera={[{ f: 0, zoom: 1.0, x: 960, y: 540 }, { f: fVoc - fComp, zoom: 1.08, x: 960, y: 560 }]} />
            </Sequence>
            <Sequence from={fVoc} layout="none">
              <ScreenClip image src="elt/shots/18-vocabulario-de-la-obra.jpg" width={W} showCursor={false}
                camera={[{ f: 0, zoom: 1.0, x: 960, y: 540 }, { f: fRask - fVoc - 6, zoom: 1.2, x: 700, y: 420 }, { f: fRask - fVoc + 16, zoom: 2.3, x: 620, y: 307 }]}
                marks={[{ from: fRask - fVoc + 4, to: dur - fVoc, x: 405, y: 293, w: 430, h: 30, r: 8 }]} />
            </Sequence>
            <AbsoluteFill style={{ background: '#fff', opacity: Math.max(flash(fComp), flash(fVoc)) }} />
          </BrowserWindow>
        </AbsoluteFill>
      )}
      <Callout at={fDic + 10} until={fSiglos - 4} x={960} y={930} anchor="center" size={46}>Decenas de diccionarios a un clic</Callout>
      <Callout at={fSiglos} until={fComp - 4} x={960} y={930} anchor="center" size={46} dark>Diccionario de Autoridades · 1726</Callout>
      {[['Español', 330], ['English', 960], ['Français', 1590]].map(([t, x], i) => (
        <Callout key={t as string} at={fComp + 8 + i * 5} until={fVoc - 4} x={x as number} y={930} anchor="center" size={42}>{t}</Callout>
      ))}
      <Callout at={fVoc + 8} until={fNum - 6} x={960} y={930} anchor="center" size={46}>Vocabulario de la obra</Callout>
      {frame >= fNum - 4 && (
        <AbsoluteFill style={{ alignItems: 'flex-end', justifyContent: 'center', paddingRight: 150 }}>
          <div style={{ background: color.yellow, borderRadius: 40, padding: '30px 50px', textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.25)', transform: `scale(${spring({ frame: frame - fNum + 4, fps, config: { damping: 11, stiffness: 180 } })})` }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 150, lineHeight: 1, letterSpacing: -4 }}>{Math.round(interpolate(frame, [fNum - 4, fNum + 30], [0, 972], clamp))}</div>
            <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 38 }}>veces «Raskólnikov»</div>
          </div>
        </AbsoluteFill>
      )}
      <Sfx name="whoosh_deep" at={fDic - 10} volume={0.3} />
      <Sfx name="pop" at={fSiglos} volume={0.3} />
      <Sfx name="whoosh_fast" at={fComp - 4} volume={0.28} />
      <Sfx name="whoosh_fast" at={fVoc - 4} volume={0.28} />
      <Sfx name="tick" at={fRask + 4} volume={0.2} />
      <Sfx name="counter" at={fNum - 4} volume={0.2} />
      <Sfx name="impact" at={fNum + 30} volume={0.2} />
    </Stage>
  );
};
