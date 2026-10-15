import React from 'react';
import { AbsoluteFill } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { CheckIcon, CrossIcon } from '../../components/Icons';
import { ClockIcon } from '../../components/Icons2';
import { AppPhone, SP, SP_INK, SpoStage, SpotifyLogo } from './kit';

// Miniatura de YouTube (1280×720) de la reseña: pregunta grande, móvil con la app real (la ficha de Reina Roja, «Incluido con
// Premium»), la pegatina verde de las 12 horas al mes y la píldora oscura «Incluidos en Premium».
export const SPOThumb: React.FC = () => (
  <SpoStage still>
    <AbsoluteFill style={{ padding: '118px 0 0 64px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <SpotifyLogo width={250} />
        <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.muted, marginLeft: 6, marginTop: 4 }}>AUDIOLIBROS</span>
      </div>
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 112, letterSpacing: -4.5, lineHeight: 0.96, color: color.ink, marginTop: 30 }}>¿MERECEN</div>
      <div style={{ position: 'relative', display: 'inline-block', alignSelf: 'flex-start', marginTop: 4 }}>
        <div style={{ position: 'absolute', left: -10, right: -10, bottom: 10, height: 52, background: SP, borderRadius: 12, transform: 'skewX(-8deg)' }} />
        <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 700, fontSize: 112, letterSpacing: -4.5, lineHeight: 0.96, color: color.ink }}>LA PENA?</div>
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 999, background: '#fff', boxShadow: shadow.soft, fontFamily: font.sans, fontWeight: 700, fontSize: 30 }}><CheckIcon size={34} /> Lo bueno</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 999, background: '#fff', boxShadow: shadow.soft, fontFamily: font.sans, fontWeight: 700, fontSize: 30 }}><CrossIcon size={34} /> Lo malo</div>
      </div>
    </AbsoluteFill>
    <div style={{ position: 'absolute', left: 790, top: 46 }}>
      <AppPhone image="spo/img/thumb_screen.jpg" w={300} cam={[{ f: 0, rx: 6, ry: -18, rz: 4, s: 1, x: 0, y: 0 }]} />
    </div>
    <div style={{ position: 'absolute', left: 1060, top: 104, transform: 'rotate(7deg)', width: 176, height: 176, borderRadius: '50%', background: SP,
      boxShadow: '0 24px 60px rgba(19,137,61,0.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, color: SP_INK }}>
      <ClockIcon size={60} c={SP_INK} />
      <div style={{ fontSize: 30, marginTop: 2, lineHeight: 1.0, textAlign: 'center' }}>12 h<br /><span style={{ fontSize: 22 }}>al mes</span></div>
    </div>
    <div style={{ position: 'absolute', left: 660, top: 478, transform: 'rotate(-8deg)', padding: '14px 26px', borderRadius: 22, background: SP_INK, color: '#fff', boxShadow: shadow.float, fontFamily: font.sans, fontWeight: 700, fontSize: 36, display: 'flex', alignItems: 'center', gap: 12 }}>
      <CheckIcon size={40} c={SP} fg={SP_INK} /> Incluidos en <span style={{ color: SP }}>Premium</span>
    </div>
  </SpoStage>
);
