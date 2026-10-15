import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { Butterfly, P, ramp, rampOut, sp } from './kit';
import { sceneClock } from './timeline';
import { Halo, Hand, Layer, mix, PaperFinish, Person, Pose, Rig, Sky, sitPose, useCamera, walkPose } from './theatre';
import { CREAM, WARM } from './sets';
import { HOUSE, House } from './house';
import { frameRoom, Gabo, typingPose } from './v2Bio';

const INK = '#140D08';

// ————————————————————————————————————————————————————————————————
// Capítulo III · La cueva de la mafia (v2)
// ————————————————————————————————————————————————————————————————

// Calendario de pared de hojas arrancables: «MESES» y el número; `n` hojas ya arrancadas vuelan.
const TearCalendar: React.FC<{ x: number; y: number; n: number; flying: number[]; frame: number; strike?: number; six?: number }> = ({ x, y, n, flying, frame, strike = 0, six = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-160} y={-210} width={320} height={420} rx={10} fill="#000" opacity={0.35} transform="translate(12 16)" />
    <rect x={-160} y={-210} width={320} height={420} rx={10} fill="#EDE2C8" />
    <rect x={-160} y={-210} width={320} height={90} rx={10} fill="#2E4A3E" />
    <text x={0} y={-150} textAnchor="middle" fontFamily='"Ubuntu", sans-serif' fontWeight={700} fontSize={34} letterSpacing={8} fill="#F4EAD5">MESES</text>
    <text x={0} y={80} textAnchor="middle" fontFamily='"EB Garamond", serif' fontWeight={700} fontSize={230} fill="#1D1A16">{Math.max(1, n)}</text>
    {/* «6» rodeado y luego tachado */}
    {six > 0 && n <= 6 && <ellipse cx={0} cy={6} rx={110 * six} ry={120 * six} fill="none" stroke="#B5262B" strokeWidth={8} opacity={six} />}
    {strike > 0 && n <= 6 && <path d={`M -110 -40 L ${-110 + 220 * strike} ${-40 + 120 * strike}`} stroke="#B5262B" strokeWidth={14} strokeLinecap="round" />}
    {flying.map((t0, i) => {
      const t = (frame - t0) / 26;
      if (t < 0 || t > 1) return null;
      return (
        <g key={i} transform={`translate(${t * (600 + random(`cf${i}`) * 400)} ${-t * 300 + t * t * 500}) rotate(${t * (200 + random(`cr${i}`) * 200)})`} opacity={1 - t * 0.6}>
          <rect x={-160} y={-120} width={320} height={330} fill="#EDE2C8" />
          <text x={0} y={80} textAnchor="middle" fontFamily='"EB Garamond", serif' fontWeight={700} fontSize={230} fill="#1D1A16">{i + 6}</text>
          {i === 0 && <path d="M -110 -40 L 110 80" stroke="#B5262B" strokeWidth={14} strokeLinecap="round" />}
        </g>
      );
    })}
  </g>
);

