import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Keystrokes, Sfx } from '../../components/Sfx';
import { Butterfly, P, ramp, rampOut, sp, typeTimes } from './kit';
import { sceneClock } from './timeline';
import { Halo, Hand, Layer, mix, PaperFinish, Person, Pose, Rig, Sky, sitPose, Slate, useCamera, walkPose } from './theatre';
import { Car60, CREAM, WARM } from './sets';
import { HOUSE, House, TV60 } from './house';
import { frameRoom, Gabo, typingPose } from './v2Bio';
import { TypewriterCloseup } from './typewriter';

const INK = '#140D08';

// ————————————————————————————————————————————————————————————————
// Capítulo IV · Mercedes (v2)
// ————————————————————————————————————————————————————————————————

// Papeleta de empeño (papel crema): número, objeto y sello.
export const PawnSlip: React.FC<{ x: number; y: number; at: number; num: string; label: string; rot?: number; frame: number; scale?: number }> = ({ x, y, at, num, label, rot = 0, frame, scale = 1 }) => {
  const p = sp(frame, at, 13, 170);
  if (frame < at - 2) return null;
  const stamp = interpolate(frame, [at + 12, at + 16, at + 20], [2, 1, 1], clamp);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 380, transform: `translateY(${(1 - p) * -120}px) rotate(${rot}deg) scale(${scale})`, opacity: Math.min(1, p * 2), transformOrigin: '0 0' }}>
      <div style={{ background: '#F2E6C8', padding: '22px 26px 26px', boxShadow: '0 20px 34px rgba(20,10,4,0.5)', borderTop: '6px solid #7A2E2A', position: 'relative' }}>
        <div style={{ fontFamily: '"Special Elite", monospace', fontSize: 20, letterSpacing: 3, color: '#7A2E2A' }}>MONTE DE PIEDAD</div>
        <div style={{ fontFamily: '"Special Elite", monospace', fontSize: 18, color: '#5A4632', marginTop: 4 }}>PAPELETA Nº {num}</div>
        <div style={{ height: 1.5, background: '#7A2E2A', opacity: 0.4, margin: '12px 0' }} />
        <div style={{ fontFamily: '"Caveat", cursive', fontWeight: 700, fontSize: 58, color: '#2A2620', lineHeight: 1 }}>{label}</div>
        {frame >= at + 12 && (
          <div style={{ position: 'absolute', right: 18, bottom: 16, transform: `rotate(-14deg) scale(${stamp})`, border: '4px solid #B5262B', color: '#B5262B', fontFamily: '"Special Elite", monospace', fontSize: 22, padding: '4px 10px', letterSpacing: 2, opacity: 0.85 }}>EMPEÑADO</div>
        )}
      </div>
    </div>
  );
};

// Fachada del Monte de Piedad (silueta con portón iluminado).
export const PawnShop: React.FC<{ x: number; y: number; c: string; frame: number }> = ({ x, y, c }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-420} y={-560} width={840} height={560} fill={c} />
    <rect x={-440} y={-580} width={880} height={30} fill={c} />
    {[-300, -150, 150, 300].map((wx, i) => (
      <g key={i}>
        <path d={`M ${wx - 50} -330 L ${wx - 50} -440 A 50 50 0 0 1 ${wx + 50} -440 L ${wx + 50} -330 Z`} fill="#E8B46A" opacity={0.85} />
        <path d={`M ${wx} -490 L ${wx} -330 M ${wx - 50} -400 L ${wx + 50} -400`} stroke={c} strokeWidth={5} />
      </g>
    ))}
    <path d="M -110 0 L -110 -250 A 110 110 0 0 1 110 -250 L 110 0 Z" fill="#F2C47A" />
    <path d="M -110 0 L -110 -250 A 110 110 0 0 1 110 -250 L 110 0" stroke={mix(c, '#000', 0.3)} strokeWidth={16} fill="none" />
    <rect x={-250} y={-540} width={500} height={62} fill={mix(c, '#000', 0.25)} />
    <text x={0} y={-497} textAnchor="middle" fontFamily='"EB Garamond", serif' fontWeight={700} fontSize={38} letterSpacing={10} fill={WARM}>MONTE DE PIEDAD</text>
  </g>
);

