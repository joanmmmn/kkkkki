import React from 'react';
import { AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { coverURL, HAS_ILLUSTRATION } from './covers';
import { useFontsReady } from './three/lib3d';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut, Key, keyframes } from '../../lib/anim';
import { Stage } from '../../components/Stage';

// ————————————————————————————————————————————————————————————————
// «AUTOR: Por dónde y cómo empezar a leer» · sistema visual del episodio de Stephen King.
// Base SonorBooks (blanco cálido, amarillo #FFCA05, tinta, Ubuntu) + un rojo de episodio para el miedo y los hilos,
// y el escenario «noche» de la marca para el gancho y el tablero de conexiones.
// ————————————————————————————————————————————————————————————————

export const KR = '#C1121F'; // rojo King
export const KR_DEEP = '#7A0A12';
export const KR_SOFT = '#FBE7E8';
export const PAPER = '#F6F1E7';

export const SERIES = 'AUTOR · Por dónde y cómo empezar a leer';

// Fondo claro del episodio: el cálido de SonorBooks con un halo rojo muy tenue abajo a la izquierda y grano fino.
export const SkStage: React.FC<{ children?: React.ReactNode; still?: boolean; redGlow?: number }> = ({ children, still = false, redGlow = 1 }) => {
  const frame = useCurrentFrame();
  const t = still ? 0 : frame / 50;
  const g = still ? 0 : Math.floor(frame / 2);
  return (
    <Stage tone="warm" still={still}>
      <div style={{ position: 'absolute', width: 1500, height: 1500, borderRadius: '50%', left: -760 + Math.sin(t * 0.11) * 110, bottom: -960 + Math.cos(t * 0.09) * 80,
        background: `radial-gradient(circle, rgba(193,18,31,${0.075 * redGlow}) 0%, rgba(193,18,31,${0.02 * redGlow}) 38%, rgba(193,18,31,0) 62%)` }} />
      <Grain seed={g} opacity={0.06} />
      {children}
    </Stage>
  );
};

// Fondo noche: el «night» de la marca, más hondo, con un foco cálido que respira y polvo en suspensión.
export const SkNight: React.FC<{ children?: React.ReactNode; still?: boolean; lamp?: [number, number]; dust?: boolean }> = ({ children, still = false, lamp = [960, 420], dust = true }) => {
  const frame = useCurrentFrame();
  const t = still ? 0 : frame / 50;
  const g = still ? 0 : Math.floor(frame / 2);
  const breathe = 1 + 0.04 * Math.sin(t * 0.9);
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, #2E3036 0%, #1E1F23 55%, #121315 100%)', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: lamp[0] - 900, top: lamp[1] - 700, width: 1800, height: 1400, borderRadius: '50%', transform: `scale(${breathe})`,
        background: 'radial-gradient(ellipse, rgba(255,214,120,0.16) 0%, rgba(255,214,120,0.05) 40%, rgba(255,214,120,0) 68%)' }} />
      <div style={{ position: 'absolute', width: 1400, height: 1400, borderRadius: '50%', right: -640 + Math.cos(t * 0.13) * 90, bottom: -820 + Math.sin(t * 0.1) * 70,
        background: 'radial-gradient(circle, rgba(193,18,31,0.16) 0%, rgba(193,18,31,0) 60%)' }} />
      {dust && <Dust />}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.45) 100%)' }} />
      <Grain seed={g} opacity={0.09} />
      {children}
    </AbsoluteFill>
  );
};

export const Grain: React.FC<{ seed: number; opacity?: number }> = ({ seed, opacity = 0.07 }) => {
  const gx = Math.floor(random(`skg-gx-${seed}`) * 512);
  const gy = Math.floor(random(`skg-gy-${seed}`) * 512);
  return <AbsoluteFill style={{ backgroundImage: `url(${staticFile('pdr/img/grain.png')})`, backgroundSize: '512px 512px', backgroundPosition: `${gx}px ${gy}px`, opacity, mixBlendMode: 'overlay', pointerEvents: 'none' }} />;
};

// Polvo que flota en la luz (determinista).
export const Dust: React.FC<{ n?: number; color?: string }> = ({ n = 46, color: c = 'rgba(255,230,180,0.55)' }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {Array.from({ length: n }).map((_, i) => {
        const r = (k: string) => random(`dust-${i}-${k}`);
        const x = (r('x') * 2100 + frame * (0.15 + r('vx') * 0.35)) % 2100 - 90;
        const y = (r('y') * 1200 - frame * (0.08 + r('vy') * 0.25) + 2400) % 1200 - 60;
        const s = 1.5 + r('s') * 3.2;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(frame / (30 + r('t') * 40) + r('p') * 6));
        return <div key={i} style={{ position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%', background: c, opacity: tw * (0.4 + r('o') * 0.6), filter: s > 3.6 ? 'blur(1px)' : undefined }} />;
      })}
    </AbsoluteFill>
  );
};

// Nieve (para las escenas de Maine, el hotel y la tormenta). `wind` inclina la caída.
export const Snow: React.FC<{ n?: number; wind?: number; speed?: number; opacity?: number; size?: number; seed?: string; area?: [number, number] }> = ({ n = 120, wind = 0.6, speed = 1, opacity = 0.9, size = 1, seed = 'snow', area = [1920, 1080] }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: area[0], height: area[1], overflow: 'hidden', pointerEvents: 'none' }}>
      {Array.from({ length: n }).map((_, i) => {
        const r = (k: string) => random(`${seed}-${i}-${k}`);
        const depth = 0.35 + r('d') * 0.65;
        const vy = (1.2 + r('v') * 1.6) * depth * speed;
        const y = (r('y') * (area[1] + 80) + frame * vy) % (area[1] + 80) - 40;
        const x = (r('x') * (area[0] + 200) + frame * wind * depth + Math.sin(frame / (25 + r('w') * 30) + r('p') * 6) * 12 * depth) % (area[0] + 200) - 100;
        const s = (2 + depth * 6) * size;
        return <div key={i} style={{ position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%', background: '#fff', opacity: opacity * (0.35 + depth * 0.65), filter: depth < 0.55 ? 'blur(1.2px)' : undefined }} />;
      })}
    </div>
  );
};

