import { FPS } from '../../brand/tokens';
import { VOS, voFrames, voSpeechFrames, wordFrame } from '../../lib/vo';

// «Los 10 mejores» · Fantasía. Locución en public/t10f/vo (ids F..; J.. para el vertical).
export const sec = (s: number) => Math.round(s * FPS);
export const hasVO = (id: string) => Boolean(VOS[id]);
export const speechFrames = (id: string) => (hasVO(id) ? voSpeechFrames(id) : sec(4));
export const fullFrames = (id: string) => (hasVO(id) ? voFrames(id) : sec(4));

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9,]/g, '');
const missing = new Set<string>();
// Fotograma (relativo al inicio de la locución `id`) en que empieza la palabra `word` (n-ésima aparición).
export const wf = (id: string, word: string, nth = 0) => {
  const v = VOS[id];
  if (v && !v.words.some((w) => norm(w.w).startsWith(norm(word)))) {
    const k = `${id}:${word}`;
    if (!missing.has(k)) { missing.add(k); console.warn(`[t10] palabra no encontrada: ${k}`); }
  }
  return wordFrame(id, word, nth);
};
export const wfEnd = (id: string, word: string, nth = 0) => {
  const v = VOS[id];
  if (!v) return wf(id, word, nth) + 10;
  const hits = v.words.filter((w) => norm(w.w).startsWith(norm(word)));
  const h = hits[Math.min(nth, hits.length - 1)];
  return h ? Math.round(h.e * FPS) : wf(id, word, nth) + 10;
};

export type VoPart = { id: string; at: number };
export type Tin = 'push' | 'cut' | 'slide' | 'dark';
export type SceneDef = { id: string; vo: VoPart[]; dur: number; tin: Tin; night?: boolean; book?: number; phases?: { b: string; c: string } };
const LEAD = sec(0.2);
const GAP = sec(0.45);
const TAIL = sec(0.36);

const scene = (id: string, ids: string[], o: { lead?: number; gaps?: number[]; extra?: number; tin?: Tin; night?: boolean; minDur?: number; book?: number; phases?: { b: string; c: string } } = {}): SceneDef => {
  const lead = o.lead ?? LEAD;
  const vo: VoPart[] = [];
  let t = lead;
  ids.forEach((v, i) => {
    if (i > 0) t += o.gaps?.[i - 1] !== undefined ? sec(o.gaps[i - 1]) : GAP;
    vo.push({ id: v, at: t });
    t += speechFrames(v);
  });
  const dur = Math.max(o.minDur ?? 0, t + TAIL + (o.extra ?? 0));
  return { id, vo, dur, tin: o.tin ?? 'push', night: o.night, book: o.book, phases: o.phases };
};

// Cada libro: título y sinopsis (A) → dato (B) → narración (C). Antes del número, un instante de oscuridad.
const bookScene = (p: number, ids: string[], b: string, c: string, gaps: number[], extra = 26) =>
  scene(`B${p}`, ids, { lead: sec(1.15), gaps, extra, tin: 'dark', night: true, book: p, phases: { b, c } });

export const T10_SCENES: SceneDef[] = [
  scene('HOOK', ['F01', 'F02', 'F03'], { lead: sec(1.1), gaps: [0.7, 0.8], extra: 24, night: true }),
  scene('REGLA', ['F05', 'F07'], { lead: sec(1.4), gaps: [1.5], extra: 18, night: true, tin: 'cut' }),
  bookScene(1, ['F11', 'F12', 'F13', 'F14'], 'F13', 'F14', [0.5, 0.75, 0.75]),
  bookScene(2, ['F21', 'F22', 'F23', 'F24'], 'F23', 'F24', [0.5, 0.75, 0.75]),
  bookScene(3, ['F31', 'F32', 'F33', 'F34'], 'F33', 'F34', [0.5, 0.75, 0.75]),
  bookScene(4, ['F41', 'F42', 'F43', 'F44', 'F45'], 'F43', 'F44', [0.5, 0.75, 0.75, 0.55]),
  bookScene(5, ['F51', 'F52', 'F53', 'F54'], 'F53', 'F54', [0.5, 0.75, 0.75]),
  bookScene(6, ['F61', 'F62', 'F63', 'F64'], 'F63', 'F64', [0.5, 0.75, 0.75]),
  bookScene(7, ['F71', 'F72', 'F73', 'F74'], 'F73', 'F74', [0.5, 0.75, 0.75]),
  bookScene(8, ['F81', 'F82', 'F83', 'F84', 'F85'], 'F83', 'F84', [0.5, 0.75, 0.75, 0.55]),
  bookScene(9, ['F91', 'F92', 'F93', 'F94'], 'F93', 'F94', [0.5, 0.75, 0.75]),
  bookScene(10, ['F101', 'F102', 'F103', 'F104', 'F105'], 'F103', 'F104', [0.5, 0.75, 0.75, 0.9], 60),
  scene('TIP', ['F111'], { lead: sec(0.6), extra: 30, night: true, tin: 'cut' }),
  scene('WEB', ['F112'], { extra: 40 }),
  scene('COMENT', ['F113'], { extra: 30 }),
  scene('OUTRO', ['F114'], { lead: sec(0.5), minDur: sec(14) }),
];

export const t10Start = (id: string) => {
  let a = 0;
  for (const s of T10_SCENES) { if (s.id === id) return a; a += s.dur; }
  return a;
};
export const T10_TOTAL = T10_SCENES.reduce((a, s) => a + s.dur, 0);
export const t10VoIntervals = () => T10_SCENES.flatMap((s) => s.vo.map((v) => [t10Start(s.id) + v.at, t10Start(s.id) + v.at + fullFrames(v.id)] as const));
export const sceneDef = (id: string) => T10_SCENES.find((s) => s.id === id)!;

export const sceneClock = (sceneId: string) => {
  const s = sceneDef(sceneId);
  const part = (vo: string) => s.vo.find((v) => v.id === vo)?.at ?? 0;
  return {
    dur: s.dur,
    part,
    at: (vo: string, word: string, nth = 0) => part(vo) + wf(vo, word, nth),
    end: (vo: string, word: string, nth = 0) => part(vo) + wfEnd(vo, word, nth),
    voEnd: (vo: string) => part(vo) + speechFrames(vo),
  };
};

// Capítulos de YouTube (descripción).
export const T10_CHAPTERS: { label: string; from: string }[] = [
  { label: '10 historias de fantasía de las que no vas a querer salir', from: 'HOOK' },
  { label: '10. Alicia en el País de las Maravillas (Lewis Carroll)', from: 'B1' },
  { label: '9. Circe (Madeline Miller)', from: 'B2' },
  { label: '8. Harry Potter y la piedra filosofal (J. K. Rowling)', from: 'B3' },
  { label: '7. El Hobbit (J. R. R. Tolkien)', from: 'B4' },
  { label: '6. El nombre del viento (Patrick Rothfuss)', from: 'B5' },
  { label: '5. Olvidado rey Gudú (Ana María Matute)', from: 'B6' },
  { label: '4. Memorias de Idhún (Laura Gallego)', from: 'B7' },
  { label: '3. Alas de sangre (Rebecca Yarros)', from: 'B8' },
  { label: '2. El imperio final (Brandon Sanderson)', from: 'B9' },
  { label: '1. El Señor de los Anillos (J. R. R. Tolkien)', from: 'B10' },
  { label: 'Cómo escucharlas gratis', from: 'TIP' },
];
