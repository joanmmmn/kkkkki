import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Keystrokes, Sfx } from '../../components/Sfx';
import { Butterfly as ButterflyK, P, ramp, rampOut, sp, typeTimes } from './kit';
import { TypewriterCloseup } from './typewriter';
import { sceneClock } from './timeline';
import { Halo, Layer, mix, PaperFinish, Person, Pose, Rig, Sky, sitPose, Slate, useCamera, walkPose } from './theatre';
import { Banana, CaribHouseSil, CREAM, Ridge, Skyline, Tree, WARM } from './sets';
import { HOUSE, House, Room } from './house';

const INK = '#140D08';
export const GABO_SEAT = { x: 512, y: 652, s: 1.0 };
// Él a la máquina: tecleo (los antebrazos suben y bajan) y la cabeza que asiente.
export const typingPose = (frame: number, k = 1): Pose => sitPose({
  lean: 10, neck: 6 + Math.sin(frame / 9) * 2 * k,
  shF: 58, elF: 26 + Math.abs(Math.sin(frame * 1.7)) * 12 * k,
  shB: 54, elB: 30 + Math.abs(Math.cos(frame * 1.5)) * 10 * k,
});
export const Gabo: React.FC<{ frame: number; pose?: Pose; x?: number; y?: number; s?: number }> = ({ frame, pose, x = GABO_SEAT.x, y = GABO_SEAT.y, s = GABO_SEAT.s }) => (
  <Person x={x} y={y} scale={s} kind="man" hair="curly" mustache pose={pose ?? typingPose(frame)} c={INK} back="#2A1C12" />
);

// Encuadres de la casa (centro x, y y zoom para que la habitación llene el plano).
export const frameRoom = (r: Room, pad = 1): { x: number; y: number; s: number } => {
  const R = HOUSE[r];
  const w = R.x1 - R.x0, h = R.y1 - R.y0;
  return { x: (R.x0 + R.x1) / 2, y: (R.y0 + R.y1) / 2, s: Math.min(1920 / w, 1080 / h) * pad };
};

// Libro en un escaparate (cubierta lisa con el título: nunca la cubierta real).
const ShopBook: React.FC<{ x: number; y: number; title: string; year: string; c: string; rot?: number; w?: number }> = ({ x, y, title, year, c, rot = 0, w = 150 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-w / 2 + 6} y={-w * 1.42 + 6} width={w} height={w * 1.42} fill="#000" opacity={0.35} />
    <rect x={-w / 2} y={-w * 1.42} width={w} height={w * 1.42} fill={c} />
    <rect x={-w / 2 + 10} y={-w * 1.42 + 10} width={w - 20} height={w * 1.42 - 20} fill="none" stroke="#E9D7B0" strokeWidth={2} opacity={0.5} />
    <foreignObject x={-w / 2 + 14} y={-w * 1.42 + 24} width={w - 28} height={w}>
      <div style={{ fontFamily: '"EB Garamond", serif', fontWeight: 600, fontSize: w * 0.13, lineHeight: 1.1, color: '#F2E6CB', textAlign: 'center' }}>{title}</div>
    </foreignObject>
    <text x={0} y={-18} textAnchor="middle" fontFamily='"EB Garamond", serif' fontSize={w * 0.1} fill="#E9D7B0" opacity={0.8}>{year}</text>
  </g>
);

export const BOOKS4: [string, string, string][] = [
  ['La hojarasca', '1955', '#6E2B26'],
  ['El coronel no tiene quien le escriba', '1961', '#2C4A5A'],
  ['La mala hora', '1962', '#5C4C24'],
  ['Los funerales de la Mamá Grande', '1962', '#38553A'],
];

