import React from 'react';
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { ChangeTicks, Sfx } from '../../components/Sfx';
import { ScreenClip } from '../../components/ScreenClip';
import { BookIcon, CheckIcon, CrossIcon, HeadphonesIcon } from '../../components/Icons';
import { CardIcon, DocIcon, GlobeIcon, InfinityIcon, PhoneIcon, UserIcon } from '../../components/Icons2';
import { TiltWindow } from '../nxr/Verdict';
import { wf } from './timeline';
import type { SceneProps } from './registry';
import {
  AppPhone, BB, BB_DEEP, BB_GREEN, BB_GREEN_SOFT, BB_INK, BB_RED, BB_SOFT, BB_YELLOW, BB_YELLOW_SOFT, BkbStage, BookBeatLogo, buildPhoneCam, Chip, EnSticker,
  HoursMeter, markOn, MaskTitle, Odometer, odometerShown, PH, PhoneHalo, PHONE_W, Sheen, Shot, zoomPeaks,
} from './kit';
import m00 from '../../../public/bkb/web/00_bb_inicio/meta.json';

type P = SceneProps;
const useSpring = (at: number, damping = 16, stiffness = 160) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, stiffness } });
};

// Fase en carrusel: entra desde la derecha y sale hacia la izquierda.
const usePhase = (from: number, to: number) => {
  const frame = useCurrentFrame();
  const pin = interpolate(frame, [from - 4, from + 12], [0, 1], { ...clamp, easing: easeOut });
  const pout = interpolate(frame, [to - 12, to + 2], [0, 1], { ...clamp, easing: easeInOut });
  const visible = frame >= from - 4 && frame <= to + 2;
  const style: React.CSSProperties = {
    opacity: pin * (1 - pout), transform: `translateX(${(1 - pin) * 160 - pout * 200}px)`,
    filter: (1 - pin) + pout > 0.02 ? `blur(${((1 - pin) * 10 + pout * 10).toFixed(2)}px)` : undefined,
  };
  return { visible, style };
};

// Hueco con brillo hasta que la voz dice la cifra.
const Shimmer: React.FC<{ frame: number; r?: number; tint?: [string, string] }> = ({ frame, r = 24, tint = ['#EDEDED', '#F9F9F9'] }) => (
  <span style={{ position: 'absolute', left: 0, right: 6, top: '16%', bottom: '8%', borderRadius: r, background: `linear-gradient(100deg, ${tint[0]} 35%, ${tint[1]} 50%, ${tint[0]} 65%)`,
    backgroundSize: '300% 100%', backgroundPosition: `${100 - ((frame * 2.4) % 100)}% 0` }} />
);

export const FlagES: React.FC<{ w?: number }> = ({ w = 64 }) => (
  <svg width={w} height={w * 0.72} viewBox="0 0 36 26" style={{ borderRadius: 6, boxShadow: '0 0 0 1px rgba(0,0,0,0.08)', flexShrink: 0 }}>
    <rect width="36" height="26" fill="#C60B1E" /><rect y="6.5" width="36" height="13" fill="#FFC400" />
  </svg>
);
const FlagSE: React.FC<{ w?: number }> = ({ w = 64 }) => (
  <svg width={w} height={w * 0.72} viewBox="0 0 36 26" style={{ borderRadius: 6, boxShadow: '0 0 0 1px rgba(0,0,0,0.08)', flexShrink: 0 }}>
    <rect width="36" height="26" fill="#006AA7" /><rect x="10" width="5" height="26" fill="#FECC00" /><rect y="10.5" width="36" height="5" fill="#FECC00" />
  </svg>
);

