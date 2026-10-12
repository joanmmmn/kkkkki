import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Stage } from '../../components/Stage';
import { Sfx } from '../../components/Sfx';
import { CheckIcon, CrossIcon, HeadphonesIcon, BookIcon } from '../../components/Icons';
import { ClockIcon, GlobeIcon, InfinityIcon, PhoneIcon, TabletIcon, UserIcon } from '../../components/Icons2';
import { NextoryLogo } from '../nx/common';
import { wf } from './timeline';
import type { SceneProps } from './registry';
import { AppPhone, buildPhoneCam, Chip, CountUp, MaskTitle, PH, PHONE_W, Shot } from './kit';

type P = SceneProps;
const useSpring = (at: number, damping = 16, stiffness = 160) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, stiffness } });
};

const TapIcon: React.FC<{ size?: number; c?: string }> = ({ size = 32, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="10" r="3.2" />
    <path d="M6.2 10a5.8 5.8 0 0 1 11.6 0M3.5 10a8.5 8.5 0 0 1 17 0" opacity="0.55" />
    <path d="M12 13.2v7.3" />
  </svg>
);

// Fase de una escena que entra deslizándose desde la derecha y sale hacia la izquierda (carrusel).
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

// R01 · Gancho: el móvil entra girando con la app y se acerca a lo que nombra la voz; a la izquierda, la pregunta.
export const R01Hook: React.FC<P> = ({ lead, dur }) => {
  const at = (w: string, n = 0) => lead + wf('R01', w, n);
  const fBueno = at('bueno');
  const fMalo = at('malo');
  const fGratis = at('treinta');
  const fLey = at('leyendo');
  const fEsc = at('escuchando');
  const fToc = at('tocando');
  const fBot = at('boton');
  const fFinal = at('final');
  const sLogo = useSpring(lead - 6);
  // El móvil va enseñando lo que dice la voz: portada, lector, reproductor, dos toques y El Librarian.
  const shots: Shot[] = [
    // La portada se desplaza sola hacia abajo (14,5 s de la toma) mientras suena la pregunta.
    { rec: '01_inicio', at: 0, start: 12.6, hold: 21.0 },
    { rec: '05_leer', at: fLey - 4, start: 13.2, hold: 15.4 },
    { rec: '06_escuchar', at: fEsc - 4, start: 5.0, hold: 19.5 },
    { rec: '05_leer', at: fToc - 4, start: Math.max(0, 37.2 - 16 / 50), hold: 48.9 },
    { rec: '06_escuchar', at: fBot + 2, start: Math.max(0, 20.14 - 10 / 50), hold: 28.5 },
    { rec: '02_librarian_b', at: fBueno - 6, start: 25.0, hold: 32.0 },
    { rec: '13_diluvio', at: fFinal - 6, start: 0.3, hold: 11.0 },
  ];
  const fInst = at('instalado');
  const sInst = useSpring(fInst - 2, 14, 190);
  const cx = 1425;
  const top = Math.round((1080 - PH.H) / 2);
  const cam = buildPhoneCam({
    dur, side: -1, cx, top, enter: 'spin', exit: 'none',
    focus: [
      { from: fLey + 2, to: fEsc - 4, y: 520, s: 1.3 },
      { from: fEsc + 2, to: fToc - 4, y: 840, s: 1.36 },
      { from: fToc + 2, to: fBot - 2, y: 900, s: 1.36 },
      { from: fBot + 4, to: fBueno - 10, y: 1150, s: 1.34 },
    ],
  });
  return (
    <Stage tone="warm">
      <AbsoluteFill>
        <div style={{ position: 'absolute', top, left: cx - PH.W / 2 }}>
          <AppPhone shots={shots} w={PHONE_W} cam={cam} dim={0.72} motionBlur taps={[{ f: fToc + 10, x: 332, y: 869 }, { f: fBot + 10, x: 252, y: 1198 }]} />
        </div>
        <div style={{ position: 'absolute', left: 150, top: 0, height: 1080, width: 960, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 30 }}>
            <div style={{ opacity: sLogo, transform: `translateY(${(1 - sLogo) * 24}px)` }}>
              <NextoryLogo width={250} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 22px 10px 12px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.soft,
              fontFamily: font.sans, fontWeight: 700, fontSize: 28, color: color.ink, opacity: sInst, transform: `translateX(${(1 - sInst) * -24}px) scale(${0.85 + 0.15 * sInst})`, transformOrigin: 'left center' }}>
              <CheckIcon size={34} /> Instalada y probada a fondo
            </div>
          </div>
          <MaskTitle text="¿Merece la pena Nextory?" hi="Nextory?" at={lead - 2} size={122} stagger={4} />
          <div style={{ display: 'flex', gap: 16, marginTop: 50, minHeight: 64 }}>
            <Chip at={fLey} dimAt={fEsc} label="Leyendo" icon={<BookIcon size={26} />} size={30} reserve />
            <Chip at={fEsc} dimAt={fToc} label="Escuchando" icon={<HeadphonesIcon size={26} />} size={30} reserve />
            <Chip at={fToc} dimAt={fBueno} label="Tocando cada botón" icon={<TapIcon size={26} />} size={30} reserve />
          </div>
          <div style={{ display: 'flex', gap: 18, marginTop: 22, minHeight: 72 }}>
            <Chip at={fBueno} label="Lo bueno" icon={<CheckIcon size={30} c={color.green} />} accent="#E3F5EA" size={36} reserve />
            <Chip at={fMalo} label="Lo malo" icon={<CrossIcon size={30} />} accent="#FDECEC" size={36} reserve />
            <Chip at={fGratis} label="30 días gratis" size={36} dark reserve />
          </div>
        </div>
      </AbsoluteFill>
      <Sfx name="whoosh_deep" at={4} />
      <Sfx name="snap_in" at={fInst} volume={0.7} />
      <Sfx name="ui_pop" at={fLey} volume={0.7} />
      <Sfx name="ui_pop" at={fEsc} volume={0.7} />
      <Sfx name="ui_pop" at={fToc} volume={0.7} />
      <Sfx name="ui_tap" at={fToc + 10} volume={0.5} />
      <Sfx name="ui_tap" at={fBot + 10} volume={0.5} />
      <Sfx name="ui_pop" at={fBueno} />
      <Sfx name="ui_pop" at={fMalo} />
      <Sfx name="sparkle" at={fGratis} />
    </Stage>
  );
};

