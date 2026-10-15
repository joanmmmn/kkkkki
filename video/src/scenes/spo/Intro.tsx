import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { ChangeTicks, Sfx } from '../../components/Sfx';
import { BookIcon, CheckIcon, CrossIcon, HeadphonesIcon, MusicIcon } from '../../components/Icons';
import { BookmarkIcon, CalendarIcon, CardIcon, ClockIcon, DocIcon, GlobeIcon, InfinityIcon, LockIcon, PhoneIcon, SpeedIcon, SyncIcon, UserIcon } from '../../components/Icons2';
import { FlagES } from '../bkb/Intro';
import { wf } from './timeline';
import type { SceneProps } from './registry';
import {
  AppPhone, buildPhoneCam, Chip, HourBlocks, HoursMeter, markOn, MaskTitle, Odometer, odometerShown, PH, PhoneHalo, PHONE_W, Sheen, Shot, SP, SP_CARD, SP_DEEP,
  SP_INK, SP_LILAC, SP_LILAC_SOFT, SP_MINT, SP_MINT_SOFT, SP_PEACH, SP_PEACH_SOFT, SP_SOFT, SpoStage, SpotifyIcon, SpotifyLogo, Tap, zoomPeaks,
} from './kit';

type P = SceneProps;
const useSpring = (at: number, damping = 16, stiffness = 160) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, stiffness } });
};

// Fase en carrusel: entra desde la derecha y sale hacia la izquierda.
export const usePhase = (from: number, to: number) => {
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
const Shimmer: React.FC<{ frame: number; r?: number; dark?: boolean }> = ({ frame, r = 24, dark = false }) => (
  <span style={{ position: 'absolute', left: 0, right: 6, top: '16%', bottom: '8%', borderRadius: r,
    background: dark ? 'linear-gradient(100deg, #3a3a3a 35%, #4a4a4a 50%, #3a3a3a 65%)' : 'linear-gradient(100deg, #EDEDED 35%, #F9F9F9 50%, #EDEDED 65%)',
    backgroundSize: '300% 100%', backgroundPosition: `${100 - ((frame * 2.4) % 100)}% 0` }} />
);

// Píldora oscura (fondo de la app) con texto blanco.
export const DarkPill: React.FC<{ s: number; children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({ s, children, size = 34, style }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.4, alignSelf: 'flex-start', padding: `${size * 0.36}px ${size * 0.86}px ${size * 0.36}px ${size * 0.5}px`, borderRadius: 999, background: SP_INK, color: '#fff',
    fontFamily: font.sans, fontWeight: 700, fontSize: size, whiteSpace: 'nowrap', boxShadow: shadow.float, opacity: s, transform: `translateY(${((1 - s) * 24).toFixed(2)}px) scale(${(0.86 + 0.14 * s).toFixed(4)})`, transformOrigin: 'left center', ...style }}>
    {children}
  </div>
);
// Píldora clara (blanca), roja (aviso) o verde (bueno).
export const Pill: React.FC<{ s: number; tone?: 'white' | 'red' | 'green'; children: React.ReactNode; size?: number; style?: React.CSSProperties; shake?: number }> = ({ s, tone = 'white', children, size = 36, style, shake = 0 }) => {
  const bg = tone === 'red' ? '#FDECEC' : tone === 'green' ? '#E6F8EC' : '#fff';
  const border = tone === 'red' ? '2px solid rgba(229,72,77,0.3)' : tone === 'green' ? '2px solid rgba(31,157,85,0.3)' : `1px solid ${color.line}`;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.4, alignSelf: 'flex-start', padding: `${size * 0.38}px ${size * 0.84}px ${size * 0.38}px ${size * 0.5}px`, borderRadius: 999, background: bg, border,
      boxShadow: shadow.soft, fontFamily: font.sans, fontWeight: 700, fontSize: size, color: color.ink, whiteSpace: 'nowrap',
      opacity: s, transform: `translateX(${shake.toFixed(2)}px) translateY(${((1 - s) * 24).toFixed(2)}px) scale(${(0.9 + 0.1 * s).toFixed(4)})`, transformOrigin: 'left center', ...style }}>
      {children}
    </div>
  );
};

// U01 · Gancho: el móvil entra girando con la app real y enseña lo que nombra la voz; a la izquierda, la pregunta.
export const U01Hook: React.FC<P> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('U01', w, n);
  const fIncl = at('incluidos');
  const fCat = at('catalogo');
  const fApp = at('app');
  const fHoras = at('horas');
  const fLetra = at('letra');
  const fBueno = at('bueno');
  const fMalo = at('malo');
  const fGratis = at('gratis');
  const fProbar = at('probarlos');
  const sLogo = useSpring(lead - 6);
  const sIncl = useSpring(fIncl - 2, 14, 190);
  // La sección Audiolibros mientras suena la primera frase; con «incluidos», Reina Roja con la etiqueta «Incluido con Premium»;
  // con «catálogo», los géneros; con «app», el reproductor; con «horas», el tiempo de escucha (0 h de 12) y, al final, la ficha
  // de Reina Roja con «Prueba el libro» (la muestra gratis).
  const s0: Shot = { rec: '01_hub', at: 0, start: 0.6, hold: 3.4 };
  const s1: Shot = { rec: '02_reina_filtro', at: fIncl - 6, start: 1.6, hold: 15.5 };
  s1.marks = [markOn(s1, fIncl + 2, fCat - 6, 8, 200, 648, 112, 18)];
  const s2: Shot = { rec: '01_hub', at: fCat - 5, start: 5.0, hold: 17.5 };
  const s3: Shot = { rec: '05_reproductor', at: fApp - 5, start: 12.0, hold: 17.5 };
  const s4: Shot = { rec: '10_horas', at: fHoras - 5, start: 1.0, hold: 14.0 };
  s4.marks = [markOn(s4, fHoras + 2, fBueno - 8, 20, 312, 624, 150, 18)];
  const s5: Shot = { rec: '03_reina_ficha', at: fBueno - 6, start: 1.0, hold: 17.5 };
  s5.marks = [markOn(s5, fProbar - 2, dur + 20, 16, 980, 632, 168, 22)];
  const shots = [s0, s1, s2, s3, s4, s5];
  const cx = 1425;
  const top = Math.round((1080 - PH.H) / 2);
  const cam = buildPhoneCam({
    dur, side: -1, cx, top, enter: 'spin', exit: 'none',
    focus: [
      { from: fIncl + 4, to: fCat - 6, y: 256, s: 1.3 },
      { from: fHoras + 4, to: fBueno - 8, y: 387, s: 1.42 },
      { from: fProbar, to: dur, y: 1064, s: 1.22 },
    ],
  });
  return (
    <SpoStage>
      <AbsoluteFill>
        <PhoneHalo cam={cam} cx={cx} />
        <div style={{ position: 'absolute', top, left: cx - PH.W / 2 }}>
          <AppPhone shots={shots} w={PHONE_W} cam={cam} dim={0.72} motionBlur float={[30, dur]} />
        </div>
        <div style={{ position: 'absolute', left: 150, top: 0, height: 1080, width: 1020, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginBottom: 38, minHeight: 92 }}>
            <div style={{ opacity: sLogo, transform: `translateY(${((1 - sLogo) * 24).toFixed(2)}px)` }}>
              <SpotifyLogo width={330} />
            </div>
            <DarkPill s={sIncl} size={32}><CheckIcon size={38} c={SP} fg={SP_INK} /> Incluidos en Premium</DarkPill>
          </div>
          <MaskTitle text={'¿Merecen la pena\nsus audiolibros?'} hi="audiolibros?" at={lead - 2} size={112} stagger={4} />
          <div style={{ display: 'flex', gap: 14, marginTop: 50, minHeight: 74 }}>
            <Chip at={fCat - 3} dimAt={fApp - 3} label="Catálogo" icon={<BookIcon size={26} />} size={30} accent={SP_SOFT} reserve />
            <Chip at={fApp - 3} dimAt={fHoras - 3} label="La app" icon={<PhoneIcon size={26} />} size={30} accent={SP_SOFT} reserve />
            <Chip at={fHoras - 3} dimAt={fLetra - 3} label="Las horas" icon={<ClockIcon size={26} />} size={30} accent={SP_SOFT} reserve />
            <Chip at={fLetra - 3} dimAt={fBueno - 3} label="Letra pequeña" icon={<DocIcon size={26} />} size={30} accent={SP_SOFT} reserve />
          </div>
          <div style={{ display: 'flex', gap: 18, marginTop: 24, minHeight: 86 }}>
            <Chip at={fBueno - 3} label="Lo bueno" icon={<CheckIcon size={36} c={color.green} />} accent="#E3F5EA" size={42} reserve />
            <Chip at={fMalo - 3} label="Lo malo" icon={<CrossIcon size={36} />} accent="#FDECEC" size={42} reserve />
            <Chip at={fProbar - 3} label="Pruébalos gratis" size={42} dark reserve />
          </div>
        </div>
      </AbsoluteFill>
      {/* El móvil entra girando (0 → 34): el barrido grave culmina a mitad de giro. */}
      <Sfx name="whoosh_deep" at={17} />
      <Sfx name="snap_in" at={fIncl} volume={0.7} />
      {[fCat, fApp, fHoras, fLetra].map((f) => <Sfx key={f} name="ui_pop" at={f - 2} volume={0.7} />)}
      {zoomPeaks(cam, 36, dur - 2).map((f) => <Sfx key={`z${f}`} name="zoom_in" at={f} volume={0.4} />)}
      <Sfx name="ui_pop" at={fBueno - 2} />
      <Sfx name="ui_pop" at={fMalo - 2} />
      <Sfx name="sparkle" at={fGratis - 4} />
    </SpoStage>
  );
};

