import React from 'react';
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Dust, Grain, flicker, font } from './kit';

// ————————————————————————————————————————————————————————————————
// v5 (Joan, 15/10: «mejorar la animación representando mejor la escena que se narra», en las diez historias).
// Cada historia es un diorama de 1920×1080 con los objetos de la sinopsis; cada uno se activa cuando la voz lo dice
// (`beats`, en fotogramas de la escena, en el orden de BEATS[p]) y la cámara de Books.tsx va de uno a otro.
// Ilustraciones propias y genéricas: nada de portadas, carteles ni fotogramas de películas.
// ————————————————————————————————————————————————————————————————

export type Beat = { label: string; word: string; nth?: number; red?: boolean; f: [number, number, number] };
export const BEATS: Record<number, Beat[]> = {
  1: [{ label: 'Los papeles de su tío abuelo', word: 'papeles', f: [560, 600, 1.32] }, { label: 'Un bajorrelieve de arcilla', word: 'bajorrelieve', f: [1040, 690, 1.75] },
    { label: 'Cultos por todo el mundo', word: 'cultos', f: [1540, 400, 1.55] }, { label: 'Un nombre impronunciable', word: 'nombre', red: true, f: [1330, 760, 1.7] }],
  2: [{ label: 'El ojo del anciano', word: 'anciano', f: [360, 330, 1.75] }, { label: 'Un corazón bajo el suelo', word: 'corazón', red: true, f: [900, 860, 1.45] },
    { label: 'Enterrada en vida', word: 'enterrada', f: [1460, 420, 1.55] }, { label: 'Un gato negro', word: 'gato', f: [1660, 800, 1.9] }],
  3: [{ label: 'Sus padres acaban de morir', word: 'padres', f: [380, 360, 1.75] }, { label: 'La casa familiar, en venta', word: 'casa', f: [620, 690, 1.65] },
    { label: 'Títeres', word: 'títeres', f: [1060, 420, 1.35] }, { label: 'Muñecas', word: 'muñecas', f: [1560, 650, 1.65] },
    { label: 'Un títere con planes propios', word: 'concreto', red: true, f: [1060, 360, 1.85] }],
  4: [{ label: 'Urgencias de un pueblo', word: 'urgencias', f: [380, 470, 1.55] }, { label: 'Un niño que no es su hijo', word: 'niño', f: [300, 600, 1.8] },
    { label: 'El momento exacto', word: 'exacto', f: [760, 250, 2.1] }, { label: 'Algo en el campo', word: 'campo', red: true, f: [1440, 470, 1.45] }],
  5: [{ label: 'Rumbo a Transilvania', word: 'Transilvania', f: [360, 470, 1.5] }, { label: 'Nunca come', word: 'come', f: [1060, 640, 1.65] },
    { label: 'Sin reflejo', word: 'espejo', f: [1560, 460, 1.6] }, { label: 'De día, nadie', word: 'día', red: true, f: [1240, 600, 1.25] }],
  6: [{ label: 'Pontevedra', word: 'Pontevedra', f: [330, 390, 1.6] }, { label: 'Solo con su gato', word: 'gato', f: [560, 690, 1.75] },
    { label: 'Un brote en Rusia', word: 'Rusia', f: [1420, 440, 1.5] }, { label: 'Se extiende', word: 'extenderse', red: true, f: [1420, 470, 1.6] }],
  7: [{ label: 'Abuela y nieta', word: 'abuela', f: [820, 460, 1.75] }, { label: 'Un niño desaparecido', word: 'desapareciera', f: [1460, 520, 1.85] },
    { label: 'Los vecinos murmuran', word: 'murmuran', f: [300, 460, 1.5] }, { label: 'Algo más en la casa', word: 'algo', red: true, f: [1150, 470, 2] }],
  8: [{ label: 'Vuelve al pueblo', word: 'vuelve', f: [1340, 760, 1.6] }, { label: 'La casa de la colina', word: 'casa', f: [1530, 300, 1.8] },
    { label: 'Unos recién llegados', word: 'recién', f: [1440, 380, 1.6] }, { label: 'Desaparecen… o vuelven', word: 'desaparecer', red: true, f: [460, 840, 1.75] }],
  9: [{ label: 'Plena dictadura', word: 'dictadura', f: [960, 640, 1.45] }, { label: 'Padre e hijo', word: 'padre', f: [960, 830, 1.9] },
    { label: 'Un don', word: 'don', f: [960, 820, 2.2] }, { label: 'La Orden', word: 'Orden', red: true, f: [420, 430, 1.55] }],
  10: [{ label: 'Washington', word: 'Washington', f: [470, 560, 1.25] }, { label: 'Ruidos en el desván', word: 'ruidos', f: [470, 190, 1.85] },
    { label: 'Cambios en la niña', word: 'cambios', f: [1360, 560, 1.5] }, { label: 'Una voz que no es la suya', word: 'voz', f: [1360, 500, 1.7] },
    { label: 'Sin explicación', word: 'explicación', red: true, f: [1700, 420, 1.7] }],
};

type D = React.FC<{ t0: number; beats: number[] }>;
const W = 1920, H = 1080;
const pop = (f: number, at: number, d = 13, s = 170) => spring({ frame: f - at, fps: 50, config: { damping: d, stiffness: s } });
const rmp = (f: number, a: number, b: number, ez = easeInOut) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ez });
const css = (o: React.CSSProperties) => o;

// ———————————————— Piezas ————————————————
const Stage: React.FC<{ bg: string; children: React.ReactNode; vignette?: number; dust?: string }> = ({ bg, children, vignette = 0.62, dust }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: bg, overflow: 'hidden' }}>
      {children}
      {dust && <Dust n={26} color={dust} />}
      <Grain seed={Math.floor(frame / 2)} opacity={0.1} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,${vignette}) 100%)`, pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};
const Glow: React.FC<{ x: number; y: number; r: number; c: string; a?: number }> = ({ x, y, r, c, a = 1 }) => (
  <div style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: `radial-gradient(circle, ${c} 0%, rgba(0,0,0,0) 68%)`, opacity: a, pointerEvents: 'none' }} />
);
// Hoja de papel con renglones manuscritos.
const Paper: React.FC<{ x: number; y: number; w: number; h: number; rot?: number; lines?: number; tone?: string; children?: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w, h, rot = 0, lines = 7, tone = '#E9DFC8', children, style }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, background: tone, transform: `rotate(${rot}deg)`, boxShadow: '0 10px 24px rgba(0,0,0,0.45)', overflow: 'hidden', ...style }}>
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} style={{ position: 'absolute', left: w * 0.1, top: h * 0.14 + i * (h * 0.76 / lines), width: w * (0.55 + 0.3 * random(`pl${x}${i}`)), height: 2, background: 'rgba(60,40,25,0.45)' }} />
    ))}
    {children}
  </div>
);
// Recorte de periódico.
const Clip: React.FC<{ x: number; y: number; w: number; t: string; rot?: number; s?: number }> = ({ x, y, w, t, rot = 0, s = 1 }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, padding: '12px 14px 14px', background: '#E4DAC4', transform: `rotate(${rot}deg) scale(${s})`, boxShadow: '0 10px 22px rgba(0,0,0,0.5)', transformOrigin: '50% 0%' }}>
    <div style={{ fontFamily: font.serif, fontWeight: 700, fontSize: 21, lineHeight: 1.05, color: '#1a1410' }}>{t}</div>
    {[0, 1, 2, 3].map((i) => <div key={i} style={{ height: 3, marginTop: 7, width: `${70 + 25 * random(`cl${t}${i}`)}%`, background: 'rgba(30,20,15,0.35)' }} />)}
  </div>
);
// Siluetas simples (24 de ancho de referencia).
const Fig: React.FC<{ kind: 'stand' | 'child' | 'hood' | 'old' | 'woman' | 'bun'; x: number; y: number; h: number; c?: string; style?: React.CSSProperties }> = ({ kind, x, y, h, c = '#050506', style }) => {
  const s = h / 100;
  const d = {
    stand: 'M50 4a13 13 0 1 1 0 26a13 13 0 1 1 0-26zM28 36q22-8 44 0l8 44h-12l-2 20h-32l-2-20h-12z',
    child: 'M50 14a12 12 0 1 1 0 24a12 12 0 1 1 0-24zM34 42q16-6 32 0l6 36h-9l-2 22h-22l-2-22h-9z',
    hood: 'M50 2q22 6 24 34l10 64h-68l10-64q2-28 24-34z',
    old: 'M54 6a12 12 0 1 1 0 24a12 12 0 1 1 0-24zM34 36q20-6 36 2l6 42h-10l-2 20h-28l-2-20h-8zM78 44l14 56h-4l-14-50z',
    woman: 'M50 6a12 12 0 1 1 0 24a12 12 0 1 1 0-24zM32 36q18-6 36 0l14 64h-64z',
    bun: 'M50 10a12 12 0 1 1 0 24a12 12 0 1 1 0-24zM58 4a7 7 0 1 1 0 14a7 7 0 1 1 0-14zM32 40q18-6 36 0l14 60h-64z',
  }[kind];
  return <svg width={100 * s} height={100 * s} viewBox="0 0 100 100" style={{ position: 'absolute', left: x - 50 * s, top: y - 100 * s, overflow: 'visible', ...style }}><path d={d} fill={c} /></svg>;
};
const Cat: React.FC<{ x: number; y: number; s: number; eyes: number; arch?: number }> = ({ x, y, s, eyes, arch = 0 }) => (
  <svg width={160 * s} height={150 * s} viewBox="0 0 160 150" style={{ position: 'absolute', left: x - 80 * s, top: y - 150 * s, overflow: 'visible' }}>
    <path d={`M40 150 Q30 ${100 - arch * 20} 52 70 L48 40 L62 56 Q72 52 82 56 L96 40 L92 70 Q116 ${100 - arch * 20} 108 150 Z`} fill="#030303" />
    <path d="M108 140 Q150 130 140 90" stroke="#030303" strokeWidth={10} fill="none" strokeLinecap="round" />
    {[62, 82].map((ex) => <ellipse key={ex} cx={ex} cy={70} rx={6} ry={6 * eyes} fill="#F2C94C" />)}
    {[62, 82].map((ex) => <ellipse key={`p${ex}`} cx={ex} cy={70} rx={1.6} ry={5 * eyes} fill="#111" />)}
  </svg>
);
const Sign: React.FC<{ x: number; y: number; w: number; h: number; t: string; bg?: string; fg?: string; rot?: number; size?: number; style?: React.CSSProperties }> = ({ x, y, w, h, t, bg = '#E9E2D2', fg = '#1a1410', rot = 0, size = 34, style }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, background: bg, color: fg, transform: `rotate(${rot}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
    fontFamily: font.sans, fontWeight: 700, fontSize: size, letterSpacing: 1, boxShadow: '0 10px 24px rgba(0,0,0,0.5)', borderRadius: 4, ...style }}>{t}</div>
);
const Moon: React.FC<{ x: number; y: number; r: number; c?: string }> = ({ x, y, r, c = '#E6EEF8' }) => (
  <>
    <Glow x={x} y={y} r={r * 3.2} c="rgba(200,215,240,0.22)" />
    <div style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: c, boxShadow: `0 0 ${r}px rgba(220,235,255,0.6)` }} />
  </>
);

