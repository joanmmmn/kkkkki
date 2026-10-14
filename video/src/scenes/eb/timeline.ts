import { FPS } from '../../brand/tokens';
import { voFrames, voSpeechFrames, wordFrame } from '../../lib/vo';
import TL from '../../../public/eb/timeline.json';

// eBiblio: qué es y cómo usarlo para escuchar audiolibros gratis («la puerta»). Cada escena encadena locuciones (B..)
// separadas por «gap» segundos. La misma lógica está en tools/eb_times.py (música y subtítulos).
const sec = (s: number) => Math.round(s * FPS);
const LEAD = 0.12;
const TAIL = 0.32;

export type Item = { id: string; at: number; dur: number };
export type SceneDef = { id: string; items: Item[]; lead: number; dur: number };
type TLDef = { id: string; lead?: number; extra?: number; seq: { vo: string; gap?: number }[] };

const build = (d: TLDef): SceneDef => {
  const items: Item[] = [];
  let t = sec(d.lead ?? LEAD);
  d.seq.forEach((s, i) => {
    if (i > 0) t += sec(s.gap ?? 0.35);
    items.push({ id: s.vo, at: t, dur: voSpeechFrames(s.vo) });
    t += voSpeechFrames(s.vo);
  });
  return { id: d.id, items, lead: sec(d.lead ?? LEAD), dur: t + sec(TAIL + (d.extra ?? 0)) };
};

export const SCENES: SceneDef[] = (TL as TLDef[]).map(build);
export const start = (id: string) => {
  let a = 0;
  for (const s of SCENES) { if (s.id === id) return a; a += s.dur; }
  return a;
};
export const TOTAL = SCENES.reduce((a, s) => a + s.dur, 0);
export const scene = (id: string) => SCENES.find((s) => s.id === id)!;
// Fotograma (relativo a la escena) en que empieza o acaba una locución.
export const itemAt = (sceneId: string, itemId: string) => scene(sceneId).items.find((i) => i.id === itemId)?.at ?? 0;
export const itemEnd = (sceneId: string, itemId: string) => { const i = scene(sceneId).items.find((x) => x.id === itemId); return i ? i.at + i.dur : 0; };
// Fotograma (relativo a la escena) de una palabra de una locución: w('T05', 'B06', 'Madrid').
export const w = (sceneId: string, voId: string, word: string, nth = 0) => itemAt(sceneId, voId) + wordFrame(voId, word, nth);
// Intervalos con voz, en fotogramas absolutos (para bajar la música y los efectos).
export const speech = () => SCENES.flatMap((s) => s.items.map((i) => [start(s.id) + i.at, start(s.id) + i.at + voFrames(i.id)] as const));
