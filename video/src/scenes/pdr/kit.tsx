import React from 'react';
import { AbsoluteFill, Img, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, keyframes } from '../../lib/anim';
import { RealPhone, TapRipple } from '../../components/RealPhone';
import { Keystrokes, Sfx } from '../../components/Sfx';
import { Stage } from '../../components/Stage';
import { CamKey, Mark, ScreenClip } from '../../components/ScreenClip';
import pdrIndex from '../../../public/pdr/rec/index.json';
import {
  APP_H, APP_RATIO, APP_W, buildPhoneCam, Chip, Focus, focusFromShots, MaskTitle, PH, PhoneHalo, PhoneKey, PHONE_W, Shot, Tap, zoomPeaks,
} from '../nxr/kit';
import { Kicker } from '../nxr/App';
import { wf } from './timeline';
import type { SceneProps } from './registry';

// Piezas comunes con la reseña de Nextory (mismo sistema visual de SonorBooks).
export {
  APP_H, APP_RATIO, APP_W, BigTitle, Bumper, BUMP_IN, BUMP_LEN, BUMP_LOCK, buildPhoneCam, Burst, Chip, CountUp, countUpText, focusFromShots, GLIDE,
  LinkBadge, MaskTitle, PH, PhoneHalo, PHONE_W, Sheen, textWidth, zoomPeaks,
} from '../nxr/kit';
export type { Focus, PhoneKey, Shot, Tap } from '../nxr/kit';
export { Kicker } from '../nxr/App';

// Identidad de Podimo en el vídeo: el lila de sus botones (muestreado de la app) y un lila más hondo para texto.
export const PV = '#A89BED';
export const PV_DEEP = '#6E5BD9';
export const PV_SOFT = '#EEEAFE';

// Fondo v2 de la reseña de Podimo: el cálido de SonorBooks con un halo lila de Podimo que deriva por la esquina
// inferior izquierda y un grano finísimo que cambia cada dos fotogramas (rompe las bandas de los degradados al codificar).
// El grano va por debajo del contenido: no ensucia ni el móvil ni los textos.
export const PdrStage: React.FC<{ children?: React.ReactNode; still?: boolean }> = ({ children, still = false }) => {
  const frame = useCurrentFrame();
  const t = still ? 0 : frame / 50;
  const g = still ? 0 : Math.floor(frame / 2);
  const gx = Math.floor(random(`pdr-gx-${g}`) * 512);
  const gy = Math.floor(random(`pdr-gy-${g}`) * 512);
  return (
    <Stage tone="warm" still={still}>
      <div style={{ position: 'absolute', width: 1500, height: 1500, borderRadius: '50%', left: -700 + Math.sin(t * 0.13) * 120, bottom: -900 + Math.cos(t * 0.11) * 90,
        background: 'radial-gradient(circle, rgba(168,155,237,0.16) 0%, rgba(168,155,237,0.05) 38%, rgba(168,155,237,0) 62%)' }} />
      <div style={{ position: 'absolute', width: 900, height: 900, borderRadius: '50%', right: -260 + Math.cos(t * 0.17) * 80, top: -380 + Math.sin(t * 0.14) * 60,
        background: 'radial-gradient(circle, rgba(168,155,237,0.08) 0%, rgba(168,155,237,0) 60%)' }} />
      <AbsoluteFill style={{ backgroundImage: `url(${staticFile('pdr/img/grain.png')})`, backgroundSize: '512px 512px', backgroundPosition: `${gx}px ${gy}px`, opacity: 0.07, mixBlendMode: 'overlay', pointerEvents: 'none' }} />
      {children}
    </Stage>
  );
};

// Cifra de contador mecánico: cada dígito es una tira 0–9 que gira (`spins` vueltas) hasta su valor, el de la derecha
// primero, frenando con un rebote leve y con desenfoque vertical según la velocidad. El texto final da el tamaño y la
// línea base (va transparente debajo), así que se alinea con lo que tenga al lado como un texto normal.
export const odometerProgress = (frame: number, at: number, fps: number, dur = 30) =>
  spring({ frame: frame - at, fps, config: { damping: 15, stiffness: 120, mass: 1 }, durationInFrames: dur });
