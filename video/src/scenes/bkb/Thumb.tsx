import React from 'react';
import { AbsoluteFill } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { CheckIcon, CrossIcon } from '../../components/Icons';
import { ClockIcon } from '../../components/Icons2';
import { AppPhone, BB, BB_INK, BkbStage, BookBeatIcon, BookBeatLogo } from './kit';

// Miniatura de YouTube (1280×720) de la reseña: pregunta grande, móvil con la app real (el reproductor con La Bestia), la
// pegatina lila de las horas (aquí se paga por horas) y el sello de 30 días gratis.
export const BKBThumb: React.FC = () => (
  <BkbStage still>
    <AbsoluteFill style={{ padding: '128px 0 0 64px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <BookBeatLogo width={270} />
        <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.muted, marginLeft: 6, marginTop: 6 }}>RESEÑA</span>
      </div>
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 112, letterSpacing: -4.5, lineHeight: 0.96, color: color.ink, marginTop: 30 }}>¿MERECE</div>
      <div style={{ position: 'relative', display: 'inline-block', alignSelf: 'flex-start', marginTop: 4 }}>
        <div style={{ position: 'absolute', left: -10, right: -10, bottom: 10, height: 52, background: BB, borderRadius: 12, transform: 'skewX(-8deg)' }} />
        <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 700, fontSize: 112, letterSpacing: -4.5, lineHeight: 0.96, color: color.ink }}>LA PENA?</div>
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 999, background: '#fff', boxShadow: shadow.soft, fontFamily: font.sans, fontWeight: 700, fontSize: 30 }}><CheckIcon size={34} /> Lo bueno</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 999, background: '#fff', boxShadow: shadow.soft, fontFamily: font.sans, fontWeight: 700, fontSize: 30 }}><CrossIcon size={34} /> Lo malo</div>
      </div>
    </AbsoluteFill>
    <div style={{ position: 'absolute', left: 790, top: 46 }}>
      <AppPhone image="bkb/img/thumb_screen.jpg" w={300} cam={[{ f: 0, rx: 6, ry: -18, rz: 4, s: 1, x: 0, y: 0 }]} />
    </div>
    <div style={{ position: 'absolute', left: 1060, top: 104, transform: 'rotate(7deg)', width: 176, height: 176, borderRadius: '50%', background: BB,
      boxShadow: '0 24px 60px rgba(123,63,196,0.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, color: BB_INK }}>
      <ClockIcon size={64} c={BB_INK} />
      <div style={{ fontSize: 24, marginTop: 2, lineHeight: 1.05, textAlign: 'center' }}>pagas<br />por horas</div>
    </div>
    <div style={{ position: 'absolute', left: 676, top: 470, transform: 'rotate(-8deg)', padding: '14px 26px', borderRadius: 22, background: BB_INK, color: '#fff', boxShadow: shadow.float, fontFamily: font.sans, fontWeight: 700, fontSize: 40, display: 'flex', alignItems: 'center', gap: 14 }}>
      <BookBeatIcon size={44} /> 30 días <span style={{ color: BB }}>GRATIS</span>
    </div>
  </BkbStage>
);
