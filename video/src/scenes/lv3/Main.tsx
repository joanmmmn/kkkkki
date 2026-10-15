import React from 'react';
import { AbsoluteFill, Audio, Freeze, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { voSrc } from '../../lib/vo';
import { Sfx, SfxBusContext, SfxMuteContext, SfxName, STEM } from '../../components/Sfx';
import { clamp } from '../../lib/anim';
import { MotionContext } from '../../lib/motion';
import { follow, Grain, Night, SetView } from './kit';
import { PageTurn, PT, SOFT, SoftIn, SoftOut } from './frames';
import { clipIntervals, scene, SCENES, speech, start, TOTAL } from './timeline';
import { SHOTS } from './shots';

// LibriVox: qué es, cómo funciona y cómo usarlo — vídeo por capítulos («la biblioteca que habla»).
// Un solo fondo (noche de biblioteca con haz de luz y polvo) y, encima, los planos. Cada plano abarca una o varias
// escenas de la locución (timeline3.json) y entra con un corte, un fundido o un giro de página (portadillas).

// Música: cuatro piezas compuestas para este vídeo (una por acto), normalizadas; bajan bajo la voz.
const CUES: { src: string; at: string; gain: number }[] = [
  { src: 'music/lv3/c1_opening_n.mp3', at: 'S01', gain: 0.42 },
  { src: 'music/lv3/c2_platform_n.mp3', at: 'S04', gain: 0.32 },
  { src: 'music/lv3/c3_tutorial_n.mp3', at: 'S08', gain: 0.3 },
  { src: 'music/lv3/c4_ending_n.mp3', at: 'S06', gain: 0.34 },
];
export const LV3_MUSIC = CUES.map((c) => c.src);

const TSFX: Record<'soft' | 'page', [SfxName, number, number][]> = {
  soft: [['deep_whoosh', 0.55, 6]],
  page: [['page_turn_big', 0.9, 2], ['deep_whoosh', 0.35, 10]],
};

export const LibriVoxGuide: React.FC = () => {
  const { fps } = useVideoConfig();
  const sec = (s: number) => Math.round(s * fps);
  const sp = speech();
  const clips = clipIntervals();
  const env = (f: number, list: (readonly [number, number])[], pre = 0.15, post = 0.35) => {
    let d = 0;
    for (const [a, b] of list) {
      if (f < a - sec(pre) || f > b + sec(post)) continue;
      d = Math.max(d, interpolate(f, [a - sec(pre), a, b, b + sec(post)], [0, 1, 1, 0], clamp));
    }
    return d;
  };
  // Música: −55 % bajo la locución y −82 % bajo los voluntarios (es lo que hay que escuchar)
  const musicDuck = (f: number) => 1 - Math.max(0.55 * env(f, sp), 0.82 * env(f, clips));
  const sfxBus = { gain: 0.95, duck: (f: number) => 1 - Math.max(0.25 * env(f, sp, 0.05, 0.1), 0.6 * env(f, clips, 0.05, 0.1)) };
  const shotStart = (i: number) => start(SHOTS[i].scenes[0]);
  const shotDur = (i: number) => SHOTS[i].scenes.reduce((a, id) => a + scene(id).dur, 0);
  // Encuadre del fondo: en cada plano se desplaza despacio de su encuadre inicial al final; entre planos, un muelle
  // lo lleva de uno a otro sin saltos.
  const frame = useCurrentFrame();
  const bgKeys = SHOTS.flatMap((sh, i) => [{ f: shotStart(i), ...sh.bg[0] }, { f: shotStart(i) + shotDur(i) - 1, ...sh.bg[1] }]);
  const bgV = follow(frame, bgKeys, 3.2) as unknown as SetView;
  return (
    <MotionContext.Provider value={{ soft: true }}>
      <AbsoluteFill style={{ background: '#000' }}>
        <Night view={bgV} />
        <SfxBusContext.Provider value={sfxBus}>
          {SHOTS.map((sh, i) => {
            const from = shotStart(i), dur = shotDur(i);
            const prev = i > 0 ? SHOTS[i - 1] : null;
            const P = prev?.C;
            const C = sh.C;
            const tin = i === 0 ? 'cut' : sh.tin;
            return (
              <React.Fragment key={sh.id}>
                {/* plano anterior congelado bajo un fundido */}
                {P && prev && tin === 'soft' && (
                  <Sequence from={from} durationInFrames={SOFT} name={`fundido:${prev.id}→${sh.id}`}>
                    <SfxMuteContext.Provider value>
                      <SoftOut><Freeze frame={shotDur(i - 1) - 1}><P dur={shotDur(i - 1)} /></Freeze></SoftOut>
                    </SfxMuteContext.Provider>
                  </Sequence>
                )}
                <Sequence from={from} durationInFrames={dur} name={`plano ${sh.id}`}>
                  {tin === 'soft' ? <SoftIn><C dur={dur} /></SoftIn> : <C dur={dur} />}
                </Sequence>
                {/* giro de página: el plano anterior, congelado, es la hoja que gira encima */}
                {P && prev && tin === 'page' && (
                  <Sequence from={from} durationInFrames={PT} name={`página:${prev.id}→${sh.id}`}>
                    <SfxMuteContext.Provider value>
                      <PageTurn><Freeze frame={shotStart(i) - 1}><Night view={bgV} /></Freeze><Freeze frame={shotDur(i - 1) - 1}><P dur={shotDur(i - 1)} /></Freeze></PageTurn>
                    </SfxMuteContext.Provider>
                  </Sequence>
                )}
                {tin !== 'cut' && TSFX[tin].map(([n, v, off], k) => <Sfx key={k} name={n} at={from + off} volume={v} />)}
              </React.Fragment>
            );
          })}
          {(!STEM || STEM === 'vo') && SCENES.map((s) => s.items.map((it, k) => (
            <Sequence key={`${s.id}-${k}`} from={start(s.id) + it.at} layout="none" name={`${it.kind}:${it.id}`}>
              <Audio src={it.kind === 'vo' ? voSrc(it.id) : staticFile(`lv/audio3/${it.id}.mp3`)} />
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
        <Grain o={0.05} />
      </AbsoluteFill>
    </MotionContext.Provider>
  );
};
export const LV3_TOTAL = TOTAL;
