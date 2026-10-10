import React from 'react';
import { AbsoluteFill, getInputProps, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

// Con --props='{"audioOnly":true}' las grabaciones no se decodifican (render rápido solo de audio para revisar la mezcla).
const AUDIO_ONLY = Boolean((getInputProps() as { audioOnly?: boolean }).audioOnly);
import { color, font } from '../brand/tokens';
import { keyframes, Key, easeInOut, easeOut } from '../lib/anim';
import { Cursor, CursorPoint, cursorAt } from './Cursor';
import home from '../../public/elt/rec/01_home/meta.json';
import search from '../../public/elt/rec/02_search/meta.json';
import reader from '../../public/elt/rec/03_reader/meta.json';

// Duración de cada grabación (de su meta.json), para congelar el final.
const REC_DURATIONS: Record<string, number> = {
  'elt/rec/01_home/video.mp4': home.duration,
  'elt/rec/02_search/video.mp4': search.duration,
  'elt/rec/03_reader/video.mp4': reader.duration,
};

export type CamKey = Key & { zoom: number; x: number; y: number };
// Marco amarillo que resalta una zona de la grabación (coordenadas CSS del viewport grabado).
export type Mark = { from: number; to: number; x: number; y: number; w: number; h: number; r?: number; label?: string; icon?: React.ReactNode; labelBelow?: boolean };

// Grabación de pantalla con cámara virtual (zooms suaves hacia un punto) y cursor sincronizado.
// x/y de la cámara y del cursor en píxeles CSS del viewport grabado (por defecto 1920x1080).
export const ScreenClip: React.FC<{
  src: string; width: number; startAt?: number; cursor?: CursorPoint[]; camera?: CamKey[]; viewport?: [number, number];
  playbackRate?: number; showCursor?: boolean; cursorOpacity?: number; marks?: Mark[]; image?: boolean;
}> = ({ image = false, src, width, startAt = 0, cursor = [], camera = [{ f: 0, zoom: 1, x: 960, y: 540 }], viewport = [1920, 1080], playbackRate = 1, showCursor = true, cursorOpacity = 1, marks = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [vw, vh] = viewport;
  const height = (width * vh) / vw;
  const k = width / vw;
  const zoom = keyframes(frame, camera, 'zoom', easeInOut);
  const fx = keyframes(frame, camera, 'x', easeInOut);
  const fy = keyframes(frame, camera, 'y', easeInOut);
  let tx = width / 2 - fx * k * zoom;
  let ty = height / 2 - fy * k * zoom;
  tx = Math.min(0, Math.max(width - width * zoom, tx));
  ty = Math.min(0, Math.max(height - height * zoom, ty));
  const t = startAt + (frame / fps) * playbackRate;
  const c = cursorAt(cursor, t);
  // Si la escena dura más que la grabación, se congela el último fotograma (last.jpg junto al vídeo).
  const recDuration = REC_DURATIONS[src];
  const frozen = !image && recDuration !== undefined && t >= recDuration - 0.06;
  if (AUDIO_ONLY) return <div style={{ width, height }} />;
  return (
    <div style={{ width, height, overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width, height, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${zoom})` }}>
        {image || frozen
          ? <Img src={staticFile(frozen ? src.replace(/video\.mp4$/, 'last.jpg') : src)} style={{ width, height, display: 'block' }} />
          : <OffthreadVideo src={staticFile(src)} trimBefore={Math.round(startAt * fps)} playbackRate={playbackRate} muted style={{ width, height, display: 'block' }} />}
        {showCursor && cursor.length > 0 && (
          <Cursor x={c.x * k} y={c.y * k} scale={k * 1.25} down={c.down} sinceClick={t - c.lastDown} opacity={cursorOpacity} />
        )}
      </div>
      {marks.length > 0 && <MarkLayer marks={marks} frame={frame} width={width} height={height} map={(x, y) => [tx + x * k * zoom, ty + y * k * zoom]} scale={k * zoom} />}
    </div>
  );
};

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const CHAIN = 6;   // si una marca empieza ≤ 6 fotogramas después de que acabe la anterior, el marco se desliza de una a otra
const MOVE = 14;   // duración del deslizamiento
const DRAW = 16;   // duración del trazo al dibujarse
const OUT = 9;     // salida

// Marco amarillo en coordenadas de pantalla: trazo constante que se dibuja, foco suave alrededor y etiqueta opcional.
const MarkLayer: React.FC<{ marks: Mark[]; frame: number; width: number; height: number; map: (x: number, y: number) => [number, number]; scale: number }> = ({ marks, frame, width, height, map, scale }) => {
  const id = React.useId().replace(/:/g, '');
  const list = marks.filter((m) => m.to - m.from > 12).sort((a, b) => a.from - b.from);
  const i = list.findIndex((m) => frame >= m.from && frame < m.to);
  if (i < 0) return null;
  const m = list[i];
  const prev = i > 0 && m.from - list[i - 1].to <= CHAIN ? list[i - 1] : null;
  const next = i < list.length - 1 && list[i + 1].from - m.to <= CHAIN ? list[i + 1] : null;
  // Geometría (CSS del viewport grabado), deslizándose desde la marca anterior si van encadenadas.
  const mv = prev ? interpolate(frame, [m.from, m.from + MOVE], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeInOut }) : 1;
  const g = { x: lerp(prev?.x ?? m.x, m.x, mv), y: lerp(prev?.y ?? m.y, m.y, mv), w: lerp(prev?.w ?? m.w, m.w, mv), h: lerp(prev?.h ?? m.h, m.h, mv), r: lerp(prev?.r ?? m.r ?? 14, m.r ?? 14, mv) };
  const chainStart = (() => { let j = i; while (j > 0 && list[j].from - list[j - 1].to <= CHAIN) j--; return list[j].from; })();
  const draw = interpolate(frame, [chainStart, chainStart + DRAW], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut });
  const dim = interpolate(frame, [chainStart, chainStart + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut });
  const out = next ? 0 : interpolate(frame, [m.to - OUT, m.to], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeInOut });
  const pad = 6 * (1 - draw) + 6 * out;
  const [x0, y0] = map(g.x - pad, g.y - pad);
  const [x1, y1] = map(g.x + g.w + pad, g.y + g.h + pad);
  const w = x1 - x0, h = y1 - y0, r = Math.min(g.r * scale, h / 2, w / 2);
  const perim = 2 * (w + h) - (8 - 2 * Math.PI) * r;
  const stroke = 4.5;
  const alpha = 1 - out;
  const label = m.label;
  const below = m.labelBelow || y0 < 70;
  const lIn = label ? spring({ frame: frame - (prev && prev.label !== label ? m.from + 4 : Math.max(chainStart + 8, m.from)), fps: 50, config: { damping: 16, stiffness: 200 } }) : 0;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg width={width} height={height} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id={`b${id}`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={10} /></filter>
          <filter id={`g${id}`} x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx={0} dy={0} stdDeviation={7} floodColor={color.yellow} floodOpacity={0.75} /></filter>
          <mask id={`m${id}`}>
            <rect x={0} y={0} width={width} height={height} fill="#fff" />
            <rect x={x0} y={y0} width={w} height={h} rx={r} fill="#000" filter={`url(#b${id})`} />
          </mask>
        </defs>
        <rect x={0} y={0} width={width} height={height} fill="rgb(6,10,18)" opacity={0.5 * dim * alpha} mask={`url(#m${id})`} />
        <rect x={x0} y={y0} width={w} height={h} rx={r} fill="none" stroke={color.yellow} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={perim} strokeDashoffset={perim * (1 - draw)} opacity={alpha} filter={`url(#g${id})`} />
      </svg>
      {label && lIn > 0.01 && (
        <div style={{ position: 'absolute', left: Math.max(14, Math.min(x0, width - 420)), top: (below ? y1 + 12 : y0 - 12), transform: `translateY(${below ? 0 : -100}%) scale(${0.6 + 0.4 * lIn})`, transformOrigin: below ? 'left top' : 'left bottom', opacity: lIn * alpha,
          padding: '8px 20px', borderRadius: 999, background: color.yellow, color: color.ink, fontFamily: font.sans, fontWeight: 700, fontSize: 30, whiteSpace: 'nowrap', boxShadow: '0 10px 30px rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', gap: 10 }}>
          {m.icon}{label}
        </div>
      )}
    </AbsoluteFill>
  );
};
