import { staticFile } from 'remotion';
import { FPS } from '../brand/tokens';

export type Word = { w: string; s: number; e: number };
export type VO = { id: string; duration: number; words: Word[]; text: string };

// Carga (en tiempo de bundle) todas las locuciones generadas por tools/tts.py.
type Ctx = { keys(): string[]; (k: string): VO };
const req = require as unknown as { context: (p: string, deep: boolean, re: RegExp) => Ctx };
// v1 (voz Mature, ids E..) y v2 (voz Energetic, ids V..).
const ctx1 = req.context('../../public/elt/vo', false, /(E\d+[A-Z]?|S\d+)\.json$/);
const ctx2 = req.context('../../public/elt/vo2', false, /V\d+\.json$/);
// Tutorial de ElevenReader (ids R..).
const ctx4 = req.context('../../public/er/vo', false, /R\d+[A-Z]?\.json$/);
export const VOS: Record<string, VO & { speechEnd?: number }> = {};
for (const k of ctx1.keys()) { const v = ctx1(k); VOS[v.id] = v; }
for (const k of ctx2.keys()) { const v = ctx2(k); VOS[v.id] = v; }
for (const k of ctx4.keys()) { const v = ctx4(k); VOS[v.id] = v; }

const dirOf = (id: string) => (/^R\d/.test(id) ? 'er/vo' : id.startsWith('V') ? 'elt/vo2' : 'elt/vo');
export const voSrc = (id: string) => staticFile(`${dirOf(id)}/${id}.mp3`);
export const voFrames = (id: string) => Math.ceil((VOS[id]?.duration ?? 3) * FPS);
// Duración hasta el final real de la voz (sin el silencio final del archivo).
export const voSpeechFrames = (id: string) => Math.ceil((VOS[id]?.speechEnd ?? VOS[id]?.duration ?? 3) * FPS);

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9,]/g, '');

// Fotograma (relativo al inicio de la locución) en que empieza la palabra `word`.
// Si se da `fallbackSec`, se elige la aparición más cercana a ese instante (evita confundir
// palabras repetidas como «y» o «en»); si no, la n-ésima aparición.
export const wordFrame = (id: string, word: string, nth = 0, fallbackSec = 0) => {
  const v = VOS[id];
  if (!v) return Math.round(fallbackSec * FPS);
  const target = norm(word);
  const hits = v.words.filter((w) => norm(w.w).startsWith(target));
  if (!hits.length) return Math.round(fallbackSec * FPS);
  const pick = fallbackSec > 0
    ? hits.reduce((a, b) => (Math.abs(b.s - fallbackSec) < Math.abs(a.s - fallbackSec) ? b : a))
    : hits[Math.min(nth, hits.length - 1)];
  return Math.round(pick.s * FPS);
};
