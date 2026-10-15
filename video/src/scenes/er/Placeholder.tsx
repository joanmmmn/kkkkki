import React from 'react';
import { AbsoluteFill } from 'remotion';
import { color, font } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { BrowserStage } from './common';

// Escena provisional hasta tener la grabación de Joan (plan, pago, confirmación, app y cuenta).
export const erPlaceholder = (label: string, detail: string): React.FC<{ lead: number; dur: number }> => () => (
  <Stage>
    <BrowserStage url="elevenreader.io">
      <AbsoluteFill style={{ background: 'repeating-linear-gradient(135deg, #F6F5F2 0 22px, #F1EFEA 22px 44px)', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 18 }}>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 46, color: color.ink2 }}>{label}</div>
        <div style={{ fontFamily: font.sans, fontSize: 30, color: color.muted }}>{detail}</div>
      </AbsoluteFill>
    </BrowserStage>
  </Stage>
);