export const Odometer: React.FC<{
  text: string; at: number; dur?: number; size: number; color?: string; stagger?: number; spins?: number; style?: React.CSSProperties; from?: number;
}> = ({ text, at, dur = 30, size, color: c = color.ink, stagger = 3, spins = 1, style, from = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const uid = React.useId().replace(/:/g, '');
  const chars = Array.from(text);
  const digitIdx = chars.map((ch, i) => (/\d/.test(ch) ? i : -1)).filter((i) => i >= 0);
  return (
    <span style={{ display: 'inline-block', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums', fontSize: size, lineHeight: 1, ...style }}>
      {chars.map((ch, i) => {
        if (!/\d/.test(ch)) {
          const o = interpolate(frame, [at - 2, at + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return <span key={i} style={{ display: 'inline-block', color: c, opacity: o, transform: `translateY(${((1 - o) * 0.2).toFixed(3)}em)` }}>{ch}</span>;
        }
        const order = digitIdx.length - 1 - digitIdx.indexOf(i);
        const a = at + order * stagger;
        const target = spins * 10 + Number(ch);
        const p = odometerProgress(frame, a, fps, dur);
        const p1 = odometerProgress(frame - 1, a, fps, dur);
        const pos = from + (target - from) * p;
        const vel = Math.abs((target - from) * (p - p1)) * size;
        const blur = Math.min(size * 0.06, vel * 0.12);
        const shown = frame >= a - 1;
        return (
          <span key={i} style={{ display: 'inline-block', position: 'relative' }}>
            <span style={{ color: 'transparent' }}>{ch}</span>
            {shown && (
              <span style={{ position: 'absolute', left: -4, right: -4, top: 0, height: size, overflow: 'hidden',
                WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 16%, #000 84%, transparent 100%)', maskImage: 'linear-gradient(180deg, transparent 0%, #000 16%, #000 84%, transparent 100%)' }}>
                <svg width="0" height="0" style={{ position: 'absolute' }}><defs><filter id={`od${uid}${i}`} x="-10%" y="-50%" width="120%" height="200%"><feGaussianBlur stdDeviation={`0 ${blur.toFixed(2)}`} /></filter></defs></svg>
                <span style={{ position: 'absolute', left: 4, top: 0, display: 'block', color: c, transform: `translateY(${(-pos * size).toFixed(2)}px)`, filter: blur > 0.3 ? `url(#od${uid}${i})` : undefined }}>
                  {Array.from({ length: target + 2 }, (_, k) => (
                    <span key={k} style={{ display: 'block', height: size, lineHeight: `${size}px` }}>{k % 10}</span>
                  ))}
                </span>
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
};
// Lo que «enseña» un contador en cada fotograma (para ChangeTicks: un tic cada vez que pasa un número por la ventana).
export const odometerShown = (text: string, at: number, fps: number, f: number, dur = 30, stagger = 3, spins = 1) => {
  const chars = Array.from(text);
  const digitIdx = chars.map((ch, i) => (/\d/.test(ch) ? i : -1)).filter((i) => i >= 0);
  return digitIdx.map((i, k) => {
    const order = digitIdx.length - 1 - k;
    const target = spins * 10 + Number(chars[i]);
    return Math.round(target * odometerProgress(f, at + order * stagger, fps, dur)) % 10;
  }).join('');
};

// Barra de horas en tramos (cada tramo = 10 h): se llenan uno tras otro con un pequeño salto, desde `at`.
export const SegBar: React.FC<{ fill: number; total?: number; at: number; every?: number; h?: number; gap?: number; on?: string; off?: string; style?: React.CSSProperties }> = ({
  fill, total = 10, at, every = 3, h = 22, gap = 8, on = PV, off = '#EDEDED', style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: 'flex', gap, ...style }}>
      {Array.from({ length: total }, (_, i) => {
        const s = i < fill ? spring({ frame: frame - at - i * every, fps, config: { damping: 13, stiffness: 220 } }) : 0;
        return (
          <div key={i} style={{ flex: 1, height: h, borderRadius: h / 2, background: off, overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: h / 2, background: on, transform: `scaleX(${Math.min(1, s)})`, transformOrigin: 'left center',
              boxShadow: s > 0.02 ? `0 0 ${(14 * Math.max(0, 1 - Math.abs(s - 1) * 4)).toFixed(1)}px ${on}` : undefined }} />
          </div>
        );
      })}
    </div>
  );
};
// Fotogramas en que se llena cada tramo (para los tics).
export const segFrames = (fill: number, at: number, every = 3) => Array.from({ length: fill }, (_, i) => at + i * every + 3);

export const PodimoLogo: React.FC<{ width: number; white?: boolean; style?: React.CSSProperties }> = ({ width, white = false, style }) => (
  <Img src={staticFile(white ? 'pdr/img/podimo_white.svg' : 'pdr/img/podimo.svg')} style={{ width, height: (width * 570) / 2000, display: 'block', ...style }} />
);

// Pantalla de la app grabada en BlueStacks (OBS, 664×1440 a 50 fps): tomas en public/pdr/rec (tools/pdr_clips.py).
export const hasRec = (name: string) => Boolean((pdrIndex as Record<string, unknown>)[name]);

const Placeholder: React.FC<{ w: number; label: string }> = ({ w, label }) => (
  <div style={{ width: w, height: w * APP_RATIO, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14 }}>
    <PodimoLogo width={w * 0.5} white />
    <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: w * 0.045, color: 'rgba(255,255,255,0.75)', textAlign: 'center', padding: '0 10%' }}>{label}</div>
  </div>
);

// Pantalla con varias tomas encadenadas (fundido corto entre una y otra).
export const ShotsScreen: React.FC<{ shots: Shot[]; w: number; fade?: number; dim?: number; pulse?: boolean }> = ({ shots, w, fade = 6, dim = 1, pulse = false }) => {
  const frame = useCurrentFrame();
  const list = [...shots].sort((a, b) => a.at - b.at);
  let i = 0;
  for (let k = 0; k < list.length; k++) if (frame >= list[k].at) i = k;
  const render = (sh: Shot, opacity: number, key: string) => (
    <div key={key} style={{ position: 'absolute', inset: 0, opacity }}>
      <Sequence from={sh.at} layout="none">
        {hasRec(sh.rec) ? (
          <ScreenClip src={`pdr/rec/${sh.rec}/video.mp4`} width={w} viewport={[APP_W, APP_H]} startAt={sh.start} showCursor={false} marks={sh.marks ?? []}
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

// Móvil con la app de Podimo. `shots` encadena tomas; `rec`/`startAt` es el atajo para una sola.
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
  focus?: Focus[]; focusExtra?: Focus[]; keys?: number[]; titleSize?: number; tagSize?: number; tagGap?: number;
}> = ({ lead, dur, enter = 'rise', exit = 'none', id, title, kicker, tags, side = 'right', shots, taps = [], extra, focus, focusExtra = [], keys = [], titleSize = 108, tagSize = 46, tagGap = 24 }) => {
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
    <PdrStage>
      <AbsoluteFill>
        <PhoneHalo cam={cam} cx={cx} />
        <div style={{ position: 'absolute', top, left: cx - PH.W / 2 }}>
          <AppPhone shots={shots} w={PHONE_W} cam={cam} taps={taps} dim={0.72} motionBlur float={[0, dur]} pulse />
        </div>
        <div style={{ position: 'absolute', top: 0, height: 1080, left: phoneLeft ? 912 : 120, width: 900, display: 'flex', flexDirection: 'column', justifyContent: 'center',
          opacity: 1 - xOut, transform: `translateX(${xOut * 50 * (phoneLeft ? 1 : -1)}px)`, filter: xOut > 0.02 ? `blur(${(xOut * 6).toFixed(2)}px)` : undefined }}>
          {kicker && <Kicker at={tIn} text={kicker} />}
          <MaskTitle text={title} at={tIn + 3} size={titleSize} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: tagGap, marginTop: tagGap * 2.2 }}>
            {tags.map((t, i) => (
              <Chip key={t.label} at={tagFrames[i]} dimAt={tagFrames[i + 1]} out={t.out ? at(t.out) : undefined} icon={t.icon} label={t.label} sub={t.sub} size={tagSize} reserve />
            ))}
          </div>
          {extra}
        </div>
      </AbsoluteFill>
      {tagFrames.map((f, i) => <Sfx key={i} name="ui_pop" at={f + 1} volume={0.65} />)}
      {taps.map((t, i) => <Sfx key={`t${i}`} name="ui_tap" at={t.f} volume={0.55} />)}
      {zooms.map((f, i) => <Sfx key={`z${i}`} name="zoom_in" at={f} volume={0.45} />)}
      <Keystrokes text={'x'.repeat(keys.length)} times={keys} volume={0.6} seed={`${id}-keys`} />
    </PdrStage>
  );
};

// Sello «Solo en Podimo» (como el de las portadas de la app), en blanco sobre negro.
export const SoloBadge: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 40, style }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.32, padding: `${size * 0.32}px ${size * 0.6}px`, borderRadius: 999, background: color.ink, color: '#fff',
    fontFamily: font.sans, fontWeight: 500, fontSize: size * 0.8, whiteSpace: 'nowrap', ...style }}>
    Solo en <PodimoLogo width={size * 2.6} white style={{ marginTop: size * 0.06 }} />
  </div>
);
