import React from 'react';
import { AbsoluteFill, interpolate, random, spring, staticFile, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { MaskTitle } from '../nxr/kit';
import { BONE, BOOKS10, DIM, Night, RED, color, flicker, font } from './kit';
import { Img } from 'remotion';
import { COVERS, Cover3D, CoverArt, bgSrc, countTo, KWords } from './fx';
import { Browser, PAGES, Ring, viewAt } from './web';
import { sceneClock } from './timeline';

const fps = 50;
const sp = (frame: number, at: number, d = 15, s = 170) => spring({ frame: frame - at, fps, config: { damping: d, stiffness: s } });
const ramp = (frame: number, a: number, b: number, ez = easeInOut) => interpolate(frame, [a, b], [0, 1], { ...clamp, easing: ez });
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ———————————————— Gancho (Fantasía) ————————————————
// 1: un libro abierto junto a una vela, en una biblioteca de noche («Hay historias que se leen»).
// 2: la cámara entra en las páginas y se abre un mundo: luna, montañas, un castillo, faroles que suben y un dragón
//    que cruza la luna («…que te llevan tan lejos que, cuando vuelves, ya no eres el mismo»).
// 3: las diez historias, censuradas, como en Terror.
const Candle: React.FC<{ x: number; y: number; s?: number; seed: string }> = ({ x, y, s = 1, seed }) => {
  const frame = useCurrentFrame();
  const f = flicker(frame, seed, 0.6);
  const sway = Math.sin(frame / 6 + random(seed) * 5) * 2;
  return (
    <div style={{ position: 'absolute', left: x - 30 * s, top: y - 150 * s, width: 60 * s, height: 160 * s }}>
      <div style={{ position: 'absolute', left: -260 * s, top: -200 * s, width: 580 * s, height: 580 * s, borderRadius: '50%', background: `radial-gradient(circle, rgba(255,200,120,${(0.32 * f).toFixed(3)}) 0%, rgba(255,200,120,0) 62%)` }} />
      <div style={{ position: 'absolute', left: 18 * s, top: 40 * s, width: 24 * s, height: 110 * s, background: 'linear-gradient(90deg, #d9cfb8, #f3ead6 50%, #cfc4ab)', borderRadius: 3 * s }} />
      <div style={{ position: 'absolute', left: 21 * s, top: (6 + sway * 0.3) * s, width: 18 * s, height: 34 * s, borderRadius: '50% 50% 40% 40%', background: 'radial-gradient(ellipse at 50% 70%, #fff6d8, #ffc35a 55%, rgba(255,150,40,0) 75%)',
        transform: `rotate(${sway}deg) scale(${(0.9 + 0.12 * f).toFixed(3)})`, transformOrigin: '50% 100%' }} />
    </div>
  );
};
const OpenBook: React.FC<{ glow: number; w?: number }> = ({ glow, w = 760 }) => {
  const h = w * 0.36;
  return (
    <div style={{ position: 'relative', width: w, height: h, perspective: 1600 }}>
      <div style={{ position: 'absolute', left: -w * 0.2, top: -h * 0.9, width: w * 1.4, height: h * 2.4, borderRadius: '50%', background: `radial-gradient(ellipse, rgba(255,226,160,${(0.45 * glow).toFixed(3)}) 0%, rgba(255,226,160,0) 60%)` }} />
      <div style={{ position: 'absolute', inset: 0, transform: 'rotateX(58deg)', transformStyle: 'preserve-3d' }}>
        <div style={{ position: 'absolute', left: -14, top: -10, width: w + 28, height: h * 2.2 + 20, background: '#4a2a18', borderRadius: 10 }} />
        {[0, 1].map((k) => (
          <div key={k} style={{ position: 'absolute', left: k ? w / 2 : 0, top: 0, width: w / 2, height: h * 2.2, background: `linear-gradient(${k ? 90 : 270}deg, #efe4cb, #f8f0dc 70%, #d9ccae)`,
            borderRadius: k ? '0 8px 8px 0' : '8px 0 0 8px', boxShadow: 'inset 0 0 30px rgba(120,90,40,0.25)', overflow: 'hidden' }}>
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} style={{ position: 'absolute', left: k ? 40 : 60, top: 40 + i * 26, width: w / 2 - 110 - ((i * 37 + k * 13) % 60), height: 4, borderRadius: 2, background: `rgba(70,50,30,${(0.35 - 0.2 * glow).toFixed(3)})` }} />
            ))}
            <div style={{ position: 'absolute', inset: 0, background: `rgba(255,236,190,${(0.8 * glow).toFixed(3)})` }} />
          </div>
        ))}
      </div>
    </div>
  );
};
// Dragón en silueta (genérico), de perfil, con las alas que baten.
const Dragon: React.FC<{ s?: number; flap: number; c?: string }> = ({ s = 1, flap, c = '#05060c' }) => {
  const wy = 40 * flap;
  return (
    <svg width={420 * s} height={220 * s} viewBox="0 0 420 220" style={{ overflow: 'visible' }}>
      <path d={`M60 120 Q120 100 190 112 L250 108 Q300 96 340 80 L372 70 L360 86 L392 84 L356 100 Q330 120 290 126 L240 134 Q210 150 160 146 Q110 142 60 120 Z`} fill={c} />
      <path d="M60 120 Q20 116 0 140 Q30 128 62 132 Z" fill={c} />
      <path d={`M190 112 Q170 ${40 - wy} 120 ${10 - wy * 1.4} Q170 ${50 - wy * 0.6} 150 ${70 - wy * 0.2} Q200 ${60 - wy * 0.5} 230 108 Z`} fill={c} />
      <path d={`M230 110 Q250 ${30 - wy} 300 ${-6 - wy * 1.2} Q270 ${50 - wy * 0.5} 262 ${80 - wy * 0.2} Q290 ${70 - wy * 0.3} 262 112 Z`} fill={c} opacity={0.85} />
    </svg>
  );
};
const World: React.FC<{ t: number; dragonAt: number; frame: number }> = ({ t, dragonAt, frame }) => {
  const dx = interpolate(frame, [dragonAt - 30, dragonAt + 110], [-500, 2200], clamp);
  const dy = 300 + Math.sin((frame - dragonAt) / 30) * 18;
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #0B0F2A 0%, #23205A 45%, #4A2E6E 70%, #20183A 100%)', overflow: 'hidden' }}>
      {Array.from({ length: 90 }).map((_, i) => { const r = (k: string) => random(`wst${i}${k}`); return <div key={i} style={{ position: 'absolute', left: r('x') * 1920, top: r('y') * 560, width: 2 + r('s') * 2, height: 2 + r('s') * 2, borderRadius: 2, background: '#fff', opacity: 0.25 + 0.6 * Math.abs(Math.sin(frame / (18 + r('t') * 30) + i)) }} />; })}
      <div style={{ position: 'absolute', left: 1180 - 170, top: 250 - 170, width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle at 42% 40%, #FFF6E2, #F3E2BE 60%, #E6CF9F)', boxShadow: '0 0 160px 40px rgba(255,236,200,0.35)' }} />
      <div style={{ position: 'absolute', left: dx, top: dy - 110 }}><Dragon s={0.9} flap={Math.sin((frame - dragonAt) / 4.5)} /></div>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, transform: `translateX(${(-t * 40).toFixed(1)}px)` }}>
        <path d="M-100 760 L120 560 L260 660 L420 470 L560 610 L760 430 L940 600 L1100 480 L1260 620 L1440 500 L1640 650 L1820 520 L2040 700 L2040 1080 L-100 1080 Z" fill="#1E1840" />
      </svg>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, transform: `translateX(${(-t * 90).toFixed(1)}px)` }}>
        <path d="M-200 860 Q 200 760 520 800 Q 800 840 1100 760 Q 1400 690 1700 780 Q 1900 830 2200 790 L2200 1080 L-200 1080 Z" fill="#120E28" />
        {/* castillo en el risco */}
        <path d="M1480 780 L1480 600 L1500 600 L1500 560 L1520 520 L1540 560 L1540 600 L1560 600 L1560 650 L1600 650 L1600 560 L1615 520 L1630 560 L1630 650 L1660 650 L1660 780 Z" fill="#0B0820" />
        {[[1512, 615], [1610, 600], [1640, 690], [1525, 700]].map(([x, y], k) => <rect key={k} x={x} y={y} width="8" height="12" fill={`rgba(255,206,120,${(0.6 + 0.4 * flicker(frame, `cw${k}`, 1)).toFixed(3)})`} />)}
      </svg>
      {/* faroles que suben */}
      {Array.from({ length: 26 }).map((_, i) => {
        const r = (k: string) => random(`lan${i}${k}`);
        const y = 1100 - ((frame * (0.8 + r('v')) + r('y') * 1100) % 1250);
        const x = r('x') * 1920 + Math.sin(frame / 40 + i) * 20 - t * 60;
        const s = 0.5 + r('s') * 0.9;
        return <div key={i} style={{ position: 'absolute', left: x, top: y, width: 14 * s, height: 18 * s, borderRadius: 4, background: 'radial-gradient(ellipse at 50% 60%, #FFE7A8, #F2A33A)', boxShadow: `0 0 ${18 * s}px ${6 * s}px rgba(255,190,90,0.45)`, opacity: 0.85 }} />;
      })}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)' }} />
    </AbsoluteFill>
  );
};

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('HOOK');
  const f1 = c.part('F01');
  const f2 = c.part('F02');
  const f3 = c.part('F03');
  const lejos = c.at('F02', 'lejos');
  const vuelves = c.at('F02', 'vuelves');
  const mismo = c.at('F02', 'mismo');
  const tenAt = c.at('F03', 'diez');
  const salirAt = c.at('F03', 'salir');
  const MONT = 5;
  const montA = f3 - 6;
  const montEnd = montA + MONT * 10;
  const sweep = interpolate(frame, [montEnd + 10, salirAt + 30], [-200, 2100], { ...clamp, easing: easeInOut });
  // 1 → 2: la cámara se mete en las páginas, que se llenan de luz.
  const dive = ramp(frame, f2 - 30, f2 + 10, (x) => x * x * x);
  const s2 = ramp(frame, f2 - 6, f2 + 14);
  const s3 = ramp(frame, f3 - 8, f3 - 6);
  const glow = ramp(frame, f1 + 30, f2 - 4);
  const worldT = ramp(frame, f2 - 6, f3, (x) => x);
  return (
    <AbsoluteFill style={{ background: '#040405' }}>
      {s2 < 1 && (
        <AbsoluteFill style={{ opacity: 1 - s2 }}>
          <Night red={0.5}>
            <AbsoluteFill style={{ transform: `scale(${(1.06 + 0.05 * ramp(frame, 0, f2) + 5 * dive).toFixed(4)})`, transformOrigin: '50% 66%' }}>
              {/* estantería al fondo */}
              <div style={{ position: 'absolute', left: 120, top: 120, display: 'flex', gap: 10, alignItems: 'flex-end', opacity: 0.55 }}>
                {Array.from({ length: 30 }).map((_, i) => {
                  const b = BOOKS10[i % 10];
                  return <div key={i} style={{ width: 44 + ((i * 13) % 20), height: 300 + ((i * 37) % 80), background: b.bg, borderRadius: 3, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.35)', filter: 'brightness(0.7)' }} />;
                })}
              </div>
              <div style={{ position: 'absolute', left: 80, right: 80, top: 500, height: 18, background: '#1A1310', opacity: 0.8 }} />
              {/* mesa */}
              <div style={{ position: 'absolute', left: -60, right: -60, top: 640, height: 500, background: 'linear-gradient(180deg, #3a2414, #1a0e06)' }} />
              <div style={{ position: 'absolute', left: 580, top: 560 }}><OpenBook glow={glow} /></div>
              <Candle x={380} y={700} s={1.1} seed="hookc" />
            </AbsoluteFill>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 850, textAlign: 'center', opacity: 1 - dive * 3 }}>
              <MaskTitle text="Hay historias que se leen." at={f1} size={92} color={BONE} align="center" />
            </div>
            <AbsoluteFill style={{ background: `rgba(255,240,210,${(0.9 * dive).toFixed(3)})` }} />
          </Night>
        </AbsoluteFill>
      )}
      {s2 > 0 && s3 < 1 && (
        <AbsoluteFill style={{ opacity: s2 * (1 - s3) }}>
          <AbsoluteFill style={{ transform: `scale(${(1.12 - 0.08 * worldT).toFixed(4)})` }}>
            <World t={worldT} dragonAt={lejos} frame={frame} />
          </AbsoluteFill>
          <AbsoluteFill style={{ background: `rgba(255,240,210,${(0.9 * (1 - ramp(frame, f2 - 6, f2 + 16))).toFixed(3)})` }} />
          <div style={{ position: 'absolute', left: 120, top: 640, width: 900 }}>
            {['Te llevan tan lejos…', 'que, cuando vuelves,', 'ya no eres el mismo.'].map((tx, i) => {
              const a = [c.at('F02', 'llevan') - 4, vuelves - 8, mismo - 14][i];
              const q = sp(frame, a, 15, 180);
              return <div key={tx} style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 60, color: i === 2 ? color.yellow : BONE, opacity: q, transform: `translateX(${(1 - q) * -40}px)`, marginBottom: 10, textShadow: '0 4px 30px rgba(0,0,0,0.6)' }}>{tx}</div>;
            })}
          </div>
        </AbsoluteFill>
      )}
      {s3 > 0 && (
        <AbsoluteFill style={{ opacity: s3 }}>
          <Night red={1}>
            {/* ráfaga: las diez portadas, una tras otra */}
            {frame < montEnd + 2 && (() => {
              const i = Math.max(0, Math.min(9, Math.floor((frame - montA) / MONT)));
              const k = (frame - montA - i * MONT) / MONT;
              const name = COVERS[i + 1][0];
              const rot = (random(`mt${i}`) - 0.5) * 9;
              return (
                <AbsoluteFill style={{ opacity: frame < montA ? 0 : 1 - ramp(frame, montEnd - 2, montEnd + 2) }}>
                  <Img src={bgSrc(name)} style={{ position: 'absolute', inset: 0, width: 1920, height: 1080, objectFit: 'cover', opacity: 0.55 }} />
                  <AbsoluteFill style={{ background: 'rgba(0,0,0,0.35)' }} />
                  <div style={{ position: 'absolute', left: 960 - 300 + (random(`mx${i}`) - 0.5) * 220, top: 540 - 300 + (random(`my${i}`) - 0.5) * 90, transform: `rotate(${rot.toFixed(2)}deg) scale(${(1.14 - 0.14 * Math.min(1, k * 1.6)).toFixed(3)})` }}>
                    <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,0.7)' }}>
                      <CoverArt name={name} size={600} reveal={random(`mz${frame}`) < 0.3 ? 0.18 : 0} />
                    </div>
                  </div>
                  <AbsoluteFill style={{ background: `rgba(255,240,220,${(0.28 * Math.max(0, 1 - k * 3)).toFixed(3)})` }} />
                </AbsoluteFill>
              );
            })()}
            {/* la fila de las diez */}
            {frame >= montEnd - 4 && (
              <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, perspective: 2200 }}>
                {BOOKS10.map((b, i) => {
                  const s = sp(frame, montEnd - 4 + i * 2, 14, 120);
                  const x = 88 + i * 176;
                  const beam = Math.exp(-Math.pow((x + 80 - sweep) / 260, 2));
                  return (
                    <div key={b.n} style={{ position: 'absolute', left: lerp(960 - 80, x, s), top: lerp(460, 150, s) + Math.sin(frame / 24 + i) * 5, opacity: Math.min(1, s * 2),
                      transform: `scale(${lerp(3, 1, s).toFixed(3)}) rotateY(${((i - 4.5) * -5 + (1 - s) * 30).toFixed(2)}deg)`, transformOrigin: '50% 50%' }}>
                      <Cover3D name={COVERS[i + 1][0]} size={160} ry={0} reveal={0} light={0.55 + 0.45 * Math.max(beam, ramp(frame, salirAt + 10, salirAt + 30)) * flicker(frame, `hk${i}`, 0.4)} />
                      <div style={{ textAlign: 'center', marginTop: 10, fontFamily: font.sans, fontWeight: 700, fontSize: 26, color: b.n === 1 ? RED : DIM }}>{b.n}</div>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ position: 'absolute', left: 150, right: 150, top: 440 }}>
              <KWords words={[
                { t: 'Las', at: c.at('F03', 'las') - 3 }, { t: '10', at: tenAt - 2, hi: true }, { t: 'historias', at: c.at('F03', 'historias') - 3 }, { t: 'de', at: c.at('F03', 'de') - 3 },
                { t: 'fantasía', at: c.at('F03', 'fantasía') - 3 }, { t: 'de', at: c.at('F03', 'de', 1) - 3 }, { t: 'las', at: c.at('F03', 'las', 1) - 3 }, { t: 'que', at: c.at('F03', 'que') - 3 },
                { t: 'no', at: c.at('F03', 'no') - 3, hi: true }, { t: 'vas', at: c.at('F03', 'vas') - 3, hi: true }, { t: 'a', at: c.at('F03', 'a') - 3, hi: true },
                { t: 'querer', at: c.at('F03', 'querer') - 3, hi: true }, { t: 'salir', at: salirAt - 3, hi: true },
              ]} size={86} color={BONE} hiColor={color.yellow} align="center" />
            </div>
          </Night>
        </AbsoluteFill>
      )}
      <Sfx name="page_riffle" at={Math.max(2, f1 - 20)} volume={0.45} />
      <Sfx name="riser" at={f2 - 50} volume={0.35} />
      <Sfx name="reverse_swell" at={f2 - 24} volume={0.5} />
      <Sfx name="shimmer" at={f2 - 2} volume={0.55} />
      <Sfx name="whoosh_deep" at={lejos - 20} volume={0.5} />
      <Sfx name="sk_wind" at={f2 + 4} volume={0.35} />
      {Array.from({ length: 10 }).map((_, i) => <Sfx key={`m${i}`} name="tick" at={montA + i * MONT} volume={0.5} />)}
      <Sfx name="whoosh_deep" at={montEnd - 4} volume={0.6} />
      <Sfx name="impact" at={montEnd - 2} volume={0.35} />
      <Sfx name="sparkle" at={salirAt} volume={0.5} />
    </AbsoluteFill>
  );
};

