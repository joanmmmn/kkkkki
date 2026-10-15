import React from 'react';
import { Y01Hook } from './Y01Hook';
import { Y02Promise } from './Y02Promise';
import { Y03What } from './Y03What';
import { Y04Catalog } from './Y04Catalog';
import { Y05Spain } from './Y05Spain';
import { Y06Find } from './Y06Find';
import { Y07Book } from './Y07Book';
import { Y08Mobile } from './Y08Mobile';
import { Y09Voices } from './Y09Voices';
import { Y10Volunteer } from './Y10Volunteer';
import { Y11ProsCons } from './Y11ProsCons';
import { Y12Verdict } from './Y12Verdict';
import { Y13Outro } from './Y13Outro';

export const LV_COMPONENTS: Record<string, React.FC<{ lead: number; dur: number }>> = {
  Y01: Y01Hook,
  Y02: Y02Promise,
  Y03: Y03What,
  Y04: Y04Catalog,
  Y05: Y05Spain,
  Y06: Y06Find,
  Y07: Y07Book,
  Y08: Y08Mobile,
  Y09: Y09Voices,
  Y10: Y10Volunteer,
  Y11: Y11ProsCons,
  Y12: Y12Verdict,
  Y13: Y13Outro,
};
