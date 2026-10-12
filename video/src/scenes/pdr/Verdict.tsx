import React from 'react';
import { AbsoluteFill, Easing, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Stage } from '../../components/Stage';
import { ChangeTicks, Keystrokes, Sfx } from '../../components/Sfx';
import { typedCount, typeTimes } from '../../lib/typing';
import { CheckIcon, CrossIcon } from '../../components/Icons';
import { CalendarIcon, CarIcon, CastIcon, PhoneIcon, StarIcon, TabletIcon, WatchIcon } from '../../components/Icons2';
import { ScreenClip, CamKey } from '../../components/ScreenClip';
import { TiltWindow } from '../nxr/Verdict';
import { wf } from './timeline';
import type { SceneProps } from './registry';
import { countUpText, Kicker, MaskTitle, PV, Sheen } from './kit';

type P = SceneProps;

const phaseStyle = (frame: number, from: number, to: number) => {
  const pin = interpolate(frame, [from - 4, from + 12], [0, 1], { ...clamp, easing: easeOut });
  const pout = interpolate(frame, [to - 12, to + 2], [0, 1], { ...clamp, easing: easeInOut });
  return {
    visible: frame >= from - 4 && frame <= to + 2,
    style: { opacity: pin * (1 - pout), transform: `translateX(${(1 - pin) * 160 - pout * 200}px)`, filter: (1 - pin) + pout > 0.02 ? `blur(${((1 - pin) * 10 + pout * 10).toFixed(2)}px)` : undefined } as React.CSSProperties,
  };
};