// ——— La investigación (como en Terror v5): muro de las 28 historias candidatas ———
// Las diez elegidas, censuradas; dieciocho descartadas con su portada real (Audible). Seis de ellas, con muy pocas valoraciones
// de oyentes en España (de 1 a 17), llevan el sello «POCAS VALORACIONES». Barrido por 8 plataformas → ficha de SonorBooks
// («Una corte de rosas y espinas», que no está en la lista: nota y opiniones) → contadores → descarte → las diez vuelan a las barras.
type Cand = { k: 'top'; p: number } | { k: 'real'; f: string; few?: boolean };
const CANDS: Cand[] = [
  { k: 'real', f: 'acotar' }, { k: 'top', p: 4 }, { k: 'real', f: 'silmarillion' }, { k: 'real', f: 'juego_tronos', few: true }, { k: 'top', p: 9 }, { k: 'real', f: 'aquiles' }, { k: 'top', p: 1 },
  { k: 'real', f: 'color_magia', few: true }, { k: 'real', f: 'cuervos' }, { k: 'top', p: 6 }, { k: 'real', f: 'amapola' }, { k: 'real', f: 'vampiro' }, { k: 'top', p: 2 }, { k: 'real', f: 'ladron_rayo', few: true },
  { k: 'top', p: 7 }, { k: 'real', f: 'hermanos' }, { k: 'real', f: 'piranesi', few: true }, { k: 'top', p: 10 }, { k: 'real', f: 'terramar' }, { k: 'real', f: 'camino_reyes' }, { k: 'top', p: 3 },
  { k: 'real', f: 'elantris' }, { k: 'real', f: 'crepusculo', few: true }, { k: 'top', p: 5 }, { k: 'real', f: 'valle_lobos' }, { k: 'real', f: 'quinta_estacion', few: true }, { k: 'top', p: 8 }, { k: 'real', f: 'principe_cruel' },
];
const COLS = 7, CW = 140, CH = 182, GX = 24, GY = 18;
const GL = (1920 - (COLS * CW + (COLS - 1) * GX)) / 2, GT = 128;
const cardPos = (i: number) => ({ x: GL + (i % COLS) * (CW + GX), y: GT + Math.floor(i / COLS) * (CH + GY) });
const PLATS = ['Audible', 'Storytel', 'Nextory', 'Podimo', 'BookBeat', 'Apple Books', 'Google Play', 'SonorBooks'];
// barras finales (de la más ligera a la más épica)
const BAR_L = (1920 - (10 * 100 + 9 * 26)) / 2, BAR_BASE = 770;
const barX = (i: number) => BAR_L + i * 126;
const barH = (i: number) => 40 + i * 30;

