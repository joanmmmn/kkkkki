import { FPS } from '../../brand/tokens';
import { VOS, voFrames, voSpeechFrames, wordFrame } from '../../lib/vo';
import cfg from '../../../public/str/vo/vo.json';

// Reseña de Storytel + cómo probarlo 7 días gratis (mismo sistema que la reseña v2 de Podimo).
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

export const STR_SCENES: SceneDef[] = [
  simple('A01', 12, sec(0.5)),
  simple('A02', 14, sec(0.52), '¿Qué es Storytel?'),
  simple('A03', 20, sec(0.52), 'Precios y planes'),
  simple('A04', 10, sec(0.52), 'La app por dentro'),
  simple('A05', 12, sec(0.2), undefined, 'cut'),
  simple('A06', 12, sec(0.2), undefined, 'cut'),
  simple('A07', 12, sec(0.2), undefined, 'cut'),
  simple('A08', 16, sec(0.2), undefined, 'cut'),
  simple('A08B', 18, sec(0.52), 'Sin horas y en familia'),
  simple('A09', 16),
  simple('A10', 18, sec(0.52), 'Opiniones'),
  simple('A11', 20, sec(0.52), 'Lo bueno y lo malo'),
  simple('A12', 20, sec(0.52), 'Veredicto'),
  simple('B01', 12, sec(0.52), '7 días gratis'),
  simple('B02', 16),
  simple('B03', 14, LEAD, undefined, 'slide'),
  simple('B04', 18),
  simple('B05', 16),
  simple('B06', 170),
];
export const STR_BUMPS = STR_SCENES.filter((s) => s.bump).map((s) => s.id);
// Escenas de la app con el móvil a un lado: entre dos seguidas (sin separador) el móvil se desliza por el centro y enlaza.
export const STR_APP = ['A04', 'A05', 'A06', 'A07', 'A08'];

export const strStart = (id: string) => {
  let a = 0;
  for (const s of STR_SCENES) { if (s.id === id) return a; a += s.dur; }
  return a;
};
export const STR_TOTAL = STR_SCENES.reduce((a, s) => a + s.dur, 0);
export const strVoIntervals = () => STR_SCENES.flatMap((s) => s.vo.map((v) => [strStart(s.id) + v.at, strStart(s.id) + v.at + fullFrames(v.id)] as const));

// Capítulos de YouTube (descripción): tools/str_meta.py los lee de aquí. Cada uno dura más de 10 s.
export const STR_CHAPTERS: { label: string; from: string }[] = [
  { label: 'Qué es Storytel', from: 'A02' },
  { label: 'Precio de Storytel: Unlimited y Family', from: 'A03' },
  { label: 'La app por dentro: portada y pestañas', from: 'A04' },
  { label: 'Storytel Originals: La Suelta y Modo Noche', from: 'A05' },
  { label: 'Buscador y fichas: audio, ebook o los dos', from: 'A06' },
  { label: 'Reproductor: velocidad, temporizador y descargas', from: 'A07' },
  { label: 'Leer y escuchar en el mismo punto', from: 'A08' },
  { label: 'Sin límite de horas y modo infantil', from: 'A08B' },
  { label: 'Dispositivos (y por qué no hay ordenador)', from: 'A09' },
  { label: 'Opiniones: Google Play y App Store', from: 'A10' },
  { label: 'Lo bueno y lo malo de Storytel', from: 'A11' },
  { label: 'Veredicto: ¿merece la pena?', from: 'A12' },
  { label: 'Cómo probar Storytel 7 días gratis y cancelar', from: 'B01' },
];
