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
import { CalendarIcon, CardIcon, ClockIcon, DocIcon, GlobeIcon, PhoneIcon, StarIcon, UserIcon } from '../../components/Icons2';
import { TiltWindow } from '../nxr/Verdict';
import { wf } from './timeline';
import {
  AppPhone, AU, AU_DEEP, AU_HOT, AU_NAVY, AU_SOFT, AudibleLogo, AudStage, Burst, buildPhoneCam, Chip, LinkBadge, markOn, MaskTitle, PH, PhoneHalo, PHONE_W, Shot,
} from './kit';
import type { SceneProps } from './registry';
import m00 from '../../../public/aud/web/00_au_prueba/meta.json';
import c00 from '../../../public/aud/web/00_au_prueba/cursor.json';
import m10 from '../../../public/aud/web/10_sb_plataformas/meta.json';
import c10 from '../../../public/aud/web/10_sb_plataformas/cursor.json';
import m11 from '../../../public/aud/web/11_sb_ficha/meta.json';
import c11 from '../../../public/aud/web/11_sb_ficha/cursor.json';
import ms10 from '../../../public/str/web/10_sb_plataformas/meta.json';

type P = SceneProps;

// H01 · «Hasta noventa días gratis desde SonorBooks»: el sello naranja cuenta de 1 a 90 con «hasta» y, debajo, las dos pruebas:
// 30 días gratis (la tarjeta de Audible en SonorBooks, con sus condiciones literales) o 90 con Amazon Prime (audible.es, 14/10/2026:
// «Exclusivo para miembros Prime. Los nuevos suscriptores de Audible Premium obtendrán 3 meses de prueba gratis»).
export const H01Gratis: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('H01', w, n);
  const fSonor = at('sonorbooks');
  const fHasta = at('hasta');
  const fNoventa = at('noventa');
  const fTreinta = at('treinta');
  const fNoventa2 = at('noventa', 1);
  const LAND = fNoventa + 8;
  const badgeAt = fHasta - 14;
  const rollFrom = badgeAt - 2;
  const rollAt = (f: number) => Math.max(1, Math.floor(interpolate(f, [rollFrom, LAND], [1, 90], { ...clamp, easing: Easing.bezier(0.45, 0, 0.25, 1) }) + 1e-6));
  const roll = rollAt(frame);
  const steps: number[] = [];
  for (let f = rollFrom; f <= LAND; f++) if (rollAt(f) !== rollAt(f - 1)) steps.push(f);
  const lastStep = steps.filter((f) => f <= frame).pop();
  const since = lastStep === undefined ? 99 : frame - lastStep;
  const kick = since < 4 ? [1, 0.5, 0.18, 0][since] : 0;
  const sBadge = spring({ frame: frame - badgeAt, fps, config: { damping: 12, stiffness: 150 } });
  const sHasta = spring({ frame: frame - (fHasta - 3), fps, config: { damping: 14, stiffness: 190 } });
  const sLogo = spring({ frame: frame - (fSonor - 10), fps, config: { damping: 16, stiffness: 150 } });
  const sA = spring({ frame: frame - (fTreinta - 3), fps, config: { damping: 14, stiffness: 180 } });
  const sB = spring({ frame: frame - (fNoventa2 - 3), fps, config: { damping: 13, stiffness: 190 } });
  const sFine = spring({ frame: frame - (fNoventa2 + 8), fps, config: { damping: 16, stiffness: 150 } });
  const rays = frame * 0.25;
  const bump = frame < LAND ? 0 : frame < LAND + 2 ? (frame - LAND) / 2 : interpolate(frame, [LAND + 2, LAND + 20], [1, 0], { ...clamp, easing: easeOut });
  const pill = (s: number, hot: boolean, icon: React.ReactNode, text: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 30px 12px 18px', borderRadius: 999, background: hot ? AU_SOFT : '#fff',
      border: hot ? '2px solid rgba(247,153,28,0.5)' : `1px solid ${color.line}`, boxShadow: shadow.float, fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.ink,
      opacity: s, transform: `translateY(${((1 - s) * 30).toFixed(2)}px) scale(${(0.9 + 0.1 * s).toFixed(4)})` }}>
      {icon} {text}
    </div>
  );
  return (
    <AudStage>
      <AbsoluteFill>
        <div style={{ position: 'absolute', top: 70, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, opacity: sLogo, transform: `translateY(${((1 - sLogo) * -30).toFixed(2)}px)` }}>
          <AudibleLogo width={250} />
          <span style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 34, color: color.ink2 }}>desde</span>
          <Logo size={58} animate={false} />
        </div>
        {frame < badgeAt + 4 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 30 }}>
            <MaskTitle text="¿Quieres probarlo?" hi="probarlo" at={lead - 4} size={124} align="center" out={badgeAt - 2} />
          </div>
        )}
        {/* El sello: «hasta» + el contador (1 → 90) + «días gratis». */}
        <div style={{ position: 'absolute', left: 960 - 260, top: 150, width: 520, height: 520, transform: `scale(${(sBadge * (1 + 0.07 * bump)).toFixed(4)})` }}>
          <svg width="520" height="520" viewBox="0 0 560 560" style={{ position: 'absolute', inset: 0, transform: `rotate(${rays}deg)` }}>
            {Array.from({ length: 24 }).map((_, i) => (
              <path key={i} d="M280 280 L 268 0 L 292 0 Z" fill={AU} opacity={0.18} transform={`rotate(${i * 15} 280 280)`} />
            ))}
          </svg>
          <div style={{ position: 'absolute', inset: 64, borderRadius: '50%', background: `linear-gradient(160deg, ${AU} 0%, ${AU_HOT} 100%)`, boxShadow: '0 40px 100px rgba(247,120,28,0.45)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 46, letterSpacing: 1, color: '#fff', opacity: 0.95 * sHasta, transform: `translateY(${((1 - sHasta) * 12).toFixed(2)}px)`, marginBottom: 2 }}>hasta</div>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 196, letterSpacing: -9, lineHeight: 0.86, color: '#fff', fontVariantNumeric: 'tabular-nums', transform: `translateY(${(kick * -10).toFixed(1)}px)` }}>{roll}</div>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: '#fff', letterSpacing: -1, marginTop: 8 }}>días gratis</div>
          </div>
        </div>
        <Burst at={LAND} x={960} y={410} r={200} seed="h01" colors={[AU, color.yellow, AU_HOT, AU_NAVY]} />
        {/* Las dos pruebas: la de la tarjeta de SonorBooks (condiciones literales) y la de Amazon Prime. */}
        <div style={{ position: 'absolute', top: 712, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 22 }}>
          {pill(sA, false, <CalendarIcon size={40} c={AU_DEEP} />, '30 días gratis · Después, 9,99 €/mes')}
          {pill(sB, true, <StarIcon size={40} c={AU_DEEP} />, '90 días con Amazon Prime')}
        </div>
        <div style={{ position: 'absolute', top: 818, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: sFine, transform: `translateY(${((1 - sFine) * 20).toFixed(2)}px)`,
          fontFamily: font.sans, fontWeight: 500, fontSize: 25, color: color.ink2 }}>
          <div>«Prueba para cuentas que cumplan las condiciones. Hay títulos de compra adicional.»</div>
          <div>Los 90 días con Prime, para nuevos suscriptores de Audible Premium (audible.es).</div>
        </div>
      </AbsoluteFill>
      <Sfx name="ui_pop" at={badgeAt + 2} volume={0.8} />
      <Sfx name="riser" at={LAND - 6} volume={0.6} />
      <ChangeTicks value={(f) => String(rollAt(f))} from={rollFrom} to={LAND} volume={0.55} />
      <Sfx name="impact" at={LAND} />
      <Sfx name="sparkle" at={LAND + 2} volume={0.8} />
      <Sfx name="ui_pop" at={fTreinta - 2} volume={0.6} />
      <Sfx name="ui_pop" at={fNoventa2 - 2} volume={0.65} />
    </AudStage>
  );
};

