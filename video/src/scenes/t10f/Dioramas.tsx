import React from 'react';
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Dust, Grain, flicker, font } from './kit';

// ————————————————————————————————————————————————————————————————
// «Los 10 mejores» · Fantasía (18/10/2026). Como en Terror v5: cada historia es un diorama de 1920×1080 con los objetos
// de la sinopsis; cada uno se activa cuando la voz lo nombra (`beats`, en fotogramas de la escena, en el orden de BEATS[p])
// y la cámara de Books.tsx va de uno a otro. Ilustraciones propias y genéricas: nada de portadas, carteles ni fotogramas
// de películas (ni el diseño de personajes de ninguna adaptación).
// ————————————————————————————————————————————————————————————————

export type Beat = { label: string; word: string; nth?: number; red?: boolean; f: [number, number, number] };
export const BEATS: Record<number, Beat[]> = {
  1: [{ label: 'Un conejo con reloj', word: 'conejo', f: [400, 690, 1.6] }, { label: 'La madriguera', word: 'madriguera', f: [850, 420, 1.45] },
    { label: 'Encoge y crece', word: 'encoge', f: [1240, 640, 1.7] }, { label: 'El té del sombrerero', word: 'té', f: [1650, 600, 1.6] },
    { label: '¡Que le corten la cabeza!', word: 'cabeza', red: true, f: [1400, 300, 1.45] }],
  2: [{ label: 'Hija del Sol', word: 'Sol', f: [420, 400, 1.5] }, { label: 'La brujería', word: 'brujería', f: [960, 620, 1.6] },
    { label: 'Desterrada a una isla', word: 'isla', f: [1480, 540, 1.45] }, { label: 'La temen los marineros', word: 'marineros', red: true, f: [1440, 740, 1.6] }],
  3: [{ label: 'La alacena', word: 'alacena', f: [330, 700, 1.7] }, { label: 'Un gigante en la puerta', word: 'gigante', f: [820, 560, 1.45] },
    { label: 'Eres un mago', word: 'mago', f: [1100, 380, 1.5] }, { label: 'Un colegio en un castillo', word: 'castillo', f: [1580, 360, 1.5] },
    { label: 'La piedra de la vida eterna', word: 'piedra', red: true, f: [1600, 800, 1.7] }],
  4: [{ label: 'Un agujero hobbit', word: 'agujero', f: [420, 680, 1.6] }, { label: 'Un mago', word: 'mago', f: [560, 640, 1.7] },
    { label: 'Trece enanos', word: 'enanos', f: [900, 780, 1.5] }, { label: 'Un tesoro', word: 'tesoro', f: [1500, 700, 1.5] },
    { label: 'Y un dragón', word: 'dragón', red: true, f: [1520, 560, 1.35] }],
  5: [{ label: 'Una posada perdida', word: 'posada', f: [480, 600, 1.4] }, { label: 'Un posadero pelirrojo', word: 'pelirrojo', f: [640, 560, 1.75] },
    { label: 'Un cronista', word: 'cronista', f: [1130, 700, 1.7] }, { label: 'El héroe de mil leyendas', word: 'leyendas', red: true, f: [1450, 320, 1.45] },
    { label: 'Tres días', word: 'tres', f: [1650, 680, 1.65] }],
  6: [{ label: 'El reino de Olar', word: 'Olar', f: [960, 360, 1.3] }, { label: 'Una maldición: no puede amar', word: 'maldición', red: true, f: [760, 640, 1.7] },
    { label: 'La reina Ardid', word: 'reina', f: [820, 600, 1.55] }, { label: 'Trasgos', word: 'trasgos', f: [330, 760, 1.6] },
    { label: 'Sirenas y piratas', word: 'sirenas', f: [1560, 700, 1.55] }],
  7: [{ label: 'Sus padres, asesinados', word: 'padres', f: [380, 620, 1.6] }, { label: 'Kirtash', word: 'Kirtash', red: true, f: [660, 640, 1.7] },
    { label: 'Tres soles y tres lunas', word: 'soles', f: [1460, 300, 1.45] }, { label: 'Sin dragones ni unicornios', word: 'dragones', f: [1460, 620, 1.5] },
    { label: 'La Resistencia', word: 'Resistencia', f: [1020, 700, 1.6] }],
  8: [{ label: 'Iba a ser escriba', word: 'escriba', f: [360, 660, 1.65] }, { label: 'Su madre, la general', word: 'general', f: [700, 600, 1.55] },
    { label: 'El Colegio de Guerra', word: 'Colegio', f: [1140, 400, 1.45] }, { label: 'Un dragón te elige', word: 'dragón', f: [1600, 420, 1.4] },
    { label: 'Muchos la quieren muerta', word: 'muerta', red: true, f: [960, 720, 1.5] }],
  9: [{ label: 'El héroe fracasó', word: 'héroe', f: [340, 560, 1.55] }, { label: 'Cae ceniza', word: 'ceniza', f: [960, 420, 1.3] },
    { label: 'Y de noche, niebla', word: 'niebla', f: [960, 640, 1.3] }, { label: 'Quema metales', word: 'metales', f: [1250, 620, 1.7] },
    { label: 'Derribar al dios', word: 'dios', nth: 1, red: true, f: [1620, 320, 1.5] }],
  10: [{ label: 'Un anillo de oro', word: 'anillo', f: [430, 640, 1.85] }, { label: 'Un mago', word: 'mago', f: [620, 580, 1.55] },
    { label: 'El Señor Oscuro', word: 'Oscuro', f: [1650, 320, 1.5] }, { label: 'El fuego donde se forjó', word: 'fuego', f: [1380, 480, 1.45] },
    { label: 'Mordor', word: 'Mordor', red: true, f: [1150, 760, 1.45] }],
};

type D = React.FC<{ t0: number; beats: number[] }>;
const W = 1920, H = 1080;
const pop = (f: number, at: number, d = 13, s = 170) => spring({ frame: f - at, fps: 50, config: { damping: d, stiffness: s } });
const rmp = (f: number, a: number, b: number, ez = easeInOut) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ez });
const EMBER = 'rgba(226,85,44,';

