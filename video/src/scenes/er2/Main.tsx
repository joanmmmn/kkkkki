import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { ER2_SCENES, er2Start, ER2_TOTAL, er2Speech, er2ClipIntervals } from './timeline';
import { ER2_COMPONENTS } from './registry';
import { voSrc } from '../../lib/vo';
import { Sfx, SfxBusContext, SfxName, STEM } from '../../components/Sfx';
import { LogoIcon } from '../../components/Logo';
import { color } from '../../brand/tokens';
import { clamp, easeInOut, easeOut } from '../../lib/anim';

// Música: seis piezas compuestas para la reseña (ElevenLabs Music), cada una con su tempo, que cambian en los cortes.
// Archivos normalizados a −16 LUFS (…_n.mp3); `gain` fija el nivel de cada tramo antes de bajarla bajo la voz.
const CUES: { src: string; at: string; gain: number }[] = [
  { src: 'music/er2/c1_hook_n.mp3', at: 'X01', gain: 0.4 },
  { src: 'music/er2/c2_core_n.mp3', at: 'X03', gain: 0.31 },
  { src: 'music/er2/c3_voices_n.mp3', at: 'X06', gain: 0.22 },
  { src: 'music/er2/c4_features_n.mp3', at: 'X07', gain: 0.35 },
  { src: 'music/er2/c5_verdict_v2_n.mp3', at: 'X09', gain: 0.34 },
  { src: 'music/er2/c6_trick_n.mp3', at: 'X12', gain: 0.44 },
];
export const ER2_MUSIC = CUES.map((c) => c.src);

// Transiciones: «zoom» (la saliente avanza y se desenfoca), «whip» (barrido lateral rápido) y «wipe»
// (cortinilla amarilla de marca). Se indica la de entrada de cada escena.
type TType = 'zoom' | 'whip' | 'wipe';
const TRANS: Record<string, TType> = {
  X02: 'zoom', X03: 'whip', X04: 'wipe', X05: 'whip', X06: 'zoom', X07: 'wipe', X08: 'whip',
  X09: 'zoom', X10: 'wipe', X11: 'zoom', X12: 'wipe', X13: 'whip', X14: 'zoom',
};
const TSFX: Record<TType, [SfxName, number][]> = {
  zoom: [['transition', 0.7]],
  whip: [['whip', 1]],
  wipe: [['swish_up', 0.9], ['transition', 0.35]],
};
const IN: Record<TType, number> = { zoom: 11, whip: 9, wipe: 8 };
const OUT: Record<TType, number> = { zoom: 7, whip: 6, wipe: 8 };

const SceneShell: React.FC<{ dur: number; tin: TType | null; tout: TType | null; children: React.ReactNode }> = ({ dur, tin, tout, children }) => {
  const frame = useCurrentFrame();
  const drift = 1 + 0.012 * (frame / dur);
  let scale = drift, x = 0, blur = 0, opacity = 1;
  if (tin) {
    const p = interpolate(frame, [0, IN[tin]], [0, 1], { ...clamp, easing: easeOut });
    if (tin === 'zoom') { scale *= 0.965 + 0.035 * p; blur += (1 - p) * 9; opacity *= 0.35 + 0.65 * p; }
    if (tin === 'whip') { x += (1 - p) * 34; blur += (1 - p) * 22; }
    if (tin === 'wipe') { scale *= 1.03 - 0.03 * p; }
  }
  if (tout) {
    const p = interpolate(frame, [dur - OUT[tout], dur], [0, 1], { ...clamp, easing: easeInOut });
    if (tout === 'zoom') { scale *= 1 + 0.05 * p; blur += p * 8; opacity *= 1 - 0.55 * p; }
    if (tout === 'whip') { x -= p * 34; blur += p * 22; }
    if (tout === 'wipe') { scale *= 1 + 0.025 * p; }
  }
  return (
    <AbsoluteFill style={{ transform: `translateX(${x}%) scale(${scale})`, filter: blur > 0.05 ? `blur(${blur}px)` : undefined, opacity }}>
      {children}
    </AbsoluteFill>
  );
};

