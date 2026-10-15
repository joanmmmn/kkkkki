import React from 'react';
import { AbsoluteFill, Img, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut, keyframes } from '../../lib/anim';
import { RealPhone, TapRipple } from '../../components/RealPhone';
import { Stage } from '../../components/Stage';
import { CamKey, Mark, ScreenClip } from '../../components/ScreenClip';
import { Keystrokes, Sfx } from '../../components/Sfx';
import { APP_H, APP_RATIO, APP_W, buildPhoneCam, Chip, Focus, MaskTitle, PH, PhoneHalo, PhoneKey, PHONE_W, Tap, zoomPeaks } from '../nxr/kit';
import audIndex from '../../../public/aud/rec/index.json';
import strIndex from '../../../public/str/rec/index.json';
import pdrIndex from '../../../public/pdr/rec/index.json';
import nxrIndex from '../../../public/nxr/rec/index.json';
import bkbIndex from '../../../public/bkb/rec/index.json';
import abcIndex from '../../../public/abc/rec/index.json';
import { wf } from './timeline';

export { APP_H, APP_RATIO, APP_W, BigTitle, Bumper, BUMP_IN, BUMP_LEN, BUMP_LOCK, Burst, Chip, CountUp, LinkBadge, MaskTitle, PH, PHONE_W, Sheen, textWidth } from '../nxr/kit';
export type { Focus, PhoneKey, Tap } from '../nxr/kit';
export { Kicker } from '../nxr/App';
export { Odometer, SegBar, segFrames } from '../pdr/kit';

export type SceneProps = { lead: number; dur: number; enter?: 'rise' | 'glide'; exit?: 'glide' | 'none' };

// ——— Las once plataformas ———
// Colores de cada marca (los mismos que en su reseña) y la carpeta de sus grabaciones.
export type PKey = 'audible' | 'storytel' | 'podimo' | 'nextory' | 'bookbeat' | 'spotify' | 'audiobooks' | 'elevenreader' | 'ebiblio' | 'librivox' | 'elt';
export const PLAT: Record<PKey, { name: string; c: string; deep: string; soft: string; dir?: string }> = {
  audible: { name: 'Audible', c: '#F7991C', deep: '#C96A00', soft: '#FFF1DC', dir: 'aud' },
  storytel: { name: 'Storytel', c: '#FF501C', deep: '#D63E0F', soft: '#FFEDE5', dir: 'str' },
  podimo: { name: 'Podimo', c: '#A89BED', deep: '#6E5BD9', soft: '#EEEAFE', dir: 'pdr' },
  nextory: { name: 'Nextory', c: '#FC5978', deep: '#D2335A', soft: '#FFE7ED', dir: 'nxr' },
  bookbeat: { name: 'BookBeat', c: '#CD96FF', deep: '#7B3FC4', soft: '#F5E6FF', dir: 'bkb' },
  spotify: { name: 'Spotify', c: '#1ED760', deep: '#11843F', soft: '#E2F8EA' },
  audiobooks: { name: 'Audiobooks.com', c: '#FF501C', deep: '#D23A0B', soft: '#FFEDE6', dir: 'abc' },
  elevenreader: { name: 'ElevenReader', c: '#1C1C1C', deep: '#000000', soft: '#EFEFEF' },
  ebiblio: { name: 'eBiblio', c: '#E95D0E', deep: '#C85A3C', soft: '#FBEDE4' },
  librivox: { name: 'LibriVox', c: '#8D5F1E', deep: '#5E3E12', soft: '#F6EFE2' },
  elt: { name: 'El Libro Total', c: '#1A8FE3', deep: '#0E1A2B', soft: '#E3F1FC' },
};
const INDEX: Record<string, Record<string, unknown>> = { aud: audIndex, str: strIndex, pdr: pdrIndex, nxr: nxrIndex, bkb: bkbIndex, abc: abcIndex };