// ———————————————— Libros ————————————————

export type IconKind =
  | 'hotel' | 'typewriter' | 'corridor' | 'calendar' | 'letter' | 'tiara' | 'feather' | 'boat' | 'virus' | 'tower' | 'moon' | 'key'
  | 'magnifier' | 'eye' | 'bat' | 'pencil' | 'mask' | 'dog' | 'car' | 'notebook' | 'pulse' | 'fog' | 'stars' | 'phone' | 'door';

export type BookDef = {
  title: string; year?: number; bg: string; fg: string; accent: string; icon: IconKind; author?: string; hours?: string; narrator?: string;
  spineTitle?: string; num?: number;
};

// Datos de duración y narrador: fichas de SonorBooks España (14/10/2026).
export const BOOKS: Record<string, BookDef> = {
  resplandor: { title: 'El resplandor', year: 1977, bg: '#1B2838', fg: '#F4EFE6', accent: '#E3463C', icon: 'hotel', hours: '18 h 32 min', narrator: 'Julio Caycedo' },
  misery: { title: 'Misery', year: 1987, bg: '#EEE7D9', fg: '#1A1A1A', accent: KR, icon: 'typewriter', hours: '14 h 12 min', narrator: 'Jane Santos' },
  milla: { title: 'La milla verde', year: 1996, bg: '#2D5A3D', fg: '#F2EEDC', accent: '#E8D59A', icon: 'corridor', hours: '14 h 34 min', narrator: 'Juan Sebastián Aragón' },
  d2263: { title: '22/11/63', year: 2011, bg: '#D8A23F', fg: '#1C1C1C', accent: '#8C1C13', icon: 'calendar', hours: '32 h 43 min', narrator: 'Carlos Manuel Vesga' },
  mercedes: { title: 'Mr. Mercedes', year: 2014, bg: '#121212', fg: '#FFFFFF', accent: '#FFCA05', icon: 'letter', hours: '17 h 18 min', narrator: 'Carlos Manuel Vesga' },
  carrie: { title: 'Carrie', year: 1974, bg: '#F1D5DA', fg: '#3A0A10', accent: KR, icon: 'tiara', hours: '7 h 25 min', narrator: 'José Posada' },
  elevacion: { title: 'Elevación', year: 2018, bg: '#DCE8F4', fg: '#16324F', accent: '#3F6E9E', icon: 'feather', hours: '3 h 17 min', narrator: 'Cristian Villamil' },
  it: { title: 'It', year: 1986, bg: '#7A0A12', fg: '#F7F1E8', accent: '#F7F1E8', icon: 'boat', hours: '46 h 24 min', narrator: 'Julio Caycedo' },
  apocalipsis: { title: 'Apocalipsis', year: 1978, bg: '#3B3E44', fg: '#F2F2F2', accent: '#E5484D', icon: 'virus', hours: '48 h 16 min', narrator: 'Cristian Villamil' },
  doctor: { title: 'Doctor Sueño', year: 2013, bg: '#24314A', fg: '#F4EFE6', accent: '#9DB8E2', icon: 'moon', hours: '21 h 18 min', narrator: 'Carlos Manuel Vesga' },
  cuento: { title: 'Cuento de hadas', year: 2022, bg: '#4A2E80', fg: '#F7E9C6', accent: '#F2C94C', icon: 'key', hours: '25 h 50 min', narrator: 'Julio Caycedo' },
  holly: { title: 'Holly', year: 2023, bg: '#F4F1EA', fg: '#101010', accent: '#2457C5', icon: 'magnifier', hours: '18 h 25 min' },
  visitante: { title: 'El visitante', year: 2018, bg: '#5A3F31', fg: '#F4EFE6', accent: '#F2C94C', icon: 'eye', hours: '21 h 3 min' },
  quien: { title: 'Quien pierde paga', year: 2015, bg: '#103E40', fg: '#F2EEDC', accent: '#F2C94C', icon: 'notebook', hours: '15 h 12 min' },
  fin: { title: 'Fin de guardia', year: 2016, bg: '#38393D', fg: '#F2F2F2', accent: '#6FD39A', icon: 'pulse', hours: '14 h 28 min' },
  christine: { title: 'Christine', year: 1983, bg: '#8C1C13', fg: '#F7F1E8', accent: '#F2C94C', icon: 'car' },
  dolores: { title: 'Dolores Claiborne', year: 1992, bg: '#3E5566', fg: '#F1ECE2', accent: '#E9D9A6', icon: 'moon' },
  gerald: { title: 'El juego de Gerald', year: 1992, bg: '#5B2333', fg: '#F7F1E8', accent: '#E9D9A6', icon: 'key' },
  billy: { title: 'Billy Summers', year: 2021, bg: '#2F3A2E', fg: '#F2EEDC', accent: '#E8D59A', icon: 'notebook', hours: '18 h 13 min' },
  cuatro: { title: 'Las cuatro estaciones', year: 1982, bg: '#E8DCC4', fg: '#2A2A2A', accent: '#8C1C13', icon: 'stars' },
  umbral: { title: 'El umbral de la noche', year: 1978, bg: '#1F2630', fg: '#EFE9DF', accent: '#9DB8E2', icon: 'door' },
  oscuridad: { title: 'Si te gusta la oscuridad', year: 2024, bg: '#101010', fg: '#F2F2F2', accent: '#C1121F', icon: 'moon', hours: '22 h 1 min' },
  salem: { title: "El misterio de Salem's Lot", year: 1975, bg: '#2A2E33', fg: '#EFE9DF', accent: KR, icon: 'bat', spineTitle: "Salem's Lot" },
  mientras: { title: 'Mientras escribo', year: 2000, bg: '#FFFFFF', fg: '#101010', accent: '#FFCA05', icon: 'pencil' },
  bachman: { title: 'Rabia', year: 1977, bg: '#CBC3B5', fg: '#1D1D1D', accent: '#1D1D1D', icon: 'mask', author: 'Richard Bachman' },
  torre1: { title: 'El pistolero', year: 1982, bg: '#2B2238', fg: '#F1E6D2', accent: '#D9A441', icon: 'tower', num: 1, hours: '7 h 44 min' },
  torre2: { title: 'La llegada de los tres', year: 1987, bg: '#2F2540', fg: '#F1E6D2', accent: '#D9A441', icon: 'door', num: 2, hours: '13 h 55 min' },
  torre3: { title: 'Las tierras baldías', year: 1991, bg: '#33283F', fg: '#F1E6D2', accent: '#D9A441', icon: 'stars', num: 3, hours: '19 h 13 min' },
  torre4: { title: 'Mago y cristal', year: 1997, bg: '#372A45', fg: '#F1E6D2', accent: '#D9A441', icon: 'moon', num: 4, hours: '29 h 6 min' },
  torre5: { title: 'Lobos del Calla', year: 2003, bg: '#3B2D49', fg: '#F1E6D2', accent: '#D9A441', icon: 'eye', num: 5, hours: '29 h 16 min' },
  torre6: { title: 'Canción de Susannah', year: 2004, bg: '#3F304D', fg: '#F1E6D2', accent: '#D9A441', icon: 'key', num: 6, hours: '15 h 35 min' },
  torre7: { title: 'La Torre Oscura', year: 2004, bg: '#433352', fg: '#F1E6D2', accent: '#D9A441', icon: 'tower', num: 7, hours: '34 h' },
};

