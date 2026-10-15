import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Sfx } from '../../components/Sfx';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { wf } from './timeline';
import { IcCalendar, IcCard, IcUser } from './icons';

// R10 · Cancelar: ruta en la web (avatar → Detalles de la cuenta → Gestionar facturación, según la ayuda de ElevenLabs)
// y calendario: cancelar antes del día 30, acceso hasta el final del periodo y después plan gratis (10 h al mes).
export const R10Cancelar: React.FC<{ lead: number; dur: number }> = ({ lead, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf('R10', w, n);
  const fCanc = at('Cancela');
  const f30 = at('30');
  const fPerfil = at('perfil');
  const fGest = at('Gestionar');
  const fMant = at('Mantienes');
  const fFinal = at('final');
  const fGratis = at('plan');
  const sp = (f: number, d = 15, s = 170) => spring({ frame: frame - f, fps, config: { damping: d, stiffness: s } });

  const DAYS = 30;
  const cal = sp(2, 18, 140);
  const fill = interpolate(frame, [fMant - 4, fFinal + 6], [0, 1], { ...clamp, easing: easeInOut });
  const day30 = sp(f30 - 2, 11, 190);
  const crumbs = [
    { f: fPerfil - 6, icon: <IcUser size={34} />, label: 'Tu perfil' },
    { f: fPerfil + 4, icon: null, label: 'Detalles de la cuenta' },
    { f: fGest - 2, icon: <IcCard size={34} />, label: 'Gestionar facturación' },
  ];
  const free = sp(fGratis - 2, 14, 170);
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 70 }}>
        {/* Calendario de la prueba */}
        <div style={{ opacity: cal, transform: `translateY(${(1 - cal) * 40}px)`, background: '#fff', borderRadius: 36, boxShadow: shadow.card, border: `1px solid ${color.line}`, padding: '36px 44px', width: 1500 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: font.sans, fontWeight: 700, fontSize: 38, color: color.ink, marginBottom: 26 }}>
            <IcCalendar size={40} /> Tu prueba
            <div style={{ marginLeft: 'auto', fontWeight: 500, fontSize: 28, color: color.ink2, opacity: sp(fCanc) }}>Cancela <b style={{ color: color.ink }}>antes del día 30</b> si no quieres pagar</div>
          </div>
          <div style={{ position: 'relative', display: 'flex', gap: 8 }}>
            {Array.from({ length: DAYS }, (_, i) => {
              const d = i + 1;
              const lit = fill * DAYS >= d - 0.5;
              const last = d === DAYS;
              return (
                <div key={d} style={{ flex: 1, height: 74, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 22,
                  background: lit ? color.yellow : '#F4F3EF', color: lit ? color.ink : color.muted,
                  transform: last ? `scale(${1 + 0.25 * day30 * (1 - Math.min(1, Math.max(0, (frame - f30) / 30)))})` : undefined,
                  boxShadow: last && frame >= f30 - 2 ? `0 0 0 ${5 * day30}px ${color.red}` : undefined }}>
                  {d}
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18, fontFamily: font.sans, fontSize: 26 }}>
            <div style={{ color: color.ink2, opacity: sp(fMant) }}>Mantienes Ultra hasta el final del periodo</div>
            <div style={{ color: color.red, fontWeight: 700, opacity: day30 }}>Día 30 · primer cobro</div>
          </div>
        </div>

        {/* Ruta en la web y plan gratis */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {crumbs.map((c, i) => {
            const s = sp(c.f);
            const arrow = interpolate(frame, [c.f - 4, c.f + 4], [0, 1], { ...clamp, easing: easeOut });
            return (
              <React.Fragment key={c.label}>
                {i > 0 && <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.muted, opacity: arrow }}>→</div>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 30px', borderRadius: 999, background: i === crumbs.length - 1 ? color.yellow : '#fff', boxShadow: shadow.card, border: `1px solid ${color.line}`, fontFamily: font.sans, fontWeight: 700, fontSize: 34, color: color.ink,
                  opacity: s, transform: `translateY(${(1 - s) * 30}px) scale(${0.85 + 0.15 * s})` }}>
                  {c.icon}{c.label}
                </div>
              </React.Fragment>
            );
          })}
          <div style={{ width: 2, height: 70, background: color.line, margin: '0 22px', opacity: free }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, opacity: free, transform: `translateX(${(1 - free) * 40}px)`, fontFamily: font.sans }}>
            <div style={{ fontWeight: 700, fontSize: 34, color: color.ink }}>Después: plan gratis</div>
            <div style={{ fontSize: 26, color: color.ink2 }}>10 h al mes para tus textos</div>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx name="whoosh_soft" at={0} volume={0.7} />
      <Sfx name="tick" at={fCanc} volume={0.8} />
      <Sfx name="stamp" at={f30} volume={0.7} />
      {crumbs.map((c) => <Sfx key={c.label} name="tick_soft" at={c.f} volume={0.6} />)}
      <Sfx name="swipe" at={fMant - 4} volume={0.8} />
      <Sfx name="ui_pop" at={fGratis} volume={0.8} />
      {dur > 0 && null}
    </Stage>
  );
};
