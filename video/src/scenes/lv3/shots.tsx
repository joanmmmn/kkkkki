import React from 'react';
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

export type ShotDef = { id: string; scenes: string[]; C: React.FC<{ dur: number }>; tin: 'cut' | 'soft' | 'page' };

// Planos del vídeo, en orden. Cada uno abarca una o varias escenas de la locución.
export const SHOTS: ShotDef[] = [
  { id: 'A', scenes: ['S01', 'S02'], C: Opening, tin: 'cut' },
  { id: 'B', scenes: ['S03'], C: Contents, tin: 'soft' },
  { id: 'C', scenes: ['S04'], C: Idea, tin: 'page' },
  { id: 'D', scenes: ['S05'], C: Pipeline, tin: 'soft' },
  { id: 'E', scenes: ['S07'], C: Shelf, tin: 'soft' },
  { id: 'F', scenes: ['S08', 'S09', 'S10'], C: Web, tin: 'page' },
  { id: 'G', scenes: ['S11'], C: Mobile, tin: 'soft' },
  { id: 'H', scenes: ['S06'], C: Legal, tin: 'page' },
  { id: 'I', scenes: ['S12'], C: Voices, tin: 'soft' },
  { id: 'J', scenes: ['S13'], C: Verdict, tin: 'page' },
  { id: 'K', scenes: ['S14'], C: Outro, tin: 'soft' },
];
