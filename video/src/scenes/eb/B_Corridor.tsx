import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../../components/Sfx';
import { LogoIcon } from '../../components/Logo';
import { E, eIO, eOut, follow, Hole, holePath, pop, ramp, Stip, sway } from './kit';
import { Door, LOOKS, Person, Plant, Plate } from './props';
import { w } from './timeline';

// ---------------------------------------------------------------------------------------------------------------
// Plano B (T02): lo que vas a ver. Un pasillo con una puerta por capítulo; la cámara las recorre mientras se nombran
// (cada una se entreabre y deja salir luz). Delante de la de las colas, una cola. Al final, la cámara se aleja y
// aparece la nota amarilla de SonorBooks: la guía completa, con el enlace de cada comunidad.
// ---------------------------------------------------------------------------------------------------------------
const GAP = 600; // separación entre puertas (mundo)
const DW = 280, DH = 520, CW = 24, FLOOR = 860;
const DOORS = [
  { n: 'I', sign: 'Qué es', leaf: E.mustard, plate: E.paper, word: 'qué' },
  { n: 'II', sign: 'El carné', leaf: E.plum, plate: E.mustard, word: 'carné' },
  { n: 'III', sign: 'Paso a paso', leaf: E.coral, plate: E.paper, word: 'pedir' },
  { n: 'IV', sign: 'Las colas', leaf: E.violet, plate: E.mustard, word: 'colas' },
  { n: 'V', sign: '¿Merece la pena?', leaf: E.olive, plate: E.coral, word: '' },
];
const X0 = 960 - 2 * GAP; // el pasillo, centrado en la puerta III