// D01 · Gancho: el móvil entra girando con la app real y enseña lo que nombra la voz; a la izquierda, la pregunta.
export const D01Hook: React.FC<P> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('D01', w, n);
  const fInst = at('instalado');
  const fCat = at('catalogo');
  const fApp = at('app');
  const fPrecios = at('precios');
  const fLetra = at('letra');
  const fBueno = at('bueno');
  const fMalo = at('malo');
  const fTreinta = at('treinta');
  const sLogo = useSpring(lead - 6);
  const sInst = useSpring(fInst - 2, 14, 190);
  // La portada mientras suena la pregunta; luego, lo que se nombra: las tendencias de Inspiration, el reproductor, el
  // precio de Standard en «Change subscription», las horas que quedan (la letra pequeña: aquí se paga por horas) y,
  // con «treinta días», la cuenta en la prueba gratuita.
  const s0: Shot = { rec: '00_inicio_top', at: 0, start: 1.0, hold: 30 };
  const s1: Shot = { rec: '04_inspiration', at: fCat - 6, start: 3.0, hold: 16 };
  s1.marks = [markOn(s1, fCat + 2, fApp - 4, 8, 160, 648, 460, 22)];
  const s2: Shot = { rec: '11_velocidad', at: fApp - 5, start: 32.0, hold: 39.5 };
  const s3: Shot = { rec: '27_cambiar_plan', at: fPrecios - 5, start: 2.0, hold: 19.5 };
  s3.marks = [markOn(s3, fPrecios + 2, fLetra - 4, 88, 560, 488, 245, 18)];
  const s4: Shot = { rec: '16_horas', at: fLetra - 5, start: 1.0, hold: 3.9 };
  s4.marks = [markOn(s4, fLetra + 2, fTreinta - 8, 8, 136, 648, 316, 18)];
  const s5: Shot = { rec: '26_cuenta', at: fTreinta - 8, start: 10.0, hold: 22.0 };
  s5.marks = [markOn(s5, fTreinta, dur + 20, 16, 606, 632, 256, 18)];
  const shots = [s0, s1, s2, s3, s4, s5];
  const cx = 1425;
  const top = Math.round((1080 - PH.H) / 2);
  const cam = buildPhoneCam({
    dur, side: -1, cx, top, enter: 'spin', exit: 'none',
    focus: [
      { from: fCat + 4, to: fApp - 6, y: 390, s: 1.22 },
      { from: fPrecios + 4, to: fLetra - 6, y: 682, s: 1.38 },
      { from: fLetra + 4, to: fBueno - 8, y: 294, s: 1.42 },
      { from: fTreinta + 2, to: dur, y: 734, s: 1.36 },
    ],
  });
  return (
    <BkbStage>
      <AbsoluteFill>
        <PhoneHalo cam={cam} cx={cx} />
        <div style={{ position: 'absolute', top, left: cx - PH.W / 2 }}>
          <AppPhone shots={shots} w={PHONE_W} cam={cam} dim={0.72} motionBlur float={[30, dur]} />
        </div>
        <div style={{ position: 'absolute', left: 150, top: 0, height: 1080, width: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginBottom: 34 }}>
            <div style={{ opacity: sLogo, transform: `translateY(${((1 - sLogo) * 24).toFixed(2)}px)` }}>
              <BookBeatLogo width={330} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 22px 10px 12px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.soft,
              fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: color.ink, opacity: sInst, transform: `translateX(${((1 - sInst) * -24).toFixed(2)}px) scale(${(0.85 + 0.15 * sInst).toFixed(4)})`, transformOrigin: 'left center' }}>
              <CheckIcon size={38} /> Instalada y probada a fondo
            </div>
          </div>
          <MaskTitle text={'¿Merece la pena\nBookBeat?'} hi="BookBeat?" at={lead - 2} size={118} stagger={4} />
          <div style={{ display: 'flex', gap: 14, marginTop: 50, minHeight: 74 }}>
            <Chip at={fCat - 3} dimAt={fApp - 3} label="Catálogo" icon={<BookIcon size={26} />} size={30} reserve />
            <Chip at={fApp - 3} dimAt={fPrecios - 3} label="La app" icon={<PhoneIcon size={26} />} size={30} reserve />
            <Chip at={fPrecios - 3} dimAt={fLetra - 3} label="Precios" icon={<CardIcon size={26} />} size={30} reserve />
            <Chip at={fLetra - 3} dimAt={fBueno - 3} label="Letra pequeña" icon={<DocIcon size={26} />} size={30} reserve />
          </div>
          <div style={{ display: 'flex', gap: 18, marginTop: 24, minHeight: 86 }}>
            <Chip at={fBueno - 3} label="Lo bueno" icon={<CheckIcon size={36} c={color.green} />} accent="#E3F5EA" size={42} reserve />
            <Chip at={fMalo - 3} label="Lo malo" icon={<CrossIcon size={36} />} accent="#FDECEC" size={42} reserve />
            <Chip at={fTreinta - 3} label="30 días gratis" size={42} dark reserve />
          </div>
        </div>
      </AbsoluteFill>
      {/* El móvil entra girando (0 → 34): el barrido grave culmina a mitad de giro. */}
      <Sfx name="whoosh_deep" at={17} />
      <Sfx name="snap_in" at={fInst} volume={0.7} />
      {[fCat, fApp, fPrecios, fLetra].map((f) => <Sfx key={f} name="ui_pop" at={f - 2} volume={0.7} />)}
      {zoomPeaks(cam, 36, dur - 2).map((f) => <Sfx key={`z${f}`} name="zoom_in" at={f} volume={0.4} />)}
      <Sfx name="ui_pop" at={fBueno - 2} />
      <Sfx name="ui_pop" at={fMalo - 2} />
      <Sfx name="sparkle" at={fTreinta - 2} />
    </BkbStage>
  );
};

