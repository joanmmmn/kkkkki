import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phase } from '../../components/Phase';
import { Highlight } from '../../components/Highlight';
import { LogoIcon } from '../../components/Logo';
import { Sfx } from '../../components/Sfx';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { wf } from './timeline';
import { NextoryLogo } from './common';
import { NX_STEPS } from './steps';

// N01 · Gancho: «¿30 días gratis de Nextory, en lugar de 14? Así se consiguen, paso a paso.»
export const N01Hook: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('N01', w, n);
  const f30 = Math.max(2, at('30') - 2);
  const f14 = at('14');
  const fAsi = at('Asi');
  const fPaso = at('paso');

  const logo = spring({ frame: frame - 1, fps, config: { damping: 15, stiffness: 150 } });
  const c30 = spring({ frame: frame - f30, fps, config: { damping: 13, stiffness: 170 } });
  const room14 = spring({ frame: frame - (f14 - 4), fps, config: { damping: 22, stiffness: 130 } });
  const c14 = spring({ frame: frame - (f14 - 1), fps, config: { damping: 16, stiffness: 170 } });
  const strike = interpolate(frame, [f14 + 6, f14 + 16], [0, 1], { ...clamp, easing: easeOut });
  const dim14 = interpolate(frame, [f14 + 16, f14 + 28], [0, 1], { ...clamp, easing: easeInOut });
  const W14 = 400, W30 = 560, GAP = 54;

  return (
    <Stage tone="warm">
      <Phase from={0} to={fAsi + 4} noIn>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 70 }}>
          <div style={{ opacity: logo, transform: `translateY(${(1 - logo) * -30}px) scale(${0.85 + 0.15 * logo})` }}>
            <NextoryLogo width={330} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* «14 días» entra después y la fila se recentra. */}
            <div style={{ width: W14 * room14, marginRight: GAP * room14, flexShrink: 0, display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ width: W14, flexShrink: 0, opacity: c14 * (1 - 0.45 * dim14), transform: `translateX(${(1 - c14) * -40}px) scale(${(0.9 + 0.1 * c14) * (1 - 0.06 * dim14)})`, filter: `blur(${(1 - c14) * 6}px) grayscale(${dim14})` }}>
                <div style={{ background: '#fff', borderRadius: 32, border: `1px solid ${color.line}`, boxShadow: shadow.card, padding: '40px 48px' }}>
                  <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 30, color: color.muted, marginBottom: 12 }}>Prueba normal</div>
                  <div style={{ position: 'relative', display: 'inline-block', fontFamily: font.sans, fontWeight: 700, fontSize: 104, letterSpacing: -3, color: color.ink2, lineHeight: 1 }}>
                    14 días
                    <div style={{ position: 'absolute', left: -8, right: -8, top: '54%', height: 9, borderRadius: 5, background: color.red, transformOrigin: 'left center', transform: `scaleX(${strike}) rotate(-4deg)` }} />
                  </div>
                </div>
              </div>
            </div>
            <div style={{ width: W30, flexShrink: 0, opacity: c30, transform: `translateY(${(1 - c30) * 50}px) scale(${0.86 + 0.14 * c30})`, filter: `blur(${(1 - c30) * 8}px)` }}>
              <div style={{ background: color.yellowSoft, borderRadius: 36, border: `4px solid ${color.yellow}`, boxShadow: '0 40px 90px rgba(255,202,5,0.28), 0 8px 24px rgba(16,16,16,0.06)', padding: '42px 54px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: color.ink, marginBottom: 14 }}>
                  <LogoIcon size={40} /> Con SonorBooks
                </div>
                <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 132, letterSpacing: -4, color: color.ink, lineHeight: 1 }}>30 días</div>
                <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 64, color: color.ink, marginTop: 10 }}>
                  <Highlight start={f30 + 12} dur={12} height={0.36}>gratis</Highlight>
                </div>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </Phase>

      <Phase from={fAsi} to={dur} out={8}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <NextoryLogo width={210} />
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 64, color: color.ink, letterSpacing: -1 }}>· prueba de 30 días</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {NX_STEPS.map((s, i) => {
              const f = fPaso - 10 + i * 5;
              const sp = spring({ frame: frame - f, fps, config: { damping: 15, stiffness: 170 } });
              const line = interpolate(frame, [f - 4, f + 4], [0, 1], { ...clamp, easing: easeInOut });
              return (
                <React.Fragment key={s}>
                  {i > 0 && <div style={{ width: 54, height: 5, borderRadius: 3, margin: '0 14px', background: '#E6E6E6', overflow: 'hidden' }}><div style={{ width: `${line * 100}%`, height: '100%', background: color.yellow }} /></div>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 28px 18px 18px', borderRadius: 999, background: '#fff', boxShadow: shadow.card, border: `1px solid ${color.line}`, opacity: sp, transform: `translateY(${(1 - sp) * 40}px) scale(${0.85 + 0.15 * sp})`, filter: `blur(${(1 - sp) * 6}px)` }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 28 }}>{i + 1}</div>
                    <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 34, whiteSpace: 'nowrap' }}>{s}</div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </AbsoluteFill>
      </Phase>

      <Sfx name="logo_sting" at={1} volume={0.55} />
      <Sfx name="snap_in" at={f30 + 2} />
      <Sfx name="marker" at={f30 + 12} />
      <Sfx name="swipe" at={f14} />
      <Sfx name="pencil_strike" at={f14 + 6} />
      <Sfx name="whoosh_soft" at={fAsi} />
      {NX_STEPS.map((s, i) => <Sfx key={s} name="tick_soft" at={fPaso - 10 + i * 5} volume={0.5} />)}
    </Stage>
  );
};
