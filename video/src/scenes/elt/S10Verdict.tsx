import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phase } from '../../components/Phase';
import { Logo } from '../../components/Logo';
import { Words, Typewriter } from '../../components/Kinetic';
import { Highlight } from '../../components/Highlight';
import { Pill } from '../../components/Pill';
import { CheckIcon, CrossIcon } from '../../components/Icons';
import { Sfx } from '../../components/Sfx';
import { wordFrame } from '../../lib/vo';
import { BLOG_URL } from '../../lib/config';

const SCORES: [string, number][] = [['Precio', 10], ['Funciones', 9], ['Catálogo de clásicos', 8], ['Calidad de audio', 7], ['Experiencia de uso', 7]];
const FINAL = SCORES.reduce((a, [, v]) => a + v, 0) / SCORES.length; // 8,2

// E10 · Veredicto con nota + llamada a SonorBooks + cierre del V7.
export const S10Verdict: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0, fb = 0) => lead + wordFrame('E10', w, n, fb);
  const fNo = at('No', 0, 1.7);
  const fNov = at('Si', 0, 2.9);
  const fCla = at('Pero', 0, 5.3);
  const fNota = at('Nuestra', 0, 10.4);
  const fNum = at('8,2', 0, 11.8);
  const fSb = at('Y', 0, 13.9);
  const fBusca = at('buscalo', 0, 18.7);
  const fDesc = at('resena', 0, 20.8) - 10;
  const fTu = at('proxima', 0, 23.7) - 6;
  const ring = interpolate(frame, [fNota + 6, fNum + 20], [0, FINAL / 10], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3) });
  const R = 170;
  const C = 2 * Math.PI * R;
  return (
    <Stage tone="warm">
      <Phase from={0} to={fNota}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 50 }}>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 120, letterSpacing: -3, display: 'flex', gap: 34 }}>
            <Words text="¿La trampa?" start={0} size={120} weight={700} style={{ display: 'inline' }} />
            {frame >= fNo && <Highlight start={fNo + 4} dur={10}><span style={{ display: 'inline-block', transform: `scale(${spring({ frame: frame - fNo, fps, config: { damping: 10, stiffness: 200 } })})` }}>No la hay.</span></Highlight>}
          </div>
          <div style={{ display: 'flex', gap: 40 }}>
            {[{ ok: false, t: 'Novedades', f: fNov }, { ok: true, t: 'Clásicos gratis', f: fCla }].map((x) => {
              const s = spring({ frame: frame - x.f, fps, config: { damping: 15, stiffness: 170 } });
              return (
                <div key={x.t} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '24px 44px', borderRadius: 999, background: '#fff', boxShadow: shadow.soft, border: `2px solid ${x.ok ? color.yellow : color.line}`, fontFamily: font.sans, fontSize: 50, fontWeight: 500, opacity: s, transform: `translateY(${(1 - s) * 40}px)` }}>
                  {x.ok ? <CheckIcon size={54} /> : <CrossIcon size={54} />}{x.t}
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </Phase>

      <Phase from={fNota} to={fSb + 6}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 120 }}>
          <div style={{ position: 'relative', width: 420, height: 420 }}>
            <svg width={420} height={420} style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={210} cy={210} r={R} stroke="#F0F0F0" strokeWidth={30} fill="none" />
              <circle cx={210} cy={210} r={R} stroke={color.yellow} strokeWidth={30} fill="none" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - ring)} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans }}>
              <div style={{ fontSize: 150, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>{(ring * 10).toFixed(1).replace('.', ',')}</div>
              <div style={{ fontSize: 34, color: color.muted, fontWeight: 500 }}>sobre 10</div>
            </div>
          </div>
          <div style={{ width: 760, display: 'flex', flexDirection: 'column', gap: 26 }}>
            <div style={{ fontFamily: font.sans, fontSize: 30, letterSpacing: 6, color: color.muted, fontWeight: 500 }}>NOTA SONORBOOKS</div>
            {SCORES.map(([k, v], i) => {
              const p = interpolate(frame, [fNota + 10 + i * 6, fNota + 40 + i * 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3) });
              return (
                <div key={k}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: font.sans, fontSize: 36, fontWeight: 500, marginBottom: 8 }}><span>{k}</span><b>{Math.round(v * p)}</b></div>
                  <div style={{ height: 14, borderRadius: 7, background: '#F0F0F0' }}><div style={{ height: 14, borderRadius: 7, width: `${v * 10 * p}%`, background: v >= 9 ? color.yellow : color.ink }} /></div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </Phase>

      <Phase from={fSb} to={fTu + 2}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 56 }}>
          <Logo size={110} delay={0} />
          <div style={{ width: 1100, height: 100, borderRadius: 999, background: '#fff', boxShadow: shadow.float, border: `1px solid ${color.line}`, display: 'flex', alignItems: 'center', padding: '0 18px 0 44px', gap: 24 }}>
            <svg width="36" height="36" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" stroke={color.ink} strokeWidth="2.4" fill="none" /><path d="M15.5 15.5 L21 21" stroke={color.ink} strokeWidth="2.4" strokeLinecap="round" /></svg>
            <div style={{ flex: 1, fontFamily: font.sans, fontSize: 40, color: color.ink }}>
              {frame < fBusca - 30 ? <span style={{ color: color.muted }}>Busca un audiolibro, autor o narrador</span> : <Typewriter text="Crimen y castigo" start={fBusca - 30} cps={14} />}
            </div>
            <div style={{ width: 70, height: 70, borderRadius: 35, background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="32" height="32" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" stroke={color.ink} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>
          {frame >= fDesc - 4 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: font.sans, fontWeight: 700, fontSize: 40, opacity: spring({ frame: frame - fDesc + 4, fps }) }}>
              Reseña completa: <span style={{ fontWeight: 500 }}>{BLOG_URL}</span>
              <svg width="44" height="44" viewBox="0 0 24 24" style={{ transform: `translateY(${Math.sin((frame - fDesc) / 6) * 6}px)` }}><path d="M12 4v15M6 13l6 6 6-6" stroke={color.ink} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          )}
        </AbsoluteFill>
      </Phase>

      {/* Cierre idéntico al V7 */}
      <Phase from={fTu} to={dur} out={1}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 34, background: '#fff' }}>
          <Logo size={130} animate={false} />
          <Words text="Tu próxima historia te está esperando." start={2} stagger={4} size={56} weight={500} />
          <div style={{ opacity: spring({ frame: frame - fTu - 40, fps }), transform: `scale(${0.85 + 0.15 * spring({ frame: frame - fTu - 40, fps, config: { damping: 12 } })})` }}>
            <Pill size={34}>sonorbooks.com</Pill>
          </div>
          <div style={{ fontFamily: font.sans, fontSize: 28, color: color.ink2, opacity: spring({ frame: frame - fTu - 52, fps }) }}>Busca y compara gratis, sin registro.</div>
        </AbsoluteFill>
      </Phase>

      <Sfx name="impact" at={fNo} volume={0.3} />
      <Sfx name="marker" at={fNo + 4} volume={0.3} />
      <Sfx name="cross" at={fNov} volume={0.25} />
      <Sfx name="tick" at={fCla} volume={0.25} />
      <Sfx name="whoosh_soft" at={fNota - 6} volume={0.3} />
      <Sfx name="counter" at={fNota + 8} volume={0.18} />
      <Sfx name="impact" at={fNum + 20} volume={0.25} />
      <Sfx name="whoosh_deep" at={fSb - 6} volume={0.3} />
      <Sfx name="shimmer" at={fSb + 2} volume={0.25} />
      <Sfx name="typing" at={fBusca - 30} volume={0.3} trimAfter={60} />
      <Sfx name="pop" at={fDesc} volume={0.3} />
      <Sfx name="whoosh_soft" at={fTu - 4} volume={0.3} />
      <Sfx name="shimmer" at={fTu + 40} volume={0.3} />
    </Stage>
  );
};