// ——— ESCRITOR v2 · W05–W06 ———
export const Escritor2: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('ESCRITOR');
  const f65 = c.part('W05');
  const fGab = c.at('W05', 'Gabriel');
  const fTre = c.at('W05', 'treinta');
  const fViv = c.at('W05', 'vive');
  const fMex = c.at('W05', 'México');
  const fMuj = c.at('W05', 'mujer');
  const fMer = c.at('W05', 'Mercedes');
  const fHij = c.at('W05', 'hijos');
  const fPub = c.at('W05', 'publicado');
  const fCua = c.at('W05', 'cuatro');
  const fNin = c.part('W06');
  const fExi = c.at('W06', 'éxito');
  const fMil = c.at('W06', 'mil');
  const fDos = c.at('W06', 'dos');
  const fSue = c.at('W06', 'suerte');
  const fPara = c.at('W06', 'Para');
  const fFac = c.at('W06', 'facturas');
  const fGui = c.at('W06', 'guiones');
  const fPubl = c.at('W06', 'publicidad');
  const end = c.dur;
  const shop = frame >= fNin - 8 && frame < fPara - 6;
  return (
    <AbsoluteFill style={{ background: '#05080B' }}>
      {frame >= fGui - 8 ? (
        <TypewriterCloseup t0={fGui - 8} t1={end} pages={[
          { from: fGui - 8, yank: fPubl - 12, lines: [{ text: 'GUION', a: fGui - 4, b: fGui + 14, center: true, size: 84 }, { text: 'ESCENA 1', a: fGui + 26, b: fGui + 46, center: true }] },
          { from: fPubl - 10, lines: [{ text: 'PUBLICIDAD', a: fPubl - 6, b: fPubl + 22, center: true, size: 84 }, { text: 'ANUNCIO', a: fPubl + 34, b: fPubl + 50, center: true }] },
        ]} />
      ) : !shop ? (
        <HouseShots frame={frame} f65={f65} fGab={fGab} fTre={fTre} fViv={fViv} fMex={fMex} fMuj={fMuj} fMer={fMer} fHij={fHij} fPub={fPub} fCua={fCua} fNin={fNin} fPara={fPara} fFac={fFac} fGui={fGui} fPubl={fPubl} end={end} />
      ) : (
        <ShopShot t0={fNin - 8} t1={fPara - 6} fExi={fExi} fMil={fMil} fDos={fDos} fSue={fSue} />
      )}
      <Sfx name="sk_typing" at={f65 + 6} volume={0.35} />
      <Sfx name="sk_typebell" at={fTre + 20} volume={0.4} />
      <Sfx name="sk_book_slide" at={fCua - 2} volume={0.35} />
      <Sfx name="sk_book_slide" at={fCua + 8} volume={0.3} />
      <Sfx name="sk_book_slide" at={fCua + 18} volume={0.3} />
      <Sfx name="sk_book_slide" at={fCua + 28} volume={0.3} />
      <Sfx name="card_flip" at={fNin - 8} volume={0.3} />
      <Sfx name="sk_wind" at={fNin - 8} volume={0.18} dur={fPara - fNin} fade={12} />
      <Sfx name="hdl_pencil_write" at={fDos} volume={0.6} dur={14} fade={4} />
      <Sfx name="card_flip" at={fPara - 6} volume={0.3} />
      <Sfx name="hdl_tear" at={fFac - 6} volume={0.6} />
      <Sfx name="hdl_tear" at={fFac + 6} volume={0.5} />
      <Keystrokes text="GUION" times={typeTimes('GUION', fGui - 4, fGui + 14)} volume={0.6} seed="g1" />
      <Keystrokes text="ESCENA 1" times={typeTimes('ESCENA 1', fGui + 26, fGui + 46)} volume={0.5} seed="g2" />
      <Sfx name="sk_typebell" at={fGui + 20} volume={0.5} />
      <Sfx name="hdl_tear" at={fPubl - 12} volume={0.8} />
      <Keystrokes text="PUBLICIDAD" times={typeTimes('PUBLICIDAD', fPubl - 6, fPubl + 22)} volume={0.6} seed="p1" />
      <Keystrokes text="ANUNCIO" times={typeTimes('ANUNCIO', fPubl + 34, fPubl + 50)} volume={0.5} seed="p2" />
    </AbsoluteFill>
  );
};

