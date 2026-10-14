import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../../components/Sfx';
import { clamp01, E, eIO, eOut, follow, lerp, pop, ramp, Stip } from './kit';
import { CARDS, DoorCard } from './frames';
import { centerOf, OWN, REGIONS, SpainMap } from './map';
import { LOOKS, Person, Phone, PlainCover } from './props';
import { Sticker } from './A_Open';
import { Coin, LibraryBuilding, Ministry } from './world';
import { w } from './timeline';

// ---------------------------------------------------------------------------------------------------------------
// Plano C (T03): capítulo I. Qué es: el préstamo digital de las bibliotecas públicas (de la biblioteca al móvil);
// lo ponen en marcha el Ministerio de Cultura y las comunidades (el mapa se enciende); es gratis para ti porque los
// audiolibros los paga la biblioteca. Tres paneles; la cámara pasa de uno a otro.
// ---------------------------------------------------------------------------------------------------------------
const FILL = [E.coral, E.mustard, E.plum, E.pink, E.olive, E.violet, E.coralLight, E.oliveMid];
const COVERS = [E.coral, E.mustard, E.violet, E.pink, E.olive];

export const What: React.FC<{ dur: number }> = ({ dur }) => {
  const look = CARDS.I;
  return (
    <DoorCard n="I" title={look.title} look={look}>
      <WhatBody dur={dur} />
    </DoorCard>
  );
};

