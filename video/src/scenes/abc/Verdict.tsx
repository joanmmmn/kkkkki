import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { ChangeTicks, Sfx } from '../../components/Sfx';
import { BookIcon, CheckIcon, CrossIcon, HeadphonesIcon } from '../../components/Icons';
import { BookmarkIcon, ClockIcon, GlobeIcon, InfinityIcon, LockIcon, SearchIcon, UserIcon } from '../../components/Icons2';
import { wf } from './timeline';
import type { SceneProps } from './registry';
import { AB, AB_DEEP, AB_HOT, AB_INK, AB_SOFT, AbcStage, CreditCoin, MaskTitle, Odometer, odometerProgress, odometerShown, Sheen } from './kit';

type P = SceneProps;

// Reproductor en miniatura (portada naranja con ecualizador, título y barra) para las tarjetas de dispositivos.
const NowPlaying: React.FC<{ w: number; h: number; frame: number; seed: number; vertical?: boolean }> = ({ w, h, frame, seed, vertical = false }) => {
  const bars = [0, 1, 2, 3];
  const eq = (i: number) => 0.35 + 0.65 * Math.abs(Math.sin(frame / (5.2 + i * 0.9) + seed + i * 1.7));
  const m = Math.min(w, h);
  const cover = vertical ? w * 0.62 : h * 0.5;
  return (
    <div style={{ width: w, height: h, borderRadius: m * 0.12, background: 'linear-gradient(160deg, #222 0%, #0b0b0b 100%)', display: 'flex', flexDirection: vertical ? 'column' : 'row',
      alignItems: 'center', justifyContent: 'center', gap: m * 0.1, padding: m * 0.08, boxSizing: 'border-box', overflow: 'hidden' }}>
      <div style={{ width: cover, height: cover, borderRadius: cover * 0.14, background: `linear-gradient(135deg, ${AB_HOT} 0%, ${AB} 100%)`, flexShrink: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: cover * 0.06, paddingBottom: cover * 0.16, boxSizing: 'border-box' }}>
        {bars.map((i) => <div key={i} style={{ width: cover * 0.1, height: cover * 0.5 * eq(i), borderRadius: cover * 0.05, background: '#fff' }} />)}
      </div>
      <div style={{ flex: vertical ? undefined : 1, width: vertical ? '100%' : undefined, display: 'flex', flexDirection: 'column', gap: m * 0.06 }}>
        <div style={{ height: m * 0.07, width: '80%', borderRadius: 99, background: 'rgba(255,255,255,0.85)' }} />
        <div style={{ height: m * 0.05, width: '55%', borderRadius: 99, background: 'rgba(255,255,255,0.35)' }} />
        <div style={{ position: 'relative', height: Math.max(3, m * 0.035), width: '100%', borderRadius: 99, background: 'rgba(255,255,255,0.18)', marginTop: m * 0.04 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(30 + ((frame * 0.25 + seed * 20) % 60)).toFixed(1)}%`, borderRadius: 99, background: AB }} />
        </div>
      </div>
    </div>
  );
};

// Escena de cada tarjeta: Android (móvil con barra de navegación), iPhone (con la isla), coche (salpicadero) y navegador (portátil).
const DeviceArt: React.FC<{ kind: 0 | 1 | 2 | 3; s: number; act: number; frame: number }> = ({ kind, s, act, frame }) => {
  const rise = (d: number) => `translateY(${((1 - Math.min(1, s * 1.15 - d)) * 40).toFixed(2)}px)`;
  if (kind === 0 || kind === 1) {
    return (
      <div style={{ position: 'relative', width: 340, height: 240 }}>
        <div style={{ position: 'absolute', left: 110, top: 0, width: 124, height: 236, borderRadius: kind === 1 ? 26 : 18, background: '#2a2b30', padding: 7, boxSizing: 'border-box', boxShadow: '0 24px 50px rgba(16,16,16,0.3)',
          transform: `${rise(0)} rotate(${((kind === 0 ? -4 : 4) * act).toFixed(2)}deg)` }}>
          <NowPlaying w={110} h={222} frame={frame} seed={kind * 2 + 1} vertical />
          {kind === 1 && <div style={{ position: 'absolute', left: 44, top: 12, width: 36, height: 9, borderRadius: 5, background: '#0b0b0b' }} />}
          {kind === 0 && <div style={{ position: 'absolute', left: 40, bottom: 12, width: 44, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.6)' }} />}
        </div>
      </div>
    );
  }
  if (kind === 2) {
    return (
      <div style={{ position: 'relative', width: 340, height: 240 }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 136, height: 104, borderRadius: '50% 50% 22px 22px / 60% 60% 22px 22px', background: 'linear-gradient(180deg, #F4ECE2 0%, #E8DCCE 100%)', transform: rise(0) }} />
        <div style={{ position: 'absolute', left: 50, top: 34, width: 240, height: 146, borderRadius: 20, background: '#2a2b30', padding: 8, boxSizing: 'border-box', boxShadow: '0 24px 50px rgba(16,16,16,0.25)', transform: rise(0.1) }}>
          <NowPlaying w={224} h={130} frame={frame} seed={4} />
        </div>
        {[16, 294].map((x) => (
          <div key={x} style={{ position: 'absolute', left: x, top: 82, width: 30, height: 56, borderRadius: 9, background: '#DCCFC0', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6, padding: '0 5px', boxSizing: 'border-box', transform: rise(0.15) }}>
            {[0, 1, 2].map((k) => <div key={k} style={{ height: 4, borderRadius: 2, background: '#C2B19E' }} />)}
          </div>
        ))}
      </div>
    );
  }
  // Navegador: portátil con una ventana (barra con los tres puntos y la dirección) y el reproductor web.
  return (
    <div style={{ position: 'relative', width: 340, height: 240 }}>
      <div style={{ position: 'absolute', left: 40, top: 20, width: 260, height: 170, borderRadius: 14, background: '#2a2b30', padding: 8, boxSizing: 'border-box', boxShadow: '0 24px 50px rgba(16,16,16,0.25)', transform: rise(0) }}>
        <div style={{ width: '100%', height: '100%', borderRadius: 8, background: '#fff', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 22, background: '#EEE', display: 'flex', alignItems: 'center', gap: 5, padding: '0 8px' }}>
            {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} style={{ width: 7, height: 7, borderRadius: '50%', background: c }} />)}
            <span style={{ marginLeft: 8, flex: 1, height: 10, borderRadius: 5, background: '#fff' }} />
          </div>
          <div style={{ flex: 1, padding: 8, background: '#111' }}><NowPlaying w={228} h={112} frame={frame} seed={6} /></div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 14, top: 190, width: 312, height: 16, borderRadius: '4px 4px 12px 12px', background: 'linear-gradient(180deg, #3a3b42 0%, #24252a 100%)', transform: rise(0.05) }} />
    </div>
  );
};

// Personita para el plan familiar (cabeza y hombros), con su marcador propio.
const Person: React.FC<{ s: number; tint: string; mark: number; label: string; size?: number }> = ({ s, tint, mark, label, size = 150 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: Math.min(1, s * 1.4), transform: `translateY(${((1 - s) * 40).toFixed(2)}px) scale(${(0.7 + 0.3 * s).toFixed(4)})` }}>
    <div style={{ position: 'relative', width: size, height: size, borderRadius: '50%', background: tint, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: shadow.soft }}>
      <UserIcon size={size * 0.56} c="#fff" />
      <div style={{ position: 'absolute', right: -8, bottom: -6, width: size * 0.36, height: size * 0.36, borderRadius: '50%', background: '#fff', border: `1px solid ${color.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: `scale(${mark.toFixed(4)})`, boxShadow: shadow.soft }}>
        <BookmarkIcon size={size * 0.2} c={AB_DEEP} />
      </div>
    </div>
    <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.ink2 }}>{label}</div>
  </div>
);

