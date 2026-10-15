import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { Butterfly, P, ramp, rampOut, sp } from './kit';
import { sceneClock } from './timeline';
import { Hair, Halo, Hand, Kind, Layer, mix, PaperFinish, Person, Pose, Rig, Sky, sitPose, Slate, useCamera, walkPose } from './theatre';
import { BookPile, PILES } from './v2Open';
import { CREAM, WARM } from './sets';
import { BAOffice } from './v2Post';

// ————————————————————————————————————————————————————————————————
// Capítulo VI · Ocho mil ejemplares (v2)
// ————————————————————————————————————————————————————————————————

// Pila de libros vista de frente (cantos), con su etiqueta.
export const BookStack: React.FC<{ x: number; y: number; n: number; w?: number; c?: string; seed: string; grow?: number }> = ({ x, y, n, w = 120, c = '#2C3A44', seed, grow = 1 }) => {
  const shown = Math.floor(n * grow + 0.0001);
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: shown }).map((_, i) => {
        const r = (k: string) => random(`${seed}${i}${k}`);
        const h = 16 + r('h') * 6;
        return (
          <g key={i} transform={`translate(${(r('x') - 0.5) * 10} ${-(i + 1) * 20})`}>
            <rect x={-w / 2} y={0} width={w} height={h} rx={2} fill={c} />
            <rect x={w / 2 - 8} y={2} width={6} height={h - 4} fill="#F0DDB5" opacity={0.7} />
          </g>
        );
      })}
    </g>
  );
};

// Imprenta de pliegos (silueta) con ruedas que giran y hojas que salen.
export const Press: React.FC<{ x: number; y: number; c: string; frame: number; run?: number }> = ({ x, y, c, frame, run = 1 }) => {
  const a = frame * 6 * run;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-380} y={-300} width={620} height={300} fill={c} />
      <rect x={-420} y={-40} width={720} height={40} fill={c} />
      <rect x={-300} y={-420} width={360} height={130} rx={10} fill={c} />
      {[[-200, -300, 120], [80, -300, 90], [260, -180, 70]].map(([wx, wy, r], i) => (
        <g key={i} transform={`translate(${wx} ${wy}) rotate(${a * (i % 2 ? -1 : 1)})`}>
          <circle r={r} fill={c} />
          <circle r={r * 0.82} fill="none" stroke={mix(c, '#FFFFFF', 0.12)} strokeWidth={6} />
          {[0, 60, 120].map((k) => <rect key={k} x={-r * 0.8} y={-4} width={r * 1.6} height={8} fill={mix(c, '#FFFFFF', 0.12)} transform={`rotate(${k})`} />)}
        </g>
      ))}
      {/* hojas que salen volando a la bandeja */}
      {Array.from({ length: 6 }).map((_, i) => {
        const t = ((frame * 0.04 * run + i / 6) % 1);
        return <rect key={i} x={260 + t * 220} y={-120 - Math.sin(t * Math.PI) * 120} width={120} height={80} fill={CREAM} opacity={run > 0.1 ? (1 - t) : 0} transform={`rotate(${t * 30} ${320 + t * 220} ${-80})`} />;
      })}
    </g>
  );
};

