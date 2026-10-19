import React from 'react';
import { ThreeCanvas } from '@remotion/three';
import { AbsoluteFill, getInputProps, spring, useCurrentFrame } from 'remotion';
import { Sfx } from '../../components/Sfx';
import { color, font, Grain, KR, ramp, rampOut, WAX } from './kit';
import { sceneClock } from './timeline';
import { RING_POS, RoomScene, LETTER_LINES } from './three/Room3D';
import { AUDIO_ONLY, CamKey, projectAt, useFontsReady } from './three/lib3d';

const BENCH = getInputProps() as { noGL?: boolean; aa?: boolean };
const HANDF = '"Pinyon Script", "EB Garamond", serif';

// ————————————————————————————————————————————————————————————————
// HOOK · J01–J02 · Copenhague, agosto de 1841: un cuarto al anochecer, la vela, la carta y el anillo devuelto.
// Plano detalle de la nota («Olvida a quien escribe esto»), la carta se cierra con lacre y se envía, el escritorio
// se llena de manuscritos durante años… y la pluma firma con otros nombres.
// ————————————————————————————————————————————————————————————————

const fps = 50;
const sp = (frame: number, at: number, d = 14, s = 170) => spring({ frame: frame - at, fps, config: { damping: d, stiffness: s } });

// Papel del plano detalle (CSS): verjurado, manchas y viñeta.
export const PaperBG: React.FC<{ tone?: string }> = ({ tone = '#EFE5CF' }) => (
  <AbsoluteFill style={{ background: tone }}>
    <AbsoluteFill style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(150,120,80,0.07) 0px, rgba(150,120,80,0.07) 1px, transparent 1px, transparent 9px), repeating-linear-gradient(90deg, rgba(150,120,80,0.05) 0px, rgba(150,120,80,0.05) 2px, transparent 2px, transparent 140px)' }} />
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 50%), radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(110,80,40,0.42) 100%)' }} />
  </AbsoluteFill>
);

