import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { ChangeTicks, Sfx } from '../../components/Sfx';
import { BookIcon, CheckIcon, CrossIcon, HeadphonesIcon } from '../../components/Icons';
import { CalendarIcon, ClockIcon, InfinityIcon, UserIcon } from '../../components/Icons2';
import { wf } from './timeline';
import type { SceneProps } from './registry';
import { MaskTitle, Odometer, odometerProgress, odometerShown, Sheen, SP, SP_DEEP, SP_INK, SpoStage, SpotifyIcon } from './kit';

type P = SceneProps;
const ST = '#FF501C'; // Storytel (naranja de su marca)
const AU = '#F39A1C'; // Audible (naranja de su marca)

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

// U13 · Opiniones (15/10/2026): App Store de España, 4,7 (3,4 M valoraciones); Google Play, 4,2 (36,5 M reseñas). Es la nota de
// toda la app (música incluida). De los audiolibros aún hay pocas reseñas: llegaron a España el 7 de octubre.
export const U13Opiniones: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('U13', w, n);
  const fCuatro = at('cuatro');
  const fApp = at('app');
  const fCuatro2 = at('cuatro', 1);
  const fGoogle = at('google');
  const fAunque = at('aunque');
  const fToda = at('toda');
  const fAud = at('audiolibros');
  const fPocas = at('pocas');
  const fLlegaron = at('llegaron');
  const fSiete = at('siete', 1); // el primero es el de «cuatro coma siete»
  const sA = spring({ frame: frame - fCuatro + 10, fps, config: { damping: 15, stiffness: 150 } });
  const sG = spring({ frame: frame - fCuatro2 + 10, fps, config: { damping: 15, stiffness: 150 } });
  const atA = fCuatro - 4;
  const atG = fCuatro2 - 4;
  const vA = 4.7 * Math.min(1, odometerProgress(frame, atA, fps, 34));
  const vG = 4.2 * Math.min(1, odometerProgress(frame, atG, fps, 34));
  const actA = interpolate(frame, [fCuatro - 6, fCuatro + 4, fCuatro2 - 8, fCuatro2], [0, 1, 1, 0], clamp);
  const actG = interpolate(frame, [fCuatro2 - 6, fCuatro2 + 4, fAunque - 8, fAunque], [0, 1, 1, 0], clamp);
  const sToda = spring({ frame: frame - (fAunque - 2), fps, config: { damping: 13, stiffness: 190 } });
  const up = interpolate(frame, [fAud - 10, fAud + 8], [0, 1], { ...clamp, easing: easeInOut });
  const sFew = spring({ frame: frame - (fPocas - 4), fps, config: { damping: 13, stiffness: 180 } });
  const sCal = spring({ frame: frame - (fLlegaron - 4), fps, config: { damping: 12, stiffness: 190 } });
  const card = (title: string, v: number, val: string, oAt: number, sub: string, s: number, act: number) => {
    const on = frame >= oAt - 1;
    return (
      <div style={{ position: 'relative', width: 620, padding: '40px 50px', borderRadius: 48, background: '#fff', border: `1px solid ${color.line}`,
        boxShadow: `0 0 0 ${(5 * act).toFixed(2)}px ${SP}, 0 ${(40 + 24 * act).toFixed(1)}px 100px rgba(16,16,16,${(0.11 + 0.05 * act).toFixed(3)})`,
        opacity: Math.min(1, s * 1.3), transform: `translateY(${((1 - s) * 80 - 14 * act).toFixed(2)}px) scale(${((0.92 + 0.08 * s) * (1 + 0.03 * act)).toFixed(4)})` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink2 }}><SpotifyIcon size={52} />{title}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 10, fontFamily: font.sans, fontWeight: 700, color: color.ink }}>
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <Odometer text={val} at={oAt} size={160} dur={34} style={{ letterSpacing: -7 }} />
            {!on && <span style={{ position: 'absolute', left: 0, right: 8, top: '16%', bottom: '8%', borderRadius: 28, background: 'linear-gradient(100deg, #EDEDED 35%, #F9F9F9 50%, #EDEDED 65%)',
              backgroundSize: '300% 100%', backgroundPosition: `${100 - ((frame * 2.4) % 100)}% 0` }} />}
          </span>
          <span style={{ fontSize: 44, color: color.muted }}>/ 5</span>
        </div>
        <div style={{ marginTop: 18 }}><Stars v={v} size={56} c={SP_DEEP} /></div>
        <div style={{ marginTop: 20, fontFamily: font.sans, fontWeight: 500, fontSize: 31, color: color.ink2, minHeight: 40 }}>{sub}</div>
      </div>
    );
  };
  return (
    <SpoStage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', top: 76, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, opacity: 1 - up, transform: `translateY(${(-40 * up).toFixed(2)}px)` }}>
          <MaskTitle text="¿Qué opinan los usuarios?" hi="opinan" at={2} size={80} align="center" />
        </div>
        <div style={{ position: 'absolute', top: 250, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 48,
          transform: `translateY(${(-160 * up).toFixed(2)}px) scale(${(1 - 0.24 * up).toFixed(4)}) translateX(${((1 - Math.min(1, sG)) * 334).toFixed(2)}px)`, transformOrigin: '50% 0%' }}>
          {card('App Store', vA, '4,7', atA, frame >= fApp ? '3,4 millones de valoraciones' : '', sA, actA)}
          {card('Google Play', vG, '4,2', atG, frame >= fGoogle ? '36,5 millones de reseñas' : '', sG, actG)}
        </div>
        {/* «La nota de toda la app»: la nota es de Spotify entero, no solo de los audiolibros. */}
        <div style={{ position: 'absolute', top: 760, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: 1 - up }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 32px 14px 18px', borderRadius: 999, background: SP_INK, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 36,
            opacity: sToda, transform: `translateY(${((1 - sToda) * 24).toFixed(2)}px) scale(${(0.86 + 0.14 * sToda).toFixed(4)})` }}>
            <SpotifyIcon size={46} /><span>Ojo: es la nota de toda la app<span style={{ opacity: interpolate(frame, [fToda - 2, fToda + 10], [0.25, 1], clamp) }}>, música incluida</span></span>
          </div>
        </div>
        <div style={{ position: 'absolute', top: 540, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, opacity: up }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink2 }}><HeadphonesIcon size={44} c={color.ink2} /> ¿Y de los audiolibros?</div>
          <div style={{ opacity: sFew, transform: `translateY(${((1 - sFew) * 30).toFixed(2)}px) scale(${(0.9 + 0.1 * sFew).toFixed(4)})` }}>
            <MaskTitle text="Aún hay pocas reseñas" hi="pocas" at={Math.max(0, fPocas - 6)} size={92} align="center" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 32px 14px 18px', borderRadius: 999, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.float,
            fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: color.ink, opacity: sCal, transform: `translateY(${((1 - sCal) * 24).toFixed(2)}px) scale(${(0.86 + 0.14 * sCal).toFixed(4)})` }}>
            <CalendarIcon size={42} c={SP_DEEP} /><span>Llegaron a España<span style={{ opacity: interpolate(frame, [fSiete - 4, fSiete + 8], [0.25, 1], clamp) }}> el 7 de octubre</span></span>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx name="ui_pop" at={fCuatro - 8} />
      <ChangeTicks value={(f) => odometerShown('4,7', atA, fps, f, 34)} from={atA} to={atA + 44} volume={0.6} />
      <Sfx name="ui_pop" at={fCuatro2 - 8} />
      <ChangeTicks value={(f) => odometerShown('4,2', atG, fps, f, 34)} from={atG} to={atG + 44} volume={0.6} />
      <Sfx name="hit_soft" at={fAunque} volume={0.6} />
      <Sfx name="whoosh_soft" at={fAud - 8} volume={0.5} />
      <Sfx name="hit_soft" at={fPocas} volume={0.6} />
      <Sfx name="ui_pop" at={fLlegaron - 2} volume={0.6} />
    </SpoStage>
  );
};

