import React from 'react';
import { N01Hook } from './N01Hook';
import { N02Sonor } from './N02Sonor';
import { N03Oferta } from './N03Oferta';
import { N04Cuenta } from './N04Cuenta';
import { N09Outro } from './N09Outro';
import { nxPlaceholder } from './Placeholder';

export const NX_COMPONENTS: Record<string, React.FC<{ lead: number; dur: number }>> = {
  N01: N01Hook,
  N02: N02Sonor,
  N03: N03Oferta,
  N04: N04Cuenta,
  N05: nxPlaceholder('Plan'),
  N06: nxPlaceholder('Pago'),
  N07: nxPlaceholder('Listo'),
  N08: nxPlaceholder('Cancelar'),
  N09: N09Outro,
};