// Hoja de calendario («7 OCT»): la banda roja de arriba y el día en grande.
const CalendarPage: React.FC<{ day: string; month: string; size?: number; s: number }> = ({ day, month, size = 150, s }) => (
  <div style={{ width: size, height: size * 1.06, borderRadius: size * 0.16, background: '#fff', boxShadow: '0 18px 40px rgba(16,16,16,0.14)', overflow: 'hidden', flexShrink: 0,
    transform: `rotate(${((1 - s) * -14).toFixed(2)}deg) scale(${(0.7 + 0.3 * s).toFixed(4)})`, opacity: Math.min(1, s * 1.4) }}>
    <div style={{ height: size * 0.3, background: '#E5484D', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: size * 0.17, letterSpacing: size * 0.02 }}>{month}</div>
    <div style={{ height: size * 0.76, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: size * 0.56, color: color.ink, letterSpacing: -size * 0.02 }}>{day}</div>
  </div>
);

// U02 · Cómo funcionan (anuncio de Spotify del 7/10/2026 y spotify.com/es/audiobooks, 15/10/2026): con Premium, 12 horas de
// audiolibros al mes sin pagar más, en la misma app; más de 350.000 títulos, más de 45.000 en español (Planeta, Penguin Random
// House…). En el móvil: la sección Audiolibros; con «misma app», Buscar (Música, Pódcasts, Audiolibros) y el toque en Audiolibros.
export const U02Funcionan: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('U02', w, n);
  const fDesde = at('desde');
  const fSiete = at('siete');
  const fPagas = at('pagas');
  const fDoce = at('doce');
  const fHoras = at('horas');
  const fMes = at('mes');
  const fSin = at('sin');
  const fMisma = at('misma');
  const fMusica = at('musica');
  const fCat = at('catalogo');
  const fEnorme = at('enorme');
  const fTres = at('trescientos');
  const fTitulos = at('titulos');
  const fCuarenta = at('cuarenta');
  const fEsp = at('espanol');
  const fSellos = at('sellos');
  const fPlaneta = at('planeta');
  const fPenguin = at('penguin');
  const A = usePhase(-10, fCat - 8);
  const B = usePhase(fCat - 8, dur + 20);
  const sCard = useSpring(fDesde - 8, 15, 160);
  const sCal = useSpring(fSiete - 6, 12, 170);
  const sPrem = useSpring(fPagas - 4, 14, 180);
  const fill = interpolate(frame, [fDoce - 4, fHoras + 26], [0, 12], { ...clamp, easing: easeInOut });
  const sBlocks = useSpring(fDoce - 8, 15, 160);
  const sZero = useSpring(fSin - 2, 12, 200);
  const sNum = useSpring(fTres - 10, 13, 150);
  const sEsp = useSpring(fCuarenta - 8, 14, 160);
  const under = interpolate(frame, [fTitulos + 2, fTitulos + 18], [0, 1], { ...clamp, easing: easeOut });
  // Móvil: la sección Audiolibros; con «misma app», Buscar con sus cuatro tarjetas y el toque en Audiolibros (a los 7,8 s de la
  // toma) justo después de «música»; con «catálogo», los géneros y, con «sellos», las listas de los editores.
  const tapF = fMusica + 6;
  const s0: Shot = { rec: '01_hub', at: 0, start: 0.6, hold: 3.4 };
  const s1: Shot = { rec: '00_buscar', at: tapF - 58, start: 7.8 - 58 / 50, hold: 8.2 };
  s1.marks = [markOn(s1, fMisma - 2, tapF + 2, 22, 416, 300, 120, 22)];
  const s2: Shot = { rec: '01_hub', at: tapF + 22, start: 0.1, hold: 3.4 };
  const s3: Shot = { rec: '01_hub', at: fCat - 4, start: 4.6, hold: 17.5 };
  const s4: Shot = { rec: '01_hub', at: fSellos - 6, start: 43.5, hold: 55.5 };
  const taps: Tap[] = [{ f: tapF, x: 171, y: 476 }];
  const cx = 1425;
  const top = Math.round((1080 - PH.H) / 2);
  const cam = buildPhoneCam({ dur, side: -1, cx, top, enter: 'rise', exit: 'none', focus: [{ from: fMisma, to: tapF + 4, y: 420, x: 332, s: 1.3 }] });
  const fmt = (s: number, k = 0) => ({ opacity: s, transform: `translateY(${((1 - s) * (24 + k)).toFixed(2)}px) scale(${(0.86 + 0.14 * s).toFixed(4)})` });
  return (
    <SpoStage>
      <PhoneHalo cam={cam} cx={cx} />
      <div style={{ position: 'absolute', top, left: cx - PH.W / 2 }}>
        <AppPhone shots={[s0, s1, s2, s3, s4]} w={PHONE_W} cam={cam} taps={taps} dim={0.72} motionBlur float={[0, dur]} />
      </div>
      {A.visible && (
        <div style={{ position: 'absolute', left: 130, top: 0, height: 1080, width: 1060, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...A.style }}>
          {/* Desde el 7 de octubre */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 34, alignSelf: 'flex-start', padding: '26px 44px 26px 30px', borderRadius: 36, background: '#fff', border: `1px solid ${color.line}`,
            boxShadow: shadow.card, opacity: sCard, transform: `translateY(${((1 - sCard) * 40).toFixed(2)}px) scale(${(0.94 + 0.06 * sCard).toFixed(4)})`, transformOrigin: 'left center' }}>
            <CalendarPage day="7" month="OCT" size={118} s={sCal} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: font.sans, fontWeight: 500, fontSize: 34, color: color.ink2 }}><FlagES w={46} /> En España, desde el</div>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 64, color: color.ink, letterSpacing: -2 }}>7 de octubre</div>
            </div>
          </div>
          {/* Con Premium: 12 horas al mes */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 44, ...fmt(sPrem) }}>
            <SpotifyIcon size={70} />
            <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 14, fontFamily: font.sans, fontWeight: 700, fontSize: 50, color: color.ink, letterSpacing: -1.4 }}>
              Con Premium:
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <Odometer text="12" at={fDoce - 6} size={64} dur={26} color={SP_DEEP} style={{ letterSpacing: -2 }} />
                {frame < fDoce - 7 && <Shimmer frame={frame} r={12} />}
              </span>
              <span style={{ opacity: interpolate(frame, [fHoras - 4, fHoras + 8], [0.2, 1], clamp) }}>horas al mes</span>
            </span>
          </div>
          <div style={{ marginTop: 26, ...fmt(sBlocks) }}>
            <HourBlocks on={fill} w={900} h={70} gap={9} />
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 34, minHeight: 84 }}>
            <Pill s={sZero} tone="green" size={38}><CheckIcon size={44} /> Sin pagar más</Pill>
            <Chip at={fMisma - 3} label="En la app de tu música" icon={<MusicIcon size={32} />} size={38} accent={SP_SOFT} reserve />
          </div>
        </div>
      )}
      {B.visible && (
        <div style={{ position: 'absolute', left: 130, top: 0, height: 1080, width: 1100, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...B.style }}>
          <MaskTitle text="Un catálogo enorme" hi="enorme" at={fCat - 6} size={80} />
          <div style={{ marginTop: 34, fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: color.ink2, opacity: sNum }}>Más de</div>
          <div style={{ position: 'relative', alignSelf: 'flex-start', marginTop: 4, fontFamily: font.sans, fontWeight: 700, color: color.ink, ...fmt(sNum, 30) }}>
            <Odometer text="350.000" at={fTres - 6} size={170} dur={40} stagger={3} style={{ letterSpacing: -7 }} />
            <div style={{ position: 'absolute', left: 6, right: 6, bottom: -14, height: 14, borderRadius: 7, background: SP, transform: `scaleX(${under.toFixed(4)})`, transformOrigin: 'left center' }} />
          </div>
          <div style={{ marginTop: 26, fontFamily: font.sans, fontWeight: 700, fontSize: 50, color: color.ink, opacity: interpolate(frame, [fTitulos - 4, fTitulos + 8], [0, 1], clamp) }}>títulos</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 30, fontFamily: font.sans, fontWeight: 700, color: color.ink, ...fmt(sEsp) }}>
            <FlagES w={84} />
            <span style={{ fontSize: 44, color: color.ink2 }}>Más de</span>
            <Odometer text="45.000" at={fCuarenta - 6} size={96} dur={34} stagger={3} color={SP_DEEP} style={{ letterSpacing: -4 }} />
            <span style={{ fontSize: 44, opacity: interpolate(frame, [fEsp - 4, fEsp + 8], [0, 1], clamp) }}>en español</span>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 34, minHeight: 80 }}>
            <Chip at={fPlaneta - 3} label="Planeta" icon={<BookIcon size={30} />} size={36} accent={SP_SOFT} reserve />
            <Chip at={fPenguin - 3} label="Penguin Random House" icon={<BookIcon size={30} />} size={36} accent={SP_SOFT} reserve />
          </div>
        </div>
      )}
      <Sfx name="whoosh_soft" at={fDesde - 10} volume={0.6} />
      <Sfx name="card_flip" at={fSiete - 2} volume={0.7} />
      <Sfx name="ui_pop" at={fPagas - 2} volume={0.6} />
      <ChangeTicks value={(f) => String(Math.round(interpolate(f, [fDoce - 4, fHoras + 26], [0, 12], { ...clamp, easing: easeInOut })))} from={fDoce - 4} to={fHoras + 28} volume={0.4} />
      <Sfx name="hit_soft" at={fMes} volume={0.5} />
      <Sfx name="success" at={fSin} volume={0.5} />
      <Sfx name="ui_tap" at={tapF} volume={0.55} />
      <Sfx name="whoosh_soft" at={fCat - 10} />
      <ChangeTicks value={(f) => odometerShown('350.000', fTres - 6, fps, f, 40, 3)} from={fTres - 6} to={fTres + 44} volume={0.45} />
      <Sfx name="hit_soft" at={fTitulos + 2} volume={0.6} />
      <ChangeTicks value={(f) => odometerShown('45.000', fCuarenta - 6, fps, f, 34, 3)} from={fCuarenta - 6} to={fCuarenta + 38} volume={0.4} />
      <Sfx name="ui_pop" at={fPlaneta - 2} volume={0.6} />
      <Sfx name="ui_pop" at={fPenguin - 2} volume={0.6} />
      {zoomPeaks(cam, 2, dur - 2).map((f) => <Sfx key={`z${f}`} name="zoom_in" at={f} volume={0.4} />)}
      {/* «enorme»: el título queda; el sonido del cambio de fase lo lleva el barrido. */}
      <Sfx name="ui_pop" at={fEnorme - 2} volume={0.4} />
    </SpoStage>
  );
};

