import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { ThreeCanvas } from '@remotion/three';
import { AbsoluteFill, getInputProps, interpolate, spring, useCurrentFrame } from 'remotion';
const BENCH = getInputProps() as { aa?: boolean; sm?: number; dpr?: number; noGL?: boolean; noOv?: boolean; bare?: boolean };
import { Sfx } from '../../../components/Sfx';
import { MaskTitle } from '../../nxr/kit';
import { clamp, easeInOut, easeOut } from '../../../lib/anim';
import { color, font, GREAT_FIVE, Grain, KR, NOVELS, NOVEL_YEARS } from '../kit';
import { sceneClock } from '../timeline';
import { Book, plateTex, ShelfBook, woodTex } from './books3d';
import { camAt, CamKey, easeO, handheld, hash, ramp01, rng, useFontsReady, V3, AUDIO_ONLY } from './lib3d';

// ————————————————————————————————————————————————————————————————
// NAME en 3D (D03–D04): la biblioteca de Dostoievski se llena con sus obras en orden de publicación, placas de latón
// con los años, las cinco grandes novelas se iluminan y, al hablar de «nombres rusos imposibles», aparecen fichas
// de papel con nombres completos de sus personajes. Termina en la pregunta.
// ————————————————————————————————————————————————————————————————

export const CLOTHS: { c: string; foil: ShelfBook['foil'] }[] = [
  { c: '#5A1720', foil: 'gold' }, { c: '#1D2A3E', foil: 'gold' }, { c: '#24452F', foil: 'gold' }, { c: '#2E3035', foil: 'silver' },
  { c: '#7A5A2A', foil: 'cream' }, { c: '#35192A', foil: 'gold' }, { c: '#4E3326', foil: 'gold' }, { c: '#163A3C', foil: 'cream' },
  { c: '#1E2433', foil: 'silver' }, { c: '#C9BFA9', foil: 'red' }, { c: '#6E1A16', foil: 'cream' }, { c: '#111214', foil: 'gold' },
];
// Grosor (cm) aproximado de cada obra: las novelas largas, gruesas; los relatos, finos.
const THICK: Record<string, number> = {
  'Los hermanos Karamázov': 7.4, 'Los demonios': 6.4, 'El idiota': 6.0, 'Crimen y castigo': 5.8, 'El adolescente': 5.6, 'Humillados y ofendidos': 4.4,
  'Memorias de la casa muerta': 4.0, 'Nétochka Nezvánova': 3.0, 'El sueño del tío': 2.9, 'El jugador': 2.8, 'El eterno marido': 2.7, 'Pobres gentes': 2.6, 'El doble': 2.8,
  'Memorias del subsuelo': 2.5, 'Diario de un escritor': 4.8, 'Noches blancas': 1.9, 'La patrona': 2.0, 'Corazón débil': 1.8, 'La sumisa': 1.9,
  'El sueño de un hombre ridículo': 1.6, 'El cocodrilo': 1.6, 'Bobok': 1.5, 'El campesino Maréi': 1.4, 'Novela en nueve cartas': 1.4, 'El ladrón honrado': 1.5,
  'Un árbol de Navidad y una boda': 1.4, 'El pequeño héroe': 1.7,
};

export const ROW_Y = [20, -12, -44]; // cara superior de cada balda
const GAP = 0.14;

type Placed = { b: ShelfBook; i: number; row: number; x: number; y: number; lean: number; year: number };

