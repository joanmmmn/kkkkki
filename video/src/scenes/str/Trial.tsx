import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
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
import { CalendarIcon, CardIcon, ClockIcon, DocIcon, DownloadIcon, GlobeIcon, LinkIcon } from '../../components/Icons2';
import { TiltWindow } from '../nxr/Verdict';
import { wf } from './timeline';
import { AppPhone, Burst, Chip, LinkBadge, MaskTitle, Odometer, odometerShown, PhoneHalo, PhoneKey, Shot, ST, ST_DEEP, ST_SOFT, StorytelLogo, StrStage } from './kit';
import type { SceneProps } from './registry';
import m00 from '../../../public/str/web/00_st_planes/meta.json';
import c00 from '../../../public/str/web/00_st_planes/cursor.json';
import m01 from '../../../public/str/web/01_st_alta/meta.json';
import c01 from '../../../public/str/web/01_st_alta/cursor.json';
import m10 from '../../../public/str/web/10_sb_plataformas/meta.json';

type P = SceneProps;

// B01 · «7 días gratis desde su web»: los días caen en una insignia naranja (contador 1 → 7) y, debajo, storytel.com.
export const B01Gratis: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('B01', w, n);
  const fStory = at('storytel');
  const fSiete = at('siete');
  const fWeb = at('web');
  const LAND = fSiete + 6;
  const badgeAt = fSiete - 14;
  const rollFrom = badgeAt - 4;
  const rollAt = (f: number) => Math.max(1, Math.floor(interpolate(f, [rollFrom, LAND], [1, 7], { ...clamp, easing: Easing.bezier(0.45, 0, 0.25, 1) }) + 1e-6));
  const roll = rollAt(frame);
  const steps: number[] = [];
  for (let f = rollFrom; f <= LAND; f++) if (rollAt(f) !== rollAt(f - 1)) steps.push(f);
  const lastStep = steps.filter((f) => f <= frame).pop();
  const since = lastStep === undefined ? 99 : frame - lastStep;
  const kick = since < 4 ? [1, 0.5, 0.18, 0][since] : 0;
  const sBadge = spring({ frame: frame - badgeAt, fps, config: { damping: 12, stiffness: 150 } });
  const sLogo = spring({ frame: frame - (fStory - 8), fps, config: { damping: 16, stiffness: 150 } });
  const sWeb = spring({ frame: frame - fWeb + 4, fps, config: { damping: 13, stiffness: 180 } });
  const rays = frame * 0.25;
  const bump = frame < LAND ? 0 : frame < LAND + 2 ? (frame - LAND) / 2 : interpolate(frame, [LAND + 2, LAND + 20], [1, 0], { ...clamp, easing: easeOut });
  return (
    <StrStage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', top: 96, opacity: sLogo, transform: `translateY(${((1 - sLogo) * -30).toFixed(2)}px)` }}>
          <StorytelLogo width={300} />
        </div>
        {/* «¿Quieres probarlo?» llena el arranque y se va antes de que caiga la insignia. */}
        {frame < badgeAt + 4 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 30 }}>
            <MaskTitle text="¿Quieres probarlo?" hi="probarlo" at={lead - 4} size={124} align="center" out={badgeAt - 2} />
          </div>
        )}
        <div style={{ position: 'relative', width: 560, height: 560, marginTop: 30, transform: `scale(${(sBadge * (1 + 0.07 * bump)).toFixed(4)})` }}>
          <svg width="560" height="560" viewBox="0 0 560 560" style={{ position: 'absolute', inset: 0, transform: `rotate(${rays}deg)` }}>
            {Array.from({ length: 24 }).map((_, i) => (
              <path key={i} d="M280 280 L 268 0 L 292 0 Z" fill={ST} opacity={0.16} transform={`rotate(${i * 15} 280 280)`} />
            ))}
          </svg>
          <div style={{ position: 'absolute', inset: 72, borderRadius: '50%', background: ST, boxShadow: '0 40px 100px rgba(255,80,28,0.45)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 250, letterSpacing: -10, lineHeight: 0.86, color: '#fff', fontVariantNumeric: 'tabular-nums', transform: `translateY(${(kick * -12).toFixed(1)}px)` }}>{roll}</div>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 48, color: '#fff', letterSpacing: -1, marginTop: 6 }}>días gratis</div>
          </div>
        </div>
        <Burst at={LAND} x={960} y={570} r={210} seed="b01" colors={[ST, color.yellow, '#F099AC', '#101010']} />
        <div style={{ position: 'absolute', bottom: 92, display: 'flex', alignItems: 'center', gap: 14, padding: '14px 30px 14px 18px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.float,
          fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink, opacity: sWeb, transform: `translateY(${((1 - sWeb) * 30).toFixed(2)}px) scale(${(0.86 + 0.14 * sWeb).toFixed(4)})` }}>
          <GlobeIcon size={44} /> storytel.com
        </div>
      </AbsoluteFill>
      <Sfx name="ui_pop" at={badgeAt + 2} volume={0.8} />
      <Sfx name="riser" at={LAND - 4} volume={0.6} />
      <ChangeTicks value={(f) => String(rollAt(f))} from={rollFrom} to={LAND} />
      <Sfx name="impact" at={LAND} />
      <Sfx name="sparkle" at={LAND + 2} volume={0.8} />
      <Sfx name="ui_pop" at={fWeb - 2} volume={0.7} />
    </StrStage>
  );
};

