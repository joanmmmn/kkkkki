import React from 'react';
import { AbsoluteFill, Img, staticFile, useVideoConfig } from 'remotion';
import { color, font } from '../../brand/tokens';
import { loadBrandFonts } from '../../brand/fonts';
import { LogoIcon } from '../../components/Logo';
import { lvi } from './common';

loadBrandFonts();

// Página de «El rayo de luna» con la palabra que suena resaltada (como en el vídeo y en la página).
const WORDS = 'Yo no sé si esto es una historia que parece cuento o un cuento que parece historia; lo que puedo decir es que en su fondo hay una verdad, una verdad muy triste…'.split(' ');
const ON = 16; // «historia;»

const BookCard: React.FC<{ w: number }> = ({ w }) => (
  <div style={{ width: w, padding: '34px 40px 36px 46px', borderRadius: '14px 26px 26px 14px', background: '#FFFDF6', color: '#2a2418', fontFamily: font.serif,
    boxShadow: '8px 8px 0 -1px #f6eed8, 8px 8px 0 0 rgba(90,64,10,0.16), 16px 16px 0 -1px #efe4c6, 16px 16px 0 0 rgba(90,64,10,0.16), 0 40px 80px rgba(60,40,0,0.35), inset 18px 0 22px -18px rgba(90,60,10,0.35)' }}>
    <div style={{ fontSize: 40, fontWeight: 500, letterSpacing: -0.5 }}>El rayo de luna</div>
    <div style={{ fontSize: 21, fontStyle: 'italic', color: '#8a7a5c', marginTop: 4, marginBottom: 18 }}>Gustavo Adolfo Bécquer</div>
    <div style={{ fontSize: 28, lineHeight: 1.62 }}>
      {WORDS.map((t, i) => (
        <span key={i} style={{ background: i === ON ? color.yellow : 'transparent', borderRadius: 6, padding: '0 4px', margin: '0 -4px', color: i <= ON ? '#2a2418' : 'rgba(42,36,24,0.42)' }}>
          {t}{i < WORDS.length - 1 ? ' ' : ''}
        </span>
      ))}
    </div>
  </div>
);

// Diseño base a 1280×720 (miniatura de YouTube y portada del artículo).
const Design: React.FC = () => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 1280, height: 720, fontFamily: font.sans, color: color.ink }}>
    <div style={{ position: 'absolute', left: 676, top: 128, transform: 'perspective(1800px) rotateY(-13deg) rotateZ(3deg)', transformOrigin: 'left center' }}>
      <BookCard w={540} />
    </div>
    {/* Pegatina: más de 21.000 libros */}
    <div style={{ position: 'absolute', left: 1030, top: 26, width: 224, height: 224, borderRadius: '50%', background: color.red, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: 700, transform: 'rotate(10deg)', boxShadow: '0 18px 40px rgba(120,0,0,0.35)', border: '6px solid #fff', textAlign: 'center', lineHeight: 1 }}>
      <span style={{ fontSize: 30 }}>más de</span>
      <span style={{ fontSize: 60, letterSpacing: -2, marginTop: 2 }}>21.000</span>
      <span style={{ fontSize: 30, marginTop: 4 }}>libros</span>
    </div>
    {/* Paso a paso: el vídeo enseña a usarlo (antes ponía «Voz humana») */}
    <div style={{ position: 'absolute', left: 760, top: 562, display: 'flex', alignItems: 'center', gap: 16, background: color.ink, borderRadius: 999, padding: '12px 34px 12px 14px', boxShadow: '0 18px 40px rgba(0,0,0,0.35)', transform: 'rotate(-3deg)' }}>
      <div style={{ width: 52, height: 52, borderRadius: 26, background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="30" height="30" viewBox="0 0 24 24"><path d="M6 3.5v15.2l4.1-3.9 2.7 6.2 2.6-1.1-2.7-6.1 5.6-.2z" fill={color.ink} stroke={color.ink} strokeWidth="1.2" strokeLinejoin="round" /></svg>
      </div>
      <span style={{ color: '#fff', fontWeight: 700, fontSize: 36 }}>Paso a paso</span>
    </div>
    {/* Marca */}
    <div style={{ position: 'absolute', left: 60, top: 46, display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: color.ink, borderRadius: 999, padding: '10px 22px 10px 16px' }}>
        <LogoIcon size={44} />
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 30 }}>SonorBooks</span>
      </div>
      <span style={{ fontWeight: 700, fontSize: 26, letterSpacing: 5 }}>GUÍA</span>
    </div>
    {/* Titular */}
    <div style={{ position: 'absolute', left: 56, top: 150 }}>
      <div style={{ background: '#fff', borderRadius: 18, padding: '16px 26px', display: 'inline-block', boxShadow: '0 16px 36px rgba(0,0,0,0.18)', transform: 'rotate(-1.5deg)' }}>
        <Img src={staticFile(lvi('librivox_logo.png'))} style={{ height: 54, display: 'block' }} />
      </div>
      <div style={{ fontWeight: 700, fontSize: 70, letterSpacing: -2.5, lineHeight: 1, marginTop: 34 }}>Audiolibros</div>
      <div style={{ fontWeight: 700, fontSize: 150, letterSpacing: -7, lineHeight: 0.92 }}>GRATIS</div>
      <div style={{ display: 'inline-block', marginTop: 18, background: color.ink, color: '#fff', borderRadius: 18, padding: '8px 24px 12px', fontWeight: 700, fontSize: 50, letterSpacing: -1, transform: 'rotate(-2deg)', boxShadow: '0 18px 40px rgba(0,0,0,0.28)' }}>
        ¡y legales!
      </div>
    </div>
  </div>
);

// Composiciones: LVCover (1280×720), LVCover1080 (1920×1080), LVCoverOG (1200×630).
export const LVCover: React.FC = () => {
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