// Logotipo de cada plataforma (el de su cabecera; los mismos archivos que sus reseñas). `white` para fondos oscuros.
export const PlatLogo: React.FC<{ k: PKey; width: number; white?: boolean; style?: React.CSSProperties }> = ({ k, width, white = false, style }) => {
  const img = (src: string, ratio: number, extra: React.CSSProperties = {}) => (
    <Img src={staticFile(src)} style={{ width, height: width * ratio, display: 'block', ...extra, ...style }} />
  );
  switch (k) {
    case 'audible': return img(white ? 'aud/img/audible_white.svg' : 'aud/img/audible.svg', 229 / 583);
    case 'storytel': return img(white ? 'str/img/storytel_white.svg' : 'str/img/storytel.svg', 24 / 115);
    case 'podimo': return img(white ? 'pdr/img/podimo_white.svg' : 'pdr/img/podimo.svg', 570 / 2000);
    case 'nextory': return img('nx/img/nextory.svg', 51 / 200, white ? { filter: 'brightness(0) invert(1)' } : {});
    case 'bookbeat': return img(white ? 'bkb/img/bookbeat_white.svg' : 'bkb/img/bookbeat.svg', 143.2 / 920.2);
    case 'spotify': return img(white ? 'mp/img/spotify_white.svg' : 'mp/img/spotify_black.svg', 225.25 / 823.46);
    case 'audiobooks': return img(white ? 'abc/img/audiobooks_logo_white@4x.png' : 'abc/img/audiobooks_logo@4x.png', 516 / 2120);
    case 'elevenreader': return img('er/img/elevenreader.png', 56 / 521, white ? { filter: 'brightness(0) invert(1)' } : {});
    case 'ebiblio': return img(white ? 'eb/img/ebiblio_logo_white.png' : 'eb/img/ebiblio_logo.png', 240 / 492);
    case 'librivox': return img('lv/img/librivox_logo.png', 162 / 562, white ? { filter: 'brightness(0) invert(1)' } : {});
    case 'elt': return img(white ? 'elt/img/elt_logo.png' : 'elt/img/elt_logo_navy.png', 156 / 324, white ? {} : { mixBlendMode: 'multiply' });
  }
};

// «Icono de app» de cada plataforma: el logotipo en blanco sobre su color (o en negro sobre blanco), en un cuadrado redondeado.
export const PlatTile: React.FC<{ k: PKey; size: number; style?: React.CSSProperties; flat?: boolean }> = ({ k, size, style, flat = false }) => {
  const p = PLAT[k];
  const light = k === 'spotify' || k === 'bookbeat' || k === 'podimo';
  const bg = k === 'elevenreader' ? '#111' : k === 'elt' ? p.deep : k === 'librivox' ? '#FFFDF7' : k === 'ebiblio' ? '#FFFFFF' : k === 'spotify' ? '#121212' : p.c;
  const logoW = size * ({ audible: 0.8, storytel: 0.8, podimo: 0.76, nextory: 0.74, bookbeat: 0.82, spotify: 0.78, audiobooks: 0.86, elevenreader: 0.84, ebiblio: 0.8, librivox: 0.82, elt: 0.74 } as Record<PKey, number>)[k];
  const white = !(k === 'librivox' || k === 'ebiblio' || (light && k !== 'spotify'));
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.23, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden',
      boxShadow: flat ? undefined : '0 18px 40px rgba(16,16,16,0.16), inset 0 0 0 1px rgba(16,16,16,0.06)', ...style }}>
      <PlatLogo k={k} width={logoW} white={white} />
    </div>
  );
};

// Fondo de las escenas: el cálido de SonorBooks con un halo del color de la plataforma (si hay) y grano finísimo.
export const MpStage: React.FC<{ children?: React.ReactNode; tint?: string; still?: boolean; tone?: 'warm' | 'night' }> = ({ children, tint, still = false, tone = 'warm' }) => {
  const frame = useCurrentFrame();
  const t = still ? 0 : frame / 50;
  const g = still ? 0 : Math.floor(frame / 2);
  const gx = Math.floor(random(`mp-gx-${g}`) * 512);
  const gy = Math.floor(random(`mp-gy-${g}`) * 512);
  const rgba = (hex: string, a: number) => {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  };
  return (
    <Stage tone={tone} still={still}>
      {tint && (
        <>
          <div style={{ position: 'absolute', width: 1500, height: 1500, borderRadius: '50%', left: -720 + Math.sin(t * 0.12) * 120, bottom: -920 + Math.cos(t * 0.1) * 90,
            background: `radial-gradient(circle, ${rgba(tint, 0.14)} 0%, ${rgba(tint, 0.05)} 38%, ${rgba(tint, 0)} 62%)` }} />
          <div style={{ position: 'absolute', width: 900, height: 900, borderRadius: '50%', right: -280 + Math.cos(t * 0.16) * 80, top: -400 + Math.sin(t * 0.13) * 60,
            background: `radial-gradient(circle, ${rgba(tint, 0.08)} 0%, ${rgba(tint, 0)} 60%)` }} />
        </>
      )}
      <AbsoluteFill style={{ backgroundImage: `url(${staticFile('pdr/img/grain.png')})`, backgroundSize: '512px 512px', backgroundPosition: `${gx}px ${gy}px`, opacity: 0.07, mixBlendMode: 'overlay', pointerEvents: 'none' }} />
      {children}
    </Stage>
  );
};

