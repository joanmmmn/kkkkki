import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Stage } from '../../components/Stage';
import { ChangeTicks, Sfx } from '../../components/Sfx';
import { CheckIcon, CrossIcon, HeadphonesIcon, MicIcon } from '../../components/Icons';
import { CalendarIcon, ClockIcon, DocIcon, LockIcon } from '../../components/Icons2';
import { wf } from './timeline';
import type { SceneProps } from './registry';
import { AppPhone, buildPhoneCam, Chip, MaskTitle, Odometer, odometerShown, PdrStage, PH, PhoneHalo, PHONE_W, PodimoLogo, PV, PV_DEEP, PV_SOFT, SegBar, segFrames, Sheen, Shot, SoloBadge, zoomPeaks } from './kit';

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

// Banderas sencillas (Dinamarca y España) para «app danesa que llegó a España».
const FlagDK: React.FC<{ w?: number }> = ({ w = 64 }) => (
  <svg width={w} height={w * 0.72} viewBox="0 0 37 28" style={{ borderRadius: 6, boxShadow: '0 0 0 1px rgba(0,0,0,0.08)' }}>
    <rect width="37" height="28" fill="#C8102E" /><rect x="12" width="4" height="28" fill="#fff" /><rect y="12" width="37" height="4" fill="#fff" />
  </svg>
);
const FlagES: React.FC<{ w?: number }> = ({ w = 64 }) => (
  <svg width={w} height={w * 0.72} viewBox="0 0 36 26" style={{ borderRadius: 6, boxShadow: '0 0 0 1px rgba(0,0,0,0.08)' }}>
    <rect width="36" height="26" fill="#C60B1E" /><rect y="6.5" width="36" height="13" fill="#FFC400" />
  </svg>
);

