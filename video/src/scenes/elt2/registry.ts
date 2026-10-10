import React from 'react';
import { H01Hook } from './H01Hook';
import { H02Promise } from './H02Promise';
import { H03What } from './H03What';
import { H04Catalog } from './H04Catalog';
import { H05Use } from './H05Use';
import { H07Voices } from './H07Voices';
import { H08Tools } from './H08Tools';
import { H09App } from './H09App';
import { H10ProsCons } from './H10ProsCons';
import { H11Price } from './H11Price';
import { H12Verdict } from './H12Verdict';

// Escenas de la v2.
export const SCENE_COMPONENTS: Record<string, React.FC<{ lead: number; dur: number }>> = {
  V01: H01Hook,
  V02: H02Promise,
  V03: H03What,
  V04: H04Catalog,
  V05: H05Use,
  V07: H07Voices,
  V08: H08Tools,
  V09: H09App,
  V10: H10ProsCons,
  V11: H11Price,
  V12: H12Verdict,
};
