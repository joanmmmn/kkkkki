import React from 'react';
import { Head } from './theatre';

// Viñeta de cabecera de capítulo (como los grabados de los libros antiguos): una silueta dentro de un óvalo.
const INK = '#2A2018';
const BG = '#E2D3B4';

const Typewriter = () => (
  <g fill={INK}>
    <rect x={170} y={70} width={110} height={90} fill="#F4EAD5" stroke={INK} strokeWidth={3} />
    {[0, 1, 2, 3].map((k) => <rect key={k} x={184} y={86 + k * 16} width={80 - k * 10} height={4} opacity={0.6} />)}
    <rect x={130} y={150} width={190} height={22} rx={10} />
    <circle cx={126} cy={161} r={14} />
    <path d="M 120 180 L 330 180 L 350 240 L 100 240 Z" />
    {[0, 1, 2].map((r) => Array.from({ length: 8 - r }).map((_, k) => <circle key={`${r}${k}`} cx={142 + r * 10 + k * 24} cy={196 + r * 14} r={5} fill={BG} />))}
  </g>
);

const Road = () => (
  <g>
    <path d="M 40 250 C 140 230, 160 170, 230 160 C 300 150, 320 120, 400 110" stroke={INK} strokeWidth={30} fill="none" />
    <path d="M 40 250 C 140 230, 160 170, 230 160 C 300 150, 320 120, 400 110" stroke={BG} strokeWidth={3} strokeDasharray="10 10" fill="none" />
    <path d="M 0 140 L 70 90 L 120 120 L 180 70 L 250 110 L 320 60 L 420 100 L 420 260 L 0 260 Z" fill={INK} opacity={0.25} />
    <g transform="translate(196 150)" fill={INK}>
      <path d="M -50 0 L -46 -18 L -26 -22 L -14 -38 L 22 -38 L 36 -22 L 50 -18 L 52 0 Z" />
      <circle cx={-30} cy={2} r={10} /><circle cx={32} cy={2} r={10} />
      <rect x={-18} y={-50} width={44} height={10} rx={3} />
    </g>
  </g>
);

const Door = () => (
  <g fill={INK}>
    <rect x={150} y={40} width={140} height={210} />
    <rect x={162} y={52} width={116} height={190} fill="#C9A45C" opacity={0.55} />
    <rect x={150} y={40} width={140} height={210} fill="none" stroke={INK} strokeWidth={10} />
    <rect x={160} y={52} width={114} height={196} />
    <rect x={236} y={242} width={4} height={8} fill="#F3C64B" />
    <path d="M 160 250 L 280 250 L 340 262 L 100 262 Z" fill="#F3C64B" opacity={0.8} />
    <circle cx={262} cy={150} r={7} fill={BG} />
    <line x1={190} y1={84} x2={220} y2={70} stroke={INK} strokeWidth={2} />
    <line x1={250} y1={84} x2={220} y2={70} stroke={INK} strokeWidth={2} />
    <rect x={182} y={84} width={76} height={40} fill="#F4EAD5" stroke={INK} strokeWidth={2} />
    {[0, 1].map((k) => <rect key={k} x={192} y={96 + k * 12} width={56 - k * 16} height={4} opacity={0.6} />)}
  </g>
);

const Cameo = () => (
  <g>
    <ellipse cx={210} cy={150} rx={88} ry={110} fill="#F4EAD5" stroke={INK} strokeWidth={4} />
    <path d="M 140 262 C 146 214, 176 200, 210 200 C 244 200, 274 214, 280 262 Z" fill={INK} />
    <Head x={196} y={206} h={150} hair="bob" c={INK} />
  </g>
);

const Parcel = () => (
  <g fill={INK}>
    <rect x={120} y={230} width={200} height={18} />
    <rect x={204} y={190} width={32} height={42} />
    <rect x={150} y={176} width={140} height={16} />
    <circle cx={330} cy={200} r={34} fill="#F4EAD5" stroke={INK} strokeWidth={6} />
    <line x1={330} y1={200} x2={348} y2={180} stroke={INK} strokeWidth={4} />
    <rect x={146} y={86} width={150} height={90} fill="#C9A45C" stroke={INK} strokeWidth={4} />
    <line x1={221} y1={86} x2={221} y2={176} stroke={INK} strokeWidth={4} />
    <line x1={146} y1={130} x2={296} y2={130} stroke={INK} strokeWidth={4} />
    <path d="M 221 86 C 200 64, 186 74, 206 86 M 221 86 C 242 64, 256 74, 236 86" stroke={INK} strokeWidth={4} fill="none" />
  </g>
);

const Stacks = () => (
  <g>
    {[[120, 6], [210, 10], [300, 8]].map(([x, n], s) => Array.from({ length: n }).map((_, k) => (
      <g key={`${s}${k}`} transform={`translate(${x + ((k * 7) % 5) - 2} ${248 - k * 18})`}>
        <rect x={-40} y={0} width={80} height={16} rx={2} fill={INK} />
        <rect x={34} y={2} width={4} height={12} fill={BG} opacity={0.8} />
      </g>
    )))}
  </g>
);

const MedalV = () => (
  <g>
    <path d="M 186 30 L 210 120 L 234 30 Z" fill={INK} opacity={0.8} />
    <circle cx={210} cy={170} r={70} fill="#C9A45C" stroke={INK} strokeWidth={5} />
    <circle cx={210} cy={170} r={54} fill="none" stroke={INK} strokeWidth={2} />
    <text x={210} y={184} textAnchor="middle" fontFamily='"EB Garamond", serif' fontWeight={700} fontSize={40} fill={INK}>1982</text>
  </g>
);

const Pins = () => (
  <g>
    <path d="M 110 110 Q 210 170 310 100" stroke="#B5262B" strokeWidth={4} fill="none" />
    <path d="M 310 100 Q 270 190 200 220" stroke="#B5262B" strokeWidth={4} fill="none" />
    {[[90, 90], [290, 80], [180, 200]].map(([x, y], i) => <rect key={i} x={x} y={y} width={70} height={54} fill="#F4EAD5" stroke={INK} strokeWidth={2} transform={`rotate(${(i - 1) * 8} ${x + 35} ${y + 27})`} />)}
    {[[110, 110], [310, 100], [200, 220]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={8} fill="#B5262B" />)}
    <text x={352} y={196} textAnchor="middle" fontFamily='"EB Garamond", serif' fontWeight={700} fontSize={64} fill={INK}>?</text>
  </g>
);

const ART = [Typewriter, Road, Door, Cameo, Parcel, Stacks, MedalV, Pins];

export const ChapterVignette: React.FC<{ index: number; w?: number; k?: number }> = ({ index, w = 360, k = 1 }) => {
  const A = ART[(index - 1) % ART.length];
  const id = `cv${index}`;
  return (
    <svg width={w} height={w * (260 / 420)} viewBox="0 0 420 260" style={{ overflow: 'visible' }}>
      <defs><clipPath id={id}><ellipse cx={210} cy={130} rx={200} ry={124} /></clipPath></defs>
      <ellipse cx={210} cy={130} rx={204} ry={128} fill="none" stroke={INK} strokeWidth={2} opacity={0.5} />
      <g clipPath={`url(#${id})`}>
        <rect width={420} height={260} fill={BG} />
        <g opacity={k}><A /></g>
      </g>
      <ellipse cx={210} cy={130} rx={200} ry={124} fill="none" stroke={INK} strokeWidth={4} />
    </svg>
  );
};
