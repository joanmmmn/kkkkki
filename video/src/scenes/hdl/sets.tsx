import React from 'react';
import { random } from 'remotion';
import { P } from './kit';
import { Beam, Halo, mix } from './theatre';

// ————————————————————————————————————————————————————————————————
// v2 · Decorados y atrezo en silueta (SVG, coordenadas de escena 1920×1080).
// Convención de color: la silueta va en `c` (tinta oscura del plano); lo que tiene luz propia (ventanas, farolas,
// esferas) en tonos cálidos; los objetos protagonistas (el manuscrito, el dinero, los papeles) en papel crema.
// ————————————————————————————————————————————————————————————————

export const WARM = '#FFD58A';
export const WARM2 = '#F2B45E';
export const CREAM = '#F4EAD5';

// ———————— Ciudad de noche ————————
// Perfil de edificios (con una torre alta tipo años cincuenta) y ventanas encendidas que parpadean muy de vez en cuando.
export const Skyline: React.FC<{ y: number; c: string; lit?: string; frame: number; seed?: string; tower?: number; from?: number; to?: number }> = ({ y, c, lit = WARM, frame, seed = 'sky', tower = 1640, from = -200, to = 2120 }) => {
  const bs: React.ReactNode[] = [];
  let x = from;
  let i = 0;
  while (x < to) {
    const r = (k: string) => random(`${seed}-${i}-${k}`);
    const w = 70 + r('w') * 130;
    const h = 90 + r('h') * 220;
    const top = y - h;
    bs.push(<rect key={`b${i}`} x={x} y={top} width={w + 2} height={h + 400} fill={c} />);
    if (r('roof') > 0.7) bs.push(<rect key={`a${i}`} x={x + w * 0.3} y={top - 22} width={8} height={24} fill={c} />);
    const cols = Math.max(2, Math.floor(w / 22));
    const rows = Math.floor(h / 30);
    for (let a = 0; a < rows; a++) {
      for (let b = 0; b < cols; b++) {
        const q = random(`${seed}-${i}-${a}-${b}`);
        if (q > 0.86) {
          const blink = random(`${seed}-${i}-${a}-${b}-t`) > 0.93 && Math.floor((frame + q * 400) / 90) % 3 === 0 ? 0.25 : 1;
          bs.push(<rect key={`w${i}-${a}-${b}`} x={x + 8 + b * ((w - 14) / cols)} y={top + 14 + a * 30} width={7} height={11} fill={lit} opacity={(0.55 + q * 0.4) * blink} />);
        }
      }
    }
    x += w - 4;
    i++;
  }
  // torre alta escalonada con antena
  const T = tower;
  bs.push(
    <g key="tower" fill={c}>
      <path d={`M ${T - 50} ${y} L ${T - 50} ${y - 420} L ${T - 40} ${y - 430} L ${T - 40} ${y - 500} L ${T - 28} ${y - 510} L ${T - 28} ${y - 560} L ${T - 14} ${y - 570} L ${T - 3} ${y - 660} L ${T + 3} ${y - 660} L ${T + 14} ${y - 570} L ${T + 28} ${y - 560} L ${T + 28} ${y - 510} L ${T + 40} ${y - 500} L ${T + 40} ${y - 430} L ${T + 50} ${y - 420} L ${T + 50} ${y} Z`} />
      <circle cx={T} cy={y - 664} r={3} fill="#FF6A4A" opacity={Math.floor(frame / 30) % 2 ? 1 : 0.25} />
    </g>,
  );
  for (let a = 0; a < 13; a++) {
    for (let b = 0; b < 4; b++) {
      if (random(`tw-${a}-${b}`) > 0.6) bs.push(<rect key={`tw${a}-${b}`} x={T - 40 + b * 21} y={y - 400 + a * 30} width={9} height={12} fill={lit} opacity={0.6} />);
    }
  }
  return <g>{bs}</g>;
};

