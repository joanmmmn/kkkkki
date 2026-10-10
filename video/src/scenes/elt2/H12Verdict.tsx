import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phase } from '../../components/Phase';
import { Logo } from '../../components/Logo';
import { Words, Typewriter } from '../../components/Kinetic';
import { Highlight } from '../../components/Highlight';
import { Pill } from '../../components/Pill';
import { Sfx } from '../../components/Sfx';
import { wordFrame } from '../../lib/vo';
import { BLOG_URL } from '../../lib/config';

const SCORES: [string, number][] = [['Precio', 10], ['Funciones', 9], ['Catálogo de clásicos', 8], ['Calidad de audio', 7], ['Experiencia de uso', 7]];
const FINAL = SCORES.reduce((a, [, v]) => a + v, 0) / SCORES.length;

// V12 · ¿La trampa? No la hay → nota 8,2 → búscalo en SonorBooks → cierre del V7.
export const H12Verdict: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0, fb = 0) => lead + wordFrame('V12', w, n, fb);
  const fNo = at('No', 0, 1.12);
  const fNota = at('Nuestra', 0, 2.24) - 4;
  const fNum = at('8,2', 0, 3.36);
  const fSb = at('Y', 0, 5.32) - 6;
  const fBusca = at('buscalo', 0, 9.2);
  const fTu = at('Tu', 0, 11.16) - 6;
  const ring = interpolate(frame, [fNota + 4, fNum + 22], [0, FINAL / 10], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3) });
  const R = 170;
  const C = 2 * Math.PI * R;
  return (
    <Stage tone="warm">
      <Phase from={0} to={fNota + 4}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 140, letterSpacing: -4, display: 'flex', gap: 36, alignItems: 'baseline' }}>
            <Words text="¿La trampa?" start={0} size={140} weight={700} style={{ display: 'inline' }} />
            {frame >= fNo && <span style={{ display: 'inline-block', transform: `scale(${spring({ frame: frame - fNo, fps, config: { damping: 10, stiffness: 200 } })})` }}><Highlight start={fNo + 4} dur={10}>No la hay.</Highlight></span>}
          </div>
        </AbsoluteFill>
      </Phase>

      <Phase from={fNota} to={fSb + 6}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 120 }}>
          <div style={{ position: 'relative', width: 440, height: 440 }}>
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
                  <div style={{ height: 16, borderRadius: 8, background: '#F0F0F0' }}><div style={{ height: 16, borderRadius: 8, width: `${v * 10 * p}%`, background: v >= 9 ? color.yellow : color.ink }} /></div>
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
              {frame < fBusca - 34 ? <span style={{ color: color.muted }}>Busca un audiolibro, autor o narrador</span> : <Typewriter text="Crimen y castigo" start={fBusca - 34} cps={15} />}
            </div>
            <div style={{ width: 72, height: 72, borderRadius: 36, background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="32" height="32" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" stroke={color.ink} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>
          <div style={{ fontFamily: font.sans, fontSize: 34, color: color.ink2, opacity: spring({ frame: frame - fBusca, fps }) }}>Reseña completa: <b>{BLOG_URL}</b></div>
        </AbsoluteFill>
      </Phase>

      <Phase from={fTu} to={dur} out={1}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 34, background: '#fff' }}>
          <Logo size={130} animate={false} />
          <Words text="Tu próxima historia te está esperando." start={2} stagger={4} size={56} weight={500} />
          <div style={{ opacity: spring({ frame: frame - fTu - 40, fps }), transform: `scale(${0.85 + 0.15 * spring({ frame: frame - fTu - 40, fps, config: { damping: 12 } })})` }}><Pill size={34}>sonorbooks.com</Pill></div>
          <div style={{ fontFamily: font.sans, fontSize: 28, color: color.ink2, opacity: spring({ frame: frame - fTu - 52, fps }) }}>Busca y compara gratis, sin registro.</div>
        </AbsoluteFill>
      </Phase>

      <Sfx name="impact" at={fNo} volume={0.3} />
      <Sfx name="marker" at={fNo + 4} volume={0.3} />
      <Sfx name="whoosh_soft" at={fNota - 6} volume={0.3} />
      <Sfx name="counter" at={fNota + 6} volume={0.18} />
      <Sfx name="impact" at={fNum + 22} volume={0.25} />
      <Sfx name="whoosh_deep" at={fSb - 6} volume={0.3} />
      <Sfx name="shimmer" at={fSb + 2} volume={0.25} />
      <Sfx name="typing" at={fBusca - 34} volume={0.3} trimAfter={60} />
      <Sfx name="whoosh_soft" at={fTu - 4} volume={0.3} />
      <Sfx name="shimmer" at={fTu + 40} volume={0.3} />
    </Stage>
  );
};
