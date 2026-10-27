import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phase } from '../../components/Phase';
import { Sfx } from '../../components/Sfx';
import { wordFrame } from '../../lib/vo';
import { clamp, easeOut } from '../../lib/anim';
import { Count, EverandIcon, Flag, LockIcon, Pop, ShieldIcon, Stars } from './ui';

const PlayLogo: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M4 2.8l11 9.2-11 9.2z" fill="#34A853" /><path d="M4 2.8l13.6 5.6L15 12z" fill="#4285F4" /><path d="M4 21.2l13.6-5.6L15 12z" fill="#EA4335" /><path d="M17.6 8.4l3.4 2.1c1 .6 1 2.4 0 3l-3.4 2.1L15 12z" fill="#FBBC04" /></svg>
);

const Rating: React.FC<{ flag: 'es' | 'us'; country: string; value: number; at: number; bad?: boolean }> = ({ flag, country, value, at, bad }) => (
  <Pop at={at - 8}>
    <div style={{ width: 600, boxSizing: 'border-box', padding: '30px 40px', background: bad ? '#FFF3F3' : '#fff', borderRadius: 32, boxShadow: shadow.card, border: `${bad ? 4 : 1}px solid ${bad ? color.red : color.line}`, fontFamily: font.sans, display: 'flex', alignItems: 'center', gap: 34 }}>
      <div style={{ fontSize: 130, fontWeight: 700, letterSpacing: -5, lineHeight: 1, color: bad ? color.red : color.ink, width: 210 }}><Count to={value} decimals={1} at={at - 4} dur={22} /></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Stars value={value} size={52} at={at - 4} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 36, fontWeight: 700 }}><Flag c={flag} h={34} /> {country}</div>
      </div>
    </div>
  </Pop>
);

