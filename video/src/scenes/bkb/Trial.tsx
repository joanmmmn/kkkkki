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
import { CalendarIcon, CardIcon, ClockIcon, DocIcon, DownloadIcon, GlobeIcon, MailIcon, UserIcon } from '../../components/Icons2';
import { TiltWindow } from '../nxr/Verdict';
import { wf } from './timeline';
import {
  AppPhone, BB, BB_DEEP, BB_INK, BB_RED, BB_SOFT, BB_YELLOW, BkbStage, BookBeatLogo, buildPhoneCam, Burst, Chip, LinkBadge, markOn, MaskTitle, PH, PhoneHalo, PhoneKey, PHONE_W, Shot,
} from './kit';
import type { SceneProps } from './registry';
import m01 from '../../../public/bkb/web/01_bb_planes/meta.json';
import c01 from '../../../public/bkb/web/01_bb_planes/cursor.json';
import m02 from '../../../public/bkb/web/02_bb_registro/meta.json';
import c02 from '../../../public/bkb/web/02_bb_registro/cursor.json';
import ms10 from '../../../public/str/web/10_sb_plataformas/meta.json';

type P = SceneProps;
type IP = { size?: number; c?: string };
// Enlace «Click here to opt out of marketing communications» en la grabación del registro (px de la página a 1920×1080; el
// cursor de la grabación se para en su centro, 893 × 823).
const OPT = { x: 894, y: 823, w: 344, h: 34 };
// Campana tachada («no te avisa»).
const BellOffIcon: React.FC<IP> = ({ size = 32, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 16.5V11a6 6 0 0 1 9.3-5" /><path d="M18 10.5v6l1.5 1.5H5" /><path d="M10 20.5a2.2 2.2 0 0 0 4 0" /><path d="M3.5 3.5l17 17" />
  </svg>
);

// F01 · «Treinta días gratis, con veinte horas, desde su web»: los días caen en una insignia lila (contador 1 → 30).
export const F01Gratis: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('F01', w, n);
  const fBB = at('bookbeat');
  const fTreinta = at('treinta');
  const fVeinte = at('veinte');
  const fWeb = at('web');
  const LAND = fTreinta + 8;
  const badgeAt = fTreinta - 16;
  const rollFrom = badgeAt - 4;
  const rollAt = (f: number) => Math.max(1, Math.floor(interpolate(f, [rollFrom, LAND], [1, 30], { ...clamp, easing: Easing.bezier(0.45, 0, 0.25, 1) }) + 1e-6));
  const roll = rollAt(frame);
  const steps: number[] = [];
  for (let f = rollFrom; f <= LAND; f++) if (rollAt(f) !== rollAt(f - 1)) steps.push(f);
  const lastStep = steps.filter((f) => f <= frame).pop();
  const since = lastStep === undefined ? 99 : frame - lastStep;
  const kick = since < 4 ? [1, 0.5, 0.18, 0][since] : 0;
  const sBadge = spring({ frame: frame - badgeAt, fps, config: { damping: 12, stiffness: 150 } });
  const sLogo = spring({ frame: frame - (fBB - 8), fps, config: { damping: 16, stiffness: 150 } });
  const sH = spring({ frame: frame - fVeinte + 4, fps, config: { damping: 13, stiffness: 180 } });
  const sWeb = spring({ frame: frame - fWeb + 4, fps, config: { damping: 13, stiffness: 180 } });
  const rays = frame * 0.25;
  const bump = frame < LAND ? 0 : frame < LAND + 2 ? (frame - LAND) / 2 : interpolate(frame, [LAND + 2, LAND + 20], [1, 0], { ...clamp, easing: easeOut });
  return (
    <BkbStage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', top: 96, opacity: sLogo, transform: `translateY(${((1 - sLogo) * -30).toFixed(2)}px)` }}>
          <BookBeatLogo width={330} />
        </div>
        {/* «¿Quieres probarlo?» llena el arranque y se va antes de que caiga la insignia. */}
        {frame < badgeAt + 4 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 30 }}>
            <MaskTitle text="¿Quieres probarlo?" hi="probarlo" at={lead - 4} size={124} align="center" out={badgeAt - 2} />
          </div>
        )}
        <div style={{ position: 'relative', width: 560, height: 560, marginTop: 10, transform: `scale(${(sBadge * (1 + 0.07 * bump)).toFixed(4)})` }}>
          <svg width="560" height="560" viewBox="0 0 560 560" style={{ position: 'absolute', inset: 0, transform: `rotate(${rays}deg)` }}>
            {Array.from({ length: 24 }).map((_, i) => (
              <path key={i} d="M280 280 L 268 0 L 292 0 Z" fill={BB_DEEP} opacity={0.14} transform={`rotate(${i * 15} 280 280)`} />
            ))}
          </svg>
          <div style={{ position: 'absolute', inset: 72, borderRadius: '50%', background: BB, boxShadow: '0 40px 100px rgba(123,63,196,0.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 230, letterSpacing: -10, lineHeight: 0.86, color: BB_INK, fontVariantNumeric: 'tabular-nums', transform: `translateY(${(kick * -12).toFixed(1)}px)` }}>{roll}</div>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 48, color: BB_INK, letterSpacing: -1, marginTop: 6 }}>días gratis</div>
          </div>
        </div>
        <Burst at={LAND} x={960} y={556} r={210} seed="f01" colors={[BB, BB_YELLOW, BB_DEEP, BB_INK]} />
        <div style={{ position: 'absolute', bottom: 82, display: 'flex', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 30px 14px 18px', borderRadius: 999, background: BB_INK, color: '#fff', boxShadow: shadow.float,
            fontFamily: font.sans, fontWeight: 700, fontSize: 40, opacity: sH, transform: `translateY(${((1 - sH) * 30).toFixed(2)}px) scale(${(0.86 + 0.14 * sH).toFixed(4)})` }}>
            <ClockIcon size={44} c={BB} /> Con 20 horas
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 30px 14px 18px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.float,
            fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink, opacity: sWeb, transform: `translateY(${((1 - sWeb) * 30).toFixed(2)}px) scale(${(0.86 + 0.14 * sWeb).toFixed(4)})` }}>
            <GlobeIcon size={44} /> bookbeat.com/es
          </div>
        </div>
      </AbsoluteFill>
      <Sfx name="ui_pop" at={badgeAt + 2} volume={0.8} />
      <Sfx name="riser" at={LAND - 6} volume={0.6} />
      <ChangeTicks value={(f) => String(rollAt(f))} from={rollFrom} to={LAND} volume={0.55} />
      <Sfx name="impact" at={LAND} />
      <Sfx name="sparkle" at={LAND + 2} volume={0.8} />
      <Sfx name="ui_pop" at={fVeinte - 2} volume={0.7} />
      <Sfx name="ui_pop" at={fWeb - 2} volume={0.7} />
    </BkbStage>
  );
};

