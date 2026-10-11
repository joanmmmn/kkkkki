import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Words } from '../../components/Kinetic';
import { Highlight } from '../../components/Highlight';
import { LogoIcon } from '../../components/Logo';
import { CheckIcon } from '../../components/Icons';
import { Sfx } from '../../components/Sfx';
import { IcFile, IcSearch } from '../er/icons';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { w } from './timeline';

const ID = 'X11';
const SCORE = 8;

// X11 · Veredicto: sí, si lees mucho en PDF, ebooks o artículos · superventas en español: compara en SonorBooks · 8/10.
export const X11Verdict: React.FC<{ lead: number; dur: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w(ID, 'W13', word, n);
  const fLees = at('lees') - 4;
  const fSi = at('si,') || at('sí');
  const fBus = at('buscas') - 4;
  const fComp = at('compara');
  const fNota = at('Nuestra') - 4;
  const f8 = at('8');
  const r1 = spring({ frame: frame - fLees, fps, config: { damping: 16, stiffness: 150 } });
  const r2 = spring({ frame: frame - fBus, fps, config: { damping: 16, stiffness: 150 } });
  const yes = spring({ frame: frame - fSi + 2, fps, config: { damping: 10, stiffness: 200 } });
  const comp = spring({ frame: frame - fComp, fps, config: { damping: 14, stiffness: 180 } });
  const out = interpolate(frame, [fNota - 4, fNota + 12], [0, 1], { ...clamp, easing: easeInOut });
  const sc = spring({ frame: frame - fNota - 2, fps, config: { damping: 18, stiffness: 130 } });
  const ring = interpolate(frame, [f8 - 10, f8 + 26], [0, SCORE / 10], { ...clamp, easing: easeOut });
  const num = spring({ frame: frame - f8 + 2, fps, config: { damping: 9, stiffness: 200 } });
  const R = 170, C = 2 * Math.PI * R;
  const row = (s: number, children: React.ReactNode) => (
    <div style={{ width: 1400, display: 'flex', alignItems: 'center', gap: 30, padding: '30px 44px', borderRadius: 34, background: '#fff', border: `1px solid ${color.line}`, boxShadow: shadow.card, opacity: s, transform: `translateY(${(1 - s) * 50}px)` }}>{children}</div>
  );
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 40, opacity: 1 - out, transform: `scale(${1 - 0.08 * out})`, filter: `blur(${out * 8}px)` }}>
        <Words text="¿Merece la pena?" start={0} size={100} weight={700} />
        {row(r1, (
          <>
            <div style={{ width: 84, height: 84, borderRadius: 42, background: color.yellowSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><IcFile size={48} w={1.8} /></div>
            <div style={{ flex: 1, fontFamily: font.sans, fontSize: 44, fontWeight: 500 }}>Si lees mucho en <b>PDF, ebooks o artículos</b></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, transform: `scale(${yes})`, fontFamily: font.sans, fontSize: 52, fontWeight: 700, color: color.green }}><CheckIcon size={56} /> Sí, y mucho</div>
          </>
        ))}
        {row(r2, (
          <>
            <div style={{ width: 84, height: 84, borderRadius: 42, background: color.yellowSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><IcSearch size={46} w={1.8} /></div>
            <div style={{ flex: 1, fontFamily: font.sans, fontSize: 44, fontWeight: 500 }}>Si buscas <b>superventas en español</b></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: comp, transform: `scale(${0.8 + 0.2 * comp})`, padding: '12px 26px', borderRadius: 999, background: color.yellow, fontFamily: font.sans, fontSize: 38, fontWeight: 700 }}><LogoIcon size={40} /> Compara en SonorBooks</div>
          </>
        ))}
      </AbsoluteFill>
      {frame >= fNota - 4 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 30, opacity: sc, transform: `scale(${0.9 + 0.1 * sc})` }}>
          <div style={{ fontFamily: font.sans, fontSize: 44, fontWeight: 500, color: color.ink2 }}>Nuestra nota</div>
          <div style={{ position: 'relative', width: 420, height: 420 }}>
            <svg width={420} height={420} style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
              <circle cx={210} cy={210} r={R} fill="none" stroke="#EDEDED" strokeWidth={26} />
              <circle cx={210} cy={210} r={R} fill="none" stroke={color.yellow} strokeWidth={26} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - ring)} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans }}>
              <span style={{ fontWeight: 700, fontSize: 200, letterSpacing: -6, transform: `scale(${0.6 + 0.4 * num})`, display: 'inline-block' }}>{SCORE}</span>
              <span style={{ fontWeight: 500, fontSize: 64, color: color.muted, marginTop: 70 }}>/10</span>
            </div>
          </div>
          <div style={{ fontFamily: font.sans, fontSize: 40, fontWeight: 700 }}><Highlight start={f8 + 14}>ElevenReader Ultra</Highlight></div>
        </AbsoluteFill>
      )}
      <Sfx name="card_flip" at={fLees} />
      <Sfx name="success" at={fSi} volume={0.8} />
      <Sfx name="card_flip" at={fBus} />
      <Sfx name="ui_pop" at={fComp} />
      <Sfx name="whoosh_deep" at={fNota} volume={0.6} />
      <Sfx name="riser" at={f8 - 50} volume={0.5} />
      <Sfx name="impact" at={f8} />
      <Sfx name="marker" at={f8 + 14} />
    </Stage>
  );
};
