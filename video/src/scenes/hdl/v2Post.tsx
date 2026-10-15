import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { Butterfly, P, ramp, rampOut, sp, Stack } from './kit';
import { sceneClock } from './timeline';
import { Halo, Layer, mix, PaperFinish, Person, Pose, Rig, Sky, sitPose, Slate, useCamera, walkPose } from './theatre';
import { CREAM, PostOffice, Skyline, StreetLamp, WARM } from './sets';
import { HOUSE, House } from './house';
import { Gabo } from './v2Bio';
import { ShotStreet } from './v2Open';
import { PawnSlip } from './v2Mercedes';
import { AM_PTS, AmericasMap, useMapCam } from './Maps';

const INK = '#140D08';

// ————————————————————————————————————————————————————————————————
// Capítulo V · 82 pesos (v2)
// ————————————————————————————————————————————————————————————————

// Mesa con el manuscrito en primer plano (3D, de la v1) y rótulos mecanografiados que se clavan al lado.
const TypeTag: React.FC<{ text: string; x: number; y: number; a: number; rot?: number }> = ({ text, x, y, a, rot = 0 }) => {
  const frame = useCurrentFrame();
  const p = sp(frame, a, 13, 180);
  if (frame < a - 2) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg) scale(${0.8 + 0.2 * p})`, opacity: Math.min(1, p * 2), background: '#F4EAD5', padding: '16px 30px', boxShadow: '0 12px 24px rgba(0,0,0,0.45)', fontFamily: '"Special Elite", monospace', fontSize: 60, color: '#1D1A16', whiteSpace: 'nowrap' }}>{text}</div>
  );
};

// Mapa de papel (México → Buenos Aires) con los paquetes que viajan.
export const RouteMap: React.FC<{ t0: number; frame: number; riders: { at: number; dur: number; label: string; c?: string; flipAt?: number; flipTo?: string }[]; children?: React.ReactNode; zoomBA?: number }> = ({ t0, frame, riders, children, zoomBA = 0 }) => {
  const mx = AM_PTS.mexico, ba = AM_PTS.ba;
  const cam = useMapCam([
    { f: t0, cx: 700, cy: 760, s: 0.86 },
    { f: t0 + 400, cx: 720, cy: 780, s: 0.9 },
  ]);
  const s = cam.s * (1 + zoomBA * 1.6);
  const cx = cam.cx + (ba[0] - cam.cx) * zoomBA;
  const cy = cam.cy + (ba[1] - cam.cy) * zoomBA;
  const tf = `translate(${960 - cx * s}px, ${540 - cy * s}px) scale(${s})`;
  const toS = (p: [number, number]): [number, number] => [960 + (p[0] - cx) * s, 540 + (p[1] - cy) * s];
  const A = toS(mx), B = toS(ba);
  const ctrl: [number, number] = [(A[0] + B[0]) / 2 + 380, (A[1] + B[1]) / 2 - 120];
  const q = (t: number): [number, number] => [(1 - t) * (1 - t) * A[0] + 2 * (1 - t) * t * ctrl[0] + t * t * B[0], (1 - t) * (1 - t) * A[1] + 2 * (1 - t) * t * ctrl[1] + t * t * B[1]];
  const path = Array.from({ length: 61 }, (_, i) => q(i / 60)).map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  return (
    <AbsoluteFill style={{ background: '#D9CBB0' }}>
      <AmericasMap transform={tf} base="#EDE2C8" stroke="#B9A684" sea="#BFCBC8" fill={{ Mexico: '#E6CF9E', Argentina: '#E6CF9E' }} />
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
        <path d={path} stroke="#7A2E2A" strokeWidth={4} strokeDasharray="14 12" fill="none" opacity={0.7} />
        {[A, B].map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={9} fill="#7A2E2A" />)}
        <text x={A[0] + 18} y={A[1] - 14} fontFamily='"Caveat", cursive' fontWeight={700} fontSize={44} fill="#2A1A10">Ciudad de México</text>
        <text x={B[0] - 20} y={B[1] + 50} textAnchor="end" fontFamily='"Caveat", cursive' fontWeight={700} fontSize={44} fill="#2A1A10">Buenos Aires</text>
        {riders.map((r, i) => {
          const t = interpolate(frame, [r.at, r.at + r.dur], [0, 1], { ...clamp, easing: easeInOut });
          if (frame < r.at) return null;
          const [x, y] = q(t);
          const fl = r.flipAt !== undefined ? interpolate(frame, [r.flipAt, r.flipAt + 6, r.flipAt + 12], [1, 0, 1], clamp) : 1;
          const label = r.flipAt !== undefined && frame >= r.flipAt + 6 ? r.flipTo ?? r.label : r.label;
          const big = r.flipAt !== undefined && frame >= r.flipAt + 6 ? 1.6 : 1;
          return (
            <g key={i} transform={`translate(${x} ${y}) rotate(${-8 + t * 16}) scale(${big})`}>
              <rect x={-58} y={-30} width={116} height={60} rx={4} fill={r.c ?? '#B98A55'} stroke="#5A3A1E" strokeWidth={3} />
              <line x1={-58} x2={58} y1={0} y2={0} stroke="#5A3A1E" strokeWidth={3} />
              <g transform={`scale(${fl} 1)`}>
                <circle cx={0} cy={0} r={24} fill="#F4EAD5" stroke="#B5262B" strokeWidth={3} />
                {label ? <text y={8} textAnchor="middle" fontFamily='"Special Elite", monospace' fontSize={20} fill="#B5262B">{label}</text>
                  : <g stroke="#B5262B" strokeWidth={2} fill="none"><circle r={15} /><path d="M -12 -4 Q -6 -8 0 -4 T 12 -4 M -12 4 Q -6 0 0 4 T 12 4" /></g>}
              </g>
            </g>
          );
        })}
      </svg>
      {children}
      <PaperFinish opacity={0.4} vignette={0.5} still />
    </AbsoluteFill>
  );
};

// ——— CORREOS v2 · W18–W19 ———
export const Correos2: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('CORREOS');
  const fVol = c.at('W18', 'volvemos');
  const fOfi = c.at('W18', 'oficina');
  const fPaq = c.at('W18', 'paquete');
  const fQui = c.at('W18', 'quinientas');
  const fDob = c.at('W18', 'doble');
  const fPap = c.at('W18', 'papel');
  const fDir = c.at('W18', 'dirigido');
  const fFra = c.at('W18', 'Francisco');
  const fDirL = c.at('W18', 'director');
  const fEdi = c.at('W18', 'Editorial');
  const fBue = c.at('W18', 'Buenos');
  const fOch = c.at('W19', 'Ochenta');
  const fLle = c.at('W19', 'llega');
  const fPar = c.at('W19', 'Parten');
  const fMan = c.at('W19', 'mandan');
  const fMit = c.at('W19', 'mitad');
  const end = c.dur;
  const tPkg = fPaq - 10;
  const tLabel = fDir - 8;
  const tRecap = fOch - 6;
  const tMap = fPar - 4;
  let shot: React.ReactNode;
  if (frame < tPkg) shot = <ShotStreet tB={tPkg} fAgo={1e6} fOfi={fOfi} />;
  else if (frame < tLabel) shot = <PackageShot t0={tPkg} t1={tLabel} fQui={fQui} fDob={fDob} fPap={fPap} />;
  else if (frame < tRecap) shot = <LabelShot t0={tLabel} t1={tRecap} fFra={fFra} fDirL={fDirL} fEdi={fEdi} fBue={fBue} />;
  else if (frame < tMap) shot = <RecapShot t0={tRecap} t1={tMap} fOch={fOch} fLle={fLle} />;
  else shot = <RouteMap t0={tMap} frame={frame} riders={[{ at: fMan, dur: end - fMan + 30, label: '' }]} />;
  return (
    <AbsoluteFill style={{ background: '#05080B' }}>
      {shot}
      <AbsoluteFill style={{ background: '#FFC77A', opacity: interpolate(frame, [tPkg - 6, tPkg, tPkg + 10], [0, 0.6, 0], clamp) }} />
      <Sfx name="sk_wind" at={0} volume={0.2} dur={tPkg} fade={10} />
      <Sfx name="zoom_in" at={tPkg - 6} volume={0.5} />
      <Sfx name="page_riffle" at={fQui} volume={0.8} />
      <Sfx name="pencil_strike" at={fFra} volume={0.4} />
      <Sfx name="pencil_strike" at={fEdi} volume={0.4} />
      <Sfx name="pencil_strike" at={fBue} volume={0.4} />
      <Sfx name="hdl_register" at={fOch} volume={0.6} />
      <Sfx name="sk_heart" at={fLle} volume={0.4} />
      <Sfx name="hdl_split" at={fPar} volume={0.8} />
      <Sfx name="whoosh_soft" at={fMan + 4} volume={0.6} />
      {fVol + fMit < 0 && null}
    </AbsoluteFill>
  );
};

// el paquete de cerca: la pila de cuartillas, la página a doble espacio y el papel corriente
const PackageShot: React.FC<{ t0: number; t1: number; fQui: number; fDob: number; fPap: number }> = ({ t0, t1, fQui, fDob, fPap }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: t0, x: 960, y: 560, s: 1.15 }, { f: fDob, x: 1060, y: 520, s: 1.4 }, { f: t1, x: 1000, y: 540, s: 1.2 }], 0.5);
  const riffle = Math.floor(interpolate(frame, [fQui - 4, fQui + 40], [0, 590], clamp));
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#3D2615'], [100, '#1E120A']]} angle={170} glows={[{ x: 900, y: 360, r: 900, c: '#FFC27A', a: 0.42 }]} />
      <Layer z={1} html>
        <div style={{ position: 'absolute', left: 760, top: 760 }}>
          <Stack w={560} thick={170} x={0} y={0} shadowK={0.9} />
        </div>
        {/* hoja de arriba a doble espacio (se ve de cerca) */}
        <div style={{ position: 'absolute', left: 1130, top: 170, width: 560, height: 720, background: '#EFE6D0', transform: 'rotate(5deg)', boxShadow: '0 24px 50px rgba(0,0,0,0.45)', opacity: rampOut(frame, fDob - 10, fDob + 4) }}>
          {Array.from({ length: 12 }).map((_, i) => <div key={i} style={{ position: 'absolute', left: 60, top: 70 + i * 52, width: i === 11 ? 220 : 420 + random(`dl${i}`) * 30, height: 9, background: '#3A332B', opacity: 0.6 }} />)}
          {/* el papel corriente: fino, se transparenta */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(120,100,60,0.0), rgba(120,100,60,0.12))', opacity: rampOut(frame, fPap - 6, fPap + 10) }} />
        </div>
      </Layer>
      <PaperFinish opacity={0.45} vignette={0.62} warm={0.6} />
      <TypeTag text={`${riffle} cuartillas`} x={140} y={150} a={fQui - 4} rot={-3} />
      <TypeTag text="a doble espacio" x={170} y={300} a={fDob} rot={2} />
      <TypeTag text="en papel corriente" x={150} y={450} a={fPap} rot={-2} />
    </Rig>
  );
};

// la etiqueta del paquete, escrita a mano
const LabelShot: React.FC<{ t0: number; t1: number; fFra: number; fDirL: number; fEdi: number; fBue: number }> = ({ t0, t1, fFra, fDirL, fEdi, fBue }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: t0, x: 960, y: 560, s: 1.06 }, { f: t1, x: 980, y: 580, s: 1.16 }], 0.5);
  const lines: [string, number, number][] = [['Sr. Francisco Porrúa', fFra - 4, 64], ['Director literario', fDirL - 4, 46], ['Editorial Sudamericana', fEdi - 4, 56], ['Buenos Aires · Argentina', fBue - 4, 56]];
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#C49A66'], [100, '#8A6238']]} glows={[{ x: 900, y: 360, r: 900, c: '#FFE0A8', a: 0.4 }]} />
      <Layer z={1} html>
        {/* papel de estraza y cordel */}
        <AbsoluteFill style={{ background: 'repeating-linear-gradient(80deg, rgba(90,58,30,0.06) 0 3px, transparent 3px 9px)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 120, height: 12, background: '#5A3A1E', transform: 'rotate(-3deg)' }} />
        <div style={{ position: 'absolute', left: 200, top: 0, bottom: 0, width: 12, background: '#5A3A1E', transform: 'rotate(4deg)' }} />
        <div style={{ position: 'absolute', left: 420, top: 220, width: 1100, height: 600, background: '#F4EAD5', transform: 'rotate(-2deg)', boxShadow: '0 24px 50px rgba(40,20,5,0.45)', padding: '50px 70px' }}>
          <div style={{ fontFamily: '"Special Elite", monospace', fontSize: 26, letterSpacing: 4, color: '#7A2E2A' }}>DESTINATARIO</div>
          {lines.map(([t, a, size], i) => {
            const p = interpolate(frame, [a, a + 22], [0, 1], clamp);
            return <div key={i} style={{ fontFamily: '"Homemade Apple", cursive', fontSize: size, color: '#22324A', marginTop: i ? 18 : 30, wordSpacing: size * 0.35, clipPath: `inset(-30% ${(1 - p) * 100}% -30% -2%)`, whiteSpace: 'nowrap' }}>{t}</div>;
          })}
        </div>
      </Layer>
      <PaperFinish opacity={0.45} vignette={0.55} warm={0.4} />
    </Rig>
  );
};

// déjà vu: el recibo de 82 pesos y las monedas que no llegan (más rápido que en el gancho)
const RecapShot: React.FC<{ t0: number; t1: number; fOch: number; fLle: number }> = ({ t0, t1, fOch, fLle }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: t0, x: 960, y: 540, s: 1.18 }, { f: t1, x: 960, y: 560, s: 1.32 }], 0.4);
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#3D2615'], [100, '#24150B']]} angle={170} glows={[{ x: 900, y: 380, r: 1000, c: '#FFC27A', a: 0.38 }]} />
      <Layer z={1} html>
        <div style={{ position: 'absolute', left: 560, top: 240, width: 800, height: 470, transform: 'rotate(-3deg)', background: '#EFE3C8', boxShadow: '0 30px 60px rgba(20,10,4,0.55)' }}>
          <div style={{ position: 'absolute', left: 50, top: 36, fontFamily: '"EB Garamond", serif', fontWeight: 700, fontSize: 40, letterSpacing: 14, color: '#5A2A22' }}>FRANQUEO</div>
          <div style={{ position: 'absolute', left: 230, top: 120, fontFamily: '"Caveat", cursive', fontWeight: 700, fontSize: 170, color: '#3B3A44', opacity: rampOut(frame, fOch - 6, fOch + 4) }}>$ 82.00</div>
        </div>
        {/* sello rojo «insuficiente» de la idea, sin texto inventado: una raya que tacha */}
        <div style={{ position: 'absolute', left: 640, top: 600, width: 640 * ramp(frame, fLle - 4, fLle + 8), height: 14, background: '#B5262B', transform: 'rotate(-8deg)', borderRadius: 7, opacity: 0.85 }} />
      </Layer>
      <PaperFinish opacity={0.45} vignette={0.6} warm={0.6} />
    </Rig>
  );
};

// ——— EMPENO v2 · W20 ———
// Ella recorre la casa: la estufa del estudio (él se queda helado: le sale vaho), su secador del baño, la batidora de la
// cocina. Donde estaba cada cosa queda su silueta en blanco. Con eso, la otra mitad del paquete sale hacia Buenos Aires.
export const Empeno2: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('EMPENO');
  const fVue = c.at('W20', 'Vuelven');
  const fMer = c.at('W20', 'Mercedes');
  const fCal = c.at('W20', 'calentador');
  const fAgu = c.at('W20', 'aguantaba');
  const fFri = c.at('W20', 'frío');
  const fSec = c.at('W20', 'secador');
  const fBat = c.at('W20', 'batidora');
  const fCon = c.at('W20', 'Con');
  const fEnv = c.at('W20', 'envían');
  const end = c.dur;
  const tMap = fEnv - 10;
  const S = HOUSE.study, B = HOUSE.bath, K = HOUSE.kitchen;
  const cam = useCamera([
    { f: 0, x: 960, y: 640, s: 0.92 },
    { f: fCal - 16, x: (S.x0 + S.x1) / 2, y: (S.y0 + S.y1) / 2, s: 3.6 },
    { f: fFri + 10, x: (S.x0 + S.x1) / 2, y: (S.y0 + S.y1) / 2, s: 3.8 },
    { f: fSec - 8, x: (B.x0 + B.x1) / 2, y: (B.y0 + B.y1) / 2, s: 4.2 },
    { f: fBat - 8, x: K.x1 - 220, y: (K.y0 + K.y1) / 2, s: 3.6 },
    { f: fCon, x: 960, y: 640, s: 0.92 },
    { f: tMap, x: 960, y: 640, s: 0.9 },
  ], 0.6);
  const heater = 1 - ramp(frame, fCal + 4, fCal + 18);
  const dryer = 1 - ramp(frame, fSec + 4, fSec + 14);
  const blender = 1 - ramp(frame, fBat + 4, fBat + 14);
  const cold = ramp(frame, fCal + 18, fAgu);
  const shiver = Math.sin(frame * 2.3) * 1.6 * cold;
  // ella va de habitación en habitación
  const mPos = frame < fSec - 12 ? [350, 652] : frame < fBat - 12 ? [1420, 652] : [1520, 958];
  const mFace: 1 | -1 = 1;
  return (
    <AbsoluteFill style={{ background: '#05080B' }}>
      {frame < tMap ? (
        <Rig cam={cam}>
          <Sky stops={[[0, '#0D1826'], [55, '#1C2E41'], [100, '#3A3F48']]} />
          <Layer z={1}>
            <House ink={INK} frame={frame} items={{ car: 0, tv: 0, jewels: 0, heater, dryer, blender }} lights={{ study: 1 - 0.3 * cold, kids: 0.3, bath: 0.6, living: 0.5, kitchen: 0.8 }} />
            {/* siluetas en blanco donde estaban las cosas */}
            <rect x={389} y={556} width={42} height={52} rx={6} fill="none" stroke="#F4EAD5" strokeWidth={2} strokeDasharray="5 4" opacity={1 - heater} />
            <rect x={1432} y={510} width={50} height={26} rx={10} fill="none" stroke="#F4EAD5" strokeWidth={2} strokeDasharray="5 4" opacity={1 - dryer} />
            <rect x={1562} y={758} width={36} height={82} rx={4} fill="none" stroke="#F4EAD5" strokeWidth={2} strokeDasharray="5 4" opacity={1 - blender} />
            {/* escarcha en la ventana del estudio */}
            <rect x={300} y={384} width={96} height={116} fill="#DDEFF5" opacity={0.35 * cold} />
            <g transform={`translate(${shiver} 0)`}>
              <Gabo frame={frame} pose={cold > 0.5 ? sitPose({ lean: 14, neck: 10, shF: 40, elF: 120, shB: 34, elB: 120 }) : undefined} />
            </g>
            {/* vaho */}
            {cold > 0.3 && [0, 1, 2].map((i) => {
              const t = ((frame / 30 + i / 3) % 1);
              return <circle key={i} cx={548 + t * 30} cy={470 - t * 26} r={4 + t * 10} fill="#F4F8FA" opacity={(1 - t) * 0.5 * cold} />;
            })}
            <Person x={mPos[0]} y={mPos[1]} scale={1.12} face={mFace} kind="woman" hair="bob" pose={{ shF: 30, elF: 60, shB: 20, elB: 50 }} c={INK} back="#2A1C12" />
          </Layer>
          <PaperFinish opacity={0.5} vignette={0.6} warm={0.5} />
        </Rig>
      ) : (
        <RouteMap t0={tMap} frame={frame} riders={[{ at: tMap - 200, dur: 400, label: '' }, { at: fEnv, dur: end - fEnv + 60, label: '', c: '#C49A66' }]} />
      )}
      {/* las papeletas */}
      {frame < tMap && (
        <>
          <PawnSlip x={1450} y={620} at={fCal + 14} num="1342" label="Calentador" rot={-6} frame={frame} scale={0.8} />
          <PawnSlip x={1490} y={690} at={fSec + 12} num="1343" label="Secador" rot={4} frame={frame} scale={0.8} />
          <PawnSlip x={1460} y={760} at={fBat + 12} num="1344" label="Batidora" rot={-3} frame={frame} scale={0.8} />
        </>
      )}
      <Sfx name="sk_door" at={fVue + 4} volume={0.5} />
      <Sfx name="hdl_pawn" at={fCal + 10} volume={0.6} />
      <Sfx name="sk_wind" at={fCal + 18} volume={0.35} dur={fFri - fCal + 20} fade={14} />
      <Sfx name="hdl_dryer" at={fSec - 6} volume={0.8} />
      <Sfx name="hdl_blender" at={fBat - 6} volume={0.8} />
      <Sfx name="stamp" at={fCal + 26} volume={0.6} />
      <Sfx name="stamp" at={fSec + 24} volume={0.6} />
      <Sfx name="stamp" at={fBat + 24} volume={0.6} />
      <Sfx name="coins" at={fCon + 4} volume={0.6} />
      <Sfx name="whoosh_soft" at={fEnv} volume={0.6} />
      {fMer < 0 && null}
    </AbsoluteFill>
  );
};

// ——— FRASE v2 · W21 ———
// Salen de correos de noche, bajo la farola. Ella se vuelve hacia él… y la frase.
export const Frase2: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('FRASE');
  const fSal = c.at('W21', 'salir');
  const fFra = c.at('W21', 'frase');
  const fAho = c.at('W21', 'Ahora');
  const end = c.dur;
  const cam = useCamera([{ f: 0, x: 900, y: 700, s: 1.35 }, { f: fAho - 10, x: 760, y: 680, s: 1.6 }, { f: end, x: 760, y: 660, s: 1.7 }], 0.5);
  const walk = ramp(frame, 0, fFra, (t) => t);
  const hx = interpolate(walk, [0, 1], [980, 700]);
  const turn = ramp(frame, fFra - 4, fFra + 6);
  const words = '«Ahora lo único que falta es que esta novela sea mala».'.split(' ');
  return (
    <AbsoluteFill>
      <Rig cam={cam}>
        <Sky stops={[[0, '#08111B'], [55, '#13253A'], [100, '#2A3A48']]} glows={[{ x: 520, y: 520, r: 700, c: '#FFD58A', a: 0.25 }]} />
        <Layer z={0.28}><Skyline y={880} c="#162533" frame={frame} seed="mx" tower={1660} /></Layer>
        <Layer z={0.6}>
          <PostOffice c="#0F1820" frame={frame} />
          <rect x={-400} y={872} width={2720} height={400} fill="#0A1117" />
        </Layer>
        <Layer z={1}>
          <rect x={-600} y={958} width={3120} height={300} fill="#070C10" />
          <StreetLamp x={560} y={960} c="#060A0D" h={620} />
          <Person x={hx} y={960} scale={1.8} face={-1} kind="man" hair="curly" mustache pose={walk < 1 ? walkPose(hx / 20, 0.8) : { shF: 4, elF: 10, neck: 2 }} c="#05080B" back="#0E151C" />
          <Person x={hx - 150} y={960} scale={1.72} face={turn > 0.5 ? 1 : -1} kind="woman" hair="bob" pose={walk < 1 ? walkPose(hx / 20 + 1, 0.8) : { shF: 14, elF: 30, neck: -4, shB: 4 }} c="#05080B" back="#0E151C" />
        </Layer>
        <AbsoluteFill style={{ background: 'rgba(5,8,11,0.55)', opacity: ramp(frame, fAho - 14, fAho) }} />
      </Rig>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', padding: '0 220px' }}>
        <div style={{ fontFamily: '"EB Garamond", serif', fontStyle: 'italic', fontWeight: 500, fontSize: 96, lineHeight: 1.15, color: '#F6EFE2', textAlign: 'center', textShadow: '0 8px 40px rgba(0,0,0,0.8)' }}>
          {words.map((w, i) => {
            const p = rampOut(frame, fAho + i * 6, fAho + i * 6 + 16);
            return <span key={i} style={{ display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * 20}px)`, whiteSpace: 'pre' }}>{w}{i < words.length - 1 ? ' ' : ''}</span>;
          })}
        </div>
        <div style={{ marginTop: 34, fontFamily: '"Ubuntu", sans-serif', fontWeight: 500, fontSize: 36, color: 'rgba(246,239,226,0.7)', opacity: rampOut(frame, fAho + 70, fAho + 86) }}>— Mercedes Barcha, según contó García Márquez</div>
      </AbsoluteFill>
      <PaperFinish opacity={0.45} vignette={0.6} />
      <Sfx name="sk_door" at={2} volume={0.4} />
      <Sfx name="sk_wind" at={0} volume={0.2} dur={end} fade={20} />
    </AbsoluteFill>
  );
};

