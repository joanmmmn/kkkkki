import React from 'react';
import { AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame } from 'remotion';
import { color, font, shadow } from '../../brand/tokens';
import { clamp, easeInOut, easeOut, Key, keyframes, fmtEs } from '../../lib/anim';
import { loadBrandFonts } from '../../brand/fonts';

loadBrandFonts();

// ————————————————————————————————————————————————————————————————
// «La historia detrás del libro» · sistema visual de la serie.
// Papel crema y tinta (un libro ilustrado), la paleta del Caribe colombiano (verde selva, teja, cielo) y el amarillo de
// SonorBooks como hilo conductor: las mariposas amarillas que acompañan cada historia.
// Tipografías: EB Garamond (titulares y citas), Special Elite (máquina de escribir de los sesenta) y Ubuntu (datos).
// ————————————————————————————————————————————————————————————————

export const P = {
  paper: '#F2EADB',
  paper2: '#E8DCC6',
  paperDeep: '#D9C9AC',
  ink: '#1D1A16',
  ink2: '#4B4237',
  sepia: '#7A6650',
  jungle: '#24493F',
  jungle2: '#3A6B57',
  leaf: '#5E8C61',
  terra: '#B4502C',
  terraSoft: '#E9C3AE',
  sky: '#9CC2CF',
  night: '#14212A',
  night2: '#1E3340',
  yellow: color.yellow,
  yellowDeep: '#E2A400',
  red: '#B5262B',
};
export const F = {
  serif: '"EB Garamond", Georgia, serif',
  type: '"Special Elite", "Courier New", monospace',
  sans: font.sans,
};
export const SERIES = 'La historia detrás del libro';
export { color, font, shadow };

export const ramp = (frame: number, a: number, b: number, ez = easeInOut) => interpolate(frame, [a, b], [0, 1], { ...clamp, easing: ez });
export const rampOut = (frame: number, a: number, b: number) => interpolate(frame, [a, b], [0, 1], { ...clamp, easing: easeOut });
export const pulse = (frame: number, a: number, len = 18) => interpolate(frame, [a, a + len * 0.3, a + len], [0, 1, 0], clamp);
export const sp = (frame: number, at: number, damping = 14, stiffness = 160) => spring({ frame: frame - at, fps: 50, config: { damping, stiffness } });
export { fmtEs };

// ———————————————— Fondos ————————————————

// Papel: textura propia (tools/hdl_paper.py) con grano vivo y una luz cálida que se desplaza despacio.
export const PaperStage: React.FC<{ children?: React.ReactNode; still?: boolean; tint?: string; light?: number }> = ({ children, still = false, tint, light = 1 }) => {
  const frame = useCurrentFrame();
  const t = still ? 0 : frame / 50;
  return (
    <AbsoluteFill style={{ background: P.paper, overflow: 'hidden' }}>
      <Img src={staticFile('hdl/img/paper.jpg')} style={{ position: 'absolute', inset: 0, width: 1920, height: 1080 }} />
      {tint && <AbsoluteFill style={{ background: tint, opacity: 0.25 }} />}
      <div style={{ position: 'absolute', width: 1700, height: 1700, borderRadius: '50%', left: 420 + Math.sin(t * 0.09) * 160, top: -900 + Math.cos(t * 0.07) * 90,
        background: `radial-gradient(circle, rgba(255,236,190,${0.32 * light}) 0%, rgba(255,236,190,0) 60%)` }} />
      {children}
    </AbsoluteFill>
  );
};

// Noche: azul petróleo profundo con un foco cálido de lámpara y motas de polvo (oficina de correos, Macondo de noche).
export const NightStage: React.FC<{ children?: React.ReactNode; still?: boolean; lamp?: [number, number]; warm?: number }> = ({ children, still = false, lamp = [960, 360], warm = 1 }) => {
  const frame = useCurrentFrame();
  const t = still ? 0 : frame / 50;
  const g = still ? 0 : Math.floor(frame / 2);
  const breathe = 1 + 0.035 * Math.sin(t * 0.8);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${P.night2} 0%, ${P.night} 58%, #0A1115 100%)`, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: lamp[0] - 950, top: lamp[1] - 760, width: 1900, height: 1520, borderRadius: '50%', transform: `scale(${breathe})`,
        background: `radial-gradient(ellipse, rgba(255,206,120,${0.2 * warm}) 0%, rgba(255,206,120,${0.06 * warm}) 40%, rgba(255,206,120,0) 68%)` }} />
      <Motes />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.5) 100%)' }} />
      <Grain seed={g} opacity={0.05} />
      {children}
    </AbsoluteFill>
  );
};

