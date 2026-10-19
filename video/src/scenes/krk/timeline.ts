import { FPS } from '../../brand/tokens';
import { VOS, voFrames, voSpeechFrames, wordFrame } from '../../lib/vo';

// «Por dónde y cómo empezar a leer» · Episodio 3: Kierkegaard. Locución en public/krk/vo (ids J..).
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
    if (!missing.has(k)) { missing.add(k); console.warn(`[krk] palabra no encontrada: ${k}`); }
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

export const KRK_SCENES: SceneDef[] = [
  scene('HOOK', ['J01', 'J02'], { lead: sec(0.9), gaps: [0.6], extra: 22, night: true }),
  scene('NAME', ['J03', 'J04'], { gaps: [0.5], extra: 8, tin: 'dip' }),
  scene('VERS', ['J05'], { extra: 18, tin: 'dip' }),
  scene('MAPA', ['J06'], { extra: 10, tin: 'dip' }),
  scene('TITLE', [], { minDur: sec(3.6), tin: 'dip' }),
  scene('CPH', ['J07'], { bump: 'Quién era', extra: 10 }),
  scene('MALD', ['J08'], { extra: 14 }),
  scene('DIARIO', ['J09'], { extra: 16 }),
  scene('BOOM', ['J10'], { extra: 16 }),
  scene('CORSARIO', ['J11'], { extra: 12 }),
  scene('TREINTA', ['J12'], { extra: 14 }),
  scene('FIN', ['J13'], { extra: 18, night: true }),
  scene('FORMAS', ['J14'], { bump: 'Qué escribe', extra: 12 }),
  scene('ESCAL', ['J15'], { extra: 16 }),
  scene('IDEAS', ['J16'], { extra: 16 }),
  scene('ADMIR', ['J17'], { extra: 30 }),
  scene('QUIEN', ['J18'], { bump: 'Antes de elegir', extra: 12 }),
  scene('RITMO', ['J19'], { extra: 16 }),
  scene('P1', ['J20', 'J21', 'J22'], { bump: 'Cuatro puertas', gaps: [0.45, 0.5], extra: 40 }),
  scene('P2', ['J23', 'J24', 'J25'], { gaps: [0.45, 0.5], extra: 44, tin: 'slide' }),
  scene('P3', ['J26', 'J27', 'J28'], { gaps: [0.45, 0.5], extra: 44, tin: 'slide' }),
  scene('P4', ['J29', 'J30', 'J31'], { gaps: [0.45, 0.5], extra: 44, tin: 'slide' }),
  scene('CORTOS', ['J32'], { extra: 16 }),
  scene('PAPEL', ['J33', 'J34'], { bump: 'Mejor en papel', gaps: [0.45], extra: 18 }),
  scene('VIDA', ['J35', 'J36'], { bump: 'Su vida, en sus libros', gaps: [0.5], extra: 30, night: true }),
  scene('ORDEN', ['J38'], { extra: 18 }),
  scene('VERSION', ['J39', 'J40', 'J41', 'J42'], { bump: 'Qué versión escuchar', gaps: [0.4, 0.45, 0.45], extra: 14 }),
  scene('WEB', ['J43'], { extra: 20 }),
  scene('RUTAS', ['J44', 'J45', 'J46'], { bump: 'Tu ruta', gaps: [0.4, 0.45], extra: 24 }),
  scene('COMENT', ['J47'], { extra: 14 }),
  scene('OUTRO', ['J48'], { lead: sec(0.5), minDur: sec(14) }),
];
export const KRK_BUMPS = KRK_SCENES.filter((s) => s.bump).map((s) => s.id);

export const krkStart = (id: string) => {
  let a = 0;
  for (const s of KRK_SCENES) { if (s.id === id) return a; a += s.dur; }
  return a;
};
export const KRK_TOTAL = KRK_SCENES.reduce((a, s) => a + s.dur, 0);
export const krkVoIntervals = () => KRK_SCENES.flatMap((s) => s.vo.map((v) => [krkStart(s.id) + v.at, krkStart(s.id) + v.at + fullFrames(v.id)] as const));
export const sceneDef = (id: string) => KRK_SCENES.find((s) => s.id === id)!;

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
export const KRK_CHAPTERS: { label: string; from: string }[] = [
  { label: '¿Por dónde empezar con Kierkegaard?', from: 'HOOK' },
  { label: 'Quién era Kierkegaard', from: 'CPH' },
  { label: 'Qué escribe: los tres estadios', from: 'FORMAS' },
  { label: 'Antes de elegir: los seudónimos y el ritmo', from: 'QUIEN' },
  { label: 'Diario de un seductor', from: 'P1' },
  { label: 'Temor y temblor', from: 'P2' },
  { label: 'La pureza de corazón es querer una sola cosa', from: 'P3' },
  { label: 'La enfermedad mortal', from: 'P4' },
  { label: 'Si tienes poco tiempo', from: 'CORTOS' },
  { label: 'Mejor en papel', from: 'PAPEL' },
  { label: 'Su vida, en sus libros (y el orden)', from: 'VIDA' },
  { label: 'Qué versión escuchar', from: 'VERSION' },
  { label: 'Tres rutas de lectura', from: 'RUTAS' },
];
