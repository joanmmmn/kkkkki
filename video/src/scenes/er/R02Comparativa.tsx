import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phase } from '../../components/Phase';
import { BrowserWindow } from '../../components/BrowserWindow';
import { ScreenClip, CamKey } from '../../components/ScreenClip';
import { LogoIcon } from '../../components/Logo';
import { Sfx } from '../../components/Sfx';
import { clamp, easeInOut } from '../../lib/anim';
import { wf } from './timeline';
import { ERLogo } from './common';
import { ER_STEPS } from './steps';

// R02 · La prueba: «En su web, la prueba normal de Ultra dura 3 días. Con el enlace de SonorBooks son 30, y ahorras
// un 15 % al pagar. Así se consigue, paso a paso.»
// Izquierda: elevenreader.io/pricing («Start 3-day free trial», captura del 11/10/2026).
// Derecha: la página a la que lleva el enlace de SonorBooks («30 días gratis y ahorra un 15%»).
const WW = 840;
const GAP = 64;
export const R02Comparativa: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('R02', w, n);
  const fNormal = at('normal');
  const f3 = at('3');
  const fCon = at('Con');
  const f30 = at('30');
  const f15 = at('15');
  const fAsi = at('Asi');
  const fPaso = at('paso');
  const sp = (f: number, d = 18, s = 140) => spring({ frame: frame - f, fps, config: { damping: d, stiffness: s } });
  const left = sp(0);
  const room = sp(fCon - 10, 22, 120);
  const right = sp(fCon - 6);
  const dimL = interpolate(frame, [fCon, fCon + 14], [0, 1], { ...clamp, easing: easeInOut });
  const camL: CamKey[] = [
    { f: 0, zoom: 1.45, x: 1262, y: 560 },
    { f: fNormal, zoom: 1.5, x: 1262, y: 600 },
    { f: f3 + 4, zoom: 2.55, x: 1262, y: 860 },
    { f: dur, zoom: 2.6, x: 1262, y: 862 },
  ];
  const camR: CamKey[] = [
    { f: 0, zoom: 1.7, x: 960, y: 330 },
    { f: f30 - 10, zoom: 1.75, x: 960, y: 340 },
    { f: f30 + 6, zoom: 2.55, x: 960, y: 405 },
    { f: dur, zoom: 2.6, x: 960, y: 408 },
  ];
  const head = (txt: React.ReactNode, s: number, on: boolean) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 64, fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: on ? color.ink : color.muted, opacity: s, transform: `translateY(${(1 - s) * -20}px)` }}>{txt}</div>
  );
  return (
    <Stage>
      <Phase from={0} to={fAsi + 6} noIn out={10}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          {/* La ventana de la derecha entra después y la fila se recentra. */}
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ width: WW, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'center', opacity: left * (1 - 0.25 * dimL), transform: `translateY(${(1 - left) * 40}px) scale(${1 - 0.03 * dimL})`, filter: `grayscale(${0.7 * dimL})` }}>
              {head(<>Sin SonorBooks</>, left, false)}
              <BrowserWindow width={WW} url="elevenreader.io/pricing">
                <ScreenClip src="er/img/pricing.png" image width={WW} camera={camL} dim={0.32}
                  marks={[{ from: f3 - 6, to: dur + 6, x: 1026, y: 866, w: 472, h: 52, r: 26, label: 'Prueba normal: 3 días' }]} />
              </BrowserWindow>
            </div>
            <div style={{ width: (WW + GAP) * room, flexShrink: 0, position: 'relative', height: 10 }}>
              <div style={{ position: 'absolute', left: GAP, top: 0, width: WW, display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'center', opacity: right, transform: `translateX(${(1 - right) * 80}px)`, filter: `blur(${(1 - right) * 6}px)` }}>
                {head(<><LogoIcon size={44} /> Con el enlace de SonorBooks</>, right, true)}
                <BrowserWindow width={WW} url="elevenreader.io">
                  <ScreenClip src="er/rec/02_oferta/first.jpg" image width={WW} camera={camR} dim={0.32}
                    marks={[{ from: f30 - 4, to: dur + 6, x: 800, y: 386, w: 320, h: 56, r: 28, label: f15 - 2 <= frame ? '30 días gratis + 15 %' : '30 días gratis' }]} />
                </BrowserWindow>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </Phase>

      <Phase from={fAsi} to={dur} out={8}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
            <ERLogo width={330} />
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 64, color: color.ink, letterSpacing: -1 }}>· 30 días gratis</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {ER_STEPS.map((s, i) => {
              const f = fPaso - 10 + i * 5;
              const spr = spring({ frame: frame - f, fps, config: { damping: 15, stiffness: 170 } });
              const line = interpolate(frame, [f - 4, f + 4], [0, 1], { ...clamp, easing: easeInOut });
              return (
                <React.Fragment key={s}>
                  {i > 0 && <div style={{ width: 46, height: 5, borderRadius: 3, margin: '0 12px', background: '#E6E6E6', overflow: 'hidden' }}><div style={{ width: `${line * 100}%`, height: '100%', background: color.yellow }} /></div>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 26px 16px 16px', borderRadius: 999, background: '#fff', boxShadow: shadow.card, border: `1px solid ${color.line}`, opacity: spr, transform: `translateY(${(1 - spr) * 40}px) scale(${0.85 + 0.15 * spr})`, filter: `blur(${(1 - spr) * 6}px)` }}>
                    <div style={{ width: 50, height: 50, borderRadius: '50%', background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 27 }}>{i + 1}</div>
                    <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 32, whiteSpace: 'nowrap' }}>{s}</div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </AbsoluteFill>
      </Phase>

      <Sfx name="whoosh_soft" at={0} volume={0.7} />
      <Sfx name="zoom_in" at={f3 - 6} volume={0.7} />
      <Sfx name="draw" at={f3 - 6} />
      <Sfx name="swipe" at={fCon - 6} />
      <Sfx name="zoom_in" at={f30 - 6} volume={0.7} />
      <Sfx name="draw" at={f30 - 4} />
      <Sfx name="ui_pop" at={f15} volume={0.8} />
      <Sfx name="whoosh_soft" at={fAsi} />
      {ER_STEPS.map((s, i) => <Sfx key={s} name="tick_soft" at={fPaso - 10 + i * 5} volume={0.5} />)}
    </Stage>
  );
};