// U14 · Lo bueno y lo malo: dos columnas con cuatro huecos que se llenan al ritmo de la voz.
export const U14ProsCons: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('U14', w, n);
  const pros = [
    { f: at('vienen'), t: 'Incluidos en Premium' },
    { f: at('catalogo'), t: 'Catálogo enorme, con superventas en español' },
    { f: at('todo'), t: 'Todo en una app, también en el ordenador' },
    { f: at('extras'), t: 'Extras como Encuentra la página' },
  ];
  const cons = [
    { f: at('solo'), t: 'Solo 12 horas, que no se acumulan' },
    { f: at('duo'), t: 'En Duo y Familiar, solo para quien paga' },
    { f: at('todo', 1), t: 'No todo está incluido' },
    { f: at('ampliar'), t: 'Ampliar sale caro' },
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
    <SpoStage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 44, transform: 'scale(1.06)' }}>
          {col('Lo bueno', true, pros, 0)}
          {col('Lo malo', false, cons, 1)}
        </div>
      </AbsoluteFill>
      <Sfx name="hit_soft" at={fBueno - 1} volume={0.7} />
      {pros.map((p, i) => <Sfx key={`p${i}`} name="tick_soft" at={p.f - 2} />)}
      <Sfx name="whoosh_soft" at={fMalo} volume={0.5} />
      <Sfx name="hit_soft" at={fMalo - 1} volume={0.7} />
      {cons.map((p, i) => <Sfx key={`c${i}`} name="tick_soft" at={p.f - 2} volume={0.9} />)}
    </SpoStage>
  );
};