// ——— Móvil con las grabaciones de cualquier reseña ———
// Toma: grabación `rec` de la carpeta `dir` (aud, str, pdr, nxr, bkb, abc) que empieza en el segundo `start` en el fotograma `at`.
export type MShot = { dir: string; rec: string; at: number; start: number; rate?: number; hold?: number; fade?: number; marks?: Mark[]; zoom?: CamKey[]; overlay?: (t: number) => React.ReactNode };
const hasRec = (dir: string, rec: string) => Boolean(INDEX[dir]?.[rec]);

export const MShotsScreen: React.FC<{ shots: MShot[]; w: number; fade?: number; dim?: number; pulse?: boolean }> = ({ shots, w, fade = 6, dim = 1, pulse = false }) => {
  const frame = useCurrentFrame();
  const list = [...shots].sort((a, b) => a.at - b.at);
  let i = 0;
  for (let k = 0; k < list.length; k++) if (frame >= list[k].at) i = k;
  const render = (sh: MShot, opacity: number, key: string) => (
    <div key={key} style={{ position: 'absolute', inset: 0, opacity }}>
      <Sequence from={sh.at} layout="none">
        {hasRec(sh.dir, sh.rec) ? (
          <ScreenClip src={`${sh.dir}/rec/${sh.rec}/video.mp4`} width={w} viewport={[APP_W, APP_H]} startAt={sh.start} showCursor={false} marks={sh.marks ?? []}
            camera={sh.zoom ?? [{ f: 0, zoom: 1, x: APP_W / 2, y: APP_H / 2 }]} playbackRate={sh.rate ?? 1} overlay={sh.overlay} holdAt={sh.hold} markDim={dim} markPulse={pulse} />
        ) : (
          <div style={{ width: w, height: w * APP_RATIO, background: '#222', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans }}>{sh.dir}/{sh.rec}</div>
        )}
      </Sequence>
    </div>
  );
  if (!list.length) return null;
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

export const MPhone: React.FC<{
  shots: MShot[]; w?: number; cam?: PhoneKey[]; taps?: Tap[]; tone?: 'graphite' | 'silver' | 'sand'; dim?: number; motionBlur?: boolean; float?: [number, number]; pulse?: boolean; screenBg?: string;
}> = ({ shots, w = 430, cam = [{ f: 0, rx: 0, ry: 0, rz: 0, s: 1, x: 0, y: 0 }], taps = [], tone = 'graphite', dim, motionBlur = false, float, pulse = false, screenBg = '#000' }) => {
  const frame = useCurrentFrame();
  const k = (p: string, f = frame) => keyframes(f, cam, p, easeInOut);
  const scale = w / APP_W;
  const speed = motionBlur ? Math.hypot(k('x') - k('x', frame - 1), k('y') - k('y', frame - 1)) + Math.abs(k('s') - k('s', frame - 1)) * 300 : 0;
  const blur = Math.max(0, Math.min(2.6, (speed - 18) * 0.05));
  const fEnv = float ? interpolate(frame, [float[0], float[0] + 24, float[1] - 24, float[1]], [0, 1, 1, 0], { ...clamp, easing: easeInOut }) : 0;
  const fy = fEnv * (Math.sin(frame / 38) * 4.5 + Math.sin(frame / 61) * 2);
  const frz = fEnv * Math.sin(frame / 47) * 0.35;
  return (
    <div style={{ transform: `translate(${k('x')}px, ${k('y') + fy}px) scale(${k('s')})`, willChange: 'transform', filter: blur > 0.2 ? `blur(${blur.toFixed(2)}px)` : undefined }}>
      <RealPhone w={w} ratio={APP_RATIO} rotX={k('rx')} rotY={k('ry')} rotZ={k('rz') + frz} tone={tone} screenBg={screenBg}>
        <MShotsScreen shots={shots} w={w} dim={dim} pulse={pulse} />
        {taps.map((t, i) => <TapRipple key={i} x={t.x * scale} y={t.y * scale} frame={frame} at={t.f} size={w * 0.15} />)}
      </RealPhone>
    </div>
  );
};

// Toma cuyo instante `clipT` (s) cae justo en el fotograma `f` de la escena; empieza `pre` fotogramas antes.
export const align = (dir: string, rec: string, clipT: number, f: number, pre = 10, extra: Partial<MShot> = {}): MShot => {
  const at = Math.max(0, f - pre);
  return { dir, rec, at, start: Math.max(0, clipT - (f - at) / 50), ...extra };
};
// Marca relativa a la toma `sh` entre los fotogramas de escena `from` y `to` (px de la grabación, 664×1440).
export const markOn = (sh: { at: number }, from: number, to: number, x: number, y: number, w: number, h: number, r = 18): Mark => ({ from: from - sh.at, to: to - sh.at, x, y, w, h, r });
export const focusFrom = (shots: MShot[], dur: number): Focus[] => {
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

// ——— Etiquetas de la ficha: lo mejor, el truco y el «ojo» ———
export type Tone = 'best' | 'trick' | 'warn' | 'info' | 'price';
const TONE: Record<Tone, { bg: string; fg: string }> = {
  best: { bg: color.yellow, fg: color.ink },
  trick: { bg: '#1F9D55', fg: '#fff' },
  warn: { bg: '#E5484D', fg: '#fff' },
  info: { bg: '#F1F1F1', fg: color.ink },
  price: { bg: color.ink, fg: '#fff' },
};
export const ToneIcon: React.FC<{ tone: Tone; size: number }> = ({ tone, size }) => {
  const c = TONE[tone].fg;
  const s = size * 0.62;
  if (tone === 'best') return <svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 3.2l2.6 5.5 6 .8-4.4 4.1 1.1 5.9L12 16.6l-5.3 2.9 1.1-5.9L3.4 9.5l6-.8z" fill={c} /></svg>;
  if (tone === 'trick') return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z" /></svg>;
  if (tone === 'warn') return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2.4} strokeLinecap="round"><path d="M12 6v8M12 18.2v.1" /></svg>;
  if (tone === 'price') return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M17 6.5A6.5 6.5 0 1 0 17 17.5M4 10h9M4 14h9" /></svg>;
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2.2} strokeLinecap="round"><path d="M12 11v6M12 7.2v.1" /></svg>;
};
export const TONE_LABEL: Record<Tone, string> = { best: 'Lo mejor', trick: 'Truco', warn: 'Ojo', info: '', price: '' };

