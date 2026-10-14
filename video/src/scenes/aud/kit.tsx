import React from 'react';
import { AbsoluteFill, Img, interpolate, random, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { color, font } from '../../brand/tokens';
import { clamp, easeInOut, keyframes } from '../../lib/anim';
import { RealPhone, TapRipple } from '../../components/RealPhone';
import { Keystrokes, Sfx } from '../../components/Sfx';
import { Stage } from '../../components/Stage';
import { CamKey, Mark, ScreenClip } from '../../components/ScreenClip';
import audIndex from '../../../public/aud/rec/index.json';
import {
  APP_H, APP_RATIO, APP_W, buildPhoneCam, Chip, Focus, focusFromShots, MaskTitle, PH, PhoneHalo, PhoneKey, PHONE_W, Shot, Tap, zoomPeaks,
} from '../nxr/kit';
import { Kicker } from '../nxr/App';
import { wf } from './timeline';
import type { SceneProps } from './registry';

// Piezas comunes con las reseñas de Nextory y Podimo (mismo sistema visual de SonorBooks).
export {
  APP_H, APP_RATIO, APP_W, BigTitle, Bumper, BUMP_IN, BUMP_LEN, BUMP_LOCK, buildPhoneCam, Burst, Chip, CountUp, countUpText, focusFromShots, GLIDE,
  LinkBadge, MaskTitle, PH, PhoneHalo, PHONE_W, Sheen, textWidth, zoomPeaks,
} from '../nxr/kit';
export type { Focus, PhoneKey, Shot, Tap } from '../nxr/kit';
export { Kicker } from '../nxr/App';
export { Odometer, odometerProgress, odometerShown, SegBar, segFrames } from '../pdr/kit';

// Identidad de Audible en el vídeo: el naranja de su logotipo (#F7991C, del SVG de audible.es), un naranja más hondo para
// texto sobre claro, un crema muy suave, el naranja intenso de su banda de ofertas (#FF6200), el ámbar de sus botones (#FFB333)
// y el azul noche del fondo de su página de prueba (#05131F).
export const AU = '#F7991C';
export const AU_DEEP = '#C96A00';
export const AU_SOFT = '#FFF1DC';
export const AU_HOT = '#FF6200';
export const AU_AMBER = '#FFB333';
export const AU_NAVY = '#0B1A26';

// Fondo de la reseña de Audible: el cálido de SonorBooks con un halo naranja de Audible que deriva por la esquina inferior
// izquierda, otro ámbar más tenue arriba a la derecha y el mismo grano finísimo de las otras reseñas (rompe las bandas).
export const AudStage: React.FC<{ children?: React.ReactNode; still?: boolean }> = ({ children, still = false }) => {
  const frame = useCurrentFrame();
  const t = still ? 0 : frame / 50;
  const g = still ? 0 : Math.floor(frame / 2);
  const gx = Math.floor(random(`aud-gx-${g}`) * 512);
  const gy = Math.floor(random(`aud-gy-${g}`) * 512);
  return (
    <Stage tone="warm" still={still}>
      <div style={{ position: 'absolute', width: 1500, height: 1500, borderRadius: '50%', left: -720 + Math.sin(t * 0.12) * 120, bottom: -920 + Math.cos(t * 0.1) * 90,
        background: 'radial-gradient(circle, rgba(247,153,28,0.15) 0%, rgba(247,153,28,0.05) 38%, rgba(247,153,28,0) 62%)' }} />
      <div style={{ position: 'absolute', width: 900, height: 900, borderRadius: '50%', right: -280 + Math.cos(t * 0.16) * 80, top: -400 + Math.sin(t * 0.13) * 60,
        background: 'radial-gradient(circle, rgba(255,98,0,0.07) 0%, rgba(255,98,0,0) 60%)' }} />
      <AbsoluteFill style={{ backgroundImage: `url(${staticFile('pdr/img/grain.png')})`, backgroundSize: '512px 512px', backgroundPosition: `${gx}px ${gy}px`, opacity: 0.07, mixBlendMode: 'overlay', pointerEvents: 'none' }} />
      {children}
    </Stage>
  );
};

// Logotipo de Audible («audible, una empresa de amazon»), el SVG de la cabecera de audible.es; y sus arcos solos.
export const AudibleLogo: React.FC<{ width: number; white?: boolean; style?: React.CSSProperties }> = ({ width, white = false, style }) => (
  <Img src={staticFile(white ? 'aud/img/audible_white.svg' : 'aud/img/audible.svg')} style={{ width, height: (width * 229) / 583, display: 'block', ...style }} />
);
export const AudibleMark: React.FC<{ size: number; white?: boolean; style?: React.CSSProperties }> = ({ size, white = false, style }) => (
  <Img src={staticFile(white ? 'aud/img/audible_mark_white.svg' : 'aud/img/audible_mark.svg')} style={{ width: size, height: (size * 108) / 172, display: 'block', ...style }} />
);

// Pantalla de la app grabada en BlueStacks (OBS, 664×1440 a 50 fps): tomas en public/aud/rec (tools/aud_clips.py).
export const hasRec = (name: string) => Boolean((audIndex as Record<string, unknown>)[name]);

const Placeholder: React.FC<{ w: number; label: string }> = ({ w, label }) => (
  <div style={{ width: w, height: w * APP_RATIO, background: '#101010', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14 }}>
    <AudibleLogo width={w * 0.5} white />
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
          <ScreenClip src={`aud/rec/${sh.rec}/video.mp4`} width={w} viewport={[APP_W, APP_H]} startAt={sh.start} showCursor={false} marks={sh.marks ?? []}
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

// Móvil con la app de Audible. `shots` encadena tomas; `rec`/`startAt` es el atajo para una sola.
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
// Coordenadas del clic en la pantalla del ordenador (1456×819, BlueStacks a pantalla completa) → píxeles de la grabación.
export const tapXY = (cx: number, cy: number) => ({ x: Math.round(cx * 1.7582 - 948), y: Math.round(cy * 1.7582) });

export type TagDef = { word: string; nth?: number; label: string; icon: React.ReactNode; out?: string; sub?: string };

// Escena tipo de la app: el móvil con las tomas reales a un lado y, al otro, las etiquetas que la voz va nombrando.
// La cámara se acerca a cada zona resaltada; entre dos escenas seguidas el móvil cruza por el centro y enlaza.
export const AppFeatureScene: React.FC<SceneProps & {
  id: string; title: string; kicker?: string; tags: TagDef[]; side?: 'left' | 'right'; shots: Shot[]; taps?: Tap[]; extra?: React.ReactNode;
  focus?: Focus[]; focusExtra?: Focus[]; keys?: number[]; titleSize?: number; tagSize?: number; tagGap?: number; overlay?: React.ReactNode;
}> = ({ lead, dur, enter = 'rise', exit = 'none', id, title, kicker, tags, side = 'right', shots, taps = [], extra, focus, focusExtra = [], keys = [], titleSize = 108, tagSize = 46, tagGap = 24, overlay }) => {
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
    <AudStage>
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
        {overlay}
      </AbsoluteFill>
      {tagFrames.map((f, i) => <Sfx key={i} name="ui_pop" at={f + 1} volume={0.65} />)}
      {taps.map((t, i) => <Sfx key={`t${i}`} name="ui_tap" at={t.f} volume={0.55} />)}
      {zooms.map((f, i) => <Sfx key={`z${i}`} name="zoom_in" at={f} volume={0.45} />)}
      <Keystrokes text={'x'.repeat(keys.length)} times={keys} volume={0.6} seed={`${id}-keys`} />
    </AudStage>
  );
};

// Píldora «audible ORIGINAL» (como el sello de las portadas de sus producciones propias): negra, con los arcos naranjas.
export const OriginalBadge: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 40, style }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.34, padding: `${size * 0.3}px ${size * 0.62}px ${size * 0.3}px ${size * 0.44}px`, borderRadius: 999, background: AU_NAVY, color: '#fff',
    fontFamily: font.sans, fontWeight: 700, fontSize: size * 0.78, whiteSpace: 'nowrap', ...style }}>
    <AudibleMark size={size * 0.9} /> <span>audible <span style={{ fontWeight: 500, letterSpacing: size * 0.04 }}>ORIGINAL</span></span>
  </div>
);
