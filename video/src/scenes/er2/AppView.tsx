import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font } from '../../brand/tokens';
import { keyframes, easeInOut, clamp, easeOut } from '../../lib/anim';
import { Cursor, CursorPoint, cursorAt } from '../../components/Cursor';
import { CamKey, Mark, MarkLayer } from '../../components/ScreenClip';
import { BrowserWindow } from '../../components/BrowserWindow';
import { CamPoint, softCamera, useMotion } from '../../lib/motion';

// Estado de la app: imagen 4K (réplica de ElevenReader) que se muestra desde el fotograma `at` de la escena.
// `fade`: fotogramas de fundido desde el estado anterior (0 = corte seco, como un cambio real de la interfaz).
// `scroll`: el estado es el anterior desplazado `scroll` píxeles CSS hacia abajo; en lugar de fundirse, la página
// se desplaza de verdad durante `fade` fotogramas (las dos capturas casan píxel a píxel mientras se mueven).
export type St = { at: number; src: string; fade?: number; scroll?: number };
export const st = (name: string) => `er/app/st/${name}.png`;
export const app = (name: string) => `er/app/${name}.png`;

const current = (states: St[], frame: number) => {
  let i = 0;
  for (let k = 0; k < states.length; k++) if (frame >= states[k].at) i = k;
  return i;
};