// Títulos en español de sus novelas (orden de publicación, hasta 2025): lomos del gancho.
export const NOVELS: string[] = [
  'Carrie', "El misterio de Salem's Lot", 'El resplandor', 'Rabia', 'Apocalipsis', 'La larga marcha', 'La zona muerta', 'Ojos de fuego', 'Carretera maldita',
  'Cujo', 'El fugitivo', 'El pistolero', 'Christine', 'Cementerio de animales', 'El ciclo del hombre lobo', 'El talismán', 'Los ojos del dragón', 'Maleficio',
  'It', 'La llegada de los tres', 'Misery', 'Los Tommyknockers', 'La mitad oscura', 'Las tierras baldías', 'La tienda', 'El juego de Gerald', 'Dolores Claiborne',
  'Insomnia', 'Rose Madder', 'La milla verde', 'Desesperación', 'Posesión', 'Mago y cristal', 'Un saco de huesos', 'La chica que amaba a Tom Gordon',
  'El cazador de sueños', 'Casa Negra', 'Buick 8', 'Lobos del Calla', 'Canción de Susannah', 'La Torre Oscura', 'Colorado Kid', 'Cell', 'La historia de Lisey',
  'Blaze', 'Duma Key', 'La cúpula', '22/11/63', 'El viento por la cerradura', 'Joyland', 'Doctor Sueño', 'Mr. Mercedes', 'Revival', 'Quien pierde paga',
  'Fin de guardia', 'Bellas durmientes', 'El visitante', 'Elevación', 'El Instituto', 'Después', 'Billy Summers', 'Cuento de hadas', 'Holly', 'No tengas miedo',
];

