import { FPS } from '../../brand/tokens';
import { VOS, voFrames, voSpeechFrames, wordFrame } from '../../lib/vo';

// «10 historii grozy» (SonorBooks Polska; adaptación de «Los 10 mejores · Terror»). Locución en public/t10/vo (ids X..; Y.. para el vertical).
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
export type SceneDef = { id: string; vo: VoPart[]; dur: number; tin: Tin; night?: boolean; book?: number; phases?: { b: string; c?: string } };
const LEAD = sec(0.2);
const GAP = sec(0.45);
const TAIL = sec(0.36);

const scene = (id: string, ids: string[], o: { lead?: number; gaps?: number[]; extra?: number; tin?: Tin; night?: boolean; minDur?: number; book?: number; phases?: { b: string; c?: string } } = {}): SceneDef => {
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

// Cada libro: título y sinopsis (A) → dato (B) y la minitarjeta de SonorBooks. Antes del número, un instante de oscuridad.
// v6 (Joan, 18/10): sin la parte de cómo escucharla al final de cada libro (restaba retención); todo eso, comprimido, al final (ESCUCHA).
const bookScene = (p: number, ids: string[], b: string, gaps: number[], extra = 48) =>
  scene(`B${p}`, ids, { lead: sec(1.15), gaps, extra, tin: 'dark', night: true, book: p, phases: { b } });

export const T10_SCENES: SceneDef[] = [
  scene('HOOK', ['X01', 'X02', 'X03'], { lead: sec(1.1), gaps: [0.7, 0.8], extra: 24, night: true }),
  // v4 (Joan, 15/10): sin presentación de la serie; la regla enseña la web de SonorBooks (notas y opiniones).
  scene('REGLA', ['X05', 'X07'], { lead: sec(1.4), gaps: [1.5], extra: 18, night: true, tin: 'cut' }),
  bookScene(1, ['X11', 'X12', 'X13'], 'X13', [0.5, 0.75]),
  bookScene(2, ['X21', 'X22', 'X23'], 'X23', [0.5, 0.75]),
  bookScene(3, ['X31', 'X32', 'X33'], 'X33', [0.5, 0.75]),
  bookScene(4, ['X41', 'X42', 'X43'], 'X43', [0.5, 0.75]),
  bookScene(5, ['X51', 'X52', 'X53'], 'X53', [0.5, 0.75]),
  bookScene(6, ['X61', 'X62', 'X63'], 'X63', [0.5, 0.75]),
  bookScene(7, ['X71', 'X72', 'X73'], 'X73', [0.5, 0.75]),
  bookScene(8, ['X81', 'X82', 'X83'], 'X83', [0.5, 0.75]),
  bookScene(9, ['X91', 'X92', 'X93'], 'X93', [0.5, 0.75]),
  bookScene(10, ['X101', 'X102', 'X103', 'X105'], 'X103', [0.5, 0.75, 1.3], 60),
  scene('TIP', ['X111'], { lead: sec(0.6), extra: 30, night: true, tin: 'cut' }),
  // Las diez de un vistazo (POSŁUCHAJ): lektor, nota, duración y cómo empezar.
  scene('ESCUCHA', ['X112A'], { lead: sec(0.5), extra: sec(2.4) }),
  scene('WEB', ['X112B'], { lead: sec(0.3), extra: 40 }),
  scene('COMENT', ['X113'], { extra: 30 }),
  scene('OUTRO', ['X114'], { lead: sec(0.5), minDur: sec(14) }),
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
  { label: '10 historii grozy, które naprawdę przerażają', from: 'HOOK' },
  { label: '10. Zew Cthulhu (H.P. Lovecraft)', from: 'B1' },
  { label: '9. Opowiadania Edgara Allana Poego', from: 'B2' },
  { label: '8. Jak sprzedać nawiedzony dom (Grady Hendrix)', from: 'B3' },
  { label: '7. Dziecko Rosemary (Ira Levin)', from: 'B4' },
  { label: '6. Drakula (Bram Stoker)', from: 'B5' },
  { label: '5. Inkub (Artur Urbanowicz)', from: 'B6' },
  { label: '4. Dom na Wyrębach (Stefan Darda)', from: 'B7' },
  { label: '3. Miasteczko Salem (Stephen King)', from: 'B8' },
  { label: '2. Manitou (Graham Masterton)', from: 'B9' },
  { label: '1. Nie otwieraj oczu (Josh Malerman)', from: 'B10' },
  { label: 'Jak i gdzie ich posłuchać', from: 'TIP' },
];
