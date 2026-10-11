import { FPS } from '../../brand/tokens';
import { VOS, voFrames, voSpeechFrames, wordFrame } from '../../lib/vo';
import cfg from '../../../public/nxr/vo/vo.json';

// Reseña de Nextory + cómo conseguir 30 días gratis.
// Sin locución, las duraciones y los tiempos de palabra se estiman (≈13 caracteres/s a velocidad 1,13).
const CPS = 13;
export const sec = (s: number) => Math.round(s * FPS);
const textOf = (id: string) => (cfg.scenes as { id: string; text: string }[]).find((s) => s.id === id)?.text ?? '';
export const hasVO = (id: string) => Boolean(VOS[id]);
export const speechFrames = (id: string) => (hasVO(id) ? voSpeechFrames(id) : sec(textOf(id).length / CPS));
export const fullFrames = (id: string) => (hasVO(id) ? voFrames(id) : sec(textOf(id).length / CPS + 0.25));

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const estSec = (id: string, word: string, nth = 0) => {
  const t = norm(textOf(id));
  const w = norm(word);
  let i = -1;
  for (let k = 0; k <= nth; k++) { i = t.indexOf(w, i + 1); if (i < 0) break; }
  return Math.max(0, i) / CPS;
};
// Fotograma (relativo al inicio de la locución) de una palabra: exacto con locución, estimado sin ella.
// Con locución, la estimación se escala a la duración real de la voz para elegir bien entre palabras repetidas.
const voScale = (id: string) => (hasVO(id) ? (VOS[id].speechEnd ?? VOS[id].duration) / Math.max(0.1, textOf(id).length / CPS) : 1);
export const wf = (id: string, word: string, nth = 0) => wordFrame(id, word, nth, (estSec(id, word, nth) || 0.001) * voScale(id));

export type VoPart = { id: string; at: number };
export type SceneDef = { id: string; vo: VoPart[]; lead: number; dur: number };
const LEAD = sec(0.12);
const TAIL = sec(0.32);
const simple = (id: string, extra = 0, lead = LEAD): SceneDef => ({ id, vo: [{ id, at: lead }], lead, dur: lead + speechFrames(id) + TAIL + extra });

export const NXR_SCENES: SceneDef[] = [
  simple('R01', 20, sec(0.5)),
  simple('R02', 15),
  simple('R03', 25),
  simple('R04', 20),
  simple('R04B', 15),
  simple('R05', 15),
  simple('R06', 20),
  simple('R07', 20, sec(1.8)),
  simple('R08', 10),
  simple('R09', 15),
  simple('R10', 25),
  simple('R11', 15),
  simple('R12', 15),
  simple('R13', 25),
  simple('R14', 20),
  simple('P01', 15),
  simple('P02', 10),
  simple('P03', 15),
  simple('P04', 10),
  simple('P05', 20),
  simple('P06', 170),
];

export const nxrStart = (id: string) => {
  let a = 0;
  for (const s of NXR_SCENES) { if (s.id === id) return a; a += s.dur; }
  return a;
};
export const NXR_TOTAL = NXR_SCENES.reduce((a, s) => a + s.dur, 0);
export const nxrVoIntervals = () => NXR_SCENES.flatMap((s) => s.vo.map((v) => [nxrStart(s.id) + v.at, nxrStart(s.id) + v.at + fullFrames(v.id)] as const));

// Capítulos de la reseña (barra superior) y de la parte de la prueba gratuita.
export const NXR_CHAPTERS: { label: string; from: string }[] = [
  { label: 'Qué es', from: 'R02' },
  { label: 'Precios', from: 'R03' },
  { label: 'La app', from: 'R04' },
  { label: 'Leer', from: 'R06' },
  { label: 'Escuchar', from: 'R07' },
  { label: 'Extras', from: 'R08' },
  { label: 'Veredicto', from: 'R13' },
  { label: '30 días gratis', from: 'P01' },
];
