import { FPS } from '../../brand/tokens';
import { VOS, voFrames, voSpeechFrames, wordFrame } from '../../lib/vo';

// «Por dónde y cómo empezar a leer» · Episodio 2: Dostoievski. Locución en public/dsk/vo (ids D..).
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
    if (!missing.has(k)) { missing.add(k); console.warn(`[dsk] palabra no encontrada: ${k}`); }
  }
  return wordFrame(id, word, nth);
};
// Fin (fotograma relativo) de la n-ésima aparición de una palabra.
export const wfEnd = (id: string, word: string, nth = 0) => {
  const v = VOS[id];
  if (!v) return wf(id, word, nth) + 10;
  const hits = v.words.filter((w) => norm(w.w).startsWith(norm(word)));
  const h = hits[Math.min(nth, hits.length - 1)];
  return h ? Math.round(h.e * FPS) : wf(id, word, nth) + 10;
};

export type VoPart = { id: string; at: number };
export type Tin = 'push' | 'cut' | 'slide' | 'dip';
// `bump`: título del separador de sección que tapa el arranque de la escena (la escena se dibuja desde `pre`).
export type SceneDef = { id: string; vo: VoPart[]; dur: number; bump?: string; pre: number; tin: Tin; night?: boolean };
export const BUMP_PRE = 12;
const LEAD = sec(0.16);
const GAP = sec(0.42);
const TAIL = sec(0.34);

// Escena con varias locuciones seguidas: `gaps[i]` es la pausa (s) antes de la locución i+1; `extra` alarga el final.
const scene = (id: string, ids: string[], o: { lead?: number; gaps?: number[]; extra?: number; bump?: string; tin?: Tin; night?: boolean; minDur?: number } = {}): SceneDef => {
  const lead = o.lead ?? (o.bump ? sec(0.55) : LEAD);
  const vo: VoPart[] = [];
  let t = lead;
  ids.forEach((v, i) => {
    if (i > 0) t += o.gaps?.[i - 1] !== undefined ? sec(o.gaps[i - 1]) : GAP;
    vo.push({ id: v, at: t });
    t += speechFrames(v);
  });
  const dur = Math.max(o.minDur ?? 0, t + TAIL + (o.extra ?? 0));
  return { id, vo, dur, bump: o.bump, pre: o.bump ? BUMP_PRE : 0, tin: o.bump ? 'cut' : o.tin ?? 'push', night: o.night };
};

