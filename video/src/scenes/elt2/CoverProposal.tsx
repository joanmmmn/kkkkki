import React from 'react';
import { AbsoluteFill, Img, staticFile, useVideoConfig } from 'remotion';
import { color, font } from '../../brand/tokens';
import { loadBrandFonts } from '../../brand/fonts';
import { LogoIcon } from '../../components/Logo';

loadBrandFonts();

// Propuesta de miniatura con el logo de El Libro Total (vectorial) en grande sobre el libro.
// Variante A: logo en la mitad superior del libro, pegatina abajo a la derecha y píldora de audio abajo a la izquierda.
// Variante B: logo en la mitad inferior del libro y pegatina arriba a la derecha.
const SHOT = 'elt/shots/08-audiolectura-resaltado.jpg';
const CROP = { x: 2000, y: 400, w: 1300, h: 870 };

const ReaderCard: React.FC<{ w: number }> = ({ w }) => {
  const s = w / CROP.w;
  return (
    <div style={{ width: w, height: CROP.h * s, borderRadius: 22, overflow: 'hidden', position: 'relative', background: '#fff', border: '8px solid #fff', boxShadow: '0 40px 80px rgba(60,40,0,0.35), 0 8px 20px rgba(0,0,0,0.18)' }}>
      <Img src={staticFile(SHOT)} style={{ position: 'absolute', width: 3840 * s, left: -CROP.x * s, top: -CROP.y * s, filter: 'saturate(2.2) contrast(1.06)' }} />
    </div>
  );
};

const EltPlate: React.FC<{ w: number; rotate: number }> = ({ w, rotate }) => (
  <div style={{ width: w, padding: `${w * 0.075}px ${w * 0.085}px`, background: `linear-gradient(160deg, #16263d 0%, ${color.eltNavy} 70%)`, borderRadius: 28, border: '6px solid #fff', boxShadow: '0 30px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,0,0,0.08)', transform: `rotate(${rotate}deg)` }}>
    <Img src={staticFile('elt/img/elt_logo.svg')} style={{ width: '100%', display: 'block' }} />
  </div>
);

const Sticker: React.FC<{ size: number; rotate: number }> = ({ size, rotate }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', background: color.red, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: 700, transform: `rotate(${rotate}deg)`, boxShadow: '0 18px 40px rgba(120,0,0,0.35)', border: '6px solid #fff', textAlign: 'center', lineHeight: 1 }}>
    <span style={{ fontSize: size * 0.09, letterSpacing: 1, whiteSpace: 'nowrap', opacity: 0.92 }}>¿DÓNDE ESTÁ LA</span>
    <span style={{ fontSize: size * 0.175, letterSpacing: -1, marginTop: 6, whiteSpace: 'nowrap' }}>TRAMPA?</span>
  </div>
);

const AudioPill: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: color.ink, borderRadius: 999, padding: '12px 26px 12px 14px', boxShadow: '0 18px 40px rgba(0,0,0,0.35)', transform: 'rotate(-3deg)' }}>
    <div style={{ width: 52, height: 52, borderRadius: 26, background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="30" height="30" viewBox="0 0 24 24"><path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" fill={color.ink} /><path d="M15.2 8.8a4.6 4.6 0 0 1 0 6.4M17.8 6.4a8 8 0 0 1 0 11.2" stroke={color.ink} strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, height: 44 }}>
      {[0.35, 0.7, 0.5, 0.95, 0.6, 0.8, 0.4, 1, 0.55, 0.75, 0.45, 0.9, 0.5, 0.3].map((v, i) => (
        <div key={i} style={{ width: 6, height: 8 + v * 36, borderRadius: 3, background: i < 9 ? color.yellow : 'rgba(255,255,255,0.45)' }} />
      ))}
    </div>
  </div>
);

const Left: React.FC = () => (
  <>
    <div style={{ position: 'absolute', left: 60, top: 46, display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: color.ink, borderRadius: 999, padding: '10px 22px 10px 16px' }}>
        <LogoIcon size={44} />
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 30 }}>SonorBooks</span>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 54, top: 128 }}>
      <div style={{ fontWeight: 700, fontSize: 226, letterSpacing: -10, lineHeight: 0.92 }}>6.698</div>
      <div style={{ fontWeight: 700, fontSize: 80, letterSpacing: -2, lineHeight: 1, marginTop: 4, marginLeft: 6 }}>audiolibros</div>
      <div style={{ display: 'inline-block', marginTop: 26, marginLeft: 2, background: color.ink, color: '#fff', borderRadius: 22, padding: '6px 30px 16px', fontWeight: 700, fontSize: 148, letterSpacing: -5, lineHeight: 1, transform: 'rotate(-2.5deg)', boxShadow: '0 22px 44px rgba(0,0,0,0.28)' }}>
        GRATIS
      </div>
    </div>
  </>
);

const Design: React.FC<{ variant: 'a' | 'b' }> = ({ variant }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 1280, height: 720, fontFamily: font.sans, color: color.ink }}>
    <div style={{ position: 'absolute', left: 672, top: 118, transform: 'perspective(1800px) rotateY(-14deg) rotateZ(3deg)', transformOrigin: 'left center' }}>
      <ReaderCard w={560} />
    </div>
    {variant === 'a' ? (
      <>
        <div style={{ position: 'absolute', left: 664, top: 132 }}><EltPlate w={580} rotate={-3} /></div>
        <div style={{ position: 'absolute', left: 676, top: 470 }}><AudioPill /></div>
        <div style={{ position: 'absolute', left: 1036, top: 398 }}><Sticker size={216} rotate={10} /></div>
      </>
    ) : (
      <>
        <div style={{ position: 'absolute', left: 1030, top: 30 }}><Sticker size={226} rotate={10} /></div>
        <div style={{ position: 'absolute', left: 652, top: 286 }}><EltPlate w={612} rotate={-3} /></div>
      </>
    )}
    <Left />
  </div>
);

export const CoverProposal: React.FC<{ variant?: 'a' | 'b' }> = ({ variant = 'a' }) => {
  const { width, height } = useVideoConfig();
  const k = Math.min(width / 1280, height / 720);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 30% 40%, #FFE066 0%, ${color.yellow} 55%, #F2B800 100%)`, overflow: 'hidden' }}>
      <AbsoluteFill style={{ backgroundImage: 'radial-gradient(rgba(16,16,16,0.10) 2px, transparent 2.4px)', backgroundSize: '28px 28px', opacity: 0.6 }} />
      <div style={{ position: 'absolute', left: (width - 1280 * k) / 2, top: (height - 720 * k) / 2, width: 1280, height: 720, transform: `scale(${k})`, transformOrigin: '0 0' }}>
        <Design variant={variant} />
      </div>
    </AbsoluteFill>
  );
};
