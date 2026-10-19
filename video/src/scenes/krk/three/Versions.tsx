import React, { useMemo } from 'react';
import * as THREE from 'three';
import { ThreeCanvas } from '@remotion/three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { Sfx } from '../../../components/Sfx';
import { LogoIcon } from '../../../components/Logo';
import { font, Grain, KR } from '../kit';
import { sceneClock } from '../timeline';
import { Book, ShelfBook } from './books3d';
import { Desk, DeskBackdrop, Headphones } from './Desk';
import { Rig } from './Library';
import { CamKey, easeO, hash, projectAt, ramp01, useFontsReady, V3, AUDIO_ONLY } from './lib3d';

// ————————————————————————————————————————————————————————————————
// VERS (D05): «Solo de Crimen y castigo, en SonorBooks hay más de veinte grabaciones en español.»
// Sobre la mesa, un ejemplar de Crimen y castigo se multiplica en 22 copias idénticas (el libro es el mismo);
// de cada una sube una barra con la duración de su grabación (de 1 h 22 min a 27 h 55 min). Al decir «actores»
// las grabaciones con voz humana se vuelven doradas; al decir «voces digitales», las marcadas «Voz digital», azules.
// Datos: ficha /es/audiolibro/crimen-y-castigo/ (15/10/2026): 32 opciones listadas; aquí, 22 grabaciones distintas
// (mismas narraciones repetidas en varias plataformas, unidas). 8 llevan la marca «Voz digital».
// ————————————————————————————————————————————————————————————————

// [horas, voz digital]
const RECS: [number, boolean][] = [
  [1.37, false], [2.19, false], [2.8, false], [5.13, false], [12.03, false], [19.0, false], [19.5, true], [20.8, false], [20.84, true], [21.23, false],
  [22.42, false], // Jordi Boixaderas (la que recomendamos en la puerta 2)
  [23.72, false], [24.33, true], [24.71, false], [24.8, true], [25.23, false], [25.59, true], [25.66, true], [25.79, true], [26.63, false], [27.35, false], [27.92, true],
];
const HERO = 10;
const K = 1.15; // unidades por hora
const GAP = 0.85;
const ROW = (() => {
  let x = 0;
  const list = RECS.map(([hrs, dig], i) => {
    const b: ShelfBook = { title: 'Crimen y castigo', thick: 2.7, h: 22, depth: 14.6, cloth: '#5A1720', foil: 'gold', variant: 1, seed: hash('cyc') };
    const out = { b, hrs, dig, i, x: x + b.thick / 2 };
    x += b.thick + GAP;
    return out;
  });
  const total = x - GAP;
  list.forEach((p) => (p.x -= total / 2));
  return list;
})();
const HX = ROW[HERO].x;
const GOLD = new THREE.Color('#F2BE3C');
const BLUE = new THREE.Color('#5FA4E0');
const NEUTRAL = new THREE.Color('#E9E2D2');