// Volcán lejano (los volcanes del valle de México), muy tenue.
export const Volcano: React.FC<{ x: number; y: number; w: number; h: number; c: string; snow?: string }> = ({ x, y, w, h, c, snow }) => (
  <g>
    <path d={`M ${x - w / 2} ${y} C ${x - w * 0.22} ${y - h * 0.55}, ${x - w * 0.1} ${y - h * 0.95}, ${x - w * 0.04} ${y - h} L ${x + w * 0.05} ${y - h} C ${x + w * 0.12} ${y - h * 0.9}, ${x + w * 0.25} ${y - h * 0.5}, ${x + w / 2} ${y} Z`} fill={c} />
    {snow && <path d={`M ${x - w * 0.09} ${y - h * 0.82} C ${x - w * 0.06} ${y - h * 0.95}, ${x - w * 0.04} ${y - h}, ${x - w * 0.04} ${y - h} L ${x + w * 0.05} ${y - h} C ${x + w * 0.08} ${y - h * 0.94}, ${x + w * 0.1} ${y - h * 0.88}, ${x + w * 0.12} ${y - h * 0.8} C ${x + w * 0.06} ${y - h * 0.84}, ${x + w * 0.02} ${y - h * 0.78}, ${x - w * 0.02} ${y - h * 0.84} C ${x - w * 0.05} ${y - h * 0.8}, ${x - w * 0.07} ${y - h * 0.8}, ${x - w * 0.09} ${y - h * 0.82} Z`} fill={snow} />}
  </g>
);

