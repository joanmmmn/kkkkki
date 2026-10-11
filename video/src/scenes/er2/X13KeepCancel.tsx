import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { LogoIcon } from '../../components/Logo';
import { CheckIcon } from '../../components/Icons';
import { Sfx } from '../../components/Sfx';
import { IcCalendar } from '../er/icons';
import { clamp, easeOut } from '../../lib/anim';
import { Crop, st } from './AppView';
import { w } from './timeline';

const ID = 'X13';

// X13 · ¿Te gusta? Quédate (−15 % los primeros meses). ¿No? Cancela antes del día 30 en la facturación de tu cuenta.
export const X13KeepCancel: React.FC<{ lead: number; dur: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w(ID, 'W15', word, n);
  const fQued = at('Quedate');
  const fNada = at('nada,');
  const fPrim = at('primeros');
  const fNo = at('convence') - 8;
  const fCanc = at('Cancela');
  const f30 = at('30');
  const fFact = at('facturacion');
  const fPag = at('pagaras', 1);
  const sp = (f: number, d = 16, s = 160) => spring({ frame: frame - f, fps, config: { damping: d, stiffness: s } });
  const L = sp(0, 20, 140);
  const R = sp(fNo, 20, 140);
  const dimL = interpolate(frame, [fNo, fNo + 14], [1, 0.55], clamp);
  const ring = interpolate(frame, [fFact + 6, fFact + 30], [0, 1], { ...clamp, easing: easeOut });
  const stamp = sp(fPag + 2, 9, 220);
  const panel = (accent: string, s: number, o: number, children: React.ReactNode, width = 800) => (
    <div style={{ width, height: 700, boxSizing: 'border-box', padding: '44px 52px', borderRadius: 40, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card, opacity: s * o, transform: `translateY(${(1 - s) * 60}px) scale(${0.96 + 0.04 * s})`, display: 'flex', flexDirection: 'column', gap: 26, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 12, background: accent }} />
      {children}
    </div>
  );
  const bullet = (f: number, text: React.ReactNode, icon: React.ReactNode) => {
    const s = sp(f, 14, 180);
    return <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: font.sans, fontSize: 40, fontWeight: 500, opacity: s, transform: `translateX(${(1 - s) * -30}px)` }}>{icon}{text}</div>;
  };
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 46 }}>
        {panel(color.green, L, dimL, (
          <>
            <div style={{ fontFamily: font.sans, fontSize: 40, fontWeight: 500, color: color.ink2 }}>¿Te ha gustado?</div>
            <div style={{ fontFamily: font.sans, fontSize: 92, fontWeight: 700, letterSpacing: -2, lineHeight: 1, opacity: sp(fQued - 4), transform: `scale(${0.85 + 0.15 * sp(fQued - 4)})`, transformOrigin: 'left center' }}>Quédate</div>
            <div style={{ fontFamily: font.sans, fontSize: 32, color: color.ink2, marginTop: -10, opacity: sp(fQued + 10) }}>con la suscripción: no hace falta cancelar</div>
            <div style={{ height: 1, background: color.line, margin: '8px 0' }} />
            {bullet(fNada - 10, 'No tienes que hacer nada', <CheckIcon size={48} />)}
            {bullet(fPrim - 6, <span>Los primeros meses, <b>−15 %</b></span>, <div style={{ width: 48, height: 48, borderRadius: 24, background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LogoIcon size={30} /></div>)}
          </>
        ), 660)}
        {panel(color.red, R, 1, (
          <>
            <div style={{ fontFamily: font.sans, fontSize: 40, fontWeight: 500, color: color.ink2 }}>¿No te convence?</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 22, opacity: sp(fCanc - 4), transform: `scale(${0.85 + 0.15 * sp(fCanc - 4)})`, transformOrigin: 'left center' }}>
              <div style={{ fontFamily: font.sans, fontSize: 80, fontWeight: 700, letterSpacing: -2, lineHeight: 1 }}>Cancela</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 22px', borderRadius: 18, background: color.ink, color: '#fff', fontFamily: font.sans, fontSize: 34, fontWeight: 700, opacity: sp(f30 - 4), transform: `scale(${0.7 + 0.3 * sp(f30 - 4)})` }}><IcCalendar size={36} c="#fff" w={2} /> antes del día 30</div>
            </div>
            <div style={{ position: 'relative', marginTop: 6, borderRadius: 20, overflow: 'hidden', border: `1px solid ${color.line}`, boxShadow: shadow.soft, opacity: sp(fFact - 8), transform: `translateY(${(1 - sp(fFact - 8)) * 30}px)` }}>
              <Crop src={st('acc')} x={530} y={56} w={862} h={180} width={882} />
              {/* «Manage billing» = facturación de tu cuenta */}
              <div style={{ position: 'absolute', left: (1236 - 530) * (882 / 862), top: (171 - 56) * (882 / 862), width: 146 * (882 / 862), height: 52 * (882 / 862), borderRadius: 14, border: `5px solid ${color.yellow}`, boxShadow: `0 0 ${24 * ring}px ${color.yellow}`, opacity: ring }} />
            </div>
            <div style={{ fontFamily: font.sans, fontSize: 28, color: color.muted, marginTop: -8, opacity: sp(fFact) }}>Tu cuenta → «Manage billing» (facturación)</div>
            {frame >= fPag - 2 && (
              <div style={{ position: 'absolute', right: 40, bottom: 34, transform: `rotate(${-10 + 4 * stamp}deg) scale(${2.2 - 1.2 * stamp})`, opacity: stamp, padding: '14px 30px', borderRadius: 16, border: `5px solid ${color.green}`, color: color.green, fontFamily: font.sans, fontSize: 48, fontWeight: 700, background: 'rgba(255,255,255,0.92)' }}>
                Pagas 0 €
              </div>
            )}
          </>
        ), 990)}
      </AbsoluteFill>
      <Sfx name="card_flip" at={2} />
      <Sfx name="success" at={fQued} volume={0.6} />
      <Sfx name="tick" at={fNada - 10} />
      <Sfx name="ui_pop" at={fPrim - 6} />
      <Sfx name="card_flip" at={fNo} />
      <Sfx name="ui_pop" at={f30 - 4} />
      <Sfx name="focus" at={fFact} />
      <Sfx name="stamp" at={fPag + 4} />
    </Stage>
  );
};
