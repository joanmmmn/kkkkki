import React from 'react';
import { AbsoluteFill, Img, staticFile, useVideoConfig } from 'remotion';
import { color, font } from '../../brand/tokens';
import { loadBrandFonts } from '../../brand/fonts';
import { LogoIcon } from '../../components/Logo';
import { EltPlate } from './Cover';

loadBrandFonts();

// Variantes para el test A/B de miniaturas de YouTube (la A es la aprobada, en Cover.tsx).
//   B · «¿ESTAFA?»: solo la pregunta y, debajo, el logo de El Libro Total bajo una lupa que lo amplía de verdad.
//   C · «Mismo libro: 18,99 € → 0 €»: el contraste de precio con la misma portada a cada lado.
// Se diseñan a 1280×720 y se escalan a cualquier tamaño (ELTCoverB / ELTCoverC y sus versiones 1080).

const Brand: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: color.ink, borderRadius: 999, padding: '8px 20px 8px 12px', boxShadow: '0 12px 28px rgba(0,0,0,0.3)' }}>
    <LogoIcon size={size * 1.45} />
    <span style={{ color: '#fff', fontWeight: 700, fontSize: size }}>SonorBooks</span>
  </div>
);

// ---------- B · ¿ESTAFA? ----------
const PLATE = { left: 96, top: 292, w: 930, rotate: -2.5 };
// cx/cy: dónde está la lupa; fx/fy: el punto de la escena que se ve ampliado en su centro («TOTAL»).
// Caja de la palabra «TOTAL» dentro de la placa (coordenadas de la placa sin girar).
const TOTAL = { x: 488, y: 166, w: 296, h: 90 };
const PRISMA = { x: 350, y: 252, w: 246, h: 66 };
const LENS = { cx: 850, cy: 494, r: 168, zoom: 1.28, fx: 744, fy: 497 };

// Fuera de la lupa se tapa la palabra «TOTAL» original (dentro se ve ampliada); dentro, «PRISMA», para que no se duplique.
const EstafaScene: React.FC<{ hideTotal?: boolean; hidePrisma?: boolean }> = ({ hideTotal, hidePrisma }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 1280, height: 720, background: '#0a0c11', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', left: -140, top: -250, width: 1800, transform: 'rotate(-9deg)', opacity: 0.6, filter: 'saturate(1.15)' }}>
      <Img src={staticFile('elt/img/covers_wall.jpg')} style={{ width: '100%', display: 'block' }} />
    </div>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(8,10,15,0.94) 0%, rgba(8,10,15,0.7) 40%, rgba(8,10,15,0.55) 100%)' }} />
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 52% 72%, rgba(229,72,77,0.5), rgba(229,72,77,0) 55%)' }} />
    <div style={{ position: 'absolute', left: PLATE.left, top: PLATE.top }}>
      <EltPlate w={PLATE.w} rotate={PLATE.rotate}>
        {hideTotal && <div style={{ position: 'absolute', left: TOTAL.x, top: TOTAL.y, width: TOTAL.w, height: TOTAL.h, background: 'linear-gradient(160deg, #101d2f, #0e1a2b)' }} />}
        {hidePrisma && <div style={{ position: 'absolute', left: PRISMA.x, top: PRISMA.y, width: PRISMA.w, height: PRISMA.h, background: '#0e1a2b' }} />}
      </EltPlate>
    </div>
  </div>
);

// Lupa: dentro del cristal se vuelve a pintar la escena ampliada alrededor de fx/fy y centrada en la lupa.
const Magnifier: React.FC = () => {
  const { cx, cy, r, zoom, fx, fy } = LENS;
  const ring = r * 0.13;
  return (
    <>
      {/* Mango */}
      <div style={{ position: 'absolute', left: cx + r * 0.62, top: cy + r * 0.62, width: r * 0.34, height: r * 1.25, borderRadius: r * 0.12, background: `linear-gradient(90deg, #2c2c2c, ${color.ink} 55%, #000)`, border: `6px solid ${color.yellow}`, transform: 'rotate(-45deg)', transformOrigin: 'top center', boxShadow: '0 20px 40px rgba(0,0,0,0.55)' }} />
      {/* Cristal con la escena ampliada */}
      <div style={{ position: 'absolute', left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: '50%', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }}>
        <div style={{ position: 'absolute', left: -(cx - r), top: -(cy - r), width: 1280, height: 720, transform: `translate(${cx - fx}px, ${cy - fy}px) scale(${zoom})`, transformOrigin: `${fx}px ${fy}px` }}>
          <EstafaScene hidePrisma />
        </div>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 32% 26%, rgba(255,255,255,0.42), rgba(255,255,255,0.06) 38%, rgba(255,255,255,0) 60%), radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.35) 100%)' }} />
      </div>
      {/* Aro */}
      <div style={{ position: 'absolute', left: cx - r - ring, top: cy - r - ring, width: (r + ring) * 2, height: (r + ring) * 2, borderRadius: '50%', border: `${ring}px solid ${color.yellow}`, boxShadow: 'inset 0 0 0 3px rgba(0,0,0,0.25), 0 0 0 3px rgba(0,0,0,0.35)' }} />
    </>
  );
};

