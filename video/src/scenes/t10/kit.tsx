import React from 'react';
import { AbsoluteFill, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { CoverIcon, Dust, Grain, IconKind, KR, MiniIcon } from '../skg/kit';

// ————————————————————————————————————————————————————————————————
// «Los 10 mejores» · Terror. Sistema visual del episodio: casi todo de noche, con una linterna de luz cálida
// (el amarillo de SonorBooks rebajado) que va descubriendo cada libro. Rojo para el miedo, blanco roto para el texto.
// v2 (14/10, petición de Joan): portadas reales de los audiolibros (fx.tsx). Las cubiertas tipográficas (Cover10, Book10) quedan sin uso.
// ————————————————————————————————————————————————————————————————

export const SERIES = 'Los 10 mejores';
export const GENRE = 'Terror';
export const RED = KR;
export const BONE = '#EFE8DC';
export const DIM = 'rgba(239,232,220,0.62)';
export const BEAM = 'rgba(255,220,140,';

export type T10Icon = IconKind | 'tentacle' | 'heart' | 'puppet' | 'field' | 'wardrobe' | 'house' | 'cross' | 'tv';

export type Narr = {
  label?: string; who: string; sub?: string; voice: string; dur: string; rating: number; votes: number; source: string; plats: string[];
};
export type Book10 = {
  n: number; title: string; author: string; year?: number; bg: string; fg: string; accent: string; icon: T10Icon; spine?: string;
  narr: Narr[];
};

// Datos comprobados el 14/10/2026 (Audible España salvo indicación): ver research/top10/terror/guion.md.
export const BOOKS10: Book10[] = [
  { n: 10, title: 'La llamada de Cthulhu', author: 'H. P. Lovecraft', year: 1928, bg: '#0E2A2C', fg: '#E6F0EC', accent: '#63D2B4', icon: 'tentacle', spine: 'Cthulhu',
    narr: [{ who: 'Benjamín Figueres', sub: 'Saga Egmont · 2022', voice: 'Castellano', dur: '2 h', rating: 4.5, votes: 55, source: 'Audible', plats: ['Audible', 'Storytel', 'Nextory', 'Podimo', 'BookBeat'] }] },
  { n: 9, title: 'Cuentos extraordinarios', author: 'Edgar Allan Poe', bg: '#171615', fg: '#F2EEE6', accent: '#D2283A', icon: 'heart', spine: 'Cuentos',
    narr: [
      { label: 'La recopilación · 37 relatos', who: 'Jordi Boixaderas', sub: 'Audible Studios · 2022', voice: 'Castellano', dur: '21 h', rating: 4.6, votes: 38, source: 'Audible', plats: ['Audible'] },
      { label: 'Para probar · dramatizado', who: '«El corazón delator»', sub: 'Pablo López · Saga Egmont', voice: 'Castellano', dur: '15 min', rating: 5.0, votes: 25, source: 'Audible', plats: ['Audible', 'Storytel'] },
    ] },
  { n: 8, title: 'Cómo vender una casa encantada', author: 'Grady Hendrix', year: 2023, bg: '#EFE0C2', fg: '#2A1A12', accent: '#B5452B', icon: 'puppet', spine: 'Casa encantada',
    narr: [{ who: 'Esther Cordero', sub: 'Planeta Audio · 2023', voice: 'Castellano', dur: '14 h', rating: 4.4, votes: 160, source: 'Audible', plats: ['Audible', 'Storytel', 'Nextory', 'Podimo', 'BookBeat'] }] },
  { n: 7, title: 'Distancia de rescate', author: 'Samanta Schweblin', year: 2014, bg: '#C8D1A3', fg: '#1E2A14', accent: '#5E7424', icon: 'field',
    narr: [{ who: 'Paula Pichersky', sub: 'Planeta Audio · 2025', voice: 'Castellano', dur: '2 h 51 min', rating: 4.4, votes: 98, source: 'Audible', plats: ['Audible', 'Storytel', 'Nextory', 'Podimo', 'BookBeat'] }] },
  { n: 6, title: 'Drácula', author: 'Bram Stoker', year: 1897, bg: '#3A0A10', fg: '#F4E9DA', accent: '#E9C46A', icon: 'bat',
    narr: [
      { label: 'Entera', who: 'José Coronado y Sol de la Barreda', sub: 'Audible Studios · 2020', voice: 'Castellano', dur: '18 h 33 min', rating: 4.8, votes: 647, source: 'Audible', plats: ['Audible', 'Apple Books'] },
      { label: 'Audible Original · adaptación libre', who: 'Asier Etxeandia, Claudia Salas…', sub: 'Dirigida por Carlota Pereda · +25 actores', voice: 'Castellano', dur: '5 h 50 min', rating: 4.7, votes: 164, source: 'Audible', plats: ['Audible'] },
    ] },
  { n: 5, title: 'Apocalipsis Z', author: 'Manel Loureiro', year: 2007, bg: '#262B25', fg: '#ECEDE6', accent: '#9BD14B', icon: 'virus',
    narr: [
      { label: 'Audible Original · ficción sonora', who: 'Javier Rey y Maggie Civantos', sub: 'y 15 actores más', voice: 'Castellano', dur: '5 h 56 min', rating: 4.7, votes: 264, source: 'Audible', plats: ['Audible', 'Apple Books'] },
      { label: 'La novela completa', who: 'Voz sintética autorizada', sub: 'Réplica de la voz de Octavi Pujades', voice: 'Castellano', dur: '14 h 29 min', rating: 4.4, votes: 134, source: 'Storytel', plats: ['Storytel', 'Nextory', 'Podimo', 'BookBeat'] },
    ] },
  { n: 4, title: 'Carcoma', author: 'Layla Martínez', year: 2021, bg: '#5E3F28', fg: '#F6EBDD', accent: '#E7C9A0', icon: 'wardrobe',
    narr: [{ who: 'Paula Iwasaki', sub: 'Storyside · 2024', voice: 'Castellano', dur: '3 h', rating: 4.6, votes: 406, source: 'Audible', plats: ['Audible', 'Storytel', 'Podimo', 'Apple Books'] }] },
  { n: 3, title: "El misterio de Salem's Lot", author: 'Stephen King', year: 1975, bg: '#23272C', fg: '#EFE9DF', accent: '#D93A3A', icon: 'house', spine: "Salem's Lot",
    narr: [{ who: 'Xavi Fernández', sub: 'Penguin Random House · 2016', voice: 'Castellano', dur: '16 h 56 min', rating: 4.9, votes: 19, source: 'Audible', plats: ['Audible', 'Apple Books', 'Google Play'] }] },
  { n: 2, title: 'Nuestra parte de noche', author: 'Mariana Enriquez', year: 2019, bg: '#15102A', fg: '#EDE6F7', accent: '#B48CF2', icon: 'eye',
    narr: [{ who: 'Mara Brenner', sub: 'Anagrama · 2021', voice: 'Acento argentino', dur: '23 h 14 min', rating: 4.7, votes: 213, source: 'Audible', plats: ['Audible', 'Storytel', 'Nextory', 'Podimo', 'BookBeat'] }] },
  { n: 1, title: 'El exorcista', author: 'William Peter Blatty', year: 1971, bg: '#0B0B0C', fg: '#F2F2F2', accent: '#9DB8E2', icon: 'cross',
    narr: [{ who: 'Fernando Solís', sub: 'Penguin Random House Audio · 2023', voice: 'Voz latina', dur: '13 h 11 min', rating: 4.9, votes: 64, source: 'Audible EE. UU.', plats: ['Audible', 'Apple Books', 'Google Play'] }] },
];
export const bookAt = (p: number) => BOOKS10[p - 1];
export const NUM_WORDS = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];

