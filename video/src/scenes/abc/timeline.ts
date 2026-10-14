import { FPS } from '../../brand/tokens';
import { VOS, voFrames, voSpeechFrames, wordFrame } from '../../lib/vo';
import cfg from '../../../public/abc/vo/vo.json';

// Reseña de Audiobooks.com + cómo probarlo 30 días gratis desde SonorBooks (mismo sistema que las reseñas de Audible y Storytel).
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
const voScale = (id: string) => (hasVO(id) ? (VOS[id].speechEnd ?? VOS[id].duration) / Math.max(0.1, textOf(id).length / CPS) : 1);
export const wf = (id: string, word: string, nth = 0) => wordFrame(id, word, nth, (estSec(id, word, nth) || 0.001) * voScale(id));

export type VoPart = { id: string; at: number };
// `bump`: título del separador de sección que tapa el arranque de la escena (la escena se dibuja desde `pre`).
// `tin`: cómo entra la escena si no hay separador ('push' = acercamiento con desenfoque, 'cut' = corte, el móvil enlaza solo).
export type SceneDef = { id: string; vo: VoPart[]; lead: number; dur: number; bump?: string; pre: number; tin: 'push' | 'cut' | 'slide' };
const LEAD = sec(0.12);
const TAIL = sec(0.32);
export const BUMP_PRE = 12;
const simple = (id: string, extra = 0, lead = LEAD, bump?: string, tin: SceneDef['tin'] = 'push'): SceneDef => ({
  id, vo: [{ id, at: lead }], lead, dur: lead + speechFrames(id) + TAIL + extra, bump, pre: bump ? BUMP_PRE : 0, tin: bump ? 'cut' : tin,
});

export const ABC_SCENES: SceneDef[] = [
  simple('D01', 12, sec(0.5)),
  simple('D02', 14, sec(0.52), '¿Qué es Audiobooks.com?'),
  simple('D03', 18, sec(0.52), 'Cómo funciona'),
  simple('D04', 16),
  simple('D05', 10, sec(0.52), 'La app por dentro'),
  simple('D06', 12, sec(0.2), undefined, 'cut'),
  simple('D07', 12, sec(0.2), undefined, 'cut'),
  simple('D08', 16, sec(0.2), undefined, 'cut'),
  simple('D09', 16, sec(0.52), 'Familia y dispositivos'),
  simple('D10', 18, sec(0.52), 'Opiniones'),
  simple('D11', 20, sec(0.52), 'Lo bueno y lo malo'),
  simple('D12', 20, sec(0.52), 'Veredicto'),
  simple('F01', 36, sec(0.52), '30 días gratis'),
  simple('F02', 16),
  simple('F03', 14, LEAD, undefined, 'slide'),
  simple('F04', 18),
  simple('F05', 16),
  simple('F06', 170),
];
export const ABC_BUMPS = ABC_SCENES.filter((s) => s.bump).map((s) => s.id);
// Escenas de la app con el móvil a un lado: entre dos seguidas (sin separador) el móvil se desliza por el centro y enlaza.
export const ABC_APP = ['D05', 'D06', 'D07', 'D08'];

export const abcStart = (id: string) => {
  let a = 0;
  for (const s of ABC_SCENES) { if (s.id === id) return a; a += s.dur; }
  return a;
};
export const ABC_TOTAL = ABC_SCENES.reduce((a, s) => a + s.dur, 0);
export const abcVoIntervals = () => ABC_SCENES.flatMap((s) => s.vo.map((v) => [abcStart(s.id) + v.at, abcStart(s.id) + v.at + fullFrames(v.id)] as const));

// Capítulos de YouTube (descripción): tools/abc_meta.py los lee de aquí. Cada uno dura más de 10 s.
export const ABC_CHAPTERS: { label: string; from: string }[] = [
  { label: 'Qué es Audiobooks.com', from: 'D02' },
  { label: 'Cómo funciona: créditos, VIP y precio', from: 'D03' },
  { label: '¿Hay audiolibros en español?', from: 'D04' },
  { label: 'La app: el buscador solo en inglés', from: 'D05' },
  { label: 'Fichas, muestras y el crédito', from: 'D06' },
  { label: 'Reproductor: hasta 4x, temporizador y descargas', from: 'D07' },
  { label: '10.000 audiolibros gratis sin suscripción', from: 'D08' },
  { label: 'Plan familiar y dispositivos', from: 'D09' },
  { label: 'Opiniones: App Store y Google Play', from: 'D10' },
  { label: 'Lo bueno y lo malo de Audiobooks.com', from: 'D11' },
  { label: 'Veredicto: ¿merece la pena desde España?', from: 'D12' },
  { label: 'Cómo probarlo 30 días gratis y cancelar', from: 'F01' },
];