// D02 · Qué es: una app sueca de audiolibros y ebooks, del grupo Bonnier, en España desde 2022 (lanzamiento del 12/10/2022);
// aquí no hay tarifa sin límite: un paquete de horas al mes (el contador de horas), para escuchar y leer; y más de un millón
// de títulos (en el mercado español: 431.456 audiolibros y 954.795 ebooks, buscador de BookBeat, 14/10/2026).
export const D02Que: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('D02', w, n);
  const fApp = at('app');
  const fSueca = at('sueca');
  const fBonnier = at('bonnier');
  const fEspana = at('espana');
  const fDos = at('dos');
  const fAqui = at('aqui');
  const fLimite = at('limite');
  const fPagas = at('pagas');
  const fHoras = at('horas');
  const fEscuchas = at('escuchas');
  const fLees = at('lees');
  const fMas = at('mas');
  const fMillon = at('millon');
  const fTitulos = at('titulos');
  const A = usePhase(-10, fAqui - 8);
  const B = usePhase(fAqui - 8, fMas - 8);
  const C = usePhase(fMas - 8, dur + 20);
  const sLogo = useSpring(2);
  const sSe = useSpring(fSueca - 3, 13, 180);
  const bon = interpolate(frame, [fBonnier - 3, fBonnier + 8], [0, 1], { ...clamp, easing: easeOut });
  const sCard = useSpring(fEspana - 8, 15, 160);
  const ring = interpolate(frame, [fEspana + 2, fEspana + 26], [0, 1], { ...clamp, easing: easeOut });
  const sInf = useSpring(fAqui - 4, 14, 170);
  const strike = interpolate(frame, [fLimite - 2, fLimite + 10], [0, 1], { ...clamp, easing: easeOut });
  const fill = interpolate(frame, [fHoras - 6, fHoras + 22], [0, 1], { ...clamp, easing: easeInOut });
  const sMeter = useSpring(fPagas - 2, 15, 160);
  const sNum = useSpring(fMillon - 10, 13, 150);
  const under = interpolate(frame, [fMillon + 30, fMillon + 46], [0, 1], { ...clamp, easing: easeOut });
  // Móvil: la portada; con «horas», la página «Hours» (las horas que quedan del mes); con «millón», las categorías.
  const s0: Shot = { rec: '00_inicio_top', at: 0, start: 4.0, hold: 30 };
  const s1: Shot = { rec: '16_horas', at: fHoras - 8, start: 0.6, hold: 3.9 };
  s1.marks = [markOn(s1, fHoras, fMas - 10, 8, 136, 648, 170, 18)];
  const s2: Shot = { rec: '05_categorias', at: fMas - 8, start: 1.0, hold: 12.5 };
  const cx = 1425;
  const top = Math.round((1080 - PH.H) / 2);
  const cam = buildPhoneCam({ dur, side: -1, cx, top, enter: 'rise', exit: 'none', focus: [{ from: fHoras + 2, to: fMas - 10, y: 221, s: 1.4 }] });
  const fmt = (s: number, k = 0) => ({ opacity: s, transform: `translateY(${((1 - s) * (24 + k)).toFixed(2)}px) scale(${(0.86 + 0.14 * s).toFixed(4)})` });
  return (
    <BkbStage>
      <PhoneHalo cam={cam} cx={cx} />
      <div style={{ position: 'absolute', top, left: cx - PH.W / 2 }}>
        <AppPhone shots={[s0, s1, s2]} w={PHONE_W} cam={cam} dim={0.72} motionBlur float={[0, dur]} />
      </div>
      {A.visible && (
        <div style={{ position: 'absolute', left: 130, top: 0, height: 1080, width: 1040, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...A.style }}>
          <div style={{ opacity: sLogo, transform: `translateY(${((1 - sLogo) * 24).toFixed(2)}px)` }}>
            <BookBeatLogo width={560} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 40, minHeight: 92 }}>
            <Chip at={fApp - 3} label="Audiolibros y ebooks" icon={<HeadphonesIcon size={36} />} size={44} reserve />
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 28px 14px 16px', borderRadius: 999, background: BB_INK, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 38,
              whiteSpace: 'nowrap', opacity: sSe, transform: `translateY(${((1 - sSe) * 20).toFixed(2)}px) scale(${(0.86 + 0.14 * sSe).toFixed(4)})`, transformOrigin: 'left center' }}>
              <FlagSE w={52} /> Sueca
              {bon > 0.01 && <span style={{ color: BB, opacity: bon, display: 'inline-block', maxWidth: `${(bon * 320).toFixed(1)}px`, overflow: 'hidden', transform: `translateX(${((1 - bon) * -10).toFixed(2)}px)` }}>· grupo Bonnier</span>}
            </div>
          </div>
          {/* En España desde 2022 */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 34, width: 820, marginTop: 44, padding: '38px 46px', borderRadius: 40, background: '#fff', border: `1px solid ${color.line}`,
            boxShadow: shadow.card, boxSizing: 'border-box', opacity: sCard, transform: `translateY(${((1 - sCard) * 40).toFixed(2)}px) scale(${(0.94 + 0.06 * sCard).toFixed(4)})`, transformOrigin: 'left center' }}>
            <div style={{ position: 'relative' }}>
              {ring > 0 && ring < 1 && <div style={{ position: 'absolute', inset: -10, borderRadius: 14, border: `${(5 * (1 - ring) + 0.5).toFixed(2)}px solid ${BB}`, opacity: 0.8 * (1 - ring), transform: `scale(${1 + 0.5 * ring})` }} />}
              <FlagES w={130} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 36, color: color.ink2 }}>En España desde</div>
              <div style={{ fontFamily: font.sans, fontWeight: 700, color: color.ink, height: 104 }}>
                {frame >= fDos - 8 && <Odometer text="2022" at={fDos - 8} size={104} dur={28} stagger={2} spins={0} style={{ letterSpacing: -4 }} />}
              </div>
            </div>
          </div>
        </div>
      )}
      {B.visible && (
        <div style={{ position: 'absolute', left: 130, top: 0, height: 1080, width: 1100, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...B.style }}>
          {/* «Aquí no hay tarifa sin límite»: el ∞ se tacha. */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, alignSelf: 'flex-start', padding: '16px 34px 16px 22px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.soft,
            fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink, ...fmt(sInf, 10) }}>
            <InfinityIcon size={54} c={color.ink2} />
            <span style={{ position: 'relative', display: 'inline-block', opacity: 1 - 0.45 * strike }}>
              Tarifa sin límite
              <span style={{ position: 'absolute', left: -4, right: -4, top: '54%', height: 5, borderRadius: 3, background: BB_RED, transform: `scaleX(${strike.toFixed(4)})`, transformOrigin: 'left center' }} />
            </span>
            <span style={{ display: 'inline-flex', transform: `scale(${strike.toFixed(4)})` }}><CrossIcon size={44} /></span>
          </div>
          <MaskTitle text={'Pagas un paquete\nde horas al mes'} hi="horas" at={fPagas - 6} size={100} style={{ marginTop: 44 }} />
          <div style={{ marginTop: 46, opacity: sMeter, transform: `translateY(${((1 - sMeter) * 24).toFixed(2)}px)` }}>
            <HoursMeter left={fill} total={20} w={760} h={84} fill={BB} />
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 34, minHeight: 84 }}>
            <Chip at={fEscuchas - 3} label="Escuchas" icon={<HeadphonesIcon size={32} />} size={40} reserve />
            <Chip at={fLees - 3} label="Y lees" icon={<BookIcon size={32} />} size={40} reserve />
          </div>
        </div>
      )}
      {C.visible && (
        <div style={{ position: 'absolute', left: 130, top: 0, height: 1080, width: 1100, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...C.style }}>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 52, color: color.ink2, opacity: sNum }}>Más de</div>
          <div style={{ position: 'relative', alignSelf: 'flex-start', marginTop: 6, fontFamily: font.sans, fontWeight: 700, color: color.ink, ...fmt(sNum, 30) }}>
            <Odometer text="1.000.000" at={fMillon - 8} size={190} dur={40} stagger={3} style={{ letterSpacing: -8 }} />
            <div style={{ position: 'absolute', left: 6, right: 6, bottom: -18, height: 16, borderRadius: 8, background: BB, transform: `scaleX(${under.toFixed(4)})`, transformOrigin: 'left center' }} />
          </div>
          <div style={{ marginTop: 44, fontFamily: font.sans, fontWeight: 700, fontSize: 56, color: color.ink, opacity: interpolate(frame, [fTitulos - 4, fTitulos + 8], [0, 1], clamp) }}>de títulos</div>
          <div style={{ display: 'flex', gap: 16, marginTop: 30, minHeight: 84 }}>
            <Chip at={fTitulos + 6} label="Audiolibros" icon={<HeadphonesIcon size={32} />} size={40} reserve />
            <Chip at={fTitulos + 12} label="Ebooks" icon={<BookIcon size={32} />} size={40} reserve />
          </div>
        </div>
      )}
      <Sfx name="snap_in" at={fApp} volume={0.7} />
      <Sfx name="ui_pop" at={fSueca - 2} />
      <Sfx name="whoosh_soft" at={fEspana - 10} volume={0.6} />
      <Sfx name="hit_soft" at={fEspana + 3} volume={0.6} />
      <ChangeTicks value={(f) => odometerShown('2022', fDos - 8, fps, f, 28, 2, 0)} from={fDos - 8} to={fDos + 30} volume={0.4} />
      <Sfx name="whoosh_soft" at={fAqui - 12} />
      <Sfx name="cross" at={fLimite + 2} volume={0.6} />
      <Sfx name="draw" at={fHoras - 4} volume={0.45} dur={26} fade={8} />
      <Sfx name="ui_pop" at={fEscuchas - 2} volume={0.55} />
      <Sfx name="ui_pop" at={fLees - 2} volume={0.5} />
      <Sfx name="whoosh_soft" at={fMas - 10} />
      <ChangeTicks value={(f) => odometerShown('1.000.000', fMillon - 8, fps, f, 40, 3)} from={fMillon - 8} to={fMillon + 50} volume={0.45} />
      <Sfx name="hit_soft" at={fMillon + 30} volume={0.6} />
      {zoomPeaks(cam, 2, dur - 2).map((f) => <Sfx key={`z${f}`} name="zoom_in" at={f} volume={0.4} />)}
    </BkbStage>
  );
};