export const Cueva2: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('CUEVA');
  const fCal = c.part('W11');
  const fSeis = c.at('W11', 'seis');
  const fLe = c.at('W11', 'Le', 1);
  const fDie = c.at('W11', 'dieciocho');
  const fEnc = c.at('W12', 'encierra');
  const fBau = c.at('W12', 'bautizan');
  const fCue = c.at('W12', 'cueva');
  const fEsc = c.at('W12', 'escribe');
  const fDias = c.at('W12', 'días');
  const fEn = c.at('W12', 'En', 2);
  const fGana = c.at('W12', 'gana');
  const fPeso = c.at('W12', 'peso');
  const end = c.dur;
  const tHouse = fEnc - 10;
  const tWallet = fEn - 6;
  let shot: React.ReactNode;
  if (frame < tHouse) shot = <CalendarShot t1={tHouse} fCal={fCal} fSeis={fSeis} fLe={fLe} fDie={fDie} />;
  else if (frame < tWallet) shot = <CaveShot t0={tHouse} t1={tWallet} fBau={fBau} fCue={fCue} fEsc={fEsc} fDias={fDias} />;
  else shot = <WalletShot t0={tWallet} end={end} fGana={fGana} fPeso={fPeso} />;
  // hojas del calendario: del 6 al 18 entre «Le llevará» y «dieciocho»+
  const flips = Array.from({ length: 17 }).map((_, i) => Math.round(interpolate(i, [0, 16], [fLe + 4, fDie + 26])));
  return (
    <AbsoluteFill style={{ background: '#05080B' }}>
      {shot}
      <Sfx name="pencil_strike" at={fSeis + 4} volume={0.5} />
      <Sfx name="pencil_strike" at={fLe} volume={0.7} />
      <Sfx name="page_riffle" at={fLe + 6} volume={0.9} />
      <Sfx name="hdl_tear" at={fLe + 4} volume={0.5} />
      <Sfx name="hdl_tear" at={fDie} volume={0.5} />
      <Sfx name="sk_door" at={fEnc + 4} volume={0.6} />
      <Sfx name="sk_pin" at={fCue - 4} volume={0.8} />
      <Sfx name="sk_typing" at={fEsc} volume={0.4} />
      <Sfx name="sk_clock" at={fDias - 10} volume={0.4} />
      <Sfx name="click" at={tWallet + 14} volume={0.6} />
      <Sfx name="hdl_flutter" at={fGana + 6} volume={0.6} />
      {flips.length < 0 && null}
    </AbsoluteFill>
  );
};

const CalendarShot: React.FC<{ t1: number; fCal: number; fSeis: number; fLe: number; fDie: number }> = ({ t1, fCal, fSeis, fLe, fDie }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: 0, x: 960, y: 540, s: 1.05 }, { f: fLe, x: 960, y: 540, s: 1.12 }, { f: t1, x: 980, y: 560, s: 1.0 }], 0.5);
  const six = ramp(frame, fSeis, fSeis + 14);
  const strike = ramp(frame, fLe - 4, fLe + 6);
  const flips = Array.from({ length: 17 }).map((_, i) => Math.round(interpolate(i, [0, 16], [fLe + 6, fDie + 30])));
  const n = 1 + Math.min(17, flips.filter((f) => frame >= f).length);
  const shown = frame < fLe + 6 ? Math.max(1, Math.min(6, Math.floor(interpolate(frame, [fCal, fSeis + 4], [1, 6.99], clamp)))) : n;
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#C98E52'], [100, '#7A4A26']]} glows={[{ x: 700, y: 300, r: 900, c: '#FFE0A8', a: 0.4 }]} />
      <Layer z={0.5}>
        {/* sombra de una persiana en la pared */}
        {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={1180} y={140 + i * 70} width={700} height={26} fill="#3A2412" opacity={0.25} transform="skewX(-20)" />)}
      </Layer>
      <Layer z={1}>
        <g transform="translate(860 560) scale(1.35) translate(-860 -560)"><TearCalendar x={860} y={560} n={shown} flying={flips.filter((f) => frame >= f)} frame={frame} strike={strike} six={six * (1 - strike)} /></g>
      </Layer>
      <PaperFinish opacity={0.45} vignette={0.6} warm={0.6} />
      <div style={{ position: 'absolute', left: 1250, top: 760, fontFamily: '"Caveat", cursive', fontWeight: 700, fontSize: 84, color: '#2A1A10', transform: 'rotate(-4deg)', opacity: rampOut(frame, fSeis - 4, fSeis + 10) }}>
        ≈ 6 meses <span style={{ color: '#B5262B', opacity: rampOut(frame, fDie, fDie + 10) }}>→ 18</span>
      </div>
    </Rig>
  );
};

