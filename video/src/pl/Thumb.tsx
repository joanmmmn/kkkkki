import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { color, font, shadow } from '../brand/tokens';
import { CheckIcon, CrossIcon } from '../components/Icons';
import { Icon, MpStage, PlatformLogo, PlatformTile } from './kit';
import type { IconName, PlatformSpec } from './types';

// Miniatura de YouTube (1280×720) de las reseñas polacas, con la estructura de las de España:
// marca + «RECENZJA», pregunta grande con la palabra clave subrayada, «Plusy / Minusy», captura en un móvil o ventana,
// un sello redondo con el dato clave y una etiqueta negra inclinada (prueba gratis, precio…).
export type ThumbSpec = {
  line1: string; line2: string; // «CZY WARTO» / «PŁACIĆ?»
  screen?: string; // public/pl/<pieza>/img/thumb_screen.jpg (captura vertical 430×932 o 1920×1080)
  screenMobile?: boolean;
  seal?: { icon: IconName; text: string }; // sello redondo (\n para dos líneas)
  label?: { strong: string; rest: string }; // etiqueta negra: «14 dni» + «ZA DARMO»
  pros?: [string, string]; // por defecto «Plusy», «Minusy»
  kicker?: string; // por defecto «RECENZJA» (en las guías: «PORADNIK»)
};

export const PLThumb: React.FC<{ spec: PlatformSpec; t: ThumbSpec }> = ({ spec, t }) => (
  <MpStage still tint={spec.color}>
    <AbsoluteFill style={{ padding: '120px 0 0 64px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, height: 70 }}>
        <PlatformLogo spec={spec} width={Math.min(300, 64 / spec.logoRatio)} />
        <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.muted, marginLeft: 6, marginTop: 6 }}>{t.kicker ?? 'RECENZJA'}</span>
      </div>
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 104, letterSpacing: -4, lineHeight: 0.96, color: color.ink, marginTop: 30 }}>{t.line1}</div>
      <div style={{ position: 'relative', display: 'inline-block', alignSelf: 'flex-start', marginTop: 4 }}>
        <div style={{ position: 'absolute', left: -10, right: -10, bottom: 10, height: 50, background: color.yellow, borderRadius: 12, transform: 'skewX(-8deg)' }} />
        <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 700, fontSize: 104, letterSpacing: -4, lineHeight: 0.96, color: color.ink }}>{t.line2}</div>
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 34 }}>
        {[0, 1].map((k) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 999, background: '#fff', boxShadow: shadow.soft, fontFamily: font.sans, fontWeight: 700, fontSize: 30 }}>
            {k ? <CrossIcon size={34} /> : <CheckIcon size={34} />} {(t.pros ?? ['Plusy', 'Minusy'])[k]}
          </div>
        ))}
      </div>
    </AbsoluteFill>
    {t.screen ? (
      t.screenMobile !== false ? (
        <div style={{ position: 'absolute', left: 800, top: 44, width: 290, height: 628, borderRadius: 44, background: '#111', padding: 10, boxSizing: 'border-box', transform: 'perspective(1600px) rotateY(-16deg) rotateZ(4deg)', boxShadow: '0 40px 90px rgba(16,16,16,0.35)' }}>
          <Img src={staticFile(t.screen)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', borderRadius: 36 }} />
        </div>
      ) : (
        <div style={{ position: 'absolute', left: 700, top: 120, width: 640, height: 360, borderRadius: 18, overflow: 'hidden', transform: 'perspective(1600px) rotateY(-14deg) rotateZ(3deg)', boxShadow: '0 40px 90px rgba(16,16,16,0.3)' }}>
          <Img src={staticFile(t.screen)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
        </div>
      )
    ) : (
      <div style={{ position: 'absolute', left: 840, top: 150, transform: 'rotate(6deg)' }}><PlatformTile spec={spec} size={330} /></div>
    )}
    {t.seal && (
      <div style={{ position: 'absolute', left: 1060, top: 104, transform: 'rotate(7deg)', width: 176, height: 176, borderRadius: '50%', background: spec.color, boxShadow: `0 24px 60px ${spec.color}66`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, color: spec.tileLogoWhite === false ? color.ink : '#fff' }}>
        <Icon name={t.seal.icon} size={64} c={spec.tileLogoWhite === false ? color.ink : '#fff'} />
        <div style={{ fontSize: 24, marginTop: 2, lineHeight: 1.05, textAlign: 'center', whiteSpace: 'pre-line' }}>{t.seal.text}</div>
      </div>
    )}
    {t.label && (
      <div style={{ position: 'absolute', left: 676, top: 470, transform: 'rotate(-8deg)', padding: '14px 26px', borderRadius: 22, background: color.ink, color: '#fff', boxShadow: shadow.float, fontFamily: font.sans, fontWeight: 700, fontSize: 40, display: 'flex', alignItems: 'center', gap: 14 }}>
        <PlatformTile spec={spec} size={46} style={{ boxShadow: 'none' }} /> {t.label.strong} <span style={{ color: color.yellow }}>{t.label.rest}</span>
      </div>
    )}
  </MpStage>
);