const HouseShots: React.FC<{ frame: number; f65: number; fGab: number; fTre: number; fViv: number; fMex: number; fMuj: number; fMer: number; fHij: number; fPub: number; fCua: number; fNin: number; fPara: number; fFac: number; fGui: number; fPubl: number; end: number }> = (p) => {
  const { frame } = p;
  const st = frameRoom('study', 0.98);
  const shelf = { x: 622, y: 404, s: 6.2 };
  const cam = useCamera([
    { f: 0, x: st.x + 30, y: st.y + 10, s: st.s * 1.1 },
    { f: p.fTre + 20, x: st.x + 10, y: st.y, s: st.s * 0.98 },
    { f: p.fViv - 6, x: 960, y: 640, s: 0.92 },
    { f: p.fMex + 30, x: 960, y: 600, s: 0.86 },
    { f: p.fMer - 6, x: 1180, y: 780, s: 1.5 },
    { f: p.fHij - 14, x: 1180, y: 760, s: 1.45 },
    { f: p.fHij + 4, x: 1010, y: 490, s: 1.9 },
    { f: p.fPub - 4, x: 1000, y: 500, s: 1.75 },
    { f: p.fCua, x: shelf.x, y: shelf.y, s: shelf.s, ez: 2 },
    { f: p.fNin - 8, x: shelf.x + 4, y: shelf.y - 2, s: shelf.s * 1.04 },
    { f: p.fPara - 6, x: st.x + 20, y: st.y, s: st.s * 1.02 },
    { f: p.end, x: st.x + 40, y: st.y + 10, s: st.s * 1.12 },
  ], 0.7);
  // luces: al principio solo el estudio; con «vive» se encienden las demás; en la sala, la mujer y los niños destacan
  const on = ramp(frame, p.fViv - 10, p.fViv + 30);
  const lights = { study: 1, kids: on * (0.6 + 0.4 * ramp(frame, p.fHij - 6, p.fHij + 6)), bath: on * 0.55, living: on * 0.7, kitchen: on * (0.65 + 0.35 * ramp(frame, p.fMuj - 6, p.fMuj + 8)) };
  // los cuatro libros entran en la balda
  const bookIn = (i: number) => sp(frame, p.fCua - 6 + i * 10, 13, 170);
  // facturas que caen en la mesa
  const bills = Array.from({ length: 6 }).map((_, i) => ({ at: p.fFac - 10 + i * 5, x: 600 + random(`bx${i}`) * 110, r: (random(`br${i}`) - 0.5) * 40 }));
  const kidJump = Math.max(0, Math.sin((frame - p.fHij) / 5)) * 10 * ramp(frame, p.fHij - 4, p.fHij + 4) * (1 - ramp(frame, p.fHij + 40, p.fHij + 50));
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#0D1826'], [55, '#1C2E41'], [100, '#3A3F48']]} glows={[{ x: 960, y: 980, r: 1100, c: '#E39A55', a: 0.2 }]} />
      <Layer z={0.35} opacity={ramp(frame, p.fViv - 6, p.fViv + 20)}>
        <Skyline y={990} c="#17263A" frame={frame} seed="mx2" tower={1500} from={-400} to={2400} />
      </Layer>
      <Layer z={1}>
        <House ink={INK} frame={frame} lights={lights} items={{ shelfBooks: 0 }} />
        {/* los cuatro libros (con su título en el lomo) */}
        {BOOKS4.map(([t, y, col], i) => {
          const b = bookIn(i);
          if (frame < p.fCua - 8 + i * 10) return null;
          const h = 60;
          return (
            <g key={i} transform={`translate(${576 + i * 21 + (1 - b) * 140} ${430 - h})`} opacity={Math.min(1, b * 2)}>
              <rect x={0} y={0} width={18} height={h} fill={col} />
              <rect x={0} y={4} width={18} height={1.2} fill="#E9C27A" opacity={0.7} />
              <text transform={`translate(12.5 ${h - 4}) rotate(-90)`} fontFamily='"EB Garamond", serif' fontWeight={600} fontSize={i === 1 || i === 3 ? 3.6 : 5.4} fill="#F2E6CB">{t}</text>
            </g>
          );
        })}
        {/* ella en la cocina, los niños en su cuarto */}
        <Person x={1220} y={958} scale={1.12} face={-1} kind="woman" hair="bob" pose={{ shF: 24 + Math.sin(frame / 14) * 6, elF: 60, shB: 10, elB: 40, neck: 6 }} c={INK} back="#2A1C12" />
        <Person x={880} y={612 - kidJump} scale={1.02} kind="boy" hair="kid" pose={{ shF: 120 * Math.min(1, kidJump / 6), elF: 20, shB: -20, hipF: 4, hipB: -6 }} c={INK} back="#2A1C12" />
        <Person x={1010} y={612} scale={0.92} face={-1} kind="boy" hair="kid" pose={{ shF: 30, elF: 50, lean: 6 }} c={INK} back="#2A1C12" />
        <Gabo frame={frame} pose={frame > p.fFac - 6 ? typingPose(frame * 1.6, 1.4) : undefined} />
        {/* facturas */}
        {bills.map((b, i) => {
          const q = sp(frame, b.at, 12, 160);
          if (frame < b.at) return null;
          return (
            <g key={i} transform={`translate(${b.x} ${540 - 4 - i * 2.2 - (1 - q) * 220}) rotate(${b.r * (1 - q * 0.6)})`} opacity={Math.min(1, q * 3)}>
              <rect x={-22} y={-3} width={44} height={6} fill="#E4D6B6" />
            </g>
          );
        })}
      </Layer>
      <PaperFinish opacity={0.5} vignette={0.6} warm={0.5} />
      <Slate text="Gabriel García Márquez · 38 años" a={p.fGab - 2} b={p.fGab + 50} out={p.fViv - 20} x={110} y={940} />
      <Slate text="Ciudad de México" a={p.fMex - 4} b={p.fMex + 20} out={p.fMer - 16} x={110} y={940} />
      {/* rótulos a mano con flecha */}
      <HandLabel text="Mercedes Barcha" x={760} y={250} a={p.fMer} out={p.fHij - 10} />
      <HandLabel text="y sus dos hijos" x={600} y={230} a={p.fHij + 6} out={p.fPub - 4} />
    </Rig>
  );
};