// K01 · Gancho: el móvil entra girando con la app real y enseña lo que nombra la voz; a la izquierda, la pregunta.
export const K01Hook: React.FC<P> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('K01', w, n);
  const fInst = at('instalado');
  const fPod = at('podcasts');
  const fAud = at('audiolibros');
  const fLetra = at('letra');
  const fBueno = at('bueno');
  const fMalo = at('malo');
  const fFinal = at('final');
  const fGratis = at('treinta');
  const sLogo = useSpring(lead - 6);
  const sInst = useSpring(fInst - 2, 14, 190);
  // La portada (arriba del todo) mientras suena la pregunta; luego, lo que se nombra.
  const shots: Shot[] = [
    { rec: '15_inicio_top', at: 0, start: 3.0, hold: 15 },
    { rec: '04_inicio', at: fPod - 6, start: 12.3, hold: 14.0, marks: [{ from: 10, to: fAud - fPod, x: 22, y: 548, w: 470, h: 440, r: 26 }] },
    { rec: '16_audiolibros', at: fAud - 5, start: 12.6, hold: 16.0, marks: [{ from: 6, to: fLetra - fAud, x: 8, y: 372, w: 656, h: 300, r: 22 }] },
    { rec: '13_membresia', at: fLetra - 5, start: 1.2, hold: 26, marks: [{ from: 8, to: fBueno - fLetra, x: 22, y: 438, w: 620, h: 196, r: 20 }] },
    { rec: '11_podcast', at: fBueno - 6, start: 16.4, hold: 31 },
    { rec: '08_reproductor', at: fFinal - 6, start: 18.6, hold: 40, marks: [{ from: 8, to: dur + 20, x: 92, y: 58, w: 196, h: 68, r: 34 }] },
  ];
  const cx = 1425;
  const top = Math.round((1080 - PH.H) / 2);
  const cam = buildPhoneCam({
    dur, side: -1, cx, top, enter: 'spin', exit: 'none',
    focus: [
      { from: fPod + 4, to: fAud - 6, y: 760, s: 1.22 },
      { from: fAud + 4, to: fLetra - 6, y: 520, s: 1.3 },
      { from: fLetra + 4, to: fBueno - 8, y: 536, s: 1.36 },
      { from: fFinal + 4, to: dur, y: 150, s: 1.32 },
    ],
  });
  return (
    <PdrStage>
      <AbsoluteFill>
        <PhoneHalo cam={cam} cx={cx} />
        <div style={{ position: 'absolute', top, left: cx - PH.W / 2 }}>
          <AppPhone shots={shots} w={PHONE_W} cam={cam} dim={0.72} motionBlur float={[30, dur]} />
        </div>
        <div style={{ position: 'absolute', left: 150, top: 0, height: 1080, width: 960, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 26, marginBottom: 30 }}>
            <div style={{ opacity: sLogo, transform: `translateY(${(1 - sLogo) * 24}px)` }}>
              <PodimoLogo width={250} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 22px 10px 12px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.soft,
              fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: color.ink, opacity: sInst, transform: `translateX(${(1 - sInst) * -24}px) scale(${0.85 + 0.15 * sInst})`, transformOrigin: 'left center' }}>
              <CheckIcon size={38} /> Instalada y probada a fondo
            </div>
          </div>
          <MaskTitle text="¿Merece la pena Podimo?" hi="Podimo?" at={lead - 2} size={122} stagger={4} />
          <div style={{ display: 'flex', gap: 16, marginTop: 52, minHeight: 74 }}>
            <Chip at={fPod - 3} dimAt={fAud - 3} label="Pódcasts exclusivos" icon={<MicIcon size={26} />} size={30} reserve />
            <Chip at={fAud - 3} dimAt={fLetra - 3} label="Audiolibros" icon={<HeadphonesIcon size={26} />} size={30} reserve />
            <Chip at={fLetra - 3} dimAt={fBueno - 3} label="Letra pequeña" icon={<DocIcon size={26} />} size={30} reserve />
          </div>
          <div style={{ display: 'flex', gap: 18, marginTop: 24, minHeight: 86 }}>
            <Chip at={fBueno - 3} label="Lo bueno" icon={<CheckIcon size={36} c={color.green} />} accent="#E3F5EA" size={42} reserve />
            <Chip at={fMalo - 3} label="Lo malo" icon={<CrossIcon size={36} />} accent="#FDECEC" size={42} reserve />
            <Chip at={fGratis - 3} label="30 días gratis" size={42} dark reserve />
          </div>
        </div>
      </AbsoluteFill>
      {/* El móvil entra girando (0 → 34): el barrido grave culmina a mitad de giro. */}
      <Sfx name="whoosh_deep" at={17} />
      <Sfx name="snap_in" at={fInst} volume={0.7} />
      <Sfx name="ui_pop" at={fPod - 2} volume={0.7} />
      <Sfx name="ui_pop" at={fAud - 2} volume={0.7} />
      <Sfx name="ui_pop" at={fLetra - 2} volume={0.7} />
      {zoomPeaks(cam, 36, dur - 2).map((f) => <Sfx key={`z${f}`} name="zoom_in" at={f} volume={0.4} />)}
      <Sfx name="ui_pop" at={fBueno - 2} />
      <Sfx name="ui_pop" at={fMalo - 2} />
      <Sfx name="sparkle" at={fGratis - 2} />
    </PdrStage>
  );
};

