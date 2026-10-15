import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { ChangeTicks, Sfx } from '../../components/Sfx';
import { BookIcon, CheckIcon, CrossIcon, MicIcon } from '../../components/Icons';
import { DownloadIcon, UserIcon } from '../../components/Icons2';
import { wf } from './timeline';
import type { SceneProps } from './registry';
import { CookieIcon, Diamond, IV, IV_DEEP, IV_SOFT, IvxStage, MaskTitle, Odometer, odometerProgress, odometerShown, PLUS, PLUS_DEEP, PLUS_SOFT, RadioIcon, Sheen } from './kit';

type P = SceneProps;

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

// W10 · Opiniones: Google Play 4,4 (348 mil reseñas y más de 10 millones de descargas) y App Store España 4,5 (unas 21 mil
// valoraciones). Las cifras secundarias entran en su tarjeta cuando la voz las dice.
export const W10Opiniones: React.FC<P> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('W10', w, n);
  const fGoogle = at('google');
  const fCuatro = at('cuatro');
  const fTresc = at('trescientas');
  const fDiez = at('diez');
  const fApp = at('app');
  const fCuatro2 = at('cuatro', 2);
  const fVeinti = at('veintiun');
  const sG = spring({ frame: frame - fGoogle + 4, fps, config: { damping: 15, stiffness: 150 } });
  const sA = spring({ frame: frame - fApp + 4, fps, config: { damping: 15, stiffness: 150 } });
  const atG = fCuatro - 6;
  const atA = fCuatro2 - 6;
  const vG = 4.4 * Math.min(1, odometerProgress(frame, atG, fps, 34));
  const vA = 4.5 * Math.min(1, odometerProgress(frame, atA, fps, 34));
  const actG = interpolate(frame, [fGoogle, fGoogle + 8, fApp - 6, fApp], [0, 1, 1, 0], clamp);
  const actA = interpolate(frame, [fApp, fApp + 8, fVeinti + 40, fVeinti + 60], [0, 1, 1, 0.3], clamp);
  const line = (f: number, icon: React.ReactNode, text: React.ReactNode) => {
    const s = spring({ frame: frame - f, fps, config: { damping: 14, stiffness: 190 } });
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: color.ink, opacity: frame >= f - 1 ? s : 0, transform: `translateX(${((1 - s) * -20).toFixed(2)}px)` }}>
        <span style={{ width: 52, height: 52, borderRadius: '50%', background: IV_SOFT, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</span>
        {text}
      </div>
    );
  };
  const card = (title: string, v: number, val: string, oAt: number, s: number, act: number, rows: React.ReactNode) => {
    const on = frame >= oAt - 1;
    return (
      <div style={{ position: 'relative', width: 680, minHeight: 560, padding: '42px 52px', borderRadius: 48, background: '#fff', border: `1px solid ${color.line}`, boxSizing: 'border-box',
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
        <div style={{ marginTop: 18 }}><Stars v={v} size={56} c={IV} /></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 30 }}>{rows}</div>
      </div>
    );
  };
  return (
    <IvxStage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', top: 96, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <MaskTitle text="¿Qué opinan los usuarios?" hi="opinan" at={2} size={84} align="center" />
        </div>
        <div style={{ position: 'absolute', top: 280, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 56, transform: `translateX(${((1 - Math.min(1, sA)) * 368).toFixed(2)}px)` }}>
          {card('Google Play', vG, '4,4', atG, sG, actG, (
            <>
              {line(fTresc - 4, <UserIcon size={30} c={IV_DEEP} />, '348 mil reseñas')}
              {line(fDiez - 4, <DownloadIcon size={30} c={IV_DEEP} />, 'Más de 10 millones de descargas')}
            </>
          ))}
          {card('App Store (España)', vA, '4,5', atA, sA, actA, line(fVeinti - 4, <UserIcon size={30} c={IV_DEEP} />, 'Unas 21 mil valoraciones'))}
        </div>
        <div style={{ position: 'absolute', bottom: 60, left: 0, right: 0, textAlign: 'center', fontFamily: font.sans, fontWeight: 500, fontSize: 24, color: color.muted, opacity: interpolate(frame, [fGoogle, fGoogle + 20], [0, 1], clamp) }}>
          Datos de Google Play y de la App Store española, 15/10/2026
        </div>
      </AbsoluteFill>
      <Sfx name="ui_pop" at={fGoogle - 2} />
      <ChangeTicks value={(f) => odometerShown('4,4', atG, fps, f, 34)} from={atG} to={atG + 44} volume={0.6} />
      <Sfx name="ui_pop" at={fTresc - 3} volume={0.6} />
      <Sfx name="ui_pop" at={fDiez - 3} volume={0.6} />
      <Sfx name="whoosh_soft" at={fApp - 8} volume={0.4} />
      <Sfx name="ui_pop" at={fApp - 2} />
      <ChangeTicks value={(f) => odometerShown('4,5', atA, fps, f, 34)} from={atA} to={atA + 44} volume={0.6} />
      <Sfx name="ui_pop" at={fVeinti - 3} volume={0.6} />
    </IvxStage>
  );
};

