import React from 'react';
import { K01Hook, K02Que, K03Planes } from './Intro';
import { K04Portada, K05Exclusivos, K06Audiolibros, K07Reproductor, K08Horas } from './App';
import { K09Dispositivos, K10Opiniones, K11ProsCons, K12Veredicto } from './Verdict';
import { L01Gratis, L02Accesos, L03Pasos, L04App, L05Decide, L06Outro } from './Trial';

export type SceneProps = { lead: number; dur: number; enter?: 'rise' | 'glide'; exit?: 'glide' | 'none' };
export const PDR_COMPONENTS: Record<string, React.FC<SceneProps>> = {
  K01: K01Hook,
  K02: K02Que,
  K03: K03Planes,
  K04: K04Portada,
  K05: K05Exclusivos,
  K06: K06Audiolibros,
  K07: K07Reproductor,
  K08: K08Horas,
  K09: K09Dispositivos,
  K10: K10Opiniones,
  K11: K11ProsCons,
  K12: K12Veredicto,
  L01: L01Gratis,
  L02: L02Accesos,
  L03: L03Pasos,
  L04: L04App,
  L05: L05Decide,
  L06: L06Outro,
};
