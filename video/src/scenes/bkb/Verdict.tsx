import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { ChangeTicks, Sfx } from '../../components/Sfx';
import { BookIcon, CheckIcon, CrossIcon, HeadphonesIcon } from '../../components/Icons';
import { CastIcon, ClockIcon, GlobeIcon, InfinityIcon, LaptopIcon, UserIcon } from '../../components/Icons2';
import { wf } from './timeline';
import type { SceneProps } from './registry';
import { BB, BB_DEEP, BB_GREEN, BB_INK, BB_SOFT, BB_YELLOW, BkbStage, BookBeatIcon, Chip, MaskTitle, Odometer, odometerProgress, odometerShown, Sheen } from './kit';
import { FlagES } from './Intro';

type P = SceneProps;
const ST = '#FF501C'; // Storytel (naranja de su marca)
const PODIMO = '#A89BED'; // Podimo (lila de su marca)

// Reproductor en miniatura (portada lila de BookBeat con ecualizador, título y barra) para las tarjetas de dispositivos.
const NowPlaying: React.FC<{ w: number; h: number; frame: number; seed: number; vertical?: boolean; round?: boolean }> = ({ w, h, frame, seed, vertical = false, round = false }) => {
  const bars = [0, 1, 2, 3];
  const eq = (i: number) => 0.35 + 0.65 * Math.abs(Math.sin(frame / (5.2 + i * 0.9) + seed + i * 1.7));
  const m = Math.min(w, h);
  const cover = vertical ? w * 0.62 : h * 0.5;
  return (
    <div style={{ width: w, height: h, borderRadius: round ? m * 0.3 : m * 0.12, background: 'linear-gradient(160deg, #1b1b1f 0%, #050506 100%)', display: 'flex', flexDirection: vertical ? 'column' : 'row',
      alignItems: 'center', justifyContent: 'center', gap: m * 0.1, padding: m * 0.08, boxSizing: 'border-box', overflow: 'hidden' }}>
      <div style={{ width: cover, height: cover, borderRadius: cover * 0.14, background: `linear-gradient(135deg, ${BB} 0%, #A86BEB 100%)`, flexShrink: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: cover * 0.06, paddingBottom: cover * 0.16, boxSizing: 'border-box' }}>
        {bars.map((i) => <div key={i} style={{ width: cover * 0.1, height: cover * 0.5 * eq(i), borderRadius: cover * 0.05, background: BB_INK }} />)}
      </div>
      {!round && (
        <div style={{ flex: vertical ? undefined : 1, width: vertical ? '100%' : undefined, display: 'flex', flexDirection: 'column', gap: m * 0.06 }}>
          <div style={{ height: m * 0.07, width: '80%', borderRadius: 99, background: 'rgba(255,255,255,0.85)' }} />
          <div style={{ height: m * 0.05, width: '55%', borderRadius: 99, background: 'rgba(255,255,255,0.35)' }} />
          <div style={{ position: 'relative', height: Math.max(3, m * 0.035), width: '100%', borderRadius: 99, background: 'rgba(255,255,255,0.18)', marginTop: m * 0.04 }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(30 + ((frame * 0.25 + seed * 20) % 60)).toFixed(1)}%`, borderRadius: 99, background: BB }} />
          </div>
        </div>
      )}
    </div>
  );
};

// Escena de cada tarjeta: móvil y tablet; Apple Watch (que funciona sin el móvil); salpicadero; tele con Chromecast.
const DeviceArt: React.FC<{ kind: 0 | 1 | 2 | 3; s: number; act: number; frame: number }> = ({ kind, s, act, frame }) => {
  const rise = (d: number) => `translateY(${((1 - Math.min(1, s * 1.15 - d)) * 40).toFixed(2)}px)`;
  if (kind === 0) {
    return (
      <div style={{ position: 'relative', width: 340, height: 240 }}>
        <div style={{ position: 'absolute', left: 14, top: 44, width: 220, height: 160, borderRadius: 22, background: '#2a2b30', padding: 8, boxSizing: 'border-box', boxShadow: '0 24px 50px rgba(16,16,16,0.25)', transform: rise(0) }}>
          <NowPlaying w={204} h={144} frame={frame} seed={0} />
        </div>
        <div style={{ position: 'absolute', left: 210, top: 24, width: 104, height: 200, borderRadius: 22, background: '#2a2b30', padding: 6, boxSizing: 'border-box', boxShadow: '0 24px 50px rgba(16,16,16,0.3)', transform: `${rise(0.15)} rotate(${(4 * act).toFixed(2)}deg)` }}>
          <NowPlaying w={92} h={188} frame={frame} seed={2} vertical />
        </div>
      </div>
    );
  }
  if (kind === 1) {
    return (
      <div style={{ position: 'relative', width: 340, height: 240 }}>
        <div style={{ position: 'absolute', left: 125, top: -6, width: 90, height: 252, borderRadius: 30, background: 'linear-gradient(180deg, #3a3b42 0%, #24252a 100%)', transform: rise(0) }} />
        <div style={{ position: 'absolute', left: 92, top: 50, width: 156, height: 150, borderRadius: 46, background: '#1b1c20', padding: 10, boxSizing: 'border-box', boxShadow: '0 24px 50px rgba(16,16,16,0.3)', transform: `${rise(0.1)} rotate(${(-3 * act).toFixed(2)}deg)` }}>
          <NowPlaying w={136} h={130} frame={frame} seed={3} round />
        </div>
        <div style={{ position: 'absolute', left: 246, top: 102, width: 12, height: 34, borderRadius: 6, background: '#4a4b52', transform: rise(0.1) }} />
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
  // Tele con el reproductor en grande y, delante, el móvil que envía (icono de Chromecast con ondas que laten).
  const ph = (frame / 26) % 1;
  return (
    <div style={{ position: 'relative', width: 340, height: 240 }}>
      <div style={{ position: 'absolute', left: 20, top: 14, width: 300, height: 176, borderRadius: 14, background: '#17171a', padding: 8, boxSizing: 'border-box', boxShadow: '0 24px 50px rgba(16,16,16,0.25)', transform: rise(0) }}>
        <NowPlaying w={284} h={160} frame={frame} seed={6} />
      </div>
      <div style={{ position: 'absolute', left: 150, top: 190, width: 40, height: 22, background: '#2a2b30', borderRadius: '0 0 8px 8px', transform: rise(0) }} />
      <div style={{ position: 'absolute', left: 230, top: 120, width: 74, height: 74, borderRadius: '50%', background: '#fff', boxShadow: '0 12px 30px rgba(16,16,16,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: `${rise(0.2)} scale(${(1 + 0.06 * act * Math.sin(ph * Math.PI)).toFixed(4)})` }}>
        <CastIcon size={42} c={BB_DEEP} />
      </div>
    </div>
  );
};

// D11 · Dispositivos (ayuda de BookBeat, 14/10/2026): Android y iPhone (y tabletas), Apple Watch (también sin el móvil), coche
// con CarPlay y Android Auto, y Chromecast; no hay reproductor en la web ni app para Windows o Mac.
export const D11Dispositivos: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('D11', w, n);
  const items = [
    { f: at('android'), title: 'Móvil y tablet', sub: 'Android · iPhone' },
    { f: at('apple'), title: 'Reloj', sub: 'Apple Watch' },
    { f: at('coche'), title: 'En el coche', sub: 'CarPlay · Android Auto' },
    { f: at('chromecast'), title: 'En la tele', sub: 'Chromecast' },
  ];
  const fIncluso = at('incluso');
  const fPero = at('pero');
  const fWeb = at('web');
  const fWin = at('windows');
  const sNo = spring({ frame: frame - fPero, fps, config: { damping: 12, stiffness: 190 } });
  const x1 = interpolate(frame, [fWeb - 2, fWeb + 8], [0, 1], { ...clamp, easing: easeOut });
  const x2 = interpolate(frame, [fWin - 2, fWin + 8], [0, 1], { ...clamp, easing: easeOut });
  const sSolo = spring({ frame: frame - (fIncluso - 2), fps, config: { damping: 11, stiffness: 210 } });
  const CW = 410;
  const GAP = 34;
  const nAdd = [1, 2, 3].reduce((a, i) => a + spring({ frame: frame - (items[i].f - 10), fps, config: { damping: 18, stiffness: 120 } }), 0);
  const lift = interpolate(frame, [fPero - 8, fPero + 8], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <BkbStage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 30, transform: `translateY(${(-30 * lift).toFixed(2)}px)` }}>
        <MaskTitle text="¿Dónde funciona?" hi="funciona" at={2} size={92} align="center" />
        <div style={{ display: 'flex', gap: GAP, marginTop: 54, perspective: 2200, transform: `translateX(${((3 - nAdd) * (CW + GAP) / 2).toFixed(2)}px)` }}>
          {items.map((it, i) => {
            const s = spring({ frame: frame - it.f + 5, fps, config: { damping: 14, stiffness: 150 } });
            const next = i < items.length - 1 ? items[i + 1].f : fPero;
            const act = interpolate(frame, [it.f - 2, it.f + 8, next - 6, next], [0, 1, 1, 0], clamp);
            if (frame < it.f - 8) return <div key={it.title} style={{ width: CW, height: 440 }} />;
            return (
              <div key={it.title} style={{ position: 'relative', width: CW, height: 440, borderRadius: 44, background: '#fff', border: `1px solid ${color.line}`,
                boxShadow: `0 0 0 ${(5 * act).toFixed(2)}px ${BB}, 0 ${(40 + 24 * act).toFixed(1)}px ${(90 + 20 * act).toFixed(1)}px rgba(16,16,16,${(0.11 + 0.05 * act).toFixed(3)})`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 38, boxSizing: 'border-box', overflow: 'hidden',
                opacity: Math.min(1, s * 1.3), transform: `translateY(${((1 - s) * 90 - 14 * act).toFixed(2)}px) rotateY(${((1 - s) * (i < 2 ? -30 : 30)).toFixed(2)}deg) scale(${((0.92 + 0.08 * s) * (1 + 0.025 * act)).toFixed(4)})` }}>
                <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 260, background: `radial-gradient(ellipse at 50% 60%, rgba(205,150,255,${(0.12 + 0.16 * act).toFixed(3)}) 0%, rgba(205,150,255,0) 65%)` }} />
                <div style={{ position: 'absolute', left: 35, top: 32 }}><DeviceArt kind={i as 0 | 1 | 2 | 3} s={s} act={act} frame={frame} /></div>
                {i === 1 && (
                  <div style={{ position: 'absolute', right: 18, top: 18, padding: '7px 14px', borderRadius: 999, background: BB_INK, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 22,
                    opacity: sSolo, transform: `scale(${(0.6 + 0.4 * sSolo).toFixed(4)}) rotate(${((1 - sSolo) * -8).toFixed(2)}deg)` }}>Sin el móvil</div>
                )}
                <Sheen at={it.f + 4} radius={44} tint="rgba(205,150,255,0.30)" />
                <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 700, fontSize: 42, color: color.ink, letterSpacing: -0.8 }}>{it.title}</div>
                <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 500, fontSize: 28, color: color.ink2, marginTop: 8 }}>{it.sub}</div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 48, minHeight: 96, display: 'flex', alignItems: 'center', gap: 22, padding: '18px 40px 18px 28px', borderRadius: 999, background: '#FDECEC', border: '3px solid rgba(229,72,77,0.35)',
          fontFamily: font.sans, fontWeight: 700, fontSize: 42, color: color.ink, opacity: Math.min(1, sNo * 1.4), boxSizing: 'border-box',
          transform: `translateY(${((1 - sNo) * 40).toFixed(2)}px) scale(${(0.82 + 0.18 * sNo).toFixed(4)})` }}>
          <span style={{ position: 'relative', display: 'inline-flex' }}>
            <GlobeIcon size={52} />
            <span style={{ position: 'absolute', right: -10, bottom: -6, transform: `scale(${x1.toFixed(4)})` }}><CrossIcon size={32} /></span>
          </span>
          <span style={{ position: 'relative', display: 'inline-flex' }}>
            <LaptopIcon size={58} />
            <span style={{ position: 'absolute', right: -10, bottom: -6, transform: `scale(${x2.toFixed(4)})` }}><CrossIcon size={32} /></span>
          </span>
          {/* La segunda mitad está en gris claro hasta que la voz dice «Windows» (la píldora nunca se ve vacía). */}
          <span>Ni en su web<span style={{ opacity: 0.2 + 0.8 * x2 }}>, ni en Windows o Mac</span></span>
        </div>
      </AbsoluteFill>
      {items.map((it) => <Sfx key={it.title} name="snap_in" at={it.f + 3} volume={0.8} />)}
      {items.map((it) => <Sfx key={`w${it.title}`} name="whoosh_soft" at={it.f - 2} volume={0.35} />)}
      <Sfx name="ui_pop" at={fIncluso} volume={0.6} />
      <Sfx name="hit_soft" at={fPero + 2} volume={0.7} />
      <Sfx name="cross" at={fWeb + 2} volume={0.6} />
      <Sfx name="cross" at={fWin + 2} volume={0.6} />
    </BkbStage>
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

// D12 · Opiniones (14/10/2026): Google Play muestra en España un 4,2 (la media del país; 44.002 valoraciones en todo el mundo)
// y la App Store de España, un 4,7 con solo 82 valoraciones. Lo que gusta y lo que se critica, de las pocas reseñas en español.
export const D12Opiniones: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('D12', w, n);
  const fPocas = at('pocas');
  const fCuatro = at('cuatro');
  const fGoogle = at('google');
  const fCuatro2 = at('cuatro', 1);
  const fOchenta = at('ochenta');
  const fGusta = at('gusta');
  const fApp2 = at('app', 1);
  const fCat = at('catalogo');
  const fCritica = at('critica');
  const fIngles = at('ingles');
  const fFalten = at('falten');
  const sG = spring({ frame: frame - fCuatro + 10, fps, config: { damping: 15, stiffness: 150 } });
  const sA = spring({ frame: frame - fCuatro2 + 10, fps, config: { damping: 15, stiffness: 150 } });
  const atG = fCuatro - 4;
  const atA = fCuatro2 - 4;
  const vG = 4.2 * Math.min(1, odometerProgress(frame, atG, fps, 34));
  const vA = 4.7 * Math.min(1, odometerProgress(frame, atA, fps, 34));
  const actG = interpolate(frame, [fCuatro - 6, fCuatro + 4, fCuatro2 - 8, fCuatro2], [0, 1, 1, 0], clamp);
  const actA = interpolate(frame, [fCuatro2 - 6, fCuatro2 + 4, fGusta - 8, fGusta], [0, 1, 1, 0], clamp);
  const up = interpolate(frame, [fGusta - 10, fGusta + 8], [0, 1], { ...clamp, easing: easeInOut });
  const sPocas = spring({ frame: frame - fPocas + 2, fps, config: { damping: 13, stiffness: 190 } });
  const sLike = spring({ frame: frame - fGusta + 2, fps, config: { damping: 14, stiffness: 170 } });
  const sCrit = spring({ frame: frame - fCritica + 2, fps, config: { damping: 14, stiffness: 170 } });
  const like2 = interpolate(frame, [fApp2 - 2, fApp2 + 10], [0, 1], { ...clamp, easing: easeOut });
  const like3 = interpolate(frame, [fCat - 4, fCat + 8], [0, 1], { ...clamp, easing: easeOut });
  const crit2 = interpolate(frame, [fIngles - 4, fIngles + 8], [0, 1], { ...clamp, easing: easeOut });
  const crit3 = interpolate(frame, [fFalten - 4, fFalten + 8], [0, 1], { ...clamp, easing: easeOut });
  const card = (title: string, v: number, val: string, oAt: number, sub: string, s: number, act: number) => {
    const on = frame >= oAt - 1;
    return (
      <div style={{ position: 'relative', width: 620, padding: '40px 50px', borderRadius: 48, background: '#fff', border: `1px solid ${color.line}`,
        boxShadow: `0 0 0 ${(5 * act).toFixed(2)}px ${BB}, 0 ${(40 + 24 * act).toFixed(1)}px 100px rgba(16,16,16,${(0.11 + 0.05 * act).toFixed(3)})`,
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
        <div style={{ marginTop: 18 }}><Stars v={v} size={56} c={BB_DEEP} /></div>
        <div style={{ marginTop: 20, fontFamily: font.sans, fontWeight: 500, fontSize: 31, color: color.ink2, minHeight: 40 }}>{sub}</div>
      </div>
    );
  };
  const pill = (good: boolean, s: number, lead2: string, parts: [string, number][]) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '20px 34px 20px 22px', borderRadius: 28, background: good ? '#E9F7EF' : '#FDECEC', border: `2px solid ${good ? 'rgba(31,157,85,0.35)' : 'rgba(229,72,77,0.35)'}`,
      fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink, opacity: s, transform: `translateY(${((1 - s) * 40).toFixed(2)}px) scale(${(0.9 + 0.1 * s).toFixed(4)})`, boxShadow: shadow.soft }}>
      {good ? <CheckIcon size={50} /> : <CrossIcon size={50} />}
      <span style={{ color: good ? color.green : color.red }}>{lead2}</span>
      {/* El texto está en gris claro desde el principio y se enciende al ritmo de la voz (la píldora nunca se ve vacía). */}
      <span>{parts.map(([t, p], k) => <span key={k} style={{ opacity: 0.2 + 0.8 * p }}>{k ? ' ' : ''}{t}</span>)}</span>
    </div>
  );
  return (
    <BkbStage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', top: 70, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, opacity: 1 - up, transform: `translateY(${(-40 * up).toFixed(2)}px)` }}>
          <MaskTitle text="¿Qué opinan los usuarios?" hi="opinan" at={2} size={80} align="center" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 24px 10px 14px', borderRadius: 999, background: BB_INK, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 30,
            opacity: sPocas, transform: `scale(${(0.7 + 0.3 * sPocas).toFixed(4)})` }}>
            <UserIcon size={32} c="#fff" /> En España, pocas reseñas
          </div>
        </div>
        <div style={{ position: 'absolute', top: 300, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 48,
          transform: `translateY(${(-140 * up).toFixed(2)}px) scale(${(1 - 0.22 * up).toFixed(4)}) translateX(${((1 - Math.min(1, sA)) * 334).toFixed(2)}px)`, transformOrigin: '50% 0%' }}>
          {card('Google Play (España)', vG, '4,2', atG, frame >= fGoogle ? 'La nota que ves en España' : '', sG, actG)}
          {card('App Store (España)', vA, '4,7', atA, frame >= fOchenta - 4 ? 'Solo 82 valoraciones' : '', sA, actA)}
        </div>
        <div style={{ position: 'absolute', top: 640, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          {frame >= fGusta - 4 && pill(true, sLike, 'Gusta:', [['que la app funcione bien', like2], ['y su catálogo en otros idiomas', like3]])}
          {frame >= fCritica - 4 && pill(false, sCrit, 'Se critica:', [['que esté en inglés', crit2], ['y que falten libros en español', crit3]])}
        </div>
      </AbsoluteFill>
      <Sfx name="ui_pop" at={fPocas} volume={0.6} />
      <Sfx name="ui_pop" at={fCuatro - 8} />
      <ChangeTicks value={(f) => odometerShown('4,2', atG, fps, f, 34)} from={atG} to={atG + 44} volume={0.6} />
      <Sfx name="ui_pop" at={fCuatro2 - 8} />
      <ChangeTicks value={(f) => odometerShown('4,7', atA, fps, f, 34)} from={atA} to={atA + 44} volume={0.6} />
      <Sfx name="tick_soft" at={fOchenta} volume={0.6} />
      <Sfx name="whoosh_soft" at={fGusta - 8} volume={0.5} />
      <Sfx name="success" at={fGusta + 2} volume={0.55} />
      <Sfx name="hit_soft" at={fCritica + 1} volume={0.7} />
      <Sfx name="tick_soft" at={fFalten - 2} volume={0.6} />
    </BkbStage>
  );
};

// D13 · Lo bueno y lo malo: dos columnas con cuatro huecos que se llenan al ritmo de la voz.
export const D13ProsCons: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('D13', w, n);
  const pros = [
    { f: at('treinta'), t: '30 días de prueba, con 20 horas' },
    { f: at('audiolibros'), t: 'Audiolibros y ebooks en la cuota' },
    { f: at('app'), t: 'Una app muy completa' },
    { f: at('perfiles'), t: 'Perfiles para toda la familia' },
  ];
  const cons = [
    { f: at('esta'), t: 'Está en inglés' },
    { f: at('falta'), t: 'Falta mucho en español' },
    { f: at('horas', 1), t: 'Las horas no se acumulan' },
    { f: at('cancelas'), t: 'Cancelar en la prueba corta el acceso' },
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
      <div style={{ width: 800, borderRadius: 44, background: '#fff', boxShadow: shadow.card, border: `1px solid ${color.line}`, overflow: 'hidden',
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
                  <div style={{ fontFamily: font.sans, fontWeight: act > 0.5 ? 700 : 500, fontSize: 36, color: color.ink, letterSpacing: -0.5 }}>{it.t}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  return (
    <BkbStage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 44, transform: 'scale(1.08)' }}>
          {col('Lo bueno', true, pros, 0)}
          {col('Lo malo', false, cons, 1)}
        </div>
      </AbsoluteFill>
      <Sfx name="hit_soft" at={fBueno - 1} volume={0.7} />
      {pros.map((p, i) => <Sfx key={`p${i}`} name="tick_soft" at={p.f - 2} />)}
      <Sfx name="whoosh_soft" at={fMalo} volume={0.5} />
      <Sfx name="hit_soft" at={fMalo - 1} volume={0.7} />
      {cons.map((p, i) => <Sfx key={`c${i}`} name="tick_soft" at={p.f - 2} volume={0.9} />)}
    </BkbStage>
  );
};

// D14 · Veredicto: en España, para la mayoría, hay opciones mejores (precios de bookbeat.com/es, storytel.com/es y podimo.com/es,
// 12–14/10/2026): si escuchas mucho, Storytel (8,99 €, sin contar horas); si escuchas poco, Podimo (4,99 €, 20 horas). BookBeat
// encaja si también escuchas en inglés u otros idiomas, o si quieres ebooks y perfiles con horas para cada uno.
export const D14Veredicto: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('D14', w, n);
  const fEspana = at('espana');
  const fMejores = at('mejores');
  const fMucho = at('mucho');
  const fStory = at('storytel');
  const fOcho = at('ocho');
  const fCuenta = at('cuenta');
  const fPoco = at('poco');
  const fPodimo = at('podimo');
  const fVeinte = at('veinte');
  const fCuatro = at('cuatro');
  const fBB = at('bookbeat');
  const fIngles = at('ingles');
  const fEbooks = at('ebooks');
  const fPerfiles = at('perfiles');
  const s1 = spring({ frame: frame - fMucho + 8, fps, config: { damping: 15, stiffness: 140 } });
  const s2 = spring({ frame: frame - fPoco + 6, fps, config: { damping: 15, stiffness: 140 } });
  const actL = interpolate(frame, [fMucho - 6, fMucho + 4, fPoco - 8, fPoco], [0, 1, 1, 0], clamp);
  const actR = interpolate(frame, [fPoco - 8, fPoco + 2, fBB - 8, fBB], [0, 1, 1, 0.3], clamp);
  const pairIn = spring({ frame: frame - (fPoco - 12), fps, config: { damping: 18, stiffness: 120 } });
  const sSub = spring({ frame: frame - fEspana + 2, fps, config: { damping: 14, stiffness: 170 } });
  const sMej = interpolate(frame, [fMejores - 4, fMejores + 8], [0, 1], { ...clamp, easing: easeOut });
  const sStory = spring({ frame: frame - fStory + 2, fps, config: { damping: 14, stiffness: 190 } });
  const sCuenta = spring({ frame: frame - fCuenta + 2, fps, config: { damping: 14, stiffness: 190 } });
  const sPod = spring({ frame: frame - fPodimo + 2, fps, config: { damping: 14, stiffness: 190 } });
  const grow = interpolate(frame, [fVeinte - 2, fVeinte + 16], [0, 1], { ...clamp, easing: easeOut });
  const sBB = spring({ frame: frame - fBB + 2, fps, config: { damping: 14, stiffness: 170 } });
  const lift = interpolate(frame, [fBB - 10, fBB + 8], [0, 1], { ...clamp, easing: easeInOut });
  const card: React.CSSProperties = { position: 'relative', width: 760, height: 470, borderRadius: 48, background: '#fff', border: `1px solid ${color.line}`, padding: '42px 50px', boxSizing: 'border-box' };
  const shimmer = (f: number) => frame < f - 7 && (
    <span style={{ position: 'absolute', left: 0, right: 6, top: '16%', bottom: '8%', borderRadius: 24, background: 'linear-gradient(100deg, #EDEDED 35%, #F9F9F9 50%, #EDEDED 65%)',
      backgroundSize: '300% 100%', backgroundPosition: `${100 - ((frame * 2.4) % 100)}% 0` }} />
  );
  return (
    <BkbStage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `translateY(${(-70 * lift).toFixed(2)}px)` }}>
        <MaskTitle text="¿Merece la pena?" hi="pena" at={2} size={100} align="center" />
        <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 14, padding: '12px 30px 12px 18px', borderRadius: 999, background: BB_INK, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 36,
          opacity: sSub, transform: `scale(${(0.8 + 0.2 * sSub).toFixed(4)})` }}>
          {/* Un solo bloque de texto (los dos puntos, pegados a «mayoría»); la segunda parte, en tenue hasta que la voz la dice. */}
          <FlagES w={44} /><span>En España, para la mayoría<span style={{ color: BB, opacity: 0.25 + 0.75 * Math.min(1, sMej) }}>: hay opciones mejores</span></span>
        </div>
        <div style={{ display: 'flex', gap: 44, marginTop: 44, perspective: 2200, transform: `translateX(${((1 - pairIn) * 402).toFixed(2)}px)` }}>
          {/* Si escuchas mucho: Storytel */}
          <div style={{ ...card, boxShadow: `0 0 0 ${(5 * actL).toFixed(2)}px ${ST}, 0 ${(40 + 24 * actL).toFixed(1)}px 100px rgba(16,16,16,${(0.11 + 0.05 * actL).toFixed(3)})`,
            opacity: Math.min(1, s1 * 1.3) * (1 - 0.3 * Math.min(1, actR * 2)), transform: `translateY(${((1 - s1) * 90 - 14 * actL).toFixed(2)}px) rotateY(${((1 - s1) * -26).toFixed(2)}deg)` }}>
            <Sheen at={fMucho} radius={48} tint="rgba(255,80,28,0.16)" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: color.ink, letterSpacing: -1 }}>
              <HeadphonesIcon size={56} /> Si escuchas mucho
            </div>
            <div style={{ marginTop: 26, fontFamily: font.sans, fontWeight: 700, fontSize: 62, color: ST, letterSpacing: -2, opacity: sStory, transform: `translateX(${((1 - sStory) * -20).toFixed(2)}px)` }}>Storytel</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6, fontFamily: font.sans, fontWeight: 700, color: color.ink }}>
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <Odometer text="8,99" at={fOcho - 6} size={110} style={{ letterSpacing: -5 }} />
                {shimmer(fOcho)}
              </span>
              <span style={{ fontSize: 46 }}>€</span><span style={{ fontSize: 30, fontWeight: 500, color: color.muted }}>/mes</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12, fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.ink, opacity: sCuenta, transform: `translateX(${((1 - sCuenta) * -20).toFixed(2)}px)` }}>
              <InfinityIcon size={44} c={ST} /> Sin contar horas
            </div>
          </div>
          {/* Si escuchas poco: Podimo */}
          <div style={{ ...card, boxShadow: `0 0 0 ${(5 * actR).toFixed(2)}px ${PODIMO}, 0 ${(40 + 24 * actR).toFixed(1)}px 100px rgba(16,16,16,${(0.11 + 0.05 * actR).toFixed(3)})`,
            opacity: Math.min(1, s2 * 1.3), transform: `translateY(${((1 - s2) * 90 - 14 * actR).toFixed(2)}px) rotateY(${((1 - s2) * 26).toFixed(2)}deg)` }}>
            <Sheen at={fPoco} radius={48} tint="rgba(168,155,237,0.22)" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: color.ink, letterSpacing: -1 }}>
              <span style={{ width: 56, height: 56, borderRadius: '50%', background: color.ink, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><ClockIcon size={34} c="#fff" /></span>
              Si escuchas poco
            </div>
            <div style={{ marginTop: 26, fontFamily: font.sans, fontWeight: 700, fontSize: 62, color: '#6E5FD0', letterSpacing: -2, opacity: sPod, transform: `translateX(${((1 - sPod) * -20).toFixed(2)}px)` }}>Podimo</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6, fontFamily: font.sans, fontWeight: 700, color: color.ink }}>
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <Odometer text="4,99" at={fCuatro - 6} size={110} style={{ letterSpacing: -5 }} />
                {shimmer(fCuatro)}
              </span>
              <span style={{ fontSize: 46 }}>€</span><span style={{ fontSize: 30, fontWeight: 500, color: color.muted }}>/mes</span>
            </div>
            <div style={{ position: 'relative', height: 44, marginTop: 14, borderRadius: 22, background: '#EFEFF3', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(20 * grow).toFixed(2)}%`, borderRadius: 22, background: PODIMO }} />
              <div style={{ position: 'absolute', left: `calc(${(20 * grow).toFixed(2)}% + 14px)`, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 27, color: color.ink2,
                opacity: interpolate(frame, [fVeinte + 6, fVeinte + 14], [0, 1], clamp), whiteSpace: 'nowrap' }}>20 horas al mes</div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
      {/* «BookBeat te encaja si…» */}
      {frame >= fBB - 6 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 860, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, opacity: sBB, transform: `translateY(${((1 - sBB) * 40).toFixed(2)}px)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 28px 12px 14px', borderRadius: 999, background: BB_INK, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 34, flexShrink: 0 }}>
            <BookBeatIcon size={52} /> Te encaja si…
          </div>
          <Chip at={fIngles - 3} label="Escuchas en inglés u otros idiomas" icon={<HeadphonesIcon size={28} />} size={30} accent={BB_SOFT} reserve />
          <Chip at={fEbooks - 3} label="Quieres ebooks" icon={<BookIcon size={28} />} size={30} accent={BB_SOFT} reserve />
          <Chip at={fPerfiles - 3} label="Perfiles con sus horas" icon={<UserIcon size={28} />} size={30} accent={BB_SOFT} reserve />
        </div>
      )}
      <Sfx name="ui_pop" at={fEspana} volume={0.6} />
      <Sfx name="hit_soft" at={fMejores} volume={0.6} />
      <Sfx name="card_flip" at={fMucho - 4} volume={0.8} />
      <Sfx name="ui_pop" at={fStory} volume={0.6} />
      <ChangeTicks value={(f) => odometerShown('8,99', fOcho - 6, fps, f)} from={fOcho - 6} to={fOcho + 34} volume={0.45} />
      <Sfx name="ui_pop" at={fCuenta} volume={0.55} />
      <Sfx name="card_flip" at={fPoco - 2} volume={0.8} />
      <Sfx name="ui_pop" at={fPodimo} volume={0.6} />
      <Sfx name="draw" at={fVeinte - 2} volume={0.4} dur={14} fade={6} />
      <ChangeTicks value={(f) => odometerShown('4,99', fCuatro - 6, fps, f)} from={fCuatro - 6} to={fCuatro + 34} volume={0.45} />
      <Sfx name="whoosh_soft" at={fBB - 8} volume={0.5} />
      <Sfx name="ui_pop" at={fIngles - 2} volume={0.6} />
      <Sfx name="ui_pop" at={fEbooks - 2} volume={0.6} />
      <Sfx name="ui_pop" at={fPerfiles - 2} volume={0.6} />
    </BkbStage>
  );
};

export { BB_GREEN, BB_YELLOW };
