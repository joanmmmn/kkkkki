import React from 'react';
import { AbsoluteFill } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { CheckIcon, CrossIcon } from '../../components/Icons';
import { AB, AB_HOT, AbcLogo, AbcStage, AppPhone, CreditCoin } from './kit';

// Miniatura de YouTube (1280×720) de la reseña: pregunta grande, móvil con la app real (Los tres mundos, de Posteguillo, que aquí
// entra con un crédito), el sello «1 crédito = 1 libro para siempre» y «30 días GRATIS · 3 audiolibros».
export const ABCThumb: React.FC = () => (
  <AbcStage still>
    <AbsoluteFill style={{ padding: '120px 0 0 64px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <AbcLogo width={300} />
        <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.muted, marginLeft: 4, marginTop: 6 }}>RESEÑA</span>
      </div>
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 112, letterSpacing: -4.5, lineHeight: 0.96, color: color.ink, marginTop: 30 }}>¿MERECE</div>
      <div style={{ position: 'relative', display: 'inline-block', alignSelf: 'flex-start', marginTop: 4 }}>
        <div style={{ position: 'absolute', left: -10, right: -10, bottom: 10, height: 52, background: color.yellow, borderRadius: 12, transform: 'skewX(-8deg)' }} />
        <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 700, fontSize: 112, letterSpacing: -4.5, lineHeight: 0.96, color: color.ink }}>LA PENA?</div>
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 999, background: '#fff', boxShadow: shadow.soft, fontFamily: font.sans, fontWeight: 700, fontSize: 30 }}><CheckIcon size={34} /> Lo bueno</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 999, background: '#fff', boxShadow: shadow.soft, fontFamily: font.sans, fontWeight: 700, fontSize: 30 }}><CrossIcon size={34} /> Lo malo</div>
      </div>
    </AbsoluteFill>
    <div style={{ position: 'absolute', left: 790, top: 46 }}>
      <AppPhone image="abc/img/thumb_screen.jpg" w={300} cam={[{ f: 0, rx: 6, ry: -18, rz: 4, s: 1, x: 0, y: 0 }]} />
    </div>
    <div style={{ position: 'absolute', left: 1052, top: 104, transform: 'rotate(7deg)', width: 180, height: 180, borderRadius: '50%', background: '#fff', border: `6px solid ${AB}`,
      boxShadow: '0 24px 60px rgba(255,80,28,0.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, color: color.ink }}>
      <CreditCoin size={64} />
      <div style={{ fontSize: 22, marginTop: 8, lineHeight: 1.05, textAlign: 'center' }}>1 crédito =<br />tuyo para<br />siempre</div>
    </div>
    <div style={{ position: 'absolute', left: 640, top: 474, transform: 'rotate(-8deg)', padding: '14px 26px', borderRadius: 22, background: color.ink, color: '#fff', boxShadow: shadow.float, fontFamily: font.sans, fontWeight: 700, fontSize: 40, display: 'flex', alignItems: 'center', gap: 14 }}>
      <span style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(160deg, ${AB_HOT} 0%, ${AB} 100%)`, display: 'inline-block' }} />
      <span>30 días <span style={{ color: color.yellow }}>GRATIS</span> · 3 libros</span>
    </div>
  </AbcStage>
);

// Variante B: pregunta directa sobre el precio en dólares y el inglés, con la pantalla real de la cuenta gratuita («over 10,000 free audiobooks»).
export const ABCThumbB: React.FC = () => (
  <AbcStage still>
    <AbsoluteFill style={{ padding: '110px 0 0 64px' }}>
      <AbcLogo width={300} />
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 96, letterSpacing: -4, lineHeight: 0.98, color: color.ink, marginTop: 34 }}>¿VALE LA PENA</div>
      <div style={{ position: 'relative', display: 'inline-block', alignSelf: 'flex-start', marginTop: 6 }}>
        <div style={{ position: 'absolute', left: -10, right: -10, bottom: 8, height: 46, background: color.yellow, borderRadius: 12, transform: 'skewX(-8deg)' }} />
        <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 700, fontSize: 96, letterSpacing: -4, lineHeight: 0.98, color: color.ink }}>EN ESPAÑA?</div>
      </div>
      <div style={{ display: 'flex', gap: 14, marginTop: 34 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 999, background: '#fff', boxShadow: shadow.soft, fontFamily: font.sans, fontWeight: 700, fontSize: 30 }}>14,95 $ al mes</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 999, background: '#fff', boxShadow: shadow.soft, fontFamily: font.sans, fontWeight: 700, fontSize: 30 }}>App en inglés</div>
      </div>
    </AbsoluteFill>
    <div style={{ position: 'absolute', left: 820, top: 46 }}>
      <AppPhone image="abc/img/thumb_screen_b.jpg" w={300} cam={[{ f: 0, rx: 6, ry: -18, rz: 4, s: 1, x: 0, y: 0 }]} />
    </div>
    <div style={{ position: 'absolute', left: 560, top: 486, transform: 'rotate(-7deg)', padding: '14px 26px', borderRadius: 22, background: color.ink, color: '#fff', boxShadow: shadow.float, fontFamily: font.sans, fontWeight: 700, fontSize: 38, display: 'flex', alignItems: 'center', gap: 12 }}>
      <span>+10.000 audiolibros <span style={{ color: color.yellow }}>GRATIS</span></span>
    </div>
  </AbcStage>
);
