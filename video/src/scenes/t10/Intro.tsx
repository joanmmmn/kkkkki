import React from 'react';
import { AbsoluteFill, interpolate, random, spring, staticFile, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { Logo } from '../../components/Logo';
import { MaskTitle } from '../nxr/kit';
import { BONE, BOOKS10, DIM, Flashlight, KickerN, Night, RED, color, flicker, font } from './kit';
import { Img } from 'remotion';
import { COVERS, Cover3D, CoverArt, bgSrc, countTo, KWords, shakes } from './fx';
import { Browser, PAGES, Ring, viewAt } from './web';
import { sceneClock } from './timeline';

const fps = 50;
const sp = (frame: number, at: number, d = 15, s = 170) => spring({ frame: frame - at, fps, config: { damping: d, stiffness: s } });
const ramp = (frame: number, a: number, b: number, ez = easeInOut) => interpolate(frame, [a, b], [0, 1], { ...clamp, easing: ez });
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Silueta de alguien tumbado en la cama (plana, genérica). v4: sin auriculares (la entrada habla de historias, no de audiolibros).
const Sleeper: React.FC<{ glow: number; eyes: number; w?: number; phones?: boolean }> = ({ glow, eyes, w = 900, phones = false }) => (
  <svg width={w} height={w * 0.5} viewBox="0 0 900 450" style={{ overflow: 'visible' }}>
    <rect x="40" y="300" width="820" height="40" rx="10" fill="#1E2128" />
    <rect x="40" y="340" width="20" height="90" fill="#0C0D10" /><rect x="840" y="340" width="20" height="90" fill="#0C0D10" />
    <rect x="60" y="250" width="200" height="60" rx="26" fill="#323846" />
    <path d="M220 300 Q 420 200 820 260 L820 305 L220 305 Z" fill="#2A2F3A" />
    <circle cx="190" cy="226" r="54" fill="#0A0B0D" />
    {phones && (<>
      <path d="M140 210 a50 50 0 0 1 100 0" stroke={`rgba(255,202,5,${0.35 + 0.65 * glow})`} strokeWidth="12" fill="none" />
      <rect x="128" y="206" width="22" height="40" rx="9" fill={`rgba(255,202,5,${0.35 + 0.65 * glow})`} />
      <rect x="230" y="206" width="22" height="40" rx="9" fill={`rgba(255,202,5,${0.35 + 0.65 * glow})`} />
      <circle cx="190" cy="226" r={110} fill={`rgba(255,202,5,${0.12 * glow})`} />
    </>)}
    <circle cx="190" cy="226" r={90} fill={`rgba(190,210,255,${(0.06 * eyes).toFixed(3)})`} />
    <ellipse cx="176" cy="222" rx="6" ry={6 * eyes} fill="#F2F2F2" /><ellipse cx="206" cy="222" rx="6" ry={6 * eyes} fill="#F2F2F2" />
  </svg>
);

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('HOOK');
  const f1 = c.part('X01');
  const f2 = c.part('X02');
  const f3 = c.part('X03');
  const lightOff = c.at('X02', 'apagas');
  const sleepAt = c.at('X02', 'dormir');
  const tenAt = c.at('X03', 'diez');
  const verdadAt = c.at('X03', 'verdad');
  const MONT = 5;
  const montA = f3 - 6;
  const montEnd = montA + MONT * 10;
  const sweep = interpolate(frame, [montEnd + 10, verdadAt + 30], [-200, 2100], { ...clamp, easing: easeInOut });
  // 1: la linterna recorre una estantería oscura. 2: alguien en la cama apaga la luz y no puede dormir. 3: las diez historias (censuradas).
  const s2 = ramp(frame, f2 - 8, f2 + 14);
  const s3 = ramp(frame, f3 - 8, f3 - 6); // corte seco a la ráfaga de portadas
  const lampOn = (1 - ramp(frame, lightOff, lightOff + 4)) * (frame > lightOff - 40 && frame < lightOff ? flicker(frame, 'lamp', 2.2) : 1);
  const eyes = ramp(frame, sleepAt - 2, sleepAt + 6, easeOut);
  const sweepX = interpolate(frame, [f1 - 30, f2], [200, 1700], { ...clamp, easing: easeInOut });
  return (
    <AbsoluteFill style={{ background: '#040405' }}>
      {s2 < 1 && (
        <AbsoluteFill style={{ opacity: 1 - s2 }}>
          <Night red={0.5}>
            <AbsoluteFill style={{ transform: `scale(1.12) translateX(${interpolate(frame, [0, f2], [70, -70], clamp).toFixed(1)}px)` }}>
            <div style={{ position: 'absolute', left: 160, top: 260, display: 'flex', gap: 12, alignItems: 'flex-end' }}>
              {Array.from({ length: 26 }).map((_, i) => {
                const b = BOOKS10[i % 10];
                const h = 380 + ((i * 37) % 90);
                return <div key={i} style={{ width: 52 + ((i * 13) % 22), height: h, background: b.bg, borderRadius: 3, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.3)', filter: 'brightness(0.9)' }} />;
              })}
            </div>
            <div style={{ position: 'absolute', left: 120, right: 120, top: 700, height: 22, background: '#1A1310' }} />
            </AbsoluteFill>
            <Flashlight x={sweepX} y={480} r={360} on={ramp(frame, f1 - 40, f1 - 20)} seed="hook1" />
            <div style={{ position: 'absolute', left: 0, right: 0, top: 820, textAlign: 'center' }}>
              <MaskTitle text="Hay historias que asustan." at={f1} size={92} color={BONE} align="center" />
            </div>
          </Night>
        </AbsoluteFill>
      )}
      {s2 > 0 && s3 < 1 && (
        <AbsoluteFill style={{ opacity: s2 * (1 - s3) }}>
          <Night red={0.4} dust={false}>
            <AbsoluteFill style={{ transform: `scale(${(1 + 0.14 * ramp(frame, f2 - 8, f3, easeInOut)).toFixed(4)})`, transformOrigin: '30% 80%' }}>
            <div style={{ position: 'absolute', left: 1320, top: 120, width: 380, height: 460, background: 'linear-gradient(180deg, #1C2436, #10141E)', boxShadow: 'inset 0 0 0 14px #08090B' }}>
              <div style={{ position: 'absolute', left: 230, top: 60, width: 80, height: 80, borderRadius: '50%', background: '#E6EEF8', boxShadow: '0 0 60px rgba(220,235,255,0.7)' }} />
            </div>
            <div style={{ position: 'absolute', left: 360, top: 440, width: 1100, height: 520, background: 'radial-gradient(ellipse at 70% 40%, rgba(170,195,240,0.16), rgba(0,0,0,0) 65%)', transform: 'skewX(-18deg)', filter: 'blur(28px)' }} />
            <div style={{ position: 'absolute', left: 260, top: 520 }}><Sleeper glow={0.4 + 0.6 * (1 - lampOn)} eyes={eyes} /></div>
            <div style={{ position: 'absolute', left: 140, top: 160, width: 70, height: 110, opacity: lampOn }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: 70, height: 50, borderRadius: '40px 40px 6px 6px', background: '#F2DCA8', boxShadow: '0 0 120px 60px rgba(255,214,140,0.35)' }} />
              <div style={{ position: 'absolute', left: 31, top: 50, width: 8, height: 60, background: '#2A2420' }} />
            </div>
            <AbsoluteFill style={{ background: `rgba(0,0,0,${0.55 * (1 - lampOn)})` }} />
            </AbsoluteFill>
            <div style={{ position: 'absolute', left: 1000, top: 700, width: 840 }}>
              {['Cuando apagas la luz…', 'siguen ahí.', 'Y no te dejan dormir.'].map((t, i) => {
                const a = [c.at('X02', 'cuando') - 4, c.at('X02', 'siguen') - 4, sleepAt - 10][i];
                const s = sp(frame, a, 15, 180);
                return <div key={t} style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 54, color: i === 2 ? color.yellow : BONE, opacity: s, transform: `translateX(${(1 - s) * 40}px)`, marginBottom: 10 }}>{t}</div>;
              })}
            </div>
          </Night>
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
                    <div key={b.n} style={{ position: 'absolute', left: lerp(960 - 80, x, s), top: lerp(460, 170, s) + Math.sin(frame / 24 + i) * 5, opacity: Math.min(1, s * 2),
                      transform: `scale(${lerp(3, 1, s).toFixed(3)}) rotateY(${((i - 4.5) * -5 + (1 - s) * 30).toFixed(2)}deg)`, transformOrigin: '50% 50%' }}>
                      <Cover3D name={COVERS[i + 1][0]} size={160} ry={0} reveal={0} light={0.55 + 0.45 * Math.max(beam, ramp(frame, verdadAt + 10, verdadAt + 30)) * flicker(frame, `hk${i}`, 0.4)} />
                      <div style={{ textAlign: 'center', marginTop: 10, fontFamily: font.sans, fontWeight: 700, fontSize: 26, color: b.n === 1 ? RED : DIM }}>{b.n}</div>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ position: 'absolute', left: 160, right: 160, top: 470 }}>
              <KWords words={[
                { t: 'Las', at: c.at('X03', 'las') - 3 }, { t: '10', at: tenAt - 2, hi: true }, { t: 'historias', at: c.at('X03', 'historias') - 3 }, { t: 'de', at: c.at('X03', 'de') - 3 }, { t: 'terror', at: c.at('X03', 'terror') - 3 },
                { t: 'que', at: c.at('X03', 'que') - 3 }, { t: 'dan', at: c.at('X03', 'dan') - 3 }, { t: 'miedo', at: c.at('X03', 'miedo') - 3 }, { t: 'de', at: verdadAt - 8, hi: true }, { t: 'verdad', at: verdadAt - 3, hi: true },
              ]} size={92} color={BONE} hiColor={color.yellow} align="center" />
            </div>
          </Night>
        </AbsoluteFill>
      )}
      <Sfx name="sk_wind" at={2} volume={0.5} />
      <Sfx name="click" at={f1 - 40} volume={0.7} />
      <Sfx name="whoosh_deep" at={f2 - 4} volume={0.5} />
      <Sfx name="click" at={lightOff} volume={0.9} />
      <Sfx name="sk_heart" at={sleepAt} volume={0.8} />
      {Array.from({ length: 10 }).map((_, i) => <Sfx key={`m${i}`} name="tick" at={montA + i * MONT} volume={0.5} />)}
      <Sfx name="whoosh_deep" at={montEnd - 4} volume={0.6} />
      <Sfx name="impact" at={montEnd - 2} volume={0.35} />
      <Sfx name="impact" at={verdadAt} volume={0.4} />
    </AbsoluteFill>
  );
};

