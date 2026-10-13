import React from 'react';
import { SetView } from './kit';
import { Opening } from './A_Opening';
import { Contents } from './B_Contents';
import { Idea } from './C_Idea';
import { Pipeline } from './D_Pipeline';
import { Shelf } from './E_Shelf';
import { Web } from './F_Web';
import { Mobile } from './G_Mobile';
import { Legal } from './H_Legal';
import { Voices } from './I_Voices';
import { Verdict } from './J_Verdict';
import { Outro } from './K_Outro';

// bg: cómo se encuadra el fondo de la biblioteca al empezar y al acabar el plano (se desplaza despacio entre los dos)
export type ShotDef = { id: string; scenes: string[]; C: React.FC<{ dur: number }>; tin: 'cut' | 'soft' | 'page'; bg: [SetView, SetView] };
const v = (x: number, y: number, s: number, dim: number): SetView => ({ x, y, s, dim });

// Planos del vídeo, en orden. Cada uno abarca una o varias escenas de la locución.
export const SHOTS: ShotDef[] = [
  { id: 'A', scenes: ['S01', 'S02'], C: Opening, tin: 'cut', bg: [v(0, 0, 1, 0.35), v(0, 0, 1.02, 0.3)] },
  { id: 'B', scenes: ['S03'], C: Contents, tin: 'soft', bg: [v(40, 0, 1.02, 0.3), v(-40, 10, 1.05, 0.3)] },
  { id: 'C', scenes: ['S04'], C: Idea, tin: 'page', bg: [v(60, -10, 1, 0.32), v(-30, 0, 1.04, 0.32)] },
  { id: 'D', scenes: ['S05'], C: Pipeline, tin: 'soft', bg: [v(130, 0, 1.05, 0.28), v(-130, 0, 1.05, 0.28)] },
  { id: 'E', scenes: ['S07'], C: Shelf, tin: 'soft', bg: [v(-60, 0, 1.04, 0.3), v(60, 0, 1.08, 0.3)] },
  { id: 'F', scenes: ['S08', 'S09', 'S10'], C: Web, tin: 'page', bg: [v(-90, 0, 1, 0.28), v(70, 0, 1.06, 0.28)] },
  { id: 'G', scenes: ['S11'], C: Mobile, tin: 'soft', bg: [v(90, 0, 1.04, 0.28), v(-70, 0, 1.08, 0.28)] },
  { id: 'H', scenes: ['S06'], C: Legal, tin: 'page', bg: [v(110, -20, 1, 0.3), v(-130, 10, 1.04, 0.3)] },
  { id: 'I', scenes: ['S12'], C: Voices, tin: 'soft', bg: [v(0, 0, 1.02, 0.3), v(0, -10, 1.07, 0.3)] },
  { id: 'J', scenes: ['S13'], C: Verdict, tin: 'page', bg: [v(-40, 0, 1, 0.3), v(30, 0, 1.04, 0.3)] },
  { id: 'K', scenes: ['S14'], C: Outro, tin: 'soft', bg: [v(0, 0, 1, 0.26), v(0, 0, 1.04, 0.26)] },
];
