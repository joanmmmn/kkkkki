import React from 'react';
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { typeTimesSpoken } from '../../lib/typing';
import { Keystrokes, Sfx } from '../../components/Sfx';
import { Logo } from '../../components/Logo';
import { Words, Typewriter } from '../../components/Kinetic';
import { Pill as BrandPill } from '../../components/Pill';
import { Phase } from '../../components/Phase';
import { CamKey, ScreenClip } from '../../components/ScreenClip';
import { CheckIcon, HeadphonesIcon } from '../../components/Icons';
import { CalendarIcon, CardIcon, ClockIcon, DocIcon, GlobeIcon, SearchIcon, UserIcon } from '../../components/Icons2';
import { TiltWindow } from '../nxr/Verdict';
import { wf } from './timeline';
import {
  AppPhone, buildPhoneCam, Chip, LinkBadge, markOn, MaskTitle, PH, PhoneHalo, PHONE_W, Shot, SP, SP_INK, SP_SOFT, SpoStage, SpotifyIcon, SpoWindow, Tap, WebShot, zoomPeaks,
} from './kit';
import { DarkPill, Pill } from './Intro';
import type { SceneProps } from './registry';
import ms10 from '../../../public/str/web/10_sb_plataformas/meta.json';

type P = SceneProps;
type IP = { size?: number; c?: string };
const QuestionIcon: React.FC<IP> = ({ size = 32, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="8.5" /><path d="M9.6 9.4a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.1-2.4 3.6" /><path d="M12 16.6v.1" />
  </svg>
);

// X01 · Cómo empezar: con Premium no hay que hacer nada (Buscar → Audiolibros, la toma real); sin Premium, Individual tiene un mes
// gratis si nunca lo has probado (spotify.com/es/premium, 15/10/2026), pero Spotify no aclara si la prueba incluye las 12 horas.
export const X01Empezar: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('X01', w, n);
  const fTienes = at('tienes');
  const fNada = at('nada');
  const fEntra = at('entra');
  const fBuscar = at('buscar');
  const fToca = at('toca');
  const fAud = at('audiolibros');
  const fSiNo = at('no', 1);
  const fInd = at('individual');
  const fMes = at('mes');
  const fNunca = at('nunca');
  const fAclara = at('aclara');
  const fDoce = at('doce');
  const swap = at('si', 1) - 4;
  // Fase A: el móvil con Buscar y el toque en «Audiolibros» (a los 7,8 s de la toma) justo después de «toca».
  const tapF = fAud + 4;
  const s0: Shot = { rec: '00_buscar', at: 0, start: Math.max(0, 7.8 - tapF / 50), hold: 8.2 };
  s0.marks = [markOn(s0, fBuscar - 4, fToca - 4, 192, 1335, 110, 100, 22), markOn(s0, fToca - 2, tapF + 2, 22, 416, 300, 120, 22)];
  const s1: Shot = { rec: '01_hub', at: tapF + 22, start: 0.1, hold: 3.4 };
  const taps: Tap[] = [{ f: tapF, x: 171, y: 476 }];
  const cx = 470;
  const top = Math.round((1080 - PH.H) / 2);
  const cam = buildPhoneCam({ dur: swap + 20, side: 1, cx, top, enter: 'rise', exit: 'none', focus: [{ from: fBuscar, to: tapF + 4, y: 900, s: 1.12 }] });
  const out = interpolate(frame, [swap - 6, swap + 14], [0, 1], { ...clamp, easing: easeInOut });
  const sNada = spring({ frame: frame - (fNada - 4), fps, config: { damping: 13, stiffness: 190 } });
  const sPrem = spring({ frame: frame - (fTienes - 6), fps, config: { damping: 14, stiffness: 170 } });
  // Fase B: la página de planes (captura de spotify.com/es/premium) con la tarjeta Individual: «0 € durante 1 mes», la letra
  // pequeña («Oferta disponible solo si no has probado Premium») y «12 horas al mes de tiempo de escucha de audiolibros».
  const W = 1420;
  const bIn = spring({ frame: frame - swap, fps, config: { damping: 18, stiffness: 120 } });
  const bF = swap - 2;
  const camB: CamKey[] = [{ f: 0, zoom: 1.0, x: 960, y: 540 }, { f: fInd - bF, zoom: 1.0, x: 960, y: 540 }, { f: fMes - bF + 6, zoom: 1.65, x: 590, y: 240 }, { f: fNunca - bF, zoom: 1.65, x: 590, y: 240 },
    { f: fNunca - bF + 14, zoom: 1.75, x: 590, y: 470 }, { f: fAclara - bF, zoom: 1.75, x: 590, y: 470 }, { f: fAclara - bF + 16, zoom: 1.6, x: 590, y: 360 }];
  const marksB = [
    { from: fMes - bF - 4, to: fNunca - bF - 4, x: 405, y: 76, w: 344, h: 186, r: 16 },
    { from: fNunca - bF - 2, to: fAclara - bF - 6, x: 406, y: 494, w: 346, h: 52, r: 12 },
    { from: fDoce - bF - 10, to: dur + 20 - bF, x: 406, y: 312, w: 346, h: 74, r: 12 },
  ];
  const sQ = spring({ frame: frame - (fAclara - 4), fps, config: { damping: 13, stiffness: 190 } });
  return (
    <SpoStage>
      {out < 1 && (
        <AbsoluteFill style={{ opacity: 1 - out, transform: `translateX(${(-260 * out).toFixed(2)}px)`, filter: out > 0.02 ? `blur(${(out * 8).toFixed(2)}px)` : undefined }}>
          <PhoneHalo cam={cam} cx={cx} />
          <div style={{ position: 'absolute', top, left: cx - PH.W / 2 }}>
            <AppPhone shots={[s0, s1]} w={PHONE_W} cam={cam} taps={taps} dim={0.72} motionBlur float={[0, swap]} />
          </div>
          <div style={{ position: 'absolute', left: 900, top: 0, height: 1080, width: 940, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ opacity: sPrem }}><MaskTitle text={'¿Ya tienes\nPremium?'} hi="Premium?" at={Math.max(0, fTienes - 10)} size={100} /></div>
            <div style={{ marginTop: 34, minHeight: 84 }}>
              <Pill s={sNada} tone="green" size={38}><CheckIcon size={42} /> No hay que hacer nada</Pill>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16, marginTop: 24 }}>
              <Chip at={fEntra - 3} label="Entra en Buscar" icon={<SearchIcon size={32} />} size={40} accent={SP_SOFT} reserve />
              <Chip at={fToca - 3} label="Toca «Audiolibros»" icon={<HeadphonesIcon size={32} />} size={40} accent={SP_SOFT} reserve />
            </div>
          </div>
        </AbsoluteFill>
      )}
      {frame >= swap - 4 && (
        <AbsoluteFill>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 34, display: 'flex', justifyContent: 'center', gap: 16, zIndex: 5 }}>
            <Chip at={fSiNo - 2} label="¿Sin Premium?" icon={<UserIcon size={30} />} size={36} accent={SP_SOFT} reserve />
            <Chip at={fMes - 3} label="Individual: 1 mes gratis" icon={<CalendarIcon size={30} />} size={36} accent={SP_SOFT} reserve />
            <Chip at={fNunca - 3} label="Si nunca lo has probado" icon={<CheckIcon size={30} />} size={36} accent={SP_SOFT} reserve />
          </div>
          <div style={{ position: 'absolute', left: (1920 - W) / 2, top: 128, opacity: bIn, transform: `translateY(${((1 - bIn) * 70).toFixed(2)}px) scale(${(0.94 + 0.06 * bIn).toFixed(4)})` }}>
            <SpoWindow width={W} url="spotify.com/es/premium" ry={-3} rx={2}>
              <Sequence from={bF} layout="none">
                <WebShot img="planes" width={W} camera={camB} marks={marksB} cursor={[{ f: 0, x: 1500, y: 860 }, { f: fMes - bF + 8, x: 590, y: 300 }, { f: fNunca - bF + 10, x: 600, y: 520 }, { f: fAclara - bF + 10, x: 640, y: 352 }]} />
              </Sequence>
            </SpoWindow>
          </div>
          {frame >= fAclara - 6 && (
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 52, display: 'flex', justifyContent: 'center', zIndex: 6 }}>
              <DarkPill s={sQ} size={38}><QuestionIcon size={46} c={SP} /> ¿La prueba incluye las 12 h? Spotify no lo aclara</DarkPill>
            </div>
          )}
        </AbsoluteFill>
      )}
      <Sfx name="ui_pop" at={fTienes - 2} volume={0.5} />
      <Sfx name="success" at={fNada} volume={0.5} />
      <Sfx name="ui_tap" at={tapF} volume={0.55} />
      <Sfx name="whoosh_soft" at={swap - 6} volume={0.7} />
      <Sfx name="zoom_in" at={fMes + 2} volume={0.45} />
      <Sfx name="ui_pop" at={fNunca - 2} volume={0.5} />
      <Sfx name="hit_soft" at={fAclara} volume={0.6} />
      {zoomPeaks(cam, 2, swap).map((f) => <Sfx key={`z${f}`} name="zoom_in" at={f} volume={0.4} />)}
    </SpoStage>
  );
};

