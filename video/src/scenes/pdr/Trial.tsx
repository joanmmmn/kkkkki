import React from 'react';
import { AbsoluteFill, Easing, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { typeTimes, typeTimesSpoken, typedCount } from '../../lib/typing';
import { Stage } from '../../components/Stage';
import { ChangeTicks, Keystrokes, Sfx } from '../../components/Sfx';
import { Logo, LogoIcon } from '../../components/Logo';
import { Words, Typewriter } from '../../components/Kinetic';
import { Pill } from '../../components/Pill';
import { Phase } from '../../components/Phase';
import { ScreenClip, CamKey } from '../../components/ScreenClip';
import { CheckIcon, HeadphonesIcon } from '../../components/Icons';
import { CalendarIcon, CardIcon, ClockIcon, DocIcon, DownloadIcon, LinkIcon, LockIcon, MailIcon } from '../../components/Icons2';
import { TiltWindow } from '../nxr/Verdict';
import { wf } from './timeline';
import { AppPhone, Burst, Chip, LinkBadge, MaskTitle, PhoneHalo, PhoneKey, PodimoLogo, PV, PV_DEEP, PV_SOFT, Shot } from './kit';
import type { SceneProps } from './registry';
import m00 from '../../../public/pdr/web/00_home/meta.json';
import c00 from '../../../public/pdr/web/00_home/cursor.json';
import m11 from '../../../public/pdr/web/11_ficha_click/meta.json';
import c11 from '../../../public/pdr/web/11_ficha_click/cursor.json';
import m22 from '../../../public/pdr/web/22_plataformas/meta.json';
import c22 from '../../../public/pdr/web/22_plataformas/cursor.json';

type P = SceneProps;

// L01 · «30 días gratis, con 20 horas»: los días caen en una insignia (contador mecánico 1 → 30) y, al lado, el anillo
// lila de las 20 horas. Letra pequeña literal de la tarjeta de SonorBooks.
export const L01Gratis: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('L01', w, n);
  const fSonor = at('sonorbooks');
  const fTreinta = at('treinta');
  const fVeinte = at('veinte');
  const LAND = fTreinta + 6;
  const badgeAt = fTreinta - 16;
  const rollFrom = badgeAt - 6;
  const rollAt = (f: number) => Math.max(1, Math.floor(interpolate(f, [rollFrom, LAND], [1, 30], { ...clamp, easing: Easing.bezier(0.45, 0, 0.25, 1) }) + 1e-6));
  const roll = rollAt(frame);
  const steps: number[] = [];
  for (let f = rollFrom; f <= LAND; f++) if (rollAt(f) !== rollAt(f - 1)) steps.push(f);
  const lastStep = steps.filter((f) => f <= frame).pop();
  const since = lastStep === undefined ? 99 : frame - lastStep;
  const kick = since < 4 ? [1, 0.5, 0.18, 0][since] : 0;
  const recent = steps.filter((f) => f <= frame && f > frame - 3).length;
  const blurY = Math.min(6, recent * 2);
  const sBadge = spring({ frame: frame - badgeAt, fps, config: { damping: 12, stiffness: 150 } });
  const sLogos = spring({ frame: frame - 2, fps, config: { damping: 18, stiffness: 150 } });
  const lift = interpolate(frame, [fSonor - 8, fSonor + 10], [0, 1], { ...clamp, easing: easeInOut });
  const rays = frame * 0.25;
  const bump = frame < LAND ? 0 : frame < LAND + 2 ? (frame - LAND) / 2 : interpolate(frame, [LAND + 2, LAND + 20], [1, 0], { ...clamp, easing: easeOut });
  const sH = spring({ frame: frame - fVeinte + 2, fps, config: { damping: 13, stiffness: 160 } });
  const ring = interpolate(frame, [fVeinte, fVeinte + 30], [0, 1], { ...clamp, easing: easeOut });
  const sFine = spring({ frame: frame - fVeinte - 10, fps, config: { damping: 18, stiffness: 140 } });
  const shift = interpolate(frame, [fVeinte - 8, fVeinte + 10], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', top: 110, display: 'flex', alignItems: 'center', gap: 26, opacity: sLogos, transform: `translateY(${(1 - sLogos) * -30 + (1 - lift) * 330}px) scale(${1 + 0.8 * (1 - lift)})` }}>
          <LogoIcon size={70} />
          <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.muted }}>×</span>
          <PodimoLogo width={200} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 60, transform: `translateX(${-150 * shift}px)` }}>
          <div style={{ position: 'relative', width: 540, height: 540, transform: `scale(${sBadge * (1 + 0.07 * bump)})` }}>
            <svg width="540" height="540" viewBox="0 0 540 540" style={{ position: 'absolute', inset: 0, transform: `rotate(${rays}deg)` }}>
              {Array.from({ length: 24 }).map((_, i) => (
                <path key={i} d="M270 270 L 258 0 L 282 0 Z" fill={color.yellow} opacity={0.22} transform={`rotate(${i * 15} 270 270)`} />
              ))}
            </svg>
            <div style={{ position: 'absolute', inset: 68, borderRadius: '50%', background: color.yellow, boxShadow: '0 40px 100px rgba(255,202,5,0.45)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="0" height="0" style={{ position: 'absolute' }}><defs><filter id="l01roll" x="0" y="-20%" width="100%" height="140%"><feGaussianBlur stdDeviation={`0 ${blurY.toFixed(1)}`} /></filter></defs></svg>
              <div style={{ height: 208, overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '0 12px' }}>
                <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 224, letterSpacing: -10, lineHeight: 0.9, color: color.ink, fontVariantNumeric: 'tabular-nums',
                  transform: `translateY(${(kick * -12).toFixed(1)}px)`, filter: blurY > 0.5 ? 'url(#l01roll)' : undefined }}>{roll}</div>
              </div>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 46, color: color.ink, letterSpacing: -1 }}>días gratis</div>
            </div>
          </div>
          {/* 20 horas de audiolibros durante la prueba (anillo lila de Podimo) */}
          {frame >= fVeinte - 4 && (
            <div style={{ position: 'relative', width: 320, height: 320, opacity: sH, transform: `scale(${0.7 + 0.3 * sH})` }}>
              <svg width="320" height="320" viewBox="0 0 320 320" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
                <circle cx="160" cy="160" r="140" stroke={PV_SOFT} strokeWidth="22" fill="#fff" />
                <circle cx="160" cy="160" r="140" stroke={PV} strokeWidth="22" fill="none" strokeLinecap="round" strokeDasharray={`${(879.6 * ring).toFixed(1)} 879.6`} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 110, letterSpacing: -5, color: color.ink, lineHeight: 1 }}>20 h</div>
                <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: PV_DEEP, marginTop: 6 }}>de audiolibros</div>
              </div>
            </div>
          )}
        </div>
        <Burst at={LAND} x={960} y={540} r={200} seed="l01" />
        <div style={{ position: 'absolute', bottom: 70, width: 1500, textAlign: 'center', fontFamily: font.sans, fontWeight: 500, fontSize: 27, lineHeight: 1.4, color: color.ink2, opacity: sFine }}>
          30 días gratis con este enlace. Después, Premium: 4,99 €/mes con 20 horas de audiolibros al mes y pódcasts. Renovación automática salvo cancelación.
        </div>
      </AbsoluteFill>
      <Sfx name="ui_pop" at={badgeAt + 2} volume={0.8} />
      <Sfx name="riser" at={LAND} volume={0.8} />
      <ChangeTicks value={(f) => String(rollAt(f))} from={rollFrom} to={LAND} />
      <Sfx name="impact" at={LAND} />
      <Sfx name="sparkle" at={LAND + 2} volume={0.8} />
      <Sfx name="ui_pop" at={fVeinte} volume={0.7} />
    </Stage>
  );
};

