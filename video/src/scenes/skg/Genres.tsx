import React from 'react';
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut, keyframes } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { MaskTitle } from '../nxr/kit';
import { Kicker } from '../nxr/App';
import { BOOKS, Book3D, BookDef, Cam, color, Cover, CoverIcon, font, HoursBar, KR, KR_DEEP, MiniIcon, ramp, rampOut, shadow, SkNight, SkStage } from './kit';
import { sceneClock } from './timeline';

// Cubierta plana (tarjeta) para mapas y tableros.
export const FlatCover: React.FC<{ b: BookDef; w: number; rot?: number; style?: React.CSSProperties; dark?: boolean }> = ({ b, w, rot = 0, style, dark = false }) => (
  <div style={{ position: 'relative', width: w, height: w * 1.5, borderRadius: w * 0.025, overflow: 'hidden', transform: `rotate(${rot}deg)`,
    boxShadow: dark ? '0 18px 40px rgba(0,0,0,0.55)' : '0 18px 40px rgba(16,16,16,0.18), 0 4px 10px rgba(16,16,16,0.10)', ...style }}>
    <Cover b={b} w={w} h={w * 1.5} />
  </div>
);

// Mancha orgánica (territorio) determinista.
const blob = (cx: number, cy: number, rx: number, ry: number, seed: string, n = 10) => {
  const pts = Array.from({ length: n }).map((_, i) => {
    const a = (i / n) * Math.PI * 2;
    const k = 0.82 + random(`${seed}-${i}`) * 0.3;
    return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k] as const;
  });
  let d = '';
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    if (i === 0) d += `M${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + 'Z';
};

type Region = { key: string; label: string; sub: string; c: string; line: string; cx: number; cy: number; rx: number; ry: number; books: string[]; icon: React.ReactNode };

// ——— TERR · G09–G10 · El mapa de territorios ———
export const Territories: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('TERR');
  const fTerror = c.at('G09', 'terror');
  const fRey = c.at('G09', 'rey');
  const fDisc = c.at('G09', 'discute');
  const fMapa = c.at('G09', 'mapa');
  const fTerr = c.at('G09', 'territorios');
  const rAt = [c.at('G10', 'terror'), c.at('G10', 'terror', 1), c.at('G10', 'fantasía'), c.at('G10', 'crimen'), c.at('G10', 'relatos')];
  const ex = [c.at('G10', 'hoteles'), c.at('G10', 'coches'), c.at('G10', 'pueblos')];
  const fMonstruo = c.at('G10', 'monstruo');
  const fViajes = c.at('G10', 'viajes');
  const fMundos = c.at('G10', 'mundos');
  const fDetect = c.at('G10', 'detectives');
  const fAses = c.at('G10', 'asesinos');
  const fCortas = c.at('G10', 'cortas');
  const regions: Region[] = [
    { key: 'sob', label: 'Terror sobrenatural', sub: 'hoteles, coches y pueblos malditos', c: '#F8DADC', line: KR, cx: 520, cy: 330, rx: 360, ry: 220, books: ['resplandor', 'christine', 'salem'], icon: <CoverIcon kind="hotel" size={34} c={KR} sw={2} /> },
    { key: 'hum', label: 'Terror humano', sub: 'el monstruo es una persona', c: '#ECE3F3', line: '#5B2333', cx: 1390, cy: 300, rx: 360, ry: 210, books: ['misery', 'dolores', 'gerald'], icon: <CoverIcon kind="eye" size={34} c="#5B2333" sw={2} /> },
    { key: 'fan', label: 'Fantasía y ciencia ficción', sub: 'viajes en el tiempo y otros mundos', c: '#DCE9F6', line: '#24314A', cx: 420, cy: 790, rx: 330, ry: 200, books: ['d2263', 'torre1', 'cuento'], icon: <CoverIcon kind="stars" size={34} c="#24314A" sw={2} /> },
    { key: 'cri', label: 'Crimen', sub: 'detectives y asesinos', c: '#FFF1BF', line: '#8A6A00', cx: 1000, cy: 640, rx: 270, ry: 190, books: ['mercedes', 'holly', 'billy'], icon: <CoverIcon kind="magnifier" size={34} c="#8A6A00" sw={2} /> },
    { key: 'rel', label: 'Relatos y novelas cortas', sub: 'más de doscientos', c: '#E1EFE2', line: '#2D5A3D', cx: 1530, cy: 800, rx: 330, ry: 200, books: ['cuatro', 'umbral', 'oscuridad'], icon: <CoverIcon kind="notebook" size={34} c="#2D5A3D" sw={2} /> },
  ];
  // Fase 1: «TERROR» enorme. Fase 2: el mapa.
  const toMap = ramp(frame, fMapa - 14, fMapa + 10);
  const terrorIn = spring({ frame: frame - 8, fps: 50, config: { damping: 14, stiffness: 120 } });
  const solo = spring({ frame: frame - (fTerror - 2), fps: 50, config: { damping: 10, stiffness: 220 } });
  const crown = spring({ frame: frame - (fRey - 2), fps: 50, config: { damping: 11, stiffness: 180 } });
  // Cámara: vista general → cada territorio al nombrarlo → vista general al final.
  const zoomOn = (r: Region, s = 1.55) => ({ s, x: -(r.cx - 960) * s, y: -(r.cy - 540) * s });
  const camKeys = [
    { f: 0, s: 1, x: 0, y: 0 },
    { f: Math.max(1, rAt[0] - 14), s: 1, x: 0, y: 0 },
    ...regions.flatMap((r, i) => {
      const z = zoomOn(r, i === 3 ? 1.7 : 1.5);
      const a = rAt[i] - 10;
      const b = (rAt[i + 1] ?? fCortas + 30) - 16;
      return [{ f: a + 14, ...z }, { f: Math.max(a + 15, i === 4 ? fCortas + 10 : b), s: z.s * 1.03, x: z.x * 1.03, y: z.y * 1.03 }];
    }),
    { f: fCortas + 34, s: 1, x: 0, y: 0 },
    { f: c.dur, s: 1.02, x: 0, y: 0 },
  ];
  return (
    <SkStage>
      {/* Fase 1 */}
      {toMap < 1 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: 1 - toMap, transform: `scale(${1 - toMap * 0.35})`, filter: toMap > 0.01 ? `blur(${toMap * 10}px)` : undefined }}>
          <div style={{ position: 'relative', transform: `scale(${0.7 + 0.3 * terrorIn})`, opacity: Math.min(1, terrorIn * 2) }}>
            <div style={{ position: 'absolute', left: '50%', top: -150, transform: `translateX(-50%) translateY(${(1 - crown) * -80}px) rotate(${(1 - crown) * -20}deg)`, opacity: crown }}>
              <CoverIcon kind="tiara" size={150} c={color.ink} sw={1.6} />
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: -64, textAlign: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: color.muted, textTransform: 'uppercase', opacity: rampOut(frame, 4, 20) * (1 - crown) }}>Lo que mucha gente cree</div>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 290, letterSpacing: -14, color: KR, lineHeight: 1, transform: `scale(${1 + 0.06 * Math.sin(Math.min(1, solo) * Math.PI)})` }}>TERROR</div>
            <div style={{ position: 'absolute', right: -40, top: -26, fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: '#fff', background: color.ink, padding: '6px 20px', borderRadius: 12, transform: `rotate(8deg) scale(${solo})`, opacity: (1 - crown) }}>solo</div>
            <div style={{ textAlign: 'center', marginTop: 18, fontFamily: font.sans, fontWeight: 700, fontSize: 48, color: color.ink, opacity: rampOut(frame, fRey, fRey + 12) }}>
              El rey del género
              <span style={{ display: 'inline-block', marginLeft: 18, color: color.ink, background: color.yellow, padding: '2px 16px', borderRadius: 10, transform: `scale(${spring({ frame: frame - fDisc, fps: 50, config: { damping: 10, stiffness: 220 } })})` }}>✓</span>
            </div>
          </div>
        </AbsoluteFill>
      )}
      {/* Fase 2 */}
      {toMap > 0 && (
        <AbsoluteFill style={{ opacity: toMap }}>
          <Cam keys={camKeys}>
            <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              {regions.map((r, i) => {
                const a = fMapa + 2 + i * 6;
                const p = interpolate(frame, [a, a + 18], [0, 1], { ...clamp, easing: easeOut });
                const on = 0.35 + 0.65 * ramp(frame, rAt[i] - 8, rAt[i] + 6);
                const d = blob(r.cx, r.cy, r.rx, r.ry, r.key);
                return (
                  <g key={r.key} style={{ transformOrigin: `${r.cx}px ${r.cy}px`, transform: `scale(${0.6 + 0.4 * p})` }} opacity={p * on}>
                    <path d={d} fill={r.c} />
                    <path d={d} fill="none" stroke={r.line} strokeWidth={3} strokeDasharray="10 12" opacity={0.5} />
                  </g>
                );
              })}
              {/* caminos punteados entre territorios */}
              <path d="M760 420 C 900 500, 1020 380, 1120 360 M 700 760 C 760 700, 820 680, 880 670 M 1180 700 C 1260 760, 1300 780, 1340 790" stroke={color.ink} strokeOpacity={0.18} strokeWidth={4} strokeDasharray="2 14" strokeLinecap="round" fill="none" opacity={ramp(frame, fCortas, fCortas + 30)} />
            </svg>
            {regions.map((r, i) => {
              const a = i === 0 ? rAt[0] : rAt[i];
              const lab = spring({ frame: frame - (fMapa + 6 + i * 6), fps: 50, config: { damping: 16, stiffness: 170 } });
              const sub = rampOut(frame, a + 14, a + 28);
              const active = frame >= a - 8 && (i === 4 || frame < rAt[i + 1] - 8);
              const dimLab = frame > fCortas + 20 ? 1 : frame < rAt[0] - 10 ? 0.75 : active ? 1 : 0.22;
              return (
                <React.Fragment key={r.key}>
                  <div style={{ position: 'absolute', left: r.cx - 330, width: 660, top: r.cy - r.ry * 0.86, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: lab * dimLab, transform: `translateY(${(1 - lab) * 16}px)` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: color.ink, whiteSpace: 'nowrap' }}>
                      <span style={{ width: 56, height: 56, borderRadius: '50%', background: '#fff', boxShadow: shadow.soft, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{r.icon}</span>
                      {r.label}
                    </div>
                    <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 26, color: color.ink2, marginTop: 6, opacity: sub }}>{r.sub}</div>
                  </div>
                  <div style={{ position: 'absolute', left: r.cx, top: r.cy + 10, width: 0, height: 0 }}>
                    {r.books.map((bk, j) => {
                      const ba = (i === 0 ? ex[j] : i === 1 && j === 0 ? fMonstruo - 6 : i === 2 ? (j === 0 ? fViajes - 4 : j === 1 ? fMundos - 6 : fMundos + 2) : i === 3 ? (j === 0 ? fDetect - 6 : j === 1 ? fDetect + 4 : fAses - 4) : i === 4 ? a + 10 + j * 6 : a + 12 + j * 6);
                      const s = spring({ frame: frame - ba, fps: 50, config: { damping: 14, stiffness: 170 } });
                      const w = 118;
                      return (
                        <div key={bk} style={{ position: 'absolute', left: (j - 1) * 136 - w / 2, top: -40 + (j === 1 ? -14 : 0), opacity: s, transform: `translateY(${(1 - s) * 60}px) scale(${0.7 + 0.3 * s})` }}>
                          <FlatCover b={BOOKS[bk]} w={w} rot={(j - 1) * 5} />
                        </div>
                      );
                    })}
                  </div>
                </React.Fragment>
              );
            })}
          </Cam>
        </AbsoluteFill>
      )}
      <Sfx name="impact" at={fTerror} volume={0.5} />
      <Sfx name="sparkle" at={fRey} volume={0.6} />
      <Sfx name="stamp" at={fDisc} volume={0.45} />
      <Sfx name="whoosh_soft" at={fMapa - 10} volume={0.6} />
      <Sfx name="page_turn" at={fTerr - 2} volume={0.6} />
      {rAt.map((a, i) => <Sfx key={i} name="zoom_in" at={a - 4} volume={0.45} />)}
      {rAt.map((a, i) => <Sfx key={`p${i}`} name="ui_pop" at={a} volume={0.55} />)}
      {[...ex, fMonstruo - 6, fViajes - 4, fMundos - 6, fDetect - 6, fAses - 4].map((a, i) => <Sfx key={`b${i}`} name="card_flip" at={a + 4} volume={0.5} />)}
      <Sfx name="zoom_out" at={fCortas + 20} volume={0.6} />
    </SkStage>
  );
};

// ——— FILMS · G11 · Lo has visto en el cine ———
const FILMS = [
  { t: 'Cadena perpetua', y: 1994, from: 'de «Las cuatro estaciones»', word: 'Cadena' },
  { t: 'Cuenta conmigo', y: 1986, from: 'de «Las cuatro estaciones»', word: 'Cuenta' },
  { t: 'La milla verde', y: 1999, from: 'de «La milla verde»', word: 'milla' },
];
export const Films: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('FILMS');
  const fVisto = c.at('G11', 'visto');
  const fSalen = c.at('G11', 'salen');
  const fNing = c.at('G11', 'ninguna');
  const fTerror = c.at('G11', 'terror');
  const at = FILMS.map((f) => c.at('G11', f.word));
  const beam = rampOut(frame, 4, 30);
  return (
    <SkNight lamp={[960, 160]}>
      {/* haz del proyector */}
      <div style={{ position: 'absolute', left: 960 - 1100, top: -120, width: 2200, height: 1300, opacity: 0.55 * beam,
        background: 'conic-gradient(from 166deg at 50% 0%, rgba(255,230,170,0) 0deg, rgba(255,230,170,0.16) 8deg, rgba(255,230,170,0.22) 14deg, rgba(255,230,170,0.16) 20deg, rgba(255,230,170,0) 28deg)', filter: 'blur(8px)' }} />
      <Cam keys={[{ f: 0, s: 1.08, x: 0, y: 20 }, { f: c.dur, s: 1, x: 0, y: 0 }]}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center' }}>
          <MaskTitle text="Seguro que lo has visto" at={6} size={86} align="center" color="#fff" hi={['visto']} />
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center', gap: 50 }}>
          {FILMS.map((f, i) => {
            const s = spring({ frame: frame - (8 + i * 6), fps: 50, config: { damping: 14, stiffness: 160 } });
            const named = rampOut(frame, at[i] - 6, at[i] + 8);
            const strike = ramp(frame, fTerror - 8 + i * 4, fTerror + 6 + i * 4);
            const tag = rampOut(frame, fNing - 6 + i * 3, fNing + 6 + i * 3);
            return (
              <div key={f.t} style={{ width: 470, opacity: s, transform: `translateY(${(1 - s) * 80}px) rotate(${(i - 1) * 2 * s}deg)` }}>
                {/* fotograma de película */}
                <div style={{ background: '#0E0E10', borderRadius: 18, padding: '30px 0', boxShadow: '0 30px 60px rgba(0,0,0,0.6)', position: 'relative', overflow: 'hidden' }}>
                  {[0, 1].map((side) => (
                    <div key={side} style={{ position: 'absolute', left: 0, right: 0, [side ? 'bottom' : 'top']: 8, height: 14, display: 'flex', justifyContent: 'space-around' }}>
                      {Array.from({ length: 12 }).map((_, k) => <div key={k} style={{ width: 18, height: 14, borderRadius: 3, background: '#2A2A2E' }} />)}
                    </div>
                  ))}
                  <div style={{ margin: '0 18px', height: 260, borderRadius: 8, background: `linear-gradient(160deg, ${['#36404F', '#3F4A3A', '#2D4A3A'][i]} 0%, #16181C 100%)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: 8, background: `rgba(255,236,190,${0.06 + 0.05 * Math.abs(Math.sin(frame / 3 + i))})`, opacity: 1 - named }} />
                    <MiniIcon kind="film" size={64} c="rgba(255,255,255,0.35)" />
                    <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 48, color: '#fff', marginTop: 14, textAlign: 'center', padding: '0 20px', opacity: named, transform: `translateY(${(1 - named) * 14}px)` }}>{f.t}</div>
                    <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 30, color: 'rgba(255,255,255,0.65)', opacity: named }}>{f.y}</div>
                  </div>
                </div>
                <div style={{ marginTop: 22, textAlign: 'center', fontFamily: font.sans, fontWeight: 500, fontSize: 34, color: 'rgba(255,255,255,0.85)', opacity: rampOut(frame, fSalen - 4 + i * 4, fSalen + 10 + i * 4) }}>{f.from}</div>
                <div style={{ marginTop: 22, display: 'flex', justifyContent: 'center', opacity: tag, transform: `scale(${0.8 + 0.2 * tag})` }}>
                  <span style={{ position: 'relative', fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: '#fff', background: 'rgba(193,18,31,0.9)', padding: '10px 32px', borderRadius: 999 }}>
                    Terror
                    <span style={{ position: 'absolute', left: 14, right: 14, top: '50%', height: 5, background: '#fff', borderRadius: 3, transform: `scaleX(${strike}) rotate(-6deg)`, transformOrigin: 'left' }} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Cam>
      <Sfx name="sk_projector" at={0} volume={0.8} />
      {at.map((a, i) => <Sfx key={i} name="card_flip" at={a - 2} volume={0.65} />)}
      {FILMS.map((_, i) => <Sfx key={`in${i}`} name="tick_soft" at={10 + i * 6} volume={0.4} />)}
      {FILMS.map((_, i) => <Sfx key={`x${i}`} name="pencil_strike" at={fTerror - 4 + i * 4} volume={0.6} />)}
      <Sfx name="ui_pop" at={fNing - 4} volume={0.5} />
    </SkNight>
  );
};

