import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { ChangeTicks, Sfx } from '../../components/Sfx';
import { BookIcon, CheckIcon, CrossIcon, HeadphonesIcon } from '../../components/Icons';
import { CalendarIcon, CardIcon, DocIcon, InfinityIcon, PhoneIcon, UserIcon } from '../../components/Icons2';
import { wf } from './timeline';
import type { SceneProps } from './registry';
import {
  AppPhone, buildPhoneCam, Chip, markOn, MaskTitle, Odometer, odometerShown, PH, PhoneHalo, PHONE_W, Sheen, Shot, SoloBadge, ST, ST_DEEP, ST_PINK, ST_SOFT,
  StorytelLogo, StrStage, zoomPeaks,
} from './kit';
import { PriceRoll, priceRollShown } from './parts';

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

// Banderas sencillas (Suecia y España) para «app sueca que llegó a España».
const FlagSE: React.FC<{ w?: number }> = ({ w = 64 }) => (
  <svg width={w} height={w * 0.625} viewBox="0 0 16 10" style={{ borderRadius: 6, boxShadow: '0 0 0 1px rgba(0,0,0,0.08)' }}>
    <rect width="16" height="10" fill="#006AA7" /><rect x="5" width="2" height="10" fill="#FECC00" /><rect y="4" width="16" height="2" fill="#FECC00" />
  </svg>
);
const FlagES: React.FC<{ w?: number }> = ({ w = 64 }) => (
  <svg width={w} height={w * 0.72} viewBox="0 0 36 26" style={{ borderRadius: 6, boxShadow: '0 0 0 1px rgba(0,0,0,0.08)' }}>
    <rect width="36" height="26" fill="#C60B1E" /><rect y="6.5" width="36" height="13" fill="#FFC400" />
  </svg>
);

