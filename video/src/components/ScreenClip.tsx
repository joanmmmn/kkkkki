import React from 'react';
import { AbsoluteFill, Freeze, getInputProps, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

// Con --props='{"audioOnly":true}' las grabaciones no se decodifican (render rápido solo de audio para revisar la mezcla).
const AUDIO_ONLY = Boolean((getInputProps() as { audioOnly?: boolean }).audioOnly);
import { color, font } from '../brand/tokens';
import { keyframes, Key, easeInOut, easeOut } from '../lib/anim';
import { Cursor, CursorPoint, cursorAt } from './Cursor';
import home from '../../public/elt/rec/01_home/meta.json';
import search from '../../public/elt/rec/02_search/meta.json';
import reader from '../../public/elt/rec/03_reader/meta.json';
import nxHome from '../../public/nx/rec/00_home/meta.json';
import nxFicha from '../../public/nx/rec/01_ficha/meta.json';
import nxOferta from '../../public/nx/rec/02_oferta/meta.json';
import nx10 from '../../public/nx/rec/10_hook_ficha/meta.json';
import nx11 from '../../public/nx/rec/11_ficha_click/meta.json';
import nx12 from '../../public/nx/rec/12_oferta/meta.json';
import nx13 from '../../public/nx/rec/13_registro/meta.json';
import nx14 from '../../public/nx/rec/14_plan/meta.json';
import nx15 from '../../public/nx/rec/15_pago/meta.json';
import nx22 from '../../public/nx/rec/22_plataformas/meta.json';
// Grabaciones de la app de Nextory (reseña): duraciones en public/nxr/rec/index.json (las escribe tools/nxr_ingest.py).
import nxrIndex from '../../public/nxr/rec/index.json';
// Reseña de Podimo: tomas de la app (tools/pdr_clips.py) y grabaciones de SonorBooks (tools/record.mjs).
import pdrIndex from '../../public/pdr/rec/index.json';
import pdw00 from '../../public/pdr/web/00_home/meta.json';
import pdw11 from '../../public/pdr/web/11_ficha_click/meta.json';
import pdw22 from '../../public/pdr/web/22_plataformas/meta.json';
// Reseña de Storytel: tomas de la app (tools/str_clips.py) y grabaciones de storytel.com y SonorBooks (tools/record.mjs).
import strIndex from '../../public/str/rec/index.json';
import stw00 from '../../public/str/web/00_st_planes/meta.json';
import stw01 from '../../public/str/web/01_st_alta/meta.json';
import stw10 from '../../public/str/web/10_sb_plataformas/meta.json';
// Reseña de Audible: tomas de la app (tools/aud_clips.py) y grabaciones de audible.es y SonorBooks (tools/record.mjs).
import audIndex from '../../public/aud/rec/index.json';
import auw00 from '../../public/aud/web/00_au_prueba/meta.json';
import auw10 from '../../public/aud/web/10_sb_plataformas/meta.json';
import auw11 from '../../public/aud/web/11_sb_ficha/meta.json';
import abcIndex from '../../public/abc/rec/index.json';
import abw00 from '../../public/abc/web/00_abc_landing/meta.json';
import abw01 from '../../public/abc/web/01_abc_signup/meta.json';
import abw10 from '../../public/abc/web/10_sb_plataformas/meta.json';
import abw11 from '../../public/abc/web/11_sb_ficha/meta.json';

// Duración de cada grabación (de su meta.json), para congelar el final.
import plRecIndex from '../pl/rec_index.json';

const REC_DURATIONS: Record<string, number> = {
  ...Object.fromEntries(Object.entries(plRecIndex as Record<string, { duration: number }>).map(([k, v]) => [`pl/${k.split('/')[0]}/rec/${k.split('/')[1]}/video.mp4`, v.duration])),
  'elt/rec/01_home/video.mp4': home.duration,
  'elt/rec/02_search/video.mp4': search.duration,
  'elt/rec/03_reader/video.mp4': reader.duration,
  'nx/rec/00_home/video.mp4': nxHome.duration,
  'nx/rec/01_ficha/video.mp4': nxFicha.duration,
  'nx/rec/02_oferta/video.mp4': nxOferta.duration,
  'nx/rec/10_hook_ficha/video.mp4': nx10.duration,
  'nx/rec/11_ficha_click/video.mp4': nx11.duration,
  'nx/rec/12_oferta/video.mp4': nx12.duration,
  'nx/rec/13_registro/video.mp4': nx13.duration,
  'nx/rec/14_plan/video.mp4': nx14.duration,
  'nx/rec/15_pago/video.mp4': nx15.duration,
  'nx/rec/22_plataformas/video.mp4': nx22.duration,
  ...Object.fromEntries(Object.entries(nxrIndex as Record<string, { duration: number }>).map(([k, v]) => [`nxr/rec/${k}/video.mp4`, v.duration])),
  ...Object.fromEntries(Object.entries(pdrIndex as Record<string, { duration: number }>).map(([k, v]) => [`pdr/rec/${k}/video.mp4`, v.duration])),
  'pdr/web/00_home/video.mp4': pdw00.duration,
  'pdr/web/11_ficha_click/video.mp4': pdw11.duration,
  'pdr/web/22_plataformas/video.mp4': pdw22.duration,
  ...Object.fromEntries(Object.entries(strIndex as Record<string, { duration: number }>).map(([k, v]) => [`str/rec/${k}/video.mp4`, v.duration])),
  'str/web/00_st_planes/video.mp4': stw00.duration,
  'str/web/01_st_alta/video.mp4': stw01.duration,
  'str/web/10_sb_plataformas/video.mp4': stw10.duration,
  ...Object.fromEntries(Object.entries(audIndex as Record<string, { duration: number }>).map(([k, v]) => [`aud/rec/${k}/video.mp4`, v.duration])),
  'aud/web/00_au_prueba/video.mp4': auw00.duration,
  'aud/web/10_sb_plataformas/video.mp4': auw10.duration,
  'aud/web/11_sb_ficha/video.mp4': auw11.duration,
  ...Object.fromEntries(Object.entries(abcIndex as Record<string, { duration: number }>).map(([k, v]) => [`abc/rec/${k}/video.mp4`, v.duration])),
  'abc/web/00_abc_landing/video.mp4': abw00.duration,
  'abc/web/01_abc_signup/video.mp4': abw01.duration,
  'abc/web/10_sb_plataformas/video.mp4': abw10.duration,
  'abc/web/11_sb_ficha/video.mp4': abw11.duration,
};

export type CamKey = Key & { zoom: number; x: number; y: number };
// Marco amarillo que resalta una zona de la grabación (coordenadas CSS del viewport grabado).
export type Mark = { from: number; to: number; x: number; y: number; w: number; h: number; r?: number; label?: string; icon?: React.ReactNode; labelBelow?: boolean };

// Grabación de pantalla con cámara virtual (zooms suaves hacia un punto) y cursor sincronizado.
// x/y de la cámara y del cursor en píxeles CSS del viewport grabado (por defecto 1920x1080).
export const ScreenClip: React.FC<{
  src: string; width: number; startAt?: number; cursor?: CursorPoint[]; camera?: CamKey[]; viewport?: [number, number];
  playbackRate?: number; showCursor?: boolean; cursorOpacity?: number; marks?: Mark[]; image?: boolean;
  // Segundo de la grabación en el que la imagen se queda quieta (las marcas y la capa siguen animándose).
  holdAt?: number;
  // Capa encima de la grabación y debajo del cursor, en píxeles CSS del viewport grabado (se mueve con la cámara):
  // tapar datos personales, teclear texto de ejemplo, etc. Recibe el tiempo t (s) de la grabación.
  overlay?: (t: number) => React.ReactNode;
  // Intensidad del oscurecimiento alrededor de las marcas (1 = el habitual).
  markDim?: number;
  // Onda que se abre una vez cuando aparece cada marca, para llevar la vista hacia ella.
  markPulse?: boolean;
}> = ({ image = false, src, width, startAt = 0, cursor = [], camera = [{ f: 0, zoom: 1, x: 960, y: 540 }], viewport = [1920, 1080], playbackRate = 1, showCursor = true, cursorOpacity = 1, marks = [], overlay, holdAt, markDim = 1, markPulse = false }) => {
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
  const holdF = holdAt !== undefined && holdAt > startAt ? Math.round(((holdAt - startAt) / playbackRate) * fps) : undefined;
  const t = Math.min(startAt + (frame / fps) * playbackRate, holdAt ?? Infinity);
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
          : holdF !== undefined
            ? (
              <Freeze frame={holdF} active={(f) => f >= holdF}>
                <OffthreadVideo src={staticFile(src)} trimBefore={Math.round(startAt * fps)} playbackRate={playbackRate} muted style={{ width, height, display: 'block' }} />
              </Freeze>
            )
            : <OffthreadVideo src={staticFile(src)} trimBefore={Math.round(startAt * fps)} playbackRate={playbackRate} muted style={{ width, height, display: 'block' }} />}
        {overlay && (
          <div style={{ position: 'absolute', left: 0, top: 0, width: vw, height: vh, transformOrigin: '0 0', transform: `scale(${k})` }}>
            {overlay(t)}
          </div>
        )}
        {showCursor && cursor.length > 0 && (
          <Cursor x={c.x * k} y={c.y * k} scale={k * 1.25} down={c.down} sinceClick={t - c.lastDown} opacity={cursorOpacity} />
        )}
      </div>
      {marks.length > 0 && <MarkLayer marks={marks} frame={frame} width={width} height={height} map={(x, y) => [tx + x * k * zoom, ty + y * k * zoom]} scale={k * zoom} dimLevel={markDim} pulse={markPulse} />}
    </div>
  );
};

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const CHAIN = 6;   // si una marca empieza ≤ 6 fotogramas después de que acabe la anterior, el marco se desliza de una a otra
const MOVE = 14;   // duración del deslizamiento
const DRAW = 16;   // duración del trazo al dibujarse
const OUT = 9;     // salida

