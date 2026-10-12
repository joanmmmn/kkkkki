import React from 'react';
import { AbsoluteFill, Img, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
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
// `dim`: oscurecimiento alrededor de las marcas (1 = el de siempre; la reseña v2 usa menos para no ensuciar la pantalla).
export const ShotsScreen: React.FC<{ shots: Shot[]; w: number; fade?: number; dim?: number; pulse?: boolean }> = ({ shots, w, fade = 6, dim = 1, pulse = false }) => {
  const frame = useCurrentFrame();
  const list = [...shots].sort((a, b) => a.at - b.at);
  let i = 0;
  for (let k = 0; k < list.length; k++) if (frame >= list[k].at) i = k;
  const render = (sh: Shot, opacity: number, key: string) => (
    <div key={key} style={{ position: 'absolute', inset: 0, opacity }}>
      <Sequence from={sh.at} layout="none">
        {hasRec(sh.rec) ? (
          <ScreenClip src={`nxr/rec/${sh.rec}/video.mp4`} width={w} viewport={[APP_W, APP_H]} startAt={sh.start} showCursor={false} marks={sh.marks ?? []}
            camera={sh.zoom ?? [{ f: 0, zoom: 1, x: APP_W / 2, y: APP_H / 2 }]} playbackRate={sh.rate ?? 1} overlay={sh.overlay} holdAt={sh.hold} markDim={dim} markPulse={pulse} />
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
  dim?: number; motionBlur?: boolean; float?: [number, number]; pulse?: boolean;
}> = ({ rec, startAt = 0, shots, w = 430, cam = [{ f: 0, rx: 0, ry: 0, rz: 0, s: 1, x: 0, y: 0 }], taps = [], marks = [], zoom, image, tone = 'graphite', overlay, playbackRate = 1, placeholder, dim, motionBlur = false, float, pulse = false }) => {
  const frame = useCurrentFrame();
  const k = (p: string, f = frame) => keyframes(f, cam, p, easeInOut);
  const scale = w / APP_W;
  const list: Shot[] | null = shots ?? (rec ? [{ rec, at: 0, start: startAt, rate: playbackRate, marks, zoom, overlay }] : null);
  // Desenfoque de movimiento: proporcional a la velocidad del móvil en pantalla (solo en los desplazamientos rápidos).
  const speed = motionBlur ? Math.hypot(k('x') - k('x', frame - 1), k('y') - k('y', frame - 1)) + Math.abs(k('s') - k('s', frame - 1)) * 300 : 0;
  const blur = Math.max(0, Math.min(2.6, (speed - 18) * 0.05));
  // Flotación muy leve (el móvil «respira») dentro del tramo `float`, con entrada y salida suaves: en los extremos vale 0,
  // así el móvil que enlaza dos escenas no salta.
  const fEnv = float ? interpolate(frame, [float[0], float[0] + 24, float[1] - 24, float[1]], [0, 1, 1, 0], { ...clamp, easing: easeInOut }) : 0;
  const fy = fEnv * (Math.sin(frame / 38) * 4.5 + Math.sin(frame / 61) * 2);
  const frz = fEnv * Math.sin(frame / 47) * 0.35;
  return (
    <div style={{ transform: `translate(${k('x')}px, ${k('y') + fy}px) scale(${k('s')})`, willChange: 'transform', filter: blur > 0.2 ? `blur(${blur.toFixed(2)}px)` : undefined }}>
      <RealPhone w={w} ratio={APP_RATIO} rotX={k('rx')} rotY={k('ry')} rotZ={k('rz') + frz} tone={tone} screenBg="#fff">
        {list ? (
          <ShotsScreen shots={list} w={w} dim={dim} pulse={pulse} />
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

// Halo cálido detrás del móvil: sigue a la cámara del móvil (`cam`) y se intensifica cuando se acerca a una zona.
// `cx`/`cy`: centro del móvil en reposo.
export const PhoneHalo: React.FC<{ cam: PhoneKey[]; cx: number; cy?: number; strength?: number }> = ({ cam, cx, cy = 540, strength = 1 }) => {
  const frame = useCurrentFrame();
  const k = (p: string) => keyframes(frame, cam, p, easeInOut);
  const focusAmt = Math.max(0, Math.min(1, (k('s') - 1.03) / 0.36));
  return (
    <div style={{ position: 'absolute', left: cx + k('x') - 560, top: cy + k('y') - 560, width: 1120, height: 1120, borderRadius: '50%', pointerEvents: 'none',
      background: `radial-gradient(circle, rgba(255,202,5,${((0.15 + 0.1 * focusAmt) * strength).toFixed(3)}) 0%, rgba(255,202,5,${(0.05 * strength).toFixed(3)}) 38%, rgba(255,202,5,0) 64%)`,
      transform: `scale(${(0.92 + 0.16 * focusAmt + 0.025 * Math.sin(frame / 45)).toFixed(4)})` }} />
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

// ———————————————————————— Reseña v2 ————————————————————————

// Ancho de un texto en Ubuntu (para animar etiquetas que se despliegan). Sin navegador, una estimación.
let measureCtx: CanvasRenderingContext2D | null | undefined;
export const textWidth = (t: string, size: number, weight = 700) => {
  if (measureCtx === undefined) measureCtx = typeof document !== 'undefined' ? document.createElement('canvas').getContext('2d') : null;
  if (!measureCtx) return t.length * size * 0.56;
  measureCtx.font = `${weight} ${size}px Ubuntu`;
  return measureCtx.measureText(t).width;
};

// Título con revelado por máscara: cada palabra sube desde detrás de una línea invisible; las palabras `hi` se subrayan en amarillo.
// `out`: fotograma en que las palabras vuelven a bajar y desaparecen.
export const MaskTitle: React.FC<{
  text: string; at?: number; size?: number; hi?: string | string[]; align?: 'left' | 'center'; color?: string; stagger?: number; weight?: number;
  out?: number; lineHeight?: number; style?: React.CSSProperties;
}> = ({ text, at = 0, size = 96, hi, align = 'left', color: c = color.ink, stagger = 3, weight = 700, out, lineHeight = 1.04, style }) => {
  const frame = useCurrentFrame();
  const his = hi === undefined ? [] : Array.isArray(hi) ? hi : [hi];
  const words = text.split(' ');
  return (
    <div style={{ fontFamily: font.sans, fontWeight: weight, fontSize: size, lineHeight, letterSpacing: -size * 0.034, color: c, textAlign: align, ...style }}>
      {words.map((w, i) => {
        const a = at + i * stagger;
        const p = interpolate(frame, [a, a + 18], [0, 1], { ...clamp, easing: easeOut });
        const o = out !== undefined ? interpolate(frame, [out - 12 + i * 1.5, out + i * 1.5], [0, 1], { ...clamp, easing: easeInOut }) : 0;
        const isHi = his.some((h) => w.replace(/[¿?¡!.,:;«»]/g, '') === h);
        const mk = interpolate(frame, [a + 10, a + 26], [0, 1], { ...clamp, easing: easeOut });
        return (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', padding: '0 0.07em 0.16em', margin: '0 0.17em -0.16em -0.07em' }}>
            <span style={{ display: 'inline-block', position: 'relative', transform: `translateY(${(1 - p) * 112 + o * 112}%) rotate(${(1 - p) * 4}deg)`, transformOrigin: 'left bottom' }}>
              {isHi && <span style={{ position: 'absolute', left: '-0.05em', right: '-0.05em', bottom: '0.07em', height: '0.36em', background: color.yellow, borderRadius: '0.08em', zIndex: -1, transform: `scaleX(${mk})`, transformOrigin: 'left' }} />}
              {w}
            </span>
          </span>
        );
      })}
    </div>
  );
};

// Etiqueta v2: el icono salta y la píldora se despliega hacia la derecha con el texto.
// `dimAt`: desde ese fotograma queda en segundo plano (la voz ya habla de la siguiente).
export const Chip: React.FC<{
  at: number; label: string; icon?: React.ReactNode; dimAt?: number; out?: number; size?: number; dark?: boolean; accent?: string;
  reserve?: boolean; style?: React.CSSProperties; sub?: string;
}> = ({ at, label, icon, dimAt, out, size = 36, dark = false, accent = color.yellow, reserve = false, style, sub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - at, fps, config: { damping: 15, stiffness: 200 } });
  const open = interpolate(frame, [at + 2, at + 18], [0, 1], { ...clamp, easing: easeOut });
  // Segundo latido del icono: el «pop» suena dos veces (at + 1 y at + 6) y el icono rebota en el segundo.
  const beat = interpolate(frame, [at + 4, at + 6, at + 13], [0, 1, 0], { ...clamp, easing: easeOut });
  const dim = dimAt !== undefined ? interpolate(frame, [dimAt - 2, dimAt + 10], [0, 1], { ...clamp, easing: easeInOut }) : 0;
  const o = out !== undefined ? interpolate(frame, [out - 8, out], [0, 1], { ...clamp, easing: easeInOut }) : 0;
  if (!reserve && (frame < at - 1 || o >= 1)) return null;
  const ic = icon ? size * 1.45 : 0;
  const padL = icon ? size * 0.36 : size * 0.72;
  const padR = size * 0.72;
  const labelW = textWidth(label, size);
  const subW = sub ? textWidth(sub, size * 0.62, 500) : 0;
  const full = padL + ic + (icon ? size * 0.4 : 0) + Math.max(labelW, subW) + padR + 4;
  const closed = padL + ic + (icon ? size * 0.12 : 0) + (icon ? 0 : size * 0.4);
  const vis = closed + (full - closed) * open;
  const bg = dark ? color.ink : '#fff';
  return (
    <div style={{ display: 'inline-flex', position: 'relative', opacity: (frame < at ? 0 : 1) * (1 - o) * (1 - 0.55 * dim), transform: `translateY(${o * -14}px) scale(${1 - 0.05 * dim})`, transformOrigin: 'left center', ...style }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.4, padding: `${size * 0.34}px ${padR}px ${size * 0.34}px ${padL}px`, borderRadius: 999, background: bg, color: dark ? '#fff' : color.ink,
        boxShadow: dim > 0.5 ? shadow.soft : shadow.float, border: dark ? 'none' : `1px solid ${color.line}`, fontFamily: font.sans, fontWeight: 700, fontSize: size, letterSpacing: -0.3, whiteSpace: 'nowrap',
        clipPath: open >= 1 ? undefined : `inset(-30px calc(100% - ${vis.toFixed(1)}px) -30px -30px round 999px)`, transform: `scale(${0.82 + 0.18 * pop})`, transformOrigin: `${padL + ic / 2}px 50%` }}>
        {icon && (
          <span style={{ width: ic, height: ic, borderRadius: '50%', background: dim > 0.5 ? '#EFEFEF' : accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transform: `scale(${pop * (1 + 0.1 * beat)}) rotate(${(1 - pop) * -25}deg)` }}>{icon}</span>
        )}
        <span style={{ display: 'inline-flex', flexDirection: 'column', opacity: open, transform: `translateX(${(1 - open) * -18}px)` }}>
          <span>{label}</span>
          {sub && <span style={{ fontSize: size * 0.62, fontWeight: 500, color: dark ? 'rgba(255,255,255,0.7)' : color.ink2, marginTop: 2 }}>{sub}</span>}
        </span>
      </div>
    </div>
  );
};

// «Enlace en la descripción»: píldora negra con una flecha que apunta hacia abajo (rebota suavemente).
export const LinkBadge: React.FC<{ at: number; label?: string; size?: number; out?: number; style?: React.CSSProperties; reserve?: boolean }> = ({ at, label = 'Enlace en la descripción', size = 34, out, style, reserve = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 13, stiffness: 190 } });
  const o = out !== undefined ? interpolate(frame, [out - 8, out], [0, 1], clamp) : 0;
  if ((!reserve && frame < at - 1) || o >= 1) return null;
  const bob = Math.sin(Math.max(0, frame - at - 10) / 7) * size * 0.12;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.5, padding: `${size * 0.32}px ${size * 0.4}px ${size * 0.32}px ${size * 0.8}px`, borderRadius: 999, background: color.ink, color: '#fff',
      fontFamily: font.sans, fontWeight: 700, fontSize: size, whiteSpace: 'nowrap', boxShadow: '0 24px 60px rgba(16,16,16,0.28)',
      opacity: s * (1 - o), transform: `translateY(${(1 - s) * 40 - o * 20}px) scale(${0.85 + 0.15 * s})`, ...style }}>
      {label}
      <span style={{ width: size * 1.5, height: size * 1.5, borderRadius: '50%', background: color.yellow, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <svg width={size * 0.8} height={size * 0.8} viewBox="0 0 24 24" style={{ transform: `translateY(${bob}px)` }}>
          <path d="M12 4v15M5.5 12.5 12 19l6.5-6.5" stroke={color.ink} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
};

// Separador de sección: dos paneles en diagonal (negro y amarillo) barren la pantalla, el título entra con paralaje y salen
// por la izquierda descubriendo la escena nueva. Dura BUMP_LEN fotogramas; la escena nueva empieza en BUMP_IN.
export const BUMP_IN = 14;
export const BUMP_LEN = 46;
export const BUMP_LOCK = 16;
export const Bumper: React.FC<{ title: string; index: number; total: number; kicker?: string }> = ({ title, index, total, kicker = 'Reseña de Nextory' }) => {
  const frame = useCurrentFrame();
  const id = React.useId().replace(/:/g, '');
  const W = 1920 + 900;
  // Posición de cada panel: entra de derecha a izquierda (0 → 14), se queda y sale hacia la izquierda (28 → 44).
  const pos = (f: number, lag: number, outLag: number) => {
    const pin = interpolate(f, [lag, lag + 13], [1, 0], { ...clamp, easing: easeInOut });
    const pout = interpolate(f, [27 + outLag, 42 + outLag], [0, 1], { ...clamp, easing: easeInOut });
    return pin * (W + 200) - pout * (W + 200);
  };
  const xInk = pos(frame, 0, 3);
  const xYel = pos(frame, 3, 0);
  // Desenfoque de movimiento horizontal (filtro SVG con desenfoque solo en x), proporcional a la velocidad de cada panel.
  const mb = (lag: number, outLag: number) => Math.min(24, Math.abs(pos(frame, lag, outLag) - pos(frame - 1, lag, outLag)) * 0.2);
  const bInk = mb(0, 3);
  const bYel = mb(3, 0);
  // Título: cada letra llega con un pelín de retraso respecto a la anterior, deriva despacio y sale acelerando.
  const chars = Array.from(title);
  const drift = -frame * 1.3;
  // Momento de cierre (BUMP_LOCK): el título termina de montarse, el panel amarillo se posa, la cifra late y la barra se llena.
  const bar = interpolate(frame, [BUMP_LOCK - 2, BUMP_LOCK + 8], [0, 1], { ...clamp, easing: easeOut });
  const kIn = interpolate(frame, [8, 20], [0, 1], { ...clamp, easing: easeOut });
  const lock = interpolate(frame, [BUMP_LOCK - 1, BUMP_LOCK + 1, BUMP_LOCK + 10], [0, 1, 0], clamp);
  const panel = (x: number, bg: string, blurX: number, fid: string, shadow: boolean, children?: React.ReactNode) => (
    <div style={{ position: 'absolute', top: -60, bottom: -60, left: -450, width: W, transform: `translateX(${x}px) skewX(-12deg)`, background: bg, overflow: 'hidden',
      boxShadow: shadow ? '-50px 0 90px rgba(0,0,0,0.28)' : undefined, filter: blurX > 0.5 ? `url(#${fid})` : undefined }}>
      <div style={{ position: 'absolute', inset: 0, transform: 'skewX(12deg)' }}>{children}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id={`i${id}`} x="-10%" y="0" width="120%" height="100%"><feGaussianBlur stdDeviation={`${bInk.toFixed(1)} 0`} /></filter>
          <filter id={`y${id}`} x="-10%" y="0" width="120%" height="100%"><feGaussianBlur stdDeviation={`${bYel.toFixed(1)} 0`} /></filter>
        </defs>
      </svg>
      {panel(xInk, color.ink, bInk, `i${id}`, false)}
      {panel(xYel, color.yellow, bYel, `y${id}`, true, (
        <div style={{ position: 'absolute', left: 450, top: 60, width: 1920, height: 1080 }}>
          {/* número grande de fondo */}
          <div style={{ position: 'absolute', right: 70, bottom: -120, fontFamily: font.sans, fontWeight: 700, fontSize: 620, letterSpacing: -30, color: 'rgba(16,16,16,0.07)', transform: `translateX(${-xYel * 0.25 + drift * 0.5}px)` }}>
            {String(index).padStart(2, '0')}
          </div>
          <div style={{ position: 'absolute', left: 170, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', transform: `translateX(${drift}px)` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: font.sans, fontWeight: 700, fontSize: 30, letterSpacing: 6, textTransform: 'uppercase', color: color.ink,
              opacity: kIn, transform: `translateX(${(1 - kIn) * 120}px)` }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 74, height: 46, borderRadius: 999, background: color.ink, color: color.yellow, letterSpacing: 1, fontSize: 26,
                transform: `scale(${1 + 0.16 * lock})`, boxShadow: lock > 0.01 ? `0 0 0 ${(6 * lock).toFixed(2)}px rgba(16,16,16,0.14)` : undefined }}>{index}/{total}</span>
              {kicker}
            </div>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 168, letterSpacing: -7, lineHeight: 1, color: color.ink, marginTop: 22, whiteSpace: 'pre' }}>
              {chars.map((c, i) => {
                const a = 4 + i * 0.45;
                const pIn = interpolate(frame, [a, a + 13], [1, 0], { ...clamp, easing: easeOut });
                const pOut = interpolate(frame, [27 + i * 0.3, 38 + i * 0.3], [0, 1], { ...clamp, easing: (t) => t * t * t });
                return <span key={i} style={{ display: 'inline-block', transform: `translateX(${pIn * 380 - pOut * 1300}px)`, opacity: 1 - pIn * 0.9 }}>{c}</span>;
              })}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 34 }}>
              {Array.from({ length: total }).map((_, i) => (
                <div key={i} style={{ width: i === index - 1 ? 96 : 40, height: 10, borderRadius: 5, background: i < index - 1 ? 'rgba(16,16,16,0.55)' : i === index - 1 ? color.ink : 'rgba(16,16,16,0.16)',
                  transform: i === index - 1 ? `scaleX(${bar})` : undefined, transformOrigin: 'left' }} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

// Ráfaga de confeti (determinista) que sale del borde de un círculo de radio `r` centrado en x/y, en el fotograma `at`,
// con una onda expansiva. Las piezas frenan por rozamiento y caen con una gravedad suave.
export const Burst: React.FC<{ at: number; x: number; y: number; r?: number; n?: number; seed?: string; colors?: string[] }> = ({
  at, x, y, r = 200, n = 46, seed = 'burst', colors = [color.yellow, color.ink, '#FFE173', color.yellow, '#FFFFFF'],
}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 80) return null;
  const ring = interpolate(t, [0, 26], [0, 1], { ...clamp, easing: easeOut });
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, pointerEvents: 'none' }}>
      {ring < 1 && (
        <div style={{ position: 'absolute', left: x, top: y, width: 2 * (r + 10 + 230 * ring), height: 2 * (r + 10 + 230 * ring), borderRadius: '50%', transform: 'translate(-50%, -50%)',
          border: `${(10 * (1 - ring) + 1).toFixed(2)}px solid ${color.yellow}`, opacity: 0.75 * (1 - ring) }} />
      )}
      {Array.from({ length: n }).map((_, i) => {
        const rnd = (k: string) => random(`${seed}-${i}-${k}`);
        const ang = rnd('a') * Math.PI * 2;
        const v0 = 15 + rnd('v') * 21;
        const drag = 0.915;
        const dist = (v0 * (1 - Math.pow(drag, t))) / (1 - drag);
        const fall = 0.07 * t * t;
        const px = x + Math.cos(ang) * (r * 0.92 + dist);
        const py = y + Math.sin(ang) * (r * 0.92 + dist) + fall;
        const life = 44 + rnd('l') * 30;
        const o = interpolate(t, [0, 3, life - 16, life], [0, 1, 1, 0], clamp);
        if (o <= 0) return null;
        const shape = i % 3;
        const sz = 11 + rnd('z') * 13;
        const c = colors[i % colors.length];
        return (
          <div key={i} style={{ position: 'absolute', left: px, top: py, width: shape === 1 ? sz * 0.8 : sz, height: shape === 0 ? sz * 0.48 : shape === 1 ? sz * 0.8 : sz, borderRadius: shape === 1 ? '50%' : 3,
            background: c, border: c === '#FFFFFF' ? `1px solid ${color.line}` : undefined, opacity: o,
            transform: `translate(-50%, -50%) rotate(${(rnd('r') * 360 + t * (rnd('s') - 0.5) * 26).toFixed(1)}deg) scaleY(${Math.cos(t * (0.12 + rnd('f') * 0.2)).toFixed(3)})` }} />
        );
      })}
    </div>
  );
};

// Destello: una banda de luz en diagonal cruza la tarjeta una vez, empezando en el fotograma `at`.
// Va dentro de un elemento con position: relative; recorta con el mismo radio.
export const Sheen: React.FC<{ at: number; dur?: number; radius?: number; tint?: string }> = ({ at, dur = 24, radius = 44, tint = 'rgba(255,255,255,0.55)' }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: easeInOut });
  if (t <= 0 || t >= 1) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, borderRadius: radius, overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top: '-30%', bottom: '-30%', width: '38%', left: `${-45 + 160 * t}%`, transform: 'skewX(-18deg)',
        background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${tint} 50%, rgba(255,255,255,0) 100%)`, opacity: Math.sin(Math.PI * t) }} />
    </div>
  );
};

// ——— Cámara del móvil en las escenas de la app ———
// Geometría del móvil de AppFeatureScene: pantalla de PHONE_W px; el móvil entero mide PH.W × PH.H.
export const PHONE_W = 430;
// Fotogramas del enlace del móvil entre dos escenas de la app (la misma duración a cada lado del corte).
export const GLIDE = 14;
export const PH = { W: PHONE_W * 1.072, H: PHONE_W * (APP_RATIO + 0.072), off: PHONE_W * 0.036, k: PHONE_W / APP_W };
// Ventana de foco: entre `from` y `to` (fotogramas de la escena) la cámara se acerca al punto x/y (px de la grabación).
export type Focus = { from: number; to: number; x?: number; y: number; s?: number };
type CamState = { rx: number; ry: number; rz: number; s: number; x: number; y: number };
const lim = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

// Fotogramas clave del móvil: entrada (desde abajo girado o deslizándose desde el centro), acercamientos a cada foco
// (encadenados si van seguidos) y salida (hacia el centro, para enlazar con el móvil de la escena siguiente).
export const buildPhoneCam = (o: {
  dur: number; side: 1 | -1; cx: number; top: number; focus: Focus[]; enter: 'rise' | 'glide' | 'spin' | 'none'; exit: 'glide' | 'none';
}): PhoneKey[] => {
  const { dur, side, cx, top } = o;
  const rest = (f: number): CamState => ({ rx: 1.5, ry: side * (8 - 2 * (f / dur)), rz: 0, s: 1 + 0.012 * (f / dur), x: 0, y: -6 * (f / dur) });
  const center: CamState = { rx: 0, ry: 0, rz: 0, s: 1, x: 960 - cx, y: 0 };
  const focusState = (fc: Focus): CamState => {
    const s = fc.s ?? 1.42;
    const Wc = PH.W / 2, Hc = PH.H / 2;
    const px = PH.off + (fc.x ?? APP_W / 2) * PH.k;
    const py = PH.off + fc.y * PH.k;
    // En horizontal solo se aparta del texto (nunca se le echa encima).
    const tx = side > 0 ? lim(-s * (px - Wc), -150, 0) : lim(-s * (px - Wc), 0, 150);
    const ty = lim(540 - top - Hc - s * (py - Hc), 970 - top - Hc - s * Hc, 110 - top - Hc + s * Hc);
    return { rx: 0.4, ry: side * 2, rz: 0, s, x: tx, y: ty };
  };
  const keys: (CamState & { f: number; ez?: number })[] = [];
  const introEnd = o.enter === 'none' ? 0 : o.enter === 'glide' ? GLIDE : o.enter === 'spin' ? 34 : 26;
  if (o.enter === 'rise') keys.push({ f: 0, rx: 6, ry: side * 22, rz: side * -2, s: 0.94, x: side * -40, y: 30 });
  else if (o.enter === 'spin') keys.push({ f: 0, rx: 14, ry: side * 38, rz: side * -6, s: 0.86, x: side * -120, y: 60 });
  else if (o.enter === 'glide') keys.push({ f: 0, ...center, ez: 2 }); // sale del centro a toda velocidad y frena
  keys.push({ f: introEnd, ...rest(introEnd) });
  // Si el móvil sale deslizándose, el último foco se suelta antes para que la salida arranque desde el plano normal.
  const lastTo = o.exit === 'glide' ? dur - 26 : Infinity;
  const list = [...o.focus].map((x) => ({ ...x, to: Math.min(x.to, lastTo) })).filter((x) => x.to - x.from > 10).sort((a, b) => a.from - b.from);
  for (let i = 0; i < list.length; i++) {
    const fc = list[i];
    const prevChained = i > 0 && fc.from - list[i - 1].to < 26;
    const nextChained = i < list.length - 1 && list[i + 1].from - fc.to < 26;
    const st = focusState(fc);
    const fin = Math.max(introEnd + 2, fc.from + 6);
    if (!prevChained) {
      const pre = Math.max(introEnd + 1, fc.from - 12);
      if (pre < fin - 1) keys.push({ f: pre, ...rest(pre) });
    }
    keys.push({ f: fin, ...st });
    const hold = Math.max(fin + 1, fc.to - 6);
    keys.push({ f: hold, ...st });
    if (!nextChained) keys.push({ f: hold + 16, ...rest(hold + 16) });
  }
  keys.push({ f: Math.max(dur, keys[keys.length - 1].f + 1), ...rest(dur) });
  keys.sort((a, b) => a.f - b.f);
  // Quita claves desordenadas o repetidas (la primera manda).
  const clean: (CamState & { f: number; ez?: number })[] = [];
  for (const k of keys) if (!clean.length || k.f > clean[clean.length - 1].f) clean.push(k);
  if (o.exit === 'glide') {
    // Acelera hacia el centro y llega al corte a la misma velocidad con la que la escena siguiente lo recoge.
    const f0 = dur - GLIDE;
    const at = (p: keyof CamState) => keyframes(f0, clean, p, easeInOut);
    const st: CamState = { rx: at('rx'), ry: at('ry'), rz: at('rz'), s: at('s'), x: at('x'), y: at('y') };
    const cut = clean.filter((k) => k.f < f0);
    return [...cut, { f: f0, ...st, ez: 1 }, { f: dur, ...center }];
  }
  return clean;
};

// Fotogramas en que la cámara del móvil se acerca más deprisa (para que el sonido de acercamiento culmine ahí).
export const zoomPeaks = (cam: PhoneKey[], from: number, to: number, min = 0.012): number[] => {
  const s = (f: number) => keyframes(f, cam, 's', easeInOut);
  const out: number[] = [];
  for (let f = from + 1; f < to; f++) {
    const v = s(f) - s(f - 1), vp = s(f - 1) - s(f - 2), vn = s(f + 1) - s(f);
    if (v > min && v >= vp && v > vn) out.push(f);
  }
  return out;
};

// Focos a partir de las marcas de las tomas (cada marca dura hasta que empieza la toma siguiente).
export const focusFromShots = (shots: Shot[], dur: number): Focus[] => {
  const list = [...shots].sort((a, b) => a.at - b.at);
  const out: Focus[] = [];
  list.forEach((sh, i) => {
    const end = i < list.length - 1 ? list[i + 1].at + 2 : dur;
    for (const m of sh.marks ?? []) {
      const from = sh.at + m.from;
      const to = Math.min(sh.at + m.to, end);
      if (to - from > 10) out.push({ from, to, x: m.x + m.w / 2, y: m.y + m.h / 2 });
    }
  });
  return out;
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
// Cifra que cuenta de 0 a `to` en `dur` fotogramas (frenando). countUpText da lo que se ve en cada fotograma: con ella
// ChangeTicks pone un tic en cada cambio de la cifra.
export const countUpText = (frame: number, to: number, from: number, dur = 30, decimals = 0) => {
  const p = interpolate(frame, [from, from + dur], [0, 1], { ...clamp, easing: easeOut });
  const [int, dec] = (to * p).toFixed(decimals).split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return dec ? `${grouped},${dec}` : grouped;
};
export const CountUp: React.FC<{ to: number; from: number; dur?: number; decimals?: number; prefix?: string; suffix?: string; style?: React.CSSProperties }> = ({ to, from, dur = 30, decimals = 0, prefix = '', suffix = '', style }) => {
  const frame = useCurrentFrame();
  return <span style={{ fontVariantNumeric: 'tabular-nums', ...style }}>{prefix}{countUpText(frame, to, from, dur, decimals)}{suffix}</span>;
};

// Fondo de las escenas de la reseña.
export const Backdrop: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill>{children}</AbsoluteFill>
);
