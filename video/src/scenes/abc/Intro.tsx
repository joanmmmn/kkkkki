import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { ChangeTicks, Sfx } from '../../components/Sfx';
import { BookIcon, CheckIcon, CrossIcon, HeadphonesIcon } from '../../components/Icons';
import { CalendarIcon, CardIcon, ClockIcon, DocIcon, GlobeIcon, InfinityIcon, LockIcon, PhoneIcon, SearchIcon } from '../../components/Icons2';
import { wf } from './timeline';
import type { SceneProps } from './registry';
import {
  AB, AB_DEEP, AB_HOT, AB_INK, AB_SOFT, AB_TEAL, AB_TEAL_SOFT, AbcDrop, AbcLogo, AbcStage, AppFeatureScene, AppPhone, buildPhoneCam, Chip, CreditCoin, markOn, MaskTitle, Odometer,
  odometerShown, PH, PhoneHalo, PHONE_W, Sheen, Shot, VipBadge, zoomPeaks,
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
// Bandera de EE. UU. simplificada (13 franjas y el cantón azul con puntos).
export const FlagUS: React.FC<{ w?: number }> = ({ w = 64 }) => (
  <svg width={w} height={w * 0.72} viewBox="0 0 36 26" style={{ borderRadius: 6, boxShadow: '0 0 0 1px rgba(0,0,0,0.08)', flexShrink: 0 }}>
    <rect width="36" height="26" fill="#fff" />
    {Array.from({ length: 7 }, (_, i) => <rect key={i} y={i * 4} width="36" height="2" fill="#B22234" />)}
    <rect width="16" height="14" fill="#3C3B6E" />
    {Array.from({ length: 12 }, (_, i) => <circle key={`s${i}`} cx={2.4 + (i % 4) * 3.7} cy={2.6 + Math.floor(i / 4) * 4.2} r="0.9" fill="#fff" />)}
  </svg>
);
// Bandera británica simplificada (para «en inglés»).
export const FlagGB: React.FC<{ w?: number }> = ({ w = 64 }) => (
  <svg width={w} height={w * 0.72} viewBox="0 0 36 26" style={{ borderRadius: 6, boxShadow: '0 0 0 1px rgba(0,0,0,0.08)', flexShrink: 0 }}>
    <rect width="36" height="26" fill="#012169" />
    <path d="M0 0L36 26M36 0L0 26" stroke="#fff" strokeWidth="5" />
    <path d="M0 0L36 26M36 0L0 26" stroke="#C8102E" strokeWidth="2" />
    <path d="M18 0V26M0 13H36" stroke="#fff" strokeWidth="8" />
    <path d="M18 0V26M0 13H36" stroke="#C8102E" strokeWidth="4.5" />
  </svg>
);

// D01 · Gancho: el móvil entra girando con la app real y enseña lo que nombra la voz; a la izquierda, la pregunta.
export const D01Hook: React.FC<P> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('D01', w, n);
  const fEspana = at('espana');
  const fProb = at('probado');
  const fCat = at('catalogo');
  const fCred = at('creditos');
  const fApp = at('app');
  const fLetra = at('letra');
  const fBueno = at('bueno');
  const fMalo = at('malo');
  const fTreinta = at('treinta');
  const sLogo = useSpring(lead - 6);
  const sEs = useSpring(fEspana - 2, 14, 190);
  const sInst = useSpring(fProb - 2, 14, 190);
  // La portada mientras suena la pregunta; luego, lo que se nombra: los resultados en español (Posteguillo), los créditos del
  // perfil, el reproductor, la letra pequeña (desde la app, 17,95 € al mes) y, con «treinta días gratis», el perfil en prueba.
  const s0: Shot = { rec: 'inicio_top', at: 0, start: 1.0, hold: 15 };
  const s1: Shot = { rec: 'post_filtro_es', at: fCat - 6, start: 10.4, hold: 20 };
  s1.marks = [markOn(s1, fCat + 2, fCred - 4, 18, 652, 618, 400, 24)];
  const s2: Shot = { rec: 'perfil_prueba', at: fCred - 6, start: 3.0, hold: 12 };
  s2.marks = [markOn(s2, fCred + 2, fApp - 4, 66, 546, 528, 100, 26)];
  const s3: Shot = { rec: 'elon_reproductor', at: fApp - 5, start: 3.0, hold: 16.4 };
  const s4: Shot = { rec: 'upgrade_1795', at: fLetra - 6, start: 2.0, hold: 14 };
  s4.marks = [markOn(s4, fLetra + 2, fBueno - 4, 16, 908, 632, 106, 30)];
  const s5: Shot = { rec: 'perfil_prueba', at: fTreinta - 8, start: 4.0, hold: 12 };
  s5.marks = [markOn(s5, fTreinta, dur + 20, 30, 540, 604, 190, 26)];
  const shots = [s0, s1, s2, s3, s4, s5];
  const cx = 1425;
  const top = Math.round((1080 - PH.H) / 2);
  const cam = buildPhoneCam({
    dur, side: -1, cx, top, enter: 'spin', exit: 'none',
    focus: [
      // x pequeña: el móvil se aparta hacia la derecha al acercarse (no tapa las etiquetas de la izquierda).
      { from: fCat + 4, to: fCred - 6, x: 120, y: 850, s: 1.15 },
      { from: fCred + 4, to: fApp - 6, x: 120, y: 600, s: 1.36 },
      { from: fLetra + 4, to: fBueno - 8, x: 120, y: 960, s: 1.36 },
      { from: fTreinta + 2, to: dur, x: 120, y: 640, s: 1.34 },
    ],
  });
  return (
    <AbcStage>
      <AbsoluteFill>
        <PhoneHalo cam={cam} cx={cx} />
        <div style={{ position: 'absolute', top, left: cx - PH.W / 2 }}>
          <AppPhone shots={shots} w={PHONE_W} cam={cam} dim={0.72} motionBlur float={[30, dur]} />
        </div>
        <div style={{ position: 'absolute', left: 150, top: 0, height: 1080, width: 1020, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 34 }}>
            <div style={{ opacity: sLogo, transform: `translateY(${((1 - sLogo) * 24).toFixed(2)}px)` }}>
              <AbcLogo width={330} />
            </div>
          </div>
          <MaskTitle text={'¿Merece la pena\nAudiobooks.com?'} hi="Audiobookscom" at={lead - 2} size={112} stagger={4} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 30, minHeight: 72 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 24px 10px 14px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.soft,
              fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: color.ink, opacity: sEs, transform: `translateY(${((1 - sEs) * 20).toFixed(2)}px) scale(${(0.85 + 0.15 * sEs).toFixed(4)})`, transformOrigin: 'left center' }}>
              <FlagES w={46} /> Desde España
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 22px 10px 12px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.soft,
              fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: color.ink, opacity: sInst, transform: `translateX(${((1 - sInst) * -24).toFixed(2)}px) scale(${(0.85 + 0.15 * sInst).toFixed(4)})`, transformOrigin: 'left center' }}>
              <CheckIcon size={38} /> Probado a fondo
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 34, minHeight: 74 }}>
            <Chip at={fCat - 3} dimAt={fCred - 3} label="Catálogo en español" icon={<BookIcon size={26} />} size={30} reserve />
            <Chip at={fCred - 3} dimAt={fApp - 3} label="Créditos" icon={<CardIcon size={26} />} size={30} reserve />
            <Chip at={fApp - 3} dimAt={fLetra - 3} label="La app" icon={<PhoneIcon size={26} />} size={30} reserve />
            <Chip at={fLetra - 3} dimAt={fBueno - 3} label="Letra pequeña" icon={<DocIcon size={26} />} size={30} reserve />
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 22, minHeight: 80 }}>
            <Chip at={fBueno - 3} label="Lo bueno" icon={<CheckIcon size={32} c={color.green} />} accent="#E3F5EA" size={36} reserve />
            <Chip at={fMalo - 3} label="Lo malo" icon={<CrossIcon size={32} />} accent="#FDECEC" size={36} reserve />
            <Chip at={fTreinta - 3} label="30 días gratis · 3 audiolibros" size={36} dark reserve />
          </div>
        </div>
      </AbsoluteFill>
      {/* El móvil entra girando (0 → 34): el barrido grave culmina a mitad de giro. */}
      <Sfx name="whoosh_deep" at={17} />
      <Sfx name="ui_pop" at={fEspana} volume={0.6} />
      <Sfx name="snap_in" at={fProb} volume={0.7} />
      {[fCat, fCred, fApp, fLetra].map((f) => <Sfx key={f} name="ui_pop" at={f - 2} volume={0.7} />)}
      {zoomPeaks(cam, 36, dur - 2).map((f) => <Sfx key={`z${f}`} name="zoom_in" at={f} volume={0.4} />)}
      <Sfx name="ui_pop" at={fBueno - 2} />
      <Sfx name="ui_pop" at={fMalo - 2} />
      <Sfx name="sparkle" at={fTreinta - 2} />
    </AbcStage>
  );
};

