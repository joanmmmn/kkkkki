import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { ChangeTicks, Sfx } from '../../components/Sfx';
import { BookIcon, CheckIcon, CrossIcon, HeadphonesIcon, MicIcon } from '../../components/Icons';
import { CalendarIcon, CardIcon, DocIcon, InfinityIcon, PhoneIcon, StarIcon } from '../../components/Icons2';
import { wf } from './timeline';
import type { SceneProps } from './registry';
import {
  align, AppFeatureScene, AppPhone, AU, AU_DEEP, AU_HOT, AU_NAVY, AU_SOFT, AudibleLogo, AudibleMark, AudStage, buildPhoneCam, Chip, markOn, MaskTitle, Odometer,
  odometerShown, OriginalBadge, PH, PhoneHalo, PHONE_W, Sheen, Shot, zoomPeaks,
} from './kit';

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

// Hueco con brillo hasta que la voz dice la cifra (como en las notas de las tiendas).
const Shimmer: React.FC<{ frame: number; r?: number; tint?: [string, string] }> = ({ frame, r = 24, tint = ['#EDEDED', '#F9F9F9'] }) => (
  <span style={{ position: 'absolute', left: 0, right: 6, top: '16%', bottom: '8%', borderRadius: r, background: `linear-gradient(100deg, ${tint[0]} 35%, ${tint[1]} 50%, ${tint[0]} 65%)`,
    backgroundSize: '300% 100%', backgroundPosition: `${100 - ((frame * 2.4) % 100)}% 0` }} />
);

const FlagES: React.FC<{ w?: number }> = ({ w = 64 }) => (
  <svg width={w} height={w * 0.72} viewBox="0 0 36 26" style={{ borderRadius: 6, boxShadow: '0 0 0 1px rgba(0,0,0,0.08)' }}>
    <rect width="36" height="26" fill="#C60B1E" /><rect y="6.5" width="36" height="13" fill="#FFC400" />
  </svg>
);

// G01 · Gancho: el móvil entra girando con la app real y enseña lo que nombra la voz; a la izquierda, la pregunta.
export const G01Hook: React.FC<P> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('G01', w, n);
  const fInst = at('instalado');
  const fCat = at('catalogo');
  const fOrig = at('originals');
  const fApp = at('app');
  const fLetra = at('letra');
  const fBueno = at('bueno');
  const fMalo = at('malo');
  const fTreinta = at('treinta');
  const sLogo = useSpring(lead - 6);
  const sInst = useSpring(fInst - 2, 14, 190);
  // La portada mientras suena la pregunta; luego, lo que se nombra: el top 20, Drácula, el reproductor, la letra pequeña
  // (un superventas que se paga aparte) y, con «treinta días», la suscripción Premium.
  const s0: Shot = { rec: '00_inicio_top', at: 0, start: 1.0, hold: 15 };
  const s1: Shot = { rec: '04_top20', at: fCat - 6, start: 1.4, hold: 6.5 };
  s1.marks = [markOn(s1, fCat + 2, fOrig - 4, 10, 560, 644, 760, 24)];
  const s2: Shot = { rec: '05_dracula', at: fOrig - 5, start: 3.0, hold: 6.8 };
  const s3: Shot = { rec: '12_reproductor', at: fApp - 5, start: 6.0, hold: 17 };
  const s4: Shot = { rec: '11_tres_mundos', at: fLetra - 6, start: 3.0, hold: 18 };
  s4.marks = [markOn(s4, fLetra + 2, fBueno - 4, 24, 744, 616, 300, 22)];
  const s5: Shot = { rec: '19_suscripcion', at: fTreinta - 8, start: 17.0, hold: 18.5 };
  s5.marks = [markOn(s5, fTreinta, dur + 20, 16, 380, 632, 440, 22)];
  const shots = [s0, s1, s2, s3, s4, s5];
  const cx = 1425;
  const top = Math.round((1080 - PH.H) / 2);
  const cam = buildPhoneCam({
    dur, side: -1, cx, top, enter: 'spin', exit: 'none',
    focus: [
      { from: fCat + 4, to: fOrig - 6, y: 820, s: 1.18 },
      { from: fLetra + 4, to: fBueno - 8, y: 880, s: 1.55 },
      { from: fTreinta + 2, to: dur, y: 560, s: 1.4 },
    ],
  });
  return (
    <AudStage>
      <AbsoluteFill>
        <PhoneHalo cam={cam} cx={cx} />
        <div style={{ position: 'absolute', top, left: cx - PH.W / 2 }}>
          <AppPhone shots={shots} w={PHONE_W} cam={cam} dim={0.72} motionBlur float={[30, dur]} />
        </div>
        <div style={{ position: 'absolute', left: 150, top: 0, height: 1080, width: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginBottom: 30 }}>
            <div style={{ opacity: sLogo, transform: `translateY(${((1 - sLogo) * 24).toFixed(2)}px)` }}>
              <AudibleLogo width={290} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 22px 10px 12px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.soft,
              fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: color.ink, opacity: sInst, transform: `translateX(${((1 - sInst) * -24).toFixed(2)}px) scale(${(0.85 + 0.15 * sInst).toFixed(4)})`, transformOrigin: 'left center' }}>
              <CheckIcon size={38} /> Instalada y probada a fondo
            </div>
          </div>
          <MaskTitle text="¿Merece la pena Audible?" hi="Audible" at={lead - 2} size={118} stagger={4} />
          <div style={{ display: 'flex', gap: 14, marginTop: 50, minHeight: 74 }}>
            <Chip at={fCat - 3} dimAt={fOrig - 3} label="Catálogo" icon={<BookIcon size={26} />} size={30} reserve />
            <Chip at={fOrig - 3} dimAt={fApp - 3} label="Originals" icon={<MicIcon size={26} />} size={30} reserve />
            <Chip at={fApp - 3} dimAt={fLetra - 3} label="La app" icon={<PhoneIcon size={26} />} size={30} reserve />
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
      {[fCat, fOrig, fApp, fLetra].map((f) => <Sfx key={f} name="ui_pop" at={f - 2} volume={0.7} />)}
      {zoomPeaks(cam, 36, dur - 2).map((f) => <Sfx key={`z${f}`} name="zoom_in" at={f} volume={0.4} />)}
      <Sfx name="ui_pop" at={fBueno - 2} />
      <Sfx name="ui_pop" at={fMalo - 2} />
      <Sfx name="sparkle" at={fTreinta - 2} />
    </AudStage>
  );
};