// K02 · Qué es (v2): el logotipo, «pódcasts y audiolibros» y el viaje Copenhague → España (un punto lila recorre el arco y
// deja la estela); luego «Pódcasts que solo están aquí» con el sello que cae como un tampón y, al final, «Miles» de
// audiolibros en español. El móvil acompaña con la app real.
export const K02Que: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('K02', w, n);
  const fDanesa = at('danesa');
  const fPod = at('podcasts');
  const fAud = at('audiolibros');
  const fEspana = at('espana');
  const fDos = at('dos');
  const fGancho = at('gancho');
  const fSello = at('sello');
  const fAdemas = at('ademas');
  const fMiles = at('miles');
  const A = usePhase(-10, fGancho - 6);
  const B = usePhase(fGancho - 6, fAdemas - 4);
  const C = usePhase(fAdemas - 4, dur + 20);
  const sLogo = useSpring(2);
  const sCard = useSpring(fDanesa - 10, 16, 150);
  const sDk = useSpring(fDanesa - 4, 13, 180);
  const sEs = useSpring(fEspana + 2, 12, 190);
  // Viaje: el arco se dibuja y el punto lo recorre (acelera y frena) justo antes de «España».
  const trip = interpolate(frame, [fEspana - 18, fEspana + 4], [0, 1], { ...clamp, easing: easeInOut });
  const ring = interpolate(frame, [fEspana + 2, fEspana + 26], [0, 1], { ...clamp, easing: easeOut });
  const P0 = [196, 112], P1 = [450, -46], P2 = [704, 112];
  const bez = (t: number) => [
    (1 - t) ** 2 * P0[0] + 2 * (1 - t) * t * P1[0] + t * t * P2[0],
    (1 - t) ** 2 * P0[1] + 2 * (1 - t) * t * P1[1] + t * t * P2[1],
  ];
  const [dx, dy] = bez(trip);
  const ARC = 620; // largo aproximado del arco (para el trazo)
  const sSello = spring({ frame: frame - (fSello - 2), fps, config: { damping: 10, stiffness: 210 } });
  const stampP = interpolate(frame, [fSello - 6, fSello + 2], [0, 1], { ...clamp, easing: (t) => t * t * t });
  const stampRing = interpolate(frame, [fSello + 2, fSello + 22], [0, 1], { ...clamp, easing: easeOut });
  const sMiles = useSpring(fMiles - 6, 13, 150);
  const under = interpolate(frame, [fMiles + 4, fMiles + 20], [0, 1], { ...clamp, easing: easeOut });
  const sEsp = useSpring(fMiles + 8, 16, 160);
  const shots: Shot[] = [
    { rec: '15_inicio_top', at: 0, start: 3.0, hold: 15 },
    { rec: '01_int_pod', at: fGancho - 6, start: 1.0, hold: 6, marks: [
      { from: fSello - fGancho + 2, to: fAdemas - fGancho + 6, x: 36, y: 308, w: 588, h: 292, r: 22 },
    ] },
    { rec: '02_int_aud', at: fAdemas - 6, start: 1.0, hold: 6 },
  ];
  const cx = 1425;
  const top = Math.round((1080 - PH.H) / 2);
  const cam = buildPhoneCam({ dur, side: -1, cx, top, enter: 'rise', exit: 'none', focus: [{ from: fSello, to: fAdemas - 2, y: 456, s: 1.3 }] });
  return (
    <PdrStage>
      <PhoneHalo cam={cam} cx={cx} />
      <div style={{ position: 'absolute', top, left: cx - PH.W / 2 }}>
        <AppPhone shots={shots} w={PHONE_W} cam={cam} dim={0.72} motionBlur float={[0, dur]} />
      </div>
      {A.visible && (
        <div style={{ position: 'absolute', left: 130, top: 0, height: 1080, width: 1020, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...A.style }}>
          <div style={{ opacity: sLogo, transform: `translateY(${((1 - sLogo) * 24).toFixed(2)}px)` }}>
            <PodimoLogo width={400} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 40, minHeight: 92 }}>
            <Chip at={fPod - 3} label="Pódcasts" icon={<MicIcon size={36} />} size={44} reserve />
            <Chip at={fAud - 3} label="Audiolibros" icon={<HeadphonesIcon size={36} />} size={44} reserve />
          </div>
          {/* Copenhague → España */}
          <div style={{ position: 'relative', width: 900, height: 250, marginTop: 40, borderRadius: 40, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card,
            opacity: sCard, transform: `translateY(${((1 - sCard) * 40).toFixed(2)}px) scale(${(0.94 + 0.06 * sCard).toFixed(4)})`, transformOrigin: 'left center' }}>
            <svg width="900" height="250" viewBox="0 0 900 250" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
              <path d={`M${P0[0]} ${P0[1]} Q ${P1[0]} ${P1[1]} ${P2[0]} ${P2[1]}`} fill="none" stroke="#E4E1F7" strokeWidth={5} strokeLinecap="round" strokeDasharray="2 14" opacity={sCard} />
              <path d={`M${P0[0]} ${P0[1]} Q ${P1[0]} ${P1[1]} ${P2[0]} ${P2[1]}`} fill="none" stroke={PV} strokeWidth={6} strokeLinecap="round" strokeDasharray={`${ARC}`} strokeDashoffset={ARC * (1 - trip)} />
              {trip > 0 && trip < 1 && <circle cx={dx} cy={dy} r={26} fill={PV} opacity={0.22} />}
              {trip > 0 && <circle cx={dx} cy={dy} r={11} fill={PV_DEEP} stroke="#fff" strokeWidth={4} />}
              {ring > 0 && ring < 1 && <circle cx={P2[0]} cy={P2[1]} r={20 + 70 * ring} fill="none" stroke={PV} strokeWidth={5 * (1 - ring) + 0.5} opacity={0.8 * (1 - ring)} />}
            </svg>
            <div style={{ position: 'absolute', left: 60, top: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: 270, marginLeft: -0,
              opacity: sDk, transform: `translateY(${((1 - sDk) * 26).toFixed(2)}px) scale(${(0.8 + 0.2 * sDk).toFixed(4)})` }}>
              <FlagDK w={100} />
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink }}>Copenhague</div>
            </div>
            <div style={{ position: 'absolute', left: 570, top: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: 270,
              opacity: sEs, transform: `translateY(${((1 - sEs) * 26).toFixed(2)}px) scale(${(0.8 + 0.2 * sEs).toFixed(4)})` }}>
              <FlagES w={100} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink }}>
                España
                {frame >= fDos - 8 && (
                  <span style={{ padding: '6px 16px', borderRadius: 999, background: color.yellow, fontSize: 34 }}>
                    <Odometer text="2020" at={fDos - 8} size={34} dur={26} stagger={2} spins={0} />
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {B.visible && (
        <div style={{ position: 'absolute', left: 130, top: 0, height: 1080, width: 1080, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...B.style }}>
          <MaskTitle text={'Pódcasts que solo\nestán aquí'} hi="solo" at={fGancho - 4} size={104} />
          <div style={{ position: 'relative', marginTop: 64, alignSelf: 'flex-start' }}>
            {stampRing > 0 && stampRing < 1 && (
              <div style={{ position: 'absolute', inset: -10, borderRadius: 999, border: `${(6 * (1 - stampRing) + 1).toFixed(2)}px solid ${color.ink}`, opacity: 0.35 * (1 - stampRing), transform: `scale(${1 + 0.35 * stampRing})` }} />
            )}
            <div style={{ opacity: Math.min(1, stampP * 2), transform: `scale(${(frame < fSello + 2 ? 1.9 - 0.9 * stampP : 0.94 + 0.06 * sSello).toFixed(4)}) rotate(${(-12 + 9 * Math.min(1, stampP)).toFixed(2)}deg)`, transformOrigin: 'left center',
              filter: `drop-shadow(0 ${(8 + 30 * (1 - stampP)).toFixed(1)}px ${(16 + 30 * (1 - stampP)).toFixed(1)}px rgba(16,16,16,0.22))` }}>
              <SoloBadge size={76} />
            </div>
          </div>
        </div>
      )}
      {C.visible && (
        <div style={{ position: 'absolute', left: 130, top: 0, height: 1080, width: 1080, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...C.style }}>
          <MaskTitle text="Y, además, audiolibros" hi="audiolibros" at={fAdemas - 2} size={100} />
          <div style={{ marginTop: 40, display: 'flex', alignItems: 'flex-end', gap: 30, fontFamily: font.sans, fontWeight: 700, color: color.ink }}>
            <div style={{ position: 'relative', opacity: sMiles, transform: `translateY(${((1 - sMiles) * 50).toFixed(2)}px) scale(${(0.86 + 0.14 * sMiles).toFixed(4)})`, transformOrigin: 'left bottom' }}>
              <span style={{ fontSize: 220, letterSpacing: -10, lineHeight: 0.86, display: 'block' }}>Miles</span>
              <div style={{ position: 'absolute', left: 6, right: 6, bottom: -22, height: 16, borderRadius: 8, background: PV, transform: `scaleX(${under.toFixed(4)})`, transformOrigin: 'left center' }} />
            </div>
            <div style={{ fontSize: 50, lineHeight: 1.1, color: color.ink2, paddingBottom: 8, opacity: sEsp, transform: `translateX(${((1 - sEsp) * -24).toFixed(2)}px)` }}>
              de audiolibros<br />en español
            </div>
          </div>
        </div>
      )}
      <Sfx name="ui_pop" at={fPod - 2} />
      <Sfx name="ui_pop" at={fAud - 2} />
      <Sfx name="snap_in" at={fDanesa} volume={0.7} />
      <Sfx name="whoosh_soft" at={fEspana - 7} volume={0.7} />
      <Sfx name="hit_soft" at={fEspana + 3} volume={0.6} />
      <ChangeTicks value={(f) => odometerShown('2020', fDos - 8, fps, f, 26, 2, 0)} from={fDos - 8} to={fDos + 30} volume={0.4} />
      <Sfx name="whoosh_soft" at={fGancho - 10} />
      <Sfx name="stamp" at={fSello + 2} volume={0.8} />
      {zoomPeaks(cam, 2, dur - 2).map((f) => <Sfx key={`z${f}`} name="zoom_in" at={f} volume={0.4} />)}
      <Sfx name="whoosh_soft" at={fAdemas - 8} />
      <Sfx name="hit_soft" at={fMiles - 2} volume={0.7} />
      <Sfx name="draw" at={fMiles + 4} volume={0.5} dur={18} fade={8} />
    </PdrStage>
  );
};

