import React from 'react';
import { AbsoluteFill, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../brand/tokens';
import { clamp, easeInOut, easeOut } from '../lib/anim';
import { ScreenClip, type Mark, type CamKey } from '../components/ScreenClip';
import { BrowserWindow } from '../components/BrowserWindow';
import { RealPhone } from '../components/RealPhone';
import { MpStage } from '../scenes/mp/kit';
import { Chip } from '../scenes/nxr/kit';
import * as I1 from '../components/Icons';
import * as I2 from '../components/Icons2';
import type { Cue, IconName, MarkSpec, PlatformSpec, RecRef, TagSpec, ZoomSpec, Cut } from './types';
import { plWordFrame } from './vo';
import recIndex from './rec_index.json';

export { MpStage };
export type SceneCtx = { spec: PlatformSpec; id: string; text: string; lead: number; dur: number };

// ——— Palabras → fotogramas ———
// Fotograma de la escena (contando la entrada `lead`) en que empieza la palabra del cue.
export const cueFrame = (c: SceneCtx, cue: Cue): number => {
  const [w, n] = typeof cue === 'string' ? [cue, 0] : cue;
  return c.lead + plWordFrame(c.spec.slug, c.id, c.text, w, n);
};
export const useAt = (c: SceneCtx) => (cue: Cue) => cueFrame(c, cue);

// ——— Grabaciones ———
type RecInfo = { duration: number; viewport: [number, number]; cursor?: { t: number; x: number; y: number; down?: boolean }[] };
const REC = recIndex as unknown as Record<string, RecInfo>;
// «@common/<toma>»: tomas compartidas por todas las piezas (public/pl/common/rec/), como las de sonorbooks.pl.
const split = (slug: string, clip: string): [string, string] => (clip.startsWith('@common/') ? ['common', clip.slice(8)] : [slug, clip]);
export const recInfo = (slug: string, clip: string): RecInfo | undefined => { const [a, b] = split(slug, clip); return REC[`${a}/${b}`]; };
export const recSrc = (slug: string, clip: string) => { const [a, b] = split(slug, clip); return `pl/${a}/rec/${b}/video.mp4`; };

// ——— Iconos ———
const S: React.FC<{ size: number; children: React.ReactNode }> = ({ size, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const Extra: Record<string, React.FC<{ size?: number; c?: string }>> = {
  library: ({ size = 40, c = color.ink }) => (<S size={size}><path d="M3 20h18M5 20V9M9 20V9M15 20V9M19 20V9M2.5 9 12 4l9.5 5z" stroke={c} strokeWidth={1.8} /></S>),
  gift: ({ size = 40, c = color.ink }) => (<S size={size}><rect x="3.5" y="9" width="17" height="11" rx="1.5" stroke={c} strokeWidth={1.8} /><path d="M2.5 9h19M12 9v11M12 9c-1.5-3.5-6-4.5-6-1.5S12 9 12 9zm0 0c1.5-3.5 6-4.5 6-1.5S12 9 12 9z" stroke={c} strokeWidth={1.8} /></S>),
  family: ({ size = 40, c = color.ink }) => (<S size={size}><circle cx="8" cy="7" r="2.6" stroke={c} strokeWidth={1.8} /><circle cx="16.5" cy="8.5" r="2.1" stroke={c} strokeWidth={1.8} /><path d="M3.5 20v-3.5A4.5 4.5 0 0 1 8 12a4.5 4.5 0 0 1 4.5 4.5V20M13 20v-2.5a3.5 3.5 0 0 1 7 0V20" stroke={c} strokeWidth={1.8} /></S>),
  coin: ({ size = 40, c = color.ink }) => (<S size={size}><circle cx="12" cy="12" r="8.5" stroke={c} strokeWidth={1.8} /><path d="M9 14.5c0 1.2 1.3 2 3 2s3-.8 3-2.2c0-3-6-1.6-6-4.6 0-1.3 1.3-2.2 3-2.2s3 .8 3 2M12 5.8v1.5M12 16.5v1.6" stroke={c} strokeWidth={1.6} /></S>),
  play: ({ size = 40, c = color.ink }) => (<S size={size}><circle cx="12" cy="12" r="9" stroke={c} strokeWidth={1.8} /><path d="M10 8.5 15.5 12 10 15.5z" fill={c} stroke={c} strokeWidth={1.2} /></S>),
  sparkle: ({ size = 40, c = color.ink }) => (<S size={size}><path d="M12 3.5 13.8 10l6.7 2-6.7 2L12 20.5 10.2 14l-6.7-2 6.7-2z" stroke={c} strokeWidth={1.7} /></S>),
  school: ({ size = 40, c = color.ink }) => (<S size={size}><path d="M2.5 9.5 12 5l9.5 4.5L12 14z" stroke={c} strokeWidth={1.8} /><path d="M6 11.5v4c0 1.5 2.7 3 6 3s6-1.5 6-3v-4M21.5 9.5V15" stroke={c} strokeWidth={1.8} /></S>),
  radio: ({ size = 40, c = color.ink }) => (<S size={size}><rect x="3" y="8" width="18" height="12" rx="2" stroke={c} strokeWidth={1.8} /><circle cx="15.5" cy="14" r="2.8" stroke={c} strokeWidth={1.8} /><path d="M6.5 12h4M6.5 15h4M6 8l10-4.5" stroke={c} strokeWidth={1.8} /></S>),
  tv: ({ size = 40, c = color.ink }) => (<S size={size}><rect x="2.5" y="5" width="19" height="12.5" rx="2" stroke={c} strokeWidth={1.8} /><path d="M8 21h8M12 17.5V21" stroke={c} strokeWidth={1.8} /></S>),
};
const MAP: Record<IconName, string> = {
  book: 'BookIcon', headphones: 'HeadphonesIcon', music: 'MusicIcon', mic: 'MicIcon', phone: 'PhoneIcon', tablet: 'TabletIcon', laptop: 'LaptopIcon',
  globe: 'GlobeIcon', search: 'SearchIcon', clock: 'ClockIcon', user: 'UserIcon', kid: 'KidIcon', lock: 'LockIcon', download: 'DownloadIcon',
  wifiOff: 'WifiOffIcon', moon: 'MoonIcon', speed: 'SpeedIcon', bookmark: 'BookmarkIcon', list: 'ListIcon', font: 'FontIcon', sync: 'SyncIcon',
  car: 'CarIcon', watch: 'WatchIcon', cast: 'CastIcon', ereader: 'EreaderIcon', pdf: 'PdfIcon', star: 'StarIcon', chart: 'ChartIcon', card: 'CardIcon',
  mail: 'MailIcon', calendar: 'CalendarIcon', infinity: 'InfinityIcon', link: 'LinkIcon', doc: 'DocIcon', check: 'CheckIcon', cross: 'CrossIcon',
  heart: 'HeartIcon', speaker: 'SpeakerIcon', library: 'library', gift: 'gift', family: 'family', coin: 'coin', play: 'play', sparkle: 'sparkle',
  school: 'school', radio: 'radio', tv: 'tv',
};
export const Icon: React.FC<{ name?: IconName; size?: number; c?: string }> = ({ name, size = 40, c = color.ink }) => {
  if (!name) return null;
  const key = MAP[name];
  const C = (Extra[key] ?? (I1 as Record<string, unknown>)[key] ?? (I2 as Record<string, unknown>)[key]) as React.FC<{ size?: number; c?: string }> | undefined;
  return C ? <C size={size} c={c} /> : null;
};

// ——— Marca de la plataforma ———
export const PlatformLogo: React.FC<{ spec: PlatformSpec; width: number; white?: boolean; style?: React.CSSProperties }> = ({ spec, width, white = false, style }) => (
  <Img src={staticFile(white && spec.logoWhite ? spec.logoWhite : spec.logo)}
    style={{ width, height: width * spec.logoRatio, display: 'block', objectFit: 'contain', filter: white && !spec.logoWhite ? 'brightness(0) invert(1)' : undefined, ...style }} />
);
export const PlatformTile: React.FC<{ spec: PlatformSpec; size: number; style?: React.CSSProperties }> = ({ spec, size, style }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.23, background: spec.tileBg ?? spec.color, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0,
    boxShadow: '0 18px 40px rgba(16,16,16,0.16), inset 0 0 0 1px rgba(16,16,16,0.06)', ...style }}>
    <PlatformLogo spec={spec} width={size * 0.78} white={spec.tileLogoWhite ?? true} style={{ maxHeight: size * 0.6 }} />
  </div>
);

// ——— Muelle ———
export const useSpring = (at: number, damping = 15, stiffness = 170) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, stiffness } });
};

