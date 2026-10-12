import React from 'react';
import { Easing, spring as remotionSpring } from 'remotion';

// Estilo de movimiento del vídeo. Por defecto, el de siempre; el vídeo de LibriVox activa el modo suave
// (cámara con zooms suaves, entradas sin rebote y con poco desenfoque). Así los vídeos anteriores no cambian.
export type MotionStyle = { soft: boolean };
export const MotionContext = React.createContext<MotionStyle>({ soft: false });
export const useMotion = () => React.useContext(MotionContext);

// Muelle sin rebote: misma rapidez que el original, pero con una amortiguación de al menos 0,85 veces la crítica,
// de modo que los elementos llegan a su sitio sin pasarse ni oscilar.
export const softSpring: typeof remotionSpring = (opts) => {
  const c = { damping: 10, mass: 1, stiffness: 100, overshootClamping: false, ...(opts.config ?? {}) };
  const need = 2 * Math.sqrt(c.stiffness * c.mass) * 0.85;
  return remotionSpring({ ...opts, config: { ...c, damping: Math.max(c.damping, need) } });
};

// ---------------------------------------------------------------------------------------------------------------
// Cámara virtual suave para las capturas (ScreenClip y AppView).
// - El zoom se interpola en escala logarítmica: la velocidad aparente del acercamiento es constante.
// - Curva seno entre fotogramas clave (aceleración y frenada más suaves que la cúbica).
// - Cada fotograma clave se ajusta antes a los bordes de la imagen: la cámara nunca choca contra un borde a mitad
//   de un movimiento (eso producía un frenazo seco).
// - Un muelle críticamente amortiguado sigue al recorrido: redondea los arranques, las paradas y los cambios de
//   dirección, y amortigua los acercamientos muy cortos.
// Coordenadas en píxeles CSS de la captura: vw×vh es lo que se ve con zoom 1; ph, el alto total de la página.
export type CamPoint = { f: number; zoom: number; x: number; y: number };
const sine = Easing.bezier(0.37, 0, 0.63, 1);
const OMEGA = 7.2; // rad/s: se asienta en ~0,8 s; retraso en movimientos largos ~0,28 s
const lim = (v: number, a: number, b: number) => (a > b ? (a + b) / 2 : Math.min(b, Math.max(a, v)));

export const softCamera = (frame: number, keys: CamPoint[], b: { vw: number; vh: number; ph: number }, fps: number) => {
  if (keys.length === 0) return { zoom: 1, x: b.vw / 2, y: b.vh / 2 };
  const ck = keys.map((k) => {
    const z = Math.max(1, k.zoom);
    const hx = b.vw / (2 * z), hy = b.vh / (2 * z);
    return { f: k.f, lz: Math.log(z), x: lim(k.x, hx, b.vw - hx), y: lim(k.y, hy, b.ph - hy) };
  });
  const target = (f: number) => {
    if (f <= ck[0].f) return ck[0];
    for (let i = 0; i < ck.length - 1; i++) {
      const a = ck[i], c = ck[i + 1];
      if (f <= c.f) {
        const p = sine(Math.min(1, Math.max(0, (f - a.f) / Math.max(1, c.f - a.f))));
        return { f, lz: a.lz + (c.lz - a.lz) * p, x: a.x + (c.x - a.x) * p, y: a.y + (c.y - a.y) * p };
      }
    }
    return ck[ck.length - 1];
  };
  const t0 = target(0);
  const s = { lz: t0.lz, x: t0.x, y: t0.y };
  const v = { lz: 0, x: 0, y: 0 };
  const SUB = 2, dt = 1 / fps / SUB, w2 = OMEGA * OMEGA, w2x = 2 * OMEGA;
  for (let f = 1; f <= Math.floor(frame); f++) {
    const t = target(f);
    for (let k = 0; k < SUB; k++) {
      for (const p of ['lz', 'x', 'y'] as const) {
        v[p] += (w2 * (t[p] - s[p]) - w2x * v[p]) * dt;
        s[p] += v[p] * dt;
      }
    }
  }
  const zoom = Math.max(1, Math.exp(s.lz));
  const hx = b.vw / (2 * zoom), hy = b.vh / (2 * zoom);
  return { zoom, x: lim(s.x, hx, b.vw - hx), y: lim(s.y, hy, b.ph - hy) };
};