// ———————————————— Iconos de cubierta (trazo, 24×24) ————————————————
export const Icon10: React.FC<{ kind: T10Icon; size: number; c: string; sw?: number }> = ({ kind, size, c, sw = 1.3 }) => {
  const p = { stroke: c, strokeWidth: sw, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const own = (() => {
    switch (kind) {
      case 'tentacle':
        return (<>
          <path d="M12 21c-.5-4 2.5-5.5 2-9-.4-2.6-3-3.2-3-5.5 0-1.6 1.4-2.5 2.8-2" {...p} />
          <path d="M6.5 21c.8-3 3-3.6 2.6-6.2-.3-1.8-2.2-2.4-2-4.3" {...p} />
          <path d="M17.6 21c-.6-2.6.9-3.6.6-5.6-.2-1.3-1.4-1.8-1.3-3.1" {...p} />
          {[[13.2, 9.4], [12.4, 12.6], [13.6, 15.8], [8.6, 14.6], [17.9, 16.8]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r={0.55} fill={c} stroke="none" />)}
          <path d="M3 21h18" {...p} strokeWidth={sw * 0.7} />
        </>);
      case 'heart':
        return (<>
          <path d="M12 19.5s-7-4.3-7-9.4A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.1c0 5.1-7 9.4-7 9.4z" {...p} />
          <path d="M3 22h18M5 22v-1.4M9 22v-1.4M13 22v-1.4M17 22v-1.4" {...p} strokeWidth={sw * 0.6} />
        </>);
      case 'puppet':
        return (<>
          <path d="M6 2.5h12M8.5 2.5v5M15.5 2.5v4M12 2.5v3.5" {...p} strokeWidth={sw * 0.6} />
          <circle cx="12" cy="9" r="3" {...p} />
          <path d="M10.6 8.6h.01M13.4 8.6h.01" {...p} strokeWidth={sw * 1.6} />
          <path d="M10.8 10.4c.8.5 1.6.5 2.4 0" {...p} strokeWidth={sw * 0.8} />
          <path d="M9 12.8 6.5 16M15 12.8l2.8 2.2M12 12v6M12 18l-2 3.5M12 18l2 3.5" {...p} />
        </>);
      case 'field':
        return (<>
          <path d="M2.5 20.5 10 9.5M21.5 20.5 14 9.5M7 20.5l4-11M17 20.5l-4-11M12 20.5v-11" {...p} strokeWidth={sw * 0.7} />
          <path d="M2.5 9.5h19" {...p} />
          <path d="M6 6.2c1.5-.8 3-.8 4.5 0s3 .8 4.5 0 3-.8 4 0" {...p} strokeWidth={sw * 0.8} />
          <circle cx="18" cy="3.6" r="1.1" fill={c} stroke="none" />
        </>);
      case 'wardrobe':
        return (<>
          <rect x="5" y="3" width="14" height="17" rx="1" {...p} />
          <path d="M12 3v17M5 20.5 4.5 22M19 20.5l.5 1.5" {...p} />
          <path d="M10.6 11v2M13.4 11v2" {...p} strokeWidth={sw * 1.2} />
          {[[7.4, 6], [8.2, 15.6], [16.4, 7.4], [15.2, 17.2], [17, 13]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r={0.45} fill={c} stroke="none" />)}
        </>);
      case 'house':
        return (<>
          <path d="M2.5 21.5c4-3.2 15-3.2 19 0" {...p} strokeWidth={sw * 0.8} />
          <path d="M7 18.6V10l5-4.5 5 4.5v8.4" {...p} />
          <path d="M5.5 11.2 12 5.3l6.5 5.9" {...p} />
          <rect x="10.8" y="11.2" width="2.4" height="2.6" rx="0.3" fill={c} stroke="none" />
          <path d="M9 18.5v-2.6h1.8v2.6" {...p} strokeWidth={sw * 0.7} />
        </>);
      case 'cross':
        return (<>
          <path d="M12 3v18M7.5 8h9" {...p} strokeWidth={sw * 1.2} />
          <path d="M4 21h16" {...p} strokeWidth={sw * 0.7} />
        </>);
      case 'tv':
        return (<>
          <rect x="3" y="6" width="18" height="13" rx="2" {...p} /><path d="m9 2.5 3 3.5 3-3.5" {...p} />
          <path d="M6 10h4M8 13h7M6 16h3" {...p} strokeWidth={sw * 0.7} />
        </>);
      default:
        return null;
    }
  })();
  if (own) return <svg width={size} height={size} viewBox="0 0 24 24" style={{ overflow: 'visible', display: 'block' }}>{own}</svg>;
  return <CoverIcon kind={kind as IconKind} size={size} c={c} sw={sw} />;
};

// Cubierta tipográfica de la colección (diseño propio, igual para los diez).
export const Cover10: React.FC<{ b: Book10; w: number; h: number; shine?: number }> = ({ b, w, h, shine = 0 }) => {
  const k = w / 300;
  const L = b.title.length;
  const titleSize = (L > 24 ? 25 : L > 18 ? 29 : L > 12 ? 35 : L > 8 ? 42 : 52) * k;
  return (
    <div style={{ position: 'absolute', inset: 0, background: b.bg, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${staticFile('pdr/img/grain.png')})`, backgroundSize: `${256 * k}px`, opacity: 0.16, mixBlendMode: 'overlay' }} />
      <div style={{ position: 'absolute', left: 16 * k, right: 16 * k, top: 16 * k, bottom: 16 * k, border: `${1.4 * k}px solid ${b.accent}`, opacity: 0.55, borderRadius: 3 * k }} />
      <div style={{ position: 'absolute', left: 20 * k, right: 20 * k, top: 40 * k, textAlign: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 14 * k, letterSpacing: 3.6 * k, textTransform: 'uppercase', color: b.fg, opacity: 0.92 }}>
        {b.author}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: h * 0.25, display: 'flex', justifyContent: 'center' }}>
        <Icon10 kind={b.icon} size={w * 0.42} c={b.accent} sw={1.25} />
      </div>
      <div style={{ position: 'absolute', left: 24 * k, right: 24 * k, top: h * 0.63, textAlign: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: titleSize, lineHeight: 1.03, letterSpacing: -0.02 * titleSize, color: b.fg }}>
        {b.title}
      </div>
      {b.year && <div style={{ position: 'absolute', left: 0, right: 0, bottom: 32 * k, textAlign: 'center', fontFamily: font.serif, fontSize: 18 * k, color: b.fg, opacity: 0.7 }}>{b.year}</div>}
      {shine > 0 && (
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(115deg, rgba(255,255,255,0) ${20 + shine * 60}%, rgba(255,255,255,0.22) ${30 + shine * 60}%, rgba(255,255,255,0) ${42 + shine * 60}%)` }} />
      )}
    </div>
  );
};

