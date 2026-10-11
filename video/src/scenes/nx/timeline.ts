import { FPS } from '../../brand/tokens';
import { VOS, voFrames, voSpeechFrames, wordFrame } from '../../lib/vo';
import cfg from '../../../public/nx/vo/vo.json';

// Tutorial «Cómo conseguir 30 días gratis de Nextory desde SonorBooks».
// Mientras no exista la locución, las duraciones y los tiempos de palabra se estiman (≈13 caracteres/s a velocidad 1,13).
const CPS = 13;
const sec = (s: number) => Math.round(s * FPS);
const textOf = (id: string) => (cfg.scenes as { id: string; text: string }[]).find((s) => s.id === id)?.text ?? '';
export const hasVO = (id: string) => Boolean(VOS[id]);
export const speechFrames = (id: string) => (hasVO(id) ? voSpeechFrames(id) : sec(textOf(id).length / CPS));
export const fullFrames = (id: string) => (hasVO(id) ? voFrames(id) : sec(textOf(id).length / CPS + 0.25));

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
// Segundo estimado en que empieza la n-ésima aparición de `word` en el texto de la escena.
const estSec = (id: string, word: string, nth = 0) => {
  const t = norm(textOf(id));
  const w = norm(word);
  let i = -1;
  for (let k = 0; k <= nth; k++) { i = t.indexOf(w, i + 1); if (i < 0) break; }
  return Math.max(0, i) / CPS;
};
// Fotograma (relativo al inicio de la locución) de una palabra: exacto con locución, estimado sin ella.
export const wf = (id: string, word: string, nth = 0) => wordFrame(id, word, nth, estSec(id, word, nth) || 0.001);

export type VoPart = { id: string; at: number };
export type SceneDef = { id: string; vo: VoPart[]; lead: number; dur: number };
const LEAD = sec(0.12);
const TAIL = sec(0.32);
// `extra`: fotogramas de más al final de la escena (para que respire la animación).
const simple = (id: string, extra = 0, lead = LEAD): SceneDef => ({ id, vo: [{ id, at: lead }], lead, dur: lead + speechFrames(id) + TAIL + extra });

export const NX_SCENES: SceneDef[] = [
  simple('N01', 23),
  simple('N02', 10),
  simple('N03', 18),
  simple('N04', 30),
  simple('N05'),
  simple('N06', 10),
  simple('N07', 15),
  simple('N08', 15),
  simple('N09', 170),
];

export const nxStart = (id: string) => {
  let a = 0;
  for (const s of NX_SCENES) { if (s.id === id) return a; a += s.dur; }
  return a;
};
export const NX_TOTAL = NX_SCENES.reduce((a, s) => a + s.dur, 0);
export const nxVoIntervals = () => NX_SCENES.flatMap((s) => s.vo.map((v) => [nxStart(s.id) + v.at, nxStart(s.id) + v.at + fullFrames(v.id)] as const));
