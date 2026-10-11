import React from 'react';
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Stage } from '../../components/Stage';
import { Sfx } from '../../components/Sfx';
import { Logo, LogoIcon } from '../../components/Logo';
import { Words, Typewriter } from '../../components/Kinetic';
import { Pill } from '../../components/Pill';
import { Phase } from '../../components/Phase';
import { BrowserWindow } from '../../components/BrowserWindow';
import { ScreenClip, CamKey } from '../../components/ScreenClip';
import { CheckIcon } from '../../components/Icons';
import { CalendarIcon, DownloadIcon } from '../../components/Icons2';
import { NextoryLogo } from '../nx/common';
import { wf } from './timeline';
import { AppPhone, BigTitle } from './kit';
import m11 from '../../../public/nx/rec/11_ficha_click/meta.json';
import c11 from '../../../public/nx/rec/11_ficha_click/cursor.json';
import c13 from '../../../public/nx/rec/13_registro/cursor.json';
import c14 from '../../../public/nx/rec/14_plan/cursor.json';
import m14 from '../../../public/nx/rec/14_plan/meta.json';
import c15 from '../../../public/nx/rec/15_pago/cursor.json';

type P = { lead: number; dur: number };

// P01 · «30 días gratis, en vez de 14»: el número rueda de 14 a 30 dentro de una insignia.
export const P01Gratis: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('P01', w, n);
  const fTreinta = at('treinta');
  const fCatorce = at('catorce');
  const roll = interpolate(frame, [fTreinta - 14, fTreinta + 8], [14, 30], { ...clamp, easing: easeOut });
  const sBadge = spring({ frame: frame - fTreinta + 16, fps, config: { damping: 12, stiffness: 150 } });
  const sLogos = spring({ frame: frame - 2, fps, config: { damping: 18, stiffness: 150 } });
  const sVez = spring({ frame: frame - fCatorce, fps, config: { damping: 16, stiffness: 180 } });
  const strike = interpolate(frame, [fCatorce + 6, fCatorce + 18], [0, 1], { ...clamp, easing: easeOut });
  const rays = frame * 0.25;
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', top: 120, display: 'flex', alignItems: 'center', gap: 26, opacity: sLogos, transform: `translateY(${(1 - sLogos) * -30}px)` }}>
          <LogoIcon size={70} />
          <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.muted }}>×</span>
          <NextoryLogo width={210} />
        </div>
        <div style={{ position: 'relative', width: 560, height: 560, transform: `scale(${sBadge})` }}>
          <svg width="560" height="560" viewBox="0 0 560 560" style={{ position: 'absolute', inset: 0, transform: `rotate(${rays}deg)` }}>
            {Array.from({ length: 24 }).map((_, i) => (
              <path key={i} d="M280 280 L 268 0 L 292 0 Z" fill={color.yellow} opacity={0.22} transform={`rotate(${i * 15} 280 280)`} />
            ))}
          </svg>
          <div style={{ position: 'absolute', inset: 70, borderRadius: '50%', background: color.yellow, boxShadow: '0 40px 100px rgba(255,202,5,0.45)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 230, letterSpacing: -10, lineHeight: 0.9, color: color.ink, fontVariantNumeric: 'tabular-nums' }}>{Math.round(roll)}</div>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 48, color: color.ink, letterSpacing: -1 }}>días gratis</div>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 130, display: 'flex', alignItems: 'center', gap: 16, fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: color.ink2, opacity: sVez, transform: `translateY(${(1 - sVez) * 30}px)` }}>
          en vez de
          <span style={{ position: 'relative', color: color.muted }}>14<span style={{ position: 'absolute', left: -8, right: -8, top: '50%', height: 6, background: color.red, borderRadius: 3, transform: `rotate(-8deg) scaleX(${strike})`, transformOrigin: 'left' }} /></span>
        </div>
      </AbsoluteFill>
      <Sfx name="riser" at={fTreinta - 4} volume={0.8} />
      <Sfx name="counter" at={fTreinta - 14} />
      <Sfx name="impact" at={fTreinta + 6} />
      <Sfx name="pencil_strike" at={fCatorce + 6} />
    </Stage>
  );
};

