import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { color, font } from '../../brand/tokens';
import { loadBrandFonts } from '../../brand/fonts';
import { LogoIcon } from '../../components/Logo';

loadBrandFonts();

// Miniatura de YouTube (1280×720): «GRATIS» + 6.698 audiolibros + lector con audiolectura.
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 70% 50%, #FFF6CF 0%, #FFFFFF 55%, #F3F3F4 100%)', overflow: 'hidden' }}>
    {/* Lector inclinado a la derecha */}
    <div style={{ position: 'absolute', left: 560, top: 70, width: 900, height: 506, borderRadius: 18, overflow: 'hidden', transform: 'perspective(1600px) rotateY(-16deg) rotateZ(2deg)', boxShadow: '0 50px 90px rgba(0,0,0,0.30)', border: '6px solid #fff' }}>
      <Img src={staticFile('elt/shots/09-audiolectura.jpg')} style={{ width: 1120, position: 'absolute', left: -150, top: -40 }} />
    </div>
    {/* Insignia de El Libro Total */}
    <div style={{ position: 'absolute', right: 40, bottom: 44, background: color.eltNavy, borderRadius: 18, padding: '14px 24px', boxShadow: '0 16px 40px rgba(0,0,0,0.3)' }}>
      <Img src={staticFile('elt/img/elt_logo.png')} style={{ height: 66, display: 'block' }} />
    </div>
    {/* Texto */}
    <div style={{ position: 'absolute', left: 54, top: 70, fontFamily: font.sans, color: color.ink }}>
      <div style={{ fontSize: 66, fontWeight: 700, lineHeight: 1, letterSpacing: -1 }}>6.698 audiolibros</div>
      <div style={{ position: 'relative', display: 'inline-block', marginTop: 6 }}>
        <div style={{ position: 'absolute', left: -10, right: -10, bottom: 18, height: 70, background: color.yellow, borderRadius: 14, transform: 'skewX(-8deg)' }} />
        <div style={{ position: 'relative', fontSize: 190, fontWeight: 700, letterSpacing: -6, lineHeight: 1 }}>GRATIS</div>
      </div>
      <div style={{ marginTop: 26, display: 'inline-flex', alignItems: 'center', gap: 14, padding: '14px 30px', borderRadius: 999, background: color.ink, color: '#fff', fontSize: 50, fontWeight: 700 }}>¿Dónde está la trampa?</div>
    </div>
    <div style={{ position: 'absolute', left: 54, bottom: 44, display: 'flex', alignItems: 'center', gap: 14, fontFamily: font.sans, fontWeight: 700, fontSize: 40 }}>
      <LogoIcon size={58} /> SonorBooks
    </div>
  </AbsoluteFill>
);
