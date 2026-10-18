import React from 'react';
import { AbsoluteFill, Img } from 'remotion';
import { CoverArt, coverSrc } from './fx';
import { BONE, RED, color, font, Grain } from './kit';
import { Dragon, OpenBook } from './Intro';

// Miniaturas 1280×720 de «Los 10 mejores · Fantasía». Ninguna dice «audiolibro» (se vende como historias).
const Dark: React.FC<{ children: React.ReactNode; beam?: [number, number] }> = ({ children, beam = [420, 380] }) => (
  <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 40% 50%, #171a33 0%, #0a0b1a 60%, #04040a 100%)', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', left: beam[0] - 520, top: beam[1] - 460, width: 1040, height: 920, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,214,130,0.30) 0%, rgba(255,214,130,0.08) 45%, rgba(0,0,0,0) 70%)' }} />
    <div style={{ position: 'absolute', right: -260, top: -360, width: 980, height: 900, borderRadius: '50%', background: 'radial-gradient(circle, rgba(120,96,255,0.30) 0%, rgba(120,96,255,0) 62%)' }} />
    <div style={{ position: 'absolute', right: -300, bottom: -420, width: 900, height: 900, borderRadius: '50%', background: 'radial-gradient(circle, rgba(226,85,44,0.28) 0%, rgba(226,85,44,0) 62%)' }} />
    {children}
    <Grain seed={3} opacity={0.08} />
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)' }} />
  </AbsoluteFill>
);

const PICK = ['08_harry', '04_idhun', '03_alas', '07_hobbit', '01_comunidad'];
const POS = [[20, 250, -16], [420, 240, 14], [110, 185, -7], [320, 175, 7], [170, 210, 0]];

const Words: React.FC<{ a: string; b: string }> = ({ a, b }) => (
  <>
    <div style={{ position: 'absolute', right: 70, top: 40, fontFamily: font.sans, fontWeight: 700, fontSize: 300, lineHeight: 0.8, letterSpacing: -18, color: 'transparent', WebkitTextStroke: '5px rgba(255,202,5,0.9)' }}>10</div>
    <div style={{ position: 'absolute', right: 50, top: 330, width: 700, textAlign: 'right' }}>
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 96, lineHeight: 0.92, color: BONE, letterSpacing: -4, textShadow: '0 6px 30px rgba(0,0,0,0.8)' }}>{a}</div>
      <div style={{ display: 'inline-block', marginTop: 14, padding: '6px 22px', background: RED, fontFamily: font.sans, fontWeight: 700, fontSize: 84, color: '#fff', letterSpacing: -2, borderRadius: 10, transform: 'rotate(-2deg)' }}>{b}</div>
    </div>
    <div style={{ position: 'absolute', left: 44, top: 40, display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', borderRadius: 999, background: color.yellow, fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.ink }}>
      HISTORIAS DE FANTASÍA
    </div>
  </>
);

// A · «No querrás salir»: abanico de portadas reales bajo una luz dorada (El Señor de los Anillos, encima).
export const T10ThumbA: React.FC = () => (
  <Dark beam={[360, 380]}>
    <div style={{ position: 'absolute', left: 0, top: 0, width: 720, height: 720 }}>
      {PICK.map((name, i) => (
        <div key={name} style={{ position: 'absolute', left: POS[i][0], top: POS[i][1], transform: `rotate(${POS[i][2]}deg)`, zIndex: i }}>
          <Img src={coverSrc(name)} style={{ width: i === 4 ? 380 : 290, height: i === 4 ? 380 : 290, borderRadius: 10, display: 'block', boxShadow: '0 24px 60px rgba(0,0,0,0.75)', filter: i === 4 ? undefined : 'brightness(0.78)' }} />
        </div>
      ))}
    </div>
    <Words a="NO QUERRÁS" b="SALIR" />
  </Dark>
);

// B · «No querrás volver»: un libro abierto que brilla, con un mundo que sale de sus páginas y un dragón que lo cruza.
export const T10ThumbB: React.FC = () => (
  <Dark beam={[330, 330]}>
    <div style={{ position: 'absolute', left: 0, top: 0, width: 700, height: 720 }}>
      {/* luz que sube de las páginas */}
      <div style={{ position: 'absolute', left: 120, top: 40, width: 420, height: 560, background: 'linear-gradient(0deg, rgba(255,226,160,0.55), rgba(255,226,160,0) 85%)', clipPath: 'polygon(30% 100%, 70% 100%, 100% 0, 0 0)' }} />
      {/* montañas y castillo en silueta */}
      <svg width={560} height={300} viewBox="0 0 560 300" style={{ position: 'absolute', left: 50, top: 210 }}>
        <path d="M0 300 L90 150 L150 220 L240 90 L320 200 L390 120 L470 210 L560 140 L560 300 Z" fill="#1d1f3d" opacity={0.85} />
        <path d="M220 300 V170 h20 v-30 h14 v30 h24 v-60 h16 v-26 l10 -18 l10 18 v26 h16 v60 h24 v-30 h14 v30 h20 V300 Z" fill="#0d0e22" />
        {[[270, 190], [300, 150], [330, 190]].map(([x, y], k) => <rect key={k} x={x} y={y} width={8} height={12} rx={2} fill="#FFD27A" />)}
      </svg>
      <div style={{ position: 'absolute', left: 30, top: 470 }}><OpenBook glow={1} w={600} /></div>
      <div style={{ position: 'absolute', left: 300, top: 70, transform: 'rotate(-8deg)' }}><Dragon s={0.85} flap={0.6} c="#06071a" /></div>
      {[[90, 120], [520, 90], [600, 260], [60, 330], [470, 30]].map(([x, y], k) => <div key={k} style={{ position: 'absolute', left: x, top: y, width: 6, height: 6, borderRadius: 3, background: '#FFE7A8', boxShadow: '0 0 14px #FFD27A' }} />)}
    </div>
    <Words a="NO QUERRÁS" b="VOLVER" />
  </Dark>
);

// C · como A, pero con las portadas censuradas (la intriga del principio del vídeo), para «Probar y comparar».
export const T10ThumbC: React.FC = () => (
  <Dark beam={[360, 380]}>
    <div style={{ position: 'absolute', left: 0, top: 0, width: 720, height: 720 }}>
      {PICK.map((name, i) => (
        <div key={name} style={{ position: 'absolute', left: POS[i][0], top: POS[i][1], transform: `rotate(${POS[i][2]}deg)`, zIndex: i, borderRadius: 10, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.75)' }}>
          <CoverArt name={name} size={i === 4 ? 380 : 290} reveal={i === 4 ? 0.18 : 0} light={i === 4 ? 1 : 0.8} />
        </div>
      ))}
    </div>
    <Words a="NO QUERRÁS" b="SALIR" />
  </Dark>
);