// ——— MERCEDES v2 · W14–W15 ———
export const Mercedes2: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('MERCEDES');
  const fAlg = c.at('W14', 'alguien');
  const fMan = c.at('W14', 'mantener');
  const fPie = c.at('W14', 'pie');
  const fY = c.at('W14', 'Y');
  const fVer = c.at('W14', 'verdadera');
  const fMer = c.at('W14', 'Mercedes');
  const fPri = c.at('W15', 'Primero');
  const fEmp = c.at('W15', 'empeñan');
  const fCoche = c.at('W15', 'coche');
  const fDur = c.at('W15', 'dura');
  const fSeis = c.at('W15', 'seis');
  const fDes = c.at('W15', 'Después');
  const fJoy = c.at('W15', 'joyas');
  const fFam = c.at('W15', 'familia');
  const fLue = c.at('W15', 'Luego');
  const fTel = c.at('W15', 'televisor');
  const end = c.dur;
  const tCameo = fMer - 34;
  const tCar = fPri - 8;
  const tJew = fDes - 6;
  const tTV = fLue - 8;
  let shot: React.ReactNode;
  if (frame < tCameo) shot = <HoldShot t1={tCameo} fAlg={fAlg} fMan={fMan} fPie={fPie} fY={fY} fVer={fVer} />;
  else if (frame < tCar) shot = <Cameo t0={tCameo} t1={tCar} fMer={fMer} />;
  else if (frame < tJew) shot = <CarPawn t0={tCar} t1={tJew} fEmp={fEmp} fCoche={fCoche} fDur={fDur} fSeis={fSeis} />;
  else if (frame < tTV) shot = <JewelShot t0={tJew} t1={tTV} fJoy={fJoy} fFam={fFam} />;
  else shot = <TVShot t0={tTV} end={end} fTel={fTel} />;
  return (
    <AbsoluteFill style={{ background: '#05080B' }}>
      {shot}
      {/* las papeletas se van quedando en una esquina, como una colección */}
      <PawnSlip x={1440} y={640} at={fCoche + 10} num="1147" label="Coche" rot={-6} frame={frame} scale={frame > tJew ? 0.6 : 1} />
      <PawnSlip x={1500} y={700} at={fJoy + 14} num="1203" label="Joyas" rot={4} frame={frame} scale={frame > tTV ? 0.6 : 1} />
      <PawnSlip x={1450} y={770} at={fTel + 10} num="1288" label="Televisor" rot={-3} frame={frame} />
      <Sfx name="sk_door" at={fMan} volume={0.35} />
      <Sfx name="hit_soft" at={fPie} volume={0.6} />
      <Sfx name="hdl_paper_whoosh" at={fY} volume={0.45} />
      <Sfx name="sparkle" at={fMer} volume={0.6} />
      <Sfx name="hdl_flutter" at={fMer + 10} volume={0.6} />
      <Sfx name="hdl_car" at={tCar} volume={0.4} dur={70} fade={20} />
      <Sfx name="hdl_pawn" at={fCoche + 10} volume={0.9} />
      <Sfx name="stamp" at={fCoche + 22} volume={0.8} />
      <Sfx name="page_riffle" at={fDur} volume={0.4} />
      <Sfx name="hdl_pawn" at={fJoy + 12} volume={0.9} />
      <Sfx name="stamp" at={fJoy + 26} volume={0.8} />
      <Sfx name="hdl_tv" at={fTel - 10} volume={0.7} />
      <Sfx name="stamp" at={fTel + 22} volume={0.8} />
    </AbsoluteFill>
  );
};

// la casa en corte: «mantener la casa en pie» — la casa se ladea y ella la sostiene; luego el foco sobre ella
const HoldShot: React.FC<{ t1: number; fAlg: number; fMan: number; fPie: number; fY: number; fVer: number }> = ({ t1, fAlg, fMan, fPie, fY, fVer }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: 0, x: 960, y: 620, s: 0.9 }, { f: fY, x: 980, y: 640, s: 0.95 }, { f: t1, x: 1150, y: 780, s: 1.7 }], 0.6);
  const tilt = interpolate(frame, [fAlg, fMan + 10, fPie, fPie + 16], [0, 2.4, 2.4, 0], { ...clamp, easing: easeInOut });
  const walk = ramp(frame, fAlg - 10, fMan + 10);
  const mx = interpolate(walk, [0, 1], [1260, 960]);
  const push = ramp(frame, fMan + 8, fPie);
  const spot = ramp(frame, fY - 4, fVer);
  const pose: Pose = walk < 1 ? walkPose(mx / 18) : { lean: 18 * push, shF: 80 * push, elF: 20, shB: 70 * push, elB: 30, hipF: 20 * push, hipB: -20 * push, knF: 6, knB: 4 };
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#0D1826'], [55, '#1C2E41'], [100, '#3A3F48']]} />
      <Layer z={1}>
        <g transform={`rotate(${tilt} 260 980)`}>
          <House ink={INK} frame={frame} lights={{ study: 1, kids: 0.7 * (1 - spot), bath: 0.4 * (1 - spot), living: 0.7 * (1 - spot), kitchen: 0.75 + 0.25 * spot }} />
          <Gabo frame={frame} />
          <Person x={880} y={612} scale={1.02} kind="boy" hair="kid" pose={{ shF: 20, elF: 30 }} c={INK} />
          <Person x={1010} y={612} scale={0.92} face={-1} kind="boy" hair="kid" pose={{ shF: 30, elF: 50 }} c={INK} />
        </g>
        <Person x={mx} y={958} scale={1.12} face={-1} kind="woman" hair="bob" pose={pose} c={INK} back="#2A1C12" />
        {/* foco sobre ella */}
        <g opacity={spot}>
          <path d={`M ${mx - 40} 660 L ${mx + 40} 660 L ${mx + 170} 960 L ${mx - 170} 960 Z`} fill="#FFE6B0" opacity={0.25} />
          <rect x={-400} y={-200} width={2800} height={1500} fill="#000" opacity={0.35} />
        </g>
        <Person x={mx} y={958} scale={1.12} face={-1} kind="woman" hair="bob" pose={pose} c={INK} />
      </Layer>
      <PaperFinish opacity={0.5} vignette={0.6} warm={0.5} />
    </Rig>
  );
};

