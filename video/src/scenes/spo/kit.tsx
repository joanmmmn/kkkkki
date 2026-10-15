import React from 'react';
import { AbsoluteFill, Img, interpolate, random, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { color, font } from '../../brand/tokens';
import { clamp, easeInOut, keyframes } from '../../lib/anim';
import { RealPhone, TapRipple } from '../../components/RealPhone';
import { Keystrokes, Sfx } from '../../components/Sfx';
import { Stage } from '../../components/Stage';
import { BrowserWindow } from '../../components/BrowserWindow';
import { CamKey, Mark, ScreenClip } from '../../components/ScreenClip';
import { CursorPoint } from '../../components/Cursor';
import spoIndex from '../../../public/spo/rec/index.json';
import {
  APP_H, APP_RATIO, APP_W, buildPhoneCam, Chip, Focus, focusFromShots, MaskTitle, PH, PhoneHalo, PhoneKey, PHONE_W, Shot, Tap, zoomPeaks,
} from '../nxr/kit';
import { Kicker } from '../nxr/App';
import { wf } from './timeline';
import type { SceneProps } from './registry';

// Piezas comunes con las otras reseñas (mismo sistema visual de SonorBooks: títulos con subrayado amarillo, separadores
// amarillo y negro, etiquetas que se despliegan con la voz).
export {
  APP_H, APP_RATIO, APP_W, BigTitle, Bumper, BUMP_IN, BUMP_LEN, BUMP_LOCK, buildPhoneCam, Burst, Chip, CountUp, countUpText, focusFromShots, GLIDE,
  LinkBadge, MaskTitle, PH, PhoneHalo, PHONE_W, Sheen, textWidth, zoomPeaks,
} from '../nxr/kit';
export type { Focus, PhoneKey, Shot, Tap } from '../nxr/kit';
export { Kicker } from '../nxr/App';
export { Odometer, odometerProgress, odometerShown, SegBar, segFrames } from '../pdr/kit';

// Identidad de Spotify en el vídeo: los colores de spotify.com/es/premium (15/10/2026). El verde es el de su marca y del plan
// Individual; menta, melocotón y lila son los títulos de los planes Estudiantes, Duo y Familiar. El gris casi negro y el de las
// tarjetas son los fondos de su web y de la app. El verde oscuro sirve para texto sobre fondo claro (el verde de la marca no se
// lee bien encima del blanco).
export const SP = '#1ED760';
export const SP_DEEP = '#13893D';
export const SP_SOFT = '#DCF8E6';
export const SP_INK = '#121212';
export const SP_CARD = '#242424';
export const SP_MINT = '#91EEDA';
export const SP_PEACH = '#FFA178';
export const SP_LILAC = '#D8A3FF';
export const SP_PEACH_SOFT = '#FFEDE4';
export const SP_LILAC_SOFT = '#F5EAFF';
export const SP_MINT_SOFT = '#E3FAF5';

// Fondo de la reseña de Spotify: el cálido de SonorBooks con un halo verde de Spotify que deriva por la esquina inferior
// izquierda, otro amarillo más tenue arriba a la derecha y el grano finísimo de las otras reseñas (rompe las bandas).
export const SpoStage: React.FC<{ children?: React.ReactNode; still?: boolean }> = ({ children, still = false }) => {
  const frame = useCurrentFrame();
  const t = still ? 0 : frame / 50;
  const g = still ? 0 : Math.floor(frame / 2);
  const gx = Math.floor(random(`spo-gx-${g}`) * 512);
  const gy = Math.floor(random(`spo-gy-${g}`) * 512);
  return (
    <Stage tone="warm" still={still}>
      <div style={{ position: 'absolute', width: 1500, height: 1500, borderRadius: '50%', left: -720 + Math.sin(t * 0.12) * 120, bottom: -920 + Math.cos(t * 0.1) * 90,
        background: 'radial-gradient(circle, rgba(30,215,96,0.17) 0%, rgba(30,215,96,0.06) 38%, rgba(30,215,96,0) 62%)' }} />
      <div style={{ position: 'absolute', width: 900, height: 900, borderRadius: '50%', right: -280 + Math.cos(t * 0.16) * 80, top: -400 + Math.sin(t * 0.13) * 60,
        background: 'radial-gradient(circle, rgba(255,202,5,0.10) 0%, rgba(255,202,5,0) 60%)' }} />
      <AbsoluteFill style={{ backgroundImage: `url(${staticFile('pdr/img/grain.png')})`, backgroundSize: '512px 512px', backgroundPosition: `${gx}px ${gy}px`, opacity: 0.07, mixBlendMode: 'overlay', pointerEvents: 'none' }} />
      {children}
    </Stage>
  );
};

// Logotipo de Spotify (el SVG de la cabecera de spotify.com): «duo» = símbolo verde y letras negras (sobre fondo claro).
export const SpotifyLogo: React.FC<{ width: number; variant?: 'duo' | 'green' | 'black' | 'white'; style?: React.CSSProperties }> = ({ width, variant = 'duo', style }) => (
  <Img src={staticFile(`spo/img/spotify_${variant}.svg`)} style={{ width, height: (width * 225.25) / 823.46, display: 'block', ...style }} />
);
// Icono de la app: el símbolo verde sobre un cuadrado redondeado casi negro (las ondas, huecas, se ven negras).
export const SpotifyIcon: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.24, background: SP_INK, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...style }}>
    <Img src={staticFile('spo/img/spotify_icon_green.svg')} style={{ width: size * 0.66, height: size * 0.66, display: 'block' }} />
  </div>
);

