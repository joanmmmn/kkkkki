import React from 'react';
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { ScreenClip, CamKey, Mark } from '../../components/ScreenClip';
import { clamp, easeOut } from '../../lib/anim';

// Piezas compartidas de la reseña de Everand.
export const EV_LIME = '#F1FC52'; // color del icono de la app (medido en la ficha de Google Play)
export const SCRIBD_TEAL = '#1E7B85';

export const EverandIcon: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 80, style }) => (
  <Img src={staticFile('evd/img/everand_icon.png')} style={{ width: size, height: size, display: 'block', borderRadius: size * 0.2, boxShadow: '0 14px 34px rgba(60,60,0,0.22)', ...style }} />
);

// Icono + nombre, como en las tiendas de apps.
export const EverandBadge: React.FC<{ size?: number; dark?: boolean }> = ({ size = 80, dark }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.26 }}>
    <EverandIcon size={size} />
    <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: size * 0.78, letterSpacing: -size * 0.015, color: dark ? '#fff' : color.ink }}>Everand</span>
  </div>
);

export const ScribdBadge: React.FC<{ size?: number }> = ({ size = 60 }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.3, padding: `${size * 0.22}px ${size * 0.55}px ${size * 0.22}px ${size * 0.3}px`, borderRadius: 999, background: SCRIBD_TEAL, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: size * 0.62, boxShadow: '0 14px 34px rgba(10,60,70,0.28)' }}>
    <div style={{ width: size * 0.8, height: size * 0.8, borderRadius: '50%', background: '#fff', color: SCRIBD_TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.5, fontWeight: 700 }}>S</div>
    Scribd
  </div>
);

