import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Sfx } from '../../components/Sfx';
import { E, eIO, eOut, lerp, ramp, Room, Stip, Words } from './kit';
import { Door, Plant, Plate } from './props';

// ---------------------------------------------------------------------------------------------------------------
// Transiciones del vídeo de eBiblio: todas son puertas.
// - push: la cámara se desplaza por el pasillo (el plano que sale se va a la izquierda y entra el nuevo)
// - slide: dos puertas correderas se cierran sobre el plano que sale y se abren sobre el nuevo
// - soft: fundido corto
// - DoorCard (portadilla de capítulo): una puerta con su número y el título; se abre y la cámara entra por ella.
// ---------------------------------------------------------------------------------------------------------------
export const PUSH = 24;
export const SLIDE = 30;
export const SOFT = 24;
export const CARD = 85; // la portadilla dura 1,7 s (lo que se adelanta la locución en esas escenas)

export const PushOut: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, 0, PUSH, eIO);
  return <AbsoluteFill style={{ transform: `translateX(${-p * 1920}px)` }}>{children}</AbsoluteFill>;
};
export const PushIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, 0, PUSH, eIO);
  if (p >= 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  return <AbsoluteFill style={{ transform: `translateX(${(1 - p) * 1920}px)` }}>{children}</AbsoluteFill>;
};

// Puertas correderas: se cierran (0 → SLIDE/2) y se abren (SLIDE/2 → SLIDE). Se dibujan encima de todo.
export const SlideDoors: React.FC<{ a?: string; b?: string }> = ({ a = E.coral, b = E.pink }) => {
  const frame = useCurrentFrame();
  const h = SLIDE / 2;
  const close = ramp(frame, 0, h, eIO);
  const openP = ramp(frame, h + 2, SLIDE, eIO);
  const x = close * (1 - openP); // 0 abierta, 1 cerrada
  if (x <= 0.001) return null;
  const panel = (left: boolean, c: string) => (
    <div style={{ position: 'absolute', top: 0, bottom: 0, width: 966, left: left ? lerp(-966, -6, x) : undefined, right: left ? undefined : lerp(-966, -6, x), background: c, overflow: 'hidden' }}>
      <Stip kind="h" flip={!left} o={0.2} />
      <div style={{ position: 'absolute', top: 470, [left ? 'right' : 'left']: 46, width: 22, height: 140, borderRadius: 11, background: E.paper, opacity: 0.85 } as React.CSSProperties} />
      <div style={{ position: 'absolute', top: 0, bottom: 0, [left ? 'right' : 'left']: 0, width: 12, background: 'rgba(15,21,33,0.25)' } as React.CSSProperties} />
    </div>
  );
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {panel(true, a)}
      {panel(false, b)}
    </AbsoluteFill>
  );
};

// Fundido corto
export const SoftOut: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const q = ramp(frame, 0, SOFT, (t) => t);
  return <AbsoluteFill style={{ opacity: 1 - q * q, transform: `scale(${1 + 0.03 * eIO(q)})` }}>{children}</AbsoluteFill>;
};
export const SoftIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const q = ramp(frame, 0, SOFT, (t) => t);
  if (q >= 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  return <AbsoluteFill style={{ opacity: 1 - (1 - q) * (1 - q), transform: `scale(${1.03 - 0.03 * eIO(q)})` }}>{children}</AbsoluteFill>;
};

// ---------------------------------------------------------------------------------------------------------------
// Portadilla de capítulo: envuelve el plano. Durante CARD fotogramas se ve una pared del color del capítulo con una
// puerta (placa con el número romano) y el título; la puerta se abre hacia dentro y la cámara la cruza: por el hueco
// ya se ve el plano (más pequeño, más lejos), que llega a pantalla completa.
// ---------------------------------------------------------------------------------------------------------------
const zoomLog = (a: number, b: number, p: number) => Math.exp(lerp(Math.log(a), Math.log(b), p));
export type CardLook = { wall: string; floor: string; base: string; leaf: string; plate: string; title: string; titleColor?: string; pot?: string };
export const DoorCard: React.FC<{ n: string; title: string; look: CardLook; children: React.ReactNode }> = ({ n, title, look, children }) => {
  const frame = useCurrentFrame();
  const DW = 300, DH = 560, CW = 26, DX = 960, DY = 640;
  const open = ramp(frame, 40, 70, eIO);
  const zIn = ramp(frame, 50, CARD, (t) => t * t * (3 - 2 * t));
  const zw = zoomLog(1, 9, zIn);
  const zi = zoomLog(0.42, 1, zIn);
  if (frame >= CARD) return <AbsoluteFill>{children}</AbsoluteFill>;
  const flash = ramp(frame, CARD - 18, CARD - 8, eOut) * (1 - ramp(frame, CARD - 8, CARD + 2, eIO));
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `translate(${(1 - zIn) * (DX - 960)}px, ${(1 - zIn) * (DY - 540)}px) scale(${zi})`, transformOrigin: '960px 540px' }}>{children}</AbsoluteFill>
      {flash > 0.01 && <AbsoluteFill style={{ background: '#FFF8E8', opacity: flash * 0.6 }} />}
      {zIn < 0.995 && (
        <AbsoluteFill style={{ transform: `scale(${zw})`, transformOrigin: `${DX}px ${DY}px` }}>
          <Room wall={look.wall} floor={look.floor} base={look.base} floorY={920} hole={[DX - DW / 2, DY - DH / 2, DW, DH]}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 96, display: 'flex', justifyContent: 'center' }}>
              <Words text={title} at={6} size={92} color={look.titleColor ?? E.paper} stagger={4} />
            </div>
            <div style={{ position: 'absolute', left: DX - DW / 2 - CW, top: DY - DH / 2 - CW }}>
              <Door w={DW} h={DH} casingW={CW} leaf={look.leaf} casing={E.paper} open={open} hollow plate={<Plate text={n} size={64} bg={look.plate} />} />
            </div>
            <div style={{ position: 'absolute', left: 1330, top: 560 }}><Plant size={260} pot={look.pot ?? E.mustard} seed={n.length + 3} /></div>
            <div style={{ position: 'absolute', left: 340, top: 610 }}><Plant size={220} pot={look.plate} seed={n.length + 7} leaf={E.oliveMid} leaf2={E.olive} /></div>
          </Room>
        </AbsoluteFill>
      )}
      <Sfx name="cardboard_pop" at={8} volume={0.5} />
      <Sfx name="door_open" at={40} volume={0.75} />
      <Sfx name="deep_whoosh" at={54} volume={0.45} />
    </AbsoluteFill>
  );
};

// Colores de cada capítulo
export const CARDS: Record<string, CardLook> = {
  I: { wall: E.coral, floor: E.plum, base: E.coralDeep, leaf: E.mustard, plate: E.paper, title: 'Qué es y cómo funciona', pot: E.pink },
  II: { wall: E.pink, floor: E.coral, base: E.pinkDeep, leaf: E.plum, plate: E.mustard, title: 'El carné' },
  III: { wall: E.mustard, floor: E.olive, base: E.mustardDeep, leaf: E.coral, plate: E.paper, title: 'Paso a paso', titleColor: E.ink, pot: E.plum },
  IV: { wall: E.violet, floor: E.plumDeep, base: E.plum, leaf: E.pink, plate: E.mustard, title: 'Las colas' },
  V: { wall: E.oliveLight, floor: E.olive, base: E.oliveMid, leaf: E.plum, plate: E.mustard, title: '¿Merece la pena?', titleColor: E.ink, pot: E.coral },
};
