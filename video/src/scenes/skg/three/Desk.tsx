import React, { useMemo } from 'react';
import * as THREE from 'three';
import { ThreeCanvas } from '@remotion/three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame } from 'remotion';
import { Sfx, ChangeTicks } from '../../../components/Sfx';
import { LogoIcon } from '../../../components/Logo';
import { clamp, easeInOut, easeOut, fmtEs } from '../../../lib/anim';
import { color, font, Grain, KR } from '../kit';
import { sceneClock } from '../timeline';
import { Book, ShelfBook, woodTex } from './books3d';
import { CLOTHS, Rig } from './Library';
import { CamKey, canvasTex, easeO, hash, ramp01, rng, SANS, useFontsReady, V3, AUDIO_ONLY } from './lib3d';

// ————————————————————————————————————————————————————————————————
// Escritorio 3D (HOURS y MAPA): mesa de nogal bajo un flexo, con la biblioteca desenfocada detrás (imagen renderizada
// de la propia escena del gancho, public/skg/3d/biblioteca_fondo.jpg, puesta como fondo CSS del lienzo transparente).
// ————————————————————————————————————————————————————————————————

// Los 39 audiolibros de King en español del catálogo de SonorBooks (14/10/2026), de menor a mayor duración (horas).
// Suman 724 h. Fuente: research/autores/stephen-king/king_fichas.json.
export const AUDIO_HOURS: [string, number][] = [
  ['Un rostro en la multitud', 1.46], ['La caja de botones de Gwendy', 2.88], ['Elevación', 3.29], ['Después', 6.92], ['Carrie', 7.42], ['El pistolero', 7.72],
  ['La última misión de Gwendy', 8.58], ['La niebla', 10.06], ['Buick 8', 13.92], ['La llegada de los tres', 13.92], ['Misery', 14.2], ['Fin de guardia', 14.47],
  ['La milla verde', 14.57], ['Quien pierde paga', 15.2], ['Canción de Susannah', 15.58], ['Cujo', 16.08], ['Revival', 16.22], ['La sangre manda', 16.77],
  ["El misterio de Salem's Lot", 16.93], ['Mr. Mercedes', 17.3], ['Billy Summers', 18.22], ['Holly', 18.42], ['El resplandor', 18.53], ['Las tierras baldías', 19.2],
  ['No tengas miedo', 19.29], ['La zona muerta', 19.53], ['El bazar de los malos sueños', 20.27], ['El visitante', 21.04], ['Doctor Sueño', 21.3], ['El Instituto', 21.32],
  ['Si te gusta la oscuridad', 22.02], ['El cazador de sueños', 25.81], ['Cuento de hadas', 25.83], ['Mago y cristal', 29.1], ['Lobos del Calla', 29.27],
  ['22/11/63', 32.72], ['La Torre Oscura', 34.0], ['It', 46.4], ['Apocalipsis', 48.27],
];