export const Regla: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('REGLA');
  const f5 = c.part('F05');
  const f7 = c.part('F07');
  const sbAt = c.at('F05', 'SonorBooks');
  const notas = c.at('F05', 'notas');
  const opin = c.at('F05', 'opiniones');
  const miles = c.at('F05', 'miles');
  const xEnd = c.voEnd('F05');
  const princ = CANDS.findIndex((x) => x.k === 'real' && x.f === 'acotar');
  const pp = cardPos(princ);
  // la ficha sale de su tarjeta y vuelve a ella
  const open = ramp(frame, sbAt - 8, sbAt + 14, easeInOut) * (1 - ramp(frame, miles - 4, miles + 16, easeInOut));
  const bw = lerp(CW, 1400, open), bh = lerp(CH, 840, open), bx = lerp(pp.x, 260, open), by = lerp(pp.y, 130, open);
  const view = viewAt(frame, [
    { at: sbAt - 8, cx: 720, cy: 415, z: 1 },
    { at: notas - 8, cx: 800, cy: 349, z: 2.5, dur: 18 },
    { at: opin - 6, cx: 760, cy: 370, z: 1.7, dur: 18 },
  ]);
  // barrido y descarte
  const scan = interpolate(frame, [8, f5 + 60], [-300, 2200], { ...clamp, easing: easeInOut });
  const scan2 = interpolate(frame, [miles + 10, xEnd + 10], [-300, 2200], { ...clamp, easing: easeInOut });
  const stampAt = xEnd - 30;
  const dimAt = xEnd - 6;
  const glowAt = xEnd + 10;
  const flyAt = f7 - 18;
  const camZ = 1 + 0.04 * ramp(frame, 0, flyAt) - 0.04 * ramp(frame, flyAt - 10, flyAt + 20);
  const bubbles = [
    { t: 'Empieza despacio y acaba siendo una montaña rusa', x: 70, y: 620, at: opin - 2, rot: -3 },
    { t: 'La narradora lo hace genial', x: 1260, y: 230, at: opin + 10, rot: 2.5 },
  ];
  const stats = [
    { n: 28, t: 'historias analizadas', at: miles - 4 },
    { n: 8, t: 'plataformas', at: miles + 4 },
    { n: 13000, t: 'valoraciones y opiniones', at: miles + 12, plus: true },
  ];
  const barsOn = ramp(frame, flyAt + 10, flyAt + 30);
  return (
    <AbsoluteFill>
      <Night red={0.7}>
        <AbsoluteFill style={{ transform: `scale(${camZ.toFixed(4)})` }}>
          {/* plataformas consultadas */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 62, display: 'flex', justifyContent: 'center', gap: 14, opacity: 1 - barsOn }}>
            {PLATS.map((pl, k) => {
              const q = sp(frame, 6 + k * 5, 13, 190);
              const lit = Math.max(0, 1 - Math.abs(scan - (300 + k * 190)) / 260);
              return (
                <span key={pl} style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 24, padding: '8px 18px', borderRadius: 999, whiteSpace: 'nowrap',
                  background: pl === 'SonorBooks' ? color.yellow : `rgba(255,255,255,${(0.07 + 0.2 * lit).toFixed(3)})`, color: pl === 'SonorBooks' ? color.ink : BONE,
                  border: '1px solid rgba(255,255,255,0.16)', opacity: Math.min(1, q * 1.4), transform: `translateY(${((1 - q) * -20).toFixed(1)}px)` }}>{pl}</span>
              );
            })}
          </div>
          {/* el muro de candidatas */}
          {CANDS.map((cd, i) => {
            const { x, y } = cardPos(i);
            const order = (i * 11) % 28;
            const q = sp(frame, 2 + order * 1.6, 13, 170);
            const passed = clamp01((scan - x) / 180);
            const top = cd.k === 'top';
            const none = cd.k === 'real' && Boolean(cd.few);
            const dim = top ? 0 : ramp(frame, dimAt + (none ? 0 : 6), dimAt + 20);
            const glow = top ? ramp(frame, glowAt + order * 0.5, glowAt + 14 + order * 0.5) : 0;
            const fly = top ? ramp(frame, flyAt + (cd.p - 1) * 2, flyAt + 26 + (cd.p - 1) * 2, easeInOut) : 0;
            if (top && fly >= 1) return null;
            const hidden = i === princ ? (open > 0.02 ? 0 : 1) : 1;
            const stamp = none ? sp(frame, stampAt + order * 0.7, 11, 220) : 0;
            const shine = Math.max(0, 1 - Math.abs(scan - x - CW / 2) / 90) + Math.max(0, 1 - Math.abs(scan2 - x - CW / 2) / 90) * (top ? 1 : 0.4);
            // vuelo a las barras
            const bi = top ? 10 - (11 - cd.p) : 0; // p=1 (n.º 10) → columna 0
            const tx = top ? lerp(x, barX(bi), fly) : x;
            const ty = top ? lerp(y, BAR_BASE - barH(bi) - 14 - 100, fly) : y;
            const sz = top ? lerp(CW, 100, fly) : CW;
            return (
              <div key={i} style={{ position: 'absolute', left: tx, top: ty, width: sz, opacity: Math.min(1, q * 1.5) * hidden * (1 - 0.72 * dim) * (1 - barsOn * (top ? 0 : 1)),
                transform: `translateY(${((1 - q) * 40).toFixed(1)}px) scale(${(0.85 + 0.15 * q + 0.06 * glow * (1 - fly)).toFixed(3)})`, zIndex: top ? 3 : 1 }}>
                <div style={{ position: 'relative', width: sz, height: sz, borderRadius: 8, overflow: 'hidden',
                  boxShadow: glow > 0 ? `0 0 0 ${(3 * glow).toFixed(1)}px ${color.yellow}, 0 0 ${(40 * glow).toFixed(0)}px rgba(255,202,5,${(0.5 * glow).toFixed(3)})` : '0 12px 30px rgba(0,0,0,0.55)' }}>
                  {top && <CoverArt name={COVERS[cd.p][0]} size={sz} reveal={0} />}
                  {cd.k === 'real' && <Img src={staticFile(`t10f/cand/${cd.f}.jpg`)} style={{ width: sz, height: sz, display: 'block' }} />}
                  {shine > 0 && <div style={{ position: 'absolute', inset: 0, background: `rgba(255,236,190,${(0.28 * shine).toFixed(3)})`, mixBlendMode: 'screen' }} />}
                  {stamp > 0 && (
                    <div style={{ position: 'absolute', left: -10, right: -10, top: sz * 0.38, padding: '6px 0', background: RED, color: '#fff', textAlign: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 15, letterSpacing: 1,
                      transform: `rotate(-12deg) scale(${(1.6 - 0.6 * stamp).toFixed(3)})`, opacity: Math.min(1, stamp * 1.5) }}>POCAS VALORACIONES</div>
                  )}
                </div>
                {/* lectura de la nota: barra que se llena al pasar el barrido (sin cifras inventadas) */}
                {fly < 0.3 && (
                  <div style={{ marginTop: 8, height: 30, display: 'flex', alignItems: 'center', gap: 8, opacity: 1 - fly * 3 }}>
                    <span style={{ fontSize: 18, color: none ? 'rgba(255,255,255,0.35)' : color.yellow, letterSpacing: 1 }}>★</span>
                    <div style={{ flex: 1, height: 7, borderRadius: 4, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                      <div style={{ width: `${(100 * passed * (none ? 0.08 : top ? 0.95 : 0.55 + 0.35 * random(`cr${i}`))).toFixed(1)}%`, height: '100%', background: top ? color.yellow : 'rgba(239,232,220,0.55)', borderRadius: 4 }} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {/* la ficha de SonorBooks sale de su tarjeta */}
          {open > 0.01 && (
            <div style={{ position: 'absolute', left: bx, top: by, zIndex: 5 }}>
              <Browser page={PAGES.acotar} w={bw} h={bh} view={view} overlay={<Ring x={712} y={334} w={172} h={28} at={notas - 2} out={miles} />} />
            </div>
          )}
          {open > 0.5 && bubbles.map((bb, k) => {
            const q = sp(frame, bb.at, 12, 170) * Math.min(1, open * 2 - 1);
            if (q <= 0.001) return null;
            return (
              <div key={k} style={{ position: 'absolute', left: bb.x, top: bb.y, maxWidth: 600, padding: '22px 30px', borderRadius: '26px 26px 26px 6px', background: '#fff', color: color.ink, boxShadow: '0 30px 80px rgba(0,0,0,0.55)', zIndex: 6,
                opacity: Math.min(1, q * 1.5), transform: `translateY(${((1 - q) * 40 + Math.sin(frame / 30 + k) * 5).toFixed(1)}px) scale(${(0.8 + 0.2 * q).toFixed(3)}) rotate(${(bb.rot * q).toFixed(2)}deg)` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: font.sans, fontWeight: 700, fontSize: 20, letterSpacing: 3, textTransform: 'uppercase', color: '#8a8a8a' }}>
                  <span style={{ fontFamily: font.serif, color: color.yellow, fontSize: 44, lineHeight: 0.6, letterSpacing: 0 }}>“</span> Lo que dicen los oyentes
                </div>
                <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 38, lineHeight: 1.2, marginTop: 10 }}>{bb.t}</div>
              </div>
            );
          })}
          {/* contadores */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 955, display: 'flex', justifyContent: 'center', gap: 26, opacity: 1 - barsOn, zIndex: 4 }}>
            {stats.map((st) => {
              const q = sp(frame, st.at, 13, 180);
              return (
                <div key={st.t} style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '14px 26px', borderRadius: 16, background: 'rgba(10,11,13,0.9)', border: '1px solid rgba(255,255,255,0.14)',
                  opacity: Math.min(1, q * 1.4), transform: `translateY(${((1 - q) * 30).toFixed(1)}px)` }}>
                  <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 46, color: color.yellow }}>{st.plus ? 'Más de ' : ''}{countTo(frame, st.at, 34, st.n, 0)}</span>
                  <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 28, color: BONE }}>{st.t}</span>
                </div>
              );
            })}
          </div>
          {/* las barras */}
          {barsOn > 0 && (
            <AbsoluteFill style={{ opacity: barsOn }}>
              {Array.from({ length: 10 }).map((_, i) => {
                const n = 10 - i;
                const red = i / 9; // de violeta a oro
                const grow = sp(frame, flyAt + 14 + i * 3, 13, 140);
                const hh = barH(i) * grow;
                return (
                  <React.Fragment key={i}>
                    <div style={{ position: 'absolute', left: barX(i), top: BAR_BASE - hh, width: 100, height: hh, borderRadius: 12,
                      background: `rgba(${Math.round(110 + 122 * red)}, ${Math.round(90 + 90 * red)}, ${Math.round(220 - 160 * red)}, ${0.5 + 0.5 * red})`, boxShadow: n === 1 ? '0 0 50px rgba(255,202,5,0.55)' : undefined }} />
                    <div style={{ position: 'absolute', left: barX(i), top: BAR_BASE - hh - 114, width: 100, height: 100, borderRadius: 8, overflow: 'hidden', boxShadow: '0 10px 24px rgba(0,0,0,0.6)', opacity: ramp(frame, flyAt + 26 + i * 2, flyAt + 28 + i * 2) }}>
                      <CoverArt name={COVERS[11 - n][0]} size={100} reveal={0} />
                    </div>
                    <span style={{ position: 'absolute', left: barX(i), top: BAR_BASE + 16, width: 100, textAlign: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 48, color: n === 1 ? RED : BONE }}>{n}</span>
                  </React.Fragment>
                );
              })}
              <div style={{ position: 'absolute', left: 0, right: 0, top: 880 }}><MaskTitle text="De la más ligera a la más épica" at={f7} size={72} color={BONE} align="center" /></div>
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      </Night>
      {Array.from({ length: 8 }).map((_, k) => <Sfx key={`c${k}`} name="tick" at={6 + k * 5} volume={0.35} />)}
      <Sfx name="riser" at={f5 - 20} volume={0.25} />
      <Sfx name="whoosh_soft" at={sbAt - 8} volume={0.6} />
      <Sfx name="zoom_in" at={notas - 8} volume={0.5} />
      <Sfx name="snap_in" at={notas} volume={0.6} />
      {bubbles.map((bb, k) => <Sfx key={k} name="ui_pop" at={bb.at + 1} volume={0.6} />)}
      <Sfx name="whoosh_soft" at={miles - 4} volume={0.5} />
      <Sfx name="counter" at={miles - 2} volume={0.4} />
      <Sfx name="stamp" at={stampAt + 2} volume={0.5} />
      <Sfx name="shimmer" at={glowAt} volume={0.4} />
      <Sfx name="whoosh_deep" at={flyAt} volume={0.55} />
      <Sfx name="riser" at={f7 - 10} volume={0.35} />
    </AbsoluteFill>
  );
};
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));