// Pantalla de la app grabada en BlueStacks (OBS, 664×1440 a 50 fps): tomas en public/spo/rec (tools/spo_clips.py).
export const hasRec = (name: string) => Boolean((spoIndex as Record<string, unknown>)[name]);
export const recDur = (name: string) => ((spoIndex as Record<string, { duration: number }>)[name]?.duration ?? 0);

const Placeholder: React.FC<{ w: number; label: string }> = ({ w, label }) => (
  <div style={{ width: w, height: w * APP_RATIO, background: SP_INK, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14 }}>
    <SpotifyLogo width={w * 0.6} variant="white" />
    <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: w * 0.045, color: 'rgba(255,255,255,0.75)', textAlign: 'center', padding: '0 10%' }}>{label}</div>
  </div>
);

// Pantalla con varias tomas encadenadas (fundido corto entre una y otra). Cada toma se congela en `hold` (o, si no lo lleva,
// justo antes de acabar: así nunca se pide un fotograma que no existe).
export const ShotsScreen: React.FC<{ shots: Shot[]; w: number; fade?: number; dim?: number; pulse?: boolean }> = ({ shots, w, fade = 6, dim = 1, pulse = false }) => {
  const frame = useCurrentFrame();
  const list = [...shots].sort((a, b) => a.at - b.at);
  let i = 0;
  for (let k = 0; k < list.length; k++) if (frame >= list[k].at) i = k;
  const render = (sh: Shot, opacity: number, key: string) => {
    const end = recDur(sh.rec) - 0.08;
    const hold = Math.min(sh.hold ?? end, end);
    const start = Math.max(0, Math.min(sh.start, hold - 0.04));
    return (
      <div key={key} style={{ position: 'absolute', inset: 0, opacity }}>
        <Sequence from={sh.at} layout="none">
          {hasRec(sh.rec) ? (
            <ScreenClip src={`spo/rec/${sh.rec}/video.mp4`} width={w} viewport={[APP_W, APP_H]} startAt={start} showCursor={false} marks={sh.marks ?? []}
              camera={sh.zoom ?? [{ f: 0, zoom: 1, x: APP_W / 2, y: APP_H / 2 }]} playbackRate={sh.rate ?? 1} overlay={sh.overlay} holdAt={hold} markDim={dim} markPulse={pulse} />
          ) : (
            <Placeholder w={w} label={sh.rec} />
          )}
        </Sequence>
      </div>
    );
  };
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

// Móvil con la app de Spotify. `shots` encadena tomas; `rec`/`startAt` es el atajo para una sola.
export const AppPhone: React.FC<{
  rec?: string; startAt?: number; shots?: Shot[]; w?: number; cam?: PhoneKey[]; taps?: Tap[]; marks?: Mark[]; zoom?: CamKey[];
  image?: string; tone?: 'graphite' | 'silver' | 'sand'; overlay?: (t: number) => React.ReactNode; playbackRate?: number; placeholder?: string;
  dim?: number; motionBlur?: boolean; float?: [number, number]; pulse?: boolean; hold?: number;
}> = ({ rec, startAt = 0, shots, w = 430, cam = [{ f: 0, rx: 0, ry: 0, rz: 0, s: 1, x: 0, y: 0 }], taps = [], marks = [], zoom, image, tone = 'graphite', overlay, playbackRate = 1, placeholder, dim, motionBlur = false, float, pulse = false, hold }) => {
  const frame = useCurrentFrame();
  const k = (p: string, f = frame) => keyframes(f, cam, p, easeInOut);
  const scale = w / APP_W;
  const list: Shot[] | null = shots ?? (rec ? [{ rec, at: 0, start: startAt, rate: playbackRate, marks, zoom, overlay, hold }] : null);
  const speed = motionBlur ? Math.hypot(k('x') - k('x', frame - 1), k('y') - k('y', frame - 1)) + Math.abs(k('s') - k('s', frame - 1)) * 300 : 0;
  const blur = Math.max(0, Math.min(2.6, (speed - 18) * 0.05));
  const fEnv = float ? interpolate(frame, [float[0], float[0] + 24, float[1] - 24, float[1]], [0, 1, 1, 0], { ...clamp, easing: easeInOut }) : 0;
  const fy = fEnv * (Math.sin(frame / 38) * 4.5 + Math.sin(frame / 61) * 2);
  const frz = fEnv * Math.sin(frame / 47) * 0.35;
  return (
    <div style={{ transform: `translate(${k('x')}px, ${k('y') + fy}px) scale(${k('s')})`, willChange: 'transform', filter: blur > 0.2 ? `blur(${blur.toFixed(2)}px)` : undefined }}>
      <RealPhone w={w} ratio={APP_RATIO} rotX={k('rx')} rotY={k('ry')} rotZ={k('rz') + frz} tone={tone} screenBg="#000">
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

// Toma cuyo instante `clipT` (s) cae justo en el fotograma `f` de la escena; empieza `pre` fotogramas antes.
export const align = (rec: string, clipT: number, f: number, pre = 10, extra: Partial<Shot> = {}): Shot => {
  const at = Math.max(0, f - pre);
  return { rec, at, start: Math.max(0, clipT - (f - at) / 50), ...extra };
};
// Marca relativa a la toma `sh` entre los fotogramas de escena `from` y `to`.
export const markOn = (sh: Shot, from: number, to: number, x: number, y: number, w: number, h: number, r = 18): Mark => ({ from: from - sh.at, to: to - sh.at, x, y, w, h, r });

export type TagDef = { word: string; nth?: number; label: string; icon: React.ReactNode; out?: string; sub?: string };

// Escena tipo de la app: el móvil con las tomas reales a un lado y, al otro, las etiquetas que la voz va nombrando.
// La cámara se acerca a cada zona resaltada; entre dos escenas seguidas el móvil cruza por el centro y enlaza.
export const AppFeatureScene: React.FC<SceneProps & {
  id: string; title: string; kicker?: string; tags: TagDef[]; side?: 'left' | 'right'; shots: Shot[]; taps?: Tap[]; extra?: React.ReactNode;
  focus?: Focus[]; focusExtra?: Focus[]; keys?: number[]; titleSize?: number; tagSize?: number; tagGap?: number; overlay?: React.ReactNode; hi?: string;
}> = ({ lead, dur, enter = 'rise', exit = 'none', id, title, kicker, tags, side = 'right', shots, taps = [], extra, focus, focusExtra = [], keys = [], titleSize = 108, tagSize = 46, tagGap = 24, overlay, hi }) => {
  const frame = useCurrentFrame();
  const at = (w: string, n = 0) => lead + wf(id, w, n);
  const phoneLeft = side === 'right';
  const sgn = phoneLeft ? 1 : -1;
  const cx = phoneLeft ? 540 : 1380;
  const top = Math.round((1080 - PH.H) / 2);
  const focusList = focus ?? [...focusFromShots(shots, dur), ...focusExtra];
  const cam = buildPhoneCam({ dur, side: sgn, cx, top, focus: focusList, enter, exit });
  const tagFrames = tags.map((t) => at(t.word, t.nth ?? 0) - 3);
  const tIn = enter === 'glide' ? 7 : 3;
  const xOut = exit === 'glide' ? interpolate(frame, [dur - 12, dur - 1], [0, 1], { ...clamp, easing: easeInOut }) : 0;
  const zooms = zoomPeaks(cam, 2, dur - 2);
  return (
    <SpoStage>
      <AbsoluteFill>
        <PhoneHalo cam={cam} cx={cx} />
        <div style={{ position: 'absolute', top, left: cx - PH.W / 2 }}>
          <AppPhone shots={shots} w={PHONE_W} cam={cam} taps={taps} dim={0.72} motionBlur float={[0, dur]} pulse />
        </div>
        <div style={{ position: 'absolute', top: 0, height: 1080, left: phoneLeft ? 912 : 120, width: 900, display: 'flex', flexDirection: 'column', justifyContent: 'center',
          opacity: 1 - xOut, transform: `translateX(${xOut * 50 * (phoneLeft ? 1 : -1)}px)`, filter: xOut > 0.02 ? `blur(${(xOut * 6).toFixed(2)}px)` : undefined }}>
          {kicker && <Kicker at={tIn} text={kicker} />}
          <MaskTitle text={title} hi={hi} at={tIn + 3} size={titleSize} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: tagGap, marginTop: tagGap * 2.2 }}>
            {tags.map((t, i) => (
              <Chip key={t.label} at={tagFrames[i]} dimAt={tagFrames[i + 1]} out={t.out ? at(t.out) : undefined} icon={t.icon} label={t.label} sub={t.sub} size={tagSize} accent={SP_SOFT} reserve />
            ))}
          </div>
          {extra}
        </div>
        {overlay}
      </AbsoluteFill>
      {tagFrames.map((f, i) => <Sfx key={i} name="ui_pop" at={f + 1} volume={0.65} />)}
      {taps.map((t, i) => <Sfx key={`t${i}`} name="ui_tap" at={t.f} volume={0.55} />)}
      {zooms.map((f, i) => <Sfx key={`z${i}`} name="zoom_in" at={f} volume={0.45} />)}
      <Keystrokes text={'x'.repeat(keys.length)} times={keys} volume={0.6} seed={`${id}-keys`} />
    </SpoStage>
  );
};

// Contador de horas (la idea visual de esta reseña: 12 horas al mes). Un depósito redondeado con la cifra de horas que quedan;
// `left` va de 0 a 1. `dark`: con los colores de la app (gris casi negro y verde).
export const HoursMeter: React.FC<{ left: number; total?: number; w?: number; h?: number; fill?: string; label?: string; style?: React.CSSProperties; dark?: boolean }> = ({
  left, total = 12, w = 520, h = 64, fill = SP, label, style, dark = false,
}) => {
  const hrs = Math.max(0, Math.round(left * total));
  return (
    <div style={{ position: 'relative', width: w, height: h, borderRadius: h / 2, background: dark ? '#3A3A3A' : '#EFEFF3', overflow: 'hidden', ...style }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(Math.max(0, Math.min(1, left)) * 100).toFixed(2)}%`, borderRadius: h / 2, background: fill }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${h * 0.42}px`, fontFamily: font.sans, fontWeight: 700,
        fontSize: h * 0.46, color: dark ? '#fff' : color.ink, fontVariantNumeric: 'tabular-nums' }}>
        <span>{label ?? `${hrs} h`}</span>
        <span style={{ fontWeight: 500, opacity: 0.6 }}>/ {total} h</span>
      </div>
    </div>
  );
};

