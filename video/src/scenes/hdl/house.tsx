import React from 'react';
import { random } from 'remotion';
import { Halo, mix } from './theatre';
import { CREAM, WARM } from './sets';

// ————————————————————————————————————————————————————————————————
// v2 · La casa de Ciudad de México en corte (casa de muñecas): el decorado que vuelve en varios capítulos.
//   arriba izq.: el estudio («la cueva de la mafia») · arriba centro: el cuarto de los niños · arriba dcha.: el baño
//   abajo izq.: la sala (sofá, televisor) · abajo dcha.: la cocina (mesa, batidora) · fuera, a la derecha: el coche.
// Las habitaciones son cajas de luz; muebles y personas, siluetas. Los objetos que se empeñan se pueden quitar.
// ————————————————————————————————————————————————————————————————

export const HOUSE = {
  ground: 980,
  x0: 260, x1: 1660,
  mid: 650, top: 330,
  wall: 22,
  study: { x0: 282, x1: 760, y0: 352, y1: 628 },
  kids: { x0: 782, x1: 1238, y0: 352, y1: 628 },
  bath: { x0: 1260, x1: 1638, y0: 352, y1: 628 },
  living: { x0: 282, x1: 900, y0: 672, y1: 958 },
  kitchen: { x0: 922, x1: 1638, y0: 672, y1: 958 },
};

export type Room = keyof Pick<typeof HOUSE, 'study' | 'kids' | 'bath' | 'living' | 'kitchen'>;
export type HouseProps = {
  ink: string;
  lights?: Partial<Record<Room, number>>; // 0 apagada → 1 encendida
  sky?: string;
  items?: { car?: number; tv?: number; jewels?: number; heater?: number; dryer?: number; blender?: number; books?: number; pile?: number; bills?: number; shelfBooks?: number };
  frame: number;
  daylight?: number; // 0 noche → 1 día (color de las ventanas)
};

const ROOM_COLORS: Record<Room, [string, string]> = {
  study: ['#F0B865', '#B9652E'],
  kids: ['#E9B07A', '#B06A45'],
  bath: ['#D8B88E', '#9E7650'],
  living: ['#EDB36C', '#A85A30'],
  kitchen: ['#F2C27E', '#B4703A'],
};

const RoomBox: React.FC<{ r: Room; on: number; ink: string; win?: [number, number, number, number]; sky: string }> = ({ r, on, ink, win, sky }) => {
  const R = HOUSE[r];
  const id = `room-${r}`;
  const [a, b] = ROOM_COLORS[r];
  const dark = mix(ink, '#000000', 0.1);
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mix(dark, a, 0.12 + 0.88 * on)} />
          <stop offset="1" stopColor={mix(dark, b, 0.1 + 0.9 * on)} />
        </linearGradient>
      </defs>
      <rect x={R.x0} y={R.y0} width={R.x1 - R.x0} height={R.y1 - R.y0} fill={`url(#${id})`} />
      {win && (
        <g>
          <rect x={win[0]} y={win[1]} width={win[2]} height={win[3]} fill={sky} />
          <rect x={win[0] + win[2] / 2 - 3} y={win[1]} width={6} height={win[3]} fill={ink} />
          <rect x={win[0]} y={win[1] + win[3] / 2 - 3} width={win[2]} height={6} fill={ink} />
          <rect x={win[0] - 8} y={win[1] + win[3]} width={win[2] + 16} height={8} fill={ink} />
        </g>
      )}
      {/* rodapié */}
      <rect x={R.x0} y={R.y1 - 16} width={R.x1 - R.x0} height={16} fill={mix(ink, a, 0.18 * on)} />
    </g>
  );
};