// Camafeo: su perfil recortado en un óvalo, como los retratos de siluetas, y su nombre.
const Cameo: React.FC<{ t0: number; t1: number; fMer: number }> = ({ t0, t1, fMer }) => {
  const frame = useCurrentFrame();
  const p = sp(frame, t0 + 4, 16, 120);
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, #3A2A1E 0%, #140D08 70%)' }}>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <div style={{ transform: `scale(${0.85 + 0.15 * p})`, opacity: Math.min(1, p * 2) }}>
          <svg width={560} height={680} viewBox="-280 -340 560 680">
            <ellipse cx={0} cy={0} rx={250} ry={310} fill="#E9D3A8" />
            <ellipse cx={0} cy={0} rx={250} ry={310} fill="none" stroke="#C9A256" strokeWidth={14} />
            <ellipse cx={0} cy={0} rx={226} ry={286} fill="none" stroke="#C9A256" strokeWidth={3} />
            <defs><clipPath id="cameo"><ellipse cx={0} cy={0} rx={226} ry={286} /></clipPath></defs>
            <g clipPath="url(#cameo)">
              <g transform="translate(-40 1000) scale(6.6)">
                <Person x={0} y={0} scale={1} kind="woman" hair="bob" pose={{ shF: -4, shB: 4, neck: -2 }} c="#1D140E" />
              </g>
            </g>
          </svg>
        </div>
        <div style={{ fontFamily: '"EB Garamond", serif', fontWeight: 600, fontSize: 96, color: '#F6EFE2', marginTop: 10, opacity: rampOut(frame, fMer - 4, fMer + 14), letterSpacing: -1 }}>Mercedes Barcha</div>
      </AbsoluteFill>
      {[0, 1, 2, 3].map((i) => <Butterfly key={i} x={620 + i * 230 + Math.sin(frame / 14 + i) * 40} y={200 + (i % 2) * 520 + Math.cos(frame / 11 + i) * 30} size={50} seed={`cm${i}`} glow={0.7} opacity={ramp(frame, t0 + 10 + i * 6, t0 + 24 + i * 6)} />)}
      <PaperFinish opacity={0.4} vignette={0.6} />
      {t1 < 0 && null}
    </AbsoluteFill>
  );
};

