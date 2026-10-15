import React from 'react';
import { D01Hook, D02Que, D03Planes, D04Ingles, D05Catalogo } from './Intro';
import { D06Portada, D07Buscar, D08Reproductor, D09Leer, D10Horas } from './App';
import { D11Dispositivos, D12Opiniones, D13ProsCons, D14Veredicto } from './Verdict';
import { F01Gratis, F02Alta, F03App, F04Cancelar, F05Compara, F06Outro } from './Trial';

export type SceneProps = { lead: number; dur: number; enter?: 'rise' | 'glide'; exit?: 'glide' | 'none' };
export const BKB_COMPONENTS: Record<string, React.FC<SceneProps>> = {
  D01: D01Hook,
  D02: D02Que,
  D03: D03Planes,
  D04: D04Ingles,
  D05: D05Catalogo,
  D06: D06Portada,
  D07: D07Buscar,
  D08: D08Reproductor,
  D09: D09Leer,
  D10: D10Horas,
  D11: D11Dispositivos,
  D12: D12Opiniones,
  D13: D13ProsCons,
  D14: D14Veredicto,
  F01: F01Gratis,
  F02: F02Alta,
  F03: F03App,
  F04: F04Cancelar,
  F05: F05Compara,
  F06: F06Outro,
};
