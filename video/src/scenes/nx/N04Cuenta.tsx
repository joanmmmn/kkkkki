import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { ScreenClip, CamKey } from '../../components/ScreenClip';
import { CheckIcon } from '../../components/Icons';
import { Sfx } from '../../components/Sfx';
import { clamp, easeInOut } from '../../lib/anim';
import { wf } from './timeline';
import { BrowserStage, BW } from './common';
import meta from '../../../public/nx/rec/13_registro/meta.json';
import cursor from '../../../public/nx/rec/13_registro/cursor.json';

const Lock: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="10" rx="2.4" fill={color.ink} /><path d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5" stroke={color.ink} strokeWidth="2.2" fill="none" /></svg>
);
const Eye: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" fill="none" stroke={color.muted} strokeWidth="1.8" /><circle cx="12" cy="12" r="3" fill={color.muted} /></svg>
);

// N04 · Paso 3: correo (grabación real con un correo de ejemplo; no se envía nada) → «Continuar» → contraseña.
// La pantalla de contraseña no se grabó (no creamos cuentas): se explica con una tarjeta de SonorBooks.
export const N04Cuenta: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('N04', w, n);
  const fCrea = at('crea');
  const M = meta.marks as Record<string, number>;
  const rf = (t: number) => Math.round(t * fps);
  const cam: CamKey[] = [
    { f: 0, zoom: 1.0, x: 960, y: 540 },
    { f: 22, zoom: 2.0, x: 960, y: 300 },
    { f: dur, zoom: 2.04, x: 960, y: 304 },
  ];
  const cardIn = fCrea - 6;
  const s = spring({ frame: frame - cardIn, fps, config: { damping: 19, stiffness: 150 } });
  const dim = interpolate(frame, [cardIn - 4, cardIn + 10], [0, 1], { ...clamp, easing: easeInOut });
  const typeA = cardIn + 14;
  const DOTS = 10;
  const n = Math.max(0, Math.min(DOTS, Math.floor((frame - typeA) / 4)));
  const done = typeA + DOTS * 4 + 10;
  const ok = spring({ frame: frame - done, fps, config: { damping: 11, stiffness: 200 } });
  const caret = frame < done && Math.floor(frame / 12) % 2 === 0;
  return (
    <Stage>
      <BrowserStage url="nextory.com">
        <ScreenClip src="nx/rec/13_registro/video.mp4" width={BW} cursor={cursor} camera={cam} cursorOpacity={1 - dim}
          marks={[
            { from: rf(M.type) + 2, to: rf(M.to_cont) - 2, x: 753, y: 236, w: 414, h: 48, r: 8, label: 'Tu correo' },
            { from: rf(M.to_cont), to: cardIn + 4, x: 753, y: 358, w: 414, h: 52, r: 26 },
          ]} />
        <AbsoluteFill style={{ background: `rgba(16,16,16,${0.38 * dim})` }} />
      </BrowserStage>
      {frame >= cardIn - 2 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 90 }}>
          <div style={{ width: 760, background: '#fff', borderRadius: 32, boxShadow: shadow.float, border: `1px solid ${color.line}`, padding: '46px 52px', opacity: s, transform: `translateY(${(1 - s) * 70}px) scale(${0.94 + 0.06 * s})`, filter: `blur(${(1 - s) * 6}px)` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginBottom: 30 }}>
              <div style={{ width: 70, height: 70, borderRadius: '50%', background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Lock size={38} /></div>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 52, color: color.ink, letterSpacing: -1 }}>Crea tu contraseña</div>
            </div>
            <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 26, color: color.muted, marginBottom: 10 }}>Contraseña</div>
            <div style={{ height: 78, borderRadius: 16, border: `2px solid ${frame < done ? color.ink : '#E2E2E2'}`, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 14 }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 40, letterSpacing: 8, color: color.ink }}>
                {'•'.repeat(n)}{caret && <span style={{ width: 3, height: 40, background: color.ink, marginLeft: 4 }} />}
              </div>
              <div style={{ transform: `scale(${ok})`, opacity: ok }}><CheckIcon size={40} /></div>
              <Eye size={34} />
            </div>
            <div style={{ fontFamily: font.sans, fontSize: 26, color: color.ink2, marginTop: 18 }}>La usarás para entrar en la app de Nextory.</div>
          </div>
        </AbsoluteFill>
      )}
      <Sfx name="typing" at={rf(M.type)} trimAfter={58} />
      <Sfx name="draw" at={rf(M.type) + 2} />
      <Sfx name="click" at={rf(M.click_cont)} />
      <Sfx name="swipe" at={cardIn} />
      <Sfx name="typing" at={typeA} trimAfter={DOTS * 4} volume={0.8} />
      <Sfx name="success" at={done} volume={0.8} />
    </Stage>
  );
};