// Rótulo escrito a mano en crema (sobre la escena, no en la capa).
export const HandLabel: React.FC<{ text: string; x: number; y: number; a: number; out: number; size?: number }> = ({ text, x, y, a, out, size = 64 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [a, a + 18], [0, 1], clamp);
  const o = 1 - ramp(frame, out, out + 10);
  if (frame < a || o <= 0) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, fontFamily: '"Caveat", cursive', fontWeight: 700, fontSize: size, color: '#F6E9CC', opacity: o, clipPath: `inset(-20% ${(1 - p) * 100}% -20% -2%)`, textShadow: '0 3px 14px rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>{text}</div>
  );
};

// ——— el escaparate de la librería, de noche ———
const ShopShot: React.FC<{ t0: number; t1: number; fExi: number; fMil: number; fDos: number; fSue: number }> = ({ t0, t1, fExi, fMil, fDos, fSue }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([
    { f: t0, x: 960, y: 560, s: 1.08 },
    { f: fMil - 10, x: 990, y: 580, s: 1.2 },
    { f: t1, x: 1040, y: 600, s: 1.34 },
  ], 0.6);
  const walker = (k: number) => interpolate(frame, [t0 + k * 70, t0 + k * 70 + 150], [k % 2 ? 2300 : -380, k % 2 ? -380 : 2300], clamp);
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#0B1420'], [100, '#1A2633']]} />
      <Layer z={0.8}>
        {/* fachada */}
        <rect x={-200} y={-100} width={2320} height={1300} fill="#0D141B" />
        <rect x={420} y={150} width={1080} height={90} fill="#0A0F14" />
        <Halo x={960} y={195} r={420} c={WARM} a={0.22} />
        <text x={960} y={218} textAnchor="middle" fontFamily='"EB Garamond", serif' fontWeight={700} fontSize={64} letterSpacing={22} fill={WARM}>LIBRERÍA</text>
        {/* escaparate */}
        <rect x={420} y={280} width={1080} height={560} fill="url(#shopglass)" />
        <defs>
          <linearGradient id="shopglass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F3C77E" />
            <stop offset="1" stopColor="#B86C34" />
          </linearGradient>
        </defs>
        {/* estanterías al fondo, en silueta */}
        {[0, 1, 2].map((r) => (
          <g key={r}>
            <rect x={440} y={340 + r * 120} width={1040} height={8} fill="#5A3418" opacity={0.6} />
            {Array.from({ length: 46 }).map((_, i) => <rect key={i} x={446 + i * 22.4} y={340 + r * 120 - 60 - random(`sh${r}${i}`) * 26} width={16} height={60 + random(`sh${r}${i}`) * 26} fill="#6A3E1E" opacity={0.45} />)}
          </g>
        ))}
        {/* repisa del escaparate */}
        <rect x={420} y={770} width={1080} height={70} fill="#1A120C" />
        {BOOKS4.map(([t, y, col], i) => <ShopBook key={i} x={640 + i * 200} y={770} title={t} year={y} c={col} rot={(i - 1.5) * 2} />)}
        {/* tarjeta de ventas, a mano */}
        <g transform="translate(1330 700) rotate(5)" opacity={rampOut(frame, fMil - 8, fMil + 4)}>
          <rect x={-120} y={-80} width={240} height={150} fill="#F4EAD5" />
          <text x={0} y={-22} textAnchor="middle" fontFamily='"Caveat", cursive' fontWeight={700} fontSize={44} fill="#3B3A44">≈ 1.000</text>
          <text x={0} y={14} textAnchor="middle" fontFamily='"Caveat", cursive' fontSize={26} fill="#3B3A44">ejemplares</text>
          {frame >= fDos && <text x={0} y={56} textAnchor="middle" fontFamily='"Caveat", cursive' fontWeight={700} fontSize={30} fill="#B5262B" opacity={rampOut(frame, fDos, fDos + 8)}>(2.000, con suerte)</text>}
        </g>
        <rect x={400} y={260} width={1120} height={20} fill="#0A0F14" />
        <rect x={400} y={840} width={1120} height={30} fill="#0A0F14" />
        <rect x={950} y={280} width={20} height={560} fill="#0A0F14" />
        <rect x={-200} y={870} width={2320} height={400} fill="#070B0F" />
      </Layer>
      <Layer z={1.2}>
        {/* gente que pasa sin mirar */}
        {[0, 1, 2].map((k) => {
          const x = walker(k);
          return <Person key={k} x={x} y={1180} scale={3.4} face={k % 2 ? -1 : 1} kind={k === 1 ? 'woman' : 'man'} hair={k === 1 ? 'bob' : 'side'} pose={walkPose(x / 40, 1)} c="#05080B" back="#0E151C" />;
        })}
      </Layer>
      <PaperFinish opacity={0.5} vignette={0.62} />
      {frame > fExi + 1e9 && null}
      {fSue < 0 && null}
    </Rig>
  );
};