// La cueva: la puerta del estudio se cierra; el cartel; días y noches que pasan (sol y luna detrás de la casa) y la pila
// de cuartillas que crece.
const CaveShot: React.FC<{ t0: number; t1: number; fBau: number; fCue: number; fEsc: number; fDias: number }> = ({ t0, t1, fBau, fCue, fEsc, fDias }) => {
  const frame = useCurrentFrame();
  const st = frameRoom('study', 0.98);
  const cam = useCamera([
    { f: t0, x: st.x + 60, y: st.y, s: st.s * 0.8 },
    { f: fCue + 20, x: st.x + 120, y: st.y + 20, s: st.s * 0.6 },
    { f: fEsc, x: 960, y: 620, s: 0.9 },
    { f: t1, x: 960, y: 600, s: 0.86 },
  ], 0.6);
  // ciclo de días: empieza con «escribe todos los días»
  const tl = Math.max(0, frame - fEsc);
  const cyc = (tl / 26) % 1;
  const day = frame < fEsc ? 0 : (Math.sin(cyc * Math.PI * 2 - Math.PI / 2) + 1) / 2;
  const sunA = cyc * Math.PI * 2;
  const pile = interpolate(frame, [fEsc, t1], [0.15, 1.6], clamp);
  const sign = sp(frame, fCue - 6, 11, 150);
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, mix('#0D1826', '#8EC1D6', day)], [60, mix('#1C2E41', '#CFE2E6', day)], [100, mix('#3A3F48', '#F2D9A8', day)]]} />
      <Layer z={0.2}>
        {frame >= fEsc && (
          <g>
            <circle cx={960 + Math.cos(sunA + Math.PI) * 900} cy={760 + Math.sin(sunA + Math.PI) * 600} r={70} fill="#FFE6A0" opacity={day} />
            <circle cx={960 + Math.cos(sunA) * 900} cy={760 + Math.sin(sunA) * 600} r={50} fill="#F1E7CF" opacity={1 - day} />
          </g>
        )}
      </Layer>
      <Layer z={1}>
        <House ink={INK} frame={frame} daylight={day} items={{ pile }} lights={{ study: 1, kids: 0.6 * (1 - day), bath: 0.3 * (1 - day), living: 0.7 * (1 - day) + 0.3, kitchen: 0.7 * (1 - day) + 0.3 }} />
        {/* puerta del estudio que se cierra (en la pared del pasillo) */}
        <rect x={760} y={420} width={22} height={208} fill={INK} />
        <g transform={`translate(${HOUSE.study.x1 - 8} 420)`}>
          <rect x={0} y={0} width={interpolate(ramp(frame, t0 + 4, t0 + 20), [0, 1], [70, 8])} height={208} fill={mix(INK, '#6A4528', 0.5)} />
        </g>
        {/* cartel: «La cueva de la mafia» */}
        <g transform={`translate(${HOUSE.study.x0 + 240} 372) rotate(${-3 + (1 - sign) * 20}) scale(${0.6 + 0.4 * sign})`} opacity={Math.min(1, sign * 2)}>
          <line x1={-50} y1={-18} x2={0} y2={-34} stroke={INK} strokeWidth={2} />
          <line x1={50} y1={-18} x2={0} y2={-34} stroke={INK} strokeWidth={2} />
          <rect x={-90} y={-18} width={180} height={44} rx={4} fill="#6A4528" />
          <text x={0} y={12} textAnchor="middle" fontFamily='"Caveat", cursive' fontWeight={700} fontSize={22} fill="#F4EAD5">la cueva de la mafia</text>
        </g>
        <Gabo frame={frame} pose={typingPose(frame * 1.6, 1.3)} />
      </Layer>
      <PaperFinish opacity={0.5} vignette={0.6} warm={0.4} />
      {fBau + fDias < 0 && null}
    </Rig>
  );
};