const Estafa: React.FC = () => (
  <div style={{ position: 'absolute', inset: 0, fontFamily: font.sans, overflow: 'hidden' }}>
    <EstafaScene hideTotal />
    <Magnifier />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 6, display: 'flex', justifyContent: 'center' }}>
      <div style={{ fontWeight: 700, fontSize: 276, letterSpacing: -11, lineHeight: 1, color: color.yellow, textShadow: '0 10px 0 #000, 0 26px 60px rgba(0,0,0,0.75)', whiteSpace: 'nowrap', transform: 'rotate(-2deg)' }}>¿ESTAFA?</div>
    </div>
  </div>
);

// ---------- C · Mismo libro ----------
const Cyc: React.FC<{ w: number; rotate: number; dim?: boolean }> = ({ w, rotate, dim }) => (
  <div style={{ width: w, height: (w * 460) / 366, borderRadius: 14, overflow: 'hidden', border: '6px solid #fff', transform: `rotate(${rotate}deg)`, boxShadow: dim ? '0 24px 50px rgba(0,0,0,0.6)' : '0 30px 60px rgba(90,60,0,0.45), 0 0 0 10px rgba(255,255,255,0.35)', filter: dim ? 'grayscale(0.7) brightness(0.72)' : 'saturate(1.1) contrast(1.04)' }}>
    <Img src={staticFile(dim ? 'elt/img/cyc_cover_hd_plain.png' : 'elt/img/cyc_cover_hd.png')} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
  </div>
);

const Precio: React.FC = () => (
  <div style={{ position: 'absolute', inset: 0, fontFamily: font.sans, overflow: 'hidden', background: `radial-gradient(ellipse at 72% 45%, #FFE066 0%, ${color.yellow} 50%, #F2B800 100%)` }}>
    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(16,16,16,0.10) 2px, transparent 2.4px)', backgroundSize: '28px 28px', opacity: 0.6 }} />
    {/* Mitad izquierda: lo que cuesta en otra tienda (columna centrada) */}
    <div style={{ position: 'absolute', inset: 0, background: '#131313', clipPath: 'polygon(0 0, 610px 0, 540px 720px, 0 720px)' }} />
    <div style={{ position: 'absolute', left: 0, top: 0, width: 560, height: 720, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ marginTop: 30, fontWeight: 700, fontSize: 70, letterSpacing: -2, color: '#fff', lineHeight: 1 }}>MISMO LIBRO</div>
      <div style={{ marginTop: 34 }}><Cyc w={232} rotate={-5} dim /></div>
      <div style={{ position: 'relative', marginTop: 26, fontWeight: 700, fontSize: 124, letterSpacing: -5, lineHeight: 1, color: '#d9d9d9', whiteSpace: 'nowrap' }}>
        18,99{' '}€
        <div style={{ position: 'absolute', left: -14, right: -14, top: '48%', height: 15, borderRadius: 8, background: color.red, transform: 'rotate(-8deg)', boxShadow: '0 4px 10px rgba(0,0,0,0.45)' }} />
      </div>
      <div style={{ fontSize: 30, fontWeight: 500, color: 'rgba(255,255,255,0.62)', marginTop: 6 }}>en Audible</div>
    </div>
    {/* Flecha en la costura */}
    <div style={{ position: 'absolute', left: 512, top: 302, width: 116, height: 116, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 18px 40px rgba(0,0,0,0.4)', border: `6px solid ${color.ink}` }}>
      <svg width="60" height="60" viewBox="0 0 24 24"><path d="M4 12h14m-6-7 7 7-7 7" stroke={color.ink} strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
    {/* Mitad derecha: El Libro Total */}
    <div style={{ position: 'absolute', left: 730, top: 30 }}><EltPlate w={452} rotate={-3} /></div>
    <div style={{ position: 'absolute', left: 650, top: 256 }}><Cyc w={238} rotate={5} /></div>
    <div style={{ position: 'absolute', right: 26, top: 240, fontWeight: 700, fontSize: 276, letterSpacing: -12, lineHeight: 1, color: color.ink, textShadow: '0 10px 0 rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>0{' '}€</div>
    <div style={{ position: 'absolute', left: 952, top: 540, display: 'inline-block', background: color.ink, color: '#fff', borderRadius: 18, padding: '8px 24px 13px', fontWeight: 700, fontSize: 52, letterSpacing: -1, transform: 'rotate(-3deg)', boxShadow: '0 16px 30px rgba(0,0,0,0.3)', whiteSpace: 'nowrap' }}>y es legal</div>
    <div style={{ position: 'absolute', left: 676, bottom: 26 }}><Brand size={22} /></div>
  </div>
);

export const CoverTest: React.FC<{ design?: 'estafa' | 'precio' }> = ({ design = 'estafa' }) => {
  const { width, height } = useVideoConfig();
  const k = Math.min(width / 1280, height / 720);
  return (
    <AbsoluteFill style={{ background: design === 'estafa' ? '#0a0c11' : color.yellow, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: (width - 1280 * k) / 2, top: (height - 720 * k) / 2, width: 1280, height: 720, transform: `scale(${k})`, transformOrigin: '0 0' }}>
        {design === 'estafa' ? <Estafa /> : <Precio />}
      </div>
    </AbsoluteFill>
  );
};
