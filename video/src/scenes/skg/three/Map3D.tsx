import React, { useMemo } from 'react';
import * as THREE from 'three';
import { ThreeCanvas } from '@remotion/three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { Sfx } from '../../../components/Sfx';
import { clamp, easeInOut } from '../../../lib/anim';
import { BOOKS, BookDef, color, font, Grain, KR } from '../kit';
import { coverTexture } from '../covers';
import { sceneClock } from '../timeline';
import { clothTex, pagesTex } from './books3d';
import { DeskBackdrop, Desk } from './Desk';
import { Rig } from './Library';
import { canvasTex, CamKey, easeO, projectAt, ramp01, rng, SANS, SERIF, useFontsReady, V3, AUDIO_ONLY } from './lib3d';

// ————————————————————————————————————————————————————————————————
// MAPA en 3D: tres libros sobre la mesa; el equivocado (It) se adelanta y cae. Llega un mapa doblado,
// se despliega y la ruta del vídeo se dibuja con tinta roja entre cuatro chinchetas.
// ————————————————————————————————————————————————————————————————

// Libro de pie mirando a cámara (cubierta en +z, lomo a la izquierda).
const StandingBook: React.FC<{ k: string; w: number; t: number; position: V3; rotation: V3; dim?: number }> = ({ k, w, t, position, rotation, dim = 1 }) => {
  const b: BookDef = BOOKS[k];
  const h = w * 1.5;
  const geo = useMemo(() => new RoundedBoxGeometry(w, h, t, 2, 0.3), [w, h, t]);
  const mats = useMemo(() => {
    const side = new THREE.MeshStandardMaterial({ map: clothTex(b.bg, 5), roughness: 0.85 });
    const pages = new THREE.MeshStandardMaterial({ map: pagesTex(b.bg, 'fore'), roughness: 0.95 });
    const head = new THREE.MeshStandardMaterial({ map: pagesTex(b.bg, 'head'), roughness: 0.95 });
    const cover = new THREE.MeshStandardMaterial({ map: coverTexture(b, k), roughness: 0.6 });
    // +x páginas, −x lomo, +y/−y cantos, +z cubierta, −z contracubierta
    return [pages, side, head, head, cover, side];
  }, [b, k]);
  mats.forEach((m) => (m as THREE.MeshStandardMaterial).color.setScalar(dim));
  return <mesh geometry={geo} material={mats} position={position} rotation={rotation} castShadow receiveShadow />;
};

// ——— Papel del mapa ———
const MW = 120, MD = 72, P = MW / 3, TH = 0.28;
const PINS: [number, number][] = [[0.13, 0.64], [0.39, 0.34], [0.63, 0.68], [0.88, 0.36]];
const toWorld = ([u, v]: [number, number]): V3 => [-MW / 2 + u * MW, 0, -MD / 2 + v * MD];
// Ruta: los cuatro puntos con curvas intermedias.
const ROUTE = (() => {
  const pts: THREE.Vector3[] = [];
  const mids: [number, number][] = [[0.24, 0.36], [0.52, 0.6], [0.74, 0.5]];
  PINS.forEach((p, i) => {
    pts.push(new THREE.Vector3(...toWorld(p)));
    if (i < 3) pts.push(new THREE.Vector3(...toWorld(mids[i])));
  });
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
  // fracción de longitud de cada chincheta (t = 0, 2/6, 4/6, 1)
  const N = 600;
  const acc: number[] = [0];
  let prev = curve.getPoint(0);
  for (let i = 1; i <= N; i++) {
    const q = curve.getPoint(i / N);
    acc.push(acc[i - 1] + q.distanceTo(prev));
    prev = q;
  }
  const L = acc[N];
  const frac = [0, 2, 4, 6].map((k) => acc[Math.round((k / 6) * N)] / L);
  return { curve, frac };
})();