// La caja del dinero, vacía: se abre y sale volando una polilla.
const WalletShot: React.FC<{ t0: number; end: number; fGana: number; fPeso: number }> = ({ t0, end, fGana, fPeso }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: t0, x: 960, y: 600, s: 1.1 }, { f: end, x: 960, y: 560, s: 1.22 }], 0.5);
  const open = ramp(frame, t0 + 8, t0 + 22, easeOut);
  const mt = (frame - fGana) / 50;
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#3D2615'], [100, '#1E120A']]} angle={170} glows={[{ x: 960, y: 420, r: 900, c: '#FFC27A', a: 0.38 }]} />
      <Layer z={1}>
        {/* caja de lata, vista de frente con la tapa que se abre hacia atrás */}
        <g transform="translate(960 760)">
          <ellipse cx={0} cy={70} rx={360} ry={40} fill="#000" opacity={0.35} />
          <path d="M -300 -40 L 300 -40 L 280 70 L -280 70 Z" fill="#5E6A6E" />
          <path d="M -300 -40 L 300 -40 L 300 -20 L -300 -20 Z" fill="#8E9A9C" />
          <path d={`M -300 -40 L 300 -40 L ${300 - 40 * open} ${-40 - 200 * open} L ${-300 + 40 * open} ${-40 - 200 * open} Z`} fill="#7A878A" />
          {/* el interior vacío */}
          <path d={`M -280 -40 L 280 -40 L ${270 - 30 * open} ${-40 - 60 * open} L ${-270 + 30 * open} ${-40 - 60 * open} Z`} fill="#20282B" opacity={open} />
          <text x={0} y={40} textAnchor="middle" fontFamily='"Special Elite", monospace' fontSize={40} fill="#2A3033" letterSpacing={6}>AHORROS</text>
        </g>
        {/* polilla */}
        {frame > fGana && (
          <g transform={`translate(${960 + Math.sin(mt * 5) * 60 + mt * 140} ${700 - mt * 260}) scale(2.6)`}>
            <g transform={`scale(${0.4 + 0.6 * Math.abs(Math.cos(frame * 0.9))} 1)`}>
              <path d="M 0 0 C -30 -20, -46 -4, -36 10 C -24 22, -8 10, 0 4 Z" fill="#D9CBB0" />
              <path d="M 0 0 C 30 -20, 46 -4, 36 10 C 24 22, 8 10, 0 4 Z" fill="#D9CBB0" />
            </g>
            <ellipse cx={0} cy={4} rx={3} ry={10} fill="#5A4A36" />
          </g>
        )}
        <text x={960} y={300} textAnchor="middle" fontFamily='"Caveat", cursive' fontWeight={700} fontSize={84} fill="#F6E9CC" opacity={rampOut(frame, fPeso - 6, fPeso + 10)}>ni un peso</text>
      </Layer>
      <PaperFinish opacity={0.45} vignette={0.62} warm={0.6} />
    </Rig>
  );
};

// ——— AMIGOS v2 · W13 ———
export const Amigos2: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('AMIGOS');
  const fAmi = c.at('W13', 'amigos');
  const fMut = c.at('W13', 'Mutis');
  const fFue = c.at('W13', 'Fuentes');
  const fPas = c.at('W13', 'pasan');
  const fCue = c.at('W13', 'cuente');
  const fFue2 = c.at('W13', 'Fuentes', 1);
  const fLee = c.at('W13', 'lee');
  const fEsc = c.at('W13', 'escribe');
  const fRev = c.at('W13', 'revista');
  const fFue3 = c.at('W13', 'fuera');
  const fMut2 = c.at('W13', 'Mutis', 1);
  const fSal = c.at('W13', 'salía');
  const fAta = c.at('W13', 'atardecer');
  const fPel = c.at('W13', 'pelear');
  const fDoce = c.at('W13', 'doce');
  const fBox = c.at('W13', 'boxeo');
  const end = c.dur;
  const tMag = fEsc - 8;
  const tBox = fMut2 - 8;
  let shot: React.ReactNode;
  if (frame < tMag) shot = <TellingShot t1={tMag} fAmi={fAmi} fMut={fMut} fFue={fFue} fPas={fPas} fCue={fCue} fFue2={fFue2} fLee={fLee} />;
  else if (frame < tBox) shot = <MagazineShot t0={tMag} t1={tBox} fRev={fRev} fFue3={fFue3} />;
  else shot = <BoxerShot t0={tBox} end={end} fSal={fSal} fAta={fAta} fPel={fPel} fDoce={fDoce} fBox={fBox} />;
  return (
    <AbsoluteFill style={{ background: '#05080B' }}>
      {shot}
      <Sfx name="hdl_knock" at={fPas - 20} volume={0.8} />
      <Sfx name="hdl_flutter" at={fCue + 10} volume={0.6} />
      <Sfx name="page_turn" at={fLee + 6} volume={0.6} />
      <Sfx name="hdl_press" at={tMag + 4} volume={0.5} dur={70} fade={20} />
      <Sfx name="sparkle" at={fFue3} volume={0.5} />
      <Sfx name="sk_door" at={fSal - 4} volume={0.6} />
      <Sfx name="hdl_bell" at={fDoce} volume={1} />
    </AbsoluteFill>
  );
};