// Fila de bloques de una hora: `on` (0–n, admite decimales) se rellenan con `fill`; los demás quedan vacíos. `lost` (0–1)
// apaga los bloques llenos (las horas que no usas se pierden).
export const HourBlocks: React.FC<{ n?: number; on: number; w?: number; h?: number; gap?: number; fill?: string; off?: string; lost?: number; style?: React.CSSProperties; from?: number }> = ({
  n = 12, on, w = 760, h = 64, gap = 8, fill = SP, off = '#E9E9EE', lost = 0, style, from = 0,
}) => {
  const bw = (w - gap * (n - 1)) / n;
  return (
    <div style={{ display: 'flex', gap, width: w, height: h, ...style }}>
      {Array.from({ length: n }, (_, i) => {
        const p = Math.max(0, Math.min(1, on - i));
        const used = i < from;
        return (
          <div key={i} style={{ position: 'relative', width: bw, height: h, borderRadius: Math.min(14, bw * 0.3), background: off, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(p * 100).toFixed(2)}%`, background: used ? '#BDBDC4' : fill, opacity: 1 - 0.78 * lost }} />
          </div>
        );
      })}
    </div>
  );
};

// Ventana de navegador oscura (las páginas de Spotify son oscuras) con una captura fija de spotify.com y una cámara virtual,
// marcos y un cursor que se mueve solo. Coordenadas en píxeles CSS de la página capturada (1920×1080).
export const SpoWindow: React.FC<{ width: number; url: string; ry?: number; rx?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ width, url, ry = -4, rx = 2, children, style }) => {
  const frame = useCurrentFrame();
  const wob = Math.sin(frame / 40) * 0.6;
  return (
    <div style={{ perspective: 2600, ...style }}>
      <div style={{ transform: `rotateY(${ry + wob}deg) rotateX(${rx - wob * 0.4}deg)`, transformStyle: 'preserve-3d' }}>
        <BrowserWindow width={width} url={url} dark>{children}</BrowserWindow>
      </div>
    </div>
  );
};
export type CurKey = { f: number; x: number; y: number; click?: boolean };
// Trayectoria del cursor a partir de unos puntos clave (fotogramas de la toma): entre dos puntos, curva suave con frenada;
// `click` pulsa al llegar.
export const glideCursor = (keys: CurKey[], fps = 50): CursorPoint[] => {
  const out: CursorPoint[] = [];
  if (!keys.length) return out;
  out.push({ t: keys[0].f / fps, x: keys[0].x, y: keys[0].y, down: false });
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    const n = Math.max(2, b.f - a.f);
    const dx = b.x - a.x, dy = b.y - a.y;
    const dist = Math.hypot(dx, dy) || 1;
    const bend = Math.min(60, dist * 0.1);
    for (let k = 1; k <= n; k++) {
      const e = easeInOut(k / n);
      const arc = Math.sin(Math.PI * e) * bend;
      out.push({ t: (a.f + (k * (b.f - a.f)) / n) / fps, x: a.x + dx * e - (dy / dist) * arc, y: a.y + dy * e + (dx / dist) * arc, down: false });
    }
    if (b.click) {
      out.push({ t: b.f / fps + 0.001, x: b.x, y: b.y, down: true });
      out.push({ t: b.f / fps + 0.16, x: b.x, y: b.y, down: false });
    }
  }
  return out;
};
export const WebShot: React.FC<{ img: string; width: number; camera?: CamKey[]; marks?: Mark[]; cursor?: CurKey[]; dim?: number }> = ({ img, width, camera, marks = [], cursor = [], dim = 0.55 }) => (
  <ScreenClip image src={`spo/web/${img}.jpg`} width={width} camera={camera ?? [{ f: 0, zoom: 1, x: 960, y: 540 }]} marks={marks} cursor={glideCursor(cursor)} showCursor={cursor.length > 0} markDim={dim} />
);

export { Sfx };