// Ventana de navegador inclinada en 3D (flota con un leve vaivén).
const TiltWindow: React.FC<{ width: number; url: string; ry?: number; rx?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ width, url, ry = -8, rx = 4, children, style }) => {
  const frame = useCurrentFrame();
  const wob = Math.sin(frame / 40) * 0.6;
  return (
    <div style={{ perspective: 2600, ...style }}>
      <div style={{ transform: `rotateY(${ry + wob}deg) rotateX(${rx - wob * 0.4}deg)`, transformStyle: 'preserve-3d' }}>
        <BrowserWindow width={width} url={url}>{children}</BrowserWindow>
      </div>
    </div>
  );
};

// P02 · En la ficha del audiolibro, «Empezar prueba gratuita» (grabación real de SonorBooks).
export const P02Ficha: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('P02', w, n);
  const fPulsa = at('pulsa');
  // El clic de la grabación cae justo cuando la voz dice «Empezar».
  const fEmpezar = at('empezar');
  const startAt = Math.max(0, m11.marks.click - fEmpezar / fps);
  const rf = (t: number) => Math.round((t - startAt) * fps);
  const cam: CamKey[] = [
    { f: 0, zoom: 1.12, x: 1000, y: 520 },
    { f: fPulsa - 4, zoom: 1.2, x: 1100, y: 560 },
    { f: fPulsa + 20, zoom: 2.05, x: 1275, y: 630 },
    { f: dur, zoom: 2.12, x: 1275, y: 636 },
  ];
  const s = spring({ frame, fps, config: { damping: 20, stiffness: 120 } });
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <TiltWindow width={1440} url="sonorbooks.com" ry={-6 + 4 * (1 - s)} rx={2.5} style={{ transform: `scale(${0.94 + 0.06 * s})`, opacity: s }}>
          <ScreenClip src="nx/rec/11_ficha_click/video.mp4" width={1440} startAt={startAt} cursor={c11} camera={cam}
            marks={[{ from: fPulsa + 4, to: dur + 6, x: 973, y: 624, w: 604, h: 47, r: 24 }]} />
        </TiltWindow>
      </AbsoluteFill>
      <Sfx name="whoosh_soft" at={2} volume={0.8} />
      <Sfx name="zoom_in" at={fPulsa} />
      <Sfx name="click" at={rf(m11.marks.click)} />
    </Stage>
  );
};