// Cortinilla amarilla: un panel inclinado cruza la pantalla y tapa el corte (8 fotogramas antes y 9 después).
const Wipe: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 17], [0, 1], { ...clamp, easing: easeInOut });
  const xPanel = -140 + 280 * p;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-30%', bottom: '-30%', width: '120%', left: `${xPanel}%`, transform: 'skewX(-16deg)', background: color.yellow, boxShadow: `-60px 0 0 ${color.ink}, 60px 0 0 #FFE066` }}>
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%) skewX(16deg)' }}><LogoIcon size={140} /></div>
      </div>
    </AbsoluteFill>
  );
};

export const ElevenReaderReview: React.FC = () => {
  const { fps } = useVideoConfig();
  const speech = er2Speech();
  const clips = er2ClipIntervals();
  const sec = (s: number) => Math.round(s * fps);
  const env = (f: number, list: (readonly [number, number])[], pre = 0.15, post = 0.35) => {
    let d = 0;
    for (const [a, b] of list) {
      if (f < a - sec(pre) || f > b + sec(post)) continue;
      d = Math.max(d, interpolate(f, [a - sec(pre), a, b, b + sec(post)], [0, 1, 1, 0], clamp));
    }
    return d;
  };
  // Música: −58 % bajo la locución y −80 % bajo la narración de ElevenReader (es lo que hay que escuchar).
  const musicDuck = (f: number) => 1 - Math.max(0.42 * env(f, speech), 0.8 * env(f, clips));
  // Efectos: bajan un 25 % bajo la locución y un 50 % bajo la narración de la app, para no tapar palabras.
  const sfxBus = { gain: 0.95, duck: (f: number) => 1 - Math.max(0.25 * env(f, speech, 0.05, 0.1), 0.5 * env(f, clips, 0.05, 0.1)) };
  const cueStart = (i: number) => er2Start(CUES[i].at);
  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      <SfxBusContext.Provider value={sfxBus}>
        {ER2_SCENES.map((s, i) => {
          const C = ER2_COMPONENTS[s.id];
          const next = ER2_SCENES[i + 1];
          return (
            <Sequence key={s.id} from={er2Start(s.id)} durationInFrames={s.dur} name={s.id}>
              <SceneShell dur={s.dur} tin={i === 0 ? null : TRANS[s.id] ?? 'zoom'} tout={next ? TRANS[next.id] ?? 'zoom' : null}>
                <C lead={s.lead} dur={s.dur} />
              </SceneShell>
              {(!STEM || STEM === 'vo') && s.items.map((it, k) => (
                <Sequence key={k} from={it.at} layout="none" name={`${it.kind}:${it.id}`}>
                  <Audio src={it.kind === 'vo' ? voSrc(it.id) : staticFile(`er/audio/${it.id}.mp3`)} />
                </Sequence>
              ))}
            </Sequence>
          );
        })}
        {ER2_SCENES.slice(1).map((s) => {
          const t = TRANS[s.id] ?? 'zoom';
          return (
            <React.Fragment key={s.id}>
              {t === 'wipe' && <Sequence from={er2Start(s.id) - 8} durationInFrames={17} name={`wipe:${s.id}`}><Wipe /></Sequence>}
              {TSFX[t].map(([n, v], k) => <Sfx key={k} name={n} at={er2Start(s.id) - (t === 'wipe' ? 3 : 0)} volume={v} />)}
            </React.Fragment>
          );
        })}
      </SfxBusContext.Provider>
      {(!STEM || STEM === 'music') && CUES.map((c, i) => {
        const from = cueStart(i);
        const end = i + 1 < CUES.length ? cueStart(i + 1) : ER2_TOTAL;
        const tail = i + 1 < CUES.length ? sec(0.6) : 0;
        return (
          <Sequence key={c.src} from={from} durationInFrames={end - from + tail} name={`music:${c.at}`} layout="none">
            <Audio src={staticFile(c.src)} volume={(f) => {
              const abs = from + f;
              const fadeIn = i === 0 ? interpolate(f, [0, sec(0.6)], [0, 1], clamp) : interpolate(f, [0, 3], [0.2, 1], clamp);
              const fadeOut = i + 1 < CUES.length ? interpolate(abs, [end, end + tail], [1, 0], clamp) : interpolate(abs, [ER2_TOTAL - sec(1.2), ER2_TOTAL], [1, 0], clamp);
              return c.gain * musicDuck(abs) * fadeIn * fadeOut;
            }} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
