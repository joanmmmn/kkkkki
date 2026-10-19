import { staticFile } from 'remotion';
import { FPS } from '../brand/tokens';

// Locuciones de SonorBooks Polska: public/pl/<pieza>/vo/<ID>.json (+ .mp3), generadas con tools/tts.py y tools/vo_post.py.
// Se guardan con la clave «<pieza>/<ID>» para que los ID de las distintas piezas no choquen con los de España.
export type PLWord = { w: string; s: number; e: number };
export type PLVO = { id: string; duration: number; speechEnd?: number; words: PLWord[]; text: string };

type Ctx = { keys(): string[]; (k: string): PLVO };
const req = require as unknown as { context: (p: string, deep: boolean, re: RegExp) => Ctx };
const ctx = req.context('../../public/pl', true, /^\.\/[a-z0-9-]+\/vo\/[A-Z]\d+[A-Z]?\.json$/);
export const PL_VOS: Record<string, PLVO> = {};
for (const k of ctx.keys()) {
  const m = k.match(/^\.\/([a-z0-9-]+)\/vo\/([A-Z]\d+[A-Z]?)\.json$/);
  if (m) PL_VOS[`${m[1]}/${m[2]}`] = ctx(k);
}

export const plKey = (slug: string, id: string) => `${slug}/${id}`;
export const plHasVO = (slug: string, id: string) => Boolean(PL_VOS[plKey(slug, id)]);
export const plVoSrc = (slug: string, id: string) => staticFile(`pl/${slug}/vo/${id}.mp3`);

// Sin locución (antes de generarla), las duraciones se estiman con la velocidad media de la voz polaca.
export const PL_CPS = 15.5;
const sec = (s: number) => Math.round(s * FPS);

// Minúsculas, sin tildes ni signos; la «ł» no se descompone con NFD, así que se cambia a mano.
export const plNorm = (s: string) =>
  s.toLowerCase().replace(/ł/g, 'l').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');

export const plSpeechFrames = (slug: string, id: string, text: string) => {
  const v = PL_VOS[plKey(slug, id)];
  if (!v) return sec(text.length / PL_CPS);
  return Math.ceil((v.speechEnd ?? v.duration) * FPS);
};
export const plFullFrames = (slug: string, id: string, text: string) => {
  const v = PL_VOS[plKey(slug, id)];
  if (!v) return sec(text.length / PL_CPS + 0.25);
  return Math.ceil(v.duration * FPS);
};

// Fotograma (desde el inicio de la locución) en que empieza la palabra `word` (prefijo, sin tildes) en su aparición `nth`.
// Sin locución: estimado por la posición del texto. Si la palabra no está, se devuelve `fallback` (o 0) y se avisa en consola.
export const plWordFrame = (slug: string, id: string, text: string, word: string, nth = 0): number => {
  const target = plNorm(word);
  const v = PL_VOS[plKey(slug, id)];
  if (v) {
    const hits = v.words.filter((w) => plNorm(w.w).startsWith(target));
    if (hits.length) return Math.round(hits[Math.min(nth, hits.length - 1)].s * FPS);
  }
  // Estimación por posición del carácter en el texto.
  const words = text.split(/\s+/);
  let pos = 0;
  let seen = 0;
  for (const w of words) {
    if (plNorm(w).startsWith(target)) {
      if (seen === nth) {
        const total = Math.max(1, text.length);
        const dur = v ? (v.speechEnd ?? v.duration) : text.length / PL_CPS;
        return Math.round((pos / total) * dur * FPS);
      }
      seen += 1;
    }
    pos += w.length + 1;
  }
  if (typeof console !== 'undefined') console.warn(`[pl] palabra no encontrada: ${slug}/${id} «${word}» (${nth})`);
  return 0;
};
