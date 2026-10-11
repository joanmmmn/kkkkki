import React from 'react';
import { R01Hook } from './R01Hook';
import { R02Comparativa } from './R02Comparativa';
import { R03Ficha } from './R03Ficha';
import { R04Oferta } from './R04Oferta';
import { R05Cuenta } from './R05Cuenta';
import { R08Listo } from './R08Listo';
import { R09Ultra } from './R09Ultra';
import { R10Cancelar } from './R10Cancelar';
import { R11Outro } from './R11Outro';
import { erPlaceholder } from './Placeholder';

export const ER_COMPONENTS: Record<string, React.FC<{ lead: number; dur: number }>> = {
  R01: R01Hook,
  R02: R02Comparativa,
  R03: R03Ficha,
  R04: R04Oferta,
  R05: R05Cuenta,
  R06: erPlaceholder('Planes: Ultra · 30 días gratis', 'Grabación de Joan pendiente'),
  R07: erPlaceholder('Pago: 0 € hoy · tarjeta tapada', 'Grabación de Joan pendiente'),
  R08: R08Listo,
  R09: R09Ultra,
  R10: R10Cancelar,
  R11: R11Outro,
};
