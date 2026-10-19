import React from 'react';
import { ThreeCanvas } from '@remotion/three';
import { AbsoluteFill, spring, useCurrentFrame } from 'remotion';
import { Sfx } from '../../../components/Sfx';
import { LogoIcon } from '../../../components/Logo';
import { color, font, Grain, IN_AUDIO, KR } from '../kit';
import { sceneClock } from '../timeline';
import { LAYOUT, NameScene, ROW_Y } from './Library';
import { AUDIO_ONLY, CamKey, easeO, projectAt, ramp01, useFontsReady } from './lib3d';

// ————————————————————————————————————————————————————————————————
// VERS (J05): «Publicó más de treinta obras, y en audiolibro en español solo hay cuatro.»
// La misma biblioteca, de lejos: un contador sube hasta 35 (las obras que publicó en vida). Al decir «cuatro», las cuatro
// que tienen audiolibro en español salen de la balda con luz propia y el resto se hunde en la sombra.
// Diario de un seductor es la última parte de O lo uno o lo otro, y La pureza de corazón, la primera de los Discursos
// edificantes en diversos espíritus: por eso se iluminan esos dos lomos, con el título del audiolibro encima.
// ————————————————————————————————————————————————————————————————

const LABEL: Record<string, { t: string; sub?: string }> = {
  'O lo uno o lo otro': { t: 'Diario de un seductor', sub: 'de O lo uno o lo otro' },
  'Temor y temblor': { t: 'Temor y temblor' },
  'Discursos edificantes en diversos espíritus': { t: 'La pureza de corazón', sub: 'de Discursos edificantes…' },
  'La enfermedad mortal': { t: 'La enfermedad mortal' },
};