// ——— GIRO v2 · W22 ———
// En el mapa, los dos paquetes llegan al revés: primero el «2/2». En Buenos Aires, Porrúa con el final en las manos,
// mirando el reloj y la calle, esperando el principio.
export const Giro2: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('GIRO');
  const fGir = c.at('W22', 'giro');
  const fSin = c.at('W22', 'sin');
  const fPri = c.at('W22', 'primero');
  const fSeg = c.at('W22', 'segunda');
  const fEn = c.at('W22', 'En');
  const fPor = c.at('W22', 'Porrúa');
  const fMan = c.at('W22', 'manos');
  const fFin = c.at('W22', 'final');
  const fEsp = c.at('W22', 'esperaba');
  const fPrin = c.at('W22', 'principio');
  const end = c.dur;
  const tBA = fEn - 8;
  return (
    <AbsoluteFill>
      {frame < tBA ? (
        <RouteMap t0={0} frame={frame} zoomBA={ramp(frame, fSeg + 10, tBA)} riders={[{ at: -300, dur: fPri + 300, label: '', flipAt: fSeg - 6, flipTo: '2/2' }, { at: fSin - 200, dur: 560, label: '', c: '#C49A66', flipAt: fSeg + 8, flipTo: '1/2' }]}>
          <div style={{ position: 'absolute', left: 120, top: 100, fontFamily: '"Caveat", cursive', fontWeight: 700, fontSize: 92, color: '#B5262B', transform: 'rotate(-3deg)', opacity: rampOut(frame, fSeg - 4, fSeg + 10) }}>¡la segunda mitad llega primero!</div>
        </RouteMap>
      ) : (
        <PorruaWaiting t0={tBA} end={end} fPor={fPor} fMan={fMan} fFin={fFin} fEsp={fEsp} fPrin={fPrin} />
      )}
      <Sfx name="reverse_swell" at={fGir - 30} volume={0.4} />
      <Sfx name="hdl_mail" at={fPri} volume={0.7} />
      <Sfx name="whoosh_soft" at={tBA} volume={0.5} />
      <Sfx name="sk_clock" at={fEsp - 6} volume={0.6} />
      <Sfx name="sk_clock" at={fEsp + 80} volume={0.5} />
    </AbsoluteFill>
  );
};