// L02 · Tres accesos a la prueba desde SonorBooks (grabaciones reales): portada, ficha de un libro y comparativa.
const ACCESS = [
  { label: 'Portada', src: 'pdr/web/00_home/video.mp4', still: 'pdr/web/00_home/first.jpg', last: 'pdr/web/00_home/last.jpg', cursor: c00, url: 'sonorbooks.com' },
  { label: 'Ficha del libro', src: 'pdr/web/11_ficha_click/video.mp4', still: 'pdr/web/11_ficha_click/first.jpg', last: 'pdr/web/11_ficha_click/last.jpg', cursor: c11, url: 'sonorbooks.com/es/audiolibro/la-mala-hija' },
  { label: 'Comparativa', src: 'pdr/web/22_plataformas/video.mp4', still: 'pdr/web/22_plataformas/first.jpg', last: 'pdr/web/22_plataformas/last.jpg', cursor: c22, url: 'sonorbooks.com/es/plataformas' },
];
export const L02Accesos: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('L02', w, n);
  const fPortada = at('portada');
  const fFicha = at('ficha');
  const fComp = at('comparativa');
  const fDejamos = at('dejamos');
  const fEnlace = at('enlace');
  const fResena = at('resena');
  const id = React.useId().replace(/:/g, '');
  const steps = [fPortada - 10, fFicha - 8, fComp - 8];
  const fTres = steps[0] - 4;
  const pAt = (f: number) => interpolate(f, [steps[0], steps[0] + 18, steps[1], steps[1] + 18, steps[2], steps[2] + 18], [-1, 0, 0, 1, 1, 2], { ...clamp, easing: easeInOut });
  const p = pAt(frame);
  const mb = Math.min(22, Math.abs(p - pAt(frame - 1)) * 900 * 0.3);
  const q = Math.max(0, Math.min(1, p + 1));
  const W = 1200;
  const H = W * 9 / 16 + Math.round(W * 0.03);
  const fr = (t: number, start: number, rate = 1) => Math.round(((t - start) / rate) * fps);
  const clips = [
    {
      from: steps[0] - 4, startAt: 0.2, rate: 1.15,
      cam: [{ f: 0, zoom: 1.05, x: 960, y: 560 }, { f: 30, zoom: 1.7, x: 764, y: 700 }, { f: 160, zoom: 1.85, x: 764, y: 720 }] as CamKey[],
      marks: [{ from: fr(m00.marks.to_btn, 0.2, 1.15) + 8, to: 260, x: 641, y: 756, w: 246, h: 48, r: 24 }],
    },
    {
      from: steps[1] - 4, startAt: 0.7, rate: 1.1,
      cam: [
        { f: 0, zoom: 1.1, x: 1000, y: 540 }, { f: fr(m11.marks.click_opt, 0.7, 1.1) - 6, zoom: 1.6, x: 1250, y: 690 },
        { f: fr(m11.marks.to_btn, 0.7, 1.1) + 6, zoom: 1.55, x: 1275, y: 560 }, { f: 300, zoom: 1.65, x: 1275, y: 560 },
      ] as CamKey[],
      marks: [
        { from: fr(m11.marks.click_opt, 0.7, 1.1) - 14, to: fr(m11.marks.click_opt, 0.7, 1.1) + 12, x: 1160, y: 701, w: 187, h: 42, r: 10 },
        { from: fr(m11.marks.click, 0.7, 1.1) - 12, to: 300, x: 973, y: 535, w: 604, h: 47, r: 24 },
      ],
    },
    {
      from: steps[2] - 4, startAt: 0.4, rate: 1.1,
      cam: [
        { f: 0, zoom: 1.15, x: 760, y: 560 }, { f: fr(m22.marks.click_card, 0.4, 1.1), zoom: 1.45, x: 560, y: 640 },
        { f: fr(m22.marks.to_offer, 0.4, 1.1), zoom: 1.35, x: 1060, y: 600 }, { f: fr(m22.marks.click_offer, 0.4, 1.1), zoom: 2.0, x: 1330, y: 712 },
        { f: 400, zoom: 2.05, x: 1330, y: 712 },
      ] as CamKey[],
      marks: [
        { from: fr(m22.marks.click_card, 0.4, 1.1) - 24, to: fr(m22.marks.click_card, 0.4, 1.1) + 4, x: 288, y: 637, w: 344, h: 44, r: 22 },
        { from: fr(m22.marks.click_offer, 0.4, 1.1) - 20, to: 400, x: 1284, y: 699, w: 169, h: 44, r: 22 },
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
                  <ScreenClip image src={frame < clip.from ? a.still : a.last} width={W} showCursor={false}
                    camera={frame < clip.from ? [{ f: 0, zoom: 1, x: 960, y: 540 }] : [clip.cam[clip.cam.length - 1]]} />
                )}
              </TiltWindow>
            </div>
          );
        })}
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs><filter id={`mb${id}`} x="-5%" y="0" width="110%" height="100%"><feGaussianBlur stdDeviation={`${mb.toFixed(1)} 0`} /></filter></defs>
        </svg>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 28, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, zIndex: 20 }}>
          <LinkBadge at={fDejamos - 3} label="En la descripción" size={34} reserve />
          <Chip at={fEnlace - 3} label="Enlace directo" icon={<LinkIcon size={30} />} size={34} reserve />
          <Chip at={fResena - 3} label="Reseña completa por escrito" icon={<DocIcon size={30} />} size={34} reserve />
        </div>
      </AbsoluteFill>
      {[0, 1, 2].map((i) => <Sfx key={`a${i}`} name="ui_pop" at={fTres - 4 + i * 5} />)}
      {steps.map((f, i) => <Sfx key={i} name="swipe" at={f + 9} volume={0.9} />)}
      <Sfx name="click" at={clips[0].from + fr(m00.marks.click, 0.2, 1.15)} volume={0.8} />
      <Sfx name="click" at={clips[1].from + fr(m11.marks.click_opt, 0.7, 1.1)} />
      <Sfx name="click" at={clips[1].from + fr(m11.marks.click, 0.7, 1.1)} />
      <Sfx name="click" at={clips[2].from + fr(m22.marks.click_card, 0.4, 1.1)} />
      <Sfx name="click" at={clips[2].from + fr(m22.marks.click_offer, 0.4, 1.1)} />
      <Sfx name="ui_pop" at={fDejamos - 1} volume={0.8} />
      <Sfx name="ui_pop" at={fEnlace - 2} volume={0.7} />
      <Sfx name="sparkle" at={fResena - 2} volume={0.8} />
    </Stage>
  );
};

