import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { useCurrentFrame } from 'remotion';
import { Book, ShelfBook, woodTex } from './books3d';
import { Rig } from './Library';
import { canvasTex, CamKey, hash, HAND, ramp01, rng, SERIF, V3 } from './lib3d';

// ————————————————————————————————————————————————————————————————
// HOOK en 3D: un cuarto de Copenhague en agosto de 1841, al anochecer. Paredes grises con zócalo de cuarterones
// (como en los interiores daneses del XIX), una ventana alta con la luz fría del norte, un escritorio con una vela,
// el tintero, la carta y el anillo de compromiso. Después, la carta se cierra con lacre y el escritorio se llena
// de manuscritos y libros: el resto de su vida escribiendo sobre aquello.
// Composición propia, sin personas.
// ————————————————————————————————————————————————————————————————

export const RING_POS: V3 = [10.5, 0.35, 7.5];
export const LETTER_POS: V3 = [4, 0.06, 3];

const wallTex = () =>
  canvasTex('kk-wall', 1024, 1024, (ctx, w, h) => {
    // pared gris verdosa, pintura a la cal con veladuras; zócalo de cuarterones abajo
    ctx.fillStyle = '#A7ACA6';
    ctx.fillRect(0, 0, w, h);
    const r = rng(1841);
    for (let i = 0; i < 2600; i++) {
      ctx.fillStyle = r() < 0.5 ? `rgba(255,255,255,${0.015 + r() * 0.03})` : `rgba(0,0,0,${0.015 + r() * 0.035})`;
      const s = 6 + r() * 40;
      ctx.beginPath();
      ctx.ellipse(r() * w, r() * h, s, s * (0.4 + r()), r() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    const dado = h * 0.66;
    ctx.fillStyle = '#959A94';
    ctx.fillRect(0, dado, w, h - dado);
    // moldura
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.fillRect(0, dado - 6, w, 5);
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(0, dado, w, 3);
    // cuarterones
    const pw = w / 4;
    for (let k = 0; k < 4; k++) {
      const x = k * pw + 22, y = dado + 30, ww = pw - 44, hh = h - dado - 70;
      ctx.strokeStyle = 'rgba(0,0,0,0.22)';
      ctx.lineWidth = 4;
      ctx.strokeRect(x + 2, y + 2, ww, hh);
      ctx.strokeStyle = 'rgba(255,255,255,0.18)';
      ctx.strokeRect(x, y, ww, hh);
    }
    // rodapié
    ctx.fillStyle = '#6E716B';
    ctx.fillRect(0, h - 26, w, 26);
  }, { repeat: [3, 1] });

const floorTex = () =>
  canvasTex('kk-floor', 1024, 1024, (ctx, w, h) => {
    ctx.fillStyle = '#6A5640';
    ctx.fillRect(0, 0, w, h);
    const r = rng(9);
    const board = w / 8;
    for (let k = 0; k < 8; k++) {
      ctx.fillStyle = `rgba(${r() < 0.5 ? '255,235,200' : '0,0,0'},${0.03 + r() * 0.06})`;
      ctx.fillRect(k * board, 0, board, h);
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillRect(k * board, 0, 3, h);
      for (let i = 0; i < 40; i++) {
        ctx.strokeStyle = `rgba(0,0,0,${0.05 + r() * 0.08})`;
        ctx.lineWidth = 1 + r() * 2;
        const x = k * board + r() * board;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.bezierCurveTo(x + (r() - 0.5) * 20, h * 0.3, x + (r() - 0.5) * 20, h * 0.7, x + (r() - 0.5) * 10, h);
        ctx.stroke();
      }
    }
  }, { repeat: [2, 2] });

// Cielo de la ventana: anochecer de verano en el norte (azul que baja a un rosa pálido), con la silueta de los tejados.
const skyTex = () =>
  canvasTex('kk-sky', 512, 1024, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#5C7391');
    g.addColorStop(0.55, '#A9B9CB');
    g.addColorStop(0.8, '#E3D3C6');
    g.addColorStop(1, '#F1E2CF');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    // tejados y una aguja de cobre al fondo
    ctx.fillStyle = 'rgba(70,82,96,0.85)';
    ctx.beginPath();
    ctx.moveTo(0, h);
    const r = rng(1813);
    let x = 0;
    while (x < w) {
      const bw = 40 + r() * 70, bh = 60 + r() * 90;
      ctx.lineTo(x, h - bh);
      ctx.lineTo(x + bw * 0.5, h - bh - 30 * r());
      ctx.lineTo(x + bw, h - bh);
      x += bw;
    }
    ctx.lineTo(w, h);
    ctx.fill();
    ctx.fillStyle = 'rgba(58,92,84,0.9)';
    ctx.beginPath();
    ctx.moveTo(w * 0.66, h - 150);
    ctx.lineTo(w * 0.69, h - 420);
    ctx.lineTo(w * 0.72, h - 150);
    ctx.fill();
  });

// Carta: papel verjurado con la letra del joven (líneas en caligrafía inglesa).
export const LETTER_LINES = ['Olvida a quien escribe esto;', 'perdona a un hombre que,', 'aunque sea capaz de algo,', 'no es capaz de hacer', 'feliz a una muchacha.'];
const letterTex = () =>
  canvasTex('kk-letter', 1024, 1448, (ctx, w, h) => {
    ctx.fillStyle = '#F1E8D4';
    ctx.fillRect(0, 0, w, h);
    const r = rng(811);
    for (let y = 0; y < h; y += 9) {
      ctx.fillStyle = `rgba(160,130,90,${0.04 + r() * 0.03})`;
      ctx.fillRect(0, y, w, 1);
    }
    const v = ctx.createRadialGradient(w / 2, h / 2, w * 0.2, w / 2, h / 2, w * 0.85);
    v.addColorStop(0, 'rgba(255,255,255,0)');
    v.addColorStop(1, 'rgba(140,105,60,0.32)');
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#2A2018';
    ctx.font = `400 66px ${HAND}`;
    ctx.fillText('Copenhague, agosto de 1841', 300, 190);
    ctx.font = `400 80px ${HAND}`;
    LETTER_LINES.forEach((l, i) => ctx.fillText(l, 90, 380 + i * 126));
    ctx.font = `400 74px ${HAND}`;
    ctx.fillText('S.', 700, 1110);
  });

const envelopeTex = () =>
  canvasTex('kk-envelope', 1024, 560, (ctx, w, h) => {
    ctx.fillStyle = '#E9DFC8';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(120,95,60,0.35)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w / 2, h * 0.62);
    ctx.lineTo(w, 0);
    ctx.moveTo(0, h);
    ctx.lineTo(w * 0.42, h * 0.5);
    ctx.moveTo(w, h);
    ctx.lineTo(w * 0.58, h * 0.5);
    ctx.stroke();
    ctx.fillStyle = '#2A2018';
    ctx.font = `400 64px ${HAND}`;
    ctx.fillText('Srta. R. Olsen', w * 0.3, h * 0.85);
  });