// B02 · En storytel.com (grabaciones reales): eliges Unlimited o Family (el selector de cuentas pasa a 3 y a 20,99 €), «Crea tu
// cuenta» con el resumen «0 € para 7 días → 8,99 €/mes» y, al final, se desmarca la casilla de publicidad (viene marcada).
export const B02Alta: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('B02', w, n);
  const fUnl = at('unlimited');
  const fFam = at('family');
  const fCrea = at('crea');
  const fPago = at('pago');
  const fHoy = at('hoy');
  const fPubli = at('publicidad');
  const fDesm = at('desmarca');
  const W = 1500;
  // Clip A (planes): el «+» de Family se pulsa (click_plus) con «Family».
  const aStart = Math.max(0, m00.marks.click_plus - (fFam + 4) / fps);
  // Clip B (alta): el ratón va al resumen del plan y se para; el tramo final (casilla) se alinea con «desmarca».
  const bFrom = fCrea - 6;
  const bHold = 2.5;
  const b2From = fDesm + 6 - Math.round((m01.marks.click_check - bHold) * fps);
  const camA: CamKey[] = [
    { f: 0, zoom: 1.08, x: 960, y: 560 }, { f: fUnl - 4, zoom: 1.25, x: 900, y: 560 },
    { f: fFam - 8, zoom: 1.55, x: 1158, y: 640 }, { f: fCrea, zoom: 1.6, x: 1158, y: 650 },
  ];
  const camB: CamKey[] = [
    { f: 0, zoom: 1.05, x: 960, y: 540 }, { f: fPago - 10 - bFrom, zoom: 1.12, x: 900, y: 520 },
    { f: fPago + 10 - bFrom, zoom: 1.85, x: 560, y: 460 }, { f: fPubli - 10 - bFrom, zoom: 1.85, x: 560, y: 470 },
    { f: fPubli + 12 - bFrom, zoom: 1.75, x: 1300, y: 700 }, { f: 600, zoom: 1.8, x: 1300, y: 700 },
  ];
  const camB2 = camB.map((k) => ({ ...k, f: k.f + bFrom - b2From }));
  const marksA = [
    { from: fUnl - 2, to: fFam - 8, x: 572, y: 293, w: 380, h: 532, r: 22 },
    { from: fFam + 8, to: fCrea + 6, x: 984, y: 623, w: 348, h: 122, r: 16 },
  ];
  const marksB = [{ from: fPago - bFrom, to: fPubli - 8 - bFrom, x: 326, y: 368, w: 422, h: 160, r: 16 }];
  const marksB2 = [{ from: fDesm - 2 - b2From, to: dur + 20 - b2From, x: 1051, y: 668, w: 533, h: 68, r: 14 }];
  const sWin = spring({ frame: frame - 2, fps, config: { damping: 18, stiffness: 120 } });
  const nav = interpolate(frame, [bFrom, bFrom + 16], [0, 1], { ...clamp, easing: Easing.bezier(0.22, 1, 0.36, 1) });
  const navO = interpolate(frame, [bFrom, bFrom + 6], [0, 1], { ...clamp, easing: easeInOut });
  // «Hoy: 0 €»: sello que cae con «hoy».
  const LAND = fHoy + 6;
  const pS = interpolate(frame, [fHoy, LAND], [0, 1], { ...clamp, easing: (t) => t * t * t });
  const squash = interpolate(frame, [LAND, LAND + 3, LAND + 11], [1, 0.94, 1], { ...clamp, easing: easeOut });
  const ringS = interpolate(frame, [LAND, LAND + 16], [0, 1], { ...clamp, easing: easeOut });
  const stampOut = interpolate(frame, [fPubli - 8, fPubli + 2], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <StrStage>
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 40, display: 'flex', justifyContent: 'center', gap: 16, zIndex: 5 }}>
          <Chip at={fUnl - 3} dimAt={fFam - 3} label="Unlimited" size={36} reserve />
          <Chip at={fFam - 3} dimAt={fCrea - 3} label="Family" size={36} reserve />
          <Chip at={fCrea - 3} dimAt={fPubli - 3} label="Crea tu cuenta" icon={<CheckIcon size={30} />} size={36} reserve />
          <Chip at={fPubli - 3} label="Sin publicidad" icon={<CrossIcon size={30} />} size={36} reserve />
        </div>
        <div style={{ position: 'absolute', left: (1920 - W) / 2, top: 140, opacity: sWin, transform: `translateY(${((1 - sWin) * 60).toFixed(2)}px) scale(${(0.94 + 0.06 * sWin).toFixed(4)})` }}>
          <TiltWindow width={W} url={frame < bFrom + 8 ? 'storytel.com/es/subscriptions' : 'storytel.com/es/signup'} ry={-3} rx={2}>
            {frame < bFrom + 16 && (
              <div style={{ position: 'absolute', inset: 0, opacity: 1 - 0.6 * navO, transform: `scale(${(1 - 0.04 * nav).toFixed(4)})` }}>
                <ScreenClip src="str/web/00_st_planes/video.mp4" width={W} startAt={aStart} cursor={c00} camera={camA} marks={marksA} markDim={0.55} />
              </div>
            )}
            {frame >= bFrom && frame < b2From && (
              <div style={{ position: 'absolute', inset: 0, opacity: navO, transform: `translateY(${((1 - nav) * 12).toFixed(2)}%) scale(${(0.985 + 0.015 * nav).toFixed(4)})` }}>
                <Sequence from={bFrom} layout="none">
                  <ScreenClip src="str/web/01_st_alta/video.mp4" width={W} startAt={0.2} holdAt={bHold} cursor={c01} camera={camB} marks={marksB} markDim={0.55} />
                </Sequence>
              </div>
            )}
            {frame >= b2From && (
              <div style={{ position: 'absolute', inset: 0 }}>
                <Sequence from={b2From} layout="none">
                  <ScreenClip src="str/web/01_st_alta/video.mp4" width={W} startAt={bHold} cursor={c01} camera={camB2} marks={marksB2} markDim={0.55} />
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
      <Sfx name="ui_pop" at={fUnl - 2} volume={0.6} />
      <Sfx name="click" at={Math.round(fFam + 4)} volume={0.8} />
      <Sfx name="ui_pop" at={fFam - 2} volume={0.6} />
      <Sfx name="swipe" at={bFrom + 2} volume={0.8} />
      <Sfx name="zoom_in" at={fPago + 2} volume={0.5} />
      <Sfx name="stamp" at={LAND} />
      <Sfx name="zoom_in" at={fPubli + 4} volume={0.5} />
      <Sfx name="click" at={fDesm + 6} volume={0.9} />
      <Sfx name="ui_pop" at={fPubli - 2} volume={0.6} />
    </StrStage>
  );
};