// Distribución determinista de sus obras en tres baldas (orden de publicación).
export const LAYOUT = (() => {
  const r = rng(1821);
  const books: ShelfBook[] = NOVELS.map((t, i) => {
    const cl = CLOTHS[(i * 5 + Math.floor(r() * 3)) % CLOTHS.length];
    return {
      title: t, thick: THICK[t] ?? 2 + r(), h: 21 + r() * 4, depth: 14.6 + r() * 1.4, cloth: cl.c, foil: cl.foil,
      variant: (Math.floor(r() * 4) % 4) as ShelfBook['variant'], seed: hash(t),
    };
  });
  const total = books.reduce((s, b) => s + b.thick + GAP, 0);
  const W = Math.ceil(total / 3 + 4);
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
  rowEnds.forEach((idx, rr) => {
    const p = placed[idx];
    const right = p.x + p.b.thick / 2;
    const free = W / 2 - right;
    if (free > 1.2) {
      const a = Math.min(0.3, Math.atan2(free * 0.9, p.b.h));
      const left = p.x - p.b.thick / 2;
      p.x = left + Math.cos(-a) * (p.b.thick / 2) - Math.sin(-a) * (p.b.h / 2);
      p.y = ROW_Y[rr] + Math.sin(-a) * (p.b.thick / 2) + Math.cos(-a) * (p.b.h / 2);
      p.lean = -a;
    }
  });
  return { placed, W, rowEnds };
})();

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
export const Bookcase: React.FC<{ W: number; bare?: boolean }> = ({ W, bare = false }) => {
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
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, bottom - 6, 40]} receiveShadow>
          <planeGeometry args={[600, 300]} />
          <meshStandardMaterial color="#14100C" roughness={0.9} />
        </mesh>
        <mesh position={[0, 10, -10.5]} receiveShadow>
          <planeGeometry args={[800, 400]} />
          <meshStandardMaterial color="#17130F" roughness={1} />
        </mesh>
      </>}
    </group>
  );
};

const DROP0 = 4;
const DROP_STEP = 3.1; // 27 obras en ~1,7 s

// Estanterías vecinas: libros genéricos sin título, en penumbra.
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

const NameScene: React.FC<{ keys: CamKey[]; fGreat: number; fQ: number; fPor: number }> = ({ keys, fGreat, fQ, fPor }) => {
  const frame = useCurrentFrame();
  const { placed, W } = LAYOUT;
  const lamp = (0.55 + 0.45 * ramp01(frame, 0, 14)) * (1 - 0.15 * ramp01(frame, fQ, fPor));
  const great = ramp01(frame, fGreat - 4, fGreat + 20) * (1 - ramp01(frame, fQ - 6, fQ + 14));
  const plates = useMemo(() => {
    const out: { idx: number; year: number }[] = [];
    [1846, 1859, 1866, 1880].forEach((d) => {
      const idx = placed.findIndex((p) => p.year >= d);
      if (idx >= 0) out.push({ idx, year: d });
    });
    return out;
  }, [placed]);
  const plateGeo = useMemo(() => new THREE.PlaneGeometry(4.6, 1.72), []);
  const plateMats = useMemo(() => plates.map((p) => new THREE.MeshStandardMaterial({ map: plateTex(p.year), roughness: 0.35, metalness: 0.75, emissive: new THREE.Color('#FFC46B'), emissiveIntensity: 0.06 })), [plates]);
  const greatIdx = placed.filter((p) => GREAT_FIVE.includes(p.b.title));
  return (
    <>
      <color attach="background" args={['#0B0C0E']} />
      <fog attach="fog" args={['#0B0C0E', 140, 380]} />
      <Rig keys={keys} shake={0.32} />
      <hemisphereLight args={['#4A4F5C', '#1A120C', 0.42 * lamp]} />
      <spotLight position={[-60, 110, 140]} angle={0.5} penumbra={0.85} intensity={5.2 * lamp} decay={0} color="#FFD7A3" castShadow
        shadow-mapSize-width={BENCH.sm || 1536} shadow-mapSize-height={BENCH.sm || 1536} shadow-bias={-0.0004} shadow-normalBias={0.04} />
      <pointLight position={[60, -30, 70]} intensity={(0.8 + 0.8 * ramp01(frame, fQ, fPor)) * lamp} decay={0} distance={240} color={KR} />
      {/* luz sobre las cinco grandes novelas */}
      {greatIdx.map((p) => <pointLight key={p.i} position={[p.x, ROW_Y[p.row] + 12, 16]} intensity={great * 2.4} decay={0} distance={14} color="#FFD58A" />)}
      <Bookcase W={W} />
      <SideCases />
      {placed.map((p) => {
        const a = DROP0 + p.i * DROP_STEP;
        const s = spring({ frame: frame - a, fps: 50, config: { damping: 15, stiffness: 150, mass: 0.85 } });
        if (frame < a) return null;
        const tilt = spring({ frame: frame - a - 4, fps: 50, config: { damping: 9, stiffness: 120 } });
        const z0 = 0.6 + 7.5 - p.b.depth / 2;
        const isGreat = GREAT_FIVE.includes(p.b.title);
        const pull = isGreat ? great * 1.6 : 0;
        const pos: V3 = [p.x, p.y + (1 - s) * 5, z0 + (1 - s) * 13 + pull];
        const rot: V3 = [(1 - s) * -0.35, (1 - s) * 0.25, p.lean + (1 - tilt) * 0.05 * (p.i % 2 ? 1 : -1)];
        return <Book key={p.i} b={p.b} position={pos} rotation={rot} />;
      })}
      {plates.map((pl, k) => {
        const p = placed[pl.idx];
        return <mesh key={pl.year} geometry={plateGeo} material={plateMats[k]} position={[p.x - p.b.thick / 2 + 2.3, ROW_Y[p.row] - 1.2, 11.15]} />;
      })}
    </>
  );
};

