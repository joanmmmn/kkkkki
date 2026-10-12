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
import { CheckIcon, HeadphonesIcon } from '../../components/Icons';
import { CalendarIcon, DocIcon, DownloadIcon, LinkIcon } from '../../components/Icons2';
import { NextoryLogo } from '../nx/common';
import { wf } from './timeline';
import { AppPhone, BigTitle, Burst, Chip, LinkBadge, MaskTitle, PhoneHalo, PhoneKey } from './kit';
import { TiltWindow } from './Verdict';
import type { SceneProps } from './registry';
import m11 from '../../../public/nx/rec/11_ficha_click/meta.json';
import m00 from '../../../public/nx/rec/00_home/meta.json';
import c00 from '../../../public/nx/rec/00_home/cursor.json';
import m22 from '../../../public/nx/rec/22_plataformas/meta.json';
import c22 from '../../../public/nx/rec/22_plataformas/cursor.json';
import c11 from '../../../public/nx/rec/11_ficha_click/cursor.json';
import c13 from '../../../public/nx/rec/13_registro/cursor.json';
import c14 from '../../../public/nx/rec/14_plan/cursor.json';
import m14 from '../../../public/nx/rec/14_plan/meta.json';
import c15 from '../../../public/nx/rec/15_pago/cursor.json';

type P = SceneProps;

// P01 · «30 días gratis, en vez de 14»: el número rueda de 14 a 30 dentro de una insignia.
export const P01Gratis: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('P01', w, n);
  const fTreinta = at('treinta');
  const fCatorce = at('catorce');
  const fSonor = at('sonorbooks');
  const roll = interpolate(frame, [fTreinta - 14, fTreinta + 8], [14, 30], { ...clamp, easing: easeOut });
  // La insignia entra con «SonorBooks» marcando 14 y sube a 30 cuando la voz dice «treinta».
  const sBadge = spring({ frame: frame - Math.min(fSonor + 4, fTreinta - 16), fps, config: { damping: 12, stiffness: 150 } });
  const sLogos = spring({ frame: frame - 2, fps, config: { damping: 18, stiffness: 150 } });
  // Los logos empiezan grandes en el centro y suben a su sitio cuando entra la insignia.
  const lift = interpolate(frame, [fSonor - 8, fSonor + 10], [0, 1], { ...clamp, easing: easeInOut });
  const sVez = spring({ frame: frame - fCatorce, fps, config: { damping: 16, stiffness: 180 } });
  const strike = interpolate(frame, [fCatorce + 6, fCatorce + 18], [0, 1], { ...clamp, easing: easeOut });
  const rays = frame * 0.25;
  // Golpe al llegar a 30: la insignia late y sale una ráfaga de confeti.
  const bump = interpolate(frame, [fTreinta + 4, fTreinta + 9, fTreinta + 26], [0, 1, 0], { ...clamp, easing: easeOut });
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', top: 120, display: 'flex', alignItems: 'center', gap: 26, opacity: sLogos, transform: `translateY(${(1 - sLogos) * -30 + (1 - lift) * 330}px) scale(${1 + 0.8 * (1 - lift)})` }}>
          <LogoIcon size={70} />
          <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.muted }}>×</span>
          <NextoryLogo width={210} />
        </div>
        <div style={{ position: 'relative', width: 560, height: 560, transform: `scale(${sBadge * (1 + 0.07 * bump)})` }}>
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
        <div style={{ position: 'absolute', bottom: 150, display: 'flex', alignItems: 'center', gap: 18, fontFamily: font.sans, fontWeight: 700, fontSize: 58, color: color.ink2, opacity: sVez, transform: `translateY(${(1 - sVez) * 30}px)` }}>
          en vez de
          <span style={{ position: 'relative', color: color.muted }}>14<span style={{ position: 'absolute', left: -8, right: -8, top: '50%', height: 6, background: color.red, borderRadius: 3, transform: `rotate(-8deg) scaleX(${strike})`, transformOrigin: 'left' }} /></span>
        </div>
        <Burst at={fTreinta + 6} x={960} y={540} r={205} seed="p01" />
        {/* Letra pequeña de la oferta */}
        <div style={{ position: 'absolute', bottom: 84, fontFamily: font.sans, fontWeight: 500, fontSize: 31, color: color.ink2, opacity: sVez }}>
          Hasta 15 h de lectura y escucha · solo cuentas nuevas
        </div>
      </AbsoluteFill>
      <Sfx name="riser" at={fTreinta - 4} volume={0.8} />
      <Sfx name="counter" at={fTreinta - 14} />
      <Sfx name="impact" at={fTreinta + 6} />
      <Sfx name="pencil_strike" at={fCatorce + 6} />
      <Sfx name="sparkle" at={fTreinta + 8} volume={0.8} />
    </Stage>
  );
};