const VersScene: React.FC<{ f: Record<string, number>; keys: CamKey[] }> = ({ f, keys }) => {
  const frame = useCurrentFrame();
  const barGeo = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 2, 0.12), []);
  const hum = ramp01(frame, f.act - 6, f.act + 14, easeO);
  const dig = ramp01(frame, f.dig - 6, f.dig + 14, easeO);
  const mats = useMemo(() => ({
    hum: new THREE.MeshStandardMaterial({ color: '#E9E2D2', roughness: 0.4, metalness: 0.05, emissive: '#000000' }),
    dig: new THREE.MeshStandardMaterial({ color: '#E9E2D2', roughness: 0.35, metalness: 0.08, emissive: '#000000' }),
    cap: new THREE.MeshStandardMaterial({ color: '#FFF8E0', emissive: '#FFF8E0', emissiveIntensity: 0.7 }),
  }), []);
  mats.hum.color.copy(NEUTRAL).lerp(GOLD, hum);
  mats.hum.emissive.copy(GOLD).multiplyScalar(0.18 * hum);
  mats.dig.color.copy(NEUTRAL).lerp(BLUE, dig);
  mats.dig.emissive.copy(BLUE).multiplyScalar(0.22 * dig);
  return (
    <>
      <Rig keys={keys} shake={0.28} />
      <hemisphereLight args={['#5A5F6E', '#1A120C', 0.55]} />
      <spotLight position={[-70, 150, 130]} angle={0.62} penumbra={0.8} intensity={4.6} decay={0} color="#FFD7A3" castShadow
        shadow-mapSize-width={1536} shadow-mapSize-height={1536} shadow-bias={-0.0004} shadow-normalBias={0.04} />
      <pointLight position={[110, 40, 60]} intensity={0.9} decay={0} distance={300} color={KR} />
      <pointLight position={[HX, 30, 30]} intensity={0.9 * (1 - ramp01(frame, f.solo, f.solo + 60))} decay={0} distance={60} color="#FFE2B0" />
      <Desk />
      <Headphones position={[50, 1.1, 6]} rotation={[-Math.PI / 2, 0, -0.5]} s={0.72} />
      {ROW.map((p) => {
        const a = p.i === HERO ? -100 : f.solo + 4 + Math.abs(p.i - HERO) * 2.6;
        const s = spring({ frame: frame - a, fps: 50, config: { damping: 15, stiffness: 160, mass: 0.8 } });
        if (frame < a) return null;
        const ba = f.unas + p.i * 2.3;
        const bs = spring({ frame: frame - ba, fps: 50, config: { damping: 18, stiffness: 90 } });
        const hgt = Math.max(0.001, p.hrs * K * bs);
        const m = p.dig ? mats.dig : mats.hum;
        return (
          <group key={p.i} position={[p.x, 0, 0]}>
            <Book b={p.b} position={[0, p.b.h / 2 + (1 - s) * 14, 0]} rotation={[0, (1 - s) * 0.5, (1 - s) * 0.18 * (p.i < HERO ? 1 : -1)]} />
            {frame >= ba && hgt > 0.01 && (
              <group>
                <mesh geometry={barGeo} material={m} position={[0, p.b.h + hgt / 2, 0]} scale={[p.b.thick * 0.86, hgt, 9]} castShadow />
                <mesh geometry={barGeo} material={mats.cap} position={[0, p.b.h + hgt + 0.15, 0]} scale={[p.b.thick * 0.86, 0.3, 9]} />
              </group>
            )}
          </group>
        );
      })}
    </>
  );
};

const Pill: React.FC<{ c: string; label: string; icon: 'mic' | 'wave'; k: number }> = ({ c, label, icon, k }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 30px 12px 18px', borderRadius: 999, background: 'rgba(14,15,18,0.72)', border: `2px solid ${c}`,
    boxShadow: `0 16px 40px rgba(0,0,0,0.45), 0 0 30px ${c}44`, opacity: k, transform: `translateY(${(1 - k) * 16}px) scale(${0.9 + 0.1 * k})` }}>
    <svg width="40" height="40" viewBox="0 0 40 40">
      {icon === 'mic' ? (
        <g fill="none" stroke={c} strokeWidth="3.4" strokeLinecap="round">
          <rect x="14" y="5" width="12" height="20" rx="6" fill={c} stroke="none" />
          <path d="M9 19c0 6 5 10 11 10s11-4 11-10M20 29v6M14 35h12" />
        </g>
      ) : (
        <g fill={c}>
          {[6, 12, 18, 24, 30].map((x, i) => { const h = [8, 18, 26, 14, 20][i]; return <rect key={i} x={x} y={20 - h / 2} width="4" height={h} rx="2" />; })}
          <circle cx="36" cy="8" r="3" />
        </g>
      )}
    </svg>
    <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: '#fff' }}>{label}</span>
  </div>
);