// Sello de lacre: relieve con las iniciales.
const sealTex = () =>
  canvasTex('kk-seal', 256, 256, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w * 0.42, h * 0.38, 10, w / 2, h / 2, w / 2);
    g.addColorStop(0, '#D04450');
    g.addColorStop(0.6, '#9E1B22');
    g.addColorStop(1, '#5A0D12');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255,210,200,0.45)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w * 0.33, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(60,5,8,0.55)';
    ctx.font = `400 104px ${SERIF}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SK', w / 2 + 2, h / 2 + 4);
    ctx.fillStyle = 'rgba(255,200,190,0.35)';
    ctx.fillText('SK', w / 2 - 1, h / 2 + 1);
  });

const paperStackTex = () =>
  canvasTex('kk-stack', 256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#EDE4CF';
    ctx.fillRect(0, 0, w, h);
    const r = rng(5);
    for (let y = 0; y < h; y += 3) {
      ctx.fillStyle = `rgba(120,100,70,${0.08 + r() * 0.22})`;
      ctx.fillRect(0, y, w, 1);
    }
  });

// Hoja de manuscrito (cara superior de cada fajo): renglones de letra pequeña.
const manuscriptTex = () =>
  canvasTex('kk-manuscript', 512, 360, (ctx, w, h) => {
    ctx.fillStyle = '#EFE6D0';
    ctx.fillRect(0, 0, w, h);
    const r = rng(77);
    for (let y = 40; y < h - 30; y += 22) {
      let x = 36;
      while (x < w - 60) {
        const ww = 18 + r() * 60;
        ctx.strokeStyle = `rgba(42,32,24,${0.45 + r() * 0.2})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        for (let k = 0; k < ww; k += 4) ctx.lineTo(x + k, y - Math.abs(Math.sin(k * 0.7 + r() * 3)) * 7);
        ctx.stroke();
        x += ww + 10;
      }
    }
  });

