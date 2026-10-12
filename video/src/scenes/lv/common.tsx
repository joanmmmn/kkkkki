import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { softSpring as spring } from '../../lib/motion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut } from '../../lib/anim';
import { CamKey, Mark } from '../../components/ScreenClip';
import { CursorPoint } from '../../components/Cursor';
import { AppView, AppWindow, St, Wave } from '../er2/AppView';
import BOXES from '../../../public/lv/web/boxes.json';
import { CLIP, clipWordAt } from './timeline';

// Capturas 4K de librivox.org (ventana 1280×720 a 3x). Las coordenadas de cámara, marcas y cursor van en píxeles CSS
// de esa ventana; `B` tiene las cajas [x, y, w, h] medidas en la web (tools/lv_boxes.mjs).
export const lvw = (name: string) => `lv/web/${name}.png`;
export const lvi = (name: string) => `lv/img/${name}`;
export const VIEW: [number, number] = [1280, 720];
export const PAGE_H: Record<string, number> = { book: 2536, search_quijote: 909 };
type Box = [number, number, number, number];
export const B = BOXES as unknown as Record<string, Box> & { 'book:readers': { title: string; reader: string; row: Box; play: Box; readerBox: Box }[] };
export const row = (title: string) => B['book:readers'].find((r) => r.title === title)!;
// Marca sobre una caja medida (con margen).
export const markOn = (b: Box, from: number, to: number, pad = 6, extra: Partial<Mark> = {}): Mark => ({
  from, to, x: b[0] - pad, y: b[1] - pad, w: b[2] + pad * 2, h: b[3] + pad * 2, r: 10, ...extra,
});
export const center = (b: Box) => ({ x: b[0] + b[2] / 2, y: b[1] + b[3] / 2 });

// La web de LibriVox dentro de una ventana de navegador, con cámara, marcas y cursor.
export const LvWeb: React.FC<{
  states: St[]; camera?: CamKey[]; marks?: Mark[]; cursor?: CursorPoint[]; width?: number; url?: string; bleed?: number; y?: number;
  page?: string; overlay?: (frame: number) => React.ReactNode; dim?: number; style?: React.CSSProperties;
}> = ({ states, camera, marks, cursor, width = 1500, url = 'librivox.org', bleed = 0, y = 30, page, overlay, dim, style }) => (
  <AppWindow url={url} width={width} bleed={bleed} y={y} style={style}>
    <AppView width={width} states={states} camera={camera} marks={marks} cursor={cursor} viewport={VIEW} imgHeight={page ? PAGE_H[page] : undefined} overlay={overlay} dim={dim} />
  </AppWindow>
);