// ———————— La oficina de correos (fachada) ————————
export const PostOffice: React.FC<{ c: string; frame: number; sign?: number; glass?: number }> = ({ c, frame, sign = 1, glass = 1 }) => {
  const x0 = 380, x1 = 1540, top = 250, base = 872;
  const dark = mix(c, '#000000', 0.35);
  const lite = mix(c, '#FFFFFF', 0.06);
  const glassFill = (k: number) => `url(#glass${k})`;
  const arches = [470, 670, 1250, 1450];
  return (
    <g>
      <defs>
        {[0, 1].map((k) => (
          <linearGradient key={k} id={`glass${k}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFE2A6" stopOpacity={0.95 * glass} />
            <stop offset="0.6" stopColor="#F2A85A" stopOpacity={0.92 * glass} />
            <stop offset="1" stopColor="#B8642E" stopOpacity={0.9 * glass} />
          </linearGradient>
        ))}
      </defs>
      {/* cuerpo */}
      <rect x={x0} y={top} width={x1 - x0} height={base - top + 200} fill={c} />
      {/* cornisa con dentículos */}
      <rect x={x0 - 26} y={top - 6} width={x1 - x0 + 52} height={26} fill={dark} />
      {Array.from({ length: 58 }).map((_, i) => <rect key={i} x={x0 - 14 + i * 20.6} y={top + 20} width={10} height={10} fill={dark} />)}
      {/* remate con el rótulo */}
      <path d={`M 740 ${top - 6} L 740 ${top - 70} L 760 ${top - 92} L 1160 ${top - 92} L 1180 ${top - 70} L 1180 ${top - 6} Z`} fill={c} />
      <rect x={770} y={top - 80} width={380} height={62} fill={dark} />
      <Halo x={960} y={top - 50} r={300} c={WARM} a={0.28 * sign} />
      <text x={960} y={top - 32} textAnchor="middle" fontFamily='"EB Garamond", serif' fontWeight={700} fontSize={52} letterSpacing={18} fill={WARM} opacity={0.35 + 0.65 * sign}>CORREOS</text>
      {/* piso alto: ventanas */}
      {[470, 600, 730, 1190, 1320, 1450].map((wx, i) => {
        const on = random(`po-up-${i}`) > 0.55;
        return (
          <g key={i}>
            <rect x={wx - 34} y={330} width={68} height={140} fill={on ? '#E9B262' : dark} opacity={on ? 0.85 * glass : 1} />
            <rect x={wx - 2} y={330} width={4} height={140} fill={c} />
            <rect x={wx - 34} y={396} width={68} height={4} fill={c} />
            <rect x={wx - 44} y={470} width={88} height={10} fill={dark} />
            <path d={`M ${wx - 44} 330 L ${wx} 304 L ${wx + 44} 330 Z`} fill={dark} />
          </g>
        );
      })}
      <rect x={x0} y={520} width={x1 - x0} height={14} fill={dark} />
      {/* planta baja: arcos iluminados */}
      {arches.map((ax, i) => (
        <g key={i}>
          <path d={`M ${ax - 70} 846 L ${ax - 70} 650 A 70 70 0 0 1 ${ax + 70} 650 L ${ax + 70} 846 Z`} fill={glassFill(0)} />
          {/* parteluces */}
          <path d={`M ${ax} 580 L ${ax} 846 M ${ax - 70} 700 L ${ax + 70} 700 M ${ax - 70} 776 L ${ax + 70} 776`} stroke={c} strokeWidth={6} />
          <path d={`M ${ax - 66} 650 A 66 66 0 0 1 ${ax + 66} 650`} stroke={c} strokeWidth={6} fill="none" />
          {/* lámpara dentro */}
          <path d={`M ${ax + 30} 580 L ${ax + 30} 640`} stroke={dark} strokeWidth={3} opacity={0.6} />
          <path d={`M ${ax + 14} 640 L ${ax + 46} 640 L ${ax + 40} 628 L ${ax + 20} 628 Z`} fill={dark} opacity={0.6} />
          <path d={`M ${ax - 82} 846 L ${ax + 82} 846 L ${ax + 82} 858 L ${ax - 82} 858 Z`} fill={dark} />
        </g>
      ))}
      {/* pilastras */}
      {[400, 570, 770, 1150, 1350, 1520].map((px, i) => <rect key={i} x={px - 12} y={534} width={24} height={base - 534} fill={lite} />)}
      {/* puerta central abierta */}
      <path d={`M 880 ${base} L 880 640 A 80 80 0 0 1 1040 640 L 1040 ${base} Z`} fill={glassFill(1)} />
      <path d={`M 880 ${base} L 880 640 A 80 80 0 0 1 1040 640 L 1040 ${base}`} stroke={dark} strokeWidth={14} fill="none" />
      <path d={`M 884 ${base} L 884 700 L 930 690 L 930 ${base + 4} Z`} fill={c} />
      <path d={`M 1036 ${base} L 1036 700 L 990 690 L 990 ${base + 4} Z`} fill={c} />
      {/* escalones */}
      <rect x={850} y={base} width={220} height={10} fill={dark} />
      <rect x={830} y={base + 10} width={260} height={10} fill={c} />
    </g>
  );
};

// ———————— Farola ————————
export const StreetLamp: React.FC<{ x: number; y: number; c: string; h?: number; on?: number; flick?: number }> = ({ x, y, c, h = 520, on = 1, flick = 1 }) => (
  <g>
    <Halo x={x} y={y - h + 40} r={240} c={WARM} a={0.42 * on * flick} />
    <Beam x={x} y={y - h + 60} w0={60} w1={520} len={h - 60} c={WARM} a={0.12 * on * flick} />
    <rect x={x - 7} y={y - h + 70} width={14} height={h - 70} fill={c} />
    <path d={`M ${x - 22} ${y} L ${x - 14} ${y - 70} L ${x + 14} ${y - 70} L ${x + 22} ${y} Z`} fill={c} />
    <path d={`M ${x - 30} ${y - h + 70} L ${x + 30} ${y - h + 70} L ${x + 22} ${y - h + 62} L ${x - 22} ${y - h + 62} Z`} fill={c} />
    <path d={`M ${x - 22} ${y - h + 62} L ${x - 28} ${y - h + 14} L ${x + 28} ${y - h + 14} L ${x + 22} ${y - h + 62} Z`} fill={WARM} opacity={0.35 + 0.65 * on * flick} />
    <path d={`M ${x} ${y - h + 14} L ${x} ${y - h + 62} M ${x - 25} ${y - h + 38} L ${x + 25} ${y - h + 38}`} stroke={c} strokeWidth={3} />
    <path d={`M ${x - 34} ${y - h + 14} L ${x} ${y - h - 14} L ${x + 34} ${y - h + 14} Z`} fill={c} />
    <circle cx={x} cy={y - h - 20} r={6} fill={c} />
  </g>
);

// ———————— Coche de los sesenta (perfil) ————————
export const Car60: React.FC<{ x: number; y: number; c: string; scale?: number; wheel?: number; lights?: number; face?: 1 | -1; win?: string }> = ({ x, y, c, scale = 1, wheel = 0, lights = 1, face = 1, win }) => {
  const wl = (wx: number) => (
    <g transform={`translate(${wx} -38) rotate(${wheel})`}>
      <circle r={38} fill={mix(c, '#000000', 0.4)} />
      <circle r={17} fill={mix(c, '#FFFFFF', 0.18)} />
      <path d="M -17 0 L 17 0 M 0 -17 L 0 17" stroke={c} strokeWidth={3} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${face * scale} ${scale})`}>
      {lights > 0 && <Beam x={300} y={-70} w0={20} w1={420} len={900} rot={-90} c={WARM} a={0.22 * lights} />}
      <path d="M -300 -50 C -302 -78, -290 -92, -262 -96 L -170 -104 C -140 -150, -110 -164, -40 -166 L 60 -166 C 110 -164, 140 -140, 170 -110 L 262 -100 C 292 -96, 304 -82, 304 -58 L 302 -34 C 302 -26, 296 -22, 288 -22 L -290 -22 C -298 -22, -302 -28, -300 -36 Z" fill={c} />
      {/* ventanillas */}
      <path d="M -148 -108 C -122 -150, -96 -156, -40 -156 L -10 -156 L -10 -108 Z" fill={win ?? mix(c, '#FFFFFF', 0.14)} />
      <path d="M 4 -156 L 58 -156 C 100 -154, 124 -134, 150 -108 L 4 -108 Z" fill={win ?? mix(c, '#FFFFFF', 0.14)} />
      {/* cromados */}
      <rect x={-296} y={-62} width={600} height={4} fill={mix(c, '#FFFFFF', 0.22)} />
      <rect x={290} y={-80} width={14} height={14} rx={3} fill={WARM} opacity={0.4 + 0.6 * lights} />
      <rect x={-302} y={-82} width={10} height={16} rx={3} fill="#E0453A" opacity={0.5 + 0.5 * lights} />
      {wl(-190)}
      {wl(190)}
    </g>
  );
};

// ———————— Interior de correos ————————
export const WallClock: React.FC<{ x: number; y: number; r: number; c: string; t: number; face?: string }> = ({ x, y, r, c, t, face = CREAM }) => {
  const sec = Math.floor(t / 50);
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r + 10} fill={c} />
      <circle r={r} fill={face} />
      {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={0} y1={-r + 6} x2={0} y2={-r + (i % 3 ? 14 : 22)} stroke={c} strokeWidth={i % 3 ? 3 : 6} transform={`rotate(${i * 30})`} />)}
      <line x1={0} y1={8} x2={0} y2={-r * 0.5} stroke={c} strokeWidth={8} strokeLinecap="round" transform="rotate(256)" />
      <line x1={0} y1={8} x2={0} y2={-r * 0.78} stroke={c} strokeWidth={5} strokeLinecap="round" transform="rotate(46)" />
      <line x1={0} y1={12} x2={0} y2={-r * 0.84} stroke={P.red} strokeWidth={2} transform={`rotate(${sec * 6 + 130})`} />
      <circle r={6} fill={c} />
    </g>
  );
};