// ——— CASA v2 · W07 ———
// Él deja de teclear y mira una foto de la pared: entramos en el recuerdo (Aracataca a mediodía: la casa de los abuelos,
// el almendro, las plataneras, la Sierra Nevada al fondo, un niño que corre). «La casa»: la tecla escribe el título.
// Luego, intentos: hojas arrancadas, bolas de papel a la papelera, días que pasan. «No encuentra la forma»: la hoja en blanco.
export const Casa2: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('CASA');
  const fArr = c.at('W07', 'arrastra');
  const fNov = c.at('W07', 'novela');
  const fAra = c.at('W07', 'Aracataca');
  const fCar = c.at('W07', 'Caribe');
  const fHas = c.at('W07', 'Hasta');
  const fTit = c.at('W07', 'provisional');
  const fLa = c.at('W07', 'La', 1);
  const fEmp = c.at('W07', 'empezado');
  const fAba = c.at('W07', 'abandonado');
  const fNo = c.at('W07', 'No', 1);
  const end = c.dur;
  const tMem = fNov - 16; // entrada en el recuerdo
  const tTit = fHas - 4; // máquina: «LA CASA»
  const tTry = fLa + 50; // intentos
  const tBlank = fNo - 6; // la hoja en blanco
  let shot: React.ReactNode;
  if (frame < tMem) shot = <PhotoShot t1={tMem} fArr={fArr} />;
  else if (frame < tTit) shot = <MemoryShot t0={tMem} t1={tTit} fAra={fAra} fCar={fCar} />;
  else if (frame < tTry) shot = <TypewriterCloseup t0={tTit} t1={tTry} pages={[{ from: tTit, yank: tTry - 6, lines: [{ text: 'LA CASA', a: fLa - 2, b: fLa + 22, center: true, size: 96 }] }]} />;
  else if (frame < tBlank) shot = <TriesShot t0={tTry} t1={tBlank} fEmp={fEmp} fAba={fAba} />;
  else shot = <TypewriterCloseup t0={tBlank} t1={end + 20} light={0.8} pages={[{ from: tBlank, lines: [{ text: ' ', a: 1e9, b: 1e9 }] }]} />;
  return (
    <AbsoluteFill style={{ background: '#05080B' }}>
      {shot}
      <AbsoluteFill style={{ background: '#F6E3B0', opacity: interpolate(frame, [tMem - 8, tMem, tMem + 16], [0, 0.9, 0], clamp) }} />
      <Sfx name="sk_typebell" at={0} volume={0.3} />
      <Sfx name="reverse_swell" at={tMem} volume={0.4} />
      <Sfx name="hdl_flutter" at={tMem + 40} volume={0.6} />
      <Sfx name="sk_wind" at={tMem} volume={0.12} dur={tTit - tMem} fade={20} />
      <Keystrokes text="LA CASA" times={typeTimes('LA CASA', fLa - 2, fLa + 22)} volume={0.8} seed="lc" />
      <Sfx name="hdl_tear" at={tTry - 6} volume={0.8} />
      {[0, 1, 2, 3, 4].map((i) => <Sfx key={i} name="sk_crumple" at={tTry + 4 + i * 40} volume={0.5} />)}
      {[0, 1, 2, 3, 4].map((i) => <Sfx key={`b${i}`} name="sk_bin" at={tTry + 24 + i * 40} volume={0.4} />)}
      <Sfx name="sk_clock" at={tBlank + 10} volume={0.5} />
      <Sfx name="sk_clock" at={tBlank + 110} volume={0.4} />
    </AbsoluteFill>
  );
};