const mapCanvas = () => {
  const key = 'map-full';
  const W = 2400, H = 1440;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d')!;
  const r = rng(2026);
  ctx.fillStyle = '#F1E6CC';
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 26000; i++) {
    ctx.fillStyle = r() < 0.5 ? 'rgba(120,90,40,0.05)' : 'rgba(255,255,255,0.08)';
    ctx.fillRect(r() * W, r() * H, 2 + r() * 3, 1 + r() * 2);
  }
  for (let i = 0; i < 9; i++) {
    const x = r() * W, y = r() * H, rr = 80 + r() * 260;
    const g = ctx.createRadialGradient(x, y, rr * 0.2, x, y, rr);
    g.addColorStop(0, 'rgba(160,110,40,0.08)');
    g.addColorStop(0.8, 'rgba(160,110,40,0.04)');
    g.addColorStop(1, 'rgba(160,110,40,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - rr, y - rr, rr * 2, rr * 2);
  }
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, W * 0.62);
  v.addColorStop(0, 'rgba(0,0,0,0)');
  v.addColorStop(1, 'rgba(110,70,20,0.28)');
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);
  // retícula de meridianos y paralelos
  ctx.strokeStyle = 'rgba(90,60,20,0.12)';
  ctx.lineWidth = 2;
  for (let x = 120; x < W; x += 160) {
    ctx.beginPath();
    ctx.moveTo(x, 60);
    ctx.lineTo(x, H - 60);
    ctx.stroke();
  }
  for (let y = 120; y < H; y += 160) {
    ctx.beginPath();
    ctx.moveTo(60, y);
    ctx.lineTo(W - 60, y);
    ctx.stroke();
  }
  // marco
  ctx.strokeStyle = 'rgba(70,45,15,0.75)';
  ctx.lineWidth = 6;
  ctx.strokeRect(46, 46, W - 92, H - 92);
  ctx.lineWidth = 2;
  ctx.strokeRect(64, 64, W - 128, H - 128);
  // montes y bosques dibujados a plumilla
  ctx.strokeStyle = 'rgba(80,55,20,0.45)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 26; i++) {
    const x = 160 + r() * (W - 320), y = 340 + r() * (H - 500);
    const near = ROUTE.frac && PINS.some(([u, vv]) => Math.hypot(u * W - x, vv * H - y) < 200);
    if (near) continue;
    if (r() < 0.55) {
      const s = 30 + r() * 26;
      ctx.beginPath();
      ctx.moveTo(x - s, y);
      ctx.lineTo(x, y - s * 1.1);
      ctx.lineTo(x + s, y);
      ctx.moveTo(x - s * 0.35, y - s * 0.7);
      ctx.lineTo(x - s * 0.1, y - s * 0.45);
      ctx.stroke();
    } else {
      // bosquecillo de abetos
      for (let k = 0; k < 3; k++) {
        const tx = x + k * 24, ty = y + (k % 2) * 10;
        ctx.beginPath();
        ctx.moveTo(tx, ty - 40);
        ctx.lineTo(tx - 13, ty - 14);
        ctx.lineTo(tx - 6, ty - 14);
        ctx.lineTo(tx - 16, ty + 4);
        ctx.lineTo(tx + 16, ty + 4);
        ctx.lineTo(tx + 6, ty - 14);
        ctx.lineTo(tx + 13, ty - 14);
        ctx.closePath();
        ctx.moveTo(tx, ty + 4);
        ctx.lineTo(tx, ty + 14);
        ctx.stroke();
      }
    }
  }
  // ruta prevista (punteada)
  ctx.strokeStyle = 'rgba(70,45,15,0.4)';
  ctx.lineWidth = 6;
  ctx.setLineDash([4, 22]);
  ctx.lineCap = 'round';
  ctx.beginPath();
  for (let i = 0; i <= 300; i++) {
    const q = ROUTE.curve.getPoint(i / 300);
    const x = ((q.x + MW / 2) / MW) * W, y = ((q.z + MD / 2) / MD) * H;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.setLineDash([]);
  // rosa de los vientos
  const cx = W - 250, cy = H - 250;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = 'rgba(70,45,15,0.7)';
  ctx.fillStyle = 'rgba(70,45,15,0.7)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 120, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 96, 0, Math.PI * 2);
  ctx.stroke();
  for (let k = 0; k < 8; k++) {
    const a = (k * Math.PI) / 4, l = k % 2 ? 80 : 150;
    ctx.save();
    ctx.rotate(a);
    ctx.beginPath();
    ctx.moveTo(0, -l);
    ctx.lineTo(14, 0);
    ctx.lineTo(0, 14);
    ctx.lineTo(-14, 0);
    ctx.closePath();
    ctx.fillStyle = k === 0 ? 'rgba(193,18,31,0.85)' : k % 2 ? 'rgba(70,45,15,0.4)' : 'rgba(70,45,15,0.75)';
    ctx.fill();
    ctx.restore();
  }
  ctx.font = `700 40px ${SANS}`;
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(70,45,15,0.85)';
  ctx.fillText('N', 0, -168);
  ctx.restore();
  // título
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 54px ${SANS}`;
  (ctx as unknown as { letterSpacing: string }).letterSpacing = '18px';
  ctx.fillStyle = 'rgba(60,38,12,0.85)';
  ctx.fillText('EL MAPA DE ESTE VÍDEO', W / 2, 150);
  (ctx as unknown as { letterSpacing: string }).letterSpacing = '0px';
  ctx.font = `italic 400 44px ${SERIF}`;
  ctx.fillStyle = 'rgba(60,38,12,0.7)';
  ctx.fillText('Stephen King · por dónde y cómo empezar a leer', W / 2, 214);
  // marcas de pliegue
  ctx.strokeStyle = 'rgba(90,60,20,0.18)';
  ctx.lineWidth = 3;
  for (const x of [W / 3, (2 * W) / 3]) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  void key;
  return c;
};

let MAP_C: HTMLCanvasElement | null = null;
const panelTex = (i: number) =>
  canvasTex(`map-panel-${i}`, 800, 1440, (ctx) => {
    if (!MAP_C) MAP_C = mapCanvas();
    ctx.drawImage(MAP_C, i * 800, 0, 800, 1440, 0, 0, 800, 1440);
  });
const backTex = (label: boolean) =>
  canvasTex(`map-back-${label}`, 800, 1440, (ctx, w, h) => {
    const r = rng(7);
    ctx.fillStyle = '#E6D8B8';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 9000; i++) {
      ctx.fillStyle = r() < 0.5 ? 'rgba(120,90,40,0.05)' : 'rgba(255,255,255,0.07)';
      ctx.fillRect(r() * w, r() * h, 2 + r() * 3, 1 + r() * 2);
    }
    if (label) {
      ctx.translate(w / 2, h / 2);
      ctx.rotate(Math.PI);
      ctx.translate(-w / 2, -h / 2);
      ctx.strokeStyle = 'rgba(70,45,15,0.7)';
      ctx.lineWidth = 5;
      ctx.strokeRect(120, 520, w - 240, 400);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(60,38,12,0.85)';
      ctx.font = `700 96px ${SANS}`;
      (ctx as unknown as { letterSpacing: string }).letterSpacing = '22px';
      ctx.fillText('MAPA', w / 2 + 11, 680);
      (ctx as unknown as { letterSpacing: string }).letterSpacing = '0px';
      ctx.font = `italic 400 52px ${SERIF}`;
      ctx.fillText('Stephen King', w / 2, 790);
    }
  });

const MapPanel: React.FC<{ i: number; top?: boolean }> = ({ i, top = false }) => {
  const geo = useMemo(() => new THREE.BoxGeometry(P, TH, MD), []);
  const mats = useMemo(() => {
    const edge = new THREE.MeshStandardMaterial({ color: '#D9C9A6', roughness: 0.9 });
    const front = new THREE.MeshStandardMaterial({ map: panelTex(i), roughness: 0.88 });
    const back = new THREE.MeshStandardMaterial({ map: backTex(top), roughness: 0.9 });
    return [edge, edge, front, back, edge, edge];
  }, [i, top]);
  return <mesh geometry={geo} material={mats} castShadow receiveShadow />;
};

const Pin: React.FC<{ at: number; p: V3; c?: string }> = ({ at, p, c = KR }) => {
  const frame = useCurrentFrame();
  const s = spring({ frame: frame - at, fps: 50, config: { damping: 11, stiffness: 190, mass: 0.7 } });
  const head = useMemo(() => new THREE.MeshStandardMaterial({ color: c, roughness: 0.25, metalness: 0.05 }), [c]);
  const steel = useMemo(() => new THREE.MeshStandardMaterial({ color: '#C9CDD3', roughness: 0.3, metalness: 0.8 }), []);
  if (frame < at - 1) return null;
  const y = (1 - s) * 26;
  return (
    <group position={[p[0], p[1] + y + 0.1, p[2]]} rotation={[0.12, 0, -0.1]}>
      <mesh material={steel} position={[0, 2.4, 0]} castShadow><cylinderGeometry args={[0.13, 0.05, 4.8, 8]} /></mesh>
      <mesh material={head} position={[0, 5.2, 0]} castShadow><sphereGeometry args={[1.55, 24, 18]} /></mesh>
      <mesh material={head} position={[0, 4.2, 0]} castShadow><cylinderGeometry args={[0.9, 1.25, 0.9, 20]} /></mesh>
    </group>
  );
};

const MAP_Z = 32;

// It se tambalea, cae hacia atrás con gravedad (aterriza en «ti») y rebota una vez.
const itFall = (frame: number, f: Record<string, number>) => {
  const w0 = f.king - 6, f0 = f.no, f1 = f.ti;
  const wob = frame >= w0 && frame < f0 ? Math.sin((frame - w0) * 0.55) * 0.05 * ramp01(frame, w0, w0 + 10) : 0;
  const t = Math.max(0, Math.min(1, (frame - f0) / Math.max(1, f1 - f0)));
  const fall = t * t;
  const since = frame - f1;
  const bounce = since >= 0 ? Math.abs(Math.sin(Math.min(1, since / 12) * Math.PI)) * 0.09 * Math.exp(-since / 14) : 0;
  return { fall, bounce, wobble: wob };
};

const MapScene: React.FC<{ f: Record<string, number>; stops: number[]; keys: CamKey[]; drawT: number }> = ({ f, stops, keys, drawT }) => {
  const frame = useCurrentFrame();
  const wrong = ramp01(frame, f.equiv - 4, f.equiv + 14, easeO);
  const { fall, bounce, wobble } = itFall(frame, f);
  // El mapa llega deslizándose por la mesa desde la izquierda, doblado, y se despliega
  const slide = ramp01(frame, f.asi + 28, f.mapa - 6, (t) => 1 - Math.pow(1 - t, 3));
  const hop = Math.sin(Math.PI * Math.min(1, slide * 1.25)) * 2.2;
  const openR = ramp01(frame, f.mapa - 8, f.mapa + 16, easeO);
  const openL = ramp01(frame, f.mapa + 2, f.mapa + 26, easeO);
  const tubeGeo = useMemo(() => new THREE.TubeGeometry(ROUTE.curve, 400, 0.55, 10, false), []);
  const ink = useMemo(() => new THREE.MeshStandardMaterial({ color: KR, roughness: 0.35, emissive: '#5A0008', emissiveIntensity: 0.25 }), []);
  const total = 400 * 10 * 6;
  tubeGeo.setDrawRange(0, Math.floor(Math.max(0, Math.min(1, drawT)) * 400) * 10 * 6);
  const showBooks = frame < f.mapa + 60;
  return (
    <>
      <Rig keys={keys} shake={0.3} jolt={f.ti} />
      <hemisphereLight args={['#5A5F6E', '#1A120C', 0.6]} />
      <spotLight position={[-80, 160, 140]} angle={0.62} penumbra={0.85} intensity={4.4} decay={0} color="#FFD7A3" castShadow
        shadow-mapSize-width={1536} shadow-mapSize-height={1536} shadow-bias={-0.0004} shadow-normalBias={0.04} />
      <pointLight position={[0, 30, -40]} intensity={wrong * 3.2 * (1 - 0.7 * fall)} decay={0} distance={80} color={KR} />
      <pointLight position={[110, 40, 60]} intensity={0.8} decay={0} distance={300} color={KR} />
      <Desk z={-30} d={210} />
      {showBooks && (
        <group position={[0, 0, -22]}>
          <StandingBook k="carrie" w={14} t={2.6} position={[-30, 10.5, 0]} rotation={[0, 0.22, 0]} dim={1 - 0.45 * wrong} />
          <StandingBook k="misery" w={14.5} t={3.6} position={[30, 10.9, 0]} rotation={[0, -0.22, 0]} dim={1 - 0.45 * wrong} />
          {/* It: se adelanta, crece un poco y cae hacia atrás */}
          <group position={[0, 0, 7 * wrong - 3.2]} rotation={[-(Math.PI / 2) * fall + bounce + wobble, 0, 0]}>
            <StandingBook k="it" w={17} t={6.4} position={[0, 12.75, 3.2]} rotation={[0, 0, 0]} />
          </group>
        </group>
      )}
      {/* El mapa */}
      {frame >= f.asi + 26 && (
        <group position={[-170 * (1 - slide), 0.14 + hop, MAP_Z + 6 * (1 - slide)]} rotation={[0, -0.55 * (1 - slide), 0]}>
          <MapPanel i={1} />
          <group position={[-P / 2, TH * (1 - openL) * 1.1, 0]} rotation={[0, 0, -Math.PI * (1 - openL)]}>
            <group position={[-P / 2, 0, 0]}><MapPanel i={0} /></group>
          </group>
          <group position={[P / 2, TH * (1 - openR) * 2.2, 0]} rotation={[0, 0, Math.PI * (1 - openR)]}>
            <group position={[P / 2, 0, 0]}><MapPanel i={2} top /></group>
          </group>
          {openL > 0.98 && <mesh geometry={tubeGeo} material={ink} position={[0, TH / 2 + 0.15, 0]} scale={[1, 0.25, 1]} castShadow />}
          {PINS.map((p, i) => <Pin key={i} at={stops[i] - 2} p={[toWorld(p)[0], TH / 2, toWorld(p)[2]]} c={i === 3 ? '#FFCA05' : KR} />)}
        </group>
      )}
      {total > 0 && null}
    </>
  );
};

const LABELS = ['Qué escribe', 'Cinco puertas de entrada', 'Mejor para después', 'En qué orden seguir'];

export const Mapa3D: React.FC = () => {
  const frame = useCurrentFrame();
  const ready = useFontsReady();
  const c = sceneClock('MAPA');
  const f = {
    libro: c.at('G04', 'libro'), equiv: c.at('G04', 'equivocado'), king: c.at('G04', 'King'), no: c.at('G04', 'no'), ti: c.at('G04', 'ti'),
    asi: c.at('G04', 'Así'), mapa: c.at('G04', 'mapa'),
  };
  const stops = [c.at('G04', 'qué', 2), c.at('G04', 'cinco'), c.at('G04', 'dejar'), c.at('G04', 'orden')];
  const keys: CamKey[] = [
    { f: 0, pos: [0, 19, 72], look: [0, 12, -22], fov: 30 },
    { f: f.equiv + 26, pos: [3, 17, 56], look: [1, 12, -18], fov: 30 },
    { f: f.ti, pos: [0, 22, 60], look: [0, 9, -16], fov: 30 },
    { f: f.asi + 8, pos: [0, 24, 64], look: [0, 8, -14], fov: 30 },
    { f: f.mapa - 4, pos: [0, 112, 112], look: [0, 0, MAP_Z - 4], fov: 30 },
    { f: f.mapa + 34, pos: [0, 118, 108], look: [0, 0, MAP_Z - 2], fov: 30 },
    { f: stops[1], pos: [-3, 120, 110], look: [-3, 0, MAP_Z - 1], fov: 30 },
    { f: stops[3] + 10, pos: [2, 119, 109], look: [2, 0, MAP_Z - 1], fov: 30 },
    { f: c.dur, pos: [1, 116, 105], look: [1, 0, MAP_Z - 1], fov: 30, ease: (t) => t },
  ];
  const fr = ROUTE.frac;
  const seg3 = c.at('G04', 'los');
  const drawT = interpolate(frame, [stops[0] - 6, stops[0], stops[1] - 26, stops[1], seg3 - 4, stops[2], stops[3] - 28, stops[3]], [0, fr[0], fr[0], fr[1], fr[1], fr[2], fr[2], fr[3]], { ...clamp, easing: easeInOut });
  const wrong = ramp01(frame, f.equiv - 2, f.equiv + 12, easeO);
  const fall = itFall(frame, f).fall;
  const tagOut = ramp01(frame, f.king - 10, f.no);
  const itTop = projectAt(frame, keys, 0.3, [0, 30, -22 + 7 * wrong]);
  const quote = ramp01(frame, f.ti - 4, f.ti + 12) * (1 - ramp01(frame, f.asi + 20, f.asi + 34));
  const land = projectAt(frame, keys, 0.3, [0, 1, -22 + 7 * wrong - 16]);
  const dust = frame >= f.ti - 1 ? ramp01(frame, f.ti - 1, f.ti + 30) : 0;
  const mapLift = 0.14 + 0.3;
  return (
    <AbsoluteFill style={{ background: '#0B0C0E' }}>
      <DeskBackdrop x={interpolate(frame, [0, c.dur], [-20, 20])} s={1.12} dim={0.4 + 0.3 * ramp01(frame, f.asi, f.mapa)} />
      {ready && !AUDIO_ONLY && (
        <ThreeCanvas width={1920} height={1080} shadows gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }} camera={{ fov: 30, position: [0, 20, 100] }}>
          <MapScene f={f} stops={stops} keys={keys} drawT={drawT} />
        </ThreeCanvas>
      )}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.58) 100%)', pointerEvents: 'none' }} />
      <Grain seed={Math.floor(frame / 2)} opacity={0.08} />
      {/* El libro equivocado */}
      {wrong > 0.01 && frame < f.asi + 10 && (
        <div style={{ position: 'absolute', left: itTop.x, top: Math.max(110, itTop.y - 60), transform: `translate(-50%, -50%) scale(${0.8 + 0.2 * wrong})`, opacity: wrong * (1 - tagOut) }}>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, color: '#fff', background: KR, padding: '12px 28px', borderRadius: 999, boxShadow: '0 20px 40px rgba(193,18,31,0.4)', whiteSpace: 'nowrap' }}>El libro equivocado</div>
        </div>
      )}
      {/* polvo al caer */}
      {dust > 0 && dust < 1 && Array.from({ length: 9 }).map((_, k) => {
        const a = (k / 9) * Math.PI * 2 + 0.3;
        const r = 40 + 260 * Math.pow(dust, 0.6);
        return <div key={k} style={{ position: 'absolute', left: land.x + Math.cos(a) * r * 1.6 - 70, top: land.y + Math.sin(a) * r * 0.35 - 40, width: 140, height: 80, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(235,220,200,0.35) 0%, rgba(235,220,200,0) 70%)', opacity: (1 - dust) * 0.9, transform: `scale(${0.6 + dust})` }} />;
      })}
      {quote > 0.01 && (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 110, textAlign: 'center', opacity: quote, transform: `translateY(${(1 - quote) * 16}px)` }}>
          <span style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 76, color: '#fff', textShadow: '0 8px 40px rgba(0,0,0,0.8)' }}>«King no es para mí»</span>
        </div>
      )}
      {/* Etiquetas de las paradas, pegadas a sus chinchetas */}
      {stops.map((at, i) => {
        const p = toWorld(PINS[i]);
        const s = spring({ frame: frame - at - 4, fps: 50, config: { damping: 14, stiffness: 180 } });
        if (frame < at) return null;
        const sc = projectAt(frame, keys, 0.3, [p[0], mapLift + 7, p[2] + MAP_Z]);
        const below = i % 2 === 0;
        return (
          <div key={i} style={{ position: 'absolute', left: Math.max(300, Math.min(1620, sc.x)), top: sc.y + (below ? 150 : -10), transform: `translate(-50%, ${below ? '0%' : '-100%'}) translateY(${(1 - s) * (below ? 16 : -16)}px)`, opacity: s }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.96)', padding: '10px 24px 10px 10px', borderRadius: 999, boxShadow: '0 16px 40px rgba(0,0,0,0.35)', whiteSpace: 'nowrap' }}>
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: color.ink, color: color.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans, fontWeight: 700, fontSize: 30 }}>{i + 1}</div>
              <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40, letterSpacing: -0.5, color: color.ink }}>{LABELS[i]}</span>
            </div>
          </div>
        );
      })}
      {/* Sonido */}
      <Sfx name="sk_book_slide" at={4} volume={0.4} />
      <Sfx name="whoosh_soft" at={f.equiv - 6} volume={0.5} />
      <Sfx name="sk_heart" at={f.equiv + 4} volume={0.45} />
      <Sfx name="sk_book_slide" at={f.no - 4} volume={0.35} />
      <Sfx name="sk_book_thud" at={f.ti - 1} volume={0.95} />
      <Sfx name="impact" at={f.ti - 1} volume={0.35} />
      <Sfx name="whoosh_soft" at={f.asi + 24} volume={0.5} />
      <Sfx name="sk_book_slide" at={f.asi + 30} volume={0.55} />
      <Sfx name="page_turn" at={f.mapa - 6} volume={0.8} />
      <Sfx name="page_turn" at={f.mapa + 6} volume={0.6} />
      {stops.map((s, i) => <Sfx key={i} name="sk_pin" at={s + 6} volume={0.7} />)}
      {stops.map((s, i) => <Sfx key={`u${i}`} name="ui_pop" at={s + 5} volume={0.45} />)}
      <Sfx name="draw" at={stops[0] - 6} volume={0.35} dur={20} fade={8} />
      {stops.slice(1).map((s, i) => <Sfx key={`d${i}`} name="draw" at={s - 26} volume={0.35} dur={26} fade={8} />)}
    </AbsoluteFill>
  );
};
