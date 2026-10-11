import React from 'react';
import { AbsoluteFill, Img, staticFile, useVideoConfig } from 'remotion';
import { color, font } from '../../brand/tokens';
import { loadBrandFonts } from '../../brand/fonts';
import { LogoIcon } from '../../components/Logo';

loadBrandFonts();

// Recorte del lector (réplica 4K): «El rayo de luna» con el párrafo y la palabra resaltados.
const SHOT = 'er/app/st/rd_s_10.png';
const CROP = { x: 1260, y: 700, w: 1320, h: 820 };

const ReaderCard: React.FC<{ w: number }> = ({ w }) => {
  const s = w / CROP.w;
  return (
    <div style={{ width: w, height: CROP.h * s, borderRadius: 22, overflow: 'hidden', position: 'relative', background: '#fff', border: '8px solid #fff', boxShadow: '0 40px 80px rgba(60,40,0,0.35), 0 8px 20px rgba(0,0,0,0.18)' }}>
      <Img src={staticFile(SHOT)} style={{ position: 'absolute', width: 3840 * s, left: -CROP.x * s, top: -CROP.y * s, filter: 'saturate(1.4) contrast(1.05)' }} />
    </div>
  );
};

// Diseño base a 1280×720 (miniatura de YouTube y portada del artículo).
const Design: React.FC = () => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 1280, height: 720, fontFamily: font.sans, color: color.ink }}>
    <div style={{ position: 'absolute', left: 650, top: 150, transform: 'perspective(1800px) rotateY(-14deg) rotateZ(3deg)', transformOrigin: 'left center' }}>
      <ReaderCard w={580} />
    </div>
    {/* Pegatina: 30 días gratis */}
    <div style={{ position: 'absolute', left: 1022, top: 30, width: 236, height: 236, borderRadius: '50%', background: color.red, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: 700, transform: 'rotate(10deg)', boxShadow: '0 18px 40px rgba(120,0,0,0.35)', border: '6px solid #fff', textAlign: 'center', lineHeight: 1 }}>
      <span style={{ fontSize: 66, letterSpacing: -2 }}>30</span>
      <span style={{ fontSize: 30, letterSpacing: 0, marginTop: 2 }}>DÍAS</span>
      <span style={{ fontSize: 30, letterSpacing: 0, marginTop: 4 }}>GRATIS</span>
    </div>
    {/* Voz con IA */}
    <div style={{ position: 'absolute', left: 760, top: 520, display: 'flex', alignItems: 'center', gap: 14, background: color.ink, borderRadius: 999, padding: '12px 28px 12px 14px', boxShadow: '0 18px 40px rgba(0,0,0,0.35)', transform: 'rotate(-3deg)' }}>
      <div style={{ width: 52, height: 52, borderRadius: 26, background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="30" height="30" viewBox="0 0 24 24"><path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" fill={color.ink} /><path d="M15.2 8.8a4.6 4.6 0 0 1 0 6.4M17.8 6.4a8 8 0 0 1 0 11.2" stroke={color.ink} strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
      </div>
      <span style={{ color: '#fff', fontWeight: 700, fontSize: 34 }}>Voz con IA</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, height: 40 }}>
        {[0.35, 0.7, 0.5, 0.95, 0.6, 0.8, 0.4, 1, 0.55].map((v, i) => (
          <div key={i} style={{ width: 6, height: 8 + v * 30, borderRadius: 3, background: color.yellow }} />
        ))}
      </div>
    </div>
    {/* Marca */}
    <div style={{ position: 'absolute', left: 60, top: 46, display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: color.ink, borderRadius: 999, padding: '10px 22px 10px 16px' }}>
        <LogoIcon size={44} />
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 30 }}>SonorBooks</span>
      </div>
      <span style={{ fontWeight: 700, fontSize: 26, letterSpacing: 5 }}>RESEÑA</span>
    </div>
    {/* Titular */}
    <div style={{ position: 'absolute', left: 56, top: 150 }}>
      <div style={{ background: '#fff', borderRadius: 18, padding: '14px 24px', display: 'inline-block', boxShadow: '0 16px 36px rgba(0,0,0,0.18)', transform: 'rotate(-1.5deg)' }}>
        <Img src={staticFile('er/img/elevenreader.png')} style={{ height: 58, display: 'block' }} />
      </div>
      <div style={{ fontWeight: 700, fontSize: 118, letterSpacing: -5, lineHeight: 0.95, marginTop: 34 }}>¿Merece</div>
      <div style={{ fontWeight: 700, fontSize: 118, letterSpacing: -5, lineHeight: 0.95 }}>la pena?</div>
      <div style={{ display: 'inline-block', marginTop: 26, background: color.ink, color: '#fff', borderRadius: 18, padding: '8px 24px 12px', fontWeight: 700, fontSize: 46, letterSpacing: -1, transform: 'rotate(-2deg)', boxShadow: '0 18px 40px rgba(0,0,0,0.28)' }}>
        La probamos por dentro
      </div>
    </div>
  </div>
);

// Composiciones: ERCover (1280×720), ERCover1080 (1920×1080), ERCoverOG (1200×630).
export const ERCover: React.FC = () => {
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
