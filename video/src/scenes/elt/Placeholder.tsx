import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Stage } from '../../components/Stage';
import { font } from '../../brand/tokens';

export const Placeholder: React.FC<{ lead: number; dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <Stage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontSize: 40, color: '#999' }}>
        Escena en construcción · {Math.round((frame / dur) * 100)} %
      </AbsoluteFill>
    </Stage>
  );
};
