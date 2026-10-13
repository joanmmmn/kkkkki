import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Sfx } from '../../components/Sfx';
import { eIO, eOut, Fleuron, paperBg, ramp, Roman, T } from './kit';

// ---------------------------------------------------------------------------------------------------------------
// Transiciones entre planos
// ---------------------------------------------------------------------------------------------------------------
export const PT = 38; // giro de página (0,76 s)
export const SOFT = 26; // fundido (0,52 s)

// ---------------------------------------------------------------------------------------------------------------
// Hoja de papel que se curva al pasar: la página se divide en tiras verticales encadenadas (cada una gira un poco más
// que la anterior), así que el borde libre se adelanta y la hoja se dobla como el papel de verdad. Cada tira se sombrea
// según su inclinación y lleva un brillo en la curva. `front` es lo que se ve por delante (la página que se va) y `back`,
// opcional, lo que aparece por detrás al terminar de girar (si no, papel).
// ---------------------------------------------------------------------------------------------------------------
export const curlAngle = (p: number, u: number, curl = 0.42) => {
  // ángulo (grados, 0 → −180) de la tira en la posición u (0 lomo, 1 borde libre) cuando el giro va por p
  const lead = curl * Math.sin(Math.PI * p) * Math.pow(u, 1.35);
  return -180 * Math.min(1, Math.max(0, p + lead));
};
export const CurlLeaf: React.FC<{ p: number; w: number; h: number; n?: number; front: React.ReactNode; back?: React.ReactNode; backTone?: string; curl?: number; radius?: number }> = ({
  p, w, h, n = 14, front, back, backTone = T.paper2, curl = 0.42, radius = 0,
}) => {
  const sw = w / n;
  // ángulo en los bordes de cada tira (para que el sombreado sea continuo de una tira a la siguiente) y en su centro
  const edge = Array.from({ length: n + 1 }, (_, i) => curlAngle(p, i / n, curl));
  const abs = Array.from({ length: n }, (_, i) => curlAngle(p, (i + 0.5) / n, curl));
  const fd = (deg: number) => Math.max(0, (1 - Math.cos((deg * Math.PI) / 180)) * 0.42); // sombra del anverso
  const bd = (deg: number) => Math.max(0, (1 + Math.cos((deg * Math.PI) / 180)) * 0.38); // sombra del reverso
  const Strip: React.FC<{ i: number }> = ({ i }) => {
    const rel = abs[i] - (i > 0 ? abs[i - 1] : 0);
    // brillo en la parte que más se curva
    const bend = Math.abs(edge[i + 1] - edge[i]) / (180 / n);
    const glint = Math.min(0.26, bend * 0.18) * Math.sin(Math.PI * p);
    return (
      <div style={{ position: 'absolute', left: i === 0 ? 0 : sw, top: 0, width: sw + 0.8, height: h, transformOrigin: 'left center', transform: `rotateY(${rel}deg)`, transformStyle: 'preserve-3d' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', backfaceVisibility: 'hidden',
          borderRadius: radius && i === n - 1 ? `0 ${radius}px ${radius}px 0` : undefined }}>
          <div style={{ position: 'absolute', left: -i * sw, top: 0, width: w, height: h }}>{front}</div>
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, rgba(20,12,6,${fd(edge[i]).toFixed(3)}), rgba(20,12,6,${fd(edge[i + 1]).toFixed(3)}))` }} />
          {glint > 0.01 && <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, rgba(255,244,222,0) 0%, rgba(255,244,222,${glint.toFixed(3)}) 60%, rgba(255,244,222,0) 100%)` }} />}
        </div>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', ...paperBg(backTone),
          borderRadius: radius && i === n - 1 ? `${radius}px 0 0 ${radius}px` : undefined }}>
          {back && <div style={{ position: 'absolute', left: -(n - 1 - i) * sw, top: 0, width: w, height: h }}>{back}</div>}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, rgba(20,12,6,${bd(edge[i + 1]).toFixed(3)}), rgba(20,12,6,${bd(edge[i]).toFixed(3)}))` }} />
        </div>
        {i + 1 < n && <Strip i={i + 1} />}
      </div>
    );
  };
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, transformStyle: 'preserve-3d' }}>
      <Strip i={0} />
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Página que se pasa a pantalla completa (el giro clásico de un libro): la esquina de abajo a la derecha se levanta y
// el pliegue cruza la pantalla en diagonal; lo que se ha levantado se dobla encima y enseña el reverso (papel, con el
// brillo de la curva y su sombra), y debajo aparece la página nueva con la sombra del pliegue. Es 2D (recortes y
// degradados), así que siempre se ve entero y cuesta poco de dibujar.
// ---------------------------------------------------------------------------------------------------------------
type V2 = [number, number];
const halfPlane = (pts: V2[], n: V2, d: number, side: 1 | -1): V2[] => {
  // se queda con la parte del polígono donde side·(n·x − d) ≤ 0
  const s = (q: V2) => side * (n[0] * q[0] + n[1] * q[1] - d);
  const out: V2[] = [];
  pts.forEach((a, i) => {
    const b = pts[(i + 1) % pts.length];
    const sa = s(a), sb = s(b);
    if (sa <= 0) out.push(a);
    if ((sa < 0 && sb > 0) || (sa > 0 && sb < 0)) {
      const t = sa / (sa - sb);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  });
  return out;
};
const polygon = (pts: V2[]) => `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(', ')})`;

export const Peel: React.FC<{ p: number; children: React.ReactNode; w?: number; h?: number; backTone?: string }> = ({ p, children, w = 1920, h = 1080, backTone = T.paper2 }) => {
  if (p >= 1) return null;
  if (p <= 0) return <AbsoluteFill>{children}</AbsoluteFill>;
  // el pliegue empieza inclinado (manda la esquina) y se endereza al final, como cuando se pasa una hoja con la mano
  const phiDeg = 26 - 18 * p;
  const phi = (phiDeg * Math.PI) / 180;
  const n: V2 = [Math.cos(phi), Math.sin(phi)];
  const m = w * n[0] + h * n[1]; // n·x en la esquina de abajo a la derecha (en la de arriba a la izquierda vale 0)
  const d = m + 30 - (m + 150) * p; // posición del pliegue: de fuera de la esquina a más allá de la esquina opuesta
  const k = 0.8 + 0.16 * p; // la solapa se ve un poco más corta: está levantada
  const rect: V2[] = [[0, 0], [w, 0], [w, h], [0, h]];
  const front = halfPlane(rect, n, d, 1);
  const lifted = halfPlane(rect, n, d, -1);
  const flap = lifted.map(([x, y]) => {
    const t = n[0] * x + n[1] * y - d;
    return [x - (1 + k) * t * n[0], y - (1 + k) * t * n[1]] as V2;
  });
  const A = 90 + phiDeg; // los degradados van en la dirección de n: un punto con n·x = s está a «s px» del inicio
  const lift = Math.min(1, p * 6) * Math.min(1, (1 - p) * 5);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* sombra del pliegue sobre la página nueva */}
      <AbsoluteFill style={{ background: `linear-gradient(${A}deg, rgba(10,6,3,${0.5 * lift}) ${d.toFixed(1)}px, rgba(10,6,3,${0.2 * lift}) ${(d + 46).toFixed(1)}px, rgba(10,6,3,0) ${(d + 170).toFixed(1)}px)` }} />
      {/* lo que queda de la página que se va, que se arquea un poco al llegar al pliegue */}
      {front.length > 2 && (
        <AbsoluteFill style={{ clipPath: polygon(front) }}>
          {children}
          <AbsoluteFill style={{ background: `linear-gradient(${A}deg, rgba(20,12,6,0) ${(d - 140).toFixed(1)}px, rgba(20,12,6,${0.3 * lift}) ${d.toFixed(1)}px)` }} />
        </AbsoluteFill>
      )}
      {/* la solapa: el reverso de la hoja, con su sombra sobre la página */}
      {flap.length > 2 && (
        <AbsoluteFill style={{ filter: `drop-shadow(${(-16 * n[0]).toFixed(1)}px ${(-16 * n[1] + 10).toFixed(1)}px 22px rgba(8,5,2,${0.5 * lift}))` }}>
          <AbsoluteFill style={{ clipPath: polygon(flap), ...paperBg(backTone) }}>
            <AbsoluteFill style={{ background: `linear-gradient(${A}deg, rgba(60,40,20,0.16) ${(d - 700).toFixed(1)}px, rgba(255,250,236,0) ${(d - 300).toFixed(1)}px, rgba(255,251,240,0.62) ${(d - 40).toFixed(1)}px, rgba(255,251,240,0.3) ${(d - 16).toFixed(1)}px, rgba(110,78,40,0.38) ${d.toFixed(1)}px)` }} />
          </AbsoluteFill>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// Giro de página entre planos: el plano que sale (congelado en su último fotograma) es la hoja que se pasa.
export const PageTurn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  return <Peel p={ramp(frame, 0, PT, eIO)}>{children}</Peel>;
};

// Fundido: el plano que sale (congelado) se aleja un poco, se desenfoca y se desvanece despacio al principio
export const SoftOut: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const q = ramp(frame, 0, SOFT, (t) => t);
  const p = eIO(q);
  return (
    <AbsoluteFill style={{ opacity: 1 - q * q, transform: `scale(${1 + 0.035 * p})`, filter: p > 0.03 ? `blur(${p * 3}px)` : undefined }}>{children}</AbsoluteFill>
  );
};
// …y el que entra gana opacidad deprisa al principio, desde un poco más cerca
export const SoftIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const q = ramp(frame, 0, SOFT, (t) => t);
  const p = eIO(q);
  if (q >= 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{ opacity: 1 - (1 - q) * (1 - q), transform: `scale(${1.03 - 0.03 * p})`, filter: p < 0.97 ? `blur(${(1 - p) * 2.5}px)` : undefined }}>{children}</AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Portadilla de capítulo: una página de libro a pantalla completa («Capítulo», el número romano, el título y un
// ornamento). Al terminar, se pasa como una hoja y aparece la biblioteca.
// ---------------------------------------------------------------------------------------------------------------
export const CARD = 85; // la portadilla dura 1,7 s (lo que se adelanta la locución en estas escenas)
export const ChapterCard: React.FC<{ n: string; title: string; out?: number }> = ({ n, title, out = CARD - 16 }) => {
  const frame = useCurrentFrame();
  const a = ramp(frame, 2, 26, eOut);
  const b = ramp(frame, 10, 34, eOut);
  const p = ramp(frame, out, out + 36, eIO);
  return (
    <>
    <Sfx name="page_turn" at={out + 8} volume={0.75} />
    {p < 1 && <Peel p={p}>
      <AbsoluteFill style={{ ...paperBg(T.paper) }}>
        <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(90,60,20,0.16) 0%, rgba(90,60,20,0) 9%)' }} />
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 18, color: T.ink }}>
          <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 46, color: T.inkSoft, opacity: a, transform: `translateY(${(1 - a) * 12}px)` }}>Capítulo</div>
          <Roman n={n} size={230} style={{ opacity: a, transform: `translateY(${(1 - a) * 22}px) scale(${0.96 + 0.04 * a})` }} />
          <div style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 84, letterSpacing: -0.8, opacity: b, transform: `translateY(${(1 - b) * 16}px)`, marginTop: 8 }}>{title}</div>
          <div style={{ marginTop: 18 }}><Fleuron at={14} w={300} /></div>
        </AbsoluteFill>
      </AbsoluteFill>
    </Peel>}
    </>
  );
};