// K09 · Dispositivos: móvil y tablet, coche (CarPlay, Android Auto) y altavoces (AirPlay, Chromecast); Apple Watch, aún no.
export const K09Dispositivos: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('K09', w, n);
  const items = [
    { f: at('movil'), icon: <div style={{ display: 'flex', gap: 4 }}><PhoneIcon size={78} /><TabletIcon size={78} /></div>, title: 'Móvil y tablet', sub: 'iPhone, iPad y Android' },
    { f: at('coche'), icon: <CarIcon size={96} />, title: 'En el coche', sub: 'CarPlay · Android Auto' },
    { f: at('altavoces'), icon: <CastIcon size={96} />, title: 'En tus altavoces', sub: 'AirPlay · Chromecast' },
  ];
  const fNo = at('watch');
  const sNo = spring({ frame: frame - fNo, fps, config: { damping: 11, stiffness: 200 } });
  const shake = frame >= fNo + 4 && frame < fNo + 18 ? Math.sin((frame - fNo - 4) * 1.9) * (14 - (frame - fNo - 4)) * 0.9 : 0;
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <MaskTitle text="¿Dónde funciona?" hi="funciona?" at={2} size={90} align="center" />
        <div style={{ display: 'flex', gap: 40, marginTop: 70, perspective: 2000 }}>
          {items.map((it, i) => {
            const s = spring({ frame: frame - it.f + 4, fps, config: { damping: 15, stiffness: 160 } });
            const next = i < items.length - 1 ? items[i + 1].f : fNo;
            const act = interpolate(frame, [it.f, it.f + 8, next - 6, next], [0, 1, 1, 0], clamp);
            return (
              <div key={it.title} style={{ position: 'relative', width: 420, height: 400 }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: 44, border: '3px dashed #DADADA', opacity: interpolate(frame, [6 + i * 4, 16 + i * 4], [0, 1], clamp) * (1 - s) }} />
                <div style={{ position: 'relative', width: 420, height: 400, borderRadius: 44, background: '#fff', boxShadow: `0 0 0 ${5 * act}px ${color.yellow}, ${shadow.card}`, border: `1px solid ${color.line}`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20,
                  opacity: s, transform: `translateY(${(1 - s) * 80 - 16 * act}px) rotateY(${(1 - s) * (i % 2 ? 30 : -30)}deg) scale(${1 + 0.03 * act})` }}>
                  <Sheen at={it.f + 2} tint="rgba(168,155,237,0.30)" />
                  <div style={{ width: 176, height: 176, borderRadius: '50%', background: act > 0.5 ? color.yellow : color.yellowSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{it.icon}</div>
                  <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 42, color: color.ink, letterSpacing: -0.6 }}>{it.title}</div>
                  <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 30, color: color.ink2 }}>{it.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 60, display: 'flex', alignItems: 'center', gap: 18, padding: '18px 36px', borderRadius: 999, background: '#fff', border: `3px solid ${color.red}`, fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink,
          opacity: sNo, transform: `translateX(${shake}px) scale(${0.8 + 0.2 * sNo})`, boxShadow: shadow.float }}>
          <WatchIcon size={50} /> Apple Watch: de momento, no <CrossIcon size={46} />
        </div>
      </AbsoluteFill>
      {items.map((it) => <Sfx key={it.title} name="snap_in" at={it.f + 5} volume={0.8} />)}
      <Sfx name="cross" at={fNo + 1} />
    </Stage>
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
          <div style={{ position: 'absolute', inset: 0, width: `${fill * 100}%`, overflow: 'hidden' }}>
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
  const vA = Number(countUpText(frame, 4.8, fCuatro - 4, 26, 1).replace(',', '.'));
  const vT = Number(countUpText(frame, 1.9, fUno - 4, 22, 1).replace(',', '.'));
  const actA = interpolate(frame, [fApp, fApp + 8, fTrust - 6, fTrust], [0, 1, 1, 0], clamp);
  const actT = interpolate(frame, [fTrust, fTrust + 8], [0, 1], clamp);
  const sQ = spring({ frame: frame - fQuejas, fps, config: { damping: 14, stiffness: 170 } });
  const sN = spring({ frame: frame - fApunta + 2, fps, config: { damping: 13, stiffness: 160 } });
  const lift = interpolate(frame, [fApunta - 8, fApunta + 8], [0, 1], { ...clamp, easing: easeInOut });
  const card = (title: string, v: number, on: boolean, sub: string, s: number, act: number, c: string, dim: number) => (
    <div style={{ width: 600, padding: '40px 46px', borderRadius: 44, background: '#fff', border: `1px solid ${color.line}`, boxShadow: `0 0 0 ${5 * act}px ${color.yellow}, ${shadow.card}`,
      opacity: s * (1 - 0.4 * dim), transform: `translateY(${(1 - s) * 70 - 14 * act}px) scale(${(0.94 + 0.06 * s) * (1 + 0.03 * act)})` }}>
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink2 }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 10 }}>
        <span style={{ position: 'relative', fontFamily: font.sans, fontWeight: 700, fontSize: 150, letterSpacing: -6, color: on ? color.ink : 'transparent', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
          {on ? v.toFixed(1).replace('.', ',') : '0,0'}
          {/* Esqueleto de carga con brillo mientras llega la nota (ocupa el sitio de las cifras: sin saltos al empezar). */}
          {!on && <span style={{ position: 'absolute', left: 0, right: 8, top: '17%', bottom: '10%', borderRadius: 26, background: 'linear-gradient(100deg, #EDEDED 35%, #F9F9F9 50%, #EDEDED 65%)',
            backgroundSize: '300% 100%', backgroundPosition: `${100 - ((frame * 2.4) % 100)}% 0` }} />}
        </span>
        <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.muted }}>/ 5</span>
      </div>
      <div style={{ marginTop: 18 }}><Stars v={v} size={52} c={c} /></div>
      <div style={{ marginTop: 20, fontFamily: font.sans, fontWeight: 500, fontSize: 30, color: color.ink2, minHeight: 40 }}>{sub}</div>
    </div>
  );
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `translateY(${30 * lift}px)` }}>
        <div style={{ opacity: 1 - lift, transform: `translateY(${-40 * lift}px)` }}>
          <MaskTitle text="¿Qué opinan los usuarios?" hi="opinan" at={2} size={82} align="center" style={{ marginBottom: 56 }} />
        </div>
        <div style={{ display: 'flex', gap: 48 }}>
          {card('App Store (España)', vA, frame >= fCuatro - 4, frame >= fVal - 4 ? 'Unas 32.000 valoraciones' : '', sA, actA, color.yellow, actT)}
          {card('Trustpilot', vT, frame >= fUno - 4, frame >= fQuejas - 2 ? 'Muchas quejas por cobros' : '', sT, actT, color.red, 0)}
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
      <ChangeTicks value={(f) => countUpText(f, 4.8, fCuatro - 4, 26, 1)} from={fCuatro - 4} to={fCuatro + 22} volume={0.7} />
      <Sfx name="ui_pop" at={fTrust - 2} />
      <ChangeTicks value={(f) => countUpText(f, 1.9, fUno - 4, 22, 1)} from={fUno - 4} to={fUno + 18} volume={0.7} />
      <Sfx name="fail" at={fUno + 16} volume={0.5} />
      <Sfx name="hit_soft" at={fQuejas + 1} volume={0.7} />
      <Sfx name="whoosh_soft" at={fApunta - 2} volume={0.6} />
      <Sfx name="success" at={fApunta + 8} volume={0.6} />
    </Stage>
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
    <Stage tone="warm">
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
    </Stage>
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
  const s1 = spring({ frame: frame - fGustan + 4, fps, config: { damping: 16, stiffness: 160 } });
  const s2 = spring({ frame: frame - fMucho + 4, fps, config: { damping: 16, stiffness: 160 } });
  const sSt = spring({ frame: frame - fStory, fps, config: { damping: 14, stiffness: 180 } });
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
  const card = (s: number, icon: React.ReactNode, a: string, b: React.ReactNode) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 28, padding: '30px 44px', borderRadius: 40, background: '#fff', boxShadow: shadow.card, border: `1px solid ${color.line}`, width: 1460, boxSizing: 'border-box',
      opacity: s, transform: `translateY(${(1 - s) * 50}px)` }}>
      <span style={{ display: 'inline-flex', flexShrink: 0 }}>{icon}</span>
      <div style={{ fontFamily: font.sans, fontSize: 40, color: color.ink2, fontWeight: 500, flex: 1 }}>{a}</div>
      <svg width="64" height="32" viewBox="0 0 60 30" style={{ flexShrink: 0 }}><path d="M4 15h46M40 5l10 10-10 10" stroke={color.ink} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <div style={{ fontFamily: font.sans, fontSize: 42, color: color.ink, fontWeight: 700, padding: '12px 28px', borderRadius: 999, background: color.yellow, whiteSpace: 'nowrap', flexShrink: 0 }}>{b}</div>
    </div>
  );
  const sQ = spring({ frame: frame - fPod + 2, fps, config: { damping: 14, stiffness: 170 } });
  const otra = interpolate(frame, [fOtra - 1, fOtra + 11], [0, 1], { ...clamp, easing: easeOut });
  return (
    <Stage tone="warm">
      {A.visible && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', ...A.style }}>
          <MaskTitle text="¿Merece la pena?" hi="pena?" at={2} size={112} align="center" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28, marginTop: 64 }}>
            {card(s1, <CheckIcon size={64} />, 'Si te gustan los pódcasts y escuchas 1 o 2 audiolibros al mes', 'Por 4,99 €, de lo más barato')}
            {card(s2, <StarIcon size={62} />, 'Si escuchas mucho, compara', <span>Storytel: sin límite, <span style={{ opacity: sSt }}>8,99 €</span></span>)}
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
      <Sfx name="ui_pop" at={fGustan - 2} />
      <Sfx name="ui_pop" at={fMucho - 2} />
      <Sfx name="tick_soft" at={fStory + 2} />
      <Sfx name="whoosh_soft" at={fAntes - 6} />
      <Keystrokes text={query} times={qKeys} volume={0.85} seed="k12" />
      <Sfx name="key_space" at={enterAt} volume={0.9} />
      <Sfx name="swipe" at={fichaAt + 2} volume={0.8} />
      <Sfx name="zoom_in" at={fVer + 4} volume={0.5} />
      <Sfx name="ui_pop" at={fPod - 1} volume={0.8} />
      <Sfx name="success" at={fOtra + 1} volume={0.8} />
    </Stage>
  );
};

