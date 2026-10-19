import React from 'react';
import { AbsoluteFill, Img } from 'remotion';
import { CoverArt, coverSrc } from './fx';
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

// A · «10 historii grozy… naprawdę przerażają»: abanico de portadas reales bajo la linterna.
export const T10ThumbA: React.FC = () => {
  // de atrás hacia delante; la última (El exorcista) queda encima
  const pick = ['p03_salem', 'p06_drakula', 'p02_manitou', 'p04_darda', 'p01_malerman'];
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
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 96, lineHeight: 0.92, color: BONE, letterSpacing: -4, textShadow: '0 6px 30px rgba(0,0,0,0.8)' }}>NAPRAWDĘ</div>
        <div style={{ display: 'inline-block', marginTop: 14, padding: '6px 22px', background: RED, fontFamily: font.sans, fontWeight: 700, fontSize: 76, color: '#fff', letterSpacing: -2, borderRadius: 10, transform: 'rotate(-2deg)' }}>PRZERAŻAJĄ</div>
      </div>
      <div style={{ position: 'absolute', left: 44, top: 40, display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', borderRadius: 999, background: color.yellow, fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.ink }}>
        HISTORIE GROZY
      </div>
    </Dark>
  );
};

// B · «Nie gaś światła»: una bombilla que se apaga y unos ojos que miran desde la oscuridad.
export const T10ThumbB: React.FC = () => (
  <Dark beam={[330, 300]}>
    <div style={{ position: 'absolute', left: 130, top: 0, width: 420, height: 720 }}>
      <div style={{ position: 'absolute', left: 207, top: 0, width: 6, height: 190, background: '#2a2a2e' }} />
      <div style={{ position: 'absolute', left: 60, top: 150, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,214,140,0.45), rgba(255,214,140,0) 65%)' }} />
      <svg width={180} height={240} viewBox="0 0 24 32" style={{ position: 'absolute', left: 120, top: 180 }}>
        <path d="M12 2a9 9 0 0 0-5 16.5c1 .8 1.6 2 1.6 3.3V24h6.8v-2.2c0-1.3.6-2.5 1.6-3.3A9 9 0 0 0 12 2z" fill="rgba(255,230,170,0.9)" stroke="#f2c94c" strokeWidth={0.8} />
        <path d="M9 18c0-3 1.5-4 3-6 1.5 2 3 3 3 6" stroke="#b07a18" strokeWidth={0.7} fill="none" />
        <rect x="8.4" y="24" width="7.2" height="5" rx="1" fill="#6b6b70" />
      </svg>
      {[[40, 520], [300, 560]].map(([x, y], k) => (
        <div key={k} style={{ position: 'absolute', left: x, top: y, display: 'flex', gap: 22 }}>
          {[0, 1].map((e) => <div key={e} style={{ width: 34, height: 16, borderRadius: '50%', background: '#F4F4F4', boxShadow: '0 0 22px rgba(255,255,255,0.85)' }} />)}
        </div>
      ))}
    </div>
    <div style={{ position: 'absolute', right: 56, top: 120, width: 640, textAlign: 'right' }}>
      <div style={{ display: 'inline-block', padding: '8px 20px', borderRadius: 10, background: color.yellow, fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.ink }}>10 HISTORII GROZY</div>
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 118, lineHeight: 0.92, color: BONE, letterSpacing: -4, marginTop: 26, textShadow: '0 6px 30px rgba(0,0,0,0.8)' }}>NIE<br />GAŚ</div>
      <div style={{ display: 'inline-block', marginTop: 16, padding: '6px 22px', background: RED, fontFamily: font.sans, fontWeight: 700, fontSize: 84, color: '#fff', letterSpacing: -2, borderRadius: 10, transform: 'rotate(-2deg)' }}>ŚWIATŁA</div>
    </div>
  </Dark>
);


// C · como A, pero con las portadas censuradas (la intriga del principio del vídeo).
export const T10ThumbC: React.FC = () => {
  const pick = ['p03_salem', 'p06_drakula', 'p02_manitou', 'p04_darda', 'p01_malerman'];
  const pos = [[20, 250, -16], [420, 240, 14], [110, 185, -7], [320, 175, 7], [170, 210, 0]];
  return (
    <Dark beam={[360, 380]}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 720, height: 720 }}>
        {pick.map((name, i) => (
          <div key={name} style={{ position: 'absolute', left: pos[i][0], top: pos[i][1], transform: `rotate(${pos[i][2]}deg)`, zIndex: i, borderRadius: 10, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.75)' }}>
            <CoverArt name={name} size={i === 4 ? 380 : 290} reveal={i === 4 ? 0.18 : 0} light={i === 4 ? 1 : 0.8} />
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', right: 70, top: 40, fontFamily: font.sans, fontWeight: 700, fontSize: 300, lineHeight: 0.8, letterSpacing: -18, color: 'transparent', WebkitTextStroke: '5px rgba(255,202,5,0.9)' }}>10</div>
      <div style={{ position: 'absolute', right: 50, top: 330, width: 680, textAlign: 'right' }}>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 96, lineHeight: 0.92, color: BONE, letterSpacing: -4, textShadow: '0 6px 30px rgba(0,0,0,0.8)' }}>NAPRAWDĘ</div>
        <div style={{ display: 'inline-block', marginTop: 14, padding: '6px 22px', background: RED, fontFamily: font.sans, fontWeight: 700, fontSize: 76, color: '#fff', letterSpacing: -2, borderRadius: 10, transform: 'rotate(-2deg)' }}>PRZERAŻAJĄ</div>
      </div>
      <div style={{ position: 'absolute', left: 44, top: 40, display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', borderRadius: 999, background: color.yellow, fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.ink }}>
        HISTORIE GROZY
      </div>
    </Dark>
  );
};