// B03 · Descarga la app y entra con tu cuenta (la portada real de la app en el móvil).
export const B03App: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('B03', w, n);
  const fDesc = at('descarga');
  const fEntra = at('entra');
  const sB = (k: number) => spring({ frame: frame - fDesc - k * 5, fps, config: { damping: 14, stiffness: 170 } });
  const sE = spring({ frame: frame - fEntra + 2, fps, config: { damping: 15, stiffness: 160 } });
  const cam: PhoneKey[] = [{ f: 0, rx: 10, ry: -30, rz: 4, s: 0.9, x: 80, y: 40 }, { f: 26, rx: 3, ry: -12, rz: 1, s: 1, x: 0, y: 0 }, { f: dur, rx: 2, ry: -8, rz: 0.5, s: 1.02, x: 0, y: -4 }];
  const shots: Shot[] = [{ rec: '02_inicio_top2', at: 0, start: 1.0, hold: 8 }];
  return (
    <StrStage>
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
            Y entra con tu cuenta de Storytel
          </div>
        </div>
      </AbsoluteFill>
      <Sfx name="ui_pop" at={fDesc + 2} />
      <Sfx name="ui_pop" at={fDesc + 7} volume={0.7} />
      <Sfx name="ui_pop" at={fEntra} volume={0.6} />
    </StrStage>
  );
};

