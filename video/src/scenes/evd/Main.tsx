import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { SCENES_EVD, startEvd, TOTAL_EVD, voIntervalsEvd } from './timeline';
import { voSrc } from '../../lib/vo';
import { Placeholder } from '../elt/Placeholder';
import { EVD_MUSIC } from '../../lib/config';
import { SCENE_COMPONENTS_EVD } from './registry';
import { Sfx, STEM } from '../../components/Sfx';
import { clamp, easeInOut, easeOut } from '../../lib/anim';

// Transición entre escenas (como en la reseña de El Libro Total): la saliente avanza hacia la cámara y se desenfoca,
// la entrante llega desde atrás, y una deriva lenta de cámara evita planos estáticos.
const IN = 12;
const OUT = 10;
const SceneShell: React.FC<{ dur: number; first: boolean; last: boolean; children: React.ReactNode }> = ({ dur, first, last, children }) => {
  const frame = useCurrentFrame();
  const pin = first ? 1 : interpolate(frame, [0, IN], [0, 1], { ...clamp, easing: easeOut });
  const pout = last ? 0 : interpolate(frame, [dur - OUT, dur], [0, 1], { ...clamp, easing: easeInOut });
  const drift = 1 + 0.014 * (frame / dur);
  const scale = drift * (0.965 + 0.035 * pin) * (1 + 0.05 * pout);
  const blur = (1 - pin) * 9 + pout * 10;
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})`, filter: blur > 0.05 ? `blur(${blur}px)` : undefined, opacity: (0.35 + 0.65 * pin) * (1 - 0.6 * pout) }}>
      {children}
    </AbsoluteFill>
  );
};

// Reseña de Everand (antes Scribd).
export const EVDReview: React.FC = () => {
  const { fps } = useVideoConfig();
  const vo = voIntervalsEvd();
  const sec = (s: number) => Math.round(s * fps);
  const env = (f: number, list: (readonly [number, number])[]) => {
    let d = 0;
    for (const [a, b] of list) d = Math.max(d, interpolate(f, [a - sec(0.15), a, b, b + sec(0.35)], [0, 1, 1, 0], clamp));
    return d;
  };
  const musicVolume = (f: number) => {
    const duck = 0.42 * env(f, vo);
    const fadeIn = interpolate(f, [0, fps * 0.6], [0, 1], { extrapolateRight: 'clamp' });
    const fadeOut = interpolate(f, [TOTAL_EVD - fps * 1.2, TOTAL_EVD], [1, 0], clamp);
    return 0.2 * (1 - duck) * fadeIn * fadeOut;
  };
  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      {SCENES_EVD.map((s, i) => {
        const C = SCENE_COMPONENTS_EVD[s.id] ?? Placeholder;
        return (
          <Sequence key={s.id} from={startEvd(i)} durationInFrames={s.dur} name={s.id}>
            <SceneShell dur={s.dur} first={i === 0} last={i === SCENES_EVD.length - 1}>
              <C lead={s.lead} dur={s.dur} />
            </SceneShell>
            {(!STEM || STEM === 'vo') && (
              <Sequence from={s.lead} layout="none" name={`vo:${s.id}`}>
                <Audio src={voSrc(s.id)} />
              </Sequence>
            )}
          </Sequence>
        );
      })}
      {SCENES_EVD.slice(1).map((s, i) => <Sfx key={s.id} name="transition" at={startEvd(i + 1)} volume={0.75} />)}
      {(!STEM || STEM === 'music') && <Audio src={staticFile(EVD_MUSIC)} volume={musicVolume} />}
    </AbsoluteFill>
  );
};