export const Versions3D: React.FC = () => {
  const frame = useCurrentFrame();
  const ready = useFontsReady();
  const c = sceneClock('VERS');
  const f = {
    solo: c.at('D05', 'Solo'), sonor: c.at('D05', 'SonorBooks'), veinte: c.at('D05', 'veinte'), unas: c.at('D05', 'Unas'), dos: c.at('D05', 'dos'),
    mas: c.at('D05', 'más', 1), act: c.at('D05', 'actores'), dig: c.at('D05', 'digitales'),
  };
  const keys: CamKey[] = [
    { f: 0, pos: [HX + 6, 15, 46], look: [HX + 1, 11, 2], fov: 30 },
    { f: f.solo, pos: [HX + 4, 15, 50], look: [HX + 0.5, 11.5, 2], fov: 30 },
    { f: f.sonor + 16, pos: [HX * 0.4 - 6, 20, 100], look: [0, 13, 0], fov: 30 },
    { f: f.unas + 4, pos: [-4, 24, 126], look: [0, 18, 0], fov: 30 },
    { f: f.mas + 20, pos: [2, 36, 152], look: [0, 27.5, 0], fov: 30 },
    { f: c.dur, pos: [8, 38, 147], look: [1, 28.5, 0], fov: 30, ease: (t) => t },
  ];
  const badge = ramp01(frame, f.sonor - 8, f.sonor + 8, easeO) * (1 - ramp01(frame, f.unas - 6, f.unas + 8));
  const pHum = spring({ frame: frame - f.act + 2, fps: 50, config: { damping: 14, stiffness: 150 } });
  const pDig = spring({ frame: frame - f.dig + 2, fps: 50, config: { damping: 14, stiffness: 150 } });
  const lab2 = ramp01(frame, f.dos - 4, f.dos + 10, easeO) * (1 - ramp01(frame, f.act - 10, f.act + 4));
  const lab20 = ramp01(frame, f.mas - 2, f.mas + 12, easeO) * (1 - ramp01(frame, f.act - 10, f.act + 4));
  const top = (i: number): V3 => [ROW[i].x, 22 + ROW[i].hrs * K + 2.6, 0];
  const p2 = projectAt(frame, keys, 0.28, top(1));
  const p20 = projectAt(frame, keys, 0.28, [(ROW[15].x + ROW[17].x) / 2, 22 + 25.6 * K + 2.6, 0]);
  return (
    <AbsoluteFill style={{ background: '#0B0C0E' }}>
      <DeskBackdrop x={interpolate(frame, [0, c.dur], [30, -30])} s={1.12} dim={0.4} />
      {ready && !AUDIO_ONLY && (
        <ThreeCanvas width={1920} height={1080} shadows gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }} camera={{ fov: 30, position: [0, 20, 100] }}>
          <VersScene f={f} keys={keys} />
        </ThreeCanvas>
      )}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.6) 100%)', pointerEvents: 'none' }} />
      <Grain seed={Math.floor(frame / 2)} opacity={0.09} />
      {/* de dónde salen los datos */}
      {badge > 0.01 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 84, display: 'flex', justifyContent: 'center', opacity: badge, transform: `translateY(${(1 - badge) * 16}px)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '14px 32px 14px 20px', background: 'rgba(16,17,20,0.7)', borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.16)', boxShadow: '0 20px 50px rgba(0,0,0,0.45)' }}>
            <LogoIcon size={46} />
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 36, color: '#fff' }}>
              <span style={{ fontFamily: font.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 40 }}>Crimen y castigo</span>
              <span style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}> · </span>
              más de 20 grabaciones en español
            </span>
          </div>
        </div>
      )}
      {/* etiquetas de duración */}
      {lab2 > 0.01 && (
        <div style={{ position: 'absolute', left: p2.x, top: p2.y, transform: `translate(-50%, -100%) translateY(${(1 - lab2) * 12}px)`, opacity: lab2 }}>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 54, color: '#fff', background: 'rgba(14,15,18,0.78)', padding: '6px 26px 10px', borderRadius: 14, whiteSpace: 'nowrap' }}>≈ 2 h</div>
        </div>
      )}
      {lab20 > 0.01 && (
        <div style={{ position: 'absolute', left: p20.x, top: p20.y, transform: `translate(-50%, -100%) translateY(${(1 - lab20) * 12}px)`, opacity: lab20 }}>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 54, color: '#fff', background: 'rgba(14,15,18,0.78)', padding: '6px 26px 10px', borderRadius: 14, whiteSpace: 'nowrap' }}>más de 20 h</div>
        </div>
      )}
      {/* leyenda: voz humana / voz digital */}
      {frame >= f.act - 4 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 84, display: 'flex', justifyContent: 'center', gap: 34 }}>
          <Pill c="#F2BE3C" label="Voz humana" icon="mic" k={pHum} />
          {frame >= f.dig - 4 && <Pill c="#5FA4E0" label="Voz digital" icon="wave" k={pDig} />}
        </div>
      )}
      {/* sonido */}
      <Sfx name="sk_book_thud" at={f.solo + 2} volume={0.3} />
      {Array.from({ length: 11 }).map((_, k) => <Sfx key={k} name="sk_book_slide" at={Math.round(f.solo + 6 + k * 2.6)} volume={0.26 + 0.06 * (k % 3)} />)}
      <Sfx name="ui_pop" at={f.sonor} volume={0.6} />
      <Sfx name="riser" at={f.unas - 10} volume={0.28} />
      {Array.from({ length: 8 }).map((_, k) => <Sfx key={`b${k}`} name="tick" at={Math.round(f.unas + 4 + k * 6.3)} volume={0.35} />)}
      <Sfx name="hit_soft" at={f.dos} volume={0.5} />
      <Sfx name="hit_soft" at={f.mas} volume={0.55} />
      <Sfx name="shimmer" at={f.act} volume={0.5} />
      <Sfx name="ui_pop" at={f.dig} volume={0.55} />
    </AbsoluteFill>
  );
};
