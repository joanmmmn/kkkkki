import React from 'react';
import { AbsoluteFill } from 'remotion';
import { color, font } from '../../brand/tokens';
import { Stage } from '../../components/Stage';
import { BrowserStage } from './common';

// Escena provisional hasta tener la grabación del registro (contraseña, plan, pago, confirmación, cuenta).
export const nxPlaceholder = (label: string): React.FC<{ lead: number; dur: number }> => () => (
  <Stage>
    <BrowserStage url="nextory.com">
      <AbsoluteFill style={{ background: '#F1EDEA', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: font.sans, fontSize: 44, color: color.ink2 }}>[{label} · grabación pendiente]</div>
      </AbsoluteFill>
    </BrowserStage>
  </Stage>
);
