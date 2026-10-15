import React from 'react';
import { Hook } from './Hook';
import { Name3D } from './three/Library';
import { Versions3D } from './three/Versions';
import { Mapa3D } from './three/Map3D';
import { TitleCard } from './three/TitleCard';
import { Moscu, Pobres, Siberia, Steno, Fin } from './Bio';
import { Temas, Cinco, Admir, Preguntas } from './Themes';
import { P1, P2, P3, P4, P5, Cortos } from './Doors';
import { Karam, Demon, Vida, Orden } from './Later';
import { Version, Web } from './Listen';
import { Rutas, Coment, Outro } from './Routes';

// Escenas del episodio de Dostoievski. Las que aún no existen se dibujan como marcador (Placeholder en Main.tsx).
export const DSK_COMPONENTS: Record<string, React.FC> = {
  HOOK: Hook,
  NAME: Name3D,
  VERS: Versions3D,
  MAPA: Mapa3D,
  TITLE: TitleCard,
  MOSCU: Moscu,
  POBRES: Pobres,
  SIBERIA: Siberia,
  STENO: Steno,
  FIN: Fin,
  TEMAS: Temas,
  CINCO: Cinco,
  ADMIR: Admir,
  PREG: Preguntas,
  P1,
  P2,
  P3,
  P4,
  P5,
  CORTOS: Cortos,
  KARAM: Karam,
  DEMON: Demon,
  VIDA: Vida,
  ORDEN: Orden,
  VERSION: Version,
  WEB: Web,
  RUTAS: Rutas,
  COMENT: Coment,
  OUTRO: Outro,
};
