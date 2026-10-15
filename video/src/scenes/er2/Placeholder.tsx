import React from 'react';
import { AbsoluteFill } from 'remotion';
import { color, font } from '../../brand/tokens';
import { Stage } from '../../components/Stage';

export const er2Placeholder = (label: string): React.FC<{ lead: number; dur: number }> => () => (
  <Stage>
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 60, color: color.ink2 }}>{label}</div>
    </AbsoluteFill>
  </Stage>
);