// Máquina de escribir de perfil (con el papel crema asomando). Origen: apoyo en la mesa.
export const TypewriterSide: React.FC<{ x: number; y: number; c: string; s?: number; paper?: number; carriage?: number }> = ({ x, y, c, s = 1, paper = 1, carriage = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {paper > 0 && <path d={`M ${-8 + carriage} -78 L ${-4 + carriage} ${-78 - 70 * paper} L ${40 + carriage} ${-78 - 72 * paper} L ${36 + carriage} -74 Z`} fill={CREAM} />}
    <rect x={-40 + carriage} y={-84} width={96} height={18} rx={9} fill={c} />
    <path d="M -56 0 L -50 -40 L -30 -66 L 40 -70 L 64 -40 L 70 0 Z" fill={c} />
    <path d="M -60 -6 L -76 -2 L -74 2 L -58 0 Z" fill={c} />
    {[-30, -12, 6, 24, 42].map((k, i) => <circle key={i} cx={k} cy={-36 + i * 3} r={4} fill={mix(c, '#FFFFFF', 0.15)} />)}
  </g>
);

export const DeskLamp: React.FC<{ x: number; y: number; c: string; on?: number; s?: number }> = ({ x, y, c, on = 1, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Halo x={58} y={-120} r={170} c={WARM} a={0.5 * on} />
    <ellipse cx={0} cy={-4} rx={26} ry={6} fill={c} />
    <path d="M 0 -6 L 18 -86 L 58 -120" stroke={c} strokeWidth={7} fill="none" strokeLinecap="round" />
    <path d="M 40 -138 L 86 -116 L 74 -94 L 30 -116 Z" fill={c} />
    <ellipse cx={80} cy={-104} rx={9} ry={5} fill={WARM} opacity={0.4 + 0.6 * on} />
  </g>
);

// Estufa eléctrica de los sesenta (resistencias naranjas).
export const Heater: React.FC<{ x: number; y: number; c: string; on?: number; s?: number }> = ({ x, y, c, on = 1, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Halo x={0} y={-40} r={90} c="#FF8A3D" a={0.45 * on} />
    <rect x={-30} y={-80} width={60} height={72} rx={8} fill={c} />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={-20} y={-70 + i * 15} width={40} height={6} rx={3} fill="#FF7A30" opacity={0.25 + 0.75 * on} />)}
    <rect x={-22} y={-8} width={8} height={8} fill={c} />
    <rect x={14} y={-8} width={8} height={8} fill={c} />
  </g>
);

export const TV60: React.FC<{ x: number; y: number; c: string; on?: number; s?: number }> = ({ x, y, c, on = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -50 0 L -40 -30 L 40 -30 L 50 0 Z" fill={c} />
    <rect x={-70} y={-130} width={140} height={104} rx={14} fill={c} />
    <rect x={-56} y={-118} width={92} height={78} rx={10} fill={on ? '#9FC3D6' : mix(c, '#FFFFFF', 0.1)} opacity={on ? 0.85 : 1} />
    <circle cx={52} cy={-100} r={6} fill={mix(c, '#FFFFFF', 0.2)} />
    <circle cx={52} cy={-80} r={6} fill={mix(c, '#FFFFFF', 0.2)} />
    <path d="M -10 -130 L -34 -168 M 10 -130 L 34 -168" stroke={c} strokeWidth={3} />
  </g>
);

export const Blender: React.FC<{ x: number; y: number; c: string; s?: number }> = ({ x, y, c, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -22 0 L -18 -30 L 18 -30 L 22 0 Z" fill={c} />
    <path d="M -16 -30 L -22 -96 L 22 -96 L 16 -30 Z" fill={mix(c, '#BFD6DC', 0.35)} />
    <rect x={-24} y={-104} width={48} height={10} rx={3} fill={c} />
  </g>
);

export const HairDryer: React.FC<{ x: number; y: number; c: string; s?: number; rot?: number }> = ({ x, y, c, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}>
    <rect x={-40} y={-26} width={70} height={36} rx={18} fill={c} />
    <rect x={30} y={-20} width={26} height={24} rx={4} fill={c} />
    <path d="M -14 8 L -22 54 L -6 56 L 4 8 Z" fill={c} />
  </g>
);

export const Car60Mini: React.FC<{ x: number; y: number; c: string; s?: number }> = ({ x, y, c, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -150 -25 C -150 -40, -144 -46, -130 -48 L -86 -52 C -70 -76, -54 -82, -20 -83 L 30 -83 C 56 -82, 70 -70, 86 -56 L 130 -50 C 146 -48, 152 -40, 152 -29 L 151 -16 C 151 -12, 148 -11, 144 -11 L -146 -11 C -150 -11, -151 -14, -150 -18 Z" fill={c} />
    <path d="M -74 -54 C -62 -74, -48 -78, -20 -78 L -6 -78 L -6 -54 Z M 2 -78 L 29 -78 C 50 -77, 62 -67, 75 -54 L 2 -54 Z" fill={mix(c, '#FFFFFF', 0.16)} />
    <circle cx={-95} cy={-12} r={20} fill={mix(c, '#000000', 0.4)} />
    <circle cx={95} cy={-12} r={20} fill={mix(c, '#000000', 0.4)} />
    <circle cx={-95} cy={-12} r={8} fill={mix(c, '#FFFFFF', 0.2)} />
    <circle cx={95} cy={-12} r={8} fill={mix(c, '#FFFFFF', 0.2)} />
  </g>
);

// Libros finos en una balda (lomo con título opcional, para el plano cercano).
export const ShelfBooks: React.FC<{ x: number; y: number; n: number; c: string; titles?: string[]; scale?: number; seed?: string }> = ({ x, y, n, c, titles, scale = 1, seed = 'sb' }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    {Array.from({ length: n }).map((_, i) => {
      const h = 64 + random(`${seed}${i}h`) * 14;
      const w = 14 + random(`${seed}${i}w`) * 6;
      return <rect key={i} x={i * 22} y={-h} width={w} height={h} fill={titles ? ['#7C2E2A', '#2F4C5E', '#6B5A2E', '#3E5A3A'][i % 4] : c} />;
    })}
    {titles && titles.map((t, i) => (
      <text key={i} transform={`translate(${i * 22 + 12} -6) rotate(-90)`} fontFamily='"EB Garamond", serif' fontWeight={600} fontSize={8} fill="#F2E6CB">{t}</text>
    ))}
  </g>
);

export const House: React.FC<HouseProps> = ({ ink, lights = {}, sky = '#1C2C3E', items = {}, frame, daylight = 0 }) => {
  const H = HOUSE;
  const L = (r: Room) => lights[r] ?? 1;
  const it = { car: 1, tv: 1, jewels: 1, heater: 1, dryer: 1, blender: 1, books: 1, pile: 0, bills: 0, shelfBooks: 1, ...items };
  const win = mix(sky, '#F2E2C0', daylight * 0.6);
  return (
    <g>
      {/* habitaciones (cajas de luz) */}
      <RoomBox r="study" on={L('study')} ink={ink} sky={win} win={[300, 384, 96, 116]} />
      <RoomBox r="kids" on={L('kids')} ink={ink} sky={win} win={[1100, 390, 100, 120]} />
      <RoomBox r="bath" on={L('bath')} ink={ink} sky={win} win={[1520, 380, 70, 90]} />
      <RoomBox r="living" on={L('living')} ink={ink} sky={win} win={[320, 712, 140, 140]} />
      <RoomBox r="kitchen" on={L('kitchen')} ink={ink} sky={win} win={[1430, 712, 120, 110]} />

      {/* ——— estudio ——— */}
      <g>
        <ShelfBooks x={572} y={430} n={it.shelfBooks ? 4 : 0} c={ink} seed="st" />
        <rect x={560} y={430} width={186} height={8} fill={ink} />
        {/* mesa */}
        <rect x={560} y={540} width={186} height={12} fill={ink} />
        <rect x={570} y={552} width={10} height={60} fill={ink} />
        <rect x={726} y={552} width={10} height={60} fill={ink} />
        <TypewriterSide x={612} y={540} c={ink} s={0.62} />
        <DeskLamp x={715} y={540} c={ink} s={0.55} on={L('study')} />
        {/* motas de polvo en la luz de la lámpara */}
        {L('study') > 0.2 && Array.from({ length: 14 }).map((_, i) => {
          const r = (k: string) => random(`hm-${i}-${k}`);
          const mx = 610 + r('x') * 150 + Math.sin(frame / (38 + r('p') * 30) + i) * 7;
          const my = 440 + ((r('y') * 110 + frame * (0.08 + r('v') * 0.12)) % 110);
          return <circle key={`m${i}`} cx={mx} cy={my} r={0.7 + r('s') * 0.7} fill="#FFE6B0" opacity={L('study') * (0.25 + 0.35 * Math.abs(Math.sin(frame / (14 + r('t') * 10) + i)))} />;
        })}
        {/* silla */}
        <rect x={478} y={560} width={60} height={9} fill={ink} />
        <rect x={480} y={569} width={8} height={43} fill={ink} />
        <rect x={528} y={569} width={8} height={43} fill={ink} />
        <rect x={476} y={500} width={8} height={68} fill={ink} />
        {it.heater > 0 && <g opacity={it.heater}><Heater x={410} y={612} c={ink} s={0.7} on={L('study')} /></g>}
        {/* papelera y pila de cuartillas (crece) */}
        <path d="M 356 612 L 350 580 L 384 580 L 378 612 Z" fill={ink} />
        {it.pile > 0 && <rect x={680 - 22} y={540 - 30 * it.pile} width={44} height={30 * it.pile} fill={CREAM} />}
      </g>

      {/* ——— cuarto de los niños ——— */}
      <g>
        <rect x={800} y={560} width={180} height={50} rx={6} fill={ink} />
        <rect x={800} y={530} width={18} height={80} fill={ink} />
        <rect x={1000} y={560} width={180} height={50} rx={6} fill={ink} />
        <rect x={1162} y={530} width={18} height={80} fill={ink} />
        <circle cx={1060} cy={600} r={14} fill={ink} />
        <path d="M 900 470 L 960 470 L 930 420 Z" fill={ink} opacity={0.9} />
      </g>

      {/* ——— baño ——— */}
      <g>
        <rect x={1290} y={520} width={110} height={92} rx={10} fill={ink} />
        <rect x={1300} y={440} width={70} height={60} rx={6} fill={mix(ink, '#C9DDE3', 0.3)} />
        <rect x={1420} y={540} width={70} height={10} fill={ink} />
        {it.dryer > 0 && <g opacity={it.dryer}><HairDryer x={1455} y={528} c={ink} s={0.55} /></g>}
      </g>

      {/* ——— sala ——— */}
      <g>
        <path d="M 572 940 L 572 880 C 572 864, 582 858, 600 858 L 772 858 C 790 858, 800 864, 800 880 L 800 940 Z" fill={ink} />
        <rect x={558} y={890} width={256} height={40} rx={14} fill={ink} />
        {it.tv > 0 && <g opacity={it.tv}><TV60 x={500} y={940} c={ink} s={0.72} on={0} /></g>}
        {/* escalera */}
        <path d="M 300 958 L 300 940 L 330 940 L 330 916 L 360 916 L 360 892 L 390 892 L 390 868 L 420 868 L 420 844 L 450 844 L 450 958 Z" fill={ink} opacity={0.85} />
        {/* cómoda con el joyero */}
        <rect x={600} y={760} width={0} height={0} fill={ink} />
      </g>

      {/* ——— cocina ——— */}
      <g>
        <rect x={1100} y={850} width={250} height={12} fill={ink} />
        <rect x={1110} y={862} width={10} height={80} fill={ink} />
        <rect x={1330} y={862} width={10} height={80} fill={ink} />
        <rect x={1400} y={850} width={220} height={108} fill={ink} />
        <rect x={1400} y={840} width={220} height={12} fill={ink} />
        {it.blender > 0 && <g opacity={it.blender}><Blender x={1580} y={840} c={ink} s={0.8} /></g>}
        <path d="M 960 760 L 1060 760 L 1060 820 L 960 820 Z" fill={ink} opacity={0.6} />
        {it.jewels > 0 && <g opacity={it.jewels}><rect x={1130} y={828} width={44} height={22} rx={3} fill={ink} /><rect x={1128} y={820} width={48} height={10} rx={3} fill={ink} /></g>}
      </g>

      {/* ——— estructura (muros, forjados, tejado con tinaco) ——— */}
      <g fill={ink}>
        <rect x={H.x0} y={H.top} width={H.wall} height={H.ground - H.top} />
        <rect x={H.x1 - H.wall} y={H.top} width={H.wall} height={H.ground - H.top} />
        <rect x={H.x0} y={H.top} width={H.x1 - H.x0} height={H.wall} />
        <rect x={H.x0} y={H.mid - H.wall} width={H.x1 - H.x0} height={H.wall * 2} />
        <rect x={760} y={H.top} width={22} height={H.mid - H.top} />
        <rect x={1238} y={H.top} width={22} height={H.mid - H.top} />
        <rect x={900} y={H.mid} width={22} height={H.ground - H.mid} />
        <rect x={H.x0 - 30} y={H.top - 14} width={H.x1 - H.x0 + 60} height={16} />
        <rect x={H.x0 - 10} y={H.top - 40} width={H.x1 - H.x0 + 20} height={28} />
        <rect x={1420} y={H.top - 120} width={120} height={84} rx={8} />
        <rect x={1430} y={H.top - 40} width={10} height={20} />
        <rect x={1520} y={H.top - 40} width={10} height={20} />
        <rect x={300} y={H.top - 80} width={8} height={50} />
        <path d="M 270 250 L 340 250 M 304 250 L 304 230" stroke={ink} strokeWidth={4} />
        <rect x={H.x0 - 400} y={H.ground} width={H.x1 - H.x0 + 1400} height={300} />
      </g>

      {/* fuera: cochera con el coche */}
      <g>
        <rect x={1680} y={760} width={8} height={220} fill={ink} />
        <rect x={1660} y={750} width={360} height={14} fill={ink} />
        {it.car > 0 && <g opacity={it.car}><Car60Mini x={1860} y={980} c={ink} s={1.05} /></g>}
      </g>
      {frame < 0 && null}
    </g>
  );
};
