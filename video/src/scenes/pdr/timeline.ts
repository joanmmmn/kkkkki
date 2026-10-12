import { FPS } from '../../brand/tokens';
import { VOS, voFrames, voSpeechFrames, wordFrame } from '../../lib/vo';
import cfg from '../../../public/pdr/vo/vo.json';

// Reseña de Podimo + cómo probarlo 30 días gratis (mismo sistema que la reseña de Nextory).
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

export const PDR_SCENES: SceneDef[] = [
  simple('K01', 12, sec(0.5)),
  simple('K02', 12, sec(0.52), '¿Qué es Podimo?'),
  simple('K03', 18, sec(0.52), 'Precios y planes'),
  simple('K04', 10, sec(0.52), 'La app por dentro'),
  simple('K05', 14, sec(0.2), undefined, 'cut'),
  simple('K06', 12, sec(0.2), undefined, 'cut'),
  simple('K07', 16, sec(0.2), undefined, 'cut'),
  simple('K08', 22, sec(0.52), 'Horas y dispositivos'),
  simple('K09', 14),
  simple('K10', 18, sec(0.52), 'Opiniones'),
  simple('K11', 20, sec(0.52), 'Lo bueno y lo malo'),
  simple('K12', 18, sec(0.52), 'Veredicto'),
  simple('L01', 12, sec(0.52), '30 días gratis'),
  simple('L02', 18),
  simple('L03', 12, LEAD, undefined, 'slide'),
  simple('L04', 10, LEAD, undefined, 'slide'),
  simple('L05', 16),
  simple('L06', 170),
];
export const PDR_BUMPS = PDR_SCENES.filter((s) => s.bump).map((s) => s.id);
// Escenas de la app con el móvil a un lado: entre dos seguidas (sin separador) el móvil se desliza por el centro y enlaza.
export const PDR_APP = ['K04', 'K05', 'K06', 'K07'];

export const pdrStart = (id: string) => {
  let a = 0;
  for (const s of PDR_SCENES) { if (s.id === id) return a; a += s.dur; }
  return a;
};
export const PDR_TOTAL = PDR_SCENES.reduce((a, s) => a + s.dur, 0);
export const pdrVoIntervals = () => PDR_SCENES.flatMap((s) => s.vo.map((v) => [pdrStart(s.id) + v.at, pdrStart(s.id) + v.at + fullFrames(v.id)] as const));

// Capítulos de YouTube (descripción): tools/pdr_meta.py los lee de aquí. Cada uno dura más de 10 s.
export const PDR_CHAPTERS: { label: string; from: string }[] = [
  { label: 'Qué es Podimo', from: 'K02' },
  { label: 'Precio de Podimo: Premium, Premium Plus y Free', from: 'K03' },
  { label: 'La app por dentro: primeros pasos y portada', from: 'K04' },
  { label: 'Pódcasts exclusivos «Solo en Podimo»', from: 'K05' },
  { label: 'Audiolibros, buscador y reproductor', from: 'K06' },
  { label: 'Cómo cuentan las horas', from: 'K08' },
  { label: 'Dispositivos: CarPlay, Android Auto, AirPlay', from: 'K09' },
  { label: 'Opiniones: App Store y Trustpilot', from: 'K10' },
  { label: 'Lo bueno y lo malo de Podimo', from: 'K11' },
  { label: 'Veredicto: ¿merece la pena?', from: 'K12' },
  { label: 'Cómo probar Podimo 30 días gratis y cómo cancelar', from: 'L01' },
];