// Fila de miembros de un plan: el primero (quien administra) con su depósito de horas; los demás, en gris, sin horas (desde
// `onlyAt`, solo quien administra conserva el verde). `none`: nadie tiene horas (Estudiantes).
const Members: React.FC<{ n: number; tint: string; onlyAt?: number; none?: boolean; at: number; size?: number }> = ({ n, tint, onlyAt, none = false, at, size = 56 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const only = onlyAt !== undefined ? interpolate(frame, [onlyAt - 4, onlyAt + 10], [0, 1], { ...clamp, easing: easeInOut }) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {Array.from({ length: n }, (_, k) => {
        const sk = spring({ frame: frame - (at + k * 3), fps, config: { damping: 12, stiffness: 220 } });
        const lit = none ? 0 : k === 0 ? 1 : 1 - only;
        const sz = n > 3 ? size * 0.82 : size;
        return (
          <span key={k} style={{ width: sz, height: sz, borderRadius: '50%', marginLeft: k ? -sz * 0.22 : 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: lit > 0.5 ? tint : '#4A4A4A', border: `3px solid ${SP_CARD}`, transform: `scale(${sk.toFixed(4)})`, boxShadow: k === 0 && only > 0.5 && !none ? `0 0 0 ${(4 * only).toFixed(2)}px ${SP}` : undefined }}>
            <UserIcon size={sz * 0.56} c={lit > 0.5 ? SP_INK : '#9A9A9A'} />
          </span>
        );
      })}
    </div>
  );
};

// Tarjeta de un plan, oscura como las de spotify.com/es/premium, con el nombre en el color del plan: precio y quién tiene horas.
const PlanCard: React.FC<{
  name: string; price: string; tint: string; fIn: number; fPrice: number; act: number; w: number; members: number; mode: 'all' | 'admin' | 'none'; fMode: number;
}> = ({ name, price, tint, fIn, fPrice, act, w, members, mode, fMode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - fIn, fps, config: { damping: 14, stiffness: 130 } });
  const sMode = spring({ frame: frame - fMode, fps, config: { damping: 13, stiffness: 190 } });
  if (frame < fIn - 2) return <div style={{ width: w, height: 540 }} />;
  const label = mode === 'all' ? '12 h de audiolibros' : mode === 'admin' ? '12 h, solo quien administra' : 'Sin horas de audiolibros';
  return (
    <div style={{ position: 'relative', width: w, height: 540, borderRadius: 36, background: SP_CARD, overflow: 'hidden', boxSizing: 'border-box', padding: '34px 34px 0',
      boxShadow: `0 0 0 ${(5 * act).toFixed(2)}px ${tint}, 0 ${(40 + 30 * act).toFixed(1)}px ${(90 + 30 * act).toFixed(1)}px rgba(16,16,16,${(0.22 + 0.08 * act).toFixed(3)})`,
      opacity: Math.min(1, s * 1.4), transform: `translateY(${((1 - s) * 110 - 14 * act).toFixed(2)}px) rotateX(${((1 - s) * 50).toFixed(2)}deg) scale(${((0.92 + 0.08 * s) * (1 + 0.025 * act)).toFixed(4)})`, transformOrigin: '50% 100%' }}>
      <Sheen at={fIn + 6} radius={36} tint="rgba(255,255,255,0.14)" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: font.sans, fontWeight: 500, fontSize: 26, color: '#fff' }}>
        <Img src={staticFile('spo/img/spotify_icon_white.svg')} style={{ width: 30, height: 30 }} />Premium
      </div>
      <div style={{ marginTop: 12, fontFamily: font.sans, fontWeight: 700, fontSize: 58, letterSpacing: -1.6, color: tint }}>{name}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8, fontFamily: font.sans, fontWeight: 700, color: '#fff' }}>
        <span style={{ position: 'relative', display: 'inline-block' }}>
          <Odometer text={price} at={fPrice - 8} size={96} color="#fff" style={{ letterSpacing: -4 }} />
          {frame < fPrice - 9 && <Shimmer frame={frame} r={20} dark />}
        </span>
        <span style={{ fontSize: 44, opacity: interpolate(frame, [fPrice + 2, fPrice + 12], [0, 1], clamp) }}>€</span>
        <span style={{ fontSize: 26, fontWeight: 500, color: '#B3B3B3', opacity: interpolate(frame, [fPrice + 6, fPrice + 16], [0, 1], clamp) }}>al mes</span>
      </div>
      <div style={{ height: 1, background: 'rgba(255,255,255,0.14)', margin: '26px 0 26px' }} />
      <div style={{ opacity: sMode, transform: `translateY(${((1 - sMode) * 20).toFixed(2)}px)` }}>
        <Members n={members} tint={tint} at={fMode} onlyAt={mode === 'admin' ? fMode + 4 : undefined} none={mode === 'none'} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20, fontFamily: font.sans, fontWeight: 700, fontSize: 28, color: '#fff', lineHeight: 1.15 }}>
          {mode === 'none' ? <CrossIcon size={38} /> : <CheckIcon size={38} c={SP} fg={SP_INK} />}
          <span>{label}</span>
        </div>
      </div>
    </div>
  );
};