export const DSK_SCENES: SceneDef[] = [
  scene('HOOK', ['D01', 'D02'], { lead: sec(0.9), gaps: [0.55], extra: 22, night: true }),
  scene('NAME', ['D03', 'D04'], { gaps: [0.5], extra: 8, tin: 'dip' }),
  scene('VERS', ['D05'], { extra: 18, tin: 'dip' }),
  scene('MAPA', ['D06'], { extra: 10, tin: 'dip' }),
  scene('TITLE', [], { minDur: sec(3.6), tin: 'dip' }),
  scene('MOSCU', ['D07'], { bump: 'Quién era', extra: 10 }),
  scene('POBRES', ['D08'], { extra: 12 }),
  scene('SIBERIA', ['D09', 'D10'], { gaps: [0.5], extra: 14 }),
  scene('STENO', ['D11', 'D12'], { gaps: [0.5], extra: 14 }),
  scene('FIN', ['D13'], { extra: 18, night: true }),
  scene('TEMAS', ['D14'], { bump: 'Qué escribe', extra: 14 }),
  scene('CINCO', ['D15'], { extra: 16 }),
  scene('ADMIR', ['D16'], { extra: 30 }),
  scene('PREG', ['D17', 'D18'], { bump: 'Antes de elegir', gaps: [0.6], extra: 18 }),
  scene('P1', ['D19', 'D20', 'D21'], { bump: 'Cinco puertas', gaps: [0.45, 0.5], extra: 40 }),
  scene('P2', ['D22', 'D23', 'D24'], { gaps: [0.45, 0.5], extra: 44, tin: 'slide' }),
  scene('P3', ['D25', 'D26', 'D27'], { gaps: [0.45, 0.5], extra: 44, tin: 'slide' }),
  scene('P4', ['D28', 'D29', 'D30'], { gaps: [0.45, 0.5], extra: 44, tin: 'slide' }),
  scene('P5', ['D31', 'D32', 'D33'], { gaps: [0.45, 0.5], extra: 44, tin: 'slide' }),
  scene('CORTOS', ['D34'], { extra: 16 }),
  scene('KARAM', ['D35', 'D36'], { bump: 'Mejor para después', gaps: [0.45], extra: 12 }),
  scene('DEMON', ['D37'], { extra: 16 }),
  scene('VIDA', ['D38', 'D40'], { bump: 'Su vida, en sus libros', gaps: [0.5], extra: 30, night: true }),
  scene('ORDEN', ['D41'], { extra: 16 }),
  scene('VERSION', ['D42', 'D43', 'D44', 'D45'], { bump: 'Qué versión escuchar', gaps: [0.4, 0.45, 0.45], extra: 14 }),
  scene('WEB', ['D46'], { extra: 20 }),
  scene('RUTAS', ['D47', 'D48', 'D49'], { bump: 'Tu ruta', gaps: [0.4, 0.45], extra: 24 }),
  scene('COMENT', ['D50'], { extra: 14 }),
  scene('OUTRO', ['D51'], { lead: sec(0.5), minDur: sec(14) }),
];
export const DSK_BUMPS = DSK_SCENES.filter((s) => s.bump).map((s) => s.id);

export const dskStart = (id: string) => {
  let a = 0;
  for (const s of DSK_SCENES) { if (s.id === id) return a; a += s.dur; }
  return a;
};
export const DSK_TOTAL = DSK_SCENES.reduce((a, s) => a + s.dur, 0);
export const dskVoIntervals = () => DSK_SCENES.flatMap((s) => s.vo.map((v) => [dskStart(s.id) + v.at, dskStart(s.id) + v.at + fullFrames(v.id)] as const));
export const sceneDef = (id: string) => DSK_SCENES.find((s) => s.id === id)!;

// Ayudante de escena: fotograma (de la escena) de una palabra de una de sus locuciones.
export const sceneClock = (sceneId: string) => {
  const s = sceneDef(sceneId);
  const offset = s.pre; // la escena se dibuja desde `pre` cuando hay separador
  const part = (vo: string) => (s.vo.find((v) => v.id === vo)?.at ?? 0) - offset;
  return {
    dur: s.dur - offset,
    part,
    at: (vo: string, word: string, nth = 0) => part(vo) + wf(vo, word, nth),
    end: (vo: string, word: string, nth = 0) => part(vo) + wfEnd(vo, word, nth),
    voEnd: (vo: string) => part(vo) + speechFrames(vo),
  };
};

// Capítulos de YouTube (descripción).
export const DSK_CHAPTERS: { label: string; from: string }[] = [
  { label: '¿Por dónde empezar con Dostoievski?', from: 'HOOK' },
  { label: 'Quién era Dostoievski', from: 'MOSCU' },
  { label: 'Qué escribe', from: 'TEMAS' },
  { label: 'Antes de elegir: tiempo y versión', from: 'PREG' },
  { label: 'Noches blancas', from: 'P1' },
  { label: 'Crimen y castigo', from: 'P2' },
  { label: 'El jugador', from: 'P3' },
  { label: 'Memorias del subsuelo', from: 'P4' },
  { label: 'El idiota', from: 'P5' },
  { label: 'Si tienes poco tiempo', from: 'CORTOS' },
  { label: 'Mejor para después: Los hermanos Karamázov y Los demonios', from: 'KARAM' },
  { label: 'Su vida, en sus libros (y el orden)', from: 'VIDA' },
  { label: 'Qué versión escuchar', from: 'VERSION' },
  { label: 'Tres rutas de lectura', from: 'RUTAS' },
];