// L03 · Crea tu cuenta y añade tu tarjeta (ilustración de los dos pasos, sin datos reales) y el sello «Hoy: 0 €».
export const L03Pasos: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('L03', w, n);
  const fCuenta = at('cuenta');
  const fCorreo = at('correo');
  const fTarjeta = at('tarjeta');
  const fHoy = at('hoy');
  const email = 'tucorreo@ejemplo.com';
  const eKeys = typeTimes(email, fCorreo - 6, 34, 'l03');
  const typed = typedCount(eKeys, frame);
  const s1 = spring({ frame: frame - fCuenta + 8, fps, config: { damping: 16, stiffness: 150 } });
  const s2 = spring({ frame: frame - fTarjeta + 6, fps, config: { damping: 16, stiffness: 150 } });
  const act2 = interpolate(frame, [fTarjeta - 4, fTarjeta + 6], [0, 1], clamp);
  const dots = Math.floor(interpolate(frame, [fTarjeta + 4, fTarjeta + 20], [0, 16], clamp));
  const LAND = fHoy + 6;
  const pS = interpolate(frame, [fHoy, LAND], [0, 1], { ...clamp, easing: (t) => t * t * t });
  const squash = interpolate(frame, [LAND, LAND + 3, LAND + 11], [1, 0.94, 1], { ...clamp, easing: easeOut });
  const ringS = interpolate(frame, [LAND, LAND + 16], [0, 1], { ...clamp, easing: easeOut });
  const k = frame - LAND;
  const shake = k >= 0 && k < 14 ? 5 * Math.exp(-k / 3.2) * Math.sin(k * 2.3) : 0;
  const field = (icon: React.ReactNode, children: React.ReactNode, on: boolean) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, height: 86, padding: '0 26px', borderRadius: 22, background: '#F6F6F6', border: `2px solid ${on ? PV : 'transparent'}`,
      fontFamily: font.sans, fontSize: 36, color: color.ink }}>
      {icon}{children}
    </div>
  );
  const box = (n: number, title: string, s: number, act: number, children: React.ReactNode) => (
    <div style={{ width: 700, padding: '40px 44px', borderRadius: 44, background: '#fff', border: `1px solid ${color.line}`, boxShadow: `0 0 0 ${4 * act}px ${color.yellow}, ${shadow.card}`,
      opacity: s * (0.45 + 0.55 * act), transform: `translateY(${(1 - s) * 70}px) scale(${0.96 + 0.04 * act})` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: color.ink, marginBottom: 30 }}>
        <span style={{ width: 60, height: 60, borderRadius: '50%', background: act > 0.5 ? color.ink : color.yellow, color: act > 0.5 ? color.yellow : color.ink, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>{n}</span>
        {title}
      </div>
      {children}
    </div>
  );
  const act1 = 1 - 0.55 * act2;
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: shake ? `translateY(${shake.toFixed(2)}px)` : undefined }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginBottom: 54, fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink2 }}>
          <PodimoLogo width={170} /> · prueba gratuita de 30 días
        </div>
        <div style={{ display: 'flex', gap: 50 }}>
          {box(1, 'Crea tu cuenta', s1, act1, (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {field(<MailIcon size={38} c={color.ink2} />, <span>{email.slice(0, typed)}<span style={{ opacity: typed > 0 && typed < email.length ? 1 : Math.floor(frame / 12) % 2 ? 0 : 1 }}>|</span></span>, act2 < 0.5)}
              {field(<LockIcon size={38} c={color.ink2} />, <span style={{ letterSpacing: 6, color: color.ink2 }}>{typed >= email.length ? '••••••••' : ''}</span>, false)}
            </div>
          ))}
          {box(2, 'Añade tu tarjeta', s2, act2, (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {field(<CardIcon size={38} c={color.ink2} />, <span style={{ letterSpacing: 4, color: color.ink2 }}>{'•'.repeat(dots).replace(/(.{4})/g, '$1 ').trim()}</span>, act2 > 0.5)}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: font.sans, fontWeight: 500, fontSize: 30, color: color.ink2 }}>
                <ClockIcon size={34} c={color.ink2} /> Si no cancelas, se cobra al acabar la prueba
              </div>
            </div>
          ))}
        </div>
        {frame >= fHoy && (
          <div style={{ position: 'absolute', right: 250, top: 690, zIndex: 20, transform: `rotate(${-14 + 6 * pS}deg) scale(${frame < LAND ? 2.2 - 1.2 * pS : squash})`, opacity: interpolate(pS, [0, 0.4], [0, 1], clamp) }}>
            {ringS > 0 && ringS < 1 && <div style={{ position: 'absolute', inset: 0, borderRadius: 30, border: `4px solid ${color.green}`, transform: `scale(${1 + 0.35 * ringS})`, opacity: 0.55 * (1 - ringS) }} />}
            <div style={{ padding: '22px 40px', borderRadius: 30, background: color.green, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 64, display: 'flex', alignItems: 'center', gap: 18,
              boxShadow: `0 ${(10 + 40 * (1 - pS)).toFixed(1)}px ${(30 + 60 * (1 - pS)).toFixed(1)}px rgba(31,157,85,${(0.45 - 0.2 * (1 - pS)).toFixed(3)})` }}>
              <CheckIcon size={64} c="#fff" fg={color.green} /> Hoy: 0 €
            </div>
          </div>
        )}
      </AbsoluteFill>
      <Sfx name="ui_pop" at={fCuenta - 6} volume={0.7} />
      <Keystrokes text={email} times={eKeys} volume={0.7} seed="l03" />
      <Sfx name="swipe" at={fTarjeta} volume={0.7} />
      <Sfx name="stamp" at={LAND} />
    </Stage>
  );
};

