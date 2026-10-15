import React from 'react';
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { Sfx } from '../../components/Sfx';
import { Logo } from '../../components/Logo';
import { MaskTitle } from '../nxr/kit';
import { BONE, BOOKS10, DIM, Flashlight, KickerN, Night, RED, color, flicker, font } from './kit';
import { Img } from 'remotion';
import { COVERS, Cover3D, coverSrc, bgSrc, KWords, sceneLevel, shakes, VoiceBars } from './fx';
import { sceneClock } from './timeline';

const fps = 50;
const sp = (frame: number, at: number, d = 15, s = 170) => spring({ frame: frame - at, fps, config: { damping: d, stiffness: s } });
const ramp = (frame: number, a: number, b: number, ez = easeInOut) => interpolate(frame, [a, b], [0, 1], { ...clamp, easing: ez });
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Silueta de alguien tumbado en la cama con auriculares (plana, genérica).
const Sleeper: React.FC<{ glow: number; eyes: number; w?: number }> = ({ glow, eyes, w = 900 }) => (
  <svg width={w} height={w * 0.5} viewBox="0 0 900 450" style={{ overflow: 'visible' }}>
    <rect x="40" y="300" width="820" height="40" rx="10" fill="#1E2128" />
    <rect x="40" y="340" width="20" height="90" fill="#0C0D10" /><rect x="840" y="340" width="20" height="90" fill="#0C0D10" />
    <rect x="60" y="250" width="200" height="60" rx="26" fill="#323846" />
    <path d="M220 300 Q 420 200 820 260 L820 305 L220 305 Z" fill="#2A2F3A" />
    <circle cx="190" cy="226" r="54" fill="#0A0B0D" />
    <path d="M140 210 a50 50 0 0 1 100 0" stroke={`rgba(255,202,5,${0.35 + 0.65 * glow})`} strokeWidth="12" fill="none" />
    <rect x="128" y="206" width="22" height="40" rx="9" fill={`rgba(255,202,5,${0.35 + 0.65 * glow})`} />
    <rect x="230" y="206" width="22" height="40" rx="9" fill={`rgba(255,202,5,${0.35 + 0.65 * glow})`} />
    <circle cx="190" cy="226" r={110} fill={`rgba(255,202,5,${0.12 * glow})`} />
    <ellipse cx="176" cy="222" rx="6" ry={6 * eyes} fill="#F2F2F2" /><ellipse cx="206" cy="222" rx="6" ry={6 * eyes} fill="#F2F2F2" />
  </svg>
);

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('HOOK');
  const f1 = c.part('X01');
  const f2 = c.part('X02');
  const f3 = c.part('X03');
  const lightOff = c.at('X02', 'apagada');
  const sleepAt = c.at('X02', 'dormir');
  const tenAt = c.at('X03', 'diez');
  const voiceAt = c.at('X03', 'voz');
  const verdadAt = c.at('X03', 'verdad');
  const MONT = 5;
  const montA = f3 - 6;
  const montEnd = montA + MONT * 10;
  const sweep = interpolate(frame, [montEnd + 10, verdadAt + 30], [-200, 2100], { ...clamp, easing: easeInOut });
  // 1: la linterna recorre una estantería oscura. 2: alguien escucha en la cama y se apaga la luz. 3: los diez libros.
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
              <MaskTitle text="Hay libros que asustan." at={f1} size={92} color={BONE} align="center" />
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
              {['De noche.', 'Con auriculares.', 'Con la luz apagada.'].map((t, i) => {
                const a = [c.at('X02', 'noche'), c.at('X02', 'auriculares'), lightOff - 6][i];
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
                    <Img src={coverSrc(name)} style={{ width: 600, height: 600, borderRadius: 12, display: 'block', boxShadow: '0 40px 120px rgba(0,0,0,0.7)' }} />
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
                      <Cover3D name={COVERS[i + 1][0]} size={160} ry={0} light={0.55 + 0.45 * Math.max(beam, ramp(frame, voiceAt, voiceAt + 20)) * flicker(frame, `hk${i}`, 0.4)} />
                      <div style={{ textAlign: 'center', marginTop: 10, fontFamily: font.sans, fontWeight: 700, fontSize: 26, color: b.n === 1 ? RED : DIM }}>{b.n}</div>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ position: 'absolute', left: 160, right: 160, top: 470 }}>
              <KWords words={[
                { t: 'Los', at: tenAt - 10 }, { t: '10', at: tenAt - 2, hi: true }, { t: 'libros', at: c.at('X03', 'libros') - 3 }, { t: 'de', at: c.at('X03', 'de') - 3 }, { t: 'terror', at: c.at('X03', 'terror') - 3 },
                { t: 'que', at: c.at('X03', 'que') - 3 }, { t: 'dan', at: c.at('X03', 'dan') - 3 }, { t: 'miedo', at: c.at('X03', 'miedo') - 3 }, { t: 'de', at: verdadAt - 8, hi: true }, { t: 'verdad', at: verdadAt - 3, hi: true },
              ]} size={92} color={BONE} hiColor={color.yellow} align="center" />
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 760, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 34, opacity: ramp(frame, voiceAt - 6, voiceAt + 10) }}>
              <VoiceBars level={(f) => sceneLevel('HOOK', f)} w={420} h={90} n={30} />
              <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 54, color: color.yellow }}>y la voz con la que escucharlos</span>
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
      <Sfx name="shimmer" at={voiceAt - 4} volume={0.4} />
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
          <div style={{ position: 'absolute', left: 960 - 130, top: 540 - 130, width: 260, height: 260, transformStyle: 'preserve-3d', transform: `translateZ(-1000px) rotateX(-6deg) rotateY(${ang.toFixed(2)}deg)` }}>
            {BOOKS10.map((b, i) => {
              const a = (i * 36 + ang) % 360;
              const front = Math.cos((a * Math.PI) / 180);
              return (
                <div key={b.n} style={{ position: 'absolute', inset: 0, transform: `rotateY(${i * 36}deg) translateZ(900px)`, backfaceVisibility: 'hidden' }}>
                  <Img src={coverSrc(COVERS[11 - b.n][0])} style={{ width: 260, height: 260, borderRadius: 8, display: 'block', filter: `brightness(${(0.4 + 0.55 * Math.max(0, front)).toFixed(3)})` }} />
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
        <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(5,5,6,0.78) 0%, rgba(5,5,6,0.45) 40%, rgba(5,5,6,0) 70%)' }} />
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
export const Regla: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('REGLA');
  const f5 = c.part('X05');
  const f6 = c.part('X06');
  const f7 = c.part('X07');
  const rules = [
    { t: '10 libros con fama de quitar el sueño', at: c.at('X05', 'diez') - 6 },
    { t: 'La narración en español que hay que escuchar', at: c.at('X05', 'narración') - 6 },
    { t: 'Elegida por las notas y opiniones de los oyentes', at: c.at('X05', 'elegida') - 6 },
  ];
  const s6 = ramp(frame, f6 - 8, f6 + 10);
  const s7 = ramp(frame, f7 - 8, f7 + 10);
  const beats = [
    { t: 'el ritmo', at: c.at('X06', 'ritmo') - 4 },
    { t: 'los silencios', at: c.at('X06', 'silencios') - 4 },
    { t: 'el susurro', at: c.at('X06', 'susurro') - 4 },
  ];
  const golpe = c.at('X06', 'golpe');
  const quiet = ramp(frame, beats[1].at, beats[1].at + 10) * (1 - ramp(frame, beats[2].at, beats[2].at + 6));
  const hit = interpolate(frame, [golpe - 2, golpe + 2, golpe + 18], [0, 1, 0], clamp);
  const sh = shakes(frame, [{ at: golpe, amp: 20, dur: 18 }], 'golpe');
  const drift = `scale(${(1.0 + 0.03 * ramp(frame, 0, c.dur)).toFixed(4)})`;
  return (
    <AbsoluteFill>
      <Night red={0.7}>
        <AbsoluteFill style={{ transform: drift }}>
        {s6 < 1 && (
          <div style={{ position: 'absolute', left: 150, top: 0, height: 1080, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 30, opacity: 1 - s6 }}>
            <KickerN at={f5} text="La regla" />
            {rules.map((r, i) => {
              const s = sp(frame, r.at, 15, 170);
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 30, opacity: s, transform: `translateX(${(1 - s) * 60}px)` }}>
                  <span style={{ width: 84, height: 84, borderRadius: '50%', background: color.yellow, color: color.ink, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 44 }}>{i + 1}</span>
                  <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 64, color: BONE, letterSpacing: -1 }}>{r.t}</span>
                </div>
              );
            })}
          </div>
        )}
        {s6 > 0 && s7 < 1 && (
          <AbsoluteFill style={{ opacity: s6 * (1 - s7), alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 56, color: DIM, marginBottom: 40 }}>En el terror, la voz lo cambia todo</div>
            <div style={{ transform: `scale(${(1 + 0.25 * hit).toFixed(3)}) translate(${sh.x.toFixed(1)}px, ${sh.y.toFixed(1)}px)` }}><VoiceBars level={(f) => sceneLevel('REGLA', f) * (1 + 0.5 * interpolate(f, [golpe - 2, golpe + 2, golpe + 18], [0, 1, 0], clamp))} w={1300} h={240} n={64} step={1} c={hit > 0.1 ? RED : color.yellow} /></div>
            <div style={{ display: 'flex', gap: 60, marginTop: 50 }}>
              {beats.map((b) => { const s = sp(frame, b.at, 15, 170); return <span key={b.t} style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 60, color: BONE, opacity: s, transform: `translateY(${(1 - s) * 20}px)` }}>{b.t}</span>; })}
            </div>
          </AbsoluteFill>
        )}
        {s7 > 0 && (
          <AbsoluteFill style={{ opacity: s7, alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 26 }}>
              {Array.from({ length: 10 }).map((_, i) => {
                const n = 10 - i;
                const s = sp(frame, f7 + i * 3, 14, 170);
                const h = 30 + i * 30;
                const red = i / 9;
                const grow = sp(frame, f7 + 6 + i * 3, 13, 140);
                return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: s, transform: `translateY(${(1 - s) * 40}px)` }}>
                    <Img src={coverSrc(COVERS[11 - n][0])} style={{ width: 100, height: 100, borderRadius: 8, display: 'block', boxShadow: '0 10px 24px rgba(0,0,0,0.6)', transform: `translateY(${((1 - grow) * 30).toFixed(1)}px) rotate(${((1 - grow) * (i % 2 ? 10 : -10)).toFixed(2)}deg)` }} />
                    <div style={{ width: 100, height: h * grow, borderRadius: 12, background: `rgba(${Math.round(80 + 113 * red)}, ${Math.round(80 - 62 * red)}, ${Math.round(80 - 49 * red)}, ${0.5 + 0.5 * red})`, boxShadow: n === 1 ? '0 0 40px rgba(193,18,31,0.6)' : undefined }} />
                    <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 48, color: n === 1 ? RED : BONE }}>{n}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 40 }}><MaskTitle text="De menos a más miedo" at={f7} size={72} color={BONE} align="center" /></div>
          </AbsoluteFill>
        )}
        </AbsoluteFill>
      </Night>
      {rules.map((r, i) => <Sfx key={i} name="ui_pop" at={r.at + 1} volume={0.6} />)}
      {beats.map((b, i) => <Sfx key={`b${i}`} name="tick_soft" at={b.at} volume={0.8} />)}
      <Sfx name="impact" at={golpe} volume={0.7} />
      <Sfx name="riser" at={f7 - 10} volume={0.4} />
    </AbsoluteFill>
  );
};
