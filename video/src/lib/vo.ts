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
// Tutorial de Nextory (ids N.. y T.. para el vertical).
const ctx3 = req.context('../../public/nx/vo', false, /[NT]\d+[A-Z]?\.json$/);
// Reseña de Nextory + prueba de 30 días (ids R.. y P..; Q.. para el vertical).
const ctx4 = req.context('../../public/nxr/vo', false, /[RPQ]\d+[A-Z]?\.json$/);
// Reseña de Podimo + prueba de 30 días (ids K.. y L..; M.. para el vertical).
const ctx5 = req.context('../../public/pdr/vo', false, /[KLM]\d+[A-Z]?\.json$/);
// Reseña de Storytel + prueba de 7 días (ids A.. y B..; C.. para el vertical).
const ctx6 = req.context('../../public/str/vo', false, /[ABC]\d+[A-Z]?\.json$/);
// Reseña de Audible + prueba de 30 días (ids G.. y H..; J.. para el vertical).
const ctx7 = req.context('../../public/aud/vo', false, /[GHJ]\d+[A-Z]?\.json$/);
// Reseña de Audiobooks.com + prueba de 30 días (ids D.. y F..; U.. para el vertical).
const ctx8 = req.context('../../public/abc/vo', false, /[DFU]\d+[A-Z]?\.json$/);
// Vídeo «Las mejores plataformas de audiolibros en español» (ids Z..; O.. para el vertical).
const ctx9 = req.context('../../public/mp/vo', false, /[ZO]\d+[A-Z]?\.json$/);
// Tutorial «Cómo cancelar la suscripción en 8 apps de audiolibros» (ids X..; Y.. para los verticales).
const ctx10 = req.context('../../public/cnl/vo', false, /[XY]\d+[A-Z]?\.json$/);
export const VOS: Record<string, VO & { speechEnd?: number }> = {};
for (const k of ctx1.keys()) { const v = ctx1(k); VOS[v.id] = v; }
for (const k of ctx2.keys()) { const v = ctx2(k); VOS[v.id] = v; }
for (const k of ctx3.keys()) { const v = ctx3(k); VOS[v.id] = v; }
for (const k of ctx4.keys()) { const v = ctx4(k); VOS[v.id] = v; }
for (const k of ctx5.keys()) { const v = ctx5(k); VOS[v.id] = v; }
for (const k of ctx6.keys()) { const v = ctx6(k); VOS[v.id] = v; }
for (const k of ctx7.keys()) { const v = ctx7(k); VOS[v.id] = v; }
for (const k of ctx8.keys()) { const v = ctx8(k); VOS[v.id] = v; }
for (const k of ctx9.keys()) { const v = ctx9(k); VOS[v.id] = v; }
for (const k of ctx10.keys()) { const v = ctx10(k); VOS[v.id] = v; }

const dirOf = (id: string) => (/^[XY]\d/.test(id) ? 'cnl/vo' : /^[ZO]\d/.test(id) ? 'mp/vo' : /^[DFU]\d/.test(id) ? 'abc/vo' : /^[GHJ]\d/.test(id) ? 'aud/vo' : /^[ABC]\d/.test(id) ? 'str/vo' : /^[KLM]\d/.test(id) ? 'pdr/vo' : /^[RPQ]\d/.test(id) ? 'nxr/vo' : /^[NT]\d/.test(id) ? 'nx/vo' : id.startsWith('V') ? 'elt/vo2' : 'elt/vo');
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
