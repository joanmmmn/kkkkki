import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';
import { eIO, eOut, ramp, T } from './kit';

// ---------------------------------------------------------------------------------------------------------------
// La web de LibriVox dentro del vídeo: una ventana de navegador que flota en la biblioteca, con capturas reales
// (4K, 1280×720 CSS a 3x). Lo importante «se levanta» de la página como un recorte de papel (con su sombra y el hueco
// debajo), y se anota a mano con tinta (notas en papel y círculos), como haría un lector en el margen de un libro.
// Coordenadas: píxeles CSS de la página (1280 de ancho). `vv` = posición vertical dentro de la ventana (bajo la barra).
// ---------------------------------------------------------------------------------------------------------------
export const PAGES = {
  blank: { src: '', h: 720 },
  home: { src: 'lv/web3/home_full.png', h: 2502 },
  lang: { src: 'lv/web3/lang_full.png', h: 1500 },
  es: { src: 'lv/web3/es_full.png', h: 2400 },
  sl: { src: 'lv/web3/search_leyendas.png', h: 1285 },
  book: { src: 'lv/web/book.png', h: 2536 },
} as const;
export type PageId = keyof typeof PAGES;
export const VW = 1280, VH = 720, BAR = 46;
export const UI = '"TeX Gyre Heros", "Helvetica Neue", Arial, sans-serif';
const PAGE_BG = '#f6f6f1';

// Captura de una página, desplazada `scroll` píxeles
export const PageImg: React.FC<{ id: PageId; scroll: number }> = ({ id, scroll }) => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: PAGE_BG }}>
    {PAGES[id].src && <Img src={staticFile(PAGES[id].src)} style={{ position: 'absolute', left: 0, top: -scroll, width: VW, height: PAGES[id].h }} />}
  </div>
);

// Recorte [x, y, w, h] (coordenadas de página) de una captura
export const Crop: React.FC<{ id: PageId; box: number[]; pad?: number; radius?: number }> = ({ id, box, pad = 0, radius = 3 }) => {
  const [x, y, w, h] = box;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: w + 2 * pad, height: h + 2 * pad, overflow: 'hidden', borderRadius: radius, background: PAGE_BG }}>
      {PAGES[id].src && <Img src={staticFile(PAGES[id].src)} style={{ position: 'absolute', left: -(x - pad), top: -(y - pad), width: VW, height: PAGES[id].h }} />}
    </div>
  );
};

// Navegación: qué página se ve en cada momento y cómo aparece la nueva (se revela de arriba abajo, como tinta que se
// extiende, con la barra de carga en la ventana).
export type Nav = { at: number; page: PageId; url: string };
export const NAV_IN = 22;
export const navState = (frame: number, navs: Nav[]) => {
  let i = 0;
  for (let k = 0; k < navs.length; k++) if (frame >= navs[k].at) i = k;
  const cur = navs[i];
  const prev = i > 0 ? navs[i - 1] : null;
  const p = prev ? ramp(frame, cur.at, cur.at + NAV_IN, eIO) : 1;
  const load = prev ? ramp(frame, cur.at - 8, cur.at + 14, eOut) : 1;
  return { cur, prev, p, load, loading: prev ? frame >= cur.at - 8 && frame < cur.at + 26 : false };
};

