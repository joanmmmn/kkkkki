import React from 'react';
import { AbsoluteFill, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut, Key, keyframes } from '../../lib/anim';
import { RealPhone, TapRipple } from '../../components/RealPhone';
import { CamKey, Mark, ScreenClip } from '../../components/ScreenClip';
import nxrIndex from '../../../public/nxr/rec/index.json';

// Pantalla de la app grabada en BlueStacks (OBS, 664×1440 px a 50 fps).
export const APP_W = 664;
export const APP_H = 1440;
export const APP_RATIO = APP_H / APP_W;
export const hasRec = (name: string) => Boolean((nxrIndex as Record<string, unknown>)[name]);

export type Tap = { f: number; x: number; y: number }; // fotograma de la escena y px de la grabación (664×1440)
export type PhoneKey = Key & { rx: number; ry: number; rz: number; s: number; x: number; y: number };

// Toma de la pantalla del móvil: grabación `rec` que empieza en el segundo `start` cuando la escena llega al fotograma `at`.
// `hold`: segundo de la grabación en el que la imagen se detiene. `fade`: fundido de entrada en fotogramas (0 = corte seco).
export type Shot = { rec: string; at: number; start: number; rate?: number; hold?: number; fade?: number; marks?: Mark[]; zoom?: CamKey[]; overlay?: (t: number) => React.ReactNode };

// Pantalla con varias tomas encadenadas (fundido corto entre una y otra).
export const ShotsScreen: React.FC<{ shots: Shot[]; w: number; fade?: number }> = ({ shots, w, fade = 6 }) => {
  const frame = useCurrentFrame();
  const list = [...shots].sort((a, b) => a.at - b.at);
  let i = 0;
  for (let k = 0; k < list.length; k++) if (frame >= list[k].at) i = k;
  const render = (sh: Shot, opacity: number, key: string) => (
    <div key={key} style={{ position: 'absolute', inset: 0, opacity }}>
      <Sequence from={sh.at} layout="none">
        {hasRec(sh.rec) ? (
          <ScreenClip src={`nxr/rec/${sh.rec}/video.mp4`} width={w} viewport={[APP_W, APP_H]} startAt={sh.start} showCursor={false} marks={sh.marks ?? []}
            camera={sh.zoom ?? [{ f: 0, zoom: 1, x: APP_W / 2, y: APP_H / 2 }]} playbackRate={sh.rate ?? 1} overlay={sh.overlay} holdAt={sh.hold} />
        ) : (
          <Placeholder w={w} label={sh.rec} />
        )}
      </Sequence>
    </div>
  );
  const cur = list[i];
  const prev = i > 0 ? list[i - 1] : null;
  const fd = cur.fade ?? fade;
  const p = prev && fd > 0 ? interpolate(frame, [cur.at, cur.at + fd], [0, 1], clamp) : 1;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {prev && p < 1 && render(prev, 1, `p${i - 1}`)}
      {render(cur, p, `c${i}`)}
    </div>
  );
};

// Móvil con la app. `shots` encadena grabaciones; `rec`/`startAt` es el atajo para una sola toma.
// `cam`: fotogramas clave de giro (rx, ry, rz en grados), escala s y desplazamiento x/y del móvil.
export const AppPhone: React.FC<{
  rec?: string; startAt?: number; shots?: Shot[]; w?: number; cam?: PhoneKey[]; taps?: Tap[]; marks?: Mark[]; zoom?: CamKey[];
  image?: string; tone?: 'graphite' | 'silver' | 'sand'; overlay?: (t: number) => React.ReactNode; playbackRate?: number; placeholder?: string;
}> = ({ rec, startAt = 0, shots, w = 430, cam = [{ f: 0, rx: 0, ry: 0, rz: 0, s: 1, x: 0, y: 0 }], taps = [], marks = [], zoom, image, tone = 'graphite', overlay, playbackRate = 1, placeholder }) => {
  const frame = useCurrentFrame();
  const k = (p: string) => keyframes(frame, cam, p, easeInOut);
  const scale = w / APP_W;
  const list: Shot[] | null = shots ?? (rec ? [{ rec, at: 0, start: startAt, rate: playbackRate, marks, zoom, overlay }] : null);
  return (
    <div style={{ transform: `translate(${k('x')}px, ${k('y')}px) scale(${k('s')})`, willChange: 'transform' }}>
      <RealPhone w={w} ratio={APP_RATIO} rotX={k('rx')} rotY={k('ry')} rotZ={k('rz')} tone={tone} screenBg="#fff">
        {list ? (
          <ShotsScreen shots={list} w={w} />
        ) : image ? (
          <Img src={staticFile(image)} style={{ width: w, height: w * APP_RATIO, display: 'block' }} />
        ) : (
          <Placeholder w={w} label={placeholder ?? ''} />
        )}
        {taps.map((t, i) => <TapRipple key={i} x={t.x * scale} y={t.y * scale} frame={frame} at={t.f} size={w * 0.15} />)}
      </RealPhone>
    </div>
  );
};

const Placeholder: React.FC<{ w: number; label: string }> = ({ w, label }) => (
  <div style={{ width: w, height: w * APP_RATIO, background: 'linear-gradient(160deg, #3b1b5a 0%, #6d2f8e 55%, #e94e77 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14 }}>
    <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: w * 0.11, color: '#fff' }}>Nextory</div>
    <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: w * 0.045, color: 'rgba(255,255,255,0.75)', textAlign: 'center', padding: '0 10%' }}>{label}</div>
  </div>
);