// Iconos propios de las cubiertas (trazo, viewBox 24×24). Ilustraciones genéricas, sin portadas ni personajes reales.
export const CoverIcon: React.FC<{ kind: IconKind; size: number; c: string; sw?: number; fill?: string }> = ({ kind, size, c, sw = 1.3, fill = 'none' }) => {
  const p = { stroke: c, strokeWidth: sw, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const body = (() => {
    switch (kind) {
      case 'hotel':
        return (<>
          <path d="M3 20.5h18" {...p} /><path d="M5 20.5V9.5L12 5l7 4.5v11" {...p} />
          {[0, 1, 2].map((r) => [0, 1, 2, 3].map((k) => <rect key={`${r}${k}`} x={6.6 + k * 2.9} y={10.2 + r * 3.2} width={1.4} height={1.6} rx={0.2} fill={r === 1 && k === 2 ? c : 'none'} stroke={c} strokeWidth={sw * 0.7} />))}
          <path d="M11 20.5v-2.6h2v2.6" {...p} />
        </>);
      case 'typewriter':
        return (<>
          <path d="M7 9V3.5h10V9" {...p} /><path d="M9 5.5h6M9 7h4" {...p} strokeWidth={sw * 0.7} />
          <rect x="3" y="9" width="18" height="9" rx="2" {...p} />
          {[0, 1, 2, 3, 4, 5].map((k) => <circle key={k} cx={6 + k * 2.4} cy={12.5} r={0.6} fill={c} />)}
          {[0, 1, 2, 3, 4].map((k) => <circle key={`b${k}`} cx={7.2 + k * 2.4} cy={14.8} r={0.6} fill={c} />)}
          <path d="M5 20.5h14" {...p} />
        </>);
      case 'corridor':
        return (<>
          <rect x="4" y="3.5" width="16" height="17" rx="1.2" {...p} /><path d="M4 8h16" {...p} />
          {[0, 1, 2, 3].map((k) => <path key={k} d={`M${7.2 + k * 3.2} 8v12.5`} {...p} />)}
          <rect x="12.8" y="12.5" width="2.2" height="2.6" rx="0.5" fill={c} stroke="none" />
        </>);
      case 'calendar':
        return (<>
          <rect x="3.5" y="5" width="17" height="15.5" rx="2" {...p} /><path d="M3.5 9.5h17M8 3v4M16 3v4" {...p} />
          {[0, 1, 2].map((r) => [0, 1, 2, 3].map((k) => <rect key={`${r}${k}`} x={6 + k * 3.3} y={11.6 + r * 2.8} width={1.7} height={1.5} rx={0.3} fill={r === 1 && k === 2 ? c : 'none'} stroke={c} strokeWidth={sw * 0.6} />))}
        </>);
      case 'letter':
        return (<>
          <rect x="3" y="6" width="18" height="13" rx="1.6" {...p} /><path d="m3.5 7 8.5 6.5L20.5 7" {...p} /><circle cx="17.5" cy="16" r="1.6" fill={c} stroke="none" />
        </>);
      case 'tiara':
        return (<>
          <path d="M3.5 17.5 5 8.5l4 4 3-6.5 3 6.5 4-4 1.5 9z" {...p} /><path d="M3.5 20h17" {...p} /><circle cx="12" cy="5" r="1" fill={c} />
        </>);
      case 'feather':
        return (<>
          <path d="M19.5 4.5c-6 .5-12 5-13 13.5 6-.5 12.5-5 13-13.5z" {...p} /><path d="M4 20.5 15 9.5" {...p} />
        </>);
      case 'boat':
        return (<>
          <path d="M3 14.5h18l-3 4.5H6z" {...p} /><path d="M12 14.5V4l6 10.5M12 4 7 14.5" {...p} /><path d="M2.5 21.5c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 3-1" {...p} strokeWidth={sw * 0.8} />
        </>);
      case 'virus':
        return (<>
          <circle cx="12" cy="12" r="5" {...p} />
          {Array.from({ length: 8 }).map((_, k) => { const a = (k * Math.PI) / 4; return <g key={k}><path d={`M${12 + Math.cos(a) * 5} ${12 + Math.sin(a) * 5}L${12 + Math.cos(a) * 8} ${12 + Math.sin(a) * 8}`} {...p} /><circle cx={12 + Math.cos(a) * 8.8} cy={12 + Math.sin(a) * 8.8} r={0.9} fill={c} /></g>; })}
          <circle cx="10.5" cy="11" r="1" fill={c} /><circle cx="13.5" cy="13.2" r="0.8" fill={c} />
        </>);
      case 'tower':
        return (<>
          <path d="M9 21V7.5l3-4.5 3 4.5V21" {...p} /><path d="M7 21h10M9 7.5h6" {...p} /><rect x="11.2" y="10" width="1.6" height="2.4" rx="0.8" fill={c} /><rect x="11.2" y="15" width="1.6" height="2.4" rx="0.8" {...p} strokeWidth={sw * 0.7} />
        </>);
      case 'moon':
        return <path d="M17.5 15.5A7.5 7.5 0 0 1 9 4.6a7.5 7.5 0 1 0 8.5 10.9z" {...p} />;
      case 'key':
        return (<><circle cx="7.5" cy="12" r="4" {...p} /><path d="M11.5 12h9M17.5 12v3M20.5 12v2.2" {...p} /><circle cx="7.5" cy="12" r="1.3" {...p} /></>);
      case 'magnifier':
        return (<><circle cx="10" cy="10" r="6" {...p} /><path d="m14.5 14.5 6 6" {...p} strokeWidth={sw * 1.4} /></>);
      case 'eye':
        return (<><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" {...p} /><circle cx="12" cy="12" r="3" fill={c} /></>);
      case 'bat':
        return <path d="M12 9.5c-1 0-1.5-1-1.5-1L9.8 10C7 8 3.5 9 2 11.5c2 0 3 1 3.5 2.5 1-1 2.5-1 3.5 0 .8-.8 2-1 3 0 1-1 2.2-.8 3 0 1-1 2.5-1 3.5 0 .5-1.5 1.5-2.5 3.5-2.5C20.5 9 17 8 14.2 10l-.7-1.5S13 9.5 12 9.5z" {...p} />;
      case 'pencil':
        return (<><path d="M4 20l1.2-4.6L16.5 4.1a2 2 0 0 1 2.8 0l.6.6a2 2 0 0 1 0 2.8L8.6 18.8z" {...p} /><path d="m14.5 6 3.5 3.5M5.2 15.4l3.4 3.4" {...p} /></>);
      case 'mask':
        return (<><path d="M2.5 9.5c3-1.5 6-1.5 9.5.5 3.5-2 6.5-2 9.5-.5-.3 4-2.6 6.5-5.5 6.5-2 0-3-1.5-4-2.5-1 1-2 2.5-4 2.5-2.9 0-5.2-2.5-5.5-6.5z" {...p} /><ellipse cx="7.5" cy="11.6" rx="1.8" ry="1.1" fill={c} /><ellipse cx="16.5" cy="11.6" rx="1.8" ry="1.1" fill={c} /></>);
      case 'dog':
        return (<><circle cx="12" cy="15" r="3.6" {...p} /><circle cx="6.5" cy="9.5" r="1.8" {...p} /><circle cx="10" cy="6.5" r="1.8" {...p} /><circle cx="14" cy="6.5" r="1.8" {...p} /><circle cx="17.5" cy="9.5" r="1.8" {...p} /></>);
      case 'car':
        return (<><path d="M3 15.5v-3l2-5h14l2 5v3z" {...p} /><path d="M5 12.5h14" {...p} /><circle cx="7.5" cy="17" r="1.8" {...p} /><circle cx="16.5" cy="17" r="1.8" {...p} /></>);
      case 'notebook':
        return (<><rect x="5" y="3.5" width="14" height="17" rx="1.5" {...p} /><path d="M8.5 8h7M8.5 11.5h7M8.5 15h4" {...p} /><path d="M5 7H3.5M5 12H3.5M5 17H3.5" {...p} /></>);
      case 'pulse':
        return <path d="M2.5 12.5h5l2-5 3.5 10 2.5-7 1.5 2h4.5" {...p} />;
      case 'fog':
        return <path d="M3 8h13M6 12h15M3 16h12M8 20h9" {...p} />;
      case 'stars':
        return (<><path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z" {...p} /><path d="m18 15 .8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8z" {...p} /></>);
      case 'phone':
        return (<><rect x="7" y="2.5" width="10" height="19" rx="2" {...p} /><path d="M10.5 18.5h3" {...p} /></>);
      case 'door':
        return (<><path d="M6 21V3.5h12V21" {...p} /><path d="M4 21h16" {...p} /><circle cx="15" cy="12.5" r="0.9" fill={c} /></>);
      default:
        return null;
    }
  })();
  return <svg width={size} height={size} viewBox="0 0 24 24" style={{ overflow: 'visible', display: 'block' }} fill={fill}>{body}</svg>;
};

// Cubierta de la colección del vídeo (diseño propio, ver covers.ts): tela, dorados con relieve e ilustración en un arco.
// Se dibuja una vez en canvas y se usa como imagen; <Img> espera a que esté decodificada antes de capturar el fotograma.
let KEY_OF: Map<BookDef, string> | null = null;
export const keyOf = (b: BookDef) => {
  if (!KEY_OF) KEY_OF = new Map(Object.entries(BOOKS).map(([k, v]) => [v, k]));
  return KEY_OF.get(b) ?? b.title;
};
export const Cover: React.FC<{ b: BookDef; w: number; h: number; shine?: number }> = ({ b, w, h, shine = 0 }) => {
  const ready = useFontsReady();
  const key = keyOf(b);
  const res = w >= 280 ? 1200 : w >= 170 ? 800 : w >= 110 ? 560 : 400;
  const src = ready ? coverURL(b, key, res) : null;
  return (
    <div style={{ position: 'absolute', inset: 0, background: b.bg, overflow: 'hidden' }}>
      {src && <Img src={src} style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, display: 'block' }} />}
      {!HAS_ILLUSTRATION(key) && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: h * 0.27, display: 'flex', justifyContent: 'center' }}>
          <CoverIcon kind={b.icon} size={w * 0.4} c={b.accent} sw={1.25} />
        </div>
      )}
      {shine > 0 && (
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(115deg, rgba(255,255,255,0) ${20 + shine * 60}%, rgba(255,255,255,0.22) ${30 + shine * 60}%, rgba(255,255,255,0) ${42 + shine * 60}%)` }} />
      )}
    </div>
  );
};

// Libro en 3D (CSS): cubierta, contracubierta, lomo y cantos de páginas. `ry`/`rx`/`rz` en grados. La luz llega de arriba a la izquierda.
// Sin `filter` en ninguna cara: en un contexto 3D Chrome a veces pinta la cara entera en negro durante un fotograma.
// El sombreado va con capas semitransparentes encima de cada cara.
const spineInk = (b: BookDef) => {
  const n = parseInt(b.bg.slice(1), 16);
  const l = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return l > 0.62 ? b.fg : '#E2C072';
};
const Shade: React.FC<{ k: number }> = ({ k }) => (k === 0 ? null : (
  <div style={{ position: 'absolute', inset: 0, background: k > 0 ? `rgba(0,0,0,${Math.min(0.9, k).toFixed(3)})` : `rgba(255,255,255,${Math.min(0.5, -k).toFixed(3)})`, pointerEvents: 'none' }} />
));
export const Book3D: React.FC<{
  b: BookDef; w?: number; h?: number; d?: number; rx?: number; ry?: number; rz?: number; floorShadow?: boolean; shine?: number; style?: React.CSSProperties; persp?: number;
}> = ({ b, w = 300, h = 450, d = 64, rx = 0, ry = -18, rz = 0, floorShadow = true, shine = 0, style, persp = 2600 }) => {
  const rad = (ry * Math.PI) / 180;
  const frontShade = 0.1 - 0.1 * Math.cos(rad);
  const spineShade = 0.45 - 0.35 * Math.max(0, Math.sin(-rad)) - 0.25;
  const pageShade = 0.28 - 0.25 * Math.max(0, Math.sin(rad));
  const face: React.CSSProperties = { position: 'absolute', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' };
  return (
    <div style={{ width: w, height: h, perspective: persp, position: 'relative', ...style }}>
      {floorShadow && (
        <div style={{ position: 'absolute', left: -w * 0.08, right: -w * 0.08, bottom: -h * 0.09, height: h * 0.16, borderRadius: '50%', background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.14) 38%, rgba(0,0,0,0) 70%)',
          transform: `translateX(${Math.sin(rad) * w * 0.12}px) scaleX(${0.85 + 0.15 * Math.abs(Math.cos(rad))})` }} />
      )}
      <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)` }}>
        {/* cubierta */}
        <div style={{ ...face, left: 0, top: 0, width: w, height: h, transform: `translateZ(${d / 2}px)`, borderRadius: `${w * 0.012}px ${w * 0.03}px ${w * 0.03}px ${w * 0.012}px`, overflow: 'hidden', background: b.bg }}>
          <Cover b={b} w={w} h={h} shine={shine} />
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: w * 0.045, background: 'linear-gradient(90deg, rgba(0,0,0,0.25), rgba(255,255,255,0.08) 60%, rgba(0,0,0,0))' }} />
          <Shade k={frontShade} />
        </div>
        {/* contracubierta */}
        <div style={{ ...face, left: 0, top: 0, width: w, height: h, transform: `rotateY(180deg) translateZ(${d / 2}px)`, background: b.bg, overflow: 'hidden' }}>
          <BackCover b={b} w={w} h={h} />
          <Shade k={0.18} />
        </div>
        {/* lomo */}
        <div style={{ ...face, left: (w - d) / 2, top: 0, width: d, height: h, transform: `rotateY(-90deg) translateZ(${w / 2}px)`, background: b.bg, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.3), rgba(255,255,255,0.10) 40%, rgba(0,0,0,0.28))' }} />
          {[0.06, 0.075, 0.925, 0.94].map((t, i) => <div key={i} style={{ position: 'absolute', left: d * 0.1, right: d * 0.1, top: h * t, height: Math.max(1.5, h * (i % 3 === 0 ? 0.005 : 0.0028)), background: spineInk(b) }} />)}
          <div style={{ position: 'absolute', left: 0, right: 0, top: h * 0.1, bottom: h * 0.1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ transform: 'rotate(90deg)', whiteSpace: 'nowrap', fontFamily: font.serif, fontWeight: 500, fontSize: d * 0.36, color: spineInk(b), letterSpacing: 0.5 }}>
              {b.spineTitle ?? b.title}<span style={{ fontFamily: font.sans, fontWeight: 700, opacity: 0.75, marginLeft: d * 0.4, fontSize: d * 0.2, letterSpacing: 2.5 }}>{(b.author ?? 'Stephen King').toUpperCase()}</span>
            </div>
          </div>
          <Shade k={spineShade} />
        </div>
        {/* páginas (canto derecho) */}
        <div style={{ ...face, left: (w - d) / 2, top: h * 0.012, width: d, height: h * 0.976, transform: `rotateY(90deg) translateZ(${w / 2 - w * 0.012}px)`,
          background: 'repeating-linear-gradient(90deg, #F3EEE2 0px, #F3EEE2 2px, #DCD5C4 2.6px, #F3EEE2 3.4px)' }}>
          <Shade k={pageShade} />
        </div>
        {/* cantos superior e inferior */}
        <div style={{ ...face, left: 0, top: (h - d) / 2, width: w * 0.985, height: d, transform: `rotateX(90deg) translateZ(${h / 2}px)`, background: 'repeating-linear-gradient(0deg, #F6F2E8 0px, #F6F2E8 2px, #DED7C6 2.6px)' }} />
        <div style={{ ...face, left: 0, top: (h - d) / 2, width: w * 0.985, height: d, transform: `rotateX(-90deg) translateZ(${h / 2}px)`, background: '#9C9686' }} />
      </div>
    </div>
  );
};

