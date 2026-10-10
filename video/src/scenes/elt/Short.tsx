import React from 'react';
import { AbsoluteFill, Audio, Img, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { Stat } from '../../components/Stat';
import { Highlight } from '../../components/Highlight';
import { Words } from '../../components/Kinetic';
import { Logo } from '../../components/Logo';
import { Pill } from '../../components/Pill';
import { Cursor, cursorAt } from '../../components/Cursor';
import { Sfx } from '../../components/Sfx';
import { VOS, voSrc } from '../../lib/vo';
import { keyframes } from '../../lib/anim';
import readerCursor from '../../../public/elt/rec/03_reader/cursor.json';

// Piezas de locución reutilizadas del vídeo largo: [id, desde (s), hasta (s), inicio en el short (s)].
type Piece = { id: string; from: number; to: number; at: number };
export const SHORT_PIECES: Piece[] = [
  { id: 'E01', from: 0, to: 14.2, at: 0.1 },
  { id: 'E06A', from: 0, to: 3.39, at: 14.5 },
  { id: 'E06B', from: 0, to: 5.95, at: 22.4 },
  { id: 'E09', from: 8.25, to: 15.2, at: 28.7 },
  { id: 'E10', from: 0, to: 2.7, at: 36.0 },
  { id: 'E10', from: 10.3, to: 13.6, at: 38.9 },
  { id: 'S01', from: 0, to: 3.67, at: 42.6 },
];
const SAMPLE_AT = 18.05;
const SAMPLE_LEN = 4.2;
export const SHORT_DUR = 47.6;

// Subtítulos palabra a palabra, agrupados en frases cortas.
type CW = { w: string; s: number; e: number };
const captionWords = (): CW[] => SHORT_PIECES.flatMap((p) => (VOS[p.id]?.words ?? [])
  .filter((w) => w.s >= p.from - 0.01 && w.e <= p.to + 0.3)
  .map((w) => ({ w: w.w.replace(/[«»…]/g, ''), s: w.s - p.from + p.at, e: Math.min(w.e, p.to) - p.from + p.at })));
const chunks = (ws: CW[]) => {
  const out: CW[][] = [];
  let cur: CW[] = [];
  for (const w of ws) {
    cur.push(w);
    if (cur.length >= 3 || /[.,:;?!]$/.test(w.w)) { out.push(cur); cur = []; }
  }
  if (cur.length) out.push(cur);
  return out;
};

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const groups = React.useMemo(() => chunks(captionWords()), []);
  const g = groups.find((c) => t >= c[0].s - 0.05 && t <= c[c.length - 1].e + 0.25);
  if (!g) return null;
  const pop = spring({ frame: frame - Math.round(g[0].s * fps), fps, config: { damping: 14, stiffness: 220 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: 1280 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 18px', maxWidth: 900, transform: `scale(${0.92 + 0.08 * pop})` }}>
        {g.map((w, i) => {
          const active = t >= w.s - 0.03 && t <= w.e + 0.05;
          return (
            <span key={i} style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 78, lineHeight: 1.15, padding: '2px 14px', borderRadius: 16, color: color.ink, background: active ? color.yellow : 'rgba(255,255,255,0.92)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
              {w.w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Ventana vertical sobre una grabación 1920×1080: muestra la región (x0, y0) con escala s (px por px CSS).
const VerticalRec: React.FC<{ startAt: number; keys: { f: number; x0: number; y0: number; s: number }[]; w: number; h: number }> = ({ startAt, keys, w, h }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = keyframes(frame, keys, 's');
  const x0 = keyframes(frame, keys, 'x0');
  const y0 = keyframes(frame, keys, 'y0');
  const t = startAt + frame / fps;
  const c = cursorAt(readerCursor, t);
  return (
    <div style={{ width: w, height: h, overflow: 'hidden', position: 'relative', borderRadius: 40, boxShadow: shadow.card, background: color.eltNavy }}>
      <div style={{ position: 'absolute', left: -x0 * s, top: -y0 * s, width: 1920 * s, height: 1080 * s }}>
        <OffthreadVideo src={staticFile('elt/rec/03_reader/video.mp4')} trimBefore={Math.round(startAt * fps)} muted style={{ width: '100%', height: '100%' }} />
        <Cursor x={c.x * s} y={c.y * s} scale={s * 1.2} down={c.down} sinceClick={t - c.lastDown} />
      </div>
    </div>
  );
};

export const ELTShort: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = (sec: number) => Math.round(sec * fps);
  const e01 = (w: number) => T(0.1 + w);
  const tTrampa = e01(12.42);
  const statsOut = interpolate(frame, [tTrampa - 6, tTrampa + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      {/* A · Gancho */}
      <Sequence durationInFrames={T(14.45)}>
        <Stage tone="night">
          <AbsoluteFill style={{ alignItems: 'center', paddingTop: 170 }}>
            <div style={{ background: color.eltNavy, borderRadius: 28, padding: '22px 40px', boxShadow: '0 20px 50px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.12)' }}>
              <Img src={staticFile('elt/img/elt_logo.png')} style={{ height: 110, display: 'block' }} />
            </div>
          </AbsoluteFill>
          <AbsoluteFill style={{ alignItems: 'center', paddingTop: 430, gap: 60, opacity: 1 - statsOut, filter: `blur(${statsOut * 12}px)` }}>
            <Stat value={5000000} suffix="+" label="descargas" start={e01(0)} dur={45} size={130} dark />
            <Stat value={4.8} decimals={1} suffix=" ★" label="valoración" start={e01(2.17)} dur={30} size={130} dark />
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 170, color: '#fff', lineHeight: 1, opacity: frame >= e01(6.09) ? 1 : 0, transform: `scale(${spring({ frame: frame - e01(6.09), fps, config: { damping: 12, stiffness: 200 } })})` }}>
              <Highlight start={e01(6.09) + 6} dur={10} height={0.28} offset={0.04}><span style={{ color: '#fff' }}>0 €</span></Highlight>
            </div>
          </AbsoluteFill>
          {frame >= tTrampa - 2 && (
            <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 300 }}>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 150, color: '#fff', textAlign: 'center', lineHeight: 1.05, letterSpacing: -3 }}>
                <Words text="¿Dónde está la" start={tTrampa} size={150} weight={700} color="#fff" />
                <div style={{ transform: `scale(${spring({ frame: frame - tTrampa - 14, fps, config: { damping: 10, stiffness: 180 } })})` }}>
                  <Highlight start={tTrampa + 18} dur={10}>trampa?</Highlight>
                </div>
              </div>
            </AbsoluteFill>
          )}
        </Stage>
      </Sequence>

      {/* B · La audiolectura */}
      <Sequence from={T(14.45)} durationInFrames={T(28.55 - 14.45)}>
        <Stage>
          <AbsoluteFill style={{ alignItems: 'center', paddingTop: 150 }}>
            <Sequence durationInFrames={T(2.9)} layout="none">
              <VerticalRec startAt={0.6} w={960} h={1080} keys={[{ f: 0, x0: 560, y0: 120, s: 1.75 }, { f: T(2.9), x0: 560, y0: 120, s: 1.75 }]} />
            </Sequence>
            <Sequence from={T(2.9)} durationInFrames={T(3.65 - 2.9)} layout="none">
              <VerticalRec startAt={8.75} w={960} h={1080} keys={[{ f: 0, x0: 1100, y0: 100, s: 1.75 }]} />
            </Sequence>
            <Sequence from={T(3.65)} layout="none">
              <VerticalRec startAt={12.95} w={960} h={1080} keys={[{ f: 0, x0: 1080, y0: 150, s: 1.75 }, { f: T(10), x0: 1080, y0: 230, s: 1.75 }]} />
            </Sequence>
          </AbsoluteFill>
          <AbsoluteFill style={{ alignItems: 'center', paddingTop: 60 }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 52, color: color.ink }}>Lees <Highlight start={T(8.5)}>y escuchas</Highlight> a la vez</div>
          </AbsoluteFill>
        </Stage>
      </Sequence>

      {/* C · Precio */}
      <Sequence from={T(28.55)} durationInFrames={T(35.85 - 28.55)}>
        <Stage>
          <AbsoluteFill style={{ alignItems: 'center', paddingTop: 260, gap: 40 }}>
            <div style={{ fontFamily: font.sans, fontSize: 40, letterSpacing: 6, color: color.muted, fontWeight: 500 }}>CRIMEN Y CASTIGO · AUDIOLIBRO</div>
            {[{ p: 'Audible', price: '18,99 €', at: T(28.7 + 10.77 - 8.25 - 28.55), bad: true }, { p: 'El Libro Total', price: 'GRATIS', at: T(28.7 + 13.14 - 8.25 - 28.55), bad: false }].map((r) => {
              const s = spring({ frame: frame - T(28.55) - r.at + 10, fps, config: { damping: 16, stiffness: 160 } });
              const strike = r.bad ? interpolate(frame - T(28.55), [T(28.7 + 13.14 - 8.25 - 28.55), T(28.7 + 13.14 - 8.25 - 28.55) + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
              return (
                <div key={r.p} style={{ width: 900, padding: '50px 56px', borderRadius: 40, background: r.bad ? '#fff' : color.yellowSoft, border: `3px solid ${r.bad ? color.line : color.yellow}`, boxShadow: shadow.card, opacity: s, transform: `translateY(${(1 - s) * 60}px)` }}>
                  <div style={{ fontFamily: font.sans, fontSize: 50, fontWeight: 500, color: color.ink2 }}>{r.p}</div>
                  <div style={{ position: 'relative', display: 'inline-block', fontFamily: font.sans, fontSize: 150, fontWeight: 700, letterSpacing: -4, lineHeight: 1.05 }}>
                    {r.bad ? r.price : <Highlight start={T(28.7 + 13.97 - 8.25 - 28.55)} dur={10}>{r.price}</Highlight>}
                    {r.bad && <div style={{ position: 'absolute', left: -10, right: -10, top: '50%', height: 12, borderRadius: 6, background: color.red, transform: `scaleX(${strike}) rotate(-6deg)`, transformOrigin: 'left' }} />}
                  </div>
                </div>
              );
            })}
          </AbsoluteFill>
        </Stage>
      </Sequence>

      {/* D · ¿La trampa? + nota */}
      <Sequence from={T(35.85)} durationInFrames={T(42.45 - 35.85)}>
        <Stage tone="warm">
          <AbsoluteFill style={{ alignItems: 'center', paddingTop: 300, gap: 30 }}>
            <Words text="¿La trampa?" start={T(0.15)} size={130} weight={700} />
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 130, letterSpacing: -3, opacity: frame - T(35.85) >= T(1.85) ? 1 : 0 }}>
              <Highlight start={T(1.95)} dur={10}>No la hay.</Highlight>
            </div>
            <div style={{ marginTop: 40, opacity: spring({ frame: frame - T(35.85) - T(3.0), fps }), transform: `scale(${spring({ frame: frame - T(35.85) - T(3.0), fps, config: { damping: 12 } })})`, textAlign: 'center', fontFamily: font.sans }}>
              <div style={{ fontSize: 44, letterSpacing: 6, color: color.muted, fontWeight: 500 }}>NOTA SONORBOOKS</div>
              <div style={{ fontSize: 230, fontWeight: 700, letterSpacing: -6, lineHeight: 1 }}>8,2<span style={{ fontSize: 80, color: color.muted }}>/10</span></div>
            </div>
          </AbsoluteFill>
        </Stage>
      </Sequence>

      {/* E · Cierre */}
      <Sequence from={T(42.45)}>
        <AbsoluteFill style={{ background: '#fff', alignItems: 'center', paddingTop: 520, gap: 50 }}>
          <Logo size={120} />
          <div style={{ opacity: spring({ frame: frame - T(43.6), fps }) }}><Pill size={56}>sonorbooks.com</Pill></div>
          <div style={{ fontFamily: font.sans, fontSize: 44, color: color.ink2, opacity: spring({ frame: frame - T(44), fps }) }}>Busca y compara gratis, sin registro.</div>
        </AbsoluteFill>
      </Sequence>

      <Captions />

      {/* Audio */}
      {SHORT_PIECES.map((p, i) => (
        <Sequence key={i} from={T(p.at)} durationInFrames={T(p.to - p.from) + 2} layout="none">
          <Audio src={voSrc(p.id)} trimBefore={T(p.from)} trimAfter={T(p.to)} />
        </Sequence>
      ))}
      <Sequence from={T(SAMPLE_AT)} durationInFrames={T(SAMPLE_LEN)} layout="none">
        <Audio src={staticFile('elt/audio/ctc_sample.mp3')} volume={(f) => interpolate(f, [0, T(SAMPLE_LEN) - 15, T(SAMPLE_LEN)], [1, 1, 0], { extrapolateRight: 'clamp' })} />
      </Sequence>
      <Audio src={staticFile('music/elt_bed.mp3')} trimBefore={T(52)} volume={(f) => {
        const speaking = SHORT_PIECES.some((p) => f >= T(p.at) - 10 && f <= T(p.at + p.to - p.from) + 10) || (f >= T(SAMPLE_AT) && f <= T(SAMPLE_AT + SAMPLE_LEN));
        const fade = interpolate(f, [0, 20, T(SHORT_DUR) - 60, T(SHORT_DUR)], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return (speaking ? 0.09 : 0.2) * fade;
      }} />
      <Sfx name="impact" at={e01(0)} volume={0.35} />
      <Sfx name="impact" at={e01(2.17)} volume={0.3} />
      <Sfx name="impact" at={e01(6.09)} volume={0.45} />
      <Sfx name="marker" at={e01(6.09) + 6} volume={0.3} />
      <Sfx name="whoosh_deep" at={tTrampa - 4} volume={0.35} />
      <Sfx name="whoosh_deep" at={T(14.4)} volume={0.35} />
      <Sfx name="click" at={T(14.45 + 1.37)} volume={0.5} />
      <Sfx name="click" at={T(14.45 + 2.9 + 0.78)} volume={0.5} />
      <Sfx name="whoosh_soft" at={T(28.5)} volume={0.3} />
      <Sfx name="pencil_strike" at={T(28.7 + 13.14 - 8.25)} volume={0.3} />
      <Sfx name="marker" at={T(28.7 + 13.97 - 8.25)} volume={0.35} />
      <Sfx name="whoosh_soft" at={T(35.8)} volume={0.3} />
      <Sfx name="impact" at={T(38.95)} volume={0.25} />
      <Sfx name="shimmer" at={T(42.5)} volume={0.3} />
    </AbsoluteFill>
  );
};