// Lámpara colgante con su cono de luz.
export const HangLamp: React.FC<{ x: number; y: number; c: string; cord?: number; swing?: number; on?: number; len?: number }> = ({ x, y, c, cord = 200, swing = 0, on = 1, len = 700 }) => (
  <g transform={`translate(${x} ${y - cord}) rotate(${swing})`}>
    <Beam x={0} y={cord + 40} w0={130} w1={760} len={len} c={WARM} a={0.2 * on} />
    <Halo x={0} y={cord + 36} r={260} c={WARM} a={0.5 * on} />
    <line x1={0} y1={-400} x2={0} y2={cord} stroke={c} strokeWidth={4} />
    <path d={`M -80 ${cord + 40} C -70 ${cord + 6}, -36 ${cord - 4}, 0 ${cord - 4} C 36 ${cord - 4}, 70 ${cord + 6}, 80 ${cord + 40} Z`} fill={c} />
    <ellipse cx={0} cy={cord + 42} rx={30} ry={10} fill={WARM} opacity={0.3 + 0.7 * on} />
  </g>
);

// Mostrador (de perfil) con su panel de madera.
export const Counter: React.FC<{ x0: number; x1: number; top: number; floor: number; c: string }> = ({ x0, x1, top, floor, c }) => (
  <g>
    <rect x={x0 - 24} y={top - 16} width={x1 - x0 + 48} height={20} rx={4} fill={c} />
    <rect x={x0} y={top} width={x1 - x0} height={floor - top + 120} fill={c} />
    {Array.from({ length: Math.floor((x1 - x0) / 120) }).map((_, i) => (
      <rect key={i} x={x0 + 24 + i * 120} y={top + 40} width={92} height={floor - top - 90} rx={6} fill="none" stroke={mix(c, '#FFFFFF', 0.08)} strokeWidth={3} />
    ))}
  </g>
);

