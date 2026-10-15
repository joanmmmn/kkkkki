import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { VOS, voSrc } from '../../lib/vo';
import { Sfx, STEM } from '../../components/Sfx';
import { Logo } from '../../components/Logo';
import { MaskTitle } from '../nxr/kit';
import { BigNum, BONE, BOOKS10, bookAt, DIM, Flashlight, KickerN, Night, RED, StoryChips, color, flicker, font } from './kit';
import { Img } from 'remotion';
import { Ambient, COVERS, Cover3D, coverSrc, shakes } from './fx';
import { VExorcista } from './Vignettes';
import { F10 } from './Facts';
import { NarrCard } from './Books';
import { sec, speechFrames, wf, wfEnd } from './timeline';

// Vertical 9:16 (1080×1920): el n.º 1, «El exorcista», con subtítulos grabados y las cifras en número.
const SEQ: [string, number][] = [['Y01', 0.6], ['X102', 0.55], ['X103', 0.65], ['X104', 0.65], ['X105', 0.8], ['Y02', 0.7]];
const PARTS = (() => {
  let t = 0;
  return SEQ.map(([id, gap]) => { t += sec(gap); const at = t; t += speechFrames(id); return { id, at }; });
})();
export const T10_SHORT_TOTAL = PARTS[PARTS.length - 1].at + speechFrames('Y02') + sec(1.6);
export const T10_SHORT_MUSIC: string | null = 'music/t10_short.mp3';
const part = (id: string) => PARTS.find((p) => p.id === id)!.at;
// Reloj compatible con el de las escenas (para reutilizar la tarjeta del Washington Post).
const clock = { dur: T10_SHORT_TOTAL, part, at: (vo: string, w: string, n = 0) => part(vo) + wf(vo, w, n), end: (vo: string, w: string, n = 0) => part(vo) + wfEnd(vo, w, n), voEnd: (vo: string) => part(vo) + speechFrames(vo) };

const ramp = (frame: number, a: number, b: number, ez = easeInOut) => interpolate(frame, [a, b], [0, 1], { ...clamp, easing: ez });
const sp = (frame: number, at: number, d = 15, s = 170) => spring({ frame: frame - at, fps: 50, config: { damping: d, stiffness: s } });

// Subtítulos grabados: trozos de hasta ~26 caracteres repartidos por caracteres dentro de cada locución.
const DIG: [string, string][] = [['mil novecientos cuarenta y nueve', '1949'], ['Trece horas', '13 horas'], ['Número uno', 'Número 1']];
const CUES = (() => {
  const out: { a: number; b: number; t: string }[] = [];
  for (const p of PARTS) {
    const v = VOS[p.id];
    if (!v) continue;
    let text = v.text;
    for (const [x, y] of DIG) text = text.replace(x, y);
    const words = text.split(' ');
    const chunks: string[] = [];
    let cur = '';
    for (const w of words) {
      const brk = /[.:?!…]$/.test(cur);
      if (cur && (cur.length + w.length + 1 > 26 || brk)) { chunks.push(cur); cur = w; } else cur = cur ? `${cur} ${w}` : w;
    }
    if (cur) chunks.push(cur);
    const total = chunks.reduce((a, c) => a + c.length, 0);
    const dur = speechFrames(p.id);
    let acc = 0;
    for (const c of chunks) {
      const a = p.at + Math.round((dur * acc) / total);
      acc += c.length;
      out.push({ a, b: p.at + Math.round((dur * acc) / total) + 6, t: c });
    }
  }
  return out;
})();
const Subs: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = CUES.find((c, i) => frame >= c.a && frame < Math.min(c.b, CUES[i + 1]?.a ?? c.b));
  if (!cue) return null;
  const s = interpolate(frame - cue.a, [0, 5], [0.9, 1], clamp);
  return (
    <div style={{ position: 'absolute', left: 60, right: 60, top: 1580, display: 'flex', justifyContent: 'center' }}>
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 64, lineHeight: 1.15, color: '#fff', textAlign: 'center', transform: `scale(${s})`,
        textShadow: '0 4px 0 rgba(0,0,0,0.9), 0 0 24px rgba(0,0,0,0.9)', WebkitTextStroke: '2px rgba(0,0,0,0.85)', padding: '6px 18px', borderRadius: 14 }}>{cue.t}</div>
    </div>
  );
};

