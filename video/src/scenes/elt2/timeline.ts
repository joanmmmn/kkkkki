import { FPS } from '../../brand/tokens';
import { voFrames, voSpeechFrames } from '../../lib/vo';

// v2: escenas encadenadas sin silencios (0,12 s de entrada, ~0,3 s de salida).
export type VoPart = { id: string; at: number; from?: number; to?: number };
export type SceneDef = { id: string; vo: VoPart[]; lead: number; dur: number; audio?: { src: string; at: number; dur: number }[] };

const sec = (s: number) => Math.round(s * FPS);
const LEAD = sec(0.12);
const TAIL = sec(0.3);
const simple = (id: string, tail = TAIL): SceneDef => ({ id, vo: [{ id, at: LEAD }], lead: LEAD, dur: LEAD + voSpeechFrames(id) + tail });

// H01: arranque en frío con 3,3 s de la narración original y después la VO del gancho.
export const H01 = { coldDur: sec(3.3), voAt: sec(3.45) };
const h01: SceneDef = {
  id: 'V01', lead: H01.voAt, vo: [{ id: 'V01', at: H01.voAt }],
  audio: [{ src: 'elt/audio/cold_open.mp3', at: 0, dur: sec(3.35) }],
  dur: H01.voAt + voSpeechFrames('V01') + sec(0.45),
};

// H05: VO de uso → 2,3 s de narración original → VO «…y el texto se resalta».
export const H05 = (() => {
  const v05 = LEAD;
  const sampleAt = v05 + voSpeechFrames('V05') + sec(0.15);
  const sampleDur = sec(2.3);
  const v06 = sampleAt + sampleDur + sec(0.05);
  return { v05, sampleAt, sampleDur, v06, dur: v06 + voSpeechFrames('V06') + sec(0.35) };
})();
const h05: SceneDef = {
  id: 'V05', lead: LEAD, vo: [{ id: 'V05', at: H05.v05 }, { id: 'V06', at: H05.v06 }],
  audio: [{ src: 'elt/audio/sample2.mp3', at: H05.sampleAt, dur: H05.sampleDur }],
  dur: H05.dur,
};

export const SCENES2: SceneDef[] = [
  h01,
  simple('V02'),
  simple('V03'),
  simple('V04'),
  h05,
  simple('V07'),
  simple('V08'),
  simple('V09'),
  simple('V10'),
  simple('V11'),
  { ...simple('V12'), dur: LEAD + voSpeechFrames('V12') + sec(3.2) },
];

export const start2 = (i: number) => SCENES2.slice(0, i).reduce((a, s) => a + s.dur, 0);
export const TOTAL2 = SCENES2.reduce((a, s) => a + s.dur, 0);

// Intervalos con voz (VO + audio original) para bajar la música.
export const voIntervals2 = () => SCENES2.flatMap((s, i) => [
  ...s.vo.map((v) => [start2(i) + v.at, start2(i) + v.at + voFrames(v.id)] as const),
  ...(s.audio ?? []).map((a) => [start2(i) + a.at, start2(i) + a.at + a.dur] as const),
]);