export const Corridor: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w('T02', 'B03', word, n);
  const fGuia = at('guía'), fSB = at('sonorbooks'), fEnl = at('Enlace'), fNadie = at('nadie'), fPaso = at('paso', 1);
  const marks = DOORS.map((d) => (d.word ? at(d.word) : 1e9));
  // cámara: de puerta en puerta y, al final, se aleja para ver el pasillo entero
  const dx = (i: number) => X0 + i * GAP;
  const cam = follow(frame, [
    { f: 0, x: dx(0) - 40, s: 1.08 },
    { f: marks[0] - 6, x: dx(0), s: 1.08 },
    { f: marks[1] - 6, x: dx(1), s: 1.08 },
    { f: marks[2] - 6, x: dx(2), s: 1.08 },
    { f: fPaso + 20, x: dx(2) + 60, s: 1.06 },
    { f: fNadie, x: dx(3) + 120, s: 1.04 },
    { f: fGuia - 8, x: dx(3) + 140, s: 1.02 },
    { f: fGuia + 30, x: 960 + 40, s: 0.62 },
    { f: dur, x: 960 + 40, s: 0.6 },
  ], 4.2);
  const sbIn = pop(frame, fGuia + 10, fps, 120, 16);
  const urlS = pop(frame, fSB - 6, fps, 180, 12);
  const desc = pop(frame, fEnl - 4, fps, 150, 14);
  const queue = ramp(frame, marks[3] - 30, marks[3] + 10, eOut);
  const holes: Hole[] = DOORS.map((_, i) => [dx(i) - DW / 2, FLOOR - DH, DW, DH]);
  return (
    <AbsoluteFill style={{ background: E.pinkLight, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${cam.s}) translateX(${960 - cam.x}px)`, transformOrigin: '960px 640px' }}>
        {/* luz de detrás de las puertas */}
        {DOORS.map((d, i) => (
          <div key={`l${i}`} style={{ position: 'absolute', left: dx(i) - DW / 2, top: FLOOR - DH, width: DW, height: DH, background: 'radial-gradient(90% 70% at 50% 45%, #FFFBF0 0%, #FBE7C2 60%, #F2C98F 100%)' }} />
        ))}
        {/* pared con los huecos, zócalo y suelo */}
        <div style={{ position: 'absolute', left: -1600, top: -1200, width: 6400, height: 3600, clipPath: multiHole(holes, -1600, -1200) }}>
          <div style={{ position: 'absolute', inset: 0, background: E.pinkLight }} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: 1200 + 610, height: 1200 + FLOOR - 610, background: E.pink }} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: 1200 + 596, height: 16, background: E.pinkDeep }} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: 1200 + FLOOR, bottom: 0, background: E.coral }}>
            <Stip kind="v" o={0.25} />
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 1200 + FLOOR - 22, height: 22, background: E.coralDeep }} />
        </div>
        {DOORS.map((d, i) => {
          const on = d.word ? ramp(frame, marks[i] - 4, marks[i] + 10, eOut) : ramp(frame, fGuia + 20, fGuia + 40, eOut);
          const signS = pop(frame, (d.word ? marks[i] : fGuia + 20) - 8, fps, 170, 12);
          const crack = d.word ? 0.26 * on : 0.14 * on;
          const t0 = d.word ? marks[i] - 8 : fGuia + 20;
          const swing = frame > t0 ? 9 * Math.sin((frame - t0) * 0.32) * Math.exp(-(frame - t0) / 22) : 0;
          return (
            <React.Fragment key={d.n}>
              <div style={{ position: 'absolute', left: dx(i) - DW / 2 - CW, top: FLOOR - DH - CW }}>
                <Door w={DW} h={DH} casingW={CW} leaf={d.leaf} casing={E.paper} open={crack} hollow glow={on} plate={<Plate text={d.n} size={58} bg={d.plate} />} />
              </div>
              {/* cartel colgante (se enciende al nombrarlo) */}
              <div style={{ position: 'absolute', left: dx(i), top: 150, width: 0, height: 0, transformOrigin: '0 -120px', transform: `rotate(${sway(frame, i, 1.2, 0.05) + swing}deg)` }}>
                <div style={{ position: 'absolute', left: -100, top: -120, width: 2, height: 124, background: E.ink2 }} />
                <div style={{ position: 'absolute', left: 98, top: -120, width: 2, height: 124, background: E.ink2 }} />
                <div style={{ position: 'absolute', left: -160, top: 0, width: 320, height: 92, borderRadius: 14, background: on > 0.5 ? E.ink : E.ink2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: E.font, fontWeight: 700, fontSize: d.sign.length > 12 ? 32 : 40, color: on > 0.02 ? E.mustardLight : 'rgba(251,247,241,0.45)', boxShadow: on > 0.02 ? `0 0 ${30 * on}px rgba(255,214,120,${0.5 * on})` : 'none',
                  transform: `scale(${0.96 + 0.04 * Math.min(1.1, signS)})` }}>
                  {d.sign}
                </div>
              </div>
            </React.Fragment>
          );
        })}
        {/* plantas entre puertas */}
        {[-1, 0, 1, 2, 3, 4].map((i) => (
          <div key={`p${i}`} style={{ position: 'absolute', left: dx(i) + GAP / 2 - 95, top: FLOOR - 300 }}><Plant size={190} pot={[E.coral, E.mustard, E.plum, E.violet, E.olive, E.coral][i + 1]} seed={i + 2} /></div>
        ))}
        {/* la cola delante de la puerta IV */}
        {queue > 0.01 && [0, 1, 2, 3].map((k) => {
          const s = ramp(frame, marks[3] - 30 + k * 6, marks[3] + k * 6, eOut);
          return (
            <div key={`q${k}`} style={{ position: 'absolute', left: dx(3) + 30 + k * 88 + (1 - s) * 300, top: FLOOR - 330, opacity: s }}>
              <Person look={LOOKS[(k + 2) % LOOKS.length]} size={330} flip walk={s < 1 ? frame / 18 : 0} bob={Math.sin(frame * 0.07 + k) * 1.2} />
            </div>
          );
        })}
      </AbsoluteFill>
      {/* nota de SonorBooks (abajo, sobre el suelo) */}
      {sbIn > 0.01 && (
        <div style={{ position: 'absolute', left: 960, top: 820, transform: `translate(-50%, ${(1 - Math.min(1, sbIn)) * 300}px) rotate(${(1 - Math.min(1, sbIn)) * -6 - 1}deg)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 26, padding: '22px 44px 22px 30px', borderRadius: 28, background: E.yellow, boxShadow: `10px 10px 0 ${E.ink}`, whiteSpace: 'nowrap' }}>
            <div style={{ width: 104, height: 104, borderRadius: '50%', background: E.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LogoIcon size={66} /></div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontFamily: E.font, fontWeight: 600, fontSize: 30, color: E.ink, lineHeight: 1.2 }}>La guía completa, con el enlace de tu comunidad:</div>
              <div style={{ fontFamily: E.font, fontWeight: 800, fontSize: 64, color: E.ink, lineHeight: 1.05, letterSpacing: '-0.02em', transform: `scale(${0.92 + 0.08 * Math.min(1.1, urlS)})`, transformOrigin: '0% 60%' }}>sonorbooks.com</div>
            </div>
          </div>
        </div>
      )}
      {desc > 0.01 && (
        <div style={{ position: 'absolute', left: 960, top: 1008, transform: `translateX(-50%) scale(${Math.min(1.1, desc)})`, opacity: Math.min(1, desc * 2), display: 'flex', alignItems: 'center', gap: 14,
          fontFamily: E.font, fontWeight: 700, fontSize: 34, color: E.paper }}>
          <svg width="34" height="40" viewBox="0 0 34 40" style={{ transform: `translateY(${Math.sin(frame * 0.25) * 4}px)` }}><path d="M17 2 V34 M5 22 L17 35 L29 22" stroke={E.paper} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Enlace en la descripción
        </div>
      )}
      {DOORS.map((d, i) => (d.word ? <Sfx key={i} name="cardboard_pop" at={marks[i] - 6} volume={0.55} /> : null))}
      {DOORS.map((d, i) => (d.word ? <Sfx key={`s${i}`} name="shimmer" at={marks[i] - 2} volume={0.35} /> : null))}
      <Sfx name="crowd_soft" at={marks[3] - 30} volume={0.5} trimAfter={110} />
      <Sfx name="zoom_out" at={fGuia - 6} volume={0.5} />
      <Sfx name="sticker_slap" at={fGuia + 12} volume={0.7} />
      <Sfx name="pop_bright" at={fSB - 4} volume={0.45} />
      <Sfx name="swish_up" at={fEnl - 4} volume={0.45} />
      {eIO(0) > 1 ? null : null}
    </AbsoluteFill>
  );
};

// Recorte con varios huecos (regla par-impar), en coordenadas de un div situado en (ox, oy)
const multiHole = (holes: Hole[], ox: number, oy: number) => {
  const W = 6400, H = 3600;
  const outer = `0px 0px, ${W}px 0px, ${W}px ${H}px, 0px ${H}px, 0px 0px`;
  const inner = holes.map(([x, y, w, h]) => {
    const X = x - ox, Y = y - oy;
    return `${X}px ${Y}px, ${X}px ${Y + h}px, ${X + w}px ${Y + h}px, ${X + w}px ${Y}px, ${X}px ${Y}px, 0px 0px`;
  }).join(', ');
  return `polygon(evenodd, ${outer}, ${inner})`;
};
export { holePath };
