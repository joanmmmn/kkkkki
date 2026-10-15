import React from 'react';
import { useCurrentFrame } from 'remotion';
import { clamp01, E, rnd, Stip, sway } from './kit';

// ---------------------------------------------------------------------------------------------------------------
// Objetos ilustrados del mundo «la puerta»: formas planas con punteado, sin contornos (como las ilustraciones de la
// identidad de eBiblio). Todo es SVG o divs: se ve nítido a cualquier escala.
// ---------------------------------------------------------------------------------------------------------------

// Puerta en su marco. `open` 0 → cerrada, 1 → abierta hacia dentro (unos 100°). Por el hueco se ve `inside` (por defecto,
// luz cálida). La hoja gira sobre la bisagra izquierda con perspectiva propia y se oscurece al girar.
export const Door: React.FC<{
  w: number; h: number; leaf?: string; casing?: string; casingW?: number; open?: number; plate?: React.ReactNode; inside?: React.ReactNode;
  knob?: string; persp?: number; panels?: boolean; style?: React.CSSProperties; maxAngle?: number; glow?: number; hollow?: boolean;
}> = ({ w, h, leaf = E.plum, casing = E.paper, casingW = 26, open = 0, plate, inside, knob = E.mustard, persp = 1800, panels = true, style, maxAngle = 104, glow = 1, hollow }) => {
  const a = open * maxAngle;
  const W = w + casingW * 2, H = h + casingW;
  const shade = clamp01(open * 1.4) * 0.38;
  return (
    <div style={{ position: 'relative', width: W, height: H, ...style }}>
      {/* marco: tres listones (el hueco queda libre: por él se ve lo que haya detrás) */}
      {[[0, 0, casingW, H], [W - casingW, 0, casingW, H], [0, 0, W, casingW]].map(([x, y, ww, hh], i) => (
        <div key={i} style={{ position: 'absolute', left: x, top: y, width: ww, height: hh, background: casing, borderRadius: i === 2 ? `${casingW * 0.6}px ${casingW * 0.6}px 0 0` : undefined, overflow: 'hidden' }}>
          <Stip kind="h" flip={i !== 1} o={0.16} />
        </div>
      ))}
      {/* hueco: lo que hay detrás de la puerta (con `hollow`, nada: se ve lo que haya debajo) */}
      <div style={{ position: 'absolute', left: casingW, top: casingW, width: w, height: h, overflow: 'hidden', background: hollow ? undefined : '#FFF4DC' }}>
        {hollow ? null : inside ?? (
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(90% 70% at 50% 45%, #FFFBF0 0%, #FBE7C2 55%, #F2C98F 100%)` }} />
        )}
        {/* sombra de la hoja en el hueco */}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, rgba(15,21,33,${0.22 * clamp01(open * 2)}) 0%, rgba(15,21,33,0) 30%)` }} />
      </div>
      {/* hoja: gira hacia dentro sobre la bisagra izquierda; la perspectiva mira al centro del hueco */}
      <div style={{ position: 'absolute', left: casingW, top: casingW, width: w, height: h, perspective: persp, perspectiveOrigin: '50% 50%', pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, transformOrigin: '0% 50%', transform: `rotateY(${a}deg)`, transformStyle: 'preserve-3d' }}>
          <div style={{ position: 'absolute', inset: 0, background: leaf, backfaceVisibility: 'hidden' }}>
            {panels && (
              <>
                <div style={{ position: 'absolute', left: w * 0.14, right: w * 0.14, top: h * 0.07, height: h * 0.44, borderRadius: w * 0.04, background: 'rgba(15,21,33,0.13)' }} />
                <div style={{ position: 'absolute', left: w * 0.14, right: w * 0.14, top: h * 0.56, height: h * 0.37, borderRadius: w * 0.04, background: 'rgba(15,21,33,0.13)' }} />
                <div style={{ position: 'absolute', left: w * 0.14 + 4, right: w * 0.14, top: h * 0.07 + 4, height: h * 0.44 - 4, borderRadius: w * 0.04, background: leaf }} />
                <div style={{ position: 'absolute', left: w * 0.14 + 4, right: w * 0.14, top: h * 0.56 + 4, height: h * 0.37 - 4, borderRadius: w * 0.04, background: leaf }} />
              </>
            )}
            <Stip kind="h" flip o={0.22} />
            <div style={{ position: 'absolute', right: w * 0.075, top: h * 0.52 - w * 0.045, width: w * 0.09, height: w * 0.09, borderRadius: '50%', background: knob, boxShadow: `inset -${w * 0.012}px -${w * 0.012}px 0 rgba(15,21,33,0.25)` }} />
            {plate && <div style={{ position: 'absolute', left: 0, right: 0, top: h * 0.17, display: 'flex', justifyContent: 'center' }}>{plate}</div>}
            <div style={{ position: 'absolute', inset: 0, background: E.ink, opacity: shade }} />
          </div>
          {/* canto */}
          <div style={{ position: 'absolute', right: 0, top: 0, width: 24, height: h, transformOrigin: '100% 50%', transform: 'rotateY(-90deg)', background: leaf, filter: 'brightness(0.7)' }} />
        </div>
      </div>
      {/* luz que se derrama por el suelo al abrir */}
      {glow > 0 && open > 0.02 && (
        <div style={{ position: 'absolute', left: casingW, top: H, width: w, height: h * 0.5, transformOrigin: '50% 0%', transform: `perspective(600px) rotateX(62deg) scaleX(${1 + open * 0.5})`, opacity: clamp01(open * 1.6) * 0.85 * glow,
          background: 'linear-gradient(180deg, rgba(255,240,205,0.95) 0%, rgba(255,240,205,0) 100%)', pointerEvents: 'none' }} />
      )}
    </div>
  );
};

// Placa de número de puerta (mostaza, con tornillos)
export const Plate: React.FC<{ text: string; size?: number; bg?: string; color?: string }> = ({ text, size = 70, bg = E.mustard, color = E.ink }) => (
  <div style={{ position: 'relative', minWidth: size * 1.2, height: size * 1.25, padding: `0 ${size * 0.28}px`, borderRadius: size * 0.2, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: E.font, fontWeight: 700, fontSize: size, color, letterSpacing: '0.02em', boxShadow: `inset 0 -${size * 0.06}px 0 rgba(15,21,33,0.18)` }}>
    <div style={{ position: 'absolute', left: size * 0.12, top: size * 0.12, width: size * 0.09, height: size * 0.09, borderRadius: '50%', background: 'rgba(15,21,33,0.35)' }} />
    <div style={{ position: 'absolute', right: size * 0.12, bottom: size * 0.12, width: size * 0.09, height: size * 0.09, borderRadius: '50%', background: 'rgba(15,21,33,0.35)' }} />
    <span style={{ marginTop: size * 0.08 }}>{text}</span>
  </div>
);

// Planta de hojas grandes en maceta, con balanceo suave
const LEAVES = [
  { a: -58, l: 0.95, c: 0 }, { a: -28, l: 1.15, c: 1 }, { a: -6, l: 1.3, c: 0 }, { a: 18, l: 1.12, c: 1 }, { a: 44, l: 0.98, c: 0 }, { a: 66, l: 0.78, c: 1 },
];
export const Plant: React.FC<{ size?: number; pot?: string; leaf?: string; leaf2?: string; seed?: number; style?: React.CSSProperties }> = ({ size = 300, pot = E.coral, leaf = E.olive, leaf2 = E.oliveMid, seed = 1, style }) => {
  const frame = useCurrentFrame();
  const s = size / 300;
  return (
    <svg width={300 * s} height={420 * s} viewBox="0 0 300 420" style={{ overflow: 'visible', ...style }}>
      {LEAVES.map((L, i) => {
        const a = L.a + sway(frame, seed * 10 + i, 2.2, 0.04 + i * 0.004);
        const len = 170 * L.l;
        return (
          <g key={i} transform={`translate(150 300) rotate(${a})`}>
            <path d={`M0 0 L0 ${-len * 0.55}`} stroke={E.oliveMid} strokeWidth={5} />
            <path d={`M0 ${-len * 0.45} C ${-len * 0.42} ${-len * 0.6}, ${-len * 0.32} ${-len * 1.02}, 0 ${-len * 1.1} C ${len * 0.32} ${-len * 1.02}, ${len * 0.42} ${-len * 0.6}, 0 ${-len * 0.45} Z`} fill={L.c ? leaf2 : leaf} />
            <path d={`M0 ${-len * 0.48} L0 ${-len * 1.02}`} stroke="rgba(255,255,255,0.22)" strokeWidth={3} />
          </g>
        );
      })}
      {/* maceta */}
      <path d="M92 296 L208 296 L194 410 Q150 418 106 410 Z" fill={pot} />
      <rect x="84" y="284" width="132" height="26" rx="6" fill={pot} />
      <rect x="84" y="303" width="132" height="7" fill="rgba(15,21,33,0.16)" />
      <path d="M180 312 L194 410 Q182 414 168 415 L172 312 Z" fill="rgba(15,21,33,0.14)" />
    </svg>
  );
};

// Lomos de libros en una balda (deterministas por semilla)
export const PALETTE_BOOKS = [E.coral, E.plum, E.mustard, E.pink, E.olive, E.violet, E.coralLight, E.oliveMid, E.pinkDeep, E.bone];
export const Spines: React.FC<{ w: number; h?: number; seed?: number; plank?: string; colors?: string[]; lean?: boolean; style?: React.CSSProperties; light?: number }> = ({ w, h = 230, seed = 1, plank = E.plum, colors = PALETTE_BOOKS, lean = true, style, light = 0 }) => {
  const books: { x: number; bw: number; bh: number; c: string; band: number; tilt: number }[] = [];
  let x = 6, i = 0;
  while (x < w - 40) {
    const r = rnd(seed * 97 + i * 13);
    const bw = 26 + Math.floor(rnd(seed * 31 + i * 7) * 34);
    const bh = h * (0.62 + rnd(seed * 17 + i * 5) * 0.36);
    const tilt = lean && r > 0.9 && x < w - 120 ? 9 : 0;
    books.push({ x, bw, bh, c: colors[Math.floor(rnd(seed * 53 + i * 3) * colors.length)], band: rnd(seed * 71 + i * 11), tilt });
    x += bw + (tilt ? 18 : 3);
    i++;
  }
  return (
    <div style={{ position: 'relative', width: w, height: h + 22, ...style }}>
      {books.map((b, k) => (
        <div key={k} style={{ position: 'absolute', left: b.x, bottom: 22, width: b.bw, height: b.bh, background: b.c, borderRadius: '3px 3px 1px 1px', transformOrigin: '0% 100%', transform: b.tilt ? `rotate(${b.tilt}deg)` : undefined, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: b.bh * (0.12 + b.band * 0.1), height: 6, background: 'rgba(255,255,255,0.35)' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: b.bh * 0.14, height: 4, background: 'rgba(15,21,33,0.2)' }} />
          <Stip kind="h" flip o={0.18} />
        </div>
      ))}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 22, background: plank, borderRadius: 3 }}>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 7, background: 'rgba(15,21,33,0.22)' }} />
      </div>
      {light > 0 && <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,250,235,1)', opacity: light, mixBlendMode: 'screen' }} />}
    </div>
  );
};

// Persona plana (sin rasgos, con auriculares opcionales). Mide unos 520 px a escala 1 (viewBox 200×520).
// walk: fase de la zancada (0 = quieta); reach: brazo derecho hacia delante (0..1); hair: 0 corto, 1 moño, 2 melena, 3 rizos.
export type PersonLook = { skin: string; hair: string; hairStyle: 0 | 1 | 2 | 3; top: string; legs: string; shoes?: string; phones?: string };
export const LOOKS: PersonLook[] = [
  { skin: '#E9C9AE', hair: E.ink, hairStyle: 1, top: E.coral, legs: E.plum, phones: E.pink },
  { skin: '#B9805C', hair: E.ink, hairStyle: 0, top: E.mustard, legs: E.olive },
  { skin: '#F1D6C1', hair: '#7A4B2A', hairStyle: 2, top: E.violet, legs: E.ink2, phones: E.mustard },
  { skin: '#8E5B3E', hair: E.ink, hairStyle: 3, top: E.pink, legs: E.plumDeep },
  { skin: '#E3B996', hair: '#3B2A22', hairStyle: 0, top: E.olive, legs: E.coralDeep, phones: E.coral },
  { skin: '#F3DCC8', hair: '#C9A15A', hairStyle: 2, top: E.lilac, legs: E.olive },
];
export const Person: React.FC<{ look: PersonLook; size?: number; walk?: number; reach?: number; flip?: boolean; style?: React.CSSProperties; bob?: number; hold?: React.ReactNode }> = ({ look, size = 520, walk = 0, reach = 0, flip, style, bob = 0, hold }) => {
  const k = size / 520;
  const sw = Math.sin(walk * Math.PI * 2);
  const legA = sw * 16, legB = -sw * 16;
  const armL = -sw * 14;
  const armR = sw * 14 * (1 - reach) - reach * 72;
  const by = -Math.abs(Math.cos(walk * Math.PI * 2)) * 6 * (walk ? 1 : 0) + bob;
  const shoes = look.shoes ?? E.ink;
  return (
    <div style={{ position: 'relative', width: 200 * k, height: 520 * k, transform: flip ? 'scaleX(-1)' : undefined, ...style }}>
      <svg width={200 * k} height={520 * k} viewBox="0 0 200 520" style={{ overflow: 'visible', position: 'absolute', left: 0, top: 0 }}>
        <g transform={`translate(0 ${by})`}>
          {/* piernas */}
          <g transform={`rotate(${legB} 100 318)`}>
            <path d="M84 312 L116 312 L112 494 L92 494 Z" fill={look.legs} />
            <path d="M84 312 L116 312 L112 494 L92 494 Z" fill="rgba(15,21,33,0.18)" />
            <ellipse cx="104" cy="498" rx="22" ry="10" fill={shoes} />
          </g>
          <g transform={`rotate(${legA} 100 318)`}>
            <path d="M84 312 L116 312 L110 494 L90 494 Z" fill={look.legs} />
            <ellipse cx="102" cy="498" rx="22" ry="10" fill={shoes} />
          </g>
          {/* brazo izquierdo (detrás) */}
          <g transform={`rotate(${armL} 100 182)`}>
            <rect x="88" y="176" width="24" height="132" rx="12" fill={look.top} />
            <rect x="88" y="176" width="24" height="132" rx="12" fill="rgba(15,21,33,0.22)" />
            <circle cx="100" cy="306" r="12" fill={look.skin} />
          </g>
          {/* cuerpo */}
          <path d="M70 182 Q100 166 130 182 L138 322 Q100 332 62 322 Z" fill={look.top} />
          <path d="M118 178 Q126 182 130 182 L138 322 Q128 325 118 326 Z" fill="rgba(15,21,33,0.14)" />
          {/* cuello y cabeza */}
          <rect x="91" y="146" width="18" height="30" rx="6" fill={look.skin} />
          <circle cx="100" cy="120" r="34" fill={look.skin} />
          <path d="M100 86 a34 34 0 0 1 22 60 a34 34 0 0 0 -22 -60 Z" fill="rgba(15,21,33,0.12)" />
          {look.hairStyle === 0 && <path d="M66 118 Q64 80 100 80 Q138 80 134 114 Q122 98 98 100 Q78 100 66 118 Z" fill={look.hair} />}
          {look.hairStyle === 1 && <>
            <circle cx="104" cy="76" r="19" fill={look.hair} />
            <path d="M66 122 Q62 84 100 82 Q140 82 135 120 Q124 100 100 101 Q76 101 66 122 Z" fill={look.hair} />
          </>}
          {look.hairStyle === 2 && <path d="M64 168 Q56 84 100 82 Q144 84 138 168 L122 168 Q130 120 118 106 Q100 100 84 108 Q74 130 80 168 Z" fill={look.hair} />}
          {look.hairStyle === 3 && <>
            {[[-26, -18], [-8, -28], [12, -28], [28, -16], [-32, 2], [32, 2]].map(([dx, dy], i) => <circle key={i} cx={100 + dx} cy={112 + dy} r="16" fill={look.hair} />)}
          </>}
          {look.phones && <>
            <path d="M66 116 Q64 74 100 74 Q136 74 134 116" fill="none" stroke={look.phones} strokeWidth="7" strokeLinecap="round" />
            <rect x="124" y="104" width="18" height="30" rx="8" fill={look.phones} />
            <rect x="58" y="104" width="18" height="30" rx="8" fill={look.phones} />
          </>}
          {/* brazo derecho (delante) */}
          <g transform={`rotate(${armR} 100 182)`}>
            <rect x="88" y="176" width="24" height="132" rx="12" fill={look.top} />
            <circle cx="100" cy="306" r="12" fill={look.skin} />
            {hold && <foreignObject x="70" y="290" width="80" height="120">{hold}</foreignObject>}
          </g>
        </g>
      </svg>
    </div>
  );
};

// Móvil plano: carcasa de tinta y pantalla con `children` (pantalla de 360×780 dp, escalada al ancho `w`)
export const Phone: React.FC<{ w: number; children?: React.ReactNode; body?: string; style?: React.CSSProperties; screenBg?: string }> = ({ w, children, body = E.ink2, style, screenBg = '#fff' }) => {
  const k = w / 400;
  const sw = 360, sh = 780;
  const sc = (w - 40 * k) / sw;
  return (
    <div style={{ position: 'relative', width: w, height: (sh * sc) + 40 * k, borderRadius: 58 * k, background: body, ...style }}>
      <Stip kind="h" flip o={0.25} />
      <div style={{ position: 'absolute', left: 20 * k, top: 20 * k, width: sw * sc, height: sh * sc, borderRadius: 40 * k, overflow: 'hidden', background: screenBg }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: sw, height: sh, transform: `scale(${sc})`, transformOrigin: '0 0' }}>{children}</div>
      </div>
      <div style={{ position: 'absolute', left: '50%', top: 30 * k, width: 14 * k, height: 14 * k, marginLeft: -7 * k, borderRadius: '50%', background: '#000', opacity: 0.85 }} />
      <div style={{ position: 'absolute', right: -6 * k, top: 170 * k, width: 8 * k, height: 90 * k, borderRadius: 4 * k, background: body }} />
    </div>
  );
};

// Portátil plano: tapa con marco y pantalla de 1280×720 px CSS (escalada al ancho de pantalla `sw`), base debajo
export const Laptop: React.FC<{ sw: number; children?: React.ReactNode; lid?: string; base?: string; style?: React.CSSProperties }> = ({ sw, children, lid = E.ink2, base = '#C9C1D6', style }) => {
  const sh = (sw * 720) / 1280;
  const bz = sw * 0.028;
  return (
    <div style={{ position: 'relative', width: sw + bz * 2, height: sh + bz * 2 + sw * 0.05, ...style }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: sw + bz * 2, height: sh + bz * 2, borderRadius: bz * 1.2, background: lid }}>
        <div style={{ position: 'absolute', left: bz, top: bz, width: sw, height: sh, overflow: 'hidden', background: '#fff', borderRadius: bz * 0.25 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 1280, height: 720, transform: `scale(${sw / 1280})`, transformOrigin: '0 0' }}>{children}</div>
        </div>
      </div>
      {/* base */}
      <div style={{ position: 'absolute', left: -sw * 0.06, top: sh + bz * 2 - 2, width: sw * 1.12 + bz * 2, height: sw * 0.034, borderRadius: `0 0 ${sw * 0.03}px ${sw * 0.03}px`, background: base }}>
        <div style={{ position: 'absolute', left: '50%', top: 0, width: sw * 0.16, marginLeft: -sw * 0.08, height: sw * 0.012, borderRadius: `0 0 ${sw * 0.01}px ${sw * 0.01}px`, background: 'rgba(15,21,33,0.18)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '40%', background: 'rgba(15,21,33,0.14)', borderRadius: `0 0 ${sw * 0.03}px ${sw * 0.03}px` }} />
      </div>
    </div>
  );
};

// Mano que señala (cursor ilustrado): la yema del índice está en (0, 0)
export const Hand: React.FC<{ size?: number; press?: number; skin?: string; cuff?: string; style?: React.CSSProperties }> = ({ size = 120, press = 0, skin = '#F1D2BC', cuff = E.plum, style }) => {
  const k = size / 120;
  return (
    <svg width={120 * k} height={170 * k} viewBox="-30 -6 120 170" style={{ position: 'absolute', left: -30 * k, top: -6 * k, overflow: 'visible', transform: `scale(${1 - press * 0.08})`, transformOrigin: '30px 6px', ...style }}>
      <path d="M0 6 Q0 -2 8 -2 Q16 -2 16 6 L16 62 L22 58 Q30 54 34 62 L36 66 Q44 60 50 68 L52 72 Q60 66 66 74 L68 104 Q68 132 48 142 L14 142 Q-6 126 -14 98 L-22 74 Q-24 64 -14 64 Q-6 64 0 76 Z" fill={skin} />
      <path d="M16 62 L16 92 M34 66 L34 92 M50 72 L52 94" stroke="rgba(15,21,33,0.18)" strokeWidth="3" strokeLinecap="round" />
      <path d="M48 142 Q68 132 68 104 L68 96 Q60 120 40 132 Z" fill="rgba(15,21,33,0.12)" />
      <rect x="6" y="138" width="56" height="26" rx="6" fill={cuff} />
    </svg>
  );
};

// Carné de biblioteca (genérico: no es el de ninguna comunidad). 560×350 a escala 1.
export const LibCard: React.FC<{ w?: number; name?: string; num?: string; style?: React.CSSProperties; shine?: number }> = ({ w = 560, name = 'Tu nombre', num = '1234 5678', style, shine = 0 }) => {
  const k = w / 560;
  return (
    <div style={{ position: 'relative', width: w, height: 350 * k, borderRadius: 26 * k, background: E.plum, overflow: 'hidden', fontFamily: E.font, color: E.paper, ...style }}>
      <div style={{ position: 'absolute', right: -60 * k, top: -80 * k, width: 320 * k, height: 320 * k, borderRadius: '50%', background: E.violet }} />
      <div style={{ position: 'absolute', right: 40 * k, bottom: -110 * k, width: 260 * k, height: 260 * k, borderRadius: '50%', background: E.pink, opacity: 0.9 }} />
      <Stip kind="v" flip o={0.25} />
      {/* puerta (motivo) */}
      <svg style={{ position: 'absolute', left: 34 * k, top: 34 * k }} width={70 * k} height={88 * k} viewBox="0 0 70 88">
        <rect x="26" y="4" width="40" height="80" rx="3" fill="none" stroke={E.paper} strokeWidth="6" />
        <path d="M4 10 L30 2 L30 86 L4 78 Z" fill={E.mustard} />
      </svg>
      <div style={{ position: 'absolute', left: 120 * k, top: 38 * k, fontSize: 25 * k, fontWeight: 500, opacity: 0.85, letterSpacing: '0.02em' }}>Biblioteca pública</div>
      <div style={{ position: 'absolute', left: 120 * k, top: 70 * k, fontSize: 40 * k, fontWeight: 700, letterSpacing: '-0.01em' }}>Carné de usuario</div>
      <div style={{ position: 'absolute', left: 36 * k, top: 168 * k, fontSize: 30 * k, fontWeight: 600 }}>{name}</div>
      <div style={{ position: 'absolute', left: 36 * k, top: 210 * k, fontSize: 26 * k, fontWeight: 500, letterSpacing: '0.12em', opacity: 0.85 }}>{num}</div>
      {/* código de barras */}
      <div style={{ position: 'absolute', left: 36 * k, bottom: 30 * k, height: 54 * k, width: 250 * k, background: E.paper, borderRadius: 6 * k, display: 'flex', alignItems: 'stretch', padding: `${8 * k}px ${10 * k}px`, gap: 2 * k, boxSizing: 'border-box' }}>
        {Array.from({ length: 38 }, (_, i) => <div key={i} style={{ width: (rnd(i + 3) > 0.6 ? 4 : 2) * k, background: E.ink, opacity: rnd(i + 11) > 0.15 ? 1 : 0 }} />)}
      </div>
      {/* sin contacto */}
      <svg style={{ position: 'absolute', right: 40 * k, top: 40 * k }} width={46 * k} height={46 * k} viewBox="0 0 46 46">
        {[10, 18, 26].map((r, i) => <path key={i} d={`M${8 + i * 7} ${23 - r * 0.7} Q ${8 + i * 7 + r * 0.55} 23 ${8 + i * 7} ${23 + r * 0.7}`} stroke={E.paper} strokeWidth="4" fill="none" strokeLinecap="round" />)}
      </svg>
      {shine > 0 && <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(110deg, rgba(255,255,255,0) ${shine * 140 - 40}%, rgba(255,255,255,0.35) ${shine * 140 - 25}%, rgba(255,255,255,0) ${shine * 140 - 10}%)` }} />}
    </div>
  );
};

