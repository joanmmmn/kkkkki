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
import { VOS, voSrc, wordFrame } from '../../lib/vo';
import { keyframes, fmtEs } from '../../lib/anim';
import readerCursor from '../../../public/elt/rec/03_reader/cursor.json';

// Piezas de locución reutilizadas del vídeo largo: [id, desde (s), hasta (s), inicio en el short (s)].
type Piece = { id: string; from: number; to: number; at: number };
export const SHORT_PIECES: Piece[] = [
  { id: 'V01', from: 0, to: 19.95, at: 3.45 },
  { id: 'V05', from: 15.5, to: 18.4, at: 23.7 },
  { id: 'V06', from: 0, to: 5.5, at: 29.1 },
  { id: 'V12', from: 0, to: 4.95, at: 34.8 },
  { id: 'V13', from: 0, to: 3.36, at: 40.1 },
];
const COLD_LEN = 3.35;
const SAMPLE_AT = 26.75;
const SAMPLE_LEN = 2.3;
export const SHORT_DUR = 45.0;

// Subtítulos palabra a palabra, agrupados en frases cortas.
type CW = { w: string; s: number; e: number };
const captionWords = (): (CW & { piece: number })[] => SHORT_PIECES.flatMap((p, k) => (VOS[p.id]?.words ?? [])
  .filter((w) => w.s >= p.from - 0.01 && w.s < p.to - 0.05)
  .map((w) => ({ w: w.w.replace(/[«»…]/g, ''), s: w.s - p.from + p.at, e: Math.min(w.e, p.to) - p.from + p.at, piece: k })));