// H02 · Desde SonorBooks (grabaciones reales): la tarjeta de Audible en Plataformas (con sus condiciones) y la ficha de un
// libro que está en Audible («La sombra del viento»: «Nuestra recomendación», «Empezar prueba gratuita»); y el enlace
// directo y la reseña escrita, en la descripción.
export const H02Desde: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('H02', w, n);
  const fPlat = at('plataformas');
  const fFicha = at('ficha');
  const fAud = at('audible');
  const fDesc = at('descripcion');
  const fEnlace = at('enlace');
  const fRes = at('resena');
  const W = 1500;
  // Clip A (Plataformas): el ratón llega a la tarjeta con «plataformas» y abre las condiciones.
  const aStart = Math.max(0, m10.marks.to_card - (fPlat - 2) / fps);
  const bFrom = fFicha - 6;
  // Clip B (ficha): el clic en «Empezar prueba gratuita» cae con «Audible».
  const bStart = Math.max(0, m11.marks.click_btn - (fAud + 2 - bFrom) / fps);
  const camA: CamKey[] = [
    { f: 0, zoom: 1.05, x: 960, y: 540 }, { f: fPlat - 2, zoom: 1.12, x: 760, y: 470 }, { f: fPlat + 30, zoom: 1.5, x: 560, y: 470 }, { f: fFicha, zoom: 1.5, x: 560, y: 500 },
  ];
  const camB: CamKey[] = [
    { f: 0, zoom: 1.04, x: 960, y: 540 }, { f: fAud - 14 - bFrom, zoom: 1.35, x: 1270, y: 480 }, { f: fAud + 30 - bFrom, zoom: 1.4, x: 1270, y: 560 }, { f: 600, zoom: 1.3, x: 1220, y: 600 },
  ];
  const marksA = [{ from: fPlat + 6, to: fFicha - 8, x: 258, y: 229, w: 690, h: 389, r: 26 }];
  const marksB = [{ from: fAud - 4 - bFrom, to: dur + 20 - bFrom, x: 950, y: 373, w: 650, h: 384, r: 22 }];
  const sWin = spring({ frame: frame - 2, fps, config: { damping: 18, stiffness: 120 } });
  const nav = interpolate(frame, [bFrom, bFrom + 16], [0, 1], { ...clamp, easing: Easing.bezier(0.22, 1, 0.36, 1) });
  const navO = interpolate(frame, [bFrom, bFrom + 6], [0, 1], { ...clamp, easing: easeInOut });
  const shrink = interpolate(frame, [fDesc - 10, fDesc + 8], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <AudStage>
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: (1920 - W) / 2, top: 130, opacity: sWin, transform: `translateY(${((1 - sWin) * 60 - 40 * shrink).toFixed(2)}px) scale(${((0.94 + 0.06 * sWin) * (1 - 0.1 * shrink)).toFixed(4)})`, transformOrigin: '50% 0%' }}>
          <TiltWindow width={W} url={frame < bFrom + 8 ? 'sonorbooks.com/es/plataformas' : 'sonorbooks.com/es/audiolibro/la-sombra-del-viento'} ry={-3} rx={2}>
            {frame < bFrom + 16 && (
              <div style={{ position: 'absolute', inset: 0, opacity: 1 - 0.6 * navO, transform: `scale(${(1 - 0.04 * nav).toFixed(4)})` }}>
                <ScreenClip src="aud/web/10_sb_plataformas/video.mp4" width={W} startAt={aStart} cursor={c10} camera={camA} marks={marksA} markDim={0.55} />
              </div>
            )}
            {frame >= bFrom && (
              <div style={{ position: 'absolute', inset: 0, opacity: navO, transform: `translateY(${((1 - nav) * 12).toFixed(2)}%) scale(${(0.985 + 0.015 * nav).toFixed(4)})` }}>
                <Sequence from={bFrom} layout="none">
                  <ScreenClip src="aud/web/11_sb_ficha/video.mp4" width={W} startAt={bStart} cursor={c11} camera={camB} marks={marksB} markDim={0.55} />
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
      <Sfx name="ui_pop" at={fPlat - 2} volume={0.6} />
      <Sfx name="click" at={Math.round(fPlat - 2 + (m10.marks.click_cond - m10.marks.to_card) * fps)} volume={0.7} />
      <Sfx name="swipe" at={bFrom + 2} volume={0.8} />
      <Sfx name="ui_pop" at={fFicha - 2} volume={0.6} />
      <Sfx name="click" at={fAud + 2} volume={0.8} />
      <Sfx name="ui_pop" at={fDesc - 1} volume={0.8} />
      <Sfx name="ui_pop" at={fEnlace - 2} volume={0.6} />
      <Sfx name="sparkle" at={fRes - 2} volume={0.8} />
    </AudStage>
  );
};