export const Motes: React.FC<{ n?: number; c?: string }> = ({ n = 40, c = 'rgba(255,226,170,0.55)' }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {Array.from({ length: n }).map((_, i) => {
        const r = (k: string) => random(`mote-${i}-${k}`);
        const x = (r('x') * 2100 + frame * (0.12 + r('vx') * 0.3)) % 2100 - 90;
        const y = (r('y') * 1200 - frame * (0.06 + r('vy') * 0.2) + 2400) % 1200 - 60;
        const s = 1.5 + r('s') * 3;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(frame / (30 + r('t') * 40) + r('p') * 6));
        return <div key={i} style={{ position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%', background: c, opacity: tw * (0.4 + r('o') * 0.6) }} />;
      })}
    </AbsoluteFill>
  );
};

// Grano de película sin modo de fusión (más barato de componer que `overlay`).
export const Grain: React.FC<{ seed: number; opacity?: number }> = ({ seed, opacity = 0.05 }) => {
  const gx = Math.floor(random(`hdl-gx-${seed}`) * 512);
  const gy = Math.floor(random(`hdl-gy-${seed}`) * 512);
  return <AbsoluteFill style={{ backgroundImage: `url(${staticFile('pdr/img/grain.png')})`, backgroundSize: '512px 512px', backgroundPosition: `${gx}px ${gy}px`, opacity, pointerEvents: 'none' }} />;
};

// ———————————————— Mariposas amarillas ————————————————

// Mariposa vista desde arriba: dos pares de alas que baten (escala en x), cuerpo de tinta. `flap` en ciclos por segundo.
export const Butterfly: React.FC<{ x: number; y: number; size?: number; rot?: number; seed?: string; flap?: number; opacity?: number; c?: string; c2?: string; glow?: number }> = ({
  x, y, size = 60, rot = 0, seed = 'b', flap = 3.2, opacity = 1, c = P.yellow, c2 = P.yellowDeep, glow = 0,
}) => {
  const frame = useCurrentFrame();
  const ph = random(`bf-${seed}`) * Math.PI * 2;
  const k = Math.cos((frame / 50) * Math.PI * 2 * flap + ph);
  const open = 0.22 + 0.78 * (0.5 + 0.5 * k); // 0,22 (alas casi cerradas) → 1 (abiertas)
  const wing = (side: 1 | -1) => (
    <g transform={`scale(${side * open} 1)`}>
      <path d="M0 -4 C 10 -34, 44 -40, 46 -18 C 48 -2, 22 6, 0 2 Z" fill={c} stroke={P.ink} strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M0 3 C 18 6, 36 14, 30 30 C 24 42, 6 30, 0 12 Z" fill={c2} stroke={P.ink} strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M8 -10 C 18 -22, 32 -26, 38 -18" stroke={P.ink} strokeWidth={1} fill="none" opacity={0.45} />
      <circle cx={34} cy={-20} r={3.2} fill={P.ink} opacity={0.75} />
    </g>
  );
  return (
    <div style={{ position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, opacity, transform: `rotate(${rot}deg)`,
      filter: glow > 0 ? `drop-shadow(0 0 ${(14 * glow).toFixed(1)}px rgba(255,202,5,${(0.7 * glow).toFixed(2)}))` : 'drop-shadow(0 6px 6px rgba(0,0,0,0.18))' }}>
      <svg viewBox="-50 -50 100 100" width={size} height={size} style={{ overflow: 'visible' }}>
        {wing(1)}
        {wing(-1)}
        <ellipse cx={0} cy={2} rx={3} ry={16} fill={P.ink} />
        <path d="M-1 -12 C -4 -22, -8 -26, -12 -28 M1 -12 C 4 -22, 8 -26, 12 -28" stroke={P.ink} strokeWidth={1.3} fill="none" />
      </svg>
    </div>
  );
};