// ———————————————— 10 · La llamada de Cthulhu: el despacho del profesor ————————————————
const DCthulhu: D = ({ t0, beats: [bPap, bBaj, bCul, bNom] }) => {
  const frame = useCurrentFrame();
  const lamp = flicker(frame, 'lampC', frame > bNom ? 2.4 : 0.5);
  const pap = pop(frame, bPap - 4, 14, 120);
  const baj = pop(frame, bBaj - 6, 15, 100);
  const name = 'CTHULHU';
  const write = interpolate(frame, [bNom, bNom + 40], [0, name.length], clamp);
  const tent = rmp(frame, bNom + 10, bNom + 90, easeOut);
  return (
    <Stage bg="linear-gradient(180deg, #14170f 0%, #1c2016 58%, #0d0b08 100%)" dust="rgba(255,226,170,0.35)">
      {/* papel pintado y zócalo */}
      <AbsoluteFill style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 60px)' }} />
      {/* foto del profesor con lazo negro */}
      <div style={{ position: 'absolute', left: 250, top: 190, width: 210, height: 260, background: '#2a2016', boxShadow: '0 16px 30px rgba(0,0,0,0.6)', padding: 16 }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 40%, #b59b72, #6d583c)', overflow: 'hidden', filter: 'sepia(0.6)' }}>
          <Fig kind="old" x={90} y={230} h={210} c="#3a2c1c" />
        </div>
        <div style={{ position: 'absolute', right: -14, top: 18, width: 90, height: 18, background: '#050505', transform: 'rotate(40deg)' }} />
      </div>
      {/* mapa de los cultos */}
      <div style={{ position: 'absolute', left: 1280, top: 130, width: 560, height: 360, background: '#C9B98F', boxShadow: '0 16px 34px rgba(0,0,0,0.6)', overflow: 'hidden' }}>
        <svg width={560} height={360} viewBox="0 0 560 360">
          {[[60, 70, 150, 110], [120, 190, 70, 120], [250, 60, 90, 80], [270, 150, 80, 140], [360, 60, 170, 120], [430, 230, 80, 60]].map(([x, y, w, h], k) => (
            <ellipse key={k} cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2} fill="rgba(90,70,40,0.35)" />
          ))}
          {[[150, 150], [300, 40], [500, 300], [90, 230]].map(([x, y], k) => {
            const q = pop(frame, bCul - 4 + k * 6, 10, 240);
            return <g key={k} opacity={q}><circle cx={x} cy={y} r={9 * q} fill="#C1121F" /><circle cx={x} cy={y} r={20 * q} fill="none" stroke="#C1121F" strokeWidth={2} opacity={0.5} /></g>;
          })}
        </svg>
      </div>
      {[
        { x: 1240, y: 520, t: 'Ritual en los pantanos de Luisiana', rot: -4 },
        { x: 1530, y: 540, t: 'Un culto extraño en Groenlandia', rot: 3 },
        { x: 1700, y: 360, t: 'Un barco a la deriva en el Pacífico', rot: -2 },
      ].map((cl, k) => {
        const q = pop(frame, bCul + k * 7, 12, 200);
        return q > 0.01 ? <div key={k} style={{ opacity: Math.min(1, q * 1.4) }}><Clip x={cl.x} y={cl.y} w={230} t={cl.t} rot={cl.rot} s={0.7 + 0.3 * q} /></div> : null;
      })}
      {/* sombras de tentáculos en la pared */}
      {tent > 0 && (
        <svg width={W} height={H} style={{ position: 'absolute', inset: 0, opacity: 0.55 * tent }}>
          {[0, 1, 2].map((k) => {
            const x0 = 1920 - 300 * tent - k * 220;
            return <path key={k} d={`M${x0 + 400} 700 C ${x0 + 200} ${560 - k * 60}, ${x0 + 60 + Math.sin(frame / 14 + k) * 30} ${360 - k * 40}, ${x0 - 40} ${220 + k * 50} C ${x0 + 40} ${300 + k * 30}, ${x0 + 140} ${520 - k * 50}, ${x0 + 460} 720 Z`} fill="#000" />;
          })}
        </svg>
      )}
      {/* mesa */}
      <div style={{ position: 'absolute', left: -60, right: -60, top: 700, height: 420, background: 'linear-gradient(180deg, #3a2414, #22140a)', transform: 'perspective(900px) rotateX(38deg)', transformOrigin: '50% 0%' }} />
      {/* lámpara */}
      <Glow x={470} y={760} r={520} c={`rgba(255,214,140,${(0.32 * lamp).toFixed(3)})`} />
      <div style={{ position: 'absolute', left: 150, top: 520, width: 200, height: 70, borderRadius: '100px 100px 10px 10px', background: '#1d5a3a', boxShadow: 'inset 0 -10px 0 rgba(0,0,0,0.3)' }} />
      <div style={{ position: 'absolute', left: 240, top: 590, width: 16, height: 130, background: '#8a6b2c' }} />
      <div style={{ position: 'absolute', left: 190, top: 712, width: 120, height: 20, borderRadius: 8, background: '#8a6b2c' }} />
      {/* papeles del tío abuelo */}
      {[[430, 660, -8], [560, 680, 6], [700, 650, -3], [520, 740, 11]].map(([x, y, r], k) => (
        <Paper key={k} x={x + (1 - pap) * (k - 1.5) * -60} y={y + (1 - pap) * 30} w={190} h={230} rot={r * pap} lines={8} />
      ))}
      {/* caja y bajorrelieve */}
      <div style={{ position: 'absolute', left: 900, top: 770, width: 300, height: 120, background: 'linear-gradient(180deg, #5a3a1e, #3a2412)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }} />
      <div style={{ position: 'absolute', left: 900, top: 740, width: 300, height: 36, background: '#6b4626', transformOrigin: '50% 100%', transform: `rotateX(${(baj * 70).toFixed(1)}deg) translateY(${(-baj * 20).toFixed(1)}px)`, opacity: 1 - 0.6 * baj }} />
      <div style={{ position: 'absolute', left: 950, top: 560 + (1 - baj) * 200, width: 200, height: 220, opacity: Math.min(1, baj * 2) }}>
        <Glow x={100} y={110} r={220} c={`rgba(99,210,180,${(0.25 * baj).toFixed(3)})`} />
        <svg width={200} height={220} viewBox="0 0 200 220" style={{ position: 'absolute', inset: 0 }}>
          <rect x="4" y="4" width="192" height="212" rx="10" fill="#A8613A" stroke="#6E3A1E" strokeWidth={6} />
          <circle cx="100" cy="80" r="34" fill="none" stroke="#5a2c14" strokeWidth={6} />
          {[-1, 1].map((sg) => <path key={sg} d={`M${100 + sg * 30} 70 Q ${100 + sg * 80} 30 ${100 + sg * 86} 96 Q ${100 + sg * 60} 74 ${100 + sg * 34} 92`} fill="none" stroke="#5a2c14" strokeWidth={5} />)}
          {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M${74 + k * 13} 110 q ${(k - 2) * 8} 30 ${(k - 2) * 4} 70`} stroke="#5a2c14" strokeWidth={5} fill="none" strokeLinecap="round" />)}
          <circle cx="88" cy="76" r="4" fill="#5a2c14" /><circle cx="112" cy="76" r="4" fill="#5a2c14" />
        </svg>
      </div>
      {/* el nombre que se escribe solo */}
      <Paper x={1110} y={760} w={440} h={180} rot={-4} lines={0} tone="#E1D6BC">
        <div style={{ position: 'absolute', left: 28, top: 54, fontFamily: font.serif, fontSize: 60, fontStyle: 'italic', color: '#2a1408', letterSpacing: 4, whiteSpace: 'nowrap',
          textShadow: frame > bNom ? `0 0 ${(10 * Math.abs(Math.sin(frame / 6))).toFixed(1)}px rgba(99,210,180,0.9)` : undefined }}>
          {name.slice(0, Math.floor(write))}<span style={{ opacity: write % 1 }}>{name[Math.floor(write)] ?? ''}</span>
        </div>
      </Paper>
      <AbsoluteFill style={{ background: `rgba(0,0,0,${(0.25 * (1 - lamp)).toFixed(3)})` }} />
    </Stage>
  );
};

// ———————————————— 9 · Poe: el ojo, el corazón, Usher y el gato ————————————————
const DPoe: D = ({ t0, beats: [bOjo, bCor, bEnt, bGato] }) => {
  const frame = useCurrentFrame();
  const t = frame - bCor;
  const beatF = (f: number) => { const m = ((f % 56) + 56) % 56; return Math.max(interpolate(m, [0, 4, 14], [0, 1, 0], clamp), 0.75 * interpolate(m, [12, 16, 28], [0, 1, 0], clamp)); };
  const heart = t < 0 ? 0 : beatF(t);
  const hOn = rmp(frame, bCor - 6, bCor + 10);
  const eye = rmp(frame, bOjo - 4, bOjo + 12);
  const beam = rmp(frame, bOjo - 20, bOjo + 2);
  const ent = pop(frame, bEnt - 4, 12, 150);
  const scratch = Math.floor(interpolate(frame, [bEnt + 6, bEnt + 70], [0, 6], clamp));
  const cat = pop(frame, bGato - 6, 13, 160);
  const crack = rmp(frame, bEnt, bEnt + 20);
  const bolt = interpolate(frame - bEnt, [0, 2, 6, 8, 20], [0, 1, 0.2, 0.8, 0], clamp);
  const lamp = 0.85 + 0.15 * flicker(frame, 'poeL', 1);
  // «tum… tum…»: uno por latido, sube y se apaga
  const tums = t < 0 ? [] : Array.from({ length: Math.floor(t / 56) + 1 }).map((_, k) => ({ k, m: t - k * 56 })).filter((x) => x.m < 40);
  return (
    <Stage bg="#100c0b" dust="rgba(255,200,150,0.25)" vignette={0.5}>
      {/* habitación del anciano (arriba izquierda) */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 820, height: 640, background: 'linear-gradient(180deg, #1d2333, #121621)', overflow: 'hidden' }}>
        <AbsoluteFill style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0 2px, transparent 2px 70px)' }} />
        {/* puerta entreabierta y el narrador con la linterna */}
        <div style={{ position: 'absolute', left: 0, top: 120, width: 150, height: 520, background: '#07080c', boxShadow: 'inset -8px 0 0 #2a2218' }} />
        <Fig kind="stand" x={70} y={620} h={360} c="#030305" />
        <Glow x={128} y={372} r={70 * lamp} c={`rgba(255,214,140,${(0.55 * lamp).toFixed(3)})`} />
        <div style={{ position: 'absolute', left: 116, top: 356, width: 24, height: 30, borderRadius: 5, background: '#ffcf7a', boxShadow: '0 0 24px 8px rgba(255,200,120,0.55)' }} />
        {/* cama */}
        <div style={{ position: 'absolute', left: 230, top: 300, width: 34, height: 260, background: '#3b2c22' }} />
        <div style={{ position: 'absolute', left: 230, top: 420, width: 560, height: 120, background: '#4a5468', borderRadius: '10px 10px 0 0' }} />
        <div style={{ position: 'absolute', left: 230, top: 540, width: 560, height: 30, background: '#2b2018' }} />
        <div style={{ position: 'absolute', left: 260, top: 382, width: 170, height: 60, borderRadius: 26, background: '#cfd4dc' }} />
        <div style={{ position: 'absolute', left: 400, top: 400, width: 380, height: 70, borderRadius: '34px 12px 12px 34px', background: '#6b7489' }} />
        {/* el anciano: cara pálida y el ojo de buitre */}
        <div style={{ position: 'absolute', left: 290, top: 318, width: 104, height: 92, borderRadius: '50%', background: '#c9bfae', boxShadow: `0 0 ${(40 * beam).toFixed(0)}px rgba(255,220,150,${(0.5 * beam).toFixed(3)})` }}>
          <div style={{ position: 'absolute', left: -6, top: -10, width: 70, height: 34, borderRadius: '50%', background: '#ece8e0' }} />
          <div style={{ position: 'absolute', left: 58, top: 38, width: 22, height: 4, borderRadius: 2, background: '#5a4a3a' }} />
          <div style={{ position: 'absolute', left: 18, top: 28, width: 34, height: 26, borderRadius: '50%', background: '#EAF3F7', transform: `scaleY(${(0.08 + 0.92 * eye).toFixed(3)})`, boxShadow: `0 0 ${(26 * eye).toFixed(0)}px rgba(200,230,255,0.9)` }}>
            <div style={{ position: 'absolute', left: 9, top: 5, width: 16, height: 16, borderRadius: '50%', background: 'radial-gradient(circle, #8fa6b3 0 30%, #c9d8de 40%, #e6eef1 70%)' }} />
          </div>
        </div>
        {/* haz de la linterna sobre el ojo */}
        <div style={{ position: 'absolute', left: 128, top: 300, width: 220, height: 120, background: `linear-gradient(90deg, rgba(255,220,150,${(0.5 * beam).toFixed(3)}) 0%, rgba(255,220,150,${(0.22 * beam).toFixed(3)}) 100%)`, clipPath: 'polygon(0 55%, 100% 0, 100% 100%, 0 70%)' }} />
      </div>
      {/* Usher (arriba derecha) */}
      <div style={{ position: 'absolute', left: 860, top: 0, width: 1060, height: 640, background: 'linear-gradient(180deg, #1c1a28 0%, #2a2633 70%, #121016 100%)', overflow: 'hidden' }}>
        <AbsoluteFill style={{ background: `rgba(200,210,255,${(0.3 * bolt).toFixed(3)})` }} />
        <Moon x={240} y={130} r={44} c="#E6E1D6" />
        <svg width={1060} height={640} viewBox="0 0 1060 640" style={{ position: 'absolute', inset: 0 }}>
          <path d="M0 640 L0 470 Q300 400 560 430 Q800 420 1060 380 L1060 640Z" fill="#0b0a0e" />
          <path d="M440 430 V250 L520 200 L600 250 V200 H640 V250 L760 250 V430 Z" fill="#060509" />
          <path d={`M600 200 L590 ${250 + 80 * crack} L612 ${300 + 60 * crack} L598 ${330 + 100 * crack}`} stroke={`rgba(255,200,120,${(0.9 * crack).toFixed(3)})`} strokeWidth={4} fill="none" />
          {[470, 530, 680].map((x) => <rect key={x} x={x} y="300" width="24" height="30" fill={`rgba(255,190,110,${(0.6 * flicker(frame, `us${x}`, 1)).toFixed(3)})`} />)}
          <path d="M800 0 L770 120 L820 130 L760 300" stroke={`rgba(230,240,255,${bolt.toFixed(3)})`} strokeWidth={4} fill="none" />
        </svg>
        {/* ataúd con arañazos por dentro */}
        <div style={{ position: 'absolute', left: 400, top: 460, width: 380, height: 140, opacity: Math.min(1, ent * 1.5), transform: `translateY(${((1 - ent) * 60).toFixed(1)}px)` }}>
          <Glow x={190} y={70} r={220} c="rgba(255,200,150,0.18)" />
          <svg width={380} height={140} viewBox="0 0 380 140" style={{ position: 'absolute', inset: 0 }}>
            <path d="M10 70 L66 12 H334 L370 70 L334 128 H66 Z" fill="#4a3226" stroke="#1a110c" strokeWidth={6} />
            {Array.from({ length: scratch }).map((_, k) => <path key={k} d={`M${130 + k * 28} 42 l 12 50`} stroke="rgba(240,225,205,0.9)" strokeWidth={4} />)}
          </svg>
        </div>
      </div>
      {/* tablas del suelo con el latido */}
      <div style={{ position: 'absolute', left: -200, right: -200, top: 660, height: 900, transform: 'perspective(1000px) rotateX(55deg)', transformOrigin: '50% 0%' }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ position: 'absolute', left: i * 200, top: 0, width: 194, height: 900, background: 'linear-gradient(90deg, #2c2018, #3a2b20 50%, #261b14)' }} />
        ))}
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={`g${i}`} style={{ position: 'absolute', left: (i + 1) * 200 - 4, top: 0, width: 6, height: 900, background: `rgba(230,40,58,${((0.08 + 0.92 * heart * hOn) * (i === 5 || i === 6 ? 1 : 0.25)).toFixed(3)})`, boxShadow: `0 0 ${(18 + 40 * heart).toFixed(0)}px rgba(230,40,58,${(0.7 * heart * hOn).toFixed(3)})` }} />
        ))}
      </div>
      {/* el corazón bajo las tablas */}
      <div style={{ position: 'absolute', left: 900 - 150, top: 800 - 140, width: 300, height: 280, opacity: hOn * (0.35 + 0.65 * heart), transform: `scale(${(0.9 + 0.18 * heart).toFixed(3)})`, filter: 'blur(5px)', mixBlendMode: 'screen' }}>
        <svg width={300} height={280} viewBox="0 0 300 280"><path d="M150 262 C 40 180, 0 120, 20 70 C 40 18, 112 10, 150 64 C 188 10, 260 18, 280 70 C 300 120, 260 180, 150 262 Z" fill="#e5283a" /></svg>
      </div>
      <Glow x={900} y={800} r={340} c={`rgba(230,40,58,${(0.5 * heart * hOn).toFixed(3)})`} />
      {tums.map(({ k, m }) => (
        <div key={k} style={{ position: 'absolute', left: 900 + (k % 2 ? 150 : -290), top: 700 - m * 2.2, fontFamily: font.serif, fontStyle: 'italic', fontSize: 64, color: '#ff8a8a', whiteSpace: 'nowrap',
          opacity: interpolate(m, [0, 3, 26, 40], [0, 1, 0.8, 0], clamp), transform: `scale(${(0.8 + 0.25 * interpolate(m, [0, 6], [0, 1], clamp)).toFixed(3)})`, textShadow: '0 0 20px rgba(255,60,60,0.8)' }}>tum…</div>
      ))}
      {/* el gato negro */}
      <Glow x={1660} y={820} r={260} c="rgba(255,200,120,0.12)" />
      <div style={{ opacity: Math.min(1, cat * 1.4) }}><Cat x={1660} y={900} s={1.3} eyes={rmp(frame, bGato, bGato + 8)} arch={cat} /></div>
    </Stage>
  );
};

// ———————————————— 8 · Cómo vender una casa encantada: la casa de los padres ————————————————
const Puppet: React.FC<{ c: string; s?: number; head?: number; glow?: number }> = ({ c, s = 1, head = 0, glow = 0 }) => (
  <svg width={260 * s} height={560 * s} viewBox="0 0 260 560" style={{ overflow: 'visible' }}>
    {[70, 130, 190].map((x) => <path key={x} d={`M${x} -400 L${x === 130 ? 130 : x === 70 ? 92 : 168} ${x === 130 ? 150 : 250}`} stroke="rgba(239,232,220,0.35)" strokeWidth={1.4} />)}
    <g transform={`rotate(${-14 + head * 22} 130 200)`}>
      <circle cx="130" cy="200" r="56" fill={c} />
      <circle cx="108" cy="190" r="15" fill="#0A0807" /><circle cx="152" cy="190" r="15" fill="#0A0807" />
      <circle cx="110" cy="192" r={3.2 + 3 * glow} fill={glow > 0.1 ? '#ff3b3b' : '#F2EEE6'} /><circle cx="150" cy="188" r={3.2 + 3 * glow} fill={glow > 0.1 ? '#ff3b3b' : '#F2EEE6'} />
      <path d={`M96 ${226 - 6 * glow} Q130 ${236 + 14 * glow} 164 ${226 - 6 * glow}`} stroke="#0A0807" strokeWidth={4} fill="none" strokeLinecap="round" />
      {[104, 116, 128, 140, 152].map((x) => <path key={x} d={`M${x} 224 L${x + 2} ${236 + 8 * glow}`} stroke="#0A0807" strokeWidth={3} strokeLinecap="round" />)}
    </g>
    <path d="M78 140 L130 92 L182 140 Z" fill={c} opacity={0.9} />
    <rect x="92" y="262" width="76" height="140" rx="20" fill={c} />
    <path d="M96 280 L48 380 M164 280 L212 360 M110 400 L96 520 M150 400 L166 520" stroke={c} strokeWidth={20} strokeLinecap="round" />
  </svg>
);
const DHendrix: D = ({ t0, beats: [bPad, bCasa, bTit, bMun, bCon] }) => {
  const frame = useCurrentFrame();
  const sw = (k: number) => Math.sin((frame - t0) / (30 + k * 4) + k) * 7;
  const drop = (k: number) => pop(frame, bTit - 6 + k * 6, 11, 120);
  const dolls = rmp(frame, bMun - 2, bMun + 6);
  const head = rmp(frame, bCon, bCon + 22, easeOut);
  const sign = pop(frame, bCasa - 6, 12, 170);
  const photo = rmp(frame, bPad - 8, bPad + 8);
  return (
    <Stage bg="#1A1210" dust="rgba(255,220,180,0.25)">
      <AbsoluteFill style={{ backgroundImage: 'linear-gradient(45deg, rgba(181,69,43,0.10) 25%, transparent 25%, transparent 75%, rgba(181,69,43,0.10) 75%), linear-gradient(45deg, rgba(181,69,43,0.10) 25%, transparent 25%, transparent 75%, rgba(181,69,43,0.10) 75%)',
        backgroundSize: '90px 90px', backgroundPosition: '0 0, 45px 45px' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 880, bottom: 0, background: '#120b08' }} />
      {/* foto de los padres */}
      <Glow x={380} y={360} r={260} c={`rgba(255,214,150,${(0.25 * photo).toFixed(3)})`} />
      <div style={{ position: 'absolute', left: 260, top: 230, width: 240, height: 270, padding: 16, background: '#3a2416', boxShadow: '0 16px 30px rgba(0,0,0,0.6)' }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 35%, #c8ae86, #7a6043)', overflow: 'hidden', filter: `sepia(0.5) brightness(${(0.6 + 0.4 * photo).toFixed(3)})` }}>
          <Fig kind="stand" x={70} y={250} h={190} c="#4a3624" /><Fig kind="woman" x={140} y={250} h={175} c="#5a4430" />
        </div>
        <div style={{ position: 'absolute', right: -16, top: 20, width: 100, height: 18, background: '#050505', transform: 'rotate(40deg)' }} />
      </div>
      {/* cartel SE VENDE */}
      <div style={{ position: 'absolute', left: 520, top: 600, opacity: Math.min(1, sign * 1.4), transform: `translateY(${((1 - sign) * 80).toFixed(1)}px) rotate(${(-6 + 4 * (1 - sign)).toFixed(2)}deg)`, transformOrigin: '50% 100%' }}>
        <div style={{ position: 'absolute', left: 110, top: 160, width: 14, height: 140, background: '#4a3020' }} />
        <Sign x={0} y={0} w={240} h={170} t="SE VENDE" bg="#E8E0CE" fg="#9b2c1c" size={46} style={{ border: '6px solid #9b2c1c' }} />
      </div>
      {/* ventana */}
      <div style={{ position: 'absolute', left: 1500, top: 110, width: 300, height: 380, background: 'linear-gradient(180deg, #2B3A55, #1A2234)', boxShadow: 'inset 0 0 0 16px #2A1B14' }}>
        <div style={{ position: 'absolute', left: 142, top: 0, width: 16, height: 380, background: '#2A1B14' }} />
        <div style={{ position: 'absolute', left: 190, top: 50, width: 70, height: 70, borderRadius: '50%', background: '#E6EEF8', boxShadow: '0 0 60px rgba(220,235,255,0.8)' }} />
      </div>
      {/* estantería con muñecas */}
      <div style={{ position: 'absolute', left: 1300, top: 760, width: 560, height: 24, background: '#2A1B14', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }} />
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={{ position: 'absolute', left: 1330 + i * 105, top: 640, width: 80, height: 120 }}>
          <div style={{ position: 'absolute', left: 15, top: 0, width: 50, height: 50, borderRadius: '50%', background: '#E9D8C0' }} />
          {[26, 44].map((x) => <div key={x} style={{ position: 'absolute', left: x, top: 20, width: 7, height: 7 * dolls + 1, borderRadius: '50%', background: '#111', boxShadow: dolls > 0.5 ? '0 0 6px rgba(255,255,255,0.4)' : undefined }} />)}
          <div style={{ position: 'absolute', left: 6, top: 48, width: 68, height: 72, borderRadius: '30px 30px 10px 10px', background: ['#6B2A2A', '#2E4A5C', '#5C4A2E', '#3E2E5C', '#2E5C45'][i] }} />
        </div>
      ))}
      {/* títeres colgados */}
      {[{ x: 760, s: 0.62, k: 0 }, { x: 1250, s: 0.6, k: 2 }].map((pp) => (
        <div key={pp.k} style={{ position: 'absolute', left: pp.x, top: -480 + 540 * drop(pp.k), transformOrigin: '80px -250px', transform: `rotate(${sw(pp.k)}deg)` }}><Puppet c="#d8c7ae" s={pp.s} /></div>
      ))}
      <div style={{ position: 'absolute', left: 930, top: -660 + 760 * drop(1), transformOrigin: '130px -400px', transform: `rotate(${sw(1) * (1 - head)}deg)` }}>
        <Puppet c="#E9D8C0" s={0.95} head={head} glow={head} />
      </div>
    </Stage>
  );
};

// ———————————————— 7 · Distancia de rescate: urgencias y el campo ————————————————
const DSchweblin: D = ({ t0, beats: [bUrg, bNin, bExa, bCam] }) => {
  const frame = useCurrentFrame();
  const t = frame - t0;
  const ecg = (x: number) => {
    const m = ((x + t * 6) % 220 + 220) % 220;
    return m > 100 && m < 112 ? -60 * Math.sin(((m - 100) / 12) * Math.PI) : m > 112 && m < 122 ? 30 * Math.sin(((m - 112) / 10) * Math.PI) : 0;
  };
  const kid = pop(frame, bNin - 6, 13, 150);
  const clock = interpolate(frame, [bExa - 4, bExa + 60], [0, -720], { ...clamp, easing: easeOut });
  const mist = rmp(frame, bCam - 10, bCam + 60);
  return (
    <Stage bg="linear-gradient(180deg, #1c2622 0%, #141c18 100%)" dust="rgba(200,255,220,0.2)">
      {/* sala */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 960, height: 1080, background: 'linear-gradient(180deg, #24302b, #18201c)' }} />
      <Glow x={420} y={140} r={420} c="rgba(200,255,230,0.14)" />
      {/* monitor */}
      <div style={{ position: 'absolute', left: 120, top: 250, width: 280, height: 180, background: '#0a0f0d', border: '10px solid #39443f', borderRadius: 10 }}>
        <svg width={260} height={160} viewBox="0 0 260 160" style={{ position: 'absolute', left: 0, top: 0 }}>
          <path d={Array.from({ length: 53 }).map((_, i) => `${i ? 'L' : 'M'}${i * 5} ${80 + ecg(i * 5)}`).join(' ')} stroke="#5CFF9D" strokeWidth={3} fill="none" opacity={frame >= bUrg - 6 ? 1 : 0.3} />
        </svg>
      </div>
      <div style={{ position: 'absolute', left: 420, top: 300, width: 10, height: 380, background: '#5d6a64' }} />
      <div style={{ position: 'absolute', left: 395, top: 300, width: 60, height: 80, borderRadius: 10, background: 'rgba(200,230,255,0.35)' }} />
      {/* cama y mujer */}
      <div style={{ position: 'absolute', left: 150, top: 640, width: 640, height: 60, background: '#d8dfda', borderRadius: 12 }} />
      <div style={{ position: 'absolute', left: 150, top: 700, width: 640, height: 120, background: '#86928c' }} />
      <div style={{ position: 'absolute', left: 170, top: 590, width: 180, height: 70, borderRadius: 30, background: '#eef2ef' }} />
      <div style={{ position: 'absolute', left: 220, top: 560, width: 90, height: 90, borderRadius: '50%', background: '#2b2420' }} />
      <div style={{ position: 'absolute', left: 300, top: 600, width: 470, height: 70, borderRadius: '30px 12px 12px 30px', background: '#aab8b0' }} />
      {/* el niño que le habla al oído */}
      <div style={{ opacity: Math.min(1, kid * 1.4), transform: `translateX(${((1 - kid) * 40).toFixed(1)}px)` }}>
        <Fig kind="child" x={120} y={830} h={330} c="#0b0e0c" />
        {[0, 1, 2].map((k) => {
          const w = ((frame - bNin) / 14 + k / 3) % 1;
          return frame > bNin ? <div key={k} style={{ position: 'absolute', left: 180 + w * 50, top: 548 + w * 22, width: 30 + w * 34, height: 30 + w * 34, borderRadius: '50%', border: `3px solid rgba(200,255,220,${(0.75 * (1 - w)).toFixed(3)})`, borderLeftColor: 'transparent', borderBottomColor: 'transparent', transform: 'rotate(45deg)' }} /> : null;
        })}
      </div>
      {/* reloj */}
      <div style={{ position: 'absolute', left: 680, top: 170, width: 160, height: 160, borderRadius: '50%', background: '#e6ece8', border: '8px solid #39443f' }}>
        {[0, 1].map((k) => <div key={k} style={{ position: 'absolute', left: 77, top: k ? 30 : 46, width: 6, height: k ? 50 : 34, background: '#111', transformOrigin: `3px ${k ? 50 : 34}px`, transform: `rotate(${(k ? clock : clock / 12) + (k ? 0 : 120)}deg)` }} />)}
      </div>
      {/* ventana al campo */}
      <div style={{ position: 'absolute', left: 1000, top: 110, width: 880, height: 680, overflow: 'hidden', boxShadow: 'inset 0 0 0 16px #39443f' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #3A4632 0%, #5A6648 38%, #1A2117 39%, #0E120C 100%)' }} />
        <svg width={880} height={680} viewBox="0 0 880 680" style={{ position: 'absolute', inset: 0 }}>
          {Array.from({ length: 23 }).map((_, i) => <path key={i} d={`M440 262 L${-700 + i * 100} 680`} stroke="rgba(150,175,90,0.3)" strokeWidth={3} />)}
          <rect x="600" y="230" width="60" height="34" fill="#0D110B" /><path d="M592 232 L630 210 L668 232Z" fill="#0D110B" />
          {[[200, 500], [260, 520], [700, 560]].map(([x, y], k) => <g key={k} opacity={mist}><rect x={x} y={y} width="44" height="60" rx="6" fill="#2a3a22" /><rect x={x} y={y + 14} width="44" height="6" fill="#9BD14B" /></g>)}
        </svg>
        {[0, 1, 2].map((i) => <div key={i} style={{ position: 'absolute', left: -300 + ((t * (0.6 + i * 0.3) + i * 400) % 1400), top: 300 + i * 90 - mist * 80, width: 900, height: 220, borderRadius: '50%', background: `radial-gradient(ellipse, rgba(170,230,110,${(0.12 + 0.3 * mist).toFixed(3)}), rgba(0,0,0,0) 70%)`, filter: 'blur(12px)' }} />)}
      </div>
    </Stage>
  );
};

// ———————————————— 6 · Drácula: el viaje, la cena, el espejo y el amanecer ————————————————
const DDracula: D = ({ t0, beats: [bTra, bCom, bEsp, bDia] }) => {
  const frame = useCurrentFrame();
  const t = frame - t0;
  const car = interpolate(frame, [bTra - 50, bTra + 90], [0, 1], { ...clamp, easing: easeOut });
  const plate = pop(frame, bCom - 4, 12, 170);
  const mir = rmp(frame, bEsp - 6, bEsp + 14);
  const dawn = rmp(frame, bDia - 6, bDia + 40);
  const count = 1 - rmp(frame, bDia + 10, bDia + 50);
  return (
    <Stage bg="#120509" dust="rgba(255,210,180,0.2)">
      {/* fuera: el camino a Transilvania */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 720, height: 1080, background: 'linear-gradient(180deg, #120509 0%, #2A0A12 60%, #080304 100%)', overflow: 'hidden' }}>
        <Moon x={520} y={180} r={70} c="#F4E2C4" />
        <svg width={720} height={1080} viewBox="0 0 720 1080" style={{ position: 'absolute', inset: 0 }}>
          <path d="M0 1080 L0 620 L120 520 L220 560 L300 420 L380 470 L470 330 L560 380 L720 300 L720 1080Z" fill="#0a0305" />
          <path d="M430 330 V230 L450 230 V200 L470 160 L490 200 V230 L520 230 V330Z" fill="#050203" />
          {[[455, 260], [495, 270]].map(([x, y], k) => <rect key={k} x={x} y={y} width="8" height="12" fill={`rgba(255,200,120,${(0.8 * flicker(frame, `cw${k}`, 1)).toFixed(3)})`} />)}
          <path d="M40 1080 C 160 900, 120 820, 260 760 S 420 640, 440 560" stroke="#2a1418" strokeWidth={30} fill="none" />
        </svg>
        {/* carruaje */}
        {(() => {
          const px = interpolate(car, [0, 1], [170, 430]), py = interpolate(car, [0, 1], [900, 590]);
          const s = 1 - 0.45 * car;
          return (
            <div style={{ position: 'absolute', left: px, top: py, transform: `scale(${s.toFixed(3)})`, transformOrigin: '50% 100%' }}>
              <div style={{ position: 'absolute', left: -60, top: -70, width: 120, height: 70, background: '#050203', borderRadius: '12px 12px 4px 4px' }} />
              {[-50, 40].map((x) => <div key={x} style={{ position: 'absolute', left: x, top: -16, width: 30, height: 30, borderRadius: '50%', border: '5px solid #050203' }} />)}
              {[-70, 62].map((x) => <div key={x} style={{ position: 'absolute', left: x, top: -66, width: 10, height: 14, background: '#ffcf7a', boxShadow: '0 0 20px 6px rgba(255,200,120,0.5)' }} />)}
            </div>
          );
        })()}
      </div>
      <div style={{ position: 'absolute', left: 716, top: 0, width: 26, height: 1080, background: '#1a0c0c', boxShadow: '0 0 40px rgba(0,0,0,0.8)' }} />
      {/* dentro: el comedor */}
      <div style={{ position: 'absolute', left: 742, top: 0, right: 0, height: 1080, background: 'linear-gradient(180deg, #24100f, #160807)' }} />
      <AbsoluteFill style={{ background: `linear-gradient(115deg, rgba(0,0,0,0) 40%, rgba(255,214,150,${(0.35 * dawn).toFixed(3)}) 70%, rgba(255,230,190,${(0.5 * dawn).toFixed(3)}) 100%)` }} />
      {/* espejo */}
      <div style={{ position: 'absolute', left: 1460, top: 170, width: 300, height: 500, borderRadius: '150px 150px 10px 10px', background: 'linear-gradient(160deg, #5b6b74, #2a3238)', border: '14px solid #8a6a2c', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,${(0.18 + 0.15 * mir).toFixed(3)}) 45%, rgba(255,255,255,0) 60%)` }} />
        {[0, 1, 2].map((k) => <div key={k} style={{ position: 'absolute', left: 40 + k * 22, top: 360, width: 6, height: 14, borderRadius: '50% 50% 40% 40%', background: '#ffcf7a', opacity: 0.55 * flicker(frame, `mr${k}`, 1), boxShadow: '0 0 10px rgba(255,200,120,0.6)' }} />)}
        <svg width={272} height={472} viewBox="0 0 272 472" style={{ position: 'absolute', left: 0, top: 0, opacity: mir * (0.5 + 0.5 * Math.abs(Math.sin((frame - bEsp) / 9))) }}>
          <path d="M136 120 q 44 12 48 72 l 22 230 h -140 l 22 -230 q 4 -60 48 -72 z" fill="none" stroke="rgba(255,90,90,0.85)" strokeWidth={3} strokeDasharray="10 9" />
        </svg>
      </div>
      {/* el conde delante del espejo (sin reflejo) */}
      <div style={{ opacity: count * (0.3 + 0.7 * Math.max(mir, plate)) }}>
        <Fig kind="hood" x={1360} y={820} h={430} c="#030102" />
        <div style={{ position: 'absolute', left: 1330, top: 455, width: 60, height: 70, borderRadius: '50%', background: '#d9c8b8', opacity: 0.9 }} />
      </div>
      {/* mesa: un solo plato */}
      <div style={{ position: 'absolute', left: 780, top: 720, width: 560, height: 40, background: '#3a1a10', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }} />
      <div style={{ position: 'absolute', left: 800, top: 760, width: 520, height: 200, background: '#2a120a' }} />
      <Glow x={900} y={690} r={220} c={`rgba(255,214,150,${(0.15 + 0.3 * plate).toFixed(3)})`} />
      <div style={{ position: 'absolute', left: 840, top: 700, width: 130, height: 26, borderRadius: '50%', background: '#e8e2d6', transform: `scale(${(0.8 + 0.2 * plate).toFixed(3)})` }} />
      <div style={{ position: 'absolute', left: 1180, top: 700, width: 120, height: 24, borderRadius: '50%', border: '3px dashed rgba(232,226,214,0.35)', opacity: plate }} />
      <div style={{ position: 'absolute', left: 1070, top: 560, width: 10, height: 160, background: '#8a6a2c' }} />
      {[1040, 1066, 1092].map((x) => <div key={x} style={{ position: 'absolute', left: x, top: 540, width: 8, height: 26, background: '#efe6d2' }}><div style={{ position: 'absolute', left: -2, top: -16, width: 12, height: 16, borderRadius: '50% 50% 40% 40%', background: '#ffcf7a', transform: `scale(${flicker(frame, `cd${x}`, 1).toFixed(3)})` }} /></div>)}
      {/* el ataúd al amanecer */}
      <div style={{ position: 'absolute', left: 1400, top: 720, opacity: dawn }}>
        <svg width={420} height={140} viewBox="0 0 420 140"><path d="M10 70 L70 10 H370 L410 70 L370 130 H70 Z" fill="#160a06" stroke="#3a1a10" strokeWidth={6} /></svg>
      </div>
    </Stage>
  );
};

