import React from 'react';
import { AbsoluteFill, Audio, Freeze, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { LV_SCENES, lvStart, LV_TOTAL, lvSpeech, lvClipIntervals } from './timeline';
import { LV_COMPONENTS } from './registry';
import { voSrc } from '../../lib/vo';
import { Sfx, SfxBusContext, SfxMuteContext, SfxName, STEM } from '../../components/Sfx';
import { LogoIcon } from '../../components/Logo';
import { color } from '../../brand/tokens';
import { clamp, easeInOut, easeSoft } from '../../lib/anim';
import { MotionContext } from '../../lib/motion';
import { Stage, StageBgContext } from '../../components/Stage';

// Música: seis piezas compuestas para este vídeo (ElevenLabs Music), cada una con su tempo, que cambian en los cortes.
// Archivos normalizados a −16 LUFS (…_n.mp3); `gain` fija el nivel de cada tramo antes de bajarla bajo la voz.
// El orden sigue al del vídeo: primero cómo se usa (Y06–Y08) y después por qué es legal y el catálogo (Y04–Y05).
const CUES: { src: string; at: string; gain: number }[] = [
  { src: 'music/lv/m1_hook_n.mp3', at: 'Y01', gain: 0.38 },
  { src: 'music/lv/m2a_what_n.mp3', at: 'Y03', gain: 0.3 },
  { src: 'music/lv/m3_tutorial_n.mp3', at: 'Y06', gain: 0.3 },
  { src: 'music/lv/m2b_catalog_n.mp3', at: 'Y04', gain: 0.3 },
  { src: 'music/lv/m4_voices_n.mp3', at: 'Y09', gain: 0.26 },
  { src: 'music/lv/m5_verdict_n.mp3', at: 'Y11', gain: 0.34 },
];
export const LV_MUSIC = CUES.map((c) => c.src);

// Transiciones. «soft»: fundido con zoom suave y solapado (la escena que sale se queda en su último fotograma, se aleja y
// se desvanece mientras la nueva aparece; el fondo es uno solo para todo el vídeo, así que solo se funde el contenido).
// «wipe»: cortinilla amarilla de marca, solo al empezar los tres bloques grandes (qué es, cómo se usa y la valoración).
type TType = 'soft' | 'wipe';
const TRANS: Record<string, TType> = { Y03: 'wipe', Y06: 'wipe', Y11: 'wipe' };
const trans = (id: string): TType => TRANS[id] ?? 'soft';
const SOFT = 24; // fotogramas de solape (0,48 s)
const WIPE = 26; // duración de la cortinilla (0,52 s), centrada en el corte
const TSFX: Record<TType, [SfxName, number][]> = {
  soft: [['whoosh_soft', 0.45]],
  wipe: [['swish_up', 0.75], ['transition', 0.3]],
};
const DRIFT = 0.01; // acercamiento lento de cada escena a lo largo de su duración

const SceneShell: React.FC<{ dur: number; tin: TType | null; tout: TType | null; children: React.ReactNode }> = ({ dur, tin, tout, children }) => {
  const frame = useCurrentFrame();
  let scale = 1 + DRIFT * (frame / dur), opacity = 1, blur = 0;
  if (tin === 'soft') {
    // La nueva escena gana opacidad deprisa al principio y la que sale la pierde despacio: en el punto medio del fundido
    // casi no se ve el fondo entre las dos (sin «bajón» de luz).
    const q = interpolate(frame, [0, SOFT], [0, 1], clamp);
    const p = easeInOut(q);
    opacity = 1 - (1 - q) * (1 - q); scale *= 1.025 - 0.025 * p; blur = (1 - p) * 2;
  }
  if (tin === 'wipe') {
    const p = interpolate(frame, [0, WIPE / 2 + 6], [0, 1], { ...clamp, easing: easeSoft });
    scale *= 1.02 - 0.02 * p;
  }
  if (tout === 'wipe') {
    const p = interpolate(frame, [dur - WIPE / 2, dur], [0, 1], { ...clamp, easing: easeInOut });
    scale *= 1 + 0.015 * p;
  }
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})`, filter: blur > 0.05 ? `blur(${blur}px)` : undefined, opacity }}>
      {children}
    </AbsoluteFill>
  );
};

// La escena que sale, congelada en su último fotograma, se aleja, se desenfoca un poco y se desvanece bajo la que entra.
const SoftOut: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const q = interpolate(frame, [0, SOFT], [0, 1], clamp);
  const p = easeInOut(q);
  return (
    <AbsoluteFill style={{ opacity: 1 - q * q, transform: `scale(${(1 + DRIFT) * (1 + 0.03 * p)})`, filter: p > 0.02 ? `blur(${p * 2.5}px)` : undefined }}>
      {children}
    </AbsoluteFill>
  );
};

// Cortinilla amarilla: un panel inclinado cruza la pantalla y tapa el corte, con aceleración y frenada suaves.
const Wipe: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, WIPE], [0, 1], { ...clamp, easing: easeInOut });
  const xPanel = -140 + 280 * p;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-30%', bottom: '-30%', width: '120%', left: `${xPanel}%`, transform: 'skewX(-16deg)', background: color.yellow, boxShadow: `-60px 0 0 ${color.ink}, 60px 0 0 #FFE066` }}>
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%) skewX(16deg)' }}><LogoIcon size={140} /></div>
      </div>
    </AbsoluteFill>
  );
};

