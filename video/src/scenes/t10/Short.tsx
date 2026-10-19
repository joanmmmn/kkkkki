import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { VOS, voSrc, voTrim } from '../../lib/vo';
import { Sfx, STEM } from '../../components/Sfx';
import { Logo } from '../../components/Logo';
import { MaskTitle } from '../nxr/kit';
import { BigNum, BONE, BOOKS10, bookAt, DIM, Flashlight, KickerN, Night, RED, StoryChips, color, flicker, font } from './kit';
import { COVERS, Cover3D, CoverArt } from './fx';
import { BEATS, DIORAMAS } from './Dioramas';
import { F10 } from './Facts';
import { NarrCard } from './Books';
import { sec, speechFrames, wf, wfEnd } from './timeline';
import { chunkWords, glueWords } from './subchunks';

// Vertical 9:16 (1080×1920): el n.º 1, «Nie otwieraj oczu», con subtítulos grabados y las cifras en número.
const SEQ: [string, number][] = [['Y01', 0.6], ['X102', 0.55], ['X103', 0.65], ['X104', 0.65], ['X105', 0.8], ['Y02', 0.7]];
const PARTS = (() => {
  let t = 0;
  return SEQ.map(([id, gap]) => { t += sec(gap); const at = t; t += speechFrames(id); return { id, at }; });
})();
export const T10_SHORT_TOTAL = PARTS[PARTS.length - 1].at + speechFrames('Y02') + sec(1.6);
export const T10_SHORT_MUSIC: string | null = 'music/t10_short.mp3';
const part = (id: string) => PARTS.find((p) => p.id === id)!.at;
// Reloj compatible con el de las escenas (para reutilizar la tarjeta del dato y la ilustración).
const clock = { dur: T10_SHORT_TOTAL, part, at: (vo: string, w: string, n = 0) => part(vo) + wf(vo, w, n), end: (vo: string, w: string, n = 0) => part(vo) + wfEnd(vo, w, n), voEnd: (vo: string) => part(vo) + speechFrames(vo) };

const ramp = (frame: number, a: number, b: number, ez = easeInOut) => interpolate(frame, [a, b], [0, 1], { ...clamp, easing: ez });
const sp = (frame: number, at: number, d = 15, s = 170) => spring({ frame: frame - at, fps: 50, config: { damping: d, stiffness: s } });

// Subtítulos grabados: trozos de una línea (≤ 28 caracteres) repartidos por caracteres dentro de cada locución.
const DIG: [string, string][] = [['Numer jeden', 'Numer 1'], ['trzydzieści kilometrów', '30 kilometrów']];
const CUES = (() => {
  const out: { a: number; b: number; t: string }[] = [];
  for (const p of PARTS) {
    const v = VOS[p.id];
    if (!v) continue;
    let text = v.text;
    for (const [x, y] of DIG) text = text.replace(x, y);
    // Norma tipográfica polaca y cortes como tools/t10_meta.py (subchunks.ts).
    const chunks = chunkWords(glueWords(text));
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

// La opinión de un oyente en Audioteka (04/05/2026, sin nombre).
const Review: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const q = sp(frame, at, 13, 160);
  return (
    <div style={{ width: 960, padding: '30px 40px', borderRadius: '30px 30px 30px 8px', background: '#fff', color: color.ink, boxShadow: '0 30px 80px rgba(0,0,0,0.55)', opacity: Math.min(1, q * 1.4),
      transform: `translateY(${((1 - q) * 40).toFixed(1)}px) rotate(${(-1.5 * q).toFixed(2)}deg)` }}>
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 24, letterSpacing: 3, textTransform: 'uppercase', color: '#8a8a8a' }}>Opinia słuchacza · Audioteka</div>
      <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 50, lineHeight: 1.18, marginTop: 12 }}>„To absolutna topka wydanego u nas w ostatnich latach horroru”</div>
    </div>
  );
};