// ———————————————— Piezas ————————————————
const Stage: React.FC<{ bg: string; children: React.ReactNode; vignette?: number; dust?: string }> = ({ bg, children, vignette = 0.6, dust }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: bg, overflow: 'hidden' }}>
      {children}
      {dust && <Dust n={30} color={dust} />}
      <Grain seed={Math.floor(frame / 2)} opacity={0.09} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,${vignette}) 100%)`, pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};
const Glow: React.FC<{ x: number; y: number; r: number; c: string; a?: number }> = ({ x, y, r, c, a = 1 }) => (
  <div style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: `radial-gradient(circle, ${c} 0%, rgba(0,0,0,0) 68%)`, opacity: a, pointerEvents: 'none' }} />
);
type FigKind = 'stand' | 'child' | 'hood' | 'woman' | 'girl' | 'wizard' | 'queen' | 'giant' | 'braid' | 'cloak';
// Siluetas planas (100 de alto de referencia): (x, y) es el centro de los pies.
const Fig: React.FC<{ kind: FigKind; x: number; y: number; h: number; c?: string; style?: React.CSSProperties; flip?: boolean }> = ({ kind, x, y, h, c = '#050506', style, flip }) => {
  const s = h / 100;
  const d = {
    stand: 'M50 4a13 13 0 1 1 0 26a13 13 0 1 1 0-26zM28 36q22-8 44 0l8 44h-12l-2 20h-32l-2-20h-12z',
    child: 'M50 14a12 12 0 1 1 0 24a12 12 0 1 1 0-24zM34 42q16-6 32 0l6 36h-9l-2 22h-22l-2-22h-9z',
    hood: 'M50 2q22 6 24 34l10 64h-68l10-64q2-28 24-34z',
    woman: 'M50 6a12 12 0 1 1 0 24a12 12 0 1 1 0-24zM32 36q18-6 36 0l14 64h-64z',
    girl: 'M50 8a12 12 0 1 1 0 24a12 12 0 1 1 0-24zM37 14q-7 12-3 26l7-6zM63 14q7 12 3 26l-7-6zM38 36q12-5 24 0l20 50h-64zM41 86h5v14h-5zM54 86h5v14h-5z',
    wizard: 'M50 0l12 22h-24zM34 22h32v4h-32zM50 26a10 10 0 1 1 0 20a10 10 0 1 1 0-20zM44 42l6 18 6-18zM34 46q16-5 32 0l12 54h-56zM80 6h3v94h-3z',
    queen: 'M38 6l4 8 4-10 4 10 4-10 4 10 4-8v14h-24zM50 18a11 11 0 1 1 0 22a11 11 0 1 1 0-22zM34 42q16-6 32 0l18 58h-68z',
    giant: 'M50 2a16 16 0 1 1 0 32a16 16 0 1 1 0-32zM34 16q-10 10 0 26l8-10zM66 16q10 10 0 26l-8-10zM40 30q10 14 20 0l4 14h-28zM20 40q30-12 60 0l10 60h-80z',
    braid: 'M50 6a12 12 0 1 1 0 24a12 12 0 1 1 0-24zM60 18q10 10 8 28q-2 8 2 14l-5 1q-5-8-3-16q2-14-6-22zM34 36q16-6 32 0l10 64h-52z',
    cloak: 'M50 4a12 12 0 1 1 0 24a12 12 0 1 1 0-24zM36 30q14-4 28 0l26 70h-80z',
  }[kind];
  return <svg width={100 * s} height={100 * s} viewBox="0 0 100 100" style={{ position: 'absolute', left: x - 50 * s, top: y - 100 * s, overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined, ...style }}><path d={d} fill={c} /></svg>;
};
const Moon: React.FC<{ x: number; y: number; r: number; c?: string }> = ({ x, y, r, c = '#EEF2F8' }) => (
  <>
    <Glow x={x} y={y} r={r * 3.2} c="rgba(210,220,245,0.22)" />
    <div style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: c, boxShadow: `0 0 ${r}px rgba(230,238,255,0.6)` }} />
  </>
);
const Stars: React.FC<{ n?: number; h?: number; seed: string }> = ({ n = 70, h = 520, seed }) => {
  const frame = useCurrentFrame();
  return (<>{Array.from({ length: n }).map((_, i) => { const r = (k: string) => random(`${seed}${i}${k}`); return <div key={i} style={{ position: 'absolute', left: r('x') * W, top: r('y') * h, width: 2 + r('s') * 2, height: 2 + r('s') * 2, borderRadius: 2, background: '#fff', opacity: 0.2 + 0.6 * Math.abs(Math.sin(frame / (18 + r('t') * 30) + i)) }} />; })}</>);
};
// Partículas que suben (chispas, magia) o caen (ceniza).
const Motes: React.FC<{ n: number; x: number; y: number; w: number; h: number; c: string; up?: boolean; seed: string; a?: number; size?: number; speed?: number }> = ({ n, x, y, w, h, c, up = true, seed, a = 1, size = 5, speed = 1 }) => {
  const frame = useCurrentFrame();
  return (<>{Array.from({ length: n }).map((_, i) => {
    const r = (k: string) => random(`${seed}${i}${k}`);
    const p = ((frame * (0.6 + r('v')) * speed + r('y') * h) % h);
    const yy = up ? y + h - p : y + p;
    const xx = x + r('x') * w + Math.sin(frame / (20 + r('t') * 20) + i) * 14;
    const s = size * (0.5 + r('s'));
    return <div key={i} style={{ position: 'absolute', left: xx, top: yy, width: s, height: s, borderRadius: s, background: c, opacity: a * (0.4 + 0.6 * Math.sin((p / h) * Math.PI)), boxShadow: `0 0 ${s * 2}px ${c}` }} />;
  })}</>);
};
// Dragón (genérico) de perfil, con las alas batiendo.
const Dragon: React.FC<{ s?: number; flap: number; c?: string; eye?: number; eyeC?: string }> = ({ s = 1, flap, c = '#0b0605', eye = 0, eyeC = '#FFB43A' }) => {
  const wy = 40 * flap;
  return (
    <svg width={420 * s} height={220 * s} viewBox="0 0 420 220" style={{ overflow: 'visible' }}>
      <path d="M60 120 Q120 100 190 112 L250 108 Q300 96 340 80 L372 70 L360 86 L392 84 L356 100 Q330 120 290 126 L240 134 Q210 150 160 146 Q110 142 60 120 Z" fill={c} />
      <path d="M60 120 Q20 116 0 140 Q30 128 62 132 Z" fill={c} />
      <path d={`M190 112 Q170 ${40 - wy} 120 ${10 - wy * 1.4} Q170 ${50 - wy * 0.6} 150 ${70 - wy * 0.2} Q200 ${60 - wy * 0.5} 230 108 Z`} fill={c} />
      <path d={`M230 110 Q250 ${30 - wy} 300 ${-6 - wy * 1.2} Q270 ${50 - wy * 0.5} 262 ${80 - wy * 0.2} Q290 ${70 - wy * 0.3} 262 112 Z`} fill={c} opacity={0.85} />
      {eye > 0 && <ellipse cx="350" cy="84" rx="5" ry={3 * eye} fill={eyeC} style={{ filter: `drop-shadow(0 0 6px ${eyeC})` }} />}
    </svg>
  );
};
const Speech: React.FC<{ x: number; y: number; t: string; q: number; size?: number; bg?: string; fg?: string; rot?: number }> = ({ x, y, t, q, size = 34, bg = '#F6F0E6', fg = '#1a1210', rot = -3 }) => (
  q > 0.01 ? <div style={{ position: 'absolute', left: x, top: y, padding: '12px 22px', borderRadius: 20, background: bg, color: fg, fontFamily: font.serif, fontStyle: 'italic', fontWeight: 700, fontSize: size, whiteSpace: 'nowrap',
    boxShadow: '0 14px 30px rgba(0,0,0,0.45)', opacity: Math.min(1, q * 1.4), transform: `scale(${(0.6 + 0.4 * q).toFixed(3)}) rotate(${rot}deg)`, transformOrigin: '0% 100%' }}>{t}</div> : null
);

// ———————————————— 10 · Alicia en el País de las Maravillas ————————————————
const Rabbit: React.FC<{ s?: number; run: number }> = ({ s = 1, run }) => {
  const k = Math.sin(run);
  return (
    <svg width={170 * s} height={190 * s} viewBox="0 0 170 190" style={{ overflow: 'visible' }}>
      <path d={`M60 150 l${-14 + 10 * k} 34 h10 l${10 - 8 * k} -30zM100 150 l${10 - 10 * k} 34 h10 l${-6 + 8 * k} -32z`} fill="#EDEBE6" />
      <ellipse cx="82" cy="120" rx="36" ry="42" fill="#F4F2EE" />
      <path d="M52 96 Q82 84 112 96 L108 146 Q82 156 56 146 Z" fill="#B8322C" />
      <circle cx="82" cy="70" r="24" fill="#F4F2EE" />
      <path d="M72 50 Q62 4 70 0 Q82 8 80 50zM88 50 Q96 2 106 4 Q110 12 94 52z" fill="#F4F2EE" />
      <path d="M74 44 Q68 14 72 10 Q78 18 78 44z" fill="#E8B4B8" /><path d="M90 46 Q96 14 102 12 Q104 20 94 46z" fill="#E8B4B8" />
      <circle cx="92" cy="66" r="3.4" fill="#C2283A" />
      <circle cx="140" cy="112" r="16" fill="#E8C35A" stroke="#9A7420" strokeWidth={3} /><path d="M140 112 l0 -10 M140 112 l7 4" stroke="#3a2a10" strokeWidth={2.4} />
      <path d="M112 108 L126 110" stroke="#F4F2EE" strokeWidth={8} strokeLinecap="round" />
    </svg>
  );
};
const DAlicia: D = ({ beats: [bCon, bMad, bEnc, bTe, bCab] }) => {
  const frame = useCurrentFrame();
  const runX = interpolate(frame, [bCon - 34, bCon + 14], [80, 400], { ...clamp, easing: easeOut });
  const dive = rmp(frame, bMad - 16, bMad + 4);
  const fall = rmp(frame, bMad - 2, bMad + 90, (x) => x);
  const big = rmp(frame, bEnc - 14, bEnc - 2) * (1 - rmp(frame, bEnc + 12, bEnc + 30)) + rmp(frame, bEnc + 54, bEnc + 74) * 0.75;
  const tiny = rmp(frame, bEnc + 12, bEnc + 30) * (1 - rmp(frame, bEnc + 54, bEnc + 74));
  const girlH = 150 + 170 * big - 90 * tiny;
  const tea = pop(frame, bTe - 6, 12, 170);
  const cards = rmp(frame, bCab - 70, bCab - 30);
  const shout = pop(frame, bCab - 2, 10, 220);
  return (
    <Stage bg="linear-gradient(180deg, #0D2A36 0%, #12485A 55%, #0A2A2A 100%)" dust="rgba(255,220,240,0.35)">
      <Stars seed="al" n={50} h={300} />
      {/* setos de rosas y la reina (arriba a la derecha) */}
      <div style={{ position: 'absolute', left: 1110, top: 300, width: 600, height: 190, borderRadius: '90px 90px 20px 20px', background: '#0E3A22' }}>
        {Array.from({ length: 18 }).map((_, i) => <div key={i} style={{ position: 'absolute', left: 20 + (i * 97) % 560, top: 20 + ((i * 53) % 130), width: 24, height: 24, borderRadius: '50%', background: i % 3 ? '#C0283A' : '#F2F0EA', boxShadow: 'inset -4px -4px 0 rgba(0,0,0,0.25)' }} />)}
      </div>
      <div style={{ opacity: cards }}>
        <Fig kind="queen" x={1400} y={470} h={330} c="#3A0E14" />
        <div style={{ position: 'absolute', left: 1383, top: 190, width: 34, height: 18, background: '#E8C35A', clipPath: 'polygon(0 100%, 0 30%, 25% 70%, 50% 0, 75% 70%, 100% 30%, 100% 100%)' }} />
        {[0, 1, 2, 3].map((k) => {
          const x = 1160 + k * 70 + (k > 1 ? 260 : 0);
          return (
            <div key={k} style={{ position: 'absolute', left: x, top: 340 + Math.sin(frame / 8 + k) * 3, width: 52, height: 120, background: '#F4EEE2', borderRadius: 6, border: '3px solid #1a1210', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 34, color: k % 2 ? '#C0283A' : '#1a1210', transform: `rotate(${(k - 1.5) * 4}deg)` }}>{k % 2 ? '♥' : '♠'}</div>
          );
        })}
      </div>
      <Speech x={1180} y={140} t="¡Que le corten la cabeza!" q={shout} size={40} bg="#C0283A" fg="#fff" />
      {/* el túnel de la madriguera */}
      <div style={{ position: 'absolute', left: 680, top: 40, width: 340, height: 760, borderRadius: 30, background: 'linear-gradient(180deg, #2a1a10, #120a06)', boxShadow: 'inset 0 0 60px rgba(0,0,0,0.8)', overflow: 'hidden' }}>
        {[0, 1, 2, 3, 4, 5].map((k) => {
          const y = ((k * 140 - fall * 600) % 840 + 840) % 840 - 60;
          return <div key={k} style={{ position: 'absolute', left: k % 2 ? 220 : 20, top: y, width: 90, height: 14, background: '#5a3a20', borderRadius: 3 }}>
            <div style={{ position: 'absolute', left: 14, top: -30, width: 26, height: 30, borderRadius: '6px 6px 2px 2px', background: ['#E8C35A', '#6CA2C8', '#C0283A'][k % 3], opacity: 0.85 }} />
          </div>;
        })}
        {['🕰', '☕', '📖', '🗝'].map((e, k) => (
          <div key={k} style={{ position: 'absolute', left: 60 + k * 60, top: 700 - ((fall * 900 + k * 220) % 900), fontSize: 44, opacity: dive, transform: `rotate(${(frame * (k % 2 ? 2 : -2)) % 360}deg)` }}>{e}</div>
        ))}
        <div style={{ position: 'absolute', left: 170, top: interpolate(fall, [0, 1], [-200, 520]), opacity: Math.min(1, dive * 2), transform: `rotate(${(Math.sin(frame / 10) * 18).toFixed(1)}deg)`, transformOrigin: '50% 50%' }}>
          <Fig kind="girl" x={0} y={200} h={200} c="#E9D8B4" />
        </div>
      </div>
      {/* jardín */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 820, bottom: 0, background: 'linear-gradient(180deg, #0E3A22, #06180E)' }} />
      {[[120, 820, 1.2, '#C0283A'], [300, 840, 0.7, '#D86A9A'], [1040, 830, 0.9, '#C0283A']].map(([x, y, s, c], k) => (
        <div key={k} style={{ position: 'absolute', left: (x as number) - 70 * (s as number), top: (y as number) - 150 * (s as number) }}>
          <div style={{ width: 140 * (s as number), height: 70 * (s as number), borderRadius: '70px 70px 10px 10px', background: c as string, position: 'relative' }}>
            {[[24, 22], [70, 14], [104, 30]].map(([dx, dy], j) => <div key={j} style={{ position: 'absolute', left: dx * (s as number), top: dy * (s as number), width: 14 * (s as number), height: 14 * (s as number), borderRadius: '50%', background: '#F6EEE6' }} />)}
          </div>
          <div style={{ width: 30 * (s as number), height: 80 * (s as number), margin: '0 auto', background: '#EFE6D6' }} />
        </div>
      ))}
      <div style={{ position: 'absolute', left: 410, top: 830, width: 220, height: 64, borderRadius: '50%', background: '#050302', boxShadow: '0 0 0 10px #2a1a10' }} />
      {dive < 1 && <div style={{ position: 'absolute', left: runX - 85 + 100 * dive, top: 650 + 140 * dive, transform: `scale(${(1 - 0.7 * dive).toFixed(3)})`, opacity: 1 - dive }}><Rabbit run={frame / 3} /></div>}
      {/* la puerta diminuta y el frasco */}
      <div style={{ position: 'absolute', left: 1060, top: 560, width: 360, height: 270, background: 'repeating-conic-gradient(#1d2a3a 0 25%, #2c3e52 0 50%) 0 0 / 60px 60px', borderRadius: 14, opacity: 0.85 }} />
      <div style={{ position: 'absolute', left: 1330, top: 760, width: 46, height: 66, borderRadius: '23px 23px 2px 2px', background: '#6a4a2a', boxShadow: `0 0 ${(30 * tiny).toFixed(0)}px rgba(255,230,160,0.8)` }} />
      <div style={{ position: 'absolute', left: 1130, top: 690, width: 90, height: 8, background: 'rgba(220,240,255,0.5)' }} />
      <div style={{ position: 'absolute', left: 1158, top: 640, width: 34, height: 50, borderRadius: '8px 8px 10px 10px', background: 'rgba(120,200,255,0.55)', border: '2px solid rgba(255,255,255,0.6)' }}>
        <div style={{ position: 'absolute', left: -14, top: 18, padding: '1px 4px', background: '#F4EEE2', fontFamily: font.serif, fontSize: 11, color: '#1a1210', whiteSpace: 'nowrap' }}>BÉBEME</div>
      </div>
      {frame > bEnc - 16 && <Fig kind="girl" x={1270} y={828} h={girlH} c="#E9D8B4" />}
      {/* la merienda del sombrerero */}
      <div style={{ position: 'absolute', left: 1440, top: 640, width: 440, height: 30, background: '#F2ECE0', borderRadius: 6, boxShadow: '0 16px 30px rgba(0,0,0,0.5)' }} />
      <div style={{ position: 'absolute', left: 1460, top: 668, width: 400, height: 150, background: 'repeating-linear-gradient(90deg, #E9E2D2 0 30px, #C9C1AE 30px 60px)' }} />
      <div style={{ position: 'absolute', left: 1500, top: 470, width: 110, height: 130, background: '#24202a', borderRadius: '10px 10px 2px 2px', transform: `translateY(${(-20 * Math.max(0, Math.sin((frame - bTe) / 5)) * tea).toFixed(1)}px) rotate(-8deg)` }}>
        <div style={{ position: 'absolute', left: -26, bottom: -8, width: 162, height: 18, borderRadius: 9, background: '#24202a' }} />
        <div style={{ position: 'absolute', left: 0, bottom: 20, width: 110, height: 18, background: '#B8322C' }} />
      </div>
      {[[1650, 600], [1740, 610], [1810, 604]].map(([x, y], k) => (
        <div key={k} style={{ position: 'absolute', left: x, top: y, transform: `scale(${tea.toFixed(3)})`, transformOrigin: '50% 100%' }}>
          <div style={{ width: 46, height: 36, borderRadius: '4px 4px 20px 20px', background: ['#F2F0EA', '#E8B4C8', '#B8D8E8'][k] }} />
          {[0, 1].map((j) => <div key={j} style={{ position: 'absolute', left: 14 + j * 10, top: -40 - ((frame + j * 20 + k * 9) % 40), width: 8, height: 18, borderRadius: 8, background: 'rgba(255,255,255,0.25)', filter: 'blur(3px)' }} />)}
        </div>
      ))}
      <div style={{ position: 'absolute', left: 1580, top: 570, width: 70, height: 66, borderRadius: '50% 50% 40% 40%', background: '#E8C35A', transform: `scale(${tea.toFixed(3)})` }} />
      {shout > 0 && <AbsoluteFill style={{ background: `${EMBER}${(0.12 * shout * (1 - rmp(frame, bCab + 10, bCab + 40))).toFixed(3)})` }} />}
    </Stage>
  );
};

// ———————————————— 9 · Circe ————————————————
const Pig: React.FC<{ x: number; y: number; s: number; c?: string }> = ({ x, y, s, c = '#E7A9A0' }) => (
  <svg width={110 * s} height={70 * s} viewBox="0 0 110 70" style={{ position: 'absolute', left: x - 55 * s, top: y - 70 * s }}>
    <ellipse cx="52" cy="38" rx="40" ry="24" fill={c} /><circle cx="90" cy="32" r="16" fill={c} /><ellipse cx="102" cy="34" rx="7" ry="6" fill="#D58A80" />
    <path d="M84 16 l6 -10 l4 12z" fill={c} /><path d="M24 56v14h7v-12M70 56v14h7v-12" fill={c} /><circle cx="92" cy="27" r="2.2" fill="#2a1a12" />
  </svg>
);
const DCirce: D = ({ beats: [bSol, bBru, bIsl, bMar] }) => {
  const frame = useCurrentFrame();
  const sun = rmp(frame, bSol - 10, bSol + 14);
  const brew = rmp(frame, bBru - 6, bBru + 20);
  const isle = pop(frame, bIsl - 8, 14, 120);
  const ship = interpolate(frame, [bMar - 60, bMar + 10], [2100, 1640], { ...clamp, easing: easeOut });
  const morph = rmp(frame, bMar + 24, bMar + 34);
  const gold = '#E3A63B';
  return (
    <Stage bg="linear-gradient(180deg, #0B0906 0%, #15100A 58%, #070605 100%)" dust="rgba(255,214,140,0.35)">
      {/* greca */}
      {[18, 1048].map((y) => <div key={y} style={{ position: 'absolute', left: 0, right: 0, top: y, height: 14, backgroundImage: `repeating-linear-gradient(90deg, ${gold} 0 4px, transparent 4px 18px)`, opacity: 0.5 }} />)}
      {/* el palacio del Sol */}
      <Glow x={420} y={290} r={360 * (0.5 + 0.5 * sun)} c={`rgba(255,200,90,${(0.45 * sun).toFixed(3)})`} />
      <svg width={600} height={600} viewBox="-300 -300 600 600" style={{ position: 'absolute', left: 120, top: -10, opacity: 0.3 + 0.7 * sun, transform: `rotate(${(frame * 0.2).toFixed(1)}deg)` }}>
        {Array.from({ length: 24 }).map((_, k) => <path key={k} d={`M0 -150 L8 ${-230 - (k % 2) * 40} L-8 ${-230 - (k % 2) * 40}Z`} fill={gold} transform={`rotate(${k * 15})`} />)}
        <circle r="140" fill="#F2B640" /><circle r="140" fill="none" stroke="#FFE6A0" strokeWidth={6} />
      </svg>
      <svg width={460} height={220} viewBox="0 0 460 220" style={{ position: 'absolute', left: 190, top: 400 }}>
        <path d="M0 60 L230 0 L460 60Z" fill="#100c06" stroke={gold} strokeWidth={3} />
        {Array.from({ length: 6 }).map((_, k) => <rect key={k} x={30 + k * 76} y="66" width="24" height="140" fill="#100c06" stroke={gold} strokeWidth={3} />)}
        <rect x="0" y="206" width="460" height="14" fill={gold} />
      </svg>
      <Fig kind="woman" x={420} y={600} h={150} c="#2a1c0a" style={{ opacity: sun }} />
      {/* la brujería: cuenco, hierbas y humo */}
      <div style={{ position: 'absolute', left: 820, top: 700, width: 280, height: 40, background: '#2a2016', borderRadius: 8 }} />
      <div style={{ position: 'absolute', left: 880, top: 640, width: 160, height: 70, borderRadius: '10px 10px 80px 80px', background: 'linear-gradient(180deg, #6a4a20, #3a2810)', border: `3px solid ${gold}` }} />
      {['🌿', '🌾', '🌸'].map((e, k) => <div key={k} style={{ position: 'absolute', left: 840 + k * 90, top: 672, fontSize: 30, transform: `rotate(${(k - 1) * 20}deg)` }}>{e}</div>)}
      <Glow x={960} y={600} r={260} c={`rgba(170,255,140,${(0.35 * brew).toFixed(3)})`} />
      {brew > 0 && Array.from({ length: 6 }).map((_, k) => {
        const p = ((frame - bBru) / 60 + k / 6) % 1;
        return <div key={k} style={{ position: 'absolute', left: 930 + Math.sin(p * 6 + k) * 40, top: 620 - p * 360, width: 60 + p * 80, height: 60 + p * 80, borderRadius: '50%', background: `radial-gradient(circle, rgba(190,255,150,${(0.3 * brew * (1 - p)).toFixed(3)}), rgba(0,0,0,0) 70%)` }} />;
      })}
      {brew > 0 && <Motes n={18} x={860} y={300} w={200} h={340} c="rgba(220,255,170,0.9)" seed="crc" a={brew} />}
      <Fig kind="woman" x={780} y={760} h={260} c="#0e0a05" />
      {/* el mar y la isla */}
      <div style={{ position: 'absolute', left: 1150, top: 640, width: 770, height: 440, background: 'linear-gradient(180deg, #0f1a22, #070b10)' }}>
        {Array.from({ length: 8 }).map((_, k) => <div key={k} style={{ position: 'absolute', left: ((k * 120 + frame * 0.8) % 820) - 60, top: 30 + k * 44, width: 120, height: 3, background: `rgba(227,166,59,${0.15 + (k % 3) * 0.05})` }} />)}
      </div>
      <div style={{ position: 'absolute', left: 1200, top: 470, transform: `translateY(${((1 - isle) * 120).toFixed(1)}px)`, opacity: Math.min(1, isle * 1.4) }}>
        <svg width={620} height={220} viewBox="0 0 620 220">
          <path d="M0 200 Q120 60 300 50 Q480 40 620 200Z" fill="#1c160c" stroke={gold} strokeWidth={2} />
          {[[120, 90], [170, 70], [470, 80]].map(([x, y], k) => <path key={k} d={`M${x} ${y + 80} q-12 -60 0 -110 q12 50 0 110z`} fill="#0c1208" />)}
          <rect x="280" y="96" width="90" height="56" fill="#100c06" stroke={gold} strokeWidth={2} /><path d="M270 98 L325 64 L380 98Z" fill="#100c06" stroke={gold} strokeWidth={2} />
          <rect x="314" y="118" width="16" height="22" fill={`rgba(255,200,110,${(0.5 + 0.5 * flicker(frame, 'circ', 1)).toFixed(3)})`} />
        </svg>
        <div style={{ position: 'absolute', left: 380, top: 110 }}>
          <svg width={150} height={70} viewBox="0 0 150 70"><path d="M10 60 Q20 30 60 32 Q90 18 120 30 Q140 26 146 44 Q140 52 128 50 L124 62 L110 62 L108 54 L60 56 L56 66 L40 66 L38 56 Q20 62 10 60Z" fill="#B88A3A" /><path d="M126 30 q10 -8 18 0" stroke="#7a5a20" strokeWidth={6} fill="none" /></svg>
        </div>
      </div>
      {/* el barco y los marineros… que se vuelven cerdos */}
      <div style={{ position: 'absolute', left: ship, top: 690 }}>
        <svg width={300} height={160} viewBox="0 0 300 160"><path d="M10 110 L290 110 L250 150 L40 150Z" fill="#1a120a" stroke={gold} strokeWidth={2} /><rect x="146" y="10" width="6" height="100" fill="#1a120a" /><path d="M152 16 L240 60 L152 96Z" fill="#E8DCC0" />
          {Array.from({ length: 7 }).map((_, k) => <path key={k} d={`M${50 + k * 30} 130 l${-10 + Math.sin(frame / 6 + k) * 6} 26`} stroke="#1a120a" strokeWidth={4} />)}</svg>
      </div>
      {frame > bMar - 20 && [0, 1, 2, 3].map((k) => {
        const x = 1360 + k * 70;
        const q = pop(frame, bMar - 14 + k * 4, 12, 180);
        return (
          <React.Fragment key={k}>
            <Fig kind="stand" x={x} y={800} h={120} c="#0b0805" style={{ opacity: q * (1 - morph) }} />
            {morph > 0 && <div style={{ opacity: morph }}><Pig x={x} y={800} s={0.9} /></div>}
          </React.Fragment>
        );
      })}
      {morph > 0 && <Motes n={20} x={1320} y={620} w={320} h={200} c="rgba(255,230,150,0.95)" seed="pigs" a={morph * (1 - rmp(frame, bMar + 60, bMar + 100))} />}
    </Stage>
  );
};

// ———————————————— 8 · Harry Potter y la piedra filosofal ————————————————
const DHarry: D = ({ beats: [bAla, bGig, bMag, bCas, bPie] }) => {
  const frame = useCurrentFrame();
  const open = rmp(frame, bAla - 10, bAla + 10);
  const door = rmp(frame, bGig - 4, bGig + 10, easeOut);
  const giant = rmp(frame, bGig + 2, bGig + 16);
  const letters = rmp(frame, bMag - 20, bMag + 30);
  const lit = (k: number) => rmp(frame, bCas - 6 + k * 4, bCas + 4 + k * 4);
  const stone = rmp(frame, bPie - 8, bPie + 10);
  return (
    <Stage bg="linear-gradient(180deg, #0B1230 0%, #16204A 60%, #0A0D1C 100%)" dust="rgba(255,230,180,0.3)">
      <Stars seed="hp" n={60} h={420} />
      <Moon x={1240} y={130} r={50} />
      {/* casa de los tíos: escalera y alacena */}
      <div style={{ position: 'absolute', left: 0, top: 260, width: 1060, height: 820, background: 'linear-gradient(180deg, #2a2420, #1a1612)' }}>
        <AbsoluteFill style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0 2px, transparent 2px 80px)' }} />
      </div>
      <svg width={700} height={640} viewBox="0 0 700 640" style={{ position: 'absolute', left: 20, top: 260 }}>
        <path d="M60 620 L560 60 L620 60 L120 620Z" fill="#3a2a1c" />
        {Array.from({ length: 10 }).map((_, k) => <rect key={k} x={110 + k * 46} y={560 - k * 52} width="70" height="10" fill="#4a3624" />)}
      </svg>
      <div style={{ position: 'absolute', left: 200, top: 620, width: 220, height: 240, background: '#0a0806', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 90, top: 30, width: 16, height: 20, borderRadius: '50%', background: '#ffe6a0', boxShadow: '0 0 40px 14px rgba(255,220,140,0.5)', opacity: open }} />
        <Fig kind="child" x={110} y={230} h={150} c="#1a140e" style={{ opacity: open }} />
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(90deg, #5a4028 0 26px, #4a3420 26px 30px)', transformOrigin: 'left center', transform: `perspective(600px) rotateY(${(-70 * open).toFixed(1)}deg)` }} />
      </div>
      {/* la puerta que cae y el gigante */}
      <div style={{ position: 'absolute', left: 660, top: 360, width: 300, height: 500, background: '#0a0806' }}>
        <Glow x={150} y={250} r={300} c={`rgba(255,200,120,${(0.4 * giant).toFixed(3)})`} />
        <Fig kind="giant" x={150} y={500} h={470} c="#120c08" style={{ opacity: giant }} />
      </div>
      <div style={{ position: 'absolute', left: 660, top: 360, width: 300, height: 500, background: '#5a2a1c', border: '10px solid #3a1a10', boxSizing: 'border-box', transformOrigin: '50% 100%',
        transform: `perspective(900px) rotateX(${(-82 * door).toFixed(1)}deg)`, opacity: 1 - 0.3 * door }}>
        <div style={{ position: 'absolute', right: 30, top: 230, width: 20, height: 20, borderRadius: '50%', background: '#c9a24a' }} />
      </div>
      {door > 0.5 && door < 1 && <Motes n={20} x={620} y={760} w={380} h={120} c="rgba(200,180,150,0.6)" seed="dust3" />}
      {/* cartas que vuelan */}
      {letters > 0 && Array.from({ length: 22 }).map((_, k) => {
        const r = (s: string) => random(`env${k}${s}`);
        const t = ((frame - bMag + 20) / 70 + r('p')) % 1;
        const x = 900 + Math.cos(t * Math.PI * 2 + k) * (160 + r('r') * 160) + t * 120;
        const y = 380 + Math.sin(t * Math.PI * 2 + k) * (110 + r('r') * 90) - t * 60;
        return <div key={k} style={{ position: 'absolute', left: x, top: y, width: 56, height: 38, background: '#E8DCC0', borderRadius: 3, opacity: letters, transform: `rotate(${(t * 720 + k * 30) % 360}deg)`, boxShadow: '0 6px 12px rgba(0,0,0,0.4)' }}>
          <div style={{ position: 'absolute', left: 21, top: 12, width: 14, height: 14, borderRadius: '50%', background: '#9b2c1c' }} />
        </div>;
      })}
      {/* el castillo junto al lago */}
      <svg width={640} height={560} viewBox="0 0 640 560" style={{ position: 'absolute', left: 1260, top: 90 }}>
        <path d="M0 420 Q160 360 320 380 Q480 400 640 360 L640 560 L0 560Z" fill="#0a0e1c" />
        <path d="M120 420 L120 230 L150 230 L150 180 L170 120 L190 180 L190 230 L250 230 L250 150 L275 70 L300 150 L300 230 L360 230 L360 120 L385 40 L410 120 L410 230 L470 230 L470 200 L490 150 L510 200 L510 420Z" fill="#070912" />
        {[[140, 260], [270, 190], [380, 160], [400, 260], [280, 300], [480, 260], [180, 330], [440, 330]].map(([x, y], k) => <rect key={k} x={x} y={y} width="10" height="16" fill={`rgba(255,210,120,${(0.85 * lit(k)).toFixed(3)})`} />)}
        <rect x="0" y="420" width="640" height="140" fill="#0d1428" />
        {[0, 1, 2, 3].map((k) => <g key={k} opacity={rmp(frame, bCas + k * 6, bCas + 14 + k * 6)} transform={`translate(${(80 + k * 120 + ((frame - bCas) * 0.4) % 60).toFixed(1)} ${470 + (k % 2) * 30})`}>
          <path d="M0 0 h40 l-6 10 h-28z" fill="#1a1410" /><circle cx="20" cy="-8" r="6" fill="#ffd27a" /><rect x="0" y="12" width="40" height="3" fill="rgba(255,210,120,0.3)" />
        </g>)}
      </svg>
      {/* la piedra */}
      <div style={{ position: 'absolute', left: 1420, top: 700, width: 380, height: 260, background: 'linear-gradient(180deg, #120c14, #08060a)', borderRadius: 10, boxShadow: 'inset 0 0 0 4px #2a2030' }}>
        <div style={{ position: 'absolute', left: 160, top: 130, width: 70, height: 80, background: '#2a2030' }} />
        <Glow x={195} y={110} r={170} c={`${EMBER}${(0.7 * stone).toFixed(3)})`} />
        <div style={{ position: 'absolute', left: 170, top: 86, width: 50, height: 44, borderRadius: '40% 50% 45% 55%', background: 'radial-gradient(circle at 40% 35%, #ff9a7a, #c0182a 60%, #6a0a14)', transform: `scale(${(0.7 + 0.3 * stone + 0.05 * Math.sin(frame / 5) * stone).toFixed(3)})`,
          boxShadow: `0 0 ${(40 * stone).toFixed(0)}px rgba(255,60,60,0.8)` }} />
        <Fig kind="cloak" x={320} y={250} h={200} c="#050306" style={{ opacity: rmp(frame, bPie + 10, bPie + 30) }} />
      </div>
    </Stage>
  );
};

// ———————————————— 7 · El Hobbit ————————————————
const DHobbit: D = ({ beats: [bAgu, bMag, bEna, bTes, bDra] }) => {
  const frame = useCurrentFrame();
  const home = rmp(frame, bAgu - 8, bAgu + 10);
  const wiz = interpolate(frame, [bMag - 30, bMag + 10], [820, 600], { ...clamp, easing: easeOut });
  const rune = rmp(frame, bMag + 14, bMag + 28);
  const dwarf = (k: number) => pop(frame, bEna - 10 + k * 3, 13, 190);
  const gold = rmp(frame, bTes - 8, bTes + 12);
  const rise = rmp(frame, bDra - 10, bDra + 30, easeOut);
  const eye = rmp(frame, bDra + 4, bDra + 12);
  const hoods = ['#3F7FB5', '#B8402C', '#E0C040', '#5A8A3A', '#8A5AB0', '#D8862A', '#2A6A6A', '#B03A70', '#6A6A6A', '#C0A070', '#3A4A9A', '#7A3A20', '#4A8A80'];
  return (
    <Stage bg="linear-gradient(180deg, #2B2A44 0%, #6A5A6A 45%, #C88A5A 72%, #3A2A1A 100%)" dust="rgba(255,226,170,0.3)">
      {/* la Montaña Solitaria */}
      <svg width={900} height={900} viewBox="0 0 900 900" style={{ position: 'absolute', left: 1080, top: 120 }}>
        <path d="M0 900 L360 60 L460 120 L900 780 L900 900Z" fill="#1E1A24" />
        <path d="M360 60 L410 140 L380 130 L340 170Z" fill="#E8E2EA" opacity={0.6} />
      </svg>
      <div style={{ position: 'absolute', left: 1300, top: 560, width: 420, height: 300, borderRadius: '210px 210px 20px 20px', background: '#08060a', overflow: 'hidden' }}>
        <Glow x={210} y={260} r={300} c={`rgba(255,190,70,${(0.65 * gold).toFixed(3)})`} />
        <svg width={420} height={300} viewBox="0 0 420 300" style={{ position: 'absolute', inset: 0 }}>
          <path d="M0 300 Q60 180 140 200 Q210 140 290 200 Q360 170 420 300Z" fill={`rgb(${Math.round(120 + 110 * gold)}, ${Math.round(90 + 90 * gold)}, ${Math.round(30 + 20 * gold)})`} />
          {Array.from({ length: 26 }).map((_, k) => { const r = (s: string) => random(`gc${k}${s}`); return <circle key={k} cx={40 + r('x') * 340} cy={200 + r('y') * 90} r={4 + r('s') * 4} fill="#FFE08A" opacity={gold * (0.4 + 0.6 * Math.abs(Math.sin(frame / 8 + k)))} />; })}
        </svg>
        <div style={{ position: 'absolute', left: 30, top: 300 - 260 * rise, transform: `scale(${(1 + 0.3 * rise).toFixed(3)})`, transformOrigin: '50% 100%' }}>
          <Dragon s={0.95} flap={Math.sin(frame / 7) * 0.4 * rise} c="#3a0e08" eye={eye} />
        </div>
        <Glow x={300} y={90} r={180} c={`${EMBER}${(0.45 * rise).toFixed(3)})`} />
      </div>
      {/* camino y enanos */}
      <svg width={1100} height={300} viewBox="0 0 1100 300" style={{ position: 'absolute', left: 300, top: 760 }}>
        <path d="M0 140 Q300 100 600 60 Q860 30 1100 40 L1100 70 Q860 60 600 100 Q300 140 0 180Z" fill="#7a6040" opacity={0.7} />
      </svg>
      {hoods.map((hc, k) => {
        const q = dwarf(k);
        const x = 700 + k * 34;
        const y = 820 - k * 3;
        return (
          <div key={k} style={{ position: 'absolute', left: x - 18, top: y - 70 + (1 - q) * 30, opacity: Math.min(1, q * 1.5) }}>
            <svg width={36} height={70} viewBox="0 0 36 70"><path d="M18 2 L32 26 L4 26Z" fill={hc} /><circle cx="18" cy="26" r="8" fill="#e8c8a0" /><path d="M10 30 Q18 50 26 30Z" fill="#c8b8a0" /><rect x="6" y="32" width="24" height="30" rx="6" fill="#3a2a20" /><rect x="8" y="62" width="7" height="8" fill="#2a1a10" /><rect x="21" y="62" width="7" height="8" fill="#2a1a10" /></svg>
          </div>
        );
      })}
      {/* la colina y la puerta redonda */}
      <div style={{ position: 'absolute', left: -100, top: 500, width: 900, height: 600, borderRadius: '450px 450px 0 0', background: 'linear-gradient(180deg, #4A7A2A, #2A4A1A)' }} />
      <div style={{ position: 'absolute', left: 320, top: 640, width: 170, height: 170, borderRadius: '50%', background: '#2E7A3A', border: '12px solid #6A4A2A', boxSizing: 'border-box', boxShadow: `0 0 ${(50 * home).toFixed(0)}px rgba(255,220,140,${(0.5 * home).toFixed(3)})` }}>
        <div style={{ position: 'absolute', left: 64, top: 64, width: 18, height: 18, borderRadius: '50%', background: '#E0C060' }} />
        <svg width={60} height={60} viewBox="0 0 60 60" style={{ position: 'absolute', left: 40, top: 20, opacity: rune }}><path d="M10 50 L30 10 L50 50 M18 34 H42" stroke="#9FD8FF" strokeWidth={5} fill="none" style={{ filter: 'drop-shadow(0 0 6px #9FD8FF)' }} /></svg>
      </div>
      {[[180, 690], [560, 690]].map(([x, y], k) => <div key={k} style={{ position: 'absolute', left: x, top: y, width: 70, height: 70, borderRadius: '50%', background: `rgba(255,214,140,${(0.3 + 0.6 * home).toFixed(3)})`, border: '8px solid #6A4A2A' }} />)}
      <div style={{ position: 'absolute', left: 590, top: 520, width: 30, height: 70, background: '#5a3a24' }} />
      {Array.from({ length: 4 }).map((_, k) => { const p = ((frame / 70) + k / 4) % 1; return <div key={k} style={{ position: 'absolute', left: 590 + p * 40, top: 500 - p * 160, width: 30 + p * 40, height: 30 + p * 40, borderRadius: '50%', background: `rgba(220,220,230,${(0.3 * (1 - p)).toFixed(3)})`, filter: 'blur(4px)' }} />; })}
      {['#E04A6A', '#F2C040', '#E87A3A', '#B84AC0'].map((c, k) => <div key={k} style={{ position: 'absolute', left: 120 + k * 120, top: 840 + (k % 2) * 20, width: 20, height: 20, borderRadius: '50%', background: c }} />)}
      <Fig kind="wizard" x={wiz} y={830} h={290} c="#1a1a20" />
    </Stage>
  );
};

// ———————————————— 6 · El nombre del viento ————————————————
const DViento: D = ({ beats: [bPos, bPel, bCro, bLey, bTre] }) => {
  const frame = useCurrentFrame();
  const fire = 0.7 + 0.3 * flicker(frame, 'fireV', 1.2) + 0.3 * rmp(frame, bPos - 6, bPos + 10) * (1 - rmp(frame, bPos + 30, bPos + 60));
  const hair = rmp(frame, bPel - 6, bPel + 8);
  const write = rmp(frame, bCro, bCro + 80, (x) => x);
  const leg = (k: number) => pop(frame, bLey - 10 + k * 7, 13, 160);
  const days = interpolate(frame, [bTre - 6, bTre + 90], [0, 3], clamp);
  const panels = [
    { x: 1080, y: 110, t: 'sword' }, { x: 1300, y: 80, t: 'lute' }, { x: 1520, y: 110, t: 'fire' }, { x: 1740, y: 80, t: 'wind' },
  ];
  return (
    <Stage bg="linear-gradient(180deg, #1E140C 0%, #2E1E12 60%, #120A06 100%)" dust="rgba(255,210,150,0.3)">
      {/* vigas */}
      {[60, 300].map((y) => <div key={y} style={{ position: 'absolute', left: 0, right: 0, top: y, height: 34, background: '#3a2414', boxShadow: '0 10px 20px rgba(0,0,0,0.4)' }} />)}
      {/* chimenea */}
      <div style={{ position: 'absolute', left: 90, top: 460, width: 300, height: 420, background: '#3a3430', borderRadius: '10px 10px 0 0' }}>
        <div style={{ position: 'absolute', left: 50, top: 150, width: 200, height: 270, background: '#0a0604', borderRadius: '100px 100px 0 0', overflow: 'hidden' }}>
          <Glow x={100} y={230} r={170 * fire} c="rgba(255,150,60,0.8)" />
          {[0, 1, 2].map((k) => <div key={k} style={{ position: 'absolute', left: 50 + k * 34, bottom: 10, width: 40, height: 80 + 40 * Math.abs(Math.sin(frame / (5 + k) + k)) * fire, borderRadius: '50% 50% 30% 30%', background: 'radial-gradient(ellipse at 50% 80%, #FFF2C0, #FF9A3A 55%, rgba(255,80,20,0) 75%)' }} />)}
        </div>
      </div>
      <Glow x={240} y={780} r={420 * fire} c="rgba(255,150,60,0.18)" />
      {/* estantes con botellas */}
      <div style={{ position: 'absolute', left: 430, top: 380, width: 440, height: 200 }}>
        {[0, 1].map((r) => <div key={r} style={{ position: 'absolute', left: 0, top: 80 + r * 100, width: 440, height: 12, background: '#4a2e18' }} />)}
        {Array.from({ length: 14 }).map((_, k) => <div key={k} style={{ position: 'absolute', left: 14 + (k % 7) * 60, top: 26 + Math.floor(k / 7) * 100, width: 24, height: 54, borderRadius: '8px 8px 4px 4px', background: ['#4a6a2a', '#7a2a1a', '#2a4a6a', '#8a6a2a'][k % 4], opacity: 0.85,
          boxShadow: `inset 4px 0 0 rgba(255,255,255,${(0.15 + 0.25 * fire * 0.5).toFixed(3)})` }} />)}
      </div>
      {/* el posadero pelirrojo tras la barra */}
      <div style={{ position: 'absolute', left: 560, top: 380 }}>
        <Fig kind="stand" x={90} y={330} h={300} c="#120a06" />
        <div style={{ position: 'absolute', left: 60, top: 26, width: 64, height: 40, borderRadius: '30px 30px 10px 10px', background: `rgb(${Math.round(90 + 130 * hair)}, ${Math.round(30 + 30 * hair)}, ${Math.round(16)})`, boxShadow: `0 0 ${(30 * hair).toFixed(0)}px rgba(230,80,40,${(0.6 * hair).toFixed(3)})` }} />
        <div style={{ position: 'absolute', left: 120, top: 150, width: 30, height: 36, borderRadius: '4px 4px 8px 8px', background: '#c8b080', transform: `rotate(${(Math.sin(frame / 8) * 10).toFixed(1)}deg)` }} />
      </div>
      <div style={{ position: 'absolute', left: 380, top: 690, width: 540, height: 190, background: 'linear-gradient(180deg, #5a3a20, #3a2412)', borderRadius: '8px 8px 0 0', boxShadow: '0 -6px 0 #6a4628' }} />
      {/* el cronista */}
      <div style={{ position: 'absolute', left: 980, top: 760, width: 320, height: 24, background: '#5a3a20' }} />
      <Paper x={1050} y={712} w={140} h={60} write={write} />
      <Fig kind="hood" x={1220} y={860} h={230} c="#0a0604" />
      <div style={{ position: 'absolute', left: 1010, top: 690, width: 12, height: 50, background: '#efe6d2' }}><div style={{ position: 'absolute', left: -2, top: -16, width: 16, height: 18, borderRadius: '50% 50% 40% 40%', background: '#ffcf7a', transform: `scale(${flicker(frame, 'cdV', 1).toFixed(3)})` }} /></div>
      <Glow x={1016} y={690} r={160} c="rgba(255,210,130,0.25)" />
      {/* las leyendas */}
      {panels.map((pn, k) => {
        const q = leg(k);
        return (
          <div key={k} style={{ position: 'absolute', left: pn.x - 90, top: pn.y + (1 - q) * 40, width: 180, height: 230, borderRadius: 12, background: '#E8D8B8', border: '6px solid #C9A24A', opacity: Math.min(1, q * 1.4), transform: `rotate(${(k % 2 ? 3 : -3)}deg) scale(${(0.85 + 0.15 * q).toFixed(3)})`, overflow: 'hidden',
            boxShadow: `0 20px 40px rgba(0,0,0,0.5), 0 0 ${(30 * q).toFixed(0)}px rgba(226,85,44,0.35)` }}>
            <svg width={168} height={218} viewBox="0 0 168 218">
              {pn.t === 'sword' && <><path d="M84 30 L90 150 L78 150Z" fill="#2a1a10" /><rect x="64" y="150" width="40" height="8" fill="#2a1a10" /><rect x="80" y="158" width="8" height="30" fill="#2a1a10" /></>}
              {pn.t === 'lute' && <><ellipse cx="84" cy="140" rx="40" ry="46" fill="#2a1a10" /><rect x="78" y="30" width="12" height="100" fill="#2a1a10" /><circle cx="84" cy="140" r="12" fill="#E8D8B8" /></>}
              {pn.t === 'fire' && <><path d="M84 190 Q40 150 60 100 Q70 130 84 120 Q74 80 100 40 Q104 90 120 100 Q140 150 84 190Z" fill="#C0401C" /><path d="M84 182 Q64 156 76 130 Q86 146 96 140 Q110 160 84 182Z" fill="#F2A03A" /></>}
              {pn.t === 'wind' && <>{[0, 1, 2].map((j) => <path key={j} d={`M20 ${70 + j * 40} Q90 ${40 + j * 40} 130 ${70 + j * 40} q20 14 0 26`} stroke="#2a1a10" strokeWidth={8} fill="none" strokeLinecap="round" />)}</>}
            </svg>
          </div>
        );
      })}
      {/* la ventana: tres días */}
      <div style={{ position: 'absolute', left: 1540, top: 560, width: 260, height: 260, background: `rgb(${Math.round(30 + 120 * Math.abs(Math.sin(days * Math.PI)))}, ${Math.round(40 + 110 * Math.abs(Math.sin(days * Math.PI)))}, ${Math.round(80 + 120 * Math.abs(Math.sin(days * Math.PI)))})`, boxShadow: 'inset 0 0 0 14px #3a2414', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 120, top: 0, width: 14, height: 260, background: '#3a2414' }} />
        <div style={{ position: 'absolute', left: 110 + Math.cos(days * Math.PI * 2) * 80, top: 140 - Math.abs(Math.sin(days * Math.PI)) * 90, width: 44, height: 44, borderRadius: '50%', background: Math.sin(days * Math.PI * 2 + 1) > 0 ? '#FFD86A' : '#E6EEF8' }} />
      </div>
      <div style={{ position: 'absolute', left: 1560, top: 840, fontFamily: font.serif, fontSize: 64, color: '#E8D8B8', letterSpacing: 10, opacity: rmp(frame, bTre - 4, bTre + 8) }}>{'I'.repeat(Math.max(1, Math.min(3, Math.ceil(days))))}</div>
    </Stage>
  );
};
const Paper: React.FC<{ x: number; y: number; w: number; h: number; write: number }> = ({ x, y, w, h, write }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, background: '#EAE0C8', transform: 'rotate(-4deg)' }}>
    {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: 'absolute', left: 10, top: 10 + i * 12, height: 2, width: Math.max(0, Math.min(1, write * 4 - i)) * (w - 30), background: 'rgba(40,25,15,0.7)' }} />)}
  </div>
);

// ———————————————— 5 · Olvidado rey Gudú ————————————————
const DGudu: D = ({ beats: [bOla, bMal, bRei, bTra, bSir] }) => {
  const frame = useCurrentFrame();
  const flags = rmp(frame, bOla - 10, bOla + 20);
  const stoneH = rmp(frame, bMal - 2, bMal + 20);
  const crack = rmp(frame, bMal + 16, bMal + 30);
  const queen = rmp(frame, bRei - 10, bRei + 12);
  const gob = (k: number) => pop(frame, bTra - 8 + k * 5, 12, 200);
  const siren = rmp(frame, bSir - 8, bSir + 16);
  return (
    <Stage bg="linear-gradient(180deg, #2A1420 0%, #6A2A20 40%, #B85A2A 60%, #2A140C 100%)" dust="rgba(255,200,140,0.3)">
      <div style={{ position: 'absolute', left: 900, top: 420, width: 220, height: 220, borderRadius: '50%', background: '#F2A040', boxShadow: '0 0 120px 40px rgba(255,150,60,0.35)', transform: `translateY(${(30 * rmp(frame, bOla, bOla + 200, (x) => x)).toFixed(1)}px)` }} />
      {/* colinas y castillo de Olar */}
      <svg width={1920} height={700} viewBox="0 0 1920 700" style={{ position: 'absolute', left: 0, top: 380 }}>
        <path d="M0 260 Q300 160 600 220 Q900 120 1200 210 Q1500 150 1920 230 L1920 700 L0 700Z" fill="#3a1610" />
        <path d="M700 200 L700 60 L740 60 L740 20 L760 -20 L780 20 L780 60 L880 60 L880 -10 L905 -60 L930 -10 L930 60 L1030 60 L1030 20 L1050 -20 L1070 20 L1070 60 L1110 60 L1110 200Z" fill="#1a0a08" />
        {[[760, -20], [905, -60], [1050, -20]].map(([x, y], k) => <path key={k} d={`M${x} ${y} v-50`} stroke="#1a0a08" strokeWidth={4} />)}
        {[[760, -70], [905, -110], [1050, -70]].map(([x, y], k) => <path key={k} d={`M${x} ${y} l${(46 * flags).toFixed(1)} ${(8 + Math.sin(frame / 6 + k) * 4).toFixed(1)} l${(-46 * flags).toFixed(1)} 14Z`} fill="#C0283A" />)}
        {[[790, 100], [860, 120], [960, 90], [1060, 130]].map(([x, y], k) => <rect key={k} x={x} y={y} width="12" height="18" fill={`rgba(255,200,110,${(0.4 + 0.5 * flags).toFixed(3)})`} />)}
        <path d="M0 360 Q400 280 800 330 Q1200 380 1920 300 L1920 700 L0 700Z" fill="#240e08" />
      </svg>
      {/* trasgos bajo tierra (corte a la izquierda) */}
      <div style={{ position: 'absolute', left: 40, top: 640, width: 560, height: 260, borderRadius: 30, background: '#140806', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)', overflow: 'hidden' }}>
        <svg width={560} height={260} viewBox="0 0 560 260"><path d="M0 120 Q140 60 280 130 Q420 200 560 110" stroke="#2a140c" strokeWidth={70} fill="none" /></svg>
        {[0, 1, 2, 3, 4].map((k) => {
          const q = gob(k);
          const x = 60 + k * 100;
          const y = 140 + Math.sin(k * 1.3) * 40;
          return <div key={k} style={{ position: 'absolute', left: x, top: y + (1 - q) * 30, opacity: q }}>
            <svg width={60} height={70} viewBox="0 0 60 70"><path d="M8 30 L0 14 L18 24 Q30 14 42 24 L60 14 L52 30 Q56 60 30 66 Q4 60 8 30Z" fill="#2a3a1a" /><circle cx="22" cy="36" r="4" fill="#FFE04A" /><circle cx="38" cy="36" r="4" fill="#FFE04A" /></svg>
          </div>;
        })}
      </div>
      {/* el príncipe maldito y la reina */}
      <div style={{ opacity: queen }}><Fig kind="queen" x={860} y={860} h={380} c="#16080a" /></div>
      <Fig kind="child" x={720} y={860} h={250} c="#1c0c0a" />
      <div style={{ position: 'absolute', left: 698, top: 610, width: 44, height: 20, background: '#E0A43E', clipPath: 'polygon(0 100%, 0 30%, 25% 70%, 50% 0, 75% 70%, 100% 30%, 100% 100%)' }} />
      <svg width={70} height={64} viewBox="0 0 70 64" style={{ position: 'absolute', left: 685, top: 690, transform: `scale(${(1 + 0.3 * stoneH * (1 - crack)).toFixed(3)})` }}>
        <path d="M35 60 C 10 42, 0 28, 6 16 C 12 4, 28 4, 35 16 C 42 4, 58 4, 64 16 C 70 28, 60 42, 35 60 Z" fill={`rgb(${Math.round(200 - 110 * stoneH)}, ${Math.round(40 + 50 * stoneH)}, ${Math.round(50 + 50 * stoneH)})`} />
        <path d={`M35 18 L30 30 L38 38 L32 54`} stroke="#1a1010" strokeWidth={3} fill="none" opacity={crack} />
      </svg>
      <Glow x={720} y={720} r={160} c={`rgba(140,170,220,${(0.4 * stoneH).toFixed(3)})`} />
      {/* el lago, la sirena y los piratas */}
      <div style={{ position: 'absolute', left: 1240, top: 640, width: 680, height: 300, background: 'linear-gradient(180deg, #3a1a20, #120608)', borderRadius: '80px 0 0 0' }}>
        {Array.from({ length: 6 }).map((_, k) => <div key={k} style={{ position: 'absolute', left: ((k * 130 + frame * 0.6) % 700) - 60, top: 40 + k * 40, width: 110, height: 3, background: 'rgba(255,180,120,0.2)' }} />)}
      </div>
      <div style={{ position: 'absolute', left: 1500, top: 700, opacity: siren, transform: `translateY(${((1 - siren) * 40).toFixed(1)}px)` }}>
        <div style={{ position: 'absolute', left: 0, top: 60, width: 150, height: 60, borderRadius: '50%', background: '#2a1410' }} />
        <svg width={150} height={130} viewBox="0 0 150 130"><circle cx="60" cy="18" r="12" fill="#0e0606" /><path d="M48 30 Q60 26 72 30 L78 64 Q96 90 130 76 Q120 96 140 104 Q110 106 88 92 Q60 84 50 64Z" fill="#0e0606" /><path d="M50 14 Q36 30 40 56" stroke="#0e0606" strokeWidth={6} fill="none" /></svg>
        <Glow x={60} y={40} r={90} c="rgba(140,220,255,0.25)" />
      </div>
      <div style={{ position: 'absolute', left: 1760 - 80 * siren, top: 600, opacity: siren }}>
        <svg width={140} height={90} viewBox="0 0 140 90"><path d="M10 60 L130 60 L110 86 L30 86Z" fill="#0a0404" /><rect x="66" y="0" width="5" height="60" fill="#0a0404" /><path d="M71 6 L120 30 L71 54Z" fill="#0a0404" /><rect x="60" y="0" width="16" height="10" fill="#0a0404" /></svg>
      </div>
      {stoneH > 0 && <AbsoluteFill style={{ background: `${EMBER}${(0.1 * stoneH * (1 - rmp(frame, bMal + 20, bMal + 50))).toFixed(3)})` }} />}
    </Stage>
  );
};

// ———————————————— 4 · Memorias de Idhún ————————————————
const DIdhun: D = ({ beats: [bPad, bKir, bSol, bDra, bRes] }) => {
  const frame = useCurrentFrame();
  const houseOff = rmp(frame, bPad - 6, bPad + 6);
  const kir = rmp(frame, bKir - 10, bKir + 8);
  const portal = rmp(frame, bSol - 30, bSol);
  const suns = (k: number) => rmp(frame, bSol - 4 + k * 6, bSol + 12 + k * 6);
  const fade = rmp(frame, bDra + 6, bDra + 60);
  const res = (k: number) => pop(frame, bRes - 8 + k * 6, 13, 170);
  return (
    <Stage bg="linear-gradient(90deg, #0A0F1E 0%, #0E1628 48%, #2A1E4A 52%, #3A2A6A 100%)" dust="rgba(190,220,255,0.3)">
      <Stars seed="idE" n={40} h={360} />
      {/* la Tierra: la casa de Jack */}
      <Moon x={260} y={140} r={40} />
      <div style={{ position: 'absolute', left: 120, top: 420, width: 440, height: 440, background: '#1a2232' }}>
        <div style={{ position: 'absolute', left: -30, top: -150, width: 500, height: 160, background: '#0e1420', clipPath: 'polygon(6% 100%, 50% 0, 94% 100%)' }} />
        {[[40, 60], [300, 60], [40, 240]].map(([x, y], k) => <div key={k} style={{ position: 'absolute', left: x, top: y, width: 100, height: 110, background: `rgba(255,214,140,${(0.65 * (1 - houseOff) * flicker(frame, `hw${k}`, houseOff * 2)).toFixed(3)})`, boxShadow: 'inset 0 0 0 8px #0e1420' }} />)}
        <div style={{ position: 'absolute', left: 280, top: 250, width: 110, height: 190, background: '#05070c' }}>
          <div style={{ position: 'absolute', inset: 0, background: '#3a2a20', transformOrigin: 'left center', transform: `perspective(500px) rotateY(${(-60 * houseOff).toFixed(1)}deg)` }} />
        </div>
      </div>
      <Glow x={340} y={700} r={260} c={`rgba(120,160,255,${(0.25 * houseOff).toFixed(3)})`} />
      {/* Kirtash */}
      <div style={{ opacity: kir }}>
        <Fig kind="cloak" x={700} y={870} h={380} c="#04050a" />
        <div style={{ position: 'absolute', left: 686, top: 520, width: 30, height: 10, display: 'flex', justifyContent: 'space-between' }}>{[0, 1].map((k) => <div key={k} style={{ width: 8, height: 5, borderRadius: 3, background: '#BFE8FF', boxShadow: '0 0 10px #BFE8FF' }} />)}</div>
        <div style={{ position: 'absolute', left: 760, top: 560, width: 12, height: 300, background: 'linear-gradient(180deg, #ffffff, #9FD8FF)', transform: 'rotate(18deg)', transformOrigin: '50% 100%', boxShadow: `0 0 ${(30 * kir).toFixed(0)}px rgba(160,220,255,0.9)` }} />
        <Motes n={14} x={640} y={520} w={200} h={340} c="rgba(200,240,255,0.9)" seed="frost" a={kir} up={false} size={4} />
      </div>
      {/* el portal y el cielo de Idhún */}
      <div style={{ position: 'absolute', left: 960 - 60 * portal, top: 160, width: 120 * portal, height: 680, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,255,255,0.9), rgba(180,140,255,0.4) 50%, rgba(0,0,0,0) 72%)', filter: 'blur(4px)' }} />
      {[{ x: 1240, y: 170, r: 60, c: '#FFD86A' }, { x: 1420, y: 120, r: 46, c: '#FF9A4A' }, { x: 1560, y: 200, r: 34, c: '#FFF6E0' }].map((s, k) => (
        <React.Fragment key={k}><Glow x={s.x} y={s.y + (1 - suns(k)) * 200} r={s.r * 3} c={`rgba(255,200,120,${(0.35 * suns(k)).toFixed(3)})`} />
          <div style={{ position: 'absolute', left: s.x - s.r, top: s.y - s.r + (1 - suns(k)) * 200, width: s.r * 2, height: s.r * 2, borderRadius: '50%', background: s.c, opacity: suns(k) }} /></React.Fragment>
      ))}
      {[{ x: 1700, y: 120, r: 30, c: '#E6EEF8' }, { x: 1800, y: 240, r: 24, c: '#9FC8FF' }, { x: 1640, y: 310, r: 20, c: '#C8A8FF' }].map((s, k) => (
        <div key={k} style={{ position: 'absolute', left: s.x - s.r, top: s.y - s.r + (1 - suns(k + 1)) * 200, width: s.r * 2, height: s.r * 2, borderRadius: '50%', background: s.c, opacity: suns(k + 1), boxShadow: `0 0 30px ${s.c}` }} />
      ))}
      <svg width={960} height={500} viewBox="0 0 960 500" style={{ position: 'absolute', left: 960, top: 580 }}>
        <path d="M0 160 Q200 60 420 120 Q660 180 960 80 L960 500 L0 500Z" fill="#1E1640" />
      </svg>
      {/* dragones y unicornios que se deshacen */}
      <div style={{ position: 'absolute', left: 1200, top: 470, opacity: (1 - fade) * rmp(frame, bDra - 20, bDra) }}><Dragon s={0.9} flap={Math.sin(frame / 6)} c="#6A5AA8" /></div>
      <div style={{ position: 'absolute', left: 1560, top: 600, opacity: (1 - fade) * rmp(frame, bDra - 20, bDra) }}>
        <svg width={170} height={140} viewBox="0 0 170 140"><path d="M20 70 Q60 50 100 60 L120 30 L130 34 L124 62 Q140 70 140 84 L132 84 L130 76 L118 80 L116 126 L106 126 L104 92 L60 92 L56 126 L46 126 L44 92 Q20 90 20 70Z" fill="#E8E2F8" /><path d="M126 30 L140 2 L132 32Z" fill="#FFE08A" /></svg>
      </div>
      {fade > 0 && fade < 1 && <Motes n={30} x={1160} y={420} w={600} h={300} c="rgba(220,210,255,0.9)" seed="dissolve" a={1 - fade} />}
      {/* la Resistencia */}
      {[{ k: 'stand' as FigKind, x: 940, h: 230 }, { k: 'girl' as FigKind, x: 1030, h: 210 }, { k: 'wizard' as FigKind, x: 1120, h: 250 }].map((r, k) => (
        <div key={k} style={{ opacity: res(k), transform: `translateY(${((1 - res(k)) * 30).toFixed(1)}px)` }}><Fig kind={r.k} x={r.x} y={880} h={r.h} c="#0a0820" /></div>
      ))}
      <Glow x={1030} y={760} r={220} c={`rgba(160,200,255,${(0.35 * res(2)).toFixed(3)})`} />
      {kir > 0 && <AbsoluteFill style={{ background: `${EMBER}${(0.12 * kir * (1 - rmp(frame, bKir + 10, bKir + 40))).toFixed(3)})` }} />}
    </Stage>
  );
};

// ———————————————— 3 · Alas de sangre ————————————————
const DAlas: D = ({ beats: [bEsc, bGen, bCol, bDra, bMue] }) => {
  const frame = useCurrentFrame();
  const scroll = rmp(frame, bEsc - 6, bEsc + 20);
  const gen = rmp(frame, bGen - 10, bGen + 10);
  const fort = rmp(frame, bCol - 8, bCol + 14);
  const land = rmp(frame, bDra - 20, bDra + 14, easeOut);
  const wings = Math.sin(frame / 7) * (1 - land * 0.6);
  const threat = rmp(frame, bMue - 14, bMue + 6);
  return (
    <Stage bg="linear-gradient(180deg, #1A1A22 0%, #3A3440 45%, #6A5A48 70%, #1A140E 100%)" dust="rgba(255,220,170,0.25)">
      {/* nubes */}
      {[0, 1, 2].map((k) => <div key={k} style={{ position: 'absolute', left: ((k * 700 + frame * 0.5) % 2400) - 400, top: 60 + k * 70, width: 700, height: 120, borderRadius: '50%', background: 'rgba(200,190,200,0.08)', filter: 'blur(14px)' }} />)}
      {/* la fortaleza y el parapeto */}
      <svg width={760} height={700} viewBox="0 0 760 700" style={{ position: 'absolute', left: 760, top: 80 }}>
        <path d="M0 700 L0 420 L120 380 L160 470 L260 470 L260 700Z" fill="#14121a" />
        <path d="M500 700 L500 460 L600 400 L760 420 L760 700Z" fill="#14121a" />
        <path d="M150 380 L150 160 L190 160 L190 100 L215 40 L240 100 L240 160 L330 160 L330 60 L360 0 L390 60 L390 160 L470 160 L470 380Z" fill="#0c0a10" />
        {[[180, 200], [350, 120], [420, 220], [250, 260], [200, 320], [400, 300]].map(([x, y], k) => <rect key={k} x={x} y={y} width="12" height="18" fill={`rgba(255,200,110,${(0.25 + 0.65 * fort).toFixed(3)})`} />)}
        {[[215, 40], [360, 0]].map(([x, y], k) => <path key={k} d={`M${x} ${y} v-40 l${(40 * fort).toFixed(1)} ${(8 + Math.sin(frame / 6 + k) * 4).toFixed(1)} l${(-40 * fort).toFixed(1)} 12`} fill="#E8A33C" stroke="#0c0a10" strokeWidth={3} />)}
        <path d="M250 476 Q380 500 510 470" stroke="#2a2430" strokeWidth={10} fill="none" />
        {[0, 1, 2].map((k) => { const p = ((frame / 160) + k / 3) % 1; return <g key={k} transform={`translate(${(260 + p * 240).toFixed(1)} ${(470 + Math.sin(p * Math.PI) * 22 - 26).toFixed(1)})`}><circle r="5" fill="#0c0a10" /><rect x="-4" y="5" width="8" height="16" fill="#0c0a10" /></g>; })}
      </svg>
      {/* el dragón que aterriza */}
      <div style={{ position: 'absolute', left: 1380, top: interpolate(land, [0, 1], [-200, 220]), transform: `scale(${(1.6 + 0.2 * land).toFixed(3)})`, transformOrigin: '50% 50%' }}>
        <Dragon s={1} flap={wings} c="#1a1210" eye={land} eyeC="#FFD24A" />
      </div>
      <svg width={600} height={400} viewBox="0 0 600 400" style={{ position: 'absolute', left: 1320, top: 640 }}><path d="M0 400 L60 120 L300 60 L600 140 L600 400Z" fill="#1e1a16" /></svg>
      {/* la escriba */}
      <div style={{ position: 'absolute', left: 120, top: 720, width: 460, height: 30, background: '#3a2414' }} />
      <div style={{ position: 'absolute', left: 170, top: 660, width: 200 * (0.3 + 0.7 * scroll), height: 56, background: '#E8DCC0', borderRadius: 6 }}>
        {[0, 1, 2].map((i) => <div key={i} style={{ position: 'absolute', left: 12, top: 12 + i * 12, height: 2, width: `${70 * scroll}%`, background: 'rgba(40,25,15,0.6)' }} />)}
      </div>
      {[[400, 640], [450, 650]].map(([x, y], k) => <div key={k} style={{ position: 'absolute', left: x, top: y, width: 40, height: 70, background: ['#6a2a1a', '#2a4a6a'][k], borderRadius: 3 }} />)}
      <Fig kind="braid" x={300} y={880} h={260} c="#0c0a0e" />
      {/* la general */}
      <div style={{ opacity: gen, transform: `translateX(${((1 - gen) * 60).toFixed(1)}px)` }}>
        <Fig kind="woman" x={680} y={880} h={400} c="#140e0c" />
        <div style={{ position: 'absolute', left: 630, top: 560, width: 100, height: 20, background: '#140e0c', borderRadius: 10 }} />
        {[0, 1, 2].map((k) => <div key={k} style={{ position: 'absolute', left: 650 + k * 14, top: 600, width: 8, height: 12, background: '#E8A33C' }} />)}
        <div style={{ position: 'absolute', left: 720, top: 600, width: 140, height: 14, background: '#140e0c', transform: 'rotate(-12deg)', transformOrigin: '0 50%' }} />
      </div>
      {/* los que la quieren muerta */}
      {threat > 0 && [0, 1, 2, 3, 4].map((k) => {
        const a = (k / 5) * Math.PI + Math.PI * 0.08;
        const r = 300 - 80 * threat;
        const x = 960 + Math.cos(a + Math.PI) * r;
        return (
          <div key={k} style={{ opacity: threat }}>
            <Fig kind="hood" x={x} y={900} h={200} c="#050406" />
            <div style={{ position: 'absolute', left: x - 12, top: 740, width: 24, height: 6, display: 'flex', justifyContent: 'space-between' }}>{[0, 1].map((j) => <div key={j} style={{ width: 6, height: 6, borderRadius: 3, background: '#ff4a2a', boxShadow: '0 0 8px #ff4a2a' }} />)}</div>
          </div>
        );
      })}
      {threat > 0 && <Fig kind="braid" x={960} y={900} h={220} c="#2a2228" />}
      {threat > 0 && <AbsoluteFill style={{ background: `${EMBER}${(0.14 * threat * (1 - rmp(frame, bMue + 10, bMue + 40))).toFixed(3)})` }} />}
    </Stage>
  );
};

// ———————————————— 2 · El imperio final ————————————————
const DImperio: D = ({ beats: [bHer, bCen, bNie, bMet, bDio] }) => {
  const frame = useCurrentFrame();
  const crack = rmp(frame, bHer - 4, bHer + 20);
  const ash = rmp(frame, bCen - 20, bCen + 10);
  const mist = rmp(frame, bNie - 10, bNie + 40);
  const metal = rmp(frame, bMet - 4, bMet + 10);
  const leap = rmp(frame, bMet + 20, bMet + 50, easeOut);
  const god = rmp(frame, bDio - 8, bDio + 14);
  const night = Math.max(mist * 0.6, 0);
  return (
    <Stage bg={`linear-gradient(180deg, rgb(${Math.round(70 - 40 * night)},${Math.round(40 - 20 * night)},${Math.round(34 - 10 * night)}) 0%, rgb(${Math.round(150 - 100 * night)},${Math.round(70 - 40 * night)},${Math.round(40 - 20 * night)}) 55%, #1a1210 100%)`} dust="rgba(200,190,180,0.25)">
      <div style={{ position: 'absolute', left: 860, top: 240, width: 200, height: 200, borderRadius: '50%', background: '#D0402A', opacity: 0.85 * (1 - night), boxShadow: '0 0 120px rgba(220,70,40,0.5)' }} />
      {/* la torre del dios */}
      <svg width={460} height={620} viewBox="0 0 460 620" style={{ position: 'absolute', left: 1420, top: 60 }}>
        <path d="M60 620 L80 300 L110 300 L130 120 L150 300 L190 300 L230 0 L270 300 L310 300 L330 140 L350 300 L380 300 L400 620Z" fill="#0a0808" />
        {[[225, 200], [140, 380], [320, 380], [230, 460]].map(([x, y], k) => <rect key={k} x={x} y={y} width="10" height="16" fill={`${EMBER}${(0.3 + 0.7 * god).toFixed(3)})`} />)}
      </svg>
      <Glow x={1650} y={80} r={260} c={`${EMBER}${(0.6 * god).toFixed(3)})`} />
      <div style={{ position: 'absolute', left: 1630, top: 20 - 40 * (1 - god), opacity: god }}>
        <Fig kind="stand" x={20} y={70} h={70} c="#000" />
        <div style={{ position: 'absolute', left: 8, top: -6, width: 26, height: 12, background: '#E0B040', clipPath: 'polygon(0 100%, 0 30%, 25% 70%, 50% 0, 75% 70%, 100% 30%, 100% 100%)' }} />
      </div>
      {/* la ciudad */}
      <svg width={1400} height={520} viewBox="0 0 1400 520" style={{ position: 'absolute', left: 300, top: 420 }}>
        <path d="M0 520 L0 300 L60 300 L60 220 L90 160 L120 220 L120 300 L200 300 L200 240 L260 240 L260 140 L280 80 L300 140 L300 300 L400 300 L400 260 L460 260 L460 180 L490 120 L520 180 L520 300 L640 300 L640 230 L700 230 L700 300 L800 300 L800 160 L830 100 L860 160 L860 300 L980 300 L980 250 L1060 250 L1060 300 L1180 300 L1180 200 L1210 150 L1240 200 L1240 300 L1400 300 L1400 520Z" fill="#141010" />
        {Array.from({ length: 18 }).map((_, k) => <rect key={k} x={40 + k * 74} y={320 + (k % 3) * 40} width="8" height="12" fill={`rgba(255,180,100,${(0.5 * (0.4 + night)).toFixed(3)})`} />)}
      </svg>
      {/* el héroe roto */}
      <svg width={360} height={560} viewBox="0 0 360 560" style={{ position: 'absolute', left: 160, top: 320 }}>
        <path d="M0 560 Q180 420 360 560Z" fill="#1a1210" />
        <rect x="130" y="380" width="100" height="70" fill="#3a3230" />
        <g transform={`translate(${(crack * -6).toFixed(1)} ${(crack * 8).toFixed(1)})`}><circle cx="180" cy="120" r="34" fill="#4a423e" /><path d="M140 160 Q180 150 220 160 L230 380 L130 380Z" fill="#4a423e" /></g>
        <path d={`M230 200 L300 ${120 + 30 * crack} L310 ${130 + 30 * crack} L240 210Z`} fill="#5a524e" transform={`rotate(${(30 * crack).toFixed(1)} 240 210)`} />
        <path d="M176 156 L186 220 L172 280 L188 360" stroke="#120c0a" strokeWidth={4} fill="none" opacity={crack} />
        {crack > 0.2 && [0, 1, 2].map((k) => <rect key={k} x={200 + k * 24} y={380 + crack * (60 + k * 30)} width="14" height="14" fill="#4a423e" transform={`rotate(${(crack * 90 * (k + 1)).toFixed(1)} ${206 + k * 24} ${390 + crack * 60})`} />)}
      </svg>
      {/* niebla */}
      {[0, 1, 2, 3].map((k) => <div key={k} style={{ position: 'absolute', left: ((k * 600 + frame * (0.8 + k * 0.3)) % 2600) - 600, top: 640 + k * 70, width: 1100, height: 220, borderRadius: '50%', background: `radial-gradient(ellipse, rgba(220,220,230,${(0.32 * mist).toFixed(3)}), rgba(0,0,0,0) 70%)`, filter: 'blur(12px)' }} />)}
      {/* Vin y los metales */}
      <div style={{ position: 'absolute', left: 1180, top: 720 - 260 * leap, transform: `rotate(${(-20 * leap).toFixed(1)}deg)` }}>
        <Fig kind="cloak" x={60} y={150} h={180} c="#060408" />
        {metal > 0 && Array.from({ length: 6 }).map((_, k) => {
          const a = -Math.PI * (0.15 + 0.12 * k);
          const L = 160 + 120 * metal;
          return <div key={k} style={{ position: 'absolute', left: 60, top: 60, width: L, height: 2, background: `rgba(120,190,255,${(0.8 * metal).toFixed(3)})`, transform: `rotate(${(a * 180) / Math.PI}deg)`, transformOrigin: '0 50%', boxShadow: '0 0 8px rgba(120,190,255,0.9)' }} />;
        })}
        <Glow x={60} y={60} r={90} c={`rgba(140,200,255,${(0.5 * metal).toFixed(3)})`} />
      </div>
      {/* ceniza */}
      <Motes n={70} x={0} y={-40} w={W} h={H + 40} c="rgba(170,160,150,0.8)" up={false} seed="ash" a={0.3 + 0.7 * ash} size={4} speed={0.6} />
      {god > 0 && <AbsoluteFill style={{ background: `${EMBER}${(0.12 * god * (1 - rmp(frame, bDio + 14, bDio + 44))).toFixed(3)})` }} />}
    </Stage>
  );
};