export const T10Short: React.FC = () => {
  const frame = useCurrentFrame();
  const b = bookAt(10);
  const fT = part('Y01');
  const fTitle = clock.at('Y01', 'exorcista');
  const f2 = part('X102') - 8;
  const f3 = part('X103') - 10;
  const f4 = part('X104') - 10;
  const f5 = part('X105');
  const f6 = part('Y02') - 6;
  const light = ramp(frame, fTitle - 12, fTitle + 6, easeOut);
  const s2 = ramp(frame, f2, f2 + 14), s3 = ramp(frame, f3, f3 + 14), s4 = ramp(frame, f4, f4 + 14);
  const off = ramp(frame, f5, f5 + 10, easeOut);
  const s6 = ramp(frame, f6, f6 + 12);
  const bookIn = sp(frame, fTitle - 10, 16, 110);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {/* 1 y 4: el libro bajo la linterna */}
      {(s2 < 1 || (s4 > 0 && off < 1)) && (
        <AbsoluteFill style={{ opacity: Math.max(1 - s2, s4) }}>
          <Night red={0.8}>
            <div style={{ position: 'absolute', left: 540 - 260, top: interpolate(s4, [0, 1], [640, 200]), transform: `translateY(${(1 - bookIn) * 80}px) scale(${(0.7 + 0.3 * bookIn) * (1 - 0.15 * s4)})`, opacity: Math.min(1, bookIn * 1.5), transformOrigin: '50% 50%' }}>
              <Cover3D name="01_exorcista" size={520} ry={14 + Math.sin(frame / 60) * 6} rx={Math.sin(frame / 80) * 3} light={0.3 + 0.7 * Math.max(light, s4)} shine={interpolate(frame, [fTitle + 2, fTitle + 44], [0, 1.2], clamp)} reflect glow={Math.max(light, s4)} glowColor="rgba(193,18,31," />
            </div>
            <Flashlight x={540} y={interpolate(s4, [0, 1], [1000, 500])} r={interpolate(light, [0, 1], [10, 560])} on={Math.max(light, s4)} dark={0.9} seed="sh" />
            {s4 < 0.5 && <BigNum n={1} at={6} size={interpolate(light, [0, 1], [900, 300])} x={540} y={interpolate(light, [0, 1], [900, 300])} />}
            {s4 < 0.5 && (
              <div style={{ position: 'absolute', left: 0, right: 0, top: 1250, textAlign: 'center', opacity: (1 - s2) * ramp(frame, fTitle - 4, fTitle + 8) }}>
                <MaskTitle text={b.title} at={fTitle - 2} size={110} color={BONE} align="center" />
                <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 44, color: DIM, marginTop: 10 }}>{b.author} · {b.year}</div>
              </div>
            )}
            {s4 > 0 && (
              <div style={{ position: 'absolute', left: 60, top: 860, opacity: s4 }}>
                <NarrCard n={b.narr[0]} at={f4 + 10} ratingAt={f4 + 36} w={960} accent={b.accent} seed="short" />
              </div>
            )}
          </Night>
        </AbsoluteFill>
      )}
      {/* 2 y 3: la casa y el recorte del periódico */}
      {s2 > 0 && s4 < 1 && (
        <AbsoluteFill style={{ opacity: s2 * (1 - s4) }}>
          <div style={{ position: 'absolute', left: -1167, top: 0, width: 1920, height: 1080, transform: `scale(${1.78 * (1.02 + 0.04 * ramp(frame, f2, f4))})`, transformOrigin: '0 0',
            filter: `brightness(${1 - 0.55 * s3}) blur(${(s3 * 5).toFixed(2)}px)` }}>
            <div style={{ position: 'absolute', left: 1167 / 1.78, top: 0, width: 1920, height: 1080 }} />
            <VExorcista t0={f2} />
          </div>
          <div style={{ position: 'absolute', left: 60, top: 140, display: 'flex', alignItems: 'center', gap: 20, opacity: 1 - s3 * 0.6 }}>
            <span style={{ minWidth: 86, height: 86, borderRadius: 999, background: color.yellow, color: color.ink, fontFamily: font.sans, fontWeight: 700, fontSize: 48, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 52, color: '#fff' }}>{b.title}</div>
          </div>
          {s3 < 1 && <div style={{ opacity: 1 - s3 }}><StoryChips left={60} bottom={700} items={[
            { label: 'Washington', at: clock.at('X102', 'Washington') },
            { label: 'Ruidos en el desván', at: clock.at('X102', 'ruidos') },
            { label: 'Una voz que no es la suya', at: clock.at('X102', 'voz') },
            { label: 'Sin explicación', at: clock.at('X102', 'explicación'), red: true },
          ]} /></div>}
          {s3 > 0 && (
            <AbsoluteFill style={{ opacity: s3 }}>
              <div style={{ position: 'absolute', left: -420, top: 260, width: 1920, height: 1080, transform: 'scale(0.78)', transformOrigin: '50% 50%' }}><F10 at={f3 + 6} c={clock} /></div>
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      )}
      {/* 5: se apaga la linterna */}
      {off > 0 && s6 < 1 && (
        <AbsoluteFill style={{ background: '#000', opacity: off * (1 - s6), alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 130, color: RED, textShadow: '0 0 60px rgba(193,18,31,0.45)', opacity: ramp(frame, clock.at('X105', 'Si') - 4, clock.at('X105', 'Si') + 12) * flicker(frame, 'shatr', 0.8), marginTop: -300 }}>Si te atreves.</div>
        </AbsoluteFill>
      )}
      {/* 6: los otros nueve */}
      {s6 > 0 && (
        <AbsoluteFill style={{ opacity: s6 }}>
          <Night red={0.6}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 220, display: 'flex', justifyContent: 'center' }}><Logo size={70} delay={0} dark /></div>
            <div style={{ position: 'absolute', left: 90, right: 90, top: 480, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 22, rowGap: 34 }}>
              {BOOKS10.map((bk, i) => {
                const s = sp(frame, f6 + 4 + i * 2, 14, 170);
                return (
                  <div key={bk.n} style={{ opacity: s * (bk.n === 1 ? 1 : 0.85), transform: `translateY(${(1 - s) * 30}px)`, position: 'relative' }}>
                    <Img src={coverSrc(COVERS[11 - bk.n][0])} style={{ width: 160, height: 160, borderRadius: 8, display: 'block', boxShadow: '0 12px 30px rgba(0,0,0,0.6)', filter: bk.n === 1 ? undefined : 'brightness(0.8)' }} />
                    <div style={{ position: 'absolute', right: -6, top: -10, minWidth: 44, height: 44, borderRadius: 999, background: bk.n === 1 ? RED : color.yellow, color: bk.n === 1 ? '#fff' : color.ink, fontFamily: font.sans, fontWeight: 700, fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{bk.n}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 940, textAlign: 'center' }}>
              <KickerN at={f6 + 6} text="Los 10 mejores · Terror" style={{ justifyContent: 'center' }} />
            </div>
          </Night>
        </AbsoluteFill>
      )}
      <Subs />
      {(!STEM || STEM === 'vo') && PARTS.map((p) => (
        <Sequence key={p.id} from={p.at} layout="none"><Audio src={voSrc(p.id)} /></Sequence>
      ))}
      <Sfx name="bass_drop" at={8} volume={0.9} />
      <Sfx name="click" at={fTitle - 11} volume={0.7} />
      <Sfx name="whoosh_deep" at={f2 + 4} volume={0.55} />
      <Sfx name="sk_thunder" at={f2 + 180} volume={0.9} />
      <Sfx name="sk_thunder" at={f2 + 470} volume={0.7} />
      <Sfx name="page_turn" at={f3 + 6} volume={0.7} />
      <Sfx name="click" at={f4 + 4} volume={0.6} />
      <Sfx name="snap_in" at={f4 + 10} volume={0.7} />
      <Sfx name="click" at={f5 + 2} volume={0.8} />
      <Sfx name="sk_heart" at={clock.at('X105', 'Si')} volume={0.9} />
      <Sfx name="whoosh_soft" at={f6} volume={0.6} />
      {T10_SHORT_MUSIC && (!STEM || STEM === 'music') && (
        <Audio src={staticFile(T10_SHORT_MUSIC)} volume={(f) => 0.2 * interpolate(f, [0, 25], [0, 1], clamp) * interpolate(f, [T10_SHORT_TOTAL - 60, T10_SHORT_TOTAL], [1, 0], clamp) * (1 - 0.5 * ramp(f, f5, f5 + 6) * (1 - ramp(f, f6, f6 + 10)))} />
      )}
    </AbsoluteFill>
  );
};