// él deja de escribir y mira la foto (en la pared, junto a la ventana)
const PHOTO = { x: 438, y: 540 };
const PhotoShot: React.FC<{ t1: number; fArr: number }> = ({ t1, fArr }) => {
  const frame = useCurrentFrame();
  const st = frameRoom('study', 0.98);
  const cam = useCamera([
    { f: 0, x: st.x + 40, y: st.y + 10, s: st.s * 1.12 },
    { f: fArr + 30, x: st.x, y: st.y, s: st.s * 1.05 },
    { f: t1 - 30, x: PHOTO.x + 30, y: PHOTO.y - 70, s: st.s * 1.8 },
    { f: t1, x: PHOTO.x + 2, y: PHOTO.y - 100, s: 22, ez: 1 },
  ], 0.6);
  const look = ramp(frame, 6, 24);
  const pose: Pose = sitPose({ lean: 10 - 16 * look, neck: 6 - 26 * look, shF: 58 - 50 * look, elF: 26 + 40 * look, shB: 54 - 40 * look, elB: 30 + 50 * look });
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#0D1826'], [100, '#2A3340']]} />
      <Layer z={1}>
        <House ink={INK} frame={frame} lights={{ study: 1, kids: 0.2, bath: 0.1, living: 0.3, kitchen: 0.3 }} />
        {/* la foto enmarcada (sepia: la casa de Aracataca en miniatura) */}
        <g transform={`translate(${PHOTO.x} ${PHOTO.y - 100})`}>
          <rect x={-30} y={-24} width={60} height={48} fill={INK} />
          <rect x={-25} y={-19} width={50} height={38} fill="#E8CF97" />
          <path d="M -22 12 L -22 2 L -12 -6 L 12 -6 L 22 2 L 22 12 Z" fill="#7A5530" />
          <circle cx={-14} cy={-8} r={7} fill="#7A5530" />
          <circle cx={14} cy={-12} r={4} fill="#F6E3B0" />
        </g>
        <Gabo frame={frame} pose={frame < 6 ? undefined : pose} />
      </Layer>
      <PaperFinish opacity={0.5} vignette={0.6} warm={0.5} />
    </Rig>
  );
};

