import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Stage } from '../../components/Stage';
import { Sfx } from '../../components/Sfx';
import { CheckIcon, CrossIcon, HeadphonesIcon, MicIcon } from '../../components/Icons';
import { ClockIcon, DocIcon, LockIcon } from '../../components/Icons2';
import { wf } from './timeline';
import type { SceneProps } from './registry';
import { AppPhone, buildPhoneCam, Chip, CountUp, MaskTitle, PH, PhoneHalo, PHONE_W, PodimoLogo, PV, PV_DEEP, PV_SOFT, Sheen, Shot, SoloBadge, zoomPeaks } from './kit';

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
    <Stage tone="warm">
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
              fontFamily: font.sans, fontWeight: 700, fontSize: 28, color: color.ink, opacity: sInst, transform: `translateX(${(1 - sInst) * -24}px) scale(${0.85 + 0.15 * sInst})`, transformOrigin: 'left center' }}>
              <CheckIcon size={34} /> Instalada y probada a fondo
            </div>
          </div>
          <MaskTitle text="¿Merece la pena Podimo?" hi="Podimo?" at={lead - 2} size={122} stagger={4} />
          <div style={{ display: 'flex', gap: 16, marginTop: 50, minHeight: 64 }}>
            <Chip at={fPod - 3} dimAt={fAud - 3} label="Pódcasts exclusivos" icon={<MicIcon size={26} />} size={30} reserve />
            <Chip at={fAud - 3} dimAt={fLetra - 3} label="Audiolibros" icon={<HeadphonesIcon size={26} />} size={30} reserve />
            <Chip at={fLetra - 3} dimAt={fBueno - 3} label="Letra pequeña" icon={<DocIcon size={26} />} size={30} reserve />
          </div>
          <div style={{ display: 'flex', gap: 18, marginTop: 22, minHeight: 72 }}>
            <Chip at={fBueno - 3} label="Lo bueno" icon={<CheckIcon size={30} c={color.green} />} accent="#E3F5EA" size={36} reserve />
            <Chip at={fMalo - 3} label="Lo malo" icon={<CrossIcon size={30} />} accent="#FDECEC" size={36} reserve />
            <Chip at={fGratis - 3} label="30 días gratis" size={36} dark reserve />
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
    </Stage>
  );
};

