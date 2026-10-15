import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { E, Stip, sway } from './kit';
import { LOOKS, Person, Plant, Spines } from './props';

// ---------------------------------------------------------------------------------------------------------------
// Escenarios del mundo «la puerta»
// ---------------------------------------------------------------------------------------------------------------

// Ventanal en arco con luz de día
export const ArchWindow: React.FC<{ w: number; h: number; frame?: string; style?: React.CSSProperties }> = ({ w, h, frame = E.paper, style }) => (
  <div style={{ position: 'relative', width: w, height: h, borderRadius: `${w / 2}px ${w / 2}px 6px 6px`, background: frame, padding: 14, boxSizing: 'border-box', ...style }}>
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: `${w / 2 - 14}px ${w / 2 - 14}px 2px 2px`, overflow: 'hidden', background: 'linear-gradient(180deg, #FFF3D6 0%, #FCE3B8 60%, #F7D2A0 100%)' }}>
      <div style={{ position: 'absolute', left: '-20%', bottom: -h * 0.12, width: '80%', height: h * 0.35, borderRadius: '50%', background: E.oliveLight, opacity: 0.55 }} />
      <div style={{ position: 'absolute', right: '-25%', bottom: -h * 0.16, width: '90%', height: h * 0.4, borderRadius: '50%', background: E.oliveMid, opacity: 0.45 }} />
      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 10, marginLeft: -5, background: frame }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: '58%', height: 10, background: frame }} />
    </div>
  </div>
);

// Lámpara colgante
export const Lamp: React.FC<{ x: number; len: number; shade?: string; seed?: number; on?: number }> = ({ x, len, shade = E.plum, seed = 0, on = 1 }) => {
  const frame = useCurrentFrame();
  const r = sway(frame, seed, 1.2, 0.03);
  return (
    <div style={{ position: 'absolute', left: x, top: -10, width: 0, height: 0, transformOrigin: '0 0', transform: `rotate(${r}deg)` }}>
      <div style={{ position: 'absolute', left: -2, top: 0, width: 4, height: len, background: E.ink2 }} />
      <div style={{ position: 'absolute', left: -150, top: len - 20, width: 300, height: 260, background: `radial-gradient(closest-side, rgba(255,236,190,${0.55 * on}), rgba(255,236,190,0))` }} />
      <svg style={{ position: 'absolute', left: -60, top: len - 6, overflow: 'visible' }} width="120" height="70" viewBox="0 0 120 70">
        <path d="M10 66 Q14 8 60 6 Q106 8 110 66 Z" fill={shade} />
        <path d="M60 6 Q106 8 110 66 L84 66 Q84 18 60 6 Z" fill="rgba(15,21,33,0.18)" />
        <ellipse cx="60" cy="66" rx="22" ry="8" fill={`rgba(255,240,200,${0.9 * on + 0.1})`} />
      </svg>
    </div>
  );
};

// Libro gigante abierto como una tienda de campaña (como en las ilustraciones de eBiblio): tapas por fuera, el canto
// de las hojas por dentro y la entrada en sombra
export const TentBook: React.FC<{ w: number; h: number; cover?: string; style?: React.CSSProperties }> = ({ w, h, cover = E.coral, style }) => (
  <svg width={w} height={h} viewBox="0 0 400 300" preserveAspectRatio="none" style={{ overflow: 'visible', ...style }}>
    {/* tapas */}
    <path d="M200 0 L0 300 L36 300 L200 34 Z" fill={cover} />
    <path d="M200 0 L400 300 L364 300 L200 34 Z" fill={cover} />
    <path d="M200 0 L400 300 L364 300 L200 34 Z" fill="rgba(15,21,33,0.22)" />
    {/* hojas */}
    <path d="M200 30 L40 300 L360 300 Z" fill={E.paper} />
    {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M200 ${36 + i * 6} L${52 + i * 12} 300`} stroke="rgba(15,21,33,0.13)" strokeWidth="2" />)}
    {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M200 ${36 + i * 6} L${348 - i * 12} 300`} stroke="rgba(15,21,33,0.13)" strokeWidth="2" />)}
    {/* entrada */}
    <path d="M200 92 L112 300 L288 300 Z" fill={E.plumDeep} />
    <path d="M200 92 L288 300 L240 300 Z" fill="rgba(15,21,33,0.25)" />
  </svg>
);

