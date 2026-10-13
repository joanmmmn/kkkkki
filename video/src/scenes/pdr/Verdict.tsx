import React from 'react';
import { AbsoluteFill, Easing, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Stage } from '../../components/Stage';
import { ChangeTicks, Keystrokes, Sfx } from '../../components/Sfx';
import { typedCount, typeTimes } from '../../lib/typing';
import { CheckIcon, CrossIcon, HeadphonesIcon, MicIcon } from '../../components/Icons';
import { CalendarIcon, ClockIcon, InfinityIcon, WatchIcon } from '../../components/Icons2';
import { ScreenClip, CamKey } from '../../components/ScreenClip';
import { TiltWindow } from '../nxr/Verdict';
import { wf } from './timeline';
import type { SceneProps } from './registry';
import { Kicker, MaskTitle, Odometer, odometerProgress, odometerShown, PdrStage, PV, PV_DEEP, PV_SOFT, Sheen } from './kit';

type P = SceneProps;

const phaseStyle = (frame: number, from: number, to: number) => {
  const pin = interpolate(frame, [from - 4, from + 12], [0, 1], { ...clamp, easing: easeOut });
  const pout = interpolate(frame, [to - 12, to + 2], [0, 1], { ...clamp, easing: easeInOut });
  return {
    visible: frame >= from - 4 && frame <= to + 2,
    style: { opacity: pin * (1 - pout), transform: `translateX(${(1 - pin) * 160 - pout * 200}px)`, filter: (1 - pin) + pout > 0.02 ? `blur(${((1 - pin) * 10 + pout * 10).toFixed(2)}px)` : undefined } as React.CSSProperties,
  };
};

