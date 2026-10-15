import { FPS } from '../../brand/tokens';
import { VOS, voFrames, voSpeechFrames, wordFrame } from '../../lib/vo';
import cfg from '../../../public/spo/vo/vo.json';

// Reseña de los audiolibros de Spotify + cómo empezar, ver tus horas y cancelar (mismo sistema que las reseñas de Podimo,
// Storytel, Audible y BookBeat). Sin locución, las duraciones y los tiempos de palabra se estiman (≈15 caracteres/s a 1,13).
const CPS = 15;
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

export const SPO_SCENES: SceneDef[] = [
  simple('U01', 12, sec(0.5)),
  simple('U02', 14, sec(0.52), '¿Cómo funcionan?'),
  simple('U03', 18, sec(0.52), 'Planes y precios'),
  simple('U04', 16, sec(0.52), 'Las 12 horas'),
  simple('U05', 18),
  simple('U06', 16),
  simple('U07', 18, sec(0.52), 'El catálogo'),
  simple('U08', 12, sec(0.52), 'La app por dentro'),
  simple('U09', 12, sec(0.2), undefined, 'cut'),
  simple('U10', 12, sec(0.2), undefined, 'cut'),
  simple('U11', 14, sec(0.2), undefined, 'cut'),
  simple('U12', 18),
  simple('U13', 18, sec(0.52), 'Opiniones'),
  simple('U14', 20, sec(0.52), 'Lo bueno y lo malo'),
  simple('U15', 20, sec(0.52), 'Veredicto'),
  simple('X01', 12, sec(0.52), 'Cómo empezar'),
  simple('X02', 16),
  simple('X03', 14, LEAD, undefined, 'slide'),
  simple('X04', 16),
  simple('X05', 170),
];
export const SPO_BUMPS = SPO_SCENES.filter((s) => s.bump).map((s) => s.id);
// Escenas de la app con el móvil a un lado: entre dos seguidas (sin separador) el móvil se desliza por el centro y enlaza.
export const SPO_APP = ['U08', 'U09', 'U10', 'U11'];

export const spoStart = (id: string) => {
  let a = 0;
  for (const s of SPO_SCENES) { if (s.id === id) return a; a += s.dur; }
  return a;
};
export const SPO_TOTAL = SPO_SCENES.reduce((a, s) => a + s.dur, 0);
export const spoVoIntervals = () => SPO_SCENES.flatMap((s) => s.vo.map((v) => [spoStart(s.id) + v.at, spoStart(s.id) + v.at + fullFrames(v.id)] as const));

// Capítulos de YouTube (descripción): tools/spo_meta.py los lee de aquí. Cada uno dura más de 10 s.
export const SPO_CHAPTERS: { label: string; from: string }[] = [
  { label: 'Cómo funcionan los audiolibros de Spotify', from: 'U02' },
  { label: 'Qué planes los incluyen y cuánto cuestan', from: 'U03' },
  { label: 'Cómo se gastan las 12 horas (y para cuánto dan)', from: 'U04' },
  { label: 'Más horas: Audiolibros+ y recargas', from: 'U06' },
  { label: '¿Qué hay en español? El catálogo', from: 'U07' },
  { label: 'La app por dentro: la sección Audiolibros', from: 'U08' },
  { label: 'Buscar, fichas y muestras gratis', from: 'U09' },
  { label: 'El reproductor', from: 'U10' },
  { label: 'Encuentra la página y dispositivos', from: 'U11' },
  { label: 'Opiniones: App Store y Google Play', from: 'U13' },
  { label: 'Lo bueno y lo malo', from: 'U14' },
  { label: 'Veredicto: ¿merecen la pena?', from: 'U15' },
  { label: 'Cómo empezar, ver tus horas y cancelar', from: 'X01' },
];