// ———————————————— 5 · Apocalipsis Z: Pontevedra, el gato y la tele ————————————————
// Siluetas aproximadas de Europa y Rusia (u, v de 0 a 1 sobre la rejilla de puntos de la tele): [cx, cy, rx, ry].
const LAND: [number, number, number, number][] = [
  [0.07, 0.72, 0.075, 0.15], [0.16, 0.55, 0.07, 0.15], [0.11, 0.3, 0.035, 0.12], [0.27, 0.45, 0.1, 0.2], [0.3, 0.14, 0.07, 0.2], [0.27, 0.76, 0.03, 0.12],
  [0.36, 0.7, 0.05, 0.1], [0.42, 0.42, 0.08, 0.26], [0.72, 0.35, 0.3, 0.29], [0.47, 0.84, 0.07, 0.07], [0.72, 0.74, 0.15, 0.13],
];
const DApocalipsis: D = ({ t0, beats: [bPon, bGat, bRus, bExt] }) => {
  const frame = useCurrentFrame();
  const t = frame - t0;
  const spread = interpolate(frame, [bExt - 10, bExt + 140], [0, 1], { ...clamp, easing: easeInOut });
  const ru = rmp(frame, bRus - 6, bRus + 10);
  const cols = 30, rows = 13;
  const cat = pop(frame, bGat - 6, 13, 170);
  const sign = pop(frame, bPon - 6, 13, 170);
  return (
    <Stage bg="#0B0D0B" dust="rgba(200,220,255,0.15)">
      {/* ventana con lluvia y el cartel de Pontevedra */}
      <div style={{ position: 'absolute', left: 120, top: 140, width: 420, height: 480, background: 'linear-gradient(180deg, #1a2430, #0d141c)', boxShadow: 'inset 0 0 0 14px #2a2a26', overflow: 'hidden' }}>
        {Array.from({ length: 40 }).map((_, i) => { const r = (k: string) => random(`rain${i}${k}`); const y = ((t * (6 + r('v') * 4) + r('y') * 480) % 520) - 40; return <div key={i} style={{ position: 'absolute', left: r('x') * 420, top: y, width: 2, height: 22, background: 'rgba(200,220,255,0.35)' }} />; })}
        <div style={{ position: 'absolute', left: 60, top: 300, width: 300, height: 180, background: '#0a0f14' }} />
        <div style={{ opacity: Math.min(1, sign * 1.4), transform: `scale(${(0.8 + 0.2 * sign).toFixed(3)})`, transformOrigin: '50% 100%' }}>
          <div style={{ position: 'absolute', left: 200, top: 250, width: 8, height: 120, background: '#5a5f66' }} />
          <Sign x={80} y={180} w={250} h={70} t="PONTEVEDRA" bg="#F2F2EE" fg="#1a1a1a" size={30} style={{ border: '4px solid #1a1a1a' }} />
        </div>
      </div>
      {/* sofá, el abogado y su gato */}
      <div style={{ position: 'absolute', left: 230, top: 720, width: 640, height: 200, borderRadius: 30, background: '#2a2e2a' }} />
      <div style={{ position: 'absolute', left: 230, top: 640, width: 640, height: 110, borderRadius: '30px 30px 0 0', background: '#33382f' }} />
      <Fig kind="stand" x={470} y={800} h={300} c="#0a0b0a" />
      <div style={{ opacity: Math.min(1, cat * 1.4), transform: `translateY(${((1 - cat) * 30).toFixed(1)}px)` }}><Cat x={760} y={700} s={0.9} eyes={rmp(frame, bGat, bGat + 8)} /></div>
      <Glow x={1300} y={460} r={700} c={`rgba(120,170,255,${(0.12 + 0.05 * Math.sin(frame / 3)).toFixed(3)})`} />
      {/* la tele */}
      <div style={{ position: 'absolute', left: 1000, top: 170, width: 840, height: 560, borderRadius: 36, background: 'linear-gradient(160deg, #3A3A36, #1D1D1B)', boxShadow: '0 40px 120px rgba(0,0,0,0.7), inset 0 0 0 6px #4A4A45' }}>
        <div style={{ position: 'absolute', left: 40, top: 40, width: 760, height: 430, borderRadius: 24, overflow: 'hidden', background: '#0E1410' }}>
          <svg width={760} height={430} style={{ position: 'absolute', inset: 0 }}>
            <filter id="tvn2"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 97} /><feColorMatrix type="saturate" values="0" /></filter>
            <rect width="760" height="430" filter="url(#tvn2)" opacity={0.14} />
            {Array.from({ length: rows }).map((_, r) => Array.from({ length: cols }).map((__, c) => {
              const rr = random(`map2-${r}-${c}`);
              if (rr < 0.07 || !LAND.some(([cx, cy, rx, ry]) => ((c / (cols - 1) - cx) / rx) ** 2 + ((r / (rows - 1) - cy) / ry) ** 2 < 1)) return null;
              const x = 40 + c * 23.5, y = 50 + r * 25;
              const seed = c / (cols - 1) > 0.86 && Math.abs(r - 5) < 3 ? ru : 0;
              const inf = c / (cols - 1) > 1 - spread * 1.15 + (random(`mj2-${r}-${c}`) - 0.5) * 0.12;
              const on = Math.max(seed, inf ? 1 : 0);
              return <circle key={`${r}-${c}`} cx={x} cy={y} r={on ? 6 : 4.5} fill={on ? '#E5484D' : 'rgba(155,209,75,0.45)'} opacity={on ? 0.75 + 0.25 * Math.sin(t / 8 + c) : 1} />;
            }))}
            <text x="700" y="34" fill="rgba(239,232,220,0.85)" fontFamily="Ubuntu" fontWeight={700} fontSize="22" textAnchor="end" opacity={ru}>RUSIA</text>
            <text x="34" y="350" fill="rgba(239,232,220,0.85)" fontFamily="Ubuntu" fontWeight={700} fontSize="22">PONTEVEDRA</text>
            <circle cx="56" cy="244" r={7} fill="#FFCA05" /><circle cx="56" cy="244" r={12 + 10 * Math.abs(Math.sin(t / 12))} fill="none" stroke="#FFCA05" strokeWidth={2} opacity={0.6} />
          </svg>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 52, background: '#C1121F', display: 'flex', alignItems: 'center', overflow: 'hidden', opacity: ru }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 26, color: '#fff', whiteSpace: 'nowrap', transform: `translateX(${(760 - ((frame - bRus) * 4) % 2200).toFixed(1)}px)` }}>
              ÚLTIMA HORA · UN BROTE EXTRAÑO EN RUSIA · LAS AUTORIDADES PIDEN CALMA · ÚLTIMA HORA · UN BROTE EXTRAÑO EN RUSIA
            </div>
          </div>
          <AbsoluteFill style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 2px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 5px)' }} />
        </div>
      </div>
      <div style={{ position: 'absolute', left: 980, top: 740, width: 880, height: 30, background: '#1a1714' }} />
    </Stage>
  );
};