// Contracubierta de la colección: sinopsis en líneas, sello y código de barras genéricos.
export const BackCover: React.FC<{ b: BookDef; w: number; h: number }> = ({ b, w, h }) => {
  const k = w / 300;
  return (
    <div style={{ position: 'absolute', inset: 0, background: b.bg }}>
      <div style={{ position: 'absolute', left: 16 * k, right: 16 * k, top: 16 * k, bottom: 16 * k, border: `${1.4 * k}px solid ${b.accent}`, opacity: 0.45, borderRadius: 3 * k }} />
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} style={{ position: 'absolute', left: 46 * k, top: h * 0.2 + i * 18 * k, height: 5 * k, borderRadius: 3 * k, width: `${(i === 8 ? 40 : 62 + ((i * 17) % 18))}%`, background: b.fg, opacity: 0.32 }} />
      ))}
      <div style={{ position: 'absolute', right: 40 * k, bottom: 40 * k, width: 70 * k, height: 44 * k, background: '#fff', borderRadius: 2 * k, padding: 5 * k, display: 'flex', gap: 1.6 * k }}>
        {Array.from({ length: 16 }).map((_, i) => <div key={i} style={{ flex: (i * 7) % 3 === 0 ? 2 : 1, background: '#111' }} />)}
      </div>
    </div>
  );
};