export type FichaRow = { word: string; nth?: number; tone: Tone; label: string; sub?: string; out?: string };

// Escena de plataforma: el móvil con su app real a un lado y, al otro, su «ficha»: icono, nombre, modelo, título y las
// etiquetas que la voz va nombrando (lo mejor en amarillo, el truco en verde, el ojo en rojo).
export const PlatformScene: React.FC<SceneProps & {
  id: string; k: PKey; title: string; hi?: string | string[]; model?: string; rows: FichaRow[]; side?: 'left' | 'right'; shots: MShot[]; taps?: Tap[];
  focus?: Focus[]; focusExtra?: Focus[]; titleSize?: number; tagSize?: number; tagGap?: number; overlay?: React.ReactNode; extra?: React.ReactNode; keys?: number[];
  headerAt?: number; noHeader?: boolean;
}> = ({ lead, dur, enter = 'rise', exit = 'none', id, k, title, hi, model, rows, side = 'right', shots, taps = [], focus, focusExtra = [], titleSize = 96, tagSize = 40, tagGap = 18, overlay, extra, keys = [], headerAt, noHeader = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (w: string, n = 0) => lead + wf(id, w, n);
  const phoneLeft = side === 'right';
  const sgn = phoneLeft ? 1 : -1;
  const cx = phoneLeft ? 560 : 1360;
  const top = Math.round((1080 - PH.H) / 2);
  const focusList = focus ?? [...focusFrom(shots, dur), ...focusExtra];
  const cam = buildPhoneCam({ dur, side: sgn, cx, top, focus: focusList, enter, exit });
  const rowFrames = rows.map((r) => at(r.word, r.nth ?? 0) - 3);
  const tIn = enter === 'glide' ? 7 : 3;
  const hAt = headerAt ?? tIn;
  const xOut = exit === 'glide' ? interpolate(frame, [dur - 12, dur - 1], [0, 1], { ...clamp, easing: easeInOut }) : 0;
  const zooms = zoomPeaks(cam, 2, dur - 2);
  const hp = spring({ frame: frame - hAt, fps, config: { damping: 15, stiffness: 160 } });
  const p = PLAT[k];
  return (
    <MpStage tint={p.c}>
      <AbsoluteFill>
        <PhoneHalo cam={cam} cx={cx} strength={0.8} />
        <div style={{ position: 'absolute', top, left: cx - PH.W / 2 }}>
          <MPhone shots={shots} w={PHONE_W} cam={cam} taps={taps} dim={0.72} motionBlur float={[0, dur]} pulse />
        </div>
        <div style={{ position: 'absolute', top: 0, height: 1080, left: phoneLeft ? 940 : 130, width: 860, display: 'flex', flexDirection: 'column', justifyContent: 'center',
          opacity: 1 - xOut, transform: `translateX(${xOut * 50 * (phoneLeft ? 1 : -1)}px)`, filter: xOut > 0.02 ? `blur(${(xOut * 6).toFixed(2)}px)` : undefined }}>
          {!noHeader && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginBottom: 26, opacity: hp, transform: `translateY(${(1 - hp) * 24}px)` }}>
              <PlatTile k={k} size={84} style={{ transform: `scale(${0.8 + 0.2 * hp}) rotate(${(1 - hp) * -12}deg)` }} />
              {model && (
                <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 26, letterSpacing: 4, textTransform: 'uppercase', color: color.muted }}>{model}</div>
              )}
            </div>
          )}
          <MaskTitle text={title} hi={hi} at={hAt + 4} size={titleSize} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: tagGap, marginTop: tagGap * 2 }}>
            {rows.map((r, i) => (
              <ToneChip key={r.label} at={rowFrames[i]} dimAt={rowFrames[i + 1]} out={r.out ? at(r.out) : undefined} tone={r.tone} label={r.label} sub={r.sub} size={tagSize} />
            ))}
          </div>
          {extra}
        </div>
        {overlay}
      </AbsoluteFill>
      <Sfx name="ui_pop" at={hAt + 1} volume={0.5} />
      {rowFrames.map((f, i) => <Sfx key={i} name={rows[i].tone === 'warn' ? 'tick_soft' : 'ui_pop'} at={f + 1} volume={0.65} />)}
      {taps.map((t, i) => <Sfx key={`t${i}`} name="ui_tap" at={t.f} volume={0.55} />)}
      {zooms.map((f, i) => <Sfx key={`z${i}`} name="zoom_in" at={f} volume={0.45} />)}
      <Keystrokes text={'x'.repeat(keys.length)} times={keys} volume={0.6} seed={`${id}-keys`} />
    </MpStage>
  );
};