export const DeskBackdrop: React.FC<{ x?: number; s?: number; dim?: number }> = ({ x = 0, s = 1.08, dim = 0.35 }) => (
  <AbsoluteFill style={{ overflow: 'hidden' }}>
    <AbsoluteFill style={{ backgroundImage: `url(${staticFile('skg/3d/biblioteca_fondo.jpg')})`, backgroundSize: 'cover', backgroundPosition: 'center', transform: `translateX(${x}px) scale(${s})` }} />
    <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(8,8,10,${dim}) 0%, rgba(8,8,10,${dim * 0.6}) 40%, rgba(8,8,10,${Math.min(1, dim + 0.35)}) 100%)` }} />
  </AbsoluteFill>
);

export const Desk: React.FC<{ z?: number; w?: number; d?: number }> = ({ z = -10, w = 420, d = 190 }) => {
  const mat = useMemo(() => {
    const t = woodTex('#3A2416', 'desk');
    const m = new THREE.MeshStandardMaterial({ map: t, roughness: 0.48, metalness: 0 });
    return m;
  }, []);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, z + d / 2 - 40]} receiveShadow material={mat}>
        <planeGeometry args={[w, d]} />
      </mesh>
      {/* canto trasero de la mesa */}
      <mesh position={[0, -1.6, z - 40]} material={mat}><boxGeometry args={[w, 3.2, 1]} /></mesh>
    </group>
  );
};

// Auriculares (atrezo): diadema, almohadillas y un anillo amarillo.
const Headphones: React.FC<{ position: V3; rotation: V3; s?: number }> = ({ position, rotation, s = 1 }) => {
  const black = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1A1B1F', roughness: 0.38, metalness: 0.2 }), []);
  const cush = useMemo(() => new THREE.MeshStandardMaterial({ color: '#2A2B30', roughness: 0.9 }), []);
  const yellow = useMemo(() => new THREE.MeshStandardMaterial({ color: '#FFCA05', roughness: 0.35, emissive: '#FFB000', emissiveIntensity: 0.15 }), []);
  return (
    <group position={position} rotation={rotation} scale={s}>
      <mesh material={black} castShadow><torusGeometry args={[8.2, 0.7, 14, 48, Math.PI]} /></mesh>
      {[-1, 1].map((k) => (
        <group key={k} position={[k * 8.2, -1.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh material={black} castShadow><cylinderGeometry args={[3.4, 3.4, 2.2, 36]} /></mesh>
          <mesh material={cush} position={[0, -k * 1.4, 0]}><cylinderGeometry args={[3.1, 3.1, 1.1, 36]} /></mesh>
          <mesh material={yellow} position={[0, k * 1.15, 0]}><torusGeometry args={[2.4, 0.22, 10, 36]} /></mesh>
        </group>
      ))}
    </group>
  );
};

// Casilla del calendario: cara de día (arriba) y de noche (abajo).
const tileTex = (n: number, night: boolean) =>
  canvasTex(`tile-${n}-${night ? 'n' : 'd'}`, 256, 256, (ctx, w, h) => {
    const r = rng(40 + n);
    if (night) {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#22304C');
      g.addColorStop(1, '#121A2B');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 14; i++) {
        ctx.fillStyle = `rgba(255,255,255,${0.3 + r() * 0.5})`;
        ctx.beginPath();
        ctx.arc(r() * w, r() * h * 0.7, 1 + r() * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#FFD44D';
      ctx.beginPath();
      ctx.arc(w * 0.72, h * 0.7, 34, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1A2540';
      ctx.beginPath();
      ctx.arc(w * 0.72 + 16, h * 0.7 - 12, 30, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#F7F0DE';
      ctx.fillRect(0, 0, w, h);
      const g = ctx.createRadialGradient(w * 0.72, h * 0.7, 6, w * 0.72, h * 0.7, 80);
      g.addColorStop(0, 'rgba(255,202,5,0.35)');
      g.addColorStop(1, 'rgba(255,202,5,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#FFCA05';
      ctx.beginPath();
      ctx.arc(w * 0.72, h * 0.7, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFCA05';
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      for (let k = 0; k < 8; k++) {
        const a = (k * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(w * 0.72 + Math.cos(a) * 38, h * 0.7 + Math.sin(a) * 38);
        ctx.lineTo(w * 0.72 + Math.cos(a) * 52, h * 0.7 + Math.sin(a) * 52);
        ctx.stroke();
      }
    }
    ctx.font = `700 92px ${SANS}`;
    ctx.fillStyle = night ? '#F2EEE4' : '#141414';
    ctx.textBaseline = 'top';
    ctx.fillText(String(n), 26, 22);
    // auricular pequeño
    ctx.strokeStyle = night ? 'rgba(255,212,77,0.9)' : 'rgba(20,20,20,0.75)';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(64, h - 52, 30, Math.PI, 0);
    ctx.stroke();
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fillRect(28, h - 56, 14, 26);
    ctx.fillRect(86, h - 56, 14, 26);
    // borde
    ctx.strokeStyle = night ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, w - 6, h - 6);
  });

const ROW_BOOKS = (() => {
  const r = rng(39);
  let x = 0;
  const gap = 0.9;
  const list = AUDIO_HOURS.map(([t, hrs], i) => {
    const cl = CLOTHS[(i * 7 + 3) % CLOTHS.length];
    const b: ShelfBook = { title: t, thick: 2.6 + Math.min(3.2, hrs / 14), h: 20 + r() * 3.4, depth: 14.6, cloth: cl.c, foil: cl.foil, variant: (Math.floor(r() * 4) % 4) as ShelfBook['variant'], seed: hash(`a${t}`) };
    const out = { b, hrs, x: x + b.thick / 2 };
    x += b.thick + gap;
    return out;
  });
  const total = x - gap;
  list.forEach((p) => (p.x -= total / 2));
  return { list, total };
})();

const HoursScene: React.FC<{ f: Record<string, number>; dur: number }> = ({ f, dur }) => {
  const frame = useCurrentFrame();
  const { list } = ROW_BOOKS;
  const K = 1.25; // unidades por hora
  const barAt = (i: number) => f.suman - 4 + i * 2.1;
  const drain = ramp01(frame, f.mes - 10, f.mes + 20);
  const barGeo = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 2, 0.12), []);
  const barMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#FFC21A', roughness: 0.38, metalness: 0.05, emissive: '#C86A00', emissiveIntensity: 0.22 }), []);
  const capMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#FFF4C2', emissive: '#FFF4C2', emissiveIntensity: 0.8 }), []);
  const tileGeo = useMemo(() => new THREE.BoxGeometry(13.6, 0.9, 13.6), []);
  const edgeMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#C8BEA6', roughness: 0.7 }), []);
  const tileMats = useMemo(() => Array.from({ length: 30 }).map((_, i) => {
    const day = new THREE.MeshStandardMaterial({ map: tileTex(i + 1, false), roughness: 0.75 });
    const night = new THREE.MeshStandardMaterial({ map: tileTex(i + 1, true), roughness: 0.6, emissive: '#FFFFFF', emissiveMap: tileTex(i + 1, true), emissiveIntensity: 0.12 });
    return [edgeMat, edgeMat, day, night, edgeMat, edgeMat];
  }), [edgeMat]);
  const keys: CamKey[] = [
    { f: 0, pos: [-92, 13, 40], look: [-58, 11, -2], fov: 30 },
    { f: f.sonor, pos: [-46, 20, 92], look: [-14, 14, 0], fov: 30 },
    { f: f.set + 30, pos: [-4, 52, 238], look: [0, 40, 0], fov: 30 },
    { f: f.mes - 4, pos: [2, 51, 230], look: [2, 39, 0], fov: 30 },
    { f: f.dia + 4, pos: [0, 138, 150], look: [0, 0, 47], fov: 30 },
    { f: dur, pos: [0, 134, 140], look: [0, 0, 47], fov: 30, ease: (t) => t },
  ];
  const lamp = 1;
  return (
    <>
      <Rig keys={keys} shake={0.3} />
      <hemisphereLight args={['#5A5F6E', '#1A120C', 0.55]} />
      <spotLight position={[-90, 150, 120]} angle={0.62} penumbra={0.8} intensity={4.6 * lamp} decay={0} color="#FFD7A3" castShadow
        shadow-mapSize-width={1536} shadow-mapSize-height={1536} shadow-bias={-0.0004} shadow-normalBias={0.04} />
      <pointLight position={[110, 40, 60]} intensity={0.9} decay={0} distance={300} color={KR} />
      <Desk />
      {list.map((p, i) => {
        const a = 4 + i * 1.3;
        const s = spring({ frame: frame - a, fps: 50, config: { damping: 15, stiffness: 160, mass: 0.8 } });
        if (frame < a) return null;
        const bs = spring({ frame: frame - barAt(i), fps: 50, config: { damping: 18, stiffness: 90 } });
        const hgt = Math.max(0.001, p.hrs * K * bs * (1 - drain));
        return (
          <group key={i} position={[p.x, 0, 0]}>
            <Book b={p.b} position={[0, p.b.h / 2 + (1 - s) * 16, 0]} rotation={[0, (1 - s) * 0.6, (1 - s) * 0.2]} />
            {frame >= barAt(i) && hgt > 0.01 && (
              <>
                <mesh geometry={barGeo} material={barMat} position={[0, p.b.h + hgt / 2, 0]} scale={[p.b.thick * 0.86, hgt, p.b.depth * 0.6]} castShadow />
                <mesh geometry={barGeo} material={capMat} position={[0, p.b.h + hgt + 0.15, 0]} scale={[p.b.thick * 0.86, 0.3, p.b.depth * 0.6]} />
              </>
            )}
          </group>
        );
      })}
      {/* Calendario de 30 días sobre la mesa */}
      {frame >= f.mes - 6 && Array.from({ length: 30 }).map((_, i) => {
        const col = i % 6, row = Math.floor(i / 6);
        const a = f.mes - 4 + (col + row) * 2.2;
        const s = spring({ frame: frame - a, fps: 50, config: { damping: 14, stiffness: 170 } });
        if (frame < a) return null;
        // Noche en ola diagonal; luego día y noche se alternan sin parar
        const w = (col + row) * 1.8;
        const flip1 = ramp01(frame, f.noche - 6 + w, f.noche + 10 + w, easeO);
        const flip2 = ramp01(frame, f.sin + 6 + w, f.sin + 22 + w, easeO);
        const rot = Math.PI * (flip1 + flip2);
        const lift = Math.sin(Math.PI * ((flip1 + flip2) % 1)) * 5;
        const x = (col - 2.5) * 16;
        const z = 14 + row * 16;
        return (
          <mesh key={i} geometry={tileGeo} material={tileMats[i]} position={[x, 0.45 + (1 - s) * 18 + lift, z]} rotation={[rot, 0, (1 - s) * 0.4]} scale={0.2 + 0.8 * s} castShadow receiveShadow />
        );
      })}
    </>
  );
};

export const Hours3D: React.FC = () => {
  const frame = useCurrentFrame();
  const ready = useFontsReady();
  const c = sceneClock('HOURS');
  const f = {
    solo: c.at('G03', 'solo'), sonor: c.at('G03', 'SonorBooks'), suman: c.at('G03', 'suman'), set: c.at('G03', 'setecientas'),
    mes: c.at('G03', 'mes'), dia: c.at('G03', 'día'), noche: c.at('G03', 'noche'), sin: c.at('G03', 'sin'),
  };
  const count = interpolate(frame, [f.suman, f.suman + 4 + 39 * 2.1 + 20], [0, 724], { ...clamp, easing: (t) => t * (2 - t) });
  const counterIn = ramp01(frame, f.suman - 6, f.suman + 10) * (1 - ramp01(frame, f.mes - 12, f.mes + 4));
  const calIn = ramp01(frame, f.mes, f.mes + 16);
  const badge = ramp01(frame, f.sonor - 8, f.sonor + 8, easeO) * (1 - ramp01(frame, f.suman - 10, f.suman + 2));
  return (
    <AbsoluteFill style={{ background: '#0B0C0E' }}>
      <DeskBackdrop x={interpolate(frame, [0, c.dur], [30, -30])} s={1.12} dim={0.38 + 0.25 * calIn} />
      {ready && !AUDIO_ONLY && (
        <ThreeCanvas width={1920} height={1080} shadows gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }} camera={{ fov: 30, position: [0, 20, 100] }}>
          <HoursScene f={f} dur={c.dur} />
        </ThreeCanvas>
      )}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.6) 100%)', pointerEvents: 'none' }} />
      <Grain seed={Math.floor(frame / 2)} opacity={0.09} />
      {/* SonorBooks: de dónde salen los datos */}
      {badge > 0.01 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 90, display: 'flex', justifyContent: 'center', opacity: badge, transform: `translateY(${(1 - badge) * 16}px)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '14px 30px 14px 20px', background: 'rgba(16,17,20,0.66)', backdropFilter: 'blur(12px)', borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.16)', boxShadow: '0 20px 50px rgba(0,0,0,0.45)' }}>
            <LogoIcon size={44} />
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: '#fff' }}>39 audiolibros en español <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>· catálogo de SonorBooks</span></span>
          </div>
        </div>
      )}
      {/* Contador de horas */}
      {counterIn > 0.01 && (
        <div style={{ position: 'absolute', left: 150, top: 96, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', opacity: counterIn, transform: `translateY(${(1 - counterIn) * 20}px)` }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 22 }}>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 200, letterSpacing: -9, lineHeight: 0.9, color: '#fff', fontVariantNumeric: 'tabular-nums', textShadow: '0 12px 50px rgba(0,0,0,0.6)' }}>{fmtEs(Math.round(count))}</span>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 76, color: color.yellow, textShadow: '0 8px 30px rgba(0,0,0,0.6)' }}>horas</span>
          </div>
          <div style={{ marginTop: 12, marginLeft: 8, fontFamily: font.sans, fontWeight: 500, fontSize: 36, color: 'rgba(255,255,255,0.85)', opacity: ramp01(frame, f.set, f.set + 14) }}>de Stephen King en audiolibro en español</div>
        </div>
      )}
      {/* Un mes entero */}
      {calIn > 0.01 && (
        <>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 260, background: 'linear-gradient(180deg, rgba(6,6,8,0.86) 0%, rgba(6,6,8,0.6) 55%, rgba(6,6,8,0) 100%)', opacity: calIn }} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: 62, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, opacity: calIn, transform: `translateY(${(1 - calIn) * 20}px)` }}>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 88, letterSpacing: -3, color: '#fff', textShadow: '0 10px 40px rgba(0,0,0,0.7)' }}>Unos 30 días</span>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 70, letterSpacing: -2, color: '#fff', padding: '4px 26px 10px', borderRadius: 18,
              background: `rgba(193,18,31,${ramp01(frame, f.sin - 4, f.sin + 6)})`, boxShadow: frame >= f.sin - 4 ? '0 14px 40px rgba(193,18,31,0.45)' : undefined, transform: `scale(${1 + 0.06 * Math.sin(Math.PI * ramp01(frame, f.sin - 4, f.sin + 10))})` }}>sin parar</span>
          </div>
        </>
      )}
      {/* Sonido */}
      {Array.from({ length: 10 }).map((_, k) => <Sfx key={k} name="sk_book_slide" at={Math.round(4 + k * 4 * 1.3) + 2} volume={0.28 + 0.08 * (k % 3)} />)}
      <Sfx name="ui_pop" at={f.sonor} volume={0.6} />
      <Sfx name="riser" at={f.suman - 10} volume={0.3} />
      <ChangeTicks value={(fr) => String(Math.round(interpolate(fr, [f.suman, f.suman + 4 + 39 * 2.1 + 20], [0, 724], { ...clamp, easing: (t) => t * (2 - t) }) / 12))} from={f.suman} to={f.suman + 110} volume={0.5} />
      <Sfx name="hit_soft" at={f.set + 12} volume={0.7} />
      <Sfx name="whoosh_soft" at={f.mes - 8} volume={0.6} />
      {Array.from({ length: 8 }).map((_, k) => <Sfx key={`d${k}`} name="card_flip" at={Math.round(f.mes - 2 + k * 4)} volume={0.35} />)}
      <Sfx name="shimmer" at={f.noche - 4} volume={0.5} />
      {Array.from({ length: 6 }).map((_, k) => <Sfx key={`n${k}`} name="card_flip" at={Math.round(f.noche - 4 + k * 3.6)} volume={0.3} />)}
      <Sfx name="stamp" at={f.sin} volume={0.35} />
    </AbsoluteFill>
  );
};
export const _dk = { easeInOut, easeOut };
