import React from 'react';
import { Hook, Legacy, TitleCard } from './Open';
import { Escritor, Casa } from './Bio';
import { Carretera, Abuela, Vuelta } from './Road';
import { Cueva, Amigos } from './Cave';
import { Mercedes, Vecinos, Deuda } from './Mercedes';
import { Correos, Empeno, Frase, Giro } from './Post';
import { Porrua, Agotado } from './Success';
import { Nobel, Cine } from './Legacy';
import { Versiones, Dudas, Macondo } from './Truth';
import { AudioScene, Outro } from './End';

export const HDL_COMPONENTS: Record<string, React.FC> = {
  HOOK: Hook,
  LEGACY: Legacy,
  TITLE: TitleCard,
  ESCRITOR: Escritor,
  CASA: Casa,
  CARRETERA: Carretera,
  ABUELA: Abuela,
  VUELTA: Vuelta,
  CUEVA: Cueva,
  AMIGOS: Amigos,
  MERCEDES: Mercedes,
  VECINOS: Vecinos,
  DEUDA: Deuda,
  CORREOS: Correos,
  EMPENO: Empeno,
  FRASE: Frase,
  GIRO: Giro,
  PORRUA: Porrua,
  AGOTADO: Agotado,
  NOBEL: Nobel,
  CINE: Cine,
  VERSIONES: Versiones,
  DUDAS: Dudas,
  MACONDO: Macondo,
  AUDIO: AudioScene,
  OUTRO: Outro,
};