// Pilas de manuscritos y libros que van apareciendo (orden de aparición).
const STACKS: { x: number; z: number; n: number; ry: number }[] = [
  { x: 34, z: -10, n: 14, ry: 0.1 }, { x: -18, z: -14, n: 9, ry: -0.18 }, { x: 38, z: 8, n: 7, ry: 0.32 }, { x: -46, z: -8, n: 11, ry: 0.05 },
];
const PILE_BOOKS: ShelfBook[] = ['O lo uno o lo otro', 'Temor y temblor', 'La repetición', 'Migajas filosóficas', 'El concepto de la angustia', 'Estadios en el camino de la vida', 'Post scriptum', 'La enfermedad mortal']
  .map((t, i) => ({ title: t, thick: 3 + (i % 3) * 0.8, h: 22, depth: 15, cloth: ['#4A2E22', '#22323F', '#2E3B33', '#5E1C2B', '#4F5961', '#3B3631', '#6A5733', '#14191F'][i], foil: 'gold' as const, variant: (i % 4) as ShelfBook['variant'], seed: hash(t),
    author: ['Victor Eremita', 'Johannes de Silentio', 'Constantin Constantius', 'Johannes Climacus', 'Vigilius Haufniensis', 'Hilarius Bookbinder', 'Johannes Climacus', 'Anti-Climacus'][i] }));

export type RoomProps = {
  keys: CamKey[];
  f: { ring: number; fold: number; seal: number; send: number; life: number; names: number; end: number };
  shake?: number;
};

