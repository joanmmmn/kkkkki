import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame } from 'remotion';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { VOS, voSrc, voTrim } from '../../lib/vo';
import { Sfx, STEM } from '../../components/Sfx';
import { Logo } from '../../components/Logo';
import { MaskTitle } from '../nxr/kit';
import { BigNum, BONE, BOOKS10, bookAt, DIM, Flashlight, KickerN, Night, RED, StoryChips, color, font } from './kit';
import { Img } from 'remotion';
import { COVERS, Cover3D, CoverArt, coverSrc } from './fx';
import { BEATS, DIORAMAS } from './Dioramas';
import { F10 } from './Facts';
import { sec, speechFrames, wf, wfEnd } from './timeline';

// Vertical 9:16 (1080×1920): el n.º 1, «El Señor de los Anillos», con subtítulos grabados y las cifras en número.
const SEQ: [string, number][] = [['J01', 0.6], ['F102', 0.55], ['F103', 0.65], ['F105', 0.8], ['J02', 0.7]];
const PARTS = (() => {
  let t = 0;
  return SEQ.map(([id, gap]) => { t += sec(gap); const at = t; t += speechFrames(id); return { id, at }; });
})();
export const T10_SHORT_TOTAL = PARTS[PARTS.length - 1].at + speechFrames('J02') + sec(1.6);
export const T10_SHORT_MUSIC: string | null = 'music/t10f_short.mp3';
const part = (id: string) => PARTS.find((p) => p.id === id)!.at;
// Reloj compatible con el de las escenas (para reutilizar el diorama y la tarjeta del dato).
const clock = { dur: T10_SHORT_TOTAL, part, at: (vo: string, w: string, n = 0) => part(vo) + wf(vo, w, n), end: (vo: string, w: string, n = 0) => part(vo) + wfEnd(vo, w, n), voEnd: (vo: string) => part(vo) + speechFrames(vo) };

const ramp = (frame: number, a: number, b: number, ez = easeInOut) => interpolate(frame, [a, b], [0, 1], { ...clamp, easing: ez });
const sp = (frame: number, at: number, d = 15, s = 170) => spring({ frame: frame - at, fps: 50, config: { damping: d, stiffness: s } });