// Báscula postal de perfil: plato arriba, cuerpo y esfera con aguja (la esfera es lo único con luz).
export const ScaleSide: React.FC<{ x: number; y: number; c: string; needle: number; plate?: number; s?: number }> = ({ x, y, c, needle, plate = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-110} y={-150 + plate} width={220} height={12} rx={4} fill={c} />
    <rect x={-14} y={-140 + plate} width={28} height={30} fill={c} />
    <path d="M -80 -112 L 80 -112 L 96 0 L -96 0 Z" fill={c} />
    <circle cx={0} cy={-56} r={40} fill={CREAM} />
    {Array.from({ length: 13 }).map((_, i) => {
      const a = ((-120 + i * 20) * Math.PI) / 180;
      return <line key={i} x1={Math.sin(a) * 30} y1={-56 - Math.cos(a) * 30} x2={Math.sin(a) * 36} y2={-56 - Math.cos(a) * 36} stroke={c} strokeWidth={i % 3 ? 1.5 : 3} />;
    })}
    <g transform={`translate(0 -56) rotate(${needle})`}>
      <path d="M -2 4 L 0 -34 L 2 4 Z" fill={P.red} />
    </g>
    <circle cx={0} cy={-56} r={4} fill={c} />
  </g>
);

// El manuscrito de perfil: pila de cuartillas (crema), con cordel opcional y papel de estraza (`wrap` 0→1).
export const Manuscript: React.FC<{ x: number; y: number; w?: number; h?: number; wrap?: number; string?: number; lift?: number; c?: string; tilt?: number }> = ({ x, y, w = 150, h = 42, wrap = 0, string = 0, lift = 0, c = P.ink, tilt = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
    <rect x={-w / 2} y={-h} width={w} height={h} rx={2} fill={CREAM} />
    {Array.from({ length: Math.round(h / 4) }).map((_, i) => <line key={i} x1={-w / 2 + 2} x2={w / 2 - 2} y1={-h + 3 + i * 4} y2={-h + 3 + i * 4} stroke="#B9A684" strokeWidth={0.8} opacity={0.8} />)}
    {lift > 0 && <path d={`M ${-w / 2} ${-h} L ${-w / 2 + w * 0.9} ${-h - lift * 26} L ${w / 2} ${-h} Z`} fill="#FFF8E8" />}
    {wrap > 0 && <rect x={-w / 2 - 3} y={-h - 3} width={w + 6} height={h + 3} rx={3} fill="#B98A55" opacity={wrap} />}
    {string > 0 && (
      <g stroke="#5A3A1E" strokeWidth={3} opacity={string}>
        <line x1={-w * 0.1} y1={-h - 3} x2={-w * 0.1} y2={0} />
        <line x1={w * 0.1} y1={-h - 3} x2={w * 0.1} y2={0} />
        <path d={`M ${-w * 0.1} ${-h - 3} C ${-w * 0.02} ${-h - 16}, ${w * 0.02} ${-h - 16}, ${w * 0.1} ${-h - 3}`} fill="none" />
      </g>
    )}
    <rect x={-w / 2} y={-2} width={w} height={2} fill={c} opacity={0.25} />
  </g>
);

// Saca de correos.
export const MailSack: React.FC<{ x: number; y: number; c: string }> = ({ x, y, c }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M -90 0 C -110 -60, -100 -170, -70 -200 L 70 -200 C 100 -170, 110 -60, 90 0 Z" fill={c} />
    <path d="M -76 -200 C -40 -214, 40 -214, 76 -200" stroke={mix(c, '#FFFFFF', 0.12)} strokeWidth={6} fill="none" />
  </g>
);

// Cartel colgante («VENTANILLA · FRANQUEO»).
export const HangSign: React.FC<{ x: number; y: number; c: string; text: string; w?: number; ink?: string }> = ({ x, y, c, text, w = 380, ink = CREAM }) => (
  <g transform={`translate(${x} ${y})`}>
    <line x1={-w * 0.35} y1={-300} x2={-w * 0.35} y2={0} stroke={c} strokeWidth={3} />
    <line x1={w * 0.35} y1={-300} x2={w * 0.35} y2={0} stroke={c} strokeWidth={3} />
    <rect x={-w / 2} y={0} width={w} height={70} rx={6} fill={c} />
    <text x={0} y={46} textAnchor="middle" fontFamily='"EB Garamond", serif' fontWeight={600} fontSize={34} letterSpacing={6} fill={ink} opacity={0.9}>{text}</text>
  </g>
);

// ———————— Aracataca (recuerdo): la casa de los abuelos ————————
// Platanera (mata de plátano): tallo y hojas grandes caídas.
export const Banana: React.FC<{ x: number; y: number; h: number; c: string; sway?: number; seed?: string }> = ({ x, y, h, c, sway = 0, seed = 'bn' }) => {
  const leaves = 6;
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M -7 0 C -6 ${-h * 0.5}, -5 ${-h * 0.8}, -3 ${-h} L 3 ${-h} C 5 ${-h * 0.8}, 6 ${-h * 0.5}, 7 0 Z`} fill={c} />
      {Array.from({ length: leaves }).map((_, i) => {
        const side = i % 2 ? 1 : -1;
        const a = side * (25 + random(`${seed}${i}`) * 45) + sway * Math.sin(i);
        const L = h * (0.45 + random(`${seed}l${i}`) * 0.25);
        return (
          <g key={i} transform={`translate(0 ${-h + 6}) rotate(${a})`}>
            <path d={`M 0 0 C ${L * 0.15} ${-L * 0.35}, ${L * 0.25} ${-L * 0.75}, ${side * 4} ${-L} C ${-L * 0.3} ${-L * 0.7}, ${-L * 0.2} ${-L * 0.3}, 0 0 Z`} fill={c} transform={`scale(${side} 1)`} />
          </g>
        );
      })}
    </g>
  );
};

// Almendro: copa redonda hecha de varias masas.
export const Tree: React.FC<{ x: number; y: number; r: number; c: string; seed?: string }> = ({ x, y, r, c, seed = 'tr' }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={`M -14 0 C -10 ${-r * 0.6}, -18 ${-r}, -40 ${-r * 1.3} L -30 ${-r * 1.36} C -8 ${-r * 1.1}, 0 ${-r * 0.9}, 6 ${-r * 1.2} L 16 ${-r * 1.2} C 12 ${-r * 0.8}, 14 ${-r * 0.4}, 18 0 Z`} fill={c} />
    {Array.from({ length: 9 }).map((_, i) => {
      const a = (i / 9) * Math.PI * 2;
      return <circle key={i} cx={Math.cos(a) * r * 0.6 + (random(`${seed}${i}`) - 0.5) * r * 0.3} cy={-r * 1.6 + Math.sin(a) * r * 0.42} r={r * (0.38 + random(`${seed}r${i}`) * 0.18)} fill={c} />;
    })}
    <circle cx={0} cy={-r * 1.6} r={r * 0.6} fill={c} />
  </g>
);

// La casa de Aracataca: casa larga de una planta, corredor con columnas y techo de zinc.
export const CaribHouseSil: React.FC<{ x: number; y: number; c: string; light: string; w?: number }> = ({ x, y, c, light, w = 1100 }) => {
  const h = 230;
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* techo de zinc a dos aguas (perfil largo) */}
      <path d={`M ${-w / 2 - 40} ${-h} L ${-w / 2 + 60} ${-h - 120} L ${w / 2 - 60} ${-h - 120} L ${w / 2 + 40} ${-h} Z`} fill={c} />
      {Array.from({ length: Math.floor(w / 26) }).map((_, i) => <line key={i} x1={-w / 2 + 60 + i * 26} y1={-h - 118} x2={-w / 2 - 30 + i * 27.6} y2={-h - 4} stroke={light} strokeWidth={2} opacity={0.18} />)}
      {/* muro */}
      <rect x={-w / 2} y={-h} width={w} height={h} fill={c} />
      {/* corredor: columnas que dejan ver la luz */}
      {Array.from({ length: 9 }).map((_, i) => {
        const cx = -w / 2 + 40 + i * ((w - 80) / 8);
        return i < 8 ? <rect key={i} x={cx + 16} y={-h + 20} width={(w - 80) / 8 - 32} height={h - 70} fill={light} opacity={0.5} /> : null;
      })}
      {/* ventanas con rejas y puerta */}
      {[-3, -1, 2].map((k, i) => (
        <g key={i}>
          <rect x={k * 120 - 34} y={-h + 60} width={68} height={100} fill={mix(c, '#000000', 0.3)} />
          {[0, 1, 2, 3].map((b) => <rect key={b} x={k * 120 - 30 + b * 18} y={-h + 60} width={4} height={100} fill={c} />)}
        </g>
      ))}
      <rect x={70} y={-h + 50} width={90} height={h - 50} fill={mix(c, '#000000', 0.35)} />
      <rect x={-w / 2 - 10} y={-10} width={w + 20} height={10} fill={c} />
    </g>
  );
};

// Sierra (montañas lejanas, tenues).
export const Ridge: React.FC<{ y: number; c: string; amp: number; seed: string; peaks?: number }> = ({ y, c, amp, seed, peaks = 7 }) => {
  let d = `M -200 ${y + 300} L -200 ${y}`;
  for (let i = 0; i <= peaks; i++) {
    const x = -200 + (i * 2320) / peaks;
    const py = y - amp * (0.4 + random(`${seed}${i}`) * 0.6);
    const vx = x + 2320 / peaks / 2;
    const vy = y - amp * random(`${seed}v${i}`) * 0.3;
    d += ` L ${x} ${py} L ${vx} ${vy}`;
  }
  d += ` L 2120 ${y + 300} Z`;
  return <path d={d} fill={c} />;
};
