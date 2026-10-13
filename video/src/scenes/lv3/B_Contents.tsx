import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../../components/Sfx';
import { LogoIcon } from '../../components/Logo';
import { At, eIO, eOut, Fleuron, follow, paperBg, ramp, Rig, Space, sp, T } from './kit';
import { w } from './timeline';

// Plano B (S03): el índice del vídeo, como la página de índice de un libro. Al hablar de la guía, baja una cinta
// amarilla de SonorBooks (el marcapáginas) y debajo aparece «Enlace en la descripción».
const ROWS: [string, string][] = [['I', 'Qué es y cómo funciona'], ['II', 'Cómo se usa, paso a paso'], ['III', 'Lo que conviene saber'], ['IV', '¿Merece la pena?']];

export const Contents: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w('S03', 'K03', word, n);
  const fQue = at('qué');
  const fUsar = at('usarlo');
  const fPaso = at('paso', 1);
  const fGuia = at('guía');
  const fEnlace = at('enlace');
  const rowAt = [fQue - 4, fUsar - 6, fPaso + 8, fPaso + 22];
  const cam = follow(frame, [
    { f: 0, x: 0, y: 30, z: -120, rx: 10, ry: -9 },
    { f: dur * 0.55, x: 0, y: 0, z: 0, rx: 6, ry: -2 },
    { f: dur, x: 0, y: 50, z: -70, rx: 4, ry: 4 },
  ], 4.5);
  const page = sp(frame, 0, fps, 90, 20);
  const ribbon = ramp(frame, fGuia - 6, fGuia + 22, eOut);
  const link = sp(frame, fEnlace - 4, fps, 120, 22);
  return (
    <AbsoluteFill>
      <Space persp={1700}>
        <Rig cam={{ x: cam.x, y: cam.y, z: cam.z, rx: cam.rx, ry: cam.ry }}>
          <At x={0} y={-20 + (1 - page) * 80} z={(1 - page) * -300} w={1140} h={800} o={page}>
            <div style={{ position: 'absolute', inset: 0, ...paperBg(T.paper), borderRadius: 8, boxShadow: '0 50px 120px rgba(0,0,0,0.6), 0 10px 30px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 64, left: 0, right: 0, textAlign: 'center', fontFamily: T.serif, fontStyle: 'italic', fontSize: 56, color: T.ink }}>Índice</div>
              <div style={{ position: 'absolute', top: 140, left: 0, right: 0 }}><Fleuron at={6} w={240} color={T.inkFaint} /></div>
              <div style={{ position: 'absolute', top: 220, left: 120, right: 120, display: 'flex', flexDirection: 'column', gap: 34 }}>
                {ROWS.map(([n, t], i) => {
                  const r = ramp(frame, rowAt[i], rowAt[i] + 22, eOut);
                  return (
                    <div key={n} style={{ display: 'flex', alignItems: 'baseline', gap: 26, fontFamily: T.serif, opacity: 0.18 + 0.82 * r, transform: `translateX(${(1 - r) * 18}px)` }}>
                      <span style={{ width: 70, textAlign: 'right', fontSize: 50, fontWeight: 500, color: T.teal }}>{n}</span>
                      <span style={{ fontSize: 54, color: T.ink, whiteSpace: 'nowrap' }}>{t}</span>
                      <span style={{ flex: 1, height: 2, marginBottom: 12, backgroundImage: `radial-gradient(circle, ${T.inkFaint} 1.3px, transparent 1.6px)`, backgroundSize: '12px 4px', transformOrigin: 'left', transform: `scaleX(${r})` }} />
                    </div>
                  );
                })}
              </div>
              {/* cinta marcapáginas de SonorBooks */}
              <div style={{ position: 'absolute', right: 120, top: -20, width: 84, height: 40 + 330 * ribbon, background: T.yellow, boxShadow: '0 8px 20px rgba(0,0,0,0.25)', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 26px), 0 100%)' }}>
                <div style={{ position: 'absolute', bottom: 46, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: ramp(frame, fGuia + 10, fGuia + 24, eIO) }}><LogoIcon size={46} /></div>
              </div>
            </div>
          </At>
          <At x={0} y={470} z={40} w={1800} h={110} o={link}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, fontFamily: T.serif, fontSize: 50, color: T.cream, whiteSpace: 'nowrap', transform: `translateY(${(1 - link) * 20}px)` }}>
              La guía completa, en <span style={{ color: T.yellow }}>sonorbooks.com</span>
              <svg width="44" height="44" viewBox="0 0 24 24" style={{ transform: `translateY(${Math.sin((frame - fEnlace) / 7) * 4}px)` }}><path d="M12 4v15M6 13l6 6 6-6" stroke={T.yellow} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span style={{ fontStyle: 'italic', color: T.creamSoft, fontSize: 44 }}>enlace en la descripción</span>
            </div>
          </At>
        </Rig>
      </Space>
      <Sfx name="paper_lift" at={2} volume={0.8} />
      {rowAt.map((f, i) => <Sfx key={i} name="pen_underline" at={f + 2} volume={0.45} />)}
      <Sfx name="paper_slide" at={fGuia - 4} volume={0.6} />
      <Sfx name="ui_pop" at={fEnlace} volume={0.5} />
    </AbsoluteFill>
  );
};