// R02 · Qué es: marca, formatos, catálogo (con Planeta), el relevo de Nubico y en qué dispositivos funciona.
export const R02Que: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const at = (w: string, n = 0) => lead + wf('R02', w, n);
  const fApp = at('app');
  const fMillon = at('millon');
  const fAudio = at('audiolibros');
  const fEbooks = at('ebooks');
  const fSusc = at('suscripcion');
  const fIdiomas = at('idiomas');
  const fCatalogo = at('catalogo');
  const fEspana = at('espana');
  const fNubico = at('nubico');
  const fEso = at('eso');
  const fMovil = at('movil');
  const fTablet = at('tablet');
  const fWeb = at('web');
  // Tres fases en carrusel: A (marca y catálogo, con el móvil), B (Nubico → Nextory) y C (dispositivos).
  const A = usePhase(-10, fEspana - 6);
  const B = usePhase(fEspana - 6, fEso - 8);
  const C = usePhase(fEso - 8, dur + 20);
  const sLogo = useSpring(2);
  const sTag = useSpring(fApp - 4);
  const sMillon = useSpring(fMillon - 8, 14, 150);
  const sSusc = useSpring(fSusc);
  const sNub = useSpring(fNubico - 4);
  const strike = interpolate(frame, [fNubico + 12, fNubico + 28], [0, 1], { ...clamp, easing: easeOut });
  const sMov = useSpring(fMovil - 2, 12, 200);
  const sTab = useSpring(fTablet - 2, 12, 200);
  const sWeb = useSpring(fWeb - 2, 12, 200);
  const sDev = useSpring(fEso - 6);
  const cx = 1425;
  const top = Math.round((1080 - PH.H) / 2);
  const cam = buildPhoneCam({ dur: fEspana + 10, side: -1, cx, top, enter: 'rise', exit: 'none', focus: [{ from: fCatalogo - 6, to: fEspana + 20, y: 1090, s: 1.2 }] });
  return (
    <Stage tone="warm">
      {/* Fase A: marca, formatos, catálogo y Planeta, con la app a la derecha */}
      {A.visible && (
        <AbsoluteFill style={A.style}>
          <div style={{ position: 'absolute', top, left: cx - PH.W / 2 }}>
            <AppPhone shots={[{ rec: '01b_inicio_bajo', at: 0, start: 0.5, hold: 11.5 }]} w={PHONE_W} cam={cam} />
          </div>
          <div style={{ position: 'absolute', left: 130, top: 0, height: 1080, width: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 26, opacity: sLogo, transform: `translateY(${(1 - sLogo) * 24}px)` }}>
              <NextoryLogo width={300} />
              <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 30, color: color.ink2, padding: '10px 20px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`,
                opacity: sTag, transform: `translateX(${(1 - sTag) * -20}px)` }}>App sueca · desde 2015</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 40, minHeight: 76 }}>
              <Chip at={fAudio} label="Audiolibros" icon={<HeadphonesIcon size={30} />} size={36} reserve />
              <Chip at={fEbooks} label="Ebooks" icon={<BookIcon size={30} />} size={36} reserve />
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.ink2, marginLeft: 8, opacity: sSusc, transform: `translateX(${(1 - sSusc) * -16}px)` }}>· una sola suscripción</div>
            </div>
            <div style={{ marginTop: 26, fontFamily: font.sans, fontWeight: 700, fontSize: 188, letterSpacing: -8, lineHeight: 1, color: color.ink, opacity: sMillon, transform: `translateY(${(1 - sMillon) * 40}px) scale(${0.9 + 0.1 * sMillon})`, transformOrigin: 'left center' }}>
              +<CountUp to={1.4} decimals={1} from={fMillon - 8} dur={36} suffix=" M" />
              <span style={{ fontSize: 60, letterSpacing: -1, color: color.ink2, marginLeft: 18 }}>títulos</span>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 30, minHeight: 76 }}>
              <Chip at={fIdiomas} label="Varios idiomas" icon={<GlobeIcon size={28} />} size={34} reserve />
              <Chip at={fCatalogo} label="Catálogo completo de Planeta" icon={<BookIcon size={28} c={color.ink} />} size={34} dark reserve />
            </div>
          </div>
        </AbsoluteFill>
      )}
      {/* Fase B: en España, Nubico → Nextory */}
      {B.visible && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', ...B.style }}>
          <MaskTitle text="En España" at={fEspana - 4} size={44} weight={700} color={color.muted} style={{ marginBottom: 36, letterSpacing: 2 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 56, padding: '46px 70px', background: '#fff', borderRadius: 44, boxShadow: shadow.card, border: `1px solid ${color.line}`, transform: `scale(${1.18 * (0.92 + 0.08 * sNub)})` }}>
            <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 700, fontSize: 92, color: '#9AA0A6', letterSpacing: -2 }}>
              Nubico
              <div style={{ position: 'absolute', left: -8, right: -8, top: '52%', height: 8, background: color.red, borderRadius: 4, transform: `scaleX(${strike})`, transformOrigin: 'left' }} />
            </div>
            <svg width="120" height="50" viewBox="0 0 120 50"><path d={`M6 25 H ${6 + 96 * strike}`} stroke={color.ink} strokeWidth="6" strokeLinecap="round" /><path d="M88 9 L106 25 L88 41" stroke={color.ink} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={strike} /></svg>
            <div style={{ opacity: strike, transform: `scale(${0.8 + 0.2 * strike})` }}><NextoryLogo width={330} /></div>
          </div>
          <div style={{ marginTop: 60, fontFamily: font.sans, fontWeight: 500, fontSize: 40, color: color.ink2, opacity: interpolate(frame, [fNubico + 30, fNubico + 44], [0, 1], clamp) }}>
            Nubico era el servicio de lectura de Movistar
          </div>
        </AbsoluteFill>
      )}
      {/* Fase C: dispositivos */}
      {C.visible && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', ...C.style }}>
          <MaskTitle text="Solo en el móvil y la tablet" hi={['móvil', 'tablet']} at={fEso - 4} size={72} align="center" style={{ marginBottom: 64 }} />
          <div style={{ display: 'flex', gap: 54, opacity: sDev, transform: `translateY(${(1 - sDev) * 50}px)` }}>
            {[
              { i: <PhoneIcon size={110} />, l: 'Móvil', ok: true, s: sMov },
              { i: <TabletIcon size={110} />, l: 'Tablet', ok: true, s: sTab },
              { i: <GlobeIcon size={110} />, l: 'Web', ok: false, s: sWeb },
            ].map((d) => (
              <div key={d.l} style={{ width: 320, height: 320, borderRadius: 48, background: '#fff', boxShadow: d.s > 0.5 && d.ok ? `0 0 0 5px ${color.yellow}, ${shadow.card}` : shadow.card, border: `1px solid ${color.line}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, position: 'relative',
                opacity: d.ok ? 1 : 1 - 0.45 * d.s, filter: d.ok ? undefined : `grayscale(${d.s})`, transform: `translateY(${d.ok ? -10 * d.s : 0}px)` }}>
                {d.i}
                <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 46, color: color.ink }}>{d.l}</div>
                <div style={{ position: 'absolute', top: -24, right: -24, transform: `scale(${d.s}) rotate(${(1 - d.s) * -30}deg)` }}>
                  {d.ok ? <CheckIcon size={80} /> : <CrossIcon size={80} />}
                </div>
              </div>
            ))}
          </div>
        </AbsoluteFill>
      )}
      <Sfx name="ui_pop" at={fAudio} />
      <Sfx name="ui_pop" at={fEbooks} />
      <Sfx name="counter" at={fMillon - 8} />
      <Sfx name="ui_pop" at={fIdiomas} />
      <Sfx name="snap_in" at={fCatalogo} />
      <Sfx name="zoom_in" at={fCatalogo - 4} volume={0.45} />
      <Sfx name="whoosh_soft" at={fEspana - 6} />
      <Sfx name="pencil_strike" at={fNubico + 12} />
      <Sfx name="whoosh_soft" at={fEso - 8} />
      <Sfx name="tick_soft" at={fMovil} />
      <Sfx name="tick_soft" at={fTablet} />
      <Sfx name="cross" at={fWeb} />
    </Stage>
  );
};

// R03 · Planes: tres tarjetas que se voltean al nombrarlas; la que suena se adelanta con un aro amarillo.
export const R03Planes: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('R03', w, n);
  const fMini = at('mini');
  const fStd = at('standard');
  const fUnl = at('unlimited');
  const fOjo = at('ojo');
  const fPerfiles = at('perfiles');
  const fSolo = at('solo');
  const fVez = at('vez');
  const plans = [
    { name: 'Mini', price: 5.99, hours: '10 h al mes', fill: 10 / 30, f: fMini, sim: 1 },
    { name: 'Standard', price: 7.99, hours: '30 h al mes', fill: 1, f: fStd, sim: 1 },
    { name: 'Unlimited', price: 9.99, hours: 'Sin límite', fill: -1, f: fUnl, sim: 4, from: true },
  ];
  // Tarjeta activa: la que nombra la voz; al final, Unlimited otra vez («solo Unlimited deja usarlos a la vez»).
  const activeAt = (i: number) => {
    const win = [[fMini - 6, fStd - 6], [fStd - 6, fUnl - 6], [fUnl - 6, fOjo - 8]][i];
    const on = (a: number, b: number) => interpolate(frame, [a, a + 8, b - 6, b], [0, 1, 1, 0], clamp);
    return Math.max(on(win[0], win[1]), i === 2 ? on(fSolo - 4, dur + 30) : 0);
  };
  const sOjo = spring({ frame: frame - fOjo, fps, config: { damping: 14, stiffness: 170 } });
  const ojoOut = interpolate(frame, [fPerfiles - 8, fPerfiles + 2], [0, 1], clamp);
  const sPerf = spring({ frame: frame - fPerfiles - 2, fps, config: { damping: 15, stiffness: 170 } });
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <MaskTitle text="Tres planes" hi="planes" at={2} size={78} align="center" style={{ marginBottom: 54 }} />
        <div style={{ display: 'flex', gap: 44, perspective: 2200 }}>
          {plans.map((p, i) => {
            const s = spring({ frame: frame - p.f + 6, fps, config: { damping: 15, stiffness: 140 } });
            const bar = interpolate(frame, [p.f + 6, p.f + 34], [0, 1], { ...clamp, easing: easeOut });
            const act = activeAt(i);
            const hot = p.name === 'Unlimited';
            return (
              <div key={p.name} style={{ position: 'relative', width: 470 }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: 44, border: '3px dashed #DADADA', opacity: interpolate(frame, [4 + i * 4, 14 + i * 4], [0, 1], clamp) * (1 - s) }} />
              <div style={{ width: 470, padding: '44px 44px 36px', borderRadius: 44, background: hot ? color.ink : '#fff', color: hot ? '#fff' : color.ink,
                boxShadow: `0 0 0 ${5 * act}px ${color.yellow}, ${shadow.card}`, border: hot ? 'none' : `1px solid ${color.line}`, boxSizing: 'border-box',
                opacity: s, transform: `translateY(${(1 - s) * 90 - 18 * act}px) rotateX(${(1 - s) * 55}deg) scale(${(0.94 + 0.06 * s) * (1 + 0.035 * act)})`, transformOrigin: '50% 100%' }}>
                <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 50, letterSpacing: -1 }}>{p.name}</div>
                <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 112, letterSpacing: -5, marginTop: 14, color: hot ? color.yellow : color.ink, lineHeight: 1 }}>
                  {p.from && <span style={{ fontSize: 32, letterSpacing: 0, fontWeight: 500, marginRight: 10, color: 'rgba(255,255,255,0.7)' }}>desde</span>}
                  <CountUp to={p.price} decimals={2} from={p.f} dur={24} />
                  <span style={{ fontSize: 46, letterSpacing: -1 }}> €</span>
                </div>
                <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 30, color: hot ? 'rgba(255,255,255,0.65)' : color.muted, marginTop: 6 }}>al mes</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 34 }}>
                  {p.fill < 0 ? <InfinityIcon size={54} c={color.yellow} /> : <ClockIcon size={46} c={hot ? '#fff' : color.ink} />}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 38 }}>{p.hours}</div>
                    {p.fill >= 0 && (
                      <div style={{ height: 12, borderRadius: 6, background: hot ? 'rgba(255,255,255,0.18)' : '#EEE', marginTop: 10, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${p.fill * bar * 100}%`, background: color.yellow, borderRadius: 6 }} />
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ marginTop: 30, paddingTop: 24, borderTop: `1px solid ${hot ? 'rgba(255,255,255,0.15)' : color.line}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                  {[0, 1, 2, 3].map((k) => {
                    const lit = interpolate(frame, [fVez + k * 4, fVez + k * 4 + 10], [0, 1], clamp);
                    const on = k < p.sim ? Math.max(interpolate(frame, [fPerfiles, fPerfiles + 10], [0, 1], clamp) * (k === 0 ? 1 : 0), lit) : 0;
                    const shown = interpolate(frame, [fPerfiles + k * 3, fPerfiles + k * 3 + 10], [0, 1], clamp);
                    return (
                      <div key={k} style={{ width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: shown,
                        background: on > 0.5 ? color.yellow : hot ? 'rgba(255,255,255,0.1)' : '#F2F2F2', transform: `scale(${0.8 + 0.2 * shown})` }}>
                        <UserIcon size={32} c={on > 0.5 ? color.ink : hot ? 'rgba(255,255,255,0.45)' : '#B5B5B5'} />
                      </div>
                    );
                  })}
                  <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 26, marginLeft: 8, opacity: interpolate(frame, [fVez, fVez + 12], [0, 1], clamp), color: hot ? color.yellow : color.ink2, lineHeight: 1.1 }}>
                    {p.sim === 1 ? '1 a la vez' : '4 a la vez'}
                  </div>
                </div>
              </div>
              </div>
            );
          })}
        </div>
        <div style={{ height: 120, marginTop: 40, position: 'relative', width: 1500 }}>
          {/* «Ojo»: las horas cuentan igual leyendo que escuchando */}
          {frame >= fOjo - 2 && ojoOut < 1 && (
            <div style={{ position: 'absolute', left: '50%', top: 0, transform: `translate(-50%, ${(1 - sOjo) * 40 - ojoOut * 30}px) scale(${0.9 + 0.1 * sOjo})`, opacity: sOjo * (1 - ojoOut),
              display: 'flex', alignItems: 'center', gap: 22, padding: '20px 40px', borderRadius: 999, background: color.yellow, boxShadow: '0 16px 40px rgba(255,202,5,0.35)', fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink, whiteSpace: 'nowrap' }}>
              <span style={{ fontWeight: 700 }}>Ojo:</span> <BookIcon size={48} /> <span>leer</span> <span>=</span> <HeadphonesIcon size={48} /> <span>escuchar</span> <span style={{ fontWeight: 500 }}>· gastan las mismas horas</span>
            </div>
          )}
          {frame >= fPerfiles - 2 && (
            <div style={{ position: 'absolute', left: '50%', top: 0, transform: `translate(-50%, ${(1 - sPerf) * 40}px)`, opacity: sPerf,
              display: 'flex', alignItems: 'center', gap: 18, padding: '18px 36px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.float, fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.ink, whiteSpace: 'nowrap' }}>
              <UserIcon size={42} /> 4 perfiles en todos los planes
            </div>
          )}
        </div>
      </AbsoluteFill>
      {plans.map((p) => <Sfx key={p.name} name="card_flip" at={p.f} />)}
      <Sfx name="hit_soft" at={fOjo} />
      <Sfx name="ui_pop" at={fPerfiles} />
      <Sfx name="tick_soft" at={fVez} />
    </Stage>
  );
};