// ——— PREG · G12–G13 · Dos preguntas: miedo y tiempo ———
export const Preguntas: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('PREG');
  const fDos = c.at('G12', 'dos');
  const fPrim = c.at('G12', 'primera');
  const fMiedo = c.at('G12', 'miedo');
  const fSeg = c.at('G13', 'segunda');
  const fTiempo = c.at('G13', 'tiempo');
  const fDif = c.at('G13', 'diferencia');
  const fCarrie = c.at('G13', 'Carrie');
  const fOcho = c.at('G13', 'ocho');
  const fApo = c.at('G13', 'Apocalipsis');
  const fCuar = c.at('G13', 'cuarenta');
  const q1 = spring({ frame: frame - 10, fps: 50, config: { damping: 15, stiffness: 160 } });
  const q2 = spring({ frame: frame - 16, fps: 50, config: { damping: 15, stiffness: 160 } });
  const focus1 = ramp(frame, fPrim - 8, fPrim + 10) * (1 - ramp(frame, fSeg - 10, fSeg + 6));
  const focus2 = ramp(frame, fSeg - 4, fSeg + 12);
  const bars = ramp(frame, fDif - 20, fDif);
  // aguja del medidor de miedo: barre de poco a mucho y vuelve al medio
  const needle = keyframes(frame, [{ f: fMiedo - 6, v: -70 }, { f: fMiedo + 26, v: 70 }, { f: fMiedo + 50, v: -20 }, { f: fMiedo + 80, v: 30 }], 'v', easeInOut);
  const card = (n: number, title: string, foc: number, appear: number, icon: React.ReactNode, children?: React.ReactNode) => (
    <div style={{ width: 760, height: 520, borderRadius: 36, background: '#fff', boxShadow: shadow.card, border: `1px solid ${color.line}`, padding: 50, position: 'relative', overflow: 'hidden',
      opacity: appear * (1 - 0.55 * (n === 1 ? focus2 : focus1 > 0.5 ? 0 : 0)), transform: `translateY(${(1 - appear) * 80}px) scale(${0.92 + 0.08 * appear + 0.04 * foc})` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <span style={{ width: 70, height: 70, borderRadius: '50%', background: foc > 0.5 ? color.yellow : color.ink, color: foc > 0.5 ? color.ink : color.yellow, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 38 }}>{n}</span>
        <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: color.muted, textTransform: 'uppercase' }}>Pregunta</span>
      </div>
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 64, letterSpacing: -2, lineHeight: 1.05, color: color.ink, marginTop: 30 }}>{title}</div>
      <div style={{ position: 'absolute', right: 46, bottom: 40 }}>{icon}</div>
      {children}
    </div>
  );
  return (
    <SkStage>
      <AbsoluteFill style={{ opacity: 1 - bars, transform: `translateY(${-bars * 60}px) scale(${1 - bars * 0.06})`, filter: bars > 0.01 ? `blur(${bars * 8}px)` : undefined }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 90, textAlign: 'center' }}>
          <MaskTitle text="Antes de elegir, dos preguntas" at={4} size={72} align="center" hi={['dos']} />
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 290, display: 'flex', justifyContent: 'center', gap: 60 }}>
          {card(1, '¿Cuánto miedo quieres pasar?', focus1, q1, (
            <svg width="240" height="150" viewBox="0 0 240 150">
              <path d="M20 130 A100 100 0 0 1 220 130" stroke="#ECE8E2" strokeWidth="26" fill="none" strokeLinecap="round" />
              <path d="M20 130 A100 100 0 0 1 220 130" stroke="url(#fear)" strokeWidth="26" fill="none" strokeLinecap="round" />
              <defs><linearGradient id="fear" x1="0" x2="1"><stop offset="0" stopColor="#F2C94C" /><stop offset="1" stopColor={KR} /></linearGradient></defs>
              <g transform={`rotate(${needle} 120 130)`}><path d="M120 130 L120 52" stroke={color.ink} strokeWidth="8" strokeLinecap="round" /></g>
              <circle cx="120" cy="130" r="14" fill={color.ink} />
            </svg>
          ))}
          {card(2, '¿Cuánto tiempo tienes?', focus2, q2, (
            <div style={{ transform: `rotate(${frame * (focus2 > 0 ? 3 : 0.4)}deg)` }}><MiniIcon kind="clock" size={150} c={color.ink} /></div>
          ))}
        </div>
      </AbsoluteFill>
      {bars > 0 && (
        <AbsoluteFill style={{ opacity: bars, justifyContent: 'center', paddingLeft: 190, gap: 64 }}>
          <div>
            <Kicker at={fDif - 14} text="Duración del audiolibro en español" />
            <MaskTitle text="La diferencia es enorme" at={fDif - 10} size={84} hi={['enorme']} />
          </div>
          <HoursBar hours={7.42} label="Carrie" at={fCarrie} trackAt={fDif - 8} width={1300} maxH={50} c={color.ink} h={64} size={1.5} showValue={frame > fOcho - 10 ? '7 h 25 min' : undefined} />
          <HoursBar hours={48.27} label="Apocalipsis" at={fApo} trackAt={fDif - 4} width={1300} maxH={50} c={KR} dur={50} h={64} size={1.5} showValue={frame > fCuar + 10 ? '48 h 16 min' : undefined} />
        </AbsoluteFill>
      )}
      <Sfx name="ui_pop" at={12} volume={0.6} />
      <Sfx name="ui_pop" at={18} volume={0.6} />
      <Sfx name="focus" at={fPrim} volume={0.6} />
      <Sfx name="sk_heart" at={fMiedo + 4} volume={0.6} />
      <Sfx name="focus" at={fSeg} volume={0.6} />
      <Sfx name="sk_clock" at={fTiempo} volume={0.55} />
      <Sfx name="whoosh_soft" at={fDif - 18} volume={0.6} />
      <Sfx name="swipe" at={fCarrie + 2} volume={0.7} />
      <Sfx name="riser" at={fApo + 42} volume={0.45} />
      <Sfx name="hit_soft" at={fApo + 44} volume={0.7} />
    </SkStage>
  );
};
export const _g = { Book3D, easeInOut, KR_DEEP };
