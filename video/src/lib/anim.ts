import { Easing, interpolate } from 'remotion';

export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeSoft = Easing.bezier(0.45, 0, 0.2, 1);

export const fadeIn = (frame: number, start: number, dur = 12) => interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing: easeOut });
export const fadeOut = (frame: number, end: number, dur = 12) => interpolate(frame, [end - dur, end], [1, 0], { ...clamp, easing: easeInOut });

export type Key = { f: number; [k: string]: number };
// Interpola varios valores a lo largo de fotogramas clave con curva suave entre cada par.
export const keyframes = (frame: number, keys: Key[], prop: string, easing = easeInOut) => {
  if (keys.length === 0) return 0;
  if (frame <= keys[0].f) return keys[0][prop];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (frame <= b.f) return interpolate(frame, [a.f, b.f], [a[prop], b[prop]], { ...clamp, easing });
  }
  return keys[keys.length - 1][prop];
};

// Formato español con punto de millares siempre (Intl no agrupa los números de 4 cifras en es-ES).
export const fmtEs = (n: number, decimals = 0) => {
  const [int, dec] = n.toFixed(decimals).split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return dec ? `${grouped},${dec}` : grouped;
};

// Interpolación de cámara: curva cúbica monótona (PCHIP) a través de todos los fotogramas clave.
// A diferencia de `keyframes` (una curva de entrada/salida por tramo, que se detiene en cada clave),
// la velocidad es continua entre tramos: el movimiento fluye sin «trompicones» y nunca se pasa de largo.
// Los extremos arrancan y terminan en reposo. Con `log`, interpola en escala logarítmica (zoom perceptualmente uniforme).
export const smoothKeyframes = (frame: number, keys: Key[], prop: string, log = false) => {
  const n = keys.length;
  if (n === 0) return 0;
  const val = (k: Key) => (log ? Math.log(k[prop]) : k[prop]);
  const out = (v: number) => (log ? Math.exp(v) : v);
  if (n === 1 || frame <= keys[0].f) return keys[0][prop];
  if (frame >= keys[n - 1].f) return keys[n - 1][prop];
  const t = keys.map((k) => k.f), y = keys.map(val);
  const h = t.slice(0, -1).map((ti, i) => Math.max(1e-6, t[i + 1] - ti));
  const d = h.map((hi, i) => (y[i + 1] - y[i]) / hi);
  const m = new Array(n).fill(0);
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] * d[i] <= 0) continue; // cambio de sentido o tramo quieto: tangente nula
    const w1 = 2 * h[i] + h[i - 1], w2 = h[i] + 2 * h[i - 1];
    m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]);
  }
  let i = 0;
  while (i < n - 2 && frame > t[i + 1]) i++;
  const s = (frame - t[i]) / h[i];
  const s2 = s * s, s3 = s2 * s;
  const v = (2 * s3 - 3 * s2 + 1) * y[i] + (s3 - 2 * s2 + s) * h[i] * m[i] + (-2 * s3 + 3 * s2) * y[i + 1] + (s3 - s2) * h[i] * m[i + 1];
  return out(v);
};
