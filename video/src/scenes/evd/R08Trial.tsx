import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phase } from '../../components/Phase';
import { Words } from '../../components/Kinetic';
import { Sfx } from '../../components/Sfx';
import { wordFrame } from '../../lib/vo';
import { clamp, easeInOut } from '../../lib/anim';
import { CardIcon, Count, LaptopIcon, PhoneIcon, Pop, RenewIcon, ShotWindow, WarnIcon } from './ui';

const DayCard: React.FC<{ icon: React.ReactNode; where: string; days: number; at: number; bad?: boolean }> = ({ icon, where, days, at, bad }) => (
  <Pop at={at}>
    <div style={{ width: 560, height: 470, boxSizing: 'border-box', background: bad ? '#FFF3F3' : '#fff', borderRadius: 40, boxShadow: shadow.card, border: `${bad ? 4 : 1}px solid ${bad ? color.red : color.line}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: font.sans }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 44, fontWeight: 700, color: color.ink2 }}>{icon} {where}</div>
      <div style={{ fontSize: 230, fontWeight: 700, lineHeight: 1, letterSpacing: -8, color: bad ? color.red : color.ink }}><Count to={days} at={at + 2} dur={18} /></div>
      <div style={{ fontSize: 50, fontWeight: 500, color: color.ink2, marginTop: -6 }}>días gratis</div>
    </div>
  </Pop>
);

// R08 · Prueba gratis: 30 días en la web y 7 en la app, con un solo libro en cualquier plan; pide tarjeta y se renueva;
// si te diste de alta en el móvil se cancela en Apple o Google, donde puede aparecer como «Scribd».
export const R08Trial: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0, fb = 0) => lead + wordFrame('R08', w, n, fb);
  const fTreinta = at('treinta', 0, 1.84);
  const fSiete = at('siete', 0, 4.68);
  const fY = at('y', 0, 5.92);
  const fUnico = at('unico', 0, 6.4);
  const fElijas = at('elijas', 0, 7.28);
  const fElijas2 = at('elijas', 1, 8.32);
  const fPide = at('Pide', 0, 9.24);
  const fRenueva = at('renueva', 0, 10.4);
  const fY2 = at('Y', 0, 11.56);
  const fApple = at('Apple', 0, 14.32);
  const fGoogle = at('Google', 0, 14.8);
  const fDonde = at('donde', 0, 15.55);
  const pB = fY - 6;
  const pC = fPide - 6;
  const pD = fY2 - 4;
  const spin = interpolate(frame, [fRenueva, fRenueva + 40], [0, 360], { ...clamp, easing: easeInOut });
  const warn = spring({ frame: frame - 2, fps, config: { damping: 10, stiffness: 200 } });
  return (
    <Stage>
      {/* A · 30 días en la web, 7 en la app */}
      <Phase from={0} to={pB}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ transform: `scale(${warn}) rotate(${(1 - warn) * -30}deg)` }}><WarnIcon size={92} /></div>
            <Words text="Ojo con la prueba gratis" start={2} size={96} weight={700} />
          </div>
          <div style={{ display: 'flex', gap: 70 }}>
            <DayCard icon={<LaptopIcon size={50} c={color.ink2} />} where="En la web" days={30} at={fTreinta - 6} />
            <DayCard icon={<PhoneIcon size={50} c={color.red} />} where="En la app" days={7} at={fSiete - 6} bad />
          </div>
        </AbsoluteFill>
      </Phase>

      {/* B · Un único desbloqueo en la prueba, elijas el plan que elijas */}
      <Phase from={pB} to={pC}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <ShotWindow src="evd/shots/plans.jpg" width={1560} url="es.everand.com/checkout/available-plans"
            camera={[
              { f: 0, zoom: 1.45, x: 960, y: 450 },
              { f: pC - pB + 10, zoom: 1.52, x: 960, y: 440 },
            ]}
            marks={[
              { from: fUnico - pB - 4, to: fElijas - pB - 4, x: 498, y: 358, w: 241, h: 57, label: '1 libro en la prueba' },
              { from: fElijas - pB - 2, to: fElijas2 - pB - 4, x: 840, y: 358, w: 240, h: 57, label: '1 libro en la prueba' },
              { from: fElijas2 - pB - 2, to: pC - pB + 6, x: 1181, y: 358, w: 241, h: 57, label: '1 libro en la prueba' },
            ]} />
        </AbsoluteFill>
      </Phase>

      {/* C · Pide tarjeta y se renueva sola */}
      <Phase from={pC} to={pD}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 60, fontFamily: font.sans }}>
          {[
            { t: 'Pide tarjeta', i: <CardIcon size={130} />, f: 4 },
            { t: 'Se renueva sola', i: <RenewIcon size={130} spin={spin} />, f: fRenueva - pC - 8 },
          ].map((c) => (
            <Pop key={c.t} at={c.f}>
              <div style={{ width: 620, height: 420, background: '#fff', borderRadius: 40, boxShadow: shadow.card, border: `1px solid ${color.line}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30 }}>
                <div style={{ width: 210, height: 210, borderRadius: 56, background: color.yellowSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.i}</div>
                <div style={{ fontSize: 66, fontWeight: 700 }}>{c.t}</div>
              </div>
            </Pop>
          ))}
        </AbsoluteFill>
      </Phase>

      {/* D · Alta desde el móvil: se cancela en Apple o Google, donde aparece como «Everand (o Scribd)» */}
      <Phase from={pD} to={dur}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <ShotWindow src="evd/shots/help_cancel.jpg" width={1560} url="support.scribd.com · Centro de ayuda de Everand"
            camera={[
              { f: 0, zoom: 1.35, x: 1140, y: 700 },
              { f: fApple - pD - 10, zoom: 1.6, x: 1150, y: 760 },
              { f: fDonde - pD, zoom: 1.6, x: 1150, y: 775 },
              { f: dur - pD, zoom: 2.0, x: 1080, y: 805 },
            ]}
            marks={[
              { from: 10, to: fApple - pD - 12, x: 790, y: 650, w: 712, h: 50, label: 'Alta en la web' },
              { from: fApple - pD - 6, to: fGoogle - pD - 4, x: 790, y: 712, w: 712, h: 52, label: 'App Store' },
              { from: fGoogle - pD - 2, to: fDonde - pD - 2, x: 790, y: 776, w: 650, h: 52, label: 'Google Play' },
              { from: fDonde - pD + 2, to: dur - pD, x: 1003, y: 800, w: 134, h: 28, r: 8, label: 'Puede aparecer como «Scribd»' },
            ]} />
        </AbsoluteFill>
      </Phase>

      <Sfx name="hit_soft" at={2} volume={0.8} />
      <Sfx name="card_flip" at={fTreinta - 4} />
      <Sfx name="counter" at={fTreinta - 4} volume={0.8} />
      <Sfx name="card_flip" at={fSiete - 4} />
      <Sfx name="fail" at={fSiete + 6} volume={0.7} />
      <Sfx name="swipe" at={pB} />
      <Sfx name="focus" at={fUnico - 4} />
      <Sfx name="tick_soft" at={fElijas - 2} />
      <Sfx name="tick_soft" at={fElijas2 - 2} />
      <Sfx name="swipe" at={pC} />
      <Sfx name="pop" at={pC + 4} />
      <Sfx name="pop" at={fRenueva - 8} />
      <Sfx name="whoosh_fast" at={fRenueva} volume={0.6} />
      <Sfx name="swipe" at={pD} />
      <Sfx name="focus" at={fApple - 6} volume={0.8} />
      <Sfx name="tick_soft" at={fGoogle - 2} />
      <Sfx name="zoom_in" at={fDonde} volume={0.8} />
      <Sfx name="marker" at={fDonde + 4} />
    </Stage>
  );
};
