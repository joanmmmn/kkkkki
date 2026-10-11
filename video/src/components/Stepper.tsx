import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../brand/tokens';
import { clamp, easeInOut } from '../lib/anim';

export type Step = { label: string; at: number }; // `at`: fotograma (de la composición) en que el paso pasa a estar activo

const Check: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M6.5 12.5l3.6 3.6L17.5 8.7" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

// Barra de progreso del tutorial: pasos numerados; el activo en amarillo, los hechos con check y los siguientes en gris.
// El conector entre pasos se llena de amarillo al avanzar.
export const Stepper: React.FC<{ steps: Step[]; show: number; hide?: number; y?: number; scale?: number; compact?: boolean }> = ({
  steps, show, hide = 1e9, y = 34, scale = 1, compact = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sIn = spring({ frame: frame - show, fps, config: { damping: 18, stiffness: 140 } });
  const sOut = interpolate(frame, [hide - 10, hide], [0, 1], { ...clamp, easing: easeInOut });
  if (frame < show - 2 || sOut >= 1) return null;
  const active = steps.reduce((a, s, i) => (frame >= s.at ? i : a), -1);
  const S = 36 * scale; // diámetro del círculo
  const fs = 25 * scale;
  return (
    <div style={{ position: 'absolute', left: '50%', top: y, transform: `translate(-50%, ${(1 - sIn) * -90 - sOut * 60}px)`, opacity: sIn * (1 - sOut), zIndex: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: 'rgba(255,255,255,0.94)', borderRadius: 999, padding: `${10 * scale}px ${22 * scale}px`, boxShadow: shadow.soft, border: `1px solid ${color.line}` }}>
        {steps.map((s, i) => {
          const done = i < active;
          const on = i === active;
          const pop = spring({ frame: frame - s.at, fps, config: { damping: 11, stiffness: 190 } });
          const fill = i > 0 ? interpolate(frame, [s.at - 8, s.at + 4], [0, 1], { ...clamp, easing: easeInOut }) : 0;
          const showLabel = !compact || on;
          return (
            <React.Fragment key={s.label}>
              {i > 0 && (
                <div style={{ width: 46 * scale, height: 4 * scale, borderRadius: 2, background: '#E6E6E6', margin: `0 ${12 * scale}px`, overflow: 'hidden' }}>
                  <div style={{ width: `${fill * 100}%`, height: '100%', background: color.yellow }} />
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 * scale }}>
                <div style={{
                  width: S, height: S, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: on ? color.yellow : done ? color.ink : '#fff', border: on || done ? 'none' : `2px solid #D8D8D8`,
                  fontFamily: font.sans, fontWeight: 700, fontSize: fs * 0.82, color: on ? color.ink : done ? '#fff' : color.muted,
                  transform: `scale(${on ? 1 + 0.18 * (1 - pop) * Math.sin(pop * Math.PI) + 0.06 : 1})`,
                  boxShadow: on ? `0 0 0 ${6 * scale}px rgba(255,202,5,0.25)` : 'none',
                }}>
                  {done ? <Check size={S * 0.7} /> : i + 1}
                </div>
                {showLabel && (
                  <div style={{ fontFamily: font.sans, fontWeight: on ? 700 : 500, fontSize: fs, color: on ? color.ink : done ? color.ink2 : color.muted, whiteSpace: 'nowrap', letterSpacing: -0.2 }}>
                    {s.label}
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