// X02 · Tus horas: toca tu foto → «Tu Premium» → «Tiempo de escucha de audiolibros» (en el móvil, esa página: 0 h de 12); ahí
// también se añade Audiolibros+ (la pantalla de pago real: 0,00 € hasta el 22 de noviembre, sin pagar nada) o una recarga.
export const X02TusHoras: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('X02', w, n);
  const fFoto = at('foto');
  const fPremium = at('premium');
  const fTiempo = at('tiempo');
  const fAnadir = at('anadir');
  const fPlus = at('audiolibros', 1);
  const fGratis = at('gratis');
  const fRecarga = at('recarga');
  const s0: Shot = { rec: '13_horas_arriba', at: 0, start: 1.0, hold: 14.5 };
  s0.marks = [markOn(s0, fTiempo - 4, fTiempo + 20, 8, 52, 648, 66, 18), markOn(s0, fTiempo + 22, fAnadir - 8, 20, 180, 624, 282, 20)];
  const s1: Shot = { rec: '10_horas', at: fAnadir - 6, start: 16.0, hold: 26.0 };
  s1.marks = [markOn(s1, fAnadir, fGratis - 8, 22, 438, 620, 324, 20)];
  const s2: Shot = { rec: '12_checkout', at: fGratis - 6, start: 1.0, hold: 9.8 };
  s2.marks = [markOn(s2, fGratis, fRecarga - 8, 16, 338, 632, 80, 16)];
  const s3: Shot = { rec: '11_recarga', at: fRecarga - 6, start: 1.5, hold: 12.5 };
  s3.marks = [markOn(s3, fRecarga, dur + 20, 20, 520, 624, 205, 18)];
  const cx = 470;
  const top = Math.round((1080 - PH.H) / 2);
  const cam = buildPhoneCam({
    dur, side: 1, cx, top, enter: 'rise', exit: 'none',
    focus: [{ from: fTiempo + 22, to: fAnadir - 8, y: 321, s: 1.3 }, { from: fAnadir, to: fGratis - 8, y: 600, s: 1.3 }, { from: fGratis, to: fRecarga - 8, y: 378, s: 1.45 }, { from: fRecarga, to: dur, y: 622, s: 1.36 }],
  });
  const steps = [
    { f: fFoto, label: 'Tu foto', icon: <UserIcon size={30} /> },
    { f: fPremium, label: 'Tu Premium', icon: <SpotifyIcon size={34} /> },
    { f: fTiempo, label: 'Tiempo de escucha de audiolibros', icon: <ClockIcon size={30} /> },
  ];
  const arrow = (f: number) => interpolate(frame, [f - 8, f + 2], [0, 1], { ...clamp, easing: easeOut });
  return (
    <SpoStage>
      <PhoneHalo cam={cam} cx={cx} />
      <div style={{ position: 'absolute', top, left: cx - PH.W / 2 }}>
        <AppPhone shots={[s0, s1, s2, s3]} w={PHONE_W} cam={cam} dim={0.72} motionBlur float={[0, dur]} />
      </div>
      <div style={{ position: 'absolute', left: 880, top: 0, height: 1080, width: 980, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <MaskTitle text={'¿Cuántas horas\nte quedan?'} hi="horas" at={2} size={92} />
        {/* Ruta: Tu foto › Tu Premium › Tiempo de escucha de audiolibros */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6, marginTop: 40 }}>
          {steps.map((st, i) => (
            <React.Fragment key={st.label}>
              {i > 0 && (
                <svg width="60" height="40" viewBox="0 0 60 40" style={{ marginLeft: 26, opacity: arrow(st.f) }}>
                  <path d="M14 4 v20 a8 8 0 0 0 8 8 h22" fill="none" stroke={color.ink2} strokeWidth="4" strokeLinecap="round" strokeDasharray="60" strokeDashoffset={60 * (1 - arrow(st.f))} />
                  <path d="M38 24 l8 8 -8 8" fill="none" stroke={color.ink2} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity={arrow(st.f)} />
                </svg>
              )}
              <Chip at={st.f - 3} dimAt={i < 2 ? steps[i + 1].f - 3 : fAnadir - 3} label={st.label} icon={st.icon} size={38} accent={SP_SOFT} reserve />
            </React.Fragment>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 34, minHeight: 84 }}>
          <Chip at={fPlus - 3} label="Añade Audiolibros+" sub="1.er mes gratis (la 1.ª vez)" icon={<CalendarIcon size={30} />} size={36} accent="#E8EFFF" reserve />
          <Chip at={fRecarga - 3} label="O una recarga" icon={<CardIcon size={30} />} size={36} accent={SP_SOFT} reserve />
        </div>
      </div>
      <Sfx name="ui_pop" at={fFoto - 2} volume={0.6} />
      <Sfx name="draw" at={fPremium - 8} volume={0.35} dur={10} fade={4} />
      <Sfx name="ui_pop" at={fPremium - 2} volume={0.6} />
      <Sfx name="draw" at={fTiempo - 8} volume={0.35} dur={10} fade={4} />
      <Sfx name="ui_pop" at={fTiempo - 2} volume={0.6} />
      <Sfx name="ui_pop" at={fPlus - 2} volume={0.6} />
      <Sfx name="sparkle" at={fGratis} volume={0.5} />
      <Sfx name="ui_pop" at={fRecarga - 2} volume={0.6} />
      {zoomPeaks(cam, 2, dur - 2).map((f) => <Sfx key={`z${f}`} name="zoom_in" at={f} volume={0.4} />)}
    </SpoStage>
  );
};

// X03 · Cancelar (ayuda de Spotify, «Cómo cancelar planes Premium», 15/10/2026): en la cuenta, en la web: «Administrar tu plan» →
// «Cancelar suscripción»; si cancelas en la prueba, pasas al plan gratuito al momento. Audiolibros+ se quita aparte, sin cancelar
// Premium (letra pequeña de spotify.com/es/audiobooks).
export const X03Cancelar: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('X03', w, n);
  const fCancelar = at('cancelar');
  const fCancela = at('cancela', 1); // el primero es «cancelar?»
  const fWeb = at('web');
  const fAdm = at('administrar');
  const fCanc2 = at('cancelar', 1);
  const fPrueba = at('prueba');
  const fPasas = at('pasas');
  const fMomento = at('momento');
  const fPlus = at('audiolibros');
  const fQuita = at('quita');
  const fSin = at('sin');
  const W = 1420;
  const sQ = spring({ frame: frame - 2, fps, config: { damping: 15, stiffness: 160 } });
  const qOut = interpolate(frame, [fCancela - 12, fCancela], [0, 1], { ...clamp, easing: easeInOut });
  const sWin = spring({ frame: frame - (fCancela - 10), fps, config: { damping: 18, stiffness: 120 } });
  const aF = fCancela - 10;
  const camA: CamKey[] = [{ f: 0, zoom: 1.0, x: 960, y: 540 }, { f: fWeb - aF, zoom: 1.4, x: 770, y: 640 }, { f: fPrueba - aF - 6, zoom: 1.45, x: 770, y: 660 }, { f: fPrueba - aF + 10, zoom: 1.55, x: 770, y: 800 }, { f: 900, zoom: 1.55, x: 770, y: 800 }];
  const marksA = [
    { from: fCancela - aF - 2, to: fAdm - aF - 6, x: 498, y: 592, w: 540, h: 52, r: 12 },
    { from: fAdm - aF - 2, to: fCanc2 - aF - 4, x: 514, y: 652, w: 262, h: 30, r: 10 },
    { from: fCanc2 - aF - 2, to: fPrueba - aF - 6, x: 514, y: 676, w: 300, h: 30, r: 10 },
    { from: fPrueba - aF - 2, to: fPlus - aF - 8, x: 498, y: 772, w: 540, h: 74, r: 12 },
  ];
  const bF = fPlus - 8;
  const camB: CamKey[] = [{ f: 0, zoom: 1.2, x: 1180, y: 600 }, { f: 18, zoom: 1.75, x: 1180, y: 850 }, { f: 900, zoom: 1.8, x: 1180, y: 850 }];
  const marksB = [{ from: fQuita - bF - 8, to: dur + 20 - bF, x: 900, y: 798, w: 572, h: 112, r: 12 }];
  const nav = interpolate(frame, [bF, bF + 16], [0, 1], { ...clamp, easing: easeInOut });
  const url = frame < bF + 8 ? 'support.spotify.com/es/article/cancel-premium' : 'spotify.com/es/audiobooks';
  return (
    <SpoStage>
      <AbsoluteFill>
        {qOut < 1 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: sQ * (1 - qOut), transform: `scale(${(0.9 + 0.1 * sQ - 0.05 * qOut).toFixed(4)})` }}>
            <MaskTitle text="¿Y para cancelar?" hi="cancelar?" at={Math.max(0, fCancelar - 14)} size={110} align="center" />
          </div>
        )}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 34, display: 'flex', justifyContent: 'center', gap: 16, zIndex: 5 }}>
          <Chip at={fWeb - 3} dimAt={fPrueba - 3} label="En tu cuenta, en la web" icon={<GlobeIcon size={30} />} size={34} accent={SP_SOFT} reserve />
          <Chip at={fAdm - 3} dimAt={fPrueba - 3} label="Administrar tu plan › Cancelar" icon={<DocIcon size={30} />} size={34} accent={SP_SOFT} reserve />
          <Chip at={fPasas - 3} dimAt={fPlus - 3} label="En la prueba: plan gratis al momento" icon={<ClockIcon size={30} />} size={34} accent={SP_SOFT} reserve />
        </div>
        {frame >= fCancela - 12 && (
          <div style={{ position: 'absolute', left: (1920 - W) / 2, top: 128, opacity: sWin, transform: `translateY(${((1 - sWin) * 80).toFixed(2)}px) scale(${(0.94 + 0.06 * sWin).toFixed(4)})` }}>
            <SpoWindow width={W} url={url} ry={-3} rx={2}>
              <div style={{ position: 'absolute', inset: 0, opacity: 1 - nav }}>
                <Sequence from={aF} layout="none">
                  <WebShot img="cancelar" width={W} camera={camA} marks={marksA} cursor={[{ f: 0, x: 1300, y: 900 }, { f: fAdm - aF + 4, x: 640, y: 666 }, { f: fCanc2 - aF + 6, x: 700, y: 690 }]} />
                </Sequence>
              </div>
              {frame >= bF && (
                <div style={{ position: 'absolute', inset: 0, opacity: nav, transform: `translateY(${((1 - nav) * 10).toFixed(2)}%)` }}>
                  <Sequence from={bF} layout="none">
                    <WebShot img="ab_plus" width={W} camera={camB} marks={marksB} />
                  </Sequence>
                </div>
              )}
            </SpoWindow>
          </div>
        )}
        {frame >= fQuita - 6 && (
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 46, display: 'flex', justifyContent: 'center', zIndex: 6 }}>
            <DarkPill s={spring({ frame: frame - (fQuita - 4), fps, config: { damping: 13, stiffness: 190 } })} size={36}>
              <CheckIcon size={42} c={SP} fg={SP_INK} /><span>Audiolibros+ se quita aparte<span style={{ color: SP, opacity: interpolate(frame, [fSin - 4, fSin + 8], [0.25, 1], clamp) }}>, sin cancelar Premium</span></span>
            </DarkPill>
          </div>
        )}
      </AbsoluteFill>
      <Sfx name="ui_pop" at={fCancelar - 4} volume={0.5} />
      <Sfx name="whoosh_soft" at={fCancela - 10} volume={0.7} />
      <Sfx name="zoom_in" at={fWeb + 4} volume={0.45} />
      <Sfx name="ui_pop" at={fAdm - 2} volume={0.6} />
      <Sfx name="click" at={fCanc2 + 6} volume={0.6} />
      <Sfx name="hit_soft" at={fMomento} volume={0.6} />
      <Sfx name="swipe" at={bF + 2} volume={0.7} />
      <Sfx name="zoom_in" at={bF + 10} volume={0.45} />
      <Sfx name="success" at={fQuita} volume={0.5} />
    </SpoStage>
  );
};