// R09 · Opiniones: Google Play 4,4 en España y 3,5 en EE. UU., donde las quejas casi se cuadruplicaron. Incidente de seguridad (sept. 2026).
export const R09Reviews: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0, fb = 0) => lead + wordFrame('R09', w, n, fb);
  const fGp = at('Google', 0, 2.24);
  const fEs = at('4,4', 0, 3.36);
  const fUs = at('3,5', 0, 5.6);
  const fQuejas = at('quejas', 0, 8.24);
  const fCuad = at('cuadruplicaron', 0, 9.24);
  const fY = at('Y', 0, 11.28);
  const fSept = at('septiembre', 0, 11.52);
  const fInc = at('incidente', 0, 13.52);
  const fCambia = at('cambia', 0, 16.4);
  const pB = fY - 4;
  const bar = (v: number, f: number) => interpolate(frame, [f, f + 24], [0, v], { ...clamp, easing: easeOut });
  const x4 = spring({ frame: frame - fCuad - 6, fps, config: { damping: 10, stiffness: 200 } });
  const alert = spring({ frame: frame - pB - 2, fps, config: { damping: 16, stiffness: 160 } });
  const typed = Math.max(0, Math.min(12, Math.floor((frame - fCambia - 4) / 2.2)));
  const done = spring({ frame: frame - fCambia - 34, fps, config: { damping: 12, stiffness: 200 } });
  return (
    <Stage>
      <Phase from={0} to={pB}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 90, fontFamily: font.sans }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 34 }}>
            <Pop at={fGp - 6}><div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 46, fontWeight: 700 }}><PlayLogo size={50} /> Google Play</div></Pop>
            <Rating flag="es" country="España" value={4.4} at={fEs} />
            <Rating flag="us" country="EE. UU." value={3.5} at={fUs} bad />
          </div>
          <Pop at={fQuejas - 8}>
            <div style={{ width: 640, height: 600, boxSizing: 'border-box', padding: '36px 46px', background: '#fff', borderRadius: 36, boxShadow: shadow.card, border: `1px solid ${color.line}`, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 40, fontWeight: 700 }}>Quejas al mes</div>
              <div style={{ fontSize: 28, color: color.muted }}>Google Play, EE. UU.</div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 90, position: 'relative' }}>
                {[{ k: 'Antes', v: 29, f: fQuejas }, { k: 'Después del cambio', v: 110, f: fCuad - 4 }].map((b, i) => (
                  <div key={b.k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: 200 }}>
                    <div style={{ fontSize: 56, fontWeight: 700, color: i ? color.red : color.ink }}>{Math.round(bar(b.v, b.f))}</div>
                    <div style={{ width: 140, height: 3 * bar(b.v, b.f), borderRadius: '18px 18px 6px 6px', background: i ? color.red : '#2B2B2E' }} />
                    <div style={{ fontSize: 30, fontWeight: 700, textAlign: 'center', height: 74, lineHeight: 1.15 }}>{b.k}</div>
                  </div>
                ))}
                <div style={{ position: 'absolute', left: 10, top: 40, background: color.yellow, borderRadius: 999, padding: '10px 26px', fontSize: 48, fontWeight: 700, transform: `scale(${x4}) rotate(${-6 + 6 * (1 - x4)}deg)`, boxShadow: shadow.float }}>× 3,8</div>
              </div>
              <div style={{ fontSize: 22, color: color.muted, marginTop: 10 }}>Fuente: análisis de 1.658 reseñas (unstar.app)</div>
            </div>
          </Pop>
        </AbsoluteFill>
      </Phase>

      <Phase from={pB} to={dur}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', fontFamily: font.sans }}>
          <div style={{ width: 1180, boxSizing: 'border-box', background: '#17181B', color: '#fff', borderRadius: 40, padding: '50px 64px', boxShadow: '0 50px 110px rgba(0,0,0,0.35)', transform: `translateY(${(1 - alert) * 80}px) scale(${0.94 + 0.06 * alert})`, opacity: alert }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
              <div style={{ width: 120, height: 120, borderRadius: 32, background: color.red, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><ShieldIcon size={78} c="#fff" /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 30, color: 'rgba(255,255,255,0.6)', letterSpacing: 3, opacity: spring({ frame: frame - fSept + 2, fps }) }}>21 DE SEPTIEMBRE DE 2026</div>
                <div style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.1, opacity: spring({ frame: frame - fInc + 4, fps }) }}>Incidente de seguridad</div>
              </div>
              <EverandIcon size={90} />
            </div>
            <div style={{ fontSize: 32, color: 'rgba(255,255,255,0.7)', marginTop: 18, opacity: spring({ frame: frame - fInc - 10, fps }) }}>Aviso de Scribd Inc. (Scribd, Slideshare, Everand y Fable)</div>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.12)', margin: '36px 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, opacity: spring({ frame: frame - fCambia + 8, fps }) }}>
              <div style={{ flex: 1, height: 96, borderRadius: 22, background: 'rgba(255,255,255,0.08)', border: `2px solid ${done > 0.5 ? '#3DD68C' : 'rgba(255,255,255,0.25)'}`, display: 'flex', alignItems: 'center', gap: 20, padding: '0 30px' }}>
                <LockIcon size={44} c="rgba(255,255,255,0.8)" />
                <div style={{ fontSize: 46, letterSpacing: 10 }}>{'•'.repeat(typed)}<span style={{ opacity: frame % 30 < 15 && done < 0.5 ? 1 : 0 }}>|</span></div>
              </div>
              <div style={{ height: 96, borderRadius: 22, background: done > 0.5 ? '#3DD68C' : color.yellow, color: color.ink, padding: '0 36px', display: 'flex', alignItems: 'center', fontSize: 40, fontWeight: 700, whiteSpace: 'nowrap', transform: `scale(${1 + 0.06 * Math.sin(Math.min(1, done) * Math.PI)})` }}>
                {done > 0.5 ? 'Contraseña cambiada ✓' : 'Cambiar contraseña'}
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </Phase>

      <Sfx name="ui_pop" at={fGp - 6} />
      <Sfx name="card_flip" at={fEs - 8} />
      <Sfx name="counter" at={fEs - 4} volume={0.8} />
      <Sfx name="card_flip" at={fUs - 8} />
      <Sfx name="fail" at={fUs + 10} volume={0.7} />
      <Sfx name="whoosh_soft" at={fQuejas - 8} />
      <Sfx name="draw" at={fQuejas} volume={0.8} />
      <Sfx name="draw" at={fCuad - 4} />
      <Sfx name="stamp" at={fCuad + 6} volume={0.8} />
      <Sfx name="whoosh_deep" at={pB} volume={0.8} />
      <Sfx name="hit_soft" at={fInc} />
      <Sfx name="typing" at={fCambia + 4} trimAfter={30} />
      <Sfx name="success" at={fCambia + 34} />
    </Stage>
  );
};
