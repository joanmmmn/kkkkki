import React from 'react';
import { U01Hook, U02Funcionan, U03Planes, U04Horas, U05Duracion, U06Mas, U07Catalogo } from './Intro';
import { U08Seccion, U09Buscar, U10Reproductor, U11Pagina, U12Dispositivos } from './App';
import { U13Opiniones, U14ProsCons, U15Veredicto } from './Verdict';
import { X01Empezar, X02TusHoras, X03Cancelar, X04Compara, X05Outro } from './Trial';

export type SceneProps = { lead: number; dur: number; enter?: 'rise' | 'glide'; exit?: 'glide' | 'none' };
export const SPO_COMPONENTS: Record<string, React.FC<SceneProps>> = {
  U01: U01Hook,
  U02: U02Funcionan,
  U03: U03Planes,
  U04: U04Horas,
  U05: U05Duracion,
  U06: U06Mas,
  U07: U07Catalogo,
  U08: U08Seccion,
  U09: U09Buscar,
  U10: U10Reproductor,
  U11: U11Pagina,
  U12: U12Dispositivos,
  U13: U13Opiniones,
  U14: U14ProsCons,
  U15: U15Veredicto,
  X01: X01Empezar,
  X02: X02TusHoras,
  X03: X03Cancelar,
  X04: X04Compara,
  X05: X05Outro,
};
