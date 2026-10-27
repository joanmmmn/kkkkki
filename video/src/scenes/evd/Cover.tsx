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

// ---------- B · ¿ESTAFA? ----------
// Las tarjetas reales de la página de planes y una lupa que amplía «1 desbloqueo» (el plan más barato).
const PLATE = { left: 36, top: 300, w: 1000, rotate: -3 };
const LENS = { cx: 250, cy: 500, r: 175, zoom: 1.9, fx: 178, fy: 476 };

const EstafaScene: React.FC = () => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 1280, height: 720, background: '#0a0c11', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', right: -160, top: -240, width: 820, transform: 'rotate(9deg)', opacity: 0.5 }}>
      <Img src={staticFile('evd/img/hero_collage.jpg')} style={{ width: '100%', display: 'block' }} />
    </div>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(8,10,15,0.94) 0%, rgba(8,10,15,0.72) 40%, rgba(8,10,15,0.5) 100%)' }} />
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 40% 72%, rgba(229,72,77,0.45), rgba(229,72,77,0) 55%)' }} />
    <div style={{ position: 'absolute', left: PLATE.left, top: PLATE.top, width: PLATE.w, padding: 0, borderRadius: 22, overflow: 'hidden', border: '6px solid #fff', boxShadow: '0 30px 60px rgba(0,0,0,0.55)', transform: `rotate(${PLATE.rotate}deg)`, background: '#F8F7F4' }}>
      <Img src={staticFile('evd/img/plans_cards.jpg')} style={{ width: '100%', display: 'block' }} />
    </div>
  </div>
);

const Magnifier: React.FC = () => {
  const { cx, cy, r, zoom, fx, fy } = LENS;
  const ring = r * 0.13;
  return (
    <>
      <div style={{ position: 'absolute', left: cx + r * 0.62, top: cy + r * 0.62, width: r * 0.34, height: r * 1.25, borderRadius: r * 0.12, background: `linear-gradient(90deg, #2c2c2c, ${color.ink} 55%, #000)`, border: `6px solid ${color.yellow}`, transform: 'rotate(-45deg)', transformOrigin: 'top center', boxShadow: '0 20px 40px rgba(0,0,0,0.55)' }} />
      <div style={{ position: 'absolute', left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: '50%', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }}>
        <div style={{ position: 'absolute', left: -(cx - r), top: -(cy - r), width: 1280, height: 720, transform: `translate(${cx - fx}px, ${cy - fy}px) scale(${zoom})`, transformOrigin: `${fx}px ${fy}px` }}>
          <EstafaScene />
        </div>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 32% 26%, rgba(255,255,255,0.4), rgba(255,255,255,0.05) 38%, rgba(255,255,255,0) 60%), radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.3) 100%)' }} />
      </div>
      <div style={{ position: 'absolute', left: cx - r - ring, top: cy - r - ring, width: (r + ring) * 2, height: (r + ring) * 2, borderRadius: '50%', border: `${ring}px solid ${color.yellow}`, boxShadow: 'inset 0 0 0 3px rgba(0,0,0,0.25), 0 0 0 3px rgba(0,0,0,0.35)' }} />
    </>
  );
};

export const EvdCoverEstafa: React.FC = () => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 1280, height: 720, fontFamily: font.sans, overflow: 'hidden' }}>
    <EstafaScene />
    <div style={{ position: 'absolute', right: 56, bottom: 60, width: 230, height: 230, borderRadius: 50, overflow: 'hidden', transform: 'rotate(8deg)', boxShadow: '0 30px 70px rgba(0,0,0,0.65)', border: '6px solid #fff' }}>
      <Img src={staticFile('evd/img/everand_icon.png')} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
    <Magnifier />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 6, display: 'flex', justifyContent: 'center' }}>
      <div style={{ fontWeight: 700, fontSize: 276, letterSpacing: -11, lineHeight: 1, color: color.yellow, textShadow: '0 10px 0 #000, 0 26px 60px rgba(0,0,0,0.75)', whiteSpace: 'nowrap', transform: 'rotate(-2deg)' }}>¿ESTAFA?</div>
    </div>
  </div>
);

