import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { loadBrandFonts } from '../../brand/fonts';
import { Butterfly, F, P, PostalScale, Stack } from './kit';
import { Blender, HairDryer, Heater } from './Icons';

loadBrandFonts();

// Miniaturas (1280×720). Sin portada del libro ni retratos: la báscula de correos, el manuscrito partido y lo que empeñaron.
// A: noche, «82 PESOS». B: papel, «EMPEÑARON HASTA LA BATIDORA».
const Night: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 38% 40%, #2C4654 0%, ${P.night} 60%, #070D10 100%)`, overflow: 'hidden' }}>
    <div style={{ position: 'absolute', left: 120, top: -260, width: 900, height: 900, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,206,120,0.28) 0%, rgba(255,206,120,0) 65%)' }} />
    {children}
  </AbsoluteFill>
);

export const HDLThumbA: React.FC = () => (
  <Night>
    {/* báscula con el manuscrito partido */}
    <div style={{ position: 'absolute', left: 0, top: 0, transform: 'scale(0.82)', transformOrigin: '0 0' }}>
      <PostalScale x={430} y={330} needle={28} size={1} platY={8}>
        <div style={{ position: 'absolute', left: 0, top: 0 }}>
          <Stack w={270} thick={70} x={-150} y={0} shadowK={0.6} />
          <Stack w={270} thick={70} x={150} y={-14} wrapped={1} string={1} shadowK={0.6} />
        </div>
      </PostalScale>
    </div>
    {/* papeleta */}
    <div style={{ position: 'absolute', left: 640, top: 70, width: 600, transform: 'rotate(-4deg)' }}>
      <div style={{ background: '#F7EBCB', padding: '18px 34px 26px', borderRadius: 6, boxShadow: '0 30px 60px rgba(0,0,0,0.55)' }}>
        <div style={{ fontFamily: F.type, fontSize: 30, letterSpacing: 4, color: P.sepia }}>FRANQUEO · 1966</div>
        <div style={{ fontFamily: F.serif, fontWeight: 700, fontSize: 190, lineHeight: 1.0, color: P.ink, letterSpacing: -4 }}>82 <span style={{ fontSize: 120 }}>pesos</span></div>
        <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 44, color: P.red }}>…y no les llegaba</div>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 660, top: 470, width: 600, fontFamily: F.serif, fontWeight: 600, fontSize: 74, lineHeight: 1.02, color: '#F6EFE2', textShadow: '0 6px 24px rgba(0,0,0,0.6)' }}>
      Cien años<br />de soledad
    </div>
    <div style={{ position: 'absolute', left: 663, top: 640, fontFamily: F.serif, fontStyle: 'italic', fontSize: 36, color: P.yellow }}>casi no se publica</div>
    <Butterfly x={1150} y={520} size={110} seed="tA1" flap={0} rot={-18} glow={0.8} />
    <Butterfly x={1020} y={420} size={64} seed="tA2" flap={0} rot={20} glow={0.6} />
  </Night>
);

export const HDLThumbB: React.FC = () => (
  <AbsoluteFill style={{ background: P.paper, overflow: 'hidden' }}>
    <Img src={staticFile('hdl/img/paper.jpg')} style={{ position: 'absolute', inset: 0, width: 1280, height: 720, objectFit: 'cover' }} />
    <div style={{ position: 'absolute', left: 60, top: 60, width: 760 }}>
      <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 40, letterSpacing: 6, color: P.terra, textTransform: 'uppercase' }}>Para publicar este libro</div>
      <div style={{ fontFamily: F.serif, fontWeight: 700, fontSize: 128, lineHeight: 1.04, color: P.ink, marginTop: 12, letterSpacing: -2 }}>empeñaron hasta la <span style={{ background: P.yellow, padding: '0 14px', display: 'inline-block', lineHeight: 0.98, marginTop: 14 }}>batidora</span></div>
      <div style={{ fontFamily: F.serif, fontStyle: 'italic', fontWeight: 600, fontSize: 56, color: P.ink2, marginTop: 26 }}>Cien años de soledad</div>
    </div>
    {/* papeletas de empeño */}
    {[{ el: <Blender s={170} />, l: 'Batidora', x: 900, y: 120, r: 6 }, { el: <HairDryer s={130} />, l: 'Secador', x: 1010, y: 410, r: -7 }, { el: <Heater s={120} />, l: 'Calentador', x: 830, y: 450, r: 4 }].map((t, i) => (
      <div key={i} style={{ position: 'absolute', left: t.x, top: t.y, transform: `rotate(${t.r}deg)`, background: '#F7EBCB', border: `3px solid ${P.sepia}`, borderRadius: 8, padding: '14px 18px', boxShadow: '0 18px 36px rgba(40,28,10,0.3)', textAlign: 'center' }}>
        <div style={{ fontFamily: F.type, fontSize: 18, color: P.sepia, letterSpacing: 2 }}>EMPEÑADO</div>
        {t.el}
        <div style={{ fontFamily: F.serif, fontWeight: 600, fontSize: 30, color: P.ink }}>{t.l}</div>
      </div>
    ))}
    <Butterfly x={828} y={74} size={84} seed="tB1" flap={0} rot={-16} />
    <Butterfly x={1210} y={330} size={60} seed="tB2" flap={0} rot={24} />
  </AbsoluteFill>
);
