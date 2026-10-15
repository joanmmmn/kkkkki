import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useCurrentFrame } from 'remotion';
import { woodTex } from './books3d';
import { Rig } from './Library';
import { CamKey, canvasTex, ramp01, rng, V3 } from './lib3d';

// ————————————————————————————————————————————————————————————————
// HOOK en 3D: la plaza Semiónovski al amanecer del 22 de diciembre de 1849. Nieve, un tablado con tres postes,
// un pelotón con capotes y chacós que levanta los fusiles y la ciudad perdida en la bruma.
// Composición propia (sin personas reconocibles). El lienzo es transparente: el cielo es un degradado CSS detrás.
// ————————————————————————————————————————————————————————————————

export const SQ_POSTS: V3[] = [[-9, 0, -10], [0, 0, -10], [9, 0, -10]];
const SOLDIERS = 8;
const SOLDIER_Z = 26;

const snowTex = () =>
  canvasTex('dk-snow-ground', 1024, 1024, (ctx, w, h) => {
    ctx.fillStyle = '#E9EDF3';
    ctx.fillRect(0, 0, w, h);
    const r = rng(1849);
    for (let i = 0; i < 9000; i++) {
      const g = 225 + Math.floor(r() * 30);
      ctx.fillStyle = `rgba(${g - 8},${g - 4},${g},${0.25 + r() * 0.3})`;
      ctx.fillRect(r() * w, r() * h, 1 + r() * 3, 1 + r() * 2);
    }
    // surcos de pisadas
    ctx.strokeStyle = 'rgba(150,160,180,0.18)';
    for (let k = 0; k < 40; k++) {
      ctx.lineWidth = 2 + r() * 6;
      ctx.beginPath();
      const y = r() * h;
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(w * 0.3, y + (r() - 0.5) * 80, w * 0.6, y + (r() - 0.5) * 80, w, y + (r() - 0.5) * 60);
      ctx.stroke();
    }
  }, { repeat: [6, 4] });

// Ciudad al fondo: siluetas de tejados, cúpulas y la aguja de la fortaleza (con transparencia).
const skylineTex = () =>
  canvasTex('dk-skyline', 2048, 256, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#4A5068';
    const r = rng(7);
    let x = 0;
    ctx.beginPath();
    ctx.moveTo(0, h);
    while (x < w) {
      const bw = 40 + r() * 90, bh = 40 + r() * 70;
      ctx.lineTo(x, h - bh);
      ctx.lineTo(x + bw, h - bh);
      x += bw;
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();
    const dome = (cx: number, base: number, rw: number, rh: number) => {
      ctx.beginPath();
      ctx.moveTo(cx - rw, base);
      ctx.bezierCurveTo(cx - rw * 1.4, base - rh * 0.6, cx - rw * 0.4, base - rh * 0.9, cx, base - rh);
      ctx.bezierCurveTo(cx + rw * 0.4, base - rh * 0.9, cx + rw * 1.4, base - rh * 0.6, cx + rw, base);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(cx - 2, base - rh - 28, 4, 28);
    };
    dome(520, h - 110, 34, 70);
    dome(600, h - 100, 18, 40);
    dome(1340, h - 120, 52, 100);
    dome(1420, h - 104, 20, 44);
    ctx.fillRect(900, h - 230, 8, 140); // aguja
    ctx.beginPath();
    ctx.moveTo(896, h - 90);
    ctx.lineTo(904, h - 250);
    ctx.lineTo(912, h - 90);
    ctx.fill();
    ctx.fillRect(880, h - 120, 48, 120);
  }, { srgb: true });