// A01 · Gancho: el móvil entra girando con la app real y enseña lo que nombra la voz; a la izquierda, la pregunta.
export const A01Hook: React.FC<P> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('A01', w, n);
  const fInst = at('instalado');
  const fCat = at('catalogo');
  const fApp = at('app');
  const fFam = at('precios');
  const fLetra = at('letra');
  const fBueno = at('bueno');
  const fMalo = at('malo');
  const fSiete = at('siete');
  const sLogo = useSpring(lead - 6);
  const sInst = useSpring(fInst - 2, 14, 190);
  // La portada (carrusel limpio desde Lady Mayfield) mientras suena la pregunta; luego, lo que se nombra.
  const s0: Shot = { rec: '00_inicio_top', at: 0, start: 8.6, hold: 23 };
  const s1: Shot = { rec: '01_inicio_scroll', at: fCat - 6, start: 5.6, hold: 7.9 };
  s1.marks = [markOn(s1, fCat + 2, fApp - 4, 10, 190, 654, 300, 24)];
  const s2: Shot = { rec: '14_reproductor', at: fApp - 5, start: 14.0, hold: 20 };
  const s3: Shot = { rec: '08_suscripcion', at: fFam - 6, start: 12.0, hold: 19.5 };
  s3.marks = [markOn(s3, fFam + 2, fLetra - 4, 14, 226, 636, 80, 18)];
  const s4: Shot = { rec: '08_suscripcion', at: fLetra - 5, start: 22.0, hold: 32 };
  s4.marks = [markOn(s4, fLetra + 4, fBueno - 4, 18, 150, 628, 186, 20)];
  const s5: Shot = { rec: '16_lectura', at: fBueno - 6, start: 1.5, hold: 8 };
  const s6: Shot = { rec: '08_suscripcion', at: fSiete - 8, start: 12.0, hold: 19.5 };
  s6.marks = [markOn(s6, fSiete, dur + 20, 14, 226, 636, 80, 18)];
  const shots = [s0, s1, s2, s3, s4, s5, s6];
  const cx = 1425;
  const top = Math.round((1080 - PH.H) / 2);
  const cam = buildPhoneCam({
    dur, side: -1, cx, top, enter: 'spin', exit: 'none',
    focus: [
      { from: fCat + 4, to: fApp - 6, y: 380, s: 1.3 },
      { from: fFam + 4, to: fLetra - 6, y: 230, s: 1.7 },
      { from: fLetra + 4, to: fBueno - 8, y: 250, s: 1.7 },
      { from: fSiete + 2, to: dur, y: 230, s: 1.7 },
    ],
  });
  return (
    <StrStage>
      <AbsoluteFill>
        <PhoneHalo cam={cam} cx={cx} />
        <div style={{ position: 'absolute', top, left: cx - PH.W / 2 }}>
          <AppPhone shots={shots} w={PHONE_W} cam={cam} dim={0.72} motionBlur float={[30, dur]} />
        </div>
        <div style={{ position: 'absolute', left: 150, top: 0, height: 1080, width: 980, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginBottom: 30 }}>
            <div style={{ opacity: sLogo, transform: `translateY(${((1 - sLogo) * 24).toFixed(2)}px)` }}>
              <StorytelLogo width={300} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 22px 10px 12px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.soft,
              fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: color.ink, opacity: sInst, transform: `translateX(${((1 - sInst) * -24).toFixed(2)}px) scale(${(0.85 + 0.15 * sInst).toFixed(4)})`, transformOrigin: 'left center' }}>
              <CheckIcon size={38} /> Instalada y probada a fondo
            </div>
          </div>
          <MaskTitle text="¿Merece la pena Storytel?" hi="Storytel" at={lead - 2} size={118} stagger={4} />
          <div style={{ display: 'flex', gap: 14, marginTop: 50, minHeight: 74 }}>
            <Chip at={fCat - 3} dimAt={fApp - 3} label="Catálogo" icon={<BookIcon size={26} />} size={30} reserve />
            <Chip at={fApp - 3} dimAt={fFam - 3} label="La app" icon={<PhoneIcon size={26} />} size={30} reserve />
            <Chip at={fFam - 3} dimAt={fLetra - 3} label="Precios" icon={<CardIcon size={26} />} size={30} reserve />
            <Chip at={fLetra - 3} dimAt={fBueno - 3} label="Letra pequeña" icon={<DocIcon size={26} />} size={30} reserve />
          </div>
          <div style={{ display: 'flex', gap: 18, marginTop: 24, minHeight: 86 }}>
            <Chip at={fBueno - 3} label="Lo bueno" icon={<CheckIcon size={36} c={color.green} />} accent="#E3F5EA" size={42} reserve />
            <Chip at={fMalo - 3} label="Lo malo" icon={<CrossIcon size={36} />} accent="#FDECEC" size={42} reserve />
            <Chip at={fSiete - 3} label="7 días gratis" size={42} dark reserve />
          </div>
        </div>
      </AbsoluteFill>
      {/* El móvil entra girando (0 → 34): el barrido grave culmina a mitad de giro. */}
      <Sfx name="whoosh_deep" at={17} />
      <Sfx name="snap_in" at={fInst} volume={0.7} />
      {[fCat, fApp, fFam, fLetra].map((f) => <Sfx key={f} name="ui_pop" at={f - 2} volume={0.7} />)}
      {zoomPeaks(cam, 36, dur - 2).map((f) => <Sfx key={`z${f}`} name="zoom_in" at={f} volume={0.4} />)}
      <Sfx name="ui_pop" at={fBueno - 2} />
      <Sfx name="ui_pop" at={fMalo - 2} />
      <Sfx name="sparkle" at={fSiete - 2} />
    </StrStage>
  );
};

// Símbolo ∞ que se dibuja (el de «Unlimited» en el alta de Storytel), con un brillo que lo recorre.
const InfinityDraw: React.FC<{ at: number; w: number; c?: string; stroke?: number }> = ({ at, w, c = ST, stroke = 26 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 30], [0, 1], { ...clamp, easing: easeInOut });
  const glow = interpolate(frame, [at + 24, at + 40, at + 60], [0, 1, 0.35], clamp);
  const L = 1060; // largo aproximado del trazo
  const h = w * 0.5;
  const d = 'M200 100 C 260 20, 380 20, 380 100 C 380 180, 260 180, 200 100 C 140 20, 20 20, 20 100 C 20 180, 140 180, 200 100 Z';
  return (
    <svg width={w} height={h} viewBox="0 0 400 200" style={{ overflow: 'visible', filter: `drop-shadow(0 ${(8 + 10 * glow).toFixed(1)}px ${(18 + 26 * glow).toFixed(1)}px rgba(255,80,28,${(0.18 + 0.25 * glow).toFixed(3)}))` }}>
      <path d={d} fill="none" stroke={ST_SOFT} strokeWidth={stroke} strokeLinecap="round" />
      <path d={d} fill="none" stroke={c} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} />
    </svg>
  );
};