// B04 · ¿Te convence? Quédate (al acabar la semana, 8,99 €/mes). ¿No? Cancela en tu cuenta de storytel.com (la app manda a
// la web: captura real), mejor el último día de la prueba (al cancelar en la prueba se pierde el acceso al momento), pero no
// en la última hora antes del cobro (las condiciones no lo permiten).
export const B04Decide: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('B04', w, n);
  const fConv = at('convence');
  const fNada = at('nada');
  const fSemana = at('semana');
  const fOcho = at('ocho');
  const fConv2 = at('convence', 1);
  const fCancela = at('cancela');
  const fWeb = at('web');
  const fApp = at('app');
  const fMejor = at('mejor');
  const fUlt = at('ultimo');
  const fPierdes = at('pierdes');
  const fPero = at('pero');
  const fUltima = at('ultima');
  const fDeja = at('deja');
  const sL = spring({ frame: frame - fConv + 6, fps, config: { damping: 16, stiffness: 150 } });
  const sQ = spring({ frame: frame - fNada + 2, fps, config: { damping: 11, stiffness: 200 } });
  const sSem = spring({ frame: frame - fSemana, fps, config: { damping: 14, stiffness: 180 } });
  const sR = spring({ frame: frame - fConv2 + 6, fps, config: { damping: 16, stiffness: 150 } });
  const sC = spring({ frame: frame - fCancela, fps, config: { damping: 15, stiffness: 170 } });
  const sApp = spring({ frame: frame - fApp + 2, fps, config: { damping: 15, stiffness: 160 } });
  const sDays = (d: number) => spring({ frame: frame - (fMejor - 6 + d * 2), fps, config: { damping: 13, stiffness: 230 } });
  const best = interpolate(frame, [fUlt - 2, fUlt + 14], [0, 1], { ...clamp, easing: easeOut });
  const sW = spring({ frame: frame - fPierdes + 2, fps, config: { damping: 14, stiffness: 180 } });
  const sH = spring({ frame: frame - fUltima + 2, fps, config: { damping: 12, stiffness: 200 } });
  const k = frame - fDeja;
  const shake = k >= 0 && k < 14 ? 7 * Math.exp(-k / 3.5) * Math.sin(k * 2.1) : 0;
  const activeR = interpolate(frame, [fConv2 - 6, fConv2 + 6], [0, 1], clamp);
  const sP = spring({ frame: frame - 8, fps, config: { damping: 18, stiffness: 140 } });
  const box = (s: number, active: number, children: React.ReactNode) => (
    <div style={{ width: 780, height: 800, borderRadius: 48, background: '#fff', boxShadow: active > 0.5 ? `0 0 0 ${(4 * active).toFixed(2)}px ${color.yellow}, ${shadow.card}` : shadow.card, border: `1px solid ${color.line}`, padding: '44px 50px',
      display: 'flex', flexDirection: 'column', opacity: s * (0.42 + 0.58 * active), transform: `translateY(${((1 - s) * 60).toFixed(2)}px) scale(${(0.97 + 0.03 * active).toFixed(4)})`, boxSizing: 'border-box' }}>{children}</div>
  );
  const days = [1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <StrStage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 50, paddingTop: 30 }}>
        {box(sL, 1 - 0.5 * activeR, (
          <>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 56, color: color.ink, letterSpacing: -1.5 }}>¿Te convence?</div>
            <div style={{ marginTop: 84, display: 'flex', alignItems: 'center', gap: 28, transform: `scale(${(0.7 + 0.3 * sQ).toFixed(4)})`, transformOrigin: 'left center', opacity: sQ }}>
              <CheckIcon size={124} />
              <div>
                <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 96, color: color.ink, letterSpacing: -3.5, lineHeight: 1 }}>Quédate</div>
                <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 34, color: color.ink2, marginTop: 10 }}>No tienes que hacer nada</div>
              </div>
            </div>
            {/* Al acabar la semana empieza el cobro: el precio es lo que se ve. */}
            <div style={{ marginTop: 'auto', padding: '28px 34px 30px', borderRadius: 30, background: ST_SOFT, opacity: sSem, transform: `translateY(${((1 - sSem) * 24).toFixed(2)}px)` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: color.ink }}>
                <CardIcon size={44} c={ST_DEEP} /> Al acabar la semana, se cobra
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 14, fontFamily: font.sans, fontWeight: 700, color: ST_DEEP }}>
                <span style={{ position: 'relative', display: 'inline-block' }}>
                  <Odometer text="8,99" at={fOcho - 4} size={112} color={ST_DEEP} style={{ letterSpacing: -5 }} />
                  {frame < fOcho - 5 && <span style={{ position: 'absolute', left: 0, right: 6, top: '16%', bottom: '8%', borderRadius: 22, background: 'linear-gradient(100deg, #F9D9CB 35%, #FFF1EA 50%, #F9D9CB 65%)',
                    backgroundSize: '300% 100%', backgroundPosition: `${100 - ((frame * 2.4) % 100)}% 0` }} />}
                </span>
                <span style={{ fontSize: 50 }}>€</span><span style={{ fontSize: 34, fontWeight: 500, color: color.ink2 }}>/mes</span>
              </div>
            </div>
          </>
        ))}
        {box(Math.max(sP, sR), activeR, (
          <>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 56, color: color.ink, letterSpacing: -1.5 }}>¿No te convence?</div>
            <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 12, fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: color.ink, opacity: sC, transform: `translateX(${((1 - sC) * -20).toFixed(2)}px)` }}>
              <GlobeIcon size={42} /> Cancela en tu cuenta de <span style={{ color: ST_DEEP }}>storytel.com</span>
            </div>
            {/* La app manda a la web: el aviso real de «Tu plan actual», entero (con el enlace a la web). */}
            <div style={{ marginTop: 22, position: 'relative', opacity: sApp, transform: `translateY(${((1 - sApp) * 24).toFixed(2)}px) scale(${(0.94 + 0.06 * sApp).toFixed(4)})`, transformOrigin: 'left top' }}>
              <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', border: `1px solid ${color.line}`, boxShadow: shadow.soft, height: 190 }}>
                <Img src={staticFile('str/img/plan_web.png')} style={{ width: 680, display: 'block', marginTop: -116 }} />
              </div>
              <div style={{ position: 'absolute', left: 22, top: -16, padding: '5px 14px', borderRadius: 999, background: color.ink, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 21 }}>En la app</div>
            </div>
            <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 8 }}>
              {days.map((d) => {
                const hot = d === 7;
                const pay = d === 8;
                const ds = sDays(d);
                return (
                  <div key={d} style={{ position: 'relative', height: 70, borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700,
                    background: hot ? `rgba(255,202,5,${(0.25 + 0.75 * best).toFixed(3)})` : pay ? '#FDECEC' : '#F4F4F4', color: pay ? color.red : color.ink, opacity: Math.min(1, ds * 1.6),
                    transform: `scale(${((0.55 + 0.45 * ds) * (hot ? 1 + 0.1 * best : 1)).toFixed(4)})`, boxShadow: hot && best > 0.5 ? '0 10px 24px rgba(255,202,5,0.45)' : undefined }}>
                    <span style={{ fontSize: 15, opacity: 0.6 }}>{pay ? 'cobro' : 'día'}</span>
                    <span style={{ fontSize: pay ? 22 : 28 }}>{pay ? '8,99 €' : d}</span>
                    {hot && sH > 0.02 && (
                      <span style={{ position: 'absolute', right: -8, top: -12, width: 34, height: 34, borderRadius: '50%', background: color.red, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transform: `scale(${sH.toFixed(4)})` }}><ClockIcon size={24} c="#fff" /></span>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end', paddingRight: 64, fontFamily: font.sans, fontWeight: 700, fontSize: 26, color: color.ink, opacity: best }}>
              ↑ Mejor el último día
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderRadius: 18, background: '#FDECEC', color: color.red, fontFamily: font.sans, fontWeight: 700, fontSize: 28, opacity: sW, transform: `translateY(${((1 - sW) * 20).toFixed(2)}px)` }}>
                <CrossIcon size={34} /> <span style={{ textWrap: 'balance' } as React.CSSProperties}>Al cancelar en la prueba, pierdes el acceso al momento</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderRadius: 18, background: color.ink, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 28,
                opacity: sH, transform: `translateX(${shake.toFixed(2)}px) translateY(${((1 - sH) * 20).toFixed(2)}px)` }}>
                <ClockIcon size={34} c={color.yellow} /> <span style={{ textWrap: 'balance' } as React.CSSProperties}>Pero no en la última hora antes del cobro: ya no se puede</span>
              </div>
            </div>
          </>
        ))}
      </AbsoluteFill>
      <Sfx name="ui_pop" at={fConv - 2} />
      <Sfx name="success" at={fNada + 1} volume={0.8} />
      <ChangeTicks value={(f) => odometerShown('8,99', fOcho - 4, fps, f)} from={fOcho - 4} to={fOcho + 30} volume={0.4} />
      <Sfx name="coins" at={fOcho + 20} volume={0.45} />
      <Sfx name="ui_pop" at={fConv2 - 2} />
      <Sfx name="ui_pop" at={fCancela + 1} volume={0.6} />
      <Sfx name="snap_in" at={fApp} volume={0.6} />
      {[0, 1, 2].map((r) => <Sfx key={`d${r}`} name="tick_soft" at={fMejor - 2 + r * 5} volume={[0.85, 0.6, 0.5][r]} />)}
      <Sfx name="marker" at={fUlt} />
      <Sfx name="hit_soft" at={fPierdes + 1} />
      <Sfx name="ui_pop" at={fPero} volume={0.5} />
      <Sfx name="cross" at={fUltima + 2} volume={0.6} />
    </StrStage>
  );
};