export const Works3D: React.FC = () => {
  const frame = useCurrentFrame();
  const ready = useFontsReady();
  const c = sceneClock('VERS');
  const f = { pub: c.at('J05', 'Publicó'), treinta: c.at('J05', 'treinta'), cuatro: c.at('J05', 'cuatro'), buena: c.at('J05', 'buena'), puertas: c.at('J05', 'puertas') };
  const keys: CamKey[] = [
    { f: 0, pos: [-8, 8, 214], look: [-3, 5, 0], fov: 32 },
    { f: f.cuatro, pos: [0, 6, 200], look: [0, 4, 0], fov: 32 },
    { f: f.puertas, pos: [3, 5, 186], look: [1, 4, 0], fov: 32 },
    { f: c.dur, pos: [4, 5, 182], look: [1, 4, 0], fov: 32, ease: (t) => t },
  ];
  const count = Math.round(35 * ramp01(frame, f.pub, f.treinta + 24, easeO));
  const badge1 = ramp01(frame, f.pub - 8, f.pub + 8, easeO) * (1 - ramp01(frame, f.cuatro - 4, f.cuatro + 8));
  const badge2 = ramp01(frame, f.cuatro, f.cuatro + 14, easeO);
  const doors = ramp01(frame, f.puertas - 4, f.puertas + 14, easeO);
  const books = LAYOUT.placed.filter((p) => IN_AUDIO.includes(p.b.title));
  return (
    <AbsoluteFill style={{ background: '#0B0C0E' }}>
      {ready && !AUDIO_ONLY && (
        <ThreeCanvas width={1920} height={1080} shadows gl={{ antialias: false, powerPreference: 'high-performance' }} camera={{ fov: 33, position: [0, 0, 150] }}>
          <NameScene keys={keys} fGreat={f.cuatro} fQ={c.dur + 999} fPor={c.dur + 999} pullK={7} drop={false} />
        </ThreeCanvas>
      )}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 46%, rgba(0,0,0,0.62) 100%)', pointerEvents: 'none' }} />
      <Grain seed={Math.floor(frame / 2)} opacity={0.1} />
      {/* rótulos junto a las cuatro (a un lado, a media altura del lomo, con una línea hasta el libro) */}
      {books.map((p, k) => {
        const a = f.cuatro + 8 + k * 5;
        const s = spring({ frame: frame - a, fps: 50, config: { damping: 14, stiffness: 160 } });
        if (frame < a) return null;
        const sameRow = books.filter((q) => q.row === p.row);
        const left = sameRow.length > 1 ? sameRow.indexOf(p) === 0 : p.row === 2;
        const edge = projectAt(frame, keys, 0.32, [p.x + (left ? -p.b.thick / 2 : p.b.thick / 2), p.y, 15.5]);
        const L = LABEL[p.b.title];
        const gold = doors > 0.5;
        const lineW = 70;
        return (
          <div key={k} style={{ position: 'absolute', left: edge.x + (left ? -lineW : lineW) * s, top: edge.y, transform: `translate(${left ? '-100%' : '0%'}, -50%)`, opacity: s, display: 'flex', alignItems: 'center', flexDirection: left ? 'row-reverse' : 'row' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: left ? 'flex-end' : 'flex-start', padding: '10px 22px 12px', borderRadius: 14, background: gold ? color.yellow : 'rgba(14,15,18,0.86)', border: '1px solid rgba(255,255,255,0.16)', boxShadow: '0 14px 30px rgba(0,0,0,0.45)', whiteSpace: 'nowrap' }}>
              <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: gold ? color.ink : '#fff' }}>{L.t}</span>
              {L.sub && <span style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 24, color: gold ? 'rgba(16,16,16,0.62)' : 'rgba(255,255,255,0.62)', marginTop: 2 }}>{L.sub}</span>}
            </div>
            <div style={{ position: 'absolute', [left ? 'left' : 'right']: '100%', top: '50%', width: lineW * s, height: 3, background: gold ? color.yellow : 'rgba(255,255,255,0.7)', transform: 'translateY(-50%)' } as React.CSSProperties} />
          </div>
        );
      })}
      {/* contador → cuatro */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 40, display: 'flex', justifyContent: 'center' }}>
        {badge1 > 0.01 && (
          <div style={{ position: 'absolute', display: 'flex', alignItems: 'center', gap: 20, padding: '14px 34px 14px 26px', background: 'rgba(16,17,20,0.74)', borderRadius: 999, border: '1px solid rgba(255,255,255,0.16)',
            opacity: badge1, transform: `translateY(${(1 - badge1) * 14}px)` }}>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 64, color: color.yellow, fontVariantNumeric: 'tabular-nums', minWidth: 76, textAlign: 'right' }}>{count}</span>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: '#fff' }}>obras publicadas en vida <span style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>· 1838–1855</span></span>
          </div>
        )}
        {badge2 > 0.01 && (
          <div style={{ position: 'absolute', display: 'flex', alignItems: 'center', gap: 18, padding: '14px 34px 14px 20px', background: 'rgba(16,17,20,0.78)', borderRadius: 999, border: `2px solid ${KR}`,
            opacity: badge2, transform: `translateY(${(1 - badge2) * 14}px)` }}>
            <LogoIcon size={46} />
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: '#fff' }}>En audiolibro en español: <span style={{ color: color.yellow, fontSize: 52 }}>4</span></span>
          </div>
        )}
      </div>
      <Sfx name="whoosh_soft" at={2} volume={0.4} />
      {Array.from({ length: 12 }).map((_, k) => <Sfx key={k} name="tick" at={Math.round(f.pub + 2 + k * ((f.treinta + 22 - f.pub) / 12))} volume={0.3} />)}
      <Sfx name="hit_soft" at={f.cuatro} volume={0.6} />
      <Sfx name="sk_book_slide" at={f.cuatro + 2} volume={0.5} />
      <Sfx name="shimmer" at={f.cuatro + 6} volume={0.45} />
      <Sfx name="ui_pop" at={f.puertas} volume={0.5} />
    </AbsoluteFill>
  );
};