// D02 · Qué es: un servicio de audiolibros pensado para EE. UU. que, desde 2022, es de Storytel (la cabecera de su app: «a part
// of storytel»); más de 700.000 títulos, también en español; funciona desde España, pero la web y la app están en inglés.
export const D02Que: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('D02', w, n);
  const fServ = at('servicio');
  const fEstados = at('estados');
  const fDesde = at('desde');
  const fDos = at('dos');
  const fStory = at('storytel');
  const fTiene = at('tiene');
  const fSete = at('setecientos');
  const fTambien = at('tambien');
  const fFunc = at('funciona');
  const fEspana = at('espana');
  const fWeb = at('web');
  const fApp = at('app');
  const fIngles = at('ingles');
  const A = usePhase(-10, fTiene - 8);
  const B = usePhase(fTiene - 8, fFunc - 6);
  const C = usePhase(fFunc - 6, dur + 20);
  const sLogo = useSpring(2);
  const sUS = useSpring(fEstados - 4, 13, 180);
  const sCard = useSpring(fDesde - 8, 15, 160);
  const sStory = useSpring(fStory - 2, 12, 200);
  const sNum = useSpring(fSete - 8, 13, 150);
  const sTiene = useSpring(fTiene - 6, 15, 170);
  const under = interpolate(frame, [fSete + 30, fSete + 46], [0, 1], { ...clamp, easing: easeOut });
  const sEs = useSpring(fTambien - 2, 13, 190);
  const sOk = useSpring(fFunc - 4, 13, 190);
  const sEso = useSpring(fWeb - 4, 13, 190);
  const appIn = interpolate(frame, [fApp - 2, fApp + 8], [0, 1], { ...clamp, easing: easeOut });
  const ring = interpolate(frame, [fEspana + 2, fEspana + 26], [0, 1], { ...clamp, easing: easeOut });
  // Móvil: la portada; con «Storytel», la cabecera de la app («audiobooks.com · a part of storytel») y, con «setecientos mil»,
  // su frase «Sign up to get access to 700,000 audiobooks»; con «también en español», los resultados con el filtro «Spanish».
  const s0: Shot = { rec: 'inicio_top', at: 0, start: 4.0, hold: 15 };
  const s1: Shot = { rec: 'upgrade_1795', at: fStory - 8, start: 2.0, hold: 14 };
  s1.marks = [markOn(s1, fStory, fSete - 4, 226, 104, 212, 74, 18), markOn(s1, fSete - 2, fTambien - 6, 30, 404, 604, 64, 16)];
  const s2: Shot = { rec: 'post_filtro_es', at: fTambien - 6, start: 10.6, hold: 20 };
  s2.marks = [markOn(s2, fTambien + 2, fWeb - 8, 16, 294, 156, 62, 31)];
  const s3: Shot = { rec: 'inicio_top', at: fWeb - 8, start: 2.0, hold: 15 };
  s3.marks = [markOn(s3, fWeb, dur + 20, 22, 664, 600, 152, 26)];
  const cx = 1425;
  const top = Math.round((1080 - PH.H) / 2);
  const cam = buildPhoneCam({
    dur, side: -1, cx, top, enter: 'rise', exit: 'none',
    focus: [
      { from: fStory + 2, to: fSete - 6, y: 300, s: 1.35 },
      { from: fSete, to: fTambien - 8, y: 430, s: 1.35 },
      { from: fTambien + 4, to: fWeb - 10, y: 420, s: 1.3 },
      { from: fWeb + 2, to: dur, y: 740, s: 1.3 },
    ],
  });
  const fmt = (s: number, k = 0) => ({ opacity: s, transform: `translateY(${((1 - s) * (24 + k)).toFixed(2)}px) scale(${(0.86 + 0.14 * s).toFixed(4)})` });
  return (
    <AbcStage>
      <PhoneHalo cam={cam} cx={cx} />
      <div style={{ position: 'absolute', top, left: cx - PH.W / 2 }}>
        <AppPhone shots={[s0, s1, s2, s3]} w={PHONE_W} cam={cam} dim={0.72} motionBlur float={[0, dur]} />
      </div>
      {A.visible && (
        <div style={{ position: 'absolute', left: 130, top: 0, height: 1080, width: 1060, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...A.style }}>
          <div style={{ opacity: sLogo, transform: `translateY(${((1 - sLogo) * 24).toFixed(2)}px)` }}>
            <AbcLogo width={560} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 40, minHeight: 92 }}>
            <Chip at={fServ - 3} label="Servicio de audiolibros" icon={<HeadphonesIcon size={36} />} size={42} reserve />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 18, alignSelf: 'flex-start', padding: '14px 28px 14px 18px', borderRadius: 999, background: AB_INK, color: '#fff',
            fontFamily: font.sans, fontWeight: 700, fontSize: 40, opacity: sUS, transform: `translateY(${((1 - sUS) * 20).toFixed(2)}px) scale(${(0.86 + 0.14 * sUS).toFixed(4)})`, transformOrigin: 'left center' }}>
            <FlagUS w={58} /> Pensado para <span style={{ color: AB_HOT }}>EE. UU.</span>
          </div>
          {/* De Storytel desde 2022 */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 34, width: 860, marginTop: 40, padding: '34px 46px', borderRadius: 40, background: '#fff', border: `1px solid ${color.line}`,
            boxShadow: shadow.card, boxSizing: 'border-box', opacity: sCard, transform: `translateY(${((1 - sCard) * 40).toFixed(2)}px) scale(${(0.94 + 0.06 * sCard).toFixed(4)})`, transformOrigin: 'left center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 36, color: color.ink2 }}>Es de Storytel desde</div>
              <div style={{ fontFamily: font.sans, fontWeight: 700, color: color.ink, height: 104 }}>
                {frame >= fDos - 8 && <Odometer text="2022" at={fDos - 8} size={104} dur={28} stagger={2} spins={0} style={{ letterSpacing: -4 }} />}
              </div>
            </div>
            <div style={{ marginLeft: 'auto', padding: '14px 26px', borderRadius: 22, background: AB_SOFT, color: AB_DEEP, fontFamily: font.sans, fontWeight: 700, fontSize: 40, letterSpacing: -0.5,
              opacity: sStory, transform: `scale(${(0.6 + 0.4 * sStory).toFixed(4)}) rotate(${((1 - sStory) * -8).toFixed(2)}deg)` }}>storytel</div>
          </div>
        </div>
      )}
      {B.visible && (
        <div style={{ position: 'absolute', left: 130, top: 0, height: 1080, width: 1100, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...B.style }}>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 52, color: color.ink2, opacity: sTiene, transform: `translateY(${((1 - sTiene) * 20).toFixed(2)}px)` }}>Tiene más de</div>
          {frame < fSete - 6 && (
            <div style={{ position: 'relative', width: 640, height: 200, marginTop: 6, opacity: sTiene }}><Shimmer frame={frame} r={30} /></div>
          )}
          <div style={{ position: frame < fSete - 6 ? 'absolute' : 'relative', alignSelf: 'flex-start', marginTop: 6, fontFamily: font.sans, fontWeight: 700, color: color.ink, ...fmt(sNum, 30) }}>
            <Odometer text="700.000" at={fSete - 6} size={200} dur={40} stagger={3} style={{ letterSpacing: -9 }} />
            <div style={{ position: 'absolute', left: 6, right: 6, bottom: -18, height: 16, borderRadius: 8, background: AB, transform: `scaleX(${under.toFixed(4)})`, transformOrigin: 'left center' }} />
          </div>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 52, color: color.ink2, marginTop: 30, opacity: sTiene }}>títulos</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 40, alignSelf: 'flex-start', padding: '16px 32px 16px 20px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.float,
            fontFamily: font.sans, fontWeight: 700, fontSize: 42, color: color.ink, opacity: sEs, transform: `translateY(${((1 - sEs) * 24).toFixed(2)}px) scale(${(0.86 + 0.14 * sEs).toFixed(4)})`, transformOrigin: 'left center' }}>
            <FlagES w={58} /> También en español
          </div>
        </div>
      )}
      {C.visible && (
        <div style={{ position: 'absolute', left: 130, top: 0, height: 1080, width: 1100, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...C.style }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 30, alignSelf: 'flex-start', padding: '30px 44px', borderRadius: 40, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card,
            opacity: sOk, transform: `translateY(${((1 - sOk) * 30).toFixed(2)}px) scale(${(0.92 + 0.08 * sOk).toFixed(4)})`, transformOrigin: 'left center' }}>
            <div style={{ position: 'relative' }}>
              {ring > 0 && ring < 1 && <div style={{ position: 'absolute', inset: -10, borderRadius: 14, border: `${(5 * (1 - ring) + 0.5).toFixed(2)}px solid ${color.green}`, opacity: 0.8 * (1 - ring), transform: `scale(${1 + 0.5 * ring})` }} />}
              <FlagES w={120} />
            </div>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 60, letterSpacing: -2, color: color.ink }}>Funciona desde España</div>
            <CheckIcon size={64} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 40, alignSelf: 'flex-start', padding: '20px 38px 20px 24px', borderRadius: 999, background: AB_INK, color: '#fff',
            fontFamily: font.sans, fontWeight: 700, fontSize: 44, opacity: sEso, transform: `translateY(${((1 - sEso) * 30).toFixed(2)}px) scale(${(0.88 + 0.12 * sEso).toFixed(4)})`, transformOrigin: 'left center' }}>
            <FlagGB w={64} />
            <span>Su web <span style={{ opacity: appIn }}>y la app</span>: en <span style={{ color: AB_HOT }}>inglés</span></span>
          </div>
        </div>
      )}
      <Sfx name="snap_in" at={fServ} volume={0.7} />
      <Sfx name="ui_pop" at={fEstados - 2} />
      <Sfx name="whoosh_soft" at={fDesde - 10} volume={0.6} />
      <ChangeTicks value={(f) => odometerShown('2022', fDos - 8, fps, f, 28, 2, 0)} from={fDos - 8} to={fDos + 30} volume={0.4} />
      <Sfx name="stamp" at={fStory + 2} volume={0.6} />
      <Sfx name="whoosh_soft" at={fTiene - 10} />
      <ChangeTicks value={(f) => odometerShown('700.000', fSete - 6, fps, f, 40, 3)} from={fSete - 6} to={fSete + 50} volume={0.45} />
      <Sfx name="hit_soft" at={fSete + 30} volume={0.6} />
      <Sfx name="ui_pop" at={fTambien - 2} volume={0.7} />
      <Sfx name="whoosh_soft" at={fFunc - 10} />
      <Sfx name="success" at={fEspana + 2} volume={0.55} />
      <Sfx name="ui_pop" at={fWeb - 4} volume={0.7} />
      <Sfx name="tick_soft" at={fIngles - 2} volume={0.6} />
      {zoomPeaks(cam, 2, dur - 2).map((f) => <Sfx key={`z${f}`} name="zoom_in" at={f} volume={0.4} />)}
    </AbcStage>
  );
};

