import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { clamp } from '../../lib/anim';
import { Halo, Layer, PaperFinish, Rig, Sky, useCamera } from './theatre';

// ————————————————————————————————————————————————————————————————
// v2 · Plano de detalle de la máquina de escribir: el rodillo en primer término y la cuartilla que sube.
// Como en una máquina de verdad, el punto de impacto está fijo (centro) y es el carro (el papel) el que se desplaza a la
// izquierda con cada letra; al acabar la línea, el carro vuelve (timbre) y el papel sube un renglón.
// `pages`: hojas sucesivas; cada una con sus líneas y el fotograma en que se arranca de la máquina (`yank`).
// ————————————————————————————————————————————————————————————————

export type TypedLine = { text: string; a: number; b: number; center?: boolean; size?: number };
export type TPage = { lines: TypedLine[]; yank?: number; from?: number };

const BASE = 64;
const ADV = 0.587; // avance de carácter de Special Elite (em)
const LH = 86;
const STRIKE_X = 960, STRIKE_Y = 690;

export const typedState = (lines: TypedLine[], frame: number) => {
  let cur = -1, chars = 0;
  lines.forEach((l, i) => {
    if (frame >= l.a) { cur = i; chars = Math.min(Array.from(l.text).length, Math.floor(interpolate(frame, [l.a, l.b], [0, Array.from(l.text).length], clamp)) + (frame >= l.a ? 1 : 0)); }
  });
  return { cur, chars };
};

const cw = (l: TypedLine) => (l.size ?? BASE) * ADV;
const lineStart = (l: TypedLine) => (l.center ? (Array.from(l.text).length * cw(l)) / -2 : -380);
const lineEnd = (l: TypedLine) => lineStart(l) + Array.from(l.text).length * cw(l);

const Sheet: React.FC<{ page: TPage; frame: number }> = ({ page, frame }) => {
  const L = page.lines;
  const { cur, chars } = typedState(L, frame);
  let caretX = lineStart(L[0]);
  let lineY = 0;
  if (cur >= 0) {
    caretX = lineStart(L[cur]) + chars * cw(L[cur]);
    lineY = cur;
    const n = L[cur + 1];
    if (n && frame >= n.a - 8) {
      const t = interpolate(frame, [n.a - 8, n.a], [0, 1], { ...clamp, easing: (u) => u * u * (3 - 2 * u) });
      caretX = lineEnd(L[cur]) + (lineStart(n) - lineEnd(L[cur])) * t;
      lineY = cur + t;
    }
  }
  const yank = page.yank !== undefined ? interpolate(frame, [page.yank, page.yank + 10], [0, 1], { ...clamp, easing: (t) => t * t }) : 0;
  return (
    <g transform={`translate(${STRIKE_X - caretX} ${-lineY * LH - yank * 1400})`}>
      <rect x={-520} y={STRIKE_Y - 700} width={1040} height={2300} fill="#F1E6CC" />
      <rect x={-520} y={STRIKE_Y - 700} width={1040} height={2300} fill="url(#tw-paper-shade)" />
      {L.map((l, i) => {
        if (frame < l.a) return null;
        const shown = i < cur ? Array.from(l.text).length : chars;
        return (
          <text key={i} x={lineStart(l)} y={STRIKE_Y + i * LH + 10} fontFamily='"Special Elite", monospace' fontSize={l.size ?? BASE} fill="#24201C" opacity={0.92} style={{ whiteSpace: 'pre' }}>
            {Array.from(l.text).slice(0, shown).join('')}
          </text>
        );
      })}
    </g>
  );
};

