import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Highlight } from '../../components/Highlight';
import { LogoIcon } from '../../components/Logo';
import { Sfx } from '../../components/Sfx';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { wf } from './timeline';
import { ERLogo } from './common';

// R01 · Gancho: «¿Treinta días gratis de ElevenReader, en lugar de tres?»
export const R01Hook: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('R01', w, n);
  const f30 = Math.max(2, at('Treinta') - 2);
  const f3 = at('tres');

  const logo = spring({ frame: frame - 1, fps, config: { damping: 15, stiffness: 150 } });
  const c30 = spring({ frame: frame - f30, fps, config: { damping: 13, stiffness: 170 } });
  const room3 = spring({ frame: frame - (f3 - 4), fps, config: { damping: 22, stiffness: 130 } });
  const c3 = spring({ frame: frame - (f3 - 1), fps, config: { damping: 16, stiffness: 170 } });
  const strike = interpolate(frame, [f3 + 6, f3 + 16], [0, 1], { ...clamp, easing: easeOut });
  const dim3 = interpolate(frame, [f3 + 16, f3 + 28], [0, 1], { ...clamp, easing: easeInOut });
  const out = interpolate(frame, [dur - 10, dur], [0, 1], { ...clamp, easing: easeInOut });
  const W3 = 380, W30 = 560, GAP = 54;

  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 76, opacity: 1 - 0.3 * out }}>
        <div style={{ opacity: logo, transform: `translateY(${(1 - logo) * -30}px) scale(${0.85 + 0.15 * logo})` }}>
          <ERLogo width={420} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* «3 días» entra después y la fila se recentra. */}
          <div style={{ width: W3 * room3, marginRight: GAP * room3, flexShrink: 0, display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: W3, flexShrink: 0, opacity: c3 * (1 - 0.45 * dim3), transform: `translateX(${(1 - c3) * -40}px) scale(${(0.9 + 0.1 * c3) * (1 - 0.06 * dim3)})`, filter: `blur(${(1 - c3) * 6}px) grayscale(${dim3})` }}>
              <div style={{ background: '#fff', borderRadius: 32, border: `1px solid ${color.line}`, boxShadow: shadow.card, padding: '40px 48px' }}>
                <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 30, color: color.muted, marginBottom: 12 }}>Prueba normal</div>
                <div style={{ position: 'relative', display: 'inline-block', fontFamily: font.sans, fontWeight: 700, fontSize: 104, letterSpacing: -3, color: color.ink2, lineHeight: 1 }}>
                  3 días
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

      <Sfx name="logo_sting" at={1} volume={0.55} />
      <Sfx name="snap_in" at={f30 + 2} />
      <Sfx name="marker" at={f30 + 12} />
      <Sfx name="swipe" at={f3} />
      <Sfx name="pencil_strike" at={f3 + 6} />
    </Stage>
  );
};