// P02 · Tres accesos a la prueba desde SonorBooks (grabaciones reales): portada, ficha de un libro y comparativa de plataformas.
// Primero las tres ventanas pequeñas en fila; luego un carrusel: la que nombra la voz pasa al centro y se acerca a su botón.
const ACCESS = [
  { label: 'Portada', src: 'nx/rec/00_home/video.mp4', still: 'nx/rec/00_home/first.jpg', cursor: c00, url: 'sonorbooks.com' },
  { label: 'Ficha del libro', src: 'nx/rec/11_ficha_click/video.mp4', still: 'nx/rec/11_ficha_click/first.jpg', cursor: c11, url: 'sonorbooks.com/es/audiolibro/…' },
  { label: 'Comparativa', src: 'nx/rec/22_plataformas/video.mp4', still: 'nx/rec/22_plataformas/first.jpg', cursor: c22, url: 'sonorbooks.com/es/plataformas' },
];
export const P02Accesos: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('P02', w, n);
  const fTres = at('tres');
  const fPortada = at('portada');
  const fFicha = at('ficha');
  const fComp = at('comparativa');
  const fDejamos = at('dejamos');
  const fEnlace = at('enlace');
  const fResena = at('resena');
  const id = React.useId().replace(/:/g, '');
  const steps = [fPortada - 8, fFicha - 8, fComp - 8];
  // p: −1 = las tres en fila; 0, 1, 2 = ventana activa en el carrusel.
  const pAt = (f: number) => interpolate(f, [steps[0], steps[0] + 18, steps[1], steps[1] + 18, steps[2], steps[2] + 18], [-1, 0, 0, 1, 1, 2], { ...clamp, easing: easeInOut });
  const p = pAt(frame);
  // Desenfoque de movimiento horizontal mientras el carrusel gira (proporcional a la velocidad).
  const mb = Math.min(22, Math.abs(p - pAt(frame - 1)) * 900 * 0.3);
  const q = Math.max(0, Math.min(1, p + 1));
  const W = 1200;
  const H = W * 9 / 16 + Math.round(W * 0.03);
  // Cámaras y marcas de cada grabación, relativas al momento en que pasa a ser la activa.
  const clips = [
    {
      from: steps[0] - 4, startAt: 1.45, rate: 1.3,
      cam: [{ f: 0, zoom: 1.05, x: 960, y: 560 }, { f: 22, zoom: 1.7, x: 470, y: 690 }, { f: 120, zoom: 1.85, x: 470, y: 700 }] as CamKey[],
      marks: [{ from: Math.round(((m00.marks.to_btn - 1.45) / 1.3) * fps) + 30, to: 200, x: 333, y: 753, w: 254, h: 54, r: 27 }],
    },
    {
      from: steps[1] - 4, startAt: 1.15, rate: 1,
      cam: [{ f: 0, zoom: 1.1, x: 1000, y: 560 }, { f: 24, zoom: 1.75, x: 1260, y: 600 }, { f: 200, zoom: 1.85, x: 1270, y: 610 }] as CamKey[],
      marks: [{ from: Math.round((m11.marks.click - 1.15) * fps) - 6, to: 220, x: 973, y: 624, w: 604, h: 47, r: 24 }],
    },
    {
      from: steps[2] - 4, startAt: 0.95, rate: 1,
      cam: [
        { f: 0, zoom: 1.15, x: 1100, y: 520 }, { f: 30, zoom: 1.35, x: 1170, y: 540 },
        { f: Math.round((m22.marks.click_card + 0.5 - 0.95) * fps), zoom: 1.25, x: 1100, y: 560 },
        { f: Math.round((m22.marks.to_offer - 0.95) * fps), zoom: 1.45, x: 1150, y: 640 },
        { f: Math.round((m22.marks.click_offer - 0.95) * fps), zoom: 2.0, x: 1300, y: 712 },
        { f: 400, zoom: 2.05, x: 1300, y: 712 },
      ] as CamKey[],
      marks: [
        { from: Math.round((m22.marks.click_card - 0.95) * fps) - 26, to: Math.round((m22.marks.click_card - 0.95) * fps) + 4, x: 1060, y: 506, w: 230, h: 48, r: 24 },
        { from: Math.round((m22.marks.click_offer - 0.95) * fps) - 22, to: 400, x: 1280, y: 696, w: 178, h: 50, r: 25 },
      ],
    },
  ];
  const sHead = spring({ frame: frame - 2, fps, config: { damping: 18, stiffness: 150 } });
  return (
    <Stage tone="warm">
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 46, display: 'flex', justifyContent: 'center', opacity: sHead }}>
          <MaskTitle text="Actívalos desde 3 sitios" hi="3" at={4} size={64} align="center" />
        </div>
        {ACCESS.map((a, i) => {
          const appear = spring({ frame: frame - (fTres - 6 + i * 5), fps, config: { damping: 16, stiffness: 150 } });
          // Fila inicial (pequeñas) → carrusel (la activa grande en el centro, las otras a los lados).
          const xRow = 960 + (i - 1) * 620;
          const d = i - Math.max(0, p);
          const xCar = 960 + d * 900;
          const sRow = 0.46;
          const sCar = interpolate(Math.abs(d), [0, 1], [1, 0.5], clamp);
          const x = xRow + (xCar - xRow) * q;
          const sc = sRow + (sCar - sRow) * q;
          const ry = -d * 26 * q;
          const dimV = q * interpolate(Math.abs(d), [0, 1], [0, 1], clamp);
          const active = q > 0.5 && Math.abs(d) < 0.5;
          const done = i < Math.round(Math.max(0, p)) && q > 0.5;
          const clip = clips[i];
          const playing = frame >= clip.from && Math.abs(d) < 1;
          return (
            <div key={a.label} style={{ position: 'absolute', left: x - W / 2, top: 600 - H / 2, width: W, height: H, zIndex: 10 - Math.round(Math.abs(d) * 3),
              transform: `translateY(${(1 - appear) * 80}px) scale(${sc * (0.85 + 0.15 * appear)})`, opacity: appear * (1 - 0.45 * dimV),
              filter: [mb > 0.4 && q > 0.02 ? `url(#mb${id})` : '', dimV > 0.05 ? `blur(${(dimV * 2.5).toFixed(2)}px)` : ''].filter(Boolean).join(' ') || undefined }}>
              <div style={{ position: 'absolute', left: 0, right: 0, top: -110 / Math.max(0.42, sc), display: 'flex', justifyContent: 'center', transform: `scale(${1 / Math.max(0.42, sc) * 0.95})`, transformOrigin: '50% 100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 26px 10px 12px', borderRadius: 999, background: active ? color.yellow : '#fff', border: active ? 'none' : `1px solid ${color.line}`, boxShadow: shadow.float,
                  fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink, whiteSpace: 'nowrap' }}>
                  <span style={{ width: 56, height: 56, borderRadius: '50%', background: active ? color.ink : color.yellow, color: active ? color.yellow : color.ink, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
                    {done ? <svg width="30" height="30" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" stroke={color.ink} strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg> : i + 1}
                  </span>
                  {a.label}
                </div>
              </div>
              <TiltWindow width={W} url={a.url} ry={ry} rx={2}>
                {playing ? (
                  <Sequence from={clip.from} layout="none">
                    <ScreenClip src={a.src} width={W} startAt={clip.startAt} playbackRate={clip.rate} cursor={a.cursor} camera={clip.cam} marks={clip.marks} showCursor={Math.abs(d) < 0.5} markDim={0.6} />
                  </Sequence>
                ) : (
                  <ScreenClip image src={frame < clip.from ? a.still : a.src.replace(/video\.mp4$/, 'last.jpg')} width={W} showCursor={false}
                    camera={frame < clip.from ? [{ f: 0, zoom: 1, x: 960, y: 540 }] : [clip.cam[clip.cam.length - 1]]} />
                )}
              </TiltWindow>
            </div>
          );
        })}
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs><filter id={`mb${id}`} x="-5%" y="0" width="110%" height="100%"><feGaussianBlur stdDeviation={`${mb.toFixed(1)} 0`} /></filter></defs>
        </svg>
        {/* En la descripción: el enlace directo y la reseña escrita (aparecen cuando la voz los nombra). */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 28, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, zIndex: 20 }}>
          <LinkBadge at={fDejamos - 3} label="En la descripción" size={34} reserve />
          <Chip at={fEnlace - 3} label="Enlace directo" icon={<LinkIcon size={30} />} size={34} reserve />
          <Chip at={fResena - 3} label="Reseña completa por escrito" icon={<DocIcon size={30} />} size={34} reserve />
        </div>
      </AbsoluteFill>
      <Sfx name="ui_pop" at={fTres - 6} />
      <Sfx name="ui_pop" at={fTres - 1} />
      <Sfx name="ui_pop" at={fTres + 4} />
      {steps.map((f, i) => <Sfx key={i} name="swipe" at={f + 4} volume={0.9} />)}
      <Sfx name="click" at={clips[1].from + Math.round((m11.marks.click - 1.15) * fps)} />
      <Sfx name="click" at={clips[2].from + Math.round((m22.marks.click_card - 0.95) * fps)} />
      <Sfx name="click" at={clips[2].from + Math.round((m22.marks.click_offer - 0.95) * fps)} />
      <Sfx name="ui_pop" at={fDejamos - 3} volume={0.8} />
      <Sfx name="ui_pop" at={fEnlace - 3} volume={0.7} />
      <Sfx name="sparkle" at={fResena - 2} volume={0.8} />
    </Stage>
  );
};

