import React, { useMemo } from 'react';
import * as THREE from 'three';
import { ThreeCanvas } from '@remotion/three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame } from 'remotion';
import { Sfx, ChangeTicks } from '../../../components/Sfx';
import { clamp, easeInOut, easeOut } from '../../../lib/anim';
import { color, font, Grain, KR, MiniIcon } from '../kit';
import { sceneClock } from '../timeline';
import { Book, ShelfBook, woodTex } from './books3d';
import { CLOTHS, Rig } from './Library';
import { CamKey, canvasTex, easeO, hash, ramp01, rng, SANS, useFontsReady, V3, AUDIO_ONLY } from './lib3d';

// ————————————————————————————————————————————————————————————————
// Escritorio 3D (HOURS y MAPA): mesa de nogal bajo un flexo, con la biblioteca desenfocada detrás (imagen renderizada
// de la propia escena del gancho, public/skg/3d/biblioteca_fondo.jpg, puesta como fondo CSS del lienzo transparente).
// ————————————————————————————————————————————————————————————————

// Las 85 grabaciones de King en polaco de Audioteka (19/10/2026; sin las dos antologías de otros autores), de menor a mayor
// duración (horas). Suman 1427,9 h: «ponad 1400 godzin». Fuente: autor en audioteka.com/pl y la ficha de cada audiobook.
export const AUDIO_HOURS: [string, number][] = [
  ['Rok wilkołaka', 2.2], ['Zimowa opowieść: Metoda oddychania', 2.9], ['Pudełko z guzikami Gwendy', 3.0], ['Uniesienie', 3.07], ['Colorado Kid', 4.22],
  ['Wiosna nadziei: Skazani na Shawshank', 4.37], ['Ukryte okno, ukryty ogród', 6.12], ['Później', 6.48], ['Jesień niewinności: Ciało', 6.48], ['Pies z aparatu', 7.17],
  ['Carrie', 7.2], ['Dziewczyna, która kochała Toma Gordona', 7.7], ['Uciekinier', 7.93], ['Lato zepsucia: Pojętny uczeń', 8.3], ['Biblioteczny policjant', 8.42],
  ['Ostatnia misja Gwendy', 8.47], ['Joyland', 9.23], ['Wielki marsz', 9.72], ['Langoliery', 9.95], ['Blaze', 10.0], ['Wiatr przez dziurkę od klucza', 10.08],
  ['Ostatni bastion Barta Dawesa', 10.12], ['Oczy smoka', 10.22], ['Chudszy', 10.27], ['Jak pisać. Pamiętnik rzemieślnika', 10.8], ['Dolores Claiborne', 11.13],
  ['Roland', 11.25], ['Buick 8', 11.57], ['Gra Geralda', 13.58], ['Koniec warty', 13.63], ['Powołanie trójki', 13.83], ['Jest krew…', 14.03],
  ['Znalezione nie kradzione', 14.07], ['Przebudzenie', 14.33], ['Nocna zmiana', 14.53], ['Komórka', 14.57], ['Regulatorzy', 14.9], ['Misery', 15.17], ['Cujo', 15.4],
  ['Cmętarz zwieżąt', 15.5], ['Pan Mercedes', 15.52], ['Zielona mila', 15.58], ['Zielona mila', 15.8], ['Pieśń Susannah', 16.02],
  ['Wszystko jest względne. 14 mrocznych opowieści', 16.32], ['Rose Madder', 16.32], ['Czarna bezgwiezdna noc', 16.33], ['Billy Summers', 16.55],
  ['Miasteczko Salem', 17.03], ['Po zachodzie słońca', 17.17], ['Serca Atlantydów', 17.23], ['Podpalaczka', 17.82], ['Martwa strefa', 18.03], ['Historia Lisey', 18.13],
  ['Instytut', 18.2], ['Ziemie jałowe', 18.95], ['Mroczna połowa', 19.35], ['Holly', 19.63], ['Nie wymiękaj', 19.82], ['Outsider', 19.87], ['Christine', 19.98],
  ['Danse Macabre', 20.48], ['Doktor Sen', 20.65], ['Lśnienie', 21.13], ['Bazar złych snów', 21.58], ['Im mroczniej, tym lepiej', 21.97], ['Desperacja', 22.05],
  ['Baśniowa opowieść', 22.17], ['Szkieletowa załoga', 22.8], ['Worek kości', 24.85], ['Czarny dom', 25.42], ['Stukostrachy', 26.75], ['Dallas ’63', 27.45],
  ['Talizman', 27.48], ['Wilki z Calla', 27.55], ['Śpiące królewny', 27.75], ['Łowca snów', 28.05], ['Marzenia i koszmary', 28.37],
  ['Czarnoksiężnik i kryształ', 28.93], ['Mroczna Wieża', 29.15], ['Bezsenność', 29.27], ['Ręka mistrza', 29.52], ['Sklepik z marzeniami', 31.12],
  ['Bastion', 47.87], ['To', 54.02],
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

// 85 libros: caen más seguidos y las barras crecen más deprisa que en el español (39), para durar lo mismo.
const DROP_STEP = 0.6;
const BAR_STEP = 1.0;
const BAR_END = 4 + AUDIO_HOURS.length * BAR_STEP + 20;
// Calendario: dos meses (2 × 30 casillas), «dwa miesiące».
const DAYS = 30;
const TILE = 8.8;
const PITCH = 10.2;

const ROW_BOOKS = (() => {
  const r = rng(39);
  let x = 0;
  const gap = 0.4;
  const list = AUDIO_HOURS.map(([t, hrs], i) => {
    const cl = CLOTHS[(i * 7 + 3) % CLOTHS.length];
    const b: ShelfBook = { title: t, thick: 1.2 + Math.min(1.5, hrs / 22), h: 20 + r() * 3.4, depth: 14.6, cloth: cl.c, foil: cl.foil, variant: (Math.floor(r() * 4) % 4) as ShelfBook['variant'], seed: hash(`a${t}`) };
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
  const barAt = (i: number) => f.suman - 4 + i * BAR_STEP;
  const drain = ramp01(frame, f.mes - 10, f.mes + 20);
  const barGeo = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 2, 0.12), []);
  const barMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#FFC21A', roughness: 0.38, metalness: 0.05, emissive: '#C86A00', emissiveIntensity: 0.22 }), []);
  const capMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#FFF4C2', emissive: '#FFF4C2', emissiveIntensity: 0.8 }), []);
  const tileGeo = useMemo(() => new THREE.BoxGeometry(TILE, 0.7, TILE), []);
  const edgeMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#C8BEA6', roughness: 0.7 }), []);
  const tileMats = useMemo(() => Array.from({ length: 30 }).map((_, i) => {
    const day = new THREE.MeshStandardMaterial({ map: tileTex(i + 1, false), roughness: 0.75 });
    const night = new THREE.MeshStandardMaterial({ map: tileTex(i + 1, true), roughness: 0.6, emissive: '#FFFFFF', emissiveMap: tileTex(i + 1, true), emissiveIntensity: 0.12 });
    return [edgeMat, edgeMat, day, night, edgeMat, edgeMat];
  }), [edgeMat]);
  const keys: CamKey[] = [
    { f: 0, pos: [-92, 13, 40], look: [-58, 11, -2], fov: 30 },
    { f: f.sonor, pos: [-46, 20, 92], look: [-14, 14, 0], fov: 30 },
    { f: f.set + 30, pos: [-4, 54, 250], look: [0, 40, 0], fov: 30 },
    { f: f.mes - 4, pos: [2, 53, 242], look: [2, 39, 0], fov: 30 },
    { f: f.dia + 4, pos: [0, 150, 160], look: [0, 0, 46], fov: 30 },
    { f: dur, pos: [0, 146, 150], look: [0, 0, 46], fov: 30, ease: (t) => t },
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
        const a = 4 + i * DROP_STEP;
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
      {/* Calendario de dos meses (2 × 30 días) sobre la mesa */}
      {frame >= f.mes - 6 && Array.from({ length: 2 * DAYS }).map((_, j) => {
        const m = Math.floor(j / DAYS), i = j % DAYS;
        const col = i % 6, row = Math.floor(i / 6);
        const a = f.mes - 4 + (col + row) * 2.2 + m * 10;
        const s = spring({ frame: frame - a, fps: 50, config: { damping: 14, stiffness: 170 } });
        if (frame < a) return null;
        // Noche en ola diagonal; luego día y noche se alternan sin parar
        const w = (col + row) * 1.8 + m * 6;
        const flip1 = ramp01(frame, f.noche - 6 + w, f.noche + 10 + w, easeO);
        const flip2 = ramp01(frame, f.sin + 6 + w, f.sin + 22 + w, easeO);
        const rot = Math.PI * (flip1 + flip2);
        const lift = Math.sin(Math.PI * ((flip1 + flip2) % 1)) * 5;
        const x = (m ? 1 : -1) * (3 * PITCH + 4) + (col - 2.5) * PITCH;
        const z = 26 + row * PITCH;
        return (
          <mesh key={j} geometry={tileGeo} material={tileMats[i]} position={[x, 0.35 + (1 - s) * 18 + lift, z]} rotation={[rot, 0, (1 - s) * 0.4]} scale={0.2 + 0.8 * s} castShadow receiveShadow />
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
    solo: c.at('G03', 'samej'), sonor: c.at('G03', 'Audiotece'), suman: c.at('G03', 'trwają'), set: c.at('G03', 'tysiąc'),
    mes: c.at('G03', 'dwa'), dia: c.at('G03', 'dzień'), noche: c.at('G03', 'noc'), sin: c.at('G03', 'bez'),
  };
  const count = interpolate(frame, [f.suman, f.suman + BAR_END], [0, 1400], { ...clamp, easing: (t) => t * (2 - t) });
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
            <span style={{ width: 44, height: 44, borderRadius: '50%', background: color.yellow, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><MiniIcon kind="head" size={28} /></span>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 32, color: '#fff' }}>Audiobooki Kinga po polsku <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>· dane z Audioteki</span></span>
          </div>
        </div>
      )}
      {/* Contador de horas */}
      {counterIn > 0.01 && (
        <div style={{ position: 'absolute', left: 150, top: 96, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', opacity: counterIn, transform: `translateY(${(1 - counterIn) * 20}px)` }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 22 }}>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 200, letterSpacing: -9, lineHeight: 0.9, color: '#fff', fontVariantNumeric: 'tabular-nums', textShadow: '0 12px 50px rgba(0,0,0,0.6)' }}>{Math.round(count)}{count >= 1399.5 ? '+' : ''}</span>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 76, color: color.yellow, textShadow: '0 8px 30px rgba(0,0,0,0.6)' }}>godzin</span>
          </div>
          <div style={{ marginTop: 12, marginLeft: 8, fontFamily: font.sans, fontWeight: 500, fontSize: 36, color: 'rgba(255,255,255,0.85)', opacity: ramp01(frame, f.set, f.set + 14) }}>Stephena Kinga w audiobookach po polsku</div>
        </div>
      )}
      {/* Un mes entero */}
      {calIn > 0.01 && (
        <>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 260, background: 'linear-gradient(180deg, rgba(6,6,8,0.86) 0%, rgba(6,6,8,0.6) 55%, rgba(6,6,8,0) 100%)', opacity: calIn }} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: 62, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, opacity: calIn, transform: `translateY(${(1 - calIn) * 20}px)` }}>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 88, letterSpacing: -3, color: '#fff', textShadow: '0 10px 40px rgba(0,0,0,0.7)' }}>Około 60 dni</span>
            <span style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 70, letterSpacing: -2, color: '#fff', padding: '4px 26px 10px', borderRadius: 18,
              background: `rgba(193,18,31,${ramp01(frame, f.sin - 4, f.sin + 6)})`, boxShadow: frame >= f.sin - 4 ? '0 14px 40px rgba(193,18,31,0.45)' : undefined, transform: `scale(${1 + 0.06 * Math.sin(Math.PI * ramp01(frame, f.sin - 4, f.sin + 10))})` }}>bez przerwy</span>
          </div>
        </>
      )}
      {/* Sonido */}
      {Array.from({ length: 10 }).map((_, k) => <Sfx key={k} name="sk_book_slide" at={Math.round(4 + k * 8.5 * DROP_STEP) + 2} volume={0.28 + 0.08 * (k % 3)} />)}
      <Sfx name="ui_pop" at={f.sonor} volume={0.6} />
      <Sfx name="riser" at={f.suman - 10} volume={0.3} />
      <ChangeTicks value={(fr) => String(Math.round(interpolate(fr, [f.suman, f.suman + BAR_END], [0, 1400], { ...clamp, easing: (t) => t * (2 - t) }) / 23))} from={f.suman} to={f.suman + BAR_END} volume={0.5} />
      <Sfx name="hit_soft" at={f.set + 12} volume={0.7} />
      <Sfx name="whoosh_soft" at={f.mes - 8} volume={0.6} />
      {Array.from({ length: 10 }).map((_, k) => <Sfx key={`d${k}`} name="card_flip" at={Math.round(f.mes - 2 + k * 4)} volume={0.35} />)}
      <Sfx name="shimmer" at={f.noche - 4} volume={0.5} />
      {Array.from({ length: 6 }).map((_, k) => <Sfx key={`n${k}`} name="card_flip" at={Math.round(f.noche - 4 + k * 3.6)} volume={0.3} />)}
      <Sfx name="stamp" at={f.sin} volume={0.35} />
    </AbsoluteFill>
  );
};
export const _dk = { easeInOut, easeOut };
