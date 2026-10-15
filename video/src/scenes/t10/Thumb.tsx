import React from 'react';
import { AbsoluteFill, Img } from 'remotion';
import { coverSrc } from './fx';
import { BONE, RED, color, font, Grain } from './kit';

// Miniaturas 1280×720. A lleva las portadas reales de los audiolibros; B, solo los auriculares.
const Dark: React.FC<{ children: React.ReactNode; beam?: [number, number] }> = ({ children, beam = [420, 380] }) => (
  <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 40% 50%, #1A1B1F 0%, #0B0B0D 60%, #040405 100%)', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', left: beam[0] - 520, top: beam[1] - 460, width: 1040, height: 920, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,214,130,0.30) 0%, rgba(255,214,130,0.08) 45%, rgba(0,0,0,0) 70%)' }} />
    <div style={{ position: 'absolute', right: -300, bottom: -380, width: 900, height: 900, borderRadius: '50%', background: 'radial-gradient(circle, rgba(193,18,31,0.35) 0%, rgba(193,18,31,0) 62%)' }} />
    {children}
    <Grain seed={3} opacity={0.08} />
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)' }} />
  </AbsoluteFill>
);

// A · «10 libros que dan miedo de verdad»: abanico de cubiertas bajo la linterna.
export const T10ThumbA: React.FC = () => {
  // de atrás hacia delante; la última (El exorcista) queda encima
  const pick = ['03_salem', '06_dracula_original', '02_nuestra_parte', '04_carcoma', '01_exorcista'];
  const pos = [[20, 250, -16], [420, 240, 14], [110, 185, -7], [320, 175, 7], [170, 210, 0]];
  return (
    <Dark beam={[360, 380]}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 720, height: 720 }}>
        {pick.map((name, i) => (
          <div key={name} style={{ position: 'absolute', left: pos[i][0], top: pos[i][1], transform: `rotate(${pos[i][2]}deg)`, zIndex: i }}>
            <Img src={coverSrc(name)} style={{ width: i === 4 ? 380 : 290, height: i === 4 ? 380 : 290, borderRadius: 10, display: 'block', boxShadow: '0 24px 60px rgba(0,0,0,0.75)', filter: i === 4 ? undefined : 'brightness(0.78)' }} />
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', right: 70, top: 40, fontFamily: font.sans, fontWeight: 700, fontSize: 300, lineHeight: 0.8, letterSpacing: -18, color: 'transparent', WebkitTextStroke: '5px rgba(255,202,5,0.9)' }}>10</div>
      <div style={{ position: 'absolute', right: 50, top: 330, width: 680, textAlign: 'right' }}>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 96, lineHeight: 0.92, color: BONE, letterSpacing: -4, textShadow: '0 6px 30px rgba(0,0,0,0.8)' }}>DAN MIEDO</div>
        <div style={{ display: 'inline-block', marginTop: 14, padding: '6px 22px', background: RED, fontFamily: font.sans, fontWeight: 700, fontSize: 76, color: '#fff', letterSpacing: -2, borderRadius: 10, transform: 'rotate(-2deg)' }}>DE VERDAD</div>
      </div>
      <div style={{ position: 'absolute', left: 44, top: 40, display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', borderRadius: 999, background: color.yellow, fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.ink }}>
        <svg width={34} height={34} viewBox="0 0 24 24"><path d="M4 15v-3a8 8 0 0 1 16 0v3" stroke={color.ink} strokeWidth={2.4} fill="none" /><rect x="3" y="14" width="4.5" height="7" rx="1.8" fill={color.ink} /><rect x="16.5" y="14" width="4.5" height="7" rx="1.8" fill={color.ink} /></svg>
        EN AUDIOLIBRO
      </div>
    </Dark>
  );
};

// B · «No los escuches de noche»: unos auriculares que brillan en la oscuridad y unos ojos abiertos.
export const T10ThumbB: React.FC = () => (
  <Dark beam={[330, 360]}>
    <div style={{ position: 'absolute', left: 110, top: 150, width: 440, height: 440 }}>
      <div style={{ position: 'absolute', inset: -80, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,202,5,0.35), rgba(255,202,5,0) 65%)' }} />
      <svg width={440} height={440} viewBox="0 0 24 24" style={{ position: 'absolute', inset: 0 }}>
        <path d="M4 15v-3a8 8 0 0 1 16 0v3" stroke={color.yellow} strokeWidth={1.6} fill="none" strokeLinecap="round" />
        <rect x="2.6" y="13.4" width="5" height="7.6" rx="2" fill={color.yellow} /><rect x="16.4" y="13.4" width="5" height="7.6" rx="2" fill={color.yellow} />
      </svg>
      <div style={{ position: 'absolute', left: 168, top: 230, width: 28, height: 16, borderRadius: '50%', background: '#F4F4F4', boxShadow: '0 0 20px rgba(255,255,255,0.8)' }} />
      <div style={{ position: 'absolute', left: 246, top: 230, width: 28, height: 16, borderRadius: '50%', background: '#F4F4F4', boxShadow: '0 0 20px rgba(255,255,255,0.8)' }} />
    </div>
    <div style={{ position: 'absolute', right: 56, top: 120, width: 640, textAlign: 'right' }}>
      <div style={{ display: 'inline-block', padding: '8px 20px', borderRadius: 10, background: color.yellow, fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.ink }}>10 LIBROS DE TERROR</div>
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 112, lineHeight: 0.92, color: BONE, letterSpacing: -4, marginTop: 26, textShadow: '0 6px 30px rgba(0,0,0,0.8)' }}>NO LOS<br />ESCUCHES</div>
      <div style={{ display: 'inline-block', marginTop: 16, padding: '6px 22px', background: RED, fontFamily: font.sans, fontWeight: 700, fontSize: 84, color: '#fff', letterSpacing: -2, borderRadius: 10, transform: 'rotate(-2deg)' }}>DE NOCHE</div>
    </div>
  </Dark>
);