// K03 · Planes (v2): Premium entra sola en el centro y se aparta cuando llega Premium Plus; los precios giran como un
// contador mecánico, las horas se llenan en tramos de 10 h (2 frente a 10), el pago anual aparece dentro de cada tarjeta y,
// con Podimo Free, las dos de pago se desenfocan al fondo y la gratuita sube en primer plano.
export const K03Planes: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('K03', w, n);
  const fPrem = at('premium');
  const fCuatro = at('cuatro');
  const fVeinte = at('veinte');
  const fPods = at('podcasts');
  const fPlus = at('plus');
  const fNueve2 = at('nueve', 1);
  const fCien = at('cien');
  const fAno = at('ano');
  const fCuarenta = at('cuarenta');
  const fNov3 = at('noventa', 3);
  const fPagar = at('pagar');
  const fFree = at('free');
  const fAbiertos = at('abiertos');
  const CW = 700;
  const GAP = 56;
  const plans = [
    { name: 'Premium', price: '4,99', pAt: fCuatro - 8, hours: 20, segAt: fVeinte - 2, f: fPrem, year: '49,99', yAt: fCuarenta - 2, tag: 'El más popular', podsAt: fPods - 2 },
    { name: 'Premium Plus', price: '9,99', pAt: fNueve2 - 8, hours: 100, segAt: fCien - 4, f: fPlus - 4, year: '99,99', yAt: fNov3 - 2, tag: '', podsAt: fPlus + 14 },
  ];
  const winA = [[fPrem - 6, fPlus - 8], [fPlus - 8, fAno - 6]];
  const activeAt = (i: number) => interpolate(frame, [winA[i][0], winA[i][0] + 8, winA[i][1] - 6, winA[i][1]], [0, 1, 1, 0], clamp);
  // Premium sola en el centro; al llegar Plus, se aparta a la izquierda (muelle).
  const split = spring({ frame: frame - (fPlus - 12), fps, config: { damping: 17, stiffness: 120 } });
  // Podimo Free: las de pago se van al fondo (desenfoque) y la gratuita sube.
  const sFree = spring({ frame: frame - fPagar + 2, fps, config: { damping: 16, stiffness: 140 } });
  const back = interpolate(frame, [fPagar - 4, fPagar + 14], [0, 1], { ...clamp, easing: easeInOut });
  const freeAct = interpolate(frame, [fFree - 4, fFree + 6], [0, 1], clamp);
  const lockIn = spring({ frame: frame - fAbiertos + 2, fps, config: { damping: 12, stiffness: 200 } });
  const sTitle = interpolate(frame, [fPagar - 6, fPagar + 10], [0, 1], { ...clamp, easing: easeInOut });
  const yearLine = (p: (typeof plans)[number], hot: boolean) => {
    const sy = spring({ frame: frame - p.yAt, fps, config: { damping: 13, stiffness: 190 } });
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 20, height: 56, opacity: sy, transform: `translateY(${((1 - sy) * 14).toFixed(2)}px)` }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '10px 22px 10px 16px', borderRadius: 999, background: hot ? 'rgba(168,155,237,0.18)' : PV_SOFT,
          fontFamily: font.sans, fontWeight: 700, fontSize: 31, color: hot ? '#fff' : color.ink, transform: `scale(${(0.9 + 0.1 * sy).toFixed(4)})`, transformOrigin: 'left center' }}>
          <CalendarIcon size={34} c={hot ? PV : PV_DEEP} /> o <span style={{ color: hot ? PV : PV_DEEP }}>{p.year} €</span> al año
        </span>
      </div>
    );
  };
  return (
    <PdrStage>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 110, display: 'flex', justifyContent: 'center', opacity: 1 - 0.75 * sTitle, transform: `translateY(${(-60 * sTitle).toFixed(2)}px) scale(${(1 - 0.12 * sTitle).toFixed(4)})`, filter: sTitle > 0.05 ? `blur(${(sTitle * 2.4).toFixed(2)}px)` : undefined }}>
        <MaskTitle text="Dos planes" hi="planes" at={2} size={88} align="center" />
      </div>
      {plans.map((p, i) => {
        const hot = i === 1;
        const s = spring({ frame: frame - p.f + 6, fps, config: { damping: 14, stiffness: 130 } });
        if (frame < p.f - 8) return null;
        const act = activeAt(i);
        // Posición: Premium en el centro hasta que llega Plus; luego, cada una en su mitad.
        const cxSolo = 960;
        const cxPair = 960 + (i === 0 ? -1 : 1) * (CW + GAP) / 2;
        const cx = i === 0 ? cxSolo + (cxPair - cxSolo) * split : cxPair;
        const enterX = i === 1 ? (1 - s) * 140 : 0;
        const blur = back * 3.2;
        return (
          <div key={p.name} style={{ position: 'absolute', left: cx - CW / 2 + enterX, top: 300 - 112 * back, width: CW, perspective: 2200,
            transform: `scale(${(1 - 0.07 * back).toFixed(4)})`, transformOrigin: '50% 0%', filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined }}>
            <div style={{ position: 'relative', width: CW, padding: '44px 50px 34px', borderRadius: 48, background: hot ? color.ink : '#fff', color: hot ? '#fff' : color.ink,
              boxShadow: `0 0 0 ${(5 * act).toFixed(2)}px ${color.yellow}, 0 ${(40 + 30 * act).toFixed(1)}px ${(90 + 30 * act).toFixed(1)}px rgba(16,16,16,${(0.12 + 0.06 * act).toFixed(3)}), 0 8px 24px rgba(16,16,16,0.06)`,
              border: hot ? 'none' : `1px solid ${color.line}`, boxSizing: 'border-box', opacity: Math.min(1, s * 1.4),
              transform: `translateY(${((1 - s) * 110 - 16 * act).toFixed(2)}px) rotateX(${((1 - s) * 62).toFixed(2)}deg) scale(${((0.92 + 0.08 * s) * (1 + 0.03 * act)).toFixed(4)})`, transformOrigin: '50% 100%' }}>
              <Sheen at={p.f + 4} radius={48} tint={hot ? 'rgba(168,155,237,0.30)' : 'rgba(168,155,237,0.32)'} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 52, letterSpacing: -1.2 }}>{p.name}</div>
                {p.tag && <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 25, padding: '9px 18px', borderRadius: 999, background: PV_SOFT, color: PV_DEEP }}>{p.tag}</div>}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 14, fontFamily: font.sans, fontWeight: 700, color: hot ? PV : color.ink }}>
                <Odometer text={p.price} at={p.pAt} size={138} color={hot ? PV : color.ink} style={{ letterSpacing: -6 }} />
                <span style={{ fontSize: 58, letterSpacing: -1, opacity: interpolate(frame, [p.pAt + 10, p.pAt + 20], [0, 1], clamp) }}>€</span>
                <span style={{ fontSize: 31, fontWeight: 500, color: hot ? 'rgba(255,255,255,0.65)' : color.muted, opacity: interpolate(frame, [p.pAt + 14, p.pAt + 24], [0, 1], clamp) }}>al mes</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 26 }}>
                <ClockIcon size={48} c={hot ? '#fff' : color.ink} />
                <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 38, letterSpacing: -0.4 }}>{p.hours} h de audiolibros al mes</div>
              </div>
              <SegBar fill={p.hours / 10} at={p.segAt} every={i === 0 ? 5 : 3} h={20} gap={8} on={PV} off={hot ? 'rgba(255,255,255,0.14)' : '#EEEEF2'} style={{ marginTop: 18 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 24, paddingTop: 22, borderTop: `1px solid ${hot ? 'rgba(255,255,255,0.15)' : color.line}`,
                fontFamily: font.sans, fontWeight: 700, fontSize: 32, opacity: interpolate(frame, [p.podsAt, p.podsAt + 10], [0, 1], clamp), transform: `translateX(${(interpolate(frame, [p.podsAt, p.podsAt + 14], [-16, 0], { ...clamp, easing: easeOut })).toFixed(2)}px)` }}>
                <MicIcon size={36} c={hot ? '#fff' : color.ink} /> Todos sus pódcasts, sin anuncios
              </div>
              {yearLine(p, hot)}
            </div>
          </div>
        );
      })}
      {/* Podimo Free: en primer plano, abajo */}
      {frame >= fPagar - 6 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 742, display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 30, padding: '28px 44px', borderRadius: 40, background: '#fff', border: `1px solid ${color.line}`,
            boxShadow: `0 0 0 ${(5 * freeAct).toFixed(2)}px ${color.yellow}, 0 40px 90px rgba(16,16,16,0.16)`, opacity: sFree, transform: `translateY(${((1 - sFree) * 120).toFixed(2)}px) scale(${(0.9 + 0.1 * sFree).toFixed(4)})` }}>
            <Sheen at={fFree} radius={40} tint="rgba(255,202,5,0.35)" />
            <span style={{ padding: '10px 24px', borderRadius: 999, background: color.ink, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 36 }}>Podimo Free</span>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 84, letterSpacing: -3, color: color.ink, lineHeight: 1 }}>0 €</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink }}>Solo los pódcasts abiertos</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: font.sans, fontWeight: 500, fontSize: 30, color: color.muted, opacity: lockIn, transform: `translateX(${((1 - lockIn) * -18).toFixed(2)}px)`,
                maxHeight: `${(Math.min(1, lockIn) * 44).toFixed(1)}px`, marginTop: (Math.min(1, lockIn) - 1) * 8, overflow: 'hidden' }}>
                <LockIcon size={32} c={color.muted} /> Sin exclusivos ni audiolibros
              </span>
            </div>
          </div>
        </div>
      )}
      {/* Sonido: volteo al llegar cada tarjeta, tic por cada número que pasa por el contador, tic por tramo de horas,
          monedas con el pago anual, barrido y golpe con Free, cruz con «abiertos». */}
      <Sfx name="card_flip" at={plans[0].f + 2} />
      <Sfx name="card_flip" at={plans[1].f + 2} />
      <Sfx name="swipe" at={fPlus - 6} volume={0.5} />
      {plans.map((p) => (
        <ChangeTicks key={`o${p.name}`} value={(f) => odometerShown(p.price, p.pAt, fps, f)} from={p.pAt} to={p.pAt + 40} volume={0.5} />
      ))}
      {plans.map((p, i) => segFrames(p.hours / 10, p.segAt, i === 0 ? 5 : 3).map((f, k) => <Sfx key={`s${i}${k}`} name="tick_soft" at={f} volume={0.55 + 0.3 * (k / Math.max(1, p.hours / 10 - 1))} />))}
      <Sfx name="ui_pop" at={plans[0].podsAt + 2} volume={0.6} />
      <Sfx name="ui_pop" at={plans[1].podsAt + 2} volume={0.5} />
      <Sfx name="coins" at={plans[0].yAt + 4} volume={0.55} />
      <Sfx name="tick_soft" at={plans[1].yAt + 4} volume={0.8} />
      <Sfx name="whoosh_soft" at={fPagar + 2} volume={0.7} />
      <Sfx name="ui_pop" at={fFree - 2} />
      <Sfx name="cross" at={fAbiertos + 3} volume={0.55} />
    </PdrStage>
  );
};