// La oficina de la Editorial Sudamericana en Buenos Aires: Porrúa (gafas) con el final del manuscrito; el reloj; la calle.
export const BAOffice: React.FC<{ frame: number; children?: React.ReactNode; lamp?: number }> = ({ frame, children, lamp = 1 }) => (
  <>
    <Sky stops={[[0, '#2C3A44'], [60, '#46525A'], [100, '#2A2E33']]} glows={[{ x: 760, y: 360, r: 800, c: '#FFE6B0', a: 0.3 * lamp }]} />
    <Layer z={0.45}>
      {/* ventanal con la calle de Buenos Aires (obelisco al fondo) */}
      <rect x={1180} y={180} width={560} height={560} fill="#A9BCC4" />
      <path d="M 1470 740 L 1470 320 L 1480 290 L 1490 320 L 1490 740 Z" fill="#7B8E96" />
      {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={1180 + i * 72} y={560 - random(`ba${i}`) * 160} width={66} height={300} fill="#8A9CA4" />)}
      <rect x={1180} y={176} width={560} height={14} fill="#15181C" />
      <rect x={1180} y={736} width={560} height={14} fill="#15181C" />
      <rect x={1452} y={180} width={10} height={560} fill="#15181C" />
      <rect x={1180} y={450} width={560} height={10} fill="#15181C" />
      {/* estantería con manuscritos */}
      <rect x={140} y={250} width={340} height={8} fill="#15181C" />
      <rect x={140} y={400} width={340} height={8} fill="#15181C" />
      {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={146 + i * 24} y={250 - 50 - random(`bs${i}`) * 30} width={20} height={50 + random(`bs${i}`) * 30} fill="#15181C" />)}
      {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={150 + i * 54} y={360} width={46} height={40} fill="#D9CBB0" opacity={0.7} />)}
      <rect x={-200} y={760} width={2400} height={400} fill="#1C2024" />
    </Layer>
    <Layer z={1}>{children}</Layer>
  </>
);

