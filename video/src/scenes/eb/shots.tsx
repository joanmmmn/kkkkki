import React from 'react';
import { E } from './kit';
import { Open } from './A_Open';
import { Corridor } from './B_Corridor';
import { What } from './C_What';
import { Copies } from './D_Copies';
import { Regions } from './E_Regions';
import { CardShot } from './F_Card';
import { Step1 } from './G_Step1';
import { Step2 } from './H_Step2';
import { Step3 } from './I_Step3';
import { Step4 } from './J_Step4';
import { Return } from './K_Return';
import { Queues } from './L_Queues';
import { Trick } from './M_Trick';
import { Limits } from './N_Limits';
import { Verdict } from './O_Verdict';
import { Outro } from './P_Outro';

// Transición de entrada de cada plano: corte, desplazamiento por el pasillo, puertas correderas o fundido.
export type Tin = 'cut' | 'push' | 'slide' | 'soft';
export type ShotDef = { id: string; scenes: string[]; C: React.FC<{ dur: number }>; tin: Tin; slide?: [string, string] };


// Planos del vídeo, en orden. Cada uno abarca una o varias escenas de la locución (timeline.json).
export const SHOTS: ShotDef[] = [
  { id: 'A', scenes: ['T01'], C: Open, tin: 'cut' },
  { id: 'B', scenes: ['T02'], C: Corridor, tin: 'push' },
  { id: 'C', scenes: ['T03'], C: What, tin: 'push' },
  { id: 'D', scenes: ['T04'], C: Copies, tin: 'slide', slide: [E.coral, E.mustard] },
  { id: 'E', scenes: ['T05'], C: Regions, tin: 'slide', slide: [E.plum, E.violet] },
  { id: 'F', scenes: ['T06'], C: CardShot, tin: 'push' },
  { id: 'G', scenes: ['T07'], C: Step1, tin: 'push' },
  { id: 'H', scenes: ['T08'], C: Step2, tin: 'slide', slide: [E.coral, E.mustard] },
  { id: 'I', scenes: ['T09'], C: Step3, tin: 'slide', slide: [E.mustard, E.coral] },
  { id: 'J', scenes: ['T10'], C: Step4, tin: 'slide', slide: [E.coral, E.plum] },
  { id: 'K', scenes: ['T11'], C: Return, tin: 'slide', slide: [E.violet, E.lilac] },
  { id: 'L', scenes: ['T12'], C: Queues, tin: 'push' },
  { id: 'M', scenes: ['T13'], C: Trick, tin: 'slide', slide: [E.green, E.pink] },
  { id: 'N', scenes: ['T14'], C: Limits, tin: 'slide', slide: [E.coral, E.mustard] },
  { id: 'O', scenes: ['T15'], C: Verdict, tin: 'push' },
  { id: 'P', scenes: ['T16'], C: Outro, tin: 'soft' },
];
