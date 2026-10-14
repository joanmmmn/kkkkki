import React from 'react';
import { AbsoluteFill } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { CheckIcon, CrossIcon } from '../../components/Icons';
import { InfinityIcon } from '../../components/Icons2';
import { AppPhone, AU, AU_HOT, AudibleLogo, AudibleMark, AudStage } from './kit';

// Miniatura de YouTube (1280×720) de la reseña: pregunta grande, móvil con la app real (Drácula, «audible ORIGINAL»),
// el naranja de Audible en «sin límite de horas» y el sello de 30 días gratis.
export const AUDThumb: React.FC = () => (
  <AudStage still>
    <AbsoluteFill style={{ padding: '128px 0 0 64px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <AudibleLogo width={250} />
        <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.muted, marginLeft: 6, marginTop: 6 }}>RESEÑA</span>
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
      <AppPhone image="aud/img/thumb_screen.jpg" w={300} cam={[{ f: 0, rx: 6, ry: -18, rz: 4, s: 1, x: 0, y: 0 }]} />
    </div>
    <div style={{ position: 'absolute', left: 1068, top: 112, transform: 'rotate(7deg)', width: 164, height: 164, borderRadius: '50%', background: `linear-gradient(160deg, ${AU} 0%, ${AU_HOT} 100%)`,
      boxShadow: '0 24px 60px rgba(247,120,28,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, color: '#fff' }}>
      <InfinityIcon size={74} c="#fff" />
      <div style={{ fontSize: 22, marginTop: -2, lineHeight: 1.05, textAlign: 'center' }}>sin límite<br />de horas</div>
    </div>
    <div style={{ position: 'absolute', left: 676, top: 470, transform: 'rotate(-8deg)', padding: '14px 26px', borderRadius: 22, background: color.ink, color: '#fff', boxShadow: shadow.float, fontFamily: font.sans, fontWeight: 700, fontSize: 40, display: 'flex', alignItems: 'center', gap: 14 }}>
      <AudibleMark size={40} /> 30 días <span style={{ color: color.yellow }}>GRATIS</span>
    </div>
  </AudStage>
);