// Lomo plano (para estanterías y torres de libros).
export const Spine: React.FC<{ title: string; w: number; h: number; bg: string; fg?: string; accent?: string; style?: React.CSSProperties; author?: boolean }> = ({ title, w, h, bg, fg = '#F4EFE6', accent, style, author = true }) => (
  <div style={{ position: 'relative', width: w, height: h, background: bg, borderRadius: 3, overflow: 'hidden', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.12), 0 6px 14px rgba(0,0,0,0.25)', ...style }}>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.25), rgba(255,255,255,0.12) 40%, rgba(0,0,0,0.22))' }} />
    {accent && <div style={{ position: 'absolute', left: 0, right: 0, top: h * 0.07, height: Math.max(2, h * 0.012), background: accent, opacity: 0.8 }} />}
    {accent && <div style={{ position: 'absolute', left: 0, right: 0, bottom: h * 0.07, height: Math.max(2, h * 0.012), background: accent, opacity: 0.8 }} />}
    <div style={{ position: 'absolute', left: 0, right: 0, top: h * 0.12, bottom: h * 0.12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ transform: 'rotate(90deg)', whiteSpace: 'nowrap', fontFamily: font.sans, fontWeight: 700, fontSize: Math.min(w * 0.42, (h * 0.8) / Math.max(6, title.length * 0.62)), color: fg, letterSpacing: 0.3 }}>
        {title}{author && <span style={{ opacity: 0.55, marginLeft: w * 0.4, fontSize: '0.7em', letterSpacing: 1.5 }}>KING</span>}
      </div>
    </div>
  </div>
);

