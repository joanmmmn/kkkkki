import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../../components/Sfx';
import { Box, E, eIO, eOut, follow, pop, ramp, Room } from './kit';
import { CARDS, DoorCard } from './frames';
import { LOOKS, Person, PlainCover, Plant } from './props';
import { Crop, Mark } from './web';
import { w } from './timeline';

// ---------------------------------------------------------------------------------------------------------------
// Plano L (T12): capítulo IV, las colas. Delante de las novedades, una cola larga. Hoy, en eBiblio Madrid (capturas
// reales): «Cien años de soledad», próximo ejemplar el 7 ene 2027; «Sapiens», sin reservas libres.
// ---------------------------------------------------------------------------------------------------------------
export const Queues: React.FC<{ dur: number }> = ({ dur }) => {
  const look = CARDS.IV;
  return (
    <DoorCard n="IV" title={look.title} look={look}>
      <QueuesBody dur={dur} />
    </DoorCard>
  );
};

const FLOOR = 900, PS = 360;
const QueuesBody: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w('T12', 'B13', word, n);
  const fNov = at('novedades'), fCola = at('cola'), fHoy = at('Hoy'), fEnero = at('enero');
  const fY = at('Y'), fQuedan = at('quedan');
  const shelf = pop(frame, 60, fps, 120, 16);
  const cam = follow(frame, [
    { f: 0, x: 960, s: 1 },
    { f: fNov, x: 960, s: 1 },
    { f: fCola + 6, x: 1500, s: 0.9 },
    { f: fHoy, x: 1560, s: 0.9 },
  ], 4);
  const cardA = pop(frame, fHoy - 8, fps, 120, 16);
  const cardOut = ramp(frame, fY - 8, fY + 8, eIO);
  const cardB = pop(frame, fY - 2, fps, 120, 16);
  const cal = pop(frame, fEnero - 10, fps, 200, 13);
  const dim = ramp(frame, fHoy - 10, fHoy + 6, eIO);
  const noRes = pop(frame, fQuedan - 4, fps, 220, 13);
  const rA: Box = [340, 236, 900, 240];
  const rB: Box = [340, 236, 900, 240];
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${cam.s}) translateX(${960 - cam.x}px)`, transformOrigin: '960px 700px' }}>
        <Room wall={E.lilacPale} floor={E.violet} base={E.lilac} floorY={FLOOR}>
          <div style={{ position: 'absolute', left: 420, top: FLOOR - 340 }}><Plant size={240} pot={E.mustard} seed={4} /></div>
          {/* expositor de novedades */}
          <div style={{ position: 'absolute', left: 640, top: FLOOR - 300, width: 420, height: 300, transform: `scale(${0.9 + 0.1 * Math.min(1, shelf)})`, transformOrigin: '50% 100%', opacity: Math.min(1, shelf * 2) }}>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 200, background: E.plum, borderRadius: '10px 10px 0 0' }} />
            <div style={{ position: 'absolute', left: -12, right: -12, top: 86, height: 24, borderRadius: 8, background: E.pink }} />
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ position: 'absolute', left: 20 + i * 132, top: -40, transform: `rotate(${(i - 1) * 4}deg)` }}>
                <PlainCover w={120} title={['Novedad', 'Superventas', 'Premio'][i]} bg={[E.coral, E.mustard, E.pink][i]} accent={E.plum} />
                <div style={{ position: 'absolute', left: -8, top: 10, padding: '2px 10px', borderRadius: 6, background: E.ink, color: E.mustardLight, fontFamily: E.font, fontWeight: 700, fontSize: 18 }}>Nuevo</div>
              </div>
            ))}
            <div style={{ position: 'absolute', left: '50%', bottom: 60, transform: 'translateX(-50%)', fontFamily: E.font, fontWeight: 800, fontSize: 40, color: E.paper, whiteSpace: 'nowrap' }}>Novedades</div>
          </div>
          {/* la cola */}
          {Array.from({ length: 9 }, (_, k) => {
            const s = ramp(frame, 66 + k * 9, 100 + k * 9, eOut);
            if (s <= 0) return null;
            const x = 1090 + k * 128 + (1 - s) * 500;
            return (
              <div key={k} style={{ position: 'absolute', left: x, top: FLOOR - PS + 6, opacity: s }}>
                <Person look={LOOKS[(k + 1) % LOOKS.length]} size={PS} flip walk={s < 1 ? frame / 16 : 0} bob={Math.sin(frame * 0.06 + k) * 1.2} />
                <div style={{ position: 'absolute', left: 54, top: PS * 0.36, width: 42, height: 52, borderRadius: 4, background: E.paper, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: E.font, fontWeight: 800, fontSize: 24, color: E.coral, transform: 'rotate(-8deg)' }}>{k + 1}</div>
              </div>
            );
          })}
        </Room>
      </AbsoluteFill>
      {/* velo para leer las fichas */}
      {dim > 0 && <AbsoluteFill style={{ background: E.lilacPale, opacity: dim * 0.82 }} />}
      {/* ficha real: «Cien años de soledad» */}
      {cardA > 0.01 && cardOut < 1 && (
        <div style={{ position: 'absolute', left: 960, top: 380, transform: `translate(-50%, -50%) translateY(${(1 - Math.min(1, cardA)) * 600 - cardOut * 80}px) rotate(${(1 - Math.min(1, cardA)) * 6 - 1}deg)`, opacity: 1 - cardOut }}>
          <Crop name="rcien" r={rA} k={1.75} style={{ boxShadow: `14px 14px 0 ${E.plum}` }}>
            <Mark b={[983, 304, 222, 52]} at={fEnero - 14} pad={3} color={E.orange} />
          </Crop>
          <div style={{ position: 'absolute', left: 0, top: -58, padding: '8px 22px', borderRadius: 999, background: E.red, color: '#fff', fontFamily: E.font, fontWeight: 700, fontSize: 28 }}>eBiblio Madrid · hoy</div>
        </div>
      )}
      {cal > 0.01 && cardOut < 1 && (
        <div style={{ position: 'absolute', left: 1440, top: 640, width: 230, transform: `rotate(${6 + (1 - Math.min(1, cal)) * 25}deg) scale(${0.7 + 0.3 * Math.min(1.08, cal)})`, opacity: Math.min(1, cal * 2) * (1 - cardOut) }}>
          <div style={{ height: 64, borderRadius: '16px 16px 0 0', background: E.coral, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: E.font, fontWeight: 800, fontSize: 34, color: E.paper }}>ENERO</div>
          <div style={{ height: 150, borderRadius: '0 0 16px 16px', background: E.paper, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: E.font, boxShadow: `6px 6px 0 ${E.ink}` }}>
            <div style={{ fontWeight: 800, fontSize: 84, color: E.ink, lineHeight: 1 }}>7</div>
            <div style={{ fontWeight: 600, fontSize: 28, color: E.inkSoft }}>2027</div>
          </div>
        </div>
      )}
      {/* ficha real: «Sapiens» */}
      {cardB > 0.01 && (
        <div style={{ position: 'absolute', left: 960, top: 400, transform: `translate(-50%, -50%) translateY(${(1 - Math.min(1, cardB)) * 600}px) rotate(${(1 - Math.min(1, cardB)) * -6 + 1}deg)` }}>
          <Crop name="rsapiens" r={rB} k={1.75} style={{ boxShadow: `14px 14px 0 ${E.plum}` }}>
            <Mark b={[983, 306, 222, 56]} at={fQuedan - 10} pad={3} color={E.coral} />
          </Crop>
          <div style={{ position: 'absolute', left: 0, top: -58, padding: '8px 22px', borderRadius: 999, background: E.red, color: '#fff', fontFamily: E.font, fontWeight: 700, fontSize: 28 }}>eBiblio Madrid · hoy</div>
        </div>
      )}
      {noRes > 0.01 && (
        <div style={{ position: 'absolute', left: 960, top: 760, transform: `translateX(-50%) scale(${0.75 + 0.25 * Math.min(1.08, noRes)})`, opacity: Math.min(1, noRes * 2), display: 'flex', alignItems: 'center', gap: 22 }}>
          <div style={{ position: 'relative', width: 100, height: 112, borderRadius: '50% 50% 40% 40%', background: E.coral, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="60" height="60" viewBox="0 0 24 24"><path d="M6 6 L18 18 M18 6 L6 18" stroke={E.paper} strokeWidth="3.4" strokeLinecap="round" /></svg>
          </div>
          <div style={{ fontFamily: E.font, fontWeight: 800, fontSize: 52, color: E.ink }}>Ni siquiera hay turno</div>
        </div>
      )}
      <Sfx name="cardboard_pop" at={62} volume={0.5} />
      <Sfx name="crowd_soft" at={fNov - 20} volume={0.6} trimAfter={120} />
      <Sfx name="deep_whoosh" at={fCola - 10} volume={0.45} />
      <Sfx name="paper_slide" at={fHoy - 6} volume={0.6} />
      <Sfx name="draw" at={fEnero - 14} volume={0.5} />
      <Sfx name="calendar_flip" at={fEnero - 10} volume={0.6} trimAfter={30} />
      <Sfx name="paper_slide" at={fY} volume={0.6} />
      <Sfx name="fail" at={fQuedan - 2} volume={0.45} />
    </AbsoluteFill>
  );
};
