import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { ChangeTicks, Sfx } from '../../components/Sfx';
import { BookIcon, CheckIcon, CrossIcon, HeadphonesIcon, HeartIcon, MicIcon } from '../../components/Icons';
import { CardIcon, DocIcon, UserIcon } from '../../components/Icons2';
import { FlagES } from '../abc/Intro';
import { wf } from './timeline';
import type { SceneProps } from './registry';
import {
  AppPhone, BluePlay, buildPhoneCam, Chip, CookieIcon, Crown, Diamond, IV, IV_DEEP, IV_HOT, IV_INK, IV_SOFT, IvxLogo, IvxStage, markOn, MaskTitle, Odometer,
  odometerShown, PH, PhoneHalo, PHONE_W, PLUS, PLUS_DEEP, PLUS_SOFT, RadioIcon, Sheen, Shot, Tap, zoomPeaks,
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

// W01 · Gancho: el móvil entra girando con la app real y enseña lo que nombra la voz (pódcast, radio, audiolibros, el muro de
// cookies y, con «cuánto cuesta», el plan mensual de Premium); a la izquierda, la pregunta.
export const W01Hook: React.FC<P> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('W01', w, n);
  const fUsado = at('usado');
  const fPod = at('podcast');
  const fRadio = at('radio');
  const fAudio = at('audiolibros');
  const fLetra = at('letra');
  const fCookies = at('cookies');
  const fBueno = at('bueno');
  const fMalo = at('malo');
  const fCuanto = at('cuanto');
  const sLogo = useSpring(lead - 6);
  const sUsado = useSpring(fUsado - 2, 14, 190);
  const s0: Shot = { rec: 'inicio_top', at: 0, start: 3.0, hold: 10 }; // antes de 10,5 s (luego sale otro banner)
  const s1: Shot = { rec: 'originals', at: fPod - 6, start: 1.5, hold: 14 };
  const s2: Shot = { rec: 'radio_ser', at: fRadio - 6, start: 1.5, hold: 15 };
  s2.marks = [markOn(s2, fRadio + 2, fAudio - 6, 220, 990, 224, 92, 22)];
  const s3: Shot = { rec: 'audiolibros_2', at: fAudio - 6, start: 1.0, hold: 6 };
  // La letra pequeña: el muro que sale al rechazar las cookies (Premium, Plus o «Aceptar y acceder gratis»).
  const s4: Shot = { rec: 'web_muro', at: fLetra - 6, start: 3.0, hold: 18 };
  s4.marks = [markOn(s4, fCookies + 2, fCuanto - 8, 30, 220, 604, 800, 26)];
  const s5: Shot = { rec: 'web_premium', at: fCuanto - 6, start: 23.0, hold: 34 };
  s5.marks = [markOn(s5, fCuanto + 4, dur + 20, 22, 896, 620, 204, 26)];
  const shots = [s0, s1, s2, s3, s4, s5];
  const cx = 1425;
  const top = Math.round((1080 - PH.H) / 2);
  const cam = buildPhoneCam({
    dur, side: -1, cx, top, enter: 'spin', exit: 'none',
    focus: [
      { from: fRadio + 4, to: fAudio - 8, x: 120, y: 960, s: 1.2 },
      { from: fCookies + 4, to: fCuanto - 8, x: 120, y: 620, s: 1.12 },
      { from: fCuanto + 4, to: dur, x: 120, y: 990, s: 1.32 },
    ],
  });
  return (
    <IvxStage>
      <AbsoluteFill>
        <PhoneHalo cam={cam} cx={cx} />
        <div style={{ position: 'absolute', top, left: cx - PH.W / 2 }}>
          <AppPhone shots={shots} w={PHONE_W} cam={cam} dim={0.72} motionBlur float={[30, dur]} />
        </div>
        <div style={{ position: 'absolute', left: 150, top: 0, height: 1080, width: 1020, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ opacity: sLogo, transform: `translateY(${((1 - sLogo) * 24).toFixed(2)}px)`, marginBottom: 40 }}>
            <IvxLogo width={250} />
          </div>
          <MaskTitle text={'¿Merece la pena\npagar iVoox?'} hi="iVoox" at={lead - 2} size={112} stagger={4} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 30, minHeight: 72 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 24px 10px 12px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.soft,
              fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: color.ink, opacity: sUsado, transform: `translateX(${((1 - sUsado) * -24).toFixed(2)}px) scale(${(0.85 + 0.15 * sUsado).toFixed(4)})`, transformOrigin: 'left center' }}>
              <CheckIcon size={38} /> Usado a fondo
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 34, minHeight: 74 }}>
            <Chip at={fPod - 3} dimAt={fRadio - 3} label="Pódcast" icon={<MicIcon size={26} />} size={30} reserve />
            <Chip at={fRadio - 3} dimAt={fAudio - 3} label="Radio" icon={<RadioIcon size={26} />} size={30} reserve />
            <Chip at={fAudio - 3} dimAt={fLetra - 3} label="Audiolibros" icon={<BookIcon size={26} />} size={30} reserve />
            <Chip at={fLetra - 3} dimAt={fBueno - 3} label="Cookies" icon={<CookieIcon size={28} />} size={30} reserve />
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 22, minHeight: 80 }}>
            <Chip at={fBueno - 3} label="Lo bueno" icon={<CheckIcon size={32} c={color.green} />} accent="#E3F5EA" size={36} reserve />
            <Chip at={fMalo - 3} label="Lo malo" icon={<CrossIcon size={32} />} accent="#FDECEC" size={36} reserve />
            <Chip at={fCuanto - 3} label="Cuánto cuesta" size={36} dark reserve />
          </div>
        </div>
      </AbsoluteFill>
      {/* El móvil entra girando (0 → 34): el barrido grave culmina a mitad de giro. */}
      <Sfx name="whoosh_deep" at={17} />
      <Sfx name="snap_in" at={fUsado} volume={0.7} />
      {[fPod, fRadio, fAudio, fLetra].map((f) => <Sfx key={f} name="ui_pop" at={f - 2} volume={0.7} />)}
      {zoomPeaks(cam, 36, dur - 2).map((f) => <Sfx key={`z${f}`} name="zoom_in" at={f} volume={0.4} />)}
      <Sfx name="ui_pop" at={fBueno - 2} />
      <Sfx name="ui_pop" at={fMalo - 2} />
      <Sfx name="coins" at={fCuanto} volume={0.35} />
    </IvxStage>
  );
};