// La ventana (sin profundidad): barra con la dirección y la página. `children` va encima de la página (plano).
export const Window: React.FC<{ url: string; typed?: string | null; caret?: boolean; load?: number; loading?: boolean; children: React.ReactNode; glare?: number }> = ({
  url, typed = null, caret, load = 1, loading, children, glare = 0,
}) => {
  const frame = useCurrentFrame();
  const text = typed ?? url;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: VW, height: VH + BAR, borderRadius: 14, overflow: 'hidden', background: '#2b2722',
      boxShadow: '0 0 0 1px rgba(255,236,200,0.10), 0 60px 140px rgba(0,0,0,0.75), 0 20px 50px rgba(0,0,0,0.5)' }}>
      {/* barra */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: VW, height: BAR, background: 'linear-gradient(180deg, #34302a, #2a2621)', borderBottom: '1px solid rgba(0,0,0,0.5)' }}>
        {[0, 1, 2].map((k) => <i key={k} style={{ position: 'absolute', left: 18 + k * 17, top: 17, width: 11, height: 11, borderRadius: 6, background: ['#8a6d4f', '#776048', '#655240'][k] }} />)}
        <svg width="70" height="20" viewBox="0 0 70 20" style={{ position: 'absolute', left: 82, top: 13 }} fill="none" stroke="#b5aa97" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 4 2 10l6 6M30 4l6 6-6 6" /><path d="M62 6.5a6 6 0 1 0 1.6 5.5M63.8 3.5v4h-4" />
        </svg>
        <div style={{ position: 'absolute', left: 164, top: 8, width: 960, height: 30, borderRadius: 15, background: '#1c1916', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)' }}>
          <svg width="12" height="14" viewBox="0 0 12 14" style={{ position: 'absolute', left: 14, top: 8 }} fill="none" stroke="#9c927f" strokeWidth="1.5"><rect x="1.5" y="6" width="9" height="7" rx="1.5" /><path d="M3.5 6V4.2a2.5 2.5 0 0 1 5 0V6" /></svg>
          <div style={{ position: 'absolute', left: 36, top: 0, height: 30, display: 'flex', alignItems: 'center', fontFamily: UI, fontSize: 17, color: '#e6dfd0', whiteSpace: 'nowrap', letterSpacing: 0.1 }}>
            {text}
            {caret && <span style={{ display: 'inline-block', width: 1.5, height: 17, marginLeft: 1.5, background: '#f3d08f', opacity: Math.floor(frame / 12) % 2 ? 0.2 : 1 }} />}
          </div>
        </div>
        <svg width="6" height="20" viewBox="0 0 6 20" style={{ position: 'absolute', right: 22, top: 13 }} fill="#b5aa97"><circle cx="3" cy="4" r="1.6" /><circle cx="3" cy="10" r="1.6" /><circle cx="3" cy="16" r="1.6" /></svg>
        {loading && <div style={{ position: 'absolute', left: 0, bottom: -1, height: 3, width: `${load * 100}%`, background: T.tealLight, boxShadow: `0 0 8px ${T.tealLight}`, opacity: 1 - ramp(load, 0.92, 1) * 0.9 }} />}
      </div>
      <div style={{ position: 'absolute', left: 0, top: BAR, width: VW, height: VH, overflow: 'hidden', background: PAGE_BG }}>
        {children}
        {/* reflejo cálido que cruza el cristal */}
        {glare > 0 && glare < 1 && <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(105deg, rgba(255,240,210,0) ${glare * 140 - 40}%, rgba(255,240,210,0.22) ${glare * 140 - 25}%, rgba(255,240,210,0) ${glare * 140 - 10}%)`, pointerEvents: 'none' }} />}
      </div>
    </div>
  );
};

// Páginas de la ventana, con la transición de carga
export const Pages: React.FC<{ navs: Nav[]; scroll: (page: PageId, frame: number) => number }> = ({ navs, scroll }) => {
  const frame = useCurrentFrame();
  const { cur, prev, p } = navState(frame, navs);
  return (
    <>
      {prev && p < 1 && <PageImg id={prev.page} scroll={scroll(prev.page, frame)} />}
      <div style={{ position: 'absolute', inset: 0, WebkitMaskImage: p < 1 ? `linear-gradient(180deg, #000 0%, #000 ${p * 135 - 35}%, rgba(0,0,0,0) ${p * 135}%)` : undefined }}>
        <PageImg id={cur.page} scroll={scroll(cur.page, frame)} />
      </div>
    </>
  );
};

// Recorte que se levanta de la página (con su sombra y el hueco que deja). `lift` 0..1; `z` altura máxima.
export const Lift: React.FC<{ id: PageId; box: number[]; scroll: number; lift: number; z?: number; pad?: number; glow?: number; children?: React.ReactNode; tilt?: number }> = ({
  id, box, scroll, lift, z = 60, pad = 4, glow = 1, children, tilt = 0,
}) => {
  if (lift <= 0.001) return null;
  const [x, y, w, h] = box;
  const L = lift;
  return (
    <>
      {/* hueco en la página */}
      <div style={{ position: 'absolute', left: x - pad, top: BAR + y - scroll - pad, width: w + 2 * pad, height: h + 2 * pad, borderRadius: 4, transform: 'translateZ(0.5px)',
        background: `rgba(52,40,28,${0.16 * L})`, boxShadow: `inset 0 2px 8px rgba(0,0,0,${0.25 * L})` }} />
      <div style={{ position: 'absolute', left: x - pad, top: BAR + y - scroll - pad, width: w + 2 * pad, height: h + 2 * pad, transformStyle: 'preserve-3d',
        transform: `translateZ(${z * L}px) rotateX(${tilt * L}deg) scale(${1 + 0.035 * L})` }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 4, boxShadow: `0 ${10 + 26 * L}px ${24 + 40 * L}px rgba(0,0,0,${0.32 * L}), 0 0 0 ${1.5 * glow}px rgba(243,208,143,${0.9 * L * glow}), 0 0 ${26 * glow}px rgba(255,214,150,${0.45 * L * glow})` }} />
        <Crop id={id} box={box} pad={pad} radius={4} />
        {children}
      </div>
    </>
  );
};

