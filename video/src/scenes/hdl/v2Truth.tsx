import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { Butterfly, P, ramp, rampOut, sp } from './kit';
import { sceneClock } from './timeline';
import { CamS, Head, Layer, PaperFinish, Person, Rig, Sky, useCamera, walkPose } from './theatre';
import { Banana, CaribHouseSil, Ridge, Tree } from './sets';
import { PinCard } from './v2Road';
import { BookPile, PILES } from './v2Open';

// ————————————————————————————————————————————————————————————————
// Capítulo VIII · ¿Pasó de verdad? (v2): el tablero de corcho de la investigación
// ————————————————————————————————————————————————————————————————
// Es el mismo tablero de «Vuelta» (título arriba a la izquierda, la cita de Acapulco clavada en 380,330), pero más grande:
// la cámara lo recorre y, al final, se aleja para verlo entero.

const BW = 3000, BH = 1900;
const INKC = '#2A2620';

// Tablero grande; `cam` en coordenadas del tablero.
const Board: React.FC<{ cam: CamS; children?: React.ReactNode; strings?: React.ReactNode }> = ({ cam, children, strings }) => (
  <AbsoluteFill style={{ background: '#140C07', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', left: 0, top: 0, width: BW, height: BH, transformOrigin: '0 0', transform: `translate(${960 - cam.x * cam.s}px, ${540 - cam.y * cam.s}px) scale(${cam.s})` }}>
      <div style={{ position: 'absolute', left: -60, top: -60, width: BW + 120, height: BH + 120, background: '#3A2416', boxShadow: 'inset 0 0 0 14px #2A1A10' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 1300px 900px at 960px 560px, #B7875A 0%, #9A7048 45%, #845C38 75%, #6E4A2C 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(60,35,15,0.35) 1px, transparent 1.6px), radial-gradient(rgba(255,230,190,0.18) 1px, transparent 1.6px)', backgroundSize: '9px 9px, 13px 13px', backgroundPosition: '0 0, 4px 6px' }} />
      <div style={{ position: 'absolute', left: 90, top: 60, fontFamily: '"Caveat", cursive', fontWeight: 700, fontSize: 92, color: '#2A1A10', transform: 'rotate(-2deg)' }}>¿Pasó de verdad?</div>
      {children}
      <svg width={BW} height={BH} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>{strings}</svg>
    </div>
    {/* la luz de la lámpara, que sigue a la cámara */}
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse 900px 640px at 50% 45%, rgba(255,226,170,0.16) 0%, rgba(255,226,170,0) 70%)' }} />
  </AbsoluteFill>
);

// Hilo rojo entre dos chinchetas, que se tiende de a → b.
const RedString: React.FC<{ a: [number, number]; b: [number, number]; at: number; dur?: number; sag?: number }> = ({ a, b, at, dur = 16, sag = 40 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: easeOut });
  if (p <= 0) return null;
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 + sag;
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]) * 1.1 + sag;
  return (
    <g>
      <path d={`M ${a[0]} ${a[1]} Q ${mx} ${my} ${b[0]} ${b[1]}`} stroke="rgba(0,0,0,0.3)" strokeWidth={5} fill="none" transform="translate(4 6)" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
      <path d={`M ${a[0]} ${a[1]} Q ${mx} ${my} ${b[0]} ${b[1]}`} stroke="#B5262B" strokeWidth={4} fill="none" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
      {[a, b].map((q, i) => <circle key={i} cx={q[0]} cy={q[1]} r={9} fill="#C9302C" stroke="rgba(0,0,0,0.3)" strokeWidth={2} />)}
    </g>
  );
};

// Sello de goma (HTML, sobre una ficha).
const Stamp2: React.FC<{ text: string; at: number; x: number; y: number; rot?: number; size?: number; round?: boolean }> = ({ text, at, x, y, rot = -12, size = 60, round = false }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const k = 1 + 0.5 * (1 - ramp(frame, at, at + 6));
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${k})`, border: `${Math.max(4, size / 12)}px solid #B5262B`, borderRadius: round ? '50%' : 10,
      padding: round ? 0 : `0 ${size * 0.3}px`, width: round ? size * 1.7 : undefined, height: round ? size * 1.7 : undefined, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: '"EB Garamond", serif', fontWeight: 700, fontSize: size, color: '#B5262B', opacity: 0.9, letterSpacing: 3, whiteSpace: 'nowrap' }}>{text}</div>
  );
};

