import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useVideoConfig } from 'remotion';
import { SCENES2, start2, TOTAL2, voIntervals2 } from './timeline';
import { voSrc } from '../../lib/vo';
import { Placeholder } from '../elt/Placeholder';
import { MUSIC2 } from '../../lib/config';
import { SCENE_COMPONENTS } from './registry';

// Reseña v2: voz «Polished and Energetic», ritmo continuo.
export const ELTReview2: React.FC = () => {
  const { fps } = useVideoConfig();
  const intervals = voIntervals2();
  const musicVolume = (f: number) => {
    let duck = 0;
    for (const [a, b] of intervals) {
      duck = Math.max(duck, interpolate(f, [a - fps * 0.3, a, b, b + fps * 0.4], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
    }
    const fadeIn = interpolate(f, [0, fps * 1.0], [0, 1], { extrapolateRight: 'clamp' });
    const fadeOut = interpolate(f, [TOTAL2 - fps * 3, TOTAL2], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    return (0.26 - 0.165 * duck) * fadeIn * fadeOut;
  };
  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      {SCENES2.map((s, i) => {
        const C = SCENE_COMPONENTS[s.id] ?? Placeholder;
        return (
          <Sequence key={s.id} from={start2(i)} durationInFrames={s.dur} name={s.id}>
            <C lead={s.lead} dur={s.dur} />
            {s.vo.map((v, k) => (
              <Sequence key={k} from={v.at} layout="none" name={`vo:${v.id}`}>
                <Audio src={voSrc(v.id)} />
              </Sequence>
            ))}
            {(s.audio ?? []).map((a, k) => (
              <Sequence key={`a${k}`} from={a.at} durationInFrames={a.dur} layout="none" name={`orig:${a.src}`}>
                <Audio src={staticFile(a.src)} />
              </Sequence>
            ))}
          </Sequence>
        );
      })}
      <Audio src={staticFile(MUSIC2)} volume={musicVolume} />
    </AbsoluteFill>
  );
};