// ---------- C · 14,99 € por 3 libros frente a 9,99 € ilimitado ----------
export const EvdCoverPrecio: React.FC = () => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 1280, height: 720, fontFamily: font.sans, overflow: 'hidden', background: `radial-gradient(ellipse at 75% 45%, #FFE066 0%, ${color.yellow} 50%, #F2B800 100%)` }}>
    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(16,16,16,0.10) 2px, transparent 2.4px)', backgroundSize: '28px 28px', opacity: 0.6 }} />
    <div style={{ position: 'absolute', inset: 0, background: '#131313', clipPath: 'polygon(0 0, 690px 0, 600px 720px, 0 720px)' }} />
    {/* Izquierda: Everand Plus */}
    <div style={{ position: 'absolute', left: 0, top: 0, width: 620, height: 720, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ marginTop: 44, display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ width: 84, height: 84, borderRadius: 20, overflow: 'hidden' }}><Img src={staticFile('evd/img/everand_icon.png')} style={{ width: '100%', height: '100%', display: 'block' }} /></div>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: 60, letterSpacing: -1 }}>Everand</div>
      </div>
      <div style={{ marginTop: 40, color: '#fff', fontWeight: 700, fontSize: 176, letterSpacing: -8, lineHeight: 1, whiteSpace: 'nowrap' }}>14,99€</div>
      <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 18, background: EV_LIME, color: color.ink, borderRadius: 22, padding: '10px 30px 16px', fontWeight: 700, fontSize: 86, letterSpacing: -2, transform: 'rotate(-3deg)', boxShadow: '0 16px 30px rgba(0,0,0,0.4)' }}>3 LIBROS</div>
    </div>
    {/* Derecha: Audible */}
    <div style={{ position: 'absolute', left: 640, top: 0, width: 640, height: 720, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ marginTop: 52, color: color.ink, fontWeight: 700, fontSize: 60, letterSpacing: -1 }}>Audible</div>
      <div style={{ marginTop: 44, color: color.ink, fontWeight: 700, fontSize: 176, letterSpacing: -8, lineHeight: 1, whiteSpace: 'nowrap' }}>9,99€</div>
      <div style={{ marginTop: 26, background: color.ink, color: '#fff', borderRadius: 22, padding: '10px 30px 16px', fontWeight: 700, fontSize: 86, letterSpacing: -2, transform: 'rotate(2deg)', boxShadow: '0 16px 30px rgba(0,0,0,0.3)' }}>ILIMITADO</div>
    </div>
    {/* VS en la costura */}
    <div style={{ position: 'absolute', left: 580, top: 296, width: 128, height: 128, borderRadius: '50%', background: '#fff', border: `7px solid ${color.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 54, color: color.ink, boxShadow: '0 18px 40px rgba(0,0,0,0.4)' }}>VS</div>
    <div style={{ position: 'absolute', left: 452, bottom: 34, background: color.red, color: '#fff', borderRadius: 18, padding: '8px 28px 12px', fontWeight: 700, fontSize: 56, transform: 'rotate(-3deg)', boxShadow: '0 16px 30px rgba(0,0,0,0.35)', border: '5px solid #fff', whiteSpace: 'nowrap' }}>¿PAGAS DE MÁS?</div>
    <div style={{ position: 'absolute', left: 40, bottom: 40 }}><Brand size={22} /></div>
  </div>
);

export const EvdCover: React.FC<{ design?: 'a' | 'estafa' | 'precio' }> = ({ design = 'a' }) => {
  const { width, height } = useVideoConfig();
  const k = Math.max(width / 1280, height / 720);
  return (
    <AbsoluteFill style={{ background: '#101113', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: (width - 1280 * k) / 2, top: (height - 720 * k) / 2, width: 1280, height: 720, transform: `scale(${k})`, transformOrigin: '0 0' }}>
        {design === 'estafa' ? <EvdCoverEstafa /> : design === 'precio' ? <EvdCoverPrecio /> : <EvdCoverArt />}
      </div>
    </AbsoluteFill>
  );
};
