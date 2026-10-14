import React from 'react';
import { G01Hook, G02Que, G03Planes, G04Extendido } from './Intro';
import { G05Portada, G06Originals, G07Buscar, G08Reproductor, G09SinReloj } from './App';
import { G10Dispositivos, G11Opiniones, G12ProsCons, G13Veredicto } from './Verdict';
import { H01Gratis, H02Desde, H03Alta, H04Truco, H05Compara, H06Outro } from './Trial';

export type SceneProps = { lead: number; dur: number; enter?: 'rise' | 'glide'; exit?: 'glide' | 'none' };
export const AUD_COMPONENTS: Record<string, React.FC<SceneProps>> = {
  G01: G01Hook,
  G02: G02Que,
  G03: G03Planes,
  G04: G04Extendido,
  G05: G05Portada,
  G06: G06Originals,
  G07: G07Buscar,
  G08: G08Reproductor,
  G09: G09SinReloj,
  G10: G10Dispositivos,
  G11: G11Opiniones,
  G12: G12ProsCons,
  G13: G13Veredicto,
  H01: H01Gratis,
  H02: H02Desde,
  H03: H03Alta,
  H04: H04Truco,
  H05: H05Compara,
  H06: H06Outro,
};