// Vuelo: posición en una curva suave que pasa por `pts` entre los fotogramas `a` y `b`, con aleteo lateral y orientación
// según la dirección. Fuera de [a, b] no se dibuja (salvo `hold`: se queda posada al final).
type Pt = [number, number];
const catmull = (p0: number, p1: number, p2: number, p3: number, t: number) =>
  0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);
export const pathAt = (pts: Pt[], u: number): Pt => {
  const n = pts.length - 1;
  const s = Math.min(n - 1e-6, Math.max(0, u * n));
  const i = Math.floor(s);
  const t = s - i;
  const g = (k: number) => pts[Math.min(n, Math.max(0, k))];
  return [catmull(g(i - 1)[0], g(i)[0], g(i + 1)[0], g(i + 2)[0], t), catmull(g(i - 1)[1], g(i)[1], g(i + 1)[1], g(i + 2)[1], t)];
};
export const Flight: React.FC<{ pts: Pt[]; a: number; b: number; size?: number; seed?: string; hold?: boolean; wobble?: number; glow?: number; fadeIn?: number; fadeOut?: number }> = ({
  pts, a, b, size = 60, seed = 'f', hold = false, wobble = 16, glow = 0, fadeIn = 0, fadeOut = 0,
}) => {
  const frame = useCurrentFrame();
  if (frame < a || (frame > b && !hold)) return null;
  const u = interpolate(frame, [a, b], [0, 1], { ...clamp, easing: easeInOut });
  const [x, y] = pathAt(pts, u);
  const [x2, y2] = pathAt(pts, Math.min(1, u + 0.01));
  const r = random(`fl-${seed}`) * 6;
  const wob = Math.sin(frame / 7 + r) * wobble * (frame > b ? 0.15 : 1);
  const ang = frame > b ? 0 : (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI + 90;
  const op = Math.min(fadeIn ? ramp(frame, a, a + fadeIn) : 1, fadeOut ? 1 - ramp(frame, b - fadeOut, b) : 1);
  return <Butterfly x={x} y={y + wob} size={size} rot={Math.max(-60, Math.min(60, ((ang + 540) % 360) - 180)) * 0.7} seed={seed} flap={frame > b ? 0.6 : 3.4} glow={glow} opacity={op} />;
};

// Bandada: n mariposas que salen de un punto y se dispersan (determinista).
export const Swarm: React.FC<{ n?: number; from: Pt; a: number; dur?: number; spread?: [number, number]; size?: number; seed?: string; glow?: number; to?: Pt }> = ({
  n = 14, from, a, dur = 140, spread = [1500, 900], size = 54, seed = 'sw', glow = 0, to,
}) => (
  <>
    {Array.from({ length: n }).map((_, i) => {
      const r = (k: string) => random(`${seed}-${i}-${k}`);
      const end: Pt = to ? [to[0] + (r('ex') - 0.5) * spread[0] * 0.3, to[1] + (r('ey') - 0.5) * spread[1] * 0.3] : [from[0] + (r('ex') - 0.5) * spread[0], from[1] + (r('ey') - 0.7) * spread[1]];
      const mid: Pt = [(from[0] + end[0]) / 2 + (r('mx') - 0.5) * 380, (from[1] + end[1]) / 2 + (r('my') - 0.5) * 300];
      const st = a + Math.floor(r('d') * 24);
      return <Flight key={i} pts={[from, mid, end]} a={st} b={st + dur * (0.75 + r('du') * 0.5)} size={size * (0.65 + r('s') * 0.6)} seed={`${seed}${i}`} glow={glow} fadeIn={6} fadeOut={to ? 0 : 28} />;
    })}
  </>
);

// ———————————————— Texto ————————————————

// Texto que se teclea entre `a` y `b` (máquina de escribir); devuelve también los fotogramas de cada carácter (para Keystrokes).
export const typeTimes = (text: string, a: number, b: number) => {
  const n = Array.from(text).length;
  return Array.from({ length: n }, (_, i) => Math.round(a + ((b - a) * i) / Math.max(1, n - 1)));
};
export const Typed: React.FC<{ text: string; a: number; b: number; style?: React.CSSProperties; caret?: boolean; caretColor?: string }> = ({ text, a, b, style, caret = true, caretColor = P.ink }) => {
  const frame = useCurrentFrame();
  const chars = Array.from(text);
  const shown = frame < a ? 0 : Math.min(chars.length, Math.floor(interpolate(frame, [a, b], [0, chars.length], clamp)) + 1);
  const blink = Math.floor(frame / 14) % 2 === 0;
  return (
    <span style={{ fontFamily: F.type, whiteSpace: 'pre-wrap', ...style }}>
      {chars.slice(0, shown).join('')}
      <span style={{ visibility: 'hidden' }}>{chars.slice(shown).join('')}</span>
      {caret && frame >= a - 10 && (shown < chars.length || blink) && frame < b + 60 && (
        <span style={{ position: 'relative', display: 'inline-block', width: 0 }}>
          <span style={{ position: 'absolute', left: -(chars.length - shown) * 0.6 + 'em', bottom: '0.08em', width: '0.55em', height: '0.08em', background: caretColor, opacity: 0.8 }} />
        </span>
      )}
    </span>
  );
};

// Palabra a palabra (con subida suave), para titulares en Garamond.
export const Reveal: React.FC<{ text: string; at: number; step?: number; style?: React.CSSProperties; dy?: number }> = ({ text, at, step = 3, style, dy = 26 }) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');
  return (
    <span style={style}>
      {words.map((w, i) => {
        const p = rampOut(frame, at + i * step, at + i * step + 16);
        return (
          <span key={i} style={{ display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * dy}px)`, filter: p < 0.99 ? `blur(${((1 - p) * 6).toFixed(1)}px)` : undefined, whiteSpace: 'pre' }}>
            {w}{i < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </span>
  );
};

// Subrayado de rotulador amarillo bajo un texto (se dibuja de izquierda a derecha).
export const Marker: React.FC<{ at: number; dur?: number; children: React.ReactNode; c?: string; h?: number; style?: React.CSSProperties }> = ({ at, dur = 14, children, c = P.yellow, h = 0.38, style }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, at, at + dur, easeOut);
  return (
    <span style={{ position: 'relative', display: 'inline-block', ...style }}>
      <span style={{ position: 'absolute', left: '-0.08em', right: '-0.08em', bottom: '0.06em', height: `${h}em`, background: c, transform: `scaleX(${p})`, transformOrigin: 'left', borderRadius: 4, opacity: 0.9 }} />
      <span style={{ position: 'relative' }}>{children}</span>
    </span>
  );
};

// ———————————————— Papelería ————————————————

// Sello de goma que golpea (cae grande y girado, se asienta con un rebote). Texto en mayúsculas con tinta irregular.
export const Stamp: React.FC<{ at: number; text: string; sub?: string; c?: string; rot?: number; size?: number; style?: React.CSSProperties; round?: boolean }> = ({ at, text, sub, c = P.red, rot = -8, size = 60, style, round = false }) => {
  const frame = useCurrentFrame();
  if (frame < at - 4) return null;
  const s = interpolate(frame, [at - 4, at, at + 3, at + 9], [2.2, 1, 1.06, 1], { ...clamp });
  const o = interpolate(frame, [at - 4, at], [0, 1], clamp);
  return (
    <div style={{ position: 'absolute', transform: `rotate(${rot}deg) scale(${s})`, opacity: o * 0.92, ...style }}>
      <div style={{ border: `${size * 0.09}px solid ${c}`, borderRadius: round ? 999 : size * 0.18, padding: `${size * 0.14}px ${size * 0.36}px`, color: c, fontFamily: F.type, fontSize: size, lineHeight: 1,
        textAlign: 'center', letterSpacing: size * 0.04, textTransform: 'uppercase', mixBlendMode: 'multiply',
        WebkitMaskImage: `url(${staticFile('pdr/img/grain.png')})`, WebkitMaskSize: '260px 260px' }}>
        {text}
        {sub && <div style={{ fontSize: size * 0.36, marginTop: size * 0.12, letterSpacing: size * 0.03 }}>{sub}</div>}
      </div>
    </div>
  );
};

// Hoja de papel con líneas mecanografiadas (texto falso: barras grises) y opcionalmente una línea resaltada.
export const Page: React.FC<{ w: number; h: number; lines?: number; seed?: string; title?: string; hi?: number; hiP?: number; style?: React.CSSProperties; typed?: number }> = ({
  w, h, lines = 18, seed = 'pg', title, hi = -1, hiP = 0, style, typed = 1,
}) => {
  const pad = w * 0.12;
  const lh = (h - pad * 2 - (title ? h * 0.12 : 0)) / lines;
  return (
    <div style={{ position: 'absolute', width: w, height: h, background: '#FBF7EE', boxShadow: '0 18px 40px rgba(40,28,10,0.18), 0 2px 6px rgba(40,28,10,0.12)', ...style }}>
      {title && <div style={{ position: 'absolute', left: 0, right: 0, top: pad * 0.9, textAlign: 'center', fontFamily: F.type, fontSize: w * 0.06, color: P.ink }}>{title}</div>}
      {Array.from({ length: lines }).map((_, i) => {
        const r = random(`${seed}-${i}`);
        const full = i === lines - 1 ? 0.35 + r * 0.3 : 0.82 + r * 0.18;
        const vis = Math.max(0, Math.min(1, typed * lines - i));
        const y = pad + (title ? h * 0.12 : 0) + i * lh;
        return (
          <React.Fragment key={i}>
            {i === hi && <div style={{ position: 'absolute', left: pad - 6, top: y - lh * 0.12, height: lh * 0.62, width: (w - pad * 2) * full * hiP + 12, background: P.yellow, opacity: 0.85 }} />}
            <div style={{ position: 'absolute', left: pad + (i === 0 || r > 0.93 ? w * 0.05 : 0), top: y, height: Math.max(2, lh * 0.26), width: (w - pad * 2) * full * vis - (i === 0 ? w * 0.05 : 0), background: 'rgba(29,26,22,0.62)', borderRadius: 2 }} />
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Pila de cuartillas vista de frente (canto con hojas) y en ligera perspectiva. `sheets`: grosor visual.
export const Stack: React.FC<{ w: number; thick: number; x: number; y: number; rot?: number; label?: React.ReactNode; wrapped?: number; string?: number; shadowK?: number; cover?: string }> = ({
  w, thick, x, y, rot = 0, label, wrapped = 0, string = 0, shadowK = 1, cover,
}) => {
  const depth = w * 0.42;
  const lines = Math.max(4, Math.round(thick / 5));
  return (
    <div style={{ position: 'absolute', left: x - w / 2, top: y - thick - depth, width: w, height: thick + depth, transform: `rotate(${rot}deg)` }}>
      <div style={{ position: 'absolute', left: 10, right: -10, bottom: -14, height: 26, borderRadius: '50%', background: `rgba(10,6,2,${0.28 * shadowK})`, filter: 'blur(10px)' }} />
      {/* canto */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: thick, background: '#EFE6D3', borderRadius: 3, overflow: 'hidden', boxShadow: 'inset 0 -4px 6px rgba(0,0,0,0.08)' }}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: (i + 0.5) * (thick / lines), height: 1.2, background: 'rgba(120,100,70,0.35)', transform: `translateX(${(random(`st${i}`) - 0.5) * 6}px)` }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, background: '#B88B57', opacity: wrapped }} />
        {cover && <><div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 9, background: cover }} /><div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 9, background: cover }} /></>}
      </div>
      {/* cara superior */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: thick, height: depth, background: '#FBF7EE', transform: 'skewX(-28deg)', transformOrigin: 'bottom', borderRadius: 3,
        boxShadow: 'inset 0 0 0 1px rgba(120,100,70,0.18)', overflow: 'hidden' }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} style={{ position: 'absolute', left: '14%', width: `${60 + random(`tp${i}`) * 18}%`, top: `${16 + i * 10}%`, height: 3, background: 'rgba(29,26,22,0.35)', borderRadius: 2 }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, background: '#C49A66', opacity: wrapped }} />
        {cover && (
          <div style={{ position: 'absolute', inset: 0, background: cover }}>
            <div style={{ position: 'absolute', left: '22%', right: '22%', top: '34%', height: 4, background: '#D9B35F' }} />
            <div style={{ position: 'absolute', left: '30%', right: '30%', top: '52%', height: 3, background: '#D9B35F', opacity: 0.7 }} />
          </div>
        )}
        {label && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'skewX(28deg)' }}>{label}</div>}
      </div>
      {string > 0 && (
        <>
          <div style={{ position: 'absolute', left: w * 0.48, width: 3, bottom: 0, height: thick * string, background: '#6B4A2A' }} />
          <div style={{ position: 'absolute', left: w * 0.12 + depth * 0.25, right: w * 0.12 - depth * 0.25, bottom: thick + depth * 0.5, height: 3, background: '#6B4A2A', opacity: string, transform: 'rotate(-14deg)' }} />
        </>
      )}
    </div>
  );
};

// Báscula postal mecánica: plato, columna y esfera con aguja (ángulo en grados: −120 = 0, +120 = máximo).
export const PostalScale: React.FC<{ x: number; y: number; needle: number; size?: number; children?: React.ReactNode; platY?: number }> = ({ x, y, needle, size = 1, children, platY = 0 }) => (
  <div style={{ position: 'absolute', left: x, top: y, transform: `scale(${size})`, transformOrigin: 'top center' }}>
    <svg width={520} height={560} viewBox="-260 -40 520 560" style={{ position: 'absolute', left: -260, top: -40, overflow: 'visible' }}>
      {/* plato */}
      <g transform={`translate(0 ${platY})`}>
        <rect x={-230} y={-2} width={460} height={18} rx={6} fill="#8C8F86" stroke={P.ink} strokeWidth={3} />
        <rect x={-20} y={14} width={40} height={40} fill="#6E716A" stroke={P.ink} strokeWidth={3} />
      </g>
      {/* cuerpo */}
      <path d="M-150 70 Q -160 60 -140 54 L 140 54 Q 160 60 150 70 L 175 470 Q 175 490 155 490 L -155 490 Q -175 490 -175 470 Z" fill="#7C2E22" stroke={P.ink} strokeWidth={4} />
      <path d="M-150 70 L 150 70" stroke="rgba(255,255,255,0.15)" strokeWidth={6} />
      {/* esfera */}
      <circle cx={0} cy={250} r={128} fill="#F3EAD6" stroke={P.ink} strokeWidth={6} />
      <circle cx={0} cy={250} r={112} fill="none" stroke="#B9A889" strokeWidth={2} />
      {Array.from({ length: 25 }).map((_, i) => {
        const a = ((-120 + i * 10) * Math.PI) / 180;
        const r1 = i % 5 === 0 ? 92 : 100;
        return <line key={i} x1={Math.sin(a) * r1} y1={250 - Math.cos(a) * r1} x2={Math.sin(a) * 110} y2={250 - Math.cos(a) * 110} stroke={P.ink} strokeWidth={i % 5 === 0 ? 4 : 2} />;
      })}
      {[0, 1, 2, 3, 4].map((k) => {
        const a = ((-120 + k * 60) * Math.PI) / 180;
        return <text key={k} x={Math.sin(a) * 74} y={250 - Math.cos(a) * 74 + 8} textAnchor="middle" fontFamily="Special Elite" fontSize={24} fill={P.ink}>{k}</text>;
      })}
      <text x={0} y={318} textAnchor="middle" fontFamily="Special Elite" fontSize={20} fill={P.sepia}>KG</text>
      <g transform={`rotate(${needle} 0 250)`}>
        <path d="M-5 262 L 0 152 L 5 262 Z" fill={P.red} stroke={P.ink} strokeWidth={1.5} />
      </g>
      <circle cx={0} cy={250} r={11} fill={P.ink} />
      <path d="M-100 160 Q 0 110 100 160" stroke="rgba(255,255,255,0.45)" strokeWidth={10} fill="none" strokeLinecap="round" />
    </svg>
    <div style={{ position: 'absolute', left: 0, top: platY }}>{children}</div>
  </div>
);

// Papeleta de empeño (Monte de Piedad): número, objeto, sello.
export const PawnTicket: React.FC<{ x: number; y: number; at: number; label: string; icon: React.ReactNode; num: string; rot?: number; w?: number; stampAt?: number }> = ({ x, y, at, label, icon, num, rot = -4, w = 300, stampAt }) => {
  const frame = useCurrentFrame();
  const p = sp(frame, at, 13, 170);
  if (frame < at - 2) return null;
  return (
    <div style={{ position: 'absolute', left: x - w / 2, top: y, width: w, transform: `translateY(${(1 - p) * 60}px) rotate(${rot * p}deg) scale(${0.8 + 0.2 * p})`, opacity: Math.min(1, p * 2) }}>
      <div style={{ background: '#F7EBCB', border: `2px solid ${P.sepia}`, borderRadius: 6, padding: '18px 20px 22px', boxShadow: '0 16px 34px rgba(40,28,10,0.22)', position: 'relative' }}>
        <div style={{ fontFamily: F.type, fontSize: 18, color: P.sepia, letterSpacing: 2, borderBottom: `1.5px dashed ${P.sepia}`, paddingBottom: 8 }}>MONTE DE PIEDAD · Nº {num}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 14 }}>
          <div style={{ width: 92, height: 92, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: 12, border: `2px solid ${P.ink}` }}>{icon}</div>
          <div style={{ fontFamily: F.serif, fontWeight: 600, fontSize: 38, color: P.ink, lineHeight: 1.05 }}>{label}</div>
        </div>
        {stampAt !== undefined && <Stamp at={stampAt} text="Empeñado" size={30} rot={-12} style={{ right: 12, bottom: 10 }} />}
      </div>
    </div>
  );
};

// Tarjeta de cita (comillas grandes en Garamond).
export const QuoteCard: React.FC<{ text: string; at: number; who?: string; size?: number; w?: number; dark?: boolean; style?: React.CSSProperties; step?: number }> = ({ text, at, who, size = 64, w = 1300, dark = false, style, step = 3 }) => {
  const frame = useCurrentFrame();
  const p = rampOut(frame, at - 10, at + 10);
  return (
    <div style={{ position: 'absolute', width: w, opacity: p, ...style }}>
      <div style={{ fontFamily: F.serif, fontWeight: 700, fontSize: size * 1.7, lineHeight: 1, color: P.yellow, height: size * 1.32, transform: `translateY(${(1 - p) * 20}px)`, marginLeft: -size * 0.06 }}>«</div>
      <div style={{ fontFamily: F.serif, fontStyle: 'italic', fontWeight: 500, fontSize: size, lineHeight: 1.18, color: dark ? '#F6EFE2' : P.ink }}>
        <Reveal text={text} at={at} step={step} />
      </div>
      {who && <div style={{ marginTop: size * 0.5, fontFamily: F.sans, fontWeight: 500, fontSize: size * 0.42, color: dark ? 'rgba(246,239,226,0.7)' : P.sepia, opacity: rampOut(frame, at + 20, at + 34) }}>— {who}</div>}
    </div>
  );
};

// Ficha de personaje: silueta, nombre y papel.
export const NameCard: React.FC<{ at: number; name: string; role: string; x: number; y: number; icon?: React.ReactNode; w?: number; accent?: string; dim?: number }> = ({ at, name, role, x, y, icon, w = 520, accent = P.yellow, dim = 0 }) => {
  const frame = useCurrentFrame();
  const p = sp(frame, at, 15, 150);
  if (frame < at - 2) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, transform: `translateY(${(1 - p) * 40}px) scale(${0.92 + 0.08 * p})`, opacity: Math.min(1, p * 1.6) * (1 - 0.55 * dim) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 26, background: '#FFFDF7', borderRadius: 26, padding: '24px 30px', boxShadow: shadow.card, borderLeft: `10px solid ${accent}` }}>
        <div style={{ width: 104, height: 104, borderRadius: '50%', background: P.paper2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>{icon ?? <Silhouette size={96} />}</div>
        <div>
          <div style={{ fontFamily: F.serif, fontWeight: 600, fontSize: 48, color: P.ink, lineHeight: 1.05 }}>{name}</div>
          <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 28, color: P.sepia, marginTop: 6 }}>{role}</div>
        </div>
      </div>
    </div>
  );
};

// Silueta de busto genérica (sin rasgos: nunca un retrato de una persona real).
export const Silhouette: React.FC<{ size?: number; c?: string; hair?: 'short' | 'long' | 'curly'; mustache?: boolean }> = ({ size = 100, c = P.ink2, hair = 'short', mustache = false }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M18 100 C 20 76, 34 68, 50 68 C 66 68, 80 76, 82 100 Z" fill={c} />
    <ellipse cx={50} cy={44} rx={19} ry={22} fill={c} />
    {hair === 'curly' && <path d="M29 42 C 26 22, 40 14, 50 16 C 62 13, 76 22, 71 42 C 68 32, 62 26, 50 27 C 38 26, 32 32, 29 42 Z" fill={P.ink} />}
    {hair === 'long' && <path d="M28 46 C 24 20, 44 14, 52 16 C 70 16, 78 30, 72 62 C 70 50, 70 34, 52 28 C 38 30, 32 38, 30 64 Z" fill={P.ink} />}
    {hair === 'short' && <path d="M31 40 C 30 24, 42 18, 51 19 C 63 19, 71 26, 69 40 C 64 31, 58 29, 50 29 C 42 29, 35 32, 31 40 Z" fill={P.ink} />}
    {mustache && <path d="M41 55 C 46 52, 54 52, 59 55 C 54 57, 46 57, 41 55 Z" fill={P.ink} />}
  </svg>
);

// Contador con formato español (puntos de miles).
export const Count: React.FC<{ from?: number; to: number; a: number; b: number; prefix?: string; suffix?: string; style?: React.CSSProperties; decimals?: number }> = ({ from = 0, to, a, b, prefix = '', suffix = '', style, decimals = 0 }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [a, b], [from, to], { ...clamp, easing: easeOut });
  return <span style={{ fontVariantNumeric: 'tabular-nums', ...style }}>{prefix}{fmtEs(v, decimals)}{suffix}</span>;
};

// Cámara 2D por fotogramas clave (s = escala, x/y = desplazamiento en px, r = giro).
export type CamK = Key & { s: number; x: number; y: number; r?: number };
export const Cam: React.FC<{ keys: CamK[]; children: React.ReactNode; origin?: string; style?: React.CSSProperties; ease?: (t: number) => number }> = ({ keys, children, origin = '50% 50%', style, ease = easeInOut }) => {
  const frame = useCurrentFrame();
  const k = (p: string) => keyframes(frame, keys, p, ease);
  const r = keys.some((q) => q.r !== undefined) ? k('r') : 0;
  return <AbsoluteFill style={{ transform: `translate(${k('x')}px, ${k('y')}px) scale(${k('s')}) rotate(${r}deg)`, transformOrigin: origin, ...style }}>{children}</AbsoluteFill>;
};

// Etiqueta flotante (dato).
export const Tag: React.FC<{ at: number; children: React.ReactNode; x: number; y: number; dark?: boolean; size?: number; out?: number; accent?: string; align?: 'left' | 'center' | 'right' }> = ({
  at, children, x, y, dark = false, size = 40, out, accent, align = 'left',
}) => {
  const frame = useCurrentFrame();
  const p = sp(frame, at, 14, 180);
  const o = out !== undefined ? 1 - ramp(frame, out, out + 12) : 1;
  if (frame < at - 2) return null;
  const tx = align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0';
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translateX(${tx}) translateY(${(1 - p) * 24}px) scale(${0.9 + 0.1 * p})`, opacity: Math.min(1, p * 1.5) * o, whiteSpace: 'nowrap' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: `${size * 0.32}px ${size * 0.62}px`, borderRadius: 999, fontFamily: F.sans, fontWeight: 700, fontSize: size,
        background: dark ? P.ink : '#FFFDF7', color: dark ? '#fff' : P.ink, boxShadow: shadow.float, borderBottom: accent ? `6px solid ${accent}` : undefined }}>
        {children}
      </div>
    </div>
  );
};

// Línea punteada que se dibuja (rutas en el mapa, trayectorias).
export const DashPath: React.FC<{ d: string; at: number; dur?: number; c?: string; w?: number; dash?: number; len?: number }> = ({ d, at, dur = 40, c = P.terra, w = 5, dash = 14, len = 3000 }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, at, at + dur);
  const id = React.useId().replace(/:/g, '');
  return (
    <g>
      <defs>
        <mask id={`m${id}`} maskUnits="userSpaceOnUse"><path d={d} stroke="#fff" strokeWidth={w * 3} fill="none" strokeDasharray={len} strokeDashoffset={len * (1 - p)} /></mask>
      </defs>
      <path d={d} stroke={c} strokeWidth={w} fill="none" strokeDasharray={`${dash} ${dash * 0.8}`} strokeLinecap="round" mask={`url(#m${id})`} />
    </g>
  );
};
