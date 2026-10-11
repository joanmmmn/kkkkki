import React from 'react';
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { LogoIcon } from '../../components/Logo';
import { BrowserWindow } from '../../components/BrowserWindow';
import { ScreenClip } from '../../components/ScreenClip';
import { Highlight } from '../../components/Highlight';
import { Sfx } from '../../components/Sfx';
import { synthCursor } from '../../lib/synth';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { IcCalendar, IcCard, IcCheck, IcPhone } from '../er/icons';
import { ERLogo } from './X01Hook';
import { ER_REVIEW_STEPS } from './config';
import { itemAt, w } from './timeline';
import REVIEW from '../../../public/er/web/review_meta.json';

const ID = 'X13';
const BW = 1440;
// Botón «Empezar prueba gratuita» de la tarjeta fija de la reseña (captura de los pasos, coordenadas de la ventana).
const [CX, CY, CW, CH] = REVIEW.steps.btn;
const [SX, SY, SW, SH] = REVIEW.steps.stick;

// Marcador de pasos en la parte superior: el paso activo se ilumina y los anteriores quedan marcados.
const Steps: React.FC<{ at: number[]; out: number }> = ({ at, out }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const labels = ['Empezar prueba', 'Crea tu cuenta', 'Ultra + tarjeta', 'Hoy, 0 €'];
  const s = spring({ frame: frame - at[0] + 6, fps, config: { damping: 18, stiffness: 160 } });
  const o = interpolate(frame, [out - 8, out + 4], [0, 1], clamp);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 44, display: 'flex', justifyContent: 'center', gap: 14, opacity: s * (1 - o), transform: `translateY(${(1 - s) * -30}px)` }}>
      {labels.map((l, i) => {
        const on = frame >= at[i] - 4 && (i === labels.length - 1 || frame < at[i + 1] - 4);
        const done = i < labels.length - 1 && frame >= at[i + 1] - 4;
        const p = spring({ frame: frame - at[i] + 4, fps, config: { damping: 14, stiffness: 200 } });
        return (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px 12px 12px', borderRadius: 999, fontFamily: font.sans, fontSize: 30, fontWeight: 700,
            background: on ? color.ink : '#fff', color: on ? '#fff' : done ? color.ink : color.muted, boxShadow: on ? shadow.float : shadow.soft, transform: `scale(${on ? 1 + 0.04 * p : 1})` }}>
            <span style={{ width: 42, height: 42, borderRadius: 21, display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? color.green : on ? color.yellow : '#EFEFEF', color: color.ink, fontSize: 24 }}>
              {done ? <IcCheck size={26} c="#fff" w={3} /> : i + 1}
            </span>
            {l}
          </div>
        );
      })}
    </div>
  );
};

