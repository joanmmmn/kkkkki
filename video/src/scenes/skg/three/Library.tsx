import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { ThreeCanvas } from '@remotion/three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { AbsoluteFill, getInputProps, interpolate, spring, useCurrentFrame } from 'remotion';
const BENCH = getInputProps() as { aa?: boolean; sm?: number; dpr?: number; lights?: number; noGL?: boolean; noOv?: boolean; bare?: boolean };
import { Sfx, ChangeTicks } from '../../../components/Sfx';
import { MaskTitle } from '../../nxr/kit';
import { clamp, easeInOut, easeOut } from '../../../lib/anim';
import { color, font, Grain, KR, NOVELS } from '../kit';
import { NOVEL_YEARS } from '../Bio';
import { sceneClock } from '../timeline';
import { Book, bookGeo, bookMaterials, plateTex, sheetTex, ShelfBook, woodTex } from './books3d';
import { camAt, CamKey, easeO, handheld, hash, lerp, ramp01, rng, useFontsReady, V3 } from './lib3d';

// ————————————————————————————————————————————————————————————————
// HOOK en 3D: la biblioteca de Stephen King se llena (las 64 novelas en orden de publicación), caen los relatos,
// unas placas de latón marcan los años de 1974 a hoy y la cámara se aleja para la pregunta.
// ————————————————————————————————————————————————————————————————

export const CLOTHS: { c: string; foil: ShelfBook['foil'] }[] = [
  { c: '#6E1219', foil: 'gold' }, { c: '#1D2A3E', foil: 'gold' }, { c: '#24452F', foil: 'gold' }, { c: '#2E3035', foil: 'silver' },
  { c: '#8A5A22', foil: 'cream' }, { c: '#3F2A5C', foil: 'gold' }, { c: '#4E3326', foil: 'gold' }, { c: '#163A3C', foil: 'cream' },
  { c: '#1E2433', foil: 'silver' }, { c: '#C9BFA9', foil: 'red' }, { c: '#7D1F14', foil: 'cream' }, { c: '#111214', foil: 'gold' },
];
const THICK: Record<string, number> = {
  It: 6.4, Apocalipsis: 6.2, 'La cúpula': 6.0, '22/11/63': 5.4, Insomnia: 5.0, 'Los Tommyknockers': 4.9, 'La Torre Oscura': 5.2, 'Mago y cristal': 4.8,
  'Lobos del Calla': 4.9, 'Cuento de hadas': 4.6, 'El Instituto': 4.2, 'La historia de Lisey': 4.4, 'Duma Key': 4.4, 'Desesperación': 4.2, Holly: 3.9,
  Christine: 4.3, 'El talismán': 4.6, 'Casa Negra': 4.6, Cell: 3.4, 'Billy Summers': 3.9, 'Fin de guardia': 3.5, 'Doctor Sueño': 4.1, Carrie: 2.4,
  Rabia: 2.1, 'Los ojos del dragón': 3.0, 'El ciclo del hombre lobo': 1.9, 'Colorado Kid': 1.9, 'Elevación': 1.8, Joyland: 2.6, Blaze: 2.8,
  'La larga marcha': 2.9, 'El fugitivo': 2.6, 'El pistolero': 2.6, 'Después': 2.5, 'No tengas miedo': 4.0, 'Cementerio de animales': 3.9, Misery: 3.4,
};

export const ROW_Y = [20, -12, -44]; // cara superior de cada balda
const GAP = 0.14;

type Placed = { b: ShelfBook; i: number; row: number; x: number; y: number; lean: number; year: number };

