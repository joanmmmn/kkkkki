import React from 'react';
import { AbsoluteFill } from 'remotion';
import { color, font, MpStage, SceneProps } from './kit';

export const Placeholder = (id: string): React.FC<SceneProps> => () => (
  <MpStage>
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 120, color: color.muted }}>{id}</AbsoluteFill>
  </MpStage>
);
