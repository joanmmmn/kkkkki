import { Easing, interpolate } from 'remotion';

export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeSoft = Easing.bezier(0.45, 0, 0.2, 1);
// Cuadráticas: con la misma duración y el mismo recorrido, la salida (easeInQuad) termina a la misma velocidad
// con la que empieza la entrada (easeOutQuad); así un movimiento repartido entre dos escenas no se detiene en el corte.
export const easeInQuad = (t: number) => t * t;
export const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

export const fadeIn = (frame: number, start: number, dur = 12) => interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing: easeOut });
export const fadeOut = (frame: number, end: number, dur = 12) => interpolate(frame, [end - dur, end], [1, 0], { ...clamp, easing: easeInOut });

export type Key = { f: number; [k: string]: number };
// Interpola varios valores a lo largo de fotogramas clave con curva suave entre cada par.
// Un tramo puede llevar su propia curva con `ez` en la clave donde empieza: 1 = acelera (easeInQuad), 2 = frena (easeOutQuad).
export const keyframes = (frame: number, keys: Key[], prop: string, easing = easeInOut) => {
  if (keys.length === 0) return 0;
  if (frame <= keys[0].f) return keys[0][prop];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    const e = a.ez === 1 ? easeInQuad : a.ez === 2 ? easeOutQuad : easing;
    if (frame <= b.f) return interpolate(frame, [a.f, b.f], [a[prop], b[prop]], { ...clamp, easing: e });
  }
  return keys[keys.length - 1][prop];
};

// Formato español con punto de millares siempre (Intl no agrupa los números de 4 cifras en es-ES).
export const fmtEs = (n: number, decimals = 0) => {
  const [int, dec] = n.toFixed(decimals).split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return dec ? `${grouped},${dec}` : grouped;
};