// Cabecera de la serie: «LOS 10 MEJORES · TERROR».
export const Serie: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('SERIE');
  const f0 = c.part('X04');
  const hoy = c.at('X04', 'terror') - 6;
  const s = sp(frame, f0 - 2, 18, 120);
  const ten = sp(frame, f0 + 6, 12, 160);
  const t = ramp(frame, hoy, hoy + 10, easeOut);
  const ringIn = ramp(frame, f0 - 6, f0 + 40, easeOut);
  const ang = frame * 0.32 + (1 - ringIn) * 90;
  const hit = shakes(frame, [{ at: hoy + 8, amp: 18, dur: 18 }], 'serie');
  const red = interpolate(frame, [hoy + 6, hoy + 8, hoy + 26], [0, 1, 0], clamp);
  return (
    <AbsoluteFill>
      <Night red={0.6 + 0.6 * t}>
        {/* anillo de portadas girando al fondo */}
        <AbsoluteFill style={{ perspective: 1500, opacity: 0.85 * ringIn }}>
          <div style={{ position: 'absolute', left: 960 - 130, top: 540 - 130, width: 260, height: 260, transformStyle: 'preserve-3d', transform: `translateZ(-760px) rotateX(-12deg) rotateY(${ang.toFixed(2)}deg)` }}>
            {BOOKS10.map((b, i) => {
              const a = (i * 36 + ang) % 360;
              const front = Math.cos((a * Math.PI) / 180);
              return (
                <div key={b.n} style={{ position: 'absolute', inset: 0, transform: `rotateY(${i * 36}deg) translateZ(900px)`, backfaceVisibility: 'hidden' }}>
                  <CoverArt name={COVERS[11 - b.n][0]} size={260} reveal={0} radius={8} light={0.6 + 0.4 * Math.max(0, front)} />
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
        <AbsoluteFill style={{ background: 'radial-gradient(ellipse 900px 420px at 50% 47%, rgba(5,5,6,0.82) 0%, rgba(5,5,6,0.5) 55%, rgba(5,5,6,0) 100%)' }} />
        {red > 0 && <AbsoluteFill style={{ background: `rgba(193,18,31,${(0.25 * red).toFixed(3)})` }} />}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 210, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `translate(${hit.x.toFixed(1)}px, ${hit.y.toFixed(1)}px)` }}>
          <div style={{ opacity: s }}><Logo size={70} delay={0} dark /></div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 30, marginTop: 40, opacity: s, transform: `scale(${0.92 + 0.08 * s})` }}>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 120, color: BONE, letterSpacing: -4 }}>Los</span>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 250, color: color.yellow, letterSpacing: -12, lineHeight: 0.9, transform: `scale(${0.6 + 0.4 * ten})`, display: 'inline-block' }}>10</span>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 120, color: BONE, letterSpacing: -4 }}>mejores</span>
          </div>
          <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 40, color: DIM, marginTop: 20, opacity: ramp(frame, c.at('X04', 'episodio') - 6, c.at('X04', 'episodio') + 12) }}>
            Los diez mejores libros de un género. Y la voz con la que escucharlos.
          </div>
          <div style={{ marginTop: 54, padding: '14px 56px', borderRadius: 14, background: RED, fontFamily: font.sans, fontWeight: 700, fontSize: 92, letterSpacing: 16, color: '#fff',
            opacity: t * flicker(frame, 'terror', 0.7), transform: `scale(${1.25 - 0.25 * t})`, boxShadow: `0 0 ${80 * t}px rgba(193,18,31,0.55)` }}>TERROR</div>
        </div>
      </Night>
      <Sfx name="logo_sting" at={f0} volume={0.6} />
      <Sfx name="bass_drop" at={hoy + 6} volume={0.8} />
    </AbsoluteFill>
  );
};