// ———————————————— 4 · Carcoma: la casa del pueblo ————————————————
const DCarcoma: D = ({ t0, beats: [bAbu, bDes, bMur, bAlg] }) => {
  const frame = useCurrentFrame();
  const two = rmp(frame, bAbu - 8, bAbu + 8);
  const poster = pop(frame, bDes - 6, 12, 170);
  const mur = (k: number) => pop(frame, bMur - 4 + k * 6, 12, 200);
  const open = interpolate(frame, [bAlg, bAlg + 60], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <Stage bg="linear-gradient(180deg, #0c0a10 0%, #1a1520 55%, #0a0806 100%)" dust="rgba(255,220,170,0.2)">
      <Moon x={1720} y={120} r={46} />
      {/* calle */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 880, bottom: 0, background: '#0b0907' }} />
      {/* vecinos a los lados */}
      {[{ x: 40, w: 440 }, { x: 1560, w: 360 }].map((hh, k) => (
        <div key={k} style={{ position: 'absolute', left: hh.x, top: 240, width: hh.w, height: 640, background: '#120e0c', boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.6)' }}>
          {[0, 1].map((r) => [0, 1].map((cc) => {
            const lit = k === 0 || cc === 0;
            const i = r * 2 + cc;
            return (
              <div key={`${r}${cc}`} style={{ position: 'absolute', left: 50 + cc * (hh.w / 2), top: 70 + r * 260, width: 120, height: 150, background: lit ? '#d9a95a' : '#0a0806', boxShadow: 'inset 0 0 0 8px #2a1d14' }}>
                {lit && <Fig kind={i % 2 ? 'bun' : 'woman'} x={60} y={150} h={110} c="#1a1008" />}
                {lit && mur(i + k * 4) > 0.01 && (
                  <div style={{ position: 'absolute', left: k ? -70 : 90, top: -50, padding: '6px 14px', borderRadius: 14, background: '#efe6d2', fontFamily: font.sans, fontWeight: 700, fontSize: 30, color: '#1a1008', transform: `scale(${mur(i + k * 4).toFixed(3)})` }}>…</div>
                )}
              </div>
            );
          }))}
        </div>
      ))}
      {/* la casa de la abuela */}
      <div style={{ position: 'absolute', left: 560, top: 260, width: 820, height: 620, background: 'linear-gradient(180deg, #3a2a1c, #22180f)', boxShadow: '0 0 0 3px rgba(0,0,0,0.5)' }}>
        <div style={{ position: 'absolute', left: -40, top: -130, width: 900, height: 140, background: '#1a120b', clipPath: 'polygon(5% 100%, 50% 0, 95% 100%)' }} />
        {/* ventana 1: abuela y nieta */}
        <div style={{ position: 'absolute', left: 140, top: 120, width: 240, height: 230, background: `rgba(230,180,110,${(0.25 + 0.65 * two).toFixed(3)})`, boxShadow: 'inset 0 0 0 12px #1a120b', overflow: 'hidden' }}>
          <Fig kind="bun" x={90} y={250} h={190} c="#120a05" />
          <Fig kind="woman" x={170} y={250} h={170} c="#160c06" style={{ opacity: two }} />
        </div>
        {/* ventana 2: el armario */}
        <div style={{ position: 'absolute', left: 470, top: 120, width: 240, height: 230, background: '#0a0705', boxShadow: 'inset 0 0 0 12px #1a120b', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 60, top: 40, width: 120, height: 190, background: '#4a311f' }}>
            <div style={{ position: 'absolute', left: 60, top: 0, width: 60, height: 190, background: '#050302' }} />
            {[66, 84].map((x) => <div key={x} style={{ position: 'absolute', left: x, top: 64, width: 8, height: 8 * rmp(frame, bAlg + 34, bAlg + 40), borderRadius: '50%', background: '#f4efe2', boxShadow: '0 0 10px 3px rgba(255,240,210,0.6)', opacity: rmp(frame, bAlg + 30, bAlg + 36) }} />)}
            <div style={{ position: 'absolute', left: 60, top: 0, width: 60, height: 190, background: '#5E3F28', transformOrigin: 'right center', transform: `perspective(400px) rotateY(${(open * 70).toFixed(1)}deg)` }} />
            <div style={{ position: 'absolute', left: 0, top: 0, width: 60, height: 190, background: '#5E3F28' }} />
          </div>
          <Glow x={150} y={130} r={120} c={`rgba(255,230,180,${(0.25 * open).toFixed(3)})`} />
        </div>
        <div style={{ position: 'absolute', left: 360, top: 430, width: 120, height: 190, background: '#140d08', boxShadow: 'inset 0 0 0 8px #241810' }} />
      </div>
      {/* farola con el cartel del niño desaparecido */}
      <div style={{ position: 'absolute', left: 1440, top: 240, width: 14, height: 640, background: '#1a1a1d' }} />
      <Glow x={1447} y={250} r={180} c="rgba(255,214,150,0.25)" />
      <div style={{ position: 'absolute', left: 1395, top: 430, width: 120, height: 160, background: '#E9E2D2', boxShadow: '0 10px 20px rgba(0,0,0,0.5)', transform: `rotate(${(-4 + (1 - poster) * 10).toFixed(2)}deg) scale(${poster.toFixed(3)})`, transformOrigin: '50% 0%' }}>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 13, textAlign: 'center', marginTop: 8, color: '#9b2c1c', letterSpacing: 1 }}>DESAPARECIDO</div>
        <div style={{ position: 'relative', margin: '6px auto 0', width: 70, height: 80, background: '#bfb6a2', overflow: 'hidden' }}><Fig kind="child" x={35} y={100} h={100} c="#5a5244" /></div>
      </div>
    </Stage>
  );
};

