import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../../components/Sfx';
import { At, eIO, eOut, follow, paperBg, ramp, Rig, Space, sp, T } from './kit';
import { CARD, ChapterCard } from './frames';
import { Globe, Wave } from './glyphs';
import { w } from './timeline';

// Plano C (S04): capítulo I. «2005» en grande, con volumen, y la idea de LibriVox como una cita en papel, con dos notas:
// «leído por personas» y «gratis para todo el mundo».
const Year: React.FC<{ text: string; size: number; on: number; sweep: number }> = ({ text, size, on, sweep }) => (
  <div style={{ position: 'relative', fontFamily: T.serif, fontWeight: 500, fontSize: size, lineHeight: 1, letterSpacing: -size * 0.03, transformStyle: 'preserve-3d' }}>
    {/* grosor: capas detrás, cada vez más oscuras */}
    {Array.from({ length: 10 }, (_, i) => (
      <div key={i} style={{ position: 'absolute', inset: 0, transform: `translateZ(${-(i + 1) * 3.2}px)`, color: `rgb(${120 - i * 8}, ${86 - i * 6}, ${44 - i * 3})`, opacity: on }}>{text}</div>
    ))}
    <div style={{ position: 'relative', color: T.gold, opacity: on,
      backgroundImage: `linear-gradient(100deg, ${T.goldDeep} 0%, ${T.gold} ${sweep * 100 - 20}%, #fff4d6 ${sweep * 100}%, ${T.gold} ${sweep * 100 + 20}%, ${T.goldDeep} 100%)`,
      WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{text}</div>
  </div>
);

export const Idea: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (word: string, n = 0) => w('S04', 'K04', word, n);
  const f2005 = at('2005');
  const fIdea = at('idea');
  const fTodos = at('todos');
  const fDom = at('dominio');
  const fAudio = at('audiolibro');
  const fLeido = at('leído');
  const fGratis = at('gratis');
  const cam = follow(frame, [
    { f: 0, x: 0, y: -40, z: -260, rx: 0, ry: 0 },
    { f: 96, x: 0, y: -40, z: -260, rx: 0, ry: 0 },
    { f: f2005 + 10, x: 0, y: -60, z: -40, rx: 4, ry: -10 },
    { f: fIdea + 20, x: 0, y: 40, z: -120, rx: 6, ry: 6 },
    { f: dur, x: 0, y: 70, z: 10, rx: 5, ry: -3 },
  ], 4.6);
  const year = sp(frame, Math.min(f2005 - 6, CARD - 6), fps, 80, 20); // entra mientras se va la portadilla
  const sweep = ramp(frame, f2005, f2005 + 60, eIO);
  const up = ramp(frame, fIdea - 10, fIdea + 30, eIO);
  const quote = sp(frame, fIdea - 2, fps, 100, 22);
  const words = 'Que todos los libros de dominio público tengan su audiolibro'.split(' ');
  const wordAt = (i: number) => (i <= 1 ? fTodos - 6 + i * 4 : i <= 6 ? fTodos + (fDom - fTodos) * ((i - 1) / 5) : fDom + (fAudio - fDom) * ((i - 6) / 3));
  const n1 = sp(frame, fLeido - 4, fps, 130, 24);
  const n2 = sp(frame, fGratis - 4, fps, 130, 24);
  return (
    <AbsoluteFill>
      <Space persp={1700}>
        <Rig cam={{ x: cam.x, y: cam.y, z: cam.z, rx: cam.rx, ry: cam.ry }}>
          {/* 2005 */}
          <At x={0} y={-60 - up * 300} z={-up * 500} w={1400} h={480} o={1 - up * 0.65}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transformStyle: 'preserve-3d', transform: `scale(${0.9 + 0.1 * year}) translateY(${(1 - year) * 60}px)` }}>
              <Year text="2005" size={380} on={year} sweep={sweep} />
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: -36, textAlign: 'center', fontFamily: T.serif, fontStyle: 'italic', fontSize: 50, color: T.creamSoft, opacity: year * (1 - up) }}>nace LibriVox</div>
          </At>
          {/* la idea, en papel */}
          <At x={0} y={110} z={60} w={1500} h={330} o={quote}>
            <div style={{ position: 'absolute', inset: 0, ...paperBg(T.paper), borderRadius: 6, boxShadow: '0 40px 100px rgba(0,0,0,0.55)', transform: `translateY(${(1 - quote) * 60}px) rotateX(${(1 - quote) * -12}deg)` }}>
              <div style={{ position: 'absolute', left: 80, right: 80, top: 52, fontFamily: T.serif, fontSize: 70, lineHeight: 1.16, color: T.ink, textAlign: 'center' }}>
                <span style={{ color: T.redInk, fontSize: 90, lineHeight: 0 }}>«</span>
                {words.map((wd, i) => {
                  const r = ramp(frame, wordAt(i) - 3, wordAt(i) + 8, eOut);
                  return <span key={i} style={{ opacity: 0.18 + 0.82 * r }}>{wd}{i < words.length - 1 ? ' ' : ''}</span>;
                })}
                <span style={{ color: T.redInk, fontSize: 90, lineHeight: 0, opacity: ramp(frame, fAudio, fAudio + 10) }}>»</span>
              </div>
            </div>
          </At>
          {/* dos notas */}
          <At x={-360} y={430} z={90} w={620} h={120} o={n1}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 20, color: T.tealLight, fontFamily: T.serif, fontStyle: 'italic', fontSize: 54, transform: `translateY(${(1 - n1) * 24}px)` }}>
              <Wave size={64} c={T.tealLight} w={2.2} level={[0.3, 0.7, 1, 0.55, 0.85, 0.4, 0.75].map((v, i) => 0.25 + 0.75 * v * (0.6 + 0.4 * Math.sin(frame / 4 + i)))} />
              leído por personas
            </div>
          </At>
          <At x={380} y={430} z={90} w={680} h={120} o={n2}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 20, color: T.gold, fontFamily: T.serif, fontStyle: 'italic', fontSize: 54, transform: `translateY(${(1 - n2) * 24}px)` }}>
              <div style={{ transform: `rotate(${frame * 0.6}deg)` }}><Globe size={58} c={T.gold} /></div>
              gratis para todo el mundo
            </div>
          </At>
        </Rig>
      </Space>
      <ChapterCard n="I" title="Qué es y cómo funciona" />
      <Sfx name="soft_impact" at={f2005} volume={0.7} />
      <Sfx name="dust_shimmer" at={f2005 + 4} volume={0.5} />
      <Sfx name="paper_lift" at={fIdea - 2} volume={0.8} />
      <Sfx name="pen_underline" at={fLeido + 4} volume={0.5} />
      <Sfx name="ink_bloom" at={fGratis} volume={0.6} />
    </AbsoluteFill>
  );
};