type P = { size?: number; c?: string };
export const LockIcon: React.FC<P & { open?: number }> = ({ size = 40, c = color.ink, open = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ overflow: 'visible' }}>
    <path d="M7.5 10.5V7.5a4.5 4.5 0 0 1 9 0v3" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" transform={`translate(0 ${-open * 2.6})`} />
    <rect x="4.5" y="10" width="15" height="11" rx="2.6" fill={c} />
    <circle cx="12" cy="15.5" r="1.7" fill="#fff" />
  </svg>
);
export const CalendarIcon: React.FC<P> = ({ size = 40, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15.5" rx="2.6" fill="none" stroke={c} strokeWidth="1.9" /><path d="M3.5 10h17M8 3v4M16 3v4" stroke={c} strokeWidth="1.9" strokeLinecap="round" /></svg>
);
export const CardIcon: React.FC<P> = ({ size = 40, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><rect x="2.5" y="5.5" width="19" height="13" rx="2.4" fill="none" stroke={c} strokeWidth="1.9" /><path d="M2.5 10h19" stroke={c} strokeWidth="2.6" /><path d="M6 15h4" stroke={c} strokeWidth="1.9" strokeLinecap="round" /></svg>
);
export const RenewIcon: React.FC<P & { spin?: number }> = ({ size = 40, c = color.ink, spin = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ transform: `rotate(${spin}deg)` }}><path d="M19.5 12a7.5 7.5 0 0 1-13 5.1M4.5 12a7.5 7.5 0 0 1 13-5.1" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" /><path d="M17.8 3.2v3.9h-3.9M6.2 20.8v-3.9h3.9" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
export const DownloadIcon: React.FC<P> = ({ size = 40, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
export const SpeedIcon: React.FC<P> = ({ size = 40, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M4 16a8 8 0 1 1 16 0" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" /><path d="M12 16l4.2-5" stroke={c} strokeWidth="2.2" strokeLinecap="round" /><circle cx="12" cy="16" r="1.6" fill={c} /></svg>
);
export const MoonIcon: React.FC<P> = ({ size = 40, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z" fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round" /></svg>
);
export const GlobeIcon: React.FC<P> = ({ size = 40, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke={c} strokeWidth="1.9" /><path d="M3.5 12h17M12 3.5c2.6 2.4 3.6 5.2 3.6 8.5s-1 6.1-3.6 8.5c-2.6-2.4-3.6-5.2-3.6-8.5s1-6.1 3.6-8.5z" fill="none" stroke={c} strokeWidth="1.7" /></svg>
);
export const PhoneIcon: React.FC<P> = ({ size = 40, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><rect x="6.5" y="2.5" width="11" height="19" rx="2.5" fill="none" stroke={c} strokeWidth="1.9" /><path d="M10.5 18.5h3" stroke={c} strokeWidth="1.9" strokeLinecap="round" /></svg>
);
export const LaptopIcon: React.FC<P> = ({ size = 40, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><rect x="4.5" y="5" width="15" height="10.5" rx="1.6" fill="none" stroke={c} strokeWidth="1.9" /><path d="M2.5 19h19" stroke={c} strokeWidth="2.2" strokeLinecap="round" /></svg>
);
export const CarIcon: React.FC<P> = ({ size = 40, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M4 16.5v-4l2-5.2A2 2 0 0 1 7.9 6h8.2a2 2 0 0 1 1.9 1.3l2 5.2v4z" fill="none" stroke={c} strokeWidth="1.9" strokeLinejoin="round" /><path d="M4 12.5h16" stroke={c} strokeWidth="1.9" /><circle cx="7.5" cy="17.5" r="1.8" fill={c} /><circle cx="16.5" cy="17.5" r="1.8" fill={c} /></svg>
);
export const UserIcon: React.FC<P> = ({ size = 40, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="4" fill="none" stroke={c} strokeWidth="1.9" /><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" /></svg>
);
export const FamilyIcon: React.FC<P> = ({ size = 40, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><circle cx="8" cy="7.5" r="3" fill="none" stroke={c} strokeWidth="1.8" /><circle cx="16.5" cy="9" r="2.4" fill="none" stroke={c} strokeWidth="1.8" /><path d="M2.5 19.5a5.5 5.5 0 0 1 11 0M13 19.5a4 4 0 0 1 8 0" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" /></svg>
);
export const DocIcon: React.FC<P> = ({ size = 40, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M6 2.8h8l4.5 4.5v13.9H6z" fill="none" stroke={c} strokeWidth="1.9" strokeLinejoin="round" /><path d="M14 2.8v4.5h4.5M9 12h6.5M9 15.5h6.5" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" /></svg>
);
export const PodcastIcon: React.FC<P> = ({ size = 40, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><circle cx="12" cy="10" r="2.4" fill={c} /><path d="M8.2 14.2a5.5 5.5 0 1 1 7.6 0M5.4 17a9.2 9.2 0 1 1 13.2 0" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" /><path d="M12 13.5V21" stroke={c} strokeWidth="2.2" strokeLinecap="round" /></svg>
);
export const ShieldIcon: React.FC<P> = ({ size = 40, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M12 2.8l7.5 3v6c0 4.6-3.2 8-7.5 9.4C7.7 19.8 4.5 16.4 4.5 11.8v-6z" fill="none" stroke={c} strokeWidth="1.9" strokeLinejoin="round" /><path d="M12 8v5M12 16.2v.1" stroke={c} strokeWidth="2.2" strokeLinecap="round" /></svg>
);
export const WarnIcon: React.FC<P> = ({ size = 40, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M12 3.2l9.5 16.6H2.5z" fill={color.yellow} stroke={c} strokeWidth="1.9" strokeLinejoin="round" /><path d="M12 9.5v4.6M12 16.8v.1" stroke={c} strokeWidth="2.3" strokeLinecap="round" /></svg>
);
export const StarIcon: React.FC<P & { fill?: number }> = ({ size = 40, c = '#F5A623', fill = 1 }) => {
  const id = React.useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs><linearGradient id={`s${id}`}><stop offset={fill} stopColor={c} /><stop offset={fill} stopColor="#E3E3E3" /></linearGradient></defs>
      <path d="M12 2.6l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17.1l-5.9 3.3 1.3-6.5L2.5 9.4l6.6-.8z" fill={`url(#s${id})`} />
    </svg>
  );
};
export const Stars: React.FC<{ value: number; size?: number; at: number }> = ({ value, size = 40, at }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [at, at + 30], [0, value], { ...clamp, easing: easeOut });
  return <div style={{ display: 'flex', gap: size * 0.08 }}>{[0, 1, 2, 3, 4].map((i) => <StarIcon key={i} size={size} fill={Math.max(0, Math.min(1, v - i))} />)}</div>;
};

// Banderas sencillas (proporción 3:2).
export const Flag: React.FC<{ c: 'es' | 'mx' | 'us'; h?: number }> = ({ c, h = 40 }) => {
  const w = h * 1.5;
  const box: React.CSSProperties = { width: w, height: h, borderRadius: h * 0.14, overflow: 'hidden', boxShadow: '0 0 0 1px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.12)', flexShrink: 0, position: 'relative' };
  if (c === 'es') return <div style={{ ...box, background: 'linear-gradient(180deg, #C60B1E 25%, #FFC400 25%, #FFC400 75%, #C60B1E 75%)' }} />;
  if (c === 'mx') return (
    <div style={{ ...box, background: 'linear-gradient(90deg, #006847 33.3%, #fff 33.3%, #fff 66.6%, #CE1126 66.6%)' }}>
      <div style={{ position: 'absolute', left: '50%', top: '50%', width: h * 0.32, height: h * 0.32, borderRadius: '50%', background: '#8C5A2B', transform: 'translate(-50%,-50%)' }} />
    </div>
  );
  return (
    <div style={{ ...box, background: 'repeating-linear-gradient(180deg, #B22234 0 7.69%, #fff 7.69% 15.38%)' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: '42%', height: '53.8%', background: '#3C3B6E' }} />
    </div>
  );
};

// Ventana de navegador clara con una captura 4K de la web y la cámara/marcas de ScreenClip.
export const ShotWindow: React.FC<{ src: string; width: number; url: string; camera?: CamKey[]; marks?: Mark[]; style?: React.CSSProperties }> = ({ src, width, url, camera, marks, style }) => {
  const bar = Math.round(width * 0.03);
  return (
    <div style={{ width, borderRadius: width * 0.014, overflow: 'hidden', background: '#F6F6F7', boxShadow: '0 60px 120px rgba(16,16,16,0.22), 0 18px 40px rgba(16,16,16,0.12), 0 0 0 1px rgba(16,16,16,0.06)', ...style }}>
      <div style={{ height: bar, display: 'flex', alignItems: 'center', padding: `0 ${bar * 0.6}px`, gap: bar * 0.32, position: 'relative' }}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <div key={c} style={{ width: bar * 0.36, height: bar * 0.36, borderRadius: '50%', background: c }} />)}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', height: bar * 0.62, minWidth: width * 0.34, padding: `0 ${bar * 0.5}px`, boxSizing: 'border-box', borderRadius: bar * 0.2, background: '#E9E9EB', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: bar * 0.2, fontFamily: font.sans, fontSize: bar * 0.36, color: color.ink2, whiteSpace: 'nowrap' }}>
          <svg width={bar * 0.3} height={bar * 0.3} viewBox="0 0 24 24"><path d="M7 10V7a5 5 0 0 1 10 0v3h1.5v11h-13V10H7zm2 0h6V7a3 3 0 0 0-6 0v3z" fill="currentColor" /></svg>
          {url}
        </div>
      </div>
      <ScreenClip image src={src} width={width} camera={camera} marks={marks} showCursor={false} />
    </div>
  );
};

// Tarjeta blanca de marca.
export const Panel: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: '#fff', borderRadius: 36, boxShadow: shadow.card, border: `1px solid ${color.line}`, ...style }}>{children}</div>
);

// Entrada con muelle (escala + subida + desenfoque) a partir del fotograma `at`.
export const Pop: React.FC<{ at: number; children: React.ReactNode; rise?: number; from?: number; style?: React.CSSProperties; damping?: number }> = ({ at, children, rise = 40, from = 0.85, style, damping = 15 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping, stiffness: 170 } });
  return (
    <div style={{ opacity: Math.min(1, s * 1.4), transform: `translateY(${(1 - s) * rise}px) scale(${from + (1 - from) * s})`, filter: s < 0.98 ? `blur(${(1 - Math.min(1, s)) * 8}px)` : undefined, ...style }}>
      {children}
    </div>
  );
};

// Tachado rojo que se dibuja de izquierda a derecha.
export const Strike: React.FC<{ at: number; thick?: number; rotate?: number; c?: string }> = ({ at, thick = 12, rotate = -6, c = color.red }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 9], [0, 1], { ...clamp, easing: easeOut });
  return <div style={{ position: 'absolute', left: -12, right: -12, top: '50%', height: thick, marginTop: -thick / 2, borderRadius: thick / 2, background: c, transformOrigin: 'left center', transform: `rotate(${rotate}deg) scaleX(${p})`, boxShadow: '0 4px 10px rgba(0,0,0,0.25)' }} />;
};

// Contador con separador de miles español.
export const Count: React.FC<{ to: number; at: number; dur?: number; from?: number; decimals?: number; style?: React.CSSProperties; suffix?: string; prefix?: string }> = ({ to, at, dur = 26, from = 0, decimals = 0, style, suffix = '', prefix = '' }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [at, at + dur], [from, to], { ...clamp, easing: easeOut });
  const s = v.toFixed(decimals).split('.');
  const int = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return <span style={{ fontVariantNumeric: 'tabular-nums', ...style }}>{prefix}{int}{s[1] ? ',' + s[1] : ''}{suffix}</span>;
};