// Nombres completos (nombre, patronímico y apellido) de personajes de sus novelas.
const NAMES: { t: string; sub: string; x: number; y: number; d: number; r: number }[] = [
  { t: 'Rodión Románovich Raskólnikov', sub: 'Crimen y castigo', x: 560, y: 270, d: 0.98, r: -3 },
  { t: 'Lev Nikoláievich Myshkin', sub: 'El idiota', x: 1390, y: 250, d: 1.03, r: 2.5 },
  { t: 'Fiódor Pávlovich Karamázov', sub: 'Los hermanos Karamázov', x: 1330, y: 590, d: 0.96, r: -2 },
  { t: 'Nastasia Filíppovna Baráshkova', sub: 'El idiota', x: 600, y: 740, d: 1.04, r: 3 },
];

export const Name3D: React.FC = () => {
  const frame = useCurrentFrame();
  const ready = useFontsReady();
  const c = sceneClock('NAME');
  const fName = c.at('D03', 'Fiódor');
  const fGreat = c.at('D03', 'grandes');
  const fQ = c.part('D04');
  const fLarg = c.at('D04', 'largas');
  const fDens = c.at('D04', 'densas');
  const fNomb = c.at('D04', 'nombres');
  const fPor = c.at('D04', 'por');
  const keys: CamKey[] = [
    { f: 0, pos: [-12, 31, 50], look: [-8, 26, 0], fov: 34 },
    { f: fName + 10, pos: [-6, 18, 62], look: [-2, 16, 0], fov: 33 },
    { f: fGreat + 20, pos: [4, 6, 96], look: [2, 4, 0], fov: 32 },
    { f: fQ, pos: [-6, 3, 112], look: [0, 2, 0], fov: 31 },
    { f: fPor, pos: [0, 4, 136], look: [0, 3, 0], fov: 31 },
    { f: c.dur, pos: [-2, 4, 144], look: [0, 3, 0], fov: 31, ease: (t) => t },
  ];
  const dim = BENCH.bare ? 0 : ramp01(frame, fPor - 14, fPor + 16);
  const nameIn = interpolate(frame, [fName - 4, fName + 14], [0, 1], { ...clamp, easing: easeOut });
  const nameOut = interpolate(frame, [fGreat - 10, fGreat], [0, 1], { ...clamp, easing: easeInOut });
  const greatIn = interpolate(frame, [fGreat, fGreat + 14], [0, 1], { ...clamp, easing: easeOut }) * (1 - interpolate(frame, [fQ - 4, fQ + 8], [0, 1], clamp));
  const words = [{ t: 'Largas', at: fLarg }, { t: 'Densas', at: fDens }];
  return (
    <AbsoluteFill style={{ background: '#0B0C0E' }}>
      <AbsoluteFill style={{ filter: dim > 0.01 ? `blur(${(dim * 7).toFixed(2)}px) brightness(${(1 - dim * 0.42).toFixed(3)})` : undefined, transform: `scale(${1 + dim * 0.03})` }}>
        {ready && !BENCH.noGL && !AUDIO_ONLY && (
          <ThreeCanvas width={1920} height={1080} shadows dpr={BENCH.dpr ?? undefined} gl={{ antialias: BENCH.aa ?? false, powerPreference: 'high-performance' }} camera={{ fov: 34, position: [0, 0, 100] }}>
            <NameScene keys={keys} fGreat={fGreat} fQ={fQ} fPor={fPor} />
          </ThreeCanvas>
        )}
      </AbsoluteFill>
      {BENCH.bare ? null : <>
        <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 46%, rgba(0,0,0,0.62) 100%)', pointerEvents: 'none' }} />
        {!BENCH.noOv && <Grain seed={Math.floor(frame / 2)} opacity={0.1} />}
        {/* el nombre */}
        {nameIn > 0.002 && nameOut < 0.998 && (
          <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: nameIn * (1 - nameOut), transform: `translateY(${(1 - nameIn) * 16}px)`, filter: nameOut > 0.01 ? `blur(${nameOut * 8}px)` : undefined }}>
            <div style={{ position: 'absolute', width: 1500, height: 520, background: 'radial-gradient(ellipse, rgba(6,6,8,0.8) 0%, rgba(6,6,8,0.45) 45%, rgba(6,6,8,0) 72%)' }} />
            <div style={{ position: 'relative', fontFamily: font.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 64, color: 'rgba(243,234,216,0.85)' }}>Fiódor</div>
            <div style={{ position: 'relative', fontFamily: font.sans, fontWeight: 700, fontSize: 190, letterSpacing: -7, lineHeight: 0.95, color: '#fff', textShadow: '0 10px 60px rgba(0,0,0,0.6)' }}>Dostoievski</div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 22, marginTop: 22 }}>
              <div style={{ width: 70 * nameIn, height: 3, background: color.yellow, borderRadius: 2 }} />
              <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 42, letterSpacing: 8, color: color.yellow }}>1821 – 1881</div>
              <div style={{ width: 70 * nameIn, height: 3, background: color.yellow, borderRadius: 2 }} />
            </div>
          </AbsoluteFill>
        )}
        {/* las cinco grandes */}
        {false && greatIn > 0.002 && (
          <div style={{ position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', opacity: greatIn, transform: `translateY(${(1 - greatIn) * -14}px)` }}>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, letterSpacing: 6, textTransform: 'uppercase', color: '#F1D58C', background: 'rgba(8,8,10,0.6)', padding: '12px 30px', borderRadius: 999 }}>Las cinco grandes novelas</span>
          </div>
        )}
        {/* «largas, densas» */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', justifyContent: 'center', gap: 40 }}>
          {words.map((w, k) => {
            const s = spring({ frame: frame - w.at + 2, fps: 50, config: { damping: 13, stiffness: 180 } });
            const o = interpolate(frame, [fNomb - 6, fNomb + 6], [0, 1], clamp);
            if (frame < w.at - 3) return null;
            return <div key={k} style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 96, color: '#fff', background: 'rgba(163,25,47,0.94)', padding: '10px 46px 20px', borderRadius: 20, boxShadow: '0 18px 40px rgba(0,0,0,0.5)', opacity: s * (1 - o), transform: `scale(${0.8 + 0.2 * s}) rotate(${k ? 2 : -2}deg)` }}>{w.t}</div>;
          })}
        </div>
        {/* nombres rusos: fichas de papel */}
        {frame >= fNomb - 2 && frame < fPor + 30 && NAMES.map((q, k) => {
          const a = fNomb + k * 9;
          const s = spring({ frame: frame - a, fps: 50, config: { damping: 13, stiffness: 160 } });
          const o = ramp01(frame, fPor - 10, fPor + 8);
          if (frame < a) return null;
          const drift = (frame - a) * 0.1 * (q.x < 960 ? -1 : 1) * q.d;
          return (
            <div key={k} style={{ position: 'absolute', left: q.x + drift, top: q.y - (frame - a) * 0.05 * q.d + (1 - s) * 40, transform: `translate(-50%, -50%) rotate(${q.r * s + (1 - s) * q.r * 3}deg) scale(${(0.86 + 0.14 * s) * q.d * (1 + 0.12 * o)})`, opacity: Math.min(1, s * 1.6) * (1 - o),
              filter: o > 0.01 ? `blur(${(o * 10).toFixed(2)}px)` : undefined }}>
              <div style={{ position: 'relative', background: '#F4ECDA', color: '#1E1A14', padding: '34px 44px 22px', borderRadius: 4, whiteSpace: 'nowrap', boxShadow: '0 28px 50px rgba(0,0,0,0.55), 0 2px 0 rgba(0,0,0,0.15)',
                backgroundImage: 'linear-gradient(180deg, rgba(163,25,47,0.55) 0px, rgba(163,25,47,0.55) 2px, transparent 2px), repeating-linear-gradient(180deg, transparent 0px, transparent 31px, rgba(70,110,170,0.22) 31px, rgba(70,110,170,0.22) 33px)',
                backgroundPosition: '0 18px, 0 18px', backgroundRepeat: 'no-repeat, repeat' }}>
                <div style={{ position: 'absolute', left: '50%', top: -12, width: 26, height: 26, marginLeft: -13, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #FF7B8B, #A3192F 55%, #5E0F1D)', boxShadow: '0 6px 8px rgba(0,0,0,0.45)' }} />
                <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 46, lineHeight: 1 }}>{q.t}</div>
                <div style={{ marginTop: 12, fontFamily: font.sans, fontWeight: 700, fontSize: 22, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(30,26,20,0.55)' }}>{q.sub}</div>
              </div>
            </div>
          );
        })}
        {/* la pregunta */}
        {frame >= fPor - 6 && (
          <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <MaskTitle text="¿Por dónde empiezo?" at={fPor - 2} size={150} align="center" color="#fff" style={{ textShadow: '0 12px 50px rgba(0,0,0,0.55)' }} />
            <div style={{ marginTop: 34, width: 520 * ramp01(frame, fPor + 10, fPor + 38, easeO), height: 6, borderRadius: 3, background: KR }} />
          </AbsoluteFill>
        )}
        {frame < 10 && <AbsoluteFill style={{ background: '#0B0C0E', opacity: 1 - ramp01(frame, 0, 9) }} />}
        <Sfx name="click" at={3} volume={0.6} />
        {LAYOUT.placed.filter((_, i) => i % 3 === 0).map((p) => <Sfx key={p.i} name="sk_book_slide" at={Math.round(DROP0 + p.i * DROP_STEP) + 2} volume={0.32 + 0.12 * ((p.i / 3) % 3)} />)}
        {LAYOUT.placed.filter((p) => (THICK[p.b.title] ?? 0) > 5).map((p) => <Sfx key={`t${p.i}`} name="sk_book_thud" at={Math.round(DROP0 + p.i * DROP_STEP) + 10} volume={0.32} />)}
        <Sfx name="hit_soft" at={fName} volume={0.7} />
        <Sfx name="shimmer" at={fGreat} volume={0.5} />
        <Sfx name="whoosh_soft" at={fQ} volume={0.5} />
        <Sfx name="stamp" at={fLarg} volume={0.4} />
        <Sfx name="stamp" at={fDens} volume={0.4} />
        {NAMES.map((_, k) => <Sfx key={`q${k}`} name="sk_pin" at={fNomb + 2 + k * 9} volume={0.45} />)}
        <Sfx name="impact" at={fPor} volume={0.5} />
      </>}
    </AbsoluteFill>
  );
};