// P03 · Cuenta, plan y tarjeta: carrusel de tres ventanas; la que nombra la voz pasa al centro (las otras, detrás a los lados).
// «Hoy: 0 €» se estampa al final.
const STEP_CHECK = <svg width="28" height="28" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" stroke={color.yellow} strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>;
export const P03Pasos: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('P03', w, n);
  const fCuenta = at('cuenta');
  const fPlan = at('plan');
  const fTarjeta = at('tarjeta');
  const fHoy = at('hoy');
  const id = React.useId().replace(/:/g, '');
  const W = 1180;
  const cards = [
    { label: 'Crea tu cuenta', src: 'nx/rec/13_registro/video.mp4', still: 'nx/rec/13_registro/first.jpg', cursor: c13, startAt: 0, cam: [{ f: 0, zoom: 2.0, x: 960, y: 330 }] as CamKey[] },
    { label: 'Elige tu plan', src: 'nx/rec/14_plan/video.mp4', still: 'nx/rec/14_plan/planform.jpg', cursor: c14, startAt: m14.marks.planform + 0.2, cam: [{ f: 0, zoom: 1.9, x: 960, y: 430 }] as CamKey[] },
    { label: 'Añade tu tarjeta', src: 'nx/rec/15_pago/video.mp4', still: 'nx/rec/15_pago/first.jpg', cursor: c15, startAt: 0.2, cam: [{ f: 0, zoom: 2.2, x: 960, y: 250 }] as CamKey[] },
  ];
  const starts = [fCuenta, fPlan, fTarjeta];
  const clipFrom = (i: number) => (i === 0 ? 0 : starts[i] - 16);
  // a: ventana activa (continua) → cada ventana se coloca según su distancia a la activa.
  const aAt = (f: number) => interpolate(f, [fPlan - 8, fPlan + 10, fTarjeta - 8, fTarjeta + 10], [0, 1, 1, 2], { ...clamp, easing: easeInOut });
  const a = aAt(frame);
  const mb = Math.min(20, Math.abs(a - aAt(frame - 1)) * 470 * 0.32);
  const sHoy = spring({ frame: frame - fHoy, fps, config: { damping: 10, stiffness: 210 } });
  return (
    <Stage tone="warm">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs><filter id={`p3${id}`} x="-5%" y="0" width="110%" height="100%"><feGaussianBlur stdDeviation={`${mb.toFixed(1)} 0`} /></filter></defs>
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        {cards.map((c, i) => {
          const rel = i - a;
          const ar = Math.abs(rel);
          // La primera ventana ya está al empezar (entra con el barrido de la escena); las otras asoman detrás poco después.
          const appear = i === 0 ? 1 : spring({ frame: frame - Math.min(starts[i] - 16, fCuenta + 2 + i * 6), fps, config: { damping: 18, stiffness: 140 } });
          const scale = interpolate(ar, [0, 1], [1, 0.78], clamp);
          const vis = interpolate(ar, [0, 1, 1.5], [1, 0.55, 0], clamp);
          const soft = Math.min(1, ar);
          const active = ar < 0.5;
          const done = i < Math.round(a);
          const filters = [mb > 0.4 ? `url(#p3${id})` : '', soft > 0.03 ? `blur(${(soft * 2).toFixed(2)}px) saturate(${(1 - 0.3 * soft).toFixed(3)})` : ''].filter(Boolean).join(' ');
          return (
            <div key={c.label} style={{ position: 'absolute', zIndex: 10 - Math.round(ar * 3), transform: `translateX(${rel * 470}px) translateY(${(1 - appear) * 70}px) scale(${scale * (0.9 + 0.1 * appear)})`,
              opacity: appear * vis, filter: filters || undefined }}>
              <div style={{ position: 'absolute', top: -92, left: 0, display: 'flex', alignItems: 'center', gap: 14, padding: '8px 26px 8px 10px', borderRadius: 999,
                background: active ? color.yellow : '#fff', border: active ? 'none' : `1px solid ${color.line}`, boxShadow: shadow.float,
                fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink, whiteSpace: 'nowrap' }}>
                <span style={{ width: 54, height: 54, borderRadius: '50%', background: active ? color.ink : done ? color.ink : color.yellow, color: active ? color.yellow : color.ink,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>{done ? STEP_CHECK : i + 1}</span>
                {c.label}
              </div>
              <TiltWindow width={W} url="nextory.com" ry={-rel * 7} rx={2}>
                {frame >= clipFrom(i) ? (
                  <Sequence from={clipFrom(i)} layout="none">
                    <ScreenClip src={c.src} width={W} startAt={c.startAt} cursor={c.cursor} camera={c.cam} showCursor={active} />
                  </Sequence>
                ) : (
                  <ScreenClip image src={c.still} width={W} camera={c.cam} showCursor={false} />
                )}
              </TiltWindow>
            </div>
          );
        })}
        {frame >= fHoy - 2 && (
          <div style={{ position: 'absolute', right: 300, top: 640, zIndex: 20, transform: `rotate(${-8 - 6 * (1 - sHoy)}deg) scale(${(1.6 - 0.6 * sHoy) * Math.min(1, sHoy * 1.4)})`, opacity: Math.min(1, sHoy * 2),
            padding: '22px 40px', borderRadius: 30, background: color.green, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 64, boxShadow: '0 30px 70px rgba(31,157,85,0.4)', display: 'flex', alignItems: 'center', gap: 18 }}>
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
  const sB = (k: number) => spring({ frame: frame - fDesc - k * 5, fps, config: { damping: 14, stiffness: 170 } });
  const sE = spring({ frame: frame - fEntra + 2, fps, config: { damping: 15, stiffness: 160 } });
  const cam: PhoneKey[] = [{ f: 0, rx: 10, ry: -30, rz: 4, s: 0.9, x: 80, y: 40 }, { f: 26, rx: 3, ry: -12, rz: 1, s: 1, x: 0, y: 0 }, { f: dur, rx: 2, ry: -8, rz: 0.5, s: 1.02, x: 0, y: -4 }];
  return (
    <Stage tone="warm">
      <AbsoluteFill>
        <PhoneHalo cam={cam} cx={1340} cy={559} strength={0.9} />
        <div style={{ position: 'absolute', left: 1120, top: 100 }}>
          <AppPhone shots={[{ rec: '00_bienvenida', at: 0, start: 0.2 }, { rec: '00_login', at: Math.max(8, fEntra - 14), start: 0.6 }, { rec: '01_inicio', at: fDisf - 6, start: 0.3 }]} w={410}
            cam={cam} float={[20, dur + 24]} />
        </div>
        <div style={{ position: 'absolute', left: 170, top: 300, width: 860 }}>
          <MaskTitle text="Descarga la app" hi="app" at={fDesc - 4} size={104} />
          <div style={{ display: 'flex', gap: 20, marginTop: 40 }}>
            {['App Store', 'Google Play'].map((st, k) => {
              const sk = sB(k);
              return (
                <div key={st} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 28px', borderRadius: 20, background: color.ink, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 34,
                  opacity: sk, transform: `translateY(${(1 - sk) * 34}px) scale(${0.9 + 0.1 * sk})`, boxShadow: '0 18px 40px rgba(16,16,16,0.18)' }}>
                  <DownloadIcon size={36} c="#fff" />{st}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 34, fontFamily: font.sans, fontWeight: 500, fontSize: 40, color: color.ink2, opacity: sE, transform: `translateY(${(1 - sE) * 20}px)` }}>
            Entra con tu correo y tu contraseña
          </div>
          <div style={{ marginTop: 26, minHeight: 80 }}>
            <Chip at={fDisf - 3} label="¡A disfrutar!" icon={<HeadphonesIcon size={32} />} size={42} reserve />
          </div>
        </div>
      </AbsoluteFill>
      <Sfx name="ui_pop" at={fDesc} />
      <Sfx name="ui_pop" at={fDesc + 5} volume={0.7} />
      <Sfx name="phone_tap" at={fEntra} />
      <Sfx name="sparkle" at={fDisf - 2} />
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
  // Las dos tarjetas están desde el principio; la de la derecha, en segundo plano hasta «¿No te convence?».
  const sP = spring({ frame: frame - 8, fps, config: { damping: 18, stiffness: 140 } });
  const box = (s: number, children: React.ReactNode, active = 1) => (
    <div style={{ width: 760, minHeight: 640, borderRadius: 44, background: '#fff', boxShadow: active > 0.5 ? `0 0 0 ${4 * active}px ${color.yellow}, ${shadow.card}` : shadow.card, border: `1px solid ${color.line}`, padding: '48px 50px',
      opacity: s * (0.42 + 0.58 * active), transform: `translateY(${(1 - s) * 60}px) scale(${0.97 + 0.03 * active})`, boxSizing: 'border-box' }}>{children}</div>
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
        ), 1 - 0.5 * sR)}
        {box(sP, (
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
        ), sR)}
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