// W02 · Qué es: una plataforma española de pódcast (desde 2010; más de 5 millones de usuarios al mes, según la empresa) con pódcast,
// radio en directo y audiolibros; lo básico es gratis… con una condición.
export const W02Que: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('W02', w, n);
  const fPlat = at('plataforma');
  const fNacio = at('nacio');
  const fDos = at('dos');
  const fSegun = at('segun');
  const fCinco = at('cinco');
  const fUsuarios = at('usuarios');
  const fAdemas = at('ademas');
  const fPod = at('podcast', 1);
  const fRadio = at('radio');
  const fAudio = at('audiolibros');
  const fBasico = at('basico');
  const fGratis = at('gratis');
  const fCond = at('condicion');
  const A = usePhase(-10, fAdemas - 8);
  const B = usePhase(fAdemas - 8, fBasico - 8);
  const C = usePhase(fBasico - 8, dur + 20);
  const sLogo = useSpring(2);
  const sEs = useSpring(fPlat - 4, 13, 180);
  const sYear = useSpring(fNacio - 8, 15, 160);
  const sUsers = useSpring(fSegun - 6, 15, 160);
  const sEmp = useSpring(fSegun, 14, 180);
  const tile = (f: number) => spring({ frame: frame - f, fps, config: { damping: 13, stiffness: 170 } });
  const sFree = spring({ frame: frame - (fGratis - 4), fps, config: { damping: 10, stiffness: 190 } });
  const sCond = spring({ frame: frame - (fCond - 6), fps, config: { damping: 14, stiffness: 180 } });
  const star = interpolate(frame, [fCond - 2, fCond + 10], [0, 1], { ...clamp, easing: easeOut });
  // Móvil: la portada; con «radio», la pestaña de radios; con «audiolibros», su sección; con «gratis», la portada otra vez.
  const s0: Shot = { rec: 'inicio_top', at: 0, start: 4.0, hold: 10 };
  const s1: Shot = { rec: 'radios_tab', at: fRadio - 6, start: 1.0, hold: 8 };
  s1.marks = [markOn(s1, fRadio + 2, fAudio - 6, 24, 388, 616, 300, 22)];
  const s2: Shot = { rec: 'audiolibros_2', at: fAudio - 6, start: 1.0, hold: 6 };
  const s3: Shot = { rec: 'inicio_3', at: fBasico - 6, start: 3.0, hold: 30 };
  const cx = 1425;
  const top = Math.round((1080 - PH.H) / 2);
  const cam = buildPhoneCam({
    dur, side: -1, cx, top, enter: 'rise', exit: 'none',
    focus: [{ from: fRadio + 2, to: fAudio - 8, y: 540, s: 1.2 }],
  });
  const card = (s: number): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: 26, padding: '26px 38px', borderRadius: 34, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card,
    opacity: s, transform: `translateY(${((1 - s) * 34).toFixed(2)}px) scale(${(0.92 + 0.08 * s).toFixed(4)})`, transformOrigin: 'left center',
  });
  const items = [
    { f: fPod, label: 'Pódcast', icon: <MicIcon size={70} c={IV_DEEP} /> },
    { f: fRadio, label: 'Radio en directo', icon: <RadioIcon size={70} c={IV_DEEP} /> },
    { f: fAudio, label: 'Audiolibros', icon: <BookIcon size={70} c={IV_DEEP} /> },
  ];
  return (
    <IvxStage>
      <PhoneHalo cam={cam} cx={cx} />
      <div style={{ position: 'absolute', top, left: cx - PH.W / 2 }}>
        <AppPhone shots={[s0, s1, s2, s3]} w={PHONE_W} cam={cam} dim={0.72} motionBlur float={[0, dur]} />
      </div>
      {A.visible && (
        <div style={{ position: 'absolute', left: 130, top: 0, height: 1080, width: 1080, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...A.style }}>
          <div style={{ opacity: sLogo, transform: `translateY(${((1 - sLogo) * 24).toFixed(2)}px)` }}>
            <IvxLogo width={460} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 40, alignSelf: 'flex-start', padding: '14px 30px 14px 18px', borderRadius: 999, background: IV_INK, color: '#fff',
            fontFamily: font.sans, fontWeight: 700, fontSize: 40, opacity: sEs, transform: `translateY(${((1 - sEs) * 20).toFixed(2)}px) scale(${(0.86 + 0.14 * sEs).toFixed(4)})`, transformOrigin: 'left center' }}>
            <FlagES w={58} /> Plataforma española de <span style={{ color: IV_HOT }}>pódcast</span>
          </div>
          <div style={{ display: 'flex', gap: 24, marginTop: 40 }}>
            <div style={card(sYear)}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 32, color: color.ink2 }}>Desde</div>
                <div style={{ fontFamily: font.sans, fontWeight: 700, color: color.ink, height: 96 }}>
                  {frame >= fDos - 8 && <Odometer text="2010" at={fDos - 8} size={96} dur={28} stagger={2} spins={0} style={{ letterSpacing: -4 }} />}
                </div>
              </div>
            </div>
            <div style={card(sUsers)}>
              <UserIcon size={70} c={IV_DEEP} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, fontFamily: font.sans, fontWeight: 700, color: color.ink }}>
                  <span style={{ fontSize: 50, color: color.ink2 }}>+</span>
                  <span style={{ position: 'relative', display: 'inline-block' }}>
                    <Odometer text="5" at={fCinco - 6} size={96} dur={28} spins={1} style={{ letterSpacing: -4 }} />
                    {frame < fCinco - 7 && <Shimmer frame={frame} r={20} />}
                  </span>
                  <span style={{ fontSize: 44 }}>millones</span>
                </div>
                <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: IV_DEEP, opacity: interpolate(frame, [fUsuarios - 4, fUsuarios + 8], [0, 1], clamp) }}>de usuarios al mes</div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 22, fontFamily: font.sans, fontWeight: 500, fontSize: 26, color: color.muted, opacity: sEmp }}>Según la propia empresa (2025)</div>
        </div>
      )}
      {B.visible && (
        <div style={{ position: 'absolute', left: 130, top: 0, height: 1080, width: 1100, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 30, ...B.style }}>
          {items.map((it) => {
            const s = tile(it.f - 6);
            return (
              <div key={it.label} style={{ display: 'flex', alignItems: 'center', gap: 34, alignSelf: 'flex-start', padding: '26px 52px 26px 30px', borderRadius: 40, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card,
                opacity: s, transform: `translateX(${((1 - s) * -60).toFixed(2)}px) scale(${(0.9 + 0.1 * s).toFixed(4)})`, transformOrigin: 'left center' }}>
                <span style={{ width: 120, height: 120, borderRadius: 32, background: IV_SOFT, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{it.icon}</span>
                <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 72, letterSpacing: -2.5, color: color.ink }}>{it.label}</span>
              </div>
            );
          })}
        </div>
      )}
      {C.visible && (
        <div style={{ position: 'absolute', left: 130, top: 0, height: 1080, width: 1100, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...C.style }}>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 60, color: color.ink2, opacity: interpolate(frame, [fBasico - 8, fBasico + 4], [0, 1], clamp) }}>Lo básico es</div>
          <div style={{ position: 'relative', alignSelf: 'flex-start', fontFamily: font.sans, fontWeight: 700, fontSize: 230, letterSpacing: -11, lineHeight: 1, color: color.green,
            opacity: sFree, transform: `scale(${(0.6 + 0.4 * sFree).toFixed(4)}) rotate(${((1 - sFree) * -4).toFixed(2)}deg)`, transformOrigin: 'left center' }}>
            gratis
            <span style={{ position: 'absolute', right: -86, top: -10, fontSize: 200, color: IV, opacity: star, transform: `scale(${(0.4 + 0.6 * star).toFixed(4)}) rotate(${((1 - star) * 90).toFixed(2)}deg)` }}>*</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 34, alignSelf: 'flex-start', padding: '16px 34px 16px 22px', borderRadius: 999, background: IV_INK, color: '#fff',
            fontFamily: font.sans, fontWeight: 700, fontSize: 44, opacity: sCond, transform: `translateY(${((1 - sCond) * 30).toFixed(2)}px)` }}>
            <span style={{ color: IV, fontSize: 60, lineHeight: 0.6, marginTop: 14 }}>*</span> Con una condición…
          </div>
        </div>
      )}
      <Sfx name="snap_in" at={fPlat} volume={0.7} />
      <Sfx name="whoosh_soft" at={fNacio - 10} volume={0.6} />
      <ChangeTicks value={(f) => odometerShown('2010', fDos - 8, fps, f, 28, 2, 0)} from={fDos - 8} to={fDos + 30} volume={0.4} />
      <Sfx name="ui_pop" at={fSegun - 4} volume={0.6} />
      <ChangeTicks value={(f) => odometerShown('5', fCinco - 6, fps, f, 28, 3, 1)} from={fCinco - 6} to={fCinco + 30} volume={0.45} />
      <Sfx name="hit_soft" at={fUsuarios} volume={0.5} />
      <Sfx name="whoosh_soft" at={fAdemas - 10} />
      {items.map((it) => <Sfx key={it.label} name="snap_in" at={it.f - 2} volume={0.7} />)}
      {zoomPeaks(cam, 2, dur - 2).map((f) => <Sfx key={`z${f}`} name="zoom_in" at={f} volume={0.4} />)}
      <Sfx name="whoosh_soft" at={fBasico - 10} />
      <Sfx name="stamp" at={fGratis} volume={0.6} />
      <Sfx name="hit_soft" at={fCond} volume={0.7} />
    </IvxStage>
  );
};