// U03 · Planes (spotify.com/es/premium, 15/10/2026): Individual 11,99 € (12 h), Duo 16,99 € y Familiar 20,99 € (12 h solo para quien
// administra el plan) y Estudiantes 6,49 € (sin horas de audiolibros).
export const U03Planes: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('U03', w, n);
  const fInd = at('individual');
  const fOnce = at('once');
  const fDuo = at('duo');
  const fDiec = at('dieciseis');
  const fFam = at('familiar');
  const fVeinte = at('veinte');
  const fSolo = at('solo');
  const fAdm = at('administra');
  const fEst = at('estudiantes');
  const fSeis = at('seis');
  const fNo = at('no', 3); // los tres primeros «no…» son «noventa»
  const CW = 404;
  const GAP = 34;
  const nAdd = 1 + [fDuo, fFam, fEst].reduce((a, f) => a + spring({ frame: frame - (f - 12), fps, config: { damping: 18, stiffness: 120 } }), 0);
  const actI = interpolate(frame, [fInd - 6, fInd + 4, fDuo - 8, fDuo], [0, 1, 1, 0], clamp);
  const actD = interpolate(frame, [fDuo - 6, fDuo + 4, fFam - 8, fFam], [0, 1, 1, 0], clamp) + interpolate(frame, [fSolo - 6, fSolo + 4, fEst - 8, fEst], [0, 1, 1, 0], clamp);
  const actF = interpolate(frame, [fFam - 6, fFam + 4, fEst - 8, fEst], [0, 1, 1, 0], clamp);
  const actE = interpolate(frame, [fEst - 6, fEst + 4], [0, 1], clamp);
  const sTitle = interpolate(frame, [fInd - 4, fInd + 12], [0, 1], { ...clamp, easing: easeInOut });
  const sAdm = spring({ frame: frame - fSolo + 2, fps, config: { damping: 14, stiffness: 180 } });
  const adm = interpolate(frame, [fAdm - 4, fAdm + 8], [0, 1], { ...clamp, easing: easeOut });
  return (
    <SpoStage>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 96, display: 'flex', justifyContent: 'center', opacity: 1 - 0.85 * sTitle, transform: `translateY(${(-50 * sTitle).toFixed(2)}px) scale(${(1 - 0.14 * sTitle).toFixed(4)})`, filter: sTitle > 0.05 ? `blur(${(sTitle * 2.4).toFixed(2)}px)` : undefined }}>
        <MaskTitle text="¿Qué planes los incluyen?" hi="planes" at={2} size={88} align="center" />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 196, display: 'flex', justifyContent: 'center', gap: GAP, perspective: 2200, transform: `translateX(${((4 - nAdd) * (CW + GAP) / 2).toFixed(2)}px)` }}>
        <PlanCard name="Individual" price="11,99" tint={SP} fIn={fInd - 8} fPrice={fOnce} act={actI} w={CW} members={1} mode="all" fMode={fOnce + 22} />
        <PlanCard name="Duo" price="16,99" tint={SP_PEACH} fIn={fDuo - 8} fPrice={fDiec} act={Math.min(1, actD)} w={CW} members={2} mode="admin" fMode={fSolo - 2} />
        <PlanCard name="Familiar" price="20,99" tint={SP_LILAC} fIn={fFam - 8} fPrice={fVeinte} act={Math.min(1, actF + interpolate(frame, [fSolo - 6, fSolo + 4, fEst - 8, fEst], [0, 1, 1, 0], clamp))} w={CW} members={6} mode="admin" fMode={fSolo - 2} />
        <PlanCard name="Estudiantes" price="6,49" tint={SP_MINT} fIn={fEst - 8} fPrice={fSeis} act={actE} w={CW} members={1} mode="none" fMode={fNo - 2} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 800, display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 34px 16px 18px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.float,
          fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink, opacity: sAdm, transform: `translateY(${((1 - sAdm) * 40).toFixed(2)}px) scale(${(0.85 + 0.15 * sAdm).toFixed(4)})` }}>
          <span style={{ display: 'inline-flex' }}>
            {[SP_PEACH, SP_LILAC].map((c, k) => (
              <span key={k} style={{ width: 52, height: 52, borderRadius: '50%', background: c, border: '3px solid #fff', marginLeft: k ? -14 : 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><UserIcon size={28} /></span>
            ))}
          </span>
          <span>Duo y Familiar:<span style={{ opacity: 0.25 + 0.75 * adm }}> las horas, solo para quien administra el plan</span></span>
        </div>
      </div>
      <Sfx name="card_flip" at={fInd + 2} />
      <ChangeTicks value={(f) => odometerShown('11,99', fOnce - 8, fps, f)} from={fOnce - 8} to={fOnce + 32} volume={0.5} />
      <Sfx name="swipe" at={fDuo - 10} volume={0.5} />
      <Sfx name="card_flip" at={fDuo + 2} />
      <ChangeTicks value={(f) => odometerShown('16,99', fDiec - 8, fps, f)} from={fDiec - 8} to={fDiec + 32} volume={0.5} />
      <Sfx name="swipe" at={fFam - 10} volume={0.5} />
      <Sfx name="card_flip" at={fFam + 2} />
      <ChangeTicks value={(f) => odometerShown('20,99', fVeinte - 8, fps, f)} from={fVeinte - 8} to={fVeinte + 32} volume={0.5} />
      <Sfx name="ui_pop" at={fSolo} volume={0.7} />
      {[0, 1, 2, 3, 4, 5].map((k) => <Sfx key={`m${k}`} name="tick_soft" at={fSolo + 1 + k * 3} volume={0.35} />)}
      <Sfx name="swipe" at={fEst - 10} volume={0.5} />
      <Sfx name="card_flip" at={fEst + 2} />
      <ChangeTicks value={(f) => odometerShown('6,49', fSeis - 8, fps, f)} from={fSeis - 8} to={fSeis + 32} volume={0.5} />
      <Sfx name="cross" at={fNo + 2} volume={0.6} />
    </SpoStage>
  );
};