// ——— Pantallas con grabación ———
type Shot = { from: number; rec: RecRef };
const shotsOf = (c: SceneCtx, rec: RecRef | undefined, cuts: Cut[] = []): Shot[] => {
  const list: Shot[] = [];
  if (rec) list.push({ from: 0, rec });
  for (const k of cuts) list.push({ from: Math.max(0, cueFrame(c, k.at) - 4), rec: k.rec });
  return list.sort((a, b) => a.from - b.from);
};

// Grabación (o su última imagen si aún no existe) con cambios de toma por cue y fundido corto entre tomas.
export const RecScreen: React.FC<{ c: SceneCtx; rec?: RecRef; cuts?: Cut[]; width: number; marks?: MarkSpec[]; zooms?: ZoomSpec[]; pulse?: boolean }> = ({ c, rec, cuts, width, marks = [], zooms = [], pulse = true }) => {
  const frame = useCurrentFrame();
  const shots = shotsOf(c, rec, cuts);
  if (!shots.length) return null;
  const mobile = Boolean(shots[0].rec.mobile);
  const vp: [number, number] = mobile ? [430, 932] : [1920, 1080];
  const height = (width * vp[1]) / vp[0];
  const markList = (from: number, to: number): Mark[] => marks.map((m) => {
    const a = cueFrame(c, m.at);
    const b = m.until !== undefined ? cueFrame(c, m.until) : c.dur + 30;
    return { from: a - from, to: b - from, x: m.x, y: m.y, w: m.w, h: m.h, r: m.r, label: m.label };
  }).filter((m) => m.to > 0 && m.from < to - from);
  const camOf = (from: number): CamKey[] => {
    const keys: CamKey[] = [{ f: 0, zoom: 1, x: vp[0] / 2, y: vp[1] / 2 }];
    for (const z of zooms) {
      const f = cueFrame(c, z.at) - from;
      keys.push({ f: Math.max(1, f - 4), zoom: keys[keys.length - 1].zoom, x: keys[keys.length - 1].x, y: keys[keys.length - 1].y });
      keys.push({ f: f + 22, zoom: z.zoom, x: z.x, y: z.y });
    }
    return keys;
  };
  return (
    <div style={{ width, height, position: 'relative', overflow: 'hidden', background: '#fff' }}>
      {shots.map((s, i) => {
        const next = shots[i + 1];
        const to = next ? next.from + 8 : c.dur + 40;
        const info = recInfo(c.spec.slug, s.rec.clip);
        const fadeIn = i === 0 ? 1 : interpolate(frame, [s.from, s.from + 8], [0, 1], clamp);
        if (frame >= to) return null;
        return (
          <div key={i} style={{ position: 'absolute', inset: 0, opacity: fadeIn }}>
            <Sequence from={s.from} layout="none">
              {info ? (
                <ScreenClip src={recSrc(c.spec.slug, s.rec.clip)} width={width} viewport={vp} startAt={s.rec.start ?? 0} playbackRate={s.rec.rate ?? 1} holdAt={s.rec.holdAt}
                  cursor={(s.rec.cursor ?? !mobile) ? (info.cursor ?? []).map((q) => ({ ...q, down: Boolean(q.down) })) : []} showCursor={(s.rec.cursor ?? !mobile) && Boolean(info.cursor?.length)}
                  marks={markList(s.from, to)} camera={camOf(s.from)} markPulse={pulse} />
              ) : (
                <MissingRec width={width} height={height} name={`${c.spec.slug}/${s.rec.clip}`} />
              )}
            </Sequence>
          </div>
        );
      })}
    </div>
  );
};
const MissingRec: React.FC<{ width: number; height: number; name: string }> = ({ width, height, name }) => (
  <div style={{ width, height, background: 'repeating-linear-gradient(45deg, #f4f4f4 0 24px, #ececec 24px 48px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: font.sans, fontSize: Math.max(18, width * 0.03), color: color.muted }}>{name}</div>
);

// Ventana de navegador o teléfono, según la toma.
export const Device: React.FC<{ c: SceneCtx; rec?: RecRef; cuts?: Cut[]; width: number; marks?: MarkSpec[]; zooms?: ZoomSpec[]; tilt?: number; style?: React.CSSProperties }> = ({ c, rec, cuts, width, marks, zooms, tilt = 0, style }) => {
  const frame = useCurrentFrame();
  const first = rec ?? cuts?.[0]?.rec;
  if (!first) return null;
  if (first.mobile) {
    return (
      <div style={{ ...style }}>
        <RealPhone w={width} ratio={932 / 430} rotY={tilt} screenBg="#fff">
          <RecScreen c={c} rec={rec} cuts={cuts} width={width} marks={marks} zooms={zooms} />
        </RealPhone>
      </div>
    );
  }
  // La barra de direcciones enseña la URL de la toma que se ve en cada momento (las escenas con cortes cambian de web).
  const shots = shotsOf(c, rec, cuts);
  const active = shots.reduce((a, s2) => (frame >= s2.from ? s2 : a), shots[0]);
  const url = active?.rec.url ?? first.url ?? c.spec.domain;
  return (
    <div style={{ transform: tilt ? `perspective(2400px) rotateY(${tilt}deg)` : undefined, ...style }}>
      <BrowserWindow width={width} url={url}>
        <RecScreen c={c} rec={rec} cuts={cuts} width={width} marks={marks} zooms={zooms} />
      </BrowserWindow>
    </div>
  );
};

// ——— Etiquetas ———
const TONE: Record<NonNullable<TagSpec['tone']>, { accent: string; ic: string }> = {
  plain: { accent: color.yellow, ic: color.ink },
  accent: { accent: color.yellow, ic: color.ink },
  good: { accent: '#DDF3E5', ic: color.green },
  bad: { accent: '#FDE3E3', ic: color.red },
};
export const Tag: React.FC<{ c: SceneCtx; t: TagSpec; size?: number; dimAt?: number; style?: React.CSSProperties }> = ({ c, t, size = 36, dimAt, style }) => {
  const tone = TONE[t.tone ?? 'plain'];
  const icon = t.icon ? <Icon name={t.icon} size={size * 0.9} c={tone.ic} />
    : t.tone === 'good' ? <I1.CheckIcon size={size * 1.05} c={color.green} />
    : t.tone === 'bad' ? <I1.CrossIcon size={size * 1.05} c={color.red} /> : undefined;
  return <Chip at={cueFrame(c, t.at)} label={t.label} sub={t.sub} icon={icon} size={size} accent={tone.accent} dimAt={dimAt} reserve style={style} />;
};
export const TagStack: React.FC<{ c: SceneCtx; tags: TagSpec[]; size?: number; gap?: number; style?: React.CSSProperties; align?: 'flex-start' | 'center' }> = ({ c, tags, size = 36, gap = 18, style, align = 'flex-start' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap, alignItems: align, ...style }}>
    {tags.map((t, i) => <Tag key={i} c={c} t={t} size={size} />)}
  </div>
);

// Título de escena pequeño (kicker + título) que entra al principio.
export const SceneHead: React.FC<{ c: SceneCtx; kicker?: string; title?: string; at?: number; style?: React.CSSProperties }> = ({ c, kicker, title, at = 4, style }) => {
  const p = useSpring(at, 16, 160);
  if (!kicker && !title) return null;
  return (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * 24}px)`, ...style }}>
      {kicker && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontFamily: font.sans, fontWeight: 700, fontSize: 24, letterSpacing: 4, textTransform: 'uppercase', color: c.spec.deep }}>
          <span style={{ width: 12, height: 12, borderRadius: 6, background: c.spec.color }} />{kicker}
        </div>
      )}
      {title && <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 74, letterSpacing: -2.5, lineHeight: 1.05, color: color.ink, marginTop: 8 }}>{title}</div>}
    </div>
  );
};

// ——— Tiendas ———
export const GooglePlayLogo: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <path d="M7 4.5 27.5 24 7 43.5c-.9-.4-1.5-1.3-1.5-2.4V6.9c0-1.1.6-2 1.5-2.4z" fill="#2196F3" />
    <path d="M34.3 17.3 27.5 24 7 4.5c.3-.1.6-.2 1-.2.5 0 1 .1 1.4.4z" fill="#4CAF50" />
    <path d="M34.3 30.7 9.4 43.3c-.4.3-.9.4-1.4.4-.4 0-.7-.1-1-.2L27.5 24z" fill="#F44336" />
    <path d="M41.2 26.2 34.3 30.7 27.5 24l6.8-6.7 6.9 4.5c.8.5 1.3 1.3 1.3 2.2s-.5 1.7-1.3 2.2z" fill="#FFC107" />
  </svg>
);
export const AppleLogo: React.FC<{ size: number; c?: string }> = ({ size, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path fill={c} d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.8-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.8 1.3 10.3.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9 0 0-2.6-1-2.6-4.2zM13.9 4.9c.7-.9 1.2-2 1.1-3.2-1 0-2.3.7-3 1.6-.7.8-1.2 2-1.1 3.1 1.1.1 2.3-.6 3-1.5z" /></svg>
);
export const Stars: React.FC<{ value: number; size: number; fill?: number }> = ({ value, size, fill = 1 }) => (
  <div style={{ display: 'flex', gap: size * 0.12 }}>
    {Array.from({ length: 5 }).map((_, i) => {
      const f = Math.max(0, Math.min(1, value * fill - i));
      return (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24">
          <defs><clipPath id={`st${i}-${Math.round(f * 100)}`}><rect x="0" y="0" width={24 * f} height="24" /></clipPath></defs>
          <path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2 6.3 20.3l1.2-6.4L2.8 9.5l6.4-.8z" fill="#E7E5DF" />
          <path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2 6.3 20.3l1.2-6.4L2.8 9.5l6.4-.8z" fill={color.yellow} clipPath={`url(#st${i}-${Math.round(f * 100)})`} />
        </svg>
      );
    })}
  </div>
);