// H03 · En audible.es (grabación real, sin rellenar nada): «Prueba Audible gratis · 30 días de prueba»; entras con tu cuenta
// de Amazon, confirmas la forma de pago y hoy no pagas nada (sello «Hoy: 0 €»).
export const H03Alta: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('H03', w, n);
  const fEntra = at('entra');
  const fAmazon = at('amazon');
  const fConf = at('confirma');
  const fPago = at('pago');
  const fHoy = at('hoy');
  const W = 1500;
  // El clic (falso) en «30 días de prueba» cae con «Amazon».
  const start = Math.max(0, m00.marks.click_btn - (fAmazon + 2) / fps);
  const cam: CamKey[] = [{ f: 0, zoom: 1.04, x: 960, y: 540 }, { f: fEntra, zoom: 1.12, x: 760, y: 520 }, { f: fAmazon + 10, zoom: 1.55, x: 600, y: 470 }, { f: dur, zoom: 1.6, x: 600, y: 480 }];
  const sWin = spring({ frame: frame - 2, fps, config: { damping: 18, stiffness: 120 } });
  const LAND = fHoy + 6;
  const pS = interpolate(frame, [fHoy, LAND], [0, 1], { ...clamp, easing: (t) => t * t * t });
  const squash = interpolate(frame, [LAND, LAND + 3, LAND + 11], [1, 0.94, 1], { ...clamp, easing: easeOut });
  const ringS = interpolate(frame, [LAND, LAND + 16], [0, 1], { ...clamp, easing: easeOut });
  return (
    <AudStage>
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 40, display: 'flex', justifyContent: 'center', gap: 16, zIndex: 5 }}>
          <Chip at={fEntra - 3} dimAt={fConf - 3} label="Tu cuenta de Amazon" icon={<UserIcon size={30} />} size={36} reserve />
          <Chip at={fConf - 3} dimAt={fHoy - 3} label="Tu forma de pago" icon={<CardIcon size={30} />} size={36} reserve />
        </div>
        <div style={{ position: 'absolute', left: (1920 - W) / 2, top: 140, opacity: sWin, transform: `translateY(${((1 - sWin) * 60).toFixed(2)}px) scale(${(0.94 + 0.06 * sWin).toFixed(4)})` }}>
          <TiltWindow width={W} url="audible.es/ep/prueba-gratis" ry={-3} rx={2}>
            <ScreenClip src="aud/web/00_au_prueba/video.mp4" width={W} startAt={start} holdAt={m00.marks.scroll - 0.2} cursor={c00} camera={cam} markDim={0.55}
              marks={[{ from: fAmazon + 6, to: dur + 20, x: 448, y: 490, w: 206, h: 70, r: 35 }]} />
          </TiltWindow>
        </div>
        {frame >= fHoy && (
          <div style={{ position: 'absolute', right: 150, top: 640, zIndex: 20, opacity: interpolate(pS, [0, 0.4], [0, 1], clamp),
            transform: `rotate(${(-14 + 6 * pS).toFixed(2)}deg) scale(${(frame < LAND ? 2.2 - 1.2 * pS : squash).toFixed(4)})` }}>
            {ringS > 0 && ringS < 1 && <div style={{ position: 'absolute', inset: 0, borderRadius: 30, border: `4px solid ${color.green}`, transform: `scale(${1 + 0.35 * ringS})`, opacity: 0.55 * (1 - ringS) }} />}
            <div style={{ padding: '22px 40px', borderRadius: 30, background: color.green, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 64, display: 'flex', alignItems: 'center', gap: 18,
              boxShadow: `0 ${(10 + 40 * (1 - pS)).toFixed(1)}px ${(30 + 60 * (1 - pS)).toFixed(1)}px rgba(31,157,85,${(0.45 - 0.2 * (1 - pS)).toFixed(3)})` }}>
              <CheckIcon size={64} c="#fff" fg={color.green} /> Hoy: 0 €
            </div>
          </div>
        )}
      </AbsoluteFill>
      <Sfx name="whoosh_soft" at={2} volume={0.5} />
      <Sfx name="ui_pop" at={fEntra - 2} volume={0.6} />
      <Sfx name="click" at={fAmazon + 2} volume={0.8} />
      <Sfx name="zoom_in" at={fAmazon + 6} volume={0.45} />
      <Sfx name="ui_pop" at={fConf - 2} volume={0.6} />
      <Sfx name="stamp" at={LAND} />
      <Sfx name="tick_soft" at={fPago} volume={0.5} />
    </AudStage>
  );
};