// La regla de la serie y por qué escucharlo.
// ——— La investigación (v5, Joan 15/10: «una animación más trabajada donde se vea toda la investigación», sin rótulo arriba) ———
// Muro de las 28 historias candidatas: las diez elegidas, censuradas; doce con audiolibro en español (portada real de Audible);
// seis sin audiolibro en español (tachadas). Barrido por 8 plataformas → ficha de SonorBooks (nota y opiniones) → contadores
// → descarte → las diez vuelan a las barras de «de menos a más miedo».
type Cand = { k: 'top'; p: number } | { k: 'real'; f: string } | { k: 'none'; t: string; a: string };
const CANDS: Cand[] = [
  { k: 'real', f: 'misery' }, { k: 'top', p: 4 }, { k: 'none', t: 'Cementerio de animales', a: 'Stephen King' }, { k: 'real', f: 'frankenstein' }, { k: 'top', p: 9 }, { k: 'real', f: 'cosas_fuego' }, { k: 'top', p: 1 },
  { k: 'none', t: 'La semilla del diablo', a: 'Ira Levin' }, { k: 'real', f: 'riada' }, { k: 'top', p: 6 }, { k: 'real', f: 'principe' }, { k: 'real', f: 'carrie' }, { k: 'top', p: 2 }, { k: 'none', t: 'Soy leyenda', a: 'Richard Matheson' },
  { k: 'top', p: 7 }, { k: 'real', f: 'cadaver' }, { k: 'none', t: 'La maldición de Hill House', a: 'Shirley Jackson' }, { k: 'top', p: 10 }, { k: 'real', f: 'vampiro' }, { k: 'real', f: 'doctor_sueno' }, { k: 'top', p: 3 },
  { k: 'real', f: 'chica_al_lado' }, { k: 'none', t: 'A ciegas', a: 'Josh Malerman' }, { k: 'top', p: 5 }, { k: 'real', f: 'cavendish' }, { k: 'none', t: 'La casa infernal', a: 'Richard Matheson' }, { k: 'top', p: 8 }, { k: 'real', f: 'hombre_arena' },
];
const COLS = 7, CW = 140, CH = 182, GX = 24, GY = 18;
const GL = (1920 - (COLS * CW + (COLS - 1) * GX)) / 2, GT = 128;
const cardPos = (i: number) => ({ x: GL + (i % COLS) * (CW + GX), y: GT + Math.floor(i / COLS) * (CH + GY) });
const PLATS = ['Audible', 'Storytel', 'Nextory', 'Podimo', 'BookBeat', 'Apple Books', 'Google Play', 'SonorBooks'];
// barras finales (de menos a más miedo)
const BAR_L = (1920 - (10 * 100 + 9 * 26)) / 2, BAR_BASE = 770;
const barX = (i: number) => BAR_L + i * 126;
const barH = (i: number) => 40 + i * 30;

