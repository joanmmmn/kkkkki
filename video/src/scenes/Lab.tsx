import React from 'react';
import { AbsoluteFill, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Stage } from '../components/Stage';
import { BrowserWindow } from '../components/BrowserWindow';
import { ScreenClip } from '../components/ScreenClip';
import { Logo } from '../components/Logo';
import { Highlight } from '../components/Highlight';
import { Words } from '../components/Kinetic';
import cursor from '../../public/elt/rec/01_home/cursor.json';

// Composición de pruebas del sistema visual.
export const Lab: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 24, stiffness: 120 } });
  return (
    <Stage>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ transform: `perspective(2400px) rotateX(${(1 - s) * 18}deg) scale(${0.86 + 0.14 * s})`, opacity: s }}>
          <BrowserWindow width={1560}>
            <ScreenClip
              src="elt/rec/01_home/video.mp4"
              width={1560}
              cursor={cursor}
              camera={[
                { f: 0, zoom: 1, x: 960, y: 540 },
                { f: 150, zoom: 1, x: 960, y: 540 },
                { f: 230, zoom: 1.9, x: 330, y: 600 },
                { f: 520, zoom: 1.9, x: 330, y: 600 },
                { f: 600, zoom: 1, x: 960, y: 540 },
              ]}
            />
          </BrowserWindow>
        </div>
      </AbsoluteFill>
      <Sequence from={0} durationInFrames={120}>
        <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: 30 }}>
          <Words text="Así es El Libro Total por dentro" size={44} start={10} />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={700}>
        <AbsoluteFill style={{ background: 'white', alignItems: 'center', justifyContent: 'center', gap: 40, flexDirection: 'column' }}>
          <Logo size={110} />
          <div style={{ fontFamily: 'Ubuntu', fontSize: 48, fontWeight: 500 }}>Tu próxima historia <Highlight start={40}>te está esperando.</Highlight></div>
        </AbsoluteFill>
      </Sequence>
    </Stage>
  );
};
