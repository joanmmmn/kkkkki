import { FPS } from '../../brand/tokens';
import { VOS, voFrames, voSpeechFrames, wordFrame } from '../../lib/vo';

// «Los 10 mejores» · Terror. Locución en public/t10/vo (ids X..; Y.. para el vertical).
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
  scene('HOOK', ['X01', 'X02', 'X03'], { lead: sec(1.1), gaps: [0.7, 0.8], extra: 24, night: true }),
  scene('SERIE', ['X04'], { lead: sec(0.5), extra: 30, night: true, tin: 'cut' }),
  scene('REGLA', ['X05', 'X06', 'X07'], { gaps: [0.55, 0.6], extra: 18, night: true }),
  bookScene(1, ['X11', 'X12', 'X13', 'X14'], 'X13', 'X14', [0.5, 0.75, 0.75]),
  bookScene(2, ['X21', 'X22', 'X23', 'X24', 'X25'], 'X23', 'X24', [0.5, 0.75, 0.75, 0.55]),
  bookScene(3, ['X31', 'X32', 'X33', 'X34'], 'X33', 'X34', [0.5, 0.75, 0.75]),
  bookScene(4, ['X41', 'X42', 'X43', 'X44'], 'X43', 'X44', [0.5, 0.75, 0.75]),
  bookScene(5, ['X51', 'X52', 'X53', 'X54', 'X55'], 'X53', 'X54', [0.5, 0.75, 0.75, 0.6]),
  bookScene(6, ['X61', 'X62', 'X63', 'X64', 'X65'], 'X63', 'X64', [0.5, 0.75, 0.75, 0.55]),
  bookScene(7, ['X71', 'X72', 'X73', 'X74'], 'X73', 'X74', [0.5, 0.75, 0.75]),
  bookScene(8, ['X81', 'X82', 'X83', 'X84', 'X85'], 'X83', 'X84', [0.5, 0.75, 0.75, 0.45]),
  bookScene(9, ['X91', 'X92', 'X93', 'X94', 'X95'], 'X93', 'X94', [0.5, 0.75, 0.75, 0.5]),
  bookScene(10, ['X101', 'X102', 'X103', 'X104', 'X105'], 'X103', 'X104', [0.5, 0.75, 0.75, 0.9], 60),
  scene('TIP', ['X111'], { lead: sec(0.6), extra: 30, night: true, tin: 'cut' }),
  scene('WEB', ['X112'], { extra: 40 }),
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
  { label: '10 libros de terror que dan miedo de verdad', from: 'HOOK' },
  { label: '10. La llamada de Cthulhu (H. P. Lovecraft)', from: 'B1' },
  { label: '9. Cuentos de Edgar Allan Poe', from: 'B2' },
  { label: '8. Cómo vender una casa encantada (Grady Hendrix)', from: 'B3' },
  { label: '7. Distancia de rescate (Samanta Schweblin)', from: 'B4' },
  { label: '6. Drácula (Bram Stoker)', from: 'B5' },
  { label: '5. Apocalipsis Z (Manel Loureiro)', from: 'B6' },
  { label: '4. Carcoma (Layla Martínez)', from: 'B7' },
  { label: "3. El misterio de Salem's Lot (Stephen King)", from: 'B8' },
  { label: '2. Nuestra parte de noche (Mariana Enriquez)', from: 'B9' },
  { label: '1. El exorcista (William Peter Blatty)', from: 'B10' },
  { label: 'Cómo escucharlos (y dónde)', from: 'TIP' },
];
