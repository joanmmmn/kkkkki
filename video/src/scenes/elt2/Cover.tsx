import React from 'react';
import { AbsoluteFill, Img, staticFile, useVideoConfig } from 'remotion';
import { color, font } from '../../brand/tokens';
import { loadBrandFonts } from '../../brand/fonts';
import { LogoIcon } from '../../components/Logo';

loadBrandFonts();

// Recorte del lector (captura 4K): página derecha con «Primera parte · Capítulo I», texto resaltado y el globo de audio.
const SHOT = 'elt/shots/08-audiolectura-resaltado.jpg';
const CROP = { x: 2000, y: 400, w: 1300, h: 870 };

const ReaderCard: React.FC<{ w: number }> = ({ w }) => {
  const s = w / CROP.w;
  const h = CROP.h * s;
  return (
    <div style={{ width: w, height: h, borderRadius: 22, overflow: 'hidden', position: 'relative', background: '#fff', border: '8px solid #fff', boxShadow: '0 40px 80px rgba(60,40,0,0.35), 0 8px 20px rgba(0,0,0,0.18)' }}>
      <Img src={staticFile(SHOT)} style={{ position: 'absolute', width: 3840 * s, left: -CROP.x * s, top: -CROP.y * s, filter: 'saturate(2.2) contrast(1.06)' }} />
    </div>
  );
};

// Diseño base a 1280×720. Para otros tamaños se escala y se centra; el fondo ocupa todo el lienzo.
const Design: React.FC = () => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 1280, height: 720, fontFamily: font.sans, color: color.ink }}>
    {/* Lector inclinado */}
    <div style={{ position: 'absolute', left: 672, top: 128, transform: 'perspective(1800px) rotateY(-14deg) rotateZ(3deg)', transformOrigin: 'left center' }}>
      <ReaderCard w={560} />
    </div>
    {/* Pegatina */}
    <div style={{ position: 'absolute', left: 1026, top: 34, width: 236, height: 236, borderRadius: '50%', background: color.red, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: 700, transform: 'rotate(10deg)', boxShadow: '0 18px 40px rgba(120,0,0,0.35)', border: '6px solid #fff', textAlign: 'center', lineHeight: 1 }}>
      <span style={{ fontSize: 21, letterSpacing: 1, whiteSpace: 'nowrap', opacity: 0.92 }}>¿DÓNDE ESTÁ LA</span>
      <span style={{ fontSize: 41, letterSpacing: -1, marginTop: 6, whiteSpace: 'nowrap' }}>TRAMPA?</span>
    </div>
    {/* Audio: se escucha y se lee a la vez */}
    <div style={{ position: 'absolute', left: 880, top: 486, display: 'flex', alignItems: 'center', gap: 14, background: color.ink, borderRadius: 999, padding: '12px 26px 12px 14px', boxShadow: '0 18px 40px rgba(0,0,0,0.35)', transform: 'rotate(-3deg)' }}>
      <div style={{ width: 52, height: 52, borderRadius: 26, background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="30" height="30" viewBox="0 0 24 24"><path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" fill={color.ink} /><path d="M15.2 8.8a4.6 4.6 0 0 1 0 6.4M17.8 6.4a8 8 0 0 1 0 11.2" stroke={color.ink} strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, height: 44 }}>
        {[0.35, 0.7, 0.5, 0.95, 0.6, 0.8, 0.4, 1, 0.55, 0.75, 0.45, 0.9, 0.5, 0.3].map((v, i) => (
          <div key={i} style={{ width: 6, height: 8 + v * 36, borderRadius: 3, background: i < 9 ? color.yellow : 'rgba(255,255,255,0.45)' }} />
        ))}
      </div>
    </div>
    {/* Marca */}
    <div style={{ position: 'absolute', left: 60, top: 46, display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: color.ink, borderRadius: 999, padding: '10px 22px 10px 16px' }}>
        <LogoIcon size={44} />
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 30 }}>SonorBooks</span>
      </div>
      <span style={{ fontWeight: 700, fontSize: 26, letterSpacing: 5, color: color.ink }}>RESEÑA</span>
    </div>
    {/* Titular */}
    <div style={{ position: 'absolute', left: 54, top: 128 }}>
      <div style={{ fontWeight: 700, fontSize: 226, letterSpacing: -10, lineHeight: 0.92 }}>6.698</div>
      <div style={{ fontWeight: 700, fontSize: 80, letterSpacing: -2, lineHeight: 1, marginTop: 4, marginLeft: 6 }}>audiolibros</div>
      <div style={{ display: 'inline-block', marginTop: 26, marginLeft: 2, background: color.ink, color: '#fff', borderRadius: 22, padding: '6px 30px 16px', fontWeight: 700, fontSize: 148, letterSpacing: -5, lineHeight: 1, transform: 'rotate(-2.5deg)', boxShadow: '0 22px 44px rgba(0,0,0,0.28)' }}>
        GRATIS
      </div>
    </div>
    {/* El Libro Total */}
    {/* Fuera de la esquina inferior derecha, donde YouTube pone la duración */}
    <div style={{ position: 'absolute', left: 686, bottom: 40, background: color.eltNavy, borderRadius: 18, padding: '12px 22px', boxShadow: '0 16px 40px rgba(0,0,0,0.3)' }}>
      <Img src={staticFile('elt/img/elt_logo.png')} style={{ height: 56, display: 'block' }} />
    </div>
  </div>
);

// Miniatura de YouTube y portada del blog. Composiciones: ELTCover (1280×720), ELTCover1080 (1920×1080), ELTCoverOG (1200×630).
export const Cover: React.FC = () => {
  const { width, height } = useVideoConfig();
  const k = Math.min(width / 1280, height / 720);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 30% 40%, #FFE066 0%, ${color.yellow} 55%, #F2B800 100%)`, overflow: 'hidden' }}>
      <AbsoluteFill style={{ backgroundImage: 'radial-gradient(rgba(16,16,16,0.10) 2px, transparent 2.4px)', backgroundSize: '28px 28px', opacity: 0.6 }} />
      <div style={{ position: 'absolute', left: (width - 1280 * k) / 2, top: (height - 720 * k) / 2, width: 1280, height: 720, transform: `scale(${k})`, transformOrigin: '0 0' }}>
        <Design />
      </div>
    </AbsoluteFill>
  );
};