// H04 · El truco comprobado: cancelamos la prueba el primer día y Audible mantiene Premium hasta el final (la app: «Has
// cancelado tu plan · Tu suscripción finaliza el 13 de noviembre de 2026»). Se cancela en la web de Audible o en Amazon;
// desde la app no (su ayuda lo dice).
export const H04Truco: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('H04', w, n);
  const fTruco = at('truco');
  const fComp = at('comprobado');
  const fCanc = at('cancelas');
  const fPrimer = at('primer');
  const fSigues = at('sigues');
  const fTerm = at('terminan');
  const fTreinta = at('treinta');
  const fCancela = at('cancela', 1);
  const fWeb = at('web');
  const fAmazon = at('amazon');
  const fApp = at('app');
  // Móvil: la suscripción real («Has cancelado tu plan… finaliza el 13 de noviembre») y Premium «Termina el 13 nov. 2026».
  // 19_suscripcion limpia entre 18,25 y 22,5 s (antes sale el círculo de «actualizar» encima del aviso).
  const s0: Shot = { rec: '19_suscripcion', at: 0, start: 18.3, hold: 22.3 };
  s0.marks = [markOn(s0, fCanc - 2, fSigues - 6, 14, 140, 636, 180, 22), markOn(s0, fSigues - 2, fCancela - 6, 30, 470, 604, 150, 22)];
  const cx = 470;
  const top = Math.round((1080 - PH.H) / 2);
  const cam = buildPhoneCam({ dur, side: 1, cx, top, enter: 'rise', exit: 'none', focus: [{ from: fCanc, to: fSigues - 4, y: 260, s: 1.45 }, { from: fSigues, to: fCancela - 4, y: 520, s: 1.35 }] });
  const sBadge = spring({ frame: frame - fTruco + 4, fps, config: { damping: 12, stiffness: 190 } });
  const sOk = spring({ frame: frame - fComp, fps, config: { damping: 11, stiffness: 210 } });
  const sBar = spring({ frame: frame - (fCanc - 8), fps, config: { damping: 16, stiffness: 150 } });
  const fill = interpolate(frame, [fSigues - 2, fTreinta + 6], [0, 1], { ...clamp, easing: easeInOut });
  const xDay1 = spring({ frame: frame - fPrimer, fps, config: { damping: 11, stiffness: 220 } });
  const sEnd = spring({ frame: frame - fTreinta, fps, config: { damping: 12, stiffness: 200 } });
  const sWeb = spring({ frame: frame - fCancela + 2, fps, config: { damping: 14, stiffness: 180 } });
  const sApp = spring({ frame: frame - fApp + 2, fps, config: { damping: 12, stiffness: 200 } });
  const amz = interpolate(frame, [fAmazon - 2, fAmazon + 8], [0, 1], { ...clamp, easing: easeOut });
  const days = 30;
  const BW = 940;
  return (
    <AudStage>
      <PhoneHalo cam={cam} cx={cx} />
      <div style={{ position: 'absolute', top, left: cx - PH.W / 2 }}>
        <AppPhone shots={[s0]} w={PHONE_W} cam={cam} dim={0.72} motionBlur float={[0, dur]} />
      </div>
      <div style={{ position: 'absolute', left: 860, top: 0, height: 1080, width: 980, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, alignSelf: 'flex-start', padding: '12px 28px 12px 16px', borderRadius: 999, background: AU_NAVY, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 36,
          opacity: sBadge, transform: `scale(${(0.7 + 0.3 * sBadge).toFixed(4)}) rotate(${((1 - sBadge) * -6).toFixed(2)}deg)`, transformOrigin: 'left center' }}>
          <span style={{ width: 52, height: 52, borderRadius: '50%', background: color.green, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${(0.4 + 0.6 * sOk).toFixed(4)})` }}>
            <CheckIcon size={40} c="#fff" fg={color.green} />
          </span>
          Truco comprobado
        </div>
        <MaskTitle text="Cancela y sigue escuchando" hi="escuchando" at={fCanc - 6} size={76} style={{ marginTop: 34 }} />
        {/* Los 30 días: el día 1 cancelas y la barra se llena hasta el final de la prueba. */}
        {/* marginTop 92: las etiquetas «Día 1» y «Día 30» (a 64 px por encima de la barra) quedan 28 px por debajo del título. */}
        <div style={{ position: 'relative', width: BW, marginTop: 92, opacity: sBar, transform: `translateY(${((1 - sBar) * 30).toFixed(2)}px)` }}>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${days}, 1fr)`, gap: 5, height: 64 }}>
            {Array.from({ length: days }, (_, i) => {
              const on = fill * days > i;
              return <div key={i} style={{ borderRadius: 8, background: on ? `linear-gradient(180deg, ${AU} 0%, ${AU_HOT} 100%)` : '#EFEFF3', boxShadow: on ? '0 6px 14px rgba(247,120,28,0.25)' : undefined }} />;
            })}
          </div>
          {/* Día 1: cancelas */}
          <div style={{ position: 'absolute', left: -6, top: -64, display: 'flex', alignItems: 'center', gap: 10, fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.red,
            opacity: xDay1, transform: `translateY(${((1 - xDay1) * 16).toFixed(2)}px)` }}>
            <span style={{ width: 40, height: 40, borderRadius: '50%', background: '#FDECEC', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><CrossIcon size={28} /></span>
            Día 1: cancelas
          </div>
          <div style={{ position: 'absolute', right: -6, top: -64, fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.ink, opacity: sEnd, transform: `translateY(${((1 - sEnd) * 16).toFixed(2)}px)` }}>
            Día 30
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18, fontFamily: font.sans, fontWeight: 700, fontSize: 32 }}>
            <span style={{ color: AU_DEEP, opacity: interpolate(frame, [fSigues, fSigues + 10], [0, 1], clamp) }}>Sigues escuchando…</span>
            <span style={{ color: color.green, opacity: sEnd }}>…sin pagar nada</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, alignSelf: 'flex-start', padding: '16px 30px 16px 20px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.float,
            fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.ink, opacity: sWeb, transform: `translateY(${((1 - sWeb) * 24).toFixed(2)}px)` }}>
            <GlobeIcon size={42} /> <span>Cancela en audible.es<span style={{ opacity: amz, display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap', verticalAlign: 'top', maxWidth: amz * 280 }}>&nbsp;o en Amazon</span></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, alignSelf: 'flex-start', padding: '16px 30px 16px 20px', borderRadius: 999, background: '#FDECEC', border: '2px solid rgba(229,72,77,0.3)',
            fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.ink, opacity: sApp, transform: `translateY(${((1 - sApp) * 24).toFixed(2)}px) scale(${(0.9 + 0.1 * sApp).toFixed(4)})`, transformOrigin: 'left center' }}>
            <CrossIcon size={42} /> Desde la app, no
          </div>
        </div>
      </div>
      <Sfx name="ui_pop" at={fTruco - 2} volume={0.7} />
      <Sfx name="success" at={fComp + 2} volume={0.6} />
      <Sfx name="cross" at={fPrimer + 2} volume={0.6} />
      <Sfx name="draw" at={fSigues} volume={0.45} dur={Math.max(10, fTreinta - fSigues)} fade={8} />
      <Sfx name="sparkle" at={fTreinta + 4} volume={0.6} />
      <Sfx name="ui_pop" at={fCancela} volume={0.6} />
      <Sfx name="tick_soft" at={fAmazon} volume={0.5} />
      <Sfx name="cross" at={fApp + 2} volume={0.6} />
    </AudStage>
  );
};

