import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { NXR_SCENES, nxrStart, NXR_TOTAL, nxrVoIntervals, hasVO, NXR_CHAPTERS } from './timeline';
import { NXR_COMPONENTS } from './registry';
import { voSrc } from '../../lib/vo';
import { Sfx, STEM } from '../../components/Sfx';
import { clamp, easeInOut, easeOut } from '../../lib/anim';
import { ChapterRail } from './kit';

export const NXR_MUSIC: string | null = null; // ElevenLabs Music (pendiente de la clave)

// Transición entre escenas: la saliente avanza y se desenfoca; la entrante llega desde atrás.
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

export const NextoryReview: React.FC = () => {
  const { fps } = useVideoConfig();
  const vo = nxrVoIntervals();
  const sec = (s: number) => Math.round(s * fps);
  const env = (f: number, list: (readonly [number, number])[]) => {
    let d = 0;
    for (const [a, b] of list) d = Math.max(d, interpolate(f, [a - sec(0.15), a, b, b + sec(0.35)], [0, 1, 1, 0], clamp));
    return d;
  };
  const musicVolume = (f: number) => {
    const duck = 0.45 * env(f, vo);
    const fadeIn = interpolate(f, [0, fps * 0.4], [0, 1], { extrapolateRight: 'clamp' });
    const fadeOut = interpolate(f, [NXR_TOTAL - fps * 1.4, NXR_TOTAL], [1, 0], clamp);
    return 0.2 * (1 - duck) * fadeIn * fadeOut;
  };
  const chapters = NXR_CHAPTERS.map((c) => ({ label: c.label, at: nxrStart(c.from) }));
  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      {NXR_SCENES.map((s, i) => {
        const C = NXR_COMPONENTS[s.id];
        return (
          <Sequence key={s.id} from={nxrStart(s.id)} durationInFrames={s.dur} name={s.id}>
            <SceneShell dur={s.dur} first={i === 0} last={i === NXR_SCENES.length - 1}>
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
      <ChapterRail chapters={chapters} show={nxrStart('R02') - 4} hide={nxrStart('P06') + 4} />
      {NXR_SCENES.slice(1).map((s) => <Sfx key={s.id} name="transition" at={nxrStart(s.id)} volume={0.6} />)}
      {NXR_MUSIC && (!STEM || STEM === 'music') && <Audio src={staticFile(NXR_MUSIC)} volume={musicVolume} />}
    </AbsoluteFill>
  );
};
