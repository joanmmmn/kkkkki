import React from 'react';
import MAP from '../../../public/eb/map/ccaa.json';
import { E } from './kit';

// ---------------------------------------------------------------------------------------------------------------
// Mapa de España por comunidades (es-atlas, IGN; tools/eb_map.mjs). Lienzo de 1600×1200 con Canarias junto a la
// península. Los hijos (`children`) se dibujan encima, en coordenadas del lienzo.
// ---------------------------------------------------------------------------------------------------------------
export type Region = { id: string; name: string; d: string; c: [number, number]; box: [number, number, number, number]; area: number };
export const REGIONS = (MAP as unknown as { regions: Region[] }).regions;
export const OUTLINE = (MAP as unknown as { outline: string }).outline;
export const CANARY = (MAP as unknown as { canaryBorder: string }).canaryBorder;
export const region = (name: string) => REGIONS.find((r) => r.name === name)!;
// Sin eBiblio: tienen su propio servicio
export const OWN: Record<string, string> = { 'Cataluña': 'Biblio Digital', 'País Vasco': 'eLiburutegia' };
// Centro visual de cada comunidad (algunos centroides caen mal: islas, ciudades autónomas, formas alargadas)
export const CENTER: Record<string, [number, number]> = {
  Canarias: [300, 1040], 'Illes Balears': [1440, 470], Ceuta: [779, 897], Melilla: [994, 960], Galicia: [592, 170], Andalucía: [850, 735],
};
export const centerOf = (r: Region): [number, number] => CENTER[r.name] ?? r.c;

export const SpainMap: React.FC<{
  w: number; fill: (r: Region, i: number) => string; reveal?: (r: Region, i: number) => number; stroke?: string; strokeW?: number;
  style?: React.CSSProperties; children?: React.ReactNode; canary?: boolean; hatch?: (r: Region) => number; lift?: (r: Region) => number;
}> = ({ w, fill, reveal, stroke = E.paper, strokeW = 3, style, children, canary = true, hatch, lift }) => {
  const k = w / 1600;
  return (
    <div style={{ position: 'relative', width: w, height: 1200 * k, ...style }}>
      <svg width={w} height={1200 * k} viewBox="0 0 1600 1200" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs>
          <pattern id="eb-hatch" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="16" height="16" fill="#E6DED3" />
            <rect width="7" height="16" fill="#CFC4B6" />
          </pattern>
        </defs>
        {REGIONS.map((r, i) => {
          const p = reveal ? reveal(r, i) : 1;
          if (p <= 0.001) return null;
          const [cx, cy] = centerOf(r);
          const s = 0.6 + 0.4 * Math.min(1.08, p);
          const up = lift ? lift(r) : 0;
          return (
            <g key={r.id} transform={`translate(${cx} ${cy - up}) scale(${s}) translate(${-cx} ${-cy})`} opacity={Math.min(1, p * 2)}>
              {up > 0 && <path d={r.d} fill="rgba(15,21,33,0.18)" transform={`translate(0 ${up})`} />}
              <path d={r.d} fill={fill(r, i)} stroke={stroke} strokeWidth={strokeW / Math.max(0.5, s)} strokeLinejoin="round" />
              {hatch && hatch(r) > 0 && <path d={r.d} fill="url(#eb-hatch)" opacity={hatch(r)} stroke={stroke} strokeWidth={strokeW} />}
            </g>
          );
        })}
        {canary && <path d={CANARY} fill="none" stroke={E.inkFaint} strokeWidth={2.5} strokeDasharray="10 8" opacity={0.7} />}
      </svg>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1600, height: 1200, transform: `scale(${k})`, transformOrigin: '0 0' }}>{children}</div>
    </div>
  );
};