// Infinito tachado (no es tarifa plana): el ∞ y una raya roja que lo cruza.
const NoFlat: React.FC<{ at: number; size: number }> = ({ at, size }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 12], [0, 1], { ...clamp, easing: easeOut });
  return (
    <span style={{ position: 'relative', display: 'inline-flex', width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <InfinityIcon size={size * 0.9} c={color.ink2} />
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0 }}>
        <path d="M12 88 L88 12" stroke={color.red} strokeWidth={9} strokeLinecap="round" strokeDasharray={110} strokeDashoffset={110 * (1 - p)} />
      </svg>
    </span>
  );
};

// D03 · Créditos: no es tarifa plana; por 14,95 $ al mes (≈13 €) recibes un crédito (el audiolibro que quieras, tuyo para
// siempre) y un libro de la selección VIP (solo mientras sigas suscrito); los créditos sin usar caducan a los 3 meses.
export const D03Creditos: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('D03', w, n);
  const fTarifa = at('tarifa');
  const fPlana = at('plana');
  const fFunc = at('funciona');
  const fCreditos = at('creditos');
  const fPor = at('por');
  const fCatorce = at('catorce');
  const fTrece = at('trece');
  const fRecibes = at('recibes');
  const fAudiolibro = at('audiolibro');
  const fTuyo = at('tuyo');
  const fMas = at('mas');
  const fSeleccion = at('seleccion');
  const fMientras = at('mientras');
  const fY = at('creditos', 1);
  const fCaducan = at('caducan');
  const fTres = at('tres');
  const CW = 780;
  const GAP = 56;
  // Fase 1 (centrada): «No es tarifa plana» (∞ tachado) y «Funciona con créditos» (la moneda). Sale hacia arriba con el precio.
  const p1 = interpolate(frame, [fPor - 10, fPor + 4], [0, 1], { ...clamp, easing: easeInOut });
  const sNo = useSpring(fTarifa - 6, 15, 170);
  const sFunc = useSpring(fFunc - 2, 13, 190);
  const coin = spring({ frame: frame - (fCreditos - 2), fps, config: { damping: 9, stiffness: 220 } });
  // Fase 2: el precio arriba y las dos tarjetas.
  const sPrice = useSpring(fCatorce - 8, 14, 160);
  const sTrece = useSpring(fTrece - 2, 12, 200);
  const sC = spring({ frame: frame - (fRecibes - 4), fps, config: { damping: 14, stiffness: 130 } });
  const sV = spring({ frame: frame - (fMas - 4), fps, config: { damping: 14, stiffness: 130 } });
  const split = spring({ frame: frame - (fMas - 10), fps, config: { damping: 17, stiffness: 120 } });
  const actC = interpolate(frame, [fRecibes - 4, fRecibes + 6, fMas - 8, fMas], [0, 1, 1, 0], clamp);
  const actV = interpolate(frame, [fMas - 4, fMas + 6, fY - 8, fY], [0, 1, 1, 0], clamp);
  const sRow = (f: number) => spring({ frame: frame - f, fps, config: { damping: 14, stiffness: 190 } });
  const sCad = useSpring(fY - 4, 14, 180);
  const stampP = interpolate(frame, [fTuyo - 4, fTuyo + 4], [0, 1], { ...clamp, easing: (t) => t * t * t });
  const sForever = spring({ frame: frame - (fTuyo + 2), fps, config: { damping: 10, stiffness: 210 } });
  const cxC = 960 + (-(CW + GAP) / 2) * split;
  const cxV = 960 + (CW + GAP) / 2;
  const cardBase: React.CSSProperties = { position: 'absolute', top: 300, width: CW, height: 440, borderRadius: 48, boxSizing: 'border-box', padding: '40px 50px', perspective: 2200 };
  const row = (f: number, icon: React.ReactNode, text: React.ReactNode, tint: string) => {
    const s = sRow(f);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.ink, opacity: s, transform: `translateX(${((1 - s) * -24).toFixed(2)}px)` }}>
        <span style={{ width: 60, height: 60, borderRadius: '50%', background: tint, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</span>
        {text}
      </div>
    );
  };
  return (
    <AbcStage>
      {/* Fase 1 */}
      {p1 < 1 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 46, opacity: 1 - p1, transform: `translateY(${(-120 * p1).toFixed(2)}px) scale(${(1 - 0.1 * p1).toFixed(4)})`,
          filter: p1 > 0.02 ? `blur(${(p1 * 8).toFixed(2)}px)` : undefined }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, opacity: sNo, transform: `translateY(${((1 - sNo) * 30).toFixed(2)}px)` }}>
            <NoFlat at={fPlana - 4} size={120} />
            <MaskTitle text="No es tarifa plana" hi="plana" at={fTarifa - 8} size={104} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, opacity: sFunc, transform: `translateY(${((1 - sFunc) * 30).toFixed(2)}px)` }}>
            <span style={{ display: 'inline-flex', transform: `scale(${(0.3 + 0.7 * coin).toFixed(4)}) rotate(${((1 - coin) * -90).toFixed(2)}deg)` }}><CreditCoin size={110} /></span>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 96, letterSpacing: -3.5, color: color.ink }}>Funciona con <span style={{ color: AB_DEEP }}>créditos</span></div>
          </div>
        </AbsoluteFill>
      )}
      {/* Fase 2: precio */}
      {frame >= fCatorce - 10 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 96, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, opacity: sPrice, transform: `translateY(${((1 - sPrice) * 40).toFixed(2)}px)` }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, fontFamily: font.sans, fontWeight: 700, color: color.ink }}>
            <span style={{ position: 'relative', display: 'inline-block' }}>
              <Odometer text="14,95" at={fCatorce - 6} size={140} style={{ letterSpacing: -6 }} />
              {frame < fCatorce - 7 && <Shimmer frame={frame} r={26} />}
            </span>
            <span style={{ fontSize: 66 }}>$</span>
            <span style={{ fontSize: 36, fontWeight: 500, color: color.muted }}>al mes</span>
          </div>
          <div style={{ marginLeft: 18, padding: '14px 28px', borderRadius: 999, background: AB_SOFT, color: AB_DEEP, fontFamily: font.sans, fontWeight: 700, fontSize: 44,
            opacity: sTrece, transform: `scale(${(0.6 + 0.4 * sTrece).toFixed(4)}) rotate(${((1 - sTrece) * -6).toFixed(2)}deg)` }}>≈ 13 €</div>
        </div>
      )}
      {/* Tarjeta del crédito */}
      {frame >= fRecibes - 8 && (
        <div style={{ ...cardBase, left: cxC - CW / 2, background: '#fff', border: `1px solid ${color.line}`,
          boxShadow: `0 0 0 ${(5 * actC).toFixed(2)}px ${color.yellow}, 0 ${(40 + 30 * actC).toFixed(1)}px ${(90 + 30 * actC).toFixed(1)}px rgba(16,16,16,${(0.12 + 0.06 * actC).toFixed(3)})`,
          opacity: Math.min(1, sC * 1.4), transform: `translateY(${((1 - sC) * 110 - 16 * actC).toFixed(2)}px) rotateX(${((1 - sC) * 50).toFixed(2)}deg) scale(${((0.92 + 0.08 * sC) * (1 + 0.025 * actC)).toFixed(4)})`, transformOrigin: '50% 100%' }}>
          <Sheen at={fRecibes + 4} radius={48} tint="rgba(255,80,28,0.22)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <CreditCoin size={86} />
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 58, letterSpacing: -1.6, color: color.ink }}>1 crédito al mes</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 40 }}>
            {row(fAudiolibro - 6, <BookIcon size={34} c={AB_DEEP} />, 'El audiolibro que quieras', AB_SOFT)}
            {row(fTuyo - 4, <LockIcon size={32} c={AB_DEEP} />, <span>Es tuyo <span style={{ color: AB_DEEP }}>para siempre</span></span>, AB_SOFT)}
          </div>
          {frame >= fTuyo - 4 && (
            <div style={{ position: 'absolute', right: 44, bottom: 60, opacity: Math.min(1, stampP * 2), transform: `scale(${(frame < fTuyo + 4 ? 1.9 - 0.9 * stampP : 0.94 + 0.06 * sForever).toFixed(4)}) rotate(${(-14 + 8 * Math.min(1, stampP)).toFixed(2)}deg)` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 22px', borderRadius: 18, border: `4px solid ${color.green}`, color: color.green, fontFamily: font.sans, fontWeight: 700, fontSize: 30, letterSpacing: 1 }}>
                <InfinityIcon size={36} c={color.green} /> AUNQUE TE DES DE BAJA
              </div>
            </div>
          )}
        </div>
      )}
      {/* Tarjeta VIP */}
      {frame >= fMas - 8 && (
        <div style={{ ...cardBase, left: cxV - CW / 2 + (1 - sV) * 140, background: '#fff', border: `1px solid ${color.line}`,
          boxShadow: `0 0 0 ${(5 * actV).toFixed(2)}px ${color.yellow}, 0 ${(40 + 30 * actV).toFixed(1)}px ${(90 + 30 * actV).toFixed(1)}px rgba(16,16,16,${(0.12 + 0.06 * actV).toFixed(3)})`,
          opacity: Math.min(1, sV * 1.4), transform: `translateY(${((1 - sV) * 110 - 16 * actV).toFixed(2)}px) rotateX(${((1 - sV) * 50).toFixed(2)}deg) scale(${((0.92 + 0.08 * sV) * (1 + 0.025 * actV)).toFixed(4)})`, transformOrigin: '50% 100%' }}>
          <Sheen at={fMas + 4} radius={48} tint="rgba(22,133,142,0.22)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <VipBadge size={80} />
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 58, letterSpacing: -1.6, color: color.ink }}>+1 libro VIP</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 40 }}>
            {row(fSeleccion - 6, <BookIcon size={34} c={AB_TEAL} />, 'De su selección del mes', AB_TEAL_SOFT)}
            {row(fMientras - 6, <ClockIcon size={34} c={AB_TEAL} />, <span>Solo <span style={{ color: AB_TEAL }}>mientras sigas suscrito</span></span>, AB_TEAL_SOFT)}
          </div>
        </div>
      )}
      {/* Los créditos caducan */}
      {frame >= fY - 6 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 812, display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 36px 18px 22px', borderRadius: 999, background: AB_INK, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 40,
            opacity: sCad, transform: `translateY(${((1 - sCad) * 40).toFixed(2)}px) scale(${(0.85 + 0.15 * sCad).toFixed(4)})`, boxShadow: '0 24px 60px rgba(16,16,16,0.28)' }}>
            <CalendarIcon size={44} c={AB_HOT} />
            <span>Los créditos sin usar <span style={{ color: AB_HOT }}>caducan a los</span></span>
            <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 10, color: AB_HOT }}>
              {frame >= fTres - 6 ? <Odometer text="3" at={fTres - 6} size={52} color={AB_HOT} spins={1} /> : <span style={{ fontSize: 52 }}>·</span>} meses
            </span>
          </div>
        </div>
      )}
      <Sfx name="ui_pop" at={fTarifa - 4} volume={0.6} />
      <Sfx name="cross" at={fPlana - 2} volume={0.6} />
      <Sfx name="ui_pop" at={fFunc} volume={0.6} />
      <Sfx name="coins" at={fCreditos} volume={0.45} />
      <Sfx name="whoosh_soft" at={fPor - 10} volume={0.6} />
      <ChangeTicks value={(f) => odometerShown('14,95', fCatorce - 6, fps, f)} from={fCatorce - 6} to={fCatorce + 32} volume={0.5} />
      <Sfx name="ui_pop" at={fTrece} volume={0.6} />
      <Sfx name="card_flip" at={fRecibes - 2} />
      <Sfx name="ui_pop" at={fAudiolibro - 5} volume={0.6} />
      <Sfx name="stamp" at={fTuyo + 4} volume={0.7} />
      <Sfx name="swipe" at={fMas - 8} volume={0.5} />
      <Sfx name="card_flip" at={fMas} />
      <Sfx name="ui_pop" at={fSeleccion - 5} volume={0.5} />
      <Sfx name="ui_pop" at={fMientras - 5} volume={0.6} />
      <Sfx name="ui_pop" at={fY - 2} volume={0.7} />
      <ChangeTicks value={(f) => odometerShown('3', fTres - 6, fps, f, 30, 3, 1)} from={fTres - 6} to={fTres + 30} volume={0.45} />
      <Sfx name="hit_soft" at={fCaducan + 2} volume={0.45} />
    </AbcStage>
  );
};

