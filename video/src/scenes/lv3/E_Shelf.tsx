import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../../components/Sfx';
import { At, BookCover, eIO, eOut, follow, GoldText, img3, paperBg, ramp, Rig, Space, sp, T } from './kit';
import { w } from './timeline';

// Plano E (S07): los clásicos en español de LibriVox llegan a una balda, uno por uno, mientras se nombran (caen
// inclinados y se asientan; de la balda cuelga su ficha de papel); encima, las cifras en oro, contando. Al final
// («Vamos a encontrarlas») la cámara se acerca a las Leyendas.
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
const countUp = Easing.bezier(0.2, 0.9, 0.3, 1);
// miles con punto también en las cifras de cuatro dígitos (1.000, 3.500), como en la locución y la página
const es = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const Shelf: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w('S07', 'K07', word, n);
  const fMil = at('mil');
  const fHoras = at('horas');
  const fTres = at('tres');
  const fVamos = at('Vamos');
  const cam = follow(frame, [
    { f: 0, x: -420, y: -10, z: -520, rx: 8, ry: 10 },
    { f: at('Quijote'), x: -440, y: 0, z: -470, rx: 8, ry: 8 },
    { f: at('Leyendas') + 10, x: 60, y: 10, z: -430, rx: 7, ry: -3 },
    { f: fVamos, x: 200, y: 30, z: -330, rx: 6, ry: -6 },
    { f: dur, x: 280, y: 40, z: 180, rx: 4, ry: -10 },
  ], 4.6);
  const shelf = sp(frame, 0, fps, 90, 20);
  const n1 = sp(frame, fMil - 10, fps, 110, 22);
  const n2 = sp(frame, fTres - 8, fps, 110, 22);
  // las cifras cuentan mientras se dicen
  const c1 = Math.round((1000 * countUp(ramp(frame, fMil - 10, fMil + 26, (x) => x))) / 10) * 10;
  const c2 = Math.round((3500 * countUp(ramp(frame, fTres - 8, fHoras + 6, (x) => x))) / 50) * 50;
  const plus1 = sp(frame, fMil + 22, fps, 160, 14), plus2 = sp(frame, fHoras + 2, fps, 160, 14);
  const SY = 230; // altura de la balda
  return (
    <AbsoluteFill>
      <Space persp={1700}>
        <Rig cam={{ x: cam.x, y: cam.y, z: cam.z, rx: cam.rx, ry: cam.ry }}>
          {/* pared de libros desenfocada al fondo, con la luz de una lámpara */}
          <At x={0} y={-200} z={-1600} w={6400} h={2600} o={shelf}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${img3('shelves_soft.jpg')})`, backgroundSize: 'cover', backgroundPosition: '50% 45%', backgroundRepeat: 'no-repeat' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(42% 48% at 52% 40%, rgba(255,206,140,0.3) 0%, rgba(255,206,140,0.08) 55%, rgba(255,206,140,0) 80%), radial-gradient(80% 80% at 50% 42%, rgba(0,0,0,0) 40%, rgba(14,9,5,0.42) 100%)' }} />
          </At>
          {/* halo oscuro y suave detrás de las cifras, para que el oro se lea */}
          <At x={170} y={-370} z={-200} w={2400} h={800} o={Math.max(n1, n2) * 0.9}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(closest-side, rgba(20,12,6,0.5) 0%, rgba(20,12,6,0.26) 55%, rgba(20,12,6,0) 100%)' }} />
          </At>
          {/* balda de madera */}
          <At x={0} y={SY + 14} w={3000} h={30} o={shelf}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #a07650 0%, #7a5636 35%, #4a3220 100%)', borderRadius: 3, boxShadow: '0 30px 60px rgba(0,0,0,0.55)' }} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: 1, height: 2, background: 'rgba(255,226,180,0.35)' }} />
          </At>
          <At x={0} y={SY} z={-100} w={3000} h={200} rx={90} o={shelf}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, #6b4b30, #45301e)' }} />
          </At>
          {/* libros */}
          {SHELF.map((b, i) => {
            const named = b.word ? at(b.word) : -1;
            const arrive = b.word ? sp(frame, named - 10, fps, 120, 16) : sp(frame, 4 + i * 3, fps, 100, 22);
            const k = Math.min(1, arrive);
            const glow = b.word ? ramp(frame, named - 4, named + 10, eOut) * (1 - ramp(frame, named + 40, named + 90, eIO)) : 0;
            const dim = b.word ? 0 : 0.35;
            // cae inclinado y se asienta (el muelle rebota un poco: el libro se balancea al tocar la balda)
            const tilt = (i % 2 ? 1 : -1) * 10 * (1 - arrive);
            // ficha de papel que cuelga de la balda y se balancea hasta quedarse quieta
            const tagIn = b.word ? sp(frame, named + 2, fps, 70, 7) : 0;
            const swing = b.word ? (1 - tagIn) * 28 : 0;
            return (
              <React.Fragment key={b.id}>
                <At x={b.x} y={SY - SIZE / 2} z={(1 - k) * 260} w={SIZE} h={SIZE} o={k} ry={-4}>
                  <div style={{ transform: `translateY(${(1 - arrive) * -170}px) rotate(${tilt}deg)`, transformOrigin: '50% 100%', transformStyle: 'preserve-3d' }}>
                    <BookCover id={b.id} size={SIZE} depth={0} shade={dim} />
                  </div>
                  <div style={{ position: 'absolute', inset: -6, borderRadius: 6, boxShadow: `0 0 ${40 * glow}px ${10 * glow}px rgba(255,214,150,${0.6 * glow})`, pointerEvents: 'none' }} />
                </At>
                {b.word && tagIn > 0.01 && (
                  <At x={b.x} y={SY + 30} z={14} w={260} h={140}>
                    <div style={{ position: 'absolute', left: 0, top: 0, width: 260, height: 140, transformOrigin: '130px 0px', transform: `rotate(${swing + (i % 2 ? 1.5 : -1.5)}deg)`, opacity: Math.min(1, tagIn * 3) }}>
                      {/* hilo */}
                      <div style={{ position: 'absolute', left: 129, top: 0, width: 2, height: 30, background: 'rgba(90,64,40,0.8)' }} />
                      <div style={{ position: 'absolute', left: 10, top: 28, width: 240, height: 96, borderRadius: 6, ...paperBg(T.paper), boxShadow: '0 12px 26px rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 14px', boxSizing: 'border-box' }}>
                        <div style={{ position: 'absolute', left: 124, top: 10, width: 12, height: 12, borderRadius: 6, background: '#c9b48e', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)' }} />
                        <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: b.title.length > 14 ? 30 : 36, lineHeight: 1.05, color: T.ink, marginTop: 12 }}>{b.title}</div>
                      </div>
                    </div>
                  </At>
                )}
              </React.Fragment>
            );
          })}
          {/* cifras en oro, contando */}
          <At x={-220} y={-370} z={60} w={900} h={300} o={Math.min(1, n1 * 1.5)}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `translateY(${(1 - n1) * 40}px) scale(${0.94 + 0.06 * Math.min(1, n1)})`, transformStyle: 'preserve-3d' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', transformStyle: 'preserve-3d', fontVariantNumeric: 'tabular-nums' }}>
                <GoldText text={es(c1)} size={180} sweep={ramp(frame, fMil + 20, fMil + 70, eIO) * 1.4 - 0.2} layers={9} />
                <div style={{ transform: `scale(${Math.min(1.2, plus1)})`, opacity: Math.min(1, plus1), marginLeft: 6 }}><GoldText text="+" size={150} layers={7} /></div>
              </div>
              <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 50, color: T.cream, marginTop: 12, textShadow: '0 2px 18px rgba(0,0,0,0.6)' }}>obras en español</div>
            </div>
          </At>
          <At x={580} y={-370} z={60} w={1000} h={300} o={Math.min(1, n2 * 1.5)}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `translateY(${(1 - n2) * 40}px) scale(${0.94 + 0.06 * Math.min(1, n2)})`, transformStyle: 'preserve-3d' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', transformStyle: 'preserve-3d', fontVariantNumeric: 'tabular-nums' }}>
                <GoldText text={es(c2)} size={180} sweep={ramp(frame, fHoras, fHoras + 50, eIO) * 1.4 - 0.2} layers={9} />
                <div style={{ transform: `scale(${Math.min(1.2, plus2)})`, opacity: Math.min(1, plus2), marginLeft: 6 }}><GoldText text="+" size={150} layers={7} /></div>
              </div>
              <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 50, color: T.cream, marginTop: 12, textShadow: '0 2px 18px rgba(0,0,0,0.6)' }}>horas de audio</div>
            </div>
          </At>
        </Rig>
      </Space>
      <Sfx name="counter" at={fMil - 8} volume={0.5} trimAfter={34} />
      <Sfx name="soft_impact" at={fMil + 22} volume={0.45} />
      <Sfx name="counter" at={fTres - 6} volume={0.5} trimAfter={50} />
      <Sfx name="soft_impact" at={fHoras + 2} volume={0.42} />
      {SHELF.filter((b) => b.word).map((b) => <Sfx key={b.id} name="card_drop" at={at(b.word!) - 2} volume={0.55} />)}
      {SHELF.filter((b) => b.word).map((b) => <Sfx key={`t${b.id}`} name="paper_lift" at={at(b.word!) + 4} volume={0.25} />)}
      <Sfx name="deep_whoosh" at={fVamos + 6} volume={0.5} />
    </AbsoluteFill>
  );
};
