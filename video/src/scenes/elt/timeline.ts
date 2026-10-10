import { FPS } from '../../brand/tokens';
import { voFrames, VOS } from '../../lib/vo';

// Cada escena: locuciones (en orden, con huecos opcionales) + margen de entrada/salida.
// `from`/`to` (segundos) recortan una locución para colocarla por partes.
export type VoPart = { id: string; at: number; from?: number; to?: number };
export type SceneDef = { id: string; vo: VoPart[]; lead: number; dur: number };

const sec = (s: number) => Math.round(s * FPS);
const simple = (id: string, lead = sec(0.35), tail = sec(0.6)): SceneDef => ({ id, vo: [{ id, at: lead }], lead, dur: lead + voFrames(id) + tail });

// E06: VO A partida en dos («Pulsas Ir al libro,» / «tocas el altavoz…»), 6 s de audio original y VO B.
export const E06 = {
  a1At: sec(0.3),
  // Corte entre «libro»,» y «tocas», calculado con las marcas de tiempo reales de la locución.
  a1To: (() => { const w = VOS.E06A?.words ?? []; const i = w.findIndex((x) => x.w.startsWith('tocas')); return i > 0 ? (w[i - 1].e + w[i].s) / 2 : 1.75; })(),
  a2From: (() => { const w = VOS.E06A?.words ?? []; const i = w.findIndex((x) => x.w.startsWith('tocas')); return i > 0 ? Math.max(0, w[i].s - 0.06) : 1.95; })(),
  a2At: sec(6.35),
  clip2At: sec(5.73), clip3At: sec(8.03),
  sampleAt: sec(8.1), sampleDur: sec(6.0),
  bAt: sec(14.1),
};
const e06: SceneDef = {
  id: 'E06',
  vo: [
    { id: 'E06A', at: E06.a1At, to: E06.a1To },
    { id: 'E06A', at: E06.a2At, from: E06.a2From },
    { id: 'E06B', at: E06.bAt },
  ],
  lead: sec(0.3),
  dur: E06.bAt + voFrames('E06B') + sec(0.3),
};

export const SCENES: SceneDef[] = [
  simple('E01', sec(0.3), sec(1.4)),
  simple('E02', sec(0.2), sec(0.8)),
  simple('E03'),
  simple('E04', sec(0.35), sec(0.45)),
  simple('E05'),
  e06,
  simple('E07'),
  simple('E08'),
  simple('E09'),
  simple('E10', sec(0.3), sec(3.2)),
];

export const sceneStart = (i: number) => SCENES.slice(0, i).reduce((a, s) => a + s.dur, 0);
export const TOTAL = SCENES.reduce((a, s) => a + s.dur, 0);

// Intervalos globales con locución, para bajar la música (ducking).
export const voIntervals = () => SCENES.flatMap((s, i) => [
  ...s.vo.map((v) => {
    const len = v.to !== undefined || v.from !== undefined ? Math.round(((v.to ?? voFrames(v.id) / FPS) - (v.from ?? 0)) * FPS) : voFrames(v.id);
    return [sceneStart(i) + v.at, sceneStart(i) + v.at + len] as const;
  }),
  // El audio original de El Libro Total también baja la música.
  ...(s.id === 'E06' ? [[sceneStart(i) + E06.sampleAt, sceneStart(i) + E06.sampleAt + E06.sampleDur] as const] : []),
]);
