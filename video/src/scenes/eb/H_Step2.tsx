import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../../components/Sfx';
import { Box, BOX, E, eIO, follow, lerp, pop, ramp, Stip } from './kit';
import { Laptop } from './props';
import { Mark, mid, Page, Pointer } from './web';
import { LX, LY, StepTag, SW, toScreen } from './G_Step1';
import { w } from './timeline';

// ---------------------------------------------------------------------------------------------------------------
// Plano H (T08): paso 2, busca. El catálogo de eBiblio Madrid (capturas reales): se marca «Audiolibros» (salen
// muchos con «Reservar») y luego «Títulos disponibles»: la lista cambia y todos dicen «Prestar».
// ---------------------------------------------------------------------------------------------------------------
type It = { buttonBox: Box; tx: Box; button: string };
const items = (k: string) => BOX[`${k}:items`] as unknown as It[];

export const Step2: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w('T08', 'B09', word, n);
  const fPaso = at('Paso'), fCat = at('catálogo'), fMarca = at('marca'), fAudio = at('Audiolibros'), fTit = at('Títulos'), fDisp = at('disponibles');
  const fAsi = at('Así'), fLlevar = at('llevar'), fAhora = at('ahora');
  const lap = pop(frame, 2, fps, 110, 16);
  const audioRow: Box = [60, 424, 260, 32];
  const availRow: Box = [60, 281, 260, 34];
  const clickA = fAudio + 4, clickT = fDisp + 2;
  const swap = ramp(frame, clickT + 6, clickT + 16, eIO); // de «todos los audiolibros» a «títulos disponibles»
  const scroll = lerp(0, 300, ramp(frame, fAsi - 10, fAsi + 30, eIO));
  // cámara: filtros (izquierda) → resultados (derecha)
  const [fx, fy] = toScreen(600, 450, 0);
  const [rx, ry] = toScreen(860, 720, 300);
  const cam = follow(frame, [
    { f: 0, x: 960, y: 540, s: 1 },
    { f: fCat - 10, x: 960, y: 540, s: 1 },
    { f: fMarca + 6, x: fx, y: fy, s: 1.45 },
    { f: clickT + 14, x: fx - 20, y: fy - 10, s: 1.5 },
    { f: fAsi + 16, x: rx, y: ry, s: 1.45 },
    { f: dur, x: rx + 10, y: ry + 10, s: 1.5 },
  ], 5.2);
  return (
    <AbsoluteFill style={{ background: E.mustardPale, overflow: 'hidden' }}>
      <Stip kind="r" o={0.14} />
      <div style={{ position: 'absolute', left: -200, top: 640, width: 2400, height: 800, borderRadius: '50%', background: E.mustardLight, opacity: 0.6 }} />
      <AbsoluteFill style={{ transform: `translate(${960 - cam.x * cam.s}px, ${540 - cam.y * cam.s}px) scale(${cam.s})`, transformOrigin: '0 0' }}>
        <div style={{ position: 'absolute', left: LX, top: LY + (1 - Math.min(1, lap)) * 700 }}>
          <Laptop sw={SW}>
            <Page name="maudio" scroll={scroll}>
              <Mark b={audioRow} at={fAudio - 6} pad={4} out={clickT + 8} />
              {items('maudio').slice(0, 3).map((it, i) => <Mark key={i} b={it.buttonBox} at={fAudio + 8 + i * 4} pad={5} color={E.orange} out={clickT + 4} />)}
            </Page>
            {swap > 0 && (
              <div style={{ position: 'absolute', inset: 0, opacity: swap }}>
                <Page name="mavail" scroll={scroll}>
                  <Mark b={availRow} at={clickT + 10} pad={4} color={E.green} />
                  {items('mavail').slice(0, 4).map((it, i) => <Mark key={i} b={it.buttonBox} at={fLlevar - 16 + i * 5} pad={5} color={E.green} />)}
                </Page>
              </div>
            )}
            {/* cursor (en coordenadas de la página visible) */}
            <div style={{ position: 'absolute', left: 0, top: -scroll, width: 1280 }}>
              <Pointer from={[420, 620]} to={mid(audioRow)} at={fAudio - 16} click={clickA} size={60} o={1 - ramp(frame, fTit - 14, fTit - 6, eIO)} />
              <Pointer from={mid(audioRow)} to={mid(availRow)} at={fTit - 12} click={clickT} size={60} o={1 - ramp(frame, fAsi - 6, fAsi + 4, eIO)} />
            </div>
          </Laptop>
        </div>
        {/* etiquetas en la escena */}
        {(() => {
          const [ax, ay] = toScreen(1123, 612, 0);
          const s1 = pop(frame, fAudio + 14, fps, 170, 13) * (1 - ramp(frame, clickT, clickT + 8, eIO));
          const [bx, by] = toScreen(1123, 600, 300);
          const s2 = pop(frame, fAhora - 6, fps, 170, 13);
          return (
            <>
              {s1 > 0.01 && <Bubble x={ax} y={ay + 34} s={s1} text="Muchos, con cola" bg={E.orange} />}
              {s2 > 0.01 && <Bubble x={bx - 60} y={by} s={s2} text="Te lo llevas ahora" bg={E.green} />}
            </>
          );
        })()}
      </AbsoluteFill>
      <StepTag n="2" title="Busca" at={fPaso - 4} />
      <Sfx name="whoosh_soft" at={0} volume={0.4} />
      <Sfx name="zoom_in" at={fCat - 6} volume={0.4} />
      <Sfx name="mouse_click" at={clickA} volume={0.8} />
      <Sfx name="draw" at={fAudio - 4} volume={0.5} />
      <Sfx name="mouse_click" at={clickT} volume={0.8} />
      <Sfx name="glitch" at={clickT + 8} volume={0.3} />
      <Sfx name="scroll" at={fAsi - 8} volume={0.5} />
      <Sfx name="success" at={fAhora - 4} volume={0.45} />
    </AbsoluteFill>
  );
};

// Bocadillo de texto (centrado en x, por encima de y)
export const Bubble: React.FC<{ x: number; y: number; s: number; text: string; bg: string; color?: string; size?: number }> = ({ x, y, s, text, bg, color = E.paper, size = 30 }) => (
  <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%, 0) scale(${0.7 + 0.3 * Math.min(1.08, s)})`, transformOrigin: '50% 0%', opacity: Math.min(1, s * 2),
    padding: `${size * 0.32}px ${size * 0.7}px`, borderRadius: 999, background: bg, color, fontFamily: E.font, fontWeight: 700, fontSize: size, whiteSpace: 'nowrap', boxShadow: `4px 4px 0 ${E.ink}` }}>{text}</div>
);