// L04 · Descarga la app, entra con tu correo y elige lo que te gusta (primer arranque real de la app).
export const L04App: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('L04', w, n);
  const fDesc = at('descarga');
  const fEntra = at('entra');
  const fElige = at('elige');
  const sB = (k: number) => spring({ frame: frame - fDesc - k * 5, fps, config: { damping: 14, stiffness: 170 } });
  const sE = spring({ frame: frame - fEntra + 2, fps, config: { damping: 15, stiffness: 160 } });
  const cam: PhoneKey[] = [{ f: 0, rx: 10, ry: -30, rz: 4, s: 0.9, x: 80, y: 40 }, { f: 26, rx: 3, ry: -12, rz: 1, s: 1, x: 0, y: 0 }, { f: dur, rx: 2, ry: -8, rz: 0.5, s: 1.02, x: 0, y: -4 }];
  // El primer arranque: «¿Qué te gusta?» y el toque en «Podcasts» (29,14 s de la toma) justo cuando la voz dice «elige».
  const shots: Shot[] = [{ rec: '00_gustos', at: 0, start: Math.max(0, 29.14 - (fElige + 4) / 50), hold: 30.5 }];
  return (
    <Stage tone="warm">
      <AbsoluteFill>
        <PhoneHalo cam={cam} cx={1340} cy={559} strength={0.9} />
        <div style={{ position: 'absolute', left: 1120, top: 100 }}>
          <AppPhone shots={shots} w={410} cam={cam} float={[20, dur + 24]} taps={[{ f: fElige + 4, x: 177, y: 341 }]} />
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
            <Chip at={fElige - 3} label="Elige lo que te gusta" icon={<HeadphonesIcon size={32} />} size={42} reserve />
          </div>
        </div>
      </AbsoluteFill>
      <Sfx name="ui_pop" at={fDesc + 2} />
      <Sfx name="ui_pop" at={fDesc + 7} volume={0.7} />
      <Sfx name="ui_tap" at={fElige + 4} volume={0.6} />
      <Sfx name="sparkle" at={fElige - 2} />
    </Stage>
  );
};

