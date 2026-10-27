import React from 'react';
import { R01Hook } from './R01Hook';
import { R02Promise } from './R02Promise';
import { R03What } from './R03What';
import { R04Twist } from './R04Twist';
import { R05Price } from './R05Price';
import { R06Spanish } from './R06Spanish';
import { R07App } from './R07App';
import { R08Trial } from './R08Trial';
import { R09Reviews } from './R09Reviews';
import { R10ProsCons } from './R10ProsCons';
import { R11Who } from './R11Who';
import { R12Verdict } from './R12Verdict';

// Escenas de la reseña de Everand.
export const SCENE_COMPONENTS_EVD: Record<string, React.FC<{ lead: number; dur: number }>> = {
  R01: R01Hook,
  R02: R02Promise,
  R03: R03What,
  R04: R04Twist,
  R05: R05Price,
  R06: R06Spanish,
  R07: R07App,
  R08: R08Trial,
  R09: R09Reviews,
  R10: R10ProsCons,
  R11: R11Who,
  R12: R12Verdict,
};