export const T10Short: React.FC = () => {
  const frame = useCurrentFrame();
  const b = bookAt(10);
  const fTitle = clock.at('Y01', 'Nie');
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
  const V = DIORAMAS[10];
  const beats = BEATS[10].map((bt) => ({ ...bt, at: clock.at('X102', bt.word, bt.nth ?? 0) }));
  // la ilustración en vertical: primero la ventana tapada; con «rzeką», la cámara cruza al río
  const K = 1.78;
  const cx = interpolate(frame, [beats[2].at - 24, beats[2].at + 10], [400, 1300], { ...clamp, easing: easeInOut });
  const zoom = 1 + 0.12 * ramp(frame, beats[1].at - 4, beats[1].at + 8) * (1 - ramp(frame, beats[1].at + 40, beats[2].at)) + 0.1 * ramp(frame, beats[3].at - 6, beats[3].at + 10);
  const kk = K * zoom;
  const left = Math.min(0, Math.max(1080 - 1920 * kk, 540 - cx * kk));
  const top = Math.min(0, Math.max(1920 - 1080 * kk, 960 - 560 * kk));
  const redFlash = interpolate(frame, [beats[1].at - 1, beats[1].at + 1, beats[1].at + 14], [0, 1, 0], clamp);
  // en vertical, una sola etiqueta cada vez (la última que ha dicho la voz)
  const cur = beats.reduce((k, bt, i) => (frame >= bt.at - 3 ? i : k), -1);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {/* 1 y 4: el libro bajo la linterna */}
      {(s2 < 1 || (s4 > 0 && off < 1)) && (
        <AbsoluteFill style={{ opacity: Math.max(1 - s2, s4) }}>
          <Night red={0.8}>
            <div style={{ position: 'absolute', left: 540 - 260, top: interpolate(s4, [0, 1], [540, 170]), transform: `translateY(${(1 - bookIn) * 80}px) scale(${(0.7 + 0.3 * bookIn) * (1 - 0.15 * s4)})`, opacity: Math.min(1, bookIn * 1.5), transformOrigin: '50% 50%' }}>
              <Cover3D name={COVERS[10][0]} size={520} ry={14 + Math.sin(frame / 60) * 6} rx={Math.sin(frame / 80) * 3} light={0.3 + 0.7 * Math.max(light, s4)} shine={interpolate(frame, [fTitle + 2, fTitle + 44], [0, 1.2], clamp)} reflect glow={Math.max(light, s4)} glowColor="rgba(193,18,31," reveal={1} />
            </div>
            <Flashlight x={540} y={interpolate(s4, [0, 1], [1000, 470])} r={interpolate(light, [0, 1], [10, 560])} on={Math.max(light, s4)} dark={0.9} seed="sh" />
            {s4 < 0.5 && <BigNum n={1} at={6} size={interpolate(light, [0, 1], [900, 300])} x={540} y={interpolate(light, [0, 1], [900, 300])} />}
            {s4 < 0.5 && (
              <div style={{ position: 'absolute', left: 30, right: 30, top: 1300, textAlign: 'center', opacity: (1 - s2) * ramp(frame, fTitle - 4, fTitle + 8) }}>
                <MaskTitle text={b.title} at={fTitle - 2} size={88} color={BONE} align="center" />
                <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 44, color: DIM, marginTop: 10 }}>{b.author} · {b.year}</div>
              </div>
            )}
            {s4 > 0 && (
              <div style={{ position: 'absolute', left: 60, top: 820, display: 'flex', flexDirection: 'column', gap: 26, opacity: s4 }}>
                <NarrCard n={b.narr[0]} at={f4 + 10} ratingAt={f4 + 36} w={960} accent={b.accent} seed="short" />
                <Review at={clock.at('X104', 'słuchaczy') - 4} />
              </div>
            )}
          </Night>
        </AbsoluteFill>
      )}
      {/* 2 y 3: la ilustración y el dato */}
      {s2 > 0 && s4 < 1 && (
        <AbsoluteFill style={{ opacity: s2 * (1 - s4) }}>
          <div style={{ position: 'absolute', left, top, width: 1920, height: 1080, transform: `scale(${kk.toFixed(4)})`, transformOrigin: '0 0',
            filter: `brightness(${1 - 0.55 * s3}) blur(${(s3 * 5).toFixed(2)}px)` }}>
            <V t0={f2} beats={beats.map((bt) => bt.at)} />
          </div>
          {redFlash > 0 && <AbsoluteFill style={{ background: `rgba(193,18,31,${(0.3 * redFlash).toFixed(3)})`, mixBlendMode: 'screen' }} />}
          <div style={{ position: 'absolute', left: 60, top: 140, display: 'flex', alignItems: 'center', gap: 20, opacity: 1 - s3 * 0.6 }}>
            <span style={{ minWidth: 86, height: 86, borderRadius: 999, background: RED, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 48, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 52, color: '#fff', textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>{b.title}</div>
          </div>
          {s3 < 1 && cur >= 0 && <div style={{ opacity: 1 - s3 }}><StoryChips key={cur} left={60} bottom={700} items={[{ label: beats[cur].label, at: beats[cur].at, red: beats[cur].red }]} /></div>}
          {s3 > 0 && (
            <AbsoluteFill style={{ opacity: s3 }}>
              <div style={{ position: 'absolute', left: -420, top: 280, width: 1920, height: 1080, transform: 'scale(0.95)', transformOrigin: '50% 50%' }}><F10 at={f3 + 6} c={clock} /></div>
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      )}
      {/* 5: se apaga la linterna */}
      {off > 0 && s6 < 1 && (
        <AbsoluteFill style={{ background: '#000', opacity: off * (1 - s6), alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 116, lineHeight: 1.05, textAlign: 'center', color: RED, textShadow: '0 0 60px rgba(193,18,31,0.45)', opacity: ramp(frame, clock.at('X105', 'Jeśli') - 4, clock.at('X105', 'Jeśli') + 12) * flicker(frame, 'shatr', 0.8), marginTop: -300 }}>Jeśli się<br />odważysz.</div>
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
                    <div style={{ borderRadius: 8, overflow: 'hidden', boxShadow: '0 12px 30px rgba(0,0,0,0.6)' }}>
                      {/* los otros nueve, censurados: se descubren en el vídeo completo */}
                      <CoverArt name={COVERS[11 - bk.n][0]} size={160} reveal={bk.n === 1 ? 1 : 0} />
                    </div>
                    <div style={{ position: 'absolute', right: -6, top: -10, minWidth: 44, height: 44, borderRadius: 999, background: bk.n === 1 ? RED : color.yellow, color: bk.n === 1 ? '#fff' : color.ink, fontFamily: font.sans, fontWeight: 700, fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{bk.n}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 940, textAlign: 'center' }}>
              <KickerN at={f6 + 6} text="10 historii grozy" style={{ justifyContent: 'center' }} />
            </div>
          </Night>
        </AbsoluteFill>
      )}
      <Subs />
      {(!STEM || STEM === 'vo') && PARTS.map((p) => (
        <Sequence key={p.id} from={p.at} layout="none"><Audio src={voSrc(p.id)} trimAfter={voTrim(p.id)} volume={(f) => interpolate(f, [voTrim(p.id) - 4, voTrim(p.id)], [1, 0], clamp)} /></Sequence>
      ))}
      <Sfx name="bass_drop" at={8} volume={0.9} />
      <Sfx name="click" at={fTitle - 11} volume={0.7} />
      <Sfx name="whoosh_deep" at={f2 + 4} volume={0.55} />
      <Sfx name="sk_wind" at={beats[0].at - 20} volume={0.6} />
      <Sfx name="impact" at={beats[1].at} volume={0.45} />
      <Sfx name="whoosh_soft" at={beats[2].at - 20} volume={0.4} />
      <Sfx name="reverse_swell" at={beats[4].at - 6} volume={0.4} />
      <Sfx name="page_turn" at={f3 + 6} volume={0.7} />
      <Sfx name="counter" at={clock.at('X103', 'czterdzieści') - 4} volume={0.5} />
      <Sfx name="click" at={f4 + 4} volume={0.6} />
      <Sfx name="snap_in" at={f4 + 10} volume={0.7} />
      <Sfx name="ui_pop" at={clock.at('X104', 'słuchaczy') - 2} volume={0.6} />
      <Sfx name="click" at={f5 + 2} volume={0.8} />
      <Sfx name="sk_heart" at={clock.at('X105', 'Jeśli')} volume={0.9} />
      <Sfx name="whoosh_soft" at={f6} volume={0.6} />
      {T10_SHORT_MUSIC && (!STEM || STEM === 'music') && (
        <Audio src={staticFile(T10_SHORT_MUSIC)} volume={(f) => 0.2 * interpolate(f, [0, 25], [0, 1], clamp) * interpolate(f, [T10_SHORT_TOTAL - 60, T10_SHORT_TOTAL], [1, 0], clamp) * (1 - 0.5 * ramp(f, f5, f5 + 6) * (1 - ramp(f, f6, f6 + 10)))} />
      )}
    </AbsoluteFill>
  );
};