export const Porrua2: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('PORRUA');
  const fPor = c.part('W23');
  const fFin = c.at('W23', 'final');
  const fDes = c.at('W23', 'decidirse');
  const fCon = c.at('W23', 'Contaría');
  const fDec = c.at('W23', 'decidida');
  const fPri = c.at('W23', 'primera');
  const fPar = c.at('W23', 'párrafo');
  const fSud = c.part('W24');
  const fApu = c.at('W24', 'apuesta');
  const fMil = c.at('W24', 'mil');
  const fOcho = c.at('W24', 'ocho');
  const fEl = c.at('W24', 'El');
  const fImp = c.at('W24', 'imprimir');
  const fMayo = c.at('W24', 'mayo');
  const fLle = c.at('W24', 'llega');
  const fBue = c.at('W24', 'Buenos');
  const fJun = c.at('W24', 'junio');
  const end = c.dur;
  const tPage = fCon - 10;
  const tBet = fSud - 6;
  const tPress = fEl - 6;
  const tStreet = fLle - 10;
  let shot: React.ReactNode;
  if (frame < tPage) shot = <ReadShot t1={tPage} fFin={fFin} fDes={fDes} />;
  else if (frame < tBet) shot = <FirstLine t0={tPage} t1={tBet} fDec={fDec} fPri={fPri} fPar={fPar} />;
  else if (frame < tPress) shot = <BetShot t0={tBet} t1={tPress} fApu={fApu} fMil={fMil} fOcho={fOcho} />;
  else if (frame < tStreet) shot = <PressShot t0={tPress} t1={tStreet} fImp={fImp} fMayo={fMayo} />;
  else shot = <StoreShot t0={tStreet} end={end} fBue={fBue} fJun={fJun} />;
  return (
    <AbsoluteFill style={{ background: '#05080B' }}>
      {shot}
      <Sfx name="page_turn" at={fPor + 6} volume={0.5} />
      <Sfx name="marker" at={fPri} volume={0.7} />
      <Sfx name="hdl_flutter" at={fDec} volume={0.8} />
      <Sfx name="shimmer" at={fDes - 2} volume={0.3} />
      <Sfx name="card_flip" at={tBet} volume={0.3} />
      <Sfx name="sk_book_thud" at={fMil + 4} volume={0.4} />
      {Array.from({ length: 8 }).map((_, i) => <Sfx key={i} name="sk_book_slide" at={fOcho + 4 + i * 4} volume={0.35} />)}
      <Sfx name="hdl_press" at={tPress} volume={0.7} dur={tStreet - tPress} fade={20} />
      <Sfx name="hdl_car" at={tStreet} volume={0.35} dur={80} fade={20} />
      <Sfx name="sk_book_slide" at={fJun - 10} volume={0.5} />
    </AbsoluteFill>
  );
};

const ReadShot: React.FC<{ t1: number; fFin: number; fDes: number }> = ({ t1, fFin, fDes }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: 0, x: 860, y: 600, s: 1.3 }, { f: fDes, x: 780, y: 610, s: 1.5 }, { f: t1, x: 700, y: 560, s: 1.75 }], 0.5);
  // «para decidirse»: deja de pasar páginas y se le enciende la cara
  const lit = ramp(frame, fDes - 4, fDes + 20, easeOut);
  const flip = frame < fDes ? Math.max(0, Math.sin((frame - 10) / 9)) : 0;
  return (
    <Rig cam={cam}>
      <BAOffice frame={frame}>
        <rect x={520} y={640} width={420} height={14} fill="#15181C" />
        <rect x={540} y={654} width={12} height={110} fill="#15181C" />
        <rect x={908} y={654} width={12} height={110} fill="#15181C" />
        <rect x={556} y={644} width={116} height={12} fill="#15181C" />
        <rect x={560} y={656} width={10} height={106} fill="#15181C" />
        <rect x={658} y={656} width={10} height={106} fill="#15181C" />
        <rect x={552} y={520} width={12} height={136} fill="#15181C" />
        {/* las dos mitades ya en la mesa */}
        <rect x={730} y={612} width={150} height={28} fill={CREAM} />
        <rect x={770} y={588} width={150} height={24} fill={CREAM} />
        <Halo x={720} y={470} r={340 * lit + 1} a={0.55 * lit} />
        <Person x={630} y={808} scale={1.85} kind="man" hair="side" glasses pose={sitPose({ lean: 14 - lit * 8, neck: 18 - lit * 14, shF: 50 + flip * 6 + lit * 10, elF: 60 - lit * 6, shB: 44, elB: 66 })} c="#101317" back="#2A2F35"
          front={<rect x={-4} y={-40} width={8} height={44} fill={CREAM} />} />
      </BAOffice>
      <PaperFinish opacity={0.45} vignette={0.6} />
      {fFin < 0 && null}
    </Rig>
  );
};