// D04 · ¿Y en español? Hay más de lo que parece: Posteguillo (Roma soy yo, Maldita Roma…), Juan Gómez-Jurado (Reina roja) o
// Javier Castillo. Los tres mundos, que en Audible va en el catálogo extendido (15,10 € con descuento de socio), aquí entra con
// un crédito («Use Credit»). Pero de La sombra del viento solo aparece un resumen (ResumenExpress).
export const D04Espanol: React.FC<P> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => p.lead + wf('D04', w, n);
  const fHay = at('hay');
  const fPost = at('posteguillo');
  const fJuan = at('juan');
  const fTres = at('tres');
  const fAudible = at('audible');
  const fAqui = at('aqui');
  const fCredito = at('credito');
  const fPero = at('pero');
  const fSombra = at('sombra');
  const fResumen = at('resumen');
  const s0: Shot = { rec: 'post_filtro_es', at: 0, start: 10.4, hold: 22 };
  s0.marks = [markOn(s0, fPost - 2, fJuan - 6, 18, 652, 618, 400, 24)];
  const s1: Shot = { rec: 'reina_roja_es', at: fJuan - 6, start: 2.0, hold: 12 };
  s1.marks = [markOn(s1, fJuan + 2, fTres - 8, 18, 650, 306, 394, 24)];
  const s2: Shot = { rec: 'tres_mundos_ficha', at: fTres - 6, start: 2.0, hold: 12 };
  s2.marks = [markOn(s2, fTres + 2, fAqui - 6, 22, 768, 620, 236, 24)];
  // Ficha desplazada: «Play Sample», «Use Credit» y los detalles (32 h 48 min).
  const s3: Shot = { rec: 'tres_mundos_ficha', at: fAqui - 6, start: 15.0, hold: 25 };
  s3.marks = [markOn(s3, fAqui, fPero - 6, 16, 778, 310, 76, 38)];
  const s4: Shot = { rec: 'sombra_es', at: fSombra - 6, start: 27.0, hold: 39 };
  s4.marks = [markOn(s4, fSombra + 2, p.dur + 20, 18, 530, 306, 394, 24)];
  const sCard = useSpring(fAudible - 6, 14, 170);
  const sCred = spring({ frame: frame - fCredito, fps, config: { damping: 11, stiffness: 210 } });
  const strike = interpolate(frame, [fAqui - 4, fAqui + 6], [0, 1], { ...clamp, easing: easeOut });
  const cardOut = interpolate(frame, [fPero - 8, fPero + 4], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <AppFeatureScene {...p} id="D04" title="¿Y en español?" hi="español" kicker="Catálogo" shots={[s0, s1, s2, s3, s4]} titleSize={100} tagSize={40} tagGap={14}
      focusExtra={[{ from: 0, to: fPost - 4, y: 760, s: 1.05 }]}
      tags={[
        { word: 'posteguillo', label: 'Santiago Posteguillo', sub: 'Roma soy yo · Maldita Roma · Los tres mundos', icon: <BookIcon size={30} /> },
        { word: 'juan', label: 'Juan Gómez-Jurado', sub: 'Reina roja', icon: <BookIcon size={30} /> },
        { word: 'javier', label: 'Javier Castillo', sub: 'La chica de nieve', icon: <BookIcon size={30} /> },
        { word: 'sombra', label: 'La sombra del viento', sub: 'Solo un resumen', icon: <CrossIcon size={30} /> },
      ]}
      extra={
        frame >= fAudible - 8 && cardOut < 1 ? (
          <div style={{ marginTop: 30, display: 'flex', alignItems: 'center', gap: 22, padding: '20px 28px', borderRadius: 30, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card, alignSelf: 'flex-start',
            opacity: sCard * (1 - cardOut), transform: `translateY(${((1 - sCard) * 30 + cardOut * 20).toFixed(2)}px) scale(${(0.9 + 0.1 * sCard).toFixed(4)})`, transformOrigin: 'left center' }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, color: color.ink }}>
              <div style={{ fontSize: 28, color: color.ink2 }}>Los tres mundos · 32 h 48 min</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 10 }}>
                <span style={{ position: 'relative', fontSize: 32, color: color.muted, fontWeight: 500 }}>
                  En Audible: aparte (15,10 €)
                  <span style={{ position: 'absolute', left: -4, right: -4, top: '52%', height: 4, borderRadius: 2, background: color.red, transform: `scaleX(${strike.toFixed(4)})`, transformOrigin: 'left center' }} />
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 18px 8px 10px', borderRadius: 999, background: AB_SOFT, color: AB_DEEP, fontSize: 34,
                  opacity: sCred, transform: `scale(${(0.5 + 0.5 * sCred).toFixed(4)}) rotate(${((1 - sCred) * -10).toFixed(2)}deg)` }}>
                  <CreditCoin size={44} /> Aquí: 1 crédito
                </span>
              </div>
            </div>
          </div>
        ) : null
      }
      overlay={
        <>
          <Sfx name="hit_soft" at={fHay} volume={0.4} />
          <Sfx name="ui_pop" at={fAudible - 4} volume={0.6} />
          <Sfx name="cross" at={fAqui} volume={0.45} />
          <Sfx name="stamp" at={fCredito + 2} volume={0.5} />
          <Sfx name="coins" at={fCredito + 10} volume={0.35} />
          <Sfx name="hit_soft" at={fResumen} volume={0.4} />
        </>
      } />
  );
};

export { AB, AB_TEAL, AbcDrop, AppPhone, GlobeIcon, SearchIcon };