// F02 · En bookbeat.com/es (grabaciones reales, sin rellenar ni enviar nada): «Crea tu cuenta» (el formulario de registro), los
// planes (el que elijas empieza al acabar la prueba), la forma de pago (sello «Hoy: 0 €») y el enlace para no recibir su
// publicidad (la casilla de las condiciones incluye el consentimiento de marketing; el enlace lo quita).
export const F02Alta: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('F02', w, n);
  const fCrea = at('crea');
  const fElige = at('elige');
  const fPlan = at('plan');
  const fAnade = at('anade');
  const fHoy = at('hoy');
  const fPubli = at('publicidad');
  const fEnlace = at('enlace');
  const W = 1500;
  // Clip A (registro): el ratón va al formulario con «crea».
  const aStart = Math.max(0, m02.marks.to_form - (fCrea + 6) / fps);
  // Clip B (planes): la tabla de planes con «plan». Se congela en la tabla: a los 26,14 s la grabación vuelve arriba de golpe.
  const bFrom = fElige - 6;
  const bStart = Math.max(0, m01.marks.table - (fPlan + 4 - bFrom) / fps);
  // Clip C (registro, otra vez): el clic (de mentira) en el enlace de la publicidad cae con «enlace».
  const cFrom = fPubli - 8;
  const cStart = Math.max(0, m02.marks.click_optout - (fEnlace + 4 - cFrom) / fps);
  const camA: CamKey[] = [{ f: 0, zoom: 1.04, x: 960, y: 540 }, { f: fCrea + 20, zoom: 1.3, x: 960, y: 520 }, { f: bFrom, zoom: 1.3, x: 960, y: 520 }];
  const camB: CamKey[] = [{ f: 0, zoom: 1.04, x: 960, y: 540 }, { f: fPlan + 10 - bFrom, zoom: 1.18, x: 960, y: 560 }, { f: 400, zoom: 1.2, x: 960, y: 560 }];
  const camC: CamKey[] = [
    { f: 0, zoom: 1.2, x: 960, y: 560 }, { f: fPubli + 10 - cFrom, zoom: 1.6, x: OPT.x, y: OPT.y }, { f: 600, zoom: 1.65, x: OPT.x, y: OPT.y },
  ];
  const marksC = [{ from: fEnlace - 2 - cFrom, to: dur + 20 - cFrom, x: OPT.x - OPT.w / 2, y: OPT.y - OPT.h / 2, w: OPT.w, h: OPT.h, r: 14 }];
  const sWin = spring({ frame: frame - 2, fps, config: { damping: 18, stiffness: 120 } });
  const nav = (f0: number) => interpolate(frame, [f0, f0 + 16], [0, 1], { ...clamp, easing: Easing.bezier(0.22, 1, 0.36, 1) });
  const navO = (f0: number) => interpolate(frame, [f0, f0 + 6], [0, 1], { ...clamp, easing: easeInOut });
  // «Hoy: 0 €»: sello que cae con «hoy».
  const LAND = fHoy + 6;
  const pS = interpolate(frame, [fHoy, LAND], [0, 1], { ...clamp, easing: (t) => t * t * t });
  const squash = interpolate(frame, [LAND, LAND + 3, LAND + 11], [1, 0.94, 1], { ...clamp, easing: easeOut });
  const ringS = interpolate(frame, [LAND, LAND + 16], [0, 1], { ...clamp, easing: easeOut });
  const stampOut = interpolate(frame, [fPubli - 8, fPubli + 2], [0, 1], { ...clamp, easing: easeInOut });
  const url = frame < bFrom + 8 ? 'bookbeat.com/es/registration' : frame < cFrom + 8 ? 'bookbeat.com/es/our-subscriptions' : 'bookbeat.com/es/registration';
  return (
    <BkbStage>
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 40, display: 'flex', justifyContent: 'center', gap: 16, zIndex: 5 }}>
          <Chip at={fCrea - 3} dimAt={fElige - 3} label="Crea tu cuenta" icon={<UserIcon size={30} />} size={36} reserve />
          <Chip at={fElige - 3} dimAt={fAnade - 3} label="Elige el plan" icon={<CalendarIcon size={30} />} size={36} reserve />
          <Chip at={fAnade - 3} dimAt={fPubli - 3} label="Tu forma de pago" icon={<CardIcon size={30} />} size={36} reserve />
          <Chip at={fPubli - 3} label="Sin publicidad" icon={<MailIcon size={30} />} size={36} reserve />
        </div>
        <div style={{ position: 'absolute', left: (1920 - W) / 2, top: 140, opacity: sWin, transform: `translateY(${((1 - sWin) * 60).toFixed(2)}px) scale(${(0.94 + 0.06 * sWin).toFixed(4)})` }}>
          <TiltWindow width={W} url={url} ry={-3} rx={2}>
            {frame < bFrom + 16 && (
              <div style={{ position: 'absolute', inset: 0, opacity: 1 - 0.6 * navO(bFrom), transform: `scale(${(1 - 0.04 * nav(bFrom)).toFixed(4)})` }}>
                <ScreenClip src="bkb/web/02_bb_registro/video.mp4" width={W} startAt={aStart} holdAt={m02.marks.to_optout - 0.1} cursor={c02} camera={camA} markDim={0.55} />
              </div>
            )}
            {frame >= bFrom && frame < cFrom + 16 && (
              <div style={{ position: 'absolute', inset: 0, opacity: navO(bFrom) * (1 - 0.6 * navO(cFrom)), transform: `translateY(${((1 - nav(bFrom)) * 12).toFixed(2)}%) scale(${((0.985 + 0.015 * nav(bFrom)) * (1 - 0.04 * nav(cFrom))).toFixed(4)})` }}>
                <Sequence from={bFrom} layout="none">
                  <ScreenClip src="bkb/web/01_bb_planes/video.mp4" width={W} startAt={bStart} holdAt={m01.marks.table} cursor={c01} camera={camB} markDim={0.55} showCursor={false} />
                </Sequence>
              </div>
            )}
            {frame >= cFrom && (
              <div style={{ position: 'absolute', inset: 0, opacity: navO(cFrom), transform: `translateY(${((1 - nav(cFrom)) * 12).toFixed(2)}%) scale(${(0.985 + 0.015 * nav(cFrom)).toFixed(4)})` }}>
                <Sequence from={cFrom} layout="none">
                  <ScreenClip src="bkb/web/02_bb_registro/video.mp4" width={W} startAt={cStart} cursor={c02} camera={camC} marks={marksC} markDim={0.55} />
                </Sequence>
              </div>
            )}
          </TiltWindow>
        </div>
        {frame >= fHoy && stampOut < 1 && (
          <div style={{ position: 'absolute', right: 140, top: 640, zIndex: 20, opacity: interpolate(pS, [0, 0.4], [0, 1], clamp) * (1 - stampOut),
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
      <Sfx name="ui_pop" at={fCrea} volume={0.6} />
      <Sfx name="swipe" at={bFrom + 2} volume={0.8} />
      <Sfx name="ui_pop" at={fElige - 2} volume={0.6} />
      <Sfx name="ui_pop" at={fAnade - 2} volume={0.6} />
      <Sfx name="stamp" at={LAND} />
      <Sfx name="swipe" at={cFrom + 2} volume={0.7} />
      <Sfx name="zoom_in" at={fPubli + 4} volume={0.5} />
      <Sfx name="click" at={fEnlace + 4} volume={0.9} />
      <Sfx name="ui_pop" at={fPubli - 2} volume={0.6} />
    </BkbStage>
  );
};

// F03 · Descarga la app y entra con tu cuenta (la portada real de la app en el móvil).
export const F03App: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('F03', w, n);
  const fDesc = at('descarga');
  const fEntra = at('entra');
  const sB = (k: number) => spring({ frame: frame - fDesc - k * 5, fps, config: { damping: 14, stiffness: 170 } });
  const sE = spring({ frame: frame - fEntra + 2, fps, config: { damping: 15, stiffness: 160 } });
  const cam: PhoneKey[] = [{ f: 0, rx: 10, ry: -30, rz: 4, s: 0.9, x: 80, y: 40 }, { f: 26, rx: 3, ry: -12, rz: 1, s: 1, x: 0, y: 0 }, { f: dur, rx: 2, ry: -8, rz: 0.5, s: 1.02, x: 0, y: -4 }];
  const shots: Shot[] = [{ rec: '00_inicio_top', at: 0, start: 1.0, hold: 30 }];
  return (
    <BkbStage>
      <AbsoluteFill>
        <PhoneHalo cam={cam} cx={1340} cy={559} strength={0.9} />
        <div style={{ position: 'absolute', left: 1120, top: 100 }}>
          <AppPhone shots={shots} w={410} cam={cam} float={[20, dur + 24]} />
        </div>
        <div style={{ position: 'absolute', left: 170, top: 330, width: 860 }}>
          <MaskTitle text="Descarga la app" hi="app" at={Math.max(0, fDesc - 6)} size={104} />
          <div style={{ display: 'flex', gap: 20, marginTop: 40 }}>
            {['App Store', 'Google Play'].map((st, k) => {
              const sk = sB(k);
              return (
                <div key={st} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 28px', borderRadius: 20, background: color.ink, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 34,
                  opacity: sk, transform: `translateY(${((1 - sk) * 34).toFixed(2)}px) scale(${(0.9 + 0.1 * sk).toFixed(4)})`, boxShadow: '0 18px 40px rgba(16,16,16,0.18)' }}>
                  <DownloadIcon size={36} c="#fff" />{st}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 34, fontFamily: font.sans, fontWeight: 500, fontSize: 40, color: color.ink2, opacity: sE, transform: `translateY(${((1 - sE) * 20).toFixed(2)}px)` }}>
            Y entra con tu cuenta de BookBeat
          </div>
        </div>
      </AbsoluteFill>
      <Sfx name="ui_pop" at={fDesc + 2} />
      <Sfx name="ui_pop" at={fDesc + 7} volume={0.7} />
      <Sfx name="ui_pop" at={fEntra} volume={0.6} />
    </BkbStage>
  );
};

// F04 · ¿No te convence? Se cancela en la web, en la cuenta («Manage Subscription»), antes de que acabe la prueba: BookBeat no
// avisa antes de cobrar (el primer cobro es el día siguiente al último de la prueba). Si se cancela durante la prueba, el
// acceso se pierde al momento (ayuda de BookBeat, 14/10/2026): mejor en los últimos días. En el móvil, la cuenta real:
// «Free trial period (20 hours)» y «Upcoming change: Standard (50 hours) from 14/11/2026».
export const F04Cancelar: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('F04', w, n);
  const fConv = at('convence');
  const fCancela = at('cancela');
  const fCuenta = at('cuenta');
  const fAntes = at('antes');
  const fPrueba = at('prueba');
  const fAvisa = at('avisa');
  const fCobrar = at('cobrar');
  const fCancelas = at('cancelas');
  const fPierdes = at('pierdes');
  const fUltimos = at('ultimos');
  const s0: Shot = { rec: '26_cuenta', at: 0, start: 2.0, hold: 22.0 };
  s0.marks = [markOn(s0, fCuenta - 4, fAntes - 6, 16, 606, 632, 150, 18), markOn(s0, fAntes, fCancelas - 6, 16, 770, 632, 88, 16)];
  const cx = 470;
  const top = Math.round((1080 - PH.H) / 2);
  const cam = buildPhoneCam({ dur, side: 1, cx, top, enter: 'rise', exit: 'none', focus: [{ from: fCuenta, to: fAntes - 4, y: 681, s: 1.4 }, { from: fAntes, to: fCancelas - 4, y: 814, s: 1.42 }] });
  const sT = spring({ frame: frame - fConv + 8, fps, config: { damping: 15, stiffness: 160 } });
  const sWeb = spring({ frame: frame - fCancela + 2, fps, config: { damping: 14, stiffness: 180 } });
  const sBar = spring({ frame: frame - (fAntes - 6), fps, config: { damping: 16, stiffness: 150 } });
  const fill = interpolate(frame, [fAntes, fPrueba + 10], [0, 1], { ...clamp, easing: easeInOut });
  const sPay = spring({ frame: frame - (fCobrar - 4), fps, config: { damping: 11, stiffness: 210 } });
  const sBell = spring({ frame: frame - fAvisa + 2, fps, config: { damping: 13, stiffness: 190 } });
  const sLose = spring({ frame: frame - fPierdes + 2, fps, config: { damping: 13, stiffness: 190 } });
  const best = interpolate(frame, [fUltimos - 4, fUltimos + 14], [0, 1], { ...clamp, easing: easeOut });
  const k = frame - fCancelas;
  const shake = k >= 0 && k < 14 ? 6 * Math.exp(-k / 3.5) * Math.sin(k * 2.1) : 0;
  const days = 30;
  const BW = 960;
  return (
    <BkbStage>
      <PhoneHalo cam={cam} cx={cx} />
      <div style={{ position: 'absolute', top, left: cx - PH.W / 2 }}>
        <AppPhone shots={[s0]} w={PHONE_W} cam={cam} dim={0.72} motionBlur float={[0, dur]} />
      </div>
      <div style={{ position: 'absolute', left: 860, top: 0, height: 1080, width: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ opacity: sT }}>
          <MaskTitle text="¿No te convence?" hi="convence?" at={Math.max(0, fConv - 8)} size={88} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, alignSelf: 'flex-start', marginTop: 28, padding: '14px 30px 14px 18px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.float,
          fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.ink, opacity: sWeb, transform: `translateY(${((1 - sWeb) * 24).toFixed(2)}px)` }}>
          <GlobeIcon size={42} /> Cancela en su web, en tu cuenta
        </div>
        {/* La prueba: 30 días y, al día siguiente, el cobro. Mejor cancelar en los últimos días. */}
        <div style={{ position: 'relative', width: BW, marginTop: 92, opacity: sBar, transform: `translateY(${((1 - sBar) * 30).toFixed(2)}px)` }}>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${days}, 1fr) 2.6fr`, gap: 5, height: 64 }}>
            {Array.from({ length: days }, (_, i) => {
              const on = fill * days > i;
              const late = i >= days - 4;
              return (
                <div key={i} style={{ borderRadius: 8, background: on ? (late && best > 0 ? `rgba(255,230,70,${(0.4 + 0.6 * best).toFixed(3)})` : BB) : '#EFEFF3',
                  boxShadow: late && best > 0.5 ? '0 8px 18px rgba(255,200,0,0.35)' : undefined, transform: late ? `scaleY(${(1 + 0.12 * best).toFixed(4)})` : undefined }} />
              );
            })}
            <div style={{ borderRadius: 10, background: '#FDECEC', border: `2px solid ${BB_RED}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 24, color: BB_RED,
              opacity: sPay, transform: `scale(${(0.6 + 0.4 * sPay).toFixed(4)})` }}>Cobro</div>
          </div>
          <div style={{ position: 'absolute', left: -4, top: -54, fontFamily: font.sans, fontWeight: 700, fontSize: 28, color: color.ink }}>Día 1</div>
          <div style={{ position: 'absolute', right: 90, top: -54, fontFamily: font.sans, fontWeight: 700, fontSize: 28, color: color.ink }}>Día 30</div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14, paddingRight: 96, fontFamily: font.sans, fontWeight: 700, fontSize: 28, color: color.ink, opacity: best }}>
            ↑ Cancela en los últimos días
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 34 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, alignSelf: 'flex-start', padding: '14px 28px 14px 18px', borderRadius: 999, background: BB_INK, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 34,
            opacity: sBell, transform: `translateY(${((1 - sBell) * 24).toFixed(2)}px)` }}>
            <BellOffIcon size={40} c={BB_YELLOW} /> No te avisa antes de cobrar
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, alignSelf: 'flex-start', padding: '14px 28px 14px 18px', borderRadius: 999, background: '#FDECEC', border: '2px solid rgba(229,72,77,0.3)',
            fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: color.ink, opacity: sLose, transform: `translateX(${shake.toFixed(2)}px) translateY(${((1 - sLose) * 24).toFixed(2)}px)` }}>
            <CrossIcon size={40} /> Si cancelas en la prueba, pierdes el acceso al momento
          </div>
        </div>
      </div>
      <Sfx name="ui_pop" at={fConv - 2} />
      <Sfx name="ui_pop" at={fCancela} volume={0.6} />
      <Sfx name="draw" at={fAntes} volume={0.45} dur={Math.max(10, fPrueba + 10 - fAntes)} fade={8} />
      <Sfx name="hit_soft" at={fCobrar - 2} volume={0.6} />
      <Sfx name="ui_pop" at={fAvisa} volume={0.6} />
      <Sfx name="cross" at={fPierdes + 2} volume={0.6} />
      <Sfx name="marker" at={fUltimos} />
    </BkbStage>
  );
};

