import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { Stage } from '../../components/Stage';
import { RealPhone, TapRipple } from '../../components/RealPhone';

export const PhoneTest: React.FC = () => {
  const frame = useCurrentFrame();
  const ry = -24 + frame * 0.9;
  return (
    <Stage tone="warm">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 120 }}>
        {[ry, 0, 18].map((r, i) => (
          <RealPhone key={i} w={360} rotY={r} rotX={i === 2 ? 8 : 0} rotZ={i === 2 ? -4 : 0} tone={i === 1 ? 'silver' : 'graphite'}>
            <Img src={staticFile('nx/rec/10_hook_ficha/last.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {i === 1 && <TapRipple x={180} y={400} frame={frame} at={10} />}
          </RealPhone>
        ))}
      </AbsoluteFill>
    </Stage>
  );
};
