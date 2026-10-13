import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../../components/Sfx';
import { At, BookCover, eIO, eOut, follow, img3, ramp, Rig, Space, sp, T } from './kit';
import { w } from './timeline';

// Plano E (S07): los clásicos en español de LibriVox llegan a una balda, uno por uno, mientras se nombran; encima, las
// cifras. Al final («Vamos a encontrarlas») la cámara se acerca a las Leyendas.
type B = { id: string; title: string; word?: string; x: number };
const SHELF: B[] = [
  { id: '16285', title: 'Marianela', x: -1220 },
  { id: '20198', title: 'Don Quijote', word: 'Quijote', x: -920 },
  { id: '3579', title: 'Lazarillo de Tormes', word: 'Lazarillo', x: -620 },
  { id: '13208', title: 'La Regenta', word: 'Regenta', x: -320 },
  { id: '14336', title: 'Fortunata y Jacinta', word: 'Fortunata', x: -20 },
  { id: '5079', title: 'Leyendas', word: 'Leyendas', x: 280 },
  { id: '10541', title: 'Los pazos de Ulloa', x: 580 },
  { id: '17676', title: 'María', x: 880 },
  { id: '13242', title: 'Rimas', x: 1180 },
];
const SIZE = 250;

export const Shelf: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w('S07', 'K07', word, n);
  const fMil = at('mil');
  const fHoras = at('horas');
  const fVamos = at('Vamos');
  const cam = follow(frame, [
    { f: 0, x: -420, y: -10, z: -520, rx: 8, ry: 10 },
    { f: at('Quijote'), x: -440, y: 0, z: -470, rx: 8, ry: 8 },
    { f: at('Leyendas') + 10, x: 60, y: 10, z: -430, rx: 7, ry: -3 },
    { f: fVamos, x: 200, y: 30, z: -330, rx: 6, ry: -6 },
    { f: dur, x: 280, y: 40, z: 180, rx: 4, ry: -10 },
  ], 4.6);
  const shelf = sp(frame, 0, fps, 90, 20);
  const n1 = sp(frame, fMil - 6, fps, 110, 22);
  const n2 = sp(frame, fHoras - 6, fps, 110, 22);
  const SY = 230; // altura de la balda
  return (
    <AbsoluteFill>
      <Space persp={1700}>
        <Rig cam={{ x: cam.x, y: cam.y, z: cam.z, rx: cam.rx, ry: cam.ry }}>
          {/* pared de libros desenfocada al fondo */}
          <At x={0} y={-200} z={-1600} w={6400} h={2600} o={0.55 * shelf}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${img3('shelves.jpg')})`, backgroundSize: '3600px 1500px', filter: 'brightness(0.55) blur(3px)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(60% 60% at 50% 40%, rgba(0,0,0,0) 0%, rgba(8,6,4,0.85) 100%)' }} />
          </At>
          {/* balda de madera */}
          <At x={0} y={SY + 14} w={3000} h={30} o={shelf}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #8a6440 0%, #6a4a2e 35%, #3e2a1a 100%)', borderRadius: 3, boxShadow: '0 30px 60px rgba(0,0,0,0.7)' }} />
          </At>
          <At x={0} y={SY} z={-100} w={3000} h={200} rx={90} o={shelf}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, #5a3f28, #3a2819)' }} />
          </At>
          {/* libros */}
          {SHELF.map((b, i) => {
            const named = b.word ? at(b.word) : -1;
            const arrive = b.word ? sp(frame, named - 10, fps, 120, 20) : sp(frame, 4 + i * 3, fps, 100, 22);
            const glow = b.word ? ramp(frame, named - 4, named + 10, eOut) * (1 - ramp(frame, named + 40, named + 90, eIO)) : 0;
            const dim = b.word ? 0 : 0.45;
            return (
              <At key={b.id} x={b.x} y={SY - SIZE / 2} z={(1 - arrive) * 260} w={SIZE} h={SIZE} o={arrive} ry={-4}>
                <div style={{ transform: `translateY(${(1 - arrive) * -160}px)`, transformStyle: 'preserve-3d' }}>
                  <BookCover id={b.id} size={SIZE} depth={30} shade={dim} />
                </div>
                <div style={{ position: 'absolute', inset: -6, borderRadius: 6, boxShadow: `0 0 ${40 * glow}px ${10 * glow}px rgba(255,214,150,${0.55 * glow})`, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', left: -50, right: -50, top: SIZE + 44, textAlign: 'center', fontFamily: T.serif, fontStyle: 'italic', fontSize: 40, whiteSpace: 'nowrap', color: b.word ? T.cream : T.creamDim, opacity: b.word ? ramp(frame, named - 4, named + 12, eOut) : 0.0 }}>{b.title}</div>
              </At>
            );
          })}
          {/* cifras */}
          <At x={-220} y={-360} z={60} w={900} h={260} o={n1}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `translateY(${(1 - n1) * 40}px)` }}>
              <div style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 170, lineHeight: 0.9, color: T.cream }}>1.000<span style={{ color: T.gold }}>+</span></div>
              <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 44, color: T.creamSoft, marginTop: 10 }}>obras en español</div>
            </div>
          </At>
          <At x={560} y={-360} z={60} w={900} h={260} o={n2}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `translateY(${(1 - n2) * 40}px)` }}>
              <div style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 170, lineHeight: 0.9, color: T.cream }}>3.500<span style={{ color: T.gold }}>+</span></div>
              <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 44, color: T.creamSoft, marginTop: 10 }}>horas de audio</div>
            </div>
          </At>
        </Rig>
      </Space>
      <Sfx name="soft_impact" at={fMil} volume={0.5} />
      <Sfx name="soft_impact" at={fHoras} volume={0.45} />
      {SHELF.filter((b) => b.word).map((b) => <Sfx key={b.id} name="card_drop" at={at(b.word!) - 2} volume={0.55} />)}
      <Sfx name="deep_whoosh" at={fVamos + 6} volume={0.5} />
    </AbsoluteFill>
  );
};