// Tarjeta de un plan (los colores de BookBeat para cada plan: Basic verde, Standard amarillo y Premium lila, como en su
// ventana «Change subscription»): precio y horas al mes, con una barra que se llena hasta las horas del plan (sobre 100).
const PlanCard: React.FC<{
  name: string; price: string; hours: number; fIn: number; fPrice: number; fHours: number; act: number; band: string; soft: string; w: number;
}> = ({ name, price, hours, fIn, fPrice, fHours, act, band, soft, w }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - fIn, fps, config: { damping: 14, stiffness: 130 } });
  const grow = interpolate(frame, [fHours - 4, fHours + 20], [0, 1], { ...clamp, easing: easeInOut });
  const hrsIn = spring({ frame: frame - (fHours - 4), fps, config: { damping: 13, stiffness: 190 } });
  if (frame < fIn - 2) return <div style={{ width: w, height: 540 }} />;
  return (
    <div style={{ position: 'relative', width: w, height: 540, borderRadius: 44, background: '#fff', overflow: 'hidden', boxSizing: 'border-box',
      boxShadow: `0 0 0 ${(5 * act).toFixed(2)}px ${BB_INK}, 0 ${(40 + 30 * act).toFixed(1)}px ${(90 + 30 * act).toFixed(1)}px rgba(16,16,16,${(0.12 + 0.06 * act).toFixed(3)})`,
      opacity: Math.min(1, s * 1.4), transform: `translateY(${((1 - s) * 110 - 14 * act).toFixed(2)}px) rotateX(${((1 - s) * 50).toFixed(2)}deg) scale(${((0.92 + 0.08 * s) * (1 + 0.025 * act)).toFixed(4)})`, transformOrigin: '50% 100%' }}>
      <div style={{ height: 22, background: band }} />
      <Sheen at={fIn + 6} radius={44} tint="rgba(255,255,255,0.6)" />
      <div style={{ padding: '30px 44px 0' }}>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 58, letterSpacing: -1.6, color: color.ink }}>{name}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6, fontFamily: font.sans, fontWeight: 700, color: color.ink }}>
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <Odometer text={price} at={fPrice - 8} size={124} style={{ letterSpacing: -5 }} />
            {frame < fPrice - 9 && <Shimmer frame={frame} r={24} />}
          </span>
          <span style={{ fontSize: 54, opacity: interpolate(frame, [fPrice + 2, fPrice + 12], [0, 1], clamp) }}>€</span>
          <span style={{ fontSize: 28, fontWeight: 500, color: color.muted, opacity: interpolate(frame, [fPrice + 6, fPrice + 16], [0, 1], clamp) }}>al mes</span>
        </div>
        <div style={{ height: 1, background: color.line, margin: '26px 0 26px' }} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, fontFamily: font.sans, fontWeight: 700, color: color.ink, opacity: hrsIn, transform: `translateY(${((1 - hrsIn) * 18).toFixed(2)}px)` }}>
          <span style={{ fontSize: 84, letterSpacing: -3, fontVariantNumeric: 'tabular-nums' }}>{Math.round(hours * grow)}</span>
          <span style={{ fontSize: 40 }}>horas</span>
          <span style={{ fontSize: 28, fontWeight: 500, color: color.muted }}>al mes</span>
        </div>
        <div style={{ position: 'relative', height: 30, marginTop: 18, borderRadius: 15, background: soft, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(hours * grow).toFixed(2)}%`, borderRadius: 15, background: band }} />
        </div>
      </div>
    </div>
  );
};

// D03 · Tres planes (bookbeat.com/es, 14/10/2026): Basic 6,99 € con 20 h, Standard 9,99 € con 50 h y Premium 14,99 € con 100 h;
// hasta cuatro perfiles más a 4,99 € cada uno; cambiar de plan o cancelar cuando quieras.
export const D03Planes: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('D03', w, n);
  const fBasic = at('basic');
  const fSeis = at('seis');
  const fVeinte = at('veinte');
  const fStd = at('standard');
  const fNueve = at('nueve', 1); // el primer «nueve» es el de «seis noventa y nueve»
  const fCinc = at('cincuenta');
  const fPrem = at('premium');
  const fCat = at('catorce');
  const fCien = at('cien');
  const fPerf = at('perfiles');
  const fCuatro = at('cuatro', 1);
  const fCambiar = at('cambiar');
  const fCancelar = at('cancelar');
  const CW = 540;
  const GAP = 44;
  const nAdd = 1 + [fStd, fPrem].reduce((a, f) => a + spring({ frame: frame - (f - 12), fps, config: { damping: 18, stiffness: 120 } }), 0);
  const actB = interpolate(frame, [fBasic - 6, fBasic + 4, fStd - 8, fStd], [0, 1, 1, 0], clamp);
  const actS = interpolate(frame, [fStd - 6, fStd + 4, fPrem - 8, fPrem], [0, 1, 1, 0], clamp);
  const actP = interpolate(frame, [fPrem - 6, fPrem + 4, fPerf - 8, fPerf], [0, 1, 1, 0], clamp);
  const sTitle = interpolate(frame, [fBasic - 4, fBasic + 12], [0, 1], { ...clamp, easing: easeInOut });
  const sPerf = spring({ frame: frame - fPerf + 4, fps, config: { damping: 14, stiffness: 180 } });
  const price = interpolate(frame, [fCuatro - 4, fCuatro + 8], [0, 1], { ...clamp, easing: easeOut });
  const sCamb = spring({ frame: frame - fCambiar + 2, fps, config: { damping: 14, stiffness: 180 } });
  const canc = interpolate(frame, [fCancelar - 4, fCancelar + 8], [0, 1], { ...clamp, easing: easeOut });
  return (
    <BkbStage>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 96, display: 'flex', justifyContent: 'center', opacity: 1 - 0.85 * sTitle, transform: `translateY(${(-50 * sTitle).toFixed(2)}px) scale(${(1 - 0.14 * sTitle).toFixed(4)})`, filter: sTitle > 0.05 ? `blur(${(sTitle * 2.4).toFixed(2)}px)` : undefined }}>
        <MaskTitle text="Tres planes" hi="planes" at={2} size={88} align="center" />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 196, display: 'flex', justifyContent: 'center', gap: GAP, perspective: 2200, transform: `translateX(${((3 - nAdd) * (CW + GAP) / 2).toFixed(2)}px)` }}>
        <PlanCard name="Basic" price="6,99" hours={20} fIn={fBasic - 8} fPrice={fSeis} fHours={fVeinte} act={actB} band={BB_GREEN} soft={BB_GREEN_SOFT} w={CW} />
        <PlanCard name="Standard" price="9,99" hours={50} fIn={fStd - 8} fPrice={fNueve} fHours={fCinc} act={actS} band={BB_YELLOW} soft={BB_YELLOW_SOFT} w={CW} />
        <PlanCard name="Premium" price="14,99" hours={100} fIn={fPrem - 8} fPrice={fCat} fHours={fCien} act={actP} band={BB} soft={BB_SOFT} w={CW} />
      </div>
      {/* Perfiles y sin permanencia */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 790, display: 'flex', justifyContent: 'center', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 32px 16px 18px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.float,
          fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink, opacity: sPerf, transform: `translateY(${((1 - sPerf) * 40).toFixed(2)}px) scale(${(0.85 + 0.15 * sPerf).toFixed(4)})` }}>
          <span style={{ display: 'inline-flex' }}>
            {[0, 1, 2, 3].map((k) => {
              const sk = spring({ frame: frame - (fPerf + 2 + k * 3), fps, config: { damping: 12, stiffness: 220 } });
              return (
                <span key={k} style={{ width: 52, height: 52, borderRadius: '50%', background: [BB, BB_YELLOW, BB_GREEN, BB_SOFT][k], border: '3px solid #fff', marginLeft: k ? -14 : 0,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${sk.toFixed(4)})` }}><UserIcon size={28} /></span>
              );
            })}
          </span>
          Hasta 4 perfiles más<span style={{ opacity: price, color: BB_DEEP }}>&nbsp;· 4,99 € cada uno</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 32px 16px 20px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.float,
          fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink, opacity: sCamb, transform: `translateY(${((1 - sCamb) * 40).toFixed(2)}px) scale(${(0.85 + 0.15 * sCamb).toFixed(4)})` }}>
          <CheckIcon size={44} /> <span>Cambia de plan<span style={{ opacity: canc }}>&nbsp;o cancela</span></span>
        </div>
      </div>
      <Sfx name="card_flip" at={fBasic + 2} />
      <ChangeTicks value={(f) => odometerShown('6,99', fSeis - 8, fps, f)} from={fSeis - 8} to={fSeis + 32} volume={0.5} />
      <Sfx name="draw" at={fVeinte - 2} volume={0.4} dur={20} fade={6} />
      <Sfx name="swipe" at={fStd - 10} volume={0.5} />
      <Sfx name="card_flip" at={fStd + 2} />
      <ChangeTicks value={(f) => odometerShown('9,99', fNueve - 8, fps, f)} from={fNueve - 8} to={fNueve + 32} volume={0.5} />
      <Sfx name="draw" at={fCinc - 2} volume={0.4} dur={20} fade={6} />
      <Sfx name="swipe" at={fPrem - 10} volume={0.5} />
      <Sfx name="card_flip" at={fPrem + 2} />
      <ChangeTicks value={(f) => odometerShown('14,99', fCat - 8, fps, f)} from={fCat - 8} to={fCat + 32} volume={0.5} />
      <Sfx name="draw" at={fCien - 2} volume={0.4} dur={20} fade={6} />
      <Sfx name="ui_pop" at={fPerf} volume={0.7} />
      {[0, 1, 2, 3].map((k) => <Sfx key={`a${k}`} name="tick_soft" at={fPerf + 3 + k * 3} volume={0.45} />)}
      <Sfx name="ui_pop" at={fCambiar} volume={0.6} />
    </BkbStage>
  );
};

