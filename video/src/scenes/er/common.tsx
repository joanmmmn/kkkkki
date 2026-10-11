import React from 'react';
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font } from '../../brand/tokens';
import { BrowserWindow } from '../../components/BrowserWindow';

// Ventana del navegador de las escenas paso a paso: centrada bajo la barra de pasos.
export const BW = 1520; // ancho del contenido grabado dentro de la ventana
export const BW_TOP = 128;

export const BrowserStage: React.FC<{ url: string; children: React.ReactNode }> = ({ url, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 22, stiffness: 130 } });
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: BW_TOP }}>
      <div style={{ transform: `scale(${0.96 + 0.04 * s})`, opacity: s, transformOrigin: '50% 40%' }}>
        <BrowserWindow width={BW} url={url}>{children}</BrowserWindow>
      </div>
    </AbsoluteFill>
  );
};

// Logotipo de ElevenReader (el mismo archivo que usa sonorbooks.com, 521×56).
export const ERLogo: React.FC<{ width: number; style?: React.CSSProperties; invert?: boolean }> = ({ width, style, invert }) => (
  <Img src={staticFile('er/img/elevenreader.png')} style={{ width, height: (width * 56) / 521, display: 'block', filter: invert ? 'invert(1)' : undefined, ...style }} />
);

// Momento (s) de una grabación que debe caer en el fotograma `f` de la escena → startAt para ScreenClip (≥ 0).
export const syncStart = (recT: number, f: number, fps: number) => Math.max(0, recT - f / fps);

// Rótulo de paso: «Paso 2 · Oferta».
export const StepTag: React.FC<{ n: number; label: string; at?: number }> = ({ n, label, at = 4 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 16, stiffness: 170 } });
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: color.ink, opacity: s, transform: `translateX(${(1 - s) * -30}px)` }}>
      <span style={{ background: color.yellow, borderRadius: 999, padding: '4px 16px' }}>Paso {n}</span>{label}
    </div>
  );
};