// F05 · ¿Dudas? En SonorBooks comparas precio, horas y días gratis (la comparativa de plataformas, grabación real) y la reseña
// completa por escrito, en la descripción.
export const F05Compara: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('F05', w, n);
  const fDudas = at('dudas');
  const fSonor = at('sonorbooks');
  const fPrecio = at('precio');
  const fHoras = at('horas');
  const fDias = at('dias');
  const fDesc = at('descripcion');
  const fResena = at('resena');
  const W = 1400;
  const sWin = spring({ frame: frame - (fSonor - 10), fps, config: { damping: 18, stiffness: 120 } });
  const sQ = spring({ frame: frame - fDudas, fps, config: { damping: 15, stiffness: 160 } });
  const qOut = interpolate(frame, [fSonor - 12, fSonor], [0, 1], { ...clamp, easing: easeInOut });
  // La comparativa baja de arriba abajo, acelerada (la grabación tarda 38 s en recorrerla).
  const rate = 7.5;
  const cam: CamKey[] = [{ f: 0, zoom: 1.0, x: 960, y: 540 }, { f: fPrecio - fSonor, zoom: 1.12, x: 760, y: 560 }, { f: fDias - fSonor + 20, zoom: 1.1, x: 960, y: 560 }];
  const shrink = interpolate(frame, [fDesc - 10, fDesc + 8], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <BkbStage>
      <AbsoluteFill>
        {qOut < 1 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: sQ * (1 - qOut), transform: `scale(${(0.9 + 0.1 * sQ - 0.05 * qOut).toFixed(4)})` }}>
            <MaskTitle text="¿Dudas entre BookBeat y otras?" hi="otras?" at={2} size={92} align="center" />
          </div>
        )}
        {frame >= fSonor - 12 && (
          <div style={{ position: 'absolute', left: (1920 - W) / 2, top: 120, opacity: sWin, transform: `translateY(${((1 - sWin) * 80 - 60 * shrink).toFixed(2)}px) scale(${((0.94 + 0.06 * sWin) * (1 - 0.12 * shrink)).toFixed(4)})`, transformOrigin: '50% 0%' }}>
            <TiltWindow width={W} url="sonorbooks.com/es/plataformas" ry={-3} rx={2}>
              <Sequence from={fSonor - 10} layout="none">
                <ScreenClip src="str/web/10_sb_plataformas/video.mp4" width={W} startAt={Math.max(0, ms10.marks.scroll - 0.6)} playbackRate={rate} showCursor={false} camera={cam} />
              </Sequence>
            </TiltWindow>
          </div>
        )}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 34, display: 'flex', justifyContent: 'center', gap: 16, zIndex: 10 }}>
          <Chip at={fPrecio - 3} dimAt={fDesc - 3} label="Precio" icon={<CardIcon size={30} />} size={34} reserve />
          <Chip at={fHoras - 3} dimAt={fDesc - 3} label="Horas" icon={<ClockIcon size={30} />} size={34} reserve />
          <Chip at={fDias - 3} dimAt={fDesc - 3} label="Días gratis" icon={<CalendarIcon size={30} />} size={34} reserve />
          <LinkBadge at={fDesc - 3} label="En la descripción" size={34} reserve />
          <Chip at={fResena - 3} label="Reseña completa por escrito" icon={<DocIcon size={30} />} size={34} reserve />
        </div>
      </AbsoluteFill>
      <Sfx name="ui_pop" at={fDudas} volume={0.6} />
      <Sfx name="whoosh_soft" at={fSonor - 10} volume={0.7} />
      <Sfx name="ui_pop" at={fPrecio - 2} volume={0.6} />
      <Sfx name="ui_pop" at={fHoras - 2} volume={0.6} />
      <Sfx name="ui_pop" at={fDias - 2} volume={0.6} />
      <Sfx name="ui_pop" at={fDesc - 1} volume={0.8} />
      <Sfx name="sparkle" at={fResena - 2} volume={0.8} />
    </BkbStage>
  );
};

// F06 · Cierre de marca con espacio libre para la pantalla final de YouTube (sin aviso de afiliado: este vídeo no lleva enlaces
// de afiliado).
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
    <BkbStage>
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
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 190, flexDirection: 'column', gap: 34, background: '#fff' }}>
          <Logo size={150} animate={false} />
          <Words text="Tu próxima historia te está esperando." start={2} stagger={4} size={62} weight={500} />
          <div style={{ opacity: spring({ frame: frame - end - 30, fps }) }}><Pill size={40}>sonorbooks.com</Pill></div>
        </AbsoluteFill>
      </Phase>
      <Sfx name="logo_sting" at={4} />
      <Keystrokes text={query} times={keys} volume={0.9} seed="f06" />
      <Sfx name="logo_sting" at={end + 5} volume={0.6} />
    </BkbStage>
  );
};

export { BB_SOFT };
