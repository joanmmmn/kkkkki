import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phase } from '../../components/Phase';
import { Highlight } from '../../components/Highlight';
import { LogoIcon } from '../../components/Logo';
import { ScreenClip, CamKey } from '../../components/ScreenClip';
import { Sfx } from '../../components/Sfx';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { wf } from './timeline';
import { BrowserStage, BW, NextoryLogo } from './common';
import cursor from '../../../public/nx/rec/10_hook_ficha/cursor.json';

// N01 · Gancho: ficha de SonorBooks con Nextory recomendado → «30 días gratis, en lugar de 14».
export const N01Hook: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('N01', w, n);
  const fNext = at('Nextory');
  const fAsi = at('Asi');
  const f30 = at('30');
  const fGratis = at('gratis');
  const f14 = at('14');

  const cam: CamKey[] = [
    { f: 0, zoom: 1.0, x: 960, y: 540 },
    { f: 18, zoom: 1.03, x: 980, y: 540 },
    { f: fNext - 26, zoom: 1.22, x: 1120, y: 570 },
    { f: fNext + 12, zoom: 1.78, x: 1275, y: 612 },
    { f: fAsi + 10, zoom: 1.84, x: 1275, y: 616 },
  ];

  const logo = spring({ frame: frame - fAsi, fps, config: { damping: 15, stiffness: 150 } });
  const c30In = Math.max(fAsi + 8, f30 - 14);
  const c30 = spring({ frame: frame - c30In, fps, config: { damping: 13, stiffness: 170 } });
  const room14 = spring({ frame: frame - (f14 - 8), fps, config: { damping: 22, stiffness: 130 } });
  const c14 = spring({ frame: frame - (f14 - 5), fps, config: { damping: 16, stiffness: 170 } });
  const strike = interpolate(frame, [f14 + 6, f14 + 15], [0, 1], { ...clamp, easing: easeOut });
  const dim14 = interpolate(frame, [f14 + 16, f14 + 30], [0, 1], { ...clamp, easing: easeInOut });
  const W14 = 400, W30 = 560, GAP = 54;

  return (
    <Stage tone="warm">
      <Phase from={0} to={fAsi + 2} noIn out={10}>
        <BrowserStage url="sonorbooks.com">
          <ScreenClip src="nx/rec/10_hook_ficha/video.mp4" width={BW} cursor={cursor} camera={cam}
            marks={[{ from: fNext - 6, to: fAsi + 14, x: 951, y: 463, w: 648, h: 307, r: 22, label: 'Recomendado: Nextory' }]} />
        </BrowserStage>
      </Phase>

      <Phase from={fAsi} to={dur} out={8}>
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
                  <Highlight start={fGratis} dur={12} height={0.36}>gratis</Highlight>
                </div>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </Phase>

      <Sfx name="zoom_in" at={fNext - 20} volume={0.8} />
      <Sfx name="draw" at={fNext - 6} />
      <Sfx name="ui_pop" at={fNext + 4} volume={0.8} />
      <Sfx name="whoosh_soft" at={fAsi} />
      <Sfx name="snap_in" at={c30In + 2} />
      <Sfx name="marker" at={fGratis} />
      <Sfx name="swipe" at={f14 - 6} />
      <Sfx name="pencil_strike" at={f14 + 6} />
    </Stage>
  );
};
