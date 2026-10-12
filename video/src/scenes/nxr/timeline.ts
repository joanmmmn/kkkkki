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
// `bump`: título del separador de sección que tapa el arranque de la escena (la escena se dibuja desde `pre`).
// `tin`: cómo entra la escena si no hay separador ('push' = acercamiento con desenfoque, 'cut' = corte, el móvil enlaza solo).
export type SceneDef = { id: string; vo: VoPart[]; lead: number; dur: number; bump?: string; pre: number; tin: 'push' | 'cut' | 'slide' };
const LEAD = sec(0.12);
const TAIL = sec(0.32);
// Con separador, la voz empieza cuando los paneles ya casi han salido (0,52 s) y la escena se dibuja desde el fotograma 12.
export const BUMP_PRE = 12;
const simple = (id: string, extra = 0, lead = LEAD, bump?: string, tin: SceneDef['tin'] = 'push'): SceneDef => ({
  id, vo: [{ id, at: lead }], lead, dur: lead + speechFrames(id) + TAIL + extra, bump, pre: bump ? BUMP_PRE : 0, tin: bump ? 'cut' : tin,
});

export const NXR_SCENES: SceneDef[] = [
  simple('R01', 12, sec(0.5)),
  simple('R02', 10, sec(0.52), '¿Qué es Nextory?'),
  simple('R03', 18, sec(0.52), 'Precios y planes'),
  simple('R04', 10, sec(0.52), 'La app por dentro'),
  simple('R04B', 12, sec(0.2), undefined, 'cut'),
  simple('R05', 12, sec(0.2), undefined, 'cut'),
  simple('R06', 36, sec(0.2), undefined, 'cut'),
  simple('R07', 12, sec(1.8), undefined, 'cut'),
  simple('R08', 8, sec(0.52), 'Más funciones'),
  simple('R09', 36, sec(0.2), undefined, 'cut'),
  simple('R10', 18, sec(0.2), undefined, 'cut'),
  simple('R11', 12),
  simple('R12', 20),
  simple('R13', 20, sec(0.52), 'Lo bueno y lo malo'),
  simple('R14', 18, sec(0.52), 'Veredicto'),
  simple('P01', 12, sec(0.52), '30 días gratis'),
  simple('P02', 18),
  simple('P03', 12, LEAD, undefined, 'slide'),
  simple('P04', 8, LEAD, undefined, 'slide'),
  simple('P05', 16),
  simple('P06', 170),
];
export const NXR_BUMPS = NXR_SCENES.filter((s) => s.bump).map((s) => s.id);
// Escenas de la app con el móvil a un lado: entre dos seguidas (sin separador) el móvil se desliza por el centro y enlaza.
export const NXR_APP = ['R04', 'R04B', 'R05', 'R06', 'R07', 'R08', 'R09', 'R10'];

export const nxrStart = (id: string) => {
  let a = 0;
  for (const s of NXR_SCENES) { if (s.id === id) return a; a += s.dur; }
  return a;
};
export const NXR_TOTAL = NXR_SCENES.reduce((a, s) => a + s.dur, 0);
export const nxrVoIntervals = () => NXR_SCENES.flatMap((s) => s.vo.map((v) => [nxrStart(s.id) + v.at, nxrStart(s.id) + v.at + fullFrames(v.id)] as const));

// Capítulos de YouTube (descripción): tools/nxr_meta.py los lee de aquí.
export const NXR_CHAPTERS: { label: string; from: string }[] = [
  { label: '¿Qué es Nextory? Catálogo y dispositivos', from: 'R02' },
  { label: 'Precios y planes', from: 'R03' },
  { label: 'La app: portada, El Librarian y buscador', from: 'R04' },
  { label: 'Leer ebooks', from: 'R06' },
  { label: 'Escuchar audiolibros', from: 'R07' },
  { label: 'Descargas, perfiles y horas', from: 'R08' },
  { label: 'Dispositivos y PDF (con ElevenReader)', from: 'R11' },
  { label: 'Lo bueno y lo malo', from: 'R13' },
  { label: 'Veredicto: ¿merece la pena?', from: 'R14' },
  { label: 'Cómo probarlo 30 días gratis', from: 'P01' },
];