// Libro en 3D (CSS). La luz llega de arriba a la izquierda; `lit` oscurece el libro cuando la linterna no lo alumbra.
export const Book10: React.FC<{ b: Book10; w?: number; h?: number; d?: number; rx?: number; ry?: number; rz?: number; shine?: number; lit?: number; style?: React.CSSProperties }> = ({
  b, w = 300, h = 450, d = 58, rx = 0, ry = -18, rz = 0, shine = 0, lit = 1, style,
}) => {
  const rad = (ry * Math.PI) / 180;
  const lightFront = (0.9 + 0.1 * Math.cos(rad)) * (0.25 + 0.75 * lit);
  const spineDark = (0.55 + 0.35 * Math.max(0, Math.sin(-rad))) * (0.25 + 0.75 * lit);
  const pageDark = (0.72 + 0.25 * Math.max(0, Math.sin(rad))) * (0.25 + 0.75 * lit);
  const face: React.CSSProperties = { position: 'absolute', backfaceVisibility: 'hidden' };
  return (
    <div style={{ width: w, height: h, perspective: 2600, position: 'relative', ...style }}>
      <div style={{ position: 'absolute', left: w * 0.05, right: w * 0.05, bottom: -h * 0.05, height: h * 0.08, borderRadius: '50%', background: `radial-gradient(ellipse, rgba(0,0,0,${0.55 * lit}) 0%, rgba(0,0,0,0) 70%)`, filter: 'blur(6px)' }} />
      <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)` }}>
        <div style={{ ...face, left: 0, top: 0, width: w, height: h, transform: `translateZ(${d / 2}px)`, borderRadius: `${w * 0.012}px ${w * 0.03}px ${w * 0.03}px ${w * 0.012}px`, overflow: 'hidden', filter: `brightness(${lightFront})` }}>
          <Cover10 b={b} w={w} h={h} shine={shine} />
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: w * 0.045, background: 'linear-gradient(90deg, rgba(0,0,0,0.25), rgba(255,255,255,0.08) 60%, rgba(0,0,0,0))' }} />
        </div>
        <div style={{ ...face, left: 0, top: 0, width: w, height: h, transform: `rotateY(180deg) translateZ(${d / 2}px)`, background: b.bg, filter: 'brightness(0.6)' }} />
        <div style={{ ...face, left: (w - d) / 2, top: 0, width: d, height: h, transform: `rotateY(-90deg) translateZ(${w / 2}px)`, background: b.bg, filter: `brightness(${spineDark + 0.2})`, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.25), rgba(255,255,255,0.10) 45%, rgba(0,0,0,0.25))' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: h * 0.08, bottom: h * 0.08, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ transform: 'rotate(90deg)', whiteSpace: 'nowrap', fontFamily: font.sans, fontWeight: 700, fontSize: d * 0.3, color: b.fg }}>{b.spine ?? b.title}</div>
          </div>
        </div>
        <div style={{ ...face, left: (w - d) / 2, top: h * 0.012, width: d, height: h * 0.976, transform: `rotateY(90deg) translateZ(${w / 2 - w * 0.012}px)`,
          background: 'repeating-linear-gradient(90deg, #F3EEE2 0px, #F3EEE2 2px, #DCD5C4 2.6px, #F3EEE2 3.4px)', filter: `brightness(${pageDark})` }} />
        <div style={{ ...face, left: 0, top: (h - d) / 2, width: w * 0.985, height: d, transform: `rotateX(90deg) translateZ(${h / 2}px)`, background: 'repeating-linear-gradient(0deg, #F6F2E8 0px, #F6F2E8 2px, #DED7C6 2.6px)', filter: `brightness(${0.4 + 0.6 * lit})` }} />
      </div>
    </div>
  );
};

// ———————————————— Escenario ————————————————

// Noche del episodio: casi negro, con un halo rojo que respira abajo y polvo en suspensión.
export const Night: React.FC<{ children?: React.ReactNode; red?: number; dust?: boolean; tint?: string }> = ({ children, red = 1, dust = true, tint }) => {
  const frame = useCurrentFrame();
  const t = frame / 50;
  return (
    <AbsoluteFill style={{ background: tint ?? 'radial-gradient(ellipse at 50% 42%, #1B1C20 0%, #111215 55%, #08090A 100%)', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 1600, height: 1600, borderRadius: '50%', left: 160 + Math.sin(t * 0.1) * 120, top: 520 + Math.cos(t * 0.08) * 60,
        background: `radial-gradient(circle, rgba(193,18,31,${0.13 * red}) 0%, rgba(193,18,31,${0.03 * red}) 40%, rgba(193,18,31,0) 62%)` }} />
      {dust && <Dust n={40} color="rgba(255,226,170,0.45)" />}
      <Grain seed={Math.floor(frame / 2)} opacity={0.1} />
      {children}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.55) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

// Parpadeo de bombilla vieja (determinista): 1 casi siempre, con caídas breves.
export const flicker = (frame: number, seed: string, amount = 1) => {
  const a = random(`${seed}-${Math.floor(frame / 3)}`);
  const b = Math.sin(frame / 7 + random(seed) * 6) * 0.03;
  return 1 - amount * (a > 0.93 ? 0.55 * random(`${seed}-d-${frame}`) : 0) + b * amount;
};

// Linterna: oscuridad por encima de la escena con un círculo de luz cálida que se mueve. `on` 0 → 1 (encendido).
export const Flashlight: React.FC<{ x: number; y: number; r: number; on?: number; dark?: number; warm?: number; seed?: string }> = ({ x, y, r, on = 1, dark = 0.94, warm = 1, seed = 'fl' }) => {
  const frame = useCurrentFrame();
  const f = flicker(frame, seed, 0.6);
  const rr = Math.max(1, r * (0.25 + 0.75 * on));
  const a = dark * (1 - 0.0 * on);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${x}px ${y}px, rgba(0,0,0,${(a * (1 - on)).toFixed(3)}) 0px, rgba(0,0,0,${(a * (1 - on * 0.97)).toFixed(3)}) ${(rr * 0.45).toFixed(0)}px, rgba(0,0,0,${(a * (1 - on * 0.55)).toFixed(3)}) ${(rr * 0.85).toFixed(0)}px, rgba(0,0,0,${a.toFixed(3)}) ${(rr * 1.35).toFixed(0)}px)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${x}px ${y}px, ${BEAM}${(0.2 * on * f * warm).toFixed(3)}) 0px, ${BEAM}${(0.08 * on * f * warm).toFixed(3)}) ${(rr * 0.6).toFixed(0)}px, ${BEAM}0) ${rr.toFixed(0)}px)`, mixBlendMode: 'screen' }} />
    </AbsoluteFill>
  );
};

