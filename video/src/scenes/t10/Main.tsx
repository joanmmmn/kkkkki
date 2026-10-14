import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { T10_SCENES, t10Start, T10_TOTAL, t10VoIntervals, hasVO, Tin, sceneDef } from './timeline';
import { T10_COMPONENTS } from './registry';
import { voSrc } from '../../lib/vo';
import { Sfx, STEM } from '../../components/Sfx';
import { clamp, easeOut } from '../../lib/anim';

export const T10_MUSIC: string | null = 'music/t10_bed.mp3'; // ElevenLabs Music por bloques (tools/t10_music.py)

const IN = 14;
const OV = 10;
const accel = (t: number) => t * t;
type Tr = Tin | 'first' | 'last';
// Transiciones: «push» y «slide» como en las reseñas; «dark» funde a negro (la escena entrante nace a oscuras); «cut», corte.
const SceneShell: React.FC<{ dur: number; over: number; tin: Tr; tout: Tr; children: React.ReactNode }> = ({ dur, over, tin, tout, children }) => {
  const frame = useCurrentFrame();
  const pushIn = tin === 'push';
  const pushOut = tout === 'push';
  const darkOut = tout === 'dark';
  const darkIn = tin === 'dark';
  const pin = pushIn ? interpolate(frame, [0, IN], [0, 1], { ...clamp, easing: easeOut }) : 1;
  const pout = pushOut ? interpolate(frame, [dur - 6, dur + over], [0, 1], { ...clamp, easing: accel }) : 0;
  const fadeIn = pushIn ? interpolate(frame, [0, 10], [0, 1], { ...clamp, easing: easeOut }) : darkIn ? interpolate(frame, [0, 6], [0, 1], clamp) : 1;
  const fadeOut = pushOut ? interpolate(frame, [dur - 2, dur + over], [1, 0], clamp) : darkOut ? interpolate(frame, [dur - 14, dur], [1, 0], clamp) : 1;
  const scale = (pushIn ? 0.965 + 0.035 * pin : 1) * (pushOut ? 1 + 0.045 * pout : 1) * (darkOut ? 1 + 0.03 * interpolate(frame, [dur - 14, dur], [0, 1], clamp) : 1);
  const blur = (pushIn ? (1 - pin) * 6 : 0) + (pushOut ? pout * 8 : 0);
  return (
    <AbsoluteFill style={{ transform: `translateY(${(pushIn ? (1 - pin) * 14 : 0).toFixed(2)}px) scale(${scale})`, filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined, opacity: fadeIn * fadeOut }}>
      {children}
    </AbsoluteFill>
  );
};

export const Top10Terror: React.FC = () => {
  const { fps } = useVideoConfig();
  const vo = t10VoIntervals();
  const sec = (s: number) => Math.round(s * fps);
  const env = (f: number, list: (readonly [number, number])[]) => {
    let d = 0;
    for (const [a, b] of list) d = Math.max(d, interpolate(f, [a - sec(0.18), a, b, b + sec(0.4)], [0, 1, 1, 0], clamp));
    return d;
  };
  const darkAt = t10Start('B10') + (sceneDef('B10').vo.find((v) => v.id === 'X105')?.at ?? 0);
  const tipAt = t10Start('TIP');
  const lifts = T10_SCENES.filter((s) => s.book || s.id === 'SERIE').map((s) => [t10Start(s.id), t10Start(s.id) + (s.vo[0]?.at ?? sec(1))] as const);
  const musicVolume = (f: number) => {
    const duck = 0.55 * env(f, vo);
    const lift = 1 + 0.4 * Math.max(0, ...lifts.map(([a, b]) => interpolate(f, [a, a + 6, b - 6, b], [0, 1, 1, 0], clamp)));
    const fadeIn = interpolate(f, [0, fps * 0.8], [0, 1], { extrapolateRight: 'clamp' });
    const fadeOut = interpolate(f, [T10_TOTAL - fps * 2, T10_TOTAL], [1, 0], clamp);
    // «Escúchalo de noche. Si te atreves.»: la música casi desaparece con el apagón y vuelve con el consejo.
    const quiet = interpolate(f, [darkAt - 4, darkAt + 10, tipAt - 6, tipAt + 20], [0, 1, 1, 0], clamp);
    return 0.24 * (1 - duck) * lift * fadeIn * fadeOut * (1 - 0.7 * quiet);
  };
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {T10_SCENES.map((s, i) => {
        const C = T10_COMPONENTS[s.id];
        const next = T10_SCENES[i + 1];
        const tin: Tr = i === 0 ? 'first' : s.tin;
        const tout: Tr = !next ? 'last' : next.tin;
        const over = next && tout === 'push' ? OV : 0;
        return (
          <Sequence key={s.id} from={t10Start(s.id)} durationInFrames={s.dur + over} name={s.id}>
            <SceneShell dur={s.dur} over={over} tin={tin} tout={tout}>{C ? <C /> : null}</SceneShell>
            {(!STEM || STEM === 'vo') && s.vo.filter((v) => hasVO(v.id)).map((v, k) => (
              <Sequence key={k} from={v.at} layout="none" name={`vo:${v.id}`}>
                <Audio src={voSrc(v.id)} />
              </Sequence>
            ))}
          </Sequence>
        );
      })}
      {T10_SCENES.slice(1).map((s) => (s.tin === 'push' ? <Sfx key={s.id} name="transition" at={t10Start(s.id) + 1} volume={0.5} /> : null))}
      {T10_MUSIC && (!STEM || STEM === 'music') && <Audio src={staticFile(T10_MUSIC)} volume={musicVolume} />}
    </AbsoluteFill>
  );
};