// Etiqueta con tono: el icono va en un círculo del color del tono y, encima del texto, una palabra pequeña («Lo mejor», «Truco», «Ojo»).
export const ToneChip: React.FC<{ at: number; tone: Tone; label: string; sub?: string; dimAt?: number; out?: number; size?: number; reserve?: boolean; style?: React.CSSProperties }> = ({
  at, tone, label, sub, dimAt, out, size = 40, reserve = true, style,
}) => (
  <Chip at={at} dimAt={dimAt} out={out} size={size} reserve={reserve} label={label} sub={sub ?? (TONE_LABEL[tone] || undefined)} accent={TONE[tone].bg}
    icon={<ToneIcon tone={tone} size={size * 1.45} />} style={style} />
);

// ——— Navegador con una página grabada o una captura ———
// `src`: vídeo (recording de tools/record.mjs, 3840×2160) o imagen. `camera`: acercamientos (px CSS del viewport 1920×1080).
export const WebPane: React.FC<{ src: string; image?: boolean; width: number; url: string; startAt?: number; camera?: CamKey[]; marks?: Mark[]; holdAt?: number; rate?: number; viewport?: [number, number]; style?: React.CSSProperties }> = ({
  src, image = false, width, url, startAt = 0, camera, marks = [], holdAt, rate = 1, viewport = [1920, 1080], style,
}) => {
  const bar = Math.round(width * 0.03);
  const height = (width * viewport[1]) / viewport[0];
  return (
    <div style={{ width, borderRadius: width * 0.014, overflow: 'hidden', background: '#F6F6F7', boxShadow: '0 60px 120px rgba(16,16,16,0.22), 0 18px 40px rgba(16,16,16,0.12), 0 0 0 1px rgba(16,16,16,0.06)', ...style }}>
      <div style={{ height: bar, display: 'flex', alignItems: 'center', padding: `0 ${bar * 0.6}px`, gap: bar * 0.32, position: 'relative' }}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <div key={c} style={{ width: bar * 0.36, height: bar * 0.36, borderRadius: '50%', background: c }} />)}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', height: bar * 0.62, width: width * 0.4, borderRadius: bar * 0.2, background: '#E9E9EB', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: bar * 0.2, fontFamily: font.sans, fontSize: bar * 0.38, color: color.ink2 }}>
          <svg width={bar * 0.3} height={bar * 0.3} viewBox="0 0 24 24"><path d="M7 10V7a5 5 0 0 1 10 0v3h1.5v11h-13V10H7zm2 0h6V7a3 3 0 0 0-6 0v3z" fill="currentColor" /></svg>
          {url}
        </div>
      </div>
      <div style={{ width, height, position: 'relative', overflow: 'hidden', background: '#fff' }}>
        <ScreenClip src={src} image={image} width={width} viewport={viewport} startAt={startAt} showCursor={false} marks={marks} camera={camera ?? [{ f: 0, zoom: 1, x: viewport[0] / 2, y: viewport[1] / 2 }]} holdAt={holdAt} playbackRate={rate} markDim={0.7} markPulse />
      </div>
    </div>
  );
};

