import React from 'react';
import { Hook } from './Hook';
import { Name3D } from './three/Library';
import { Works3D } from './three/Works3D';
import { Mapa3D } from './three/Map3D';
import { TitleCard } from './three/TitleCard';
import { Cph, Mald, Diario, Boom, Corsario, Treinta, Fin } from './Bio';
import { Formas, Escal, Ideas, Admir, Quien, Ritmo } from './Themes';
import { P1, P2, P3, P4, Cortos } from './Doors';
import { Papel, Vida, Orden } from './Later';
import { Version, Web } from './Listen';
import { Rutas, Coment, Outro } from './Routes';

// Escenas del episodio de Kierkegaard. Las que aún no existen se dibujan como marcador (Placeholder en Main.tsx).
export const KRK_COMPONENTS: Record<string, React.FC> = {
  HOOK: Hook,
  NAME: Name3D,
  VERS: Works3D,
  MAPA: Mapa3D,
  TITLE: TitleCard,
  CPH: Cph,
  MALD: Mald,
  DIARIO: Diario,
  BOOM: Boom,
  CORSARIO: Corsario,
  TREINTA: Treinta,
  FIN: Fin,
  FORMAS: Formas,
  ESCAL: Escal,
  IDEAS: Ideas,
  ADMIR: Admir,
  QUIEN: Quien,
  RITMO: Ritmo,
  P1,
  P2,
  P3,
  P4,
  CORTOS: Cortos,
  PAPEL: Papel,
  VIDA: Vida,
  ORDEN: Orden,
  VERSION: Version,
  WEB: Web,
  RUTAS: Rutas,
  COMENT: Coment,
  OUTRO: Outro,
};