// X13 · Final rápido: los pasos (empezar, cuenta, Ultra y tarjeta, 0 € hoy) y ¿te quedas o cancelas?
export const X13Fast: React.FC<{ lead: number; dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const C = itemAt(ID, 'W14C'), D = itemAt(ID, 'W15');
  const c = (word: string, n = 0) => w(ID, 'W14C', word, n);
  const d = (word: string, n = 0) => w(ID, 'W15', word, n);
  const fEmp = c('Empezar'), fGrat = c('gratuita'), fCrea = c('crea'), fElige = c('elige'), fUltra = c('Ultra'), fTarj = c('tarjeta'), fHoy = c('hoy'), f0 = c('0');
  const sp = (f: number, dd = 15, st = 170) => spring({ frame: frame - f, fps, config: { damping: dd, stiffness: st } });
  // Paso 1: clic en «Empezar prueba gratuita» de la reseña y en el botón naranja de la oferta.
  const cut1 = fGrat - 4;
  const revCursor = synthCursor([CX + CW * 0.62 + 40, CY + CH * 0.55 + 30], [{ t: (fEmp - 10) / fps, x: CX + CW * 0.55, y: CY + CH * 0.5, dur: 0.25, click: true }]);
  const clickRev = fEmp - 10 + Math.round(0.25 * fps) + 3;
  const offCursor = synthCursor([1180, 640], [{ t: (fCrea - cut1 - 26) / fps, x: 960, y: 414, dur: 0.32, click: true }]);
  const clickOff = cut1 + fCrea - cut1 - 26 + Math.round(0.32 * fps) + 3;
  const swipe = (at: number) => interpolate(frame, [at - 5, at + 5], [0, 1], { ...clamp, easing: easeInOut });
  const s1 = swipe(cut1), s2 = swipe(fCrea);
  const winOut = interpolate(frame, [fElige - 8, fElige + 6], [0, 1], { ...clamp, easing: easeInOut });
  const win = sp(C - 8, 20, 150);
  // Paso 3 y 4: Ultra + tarjeta → hoy 0 €
  const ultra = sp(fUltra - 8), card = sp(fTarj - 8), zero = sp(f0 - 2, 9, 230);
  const payOut = interpolate(frame, [D - 10, D + 4], [0, 1], { ...clamp, easing: easeInOut });
  // W15: ¿te quedas o cancelas?
  const fGusta = d('gusta'), fQued = d('Quedate'), f15 = d('15'), fNo = d('No'), fCanc = d('Cancela'), f30 = d('30'), fNada = d('nada');
  const L = sp(fGusta - 6, 18, 160), R = sp(fNo - 6, 18, 160);
  const stamp15 = sp(f15, 9, 230), stamp0 = sp(fNada - 2, 9, 230);
  const dimL = interpolate(frame, [fNo - 4, fNo + 10], [0, 1], clamp);
  return (
    <Stage tone="warm">
      {frame < fElige + 8 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 70 }}>
          <div style={{ opacity: win * (1 - winOut), transform: `translateY(${(1 - win) * 60}px) scale(${(0.95 + 0.05 * win) * (1 - 0.06 * winOut)})`, filter: winOut > 0.01 ? `blur(${winOut * 8}px)` : undefined }}>
            <BrowserWindow width={BW} url={frame < cut1 + 2 ? 'sonorbooks.com/es/blog/elevenreader-resena' : 'elevenreader.io'}>
              <div style={{ position: 'absolute', inset: 0, transform: `translateX(${-s1 * 100}%)` }}>
                <ScreenClip src={ER_REVIEW_STEPS} image width={BW} cursor={revCursor} camera={[{ f: 0, zoom: 1.85, x: SX + SW / 2, y: SY + SH / 2 + 12 }]} dim={0.38}
                  marks={[{ from: -20, to: cut1 + 6, x: CX - 8, y: CY - 8, w: CW + 16, h: CH + 16, r: 34 }]} />
              </div>
              <div style={{ position: 'absolute', inset: 0, transform: `translateX(${(1 - s1) * 100 - s2 * 100}%)` }}>
                <Sequence from={cut1 - 6} layout="none">
                  <ScreenClip src="er/rec/02_oferta/first.jpg" image width={BW} cursor={offCursor.map((p) => ({ ...p, t: p.t + 6 / fps }))}
                    camera={[{ f: 0, zoom: 1.5, x: 960, y: 420 }, { f: 30, zoom: 1.75, x: 960, y: 420 }]} dim={0.4}
                    marks={[{ from: 6, to: fCrea - cut1 + 12, x: 800, y: 386, w: 320, h: 56, r: 28, label: '30 días gratis + 15 %' }]} />
                </Sequence>
              </div>
              <div style={{ position: 'absolute', inset: 0, transform: `translateX(${(1 - s2) * 100}%)` }}>
                <Sequence from={fCrea - 6} layout="none">
                  <ScreenClip src="er/rec/02_oferta/signup.jpg" image width={BW} camera={[{ f: 0, zoom: 1.7, x: 960, y: 540 }]} dim={0.2}
                    marks={[
                      { from: 6, to: 18, x: 780, y: 452, w: 360, h: 40, r: 20 },
                      { from: 18, to: 30, x: 780, y: 504, w: 360, h: 40, r: 20 },
                      { from: 30, to: 60, x: 780, y: 636, w: 360, h: 40, r: 20, label: 'Google, Apple o correo' },
                    ]} />
                </Sequence>
              </div>
            </BrowserWindow>
          </div>
        </AbsoluteFill>
      )}

      {frame >= fElige - 8 && frame < D + 8 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 90, opacity: 1 - payOut, transform: `scale(${1 - 0.05 * payOut})`, filter: payOut > 0.01 ? `blur(${payOut * 8}px)` : undefined }}>
          <div style={{ display: 'flex', gap: 36, alignItems: 'stretch' }}>
            <div style={{ width: 520, padding: '36px 40px', borderRadius: 34, background: '#fff', border: `4px solid ${color.yellow}`, boxShadow: '0 40px 90px rgba(255,202,5,0.25)', opacity: ultra, transform: `translateY(${(1 - ultra) * 60}px)`, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <ERLogo width={250} />
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 70, letterSpacing: -1.5 }}>Ultra</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: font.sans, fontSize: 32, fontWeight: 500 }}>
                <div style={{ width: 40, height: 40, borderRadius: 20, background: color.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcCheck size={26} c="#fff" w={3} /></div>
                30 días gratis
              </div>
              <div style={{ fontFamily: font.sans, fontSize: 26, color: color.ink2 }}>Mensual o anual, −15 % al pagar</div>
            </div>
            <div style={{ position: 'relative', width: 600, padding: '36px 40px', borderRadius: 34, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card, opacity: card, transform: `translateY(${(1 - card) * 60}px)`, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: font.sans, fontSize: 34, fontWeight: 700 }}><IcCard size={44} w={1.8} /> Tu tarjeta</div>
              <div style={{ height: 70, borderRadius: 16, border: `2px solid ${color.line}`, display: 'flex', alignItems: 'center', padding: '0 22px', fontFamily: font.sans, fontSize: 34, letterSpacing: 4, color: color.muted }}>•••• •••• •••• ••••</div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontFamily: font.sans, fontSize: 38, fontWeight: 500 }}>Hoy pagas</span>
                <span style={{ fontFamily: font.sans, fontSize: 104, fontWeight: 700, letterSpacing: -3, transform: `scale(${0.4 + 0.6 * zero})`, opacity: zero, display: 'inline-block' }}><Highlight start={f0 + 8} dur={10}>0 €</Highlight></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: font.sans, fontSize: 26, color: color.ink2, opacity: sp(f0 + 10) }}><IcCalendar size={30} w={2} /> El primer cobro, a los 30 días</div>
            </div>
          </div>
          <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 12, fontFamily: font.sans, fontSize: 30, color: color.ink2, opacity: sp(f0 + 18) }}>
            <IcPhone size={34} w={2} /> Luego, entra en la app con esa misma cuenta
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 22, textAlign: 'center', fontFamily: font.sans, fontSize: 21, color: color.muted, opacity: card }}>Ilustración: tus datos de pago los introduces tú en la página segura de ElevenReader</div>
        </AbsoluteFill>
      )}

      <Steps at={[C, fCrea, fElige, fHoy]} out={D} />

      {frame >= D - 8 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 44 }}>
          <div style={{ position: 'relative', width: 760, height: 560, borderRadius: 44, background: '#fff', boxShadow: shadow.card, overflow: 'hidden', padding: '56px 60px', boxSizing: 'border-box', opacity: L * (1 - 0.45 * dimL), transform: `translateX(${(1 - L) * -120 + (1 - R) * 402}px) scale(${1 - 0.04 * dimL})`, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 14, background: color.green }} />
            <div style={{ fontFamily: font.sans, fontSize: 44, fontWeight: 500, color: color.ink2 }}>¿Te gusta?</div>
            <div style={{ fontFamily: font.sans, fontSize: 120, fontWeight: 700, letterSpacing: -4, lineHeight: 1, opacity: sp(fQued - 4), transform: `scale(${0.85 + 0.15 * sp(fQued - 4)})`, transformOrigin: 'left center' }}>Quédate</div>
            <div style={{ fontFamily: font.sans, fontSize: 34, color: color.ink2, opacity: sp(fQued + 8) }}>No tienes que hacer nada</div>
            {frame >= f15 - 2 && (
              <div style={{ position: 'absolute', right: 50, bottom: 50, transform: `rotate(${-10 + 4 * stamp15}deg) scale(${2.2 - 1.2 * stamp15})`, opacity: stamp15, display: 'flex', alignItems: 'center', gap: 12, padding: '16px 30px', borderRadius: 20, background: color.yellow, boxShadow: '0 16px 40px rgba(255,202,5,0.45)', fontFamily: font.sans, fontWeight: 700, fontSize: 64 }}>
                <LogoIcon size={56} /> −15 %
              </div>
            )}
          </div>
          <div style={{ position: 'relative', width: 760, height: 560, borderRadius: 44, background: '#fff', boxShadow: shadow.card, overflow: 'hidden', padding: '56px 60px', boxSizing: 'border-box', opacity: R, transform: `translateX(${(1 - R) * 260}px)`, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 14, background: color.red }} />
            <div style={{ fontFamily: font.sans, fontSize: 44, fontWeight: 500, color: color.ink2 }}>¿No te convence?</div>
            <div style={{ fontFamily: font.sans, fontSize: 104, fontWeight: 700, letterSpacing: -3, lineHeight: 1, opacity: sp(fCanc - 4), transform: `scale(${0.85 + 0.15 * sp(fCanc - 4)})`, transformOrigin: 'left center' }}>Cancela</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, alignSelf: 'flex-start', padding: '12px 26px', borderRadius: 18, background: color.ink, color: '#fff', fontFamily: font.sans, fontSize: 40, fontWeight: 700, opacity: sp(f30 - 6), transform: `scale(${0.7 + 0.3 * sp(f30 - 6)})`, transformOrigin: 'left center' }}>
              <IcCalendar size={42} c="#fff" w={2} /> antes del día 30
            </div>
            {frame >= fNada - 4 && (
              <div style={{ position: 'absolute', right: 50, bottom: 50, transform: `rotate(${-10 + 4 * stamp0}deg) scale(${2.2 - 1.2 * stamp0})`, opacity: stamp0, padding: '16px 32px', borderRadius: 20, border: `6px solid ${color.green}`, color: color.green, fontFamily: font.sans, fontSize: 64, fontWeight: 700, background: 'rgba(255,255,255,0.95)' }}>
                Pagas 0 €
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}

      <Sfx name="mouse_click" at={clickRev} />
      <Sfx name="whip" at={cut1} />
      <Sfx name="mouse_click" at={clickOff} />
      <Sfx name="whip" at={fCrea} />
      <Sfx name="tick_soft" at={fCrea + 6} volume={0.6} />
      <Sfx name="tick_soft" at={fCrea + 18} volume={0.6} />
      <Sfx name="tick_soft" at={fCrea + 30} volume={0.6} />
      <Sfx name="swish_up" at={fElige - 6} />
      <Sfx name="pop_bright" at={fUltra - 6} />
      <Sfx name="card_flip" at={fTarj - 6} />
      <Sfx name="stamp" at={f0} />
      <Sfx name="coins" at={f0 + 6} volume={0.7} />
      <Sfx name="whoosh_fast" at={D - 6} />
      <Sfx name="swoosh_down" at={fGusta - 4} />
      <Sfx name="stamp" at={f15 + 2} volume={0.8} />
      <Sfx name="swoosh_down" at={fNo - 4} />
      <Sfx name="success" at={fNada} volume={0.7} />
      <Sfx name="stamp" at={fNada + 2} volume={0.8} />
    </Stage>
  );
};