// la sala de noche: llegan los amigos, se sientan; él cuenta y en el aire flotan sombras de la historia
const TellingShot: React.FC<{ t1: number; fAmi: number; fMut: number; fFue: number; fPas: number; fCue: number; fFue2: number; fLee: number }> = ({ t1, fAmi, fMut, fFue, fPas, fCue, fFue2, fLee }) => {
  const frame = useCurrentFrame();
  const L = HOUSE.living;
  const cam = useCamera([
    { f: 0, x: (L.x0 + L.x1) / 2 + 40, y: (L.y0 + L.y1) / 2 - 10, s: 2.4 },
    { f: fCue, x: (L.x0 + L.x1) / 2 + 20, y: (L.y0 + L.y1) / 2 - 30, s: 2.6 },
    { f: fFue2, x: 650, y: 840, s: 3.0 },
    { f: t1, x: 640, y: 846, s: 3.3 },
  ], 0.5);
  const tell = ramp(frame, fCue - 10, fCue + 10);
  const gesture = Math.sin(frame / 10);
  const reading = ramp(frame, fLee - 10, fLee + 6);
  const gaboPose: Pose = { lean: 4, neck: 4, shF: 40 + gesture * 30 * tell, elF: 50 + gesture * 20 * tell, shB: -10 + 40 * tell, elB: 60, hipF: 6, hipB: -6 };
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#0D1826'], [100, '#2A3340']]} />
      <Layer z={1}>
        <House ink={INK} frame={frame} lights={{ study: 0.4, kids: 0.2, bath: 0.1, living: 1, kitchen: 0.5 }} />
        {/* los dos amigos en el sofá */}
        <Person x={622} y={1000} scale={1.05} kind="man" hair="side" pose={sitPose({ lean: -6 + 14 * reading, neck: 6, shF: 20 + 30 * reading, elF: 70 + 30 * reading, shB: 10, elB: 60 })} c={INK} back="#2A1C12"
          front={reading > 0.5 ? <rect x={-6} y={-30} width={12} height={34} fill={CREAM} /> : undefined} />
        <Person x={742} y={1000} scale={1.05} kind="man" hair="short" pose={sitPose({ lean: -8, neck: 4, shF: 10, elF: 60, shB: 10, elB: 60 })} c={INK} back="#2A1C12" />
        {/* sombras de la historia proyectadas en la pared de la sala */}
        <g opacity={tell * (1 - reading)}>
          <Halo x={680} y={740} r={260} c="#FFE8BE" a={0.5} />
          <g transform={`translate(${560 + Math.sin(frame / 30) * 8} 748) scale(0.38)`} fill="#2A1C12" opacity={0.8}>
            <path d="M -120 0 L 120 0 L 90 40 L -90 40 Z" />
            <rect x={-4} y={-150} width={6} height={150} />
            <path d="M 2 -140 L 70 -60 L 2 -40 Z" />
            <path d="M -2 -130 L -60 -50 L -2 -36 Z" />
            {[-150, -100, 100, 150].map((x, i) => <path key={i} d={`M ${x} 40 C ${x - 10} 0, ${x + 10} -30, ${x} -60 C ${x + 30} -40, ${x + 30} 0, ${x + 10} 40 Z`} />)}
          </g>
          <g transform={`translate(${770 + Math.sin(frame / 20) * 10} ${724 + Math.cos(frame / 16) * 5}) rotate(${Math.sin(frame / 14) * 4}) scale(0.42)`} fill="#2A1C12" opacity={0.8}>
            <path d="M -110 0 C -60 -10, 60 10, 110 0 L 110 14 C 60 24, -60 4, -110 14 Z" />
            <circle cx={-30} cy={-20} r={12} />
            <rect x={-40} y={-10} width={20} height={14} />
          </g>
        </g>
        {/* él, de pie, contando */}
        <Person x={850} y={958} scale={1.12} face={-1} kind="man" hair="curly" mustache pose={gaboPose} c={INK} back="#2A1C12" />
      </Layer>
      {frame > fCue && frame < fLee && <AbsoluteFill>{[0, 1, 2, 3].map((i) => <Butterfly key={i} x={820 + i * 120 + Math.sin(frame / 12 + i) * 60} y={420 - i * 30 + Math.cos(frame / 9 + i) * 30} size={44} seed={`am${i}`} glow={0.6} opacity={ramp(frame, fCue + i * 10, fCue + i * 10 + 14)} />)}</AbsoluteFill>}
      <PaperFinish opacity={0.5} vignette={0.6} warm={0.5} />
      <NameTag text="Álvaro Mutis" sub="poeta" x={640} y={250} a={fMut - 4} out={fFue2 - 30} />
      <NameTag text="Carlos Fuentes" sub="novelista" x={1110} y={250} a={fFue - 4} out={fFue2 - 30} />
      {fAmi < 0 && null}
    </Rig>
  );
};

