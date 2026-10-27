import { FPS } from '../../brand/tokens';
import { voFrames, voSpeechFrames } from '../../lib/vo';

// Reseña de Everand: doce escenas encadenadas sin silencios (0,12 s de entrada, ~0,3 s de salida).
export type SceneDef = { id: string; lead: number; dur: number };

const sec = (s: number) => Math.round(s * FPS);
const LEAD = sec(0.12);
const TAIL = sec(0.3);
const simple = (id: string, tail = TAIL): SceneDef => ({ id, lead: LEAD, dur: LEAD + voSpeechFrames(id) + tail });

export const SCENES_EVD: SceneDef[] = [
  'R01', 'R02', 'R03', 'R04', 'R05', 'R06', 'R07', 'R08', 'R09', 'R10', 'R11',
].map((id) => simple(id)).concat([simple('R12', sec(3.2))]);

export const startEvd = (i: number) => SCENES_EVD.slice(0, i).reduce((a, s) => a + s.dur, 0);
export const TOTAL_EVD = SCENES_EVD.reduce((a, s) => a + s.dur, 0);
export const sceneStart = (id: string) => startEvd(SCENES_EVD.findIndex((s) => s.id === id));

// Intervalos con locución, para bajar la música.
export const voIntervalsEvd = () => SCENES_EVD.map((s, i) => [startEvd(i) + s.lead, startEvd(i) + s.lead + voFrames(s.id)] as const);
