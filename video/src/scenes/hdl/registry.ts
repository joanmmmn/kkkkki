import React from 'react';
import { Legacy, TitleCard } from './Open';
import { Hook2, Legacy2, Title2 } from './v2Open';
import { Casa2, Escritor2 } from './v2Bio';
import { Abuela2, Carretera2, Vuelta2 } from './v2Road';
import { Amigos2, Cueva2 } from './v2Cave';
import { Deuda2, Mercedes2, Vecinos2 } from './v2Mercedes';
import { Correos, Empeno, Frase, Giro } from './Post';
import { Porrua, Agotado } from './Success';
import { Nobel, Cine } from './Legacy';
import { Versiones, Dudas, Macondo } from './Truth';
import { AudioScene, Outro } from './End';

export const HDL_COMPONENTS: Record<string, React.FC> = {
  HOOK: Hook2,
  LEGACY: Legacy2,
  TITLE: Title2,
  ESCRITOR: Escritor2,
  CASA: Casa2,
  CARRETERA: Carretera2,
  ABUELA: Abuela2,
  VUELTA: Vuelta2,
  CUEVA: Cueva2,
  AMIGOS: Amigos2,
  MERCEDES: Mercedes2,
  VECINOS: Vecinos2,
  DEUDA: Deuda2,
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