// W11 · Lo bueno y lo malo: dos columnas que se llenan al ritmo de la voz.
export const W11ProsCons: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('W11', w, n);
  const pros = [
    { f: at('casi'), t: 'Casi todo es gratis' },
    { f: at('radio'), t: 'Radio en directo' },
    { f: at('descargas'), t: 'Descargas para escuchar sin conexión' },
    { f: at('premium'), t: 'Premium barato: 3,99 €/mes' },
  ];
  const cons = [
    { f: at('aceptar'), t: 'Gratis, solo si aceptas su publicidad' },
    { f: at('guardan'), t: 'Muchos programas guardan episodios para Plus' },
    { f: at('audiolibros'), t: 'Con los audiolibros, igual' },
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
                  <div style={{ fontFamily: font.sans, fontWeight: act > 0.5 ? 700 : 500, fontSize: 33, color: color.ink, letterSpacing: -0.5 }}>{it.t}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  return (
    <IvxStage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 40, transform: 'scale(1.06)' }}>
          {col('Lo bueno', true, pros, 0)}
          {col('Lo malo', false, cons, 1)}
        </div>
      </AbsoluteFill>
      <Sfx name="hit_soft" at={fBueno - 1} volume={0.7} />
      {pros.map((p, i) => <Sfx key={`p${i}`} name="tick_soft" at={p.f - 2} />)}
      <Sfx name="whoosh_soft" at={fMalo} volume={0.5} />
      <Sfx name="hit_soft" at={fMalo - 1} volume={0.7} />
      {cons.map((p, i) => <Sfx key={`c${i}`} name="tick_soft" at={p.f - 2} volume={0.9} />)}
    </IvxStage>
  );
};

