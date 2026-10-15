import { FPS } from '../../brand/tokens';
import { voFrames, voSpeechFrames, wordFrame } from '../../lib/vo';
import TL from '../../../public/lv/timeline3.json';
import CLIPS from '../../../public/lv/audio3/clips.json';

// LibriVox, vídeo por capítulos («la biblioteca que habla»). Cada escena encadena locuciones (K..) y fragmentos reales de
// LibriVox (voluntarios leyendo las Leyendas de Bécquer, dominio público) separados por «gap» segundos.
// La misma lógica está en tools/lv3_times.py (música y subtítulos).
const sec = (s: number) => Math.round(s * FPS);
const LEAD = 0.12;
const TAIL = 0.32;

export type Clip3 = { dur: number; reader: string; title: string; text: string; words: [number, number, string][] };
export const CLIP3: Record<string, Clip3> = CLIPS as unknown as Record<string, Clip3>;
export type Item = { kind: 'vo' | 'clip'; id: string; at: number; dur: number };
export type SceneDef = { id: string; items: Item[]; lead: number; dur: number };
type TLDef = { id: string; lead?: number; extra?: number; seq: { vo?: string; clip?: string; gap?: number }[] };

const build = (d: TLDef): SceneDef => {
  const items: Item[] = [];
  let t = sec(d.lead ?? LEAD);
  d.seq.forEach((s, i) => {
    if (i > 0) t += sec(s.gap ?? 0.35);
    if (s.vo) { items.push({ kind: 'vo', id: s.vo, at: t, dur: voSpeechFrames(s.vo) }); t += voSpeechFrames(s.vo); }
    else if (s.clip) { const dur = sec(CLIP3[s.clip].dur); items.push({ kind: 'clip', id: s.clip, at: t, dur }); t += dur; }
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
// Fotograma (relativo a la escena) en que empieza o acaba un elemento.
export const itemAt = (sceneId: string, itemId: string) => scene(sceneId).items.find((i) => i.id === itemId)?.at ?? 0;
export const itemEnd = (sceneId: string, itemId: string) => { const i = scene(sceneId).items.find((x) => x.id === itemId); return i ? i.at + i.dur : 0; };
// Fotograma (relativo a la escena) de una palabra de una locución: w('S05', 'K05', 'revisor').
export const w = (sceneId: string, voId: string, word: string, nth = 0) => itemAt(sceneId, voId) + wordFrame(voId, word, nth);
// Palabra de un fragmento que suena en el fotograma f (relativo al inicio del fragmento): −1 antes de empezar.
export const clipWordAt = (clip: string, f: number) => {
  const t = f / FPS;
  let idx = -1;
  CLIP3[clip].words.forEach(([s], i) => { if (t >= s - 0.04) idx = i; });
  return idx;
};
// Intervalos con voz (locución o voluntario), en fotogramas absolutos, para bajar la música y los efectos.
export const speech = () => SCENES.flatMap((s) => s.items.map((i) => [start(s.id) + i.at, start(s.id) + i.at + (i.kind === 'vo' ? voFrames(i.id) : i.dur)] as const));
export const clipIntervals = () => SCENES.flatMap((s) => s.items.filter((i) => i.kind === 'clip').map((i) => [start(s.id) + i.at, start(s.id) + i.at + i.dur] as const));