const Flame: React.FC<{ pos: V3; k: number; frame: number }> = ({ pos, k, frame }) => {
  const camera = useThree((s) => s.camera);
  const flick = 1 + 0.12 * Math.sin(frame * 0.9) + 0.07 * Math.sin(frame * 2.3 + 1);
  const ref = React.useRef<THREE.Group>(null);
  React.useLayoutEffect(() => { if (ref.current) ref.current.quaternion.copy(camera.quaternion); });
  const glow = useMemo(() => canvasTex('kk-flame', 128, 256, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h * 0.62, 2, w / 2, h * 0.6, w * 0.5);
    g.addColorStop(0, 'rgba(255,250,220,1)');
    g.addColorStop(0.35, 'rgba(255,200,90,0.95)');
    g.addColorStop(0.7, 'rgba(255,120,30,0.35)');
    g.addColorStop(1, 'rgba(255,120,30,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.bezierCurveTo(w * 0.95, h * 0.45, w * 0.85, h, w / 2, h);
    ctx.bezierCurveTo(w * 0.15, h, w * 0.05, h * 0.45, w / 2, 0);
    ctx.fill();
  }), []);
  const halo = useMemo(() => canvasTex('kk-halo', 256, 256, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2);
    g.addColorStop(0, 'rgba(255,190,110,0.55)');
    g.addColorStop(0.4, 'rgba(255,170,80,0.16)');
    g.addColorStop(1, 'rgba(255,170,80,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }), []);
  return (
    <group ref={ref} position={pos}>
      <mesh scale={[1.1 * k, 2.6 * k * flick, 1]} position={[0, 1.1 * k, 0]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={glow} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      <mesh scale={[16 * k * flick, 16 * k * flick, 1]} position={[0, 1.2 * k, -0.2]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={halo} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
    </group>
  );
};

export const RoomScene: React.FC<RoomProps> = ({ keys, f, shake = 0.25 }) => {
  const frame = useCurrentFrame();
  const mats = useMemo(() => ({
    wall: new THREE.MeshStandardMaterial({ map: wallTex(), roughness: 0.95 }),
    floor: new THREE.MeshStandardMaterial({ map: floorTex(), roughness: 0.8 }),
    desk: new THREE.MeshStandardMaterial({ map: woodTex('#4A2E1C', 'kk-desk'), roughness: 0.45 }),
    frame: new THREE.MeshStandardMaterial({ color: '#E7E3DA', roughness: 0.7 }),
    sky: new THREE.MeshBasicMaterial({ map: skyTex(), toneMapped: false }),
    letter: new THREE.MeshStandardMaterial({ map: letterTex(), roughness: 0.9, side: THREE.DoubleSide }),
    env: new THREE.MeshStandardMaterial({ map: envelopeTex(), roughness: 0.9, side: THREE.DoubleSide }),
    flap: new THREE.MeshStandardMaterial({ color: '#E2D6BC', roughness: 0.9, side: THREE.DoubleSide }),
    seal: new THREE.MeshStandardMaterial({ map: sealTex(), roughness: 0.35, metalness: 0.05 }),
    sealSide: new THREE.MeshStandardMaterial({ color: '#7E141B', roughness: 0.4 }),
    gold: new THREE.MeshStandardMaterial({ color: '#E8C36A', roughness: 0.18, metalness: 0.75, emissive: '#5A3A08', emissiveIntensity: 0.25 }),
    stone: new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.02, metalness: 0.1, emissive: '#CFE6FF', emissiveIntensity: 0.35 }),
    brass: new THREE.MeshStandardMaterial({ color: '#B58A3C', roughness: 0.3, metalness: 0.7 }),
    wax: new THREE.MeshStandardMaterial({ color: '#F1E7CF', roughness: 0.6, emissive: '#FFB060', emissiveIntensity: 0.12 }),
    glass: new THREE.MeshStandardMaterial({ color: '#141619', roughness: 0.12, metalness: 0.3 }),
    quill: new THREE.MeshStandardMaterial({ color: '#EDE6D6', roughness: 0.7, side: THREE.DoubleSide }),
    stack: new THREE.MeshStandardMaterial({ map: paperStackTex(), roughness: 0.95 }),
    stackTop: new THREE.MeshStandardMaterial({ color: '#F1E8D4', roughness: 0.95 }),
    sheetTop: new THREE.MeshStandardMaterial({ map: manuscriptTex(), roughness: 0.95 }),
  }), []);

  // Tiempo que pasa (de «el resto de su vida» a «nombres falsos»): la vela se consume y la luz de la ventana late día/noche.
  const life = ramp01(frame, f.life - 6, f.names + 30);
  const dusk = 0.75 + 0.25 * Math.sin(life * Math.PI * 5 - Math.PI / 2) * life;
  const candleH = 14 * (1 - 0.72 * life);
  const flameY = 4.4 + candleH;
  const flick = 1 + 0.08 * Math.sin(frame * 0.8) + 0.05 * Math.sin(frame * 2.1 + 0.4);

  // La carta se dobla y entra en el sobre; el sobre se cierra, recibe el lacre y desaparece (enviado).
  const fold = ramp01(frame, f.fold, f.fold + 18);
  const toEnv = ramp01(frame, f.fold + 14, f.fold + 30);
  const flapC = ramp01(frame, f.fold + 30, f.fold + 44);
  const sealIn = ramp01(frame, f.seal - 6, f.seal + 2, (t) => t * t);
  const sent = ramp01(frame, f.send, f.send + 26, (t) => t * t);
  const ringIn = ramp01(frame, f.ring - 30, f.ring + 6, (t) => 1 - Math.pow(1 - t, 3));
  const ringRoll = (1 - ringIn);

  return (
    <>
      <color attach="background" args={['#0D0F12']} />
      <fog attach="fog" args={['#0D0F12', 260, 520]} />
      <Rig keys={keys} shake={shake} />
      <hemisphereLight args={['#8FA2B8', '#2A2622', 0.55 * dusk]} />
      {/* luz fría de la ventana */}
      <directionalLight position={[-14, 150, -190]} intensity={2.5 * dusk} color="#C6D6EA" castShadow
        shadow-mapSize-width={1536} shadow-mapSize-height={1536} shadow-camera-left={-120} shadow-camera-right={120} shadow-camera-top={120} shadow-camera-bottom={-120} shadow-bias={-0.0004} shadow-normalBias={0.04} />
      {/* vela */}
      <pointLight position={[-38, flameY + 2, 10]} intensity={2.1 * flick} decay={0} distance={150} color="#FFBC78" castShadow shadow-mapSize-width={512} shadow-mapSize-height={512} shadow-bias={-0.002} />
      {/* relleno cálido suave desde la cámara */}
      <pointLight position={[60, 60, 120]} intensity={0.35} decay={0} distance={400} color="#FFD9B0" />

      {/* cuarto */}
      <mesh position={[0, 77, -70]} material={mats.wall} receiveShadow><planeGeometry args={[420, 306]} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -76, 60]} material={mats.floor} receiveShadow><planeGeometry args={[420, 260]} /></mesh>
      {/* ventana alta: cielo, marco y parteluces */}
      <group position={[-12, 100, -69.4]}>
        <mesh material={mats.sky}><planeGeometry args={[80, 130]} /></mesh>
        {[-41, 41].map((x) => <mesh key={x} position={[x, 0, 1]} material={mats.frame} castShadow><boxGeometry args={[4, 138, 3]} /></mesh>)}
        {[-67, 67].map((y) => <mesh key={y} position={[0, y, 1]} material={mats.frame} castShadow><boxGeometry args={[86, 4, 3]} /></mesh>)}
        <mesh position={[0, 0, 1]} material={mats.frame} castShadow><boxGeometry args={[2.4, 134, 2.4]} /></mesh>
        {[-22, 22].map((y) => <mesh key={y} position={[0, y, 1]} material={mats.frame} castShadow><boxGeometry args={[82, 2.2, 2.4]} /></mesh>)}
        <mesh position={[0, -70, 6]} material={mats.frame} receiveShadow><boxGeometry args={[94, 3, 14]} /></mesh>
      </group>

      {/* escritorio */}
      <mesh position={[0, -1.5, 0]} material={mats.desk} castShadow receiveShadow><boxGeometry args={[124, 3, 66]} /></mesh>
      {[[-58, -29], [58, -29], [-58, 29], [58, 29]].map(([x, z], i) => (
        <mesh key={i} position={[x, -39, z]} material={mats.desk} castShadow><boxGeometry args={[4, 74, 4]} /></mesh>
      ))}
      <mesh position={[0, -8, 0]} material={mats.desk} castShadow><boxGeometry args={[118, 9, 60]} /></mesh>

      {/* candelero y vela */}
      <group position={[-38, 0, 10]}>
        <mesh position={[0, 0.6, 0]} material={mats.brass} castShadow><cylinderGeometry args={[6, 6.6, 1.2, 40]} /></mesh>
        <mesh position={[0, 2.6, 0]} material={mats.brass} castShadow><cylinderGeometry args={[1.2, 1.6, 4, 24]} /></mesh>
        <mesh position={[0, 4.4, 0]} material={mats.brass} castShadow><cylinderGeometry args={[2.6, 2.2, 0.8, 30]} /></mesh>
        <mesh position={[0, 4.6 + candleH / 2, 0]} material={mats.wax} castShadow><cylinderGeometry args={[1.5, 1.6, candleH, 28]} /></mesh>
        <mesh position={[0, 4.8 + candleH, 0]}><cylinderGeometry args={[0.08, 0.08, 0.8, 6]} /><meshBasicMaterial color="#1A1410" /></mesh>
      </group>
      <Flame pos={[-38, 4.8 + candleH, 10]} k={1} frame={frame} />

      {/* tintero y pluma */}
      <group position={[34, 0, -12]}>
        <mesh position={[0, 2.6, 0]} material={mats.glass} castShadow><cylinderGeometry args={[3.2, 3.6, 5.2, 28]} /></mesh>
        <mesh position={[0, 5.6, 0]} material={mats.brass}><cylinderGeometry args={[1.6, 1.6, 0.9, 20]} /></mesh>
        <group position={[0.4, 6, 0]} rotation={[0.3, 0.2, -0.55]}>
          <mesh position={[0, 9, 0]} material={mats.quill} castShadow><cylinderGeometry args={[0.12, 0.05, 20, 8]} /></mesh>
          <mesh position={[0.9, 13, 0]} rotation={[0, 0, 0.06]} material={mats.quill} castShadow>
            <shapeGeometry args={[(() => { const s = new THREE.Shape(); s.moveTo(0, -6); s.quadraticCurveTo(2.6, 0, 0.6, 8); s.quadraticCurveTo(-0.6, 2, 0, -6); return s; })()]} />
          </mesh>
        </group>
      </group>

      {/* la carta: se dobla en tres y entra en el sobre */}
      {sent < 0.999 && (
        <group position={[LETTER_POS[0] + toEnv * 2, LETTER_POS[1] + toEnv * 0.4 + sent * 4, LETTER_POS[2] - toEnv * 2 - sent * 60]} rotation={[0, 0.06 - toEnv * 0.06, 0]}>
          {toEnv < 0.98 && (
            <group scale={[1 - toEnv * 0.05, 1, 1 - toEnv * 0.05]}>
              {/* tercio central */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} material={mats.letter} receiveShadow castShadow>
                <planeGeometry args={[21, 9.9]} />
              </mesh>
              {/* tercio superior (se pliega hacia abajo) */}
              <group position={[0, 0, -4.95]} rotation={[-fold * Math.PI * 0.98, 0, 0]}>
                <mesh position={[0, 0, -4.95]} rotation={[-Math.PI / 2, 0, 0]} material={mats.letter} receiveShadow castShadow>
                  <planeGeometry args={[21, 9.9]} />
                </mesh>
              </group>
              {/* tercio inferior */}
              <group position={[0, 0.02, 4.95]} rotation={[fold * Math.PI * 0.96, 0, 0]}>
                <mesh position={[0, 0, 4.95]} rotation={[-Math.PI / 2, 0, 0]} material={mats.letter} receiveShadow castShadow>
                  <planeGeometry args={[21, 9.9]} />
                </mesh>
              </group>
            </group>
          )}
          {/* sobre */}
          {toEnv > 0.02 && (
            <group position={[0, 0.3, 0]} scale={[toEnv, 1, toEnv]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]} material={mats.env} castShadow receiveShadow><planeGeometry args={[23, 12.6]} /></mesh>
              <group position={[0, 0.05, -6.3]} rotation={[-Math.PI + flapC * Math.PI, 0, 0]}>
                <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.flap} castShadow>
                  <shapeGeometry args={[(() => { const s = new THREE.Shape(); s.moveTo(-11.5, 0); s.lineTo(11.5, 0); s.lineTo(0, -7.6); s.closePath(); return s; })()]} />
                </mesh>
              </group>
              {/* lacre */}
              {frame >= f.seal - 6 && (
                <group position={[0, 0.6 + (1 - sealIn) * 8, 1.2]}>
                  <mesh rotation={[0, 0.4, 0]} material={[mats.sealSide, mats.seal, mats.sealSide]} castShadow><cylinderGeometry args={[2.1, 2.3, 0.6, 36]} /></mesh>
                </group>
              )}
            </group>
          )}
        </group>
      )}

      {/* el anillo (rueda un poco y se queda sobre la carta); viaja con el sobre */}
      {sent < 0.999 && toEnv < 0.6 && (
        <group position={[RING_POS[0] + ringRoll * 18, RING_POS[1], RING_POS[2] + ringRoll * 6 - toEnv * 4]} rotation={[-Math.PI / 2 + 0.02, 0, ringRoll * 6]}>
          {/* alianza lisa de oro (en Dinamarca, los dos prometidos llevaban anillo) */}
          <mesh material={mats.gold} castShadow scale={[1, 1, 1.6]}><torusGeometry args={[1.05, 0.2, 20, 64]} /></mesh>
        </group>
      )}

      {/* pilas de manuscritos que crecen (fajos de hojas algo desordenados) y libros que llegan */}
      {STACKS.map((s, k) => {
        const a = f.life + k * 10;
        const g = ramp01(frame, a, a + 40, (t) => 1 - Math.pow(1 - t, 2));
        if (g <= 0) return null;
        const n = Math.max(1, Math.round(s.n * g));
        const r = rng(40 + k);
        return (
          <group key={k} position={[s.x, 0, s.z]} rotation={[0, s.ry, 0]}>
            {Array.from({ length: n }).map((_, j) => {
              const jx = (r() - 0.5) * 1.6, jz = (r() - 0.5) * 1.2, jr = (r() - 0.5) * 0.12;
              return (
                <mesh key={j} position={[jx, j * 0.9 + 0.42, jz]} rotation={[0, jr, 0]} material={[mats.stack, mats.stack, mats.sheetTop, mats.stack, mats.stack, mats.stack]} castShadow receiveShadow>
                  <boxGeometry args={[20.5, 0.84, 14.6]} />
                </mesh>
              );
            })}
          </group>
        );
      })}
      {PILE_BOOKS.map((b, i) => {
        const a = f.life + 18 + i * 6;
        const g = ramp01(frame, a, a + 18, (t) => 1 - Math.pow(1 - t, 3));
        if (g <= 0) return null;
        const pile = i < 4 ? 0 : 1;
        const j = i % 4;
        const base: V3 = pile === 0 ? [-6, 0, -22] : [20, 0, -24];
        const below = PILE_BOOKS.slice(pile * 4, pile * 4 + j).reduce((a2, q) => a2 + q.thick, 0);
        const y = below + b.thick / 2;
        return <Book key={i} b={b} position={[base[0] + (j % 2 ? 0.6 : -0.4), y + (1 - g) * 16, base[2]]} rotation={[0, 0, Math.PI / 2 + (j % 2 ? 0.05 : -0.04)]} />;
      })}
    </>
  );
};