// Muelle corto reutilizable.
export const useSpring = (at: number, damping = 15, stiffness = 170) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, stiffness } });
};

// Tarjeta blanca de la marca (bordes, sombra) con entrada en muelle.
export const Card: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; from?: 'up' | 'left' | 'right' | 'scale'; out?: number; radius?: number }> = ({ at, children, style, from = 'up', out, radius = 34 }) => {
  const frame = useCurrentFrame();
  const s = useSpring(at, 16, 150);
  const o = out !== undefined ? interpolate(frame, [out - 10, out], [0, 1], { ...clamp, easing: easeInOut }) : 0;
  if (frame < at - 1) return <div style={{ ...style, visibility: 'hidden' }}>{children}</div>;
  const dx = from === 'left' ? -60 : from === 'right' ? 60 : 0;
  const dy = from === 'up' ? 50 : 0;
  const sc = from === 'scale' ? 0.8 + 0.2 * s : 0.94 + 0.06 * s;
  return (
    <div style={{ background: '#fff', borderRadius: radius, boxShadow: shadow.card, border: `1px solid ${color.line}`, position: 'relative',
      opacity: Math.min(1, s * 1.4) * (1 - o), transform: `translate(${(1 - s) * dx}px, ${(1 - s) * dy - o * 20}px) scale(${sc})`, filter: s < 0.98 ? `blur(${((1 - s) * 8).toFixed(2)}px)` : undefined, ...style }}>
      {children}
    </div>
  );
};

export { color, font, shadow };