// U15 · Veredicto (precios de spotify.com/es, storytel.com/es y audible.es, 12–15/10/2026): con Premium Individual, sí (≈ un libro
// al mes); si escuchas mucho, no compensa: Premium (11,99 €) + Audiolibros+ (8,99 €) = 20,98 € al mes por 27 horas, frente a
// Storytel (8,99 €) o Audible (9,99 €), sin contar horas. Sin Premium, no merece la pena contratarlo solo por los audiolibros.
export const U15Veredicto: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('U15', w, n);
  const fSi = at('si');
  const fSi2 = at('si', 1);
  const fRegalo = at('regalo');
  const fLibro = at('libro');
  const fMucho = at('mucho');
  const fCompensa = at('compensa');
  const fPlus = at('audiolibros');
  const fVeintiuno = at('veintiuno');
  const fVeintisiete = at('veintisiete');
  const fStory = at('storytel');
  const fOcho = at('ocho');
  const fAudible = at('audible');
  const fNueve = at('nueve');
  const fCuentan = at('cuentan');
  const fTienes = at('tienes');
  const fContrates = at('contrates');
  const s1 = spring({ frame: frame - fSi + 8, fps, config: { damping: 15, stiffness: 140 } });
  const s2 = spring({ frame: frame - fMucho + 8, fps, config: { damping: 15, stiffness: 140 } });
  const actL = interpolate(frame, [fSi - 6, fSi + 4, fMucho - 8, fMucho], [0, 1, 1, 0], clamp);
  const actR = interpolate(frame, [fMucho - 8, fMucho + 2, fTienes - 8, fTienes], [0, 1, 1, 0.3], clamp);
  const pairIn = spring({ frame: frame - (fMucho - 12), fps, config: { damping: 18, stiffness: 120 } });
  const sYes = spring({ frame: frame - (fSi2 - 2), fps, config: { damping: 11, stiffness: 210 } });
  const sGift = spring({ frame: frame - (fRegalo - 2), fps, config: { damping: 14, stiffness: 180 } });
  const sBook = spring({ frame: frame - (fLibro - 2), fps, config: { damping: 14, stiffness: 180 } });
  const sNo = spring({ frame: frame - (fCompensa - 2), fps, config: { damping: 11, stiffness: 210 } });
  const row = (f: number) => spring({ frame: frame - f, fps, config: { damping: 14, stiffness: 190 } });
  const sSpo = row(fPlus - 4);
  const sSt = row(fStory - 4);
  const sAu = row(fAudible - 4);
  const sCuentan = interpolate(frame, [fCuentan - 4, fCuentan + 10], [0, 1], { ...clamp, easing: easeOut });
  const sNoPrem = spring({ frame: frame - (fTienes - 4), fps, config: { damping: 14, stiffness: 170 } });
  const lift = interpolate(frame, [fTienes - 10, fTienes + 8], [0, 1], { ...clamp, easing: easeInOut });
  const card: React.CSSProperties = { position: 'relative', width: 760, height: 500, borderRadius: 48, background: '#fff', border: `1px solid ${color.line}`, padding: '40px 46px', boxSizing: 'border-box' };
  const shimmer = (f: number) => frame < f - 7 && (
    <span style={{ position: 'absolute', left: 0, right: 6, top: '16%', bottom: '8%', borderRadius: 14, background: 'linear-gradient(100deg, #EDEDED 35%, #F9F9F9 50%, #EDEDED 65%)',
      backgroundSize: '300% 100%', backgroundPosition: `${100 - ((frame * 2.4) % 100)}% 0` }} />
  );
  const cmp = (s: number, name: string, tint: string, price: React.ReactNode, hours: React.ReactNode, bold = false) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 84, padding: '0 20px', borderRadius: 22, background: bold ? '#FDECEC' : '#F6F6F7', opacity: s, transform: `translateX(${((1 - s) * 30).toFixed(2)}px)` }}>
      <span style={{ width: 16, height: 16, borderRadius: '50%', background: tint, flexShrink: 0 }} />
      <span style={{ flex: 1, minWidth: 0, fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.ink, whiteSpace: 'nowrap' }}>{name}</span>
      <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: color.ink, minWidth: 124, textAlign: 'right', flexShrink: 0 }}>{price}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minWidth: 150, justifyContent: 'flex-end', fontFamily: font.sans, fontWeight: 700, fontSize: 26, color: color.ink2, flexShrink: 0 }}>{hours}</span>
    </div>
  );
  return (
    <SpoStage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `translateY(${(-70 * lift).toFixed(2)}px)` }}>
        <MaskTitle text="¿Merecen la pena?" hi="pena?" at={2} size={100} align="center" />
        <div style={{ display: 'flex', gap: 36, marginTop: 44, perspective: 2200, transform: `translateX(${((1 - pairIn) * 443).toFixed(2)}px)` }}>
          {/* Si ya pagas Premium Individual: sí */}
          <div style={{ ...card, boxShadow: `0 0 0 ${(5 * actL).toFixed(2)}px ${SP}, 0 ${(40 + 24 * actL).toFixed(1)}px 100px rgba(16,16,16,${(0.11 + 0.05 * actL).toFixed(3)})`,
            opacity: Math.min(1, s1 * 1.3) * (1 - 0.3 * Math.min(1, actR * 2)), transform: `translateY(${((1 - s1) * 90 - 14 * actL).toFixed(2)}px) rotateY(${((1 - s1) * -26).toFixed(2)}deg)` }}>
            <Sheen at={fSi} radius={48} tint="rgba(30,215,96,0.18)" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink, letterSpacing: -1 }}>
              <SpotifyIcon size={60} /> Si ya pagas Premium Individual
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 34 }}>
              <span style={{ width: 120, height: 120, borderRadius: '50%', background: SP, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 64, color: SP_INK,
                transform: `scale(${sYes.toFixed(4)}) rotate(${((1 - sYes) * -30).toFixed(2)}deg)` }}>Sí</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 46, color: color.ink, letterSpacing: -1.2, opacity: sGift }}>Son un regalo</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: color.ink2, opacity: sBook }}>
                  <BookIcon size={38} c={SP_DEEP} /> Da para un libro al mes, más o menos
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 40, fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.ink2, opacity: sBook }}>
              <ClockIcon size={36} c={color.ink2} /> 12 horas al mes, sin pagar más
            </div>
          </div>
          {/* Si escuchas mucho: no compensa */}
          <div style={{ ...card, width: 850, boxShadow: `0 0 0 ${(5 * actR).toFixed(2)}px ${color.red}, 0 ${(40 + 24 * actR).toFixed(1)}px 100px rgba(16,16,16,${(0.11 + 0.05 * actR).toFixed(3)})`,
            opacity: Math.min(1, s2 * 1.3), transform: `translateY(${((1 - s2) * 90 - 14 * actR).toFixed(2)}px) rotateY(${((1 - s2) * 26).toFixed(2)}deg)` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink, letterSpacing: -1 }}>
              <HeadphonesIcon size={56} /> Si escuchas mucho
              <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 18px 8px 10px', borderRadius: 999, background: '#FDECEC', color: color.red, fontSize: 30,
                opacity: sNo, transform: `scale(${(0.6 + 0.4 * sNo).toFixed(4)})` }}><CrossIcon size={34} /> No compensa</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 34 }}>
              {cmp(sSpo, 'Premium + Audiolibros+', SP, <span style={{ position: 'relative', display: 'inline-block' }}>20,98 €{shimmer(fVeintiuno)}</span>,
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, opacity: interpolate(frame, [fVeintisiete - 4, fVeintisiete + 6], [0, 1], clamp) }}><ClockIcon size={30} c={color.ink2} /> 27 h</span>, true)}
              {cmp(sSt, 'Storytel', ST, <span style={{ position: 'relative', display: 'inline-block' }}><Odometer text="8,99" at={fOcho - 6} size={34} /> €{shimmer(fOcho)}</span>,
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, opacity: sCuentan }}><InfinityIcon size={34} c={SP_DEEP} /> Sin límite</span>)}
              {cmp(sAu, 'Audible', AU, <span style={{ position: 'relative', display: 'inline-block' }}><Odometer text="9,99" at={fNueve - 6} size={34} /> €{shimmer(fNueve)}</span>,
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, opacity: sCuentan }}><InfinityIcon size={34} c={SP_DEEP} /> Sin límite</span>)}
            </div>
            <div style={{ marginTop: 18, fontFamily: font.sans, fontWeight: 500, fontSize: 26, color: color.muted, opacity: sSpo }}>Al mes · 11,99 € (con la música) + 8,99 € = 20,98 €</div>
          </div>
        </div>
      </AbsoluteFill>
      {/* «Si no tienes Premium, no lo contrates solo por esto» */}
      {frame >= fTienes - 6 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 880, display: 'flex', justifyContent: 'center', opacity: sNoPrem, transform: `translateY(${((1 - sNoPrem) * 40).toFixed(2)}px)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 36px 16px 18px', borderRadius: 999, background: SP_INK, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 38, boxShadow: shadow.float }}>
            <UserIcon size={44} c="#fff" /><span>¿Sin Premium?<span style={{ color: SP, opacity: interpolate(frame, [fContrates - 6, fContrates + 8], [0.25, 1], clamp) }}> No lo contrates solo por esto</span></span>
          </div>
        </div>
      )}
      <Sfx name="card_flip" at={fSi - 4} volume={0.8} />
      <Sfx name="stamp" at={fSi2} volume={0.6} />
      <Sfx name="sparkle" at={fRegalo} volume={0.5} />
      <Sfx name="ui_pop" at={fLibro - 2} volume={0.5} />
      <Sfx name="card_flip" at={fMucho - 2} volume={0.8} />
      <Sfx name="cross" at={fCompensa} volume={0.6} />
      <Sfx name="ui_pop" at={fPlus - 4} volume={0.5} />
      <Sfx name="hit_soft" at={fVeintiuno} volume={0.5} />
      <Sfx name="ui_pop" at={fStory - 4} volume={0.5} />
      <ChangeTicks value={(f) => odometerShown('8,99', fOcho - 6, fps, f)} from={fOcho - 6} to={fOcho + 34} volume={0.45} />
      <Sfx name="ui_pop" at={fAudible - 4} volume={0.5} />
      <ChangeTicks value={(f) => odometerShown('9,99', fNueve - 6, fps, f)} from={fNueve - 6} to={fNueve + 34} volume={0.45} />
      <Sfx name="success" at={fCuentan} volume={0.45} />
      <Sfx name="whoosh_soft" at={fTienes - 8} volume={0.5} />
      <Sfx name="hit_soft" at={fContrates} volume={0.5} />
    </SpoStage>
  );
};
