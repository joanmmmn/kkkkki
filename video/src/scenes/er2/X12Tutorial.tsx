import React from 'react';
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Highlight } from '../../components/Highlight';
import { LogoIcon } from '../../components/Logo';
import { Stepper } from '../../components/Stepper';
import { BrowserWindow } from '../../components/BrowserWindow';
import { ScreenClip, CamKey } from '../../components/ScreenClip';
import { Callout } from '../../components/Callout';
import { Sfx } from '../../components/Sfx';
import { synthCursor } from '../../lib/synth';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { IcCalendar, IcCard, IcCheck } from '../er/icons';
import { app } from './AppView';
import { ERLogo } from './X01Hook';
import { itemAt, w } from './timeline';
import ficha from '../../../public/er/rec/01_ficha/meta.json';
import fichaCursor from '../../../public/er/rec/01_ficha/cursor.json';
import oferta from '../../../public/er/rec/02_oferta/meta.json';
import ofertaCursor from '../../../public/er/rec/02_oferta/cursor.json';

const ID = 'X12';
const BW = 1500;
const TOP = 150;

const Win: React.FC<{ url: string; children: React.ReactNode }> = ({ url, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 22, stiffness: 130 } });
  return (
    <AbsoluteFill style={{ alignItems: 'center', paddingTop: TOP }}>
      <div style={{ transform: `scale(${0.96 + 0.04 * s})`, opacity: s, transformOrigin: '50% 40%' }}>
        <BrowserWindow width={BW} url={url}>{children}</BrowserWindow>
      </div>
    </AbsoluteFill>
  );
};