// A02 · Qué es: el logotipo, «audiolibros y ebooks» y el viaje Estocolmo → España (2017); luego «Escucha y lee sin límite
// de horas» con el ∞ que se dibuja y, al final, «650.000» títulos con el sello «Solo en Storytel». El móvil acompaña.
export const A02Que: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('A02', w, n);
  const fSueca = at('sueca');
  const fAud = at('audiolibros');
  const fEbooks = at('ebooks');
  const fEspana = at('espana');
  const fDos = at('dos');
  const fCuota = at('cuota');
  const fEscuchas = at('escuchas');
  const fLees = at('lees');
  const fLimite = at('limite');
  const fMas = at('mas');
  const fSeis = at('seiscientos');
  const fSeries = at('series');
  const fAqui = at('aqui');
  const A = usePhase(-10, fCuota - 8);
  const B = usePhase(fCuota - 8, fMas - 6);
  const C = usePhase(fMas - 6, dur + 20);
  const sLogo = useSpring(2);
  const sCard = useSpring(fSueca - 10, 16, 150);
  const sSe = useSpring(fSueca - 4, 13, 180);
  const sEs = useSpring(fEspana + 2, 12, 190);
  const trip = interpolate(frame, [fEspana - 18, fEspana + 4], [0, 1], { ...clamp, easing: easeInOut });
  const ring = interpolate(frame, [fEspana + 2, fEspana + 26], [0, 1], { ...clamp, easing: easeOut });
  const P0 = [196, 112], P1 = [450, -46], P2 = [704, 112];
  const bez = (t: number) => [
    (1 - t) ** 2 * P0[0] + 2 * (1 - t) * t * P1[0] + t * t * P2[0],
    (1 - t) ** 2 * P0[1] + 2 * (1 - t) * t * P1[1] + t * t * P2[1],
  ];
  const [dx, dy] = bez(trip);
  const ARC = 620;
  const sCuota = useSpring(fCuota - 2, 13, 190);
  const sEsc = useSpring(fEscuchas - 2, 13, 190);
  const sLees = useSpring(fLees - 2, 13, 190);
  const sNum = useSpring(fSeis - 8, 13, 150);
  const under = interpolate(frame, [fSeis + 30, fSeis + 46], [0, 1], { ...clamp, easing: easeOut });
  const sTit = useSpring(fSeis + 30, 16, 160);
  const stampP = interpolate(frame, [fSeries - 6, fSeries + 2], [0, 1], { ...clamp, easing: (t) => t * t * t });
  const sSello = spring({ frame: frame - (fSeries - 2), fps, config: { damping: 10, stiffness: 210 } });
  const stampRing = interpolate(frame, [fSeries + 2, fSeries + 22], [0, 1], { ...clamp, easing: easeOut });
  // Móvil: la portada; con «series que solo están aquí», la sección «Solo en Storytel» de la portada.
  const s0: Shot = { rec: '00_inicio_top', at: 0, start: 12.0, hold: 23 };
  const s1: Shot = { rec: '01_inicio_scroll', at: fSeries - 8, start: 28.6, hold: 31 };
  s1.marks = [markOn(s1, fSeries + 2, dur + 20, 10, 210, 644, 560, 26)];
  const cx = 1425;
  const top = Math.round((1080 - PH.H) / 2);
  const cam = buildPhoneCam({ dur, side: -1, cx, top, enter: 'rise', exit: 'none', focus: [{ from: fSeries + 4, to: dur, y: 500, s: 1.28 }] });
  const fmt = (s: number, k = 0) => ({ opacity: s, transform: `translateY(${((1 - s) * (24 + k)).toFixed(2)}px) scale(${(0.86 + 0.14 * s).toFixed(4)})` });
  return (
    <StrStage>
      <PhoneHalo cam={cam} cx={cx} />
      <div style={{ position: 'absolute', top, left: cx - PH.W / 2 }}>
        <AppPhone shots={[s0, s1]} w={PHONE_W} cam={cam} dim={0.72} motionBlur float={[0, dur]} />
      </div>
      {A.visible && (
        <div style={{ position: 'absolute', left: 130, top: 0, height: 1080, width: 1020, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...A.style }}>
          <div style={{ opacity: sLogo, transform: `translateY(${((1 - sLogo) * 24).toFixed(2)}px)` }}>
            <StorytelLogo width={460} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 40, minHeight: 92 }}>
            <Chip at={fAud - 3} label="Audiolibros" icon={<HeadphonesIcon size={36} />} size={44} reserve />
            <Chip at={fEbooks - 3} label="Ebooks" icon={<BookIcon size={36} />} size={44} reserve />
          </div>
          {/* Estocolmo → España */}
          <div style={{ position: 'relative', width: 900, height: 250, marginTop: 40, borderRadius: 40, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card,
            opacity: sCard, transform: `translateY(${((1 - sCard) * 40).toFixed(2)}px) scale(${(0.94 + 0.06 * sCard).toFixed(4)})`, transformOrigin: 'left center' }}>
            <svg width="900" height="250" viewBox="0 0 900 250" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
              <path d={`M${P0[0]} ${P0[1]} Q ${P1[0]} ${P1[1]} ${P2[0]} ${P2[1]}`} fill="none" stroke="#F5DDD4" strokeWidth={5} strokeLinecap="round" strokeDasharray="2 14" opacity={sCard} />
              <path d={`M${P0[0]} ${P0[1]} Q ${P1[0]} ${P1[1]} ${P2[0]} ${P2[1]}`} fill="none" stroke={ST} strokeWidth={6} strokeLinecap="round" strokeDasharray={`${ARC}`} strokeDashoffset={ARC * (1 - trip)} />
              {trip > 0 && trip < 1 && <circle cx={dx} cy={dy} r={26} fill={ST} opacity={0.2} />}
              {trip > 0 && <circle cx={dx} cy={dy} r={11} fill={ST_DEEP} stroke="#fff" strokeWidth={4} />}
              {ring > 0 && ring < 1 && <circle cx={P2[0]} cy={P2[1]} r={20 + 70 * ring} fill="none" stroke={ST} strokeWidth={5 * (1 - ring) + 0.5} opacity={0.8 * (1 - ring)} />}
            </svg>
            <div style={{ position: 'absolute', left: 60, top: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: 270, ...fmt(sSe, 2) }}>
              <FlagSE w={100} />
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink }}>Estocolmo</div>
            </div>
            <div style={{ position: 'absolute', left: 570, top: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: 270, ...fmt(sEs, 2) }}>
              <FlagES w={100} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink }}>
                España
                {frame >= fDos - 8 && (
                  <span style={{ padding: '6px 16px', borderRadius: 999, background: color.yellow, fontSize: 34 }}>
                    <Odometer text="2017" at={fDos - 8} size={34} dur={26} stagger={2} spins={0} />
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {B.visible && (
        <div style={{ position: 'absolute', left: 130, top: 0, height: 1080, width: 1100, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...B.style }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 34, alignSelf: 'flex-start', padding: '12px 26px 12px 14px', borderRadius: 999, background: color.ink, color: '#fff',
            fontFamily: font.sans, fontWeight: 700, fontSize: 36, opacity: sCuota, transform: `translateY(${((1 - sCuota) * 20).toFixed(2)}px) scale(${(0.86 + 0.14 * sCuota).toFixed(4)})`, transformOrigin: 'left center' }}>
            <span style={{ width: 52, height: 52, borderRadius: '50%', background: ST, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><CalendarIcon size={30} c="#fff" /></span>
            Una sola cuota
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, fontFamily: font.sans, fontWeight: 700, fontSize: 104, letterSpacing: -3.5, color: color.ink, lineHeight: 1.05 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 18, ...fmt(sEsc, 20) }}><HeadphonesIcon size={92} c={ST} /> Escucha</span>
            <span style={{ ...fmt(sLees, 20) }}>y lee</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 34, marginTop: 26 }}>
            <MaskTitle text="sin límite de horas" hi="límite" at={fLimite - 6} size={104} />
          </div>
          <div style={{ marginTop: 36, marginLeft: 6 }}>
            {frame >= fLimite - 2 && <InfinityDraw at={fLimite} w={330} />}
          </div>
        </div>
      )}
      {C.visible && (
        <div style={{ position: 'absolute', left: 130, top: 0, height: 1080, width: 1100, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...C.style }}>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 52, color: color.ink2, opacity: sNum }}>Más de</div>
          <div style={{ position: 'relative', alignSelf: 'flex-start', marginTop: 6, fontFamily: font.sans, fontWeight: 700, color: color.ink, ...fmt(sNum, 30) }}>
            <Odometer text="650.000" at={fSeis - 6} size={210} dur={40} stagger={3} style={{ letterSpacing: -9 }} />
            <div style={{ position: 'absolute', left: 6, right: 6, bottom: -18, height: 16, borderRadius: 8, background: ST, transform: `scaleX(${under.toFixed(4)})`, transformOrigin: 'left center' }} />
          </div>
          <div style={{ marginTop: 40, fontFamily: font.sans, fontWeight: 700, fontSize: 56, color: color.ink2, opacity: sTit, transform: `translateX(${((1 - sTit) * -24).toFixed(2)}px)` }}>
            títulos en audio y ebook
          </div>
          <div style={{ position: 'relative', marginTop: 48, alignSelf: 'flex-start' }}>
            {stampRing > 0 && stampRing < 1 && (
              <div style={{ position: 'absolute', inset: -10, borderRadius: 999, border: `${(6 * (1 - stampRing) + 1).toFixed(2)}px solid ${color.ink}`, opacity: 0.35 * (1 - stampRing), transform: `scale(${1 + 0.35 * stampRing})` }} />
            )}
            {frame >= fSeries - 6 && (
              <div style={{ opacity: Math.min(1, stampP * 2), transform: `scale(${(frame < fSeries + 2 ? 1.9 - 0.9 * stampP : 0.94 + 0.06 * sSello).toFixed(4)}) rotate(${(-12 + 9 * Math.min(1, stampP)).toFixed(2)}deg)`, transformOrigin: 'left center',
                filter: `drop-shadow(0 ${(8 + 30 * (1 - stampP)).toFixed(1)}px ${(16 + 30 * (1 - stampP)).toFixed(1)}px rgba(16,16,16,0.22))` }}>
                <SoloBadge size={64} />
              </div>
            )}
          </div>
        </div>
      )}
      <Sfx name="snap_in" at={fSueca} volume={0.7} />
      <Sfx name="ui_pop" at={fAud - 2} />
      <Sfx name="ui_pop" at={fEbooks - 2} />
      <Sfx name="whoosh_soft" at={fEspana - 7} volume={0.7} />
      <Sfx name="hit_soft" at={fEspana + 3} volume={0.6} />
      <ChangeTicks value={(f) => odometerShown('2017', fDos - 8, fps, f, 26, 2, 0)} from={fDos - 8} to={fDos + 30} volume={0.4} />
      <Sfx name="whoosh_soft" at={fCuota - 12} />
      <Sfx name="ui_pop" at={fCuota} volume={0.7} />
      <Sfx name="ui_pop" at={fEscuchas} volume={0.55} />
      <Sfx name="ui_pop" at={fLees} volume={0.55} />
      <Sfx name="draw" at={fLimite + 2} volume={0.55} dur={28} fade={8} />
      <Sfx name="whoosh_soft" at={fMas - 10} />
      <ChangeTicks value={(f) => odometerShown('650.000', fSeis - 6, fps, f, 40, 3)} from={fSeis - 6} to={fSeis + 50} volume={0.45} />
      <Sfx name="hit_soft" at={fSeis + 30} volume={0.6} />
      <Sfx name="stamp" at={fSeries + 2} volume={0.8} />
      {zoomPeaks(cam, 2, dur - 2).map((f) => <Sfx key={`z${f}`} name="zoom_in" at={f} volume={0.4} />)}
      <Sfx name="sparkle" at={fAqui} volume={0.5} />
    </StrStage>
  );
};