const PorruaWaiting: React.FC<{ t0: number; end: number; fPor: number; fMan: number; fFin: number; fEsp: number; fPrin: number }> = ({ t0, end, fPor, fMan, fFin, fEsp, fPrin }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: t0, x: 900, y: 600, s: 1.15 }, { f: fFin, x: 760, y: 620, s: 1.45 }, { f: fEsp, x: 1000, y: 560, s: 1.2 }, { f: end, x: 1100, y: 540, s: 1.25 }], 0.6);
  const toWindow = ramp(frame, fEsp - 4, fPrin);
  const px = interpolate(toWindow, [0, 1], [700, 1240]);
  const tap = Math.abs(Math.sin(frame / 4));
  const pose: Pose = toWindow > 0 && toWindow < 1 ? walkPose(px / 22, 0.9) : toWindow >= 1 ? { lean: 2, shF: 10, elF: 20, shB: 20, elB: 120, neck: -4 } : sitPose({ lean: 10, neck: 14, shF: 50, elF: 50, shB: 44, elB: 50 });
  return (
    <Rig cam={cam}>
      <BAOffice frame={frame}>
        {/* mesa con el paquete 2/2 abierto */}
        <rect x={520} y={640} width={420} height={14} fill="#15181C" />
        <rect x={540} y={654} width={12} height={110} fill="#15181C" />
        <rect x={908} y={654} width={12} height={110} fill="#15181C" />
        <rect x={720} y={612} width={150} height={28} fill={CREAM} />
        <rect x={700} y={628} width={190} height={12} fill="#B98A55" />
        {/* silla */}
        <rect x={556} y={644} width={116} height={12} fill="#15181C" />
        <rect x={560} y={656} width={10} height={106} fill="#15181C" />
        <rect x={658} y={656} width={10} height={106} fill="#15181C" />
        <rect x={552} y={520} width={12} height={136} fill="#15181C" />
        {toWindow <= 0 && <Person x={630} y={808} scale={1.85} kind="man" hair="side" glasses pose={pose} c="#101317" back="#2A2F35"
          front={<rect x={-4} y={-40} width={8} height={44} fill={CREAM} />} />}
        {toWindow > 0 && <Person x={px} y={760} scale={1.85} kind="man" hair="side" glasses pose={pose} c="#101317" back="#2A2F35" />}
        {/* reloj de pared */}
        <g transform="translate(980 260)">
          <circle r={64} fill="#15181C" />
          <circle r={54} fill="#E9DCC0" />
          <line x1={0} y1={0} x2={0} y2={-34} stroke="#15181C" strokeWidth={6} strokeLinecap="round" transform={`rotate(${frame * 0.5})`} />
          <line x1={0} y1={0} x2={0} y2={-46} stroke="#15181C" strokeWidth={3} strokeLinecap="round" transform={`rotate(${frame * 6})`} />
        </g>
        {/* dedos que tamborilean en la mesa */}
        {toWindow <= 0 && frame > fFin && <circle cx={760} cy={636 - tap * 6} r={5} fill="#101317" />}
      </BAOffice>
      <PaperFinish opacity={0.45} vignette={0.6} />
      <Slate text="Buenos Aires · Editorial Sudamericana" a={fPor - 20} b={fPor + 30} out={fEsp - 10} x={110} y={940} />
      <TypeTagFixed text="2/2 · el final" x={1300} y={200} a={fFin} out={fEsp} />
      {fMan < 0 && null}
    </Rig>
  );
};

const TypeTagFixed: React.FC<{ text: string; x: number; y: number; a: number; out: number }> = ({ text, x, y, a, out }) => {
  const frame = useCurrentFrame();
  const o = rampOut(frame, a, a + 10) * (1 - ramp(frame, out, out + 10));
  if (o <= 0) return null;
  return <div style={{ position: 'absolute', left: x, top: y, opacity: o, background: '#F4EAD5', padding: '10px 20px', fontFamily: '"Special Elite", monospace', fontSize: 38, color: '#B5262B', transform: 'rotate(3deg)', boxShadow: '0 10px 20px rgba(0,0,0,0.4)' }}>{text}</div>;
};

export const _p = { Halo, mix, Butterfly, P, WARM, easeInOut, easeOut };