// D04 · Primer aviso: en España la app y la web están en inglés (la app de Android 10.19.1 con el sistema en español y
// bookbeat.com/es, 14/10/2026); no hay ajuste de idioma (la ayuda de BookBeat y la propia app: solo el idioma de los libros).
export const D04Ingles: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('D04', w, n);
  const fOjo = at('ojo');
  const fPrimera = at('primera');
  const fApp = at('app');
  const fWeb = at('web');
  const fIngles = at('ingles');
  const fAunque = at('aunque');
  const fNo = at('no');
  const s0: Shot = { rec: '04_inspiration', at: 0, start: 2.4, hold: 16 };
  s0.marks = [markOn(s0, fApp - 2, fAunque - 6, 8, 160, 648, 1000, 22)];
  const cx = 470;
  const top = Math.round((1080 - PH.H) / 2);
  const cam = buildPhoneCam({ dur, side: 1, cx, top, enter: 'rise', exit: 'none', focus: [{ from: fApp, to: fAunque - 8, y: 600, s: 1.12 }] });
  const sOne = spring({ frame: frame - fPrimera + 2, fps, config: { damping: 13, stiffness: 190 } });
  const sWin = spring({ frame: frame - (fWeb - 6), fps, config: { damping: 16, stiffness: 140 } });
  const stamp = (f: number) => {
    const p = interpolate(frame, [f, f + 7], [0, 1], { ...clamp, easing: (t) => t * t * t });
    const sq = interpolate(frame, [f + 7, f + 10, f + 18], [1, 0.92, 1], { ...clamp, easing: easeOut });
    return { opacity: interpolate(p, [0, 0.4], [0, 1], clamp), transform: `rotate(${(-16 + 8 * p).toFixed(2)}deg) scale(${(frame < f + 7 ? 2.3 - 1.3 * p : sq).toFixed(4)})` };
  };
  const sAun = spring({ frame: frame - fAunque + 2, fps, config: { damping: 14, stiffness: 180 } });
  const sNo = spring({ frame: frame - fNo, fps, config: { damping: 11, stiffness: 210 } });
  const k = frame - fNo - 4;
  const shake = k >= 0 && k < 14 ? 7 * Math.exp(-k / 3.5) * Math.sin(k * 2.1) : 0;
  const W = 820;
  return (
    <BkbStage>
      <PhoneHalo cam={cam} cx={cx} />
      <div style={{ position: 'absolute', top, left: cx - PH.W / 2 }}>
        <AppPhone shots={[s0]} w={PHONE_W} cam={cam} dim={0.72} motionBlur float={[0, dur]} />
      </div>
      {frame >= fIngles && (
        <div style={{ position: 'absolute', left: cx + 120, top: 110, zIndex: 20, ...stamp(fIngles) }}>
          <EnSticker size={150} />
        </div>
      )}
      <div style={{ position: 'absolute', left: 900, top: 0, height: 1080, width: 940, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <MaskTitle text="Ojo: dos cosas" hi="dos" at={Math.max(0, fOjo - 8)} size={96} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 30, fontFamily: font.sans, fontWeight: 700, fontSize: 46, color: color.ink, letterSpacing: -1,
          opacity: sOne, transform: `translateX(${((1 - sOne) * -24).toFixed(2)}px)` }}>
          <span style={{ width: 66, height: 66, borderRadius: '50%', background: BB, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, flexShrink: 0 }}>1</span>
          La app y la web, en inglés
        </div>
        {/* bookbeat.com/es: la portada en inglés (grabación real). */}
        <div style={{ position: 'relative', marginTop: 34, alignSelf: 'flex-start', opacity: sWin, transform: `translateY(${((1 - sWin) * 50).toFixed(2)}px) scale(${(0.92 + 0.08 * sWin).toFixed(4)})`, transformOrigin: 'left top' }}>
          <TiltWindow width={W} url="bookbeat.com/es" ry={-5} rx={2}>
            {frame >= fWeb - 8 && (
              <Sequence from={fWeb - 8} layout="none">
                <ScreenClip src="bkb/web/00_bb_inicio/video.mp4" width={W} startAt={Math.max(0, m00.marks.to_btn - 0.4)} holdAt={m00.marks.to_btn} showCursor={false}
                  camera={[{ f: 0, zoom: 1.0, x: 960, y: 540 }, { f: 120, zoom: 1.06, x: 900, y: 500 }]} />
              </Sequence>
            )}
          </TiltWindow>
          {frame >= fIngles + 5 && (
            <div style={{ position: 'absolute', right: -40, top: -46, zIndex: 20, ...stamp(fIngles + 5) }}>
              <EnSticker size={124} />
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 34, minHeight: 170 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, alignSelf: 'flex-start', padding: '14px 30px 14px 18px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.soft,
            fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.ink, opacity: sAun, transform: `translateY(${((1 - sAun) * 24).toFixed(2)}px)` }}>
            <PhoneIcon size={40} /> Aunque tengas el móvil en español <FlagES w={48} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, alignSelf: 'flex-start', padding: '14px 30px 14px 18px', borderRadius: 999, background: '#FDECEC', border: '2px solid rgba(229,72,77,0.3)',
            fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.ink, opacity: sNo, transform: `translateX(${shake.toFixed(2)}px) translateY(${((1 - sNo) * 24).toFixed(2)}px) scale(${(0.9 + 0.1 * sNo).toFixed(4)})`, transformOrigin: 'left center' }}>
            <CrossIcon size={42} /> No se puede cambiar
          </div>
        </div>
      </div>
      <Sfx name="hit_soft" at={fOjo} volume={0.6} />
      <Sfx name="ui_pop" at={fPrimera} volume={0.7} />
      <Sfx name="whoosh_soft" at={fWeb - 8} volume={0.5} />
      <Sfx name="stamp" at={fIngles + 7} volume={0.8} />
      <Sfx name="stamp" at={fIngles + 12} volume={0.55} />
      <Sfx name="ui_pop" at={fAunque} volume={0.6} />
      <Sfx name="cross" at={fNo + 4} volume={0.6} />
      {zoomPeaks(cam, 2, dur - 2).map((f) => <Sfx key={`z${f}`} name="zoom_in" at={f} volume={0.4} />)}
    </BkbStage>
  );
};