export const TypewriterCloseup: React.FC<{ pages: TPage[]; t0: number; t1: number; light?: number; children?: React.ReactNode }> = ({ pages, t0, t1, light = 1, children }) => {
  const frame = useCurrentFrame();
  const cam = useCamera([{ f: t0, x: 960, y: 560, s: 1.05 }, { f: t1, x: 960, y: 600, s: 1.14 }], 0.5);
  const active = pages.filter((p) => (p.from ?? -1e9) <= frame);
  // tipo que golpea: brazo que sube desde abajo cuando cambia el número de caracteres
  const page = active[active.length - 1];
  const { chars } = page ? typedState(page.lines, frame) : { chars: 0 };
  const { chars: prev } = page ? typedState(page.lines, frame - 2) : { chars: 0 };
  const strike = chars !== prev ? 1 : 0;
  return (
    <Rig cam={cam}>
      <Sky stops={[[0, '#2A1A0E'], [100, '#120A05']]} glows={[{ x: 1200, y: 200, r: 1100, c: '#FFC27A', a: 0.4 * light }]} />
      <Layer z={1}>
        <defs>
          <linearGradient id="tw-paper-shade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#000" stopOpacity={0} />
            <stop offset="0.25" stopColor="#000" stopOpacity={0} />
            <stop offset="0.45" stopColor="#5A3A1E" stopOpacity={0.18} />
          </linearGradient>
        </defs>
        {active.map((p, i) => <Sheet key={i} page={p} frame={frame} />)}
        {/* guía del papel y rodillo */}
        <rect x={0} y={STRIKE_Y + 24} width={1920} height={14} fill="#1A120C" opacity={0.85} />
        <rect x={-100} y={STRIKE_Y + 38} width={2120} height={150} rx={60} fill="#0E0906" />
        <rect x={-100} y={STRIKE_Y + 52} width={2120} height={18} fill="#2E2118" opacity={0.8} />
        <circle cx={70} cy={STRIKE_Y + 113} r={78} fill="#0A0604" />
        <circle cx={1850} cy={STRIKE_Y + 113} r={78} fill="#0A0604" />
        {/* tipos */}
        <g transform={`translate(${STRIKE_X} ${STRIKE_Y + 40}) rotate(${strike ? 0 : 50})`} opacity={0.95}>
          <rect x={-6} y={0} width={12} height={320} fill="#0A0604" />
          <rect x={-12} y={-4} width={24} height={16} fill="#0A0604" />
        </g>
        <rect x={0} y={STRIKE_Y + 188} width={1920} height={400} fill="#0A0604" />
        {/* barra del papel con sus rodillos, guía de la cinta y cesta de tipos */}
        <rect x={340} y={STRIKE_Y - 150} width={1240} height={10} rx={5} fill="#0E0906" opacity={0.9} />
        <rect x={640} y={STRIKE_Y - 158} width={34} height={26} rx={8} fill="#0E0906" />
        <rect x={1246} y={STRIKE_Y - 158} width={34} height={26} rx={8} fill="#0E0906" />
        <path d={`M ${STRIKE_X - 34} ${STRIKE_Y + 34} L ${STRIKE_X - 22} ${STRIKE_Y - 8} L ${STRIKE_X + 22} ${STRIKE_Y - 8} L ${STRIKE_X + 34} ${STRIKE_Y + 34} Z`} fill="#0E0906" />
        <rect x={STRIKE_X - 18} y={STRIKE_Y - 4} width={36} height={12} fill="#6E1E1A" />
        <path d={`M ${STRIKE_X - 520} ${STRIKE_Y + 600} A 520 420 0 0 1 ${STRIKE_X + 520} ${STRIKE_Y + 600} Z`} fill="#050302" />
        {Array.from({ length: 21 }).map((_, i) => {
          const a = (-60 + i * 6) * Math.PI / 180;
          return <line key={i} x1={STRIKE_X + Math.sin(a) * 120} y1={STRIKE_Y + 560 - Math.cos(a) * 120} x2={STRIKE_X + Math.sin(a) * 470} y2={STRIKE_Y + 560 - Math.cos(a) * 380} stroke="#1C140E" strokeWidth={6} />;
        })}
        <Halo x={STRIKE_X} y={STRIKE_Y} r={120} c="#FFE2A8" a={0.12} />
        {children}
      </Layer>
      <PaperFinish opacity={0.45} vignette={0.62} warm={0.6} />
    </Rig>
  );
};