// Escritura a mano: el texto se descubre de izquierda a derecha entre `a` y `b` (máscara con borde suave) y deja un punto de tinta.
export const Handwrite: React.FC<{ text: string; a: number; b: number; size: number; colorInk?: string; style?: React.CSSProperties }> = ({ text, a, b, size, colorInk = '#2A2018', style }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, a, b, (t) => t);
  if (p <= 0) return null;
  const edge = 6;
  const pad = Math.round(size * 0.3); // los rasgos de la letra que sobresalen de la caja no se recortan
  const m = `linear-gradient(90deg, #000 0%, #000 ${p * (100 + edge) - edge}%, rgba(0,0,0,0) ${p * (100 + edge)}%)`;
  return (
    <div style={{ position: 'relative', fontFamily: HANDF, fontSize: size, color: colorInk, lineHeight: 1.15, whiteSpace: 'nowrap', paddingLeft: pad, paddingRight: pad, marginLeft: -pad, marginRight: -pad, WebkitMaskImage: m, maskImage: m, ...style }}>{text}</div>
  );
};

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const c = sceneClock('HOOK');
  const f = {
    cph: c.at('J01', 'Copenhague'), ago: c.at('J01', 'agosto'), mil: c.at('J01', 'mil'), joven: c.at('J01', 'joven'), veint: c.at('J01', 'veintiocho'),
    dev: c.at('J01', 'devuelve'), anillo: c.at('J01', 'anillo'), nota: c.at('J01', 'nota'), olv: c.at('J01', 'Olvida'), estoE: c.end('J01', 'esto'),
    ella: c.at('J02', 'Ella'), diec: c.at('J02', 'diecinueve'), desesp: c.at('J02', 'desesperada'), nunca: c.at('J02', 'nunca'), hizo: c.at('J02', 'hizo'),
    pero: c.at('J02', 'Pero'), resto: c.at('J02', 'volvió'), escr: c.at('J02', 'libros'), nomb: c.at('J02', 'nombres'), falsos: c.at('J02', 'falsos'),
  };
  const dur = c.dur;
  const keys: CamKey[] = [
    { f: 0, pos: [120, 62, 236], look: [-12, 44, -60], fov: 32 },
    { f: f.joven - 4, pos: [74, 40, 146], look: [-6, 14, -20], fov: 32 },
    { f: f.anillo + 6, pos: [22, 9, 30], look: [RING_POS[0], 0.5, RING_POS[2]], fov: 29 },
    { f: f.nota + 12, pos: [16, 6, 18], look: [RING_POS[0], 0.5, RING_POS[2]], fov: 28 },
    { f: f.ella + 2, pos: [44, 32, 74], look: [2, 2, 0], fov: 30 },
    { f: f.hizo + 8, pos: [26, 36, 48], look: [4, 1, 2], fov: 30 },
    { f: f.nomb - 6, pos: [64, 72, 124], look: [0, 6, -12], fov: 32 },
    { f: dur, pos: [74, 80, 138], look: [0, 6, -14], fov: 32, ease: (t) => t },
  ];
  const ready = useFontsReady();
  // Plano detalle de la nota (J01 «con una nota…» → J02 «Ella»).
  const ins1 = ramp(frame, f.nota - 2, f.nota + 10) * (1 - ramp(frame, f.ella - 4, f.ella + 8));
  // Firmas con otros nombres (J02 «nombres falsos»).
  const ins2 = ramp(frame, f.nomb - 8, f.nomb + 6);
  const bg3dBlur = 8 * Math.max(ins1, ins2);
  const bars = 1 - ramp(frame, dur - 34, dur - 4);
  const ringP = projectAt(frame, keys, 0.25, [RING_POS[0], 1.6, RING_POS[2]]);
  const glint = ramp(frame, f.anillo - 2, f.anillo + 8) * (1 - ramp(frame, f.anillo + 14, f.anillo + 34));
  const sigs = [
    { n: 'Victor Eremita', b: 'O lo uno o lo otro', at: f.nomb },
    { n: 'Johannes de Silentio', b: 'Temor y temblor', at: f.nomb + 16 },
    { n: 'Anti-Climacus', b: 'La enfermedad mortal', at: f.falsos + 6 },
  ];
  return (
    <AbsoluteFill style={{ background: '#0D0F12', overflow: 'hidden' }}>
      <AbsoluteFill style={{ filter: bg3dBlur > 0.05 ? `blur(${bg3dBlur.toFixed(2)}px)` : undefined }}>
        {ready && !BENCH.noGL && !AUDIO_ONLY && (
          <ThreeCanvas width={1920} height={1080} shadows gl={{ antialias: BENCH.aa ?? false, powerPreference: 'high-performance' }} camera={{ fov: 32, position: [120, 62, 236] }}>
            <RoomScene keys={keys} f={{ ring: f.anillo, fold: f.nunca, seal: f.hizo, send: f.pero + 6, life: f.resto, names: f.nomb, end: dur }} />
          </ThreeCanvas>
        )}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 52%, rgba(0,0,0,0) 46%, rgba(4,5,8,0.62) 100%)' }} />
      {/* destello del anillo */}
      {glint > 0.01 && !ringP.behind && (
        <div style={{ position: 'absolute', left: ringP.x, top: ringP.y, width: 0, height: 0 }}>
          {[0, 90].map((r) => <div key={r} style={{ position: 'absolute', left: -90, top: -2, width: 180, height: 4, borderRadius: 2, background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,250,230,0.95), rgba(255,255,255,0))', transform: `rotate(${r + 20 + frame * 0.6}deg) scale(${glint})`, opacity: glint }} />)}
          <div style={{ position: 'absolute', left: -26, top: -26, width: 52, height: 52, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,250,230,0.9), rgba(255,250,230,0))', opacity: glint }} />
        </div>
      )}

      {/* rótulos: lugar y fecha → «Un joven · 28 años» → «Ella · 19 años» */}
      <div style={{ position: 'absolute', left: 140, top: 190, opacity: rampOut(frame, f.cph, f.cph + 16) * (1 - ramp(frame, f.joven - 10, f.joven + 4)) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: font.sans, fontWeight: 700, fontSize: 30, letterSpacing: 8, textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)' }}>
          <span style={{ width: 60 * rampOut(frame, f.cph, f.cph + 20), height: 4, background: color.yellow, borderRadius: 2 }} />Copenhague
        </div>
        <div style={{ marginTop: 16, fontFamily: font.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 104, color: '#fff', lineHeight: 1, textShadow: '0 10px 40px rgba(0,0,0,0.5)',
          opacity: rampOut(frame, f.ago - 2, f.ago + 14), transform: `translateY(${(1 - rampOut(frame, f.ago - 2, f.ago + 14)) * 20}px)` }}>
          Agosto <span style={{ color: '#F1D58C', opacity: rampOut(frame, f.mil - 2, f.mil + 12) }}>de 1841</span>
        </div>
      </div>
      {[
        { t: 'Un joven', k: '· 28 años', a: f.joven, kA: f.veint, o: f.nota - 6 },
        { t: 'Ella', k: '· 19 años', a: f.ella + 6, kA: f.diec, o: f.nunca + 4 },
      ].map((q, i) => {
        const p = sp(frame, q.a - 2, 15, 180);
        const o = 1 - ramp(frame, q.o - 8, q.o + 4);
        if (frame < q.a - 3 || o <= 0) return null;
        return (
          <div key={i} style={{ position: 'absolute', left: 140, top: 210, opacity: p * o, transform: `translateY(${(1 - p) * 20}px)` }}>
            <div style={{ display: 'inline-block', fontFamily: font.sans, fontWeight: 700, fontSize: 44, color: color.ink, background: '#F4EEE2', padding: '14px 28px', borderRadius: 14, whiteSpace: 'nowrap', boxShadow: '0 20px 40px rgba(0,0,0,0.35)' }}>
              {q.t}<span style={{ color: KR, marginLeft: 14, opacity: rampOut(frame, q.kA - 2, q.kA + 10) }}>{q.k}</span>
            </div>
          </div>
        );
      })}
      {/* «desesperada»: la luz cae un poco */}
      <AbsoluteFill style={{ background: 'rgba(8,10,16,1)', opacity: 0.28 * ramp(frame, f.desesp - 4, f.desesp + 20) * (1 - ramp(frame, f.pero, f.pero + 30)), pointerEvents: 'none' }} />

      {/* plano detalle: la nota */}
      {ins1 > 0.003 && (
        <AbsoluteFill style={{ opacity: ins1 }}>
          <AbsoluteFill style={{ transform: `scale(${1.04 + 0.04 * ramp(frame, f.nota, f.ella + 10)}) rotate(-1.2deg)` }}>
            <PaperBG />
            <div style={{ position: 'absolute', left: 230, top: 250 }}>
              <Handwrite text="Olvida a quien escribe esto;" a={f.olv - 2} b={f.estoE + 4} size={150} />
              {LETTER_LINES.slice(1).map((l, i) => (
                <div key={i} style={{ opacity: 0.38 * ramp(frame, f.estoE + 6 + i * 5, f.estoE + 18 + i * 5) }}>
                  <Handwrite text={l} a={f.estoE + 2 + i * 6} b={f.estoE + 18 + i * 6} size={82} colorInk="#3A2E22" style={{ marginTop: 6 }} />
                </div>
              ))}
            </div>
          </AbsoluteFill>
          <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(40,25,10,0.45) 100%)' }} />
        </AbsoluteFill>
      )}

      {/* firmas: el resto de su vida, con nombres falsos */}
      {ins2 > 0.003 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: ins2 * (1 - ramp(frame, dur - 14, dur - 2)) }}>
          <div style={{ position: 'relative', width: 1180, height: 640, transform: `rotate(-1.5deg) translateY(${(1 - ins2) * 40}px)`, boxShadow: '0 50px 100px rgba(0,0,0,0.6)', borderRadius: 6, overflow: 'hidden' }}>
            <PaperBG tone="#F1E8D4" />
            <div style={{ position: 'absolute', left: 100, top: 46, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sigs.map((s, i) => {
                const o = rampOut(frame, s.at + 12, s.at + 24);
                return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                    <Handwrite text={s.n} a={s.at - 2} b={s.at + 16} size={104} />
                    <div style={{ marginLeft: 8, marginTop: -6, fontFamily: font.sans, fontWeight: 700, fontSize: 24, letterSpacing: 4, textTransform: 'uppercase', color: 'rgba(42,32,24,0.55)', opacity: o, whiteSpace: 'nowrap' }}>{s.b}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* bandas de cine y grano */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 118 * bars, background: '#000' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 118 * bars, background: '#000' }} />
      {frame < 14 && <AbsoluteFill style={{ background: '#000', opacity: 1 - ramp(frame, 0, 13) }} />}
      <Grain seed={Math.floor(frame / 2)} opacity={0.1} />

      {/* sonido */}
      <Sfx name="kk_room" at={2} volume={0.7} dur={dur - 4} fade={30} />
      <Sfx name="dk_match" at={8} volume={0.5} />
      <Sfx name="kk_ring" at={f.anillo - 6} volume={0.85} />
      <Sfx name="sparkle" at={f.anillo + 2} volume={0.35} />
      <Sfx name="dk_quill" at={f.olv} volume={0.8} />
      <Sfx name="kk_fold" at={f.nunca} volume={0.8} />
      <Sfx name="kk_wax" at={f.hizo} volume={0.85} />
      <Sfx name="whoosh_soft" at={f.pero + 6} volume={0.5} />
      <Sfx name="sk_clock" at={f.resto} volume={0.35} dur={f.nomb - f.resto} fade={10} />
      <Sfx name="page_riffle" at={f.escr} volume={0.4} />
      <Sfx name="dk_quill" at={f.nomb} volume={0.7} />
      <Sfx name="dk_quill" at={f.falsos + 6} volume={0.6} />
      <Sfx name="hit_soft" at={f.falsos + 10} volume={0.5} />
      {WAX && null}
    </AbsoluteFill>
  );
};