// W03 · La condición son las cookies: el aviso real de ivoox.com («nosotros y nuestros 1048 socios…»), su botón para no
// aceptarlas, «Rechazar y suscribirse», y el muro que sale al rechazarlas: Premium, Plus o «Aceptar y acceder gratis».
export const W03Cookies: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('W03', w, n);
  const fCookies = at('cookies');
  const fGratis = at('gratis');
  const fAceptar = at('aceptar');
  const fSocios = at('socios');
  const fPubli = at('publicidad');
  const fFijate = at('fijate');
  const fRech = at('rechazar');
  const fRechazas = at('rechazas');
  const fPagando = at('pagando');
  const fAcept2 = at('aceptandolas');
  // Aviso de cookies (limpio desde 1,6 s de la toma): «1048 socios» y el botón «Rechazar y suscribirse», que se pulsa.
  const s0: Shot = { rec: 'web_aviso', at: 0, start: 2.0, hold: 13.8 };
  s0.marks = [markOn(s0, fSocios - 2, fFijate - 6, 40, 446, 584, 42, 12), markOn(s0, fRech - 4, fRechazas - 8, 50, 1088, 566, 68, 14)];
  const tapF = fRechazas - 10;
  // El muro (desde 2,2 s de la toma): Premium y Plus con «pagando», y «Aceptar y acceder gratis» con «aceptándolas».
  const s1: Shot = { rec: 'web_muro', at: fRechazas - 6, start: 2.2, hold: 19.5 };
  s1.marks = [markOn(s1, fRechazas + 4, fPagando - 4, 30, 216, 604, 128, 16), markOn(s1, fPagando - 2, fAcept2 - 4, 150, 356, 372, 492, 24), markOn(s1, fAcept2 - 2, dur + 20, 36, 946, 596, 68, 34)];
  const taps: Tap[] = [{ f: tapF, x: 332, y: 1122 }];
  const cx = 540;
  const top = Math.round((1080 - PH.H) / 2);
  const cam = buildPhoneCam({
    dur, side: 1, cx, top, enter: 'rise', exit: 'none',
    focus: [
      { from: fSocios, to: fFijate - 6, y: 470, s: 1.38 },
      { from: fRech - 2, to: tapF + 6, y: 1120, s: 1.4 },
      { from: fRechazas + 4, to: fPagando - 6, y: 300, s: 1.3 },
      { from: fPagando - 2, to: fAcept2 - 6, y: 600, s: 1.18 },
      { from: fAcept2 - 2, to: dur, y: 980, s: 1.32 },
    ],
  });
  const sQuote = spring({ frame: frame - (fRech - 6), fps, config: { damping: 12, stiffness: 170 } });
  const stampP = interpolate(frame, [fRech + 26, fRech + 34], [0, 1], { ...clamp, easing: (t) => t * t * t });
  const sOr = spring({ frame: frame - (fPagando - 8), fps, config: { damping: 14, stiffness: 170 } });
  const sOr2 = spring({ frame: frame - (fAcept2 - 6), fps, config: { damping: 14, stiffness: 170 } });
  const quoteOut = interpolate(frame, [fRechazas - 2, fRechazas + 10], [0, 1], { ...clamp, easing: easeInOut });
  const chipsOut = interpolate(frame, [fRech - 12, fRech - 2], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <IvxStage>
      <AbsoluteFill>
        <PhoneHalo cam={cam} cx={cx} />
        <div style={{ position: 'absolute', top, left: cx - PH.W / 2 }}>
          <AppPhone shots={[s0, s1]} w={PHONE_W} cam={cam} taps={taps} dim={0.66} motionBlur float={[0, dur]} pulse />
        </div>
        <div style={{ position: 'absolute', top: 0, height: 1080, left: 912, width: 900, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginBottom: 18, opacity: interpolate(frame, [2, 14], [0, 1], clamp) }}>
            <CookieIcon size={86} />
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 32, letterSpacing: 5, textTransform: 'uppercase', color: IV_DEEP }}>La condición</span>
          </div>
          <MaskTitle text={'Gratis… si aceptas\nlas cookies'} hi="cookies" at={fCookies - 18} size={92} />
          {/* Tres fases en el mismo hueco: los socios y la publicidad; el botón para no aceptarlas; pagar… o aceptarlas. */}
          <div style={{ position: 'relative', height: 250, marginTop: 36 }}>
            {chipsOut < 1 && (
              <div style={{ position: 'absolute', left: 0, top: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16, opacity: 1 - chipsOut, transform: `translateY(${(-24 * chipsOut).toFixed(2)}px)` }}>
                <Chip at={fSocios - 3} label="iVoox y más de 1.000 socios" sub="«nuestros 1048 socios», dice su aviso" icon={<UserIcon size={30} />} size={38} reserve />
                <Chip at={fPubli - 3} label="Para la publicidad" icon={<CardIcon size={30} />} size={38} reserve />
              </div>
            )}
            {/* El botón para no aceptarlas */}
            {frame >= fRech - 8 && quoteOut < 1 && (
              <div style={{ position: 'absolute', left: 0, top: 0, opacity: sQuote * (1 - quoteOut), transform: `translateY(${((1 - sQuote) * 30 - 20 * quoteOut).toFixed(2)}px) scale(${(0.9 + 0.1 * sQuote).toFixed(4)})`, transformOrigin: 'left center' }}>
                <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 28, color: color.ink2, marginBottom: 10 }}>El botón para no aceptarlas:</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
                  <div style={{ padding: '22px 40px', borderRadius: 20, background: '#EFEFEF', border: '2px solid #DADADA', fontFamily: font.sans, fontWeight: 700, fontSize: 50, color: '#4D4D4D', whiteSpace: 'nowrap' }}>
                    Rechazar y suscribirse
                  </div>
                  {stampP > 0 && (
                    <div style={{ opacity: Math.min(1, stampP * 2), transform: `scale(${(1.8 - 0.8 * stampP).toFixed(4)}) rotate(-10deg)` }}>
                      <div style={{ padding: '8px 18px', borderRadius: 14, border: `4px solid ${IV}`, color: IV, fontFamily: font.sans, fontWeight: 700, fontSize: 34, letterSpacing: 1, background: 'rgba(255,255,255,0.9)', whiteSpace: 'nowrap' }}>¿SUSCRIBIRSE?</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          {/* Si las rechazas: pagar… o aceptarlas */}
          {frame >= fPagando - 10 && (
            <div style={{ position: 'absolute', left: 0, top: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: sOr, transform: `translateX(${((1 - sOr) * -30).toFixed(2)}px)` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 28px 16px 18px', borderRadius: 24, background: '#fff', border: `2px solid ${IV}`, boxShadow: shadow.soft, fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.ink }}>
                  <Crown size={40} /> Premium
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 28px 16px 18px', borderRadius: 24, background: '#fff', border: `2px solid ${PLUS}`, boxShadow: shadow.soft, fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.ink }}>
                  <Diamond size={42} /> Plus
                </div>
                <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.ink2 }}>pagando…</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: sOr2, transform: `translateX(${((1 - sOr2) * -30).toFixed(2)}px)` }}>
                <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.ink2 }}>…o</span>
                <div style={{ padding: '16px 34px', borderRadius: 999, background: IV, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 36, boxShadow: '0 18px 40px rgba(244,95,49,0.35)' }}>
                  Aceptar y acceder gratis
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </AbsoluteFill>
      <Sfx name="hit_soft" at={fCookies} volume={0.5} />
      <Sfx name="ui_pop" at={fGratis} volume={0.4} />
      <Sfx name="tick_soft" at={fAceptar} volume={0.5} />
      <Sfx name="ui_pop" at={fSocios - 2} volume={0.65} />
      <Sfx name="ui_pop" at={fPubli - 2} volume={0.65} />
      <Sfx name="snap_in" at={fRech - 4} volume={0.7} />
      <Sfx name="stamp" at={fRech + 32} volume={0.5} />
      <Sfx name="ui_tap" at={tapF} volume={0.6} />
      <Sfx name="whoosh_soft" at={fRechazas - 4} volume={0.5} />
      <Sfx name="coins" at={fPagando + 2} volume={0.35} />
      <Sfx name="ui_pop" at={fAcept2 - 2} volume={0.7} />
      {zoomPeaks(cam, 2, dur - 2).map((f) => <Sfx key={`z${f}`} name="zoom_in" at={f} volume={0.4} />)}
    </IvxStage>
  );
};

