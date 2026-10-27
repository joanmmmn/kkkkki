import React from 'react';
import { AbsoluteFill, Img, staticFile, useVideoConfig } from 'remotion';
import { color, font } from '../../brand/tokens';
import { loadBrandFonts } from '../../brand/fonts';
import { LogoIcon } from '../../components/Logo';
import { EV_LIME } from './ui';

loadBrandFonts();

// Miniatura A de la reseña de Everand (y portada del blog): «Antes ∞ → ahora 1 libro al mes».
// Se diseña a 1280×720 y se escala a cualquier tamaño (EVDCover, EVDCover1080, EVDCoverOG).
const Brand: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: color.ink, borderRadius: 999, padding: '8px 20px 8px 12px', boxShadow: '0 12px 28px rgba(0,0,0,0.3)' }}>
    <LogoIcon size={size * 1.45} />
    <span style={{ color: '#fff', fontWeight: 700, fontSize: size }}>SonorBooks</span>
  </div>
);

export const EvdCoverArt: React.FC = () => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 1280, height: 720, overflow: 'hidden', fontFamily: font.sans, background: '#101113' }}>
    {/* Portadas reales de everand.com, a la derecha */}
    <div style={{ position: 'absolute', right: -120, top: -200, width: 760, transform: 'rotate(8deg)', opacity: 0.85 }}>
      <Img src={staticFile('evd/img/hero_collage.jpg')} style={{ width: '100%', display: 'block' }} />
    </div>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #101113 0%, #101113 44%, rgba(16,17,19,0.55) 70%, rgba(16,17,19,0.15) 100%)' }} />
    {/* Icono de la app inclinado */}
    <div style={{ position: 'absolute', right: 70, top: 64, width: 250, height: 250, borderRadius: 54, overflow: 'hidden', transform: 'rotate(9deg)', boxShadow: '0 30px 70px rgba(0,0,0,0.6)', border: '6px solid #fff' }}>
      <Img src={staticFile('evd/img/everand_icon.png')} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
    <div style={{ position: 'absolute', left: 54, top: 42 }}><Brand /></div>
    {/* Antes: ilimitado (tachado) */}
    <div style={{ position: 'absolute', left: 60, top: 128, display: 'flex', alignItems: 'center', gap: 22 }}>
      <div style={{ position: 'relative', color: 'rgba(255,255,255,0.75)', fontWeight: 700, fontSize: 64, letterSpacing: -1 }}>
        ILIMITADO
        <div style={{ position: 'absolute', left: -10, right: -10, top: '52%', height: 12, borderRadius: 6, background: color.red, transform: 'rotate(-5deg)', boxShadow: '0 4px 10px rgba(0,0,0,0.45)' }} />
      </div>
    </div>
    {/* Ahora: 1 libro al mes */}
    <div style={{ position: 'absolute', left: 40, top: 200, display: 'flex', alignItems: 'flex-end', gap: 18 }}>
      <div style={{ fontWeight: 700, fontSize: 470, lineHeight: 0.82, letterSpacing: -20, color: EV_LIME, textShadow: '0 16px 0 rgba(0,0,0,0.5)' }}>1</div>
      <div style={{ marginBottom: 36, fontWeight: 700, fontSize: 96, lineHeight: 0.95, color: '#fff', letterSpacing: -3 }}>LIBRO<br />AL MES</div>
    </div>
    <div style={{ position: 'absolute', left: 64, bottom: 44, display: 'inline-block', background: color.yellow, color: color.ink, borderRadius: 16, padding: '6px 22px 10px', fontWeight: 700, fontSize: 50, transform: 'rotate(-2deg)', boxShadow: '0 14px 30px rgba(0,0,0,0.4)' }}>¿Sigue valiendo la pena?</div>
  </div>
);

export const EvdCover: React.FC = () => {
  const { width, height } = useVideoConfig();
  const k = Math.max(width / 1280, height / 720);
  return (
    <AbsoluteFill style={{ background: '#101113', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: (width - 1280 * k) / 2, top: (height - 720 * k) / 2, width: 1280, height: 720, transform: `scale(${k})`, transformOrigin: '0 0' }}>
        <EvdCoverArt />
      </div>
    </AbsoluteFill>
  );
};
