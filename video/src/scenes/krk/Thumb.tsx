import React from 'react';
import { AbsoluteFill, Img, random, staticFile } from 'remotion';
import { LogoIcon } from '../../components/Logo';
import { BOOKS, Book3D, color, font, KR, SkStage } from './kit';

// Miniaturas de YouTube (1280×720) del episodio de Kierkegaard. A: estilo claro del canal. B: noche con la biblioteca 3D del vídeo.
const Brand: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    <LogoIcon size={58} />
    <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 28, letterSpacing: 3, textTransform: 'uppercase', color: dark ? 'rgba(255,255,255,0.8)' : color.ink2 }}>Guía para empezar</span>
  </div>
);

const fan = ['pureza', 'diario', 'temor', 'enfermedad'];

export const KRKThumbA: React.FC = () => (
  <AbsoluteFill>
    <SkStage still>
      <div style={{ position: 'absolute', left: 64, top: 70 }}><Brand /></div>
      <div style={{ position: 'absolute', left: 60, top: 190, fontFamily: font.sans, fontWeight: 700, fontSize: 92, lineHeight: 0.98, letterSpacing: -5, color: color.ink }}>
        KIERKEGAARD
      </div>
      <div style={{ position: 'absolute', left: 56, top: 330 }}>
        <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 70, letterSpacing: -3, color: color.ink, background: color.yellow, padding: '0 16px', borderRadius: 10, boxDecorationBreak: 'clone', lineHeight: 1.16 }}>¿Por dónde<br />empiezo?</span>
      </div>
      {/* abanico de libros */}
      <div style={{ position: 'absolute', left: 596, top: 190, width: 620, height: 520, transform: 'scale(0.88)', transformOrigin: '50% 50%' }}>
        <div style={{ position: 'absolute', left: 60, top: 40, width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,202,5,0.35), rgba(255,202,5,0) 65%)' }} />
        {fan.map((k, i) => {
          const c = i - 1.5;
          const mid = i === 2;
          const x = 70 + i * 120;
          return (
            <div key={k} style={{ position: 'absolute', left: x, top: mid ? 30 : 70 + Math.abs(c) * 26, transform: `rotate(${c * 10}deg) scale(${mid ? 1.12 : 0.94})`, transformOrigin: '50% 100%', zIndex: mid ? 6 : 5 - Math.abs(Math.round(c)) }}>
              <Book3D b={BOOKS[k]} w={210} h={315} d={34} ry={c * -8} rx={2} floorShadow={false} />
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', right: 46, top: 560, transform: 'rotate(-5deg)', zIndex: 10, fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: '#fff', background: KR, padding: '10px 24px', borderRadius: 14, boxShadow: '0 16px 30px rgba(47,111,98,0.35)' }}>4 puertas</div>
    </SkStage>
  </AbsoluteFill>
);

export const KRKThumbB: React.FC = () => (
  <AbsoluteFill style={{ background: '#0B0C0E' }}>
    <Img src={staticFile('krk/3d/biblioteca.jpg')} style={{ position: 'absolute', left: -60, top: -40, width: 1400, height: 788, objectFit: 'cover' }} />
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(8,8,10,0.94) 0%, rgba(8,8,10,0.78) 46%, rgba(8,8,10,0.2) 75%, rgba(8,8,10,0.35) 100%)' }} />
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)' }} />
    <div style={{ position: 'absolute', left: 64, top: 64 }}><Brand dark /></div>
    <div style={{ position: 'absolute', left: 60, top: 150, fontFamily: font.sans, fontWeight: 700, fontSize: 94, lineHeight: 1.08, letterSpacing: -4, color: '#fff', textShadow: '0 10px 40px rgba(0,0,0,0.6)' }}>
      ¿Por dónde<br />empiezo con<br /><span style={{ color: color.ink, background: color.yellow, padding: '0 14px', borderRadius: 10, textShadow: 'none' }}>Kierkegaard?</span>
    </div>
    <div style={{ position: 'absolute', left: 880, top: 150 }}>
      <div style={{ position: 'absolute', left: -120, top: -60, width: 540, height: 580, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,214,120,0.55), rgba(255,214,120,0) 62%)' }} />
      <Book3D b={BOOKS.temor} w={290} h={435} d={40} ry={-22} rx={3} />
    </div>
    <div style={{ position: 'absolute', left: 64, bottom: 54, fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: '#fff', background: KR, padding: '8px 22px', borderRadius: 12 }}>4 puertas de entrada</div>
  </AbsoluteFill>
);