// la primera página: la primera línea se ilumina y salen mariposas
const FirstLine: React.FC<{ t0: number; t1: number; fDec: number; fPri: number; fPar: number }> = ({ t0, t1, fDec, fPri, fPar }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: t0, x: 960, y: 560, s: 1.05 }, { f: fPri, x: 900, y: 420, s: 1.35 }, { f: t1, x: 920, y: 460, s: 1.3 }], 0.5);
  const hi = ramp(frame, fPri - 4, fPri + 26);
  const para = ramp(frame, fPar - 4, fPar + 20);
  const inP = ramp(frame, t0, t0 + 26, easeOut);
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#3A4650'], [100, '#1C2228']]} glows={[{ x: 960, y: 420, r: 900, c: '#FFE6B0', a: 0.35 }]} />
      <Layer z={1} html>
        <div style={{ position: 'absolute', left: 480, top: 120 + (1 - inP) * 700, width: 960, height: 1100, background: '#EFE6D0', transform: `rotate(${-2 - (1 - inP) * 8}deg)`, boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontFamily: '"Special Elite", monospace', fontSize: 40, color: '#1D1A16' }}>1</div>
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} style={{ position: 'absolute', left: 110 + (i === 0 ? 50 : 0), top: 170 + i * 56, width: (i === 15 ? 300 : 700 + random(`fl${i}`) * 40) - (i === 0 ? 50 : 0), height: 11, background: '#3A332B', opacity: 0.6 }} />
          ))}
          <div style={{ position: 'absolute', left: 150, top: 160, height: 30, width: 720 * hi, background: P.yellow, opacity: 0.75 }} />
          <div style={{ position: 'absolute', left: 100, top: 156, width: 10, height: 56 * 5 * para, background: P.yellow, opacity: 0.9 }} />
        </div>
      </Layer>
      {frame > fDec - 4 && (
        <AbsoluteFill>
          {Array.from({ length: 9 }).map((_, i) => {
            const t = (frame - fDec + 4 - i * 4) / 50;
            if (t < 0) return null;
            return <Butterfly key={i} x={640 + i * 78 + Math.sin(t * 4 + i) * 40} y={400 - t * 300} size={58 + (i % 3) * 14} seed={`fl${i}`} glow={0.7} opacity={Math.min(1, t * 5)} />;
          })}
        </AbsoluteFill>
      )}
      <PaperFinish opacity={0.4} vignette={0.6} />
      <Slate text="la primera línea" a={fPri + 4} b={fPri + 30} out={t1 - 16} x={110} y={940} />
    </Rig>
  );
};

// la apuesta: un tapete verde; la pila de «lo que vendía» frente a las ocho pilas de la primera tirada
const BetShot: React.FC<{ t0: number; t1: number; fApu: number; fMil: number; fOcho: number }> = ({ t0, t1, fApu, fMil, fOcho }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: t0, x: 960, y: 560, s: 1.05 }, { f: fOcho, x: 1000, y: 560, s: 1.0 }, { f: t1, x: 1020, y: 540, s: 1.08 }], 0.5);
  const push = ramp(frame, fOcho - 6, fOcho + 24, easeOut);
  const back = ramp(frame, fOcho + 34, fOcho + 60, easeInOut);
  const one = rampOut(frame, fMil - 10, fMil + 6);
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#14301F'], [100, '#0A1A10']]} glows={[{ x: 960, y: 500, r: 900, c: '#FFE6B0', a: 0.35 }]} />
      <Layer z={1}>
        {/* tapete */}
        <ellipse cx={960} cy={700} rx={1100} ry={420} fill="#1E5233" />
        <ellipse cx={960} cy={700} rx={1040} ry={380} fill="none" stroke="#E9D7B0" strokeWidth={3} opacity={0.3} />
        <g transform={`translate(0 ${(1 - one) * -60})`} opacity={Math.min(1, one * 3)}><BookStack x={420} y={760} n={10} w={96} seed="b1" grow={1} c="#6E2B26" /></g>
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={i} transform={`translate(${(1 - push) * 300} 0)`}>
            <BookStack x={690 + i * 122} y={760} n={10} w={96} seed={`b8${i}`} grow={rampOut(frame, fOcho - 10 + i * 3, fOcho + 6 + i * 3)} c="#6E2B26" />
          </g>
        ))}
        {frame > fOcho - 12 && <Hand x={1650 + (1 - push) * 420 + back * 520} y={700} rot={180} scale={1.5} curl={0.2} c="#0A0705" sleeve="#1E1612" flip />}
      </Layer>
      <PaperFinish opacity={0.45} vignette={0.6} />
      <CardTag text="lo que vendía: 1.000" x={230} y={190} a={fMil - 6} rot={-3} />
      <CardTag text="primera tirada: 8.000" x={1100} y={140} a={fOcho + 4} rot={3} red />
      <Slate text="Editorial Sudamericana" a={t0 + 4} b={t0 + 40} out={fApu - 14} x={110} y={940} />
      <Slate text="una apuesta enorme" a={fApu - 2} b={fApu + 30} out={fMil - 10} x={110} y={940} />
    </Rig>
  );
};