// W04 · Si pagas, tres opciones: Premium (3,99 €/mes o 39,90 €/año, el primer mes gratis; sin anuncios y con extras como el
// modo coche), Plus (9,99 €/mes: todo Premium y lo exclusivo) y hacerte fan de un programa (desde 1,99 €/mes).
export const W04Precios: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('W04', w, n);
  const fTres = at('tres');
  const fPrem = at('premium');
  const fTres2 = at('tres', 1);
  const fTreinta = at('treinta');
  const fPrimer = at('primer');
  const fAnuncios = at('anuncios');
  const fExtras = at('extras');
  const fCoche = at('coche');
  const fPlus = at('plus');
  const fNueve = at('nueve', 2);
  const fTodo = at('todo');
  const fExcl = at('exclusivo');
  const fSolo = at('solo');
  const fFan = at('fan');
  const fUno = at('uno');
  const CW = 540;
  const sCard = (f: number) => spring({ frame: frame - f, fps, config: { damping: 15, stiffness: 140 } });
  const s1 = sCard(fPrem - 8);
  const s2 = sCard(fPlus - 8);
  const s3 = sCard(fSolo - 8);
  const act1 = interpolate(frame, [fPrem - 6, fPrem + 4, fPlus - 8, fPlus], [0, 1, 1, 0], clamp);
  const act2 = interpolate(frame, [fPlus - 6, fPlus + 4, fSolo - 8, fSolo], [0, 1, 1, 0], clamp);
  const act3 = interpolate(frame, [fSolo - 6, fSolo + 4, dur - 10, dur], [0, 1, 1, 0.6], clamp);
  const sRow = (f: number) => spring({ frame: frame - f, fps, config: { damping: 14, stiffness: 190 } });
  const sFree = spring({ frame: frame - (fPrimer - 4), fps, config: { damping: 10, stiffness: 210 } });
  // El título entra con la voz («Si pagas, hay…») justo al salir el separador; el «3» y «opciones», con «tres».
  const sTitle = useSpring(lead - 4, 15, 160);
  const n3 = interpolate(frame, [fTres - 4, fTres + 10], [0, 1], { ...clamp, easing: easeOut });
  const row = (f: number, icon: React.ReactNode, text: React.ReactNode, tint: string) => {
    const s = sRow(f);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.ink, opacity: s, transform: `translateX(${((1 - s) * -20).toFixed(2)}px)` }}>
        <span style={{ width: 52, height: 52, borderRadius: '50%', background: tint, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</span>
        {text}
      </div>
    );
  };
  const card = (s: number, act: number, border: string, glow: string, children: React.ReactNode) => (
    <div style={{ position: 'relative', width: CW, height: 640, borderRadius: 48, background: '#fff', border: `1px solid ${color.line}`, padding: '40px 44px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column',
      boxShadow: `0 0 0 ${(5 * act).toFixed(2)}px ${border}, 0 ${(40 + 30 * act).toFixed(1)}px ${(90 + 30 * act).toFixed(1)}px ${glow}`,
      opacity: Math.min(1, s * 1.4) * (1 - 0.3 * (1 - Math.max(act, frame < fPlus - 8 ? 1 : 0))), transform: `translateY(${((1 - s) * 110 - 16 * act).toFixed(2)}px) scale(${((0.92 + 0.08 * s) * (1 + 0.025 * act)).toFixed(4)})` }}>
      {children}
    </div>
  );
  return (
    <IvxStage>
      <AbsoluteFill>
        <div style={{ position: 'absolute', top: 70, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 22, opacity: sTitle, transform: `translateY(${((1 - sTitle) * 30).toFixed(2)}px)` }}>
          <MaskTitle text="Si pagas, hay" at={lead - 2} size={74} />
          <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 110, letterSpacing: -4, color: IV, display: 'inline-block', transform: `scale(${(0.4 + 0.6 * n3).toFixed(4)})`, opacity: n3 }}>3</span>
          <MaskTitle text="opciones" at={fTres - 2} size={74} />
        </div>
        <div style={{ position: 'absolute', top: 250, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 40, perspective: 2200 }}>
          {/* Premium */}
          {card(s1, act1, IV, 'rgba(244,95,49,0.22)', (
            <>
              <Sheen at={fPrem + 2} radius={48} tint="rgba(244,95,49,0.2)" />
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Crown size={56} />
                <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 54, letterSpacing: -1.5, color: color.ink }}>Premium</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 30, fontFamily: font.sans, fontWeight: 700, color: color.ink }}>
                <span style={{ position: 'relative', display: 'inline-block' }}>
                  <Odometer text="3,99" at={fTres2 - 6} size={116} style={{ letterSpacing: -5 }} />
                  {frame < fTres2 - 7 && <Shimmer frame={frame} r={22} />}
                </span>
                <span style={{ fontSize: 56 }}>€</span><span style={{ fontSize: 30, fontWeight: 500, color: color.ink2 }}>/mes</span>
              </div>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: color.ink2, marginTop: 6, opacity: interpolate(frame, [fTreinta - 4, fTreinta + 8], [0, 1], clamp) }}>o 39,90 €/año</div>
              <div style={{ alignSelf: 'flex-start', marginTop: 20, padding: '10px 22px', borderRadius: 999, background: color.green, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 30,
                opacity: sFree, transform: `scale(${(0.5 + 0.5 * sFree).toFixed(4)}) rotate(${((1 - sFree) * -8).toFixed(2)}deg)`, transformOrigin: 'left center' }}>1.er mes gratis</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 'auto' }}>
                {row(fAnuncios - 6, <CrossIcon size={30} c={IV} />, 'Sin anuncios', IV_SOFT)}
                {row(fExtras - 6, <CheckIcon size={30} c={IV} />, <span>Extras: <span style={{ color: IV_DEEP }}>modo coche</span>…</span>, IV_SOFT)}
              </div>
            </>
          ))}
          {/* Plus */}
          {card(s2, act2, PLUS, 'rgba(40,143,254,0.22)', (
            <>
              <Sheen at={fPlus + 2} radius={48} tint="rgba(40,143,254,0.2)" />
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Diamond size={58} />
                <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 54, letterSpacing: -1.5, color: color.ink }}>Plus</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 30, fontFamily: font.sans, fontWeight: 700, color: color.ink }}>
                <span style={{ position: 'relative', display: 'inline-block' }}>
                  <Odometer text="9,99" at={fNueve - 6} size={116} color={PLUS_DEEP} style={{ letterSpacing: -5 }} />
                  {frame < fNueve - 7 && <Shimmer frame={frame} r={22} tint={['#DCE9FA', '#F1F7FF']} />}
                </span>
                <span style={{ fontSize: 56, color: PLUS_DEEP }}>€</span><span style={{ fontSize: 30, fontWeight: 500, color: color.ink2 }}>/mes</span>
              </div>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: color.ink2, marginTop: 6, opacity: interpolate(frame, [fNueve + 10, fNueve + 22], [0, 1], clamp) }}>o 99,90 €/año</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 'auto' }}>
                {row(fTodo - 6, <Crown size={30} />, 'Todo lo de Premium', PLUS_SOFT)}
                {row(fExcl - 8, <BluePlay size={36} />, <span>+ su contenido <span style={{ color: PLUS_DEEP }}>exclusivo</span></span>, PLUS_SOFT)}
              </div>
            </>
          ))}
          {/* Hacerte fan de un programa */}
          {card(s3, act3, color.ink, 'rgba(16,16,16,0.16)', (
            <>
              <Sheen at={fSolo + 2} radius={48} tint="rgba(229,72,77,0.16)" />
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <HeartIcon size={56} c={color.red} />
                <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 46, letterSpacing: -1.2, color: color.ink, lineHeight: 1.05 }}>Fan de un<br />programa</div>
              </div>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: color.ink2, marginTop: 30, opacity: interpolate(frame, [fFan - 2, fFan + 8], [0, 1], clamp) }}>Desde</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, fontFamily: font.sans, fontWeight: 700, color: color.ink }}>
                <span style={{ position: 'relative', display: 'inline-block' }}>
                  <Odometer text="1,99" at={fUno - 6} size={116} style={{ letterSpacing: -5 }} />
                  {frame < fUno - 7 && <Shimmer frame={frame} r={22} />}
                </span>
                <span style={{ fontSize: 56 }}>€</span><span style={{ fontSize: 30, fontWeight: 500, color: color.ink2 }}>/mes</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 'auto' }}>
                {row(fFan - 2, <HeadphonesIcon size={30} c={color.red} />, 'Apoyas a ese programa', '#FDECEC')}
              </div>
            </>
          ))}
        </div>
        <div style={{ position: 'absolute', bottom: 56, left: 0, right: 0, textAlign: 'center', fontFamily: font.sans, fontWeight: 500, fontSize: 24, color: color.muted, opacity: interpolate(frame, [fPrem, fPrem + 20], [0, 1], clamp) }}>
          Precios de ivoox.com y de la app en España, 15/10/2026
        </div>
      </AbsoluteFill>
      <Sfx name="ui_pop" at={fTres - 2} volume={0.6} />
      <Sfx name="card_flip" at={fPrem - 4} />
      <ChangeTicks value={(f) => odometerShown('3,99', fTres2 - 6, fps, f)} from={fTres2 - 6} to={fTres2 + 32} volume={0.45} />
      <Sfx name="tick_soft" at={fTreinta} volume={0.5} />
      <Sfx name="stamp" at={fPrimer + 2} volume={0.45} />
      <Sfx name="ui_pop" at={fAnuncios - 5} volume={0.55} />
      <Sfx name="ui_pop" at={fExtras - 5} volume={0.55} />
      <Sfx name="tick_soft" at={fCoche} volume={0.4} />
      <Sfx name="card_flip" at={fPlus - 4} />
      <ChangeTicks value={(f) => odometerShown('9,99', fNueve - 6, fps, f)} from={fNueve - 6} to={fNueve + 32} volume={0.45} />
      <Sfx name="ui_pop" at={fTodo - 5} volume={0.55} />
      <Sfx name="sparkle" at={fExcl - 4} volume={0.45} />
      <Sfx name="card_flip" at={fSolo - 4} />
      <ChangeTicks value={(f) => odometerShown('1,99', fUno - 6, fps, f)} from={fUno - 6} to={fUno + 32} volume={0.45} />
      <Sfx name="ui_pop" at={fFan} volume={0.5} />
    </IvxStage>
  );
};

export { DocIcon, IV_SOFT };