// Distribución determinista de las 64 novelas en tres baldas.
export const LAYOUT = (() => {
  const r = rng(1974);
  const books: ShelfBook[] = NOVELS.map((t, i) => {
    const cl = CLOTHS[(i * 5 + Math.floor(r() * 3)) % CLOTHS.length];
    return {
      title: t, thick: THICK[t] ?? 2.8 + r() * 1.3, h: 20.6 + r() * 4, depth: 14.6 + r() * 1.4, cloth: cl.c, foil: cl.foil,
      variant: (Math.floor(r() * 4) % 4) as ShelfBook['variant'], seed: hash(t),
    };
  });
  const total = books.reduce((s, b) => s + b.thick + GAP, 0);
  const W = Math.ceil(total / 3 + 5);
  const placed: Placed[] = [];
  let row = 0;
  let x = -W / 2 + 0.6;
  const rowEnds: number[] = [];
  books.forEach((b, i) => {
    if (x + b.thick > W / 2 - 0.4 && row < 2) {
      rowEnds.push(i - 1);
      row += 1;
      x = -W / 2 + 0.6;
    }
    placed.push({ b, i, row, x: x + b.thick / 2, y: ROW_Y[row] + b.h / 2, lean: 0, year: NOVEL_YEARS[i] });
    x += b.thick + GAP;
  });
  rowEnds.push(books.length - 1);
  // El último libro de cada balda se apoya inclinado si sobra hueco.
  rowEnds.forEach((idx, rr) => {
    const p = placed[idx];
    const right = p.x + p.b.thick / 2;
    const free = W / 2 - right;
    if (free > 1.2) {
      const a = Math.min(0.32, Math.atan2(free * 0.9, p.b.h));
      const left = p.x - p.b.thick / 2;
      // gira alrededor de su esquina inferior izquierda
      const cx = left + Math.cos(-a) * (p.b.thick / 2) - Math.sin(-a) * (p.b.h / 2);
      const cy = ROW_Y[rr] + Math.sin(-a) * (p.b.thick / 2) + Math.cos(-a) * (p.b.h / 2);
      p.x = cx;
      p.y = cy;
      p.lean = -a;
    }
  });
  return { placed, W, rowEnds };
})();

// Entorno para que los dorados reflejen algo (sin él, el metal se ve negro).
const Env: React.FC<{ intensity: number }> = ({ intensity }) => {
  const { gl, scene } = useThree();
  useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    pm.dispose();
  }, [gl, scene]);
  scene.environmentIntensity = intensity;
  return null;
};

export const Rig: React.FC<{ keys: CamKey[]; shake?: number }> = ({ keys, shake = 0.5 }) => {
  const frame = useCurrentFrame();
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const c = camAt(frame, keys);
  const hh = handheld(frame, shake);
  camera.position.set(c.pos[0] + hh[0], c.pos[1] + hh[1], c.pos[2]);
  camera.fov = c.fov;
  camera.near = 1;
  camera.far = 1200;
  camera.updateProjectionMatrix();
  camera.lookAt(c.look[0] + hh[0] * 0.6, c.look[1] + hh[1] * 0.6, c.look[2]);
  return null;
};

// Estantería: fondo, laterales, techo y baldas.
export const Bookcase: React.FC<{ W: number; lit?: number; bare?: boolean }> = ({ W, bare = false }) => {
  const shelfMat = useMemo(() => new THREE.MeshStandardMaterial({ map: woodTex('#3B2618', 'shelf'), roughness: 0.62, metalness: 0 }), []);
  const backMat = useMemo(() => new THREE.MeshStandardMaterial({ map: woodTex('#21150D', 'back', true), roughness: 0.85, metalness: 0 }), []);
  const sideMat = useMemo(() => new THREE.MeshStandardMaterial({ map: woodTex('#33200F', 'side'), roughness: 0.65 }), []);
  const top = ROW_Y[0] + 32;
  const bottom = ROW_Y[2] - 6;
  const H = top - bottom;
  return (
    <group>
      <mesh position={[0, (top + bottom) / 2, -9.6]} receiveShadow material={backMat}><boxGeometry args={[W + 6, H + 4, 1]} /></mesh>
      {[...ROW_Y, top].map((y, k) => (
        <mesh key={k} position={[0, y - 1.2, 0.6]} receiveShadow castShadow material={shelfMat}><boxGeometry args={[W + 6, 2.4, 21]} /></mesh>
      ))}
      <mesh position={[0, bottom - 1, 1]} receiveShadow material={sideMat}><boxGeometry args={[W + 10, 10, 22]} /></mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (W / 2 + 1.6), (top + bottom) / 2 + 1, 0.6]} castShadow receiveShadow material={sideMat}><boxGeometry args={[3.2, H + 8, 22]} /></mesh>
      ))}
      <mesh position={[0, top + 2.4, 1]} castShadow receiveShadow material={sideMat}><boxGeometry args={[W + 12, 3.4, 24]} /></mesh>
      {!bare && <>
      {/* suelo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, bottom - 6, 40]} receiveShadow>
        <planeGeometry args={[600, 300]} />
        <meshStandardMaterial color="#14100C" roughness={0.9} />
      </mesh>
      {/* paredes a los lados */}
      <mesh position={[0, 10, -10.5]} receiveShadow>
        <planeGeometry args={[800, 400]} />
        <meshStandardMaterial color="#17130F" roughness={1} />
      </mesh>
      </>}
    </group>
  );
};