// P03 · Cuenta, plan y tarjeta: tres ventanas en abanico; la que nombra la voz pasa delante. «Hoy: 0 €».
export const P03Pasos: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('P03', w, n);
  const fCuenta = at('cuenta');
  const fPlan = at('plan');
  const fTarjeta = at('tarjeta');
  const fHoy = at('hoy');
  const active = frame < fPlan - 4 ? 0 : frame < fTarjeta - 4 ? 1 : 2;
  const W = 1180;
  const cards = [
    { label: 'Crea tu cuenta', src: 'nx/rec/13_registro/video.mp4', still: 'nx/rec/13_registro/first.jpg', cursor: c13, startAt: 0, cam: [{ f: 0, zoom: 2.0, x: 960, y: 330 }] as CamKey[] },
    { label: 'Elige tu plan', src: 'nx/rec/14_plan/video.mp4', still: 'nx/rec/14_plan/planform.jpg', cursor: c14, startAt: m14.marks.planform + 0.2, cam: [{ f: 0, zoom: 1.9, x: 960, y: 430 }] as CamKey[] },
    { label: 'Añade tu tarjeta', src: 'nx/rec/15_pago/video.mp4', still: 'nx/rec/15_pago/first.jpg', cursor: c15, startAt: 0.2, cam: [{ f: 0, zoom: 2.2, x: 960, y: 250 }] as CamKey[] },
  ];
  const starts = [fCuenta, fPlan, fTarjeta];
  const clipFrom = (i: number) => (i === 0 ? 0 : starts[i] - 16);
  const sHoy = spring({ frame: frame - fHoy, fps, config: { damping: 10, stiffness: 210 } });
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        {cards.map((c, i) => {
          // Posición en el abanico respecto a la tarjeta activa (−1 detrás a la izquierda, +1 detrás a la derecha).
          const rel = i - active;
          const p = interpolate(frame, [starts[Math.max(0, Math.min(2, active))] - 4, starts[Math.max(0, Math.min(2, active))] + 12], [0, 1], { ...clamp, easing: easeInOut });
          const appear = spring({ frame: frame - (i === 0 ? fCuenta - 8 : starts[i] - 16), fps, config: { damping: 18, stiffness: 140 } });
          const x = rel * 420;
          const scale = rel === 0 ? 1 : 0.78;
          const z = rel === 0 ? 3 : 2 - Math.abs(rel);
          return (
            <div key={c.label} style={{ position: 'absolute', zIndex: z, transform: `translateX(${x * (rel === 0 ? 1 : p)}px) scale(${scale})`, opacity: appear * (rel === 0 ? 1 : 0.55), filter: rel === 0 ? undefined : 'blur(2px) saturate(0.7)', transition: 'none' }}>
              <div style={{ position: 'absolute', top: -76, left: 0, display: 'flex', alignItems: 'center', gap: 14, fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink }}>
                <span style={{ width: 54, height: 54, borderRadius: '50%', background: rel === 0 ? color.yellow : '#fff', border: rel === 0 ? 'none' : `2px solid ${color.line}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                {c.label}
              </div>
              <TiltWindow width={W} url="nextory.com" ry={rel * -7} rx={2}>
                {frame >= clipFrom(i) ? (
                  <Sequence from={clipFrom(i)} layout="none">
                    <ScreenClip src={c.src} width={W} startAt={c.startAt} cursor={c.cursor} camera={c.cam} showCursor={rel === 0} />
                  </Sequence>
                ) : (
                  <ScreenClip image src={c.still} width={W} camera={c.cam} showCursor={false} />
                )}
              </TiltWindow>
            </div>
          );
        })}
        {frame >= fHoy - 2 && (
          <div style={{ position: 'absolute', right: 300, top: 640, zIndex: 10, transform: `rotate(-8deg) scale(${sHoy})`, padding: '22px 40px', borderRadius: 30, background: color.green, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 64, boxShadow: '0 30px 70px rgba(31,157,85,0.4)', display: 'flex', alignItems: 'center', gap: 18 }}>
            <CheckIcon size={64} c="#fff" fg={color.green} /> Hoy: 0 €
          </div>
        )}
      </AbsoluteFill>
      <Sfx name="whoosh_soft" at={fCuenta - 6} />
      <Sfx name="swipe" at={fPlan - 4} />
      <Sfx name="swipe" at={fTarjeta - 4} />
      <Sfx name="stamp" at={fHoy + 2} />
    </Stage>
  );
};

// P04 · Descarga la app y entra con tu correo.
export const P04App: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('P04', w, n);
  const fDesc = at('descarga');
  const fEntra = at('entra');
  const fDisf = at('disfrutar');
  const sB = spring({ frame: frame - fDesc, fps, config: { damping: 15, stiffness: 160 } });
  const sE = spring({ frame: frame - fEntra, fps, config: { damping: 15, stiffness: 160 } });
  const sD = spring({ frame: frame - fDisf, fps, config: { damping: 12, stiffness: 180 } });
  return (
    <Stage tone="warm">
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: 1120, top: 100 }}>
          <AppPhone shots={[{ rec: '00_bienvenida', at: 0, start: 0.2 }, { rec: '00_login', at: Math.max(8, fEntra - 14), start: 0.6 }, { rec: '01_inicio', at: fDisf - 6, start: 0.3 }]} w={410}
            cam={[{ f: 0, rx: 10, ry: -30, rz: 4, s: 0.9, x: 80, y: 40 }, { f: 26, rx: 3, ry: -12, rz: 1, s: 1, x: 0, y: 0 }, { f: dur, rx: 2, ry: -8, rz: 0.5, s: 1.02, x: 0, y: -4 }]} />
        </div>
        <div style={{ position: 'absolute', left: 170, top: 300, width: 860 }}>
          <BigTitle text="Descarga la app" hi="app" at={fDesc - 4} size={100} />
          <div style={{ display: 'flex', gap: 20, marginTop: 40, opacity: sB, transform: `translateY(${(1 - sB) * 30}px)` }}>
            {['App Store', 'Google Play'].map((s) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 28px', borderRadius: 20, background: color.ink, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 34 }}>
                <DownloadIcon size={36} c="#fff" />{s}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 34, fontFamily: font.sans, fontWeight: 500, fontSize: 40, color: color.ink2, opacity: sE, transform: `translateY(${(1 - sE) * 20}px)` }}>
            Entra con tu correo y tu contraseña
          </div>
          <div style={{ marginTop: 26, opacity: sD, transform: `scale(${0.8 + 0.2 * sD})`, transformOrigin: 'left center' }}>
            <Pill size={42}>¡A disfrutar!</Pill>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx name="ui_pop" at={fDesc} />
      <Sfx name="phone_tap" at={fEntra} />
      <Sfx name="sparkle" at={fDisf} />
    </Stage>
  );
};

// P05 · ¿Te ha gustado? Quédate. ¿No? Cancela antes del día 30 (mejor en los últimos días).
export const P05Decide: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('P05', w, n);
  const fGusta = at('gustado');
  const fQuedate = at('quedate');
  const fConv = at('convence');
  const fMis = at('mis');
  const fUlt = at('ultimos');
  const fPierdes = at('pierdes');
  const sL = spring({ frame: frame - fGusta + 4, fps, config: { damping: 16, stiffness: 150 } });
  const sQ = spring({ frame: frame - fQuedate, fps, config: { damping: 11, stiffness: 200 } });
  const sR = spring({ frame: frame - fConv + 4, fps, config: { damping: 16, stiffness: 150 } });
  const sM = spring({ frame: frame - fMis, fps, config: { damping: 16, stiffness: 170 } });
  const sW = spring({ frame: frame - fPierdes, fps, config: { damping: 14, stiffness: 180 } });
  const best = interpolate(frame, [fUlt - 2, fUlt + 16], [0, 1], { ...clamp, easing: easeOut });
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const box = (s: number, children: React.ReactNode, bg = '#fff') => (
    <div style={{ width: 760, minHeight: 640, borderRadius: 44, background: bg, boxShadow: shadow.card, border: `1px solid ${color.line}`, padding: '48px 50px', opacity: s, transform: `translateY(${(1 - s) * 60}px)`, boxSizing: 'border-box' }}>{children}</div>
  );
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 56, paddingTop: 50 }}>
        {box(sL, (
          <>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 56, color: color.ink, letterSpacing: -1.5 }}>¿Te ha gustado?</div>
            <div style={{ marginTop: 70, display: 'flex', alignItems: 'center', gap: 26, transform: `scale(${0.7 + 0.3 * sQ})`, transformOrigin: 'left center', opacity: sQ }}>
              <CheckIcon size={110} />
              <div>
                <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 84, color: color.ink, letterSpacing: -3, lineHeight: 1 }}>Quédate</div>
                <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 34, color: color.ink2, marginTop: 10 }}>No tienes que hacer nada</div>
              </div>
            </div>
          </>
        ))}
        {box(sR, (
          <>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 56, color: color.ink, letterSpacing: -1.5 }}>¿No te convence?</div>
            <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 14, fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.ink, opacity: sM }}>
              <CalendarIcon size={44} /> Cancela en «Mis páginas»
            </div>
            <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 8 }}>
              {days.map((d) => {
                const hot = d >= 27 && d <= 29;
                const last = d === 30;
                const ds = interpolate(frame, [fMis + d * 0.8, fMis + d * 0.8 + 8], [0, 1], clamp);
                return (
                  <div key={d} style={{ height: 50, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 22,
                    background: hot ? `rgba(255,202,5,${0.25 + 0.75 * best})` : last ? '#FDECEC' : '#F4F4F4', color: last ? color.red : color.ink, opacity: ds, transform: `scale(${hot ? 1 + 0.1 * best : 1})` }}>
                    {d}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 18, display: 'flex', justifyContent: 'flex-end', fontFamily: font.sans, fontWeight: 700, fontSize: 28, color: color.ink, opacity: best }}>
              Mejor aquí, en los últimos días ↑
            </div>
            <div style={{ marginTop: 22, padding: '16px 22px', borderRadius: 20, background: '#FDECEC', color: color.red, fontFamily: font.sans, fontWeight: 700, fontSize: 30, opacity: sW, transform: `translateY(${(1 - sW) * 20}px)` }}>
              Al cancelar, pierdes el acceso al momento
            </div>
          </>
        ))}
      </AbsoluteFill>
      <Sfx name="ui_pop" at={fGusta} />
      <Sfx name="success" at={fQuedate} volume={0.8} />
      <Sfx name="ui_pop" at={fConv} />
      <Sfx name="tick_soft" at={fMis} />
      <Sfx name="marker" at={fUlt} />
      <Sfx name="hit_soft" at={fPierdes} />
    </Stage>
  );
};

// P06 · Cierre de marca con espacio libre para la pantalla final de YouTube.
export const P06Outro: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('P06', w, n);
  const fPrecio = at('precio');
  const fSonor = at('sonorbooks');
  const typeAt = lead + 6;
  const end = fSonor + 30;
  return (
    <Stage tone="warm">
      <Phase from={0} to={end + 2}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 56 }}>
          <Logo size={120} delay={2} />
          <div style={{ width: 1160, height: 104, borderRadius: 999, background: '#fff', boxShadow: shadow.float, border: `1px solid ${color.line}`, display: 'flex', alignItems: 'center', padding: '0 18px 0 46px', gap: 24 }}>
            <svg width="38" height="38" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" stroke={color.ink} strokeWidth="2.4" fill="none" /><path d="M15.5 15.5 L21 21" stroke={color.ink} strokeWidth="2.4" strokeLinecap="round" /></svg>
            <div style={{ flex: 1, fontFamily: font.sans, fontSize: 42, color: color.ink }}>
              <Typewriter text="Tu próximo libro" start={typeAt} cps={20} />
            </div>
          </div>
          <div style={{ fontFamily: font.sans, fontSize: 34, color: color.ink2, opacity: spring({ frame: frame - fPrecio, fps }) }}>Dónde escucharlo, y a qué precio</div>
        </AbsoluteFill>
      </Phase>
      <Phase from={end} to={dur} out={1}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 170, flexDirection: 'column', gap: 34, background: '#fff' }}>
          <Logo size={150} animate={false} />
          <Words text="Tu próxima historia te está esperando." start={2} stagger={4} size={62} weight={500} />
          <div style={{ opacity: spring({ frame: frame - end - 30, fps }) }}><Pill size={40}>sonorbooks.com</Pill></div>
          <div style={{ fontFamily: font.sans, fontSize: 21, color: color.muted, marginTop: -6, opacity: spring({ frame: frame - end - 50, fps }) }}>
            Enlace de afiliado: si contratas, SonorBooks puede recibir una comisión, sin coste para ti.
          </div>
        </AbsoluteFill>
      </Phase>
      <Sfx name="whoosh_deep" at={0} volume={0.7} />
      <Sfx name="logo_sting" at={4} />
      <Sfx name="typing" at={typeAt} trimAfter={50} />
      <Sfx name="logo_sting" at={end + 2} volume={0.6} />
    </Stage>
  );
};