// La sala de la biblioteca (interior luminoso). Composición de 1920×1080; `hot` resalta tres lomos de la balda izquierda.
export const LibraryHall: React.FC<{ people?: boolean; signs?: React.ReactNode; children?: React.ReactNode }> = ({ people = true, signs, children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: 'visible' }}>
      <div style={{ position: 'absolute', left: -1400, right: -1400, top: -900, bottom: -900, background: E.bone }}>
        <div style={{ position: 'absolute', left: 1400 - 700, top: 900 - 400, width: 1920 + 1400, height: 1080 + 800 }}><Stip kind="r" o={0.14} /></div>
      </div>
      {/* ventanales */}
      <div style={{ position: 'absolute', left: 600, top: 150 }}><ArchWindow w={250} h={520} /></div>
      <div style={{ position: 'absolute', left: 1070, top: 150 }}><ArchWindow w={250} h={520} /></div>
      {/* suelo */}
      <div style={{ position: 'absolute', left: -1400, right: -1400, top: 860, bottom: -900, background: E.coralPale }}>
        <Stip kind="v" o={0.16} />
      </div>
      <div style={{ position: 'absolute', left: -1400, right: -1400, top: 846, height: 16, background: E.boneDeep }} />
      {/* estanterías */}
      {[{ x: 40, seed: 3 }, { x: 1400, seed: 8 }].map((b, i) => (
        <div key={i} style={{ position: 'absolute', left: b.x, top: 250, width: 480, height: 600, background: E.plum, borderRadius: '10px 10px 0 0', padding: '20px 18px 0', boxSizing: 'border-box' }}>
          <Stip kind="h" flip o={0.2} />
          {[0, 1, 2].map((r) => (
            <div key={r} style={{ position: 'relative', background: E.plumDeep, height: 180, marginBottom: 6, borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: 8, bottom: 0 }}><Spines w={428} h={160} seed={b.seed * 10 + r} plank={E.plumDeep} /></div>
            </div>
          ))}
        </div>
      ))}
      {signs}
      {/* libro-tienda con alfombra */}
      <div style={{ position: 'absolute', left: 620, top: 905, width: 680, height: 90, borderRadius: '50%', background: E.mustardLight }} />
      <div style={{ position: 'absolute', left: 700, top: 560 }}><TentBook w={520} h={330} /></div>
      {/* plantas */}
      <div style={{ position: 'absolute', left: 480, top: 470 }}><Plant size={260} pot={E.mustard} seed={2} /></div>
      <div style={{ position: 'absolute', left: 1240, top: 500 }}><Plant size={230} pot={E.pink} seed={5} /></div>
      {/* lámparas */}
      <Lamp x={725} len={110} seed={1} />
      <Lamp x={1195} len={140} shade={E.coral} seed={2} />
      {people && (
        <>
          <div style={{ position: 'absolute', left: 908, top: 676 }}><Person look={LOOKS[0]} size={210} bob={Math.sin(frame * 0.08) * 1.5} /></div>
          <div style={{ position: 'absolute', left: 300, top: 470 }}><Person look={LOOKS[3]} size={400} reach={0.55 + 0.1 * Math.sin(frame * 0.05)} /></div>
        </>
      )}
      {children}
    </AbsoluteFill>
  );
};

