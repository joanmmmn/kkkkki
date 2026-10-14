import React from 'react';
import { AbsoluteFill, Easing, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { typeTimesSpoken } from '../../lib/typing';
import { ChangeTicks, Keystrokes, Sfx } from '../../components/Sfx';
import { Logo } from '../../components/Logo';
import { Words, Typewriter } from '../../components/Kinetic';
import { Pill } from '../../components/Pill';
import { Phase } from '../../components/Phase';
import { CamKey, ScreenClip } from '../../components/ScreenClip';
import { CheckIcon, CrossIcon } from '../../components/Icons';
import { CalendarIcon, CardIcon, ClockIcon, DocIcon, GlobeIcon, LockIcon, PhoneIcon, UserIcon } from '../../components/Icons2';
import { TiltWindow } from '../nxr/Verdict';
import { wf } from './timeline';
import {
  AB, AB_DEEP, AB_HOT, AB_INK, AB_SOFT, AB_TEAL, AbcLogo, AbcStage, AppPhone, align, Burst, buildPhoneCam, Chip, CreditCoin, LinkBadge, markOn, MaskTitle, MiniBook, Odometer,
  odometerShown, PH, PhoneHalo, PHONE_W, Shot, VipBadge,
} from './kit';
import type { SceneProps } from './registry';
import m00 from '../../../public/abc/web/00_abc_landing/meta.json';
import c00 from '../../../public/abc/web/00_abc_landing/cursor.json';
import m10 from '../../../public/abc/web/10_sb_plataformas/meta.json';
import c10 from '../../../public/abc/web/10_sb_plataformas/cursor.json';
import m11 from '../../../public/abc/web/11_sb_ficha/meta.json';
import c11 from '../../../public/abc/web/11_sb_ficha/cursor.json';
import ms10 from '../../../public/str/web/10_sb_plataformas/meta.json';

type P = SceneProps;

// F01 · «Treinta días gratis con tres audiolibros desde SonorBooks»: el sello naranja cuenta de 1 a 30 y, debajo, los tres libros
// (uno con el crédito y dos de la selección VIP) y las condiciones literales de la tarjeta de Audiobooks.com en SonorBooks.
export const F01Gratis: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('F01', w, n);
  const fSonor = at('sonorbooks');
  const fTreinta = at('treinta');
  const fTres = at('tres');
  const fUno = at('uno');
  const fCredito = at('credito');
  const fDos = at('dos');
  const fVip = at('vip');
  const LAND = fTreinta + 14;
  const badgeAt = fTreinta - 16;
  const rollFrom = badgeAt - 2;
  const rollAt = (f: number) => Math.max(1, Math.floor(interpolate(f, [rollFrom, LAND], [1, 30], { ...clamp, easing: Easing.bezier(0.45, 0, 0.25, 1) }) + 1e-6));
  const roll = rollAt(frame);
  const sBadge = spring({ frame: frame - badgeAt, fps, config: { damping: 12, stiffness: 150 } });
  const sLogo = spring({ frame: frame - (fSonor - 10), fps, config: { damping: 16, stiffness: 150 } });
  const book = (f: number) => spring({ frame: frame - f, fps, config: { damping: 11, stiffness: 190 } });
  const b0 = book(fUno - 4);
  const b1 = book(fDos - 4);
  const b2 = book(fDos + 2);
  const sTres = spring({ frame: frame - (fTres - 4), fps, config: { damping: 14, stiffness: 180 } });
  const sL1 = spring({ frame: frame - (fCredito - 2), fps, config: { damping: 14, stiffness: 180 } });
  const sL2 = spring({ frame: frame - (fVip - 6), fps, config: { damping: 14, stiffness: 180 } });
  const sPill = spring({ frame: frame - (fVip + 6), fps, config: { damping: 16, stiffness: 150 } });
  const sFine = spring({ frame: frame - (fVip + 14), fps, config: { damping: 16, stiffness: 150 } });
  const rays = frame * 0.25;
  const bump = frame < LAND ? 0 : frame < LAND + 2 ? (frame - LAND) / 2 : interpolate(frame, [LAND + 2, LAND + 20], [1, 0], { ...clamp, easing: easeOut });
  const bk = (s: number, tone: 'orange' | 'teal', label: React.ReactNode) => (
    <div style={{ opacity: Math.min(1, s * 1.5), transform: `translateY(${((1 - s) * -60).toFixed(2)}px) rotate(${((1 - s) * -16).toFixed(2)}deg) scale(${(0.6 + 0.4 * s).toFixed(4)})` }}>
      <MiniBook w={84} tone={tone} label={label} />
    </div>
  );
  return (
    <AbcStage>
      <AbsoluteFill>
        <div style={{ position: 'absolute', top: 64, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, opacity: sLogo, transform: `translateY(${((1 - sLogo) * -30).toFixed(2)}px)` }}>
          <AbcLogo width={270} />
          <span style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 34, color: color.ink2 }}>desde</span>
          <Logo size={58} animate={false} />
        </div>
        {frame < badgeAt + 4 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 30 }}>
            <MaskTitle text="¿Quieres probarlo?" hi="probarlo" at={lead - 4} size={124} align="center" out={badgeAt - 2} />
          </div>
        )}
        {/* El sello: el contador (1 → 30) y «días gratis». */}
        <div style={{ position: 'absolute', left: 960 - 230, top: 150, width: 460, height: 460, transform: `scale(${(sBadge * (1 + 0.07 * bump)).toFixed(4)})` }}>
          <svg width="460" height="460" viewBox="0 0 560 560" style={{ position: 'absolute', inset: 0, transform: `rotate(${rays}deg)` }}>
            {Array.from({ length: 24 }).map((_, i) => (
              <path key={i} d="M280 280 L 268 0 L 292 0 Z" fill={AB} opacity={0.16} transform={`rotate(${i * 15} 280 280)`} />
            ))}
          </svg>
          <div style={{ position: 'absolute', inset: 58, borderRadius: '50%', background: `linear-gradient(160deg, ${AB_HOT} 0%, ${AB} 100%)`, boxShadow: '0 40px 100px rgba(255,80,28,0.42)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 196, letterSpacing: -9, lineHeight: 0.86, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{roll}</div>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: '#fff', letterSpacing: -1, marginTop: 10 }}>días gratis</div>
          </div>
        </div>
        <Burst at={LAND} x={960} y={380} r={190} seed="f01" colors={[AB, color.yellow, AB_HOT, AB_TEAL]} />
        {/* Los tres audiolibros: 1 con el crédito y 2 de la selección VIP. */}
        <div style={{ position: 'absolute', top: 636, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 40 }}>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 52, letterSpacing: -1.5, color: color.ink, opacity: sTres, transform: `translateX(${((1 - sTres) * -30).toFixed(2)}px)` }}>3 audiolibros:</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            {bk(b0, 'orange', <CreditCoin size={44} />)}
            <div style={{ display: 'flex', flexDirection: 'column', fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: color.ink, opacity: sL1, transform: `translateY(${((1 - sL1) * 14).toFixed(2)}px)` }}>
              <span>1 con</span><span style={{ color: AB_DEEP }}>el crédito</span>
            </div>
          </div>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 52, color: color.muted, opacity: b1 }}>+</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {bk(b1, 'teal', <VipBadge size={30} style={{ background: 'rgba(255,255,255,0.22)' }} />)}
            {bk(b2, 'teal', <VipBadge size={30} style={{ background: 'rgba(255,255,255,0.22)' }} />)}
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 6, fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: color.ink, opacity: sL2, transform: `translateY(${((1 - sL2) * 14).toFixed(2)}px)` }}>
              <span>2 de la</span><span style={{ color: AB_TEAL }}>selección VIP</span>
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', top: 836, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 30px 12px 18px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.float,
            fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: color.ink, opacity: sPill, transform: `translateY(${((1 - sPill) * 30).toFixed(2)}px) scale(${(0.9 + 0.1 * sPill).toFixed(4)})` }}>
            <CalendarIcon size={38} c={AB_DEEP} /> 30 días gratis · Después, 14,95 USD/mes
          </div>
        </div>
        <div style={{ position: 'absolute', top: 934, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: sFine, transform: `translateY(${((1 - sFine) * 20).toFixed(2)}px)`,
          fontFamily: font.sans, fontWeight: 500, fontSize: 25, color: color.ink2 }}>
          <div>«Solo nuevas altas elegibles; una prueba por persona u hogar. Requiere registro y método de pago válido.»</div>
          <div>«No es escucha ilimitada.» Condiciones de la tarjeta de Audiobooks.com en SonorBooks.</div>
        </div>
      </AbsoluteFill>
      <Sfx name="ui_pop" at={badgeAt + 2} volume={0.8} />
      <Sfx name="riser" at={LAND - 6} volume={0.6} />
      <ChangeTicks value={(f) => String(rollAt(f))} from={rollFrom} to={LAND} volume={0.55} />
      <Sfx name="impact" at={LAND} />
      <Sfx name="sparkle" at={LAND + 2} volume={0.8} />
      <Sfx name="ui_pop" at={fTres - 2} volume={0.6} />
      <Sfx name="snap_in" at={fUno} volume={0.7} />
      <Sfx name="coins" at={fCredito} volume={0.35} />
      <Sfx name="snap_in" at={fDos} volume={0.7} />
      <Sfx name="snap_in" at={fDos + 6} volume={0.7} />
      <Sfx name="ui_pop" at={fVip + 6} volume={0.55} />
    </AbcStage>
  );
};