// Símbolo ∞ que se dibuja, con un brillo que lo recorre (el «sin límite de horas» de Premium).
const InfinityDraw: React.FC<{ at: number; w: number; c?: string; stroke?: number }> = ({ at, w, c = AU, stroke = 26 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 30], [0, 1], { ...clamp, easing: easeInOut });
  const glow = interpolate(frame, [at + 24, at + 40, at + 60], [0, 1, 0.35], clamp);
  const L = 1060;
  const h = w * 0.5;
  const d = 'M200 100 C 260 20, 380 20, 380 100 C 380 180, 260 180, 200 100 C 140 20, 20 20, 20 100 C 20 180, 140 180, 200 100 Z';
  return (
    <svg width={w} height={h} viewBox="0 0 400 200" style={{ overflow: 'visible', filter: `drop-shadow(0 ${(8 + 10 * glow).toFixed(1)}px ${(18 + 26 * glow).toFixed(1)}px rgba(247,153,28,${(0.2 + 0.28 * glow).toFixed(3)}))` }}>
      <path d={d} fill="none" stroke={AU_SOFT} strokeWidth={stroke} strokeLinecap="round" />
      <path d={d} fill="none" stroke={c} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} />
    </svg>
  );
};

// G02 · Qué es: «la app de audiolibros de Amazon», en España desde 2020; con Premium, «escucha todo lo que quieras» del
// catálogo incluido, sin límite de horas (∞); y «más de 90.000 títulos» entre audiolibros, pódcasts y producciones propias.
export const G02Que: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('G02', w, n);
  const fApp = at('app');
  const fAud = at('audiolibros');
  const fAmazon = at('amazon');
  const fEspana = at('espana');
  const fDos = at('dos');
  const fPremium = at('premium');
  const fEscuchas = at('escuchas');
  const fCat = at('catalogo');
  const fLimite = at('limite');
  const fMas = at('mas');
  const fNoventa = at('noventa');
  const fAud2 = at('audiolibros', 1);
  const fPod = at('podcasts');
  const fProd = at('producciones');
  const A = usePhase(-10, fPremium - 8);
  const B = usePhase(fPremium - 8, fMas - 6);
  const C = usePhase(fMas - 6, dur + 20);
  const sLogo = useSpring(2);
  const sAmz = useSpring(fAmazon - 4, 13, 180);
  const sCard = useSpring(fEspana - 8, 15, 160);
  const ring = interpolate(frame, [fEspana + 2, fEspana + 26], [0, 1], { ...clamp, easing: easeOut });
  const sPrem = useSpring(fPremium - 2, 13, 190);
  const sEsc = useSpring(fEscuchas - 2, 13, 190);
  const sCat = useSpring(fCat - 2, 13, 190);
  const sNum = useSpring(fNoventa - 8, 13, 150);
  const under = interpolate(frame, [fNoventa + 30, fNoventa + 46], [0, 1], { ...clamp, easing: easeOut });
  const stampP = interpolate(frame, [fProd - 6, fProd + 2], [0, 1], { ...clamp, easing: (t) => t * t * t });
  const sSello = spring({ frame: frame - (fProd - 2), fps, config: { damping: 10, stiffness: 210 } });
  const stampRing = interpolate(frame, [fProd + 2, fProd + 22], [0, 1], { ...clamp, easing: easeOut });
  // Móvil: la portada; con «producciones propias», las novedades con Drácula («audible ORIGINAL»).
  const s0: Shot = { rec: '00_inicio_top', at: 0, start: 4.0, hold: 15 };
  const s1: Shot = { rec: '01_inicio_scroll', at: fAud2 - 10, start: 10.8, hold: 12.4 };
  s1.marks = [markOn(s1, fProd - 2, dur + 20, 8, 236, 330, 440, 22)];
  const cx = 1425;
  const top = Math.round((1080 - PH.H) / 2);
  const cam = buildPhoneCam({ dur, side: -1, cx, top, enter: 'rise', exit: 'none', focus: [{ from: fProd + 2, to: dur, y: 470, s: 1.32 }] });
  const fmt = (s: number, k = 0) => ({ opacity: s, transform: `translateY(${((1 - s) * (24 + k)).toFixed(2)}px) scale(${(0.86 + 0.14 * s).toFixed(4)})` });
  return (
    <AudStage>
      <PhoneHalo cam={cam} cx={cx} />
      <div style={{ position: 'absolute', top, left: cx - PH.W / 2 }}>
        <AppPhone shots={[s0, s1]} w={PHONE_W} cam={cam} dim={0.72} motionBlur float={[0, dur]} />
      </div>
      {A.visible && (
        <div style={{ position: 'absolute', left: 130, top: 0, height: 1080, width: 1040, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...A.style }}>
          <div style={{ opacity: sLogo, transform: `translateY(${((1 - sLogo) * 24).toFixed(2)}px)` }}>
            <AudibleLogo width={520} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 40, minHeight: 92 }}>
            <Chip at={fApp - 3} label="App de audiolibros" icon={<HeadphonesIcon size={36} />} size={44} reserve />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 26px', borderRadius: 999, background: AU_NAVY, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 40,
              opacity: sAmz, transform: `translateY(${((1 - sAmz) * 20).toFixed(2)}px) scale(${(0.86 + 0.14 * sAmz).toFixed(4)})`, transformOrigin: 'left center' }}>
              de <span style={{ color: AU }}>Amazon</span>
            </div>
          </div>
          {/* En España desde 2020 */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 34, width: 820, marginTop: 44, padding: '38px 46px', borderRadius: 40, background: '#fff', border: `1px solid ${color.line}`,
            boxShadow: shadow.card, boxSizing: 'border-box', opacity: sCard, transform: `translateY(${((1 - sCard) * 40).toFixed(2)}px) scale(${(0.94 + 0.06 * sCard).toFixed(4)})`, transformOrigin: 'left center' }}>
            <div style={{ position: 'relative' }}>
              {ring > 0 && ring < 1 && <div style={{ position: 'absolute', inset: -10, borderRadius: 14, border: `${(5 * (1 - ring) + 0.5).toFixed(2)}px solid ${AU}`, opacity: 0.8 * (1 - ring), transform: `scale(${1 + 0.5 * ring})` }} />}
              <FlagES w={130} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 36, color: color.ink2 }}>En España desde</div>
              <div style={{ fontFamily: font.sans, fontWeight: 700, color: color.ink, height: 104 }}>
                {frame >= fDos - 8 && <Odometer text="2020" at={fDos - 8} size={104} dur={28} stagger={2} spins={0} style={{ letterSpacing: -4 }} />}
              </div>
            </div>
          </div>
        </div>
      )}
      {B.visible && (
        <div style={{ position: 'absolute', left: 130, top: 0, height: 1080, width: 1100, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...B.style }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 34, alignSelf: 'flex-start', padding: '12px 28px 12px 14px', borderRadius: 999, background: AU_NAVY, color: '#fff',
            fontFamily: font.sans, fontWeight: 700, fontSize: 38, opacity: sPrem, transform: `translateY(${((1 - sPrem) * 20).toFixed(2)}px) scale(${(0.86 + 0.14 * sPrem).toFixed(4)})`, transformOrigin: 'left center' }}>
            <span style={{ width: 54, height: 54, borderRadius: '50%', background: AU, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><StarIcon size={30} c="#fff" /></span>
            Plan Premium
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, fontFamily: font.sans, fontWeight: 700, fontSize: 96, letterSpacing: -3.5, color: color.ink, lineHeight: 1.05 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 18, ...fmt(sEsc, 20) }}><HeadphonesIcon size={86} c={AU} /> Escucha todo</span>
          </div>
          <div style={{ marginTop: 14, fontFamily: font.sans, fontWeight: 700, fontSize: 52, color: color.ink2, ...fmt(sCat, 10) }}>
            del catálogo incluido
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 34, marginTop: 30 }}>
            <MaskTitle text="sin límite de horas" hi="límite" at={fLimite - 6} size={96} />
          </div>
          <div style={{ marginTop: 32, marginLeft: 6 }}>
            {frame >= fLimite - 2 && <InfinityDraw at={fLimite} w={320} />}
          </div>
        </div>
      )}
      {C.visible && (
        <div style={{ position: 'absolute', left: 130, top: 0, height: 1080, width: 1100, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...C.style }}>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 52, color: color.ink2, opacity: sNum }}>Más de</div>
          <div style={{ position: 'relative', alignSelf: 'flex-start', marginTop: 6, fontFamily: font.sans, fontWeight: 700, color: color.ink, ...fmt(sNum, 30) }}>
            <Odometer text="90.000" at={fNoventa - 6} size={210} dur={40} stagger={3} style={{ letterSpacing: -9 }} />
            <div style={{ position: 'absolute', left: 6, right: 6, bottom: -18, height: 16, borderRadius: 8, background: AU, transform: `scaleX(${under.toFixed(4)})`, transformOrigin: 'left center' }} />
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 52, minHeight: 84 }}>
            <Chip at={fAud2 - 3} label="Audiolibros" icon={<BookIcon size={32} />} size={40} reserve />
            <Chip at={fPod - 3} label="Pódcasts" icon={<MicIcon size={32} />} size={40} reserve />
          </div>
          <div style={{ position: 'relative', marginTop: 30, alignSelf: 'flex-start' }}>
            {stampRing > 0 && stampRing < 1 && (
              <div style={{ position: 'absolute', inset: -10, borderRadius: 999, border: `${(6 * (1 - stampRing) + 1).toFixed(2)}px solid ${AU_NAVY}`, opacity: 0.35 * (1 - stampRing), transform: `scale(${1 + 0.35 * stampRing})` }} />
            )}
            {frame >= fProd - 6 && (
              <div style={{ opacity: Math.min(1, stampP * 2), transform: `scale(${(frame < fProd + 2 ? 1.9 - 0.9 * stampP : 0.94 + 0.06 * sSello).toFixed(4)}) rotate(${(-12 + 9 * Math.min(1, stampP)).toFixed(2)}deg)`, transformOrigin: 'left center',
                filter: `drop-shadow(0 ${(8 + 30 * (1 - stampP)).toFixed(1)}px ${(16 + 30 * (1 - stampP)).toFixed(1)}px rgba(11,26,38,0.25))` }}>
                <OriginalBadge size={62} />
              </div>
            )}
          </div>
        </div>
      )}
      <Sfx name="snap_in" at={fApp} volume={0.7} />
      <Sfx name="ui_pop" at={fAmazon - 2} />
      <Sfx name="whoosh_soft" at={fEspana - 10} volume={0.6} />
      <Sfx name="hit_soft" at={fEspana + 3} volume={0.6} />
      <ChangeTicks value={(f) => odometerShown('2020', fDos - 8, fps, f, 28, 2, 0)} from={fDos - 8} to={fDos + 30} volume={0.4} />
      <Sfx name="whoosh_soft" at={fPremium - 12} />
      <Sfx name="ui_pop" at={fPremium} volume={0.7} />
      <Sfx name="ui_pop" at={fEscuchas} volume={0.55} />
      <Sfx name="ui_pop" at={fCat} volume={0.45} />
      <Sfx name="draw" at={fLimite + 2} volume={0.55} dur={28} fade={8} />
      <Sfx name="whoosh_soft" at={fMas - 10} />
      <ChangeTicks value={(f) => odometerShown('90.000', fNoventa - 6, fps, f, 40, 3)} from={fNoventa - 6} to={fNoventa + 50} volume={0.45} />
      <Sfx name="hit_soft" at={fNoventa + 30} volume={0.6} />
      <Sfx name="ui_pop" at={fAud2 - 2} volume={0.6} />
      <Sfx name="ui_pop" at={fPod - 2} volume={0.6} />
      <Sfx name="stamp" at={fProd + 2} volume={0.8} />
      {zoomPeaks(cam, 2, dur - 2).map((f) => <Sfx key={`z${f}`} name="zoom_in" at={f} volume={0.4} />)}
    </AudStage>
  );
};