const chunks = (ws: (CW & { piece: number })[]) => {
  const out: CW[][] = [];
  let cur: (CW & { piece: number })[] = [];
  for (const w of ws) {
    if (cur.length && cur[cur.length - 1].piece !== w.piece) { out.push(cur); cur = []; }
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

export const ELTShort2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = (sec: number) => Math.round(sec * fps);
  const v1 = (w: string, n = 0, fb = 0) => T(3.45) + wordFrame('V01', w, n, fb);
  const fAud = v1('En', 0, 4.6);
  const fAqui = v1('Aqui', 0, 8.6);
  const fCero = v1('cero', 0, 9.4);
  const fUnico = v1('no', 0, 10.4);
  const fSeis = v1('seis', 0, 12.1);
  const fSin = [v1('anuncios', 0, 14.8), v1('suscripcion', 0, 15.8), v1('pedirte', 0, 17)];
  const fTrampa = v1('Donde', 0, 18.8);
  const segB = T(23.6);
  const segC = T(34.7);
  const segD = T(40.0);
  const counter = interpolate(frame, [fSeis - 10, fSeis + 40], [0, 6698], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const strike = interpolate(frame, [fAqui + 2, fAqui + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      {/* A · Gancho */}
      <Sequence durationInFrames={segB}>
        <Stage>
          {/* Lector (arranque en frío) */}
          <Sequence durationInFrames={fAud} layout="none">
            <AbsoluteFill style={{ alignItems: 'center', paddingTop: 170 }}>
              <VerticalRec startAt={17.1} w={960} h={1080} keys={[{ f: 0, x0: 1040, y0: 160, s: 1.6 }, { f: fAud, x0: 1040, y0: 200, s: 1.6 }]} />
            </AbsoluteFill>
            <AbsoluteFill style={{ alignItems: 'center', paddingTop: 60 }}>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 54 }}>{frame < T(3.4) ? 'Escucha esto…' : '«Crimen y castigo»'}</div>
            </AbsoluteFill>
          </Sequence>
          {/* Precio */}
          <Sequence from={fAud} durationInFrames={fUnico - fAud} layout="none">
            <AbsoluteFill style={{ alignItems: 'center', paddingTop: 320, gap: 40 }}>
              {[{ p: 'Audible', bad: true, f: fAud }, { p: 'El Libro Total', bad: false, f: fAqui }].map((r) => {
                const s = spring({ frame: frame - r.f, fps, config: { damping: 16, stiffness: 160 } });
                return (
                  <div key={r.p} style={{ width: 900, padding: '50px 56px', borderRadius: 40, background: r.bad ? '#fff' : color.yellowSoft, border: `3px solid ${r.bad ? color.line : color.yellow}`, boxShadow: shadow.card, opacity: s, transform: `translateY(${(1 - s) * 60}px)` }}>
                    <div style={{ fontFamily: font.sans, fontSize: 50, fontWeight: 500, color: color.ink2 }}>{r.p}</div>
                    <div style={{ position: 'relative', display: 'inline-block', fontFamily: font.sans, fontSize: 160, fontWeight: 700, letterSpacing: -4, lineHeight: 1.05 }}>
                      {r.bad ? '18,99 €' : frame >= fCero - 2 ? <Highlight start={fCero - fAud} dur={10}>0 €</Highlight> : <span style={{ opacity: 0.25 }}>…</span>}
                      {r.bad && <div style={{ position: 'absolute', left: -10, right: -10, top: '50%', height: 12, borderRadius: 6, background: color.red, transform: `scaleX(${strike}) rotate(-6deg)`, transformOrigin: 'left' }} />}
                    </div>
                  </div>
                );
              })}
            </AbsoluteFill>
          </Sequence>
          {/* Muro de audiolibros + 6.698 + tachones */}
          <Sequence from={fUnico} durationInFrames={fTrampa - fUnico} layout="none">
            <AbsoluteFill style={{ overflow: 'hidden' }}>
              <Img src={staticFile('elt/img/audiobooks_grid.jpg')} style={{ position: 'absolute', height: 2400, left: -560, top: -interpolate(frame, [fUnico, fTrampa], [0, 500]), filter: 'blur(2px)', opacity: 0.85 }} />
            </AbsoluteFill>
            <AbsoluteFill style={{ alignItems: 'center', paddingTop: 330 }}>
              <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 44, padding: '40px 50px', boxShadow: shadow.card, textAlign: 'center', width: 900 }}>
                <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 210, letterSpacing: -6, lineHeight: 1 }}>{fmtEs(Math.round(counter))}</div>
                <div style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 56, color: color.ink2 }}>audiolibros gratis</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, justifyContent: 'center', marginTop: 30 }}>
                  {['Anuncios', 'Suscripción', 'Registro'].map((t, i) => {
                    const s = spring({ frame: frame - fSin[i] + 6, fps, config: { damping: 16 } });
                    const k = interpolate(frame, [fSin[i] + 3, fSin[i] + 13], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                    return (
                      <div key={t} style={{ position: 'relative', padding: '12px 30px', borderRadius: 999, border: `2px solid ${color.line}`, fontFamily: font.sans, fontSize: 44, fontWeight: 500, opacity: s }}>
                        {t}<div style={{ position: 'absolute', left: 16, right: 16, top: '50%', height: 7, borderRadius: 4, background: color.red, transform: `scaleX(${k}) rotate(-5deg)`, transformOrigin: 'left' }} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </AbsoluteFill>
          </Sequence>
          {frame >= fTrampa - 2 && (
            <AbsoluteFill style={{ alignItems: 'center', paddingTop: 420 }}>
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 150, textAlign: 'center', lineHeight: 1.05, letterSpacing: -3 }}>
                <Words text="¿Dónde está la" start={fTrampa} size={150} weight={700} />
                <div style={{ transform: `scale(${spring({ frame: frame - fTrampa - 14, fps, config: { damping: 10, stiffness: 180 } })})` }}><Highlight start={fTrampa + 18} dur={10}>trampa?</Highlight></div>
              </div>
            </AbsoluteFill>
          )}
        </Stage>
      </Sequence>

      {/* B · Cómo se escucha */}
      <Sequence from={segB} durationInFrames={segC - segB}>
        <Stage>
          <AbsoluteFill style={{ alignItems: 'center', paddingTop: 150 }}>
            <Sequence durationInFrames={T(1.85)} layout="none">
              <VerticalRec startAt={0.75} w={960} h={1080} keys={[{ f: 0, x0: 560, y0: 120, s: 1.75 }]} />
            </Sequence>
            <Sequence from={T(1.85)} durationInFrames={T(3.15) - T(1.85)} layout="none">
              <VerticalRec startAt={8.5} w={960} h={1080} keys={[{ f: 0, x0: 1040, y0: 100, s: 1.6 }]} />
            </Sequence>
            <Sequence from={T(3.15)} layout="none">
              <VerticalRec startAt={21.0} w={960} h={1080} keys={[{ f: 0, x0: 1040, y0: 170, s: 1.6 }, { f: T(8), x0: 1040, y0: 230, s: 1.6 }]} />
            </Sequence>
          </AbsoluteFill>
          <AbsoluteFill style={{ alignItems: 'center', paddingTop: 60 }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 52 }}>Lees <Highlight start={T(9.6)}>y escuchas</Highlight> a la vez</div>
          </AbsoluteFill>
        </Stage>
      </Sequence>

      {/* C · Veredicto */}
      <Sequence from={segC} durationInFrames={segD - segC}>
        <Stage tone="warm">
          <AbsoluteFill style={{ alignItems: 'center', paddingTop: 300, gap: 30 }}>
            <Words text="¿La trampa?" start={T(0.1)} size={130} weight={700} />
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 130, letterSpacing: -3, opacity: frame - segC >= T(1.2) ? 1 : 0 }}><Highlight start={T(1.3)} dur={10}>No la hay.</Highlight></div>
            <div style={{ marginTop: 40, textAlign: 'center', fontFamily: font.sans, opacity: spring({ frame: frame - segC - T(2.3), fps }), transform: `scale(${spring({ frame: frame - segC - T(2.3), fps, config: { damping: 12 } })})` }}>
              <div style={{ fontSize: 44, letterSpacing: 6, color: color.muted, fontWeight: 500 }}>NOTA SONORBOOKS</div>
              <div style={{ fontSize: 230, fontWeight: 700, letterSpacing: -6, lineHeight: 1 }}>8,2<span style={{ fontSize: 80, color: color.muted }}>/10</span></div>
            </div>
          </AbsoluteFill>
        </Stage>
      </Sequence>

      {/* D · Cierre */}
      <Sequence from={segD}>
        <AbsoluteFill style={{ background: '#fff', alignItems: 'center', paddingTop: 520, gap: 50 }}>
          <Logo size={120} />
          <div style={{ opacity: spring({ frame: frame - segD - T(1.4), fps }) }}><Pill size={56}>sonorbooks.com</Pill></div>
          <div style={{ fontFamily: font.sans, fontSize: 44, color: color.ink2, opacity: spring({ frame: frame - segD - T(1.8), fps }) }}>Busca y compara gratis, sin registro.</div>
        </AbsoluteFill>
      </Sequence>

      <Captions />

      {/* Audio */}
      <Sequence durationInFrames={T(COLD_LEN)} layout="none"><Audio src={staticFile('elt/audio/cold_open.mp3')} /></Sequence>
      {SHORT_PIECES.map((p, i) => (
        <Sequence key={i} from={T(p.at)} durationInFrames={T(p.to - p.from) + 2} layout="none">
          <Audio src={voSrc(p.id)} trimBefore={T(p.from)} trimAfter={T(p.to)} />
        </Sequence>
      ))}
      <Sequence from={T(SAMPLE_AT)} durationInFrames={T(SAMPLE_LEN)} layout="none"><Audio src={staticFile('elt/audio/sample2.mp3')} /></Sequence>
      <Audio src={staticFile('music/elt_bed2.mp3')} volume={(f) => {
        const speaking = f < T(COLD_LEN) || SHORT_PIECES.some((p) => f >= T(p.at) - 10 && f <= T(p.at + p.to - p.from) + 10) || (f >= T(SAMPLE_AT) && f <= T(SAMPLE_AT + SAMPLE_LEN));
        const fade = interpolate(f, [0, 20, T(SHORT_DUR) - 60, T(SHORT_DUR)], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return (speaking ? 0.09 : 0.2) * fade;
      }} />
      <Sfx name="whoosh_fast" at={fAud - 6} volume={0.3} />
      <Sfx name="pencil_strike" at={fAqui + 2} volume={0.3} />
      <Sfx name="impact" at={fCero} volume={0.4} />
      <Sfx name="marker" at={fCero} volume={0.3} />
      <Sfx name="whoosh_deep" at={fUnico - 6} volume={0.3} />
      <Sfx name="counter" at={fSeis - 10} volume={0.2} />
      {fSin.map((f, i) => <Sfx key={i} name="pencil_strike" at={f + 3} volume={0.3} />)}
      <Sfx name="whoosh_deep" at={fTrampa - 6} volume={0.35} />
      <Sfx name="whoosh_deep" at={segB - 4} volume={0.3} />
      <Sfx name="click" at={segB + T(1.22)} volume={0.5} />
      <Sfx name="click" at={segB + T(1.85 + 1.03)} volume={0.5} />
      <Sfx name="whoosh_soft" at={segC - 4} volume={0.3} />
      <Sfx name="impact" at={segC + T(2.3)} volume={0.25} />
      <Sfx name="shimmer" at={segD} volume={0.3} />
    </AbsoluteFill>
  );
};