// F02 · Desde SonorBooks (grabaciones reales): la tarjeta de Audiobooks.com en Plataformas («Ver audiolibros» → la selección
// «Entra en otros mundos» → «Ver la prueba gratuita») y la ficha de un libro que está en Audiobooks.com («Alas de sangre»: «Tu
// selección · 0 € · 30 días de prueba · Empezar prueba gratuita»); y el enlace directo y la reseña escrita, en la descripción.
export const F02Desde: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('F02', w, n);
  const fPlat = at('plataformas');
  const fFicha = at('ficha');
  const fAbc = at('audiobookscom');
  const fDesc = at('descripcion');
  const fEnlace = at('enlace');
  const fRes = at('resena');
  const W = 1500;
  const bFrom = fFicha - 6;
  // Clip A (Plataformas): el clic en «Ver audiolibros», la selección y el clic (sin enviar) en «Ver la prueba gratuita» justo
  // antes de pasar a la ficha.
  const aStart = Math.max(0, m10.marks.cta - (bFrom - 8) / fps);
  const aClickBtn = Math.round((m10.marks.click_btn - aStart) * fps);
  // Clip B (ficha): el clic en «Empezar prueba gratuita» cae con «Audiobooks.com».
  const bStart = Math.max(0, m11.marks.click_btn - (fAbc + 2 - bFrom) / fps);
  const camA: CamKey[] = [
    { f: 0, zoom: 1.25, x: 600, y: 560 }, { f: aClickBtn + 8, zoom: 1.12, x: 900, y: 540 }, { f: fPlat + 10, zoom: 1.3, x: 1150, y: 600 }, { f: bFrom, zoom: 1.4, x: 1250, y: 640 },
  ];
  const camB: CamKey[] = [
    { f: 0, zoom: 1.04, x: 960, y: 540 }, { f: fAbc - 20 - bFrom, zoom: 1.4, x: 1270, y: 560 }, { f: fAbc + 30 - bFrom, zoom: 1.42, x: 1270, y: 580 }, { f: 600, zoom: 1.3, x: 1220, y: 600 },
  ];
  const marksA = [{ from: fPlat - 4, to: bFrom + 4, x: 1140, y: 690, w: 324, h: 64, r: 32 }];
  const marksB = [{ from: fAbc - 8 - bFrom, to: dur + 20 - bFrom, x: 950, y: 403, w: 650, h: 342, r: 22 }];
  const sWin = spring({ frame: frame - 2, fps, config: { damping: 18, stiffness: 120 } });
  const nav = interpolate(frame, [bFrom, bFrom + 16], [0, 1], { ...clamp, easing: Easing.bezier(0.22, 1, 0.36, 1) });
  const navO = interpolate(frame, [bFrom, bFrom + 6], [0, 1], { ...clamp, easing: easeInOut });
  const shrink = interpolate(frame, [fDesc - 10, fDesc + 8], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <AbcStage>
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: (1920 - W) / 2, top: 130, opacity: sWin, transform: `translateY(${((1 - sWin) * 60 - 40 * shrink).toFixed(2)}px) scale(${((0.94 + 0.06 * sWin) * (1 - 0.1 * shrink)).toFixed(4)})`, transformOrigin: '50% 0%' }}>
          <TiltWindow width={W} url={frame < bFrom + 8 ? 'sonorbooks.com/es/plataformas' : 'sonorbooks.com/es/audiolibro/alas-de-sangre'} ry={-3} rx={2}>
            {frame < bFrom + 16 && (
              <div style={{ position: 'absolute', inset: 0, opacity: 1 - 0.6 * navO, transform: `scale(${(1 - 0.04 * nav).toFixed(4)})` }}>
                <ScreenClip src="abc/web/10_sb_plataformas/video.mp4" width={W} startAt={aStart} cursor={c10} camera={camA} marks={marksA} markDim={0.55} />
              </div>
            )}
            {frame >= bFrom && (
              <div style={{ position: 'absolute', inset: 0, opacity: navO, transform: `translateY(${((1 - nav) * 12).toFixed(2)}%) scale(${(0.985 + 0.015 * nav).toFixed(4)})` }}>
                <Sequence from={bFrom} layout="none">
                  <ScreenClip src="abc/web/11_sb_ficha/video.mp4" width={W} startAt={bStart} cursor={c11} camera={camB} marks={marksB} markDim={0.55} />
                </Sequence>
              </div>
            )}
          </TiltWindow>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 36, display: 'flex', justifyContent: 'center', gap: 16, zIndex: 5 }}>
          <Chip at={fPlat - 3} dimAt={fFicha - 3} label="Plataformas" icon={<PhoneIcon size={30} />} size={36} reserve />
          <Chip at={fFicha - 3} dimAt={fDesc - 3} label="Ficha de cualquier libro" icon={<DocIcon size={30} />} size={36} reserve />
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 34, display: 'flex', justifyContent: 'center', gap: 16, zIndex: 10 }}>
          <LinkBadge at={fDesc - 3} label="En la descripción" size={36} reserve />
          <Chip at={fEnlace - 3} label="Enlace directo" icon={<GlobeIcon size={30} />} size={36} reserve />
          <Chip at={fRes - 3} label="Reseña completa por escrito" icon={<DocIcon size={30} />} size={36} reserve />
        </div>
      </AbsoluteFill>
      <Sfx name="whoosh_soft" at={2} volume={0.5} />
      <Sfx name="click" at={aClickBtn} volume={0.6} />
      <Sfx name="ui_pop" at={fPlat - 2} volume={0.6} />
      <Sfx name="click" at={bFrom - 8} volume={0.7} />
      <Sfx name="swipe" at={bFrom + 2} volume={0.8} />
      <Sfx name="ui_pop" at={fFicha - 2} volume={0.6} />
      <Sfx name="click" at={fAbc + 2} volume={0.8} />
      <Sfx name="ui_pop" at={fDesc - 1} volume={0.8} />
      <Sfx name="ui_pop" at={fEnlace - 2} volume={0.6} />
      <Sfx name="sparkle" at={fRes - 2} volume={0.8} />
    </AbcStage>
  );
};

