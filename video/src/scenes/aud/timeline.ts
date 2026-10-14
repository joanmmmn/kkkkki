import { FPS } from '../../brand/tokens';
import { VOS, voFrames, voSpeechFrames, wordFrame } from '../../lib/vo';
import cfg from '../../../public/aud/vo/vo.json';

// Reseña de Audible + cómo probarlo 30 días gratis desde SonorBooks (mismo sistema que las reseñas de Podimo y Storytel).
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

export const AUD_SCENES: SceneDef[] = [
  simple('G01', 12, sec(0.5)),
  simple('G02', 14, sec(0.52), '¿Qué es Audible?'),
  simple('G03', 18, sec(0.52), 'Precios y planes'),
  simple('G04', 16),
  simple('G05', 10, sec(0.52), 'La app por dentro'),
  simple('G06', 12, sec(0.2), undefined, 'cut'),
  simple('G07', 12, sec(0.2), undefined, 'cut'),
  simple('G08', 12, sec(0.2), undefined, 'cut'),
  simple('G09', 16, sec(0.2), undefined, 'cut'),
  simple('G10', 16, sec(0.52), 'Dónde escuchar'),
  simple('G11', 18, sec(0.52), 'Opiniones'),
  simple('G12', 20, sec(0.52), 'Lo bueno y lo malo'),
  simple('G13', 20, sec(0.52), 'Veredicto'),
  simple('H01', 12, sec(0.52), '30 días gratis'),
  simple('H02', 16),
  simple('H03', 14, LEAD, undefined, 'slide'),
  simple('H04', 18),
  simple('H05', 16),
  simple('H06', 170),
];
export const AUD_BUMPS = AUD_SCENES.filter((s) => s.bump).map((s) => s.id);
// Escenas de la app con el móvil a un lado: entre dos seguidas (sin separador) el móvil se desliza por el centro y enlaza.
export const AUD_APP = ['G05', 'G06', 'G07', 'G08', 'G09'];

export const audStart = (id: string) => {
  let a = 0;
  for (const s of AUD_SCENES) { if (s.id === id) return a; a += s.dur; }
  return a;
};
export const AUD_TOTAL = AUD_SCENES.reduce((a, s) => a + s.dur, 0);
export const audVoIntervals = () => AUD_SCENES.flatMap((s) => s.vo.map((v) => [audStart(s.id) + v.at, audStart(s.id) + v.at + fullFrames(v.id)] as const));

// Capítulos de YouTube (descripción): tools/aud_meta.py los lee de aquí. Cada uno dura más de 10 s.
export const AUD_CHAPTERS: { label: string; from: string }[] = [
  { label: 'Qué es Audible', from: 'G02' },
  { label: 'Precio de Audible: Premium y Standard', from: 'G03' },
  { label: '¿Está todo incluido? El catálogo extendido', from: 'G04' },
  { label: 'La app por dentro: portada y Descubrir', from: 'G05' },
  { label: 'Audible Originals: Drácula y Umbra Dei', from: 'G06' },
  { label: 'Buscador y fichas', from: 'G07' },
  { label: 'Reproductor: velocidad, temporizador y descargas', from: 'G08' },
  { label: 'Sin límite de horas y perfil infantil', from: 'G09' },
  { label: 'Dispositivos (también en el ordenador)', from: 'G10' },
  { label: 'Opiniones: App Store y Google Play', from: 'G11' },
  { label: 'Lo bueno y lo malo de Audible', from: 'G12' },
  { label: 'Veredicto: ¿merece la pena?', from: 'G13' },
  { label: 'Cómo probar Audible 30 días gratis y cancelar', from: 'H01' },
];
