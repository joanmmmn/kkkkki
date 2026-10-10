import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../brand/tokens';
import { Sfx, SfxName } from './Sfx';

// Etiqueta flotante de marca para anotar lo que se ve en pantalla.
export const Callout: React.FC<{ at: number; until?: number; children: React.ReactNode; x: number; y: number; dark?: boolean; size?: number; anchor?: 'left' | 'right' | 'center'; sfx?: SfxName | null }> = ({
  at, until = 1e9, children, x, y, dark = false, size = 40, anchor = 'left', sfx = 'ui_pop',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sIn = spring({ frame: frame - at, fps, config: { damping: 15, stiffness: 180 } });
  const sOut = spring({ frame: frame - until, fps, config: { damping: 20, stiffness: 200 } });
  const s = sIn * (1 - sOut);
  const sound = sfx ? <Sfx name={sfx} at={at} volume={0.9} /> : null;
  if (frame < at || sOut > 0.99) return sound;
  const tx = anchor === 'center' ? '-50%' : anchor === 'right' ? '-100%' : '0%';
  return (
    <>
    {sound}
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(${tx}, 0) scale(${0.7 + 0.3 * s})`, transformOrigin: 'left center', opacity: s, padding: `${size * 0.42}px ${size * 0.8}px`, borderRadius: 999, background: dark ? color.ink : color.yellow, color: dark ? '#fff' : color.ink, fontFamily: font.sans, fontWeight: 700, fontSize: size, boxShadow: shadow.float, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: size * 0.4 }}>
      {children}
    </div>
    </>
  );
};