// el coche se va al Monte de Piedad; el dinero (billetes) dura seis meses
const CarPawn: React.FC<{ t0: number; t1: number; fEmp: number; fCoche: number; fDur: number; fSeis: number }> = ({ t0, t1, fEmp, fCoche, fDur, fSeis }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: t0, x: 900, y: 640, s: 1.0 }, { f: fCoche + 10, x: 1040, y: 680, s: 1.15 }, { f: t1, x: 980, y: 640, s: 1.05 }], 0.6);
  const carX = interpolate(frame, [t0, fCoche + 6], [-300, 1180], { ...clamp, easing: easeOut });
  const into = ramp(frame, fCoche + 6, fCoche + 24);
  const months = Math.min(6, Math.max(0, Math.floor(interpolate(frame, [fDur, fSeis + 20], [0, 6.99], clamp))));
  const cash = 1 - months / 6;
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#7FA6BF'], [60, '#C7D7D9'], [100, '#E9DDBF']]} />
      <Layer z={0.4}>
        {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-200 + i * 200} y={560 - random(`cb${i}`) * 200} width={190} height={600} fill="#5E7381" opacity={0.6} />)}
      </Layer>
      <Layer z={1}>
        <PawnShop x={1280} y={960} c="#1C1A20" frame={frame} />
        <rect x={-400} y={960} width={2800} height={300} fill="#141218" />
        <g opacity={1 - into}>
          <Car60 x={carX} y={960} c="#141218" scale={0.75} wheel={carX} lights={0} />
        </g>
      </Layer>
      {/* el dinero que da el coche: billetes que se van gastando mes a mes */}
      <AbsoluteFill style={{ opacity: rampOut(frame, fDur - 10, fDur + 6) }}>
        <div style={{ position: 'absolute', left: 120, top: 120, width: 520, transform: 'scale(1.35)', transformOrigin: '0 0' }}>
          <div style={{ fontFamily: '"Caveat", cursive', fontWeight: 700, fontSize: 64, color: '#1D1A16' }}>mes {Math.max(1, months)} de 6</div>
          <div style={{ position: 'relative', height: 220, marginTop: 14 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ position: 'absolute', left: 20 + (i % 3) * 8, top: 180 - i * 14, width: 300, height: 120, background: '#7F8E78', border: '3px solid #5E6B58', opacity: i < 12 * cash ? 1 : 0, transform: `rotate(${(random(`bl${i}`) - 0.5) * 8}deg)` }} />
            ))}
          </div>
        </div>
      </AbsoluteFill>
      <PaperFinish opacity={0.45} vignette={0.5} />
      {fEmp < 0 && null}
    </Rig>
  );
};

// las joyas en el mostrador del Monte de Piedad
const JewelShot: React.FC<{ t0: number; t1: number; fJoy: number; fFam: number }> = ({ t0, t1, fJoy, fFam }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: t0, x: 960, y: 580, s: 1.08 }, { f: t1, x: 940, y: 560, s: 1.2 }], 0.5);
  const handIn = sp(frame, t0 + 4, 16, 110);
  const open = ramp(frame, fJoy - 6, fJoy + 8);
  const slide = ramp(frame, fFam - 4, t1 - 6);
  const bx = 900 + slide * 520;
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#2E3A3E'], [100, '#151C1F']]} glows={[{ x: 960, y: 380, r: 900, c: '#FFE6B0', a: 0.3 }]} />
      <Layer z={1}>
        {/* mostrador de cristal */}
        <rect x={-200} y={700} width={2400} height={500} fill="#24363C" />
        <rect x={-200} y={700} width={2400} height={8} fill="#9DB9C2" opacity={0.6} />
        {/* joyero */}
        <g transform={`translate(${bx} 720) scale(1.6)`}>
          <rect x={-120} y={-80} width={240} height={90} rx={8} fill="#6E2B26" />
          <path d={`M -120 -80 L 120 -80 L ${120 - 20 * open} ${-80 - 110 * open} L ${-120 + 20 * open} ${-80 - 110 * open} Z`} fill="#7E3530" />
          <rect x={-104} y={-70} width={208} height={64} fill="#2A1012" opacity={open} />
          {/* collar y pendientes con brillos */}
          <path d="M -70 -50 C -40 -14, 40 -14, 70 -50" stroke="#E9C46A" strokeWidth={6} fill="none" opacity={open} />
          {[-50, -20, 10, 40].map((k, i) => <circle key={i} cx={k + 10} cy={-34 + Math.abs(k) * 0.12} r={7} fill="#F2D27A" opacity={open} />)}
          {[0, 1, 2].map((i) => <path key={i} d="M 0 -10 L 2 -2 L 10 0 L 2 2 L 0 10 L -2 2 L -10 0 L -2 -2 Z" fill="#FFF6D8" opacity={open * Math.abs(Math.sin(frame / 5 + i * 2))} transform={`translate(${-40 + i * 40} -46)`} />)}
        </g>
        {/* su mano la deja y se retira despacio */}
        <Hand x={interpolate(handIn, [0, 1], [0, 620]) - slide * 700} y={760} rot={-8} scale={1.3} curl={0.3 + 0.3 * (1 - open)} c="#120B07" sleeve="#3A2418" />
      </Layer>
      <PaperFinish opacity={0.45} vignette={0.6} />
      <Slate text="las joyas de su familia" a={fJoy + 10} b={fJoy + 40} out={t1 - 14} x={110} y={940} />
    </Rig>
  );
};

