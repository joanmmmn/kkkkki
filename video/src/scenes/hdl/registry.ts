import React from 'react';
import { Hook2, Legacy2, Title2 } from './v2Open';
import { Casa2, Escritor2 } from './v2Bio';
import { Abuela2, Carretera2, Vuelta2 } from './v2Road';
import { Amigos2, Cueva2 } from './v2Cave';
import { Deuda2, Mercedes2, Vecinos2 } from './v2Mercedes';
import { Correos2, Empeno2, Frase2, Giro2 } from './v2Post';
import { Agotado2, Porrua2 } from './v2Success';
import { Cine2, Nobel2 } from './v2Legacy';
import { Dudas2, Macondo2, Versiones2 } from './v2Truth';
import { Audio2, Outro2 } from './v2End';

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
  CORREOS: Correos2,
  EMPENO: Empeno2,
  FRASE: Frase2,
  GIRO: Giro2,
  PORRUA: Porrua2,
  AGOTADO: Agotado2,
  NOBEL: Nobel2,
  CINE: Cine2,
  VERSIONES: Versiones2,
  DUDAS: Dudas2,
  MACONDO: Macondo2,
  AUDIO: Audio2,
  OUTRO: Outro2,
};