export const LibriVoxReview: React.FC = () => {
  const { fps } = useVideoConfig();
  const speech = lvSpeech();
  const clips = lvClipIntervals();
  const sec = (s: number) => Math.round(s * fps);
  const env = (f: number, list: (readonly [number, number])[], pre = 0.15, post = 0.35) => {
    let d = 0;
    for (const [a, b] of list) {
      if (f < a - sec(pre) || f > b + sec(post)) continue;
      d = Math.max(d, interpolate(f, [a - sec(pre), a, b, b + sec(post)], [0, 1, 1, 0], clamp));
    }
    return d;
  };
  // Música: −58 % bajo la locución y −80 % bajo los voluntarios de LibriVox (es lo que hay que escuchar).
  const musicDuck = (f: number) => 1 - Math.max(0.42 * env(f, speech), 0.8 * env(f, clips));
  // Efectos: bajan un 25 % bajo la locución y un 50 % bajo los fragmentos de LibriVox, para no tapar palabras.
  const sfxBus = { gain: 0.95, duck: (f: number) => 1 - Math.max(0.25 * env(f, speech, 0.05, 0.1), 0.5 * env(f, clips, 0.05, 0.1)) };
  const cueStart = (i: number) => lvStart(CUES[i].at);
  return (
    <MotionContext.Provider value={{ soft: true }}>
      <AbsoluteFill style={{ background: '#fff' }}>
        {/* Un solo fondo vivo para todo el vídeo; las escenas ponen encima solo su contenido */}
        <Stage tone="warm" />
        <StageBgContext.Provider value>
        <SfxBusContext.Provider value={sfxBus}>
          {LV_SCENES.map((s, i) => {
            const C = LV_COMPONENTS[s.id];
            const prev = LV_SCENES[i - 1];
            const next = LV_SCENES[i + 1];
            const P = prev ? LV_COMPONENTS[prev.id] : null;
            const tin = i === 0 ? null : trans(s.id);
            return (
              <React.Fragment key={s.id}>
                {P && prev && tin === 'soft' && (
                  <Sequence from={lvStart(s.id)} durationInFrames={SOFT} name={`fundido:${prev.id}→${s.id}`}>
                    <SfxMuteContext.Provider value>
                      <SoftOut>
                        <Freeze frame={prev.dur - 1}><P lead={prev.lead} dur={prev.dur} /></Freeze>
                      </SoftOut>
                    </SfxMuteContext.Provider>
                  </Sequence>
                )}
                <Sequence from={lvStart(s.id)} durationInFrames={s.dur} name={s.id}>
                  <SceneShell dur={s.dur} tin={tin} tout={next ? trans(next.id) : null}>
                    <C lead={s.lead} dur={s.dur} />
                  </SceneShell>
                  {(!STEM || STEM === 'vo') && s.items.map((it, k) => (
                    <Sequence key={k} from={it.at} layout="none" name={`${it.kind}:${it.id}`}>
                      <Audio src={it.kind === 'vo' ? voSrc(it.id) : staticFile(`lv/audio/${it.id}.mp3`)} />
                    </Sequence>
                  ))}
                </Sequence>
              </React.Fragment>
            );
          })}
          {LV_SCENES.slice(1).map((s) => {
            const t = trans(s.id);
            return (
              <React.Fragment key={s.id}>
                {t === 'wipe' && <Sequence from={lvStart(s.id) - WIPE / 2} durationInFrames={WIPE} name={`cortinilla:${s.id}`}><Wipe /></Sequence>}
                {/* El golpe del efecto cae en el centro visual de la transición: el de la cortinilla, justo antes del corte; el del
                    fundido, a un tercio del solape (cuando la escena nueva ya se ve). */}
                {TSFX[t].map(([n, v], k) => <Sfx key={k} name={n} at={lvStart(s.id) + (t === 'wipe' ? -3 : 8)} volume={v} />)}
              </React.Fragment>
            );
          })}
        </SfxBusContext.Provider>
        </StageBgContext.Provider>
        {(!STEM || STEM === 'music') && CUES.map((c, i) => {
          const from = cueStart(i);
          const end = i + 1 < CUES.length ? cueStart(i + 1) : LV_TOTAL;
          const tail = i + 1 < CUES.length ? sec(0.7) : 0;
          // Tras una cortinilla, la música nueva entra con su golpe; tras un fundido, entra fundiéndose.
          const fadeLen = i === 0 ? sec(0.6) : trans(c.at) === 'wipe' ? 3 : sec(0.5);
          return (
            <Sequence key={c.src} from={from} durationInFrames={end - from + tail} name={`music:${c.at}`} layout="none">
              <Audio src={staticFile(c.src)} volume={(f) => {
                const abs = from + f;
                const fadeIn = interpolate(f, [0, fadeLen], [i === 0 || fadeLen > 3 ? 0 : 0.2, 1], clamp);
                const fadeOut = i + 1 < CUES.length ? interpolate(abs, [end, end + tail], [1, 0], clamp) : interpolate(abs, [LV_TOTAL - sec(1.2), LV_TOTAL], [1, 0], clamp);
                return c.gain * musicDuck(abs) * fadeIn * fadeOut;
              }} />
            </Sequence>
          );
        })}
      </AbsoluteFill>
    </MotionContext.Provider>
  );
};
