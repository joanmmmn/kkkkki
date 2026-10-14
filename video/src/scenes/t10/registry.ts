import React from 'react';
import { Hook, Serie, Regla } from './Intro';
import { B1, B2, B3, B4, B5, B6, B7, B8, B9, B10 } from './Books';
import { Tip, Web, Coment, Outro } from './Outro';

export const T10_COMPONENTS: Record<string, React.FC> = {
  HOOK: Hook, SERIE: Serie, REGLA: Regla,
  B1, B2, B3, B4, B5, B6, B7, B8, B9, B10,
  TIP: Tip, WEB: Web, COMENT: Coment, OUTRO: Outro,
};