// Vista de la app con cámara virtual (zoom hacia un punto), marcos amarillos, cursor y capas propias.
// Coordenadas de cámara, marcas, cursor y capas en píxeles CSS de la réplica (1920×1080).
export const AppView: React.FC<{
  width: number; states: St[]; camera?: CamKey[]; cursor?: CursorPoint[]; marks?: Mark[]; dim?: number;
  overlay?: (frame: number) => React.ReactNode; viewport?: [number, number]; imgHeight?: number;
}> = ({ width, states, camera = [{ f: 0, zoom: 1, x: 960, y: 540 }], cursor = [], marks = [], dim = 0.5, overlay, viewport = [1920, 1080], imgHeight }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [vw, vh] = viewport;
  const height = (width * vh) / vw;
  const k = width / vw;
  // Modo suave (vídeo de LibriVox): zoom logarítmico, curva seno, fotogramas clave dentro de los bordes y muelle que sigue al recorrido.
  const { soft } = useMotion();
  const cam = soft ? softCamera(frame, camera as CamPoint[], { vw, vh, ph: imgHeight ?? vh }, fps) : null;
  const zoom = cam ? cam.zoom : keyframes(frame, camera, 'zoom', easeInOut);
  const fx = cam ? cam.x : keyframes(frame, camera, 'x', easeInOut);
  const fy = cam ? cam.y : keyframes(frame, camera, 'y', easeInOut);
  // Imagen más alta que la ventana (página larga): la cámara puede recorrerla en vertical.
  const ih = imgHeight ? imgHeight * k : height;
  let tx = width / 2 - fx * k * zoom;
  let ty = height / 2 - fy * k * zoom;
  tx = Math.min(0, Math.max(width - width * zoom, tx));
  ty = Math.min(0, Math.max(height - ih * zoom, ty));
  const i = current(states, frame);
  const s = states[i];
  const prev = i > 0 ? states[i - 1] : null;
  const fade = s.fade ?? 0;
  const pf = prev && fade > 0 && !s.scroll ? interpolate(frame, [s.at, s.at + fade], [1, 0], { ...clamp, easing: easeInOut }) : 0;
  // Desplazamiento real entre dos capturas de la misma página (0 → 1).
  const sp = prev && s.scroll && fade > 0 ? interpolate(frame, [s.at, s.at + fade], [0, 1], { ...clamp, easing: easeInOut }) : 1;
  const scrolling = !!prev && !!s.scroll && sp < 1;
  const t = frame / fps;
  const c = cursorAt(cursor, t);
  return (
    <div style={{ width, height, overflow: 'hidden', position: 'relative', background: '#fff' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width, height: ih, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${zoom})` }}>
        {scrolling && prev && <Img src={staticFile(prev.src)} style={{ position: 'absolute', left: 0, top: -(s.scroll ?? 0) * sp * k, width, height: ih, display: 'block' }} />}
        <Img src={staticFile(s.src)} style={{ position: 'absolute', left: 0, top: scrolling ? (s.scroll ?? 0) * (1 - sp) * k : 0, width, height: ih, display: 'block' }} />
        {prev && pf > 0.001 && <Img src={staticFile(prev.src)} style={{ position: 'absolute', left: 0, top: 0, width, height: ih, display: 'block', opacity: pf }} />}
        {overlay && (
          <div style={{ position: 'absolute', left: 0, top: 0, width: vw, height: ih / k, transformOrigin: '0 0', transform: `scale(${k})` }}>
            {overlay(frame)}
          </div>
        )}
        {cursor.length > 0 && <Cursor x={c.x * k} y={c.y * k} scale={k * 1.25} down={c.down} sinceClick={t - c.lastDown} />}
      </div>
      {marks.length > 0 && <MarkLayer marks={marks} frame={frame} width={width} height={height} map={(x, y) => [tx + x * k * zoom, ty + y * k * zoom]} scale={k * zoom} dimTo={dim} />}
    </div>
  );
};

// Recorte de otra captura (p. ej. un panel lateral) colocado en su sitio, con entrada deslizante desde la derecha.
// x, y, w, h en píxeles CSS de la réplica. `inAt`/`outAt`: fotogramas de entrada y salida (deslizamiento).
export const Patch: React.FC<{ src: string; x: number; y: number; w: number; h: number; inAt?: number; outAt?: number; from?: 'right' | 'fade' | 'up'; shadow?: boolean }> = ({
  src, x, y, w, h, inAt = -100, outAt = 1e9, from = 'right', shadow = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sIn = spring({ frame: frame - inAt, fps, config: { damping: 24, stiffness: 150 } });
  const sOut = spring({ frame: frame - outAt, fps, config: { damping: 24, stiffness: 170 } });
  const p = sIn * (1 - sOut);
  if (p < 0.001) return null;
  const dx = from === 'right' ? (1 - p) * (1920 - x + 40) : 0;
  const dy = from === 'up' ? (1 - p) * 30 : 0;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, overflow: 'hidden', transform: `translate(${dx}px, ${dy}px)`, opacity: from === 'right' ? 1 : p, borderRadius: shadow ? 16 : 0, boxShadow: shadow ? '0 18px 50px rgba(0,0,0,0.18)' : undefined }}>
      <Img src={staticFile(src)} style={{ position: 'absolute', left: -x, top: -y, width: 1920, height: 1080 }} />
    </div>
  );
};

// Ventana de navegador con la app dentro. `bleed` (0→1) la lleva a pantalla completa sin la barra.
export const AppWindow: React.FC<{ url: string; width?: number; bleed?: number; y?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ url, width = 1640, bleed = 0, y = 0, children, style }) => {
  const bar = Math.round(width * 0.03);
  const full = 1920 / width;
  const scale = 1 + (full - 1) * bleed;
  // Con bleed=1 el contenido ocupa exactamente el fotograma: se sube la barra fuera de cuadro.
  const offY = interpolate(bleed, [0, 1], [y, (-full * bar) / 2]);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ transform: `translateY(${offY}px) scale(${scale})`, transformOrigin: '50% 50%', ...style }}>
        <BrowserWindow width={width} url={url} style={{ borderRadius: width * 0.014 * (1 - bleed) }}>{children}</BrowserWindow>
      </div>
    </AbsoluteFill>
  );
};

// Ondas que laten mientras suena la narración real de ElevenReader.
export const Wave: React.FC<{ on: boolean; bars?: number; h?: number; c?: string }> = ({ on, bars = 5, h = 26, c = color.ink }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: h * 0.16, height: h }}>
      {Array.from({ length: bars }).map((_, i) => {
        const v = on ? 0.35 + 0.65 * Math.abs(Math.sin(frame / (3.2 + i * 0.7) + i * 1.7)) : 0.25;
        return <div key={i} style={{ width: h * 0.16, height: h * v, borderRadius: h, background: c }} />;
      })}
    </div>
  );
};

// Etiqueta «Audio real de ElevenReader · Voz: X» para los fragmentos de narración.
export const VoiceTag: React.FC<{ at: number; until: number; voice: string; x?: number; y?: number; anchor?: 'left' | 'center' }> = ({ at, until, voice, x = 960, y = 940, anchor = 'center' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sIn = spring({ frame: frame - at, fps, config: { damping: 16, stiffness: 180 } });
  const sOut = interpolate(frame, [until - 8, until], [0, 1], { ...clamp, easing: easeOut });
  const s = sIn * (1 - sOut);
  if (s < 0.01) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(${anchor === 'center' ? '-50%' : '0'}, ${(1 - s) * 30}px) scale(${0.8 + 0.2 * s})`, opacity: s, display: 'flex', alignItems: 'center', gap: 18, padding: '16px 30px 16px 22px', borderRadius: 999, background: color.ink, color: '#fff', fontFamily: font.sans, fontSize: 32, fontWeight: 500, boxShadow: '0 20px 50px rgba(0,0,0,0.3)', whiteSpace: 'nowrap' }}>
      <div style={{ width: 52, height: 52, borderRadius: 26, background: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Wave on={frame < until} h={24} />
      </div>
      <span>Audio real de ElevenReader · <b style={{ fontWeight: 700 }}>{voice}</b></span>
    </div>
  );
};

// Fondo neutro para colocar ventanas de la app sobre la marca.
export const Shade: React.FC<{ o: number }> = ({ o }) => <AbsoluteFill style={{ background: `rgba(10,10,12,${o})` }} />;

// Recorte de una captura (región x, y, w, h en píxeles CSS de la réplica 1920 de ancho) escalado a `width`.
export const Crop: React.FC<{ src: string; x: number; y: number; w: number; h: number; width: number; style?: React.CSSProperties; zoom?: number }> = ({ src, x, y, w, h, width, style, zoom = 1 }) => {
  const k = width / w;
  return (
    <div style={{ width, height: h * k, overflow: 'hidden', position: 'relative', ...style }}>
      <Img src={staticFile(src)} style={{ position: 'absolute', left: -x * k, top: -y * k, width: 1920 * k, transformOrigin: `${(x + w / 2) * k}px ${(y + h / 2) * k}px`, transform: `scale(${zoom})` }} />
    </div>
  );
};
