import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { LogoIcon } from '../../components/Logo';
import { Cursor } from '../../components/Cursor';
import { NextoryLogo } from './common';

// Miniatura de YouTube (1280×720): «30 días GRATIS» + la recomendación real de SonorBooks.
export const NXThumb: React.FC = () => {
  // Recorte de la ficha (px CSS del viewport 1920×1080 grabado): caja «Nuestra recomendación».
  const crop = { x: 940, y: 452, w: 670, h: 330 };
  const s = 0.92; // escala px CSS → px de la miniatura
  return (
    <Stage tone="warm" still>
      <AbsoluteFill style={{ padding: '58px 0 0 66px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <LogoIcon size={58} />
          <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.muted }}>×</span>
          <NextoryLogo width={190} />
        </div>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 150, letterSpacing: -5, lineHeight: 0.95, color: color.ink, marginTop: 40 }}>30 DÍAS</div>
        <div style={{ position: 'relative', display: 'inline-block', alignSelf: 'flex-start', marginTop: 6 }}>
          <div style={{ position: 'absolute', left: -10, right: -10, bottom: 14, height: 58, background: color.yellow, borderRadius: 12, transform: 'skewX(-8deg)' }} />
          <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 700, fontSize: 124, letterSpacing: -4, lineHeight: 1, color: color.ink }}>GRATIS</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 26, fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: color.ink2 }}>
          en vez de
          <span style={{ position: 'relative', color: color.muted }}>14<span style={{ position: 'absolute', left: -6, right: -6, top: '50%', height: 7, background: color.red, borderRadius: 4, transform: 'rotate(-8deg)' }} /></span>
        </div>
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 640, top: 150, transform: 'rotate(-3deg)', borderRadius: 22, overflow: 'hidden', boxShadow: shadow.card, border: `5px solid ${color.yellow}`, background: '#fff' }}>
        <div style={{ width: crop.w * s, height: crop.h * s, position: 'relative', overflow: 'hidden' }}>
          <Img src={staticFile('nx/rec/10_hook_ficha/last.jpg')} style={{ position: 'absolute', width: 1920 * s, height: 1080 * s, left: -crop.x * s, top: -crop.y * s }} />
          <Cursor x={(1275 - crop.x) * s} y={(652 - crop.y) * s} scale={2.2} />
        </div>
      </div>
      <div style={{ position: 'absolute', left: 760, top: 488, padding: '12px 26px', borderRadius: 999, background: color.ink, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 34, boxShadow: shadow.float, transform: 'rotate(-3deg)' }}>Paso a paso</div>
    </Stage>
  );
};