// K09 · Dispositivos (v2): tres tarjetas grandes con su escena animada (móvil y tablet con la app sonando, el coche con
// la pantalla del salpicadero y un altavoz que emite ondas); el Apple Watch, abajo, con su «de momento, no».
const NowPlaying: React.FC<{ w: number; h: number; frame: number; seed: number; vertical?: boolean }> = ({ w, h, frame, seed, vertical = false }) => {
  const bars = [0, 1, 2, 3];
  const eq = (i: number) => 0.35 + 0.65 * Math.abs(Math.sin(frame / (5.2 + i * 0.9) + seed + i * 1.7));
  const cover = vertical ? w * 0.62 : h * 0.5;
  return (
    <div style={{ width: w, height: h, borderRadius: Math.min(w, h) * 0.12, background: 'linear-gradient(160deg, #1d1d22 0%, #0d0d10 100%)', display: 'flex', flexDirection: vertical ? 'column' : 'row',
      alignItems: 'center', justifyContent: 'center', gap: Math.min(w, h) * 0.1, padding: Math.min(w, h) * 0.08, boxSizing: 'border-box', overflow: 'hidden' }}>
      <div style={{ width: cover, height: cover, borderRadius: cover * 0.14, background: `linear-gradient(135deg, ${PV} 0%, #7C6BE0 100%)`, flexShrink: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: cover * 0.06, paddingBottom: cover * 0.16, boxSizing: 'border-box' }}>
        {bars.map((i) => <div key={i} style={{ width: cover * 0.1, height: cover * 0.5 * eq(i), borderRadius: cover * 0.05, background: '#fff' }} />)}
      </div>
      <div style={{ flex: vertical ? undefined : 1, width: vertical ? '100%' : undefined, display: 'flex', flexDirection: 'column', gap: Math.min(w, h) * 0.06 }}>
        <div style={{ height: Math.min(w, h) * 0.07, width: '80%', borderRadius: 99, background: 'rgba(255,255,255,0.85)' }} />
        <div style={{ height: Math.min(w, h) * 0.05, width: '55%', borderRadius: 99, background: 'rgba(255,255,255,0.35)' }} />
        <div style={{ position: 'relative', height: Math.max(3, Math.min(w, h) * 0.035), width: '100%', borderRadius: 99, background: 'rgba(255,255,255,0.18)', marginTop: Math.min(w, h) * 0.04 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(30 + ((frame * 0.25 + seed * 20) % 60)).toFixed(1)}%`, borderRadius: 99, background: PV }} />
        </div>
      </div>
    </div>
  );
};
const DeviceArt: React.FC<{ kind: 0 | 1 | 2; s: number; act: number; frame: number }> = ({ kind, s, act, frame }) => {
  const rise = (d: number) => `translateY(${((1 - Math.min(1, s * 1.15 - d)) * 40).toFixed(2)}px)`;
  if (kind === 0) {
    return (
      <div style={{ position: 'relative', width: 400, height: 270 }}>
        <div style={{ position: 'absolute', left: 30, top: 54, width: 250, height: 180, borderRadius: 24, background: '#2a2b30', padding: 9, boxSizing: 'border-box', boxShadow: '0 24px 50px rgba(16,16,16,0.25)', transform: rise(0) }}>
          <NowPlaying w={232} h={162} frame={frame} seed={0} />
        </div>
        <div style={{ position: 'absolute', left: 250, top: 30, width: 118, height: 224, borderRadius: 24, background: '#2a2b30', padding: 7, boxSizing: 'border-box', boxShadow: '0 24px 50px rgba(16,16,16,0.3)', transform: `${rise(0.15)} rotate(${(4 * act).toFixed(2)}deg)` }}>
          <NowPlaying w={104} h={210} frame={frame} seed={2} vertical />
        </div>
      </div>
    );
  }
  if (kind === 1) {
    // Salpicadero: pantalla central con la app y el volante asomando.
    return (
      <div style={{ position: 'relative', width: 400, height: 270 }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 150, height: 120, borderRadius: '50% 50% 24px 24px / 60% 60% 24px 24px', background: 'linear-gradient(180deg, #ECEAF6 0%, #DCD9EC 100%)', transform: rise(0) }} />
        <div style={{ position: 'absolute', left: 60, top: 40, width: 280, height: 168, borderRadius: 22, background: '#2a2b30', padding: 9, boxSizing: 'border-box', boxShadow: '0 24px 50px rgba(16,16,16,0.25)', transform: rise(0.1) }}>
          <NowPlaying w={262} h={150} frame={frame} seed={4} />
        </div>
        {/* rejillas de ventilación a los lados de la pantalla */}
        {[22, 344].map((x) => (
          <div key={x} style={{ position: 'absolute', left: x, top: 92, width: 34, height: 64, borderRadius: 10, background: '#C9C5DE', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 7, padding: '0 6px', boxSizing: 'border-box', transform: rise(0.15) }}>
            {[0, 1, 2].map((k) => <div key={k} style={{ height: 5, borderRadius: 3, background: '#ADA8C8' }} />)}
          </div>
        ))}
      </div>
    );
  }
  // Altavoz con ondas que salen (tres arcos en bucle).
  const waves = [0, 1, 2];
  return (
    <div style={{ position: 'relative', width: 400, height: 270 }}>
      <div style={{ position: 'absolute', left: 92, top: 22, width: 150, height: 236, borderRadius: 36, background: 'linear-gradient(160deg, #34353b 0%, #1b1c20 100%)', boxShadow: '0 24px 50px rgba(16,16,16,0.28)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, transform: rise(0) }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #6a6c74 0%, #26272c 70%)' }} />
        <div style={{ width: 104, height: 104, borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #6a6c74 0%, #26272c 65%)',
          transform: `scale(${(1 + 0.04 * act * Math.abs(Math.sin(frame / 3.2))).toFixed(4)})` }} />
      </div>
      <svg width="170" height="270" viewBox="0 0 170 270" style={{ position: 'absolute', left: 236, top: 0 }}>
        {waves.map((i) => {
          const ph = ((frame / 26 + i / 3) % 1);
          const r = 40 + ph * 90;
          return <path key={i} d={`M ${20 + r * Math.cos(-0.7)} ${140 + r * Math.sin(-0.7)} A ${r} ${r} 0 0 1 ${20 + r * Math.cos(0.7)} ${140 + r * Math.sin(0.7)}`} fill="none"
            stroke={PV} strokeWidth={13 - 7 * ph} strokeLinecap="round" opacity={(1 - ph) * (0.45 + 0.55 * act) * Math.min(1, s)} />;
        })}
      </svg>
    </div>
  );
};

export const K09Dispositivos: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('K09', w, n);
  const items = [
    { f: at('movil'), title: 'Móvil y tablet', sub: 'iPhone, iPad y Android' },
    { f: at('coche'), title: 'En el coche', sub: 'CarPlay · Android Auto' },
    { f: at('altavoces'), title: 'En tus altavoces', sub: 'AirPlay · Chromecast' },
  ];
  const fNo = at('watch');
  const fApple = at('apple');
  const sNo = spring({ frame: frame - fApple, fps, config: { damping: 12, stiffness: 190 } });
  const k = frame - fNo - 2;
  const shake = k >= 0 && k < 16 ? 16 * Math.exp(-k / 4) * Math.sin(k * 1.9) : 0;
  const xIn = interpolate(frame, [fNo + 26, fNo + 36], [0, 1], { ...clamp, easing: easeOut });
  // La fila se recentra cada vez que llega una tarjeta (con una, en el centro; con dos, centradas; con tres, la fila entera).
  const nAdd = [1, 2].reduce((a, k) => a + spring({ frame: frame - (items[k].f - 10), fps, config: { damping: 18, stiffness: 120 } }), 0);
  return (
    <PdrStage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 30 }}>
        <MaskTitle text="¿Dónde funciona?" hi="funciona?" at={2} size={96} align="center" />
        <div style={{ display: 'flex', gap: 44, marginTop: 58, perspective: 2200, transform: `translateX(${((2 - nAdd) * 282).toFixed(2)}px)` }}>
          {items.map((it, i) => {
            const s = spring({ frame: frame - it.f + 5, fps, config: { damping: 14, stiffness: 150 } });
            const next = i < items.length - 1 ? items[i + 1].f : fApple;
            const act = interpolate(frame, [it.f - 2, it.f + 8, next - 6, next], [0, 1, 1, 0], clamp);
            if (frame < it.f - 8) return <div key={it.title} style={{ width: 520, height: 520 }} />;
            return (
              <div key={it.title} style={{ position: 'relative', width: 520, height: 520, borderRadius: 48, background: '#fff', border: `1px solid ${color.line}`,
                boxShadow: `0 0 0 ${(5 * act).toFixed(2)}px ${color.yellow}, 0 ${(40 + 24 * act).toFixed(1)}px ${(90 + 20 * act).toFixed(1)}px rgba(16,16,16,${(0.11 + 0.05 * act).toFixed(3)})`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 46, boxSizing: 'border-box', overflow: 'hidden',
                opacity: Math.min(1, s * 1.3), transform: `translateY(${((1 - s) * 90 - 16 * act).toFixed(2)}px) rotateY(${((1 - s) * (i === 0 ? -34 : i === 2 ? 34 : 0)).toFixed(2)}deg) rotateX(${((1 - s) * (i === 1 ? 30 : 0)).toFixed(2)}deg) scale(${((0.92 + 0.08 * s) * (1 + 0.025 * act)).toFixed(4)})` }}>
                <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 300, background: `radial-gradient(ellipse at 50% 60%, rgba(255,202,5,${(0.10 + 0.14 * act).toFixed(3)}) 0%, rgba(255,202,5,0) 65%)` }} />
                <div style={{ position: 'absolute', left: 60, top: 34, transform: 'scale(1.1)', transformOrigin: '50% 40%' }}><DeviceArt kind={i as 0 | 1 | 2} s={s} act={act} frame={frame} /></div>
                <Sheen at={it.f + 4} radius={48} tint="rgba(168,155,237,0.30)" />
                <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 700, fontSize: 46, color: color.ink, letterSpacing: -0.8 }}>{it.title}</div>
                <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 500, fontSize: 31, color: color.ink2, marginTop: 8 }}>{it.sub}</div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 46, minHeight: 92, display: 'flex', alignItems: 'center', gap: 20, padding: '18px 40px 18px 26px', borderRadius: 999, background: '#fff', border: `3px solid ${color.red}`,
          fontFamily: font.sans, fontWeight: 700, fontSize: 42, color: color.ink, opacity: Math.min(1, sNo * 1.4), boxSizing: 'border-box',
          transform: `translateX(${shake.toFixed(2)}px) translateY(${((1 - sNo) * 40).toFixed(2)}px) scale(${(0.82 + 0.18 * sNo).toFixed(4)})`, boxShadow: shadow.float }}>
          <span style={{ position: 'relative', display: 'inline-flex' }}>
            <WatchIcon size={56} />
            <span style={{ position: 'absolute', right: -10, bottom: -6, transform: `scale(${xIn.toFixed(4)})` }}><CrossIcon size={32} /></span>
          </span>
          Apple Watch: <span style={{ color: color.red }}>de momento, no</span>
        </div>
      </AbsoluteFill>
      {items.map((it) => <Sfx key={it.title} name="snap_in" at={it.f + 3} volume={0.8} />)}
      {items.map((it) => <Sfx key={`w${it.title}`} name="whoosh_soft" at={it.f - 2} volume={0.35} />)}
      <Sfx name="ui_pop" at={fApple + 2} volume={0.8} />
      <Sfx name="cross" at={fNo + 2} />
    </PdrStage>
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

// K10 · Opiniones: App Store (4,8 con unas 32.000 valoraciones) frente a Trustpilot (1,9), el motivo de las quejas
// (cobros al acabar la prueba) y el consejo: apúntate cuándo termina. Hasta que la voz dice la nota, la tarjeta muestra
// un esqueleto de carga (no «0,0»: en pausa se leería como una nota real).
export const K10Opiniones: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('K10', w, n);
  const fApp = at('app');
  const fCuatro = at('cuatro');
  const fVal = at('valoraciones');
  const fTrust = at('trustpilot');
  const fUno = at('uno');
  const fQuejas = at('quejas');
  const fCobros = at('cobros');
  const fApunta = at('apuntate');
  const sA = spring({ frame: frame - fApp + 4, fps, config: { damping: 15, stiffness: 150 } });
  const sT = spring({ frame: frame - fTrust + 4, fps, config: { damping: 15, stiffness: 150 } });
  // Las notas giran como un contador (a la vez que la voz las dice) y las estrellas se llenan con ellas.
  const atA = fCuatro - 6;
  const atT = fUno - 6;
  const vA = 4.8 * Math.min(1, odometerProgress(frame, atA, fps, 34));
  const vT = 1.9 * Math.min(1, odometerProgress(frame, atT, fps, 30));
  const actA = interpolate(frame, [fApp, fApp + 8, fTrust - 6, fTrust], [0, 1, 1, 0], clamp);
  const actT = interpolate(frame, [fTrust, fTrust + 8], [0, 1], clamp);
  const sQ = spring({ frame: frame - fQuejas, fps, config: { damping: 14, stiffness: 170 } });
  const sN = spring({ frame: frame - fApunta + 2, fps, config: { damping: 13, stiffness: 160 } });
  const lift = interpolate(frame, [fApunta - 8, fApunta + 8], [0, 1], { ...clamp, easing: easeInOut });
  const card = (title: string, v: number, val: string, oAt: number, sub: string, s: number, act: number, c: string, dim: number) => {
    const on = frame >= oAt - 1;
    return (
      <div style={{ position: 'relative', width: 660, padding: '44px 52px', borderRadius: 48, background: '#fff', border: `1px solid ${color.line}`,
        boxShadow: `0 0 0 ${(5 * act).toFixed(2)}px ${color.yellow}, 0 ${(40 + 24 * act).toFixed(1)}px 100px rgba(16,16,16,${(0.11 + 0.05 * act).toFixed(3)})`,
        opacity: Math.min(1, s * 1.3) * (1 - 0.4 * dim), transform: `translateY(${((1 - s) * 80 - 14 * act).toFixed(2)}px) scale(${((0.92 + 0.08 * s) * (1 + 0.03 * act - 0.03 * dim)).toFixed(4)})` }}>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 42, color: color.ink2 }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 12, fontFamily: font.sans, fontWeight: 700, color: color.ink }}>
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <Odometer text={val} at={oAt} size={168} dur={34} style={{ letterSpacing: -7 }} />
            {/* Esqueleto de carga con brillo mientras llega la nota (no «0,0»: en pausa se leería como una nota real). */}
            {!on && <span style={{ position: 'absolute', left: 0, right: 8, top: '16%', bottom: '8%', borderRadius: 28, background: 'linear-gradient(100deg, #EDEDED 35%, #F9F9F9 50%, #EDEDED 65%)',
              backgroundSize: '300% 100%', backgroundPosition: `${100 - ((frame * 2.4) % 100)}% 0` }} />}
          </span>
          <span style={{ fontSize: 44, color: color.muted }}>/ 5</span>
        </div>
        <div style={{ marginTop: 20 }}><Stars v={v} size={58} c={c} /></div>
        <div style={{ marginTop: 22, fontFamily: font.sans, fontWeight: 500, fontSize: 32, color: color.ink2, minHeight: 42 }}>{sub}</div>
      </div>
    );
  };
  return (
    <PdrStage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `translateY(${30 * lift}px)` }}>
        <div style={{ opacity: 1 - lift, transform: `translateY(${-40 * lift}px)` }}>
          <MaskTitle text="¿Qué opinan los usuarios?" hi="opinan" at={2} size={82} align="center" style={{ marginBottom: 56 }} />
        </div>
        <div style={{ display: 'flex', gap: 48, transform: `translateX(${((1 - Math.min(1, sT)) * 354).toFixed(2)}px)` }}>
          {card('App Store (España)', vA, '4,8', atA, frame >= fVal - 4 ? 'Unas 32.000 valoraciones' : '', sA, actA, color.yellow, actT)}
          {card('Trustpilot', vT, '1,9', atT, frame >= fQuejas - 2 ? 'Muchas quejas por cobros' : '', sT, actT, color.red, 0)}
        </div>
        <div style={{ marginTop: 44, minHeight: 90, display: 'flex', alignItems: 'center', gap: 18, padding: '18px 34px', borderRadius: 999, background: color.ink, color: '#fff',
          fontFamily: font.sans, fontWeight: 700, fontSize: 36, opacity: sQ, transform: `translateY(${(1 - sQ) * 30}px)` }}>
          <CrossIcon size={44} /> Quejas: cobros al acabar la prueba
          <span style={{ color: color.yellow, opacity: interpolate(frame, [fCobros, fCobros + 10], [0, 1], clamp) }}>· apúntate el día</span>
        </div>
      </AbsoluteFill>
      {/* Recordatorio en el calendario: cae desde arriba cuando la voz dice «apúntate». */}
      {frame >= fApunta - 4 && (
        <div style={{ position: 'absolute', left: 680, top: 64, width: 560, padding: '22px 26px', borderRadius: 28, background: 'rgba(255,255,255,0.97)', boxShadow: '0 30px 80px rgba(16,16,16,0.22)',
          display: 'flex', gap: 18, alignItems: 'center', opacity: sN, transform: `translateY(${(1 - sN) * -140}px) rotate(${(1 - sN) * 3}deg)` }}>
          <div style={{ width: 76, height: 76, borderRadius: 20, background: PV, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CalendarIcon size={46} c="#fff" /></div>
          <div>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.ink }}>Recordatorio · día 29</div>
            <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 26, color: color.ink2, marginTop: 4 }}>¿Me quedo con Podimo o cancelo la prueba?</div>
          </div>
        </div>
      )}
      <Sfx name="ui_pop" at={fApp - 2} />
      <ChangeTicks value={(f) => odometerShown('4,8', atA, fps, f, 34)} from={atA} to={atA + 44} volume={0.6} />
      <Sfx name="ui_pop" at={fTrust - 2} />
      <ChangeTicks value={(f) => odometerShown('1,9', atT, fps, f, 30)} from={atT} to={atT + 40} volume={0.6} />
      <Sfx name="fail" at={fUno + 16} volume={0.5} />
      <Sfx name="hit_soft" at={fQuejas + 1} volume={0.7} />
      <Sfx name="whoosh_soft" at={fApunta - 2} volume={0.6} />
      <Sfx name="success" at={fApunta + 8} volume={0.6} />
    </PdrStage>
  );
};

// K11 · Lo bueno y lo malo: dos columnas con cuatro huecos que se llenan al ritmo de la voz.
export const K11ProsCons: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('K11', w, n);
  const pros = [
    { f: at('podcasts'), t: 'Pódcasts exclusivos' },
    { f: at('plan'), t: 'Plan de 4,99 € con 20 horas' },
    { f: at('sencilla'), t: 'Una app muy sencilla' },
    { f: at('descargas'), t: 'Descargas sin conexión' },
  ];
  const cons = [
    { f: at('acumulan'), t: 'Horas que no se acumulan' },
    { f: at('perfiles'), t: 'Sin perfiles ni plan familiar' },
    { f: at('ebooks'), t: 'Sin ebooks' },
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
      <div style={{ width: 790, borderRadius: 44, background: '#fff', boxShadow: shadow.card, border: `1px solid ${color.line}`, overflow: 'hidden',
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
                  <div style={{ fontFamily: font.sans, fontWeight: act > 0.5 ? 700 : 500, fontSize: 38, color: color.ink, letterSpacing: -0.5 }}>{it.t}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  return (
    <PdrStage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 48, transform: 'scale(1.1)' }}>
          {col('Lo bueno', true, pros, 0)}
          {col('Lo malo', false, cons, 1)}
        </div>
      </AbsoluteFill>
      <Sfx name="hit_soft" at={fBueno - 1} volume={0.7} />
      {pros.map((p, i) => <Sfx key={`p${i}`} name="tick_soft" at={p.f - 2} />)}
      <Sfx name="whoosh_soft" at={fMalo} volume={0.5} />
      <Sfx name="hit_soft" at={fMalo - 1} volume={0.7} />
      {cons.map((p, i) => <Sfx key={`c${i}`} name="tick_soft" at={p.f - 2} volume={0.9} />)}
    </PdrStage>
  );
};

// K12 · Veredicto: para quién merece la pena (y cuándo comparar con Storytel) y, antes de pagar, buscar el libro en
// SonorBooks: la ficha dice en qué plataformas está (aquí, Audible, Podimo y Nextory).
export const K12Veredicto: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('K12', w, n);
  const fGustan = at('gustan');
  const fMucho = at('mucho');
  const fStory = at('storytel');
  const fAntes = at('antes');
  const fBusca = at('busca');
  const fSonor = at('sonorbooks');
  const fVer = at('ver');
  const fPod = at('podimo');
  const fOtra = at('otra');
  const fEscuchas = at('escuchas');
  const fCuatro = at('cuatro');
  const fBarato = at('barato');
  const fOcho = at('ocho');
  const s1 = spring({ frame: frame - fGustan + 8, fps, config: { damping: 15, stiffness: 140 } });
  const s2 = spring({ frame: frame - fMucho + 6, fps, config: { damping: 15, stiffness: 140 } });
  const sBarato = spring({ frame: frame - fBarato + 2, fps, config: { damping: 11, stiffness: 200 } });
  const actL = interpolate(frame, [fGustan - 6, fGustan + 4, fMucho - 8, fMucho], [0, 1, 1, 0], clamp);
  const actR = interpolate(frame, [fMucho - 8, fMucho + 2], [0, 1], clamp);
  // Con una sola tarjeta, centrada; cuando llega la segunda, la fila se recentra.
  const pairIn = spring({ frame: frame - (fMucho - 12), fps, config: { damping: 18, stiffness: 120 } });
  const A = phaseStyle(frame, -10, fAntes - 2);
  const B = phaseStyle(frame, fAntes - 2, dur + 20);
  const sWin = spring({ frame: frame - fAntes + 2, fps, config: { damping: 18, stiffness: 120 } });
  const typeAt = fBusca + 4;
  const query = 'La mala hija';
  const qKeys = typeTimes(query, typeAt, 30, 'k12');
  const typed = typedCount(qKeys, frame);
  const fichaAt = Math.max(typeAt + 34, fSonor + 4);
  const enterAt = Math.max(qKeys[qKeys.length - 1] + 6, fichaAt - 7);
  const press = interpolate(frame, [enterAt - 1, enterAt + 1, enterAt + 12], [0, 1, 0], clamp);
  const nav = interpolate(frame, [fichaAt, fichaAt + 16], [0, 1], { ...clamp, easing: Easing.bezier(0.22, 1, 0.36, 1) });
  const navO = interpolate(frame, [fichaAt, fichaAt + 6], [0, 1], { ...clamp, easing: easeInOut });
  const camHome: CamKey[] = [{ f: 0, zoom: 1.25, x: 960, y: 420 }, { f: 24, zoom: 1.7, x: 960, y: 380 }, { f: 200, zoom: 1.75, x: 960, y: 375 }];
  const fv = fichaAt;
  const camFicha: CamKey[] = [{ f: 0, zoom: 1.12, x: 1040, y: 520 }, { f: Math.max(14, fVer - 8 - fv), zoom: 1.2, x: 1100, y: 560 }, { f: Math.max(34, fVer + 16 - fv), zoom: 2.2, x: 1275, y: 712 }, { f: 400, zoom: 2.25, x: 1275, y: 712 }];
  const sQ = spring({ frame: frame - fPod + 2, fps, config: { damping: 14, stiffness: 170 } });
  const otra = interpolate(frame, [fOtra - 1, fOtra + 11], [0, 1], { ...clamp, easing: easeOut });
  return (
    <PdrStage>
      {A.visible && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', ...A.style }}>
          <MaskTitle text="¿Merece la pena?" hi="pena?" at={2} size={108} align="center" />
          <div style={{ display: 'flex', gap: 48, marginTop: 56, perspective: 2200, transform: `translateX(${((1 - pairIn) * 424).toFixed(2)}px)` }}>
            {/* Sí, si…: pódcasts + uno o dos audiolibros al mes → 4,99 €, de lo más barato */}
            <div style={{ position: 'relative', width: 800, height: 560, borderRadius: 48, background: '#fff', border: `1px solid ${color.line}`, padding: '44px 50px', boxSizing: 'border-box',
              boxShadow: `0 0 0 ${(5 * actL).toFixed(2)}px ${color.yellow}, 0 ${(40 + 24 * actL).toFixed(1)}px 100px rgba(16,16,16,${(0.11 + 0.05 * actL).toFixed(3)})`,
              opacity: Math.min(1, s1 * 1.3) * (1 - 0.35 * actR), transform: `translateY(${((1 - s1) * 90 - 14 * actL).toFixed(2)}px) rotateY(${((1 - s1) * -26).toFixed(2)}deg) scale(${(1 - 0.03 * actR).toFixed(4)})` }}>
              <Sheen at={fGustan} radius={48} tint="rgba(31,157,85,0.18)" />
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontFamily: font.sans, fontWeight: 700, fontSize: 48, color: color.ink, letterSpacing: -1 }}>
                <CheckIcon size={64} /> Te encaja si…
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 34 }}>
                {[{ f: fGustan, icon: <MicIcon size={36} />, t: 'Te gustan los pódcasts' }, { f: fEscuchas, icon: <HeadphonesIcon size={36} />, t: 'Escuchas 1 o 2 audiolibros al mes' }].map((r) => {
                  const sr = spring({ frame: frame - r.f + 2, fps, config: { damping: 15, stiffness: 190 } });
                  return (
                    <div key={r.t} style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink, opacity: sr, transform: `translateX(${((1 - sr) * -30).toFixed(2)}px)` }}>
                      <span style={{ width: 62, height: 62, borderRadius: '50%', background: color.yellowSoft, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{r.icon}</span>
                      {r.t}
                    </div>
                  );
                })}
              </div>
              <div style={{ position: 'absolute', left: 50, right: 50, bottom: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 30, borderTop: `1px solid ${color.line}` }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, fontFamily: font.sans, fontWeight: 700, color: color.ink, opacity: interpolate(frame, [fCuatro - 4, fCuatro + 6], [0, 1], clamp) }}>
                  <Odometer text="4,99" at={fCuatro - 6} size={96} style={{ letterSpacing: -4 }} />
                  <span style={{ fontSize: 44 }}>€</span><span style={{ fontSize: 30, fontWeight: 500, color: color.muted }}>/mes</span>
                </div>
                <div style={{ padding: '14px 26px', borderRadius: 999, background: color.yellow, fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: color.ink, whiteSpace: 'nowrap',
                  opacity: sBarato, transform: `scale(${(0.7 + 0.3 * sBarato).toFixed(4)}) rotate(${((1 - sBarato) * -6).toFixed(2)}deg)` }}>De lo más barato</div>
              </div>
            </div>
            {/* Si escuchas mucho, compara: 20 h de Podimo frente a Storytel sin límite */}
            <div style={{ position: 'relative', width: 800, height: 560, borderRadius: 48, background: '#fff', border: `1px solid ${color.line}`, padding: '44px 50px', boxSizing: 'border-box',
              boxShadow: `0 0 0 ${(5 * actR).toFixed(2)}px ${color.yellow}, 0 ${(40 + 24 * actR).toFixed(1)}px 100px rgba(16,16,16,${(0.11 + 0.05 * actR).toFixed(3)})`,
              opacity: Math.min(1, s2 * 1.3), transform: `translateY(${((1 - s2) * 90 - 14 * actR).toFixed(2)}px) rotateY(${((1 - s2) * 26).toFixed(2)}deg)` }}>
              <Sheen at={fMucho} radius={48} tint="rgba(168,155,237,0.30)" />
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontFamily: font.sans, fontWeight: 700, fontSize: 48, color: color.ink, letterSpacing: -1 }}>
                <span style={{ width: 64, height: 64, borderRadius: '50%', background: color.ink, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><ClockIcon size={38} c="#fff" /></span>
                Si escuchas mucho, compara
              </div>
              <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 30, color: color.muted, marginTop: 34 }}>Horas de audiolibros al mes</div>
              {[
                { name: 'Podimo Premium', price: '4,99 €', on: PV, fill: 0.2, f: fMucho + 6, label: '20 h' },
                { name: 'Storytel', price: '8,99 €', on: color.ink, fill: 1, f: fStory - 4, label: 'Sin límite' },
              ].map((r, k) => {
                const sr = spring({ frame: frame - r.f, fps, config: { damping: 16, stiffness: 150 } });
                const grow = interpolate(frame, [r.f + 2, r.f + (k ? 30 : 16)], [0, 1], { ...clamp, easing: easeOut });
                const sp = k ? spring({ frame: frame - fOcho + 2, fps, config: { damping: 12, stiffness: 200 } }) : sr;
                return (
                  <div key={r.name} style={{ marginTop: k ? 40 : 24, opacity: sr, transform: `translateY(${((1 - sr) * 20).toFixed(2)}px)` }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink }}>
                      <span>{r.name}</span>
                      <span style={{ fontSize: 44, opacity: sp, display: 'inline-block', transform: `scale(${(0.7 + 0.3 * sp).toFixed(4)})`, transformOrigin: 'right center' }}>{r.price}</span>
                    </div>
                    <div style={{ position: 'relative', height: 46, marginTop: 14, borderRadius: 23, background: '#EFEFF3', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(r.fill * 100 * grow).toFixed(2)}%`, borderRadius: 23, background: r.on }} />
                      <div style={{ position: 'absolute', ...(k ? { right: 18 } : { left: `calc(${(r.fill * 100 * grow).toFixed(2)}% + 14px)` }), top: 0, bottom: 0, display: 'flex', alignItems: 'center', gap: 10,
                        fontFamily: font.sans, fontWeight: 700, fontSize: 28, color: k ? '#fff' : PV_DEEP, opacity: interpolate(frame, [r.f + (k ? 22 : 10), r.f + (k ? 30 : 18)], [0, 1], clamp), whiteSpace: 'nowrap' }}>
                        {k ? <InfinityIcon size={34} c="#fff" /> : null}{r.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AbsoluteFill>
      )}
      {B.visible && (
        <AbsoluteFill style={B.style}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 54, display: 'flex', justifyContent: 'center' }}>
            <Kicker at={fAntes} text="Antes de pagar" style={{ marginBottom: 0 }} />
          </div>
          <div style={{ position: 'absolute', left: 230, top: 112, opacity: sWin, transform: `translateY(${(1 - sWin) * 60}px) scale(${0.94 + 0.06 * sWin})` }}>
            <TiltWindow width={1460} url="sonorbooks.com" ry={-3} rx={2}>
              {frame < fichaAt + 16 && (
                <div style={{ position: 'absolute', inset: 0, opacity: 1 - 0.6 * navO, transform: `scale(${1 - 0.04 * nav})` }}>
                  <Sequence from={fAntes - 6} layout="none">
                    <ScreenClip image src="pdr/web/00_home/home_still.jpg" width={1460} camera={camHome} showCursor={false}
                      overlay={() => (
                        <div style={{ position: 'absolute', left: 718, top: 340, width: 380, height: 48, background: '#fff', display: 'flex', alignItems: 'center', fontFamily: font.sans, fontSize: 19, color: '#1a1a1a',
                          boxShadow: press > 0.01 ? `0 0 0 ${(3 * press).toFixed(2)}px rgba(255,202,5,${(0.9 * press).toFixed(3)})` : undefined, borderRadius: 6 }}>
                          {query.slice(0, typed)}<span style={{ opacity: Math.floor(frame / 12) % 2 === 0 || (typed > 0 && typed < query.length) ? 1 : 0, marginLeft: 1 }}>|</span>
                        </div>
                      )} />
                  </Sequence>
                </div>
              )}
              {frame >= fichaAt && (
                <div style={{ position: 'absolute', inset: 0, opacity: navO, transform: `translateY(${((1 - nav) * 12).toFixed(2)}%) scale(${(0.985 + 0.015 * nav).toFixed(4)})`,
                  boxShadow: nav < 1 ? '0 -30px 60px rgba(16,16,16,0.18)' : undefined }}>
                  <Sequence from={fichaAt} layout="none">
                    <ScreenClip image src="pdr/web/11_ficha_click/ficha_still.jpg" width={1460} camera={camFicha} showCursor={false} markDim={0.6}
                      marks={[{ from: fVer - fichaAt, to: dur + 20 - fichaAt, x: 958, y: 678, w: 636, h: 72, r: 18 }]} />
                  </Sequence>
                </div>
              )}
            </TiltWindow>
          </div>
          {frame >= fPod - 2 && (
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 40, display: 'flex', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 36px', borderRadius: 999, background: color.ink, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 38,
                opacity: sQ, transform: `translateY(${(1 - sQ) * 30}px)`, boxShadow: '0 24px 60px rgba(16,16,16,0.3)' }}>
                ¿Está en Podimo
                <span style={{ display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap', verticalAlign: 'bottom', color: color.yellow,
                  maxWidth: `${(otra * 420).toFixed(1)}px`, marginLeft: `${((otra - 1) * 18).toFixed(1)}px`, opacity: otra, transform: `translateX(${((1 - otra) * -16).toFixed(1)}px)` }}>o en otra plataforma?</span>
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}
      <Sfx name="card_flip" at={fGustan - 4} volume={0.8} />
      <Sfx name="ui_pop" at={fGustan} volume={0.6} />
      <Sfx name="ui_pop" at={fEscuchas} volume={0.6} />
      <ChangeTicks value={(f) => odometerShown('4,99', fCuatro - 6, fps, f)} from={fCuatro - 6} to={fCuatro + 34} volume={0.45} />
      <Sfx name="stamp" at={fBarato + 4} volume={0.45} />
      <Sfx name="card_flip" at={fMucho - 2} volume={0.8} />
      <Sfx name="draw" at={fMucho + 8} volume={0.4} dur={12} fade={6} />
      <Sfx name="swipe" at={fStory + 6} volume={0.6} />
      <Sfx name="ui_pop" at={fOcho} volume={0.7} />
      <Sfx name="whoosh_soft" at={fAntes - 6} />
      <Keystrokes text={query} times={qKeys} volume={0.85} seed="k12" />
      <Sfx name="key_space" at={enterAt} volume={0.9} />
      <Sfx name="swipe" at={fichaAt + 2} volume={0.8} />
      <Sfx name="zoom_in" at={fVer + 4} volume={0.5} />
      <Sfx name="ui_pop" at={fPod - 1} volume={0.8} />
      <Sfx name="success" at={fOtra + 1} volume={0.8} />
    </PdrStage>
  );
};

