import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { ChangeTicks, Sfx } from '../../components/Sfx';
import { CheckIcon, CrossIcon, HeadphonesIcon } from '../../components/Icons';
import { CastIcon, ClockIcon, GlobeIcon, InfinityIcon, LaptopIcon, SearchIcon, UserIcon } from '../../components/Icons2';
import { wf } from './timeline';
import type { SceneProps } from './registry';
import { MaskTitle, Odometer, odometerProgress, odometerShown, Sheen, ST, ST_DEEP, ST_PINK, ST_SOFT, StrStage } from './kit';
import { phaseStyle } from './parts';

type P = SceneProps;

// Reproductor en miniatura (portada naranja con ecualizador, título y barra de progreso) para las tarjetas de dispositivos.
const NowPlaying: React.FC<{ w: number; h: number; frame: number; seed: number; vertical?: boolean; round?: boolean }> = ({ w, h, frame, seed, vertical = false, round = false }) => {
  const bars = [0, 1, 2, 3];
  const eq = (i: number) => 0.35 + 0.65 * Math.abs(Math.sin(frame / (5.2 + i * 0.9) + seed + i * 1.7));
  const m = Math.min(w, h);
  const cover = vertical ? w * 0.62 : h * 0.5;
  return (
    <div style={{ width: w, height: h, borderRadius: round ? m * 0.3 : m * 0.12, background: 'linear-gradient(160deg, #1d1d22 0%, #0d0d10 100%)', display: 'flex', flexDirection: vertical ? 'column' : 'row',
      alignItems: 'center', justifyContent: 'center', gap: m * 0.1, padding: m * 0.08, boxSizing: 'border-box', overflow: 'hidden' }}>
      <div style={{ width: cover, height: cover, borderRadius: cover * 0.14, background: `linear-gradient(135deg, ${ST} 0%, #FF8A5C 100%)`, flexShrink: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: cover * 0.06, paddingBottom: cover * 0.16, boxSizing: 'border-box' }}>
        {bars.map((i) => <div key={i} style={{ width: cover * 0.1, height: cover * 0.5 * eq(i), borderRadius: cover * 0.05, background: '#fff' }} />)}
      </div>
      {!round && (
        <div style={{ flex: vertical ? undefined : 1, width: vertical ? '100%' : undefined, display: 'flex', flexDirection: 'column', gap: m * 0.06 }}>
          <div style={{ height: m * 0.07, width: '80%', borderRadius: 99, background: 'rgba(255,255,255,0.85)' }} />
          <div style={{ height: m * 0.05, width: '55%', borderRadius: 99, background: 'rgba(255,255,255,0.35)' }} />
          <div style={{ position: 'relative', height: Math.max(3, m * 0.035), width: '100%', borderRadius: 99, background: 'rgba(255,255,255,0.18)', marginTop: m * 0.04 }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(30 + ((frame * 0.25 + seed * 20) % 60)).toFixed(1)}%`, borderRadius: 99, background: ST }} />
          </div>
        </div>
      )}
    </div>
  );
};

// Escena de cada tarjeta: móvil y tablet; reloj (Apple Watch / Wear OS); salpicadero; televisor con Chromecast.
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
    // Reloj: correa y caja con el reproductor redondeado; un brillo recorre el cristal.
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
        <div style={{ position: 'absolute', left: 0, right: 0, top: 136, height: 104, borderRadius: '50% 50% 22px 22px / 60% 60% 22px 22px', background: 'linear-gradient(180deg, #F4ECE8 0%, #E8DCD6 100%)', transform: rise(0) }} />
        <div style={{ position: 'absolute', left: 50, top: 34, width: 240, height: 146, borderRadius: 20, background: '#2a2b30', padding: 8, boxSizing: 'border-box', boxShadow: '0 24px 50px rgba(16,16,16,0.25)', transform: rise(0.1) }}>
          <NowPlaying w={224} h={130} frame={frame} seed={4} />
        </div>
        {[16, 294].map((x) => (
          <div key={x} style={{ position: 'absolute', left: x, top: 82, width: 30, height: 56, borderRadius: 9, background: '#DCCFC8', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6, padding: '0 5px', boxSizing: 'border-box', transform: rise(0.15) }}>
            {[0, 1, 2].map((k) => <div key={k} style={{ height: 4, borderRadius: 2, background: '#C2B1A8' }} />)}
          </div>
        ))}
      </div>
    );
  }
  // Televisor con el reproductor y el icono de enviar que emite ondas.
  const waves = [0, 1, 2];
  return (
    <div style={{ position: 'relative', width: 340, height: 240 }}>
      <div style={{ position: 'absolute', left: 30, top: 20, width: 280, height: 170, borderRadius: 16, background: '#2a2b30', padding: 8, boxSizing: 'border-box', boxShadow: '0 24px 50px rgba(16,16,16,0.25)', transform: rise(0) }}>
        <NowPlaying w={264} h={154} frame={frame} seed={6} />
      </div>
      <div style={{ position: 'absolute', left: 140, top: 192, width: 60, height: 26, borderRadius: '0 0 10px 10px', background: '#3a3b42', transform: rise(0.05) }} />
      <svg width="120" height="120" viewBox="0 0 120 120" style={{ position: 'absolute', left: 250, top: -24 }}>
        {waves.map((i) => {
          const ph = (frame / 26 + i / 3) % 1;
          const r = 16 + ph * 46;
          return <path key={i} d={`M 18 ${102 - r} A ${r} ${r} 0 0 1 ${18 + r} 102`} fill="none" stroke={ST} strokeWidth={9 - 5 * ph} strokeLinecap="round" opacity={(1 - ph) * (0.45 + 0.55 * act) * Math.min(1, s)} />;
        })}
        <circle cx="18" cy="102" r="7" fill={ST} opacity={Math.min(1, s)} />
      </svg>
    </div>
  );
};

// A09 · Dispositivos: cuatro tarjetas (móvil y tablet, relojes, coche, Chromecast) que se recentran al llegar cada una; abajo,
// «ordenador y web: no» (Storytel lo dice en su web: solo se escucha y se lee en la app).
export const A09Dispositivos: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('A09', w, n);
  const items = [
    { f: at('android'), title: 'Móvil y tablet', sub: 'Android · iPhone' },
    { f: at('apple'), title: 'Relojes', sub: 'Apple Watch · Wear OS' },
    { f: at('coche'), title: 'En el coche', sub: 'CarPlay · Android Auto' },
    { f: at('chromecast'), title: 'En la tele', sub: 'Chromecast' },
  ];
  const fOjo = at('ojo');
  const fOrd = at('ordenador');
  const fWeb = at('web');
  const sNo = spring({ frame: frame - fOjo, fps, config: { damping: 12, stiffness: 190 } });
  const k = frame - fOrd - 2;
  const shake = k >= 0 && k < 16 ? 16 * Math.exp(-k / 4) * Math.sin(k * 1.9) : 0;
  const xIn = interpolate(frame, [fOrd, fOrd + 10], [0, 1], { ...clamp, easing: easeOut });
  const xIn2 = interpolate(frame, [fWeb - 4, fWeb + 6], [0, 1], { ...clamp, easing: easeOut });
  const CW = 410;
  const GAP = 34;
  // La fila se recentra cada vez que llega una tarjeta.
  const nAdd = [1, 2, 3].reduce((a, i) => a + spring({ frame: frame - (items[i].f - 10), fps, config: { damping: 18, stiffness: 120 } }), 0);
  const lift = interpolate(frame, [fOjo - 8, fOjo + 8], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <StrStage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 30, transform: `translateY(${(-30 * lift).toFixed(2)}px)` }}>
        <MaskTitle text="¿Dónde funciona?" hi="funciona" at={2} size={92} align="center" />
        <div style={{ display: 'flex', gap: GAP, marginTop: 54, perspective: 2200, transform: `translateX(${((3 - nAdd) * (CW + GAP) / 2).toFixed(2)}px)` }}>
          {items.map((it, i) => {
            const s = spring({ frame: frame - it.f + 5, fps, config: { damping: 14, stiffness: 150 } });
            const next = i < items.length - 1 ? items[i + 1].f : fOjo;
            const act = interpolate(frame, [it.f - 2, it.f + 8, next - 6, next], [0, 1, 1, 0], clamp);
            if (frame < it.f - 8) return <div key={it.title} style={{ width: CW, height: 440 }} />;
            return (
              <div key={it.title} style={{ position: 'relative', width: CW, height: 440, borderRadius: 44, background: '#fff', border: `1px solid ${color.line}`,
                boxShadow: `0 0 0 ${(5 * act).toFixed(2)}px ${color.yellow}, 0 ${(40 + 24 * act).toFixed(1)}px ${(90 + 20 * act).toFixed(1)}px rgba(16,16,16,${(0.11 + 0.05 * act).toFixed(3)})`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 38, boxSizing: 'border-box', overflow: 'hidden',
                opacity: Math.min(1, s * 1.3), transform: `translateY(${((1 - s) * 90 - 14 * act).toFixed(2)}px) rotateY(${((1 - s) * (i < 2 ? -30 : 30)).toFixed(2)}deg) scale(${((0.92 + 0.08 * s) * (1 + 0.025 * act)).toFixed(4)})` }}>
                <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 260, background: `radial-gradient(ellipse at 50% 60%, rgba(255,80,28,${(0.06 + 0.1 * act).toFixed(3)}) 0%, rgba(255,80,28,0) 65%)` }} />
                <div style={{ position: 'absolute', left: 35, top: 32 }}><DeviceArt kind={i as 0 | 1 | 2 | 3} s={s} act={act} frame={frame} /></div>
                <Sheen at={it.f + 4} radius={44} tint="rgba(255,80,28,0.22)" />
                <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 700, fontSize: 42, color: color.ink, letterSpacing: -0.8 }}>{it.title}</div>
                <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 500, fontSize: 28, color: color.ink2, marginTop: 8 }}>{it.sub}</div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 48, minHeight: 96, display: 'flex', alignItems: 'center', gap: 22, padding: '18px 40px 18px 28px', borderRadius: 999, background: '#fff', border: `3px solid ${color.red}`,
          fontFamily: font.sans, fontWeight: 700, fontSize: 42, color: color.ink, opacity: Math.min(1, sNo * 1.4), boxSizing: 'border-box',
          transform: `translateX(${shake.toFixed(2)}px) translateY(${((1 - sNo) * 40).toFixed(2)}px) scale(${(0.82 + 0.18 * sNo).toFixed(4)})`, boxShadow: shadow.float }}>
          <span style={{ position: 'relative', display: 'inline-flex' }}>
            <LaptopIcon size={58} />
            <span style={{ position: 'absolute', right: -10, bottom: -6, transform: `scale(${xIn.toFixed(4)})` }}><CrossIcon size={32} /></span>
          </span>
          <span style={{ position: 'relative', display: 'inline-flex' }}>
            <GlobeIcon size={52} />
            <span style={{ position: 'absolute', right: -10, bottom: -6, transform: `scale(${xIn2.toFixed(4)})` }}><CrossIcon size={32} /></span>
          </span>
          Ni ordenador ni web: <span style={{ color: color.red }}>solo la app</span>
        </div>
      </AbsoluteFill>
      {items.map((it) => <Sfx key={it.title} name="snap_in" at={it.f + 3} volume={0.8} />)}
      {items.map((it) => <Sfx key={`w${it.title}`} name="whoosh_soft" at={it.f - 2} volume={0.35} />)}
      <Sfx name="ui_pop" at={fOjo + 2} volume={0.8} />
      <Sfx name="cross" at={fOrd + 2} />
      <Sfx name="cross" at={fWeb - 2} volume={0.7} />
    </StrStage>
  );
};

// Estrellas de una valoración (0–5), rellenas hasta `v` (con medias estrellas).
const Stars: React.FC<{ v: number; size: number; c: string }> = ({ v, size, c }) => (
  <div style={{ display: 'flex', gap: size * 0.12 }}>
    {[0, 1, 2, 3, 4].map((i) => {
      const fill = Math.max(0, Math.min(1, v - i));
      return (
        <div key={i} style={{ position: 'relative', width: size, height: size }}>
          <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: 'absolute', inset: 0 }}><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z" fill="#E6E6E6" /></svg>
          <div style={{ position: 'absolute', inset: 0, width: `${fill * 100}%`, overflow: 'hidden', transform: `scale(${(1 + 0.18 * Math.max(0, Math.min(1, (v - i - 0.6) * 4)) * Math.max(0, 1 - (v - i - 0.85) * 3)).toFixed(4)})` }}>
            <svg width={size} height={size} viewBox="0 0 24 24"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z" fill={c} /></svg>
          </div>
        </div>
      );
    })}
  </div>
);

// A10 · Opiniones: Google Play (4,5, más de medio millón de reseñas) y App Store España (4,5); lo que más gusta y lo que más
// se critica (de las 200 reseñas más recientes de la App Store España) y el consejo: busca tus libros antes de pagar.
export const A10Opiniones: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('A10', w, n);
  const fGoogle = at('google');
  const fCuatro = at('cuatro');
  const fMedio = at('medio');
  const fApp = at('app');
  const fCuatro2 = at('cuatro', 1);
  const fGusta = at('gusta');
  const fPagar = at('pagar');
  const fCritica = at('critica');
  const fFaltan = at('faltan');
  const fBusca = at('busca');
  const sG = spring({ frame: frame - fGoogle + 4, fps, config: { damping: 15, stiffness: 150 } });
  const sA = spring({ frame: frame - fApp + 4, fps, config: { damping: 15, stiffness: 150 } });
  const atG = fCuatro - 6;
  const atA = fCuatro2 - 6;
  const vG = 4.5 * Math.min(1, odometerProgress(frame, atG, fps, 34));
  const vA = 4.5 * Math.min(1, odometerProgress(frame, atA, fps, 34));
  const actG = interpolate(frame, [fGoogle, fGoogle + 8, fApp - 6, fApp], [0, 1, 1, 0], clamp);
  const actA = interpolate(frame, [fApp, fApp + 8, fGusta - 8, fGusta], [0, 1, 1, 0], clamp);
  // Las tarjetas suben y se hacen pequeñas para dejar sitio a lo que gusta y lo que se critica.
  const up = interpolate(frame, [fGusta - 10, fGusta + 8], [0, 1], { ...clamp, easing: easeInOut });
  const sLike = spring({ frame: frame - fGusta + 2, fps, config: { damping: 14, stiffness: 170 } });
  const sCrit = spring({ frame: frame - fCritica + 2, fps, config: { damping: 14, stiffness: 170 } });
  const like2 = interpolate(frame, [fPagar - 2, fPagar + 10], [0, 1], { ...clamp, easing: easeOut });
  const crit2 = interpolate(frame, [fFaltan - 2, fFaltan + 10], [0, 1], { ...clamp, easing: easeOut });
  const sBusca = spring({ frame: frame - fBusca + 2, fps, config: { damping: 12, stiffness: 190 } });
  const card = (title: string, v: number, val: string, oAt: number, sub: string, s: number, act: number, c: string) => {
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
        <div style={{ marginTop: 18 }}><Stars v={v} size={56} c={c} /></div>
        <div style={{ marginTop: 20, fontFamily: font.sans, fontWeight: 500, fontSize: 31, color: color.ink2, minHeight: 40 }}>{sub}</div>
      </div>
    );
  };
  const pill = (good: boolean, s: number, lead2: string, rest: string, p2: number) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '20px 34px 20px 22px', borderRadius: 28, background: good ? '#E9F7EF' : '#FDECEC', border: `2px solid ${good ? 'rgba(31,157,85,0.35)' : 'rgba(229,72,77,0.35)'}`,
      fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink, opacity: s, transform: `translateY(${((1 - s) * 40).toFixed(2)}px) scale(${(0.9 + 0.1 * s).toFixed(4)})`, boxShadow: shadow.soft }}>
      {good ? <CheckIcon size={50} /> : <CrossIcon size={50} />}
      <span style={{ color: good ? color.green : color.red }}>{lead2}</span>
      <span style={{ opacity: p2, transform: `translateX(${((1 - p2) * -14).toFixed(2)}px)`, display: 'inline-block' }}>{rest}</span>
    </div>
  );
  return (
    <StrStage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', top: 92, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: 1 - up, transform: `translateY(${(-40 * up).toFixed(2)}px)` }}>
          <MaskTitle text="¿Qué opinan los usuarios?" hi="opinan" at={2} size={80} align="center" />
        </div>
        <div style={{ position: 'absolute', top: 250, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 48,
          transform: `translateY(${(-90 * up).toFixed(2)}px) scale(${(1 - 0.22 * up).toFixed(4)}) translateX(${((1 - Math.min(1, sA)) * 334).toFixed(2)}px)`, transformOrigin: '50% 0%' }}>
          {card('Google Play', vG, '4,5', atG, frame >= fMedio - 4 ? 'Más de medio millón de reseñas' : '', sG, actG, ST)}
          {card('App Store (España)', vA, '4,5', atA, frame >= fCuatro2 + 10 ? 'Unas 9.200 valoraciones' : '', sA, actA, ST)}
        </div>
        <div style={{ position: 'absolute', top: 556, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          {frame >= fGusta - 4 && pill(true, sLike, 'Gusta:', 'pagar lo mismo, escuches lo que escuches', like2)}
          {frame >= fCritica - 4 && pill(false, sCrit, 'Se critica:', 'faltan novedades y superventas', crit2)}
        </div>
      </AbsoluteFill>
      {/* «Busca tus libros antes de pagar»: una barra de búsqueda que cae al final. */}
      {frame >= fBusca - 6 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 818, display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 40px 18px 26px', borderRadius: 999, background: color.ink, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 38,
            opacity: sBusca, transform: `translateY(${((1 - sBusca) * 40).toFixed(2)}px) scale(${(0.85 + 0.15 * sBusca).toFixed(4)})`, boxShadow: '0 24px 60px rgba(16,16,16,0.3)' }}>
            <SearchIcon size={44} c={color.yellow} /> Busca tus libros antes de pagar
          </div>
        </div>
      )}
      <Sfx name="ui_pop" at={fGoogle - 2} />
      <ChangeTicks value={(f) => odometerShown('4,5', atG, fps, f, 34)} from={atG} to={atG + 44} volume={0.6} />
      <Sfx name="ui_pop" at={fApp - 2} />
      <ChangeTicks value={(f) => odometerShown('4,5', atA, fps, f, 34)} from={atA} to={atA + 44} volume={0.6} />
      <Sfx name="whoosh_soft" at={fGusta - 8} volume={0.5} />
      <Sfx name="success" at={fGusta + 2} volume={0.55} />
      <Sfx name="hit_soft" at={fCritica + 1} volume={0.7} />
      <Sfx name="ui_pop" at={fBusca} volume={0.8} />
    </StrStage>
  );
};

// A11 · Lo bueno y lo malo: dos columnas con cuatro huecos que se llenan al ritmo de la voz.
export const A11ProsCons: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('A11', w, n);
  const pros = [
    { f: at('limite'), t: 'Sin límite de horas por 8,99 €' },
    { f: at('audiolibros'), t: 'Audiolibros y ebooks en una cuota' },
    { f: at('series'), t: 'Series que solo están aquí' },
    { f: at('familiar'), t: 'Family con cuentas separadas' },
  ];
  const cons = [
    { f: at('todo'), t: 'No está todo lo nuevo' },
    { f: at('ordenador'), t: 'Sin ordenador ni web' },
    { f: at('siete'), t: 'Prueba de solo 7 días' },
    { f: at('cancelas'), t: 'Cancelar la prueba corta el acceso' },
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
                  <div style={{ fontFamily: font.sans, fontWeight: act > 0.5 ? 700 : 500, fontSize: 37, color: color.ink, letterSpacing: -0.5 }}>{it.t}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  return (
    <StrStage>
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
    </StrStage>
  );
};

// A12 · Veredicto: «Si escuchas mucho, sí» (8,99 € sin contar horas; con tres en casa, el Family sale a unos 7 € por persona)
// y «Si escuchas uno o dos libros al mes, compara» (barras de horas de Podimo y Nextory frente a Storytel, con su precio).
export const A12Veredicto: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('A12', w, n);
  const fMucho = at('mucho');
  const fOcho = at('ocho');
  const fHoras = at('horas');
  const fTres = at('tres');
  const fSiete = at('siete');
  const fSolo = at('solo');
  const fPlanes = at('planes');
  const fPodimo = at('podimo');
  const fNextory = at('nextory');
  const s1 = spring({ frame: frame - fMucho + 8, fps, config: { damping: 15, stiffness: 140 } });
  const s2 = spring({ frame: frame - fSolo + 6, fps, config: { damping: 15, stiffness: 140 } });
  const actL = interpolate(frame, [fMucho - 6, fMucho + 4, fSolo - 8, fSolo], [0, 1, 1, 0], clamp);
  const actR = interpolate(frame, [fSolo - 8, fSolo + 2], [0, 1], clamp);
  const pairIn = spring({ frame: frame - (fSolo - 12), fps, config: { damping: 18, stiffness: 120 } });
  const sYes = spring({ frame: frame - fMucho - 30, fps, config: { damping: 11, stiffness: 200 } });
  const sHoras = spring({ frame: frame - fHoras + 2, fps, config: { damping: 14, stiffness: 190 } });
  const sFam = spring({ frame: frame - fTres + 2, fps, config: { damping: 14, stiffness: 190 } });
  const sPer = spring({ frame: frame - fSiete + 2, fps, config: { damping: 11, stiffness: 200 } });
  const card: React.CSSProperties = { position: 'relative', width: 800, height: 580, borderRadius: 48, background: '#fff', border: `1px solid ${color.line}`, padding: '44px 50px', boxSizing: 'border-box' };
  const bars = [
    { name: 'Podimo Premium', price: '4,99 €', fill: 0.2, label: '20 h', f: fPodimo - 8, on: '#A89BED' },
    { name: 'Nextory Mini', price: '5,99 €', fill: 0.1, label: '10 h', f: fNextory - 8, on: '#F25E6B' },
    { name: 'Storytel', price: '8,99 €', fill: 1, label: 'Sin límite', f: fPlanes - 6, on: ST },
  ];
  return (
    <StrStage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <MaskTitle text="¿Merece la pena?" hi="pena" at={2} size={104} align="center" />
        <div style={{ display: 'flex', gap: 48, marginTop: 52, perspective: 2200, transform: `translateX(${((1 - pairIn) * 424).toFixed(2)}px)` }}>
          {/* Si escuchas mucho: sí */}
          <div style={{ ...card, boxShadow: `0 0 0 ${(5 * actL).toFixed(2)}px ${color.yellow}, 0 ${(40 + 24 * actL).toFixed(1)}px 100px rgba(16,16,16,${(0.11 + 0.05 * actL).toFixed(3)})`,
            opacity: Math.min(1, s1 * 1.3) * (1 - 0.35 * actR), transform: `translateY(${((1 - s1) * 90 - 14 * actL).toFixed(2)}px) rotateY(${((1 - s1) * -26).toFixed(2)}deg) scale(${(1 - 0.03 * actR).toFixed(4)})` }}>
            <Sheen at={fMucho} radius={48} tint="rgba(31,157,85,0.18)" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontFamily: font.sans, fontWeight: 700, fontSize: 46, color: color.ink, letterSpacing: -1 }}>
                <HeadphonesIcon size={58} /> Si escuchas mucho
              </div>
              <div style={{ padding: '10px 24px', borderRadius: 999, background: color.green, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 40,
                opacity: sYes, transform: `scale(${(0.6 + 0.4 * sYes).toFixed(4)}) rotate(${((1 - sYes) * -8).toFixed(2)}deg)` }}>Sí</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 30, fontFamily: font.sans, fontWeight: 700, color: color.ink }}>
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <Odometer text="8,99" at={fOcho - 6} size={120} style={{ letterSpacing: -5 }} />
                {/* Hasta que la voz dice el precio, un hueco con brillo (como en las notas de las tiendas). */}
                {frame < fOcho - 7 && <span style={{ position: 'absolute', left: 0, right: 6, top: '16%', bottom: '8%', borderRadius: 24, background: 'linear-gradient(100deg, #EDEDED 35%, #F9F9F9 50%, #EDEDED 65%)',
                  backgroundSize: '300% 100%', backgroundPosition: `${100 - ((frame * 2.4) % 100)}% 0` }} />}
              </span>
              <span style={{ fontSize: 50 }}>€</span><span style={{ fontSize: 30, fontWeight: 500, color: color.muted }}>/mes</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 10, fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: ST_DEEP, opacity: sHoras, transform: `translateX(${((1 - sHoras) * -20).toFixed(2)}px)` }}>
              <InfinityIcon size={44} c={ST} /> Sin contar horas
            </div>
            <div style={{ position: 'absolute', left: 50, right: 50, bottom: 40, paddingTop: 26, borderTop: `1px solid ${color.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: sFam, transform: `translateY(${((1 - sFam) * 20).toFixed(2)}px)` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {[ST, ST_PINK, color.yellow].map((c, i) => (
                  <span key={i} style={{ width: 62, height: 62, borderRadius: '50%', background: c, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginLeft: i ? -18 : 0, border: '4px solid #fff',
                    transform: `scale(${Math.min(1, sFam * 1.2 - i * 0.1).toFixed(4)})` }}><UserIcon size={34} c="#101010" sw={2.2} /></span>
                ))}
                <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: color.ink, marginLeft: 8, whiteSpace: 'nowrap' }}>Family, 3 cuentas</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontFamily: font.sans, fontWeight: 700, color: ST_DEEP, whiteSpace: 'nowrap',
                opacity: sPer, transform: `scale(${(0.7 + 0.3 * sPer).toFixed(4)})`, transformOrigin: '100% 50%' }}>
                <span style={{ fontSize: 50, lineHeight: 1, letterSpacing: -1 }}>≈ 7 €</span>
                <span style={{ fontSize: 26, fontWeight: 500, color: color.ink2, marginTop: 6 }}>por persona</span>
              </div>
            </div>
          </div>
          {/* Si escuchas uno o dos libros al mes: compara */}
          <div style={{ ...card, boxShadow: `0 0 0 ${(5 * actR).toFixed(2)}px ${color.yellow}, 0 ${(40 + 24 * actR).toFixed(1)}px 100px rgba(16,16,16,${(0.11 + 0.05 * actR).toFixed(3)})`,
            opacity: Math.min(1, s2 * 1.3), transform: `translateY(${((1 - s2) * 90 - 14 * actR).toFixed(2)}px) rotateY(${((1 - s2) * 26).toFixed(2)}deg)` }}>
            <Sheen at={fSolo} radius={48} tint="rgba(255,80,28,0.22)" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: color.ink, letterSpacing: -1 }}>
              <span style={{ width: 62, height: 62, borderRadius: '50%', background: color.ink, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><ClockIcon size={38} c="#fff" /></span>
              1 o 2 libros al mes: compara
            </div>
            <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 29, color: color.muted, marginTop: 26 }}>Horas al mes · precio</div>
            {bars.map((r, k) => {
              const sr = spring({ frame: frame - r.f, fps, config: { damping: 16, stiffness: 150 } });
              const grow = interpolate(frame, [r.f + 2, r.f + (k === 2 ? 30 : 16)], [0, 1], { ...clamp, easing: easeOut });
              return (
                <div key={r.name} style={{ marginTop: k ? 26 : 16, opacity: sr, transform: `translateY(${((1 - sr) * 20).toFixed(2)}px)` }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: color.ink }}>
                    <span>{r.name}</span><span style={{ fontSize: 36 }}>{r.price}</span>
                  </div>
                  <div style={{ position: 'relative', height: 40, marginTop: 10, borderRadius: 20, background: '#EFEFF3', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(r.fill * 100 * grow).toFixed(2)}%`, borderRadius: 20, background: r.on }} />
                    <div style={{ position: 'absolute', ...(k === 2 ? { right: 16 } : { left: `calc(${(r.fill * 100 * grow).toFixed(2)}% + 12px)` }), top: 0, bottom: 0, display: 'flex', alignItems: 'center', gap: 8,
                      fontFamily: font.sans, fontWeight: 700, fontSize: 26, color: k === 2 ? '#fff' : color.ink2, opacity: interpolate(frame, [r.f + (k === 2 ? 22 : 10), r.f + (k === 2 ? 30 : 18)], [0, 1], clamp), whiteSpace: 'nowrap' }}>
                      {k === 2 ? <InfinityIcon size={30} c="#fff" /> : null}{r.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
      <Sfx name="card_flip" at={fMucho - 4} volume={0.8} />
      <Sfx name="stamp" at={fMucho + 32} volume={0.45} />
      <ChangeTicks value={(f) => odometerShown('8,99', fOcho - 6, fps, f)} from={fOcho - 6} to={fOcho + 34} volume={0.45} />
      <Sfx name="ui_pop" at={fHoras} volume={0.6} />
      <Sfx name="ui_pop" at={fTres} volume={0.6} />
      <Sfx name="coins" at={fSiete + 2} volume={0.5} />
      <Sfx name="card_flip" at={fSolo - 2} volume={0.8} />
      <Sfx name="draw" at={fPlanes - 2} volume={0.4} dur={14} fade={6} />
      <Sfx name="ui_pop" at={fPodimo - 6} volume={0.6} />
      <Sfx name="ui_pop" at={fNextory - 6} volume={0.6} />
    </StrStage>
  );
};
