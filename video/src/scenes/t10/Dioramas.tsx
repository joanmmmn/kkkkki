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
// Polaco (19/10/2026): las palabras son las de la locución X?2 tal como se alinean (grafía del guion si `say` tiene las mismas palabras).
export const BEATS: Record<number, Beat[]> = {
  1: [{ label: 'Papiery zmarłego profesora', word: 'papiery', f: [560, 600, 1.32] }, { label: 'Gliniana płaskorzeźba', word: 'płaskorzeźbę', f: [1040, 690, 1.75] },
    { label: 'Kulty na całym świecie', word: 'kultach', f: [1540, 400, 1.55] }, { label: 'Imię nie do wymówienia', word: 'imię', red: true, f: [1330, 760, 1.7] }],
  2: [{ label: 'Oko starca', word: 'starca', f: [360, 330, 1.75] }, { label: 'Serce pod podłogą', word: 'serca', red: true, f: [900, 860, 1.45] },
    { label: 'Pogrzebana żywcem', word: 'pogrzebana', f: [1460, 420, 1.55] }, { label: 'Czarny kot', word: 'kot', f: [1660, 800, 1.9] }],
  3: [{ label: 'Rodzice nie żyją', word: 'Rodzice', f: [380, 360, 1.75] }, { label: 'Dom na sprzedaż', word: 'sprzedać', f: [620, 690, 1.65] },
    { label: 'Kukiełki', word: 'kukiełki', f: [1060, 420, 1.35] }, { label: 'Lalki', word: 'lalki', f: [1560, 650, 1.65] },
    { label: 'Kukiełka z własnymi planami', word: 'konkretna', red: true, f: [1060, 360, 1.85] }],
  4: [{ label: 'Stara kamienica w Nowym Jorku', word: 'kamienicy', f: [380, 560, 1.4] }, { label: 'Aż nazbyt pomocni sąsiedzi', word: 'sąsiedzi', f: [960, 640, 1.6] },
    { label: 'Rosemary jest w ciąży', word: 'ciążę', f: [1360, 420, 1.8] }, { label: 'Tydzień po tygodniu', word: 'tygodniem', f: [1300, 230, 2.1] },
    { label: 'Czego chcą od jej dziecka?', word: 'czegoś', red: true, f: [1560, 470, 1.5] }],
  5: [{ label: 'Do Transylwanii', word: 'Transylwanii', f: [360, 470, 1.5] }, { label: 'Nigdy nie je', word: 'kolacji', f: [1060, 640, 1.65] },
    { label: 'Bez odbicia', word: 'lustrze', f: [1560, 460, 1.6] }, { label: 'Za dnia – nikogo', word: 'dnia', red: true, f: [1240, 600, 1.25] }],
  6: [{ label: 'Zorza nad Suwalszczyzną', word: 'zorzą', f: [960, 300, 1.25] }, { label: 'Wieś Jodoziory', word: 'Jodoziory', f: [330, 660, 1.75] },
    { label: 'Spopielone zwłoki', word: 'spopielone', f: [1160, 680, 1.9] }, { label: 'Zielone światło', word: 'zielonym', f: [1520, 560, 1.4] },
    { label: 'Kobieta, która parała się czarami', word: 'czarami', red: true, f: [640, 600, 1.7] }],
  7: [{ label: 'Wykładowca po rozwodzie', word: 'Wykładowca', f: [400, 770, 1.7] }, { label: 'Dom na leśnym odludziu', word: 'dom', f: [960, 600, 1.5] },
    { label: 'Poprzedni właściciel nie żyje', word: 'umarł', f: [1060, 770, 2] }, { label: 'Dziwny sąsiad', word: 'sąsiad', f: [1600, 720, 1.6] },
    { label: 'Dopiero początek koszmaru', word: 'koszmaru', red: true, f: [960, 420, 1.2] }],
  8: [{ label: 'Wraca do miasteczka', word: 'wraca', f: [1340, 760, 1.6] }, { label: 'Dom na wzgórzu', word: 'domu', f: [1530, 300, 1.8] },
    { label: 'Nowi przybysze', word: 'przybysze', f: [1440, 380, 1.6] }, { label: 'Znikają… albo wracają', word: 'znikać', red: true, f: [460, 840, 1.75] }],
  9: [{ label: 'Guz na karku', word: 'karku', f: [420, 520, 1.6] }, { label: 'Prześwietlenie', word: 'Prześwietlenie', f: [900, 360, 1.7] },
    { label: 'Lekarze bez odpowiedzi', word: 'lekarze', f: [900, 640, 1.35] }, { label: 'W środku rozwija się płód', word: 'płód', red: true, f: [930, 360, 2.1] },
    { label: 'Wróżbita', word: 'wróżbity', f: [1600, 620, 1.6] }],
  10: [{ label: 'Coś jest na zewnątrz', word: 'zewnątrz', f: [380, 400, 1.6] }, { label: 'Jedno spojrzenie', word: 'spojrzenie', red: true, f: [380, 400, 2] },
    { label: 'Rzeką przez 30 km', word: 'rzeką', f: [1300, 640, 1.35] }, { label: 'Z opaskami na oczach', word: 'opaskami', f: [1260, 640, 2.2] },
    { label: 'Tylko słuch', word: 'słuch', f: [1340, 580, 1.6] }],
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
    fontFamily: font.sans, fontWeight: 700, fontSize: size, letterSpacing: 1, whiteSpace: 'pre-line', boxShadow: '0 10px 24px rgba(0,0,0,0.5)', borderRadius: 4, ...style }}>{t}</div>
);
const Moon: React.FC<{ x: number; y: number; r: number; c?: string }> = ({ x, y, r, c = '#E6EEF8' }) => (
  <>
    <Glow x={x} y={y} r={r * 3.2} c="rgba(200,215,240,0.22)" />
    <div style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: c, boxShadow: `0 0 ${r}px rgba(220,235,255,0.6)` }} />
  </>
);

// ———————————————— 10 · Zew Cthulhu: el despacho del profesor ————————————————
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
        { x: 1240, y: 520, t: 'Rytuał na bagnach Luizjany', rot: -4 },
        { x: 1530, y: 540, t: 'Dziwny kult na Grenlandii', rot: 3 },
        { x: 1700, y: 360, t: 'Statek dryfujący po Pacyfiku', rot: -2 },
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
          opacity: interpolate(m, [0, 3, 26, 40], [0, 1, 0.8, 0], clamp), transform: `scale(${(0.8 + 0.25 * interpolate(m, [0, 6], [0, 1], clamp)).toFixed(3)})`, textShadow: '0 0 20px rgba(255,60,60,0.8)' }}>tuk…</div>
      ))}
      {/* el gato negro */}
      <Glow x={1660} y={820} r={260} c="rgba(255,200,120,0.12)" />
      <div style={{ opacity: Math.min(1, cat * 1.4) }}><Cat x={1660} y={900} s={1.3} eyes={rmp(frame, bGato, bGato + 8)} arch={cat} /></div>
    </Stage>
  );
};

// ———————————————— 8 · Jak sprzedać nawiedzony dom: la casa de los padres ————————————————
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
      {/* cartel NA SPRZEDAŻ */}
      <div style={{ position: 'absolute', left: 520, top: 600, opacity: Math.min(1, sign * 1.4), transform: `translateY(${((1 - sign) * 80).toFixed(1)}px) rotate(${(-6 + 4 * (1 - sign)).toFixed(2)}deg)`, transformOrigin: '50% 100%' }}>
        <div style={{ position: 'absolute', left: 110, top: 160, width: 14, height: 140, background: '#4a3020' }} />
        <Sign x={0} y={0} w={240} h={170} t={'NA\nSPRZEDAŻ'} bg="#E8E0CE" fg="#9b2c1c" size={40} style={{ border: '6px solid #9b2c1c', lineHeight: 1.05 }} />
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

// ———————————————— 6 · Drakula: el viaje, la cena, el espejo y el amanecer ————————————————
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

// ———————————————— 3 · Miasteczko Salem: el regreso, la casa, los recién llegados ————————————————
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
      {/* SPRZEDANY y el camión de mudanzas */}
      <div style={{ position: 'absolute', left: 1600, top: 300, transform: `scale(${sold.toFixed(3)})`, transformOrigin: '50% 100%' }}>
        <Sign x={-10} y={0} w={150} h={52} t="SPRZEDANY" bg="#C1121F" fg="#fff" size={21} />
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

