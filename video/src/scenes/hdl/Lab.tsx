import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Layer, PaperFinish, Person, Rig, Sky, sitPose } from './theatre';
import { House } from './house';

// Banco de pruebas de la v2 (no va al vídeo).
export const HDLLab: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Rig cam={{ x: 960, y: 600, s: 0.95, r: 0 }}>
        <Sky stops={[[0, '#0B1522'], [60, '#1B2C3F'], [100, '#2E3B48']]} glows={[{ x: 960, y: 900, r: 1000, c: '#E39A55', a: 0.18 }]} />
        <Layer z={1}>
          <House ink="#140D08" frame={frame} />
          <Person x={600} y={612} scale={1.05} kind="man" hair="curly" mustache pose={sitPose({ shF: 50, elF: 30, shB: 40, elB: 40 })} c="#140D08" />
          <Person x={1210} y={958} scale={1.1} face={-1} kind="woman" hair="bob" pose={{ shF: 20, elF: 50 }} c="#140D08" />
          <Person x={870} y={612} scale={1.0} kind="boy" hair="kid" pose={{ shF: 30, elF: 20 }} c="#140D08" />
          <Person x={1000} y={612} scale={0.9} face={-1} kind="boy" hair="kid" pose={{ shF: 10, elF: 40 }} c="#140D08" />
        </Layer>
        <PaperFinish />
      </Rig>
    </AbsoluteFill>
  );
};
