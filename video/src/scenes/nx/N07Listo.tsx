import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phone } from '../../components/Phone';
import { Words } from '../../components/Kinetic';
import { Sfx } from '../../components/Sfx';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { wf } from './timeline';
import { NextoryLogo } from './common';

const NX_PURPLE = '#3B1650';
const NX_PINK = '#D7365B';
const PH = 760; // alto de la pantalla del teléfono
const PW = PH / (932 / 430);

const Download: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19.5h14" stroke={color.ink} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

// Pantallas ilustrativas del móvil (no son capturas de la app): presentación, inicio de sesión y reproducción.
const Screen: React.FC<{ frame: number; fEntra: number; fEsc: number }> = ({ frame, fEntra, fEsc }) => {
  const x2 = interpolate(frame, [fEntra - 4, fEntra + 6], [0, 1], { ...clamp, easing: easeInOut });
  const x3 = interpolate(frame, [fEsc - 4, fEsc + 6], [0, 1], { ...clamp, easing: easeInOut });
  const email = 'tucorreo@ejemplo.com';
  const ne = Math.max(0, Math.min(email.length, Math.floor((frame - fEntra - 6) / 1.6)));
  const np = Math.max(0, Math.min(8, Math.floor((frame - fEntra - 42) / 2)));
  const press = interpolate(frame, [fEntra + 60, fEntra + 63, fEntra + 70], [0, 1, 0], clamp);
  const prog = interpolate(frame, [fEsc, fEsc + 200], [0.18, 0.34], clamp);
  return (
    <AbsoluteFill style={{ fontFamily: font.sans }}>
      <AbsoluteFill style={{ background: NX_PURPLE, alignItems: 'center', justifyContent: 'center' }}>
        <NextoryLogo width={PW * 0.56} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: '#F1EDEA', opacity: x2, transform: `translateY(${(1 - x2) * 30}px)`, padding: '96px 26px 0' }}>
        <NextoryLogo width={110} />
        <div style={{ fontWeight: 700, fontSize: 30, color: '#2a2a2a', margin: '34px 0 22px' }}>Inicia sesión</div>
        <div style={{ fontSize: 15, color: '#555', marginBottom: 6 }}>Correo electrónico</div>
        <div style={{ height: 46, borderRadius: 10, background: '#fff', border: '1.5px solid #ddd', display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: 17, color: '#222' }}>{email.slice(0, ne)}</div>
        <div style={{ fontSize: 15, color: '#555', margin: '16px 0 6px' }}>Contraseña</div>
        <div style={{ height: 46, borderRadius: 10, background: '#fff', border: '1.5px solid #ddd', display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: 22, letterSpacing: 4, color: '#222' }}>{'•'.repeat(np)}</div>
        <div style={{ marginTop: 24, height: 50, borderRadius: 14, background: NX_PINK, color: '#fff', fontWeight: 700, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 - 0.05 * press})` }}>Iniciar sesión</div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: '#18121d', opacity: x3, transform: `translateY(${(1 - x3) * 30}px)`, alignItems: 'center', padding: '110px 28px 0' }}>
        <div style={{ width: PW - 80, height: PW - 80, borderRadius: 18, background: `linear-gradient(140deg, ${color.yellow} 0%, #ff9a6b 55%, ${NX_PINK} 100%)`, boxShadow: '0 30px 60px rgba(0,0,0,0.45)', display: 'flex', alignItems: 'flex-end', padding: 20, boxSizing: 'border-box' }}>
          <div style={{ fontWeight: 700, fontSize: 24, color: '#1a1a1a', lineHeight: 1.1 }}>Tu próxima<br />historia</div>
        </div>
        <div style={{ alignSelf: 'stretch', marginTop: 28, color: '#fff', fontWeight: 700, fontSize: 21 }}>Tu audiolibro</div>
        <div style={{ alignSelf: 'stretch', color: 'rgba(255,255,255,0.6)', fontSize: 15, marginTop: 4 }}>Capítulo 1</div>
        <div style={{ alignSelf: 'stretch', height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.18)', marginTop: 22 }}>
          <div style={{ width: `${prog * 100}%`, height: '100%', borderRadius: 3, background: '#fff' }} />
        </div>
        <div style={{ marginTop: 26, width: 74, height: 74, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 26, borderRadius: 2, background: '#18121d' }} /><div style={{ width: 8, height: 26, borderRadius: 2, background: '#18121d' }} />
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', height: 40, marginTop: 22 }}>
          {Array.from({ length: 22 }).map((_, i) => (
            <div key={i} style={{ width: 4, borderRadius: 2, background: color.yellow, height: 8 + 26 * Math.abs(Math.sin(frame / 5 + i * 0.7)) * (0.4 + 0.6 * Math.abs(Math.sin(i * 1.3))) }} />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// N07 · ¡Listo!: prueba activada → descarga la app → entra con tu correo → a escuchar.
export const N07Listo: React.FC<{ lead: number; dur: number }> = ({ lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('N07', w, n);
  const fDesc = at('Descarga');
  const fEntra = at('entra');
  const fEsc = at('escuchar');
  const badge = spring({ frame: frame - 2, fps, config: { damping: 10, stiffness: 190 } });
  const side = interpolate(frame, [fDesc - 6, fDesc + 18], [0, 1], { ...clamp, easing: easeInOut });
  const phone = spring({ frame: frame - fDesc, fps, config: { damping: 18, stiffness: 120 } });
  const chips = spring({ frame: frame - (fDesc + 10), fps, config: { damping: 16, stiffness: 170 } });
  const ring = interpolate(frame, [4, 30], [0, 1], { ...clamp, easing: easeOut });
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, transform: `translateX(${-360 * side}px) scale(${1 - 0.12 * side})` }}>
          <div style={{ position: 'relative', width: 190, height: 190 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `8px solid ${color.yellow}`, transform: `scale(${1 + 0.6 * ring})`, opacity: 0.8 * (1 - ring) }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${badge})`, boxShadow: '0 30px 70px rgba(255,202,5,0.45)' }}>
              <svg width="100" height="100" viewBox="0 0 24 24"><path d="M5.5 12.5l4.2 4.2L18.5 8" stroke={color.ink} strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="24" strokeDashoffset={24 * (1 - interpolate(frame, [8, 22], [0, 1], clamp))} /></svg>
            </div>
          </div>
          <Words text="¡Prueba activada!" start={6} stagger={3} size={84} weight={700} />
          <Words text="30 días gratis en Nextory" start={14} stagger={2} size={38} weight={500} color={color.ink2} />
          <div style={{ display: 'flex', gap: 18, marginTop: 10, opacity: chips, transform: `translateY(${(1 - chips) * 24}px)` }}>
            {['App Store', 'Google Play'].map((s) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 26px', borderRadius: 999, background: '#fff', boxShadow: shadow.soft, border: `1px solid ${color.line}`, fontFamily: font.sans, fontWeight: 700, fontSize: 30 }}>
                <Download size={30} />{s}
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
      {frame >= fDesc - 4 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ transform: `translateX(${430 + (1 - phone) * 500}px) rotate(${(1 - phone) * 8}deg)`, opacity: phone }}>
            <Phone height={PH}>
              <Screen frame={frame} fEntra={fEntra} fEsc={fEsc} />
            </Phone>
          </div>
        </AbsoluteFill>
      )}
      <Sfx name="success" at={4} />
      <Sfx name="stamp" at={6} volume={0.7} />
      <Sfx name="swipe" at={fDesc} />
      <Sfx name="ui_pop" at={fDesc + 10} volume={0.7} />
      <Sfx name="phone_tap" at={fEntra + 2} />
      <Sfx name="typing" at={fEntra + 6} trimAfter={40} volume={0.7} />
      <Sfx name="phone_tap" at={fEntra + 62} />
      <Sfx name="whoosh_soft" at={fEsc - 4} volume={0.8} />
      <Sfx name="sparkle" at={fEsc + 4} volume={0.7} />
    </Stage>
  );
};