// U04 · Cómo se gastan las 12 horas (ayuda de Spotify, 15/10/2026): a velocidad normal (un libro de 10 h gasta 10 h aunque lo
// escuches al doble) y repetir también cuenta; se renuevan cada mes y las que no usas se pierden; si se acaban, no puedes seguir
// hasta que se renueven o compres más, pero no pierdes por dónde ibas. En el móvil: «Tiempo de escucha de audiolibros» (0 h de 12,
// «7 días hasta que se renueven»), Audiolibros+ y las recargas, y la ficha de Los tres mundos con su tiempo restante.
export const U04Horas: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('U04', w, n);
  const fGastan = at('gastan');
  const fVel = at('velocidad');
  const fLibro = at('libro');
  const fGasta = at('gasta', 1); // el primero es «gastan»
  const fEscuches = at('escuches');
  const fRepetir = at('repetir');
  const fCuenta = at('cuenta');
  const fRenuevan = at('renuevan');
  const fUsas = at('usas');
  const fPierden = at('pierden');
  const fAcaban = at('acaban');
  const fSeguir = at('seguir');
  const fRenueven = at('renueven');
  const fCompres = at('compres');
  const fAunque = at('aunque', 1);
  const fPierdes = at('pierdes');
  const A = usePhase(-10, fRenuevan - 8);
  const B = usePhase(fRenuevan - 8, fAcaban - 8);
  const C = usePhase(fAcaban - 8, dur + 20);
  const s0: Shot = { rec: '10_horas', at: 0, start: 1.0, hold: 14.0 };
  s0.marks = [markOn(s0, fVel, fRenuevan - 6, 20, 312, 624, 150, 18), markOn(s0, fRenuevan, fAcaban - 8, 20, 494, 624, 54, 14)];
  const s1: Shot = { rec: '10_horas', at: fAcaban - 6, start: 16.0, hold: 26.0 };
  s1.marks = [markOn(s1, fCompres - 2, fAunque - 6, 22, 858, 620, 334, 20)];
  const s2: Shot = { rec: '19_tres_mundos_ficha', at: fAunque - 6, start: 2.0, hold: 11.0 };
  s2.marks = [markOn(s2, fPierdes - 2, dur + 20, 16, 708, 600, 48, 14)];
  const cx = 470;
  const top = Math.round((1080 - PH.H) / 2);
  const cam = buildPhoneCam({
    dur, side: 1, cx, top, enter: 'rise', exit: 'none',
    focus: [{ from: fVel + 2, to: fRenuevan - 6, y: 387, s: 1.42 }, { from: fRenuevan + 2, to: fAcaban - 8, y: 521, s: 1.5 }, { from: fCompres, to: fAunque - 6, y: 1025, s: 1.3 }, { from: fPierdes, to: dur, y: 732, s: 1.45 }],
  });
  // Fase A: un libro de 10 h gasta 10 h, a 1x o a 2x; repetir también cuenta.
  const sBook = spring({ frame: frame - (fLibro - 4), fps, config: { damping: 14, stiffness: 180 } });
  const drain = interpolate(frame, [fGasta - 2, fGasta + 24], [0, 1], { ...clamp, easing: easeInOut });
  const fast = interpolate(frame, [fEscuches - 4, fEscuches + 6], [0, 1], { ...clamp, easing: easeInOut });
  const sMeter = spring({ frame: frame - (fVel - 4), fps, config: { damping: 15, stiffness: 160 } });
  const minus = spring({ frame: frame - (fGasta + 6), fps, config: { damping: 12, stiffness: 200 } });
  const sRep = spring({ frame: frame - (fRepetir - 2), fps, config: { damping: 13, stiffness: 190 } });
  // Fase B: se renuevan cada mes; las 2 h que sobran se pierden.
  const sCal = spring({ frame: frame - (fRenuevan - 4), fps, config: { damping: 14, stiffness: 180 } });
  const lost = interpolate(frame, [fPierden - 6, fPierden + 16], [0, 1], { ...clamp, easing: easeInOut });
  const sLost = spring({ frame: frame - fPierden, fps, config: { damping: 11, stiffness: 210 } });
  // Fase C: se acaban → candado; esperar o comprar; no pierdes por dónde ibas.
  const sEmpty = spring({ frame: frame - (fAcaban - 4), fps, config: { damping: 14, stiffness: 170 } });
  const sLock = spring({ frame: frame - (fSeguir - 4), fps, config: { damping: 11, stiffness: 220 } });
  const sKeep = spring({ frame: frame - (fPierdes - 4), fps, config: { damping: 13, stiffness: 190 } });
  return (
    <SpoStage>
      <PhoneHalo cam={cam} cx={cx} />
      <div style={{ position: 'absolute', top, left: cx - PH.W / 2 }}>
        <AppPhone shots={[s0, s1, s2]} w={PHONE_W} cam={cam} dim={0.72} motionBlur float={[0, dur]} />
      </div>
      {A.visible && (
        <div style={{ position: 'absolute', left: 900, top: 0, height: 1080, width: 940, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...A.style }}>
          <MaskTitle text={'Se gastan a\nvelocidad normal'} hi="normal" at={Math.max(0, fGastan - 6)} size={92} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 50, opacity: sBook, transform: `translateY(${((1 - sBook) * 30).toFixed(2)}px)` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 28px 14px 16px', borderRadius: 24, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.soft,
              fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink }}>
              <span style={{ width: 54, height: 68, borderRadius: 10, background: SP, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><HeadphonesIcon size={32} /></span>
              Libro de 10 h
            </div>
            {/* 1x ⇄ 2x: se escuche como se escuche, gasta lo mismo. */}
            <div style={{ position: 'relative', display: 'flex', padding: 6, borderRadius: 999, background: '#EFEFF3', fontFamily: font.sans, fontWeight: 700, fontSize: 34 }}>
              <div style={{ position: 'absolute', top: 6, bottom: 6, left: 6 + 100 * fast, width: 100, borderRadius: 999, background: SP_INK }} />
              {['1x', '2x'].map((t, k) => (
                <span key={t} style={{ position: 'relative', width: 100, height: 60, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  color: (k === 0 ? 1 - fast : fast) > 0.5 ? '#fff' : color.ink2 }}><SpeedIcon size={26} c={(k === 0 ? 1 - fast : fast) > 0.5 ? '#fff' : color.ink2} />{t}</span>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative', marginTop: 34, alignSelf: 'flex-start', opacity: sMeter, transform: `translateY(${((1 - sMeter) * 24).toFixed(2)}px)` }}>
            <HoursMeter left={(12 - 10 * drain) / 12} total={12} w={760} h={80} />
            <div style={{ position: 'absolute', right: -10, top: -54, padding: '8px 18px', borderRadius: 16, background: color.red, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 32,
              opacity: minus, transform: `translateY(${((1 - minus) * 16).toFixed(2)}px) scale(${(0.6 + 0.4 * minus).toFixed(4)})` }}>−10 h</div>
          </div>
          <div style={{ marginTop: 34, minHeight: 84 }}>
            <Pill s={sRep} size={38}><SyncIcon size={42} /> Repetir también cuenta</Pill>
          </div>
        </div>
      )}
      {B.visible && (
        <div style={{ position: 'absolute', left: 900, top: 0, height: 1080, width: 940, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...B.style }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: sCal, transform: `translateY(${((1 - sCal) * 24).toFixed(2)}px)` }}>
            <span style={{ width: 80, height: 80, borderRadius: 22, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.soft, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><CalendarIcon size={48} /></span>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 56, color: color.ink, letterSpacing: -1.5 }}>Se renuevan cada mes</span>
          </div>
          <div style={{ marginTop: 44 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: 840, fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.ink2, marginBottom: 14 }}>
              <span>Te quedaban 2 h…</span><span style={{ opacity: lost }}>y empiezas otra vez con 12</span>
            </div>
            <HourBlocks on={2} w={840} h={72} gap={9} lost={lost} />
          </div>
          <div style={{ marginTop: 40, minHeight: 84 }}>
            <Pill s={sLost} tone="red" size={38} shake={0}><CrossIcon size={42} /> Las que no usas se pierden</Pill>
          </div>
          <div style={{ marginTop: 6, fontFamily: font.sans, fontWeight: 500, fontSize: 30, color: color.muted, opacity: interpolate(frame, [fUsas, fUsas + 10], [0, 1], clamp) }}>No se acumulan de un mes a otro</div>
        </div>
      )}
      {C.visible && (
        <div style={{ position: 'absolute', left: 900, top: 0, height: 1080, width: 940, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...C.style }}>
          <MaskTitle text="¿Y si se acaban?" hi="acaban?" at={Math.max(0, fAcaban - 10)} size={92} />
          <div style={{ position: 'relative', marginTop: 40, alignSelf: 'flex-start', opacity: sEmpty, transform: `translateY(${((1 - sEmpty) * 24).toFixed(2)}px)` }}>
            <HoursMeter left={0} total={12} w={700} h={80} label="0 h" />
            <span style={{ position: 'absolute', right: -96, top: -6, width: 92, height: 92, borderRadius: '50%', background: SP_INK, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              transform: `scale(${sLock.toFixed(4)}) rotate(${((1 - sLock) * -30).toFixed(2)}deg)` }}><LockIcon size={50} c="#fff" /></span>
          </div>
          <div style={{ marginTop: 22, fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink, opacity: sLock }}>No puedes seguir escuchando hasta que…</div>
          <div style={{ display: 'flex', gap: 14, marginTop: 24, minHeight: 80 }}>
            <Chip at={fRenueven - 3} label="Se renueven" icon={<CalendarIcon size={30} />} size={36} accent={SP_SOFT} reserve />
            <Chip at={fCompres - 3} label="O compres más" icon={<CardIcon size={30} />} size={36} accent={SP_SOFT} reserve />
          </div>
          <div style={{ marginTop: 26, minHeight: 84 }}>
            <Pill s={sKeep} tone="green" size={38}><BookmarkIcon size={42} /> No pierdes por dónde ibas</Pill>
          </div>
        </div>
      )}
      <Sfx name="ui_pop" at={fLibro - 2} volume={0.6} />
      <Sfx name="draw" at={fGasta - 2} volume={0.45} dur={24} fade={8} />
      <Sfx name="hit_soft" at={fGasta + 8} volume={0.55} />
      <Sfx name="swipe" at={fEscuches - 4} volume={0.5} />
      <Sfx name="ui_pop" at={fRepetir} volume={0.6} />
      <Sfx name="hit_soft" at={fCuenta} volume={0.4} />
      <Sfx name="whoosh_soft" at={fRenuevan - 10} volume={0.5} />
      <Sfx name="cross" at={fPierden + 2} volume={0.6} />
      <Sfx name="whoosh_soft" at={fAcaban - 10} volume={0.5} />
      <Sfx name="stamp" at={fSeguir - 2} volume={0.5} />
      <Sfx name="ui_pop" at={fRenueven - 2} volume={0.55} />
      <Sfx name="ui_pop" at={fCompres - 2} volume={0.55} />
      <Sfx name="success" at={fPierdes} volume={0.5} />
      {zoomPeaks(cam, 2, dur - 2).map((f) => <Sfx key={`z${f}`} name="zoom_in" at={f} volume={0.4} />)}
      <ChangeTicks value={(f) => String(Math.round(12 - 10 * interpolate(f, [fGasta - 2, fGasta + 24], [0, 1], { ...clamp, easing: easeInOut })))} from={fGasta - 2} to={fGasta + 26} volume={0.35} />
    </SpoStage>
  );
};

// Barra de un libro sobre los meses: tantos tramos de 12 h como haga falta (el hueco entre meses es la espera hasta que se
// renuevan). `grow` (0–1) la va dibujando de izquierda a derecha.
const MonthBar: React.FC<{ hours: number; grow: number; mw: number; gap: number; tint: string; h?: number }> = ({ hours, grow, mw, gap, tint, h = 54 }) => {
  const shown = hours * grow;
  const months = Math.ceil(hours / 12);
  return (
    <div style={{ position: 'relative', height: h }}>
      {Array.from({ length: months }, (_, m) => {
        const part = Math.max(0, Math.min(12, shown - m * 12));
        if (part <= 0) return null;
        return (
          <div key={m} style={{ position: 'absolute', left: m * (mw + gap), top: 0, height: h, width: (part / 12) * mw, borderRadius: h * 0.28, background: tint,
            boxShadow: '0 8px 20px rgba(16,16,16,0.12)' }} />
        );
      })}
    </div>
  );
};

// U05 · ¿Para cuánto dan 12 horas? Duraciones en la app (15/10/2026): Reina Roja 11 h 46 min, La sombra del viento 17 h 45 min
// y Los tres mundos 32 h 48 min. Cada columna es un mes (12 horas).
export const U05Duracion: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('U05', w, n);
  const fPara = at('para', 1);
  const fMedia = at('media');
  const fReina = at('reina');
  const fOnce = at('once');
  const fPero = at('pero');
  const fSombra = at('sombra');
  const fDiec = at('dieciocho');
  const fTres = at('tres');
  const fTreinta = at('treinta');
  const fMeses = at('meses');
  const MW = 470;
  const G = 34;
  const X0 = (1920 - (3 * MW + 2 * G)) / 2;
  const books = [
    { t: 'Reina Roja', a: 'Juan Gómez-Jurado', d: '11 h 46 min', h: 11 + 46 / 60, f: fReina, g: fOnce, tint: SP },
    { t: 'La sombra del viento', a: 'Carlos Ruiz Zafón', d: '17 h 45 min', h: 17.75, f: fSombra, g: fDiec, tint: SP_PEACH },
    { t: 'Los tres mundos', a: 'Santiago Posteguillo', d: '32 h 48 min', h: 32 + 48 / 60, f: fTres, g: fTreinta, tint: SP_LILAC },
  ];
  const sCols = spring({ frame: frame - 6, fps, config: { damping: 16, stiffness: 140 } });
  const sSub = spring({ frame: frame - (fPara - 2), fps, config: { damping: 14, stiffness: 170 } });
  const sFits = spring({ frame: frame - (fOnce + 30), fps, config: { damping: 12, stiffness: 200 } });
  const hi3 = interpolate(frame, [fMeses - 10, fMeses + 6], [0, 1], { ...clamp, easing: easeOut });
  return (
    <SpoStage>
      <div style={{ position: 'absolute', left: X0, top: 74 }}>
        <MaskTitle text="¿Para cuánto dan 12 horas?" hi="12" at={2} size={80} />
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 14, fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: color.ink2, opacity: sSub, transform: `translateY(${((1 - sSub) * 16).toFixed(2)}px)` }}>
          <BookIcon size={38} c={color.ink2} /> Para un libro de duración media
        </div>
      </div>
      {/* Columnas de los meses */}
      {[0, 1, 2].map((m) => {
        const sm = spring({ frame: frame - (6 + m * 5), fps, config: { damping: 15, stiffness: 150 } });
        const glow = m === 2 ? hi3 : 0;
        return (
          <div key={m} style={{ position: 'absolute', left: X0 + m * (MW + G), top: 270, width: MW, height: 640, borderRadius: 34, background: `rgba(255,255,255,${(0.55 + 0.25 * glow).toFixed(3)})`,
            border: `2px dashed ${m === 2 && glow > 0.5 ? color.yellow : 'rgba(16,16,16,0.12)'}`, boxSizing: 'border-box', opacity: sm * sCols, transform: `translateY(${((1 - sm) * 30).toFixed(2)}px)` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 26px 0', fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: color.ink }}>
              <span>Mes {m + 1}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 28, color: SP_DEEP }}><ClockIcon size={30} c={SP_DEEP} /> 12 h</span>
            </div>
          </div>
        );
      })}
      {/* Libros */}
      {books.map((b, i) => {
        const s = spring({ frame: frame - (b.f - 4), fps, config: { damping: 14, stiffness: 170 } });
        const grow = interpolate(frame, [b.g - 4, b.g + 10 + 6 * Math.ceil(b.h / 12)], [0, 1], { ...clamp, easing: easeInOut });
        const y = 360 + i * 186;
        if (frame < b.f - 6) return null;
        return (
          <div key={b.t} style={{ position: 'absolute', left: X0 + 22, top: y, width: 3 * MW + 2 * G - 44, opacity: s, transform: `translateX(${((1 - s) * -40).toFixed(2)}px)` }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 14, fontFamily: font.sans, color: color.ink }}>
              <span style={{ fontWeight: 700, fontSize: 46, letterSpacing: -1 }}>{b.t}</span>
              <span style={{ fontWeight: 500, fontSize: 30, color: color.muted }}>{b.a}</span>
              <span style={{ fontWeight: 700, fontSize: 36, color: color.ink, opacity: grow > 0.05 ? 1 : 0 }}>· {b.d}</span>
            </div>
            <MonthBar hours={b.h} grow={grow} mw={MW - 44} gap={G + 44} tint={b.tint} h={66} />
          </div>
        );
      })}
      {/* «Cabe en un mes» junto a Reina Roja y «casi 3 meses» al final */}
      <div style={{ position: 'absolute', left: X0 + MW + G + 24, top: 432, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 20px 8px 10px', borderRadius: 999, background: '#E6F8EC',
        border: '2px solid rgba(31,157,85,0.3)', fontFamily: font.sans, fontWeight: 700, fontSize: 28, color: color.ink, opacity: sFits * (1 - interpolate(frame, [fPero - 6, fPero + 4], [0, 1], clamp)), transform: `scale(${(0.8 + 0.2 * sFits).toFixed(4)})`, transformOrigin: 'left center' }}>
        <CheckIcon size={32} /> Cabe en un mes
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 940, display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 30px 12px 16px', borderRadius: 999, background: SP_INK, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 38,
          opacity: hi3, transform: `translateY(${((1 - hi3) * 20).toFixed(2)}px)` }}>
          <CalendarIcon size={42} c={SP} /> Los tres mundos: casi 3 meses de horas
        </div>
      </div>
      <Sfx name="whoosh_soft" at={4} volume={0.5} />
      <Sfx name="ui_pop" at={fPara} volume={0.5} />
      {books.map((b) => <Sfx key={b.t} name="ui_pop" at={b.f - 2} volume={0.6} />)}
      {books.map((b) => <Sfx key={`d${b.t}`} name="draw" at={b.g - 4} volume={0.4} dur={16 + 6 * Math.ceil(b.h / 12)} fade={6} />)}
      <Sfx name="success" at={fOnce + 32} volume={0.45} />
      <Sfx name="hit_soft" at={fMeses - 4} volume={0.6} />
    </SpoStage>
  );
};