const SHEETS = 130;

// Estanterías vecinas: libros genéricos sin título, en penumbra (10 modelos repetidos para no multiplicar texturas).
const SIDE_PROTOS: ShelfBook[] = Array.from({ length: 10 }).map((_, k) => {
  const r = rng(300 + k);
  const cl = CLOTHS[(k * 7) % CLOTHS.length];
  return { title: '', author: '', thick: 2.4 + r() * 2.6, h: 19.5 + r() * 5, depth: 15, cloth: cl.c, foil: cl.foil, variant: (k % 4) as ShelfBook['variant'], seed: 900 + k };
});
const SIDE = (() => {
  const r = rng(77);
  const out: { b: ShelfBook; x: number; y: number }[] = [];
  const W = LAYOUT.W;
  [-1, 1].forEach((side) => {
    ROW_Y.forEach((ry) => {
      let x = side * (W + 7.4) - W / 2 + 0.6;
      while (x < side * (W + 7.4) + W / 2 - 5) {
        const b = SIDE_PROTOS[Math.floor(r() * SIDE_PROTOS.length)];
        out.push({ b, x: x + b.thick / 2, y: ry + b.h / 2 });
        x += b.thick + 0.16;
      }
    });
  });
  return out;
})();
const SideCases: React.FC = () => {
  const W = LAYOUT.W;
  return (
    <>
      {[-1, 1].map((sd) => <group key={sd} position={[sd * (W + 7.4), 0, 0]}><Bookcase W={W} bare /></group>)}
      {SIDE.map((p, i) => <Book key={i} b={p.b} position={[p.x, p.y, 0.6 + 7.5 - p.b.depth / 2]} castShadow={false} />)}
    </>
  );
};