// Avatares de las cuentas del plan Family: cada uno con su color y, con «biblioteca», su pila de libros propia.
const Avatar: React.FC<{ c: string; s: number; book: number; size?: number }> = ({ c, s, book, size = 92 }) => (
  <div style={{ position: 'relative', width: size, height: size, opacity: Math.min(1, s * 1.4), transform: `translateY(${((1 - s) * 30).toFixed(2)}px) scale(${(0.6 + 0.4 * s).toFixed(4)})` }}>
    <div style={{ width: size, height: size, borderRadius: '50%', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 26px rgba(0,0,0,0.25)' }}>
      <UserIcon size={size * 0.56} c="#101010" sw={2.2} />
    </div>
    <div style={{ position: 'absolute', right: -10, bottom: -8, width: size * 0.5, height: size * 0.5, borderRadius: 14, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 8px 18px rgba(0,0,0,0.25)', opacity: book, transform: `scale(${(0.4 + 0.6 * book).toFixed(4)}) rotate(${((1 - book) * -30).toFixed(2)}deg)` }}>
      <BookIcon size={size * 0.32} />
    </div>
  </div>
);

// A03 · Planes: Unlimited (8,99 €, una cuenta, sin límite de horas) y Family (15,99 € con dos cuentas, que pasa a 20,99 € con
// tres; cada cuenta con su biblioteca). Abajo, lo que comparten: sin permanencia y 7 días gratis.
export const A03Planes: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('A03', w, n);
  const fUnl = at('unlimited');
  const fOcho = at('ocho');
  const fPersona = at('persona');
  const fFam = at('family');
  const fQuince = at('quince');
  const fDosC = at('cuentas');
  const fVeinte = at('veinte');
  const fTres = at('tres');
  const fBib = at('biblioteca');
  const fLos = at('los');
  const fPerm = at('permanencia');
  const fSiete = at('siete');
  const CW = 760;
  const GAP = 60;
  // Unlimited sola en el centro; al llegar Family, se aparta a la izquierda (muelle).
  const split = spring({ frame: frame - (fFam - 12), fps, config: { damping: 17, stiffness: 120 } });
  const sU = spring({ frame: frame - fUnl + 6, fps, config: { damping: 14, stiffness: 130 } });
  const sF = spring({ frame: frame - fFam + 6, fps, config: { damping: 14, stiffness: 130 } });
  const actU = interpolate(frame, [fUnl - 6, fUnl + 4, fFam - 8, fFam], [0, 1, 1, 0], clamp);
  const actF = interpolate(frame, [fFam - 6, fFam + 4, fLos - 8, fLos], [0, 1, 1, 0], clamp);
  const sTitle = interpolate(frame, [fUnl - 4, fUnl + 12], [0, 1], { ...clamp, easing: easeInOut });
  const sRow = (f: number) => spring({ frame: frame - f, fps, config: { damping: 14, stiffness: 190 } });
  // El selector de cuentas: con «veinte noventa y nueve» llega la tercera cuenta (el precio y las cuentas cambian a la vez).
  const sThird = spring({ frame: frame - (fVeinte - 8), fps, config: { damping: 12, stiffness: 200 } });
  const tresPulse = interpolate(frame, [fTres - 2, fTres + 4, fTres + 14], [0, 1, 0], clamp);
  const bookP = (k: number) => spring({ frame: frame - (fBib - 4 + k * 4), fps, config: { damping: 12, stiffness: 210 } });
  const plus = Math.max(interpolate(frame, [fVeinte - 4, fVeinte, fVeinte + 8], [0, 1, 0], clamp), tresPulse);
  const sPerm = spring({ frame: frame - fPerm + 2, fps, config: { damping: 14, stiffness: 180 } });
  const sSiete = spring({ frame: frame - fSiete + 2, fps, config: { damping: 12, stiffness: 200 } });
  const cxU = 960 + (-(CW + GAP) / 2) * split;
  const cxF = 960 + (CW + GAP) / 2;
  const cardBase: React.CSSProperties = { position: 'absolute', top: 236, width: CW, height: 520, borderRadius: 48, boxSizing: 'border-box', padding: '44px 52px', perspective: 2200 };
  const row = (f: number, icon: React.ReactNode, text: React.ReactNode, dark = false) => {
    const s = sRow(f);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: dark ? '#fff' : color.ink, opacity: s, transform: `translateX(${((1 - s) * -24).toFixed(2)}px)` }}>
        <span style={{ width: 60, height: 60, borderRadius: '50%', background: dark ? 'rgba(255,255,255,0.12)' : ST_SOFT, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</span>
        {text}
      </div>
    );
  };
  return (
    <StrStage>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 96, display: 'flex', justifyContent: 'center', opacity: 1 - 0.8 * sTitle, transform: `translateY(${(-50 * sTitle).toFixed(2)}px) scale(${(1 - 0.14 * sTitle).toFixed(4)})`, filter: sTitle > 0.05 ? `blur(${(sTitle * 2.4).toFixed(2)}px)` : undefined }}>
        <MaskTitle text="Dos planes" hi="planes" at={2} size={88} align="center" />
      </div>
      {/* Unlimited */}
      {frame >= fUnl - 8 && (
        <div style={{ ...cardBase, left: cxU - CW / 2, background: '#fff', border: `1px solid ${color.line}`,
          boxShadow: `0 0 0 ${(5 * actU).toFixed(2)}px ${color.yellow}, 0 ${(40 + 30 * actU).toFixed(1)}px ${(90 + 30 * actU).toFixed(1)}px rgba(16,16,16,${(0.12 + 0.06 * actU).toFixed(3)}), 0 8px 24px rgba(16,16,16,0.06)`,
          opacity: Math.min(1, sU * 1.4), transform: `translateY(${((1 - sU) * 110 - 16 * actU).toFixed(2)}px) rotateX(${((1 - sU) * 50).toFixed(2)}deg) scale(${((0.92 + 0.08 * sU) * (1 + 0.025 * actU)).toFixed(4)})`, transformOrigin: '50% 100%' }}>
          <Sheen at={fUnl + 4} radius={48} tint="rgba(255,80,28,0.22)" />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 60, letterSpacing: -1.6, color: color.ink }}>Unlimited</div>
            <div style={{ width: 92, height: 92, borderRadius: 18, background: ST_PINK, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><InfinityIcon size={64} c="#101010" sw={2.6} /></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 10, fontFamily: font.sans, fontWeight: 700, color: color.ink }}>
            <Odometer text="8,99" at={fOcho - 8} size={150} style={{ letterSpacing: -6 }} />
            <span style={{ fontSize: 62, opacity: interpolate(frame, [fOcho + 2, fOcho + 12], [0, 1], clamp) }}>€</span>
            <span style={{ fontSize: 32, fontWeight: 500, color: color.muted, opacity: interpolate(frame, [fOcho + 6, fOcho + 16], [0, 1], clamp) }}>al mes</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 34 }}>
            {row(fPersona - 4, <UserIcon size={36} />, '1 cuenta, para una persona')}
            {row(fPersona + 8, <InfinityIcon size={36} c={ST_DEEP} />, 'Sin límite de horas')}
          </div>
        </div>
      )}
      {/* Family */}
      {frame >= fFam - 8 && (
        <div style={{ ...cardBase, left: cxF - CW / 2 + (1 - sF) * 140, background: color.ink, color: '#fff',
          boxShadow: `0 0 0 ${(5 * actF).toFixed(2)}px ${color.yellow}, 0 ${(40 + 30 * actF).toFixed(1)}px ${(90 + 30 * actF).toFixed(1)}px rgba(16,16,16,${(0.2 + 0.08 * actF).toFixed(3)})`,
          opacity: Math.min(1, sF * 1.4), transform: `translateY(${((1 - sF) * 110 - 16 * actF).toFixed(2)}px) rotateX(${((1 - sF) * 50).toFixed(2)}deg) scale(${((0.92 + 0.08 * sF) * (1 + 0.025 * actF)).toFixed(4)})`, transformOrigin: '50% 100%' }}>
          <Sheen at={fFam + 4} radius={48} tint="rgba(255,80,28,0.30)" />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 60, letterSpacing: -1.6 }}>Family</div>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 26, padding: '9px 18px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', color: '#fff' }}>Cuentas separadas</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 10, fontFamily: font.sans, fontWeight: 700, color: ST }}>
            {frame < fVeinte - 6
              ? <Odometer text="15,99" at={fQuince - 8} size={150} color={ST} style={{ letterSpacing: -6 }} />
              : <PriceRoll a="15,99" b="20,99" at={fVeinte - 6} size={150} color={ST} style={{ letterSpacing: -6 }} />}
            <span style={{ fontSize: 62, opacity: interpolate(frame, [fQuince + 2, fQuince + 12], [0, 1], clamp) }}>€</span>
            <span style={{ fontSize: 32, fontWeight: 500, color: 'rgba(255,255,255,0.6)', opacity: interpolate(frame, [fQuince + 6, fQuince + 16], [0, 1], clamp) }}>al mes</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 26, marginTop: 30, height: 110 }}>
            <Avatar c={ST} s={sRow(fDosC - 8)} book={bookP(0)} />
            <Avatar c={ST_PINK} s={sRow(fDosC - 4)} book={bookP(1)} />
            {frame >= fVeinte - 10 && <Avatar c={color.yellow} s={sThird} book={bookP(2)} />}
            <div style={{ marginLeft: 10, fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: '#fff', opacity: sRow(fDosC - 2), transform: `scale(${(1 + 0.12 * plus).toFixed(4)})`, transformOrigin: 'left center' }}>
              {frame < fVeinte - 4 ? '2 cuentas' : '3 cuentas'}
            </div>
          </div>
          <div style={{ marginTop: 24 }}>
            {row(fBib - 6, <BookIcon size={34} c="#fff" />, 'Cada una, con su biblioteca', true)}
          </div>
        </div>
      )}
      {/* Lo que comparten */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 812, display: 'flex', justifyContent: 'center', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 30px 16px 18px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.float,
          fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink, opacity: sPerm, transform: `translateY(${((1 - sPerm) * 40).toFixed(2)}px) scale(${(0.85 + 0.15 * sPerm).toFixed(4)})` }}>
          <CheckIcon size={44} /> Sin permanencia
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 30px 16px 18px', borderRadius: 999, background: ST, color: '#fff', boxShadow: '0 24px 60px rgba(255,80,28,0.35)',
          fontFamily: font.sans, fontWeight: 700, fontSize: 38, opacity: sSiete, transform: `translateY(${((1 - sSiete) * 40).toFixed(2)}px) scale(${(0.85 + 0.15 * sSiete).toFixed(4)})` }}>
          <CalendarIcon size={44} c="#fff" /> 7 días gratis
        </div>
      </div>
      <Sfx name="card_flip" at={fUnl + 2} />
      <ChangeTicks value={(f) => odometerShown('8,99', fOcho - 8, fps, f)} from={fOcho - 8} to={fOcho + 32} volume={0.5} />
      <Sfx name="ui_pop" at={fPersona - 3} volume={0.6} />
      <Sfx name="ui_pop" at={fPersona + 9} volume={0.5} />
      <Sfx name="swipe" at={fFam - 6} volume={0.5} />
      <Sfx name="card_flip" at={fFam + 2} />
      <ChangeTicks value={(f) => odometerShown('15,99', fQuince - 8, fps, f)} from={fQuince - 8} to={fQuince + 32} volume={0.5} />
      <Sfx name="ui_pop" at={fDosC - 7} volume={0.6} />
      <Sfx name="ui_pop" at={fDosC - 3} volume={0.6} />
      <ChangeTicks value={(f) => priceRollShown('15,99', '20,99', fVeinte - 6, fps, f)} from={fVeinte - 6} to={fVeinte + 30} volume={0.55} />
      <Sfx name="snap_in" at={fVeinte - 6} volume={0.7} />
      <Sfx name="tick_soft" at={fTres} volume={0.6} />
      {[0, 1, 2].map((k) => <Sfx key={`b${k}`} name="tick_soft" at={fBib - 2 + k * 4} volume={0.7} />)}
      <Sfx name="ui_pop" at={fPerm} volume={0.7} />
      <Sfx name="sparkle" at={fSiete} volume={0.7} />
    </StrStage>
  );
};
