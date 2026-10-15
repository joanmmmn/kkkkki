import React from 'react';
import { AbsoluteFill, Audio, Freeze, interpolate, Sequence, staticFile, useVideoConfig } from 'remotion';
import { voSrc } from '../../lib/vo';
import { Sfx, SfxBusContext, SfxMuteContext, SfxName, STEM } from '../../components/Sfx';
import { clamp } from '../../lib/anim';
import { E, Grain } from './kit';
import { PUSH, PushIn, PushOut, SLIDE, SlideDoors, SOFT, SoftIn, SoftOut } from './frames';
import { scene, SCENES, speech, start, TOTAL } from './timeline';
import { SHOTS } from './shots';

// eBiblio: qué es, cómo funciona y cómo usarlo para escuchar audiolibros gratis — vídeo por capítulos («la puerta»).
// Cada plano abarca una o varias escenas de la locución (timeline.json) y entra con un corte, un desplazamiento por el
// pasillo, unas puertas correderas o un fundido; los capítulos se abren con una puerta (DoorCard, dentro del plano).

// Música: cuatro piezas compuestas para este vídeo (una por acto), normalizadas; bajan bajo la voz.
const CUES: { src: string; at: string; gain: number }[] = [
  { src: 'music/eb/c1_opening_n.mp3', at: 'T01', gain: 0.4 },
  { src: 'music/eb/c2_what_n.mp3', at: 'T03', gain: 0.3 },
  { src: 'music/eb/c3_steps_n.mp3', at: 'T07', gain: 0.28 },
  { src: 'music/eb/c4_ending_n.mp3', at: 'T12', gain: 0.32 },
];
export const EB_MUSIC = CUES.map((c) => c.src);

const TSFX: Record<'push' | 'slide' | 'soft', [SfxName, number, number][]> = {
  push: [['whip', 0.7, 4]],
  slide: [['swipe', 0.8, 1], ['door_thud', 0.55, SLIDE / 2 - 1], ['swipe', 0.6, SLIDE / 2 + 3]],
  soft: [['deep_whoosh', 0.45, 4]],
};

export const EbiblioGuide: React.FC = () => {
  const { fps } = useVideoConfig();
  const sec = (s: number) => Math.round(s * fps);
  const sp = speech();
  const env = (f: number, list: (readonly [number, number])[], pre = 0.15, post = 0.35) => {
    let d = 0;
    for (const [a, b] of list) {
      if (f < a - sec(pre) || f > b + sec(post)) continue;
      d = Math.max(d, interpolate(f, [a - sec(pre), a, b, b + sec(post)], [0, 1, 1, 0], clamp));
    }
    return d;
  };
  // Música: −55 % bajo la locución; efectos: −25 %
  const musicDuck = (f: number) => 1 - 0.55 * env(f, sp);
  const sfxBus = { gain: 0.95, duck: (f: number) => 1 - 0.25 * env(f, sp, 0.05, 0.1) };
  const shotStart = (i: number) => start(SHOTS[i].scenes[0]);
  const shotDur = (i: number) => SHOTS[i].scenes.reduce((a, id) => a + scene(id).dur, 0);
  const TD = { push: PUSH, slide: SLIDE, soft: SOFT } as const;
  return (
    <AbsoluteFill style={{ background: E.bone }}>
      <SfxBusContext.Provider value={sfxBus}>
        {SHOTS.map((sh, i) => {
          const from = shotStart(i), dur = shotDur(i);
          const prev = i > 0 ? SHOTS[i - 1] : null;
          const P = prev?.C;
          const C = sh.C;
          const tin = i === 0 ? 'cut' : sh.tin;
          const frozenPrev = P ? <Freeze frame={shotDur(i - 1) - 1}><P dur={shotDur(i - 1)} /></Freeze> : null;
          return (
            <React.Fragment key={sh.id}>
              <Sequence from={from} durationInFrames={dur} name={`plano ${sh.id}`} style={{ isolation: 'isolate' }}>
                {tin === 'soft' ? <SoftIn><C dur={dur} /></SoftIn> : tin === 'push' ? <PushIn><C dur={dur} /></PushIn> : <C dur={dur} />}
              </Sequence>
              {P && tin !== 'cut' && (
                <Sequence from={from} durationInFrames={tin === 'slide' ? SLIDE / 2 + 1 : TD[tin]} name={`sale ${prev!.id}`} style={{ isolation: 'isolate' }}>
                  <SfxMuteContext.Provider value>
                    {tin === 'soft' ? <SoftOut>{frozenPrev}</SoftOut> : tin === 'push' ? <PushOut>{frozenPrev}</PushOut> : <AbsoluteFill>{frozenPrev}</AbsoluteFill>}
                  </SfxMuteContext.Provider>
                </Sequence>
              )}
              {tin === 'slide' && (
                <Sequence from={from} durationInFrames={SLIDE} name={`puertas ${prev!.id}→${sh.id}`}>
                  <SlideDoors a={sh.slide?.[0]} b={sh.slide?.[1]} />
                </Sequence>
              )}
              {tin !== 'cut' && TSFX[tin].map(([n, v, off], k) => <Sfx key={k} name={n} at={from + off} volume={v} />)}
            </React.Fragment>
          );
        })}
        {(!STEM || STEM === 'vo') && SCENES.map((s) => s.items.map((it, k) => (
          <Sequence key={`${s.id}-${k}`} from={start(s.id) + it.at} layout="none" name={`vo:${it.id}`}>
            <Audio src={voSrc(it.id)} />
          </Sequence>
        )))}
      </SfxBusContext.Provider>
      {(!STEM || STEM === 'music') && CUES.map((c, i) => {
        const from = start(c.at);
        const end = i + 1 < CUES.length ? start(CUES[i + 1].at) : TOTAL;
        const tail = i + 1 < CUES.length ? sec(1.1) : 0;
        return (
          <Sequence key={c.src} from={from} durationInFrames={end - from + tail} name={`music:${c.at}`} layout="none">
            <Audio src={staticFile(c.src)} volume={(f) => {
              const abs = from + f;
              const fadeIn = i === 0 ? 1 : interpolate(f, [0, sec(0.35)], [0.25, 1], clamp);
              const fadeOut = i + 1 < CUES.length ? interpolate(abs, [end, end + tail], [1, 0], clamp) : interpolate(abs, [TOTAL - sec(1.5), TOTAL], [1, 0], clamp);
              return c.gain * musicDuck(abs) * fadeIn * fadeOut;
            }} />
          </Sequence>
        );
      })}
      <Grain o={0.4} step={12} />
    </AbsoluteFill>
  );
};
export const EB_TOTAL = TOTAL;
