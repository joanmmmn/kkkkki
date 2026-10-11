import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { ER2_SCENES, er2Start, ER2_TOTAL, er2Speech, er2ClipIntervals } from './timeline';
import { ER2_COMPONENTS } from './registry';
import { voSrc } from '../../lib/vo';
import { Sfx, STEM } from '../../components/Sfx';
import { clamp, easeInOut, easeOut } from '../../lib/anim';

// Música compuesta para la reseña (ElevenLabs Music, secciones alineadas con las escenas).
export const ER2_MUSIC: string | null = 'music/er_review.mp3';

// Transición entre escenas: la saliente avanza y se desenfoca; la entrante llega desde atrás (como en las reseñas).
const IN = 11;
const OUT = 7;
const SceneShell: React.FC<{ dur: number; first: boolean; last: boolean; children: React.ReactNode }> = ({ dur, first, last, children }) => {
  const frame = useCurrentFrame();
  const pin = first ? 1 : interpolate(frame, [0, IN], [0, 1], { ...clamp, easing: easeOut });
  const pout = last ? 0 : interpolate(frame, [dur - OUT, dur], [0, 1], { ...clamp, easing: easeInOut });
  const drift = 1 + 0.012 * (frame / dur);
  const scale = drift * (0.965 + 0.035 * pin) * (1 + 0.05 * pout);
  const blur = (1 - pin) * 9 + pout * 8;
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})`, filter: blur > 0.05 ? `blur(${blur}px)` : undefined, opacity: (0.35 + 0.65 * pin) * (1 - 0.55 * pout) }}>
      {children}
    </AbsoluteFill>
  );
};

export const ElevenReaderReview: React.FC = () => {
  const { fps } = useVideoConfig();
  const speech = er2Speech();
  const clips = er2ClipIntervals();
  const sec = (s: number) => Math.round(s * fps);
  const env = (f: number, list: (readonly [number, number])[]) => {
    let d = 0;
    for (const [a, b] of list) d = Math.max(d, interpolate(f, [a - sec(0.15), a, b, b + sec(0.35)], [0, 1, 1, 0], clamp));
    return d;
  };
  const musicVolume = (f: number) => {
    let duck = 0.42 * env(f, speech);
    // Bajo la narración de ElevenReader la música casi desaparece: es lo que hay que escuchar.
    duck = Math.max(duck, 0.8 * env(f, clips));
    const fadeIn = interpolate(f, [0, fps * 0.6], [0, 1], { extrapolateRight: 'clamp' });
    const fadeOut = interpolate(f, [ER2_TOTAL - fps * 1.2, ER2_TOTAL], [1, 0], clamp);
    return 0.2 * (1 - duck) * fadeIn * fadeOut;
  };
  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      {ER2_SCENES.map((s, i) => {
        const C = ER2_COMPONENTS[s.id];
        return (
          <Sequence key={s.id} from={er2Start(s.id)} durationInFrames={s.dur} name={s.id}>
            <SceneShell dur={s.dur} first={i === 0} last={i === ER2_SCENES.length - 1}>
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
      {ER2_SCENES.slice(1).map((s) => <Sfx key={s.id} name="transition" at={er2Start(s.id)} volume={0.7} />)}
      {ER2_MUSIC && (!STEM || STEM === 'music') && <Audio src={staticFile(ER2_MUSIC)} volume={musicVolume} />}
    </AbsoluteFill>
  );
};