export const CardTag: React.FC<{ text: string; x: number; y: number; a: number; rot?: number; red?: boolean; size?: number }> = ({ text, x, y, a, rot = 0, red = false, size = 64 }) => {
  const frame = useCurrentFrame();
  const p = sp(frame, a, 13, 170);
  if (frame < a - 2) return null;
  return <div style={{ position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg) scale(${0.85 + 0.15 * p})`, opacity: Math.min(1, p * 2), background: '#F4EAD5', padding: '14px 30px', boxShadow: '0 16px 30px rgba(0,0,0,0.5)', fontFamily: '"Caveat", cursive', fontWeight: 700, fontSize: size, color: red ? '#B5262B' : '#2A2620', whiteSpace: 'nowrap' }}>{text}</div>;
};

// la imprenta (mayo de 1967)
const PressShot: React.FC<{ t0: number; t1: number; fImp: number; fMayo: number }> = ({ t0, t1, fImp, fMayo }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: t0, x: 960, y: 600, s: 1.0 }, { f: t1, x: 1040, y: 620, s: 1.12 }], 0.6);
  const pile = interpolate(frame, [t0, t1], [0.2, 1], clamp);
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#4A3A2A'], [100, '#1E1610']]} glows={[{ x: 1300, y: 300, r: 800, c: '#FFE6B0', a: 0.35 }]} />
      <Layer z={0.5}>
        {Array.from({ length: 4 }).map((_, i) => <rect key={i} x={200 + i * 420} y={120} width={300} height={360} fill="#8A7A5A" opacity={0.35} />)}
        <g transform="translate(1600 260)" opacity={rampOut(frame, fMayo - 10, fMayo + 6)}>
          <rect x={-100} y={-90} width={200} height={190} fill="#EDE2C8" />
          <rect x={-100} y={-90} width={200} height={50} fill="#7A2E2A" />
          <text x={0} y={-56} textAnchor="middle" fontFamily='"Ubuntu", sans-serif' fontWeight={700} fontSize={28} letterSpacing={6} fill="#F4EAD5">MAYO</text>
          <text x={0} y={60} textAnchor="middle" fontFamily='"EB Garamond", serif' fontWeight={700} fontSize={84} fill="#1D1A16">1967</text>
        </g>
      </Layer>
      <Layer z={1}>
        <rect x={-300} y={900} width={2500} height={400} fill="#120C08" />
        <Press x={760} y={900} c="#120C08" frame={frame} />
        <BookStack x={1340} y={900} n={20} seed="pr1" grow={pile} c="#2A2018" />
        <BookStack x={1490} y={900} n={20} seed="pr2" grow={Math.max(0, pile - 0.3) / 0.7} c="#2A2018" />
        <Person x={1700} y={900} scale={2.4} face={-1} kind="man" hair="cap" pose={{ shF: 40, elF: 60, shB: 30, elB: 70 }} c="#120C08" />
      </Layer>
      <PaperFinish opacity={0.45} vignette={0.6} warm={0.4} />
      {fImp < 0 && null}
    </Rig>
  );
};

// La librería de Buenos Aires (misma calle en la llegada y en el «agotado»). `book(i)` → [visible 0..1, desplazamiento y].
const BOOK_C = ['#6E2B26', '#2C4A5A', '#B5262B', '#38553A'];
const Bookstore: React.FC<{ book: (i: number) => [number, number]; children?: React.ReactNode; front?: React.ReactNode }> = ({ book, children, front }) => (
  <>
    <Sky stops={[[0, '#9DB4C2'], [60, '#D2DCDC'], [100, '#E9DDC4']]} />
    <Layer z={0.3}>
      <path d="M 1500 860 L 1500 200 L 1515 160 L 1530 200 L 1530 860 Z" fill="#7B8E96" />
      {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-200 + i * 190} y={520 - random(`bb${i}`) * 180} width={180} height={500} fill="#8A9CA4" opacity={0.8} />)}
    </Layer>
    <Layer z={1}>
      <rect x={900} y={300} width={900} height={600} fill="#22262A" />
      <rect x={960} y={340} width={780} height={70} fill="#15181C" />
      <text x={1350} y={390} textAnchor="middle" fontFamily='"EB Garamond", serif' fontWeight={700} fontSize={50} letterSpacing={16} fill={WARM}>LIBRERÍA</text>
      <rect x={980} y={450} width={740} height={400} fill="#F2C47A" />
      {Array.from({ length: 12 }).map((_, i) => {
        const [p, dy] = book(i);
        if (p <= 0) return null;
        return <g key={i} opacity={p} transform={`translate(${1020 + (i % 6) * 118} ${520 + Math.floor(i / 6) * 160 + dy})`}><rect x={0} y={0} width={90} height={128} fill={BOOK_C[i % 4]} /><rect x={8} y={14} width={74} height={6} fill="#F2E6CB" opacity={0.7} /></g>;
      })}
      {children}
      <rect x={-300} y={900} width={2500} height={300} fill="#22262A" />
      <rect x={-300} y={900} width={2500} height={8} fill="#363B40" />
    </Layer>
    {front}
  </>
);

// Buenos Aires: llega el camión, el escaparate de la librería se llena
const StoreShot: React.FC<{ t0: number; end: number; fBue: number; fJun: number }> = ({ t0, end, fBue, fJun }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: t0, x: 960, y: 600, s: 1.0 }, { f: end, x: 1060, y: 600, s: 1.18 }], 0.6);
  const truckX = interpolate(frame, [t0, t0 + 50], [-500, 560], { ...clamp, easing: easeOut });
  return (
    <Rig cam={cam}>
      <Bookstore book={(i) => { const p = ramp(frame, fJun - 20 + i * 3, fJun + i * 3); return [p, (1 - p) * 30]; }}>
        {/* camión de reparto */}
        <g transform={`translate(${truckX} 900)`}>
          <rect x={-260} y={-230} width={300} height={200} fill="#15181C" />
          <path d="M 40 -160 L 140 -160 L 190 -90 L 190 -30 L 40 -30 Z" fill="#15181C" />
          <path d="M 60 -150 L 130 -150 L 168 -96 L 60 -96 Z" fill="#9DB4C2" />
          <circle cx={-170} cy={-26} r={30} fill="#0B0D0F" />
          <circle cx={120} cy={-26} r={30} fill="#0B0D0F" />
          <text x={-110} y={-120} textAnchor="middle" fontFamily='"Special Elite", monospace' fontSize={26} fill="#E9D7B0">LIBROS</text>
        </g>
      </Bookstore>
      <PaperFinish opacity={0.45} vignette={0.5} />
      <Slate text="Buenos Aires · junio de 1967" a={fBue - 4} b={fBue + 40} out={end - 10} x={110} y={960} />
    </Rig>
  );
};

// ——— AGOTADO v2 · W25 ———
export const Agotado2: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('AGOTADO');
  const fAgo = c.at('W25', 'agota');
  const fSem = c.at('W25', 'semanas');
  const fAnt = c.at('W25', 'Antes');
  const fCua = c.at('W25', 'cuatro');
  const fEdi = c.at('W25', 'ediciones');
  const fCuar = c.at('W25', 'cuarenta');
  const fEn = c.at('W25', 'En', 1);
  const fMed = c.at('W25', 'medio');
  const end = c.dur;
  const tEd = fAnt - 6;
  const tCity = fEn - 8;
  return (
    <AbsoluteFill style={{ background: '#05080B' }}>
      {frame < tEd ? <SoldOut t1={tEd} fAgo={fAgo} fSem={fSem} /> : frame < tCity ? <Editions t0={tEd} t1={tCity} fAnt={fAnt} fCua={fCua} fEdi={fEdi} fCuar={fCuar} /> : <HalfMillion t0={tCity} end={end} fEn={fEn} fMed={fMed} />}
      {[0, 1, 2, 3, 4, 5].map((i) => <Sfx key={i} name="sk_book_slide" at={fAgo - 8 + i * 9} volume={0.3} />)}
      <Sfx name="stamp" at={fSem} volume={0.9} />
      {[0, 1, 2, 3, 4, 5].map((i) => <Sfx key={i} name="page_turn" at={fAnt + 4 + i * 12} volume={0.3} />)}
      {[1, 2, 3].map((i) => <Sfx key={i} name="sk_book_thud" at={fCua - 6 + i * 12 + 10} volume={0.45} />)}
      <Sfx name="counter" at={fCuar - 4} volume={0.35} dur={34} fade={8} />
      <Sfx name="counter" at={fEn + 8} volume={0.35} />
      <Sfx name="counter" at={fEn + 8 + 56} volume={0.35} dur={fMed + 16 - fEn - 56} fade={8} />
      <Sfx name="hdl_flutter" at={fMed + 4} volume={0.6} />
    </AbsoluteFill>
  );
};

// «Se agota en pocas semanas»: los lectores salen de la librería con su ejemplar y el escaparate se vacía
const READERS: { kind: Kind; hair: Hair; c: string }[] = [
  { kind: 'man', hair: 'short', c: '#101317' },
  { kind: 'woman', hair: 'bob', c: '#15181C' },
  { kind: 'man', hair: 'cap', c: '#0E1114' },
  { kind: 'woman', hair: 'bun', c: '#121519' },
  { kind: 'boy', hair: 'kid', c: '#101317' },
  { kind: 'man', hair: 'side', c: '#15181C' },
];
const SoldOut: React.FC<{ t1: number; fAgo: number; fSem: number }> = ({ t1, fAgo, fSem }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: 0, x: 1060, y: 600, s: 1.18 }, { f: fSem, x: 1200, y: 610, s: 1.24 }, { f: t1, x: 1350, y: 620, s: 1.5 }], 0.5);
  const sign = sp(frame, fSem - 4, 10, 160);
  const startOf = (i: number) => fAgo - 14 + i * 9;
  return (
    <Rig cam={cam}>
      <Bookstore book={(i) => { const g = ramp(frame, startOf(i % 6) - 4 + Math.floor(i / 6) * 4, startOf(i % 6) + 4 + Math.floor(i / 6) * 4); return [1 - g, -g * 60]; }}>
        <g transform={`translate(1350 ${640 - (1 - sign) * 200}) rotate(${-6 + (1 - sign) * 20})`} opacity={Math.min(1, sign * 2)}>
          <line x1={-120} y1={-100} x2={0} y2={-180} stroke="#22262A" strokeWidth={4} />
          <line x1={120} y1={-100} x2={0} y2={-180} stroke="#22262A" strokeWidth={4} />
          <rect x={-200} y={-100} width={400} height={130} rx={8} fill="#F4EAD5" stroke="#B5262B" strokeWidth={8} />
          <text x={0} y={-12} textAnchor="middle" fontFamily='"EB Garamond", serif' fontWeight={700} fontSize={72} letterSpacing={6} fill="#B5262B">AGOTADO</text>
        </g>
      </Bookstore>
      <Layer z={1.12}>
        {READERS.map((r, i) => {
          const t = frame - startOf(i);
          if (t < 0) return null;
          const x = 1300 - t * 7.5;
          return <Person key={i} x={x} y={1010} scale={2.1} face={-1} kind={r.kind} hair={r.hair} c={r.c} pose={{ ...walkPose(t * 0.32, 0.9), shF: 58, elF: 70 }}
            front={<rect x={-16} y={-6} width={32} height={44} rx={2} fill={BOOK_C[i % 4]} />} />;
        })}
      </Layer>
      <PaperFinish opacity={0.4} vignette={0.5} />
      <Slate text="en pocas semanas" a={fSem - 2} b={fSem + 26} out={t1 - 10} x={110} y={960} />
    </Rig>
  );
};

const MONTHS = ['JUNIO', 'JULIO', 'AGOSTO', 'SEPT.', 'OCTUBRE', 'NOV.', 'DIC.'];
const Editions: React.FC<{ t0: number; t1: number; fAnt: number; fCua: number; fEdi: number; fCuar: number }> = ({ t0, t1, fAnt, fCua, fEdi, fCuar }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: t0, x: 960, y: 560, s: 1.08 }, { f: t1, x: 960, y: 560, s: 1.14 }], 0.5);
  const count = Math.round(interpolate(frame, [fCuar - 4, fCuar + 30], [8000, 42000], { ...clamp, easing: easeOut }) / 1000) * 1000;
  // «antes de acabar el año»: el calendario de la imprenta pasa de junio a diciembre
  const m = Math.min(MONTHS.length - 1, Math.max(0, Math.floor(interpolate(frame, [fAnt + 4, fCua - 8], [0, MONTHS.length - 0.01], clamp))));
  const calOut = ramp(frame, fEdi + 6, fEdi + 20);
  const N = [6, 11, 16, 21];
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#4A3A2A'], [100, '#1E1610']]} glows={[{ x: 960, y: 300, r: 900, c: '#FFE6B0', a: 0.35 }]} />
      <Layer z={0.6} opacity={1 - calOut}>
        <g transform={`translate(960 ${250 - calOut * 80})`}>
          <rect x={-120} y={-108} width={240} height={226} fill="#EDE2C8" />
          <rect x={-120} y={-108} width={240} height={60} fill="#7A2E2A" />
          <text x={0} y={-66} textAnchor="middle" fontFamily='"Ubuntu", sans-serif' fontWeight={700} fontSize={30} letterSpacing={5} fill="#F4EAD5">{MONTHS[m]}</text>
          <text x={0} y={72} textAnchor="middle" fontFamily='"EB Garamond", serif' fontWeight={700} fontSize={96} fill="#1D1A16">1967</text>
          {/* la hoja que se arranca */}
          {frame > fAnt && frame < fCua && (() => { const k = interpolate(frame, [fAnt + 4, fCua - 8], [0, MONTHS.length - 0.01], clamp) % 1; return <rect x={-120} y={-108 + k * 200} width={240} height={226} fill="#EDE2C8" opacity={1 - k} transform={`rotate(${k * 26} 120 -108)`} />; })()}
        </g>
      </Layer>
      <Layer z={1}>
        <rect x={-300} y={880} width={2500} height={400} fill="#120C08" />
        {[0, 1, 2, 3].map((i) => {
          const g = i === 0 ? 1 : ramp(frame, fCua - 6 + i * 12, fCua + 14 + i * 12, easeOut);
          return (
            <g key={i}>
              <BookStack x={460 + i * 330} y={880} n={N[i]} w={200} seed={`ed${i}`} grow={g} c="#2A2018" />
              <g opacity={i === 0 ? 1 : g} transform={`translate(${460 + i * 330} ${880 - N[i] * 20 * g - 70}) rotate(${(i - 1.5) * 4})`}>
                <circle r={46} fill="#F4EAD5" stroke="#B5262B" strokeWidth={5} />
                <text y={14} textAnchor="middle" fontFamily='"EB Garamond", serif' fontWeight={700} fontSize={40} fill="#B5262B">{i + 1}ª</text>
              </g>
            </g>
          );
        })}
      </Layer>
      <PaperFinish opacity={0.45} vignette={0.6} warm={0.4} />
      <CardTag text="cuatro ediciones" x={140} y={140} a={fCua - 4} rot={-3} />
      {frame >= fCuar - 6 && <CardTag text={`más de ${count.toLocaleString('de-DE')} ejemplares`} x={1040} y={130} a={fCuar - 6} rot={3} red />}
    </Rig>
  );
};

// «En tres años, más de medio millón»: vuelve la ciudad de libros de la apertura, bajo la misma luna
const HalfMillion: React.FC<{ t0: number; end: number; fEn: number; fMed: number }> = ({ t0, end, fEn, fMed }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: t0, x: 960, y: 700, s: 1.25 }, { f: fMed, x: 960, y: 520, s: 1.0 }, { f: end, x: 960, y: 500, s: 0.97 }], 0.5);
  const grow = (i: number) => ramp(frame, t0 + PILES[i].d, fMed + 10 + PILES[i].d, easeOut);
  const n = Math.round(interpolate(frame, [fEn + 8, fMed + 16], [42000, 500000], { ...clamp, easing: easeInOut }) / 1000) * 1000;
  const cnt = ramp(frame, fEn, fEn + 12);
  const done = ramp(frame, fMed + 12, fMed + 22);
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#060B12'], [55, '#0F1D2C'], [100, '#1B2A37']]} glows={[{ x: 330, y: 190, r: 380, c: '#F3EBD8', a: 0.2 }, { x: 960, y: 900, r: 900, c: '#E6A35C', a: 0.3 }]} />
      <Layer z={0.1}>
        <circle cx={330} cy={190} r={52} fill="#F1E7CF" />
        {Array.from({ length: 90 }).map((_, i) => (
          <circle key={i} cx={random(`ls${i}`) * 1920} cy={random(`ly${i}`) * 700 - 100} r={0.8 + random(`lr${i}`) * 1.7} fill="#F3EAD6" opacity={(0.3 + random(`lo${i}`) * 0.6) * (0.6 + 0.4 * Math.sin(frame / (18 + (i % 11)) + i))} />
        ))}
      </Layer>
      <Layer z={0.55}>{PILES.map((p, i) => i % 2 === 1 && <BookPile key={i} x={p.x} base={1030} n={p.n} w={p.w * 0.8} grow={grow(i)} seed={`pb${i}`} c="#16232F" />)}</Layer>
      <Layer z={0.85}>{PILES.map((p, i) => i % 2 === 0 && <BookPile key={i} x={p.x} base={1090} n={p.n} w={p.w} grow={grow(i)} seed={`pa${i}`} c="#0B131B" />)}</Layer>
      {frame > fMed && <AbsoluteFill>{Array.from({ length: 10 }).map((_, i) => <Butterfly key={i} x={260 + i * 160 + Math.sin(frame / 10 + i) * 40} y={760 - (frame - fMed - i * 3) * (2.2 + (i % 3) * 0.8)} size={40 + (i % 3) * 10} seed={`hm${i}`} glow={0.7} opacity={ramp(frame, fMed + i * 3, fMed + i * 3 + 10)} />)}</AbsoluteFill>}
      <PaperFinish opacity={0.45} vignette={0.6} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', opacity: cnt, transform: `scale(${1 + done * 0.06})` }}>
        <div style={{ fontFamily: '"EB Garamond", serif', fontWeight: 700, fontSize: 150, color: '#F3E9D6', textShadow: '0 0 40px rgba(255,214,140,0.45), 0 6px 20px rgba(0,0,0,0.6)', letterSpacing: 2 }}>{n.toLocaleString('de-DE')}</div>
        <div style={{ fontFamily: '"Special Elite", monospace', fontSize: 40, color: '#E9D7B0', marginTop: -10, letterSpacing: 2 }}>ejemplares</div>
      </div>
      <CardTag text="en tres años" x={1330} y={120} a={fEn - 4} rot={3} />
      <CardTag text="más de medio millón" x={1180} y={600} a={fMed + 4} rot={-3} red />
    </Rig>
  );
};

export const _s = { Halo, mix, walkPose, easeInOut, P };
export type _Pose = Pose;