export const NameTag: React.FC<{ text: string; sub: string; x: number; y: number; a: number; out: number }> = ({ text, sub, x, y, a, out }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [a, a + 18], [0, 1], clamp);
  const o = 1 - ramp(frame, out, out + 10);
  if (frame < a || o <= 0) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, opacity: o }}>
      <div style={{ fontFamily: '"Caveat", cursive', fontWeight: 700, fontSize: 76, color: '#22140A', clipPath: `inset(-20% ${(1 - p) * 100}% -20% -2%)`, whiteSpace: 'nowrap' }}>{text}</div>
      <div style={{ fontFamily: '"Special Elite", monospace', fontSize: 32, color: '#3A2412', opacity: rampOut(frame, a + 14, a + 26), letterSpacing: 2 }}>{sub}</div>
    </div>
  );
};

// La revista: la página sale de la imprenta y una mariposa amarilla se escapa del texto («algo fuera de lo común»).
const MagazineShot: React.FC<{ t0: number; t1: number; fRev: number; fFue3: number }> = ({ t0, t1, fRev, fFue3 }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: t0, x: 960, y: 540, s: 1.0 }, { f: t1, x: 980, y: 520, s: 1.12 }], 0.5);
  const slide = sp(frame, t0 + 2, 15, 120);
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#3D2615'], [100, '#1E120A']]} angle={170} glows={[{ x: 960, y: 420, r: 900, c: '#FFC27A', a: 0.38 }]} />
      <Layer z={1} html>
        <div style={{ position: 'absolute', left: 560, top: 120 + (1 - slide) * 800, width: 800, height: 900, background: '#EFE6D2', transform: 'rotate(-3deg)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
          <div style={{ position: 'absolute', left: 50, top: 40, fontFamily: '"EB Garamond", serif', fontWeight: 700, fontSize: 92, letterSpacing: 8, color: '#1D1A16' }}>REVISTA</div>
          <div style={{ position: 'absolute', left: 54, top: 150, fontFamily: '"Special Elite", monospace', fontSize: 22, color: '#5A2A22', letterSpacing: 3 }}>CIUDAD DE MÉXICO</div>
          <div style={{ position: 'absolute', left: 50, right: 50, top: 192, height: 3, background: '#1D1A16' }} />
          {Array.from({ length: 2 }).map((_, col) => (
            <div key={col} style={{ position: 'absolute', left: 50 + col * 360, top: 230, width: 330 }}>
              {Array.from({ length: 22 }).map((__, i) => (
                <div key={i} style={{ height: 9, marginBottom: 17, width: `${70 + random(`mg${col}${i}`) * 30}%`, background: '#3A332B', opacity: 0.55 }} />
              ))}
            </div>
          ))}
          {/* la línea que brilla */}
          <div style={{ position: 'absolute', left: 410, top: 230 + 26 * 9 - 4, width: 300, height: 18, background: P.yellow, opacity: 0.85 * rampOut(frame, fFue3 - 10, fFue3 + 4) }} />
        </div>
      </Layer>
      {frame > fFue3 && <AbsoluteFill><Butterfly x={1160 + (frame - fFue3) * 6} y={460 - (frame - fFue3) * 5 + Math.sin(frame / 6) * 16} size={96} seed="mag" glow={0.8} /></AbsoluteFill>}
      <PaperFinish opacity={0.45} vignette={0.62} warm={0.5} />
      {fRev < 0 && null}
    </Rig>
  );
};