// K02 · Qué es: app danesa en España desde 2020, el sello «Solo en Podimo» y miles de audiolibros. El móvil acompaña.
export const K02Que: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const at = (w: string, n = 0) => lead + wf('K02', w, n);
  const fDanesa = at('danesa');
  const fPod = at('podcasts');
  const fAud = at('audiolibros');
  const fEspana = at('espana');
  const fGancho = at('gancho');
  const fSello = at('sello');
  const fAdemas = at('ademas');
  const fMiles = at('miles');
  const A = usePhase(-10, fGancho - 6);
  const B = usePhase(fGancho - 6, fAdemas - 4);
  const C = usePhase(fAdemas - 4, dur + 20);
  const sLogo = useSpring(2);
  const sDk = useSpring(fDanesa - 4, 14, 170);
  const sEs = useSpring(fEspana - 4, 14, 170);
  const arrow = interpolate(frame, [fEspana - 8, fEspana + 8], [0, 1], { ...clamp, easing: easeOut });
  const sYear = useSpring(fEspana + 6, 12, 180);
  const sSello = useSpring(fSello - 4, 11, 170);
  const sMiles = useSpring(fMiles - 6, 14, 150);
  // El móvil: la portada; en el gancho, las portadas «Solo en podimo» de los pódcasts; en «miles», los audiolibros.
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
    <Stage tone="warm">
      <PhoneHalo cam={cam} cx={cx} />
      <div style={{ position: 'absolute', top, left: cx - PH.W / 2 }}>
        <AppPhone shots={shots} w={PHONE_W} cam={cam} dim={0.72} motionBlur float={[0, dur]} />
      </div>
      {A.visible && (
        <div style={{ position: 'absolute', left: 140, top: 0, height: 1080, width: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...A.style }}>
          <div style={{ opacity: sLogo, transform: `translateY(${(1 - sLogo) * 24}px)` }}>
            <PodimoLogo width={330} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 40, minHeight: 76 }}>
            <Chip at={fPod - 3} label="Pódcasts" icon={<MicIcon size={30} />} size={36} reserve />
            <Chip at={fAud - 3} label="Audiolibros" icon={<HeadphonesIcon size={30} />} size={36} reserve />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 26, marginTop: 44 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 26px', borderRadius: 26, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card,
              fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink, opacity: sDk, transform: `translateY(${(1 - sDk) * 30}px) scale(${0.9 + 0.1 * sDk})` }}>
              <FlagDK w={60} /> Copenhague
            </div>
            <svg width="110" height="40" viewBox="0 0 110 40" style={{ opacity: arrow }}>
              <path d={`M6 20 H ${6 + 86 * arrow}`} stroke={color.ink} strokeWidth="5" strokeLinecap="round" />
              <path d="M80 7 L96 20 L80 33" stroke={color.ink} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={arrow} />
            </svg>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 26px', borderRadius: 26, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card,
              fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink, opacity: sEs, transform: `translateY(${(1 - sEs) * 30}px) scale(${0.9 + 0.1 * sEs})` }}>
              <FlagES w={60} /> España
              <span style={{ marginLeft: 6, padding: '6px 16px', borderRadius: 999, background: color.yellow, fontSize: 34, transform: `scale(${sYear})`, display: 'inline-block' }}>2020</span>
            </div>
          </div>
        </div>
      )}
      {B.visible && (
        <div style={{ position: 'absolute', left: 140, top: 0, height: 1080, width: 1040, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...B.style }}>
          <MaskTitle text="Pódcasts que solo están aquí" hi="solo" at={fGancho - 4} size={92} />
          <div style={{ marginTop: 56, transform: `scale(${0.6 + 0.4 * sSello}) rotate(${(1 - sSello) * -8}deg)`, opacity: sSello, transformOrigin: 'left center' }}>
            <SoloBadge size={64} />
          </div>
        </div>
      )}
      {C.visible && (
        <div style={{ position: 'absolute', left: 140, top: 0, height: 1080, width: 1040, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...C.style }}>
          <MaskTitle text="Y, además, audiolibros" hi="audiolibros" at={fAdemas - 2} size={92} />
          <div style={{ marginTop: 44, display: 'flex', alignItems: 'baseline', gap: 22, fontFamily: font.sans, fontWeight: 700, color: color.ink, opacity: sMiles, transform: `translateY(${(1 - sMiles) * 40}px)` }}>
            <span style={{ fontSize: 150, letterSpacing: -6, lineHeight: 1 }}>Miles</span>
            <span style={{ fontSize: 48, color: color.ink2 }}>en español</span>
          </div>
        </div>
      )}
      <Sfx name="ui_pop" at={fPod - 2} />
      <Sfx name="ui_pop" at={fAud - 2} />
      <Sfx name="snap_in" at={fDanesa} volume={0.7} />
      <Sfx name="swipe" at={fEspana - 2} volume={0.6} />
      <Sfx name="tick_soft" at={fEspana + 8} />
      <Sfx name="whoosh_soft" at={fGancho - 10} />
      <Sfx name="stamp" at={fSello + 2} volume={0.7} />
      {zoomPeaks(cam, 2, dur - 2).map((f) => <Sfx key={`z${f}`} name="zoom_in" at={f} volume={0.4} />)}
      <Sfx name="whoosh_soft" at={fAdemas - 8} />
      <Sfx name="hit_soft" at={fMiles - 2} volume={0.7} />
    </Stage>
  );
};