// el televisor sale de la sala y deja su hueco
const TVShot: React.FC<{ t0: number; end: number; fTel: number }> = ({ t0, end, fTel }) => {
  const frame = useCurrentFrame();
  const L = HOUSE.living;
  const cam = useCamera([{ f: t0, x: (L.x0 + L.x1) / 2, y: (L.y0 + L.y1) / 2, s: 2.7 }, { f: end, x: (L.x0 + L.x1) / 2 - 30, y: (L.y0 + L.y1) / 2, s: 2.9 }], 0.5);
  const lift = ramp(frame, fTel - 6, fTel + 30);
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#0D1826'], [100, '#2A3340']]} />
      <Layer z={1}>
        <House ink={INK} frame={frame} items={{ tv: 0 }} lights={{ study: 0.4, kids: 0.2, bath: 0.1, living: 1, kitchen: 0.5 }} />
        {/* el hueco que deja */}
        <rect x={452} y={846} width={98} height={94} fill="#000" opacity={0.12 * lift} />
        <g transform={`translate(${-lift * 520} ${-lift * 40})`}>
          <TV60 x={500} y={940} c={INK} s={0.72} />
        </g>
        {lift > 0 && <Person x={560 - lift * 520} y={958} scale={1.12} face={-1} kind="woman" hair="bob" pose={{ ...walkPose(lift * 20, 0.8), shF: 60, elF: 40, shB: 60, elB: 40 }} c={INK} />}
      </Layer>
      <PaperFinish opacity={0.5} vignette={0.6} warm={0.5} />
    </Rig>
  );
};

// ——— VECINOS v2 · W16 ———
// La calle: su casa y las de tres familias de militares. La sombra del pelotón de fusilamiento (el de la novela) se
// proyecta en su pared mientras él escribe… y los vecinos se colocan exactamente igual, pero con cestas, ollas y pan.
const StreetHouse: React.FC<{ x: number; w: number; h: number; c: string; lit: number; door?: number; roof?: 'flat' | 'gable' }> = ({ x, w, h, c, lit, door = 0, roof = 'flat' }) => (
  <g>
    <rect x={x - w / 2} y={960 - h} width={w} height={h} fill={c} />
    {roof === 'gable' ? <path d={`M ${x - w / 2 - 20} ${960 - h} L ${x} ${960 - h - 90} L ${x + w / 2 + 20} ${960 - h} Z`} fill={c} /> : <rect x={x - w / 2 - 12} y={960 - h - 18} width={w + 24} height={20} fill={c} />}
    {[-1, 1].map((k) => (
      <g key={k}>
        <rect x={x + k * w * 0.27 - 34} y={960 - h + 50} width={68} height={86} fill={WARM} opacity={0.75 * lit} />
        <rect x={x + k * w * 0.27 - 2} y={960 - h + 50} width={4} height={86} fill={c} />
      </g>
    ))}
    <rect x={x - 46} y={960 - 170} width={92} height={170} fill={mix(c, '#000', 0.4)} />
    <rect x={x - 46} y={960 - 170} width={92 * door} height={170} fill="#F2C47A" opacity={0.95} />
  </g>
);

const FOOD = ['basket', 'pot', 'bread', 'bag', 'cake'] as const;
const Food: React.FC<{ kind: (typeof FOOD)[number]; c: string }> = ({ kind, c }) => {
  if (kind === 'basket') return <g fill={c}><path d="M -30 -10 L 30 -10 L 22 24 L -22 24 Z" /><path d="M -22 -10 C -22 -44, 22 -44, 22 -10" stroke={c} strokeWidth={5} fill="none" /><circle cx={-8} cy={-16} r={9} fill="#D98A3A" /><circle cx={10} cy={-14} r={8} fill="#C9502E" /></g>;
  if (kind === 'pot') return <g fill={c}><rect x={-30} y={-20} width={60} height={40} rx={6} /><rect x={-38} y={-24} width={76} height={8} rx={3} /><path d="M -10 -34 C -6 -44, 4 -44, 8 -34" stroke={CREAM} strokeWidth={3} fill="none" opacity={0.7} /></g>;
  if (kind === 'bread') return <g><ellipse cx={0} cy={0} rx={38} ry={18} fill="#C98A4A" /><path d="M -20 -10 L -14 4 M -2 -12 L 4 4 M 14 -10 L 20 4" stroke="#8A5A2A" strokeWidth={3} /></g>;
  if (kind === 'bag') return <g fill={c}><path d="M -26 -30 L 26 -30 L 30 24 L -30 24 Z" /><rect x={-14} y={-50} width={8} height={22} fill="#5E8C61" /><rect x={2} y={-46} width={10} height={18} fill="#E8C060" /></g>;
  return <g><rect x={-32} y={-14} width={64} height={30} rx={4} fill="#F2E2C8" /><rect x={-32} y={-14} width={64} height={8} fill="#E9A2A0" /><rect x={-2} y={-34} width={4} height={20} fill="#F4EAD5" /><ellipse cx={0} cy={-36} rx={4} ry={6} fill="#FFD27A" /></g>;
};