// L05 · ¿Te ha gustado? Quédate. ¿No? Cancela antes del día 30 en Configuración › Gestionar suscripción
// (mejor en los últimos días: al cancelar la prueba se pierde el acceso al momento).
export const L05Decide: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('L05', w, n);
  const fGusta = at('gustado');
  const fQuedate = at('quedate');
  const fConv = at('convence');
  const fConf = at('configuracion');
  const fUlt = at('ultimos');
  const fPierdes = at('pierdes');
  const sL = spring({ frame: frame - fGusta + 4, fps, config: { damping: 16, stiffness: 150 } });
  const sQ = spring({ frame: frame - fQuedate, fps, config: { damping: 11, stiffness: 200 } });
  const sR = spring({ frame: frame - fConv + 4, fps, config: { damping: 16, stiffness: 150 } });
  const sM = spring({ frame: frame - fConf, fps, config: { damping: 16, stiffness: 170 } });
  const sW = spring({ frame: frame - fPierdes, fps, config: { damping: 14, stiffness: 180 } });
  const best = interpolate(frame, [fUlt - 2, fUlt + 16], [0, 1], { ...clamp, easing: easeOut });
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const sP = spring({ frame: frame - 8, fps, config: { damping: 18, stiffness: 140 } });
  const box = (s: number, children: React.ReactNode, active = 1) => (
    <div style={{ width: 760, minHeight: 660, borderRadius: 44, background: '#fff', boxShadow: active > 0.5 ? `0 0 0 ${4 * active}px ${color.yellow}, ${shadow.card}` : shadow.card, border: `1px solid ${color.line}`, padding: '48px 50px',
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
            <div style={{ marginTop: 60, fontFamily: font.sans, fontWeight: 500, fontSize: 30, color: color.muted, opacity: sQ }}>Después, Premium: 4,99 €/mes</div>
          </>
        ), 1 - 0.5 * sR)}
        {box(sP, (
          <>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 56, color: color.ink, letterSpacing: -1.5 }}>¿No te convence?</div>
            <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 12, fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: color.ink, opacity: sM, transform: `translateX(${(1 - sM) * -20}px)` }}>
              <CalendarIcon size={42} /> Configuración › <span style={{ color: PV_DEEP }}>Gestionar suscripción</span>
            </div>
            <div style={{ marginTop: 26, display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 8 }}>
              {days.map((d) => {
                const hot = d >= 27 && d <= 29;
                const last = d === 30;
                const ds = spring({ frame: frame - (fConf + 4 + (d - 1) * 0.8), fps, config: { damping: 13, stiffness: 230 } });
                return (
                  <div key={d} style={{ height: 50, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 22,
                    background: hot ? `rgba(255,202,5,${0.25 + 0.75 * best})` : last ? '#FDECEC' : '#F4F4F4', color: last ? color.red : color.ink, opacity: Math.min(1, ds * 1.6),
                    transform: `scale(${(0.55 + 0.45 * ds) * (hot ? 1 + 0.1 * best : 1)})` }}>
                    {d}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 18, display: 'flex', justifyContent: 'flex-end', fontFamily: font.sans, fontWeight: 700, fontSize: 28, color: color.ink, opacity: best }}>
              Mejor aquí, en los últimos días ↑
            </div>
            <div style={{ marginTop: 22, padding: '16px 22px', borderRadius: 20, background: '#FDECEC', color: color.red, fontFamily: font.sans, fontWeight: 700, fontSize: 30, opacity: sW, transform: `translateY(${(1 - sW) * 20}px)` }}>
              Al cancelar la prueba, pierdes el acceso al momento
            </div>
          </>
        ), sR)}
      </AbsoluteFill>
      <Sfx name="ui_pop" at={fGusta - 2} />
      <Sfx name="success" at={fQuedate + 1} volume={0.8} />
      <Sfx name="ui_pop" at={fConv - 2} />
      <Sfx name="ui_pop" at={fConf + 1} volume={0.6} />
      {[0, 1, 2].map((r) => <Sfx key={`d${r}`} name="tick_soft" at={fConf + 6 + r * 8} volume={[0.85, 0.6, 0.5][r]} />)}
      <Sfx name="marker" at={fUlt} />
      <Sfx name="hit_soft" at={fPierdes + 1} />
    </Stage>
  );
};