// Etiqueta «Audio real de LibriVox · Voz: X» mientras suena un voluntario.
export const LvTag: React.FC<{ at: number; until: number; voice: string; sub?: string; x?: number; y?: number; anchor?: 'left' | 'center' }> = ({ at, until, voice, sub = 'voluntario', x = 960, y = 940, anchor = 'center' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sIn = spring({ frame: frame - at, fps, config: { damping: 16, stiffness: 180 } });
  const sOut = interpolate(frame, [until - 14, until], [0, 1], { ...clamp, easing: easeInOut });
  const s = sIn * (1 - sOut);
  if (s < 0.01) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(${anchor === 'center' ? '-50%' : '0'}, ${(1 - s) * 30}px) scale(${0.8 + 0.2 * s})`, opacity: s, display: 'flex', alignItems: 'center', gap: 18, padding: '14px 32px 14px 16px', borderRadius: 999, background: color.ink, color: '#fff', fontFamily: font.sans, boxShadow: '0 20px 50px rgba(0,0,0,0.3)', whiteSpace: 'nowrap' }}>
      <div style={{ width: 60, height: 60, borderRadius: 30, background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Wave on={frame < until} h={26} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
        <span style={{ fontSize: 22, color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>Audio real de LibriVox</span>
        <span style={{ fontSize: 34, fontWeight: 700 }}>{voice}{sub && <span style={{ fontWeight: 500, color: color.yellow }}> · {sub}</span>}</span>
      </div>
    </div>
  );
};

// Página de libro con el texto que lee un voluntario; la palabra que suena se resalta (como en ElevenReader, pero con voz humana).
export const BookPage: React.FC<{
  clip: string; clipAt: number; title?: string; author?: string; width?: number; size?: number; after?: string; style?: React.CSSProperties;
}> = ({ clip, clipAt, title, author, width = 1080, size = 52, after, style }) => {
  const frame = useCurrentFrame();
  const words = CLIP[clip].words;
  const idx = clipWordAt(clip, frame - clipAt);
  const playing = frame >= clipAt && frame < clipAt + Math.round(CLIP[clip].dur * 50);
  return (
    <div style={{ width, padding: '64px 84px 72px', background: '#FFFDF7', borderRadius: 18, boxShadow: '0 40px 100px rgba(40,30,0,0.18), 0 0 0 1px rgba(60,40,0,0.08)', fontFamily: font.serif, color: '#2a2418', ...style }}>
      {title && <div style={{ fontSize: size * 0.95, fontWeight: 500, textAlign: 'center', letterSpacing: 0.5 }}>{title}</div>}
      {author && <div style={{ fontSize: size * 0.48, textAlign: 'center', fontStyle: 'italic', color: '#7a6a4f', marginTop: 6, marginBottom: 34 }}>{author}</div>}
      <div style={{ fontSize: size, lineHeight: 1.45, textAlign: 'justify', hyphens: 'auto' }}>
        {words.map(([, , t], i) => {
          const on = i === idx && playing;
          const past = i < idx || (!playing && idx >= 0);
          return (
            <span key={i} style={{ background: on ? color.yellow : 'transparent', borderRadius: 6, padding: '0 3px', margin: '0 -3px', color: past || on ? '#2a2418' : 'rgba(42,36,24,0.55)', transition: 'none' }}>
              {t}{i < words.length - 1 ? ' ' : ''}
            </span>
          );
        })}
        {after && <span style={{ color: 'rgba(42,36,24,0.3)' }}> {after}</span>}
      </div>
    </div>
  );
};

// Recorte de una captura de librivox.org (caja en píxeles CSS de la página de 1280 de ancho) escalado a `width`.
export const CropLv: React.FC<{ name: string; box: Box; width: number; style?: React.CSSProperties; radius?: number }> = ({ name, box, width, style, radius = 14 }) => {
  const [x, y, w, h] = box;
  const k = width / w;
  return (
    <div style={{ width, height: h * k, overflow: 'hidden', position: 'relative', borderRadius: radius, ...style }}>
      <Img src={staticFile(lvw(name))} style={{ position: 'absolute', left: -x * k, top: -y * k, width: 1280 * k, maxWidth: 'none' }} />
    </div>
  );
};

// Portada (dominio público) de una grabación de LibriVox.
export const Cover: React.FC<{ id: string; size: number; style?: React.CSSProperties }> = ({ id, size, style }) => (
  <Img src={staticFile(lvi(`cover_${id}.jpg`))} style={{ width: size, height: size, borderRadius: size * 0.04, boxShadow: '0 24px 60px rgba(16,16,16,0.25), 0 0 0 1px rgba(16,16,16,0.08)', display: 'block', ...style }} />
);

export const LvLogo: React.FC<{ width: number; style?: React.CSSProperties }> = ({ width, style }) => (
  <Img src={staticFile(lvi('librivox_logo.png'))} style={{ width, height: (width * 162) / 562, display: 'block', ...style }} />
);

// Ficha con icono, título y subtítulo (para listas de pasos, formatos, ventajas…).
export const Tile: React.FC<{ icon?: React.ReactNode; title: React.ReactNode; sub?: React.ReactNode; at: number; width?: number; dark?: boolean; accent?: boolean; style?: React.CSSProperties }> = ({ icon, title, sub, at, width = 560, dark, accent, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 16, stiffness: 170 } });
  return (
    <div style={{ width, display: 'flex', alignItems: 'center', gap: 24, padding: '22px 28px', borderRadius: 28, background: dark ? color.ink : '#fff', color: dark ? '#fff' : color.ink, border: dark ? 'none' : `1px solid ${color.line}`, boxShadow: shadow.card, opacity: s, transform: `translateY(${(1 - s) * 28}px) scale(${0.96 + 0.04 * s})`, filter: s < 0.99 ? `blur(${(1 - s) * 3}px)` : undefined, ...style }}>
      {icon && <div style={{ width: 76, height: 76, borderRadius: 38, flexShrink: 0, background: accent ? color.yellow : dark ? 'rgba(255,255,255,0.1)' : color.yellowSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontFamily: font.sans, minWidth: 0 }}>
        <div style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.1 }}>{title}</div>
        {sub && <div style={{ fontSize: 26, color: dark ? 'rgba(255,255,255,0.7)' : color.ink2, lineHeight: 1.25 }}>{sub}</div>}
      </div>
    </div>
  );
};

// Píldora de texto que entra con muelle.
export const Chip: React.FC<{ at: number; children: React.ReactNode; size?: number; bg?: string; fg?: string; out?: number; style?: React.CSSProperties }> = ({ at, children, size = 36, bg = '#fff', fg = color.ink, out = 1e9, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 190 } });
  const o = interpolate(frame, [out, out + 14], [1, 0], { ...clamp, easing: easeInOut });
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.4, padding: `${size * 0.38}px ${size * 0.75}px`, borderRadius: 999, background: bg, color: fg, fontFamily: font.sans, fontWeight: 700, fontSize: size, boxShadow: shadow.float, border: bg === '#fff' ? `1px solid ${color.line}` : 'none', opacity: s * o, transform: `translateY(${(1 - s) * 26}px) scale(${0.85 + 0.15 * s})`, whiteSpace: 'nowrap', ...style }}>
      {children}
    </div>
  );
};

// Fondo oscurecido para poner tarjetas sobre una captura.
export const Veil: React.FC<{ o: number }> = ({ o }) => <AbsoluteFill style={{ background: `rgba(252,250,243,${o})`, backdropFilter: o > 0.01 ? `blur(${o * 6}px)` : undefined }} />;
