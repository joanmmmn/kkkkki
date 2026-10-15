import { FPS } from '../../brand/tokens';
import { VOS, voFrames, voSpeechFrames, wordFrame } from '../../lib/vo';
import cfg from '../../../public/ivx/vo/vo.json';

// Reseña de iVoox (mismo sistema que las reseñas de Storytel y Audiobooks.com). iVoox no está en SonorBooks: sin enlaces de
// afiliado ni prueba «desde SonorBooks»; el cierre explica su mes gratis de Premium, cómo darse de baja y la comparativa.
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

export const IVX_SCENES: SceneDef[] = [
  simple('W01', 12, sec(0.5)),
  simple('W02', 14, sec(0.52), '¿Qué es iVoox?'),
  simple('W03', 18),
  simple('W04', 22, sec(0.52), 'Precios y planes'),
  simple('W05', 10, sec(0.52), 'La app por dentro'),
  simple('W06', 14, sec(0.2), undefined, 'cut'),
  simple('W07', 12, sec(0.2), undefined, 'cut'),
  simple('W08', 30, sec(0.2), undefined, 'cut'),
  simple('W09', 18, sec(0.52), '¿Y los audiolibros?'),
  simple('W10', 18, sec(0.52), 'Opiniones'),
  simple('W11', 20, sec(0.52), 'Lo bueno y lo malo'),
  simple('W12', 22, sec(0.52), 'Veredicto'),
  simple('X01', 30, sec(0.52), 'Probarlo y cancelar'),
  simple('X02', 16),
  simple('X03', 20, LEAD, undefined, 'slide'),
  simple('X04', 16),
  simple('X05', 170),
];
export const IVX_BUMPS = IVX_SCENES.filter((s) => s.bump).map((s) => s.id);
// Escenas de la app con el móvil a un lado: entre dos seguidas (sin separador) el móvil se desliza por el centro y enlaza.
export const IVX_APP = ['W05', 'W06', 'W07', 'W08'];

export const ivxStart = (id: string) => {
  let a = 0;
  for (const s of IVX_SCENES) { if (s.id === id) return a; a += s.dur; }
  return a;
};
export const IVX_TOTAL = IVX_SCENES.reduce((a, s) => a + s.dur, 0);
export const ivxVoIntervals = () => IVX_SCENES.flatMap((s) => s.vo.map((v) => [ivxStart(s.id) + v.at, ivxStart(s.id) + v.at + fullFrames(v.id)] as const));

// Capítulos de YouTube (descripción): tools/ivx_meta.py los lee de aquí. Cada uno dura más de 10 s.
export const IVX_CHAPTERS: { label: string; from: string }[] = [
  { label: 'Qué es iVoox', from: 'W02' },
  { label: 'Gratis… si aceptas las cookies', from: 'W03' },
  { label: 'Precios: Premium, Plus y apoyar un programa', from: 'W04' },
  { label: 'La app por dentro e iVoox Originals', from: 'W05' },
  { label: 'El play azul: contenido exclusivo de Plus', from: 'W06' },
  { label: 'Reproductor, volumen y modo coche', from: 'W07' },
  { label: 'Radio en directo', from: 'W08' },
  { label: '¿Y los audiolibros?', from: 'W09' },
  { label: 'Opiniones: Google Play y App Store', from: 'W10' },
  { label: 'Lo bueno y lo malo de iVoox', from: 'W11' },
  { label: 'Veredicto: ¿merece la pena?', from: 'W12' },
  { label: 'Cómo probar Premium gratis y darse de baja', from: 'X01' },
];