export const Vecinos2: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('VECINOS');
  const fDet = c.at('W16', 'detalle');
  const fVec = c.at('W16', 'vecinos');
  const fTres = c.at('W16', 'tres');
  const fMil = c.at('W16', 'militares');
  const fEl = c.at('W16', 'El');
  const fPel = c.at('W16', 'pelotón');
  const fTen = c.at('W16', 'tenía');
  const fLado = c.at('W16', 'lado');
  const fOtro = c.at('W16', 'otro');
  const fPel2 = c.at('W16', 'pelotón', 1);
  const fAyu = c.at('W16', 'ayudaba');
  const fFin = c.at('W16', 'fin');
  const end = c.dur;
  const cam = useCamera([
    { f: 0, x: 960, y: 640, s: 1.0 },
    { f: fTres, x: 1060, y: 660, s: 1.08 },
    { f: fEl, x: 760, y: 600, s: 1.25 },
    { f: fTen, x: 800, y: 620, s: 1.15 },
    { f: fPel2, x: 900, y: 640, s: 1.08 },
    { f: end, x: 920, y: 640, s: 1.14 },
  ], 0.6);
  const doors = (k: number) => ramp(frame, fTres + k * 8, fTres + k * 8 + 14);
  const shadow = ramp(frame, fEl + 4, fPel) * (1 - ramp(frame, fOtro - 10, fPel2));
  const line = ramp(frame, fTen, fOtro + 10);
  const neighbors = [0, 1, 2, 3, 4].map((k) => ({ x: interpolate(line, [0, 1], [1140 + (k % 3) * 300 + k * 30, 470 + k * 120]), food: FOOD[k] }));
  const offer = ramp(frame, fPel2 + 6, fAyu + 10);
  return (
    <AbsoluteFill>
      <Rig cam={cam}>
        <Sky stops={[[0, '#E3A05E'], [55, '#B65E43'], [100, '#4A2A3A']]} glows={[{ x: 200, y: 700, r: 700, c: '#FFD89A', a: 0.5 }]} />
        <Layer z={0.4}>
          {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={-200 + i * 170} y={760 - random(`vb${i}`) * 160} width={160} height={500} fill="#6A3A44" opacity={0.6} />)}
        </Layer>
        <Layer z={1}>
          {/* su casa (izquierda) y las tres de los vecinos */}
          <StreetHouse x={380} w={460} h={430} c="#1A0F14" lit={1} />
          {/* ventana de su estudio con él escribiendo */}
          <g>
            <rect x={240} y={570} width={120} height={110} fill="#F2B865" />
            <g transform="translate(300 680) scale(0.45)"><Person x={0} y={0} scale={1} kind="man" hair="curly" mustache pose={typingPose(frame * 1.5)} c="#1A0F14" /></g>
          </g>
          {[1, 2, 3].map((k) => <StreetHouse key={k} x={380 + k * 470} w={400} h={360 + (k % 2) * 40} c="#1A0F14" lit={0.8} door={doors(k - 1)} roof={k === 2 ? 'gable' : 'flat'} />)}
          <rect x={-400} y={960} width={2800} height={300} fill="#120A0E" />
          {/* la sombra del pelotón de la novela, proyectada en su pared */}
          <g opacity={shadow * 0.95}>
            {[0, 1, 2, 3, 4].map((k) => <Person key={k} x={200 + k * 56} y={900} scale={1.0} face={-1} kind="man" hair="cap" pose={{ lean: 4, shF: 66, elF: 22, shB: 40, elB: 70 }} c="#0A0508" front={<rect x={-50} y={-4} width={110} height={7} fill="#0A0508" />} />)}
          </g>
          {/* los vecinos, en la misma formación, con comida en lugar de fusiles */}
          {frame >= fTres - 4 && neighbors.map((n, k) => {
            const walking = line > 0 && line < 1;
            const pose: Pose = walking ? walkPose(n.x / 24, 1) : { lean: 4, shF: 30 + 36 * offer, elF: 50 - 28 * offer, shB: 30 + 10 * offer, elB: 60 };
            return (
              <g key={k} opacity={ramp(frame, fTres + (k % 3) * 8, fTres + (k % 3) * 8 + 14)}>
                <Person x={n.x} y={960} scale={1.55} face={-1} kind={k === 1 || k === 3 ? 'woman' : 'man'} hair={k === 1 || k === 3 ? 'bob' : 'cap'} pose={pose} c="#1A0F14"
                  front={<g transform="rotate(-90) translate(14 0)"><Food kind={n.food} c="#3A2830" /></g>} />
              </g>
            );
          })}
        </Layer>
      </Rig>
      <PaperFinish opacity={0.45} vignette={0.55} warm={0.5} />
      <Sfx name="hdl_knock" at={fTres + 2} volume={0.6} />
      <Sfx name="sk_door" at={fTres + 10} volume={0.4} />
      <Sfx name="sk_typing" at={fEl} volume={0.35} />
      <Sfx name="sk_heart" at={fPel} volume={0.4} />
      <Sfx name="whoosh_soft" at={fOtro - 6} volume={0.5} />
      <Sfx name="coins" at={fFin + 2} volume={0.45} />
      {fDet + fVec + fMil + fLado < 0 && null}
    </AbsoluteFill>
  );
};