const HookScene: React.FC<{ fNov: number; fRel: number; fSig: number; fQ: number; fPor: number; dur: number; ySweep: [number, number] }> = ({ fNov, fRel, fSig, fQ, fPor, dur, ySweep }) => {
  const frame = useCurrentFrame();
  const { placed, W } = LAYOUT;
  const dropAt = (i: number) => fNov - 30 + i * 1.18;
  const lamp = ramp01(frame, 2, 34) * (1 - 0.12 * ramp01(frame, fQ, fPor));
  const flick = frame < 34 ? 0.82 + 0.18 * Math.abs(Math.sin(frame * 1.7)) : 1;
  // Año que corre de 1974 a 2026 y los libros/placas que se encienden a su paso.
  const yearNow = lerp(1974, 2026, ramp01(frame, ySweep[0], ySweep[1], (t) => 1 - Math.pow(1 - t, 2)));
  const sweeping = ramp01(frame, ySweep[0] - 6, ySweep[0] + 6) * (1 - ramp01(frame, ySweep[1] + 10, ySweep[1] + 40));
  const curIdx = placed.reduce((m, p) => (p.year <= yearNow ? p.i : m), 0);
  const keys: CamKey[] = [
    { f: 0, pos: [-33, 32, 44], look: [-27, 30, 0], fov: 34 },
    { f: fNov + 40, pos: [-4, 27, 78], look: [0, 26, 0], fov: 33 },
    { f: fRel + 10, pos: [6, 9, 118], look: [2, 7, 0], fov: 32 },
    { f: fSig + 10, pos: [-10, 0, 128], look: [0, 1, 0], fov: 31 },
    { f: fQ, pos: [10, 5, 128], look: [2, 4, 0], fov: 31 },
    { f: fPor, pos: [0, 4, 150], look: [0, 3, 0], fov: 31 },
    { f: dur, pos: [-2, 4, 158], look: [0, 3, 0], fov: 31, ease: (t) => t },
  ];
  const plates = useMemo(() => {
    const out: { idx: number; year: number }[] = [];
    [1974, 1980, 1990, 2000, 2010, 2020].forEach((d) => {
      const idx = placed.findIndex((p) => p.year >= d);
      if (idx >= 0) out.push({ idx, year: d === 1974 ? 1974 : d });
    });
    return out;
  }, [placed]);
  const plateGeo = useMemo(() => new THREE.PlaneGeometry(4.6, 1.72), []);
  const sheetGeo = useMemo(() => new THREE.PlaneGeometry(4.3, 6), []);
  const sheetMats = useMemo(() => Array.from({ length: 6 }).map((_, k) => new THREE.MeshStandardMaterial({ map: sheetTex(k), side: THREE.DoubleSide, roughness: 0.92, emissive: new THREE.Color('#FFF3DC'), emissiveMap: sheetTex(k), emissiveIntensity: 0.32 })), []);
  const plateMats = useMemo(() => plates.map((p) => new THREE.MeshStandardMaterial({ map: plateTex(p.year), roughness: 0.35, metalness: 0.75, emissive: new THREE.Color('#FFC46B'), emissiveIntensity: 0 })), [plates]);
  plates.forEach((p, k) => {
    plateMats[k].emissiveIntensity = 0.55 * ramp01(yearNow, p.year - 0.6, p.year + 1.5) * (0.4 + 0.6 * sweeping) + 0.04;
  });
  return (
    <>
      <color attach="background" args={['#0B0C0E']} />
      <fog attach="fog" args={['#0B0C0E', 160, 420]} />
      <Rig keys={keys} shake={0.35} />
      <hemisphereLight args={['#4A4F5C', '#1A120C', 0.42 * lamp]} />
      <spotLight position={[-70, 120, 150]} angle={0.5} penumbra={0.85} intensity={5.2 * lamp * flick} decay={0} color="#FFD7A3" castShadow
        shadow-mapSize-width={BENCH.sm || 1536} shadow-mapSize-height={BENCH.sm || 1536} shadow-bias={-0.0004} shadow-normalBias={0.04} />
      <pointLight position={[70, -30, 70]} intensity={(0.9 + 0.8 * ramp01(frame, fQ, fPor)) * lamp} decay={0} distance={260} color={KR} />
      {/* luz que recorre la balda del año en curso */}
      <pointLight position={[placed[curIdx].x, ROW_Y[placed[curIdx].row] + 14, 22]} intensity={sweeping * 2.6} decay={0} distance={34} color="#FFD58A" />
      <Bookcase W={W} />
      <SideCases />
      {placed.map((p) => {
        const a = dropAt(p.i);
        const s = spring({ frame: frame - a, fps: 50, config: { damping: 15, stiffness: 150, mass: 0.85 } });
        if (frame < a) return null;
        const tilt = spring({ frame: frame - a - 4, fps: 50, config: { damping: 9, stiffness: 120 } });
        const z0 = 0.6 + 7.5 - p.b.depth / 2;
        const pos: V3 = [p.x, p.y + (1 - s) * 7, z0 + (1 - s) * 30];
        const rot: V3 = [(1 - s) * -0.35, (1 - s) * 0.25, p.lean + (1 - tilt) * 0.05 * (p.i % 2 ? 1 : -1)];
        return <Book key={p.i} b={p.b} position={pos} rotation={rot} />;
      })}
      {plates.map((pl, k) => {
        const p = placed[pl.idx];
        return <mesh key={pl.year} geometry={plateGeo} material={plateMats[k]} position={[p.x - p.b.thick / 2 + 2.3, ROW_Y[p.row] - 1.2, 11.15]} />;
      })}
      {/* Lluvia de relatos */}
      {frame >= fRel - 8 && Array.from({ length: SHEETS }).map((_, i) => {
        const r = rng(500 + i);
        const t0 = fRel - 8 + r() * 46;
        const t = frame - t0;
        if (t < 0) return null;
        const vy = 0.5 + r() * 0.45;
        const y = 62 - t * vy;
        if (y < -60) return null;
        const ph = r() * 6.28;
        const x = -58 + r() * 116 + Math.sin(t / 22 + ph) * 5;
        const z = 14 + r() * 62;
        const rx = Math.sin(t / 13 + ph) * 1.15 + 0.35;
        const ry = ph + t * (r() - 0.5) * 0.05;
        const rz = Math.sin(t / 19 + ph * 2) * 0.55;
        return <mesh key={i} geometry={sheetGeo} material={sheetMats[i % 6]} position={[x, y, z]} rotation={[rx, ry, rz]} castShadow={i % 4 === 0} />;
      })}
    </>
  );
};

const QUESTIONS: { t: string; x: number; y: number; d: number }[] = [
  { t: '¿It o El resplandor?', x: 520, y: 290, d: 0.9 },
  { t: '¿Hay que leerlo en orden?', x: 1400, y: 250, d: 1.1 },
  { t: '¿Cuál da más miedo?', x: 1270, y: 560, d: 0.8 },
  { t: '¿Y si no me gusta el terror?', x: 600, y: 730, d: 1.15 },
  { t: '¿Por cuál empiezo?', x: 1430, y: 845, d: 0.95 },
];

