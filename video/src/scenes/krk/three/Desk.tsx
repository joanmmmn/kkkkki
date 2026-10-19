import React, { useMemo } from 'react';
import * as THREE from 'three';
import { AbsoluteFill, staticFile } from 'remotion';
import { woodTex } from './books3d';
import { V3 } from './lib3d';

// ————————————————————————————————————————————————————————————————
// Escritorio 3D (VERS y MAPA): mesa de nogal bajo un flexo, con la biblioteca desenfocada detrás (imagen renderizada
// de la escena NAME, public/krk/3d/biblioteca_fondo.jpg, puesta como fondo CSS del lienzo transparente).
// ————————————————————————————————————————————————————————————————

export const DeskBackdrop: React.FC<{ x?: number; s?: number; dim?: number }> = ({ x = 0, s = 1.08, dim = 0.35 }) => (
  <AbsoluteFill style={{ overflow: 'hidden' }}>
    <AbsoluteFill style={{ backgroundImage: `url(${staticFile('krk/3d/biblioteca_fondo.jpg')})`, backgroundSize: 'cover', backgroundPosition: 'center', transform: `translateX(${x}px) scale(${s})` }} />
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
export const Headphones: React.FC<{ position: V3; rotation: V3; s?: number }> = ({ position, rotation, s = 1 }) => {
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