const WhatBody: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w('T03', 'B04', word, n);
  const fPrest = at('préstamo'), fDig = at('digital'), fBibl = at('bibliotecas'), fLo = at('Lo'), fMin = at('Ministerio'), fCom = at('comunidades');
  const fY = at('y'), fGratis = at('gratis'), fAud = at('audiolibros'), fPaga = at('paga'), fBib2 = at('biblioteca', 1);
  // cámara entre los tres paneles
  const cam = follow(frame, [
    { f: 0, x: 0, s: 1 },
    { f: fLo - 14, x: 0, s: 1 },
    { f: fLo + 16, x: 1920, s: 1 },
    { f: fY - 10, x: 1920, s: 1 },
    { f: fY + 18, x: 3840, s: 1 },
    { f: dur, x: 3840, s: 1.02 },
  ], 5.2);
  // panel 1: biblioteca → móvil
  const bld = pop(frame, 70, fps, 120, 15);
  const ph = pop(frame, 88, fps, 120, 15);
  const lab1 = pop(frame, fDig - 4, fps, 170, 14);
  const lab2 = pop(frame, fBibl - 2, fps, 170, 14);
  // panel 2: ministerio + comunidades
  const min = pop(frame, fMin - 8, fps, 150, 13);
  const mapIn = (i: number) => ramp(frame, fCom - 20 + i * 2.2, fCom - 4 + i * 2.2, eOut);
  const lines = ramp(frame, fCom - 8, fCom + 40, eIO);
  // panel 3: gratis / lo paga la biblioteca
  const free = pop(frame, fGratis - 6, fps, 240, 12);
  const pay = pop(frame, fAud - 8, fps, 150, 15);
  const coins = ramp(frame, fPaga - 16, fPaga + 26, eIO);
  const lab3 = pop(frame, fBib2 - 6, fps, 170, 14);
  const MAPW = 1300, MX = 1920 + 560, MY = 30, K = MAPW / 1600;
  const MINX = 1920 + 300, MINY = 300;
  const parts = REGIONS.filter((r) => !OWN[r.name]);
  return (
    <AbsoluteFill style={{ background: E.bone, overflow: 'hidden' }}>
      <Stip kind="r" o={0.12} />
      <AbsoluteFill style={{ transform: `translateX(${-cam.x}px) scale(${cam.s})`, transformOrigin: `${960 + cam.x}px 540px` }}>
        {/* suelo de los tres paneles */}
        <div style={{ position: 'absolute', left: -400, width: 6560, top: 880, height: 400, background: E.coralPale }}>
          <Stip kind="v" o={0.16} />
        </div>
        {/* ---- panel 1 ---- */}
        <div style={{ position: 'absolute', left: 960 - 760, top: 60, width: 1520, height: 1520, borderRadius: '50%', background: E.coralPale, opacity: 0.55 }} />
        <div style={{ position: 'absolute', left: 150, top: 880 - 440 * 1.25, transform: `translateY(${(1 - Math.min(1, bld)) * 120}px) scale(${0.9 + 0.1 * Math.min(1, bld)})`, transformOrigin: '50% 100%', opacity: Math.min(1, bld * 2) }}>
          <LibraryBuilding w={650} glow={ramp(frame, fPrest - 10, fPrest + 10, eOut)} sign="Biblioteca" />
        </div>
        {/* arco punteado de la biblioteca al móvil */}
        <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
          <path d="M475 700 Q960 120 1410 470" fill="none" stroke={E.plum} strokeWidth={5} strokeDasharray="4 18" strokeLinecap="round" pathLength={1000}
            style={{ strokeDashoffset: 0 }} opacity={0.5 * ramp(frame, fPrest - 14, fPrest + 6, eOut)} />
        </svg>
        <div style={{ position: 'absolute', left: 1330, top: 220 + (1 - Math.min(1, ph)) * 500, transform: `rotate(${(1 - Math.min(1, ph)) * 8 + 3}deg)` }}>
          <Phone w={340}>
            <div style={{ padding: '60px 20px', fontFamily: E.ui }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: E.ink, marginBottom: 16 }}>Mis audiolibros</div>
              {[0, 1, 2, 3].map((r) => {
                const got = ramp(frame, fPrest + 26 + r * 9, fPrest + 34 + r * 9, eOut);
                return (
                  <div key={r} style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16, opacity: got, transform: `translateX(${(1 - got) * 30}px)` }}>
                    <PlainCover w={78} title={['Novela', 'Ensayo', 'Thriller', 'Poesía'][r]} bg={COVERS[r]} accent={r === 1 ? E.plum : E.pink} />
                    <div>
                      <div style={{ width: 150, height: 14, borderRadius: 7, background: '#E7E1DA', marginBottom: 10 }} />
                      <div style={{ width: 100, height: 14, borderRadius: 7, background: '#EFEBE6' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Phone>
        </div>
        {/* audiolibros que vuelan de la puerta de la biblioteca al móvil (siguiendo el arco) */}
        {[0, 1, 2, 3].map((i) => {
          const p = ramp(frame, fPrest - 8 + i * 9, fPrest + 30 + i * 9, eIO);
          if (p <= 0 || p >= 1) return null;
          const q = 1 - p;
          const x = q * q * 475 + 2 * q * p * 960 + p * p * 1410, y = q * q * 700 + 2 * q * p * 120 + p * p * 470;
          return (
            <div key={i} style={{ position: 'absolute', left: x - 50, top: y - 50, transform: `rotate(${(p - 0.5) * 30}deg) scale(${0.7 + 0.3 * Math.sin(p * Math.PI)})` }}>
              <PlainCover w={100} title="" bg={COVERS[i]} accent={E.paper} />
            </div>
          );
        })}
        <Label x={960} y={300} s={lab1} text="Préstamo digital" bg={E.ink} color={E.mustardLight} size={48} />
        <Label x={475} y={950} s={lab2} text="de las bibliotecas públicas" bg={E.coral} color={E.paper} />

        {/* ---- panel 2 ---- */}
        <div style={{ position: 'absolute', left: 1920 + 960 - 900, top: -260, width: 1800, height: 1500, borderRadius: '50%', background: E.pinkPale, opacity: 0.7 }} />
        <div style={{ position: 'absolute', left: MINX - 160, top: MINY - 30, transform: `translateY(${(1 - Math.min(1, min)) * 80}px) scale(${0.85 + 0.15 * Math.min(1, min)})`, opacity: Math.min(1, min * 2), transformOrigin: '50% 100%' }}>
          <Ministry w={320} />
          <div style={{ marginTop: 18, textAlign: 'center', fontFamily: E.font, fontWeight: 700, fontSize: 40, color: E.plum, lineHeight: 1.1 }}>Ministerio<br />de Cultura</div>
        </div>
        {/* arcos del ministerio a cada comunidad */}
        <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
          {parts.map((r, i) => {
            const [cx, cy] = centerOf(r);
            const x2 = MX + cx * K, y2 = MY + cy * K;
            const x1 = MINX + 40, y1 = MINY + 40;
            const mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 120;
            const p = clamp01(lines * 1.7 - i * 0.04);
            if (p <= 0) return null;
            return <path key={r.id} d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`} fill="none" stroke={E.plum} strokeWidth={3} opacity={0.45} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />;
          })}
        </svg>
        <div style={{ position: 'absolute', left: MX, top: MY }}>
          <SpainMap w={MAPW} reveal={(r, i) => (OWN[r.name] ? mapIn(i) * 0.999 : mapIn(i))} fill={(r, i) => (OWN[r.name] ? '#E3DACE' : FILL[i % FILL.length])} stroke={E.bone} strokeW={4}>
            {parts.map((r) => {
              const [cx, cy] = centerOf(r);
              const p = ramp(frame, fCom + 10, fCom + 24, eOut);
              return <div key={r.id} style={{ position: 'absolute', left: cx - 13, top: cy - 13, width: 26, height: 26, borderRadius: '50%', background: E.paper, border: `5px solid ${E.ink}`, boxSizing: 'border-box', transform: `scale(${p})` }} />;
            })}
          </SpainMap>
        </div>
        <Label x={1920 + 380} y={700} s={pop(frame, fCom - 6, fps, 170, 14)} text="+ las comunidades autónomas" bg={E.plum} color={E.paper} size={38} />

        {/* ---- panel 3 ---- */}
        <div style={{ position: 'absolute', left: 3840 + 120, top: 120, width: 820, height: 820, borderRadius: '50%', background: E.mustardPale }} />
        <div style={{ position: 'absolute', left: 3840 + 1000, top: 140, width: 820, height: 820, borderRadius: '50%', background: E.lilacPale }} />
        <div style={{ position: 'absolute', left: 3840 + 380, top: 880 - 640 }}>
          <Person look={LOOKS[2]} size={640} reach={0.8} hold={<div style={{ width: 40, height: 70, borderRadius: 8, background: E.ink2, marginLeft: 20, marginTop: 30 }} />} />
        </div>
        {free > 0.01 && (
          <Sticker x={3840 + 560} y={170} s={free} bg={E.coral} rot={-10} size={250}>
            <div style={{ textAlign: 'center', lineHeight: 1 }}><div style={{ fontSize: 86, fontWeight: 800 }}>0 €</div><div style={{ fontSize: 30, fontWeight: 700, marginTop: 6 }}>para ti</div></div>
          </Sticker>
        )}
        <div style={{ position: 'absolute', left: 3840 + 1010, top: 880 - 440 * 0.85, transform: `scale(${Math.min(1, pay)})`, transformOrigin: '50% 100%', opacity: Math.min(1, pay * 2) }}>
          <LibraryBuilding w={440} sign="Biblioteca" wall={E.violet} roof={E.plumDeep} />
        </div>
        {/* audiolibros (licencias) en un pedestal */}
        <div style={{ position: 'absolute', left: 3840 + 1520, top: 880 - 330, width: 240, height: 330, opacity: Math.min(1, pay * 2), transform: `translateY(${(1 - Math.min(1, pay)) * 60}px)` }}>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 120, background: E.plum, borderRadius: '10px 10px 0 0' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 30, textAlign: 'center', fontFamily: E.font, fontWeight: 700, fontSize: 30, color: E.paper }}>Licencias</div>
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ position: 'absolute', left: 40 + (i % 2) * 18, bottom: 120 + i * 58, transform: `rotate(${(i % 2 ? 1 : -1) * 4}deg)` }}><PlainCover w={150} title="" bg={COVERS[i + 1]} accent={E.paper} style={{ height: 52 }} /></div>
          ))}
        </div>
        {/* monedas de la biblioteca a los audiolibros */}
        {[0, 1, 2].map((i) => {
          const p = clamp01(coins * 1.4 - i * 0.2);
          if (p <= 0 || p >= 1) return null;
          const x = lerp(3840 + 1300, 3840 + 1640, p), y = lerp(560, 470, p) - Math.sin(p * Math.PI) * 200;
          return <div key={i} style={{ position: 'absolute', left: x - 35, top: y - 35, transform: `rotate(${p * 360}deg)` }}><Coin size={70} /></div>;
        })}
        <Label x={3840 + 1440} y={970} s={lab3} text="Los audiolibros los paga la biblioteca" bg={E.ink} color={E.mustardLight} size={40} />
      </AbsoluteFill>
      <Sfx name="cardboard_pop" at={70} volume={0.5} />
      <Sfx name="phone_whoosh" at={86} volume={0.5} />
      {[0, 1, 2, 3, 4].map((i) => <Sfx key={i} name="pop" at={fPrest + 28 + i * 9} volume={0.25} />)}
      <Sfx name="whip" at={fLo - 12} volume={0.5} />
      <Sfx name="cardboard_pop" at={fMin - 6} volume={0.6} />
      <Sfx name="map_rise" at={fCom - 18} volume={0.7} />
      <Sfx name="whip" at={fY - 8} volume={0.5} />
      <Sfx name="sticker_slap" at={fGratis - 2} volume={0.9} />
      <Sfx name="coins" at={fPaga - 6} volume={0.6} />
      <Sfx name="pop_bright" at={fBib2 - 4} volume={0.4} />
    </AbsoluteFill>
  );
};

// Rótulo de texto centrado en (x, y) que entra con un pequeño rebote
export const Label: React.FC<{ x: number; y: number; s: number; text: string; bg: string; color: string; size?: number; rot?: number }> = ({ x, y, s, text, bg, color, size = 42, rot = 0 }) => {
  if (s <= 0.01) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${0.7 + 0.3 * Math.min(1.08, s)})`, opacity: Math.min(1, s * 2), whiteSpace: 'nowrap',
      padding: `${size * 0.3}px ${size * 0.7}px`, borderRadius: 999, background: bg, color, fontFamily: E.font, fontWeight: 700, fontSize: size, lineHeight: 1.15 }}>{text}</div>
  );
};