// U06 · Más horas (spotify.com/es/audiobooks y la app, 15/10/2026): Audiolibros+ suma 15 h al mes por 8,99 € (el primer mes
// gratis); la recarga de 10 h cuesta 9,99 € y vale 12 meses; los libros con «Escucha sin límites hasta…» no gastan horas
// mientras dure (Harry Potter and the Philosopher's Stone, hasta el 31 de octubre).
export const U06Mas: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('U06', w, n);
  const fCorto = at('corto');
  const fPlus = at('audiolibros');
  const fQuince = at('quince');
  const fOcho = at('ocho');
  const fRecarga = at('recarga');
  const fDiez = at('diez');
  const fNueve = at('nueve', 1); // el primero es el de «ocho noventa y nueve»
  const fVale = at('vale');
  const fTruco = at('truco');
  const fEscucha = at('escucha');
  const fGastan = at('gastan');
  const fTiempo = at('tiempo');
  const A = usePhase(-10, fTruco - 8);
  const B = usePhase(fTruco - 8, dur + 20);
  const s0: Shot = { rec: '10_horas', at: 0, start: 16.0, hold: 26.0 };
  s0.marks = [markOn(s0, fPlus - 2, fRecarga - 8, 22, 438, 620, 324, 20)];
  const s1: Shot = { rec: '11_recarga', at: fRecarga - 6, start: 1.5, hold: 12.5 };
  s1.marks = [
    markOn(s1, fRecarga, fNueve - 4, 20, 520, 624, 205, 18),
    markOn(s1, fNueve - 2, fVale - 4, 40, 1176, 584, 84, 40),
    markOn(s1, fVale - 2, fTruco - 8, 20, 920, 624, 78, 16),
  ];
  const s2: Shot = { rec: '22_hp_sin_limites', at: fTruco - 6, start: 1.0, hold: 15.5 };
  s2.marks = [markOn(s2, fEscucha - 2, fGastan - 4, 16, 500, 470, 46, 14), markOn(s2, fGastan - 2, dur + 20, 16, 872, 632, 96, 18)];
  const cx = 470;
  const top = Math.round((1080 - PH.H) / 2);
  const cam = buildPhoneCam({
    dur, side: 1, cx, top, enter: 'rise', exit: 'none',
    focus: [
      { from: fPlus, to: fRecarga - 8, y: 600, s: 1.3 }, { from: fRecarga + 2, to: fNueve - 4, y: 622, s: 1.36 }, { from: fNueve, to: fVale - 4, y: 1218, s: 1.36 },
      { from: fVale, to: fTruco - 8, y: 959, s: 1.4 }, { from: fEscucha, to: fGastan - 4, y: 523, s: 1.45 }, { from: fGastan, to: dur, y: 920, s: 1.4 },
    ],
  });
  const card = (k: number): React.CSSProperties => {
    const f = k === 0 ? fPlus - 6 : fRecarga - 6;
    const s = spring({ frame: frame - f, fps, config: { damping: 14, stiffness: 150 } });
    const act = k === 0 ? interpolate(frame, [fPlus - 4, fPlus + 6, fRecarga - 8, fRecarga], [0, 1, 1, 0], clamp) : interpolate(frame, [fRecarga - 4, fRecarga + 6], [0, 1], clamp);
    return {
      position: 'relative', width: 455, padding: '30px 36px 30px', borderRadius: 36, background: '#fff', border: `1px solid ${color.line}`, boxSizing: 'border-box', overflow: 'hidden',
      boxShadow: `0 0 0 ${(5 * act).toFixed(2)}px ${k === 0 ? '#3D7BFF' : SP_INK}, ${shadow.card}`,
      opacity: Math.min(1, s * 1.3), transform: `translateY(${((1 - s) * 70 - 10 * act).toFixed(2)}px) scale(${(0.92 + 0.08 * s).toFixed(4)})`,
    };
  };
  const sQ = spring({ frame: frame - 2, fps, config: { damping: 15, stiffness: 160 } });
  const sGratis = spring({ frame: frame - (fOcho + 30), fps, config: { damping: 12, stiffness: 210 } });
  const sYear = spring({ frame: frame - (fVale - 2), fps, config: { damping: 12, stiffness: 210 } });
  const sTag = spring({ frame: frame - (fEscucha - 4), fps, config: { damping: 13, stiffness: 180 } });
  const sNo = spring({ frame: frame - (fGastan - 4), fps, config: { damping: 13, stiffness: 180 } });
  return (
    <SpoStage>
      <PhoneHalo cam={cam} cx={cx} />
      <div style={{ position: 'absolute', top, left: cx - PH.W / 2 }}>
        <AppPhone shots={[s0, s1, s2]} w={PHONE_W} cam={cam} dim={0.72} motionBlur float={[0, dur]} />
      </div>
      {A.visible && (
        <div style={{ position: 'absolute', left: 900, top: 0, height: 1080, width: 960, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...A.style }}>
          <div style={{ opacity: sQ }}><MaskTitle text="¿Te quedas corto?" hi="corto?" at={Math.max(0, fCorto - 12)} size={92} /></div>
          <div style={{ display: 'flex', gap: 30, marginTop: 44 }}>
            <div style={card(0)}>
              <Sheen at={fPlus} radius={36} tint="rgba(61,123,255,0.18)" />
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: '#2F62D6', letterSpacing: -0.8 }}>Audiolibros+</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 10, fontFamily: font.sans, fontWeight: 700, color: color.ink }}>
                <span style={{ fontSize: 96, letterSpacing: -4, opacity: interpolate(frame, [fQuince - 4, fQuince + 6], [0, 1], clamp) }}>+15 h</span>
              </div>
              <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 28, color: color.ink2 }}>cada mes</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 20, fontFamily: font.sans, fontWeight: 700, color: color.ink }}>
                <span style={{ position: 'relative', display: 'inline-block' }}>
                  <Odometer text="8,99" at={fOcho - 8} size={64} style={{ letterSpacing: -2.5 }} />
                  {frame < fOcho - 9 && <Shimmer frame={frame} r={14} />}
                </span>
                <span style={{ fontSize: 34 }}>€</span><span style={{ fontSize: 24, fontWeight: 500, color: color.muted }}>al mes</span>
              </div>
              <div style={{ display: 'inline-block', marginTop: 18, padding: '8px 18px', borderRadius: 999, background: '#E8EFFF', color: '#2F62D6', fontFamily: font.sans, fontWeight: 700, fontSize: 26,
                opacity: sGratis, transform: `scale(${(0.6 + 0.4 * sGratis).toFixed(4)}) rotate(${((1 - sGratis) * -6).toFixed(2)}deg)`, transformOrigin: 'left center' }}>1.er mes gratis (la 1.ª vez)</div>
            </div>
            <div style={card(1)}>
              <Sheen at={fRecarga} radius={36} tint="rgba(30,215,96,0.18)" />
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink, letterSpacing: -0.8 }}>Recarga</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 10, fontFamily: font.sans, fontWeight: 700, color: color.ink }}>
                <span style={{ fontSize: 96, letterSpacing: -4, opacity: interpolate(frame, [fDiez - 4, fDiez + 6], [0, 1], clamp) }}>+10 h</span>
              </div>
              <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 28, color: color.ink2 }}>pago único</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 20, fontFamily: font.sans, fontWeight: 700, color: color.ink }}>
                <span style={{ position: 'relative', display: 'inline-block' }}>
                  <Odometer text="9,99" at={fNueve - 8} size={64} style={{ letterSpacing: -2.5 }} />
                  {frame < fNueve - 9 && <Shimmer frame={frame} r={14} />}
                </span>
                <span style={{ fontSize: 34 }}>€</span>
              </div>
              <div style={{ display: 'inline-block', marginTop: 18, padding: '8px 18px', borderRadius: 999, background: SP_SOFT, color: SP_DEEP, fontFamily: font.sans, fontWeight: 700, fontSize: 26,
                opacity: sYear, transform: `scale(${(0.6 + 0.4 * sYear).toFixed(4)}) rotate(${((1 - sYear) * 6).toFixed(2)}deg)`, transformOrigin: 'left center' }}>Vale 1 año</div>
            </div>
          </div>
        </div>
      )}
      {B.visible && (
        <div style={{ position: 'absolute', left: 900, top: 0, height: 1080, width: 940, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...B.style }}>
          <MaskTitle text="Un truco" hi="truco" at={Math.max(0, fTruco - 6)} size={96} />
          <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 16, alignSelf: 'flex-start', padding: '18px 34px 18px 22px', borderRadius: 26, background: SP_INK,
            fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: SP, opacity: sTag, transform: `translateY(${((1 - sTag) * 30).toFixed(2)}px) scale(${(0.88 + 0.12 * sTag).toFixed(4)})`, transformOrigin: 'left center', boxShadow: shadow.float }}>
            <InfinityIcon size={54} c={SP} /> Escucha sin límites
          </div>
          <div style={{ marginTop: 14, fontFamily: font.sans, fontWeight: 500, fontSize: 30, color: color.muted, opacity: sTag }}>La etiqueta de algunos libros, durante un tiempo</div>
          <div style={{ marginTop: 34, minHeight: 84 }}>
            <Pill s={sNo} tone="green" size={40}><ClockIcon size={44} /> No gastan tus horas</Pill>
          </div>
          <div style={{ marginTop: 10, fontFamily: font.sans, fontWeight: 500, fontSize: 30, color: color.ink2, opacity: interpolate(frame, [fTiempo - 4, fTiempo + 8], [0, 1], clamp) }}>Ejemplo: Harry Potter en inglés, hasta el 31 de octubre</div>
        </div>
      )}
      <Sfx name="ui_pop" at={fCorto - 4} volume={0.5} />
      <Sfx name="card_flip" at={fPlus - 4} volume={0.7} />
      <Sfx name="ui_pop" at={fQuince - 2} volume={0.6} />
      <ChangeTicks value={(f) => odometerShown('8,99', fOcho - 8, fps, f)} from={fOcho - 8} to={fOcho + 32} volume={0.45} />
      <Sfx name="sparkle" at={fOcho + 30} volume={0.5} />
      <Sfx name="card_flip" at={fRecarga - 4} volume={0.7} />
      <Sfx name="ui_pop" at={fDiez - 2} volume={0.6} />
      <ChangeTicks value={(f) => odometerShown('9,99', fNueve - 8, fps, f)} from={fNueve - 8} to={fNueve + 32} volume={0.45} />
      <Sfx name="stamp" at={fVale} volume={0.45} />
      <Sfx name="whoosh_soft" at={fTruco - 10} volume={0.5} />
      <Sfx name="sparkle" at={fEscucha - 2} volume={0.6} />
      <Sfx name="success" at={fGastan} volume={0.45} />
      {zoomPeaks(cam, 2, dur - 2).map((f) => <Sfx key={`z${f}`} name="zoom_in" at={f} volume={0.4} />)}
    </SpoStage>
  );
};

