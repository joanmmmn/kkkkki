import { FPS } from '../../brand/tokens';
import { VOS, voFrames, voSpeechFrames, wordFrame } from '../../lib/vo';
import cfg from '../../../public/bkb/vo/vo.json';

// Reseña de BookBeat + cómo probarlo 30 días gratis en su web (mismo sistema que las reseñas de Podimo, Storytel y Audible).
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

export const BKB_SCENES: SceneDef[] = [
  simple('D01', 12, sec(0.5)),
  simple('D02', 14, sec(0.52), '¿Qué es BookBeat?'),
  simple('D03', 18, sec(0.52), 'Precios y planes'),
  simple('D04', 16, sec(0.52), 'Dos avisos'),
  simple('D05', 18),
  simple('D06', 10, sec(0.52), 'La app por dentro'),
  simple('D07', 12, sec(0.2), undefined, 'cut'),
  simple('D08', 12, sec(0.2), undefined, 'cut'),
  simple('D09', 24, sec(0.2), undefined, 'cut'), // +10 f: el capítulo «Ebooks» pasa de 10 s (YouTube los pide de 10 s o más)
  simple('D10', 18, sec(0.52), 'Horas y perfiles'),
  simple('D11', 16, sec(0.52), 'Dónde escuchar'),
  simple('D12', 18, sec(0.52), 'Opiniones'),
  simple('D13', 20, sec(0.52), 'Lo bueno y lo malo'),
  simple('D14', 20, sec(0.52), 'Veredicto'),
  simple('F01', 12, sec(0.52), '30 días gratis'),
  simple('F02', 16),
  simple('F03', 14, LEAD, undefined, 'slide'),
  simple('F04', 18),
  simple('F05', 16),
  simple('F06', 170),
];
export const BKB_BUMPS = BKB_SCENES.filter((s) => s.bump).map((s) => s.id);
// Escenas de la app con el móvil a un lado: entre dos seguidas (sin separador) el móvil se desliza por el centro y enlaza.
export const BKB_APP = ['D06', 'D07', 'D08', 'D09'];

export const bkbStart = (id: string) => {
  let a = 0;
  for (const s of BKB_SCENES) { if (s.id === id) return a; a += s.dur; }
  return a;
};
export const BKB_TOTAL = BKB_SCENES.reduce((a, s) => a + s.dur, 0);
export const bkbVoIntervals = () => BKB_SCENES.flatMap((s) => s.vo.map((v) => [bkbStart(s.id) + v.at, bkbStart(s.id) + v.at + fullFrames(v.id)] as const));

// Capítulos de YouTube (descripción): tools/bkb_meta.py los lee de aquí. Cada uno dura más de 10 s.
export const BKB_CHAPTERS: { label: string; from: string }[] = [
  { label: 'Qué es BookBeat', from: 'D02' },
  { label: 'Precio de BookBeat: Basic, Standard y Premium', from: 'D03' },
  { label: 'Ojo: la app está en inglés', from: 'D04' },
  { label: '¿Qué hay en español? El catálogo', from: 'D05' },
  { label: 'La app por dentro: portada, inspiración y categorías', from: 'D06' },
  { label: 'Buscador y fichas', from: 'D07' },
  { label: 'Reproductor: velocidad, temporizador y descargas', from: 'D08' },
  { label: 'Ebooks: leer en la misma cuota', from: 'D09' },
  { label: 'Cómo se cuentan las horas y perfiles', from: 'D10' },
  { label: 'Dispositivos (y por qué no hay web)', from: 'D11' },
  { label: 'Opiniones: Google Play y App Store', from: 'D12' },
  { label: 'Lo bueno y lo malo de BookBeat', from: 'D13' },
  { label: 'Veredicto: ¿merece la pena?', from: 'D14' },
  { label: 'Cómo probar BookBeat 30 días gratis y cancelar', from: 'F01' },
];