// W12 · Veredicto: para pódcast y radio, sí (gratis aceptando las cookies o 3,99 €/mes sin anuncios); Plus, solo si sigues
// varios de sus exclusivos; para audiolibros, mejor una plataforma de audiolibros.
export const W12Veredicto: React.FC<P> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('W12', w, n);
  const fPara = at('para');
  const fSi = at('si:');
  const fGratis = at('gratis');
  const fTres = at('tres');
  const fSin = at('sin');
  const fPlus = at('plus');
  const fVarios = at('varios');
  const fBuscas = at('buscas');
  const fConviene = at('conviene');
  const fPlat = at('plataforma');
  const CW = 560;
  const sC = (f: number) => spring({ frame: frame - f, fps, config: { damping: 15, stiffness: 140 } });
  const s1 = sC(fPara - 8);
  const s2 = sC(fPlus - 8);
  const s3 = sC(fBuscas - 8);
  const act1 = interpolate(frame, [fPara - 6, fPara + 4, fPlus - 8, fPlus], [0, 1, 1, 0], clamp);
  const act2 = interpolate(frame, [fPlus - 6, fPlus + 4, fBuscas - 8, fBuscas], [0, 1, 1, 0], clamp);
  const act3 = interpolate(frame, [fBuscas - 6, fBuscas + 4, dur, dur + 10], [0, 1, 1, 1], clamp);
  const sYes = spring({ frame: frame - (fSi - 2), fps, config: { damping: 10, stiffness: 210 } });
  const row = (f: number, icon: React.ReactNode, text: React.ReactNode) => {
    const s = spring({ frame: frame - f, fps, config: { damping: 14, stiffness: 190 } });
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.ink, opacity: frame >= f - 1 ? s : 0, transform: `translateX(${((1 - s) * -20).toFixed(2)}px)` }}>
        {icon}{text}
      </div>
    );
  };
  const verdict = (s: number, bg: string, text: string, icon: React.ReactNode) => (
    <div style={{ alignSelf: 'flex-start', marginTop: 24, display: 'inline-flex', alignItems: 'center', gap: 14, padding: '12px 26px 12px 16px', borderRadius: 999, background: bg, color: '#fff',
      fontFamily: font.sans, fontWeight: 700, fontSize: 36, opacity: s, transform: `scale(${(0.6 + 0.4 * s).toFixed(4)}) rotate(${((1 - s) * -6).toFixed(2)}deg)`, transformOrigin: 'left center' }}>
      {icon}{text}
    </div>
  );
  const card = (s: number, act: number, children: React.ReactNode) => (
    <div style={{ position: 'relative', width: CW, height: 560, borderRadius: 48, background: '#fff', border: `1px solid ${color.line}`, padding: '42px 46px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column',
      boxShadow: `0 0 0 ${(5 * act).toFixed(2)}px ${color.yellow}, 0 ${(40 + 24 * act).toFixed(1)}px 100px rgba(16,16,16,${(0.11 + 0.05 * act).toFixed(3)})`,
      opacity: Math.min(1, s * 1.3), transform: `translateY(${((1 - s) * 90 - 14 * act).toFixed(2)}px)` }}>{children}</div>
  );
  const head = (icon: React.ReactNode, title: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: font.sans, fontWeight: 700, fontSize: 46, letterSpacing: -1.2, color: color.ink }}>
      <span style={{ width: 80, height: 80, borderRadius: 24, background: IV_SOFT, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</span>{title}
    </div>
  );
  const sPlusV = spring({ frame: frame - (fVarios - 2), fps, config: { damping: 12, stiffness: 200 } });
  const sAudV = spring({ frame: frame - (fConviene - 2), fps, config: { damping: 12, stiffness: 200 } });
  const strikeIn = interpolate(frame, [fPlat - 4, fPlat + 10], [0, 1], { ...clamp, easing: easeOut });
  return (
    <IvxStage>
      <AbsoluteFill style={{ alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: 92 }}>
          <MaskTitle text="¿Merece la pena?" hi="pena" at={2} size={100} align="center" />
        </div>
        <div style={{ position: 'absolute', top: 290, display: 'flex', gap: 40 }}>
          {card(s1, act1, (
            <>
              <Sheen at={fPara + 2} radius={48} tint="rgba(31,157,85,0.16)" />
              {head(<span style={{ display: 'inline-flex', gap: 2 }}><MicIcon size={40} c={IV_DEEP} /><RadioIcon size={36} c={IV_DEEP} /></span>, 'Pódcast y radio')}
              {verdict(sYes, color.green, 'Sí', <CheckIcon size={42} c="#fff" fg={color.green} />)}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 'auto' }}>
                {row(fGratis - 4, <CookieIcon size={44} />, 'Gratis, si aceptas sus cookies')}
                {row(fTres - 4, <span style={{ width: 44, height: 44, borderRadius: '50%', background: IV, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>€</span>,
                  <span>o 3,99 €/mes <span style={{ color: IV_DEEP }}>sin anuncios</span></span>)}
              </div>
            </>
          ))}
          {card(s2, act2, (
            <>
              <Sheen at={fPlus + 2} radius={48} tint="rgba(40,143,254,0.16)" />
              {head(<Diamond size={46} />, 'Plus')}
              <div style={{ alignSelf: 'flex-start', marginTop: 24, display: 'inline-flex', alignItems: 'center', gap: 12, padding: '12px 26px', borderRadius: 999, background: PLUS_SOFT, color: PLUS_DEEP,
                fontFamily: font.sans, fontWeight: 700, fontSize: 34, opacity: sPlusV, transform: `scale(${(0.6 + 0.4 * sPlusV).toFixed(4)})`, transformOrigin: 'left center' }}>Solo a veces</div>
              <div style={{ marginTop: 'auto', fontFamily: font.sans, fontWeight: 700, fontSize: 34, lineHeight: 1.25, color: color.ink, opacity: sPlusV }}>
                Si sigues <span style={{ color: PLUS }}>varios</span> de sus programas exclusivos
              </div>
            </>
          ))}
          {card(s3, act3, (
            <>
              <Sheen at={fBuscas + 2} radius={48} tint="rgba(244,95,49,0.16)" />
              {head(<BookIcon size={44} c={IV_DEEP} />, 'Audiolibros')}
              {verdict(sAudV, color.ink, 'Mejor otra opción', <CrossIcon size={42} c="#fff" fg={color.ink} />)}
              <div style={{ marginTop: 'auto', fontFamily: font.sans, fontWeight: 700, fontSize: 34, lineHeight: 1.25, color: color.ink, opacity: strikeIn }}>
                Una plataforma <span style={{ color: IV_DEEP }}>de audiolibros</span>
              </div>
            </>
          ))}
        </div>
      </AbsoluteFill>
      <Sfx name="card_flip" at={fPara - 4} volume={0.8} />
      <Sfx name="stamp" at={fSi + 2} volume={0.5} />
      <Sfx name="ui_pop" at={fGratis - 3} volume={0.55} />
      <Sfx name="coins" at={fTres + 4} volume={0.3} />
      <Sfx name="tick_soft" at={fSin} volume={0.5} />
      <Sfx name="card_flip" at={fPlus - 4} volume={0.8} />
      <Sfx name="ui_pop" at={fVarios - 2} volume={0.6} />
      <Sfx name="card_flip" at={fBuscas - 4} volume={0.8} />
      <Sfx name="ui_pop" at={fConviene - 2} volume={0.6} />
      <Sfx name="snap_in" at={fPlat} volume={0.6} />
    </IvxStage>
  );
};

export { easeInOut, PLUS_DEEP };
