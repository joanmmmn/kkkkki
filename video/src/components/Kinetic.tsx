import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font } from '../brand/tokens';
import { typedCount } from '../lib/typing';

// Texto que entra palabra a palabra con desenfoque (como el cierre del V7).
export const Words: React.FC<{
  text: string; start?: number; stagger?: number; size?: number; weight?: number; color?: string; style?: React.CSSProperties;
  serif?: boolean; italic?: boolean; align?: 'left' | 'center' | 'right'; dimTo?: number;
}> = ({ text, start = 0, stagger = 3, size = 64, weight = 500, color: c = color.ink, style, serif, italic, align = 'center', dimTo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(' ');
  return (
    <div style={{ fontFamily: serif ? font.serif : font.sans, fontStyle: italic ? 'italic' : 'normal', fontWeight: weight, fontSize: size, color: c, lineHeight: 1.18, textAlign: align, letterSpacing: serif ? 0 : -0.3, ...style }}>
      {words.map((w, i) => {
        const s = spring({ frame: frame - start - i * stagger, fps, config: { damping: 20, stiffness: 170 } });
        return (
          <span key={i} style={{ display: 'inline-block', marginRight: '0.26em', opacity: dimTo !== undefined ? dimTo + (1 - dimTo) * s : s, transform: `translateY(${(1 - s) * 0.45}em)`, filter: `blur(${(1 - s) * 10}px)` }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

// Escribe texto carácter a carácter (para el buscador). `times`: fotograma de cada carácter (lib/typing.ts), para que el
// texto y el sonido de las teclas vayan a la par; sin `times`, ritmo fijo de `cps`. `placeholder`: texto gris mientras está vacío.
export const Typewriter: React.FC<{ text: string; start?: number; cps?: number; times?: number[]; placeholder?: string; style?: React.CSSProperties; caret?: boolean }> = ({
  text, start = 0, cps = 14, times, placeholder, style, caret = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = times ? typedCount(times, frame) : Math.max(0, Math.min(text.length, Math.floor(((frame - start) / fps) * cps)));
  const typing = n > 0 && n < text.length;
  const blink = typing || Math.floor(frame / (fps * 0.5)) % 2 === 0;
  return (
    <span style={{ position: 'relative', ...style }}>
      {n === 0 && placeholder && <span style={{ position: 'absolute', left: '0.32em', whiteSpace: 'nowrap', color: 'rgba(16,16,16,0.38)' }}>{placeholder}</span>}
      {text.slice(0, n)}
      {caret && <span style={{ opacity: blink ? 1 : 0, marginLeft: 2, fontWeight: 300 }}>|</span>}
    </span>
  );
};
