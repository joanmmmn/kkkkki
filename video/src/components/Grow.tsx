import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

// Elemento de una fila flex que «abre hueco» al aparecer: su ancho crece con un muelle y la fila
// se recentra sola, en lugar de dejar el espacio vacío reservado hasta que entra.
// Sin `gap` en el contenedor: el espacio entre elementos lo pone `gap` aquí (no se aplica al primero).
export const Grow: React.FC<{ at: number; w: number; gap?: number; first?: boolean; children: React.ReactNode; rise?: number; style?: React.CSSProperties }> = ({
  at, w, gap = 0, first = false, children, rise = 50, style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const room = spring({ frame: frame - at, fps, config: { damping: 22, stiffness: 120 } });
  const s = spring({ frame: frame - at - 3, fps, config: { damping: 15, stiffness: 170 } });
  return (
    <div style={{ width: w * room, marginLeft: first ? 0 : gap * room, flexShrink: 0, display: 'flex', justifyContent: 'flex-start', overflow: 'visible' }}>
      <div style={{ width: w, flexShrink: 0, opacity: s, transform: `translateY(${(1 - s) * rise}px) scale(${0.9 + 0.1 * s})`, filter: `blur(${(1 - s) * 6}px)`, ...style }}>
        {children}
      </div>
    </div>
  );
};

// Variante vertical: el elemento abre hueco en altura al aparecer (la columna se recentra sola).
// No anima la opacidad: el hijo ya trae su propia entrada.
export const GrowV: React.FC<{ at: number; h: number; gap?: number; children: React.ReactNode }> = ({ at, h, gap = 0, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const room = spring({ frame: frame - at, fps, config: { damping: 22, stiffness: 120 } });
  return <div style={{ height: h * room, marginTop: gap * room, flexShrink: 0, overflow: 'visible' }}>{children}</div>;
};