export const Hook3D: React.FC = () => {
  const frame = useCurrentFrame();
  const ready = useFontsReady();
  const c = sceneClock('HOOK');
  const fNov = c.at('G01', 'sesenta');
  const fRel = c.at('G01', 'doscientos');
  const fSig = c.at('G01', 'Medio');
  const fQ = c.part('G02');
  const fPor = c.at('G02', 'por');
  const fKing = c.at('G02', 'Stephen');
  const ySweep: [number, number] = [fSig - 2, fSig + 72];
  const dim = BENCH.bare ? 0 : ramp01(frame, fPor - 14, fPor + 16);
  const statIn = (a: number) => interpolate(frame, [a - 2, a + 14], [0, 1], { ...clamp, easing: easeOut });
  const statOut = (b: number) => interpolate(frame, [b - 10, b], [0, 1], { ...clamp, easing: easeInOut });
  const s1 = statIn(fNov) * (1 - statOut(fRel));
  const s2 = statIn(fRel) * (1 - statOut(fSig));
  const s3 = statIn(fSig) * (1 - statOut(fQ + 6));
  const count = (a: number, n: number) => Math.round(interpolate(frame, [a - 2, a + 20], [0, n], { ...clamp, easing: easeOut }));
  const year = Math.round(lerp(1974, 2026, ramp01(frame, ySweep[0], ySweep[1], (t) => 1 - Math.pow(1 - t, 2))));
  const stats = [
    { o: s1, big: `+${count(fNov, 60)}`, small: 'novelas' },
    { o: s2, big: `+${count(fRel, 200)}`, small: 'relatos' },
    { o: s3, big: `+${count(fSig, 50)}`, small: 'años escribiendo', sub: `1974 → ${year}` },
  ];
  return (
    <AbsoluteFill style={{ background: '#0B0C0E' }}>
      <AbsoluteFill style={{ filter: dim > 0.01 ? `blur(${(dim * 7).toFixed(2)}px) brightness(${(1 - dim * 0.42).toFixed(3)})` : undefined, transform: `scale(${1 + dim * 0.03})` }}>
        {ready && !BENCH.noGL && (
          <ThreeCanvas width={1920} height={1080} shadows dpr={BENCH.dpr ?? undefined} gl={{ antialias: BENCH.aa ?? false, powerPreference: 'high-performance' }} camera={{ fov: 34, position: [0, 0, 100] }}>
            <HookScene fNov={fNov} fRel={fRel} fSig={fSig} fQ={fQ} fPor={fPor} dur={c.dur} ySweep={ySweep} />
          </ThreeCanvas>
        )}
      </AbsoluteFill>
      {BENCH.bare ? null : <>
      {/* viñeta y grano de película */}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 46%, rgba(0,0,0,0.62) 100%)', pointerEvents: 'none' }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(11,12,14,${1 - ramp01(frame, 0, 26)}) 0%, rgba(11,12,14,${1 - ramp01(frame, 0, 26)}) 100%)` }} />
      {!BENCH.noOv && <Grain seed={Math.floor(frame / 2)} opacity={0.1} />}
      {/* Cifras */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        {stats.map((s, k) => s.o > 0.002 && (
          <div key={k} style={{ position: 'absolute', textAlign: 'center', opacity: s.o, transform: `translateY(${(1 - s.o) * 18}px) scale(${0.94 + 0.06 * s.o})`, filter: s.o < 0.99 ? `blur(${((1 - s.o) * 10).toFixed(2)}px)` : undefined }}>
            <div style={{ position: 'absolute', left: -380, right: -380, top: -170, bottom: -170, background: 'radial-gradient(ellipse, rgba(6,6,8,0.78) 0%, rgba(6,6,8,0.5) 42%, rgba(6,6,8,0) 70%)' }} />
            <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 700, fontSize: 250, letterSpacing: -10, lineHeight: 0.9, color: '#fff', fontVariantNumeric: 'tabular-nums', textShadow: '0 10px 60px rgba(0,0,0,0.6)' }}>{s.big}</div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, marginTop: 18 }}>
              <div style={{ width: 70 * s.o, height: 3, background: color.yellow, borderRadius: 2 }} />
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 44, letterSpacing: 8, textTransform: 'uppercase', color: color.yellow }}>{s.small}</div>
              <div style={{ width: 70 * s.o, height: 3, background: color.yellow, borderRadius: 2 }} />
            </div>
            {s.sub && <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 500, fontSize: 38, color: 'rgba(255,255,255,0.82)', marginTop: 14, fontVariantNumeric: 'tabular-nums' }}>{s.sub}</div>}
          </div>
        ))}
      </AbsoluteFill>
      {/* Las dudas de siempre: tarjetas de cristal a distintas profundidades */}
      {frame >= fQ && frame < fPor + 30 && QUESTIONS.map((q, k) => {
        const a = fQ + 8 + k * 16;
        const s = spring({ frame: frame - a, fps: 50, config: { damping: 15, stiffness: 150 } });
        const o = ramp01(frame, fPor - 10, fPor + 8);
        if (frame < a) return null;
        const drift = (frame - a) * 0.12 * (q.x < 960 ? -1 : 1) * q.d;
        return (
          <div key={k} style={{ position: 'absolute', left: q.x + drift, top: q.y - (frame - a) * 0.06 * q.d, transform: `translate(-50%, -50%) scale(${(0.82 + 0.18 * s) * q.d * (1 + 0.15 * o)})`, opacity: s * (1 - o),
            filter: o > 0.01 || s < 0.98 ? `blur(${(o * 10 + (1 - s) * 6).toFixed(2)}px)` : undefined }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, background: 'rgba(22,23,27,0.58)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.16)', color: '#fff',
              fontFamily: font.sans, fontWeight: 700, fontSize: 38, padding: '18px 32px 18px 18px', borderRadius: 24, boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)', whiteSpace: 'nowrap' }}>
              <div style={{ width: 46, height: 46, borderRadius: '50%', background: k === 4 ? color.yellow : KR, color: k === 4 ? color.ink : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>?</div>
              {q.t}
            </div>
          </div>
        );
      })}
      {/* La pregunta */}
      {frame >= fPor - 6 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <MaskTitle text="¿Por dónde empiezo" at={fPor - 2} size={136} align="center" color="#fff" style={{ textShadow: '0 12px 50px rgba(0,0,0,0.55)' }} />
          <MaskTitle text="con Stephen King?" at={fKing - 8} size={136} align="center" color={color.yellow} style={{ marginTop: -6, textShadow: '0 12px 50px rgba(0,0,0,0.55)' }} />
          <div style={{ marginTop: 34, width: 520 * ramp01(frame, fKing + 6, fKing + 34, easeO), height: 6, borderRadius: 3, background: KR }} />
        </AbsoluteFill>
      )}
      {/* Sonido */}
      <Sfx name="click" at={3} volume={0.8} />
      <Sfx name="reverse_swell" at={fNov - 30} volume={0.5} />
      {LAYOUT.placed.filter((_, i) => i % 5 === 0).map((p) => <Sfx key={p.i} name="sk_book_slide" at={Math.round(fNov - 30 + p.i * 1.18) + 2} volume={0.32 + 0.12 * ((p.i / 5) % 3)} />)}
      {LAYOUT.placed.filter((_, i) => i % 9 === 4).map((p) => <Sfx key={`t${p.i}`} name="sk_book_thud" at={Math.round(fNov - 30 + p.i * 1.18) + 10} volume={0.28} />)}
      <Sfx name="hit_soft" at={fNov} volume={0.7} />
      <Sfx name="page_riffle" at={fRel - 4} volume={0.9} />
      <Sfx name="page_turn" at={fRel + 18} volume={0.5} />
      <Sfx name="hit_soft" at={fRel} volume={0.55} />
      <ChangeTicks value={(f) => String(Math.round(lerp(1974, 2026, ramp01(f, ySweep[0], ySweep[1], (t) => 1 - Math.pow(1 - t, 2))) / 2))} from={ySweep[0]} to={ySweep[1]} volume={0.5} />
      <Sfx name="shimmer" at={fSig + 4} volume={0.4} />
      <Sfx name="whoosh_deep" at={fQ + 2} volume={0.55} />
      {QUESTIONS.map((_, k) => <Sfx key={`q${k}`} name="ui_pop" at={fQ + 9 + k * 16} volume={0.5} />)}
      <Sfx name="impact" at={fKing} volume={0.55} />
      </>}
    </AbsoluteFill>
  );
};
export const _hk = { bookGeo, bookMaterials };
