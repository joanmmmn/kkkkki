import { FPS } from '../../brand/tokens';
import { VOS, voFrames, voSpeechFrames, wordFrame } from '../../lib/vo';
import cfg from '../../../public/cnl/vo/vo.json';

// «Cómo cancelar la suscripción en 8 apps de audiolibros»: tutorial de SonorBooks España con las cancelaciones reales del
// 26/10/2026 (Podimo, iVoox, BookBeat, Storytel y Nextory en BlueStacks; Spotify y Audiobooks.com en la web; Audible, ya cancelada).
const CPS = 13;
export const sec = (s: number) => Math.round(s * FPS);
// v2 (28/10/2026): cada tramo empieza por «Para cancelar la suscripción de X…». tools/cnl_splice.py empalma la apertura nueva
// (X03A…) con el resto de la locución original y deja X03S…; donde exista, se usa en lugar de X03… (voz, duración y palabras).
export const vid = (id: string) => (VOS[`${id}S`] ? `${id}S` : id);
const PREFIX = 'para cancelar la suscripcion de';
const rawText = (id: string) => VOS[id]?.text ?? (cfg.scenes as { id: string; text: string }[]).find((s) => s.id === id)?.text ?? '';
const textOf = (id: string) => rawText(vid(id));
export const voText = textOf;
export const hasVO = (id: string) => Boolean(VOS[vid(id)]);
export const speechFrames = (id: string) => (hasVO(id) ? voSpeechFrames(vid(id)) : sec(textOf(id).length / CPS));
export const fullFrames = (id: string) => (hasVO(id) ? voFrames(vid(id)) : sec(textOf(id).length / CPS + 0.25));

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
// En las locuciones empalmadas, el prefijo «Para cancelar la suscripción de» no cuenta al buscar palabras clave
// («Cancelar», «Suscripción»…): se tapa en el texto (mismas posiciones) y se ignoran sus palabras.
const searchText = (id: string) => {
  const t = norm(textOf(id));
  return vid(id) !== id && t.startsWith(PREFIX) ? ' '.repeat(PREFIX.length) + t.slice(PREFIX.length) : t;
};
const estSec = (id: string, word: string, nth = 0) => {
  const t = searchText(id);
  const w = norm(word);
  let i = -1;
  for (let k = 0; k <= nth; k++) { i = t.indexOf(w, i + 1); if (i < 0) break; }
  return Math.max(0, i) / CPS;
};
const voScale = (id: string) => (hasVO(id) ? (VOS[vid(id)].speechEnd ?? VOS[vid(id)].duration) / Math.max(0.1, textOf(id).length / CPS) : 1);
const wnorm = (s: string) => norm(s).replace(/[^a-z0-9,]/g, '');
// Fotograma (relativo al inicio de la locución) de una palabra: exacto con locución, estimado sin ella.
export const wf = (id: string, word: string, nth = 0) => {
  const v = vid(id);
  const est = (estSec(id, word, nth) || 0.001) * voScale(id);
  if (v === id) return wordFrame(id, word, nth, est);
  const pe = (VOS[v] as { prefixEnd?: number }).prefixEnd ?? 0;
  const target = wnorm(word);
  const hits = VOS[v].words.filter((x) => x.s >= pe - 0.01 && wnorm(x.w).startsWith(target));
  if (!hits.length) return Math.round(est * FPS);
  const pick = hits.reduce((a, b) => (Math.abs(b.s - est) < Math.abs(a.s - est) ? b : a));
  return Math.round(pick.s * FPS);
};

export type VoPart = { id: string; at: number };
// `tin`: cómo entra la escena ('push' = acercamiento con desenfoque, 'slide' = barrido lateral: la app siguiente, 'cut' = corte).
export type SceneDef = { id: string; vo: VoPart[]; lead: number; dur: number; tin: 'push' | 'cut' | 'slide' };
const TAIL = sec(0.34);
const simple = (id: string, extra = 0, lead = sec(0.12), tin: SceneDef['tin'] = 'push'): SceneDef => ({
  id, vo: [{ id, at: lead }], lead, dur: lead + speechFrames(id) + TAIL + extra, tin,
});

export const CNL_SCENES: SceneDef[] = [
  simple('X01', 24, sec(0.7)),
  simple('X02', 22, sec(0.4), 'push'),
  simple('X03', 30, sec(0.44), 'slide'),
  simple('X04', 30, sec(0.44), 'slide'),
  simple('X05', 30, sec(0.44), 'slide'),
  simple('X06', 30, sec(0.44), 'slide'),
  simple('X07', 30, sec(0.44), 'slide'),
  simple('X08', 30, sec(0.44), 'slide'),
  simple('X09', 30, sec(0.44), 'slide'),
  simple('X10', 30, sec(0.44), 'slide'),
  simple('X11', 26, sec(0.44), 'push'),
  simple('X12', 340, sec(0.36), 'push'),
];

export const cnlStart = (id: string) => {
  let a = 0;
  for (const s of CNL_SCENES) { if (s.id === id) return a; a += s.dur; }
  return a;
};
export const CNL_TOTAL = CNL_SCENES.reduce((a, s) => a + s.dur, 0);
export const cnlVoIntervals = () => CNL_SCENES.flatMap((s) => s.vo.map((v) => [cnlStart(s.id) + v.at, cnlStart(s.id) + v.at + fullFrames(v.id)] as const));

// Capítulos de YouTube (descripción): tools/cnl_meta.py los lee de aquí. Cada uno dura más de 10 s.
export const CNL_CHAPTERS: { label: string; from: string }[] = [
  { label: 'Antes de nada: Google Play y App Store', from: 'X02' },
  { label: 'Cómo cancelar Audible', from: 'X03' },
  { label: 'Cómo cancelar Storytel', from: 'X04' },
  { label: 'Cómo cancelar Spotify Premium (y Audiolibros+)', from: 'X05' },
  { label: 'Cómo cancelar Podimo', from: 'X06' },
  { label: 'Cómo cancelar Nextory', from: 'X07' },
  { label: 'Cómo cancelar BookBeat', from: 'X08' },
  { label: 'Cómo cancelar Audiobooks.com', from: 'X09' },
  { label: 'Cómo cancelar iVoox Premium', from: 'X10' },
  { label: 'Resumen: app o web, y la prueba gratis', from: 'X11' },
];
