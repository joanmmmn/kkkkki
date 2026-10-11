import React from 'react';
import { AbsoluteFill, Img, staticFile, useVideoConfig } from 'remotion';
import { color, font } from '../../brand/tokens';
import { loadBrandFonts } from '../../brand/fonts';
import { LogoIcon } from '../../components/Logo';
import { EltPlate } from './Cover';

loadBrandFonts();

// Variantes para el test A/B de miniaturas de YouTube (la A es la aprobada, en Cover.tsx).
//   B · «¿ESTAFA?»: fondo oscuro con el muro de portadas, la pregunta enorme y una lupa sobre el logo.
//   C · «Mismo libro: 18,99 € → 0 €»: el contraste de precio con la misma portada a cada lado.
// Se diseñan a 1280×720 y se escalan a cualquier tamaño (ELTCoverB / ELTCoverC y sus versiones 1080).

const Brand: React.FC<{ dark?: boolean; size?: number }> = ({ dark = true, size = 26 }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: dark ? color.ink : '#fff', borderRadius: 999, padding: '8px 20px 8px 12px', boxShadow: '0 12px 28px rgba(0,0,0,0.3)' }}>
    <LogoIcon size={size * 1.45} />
    <span style={{ color: dark ? '#fff' : color.ink, fontWeight: 700, fontSize: size }}>SonorBooks</span>
  </div>
);

const Lens: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ position: 'relative', width: size * 1.55, height: size * 1.55 }}>
    {/* Mango */}
    <div style={{ position: 'absolute', left: size * 0.78, top: size * 0.86, width: size * 0.26, height: size * 0.78, borderRadius: size * 0.1, background: `linear-gradient(90deg, #2a2a2a, ${color.ink} 60%)`, transform: 'rotate(-45deg)', transformOrigin: 'top center', boxShadow: '0 16px 30px rgba(0,0,0,0.5)', border: `5px solid ${color.yellow}` }} />
    {/* Cristal */}
    <div style={{ position: 'absolute', left: 0, top: 0, width: size, height: size, borderRadius: '50%', border: `${size * 0.11}px solid ${color.yellow}`, background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.45), rgba(255,255,255,0.08) 55%, rgba(255,255,255,0.02))', backdropFilter: 'blur(1.5px) brightness(1.25)', boxShadow: '0 20px 40px rgba(0,0,0,0.55), inset 0 0 0 3px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontWeight: 700, fontSize: size * 0.56, color: color.red, textShadow: '0 4px 0 rgba(0,0,0,0.35)', lineHeight: 1 }}>?</span>
    </div>
  </div>
);

const Estafa: React.FC = () => (
  <div style={{ position: 'absolute', inset: 0, fontFamily: font.sans, background: '#0a0c11', overflow: 'hidden' }}>
    {/* Muro de portadas inclinado, oscurecido hacia la izquierda para el texto */}
    <div style={{ position: 'absolute', left: -120, top: -230, width: 1760, transform: 'rotate(-9deg)', opacity: 0.62, filter: 'saturate(1.15)' }}>
      <Img src={staticFile('elt/img/covers_wall.jpg')} style={{ width: '100%', display: 'block' }} />
    </div>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(8,10,15,0.97) 0%, rgba(8,10,15,0.9) 42%, rgba(8,10,15,0.45) 75%, rgba(8,10,15,0.3) 100%)' }} />
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 78% 58%, rgba(229,72,77,0.42), rgba(229,72,77,0) 48%)' }} />
    {/* Pregunta: ocupa todo el ancho */}
    <div style={{ position: 'absolute', left: 36, top: 14, transform: 'rotate(-2.5deg)', transformOrigin: 'left center' }}>
      <div style={{ fontWeight: 700, fontSize: 268, letterSpacing: -11, lineHeight: 1, color: color.yellow, textShadow: '0 10px 0 #000, 0 24px 56px rgba(0,0,0,0.75)', whiteSpace: 'nowrap' }}>¿ESTAFA?</div>
    </div>
    {/* Promesa */}
    <div style={{ position: 'absolute', left: 50, top: 300 }}>
      <div style={{ fontWeight: 700, fontSize: 150, letterSpacing: -7, lineHeight: 0.9, color: '#fff', textShadow: '0 12px 30px rgba(0,0,0,0.6)' }}>6.698</div>
      <div style={{ fontWeight: 700, fontSize: 70, letterSpacing: -2, lineHeight: 1, color: '#fff', marginTop: 6, marginLeft: 6 }}>audiolibros</div>
      <div style={{ display: 'inline-block', marginTop: 22, background: color.yellow, color: color.ink, borderRadius: 22, padding: '4px 30px 14px', fontWeight: 700, fontSize: 128, letterSpacing: -5, lineHeight: 1, transform: 'rotate(-2.5deg)', boxShadow: '0 22px 48px rgba(0,0,0,0.55)' }}>GRATIS</div>
    </div>
    {/* Logo de El Libro Total bajo la lupa */}
    <div style={{ position: 'absolute', left: 588, top: 334 }}><EltPlate w={612} rotate={4} /></div>
    <div style={{ position: 'absolute', left: 1006, top: 246 }}><Lens size={196} /></div>
    <div style={{ position: 'absolute', left: 640, bottom: 30 }}><Brand size={24} /></div>
  </div>
);

const Cyc: React.FC<{ w: number; rotate: number; dim?: boolean }> = ({ w, rotate, dim }) => (
  <div style={{ width: w, height: (w * 352) / 280, borderRadius: 14, overflow: 'hidden', border: '6px solid #fff', transform: `rotate(${rotate}deg)`, boxShadow: dim ? '0 24px 50px rgba(0,0,0,0.6)' : '0 30px 60px rgba(90,60,0,0.45), 0 0 0 10px rgba(255,255,255,0.35)', filter: dim ? 'grayscale(0.7) brightness(0.72)' : 'saturate(1.1)' }}>
    <Img src={staticFile('elt/img/cyc_cover.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
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
        18,99{'\u202F'}€
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
    <div style={{ position: 'absolute', right: 26, top: 240, fontWeight: 700, fontSize: 276, letterSpacing: -12, lineHeight: 1, color: color.ink, textShadow: '0 10px 0 rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>0{'\u202F'}€</div>
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