const MemoryShot: React.FC<{ t0: number; t1: number; fAra: number; fCar: number }> = ({ t0, t1, fAra, fCar }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([
    { f: t0, x: 960, y: 560, s: 1.25 },
    { f: t1, x: 1010, y: 600, s: 1.05 },
  ], 0.5);
  const kidX = interpolate(frame, [t0 + 20, t1], [300, 1500], clamp);
  const sk = '#F3DCA4';
  const k1 = '#E0B878', k2 = '#B98950', k3 = '#7C5530', k4 = '#3B2414';
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#FBEFCC'], [60, sk], [100, '#EFC67A']]} glows={[{ x: 1500, y: 120, r: 700, c: '#FFFFFF', a: 0.5 }]} />
      <Layer z={0.1}><Ridge y={640} c={mix(k1, sk, 0.45)} amp={240} seed="sn" peaks={6} /></Layer>
      <Layer z={0.25}><Ridge y={700} c={k1} amp={120} seed="sn2" peaks={9} /></Layer>
      <Layer z={0.45}>
        {Array.from({ length: 16 }).map((_, i) => <Banana key={i} x={-100 + i * 140 + random(`bb${i}`) * 60} y={780} h={170 + random(`bh${i}`) * 80} c={k2} sway={Math.sin(frame / 30 + i) * 4} seed={`b${i}`} />)}
        <rect x={-300} y={776} width={2520} height={400} fill={k2} />
      </Layer>
      <Layer z={0.7}>
        <CaribHouseSil x={1080} y={900} c={k3} light={sk} w={1100} />
        <rect x={-300} y={896} width={2520} height={400} fill={k3} />
      </Layer>
      <Layer z={1}>
        <Tree x={330} y={1010} r={190} c={k4} seed="alm" />
        <rect x={-300} y={1000} width={2520} height={300} fill={k4} />
        {Array.from({ length: 30 }).map((_, i) => <rect key={i} x={560 + i * 46} y={950} width={10} height={60} fill={k4} />)}
        <rect x={560} y={968} width={1400} height={8} fill={k4} />
        <Person x={kidX} y={1004} scale={1.25} kind="boy" hair="kid" pose={walkPose(kidX / 18, 1.2, 8)} c={k4} back="#5A3A22" />
      </Layer>
      {/* mariposas amarillas: aquí empieza todo */}
      <AbsoluteFill>
        {[0, 1, 2, 3, 4].map((i) => {
          const t = (frame - t0) / 50;
          const x = 600 + i * 230 + Math.sin(t * 1.3 + i) * 80 + t * 30;
          const y = 520 - i * 30 + Math.cos(t * 1.7 + i * 2) * 60 - t * 12;
          return <ButterflyBit key={i} x={x} y={y} i={i} />;
        })}
      </AbsoluteFill>
      <PaperFinish opacity={0.45} vignette={0.5} warm={0.4} />
      <Slate text="Aracataca · Caribe colombiano" a={fAra - 4} b={fAra + 40} out={t1 - 16} x={110} y={940} />
      {fCar < 0 && null}
    </Rig>
  );
};

const ButterflyBit: React.FC<{ x: number; y: number; i: number }> = ({ x, y, i }) => <ButterflyK x={x} y={y} size={40 + (i % 3) * 10} seed={`mem${i}`} />;

// intentos: hojas arrancadas, bolas de papel que vuelan a la papelera, la luz de la ventana que cambia (días)
const TriesShot: React.FC<{ t0: number; t1: number; fEmp: number; fAba: number }> = ({ t0, t1, fEmp, fAba }) => {
  const frame = useCurrentFrame();
  const st = frameRoom('study', 0.98);
  const cam = useCamera([{ f: t0, x: st.x - 20, y: st.y + 20, s: st.s * 1.05 }, { f: t1, x: st.x - 40, y: st.y + 30, s: st.s * 1.15 }], 0.6);
  const day = (Math.sin((frame - t0) / 9) + 1) / 2; // ciclo día/noche rápido
  const balls = Array.from({ length: 9 }).map((_, i) => ({ at: t0 + 4 + i * 20, seed: i }));
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, mix('#0D1826', '#9CC2CF', day)], [100, mix('#2A3340', '#E8D9B0', day)]]} />
      <Layer z={1}>
        <House ink={INK} frame={frame} lights={{ study: 0.75 + 0.25 * (1 - day), kids: 0.2, bath: 0.1, living: 0.3, kitchen: 0.3 }} daylight={day} />
        {/* pila de bolas de papel en el suelo, junto a la papelera */}
        {balls.map((b, i) => {
          if (frame < b.at) return null;
          const t = ramp(frame, b.at, b.at + 18, (u) => u);
          const x0 = 600, y0 = 520, x1 = 360 + (i % 4) * 14 - (i > 4 ? 26 : 0), y1 = 596 - Math.floor(i / 3) * 12;
          const x = x0 + (x1 - x0) * t;
          const y = y0 + (y1 - y0) * t - Math.sin(t * Math.PI) * 90;
          return (
            <g key={i} transform={`translate(${x} ${y}) rotate(${t * 300 + i * 40})`}>
              <circle r={9} fill={CREAM} />
              <path d="M -6 -3 L 2 1 L -1 6 M 3 -6 L 1 0 L 7 2" stroke="#B9A684" strokeWidth={1.2} fill="none" />
            </g>
          );
        })}
        <Gabo frame={frame} pose={typingPose(frame * 1.4, 1.2)} />
      </Layer>
      <PaperFinish opacity={0.5} vignette={0.6} warm={0.5} />
      {fEmp + fAba < 0 && null}
    </Rig>
  );
};

export const _u = { easeInOut, easeOut, P, Keystrokes, Halo };
