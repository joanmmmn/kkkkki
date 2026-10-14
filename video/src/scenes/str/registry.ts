import React from 'react';
import { A01Hook, A02Que, A03Planes } from './Intro';
import { A04Portada, A05Originals, A06Buscar, A07Reproductor, A08Leer, A08BSinReloj } from './App';
import { A09Dispositivos, A10Opiniones, A11ProsCons, A12Veredicto } from './Verdict';
import { B01Gratis, B02Alta, B03App, B04Decide, B05Compara, B06Outro } from './Trial';

export type SceneProps = { lead: number; dur: number; enter?: 'rise' | 'glide'; exit?: 'glide' | 'none' };
export const STR_COMPONENTS: Record<string, React.FC<SceneProps>> = {
  A01: A01Hook,
  A02: A02Que,
  A03: A03Planes,
  A04: A04Portada,
  A05: A05Originals,
  A06: A06Buscar,
  A07: A07Reproductor,
  A08: A08Leer,
  A08B: A08BSinReloj,
  A09: A09Dispositivos,
  A10: A10Opiniones,
  A11: A11ProsCons,
  A12: A12Veredicto,
  B01: B01Gratis,
  B02: B02Alta,
  B03: B03App,
  B04: B04Decide,
  B05: B05Compara,
  B06: B06Outro,
};