// Subtítulos grabados: trozos de hasta ~26 caracteres repartidos por caracteres dentro de cada locución.
const DIG: [string, string][] = [['Número uno', 'Número 1'], ['doce años', '12 años'], ['tres tomos', '3 tomos'], ['tres libros', '3 libros'], ['sesenta horas', '60 horas']];
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
  const fTitle = clock.at('J01', 'Señor');
  const f2 = part('F102') - 8;
  const f3 = part('F103') - 10;
  const f5 = part('F105');
  const f6 = part('J02') - 6;
  const light = ramp(frame, fTitle - 12, fTitle + 6, easeOut);
  // v6: sin la tarjeta del narrador (cómo escucharla va en el vídeo largo, al final): del dato se pasa a los tres tomos.
  const s2 = ramp(frame, f2, f2 + 14), s3 = ramp(frame, f3, f3 + 14), s4 = 0;
  const off = ramp(frame, f5, f5 + 10, easeOut);
  const s6 = ramp(frame, f6, f6 + 12);
  const bookIn = sp(frame, fTitle - 10, 16, 110);
  const beats = BEATS[10].map((bt) => clock.at('F102', bt.word, bt.nth ?? 0));
  const V = DIORAMAS[10];
  // encuadre vertical del diorama: primero el anillo y el mago (izquierda), luego Mordor (derecha)
  const panX = interpolate(frame, [beats[1] + 20, beats[2] - 6], [560, 1450], { ...clamp, easing: easeInOut });
  const panY = interpolate(frame, [beats[1] + 20, beats[2] - 6], [600, 420], { ...clamp, easing: easeInOut });
  const K = 1.78 * (1.02 + 0.04 * ramp(frame, f2, f5));
  const vols = ['01_comunidad', '01_dos_torres', '01_retorno'];
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {/* 1 y 4: el libro, con luz dorada */}
      {(s2 < 1 || (s4 > 0 && off < 1)) && (
        <AbsoluteFill style={{ opacity: Math.max(1 - s2, s4) }}>
          <Night red={0.8}>
            <div style={{ position: 'absolute', left: 540 - 260, top: interpolate(s4, [0, 1], [640, 200]), transform: `translateY(${(1 - bookIn) * 80}px) scale(${(0.7 + 0.3 * bookIn) * (1 - 0.15 * s4)})`, opacity: Math.min(1, bookIn * 1.5), transformOrigin: '50% 50%' }}>
              <Cover3D name="01_comunidad" size={520} ry={14 + Math.sin(frame / 60) * 6} rx={Math.sin(frame / 80) * 3} light={0.3 + 0.7 * Math.max(light, s4)} shine={interpolate(frame, [fTitle + 2, fTitle + 44], [0, 1.2], clamp)} reflect glow={Math.max(light, s4)} glowColor="rgba(233,196,106," />
            </div>
            <Flashlight x={540} y={interpolate(s4, [0, 1], [1000, 500])} r={interpolate(light, [0, 1], [10, 560])} on={Math.max(light, s4)} dark={0.9} seed="sh" />
            {s4 < 0.5 && <BigNum n={1} at={6} size={interpolate(light, [0, 1], [900, 300])} x={540} y={interpolate(light, [0, 1], [900, 300])} />}
            {s4 < 0.5 && (
              <div style={{ position: 'absolute', left: 40, right: 40, top: 1220, textAlign: 'center', opacity: (1 - s2) * ramp(frame, fTitle - 4, fTitle + 8) }}>
                <MaskTitle text={'El Señor\nde los Anillos'} at={fTitle - 2} size={104} color={BONE} align="center" />
                <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 44, color: DIM, marginTop: 10 }}>{b.author} · {b.year}</div>
              </div>
            )}
          </Night>
        </AbsoluteFill>
      )}
      {/* 2 y 3: el diorama y el dato */}
      {s2 > 0 && off < 1 && (
        <AbsoluteFill style={{ opacity: s2 * (1 - s4) }}>
          <div style={{ position: 'absolute', left: 540 - panX * K, top: 960 - panY * K, width: 1920, height: 1080, transform: `scale(${K.toFixed(4)})`, transformOrigin: '0 0',
            filter: `brightness(${1 - 0.55 * s3}) blur(${(s3 * 5).toFixed(2)}px)` }}>
            <V t0={f2} beats={beats} />
          </div>
          <div style={{ position: 'absolute', left: 60, top: 140, display: 'flex', alignItems: 'center', gap: 20, opacity: 1 - s3 * 0.6 }}>
            <span style={{ minWidth: 86, height: 86, borderRadius: 999, background: RED, color: '#fff', fontFamily: font.sans, fontWeight: 700, fontSize: 48, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 52, color: '#fff', textShadow: '0 4px 20px rgba(0,0,0,0.7)' }}>{b.title}</div>
          </div>
          {s3 < 1 && <div style={{ opacity: 1 - s3 }}><StoryChips left={60} bottom={700} items={BEATS[10].map((bt, i) => ({ label: bt.label, at: beats[i], red: bt.red }))} /></div>}
          {s3 > 0 && (
            <AbsoluteFill style={{ opacity: s3 }}>
              <div style={{ position: 'absolute', left: -420, top: 260, width: 1920, height: 1080, transform: 'scale(0.6)', transformOrigin: '50% 50%' }}><F10 at={f3 + 6} c={clock} /></div>
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      )}
      {/* 5: los tres tomos y el viaje */}
      {off > 0 && s6 < 1 && (
        <AbsoluteFill style={{ background: '#06070e', opacity: off * (1 - s6), alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 26, alignItems: 'center', marginTop: -340 }}>
            {vols.map((v, k) => {
              const q = sp(frame, f5 + 8 + k * 9, 14, 140);
              return <Img key={v} src={coverSrc(v)} style={{ width: 300, height: 300, borderRadius: 8, opacity: Math.min(1, q * 1.4), transform: `translateX(${((k - 1) * 40 + (1 - q) * 80).toFixed(1)}px) rotate(${((k - 1) * 3).toFixed(1)}deg)`, boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }} />;
            })}
          </div>
          <div style={{ position: 'absolute', left: 60, right: 60, top: 1180, textAlign: 'center', fontFamily: font.serif, fontStyle: 'italic', fontSize: 84, lineHeight: 1.1, color: color.yellow, textShadow: '0 0 60px rgba(255,202,5,0.35)',
            opacity: ramp(frame, clock.at('F105', 'volver') - 20, clock.at('F105', 'volver') + 4) }}>…y del que menos vas a querer volver.</div>
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
              <KickerN at={f6 + 6} text="Los 10 mejores · Fantasía" style={{ justifyContent: 'center' }} />
            </div>
          </Night>
        </AbsoluteFill>
      )}
      <Subs />
      {(!STEM || STEM === 'vo') && PARTS.filter((p) => !VOS[p.id]?.estimate).map((p) => (
        <Sequence key={p.id} from={p.at} layout="none"><Audio src={voSrc(p.id)} trimAfter={voTrim(p.id)} volume={(f) => interpolate(f, [voTrim(p.id) - 4, voTrim(p.id)], [1, 0], clamp)} /></Sequence>
      ))}
      <Sfx name="bass_drop" at={8} volume={0.9} />
      <Sfx name="sk_chime" at={fTitle - 11} volume={0.6} />
      <Sfx name="whoosh_deep" at={f2 + 4} volume={0.55} />
      <Sfx name="sk_chime" at={beats[0]} volume={0.5} />
      <Sfx name="bass_drop" at={beats[2] - 2} volume={0.5} />
      <Sfx name="sk_thunder" at={beats[3]} volume={0.45} />
      <Sfx name="page_turn" at={f3 + 6} volume={0.7} />
      <Sfx name="whoosh_deep" at={f5 + 2} volume={0.6} />
      {[0, 1, 2].map((k) => <Sfx key={k} name="sk_book_thud" at={f5 + 8 + k * 9} volume={0.5} />)}
      <Sfx name="sparkle" at={clock.at('F105', 'volver') - 6} volume={0.6} />
      <Sfx name="whoosh_soft" at={f6} volume={0.6} />
      {T10_SHORT_MUSIC && (!STEM || STEM === 'music') && (
        <Audio src={staticFile(T10_SHORT_MUSIC)} volume={(f) => 0.2 * interpolate(f, [0, 25], [0, 1], clamp) * interpolate(f, [T10_SHORT_TOTAL - 60, T10_SHORT_TOTAL], [1, 0], clamp) * (1 - 0.3 * ramp(f, f5, f5 + 6) * (1 - ramp(f, f6, f6 + 10)))} />
      )}
    </AbsoluteFill>
  );
};