// Nota manuscrita suelta sobre el corcho (aparece escribiéndose).
const Note: React.FC<{ text: string; x: number; y: number; a: number; rot?: number; size?: number; c?: string }> = ({ text, x, y, a, rot = 0, size = 56, c = '#F4EAD5' }) => {
  const frame = useCurrentFrame();
  if (frame < a) return null;
  const p = interpolate(frame, [a, a + 18], [0, 1], clamp);
  return <div style={{ position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg)`, fontFamily: '"Caveat", cursive', fontWeight: 700, fontSize: size, color: c, whiteSpace: 'nowrap', clipPath: `inset(-20% ${(1 - p) * 100}% -20% -2%)`, textShadow: '0 3px 10px rgba(0,0,0,0.45)' }}>{text}</div>;
};

// La papeleta de franqueo del prólogo, en pequeño, con su importe.
const Receipt: React.FC<{ amount: string }> = ({ amount }) => (
  <div style={{ fontFamily: '"Special Elite", monospace', color: '#5A2A22' }}>
    <div style={{ fontFamily: '"EB Garamond", serif', fontWeight: 700, fontSize: 30, letterSpacing: 9 }}>FRANQUEO</div>
    <div style={{ height: 2, background: '#5A2A22', opacity: 0.6, margin: '8px 0 14px' }} />
    <div style={{ fontSize: 17, letterSpacing: 2 }}>IMPORTE</div>
    <div style={{ fontFamily: '"Caveat", cursive', fontWeight: 700, fontSize: 92, color: '#3B3A44', lineHeight: 1.05 }}>{amount}</div>
  </div>
);

// Lo que llevaban en el bolsillo.
const Pocket: React.FC<{ amount: string }> = ({ amount }) => (
  <div style={{ fontFamily: '"Special Elite", monospace', color: '#5A2A22' }}>
    <div style={{ fontSize: 20, letterSpacing: 3 }}>EN EL BOLSILLO</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 6 }}>
      <svg width={70} height={60} viewBox="0 0 70 60">{[[18, 40], [42, 44], [30, 22]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={15} fill="#C9A45C" stroke="#8A6A2C" strokeWidth={3} /><circle cx={x} cy={y} r={8} fill="none" stroke="#8A6A2C" strokeWidth={2} /></g>)}</svg>
      <div style={{ fontFamily: '"Caveat", cursive', fontWeight: 700, fontSize: 92, color: '#3B3A44', lineHeight: 1.05 }}>{amount}</div>
    </div>
  </div>
);

// Recorte genérico (una entrevista): solo líneas, sin texto inventado.
const Clipping: React.FC<{ seed: string; hi?: number }> = ({ seed, hi = 0 }) => (
  <div>
    <div style={{ height: 14, width: '70%', background: INKC, opacity: 0.8 }} />
    {Array.from({ length: 6 }).map((_, k) => {
      const w = 70 + random(`${seed}${k}`) * 30;
      const isHi = k === 2 + Math.floor(random(`${seed}h`) * 3);
      return <div key={k} style={{ height: 8, width: `${w}%`, marginTop: 14, background: INKC, opacity: 0.35, boxShadow: isHi && hi > 0 ? `0 0 0 6px rgba(243,198,75,${0.8 * hi})` : undefined }} />;
    })}
  </div>
);

const Bust: React.FC<{ hair?: 'short' | 'side' | 'bald'; glasses?: boolean }> = ({ hair = 'short' }) => (
  <svg width={110} height={120} viewBox="0 0 110 120">
    <rect width={110} height={120} fill="#D8C9A8" />
    <path d="M 10 120 C 14 92, 34 82, 55 82 C 76 82, 96 92, 100 120 Z" fill="#2A2620" />
    <g transform="translate(36 86) scale(0.55)"><Head x={0} y={0} h={110} hair={hair} c="#2A2620" /></g>
  </svg>
);

// ——— VERSIONES v2 · W29 ———
const RECEIPTS = { r82: [1260, 300], r83: [1640, 340], p45: [1260, 820], p53: [1640, 860] } as const;
const CLIPS = Array.from({ length: 6 }).map((_, i) => ({ x: 2080 + (i % 2) * 430, y: 220 + Math.floor(i / 2) * 330 + (i % 2) * 50, r: (random(`cl${i}`) - 0.5) * 10 }));

export const Versiones2: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('VERSIONES');
  const fPro = c.at('W29', 'problema');
  const fGar = c.at('W29', 'García');
  const fMuch = c.at('W29', 'muchas');
  const fIgual = c.at('W29', 'igual');
  const f82 = c.at('W29', 'ochenta');
  const f83 = c.at('W29', 'ochenta', 1);
  const f45 = c.at('W29', 'cuarenta');
  const f53 = c.at('W29', 'cincuenta');
  const end = c.dur;
  const cam = useCamera([
    { f: 0, x: 1520, y: 450, s: 1.7 },
    { f: fPro + 10, x: 1500, y: 560, s: 1.25 },
    { f: fMuch + 10, x: 1500, y: 860, s: 0.66 },
    { f: fIgual + 30, x: 1500, y: 860, s: 0.64 },
    { f: f82 - 8, x: 1600, y: 520, s: 1.3 },
    { f: f83 + 30, x: 1600, y: 560, s: 1.3 },
    { f: f45 - 8, x: 1600, y: 1000, s: 1.3 },
    { f: end, x: 1600, y: 1040, s: 1.34 },
  ], 0.4);
  const placeholder = 1 - ramp(frame, fPro - 6, fPro + 8);
  return (
    <AbsoluteFill>
      <Board cam={cam} strings={<>
        <RedString a={[RECEIPTS.r82[0] + 150, RECEIPTS.r82[1] - 6]} b={[RECEIPTS.r83[0] + 150, RECEIPTS.r83[1] - 6]} at={f83 + 14} sag={150} />
        <RedString a={[RECEIPTS.p45[0] + 150, RECEIPTS.p45[1] - 6]} b={[RECEIPTS.p53[0] + 150, RECEIPTS.p53[1] - 6]} at={f53 + 14} sag={150} />
      </>}>
        <QuoteCardStatic />
        {/* el hueco del «continuará…» */}
        <div style={{ position: 'absolute', left: 1260, top: 300, width: 520, height: 300, border: '3px dashed rgba(42,26,16,0.35)', opacity: placeholder }} />
        <div style={{ position: 'absolute', left: 1290, top: 420, fontFamily: '"Caveat", cursive', fontSize: 46, color: 'rgba(42,26,16,0.55)', opacity: placeholder }}>continuará…</div>
        {/* «la contó muchas veces»: recortes de entrevistas */}
        {CLIPS.map((k, i) => (
          <PinCard key={i} x={k.x} y={k.y} w={340} rot={k.r} at={fGar + i * 9} frame={frame} pin={i % 2 ? '#C9302C' : P.yellow} bg="#E9E0CC">
            <Clipping seed={`cl${i}`} hi={ramp(frame, fIgual - 6 + i * 3, fIgual + 6 + i * 3)} />
          </PinCard>
        ))}
        <Note text="contada muchas veces…" x={2120} y={1250} a={fMuch} rot={-3} size={72} />
        <Note text="…y no siempre igual" x={2200} y={1350} a={fIgual - 4} rot={-2} size={72} c="#F3C64B" />
        <PinCard x={RECEIPTS.r82[0]} y={RECEIPTS.r82[1]} w={300} rot={-4} at={f82 - 8} frame={frame} bg="#EFE3C8"><Receipt amount="$ 82.00" /></PinCard>
        <PinCard x={RECEIPTS.r83[0]} y={RECEIPTS.r83[1]} w={300} rot={5} at={f83 - 8} frame={frame} bg="#EFE3C8" pin="#C9302C"><Receipt amount="$ 83.00" /></PinCard>
        <Note text="¿82 o 83?" x={1450} y={680} a={f83 + 24} rot={-3} size={70} />
        <PinCard x={RECEIPTS.p45[0]} y={RECEIPTS.p45[1]} w={300} rot={3} at={f45 - 8} frame={frame} bg="#EFE3C8"><Pocket amount="$ 45" /></PinCard>
        <PinCard x={RECEIPTS.p53[0]} y={RECEIPTS.p53[1]} w={300} rot={-5} at={f53 - 8} frame={frame} bg="#EFE3C8" pin="#C9302C"><Pocket amount="$ 53" /></PinCard>
        <Note text="¿45 o 53?" x={1450} y={1190} a={f53 + 24} rot={2} size={70} />
      </Board>
      <PaperFinish opacity={0.3} vignette={0.55} />
      {CLIPS.map((_, i) => <Sfx key={i} name="sk_pin" at={fGar + i * 9 + 2} volume={0.35} />)}
      <Sfx name="marker" at={fIgual} volume={0.4} />
      {[f82, f83, f45, f53].map((f, i) => <Sfx key={i} name="sk_pin" at={f - 6} volume={0.6} />)}
      <Sfx name="sk_string" at={f83 + 14} volume={0.5} />
      <Sfx name="sk_string" at={f53 + 14} volume={0.5} />
      <Sfx name="zoom_out" at={fMuch - 6} volume={0.4} />
    </AbsoluteFill>
  );
};

// La cita de Acapulco tal como quedó clavada en «Vuelta».
const QuoteCardStatic: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div style={{ position: 'absolute', left: 380, top: 330, width: 700, transform: 'rotate(-3deg)', background: '#F4EAD5', padding: '40px 46px', boxShadow: '0 22px 40px rgba(40,20,5,0.45)' }}>
    <div style={{ fontFamily: '"EB Garamond", serif', fontStyle: 'italic', fontWeight: 500, fontSize: 66, lineHeight: 1.1, color: '#1D1A16' }}>«Nunca llegué a Acapulco.»</div>
    <div style={{ marginTop: 18, fontFamily: '"Ubuntu", sans-serif', fontWeight: 500, fontSize: 28, color: '#7A6650' }}>— Gabriel García Márquez</div>
    <div style={{ position: 'absolute', left: '50%', top: -12, width: 30, height: 30, marginLeft: -15, borderRadius: '50%', background: P.yellow, boxShadow: '0 4px 6px rgba(0,0,0,0.4)' }} />
    {children}
  </div>
);

// Postal de la playa (silueta).
const Postcard: React.FC<{ frame: number; uneasy: number }> = ({ frame, uneasy }) => (
  <svg width={500} height={330} viewBox="0 0 500 330">
    <defs>
      <linearGradient id="pcsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E58E5A" /><stop offset="1" stopColor="#F7D9A0" /></linearGradient>
    </defs>
    <rect width={500} height={330} fill="url(#pcsky)" />
    <circle cx={330} cy={150} r={46} fill="#FFF0C8" opacity={0.9} />
    <rect y={170} width={500} height={80} fill="#4E7F94" />
    {[0, 1, 2].map((k) => <path key={k} d={`M 0 ${186 + k * 18} Q 60 ${180 + k * 18 + Math.sin(frame / 10 + k) * 3} 120 ${186 + k * 18} T 240 ${186 + k * 18} T 360 ${186 + k * 18} T 500 ${186 + k * 18}`} stroke="#9CC4D4" strokeWidth={2} fill="none" opacity={0.6} />)}
    <rect y={250} width={500} height={80} fill="#E8CF9C" />
    <path d="M 80 260 C 76 200, 90 140, 110 100" stroke="#2A1A10" strokeWidth={9} fill="none" />
    {[-60, -20, 20, 60, 110, 160].map((a, i) => <path key={i} d={`M 110 100 q ${Math.cos((a * Math.PI) / 180) * 50} ${Math.sin((a * Math.PI) / 180) * 30 - 20} ${Math.cos((a * Math.PI) / 180) * 80} ${Math.sin((a * Math.PI) / 180) * 50 + 10}`} stroke="#2A1A10" strokeWidth={7} fill="none" />)}
    {/* él, de pie en la arena, inquieto */}
    <g transform="translate(300 300)"><Person x={0} y={0} scale={0.55} face={uneasy > 0.5 ? -1 : 1} kind="man" hair="curly" mustache pose={{ lean: 2, shF: 10 + uneasy * 20, elF: 90 * uneasy, shB: -6, elB: 20 }} c="#2A1A10" /></g>
    <text x={480} y={44} textAnchor="end" fontFamily='"Caveat", cursive' fontWeight={700} fontSize={50} fill="#FFF6E2">Acapulco</text>
  </svg>
);

// La media vuelta (el dibujo de la carretera con el giro).
const UTurnSketch: React.FC = () => (
  <svg width={240} height={150} viewBox="0 0 240 150">
    <rect width={240} height={150} fill="#E9E0CC" />
    <path d="M 10 120 C 70 110, 120 60, 230 50" stroke="#5A4A38" strokeWidth={16} fill="none" />
    <path d="M 10 120 C 70 110, 120 60, 230 50" stroke="#E9E0CC" strokeWidth={2} strokeDasharray="8 8" fill="none" />
    <path d="M 120 82 C 150 60, 170 40, 150 24 C 130 10, 104 30, 112 52" stroke="#B5262B" strokeWidth={6} fill="none" strokeLinecap="round" />
    <path d="M 104 46 L 114 60 L 122 44 Z" fill="#B5262B" />
  </svg>
);

// ——— DUDAS v2 · W30–W31 ———
export const Dudas2: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('DUDAS');
  const fAca = c.at('W30', 'Acapulco');
  const fTamp = c.at('W30', 'tampoco');
  const fEn = c.at('W30', 'En');
  const fPlaya = c.at('W30', 'playa');
  const fPaz = c.at('W30', 'paz');
  const fY = c.at('W30', 'Y', 1);
  const fDas = c.at('W30', 'Dasso');
  const fMed = c.at('W30', 'media');
  const fCarr = c.at('W30', 'carretera');
  const fHay = c.at('W31', 'Hay');
  const fRep = c.at('W31', 'repitió');
  const fRech = c.at('W31', 'rechazado');
  const fSeix = c.at('W31', 'Seix');
  const fPero = c.at('W31', 'Pero');
  const fCarlos = c.at('W31', 'Carlos');
  const fLey = c.at('W31', 'leyó');
  const fPub = c.at('W31', 'publicada');
  const end = c.dur;
  const cam = useCamera([
    { f: 0, x: 1600, y: 1040, s: 1.34 },
    { f: fAca + 16, x: 760, y: 470, s: 1.45 },
    { f: fEn + 10, x: 720, y: 760, s: 1.3 },
    { f: fY, x: 760, y: 820, s: 1.25 },
    { f: fDas + 20, x: 800, y: 1100, s: 1.2 },
    { f: fHay + 10, x: 1700, y: 1430, s: 1.22 },
    { f: fPero, x: 1900, y: 1430, s: 1.22 },
    { f: end, x: 1960, y: 1420, s: 1.28 },
  ], 0.4);
  const uneasy = ramp(frame, fPaz - 20, fPaz + 6);
  const echoes = [[1180, 1330, -4], [1540, 1290, 5], [1250, 1560, 3], [1620, 1540, -6]] as const;
  return (
    <AbsoluteFill>
      <Board cam={cam} strings={<>
        <RedString a={[860, 1258]} b={[1010, 770]} at={fMed - 4} sag={60} />
        <RedString a={[2230, 1316]} b={[1420, 1300]} at={fCarlos + 10} sag={70} />
      </>}>
        <QuoteCardStatic>
          <Stamp2 text="¿?" at={fTamp} x={630} y={60} rot={12} size={70} round />
        </QuoteCardStatic>
        {/* el resto del tablero (de «Versiones») */}
        {CLIPS.map((k, i) => <PinCard key={i} x={k.x} y={k.y} w={340} rot={k.r} at={-100} frame={frame} pin={i % 2 ? '#C9302C' : P.yellow} bg="#E9E0CC"><Clipping seed={`cl${i}`} hi={1} /></PinCard>)}
        <PinCard x={RECEIPTS.r82[0]} y={RECEIPTS.r82[1]} w={300} rot={-4} at={-100} frame={frame} bg="#EFE3C8"><Receipt amount="$ 82.00" /></PinCard>
        <PinCard x={RECEIPTS.r83[0]} y={RECEIPTS.r83[1]} w={300} rot={5} at={-100} frame={frame} bg="#EFE3C8" pin="#C9302C"><Receipt amount="$ 83.00" /></PinCard>
        <PinCard x={RECEIPTS.p45[0]} y={RECEIPTS.p45[1]} w={300} rot={3} at={-100} frame={frame} bg="#EFE3C8"><Pocket amount="$ 45" /></PinCard>
        <PinCard x={RECEIPTS.p53[0]} y={RECEIPTS.p53[1]} w={300} rot={-5} at={-100} frame={frame} bg="#EFE3C8" pin="#C9302C"><Pocket amount="$ 53" /></PinCard>
        <Note text="¿82 o 83?" x={1450} y={680} a={-100} rot={-3} size={70} />
        <Note text="¿45 o 53?" x={1450} y={1190} a={-100} rot={2} size={70} />
        <Note text="contada muchas veces…" x={2120} y={1250} a={-100} rot={-3} size={72} />
        <Note text="…y no siempre igual" x={2200} y={1350} a={-100} rot={-2} size={72} c="#F3C64B" />
        {/* la playa */}
        <PinCard x={300} y={720} w={560} rot={2} at={fEn - 6} frame={frame} bg="#F4EAD5"><Postcard frame={frame} uneasy={uneasy} /></PinCard>
        <Note text="sí llegó a la playa…" x={250} y={1130} a={fPlaya - 4} rot={-2} size={60} />
        <Note text="…ni un minuto de paz" x={330} y={1200} a={fPaz - 10} rot={-1} size={60} c="#F3C64B" />
        {/* la media vuelta y el biógrafo */}
        <PinCard x={890} y={770} w={300} rot={-3} at={fMed - 26} frame={frame} bg="#E9E0CC">
          <UTurnSketch />
          <div style={{ fontFamily: '"Caveat", cursive', fontWeight: 700, fontSize: 44, color: INKC, marginTop: 6 }}>la media vuelta</div>
          <Stamp2 text="¿?" at={fCarr} x={200} y={80} rot={-10} size={56} round />
        </PinCard>
        <PinCard x={640} y={1260} w={440} rot={-2} at={fDas - 8} frame={frame} bg="#F4EAD5">
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <Bust hair="short" />
            <div>
              <div style={{ fontFamily: '"EB Garamond", serif', fontWeight: 700, fontSize: 44, color: INKC, lineHeight: 1 }}>Dasso Saldívar</div>
              <div style={{ fontFamily: '"Special Elite", monospace', fontSize: 22, color: '#7A6650', marginTop: 8, letterSpacing: 2 }}>BIÓGRAFO</div>
            </div>
          </div>
        </PinCard>
        {/* Seix Barral: lo que se repitió durante años */}
        {echoes.map(([x, y, r], i) => (
          <PinCard key={i} x={x} y={y} w={420} rot={r} at={i === 0 ? fRech - 10 : fRep + 6 + i * 8} frame={frame} bg={i === 0 ? '#F4EAD5' : '#E4DAC4'}>
            <div style={{ fontFamily: '"Special Elite", monospace', fontSize: 20, letterSpacing: 3, color: '#7A6650' }}>SE CONTABA</div>
            <div style={{ fontFamily: '"EB Garamond", serif', fontWeight: 600, fontSize: 44, color: INKC, lineHeight: 1.1, marginTop: 10 }}>Seix Barral la rechazó</div>
            {i === 0 && <Stamp2 text="¿MITO?" at={fPub} x={200} y={60} rot={-14} size={60} />}
          </PinCard>
        ))}
        <PinCard x={2080} y={1300} w={460} rot={3} at={fCarlos - 8} frame={frame} bg="#F4EAD5">
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <Bust hair="side" />
            <div>
              <div style={{ fontFamily: '"EB Garamond", serif', fontWeight: 700, fontSize: 44, color: INKC, lineHeight: 1 }}>Carlos Barral</div>
              <div style={{ fontFamily: '"Special Elite", monospace', fontSize: 20, color: '#7A6650', marginTop: 8, letterSpacing: 2 }}>EDITOR DE SEIX BARRAL</div>
            </div>
          </div>
        </PinCard>
        <Note text="no la leyó hasta que" x={2110} y={1500} a={fLey - 8} rot={-2} size={58} />
        <Note text="ya estaba publicada" x={2150} y={1570} a={fLey + 8} rot={-2} size={58} c="#F3C64B" />
      </Board>
      <PaperFinish opacity={0.3} vignette={0.55} />
      <Sfx name="stamp" at={fTamp} volume={0.7} />
      <Sfx name="sk_pin" at={fEn - 4} volume={0.6} />
      <Sfx name="sk_pin" at={fMed - 24} volume={0.5} />
      <Sfx name="sk_pin" at={fDas - 6} volume={0.6} />
      <Sfx name="sk_string" at={fMed - 4} volume={0.5} />
      <Sfx name="stamp" at={fCarr} volume={0.6} />
      <Sfx name="sk_pin" at={fRech - 8} volume={0.6} />
      {[1, 2, 3].map((i) => <Sfx key={i} name="sk_pin" at={fRep + 8 + i * 8} volume={0.35} />)}
      <Sfx name="sk_pin" at={fCarlos - 6} volume={0.6} />
      <Sfx name="sk_string" at={fCarlos + 10} volume={0.5} />
      <Sfx name="stamp" at={fPub} volume={0.8} />
      {fSeix + fAca < 0 && null}
    </AbsoluteFill>
  );
};

// ——— MACONDO v2 · W32 ———
// «¿Exageró Gabo?»: el tablero entero, desde lejos. Luego, de noche, un pueblo de silueta donde lo increíble pasa con
// toda normalidad: él camina tranquilo mientras llueven flores amarillas y las mariposas lo rodean; «Macondo» en el cielo.
export const Macondo2: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('MACONDO');
  const fExa = c.at('W32', 'Exageró');
  const fProb = c.at('W32', 'Probablemente');
  const fPero = c.at('W32', 'Pero');
  const fInv = c.at('W32', 'inventó');
  const fMac = c.at('W32', 'Macondo');
  const fVida = c.at('W32', 'vida');
  const fInc = c.at('W32', 'increíble');
  const fNor = c.at('W32', 'normal');
  const end = c.dur;
  const tTown = fPero - 6;
  return (
    <AbsoluteFill style={{ background: '#05080B' }}>
      {frame < tTown ? <BoardWide t1={tTown} fExa={fExa} fProb={fProb} /> : <Town t0={tTown} end={end} fInv={fInv} fMac={fMac} fVida={fVida} fInc={fInc} fNor={fNor} />}
      <Sfx name="zoom_out" at={2} volume={0.4} />
      <Sfx name="hdl_flutter" at={tTown + 4} volume={0.6} />
      <Sfx name="shimmer" at={fMac - 4} volume={0.6} />
      <Sfx name="hdl_flutter" at={fInc} volume={0.7} />
    </AbsoluteFill>
  );
};

const BoardWide: React.FC<{ t1: number; fExa: number; fProb: number }> = ({ t1, fExa, fProb }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: 0, x: 1960, y: 1420, s: 1.28 }, { f: fExa + 30, x: 1500, y: 950, s: 0.62 }, { f: t1, x: 1500, y: 950, s: 0.6 }], 0.3);
  return (
    <AbsoluteFill>
      <Board cam={cam} strings={<>
        <RedString a={[RECEIPTS.r82[0] + 150, RECEIPTS.r82[1] - 6]} b={[RECEIPTS.r83[0] + 150, RECEIPTS.r83[1] - 6]} at={-100} sag={150} />
        <RedString a={[RECEIPTS.p45[0] + 150, RECEIPTS.p45[1] - 6]} b={[RECEIPTS.p53[0] + 150, RECEIPTS.p53[1] - 6]} at={-100} sag={150} />
        <RedString a={[860, 1258]} b={[1010, 770]} at={-100} sag={60} />
        <RedString a={[2230, 1316]} b={[1420, 1300]} at={-100} sag={70} />
      </>}>
        <QuoteCardStatic><Stamp2 text="¿?" at={-100} x={630} y={60} rot={12} size={70} round /></QuoteCardStatic>
        {CLIPS.map((k, i) => <PinCard key={i} x={k.x} y={k.y} w={340} rot={k.r} at={-100} frame={frame} pin={i % 2 ? '#C9302C' : P.yellow} bg="#E9E0CC"><Clipping seed={`cl${i}`} hi={1} /></PinCard>)}
        <PinCard x={RECEIPTS.r82[0]} y={RECEIPTS.r82[1]} w={300} rot={-4} at={-100} frame={frame} bg="#EFE3C8"><Receipt amount="$ 82.00" /></PinCard>
        <PinCard x={RECEIPTS.r83[0]} y={RECEIPTS.r83[1]} w={300} rot={5} at={-100} frame={frame} bg="#EFE3C8" pin="#C9302C"><Receipt amount="$ 83.00" /></PinCard>
        <PinCard x={RECEIPTS.p45[0]} y={RECEIPTS.p45[1]} w={300} rot={3} at={-100} frame={frame} bg="#EFE3C8"><Pocket amount="$ 45" /></PinCard>
        <PinCard x={RECEIPTS.p53[0]} y={RECEIPTS.p53[1]} w={300} rot={-5} at={-100} frame={frame} bg="#EFE3C8" pin="#C9302C"><Pocket amount="$ 53" /></PinCard>
        <PinCard x={300} y={720} w={560} rot={2} at={-100} frame={frame} bg="#F4EAD5"><Postcard frame={frame} uneasy={1} /></PinCard>
        <PinCard x={890} y={770} w={300} rot={-3} at={-100} frame={frame} bg="#E9E0CC"><UTurnSketch /><div style={{ fontFamily: '"Caveat", cursive', fontWeight: 700, fontSize: 44, color: INKC, marginTop: 6 }}>la media vuelta</div></PinCard>
        {[[1180, 1330, -4], [1540, 1290, 5], [1250, 1560, 3], [1620, 1540, -6]].map(([x, y, r], i) => (
          <PinCard key={i} x={x} y={y} w={420} rot={r} at={-100} frame={frame} bg={i === 0 ? '#F4EAD5' : '#E4DAC4'}>
            <div style={{ fontFamily: '"Special Elite", monospace', fontSize: 20, letterSpacing: 3, color: '#7A6650' }}>SE CONTABA</div>
            <div style={{ fontFamily: '"EB Garamond", serif', fontWeight: 600, fontSize: 44, color: INKC, lineHeight: 1.1, marginTop: 10 }}>Seix Barral la rechazó</div>
          </PinCard>
        ))}
        <PinCard x={640} y={1260} w={440} rot={-2} at={-100} frame={frame} bg="#F4EAD5"><div style={{ display: 'flex', gap: 20, alignItems: 'center' }}><Bust hair="short" /><div style={{ fontFamily: '"EB Garamond", serif', fontWeight: 700, fontSize: 44, color: INKC }}>Dasso Saldívar</div></div></PinCard>
        <PinCard x={2080} y={1300} w={460} rot={3} at={-100} frame={frame} bg="#F4EAD5"><div style={{ display: 'flex', gap: 20, alignItems: 'center' }}><Bust hair="side" /><div style={{ fontFamily: '"EB Garamond", serif', fontWeight: 700, fontSize: 44, color: INKC }}>Carlos Barral</div></div></PinCard>
      </Board>
      <PaperFinish opacity={0.3} vignette={0.6} />
      {/* la pregunta, sobre todo el tablero */}
      {frame > fExa - 6 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ background: '#F4EAD5', padding: '24px 70px', boxShadow: '0 30px 60px rgba(0,0,0,0.6)', transform: `rotate(-2deg) scale(${0.85 + 0.15 * sp(frame, fExa - 6, 13, 170)})`, opacity: rampOut(frame, fExa - 6, fExa + 4), fontFamily: '"EB Garamond", serif', fontWeight: 700, fontSize: 120, color: INKC }}>¿Exageró Gabo?</div>
          <div style={{ marginTop: 26, fontFamily: '"Caveat", cursive', fontWeight: 700, fontSize: 84, color: '#F3C64B', textShadow: '0 3px 12px rgba(0,0,0,0.6)', clipPath: `inset(-20% ${(1 - interpolate(frame, [fProb, fProb + 30], [0, 1], clamp)) * 100}% -20% -2%)` }}>probablemente, un poco</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// El pueblo de noche: lo increíble, con toda normalidad.
const Town: React.FC<{ t0: number; end: number; fInv: number; fMac: number; fVida: number; fInc: number; fNor: number }> = ({ t0, end, fInv, fMac, fVida, fInc, fNor }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: t0, x: 960, y: 620, s: 1.15 }, { f: fMac + 20, x: 960, y: 520, s: 1.0 }, { f: end, x: 1000, y: 540, s: 1.06 }], 0.5);
  const walkX = interpolate(frame, [t0, end], [280, 1300]);
  const flowers = ramp(frame, fInc - 10, fInc + 20);
  const title = rampOut(frame, fMac - 4, fMac + 20);
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#060B12'], [55, '#0F1D2C'], [100, '#1B2A37']]} glows={[{ x: 330, y: 190, r: 380, c: '#F3EBD8', a: 0.2 }, { x: 960, y: 900, r: 900, c: '#E6A35C', a: 0.18 }]} />
      <Layer z={0.1}>
        <circle cx={330} cy={190} r={52} fill="#F1E7CF" />
        {Array.from({ length: 80 }).map((_, i) => <circle key={i} cx={random(`ts${i}`) * 1920} cy={random(`ty${i}`) * 600 - 60} r={0.8 + random(`tr${i}`) * 1.6} fill="#F3EAD6" opacity={(0.3 + random(`to${i}`) * 0.6) * (0.6 + 0.4 * Math.sin(frame / (18 + (i % 11)) + i))} />)}
      </Layer>
      <Layer z={0.3}><Ridge y={760} c="#122030" amp={120} seed="mt" /></Layer>
      <Layer z={0.6}>
        <CaribHouseSil x={620} y={880} c="#0C1520" light="#E6A35C" w={900} />
        <Banana x={1240} y={900} h={430} c="#0C1520" sway={Math.sin(frame / 30) * 3} seed="mc1" />
        <Tree x={1640} y={900} r={200} c="#0C1520" seed="mc2" />
        <Banana x={60} y={900} h={380} c="#0C1520" sway={Math.sin(frame / 26 + 1) * 3} seed="mc3" />
      </Layer>
      <Layer z={1}>
        <rect x={-300} y={900} width={2520} height={400} fill="#070C12" />
        <Person x={walkX} y={902} scale={2.3} kind="man" hair="curly" mustache pose={walkPose((frame - t0) * 0.2, 0.6, 2)} c="#05080B" />
      </Layer>
      {/* flores amarillas que llueven (como en el porche de la abuela) */}
      {flowers > 0 && (
        <AbsoluteFill>
          <svg width={1920} height={1080}>
            {Array.from({ length: 70 }).map((_, i) => {
              const r = (k: string) => random(`fw${i}${k}`);
              const t = ((frame - fInc + 10) * (1.6 + r('v') * 1.4) + r('o') * 1200) % 1200;
              const x = r('x') * 1920 + Math.sin(frame / 14 + i) * 20;
              return <g key={i} transform={`translate(${x} ${t - 100}) rotate(${frame * 3 + i * 40})`} opacity={flowers * 0.9}>{[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={0} cy={-6} rx={4} ry={7} fill="#F3C64B" transform={`rotate(${a})`} />)}<circle r={3} fill="#C98A1E" /></g>;
            })}
          </svg>
        </AbsoluteFill>
      )}
      {frame > t0 && (
        <AbsoluteFill>
          {Array.from({ length: 9 }).map((_, i) => {
            const t = (frame - t0 - i * 6) / 60;
            if (t < 0) return null;
            const px = walkX * cam.s + (960 - cam.x * cam.s) + Math.cos(t * 2.4 + i) * (120 + i * 14);
            const py = 520 + Math.sin(t * 3 + i * 1.3) * 120 - i * 10;
            return <Butterfly key={i} x={px} y={py} size={38 + (i % 3) * 10} seed={`tw${i}`} glow={0.7} opacity={Math.min(1, t * 3)} />;
          })}
        </AbsoluteFill>
      )}
      <PaperFinish opacity={0.4} vignette={0.6} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', opacity: title, transform: `translateY(${(1 - title) * 20}px)` }}>
        <div style={{ fontFamily: '"Special Elite", monospace', fontSize: 34, letterSpacing: 6, color: 'rgba(246,239,226,0.75)', opacity: rampOut(frame, fInv - 6, fInv + 8) }}>el hombre que inventó</div>
        <div style={{ fontFamily: '"EB Garamond", serif', fontWeight: 700, fontSize: 170, color: '#F3C64B', lineHeight: 1.05, textShadow: '0 0 50px rgba(243,198,75,0.4)', letterSpacing: 4 }}>Macondo</div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 860, textAlign: 'center', fontFamily: '"Caveat", cursive', fontWeight: 700, fontSize: 62, color: '#F4EAD5', textShadow: '0 3px 12px rgba(0,0,0,0.7)', opacity: rampOut(frame, fNor - 10, fNor + 8) }}>lo increíble, como lo más normal del mundo</div>
      {fVida < 0 && null}
    </Rig>
  );
};

export const _t = { easeInOut, BookPile, PILES };