// Fila de un libro (sin portada: icono de libro con el color de la columna).
const BookRow: React.FC<{ at: number; title: string; author: string; ok: boolean }> = ({ at, title, author, ok }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 180 } });
  const mark = spring({ frame: frame - at - 6, fps, config: { damping: 11, stiffness: 220 } });
  if (frame < at - 2) return <div style={{ height: 118 }} />;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, height: 118, padding: '0 26px', borderRadius: 28, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.soft,
      opacity: s, transform: `translateX(${((1 - s) * (ok ? -40 : 40)).toFixed(2)}px)` }}>
      <span style={{ width: 62, height: 80, borderRadius: 10, background: ok ? BB_GREEN_SOFT : '#F3F3F3', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <BookIcon size={36} c={ok ? '#1F7A35' : color.muted} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: ok ? color.ink : color.ink2, letterSpacing: -0.6, whiteSpace: 'nowrap' }}>{title}</div>
        <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 27, color: color.muted, marginTop: 4 }}>{author}</div>
      </div>
      <span style={{ display: 'inline-flex', transform: `scale(${mark.toFixed(4)})` }}>{ok ? <CheckIcon size={52} /> : <CrossIcon size={52} />}</span>
    </div>
  );
};

// D05 · Segundo aviso: el catálogo en español. De más de un millón de títulos, en español hay ~16.500 audiolibros (16.511 en
// el buscador de BookBeat para el mercado español, 14/10/2026). Están La sombra del viento y La Bestia; faltan Reina Roja
// (Gómez-Jurado) y Los tres mundos (Posteguillo): búsquedas en la app y en su buscador, 14/10/2026.
export const D05Catalogo: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('D05', w, n);
  const fSeg = at('segunda');
  const fMillon = at('millon');
  const fEsp = at('espanol');
  const fDiec = at('dieciseis');
  const fAud = at('audiolibros');
  const fHay = at('hay', 1);
  const fSombra = at('sombra');
  const fBestia = at('bestia');
  const fFaltan = at('faltan');
  const fReina = at('reina');
  const fTres = at('tres');
  const A = usePhase(-10, fHay - 8);
  const B = usePhase(fHay - 8, dur + 20);
  const sTwo = spring({ frame: frame - fSeg + 2, fps, config: { damping: 13, stiffness: 190 } });
  const sBar = spring({ frame: frame - fMillon + 6, fps, config: { damping: 16, stiffness: 140 } });
  const sliver = interpolate(frame, [fEsp - 2, fEsp + 14], [0, 1], { ...clamp, easing: easeOut });
  const sNum = spring({ frame: frame - (fDiec - 8), fps, config: { damping: 13, stiffness: 150 } });
  const sAud = interpolate(frame, [fAud - 4, fAud + 8], [0, 1], { ...clamp, easing: easeOut });
  const sYes = spring({ frame: frame - fHay + 4, fps, config: { damping: 15, stiffness: 150 } });
  const sNoCol = spring({ frame: frame - fFaltan + 4, fps, config: { damping: 15, stiffness: 150 } });
  const BW = 1180;
  const frac = 16511 / (431456 + 954795);
  return (
    <BkbStage>
      {A.visible && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', ...A.style }}>
          <div style={{ width: BW }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontFamily: font.sans, fontWeight: 700, fontSize: 52, color: color.ink, letterSpacing: -1.2,
              opacity: sTwo, transform: `translateX(${((1 - sTwo) * -24).toFixed(2)}px)` }}>
              <span style={{ width: 72, height: 72, borderRadius: '50%', background: BB, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, flexShrink: 0 }}>2</span>
              El catálogo en español
            </div>
            {/* La barra entera es el catálogo; el trocito lila, los audiolibros en español. */}
            <div style={{ marginTop: 70, opacity: sBar, transform: `translateY(${((1 - sBar) * 30).toFixed(2)}px)` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: color.ink2, marginBottom: 14 }}>
                <span>Todo el catálogo</span><span>+1.000.000 de títulos</span>
              </div>
              <div style={{ position: 'relative', height: 96, borderRadius: 26, background: `repeating-linear-gradient(90deg, ${BB} 0 22px, #C08AF5 22px 24px)`, opacity: 0.55 + 0.45 * (1 - sliver) }} />
              <div style={{ position: 'relative', height: 0 }}>
                <div style={{ position: 'absolute', left: 0, top: -96, height: 96, width: Math.max(14, BW * frac) * sliver, borderRadius: '26px 4px 4px 26px', background: BB_INK }} />
                <div style={{ position: 'absolute', left: 6, top: 6, width: 3, height: 46 * sliver, background: BB_INK }} />
              </div>
            </div>
            <div style={{ marginTop: 58, display: 'flex', alignItems: 'baseline', gap: 24, fontFamily: font.sans, fontWeight: 700, color: color.ink, opacity: sNum, transform: `translateY(${((1 - sNum) * 30).toFixed(2)}px)` }}>
              <span style={{ fontSize: 44, color: color.ink2 }}>En español:</span>
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <Odometer text="16.500" at={fDiec - 6} size={150} dur={36} stagger={3} color={BB_DEEP} style={{ letterSpacing: -6 }} />
              </span>
              <span style={{ fontSize: 48, opacity: sAud }}>audiolibros</span>
            </div>
          </div>
        </AbsoluteFill>
      )}
      {B.visible && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', ...B.style }}>
          <div style={{ display: 'flex', gap: 56, transform: 'scale(1.12)' }}>
            <div style={{ width: 760, opacity: sYes, transform: `translateY(${((1 - sYes) * 40).toFixed(2)}px)` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: font.sans, fontWeight: 700, fontSize: 52, color: color.ink, letterSpacing: -1.2, marginBottom: 30 }}>
                <CheckIcon size={58} /> Superventas, sí
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <BookRow at={fSombra - 3} title="La sombra del viento" author="Carlos Ruiz Zafón" ok />
                <BookRow at={fBestia - 3} title="La Bestia" author="Carmen Mola" ok />
              </div>
            </div>
            <div style={{ width: 760, opacity: sNoCol, transform: `translateY(${((1 - sNoCol) * 40).toFixed(2)}px)` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: font.sans, fontWeight: 700, fontSize: 52, color: color.ink, letterSpacing: -1.2, marginBottom: 30 }}>
                <CrossIcon size={58} /> Faltan muy buscados
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <BookRow at={fReina - 3} title="Reina Roja" author="Juan Gómez-Jurado" ok={false} />
                <BookRow at={fTres - 3} title="Los tres mundos" author="Santiago Posteguillo" ok={false} />
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}
      <Sfx name="ui_pop" at={fSeg} volume={0.7} />
      <Sfx name="draw" at={fMillon - 4} volume={0.4} dur={18} fade={6} />
      <Sfx name="tick_soft" at={fEsp + 2} volume={0.7} />
      <ChangeTicks value={(f) => odometerShown('16.500', fDiec - 6, fps, f, 36, 3)} from={fDiec - 6} to={fDiec + 40} volume={0.45} />
      <Sfx name="hit_soft" at={fAud} volume={0.6} />
      <Sfx name="whoosh_soft" at={fHay - 10} volume={0.6} />
      <Sfx name="success" at={fSombra + 4} volume={0.45} />
      <Sfx name="tick_soft" at={fBestia + 4} volume={0.6} />
      <Sfx name="hit_soft" at={fFaltan} volume={0.6} />
      <Sfx name="cross" at={fReina + 4} volume={0.55} />
      <Sfx name="cross" at={fTres + 4} volume={0.55} />
    </BkbStage>
  );
};

export { BB_SOFT, GlobeIcon };
