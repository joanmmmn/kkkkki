import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { RealPhone } from '../../components/RealPhone';
import { APP_RATIO, color, font, MpStage, PKey, PlatTile, shadow } from './kit';

const StillPhone: React.FC<{ src: string; w: number; rx?: number; ry?: number; rz?: number; style?: React.CSSProperties }> = ({ src, w, rx = 0, ry = 0, rz = 0, style }) => (
  <div style={{ position: 'absolute', ...style }}>
    <RealPhone w={w} ratio={APP_RATIO} rotX={rx} rotY={ry} rotZ={rz} screenBg="#000">
      <Img src={staticFile(src)} style={{ width: w, height: w * APP_RATIO, display: 'block' }} />
    </RealPhone>
  </div>
);

const Hi: React.FC<{ children: React.ReactNode; size: number }> = ({ children, size }) => (
  <div style={{ position: 'relative', display: 'inline-block', alignSelf: 'flex-start' }}>
    <div style={{ position: 'absolute', left: -10, right: -10, bottom: size * 0.09, height: size * 0.46, background: color.yellow, borderRadius: 12, transform: 'skewX(-8deg)' }} />
    <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 700, fontSize: size, letterSpacing: -size * 0.04, lineHeight: 0.96, color: color.ink }}>{children}</div>
  </div>
);

// Miniatura A: «¿CUÁL ELEGIR?» con tres móviles en abanico (apps reales) y Spotify «Nuevo».
export const MPThumbA: React.FC = () => (
  <MpStage still>
    <AbsoluteFill style={{ padding: '96px 0 0 64px' }}>
      <div style={{ display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 12, padding: '10px 20px', borderRadius: 999, background: color.ink, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 30 }}>
        <span style={{ color: color.yellow }}>11 APPS</span> DE AUDIOLIBROS
      </div>
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 132, letterSpacing: -5.5, lineHeight: 0.96, color: color.ink, marginTop: 28 }}>¿CUÁL</div>
      <Hi size={132}>ELEGIR?</Hi>
      <div style={{ display: 'flex', gap: 14, marginTop: 34 }}>
        {(['audible', 'storytel', 'podimo', 'nextory', 'bookbeat'] as PKey[]).map((k) => <PlatTile key={k} k={k} size={74} />)}
      </div>
    </AbsoluteFill>
    <StillPhone src="str/rec/16_lectura/first.jpg" w={230} rx={4} ry={-20} rz={-8} style={{ left: 720, top: 120 }} />
    <StillPhone src="pdr/rec/04_inicio/last.jpg" w={230} rx={4} ry={-20} rz={8} style={{ left: 1010, top: 130 }} />
    <StillPhone src="aud/rec/05_dracula/last.jpg" w={250} rx={6} ry={-18} rz={0} style={{ left: 860, top: 70 }} />
    <div style={{ position: 'absolute', left: 1090, top: 470, transform: 'rotate(8deg)' }}>
      <PlatTile k="spotify" size={120} />
      <div style={{ position: 'absolute', right: -26, top: -18, padding: '6px 14px', borderRadius: 999, background: color.yellow, fontFamily: font.sans, fontWeight: 700, fontSize: 24, color: color.ink, boxShadow: shadow.float }}>Nuevo</div>
    </div>
  </MpStage>
);

// Miniatura B: las once fichas en rejilla, inclinadas, y una banda negra «LAS MEJORES APPS DE AUDIOLIBROS 2026».
export const MPThumbB: React.FC = () => {
  const all: PKey[] = ['audible', 'storytel', 'podimo', 'nextory', 'bookbeat', 'spotify', 'audiobooks', 'elevenreader', 'ebiblio', 'librivox', 'elt', 'audible', 'storytel', 'podimo', 'spotify', 'nextory', 'bookbeat', 'audiobooks'];
  return (
    <MpStage still>
      <div style={{ position: 'absolute', left: -60, top: -80, width: 1500, transform: 'rotate(-8deg)', display: 'grid', gridTemplateColumns: 'repeat(6, 190px)', gap: 30 }}>
        {[...all, ...all].slice(0, 30).map((k, i) => <PlatTile key={i} k={k} size={190} style={{ opacity: 0.95 }} />)}
      </div>
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 40%, rgba(255,255,255,0.6) 100%)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 360, padding: '28px 60px 34px', background: color.ink, transform: 'rotate(-3deg)', boxShadow: '0 40px 80px rgba(0,0,0,0.35)' }}>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 104, letterSpacing: -4, lineHeight: 1, color: '#fff', textAlign: 'center' }}>
          LAS MEJORES APPS DE <span style={{ color: color.yellow }}>AUDIOLIBROS</span>
        </div>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 10 }}>Comparativa 2026 · precios, trucos y cuál elegir</div>
      </div>
    </MpStage>
  );
};