// Nota a mano en un papelito (verde azulado de LibriVox), que se escribe palabra a palabra
export const Slip: React.FC<{ text: string; at: number; x: number; y: number; z?: number; size?: number; anchor?: 'left' | 'center' | 'right'; icon?: React.ReactNode; out?: number; rot?: number }> = ({
  text, at, x, y, z = 80, size = 24, anchor = 'center', icon, out = 1e9, rot = -1.5,
}) => {
  const frame = useCurrentFrame();
  const a = ramp(frame, at, at + 14, eOut);
  const o = a * (1 - ramp(frame, out, out + 12));
  if (o <= 0.01) return null;
  const words = text.split(' ');
  const tx = anchor === 'left' ? '0%' : anchor === 'right' ? '-100%' : '-50%';
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translateZ(${z}px) translate(${tx}, -50%) rotate(${rot}deg) translateY(${(1 - a) * 8}px)`, opacity: o, whiteSpace: 'nowrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.4, padding: `${size * 0.22}px ${size * 0.55}px ${size * 0.28}px`, borderRadius: 3, background: '#fbf6ea',
        boxShadow: '0 6px 16px rgba(0,0,0,0.28), 0 0 0 1px rgba(120,100,70,0.18)', fontFamily: T.serif, fontStyle: 'italic', fontSize: size, color: T.teal, lineHeight: 1.1 }}>
        {icon}
        <span>{words.map((wd, i) => {
          const k = ramp(frame, at + 2 + i * 3, at + 10 + i * 3, eOut);
          return <span key={i} style={{ opacity: k, filter: k < 0.98 ? `blur(${(1 - k) * 2}px)` : undefined }}>{wd}{i < words.length - 1 ? ' ' : ''}</span>;
        })}</span>
      </div>
    </div>
  );
};

// Círculo de tinta a mano alrededor de [x, y, w, h] (coordenadas de la ventana)
export const InkRing: React.FC<{ box: number[]; at: number; dur?: number; z?: number; color?: string; width?: number; out?: number; seed?: number; padX?: number; padY?: number }> = ({
  box, at, dur = 16, z = 82, color = T.teal, width = 2.6, out = 1e9, seed = 1, padX = 10, padY = 8,
}) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, at, at + dur, eOut);
  const o = 1 - ramp(frame, out, out + 12);
  if (p <= 0 || o <= 0) return null;
  const [x, y, w, h] = box;
  const rx = w / 2 + padX, ry = h / 2 + padY;
  const cx = rx + 6, cy = ry + 6;
  const pts: string[] = [];
  const N = 60;
  for (let i = 0; i <= N; i++) {
    const t = -2.7 + (i / N) * (2 * Math.PI + 0.5);
    const wob = 1 + 0.035 * Math.sin(t * 3 + seed) + 0.02 * Math.sin(t * 5 + seed * 2);
    const drift = (i / N) * 4;
    pts.push(`${(cx + Math.cos(t) * rx * wob).toFixed(1)},${(cy + Math.sin(t) * ry * wob - drift).toFixed(1)}`);
  }
  const W = 2 * rx + 12, H = 2 * ry + 12;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: x + w / 2 - W / 2, top: y + h / 2 - H / 2, overflow: 'visible', opacity: o, transform: `translateZ(${z}px)` }}>
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength={1} style={{ strokeDasharray: `${p} 1` }} />
    </svg>
  );
};

// Cursor (flecha) y onda de clic
export const Cursor: React.FC<{ x: number; y: number; o: number; z?: number; press?: number }> = ({ x, y, o, z = 150, press = 0 }) => {
  if (o <= 0.01) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translateZ(${z}px) scale(${1 - 0.12 * press})`, transformOrigin: '0 0', opacity: o, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.45))' }}>
      <svg width="26" height="38" viewBox="0 0 26 38" style={{ display: 'block', marginLeft: -2, marginTop: -2 }}><path d="M2 2 L2 30 L9 23.5 L14 35 L19 33 L14 21.5 L23.5 21.5 Z" fill="#fff" stroke="#1d1a17" strokeWidth="2" strokeLinejoin="round" /></svg>
    </div>
  );
};
export const Ripple: React.FC<{ x: number; y: number; at: number; z?: number }> = ({ x, y, at, z = 148 }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, at, at + 20, eOut);
  if (frame < at || p >= 1) return null;
  return (
    <div style={{ position: 'absolute', left: x - 30, top: y - 30, width: 60, height: 60, borderRadius: 30, transform: `translateZ(${z}px) scale(${0.2 + 0.8 * p})`, border: `3px solid ${T.teal}`, opacity: 1 - p, background: `rgba(134,188,203,${0.25 * (1 - p)})` }} />
  );
};