// ———————————————— 3 · Salem's Lot: el regreso, la casa, los recién llegados ————————————————
const DSalem: D = ({ t0, beats: [bVue, bCas, bRec, bDes] }) => {
  const frame = useCurrentFrame();
  const t = frame - t0;
  const car = interpolate(frame, [bVue - 40, bVue + 80], [0, 1], { ...clamp, easing: easeOut });
  const sold = pop(frame, bRec - 4, 12, 170);
  const truck = interpolate(frame, [bRec - 10, bRec + 80], [0, 1], { ...clamp, easing: easeOut });
  const face = rmp(frame, bDes + 40, bDes + 60);
  const houseLit = rmp(frame, bCas - 6, bCas + 6);
  return (
    <Stage bg="linear-gradient(180deg, #131a28 0%, #232c3f 60%, #0d1016 100%)" dust="rgba(220,230,255,0.15)">
      <Moon x={300} y={130} r={70} c="#DDE3EE" />
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <path d="M900 1080 C 1100 700, 1300 380, 1520 360 C 1700 350, 1820 420, 1920 470 L1920 1080 Z" fill="#06080C" />
        <path d="M1460 362 L1460 250 L1530 196 L1600 250 L1600 362 Z M1440 262 L1530 180 L1620 262 Z" fill="#030406" />
        <rect x="1516" y="262" width="26" height="30" fill={`rgba(255,190,110,${((0.3 + 0.6 * houseLit) * flicker(frame, 'marsten', 1)).toFixed(3)})`} />
        <path d="M0 1080 L0 820 Q 400 780 900 860 L 900 1080 Z" fill="#05070A" />
        {/* carretera */}
        <path d="M1920 870 C 1500 850, 1200 820, 900 800" stroke="#1f232c" strokeWidth={40} fill="none" />
        {/* camino a la casa */}
        <path d="M1300 700 C 1360 560, 1420 440, 1500 380" stroke="#10131a" strokeWidth={16} fill="none" />
        {Array.from({ length: 26 }).map((_, i) => {
          const r = (k: string) => random(`town2-${i}-${k}`);
          const x = 40 + i * 32 + r('x') * 10, h = 60 + r('h') * 90, y = 900 - h + r('y') * 30;
          const off = bDes + r('off') * 60;
          const on = frame < off ? 1 : interpolate(frame, [off, off + 4], [1, 0], clamp);
          return (
            <g key={i}>
              <rect x={x} y={y} width={26} height={h + 200} fill="#05070A" />
              <path d={`M${x - 3} ${y} L${x + 13} ${y - 14} L${x + 29} ${y}Z`} fill="#05070A" />
              <rect x={x + 9} y={y + 18} width={8} height={10} fill={`rgba(255,205,130,${(0.85 * on).toFixed(3)})`} />
            </g>
          );
        })}
      </svg>
      {/* cartel del pueblo */}
      <Sign x={1180} y={680} w={260} h={70} t="JERUSALEM'S LOT" bg="#2b4a2e" fg="#efe6d2" size={26} style={{ border: '3px solid #efe6d2' }} />
      <div style={{ position: 'absolute', left: 1305, top: 750, width: 8, height: 70, background: '#3a3a3a' }} />
      {/* coche que llega */}
      {(() => {
        const x = interpolate(car, [0, 1], [2000, 1500]), y = interpolate(car, [0, 1], [866, 846]);
        return (
          <div style={{ position: 'absolute', left: x, top: y }}>
            <div style={{ position: 'absolute', left: 0, top: -50, width: 180, height: 50, borderRadius: '24px 24px 6px 6px', background: '#3a4252', boxShadow: '0 0 0 2px rgba(0,0,0,0.5)' }} />
            <div style={{ position: 'absolute', left: 34, top: -44, width: 90, height: 18, borderRadius: '10px 10px 2px 2px', background: '#141820' }} />
            <div style={{ position: 'absolute', left: -2, top: -24, width: 14, height: 10, borderRadius: 4, background: '#fff6d8', boxShadow: '0 0 18px 6px rgba(255,240,200,0.6)' }} />
            <div style={{ position: 'absolute', left: 170, top: -26, width: 10, height: 10, borderRadius: 3, background: '#ff3b3b', boxShadow: '0 0 12px 4px rgba(255,59,59,0.5)' }} />
            <div style={{ position: 'absolute', left: -380, top: -40, width: 390, height: 60, background: 'linear-gradient(270deg, rgba(255,240,200,0.45), rgba(255,240,200,0))', clipPath: 'polygon(100% 30%, 0 0, 0 100%, 100% 70%)' }} />
          </div>
        );
      })()}
      {/* VENDIDA y el camión de mudanzas */}
      <div style={{ position: 'absolute', left: 1600, top: 300, transform: `scale(${sold.toFixed(3)})`, transformOrigin: '50% 100%' }}>
        <Sign x={0} y={0} w={130} h={52} t="VENDIDA" bg="#C1121F" fg="#fff" size={22} />
        <div style={{ position: 'absolute', left: 60, top: 52, width: 6, height: 40, background: '#3a3a3a' }} />
      </div>
      {(() => {
        const x = interpolate(truck, [0, 1], [1240, 1400]), y = interpolate(truck, [0, 1], [720, 420]);
        return <div style={{ position: 'absolute', left: x, top: y, width: 120 * (1 - 0.4 * truck), height: 64 * (1 - 0.4 * truck), background: '#3a4050', borderRadius: 6, opacity: truck > 0 ? 1 : 0, boxShadow: '-24px 0 40px rgba(255,220,160,0.35)' }} />;
      })()}
      {/* alguien vuelve: una cara pálida en una ventana */}
      <div style={{ position: 'absolute', left: 440, top: 800, width: 50, height: 60, borderRadius: '50% 50% 45% 45%', background: '#cfd6e0', opacity: face * 0.9, boxShadow: `0 0 30px rgba(200,210,230,${(0.6 * face).toFixed(3)})` }}>
        {[14, 30].map((x) => <div key={x} style={{ position: 'absolute', left: x, top: 22, width: 7, height: 7, borderRadius: '50%', background: '#C1121F', boxShadow: '0 0 8px #ff3b3b' }} />)}
      </div>
      {[0, 1].map((i) => <div key={i} style={{ position: 'absolute', left: -500 + ((t * (0.7 + i * 0.4) + i * 800) % 2700), top: 780 + i * 80, width: 1500, height: 220, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(190,200,220,0.14), rgba(0,0,0,0) 70%)', filter: 'blur(14px)' }} />)}
    </Stage>
  );
};

// ———————————————— 2 · Nuestra parte de noche: el control, el coche, el don, la Orden ————————————————
const DEnriquez: D = ({ t0, beats: [bDic, bPad, bDon, bOrd] }) => {
  const frame = useCurrentFrame();
  const t = frame - t0;
  const check = pop(frame, bDic - 6, 13, 150);
  const sweep = Math.sin((frame - bDic) / 22) * 0.5 + 0.5;
  const don = rmp(frame, bDon - 6, bDon + 20);
  const ord = rmp(frame, bOrd - 8, bOrd + 30);
  const eye = rmp(frame, bOrd + 10, bOrd + 50);
  return (
    <Stage bg="linear-gradient(180deg, #07060F 0%, #120E24 50%, #040309 100%)" dust="rgba(200,170,255,0.2)">
      {Array.from({ length: 60 }).map((_, i) => { const r = (k: string) => random(`st2-${i}-${k}`); const sw = don * Math.sin(frame / 40 + i) * 20; return <div key={i} style={{ position: 'absolute', left: r('x') * W + sw, top: r('y') * 420, width: 2, height: 2, borderRadius: 1, background: '#fff', opacity: 0.3 + 0.5 * Math.abs(Math.sin(frame / (20 + r('t') * 30) + i)) }} />; })}
      {/* el ojo en el cielo (la Orden) */}
      <div style={{ position: 'absolute', left: 760, top: 80, width: 400, height: 200, opacity: eye }}>
        <svg width={400} height={200} viewBox="0 0 400 200">
          <path d={`M10 100 Q200 ${100 - 90 * eye} 390 100 Q200 ${100 + 90 * eye} 10 100Z`} fill="rgba(180,140,242,0.10)" stroke="rgba(180,140,242,0.6)" strokeWidth={3} />
          <circle cx="200" cy="100" r={38 * eye} fill="rgba(180,140,242,0.35)" /><circle cx="200" cy="100" r={14 * eye} fill="#07060F" />
        </svg>
      </div>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <path d="M0 640 Q 300 540 620 600 L 900 560 L 900 1080 L 0 1080 Z" fill="#06050b" />
        <path d="M940 520 L980 520 L1500 1080 L420 1080 Z" fill="#0B0A10" />
        {Array.from({ length: 10 }).map((_, i) => { const p = ((i / 10 + t / 260) % 1); const y = 520 + Math.pow(p, 2.2) * 560; const w = 2 + p * 10; const h = 4 + p * 40; return <rect key={i} x={960 - w / 2} y={y} width={w} height={h} fill="rgba(239,232,220,0.5)" />; })}
      </svg>
      {/* la Orden: figuras encapuchadas en círculo con velas */}
      <div style={{ opacity: ord }}>
        <Glow x={400} y={520} r={340} c="rgba(180,140,242,0.5)" />
        <Glow x={400} y={560} r={160} c={`rgba(255,170,90,${(0.55 * flicker(frame, 'fuegoE', 1)).toFixed(3)})`} />
        {Array.from({ length: 7 }).map((_, k) => {
          const a = (k / 7) * Math.PI * 2;
          const x = 400 + Math.cos(a) * 190, y = 560 + Math.sin(a) * 50;
          return <React.Fragment key={k}><Fig kind="hood" x={x} y={y} h={150 + Math.sin(a) * 30} c="#030207" /><Glow x={x + 30} y={y - 40} r={40} c={`rgba(255,200,120,${(0.6 * flicker(frame, `cv${k}`, 1)).toFixed(3)})`} /></React.Fragment>;
        })}
      </div>
      {/* control militar */}
      <div style={{ opacity: Math.min(1, check * 1.4) }}>
        <div style={{ position: 'absolute', left: 1040, top: 650, width: 360, height: 22, background: 'repeating-linear-gradient(90deg, #C1121F 0 40px, #eee 40px 80px)', transform: 'rotate(-4deg)' }} />
        <Fig kind="stand" x={1460} y={720} h={210} c="#05060a" />
        <div style={{ position: 'absolute', left: 1430, top: 508, width: 64, height: 18, borderRadius: '8px 8px 2px 2px', background: '#05060a' }} />
        <div style={{ position: 'absolute', left: 1480, top: 560, width: 700, height: 160, background: `linear-gradient(200deg, rgba(255,250,220,${(0.28 * sweep).toFixed(3)}), rgba(255,250,220,0))`, clipPath: 'polygon(0 40%, 100% 0, 100% 100%, 0 60%)', transform: `rotate(${(160 + 20 * sweep).toFixed(1)}deg)`, transformOrigin: '0 50%' }} />
      </div>
      {/* el coche con padre e hijo */}
      <div style={{ position: 'absolute', left: 960 - 130, top: 760 }}>
        <div style={{ width: 260, height: 110, borderRadius: '40px 40px 12px 12px', background: '#08070C', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 40, top: 14, width: 180, height: 46, borderRadius: '20px 20px 4px 4px', background: `rgba(${Math.round(40 + 140 * don)}, ${Math.round(40 + 100 * don)}, ${Math.round(70 + 172 * don)}, ${(0.6 + 0.3 * don).toFixed(3)})`, overflow: 'hidden' }}>
            <Fig kind="stand" x={60} y={80} h={80} c="#020203" />
            <Fig kind="child" x={135} y={78} h={55} c="#020203" />
          </div>
          {[26, 210].map((x) => <div key={x} style={{ position: 'absolute', left: x, top: 64, width: 30, height: 16, borderRadius: 4, background: '#FF3B3B', boxShadow: '0 0 30px 8px rgba(255,59,59,0.55)' }} />)}
        </div>
        <Glow x={130} y={30} r={200} c={`rgba(180,140,242,${(0.55 * don).toFixed(3)})`} />
      </div>
    </Stage>
  );
};

// ———————————————— 1 · El exorcista: la casa, el desván, la niña, la voz, los médicos ————————————————
const DExorcista: D = ({ t0, beats: [bWas, bRui, bCam, bVoz, bExp] }) => {
  const frame = useCurrentFrame();
  const t = frame - t0;
  const attic = rmp(frame, bRui - 6, bRui + 4) * flicker(frame, 'attic2', 1.4) * (0.55 + 0.45 * Math.abs(Math.sin(t / 9)));
  const shake = (frame > bCam ? Math.sin(frame * 1.7) * 6 * (1 - rmp(frame, bCam + 120, bCam + 160)) : 0) - 46 * rmp(frame, bCam + 6, bCam + 46) * (1 - rmp(frame, bVoz + 60, bVoz + 100));
  const claw = rmp(frame, bCam + 20, bCam + 34);
  const lampF = frame > bCam ? flicker(frame, 'reganL', 2.2) : 1;
  const voz = rmp(frame, bVoz - 4, bVoz + 10);
  const xr = pop(frame, bExp - 8, 13, 150);
  const bolt = Math.max(0, ...[bWas + 40, bVoz].map((b) => interpolate(frame, [b, b + 2, b + 6, b + 8, b + 22], [0, 1, 0.2, 0.8, 0], clamp)));
  return (
    <Stage bg="linear-gradient(180deg, #06080D 0%, #0D1220 70%, #05060A 100%)" dust="rgba(200,215,255,0.15)">
      <AbsoluteFill style={{ background: `rgba(190,210,255,${(0.2 * bolt).toFixed(3)})` }} />
      {/* la casa de Georgetown */}
      <div style={{ position: 'absolute', left: 140, top: 160, width: 640, height: 920, background: 'linear-gradient(180deg, #2A1E1A, #1A120F)' }}>
        <AbsoluteFill style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 2px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 26px), repeating-linear-gradient(90deg, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 2px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 56px)', opacity: 0.8 }} />
        <div style={{ position: 'absolute', left: -30, top: -110, width: 700, height: 120, background: '#0D0A09', clipPath: 'polygon(6% 100%, 50% 0%, 94% 100%)' }} />
        <div style={{ position: 'absolute', left: 270, top: -30, width: 100, height: 90, background: `rgba(160,190,240,${(0.15 + 0.6 * attic).toFixed(3)})`, boxShadow: `0 0 ${(60 * attic).toFixed(0)}px rgba(160,190,240,${(0.7 * attic).toFixed(3)}), inset 0 0 0 8px #0D0A09` }} />
        {['toc', 'toc'].map((tt, k) => {
          const q = pop(frame, bRui + k * 14, 10, 220);
          return frame > bRui + k * 14 ? <div key={k} style={{ position: 'absolute', left: 390 + k * 70, top: -90 + k * 30, fontFamily: font.serif, fontStyle: 'italic', fontSize: 40, color: '#cfe0ff', opacity: q * (1 - rmp(frame, bRui + 60, bRui + 80)), transform: `scale(${q.toFixed(3)}) rotate(${k ? 8 : -8}deg)` }}>{tt}</div> : null;
        })}
        {[0, 1, 2].map((r) => [0, 1].map((cc) => <div key={`${r}${cc}`} style={{ position: 'absolute', left: 110 + cc * 300, top: 120 + r * 230, width: 120, height: 160, background: r === 0 && cc === 1 ? 'rgba(255,214,150,0.16)' : '#080606', boxShadow: 'inset 0 0 0 8px #0D0A09' }} />))}
      </div>
      {/* farola */}
      <div style={{ position: 'absolute', left: 860, top: 380, width: 12, height: 700, background: '#151515' }} />
      <Glow x={866} y={390} r={200} c="rgba(255,214,150,0.25)" />
      <Sign x={756} y={412} w={220} h={44} t="WASHINGTON, D.C." bg="#1d4a2a" fg="#efe6d2" size={19} />
      <Sign x={766} y={466} w={200} h={40} t="GEORGETOWN" bg="#1d4a2a" fg="#efe6d2" size={19} />
      {/* el cuarto de Regan (corte) */}
      <div style={{ position: 'absolute', left: 1020, top: 160, width: 860, height: 700, background: 'linear-gradient(180deg, #1c1f2c, #121420)', boxShadow: 'inset 0 0 0 10px #0a0b10', overflow: 'hidden', transform: `translateX(${(shake * 0.3).toFixed(2)}px)` }}>
        {/* cama */}
        <div style={{ position: 'absolute', left: 140, top: 590, width: 440, height: 26, borderRadius: '50%', background: 'rgba(0,0,0,0.45)', filter: 'blur(6px)' }} />
        <Glow x={640} y={300} r={240} c={`rgba(255,214,150,${(0.22 * lampF).toFixed(3)})`} />
        <svg width={200} height={140} viewBox="0 0 200 140" style={{ position: 'absolute', left: 300, top: 170, opacity: claw }}>{[0, 1, 2, 3].map((k) => <path key={k} d={`M${20 + k * 30} 10 l ${44 * claw} ${112 * claw}`} stroke="rgba(120,30,34,0.85)" strokeWidth={7} fill="none" strokeLinecap="round" />)}</svg>
        <div style={{ position: 'absolute', left: 120, top: 420 + shake, width: 460, height: 140, background: '#e4e0d8', borderRadius: 10 }} />
        <div style={{ position: 'absolute', left: 120, top: 330 + shake, width: 30, height: 260, background: '#3a3026' }} />
        <div style={{ position: 'absolute', left: 170, top: 380 + shake, width: 120, height: 60, borderRadius: 26, background: '#f2efe8' }} />
        <div style={{ position: 'absolute', left: 200, top: 350 + shake, width: 70, height: 70, borderRadius: '50%', background: '#2a221c' }} />
        {/* la voz que no es la suya */}
        {voz > 0 && (
          <svg width={860} height={700} style={{ position: 'absolute', inset: 0, opacity: voz * (1 - 0.7 * xr) }}>
            <path d={Array.from({ length: 90 }).map((_, i) => { const x = 280 + i * 6.4; const a = (random(`vz${i}${Math.floor(frame / 2)}`) - 0.5) * 140 * Math.sin((i / 90) * Math.PI); return `${i ? 'L' : 'M'}${x} ${380 + a}`; }).join(' ')} stroke="#ff3b3b" strokeWidth={4} fill="none" style={{ filter: 'drop-shadow(0 0 10px rgba(255,59,59,0.8))' }} />
          </svg>
        )}
        {/* caja de luz con radiografías */}
        <div style={{ position: 'absolute', left: 560, top: 60, width: 250, height: 220, background: '#dfe9f2', boxShadow: `0 0 ${(40 * xr).toFixed(0)}px rgba(220,235,255,0.6)`, opacity: Math.min(1, xr * 1.4), transform: `scale(${(0.85 + 0.15 * xr).toFixed(3)})` }}>
          {[0, 1].map((k) => (
            <div key={k} style={{ position: 'absolute', left: 14 + k * 118, top: 14, width: 104, height: 140, background: '#141a22', borderRadius: 6 }}>
              <div style={{ position: 'absolute', left: 22, top: 20, width: 60, height: 74, borderRadius: '50% 50% 44% 44%', border: '3px solid rgba(220,235,255,0.7)' }} />
            </div>
          ))}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 160, textAlign: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 48, color: '#C1121F' }}>? ? ?</div>
        </div>
        <div style={{ opacity: xr }}><Fig kind="stand" x={620} y={660} h={320} c="#c9d0d8" /><Fig kind="stand" x={760} y={660} h={300} c="#b4bcc6" />
          {[[620, 394, 42], [760, 411, 39]].map(([x, y, r]) => <div key={x} style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: '#2a221c' }} />)}</div>
      </div>
    </Stage>
  );
};

export const DIORAMAS: Record<number, D> = { 1: DCthulhu, 2: DPoe, 3: DHendrix, 4: DSchweblin, 5: DDracula, 6: DApocalipsis, 7: DCarcoma, 8: DSalem, 9: DEnriquez, 10: DExorcista };
export const _keep = { css, W };
