import React from 'react';
import { AbsoluteFill } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { CheckIcon, CrossIcon } from '../../components/Icons';
import { AppPhone, CookieIcon, Crown, Diamond, IV, IvxLogo, IvxStage, PLUS } from './kit';

// Miniatura de YouTube (1280×720) de la reseña: pregunta grande, el móvil con el muro real de ivoox.com al rechazar las cookies
// (Premium, Plus o «Aceptar y acceder gratis») y el sello «¿Gratis? *Si aceptas las cookies».
export const IVXThumb: React.FC = () => (
  <IvxStage still>
    <AbsoluteFill style={{ padding: '118px 0 0 64px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <IvxLogo width={230} />
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
    <div style={{ position: 'absolute', left: 800, top: 46 }}>
      <AppPhone image="ivx/img/thumb_screen.jpg" w={300} cam={[{ f: 0, rx: 6, ry: -18, rz: 4, s: 1, x: 0, y: 0 }]} />
    </div>
    <div style={{ position: 'absolute', left: 1040, top: 92, transform: 'rotate(8deg)', width: 196, height: 196, borderRadius: '50%', background: '#fff', border: `6px solid ${IV}`,
      boxShadow: '0 24px 60px rgba(244,95,49,0.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, color: color.ink }}>
      <CookieIcon size={62} />
      <div style={{ fontSize: 24, marginTop: 6, lineHeight: 1.05, textAlign: 'center' }}>¿Rechazas<br />las cookies?</div>
    </div>
    <div style={{ position: 'absolute', left: 612, top: 482, transform: 'rotate(-7deg)', padding: '14px 26px', borderRadius: 22, background: color.ink, color: '#fff', boxShadow: shadow.float, fontFamily: font.sans, fontWeight: 700, fontSize: 40, display: 'flex', alignItems: 'center', gap: 12 }}>
      <span>Gratis… <span style={{ color: color.yellow }}>o pagas</span></span>
    </div>
  </IvxStage>
);

// Variante B: «¿GRATIS DE VERDAD?» con la oferta real de iVoox Plus en el móvil y los dos precios.
export const IVXThumbB: React.FC = () => (
  <IvxStage still>
    <AbsoluteFill style={{ padding: '112px 0 0 64px' }}>
      <IvxLogo width={230} />
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 104, letterSpacing: -4.2, lineHeight: 0.98, color: color.ink, marginTop: 34 }}>¿GRATIS</div>
      <div style={{ position: 'relative', display: 'inline-block', alignSelf: 'flex-start', marginTop: 6 }}>
        <div style={{ position: 'absolute', left: -10, right: -10, bottom: 8, height: 48, background: color.yellow, borderRadius: 12, transform: 'skewX(-8deg)' }} />
        <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 700, fontSize: 104, letterSpacing: -4.2, lineHeight: 0.98, color: color.ink }}>DE VERDAD?</div>
      </div>
      <div style={{ display: 'flex', gap: 14, marginTop: 34 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px 10px 14px', borderRadius: 999, background: '#fff', boxShadow: shadow.soft, fontFamily: font.sans, fontWeight: 700, fontSize: 30 }}><Crown size={34} /> Premium 3,99 €</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px 10px 14px', borderRadius: 999, background: '#fff', boxShadow: shadow.soft, fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: PLUS }}><Diamond size={36} /> Plus 9,99 €</div>
      </div>
    </AbsoluteFill>
    <div style={{ position: 'absolute', left: 830, top: 46 }}>
      <AppPhone image="ivx/img/thumb_screen_b.jpg" w={300} cam={[{ f: 0, rx: 6, ry: -18, rz: 4, s: 1, x: 0, y: 0 }]} />
    </div>
  </IvxStage>
);
