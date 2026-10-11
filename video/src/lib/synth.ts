import { CursorPoint } from '../components/Cursor';

// Trayectoria de ratón sintética (para capturas fijas sin cursor grabado), con la misma curva que tools/record.mjs:
// easeInOutCubic con un ligero arco perpendicular. Tiempos en segundos de la grabación/escena.
export type Way = { t: number; x: number; y: number; dur?: number; click?: boolean };

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export const synthCursor = (start: [number, number], ways: Way[], step = 1 / 100): CursorPoint[] => {
  const pts: CursorPoint[] = [];
  let [x, y] = start;
  pts.push({ t: 0, x, y, down: false });
  for (const w of ways) {
    const dur = w.dur ?? 0.6;
    pts.push({ t: w.t, x, y, down: false });
    const dx = w.x - x, dy = w.y - y;
    const dist = Math.hypot(dx, dy) || 1;
    const bend = Math.min(80, dist * 0.12);
    const nx = -dy / dist, ny = dx / dist;
    if (dist > 0.5) {
      for (let s = step; s < dur; s += step) {
        const e = ease(s / dur);
        const arc = Math.sin(Math.PI * e) * bend;
        pts.push({ t: +(w.t + s).toFixed(3), x: x + dx * e + nx * arc, y: y + dy * e + ny * arc, down: false });
      }
    }
    x = w.x; y = w.y;
    const end = w.t + (dist > 0.5 ? dur : 0);
    pts.push({ t: +end.toFixed(3), x, y, down: false });
    if (w.click) {
      pts.push({ t: +(end + 0.06).toFixed(3), x, y, down: true });
      pts.push({ t: +(end + 0.15).toFixed(3), x, y, down: false });
    }
  }
  return pts.sort((a, b) => a.t - b.t);
};