// Número de la cuenta atrás: gigante, con contorno y relleno que «se enciende» con parpadeo.
export const BigNum: React.FC<{ n: number; at: number; size?: number; x?: number; y?: number; out?: number; small?: number }> = ({ n, at, size = 620, x = 960, y = 540, out, small = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 18, stiffness: 120 } });
  const lit = interpolate(frame, [at + 2, at + 6, at + 8, at + 11, at + 14], [0, 0.9, 0.2, 1, 1], clamp) * flicker(frame, `num${n}`, 0.4);
  const o = out !== undefined ? interpolate(frame, [out - 10, out], [1, 0], { ...clamp, easing: easeInOut }) : 1;
  if (frame < at) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%, -52%) scale(${(0.86 + 0.14 * s) * (1 - 0.0 * small)})`, opacity: o,
      fontFamily: font.sans, fontWeight: 700, fontSize: size, lineHeight: 1, letterSpacing: -size * 0.06, whiteSpace: 'nowrap' }}>
      <span style={{ color: 'transparent', WebkitTextStroke: `${Math.max(2, size * 0.006)}px rgba(239,232,220,0.35)` }}>{n}</span>
      <span style={{ position: 'absolute', inset: 0, color: BONE, opacity: lit, textShadow: `0 0 ${size * 0.08}px rgba(255,220,140,${0.35 * lit})` }}>{n}</span>
    </div>
  );
};

// Píldoras de plataformas (texto, sin logotipos).
export const Plats: React.FC<{ names: string[]; at: number; size?: number; dark?: boolean }> = ({ names, at, size = 26, dark = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: size * 0.45 }}>
      {names.map((nm, i) => {
        const s = spring({ frame: frame - at - i * 3, fps, config: { damping: 15, stiffness: 200 } });
        return (
          <span key={nm} style={{ fontFamily: font.sans, fontWeight: 700, fontSize: size, padding: `${size * 0.32}px ${size * 0.72}px`, borderRadius: 999, whiteSpace: 'nowrap',
            background: dark ? 'rgba(255,255,255,0.08)' : '#fff', color: dark ? BONE : color.ink, border: dark ? '1px solid rgba(255,255,255,0.16)' : `1px solid ${color.line}`,
            opacity: s, transform: `translateY(${(1 - s) * 16}px) scale(${0.9 + 0.1 * s})`, display: 'inline-flex', alignItems: 'center', gap: size * 0.4 }}>
            <span style={{ width: size * 0.32, height: size * 0.32, borderRadius: '50%', background: color.yellow }} />{nm}
          </span>
        );
      })}
    </div>
  );
};

// Estrellas con relleno parcial.
export const Stars: React.FC<{ value: number; size?: number; at: number }> = ({ value, size = 30, at }) => {
  const frame = useCurrentFrame();
  return (
    <span style={{ display: 'inline-flex', gap: size * 0.14 }}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        const p = interpolate(frame, [at + i * 3, at + i * 3 + 10], [0, 1], { ...clamp, easing: easeOut });
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" style={{ transform: `scale(${0.6 + 0.4 * p})`, opacity: p }}>
            <defs><clipPath id={`st${i}-${Math.round(value * 10)}`}><rect x="0" y="0" width={24 * fill} height="24" /></clipPath></defs>
            <path d="m12 2.8 2.8 5.8 6.4.9-4.6 4.5 1.1 6.4L12 17.4l-5.7 3 1.1-6.4-4.6-4.5 6.4-.9z" fill="rgba(255,255,255,0.14)" />
            <path d="m12 2.8 2.8 5.8 6.4.9-4.6 4.5 1.1 6.4L12 17.4l-5.7 3 1.1-6.4-4.6-4.5 6.4-.9z" fill={color.yellow} clipPath={`url(#st${i}-${Math.round(value * 10)})`} />
          </svg>
        );
      })}
    </span>
  );
};

