import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../../components/Sfx';
import { At, eOut, follow, img3, lerp, paperBg, ramp, Rig, Space, sp, T } from './kit';
import { ChapterCard } from './frames';
import { InkStamp, shake } from './ink';
import { w } from './timeline';

// ---------------------------------------------------------------------------------------------------------------
// Plano J (S13): capítulo IV, ¿merece la pena? La nota de SonorBooks como una ficha de catálogo de biblioteca: los
// cinco apartados con su nota, notas al margen a favor (verde oliva) y en contra (rojo), y el sello final: 7,5 sobre 10.
// Las notas son las de la página (la media de los cinco apartados).
// ---------------------------------------------------------------------------------------------------------------
const CW = 1560, CH = 960;
const ROWS: { label: string; score: string; v: number; note?: string; noteWord?: string; pro?: boolean }[] = [
  { label: 'Precio', score: '10', v: 10, note: 'nada igual gratis', noteWord: 'nada', pro: true },
  { label: 'Descargas y formatos', score: '9,5', v: 9.5 },
  { label: 'Calidad de las voces', score: '6,5', v: 6.5, note: 'voces desiguales', noteWord: 'voces' },
  { label: 'Facilidad de uso', score: '6', v: 6, note: 'web en inglés', noteWord: 'web' },
  { label: 'Catálogo en español', score: '5,5', v: 5.5, note: 'solo clásicos', noteWord: 'solo' },
];