// Etiqueta de función con icono que entra con muelle (y sale en `out`, si se da).
// `reserve`: ocupa su sitio desde el principio (invisible), para que una fila centrada no salte cuando aparece.
export const FeatureTag: React.FC<{ at: number; out?: number; icon?: React.ReactNode; children: React.ReactNode; size?: number; dark?: boolean; style?: React.CSSProperties; from?: 'left' | 'right' | 'up'; reserve?: boolean }> = ({
  at, out, icon, children, size = 34, dark = false, style, from = 'left', reserve = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 15, stiffness: 170 } });
  const o = out !== undefined ? interpolate(frame, [out - 8, out], [0, 1], { ...clamp, easing: easeInOut }) : 0;
  if (!reserve && (frame < at - 1 || o >= 1)) return null;
  const dx = from === 'left' ? -40 : from === 'right' ? 40 : 0;
  const dy = from === 'up' ? 30 : 0;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.4, padding: `${size * 0.36}px ${size * 0.72}px ${size * 0.36}px ${size * 0.42}px`, borderRadius: 999,
      background: dark ? color.ink : '#fff', color: dark ? '#fff' : color.ink, boxShadow: shadow.float, border: dark ? 'none' : `1px solid ${color.line}`,
      fontFamily: font.sans, fontWeight: 700, fontSize: size, letterSpacing: -0.3, whiteSpace: 'nowrap',
      opacity: s * (1 - o), transform: `translate(${(1 - s) * dx}px, ${(1 - s) * dy - o * 16}px) scale(${0.85 + 0.15 * s})`, filter: `blur(${(1 - s) * 6}px)`, ...style }}>
      {icon && (
        <span style={{ width: size * 1.45, height: size * 1.45, borderRadius: '50%', background: color.yellow, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</span>
      )}
      {children}
    </div>
  );
};

// Barra de capítulos de la reseña (arriba, centrada): el actual en amarillo, los vistos en negro.
export const ChapterRail: React.FC<{ chapters: { label: string; at: number }[]; show: number; hide?: number }> = ({ chapters, show, hide = 1e9 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sIn = spring({ frame: frame - show, fps, config: { damping: 18, stiffness: 140 } });
  const sOut = interpolate(frame, [hide - 12, hide], [0, 1], { ...clamp, easing: easeInOut });
  if (frame < show - 2 || sOut >= 1) return null;
  const active = chapters.reduce((a, c, i) => (frame >= c.at ? i : a), -1);
  return (
    <div style={{ position: 'absolute', left: '50%', top: 30, transform: `translate(-50%, ${(1 - sIn) * -80 - sOut * 60}px)`, opacity: sIn * (1 - sOut), zIndex: 60,
      display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.9)', border: `1px solid ${color.line}`, boxShadow: shadow.soft }}>
      {chapters.map((c, i) => {
        const on = i === active;
        const done = i < active;
        const p = spring({ frame: frame - c.at, fps, config: { damping: 16, stiffness: 180 } });
        return (
          <div key={c.label} style={{ padding: '7px 16px', borderRadius: 999, fontFamily: font.sans, fontWeight: on ? 700 : 500, fontSize: 21, letterSpacing: -0.1, whiteSpace: 'nowrap',
            background: on ? color.yellow : 'transparent', color: on ? color.ink : done ? color.ink2 : '#A8A8A8', transform: `scale(${on ? 1 + 0.06 * Math.sin(Math.min(1, p) * Math.PI) : 1})` }}>
            {c.label}
          </div>
        );
      })}
    </div>
  );
};

// Título grande de sección con palabra destacada en amarillo (entrada palabra a palabra).
export const BigTitle: React.FC<{ text: string; hi?: string; at?: number; size?: number; align?: 'left' | 'center'; color?: string; style?: React.CSSProperties }> = ({ text, hi, at = 0, size = 96, align = 'left', color: c = color.ink, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(' ');
  return (
    <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: size, lineHeight: 1.02, letterSpacing: -size * 0.035, color: c, textAlign: align, ...style }}>
      {words.map((w, i) => {
        const s = spring({ frame: frame - at - i * 3, fps, config: { damping: 18, stiffness: 160 } });
        const isHi = hi && w.replace(/[¿?¡!.,:]/g, '') === hi;
        return (
          <span key={i} style={{ display: 'inline-block', marginRight: '0.24em', opacity: s, transform: `translateY(${(1 - s) * 0.5}em)`, filter: `blur(${(1 - s) * 10}px)`, position: 'relative' }}>
            {isHi && <span style={{ position: 'absolute', left: '-0.08em', right: '-0.08em', bottom: '0.06em', height: '0.42em', background: color.yellow, borderRadius: '0.1em', zIndex: -1, transform: `scaleX(${interpolate(frame - at - i * 3, [6, 20], [0, 1], { ...clamp, easing: easeOut })})`, transformOrigin: 'left' }} />}
            {w}
          </span>
        );
      })}
    </div>
  );
};

// Contador con formato español que sube hasta `to` entre los fotogramas `from` y `from + dur`.
export const CountUp: React.FC<{ to: number; from: number; dur?: number; decimals?: number; prefix?: string; suffix?: string; style?: React.CSSProperties }> = ({ to, from, dur = 30, decimals = 0, prefix = '', suffix = '', style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [from, from + dur], [0, 1], { ...clamp, easing: easeOut });
  const v = to * p;
  const [int, dec] = v.toFixed(decimals).split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return <span style={{ fontVariantNumeric: 'tabular-nums', ...style }}>{prefix}{dec ? `${grouped},${dec}` : grouped}{suffix}</span>;
};

// Fondo de las escenas de la reseña.
export const Backdrop: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill>{children}</AbsoluteFill>
);
