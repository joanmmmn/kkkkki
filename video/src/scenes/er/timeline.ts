import { FPS } from '../../brand/tokens';
import { VOS, voFrames, voSpeechFrames, wordFrame } from '../../lib/vo';
import cfg from '../../../public/er/vo/vo.json';
import TL from '../../../public/er/timeline.json';

// Tutorial «Cómo conseguir 30 días gratis de ElevenReader (en vez de 3) desde SonorBooks».
// Sin locución, las duraciones y los tiempos de palabra se estiman (≈13 caracteres/s a velocidad 1,13).
const CPS = 13;
const sec = (s: number) => Math.round(s * FPS);
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
export const wf = (id: string, word: string, nth = 0) => wordFrame(id, word, nth, estSec(id, word, nth) || 0.001);

export type VoPart = { id: string; at: number };
export type SceneDef = { id: string; vo: VoPart[]; lead: number; dur: number };
const LEAD = sec(0.12);
const TAIL = sec(0.32);
const simple = (id: string, extra = 0, lead = LEAD): SceneDef => ({ id, vo: [{ id, at: lead }], lead, dur: lead + speechFrames(id) + TAIL + sec(extra) });

// Estructura de escenas en public/er/timeline.json (la usa también tools/srt_er.py para los subtítulos).
// Una escena puede tener varias locuciones («parts») separadas por «gap» segundos.
type TLDef = { id: string; extra?: number; parts?: string[]; gap?: number };
const build = (d: TLDef): SceneDef => {
  if (!d.parts) return simple(d.id, d.extra ?? 0);
  const vo: VoPart[] = [];
  let t = LEAD;
  d.parts.forEach((p, i) => { vo.push({ id: p, at: t }); t += speechFrames(p) + (i < d.parts!.length - 1 ? sec(d.gap ?? 0.4) : 0); });
  return { id: d.id, vo, lead: LEAD, dur: t + TAIL + sec(d.extra ?? 0) };
};
export const ER_SCENES: SceneDef[] = (TL as TLDef[]).map(build);
// Fotograma (relativo a la escena) en que empieza una de sus locuciones.
export const partAt = (sceneId: string, partId: string) => ER_SCENES.find((s) => s.id === sceneId)?.vo.find((v) => v.id === partId)?.at ?? 0;

export const erStart = (id: string) => {
  let a = 0;
  for (const s of ER_SCENES) { if (s.id === id) return a; a += s.dur; }
  return a;
};
export const ER_TOTAL = ER_SCENES.reduce((a, s) => a + s.dur, 0);
export const erVoIntervals = () => ER_SCENES.flatMap((s) => s.vo.map((v) => [erStart(s.id) + v.at, erStart(s.id) + v.at + fullFrames(v.id)] as const));
