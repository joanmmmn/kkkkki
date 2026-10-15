import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { loadBrandFonts } from '../../brand/fonts';
import { Butterfly, P } from './kit';
import { handAt, Layer, PaperFinish, Person, Rig, Sky, walkPose } from './theatre';
import { Counter, Manuscript, ScaleSide, StreetLamp } from './sets';
import { Room } from './v2Open';
import { PawnShop, PawnSlip } from './v2Mercedes';
import { Blender } from './house';

loadBrandFonts();

// Miniaturas v2 (1920×1080; se exportan a 1280×720), con el mismo teatro de sombras del vídeo.
// Sin portada del libro ni retratos: siluetas genéricas.
const INK = '#120C08';
const cam = (x: number, y: number, s: number) => ({ x, y, s, r: 0 });

// A · Noche, la oficina de correos: él deja el paquete en la báscula; «82 pesos… y no les llegaba».
export const HDLThumbA2: React.FC = () => (
  <AbsoluteFill style={{ background: '#05080B' }}>
    <Rig cam={cam(1180, 640, 1.22)}>
      <Room frame={30} />
      <Layer z={1}>
        <Person x={1290} y={1010} scale={2.75} face={-1} kind="man" hair="visor" pose={{ lean: 6, shF: 26, elF: 40, shB: 18, elB: 40, neck: 10 }} c={INK} back="#2A1D15" />
        <Counter x0={905} x1={1125} top={690} floor={1010} c={INK} />
        <ScaleSide x={1010} y={690} c={INK} needle={22} plate={5} s={0.85} />
        <Manuscript x={1010} y={567} w={150} h={40} string={1} c={INK} />
        <Person x={560} y={1010} scale={2.65} kind="woman" hair="bob" pose={{ shF: 14, elF: 40, shB: -4, elB: 20, neck: 4 }} c="#22160F" back="#33241A" />
        <Person x={770} y={1010} scale={2.9} kind="man" hair="curly" mustache pose={{ lean: 3, shF: 6, elF: 12, shB: -6, elB: 10 }} c={INK} back="#2C1F17" />
      </Layer>
    </Rig>
    <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0) 40%, rgba(8,5,3,0.55) 62%, rgba(8,5,3,0.8) 100%)' }} />
    <PaperFinish opacity={0.45} vignette={0.55} warm={0.5} still />
    <div style={{ position: 'absolute', left: 990, top: 90, width: 860, transform: 'rotate(-3deg)', background: '#F2E6C8', padding: '36px 56px 40px', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
      <div style={{ fontFamily: '"Special Elite", monospace', fontSize: 40, letterSpacing: 6, color: '#5A2A22' }}>FRANQUEO · 1966</div>
      <div style={{ fontFamily: '"EB Garamond", serif', fontWeight: 700, fontSize: 250, lineHeight: 0.95, color: '#1D1A16', marginTop: 10 }}>82 <span style={{ fontSize: 150 }}>pesos</span></div>
      <div style={{ fontFamily: '"Caveat", cursive', fontWeight: 700, fontSize: 92, color: '#B5262B', lineHeight: 1, marginTop: 4 }}>…y no les llegaba</div>
    </div>
    <div style={{ position: 'absolute', left: 1040, top: 700, width: 820 }}>
      <div style={{ fontFamily: '"EB Garamond", serif', fontWeight: 600, fontSize: 132, lineHeight: 1.0, color: '#F6EFE2', textShadow: '0 6px 24px rgba(0,0,0,0.7)' }}>Cien años de soledad</div>
      <div style={{ fontFamily: '"EB Garamond", serif', fontStyle: 'italic', fontSize: 58, color: P.yellow, marginTop: 14, textShadow: '0 4px 16px rgba(0,0,0,0.7)' }}>casi no se publica</div>
    </div>
    <Butterfly x={1800} y={660} size={110} seed="ta1" glow={0.8} flap={0.2} rot={-14} />
    <Butterfly x={930} y={560} size={70} seed="ta2" glow={0.8} flap={0.6} rot={12} />
  </AbsoluteFill>
);

const CARRY = { ...walkPose(1.2, 0.6), shF: 46, elF: 76, shB: 40, elB: 80 };
const BL = handAt(1385, 962, 2.6, 1, 'woman', CARRY);
// B · Ella lleva la batidora al Monte de Piedad, de noche; las papeletas, encima. «Empeñaron hasta la batidora».
export const HDLThumbB2: React.FC = () => (
  <AbsoluteFill style={{ background: '#05080B' }}>
    <Rig cam={cam(1180, 600, 1.1)}>
      <Sky stops={[[0, '#0E1A2A'], [60, '#24304A'], [100, '#3A3046']]} glows={[{ x: 1340, y: 640, r: 700, c: '#FFC27A', a: 0.4 }]} />
      <Layer z={0.4}>
        {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-200 + i * 190} y={420 - random(`tb${i}`) * 200} width={180} height={700} fill="#1A2436" />)}
      </Layer>
      <Layer z={1}>
        <rect x={-300} y={960} width={2520} height={400} fill="#0A0E14" />
        <PawnShop x={1440} y={960} c="#1C1A20" frame={0} />
        <StreetLamp x={860} y={960} c="#0B0F14" h={560} on={1} />
        <Person x={1385} y={962} scale={2.6} kind="woman" hair="bob" pose={CARRY} c="#08090C" />
        <Blender x={BL[0] + 10} y={BL[1] + 30} c="#08090C" s={1.35} />
      </Layer>
    </Rig>
    <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(4,6,10,0.88) 0%, rgba(4,6,10,0.7) 42%, rgba(4,6,10,0) 62%)' }} />
    <PaperFinish opacity={0.4} vignette={0.5} still />
    <div style={{ position: 'absolute', left: 90, top: 150, width: 980 }}>
      <div style={{ fontFamily: '"Ubuntu", sans-serif', fontWeight: 700, fontSize: 52, letterSpacing: 8, color: '#E8925A' }}>PARA PUBLICAR ESTE LIBRO</div>
      <div style={{ fontFamily: '"EB Garamond", serif', fontWeight: 700, fontSize: 168, lineHeight: 0.98, color: '#F6EFE2', marginTop: 20 }}>empeñaron<br />hasta la</div>
      <div style={{ display: 'inline-block', marginTop: 10, background: P.yellow, padding: '0 26px', fontFamily: '"EB Garamond", serif', fontWeight: 700, fontSize: 168, lineHeight: 1.08, color: '#1D1A16' }}>batidora</div>
      <div style={{ fontFamily: '"EB Garamond", serif', fontStyle: 'italic', fontSize: 72, color: '#E9D7B0', marginTop: 26 }}>Cien años de soledad</div>
    </div>
    <PawnSlip x={1440} y={70} at={-100} num="1344" label="Batidora" rot={6} frame={0} scale={1.15} />
    <Butterfly x={1860} y={560} size={80} seed="tb1" glow={0.8} flap={0.3} rot={-10} />
  </AbsoluteFill>
);