// Onda de voz (barras que respiran): la «narración» en pantalla.
export const Wave: React.FC<{ w: number; h: number; n?: number; c?: string; seed?: string; amp?: number }> = ({ w, h, n = 34, c = color.yellow, seed = 'wave', amp = 1 }) => {
  const frame = useCurrentFrame();
  const bw = w / n;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: bw * 0.38, width: w, height: h }}>
      {Array.from({ length: n }).map((_, i) => {
        const r = random(`${seed}-${i}`);
        const v = 0.18 + 0.82 * Math.abs(Math.sin(frame / (6 + r * 7) + r * 9)) * (0.45 + 0.55 * Math.abs(Math.sin(frame / 31 + i * 0.35)));
        return <div key={i} style={{ width: bw * 0.62, height: Math.max(3, h * v * amp), borderRadius: bw, background: c, opacity: 0.55 + 0.45 * v }} />;
      })}
    </div>
  );
};

// Chips narrativos (palabras clave de la sinopsis, con la voz).
export const StoryChips: React.FC<{ items: { label: string; at: number; red?: boolean }[]; left?: number; bottom?: number }> = ({ items, left = 90, bottom = 74 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: 'absolute', left, bottom, display: 'flex', gap: 16, flexWrap: 'wrap', width: 1740 }}>
      {items.map((it, i) => {
        if (frame < it.at - 3) return null;
        const s = spring({ frame: frame - it.at + 2, fps, config: { damping: 15, stiffness: 200 } });
        return (
          <div key={i} style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 38, padding: '13px 28px', borderRadius: 999, whiteSpace: 'nowrap',
            background: it.red ? RED : 'rgba(6,7,9,0.72)', color: '#fff', border: it.red ? 'none' : '1px solid rgba(255,255,255,0.16)', backdropFilter: 'blur(6px)',
            opacity: s, transform: `translateY(${(1 - s) * 20}px) scale(${0.9 + 0.1 * s})`, boxShadow: '0 10px 30px rgba(0,0,0,0.45)' }}>
            {it.label}
          </div>
        );
      })}
    </div>
  );
};

// Rótulo pequeño en mayúsculas con raya amarilla (versión noche del Kicker).
export const KickerN: React.FC<{ at: number; text: string; style?: React.CSSProperties; c?: string }> = ({ at, text, style, c = DIM }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 16], [0, 1], { ...clamp, easing: easeOut });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: font.sans, fontWeight: 700, fontSize: 26, letterSpacing: 5, textTransform: 'uppercase', color: c, ...style }}>
      <span style={{ width: 46 * p, height: 6, borderRadius: 3, background: color.yellow }} />
      <span style={{ opacity: p, transform: `translateX(${(1 - p) * -14}px)` }}>{text}</span>
    </div>
  );
};

export { CoverIcon, Dust, Grain, MiniIcon, color, font, shadow };
