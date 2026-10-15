import { FPS } from '../../brand/tokens';
import { VOS, voFrames, voSpeechFrames, wordFrame } from '../../lib/vo';

// «La historia detrás del libro» · Cien años de soledad. Locución en public/hdl/vo (ids W..).
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
    if (!missing.has(k)) { missing.add(k); console.warn(`[hdl] palabra no encontrada: ${k}`); }
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
export type Tin = 'push' | 'cut' | 'slide' | 'fade';
// `chapter`: título del separador de capítulo que tapa el arranque de la escena (la escena se dibuja desde `pre`).
export type SceneDef = { id: string; vo: VoPart[]; dur: number; chapter?: string; pre: number; tin: Tin; night?: boolean };
export const CH_PRE = 30;
const LEAD = sec(0.18);
const GAP = sec(0.45);
const TAIL = sec(0.36);

const scene = (id: string, ids: string[], o: { lead?: number; gaps?: number[]; extra?: number; chapter?: string; tin?: Tin; night?: boolean; minDur?: number } = {}): SceneDef => {
  const lead = o.lead ?? (o.chapter ? sec(1.1) : LEAD);
  const vo: VoPart[] = [];
  let t = lead;
  ids.forEach((v, i) => {
    if (i > 0) t += o.gaps?.[i - 1] !== undefined ? sec(o.gaps[i - 1]) : GAP;
    vo.push({ id: v, at: t });
    t += speechFrames(v);
  });
  const dur = Math.max(o.minDur ?? 0, t + TAIL + (o.extra ?? 0));
  return { id, vo, dur, chapter: o.chapter, pre: o.chapter ? CH_PRE : 0, tin: o.chapter ? 'cut' : o.tin ?? 'push', night: o.night };
};

export const HDL_SCENES: SceneDef[] = [
  scene('HOOK', ['W01', 'W02', 'W03'], { lead: sec(1.9), gaps: [0.5, 1.45], extra: 30, night: true }),
  scene('LEGACY', ['W04'], { extra: 24, tin: 'fade', night: true }),
  scene('TITLE', [], { minDur: sec(4.6), tin: 'fade', night: true }),
  scene('ESCRITOR', ['W05', 'W06'], { chapter: 'Un escritor que no vendía', gaps: [0.55], extra: 12 }),
  scene('CASA', ['W07'], { extra: 20 }),
  scene('CARRETERA', ['W08'], { chapter: 'La carretera de Acapulco', extra: 14 }),
  scene('ABUELA', ['W09'], { extra: 16, tin: 'fade' }),
  scene('VUELTA', ['W10'], { extra: 22 }),
  scene('CUEVA', ['W11', 'W12'], { chapter: 'La cueva de la mafia', gaps: [0.65], extra: 12 }),
  scene('AMIGOS', ['W13'], { extra: 18 }),
  scene('MERCEDES', ['W14', 'W15'], { chapter: 'Mercedes', gaps: [0.55], extra: 12 }),
  scene('VECINOS', ['W16'], { extra: 16 }),
  scene('DEUDA', ['W17'], { extra: 18 }),
  scene('CORREOS', ['W18', 'W19'], { chapter: '82 pesos', gaps: [0.55], extra: 10 }),
  scene('EMPENO', ['W20'], { extra: 12 }),
  scene('FRASE', ['W21'], { extra: 34, tin: 'fade', night: true }),
  scene('GIRO', ['W22'], { extra: 18 }),
  scene('PORRUA', ['W23', 'W24'], { chapter: 'Ocho mil ejemplares', gaps: [0.55], extra: 10 }),
  scene('AGOTADO', ['W25'], { extra: 40, tin: 'fade' }),
  scene('NOBEL', ['W26'], { chapter: 'Lo que vino después', extra: 16 }),
  scene('CINE', ['W27', 'W28'], { gaps: [0.55], extra: 18 }),
  scene('VERSIONES', ['W29'], { chapter: '¿Pasó de verdad?', extra: 14 }),
  scene('DUDAS', ['W30', 'W31'], { gaps: [0.55], extra: 14 }),
  scene('MACONDO', ['W32'], { extra: 34, tin: 'fade', night: true }),
  scene('AUDIO', ['W33', 'W34'], { gaps: [0.5], extra: 22 }),
  scene('OUTRO', ['W35'], { lead: sec(0.5), minDur: sec(14), tin: 'fade' }),
];
export const HDL_CHAPTERS = HDL_SCENES.filter((s) => s.chapter).map((s) => s.id);

export const hdlStart = (id: string) => {
  let a = 0;
  for (const s of HDL_SCENES) { if (s.id === id) return a; a += s.dur; }
  return a;
};
export const HDL_TOTAL = HDL_SCENES.reduce((a, s) => a + s.dur, 0);
export const hdlVoIntervals = () => HDL_SCENES.flatMap((s) => s.vo.map((v) => [hdlStart(s.id) + v.at, hdlStart(s.id) + v.at + fullFrames(v.id)] as const));
export const sceneDef = (id: string) => HDL_SCENES.find((s) => s.id === id)!;

// Reloj de escena: fotograma (de la escena, contando desde que se dibuja) de una palabra de una de sus locuciones.
export const sceneClock = (sceneId: string) => {
  const s = sceneDef(sceneId);
  const offset = s.pre;
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
export const HDL_YT_CHAPTERS: { label: string; from: string }[] = [
  { label: '82 pesos en una oficina de correos', from: 'HOOK' },
  { label: 'Un escritor que no vendía', from: 'ESCRITOR' },
  { label: 'La carretera de Acapulco', from: 'CARRETERA' },
  { label: 'La cueva de la mafia', from: 'CUEVA' },
  { label: 'Mercedes', from: 'MERCEDES' },
  { label: 'El envío del manuscrito', from: 'CORREOS' },
  { label: 'Ocho mil ejemplares', from: 'PORRUA' },
  { label: 'Lo que vino después', from: 'NOBEL' },
  { label: '¿Pasó de verdad?', from: 'VERSIONES' },
  { label: 'Escuchar Cien años de soledad en audiolibro', from: 'AUDIO' },
];