export const Verdict: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w('S13', 'K14', word, n);
  const fMerece = at('Merece'), fSi = at('Si'), fMucho = at('mucho');
  const fPero = at('Pero'), fSiete = at('siete'), fNota = at('nota'), fDiez = at('diez');
  const noteAt = (r: (typeof ROWS)[number]) => (r.noteWord === 'nada' ? at('nada') : r.noteWord === 'solo' ? at('solo') : r.noteWord === 'voces' ? at('voces') : r.noteWord === 'web' ? at('web') : 0);

  const cam = follow(frame, [
    { f: 0, x: 0, y: 60, z: -700, rx: 22, ry: -12 },
    { f: fMerece + 30, x: 0, y: 0, z: -480, rx: 12, ry: -5 },
    { f: fMucho, x: 160, y: -60, z: -320, rx: 10, ry: -6 },
    { f: fPero + 40, x: 260, y: 80, z: -300, rx: 9, ry: -7 },
    { f: fNota - 6, x: 60, y: 20, z: -560, rx: 10, ry: -3 },
    { f: dur, x: 40, y: 20, z: -620, rx: 10, ry: -2 },
  ], 4.4);
  const card = sp(frame, 6, fps, 70, 20);
  // el golpe del sello sacude un poco la cámara
  const jolt = shake(frame, fSiete - 2, 10, 5);

  return (
    <AbsoluteFill>
      <Space persp={1700}>
        <Rig cam={{ x: cam.x + jolt.x, y: cam.y + jolt.y, z: cam.z, rx: cam.rx, ry: cam.ry }}>
          <At x={0} y={(1 - Math.min(1, card)) * 200} z={(1 - Math.min(1, card)) * -400} w={CW} h={CH} o={Math.min(1, card * 1.5)} rz={-1.2}>
            {/* la ficha */}
            <div style={{ position: 'absolute', inset: 0, ...paperBg('#f6efdc'), borderRadius: 10, boxShadow: '0 60px 140px rgba(0,0,0,0.75), 0 14px 40px rgba(0,0,0,0.45)' }}>
              {/* rayas de ficha y filete rojo */}
              <div style={{ position: 'absolute', left: 0, right: 0, top: 150, height: 3, background: 'rgba(179,54,43,0.55)' }} />
              {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: 230 + i * 66, height: 1.5, background: 'rgba(46,109,125,0.18)' }} />)}
              <div style={{ position: 'absolute', left: 120, top: 0, bottom: 0, width: 2, background: 'rgba(179,54,43,0.3)' }} />
              {/* agujero de la varilla del fichero */}
              <div style={{ position: 'absolute', left: CW / 2 - 21, bottom: 26, width: 42, height: 42, borderRadius: 21, background: '#1b140e', boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.7), 0 0 0 4px rgba(150,120,80,0.25)' }} />
              <div style={{ position: 'absolute', left: 160, top: 44, fontFamily: T.serif, fontSize: 74, color: T.ink, letterSpacing: -0.5 }}>LibriVox</div>
              <div style={{ position: 'absolute', right: 70, top: 64, fontFamily: T.serif, fontStyle: 'italic', fontSize: 46, color: T.inkSoft }}>¿Merece la pena?</div>
              {/* apartados */}
              {ROWS.map((r, i) => {
                const a = ramp(frame, fSi - 10 + i * 9, fSi + 6 + i * 9, eOut);
                const st = sp(frame, fSi + 4 + i * 9, fps, 260, 18);
                const y = 196 + i * 132;
                const nAt = noteAt(r);
                const n = r.note ? ramp(frame, nAt - 4, nAt + 14, eOut) * (1 - ramp(frame, fNota - 10, fNota + 6)) : 0;
                const col = r.pro ? T.olive : T.redInk;
                return (
                  <React.Fragment key={r.label}>
                    <div style={{ position: 'absolute', left: 160, top: y, width: 760, height: 100, display: 'flex', alignItems: 'center', gap: 20, opacity: a, transform: `translateX(${(1 - a) * 20}px)` }}>
                      <span style={{ fontFamily: T.serif, fontSize: 56, color: T.ink, whiteSpace: 'nowrap' }}>{r.label}</span>
                      <span style={{ flex: 1, height: 2, marginTop: 22, backgroundImage: `radial-gradient(circle, ${T.inkFaint} 1.5px, transparent 1.9px)`, backgroundSize: '14px 4px' }} />
                    </div>
                    {/* nota sellada */}
                    <div style={{ position: 'absolute', left: 930, top: y, width: 160, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontFamily: T.serif, fontWeight: 600, fontSize: 66, color: r.v >= 9 ? T.olive : r.v >= 6.5 ? T.ink : T.redInk,
                      opacity: Math.min(1, st), transform: `scale(${lerp(1.5, 1, Math.min(1, st))}) rotate(${(i % 2 ? 2 : -2)}deg)`,
                      WebkitMaskImage: `url(${img3('ink_wear.png')})`, WebkitMaskSize: '260px', WebkitMaskPosition: `${i * 61}px ${i * 37}px` }}>
                      {/* alineadas por la coma: la parte entera a la derecha de una columna fija */}
                      <span style={{ display: 'inline-block', width: 80, textAlign: 'right' }}>{r.score.split(',')[0]}</span>
                      <span style={{ display: 'inline-block' }}>{r.score.includes(',') ? `,${r.score.split(',')[1]}` : ''}</span>
                    </div>
                    {/* barra */}
                    <div style={{ position: 'absolute', left: 1090, top: y + 44, width: 90, height: 10, borderRadius: 5, background: 'rgba(42,37,32,0.1)', opacity: a }}>
                      <div style={{ width: `${(r.v / 10) * 100 * Math.min(1, st)}%`, height: '100%', borderRadius: 5, background: r.v >= 9 ? T.olive : r.v >= 6.5 ? T.inkSoft : T.redInk }} />
                    </div>
                    {/* nota al margen */}
                    {r.note && (
                      <div style={{ position: 'absolute', left: 1196, top: y + 20, fontFamily: T.serif, fontStyle: 'italic', fontSize: 44, color: col, whiteSpace: 'nowrap', opacity: n, transform: `translateY(${(1 - n) * 8}px) rotate(-3deg)` }}>
                        {r.pro ? '✓ ' : '— '}{r.note}
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            {/* sello de la nota global: baja, golpea y deja la tinta */}
            <div style={{ position: 'absolute', left: 1222, top: 486, width: 320, height: 272, transform: 'translateZ(30px) rotate(-9deg)' }}>
              <InkStamp at={fSiete - 2} w={320} h={272} color={T.red} seed={8} border={9} radius={22}>
                <div style={{ position: 'absolute', inset: 9, borderRadius: 14, border: `4px solid ${T.red}` }} />
                <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontWeight: 600, fontSize: 34 }}>Nota de SonorBooks</div>
                <div style={{ fontFamily: T.serif, fontWeight: 700, fontSize: 126, lineHeight: 0.95 }}>7,5</div>
                <div style={{ fontFamily: T.serif, fontWeight: 600, fontSize: 40, opacity: ramp(frame, fDiez - 4, fDiez + 8) }}>sobre 10</div>
              </InkStamp>
            </div>
          </At>
        </Rig>
      </Space>
      <ChapterCard n="IV" title="¿Merece la pena?" />
      <Sfx name="paper_slide" at={8} volume={0.5} />
      {ROWS.map((_, i) => <Sfx key={i} name="date_stamp" at={fSi + 6 + i * 9} volume={0.3} />)}
      {ROWS.filter((r) => r.note).map((r) => <Sfx key={r.label} name="pen_scratch" at={noteAt(r)} volume={0.4} />)}
      <Sfx name="date_stamp" at={fSiete - 2} volume={1} />
      <Sfx name="soft_impact" at={fSiete - 2} volume={0.6} />
    </AbsoluteFill>
  );
};