// Libro tumbado visto de canto (para pilas horizontales).
export const LyingBook: React.FC<{ title: string; w: number; h: number; bg: string; fg?: string; accent?: string; style?: React.CSSProperties; author?: boolean; fontScale?: number }> = ({ title, w, h, bg, fg = '#F4EFE6', accent, style, author = true, fontScale = 0.42 }) => (
  <div style={{ position: 'relative', width: w, height: h, background: bg, borderRadius: 3, overflow: 'hidden', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.14), 0 4px 10px rgba(0,0,0,0.25)', ...style }}>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.14), rgba(0,0,0,0) 45%, rgba(0,0,0,0.25))' }} />
    {accent && <div style={{ position: 'absolute', top: 0, bottom: 0, left: w * 0.05, width: Math.max(2, w * 0.008), background: accent, opacity: 0.85 }} />}
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', paddingLeft: w * 0.09, fontFamily: font.sans, fontWeight: 700, fontSize: Math.min(h * fontScale, 26), color: fg, whiteSpace: 'nowrap' }}>{title}</div>
    {author && <div style={{ position: 'absolute', right: w * 0.04, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: h * 0.3, letterSpacing: 2, color: fg, opacity: 0.55 }}>KING</div>}
  </div>
);

// ———————————————— Cámara ————————————————
// Envoltorio con cámara suave por fotogramas clave (zoom y encuadre). `s` = escala, `x`/`y` = desplazamiento en px, `r` = giro.
export type CamK = Key & { s: number; x: number; y: number; r?: number };
export const Cam: React.FC<{ keys: CamK[]; children: React.ReactNode; origin?: string; style?: React.CSSProperties }> = ({ keys, children, origin = '50% 50%', style }) => {
  const frame = useCurrentFrame();
  const k = (p: string) => keyframes(frame, keys, p, easeInOut);
  const r = keys.some((q) => q.r !== undefined) ? keyframes(frame, keys.map((q) => ({ ...q, r: q.r ?? 0 })), 'r', easeInOut) : 0;
  return (
    <AbsoluteFill style={{ transform: `translate(${k('x')}px, ${k('y')}px) scale(${k('s')}) rotate(${r}deg)`, transformOrigin: origin, ...style }}>
      {children}
    </AbsoluteFill>
  );
};

// Muelle reutilizable: 0 → 1 desde `at`.
export const useSpring = (at: number, damping = 16, stiffness = 150) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, stiffness } });
};
export const ramp = (frame: number, a: number, b: number, ez = easeInOut) => interpolate(frame, [a, b], [0, 1], { ...clamp, easing: ez });
export const rampOut = (frame: number, a: number, b: number) => interpolate(frame, [a, b], [0, 1], { ...clamp, easing: easeOut });

// ———————————————— Datos en pantalla ————————————————

// Medidor de miedo: tres marcas que se llenan de rojo.
export const FearMeter: React.FC<{ level: 0 | 1 | 2 | 3; at: number; size?: number; label?: string; dark?: boolean }> = ({ level, at, size = 34, label = 'Miedo', dark = false }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.45 }}>
      <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: size * 0.72, color: dark ? 'rgba(255,255,255,0.7)' : color.ink2, letterSpacing: 0.5 }}>{label}</span>
      {[0, 1, 2].map((i) => {
        const on = i < level;
        const p = on ? interpolate(frame, [at + i * 5, at + i * 5 + 10], [0, 1], { ...clamp, easing: easeOut }) : 0;
        return (
          <span key={i} style={{ position: 'relative', width: size * 1.05, height: size * 0.5, borderRadius: size * 0.25, background: dark ? 'rgba(255,255,255,0.14)' : '#ECE8E2', overflow: 'hidden' }}>
            <span style={{ position: 'absolute', inset: 0, background: KR, transform: `scaleX(${p})`, transformOrigin: 'left', borderRadius: size * 0.25 }} />
          </span>
        );
      })}
    </div>
  );
};

// Píldora de dato (año, horas, narrador) con icono redondo.
export const Fact: React.FC<{ at: number; icon?: React.ReactNode; label: string; sub?: string; size?: number; dark?: boolean; accent?: string; out?: number }> = ({ at, icon, label, sub, size = 32, dark = false, accent = color.yellow, out }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 15, stiffness: 180 } });
  const o = out !== undefined ? interpolate(frame, [out - 8, out], [0, 1], { ...clamp, easing: easeInOut }) : 0;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.42, padding: `${size * 0.3}px ${size * 0.7}px ${size * 0.3}px ${size * 0.32}px`, borderRadius: 999,
      background: dark ? 'rgba(255,255,255,0.08)' : '#fff', border: dark ? '1px solid rgba(255,255,255,0.14)' : `1px solid ${color.line}`, boxShadow: dark ? 'none' : shadow.soft,
      opacity: s * (1 - o), transform: `translateY(${(1 - s) * 22 - o * 10}px) scale(${0.9 + 0.1 * s})`, filter: s < 0.98 ? `blur(${(1 - s) * 5}px)` : undefined, whiteSpace: 'nowrap' }}>
      {icon && <span style={{ width: size * 1.35, height: size * 1.35, borderRadius: '50%', background: accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</span>}
      <span style={{ display: 'inline-flex', flexDirection: 'column' }}>
        <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: size, color: dark ? '#fff' : color.ink, letterSpacing: -0.2 }}>{label}</span>
        {sub && <span style={{ fontFamily: font.sans, fontWeight: 500, fontSize: size * 0.6, color: dark ? 'rgba(255,255,255,0.62)' : color.muted, marginTop: 1 }}>{sub}</span>}
      </span>
    </div>
  );
};

