import { staticFile } from 'remotion';
import { FPS } from '../brand/tokens';

export type Word = { w: string; s: number; e: number };
export type VO = { id: string; duration: number; words: Word[]; text: string };

// Carga (en tiempo de bundle) todas las locuciones generadas por tools/tts.py.
const ctx = (require as unknown as { context: (p: string, deep: boolean, re: RegExp) => { keys(): string[]; (k: string): VO } })
  .context('../../public/elt/vo', false, /E\d+[A-Z]?\.json$/);
export const VOS: Record<string, VO> = {};
for (const k of ctx.keys()) {
  const v = ctx(k);
  VOS[v.id] = v;
}

export const voSrc = (id: string) => staticFile(`elt/vo/${id}.mp3`);
export const voFrames = (id: string) => Math.ceil((VOS[id]?.duration ?? 3) * FPS);

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9,]/g, '');

// Fotograma (relativo al inicio de la locución) en que empieza la palabra `word` (n-ésima aparición).
export const wordFrame = (id: string, word: string, nth = 0, fallbackSec = 0) => {
  const v = VOS[id];
  if (!v) return Math.round(fallbackSec * FPS);
  const target = norm(word);
  let count = 0;
  for (const w of v.words) {
    if (norm(w.w).startsWith(target)) {
      if (count === nth) return Math.round(w.s * FPS);
      count++;
    }
  }
  return Math.round(fallbackSec * FPS);
};