// ——— Página entera (captura alta) dentro de un navegador, con desplazamiento y zoom animados ———
// `cssW`: ancho del viewport capturado (px CSS); `cssH`: alto total de la página; la imagen está a 2x o 3x (da igual: se escala).
// `keys`: fotogramas clave {f, y (px CSS de la parte de arriba de la vista), zoom, x (centro del zoom)}.
// `marks`: marcos amarillos en px CSS de la página, entre `from` y `to` (fotogramas de la escena).
export type PageKey = { f: number; y: number; zoom?: number; x?: number };
export type PageMark = { from: number; to: number; x: number; y: number; w: number; h: number; r?: number };
export const PagePane: React.FC<{ src: string; cssW: number; cssH: number; width: number; url: string; keys: PageKey[]; marks?: PageMark[]; style?: React.CSSProperties; dark?: boolean }> = ({
  src, cssW, cssH, width, url, keys, marks = [], style, dark = false,
}) => {
  const frame = useCurrentFrame();
  const bar = Math.round(width * 0.03);
  const viewH = (cssW * 9) / 16;
  const k = (prop: 'y' | 'zoom' | 'x') => keyframes(frame, keys.map((q) => ({ f: q.f, y: q.y, zoom: q.zoom ?? 1, x: q.x ?? cssW / 2 })), prop, easeInOut);
  const y = Math.max(0, Math.min(cssH - viewH, k('y')));
  const zoom = k('zoom');
  const zx = k('x');
  const s = width / cssW;
  // Desenfoque vertical suave mientras la página corre deprisa.
  const vy = Math.abs(keyframes(frame + 1, keys.map((q) => ({ f: q.f, y: q.y })), 'y', easeInOut) - keyframes(frame - 1, keys.map((q) => ({ f: q.f, y: q.y })), 'y', easeInOut)) / 2;
  const blur = Math.min(3, vy * 0.08);
  const zy = y + viewH / 2;
  return (
    <div style={{ width, borderRadius: width * 0.014, overflow: 'hidden', background: dark ? '#1b1d21' : '#F6F6F7', boxShadow: '0 60px 120px rgba(16,16,16,0.22), 0 18px 40px rgba(16,16,16,0.12), 0 0 0 1px rgba(16,16,16,0.06)', ...style }}>
      <div style={{ height: bar, display: 'flex', alignItems: 'center', padding: `0 ${bar * 0.6}px`, gap: bar * 0.32, position: 'relative' }}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <div key={c} style={{ width: bar * 0.36, height: bar * 0.36, borderRadius: '50%', background: c }} />)}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', height: bar * 0.62, width: width * 0.42, borderRadius: bar * 0.2, background: dark ? '#2a2d33' : '#E9E9EB', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: bar * 0.2, fontFamily: font.sans, fontSize: bar * 0.38, color: dark ? '#cfd3da' : color.ink2 }}>
          <svg width={bar * 0.3} height={bar * 0.3} viewBox="0 0 24 24"><path d="M7 10V7a5 5 0 0 1 10 0v3h1.5v11h-13V10H7zm2 0h6V7a3 3 0 0 0-6 0v3z" fill="currentColor" /></svg>
          {url}
        </div>
      </div>
      <div style={{ width, height: viewH * s, position: 'relative', overflow: 'hidden', background: '#fff' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: cssW * s, height: cssH * s, transformOrigin: `${zx * s}px ${zy * s}px`,
          transform: `translateY(${(-y * s).toFixed(2)}px) scale(${zoom.toFixed(4)})`, filter: blur > 0.3 ? `blur(${blur.toFixed(2)}px)` : undefined }}>
          <Img src={staticFile(src)} style={{ width: cssW * s, height: cssH * s, display: 'block' }} />
          {marks.map((m, i) => {
            const p = interpolate(frame, [m.from, m.from + 10, m.to - 8, m.to], [0, 1, 1, 0], clamp);
            if (p <= 0) return null;
            return (
              <div key={i} style={{ position: 'absolute', left: (m.x - 6) * s, top: (m.y - 6) * s, width: (m.w + 12) * s, height: (m.h + 12) * s, borderRadius: (m.r ?? 12) * s,
                border: `${Math.max(3, 4 * s)}px solid ${color.yellow}`, boxShadow: `0 0 0 ${(2000 * s).toFixed(0)}px rgba(16,16,16,${(0.28 * p).toFixed(3)})`, opacity: p,
                transform: `scale(${1.06 - 0.06 * p})` }} />
            );
          })}
        </div>
      </div>
    </div>
  );
};
