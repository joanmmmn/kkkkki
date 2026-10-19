import React from 'react';
import { AbsoluteFill, Freeze, getInputProps, useCurrentFrame } from 'remotion';
import { KRK_COMPONENTS } from '../registry';
import { BOOKS, Book3D, Cover } from '../kit';

// Hoja de cubiertas: todas las de la colección del episodio.
const CoversGrid: React.FC = () => {
  const keys = Object.keys(BOOKS);
  const page = P.frames?.[0] ?? 0;
  const list = keys.slice(page * 12, page * 12 + 12);
  return (
    <AbsoluteFill style={{ background: '#E9E6DF', flexDirection: 'row', flexWrap: 'wrap', gap: 24, padding: 40, alignContent: 'flex-start' }}>
      {list.map((k) => <div key={k} style={{ position: 'relative', width: 270, height: 405, borderRadius: 6, overflow: 'hidden', boxShadow: '0 12px 30px rgba(0,0,0,0.25)' }}><Cover b={BOOKS[k]} w={270} h={405} /></div>)}
      <div style={{ position: 'absolute', right: 80, bottom: 60 }}><Book3D b={BOOKS[list[0]]} w={200} h={300} d={40} ry={-30} /></div>
    </AbsoluteFill>
  );
};

// Composición de pruebas: cada fotograma de salida es un fotograma elegido de una escena (para hojas de contacto rápidas).
// npx remotion render src/index.ts DSKLab out.mp4 --props='{"pairs":[["HOOK",20],["P1",300]]}' --sequence
const P = getInputProps() as { scene?: string; frames?: number[]; pairs?: [string, number][] };
export const KRK_LAB_FRAMES = P.pairs ? P.pairs.map((p) => p[1]) : P.frames ?? [0];
export const KrkLab: React.FC = () => {
  const i = useCurrentFrame();
  const scene = P.pairs ? P.pairs[Math.min(i, P.pairs.length - 1)][0] : P.scene ?? 'COVERS';
  const C = scene === 'COVERS' ? CoversGrid : KRK_COMPONENTS[scene] ?? (() => <AbsoluteFill style={{ background: '#ddd' }} />);
  return (
    <Freeze frame={scene === 'COVERS' ? 0 : KRK_LAB_FRAMES[Math.min(i, KRK_LAB_FRAMES.length - 1)]}>
      <C />
    </Freeze>
  );
};