export const Regla: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('REGLA');
  const f5 = c.part('X05');
  const f7 = c.part('X07');
  const sbAt = c.at('X05', 'SonorBooks');
  const notas = c.at('X05', 'notas');
  const opin = c.at('X05', 'opiniones');
  const miles = c.at('X05', 'miles');
  const xEnd = c.voEnd('X05');
  const princ = CANDS.findIndex((x) => x.k === 'real' && x.f === 'principe');
  const pp = cardPos(princ);
  // la ficha sale de su tarjeta y vuelve a ella
  const open = ramp(frame, sbAt - 8, sbAt + 14, easeInOut) * (1 - ramp(frame, miles - 4, miles + 16, easeInOut));
  const bw = lerp(CW, 1400, open), bh = lerp(CH, 840, open), bx = lerp(pp.x, 260, open), by = lerp(pp.y, 130, open);
  const view = viewAt(frame, [
    { at: sbAt - 8, cx: 720, cy: 415, z: 1 },
    { at: notas - 8, cx: 800, cy: 300, z: 2.5, dur: 18 },
    { at: opin - 6, cx: 760, cy: 330, z: 1.7, dur: 18 },
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
    { t: 'Es como ver una película con los ojos cerrados', x: 70, y: 620, at: opin - 2, rot: -3 },
    { t: 'Cambia de voz para cada personaje', x: 1260, y: 230, at: opin + 10, rot: 2.5 },
  ];
  const stats = [
    { n: 28, t: 'historias analizadas', at: miles - 4 },
    { n: 8, t: 'plataformas', at: miles + 4 },
    { n: 3000, t: 'valoraciones y opiniones', at: miles + 12, plus: true },
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
            const none = cd.k === 'none';
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
                  {cd.k === 'real' && <Img src={staticFile(`t10/cand/${cd.f}.jpg`)} style={{ width: sz, height: sz, display: 'block' }} />}
                  {none && (
                    <div style={{ width: sz, height: sz, background: 'linear-gradient(160deg, #2a2b30, #15161a)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 14, boxSizing: 'border-box' }}>
                      <div style={{ fontFamily: font.serif, fontSize: 21, lineHeight: 1.1, color: BONE }}>{cd.t}</div>
                      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase', color: DIM, marginTop: 8 }}>{cd.a}</div>
                    </div>
                  )}
                  {shine > 0 && <div style={{ position: 'absolute', inset: 0, background: `rgba(255,236,190,${(0.28 * shine).toFixed(3)})`, mixBlendMode: 'screen' }} />}
                  {stamp > 0 && (
                    <div style={{ position: 'absolute', left: -10, right: -10, top: sz * 0.38, padding: '6px 0', background: RED, color: '#fff', textAlign: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 15, letterSpacing: 1,
                      transform: `rotate(-12deg) scale(${(1.6 - 0.6 * stamp).toFixed(3)})`, opacity: Math.min(1, stamp * 1.5) }}>SIN AUDIO EN ESPAÑOL</div>
                  )}
                </div>
                {/* lectura de la nota: barra que se llena al pasar el barrido (sin cifras inventadas) */}
                {fly < 0.3 && (
                  <div style={{ marginTop: 8, height: 30, display: 'flex', alignItems: 'center', gap: 8, opacity: 1 - fly * 3 }}>
                    <span style={{ fontSize: 18, color: none ? 'rgba(255,255,255,0.25)' : color.yellow, letterSpacing: 1 }}>{none ? '—' : '★'}</span>
                    <div style={{ flex: 1, height: 7, borderRadius: 4, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                      <div style={{ width: `${(none ? 0 : 100 * passed * (top ? 0.95 : 0.55 + 0.35 * random(`cr${i}`))).toFixed(1)}%`, height: '100%', background: top ? color.yellow : 'rgba(239,232,220,0.55)', borderRadius: 4 }} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {/* la ficha de SonorBooks sale de su tarjeta */}
          {open > 0.01 && (
            <div style={{ position: 'absolute', left: bx, top: by, zIndex: 5 }}>
              <Browser page={PAGES.principe} w={bw} h={bh} view={view} overlay={<Ring x={712} y={284} w={178} h={26} at={notas - 2} out={miles} />} />
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
                const red = i / 9;
                const grow = sp(frame, flyAt + 14 + i * 3, 13, 140);
                const hh = barH(i) * grow;
                return (
                  <React.Fragment key={i}>
                    <div style={{ position: 'absolute', left: barX(i), top: BAR_BASE - hh, width: 100, height: hh, borderRadius: 12,
                      background: `rgba(${Math.round(80 + 113 * red)}, ${Math.round(80 - 62 * red)}, ${Math.round(80 - 49 * red)}, ${0.5 + 0.5 * red})`, boxShadow: n === 1 ? '0 0 40px rgba(193,18,31,0.6)' : undefined }} />
                    <div style={{ position: 'absolute', left: barX(i), top: BAR_BASE - hh - 114, width: 100, height: 100, borderRadius: 8, overflow: 'hidden', boxShadow: '0 10px 24px rgba(0,0,0,0.6)', opacity: ramp(frame, flyAt + 26 + i * 2, flyAt + 28 + i * 2) }}>
                      <CoverArt name={COVERS[11 - n][0]} size={100} reveal={0} />
                    </div>
                    <span style={{ position: 'absolute', left: barX(i), top: BAR_BASE + 16, width: 100, textAlign: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 48, color: n === 1 ? RED : BONE }}>{n}</span>
                  </React.Fragment>
                );
              })}
              <div style={{ position: 'absolute', left: 0, right: 0, top: 880 }}><MaskTitle text="De menos a más miedo" at={f7} size={72} color={BONE} align="center" /></div>
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


