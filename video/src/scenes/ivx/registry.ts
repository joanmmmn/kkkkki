import React from 'react';
import { W01Hook, W02Que, W03Cookies, W04Precios } from './Intro';
import { W05App, W06Exclusivo, W07Reproductor, W08Radio, W09Audiolibros } from './App';
import { W10Opiniones, W11ProsCons, W12Veredicto } from './Verdict';
import { X01Gratis, X02Plan, X03Baja, X04Compara, X05Outro } from './Trial';

export type SceneProps = { lead: number; dur: number; enter?: 'rise' | 'glide'; exit?: 'glide' | 'none' };
export const IVX_COMPONENTS: Record<string, React.FC<SceneProps>> = {
  W01: W01Hook,
  W02: W02Que,
  W03: W03Cookies,
  W04: W04Precios,
  W05: W05App,
  W06: W06Exclusivo,
  W07: W07Reproductor,
  W08: W08Radio,
  W09: W09Audiolibros,
  W10: W10Opiniones,
  W11: W11ProsCons,
  W12: W12Veredicto,
  X01: X01Gratis,
  X02: X02Plan,
  X03: X03Baja,
  X04: X04Compara,
  X05: X05Outro,
};
