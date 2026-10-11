import React from 'react';
import { N01Hook } from './N01Hook';
import { N02Sonor } from './N02Sonor';
import { N03Oferta } from './N03Oferta';
import { N04Cuenta } from './N04Cuenta';
import { N05Plan } from './N05Plan';
import { N06Pago } from './N06Pago';
import { N07Listo } from './N07Listo';
import { N08Cancelar } from './N08Cancelar';
import { N09Outro } from './N09Outro';

export const NX_COMPONENTS: Record<string, React.FC<{ lead: number; dur: number }>> = {
  N01: N01Hook,
  N02: N02Sonor,
  N03: N03Oferta,
  N04: N04Cuenta,
  N05: N05Plan,
  N06: N06Pago,
  N07: N07Listo,
  N08: N08Cancelar,
  N09: N09Outro,
};
