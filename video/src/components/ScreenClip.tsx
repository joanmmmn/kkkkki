import React from 'react';
import { Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color } from '../brand/tokens';
import { keyframes, Key, easeInOut } from '../lib/anim';
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
export type Mark = { from: number; to: number; x: number; y: number; w: number; h: number; r?: number };

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
  return (
    <div style={{ width, height, overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width, height, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${zoom})` }}>
        {image || frozen
          ? <Img src={staticFile(frozen ? src.replace(/video\.mp4$/, 'last.jpg') : src)} style={{ width, height, display: 'block' }} />
          : <OffthreadVideo src={staticFile(src)} trimBefore={Math.round(startAt * fps)} playbackRate={playbackRate} muted style={{ width, height, display: 'block' }} />}
        {marks.filter((m) => m.to - m.from > 20).map((m, i) => {
          const p = interpolate(frame, [m.from, m.from + 10, m.to - 8, m.to], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          if (p <= 0) return null;
          const pad = 8 * (1 - p);
          return (
            <div key={i} style={{ position: 'absolute', left: (m.x - pad) * k, top: (m.y - pad) * k, width: (m.w + pad * 2) * k, height: (m.h + pad * 2) * k, borderRadius: (m.r ?? 14) * k, border: `${4 * k}px solid ${color.yellow}`, boxShadow: `0 0 0 ${9999}px rgba(10,14,22,${0.45 * p}), 0 0 ${30 * k}px rgba(255,202,5,0.6)`, opacity: p }} />
          );
        })}
        {showCursor && cursor.length > 0 && (
          <Cursor x={c.x * k} y={c.y * k} scale={k * 1.25} down={c.down} sinceClick={t - c.lastDown} opacity={cursorOpacity} />
        )}
      </div>
    </div>
  );
};
