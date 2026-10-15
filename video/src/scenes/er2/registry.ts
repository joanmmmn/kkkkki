import React from 'react';
import { X01Hook } from './X01Hook';
import { X02Promise } from './X02Promise';
import { X03What } from './X03What';
import { X04Catalog } from './X04Catalog';
import { X05Import } from './X05Import';
import { X06Voices } from './X06Voices';
import { X07Reader } from './X07Reader';
import { X08More } from './X08More';
import { X09ProsCons } from './X09ProsCons';
import { X10Price } from './X10Price';
import { X11Verdict } from './X11Verdict';
import { X12Trick } from './X12Trick';
import { X13Fast } from './X13Fast';
import { X14Outro } from './X14Outro';

export const ER2_COMPONENTS: Record<string, React.FC<{ lead: number; dur: number }>> = {
  X01: X01Hook,
  X02: X02Promise,
  X03: X03What,
  X04: X04Catalog,
  X05: X05Import,
  X06: X06Voices,
  X07: X07Reader,
  X08: X08More,
  X09: X09ProsCons,
  X10: X10Price,
  X11: X11Verdict,
  X12: X12Trick,
  X13: X13Fast,
  X14: X14Outro,
};