// Iconos de línea pequeños para los datos.
export const MiniIcon: React.FC<{ kind: 'clock' | 'mic' | 'cal' | 'head' | 'pin' | 'globe' | 'book' | 'film' | 'flag'; size?: number; c?: string }> = ({ kind, size = 24, c = color.ink }) => {
  const p = { stroke: c, strokeWidth: 2, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {kind === 'clock' && (<><circle cx="12" cy="12" r="8.5" {...p} /><path d="M12 7.5V12l3 2" {...p} /></>)}
      {kind === 'mic' && (<><rect x="9" y="3" width="6" height="11" rx="3" {...p} /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" {...p} /></>)}
      {kind === 'cal' && (<><rect x="4" y="5" width="16" height="15" rx="2" {...p} /><path d="M4 10h16M8.5 3v4M15.5 3v4" {...p} /></>)}
      {kind === 'head' && (<><path d="M4 15v-3a8 8 0 0 1 16 0v3" {...p} /><rect x="3" y="14" width="4.5" height="7" rx="1.8" fill={c} /><rect x="16.5" y="14" width="4.5" height="7" rx="1.8" fill={c} /></>)}
      {kind === 'pin' && (<><path d="M12 21s6.5-5.8 6.5-11a6.5 6.5 0 1 0-13 0c0 5.2 6.5 11 6.5 11z" {...p} /><circle cx="12" cy="10" r="2.2" fill={c} /></>)}
      {kind === 'globe' && (<><circle cx="12" cy="12" r="8.5" {...p} /><path d="M3.5 12h17M12 3.5c2.5 2.4 3.8 5.2 3.8 8.5s-1.3 6.1-3.8 8.5c-2.5-2.4-3.8-5.2-3.8-8.5S9.5 5.9 12 3.5z" {...p} /></>)}
      {kind === 'book' && (<><path d="M3 5.5C6 4 9 4 12 6c3-2 6-2 9-.5V19c-3-1.5-6-1.5-9 .5-3-2-6-2-9-.5z" {...p} /><path d="M12 6v13.5" {...p} /></>)}
      {kind === 'film' && (<><rect x="3.5" y="5" width="17" height="14" rx="2" {...p} /><path d="M7.5 5v14M16.5 5v14M3.5 9.5h4M3.5 14.5h4M16.5 9.5h4M16.5 14.5h4" {...p} /></>)}
      {kind === 'flag' && (<><path d="M5 21V4M5 4.5h11l-2 3.5 2 3.5H5" {...p} /></>)}
    </svg>
  );
};

// Barra de duración (horas de audiolibro) con escala común: `maxH` horas = `width` px.
export const HoursBar: React.FC<{ hours: number; label: string; at: number; width?: number; maxH?: number; h?: number; c?: string; dark?: boolean; dur?: number; showValue?: string; size?: number; trackAt?: number }> = ({
  hours, label, at, width = 1300, maxH = 50, h = 26, c = color.ink, dark = false, dur = 34, showValue, size = 1, trackAt,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: easeOut });
  const t0 = trackAt ?? at - 4;
  const lab = interpolate(frame, [t0, t0 + 12], [0, 1], { ...clamp, easing: easeOut });
  const len = (hours / maxH) * width * p;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, opacity: lab }}>
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 34 * size, color: dark ? '#fff' : color.ink }}>{label}</div>
      <div style={{ position: 'relative', width, height: h, borderRadius: h / 2, background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(16,16,16,0.06)' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: len, borderRadius: h / 2, background: c }} />
        <div style={{ position: 'absolute', left: len + 18, top: '50%', transform: 'translateY(-50%)', fontFamily: font.sans, fontWeight: 700, fontSize: 30 * size, color: dark ? '#fff' : color.ink, whiteSpace: 'nowrap', opacity: p > 0.05 ? 1 : 0 }}>
          {showValue ?? `${(hours * p).toFixed(0)} h`}
        </div>
      </div>
    </div>
  );
};

// Hilo rojo que se dibuja entre dos puntos con una curva que cuelga (tablero de conexiones).
export const Thread: React.FC<{ a: [number, number]; b: [number, number]; at: number; dur?: number; sag?: number; c?: string; w?: number }> = ({ a, b, at, dur = 22, sag = 70, c = KR, w = 4 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: easeInOut });
  if (p <= 0) return null;
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2 + sag + Math.sin(frame / 30) * 2;
  const d = `M${a[0]} ${a[1]} Q ${mx} ${my} ${b[0]} ${b[1]}`;
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]) * 1.25 + sag;
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
      <path d={d} stroke="rgba(0,0,0,0.35)" strokeWidth={w} fill="none" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} transform="translate(3 6)" style={{ filter: 'blur(3px)' }} />
      <path d={d} stroke={c} strokeWidth={w} fill="none" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} />
    </svg>
  );
};

// Chincheta.
export const Pin: React.FC<{ x: number; y: number; at: number; c?: string }> = ({ x, y, at, c = KR }) => {
  const s = useSpring(at, 11, 220);
  return (
    <div style={{ position: 'absolute', left: x - 13, top: y - 13, width: 26, height: 26, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #ff7b7b, ${c} 55%, ${KR_DEEP})`,
      boxShadow: '0 6px 10px rgba(0,0,0,0.45)', transform: `scale(${s})` }} />
  );
};

// Ilustración genérica de un oyente con auriculares (silueta plana).
export const Listener: React.FC<{ size?: number; c?: string }> = ({ size = 200, c = color.ink }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="34" r="17" fill={c} />
    <path d="M18 98c2-22 15-34 32-34s30 12 32 34z" fill={c} />
    <path d="M31 36a19 19 0 0 1 38 0" stroke={color.yellow} strokeWidth="5" fill="none" />
    <rect x="26" y="32" width="9" height="14" rx="4" fill={color.yellow} />
    <rect x="65" y="32" width="9" height="14" rx="4" fill={color.yellow} />
  </svg>
);

export { color, font, shadow };
