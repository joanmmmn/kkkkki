import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phase } from '../../components/Phase';
import { Logo } from '../../components/Logo';
import { Words, Typewriter } from '../../components/Kinetic';
import { Pill } from '../../components/Pill';
import { Sfx } from '../../components/Sfx';
import { wordFrame } from '../../lib/vo';
import { EVD_BLOG_URL } from '../../lib/config';
import { clamp } from '../../lib/anim';
import { Strike } from './ui';

// Rúbrica de SonorBooks (dossier §13): media de las cinco notas = 6,2.
const SCORES: [string, number][] = [['Catálogo en español', 8], ['App', 8], ['Opiniones', 6], ['Precio', 5], ['Transparencia', 4]];
const FINAL = SCORES.reduce((a, [, v]) => a + v, 0) / SCORES.length;

// R12 · ¿La trampa? Que ya no es ilimitado → nota 6,2 → búscalo en SonorBooks → cierre.
export const R12Verdict: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0, fb = 0) => lead + wordFrame('R12', w, n, fb);
  const fQue = at('Que', 0, 1.04);
  const fIlim = at('ilimitado', 0, 1.72);
  const fAunque = at('aunque', 0, 2.6);
  const fNota = at('Nuestra', 0, 5.12) - 4;
  const fNum = at('6,2', 0, 6.32);
  const fSb = at('Y', 0, 8.28) - 6;
  const fBusca = at('buscalo', 0, 11.64);
  const fTu = at('Tu', 0, 13.52) - 6;
  const ring = interpolate(frame, [fNota + 4, fNum + 22], [0, FINAL / 10], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3) });
  const R = 170;
  const C = 2 * Math.PI * R;
  const ilim = spring({ frame: frame - fQue + 2, fps, config: { damping: 16, stiffness: 170 } });
  return (
    <Stage tone="warm">
      <Phase from={0} to={fNota + 4}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 34, fontFamily: font.sans }}>
          <Words text="¿La trampa?" start={0} size={140} weight={700} />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 28, fontSize: 96, fontWeight: 700, opacity: ilim, transform: `translateY(${(1 - ilim) * 40}px)` }}>
            Ya no es
            <span style={{ position: 'relative', color: frame > fIlim + 14 ? color.muted : color.ink }}>«ilimitado»<Strike at={fIlim + 12} thick={14} rotate={-4} /></span>
          </div>
          <div style={{ fontSize: 46, fontWeight: 500, color: color.ink2, opacity: spring({ frame: frame - fAunque, fps }) }}>aunque mucha gente lo siga creyendo</div>
        </AbsoluteFill>
      </Phase>

      <Phase from={fNota} to={fSb + 6}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 120 }}>
          <div style={{ position: 'relative', width: 440, height: 440, transform: `scale(${1 + 0.06 * Math.exp(-Math.max(0, frame - fNum - 22) / 7) * (frame >= fNum + 22 ? 1 : 0)})` }}>
            {frame >= fNum + 22 && (
              <div style={{ position: 'absolute', inset: 4, borderRadius: '50%', border: `10px solid ${color.yellow}`, transform: `scale(${1 + interpolate(frame, [fNum + 22, fNum + 50], [0, 0.45], { extrapolateRight: 'clamp' })})`, opacity: interpolate(frame, [fNum + 22, fNum + 50], [0.7, 0], { extrapolateRight: 'clamp' }) }} />
            )}
            <svg width={440} height={440} style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={220} cy={220} r={R} stroke="#F0F0F0" strokeWidth={32} fill="none" />
              <circle cx={220} cy={220} r={R} stroke={color.yellow} strokeWidth={32} fill="none" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - ring)} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans }}>
              <div style={{ fontSize: 160, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>{(ring * 10).toFixed(1).replace('.', ',')}</div>
              <div style={{ fontSize: 36, color: color.muted, fontWeight: 500 }}>sobre 10</div>
            </div>
          </div>
          <div style={{ width: 780, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ fontFamily: font.sans, fontSize: 32, letterSpacing: 6, color: color.muted, fontWeight: 500 }}>NOTA SONORBOOKS</div>
            {SCORES.map(([k, v], i) => {
              const p = interpolate(frame, [fNota + 6 + i * 5, fNota + 34 + i * 5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3) });
              return (
                <div key={k}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: font.sans, fontSize: 38, fontWeight: 500, marginBottom: 8 }}><span>{k}</span><b>{Math.round(v * p)}</b></div>
                  <div style={{ height: 16, borderRadius: 8, background: '#F0F0F0' }}><div style={{ height: 16, borderRadius: 8, width: `${v * 10 * p}%`, background: v >= 8 ? color.yellow : v <= 4 ? color.red : color.ink }} /></div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </Phase>

      <Phase from={fSb} to={fTu + 2}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 56 }}>
          <Logo size={120} delay={0} />
          <div style={{ width: 1160, height: 104, borderRadius: 999, background: '#fff', boxShadow: shadow.float, border: `1px solid ${color.line}`, display: 'flex', alignItems: 'center', padding: '0 18px 0 46px', gap: 24 }}>
            <svg width="38" height="38" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" stroke={color.ink} strokeWidth="2.4" fill="none" /><path d="M15.5 15.5 L21 21" stroke={color.ink} strokeWidth="2.4" strokeLinecap="round" /></svg>
            <div style={{ flex: 1, fontFamily: font.sans, fontSize: 42, color: color.ink }}>
              {frame < fBusca - 34 ? <span style={{ color: color.muted }}>Busca un audiolibro, autor o narrador</span> : <Typewriter text="Crimen y castigo" start={fBusca - 34 - fSb} cps={15} />}
            </div>
            <div style={{ width: 72, height: 72, borderRadius: 36, background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 - 0.14 * interpolate(frame, [fBusca + 20, fBusca + 24, fBusca + 32], [0, 1, 0], clamp)})`, boxShadow: `0 0 0 ${interpolate(frame, [fBusca + 24, fBusca + 44], [0, 26], clamp)}px rgba(255,202,5,${interpolate(frame, [fBusca + 24, fBusca + 44], [0.5, 0], clamp)})` }}>
              <svg width="32" height="32" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" stroke={color.ink} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>
          <div style={{ fontFamily: font.sans, fontSize: 38, fontWeight: 700, opacity: spring({ frame: frame - fSb - 30, fps }) }}>Dónde te sale más barato cada audiolibro</div>
          <div style={{ fontFamily: font.sans, fontSize: 32, color: color.ink2, opacity: spring({ frame: frame - fBusca, fps }) }}>Reseña completa: <b>{EVD_BLOG_URL}</b></div>
        </AbsoluteFill>
      </Phase>

      <Phase from={fTu} to={dur} out={1}>
        {/* Bloque de marca en el tercio superior: la mitad inferior queda libre para los elementos de pantalla final de YouTube. */}
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 200, flexDirection: 'column', gap: 36, background: '#fff' }}>
          <Logo size={150} animate={false} />
          <Words text="Tu próxima historia te está esperando." start={2} stagger={4} size={62} weight={500} />
          <div style={{ opacity: spring({ frame: frame - fTu - 40, fps }), transform: `scale(${0.85 + 0.15 * spring({ frame: frame - fTu - 40, fps, config: { damping: 12 } })})` }}><Pill size={40}>sonorbooks.com</Pill></div>
          <div style={{ fontFamily: font.sans, fontSize: 32, color: color.ink2, opacity: spring({ frame: frame - fTu - 52, fps }) }}>Busca y compara gratis, sin registro.</div>
        </AbsoluteFill>
      </Phase>

      <Sfx name="hit_soft" at={2} />
      <Sfx name="ui_pop" at={fQue} />
      <Sfx name="pencil_strike" at={fIlim + 12} />
      <Sfx name="swipe" at={fNota} />
      <Sfx name="counter" at={fNota + 6} />
      {SCORES.map(([k], i) => <Sfx key={k} name="tick_soft" at={fNota + 8 + i * 5} volume={0.45} />)}
      <Sfx name="stamp" at={fNum + 22} />
      <Sfx name="whoosh_deep" at={fSb} volume={0.8} />
      <Sfx name="logo_sting" at={fSb + 4} />
      <Sfx name="typing" at={fBusca - 34} trimAfter={60} />
      <Sfx name="click" at={fBusca + 24} />
      <Sfx name="whoosh_soft" at={fTu} />
      <Sfx name="sparkle" at={fTu + 40} />
    </Stage>
  );
};