// ———————————————— 7 · Dziecko Rosemary: la kamienica, los vecinos, la cuna (nueva, PL) ————————————————
// Silueta de perfil de una mujer embarazada (mira a la derecha); 110 × 200 de referencia, (x, y) = pies.
const Pregnant: React.FC<{ x: number; y: number; h: number; c?: string; glow?: number }> = ({ x, y, h, c = '#0a0608', glow = 0 }) => {
  const s = h / 200;
  return (
    <svg width={110 * s} height={200 * s} viewBox="0 0 110 200" style={{ position: 'absolute', left: x - 55 * s, top: y - 200 * s, overflow: 'visible' }}>
      {glow > 0 && <circle cx="72" cy="98" r="30" fill={`rgba(255,196,160,${(0.55 * glow).toFixed(3)})`} style={{ filter: 'blur(9px)' }} />}
      <path d="M50 3a14 14 0 1 1 0 28a14 14 0 1 1 0-28zM37 35q14-5 27 1l3 26q20 10 22 34q1 24-20 31l6 70h-12l-6-56h-6l-4 56h-12l3-70q-8-30-2-62z" fill={c} />
      <path d="M58 64q14 10 22 30" stroke={c} strokeWidth={7} strokeLinecap="round" fill="none" />
    </svg>
  );
};
const DRosemary: D = ({ t0, beats: [bKam, bSas, bCia, bTyg, bCze] }) => {
  const frame = useCurrentFrame();
  const t = frame - t0;
  const wave = (k: number) => rmp(frame, bKam - 12 + k * 2, bKam - 4 + k * 2);
  const door = rmp(frame, bSas - 12, bSas + 10, easeOut);
  const pair = pop(frame, bSas - 4, 13, 150);
  const ros = rmp(frame, bCia - 10, bCia + 12);
  const belly = rmp(frame, bCia, bCia + 20) * (0.75 + 0.25 * Math.sin(frame / 9));
  const weeks = interpolate(frame, [bTyg - 6, bTyg + 80], [0, 9], clamp);
  const red = rmp(frame, bCze - 4, bCze + 18);
  const spin = t / 46 + Math.max(0, frame - bCze) * Math.max(0, frame - bCze) / 900;
  const page = Math.floor(weeks / 5);
  return (
    <Stage bg="#0c0a0e" dust="rgba(255,220,190,0.22)">
      {/* fuera: la vieja kamienica de Nueva York */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 700, height: 1080, background: 'linear-gradient(180deg, #0b0d18 0%, #171b2c 66%, #07080c 100%)', overflow: 'hidden' }}>
        <Moon x={120} y={110} r={36} />
        <svg width={700} height={1080} viewBox="0 0 700 1080" style={{ position: 'absolute', inset: 0 }}>
          <path d="M90 1080 V300 H140 V240 L190 186 L240 240 V300 H300 V214 L355 150 L410 214 V300 H470 V240 L520 186 L570 240 V300 H620 V1080 Z" fill="#05060a" />
          {[[140, 240], [240, 240], [470, 240], [570, 240]].map(([x, y], k) => <path key={k} d={`M${x - 14} ${y} l14 -22 l14 22z`} fill="#05060a" />)}
          <path d="M330 1080 V1012 a25 25 0 0 1 50 0 V1080z" fill={`rgba(255,200,130,${(0.25 + 0.5 * wave(12)).toFixed(3)})`} />
        </svg>
        {Array.from({ length: 24 }).map((_, k) => {
          const c = k % 4, r = Math.floor(k / 4);
          const on = random(`rw${k}`) < 0.55 || k === 9 ? wave(r * 2 + c) : (k % 7 === 0 ? 1 : 0);
          return <div key={k} style={{ position: 'absolute', left: 145 + c * 120, top: 330 + r * 112, width: 60, height: 80, borderRadius: '30px 30px 0 0',
            background: on > 0.01 ? `rgba(255,${190 + Math.round(30 * random(`rc${k}`))},120,${(0.85 * on * flicker(frame, `rw${k}`, 0.5)).toFixed(3)})` : '#0d0f17', boxShadow: on > 0.5 ? '0 0 18px rgba(255,200,120,0.35)' : undefined }} />;
        })}
        <div style={{ position: 'absolute', left: 660, top: 760, width: 8, height: 320, background: '#121218' }} />
        <Glow x={664} y={760} r={120} c="rgba(255,214,150,0.25)" />
      </div>
      <div style={{ position: 'absolute', left: 700, top: 0, width: 18, height: 1080, background: '#050405' }} />
      {/* el rellano: la puerta y los vecinos */}
      <div style={{ position: 'absolute', left: 718, top: 0, width: 462, height: 1080, background: 'linear-gradient(180deg, #23160f, #170e0a)', overflow: 'hidden' }}>
        <AbsoluteFill style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.25) 0 3px, transparent 3px 66px)' }} />
        <Glow x={232} y={110} r={260} c="rgba(255,214,150,0.22)" />
        <div style={{ position: 'absolute', left: 112, top: 360, width: 240, height: 560, background: `rgba(240,214,170,${(0.9 * door).toFixed(3)})`, boxShadow: 'inset 0 0 0 10px #120a06' }}>
          <Glow x={120} y={140} r={260} c={`rgba(255,226,180,${(0.6 * door).toFixed(3)})`} />
          {/* el resto de la «familia» aparece detrás cuando la voz dice que quieren algo */}
          {[0, 1, 2, 3].map((k) => <Fig key={k} kind={k % 2 ? 'bun' : 'old'} x={30 + k * 60} y={560} h={300 + (k % 2) * 30} c={`rgba(40,26,16,${(0.75 * red).toFixed(3)})`} />)}
          <div style={{ opacity: Math.min(1, pair * 1.3), transform: `translateY(${((1 - pair) * 40).toFixed(1)}px)` }}>
            <Fig kind="old" x={70} y={562} h={430} c="#1c130c" />
            <Fig kind="bun" x={176} y={562} h={390} c="#24170e" />
            {[[58, 260], [176, 300]].map(([x, y], k) => <React.Fragment key={k}>{[0, 10].map((dx) => <div key={dx} style={{ position: 'absolute', left: x + dx - 4, top: y, width: 5, height: 5, borderRadius: '50%', background: '#ff3b3b', opacity: red, boxShadow: '0 0 8px #ff3b3b' }} />)}</React.Fragment>)}
            {/* la bandeja: tarta y un vaso de algo verde */}
            <div style={{ position: 'absolute', left: 60, top: 380, width: 140, height: 12, borderRadius: 6, background: '#b9a27a' }} />
            <div style={{ position: 'absolute', left: 78, top: 346, width: 56, height: 34, borderRadius: '28px 28px 4px 4px', background: '#e6a4b0' }} />
            <div style={{ position: 'absolute', left: 152, top: 340, width: 24, height: 40, borderRadius: 4, background: 'rgba(120,200,110,0.85)' }} />
            {[0, 1, 2].map((k) => <div key={k} style={{ position: 'absolute', left: 92 + k * 12, top: 300 - ((t * 0.8 + k * 14) % 40), width: 3, height: 18, borderRadius: 2, background: 'rgba(255,255,255,0.35)', opacity: pair }} />)}
          </div>
        </div>
        {/* la hoja de la puerta, con su mirilla */}
        <div style={{ position: 'absolute', left: 112, top: 360, width: 240, height: 560, transformOrigin: '0 50%', transform: `perspective(900px) rotateY(${(-74 * door).toFixed(1)}deg)`, background: 'linear-gradient(90deg, #3a2416, #2a190f)', boxShadow: 'inset 0 0 0 10px #1a0f08' }}>
          {[[30, 40], [30, 300]].map(([x, y], k) => <div key={k} style={{ position: 'absolute', left: x, top: y, width: 180, height: 220, boxShadow: 'inset 0 0 0 6px rgba(0,0,0,0.3)' }} />)}
          <div style={{ position: 'absolute', left: 108, top: 190, width: 24, height: 24, borderRadius: '50%', background: '#c9a24a', boxShadow: 'inset 0 0 0 7px #1a0f08' }} />
          <div style={{ position: 'absolute', left: 196, top: 300, width: 18, height: 18, borderRadius: '50%', background: '#c9a24a' }} />
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 920, bottom: 0, background: '#0f0906' }} />
      </div>
      {/* el cuarto del bebé */}
      <div style={{ position: 'absolute', left: 1180, top: 0, width: 740, height: 640, background: 'linear-gradient(180deg, #2b1d24, #1d141a)', overflow: 'hidden' }}>
        <AbsoluteFill style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,210,220,0.05) 0 18px, transparent 18px 54px)' }} />
        <div style={{ position: 'absolute', left: 520, top: 90, width: 160, height: 240, background: 'linear-gradient(180deg, #1c2640, #0e1424)', boxShadow: 'inset 0 0 0 10px #1a1014' }}>
          <div style={{ position: 'absolute', left: 74, top: 0, width: 10, height: 240, background: '#1a1014' }} />
          <div style={{ position: 'absolute', left: 96, top: 40, width: 36, height: 36, borderRadius: '50%', background: '#E6EEF8', boxShadow: '0 0 30px rgba(220,235,255,0.8)' }} />
        </div>
        {/* el calendario: una semana tachada tras otra */}
        <div style={{ position: 'absolute', left: 50, top: 110, width: 150, height: 180, background: '#E9E2D2', boxShadow: '0 10px 24px rgba(0,0,0,0.5)', transform: 'rotate(-2deg)' }}>
          <div style={{ height: 30, background: '#7a2a34' }} />
          {Array.from({ length: 5 }).map((_, r) => {
            const done = Math.max(0, Math.min(1, weeks - page * 5 - r));
            return (
              <div key={`${page}-${r}`} style={{ position: 'relative', display: 'flex', gap: 4, padding: '6px 8px 0' }}>
                {Array.from({ length: 7 }).map((__, d) => <div key={d} style={{ width: 16, height: 18, background: 'rgba(60,40,30,0.18)' }} />)}
                <div style={{ position: 'absolute', left: 6, top: 14, width: `${(132 * done).toFixed(1)}px`, height: 4, background: '#C1121F', transform: 'rotate(-3deg)' }} />
              </div>
            );
          })}
        </div>
        <Glow x={420} y={480} r={280} c={`rgba(193,18,31,${(0.45 * red).toFixed(3)})`} />
        {/* la cuna vacía y el móvil */}
        <div style={{ position: 'absolute', left: 420, top: 0, width: 2, height: 250, background: 'rgba(239,232,220,0.45)' }} />
        <div style={{ position: 'absolute', left: 340, top: 250, width: 160, height: 4, background: '#cdb89a', transform: `scaleX(${Math.cos(spin).toFixed(3)})` }}>
          {[0, 1].map((k) => <div key={k} style={{ position: 'absolute', left: k ? 150 : 0, top: 4, width: 2, height: 46, background: 'rgba(239,232,220,0.45)' }}>
            <div style={{ position: 'absolute', left: -12, top: 46, width: 26, height: 26, borderRadius: k ? '50%' : 4, background: k ? '#e6c46a' : '#9fc3d8' }} /></div>)}
        </div>
        <div style={{ position: 'absolute', left: 270, top: 400, width: 300, height: 180 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 300, height: 14, background: '#3a2418' }} />
          <div style={{ position: 'absolute', left: 0, top: 120, width: 300, height: 14, background: '#3a2418' }} />
          <div style={{ position: 'absolute', left: 14, top: 96, width: 272, height: 26, borderRadius: 8, background: '#e9e4dc' }} />
          {Array.from({ length: 13 }).map((_, k) => <div key={k} style={{ position: 'absolute', left: 6 + k * 23, top: 10, width: 7, height: 112, background: '#3a2418' }} />)}
          {[0, 290].map((x) => <div key={x} style={{ position: 'absolute', left: x, top: 0, width: 12, height: 180, background: '#2c1a10' }} />)}
        </div>
        {/* sombras de manos que se acercan a la cuna */}
        {red > 0 && [0, 1, 2, 3, 4].map((k) => {
          const q = rmp(frame, bCze + k * 5, bCze + 50 + k * 5, easeOut);
          return (
            <svg key={k} width={260} height={120} viewBox="0 0 260 120" style={{ position: 'absolute', left: 760 - 330 * q - (k % 2) * 40, top: 160 + k * 70, opacity: 0.8 * red, transform: `rotate(${(k - 2) * 8}deg)` }}>
              <path d="M260 60 L120 52 Q90 48 70 40 L10 30 Q4 34 10 38 L66 50 L8 58 Q2 63 8 66 L68 64 L12 80 Q6 85 13 88 L74 76 L30 100 Q26 106 33 107 L96 84 Q120 78 150 74 L260 70Z" fill="#040203" />
            </svg>
          );
        })}
        {/* Rosemary */}
        <div style={{ opacity: ros }}><Pregnant x={150} y={600} h={360} c="#0b0709" glow={belly} /></div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 600, height: 40, background: '#130c10' }} />
      </div>
      {/* el piso de abajo: cajas de la mudanza */}
      <div style={{ position: 'absolute', left: 1180, top: 640, width: 740, height: 440, background: 'linear-gradient(180deg, #1a1210, #0e0907)' }}>
        {[[90, 230, 170, 120], [270, 260, 150, 90], [130, 130, 130, 100], [520, 250, 160, 100]].map(([x, y, w, h], k) => (
          <div key={k} style={{ position: 'absolute', left: x, top: y, width: w, height: h, background: '#6b4f33', boxShadow: 'inset 0 0 0 3px rgba(0,0,0,0.25)' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: h * 0.45, height: 10, background: 'rgba(200,180,140,0.5)' }} />
          </div>
        ))}
      </div>
    </Stage>
  );
};