// Fila de un libro (sin portada: icono de libro). `state`: incluido (✓), de pago (candado) o pendiente.
const BookRow: React.FC<{ at: number; title: string; author: string; state: 'ok' | 'lock' | 'wait'; checkAt?: number; w?: number; right?: React.ReactNode }> = ({ at, title, author, state, checkAt, w = 760, right }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 180 } });
  const mark = spring({ frame: frame - (checkAt ?? at + 6), fps, config: { damping: 11, stiffness: 220 } });
  if (frame < at - 2) return <div style={{ height: 112, width: w }} />;
  const ok = state === 'ok' && mark > 0.5;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 22, height: 112, width: w, boxSizing: 'border-box', padding: '0 24px', borderRadius: 28, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.soft,
      opacity: s, transform: `translateX(${((1 - s) * -40).toFixed(2)}px)` }}>
      <span style={{ width: 60, height: 78, borderRadius: 10, background: ok ? SP_SOFT : '#F3F3F3', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <BookIcon size={34} c={ok ? SP_DEEP : color.muted} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.ink, letterSpacing: -0.6, whiteSpace: 'nowrap' }}>{title}</div>
        <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 26, color: color.muted, marginTop: 4 }}>{author}</div>
      </div>
      {right}
      {state !== 'wait' && (
        <span style={{ display: 'inline-flex', transform: `scale(${mark.toFixed(4)})` }}>
          {state === 'ok' ? <CheckIcon size={50} /> : <span style={{ width: 50, height: 50, borderRadius: '50%', background: SP_INK, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><LockIcon size={28} c="#fff" /></span>}
        </span>
      )}
    </div>
  );
};