// D09 · Plan familiar (gratis, hasta 2 personas de tu casa, cada una con sus marcadores) y dispositivos: Android, iPhone, el coche
// (CarPlay y Android Auto) y el navegador.
export const D09Familia: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('D09', w, n);
  const fComp = at('compartes');
  const fGratis = at('gratis');
  const fHasta = at('hasta');
  const fDos = at('dos');
  const fCasa = at('casa');
  const fMarc = at('marcadores');
  const fFunc = at('funciona');
  const items = [
    { f: at('android'), title: 'Android', sub: 'Móvil y tablet' },
    { f: at('iphone'), title: 'iPhone', sub: 'Y iPad' },
    { f: at('coche'), title: 'En el coche', sub: 'CarPlay · Android Auto' },
    { f: at('navegador'), title: 'Navegador', sub: 'Desde su web' },
  ];
  const out = interpolate(frame, [fFunc - 10, fFunc + 4], [0, 1], { ...clamp, easing: easeInOut });
  const sTitle = spring({ frame: frame - (fComp - 6), fps, config: { damping: 15, stiffness: 160 } });
  const sFree = spring({ frame: frame - (fGratis - 2), fps, config: { damping: 11, stiffness: 210 } });
  const sMe = spring({ frame: frame - (fComp + 4), fps, config: { damping: 13, stiffness: 180 } });
  const sP1 = spring({ frame: frame - (fDos - 4), fps, config: { damping: 12, stiffness: 190 } });
  const sP2 = spring({ frame: frame - (fDos + 4), fps, config: { damping: 12, stiffness: 190 } });
  const mk = (k: number) => spring({ frame: frame - (fMarc - 4 + k * 5), fps, config: { damping: 10, stiffness: 220 } });
  const house = interpolate(frame, [fCasa - 6, fCasa + 14], [0, 1], { ...clamp, easing: easeOut });
  const sMarc = spring({ frame: frame - (fMarc - 2), fps, config: { damping: 14, stiffness: 180 } });
  const CW = 400;
  const GAP = 32;
  const nAdd = [1, 2, 3].reduce((a, i) => a + spring({ frame: frame - (items[i].f - 10), fps, config: { damping: 18, stiffness: 120 } }), 0);
  return (
    <AbcStage>
      {/* Plan familiar: título arriba, la casa que se dibuja con «de tu casa» y, dentro, tú y dos personas más, cada una con su marcador. */}
      {out < 1 && (
        <AbsoluteFill style={{ opacity: 1 - out, transform: `translateY(${(-80 * out).toFixed(2)}px) scale(${(1 - 0.08 * out).toFixed(4)})`, filter: out > 0.02 ? `blur(${(out * 8).toFixed(2)}px)` : undefined }}>
          <div style={{ position: 'absolute', top: 96, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 26, opacity: sTitle, transform: `translateY(${((1 - sTitle) * 30).toFixed(2)}px)` }}>
            <MaskTitle text="Plan familiar" hi="familiar" at={fComp - 6} size={100} />
            <div style={{ padding: '12px 26px', borderRadius: 999, background: color.green, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 44,
              opacity: sFree, transform: `scale(${(0.5 + 0.5 * sFree).toFixed(4)}) rotate(${((1 - sFree) * -10).toFixed(2)}deg)` }}>Gratis</div>
          </div>
          <div style={{ position: 'absolute', left: 960 - 420, top: 250, width: 840, height: 540 }}>
            <svg width="840" height="540" viewBox="0 0 840 540" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
              <path d="M30 220 L420 36 L810 220" pathLength={1} fill="none" stroke={AB} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1 - Math.min(1, house * 1.6)} />
              <path d="M96 196 V518 H744 V196" pathLength={1} fill="none" stroke={AB} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1 - Math.max(0, house * 1.6 - 0.6)} opacity={0.85} />
            </svg>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 236, display: 'flex', justifyContent: 'center', gap: 64 }}>
              <Person s={sMe} tint={color.ink} mark={mk(0)} label="Tú" size={170} />
              <Person s={sP1} tint={AB} mark={mk(1)} label="+1" size={170} />
              <Person s={sP2} tint={AB_HOT} mark={mk(2)} label="+1" size={170} />
            </div>
          </div>
          <div style={{ position: 'absolute', top: 852, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 28px 14px 18px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.float,
              fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.ink, opacity: interpolate(frame, [fHasta - 4, fHasta + 6], [0, 1], clamp) }}>
              <UserIcon size={40} /> Hasta 2 personas de tu casa
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 28px 14px 18px', borderRadius: 999, background: AB_SOFT, border: '2px solid rgba(255,80,28,0.35)', boxShadow: shadow.float,
              fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.ink, opacity: sMarc, transform: `translateY(${((1 - sMarc) * 20).toFixed(2)}px)` }}>
              <BookmarkIcon size={40} c={AB_DEEP} /> Cada una, con sus marcadores
            </div>
          </div>
        </AbsoluteFill>
      )}
      {/* Dispositivos */}
      {frame >= fFunc - 12 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 30 }}>
          <MaskTitle text="¿Dónde funciona?" hi="funciona" at={fFunc - 8} size={92} align="center" />
          <div style={{ display: 'flex', gap: GAP, marginTop: 54, perspective: 2200, transform: `translateX(${((3 - nAdd) * (CW + GAP) / 2).toFixed(2)}px)` }}>
            {items.map((it, i) => {
              const s = spring({ frame: frame - it.f + 5, fps, config: { damping: 14, stiffness: 150 } });
              const next = i < items.length - 1 ? items[i + 1].f : it.f + 60;
              const act = interpolate(frame, [it.f - 2, it.f + 8, next - 6, next], [0, 1, 1, 0], clamp);
              if (frame < it.f - 8) return <div key={it.title} style={{ width: CW, height: 440 }} />;
              return (
                <div key={it.title} style={{ position: 'relative', width: CW, height: 440, borderRadius: 44, background: '#fff', border: `1px solid ${color.line}`,
                  boxShadow: `0 0 0 ${(5 * act).toFixed(2)}px ${color.yellow}, 0 ${(40 + 24 * act).toFixed(1)}px ${(90 + 20 * act).toFixed(1)}px rgba(16,16,16,${(0.11 + 0.05 * act).toFixed(3)})`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 38, boxSizing: 'border-box', overflow: 'hidden',
                  opacity: Math.min(1, s * 1.3), transform: `translateY(${((1 - s) * 90 - 14 * act).toFixed(2)}px) rotateY(${((1 - s) * (i < 2 ? -30 : 30)).toFixed(2)}deg) scale(${((0.92 + 0.08 * s) * (1 + 0.025 * act)).toFixed(4)})` }}>
                  <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 260, background: `radial-gradient(ellipse at 50% 60%, rgba(255,80,28,${(0.06 + 0.1 * act).toFixed(3)}) 0%, rgba(255,80,28,0) 65%)` }} />
                  <div style={{ position: 'absolute', left: 30, top: 32 }}><DeviceArt kind={i as 0 | 1 | 2 | 3} s={s} act={act} frame={frame} /></div>
                  <Sheen at={it.f + 4} radius={44} tint="rgba(255,80,28,0.22)" />
                  <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 700, fontSize: 42, color: color.ink, letterSpacing: -0.8 }}>{it.title}</div>
                  <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 500, fontSize: 28, color: color.ink2, marginTop: 8 }}>{it.sub}</div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}
      <Sfx name="ui_pop" at={fComp - 4} volume={0.6} />
      <Sfx name="stamp" at={fGratis + 2} volume={0.55} />
      <Sfx name="snap_in" at={fComp + 6} volume={0.5} />
      <Sfx name="snap_in" at={fDos - 2} volume={0.6} />
      <Sfx name="snap_in" at={fDos + 6} volume={0.6} />
      <Sfx name="draw" at={fCasa - 4} volume={0.4} dur={20} fade={6} />
      {[0, 1, 2].map((k) => <Sfx key={`m${k}`} name="tick_soft" at={fMarc - 2 + k * 5} volume={0.6} />)}
      <Sfx name="whoosh_soft" at={fFunc - 10} volume={0.6} />
      {items.map((it) => <Sfx key={it.title} name="snap_in" at={it.f + 3} volume={0.8} />)}
      {items.map((it) => <Sfx key={`w${it.title}`} name="whoosh_soft" at={it.f - 2} volume={0.35} />)}
    </AbcStage>
  );
};