// Bolsillo trasero de vaquero (con dobladillo, pespuntes y remaches). La boca del bolsillo es el borde de arriba.
export const Pocket: React.FC<{ w: number; color?: string; stitch?: string; style?: React.CSSProperties }> = ({ w, color = E.violet, stitch = E.mustardLight, style }) => {
  const h = w * 1.05;
  return (
    <svg width={w} height={h} viewBox="0 0 100 105" style={{ overflow: 'visible', ...style }}>
      <path d="M0 0 H100 V74 L50 104 L0 74 Z" fill={color} />
      <path d="M0 0 H100 V74 L50 104 L0 74 Z" fill="url(#none)" />
      <rect x="0" y="0" width="100" height="13" fill="rgba(15,21,33,0.14)" />
      <path d="M4 4.5 H96 M4 9 H96" stroke={stitch} strokeWidth="0.9" strokeDasharray="2.4 1.6" />
      <path d="M5 16 H95 V71 L50 98 L5 71 Z" fill="none" stroke={stitch} strokeWidth="0.9" strokeDasharray="2.4 1.6" />
      <path d="M8 19 H92 V69 L50 94 L8 69 Z" fill="none" stroke={stitch} strokeWidth="0.9" strokeDasharray="2.4 1.6" opacity="0.8" />
      <path d="M22 44 Q50 60 78 44" fill="none" stroke={stitch} strokeWidth="0.9" strokeDasharray="2.4 1.6" />
      <circle cx="4" cy="4" r="2.6" fill={E.mustard} /><circle cx="96" cy="4" r="2.6" fill={E.mustard} />
    </svg>
  );
};

// Edificio de biblioteca pública (fachada plana con puerta en arco y rótulo)
export const LibraryBuilding: React.FC<{ w?: number; wall?: string; roof?: string; sign?: string; glow?: number; style?: React.CSSProperties }> = ({ w = 520, wall = E.coral, roof = E.plum, sign = 'Biblioteca', glow = 0, style }) => {
  const k = w / 520;
  return (
    <div style={{ position: 'relative', width: w, height: 440 * k, ...style }}>
      <svg width={w} height={440 * k} viewBox="0 0 520 440" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <rect x="10" y="40" width="500" height="34" rx="6" fill={roof} />
        <rect x="30" y="74" width="460" height="366" fill={wall} />
        <rect x="380" y="74" width="110" height="366" fill="rgba(15,21,33,0.12)" />
        {/* ventanas */}
        {[60, 380].map((x) => <rect key={x} x={x} y="150" width="80" height="120" rx="40" fill={E.sky} />)}
        {[60, 380].map((x) => <rect key={`m${x}`} x={x + 37} y="150" width="6" height="120" fill={wall} />)}
        {/* puerta en arco */}
        <path d="M200 440 V300 Q200 230 260 230 Q320 230 320 300 V440 Z" fill={E.plumDeep} />
        <path d="M212 440 V302 Q212 244 260 244 Q308 244 308 302 V440 Z" fill={glow > 0 ? `rgba(255,236,190,${0.5 + 0.5 * glow})` : E.plum} />
        {/* escalones */}
        <rect x="170" y="430" width="180" height="10" fill={E.boneDeep} />
        {/* rótulo */}
        <rect x="140" y="96" width="240" height="56" rx="10" fill={E.paper} />
      </svg>
      <div style={{ position: 'absolute', left: 140 * k, top: 96 * k, width: 240 * k, height: 56 * k, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: E.font, fontWeight: 700, fontSize: 30 * k, color: E.ink }}>{sign}</div>
    </div>
  );
};

// Edificio institucional (frontón y columnas)
export const Ministry: React.FC<{ w?: number; color?: string; style?: React.CSSProperties }> = ({ w = 300, color = E.plum, style }) => (
  <svg width={w} height={w * 0.8} viewBox="0 0 300 240" style={{ overflow: 'visible', ...style }}>
    <path d="M150 10 L290 70 L10 70 Z" fill={color} />
    <rect x="20" y="70" width="260" height="18" fill={color} />
    {[40, 90, 140, 190, 240].map((x) => <rect key={x} x={x} y="92" width="22" height="118" rx="4" fill={E.paper} />)}
    {[40, 90, 140, 190, 240].map((x) => <rect key={`s${x}`} x={x + 14} y="92" width="8" height="118" fill="rgba(15,21,33,0.14)" />)}
    <rect x="10" y="210" width="280" height="16" fill={color} />
    <rect x="0" y="226" width="300" height="14" fill={E.boneDeep} />
    <circle cx="150" cy="48" r="10" fill={E.mustard} />
  </svg>
);

// Moneda (€)
export const Coin: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 70, style }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', background: E.mustard, boxShadow: `inset -${size * 0.08}px -${size * 0.08}px 0 ${E.mustardDeep}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: E.font, fontWeight: 800, fontSize: size * 0.5, color: E.ink, ...style }}>€</div>
);