// ——— DEUDA v2 · W17 ———
export const Deuda2: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('DEUDA');
  const fPun = c.at('W17', 'punto');
  const fFin = c.at('W17', 'final');
  const fAgo = c.at('W17', 'agosto');
  const fFam = c.at('W17', 'familia');
  const fCie = c.at('W17', 'ciento');
  const fDiez = c.at('W17', 'diez');
  const fAnos = c.at('W17', 'Años');
  const fMer = c.at('W17', 'Mercedes');
  const fCom = c.at('W17', 'comida');
  const fSolo = c.at('W17', 'solo');
  const end = c.dur;
  const tDebt = fFam - 16;
  const tDinner = fAnos - 8;
  let shot: React.ReactNode;
  if (frame < tDebt) {
    shot = (
      <TypewriterCloseup t0={0} t1={tDebt} pages={[{ from: 0, yank: tDebt - 8, lines: [{ text: '.', a: fFin - 1, b: fFin, center: true, size: 220 }] }]} />
    );
  } else if (frame < tDinner) shot = <DebtShot t0={tDebt} t1={tDinner} fCie={fCie} fDiez={fDiez} />;
  else shot = <DinnerShot t0={tDinner} end={end} fMer={fMer} fCom={fCom} fSolo={fSolo} />;
  return (
    <AbsoluteFill style={{ background: '#05080B' }}>
      {shot}
      {frame < tDebt && <Slate text="agosto de 1966" a={fAgo - 4} b={fAgo + 30} out={tDebt - 14} x={110} y={940} />}
      <Sfx name="key5" at={fFin} volume={2} />
      <Sfx name="hit_soft" at={fFin + 1} volume={0.6} />
      <Sfx name="sk_typebell" at={fFin + 14} volume={0.6} />
      <Sfx name="hdl_tear" at={tDebt - 4} volume={0.6} />
      {Array.from({ length: 10 }).map((_, i) => <Sfx key={i} name="sk_pin" at={tDebt + 8 + i * 9} volume={0.3} />)}
      <Sfx name="hdl_tally" at={fCie - 2} volume={0.8} dur={44} fade={8} />
      <Sfx name="sk_clock" at={fSolo - 20} volume={0.4} />
      {fPun < 0 && null}
    </AbsoluteFill>
  );
};

// la deuda: papeles de «debo» que se clavan por toda la casa
const DebtShot: React.FC<{ t0: number; t1: number; fCie: number; fDiez: number }> = ({ t0, t1, fCie, fDiez }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: t0, x: 960, y: 640, s: 0.92 }, { f: t1, x: 960, y: 620, s: 1.0 }], 0.6);
  const notes = Array.from({ length: 34 }).map((_, i) => ({
    at: t0 + 6 + i * 4,
    x: HOUSE.x0 + 50 + random(`dn${i}x`) * (HOUSE.x1 - HOUSE.x0 - 100),
    y: HOUSE.top + 40 + random(`dn${i}y`) * (HOUSE.ground - HOUSE.top - 120),
    r: (random(`dn${i}r`) - 0.5) * 30,
  }));
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#0D1826'], [100, '#2A3340']]} />
      <Layer z={1}>
        <House ink={INK} frame={frame} items={{ car: 0, tv: 0, jewels: 0 }} lights={{ study: 0.8, kids: 0.5, bath: 0.3, living: 0.6, kitchen: 0.7 }} />
        {notes.map((n, i) => {
          const p = sp(frame, n.at, 12, 180);
          if (frame < n.at) return null;
          return (
            <g key={i} transform={`translate(${n.x} ${n.y}) rotate(${n.r}) scale(${1.6 - 0.6 * p})`} opacity={Math.min(1, p * 2)}>
              <rect x={-30} y={-20} width={60} height={40} fill="#EFE3C8" />
              <text x={0} y={7} textAnchor="middle" fontFamily='"Caveat", cursive' fontWeight={700} fontSize={20} fill="#B5262B">debo</text>
              <circle cx={0} cy={-17} r={3} fill="#B5262B" />
            </g>
          );
        })}
      </Layer>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 60 }}>
        <div style={{ background: 'rgba(239,227,200,0.95)', padding: '18px 44px', transform: 'rotate(-2deg)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', opacity: rampOut(frame, fCie - 8, fCie + 6) }}>
          <div style={{ fontFamily: '"Caveat", cursive', fontWeight: 700, fontSize: 96, color: '#B5262B', lineHeight: 1 }}>– 120.000 pesos</div>
          <div style={{ fontFamily: '"Caveat", cursive', fontWeight: 700, fontSize: 48, color: '#3B3A44', opacity: rampOut(frame, fDiez - 4, fDiez + 10) }}>≈ 10.000 dólares de la época</div>
        </div>
      </AbsoluteFill>
      <PaperFinish opacity={0.5} vignette={0.6} warm={0.4} />
    </Rig>
  );
};