// L06 · Cierre de marca con espacio libre para la pantalla final de YouTube.
export const L06Outro: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('L06', w, n);
  const fPrecio = at('precio');
  const fSonor = at('sonorbooks');
  const fTu = at('tu');
  const fProx = at('proximo');
  const fLibro = at('libro');
  const fY = at('y');
  const query = 'Tu próximo libro';
  const keys = typeTimesSpoken(query, [[fTu - 3, fProx - 3], [fProx - 2, fLibro - 3], [fLibro - 2, fY - 6]], 'l06');
  const end = fSonor + 30;
  return (
    <Stage tone="warm">
      <Phase from={0} to={end + 2}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 56 }}>
          <Logo size={120} delay={2} />
          <div style={{ width: 1160, height: 104, borderRadius: 999, background: '#fff', boxShadow: shadow.float, border: `1px solid ${color.line}`, display: 'flex', alignItems: 'center', padding: '0 18px 0 46px', gap: 24 }}>
            <svg width="38" height="38" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" stroke={color.ink} strokeWidth="2.4" fill="none" /><path d="M15.5 15.5 L21 21" stroke={color.ink} strokeWidth="2.4" strokeLinecap="round" /></svg>
            <div style={{ flex: 1, fontFamily: font.sans, fontSize: 42, color: color.ink }}>
              <Typewriter text={query} times={keys} placeholder="Busca un libro" />
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
      <Sfx name="logo_sting" at={4} />
      <Keystrokes text={query} times={keys} volume={0.9} seed="l06" />
      <Sfx name="logo_sting" at={end + 5} volume={0.6} />
    </Stage>
  );
};