// G03 · Planes: Premium (9,99 €, escucha sin límite del catálogo incluido) y Standard (6,99 €, un audiolibro al mes que
// se escucha mientras sigas suscrito). Abajo: sin permanencia; no hay plan anual ni familiar (ayuda de Audible España).
export const G03Planes: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('G03', w, n);
  const fPrem = at('premium');
  const fNueve = at('nueve');
  const fLimite = at('limite');
  const fStd = at('standard');
  const fSeis = at('seis');
  const fElegir = at('elegir');
  const fMientras = at('mientras');
  const fLos = at('los');
  const fPerm = at('permanencia');
  const fAnual = at('anual');
  const fFam = at('familiar');
  const CW = 760;
  const GAP = 60;
  const split = spring({ frame: frame - (fStd - 12), fps, config: { damping: 17, stiffness: 120 } });
  const sP = spring({ frame: frame - fPrem + 6, fps, config: { damping: 14, stiffness: 130 } });
  const sS = spring({ frame: frame - fStd + 6, fps, config: { damping: 14, stiffness: 130 } });
  const actP = interpolate(frame, [fPrem - 6, fPrem + 4, fStd - 8, fStd], [0, 1, 1, 0], clamp);
  const actS = interpolate(frame, [fStd - 6, fStd + 4, fLos - 8, fLos], [0, 1, 1, 0], clamp);
  const sTitle = interpolate(frame, [fPrem - 4, fPrem + 12], [0, 1], { ...clamp, easing: easeInOut });
  const sRow = (f: number) => spring({ frame: frame - f, fps, config: { damping: 14, stiffness: 190 } });
  const sPerm = spring({ frame: frame - fPerm + 2, fps, config: { damping: 14, stiffness: 180 } });
  const sNo = spring({ frame: frame - fAnual + 2, fps, config: { damping: 12, stiffness: 200 } });
  const famIn = interpolate(frame, [fFam - 2, fFam + 8], [0, 1], { ...clamp, easing: easeOut });
  // Standard: el libro del mes cae en su hueco con «elegir» (un hueco por mes; los que no eliges no se acumulan).
  const bookDrop = spring({ frame: frame - (fElegir + 4), fps, config: { damping: 11, stiffness: 190 } });
  const cxP = 960 + (-(CW + GAP) / 2) * split;
  const cxS = 960 + (CW + GAP) / 2;
  const cardBase: React.CSSProperties = { position: 'absolute', top: 236, width: CW, height: 520, borderRadius: 48, boxSizing: 'border-box', padding: '44px 52px', perspective: 2200 };
  const row = (f: number, icon: React.ReactNode, text: React.ReactNode, dark = false) => {
    const s = sRow(f);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: font.sans, fontWeight: 700, fontSize: 35, color: dark ? '#fff' : color.ink, opacity: s, transform: `translateX(${((1 - s) * -24).toFixed(2)}px)` }}>
        <span style={{ width: 60, height: 60, borderRadius: '50%', background: dark ? 'rgba(255,255,255,0.12)' : AU_SOFT, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</span>
        {text}
      </div>
    );
  };
  return (
    <AudStage>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 96, display: 'flex', justifyContent: 'center', opacity: 1 - 0.8 * sTitle, transform: `translateY(${(-50 * sTitle).toFixed(2)}px) scale(${(1 - 0.14 * sTitle).toFixed(4)})`, filter: sTitle > 0.05 ? `blur(${(sTitle * 2.4).toFixed(2)}px)` : undefined }}>
        <MaskTitle text="Dos planes" hi="planes" at={2} size={88} align="center" />
      </div>
      {/* Premium */}
      {frame >= fPrem - 8 && (
        <div style={{ ...cardBase, left: cxP - CW / 2, background: AU_NAVY, color: '#fff',
          boxShadow: `0 0 0 ${(5 * actP).toFixed(2)}px ${color.yellow}, 0 ${(40 + 30 * actP).toFixed(1)}px ${(90 + 30 * actP).toFixed(1)}px rgba(11,26,38,${(0.22 + 0.08 * actP).toFixed(3)})`,
          opacity: Math.min(1, sP * 1.4), transform: `translateY(${((1 - sP) * 110 - 16 * actP).toFixed(2)}px) rotateX(${((1 - sP) * 50).toFixed(2)}deg) scale(${((0.92 + 0.08 * sP) * (1 + 0.025 * actP)).toFixed(4)})`, transformOrigin: '50% 100%' }}>
          <Sheen at={fPrem + 4} radius={48} tint="rgba(247,153,28,0.30)" />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 60, letterSpacing: -1.6 }}>Premium</div>
            <AudibleMark size={92} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 10, fontFamily: font.sans, fontWeight: 700, color: AU }}>
            <span style={{ position: 'relative', display: 'inline-block' }}>
              <Odometer text="9,99" at={fNueve - 8} size={150} color={AU} style={{ letterSpacing: -6 }} />
              {frame < fNueve - 9 && <Shimmer frame={frame} r={26} tint={['#1d2d3a', '#2a3b49']} />}
            </span>
            <span style={{ fontSize: 62, opacity: interpolate(frame, [fNueve + 2, fNueve + 12], [0, 1], clamp) }}>€</span>
            <span style={{ fontSize: 32, fontWeight: 500, color: 'rgba(255,255,255,0.6)', opacity: interpolate(frame, [fNueve + 6, fNueve + 16], [0, 1], clamp) }}>al mes</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 34 }}>
            {row(fLimite - 6, <InfinityIcon size={36} c={AU} />, 'Escucha sin límite de horas', true)}
            {row(fLimite + 6, <BookIcon size={34} c="#fff" />, 'Todo el catálogo incluido', true)}
          </div>
        </div>
      )}
      {/* Standard */}
      {frame >= fStd - 8 && (
        <div style={{ ...cardBase, left: cxS - CW / 2 + (1 - sS) * 140, background: '#fff', border: `1px solid ${color.line}`,
          boxShadow: `0 0 0 ${(5 * actS).toFixed(2)}px ${color.yellow}, 0 ${(40 + 30 * actS).toFixed(1)}px ${(90 + 30 * actS).toFixed(1)}px rgba(16,16,16,${(0.12 + 0.06 * actS).toFixed(3)}), 0 8px 24px rgba(16,16,16,0.06)`,
          opacity: Math.min(1, sS * 1.4), transform: `translateY(${((1 - sS) * 110 - 16 * actS).toFixed(2)}px) rotateX(${((1 - sS) * 50).toFixed(2)}deg) scale(${((0.92 + 0.08 * sS) * (1 + 0.025 * actS)).toFixed(4)})`, transformOrigin: '50% 100%' }}>
          <Sheen at={fStd + 4} radius={48} tint="rgba(247,153,28,0.22)" />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 60, letterSpacing: -1.6, color: color.ink }}>Standard</div>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 26, padding: '9px 18px', borderRadius: 999, background: AU_SOFT, color: AU_DEEP }}>Precio más bajo</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 10, fontFamily: font.sans, fontWeight: 700, color: color.ink }}>
            <span style={{ position: 'relative', display: 'inline-block' }}>
              <Odometer text="6,99" at={fSeis - 8} size={150} style={{ letterSpacing: -6 }} />
              {frame < fSeis - 9 && <Shimmer frame={frame} r={26} />}
            </span>
            <span style={{ fontSize: 62, opacity: interpolate(frame, [fSeis + 2, fSeis + 12], [0, 1], clamp) }}>€</span>
            <span style={{ fontSize: 32, fontWeight: 500, color: color.muted, opacity: interpolate(frame, [fSeis + 6, fSeis + 16], [0, 1], clamp) }}>al mes</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 30, height: 96 }}>
            {[0, 1, 2].map((k) => {
              const cur = k === 0;
              const d = cur ? bookDrop : 0;
              return (
                <div key={k} style={{ position: 'relative', width: 78, height: 96, borderRadius: 14, border: `3px dashed ${cur ? AU : '#E2E2E2'}`, boxSizing: 'border-box', opacity: sRow(fElegir - 6 + k * 3) }}>
                  <div style={{ position: 'absolute', left: -3, top: -3, right: -3, bottom: -3, borderRadius: 14, background: `linear-gradient(160deg, ${AU} 0%, ${AU_HOT} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: d, transform: `translateY(${((1 - d) * -60).toFixed(2)}px) rotate(${((1 - d) * -14).toFixed(2)}deg)` }}>
                    <BookIcon size={40} c="#fff" />
                  </div>
                  <div style={{ position: 'absolute', left: 0, right: 0, bottom: -30, textAlign: 'center', fontFamily: font.sans, fontWeight: 500, fontSize: 20, color: color.muted }}>{['oct', 'nov', 'dic'][k]}</div>
                </div>
              );
            })}
            <div style={{ marginLeft: 12, fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink, opacity: sRow(fElegir + 2) }}>1 audiolibro al mes</div>
          </div>
          <div style={{ marginTop: 40 }}>
            {row(fMientras - 6, <CalendarIcon size={34} c={AU_DEEP} />, 'Lo escuchas mientras sigas suscrito')}
          </div>
        </div>
      )}
      {/* Lo que comparten */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 812, display: 'flex', justifyContent: 'center', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 30px 16px 18px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.float,
          fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink, opacity: sPerm, transform: `translateY(${((1 - sPerm) * 40).toFixed(2)}px) scale(${(0.85 + 0.15 * sPerm).toFixed(4)})` }}>
          <CheckIcon size={44} /> Sin permanencia
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 30px 16px 18px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.float,
          fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink, opacity: sNo, transform: `translateY(${((1 - sNo) * 40).toFixed(2)}px) scale(${(0.85 + 0.15 * sNo).toFixed(4)})` }}>
          <CrossIcon size={44} /> Sin plan anual<span style={{ opacity: famIn, display: 'inline-block', transform: `translateX(${((1 - famIn) * -12).toFixed(2)}px)` }}>&nbsp;ni familiar</span>
        </div>
      </div>
      <Sfx name="card_flip" at={fPrem + 2} />
      <ChangeTicks value={(f) => odometerShown('9,99', fNueve - 8, fps, f)} from={fNueve - 8} to={fNueve + 32} volume={0.5} />
      <Sfx name="ui_pop" at={fLimite - 5} volume={0.6} />
      <Sfx name="ui_pop" at={fLimite + 7} volume={0.5} />
      <Sfx name="swipe" at={fStd - 6} volume={0.5} />
      <Sfx name="card_flip" at={fStd + 2} />
      <ChangeTicks value={(f) => odometerShown('6,99', fSeis - 8, fps, f)} from={fSeis - 8} to={fSeis + 32} volume={0.5} />
      {[0, 1, 2].map((k) => <Sfx key={`s${k}`} name="tick_soft" at={fElegir - 5 + k * 3} volume={0.5} />)}
      <Sfx name="snap_in" at={fElegir + 10} volume={0.7} />
      <Sfx name="ui_pop" at={fMientras - 5} volume={0.6} />
      <Sfx name="ui_pop" at={fPerm} volume={0.7} />
      <Sfx name="cross" at={fAnual + 2} volume={0.6} />
    </AudStage>
  );
};

// G04 · Ojo, no está todo: muchos superventas sí (La sombra del viento, Los huérfanos: «Reproducir»), pero otros van en el
// catálogo extendido (Posteguillo, con la etiqueta en el buscador) y se pagan aparte: Los tres mundos, 15,10 € con el
// descuento de socio (−29 %; 21,57 € sin suscripción).
export const G04Extendido: React.FC<P> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => p.lead + wf('G04', w, n);
  const fOjo = at('ojo');
  const fTodo = at('todo');
  const fSuper = at('superventas');
  const fSombra = at('sombra');
  const fHuerf = at('huerfanos');
  const fAparte = at('aparte');
  const fExt = at('extendido');
  const fTres = at('tres');
  const fQuince = at('quince');
  const fDesc = at('descuento');
  const s0: Shot = { rec: '02_huerfanos_ficha', at: 0, start: 2.2, hold: 4.6 };
  const s1: Shot = { rec: '09_sombra', at: fSombra - 6, start: 16.6, hold: 20 };
  s1.marks = [markOn(s1, fSombra + 2, fHuerf - 6, 22, 996, 620, 72, 36)];
  const s2: Shot = { rec: '02_huerfanos_ficha', at: fHuerf - 6, start: 2.2, hold: 4.6 };
  s2.marks = [markOn(s2, fHuerf + 2, fAparte - 6, 22, 996, 620, 72, 36)];
  const s3: Shot = { rec: '10_posteguillo', at: fAparte - 6, start: 5.0, hold: 15 };
  s3.marks = [markOn(s3, fExt - 4, fTres - 6, 120, 330, 270, 40, 10), markOn(s3, fExt + 8, fTres - 6, 120, 1000, 270, 40, 10)];
  const s4: Shot = { rec: '11_tres_mundos', at: fTres - 6, start: 3.0, hold: 18 };
  s4.marks = [markOn(s4, fTres + 2, fQuince - 4, 230, 756, 204, 40, 12), markOn(s4, fQuince - 2, p.dur + 20, 30, 934, 604, 104, 18)];
  const sCard = spring({ frame: frame - (fQuince - 6), fps, config: { damping: 14, stiffness: 170 } });
  const sDesc = spring({ frame: frame - fDesc, fps, config: { damping: 11, stiffness: 210 } });
  return (
    <AppFeatureScene {...p} id="G04" title="Ojo: no está todo" kicker="Premium" shots={[s0, s1, s2, s3, s4]} titleSize={100} tagSize={40} tagGap={16}
      focusExtra={[{ from: fOjo, to: fSuper - 2, y: 700, s: 1.04 }]}
      tags={[
        { word: 'superventas', label: 'Muchos superventas, sí', icon: <CheckIcon size={34} /> },
        { word: 'sombra', label: 'La sombra del viento', sub: 'Incluido · «Reproducir»', icon: <HeadphonesIcon size={30} /> },
        { word: 'huerfanos', label: 'Los huérfanos', sub: 'Carmen Mola · Incluido', icon: <HeadphonesIcon size={30} /> },
        { word: 'aparte', label: 'Otros se pagan aparte', sub: 'El catálogo extendido', icon: <CardIcon size={30} /> },
      ]}
      extra={
        frame >= fQuince - 8 ? (
          <div style={{ marginTop: 30, display: 'flex', alignItems: 'center', gap: 24, padding: '22px 30px', borderRadius: 30, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card, alignSelf: 'flex-start',
            opacity: sCard, transform: `translateY(${((1 - sCard) * 30).toFixed(2)}px) scale(${(0.9 + 0.1 * sCard).toFixed(4)})`, transformOrigin: 'left center' }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, color: color.ink }}>
              <div style={{ fontSize: 28, color: color.ink2 }}>Los tres mundos · Posteguillo</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
                <Odometer text="15,10" at={fQuince - 6} size={76} color={AU_DEEP} style={{ letterSpacing: -3 }} />
                <span style={{ fontSize: 40, color: AU_DEEP }}>€</span>
                <span style={{ fontSize: 28, fontWeight: 500, color: color.muted, textDecoration: 'line-through', marginLeft: 8 }}>21,57 €</span>
              </div>
            </div>
            <div style={{ padding: '12px 20px', borderRadius: 18, background: color.red, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 38,
              opacity: sDesc, transform: `scale(${(0.5 + 0.5 * sDesc).toFixed(4)}) rotate(${((1 - sDesc) * -10).toFixed(2)}deg)` }}>−29 %</div>
          </div>
        ) : null
      }
      overlay={
        <>
          <Sfx name="hit_soft" at={fTodo} volume={0.55} />
          <ChangeTicks value={(f) => odometerShown('15,10', fQuince - 6, fps, f)} from={fQuince - 6} to={fQuince + 32} volume={0.45} />
          <Sfx name="stamp" at={fDesc + 2} volume={0.5} />
          <Sfx name="coins" at={fQuince + 14} volume={0.4} />
        </>
      } />
  );
};