// la mesa: cada noche, la cena (días que pasan por la ventana) y ella sirviendo
const DinnerShot: React.FC<{ t0: number; end: number; fMer: number; fCom: number; fSolo: number }> = ({ t0, end, fMer, fCom, fSolo }) => {
  const frame = useCurrentFrame();
  const K = HOUSE.kitchen;
  const cam = useCamera([{ f: t0, x: (K.x0 + K.x1) / 2 - 40, y: (K.y0 + K.y1) / 2, s: 2.2 }, { f: end, x: (K.x0 + K.x1) / 2 - 80, y: (K.y0 + K.y1) / 2 + 10, s: 2.45 }], 0.5);
  const fast = frame < fSolo - 20;
  const cyc = fast ? ((frame - t0) / 22) % 1 : 0.5;
  const day = fast ? (Math.sin(cyc * Math.PI * 2) + 1) / 2 * 0.8 : 0;
  const days = Math.min(549, Math.floor(interpolate(frame, [t0 + 10, fSolo - 20], [1, 549], clamp)));
  const serve = Math.sin(frame / 12);
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, mix('#0D1826', '#9CC2CF', day)], [100, mix('#2A3340', '#E8D9B0', day)]]} />
      <Layer z={1}>
        <House ink={INK} frame={frame} daylight={day} items={{ car: 0, tv: 0, jewels: 0 }} lights={{ study: 0.6, kids: 0.3, bath: 0.2, living: 0.4, kitchen: 1 }} />
        {/* platos en la mesa */}
        {[1130, 1190, 1250, 1310].map((x, i) => <ellipse key={i} cx={x} cy={846} rx={20} ry={5} fill={CREAM} />)}
        <Person x={1120} y={1002} scale={1.0} kind="man" hair="curly" mustache pose={sitPose({ lean: 6, shF: 50, elF: 60 })} c={INK} />
        <Person x={1180} y={990} scale={0.85} kind="boy" hair="kid" pose={sitPose({ shF: 40, elF: 70 })} c={INK} />
        <Person x={1310} y={990} scale={0.8} face={-1} kind="boy" hair="kid" pose={sitPose({ shF: 40, elF: 70 })} c={INK} />
        <Person x={1380} y={958} scale={1.12} face={-1} kind="woman" hair="bob" pose={{ lean: 10, shF: 60 + serve * 10, elF: 30, shB: 50, elB: 40 }} c={INK} back="#2A1C12"
          front={<ellipse cx={8} cy={0} rx={22} ry={6} fill={CREAM} />} />
        {/* calendario de rayitas en la pared de la cocina */}
        <g transform="translate(980 720)">
          <rect x={0} y={0} width={110} height={80} fill="#EFE3C8" />
          <text x={55} y={30} textAnchor="middle" fontFamily='"Special Elite", monospace' fontSize={14} fill="#5A2A22">DÍA</text>
          <text x={55} y={66} textAnchor="middle" fontFamily='"EB Garamond", serif' fontWeight={700} fontSize={36} fill="#1D1A16">{days}</text>
        </g>
      </Layer>
      <PaperFinish opacity={0.5} vignette={0.6} warm={0.6} />
      {fMer + fCom < 0 && null}
    </Rig>
  );
};

export const _m = { Halo, Hand, Keystrokes, typeTimes, P, frameRoom, Gabo, easeInOut };
