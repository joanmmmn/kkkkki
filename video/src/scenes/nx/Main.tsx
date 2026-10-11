import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { NX_SCENES, nxStart, NX_TOTAL, nxVoIntervals, hasVO } from './timeline';
import { NX_COMPONENTS } from './registry';
import { NX_STEPS, NX_STEP_SCENES } from './steps';
import { voSrc } from '../../lib/vo';
import { Sfx, STEM } from '../../components/Sfx';
import { Stepper } from '../../components/Stepper';
import { clamp, easeInOut, easeOut } from '../../lib/anim';

export const NX_MUSIC: string | null = null; // se compone con ElevenLabs Music cuando el montaje esté cerrado

// Transición entre escenas (igual que en la reseña): la saliente avanza y se desenfoca; la entrante llega desde atrás.
const IN = 11;
const OUT = 7;
const SceneShell: React.FC<{ dur: number; first: boolean; last: boolean; children: React.ReactNode }> = ({ dur, first, last, children }) => {
  const frame = useCurrentFrame();
  const pin = first ? 1 : interpolate(frame, [0, IN], [0, 1], { ...clamp, easing: easeOut });
  const pout = last ? 0 : interpolate(frame, [dur - OUT, dur], [0, 1], { ...clamp, easing: easeInOut });
  const drift = 1 + 0.01 * (frame / dur);
  const scale = drift * (0.97 + 0.03 * pin) * (1 + 0.04 * pout);
  const blur = (1 - pin) * 8 + pout * 7;
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})`, filter: blur > 0.05 ? `blur(${blur}px)` : undefined, opacity: (0.35 + 0.65 * pin) * (1 - 0.5 * pout) }}>
      {children}
    </AbsoluteFill>
  );
};

export const NextoryTutorial: React.FC = () => {
  const { fps } = useVideoConfig();
  const vo = nxVoIntervals();
  const sec = (s: number) => Math.round(s * fps);
  const env = (f: number, list: (readonly [number, number])[]) => {
    let d = 0;
    for (const [a, b] of list) d = Math.max(d, interpolate(f, [a - sec(0.15), a, b, b + sec(0.35)], [0, 1, 1, 0], clamp));
    return d;
  };
  const musicVolume = (f: number) => {
    const duck = 0.45 * env(f, vo);
    const fadeIn = interpolate(f, [0, fps * 0.4], [0, 1], { extrapolateRight: 'clamp' });
    const fadeOut = interpolate(f, [NX_TOTAL - fps * 1.4, NX_TOTAL], [1, 0], clamp);
    return 0.2 * (1 - duck) * fadeIn * fadeOut;
  };
  const steps = NX_STEPS.map((label, i) => ({ label, at: nxStart(NX_STEP_SCENES[i]) }));
  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      {NX_SCENES.map((s, i) => {
        const C = NX_COMPONENTS[s.id];
        return (
          <Sequence key={s.id} from={nxStart(s.id)} durationInFrames={s.dur} name={s.id}>
            <SceneShell dur={s.dur} first={i === 0} last={i === NX_SCENES.length - 1}>
              <C lead={s.lead} dur={s.dur} />
            </SceneShell>
            {(!STEM || STEM === 'vo') && s.vo.filter((v) => hasVO(v.id)).map((v, k) => (
              <Sequence key={k} from={v.at} layout="none" name={`vo:${v.id}`}>
                <Audio src={voSrc(v.id)} />
              </Sequence>
            ))}
          </Sequence>
        );
      })}
      <Stepper steps={steps} show={nxStart('N02') - 4} hide={nxStart('N08') + 4} />
      {NX_SCENES.slice(1).map((s) => <Sfx key={s.id} name="transition" at={nxStart(s.id)} volume={0.6} />)}
      {NX_MUSIC && (!STEM || STEM === 'music') && <Audio src={staticFile(NX_MUSIC)} volume={musicVolume} />}
    </AbsoluteFill>
  );
};
