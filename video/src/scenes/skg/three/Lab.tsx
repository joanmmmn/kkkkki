import React from 'react';
import { Freeze, getInputProps, useCurrentFrame } from 'remotion';
import { SKG_COMPONENTS } from '../registry';
import { Hook3D } from './Library';
import { Hours3D } from './Desk';
import { Mapa3D } from './Map3D';
import { TitleCard } from './TitleCard';
import { AbsoluteFill } from 'remotion';
import { BOOKS, Book3D, Cover } from '../kit';

const CoversGrid: React.FC = () => {
  const keys = Object.keys(BOOKS);
  const page = (P.frames?.[0] ?? 0);
  const list = keys.slice(page * 12, page * 12 + 12);
  return (
    <AbsoluteFill style={{ background: '#E9E6DF', flexDirection: 'row', flexWrap: 'wrap', gap: 24, padding: 40, alignContent: 'flex-start' }}>
      {list.map((k) => <div key={k} style={{ position: 'relative', width: 270, height: 405, borderRadius: 6, overflow: 'hidden', boxShadow: '0 12px 30px rgba(0,0,0,0.25)' }}><Cover b={BOOKS[k]} w={270} h={405} /></div>)}
      <div style={{ position: 'absolute', right: 80, bottom: 60 }}><Book3D b={BOOKS[list[0]]} w={200} h={300} d={40} ry={-30} /></div>
    </AbsoluteFill>
  );
};

// Composición de pruebas: cada fotograma de salida es un fotograma elegido de una escena (para hojas de contacto rápidas).
// npx remotion render src/index.ts SKLab3D out.mp4 --props='{"scene":"HOOK","frames":[20,100,200]}' --sequence
const P = getInputProps() as { scene?: string; frames?: number[] };
export const LAB_FRAMES = P.frames ?? [20, 100, 150, 230, 300, 420, 600, 690];
export const Lab3D: React.FC = () => {
  const i = useCurrentFrame();
  const scene = P.scene ?? 'HOOK3D';
  const C = scene === 'COVERS' ? CoversGrid : scene === 'HOOK3D' ? Hook3D : scene === 'HOURS3D' ? Hours3D : scene === 'MAPA3D' ? Mapa3D : scene === 'TITLE3D' ? TitleCard : (SKG_COMPONENTS as Record<string, React.FC>)[scene];
  return (
    <Freeze frame={scene === 'COVERS' ? 0 : LAB_FRAMES[Math.min(i, LAB_FRAMES.length - 1)]}>
      <C />
    </Freeze>
  );
};