// H05 · ¿Dudas? En SonorBooks comparas precio, horas y días gratis (la comparativa de plataformas, grabación real).
export const H05Compara: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('H05', w, n);
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
    <AudStage>
      <AbsoluteFill>
        {qOut < 1 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: sQ * (1 - qOut), transform: `scale(${(0.9 + 0.1 * sQ - 0.05 * qOut).toFixed(4)})` }}>
            <MaskTitle text="¿Dudas entre Audible y otras?" hi="otras" at={2} size={92} align="center" />
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
    </AudStage>
  );
};

// H06 · Cierre de marca con espacio libre para la pantalla final de YouTube y el aviso de afiliado (Audible está en
// SonorBooks con enlace de afiliado de Amazon).
export const H06Outro: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('H06', w, n);
  const fDonde = at('donde');
  const fTu = at('tu');
  const fProx = at('proximo');
  const fLibro = at('libro');
  const fSonor = at('sonorbooks');
  const fEn = fSonor - 6; // «en» va justo antes de «SonorBooks» (buscar «en» daría con «Encuentra»)
  const query = 'Tu próximo libro';
  const keys = typeTimesSpoken(query, [[fTu - 3, fProx - 3], [fProx - 2, fLibro - 3], [fLibro - 2, fEn - 4]], 'h06');
  const end = fSonor + 34;
  return (
    <AudStage>
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
      <Keystrokes text={query} times={keys} volume={0.9} seed="h06" />
      <Sfx name="logo_sting" at={end + 5} volume={0.6} />
    </AudStage>
  );
};

export { AU_SOFT };