// Portada genérica tipográfica (para las recreaciones: no reproduce ninguna portada real)
export const PlainCover: React.FC<{ w: number; title: string; author?: string; bg?: string; fg?: string; accent?: string; style?: React.CSSProperties; audio?: boolean }> = ({ w, title, author, bg = E.coral, fg = E.paper, accent = E.mustard, style, audio = true }) => {
  const k = w / 200;
  return (
    <div style={{ position: 'relative', width: w, height: w, background: bg, overflow: 'hidden', borderRadius: 6 * k, fontFamily: E.font, color: fg, ...style }}>
      <div style={{ position: 'absolute', right: -40 * k, bottom: -40 * k, width: 140 * k, height: 140 * k, borderRadius: '50%', background: accent, opacity: 0.9 }} />
      <Stip kind="v" flip o={0.2} />
      <div style={{ position: 'absolute', left: 16 * k, top: 18 * k, right: 16 * k, fontSize: 24 * k, fontWeight: 700, lineHeight: 1.08 }}>{title}</div>
      {author && <div style={{ position: 'absolute', left: 16 * k, bottom: 16 * k, fontSize: 14 * k, fontWeight: 500, opacity: 0.9 }}>{author}</div>}
      {audio && (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0 }} />
      )}
    </div>
  );
};

// Auriculares (icono)
export const PhonesIcon: React.FC<{ size: number; color?: string }> = ({ size, color = E.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M4 15v-3a8 8 0 0 1 16 0v3" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" /><rect x="3" y="14" width="5" height="7" rx="2" fill={color} /><rect x="16" y="14" width="5" height="7" rx="2" fill={color} /></svg>
);