// B05 · ¿Dudas? En SonorBooks comparas precio, horas y días gratis (la comparativa de plataformas, grabación real) y la reseña
// completa por escrito, en la descripción.
export const B05Compara: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('B05', w, n);
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
    <StrStage>
      <AbsoluteFill>
        {qOut < 1 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: sQ * (1 - qOut), transform: `scale(${(0.9 + 0.1 * sQ - 0.05 * qOut).toFixed(4)})` }}>
            <MaskTitle text="¿Dudas entre Storytel y otras?" hi="otras" at={2} size={92} align="center" />
          </div>
        )}
        {frame >= fSonor - 12 && (
          <div style={{ position: 'absolute', left: (1920 - W) / 2, top: 120, opacity: sWin, transform: `translateY(${((1 - sWin) * 80 - 60 * shrink).toFixed(2)}px) scale(${((0.94 + 0.06 * sWin) * (1 - 0.12 * shrink)).toFixed(4)})`, transformOrigin: '50% 0%' }}>
            <TiltWindow width={W} url="sonorbooks.com/es/plataformas" ry={-3} rx={2}>
              <Sequence from={fSonor - 10} layout="none">
                <ScreenClip src="str/web/10_sb_plataformas/video.mp4" width={W} startAt={Math.max(0, m10.marks.scroll - 0.6)} playbackRate={rate} showCursor={false} camera={cam} />
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
    </StrStage>
  );
};

// B06 · Cierre de marca con espacio libre para la pantalla final de YouTube (sin aviso de afiliado: este vídeo no lleva enlaces
// de afiliado).
export const B06Outro: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('B06', w, n);
  const fDonde = at('donde');
  const fTu = at('tu');
  const fProx = at('proximo');
  const fLibro = at('libro');
  const fEn = at('en');
  const fSonor = at('sonorbooks');
  const query = 'Tu próximo libro';
  const keys = typeTimesSpoken(query, [[fTu - 3, fProx - 3], [fProx - 2, fLibro - 3], [fLibro - 2, fEn - 4]], 'b06');
  const end = fSonor + 34;
  return (
    <StrStage>
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
      <Keystrokes text={query} times={keys} volume={0.9} seed="b06" />
      <Sfx name="logo_sting" at={end + 5} volume={0.6} />
    </StrStage>
  );
};