const flakeTex = () =>
  canvasTex('dk-flake', 64, 64, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.4, 'rgba(255,255,255,0.7)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }, { srgb: true });

// Un soldado: capote, piernas, cabeza, chacó con penacho, correajes blancos y el fusil (gira desde el hombro).
const Soldier: React.FC<{ x: number; aim: number; seed: number }> = ({ x, aim, seed }) => {
  const m = useMemo(() => ({
    coat: new THREE.MeshStandardMaterial({ color: '#1C2320', roughness: 0.92 }),
    dark: new THREE.MeshStandardMaterial({ color: '#15181C', roughness: 0.6 }),
    belt: new THREE.MeshStandardMaterial({ color: '#8E897C', roughness: 0.7 }),
    skin: new THREE.MeshStandardMaterial({ color: '#3A2C25', roughness: 0.8 }),
    wood: new THREE.MeshStandardMaterial({ color: '#4A2E1C', roughness: 0.6 }),
    steel: new THREE.MeshStandardMaterial({ color: '#B8BEC6', roughness: 0.3, metalness: 0.8 }),
    plume: new THREE.MeshStandardMaterial({ color: '#7A1A24', roughness: 0.8 }),
  }), []);
  const r = rng(300 + seed);
  const lean = (r() - 0.5) * 0.05;
  // aim 0: fusil vertical al hombro; 1: apuntando al frente (-z).
  const rx = -Math.PI / 2 + aim * (Math.PI / 2 - 0.04);
  return (
    <group position={[x, 0, SOLDIER_Z + (seed % 2) * 1.2]} rotation={[0, Math.PI + (r() - 0.5) * 0.08, lean]}>
      {/* piernas */}
      {[-0.55, 0.55].map((lx) => <mesh key={lx} position={[lx, 2.6, 0]} material={m.dark} castShadow><boxGeometry args={[0.8, 5.2, 0.9]} /></mesh>)}
      {/* capote */}
      <mesh position={[0, 7.6, 0]} material={m.coat} castShadow><cylinderGeometry args={[1.3, 2.2, 7.2, 14]} /></mesh>
      <mesh position={[0, 10.9, 0]} material={m.coat} castShadow><cylinderGeometry args={[1.05, 1.3, 1.4, 14]} /></mesh>
      {/* correajes cruzados */}
      <mesh position={[0, 8.6, 1.08]} rotation={[0.12, 0, 0.62]} material={m.belt}><boxGeometry args={[0.32, 5.2, 0.1]} /></mesh>
      <mesh position={[0, 8.6, 1.08]} rotation={[0.12, 0, -0.62]} material={m.belt}><boxGeometry args={[0.32, 5.2, 0.1]} /></mesh>
      <mesh position={[0, 7.0, 0]} material={m.belt}><cylinderGeometry args={[1.62, 1.62, 0.36, 14]} /></mesh>
      {/* cabeza y chacó */}
      <mesh position={[0, 12.25, 0]} scale={[0.9, 1.05, 0.95]} material={m.skin} castShadow><sphereGeometry args={[0.72, 14, 10]} /></mesh>
      <mesh position={[0, 13.85, 0]} material={m.dark} castShadow><cylinderGeometry args={[0.98, 0.8, 2.1, 14]} /></mesh>
      <mesh position={[0, 13.25, 0.55]} rotation={[0.5, 0, 0]} material={m.dark}><boxGeometry args={[1.6, 0.12, 0.8]} /></mesh>
      <mesh position={[0, 15.2, 0.2]} material={m.plume}><sphereGeometry args={[0.32, 10, 8]} /></mesh>
      {/* brazo y fusil, desde el hombro derecho */}
      <group position={[0.95, 10.4, 0.2]} rotation={[rx, 0, 0]}>
        <mesh position={[0, 0, 1.6]} rotation={[Math.PI / 2, 0, 0]} material={m.coat} castShadow><cylinderGeometry args={[0.38, 0.42, 3.4, 10]} /></mesh>
        <mesh position={[0.25, 0, 4.4]} material={m.wood} castShadow><boxGeometry args={[0.32, 0.42, 11]} /></mesh>
        <mesh position={[0.25, 0.05, 10.2]} rotation={[Math.PI / 2, 0, 0]} material={m.steel}><coneGeometry args={[0.12, 2.6, 6]} /></mesh>
      </group>
    </group>
  );
};

// Copos de nieve (deterministas): caen con viento y se reciclan en una caja alrededor de la plaza.
const SnowFall: React.FC<{ n?: number; t: number }> = ({ n = 1400, t }) => {
  const base = useMemo(() => {
    const r = rng(1221);
    return Array.from({ length: n }).map(() => [r() * 260 - 150, r() * 70, r() * 200 - 90, 0.6 + r() * 0.8, r() * 6.28] as const);
  }, [n]);
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  const mat = useMemo(() => new THREE.PointsMaterial({ size: 0.95, map: flakeTex(), transparent: true, depthWrite: false, opacity: 0.95, sizeAttenuation: true }), []);
  const pos = new Float32Array(n * 3);
  base.forEach(([x, y, z, v, ph], i) => {
    const yy = ((y - t * 0.11 * v) % 70 + 70) % 70;
    pos[i * 3] = x + Math.sin(t / 40 + ph) * 1.6 + t * 0.03;
    pos[i * 3 + 1] = yy;
    pos[i * 3 + 2] = z + Math.cos(t / 55 + ph) * 1.2;
  });
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  return <points geometry={geo} material={mat} />;
};

export const SquareScene: React.FC<{ keys: CamKey[]; aimAt: (i: number) => number; snowT: number; sun: number; postGlow: number; tension: number; shake: number }> = ({ keys, aimAt, snowT, sun, postGlow, tension, shake }) => {
  const frame = useCurrentFrame();
  const ground = useMemo(() => {
    const g = new THREE.PlaneGeometry(900, 700, 90, 70);
    const p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i);
      p.setZ(i, Math.sin(x / 37) * 0.6 + Math.cos(y / 29) * 0.5 + Math.sin((x + y) / 13) * 0.18);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  const mats = useMemo(() => ({
    snow: new THREE.MeshStandardMaterial({ map: snowTex(), color: '#F2F4F8', roughness: 0.96, metalness: 0 }),
    wood: new THREE.MeshStandardMaterial({ map: woodTex('#3A2618', 'dk-post', true), roughness: 0.8 }),
    plank: new THREE.MeshStandardMaterial({ map: woodTex('#2A1C12', 'dk-plank'), roughness: 0.85 }),
    cap: new THREE.MeshStandardMaterial({ color: '#F4F6FA', roughness: 0.95 }),
    city: new THREE.MeshBasicMaterial({ map: skylineTex(), transparent: true, depthWrite: false, fog: false, opacity: 0.55, color: '#9AA0B8' }),
    drum: new THREE.MeshStandardMaterial({ color: '#7A1A24', roughness: 0.5 }),
    rim: new THREE.MeshStandardMaterial({ color: '#E9E1CF', roughness: 0.6 }),
  }), []);
  void frame;
  return (
    <>
      <fog attach="fog" args={['#C3BCC8', 70, 330]} />
      <Rig keys={keys} shake={shake} />
      {tension > 2 && null}
      <hemisphereLight args={['#A9B4CE', '#EEF1F6', 0.5]} />
      <ambientLight intensity={0.12} />
      {/* sol bajo del amanecer, detrás de la plaza: siluetas recortadas y sombras largas hacia la cámara */}
      <directionalLight position={[-90, 28, 250]} intensity={1.2 + 0.9 * sun} color="#FFC9A2" castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-90} shadow-camera-right={90} shadow-camera-top={70} shadow-camera-bottom={-70}
        shadow-camera-near={10} shadow-camera-far={600} shadow-bias={-0.0006} shadow-normalBias={0.05} />
      <directionalLight position={[120, 60, 140]} intensity={0.35} color="#B8C6E6" />
      {/* luz cálida sobre el poste central cuando se nombra al escritor */}
      <pointLight position={[0, 24, 4]} intensity={postGlow * 2.2} distance={40} decay={0} color="#FFD9A0" />
      {/* suelo nevado */}
      <mesh geometry={ground} material={mats.snow} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -40]} receiveShadow />
      {/* ciudad en la bruma */}
      <mesh position={[-430, 20, 0]} rotation={[0, Math.PI / 2, 0]} material={mats.city}><planeGeometry args={[980, 72]} /></mesh>
      {/* tablado */}
      <mesh position={[0, 1.6, -9]} material={mats.plank} castShadow receiveShadow><boxGeometry args={[34, 3.2, 10]} /></mesh>
      <mesh position={[0, 3.25, -9]} material={mats.cap} receiveShadow><boxGeometry args={[34.4, 0.25, 10.4]} /></mesh>
      {[-17, 17].map((x) => <mesh key={x} position={[x, 1.6, -3.9]} material={mats.plank} castShadow><boxGeometry args={[0.6, 3.2, 0.6]} /></mesh>)}
      {/* postes */}
      {SQ_POSTS.map((p, i) => (
        <group key={i} position={[p[0], 3.2, p[2]]}>
          <mesh position={[0, 8, 0]} material={mats.wood} castShadow receiveShadow><boxGeometry args={[1.3, 16, 1.3]} /></mesh>
          <mesh position={[0, 16.15, 0]} material={mats.cap}><boxGeometry args={[1.5, 0.35, 1.5]} /></mesh>
        </group>
      ))}
      {/* pelotón */}
      {Array.from({ length: SOLDIERS }).map((_, i) => <Soldier key={i} x={-17.5 + i * 5} aim={aimAt(i)} seed={i} />)}
      {/* tambor a un lado */}
      <group position={[-26, 0, 30]}>
        <mesh position={[0, 2.2, 0]} material={mats.drum} castShadow><cylinderGeometry args={[1.6, 1.6, 2.6, 24]} /></mesh>
        <mesh position={[0, 3.55, 0]} material={mats.rim}><cylinderGeometry args={[1.66, 1.66, 0.2, 24]} /></mesh>
      </group>
      <SnowFall t={snowT} />
    </>
  );
};