// Al atardecer se abre la puerta del estudio y sale él, como un boxeador tras doce asaltos: cuerdas del ring, el cartel
// del asalto 12 y la campana.
const BoxerShot: React.FC<{ t0: number; end: number; fSal: number; fAta: number; fPel: number; fDoce: number; fBox: number }> = ({ t0, end, fSal, fAta, fPel, fDoce, fBox }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: t0, x: 760, y: 500, s: 2.4 }, { f: fPel, x: 820, y: 500, s: 2.6 }, { f: end, x: 840, y: 490, s: 2.8 }], 0.6);
  const exit = ramp(frame, fSal - 4, fAta + 10);
  const x = interpolate(exit, [0, 1], [700, 860]);
  const ring = ramp(frame, fPel - 12, fPel + 6);
  const sway = Math.sin(frame / 8) * 4;
  const pose: Pose = { lean: 18 + sway * 0.5, neck: 18, shF: -4 + sway, elF: 6, shB: 4 - sway, elB: 8, ...walkPose(x / 22, 0.5 * (exit < 1 ? 1 : 0.2), 18) };
  const card = sp(frame, fDoce - 8, 12, 150);
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#E9A35E'], [60, '#C9653E'], [100, '#5A2E3A']]} glows={[{ x: 300, y: 620, r: 600, c: '#FFD89A', a: 0.6 }]} />
      <Layer z={1}>
        <House ink={INK} frame={frame} daylight={0.6} lights={{ study: 0.9, kids: 0.5, bath: 0.3, living: 0.6, kitchen: 0.6 }} />
        <rect x={760} y={420} width={22} height={208} fill={mix(INK, '#6A4528', 0.5)} opacity={1 - exit} />
        <Person x={x} y={628} scale={1.1} kind="man" hair="curly" mustache pose={pose} c={INK} back="#2A1C12" />
        {/* cuerdas del ring */}
        <g opacity={ring}>
          {[0, 1, 2].map((k) => <path key={k} d={`M 600 ${560 + k * 26} C 760 ${570 + k * 26}, 960 ${570 + k * 26}, 1120 ${560 + k * 26}`} stroke="#B5262B" strokeWidth={5} fill="none" />)}
          <rect x={592} y={540} width={12} height={90} fill={INK} />
          <rect x={1116} y={540} width={12} height={90} fill={INK} />
        </g>
        {/* cartel del asalto */}
        <g transform={`translate(1000 ${430 - (1 - card) * 60}) rotate(${6 * card})`} opacity={Math.min(1, card * 2)}>
          <rect x={-70} y={-48} width={140} height={96} rx={6} fill="#F4EAD5" />
          <text x={0} y={-14} textAnchor="middle" fontFamily='"Ubuntu", sans-serif' fontWeight={700} fontSize={18} letterSpacing={4} fill="#B5262B">ASALTO</text>
          <text x={0} y={36} textAnchor="middle" fontFamily='"EB Garamond", serif' fontWeight={700} fontSize={56} fill="#1D1A16">12</text>
        </g>
      </Layer>
      <PaperFinish opacity={0.45} vignette={0.6} warm={0.6} />
      {fBox < 0 && null}
    </Rig>
  );
};

export const _c = { Halo, Hand, WARM, easeInOut, sitPose };