// ———————————————— 5 · Inkub: la zorza, Jodoziory, la casa calcinada, la luz verde y la vieja foto (nueva, PL) ————————————————
const DInkub: D = ({ t0, beats: [bZor, bJod, bSpo, bZie, bCza] }) => {
  const frame = useCurrentFrame();
  const t = frame - t0;
  const aur = 0.3 + 0.7 * rmp(frame, bZor - 12, bZor + 30);
  const sign = pop(frame, bJod - 6, 12, 170);
  const burn = rmp(frame, bSpo - 6, bSpo + 10);
  const ash = rmp(frame, bSpo + 6, bSpo + 40);
  const tape = rmp(frame, bSpo + 14, bSpo + 34, easeOut);
  const green = rmp(frame, bZie - 6, bZie + 16);
  const pulse = 0.7 + 0.3 * Math.sin(frame / 6);
  const photo = pop(frame, bCza - 8, 10, 120);
  const witch = rmp(frame, bCza + 8, bCza + 24);
  const ribbon = (k: number) => {
    const pts = Array.from({ length: 30 }).map((_, i) => { const x = -120 + i * 74; return `${i ? 'L' : 'M'}${x} ${(150 + k * 70 + Math.sin(x / 240 + t / 70 + k * 1.7) * 60).toFixed(1)}`; }).join(' ');
    return pts;
  };
  return (
    <Stage bg="linear-gradient(180deg, #040810 0%, #0a1620 55%, #0b1814 72%, #040605 100%)" dust="rgba(180,255,210,0.18)">
      {Array.from({ length: 70 }).map((_, i) => { const r = (k: string) => random(`ist-${i}-${k}`); return <div key={i} style={{ position: 'absolute', left: r('x') * W, top: r('y') * 520, width: 2, height: 2, borderRadius: 1, background: '#fff', opacity: 0.25 + 0.45 * Math.abs(Math.sin(frame / (18 + r('t') * 30) + i)) }} />; })}
      {/* la zorza */}
      <svg width={W} height={700} viewBox={`0 0 ${W} 700`} style={{ position: 'absolute', left: 0, top: 0, mixBlendMode: 'screen' }}>
        <defs>
          <linearGradient id="aurG" x1="0" y1="0" x2="0" y2="700" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#b48cf2" stopOpacity="0.55" /><stop offset="0.35" stopColor="#5BE3A0" stopOpacity="0.9" /><stop offset="0.8" stopColor="#2fbf7a" stopOpacity="0.15" /></linearGradient>
          <filter id="aurB"><feGaussianBlur stdDeviation="16" /></filter>
        </defs>
        {[0, 1, 2].map((k) => <path key={k} d={ribbon(k)} stroke="url(#aurG)" strokeWidth={120 - k * 25} fill="none" filter="url(#aurB)" opacity={aur * (0.55 + 0.35 * Math.sin(t / 40 + k * 2))} />)}
        {[0, 1].map((k) => <path key={`c${k}`} d={ribbon(k)} stroke="#9dffcf" strokeWidth={3} fill="none" opacity={0.35 * aur} />)}
        {/* cortinas: rayos verticales que cuelgan de cada cinta */}
        <defs><linearGradient id="curG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7dffc0" stopOpacity="0.8" /><stop offset="1" stopColor="#2fbf7a" stopOpacity="0" /></linearGradient></defs>
        {[0, 1].map((k) => Array.from({ length: 150 }).map((_, i) => {
          const x = -40 + i * 14;
          const y = 150 + k * 70 + Math.sin(x / 240 + t / 70 + k * 1.7) * 60;
          const h = 90 + 80 * Math.abs(Math.sin(i * 0.7 + t / 30 + k));
          return <rect key={`r${k}-${i}`} x={x} y={y - 10} width={6} height={h} fill="url(#curG)" opacity={aur * (0.25 + 0.2 * Math.sin(i * 1.3 + t / 20))} />;
        }))}
      </svg>
      {/* el bosque */}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0 }}>
        {Array.from({ length: 46 }).map((_, i) => { const r = (k: string) => random(`isp-${i}-${k}`); const x = i * 44 + r('x') * 30 - 20; const h = 110 + r('h') * 170; return <path key={i} d={`M${x} 700 L${x + 26} ${700 - h} L${x + 52} 700Z`} fill="#030605" />; })}
        <rect x="0" y="698" width={W} height="382" fill="#050807" />
      </svg>
      {/* casas de la aldea */}
      {[[440, 600, 150], [620, 620, 120]].map(([x, y, w], k) => (
        <div key={k} style={{ position: 'absolute', left: x, top: y, width: w, height: 110, background: '#0c0a08' }}>
          <div style={{ position: 'absolute', left: -10, top: -50, width: w + 20, height: 52, background: '#080605', clipPath: 'polygon(0 100%, 50% 0, 100% 100%)' }} />
          <div style={{ position: 'absolute', left: w * 0.35, top: 34, width: 26, height: 30, background: `rgba(255,200,120,${(0.55 * flicker(frame, `ih${k}`, 0.6)).toFixed(3)})` }} />
        </div>
      ))}
      {/* la casa del matrimonio */}
      <div style={{ position: 'absolute', left: 960, top: 520, width: 400, height: 300, background: 'linear-gradient(180deg, #20160f, #140d08)' }}>
        <AbsoluteFill style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0 3px, transparent 3px 30px)' }} />
        <div style={{ position: 'absolute', left: -30, top: -130, width: 460, height: 132, background: '#0d0805', clipPath: 'polygon(0 100%, 50% 0, 100% 100%)' }} />
        <div style={{ position: 'absolute', left: 40, top: 60, width: 280, height: 170, background: '#120d0a', boxShadow: 'inset 0 0 0 10px #2a1b10', overflow: 'hidden' }}>
          <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 100%, rgba(255,120,50,${(0.95 * burn * (1 - 0.55 * ash)).toFixed(3)}) 0%, rgba(255,90,40,${(0.35 * burn).toFixed(3)}) 45%, rgba(0,0,0,0) 80%)` }} />
          <div style={{ position: 'absolute', left: 10, right: 10, top: 118, height: 40, background: '#2a1d14' }} />
          {/* lo que queda: dos siluetas de ceniza tumbadas, con hollín alrededor (sin nada explícito) */}
          {[0, 1].map((k) => (
            <div key={k} style={{ position: 'absolute', left: 20 + k * 126, top: 104 - k * 4, width: 120, height: 40, opacity: ash }}>
              <div style={{ position: 'absolute', inset: -10, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,0,0,0.75), rgba(0,0,0,0) 70%)' }} />
              <svg width={120} height={40} viewBox="0 0 130 40" style={{ position: 'absolute', inset: 0, filter: 'blur(0.8px)' }}>
                <path d="M6 20a10 10 0 1 1 20 0a10 10 0 1 1-20 0zM28 12q30-4 60 2l34 3v8l-34 3q-30 6-60 2z" fill="#9a928a" />
              </svg>
            </div>
          ))}
          <AbsoluteFill style={{ background: `rgba(91,227,160,${(0.3 * green * pulse).toFixed(3)})`, mixBlendMode: 'screen' }} />
          {Array.from({ length: 12 }).map((_, k) => { const r = (q: string) => random(`emb${k}${q}`); const m = ((t * (0.8 + r('v')) + r('o') * 120) % 120); return <div key={k} style={{ position: 'absolute', left: 20 + r('x') * 200, top: 150 - m * 1.4, width: 4, height: 4, borderRadius: 2, background: '#ffb060', opacity: burn * (1 - m / 120) * (1 - 0.5 * ash) }} />; })}
        </div>
        <div style={{ position: 'absolute', left: 320, top: 150, width: 56, height: 150, background: '#0a0605' }} />
      </div>
      {/* cinta policial */}
      <div style={{ position: 'absolute', left: 930, top: 760, width: 470 * tape, height: 22, background: 'repeating-linear-gradient(135deg, #f2c94c 0 22px, #111 22px 44px)', transform: 'rotate(-5deg)', transformOrigin: '0 50%', boxShadow: '0 6px 14px rgba(0,0,0,0.5)' }} />
      {/* la luz verde entre los árboles */}
      <Glow x={1580} y={560} r={360} c={`rgba(91,227,160,${(0.42 * green * pulse).toFixed(3)})`} />
      <div style={{ position: 'absolute', left: 1580 - 26, top: 560 - 26, width: 52, height: 52, borderRadius: '50%', background: '#d8ffe9', boxShadow: `0 0 ${(60 * green).toFixed(0)}px 20px rgba(91,227,160,${(0.8 * green).toFixed(3)})`, opacity: green, transform: `scale(${(0.8 + 0.25 * pulse).toFixed(3)})` }} />
      {[1460, 1520, 1650, 1720].map((x, k) => <div key={x} style={{ position: 'absolute', left: x, top: 380 + (k % 2) * 30, width: 22, height: 700, background: '#020403' }} />)}
      {/* el cartel de la aldea */}
      <div style={{ position: 'absolute', left: 150, top: 580, opacity: Math.min(1, sign * 1.4), transform: `translateY(${((1 - sign) * 60).toFixed(1)}px) rotate(${(-3 + 3 * (1 - sign)).toFixed(2)}deg)`, transformOrigin: '50% 100%' }}>
        <div style={{ position: 'absolute', left: 60, top: 80, width: 12, height: 220, background: '#5a5f66' }} />
        <div style={{ position: 'absolute', left: 250, top: 80, width: 12, height: 220, background: '#5a5f66' }} />
        <Sign x={0} y={0} w={320} h={90} t="JODOZIORY" bg="#F2F2EE" fg="#111" size={44} style={{ border: '5px solid #111', borderRadius: 2 }} />
      </div>
      {/* el tronco y la vieja foto */}
      <div style={{ position: 'absolute', left: 600, top: 470, width: 40, height: 610, background: 'linear-gradient(90deg, #0b0806, #1c140d 60%, #090705)', clipPath: 'polygon(0 4%, 50% 0, 100% 4%, 100% 100%, 0 100%)' }} />
      <div style={{ position: 'absolute', left: 530, top: 500, width: 180, height: 220, padding: 12, background: '#e9dfc8', boxShadow: '0 16px 30px rgba(0,0,0,0.7)', opacity: Math.min(1, photo * 1.5),
        transformOrigin: '50% 6px', transform: `rotate(${(-6 - 40 * (1 - photo)).toFixed(2)}deg)` }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 35%, #b49c74, #6a5638)', overflow: 'hidden', filter: 'sepia(0.7)' }}>
          <Fig kind="woman" x={78} y={230} h={200} c="#3a2a1a" />
          <div style={{ position: 'absolute', left: 50, top: 20, width: 56, height: 46, background: '#4a3624', clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }} />
          {[70, 86].map((x) => <div key={x} style={{ position: 'absolute', left: x, top: 54, width: 5, height: 5, borderRadius: '50%', background: '#ff3b3b', opacity: witch, boxShadow: '0 0 10px 2px rgba(255,59,59,0.8)' }} />)}
        </div>
        <div style={{ position: 'absolute', left: 84, top: -6, width: 12, height: 12, borderRadius: '50%', background: '#888' }} />
      </div>
      {/* hierbas secas colgadas */}
      <div style={{ position: 'absolute', left: 716, top: 486, opacity: photo }}>
        <div style={{ width: 2, height: 60, background: '#6b5a3a', marginLeft: 20 }} />
        {[0, 1, 2, 3, 4].map((k) => <div key={k} style={{ position: 'absolute', left: 8 + k * 6, top: 56, width: 4, height: 70 + (k % 2) * 16, background: '#5a6b3a', transform: `rotate(${(k - 2) * 6}deg)`, transformOrigin: '50% 0' }} />)}
      </div>
    </Stage>
  );
};

// ———————————————— 4 · Dom na Wyrębach: el profesor, la casa del bosque, el znicz y el vecino (nueva, PL) ————————————————
const DDarda: D = ({ t0, beats: [bWyk, bDom, bUma, bSas, bKos] }) => {
  const frame = useCurrentFrame();
  const t = frame - t0;
  const man = pop(frame, bWyk - 6, 13, 150);
  const split = rmp(frame, bWyk + 4, bWyk + 30, easeOut);
  const fall = rmp(frame, bWyk + 34, bWyk + 70, (x) => x * x);
  const rim = 'drop-shadow(0 0 2px rgba(215,228,255,0.6)) drop-shadow(0 0 12px rgba(170,195,255,0.28))';
  const house = rmp(frame, bDom - 6, bDom + 10);
  const sign = pop(frame, bDom + 2, 11, 180);
  const grave = pop(frame, bUma - 6, 12, 160);
  const nb = pop(frame, bSas - 6, 13, 150);
  const lantern = rmp(frame, bSas - 2, bSas + 8) * flicker(frame, 'lant', 0.8);
  const red = rmp(frame, bKos - 4, bKos + 20);
  const mist = rmp(frame, bKos - 10, bKos + 60);
  return (
    <Stage bg="linear-gradient(180deg, #0a0d12 0%, #141b14 55%, #070906 100%)" dust="rgba(220,240,200,0.18)">
      <Moon x={1500} y={140} r={50} c="#E9EDE2" />
      {/* bosque */}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0 }}>
        {Array.from({ length: 34 }).map((_, i) => { const r = (k: string) => random(`dsp-${i}-${k}`); const x = i * 60 + r('x') * 30 - 30; const h = 300 + r('h') * 330; return <path key={i} d={`M${x} 790 L${x + 34} ${790 - h} L${x + 68} 790Z`} fill={i % 3 ? '#050805' : '#080c08'} />; })}
        <rect x="0" y="780" width={W} height="300" fill="#0a0d08" />
        <path d="M0 1000 C 300 940, 500 900, 820 860" stroke="#151a12" strokeWidth={70} fill="none" />
      </svg>
      {/* ojos entre los árboles */}
      {Array.from({ length: 16 }).map((_, k) => {
        const r = (q: string) => random(`dey${k}${q}`);
        const o = rmp(frame, bKos + r('d') * 30, bKos + 6 + r('d') * 30) * (Math.floor((frame + r('b') * 90) / 6) % 15 === 0 ? 0.1 : 1);
        const x = 80 + r('x') * 1760, y = 330 + r('y') * 360;
        return <React.Fragment key={k}>{[0, 16].map((dx) => <div key={dx} style={{ position: 'absolute', left: x + dx, top: y, width: 7, height: 4, borderRadius: '50%', background: k % 3 ? '#ff4a3a' : '#ffcf5a', opacity: o * red, boxShadow: '0 0 10px 2px rgba(255,80,60,0.7)' }} />)}</React.Fragment>;
      })}
      {/* kapliczka al borde del camino */}
      <div style={{ position: 'absolute', left: 620, top: 600, width: 14, height: 200, background: '#1c140c' }} />
      <div style={{ position: 'absolute', left: 596, top: 560, width: 62, height: 56, background: '#20170e', clipPath: 'polygon(50% 0, 100% 40%, 100% 100%, 0 100%, 0 40%)' }} />
      <Glow x={627} y={596} r={50} c={`rgba(255,190,110,${(0.3 + 0.4 * red).toFixed(3)})`} />
      {/* la casa del bosque */}
      <div style={{ position: 'absolute', left: 760, top: 520, width: 420, height: 290, background: 'linear-gradient(180deg, #2a1d12, #1a120a)', boxShadow: '0 0 0 2px rgba(0,0,0,0.5)' }}>
        <AbsoluteFill style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0 3px, transparent 3px 26px)' }} />
        <div style={{ position: 'absolute', left: -40, top: -150, width: 500, height: 152, background: '#0e0a06', clipPath: 'polygon(0 100%, 50% 0, 100% 100%)' }} />
        {[[50, 80], [290, 80]].map(([x, y], k) => <div key={k} style={{ position: 'absolute', left: x, top: y, width: 90, height: 100, background: `rgba(255,205,130,${(0.08 + 0.5 * house * flicker(frame, `dw${k}`, 0.7)).toFixed(3)})`, boxShadow: 'inset 0 0 0 8px #120c07' }} />)}
        <div style={{ position: 'absolute', left: 170, top: 110, width: 80, height: 180, background: '#0a0705', transformOrigin: '0 50%', transform: `perspective(500px) rotateY(${(-40 * rmp(frame, bUma + 10, bUma + 60)).toFixed(1)}deg)`, boxShadow: 'inset 0 0 0 5px #1e140b' }} />
      </div>
      {/* SPRZEDAM en la valla */}
      <div style={{ position: 'absolute', left: 1180, top: 700, width: 220, height: 12, background: '#2a2016' }} />
      {[1190, 1290, 1390].map((x) => <div key={x} style={{ position: 'absolute', left: x, top: 680, width: 12, height: 130, background: '#2a2016' }} />)}
      <div style={{ position: 'absolute', left: 1200, top: 640, opacity: Math.min(1, sign * 1.4), transform: `rotate(${(4 + 8 * (1 - sign)).toFixed(2)}deg) scale(${(0.6 + 0.4 * sign).toFixed(3)})` }}>
        <Sign x={0} y={0} w={190} h={64} t="SPRZEDAM" bg="#EFE8DA" fg="#9b2c1c" size={32} style={{ border: '4px solid #9b2c1c' }} />
      </div>
      {/* el znicz y la cruz del dueño anterior */}
      <div style={{ position: 'absolute', left: 1010, top: 740, opacity: Math.min(1, grave * 1.4), transform: `translateY(${((1 - grave) * 30).toFixed(1)}px)` }}>
        <div style={{ position: 'absolute', left: 46, top: -20, width: 10, height: 110, background: '#3a2a1c' }} />
        <div style={{ position: 'absolute', left: 22, top: 4, width: 58, height: 10, background: '#3a2a1c' }} />
        <Glow x={18} y={66} r={70} c={`rgba(255,80,60,${(0.45 * flicker(frame, 'znicz', 1)).toFixed(3)})`} />
        <div style={{ position: 'absolute', left: 6, top: 60, width: 24, height: 32, borderRadius: '4px 4px 8px 8px', background: 'rgba(200,30,40,0.85)', boxShadow: '0 0 20px rgba(255,60,60,0.6)' }} />
        <div style={{ position: 'absolute', left: 14, top: 48, width: 8, height: 14, borderRadius: '50% 50% 40% 40%', background: '#ffd27a', transform: `scale(${flicker(frame, 'znf', 1).toFixed(3)})` }} />
        {[70, 86].map((x, k) => <div key={x} style={{ position: 'absolute', left: x, top: 70 + k * 6, width: 16, height: 16, borderRadius: '50%', background: k ? '#c9c2b0' : '#a3332e' }} />)}
      </div>
      {/* el vecino: valla, farol y perro */}
      <div style={{ position: 'absolute', left: 1500, top: 560, width: 330, height: 200, background: '#100c08' }}>
        <div style={{ position: 'absolute', left: -20, top: -90, width: 370, height: 92, background: '#0a0705', clipPath: 'polygon(0 100%, 50% 0, 100% 100%)' }} />
        <div style={{ position: 'absolute', left: 120, top: 60, width: 70, height: 70, background: `rgba(255,205,130,${(0.15 + 0.5 * nb).toFixed(3)})`, boxShadow: 'inset 0 0 0 6px #0a0705' }} />
      </div>
      <div style={{ opacity: Math.min(1, nb * 1.4), transform: `translateX(${((1 - nb) * 50).toFixed(1)}px)`, filter: 'drop-shadow(0 0 2px rgba(255,214,150,0.5))' }}>
        <Fig kind="stand" x={1620} y={900} h={300} c="#050605" />
        <div style={{ position: 'absolute', left: 1576, top: 586, width: 88, height: 16, borderRadius: 6, background: '#050605' }} />
        <Glow x={1690} y={790} r={130} c={`rgba(255,200,120,${(0.5 * lantern).toFixed(3)})`} />
        <div style={{ position: 'absolute', left: 1680, top: 770, width: 20, height: 30, borderRadius: 4, background: '#ffcf7a', opacity: lantern, boxShadow: '0 0 20px 6px rgba(255,200,120,0.6)' }} />
        <svg width={120} height={80} viewBox="0 0 120 80" style={{ position: 'absolute', left: 1700, top: 822 }}><path d="M10 40 q0-16 16-18 l8-14 l6 12 h40 q20 0 22 20 l8 30 h-10 l-6-16 h-46 l-6 16 h-10 l2-20 q-24-2-24-10z" fill="#050605" /><circle cx="28" cy="34" r="3" fill="#ffcf5a" opacity={nb} /></svg>
      </div>
      {[1470, 1530, 1590, 1650, 1710, 1770, 1830, 1890].map((x) => <div key={x} style={{ position: 'absolute', left: x, top: 820, width: 14, height: 100, background: '#1a140e', clipPath: 'polygon(0 12%, 50% 0, 100% 12%, 100% 100%, 0 100%)' }} />)}
      <div style={{ position: 'absolute', left: 1460, top: 850, width: 460, height: 10, background: '#1a140e' }} />
      {/* el profesor y su coche */}
      <div style={{ position: 'absolute', left: 120, top: 880 }}>
        <div style={{ position: 'absolute', left: 0, top: -60, width: 200, height: 60, borderRadius: '26px 26px 6px 6px', background: '#2a2f38' }} />
        <div style={{ position: 'absolute', left: 40, top: -54, width: 100, height: 22, borderRadius: '10px 10px 2px 2px', background: '#121418' }} />
        <div style={{ position: 'absolute', left: 190, top: -34, width: 14, height: 10, borderRadius: 4, background: '#fff6d8', boxShadow: '0 0 18px 6px rgba(255,240,200,0.6)' }} />
        <div style={{ position: 'absolute', left: 200, top: -50, width: 420, height: 60, background: 'linear-gradient(90deg, rgba(255,240,200,0.4), rgba(255,240,200,0))', clipPath: 'polygon(0 30%, 100% 0, 100% 100%, 0 70%)' }} />
      </div>
      <div style={{ opacity: Math.min(1, man * 1.4), transform: `translateY(${((1 - man) * 30).toFixed(1)}px)` }}>
        <div style={{ filter: rim }}>
          <Fig kind="stand" x={420} y={960} h={300} c="#040504" />
          <div style={{ position: 'absolute', left: 448, top: 860, width: 46, height: 34, borderRadius: 4, background: '#040504' }} />
        </div>
        {/* la foto de boda partida en dos */}
        {[-1, 1].map((sg) => (
          <div key={sg} style={{ position: 'absolute', left: 390 + sg * 4 + sg * (40 * split + 30 * fall), top: 560 + 30 * split + 330 * fall, width: 50, height: 66, background: '#d9ccb0', clipPath: sg < 0 ? 'polygon(0 0, 100% 0, 80% 50%, 100% 100%, 0 100%)' : 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 20% 50%)',
            transform: `rotate(${(sg * (14 * split + 70 * fall)).toFixed(2)}deg)`, opacity: man * (1 - 0.3 * split) * (1 - fall), boxShadow: '0 6px 14px rgba(0,0,0,0.5)' }}>
            <Fig kind={sg < 0 ? 'stand' : 'woman'} x={25} y={66} h={50} c="#5a4a36" />
          </div>
        ))}
      </div>
      {[0, 1].map((i) => <div key={i} style={{ position: 'absolute', left: -500 + ((t * (0.6 + i * 0.3) + i * 900) % 2800), top: 740 + i * 90, width: 1500, height: 220, borderRadius: '50%', background: `radial-gradient(ellipse, rgba(200,215,200,${(0.08 + 0.18 * mist).toFixed(3)}), rgba(0,0,0,0) 70%)`, filter: 'blur(14px)' }} />)}
    </Stage>
  );
};

// Símbolos del adivino (estrella, luna, sol) dibujados, sin depender de las fuentes.
const Glyph: React.FC<{ k: number; size: number; c: string }> = ({ k, size, c }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    {k === 0 && <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" fill={c} />}
    {k === 1 && <path d="M15.5 3A9 9 0 1 0 21 17.5 7.5 7.5 0 0 1 15.5 3z" fill={c} />}
    {k === 2 && <><circle cx="12" cy="12" r="5" fill={c} />{Array.from({ length: 8 }).map((_, i) => <path key={i} d="M12 1.5v4" stroke={c} strokeWidth={2} strokeLinecap="round" transform={`rotate(${i * 45} 12 12)`} />)}</>}
  </svg>
);
// ———————————————— 2 · Manitou: el bulto en la nuca, la radiografía, los médicos y el adivino (nueva, PL) ————————————————
const DManitou: D = ({ t0, beats: [bKar, bRen, bLek, bPlo, bWro] }) => {
  const frame = useCurrentFrame();
  const t = frame - t0;
  const grow = interpolate(frame, [bKar - 6, bKar + 120], [0.25, 1], { ...clamp, easing: easeOut });
  const beat = 0.5 + 0.5 * Math.sin(frame / 7);
  const xr = rmp(frame, bRen - 8, bRen + 4) * (frame < bRen + 12 ? flicker(frame, 'xr', 2.5) : 1);
  const docs = pop(frame, bLek - 6, 13, 150);
  const fetus = rmp(frame, bPlo - 4, bPlo + 14);
  const kick = frame > bPlo ? Math.max(0, Math.sin((frame - bPlo) / 5)) * Math.exp(-(frame - bPlo) / 60) : 0;
  const ball = rmp(frame, bWro - 6, bWro + 14);
  const cards = (k: number) => pop(frame, bWro + 2 + k * 5, 12, 200);
  return (
    <Stage bg="#0d1211" dust="rgba(220,240,255,0.15)">
      {/* consulta */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1260, height: 1080, background: 'linear-gradient(180deg, #1c2725 0%, #121a19 70%, #0b0f0e 100%)' }} />
      <Glow x={900} y={120} r={420} c="rgba(200,240,255,0.10)" />
      {/* la caja de luz con la radiografía */}
      <div style={{ position: 'absolute', left: 700, top: 130, width: 420, height: 440, background: `rgba(${Math.round(30 + 190 * xr)},${Math.round(36 + 200 * xr)},${Math.round(44 + 210 * xr)},1)`, boxShadow: `0 0 ${(70 * xr).toFixed(0)}px rgba(200,230,255,${(0.45 * xr).toFixed(3)}), inset 0 0 0 10px #2a3433` }}>
        <div style={{ position: 'absolute', left: 30, top: 30, width: 360, height: 380, background: '#0b1016', opacity: 0.2 + 0.8 * xr }}>
          <svg width={360} height={380} viewBox="0 0 360 380" style={{ position: 'absolute', inset: 0, opacity: xr }}>
            <path d="M120 40 C 200 10 290 50 300 130 C 306 190 280 220 250 236 L 210 240 C 190 250 170 250 150 236 C 110 230 90 200 92 160 C 70 150 70 120 90 110 C 90 80 100 54 120 40 Z" fill="none" stroke="rgba(225,240,255,0.85)" strokeWidth={5} />
            <circle cx="170" cy="140" r="16" fill="none" stroke="rgba(225,240,255,0.6)" strokeWidth={4} />
            {Array.from({ length: 6 }).map((_, k) => <rect key={k} x={232 - k * 2} y={246 + k * 22} width={34} height={16} rx={4} fill="rgba(225,240,255,0.75)" />)}
            {/* el bulto, en la nuca */}
            <ellipse cx="292" cy="262" rx={46 * grow} ry={52 * grow} fill="rgba(225,240,255,0.16)" stroke="rgba(225,240,255,0.5)" strokeWidth={3} />
            <g opacity={fetus} transform={`translate(292 262) scale(${(0.8 + 0.2 * fetus + 0.05 * kick).toFixed(3)})`}>
              <path d="M-6 -30 a16 16 0 1 1 18 18 q14 10 10 30 q-6 18 -26 16 q-18 -4 -18 -22 q0 -14 10 -22 q-6 -8 6 -20z" fill="rgba(255,235,235,0.9)" />
              <path d="M2 4 q-10 6 -6 16" stroke="#0b1016" strokeWidth={3} fill="none" />
            </g>
          </svg>
          <Glow x={292} y={262} r={120} c={`rgba(255,60,60,${(0.4 * fetus * (0.6 + 0.4 * beat)).toFixed(3)})`} />
        </div>
      </div>
      {/* ventana esmerilada detrás de la paciente: la silueta y el bulto se recortan contra la luz */}
      <div style={{ position: 'absolute', left: 70, top: 150, width: 580, height: 640, background: 'linear-gradient(180deg, #8fa3a0 0%, #5f7472 70%, #3a4846 100%)', boxShadow: 'inset 0 0 0 14px #2a3433, 0 0 80px rgba(170,200,200,0.25)' }}>
        <div style={{ position: 'absolute', left: 283, top: 0, width: 14, height: 640, background: '#2a3433' }} />
        <div style={{ position: 'absolute', left: 0, top: 313, width: 580, height: 14, background: '#2a3433' }} />
      </div>
      {/* la paciente, de perfil: el bulto crece en la nuca */}
      <div style={{ position: 'absolute', left: 140, top: 250 }}>
        <svg width={400} height={830} viewBox="0 0 400 830" style={{ overflow: 'visible' }}>
          <path d="M200 40 C300 40 360 110 360 200 C360 260 344 300 330 330 L332 420 C360 470 400 500 400 560 L400 830 L0 830 L0 600 C0 540 60 500 120 470 L128 400 C110 384 100 364 96 344 L72 304 L82 286 L60 254 L82 216 C70 120 120 40 200 40 Z" fill="#070909" />
          <path d="M200 40 C300 40 360 110 360 200 C356 150 320 70 210 60 C170 60 130 80 110 120 C 120 70 160 40 200 40Z" fill="#1a1412" />
          <ellipse cx={342} cy={360} rx={22 + 34 * grow * (0.94 + 0.06 * beat)} ry={26 + 38 * grow * (0.94 + 0.06 * beat)} fill="#070909" />
        </svg>
        <Glow x={360} y={360} r={90 + 60 * grow} c={`rgba(220,30,40,${(0.18 + 0.4 * grow * beat).toFixed(3)})`} />
      </div>
      {/* los médicos */}
      <div style={{ opacity: Math.min(1, docs * 1.4), transform: `translateY(${((1 - docs) * 40).toFixed(1)}px)` }}>
        <Fig kind="stand" x={790} y={1000} h={380} c="#c9d0d8" /><Fig kind="stand" x={1030} y={1000} h={360} c="#b4bcc6" />
        {[[790, 645, 44], [1030, 668, 41]].map(([x, y, r]) => <div key={x} style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: '#2a221c' }} />)}
        {[[740, 560], [1080, 584]].map(([x, y], k) => {
          const q = pop(frame, bLek + 4 + k * 8, 10, 220);
          return <div key={k} style={{ position: 'absolute', left: x, top: y - 40 * q, fontFamily: font.sans, fontWeight: 700, fontSize: 64, color: '#e8f2ff', opacity: q, transform: `scale(${q.toFixed(3)}) rotate(${k ? 10 : -10}deg)` }}>?</div>;
        })}
      </div>
      {/* el adivino */}
      <div style={{ position: 'absolute', left: 1260, top: 0, width: 660, height: 1080, background: 'linear-gradient(180deg, #1a0f22 0%, #120a18 70%, #07040a 100%)', overflow: 'hidden' }}>
        {Array.from({ length: 9 }).map((_, k) => <div key={k} style={{ position: 'absolute', left: k * 76 - 10, top: 0, width: 80, height: 640, background: k % 2 ? '#2a1636' : '#24122f', borderRadius: '0 0 40px 40px', transform: `skewX(${(Math.sin(t / 50 + k) * 2).toFixed(2)}deg)` }} />)}
        {[[140, 120], [460, 200], [300, 80]].map(([x, y], k) => <div key={k} style={{ position: 'absolute', left: x, top: y }}><Glyph k={k === 1 ? 1 : 0} size={44} c={`rgba(230,196,106,${(0.35 + 0.4 * ball).toFixed(3)})`} /></div>)}
        <Fig kind="stand" x={330} y={760} h={360} c="#05030a" />
        <div style={{ position: 'absolute', left: 270, top: 384, width: 120, height: 20, borderRadius: 6, background: '#05030a' }} />
        <div style={{ position: 'absolute', left: 296, top: 352, width: 70, height: 40, borderRadius: '20px 20px 4px 4px', background: '#05030a' }} />
        <div style={{ position: 'absolute', left: 60, top: 740, width: 540, height: 360, borderRadius: '50% 50% 0 0 / 30% 30% 0 0', background: 'linear-gradient(180deg, #4a1838, #2a0c20)' }} />
        <Glow x={340} y={700} r={260} c={`rgba(180,140,242,${(0.15 + 0.5 * ball).toFixed(3)})`} />
        <div style={{ position: 'absolute', left: 270, top: 630, width: 140, height: 140, borderRadius: '50%', background: `radial-gradient(circle at 38% 34%, #ffffff 0%, rgba(210,190,255,${(0.6 + 0.35 * ball).toFixed(3)}) 30%, rgba(90,60,160,0.85) 75%)`, boxShadow: `0 0 ${(80 * ball).toFixed(0)}px rgba(200,170,255,0.7)` }}>
          <div style={{ position: 'absolute', left: 40, top: 46, width: 60, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', filter: 'blur(6px)', transform: `rotate(${(t * 2).toFixed(1)}deg)` }} />
        </div>
        <div style={{ position: 'absolute', left: 300, top: 762, width: 80, height: 22, borderRadius: 6, background: '#c9a24a' }} />
        {[0, 1, 2].map((k) => {
          const q = cards(k);
          return <div key={k} style={{ position: 'absolute', left: 120 + k * 70, top: 800, width: 56, height: 86, borderRadius: 6, background: q > 0.5 ? '#e9dfc8' : '#3a1a4a', border: '3px solid #c9a24a', transform: `rotate(${(-14 + k * 14).toFixed(1)}deg) scaleX(${Math.abs(1 - 2 * Math.min(1, q)).toFixed(3)})`, opacity: Math.min(1, ball * 2) }}>
            {q > 0.5 && <div style={{ display: 'flex', justifyContent: 'center', marginTop: 22 }}><Glyph k={[1, 0, 2][k]} size={32} c="#7a2a8a" /></div>}
          </div>;
        })}
        <div style={{ position: 'absolute', left: 520, top: 690, width: 14, height: 60, background: '#efe6d2' }}><div style={{ position: 'absolute', left: -2, top: -18, width: 18, height: 18, borderRadius: '50% 50% 40% 40%', background: '#ffcf7a', transform: `scale(${flicker(frame, 'mcan', 1).toFixed(3)})` }} /></div>
      </div>
      <div style={{ position: 'absolute', left: 1250, top: 0, width: 14, height: 1080, background: '#050405' }} />
    </Stage>
  );
};

