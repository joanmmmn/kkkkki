import React from 'react';
import { Hook3D } from './three/Library';
import { Hours3D } from './three/Desk';
import { Mapa3D } from './three/Map3D';
import { TitleCard } from './three/TitleCard';
import { Maine, CarrieOrigin, Bachman } from './Bio';
import { Territories, Films, Preguntas } from './Genres';
import { D1, D2, D3, D4, D5, Cortos } from './Doors';
import { ItScene, TorreScene } from './Later';
import { Conexiones, Orden } from './Links';
import { Voces, Web } from './Listen';
import { Rutas, Coment, Outro } from './Routes';

export const SKG_COMPONENTS: Record<string, React.FC> = {
  HOOK: Hook3D,
  HOURS: Hours3D,
  MAPA: Mapa3D,
  TITLE: TitleCard,
  MAINE: Maine,
  CARRIE: CarrieOrigin,
  BACHMAN: Bachman,
  TERR: Territories,
  FILMS: Films,
  PREG: Preguntas,
  D1, D2, D3, D4, D5,
  CORTOS: Cortos,
  IT: ItScene,
  TORRE: TorreScene,
  CONEX: Conexiones,
  ORDEN: Orden,
  VOCES: Voces,
  WEB: Web,
  RUTAS: Rutas,
  COMENT: Coment,
  OUTRO: Outro,
};