// K03 · Planes: Premium y Premium Plus se voltean al nombrarlos (la que suena se adelanta con un aro); después, el pago
// anual bajo cada tarjeta y, al final, Podimo Free (solo pódcasts abiertos).
export const K03Planes: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('K03', w, n);
  const fPrem = at('premium');
  const fVeinte = at('veinte');
  const fPods = at('podcasts');
  const fPlus = at('plus');
  const fCien = at('cien');
  const fAno = at('ano');
  const fFree = at('free');
  const fAbiertos = at('abiertos');
  const plans = [
    { name: 'Premium', price: 4.99, hours: 20, f: fPrem, fh: fVeinte, year: '49,99 €', tag: 'El más popular' },
    { name: 'Premium Plus', price: 9.99, hours: 100, f: fPlus, fh: fCien, year: '99,99 €', tag: '' },
  ];
  const activeAt = (i: number) => {
    const win = [[fPrem - 6, fPlus - 6], [fPlus - 6, fAno - 6]][i];
    return interpolate(frame, [win[0], win[0] + 8, win[1] - 6, win[1]], [0, 1, 1, 0], clamp);
  };
  const sFree = spring({ frame: frame - fFree + 4, fps, config: { damping: 15, stiffness: 150 } });
  const freeAct = interpolate(frame, [fFree, fFree + 8], [0, 1], clamp);
  const sPods = spring({ frame: frame - fPods + 2, fps, config: { damping: 14, stiffness: 180 } });
  const lockIn = spring({ frame: frame - fAbiertos, fps, config: { damping: 11, stiffness: 200 } });
  const lift = interpolate(frame, [fFree - 10, fFree + 6], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `translateY(${-24 * lift}px)` }}>
        <MaskTitle text="Dos planes" hi="planes" at={2} size={78} align="center" style={{ marginBottom: 50 }} />
        <div style={{ display: 'flex', gap: 44, perspective: 2200, alignItems: 'flex-end' }}>
          {plans.map((p, i) => {
            const s = spring({ frame: frame - p.f + 6, fps, config: { damping: 15, stiffness: 140 } });
            const bar = interpolate(frame, [p.fh - 2, p.fh + 26], [0, 1], { ...clamp, easing: easeOut });
            const act = activeAt(i);
            const hot = i === 1;
            const sYear = spring({ frame: frame - fAno - i * 10, fps, config: { damping: 14, stiffness: 170 } });
            const dimFree = 1 - 0.35 * freeAct;
            return (
              <div key={p.name} style={{ position: 'relative', width: 560, opacity: dimFree }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: 44, border: '3px dashed #DADADA', opacity: interpolate(frame, [4 + i * 4, 14 + i * 4], [0, 1], clamp) * (1 - s) }} />
                <div style={{ position: 'relative', width: 560, padding: '42px 46px 36px', borderRadius: 44, background: hot ? color.ink : '#fff', color: hot ? '#fff' : color.ink,
                  boxShadow: `0 0 0 ${5 * act}px ${color.yellow}, ${shadow.card}`, border: hot ? 'none' : `1px solid ${color.line}`, boxSizing: 'border-box',
                  opacity: s, transform: `translateY(${(1 - s) * 90 - 18 * act}px) rotateX(${(1 - s) * 55}deg) scale(${(0.94 + 0.06 * s) * (1 + 0.035 * act)})`, transformOrigin: '50% 100%' }}>
                  <Sheen at={p.f + 2} tint={hot ? 'rgba(168,155,237,0.28)' : 'rgba(168,155,237,0.30)'} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 48, letterSpacing: -1 }}>{p.name}</div>
                    {p.tag && <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 22, padding: '8px 16px', borderRadius: 999, background: PV_SOFT, color: PV_DEEP }}>{p.tag}</div>}
                  </div>
                  <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 112, letterSpacing: -5, marginTop: 12, color: hot ? PV : color.ink, lineHeight: 1 }}>
                    <CountUp to={p.price} decimals={2} from={p.f} dur={24} />
                    <span style={{ fontSize: 46, letterSpacing: -1 }}> €</span>
                    <span style={{ fontSize: 30, letterSpacing: 0, fontWeight: 500, marginLeft: 12, color: hot ? 'rgba(255,255,255,0.65)' : color.muted }}>al mes</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 30 }}>
                    <ClockIcon size={46} c={hot ? '#fff' : color.ink} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 36 }}>{p.hours} h de audiolibros al mes</div>
                      <div style={{ height: 12, borderRadius: 6, background: hot ? 'rgba(255,255,255,0.18)' : '#EEE', marginTop: 10, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(p.hours / 100) * bar * 100}%`, background: PV, borderRadius: 6 }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 26, paddingTop: 22, borderTop: `1px solid ${hot ? 'rgba(255,255,255,0.15)' : color.line}`,
                    fontFamily: font.sans, fontWeight: 700, fontSize: 30, opacity: i === 0 ? sPods : interpolate(frame, [fPlus + 10, fPlus + 22], [0, 1], clamp) }}>
                    <MicIcon size={34} c={hot ? '#fff' : color.ink} /> Todos sus pódcasts, sin anuncios
                  </div>
                </div>
                {/* Pago anual, bajo la tarjeta */}
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: -84, display: 'flex', justifyContent: 'center', opacity: sYear, transform: `translateY(${(1 - sYear) * -20}px)` }}>
                  <div style={{ padding: '12px 26px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.soft, fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.ink }}>
                    o <span style={{ color: PV_DEEP }}>{p.year}</span> al año
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Podimo Free */}
        <div style={{ marginTop: 130, display: 'flex', alignItems: 'center', gap: 22, padding: '20px 34px', borderRadius: 30, background: '#fff', border: `1px solid ${color.line}`,
          boxShadow: `0 0 0 ${4 * freeAct}px ${color.yellow}, ${shadow.float}`, opacity: sFree, transform: `translateY(${(1 - sFree) * 50}px) scale(${0.9 + 0.1 * sFree})`,
          fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.ink }}>
          <span style={{ padding: '6px 18px', borderRadius: 999, background: color.ink, color: '#fff', fontSize: 30 }}>Podimo Free</span>
          0 € · solo los pódcasts abiertos
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: color.muted, fontSize: 30, opacity: lockIn, transform: `scale(${0.7 + 0.3 * lockIn})` }}>
            <LockIcon size={34} c={color.muted} /> sin exclusivos ni audiolibros
          </span>
        </div>
      </AbsoluteFill>
      {plans.map((p) => <Sfx key={p.name} name="card_flip" at={p.f + 4} />)}
      <Sfx name="ui_pop" at={fPods} volume={0.6} />
      <Sfx name="tick_soft" at={fAno + 2} />
      <Sfx name="tick_soft" at={fAno + 12} volume={0.8} />
      <Sfx name="ui_pop" at={fFree - 2} />
      <Sfx name="cross" at={fAbiertos + 1} volume={0.6} />
    </Stage>
  );
};