// X04 · ¿Dudas? En SonorBooks comparas precio, horas y días gratis de las demás plataformas (la comparativa, grabación real) y la
// reseña completa por escrito, en la descripción.
export const X04Compara: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('X04', w, n);
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
    <SpoStage>
      <AbsoluteFill>
        {qOut < 1 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: sQ * (1 - qOut), transform: `scale(${(0.9 + 0.1 * sQ - 0.05 * qOut).toFixed(4)})` }}>
            <MaskTitle text="¿Dudas entre Spotify y otras?" hi="otras?" at={2} size={92} align="center" />
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
    </SpoStage>
  );
};

// X05 · Cierre de marca con espacio libre para la pantalla final de YouTube (sin aviso de afiliado: no hay enlaces de afiliado).
export const X05Outro: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('X05', w, n);
  const fDonde = at('donde');
  const fTu = at('tu');
  const fProx = at('proximo');
  const fLibro = at('libro');
  const fSonor = at('sonorbooks');
  const fEn = fSonor - 6; // «en» va justo antes de «SonorBooks» (buscar «en» daría con «Encuentra»)
  const query = 'Tu próximo libro';
  const keys = typeTimesSpoken(query, [[fTu - 3, fProx - 3], [fProx - 2, fLibro - 3], [fLibro - 2, fEn - 4]], 'x05');
  const end = fSonor + 34;
  return (
    <SpoStage>
      <Phase from={0} to={end + 2}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 56 }}>
          <Logo size={120} delay={2} />
          <div style={{ width: 1160, height: 104, borderRadius: 999, background: '#fff', boxShadow: shadow.float, border: `1px solid ${color.line}`, display: 'flex', alignItems: 'center', padding: '0 18px 0 46px', gap: 24 }}>
            <svg width="38" height="38" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" stroke={color.ink} strokeWidth="2.4" fill="none" /><path d="M15.5 15.5 L21 21" stroke={color.ink} strokeWidth="2.4" strokeLinecap="round" /></svg>
            <div style={{ flex: 1, fontFamily: font.sans, fontSize: 42, color: color.ink }}>
              <Typewriter text={query} times={keys} placeholder="Busca un libro" />
            </div>
          </div>
          <div style={{ fontFamily: font.sans, fontSize: 34, color: color.ink2, opacity: spring({ frame: frame - fDonde, fps }) }}>Dónde escucharlo y a qué precio</div>
        </AbsoluteFill>
      </Phase>
      <Phase from={end} to={dur} out={1}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 190, flexDirection: 'column', gap: 34, background: '#fff' }}>
          <Logo size={150} animate={false} />
          <Words text="Tu próxima historia te está esperando." start={2} stagger={4} size={62} weight={500} />
          <div style={{ opacity: spring({ frame: frame - end - 30, fps }) }}><BrandPill size={40}>sonorbooks.com</BrandPill></div>
        </AbsoluteFill>
      </Phase>
      <Sfx name="logo_sting" at={4} />
      <Keystrokes text={query} times={keys} volume={0.9} seed="x05" />
      <Sfx name="logo_sting" at={end + 5} volume={0.6} />
    </SpoStage>
  );
};

export { SP };
