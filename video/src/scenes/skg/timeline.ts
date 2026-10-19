import { FPS } from '../../brand/tokens';
import { VOS, voFrames, voSpeechFrames, wordFrame } from '../../lib/vo';

// «Od czego i jak zacząć» · Stephen King (versión polaca de «AUTOR: Por dónde y cómo empezar a leer»). Locución en public/skg/vo (ids G..).
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
    if (!missing.has(k)) { missing.add(k); console.warn(`[skg] palabra no encontrada: ${k}`); }
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

export const SKG_SCENES: SceneDef[] = [
  scene('HOOK', ['G01', 'G02'], { lead: sec(0.9), gaps: [0.5], extra: 30, night: true }),
  scene('HOURS', ['G03'], { extra: 14, tin: 'dip' }),
  scene('MAPA', ['G04'], { extra: 10, tin: 'dip' }),
  scene('TITLE', [], { minDur: sec(3.6), tin: 'dip' }),
  scene('MAINE', ['G05'], { bump: 'Kim jest', extra: 10 }),
  scene('CARRIE', ['G06', 'G07'], { gaps: [0.5], extra: 12 }),
  scene('BACHMAN', ['G08'], { extra: 16 }),
  scene('TERR', ['G09', 'G10'], { bump: 'Co pisze', gaps: [0.45], extra: 60 }),
  scene('FILMS', ['G11'], { extra: 40 }),
  scene('PREG', ['G12', 'G13'], { bump: 'Zanim wybierzesz', gaps: [0.6], extra: 18 }),
  scene('D1', ['G14', 'G15', 'G16'], { bump: 'Pięć wejść', gaps: [0.45, 0.5], extra: 14 }),
  scene('D2', ['G17', 'G18'], { gaps: [0.45], extra: 56, tin: 'slide' }),
  scene('D3', ['G19', 'G20'], { gaps: [0.45], extra: 56, tin: 'slide' }),
  scene('D4', ['G21', 'G22'], { gaps: [0.45], extra: 56, tin: 'slide' }),
  scene('D5', ['G23', 'G24'], { gaps: [0.45], extra: 56, tin: 'slide' }),
  scene('CORTOS', ['G25'], { extra: 16 }),
  scene('IT', ['G26', 'G27'], { bump: 'Lepiej na później', gaps: [0.4], extra: 12 }),
  scene('TORRE', ['G28', 'G29'], { gaps: [0.45], extra: 16 }),
  scene('CONEX', ['G30', 'G31', 'G32'], { bump: 'Wszystko się łączy', gaps: [0.4, 0.45], extra: 70, night: true }),
  scene('ORDEN', ['G33'], { extra: 18 }),
  scene('VOCES', ['G34', 'G35'], { bump: 'Słuchać Kinga', gaps: [0.5], extra: 14 }),
  scene('WEB', ['G36'], { extra: 60 }),
  scene('RUTAS', ['G37', 'G38', 'G39'], { bump: 'Twoja trasa', gaps: [0.4, 0.45], extra: 24 }),
  scene('COMENT', ['G40'], { extra: 14 }),
  scene('OUTRO', ['G41'], { lead: sec(0.5), minDur: sec(14) }),
];
export const SKG_BUMPS = SKG_SCENES.filter((s) => s.bump).map((s) => s.id);

export const skgStart = (id: string) => {
  let a = 0;
  for (const s of SKG_SCENES) { if (s.id === id) return a; a += s.dur; }
  return a;
};
export const SKG_TOTAL = SKG_SCENES.reduce((a, s) => a + s.dur, 0);
export const skgVoIntervals = () => SKG_SCENES.flatMap((s) => s.vo.map((v) => [skgStart(s.id) + v.at, skgStart(s.id) + v.at + fullFrames(v.id)] as const));
export const sceneDef = (id: string) => SKG_SCENES.find((s) => s.id === id)!;

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

// Capítulos de YouTube (descripción). CORTOS (7 s) va dentro del de D5: YouTube pide al menos 10 s por capítulo.
export const SKG_CHAPTERS: { label: string; from: string }[] = [
  { label: 'Stephen King: od czego zacząć?', from: 'HOOK' },
  { label: 'Kim jest Stephen King', from: 'MAINE' },
  { label: 'Co pisze: nie tylko horror', from: 'TERR' },
  { label: 'Zanim wybierzesz: strach i czas', from: 'PREG' },
  { label: 'Lśnienie', from: 'D1' },
  { label: 'Misery', from: 'D2' },
  { label: 'Zielona mila', from: 'D3' },
  { label: 'Dallas ’63', from: 'D4' },
  { label: 'Pan Mercedes (i dwie krótkie: Carrie, Uniesienie)', from: 'D5' },
  { label: 'Lepiej na później: To, Bastion i Mroczna Wieża', from: 'IT' },
  { label: 'Wszystko się łączy (i kiedy liczy się kolejność)', from: 'CONEX' },
  { label: 'Słuchać Kinga po polsku: lektorzy', from: 'VOCES' },
  { label: 'Trzy trasy', from: 'RUTAS' },
];
