import { FPS } from '../../brand/tokens';
import { voFrames, voSpeechFrames, wordFrame } from '../../lib/vo';
import TL from '../../../public/er/timeline2.json';
import CLIPS from '../../../public/er/audio/clips.json';

// Reseña de ElevenReader (+ tutorial de 30 días). Cada escena encadena locuciones («vo») y fragmentos de la
// narración real de ElevenReader («clip», grabados en la cuenta de prueba) separados por «gap» segundos.
const sec = (s: number) => Math.round(s * FPS);
const LEAD = 0.12;
const TAIL = 0.32;

export type Clip = { start: number; dur: number; words: [number, number, string][] };
export const CLIP: Record<string, Clip> = CLIPS as unknown as Record<string, Clip>;
export type Item = { kind: 'vo' | 'clip'; id: string; at: number; dur: number };
export type SceneDef = { id: string; items: Item[]; lead: number; dur: number };
type TLDef = { id: string; lead?: number; extra?: number; seq: { vo?: string; clip?: string; gap?: number }[] };

const build = (d: TLDef): SceneDef => {
  const items: Item[] = [];
  let t = sec(d.lead ?? LEAD);
  d.seq.forEach((s, i) => {
    if (i > 0) t += sec(s.gap ?? 0.35);
    if (s.vo) { items.push({ kind: 'vo', id: s.vo, at: t, dur: voSpeechFrames(s.vo) }); t += voSpeechFrames(s.vo); }
    else if (s.clip) { const dur = sec(CLIP[s.clip].dur); items.push({ kind: 'clip', id: s.clip, at: t, dur }); t += dur; }
  });
  return { id: d.id, items, lead: sec(d.lead ?? LEAD), dur: t + sec(TAIL + (d.extra ?? 0)) };
};

export const ER2_SCENES: SceneDef[] = (TL as TLDef[]).map(build);
export const er2Start = (id: string) => {
  let a = 0;
  for (const s of ER2_SCENES) { if (s.id === id) return a; a += s.dur; }
  return a;
};
export const ER2_TOTAL = ER2_SCENES.reduce((a, s) => a + s.dur, 0);
export const sceneOf = (id: string) => ER2_SCENES.find((s) => s.id === id)!;
// Fotograma (relativo a la escena) en que empieza un elemento (locución o fragmento) y en que termina.
export const itemAt = (sceneId: string, itemId: string) => sceneOf(sceneId).items.find((i) => i.id === itemId)?.at ?? 0;
export const itemEnd = (sceneId: string, itemId: string) => { const i = sceneOf(sceneId).items.find((x) => x.id === itemId); return i ? i.at + i.dur : 0; };
// Fotograma (relativo a la escena) de una palabra de una locución: w('X02', 'W02', 'voces').
export const w = (sceneId: string, voId: string, word: string, nth = 0, fb = 0) => itemAt(sceneId, voId) + wordFrame(voId, word, nth, fb);
// Palabra del párrafo «Yo no sé…» resaltada en el fotograma f de un fragmento (−1 antes de empezar).
export const clipWordAt = (clip: string, f: number) => {
  const t = f / FPS;
  let idx = -1;
  for (const [s, i] of CLIP[clip].words) if (t >= s) idx = i;
  return idx;
};
// Intervalos con voz (locución o narración de ElevenReader) en fotogramas absolutos, para bajar la música.
export const er2Speech = () => ER2_SCENES.flatMap((s) => s.items.map((i) => [er2Start(s.id) + i.at, er2Start(s.id) + i.at + (i.kind === 'vo' ? voFrames(i.id) : i.dur)] as const));
export const er2ClipIntervals = () => ER2_SCENES.flatMap((s) => s.items.filter((i) => i.kind === 'clip').map((i) => [er2Start(s.id) + i.at, er2Start(s.id) + i.at + i.dur] as const));
