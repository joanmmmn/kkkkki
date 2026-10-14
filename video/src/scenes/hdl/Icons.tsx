import React from 'react';
import { P } from './kit';

// Ilustraciones propias del episodio (trazo de tinta + tintas planas de la paleta). viewBox propio en cada una.
const S = { stroke: P.ink, strokeWidth: 3, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

export const Car60: React.FC<{ w?: number; c?: string; wheel?: number; lights?: number }> = ({ w = 420, c = '#3E7C8C', wheel = 0, lights = 0 }) => (
  <svg width={w} height={w * 0.42} viewBox="0 0 400 168" style={{ overflow: 'visible' }}>
    {lights > 0 && <path d={`M372 108 L ${372 + 420} ${80} L ${372 + 420} ${150} Z`} fill={`rgba(255,226,150,${0.35 * lights})`} />}
    <path d="M24 112 C 22 92, 40 86, 70 84 L 112 82 C 128 54, 150 40, 196 38 L 252 38 C 280 40, 298 56, 314 80 L 356 86 C 380 90, 386 100, 384 116 L 382 126 L 26 128 Z" fill={c} {...S} />
    <path d="M132 82 C 144 60, 160 52, 192 50 L 222 50 L 222 82 Z" fill="#CFE6EC" {...S} />
    <path d="M234 50 L 254 50 C 274 52, 288 62, 300 82 L 234 82 Z" fill="#CFE6EC" {...S} />
    <path d="M30 112 L 384 112" stroke="#F4EFE6" strokeWidth={4} opacity={0.8} />
    <rect x={366} y={96} width={16} height={10} rx={3} fill="#FFE6A0" {...S} strokeWidth={2} />
    <rect x={20} y={98} width={12} height={10} rx={3} fill={P.red} {...S} strokeWidth={2} />
    {[96, 306].map((cx) => (
      <g key={cx} transform={`rotate(${wheel} ${cx} 130)`}>
        <circle cx={cx} cy={130} r={28} fill={P.ink} />
        <circle cx={cx} cy={130} r={14} fill="#D9D4C7" stroke={P.ink} strokeWidth={2} />
        <path d={`M${cx - 12} 130 L ${cx + 12} 130 M ${cx} 118 L ${cx} 142`} stroke={P.ink} strokeWidth={2.5} />
      </g>
    ))}
  </svg>
);

export const Typewriter: React.FC<{ w?: number; paper?: number; press?: number; c?: string }> = ({ w = 360, paper = 1, press = 0, c = '#2F4F4A' }) => (
  <svg width={w} height={w * 0.86} viewBox="0 0 300 258" style={{ overflow: 'visible' }}>
    <rect x={90} y={30 - 70 * paper} width={120} height={110 + 70 * paper} fill="#FBF7EE" {...S} strokeWidth={2.5} />
    {Array.from({ length: Math.round(6 * paper) }).map((_, i) => <rect key={i} x={104} y={40 - 70 * paper + i * 14} width={70 + (i % 3) * 8} height={4} rx={2} fill={P.ink2} opacity={0.6} />)}
    <rect x={40} y={92} width={220} height={26} rx={12} fill={P.ink} />
    <circle cx={36} cy={105} r={12} fill={P.ink} /><circle cx={264} cy={105} r={12} fill={P.ink} />
    <path d="M26 128 L 274 128 L 290 226 Q 292 240 278 240 L 22 240 Q 8 240 10 226 Z" fill={c} {...S} />
    {[0, 1, 2].map((r) => Array.from({ length: 9 - r }).map((_, k) => (
      <circle key={`${r}-${k}`} cx={64 + r * 11 + k * 22} cy={160 + r * 22 + (r === 1 && k === 3 ? press * 3 : 0)} r={8} fill="#EDE6D6" stroke={P.ink} strokeWidth={2} />
    )))}
    <rect x={96} y={216 + press * 2} width={108} height={12} rx={6} fill="#EDE6D6" stroke={P.ink} strokeWidth={2} />
  </svg>
);

export const CaribHouse: React.FC<{ w?: number; glow?: number; door?: string }> = ({ w = 420, glow = 0, door = P.jungle }) => (
  <svg width={w} height={w * 0.72} viewBox="0 0 420 302" style={{ overflow: 'visible' }}>
    <path d="M40 120 L 210 30 L 380 120 Z" fill={P.terra} {...S} />
    {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M${80 + i * 32} ${100 - (i < 4 ? i : 8 - i) * 14} L ${70 + i * 32} 118`} stroke="rgba(0,0,0,0.25)" strokeWidth={2} />)}
    <rect x={60} y={118} width={300} height={160} fill="#F5E9CF" {...S} />
    <rect x={60} y={118} width={300} height={18} fill="#E7D6B2" {...S} strokeWidth={2} />
    <rect x={180} y={170} width={60} height={108} fill={door} {...S} />
    <circle cx={228} cy={226} r={4} fill={P.yellow} />
    {[90, 270].map((x) => (
      <g key={x}>
        <rect x={x} y={158} width={60} height={64} fill={glow > 0 ? `rgba(255,202,5,${0.3 + 0.7 * glow})` : '#9CC2CF'} {...S} />
        <path d={`M${x + 30} 158 L ${x + 30} 222 M ${x} 190 L ${x + 60} 190`} stroke={P.ink} strokeWidth={2.5} />
        <rect x={x - 12} y={154} width={12} height={72} fill={P.jungle2} stroke={P.ink} strokeWidth={2} />
        <rect x={x + 60} y={154} width={12} height={72} fill={P.jungle2} stroke={P.ink} strokeWidth={2} />
      </g>
    ))}
    <path d="M30 280 L 390 280" {...S} />
  </svg>
);

export const Palm: React.FC<{ h?: number; sway?: number; c?: string }> = ({ h = 420, sway = 0, c = P.jungle2 }) => (
  <svg width={h * 0.7} height={h} viewBox="0 0 280 400" style={{ overflow: 'visible' }}>
    <path d="M150 400 C 146 300, 130 200, 150 110" stroke="#7A5A3A" strokeWidth={16} fill="none" strokeLinecap="round" />
    <g transform={`rotate(${sway} 150 110)`}>
      {[-150, -110, -60, -20, 20, 70, 120, 160].map((a, i) => (
        <path key={i} transform={`rotate(${a} 150 110)`} d="M150 110 C 190 90, 240 100, 270 140 C 230 120, 190 118, 150 110 Z" fill={c} stroke={P.ink} strokeWidth={2.5} />
      ))}
      <circle cx={150} cy={116} r={10} fill="#6B4A2A" stroke={P.ink} strokeWidth={2} />
    </g>
  </svg>
);

export const Heater: React.FC<{ s?: number; on?: number }> = ({ s = 80, on = 1 }) => (
  <svg width={s} height={s} viewBox="0 0 100 100">
    <rect x={18} y={14} width={64} height={62} rx={10} fill="#C9C2B4" {...S} />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={28} y={24 + i * 12} width={44} height={6} rx={3} fill={on > 0 ? `rgba(230,90,40,${0.4 + 0.6 * on})` : '#8F887B'} />)}
    <path d="M30 76 L 24 90 M 70 76 L 76 90" {...S} />
  </svg>
);
export const HairDryer: React.FC<{ s?: number }> = ({ s = 80 }) => (
  <svg width={s} height={s} viewBox="0 0 100 100">
    <path d="M12 30 C 12 18, 24 14, 40 14 L 70 18 C 80 20, 84 26, 84 36 C 84 46, 80 52, 70 54 L 40 58 C 24 58, 12 52, 12 40 Z" fill="#E7A9B4" {...S} />
    <rect x={84} y={26} width={10} height={20} rx={3} fill="#D98E9C" {...S} />
    <path d="M40 58 L 46 90 L 60 90 L 58 56 Z" fill="#E7A9B4" {...S} />
    <circle cx={34} cy={36} r={9} fill="#F6E2E6" {...S} strokeWidth={2} />
  </svg>
);
export const Blender: React.FC<{ s?: number }> = ({ s = 80 }) => (
  <svg width={s} height={s} viewBox="0 0 100 100">
    <path d="M30 10 L 70 10 L 64 64 L 36 64 Z" fill="rgba(156,194,207,0.55)" {...S} />
    <rect x={26} y={6} width={48} height={8} rx={3} fill={P.ink} />
    <path d="M28 64 L 72 64 L 78 92 L 22 92 Z" fill="#E8D7A8" {...S} />
    <circle cx={50} cy={78} r={6} fill={P.terra} stroke={P.ink} strokeWidth={2} />
  </svg>
);
export const TV60: React.FC<{ s?: number; on?: number }> = ({ s = 80, on = 0 }) => (
  <svg width={s} height={s} viewBox="0 0 100 100">
    <path d="M38 16 L 48 28 M 62 14 L 52 28" {...S} />
    <rect x={14} y={28} width={72} height={52} rx={10} fill="#8C6A48" {...S} />
    <rect x={22} y={36} width={46} height={36} rx={8} fill={on > 0 ? `rgba(200,230,240,${0.4 + 0.6 * on})` : '#3B4A50'} {...S} strokeWidth={2} />
    <circle cx={77} cy={44} r={3.5} fill={P.ink} /><circle cx={77} cy={56} r={3.5} fill={P.ink} />
    <path d="M28 80 L 22 94 M 72 80 L 78 94" {...S} />
  </svg>
);
export const Jewels: React.FC<{ s?: number }> = ({ s = 80 }) => (
  <svg width={s} height={s} viewBox="0 0 100 100">
    <path d="M18 22 C 22 62, 78 62, 82 22" fill="none" stroke={P.yellowDeep} strokeWidth={4} />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => { const t = i / 6; const x = 18 + 64 * t; const y = 22 + Math.sin(Math.PI * t) * 30; return <circle key={i} cx={x} cy={y} r={4.5} fill="#F7F2E6" stroke={P.ink} strokeWidth={1.5} />; })}
    <path d="M50 54 L 60 66 L 50 82 L 40 66 Z" fill="#2E8B6A" {...S} strokeWidth={2.5} />
  </svg>
);
export const CarIcon: React.FC<{ s?: number }> = ({ s = 80 }) => (
  <svg width={s} height={s} viewBox="0 0 100 100"><g transform="translate(4 30) scale(0.23)"><Car60Inner /></g></svg>
);
const Car60Inner: React.FC = () => (
  <>
    <path d="M24 112 C 22 92, 40 86, 70 84 L 112 82 C 128 54, 150 40, 196 38 L 252 38 C 280 40, 298 56, 314 80 L 356 86 C 380 90, 386 100, 384 116 L 382 126 L 26 128 Z" fill="#3E7C8C" stroke={P.ink} strokeWidth={8} strokeLinejoin="round" />
    <circle cx={96} cy={130} r={28} fill={P.ink} /><circle cx={306} cy={130} r={28} fill={P.ink} />
  </>
);
export const FilmReel: React.FC<{ s?: number; spin?: number }> = ({ s = 80, spin = 0 }) => (
  <svg width={s} height={s} viewBox="0 0 100 100">
    <g transform={`rotate(${spin} 50 50)`}>
      <circle cx={50} cy={50} r={40} fill="#3B3E44" {...S} />
      {[0, 60, 120, 180, 240, 300].map((a) => <circle key={a} cx={50 + Math.cos((a * Math.PI) / 180) * 22} cy={50 + Math.sin((a * Math.PI) / 180) * 22} r={8} fill={P.paper} />)}
      <circle cx={50} cy={50} r={6} fill={P.paper} />
    </g>
  </svg>
);
export const Megaphone: React.FC<{ s?: number }> = ({ s = 80 }) => (
  <svg width={s} height={s} viewBox="0 0 100 100">
    <path d="M18 40 L 30 40 L 74 18 L 74 82 L 30 60 L 18 60 Z" fill={P.terra} {...S} />
    <path d="M30 60 L 36 82 L 46 82 L 42 64" fill="#E8D7A8" {...S} />
    <path d="M82 38 C 88 44, 88 56, 82 62" {...S} fill="none" />
  </svg>
);
export const IceBlock: React.FC<{ s?: number; glow?: number }> = ({ s = 200, glow = 1 }) => (
  <svg width={s} height={s} viewBox="0 0 200 200" style={{ overflow: 'visible' }}>
    <defs>
      <radialGradient id="iceg"><stop offset="0" stopColor="#E9FBFF" stopOpacity={0.9 * glow} /><stop offset="1" stopColor="#9CDCEB" stopOpacity={0} /></radialGradient>
      <linearGradient id="icef" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#F2FDFF" /><stop offset="1" stopColor="#8FD0E0" /></linearGradient>
    </defs>
    <circle cx={100} cy={110} r={130} fill="url(#iceg)" />
    <path d="M40 70 L 110 40 L 168 70 L 168 150 L 98 182 L 40 150 Z" fill="url(#icef)" stroke="#2C6E80" strokeWidth={3} strokeLinejoin="round" />
    <path d="M40 70 L 98 100 L 168 70 M 98 100 L 98 182" stroke="#2C6E80" strokeWidth={2.5} fill="none" opacity={0.8} />
    <path d="M58 92 L 70 118 M 120 120 L 140 108 M 112 60 L 130 66" stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity={0.85} />
  </svg>
);
export const Medal: React.FC<{ s?: number; text?: string }> = ({ s = 260, text = '1982' }) => (
  <svg width={s} height={s * 1.25} viewBox="0 0 200 250" style={{ overflow: 'visible' }}>
    <path d="M60 0 L 100 90 L 140 0 L 116 0 L 100 50 L 84 0 Z" fill={P.jungle} stroke={P.ink} strokeWidth={3} strokeLinejoin="round" />
    <circle cx={100} cy={160} r={78} fill="#E7B53C" stroke={P.ink} strokeWidth={4} />
    <circle cx={100} cy={160} r={62} fill="none" stroke="#B88518" strokeWidth={3} />
    <path d="M70 120 C 96 100, 128 110, 136 136" stroke="#FFE59A" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.7} />
    <text x={100} y={176} textAnchor="middle" fontFamily="EB Garamond" fontWeight={700} fontSize={44} fill="#5A3C08">{text}</text>
  </svg>
);
export const Parcel: React.FC<{ w?: number; h?: number; label?: React.ReactNode; tone?: string }> = ({ w = 320, h = 200, label, tone = '#C49A66' }) => (
  <div style={{ position: 'relative', width: w, height: h }}>
    <div style={{ position: 'absolute', inset: 0, background: tone, border: `3px solid ${P.ink}`, borderRadius: 8, boxShadow: '0 16px 30px rgba(30,20,8,0.28)' }} />
    <div style={{ position: 'absolute', left: w * 0.47, top: 0, bottom: 0, width: 6, background: '#6B4A2A' }} />
    <div style={{ position: 'absolute', top: h * 0.46, left: 0, right: 0, height: 6, background: '#6B4A2A' }} />
    {label && <div style={{ position: 'absolute', right: 14, bottom: 14 }}>{label}</div>}
  </div>
);
export const Plate: React.FC<{ s?: number }> = ({ s = 80 }) => (
  <svg width={s} height={s} viewBox="0 0 100 100">
    <ellipse cx={50} cy={62} rx={40} ry={16} fill="#F7F2E6" {...S} />
    <ellipse cx={50} cy={60} rx={26} ry={9} fill="none" stroke="#C9BDA6" strokeWidth={2} />
    <path d="M36 54 C 40 40, 60 40, 64 54" fill="#C26A3A" {...S} strokeWidth={2.5} />
    <path d="M44 30 C 42 24, 48 22, 46 16 M 56 30 C 54 24, 60 22, 58 16" stroke={P.sepia} strokeWidth={2} fill="none" opacity={0.7} />
  </svg>
);
export const Cap: React.FC<{ s?: number }> = ({ s = 80 }) => (
  <svg width={s} height={s} viewBox="0 0 100 100">
    <path d="M20 56 C 20 36, 34 26, 50 26 C 66 26, 80 36, 80 56 Z" fill="#5B6B3A" {...S} />
    <path d="M14 56 L 86 56 L 80 66 L 20 66 Z" fill="#3E4A26" {...S} />
    <path d="M46 36 L 50 30 L 54 36 L 50 40 Z" fill={P.yellow} stroke={P.ink} strokeWidth={1.5} />
  </svg>
);
export const Clapper: React.FC<{ s?: number; open?: number }> = ({ s = 80, open = 0 }) => (
  <svg width={s} height={s} viewBox="0 0 100 100">
    <rect x={14} y={40} width={72} height={46} rx={4} fill="#2B2B2B" {...S} />
    <g transform={`rotate(${-22 * open} 14 40)`}>
      <rect x={14} y={26} width={72} height={14} fill="#F4EFE6" {...S} />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${22 + i * 18} 26 L ${30 + i * 18} 40`} stroke={P.ink} strokeWidth={6} />)}
    </g>
  </svg>
);
export const Headphones: React.FC<{ s?: number; c?: string }> = ({ s = 80, c = P.yellow }) => (
  <svg width={s} height={s} viewBox="0 0 100 100">
    <path d="M18 60 C 18 30, 32 16, 50 16 C 68 16, 82 30, 82 60" fill="none" stroke={P.ink} strokeWidth={7} strokeLinecap="round" />
    <rect x={12} y={54} width={20} height={32} rx={8} fill={c} {...S} />
    <rect x={68} y={54} width={20} height={32} rx={8} fill={c} {...S} />
  </svg>
);