// Paso 4 ilustrado (no es la página real): Ultra elegido, hoy 0 €, primer cobro a los 30 días.
const PayCard: React.FC<{ fUltra: number; fTarjeta: number; fHoy: number; fCobro: number }> = ({ fUltra, fTarjeta, fHoy, fCobro }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = (f: number, d = 15, s = 170) => spring({ frame: frame - f, fps, config: { damping: d, stiffness: s } });
  const bar = interpolate(frame, [fCobro - 4, fCobro + 30], [0, 1], { ...clamp, easing: easeOut });
  const zero = sp(fHoy, 10, 210);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 90 }}>
      <div style={{ display: 'flex', gap: 40, alignItems: 'stretch' }}>
        <div style={{ width: 520, padding: '36px 40px', borderRadius: 34, background: '#fff', border: `4px solid ${color.yellow}`, boxShadow: '0 40px 90px rgba(255,202,5,0.25)', opacity: sp(fUltra - 6), transform: `translateY(${(1 - sp(fUltra - 6)) * 50}px)`, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <ERLogo width={260} />
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 64, letterSpacing: -1 }}>Ultra</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: font.sans, fontSize: 32, fontWeight: 500 }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: color.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcCheck size={26} c="#fff" w={3} /></div>
            30 días gratis
          </div>
          <div style={{ fontFamily: font.sans, fontSize: 26, color: color.ink2 }}>Mensual o anual, con −15 % al pagar</div>
        </div>
        <div style={{ width: 560, padding: '36px 40px', borderRadius: 34, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card, opacity: sp(fTarjeta - 6), transform: `translateY(${(1 - sp(fTarjeta - 6)) * 50}px)`, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: font.sans, fontSize: 34, fontWeight: 700 }}><IcCard size={44} w={1.8} /> Tu tarjeta</div>
          <div style={{ height: 70, borderRadius: 16, border: `2px solid ${color.line}`, display: 'flex', alignItems: 'center', padding: '0 22px', fontFamily: font.sans, fontSize: 34, letterSpacing: 4, color: color.muted }}>•••• •••• •••• ••••</div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontFamily: font.sans, fontSize: 36, fontWeight: 500 }}>Hoy pagas</span>
            <span style={{ fontFamily: font.sans, fontSize: 88, fontWeight: 700, letterSpacing: -2, transform: `scale(${zero})`, display: 'inline-block' }}><Highlight start={fHoy + 10}>0 €</Highlight></span>
          </div>
        </div>
      </div>
      {/* Hoy → día 30: primer cobro */}
      <div style={{ width: 1120, marginTop: 50, opacity: sp(fCobro - 8), transform: `translateY(${(1 - sp(fCobro - 8)) * 30}px)` }}>
        <div style={{ position: 'relative', height: 14, borderRadius: 7, background: '#EAEAEA' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${bar * 100}%`, borderRadius: 7, background: color.yellow }} />
          <div style={{ position: 'absolute', left: -12, top: -12, width: 38, height: 38, borderRadius: 19, background: color.ink }} />
          <div style={{ position: 'absolute', right: -12, top: -12, width: 38, height: 38, borderRadius: 19, background: bar > 0.98 ? color.yellow : '#D5D5D5', border: `4px solid ${color.ink}`, boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, fontFamily: font.sans, fontSize: 32 }}>
          <span style={{ fontWeight: 700 }}>Hoy · 0 €</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700 }}><IcCalendar size={34} w={2} /> Día 30 · primer cobro</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// X12 · Tutorial exprés: 30 días gratis en vez de 3, en cinco pasos.
export const X12Tutorial: React.FC<{ lead: number; dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const B = itemAt(ID, 'W14B'), C = itemAt(ID, 'W14C'), D = itemAt(ID, 'W14D'), E = itemAt(ID, 'W14E');
  const fA30 = w(ID, 'W14A', '30');
  const fA3 = w(ID, 'W14A', '3', 1);
  // B · ficha: el clic de la grabación cae en «Empezar».
  const fEmp = w(ID, 'W14B', 'Empezar') - B;
  const bStart = Math.max(0, ficha.marks.click - (fEmp + 2) / fps);
  const camB: CamKey[] = [
    { f: 0, zoom: 1.3, x: 1150, y: 520 },
    { f: Math.max(1, fEmp - 30), zoom: 1.75, x: 1275, y: 540 },
    { f: fEmp + 6, zoom: 2.0, x: 1275, y: 585 },
  ];
  // C · oferta: clic en el botón naranja al decir «naranja»; después, registro con Google, Apple o correo.
  const fNar = w(ID, 'W14C', 'naranja') - C;
  const fGoogle = w(ID, 'W14C', 'Google') - C;
  const fApple = w(ID, 'W14C', 'Apple') - C;
  const fCorreo = w(ID, 'W14C', 'correo') - C;
  const play = Math.max(0, fNar + 6 - Math.round(oferta.marks.click_cta * fps));
  const cut = play + Math.round(oferta.marks.click_cta * fps) + 9;
  const camC: CamKey[] = [{ f: 0, zoom: 1.75, x: 960, y: 400 }, { f: cut, zoom: 1.9, x: 960, y: 410 }];
  const signCursor = synthCursor([960, 414], [
    { t: (fGoogle - cut - 14) / fps, x: 1030, y: 472, dur: 0.4 },
    { t: (fApple - cut - 12) / fps, x: 1030, y: 524, dur: 0.36 },
    { t: (fCorreo - cut - 14) / fps, x: 1060, y: 656, dur: 0.4 },
  ]);
  // D · Ultra + tarjeta (ilustrado)
  const fUltra = w(ID, 'W14D', 'Ultra');
  const fTarj = w(ID, 'W14D', 'tarjeta');
  const fHoy = w(ID, 'W14D', 'hoy');
  const fCobro = w(ID, 'W14D', 'primer');
  // E · app
  const fMisma = w(ID, 'W14E', 'misma');
  const steps = [
    { label: 'SonorBooks', at: B },
    { label: 'Oferta', at: C },
    { label: 'Cuenta', at: w(ID, 'W14C', 'crea') },
    { label: 'Ultra y tarjeta', at: D },
    { label: 'App', at: E },
  ];
  // A · 3 días → 30 días
  const c30 = spring({ frame: frame - fA30 + 4, fps, config: { damping: 13, stiffness: 170 } });
  const c3 = spring({ frame: frame - fA3 + 2, fps, config: { damping: 16, stiffness: 170 } });
  const strike = interpolate(frame, [fA3 + 6, fA3 + 16], [0, 1], { ...clamp, easing: easeOut });
  const aOut = interpolate(frame, [B - 8, B + 4], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <Stage tone="warm">
      {frame < B + 6 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 60, opacity: 1 - aOut, transform: `scale(${1 + 0.05 * aOut})`, filter: `blur(${aOut * 8}px)` }}>
          <ERLogo width={380} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 56 }}>
            <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 700, fontSize: 110, color: color.muted, letterSpacing: -3, opacity: c3, transform: `scale(${0.8 + 0.2 * c3})` }}>
              3 días
              <div style={{ position: 'absolute', left: -8, right: -8, top: '55%', height: 10, borderRadius: 5, background: color.red, transformOrigin: 'left center', transform: `scaleX(${strike}) rotate(-4deg)` }} />
            </div>
            <div style={{ padding: '30px 50px', borderRadius: 36, background: color.yellowSoft, border: `4px solid ${color.yellow}`, opacity: c30, transform: `scale(${0.85 + 0.15 * c30})` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: font.sans, fontWeight: 700, fontSize: 30 }}><LogoIcon size={38} /> Con SonorBooks</div>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 130, letterSpacing: -4, lineHeight: 1.05 }}>30 días <Highlight start={fA30 + 14} dur={12}>gratis</Highlight></div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      <Sequence from={B} durationInFrames={C - B + 4} layout="none">
        <Win url="sonorbooks.com">
          <ScreenClip src="er/rec/01_ficha/video.mp4" width={BW} startAt={bStart} cursor={fichaCursor} camera={camB}
            marks={[{ from: 10, to: fEmp - 4, x: 955, y: 392, w: 640, h: 152, r: 20, label: 'Recomendación: ElevenReader' }, { from: fEmp - 2, to: C - B + 4, x: 973, y: 550, w: 604, h: 47, r: 24, label: 'Empezar prueba gratuita' }]} />
        </Win>
      </Sequence>

      <Sequence from={C} durationInFrames={D - C + 4} layout="none">
        <Win url={'elevenreader.io'}>
          <Sequence durationInFrames={Math.max(1, play)} layout="none">
            <ScreenClip src="er/rec/02_oferta/first.jpg" image width={BW} cursor={[{ ...ofertaCursor[0], t: 0 }]} startAt={0} camera={camC}
              marks={[{ from: 4, to: fNar + 6, x: 800, y: 386, w: 320, h: 56, r: 28, label: '30 días gratis + 15 %' }]} />
          </Sequence>
          <Sequence from={play} durationInFrames={Math.max(1, cut - play)} layout="none">
            <ScreenClip src="er/rec/02_oferta/video.mp4" width={BW} startAt={0} cursor={ofertaCursor} camera={camC.map((k) => ({ ...k, f: k.f - play }))}
              marks={[{ from: 0, to: cut - play, x: 800, y: 386, w: 320, h: 56, r: 28, label: '30 días gratis + 15 %' }]} />
          </Sequence>
          <Sequence from={cut} layout="none">
            <ScreenClip src="er/rec/02_oferta/signup.jpg" image width={BW} startAt={0} cursor={signCursor}
              camera={[{ f: 0, zoom: 1.6, x: 960, y: 440 }, { f: 18, zoom: 1.6, x: 960, y: 520 }]}
              marks={[
                { from: fGoogle - cut - 2, to: fApple - cut - 2, x: 780, y: 452, w: 360, h: 40, r: 20 },
                { from: fApple - cut, to: fCorreo - cut - 2, x: 780, y: 504, w: 360, h: 40, r: 20 },
                { from: fCorreo - cut, to: D - cut + 4, x: 780, y: 636, w: 360, h: 40, r: 20 },
              ]} />
          </Sequence>
        </Win>
      </Sequence>

      <Sequence from={D} durationInFrames={E - D + 4} layout="none">
        <PayCard fUltra={fUltra - D} fTarjeta={fTarj - D} fHoy={fHoy - D} fCobro={fCobro - D} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 26, textAlign: 'center', fontFamily: font.sans, fontSize: 22, color: color.muted }}>Ilustración: tus datos de pago los introduces tú en la página segura de ElevenReader</div>
      </Sequence>

      <Sequence from={E} layout="none">
        <Win url="elevenreader.io">
          <ScreenClip src={app('23_install_app')} image width={BW} startAt={0}
            camera={[{ f: 0, zoom: 1.0, x: 960, y: 540 }, { f: 30, zoom: 1.45, x: 640, y: 560 }]}
            marks={[{ from: 14, to: dur - E + 6, x: 246, y: 442, w: 262, h: 52, r: 12, label: 'iPhone y Android' }]} />
        </Win>
      </Sequence>
      <Callout at={fMisma - 4} until={dur + 10} x={960} y={958} anchor="center" size={40} dark>Entra con la misma cuenta</Callout>

      <Stepper steps={steps} show={B - 4} />
      <Sfx name="pencil_strike" at={fA3 + 6} />
      <Sfx name="snap_in" at={fA30} />
      <Sfx name="click" at={B + Math.round((ficha.marks.click - bStart) * fps)} />
      <Sfx name="click" at={C + play + Math.round(oferta.marks.click_cta * fps)} />
      <Sfx name="tick_soft" at={C + fGoogle} volume={0.6} />
      <Sfx name="tick_soft" at={C + fApple} volume={0.6} />
      <Sfx name="tick_soft" at={C + fCorreo} volume={0.6} />
      <Sfx name="ui_pop" at={fUltra - 6} />
      <Sfx name="card_flip" at={fTarj - 6} />
      <Sfx name="coins" at={fHoy} volume={0.6} />
      <Sfx name="whoosh_soft" at={fCobro - 6} />
      <Sfx name="ui_pop" at={fMisma - 4} />
    </Stage>
  );
};