// ———————————————— 1 · Nie otwieraj oczu: la ventana tapada, la caja de pájaros y el río (nueva, PL) ————————————————
const Bird: React.FC<{ x: number; y: number; s: number; flap: number }> = ({ x, y, s, flap }) => (
  <svg width={40 * s} height={30 * s} viewBox="0 0 40 30" style={{ position: 'absolute', left: x, top: y, overflow: 'visible' }}>
    <ellipse cx="20" cy="18" rx="12" ry="8" fill="#d8c27a" /><circle cx="30" cy="11" r="6" fill="#d8c27a" /><path d="M35 11 l6 2 l-6 2z" fill="#b07a18" />
    <path d={`M14 16 q6 ${(-14 * flap).toFixed(1)} 14 -2`} fill="#b89a50" /><circle cx="31" cy="10" r="1.4" fill="#111" />
  </svg>
);
const Child: React.FC<{ x: number; y: number; h: number; band: number; c?: string }> = ({ x, y, h, band, c = '#0a0c0e' }) => {
  const s = h / 100;
  return (
    <div style={{ position: 'absolute', left: x - 30 * s, top: y - 100 * s, width: 60 * s, height: 100 * s }}>
      <svg width={60 * s} height={100 * s} viewBox="0 0 60 100" style={{ position: 'absolute', inset: 0 }}><path d="M30 8a14 14 0 1 1 0 28a14 14 0 1 1 0-28zM12 40q18-6 36 0l6 60h-48z" fill={c} /></svg>
      <div style={{ position: 'absolute', left: 13 * s, top: 18 * s, width: 34 * s * band, height: 7 * s, background: '#f2f0ea', boxShadow: `0 0 ${(8 * band).toFixed(0)}px rgba(255,255,255,0.5)` }} />
    </div>
  );
};
const DMalerman: D = ({ t0, beats: [bZew, bSpo, bRze, bOpa, bSlu] }) => {
  const frame = useCurrentFrame();
  const t = frame - t0;
  const pass = interpolate(frame, [bZew - 20, bZew + 70], [-0.2, 1.2], clamp);
  const lift = rmp(frame, bSpo - 6, bSpo + 6, easeOut) * (1 - rmp(frame, bSpo + 26, bSpo + 46));
  const glare = interpolate(frame, [bSpo - 2, bSpo + 2, bSpo + 20, bSpo + 50], [0, 1, 0.6, 0], clamp);
  const flap = (k: number) => (frame > bZew - 10 && frame < bSpo + 60 ? Math.abs(Math.sin(frame / 2.2 + k)) : 0.15);
  const boat = interpolate(frame, [bRze - 40, bRze + 160], [0, 1], { ...clamp, easing: easeOut });
  const band = rmp(frame, bOpa - 8, bOpa + 10, easeOut);
  const hear = rmp(frame, bSlu - 8, bSlu + 6);
  const sway = Math.sin(t / 30) * 6;
  return (
    <Stage bg="#0a0c0f" dust="rgba(220,230,240,0.14)">
      {/* dentro: la ventana tapada con mantas */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 760, height: 1080, background: 'linear-gradient(180deg, #1a1a1c, #0f0f11)' }}>
        <AbsoluteFill style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 64px)' }} />
        <div style={{ position: 'absolute', left: 140, top: 130, width: 480, height: 500, background: '#d9dde2', overflow: 'hidden', boxShadow: 'inset 0 0 0 16px #2a2622' }}>
          <AbsoluteFill style={{ background: `rgba(255,250,240,${(0.25 + 0.75 * glare).toFixed(3)})` }} />
          {[0, 1, 2].map((k) => (
            <div key={k} style={{ position: 'absolute', left: 16 + k * 150, top: 16, width: 152, height: 468, background: ['#4a3a32', '#3b4450', '#5a4636'][k], transformOrigin: k === 2 ? '50% 0' : '50% 0',
              transform: `skewX(${(Math.sin(t / 24 + k) * 1.6 + (pass > 0 && pass < 1 ? Math.sin(frame / 4 + k) * 3 : 0)).toFixed(2)}deg)${k === 2 ? ` rotate(${(-28 * lift).toFixed(2)}deg)` : ''}`,
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0 6px, transparent 6px 22px)', boxShadow: 'inset -6px 0 12px rgba(0,0,0,0.35)', opacity: 0.97 }}>
              {[20, 76, 132].map((x) => <div key={x} style={{ position: 'absolute', left: x - 4, top: 6, width: 8, height: 8, borderRadius: '50%', background: '#888' }} />)}
            </div>
          ))}
          {/* la sombra de lo que pasa por fuera, a través de las mantas */}
          <div style={{ position: 'absolute', left: -340 + 1150 * pass, top: 40, width: 320, height: 460, borderRadius: '45% 45% 30% 30%', background: 'rgba(0,0,0,0.72)', filter: 'blur(26px)', mixBlendMode: 'multiply' }} />
        </div>
        {glare > 0 && <Glow x={560} y={560} r={420} c={`rgba(255,250,235,${(0.55 * glare).toFixed(3)})`} />}
        {/* la caja con pájaros */}
        <div style={{ position: 'absolute', left: 120, top: 780, width: 560, height: 24, background: '#2a1c12' }} />
        <div style={{ position: 'absolute', left: 300, top: 660, width: 200, height: 122, background: '#6b4a2a', boxShadow: 'inset 0 0 0 6px #3a2614' }}>
          {[0, 1, 2, 3, 4].map((k) => <div key={k} style={{ position: 'absolute', left: 18 + k * 36, top: 18, width: 10, height: 10, borderRadius: '50%', background: '#120a04' }} />)}
          <Bird x={30 + flap(0) * 6} y={50 - flap(0) * 10} s={1.4} flap={flap(0)} />
          <Bird x={110 - flap(1) * 6} y={56 - flap(1) * 12} s={1.3} flap={flap(1)} />
        </div>
      </div>
      <div style={{ position: 'absolute', left: 760, top: 0, width: 16, height: 1080, background: '#050506' }} />
      {/* fuera: el río en la niebla */}
      <div style={{ position: 'absolute', left: 776, top: 0, width: 1144, height: 1080, background: 'linear-gradient(180deg, #2a323a 0%, #3a444c 40%, #1a2128 62%, #0c1115 100%)', overflow: 'hidden' }}>
        <svg width={1144} height={1080} viewBox="0 0 1144 1080" style={{ position: 'absolute', inset: 0 }}>
          <path d="M0 560 Q 200 520 420 540 T 1144 520 L1144 600 L0 620Z" fill="#0d1216" />
          {Array.from({ length: 30 }).map((_, i) => { const r = (k: string) => random(`mtr${i}${k}`); const x = i * 40 + r('x') * 20; const h = 90 + r('h') * 140; return <path key={i} d={`M${x} 580 L${x + 18} ${580 - h} L${x + 36} 580Z`} fill="#141b20" />; })}
          <rect x="0" y="600" width="1144" height="300" fill="#1e2a31" />
          {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M${((i * 97 + t * 1.2) % 1300) - 100} ${640 + (i % 5) * 50} q 30 -6 60 0`} stroke="rgba(200,220,230,0.25)" strokeWidth={3} fill="none" />)}
          <rect x="0" y="900" width="1144" height="180" fill="#0b1013" />
          {Array.from({ length: 40 }).map((_, i) => { const x = i * 30 + (i % 3) * 7; return <path key={`r${i}`} d={`M${x} 920 q ${(Math.sin(t / 26 + i) * 8).toFixed(1)} -60 ${(4 + (i % 4) * 3).toFixed(0)} -${110 + (i % 5) * 20}`} stroke="#0f1712" strokeWidth={5} fill="none" />; })}
        </svg>
        {/* algo en la otra orilla: solo una distorsión */}
        <div style={{ position: 'absolute', left: 820 + 40 * Math.sin(t / 40), top: 380, width: 140, height: 220, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(10,14,18,0.6), rgba(10,14,18,0) 70%)', opacity: 0.4 + 0.5 * hear, filter: 'blur(6px)', transform: `scaleY(${(1 + 0.1 * Math.sin(frame / 5)).toFixed(3)})` }} />
        {/* la barca */}
        <div style={{ position: 'absolute', left: -120 + 520 * boat, top: 640 + Math.sin(t / 22) * 4, transform: `rotate(${(sway * 0.3).toFixed(2)}deg)` }}>
          <Child x={190} y={70} h={190} band={band} c="#07090b" />
          <Child x={100} y={74} h={110} band={band} c="#07090b" />
          <Child x={300} y={76} h={100} band={band} c="#07090b" />
          <svg width={420} height={110} viewBox="0 0 420 110" style={{ position: 'absolute', left: 0, top: 50 }}><path d="M0 10 H420 L370 90 H50 Z" fill="#2a1c12" stroke="#120a06" strokeWidth={4} /><path d="M140 0 L60 110" stroke="#3a2a1a" strokeWidth={8} /></svg>
          {hear > 0 && [0, 1, 2].map((k) => {
            const w = ((frame - bSlu) / 26 + k / 3) % 1;
            return <div key={k} style={{ position: 'absolute', left: 190 - 40 - 120 * w, top: -40 - 120 * w, width: 80 + 240 * w, height: 80 + 240 * w, borderRadius: '50%', border: `3px solid rgba(220,235,255,${(0.6 * hear * (1 - w)).toFixed(3)})`, borderBottomColor: 'transparent' }} />;
          })}
        </div>
        <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(200,210,220,0.0) 30%, rgba(200,210,220,0.18) 55%, rgba(200,210,220,0.05) 80%)' }} />
        {[0, 1, 2].map((i) => <div key={i} style={{ position: 'absolute', left: -400 + ((t * (0.5 + i * 0.25) + i * 600) % 2000), top: 560 + i * 70, width: 1200, height: 200, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(210,220,230,0.16), rgba(0,0,0,0) 70%)', filter: 'blur(14px)' }} />)}
      </div>
    </Stage>
  );
};

export const DIORAMAS: Record<number, D> = { 1: DCthulhu, 2: DPoe, 3: DHendrix, 4: DRosemary, 5: DDracula, 6: DInkub, 7: DDarda, 8: DSalem, 9: DManitou, 10: DMalerman };
export const _keep = { css, W };
