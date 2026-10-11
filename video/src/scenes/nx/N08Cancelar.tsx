import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Phase } from '../../components/Phase';
import { Pill } from '../../components/Pill';
import { Sfx } from '../../components/Sfx';
import { clamp, easeOut } from '../../lib/anim';
import { wf } from './timeline';

const User: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="4" fill="none" stroke={color.ink} strokeWidth="2" /><path d="M4.5 20.5c1.2-4 4-6 7.5-6s6.3 2 7.5 6" fill="none" stroke={color.ink} strokeWidth="2" strokeLinecap="round" /></svg>
);
const Arrow: React.FC = () => (
  <svg width="44" height="44" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" stroke={color.muted} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Warn: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M12 3.5L22 20.5H2z" fill={color.red} stroke={color.red} strokeWidth="1.5" strokeLinejoin="round" /><path d="M12 9.5v5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" /><circle cx="12" cy="17.6" r="1.4" fill="#fff" /></svg>
);

// N08 · Consejo: cancelar en «Mis páginas» antes de que acabe la prueba; al cancelar se pierde el acceso al momento.
export const N08Cancelar: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('N08', w, n);
  const fMis = at('Mis');
  const fAntes = at('antes');
  const fOjo = at('Ojo');
  const fPierdes = at('pierdes');
  const chip = (f: number) => spring({ frame: frame - f, fps, config: { damping: 15, stiffness: 180 } });
  const chips = [
    { f: fMis - 4, el: <><User size={36} />Mis páginas</> },
    { f: fMis + 10, el: <>Suscripción y pago</> },
    { f: fMis + 22, el: <span style={{ color: color.red }}>Cancelar</span> },
  ];
  const bar = interpolate(frame, [fAntes - 4, fAntes + 40], [0, 1], { ...clamp, easing: easeOut });
  const marker = spring({ frame: frame - (fAntes + 30), fps, config: { damping: 12, stiffness: 180 } });
  const warn = spring({ frame: frame - (fOjo - 2), fps, config: { damping: 14, stiffness: 170 } });
  const shake = frame >= fPierdes && frame < fPierdes + 14 ? Math.sin((frame - fPierdes) * 1.8) * 6 * (1 - (frame - fPierdes) / 14) : 0;
  const kick = spring({ frame: frame - 2, fps, config: { damping: 16, stiffness: 170 } });
  return (
    <Stage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 92 }}>
        <div style={{ opacity: kick, transform: `translateY(${(1 - kick) * -30}px)` }}><Pill size={34}>Consejo</Pill></div>
      </AbsoluteFill>
      <Phase from={0} to={fOjo + 2}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 70, paddingTop: 40 }}>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 76, letterSpacing: -2, color: color.ink, opacity: chip(4), transform: `translateY(${(1 - chip(4)) * 30}px)` }}>¿No quieres seguir?</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            {chips.map((c, i) => {
              const s = chip(c.f);
              return (
                <React.Fragment key={i}>
                  {i > 0 && <div style={{ opacity: s }}><Arrow /></div>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '22px 34px', borderRadius: 26, background: '#fff', boxShadow: shadow.card, border: `1px solid ${color.line}`, fontFamily: font.sans, fontWeight: 700, fontSize: 42, opacity: s, transform: `translateY(${(1 - s) * 40}px) scale(${0.88 + 0.12 * s})`, filter: `blur(${(1 - s) * 6}px)` }}>{c.el}</div>
                </React.Fragment>
              );
            })}
          </div>
          <div style={{ width: 1180, opacity: chip(fAntes - 6) }}>
            <div style={{ position: 'relative', height: 22, borderRadius: 11, background: '#EFEFEF' }}>
              <div style={{ width: `${bar * 100}%`, height: '100%', borderRadius: 11, background: color.yellow }} />
              <div style={{ position: 'absolute', left: '88%', top: -64, transform: `translateX(-50%) scale(${marker})`, transformOrigin: 'bottom center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ padding: '8px 18px', borderRadius: 999, background: color.ink, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 26, whiteSpace: 'nowrap' }}>Cancela antes de aquí</div>
                <div style={{ width: 4, height: 40, background: color.ink, marginTop: 4 }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: font.sans, fontWeight: 500, fontSize: 30, color: color.ink2, marginTop: 16 }}>
              <span>Hoy</span><span>Día 30 · primer cobro</span>
            </div>
          </div>
        </AbsoluteFill>
      </Phase>
      <Phase from={fOjo} to={dur} out={8}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 40 }}>
          <div style={{ width: 1180, display: 'flex', gap: 40, alignItems: 'center', background: '#fff', borderRadius: 36, padding: '50px 60px', boxShadow: shadow.card, border: `3px solid ${color.red}`, opacity: warn, transform: `translateX(${shake}px) scale(${0.92 + 0.08 * warn})` }}>
            <Warn size={120} />
            <div>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 58, color: color.ink, letterSpacing: -1, lineHeight: 1.1 }}>Al cancelar, pierdes el acceso al momento</div>
              <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 32, color: color.ink2, marginTop: 16 }}>Hazlo en los últimos días de la prueba.</div>
            </div>
          </div>
        </AbsoluteFill>
      </Phase>
      <Sfx name="ui_pop" at={2} volume={0.6} />
      {chips.map((c, i) => <Sfx key={i} name="ui_pop" at={c.f + 2} volume={0.7} />)}
      <Sfx name="draw" at={fAntes - 4} />
      <Sfx name="snap_in" at={fAntes + 32} volume={0.7} />
      <Sfx name="hit_soft" at={fOjo} />
      <Sfx name="fail" at={fPierdes} volume={0.8} />
    </Stage>
  );
};