// F03 · En la web, no en la app: la página de la prueba de SonorBooks («Get 3 Audiobooks with a 30-Day Free Trial», clic sin enviar en
// «Sign Up Free») y el alta (grabación real, sin rellenar nada): nombre, correo, tarjeta o PayPal. Hoy, 0 €; pueden retener 14,95 USD
// unos días para comprobar la tarjeta (sus condiciones: una preautorización que se anula).
export const F03Alta: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('F03', w, n);
  const fWeb = at('web');
  const fApp = at('app');
  const fPon = at('pon');
  const fNombre = at('nombre');
  const fCorreo = at('correo');
  const fTarjeta = at('tarjeta');
  const fPaypal = at('paypal');
  const fHoy = at('hoy');
  const fAunque = at('aunque');
  const fCatorce = at('catorce');
  const fDias = at('dias');
  const fComprobar = at('comprobar');
  const W = 1500;
  const sFrom = fPon - 8;
  // La página de la prueba: el clic (sin enviar) en «Sign Up Free» cae 12 fotogramas antes de pasar al alta.
  const lStart = Math.max(0, m00.marks.click - (sFrom - 12) / fps);
  const camL: CamKey[] = [{ f: 0, zoom: 1.08, x: 900, y: 420 }, { f: sFrom, zoom: 1.32, x: 640, y: 400 }];
  // El alta, ya desplazada: datos personales arriba, tarjeta y PayPal debajo (todo en una pantalla).
  const camS: CamKey[] = [
    { f: 0, zoom: 1.1, x: 1235, y: 300 }, { f: fNombre - 6 - sFrom, zoom: 1.5, x: 1235, y: 200 }, { f: fCorreo + 10 - sFrom, zoom: 1.5, x: 1235, y: 230 },
    { f: fTarjeta - 2 - sFrom, zoom: 1.32, x: 1235, y: 560 }, { f: fPaypal + 20 - sFrom, zoom: 1.32, x: 1210, y: 600 }, { f: fHoy + 10 - sFrom, zoom: 1.12, x: 1100, y: 520 },
  ];
  const marksS = [
    { from: fNombre - 2 - sFrom, to: fCorreo - 4 - sFrom, x: 952, y: 74, w: 566, h: 62, r: 16 },
    { from: fCorreo - 2 - sFrom, to: fTarjeta - 6 - sFrom, x: 952, y: 137, w: 566, h: 62, r: 16 },
    { from: fTarjeta - 2 - sFrom, to: fPaypal - 4 - sFrom, x: 956, y: 390, w: 558, h: 312, r: 16 },
    { from: fPaypal - 2 - sFrom, to: fHoy + 26 - sFrom, x: 952, y: 754, w: 470, h: 62, r: 14 },
  ];
  const sWin = spring({ frame: frame - 2, fps, config: { damping: 18, stiffness: 120 } });
  const nav = interpolate(frame, [sFrom, sFrom + 16], [0, 1], { ...clamp, easing: Easing.bezier(0.22, 1, 0.36, 1) });
  const navO = interpolate(frame, [sFrom, sFrom + 6], [0, 1], { ...clamp, easing: easeInOut });
  const LAND = fHoy + 6;
  const pS = interpolate(frame, [fHoy, LAND], [0, 1], { ...clamp, easing: (t) => t * t * t });
  const squash = interpolate(frame, [LAND, LAND + 3, LAND + 11], [1, 0.94, 1], { ...clamp, easing: easeOut });
  const ringS = interpolate(frame, [LAND, LAND + 16], [0, 1], { ...clamp, easing: easeOut });
  const sHold = spring({ frame: frame - (fAunque - 4), fps, config: { damping: 15, stiffness: 160 } });
  const sDias = interpolate(frame, [fDias - 4, fDias + 8], [0, 1], { ...clamp, easing: easeOut });
  const sComp = interpolate(frame, [fComprobar - 4, fComprobar + 8], [0, 1], { ...clamp, easing: easeOut });
  return (
    <AbcStage>
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 40, display: 'flex', justifyContent: 'center', gap: 16, zIndex: 5 }}>
          <Chip at={fWeb - 3} dimAt={fPon - 3} label="Desde la web" icon={<GlobeIcon size={30} />} size={36} reserve />
          <Chip at={fApp - 3} dimAt={fPon - 3} label="Desde la app, no" icon={<CrossIcon size={30} />} accent="#FDECEC" size={36} reserve />
          <Chip at={fNombre - 3} dimAt={fTarjeta - 3} label="Nombre y correo" icon={<UserIcon size={30} />} size={36} reserve />
          <Chip at={fTarjeta - 3} dimAt={fHoy - 3} label="Tarjeta o PayPal" icon={<CardIcon size={30} />} size={36} reserve />
        </div>
        <div style={{ position: 'absolute', left: (1920 - W) / 2, top: 140, opacity: sWin, transform: `translateY(${((1 - sWin) * 60).toFixed(2)}px) scale(${(0.94 + 0.06 * sWin).toFixed(4)})` }}>
          <TiltWindow width={W} url={frame < sFrom + 8 ? 'audiobooks.com/landing' : 'audiobooks.com/signup'} ry={-3} rx={2}>
            {frame < sFrom + 16 && (
              <div style={{ position: 'absolute', inset: 0, opacity: 1 - 0.6 * navO, transform: `scale(${(1 - 0.04 * nav).toFixed(4)})` }}>
                <ScreenClip src="abc/web/00_abc_landing/video.mp4" width={W} startAt={lStart} cursor={c00} camera={camL} markDim={0.55}
                  marks={[{ from: Math.round((m00.marks.to_signup - lStart) * fps), to: sFrom + 4, x: 326, y: 448, w: 418, h: 62, r: 14 }]} />
              </div>
            )}
            {frame >= sFrom && (
              <div style={{ position: 'absolute', inset: 0, opacity: navO, transform: `translateY(${((1 - nav) * 12).toFixed(2)}%) scale(${(0.985 + 0.015 * nav).toFixed(4)})` }}>
                <Sequence from={sFrom} layout="none">
                  <ScreenClip src="abc/web/01_abc_signup/video.mp4" width={W} startAt={37.5} holdAt={37.6} showCursor={false} camera={camS} marks={marksS} markDim={0.55} />
                </Sequence>
              </div>
            )}
          </TiltWindow>
        </div>
        {frame >= fHoy && (
          <div style={{ position: 'absolute', right: 150, top: 560, zIndex: 20, opacity: interpolate(pS, [0, 0.4], [0, 1], clamp),
            transform: `rotate(${(-14 + 6 * pS).toFixed(2)}deg) scale(${(frame < LAND ? 2.2 - 1.2 * pS : squash).toFixed(4)})` }}>
            {ringS > 0 && ringS < 1 && <div style={{ position: 'absolute', inset: 0, borderRadius: 30, border: `4px solid ${color.green}`, transform: `scale(${1 + 0.35 * ringS})`, opacity: 0.55 * (1 - ringS) }} />}
            <div style={{ padding: '22px 40px', borderRadius: 30, background: color.green, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 64, display: 'flex', alignItems: 'center', gap: 18,
              boxShadow: `0 ${(10 + 40 * (1 - pS)).toFixed(1)}px ${(30 + 60 * (1 - pS)).toFixed(1)}px rgba(31,157,85,${(0.45 - 0.2 * (1 - pS)).toFixed(3)})` }}>
              <CheckIcon size={64} c="#fff" fg={color.green} /> Hoy: 0 €
            </div>
          </div>
        )}
        {frame >= fAunque - 6 && (
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 44, display: 'flex', justifyContent: 'center', zIndex: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '18px 38px 18px 22px', borderRadius: 999, background: AB_INK, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 38,
              opacity: sHold, transform: `translateY(${((1 - sHold) * 40).toFixed(2)}px) scale(${(0.86 + 0.14 * sHold).toFixed(4)})`, boxShadow: '0 24px 60px rgba(16,16,16,0.3)' }}>
              <LockIcon size={44} c={AB_HOT} />
              <span>Pueden retener</span>
              <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8, color: AB_HOT }}>
                {frame >= fCatorce - 6 ? <Odometer text="14,95" at={fCatorce - 6} size={46} color={AB_HOT} /> : <span style={{ fontSize: 46 }}>…</span>} USD
              </span>
              <span style={{ opacity: sDias, display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap', verticalAlign: 'top', maxWidth: sDias * 200 }}>unos días</span>
              <span style={{ opacity: sComp, color: AB_SOFT, fontWeight: 500, display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap', verticalAlign: 'top', maxWidth: sComp * 440 }}>(comprueban la tarjeta)</span>
            </div>
          </div>
        )}
      </AbsoluteFill>
      <Sfx name="whoosh_soft" at={2} volume={0.5} />
      <Sfx name="ui_pop" at={fWeb - 2} volume={0.6} />
      <Sfx name="cross" at={fApp} volume={0.5} />
      <Sfx name="click" at={sFrom - 12} volume={0.8} />
      <Sfx name="swipe" at={sFrom + 2} volume={0.7} />
      <Sfx name="ui_pop" at={fNombre - 2} volume={0.5} />
      <Sfx name="tick_soft" at={fCorreo - 2} volume={0.5} />
      <Sfx name="ui_pop" at={fTarjeta - 2} volume={0.5} />
      <Sfx name="tick_soft" at={fPaypal - 2} volume={0.5} />
      <Sfx name="stamp" at={LAND} />
      <Sfx name="ui_pop" at={fAunque - 4} volume={0.6} />
      <ChangeTicks value={(f) => odometerShown('14,95', fCatorce - 6, fps, f)} from={fCatorce - 6} to={fCatorce + 32} volume={0.4} />
      <Sfx name="tick_soft" at={fComprobar - 2} volume={0.5} />
    </AbcStage>
  );
};

