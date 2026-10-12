import React from 'react';
import { R01Hook, R02Que, R03Planes } from './Intro';
import { R04Inicio, R04Buscar, R05Ficha, R06Leer, R07Escuchar, R08Offline, R09Perfiles, R10Horas } from './App';
import { R11Extras, R12Pdf, R13ProsCons, R14Veredicto } from './Verdict';
import { P01Gratis, P02Accesos, P03Pasos, P04App, P05Decide, P06Outro } from './Trial';

export type SceneProps = { lead: number; dur: number; enter?: 'rise' | 'glide'; exit?: 'glide' | 'none' };
export const NXR_COMPONENTS: Record<string, React.FC<SceneProps>> = {
  R01: R01Hook,
  R02: R02Que,
  R03: R03Planes,
  R04: R04Inicio,
  R04B: R04Buscar,
  R05: R05Ficha,
  R06: R06Leer,
  R07: R07Escuchar,
  R08: R08Offline,
  R09: R09Perfiles,
  R10: R10Horas,
  R11: R11Extras,
  R12: R12Pdf,
  R13: R13ProsCons,
  R14: R14Veredicto,
  P01: P01Gratis,
  P02: P02Accesos,
  P03: P03Pasos,
  P04: P04App,
  P05: P05Decide,
  P06: P06Outro,
};
