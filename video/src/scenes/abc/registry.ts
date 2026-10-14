import React from 'react';
import { D01Hook, D02Que, D03Creditos, D04Espanol } from './Intro';
import { D05Trampa, D06Fichas, D07Reproductor, D08Gratis } from './App';
import { D09Familia, D10Opiniones, D11ProsCons, D12Veredicto } from './Verdict';
import { F01Gratis, F02Desde, F03Alta, F04SinTruco, F05Compara, F06Outro } from './Trial';

export type SceneProps = { lead: number; dur: number; enter?: 'rise' | 'glide'; exit?: 'glide' | 'none' };
export const ABC_COMPONENTS: Record<string, React.FC<SceneProps>> = {
  D01: D01Hook,
  D02: D02Que,
  D03: D03Creditos,
  D04: D04Espanol,
  D05: D05Trampa,
  D06: D06Fichas,
  D07: D07Reproductor,
  D08: D08Gratis,
  D09: D09Familia,
  D10: D10Opiniones,
  D11: D11ProsCons,
  D12: D12Veredicto,
  F01: F01Gratis,
  F02: F02Desde,
  F03: F03Alta,
  F04: F04SinTruco,
  F05: F05Compara,
  F06: F06Outro,
};
