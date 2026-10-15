import { FPS } from '../../brand/tokens';
import { voFrames, voSpeechFrames, wordFrame } from '../../lib/vo';
import TL from '../../../public/lv/timeline.json';
import CLIPS from '../../../public/lv/audio/clips.json';

// LibriVox: qué es y cómo usarlo. Cada escena encadena locuciones («vo») y fragmentos reales de LibriVox («clip»,
// voluntarios leyendo las Leyendas de Bécquer, dominio público) separados por «gap» segundos.
const sec = (s: number) => Math.round(s * FPS);
const LEAD = 0.12;
const TAIL = 0.32;

export type Clip = { dur: number; reader: string; text: string; words: [number, number, string][] };
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

export const LV_SCENES: SceneDef[] = (TL as TLDef[]).map(build);
export const lvStart = (id: string) => {
  let a = 0;
  for (const s of LV_SCENES) { if (s.id === id) return a; a += s.dur; }
  return a;
};
export const LV_TOTAL = LV_SCENES.reduce((a, s) => a + s.dur, 0);
export const sceneOf = (id: string) => LV_SCENES.find((s) => s.id === id)!;
// Fotograma (relativo a la escena) en que empieza un elemento (locución o fragmento) y en que termina.
export const itemAt = (sceneId: string, itemId: string) => sceneOf(sceneId).items.find((i) => i.id === itemId)?.at ?? 0;
export const itemEnd = (sceneId: string, itemId: string) => { const i = sceneOf(sceneId).items.find((x) => x.id === itemId); return i ? i.at + i.dur : 0; };
// Fotograma (relativo a la escena) de una palabra de una locución: w('Y02', 'L02', 'móvil').
export const w = (sceneId: string, voId: string, word: string, nth = 0, fb = 0) => itemAt(sceneId, voId) + wordFrame(voId, word, nth, fb);
// Palabra de un fragmento de LibriVox que suena en el fotograma f (relativo al inicio del fragmento): −1 antes de empezar.
export const clipWordAt = (clip: string, f: number) => {
  const t = f / FPS;
  let idx = -1;
  CLIP[clip].words.forEach(([s], i) => { if (t >= s - 0.04) idx = i; });
  return idx;
};
// Intervalos con voz (locución o voluntario de LibriVox) en fotogramas absolutos, para bajar la música.
export const lvSpeech = () => LV_SCENES.flatMap((s) => s.items.map((i) => [lvStart(s.id) + i.at, lvStart(s.id) + i.at + (i.kind === 'vo' ? voFrames(i.id) : i.dur)] as const));
export const lvClipIntervals = () => LV_SCENES.flatMap((s) => s.items.filter((i) => i.kind === 'clip').map((i) => [lvStart(s.id) + i.at, lvStart(s.id) + i.at + i.dur] as const));