// Estrellas de una valoración (0–5), rellenas hasta `v`.
const Stars: React.FC<{ v: number; size: number; c: string }> = ({ v, size, c }) => (
  <div style={{ display: 'flex', gap: size * 0.12 }}>
    {[0, 1, 2, 3, 4].map((i) => {
      const fill = Math.max(0, Math.min(1, v - i));
      return (
        <div key={i} style={{ position: 'relative', width: size, height: size }}>
          <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: 'absolute', inset: 0 }}><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z" fill="#E6E6E6" /></svg>
          <div style={{ position: 'absolute', inset: 0, width: `${fill * 100}%`, overflow: 'hidden' }}>
            <svg width={size} height={size} viewBox="0 0 24 24"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z" fill={c} /></svg>
          </div>
        </div>
      );
    })}
  </div>
);

// D10 · Opiniones: Google Play 4,3 (más de 64.000 reseñas) y App Store España 4,5, pero con unas 200 valoraciones frente a las
// 36.000 de Audible (barras a escala); gusta la variedad del catálogo; las quejas, por cobros y fallos al escuchar sin conexión.
export const D10Opiniones: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('D10', w, n);
  const fGoogle = at('google');
  const fCuatro = at('cuatro');
  const fApp = at('app');
  const fCuatro2 = at('cuatro', 1);
  const fAunque = at('aunque');
  const fDoscientas = at('doscientas');
  const fFrente = at('frente');
  const fTreinta = at('treinta');
  const fAudible = at('audible');
  const fGusta = at('gusta');
  const fVariedad = at('variedad');
  const fQuejas = at('quejas');
  const fCobros = at('cobros');
  const fFallos = at('fallos');
  const sG = spring({ frame: frame - fGoogle + 4, fps, config: { damping: 15, stiffness: 150 } });
  const sA = spring({ frame: frame - fApp + 4, fps, config: { damping: 15, stiffness: 150 } });
  const atG = fCuatro - 6;
  const atA = fCuatro2 - 6;
  const vG = 4.3 * Math.min(1, odometerProgress(frame, atG, fps, 34));
  const vA = 4.5 * Math.min(1, odometerProgress(frame, atA, fps, 34));
  const actG = interpolate(frame, [fGoogle, fGoogle + 8, fApp - 6, fApp], [0, 1, 1, 0], clamp);
  const actA = interpolate(frame, [fApp, fApp + 8, fGusta - 8, fGusta], [0, 1, 1, 0], clamp);
  const up = interpolate(frame, [fGusta - 10, fGusta + 8], [0, 1], { ...clamp, easing: easeInOut });
  // Barras de valoraciones (App Store España): Audiobooks.com ~200 frente a Audible ~36.000, a escala.
  const sBars = spring({ frame: frame - (fAunque - 4), fps, config: { damping: 16, stiffness: 150 } });
  const growA = interpolate(frame, [fDoscientas - 2, fDoscientas + 14], [0, 1], { ...clamp, easing: easeOut });
  const growB = interpolate(frame, [fTreinta - 4, fAudible + 6], [0, 1], { ...clamp, easing: easeInOut });
  const barsOut = interpolate(frame, [fGusta - 10, fGusta + 4], [0, 1], { ...clamp, easing: easeInOut });
  const sLike = spring({ frame: frame - fGusta + 2, fps, config: { damping: 14, stiffness: 170 } });
  const sCrit = spring({ frame: frame - fQuejas + 2, fps, config: { damping: 14, stiffness: 170 } });
  const like2 = interpolate(frame, [fVariedad - 2, fVariedad + 10], [0, 1], { ...clamp, easing: easeOut });
  const crit2 = interpolate(frame, [fCobros - 2, fCobros + 10], [0, 1], { ...clamp, easing: easeOut });
  const crit3 = interpolate(frame, [fFallos - 4, fFallos + 8], [0, 1], { ...clamp, easing: easeOut });
  const BW = 1100;
  const card = (title: string, v: number, val: string, oAt: number, sub: string, s: number, act: number) => {
    const on = frame >= oAt - 1;
    return (
      <div style={{ position: 'relative', width: 620, padding: '40px 50px', borderRadius: 48, background: '#fff', border: `1px solid ${color.line}`,
        boxShadow: `0 0 0 ${(5 * act).toFixed(2)}px ${color.yellow}, 0 ${(40 + 24 * act).toFixed(1)}px 100px rgba(16,16,16,${(0.11 + 0.05 * act).toFixed(3)})`,
        opacity: Math.min(1, s * 1.3), transform: `translateY(${((1 - s) * 80 - 14 * act).toFixed(2)}px) scale(${((0.92 + 0.08 * s) * (1 + 0.03 * act)).toFixed(4)})` }}>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink2 }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 10, fontFamily: font.sans, fontWeight: 700, color: color.ink }}>
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <Odometer text={val} at={oAt} size={160} dur={34} style={{ letterSpacing: -7 }} />
            {!on && <span style={{ position: 'absolute', left: 0, right: 8, top: '16%', bottom: '8%', borderRadius: 28, background: 'linear-gradient(100deg, #EDEDED 35%, #F9F9F9 50%, #EDEDED 65%)',
              backgroundSize: '300% 100%', backgroundPosition: `${100 - ((frame * 2.4) % 100)}% 0` }} />}
          </span>
          <span style={{ fontSize: 44, color: color.muted }}>/ 5</span>
        </div>
        <div style={{ marginTop: 18 }}><Stars v={v} size={56} c={AB} /></div>
        <div style={{ marginTop: 20, fontFamily: font.sans, fontWeight: 500, fontSize: 31, color: color.ink2, minHeight: 40 }}>{sub}</div>
      </div>
    );
  };
  const pill = (good: boolean, s: number, lead2: string, rest: React.ReactNode, p2: number) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '20px 34px 20px 22px', borderRadius: 28, background: good ? '#E9F7EF' : '#FDECEC', border: `2px solid ${good ? 'rgba(31,157,85,0.35)' : 'rgba(229,72,77,0.35)'}`,
      fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink, opacity: s, transform: `translateY(${((1 - s) * 40).toFixed(2)}px) scale(${(0.9 + 0.1 * s).toFixed(4)})`, boxShadow: shadow.soft }}>
      {good ? <CheckIcon size={50} /> : <CrossIcon size={50} />}
      <span style={{ color: good ? color.green : color.red }}>{lead2}</span>
      <span style={{ opacity: p2, transform: `translateX(${((1 - p2) * -14).toFixed(2)}px)`, display: 'inline-block' }}>{rest}</span>
    </div>
  );
  const bar = (label: string, n: string, w: number, grow: number, c: string, hot: boolean) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
      <div style={{ width: 270, textAlign: 'right', fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: hot ? color.ink : color.ink2 }}>{label}</div>
      <div style={{ position: 'relative', width: BW - 300, height: 44 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: Math.max(8, (BW - 300) * w * grow), borderRadius: 22, background: c }} />
        <div style={{ position: 'absolute', left: Math.max(8, (BW - 300) * w * grow) + 16, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: color.ink,
          opacity: interpolate(grow, [0.6, 1], [0, 1], clamp), whiteSpace: 'nowrap' }}>{n}</div>
      </div>
    </div>
  );
  return (
    <AbcStage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', top: 92, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: 1 - up, transform: `translateY(${(-40 * up).toFixed(2)}px)` }}>
          <MaskTitle text="¿Qué opinan los usuarios?" hi="opinan" at={2} size={80} align="center" />
        </div>
        <div style={{ position: 'absolute', top: 250, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 48,
          transform: `translateY(${(-24 * up).toFixed(2)}px) scale(${(1 - 0.22 * up).toFixed(4)}) translateX(${((1 - Math.min(1, sA)) * 334).toFixed(2)}px)`, transformOrigin: '50% 0%' }}>
          {card('Google Play', vG, '4,3', atG, frame >= fCuatro + 20 ? 'Más de 64.000 reseñas' : '', sG, actG)}
          {card('App Store (España)', vA, '4,5', atA, frame >= fDoscientas - 4 ? 'Solo unas 200 valoraciones' : '', sA, actA)}
        </div>
        {/* Valoraciones en la App Store española: a escala. */}
        {frame >= fAunque - 6 && barsOut < 1 && (
          <div style={{ position: 'absolute', top: 760, left: (1920 - BW) / 2, width: BW, display: 'flex', flexDirection: 'column', gap: 18, opacity: sBars * (1 - barsOut),
            transform: `translateY(${((1 - sBars) * 30 + 20 * barsOut).toFixed(2)}px)` }}>
            {bar('Audiobooks.com', '~200', 200 / 36000, growA, AB, true)}
            {bar('Audible', '~36.000', 1, growB, color.ink, false)}
          </div>
        )}
        <div style={{ position: 'absolute', top: 640, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          {frame >= fGusta - 4 && pill(true, sLike, 'Gusta:', 'la variedad del catálogo', like2)}
          {frame >= fQuejas - 4 && pill(false, sCrit, 'Quejas:', <>cobros <span style={{ opacity: crit3 }}>y fallos al escuchar sin conexión</span></>, crit2)}
        </div>
      </AbsoluteFill>
      <Sfx name="ui_pop" at={fGoogle - 2} />
      <ChangeTicks value={(f) => odometerShown('4,3', atG, fps, f, 34)} from={atG} to={atG + 44} volume={0.6} />
      <Sfx name="ui_pop" at={fApp - 2} />
      <ChangeTicks value={(f) => odometerShown('4,5', atA, fps, f, 34)} from={atA} to={atA + 44} volume={0.6} />
      <Sfx name="ui_pop" at={fAunque - 2} volume={0.5} />
      <Sfx name="draw" at={fDoscientas - 2} volume={0.35} dur={12} fade={4} />
      <Sfx name="draw" at={fTreinta - 4} volume={0.45} dur={Math.max(16, fAudible + 6 - fTreinta)} fade={8} />
      <Sfx name="hit_soft" at={fFrente} volume={0.5} />
      <Sfx name="whoosh_soft" at={fGusta - 8} volume={0.5} />
      <Sfx name="success" at={fGusta + 2} volume={0.55} />
      <Sfx name="hit_soft" at={fQuejas + 1} volume={0.7} />
      <Sfx name="tick_soft" at={fFallos - 2} volume={0.6} />
    </AbcStage>
  );
};

// D11 · Lo bueno y lo malo: dos columnas con cuatro huecos que se llenan al ritmo de la voz.
export const D11ProsCons: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('D11', w, n);
  const pros = [
    { f: at('libro'), t: 'El libro es tuyo para siempre' },
    { f: at('catalogo'), t: 'Catálogo enorme, con novedades en español' },
    { f: at('diez'), t: '10.000 audiolibros gratis' },
    { f: at('plan'), t: 'Plan familiar' },
  ];
  const cons = [
    { f: at('todo'), t: 'Todo en inglés' },
    { f: at('paga'), t: 'Se paga en dólares' },
    { f: at('credito'), t: 'Un crédito al mes da para poco' },
    { f: at('desde'), t: 'Desde la app: 17,95 €/mes, sin prueba' },
  ];
  const fBueno = at('bueno');
  const fMalo = at('malo');
  const col = (title: string, good: boolean, list: { f: number; t: string }[], k: number) => {
    const s = spring({ frame: frame - 2 - k * 5, fps, config: { damping: 16, stiffness: 140 } });
    const dim = good ? interpolate(frame, [fMalo - 6, fMalo + 6], [0, 1], clamp) : interpolate(frame, [fMalo - 6, fMalo + 6], [1, 0], clamp);
    const hc = good ? color.green : color.red;
    const tint = good ? 'rgba(31,157,85,0.09)' : 'rgba(229,72,77,0.08)';
    const head = spring({ frame: frame - (good ? fBueno : fMalo) + 2, fps, config: { damping: 12, stiffness: 200 } });
    return (
      <div style={{ width: 820, borderRadius: 44, background: '#fff', boxShadow: shadow.card, border: `1px solid ${color.line}`, overflow: 'hidden',
        opacity: s * (1 - 0.5 * dim), transform: `translateY(${(1 - s) * 70}px) scale(${1 - 0.03 * dim})`, filter: dim > 0.05 ? `saturate(${1 - 0.6 * dim})` : undefined }}>
        <div style={{ padding: '28px 44px', background: hc, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 52, display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ transform: `scale(${0.7 + 0.3 * head}) rotate(${(1 - head) * -60}deg)`, display: 'inline-flex' }}>{good ? <CheckIcon size={56} c="#fff" fg={hc} /> : <CrossIcon size={56} c="#fff" fg={hc} />}</span>
          {title}
        </div>
        <div style={{ padding: '14px 26px 22px' }}>
          {list.map((it, i) => {
            const si = spring({ frame: frame - it.f + 3, fps, config: { damping: 15, stiffness: 190 } });
            const next = i < list.length - 1 ? list[i + 1].f : good ? fMalo : dur + 40;
            const act = interpolate(frame, [it.f, it.f + 6, next - 6, next], [0, 1, 1, 0], clamp);
            return (
              <div key={i} style={{ position: 'relative', height: 92, borderBottom: i < list.length - 1 ? `1px solid ${color.line}` : 'none', display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'absolute', left: 18, right: 120, height: 16, borderRadius: 8, background: '#F2F2F2', opacity: 1 - si }} />
                <div style={{ position: 'absolute', inset: '8px 0', borderRadius: 20, background: tint, opacity: act }} />
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 20, padding: '0 18px', opacity: si, transform: `translateX(${(1 - si) * (good ? -36 : 36)}px)` }}>
                  <span style={{ display: 'inline-flex', transform: `scale(${0.5 + 0.5 * si})` }}>{good ? <CheckIcon size={46} /> : <CrossIcon size={46} />}</span>
                  <div style={{ fontFamily: font.sans, fontWeight: act > 0.5 ? 700 : 500, fontSize: 34, color: color.ink, letterSpacing: -0.5 }}>{it.t}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  return (
    <AbcStage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 40, transform: 'scale(1.06)' }}>
          {col('Lo bueno', true, pros, 0)}
          {col('Lo malo', false, cons, 1)}
        </div>
      </AbsoluteFill>
      <Sfx name="hit_soft" at={fBueno - 1} volume={0.7} />
      {pros.map((p, i) => <Sfx key={`p${i}`} name="tick_soft" at={p.f - 2} />)}
      <Sfx name="whoosh_soft" at={fMalo} volume={0.5} />
      <Sfx name="hit_soft" at={fMalo - 1} volume={0.7} />
      {cons.map((p, i) => <Sfx key={`c${i}`} name="tick_soft" at={p.f - 2} volume={0.9} />)}
    </AbcStage>
  );
};

// D12 · Veredicto: «Si escuchas uno o dos libros al mes y quieres quedártelos: puede salirte a cuenta» (sobre todo con novedades
// largas que en otras plataformas se pagan aparte) y «Si escuchas mucho: mejor una tarifa plana (Storytel o Audible)»; abajo,
// el aviso: busca tu libro antes, no está todo.
export const D12Veredicto: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('D12', w, n);
  const fSi = at('si');
  const fUno = at('uno');
  const fQuedar = at('quedartelos');
  const fPuede = at('puede');
  const fSobre = at('sobre');
  const fNovedades = at('novedades');
  const fAparte = at('aparte');
  const fSi2 = at('si', 1);
  const fConviene = at('conviene');
  const fTarifa = at('tarifa');
  const fStorytel = at('storytel');
  const fAudible = at('audible');
  const fBusca = at('busca');
  const fNo = at('todo', 1) - 20; // «no está todo» (buscar «no» daría con «novedades»)
  const s1 = spring({ frame: frame - fSi + 8, fps, config: { damping: 15, stiffness: 140 } });
  const s2 = spring({ frame: frame - fSi2 + 6, fps, config: { damping: 15, stiffness: 140 } });
  const actL = interpolate(frame, [fSi - 6, fSi + 4, fSi2 - 8, fSi2], [0, 1, 1, 0], clamp);
  const actR = interpolate(frame, [fSi2 - 8, fSi2 + 2, fBusca - 8, fBusca], [0, 1, 1, 0.4], clamp);
  const pairIn = spring({ frame: frame - (fSi2 - 12), fps, config: { damping: 18, stiffness: 120 } });
  const sYes = spring({ frame: frame - fPuede + 4, fps, config: { damping: 11, stiffness: 200 } });
  const sKeep = spring({ frame: frame - fQuedar + 2, fps, config: { damping: 14, stiffness: 190 } });
  const sNov = spring({ frame: frame - fNovedades + 2, fps, config: { damping: 14, stiffness: 190 } });
  const sFlat = spring({ frame: frame - fTarifa + 2, fps, config: { damping: 11, stiffness: 200 } });
  const sSt = spring({ frame: frame - fStorytel + 2, fps, config: { damping: 13, stiffness: 200 } });
  const sAu = spring({ frame: frame - fAudible + 2, fps, config: { damping: 13, stiffness: 200 } });
  const sBusca = spring({ frame: frame - fBusca + 2, fps, config: { damping: 12, stiffness: 190 } });
  const no2 = interpolate(frame, [fNo - 4, fNo + 8], [0, 1], { ...clamp, easing: easeOut });
  const lift = interpolate(frame, [fBusca - 8, fBusca + 8], [0, 1], { ...clamp, easing: easeInOut });
  const books = (n: number) => interpolate(frame, [fUno - 4 + n * 8, fUno + 6 + n * 8], [0, 1], { ...clamp, easing: easeOut });
  const card: React.CSSProperties = { position: 'relative', width: 800, height: 560, borderRadius: 48, background: '#fff', border: `1px solid ${color.line}`, padding: '44px 50px', boxSizing: 'border-box' };
  const chip = (s: number, label: string) => (
    <div style={{ padding: '12px 26px', borderRadius: 999, background: AB_INK, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 36, opacity: s, transform: `translateY(${((1 - s) * 20).toFixed(2)}px) scale(${(0.8 + 0.2 * s).toFixed(4)})` }}>{label}</div>
  );
  return (
    <AbcStage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `translateY(${(-50 * lift).toFixed(2)}px)` }}>
        <MaskTitle text="¿Merece la pena?" hi="pena" at={2} size={104} align="center" />
        <div style={{ display: 'flex', gap: 48, marginTop: 52, perspective: 2200, transform: `translateX(${((1 - pairIn) * 424).toFixed(2)}px)` }}>
          {/* Uno o dos libros al mes: puede salirte a cuenta */}
          <div style={{ ...card, boxShadow: `0 0 0 ${(5 * actL).toFixed(2)}px ${color.yellow}, 0 ${(40 + 24 * actL).toFixed(1)}px 100px rgba(16,16,16,${(0.11 + 0.05 * actL).toFixed(3)})`,
            opacity: Math.min(1, s1 * 1.3) * (1 - 0.35 * Math.min(1, actR * 2)), transform: `translateY(${((1 - s1) * 90 - 14 * actL).toFixed(2)}px) rotateY(${((1 - s1) * -26).toFixed(2)}deg)` }}>
            <Sheen at={fSi} radius={48} tint="rgba(31,157,85,0.18)" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: color.ink, letterSpacing: -1 }}>
                <span style={{ display: 'inline-flex', gap: 8 }}>
                  {[0, 1].map((n) => (
                    <span key={n} style={{ width: 40, height: 50, borderRadius: 9, background: `linear-gradient(160deg, ${AB_HOT} 0%, ${AB} 100%)`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      opacity: books(n), transform: `translateY(${((1 - books(n)) * -30).toFixed(2)}px) rotate(${((1 - books(n)) * -14).toFixed(2)}deg)` }}><BookIcon size={24} c="#fff" /></span>
                  ))}
                </span>
                1 o 2 libros al mes
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 34, fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink, opacity: sKeep, transform: `translateX(${((1 - sKeep) * -20).toFixed(2)}px)` }}>
              <LockIcon size={44} c={AB_DEEP} /> …y quieres quedártelos
            </div>
            <div style={{ marginTop: 34, alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 16, padding: '14px 28px 14px 18px', borderRadius: 999, background: color.green, color: '#fff',
              fontFamily: font.sans, fontWeight: 700, fontSize: 44, opacity: sYes, transform: `scale(${(0.6 + 0.4 * sYes).toFixed(4)}) rotate(${((1 - sYes) * -6).toFixed(2)}deg)`, transformOrigin: 'left center' }}>
              <CheckIcon size={50} c="#fff" fg={color.green} /> Puede salirte a cuenta
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 34, padding: '18px 22px', borderRadius: 26, background: AB_SOFT, fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: color.ink,
              opacity: sNov, transform: `translateY(${((1 - sNov) * 20).toFixed(2)}px)` }}>
              <CreditCoin size={52} /> <span>Novedades largas que en otras <span style={{ color: AB_DEEP }}>se pagan aparte</span></span>
            </div>
          </div>
          {/* Si escuchas mucho: tarifa plana */}
          <div style={{ ...card, boxShadow: `0 0 0 ${(5 * actR).toFixed(2)}px ${color.yellow}, 0 ${(40 + 24 * actR).toFixed(1)}px 100px rgba(16,16,16,${(0.11 + 0.05 * actR).toFixed(3)})`,
            opacity: Math.min(1, s2 * 1.3), transform: `translateY(${((1 - s2) * 90 - 14 * actR).toFixed(2)}px) rotateY(${((1 - s2) * 26).toFixed(2)}deg)` }}>
            <Sheen at={fSi2} radius={48} tint="rgba(255,80,28,0.2)" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: color.ink, letterSpacing: -1 }}>
              <HeadphonesIcon size={58} /> Si escuchas mucho
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 40, fontFamily: font.sans, fontWeight: 700, fontSize: 48, color: color.ink, letterSpacing: -1.2,
              opacity: sFlat, transform: `scale(${(0.8 + 0.2 * sFlat).toFixed(4)})`, transformOrigin: 'left center' }}>
              <span style={{ width: 74, height: 74, borderRadius: '50%', background: AB_SOFT, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><InfinityIcon size={48} c={AB} /></span>
              Mejor una tarifa plana
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
              {chip(sSt, 'Storytel')}
              {chip(sAu, 'Audible')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 34, fontFamily: font.sans, fontWeight: 500, fontSize: 30, color: color.ink2, opacity: sAu }}>
              <ClockIcon size={34} c={color.ink2} /> Escuchas lo que quieras, sin créditos
            </div>
          </div>
        </div>
      </AbsoluteFill>
      {frame >= fBusca - 6 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 900, display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 40px 18px 26px', borderRadius: 999, background: AB_INK, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 38,
            opacity: sBusca, transform: `translateY(${((1 - sBusca) * 40).toFixed(2)}px) scale(${(0.85 + 0.15 * sBusca).toFixed(4)})`, boxShadow: '0 24px 60px rgba(16,16,16,0.3)' }}>
            <SearchIcon size={44} c={AB_HOT} /> <span>Antes, busca tu libro<span style={{ opacity: no2, color: AB_SOFT, fontWeight: 500, display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap', verticalAlign: 'top', maxWidth: no2 * 400 }}>: no está todo</span></span>
          </div>
        </div>
      )}
      <Sfx name="card_flip" at={fSi - 4} volume={0.8} />
      <Sfx name="tick_soft" at={fUno - 2} volume={0.6} />
      <Sfx name="tick_soft" at={fUno + 6} volume={0.6} />
      <Sfx name="ui_pop" at={fQuedar} volume={0.6} />
      <Sfx name="stamp" at={fPuede + 6} volume={0.45} />
      <Sfx name="ui_pop" at={fSobre + 4} volume={0.5} />
      <Sfx name="coins" at={fAparte - 6} volume={0.3} />
      <Sfx name="card_flip" at={fSi2 - 2} volume={0.8} />
      <Sfx name="ui_pop" at={fConviene + 4} volume={0.5} />
      <Sfx name="snap_in" at={fStorytel} volume={0.6} />
      <Sfx name="snap_in" at={fAudible} volume={0.6} />
      <Sfx name="ui_pop" at={fBusca} volume={0.8} />
    </AbcStage>
  );
};

export { GlobeIcon };