// Marco amarillo en coordenadas de pantalla: trazo constante que se dibuja, foco suave alrededor y etiqueta opcional.
const MarkLayer: React.FC<{ marks: Mark[]; frame: number; width: number; height: number; map: (x: number, y: number) => [number, number]; scale: number; dimLevel?: number; pulse?: boolean }> = ({ marks, frame, width, height, map, scale, dimLevel = 1, pulse = false }) => {
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
        <rect x={0} y={0} width={width} height={height} fill="rgb(6,10,18)" opacity={0.5 * dim * alpha * dimLevel} mask={`url(#m${id})`} />
        <rect x={x0} y={y0} width={w} height={h} rx={r} fill="none" stroke={color.yellow} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={perim} strokeDashoffset={perim * (1 - draw)} opacity={alpha} filter={`url(#g${id})`} />
        {pulse && (() => {
          // Onda: sale del marco cuando termina de dibujarse (en cada marca nueva, también si viene deslizándose de otra).
          // El tamaño crece con frenada y la opacidad baja de forma lineal (la onda se ve durante todo el recorrido).
          const tl = interpolate(frame, [m.from + 10, m.from + 32], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          if (tl <= 0 || tl >= 1) return null;
          const e = 3 + 28 * easeOut(tl);
          return <rect x={x0 - e} y={y0 - e} width={w + 2 * e} height={h + 2 * e} rx={r + e} fill="none" stroke={color.yellow} strokeWidth={4 * (1 - tl) + 0.6} opacity={0.85 * (1 - tl) * alpha} />;
        })()}
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