// Tarjeta blanca con muelle de entrada.
// `ghostAt`: desde ese fotograma la tarjeta ya está en su sitio, apagada (gris y translúcida), y se enciende con su palabra (`at`):
// así la escena no empieza vacía y se ve lo que va a llegar.
export const PopCard: React.FC<{ at: number; ghostAt?: number; children: React.ReactNode; style?: React.CSSProperties; from?: 'up' | 'left' | 'right' }> = ({ at, ghostAt, children, style, from = 'up' }) => {
  const frame = useCurrentFrame();
  const p = useSpring(at, 15, 170);
  const gs = useSpring(ghostAt ?? 0, 18, 150);
  const g = ghostAt !== undefined ? gs : 0;
  const dx = from === 'left' ? -60 : from === 'right' ? 60 : 0;
  const dy = from === 'up' ? 50 : 0;
  if (frame < at - 1) {
    if (ghostAt === undefined || frame < ghostAt - 1) return <div style={{ ...style, visibility: 'hidden' }}>{children}</div>;
    return (
      <div style={{ background: '#fff', borderRadius: 28, boxShadow: shadow.soft, border: `1px solid ${color.line}`, opacity: 0.42 * Math.min(1, g * 1.3),
        transform: `translateY(${(1 - g) * 30}px) scale(0.96)`, filter: 'grayscale(1)', ...style }}>{children}</div>
    );
  }
  const flash = interpolate(frame, [at, at + 4, at + 16], [0, 1, 0], { ...clamp, easing: easeOut });
  return (
    <div style={{ background: '#fff', borderRadius: 28, boxShadow: flash > 0.01 ? `${shadow.card}, 0 0 0 ${(6 * flash).toFixed(1)}px rgba(255,202,5,0.45)` : shadow.card, border: `1px solid ${color.line}`,
      opacity: ghostAt !== undefined ? 1 : Math.min(1, p * 1.4),
      transform: ghostAt !== undefined ? `scale(${0.96 + 0.04 * p + 0.025 * flash})` : `translate(${(1 - p) * dx}px, ${(1 - p) * dy}px) scale(${0.92 + 0.08 * p})`, ...style }}>{children}</div>
  );
};

// Marca de agua: el icono de la plataforma, enorme y muy suave, que deriva despacio en una esquina (da profundidad a las escenas sin toma).
export const Watermark: React.FC<{ spec: PlatformSpec; side?: 'right' | 'left' }> = ({ spec, side = 'right' }) => {
  const frame = useCurrentFrame();
  const t = frame / 50;
  return (
    <div style={{ position: 'absolute', [side]: -170 + Math.sin(t * 0.15) * 18, bottom: -230 + Math.cos(t * 0.12) * 14, opacity: 0.07, transform: `rotate(${-14 + Math.sin(t * 0.1) * 2}deg)`, pointerEvents: 'none' }}>
      <PlatformTile spec={spec} size={640} style={{ boxShadow: 'none' }} />
    </div>
  );
};

// Fundido de salida común al final de cada escena (si no hay transición).
export const useOut = (dur: number, len = 10) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [dur - len, dur], [0, 1], { ...clamp, easing: easeInOut });
};
export const useIn = (at = 0, len = 14) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [at, at + len], [0, 1], { ...clamp, easing: easeOut });
};
export { AbsoluteFill, color, font, shadow };