// U07 · El catálogo en español: búsquedas en la app con el filtro Audiolibros (15/10/2026). La sombra del viento, La Bestia, Reina
// Roja y Los tres mundos, incluidos; Loba negra (Antonia Scott 2), de pago y solo en la web (la app manda a spotify.com); La
// asistenta, de Freida McFadden: la versión en castellano, incluida; la latina, de pago (16,99 €).
export const U07Catalogo: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('U07', w, n);
  const fBuscamos = at('buscamos');
  const fSombra = at('sombra');
  const fBestia = at('bestia');
  const fReina = at('reina');
  const fTres = at('tres');
  const fEstan = at('estan');
  const fIncl = at('incluidos');
  const fPero = at('pero');
  const fLoba = at('loba');
  const fSegunda = at('segunda');
  const fCompra = at('compra');
  const fWeb = at('web');
  const fOjo = at('ojo');
  const fCast = at('castellano');
  const fLatino = at('latino');
  const fSiempre = at('siempre');
  const A = usePhase(-10, fPero - 8);
  const B = usePhase(fPero - 8, fOjo - 8);
  const C = usePhase(fOjo - 8, dur + 20);
  // Móvil: cada búsqueda (ya filtrada) cuando la voz la nombra; luego Loba negra con su candado y La asistenta.
  const s0: Shot = { rec: '16_sombra', at: 0, start: 0.6, hold: 16.1 };
  s0.marks = [markOn(s0, fSombra - 2, fBestia - 8, 8, 200, 648, 200, 18)];
  const s1: Shot = { rec: '17_bestia', at: fBestia - 6, start: 1.0, hold: 17.5 };
  s1.marks = [markOn(s1, fBestia, fReina - 8, 8, 200, 648, 180, 18)];
  const s2: Shot = { rec: '02_reina_filtro', at: fReina - 6, start: 1.5, hold: 15.5 };
  s2.marks = [markOn(s2, fReina, fTres - 8, 8, 200, 648, 112, 18)];
  const s3: Shot = { rec: '18_tres_mundos', at: fTres - 6, start: 14.0, hold: 24.5 };
  s3.marks = [markOn(s3, fTres, fPero - 8, 8, 200, 648, 180, 18)];
  const s4: Shot = { rec: '02_reina_filtro', at: fPero - 6, start: 3.0, hold: 15.5 };
  s4.marks = [markOn(s4, fLoba - 2, fOjo - 8, 8, 422, 648, 96, 18)];
  const s5: Shot = { rec: '14_asistenta', at: fOjo - 6, start: 1.0, hold: 12.5 };
  s5.marks = [markOn(s5, fCast - 4, fLatino - 4, 8, 202, 648, 104, 18), markOn(s5, fLatino - 2, fSiempre - 8, 8, 686, 648, 88, 18)];
  const s6: Shot = { rec: '15_asistenta_latino', at: fSiempre - 6, start: 1.0, hold: 10.5 };
  s6.marks = [markOn(s6, fSiempre, dur + 20, 10, 666, 236, 64, 14)];
  const cx = 1425;
  const top = Math.round((1080 - PH.H) / 2);
  const cam = buildPhoneCam({
    dur, side: -1, cx, top, enter: 'rise', exit: 'none',
    focus: [
      { from: fSombra, to: fBestia - 8, y: 300, s: 1.3 }, { from: fBestia + 2, to: fReina - 8, y: 290, s: 1.3 }, { from: fReina + 2, to: fTres - 8, y: 256, s: 1.3 },
      { from: fTres + 2, to: fPero - 8, y: 290, s: 1.3 }, { from: fLoba, to: fOjo - 8, y: 470, s: 1.4 }, { from: fCast, to: fLatino - 4, y: 254, s: 1.3 },
      { from: fLatino, to: fSiempre - 8, y: 730, s: 1.36 }, { from: fSiempre + 2, to: dur, y: 698, x: 200, s: 1.4 },
    ],
  });
  const sSearch = spring({ frame: frame - (fBuscamos - 4), fps, config: { damping: 14, stiffness: 180 } });
  const sIncl = spring({ frame: frame - (fIncl - 2), fps, config: { damping: 12, stiffness: 200 } });
  const sCompra = spring({ frame: frame - (fCompra - 3), fps, config: { damping: 13, stiffness: 190 } });
  const sWeb = spring({ frame: frame - (fWeb - 3), fps, config: { damping: 13, stiffness: 190 } });
  const sNot = spring({ frame: frame - (fSiempre - 4), fps, config: { damping: 12, stiffness: 200 } });
  const k = frame - fSiempre;
  const shake = k >= 0 && k < 14 ? 6 * Math.exp(-k / 3.5) * Math.sin(k * 2.1) : 0;
  return (
    <SpoStage>
      <PhoneHalo cam={cam} cx={cx} />
      <div style={{ position: 'absolute', top, left: cx - PH.W / 2 }}>
        <AppPhone shots={[s0, s1, s2, s3, s4, s5, s6]} w={PHONE_W} cam={cam} dim={0.72} motionBlur float={[0, dur]} />
      </div>
      {A.visible && (
        <div style={{ position: 'absolute', left: 140, top: 0, height: 1080, width: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...A.style }}>
          <MaskTitle text="¿Qué hay en español?" hi="español?" at={2} size={88} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 20, fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: color.ink2, opacity: sSearch }}>
            <FlagES w={46} /> Buscamos 4 superventas
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 34 }}>
            <BookRow at={fSombra - 3} title="La sombra del viento" author="Carlos Ruiz Zafón" state="ok" checkAt={fEstan} />
            <BookRow at={fBestia - 3} title="La Bestia" author="Carmen Mola" state="ok" checkAt={fEstan + 4} />
            <BookRow at={fReina - 3} title="Reina Roja" author="Juan Gómez-Jurado" state="ok" checkAt={fEstan + 8} />
            <BookRow at={fTres - 3} title="Los tres mundos" author="Santiago Posteguillo" state="ok" checkAt={fEstan + 12} />
          </div>
          <div style={{ marginTop: 26, minHeight: 80 }}>
            <Pill s={sIncl} tone="green" size={36}><CheckIcon size={40} /> Los cuatro, incluidos en Premium</Pill>
          </div>
        </div>
      )}
      {B.visible && (
        <div style={{ position: 'absolute', left: 140, top: 0, height: 1080, width: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...B.style }}>
          <MaskTitle text="Pero no todo lo está" hi="todo" at={Math.max(0, fPero - 6)} size={88} />
          <div style={{ marginTop: 44 }}>
            <BookRow at={fLoba - 3} title="Loba negra" author="Antonia Scott 2 · Juan Gómez-Jurado" state="lock" checkAt={fLoba + 6} />
          </div>
          <div style={{ marginTop: 12, fontFamily: font.sans, fontWeight: 500, fontSize: 30, color: color.muted, opacity: interpolate(frame, [fSegunda - 4, fSegunda + 8], [0, 1], clamp) }}>La segunda parte de Reina Roja</div>
          <div style={{ display: 'flex', gap: 16, marginTop: 34, minHeight: 84 }}>
            <Pill s={sCompra} tone="red" size={36}><CardIcon size={40} /> Se compra aparte</Pill>
            <Pill s={sWeb} size={36}><GlobeIcon size={40} /> Se paga en la web</Pill>
          </div>
        </div>
      )}
      {C.visible && (
        <div style={{ position: 'absolute', left: 140, top: 0, height: 1080, width: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...C.style }}>
          <MaskTitle text={'Ojo: castellano\ny latino'} hi="latino" at={Math.max(0, fOjo - 6)} size={86} />
          <div style={{ marginTop: 16, fontFamily: font.sans, fontWeight: 500, fontSize: 32, color: color.ink2 }}>La asistenta · Freida McFadden</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 30 }}>
            <BookRow at={fCast - 4} title="Castellano" author="Incluido en Premium" state="ok" checkAt={fCast + 6} />
            <BookRow at={fLatino - 4} title="Latino" author="De pago" state="lock" checkAt={fLatino + 6}
              right={<span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink, marginRight: 10 }}>16,99 €</span>} />
          </div>
          <div style={{ marginTop: 28, minHeight: 84 }}>
            <Pill s={sNot} tone="red" size={36} shake={shake}><CrossIcon size={40} /> No siempre se incluyen las dos</Pill>
          </div>
        </div>
      )}
      <Sfx name="ui_pop" at={fBuscamos - 2} volume={0.5} />
      {[fSombra, fBestia, fReina, fTres].map((f) => <Sfx key={f} name="ui_pop" at={f - 2} volume={0.55} />)}
      {[0, 4, 8, 12].map((d) => <Sfx key={`c${d}`} name="tick_soft" at={fEstan + d} volume={0.55} />)}
      <Sfx name="success" at={fIncl} volume={0.5} />
      <Sfx name="whoosh_soft" at={fPero - 10} volume={0.5} />
      <Sfx name="stamp" at={fLoba + 6} volume={0.5} />
      <Sfx name="ui_pop" at={fCompra - 2} volume={0.55} />
      <Sfx name="ui_pop" at={fWeb - 2} volume={0.55} />
      <Sfx name="whoosh_soft" at={fOjo - 10} volume={0.5} />
      <Sfx name="tick_soft" at={fCast + 6} volume={0.6} />
      <Sfx name="stamp" at={fLatino + 6} volume={0.5} />
      <Sfx name="cross" at={fSiempre + 2} volume={0.55} />
      {zoomPeaks(cam, 2, dur - 2).map((f) => <Sfx key={`z${f}`} name="zoom_in" at={f} volume={0.4} />)}
    </SpoStage>
  );
};

export { SP_CARD, SP_LILAC_SOFT, SP_MINT_SOFT, SP_PEACH_SOFT };