// F04 · Aquí no hay truco: si cancelas durante la prueba, pierdes los tres libros (las condiciones de SonorBooks: «Si cancelas
// durante la prueba pierdes los libros de prueba y VIP»). Escúchalos y, si no te convence, cancela en la web, desde tu cuenta, antes
// del día 30 (desde la app no se puede). En nuestra prueba, la app no dejó confirmar los dos VIP: «Get Access to VIP Rewards».
export const F04SinTruco: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('F04', w, n);
  const fTruco = at('truco');
  const fCancelas = at('cancelas');
  const fPierdes = at('pierdes');
  const fLibros = at('libros');
  const fEscuchalos = at('escuchalos');
  const fCancela = at('cancela', 1);
  const fWeb = at('web');
  const fCuenta = at('cuenta');
  const fAntes = at('antes');
  const fTreinta = at('treinta');
  const fDesde = at('desde', 1);
  const fApp = at('app');
  const fAh = at('ah');
  const fNuestra = at('nuestra');
  const fConfirmar = at('confirmar');
  const fVip = at('vip');
  // Móvil: la biblioteca con Elon Musk («Own», descargado), el perfil en prueba y, con «la app no nos dejó confirmar», el aviso
  // real de la selección VIP («This perk is only available to Audiobooks.com subscribers»).
  const s0: Shot = { rec: 'biblioteca_elon', at: 0, start: 3.0, hold: 14.5 };
  s0.marks = [markOn(s0, fPierdes - 2, fEscuchalos - 6, 18, 340, 466, 760, 26)];
  const s1: Shot = { rec: 'perfil_prueba', at: fCancela - 6, start: 3.0, hold: 12 };
  s1.marks = [markOn(s1, fCancela, fAh - 8, 30, 540, 604, 190, 26)];
  const s2 = align('vip_prueba', 37.6, fConfirmar - 6, Math.max(10, fConfirmar - 6 - fAh + 6), { hold: 52 });
  s2.marks = [markOn(s2, fConfirmar - 2, dur + 20, 96, 544, 476, 386, 22)];
  const cx = 470;
  const top = Math.round((1080 - PH.H) / 2);
  const cam = buildPhoneCam({ dur, side: 1, cx, top, enter: 'rise', exit: 'none', focus: [
    { from: fPierdes, to: fEscuchalos - 8, y: 720, s: 1.2 }, { from: fCancela + 2, to: fAh - 10, y: 640, s: 1.4 }, { from: fConfirmar, to: dur, y: 740, s: 1.35 },
  ] });
  const sBadge = spring({ frame: frame - fTruco + 4, fps, config: { damping: 12, stiffness: 190 } });
  const sBooks = spring({ frame: frame - (fCancelas - 4), fps, config: { damping: 15, stiffness: 160 } });
  const lose = (k: number) => interpolate(frame, [fPierdes + 2 + k * 6, fPierdes + 14 + k * 6], [0, 1], { ...clamp, easing: easeOut });
  const sBar = spring({ frame: frame - (fEscuchalos - 8), fps, config: { damping: 16, stiffness: 150 } });
  const fill = interpolate(frame, [fEscuchalos, fTreinta + 6], [0, 0.93], { ...clamp, easing: easeInOut });
  const sCut = spring({ frame: frame - (fAntes - 2), fps, config: { damping: 11, stiffness: 220 } });
  const sWeb = spring({ frame: frame - (fWeb - 4), fps, config: { damping: 14, stiffness: 180 } });
  const cta = interpolate(frame, [fCuenta - 4, fCuenta + 8], [0, 1], { ...clamp, easing: easeOut });
  const sApp = spring({ frame: frame - (fApp - 2), fps, config: { damping: 12, stiffness: 200 } });
  const sNote = spring({ frame: frame - (fNuestra - 6), fps, config: { damping: 14, stiffness: 170 } });
  const days = 30;
  const BW = 900;
  const books = [{ tone: 'orange' as const, label: <CreditCoin size={34} /> }, { tone: 'teal' as const, label: <VipBadge size={24} style={{ background: 'rgba(255,255,255,0.22)' }} /> }, { tone: 'teal' as const, label: <VipBadge size={24} style={{ background: 'rgba(255,255,255,0.22)' }} /> }];
  return (
    <AbcStage>
      <PhoneHalo cam={cam} cx={cx} />
      <div style={{ position: 'absolute', top, left: cx - PH.W / 2 }}>
        <AppPhone shots={[s0, s1, s2]} w={PHONE_W} cam={cam} dim={0.72} motionBlur float={[0, dur]} />
      </div>
      <div style={{ position: 'absolute', left: 860, top: 0, height: 1080, width: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, alignSelf: 'flex-start', padding: '12px 28px 12px 16px', borderRadius: 999, background: AB_INK, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 36,
          opacity: sBadge, transform: `scale(${(0.7 + 0.3 * sBadge).toFixed(4)}) rotate(${((1 - sBadge) * -6).toFixed(2)}deg)`, transformOrigin: 'left center' }}>
          <span style={{ width: 52, height: 52, borderRadius: '50%', background: color.red, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <CrossIcon size={40} c="#fff" fg={color.red} />
          </span>
          Aquí no hay truco
        </div>
        <MaskTitle text={'Si cancelas en la prueba,\npierdes los 3 libros'} hi="pierdes" at={fCancelas - 6} size={66} style={{ marginTop: 28 }} />
        {/* Los tres libros de la prueba, que se pierden si cancelas. */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 30, opacity: sBooks, transform: `translateY(${((1 - sBooks) * 30).toFixed(2)}px)` }}>
          {books.map((b, k) => {
            const l = lose(k);
            return (
              <div key={k} style={{ position: 'relative', transform: `rotate(${(l * (k - 1) * 8).toFixed(2)}deg) translateY(${(l * 10).toFixed(2)}px)` }}>
                <div style={{ filter: l > 0.02 ? `grayscale(${l.toFixed(3)})` : undefined, opacity: 1 - 0.45 * l }}><MiniBook w={70} tone={b.tone} label={b.label} /></div>
                {l > 0 && (
                  <svg width="70" height="86" viewBox="0 0 70 86" style={{ position: 'absolute', left: 0, top: 0 }}>
                    <path d="M12 12 L58 74 M58 12 L12 74" stroke={color.red} strokeWidth={7} strokeLinecap="round" strokeDasharray={80} strokeDashoffset={80 * (1 - l)} />
                  </svg>
                )}
              </div>
            );
          })}
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: color.red, marginLeft: 8, opacity: lose(2) }}>Los de prueba y los VIP</div>
        </div>
        {/* Los 30 días: escúchalos y, si no te convence, cancela antes del final. */}
        <div style={{ position: 'relative', width: BW, marginTop: 84, opacity: sBar, transform: `translateY(${((1 - sBar) * 30).toFixed(2)}px)` }}>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${days}, 1fr)`, gap: 5, height: 52 }}>
            {Array.from({ length: days }, (_, i) => {
              const on = fill * days > i;
              return <div key={i} style={{ borderRadius: 7, background: on ? `linear-gradient(180deg, ${AB_HOT} 0%, ${AB} 100%)` : '#EFEFF3', boxShadow: on ? '0 6px 14px rgba(255,80,28,0.22)' : undefined }} />;
            })}
          </div>
          <div style={{ position: 'absolute', left: -4, top: -54, display: 'flex', alignItems: 'center', gap: 10, fontFamily: font.sans, fontWeight: 700, fontSize: 28, color: AB_DEEP }}>
            <ClockIcon size={32} c={AB_DEEP} /> Escúchalos
          </div>
          <div style={{ position: 'absolute', right: -6, top: -58, display: 'flex', alignItems: 'center', gap: 10, padding: '6px 16px', borderRadius: 999, background: color.red, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 28,
            opacity: sCut, transform: `translateY(${((1 - sCut) * 14).toFixed(2)}px) scale(${(0.7 + 0.3 * sCut).toFixed(4)})`, transformOrigin: 'right center' }}>
            <CalendarIcon size={30} c="#fff" /> Cancela antes del día 30
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 34 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 28px 14px 18px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.float,
            fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: color.ink, opacity: sWeb, transform: `translateY(${((1 - sWeb) * 24).toFixed(2)}px)` }}>
            <GlobeIcon size={38} /> <span>En la web<span style={{ opacity: cta, display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap', verticalAlign: 'top', maxWidth: cta * 330 }}>, desde tu cuenta</span></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 28px 14px 18px', borderRadius: 999, background: '#FDECEC', border: '2px solid rgba(229,72,77,0.3)',
            fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: color.ink, opacity: sApp, transform: `translateY(${((1 - sApp) * 24).toFixed(2)}px) scale(${(0.9 + 0.1 * sApp).toFixed(4)})`, transformOrigin: 'left center' }}>
            <CrossIcon size={38} /> Desde la app, no
          </div>
        </div>
        <div style={{ marginTop: 30, minHeight: 100 }}>
          {frame >= fNuestra - 8 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, alignSelf: 'flex-start', padding: '18px 28px', borderRadius: 26, background: '#fff', border: `2px dashed ${AB_TEAL}`,
              fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.ink, opacity: sNote, transform: `translateY(${((1 - sNote) * 24).toFixed(2)}px) scale(${(0.9 + 0.1 * sNote).toFixed(4)})`, transformOrigin: 'left center', width: 'fit-content' }}>
              <VipBadge size={40} />
              <span>En nuestra prueba, la app no dejó confirmar los 2 VIP</span>
            </div>
          )}
        </div>
      </div>
      <Sfx name="ui_pop" at={fTruco - 2} volume={0.7} />
      <Sfx name="hit_soft" at={fPierdes} volume={0.6} />
      {[0, 1, 2].map((k) => <Sfx key={`x${k}`} name="cross" at={fPierdes + 4 + k * 6} volume={0.45} />)}
      <Sfx name="draw" at={fEscuchalos} volume={0.45} dur={Math.max(10, fTreinta - fEscuchalos)} fade={8} />
      <Sfx name="ui_pop" at={fAntes} volume={0.6} />
      <Sfx name="ui_pop" at={fWeb - 2} volume={0.6} />
      <Sfx name="cross" at={fApp + 2} volume={0.6} />
      <Sfx name="whoosh_soft" at={fAh} volume={0.4} />
      <Sfx name="ui_pop" at={fNuestra - 4} volume={0.6} />
      <Sfx name="hit_soft" at={fVip} volume={0.45} />
      <Sfx name="tick_soft" at={fDesde} volume={0.4} />
    </AbcStage>
  );
};

// F05 · ¿Dudas? En SonorBooks comparas precio, horas y días gratis (la comparativa de plataformas, grabación real).
export const F05Compara: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('F05', w, n);
  const fDudas = at('dudas');
  const fSonor = at('sonorbooks');
  const fPrecio = at('precio');
  const fHoras = at('horas');
  const fDias = at('dias');
  const W = 1400;
  const sWin = spring({ frame: frame - (fSonor - 10), fps, config: { damping: 18, stiffness: 120 } });
  const sQ = spring({ frame: frame - fDudas, fps, config: { damping: 15, stiffness: 160 } });
  const qOut = interpolate(frame, [fSonor - 12, fSonor], [0, 1], { ...clamp, easing: easeInOut });
  const rate = 7.5;
  const cam: CamKey[] = [{ f: 0, zoom: 1.0, x: 960, y: 540 }, { f: fPrecio - fSonor, zoom: 1.12, x: 760, y: 560 }, { f: fDias - fSonor + 20, zoom: 1.1, x: 960, y: 560 }];
  return (
    <AbcStage>
      <AbsoluteFill>
        {qOut < 1 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: sQ * (1 - qOut), transform: `scale(${(0.9 + 0.1 * sQ - 0.05 * qOut).toFixed(4)})` }}>
            <MaskTitle text="¿Dudas entre Audiobooks.com y otras?" hi="otras" at={2} size={84} align="center" />
          </div>
        )}
        {frame >= fSonor - 12 && (
          <div style={{ position: 'absolute', left: (1920 - W) / 2, top: 120, opacity: sWin, transform: `translateY(${((1 - sWin) * 80).toFixed(2)}px) scale(${(0.94 + 0.06 * sWin).toFixed(4)})`, transformOrigin: '50% 0%' }}>
            <TiltWindow width={W} url="sonorbooks.com/es/plataformas" ry={-3} rx={2}>
              <Sequence from={fSonor - 10} layout="none">
                <ScreenClip src="str/web/10_sb_plataformas/video.mp4" width={W} startAt={Math.max(0, ms10.marks.scroll - 0.6)} playbackRate={rate} showCursor={false} camera={cam} />
              </Sequence>
            </TiltWindow>
          </div>
        )}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 34, display: 'flex', justifyContent: 'center', gap: 16, zIndex: 10 }}>
          <Chip at={fPrecio - 3} label="Precio" icon={<CardIcon size={30} />} size={36} reserve />
          <Chip at={fHoras - 3} label="Horas" icon={<ClockIcon size={30} />} size={36} reserve />
          <Chip at={fDias - 3} label="Días gratis" icon={<CalendarIcon size={30} />} size={36} reserve />
        </div>
      </AbsoluteFill>
      <Sfx name="ui_pop" at={fDudas} volume={0.6} />
      <Sfx name="whoosh_soft" at={fSonor - 10} volume={0.7} />
      <Sfx name="ui_pop" at={fPrecio - 2} volume={0.6} />
      <Sfx name="ui_pop" at={fHoras - 2} volume={0.6} />
      <Sfx name="ui_pop" at={fDias - 2} volume={0.6} />
    </AbcStage>
  );
};

// F06 · Cierre de marca con espacio libre para la pantalla final de YouTube y el aviso de afiliado (Audiobooks.com está en
// SonorBooks con enlace de afiliado).
export const F06Outro: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('F06', w, n);
  const fDonde = at('donde');
  const fTu = at('tu');
  const fProx = at('proximo');
  const fLibro = at('libro');
  const fSonor = at('sonorbooks');
  const fEn = fSonor - 6; // «en» va justo antes de «SonorBooks» (buscar «en» daría con «Encuentra»)
  const query = 'Tu próximo libro';
  const keys = typeTimesSpoken(query, [[fTu - 3, fProx - 3], [fProx - 2, fLibro - 3], [fLibro - 2, fEn - 4]], 'f06');
  const end = fSonor + 34;
  return (
    <AbcStage>
      <Phase from={0} to={end + 2}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 56 }}>
          <Logo size={120} delay={2} />
          <div style={{ width: 1160, height: 104, borderRadius: 999, background: '#fff', boxShadow: shadow.float, border: `1px solid ${color.line}`, display: 'flex', alignItems: 'center', padding: '0 18px 0 46px', gap: 24 }}>
            <svg width="38" height="38" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" stroke={color.ink} strokeWidth="2.4" fill="none" /><path d="M15.5 15.5 L21 21" stroke={color.ink} strokeWidth="2.4" strokeLinecap="round" /></svg>
            <div style={{ flex: 1, fontFamily: font.sans, fontSize: 42, color: color.ink }}>
              <Typewriter text={query} times={keys} placeholder="Busca un libro" />
            </div>
          </div>
          <div style={{ fontFamily: font.sans, fontSize: 34, color: color.ink2, opacity: spring({ frame: frame - fDonde, fps }) }}>Dónde escucharlo, y a qué precio</div>
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
      <Keystrokes text={query} times={keys} volume={0.9} seed="f06" />
      <Sfx name="logo_sting" at={end + 5} volume={0.6} />
    </AbcStage>
  );
};

export { AB_SOFT, AB_TEAL };
