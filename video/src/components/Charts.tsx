import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../brand/tokens';
import { clamp, easeOut } from '../lib/anim';

// Anillo de porcentaje animado.
export const Donut: React.FC<{ pct: number; at: number; label: string; size?: number; sub?: string }> = ({ pct, at, label, size = 360, sub }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 40], [0, pct / 100], { ...clamp, easing: easeOut });
  const R = size / 2 - 26;
  const C = 2 * Math.PI * R;
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 18 } });
  return (
    <div style={{ textAlign: 'center', opacity: s, transform: `scale(${0.85 + 0.15 * s})` }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={R} stroke="#EFEFEF" strokeWidth={36} fill="none" />
          <circle cx={size / 2} cy={size / 2} r={R} stroke={color.yellow} strokeWidth={36} fill="none" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - p)} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: size * 0.28, letterSpacing: -3 }}>{Math.round(p * 100)} %</div>
      </div>
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 46, marginTop: 20 }}>{label}</div>
      {sub && <div style={{ fontFamily: font.sans, fontSize: 30, color: color.muted, marginTop: 6 }}>{sub}</div>}
    </div>
  );
};

// Barra horizontal etiquetada que crece hasta `frac` (0–1).
export const BarRow: React.FC<{ label: string; value: string; frac: number; at: number; width?: number; accent?: boolean; muted?: boolean; size?: number }> = ({ label, value, frac, at, width = 1200, accent, muted, size = 40 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [at, at + 32], [0, frac], { ...clamp, easing: easeOut });
  const s = spring({ frame: frame - at, fps, config: { damping: 18, stiffness: 160 } });
  return (
    <div style={{ width, opacity: s, transform: `translateX(${(1 - s) * -30}px)` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: font.sans, fontSize: size, fontWeight: 500, marginBottom: 10, color: muted ? color.muted : color.ink }}>
        <span>{label}</span><b style={{ fontVariantNumeric: 'tabular-nums' }}>{value}</b>
      </div>
      <div style={{ height: size * 0.55, borderRadius: size, background: '#F0F0F0', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${p * 100}%`, borderRadius: size, background: accent ? color.yellow : muted ? '#C9C9C9' : color.ink }} />
      </div>
    </div>
  );
};

// Barra apilada (p. ej. reparto por géneros).
export const StackBar: React.FC<{ parts: { label: string; pct: number; c: string }[]; at: number; width?: number }> = ({ parts, at, width = 900 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 36], [0, 1], { ...clamp, easing: easeOut });
  return (
    <div style={{ width }}>
      <div style={{ display: 'flex', height: 90, borderRadius: 24, overflow: 'hidden', boxShadow: shadow.soft, background: '#F2F2F2' }}>
        {parts.map((x) => (
          <div key={x.label} style={{ width: `${x.pct * p}%`, background: x.c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: x.c === color.ink ? '#fff' : color.ink, overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {x.pct >= 20 ? `${Math.round(x.pct * p)} %` : ''}
          </div>
        ))}
      </div>
      {/* Las cifras de los tramos estrechos van en la leyenda para no solaparse dentro de la barra. */}
      <div style={{ display: 'flex', gap: 34, marginTop: 20, fontFamily: font.sans, fontSize: 34, color: color.ink2 }}>
        {parts.map((x) => <div key={x.label} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: interpolate(p, [0.5, 1], [0.3, 1], clamp) }}><div style={{ width: 24, height: 24, borderRadius: 6, background: x.c, border: x.c === '#D9D9D9' ? '1px solid #C4C4C4' : 'none' }} />{x.label} <b style={{ color: color.ink }}>{x.pct} %</b></div>)}
      </div>
    </div>
  );
};