// ———————————————— 1 · El Señor de los Anillos ————————————————
const DAnillos: D = ({ beats: [bAni, bMag, bOsc, bFue, bMor] }) => {
  const frame = useCurrentFrame();
  const ring = rmp(frame, bAni - 6, bAni + 12);
  const script = rmp(frame, bAni + 6, bAni + 40);
  const wiz = rmp(frame, bMag - 10, bMag + 10);
  const dark = rmp(frame, bOsc - 8, bOsc + 20);
  const lava = rmp(frame, bFue - 6, bFue + 16);
  const walk = rmp(frame, bMor - 30, bMor + 120, (x) => x);
  return (
    <Stage bg="linear-gradient(100deg, #1A2614 0%, #2A3020 38%, #3A1A10 60%, #120606 100%)" dust="rgba(255,200,140,0.25)">
      {/* Mordor: cielo rojo, la torre y el volcán */}
      <div style={{ position: 'absolute', left: 1000, top: 0, width: 920, height: 1080, background: `linear-gradient(180deg, rgba(120,20,10,${(0.4 + 0.4 * dark).toFixed(3)}), rgba(30,6,4,0.9))` }} />
      <svg width={560} height={560} viewBox="0 0 560 560" style={{ position: 'absolute', left: 1100, top: 220 }}>
        <path d="M0 560 L230 80 L330 80 L560 560Z" fill="#160806" />
        <path d={`M230 80 Q280 ${50 - 40 * lava} 330 80`} fill={`rgba(255,120,40,${(0.5 + 0.5 * lava).toFixed(3)})`} />
        {[0, 1, 2].map((k) => <path key={k} d={`M${270 + k * 14} 90 Q${240 + k * 40} 300 ${200 + k * 70} ${300 + 260 * lava}`} stroke={`rgba(255,${120 + k * 30},40,${(0.9 * lava).toFixed(3)})`} strokeWidth={8 - k * 2} fill="none" />)}
      </svg>
      <Glow x={1380} y={300} r={340 * (0.4 + 0.6 * lava)} c={`rgba(255,110,40,${(0.45 * lava + 0.1).toFixed(3)})`} />
      {lava > 0 && <Motes n={26} x={1250} y={60} w={260} h={260} c="rgba(255,170,80,0.95)" seed="lava" a={lava} />}
      <svg width={260} height={600} viewBox="0 0 260 600" style={{ position: 'absolute', left: 1580, top: 20 }}>
        <path d="M70 600 L90 200 L60 120 L100 150 L110 60 L130 140 L150 60 L160 150 L200 120 L170 200 L190 600Z" fill="#050202" />
        <path d="M110 130 Q130 100 150 130 Q130 150 110 130Z" fill={`rgba(255,130,50,${(0.4 + 0.6 * dark).toFixed(3)})`} />
      </svg>
      <Glow x={1710} y={150} r={200} c={`${EMBER}${(0.6 * dark).toFixed(3)})`} />
      {/* la llanura y el camino */}
      <svg width={1100} height={360} viewBox="0 0 1100 360" style={{ position: 'absolute', left: 820, top: 720 }}>
        <path d="M0 80 Q300 20 600 60 Q860 90 1100 30 L1100 360 L0 360Z" fill="#1a0a06" />
        <path d="M60 300 Q300 200 520 160 Q760 110 900 40" stroke="#4a2a1a" strokeWidth={14} fill="none" strokeLinecap="round" />
      </svg>
      {[0, 1].map((k) => {
        const p = Math.min(1, walk * 0.6 + k * 0.04);
        const x = 880 + p * 520 - k * 26;
        const y = 1010 - p * 200 + k * 4;
        return <Fig key={k} kind="child" x={x} y={y} h={70} c="#0a0404" style={{ opacity: rmp(frame, bMor - 30, bMor - 10) }} />;
      })}
      {/* el agujero hobbit: mesa, vela, chimenea y el anillo */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1000, height: 1080, background: 'linear-gradient(180deg, #3A2A18, #24180E)', clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0 100%)' }}>
        <div style={{ position: 'absolute', left: 120, top: 120, width: 220, height: 220, borderRadius: '50%', background: '#1a2a3a', border: '16px solid #5a3a20', boxSizing: 'border-box' }}><Moon x={140} y={80} r={22} /></div>
        <div style={{ position: 'absolute', left: 560, top: 380, width: 280, height: 420, background: '#2a2420', borderRadius: '140px 140px 0 0' }}>
          <div style={{ position: 'absolute', left: 50, top: 180, width: 180, height: 240, background: '#0a0604', borderRadius: '90px 90px 0 0', overflow: 'hidden' }}>
            {[0, 1, 2].map((k) => <div key={k} style={{ position: 'absolute', left: 40 + k * 34, bottom: 6, width: 38, height: 70 + 30 * Math.abs(Math.sin(frame / (5 + k) + k)), borderRadius: '50% 50% 30% 30%', background: 'radial-gradient(ellipse at 50% 80%, #FFF2C0, #FF9A3A 55%, rgba(255,80,20,0) 75%)' }} />)}
          </div>
        </div>
        <Glow x={700} y={720} r={300} c="rgba(255,160,70,0.2)" />
        <div style={{ position: 'absolute', left: 120, top: 700, width: 520, height: 26, background: '#6a4628', borderRadius: 6 }} />
        <div style={{ position: 'absolute', left: 150, top: 726, width: 26, height: 200, background: '#4a3018' }} /><div style={{ position: 'absolute', left: 580, top: 726, width: 26, height: 200, background: '#4a3018' }} />
        <div style={{ position: 'absolute', left: 300, top: 670, width: 120, height: 36, background: '#E8DCC0', transform: 'rotate(-6deg)' }} />
        <div style={{ position: 'absolute', left: 200, top: 640, width: 12, height: 60, background: '#efe6d2' }}><div style={{ position: 'absolute', left: -2, top: -16, width: 16, height: 18, borderRadius: '50% 50% 40% 40%', background: '#ffcf7a', transform: `scale(${flicker(frame, 'cdR', 1).toFixed(3)})` }} /></div>
      </div>
      <Glow x={430} y={650} r={200} c={`rgba(255,210,100,${(0.55 * ring).toFixed(3)})`} />
      <div style={{ position: 'absolute', left: 400, top: 630, width: 60, height: 30, borderRadius: '50%', border: `8px solid rgb(${Math.round(190 + 60 * ring)}, ${Math.round(150 + 60 * ring)}, 60)`, boxShadow: `0 0 ${(30 * ring).toFixed(0)}px rgba(255,200,80,0.9)`, transform: `rotate(${(Math.sin(frame / 20) * 4).toFixed(1)}deg)` }} />
      {script > 0 && (
        <svg width={260} height={260} viewBox="-130 -130 260 260" style={{ position: 'absolute', left: 300, top: 515, opacity: script * (1 - rmp(frame, bOsc - 10, bOsc + 10)), transform: `rotate(${(frame * 0.4).toFixed(1)}deg)` }}>
          {Array.from({ length: 30 }).map((_, k) => { const a = (k / 30) * Math.PI * 2; return <path key={k} d={`M${(Math.cos(a) * 100).toFixed(1)} ${(Math.sin(a) * 100).toFixed(1)} q 6 -10 12 0 q 4 8 10 -4`} stroke="#FF8A3A" strokeWidth={3} fill="none" opacity={Math.min(1, script * 30 - k)} style={{ filter: 'drop-shadow(0 0 4px #FF8A3A)' }} />; })}
        </svg>
      )}
      <div style={{ opacity: wiz, transform: `translateX(${((1 - wiz) * 60).toFixed(1)}px)` }}>
        <Fig kind="wizard" x={760} y={880} h={400} c="#24262c" />
        <Glow x={835} y={500} r={60} c={`rgba(200,220,255,${(0.6 * wiz).toFixed(3)})`} />
      </div>
      {dark > 0 && <AbsoluteFill style={{ background: `radial-gradient(ellipse at 85% 20%, rgba(0,0,0,0) 0%, rgba(0,0,0,${(0.25 * dark).toFixed(3)}) 60%)` }} />}
      {walk > 0 && <AbsoluteFill style={{ background: `${EMBER}${(0.1 * rmp(frame, bMor - 4, bMor + 4) * (1 - rmp(frame, bMor + 10, bMor + 40))).toFixed(3)})` }} />}
    </Stage>
  );
};

export const DIORAMAS: Record<number, D> = { 1: DAlicia, 2: DCirce, 3: DHarry, 4: DHobbit, 5: DViento, 6: DGudu, 7: DIdhun, 8: DAlas, 9: DImperio, 10: DAnillos };
export const _keep = { W, H, easeOut };
