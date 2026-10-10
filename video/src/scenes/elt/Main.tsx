import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useVideoConfig } from 'remotion';
import { SCENES, sceneStart, TOTAL, voIntervals } from './timeline';
import { voSrc } from '../../lib/vo';
import { S01Hook } from './S01Hook';
import { S02Brand } from './S02Brand';
import { S03What } from './S03What';
import { S04Home } from './S04Home';
import { S05Search } from './S05Search';
import { S06Listen } from './S06Listen';
import { S07Tools } from './S07Tools';
import { S08ProsCons } from './S08ProsCons';
import { S09Price } from './S09Price';
import { S10Verdict } from './S10Verdict';
import { Placeholder } from './Placeholder';

const COMPONENTS: Record<string, React.FC<{ lead: number; dur: number }>> = {
  E01: S01Hook,
  E02: S02Brand,
  E03: S03What,
  E04: S04Home,
  E05: S05Search,
  E06: S06Listen,
  E07: S07Tools,
  E08: S08ProsCons,
  E09: S09Price,
  E10: S10Verdict,
};

import { MUSIC } from '../../lib/config';

export const ELTReview: React.FC = () => {
  const { fps } = useVideoConfig();
  const intervals = voIntervals();
  // Música: 0.22 sin voz, 0.08 bajo la voz, con rampas de 0,4 s.
  const musicVolume = (f: number) => {
    let duck = 0;
    for (const [a, b] of intervals) {
      const d = interpolate(f, [a - fps * 0.4, a, b, b + fps * 0.5], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
      duck = Math.max(duck, d);
    }
    const fadeIn = interpolate(f, [0, fps * 1.5], [0, 1], { extrapolateRight: 'clamp' });
    const fadeOut = interpolate(f, [TOTAL - fps * 3, TOTAL], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    return (0.26 - 0.16 * duck) * fadeIn * fadeOut;
  };
  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      {SCENES.map((s, i) => {
        const C = COMPONENTS[s.id] ?? Placeholder;
        return (
          <Sequence key={s.id} from={sceneStart(i)} durationInFrames={s.dur} name={s.id}>
            <C lead={s.lead} dur={s.dur} />
            {s.vo.map((v, k) => (
              <Sequence key={k} from={v.at} layout="none" name={`vo:${v.id}`}>
                <Audio src={voSrc(v.id)} volume={1}
                  trimBefore={v.from !== undefined ? Math.round(v.from * fps) : undefined}
                  trimAfter={v.to !== undefined ? Math.round(v.to * fps) : undefined} />
              </Sequence>
            ))}
          </Sequence>
        );
      })}
      {MUSIC && <Audio src={staticFile(MUSIC)} volume={musicVolume} />}
    </AbsoluteFill>
  );
};
