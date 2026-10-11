import React from 'react';
import { color, font } from '../brand/tokens';

// Para usar dentro del `overlay` de ScreenClip (coordenadas CSS del viewport grabado).

const Lock: React.FC<{ size: number; c?: string }> = ({ size, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="10" rx="2.4" fill={c} /><path d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5" stroke={c} strokeWidth="2.2" fill="none" /></svg>
);

// Tapa un dato personal: parche opaco del color del fondo + desenfoque esmerilado, con candado y etiqueta opcional.
export const Redact: React.FC<{ x: number; y: number; w: number; h: number; r?: number; bg?: string; label?: string; opacity?: number; size?: number }> = ({
  x, y, w, h, r = 10, bg = '#FFFFFF', label, opacity = 1, size = 16,
}) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: r, overflow: 'hidden', opacity }}>
    <div style={{ position: 'absolute', inset: 0, background: bg }} />
    <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, rgba(16,16,16,0.035) 0 6px, rgba(16,16,16,0) 6px 12px)' }} />
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: size * 0.5, padding: `0 ${size * 0.9}px`, fontFamily: font.sans, fontWeight: 500, fontSize: size, color: color.ink2 }}>
      <Lock size={size * 1.05} c={color.ink2} />{label}
    </div>
  </div>
);

// Texto que se teclea dentro de un campo (sobre un parche del color del campo), con caret parpadeante.
export const TypeField: React.FC<{
  x: number; y: number; w: number; h: number; text: string; t: number; t0: number; cps?: number; bg?: string; fg?: string;
  size?: number; family?: string; pad?: number; r?: number; mask?: boolean; caret?: boolean; caretUntil?: number; weight?: number;
}> = ({ x, y, w, h, text, t, t0, cps = 16, bg = '#FFFFFF', fg = '#1a1a1a', size = 16, family = 'Arial, sans-serif', pad = 14, r = 8, mask = false, caret = true, caretUntil = 1e9, weight = 400 }) => {
  const n = Math.max(0, Math.min(text.length, Math.floor((t - t0) * cps)));
  const shown = mask ? '•'.repeat(n) : text.slice(0, n);
  const blink = Math.floor(t / 0.5) % 2 === 0;
  const caretOn = caret && t >= t0 - 0.2 && t < caretUntil && (n < text.length || blink);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: r, background: bg, display: 'flex', alignItems: 'center', padding: `0 ${pad}px`, boxSizing: 'border-box', overflow: 'hidden' }}>
      <span style={{ fontFamily: family, fontSize: size, color: fg, whiteSpace: 'pre', fontWeight: weight, letterSpacing: mask ? size * 0.12 : 0 }}>{shown}</span>
      {caretOn && <span style={{ width: Math.max(1, size * 0.07), height: size * 1.25, background: fg, marginLeft: 1 }} />}
    </div>
  );
};
